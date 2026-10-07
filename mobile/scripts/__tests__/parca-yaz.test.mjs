import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { parcalariYaz } from '../lib/parca-yaz.mjs';

const ad = (n) => `s${String(n).padStart(2, '0')}.json.gz`;
const oku = (klasor, dosya) => JSON.parse(gunzipSync(readFileSync(join(klasor, dosya))).toString('utf8'));

test('parcalariYaz: her parçayı kendi kararlarıyla yazar, boş parçayı atlar', () => {
  const klasor = mkdtempSync(join(tmpdir(), 'parca-yaz-'));
  try {
    const gruplar = [[['1', 'a.json'], ['2', 'b.json']], [], [['3', 'c.json']]];
    const metinler = { 'a.json': 'bir', 'b.json': 'iki', 'c.json': 'üç' };
    const sonuc = parcalariYaz({ gruplar, klasor, adlandir: ad, metniOku: (f) => metinler[f] });

    assert.deepEqual(readdirSync(klasor).sort(), ['s00.json.gz', 's02.json.gz']);
    assert.deepEqual(oku(klasor, 's00.json.gz'), { 1: 'bir', 2: 'iki' });
    assert.deepEqual(oku(klasor, 's02.json.gz'), { 3: 'üç' });
    assert.equal(sonuc.dosya, 2);
    assert.equal(sonuc.karar, 3);
    assert.ok(sonuc.bayt > 0);
  } finally {
    rmSync(klasor, { recursive: true, force: true });
  }
});

test('parcalariYaz: metni boş gelen kararı parçaya koymaz ve saymaz', () => {
  const klasor = mkdtempSync(join(tmpdir(), 'parca-yaz-'));
  try {
    const gruplar = [[['1', 'a.json'], ['2', 'yok.json']]];
    const sonuc = parcalariYaz({ gruplar, klasor, adlandir: ad, metniOku: (f) => (f === 'a.json' ? 'bir' : '') });
    assert.deepEqual(oku(klasor, 's00.json.gz'), { 1: 'bir' });
    assert.equal(sonuc.karar, 1);
  } finally {
    rmSync(klasor, { recursive: true, force: true });
  }
});

test('parcalariYaz: dosyaları parça sırasıyla ve her birini bir kez okur', () => {
  const klasor = mkdtempSync(join(tmpdir(), 'parca-yaz-'));
  try {
    const okunan = [];
    const gruplar = [[['1', 'a']], [['2', 'b'], ['3', 'c']]];
    parcalariYaz({ gruplar, klasor, adlandir: ad, metniOku: (f) => (okunan.push(f), f) });
    assert.deepEqual(okunan, ['a', 'b', 'c']);
  } finally {
    rmSync(klasor, { recursive: true, force: true });
  }
});
