import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPrompt, shouldSummarize } from '../summarize.js';

test('buildPrompt includes title and konu, asks for plain Turkish', () => {
  const prompt = buildPrompt({ title: 'Konkordato yönetmeliği', konu: 'İflas erteleme süreci...' });
  assert.ok(prompt.includes('Konkordato yönetmeliği'));
  assert.ok(prompt.includes('İflas erteleme süreci'));
  assert.ok(prompt.toLowerCase().includes('vatandaş'));
  assert.ok(prompt.toLowerCase().includes('jargon'));
});

test('buildPrompt uses kunye if title missing', () => {
  const prompt = buildPrompt({ kunye: 'Y. 11. HD, E. 2025/4020', konu: 'kefalet' });
  assert.ok(prompt.includes('Y. 11. HD'));
});

test('shouldSummarize skips if publicSummary already present', () => {
  assert.equal(shouldSummarize({ publicSummary: 'Zaten var.', konu: 'x' }), false);
  assert.equal(shouldSummarize({ publicSummary: '', konu: 'x' }), true);
  assert.equal(shouldSummarize({ konu: 'x' }), true);
});

test('shouldSummarize skips if no konu and no title', () => {
  assert.equal(shouldSummarize({}), false);
  assert.equal(shouldSummarize({ konu: '', title: '' }), false);
});
