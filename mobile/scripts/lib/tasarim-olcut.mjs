/**
 * Tasarım denetiminin tarayıcı dışında karar veren ölçütleri.
 *
 * design-audit.mjs sayfadan ham değeri (punto, hesaplanmış harf aralığı)
 * toplar; bulgu olup olmadığına burada, testli olarak karar verilir.
 */

/**
 * Harf aralığı eşiği.
 *
 * Tailwind `tracking-tight` -0,025em verir. Büyük başlıkta bu, harfleri
 * toparlar; 20 px altında ise kelime arası daralır ve «Av. Fethi» gibi
 * kısa sözcükler bitişik okunur (G21, üst çubuk başlığı 16 px). Küçük
 * puntoda -0,01em'den sıkı aralık bulgudur.
 */
export const HARF_ARALIGI = { puntoSiniri: 20, enAzEm: -0.01 };

/** Hesaplanmış `letter-spacing` değerini puntoya oranlar ("normal" → 0). */
export function harfAraligiEm(harfAraligi, px) {
  const deger = parseFloat(harfAraligi);
  if (!Number.isFinite(deger) || !px) return 0;
  return Math.round((deger / px) * 1000) / 1000;
}

/** Küçük puntoda harf aralığı eşikten sıkı mı? */
export function harfAraligiDar({ px, harfAraligi }) {
  if (px >= HARF_ARALIGI.puntoSiniri) return false;
  return harfAraligiEm(harfAraligi, px) < HARF_ARALIGI.enAzEm;
}
