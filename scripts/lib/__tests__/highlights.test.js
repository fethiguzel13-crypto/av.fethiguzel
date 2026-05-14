import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectHighlights } from '../highlights.js';

const sampleItems = {
  resmigazete: [
    { id: 'rg-1', source: 'RG', category: 'Yönetmelik', title: 'Harita Mühendisliği Yönetmeliği değişikliği' },
    { id: 'rg-2', source: 'RG', category: 'Tebliğ', title: 'Bütçe tebliği' }
  ],
  yargitay: [
    { id: 'y-1', source: 'Yargıtay', daire: '11. Hukuk Dairesi', category: 'Borçlar/Tüketici/Ticaret', kunye: '...' },
    { id: 'y-hgk', source: 'Yargıtay', daire: 'Hukuk Genel Kurulu', category: 'HGK', kunye: '...' },
    { id: 'y-yibk', source: 'Yargıtay', daire: 'YİBK', category: 'YİBK', kunye: 'YİBK ...' }
  ],
  aym: [
    { id: 'aym-1', source: 'AYM', tur: 'Esas (İhlal)', konu: 'mülkiyet hakkı ihlali' }
  ],
  hudoc: [
    { id: 'hudoc-1', source: 'AİHM', importance: '1', caseName: 'KEY CASE' },
    { id: 'hudoc-2', source: 'AİHM', importance: '3', caseName: 'low importance' }
  ],
  mevzuat: []
};

test('selectHighlights prioritizes YİBK first', () => {
  const result = selectHighlights(sampleItems);
  assert.equal(result.length, 4);
  assert.equal(result[0].id, 'y-yibk');
});

test('selectHighlights includes AYM ihlal, HUDOC importance=1, HGK', () => {
  const result = selectHighlights(sampleItems);
  const ids = result.map((x) => x.id);
  assert.ok(ids.includes('aym-1'));
  assert.ok(ids.includes('hudoc-1'));
  assert.ok(ids.includes('y-hgk'));
});

test('selectHighlights returns empty for empty input', () => {
  const sparse = { resmigazete: [], yargitay: [], aym: [], hudoc: [], mevzuat: [] };
  assert.deepEqual(selectHighlights(sparse), []);
});

test('selectHighlights caps at 4', () => {
  const many = {
    ...sampleItems,
    yargitay: Array.from({ length: 20 }, (_, i) => ({
      id: `y-extra-${i}`, source: 'Yargıtay', daire: 'YİBK', category: 'YİBK', kunye: `YİBK ${i}`
    }))
  };
  const result = selectHighlights(many);
  assert.equal(result.length, 4);
});
