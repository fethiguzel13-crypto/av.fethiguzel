/**
 * Karar arşivi dağılımı (Aylık plan G17) — `/yargi-kararlari/istatistik` sayfasının verisi.
 *
 * Dağılım sitede yayımlanan web indeksinden (`data/yayin/yargi-index.json.gz`, G14; satırda `r` birim, `y` karar yılı) sayılır.
 * Arşiv ve süzülen toplamı aynı üretimin `public/data/yargi-stats.json` dosyasından gelir. Canlı hasat indeksi kullanılmaz,
 * zira hasat sürdükçe büyür ve sitedeki "yayında" sayısıyla çelişir. Çıktı yalnız sayım taşır: Künye, kimlik ve özet
 * `public/`'e yazılmaz (ücretli indeks G14 kararıyla `public/` dışındadır).
 */

/** Çizilen en çok kategori; kalanlar "Diğer"de toplanır (dataviz: sekizden fazla seri renklendirilmez). */
export const EN_COK_BIRIM = 8;

/**
 * @param {{ satirlar: { r?: string, y?: string }[], istatistik: { total: number, arsivToplam: number, suzulen: number },
 *           etiketler: Record<string, string> }} girdi
 */
export function yargiDagilimi({ satirlar, istatistik, etiketler }) {
  const yayinda = satirlar.length;
  if (istatistik.total !== yayinda || istatistik.arsivToplam - istatistik.suzulen !== yayinda) {
    throw new Error(
      `yargi-stats.json (yayında ${istatistik.total}, arşiv ${istatistik.arsivToplam}, süzülen ${istatistik.suzulen}) web indeksiyle (${yayinda}) çelişir`
    );
  }

  const birimSay = new Map();
  const yilSay = new Map();
  let tarihsiz = 0;
  for (const s of satirlar) {
    const birim = s.r || 'diger';
    birimSay.set(birim, (birimSay.get(birim) || 0) + 1);
    const yil = /^\d{4}$/.test(String(s.y || '')) ? Number(s.y) : null;
    if (yil === null) tarihsiz += 1;
    else yilSay.set(yil, (yilSay.get(yil) || 0) + 1);
  }

  const sirali = [...birimSay].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const ust = sirali.length > EN_COK_BIRIM ? sirali.slice(0, EN_COK_BIRIM - 1) : sirali;
  const etiketle = ([anahtar, sayi]) => ({ anahtar, ad: etiketler[anahtar] || anahtar, sayi });
  const birimler = ust.map(etiketle);
  const digerDetay = sirali.length > EN_COK_BIRIM ? sirali.slice(EN_COK_BIRIM - 1).map(etiketle) : [];
  if (digerDetay.length) {
    birimler.push({ anahtar: 'diger', ad: 'Diğer', sayi: digerDetay.reduce((a, b) => a + b.sayi, 0) });
  }

  const yillar = [...yilSay].sort((a, b) => a[0] - b[0]).map(([yil, sayi]) => ({ yil, sayi }));
  return { arsiv: istatistik.arsivToplam, yayinda, suzulen: istatistik.suzulen, tarihsiz, birimler, digerDetay, yillar };
}
