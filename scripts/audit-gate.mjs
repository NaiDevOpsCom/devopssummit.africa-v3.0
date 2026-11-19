#!/usr/bin/env node
/**
 * Dependency audit gate.
 *
 * Fails the build when `npm audit` reports a high or critical advisory, unless
 * that advisory is listed in .audit-allowlist.json with a future expiry date.
 *
 * Why this exists: on 2026-11-18 a single high advisory (GHSA-fc5q-39xc-vjpf,
 * picomatch) had no patched release, so `npm audit --audit-level=high` failed
 * for every branch and PR for two days. The only ways out were to wait, to
 * weaken the gate globally, or to edit CI ad hoc. This gate provides a fourth
 * option: a reviewed, per-advisory exception that expires on its own.
 *
 * Production dependencies are still audited separately in CI with a plain
 * `npm audit --omit=dev --audit-level=high`, which accepts no exceptions.
 *
 * Usage:
 *   node scripts/audit-gate.mjs [--config <path>]
 *
 * Exit codes: 0 = no blocking advisories, 1 = blocking advisories or error.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const BLOCKING_SEVERITIES = ["high", "critical"];
export const DEFAULT_CONFIG_PATH = ".audit-allowlist.json";

/**
 * Extract the GHSA identifier from an advisory URL.
 * @param {unknown} url
 * @returns {string | null}
 */
export function advisoryId(url) {
  if (typeof url !== "string") return null;
  const match = url.match(/GHSA-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}/i);
  return match ? match[0].toUpperCase() : null;
}

/**
 * Collect every unique high/critical advisory in an `npm audit --json` report.
 *
 * npm reports a vulnerable package once per package, and each entry's `via`
 * array holds either the advisory object that affects it or the name of a
 * dependency that pulls it in. Counting unique advisory objects keeps a single
 * advisory from being reported once per package in its dependency chain.
 *
 * @param {any} report
 * @returns {Array<{ id: string | null, package: string, severity: string, title: string, url: string | null }>}
 */
export function collectBlockingAdvisories(report) {
  /** @type {Map<string, any>} */
  const advisories = new Map();
  let hasUnattributed = false;

  for (const [packageName, vulnerability] of Object.entries(report?.vulnerabilities ?? {})) {
    const severity = String(vulnerability?.severity ?? "").toLowerCase();
    if (!BLOCKING_SEVERITIES.includes(severity)) continue;

    const viaObjects = (vulnerability?.via ?? []).filter((via) => via && typeof via === "object");

    if (viaObjects.length === 0) {
      // Severity is inherited from a dependency (npm reports the advisory on
      // the package that owns it). Track it only so a report we cannot
      // attribute at all still fails closed below.
      hasUnattributed = true;
      continue;
    }

    for (const via of viaObjects) {
      const id = advisoryId(via.url) ?? `source:${via.source ?? via.title ?? "unknown"}`;
      const advisoryPackage = via.name ?? packageName;
      advisories.set(`${id}:${advisoryPackage}`, {
        id: advisoryId(via.url),
        package: advisoryPackage,
        severity: String(via.severity ?? severity).toLowerCase(),
        title: via.title ?? "(no title)",
        url: via.url ?? null,
      });
    }
  }

  if (advisories.size === 0 && hasUnattributed) {
    // Fail closed: blocking severities exist but none can be attributed to an
    // advisory, so no allowlist entry could ever match them.
    advisories.set("unknown:unattributed", {
      id: null,
      package: "(unattributed)",
      severity: "high",
      title: "Unattributed high/critical advisory",
      url: null,
    });
  }

  return [...advisories.values()];
}

/**
 * Decide whether one allowlist entry covers one advisory.
 * @param {any} entry
 * @param {any} advisory
 */
function matchesAdvisory(entry, advisory) {
  if (!entry || typeof entry !== "object" || entry.active === false) return false;
  if (entry.package !== advisory.package) return false;
  if (!entry.id || !advisory.id) return false;
  return String(entry.id).toUpperCase() === advisory.id;
}

/**
 * Evaluate an audit report against an allowlist.
 *
 * Expiry is mandatory and fail-closed: an entry with a missing, unparsable or
 * past expiry suppresses nothing.
 *
 * @param {any} report
 * @param {any[]} allowlist
 * @param {Date} now
 */
