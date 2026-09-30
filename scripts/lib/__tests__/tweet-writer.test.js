import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { writeTweets } from '../tweet-writer.js';

// Sahte LLM: gerçek API'ye gidilmez (writeTweets(highlights, { complete })).
const complete = async () => 'Bir vatandaş yıllarca bekledi ve sonunda hakkını aldı; mahkeme usul güvencesini hatırlattı.';

test('writeTweets returns one tweet per highlight, with site link and within 280 chars', async () => {
  const highlights = [{ source: 'AYM', publicSummary: 'Test özeti', id: 'aym-1' }];
  const tweets = await writeTweets(highlights, { complete });
  assert.equal(tweets.length, 1);
  assert.ok(tweets[0].includes('avfethiguzel.com'));
  assert.ok(tweets[0].length <= 280);
});

test('writeTweets uses highlight url when it points to the site', async () => {
  const highlights = [{ source: 'AYM', publicSummary: 'Özet', id: 'aym-3', url: 'https://avfethiguzel.com/icthat/aym-3' }];
  const [tweet] = await writeTweets(highlights, { complete });
  assert.ok(tweet.includes('avfethiguzel.com/icthat/aym-3'));
});

test('writeTweets handles missing publicSummary', async () => {
  const highlights = [{ source: 'Yargıtay', konu: 'Konu metni', id: 'yargitay-1' }];
  const tweets = await writeTweets(highlights, { complete });
  assert.equal(tweets.length, 1);
  assert.ok(tweets[0].length <= 280);
});

test('writeTweets trims long bodies to 280 chars keeping link and hashtags', async () => {
  const long = async () => 'Uzun bir cümle. '.repeat(40);
  const [tweet] = await writeTweets([{ source: 'AYM', publicSummary: 'x', id: 'a' }], { complete: long });
  assert.ok(tweet.length <= 280);
  assert.ok(tweet.includes('#AYM'));
});

test('writeTweets appends correct hashtags for AYM', async () => {
  const tweets = await writeTweets([{ source: 'AYM', publicSummary: 'Özet', id: 'aym-2' }], { complete });
  assert.ok(tweets[0].includes('#AYM'));
});

test('writeTweets appends correct hashtags for Yargıtay', async () => {
  const tweets = await writeTweets([{ source: 'Yargıtay', publicSummary: 'Özet', id: 'y-1' }], { complete });
  assert.ok(tweets[0].includes('#Yargıtay'));
});

test('writeTweets appends YİBK hashtags for Yargıtay+YİBK category', async () => {
  const highlights = [{ source: 'Yargıtay', category: 'YİBK', publicSummary: 'Özet', id: 'yibk-1' }];
  const tweets = await writeTweets(highlights, { complete });
  assert.ok(tweets[0].includes('#YİBK'));
});

test('writeTweets propagates LLM failure instead of posting empty text', async () => {
  const failing = async () => {
    throw new Error('LLM yok/başarısız. kısa cevap: ');
  };
  await assert.rejects(() => writeTweets([{ source: 'AYM', publicSummary: 'x', id: 'a' }], { complete: failing }), /LLM/);
});
