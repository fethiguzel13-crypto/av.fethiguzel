import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import { writeAnalysis } from './lib/analysis-writer.js';

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function main() {
  const [, , dailyPath, outDir] = process.argv;
  if (!dailyPath || !outDir) {
    console.error('Usage: node build-analysis.js <daily.json> <analyses-dir>');
    process.exit(1);
  }

  const daily = JSON.parse(await readFile(dailyPath, 'utf-8'));
  const highlights = daily.highlights || [];

  if (highlights.length === 0) {
    console.log('[build-analysis] no highlights found, nothing to do');
    return;
  }

  await mkdir(outDir, { recursive: true });

  let generated = 0;
  let skipped = 0;

  for (const h of highlights) {
    const outPath = join(outDir, `${h.id}.json`);
    if (await exists(outPath)) {
      console.log(`[build-analysis] skip ${h.id} (already exists)`);
      skipped++;
      continue;
    }
    console.log(`[build-analysis] generating ${h.id}...`);
    const analysis = await writeAnalysis(h);
    await writeFile(outPath, JSON.stringify(analysis, null, 2));
    console.log(`[build-analysis] ✓ ${h.id}`);
    generated++;
  }

  console.log(`[build-analysis] done: ${generated} generated, ${skipped} skipped`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
