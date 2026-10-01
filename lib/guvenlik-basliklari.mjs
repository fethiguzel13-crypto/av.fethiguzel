/**
 * Güvenlik başlıkları ve İçerik Güvenliği Politikası (CSP) — Aylık plan G03.
 *
 * Kaynak envanteri (2026-10-01, app/components/lib taraması):
 *   - fonts.googleapis.com / fonts.gstatic.com  → app/layout.tsx yazı tipleri
 *   - images.unsplash.com                         → next.config images.remotePatterns
 *   - cdn.jsdelivr.net, raw.githubusercontent.com → mevzuat içerik paketleri (MaddeViewer istemci fetch)
 *   - www.google.com                              → ofis haritası gömmesi (lib/profile.ts)
 *   - *.iyzipay.com                               → kart ödeme formu (OdemePaneli: betik + iframe + form)
 *
 * script-src'de 'unsafe-inline' bilinçli: Next.js App Router RSC yükünü satır içi betikle basar; nonce
 * her isteği dinamik işlemeye zorlar (binlerce statik sayfa + Vercel fonksiyon maliyeti). Diğer
 * yönergeler sıkıdır: dış betik enjeksiyonu, tıklama korsanlığı, base etiketi ele geçirme ve form ile
 * veri sızdırma kapalıdır. Geliştirmede React yenilemesi için yalnız 'unsafe-eval' eklenir.
 */

const IYZICO = "https://*.iyzipay.com";

export function cspDirectives({ dev = false } = {}) {
  return {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", ...(dev ? ["'unsafe-eval'"] : []), IYZICO],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", IYZICO],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com", IYZICO],
    "img-src": ["'self'", "data:", "blob:", "https://images.unsplash.com", IYZICO],
    "connect-src": [
      "'self'",
      // /ara sayfası sonuç bağlantılarını mutlak adresle önden yüklüyor; site hem www'li hem
      // www'siz açılabildiği için iki ad da izinli (2026-10-01 tarayıcı doğrulaması).
      "https://avfethiguzel.com",
      "https://www.avfethiguzel.com",
      "https://cdn.jsdelivr.net",
      "https://raw.githubusercontent.com",
      IYZICO,
      ...(dev ? ["ws:"] : []),
    ],
    "frame-src": ["'self'", "https://www.google.com", IYZICO],
    "frame-ancestors": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'", IYZICO],
    "upgrade-insecure-requests": [],
  };
}

export function buildCsp(opts = {}) {
  return Object.entries(cspDirectives(opts))
    .map(([k, v]) => (v.length ? `${k} ${v.join(" ")}` : k))
    .join("; ");
}

export function securityHeaders({ dev = false } = {}) {
  return [
    { key: "Content-Security-Policy", value: buildCsp({ dev }) },
    { key: "X-DNS-Prefetch-Control", value: "on" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(self)",
    },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  ];
}
