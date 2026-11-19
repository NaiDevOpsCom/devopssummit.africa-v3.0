import { describe, expect, it } from "vitest";
import {
  advisoryId,
  collectBlockingAdvisories,
  evaluateAudit,
  loadAllowlist,
} from "./audit-gate.mjs";

const PICOMATCH = {
  id: "GHSA-FC5Q-39XC-VJPF",
  url: "https://github.com/advisories/GHSA-fc5q-39xc-vjpf",
  title: "picomatch vulnerable to ReDoS",
  package: "picomatch",
};

function report(vulnerabilities) {
  return { vulnerabilities, metadata: { vulnerabilities: {} } };
}

function advisoryVia({ url = PICOMATCH.url, name = "picomatch" } = {}) {
  return {
    source: 1247710,
    name,
    dependency: name,
    title: "picomatch vulnerable to ReDoS",
    url,
    severity: "high",
    range: "<=4.0.7",
  };
}

describe("advisoryId", () => {
  it("extracts and normalises a GHSA id from an advisory URL", () => {
    expect(advisoryId(PICOMATCH.url)).toBe(PICOMATCH.id);
  });

  it("returns null for non-advisory URLs", () => {
    expect(advisoryId("https://example.com")).toBeNull();
    expect(advisoryId(undefined)).toBeNull();
  });
});

describe("collectBlockingAdvisories", () => {
  it("collects a high advisory once, even when several packages inherit it", () => {
    const data = report({
      picomatch: { severity: "high", via: [advisoryVia()] },
      micromatch: { severity: "high", via: ["picomatch"] },
      glob: { severity: "high", via: ["micromatch"] },
    });

    expect(collectBlockingAdvisories(data)).toEqual([
      expect.objectContaining({ id: PICOMATCH.id, package: "picomatch", severity: "high" }),
    ]);
  });

  it("ignores moderate and low advisories", () => {
    const data = report({
      minimatch: {
        severity: "moderate",
        via: [{ ...advisoryVia({ name: "minimatch" }), severity: "moderate" }],
      },
      postcss: {
        severity: "low",
        via: [{ ...advisoryVia({ name: "postcss" }), severity: "low" }],
      },
    });

    expect(collectBlockingAdvisories(data)).toEqual([]);
  });

  it("fails closed when blocking severities cannot be attributed to any advisory", () => {
    const data = report({ mystery: { severity: "critical", via: [] } });

    expect(collectBlockingAdvisories(data)).toEqual([
      expect.objectContaining({ id: null, package: "(unattributed)", severity: "high" }),
    ]);
  });

  it("does not fail closed for inherited severities when the owning advisory is present", () => {
    const data = report({
      picomatch: { severity: "high", via: [advisoryVia()] },
      glob: { severity: "high", via: ["picomatch"] },
    });

    expect(collectBlockingAdvisories(data)).toEqual([
      expect.objectContaining({ package: "picomatch" }),
    ]);
  });

  it("handles an empty or malformed report", () => {
    expect(collectBlockingAdvisories({})).toEqual([]);
    expect(collectBlockingAdvisories(null)).toEqual([]);
  });
});

describe("evaluateAudit", () => {
  const now = new Date("2026-11-18T00:00:00Z");
  const highReport = report({
    picomatch: { severity: "high", via: [advisoryVia()] },
  });

  it("blocks a high advisory when the allowlist is empty", () => {
    const { blocking, suppressed } = evaluateAudit(highReport, [], now);

    expect(blocking).toHaveLength(1);
    expect(suppressed).toHaveLength(0);
  });

  it("suppresses a matching advisory with a future expiry", () => {
    const { blocking, suppressed } = evaluateAudit(
      highReport,
      [{ ...PICOMATCH, expires: "2026-12-02", reason: "no patched release" }],
      now,
    );

    expect(blocking).toHaveLength(0);
    expect(suppressed).toHaveLength(1);
  });

  it("stops suppressing once the expiry has passed", () => {
    const { blocking, expired } = evaluateAudit(
      highReport,
      [{ ...PICOMATCH, expires: "2026-11-17", reason: "no patched release" }],
      now,
    );

    expect(blocking).toHaveLength(1);
    expect(expired).toHaveLength(1);
  });

  it("does not suppress on the expiry date itself", () => {
    const { blocking } = evaluateAudit(
      highReport,
      [{ ...PICOMATCH, expires: "2026-11-18", reason: "no patched release" }],
      now,
    );

    expect(blocking).toHaveLength(1);
  });

  it("does not suppress a different package or a different advisory id", () => {
    const wrongPackage = evaluateAudit(
      highReport,
      [{ ...PICOMATCH, package: "glob", expires: "2026-12-02", reason: "x" }],
      now,
    );
    const wrongId = evaluateAudit(
      highReport,
      [{ ...PICOMATCH, id: "GHSA-AAAA-BBBB-CCCC", expires: "2026-12-02", reason: "x" }],
      now,
    );

    expect(wrongPackage.blocking).toHaveLength(1);
    expect(wrongId.blocking).toHaveLength(1);
  });

  it("ignores inactive entries and entries with an unparsable expiry", () => {
    const inactive = evaluateAudit(
      highReport,
      [{ ...PICOMATCH, expires: "2026-12-02", reason: "x", active: false }],
      now,
    );
    const badDate = evaluateAudit(
      highReport,
      [{ ...PICOMATCH, expires: "soon", reason: "x" }],
      now,
    );

    expect(inactive.blocking).toHaveLength(1);
    expect(badDate.blocking).toHaveLength(1);
  });

  it("reports custom entries that match nothing", () => {
    const unused = { ...PICOMATCH, id: "GHSA-AAAA-BBBB-CCCC", expires: "2026-12-02" };
    const { unmatched } = evaluateAudit(highReport, [unused], now);

    expect(unmatched).toEqual([unused]);
  });
});

describe("loadAllowlist", () => {
  it("returns no exceptions when the file does not exist", () => {
    expect(loadAllowlist("/tmp/definitely-not-a-real-allowlist.json")).toEqual([]);
  });

  it("loads the committed allowlist", () => {
    expect(Array.isArray(loadAllowlist(".audit-allowlist.json"))).toBe(true);
  });
});
