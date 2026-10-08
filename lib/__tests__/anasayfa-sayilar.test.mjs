import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/*
  G16: Külliyat sayıları (kanun, madde, şerh, karar, rehber, araç) ana sayfada ve yazar sayfalarında elle yazılmaz.
  Elle yazılan sayılar üretimden okunanlardan kopmuştu: Aynı sayfada 8.000+ ile 7.800+, 550+ ile 554 yan yana duruyordu.
  Sayılar `siteSayilari()`'ndan gelir ya da metin sayısız yazılır.
*/
const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const DOSYALAR = [
  'app/page.tsx',
  'app/avukat-fethi-guzel/page.tsx',
  'app/akademik-profil/page.tsx',
  'app/eserlerim/page.tsx',
  'components/Hero.tsx',
  'components/TrustBar.tsx',
  'components/CredentialsStrip.tsx',
  'components/LibraryStrip.tsx',
  'components/About.tsx',
  'components/Footer.tsx',
  'components/FaqSection.tsx',
  'components/YargiPreview.tsx',
  'components/ToolsPreview.tsx',
  'lib/profile.ts',
];

// «554 vatandaş», «7.800+ madde», «45+ kanun», «7.800’ü aşkın madde», «33 araç», «50+ ana rehber», «'7.800+'».
const ELLE_SAYI =
  /\b\d{1,3}(?:\.\d{3})*(?:\+|[’'][a-zçğıöşü]+)?\s*(?:aşkın\s+|[’'][a-z]+\s+fazla\s+)?(?:kanun|madde|şerh|karar|rehber|vatandaş|mevzuat|ana rehber|araç)/giu;
const TIRNAKLI_SAYI = /['"`]\d{1,3}(?:\.\d{3})*\+['"`]/g;

test('ana sayfa ve yazar sayfalarında elle yazılmış külliyat sayısı yoktur', () => {
  const bulunan = [];
  for (const d of DOSYALAR) {
    const s = readFileSync(join(kok, d), 'utf8');
    for (const m of s.matchAll(ELLE_SAYI)) bulunan.push(`${d}: ${m[0]}`);
    for (const m of s.matchAll(TIRNAKLI_SAYI)) bulunan.push(`${d}: ${m[0]}`);
  }
  assert.deepEqual(bulunan, []);
});

test('PROFILE.stats elle yazılmış sayı kaynağı olarak kullanılmaz', () => {
  const bulunan = DOSYALAR.filter((d) => /PROFILE\.stats\b|^\s*stats:\s*\{/m.test(readFileSync(join(kok, d), 'utf8')));
  assert.deepEqual(bulunan, []);
});

test('okura dönük metinde arama motoru notu ve uyum beyanı yoktur', () => {
  const bulunan = [];
  for (const d of ['app/page.tsx', 'components/TrustBar.tsx', 'components/CredentialsStrip.tsx', 'components/About.tsx', 'app/eserlerim/page.tsx']) {
    const s = readFileSync(join(kok, d), 'utf8');
    for (const m of s.matchAll(/Arama motorları için|reklam yasağına uygun|nesnel (?:unvan|mesleki|yayın)|sonuç vaadi yok/giu)) {
      bulunan.push(`${d}: ${m[0]}`);
    }
  }
  assert.deepEqual(bulunan, []);
});
