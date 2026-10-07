import type { NextConfig } from "next";
import { securityHeaders as buildSecurityHeaders } from "./lib/guvenlik-basliklari.mjs";

/**
 * Güvenlik başlıkları + CSP tek kaynaktan (lib/guvenlik-basliklari.mjs, testli).
 * Geliştirmede React yenilemesi için CSP'ye yalnız 'unsafe-eval' eklenir.
 */
const securityHeaders = buildSecurityHeaders({ dev: process.env.NODE_ENV === "development" });

const nextConfig: NextConfig = {
  /* Yalnız ölçüm: önce ve sonra derlemesi aynı anda sunulurken ikincisi ayrı klasörden açılır (G13). Yayında tanımsız. */
  ...(process.env.OLCUM_DIST_DIR && { distDir: process.env.OLCUM_DIST_DIR }),
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
      // Yerleşim URL’leri (`/ercis-avukat` vb.) artık bölgesel bilgilendirme sayfasıdır.
      // 308 ile deneme yazısına göndermek Google’da isim–yerleşim eşlemesini koparıyordu.
    ];
  },
  async rewrites() {
    // Madde sayfaları: Node route (app/mevzuat/[kanunId]/[id]/route.ts) — tam şerh.
    // Eski beforeFiles → /seo-madde/*.html kesik özet veriyordu ("portal arşivinde…"); kaldırıldı.
    return {
      beforeFiles: [
        // Ücretli indeks G14'ten beri public/ dışında (data/yayin/); eski adres üyelik API'sine yönlenir.
        { source: '/data/yargi-index.json.gz', destination: '/api/yargi/index' },
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
    "/api/yargi/[...path]": ["./data/yayin/yargi-index.json.gz"],
    "/api/yargi/index": ["./data/yayin/yargi-index.json.gz"],
    "/api/yargi/karar/[id]": ["./data/yayin/yargi-index.json.gz"],
    // G14 adım 4: karar sayfası künye ve kararın başını sunucuda indeksten basar (ISR, kimlik başına bir kez).
    "/yargi-kararlari/[id]": ["./data/yayin/yargi-index.json.gz"],
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
      // public/ varsayılanı max-age=0: görseller her ziyarette yeniden doğrulanıyordu (G13). Dosya adında içerik özeti
      // yok; görsel değişirse yeni adla eklenir (ör. av-fethi-guzel-88.jpg), eski adın en geç bir haftalık bayatlığı sorun değil.
      ...["/images/:path*", "/bolge/:path*"].map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      })),
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
      "./data/yargi-kararlari/**/*",
      "./data/uyelik/**/*",
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
