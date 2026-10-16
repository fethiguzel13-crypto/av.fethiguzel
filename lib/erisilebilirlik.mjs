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
