/**
 * Tasarım denetimi yardımcıları (G15).
 *
 * `scripts/tasarim-denetim.mjs` derlenmiş siteyi tarayıcıda ölçer. Buradaki saf işlevler sayfa listesini ve ölçümün özetini
 * taşır, böylece betik değişse de neyin ölçüldüğü testle sabit kalır.
 */

/**
 * Denetlenen sayfalar. Her sayfa türünden bir temsilci alınır. `izle` verilirse sayfada bu seçiciye uyan ilk bağlantıya
 * gidilir (makale adresleri belge adından türediği için sabit yazılmaz).
 * @type {Array<{ ad: string, yol: string, izle?: string }>}
 */
export const DENETIM_SAYFALARI = [
  { ad: 'anasayfa', yol: '/' },
  { ad: 'makale', yol: '/makaleler', izle: 'a[href^="/makale-oku/"]' },
  { ad: 'mevzuat', yol: '/mevzuat' },
  { ad: 'madde', yol: '/mevzuat/tbk/madde-1' },
  { ad: 'ders-notu', yol: '/ders-notlari/ankara/aile-hukuku-yillik' },
  { ad: 'yargi-arsivi', yol: '/yargi-kararlari' },
  { ad: 'karar', yol: '/yargi-kararlari/752428200' },
  { ad: 'rehber', yol: '/bilgi/aidat-borcu-ve-gecikme-tazminati' },
  { ad: 'hesaplama', yol: '/hesaplama/kidem' },
  { ad: 'icthat', yol: '/icthat' },
  { ad: 'kavram', yol: '/kavram/satim' },
  { ad: 'yazar', yol: '/avukat-fethi-guzel' },
  { ad: 'bolge', yol: '/van-avukat' },
  { ad: 'uyelik', yol: '/uyelik' },
];

/**
 * WCAG 2.2 AA 2.5.8 hedef boyutu adayları: görünür olup en ya da boyu eşiğin altında kalan hedefler.
 * Satır içi metin bağlantısı ve aralık istisnası tarayıcı tarafında elenir, burada yalnız boyut süzülür.
 * @param {Array<{ w: number, h: number }>} kutular
 * @param {number} [esik=24]
 */
export function kucukHedefler(kutular, esik = 24) {
  return kutular.filter((k) => k.w > 0 && k.h > 0 && (k.w < esik || k.h < esik));
}

/**
 * WCAG 2.2 AA 2.5.8 ihlalleri, aralık istisnasıyla: Küçük hedefin kutusunun ortasına 24 px çaplı daire konur. Daire başka bir
 * hedefin kutusuna ya da başka bir küçük hedefin dairesine değiyorsa ihlaldir. 1 px ve altı kutular (odakta görünen sr-only
 * atlama bağlantısı) hiç sayılmaz.
 * @param {Array<{ x: number, y: number, w: number, h: number }>} kutular  sayfa koordinatında bütün hedefler
 * @param {number} [esik=24]
 */
export function hedefIhlalleri(kutular, esik = 24) {
  const gecerli = kutular.filter((k) => k.w > 1 && k.h > 1);
  const r = esik / 2;
  const merkez = (k) => [k.x + k.w / 2, k.y + k.h / 2];
  const kutuyaUzaklik = ([px, py], k) => {
    const dx = Math.max(k.x - px, 0, px - (k.x + k.w));
    const dy = Math.max(k.y - py, 0, py - (k.y + k.h));
    return Math.hypot(dx, dy);
  };
  const kucuk = new Set(kucukHedefler(gecerli, esik));
  return gecerli.filter((k) => {
    if (!kucuk.has(k)) return false;
    const c = merkez(k);
    return gecerli.some((d) => {
      if (d === k) return false;
      if (kutuyaUzaklik(c, d) < r) return true;
      if (!kucuk.has(d)) return false;
      const [dx, dy] = merkez(d);
      return Math.hypot(c[0] - dx, c[1] - dy) < esik;
    });
  });
}

/**
 * Sayfa × genişlik sonuçlarını kural başına toplar.
 * @param {Array<{ sayfa: string, genislik: number, ihlaller: Array<{ id: string, etki: string, dugum: number }>,
 *   hedef: unknown[], tasma: boolean }>} sonuclar
 */
export function ozetle(sonuclar) {
  const kurallar = new Map();
  let kucukHedef = 0;
  const tasan = [];
  for (const s of sonuclar) {
    for (const i of s.ihlaller) {
      const k = kurallar.get(i.id) || { id: i.id, etki: i.etki, dugum: 0, sayfalar: new Set() };
      k.dugum += i.dugum;
      k.sayfalar.add(s.sayfa);
      kurallar.set(i.id, k);
    }
    kucukHedef += s.hedef.length;
    if (s.tasma) tasan.push(`${s.sayfa}@${s.genislik}`);
  }
  return {
    kurallar: [...kurallar.values()]
      .map(({ sayfalar, ...k }) => ({ ...k, sayfa: sayfalar.size }))
      .sort((a, b) => b.dugum - a.dugum),
    kucukHedef,
    tasan,
  };
}
