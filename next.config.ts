import type { NextConfig } from "next";

/**
 * Madde detail pretty URLs are served by a pure static HTML viewer in /public
 * so Vercel does not need serverless SSR for 7800+ content pages.
 *
 * Security + performance headers mirror patterns on award-winning legal sites
 * (Clio scorecard: technical factors, Core Web Vitals, trust).
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
  // Madde pages are App Router: app/mevzuat/[kanunId]/[id]
  // (static HTML viewer kept as offline fallback only — no rewrite hijack)
  async rewrites() {
    return [];
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
        source: "/content-packs/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
          { key: "Content-Type", value: "application/gzip" },
        ],
      },
      {
        source: "/packs/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
          { key: "Content-Type", value: "application/gzip" },
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
  // Include content-packs in serverless traces so /api/content-pack can read them.
  // Do NOT exclude content-packs — empty public stubs + exclude = invisible şerhler.
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
    "/api/content-pack/**/*": ["./content-packs/**/*", "./public/content-packs/**/*"],
  },
};

export default nextConfig;
