#!/usr/bin/env node
/**
 * update-node-engine.mjs
 *
 * Fetches the latest Node.js LTS patch releases from nodejs.org and updates:
 *   1. engines.node in package.json
 *   2. NODE_VERSION env var in .github/workflows/ci.yml
 *   3. .nvmrc (created / updated to the active LTS version)
 *
 * Exit codes:
 *   0 — no changes needed (already up to date)
 *   1 — changes were written (workflow should open a PR)
 *
 * Usage:
 *   node scripts/update-node-engine.mjs
 *   node scripts/update-node-engine.mjs --dry-run   # prints diff, no writes
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ── Config ────────────────────────────────────────────────────────────────────

/**
 * LTS major versions this project actively supports.
 *
 * Rules:
 *  - "maintenance" = the older LTS (still receiving security fixes but not new
 *    features). Minimum version we still allow in package.json#engines.
 *  - "active"      = the recommended LTS for local dev and CI.
 *
 * Update ONLY when a new LTS line enters Active status or an old one goes EOL.
 * The patch version within each major is updated automatically by this script.
 */
const SUPPORTED_LTS_MAJORS = {
  maintenance: 24, // Node 24 "Krypton" — Active LTS (now minimum supported)
  active: 24, // Node 24 "Krypton" — Active LTS
};

const NODE_RELEASE_API = "https://nodejs.org/dist/index.json";

// ── Paths ─────────────────────────────────────────────────────────────────────

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, "..");

