module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run preview -- --port 8080 --host 127.0.0.1",
      startServerReadyPattern: "Local:",
      startServerReadyTimeout: 60000,
      isSinglePageApplication: true,
      url: [
        "http://127.0.0.1:8080/",
        "http://127.0.0.1:8080/about",
        "http://127.0.0.1:8080/schedule",
        "http://127.0.0.1:8080/past-summits",
      ],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.9 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "total-blocking-time": ["warn", { maxNumericValue: 200 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 1800 }],
        "is-on-https": "off",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
