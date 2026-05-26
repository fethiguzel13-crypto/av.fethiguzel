import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { writeCaptions } from '../instagram-caption-writer.js';

const MOCK_HIGHLIGHTS = [
  { id: 'aym-1', source: 'AYM', konu: 'İfade özgürlüğü', publicSummary: 'Test özeti.', category: undefined },
  { id: 'yarg-1', source: 'Yargıtay', konu: 'Tazminat', publicSummary: 'Yargıtay özeti.', category: 'YİBK' },
];

test('writeCaptions returns one caption per highlight', async () => {
  const mockClient = {
    messages: { create: async () => ({ content: [{ type: 'text', text: 'Test caption metni.' }] }) }
  };
  const result = await writeCaptions(MOCK_HIGHLIGHTS, mockClient);
  assert.equal(result.length, 2);
});

test('writeCaptions appends correct AYM hashtags', async () => {
  const mockClient = {
    messages: { create: async () => ({ content: [{ type: 'text', text: 'Caption.' }] }) }
  };
  const [caption] = await writeCaptions([MOCK_HIGHLIGHTS[0]], mockClient);
  assert.ok(caption.includes('#AYM'));
  assert.ok(caption.includes('#hukuk'));
});

test('writeCaptions appends YİBK hashtags for Yargıtay YİBK category', async () => {
  const mockClient = {
    messages: { create: async () => ({ content: [{ type: 'text', text: 'Caption.' }] }) }
  };
  const [caption] = await writeCaptions([MOCK_HIGHLIGHTS[1]], mockClient);
  assert.ok(caption.includes('#YİBK'));
});

test('writeCaptions throws when API response is empty', async () => {
  const mockClient = {
    messages: { create: async () => ({ content: [] }) }
  };
  await assert.rejects(
    () => writeCaptions([MOCK_HIGHLIGHTS[0]], mockClient),
    /empty/i
  );
});
