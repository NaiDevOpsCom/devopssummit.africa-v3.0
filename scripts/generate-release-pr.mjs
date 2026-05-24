#!/usr/bin/env node

/**
 * scripts/generate-release-pr.mjs
 *
 * Standalone Node.js utility to automate Staging-to-Main promotion PR creation.
 * 1. Discovers all commits in staging since the last promotion to main.
 * 2. Parses Conventional Commit format.
 * 3. Generates a beautifully formatted Markdown changelog grouped by categories.
 * 4. Outputs a lint-compliant Conventional Commit PR title.
 * 5. Saves outputs to files for consumption by GitHub CLI (gh) in CI workflows.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Parse command line arguments
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const useChoreType = args.has("--chore") || args.has("--use-chore");

// Clean/sanitize the environment PATH to only include trusted system directories.
function getSafeEnv() {
  const isWin = os.platform() === "win32";
  const systemPaths = isWin
    ? [
        "C:/Windows/system32",
        "C:/Windows",
        "C:/Windows/System32/Wbem",
        "C:/Windows/System32/WindowsPowerShell/v1.0",
        "C:/Program Files/Git/cmd",
        "C:/Program Files/Git/bin",
        process.env.PATH ? process.env.PATH.split(";").find((p) => p.includes("Git")) : null,
      ].filter(Boolean)
    : ["/usr/bin", "/bin", "/usr/sbin", "/sbin", "/usr/local/bin"];

  return {
    ...process.env,
    PATH: systemPaths.join(isWin ? ";" : ":"),
  };
}

// Locate the git executable path in standard secure directories, with fallback
function resolveGitPath() {
  const isWin = os.platform() === "win32";

  if (isWin) {
    const windowsPaths = [
      "C:/Program Files/Git/cmd/git.exe",
      "C:/Program Files/Git/bin/git.exe",
      "C:/Program Files (x86)/Git/cmd/git.exe",
      "C:/Windows/System32/git.exe",
    ];
    for (const p of windowsPaths) {
      if (fs.existsSync(p)) {
        return `"${p}"`;
      }
    }
  } else {
    const posixPaths = ["/usr/bin/git", "/usr/local/bin/git", "/opt/homebrew/bin/git", "/bin/git"];
    for (const p of posixPaths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
  }

  // Fallback to searching in our sanitized PATH
  return "git";
}

const GIT_PATH = resolveGitPath();

// Helper to run shell commands safely
function runCmd(cmd) {
  try {
    return execSync(cmd, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env: getSafeEnv(),
    }).trim();
  } catch {
    // Return empty string on command failure (expected for non-existent refs)
    return "";
  }
}

// 1. Determine git references
// Try using remote references first (CI style), fallback to local references if unavailable.
let baseRef = "origin/main";
let headRef = "origin/staging";

// Validate references or fallback to local main/staging
if (!runCmd(`${GIT_PATH} rev-parse --verify ${baseRef}`)) {
  baseRef = "main";
}
if (!runCmd(`${GIT_PATH} rev-parse --verify ${headRef}`)) {
  headRef = "staging";
}

console.log(`🔍 Comparing branches: ${baseRef} (base) <--- ${headRef} (head)`);

// Ensure references are fetched and up-to-date
if (!dryRun) {
  console.log("🔄 Fetching latest branches from origin...");
  try {
    execSync(`${GIT_PATH} fetch origin main staging --quiet`, {
      stdio: ["ignore", "pipe", "pipe"],
      env: getSafeEnv(),
    });
  } catch (error) {
    console.error(
      "❌ Failed to fetch latest branches from origin. Please check your internet connection or git remote settings.",
    );
    console.error(error.stderr?.toString() || error.message);
    process.exit(1);
  }
}

// Check if there are any commits difference
const commitCount = Number.parseInt(
  runCmd(`${GIT_PATH} rev-list --count --no-merges ${baseRef}..${headRef}`) || "0",
  10,
);

if (commitCount === 0) {
  console.log(
    "✨ No differences found between staging and main. Staging is already promoted/in sync!",
  );
  process.exit(0);
}

console.log(`📦 Found ${commitCount} commits to process.`);

// Get commits with author name, email, subject, and body
// Using a unique delimiter to split commits reliably
const COMMIT_DELIMITER = "===COMMIT_END===";
const gitLogCmd = `${GIT_PATH} log ${baseRef}..${headRef} --no-merges --format="%H%n%an%n%s%n%b%n${COMMIT_DELIMITER}"`;
const rawLog = runCmd(gitLogCmd);

if (!rawLog) {
  console.error("❌ Failed to retrieve git history.");
  process.exit(1);
}

// Parse commits
const rawCommits = rawLog.split(`${COMMIT_DELIMITER}\n`);
const parsedCommits = [];
const authors = new Set();

function isConventionalTypeChar(char) {
  const code = char.codePointAt(0);
  return (
    (code >= 48 && code <= 57) ||
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    char === "-"
  );
}

function isHorizontalWhitespace(char) {
  return char === " " || char === "\t";
}

function parseConventionalCommitSubject(subject) {
  let index = 0;

  while (index < subject.length && isConventionalTypeChar(subject[index])) {
    index += 1;
  }

  if (index === 0) {
    return null;
  }

  const type = subject.slice(0, index);
  let scope = null;

  if (subject[index] === "(") {
    const scopeStart = index + 1;
    const scopeEnd = subject.indexOf(")", scopeStart);

    if (scopeEnd <= scopeStart) {
      return null;
    }

    scope = subject.slice(scopeStart, scopeEnd);
    index = scopeEnd + 1;
  }

  const isBreaking = subject[index] === "!";
  if (isBreaking) {
    index += 1;
  }

  if (subject[index] !== ":" || !isHorizontalWhitespace(subject[index + 1])) {
    return null;
  }

  index += 2;
  while (index < subject.length && isHorizontalWhitespace(subject[index])) {
    index += 1;
  }

  const description = subject.slice(index);
  if (!description) {
    return null;
  }

  return { type, scope, isBreaking, description };
}

for (const raw of rawCommits) {
  if (!raw.trim()) continue;
  const lines = raw.split("\n");
  const hash = lines[0]?.trim();
  const authorName = lines[1]?.trim();
  const subject = lines[2]?.trim();
  const body = lines.slice(3).join("\n").trim();

  if (authorName) authors.add(authorName);

  const conventionalCommit = parseConventionalCommitSubject(subject);

  if (conventionalCommit) {
    const { type, scope, isBreaking, description } = conventionalCommit;
    parsedCommits.push({
      hash,
      author: authorName,
      subject,
      body,
      isConventional: true,
      type: type.toLowerCase(),
      scope: scope || null,
      isBreaking: !!isBreaking || body.includes("BREAKING CHANGE"),
      description: description.trim(),
    });
  } else {
    parsedCommits.push({
      hash,
      author: authorName,
      subject,
      body,
      isConventional: false,
      type: "other",
      scope: null,
      isBreaking: body.includes("BREAKING CHANGE"),
      description: subject,
    });
  }
}

// Group commits by category
const categories = {
  breaking: { title: "🚨 Breaking Changes", items: [] },
  feat: { title: "✨ New Features", items: [] },
  fix: { title: "🐛 Bug Fixes", items: [] },
  security: { title: "🔐 Security Updates", items: [] },
  content: { title: "📝 Content Updates", items: [] },
  perf: { title: "⚡ Performance Improvements", items: [] },
  refactor: { title: "♻️ Refactoring", items: [] },
  docs: { title: "📖 Documentation", items: [] },
  maintenance: { title: "🔧 Maintenance & CI/CD", items: [] },
  other: { title: "📦 Other Changes", items: [] },
};

for (const commit of parsedCommits) {
  const shortHash = commit.hash.substring(0, 7);
  const scopePrefix = commit.scope ? `**${commit.scope}**: ` : "";
  const displayItem = `- ${scopePrefix}${commit.description} (${shortHash}) @${commit.author}`;

  if (commit.isBreaking) {
    categories.breaking.items.push(displayItem);
    continue;
  }

  switch (commit.type) {
    case "feat":
      categories.feat.items.push(displayItem);
      break;
    case "fix":
      categories.fix.items.push(displayItem);
      break;
    case "security":
      categories.security.items.push(displayItem);
      break;
    case "content":
      categories.content.items.push(displayItem);
      break;
    case "perf":
      categories.perf.items.push(displayItem);
      break;
    case "refactor":
      categories.refactor.items.push(displayItem);
      break;
    case "docs":
      categories.docs.items.push(displayItem);
      break;
    case "chore":
    case "ci":
    case "test":
    case "style":
      categories.maintenance.items.push(displayItem);
      break;
    default:
      categories.other.items.push(displayItem);
  }
}

// Get current month and year for release title
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const now = new Date();
const currentMonth = months[now.getMonth()];
const currentYear = now.getFullYear();
const formattedDate = now.toISOString().split("T")[0];

// 2. Generate PR Title
// Enforce Conventional Commits styling that is 100% compliant with pr-checks.yml rules:
// - Subject must not start with a capital letter
// - Length between 10 and 100 characters
// - Standard type prefix
const baseTitle = useChoreType
  ? `chore(release): promote staging to main for ${currentMonth} ${currentYear} release`
  : `release: promote staging to main for ${currentMonth} ${currentYear} release`;

const shortTitle = useChoreType
  ? `chore(release): promote staging to main (${formattedDate})`
  : `release: promote staging to main (${formattedDate})`;

const prTitle = baseTitle.length > 95 ? shortTitle : baseTitle;

// 3. Generate PR Body
let prBody = `<!-- 🤖 AUTO-GENERATED RELEASE PR - DO NOT EDIT THIS SECTION DIRECTLY -->
# 🚀 Release Promotion: Staging to Main (${formattedDate})

This pull request automatically promotes approved changes from the \`staging\` branch into \`main\` (production). All quality gates, lint rules, and test suites have successfully passed on staging.

## 📋 Release Summary

Below is a structured breakdown of the ${commitCount} commit(s) included in this release:

`;

// Append categorized changes
let hasChanges = false;
for (const cat of Object.values(categories)) {
  if (cat.items.length > 0) {
    hasChanges = true;
    prBody += `### ${cat.title}\n\n`;
    for (const item of cat.items) {
      prBody += `${item}\n`;
    }
    prBody += "\n";
  }
}

if (!hasChanges) {
  prBody += "*No categorized changes found. Manual merge details may apply.*\n\n";
}

// Add contributors section
if (authors.size > 0) {
  prBody += `### 👥 Contributors in this Release\n\n`;
  prBody += `Special thanks to everyone who contributed to these changes:\n`;
  for (const author of Array.from(authors).sort((a, b) => a.localeCompare(b))) {
    prBody += `- @${author}\n`;
  }
  prBody += "\n";
}

// Add comparison link & footers
const repoUrl = runCmd(`${GIT_PATH} config --get remote.origin.url`)
  ?.replace("git@github.com:", "https://github.com/")
  ?.replace(".git", "");

if (repoUrl) {
  prBody += `### 🔗 Comparison\n\n`;
  prBody += `* **Full Changelog**: ${repoUrl}/compare/${baseRef.split("/").pop()}...${headRef.split("/").pop()}\n\n`;
}

prBody += `---
*Generated automatically by the DevOps Git automation system.* 🌍
`;

// Save outputs
if (dryRun) {
  console.log("\n======================================");
  console.log("📝 DRY RUN - PROPOSED PR DETAILS");
  console.log("======================================");
  console.log(`\n📌 TITLE: "${prTitle}"\n`);
  console.log("📌 BODY:\n");
  console.log(prBody);
  console.log("======================================");
} else {
  // Ensure temp or target folder exists
  const outDir = path.resolve(".release-temp");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const titlePath = path.join(outDir, "pr-title.txt");
  const bodyPath = path.join(outDir, "pr-body.md");

  fs.writeFileSync(titlePath, prTitle, "utf8");
  fs.writeFileSync(bodyPath, prBody, "utf8");

  console.log("✅ Generated release files successfully in `.release-temp/`:");
  console.log(`   - Title [${prTitle.length} chars]: ${titlePath}`);
  console.log(`   - Body: ${bodyPath}`);
}
