/**
 * Paylaşım görselleri (Aylık plan G20): meta yardımcısı, kart metni ve kapalı kart kümesi.
 *   node --test lib/__tests__/paylasim.test.mjs
 */
import { register } from 'node:module';
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { baslikOlcusu, kartAgaci, kartMetni, kartFontlari } from '../paylasim-kart.mjs';

register('../uyelik/__tests__/ts-hooks.mjs', import.meta.url);
register('./json-hooks.mjs', import.meta.url);
const { paylasimAnahtari, paylasimMeta, paylasimGorselYolu } = await import('../paylasim.ts');

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

describe('paylasimAnahtari', () => {
  it('Türkçe harfleri katlar, yalnız a-z0-9- bırakır', () => {
    assert.equal(paylasimAnahtari('İş Hukuku ğüşıöç'), 'is-hukuku-gusioc');
    assert.equal(paylasimAnahtari('kategori-Tüketici Hakları'), 'kategori-tuketici-haklari');
    assert.equal(paylasimAnahtari('  TBK  '), 'tbk');
    assert.equal(paylasimAnahtari('hâkim'), 'hakim');
  });
  it('görsel yolu anahtarı katlar', () => {
    assert.equal(paylasimGorselYolu('kanun', 'TBK'), '/og/kanun/tbk');
  });
});

describe('paylasimMeta', () => {
  it('görsel, site adı, dil, tür ve büyük Twitter kartı her zaman doludur', () => {
    const { openGraph, twitter } = paylasimMeta({ baslik: 'Kıdem', aciklama: 'a', adres: '/hesaplama/kidem', tur: 'hesaplama', anahtar: 'kidem' });
    assert.equal(openGraph.url, 'https://www.avfethiguzel.com/hesaplama/kidem');
    assert.equal(openGraph.siteName, 'Av. Fethi Güzel Hukuk Portalı');
    assert.equal(openGraph.locale, 'tr_TR');
    assert.equal(openGraph.type, 'website');
    assert.deepEqual(openGraph.images, [
      { url: 'https://www.avfethiguzel.com/og/hesaplama/kidem', width: 1200, height: 630, alt: 'Kıdem', type: 'image/png' },
    ]);
    assert.equal(twitter.card, 'summary_large_image');
    assert.equal(twitter.images[0].url, openGraph.images[0].url);
  });
  it('kök meta adres, başlık ve açıklama taşımaz; miras alan sayfa ana sayfanın adresini göstermez', async () => {
    const { paylasimKokMeta } = await import('../paylasim.ts');
    const { openGraph, twitter } = paylasimKokMeta();
    for (const alan of ['url', 'title', 'description']) assert.equal(alan in openGraph, false, alan);
    for (const alan of ['title', 'description']) assert.equal(alan in twitter, false, alan);
    assert.equal(openGraph.siteName, 'Av. Fethi Güzel Hukuk Portalı');
    assert.equal(openGraph.images[0].url, 'https://www.avfethiguzel.com/og/site/genel');
    assert.equal(twitter.card, 'summary_large_image');
    assert.match(oku('app/layout.tsx'), /\.\.\.paylasimKokMeta\(\)/);
  });

  it('başlık verilmezse başlık alanı yazılmaz (Next sayfanın title değerini kullanır), görsel alt metni site adıdır', () => {
    const { openGraph, twitter } = paylasimMeta({ adres: '/gizlilik', tur: 'site' });
    assert.equal(openGraph.url, 'https://www.avfethiguzel.com/gizlilik');
    assert.equal('title' in openGraph, false);
    assert.equal('title' in twitter, false);
    assert.equal(openGraph.images[0].alt, 'Av. Fethi Güzel Hukuk Portalı');
  });

  it('anahtar verilmezse türün genel kartı', () => {
    const { openGraph } = paylasimMeta({ baslik: 'x', adres: 'https://www.avfethiguzel.com/', tur: 'site' });
    assert.equal(openGraph.images[0].url, 'https://www.avfethiguzel.com/og/site/genel');
    assert.equal('description' in openGraph, false);
  });
});

