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
