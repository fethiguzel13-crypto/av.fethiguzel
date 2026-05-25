import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { writeTweets } from '../tweet-writer.js';

const mockClient = {
  messages: {
    create: async () => ({
      content: [{ text: 'Bir vatandaş yıllarca bekledi ve sonunda hakkını aldı.' }]
    })
  }
};

test('writeTweets returns one tweet per highlight', async () => {
  const highlights = [
    { source: 'AYM', publicSummary: 'Test özeti', id: 'aym-1' }
  ];
  const tweets = await writeTweets(highlights, 'avfethiguzel.com', mockClient);
  assert.equal(tweets.length, 1);
  assert.ok(tweets[0].includes('avfethiguzel.com/icthat'));
  assert.ok(tweets[0].length <= 280);
});

test('writeTweets handles missing publicSummary', async () => {
  const highlights = [
    { source: 'Yargıtay', konu: 'Konu metni', id: 'yargitay-1' }
  ];
  const tweets = await writeTweets(highlights, 'avfethiguzel.com', mockClient);
  assert.equal(tweets.length, 1);
  assert.ok(tweets[0].length <= 280);
});

test('writeTweets appends correct hashtags for AYM', async () => {
  const highlights = [{ source: 'AYM', publicSummary: 'Özet', id: 'aym-2' }];
  const tweets = await writeTweets(highlights, 'avfethiguzel.com', mockClient);
  assert.ok(tweets[0].includes('#AYM'));
});

test('writeTweets appends correct hashtags for Yargıtay', async () => {
  const highlights = [{ source: 'Yargıtay', publicSummary: 'Özet', id: 'y-1' }];
  const tweets = await writeTweets(highlights, 'avfethiguzel.com', mockClient);
  assert.ok(tweets[0].includes('#Yargıtay'));
});

test('writeTweets appends YİBK hashtags for Yargıtay+YİBK category', async () => {
  const highlights = [{ source: 'Yargıtay', category: 'YİBK', publicSummary: 'Özet', id: 'yibk-1' }];
  const tweets = await writeTweets(highlights, 'avfethiguzel.com', mockClient);
  assert.ok(tweets[0].includes('#YİBK'));
});
