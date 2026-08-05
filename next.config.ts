import type { NextConfig } from "next";

/**
 * Madde SEO: prebuild writes public/seo-madde/{kanun}/{id}.html (compact).
 * beforeFiles rewrite → static files (no lambda / no empty SPA for Googlebot).
 * Node route remains fallback only if rewrite is removed.
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
      // Eski “X avukat” SEO sayfaları → bölge denemeleri (reklam yasağı / soft-CTA temizliği)
      { source: "/van-avukat", destination: "/bolge-yazi/van-golu-havzasi-tasinmaz-ve-miras-hukuku", permanent: true },
      { source: "/ercis-avukat", destination: "/bolge-yazi/ercis-nufus-veraset-tapu-intikali", permanent: true },
      { source: "/muradiye-avukat", destination: "/bolge-yazi/muradiye-aile-miras-ve-nufus-olaylari", permanent: true },
      { source: "/agri-avukat", destination: "/bolge-yazi/agri-sinir-bolgesi-tasinmaz-miras-ve-idare", permanent: true },
      { source: "/patnos-avukat", destination: "/bolge-yazi/patnos-icra-tarimsal-alacak-ve-nufus", permanent: true },
      { source: "/caldiran-avukat", destination: "/bolge-yazi/caldiran-tarimsal-tasinmaz-kadastro-ve-nufus", permanent: true },
      { source: "/ozalp-avukat", destination: "/bolge-yazi", permanent: true },
      { source: "/tatvan-avukat", destination: "/bolge-yazi/tatvan-ticaret-kira-ve-ulastirma-hukuku", permanent: true },
      { source: "/bitlis-avukat", destination: "/bolge-yazi/bitlis-miras-paydasligi-ve-daglik-tasinmaz", permanent: true },
      { source: "/adilcevaz-avukat", destination: "/bolge-yazi/adilcevaz-gol-kiyisi-mulkiyet-ve-miras", permanent: true },
      { source: "/ahlat-avukat", destination: "/bolge-yazi/ahlat-vakif-miras-ve-tarihi-tasinmazlar", permanent: true },
      { source: "/ankara-avukat", destination: "/bolge-yazi", permanent: true },
      { source: "/hizmet-bolgeleri", destination: "/bolge-yazi", permanent: true },
    ];
  },
  async rewrites() {
    // Madde sayfaları: Node route (app/mevzuat/[kanunId]/[id]/route.ts) — tam şerh.
    // Eski beforeFiles → /seo-madde/*.html kesik özet veriyordu ("portal arşivinde…"); kaldırıldı.
    return { beforeFiles: [], afterFiles: [], fallback: [] };
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
    // Ders notları — SSG dışında runtime fallback için dosya erişimi
    "/ders-notlari/[uni]/[ders]": ["./lib/ders-notlari/generated/notes/**/*"],
    "/ders-notlari/[uni]/[ders]/pdf": ["./lib/ders-notlari/generated/notes/**/*"],
    "/ders-notlari/[uni]": ["./lib/ders-notlari/generated/**/*"],
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
  // Keep deploy lean: never ship bulk static data into serverless lambdas.
  // Vercel limit is ~250MB/function. A failed deploy (2026-07-30+) traced
  // notes (107MB) + public/data (112MB) + seo-madde (78MB) into content-pack → OOM/size fail.
  // Use '*' key (Next 16) so excludes apply broadly; route includes below re-add only notes.
  outputFileTracingExcludes: {
    "*": [
      "./content/**/*",
      "./content-packs/**/*",
      "./public/content-packs/**/*",
      "./public/packs/**/*",
      "./public/seo-madde/**/*",
      "./public/data/**/*",
      // notes: NOT excluded here — route-scoped includes below ship them only to
      // /ders-notlari/* lambdas. Auto-trace is blocked via turbopackIgnore in getNote.
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
