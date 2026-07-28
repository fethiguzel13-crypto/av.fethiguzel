import type { NextConfig } from "next";

/**
 * Madde pages: app/mevzuat/[kanunId]/[id] App Router SSR (SEO).
 * DO NOT rewrite /mevzuat/* to static viewer — that served empty HTML to Googlebot
 * (generic title "Madde Şerhi", no madde text). Viewer remains at /mevzuat-viewer-v4.html
 * for offline/debug only. Packs load via fetch on SSR (SITE_ORIGIN / jsDelivr).
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
   * Pretty category URLs → canonical /mevzuat (Edge 308, no Node).
   * Madde body is App Router SSR with unique <title>, canonical, JSON-LD and
   * full official text in HTML for Googlebot.
   */
  async redirects() {
    return [
      {
        source: "/borclar-hukuku/:sub/:maddeId",
        destination: "/mevzuat/tbk/:maddeId",
        permanent: true,
      },
      {
        source: "/medeni-hukuk/:sub/:maddeId",
        destination: "/mevzuat/tmk/:maddeId",
        permanent: true,
      },
      {
        source: "/ticaret-hukuku/:sub/:maddeId",
        destination: "/mevzuat/ttk/:maddeId",
        permanent: true,
      },
      // Eski hatalı slug (Türkçe karakter) → ASCII slug
      {
        source: "/bilgi/boşanma-maaliyeti",
        destination: "/bilgi/bosanma-maaliyeti",
        permanent: true,
      },
    ];
  },
  outputFileTracingIncludes: {
    "*": [
      "./node_modules/next/dist/server/dev/browser-logs/**/*",
      "./node_modules/next/dist/server/node-environment-extensions/**/*",
    ],
    "/*": [
      "./node_modules/next/dist/server/dev/browser-logs/**/*",
      "./node_modules/next/dist/server/node-environment-extensions/**/*",
    ],
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
    ],
  },
};

export default nextConfig;
