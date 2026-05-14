import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { normalizeResmiGazete } from '../normalize.js';

const fixture = JSON.parse(
  await readFile(new URL('../../fixtures/raw-sample.json', import.meta.url), 'utf-8')
);

test('normalizeResmiGazete maps title, date, url, category', () => {
  const items = normalizeResmiGazete(fixture.sources.resmigazete);
  assert.equal(items.length, 1);
  const item = items[0];
  assert.equal(item.source, 'RG');
  assert.equal(item.sourceLabel, 'Resmî Gazete');
  assert.equal(item.category, 'Yönetmelik');
  assert.equal(item.title, 'Konkordato Talebine Eklenecek Belgeler Hakkında Yönetmelikte Değişiklik Yapılmasına Dair Yönetmelik');
  assert.equal(item.date, '2026-05-13');
  assert.equal(item.url, 'https://www.resmigazete.gov.tr/eskiler/2026/05/20260513-2.htm');
  assert.equal(item.icon, 'scroll-text');
  assert.ok(item.id.startsWith('rg-'), 'id should start with rg-');
});

test('normalizeResmiGazete handles empty/missing source gracefully', () => {
  assert.deepEqual(normalizeResmiGazete(null), []);
  assert.deepEqual(normalizeResmiGazete({ ok: false }), []);
  assert.deepEqual(normalizeResmiGazete({ ok: true, items: [] }), []);
});

import { normalizeYargitay } from '../normalize.js';

test('normalizeYargitay maps kunye, category, daire, date', () => {
  const items = normalizeYargitay(fixture.sources.yargitay);
  assert.equal(items.length, 2);
  const first = items[0];
  assert.equal(first.source, 'Yargıtay');
  assert.equal(first.kunye, 'Y. 11. Hukuk Dairesi, E. 2025/4020, K. 2026/1160, T. 26.02.2026');
  assert.equal(first.daire, '11. Hukuk Dairesi');
  assert.equal(first.category, 'Borçlar/Tüketici/Ticaret');
  assert.equal(first.date, '2026-02-26');
  assert.equal(first.icon, 'scale');
  assert.ok(first.id.startsWith('y-'));
});

test('normalizeYargitay detects HGK category', () => {
  const items = normalizeYargitay(fixture.sources.yargitay);
  const hgk = items.find((it) => it.daire === 'Hukuk Genel Kurulu');
  assert.ok(hgk, 'HGK item should exist');
  assert.equal(hgk.category, 'HGK');
});

import { normalizeAym, normalizeHudoc } from '../normalize.js';

test('normalizeAym maps basvuruNo, konu, date', () => {
  const items = normalizeAym(fixture.sources.aym);
  assert.equal(items.length, 1);
  const item = items[0];
  assert.equal(item.source, 'AYM');
  assert.equal(item.kunye, 'AYM, B. No: 2023/108631, K.T. 04/03/2026, Birinci Bölüm');
  assert.equal(item.date, '2026-03-04');
  assert.equal(item.icon, 'landmark');
  assert.equal(item.basvuruNo, '2023/108631');
});

test('normalizeHudoc maps caseName, importance, date', () => {
  const items = normalizeHudoc(fixture.sources.hudoc);
  assert.equal(items.length, 1);
  const item = items[0];
  assert.equal(item.source, 'AİHM');
  assert.equal(item.caseName, 'AFFAIRE YASAK c. TÜRKİYE');
  assert.equal(item.importance, '1');
  assert.equal(item.date, '2026-05-05');
  assert.equal(item.icon, 'flag');
  assert.equal(item.appNo, '17389/20');
});
