/**
 * Erişilebilirlik yapı kuralları (G24).
 *
 * `scripts/tasarim-denetim.mjs` tarayıcıda yalnız veri toplar: başlık düzeyleri, işaret bölgesi sayıları, odaktan önce ve sonra
 * hesaplanmış stil. Karar buradaki saf işlevlerdedir; her işlev bulgu listesi döner, boş liste kuralın geçtiğini gösterir.
 */

/**
 * Başlık sırası: sayfada tek `h1` bulunur ve hiçbir başlık bir öncekinden birden fazla düzey derinleşmez. Sığa inmek serbesttir,
 * ilk başlığın düzeyi de serbesttir (üst bilgideki başlık `h1`'den önce gelebilir).
 * @param {Array<{ duzey: number, metin?: string }>} basliklar  belge sırasıyla
 */
export function baslikSirasi(basliklar) {
  const bulgular = [];
  const h1 = basliklar.filter((x) => x.duzey === 1).length;
  if (h1 === 0) bulgular.push({ kural: 'h1-yok' });
  if (h1 > 1) bulgular.push({ kural: 'h1-coklu', sayi: h1 });
  for (let i = 1; i < basliklar.length; i++) {
    const onceki = basliklar[i - 1].duzey;
    const sonraki = basliklar[i].duzey;
    if (sonraki > onceki + 1) {
      bulgular.push({ kural: 'duzey-atlama', sira: i, onceki, sonraki, metin: basliklar[i].metin });
    }
  }
  return bulgular;
}

/**
 * İşaret bölgeleri: tek `main`, en az bir `nav`, `header` ve `footer`. Verilmeyen alan sıfır sayılır.
 * @param {{ main?: number, nav?: number, header?: number, footer?: number }} bolgeler
 */
export function isaretBolgeleri(bolgeler) {
  const { main = 0, nav = 0, header = 0, footer = 0 } = bolgeler;
  const bulgular = [];
  if (main === 0) bulgular.push({ kural: 'main-yok' });
  if (main > 1) bulgular.push({ kural: 'main-coklu', sayi: main });
  if (nav === 0) bulgular.push({ kural: 'nav-yok' });
  if (header === 0) bulgular.push({ kural: 'header-yok' });
  if (footer === 0) bulgular.push({ kural: 'footer-yok' });
  return bulgular;
}

/** @typedef {{ outlineStyle: string, outlineWidth: string, outlineColor: string, boxShadow: string }} OdakStili */

const saydam = (renk) => renk === 'transparent' || /^rgba\(.*,\s*0(\.0+)?\)$/.test(renk);

/** @param {OdakStili} s */
function cizgi(s) {
  if (s.outlineStyle === 'none' || s.outlineStyle === 'hidden') return null;
  if (!(parseFloat(s.outlineWidth) > 0) || saydam(s.outlineColor)) return null;
  return `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`;
}

/** @param {OdakStili} s */
const golge = (s) => (s.boxShadow && s.boxShadow !== 'none' ? s.boxShadow : null);

/**
 * Odak görünürlüğü (WCAG 2.4.7): Odakla birlikte görünür bir dış çizgi ya da gölge belirir veya değişir. Odaktan önce de aynı
 * biçimde duran çizgi ya da gölge odağı ayırt ettirmez.
 * @param {OdakStili} once  odaktan önce hesaplanmış stil
 * @param {OdakStili} sonra  odaktan sonra hesaplanmış stil
 */
export function odakGorunur(once, sonra) {
  const c = cizgi(sonra);
  if (c && c !== cizgi(once)) return true;
  const g = golge(sonra);
  return Boolean(g && g !== golge(once));
}

/**
 * Sayfa yapısı (G24 adım 2): başlık sırası ve işaret bölgelerine ek olarak belge dili, alt metni olmayan görsel, adı olmayan grafik
 * ve atlama bağlantısının hedefi. Tarayıcı alanları toplar; verilmeyen alan kural dışı bırakılır.
 * @param {{ lang?: string | null, basliklar?: Array<{ duzey: number, metin?: string }>,
 *   bolgeler?: { main?: number, nav?: number, header?: number, footer?: number },
 *   altsizGorsel?: string[], adsizGrafik?: string[], atlama?: { baglanti: boolean, hedef: boolean } }} veri
 */
export function yapiDenetimi(veri) {
  const bulgular = [];
  if (!/^tr(-|$)/i.test(veri.lang || '')) bulgular.push({ kural: 'lang-tr-degil', deger: veri.lang || null });
  if (veri.basliklar) bulgular.push(...baslikSirasi(veri.basliklar));
  if (veri.bolgeler) bulgular.push(...isaretBolgeleri(veri.bolgeler));
  for (const ornek of veri.altsizGorsel || []) bulgular.push({ kural: 'gorsel-altsiz', ornek });
  for (const ornek of veri.adsizGrafik || []) bulgular.push({ kural: 'grafik-adsiz', ornek });
  if (veri.atlama && veri.atlama.baglanti && !veri.atlama.hedef) bulgular.push({ kural: 'atlama-hedefi-yok' });
  return bulgular;
}

/**
 * Sayfa × genişlik yapı sonuçlarını kural başına toplar.
 * @param {Array<{ sayfa: string, genislik: number, bulgular: Array<{ kural: string }> }>} sonuclar
 * @returns {Array<{ kural: string, bulgu: number, sayfalar: string[] }>}
 */
export function yapiOzeti(sonuclar) {
  const kurallar = new Map();
  for (const s of sonuclar) {
    for (const b of s.bulgular) {
      const k = kurallar.get(b.kural) || { kural: b.kural, bulgu: 0, sayfalar: new Set() };
      k.bulgu += 1;
      k.sayfalar.add(s.sayfa);
      kurallar.set(b.kural, k);
    }
  }
  return [...kurallar.values()]
    .map((k) => ({ ...k, sayfalar: [...k.sayfalar].sort() }))
    .sort((a, b) => b.sayfalar.length - a.sayfalar.length || a.kural.localeCompare(b.kural));
}