describe('kart', () => {
  it('kısa başlık büyük, uzun başlık küçük puntoyla; 120 karakteri aşan sözcük sınırında kısalır', () => {
    assert.equal(baslikOlcusu('Türk Borçlar Kanunu').punto, 76);
    const uzun = baslikOlcusu('Aşırı yararlanma (gabin) hâlinde sözleşmenin iptali ve sözleşmeye bağlılık ilkesinin istisnası olarak değerlendirilmesi, şartlar');
    assert.equal(uzun.punto, 48);
    assert.ok(uzun.metin.endsWith('…'));
    assert.ok(uzun.metin.length <= 121);
    assert.doesNotMatch(uzun.metin, /\s…$/);
  });

  it('reklam yasağı: kartta telefon, çağrı, sıfat ve yer + avukat kalıbı yok (m.7/1-d, m.7/1-e)', () => {
    const metin = kartMetni({ tur: 'Vatandaş rehberi', baslik: 'Kıdem tazminatı', ust: 'İş hukuku' });
    assert.match(metin, /Av\. Fethi Güzel/);
    assert.match(metin, /avfethiguzel\.com/);
    assert.doesNotMatch(metin, /\d{3}[\s.]?\d{3}[\s.]?\d{2}[\s.]?\d{2}|arabulucu|uzman|hemen|ara(yın)?\b|danışın|iletişim|WhatsApp/iu);
    assert.doesNotMatch(metin, /\b(Van|Erciş|Ankara|Ağrı|Bitlis|Tatvan|Patnos)\s+avukat/iu);
  });

  it('tür etiketi Türkçe kurala göre büyük harfle yazılır (Satori textTransform yerel ayarsız i → I yapar)', () => {
    assert.match(kartMetni({ tur: 'Vatandaş rehberi', baslik: 'x' }), /VATANDAŞ REHBERİ/);
    assert.doesNotMatch(JSON.stringify(kartAgaci({ tur: 'Ders notu', baslik: 'x' })), /textTransform/);
  });

  it('yazı tipleri ve lisansları depoda (Türkçe harfler latin-ext alt kümesinde)', () => {
    const fontlar = kartFontlari(KOK);
    assert.deepEqual(fontlar.map((f) => f.name), ['Outfit', 'OutfitExt', 'Jakarta', 'JakartaExt']);
    assert.ok(fontlar.every((f) => f.data.length > 4000));
    assert.deepEqual(readdirSync(join(KOK, 'assets/og')).filter((f) => f.startsWith('OFL')).sort(), ['OFL-Outfit.txt', 'OFL-PlusJakartaSans.txt']);
  });
});

