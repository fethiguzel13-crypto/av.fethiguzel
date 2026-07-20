import type { NextConfig } from "next";

/**
 * Large raw markdown (~380MB) must NOT be traced into serverless functions
 * (Vercel limit ~250MB). Runtime reads gzip packs from content-packs/ (~60MB).
 */
const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": [
      "./content/**/*",
      "./scraper/**/*",
      "./scripts/**/*",
      "./docs/**/*",
      "./logs/**/*",
      "./.next/cache/**/*",
      "./node_modules/playwright/**/*",
      "./node_modules/playwright-core/**/*",
      "./node_modules/@anthropic-ai/**/*",
      "./node_modules/pdfjs-dist/**/*",
      "./node_modules/pdf-parse/**/*",
    ],
  },
  outputFileTracingIncludes: {
    "/*": ["./content-packs/**/*"],
  },
};

export default nextConfig;
