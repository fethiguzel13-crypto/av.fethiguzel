/**
 * İç bağlantı dizini (Aylık plan G12 adım 7): madde → o maddeye açıkça değinen içerik (rehber, kavram, hesaplama,
 * temsilci ders notu). Kaynak, içeriğin kendi bağlantı listesindeki madde adresi (rehber `links`, kavram ve hesaplama
 * `mevzuat`) ve ders notu metninde "TMK m. 118" biçiminde açıkça yazılan göndermedir; benzerlik eşlemesi yapılmaz.
 * Dizin `scripts/ic-baglanti-dizini.mjs` ile `dizin.json`'a sıkıştırılmış biçimde yazılır; madde sayfası (rota
 * işleyicisi) ve içerik sayfaları aynı dosyayı `dizinAc` ile okur.
 */

export const TUR_SIRASI = ['rehber', 'kavram', 'hesaplama', 'ders-notu'];
export const TUR_ADI = { rehber: 'Rehber', kavram: 'Kavram', hesaplama: 'Hesaplama', 'ders-notu': 'Ders notu' };

const MADDE = /^\/mevzuat\/([a-z0-9-]+)\/madde-(\d+[a-z]?)$/;

/**
 * Ders notlarındaki kanun kısaltması → paket kimliği. Her satır paketin resmî metin başlığıyla doğrulandı
 * (2026-10-05). Dışarıda: KMK (depodaki `kmk` Kaçakçılıkla Mücadele Kanunu; notlarda Kat Mülkiyeti Kanunu anlamında),
 * FSEK (paket yok), yalın "Kanun".
 */
export const KISALTMALAR = {
  TMK: 'tmk', TBK: 'tbk', TTK: 'ttk', TCK: 'tck', HMK: 'hmk', 'İİK': 'iik', CMK: 'cmk', SPK: 'spk', TKHK: 'tkhk',
  RKHK: 'rkhk', KVKK: 'kvkk', VUK: 'vuk', GVK: 'gvk', KDVK: 'kdvk', DMK: 'dmk', 'İşK': 'is-kanunu', 'İSGK': 'isg',
  HUAK: 'arabuluculuk', 'İmarK': 'imar', BelediyeK: 'belediye', 'KamulaştırmaK': 'kamulastirma', 'İlİdareK': 'il-idaresi',
  'ÇekK': 'cek',
};
const KISALTMA_DESENI = new RegExp(
  `(?<![\\p{L}\\p{N}])(${Object.keys(KISALTMALAR).join('|')})\\s*(?:m\\.|md\\.|madde)\\s*(\\d+)(?![\\p{L}\\p{N}])`,
  'gu'
);

/**
 * Metinde açıkça yazılan madde göndermeleri, `maddeGondermesi`'nin okuyacağı bağlantı biçiminde (etiket numarayı taşır).
 * @param {string} metin
 * @returns {{ label: string, href: string }[]}
 */
export function metinGondermeleri(metin) {
  return [...String(metin).matchAll(KISALTMA_DESENI)].map(([etiket, kisaltma, no]) => ({
    label: etiket,
    href: `/mevzuat/${KISALTMALAR[kisaltma]}/madde-${no}`,
  }));
}

/**
 * Bağlantı bir maddeye açık gönderme mi? Adres madde sayfası olmalı. `madde-1` adresi çoğu yerde kanunun kendisi için
 * kullanılır ("İş Kanunu" → madde-1); etikette 1 numarası geçmiyorsa kanun düzeyinde sayılır ve alınmaz.
 * @param {{ label?: string, href?: string }} baglanti
 * @returns {string | null} `kanun/madde-N` ya da null
 */
export function maddeGondermesi(baglanti) {
  const m = String(baglanti?.href || '').match(MADDE);
  if (!m) return null;
  const [, kanun, no] = m;
  if (no === '1' && !/(^|[^0-9])1([^0-9]|$)/.test(String(baglanti.label || ''))) return null;
  return `${kanun}/madde-${no}`;
}

const sirala = (a, b) => TUR_SIRASI.indexOf(a.tur) - TUR_SIRASI.indexOf(b.tur) || a.ad.localeCompare(b.ad, 'tr') || a.yol.localeCompare(b.yol);

/**
 * @param {{ tur: string, ad: string, yol: string, baglantilar: { label?: string, href?: string }[] }[]} icerikler
 * @param {Set<string>} acikMaddeler  dizine açık madde anahtarları (`public/data/publishable.json` → `mevzuat`)
 * @returns {Record<string, { tur: string, ad: string, yol: string }[]>} anahtarı sıralı, değerleri sıralı ve tekil
 */
