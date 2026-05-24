import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import { compression } from "vite-plugin-compression2";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

// ── Chunk map ──────────────────────────────────────────
// Key   = chunk name suffix  (produces vendor-<key>.js)
// Value = array of node_modules substrings to match
// Order matters — first match wins
const VENDOR_CHUNKS: Record<string, string[]> = {
  // ── Core React runtime ───────────────────────────────
  // Smallest, most stable — users cache this forever
  react: ["node_modules/react/", "node_modules/react-dom/", "node_modules/scheduler/"],

  // ── Routing ──────────────────────────────────────────
  router: ["node_modules/react-router", "node_modules/@remix-run/"],

  // ── Animation ────────────────────────────────────────
  // Isolated so animation lib updates don't bust app cache
  motion: ["node_modules/framer-motion"],

  // ── Radix UI ─────────────────────────────────────────
  // All shadcn primitives — changes only on shadcn updates
  radix: ["node_modules/@radix-ui/"],

  // ── Data fetching ─────────────────────────────────────
  query: ["node_modules/@tanstack/"],

  // ── Charts + D3 internals ─────────────────────────────
  charts: [
    "node_modules/recharts",
    "node_modules/d3-",
    "node_modules/internmap",
    "node_modules/robust-predicates",
    "node_modules/victory-",
  ],

  // ── Security — DOMPurify ──────────────────────────────
  // Isolated for security audit visibility
  dompurify: ["node_modules/dompurify"],

  // ── Forms (ready for when you add ticket/contact forms)
  forms: ["node_modules/react-hook-form", "node_modules/@hookform", "node_modules/zod"],

  // ── UI utilities ──────────────────────────────────────
  // clsx + tailwind-merge + cva used in nearly every component
  "styling-utils": [
    "node_modules/class-variance-authority",
    "node_modules/clsx",
    "node_modules/tailwind-merge",
  ],

  icons: ["node_modules/lucide-react"],

  carousel: ["node_modules/embla-carousel"],

  virtual: ["node_modules/react-window", "node_modules/react-virtualized-auto-sizer"],

  dates: ["node_modules/date-fns", "node_modules/react-day-picker"],

  cmdk: ["node_modules/cmdk"],

  imagekit: ["node_modules/imagekitio-react", "node_modules/imagekit-javascript"],

  toasts: ["node_modules/sonner"],

  themes: ["node_modules/next-themes"],

  drawer: ["node_modules/vaul"],

  otp: ["node_modules/input-otp"],

  panels: ["node_modules/react-resizable-panels"],

  helmet: ["node_modules/react-helmet-async"],
};

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [
    tailwindcss(),
    react(),
    (process.env.ANALYZE === "true" || mode === "analysis") &&
      visualizer({
        open: process.env.CI !== "true" && process.env.HEADLESS !== "true", // auto-open stats.html only in non-CI headless runs
        filename: "dist/stats.html",
        gzipSize: true,
        brotliSize: true,
        template: "treemap", // treemap shows exactly what is in vendor-misc
      }),
    compression({
      algorithms: ["gzip"],
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    compression({
      algorithms: ["brotliCompress"],
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "script-defer",
      includeAssets: [],
      manifest: {
        name: "Africa DevOps Summit",
        short_name: "ADSummit",
        description: "Africa's premier DevOps, Cloud & SRE conference",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "https://res.cloudinary.com/nairobidevops/image/upload/w_192,h_192,c_fill/v1778759086/ads_favicon-01_juoi6r.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "https://res.cloudinary.com/nairobidevops/image/upload/w_512,h_512,c_fill/v1778759086/ads_favicon-01_juoi6r.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "https://res.cloudinary.com/nairobidevops/image/upload/w_512,h_512,c_fill/v1778759086/ads_favicon-01_juoi6r.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/ik\.imagekit\.io\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "imagekit-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Only process node_modules — app code stays in its own chunks
          if (!id.includes("node_modules/")) return;

          // Find the first matching chunk for this module
          const match = Object.entries(VENDOR_CHUNKS).find(([, patterns]) =>
            patterns.some((pattern) => id.includes(pattern)),
          );

          // Named chunk if matched, vendor-misc for anything unrecognised
          // After all explicit groups above vendor-misc should be < 30KB
          return match ? `vendor-${match[0]}` : "vendor-misc";
        },

        // ── Consistent naming with content hashes ─────────────
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },

    target: "esnext",
    minify: "oxc",
    cssMinify: true,

    // Keep off until Sentry is configured
    // When ready: sourcemap: true + SENTRY_AUTH_TOKEN in CI
    sourcemap: false,

    // Only emits warnings during build. CI budget enforcement is handled individually.
    chunkSizeWarningLimit: 400,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
