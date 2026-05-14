import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { postTweet } from './lib/twitter-client.js';

function getCreds() {
  const c = {
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };
  const missing = Object.entries(c).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length > 0) {
    console.error(`[post-due-tweets] missing env vars: ${missing.join(', ')}`);
    process.exit(2);
  }
  return c;
}

async function main() {
  const [, , queuePath] = process.argv;
  if (!queuePath) {
    console.error('Usage: node post-due-tweets.js <queue.json>');
    process.exit(1);
  }

  if (!existsSync(queuePath)) {
    console.log('[post-due-tweets] queue not found, nothing to do');
    process.exit(0);
  }

  const creds = getCreds();
  const queue = JSON.parse(await readFile(queuePath, 'utf-8'));
  const now = Date.now();
  const due = queue.tweets.filter((t) =>
    !t.posted &&
    !t.error &&
    new Date(t.scheduledFor).getTime() <= now
  );

  if (due.length === 0) {
    console.log('[post-due-tweets] nothing due');
    process.exit(0);
  }

  console.log(`[post-due-tweets] ${due.length} tweet(s) due`);

  let stopOnAuth = false;
  for (const tweet of due) {
    if (stopOnAuth) break;
    try {
      const res = await postTweet(tweet.text, creds);
      if (res.status === 201) {
        tweet.posted = true;
        tweet.postedAt = new Date().toISOString();
        tweet.tweetId = res.body?.data?.id || null;
        console.log(`  ✓ posted ${tweet.id} → ${tweet.tweetId}`);
      } else if (res.status === 401) {
        tweet.error = 'auth';
        stopOnAuth = true;
        console.error(`  ✗ ${tweet.id}: 401 auth — stopping remaining tweets`);
      } else if (res.status === 403 && /duplicate/i.test(JSON.stringify(res.body))) {
        tweet.posted = true;
        tweet.error = 'duplicate';
        tweet.postedAt = new Date().toISOString();
        console.log(`  ⚠ ${tweet.id}: duplicate, marking posted`);
      } else if (res.status === 429) {
        console.log(`  ⏸ ${tweet.id}: rate limit, exit for retry`);
        break;
      } else {
        tweet.error = `HTTP ${res.status}: ${JSON.stringify(res.body).slice(0, 200)}`;
        console.error(`  ✗ ${tweet.id}: ${tweet.error}`);
      }
    } catch (err) {
      tweet.error = `network: ${err.message}`;
      console.error(`  ✗ ${tweet.id}: ${tweet.error}`);
    }
  }

  await writeFile(queuePath, JSON.stringify(queue, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
