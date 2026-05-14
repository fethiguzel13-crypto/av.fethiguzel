import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildTweet } from '../tweet-format.js';

const fixture = JSON.parse(
  await readFile(new URL('../../fixtures/daily-sample.json', import.meta.url), 'utf-8')
);

test('buildTweet AYM: prefix, summary, link, hashtag', () => {
  const aym = fixture.highlights[0];
  const text = buildTweet(aym, 'avfethiguzel.com');
  assert.ok(text.startsWith('AYM:'), `prefix should be AYM: but got: ${text.slice(0, 30)}`);
  assert.ok(text.includes('adil savunma'), 'should include publicSummary');
  assert.ok(text.includes('avfethiguzel.com/icthat'), 'should include site link');
  assert.ok(text.includes('#hukuk'), 'should include #hukuk hashtag');
  assert.ok(text.includes('#AYM'), 'should include #AYM hashtag');
  assert.ok(text.length <= 280, `must be <= 280 chars, got ${text.length}`);
});

test('buildTweet YİBK: prefix is YİBK (not Yargıtay), uses YİBK hashtag set', () => {
  const yibk = fixture.highlights[1];
  const text = buildTweet(yibk, 'avfethiguzel.com');
  assert.ok(text.startsWith('YİBK:'), `prefix should be YİBK: but got: ${text.slice(0, 30)}`);
  assert.ok(text.includes('#YİBK'), 'should include #YİBK');
  assert.ok(!text.includes('#yargıtay'), 'YİBK should NOT include #yargıtay');
});

test('buildTweet AİHM: uses publicSummary, AİHM prefix', () => {
  const aihm = fixture.highlights[2];
  const text = buildTweet(aihm, 'avfethiguzel.com');
  assert.ok(text.startsWith('AİHM:'), `prefix should be AİHM:`);
  assert.ok(text.includes('ifade özgürlüğünü'), 'should include publicSummary');
  assert.ok(text.includes('#AİHM'), 'should include #AİHM');
});

test('buildTweet RG: Resmî Gazete prefix and hashtags', () => {
  const rg = fixture.highlights[3];
  const text = buildTweet(rg, 'avfethiguzel.com');
  assert.ok(text.startsWith('Resmî Gazete:'), `prefix should be Resmî Gazete:`);
  assert.ok(text.includes('#mevzuat'), 'should include #mevzuat');
  assert.ok(text.includes('#resmigazete'), 'should include #resmigazete');
});

test('buildTweet truncates body > 280 chars', () => {
  const longItem = {
    id: 'long-1',
    source: 'AYM',
    publicSummary: 'A'.repeat(500),
    konu: '',
    kunye: ''
  };
  const text = buildTweet(longItem, 'avfethiguzel.com');
  assert.ok(text.length <= 280, `should fit in 280 chars, got ${text.length}`);
  assert.ok(text.includes('…'), 'should end body with ellipsis');
});
