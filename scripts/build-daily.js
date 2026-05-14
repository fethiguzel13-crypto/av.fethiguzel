import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import {
  normalizeResmiGazete,
  normalizeYargitay,
  normalizeAym,
  normalizeHudoc
} from './lib/normalize.js';
import { selectHighlights } from './lib/highlights.js';
import { summarizeAll } from './lib/summarize.js';

const TR_MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

function formatDateLabel(date) {
  return `${date.getUTCDate()} ${TR_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

async function main() {
  const [, , inputPath, outputDir] = process.argv;
  if (!inputPath || !outputDir) {
    console.error('Usage: node build-daily.js <raw.json> <output-dir>');
    process.exit(1);
  }

  const raw = JSON.parse(await readFile(inputPath, 'utf-8'));
  const sources = raw.sources || {};

  const items = {
    resmigazete: normalizeResmiGazete(sources.resmigazete),
    yargitay: normalizeYargitay(sources.yargitay),
    aym: normalizeAym(sources.aym),
    hudoc: normalizeHudoc(sources.hudoc),
    mevzuat: []
  };

  const errors = [];
  for (const [name, src] of Object.entries(sources)) {
    if (src && src.ok === false) {
      errors.push({ source: name, message: src.error || 'unknown failure' });
    }
  }

  const allItems = Object.values(items).flat();
  const summarized = await summarizeAll(allItems, process.env.ANTHROPIC_API_KEY);
  const byId = new Map(summarized.map((it) => [it.id, it]));
  for (const key of Object.keys(items)) {
    items[key] = items[key].map((it) => byId.get(it.id) || it);
  }

  const highlights = selectHighlights(items);

  const now = new Date();
  const isoDate = now.toISOString().slice(0, 10);

  const output = {
    generatedAt: now.toISOString(),
    dateLabel: formatDateLabel(now),
    highlights,
    items,
    stats: {
      totalItems: allItems.length,
      perSource: Object.fromEntries(Object.entries(items).map(([k, v]) => [k, v.length]))
    },
    errors
  };

  await mkdir(outputDir, { recursive: true });
  await mkdir(join(outputDir, 'archive'), { recursive: true });
  await writeFile(join(outputDir, 'daily.json'), JSON.stringify(output, null, 2));
  await writeFile(join(outputDir, 'archive', `${isoDate}.json`), JSON.stringify(output, null, 2));

  console.log(`[build-daily] wrote ${allItems.length} items, ${highlights.length} highlights, ${errors.length} errors`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
