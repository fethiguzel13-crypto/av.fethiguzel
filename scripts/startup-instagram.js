import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { writeCaptions, generateCardHeadlines } from './lib/instagram-caption-writer.js';
import { generateCard, deleteCard } from './lib/instagram-card-writer.js';
import { postInstagram } from './lib/instagram-poster.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const LOG_PATH = join(__dir, '..', '.instagram-log.json');
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
  }, null, 2), 'utf-8');
}

async function fetchHighlights() {
  const res = await fetch(DAILY_URL);
  if (!res.ok) throw new Error(`daily.json fetch failed: ${res.status}`);
  const daily = await res.json();
  return (daily.highlights || []).slice(0, 2);
}

async function main() {
  console.log(`[startup-instagram] ${new Date().toISOString()} — starting`);

  if (await alreadyPostedToday()) {
    console.log('[startup-instagram] already posted today, exiting');
    return;
  }

  const highlights = await fetchHighlights();
  if (highlights.length === 0) {
    console.log('[startup-instagram] no highlights today, exiting');
    return;
  }
  console.log(`[startup-instagram] ${highlights.length} highlights fetched`);

  const [captions, headlines] = await Promise.all([
    writeCaptions(highlights),
    generateCardHeadlines(highlights),
  ]);
  console.log(`[startup-instagram] ${captions.length} captions generated`);

  const cardPaths = [];
  for (let i = 0; i < highlights.length; i++) {
    const h = highlights[i];
    console.log(`[startup-instagram] generating card for ${h.id ?? h.title ?? 'unknown'}...`);
    const path = await generateCard({ ...h, cardText: headlines[i] });
    cardPaths.push(path);
  }
  console.log(`[startup-instagram] ${cardPaths.length} cards generated`);

  if (captions.length !== cardPaths.length) {
    throw new Error(`[startup-instagram] caption/card count mismatch: ${captions.length} captions vs ${cardPaths.length} cards`);
  }

  const posts = cardPaths.map((imagePath, i) => ({ imagePath, caption: captions[i] }));
  try {
    await postInstagram(posts);
  } finally {
    for (const p of cardPaths) await deleteCard(p);
  }

  await markPostedToday();
  console.log('[startup-instagram] done');
}

main().catch(err => {
  console.error('[startup-instagram] fatal:', err.message);
  process.exit(1);
});
