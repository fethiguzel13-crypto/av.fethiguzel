import type { NextConfig } from "next";

/**
 * Raw content/mevzuat (~380MB) must not be traced into serverless functions.
 * Runtime reads gzip packs from content-packs/ (~32MB).
 *
 * Route keys use Next.js route globs (not filesystem globs).
 */
const nextConfig: NextConfig = {
  // Keep server traces lean; do not use a bare "*" key (can mis-match).
  outputFileTracingExcludes: {
    "/**": [
      "./content/**/*",
      "./scraper/**/*",
      "./scripts/**/*",
      "./docs/**/*",
      "./logs/**/*",
      "./node_modules/playwright/**/*",
      "./node_modules/playwright-core/**/*",
      "./node_modules/@anthropic-ai/**/*",
      "./node_modules/pdfjs-dist/**/*",
      "./node_modules/pdf-parse/**/*",
    ],
  },
  outputFileTracingIncludes: {
    "/mevzuat": ["./content-packs/**/*"],
    "/mevzuat/**/*": ["./content-packs/**/*"],
    "/kategori/**/*": ["./content-packs/**/*"],
    "/[category]/[slug]": ["./content-packs/**/*"],
    "/[category]/[slug]/**/*": ["./content-packs/**/*"],
    "/sitemap.xml": ["./content-packs/**/*"],
  },
};

export default nextConfig;
