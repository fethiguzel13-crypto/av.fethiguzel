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
  /* Yalnız yerel kalite kapısı: derleme işçisi boş belleğe göre sınırlanır (scripts/kalite.mjs). Yayında tanımsız. */
  ...(process.env.DERLEME_ISCI && { experimental: { cpus: Number(process.env.DERLEME_ISCI) } }),
  /**
   * Pretty category URLs → /mevzuat (308).
   * Madde URLs rewritten to prebuilt static SEO HTML (title + resmi metin for Googlebot).
   */
  async redirects() {
    return [
      // Eski alan ve alt alan sayfaları: aynı madde listesi /mevzuat/<kanun>'dadır (G25 adım 4).
      ...[
        ["medeni-hukuk", "tmk"],
        ["borclar-hukuku", "tbk"],
        ["ticaret-hukuku", "ttk"],
      ].flatMap(([alan, kanun]) => [
        {
          source: `/${alan}`,
          destination: `/mevzuat/${kanun}`,
          permanent: true,
        },
        {
          source: `/${alan}/:sub`,
          destination: `/mevzuat/${kanun}`,
          permanent: true,
        },
      ]),
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
      // 2026-11: Vercel Hobby kullanım sınırı için ders notları, karar arşivi ve ücretli üyelik siteden kaldırıldı.
      // Yönlendirme CDN'de yapılır, sunucu fonksiyonu çalışmaz. Karar araması yerelde: scripts/karar-arama.
      ...["/ders-notlari", "/ders-notlari/:path*", "/uyelik", "/uyelik/:path*"].map((source) => ({
        source,
        destination: "/",
        permanent: true,
      })),
      ...["/yargi-kararlari", "/yargi-kararlari/:path*"].map((source) => ({
        source,
        destination: "/icthat",
        permanent: true,
      })),
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
    // Paylaşım kartları derlemede üretilir (dynamicParams = false); çalışma anında not okunmaz. getNote üzerinden
    // izlenen 1 GB'lık not klasörü bu fonksiyona girmesin.
    "/og/**": ["./lib/ders-notlari/generated/**/*"],
    "*": [
      // Ders notları 2026-11'de siteden kaldırıldı; 1 GB'lık not klasörü hiçbir fonksiyona girmez.
      "./lib/ders-notlari/generated/**/*",
      "./data/yayin/**/*",
      "./content/**/*",
      "./content-packs/**/*",
      "./public/content-packs/**/*",
      "./public/packs/**/*",
      "./public/seo-madde/**/*",
      "./public/data/**/*",
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
