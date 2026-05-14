import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { buildTweet } from './lib/tweet-format.js';

// Türkiye saatleri 09/13/17/20 → UTC 06/10/14/17
const SLOTS_UTC = [6, 10, 14, 17];

function scheduledForSlot(baseDate, slotHourUtc) {
  const d = new Date(baseDate);
  d.setUTCHours(slotHourUtc, 0, 0, 0);
  return d.toISOString();
}

async function main() {
  const [, , dailyPath, queuePath] = process.argv;
  if (!dailyPath || !queuePath) {
    console.error('Usage: node generate-tweets.js <daily.json> <queue.json>');
    process.exit(1);
  }

  const siteDomain = process.env.SITE_DOMAIN || 'avfethiguzel.com';

  const daily = JSON.parse(await readFile(dailyPath, 'utf-8'));
  const highlights = Array.isArray(daily.highlights) ? daily.highlights.slice(0, 4) : [];

  const now = new Date();
  const isoDate = now.toISOString().slice(0, 10);

  const tweets = highlights.map((h, i) => ({
    id: `${isoDate}-${i + 1}`,
    highlightId: h.id,
    text: buildTweet(h, siteDomain),
    scheduledFor: scheduledForSlot(now, SLOTS_UTC[i]),
    posted: false,
    postedAt: null,
    tweetId: null,
    error: null
  }));

  const queue = {
    generatedAt: now.toISOString(),
    dateLabel: daily.dateLabel || isoDate,
    tweets
  };

  await mkdir(dirname(queuePath), { recursive: true });
  await writeFile(queuePath, JSON.stringify(queue, null, 2));
  console.log(`[generate-tweets] wrote ${tweets.length} tweets to ${queuePath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
