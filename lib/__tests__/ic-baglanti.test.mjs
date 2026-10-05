/**
 * İç bağlantı dizini (Aylık plan G12 adım 7–8): madde → o maddeye açıkça değinen rehber, kavram ve hesaplama.
 * Ölçüm (2026-10-05): 1.748 iç bağlantının 196'sı madde adresi; madde ile içerik türleri arasında ilgili içerik bloğu yoktu.
 *   node --test lib/__tests__/ic-baglanti.test.mjs
 */
import { register } from 'node:module';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dizinKur, ilgiliIcerik, maddeGondermesi, maddeIlgiliHtml, maddeyeDeginen } from '../ic-baglanti/dizin.mjs';

register('../uyelik/__tests__/ts-hooks.mjs', import.meta.url);
register('./tsx-hooks.mjs', import.meta.url);

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

describe('maddeGondermesi', () => {
  it('madde adresini anahtara çevirir; madde dışı adres ve kanun düzeyindeki madde-1 alınmaz', () => {
    assert.equal(maddeGondermesi({ label: 'TBK m.207', href: '/mevzuat/tbk/madde-207' }), 'tbk/madde-207');
    assert.equal(maddeGondermesi({ label: 'TMK saklı pay', href: '/mevzuat/tmk/madde-506' }), 'tmk/madde-506');
    assert.equal(maddeGondermesi({ label: 'İş Kanunu', href: '/mevzuat/is-kanunu/madde-1' }), null);
    assert.equal(maddeGondermesi({ label: 'TBK m.1 (öneri)', href: '/mevzuat/tbk/madde-1' }), 'tbk/madde-1');
    assert.equal(maddeGondermesi({ label: 'TBK m.10', href: '/mevzuat/tbk/madde-1' }), null);
    assert.equal(maddeGondermesi({ label: 'Arama', href: '/ara?q=kira' }), null);
    assert.equal(maddeGondermesi({ label: 'Kanun', href: '/mevzuat/tbk' }), null);
  });
});

describe('metinGondermeleri (ders notu)', () => {
  it('doğrulanmış kısaltmadaki madde göndermesini bağlantıya çevirir; eşlenmeyen kısaltma ve sözcük içi eşleşme alınmaz', async () => {
    const { metinGondermeleri } = await import('../ic-baglanti/dizin.mjs');
    const metin = 'Nişanlanma TMK m. 118 ile başlar; TMK m.119 ve İİK md. 89, İşK m. 18 ile HUAK madde 18. KMK m. 5, FSEK m. 1 ve ATMK m. 7 alınmaz.';
    assert.deepEqual(metinGondermeleri(metin).map((b) => b.href), [
      '/mevzuat/tmk/madde-118',
      '/mevzuat/tmk/madde-119',
      '/mevzuat/iik/madde-89',
      '/mevzuat/is-kanunu/madde-18',
      '/mevzuat/arabuluculuk/madde-18',
    ]);
    assert.ok(metinGondermeleri(metin).every((b) => maddeGondermesi(b)), 'etiket numarayı taşır');
  });
});

describe('dizin dosya biçimi', () => {
  it('sıkıştırılmış biçim içeriği bir kez taşır ve geri açılınca aynı dizini verir', async () => {
    const { dizinSikistir, dizinAc } = await import('../ic-baglanti/dizin.mjs');
    const o = (yol) => ({ tur: 'rehber', ad: yol, yol });
    const dizin = { 'tbk/madde-1': [o('/bilgi/a'), o('/bilgi/b')], 'tbk/madde-2': [o('/bilgi/b')] };
    const s = dizinSikistir(dizin);
    assert.equal(s.icerik.length, 2);
    assert.deepEqual(dizinAc(s), dizin);
  });
});

