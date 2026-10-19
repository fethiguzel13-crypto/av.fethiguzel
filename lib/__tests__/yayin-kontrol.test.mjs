// G26: Yayın günü Vercel'de tanımlanacak ortam değişkenleri `docs/aylik-plan/PUSH-KONTROL-LISTESI.md`'de elle tutulur.
// Koda yeni bir `process.env` adı eklenip liste güncellenmezse yayında eksik değişken fark edilmez; bu test ikisini eşit tutar.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const LISTE = 'docs/aylik-plan/PUSH-KONTROL-LISTESI.md';
const KLASORLER = ['app', 'lib', 'components'];
const DOSYALAR = ['next.config.ts'];
const UZANTI = /\.(ts|tsx|mjs|js|cjs)$/;

function dolas(klasor, cikti = []) {
  for (const ad of readdirSync(klasor)) {
    if (ad === 'node_modules' || ad === '__tests__' || ad === 'generated') continue;
    const yol = join(klasor, ad);
    if (statSync(yol).isDirectory()) dolas(yol, cikti);
    else if (UZANTI.test(ad)) cikti.push(yol);
  }
  return cikti;
}

function koddakiAdlar() {
  const dosyalar = [...KLASORLER.flatMap((k) => dolas(join(kok, k))), ...DOSYALAR.map((d) => join(kok, d))];
  const adlar = new Set();
  for (const d of dosyalar) {
    const metin = readFileSync(d, 'utf8');
    for (const m of metin.matchAll(/process\.env\.([A-Z][A-Z0-9_]*)/g)) adlar.add(m[1]);
    // lib/uyelik/config.ts adları `envTrim('AD')` yardımcısıyla okur.
    for (const m of metin.matchAll(/envTrim\(\s*['"]([A-Z][A-Z0-9_]*)['"]\s*\)/g)) adlar.add(m[1]);
  }
  return adlar;
}

test('kontrol listesi vardır', () => {
  assert.ok(existsSync(join(kok, LISTE)), `${LISTE} yok`);
});

test('koddaki her ortam değişkeni adı kontrol listesinde ters tırnak içinde geçer', () => {
  const adlar = koddakiAdlar();
  assert.ok(adlar.size >= 20, `beklenenden az ad bulundu (${adlar.size}); tarama bozulmuş olabilir`);
  const liste = existsSync(join(kok, LISTE)) ? readFileSync(join(kok, LISTE), 'utf8') : '';
  const eksik = [...adlar].filter((ad) => !liste.includes(`\`${ad}\``)).sort();
  assert.deepEqual(eksik, [], `listede olmayan adlar: ${eksik.join(', ')}`);
});

test('kontrol listesi değer taşımaz (AD=değer biçimi yalnız <yer tutucu> ile yazılır)', () => {
  const liste = existsSync(join(kok, LISTE)) ? readFileSync(join(kok, LISTE), 'utf8') : '';
  const adlar = koddakiAdlar();
  const atamalar = [...liste.matchAll(/\b([A-Z][A-Z0-9_]{3,})=(\S+)/g)]
    .filter((m) => adlar.has(m[1]) && !m[2].startsWith('<'))
    .map((m) => m[0]);
  assert.deepEqual(atamalar, []);
});
