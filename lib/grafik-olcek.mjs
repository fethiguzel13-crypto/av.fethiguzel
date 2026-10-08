/**
 * Grafik ölçeği (Aylık plan G17) — kütüphanesiz SVG grafiklerin geometri yardımcıları.
 *
 * Tikler 1-2-5 dizisinden yuvarlak adımla seçilir; en çok altı tik çizilir, en üst tik en büyük değeri kapsar.
 * Sütun dataviz işaret kuralına uyar: tabanda kare, veri ucunda 4 px yuvarlatılmış.
 */

const yuvarla = (v) => +v.toFixed(2);

/** `[0, adım, …, üst]` — üst ≥ en büyük değer, en çok 6 tik. */
export function tikler(enBuyuk) {
  if (!(enBuyuk > 0)) return [0, 1];
  for (let us = Math.floor(Math.log10(enBuyuk)) - 1; ; us++) {
    for (const k of [1, 2, 5]) {
      const adim = k * 10 ** us;
      const n = Math.ceil(enBuyuk / adim);
      if (n <= 5) return Array.from({ length: n + 1 }, (_, i) => yuvarla(i * adim));
    }
  }
}

/** Tabanı `taban` y koordinatında olan, yukarı doğru `yukseklik` kadar uzanan sütunun SVG yolu. */
export function sutunYolu(x, taban, genislik, yukseklik) {
  if (!(yukseklik > 0)) return '';
  const r = yuvarla(Math.min(4, yukseklik, genislik / 2));
  const [x0, x1, ust] = [yuvarla(x), yuvarla(x + genislik), yuvarla(taban - yukseklik)];
  return `M${x0} ${taban}V${yuvarla(ust + r)}Q${x0} ${ust} ${yuvarla(x0 + r)} ${ust}H${yuvarla(x1 - r)}Q${x1} ${ust} ${x1} ${yuvarla(ust + r)}V${taban}Z`;
}