describe('dizinKur ve sorgular', () => {
  const icerikler = [
    { tur: 'hesaplama', ad: 'Kıdem', yol: '/hesaplama/kidem', baglantilar: [{ label: 'İş K. m.17', href: '/mevzuat/is-kanunu/madde-17' }] },
    { tur: 'rehber', ad: 'İhbar süresi', yol: '/bilgi/ihbar', baglantilar: [
      { label: 'İş K. m.17', href: '/mevzuat/is-kanunu/madde-17' },
      { label: 'İş K. m.17', href: '/mevzuat/is-kanunu/madde-17' },
      { label: 'İş K. m.18', href: '/mevzuat/is-kanunu/madde-18' },
      { label: 'Kapalı madde', href: '/mevzuat/is-kanunu/madde-999' },
    ] },
    { tur: 'kavram', ad: 'İşe iade', yol: '/kavram/ise-iade', baglantilar: [{ label: 'İş K. m.18', href: '/mevzuat/is-kanunu/madde-18' }, { label: 'İş K. m.17', href: '/mevzuat/is-kanunu/madde-17' }] },
  ];
  const acik = new Set(['is-kanunu/madde-17', 'is-kanunu/madde-18']);
  const dizin = dizinKur(icerikler, acik);

  it('yalnız açık maddeler; içerik bir kez; tür sırası rehber, kavram, hesaplama', () => {
    assert.deepEqual(Object.keys(dizin), ['is-kanunu/madde-17', 'is-kanunu/madde-18']);
    assert.deepEqual(dizin['is-kanunu/madde-17'].map((o) => o.yol), ['/bilgi/ihbar', '/kavram/ise-iade', '/hesaplama/kidem']);
  });

  it('içerik sayfası için ortak maddesi çok olan önce gelir, kendisi listede yok', () => {
    assert.deepEqual(ilgiliIcerik('/bilgi/ihbar', dizin).map((o) => o.yol), ['/kavram/ise-iade', '/hesaplama/kidem']);
    assert.deepEqual(ilgiliIcerik('/bilgi/ihbar', dizin, { sinir: 1 }).map((o) => o.yol), ['/kavram/ise-iade']);
    assert.deepEqual(ilgiliIcerik('/bilgi/ihbar', dizin, { haric: ['/kavram/ise-iade'] }).map((o) => o.yol), ['/hesaplama/kidem']);
    assert.deepEqual(ilgiliIcerik('/bilgi/yok', dizin), []);
  });

  it('madde sayfası için değinen içerik, sınırlı', () => {
    assert.equal(maddeyeDeginen('is-kanunu/madde-17', dizin, 2).length, 2);
    assert.deepEqual(maddeyeDeginen('tbk/madde-1', dizin), []);
  });

  it('madde sayfası bloğu: tür etiketi, mutlak adres, kaçışlı ad; boş listede boş metin', () => {
    const html = maddeIlgiliHtml([{ tur: 'rehber', ad: 'Kira <artış> & tespit', yol: '/bilgi/kira-artışı' }], 'https://www.avfethiguzel.com');
    assert.match(html, /<section class="ilgili"[^>]*>/);
    assert.ok(html.includes('<span class="tur">Rehber</span>'));
    assert.ok(html.includes('href="https://www.avfethiguzel.com/bilgi/kira-art%C4%B1%C5%9F%C4%B1"'));
    assert.ok(html.includes('>Kira &lt;artış&gt; &amp; tespit</a>'));
    assert.equal(maddeIlgiliHtml([], 'https://www.avfethiguzel.com'), '');
  });

  it('bilinmeyen içerik türünü reddeder', () => {
    assert.throws(() => dizinKur([{ tur: 'not', ad: 'x', yol: '/x', baglantilar: [] }], acik), /tür/);
  });
});

describe('<IlgiliIcerik>', () => {
  const ciz = async (props) => {
    const { createElement } = await import('react');
    const { renderToStaticMarkup } = await import('react-dom/server');
    const { default: IlgiliIcerik } = await import(pathToFileURL(join(KOK, 'components/IlgiliIcerik.tsx')).href);
    return renderToStaticMarkup(createElement(IlgiliIcerik, props));
  };

  it('tür etiketiyle bağlantıları çizer; boş listede hiçbir şey çizmez', async () => {
    const html = await ciz({ ogeler: [{ tur: 'kavram', ad: 'İşe iade', yol: '/kavram/ise-iade' }, { tur: 'hesaplama', ad: 'Kıdem', yol: '/hesaplama/kidem' }] });
    assert.match(html, /<h2[^>]*>Aynı maddelere değinen içerik<\/h2>/);
    assert.deepEqual([...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]), ['/kavram/ise-iade', '/hesaplama/kidem']);
    assert.ok(html.includes('>Kavram</span>'));
    assert.equal(await ciz({ ogeler: [] }), '');
  });
});