export function dizinKur(icerikler, acikMaddeler) {
  const harita = new Map();
  for (const ic of icerikler) {
    if (!TUR_SIRASI.includes(ic.tur)) throw new Error(`bilinmeyen içerik türü: ${ic.tur}`);
    for (const b of ic.baglantilar || []) {
      const anahtar = maddeGondermesi(b);
      if (!anahtar || !acikMaddeler.has(anahtar)) continue;
      if (!harita.has(anahtar)) harita.set(anahtar, new Map());
      harita.get(anahtar).set(ic.yol, { tur: ic.tur, ad: ic.ad, yol: ic.yol });
    }
  }
  const dizin = {};
  for (const anahtar of [...harita.keys()].sort()) dizin[anahtar] = [...harita.get(anahtar).values()].sort(sirala);
  return dizin;
}

/**
 * Dosya biçimi: içerik listesi bir kez, maddeler içerik sıra numarasıyla (ders notları yüzlerce maddeye değinir;
 * madde sayfasının belleğine giren dosya küçük kalır).
 * @param {Record<string, { tur: string, ad: string, yol: string }[]>} dizin
 * @returns {{ icerik: { tur: string, ad: string, yol: string }[], maddeler: Record<string, number[]> }}
 */
export function dizinSikistir(dizin) {
  const sira = new Map();
  const icerik = [];
  const maddeler = {};
  for (const [anahtar, liste] of Object.entries(dizin)) {
    maddeler[anahtar] = liste.map((o) => {
      if (!sira.has(o.yol)) {
        sira.set(o.yol, icerik.length);
        icerik.push(o);
      }
      return sira.get(o.yol);
    });
  }
  return { icerik, maddeler };
}

/**
 * @param {{ icerik: { tur: string, ad: string, yol: string }[], maddeler: Record<string, number[]> }} sikisik
 * @returns {Record<string, { tur: string, ad: string, yol: string }[]>}
 */
export function dizinAc({ icerik, maddeler }) {
  return Object.fromEntries(Object.entries(maddeler).map(([anahtar, sira]) => [anahtar, sira.map((i) => icerik[i])]));
}

/**
 * Bir içerik sayfası için aynı maddelere değinen diğer içerik: ortak madde sayısı çok olan önce, sonra tür ve ad sırası.
 * `haric`: sayfanın kendi listelerinde zaten gösterdiği adresler (tekrar edilmez).
 * @param {string} yol  sayfanın kendi adresi
 * @param {Record<string, { tur: string, ad: string, yol: string }[]>} dizin
 * @param {{ sinir?: number, haric?: string[] }} [secenek]
 */
export function ilgiliIcerik(yol, dizin, { sinir = 6, haric = [] } = {}) {
  const atla = new Set([yol, ...haric]);
  const puan = new Map();
  for (const liste of Object.values(dizin)) {
    if (!liste.some((o) => o.yol === yol)) continue;
    for (const o of liste) {
      if (atla.has(o.yol)) continue;
      const p = puan.get(o.yol);
      puan.set(o.yol, { oge: o, puan: (p?.puan || 0) + 1 });
    }
  }
  return [...puan.values()]
    .sort((a, b) => b.puan - a.puan || sirala(a.oge, b.oge))
    .slice(0, sinir)
    .map((x) => x.oge);
}

/**
 * Madde sayfası için o maddeye değinen içerik.
 * @param {string} anahtar `kanun/madde-N`
 * @param {Record<string, { tur: string, ad: string, yol: string }[]>} dizin
 * @param {number} [sinir]
 */
export function maddeyeDeginen(anahtar, dizin, sinir = 6) {
  return (dizin[anahtar] || []).slice(0, sinir);
}

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Madde sayfasının (rota işleyicisi, düz HTML) "Bu maddeye değinen içerik" bloğu; liste boşsa boş metin.
 * @param {{ tur: string, ad: string, yol: string }[]} liste
 * @param {string} site  mutlak adres kökü
 */
export function maddeIlgiliHtml(liste, site) {
  if (!liste.length) return '';
  const ogeler = liste
    .map((o) => `<li><span class="tur">${esc(TUR_ADI[o.tur] || o.tur)}</span> <a href="${esc(new URL(o.yol, site).href)}">${esc(o.ad)}</a></li>`)
    .join('\n');
  return `<section class="ilgili" aria-labelledby="ilgili-baslik">
<h2 id="ilgili-baslik" class="yazar-baslik">Bu maddeye değinen içerik</h2>
<ul>
${ogeler}
</ul>
</section>`;
}
