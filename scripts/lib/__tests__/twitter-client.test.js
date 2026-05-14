import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAuthHeader } from '../twitter-client.js';

const FAKE_CREDS = {
  apiKey: 'k', apiSecret: 's',
  accessToken: 'at', accessTokenSecret: 'ats'
};

test('buildAuthHeader returns OAuth string with required params', () => {
  const header = buildAuthHeader('POST', 'https://api.x.com/2/tweets', FAKE_CREDS);
  assert.ok(header.startsWith('OAuth '), 'starts with OAuth');
  assert.ok(header.includes('oauth_consumer_key="k"'), 'has consumer_key');
  assert.ok(header.includes('oauth_token="at"'), 'has token');
  assert.ok(header.includes('oauth_signature_method="HMAC-SHA1"'), 'uses HMAC-SHA1');
  assert.ok(header.includes('oauth_signature='), 'has signature');
  assert.ok(header.includes('oauth_nonce='), 'has nonce');
  assert.ok(header.includes('oauth_timestamp='), 'has timestamp');
});

test('buildAuthHeader signatures differ across nonce calls', () => {
  const h1 = buildAuthHeader('POST', 'https://api.x.com/2/tweets', FAKE_CREDS);
  const h2 = buildAuthHeader('POST', 'https://api.x.com/2/tweets', FAKE_CREDS);
  assert.notEqual(h1, h2);
});
