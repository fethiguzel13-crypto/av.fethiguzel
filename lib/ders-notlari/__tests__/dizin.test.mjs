import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dersKoku, notOzeti, temsilcileriBelirle, notDizinKarari, hubDizinde } from '../dizin.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

// G11: 26 ders kökü × 3 sürüm × 84 üniversitenin ad değiştirmeli kopyaları dizinde kalmaz;
// her kök için tek temsilci (yıllık sürüm) dizine açıktır.

const KALIP =
  'Omurga bozulduğunda unsurlar boşlukta asılı kalır. Tür seçilmeden ayıp yazmak hatadır.';

function not(uniSlug, courseCode, { kaynak = 0, metin = 'Borç ilişkisi', variantOf } = {}) {
  return {
    uniSlug,
    courseCode,
    variantOf,
    sources: Array.from({ length: kaynak }, (_, i) => ({ title: `k${i}`, url: `https://ornek.edu.tr/${i}` })),
    sections: [{ heading: 'Giriş', paragraphs: [metin] }],
  };
}

const UNILER = [
  { slug: 'ankara', priority: 1 },
  { slug: 'istanbul', priority: 1 },
  { slug: 'mef', priority: 2 },
];

test('ders kökü variantOf alanından, yoksa sürüm ekinden çıkarılır', () => {
  assert.equal(dersKoku({ courseCode: 'borclar-genel-yillik', variantOf: 'borclar-genel' }), 'borclar-genel');
  assert.equal(dersKoku({ courseCode: 'aile-hukuku-donem-2' }), 'aile-hukuku');
  assert.equal(dersKoku({ courseCode: 'is-hukuku-yillik' }), 'is-hukuku');
  assert.equal(dersKoku({ courseCode: 'roma-hukuku' }), 'roma-hukuku');
});

test('not özeti yalnız adresli kaynakları sayar ve kalıp metni yayınlanamaz işaretler', () => {
  const n = not('ankara', 'borclar-genel-yillik', { kaynak: 2 });
  n.sources.push({ title: 'adressiz' });
  assert.deepEqual(notOzeti(n), {
    uniSlug: 'ankara',
    courseCode: 'borclar-genel-yillik',
    kok: 'borclar-genel',
    kaynak: 2,
    publishable: true,
  });
  assert.equal(notOzeti(not('mef', 'borclar-genel-yillik', { metin: KALIP })).publishable, false);
});

test('temsilci yalnız yayınlanabilir yıllık sürümden, en çok kaynaklı nottan seçilir', () => {
  const ozetler = [
    not('ankara', 'borclar-genel-donem-1', { kaynak: 9 }),
    not('ankara', 'borclar-genel-yillik', { kaynak: 1 }),
    not('mef', 'borclar-genel-yillik', { kaynak: 3 }),
    not('istanbul', 'borclar-genel-yillik', { kaynak: 5, metin: KALIP }),
  ].map(notOzeti);
  const k = temsilcileriBelirle(ozetler, UNILER);
  assert.deepEqual(k, { 'borclar-genel': { uni: 'mef', ders: 'borclar-genel-yillik' } });
});

test('kaynak eşitse önceliği yüksek üniversite, o da eşitse alfabetik ilk slug seçilir', () => {
  const ozetler = [
    not('mef', 'is-hukuku-yillik', { kaynak: 2 }),
    not('istanbul', 'is-hukuku-yillik', { kaynak: 2 }),
    not('ankara', 'is-hukuku-yillik', { kaynak: 2 }),
  ].map(notOzeti);
  assert.deepEqual(temsilcileriBelirle(ozetler, UNILER)['is-hukuku'], { uni: 'ankara', ders: 'is-hukuku-yillik' });
  assert.deepEqual(
    temsilcileriBelirle(ozetler.filter((o) => o.uniSlug !== 'ankara'), UNILER)['is-hukuku'],
    { uni: 'istanbul', ders: 'is-hukuku-yillik' }
  );
});

test('yayınlanabilir yıllık sürümü olmayan kök temsilcisiz kalır', () => {
  const ozetler = [not('ankara', 'roma-hukuku-donem-1', { kaynak: 4 })].map(notOzeti);
  assert.deepEqual(temsilcileriBelirle(ozetler, UNILER), {});
});

const KANONIK = { dersler: { 'borclar-genel': { uni: 'ankara', ders: 'borclar-genel-yillik' } } };

