import type { NextConfig } from "next";

/**
 * Madde detail pretty URLs are served by a pure static HTML viewer in /public
 * so Vercel does not need serverless SSR for 7800+ content pages.
 */
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/mevzuat/:kanunId/:id",
        destination: "/mevzuat-viewer.html",
      },
    ];
  },
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
