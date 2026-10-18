// G25 adım 4: Eski alan sayfaları (`/medeni-hukuk`, `/borclar-hukuku/genel-hukumler` vb.) yönlendirme dışında kalmıştı.
// Kendi adresini canonical gösteriyor, `sitemap.xml`'de duruyordu, sitenin içinden bağlantı almıyordu. Aynı madde listesi
// `/mevzuat/<kanun>`'da güncel tasarımla durduğundan on yedi adres oraya 308 ile gider ve haritadan çıkar.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const oku = (p) => readFileSync(join(kok, p), 'utf8');

const ALANLAR = [
  { slug: 'medeni-hukuk', kanun: 'tmk' },
  { slug: 'borclar-hukuku', kanun: 'tbk' },
  { slug: 'ticaret-hukuku', kanun: 'ttk' },
];

async function yonlendirmeler() {
  const { default: yapilandirma } = await import(pathToFileURL(join(kok, 'next.config.ts')).href);
  const liste = await yapilandirma.redirects();
  return new Map(liste.map((r) => [r.source, { hedef: r.destination, kalici: r.permanent }]));
}

test('alan, alt alan ve madde adresi /mevzuat/<kanun> altına kalıcı yönlenir', async () => {
  const y = await yonlendirmeler();
  for (const { slug, kanun } of ALANLAR) {
    assert.deepEqual(y.get(`/${slug}`), { hedef: `/mevzuat/${kanun}`, kalici: true }, `/${slug}`);
    assert.deepEqual(y.get(`/${slug}/:sub`), { hedef: `/mevzuat/${kanun}`, kalici: true }, `/${slug}/:sub`);
    assert.deepEqual(y.get(`/${slug}/:sub/:maddeId`), { hedef: `/mevzuat/${kanun}/:maddeId`, kalici: true });
  }
});

test('site haritası eski alan adreslerini taşımaz', () => {
  const harita = oku('app/sitemap.ts');
  assert.doesNotMatch(harita, /lawCategories/, 'app/sitemap.ts hâlâ lawCategories adreslerini üretiyor');
});
