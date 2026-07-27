/**
 * Export YouTube Shorts packages from an approved/pending social draft.
 * Usage:
 *   node scripts/youtube-export.js --date 2026-07-20
 *   node scripts/youtube-export.js --date 2026-07-20 --no-video
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportYoutubePackages } from './lib/youtube-package.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const OUT_DIR = join(ROOT, 'logs', 'social-drafts');

function arg(name, fallback = null) {
    const i = process.argv.indexOf(name);
    if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) {
        return process.argv[i + 1];
    }
    return fallback;
}

function flag(name) {
    return process.argv.includes(name);
}

function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

async function main() {
    const date = arg('--date', todayISO());
    const makeVideo = !flag('--no-video');
    const path = join(OUT_DIR, `${date}.json`);
    if (!existsSync(path)) {
        throw new Error(`Taslak yok: ${path}`);
    }
    const draft = JSON.parse(await readFile(path, 'utf8'));
    if (!draft.items?.length) throw new Error('Taslakta item yok');

    const ytDir = join(OUT_DIR, date, 'youtube');
    console.log(`[youtube-export] ${date} → ${ytDir}`);
    const packages = await exportYoutubePackages(draft, ytDir, { makeVideo });

    draft.youtube = {
        exportedAt: new Date().toISOString(),
        dir: ytDir,
        packages: packages.map((p) => ({
            index: p.index,
            title: p.title,
            status: p.status,
            videoPath: p.videoPath,
            audioPath: p.audioPath,
        })),
    };
    await writeFile(path, JSON.stringify(draft, null, 2), 'utf8');

    console.log('[youtube-export] done');
    packages.forEach((p) => {
        console.log(`  ${p.index}. ${p.status} — ${p.title.slice(0, 70)}`);
        if (p.videoPath) console.log(`     video: ${p.videoPath}`);
    });
    console.log(`[youtube-export] INDEX: ${join(ytDir, 'INDEX.md')}`);
}

main().catch((e) => {
    console.error('[youtube-export] fatal:', e.message);
    process.exit(1);
});
