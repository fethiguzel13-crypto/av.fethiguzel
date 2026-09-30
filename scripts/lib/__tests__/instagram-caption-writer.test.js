import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { writeCaptions } from '../instagram-caption-writer.js';

const MOCK_HIGHLIGHTS = [
  { id: 'aym-1', source: 'AYM', konu: 'İfade özgürlüğü', publicSummary: 'Test özeti.', category: undefined },
  { id: 'yarg-1', source: 'Yargıtay', konu: 'Tazminat', publicSummary: 'Yargıtay özeti.', category: 'YİBK' },
];

// Sahte LLM: gerçek API'ye gidilmez (writeCaptions(highlights, { complete })).
const complete = async () => 'Test caption metni.';

test('writeCaptions returns one caption per highlight', async () => {
  const result = await writeCaptions(MOCK_HIGHLIGHTS, { complete });
  assert.equal(result.length, 2);
});

test('writeCaptions appends correct AYM hashtags', async () => {
  const [caption] = await writeCaptions([MOCK_HIGHLIGHTS[0]], { complete });
  assert.ok(caption.includes('#AYM'));
  assert.ok(caption.includes('#hukuk'));
});

test('writeCaptions appends YİBK hashtags for Yargıtay YİBK category', async () => {
  const [caption] = await writeCaptions([MOCK_HIGHLIGHTS[1]], { complete });
  assert.ok(caption.includes('#YİBK'));
});

test('writeCaptions adds the site line once when the model omitted it', async () => {
  const [caption] = await writeCaptions([MOCK_HIGHLIGHTS[0]], { complete });
  assert.equal(caption.match(/avfethiguzel\.com/g).length, 1);
  const [withSite] = await writeCaptions([MOCK_HIGHLIGHTS[0]], { complete: async () => 'Metin. avfethiguzel.com' });
  assert.equal(withSite.match(/avfethiguzel\.com/g).length, 1);
});

test('writeCaptions propagates LLM failure (empty model answer)', async () => {
  const failing = async () => {
    throw new Error('LLM yok/başarısız. kısa cevap: ');
  };
  await assert.rejects(() => writeCaptions([MOCK_HIGHLIGHTS[0]], { complete: failing }), /LLM/);
});