const PATHS = {
  packageJson: resolve(ROOT, "package.json"),
  ciWorkflow: resolve(ROOT, ".github/workflows/ci.yml"),
  nvmrc: resolve(ROOT, ".nvmrc"),
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const isDryRun = process.argv.includes("--dry-run");

/** Fetch the full Node.js release index from nodejs.org */
async function fetchNodeReleases() {
  const res = await fetch(NODE_RELEASE_API);
  if (!res.ok) {
    throw new Error(`Failed to fetch Node.js release index: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * From the full release list, find the latest patch version for a given major.
 * Only considers releases where lts !== false (i.e., officially in LTS).
 *
 * @param {Array} releases  - Full array from nodejs.org/dist/index.json
 * @param {number} major    - The major version to look for (e.g. 22)
 * @returns {{ version: string, major: number, minor: number, patch: number } | null}
 */
function getLatestLtsPatch(releases, major) {
  const ltsReleases = releases
    .filter((r) => {
      const parsed = parseVersion(r.version);
      return (
        parsed !== null && parsed.major === major && r.lts !== false // lts is either false or a codename string
      );
    })
    .sort((a, b) => {
      const pa = parseVersion(a.version);
      const pb = parseVersion(b.version);
      if (pb.minor !== pa.minor) return pb.minor - pa.minor;
      return pb.patch - pa.patch;
    });

  if (!ltsReleases.length) return null;

  const latest = ltsReleases[0];
  return {
    ...parseVersion(latest.version),
    raw: latest.version.replace(/^v/, ""), // e.g. "24.16.0"
    codename: latest.lts, // e.g. "Krypton"
    security: latest.security,
    date: latest.date,
  };
}

/**
 * Parse a version string (e.g. "v22.12.0" or "22.12.0") into its parts.
 * @param {string} version
 * @returns {{ major: number, minor: number, patch: number } | null}
 */
function parseVersion(version) {
  const match = version.replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

/**
 * Compare two raw version strings (e.g. "22.12.0" vs "22.22.3").
 * @returns {boolean} true if a < b (i.e. b is newer)
 */
function isNewer(current, latest) {
  const c = parseVersion(current);
  const l = parseVersion(latest);
  if (!c || !l) return false;
  if (l.major !== c.major) return l.major > c.major;
  if (l.minor !== c.minor) return l.minor > c.minor;
  return l.patch > c.patch;
}

// ── package.json engine field ─────────────────────────────────────────────────

/**
 * Build the new engines.node value.
 *
 * Format: "^{maintenanceVersion} || ^{activeVersion}"
 * e.g.   "^22.22.3 || ^24.16.0"
 *
 * Using `^` (caret) allows patch + minor bumps within each major.
 * This is intentional: the engines field communicates the minimum tested
 * version, not a strict pin. Caret allows users on any 22.x >= 22.22.3 to run
 * the project without errors, which is the right UX for open source contributors.
 */
function buildEnginesString(maintenanceVersion, activeVersion) {
  if (maintenanceVersion === activeVersion) {
    return `^${activeVersion}`;
  }
  return `^${maintenanceVersion} || ^${activeVersion}`;
}

/**
 * Extract the current minimum patch version for a given major from the engines
 * string. Returns null if the major is not found.
 *
 * Handles patterns like:
 *  - "^22.12.0 || ^24.16.0"
 *  - "^20.19.0 || >=22.12.0"
 *  - ">=22.12.0"
 */
function extractVersionFromEngines(enginesString, major) {
  // Match patterns: ^22.x.x, >=22.x.x, ==22.x.x, ~22.x.x
  const regex = new RegExp(`(?:^|\\|\\|)\\s*[~^>=]*${major}\\.(\\d+\\.\\d+)`, "g");
  const match = regex.exec(enginesString);
  if (!match) return null;
  return `${major}.${match[1]}`;
}

// ── ci.yml NODE_VERSION ───────────────────────────────────────────────────────

/**
 * Read the current NODE_VERSION from ci.yml.
 * Looks for the line: `  NODE_VERSION: "22"`
 */
function getCurrentCiNodeVersion(ciContent) {
  const match = ciContent.match(/NODE_VERSION:\s*["']?(\d+)["']?/);
  return match ? match[1] : null;
}

/**
 * Update NODE_VERSION in ci.yml content.
 * Only replaces the first env-level declaration (top of file).
 */
function updateCiNodeVersion(ciContent, newMajor) {
  return ciContent.replace(/(NODE_VERSION:\s*["']?)(\d+)(["']?)/, `$1${newMajor}$3`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔍 Fetching Node.js release index from nodejs.org...");
  const releases = await fetchNodeReleases();

  const { maintenance: maintenanceMajor, active: activeMajor } = SUPPORTED_LTS_MAJORS;

  // ── Find latest patches ─────────────────────────────────────────────────────
  const maintenanceLts = getLatestLtsPatch(releases, maintenanceMajor);
  const activeLts = getLatestLtsPatch(releases, activeMajor);

  if (!maintenanceLts) {
    console.error(`❌ Could not find an LTS release for Node ${maintenanceMajor}`);
    process.exitCode = 2;
    return;
  }
  if (!activeLts) {
    console.error(`❌ Could not find an LTS release for Node ${activeMajor}`);
    process.exitCode = 2;
    return;
  }

  console.log(
    `📦 Latest Node ${activeMajor} (${activeLts.codename}): v${activeLts.raw}${activeLts.security ? " [security]" : ""}`,
  );
  if (maintenanceMajor !== activeMajor) {
    console.log(
      `📦 Latest Node ${maintenanceMajor} (${maintenanceLts.codename}): v${maintenanceLts.raw}${maintenanceLts.security ? " [security]" : ""}`,
    );
  }

  // ── Read current package.json ───────────────────────────────────────────────
  const pkgRaw = readFileSync(PATHS.packageJson, "utf8");
  const pkg = JSON.parse(pkgRaw);
  const currentEngines = pkg.engines?.node ?? "";

  const currentMaintenanceVersion = extractVersionFromEngines(currentEngines, maintenanceMajor);
  const currentActiveVersion = extractVersionFromEngines(currentEngines, activeMajor);

  console.log(`\n📄 Current engines.node: "${currentEngines}"`);
  console.log(`   ↳ Node ${activeMajor} min: ${currentActiveVersion ?? "(not tracked)"}`);
  if (maintenanceMajor !== activeMajor) {
    console.log(`   ↳ Node ${maintenanceMajor} min: ${currentMaintenanceVersion ?? "(not tracked)"}`);
  }

  // ── Determine if updates are needed ────────────────────────────────────────
  let engineUpdateNeeded = false;

  const activeNeedsUpdate = !currentActiveVersion || isNewer(currentActiveVersion, activeLts.raw);

  const maintenanceNeedsUpdate = maintenanceMajor !== activeMajor &&
    (!currentMaintenanceVersion || isNewer(currentMaintenanceVersion, maintenanceLts.raw));

  if (activeNeedsUpdate) {
    console.log(`⬆️  Node ${activeMajor}: ${currentActiveVersion ?? "not set"} → ${activeLts.raw}`);
    engineUpdateNeeded = true;
  }
  if (maintenanceNeedsUpdate) {
    console.log(
      `\n⬆️  Node ${maintenanceMajor}: ${currentMaintenanceVersion ?? "not set"} → ${maintenanceLts.raw}`,
    );
    engineUpdateNeeded = true;
  }

  const desiredEnginesString = buildEnginesString(maintenanceLts.raw, activeLts.raw);
  if (currentEngines !== desiredEnginesString) {
    console.log(`⬆️  engines.node: "${currentEngines}" → "${desiredEnginesString}"`);
    engineUpdateNeeded = true;
  }

  // ── Read current ci.yml ─────────────────────────────────────────────────────
  const ciContent = readFileSync(PATHS.ciWorkflow, "utf8");
  const currentCiMajor = getCurrentCiNodeVersion(ciContent);
  const ciNeedsUpdate = currentCiMajor && currentCiMajor !== String(activeMajor);

  if (ciNeedsUpdate) {
    console.log(`⬆️  ci.yml NODE_VERSION: "${currentCiMajor}" → "${activeMajor}"`);
  }

  // ── Check .nvmrc ────────────────────────────────────────────────────────────
  const currentNvmrc = existsSync(PATHS.nvmrc) ? readFileSync(PATHS.nvmrc, "utf8").trim() : null;
  const newNvmrc = activeLts.raw;
  const nvmrcNeedsUpdate = currentNvmrc !== newNvmrc;

  if (nvmrcNeedsUpdate) {
    console.log(`⬆️  .nvmrc: ${currentNvmrc ?? "(missing)"} → ${newNvmrc}`);
  }

  // ── Check if anything changed ──────────────────────────────────────────────
  if (!engineUpdateNeeded && !ciNeedsUpdate && !nvmrcNeedsUpdate) {
    console.log("\n✅ Everything is already up to date. No changes needed.");
    // exitCode defaults to 0 — no explicit call needed
    return;
  }

  // ── Apply updates ──────────────────────────────────────────────────────────
  if (isDryRun) {
    console.log("\n🔎 Dry-run mode — no files written.");
    console.log(
      `   engines.node would be: "${buildEnginesString(maintenanceLts.raw, activeLts.raw)}"`,
    );
    console.log(`   NODE_VERSION would be: "${activeMajor}"`);
    console.log(`   .nvmrc would contain: "${newNvmrc}"`);
    // Signal that changes would be made (exit code 1)
    process.exitCode = 1;
    return;
  }

  // 1. Update package.json
  if (engineUpdateNeeded) {
    const newEnginesString = buildEnginesString(maintenanceLts.raw, activeLts.raw);
    if (!pkg.engines) pkg.engines = {};
    pkg.engines.node = newEnginesString;

    // Preserve the original formatting (2-space indent, trailing newline)
    const newPkgRaw = JSON.stringify(pkg, null, 2) + (pkgRaw.endsWith("\n") ? "\n" : "");
    writeFileSync(PATHS.packageJson, newPkgRaw, "utf8");
    console.log(`\n✏️  Updated package.json engines.node: "${newEnginesString}"`);
  }

  // 2. Update ci.yml
  if (ciNeedsUpdate) {
    const newCiContent = updateCiNodeVersion(ciContent, String(activeMajor));
    writeFileSync(PATHS.ciWorkflow, newCiContent, "utf8");
    console.log(`✏️  Updated ci.yml NODE_VERSION: "${activeMajor}"`);
  }

  // 3. Update/create .nvmrc
  if (nvmrcNeedsUpdate) {
    writeFileSync(PATHS.nvmrc, newNvmrc + "\n", "utf8");
    console.log(`✏️  Updated .nvmrc: "${newNvmrc}"`);
  }

  // ── Output summary for GitHub Actions step summary ─────────────────────────
  const summary = [
    "## Node.js Engine Update",
    "",
    "| File | Change |",
    "| ---- | ------ |",
    engineUpdateNeeded
      ? `| \`package.json\` | \`engines.node\` → \`${buildEnginesString(maintenanceLts.raw, activeLts.raw)}\` |`
      : null,
    ciNeedsUpdate ? `| \`ci.yml\` | \`NODE_VERSION\` → \`${activeMajor}\` |` : null,
    nvmrcNeedsUpdate ? `| \`.nvmrc\` | \`${newNvmrc}\` |` : null,
    "",
    "### Release details",
    `- Node ${activeMajor} (${activeLts.codename}) latest: **v${activeLts.raw}** (${activeLts.date})${activeLts.security ? " 🔐 security release" : ""}`,
    maintenanceMajor !== activeMajor
      ? `- Node ${maintenanceMajor} (${maintenanceLts.codename}) latest: **v${maintenanceLts.raw}** (${maintenanceLts.date})${maintenanceLts.security ? " 🔐 security release" : ""}`
      : null,
  ]
    .filter((l) => l !== null)
    .join("\n");

  // Write to GITHUB_STEP_SUMMARY if available
  if (process.env.GITHUB_STEP_SUMMARY) {
    const { appendFileSync } = await import("node:fs");
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + "\n", "utf8");
  }

  // Set output variables for use in subsequent workflow steps
  if (process.env.GITHUB_OUTPUT) {
    const { appendFileSync } = await import("node:fs");
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      [
        `maintenance_version=${maintenanceLts.raw}`,
        `active_version=${activeLts.raw}`,
        `active_major=${activeMajor}`,
        `has_security=${maintenanceLts.security || activeLts.security ? "true" : "false"}`,
        `changes_made=true`,
      ].join("\n") + "\n",
      "utf8",
    );
  }

  console.log("\n✅ Files updated successfully.");
  // Exit code 1 = changes were made (workflow uses this to decide whether to open a PR).
  // Use exitCode + return so the event loop drains cleanly (avoids Windows UV_HANDLE_CLOSING
  // assertion caused by fetch() keeping a TCP handle open when process.exit() is called).
  process.exitCode = 1;
}

main().catch((err) => {
  console.error("💥 Unexpected error:", err);
  process.exitCode = 2;
});