test('dizin kararı: temsilci açık; aynı dersin başka üniversitesi ve dönem sürümü kopya; kalıp metin kapalı', () => {
  assert.deepEqual(notDizinKarari(not('ankara', 'borclar-genel-yillik'), KANONIK), { index: true, neden: 'temsilci' });
  assert.deepEqual(notDizinKarari(not('mef', 'borclar-genel-yillik'), KANONIK), { index: false, neden: 'kopya' });
  assert.deepEqual(notDizinKarari(not('ankara', 'borclar-genel-donem-1'), KANONIK), { index: false, neden: 'kopya' });
  assert.deepEqual(notDizinKarari(not('ankara', 'borclar-genel-yillik', { metin: KALIP }), KANONIK), {
    index: false,
    neden: 'kalip',
  });
  assert.deepEqual(notDizinKarari(not('ankara', 'roma-hukuku-yillik'), KANONIK), { index: false, neden: 'kopya' });
});

test('fakülte sayfası yalnız temsilci not barındırıyorsa dizine açıktır', () => {
  assert.equal(hubDizinde('ankara', KANONIK), true);
  assert.equal(hubDizinde('mef', KANONIK), false);
});

test('dizin-kanonik.json: kök başına bir yıllık temsilci, dosyası var ve yayınlanabilir', () => {
  const yol = join(ROOT, 'lib', 'ders-notlari', 'dizin-kanonik.json');
  assert.ok(existsSync(yol), 'lib/ders-notlari/dizin-kanonik.json yok — node scripts/ders-notlari-kanonik.mjs');
  const kanonik = JSON.parse(readFileSync(yol, 'utf8'));
  const girdiler = Object.entries(kanonik.dersler);
  assert.ok(girdiler.length > 0);
  for (const [kok, { uni, ders }] of girdiler) {
    assert.equal(ders, `${kok}-yillik`);
    const dosya = join(ROOT, 'lib', 'ders-notlari', 'generated', 'notes', `${uni}__${ders}.json`);
    assert.ok(existsSync(dosya), `${uni}/${ders} dosyası yok`);
    const n = JSON.parse(readFileSync(dosya, 'utf8'));
    assert.deepEqual(notDizinKarari(n, kanonik), { index: true, neden: 'temsilci' }, `${uni}/${ders}`);
  }
});

test('not ve fakülte sayfası robots kararını dizin işlevinden alır', () => {
  const notSayfasi = readFileSync(join(ROOT, 'app', 'ders-notlari', '[uni]', '[ders]', 'page.tsx'), 'utf8');
  assert.match(notSayfasi, /notDizinKarari\(/);
  assert.doesNotMatch(notSayfasi, /robots:\s*quality\.publishable/);
  const hubSayfasi = readFileSync(join(ROOT, 'app', 'ders-notlari', '[uni]', 'page.tsx'), 'utf8');
  assert.match(hubSayfasi, /hubDizinde\(/);
  assert.doesNotMatch(hubSayfasi, /hasPublishableNote/);
});

test('site haritası yalnız temsilci notu ve onu barındıran fakülte sayfasını içerir', async () => {
  const { dersNotuHaritaAdresleri } = await import('../../../scripts/build-ders-notlari-sitemap.mjs');
  const idx = {
    universities: [
      { slug: 'ankara', priority: 1 },
      { slug: 'mef', priority: 2 },
    ],
    notes: [
      { uniSlug: 'ankara', courseCode: 'borclar-genel-yillik', href: '/ders-notlari/ankara/borclar-genel-yillik' },
      { uniSlug: 'ankara', courseCode: 'borclar-genel-donem-1', href: '/ders-notlari/ankara/borclar-genel-donem-1' },
      { uniSlug: 'mef', courseCode: 'borclar-genel-yillik', href: '/ders-notlari/mef/borclar-genel-yillik' },
    ],
  };
  const notOku = (n) => not(n.uniSlug, n.courseCode);
  const adresler = dersNotuHaritaAdresleri(idx, KANONIK, notOku).map((u) => u.loc);
  assert.deepEqual(adresler, [
    'https://www.avfethiguzel.com/ders-notlari',
    'https://www.avfethiguzel.com/ders-notlari/ankara',
    'https://www.avfethiguzel.com/ders-notlari/ankara/borclar-genel-yillik',
  ]);
  // Temsilci not sonradan kalıp metne dönerse haritadan düşer.
  const kalipOku = (n) => not(n.uniSlug, n.courseCode, { metin: KALIP });
  assert.equal(dersNotuHaritaAdresleri(idx, KANONIK, kalipOku).length, 2);
});
