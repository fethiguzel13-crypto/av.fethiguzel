/**
 * Grafik ölçeği (Aylık plan G17) — kütüphanesiz grafiklerin ölçek ve sayı yardımcıları.
 *
 * Tikler 1-2-5 dizisinden yuvarlak adımla seçilir; en çok altı tik çizilir, en üst tik en büyük değeri kapsar.
 * Çubuk ve sütun yüzde genişlikli HTML öğesidir (`components/grafik/`): SVG `viewBox` dar ekranda etiketleri de
 * küçülttüğü için kullanılmaz. dataviz işaret kuralı (tabanda kare, veri ucunda 4 px) CSS köşe yarıçapıyla uygulanır.
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

/** Değerin ölçek üst sınırına oranı, yüzde olarak; 0–100 aralığına kırpılır. */
export function yuzde(deger, ust) {
  if (!(ust > 0) || !(deger > 0)) return 0;
  return yuvarla(Math.min(100, (deger / ust) * 100));
}

const SAYI = new Intl.NumberFormat('tr-TR');

/** `16309` → `16.309` */
export const sayi = (n) => SAYI.format(n);

const ORAN = new Intl.NumberFormat('tr-TR', { style: 'percent', maximumFractionDigits: 1 });

/** Toplamın payı, Türkçe yüzde yazımıyla: `(992.41, 1400)` → `%70,9` */
export const oranMetni = (deger, toplam) => ORAN.format(toplam > 0 ? deger / toplam : 0);