export function evaluateAudit(report, allowlist = [], now = new Date()) {
  const advisories = collectBlockingAdvisories(report);
  /** @type {any[]} */ const blocking = [];
  /** @type {any[]} */ const suppressed = [];
  /** @type {any[]} */ const expired = [];
  const matchedEntries = new Set();

  for (const advisory of advisories) {
    let suppressor = null;

    for (const [index, entry] of allowlist.entries()) {
      if (!matchesAdvisory(entry, advisory)) continue;
      matchedEntries.add(index);

      const expires = Date.parse(entry?.expires ?? "");
      if (!Number.isNaN(expires) && expires > now.getTime()) {
        suppressor = entry;
        break;
      }
      expired.push({ advisory, entry });
    }

    if (suppressor) suppressed.push({ advisory, entry: suppressor });
    else blocking.push(advisory);
  }

  const unmatched = allowlist.filter((_entry, index) => !matchedEntries.has(index));

  return { blocking, suppressed, expired, unmatched };
}

/**
 * Load and validate the allowlist file. A missing file means "no exceptions".
 * A malformed file is an error: silently ignoring it would widen the gate.
 */
export function loadAllowlist(configPath = DEFAULT_CONFIG_PATH) {
  let raw;
  try {
    raw = readFileSync(configPath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw new Error(`Cannot read ${configPath}: ${error.message}`, { cause: error });
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON in ${configPath}: ${error.message}`, { cause: error });
  }

  const allow = parsed?.allow ?? [];
  if (!Array.isArray(allow)) throw new Error(`${configPath}: "allow" must be an array`);

  for (const [index, entry] of allow.entries()) {
    if (!entry || typeof entry !== "object") {
      throw new Error(`${configPath}: allow[${index}] must be an object`);
    }
    for (const field of ["package", "id", "expires", "reason"]) {
      if (typeof entry[field] !== "string" || entry[field].length === 0) {
        throw new Error(`${configPath}: allow[${index}] is missing "${field}"`);
      }
    }
    if (Number.isNaN(Date.parse(entry.expires))) {
      throw new Error(`${configPath}: allow[${index}].expires is not a valid date`);
    }
  }

  return allow;
}

/** Run `npm audit --json` and return the parsed report. */
function runNpmAudit() {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npm, ["audit", "--json"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });

  if (result.error) throw new Error(`Failed to run npm audit: ${result.error.message}`);

  try {
    return JSON.parse(result.stdout ?? "");
  } catch {
    throw new Error(
      `npm audit did not return JSON (exit ${result.status}).\n` +
        `--- stdout ---\n${result.stdout ?? ""}\n--- stderr ---\n${result.stderr ?? ""}`,
    );
  }
}

function parseArgs(argv) {
  const configIndex = argv.indexOf("--config");
  if (configIndex === -1) return { configPath: DEFAULT_CONFIG_PATH };
  const configPath = argv[configIndex + 1];
  if (!configPath) throw new Error("--config requires a path");
  return { configPath };
}

function main() {
  const { configPath } = parseArgs(process.argv.slice(2));
  const allowlist = loadAllowlist(configPath);
  const report = runNpmAudit();
  const { blocking, suppressed, expired, unmatched } = evaluateAudit(report, allowlist);

  for (const { advisory, entry } of suppressed) {
    console.log(
      `ℹ️  Allowed until ${entry.expires}: ${advisory.id} ${advisory.package} (${entry.reason})`,
    );
  }

  for (const { advisory, entry } of expired) {
    console.error(
      `⚠️  Expired exception (${entry.expires}): ${advisory.id} ${advisory.package} — advisory is enforced again`,
    );
  }

  for (const entry of unmatched) {
    console.warn(
      `⚠️  Unused exception: ${entry.id} ${entry.package} — remove it from ${configPath}`,
    );
  }

  if (blocking.length > 0) {
    console.error(
      `\n❌ ${blocking.length} blocking advisor${blocking.length === 1 ? "y" : "ies"}:`,
    );
    for (const advisory of blocking) {
      console.error(`   [${advisory.severity}] ${advisory.package}: ${advisory.title}`);
      if (advisory.id) console.error(`   ${advisory.id} ${advisory.url ?? ""}`.trimEnd());
    }
    console.error(
      `\nFix the dependency, or add a time-boxed entry to ${configPath} if no patched ` +
        `release exists. Exceptions must include a reason and an expiry date.`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `✅ No blocking advisories${suppressed.length ? ` (${suppressed.length} allowlisted)` : ""}.`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(`❌ Audit gate error: ${error.message}`);
    process.exitCode = 1;
  }
}
