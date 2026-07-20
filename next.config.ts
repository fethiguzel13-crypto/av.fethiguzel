import type { NextConfig } from "next";

/**
 * Do not force-include content packs in serverless traces.
 * Packs are served from public/content-packs via CDN and fetched at runtime.
 * Raw content/ is excluded so deploy stays under Vercel limits.
 */
const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "/**": [
      "./content/**/*",
      "./content-packs/**/*",
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
};

export default nextConfig;
