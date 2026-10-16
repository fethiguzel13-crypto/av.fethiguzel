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
 * ve atlama bağlantısı ile hedefi. Tarayıcı alanları toplar; verilmeyen alan kural dışı bırakılır.
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
  if (veri.atlama && !veri.atlama.baglanti) bulgular.push({ kural: 'atlama-yok' });
  else if (veri.atlama && !veri.atlama.hedef) bulgular.push({ kural: 'atlama-hedefi-yok' });
  return bulgular;
}

/**
 * Markdown başlıklarını `taban` düzeyinden başlatır (G24 adım 6). İç içelik bir yığınla korunur: Her başlık, kendisinden sığ ilk
 * önceki başlığın bir altına yerleşir, yoksa tabana. Böylece hiçbir başlık bir öncekinden birden fazla derinleşmez ve tabandan sığ
 * başlık (ikinci bir `h1` dahil) doğmaz. Derinlik 6'yı aşmaz; başlık metni, gövde ve satır sonları değişmez.
 * @param {string} md
 * @param {number} taban  ilk başlığın düzeyi (sayfada bir üstteki başlığın düzeyi + 1)
 */
export function baslikDuzeyleriniDuzle(md, taban) {
  const yigin = [];
  return String(md || '').replace(/^(#{1,6})(?=[ \t])/gm, (isaret) => {
    const duzey = isaret.length;
    while (yigin.length && yigin[yigin.length - 1].duzey >= duzey) yigin.pop();
    const yeni = Math.min(6, yigin.length ? yigin[yigin.length - 1].yeni + 1 : taban);
    yigin.push({ duzey, yeni });
    return '#'.repeat(yeni);
  });
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

/**
 * Tarayıcıda `page.evaluate(yapiTopla)` ile koşar, `yapiDenetimi`'nin verisini toplar: dil, başlıklar, işaret bölgeleri, adsız
 * görsel ve grafik, atlama bağlantısı ve hedefi. Dış değişkene dayanmaz, zira kaynağı sayfaya gönderilir. Kullananlar
 * `scripts/tasarim-denetim.mjs --yapi` ve `e2e/erisilebilirlik.e2e.mjs`'tir.
 *
 * `header` ve `footer` yalnız `banner` ve `contentinfo` işaret bölgesi olduklarında sayılır (G24 adım 6). `main`, `article`, `aside`,
 * `nav` ya da `section` içindeki sayfa başlığı kutusu işaret bölgesi değildir; önceki sayım bunları da saydığından makale, mevzuat,
 * içtihat ve bölge sayfaları üst bilgisi yokken `header-yok` bulgusu vermiyordu.
 */
export function yapiTopla() {
  // Yardımcı teknolojinin gördüğü öğeler: sr-only öğe sayılır, display:none ve aria-hidden altı sayılmaz.
  const erisilir = (el) =>
    (el.checkVisibility ? el.checkVisibility({ visibilityProperty: true }) : true) && !el.closest('[aria-hidden="true"]');
  const say = (secici) => [...document.querySelectorAll(secici)].filter(erisilir).length;
  const sayfaDuzeyi = (etiket, rol) =>
    [...document.querySelectorAll(`${etiket}, [role="${rol}"]`)].filter(
      (el) => erisilir(el) && (el.getAttribute('role') === rol || !el.parentElement.closest('main, article, aside, nav, section'))
    ).length;
  const tanim = (el) => {
    const sinif = (el.getAttribute('class') || '').trim();
    return el.tagName.toLowerCase() + (sinif ? '.' + sinif.split(/\s+/).slice(0, 3).join('.') : '');
  };
  const adli = (el) => {
    const baslik = el.querySelector(':scope > title');
    return Boolean((el.getAttribute('aria-label') || '').trim() || el.getAttribute('aria-labelledby') || (baslik && baslik.textContent.trim()));
  };
  return {
    lang: document.documentElement.getAttribute('lang'),
    basliklar: [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].filter(erisilir).map((h) => ({
      duzey: Number(h.tagName[1]),
      metin: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 60),
    })),
    bolgeler: {
      main: say('main, [role="main"]'),
      nav: say('nav, [role="navigation"]'),
      header: sayfaDuzeyi('header', 'banner'),
      footer: sayfaDuzeyi('footer', 'contentinfo'),
    },
    altsizGorsel: [...document.querySelectorAll('img:not([alt])')]
      .filter((el) => erisilir(el) && !['presentation', 'none'].includes(el.getAttribute('role')))
      .slice(0, 10)
      .map((el) => (el.getAttribute('src') || '').slice(0, 120)),
    adsizGrafik: [...document.querySelectorAll('[role="img"]')].filter((el) => erisilir(el) && !adli(el)).slice(0, 10).map(tanim),
    atlama: {
      baglanti: Boolean(document.querySelector('a[href="#main-content"]')),
      hedef: Boolean(document.getElementById('main-content')),
    },
  };
}
