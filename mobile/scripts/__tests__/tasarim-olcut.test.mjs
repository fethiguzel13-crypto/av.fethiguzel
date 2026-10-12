import { test } from 'node:test';
import assert from 'node:assert/strict';

import { harfAraligiEm, harfAraligiDar, HARF_ARALIGI } from '../lib/tasarim-olcut.mjs';

test('harfAraligiEm: hesaplanmış değeri puntoya oranlar, normal sıfırdır', () => {
  assert.equal(harfAraligiEm('normal', 16), 0);
  assert.equal(harfAraligiEm('-0.4px', 16), -0.025);
  assert.equal(harfAraligiEm('1.56px', 12), 0.13);
  assert.equal(harfAraligiEm('', 16), 0);
});

test('harfAraligiDar: küçük puntoda tracking-tight bulgudur (üst çubuk başlığı, 16 px)', () => {
  assert.equal(harfAraligiDar({ px: 16, harfAraligi: '-0.4px' }), true);
  assert.equal(harfAraligiDar({ px: 15, harfAraligi: '-0.375px' }), true);
});

test('harfAraligiDar: büyük başlıkta sıkı aralık serbesttir', () => {
  assert.equal(harfAraligiDar({ px: 24, harfAraligi: '-0.6px' }), false);
  assert.equal(harfAraligiDar({ px: HARF_ARALIGI.puntoSiniri, harfAraligi: '-0.5px' }), false);
});

test('harfAraligiDar: normal, açık ve eşik içindeki hafif sıkılık bulgu değildir', () => {
  assert.equal(harfAraligiDar({ px: 14, harfAraligi: 'normal' }), false);
  assert.equal(harfAraligiDar({ px: 12, harfAraligi: '1.56px' }), false);
  assert.equal(harfAraligiDar({ px: 16, harfAraligi: '-0.16px' }), false);
});