describe('kart kümesi', () => {
  let kartlar;
  before(async () => {
    const { paylasimKartlari } = await import('../paylasim-kayit.ts');
    kartlar = await paylasimKartlari();
  });

  it('anahtarlar tür içinde tektir ve URL güvenlidir', () => {
    const gorulen = new Set();
    const cift = [];
    for (const k of kartlar) {
      assert.match(k.anahtar, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${k.tur}/${k.anahtar}`);
      const ad = `${k.tur}/${k.anahtar}`;
      if (gorulen.has(ad)) cift.push(ad);
      gorulen.add(ad);
    }
    assert.deepEqual(cift, []);
  });

  it('her kartın başlığı vardır; her türün genel kartı ya da en az bir kartı vardır', () => {
    assert.deepEqual(kartlar.filter((k) => !k.baslik?.trim()).map((k) => `${k.tur}/${k.anahtar}`), []);
    for (const tur of ['site', 'karar', 'rehber', 'ders-notu']) assert.ok(kartlar.some((k) => k.tur === tur && k.anahtar === 'genel'), tur);
  });

  it('sayfaların istediği kartlar kümede: her kanun, kavram, hesaplama aracı ve bölge yazısı', async () => {
    const { getAllKanunDirs } = await import('../api.ts');
    const { KAVRAMLAR } = await import('../kavramlar.ts');
    const { HESAPLAMA_ARACLAR } = await import('../hesaplama-meta.ts');
    const var_ = (tur, anahtar) => kartlar.some((k) => k.tur === tur && k.anahtar === paylasimAnahtari(anahtar));
    assert.deepEqual((await getAllKanunDirs()).filter((k) => !var_('kanun', k)), []);
    assert.deepEqual(KAVRAMLAR.filter((k) => !var_('kavram', k.slug)).map((k) => k.slug), []);
    assert.deepEqual(HESAPLAMA_ARACLAR.filter((a) => !var_('hesaplama', a.id)).map((a) => a.id), []);
  });

  it('temsilci ders notları sayfanın istediği anahtarla kümede; anahtar üniversiteyi bir kez taşır', async () => {
    const { dersNotuKartAnahtari } = await import('../paylasim.ts');
    const { getNote } = await import('../ders-notlari/index.ts');
    const kanonik = JSON.parse(oku('lib/ders-notlari/dizin-kanonik.json'));
    const anahtarlar = Object.values(kanonik.dersler).map(({ uni, ders }) => dersNotuKartAnahtari(getNote(uni, ders)));
    assert.equal(anahtarlar.length, 26);
    assert.deepEqual(anahtarlar.filter((a) => !kartlar.some((k) => k.tur === 'ders-notu' && k.anahtar === a)), []);
    assert.equal(dersNotuKartAnahtari(getNote('ankara', 'aile-hukuku-yillik')), 'ankara-aile-hukuku-yillik');
    assert.match(oku('app/ders-notlari/[uni]/[ders]/page.tsx'), /dersNotuKartAnahtari\(note\)/);
  });

  it('bölge sayfaları sayfa başına kart almaz (soru 10 açık)', () => {
    assert.deepEqual(kartlar.filter((k) => /avukat/.test(k.anahtar)).map((k) => k.anahtar), ['avukat-fethi-guzel']);
  });
});

function kaynaklar(dizin) {
  const sonuc = [];
  for (const o of readdirSync(join(KOK, dizin), { withFileTypes: true })) {
    const yol = `${dizin}/${o.name}`;
    if (o.isDirectory()) sonuc.push(...kaynaklar(yol));
    else if (/\.(ts|tsx)$/.test(o.name)) sonuc.push(yol);
  }
  return sonuc;
}

describe('kaynak kilitleri', () => {
  it('app altında openGraph/twitter nesnesi elle yazılmaz; paylasimMeta kullanılır (görsel ve site adı düşüyordu)', () => {
    const elle = kaynaklar('app').filter((f) => /\b(openGraph|twitter)\s*:\s*\{/.test(oku(f)));
    assert.deepEqual(elle, []);
  });

  it('noindex olmayan her sayfa paylasimMeta’yı kendisinde ya da yerleşim zincirinde çağırır (kökü miras alan sayfada og:url yoktur)', () => {
    // Çalışma anında üretilen, derleme taramasının görmediği sayfalar; kökten site kartını ve kendi başlığını alır.
    const ISTISNA = ['app/[category]/[slug]/[maddeId]/page.tsx', 'app/icthat/[id]/page.tsx', 'app/makale-oku/[...slug]/page.tsx'];
    // 2026-10-12: `eserlerim` ve `on-form` meta verisini yerleşimde taşıyor, `bookmarklet` hiç meta vermiyordu; üçü de
    // yalnız sayfa dosyasına bakan kilitten geçti. Yorumdaki "noindex" sözcüğü de `site-haritasi`'ni istisna saydırıyordu.
    const zincir = (f) => {
      const dosyalar = [f];
      for (let d = dirname(f); d !== 'app'; d = dirname(d)) {
        if (readdirSync(join(KOK, d)).includes('layout.tsx')) dosyalar.push(`${d}/layout.tsx`);
      }
      return dosyalar.map(oku).join('\n');
    };
    const eksik = kaynaklar('app')
      .filter((f) => f.endsWith('/page.tsx') && !ISTISNA.includes(f))
      .filter((f) => {
        const src = zincir(f);
        const yalnizYonlendirir = /\b(permanentRedirect|redirect)\(/.test(oku(f)) && !/\breturn\b/.test(oku(f));
        return !yalnizYonlendirir && !/index:\s*false|['"]noindex/.test(src) && !src.includes('paylasimMeta(');
      });
    assert.deepEqual(eksik, []);
  });

  it('madde sayfası şablonu kanun kartını ve büyük Twitter kartını taşır', () => {
    const src = oku('app/mevzuat/[kanunId]/[id]/route.ts');
    assert.match(src, /og:image" content="\$\{/);
    assert.match(src, /twitter:card" content="summary_large_image"/);
    assert.match(src, /paylasimGorselYolu\('kanun'/);
  });

  it('görsel rotası kapalı kümedir: bilinmeyen anahtar üretilmez, sorgu dizgisi okunmaz', () => {
    const src = oku('app/og/[tur]/[anahtar]/route.tsx');
    assert.match(src, /export const dynamicParams = false/);
    assert.match(src, /generateStaticParams/);
    assert.doesNotMatch(src, /searchParams|nextUrl|request\.url/);
  });
});