describe('sayfalar bloğu dizinden basar', () => {
  for (const dosya of ['app/kavram/[slug]/page.tsx', 'app/hesaplama/[slug]/page.tsx', 'app/bilgi/[slug]/page.tsx', 'app/ders-notlari/[uni]/[ders]/page.tsx']) {
    it(dosya, () => {
      const kaynak = readFileSync(join(KOK, dosya), 'utf8');
      assert.ok(kaynak.includes('<IlgiliIcerik'), 'blok yok');
      assert.ok(kaynak.includes('sayfaIlgiliIcerik('), 'liste dizinden alınmıyor');
    });
  }
  it('madde sayfası (rota işleyicisi)', () => {
    const kaynak = readFileSync(join(KOK, 'app/mevzuat/[kanunId]/[id]/route.ts'), 'utf8');
    assert.ok(kaynak.includes('maddeIlgiliHtml('));
  });
});

describe('gerçek veri', () => {
  it('dizin.json güncel (değiştiyse: node scripts/ic-baglanti-dizini.mjs)', async () => {
    const { dizinHesapla, dizinMetni, DIZIN_YOLU } = await import('../../scripts/lib/ic-baglanti-kaynak.mjs');
    assert.equal(readFileSync(join(KOK, DIZIN_YOLU), 'utf8').replace(/\r\n/g, '\n'), dizinMetni(await dizinHesapla(KOK)));
  });

  it('dizindeki her hedef dizine açık: rehber yayında, kavram ve araç var, ders notu temsilci, madde yayınlanabilir', async () => {
    const { dizinAc } = await import('../ic-baglanti/dizin.mjs');
    const dizin = dizinAc(JSON.parse(readFileSync(join(KOK, 'lib', 'ic-baglanti', 'dizin.json'), 'utf8')));
    const { readPublished } = await import('../../scripts/lib/read-guides.mjs');
    const { KAVRAMLAR } = await import(pathToFileURL(join(KOK, 'lib', 'kavramlar.ts')).href);
    const { HESAPLAMA_ARACLAR } = await import(pathToFileURL(join(KOK, 'lib', 'hesaplama-meta.ts')).href);
    const temsilciler = Object.values(JSON.parse(readFileSync(join(KOK, 'lib', 'ders-notlari', 'dizin-kanonik.json'), 'utf8')).dersler);
    const acikYol = new Set([
      ...readPublished(KOK).published.map((r) => `/bilgi/${r.slug}`),
      ...KAVRAMLAR.map((k) => `/kavram/${k.slug}`),
      ...HESAPLAMA_ARACLAR.map((h) => `/hesaplama/${h.id}`),
      ...temsilciler.map((t) => `/ders-notlari/${t.uni}/${t.ders}`),
    ]);
    const turler = new Set(Object.values(dizin).flat().map((o) => o.tur));
    assert.ok(turler.has('ders-notu'), 'ders notu dizinde yok');
    const acikMadde = new Set(JSON.parse(readFileSync(join(KOK, 'public', 'data', 'publishable.json'), 'utf8')).mevzuat);
    const kapali = [];
    for (const [madde, liste] of Object.entries(dizin)) {
      if (!acikMadde.has(madde)) kapali.push(madde);
      for (const o of liste) if (!acikYol.has(o.yol)) kapali.push(`${madde} → ${o.yol}`);
    }
    assert.deepEqual(kapali, []);
    assert.ok(Object.keys(dizin).length >= 100, `dizinde ${Object.keys(dizin).length} madde`);
  });
});
