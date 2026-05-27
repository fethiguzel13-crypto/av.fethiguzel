import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { writeTweets } from './lib/tweet-writer.js';
import { postTweets } from './lib/playwright-poster.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const LOG_PATH = join(__dir, '..', '.tweet-log.json');
const DAILY_URL = 'https://avfethiguzel.com/data/daily.json';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function alreadyPostedToday() {
  if (!existsSync(LOG_PATH)) return false;
  try {
    const log = JSON.parse(await readFile(LOG_PATH, 'utf-8'));
    return log.lastPostedDate === todayISO();
  } catch {
    return false;
  }
}

async function markPostedToday() {
  await writeFile(LOG_PATH, JSON.stringify({
    lastPostedDate: todayISO(),
    postedAt: new Date().toISOString()
  }, null, 2));
}

async function fetchHighlights() {
  const res = await fetch(DAILY_URL);
  if (!res.ok) throw new Error(`daily.json fetch failed: ${res.status}`);
  const daily = await res.json();
  return (daily.highlights || []).slice(0, 2);
}

async function main() {
  console.log(`[startup-tweet] ${new Date().toISOString()} — starting`);

  if (await alreadyPostedToday()) {
    console.log('[startup-tweet] already posted today, exiting');
    return;
  }

  const highlights = await fetchHighlights();
  if (highlights.length === 0) {
    console.log('[startup-tweet] no highlights today, exiting');
    return;
  }
  console.log(`[startup-tweet] ${highlights.length} highlights fetched`);

  const tweets = await writeTweets(highlights);
  console.log(`[startup-tweet] ${tweets.length} tweets generated`);

  await postTweets(tweets);

  await markPostedToday();
  console.log('[startup-tweet] done');
}

main().catch(err => {
  console.error('[startup-tweet] fatal:', err.message);
  process.exit(1);
});
