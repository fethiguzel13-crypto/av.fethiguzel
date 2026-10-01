/**
 * Sayfa değil rota işleyicisi (route.ts) olan site yolları — Aylık plan G00.
 *
 * `/mevzuat/{kanun}/{madde}` app/mevzuat/[kanunId]/[id]/route.ts ile sunulur. next/link bu yollara:
 *   (1) görünür olunca `?_rsc=` ile önden yükleme isteği atar — CDN önbelleğini deler, her biri
 *       sunucu fonksiyonu çağrısıdır (2026-10-01 ölçümü: /mevzuat/tbk tek ziyarette 84 istek),
 *   (2) tıklamada önce RSC ister, HTML gelince tam sayfa yükler — her tıklamada çift istek.
 * Bu yollar düz <a> ile verilmelidir (components/SiteLink.tsx bunu kendiliğinden yapar).
 */
const ROTA_ISLEYICI = /^\/mevzuat\/[^/?#]+\/[^/?#]+\/?(?:[?#].*)?$/;

export function rotaIsleyicisiMi(href: string): boolean {
  return ROTA_ISLEYICI.test(href);
}
