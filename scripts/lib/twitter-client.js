import OAuth from 'oauth-1.0a';
import crypto from 'node:crypto';

function makeOAuth(creds) {
  return new OAuth({
    consumer: { key: creds.apiKey, secret: creds.apiSecret },
    signature_method: 'HMAC-SHA1',
    hash_function: (base, key) =>
      crypto.createHmac('sha1', key).update(base).digest('base64')
  });
}

export function buildAuthHeader(method, url, creds) {
  const oauth = makeOAuth(creds);
  const token = { key: creds.accessToken, secret: creds.accessTokenSecret };
  const requestData = { url, method };
  const headerData = oauth.toHeader(oauth.authorize(requestData, token));
  return headerData.Authorization;
}

export async function postTweet(text, creds) {
  const url = 'https://api.x.com/2/tweets';
  const authHeader = buildAuthHeader('POST', url, creds);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });
  const bodyText = await res.text();
  let body;
  try { body = JSON.parse(bodyText); } catch { body = { raw: bodyText }; }
  return { status: res.status, body };
}
