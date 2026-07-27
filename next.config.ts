import type { NextConfig } from "next";

/**
 * Madde pages: app/mevzuat/[kanunId]/[id] (App Router).
 * Packs load client-side from jsDelivr — do not bundle content-packs into lambdas.
 */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  /**
   * Madde pages are SSR/ISR via app/mevzuat/[kanunId]/[id]/page.tsx
   * (packs fetched from CDN — not bundled into lambdas).
   *
   * Next.js 16.2.x bug: console-file.js has an unconditional top-level
   * require('../dev/browser-logs/file-logger') even though the code that uses
   * it is NODE_ENV==='development' only. NFT excludes the dev folder from the
   * Lambda bundle → every serverless cold start 500s with
   * "Cannot find module '../dev/browser-logs/file-logger'".
   * Force-include so Node can resolve the require at runtime.
   */
  outputFileTracingIncludes: {
    "*": ["./node_modules/next/dist/server/dev/browser-logs/**/*"],
    "/*": ["./node_modules/next/dist/server/dev/browser-logs/**/*"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/llms.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      {
        source: "/data/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, stale-while-revalidate=3600",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  poweredByHeader: false,
  compress: true,
  // Keep deploy lean: never ship raw markdown / scrapers / 30MB packs into serverless
  // Use '*' key (Next 16) so excludes don't fight route-scoped includes.
  outputFileTracingExcludes: {
    "*": [
      "./content/**/*",
      "./content-packs/**/*",
      "./public/content-packs/**/*",
      "./public/packs/**/*",
      "./scraper/**/*",
      "./scripts/**/*",
      "./docs/**/*",
      "./logs/**/*",
      "./mobile/**/*",
      "./node_modules/playwright/**/*",
      "./node_modules/playwright-core/**/*",
      "./node_modules/@anthropic-ai/**/*",
      "./node_modules/pdfjs-dist/**/*",
      "./node_modules/pdf-parse/**/*",
    ],
  },
};

export default nextConfig;
