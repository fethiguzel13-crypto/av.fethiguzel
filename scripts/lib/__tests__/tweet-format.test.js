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
