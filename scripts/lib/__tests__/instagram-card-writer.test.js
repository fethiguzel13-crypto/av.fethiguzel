import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildCardHtml } from '../instagram-card-writer.js';

const HIGHLIGHT = {
  id: 'aym-2024-28913',
  source: 'AYM',
  kunye: 'AYM, B. No: 2024/28913',
  konu: 'İfade özgürlüğü ihlali iddiası',
  publicSummary: 'Test özeti metni burada yer alır.',
  date: '2026-05-26',
};

describe('buildCardHtml', () => {
  it('includes source badge text', () => {
    const html = buildCardHtml(HIGHLIGHT);
    assert.ok(html.includes('AYM'));
  });

  it('includes kunye text', () => {
    const html = buildCardHtml(HIGHLIGHT);
    assert.ok(html.includes('AYM, B. No: 2024/28913'));
  });

  it('includes publicSummary text', () => {
    const html = buildCardHtml(HIGHLIGHT);
    assert.ok(html.includes('Test özeti metni burada yer alır.'));
  });

  it('truncates konu at 120 chars', () => {
    const longKonu = 'A'.repeat(200);
    const html = buildCardHtml({ ...HIGHLIGHT, konu: longKonu, publicSummary: '' });
    assert.ok(html.includes('…'));
    assert.ok(!html.includes('A'.repeat(121)));
  });

  it('renders without kunye when missing', () => {
    const html = buildCardHtml({ ...HIGHLIGHT, kunye: undefined });
    assert.ok(!html.includes('undefined'));
  });

  it('sets 1080px dimensions', () => {
    const html = buildCardHtml(HIGHLIGHT);
    assert.ok(html.includes('1080px'));
  });
});
