// src/config/validateEnv.ts
import * as Env from "./env";

/**
 * Call this once at app startup (main.tsx).
 * Validates all required env vars are present and correctly formatted.
 *
 * Behaviour by environment:
 *   Security violations  → always throw (all environments)
 *   Validation errors    → throw for any missing required vars (all environments)
 *   Missing optional vars → warn only in production where they matter
 */

const checkImageKitContext = (errors: string[]): void => {
  if (Env.IMAGEKIT_URL_ENDPOINT === "") {
    errors.push("VITE_IMAGEKIT_URL_ENDPOINT is missing.");
  } else {
    try {
      new URL(Env.IMAGEKIT_URL_ENDPOINT);
    } catch {
      errors.push(`VITE_IMAGEKIT_URL_ENDPOINT is not a valid URL: "${Env.IMAGEKIT_URL_ENDPOINT}"`);
    }
  }

  if (Env.IMAGEKIT_PUBLIC_KEY === "") {
    errors.push("VITE_IMAGEKIT_PUBLIC_KEY is missing.");
  }
};

const checkAppEnvironment = (errors: string[]): void => {
  const validEnvs = ["production", "staging", "preview", "development"];
  const rawAppEnv = import.meta.env.VITE_APP_ENV;
  if (
    rawAppEnv !== undefined &&
    typeof rawAppEnv === "string" &&
    rawAppEnv !== "" &&
    validEnvs.includes(rawAppEnv) === false
  ) {
    errors.push(
      `VITE_APP_ENV "${rawAppEnv}" is not a valid value. ` +
        `Must be one of: ${validEnvs.join(", ")}`,
    );
  }
};

const checkProductionAlerts = (warnings: string[]): void => {
  if (Env.IS_PRODUCTION === false) return;

  if (Env.APP_VERSION === "" || Env.APP_VERSION === "0.0.0") {
    warnings.push(
      "VITE_APP_VERSION is not set in production. " +
        "Set it in Cloudflare Pages dashboard for release tracking.",
    );
  }
};

const dangerousPatterns = [
  { pattern: /^sk_/, name: "Generic secret key (sk_...)" },
  { pattern: /^SG\./, name: "SendGrid API key" },
  { pattern: /^AKIA/, name: "AWS Access Key ID" },
  { pattern: /^ghp_|^ghs_|^gho_/, name: "GitHub token" },
  { pattern: /^private_/, name: "ImageKit private key" },
  { pattern: /^AIza/, name: "Google API key" },
  { pattern: /-----BEGIN PRIVATE KEY-----/, name: "Private key (PEM)" },
  { pattern: /sk_(live|test)_/, name: "Stripe secret key" },
  { pattern: /^[a-zA-Z0-9+/]{40}$/, name: "AWS secret access key pattern" },
  { pattern: /^SK[a-f0-9]{32}$/, name: "Twilio API secret" },
];

// Cloudflare Pages build-time variables that are safe to expose via VITE_ prefix
const safeVariables = new Set(["VITE_CF_PAGES_COMMIT_SHA", "VITE_GIT_COMMIT_SHA"]);

const isPublicVariable = (key: string) => {
  const allowedPrefixes = [
    "VITE_API_",
    "VITE_APP_",
    "VITE_IMAGEKIT_URL_ENDPOINT",
    "VITE_IMAGEKIT_PUBLIC_KEY",
    "VITE_STRIPE_PUBLISHABLE_KEY",
    "VITE_SENTRY_DSN",
    "VITE_ENABLE_DEVTOOLS",
    "VITE_DEBUG_IMAGES",
  ];
  return allowedPrefixes.some((prefix) => key === prefix || key.startsWith(prefix));
};

const testSecurityVariables = (errors: string[], key: string, value: unknown): void => {
  if (typeof value !== "string") return;
  if (key.startsWith("VITE_") === false) return;
  if (safeVariables.has(key)) return;

  let foundDangerous = false;
  dangerousPatterns.forEach(({ pattern, name }) => {
    if (pattern.test(value)) {
      foundDangerous = true;
      errors.push(
        `SECURITY: ${key} appears to contain a ${name}. ` +
          `Secret keys must NEVER be prefixed with VITE_ — ` +
          `they are embedded in the client bundle and publicly visible.`,
      );
    }
  });

  if (!foundDangerous && !isPublicVariable(key)) {
    console.warn(
      `SECURITY WARNING: Unrecognized public variable ${key}. Ensure this is not a secret.`,
    );
  }
};

const checkSecurity = (errors: string[]): void => {
  Object.entries(import.meta.env).forEach(([key, value]) => {
    testSecurityVariables(errors, key, value);
  });
};

const reportWarnings = (warnings: string[]): void => {
  if (warnings.length === 0) return;
  const list = warnings.map((w) => "• " + w).join("\n");
  const message = "[Env Warnings]\n\n" + list;
  console.warn(message);
};

const reportErrors = (errors: string[]): void => {
  if (errors.length === 0) return;

  const list = errors.map((e) => "• " + e).join("\n");
  const message = "[Env Validation Failed]\n\n" + list;

  // Throw for any validation error (not just security ones) to enforce required vars
  throw new Error(message);
};

export const validateEnv = (): void => {
  const errors: string[] = [];
  const warnings: string[] = [];

  checkImageKitContext(errors);
  checkAppEnvironment(errors);
  checkProductionAlerts(warnings);
  checkSecurity(errors);

  reportWarnings(warnings);
  reportErrors(errors);
};
