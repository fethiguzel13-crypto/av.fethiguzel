// scripts/lib/__tests__/analysis-writer.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { writeAnalysis } from '../analysis-writer.js';

const MOCK_SECTIONS = {
  davaSozeti: 'Dava özeti metni.',
  mahkemeninKarari: 'Mahkeme kararı metni.',
  benimGozlemim: 'Gözlem metni.',
  pratikEtki: 'Pratik etki metni.'
};

const MOCK_HIGHLIGHT = {
  id: 'aym-2024-28913',
  source: 'AYM',
  kunye: 'AYM, B. No: 2024/28913',
  konu: 'İfade özgürlüğü',
  publicSummary: 'Test özeti.',
  date: '2026-05-06',
  url: 'https://example.com'
};

describe('writeAnalysis', () => {
  it('calls Sonnet and returns structured analysis', async () => {
    const mockClient = {
      messages: {
        create: async () => ({
          content: [{ type: 'text', text: JSON.stringify(MOCK_SECTIONS) }]
        })
      }
    };
    const result = await writeAnalysis(MOCK_HIGHLIGHT, mockClient);
    assert.equal(result.id, 'aym-2024-28913');
    assert.ok(result.generatedAt);
    assert.deepEqual(result.sections, MOCK_SECTIONS);
    assert.equal(result.highlight.source, 'AYM');
    assert.equal(result.highlight.kunye, 'AYM, B. No: 2024/28913');
  });

  it('strips markdown code fences from response', async () => {
    const mockClient = {
      messages: {
        create: async () => ({
          content: [{ type: 'text', text: '```json\n' + JSON.stringify(MOCK_SECTIONS) + '\n```' }]
        })
      }
    };
    const result = await writeAnalysis(MOCK_HIGHLIGHT, mockClient);
    assert.deepEqual(result.sections, MOCK_SECTIONS);
  });

  it('throws when response is empty', async () => {
    const mockClient = {
      messages: {
        create: async () => ({ content: [] })
      }
    };
    await assert.rejects(
      () => writeAnalysis(MOCK_HIGHLIGHT, mockClient),
      /empty/i
    );
  });

  it('throws when response text is blank', async () => {
    const mockClient = {
      messages: {
        create: async () => ({ content: [{ type: 'text', text: '' }] })
      }
    };
    await assert.rejects(
      () => writeAnalysis(MOCK_HIGHLIGHT, mockClient),
      /empty/i
    );
  });
});
