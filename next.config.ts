import type { NextConfig } from "next";

/**
 * Madde SEO: prebuild writes public/seo-madde/{kanun}/{id}.html with full text + meta.
 * Rewrite /mevzuat/:kanun/:id → those static files (Google sees real HTML, no lambda 500).
 * SPA viewer /mevzuat-viewer-v4.html is noindex backup only.
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
   * Pretty category URLs → /mevzuat (308).
   * Madde URLs rewritten to prebuilt static SEO HTML (title + resmi metin for Googlebot).
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
      {
        source: "/bilgi/boşanma-maaliyeti",
        destination: "/bilgi/bosanma-maaliyeti",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Static SEO HTML built by scripts/build-seo-madde-html.mjs (prebuild)
        {
          source: "/mevzuat/:kanunId/:id",
          destination: "/seo-madde/:kanunId/:id.html",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
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
