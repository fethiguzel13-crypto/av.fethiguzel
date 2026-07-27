/**
 * Render animated Shorts for cleaned human voice.
 * Usage:
 *   node scripts/youtube-animate-render.js --date 2026-07-20 --index 1
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAnimatedShort } from './lib/youtube-animate.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');

function arg(name, fallback = null) {
    const i = process.argv.indexOf(name);
    if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) {
        return process.argv[i + 1];
    }
    return fallback;
}

async function main() {
    const date = arg('--date', new Date().toISOString().slice(0, 10));
    const index = Number(arg('--index', '1'));
    const fps = Number(arg('--fps', '12'));

    const draftPath = join(ROOT, 'logs/social-drafts', `${date}.json`);
    const draft = JSON.parse(await readFile(draftPath, 'utf8'));
    const item = draft.items[index - 1];
    if (!item) throw new Error(`Item ${index} yok`);

    const ytDir = join(ROOT, 'logs/social-drafts', date, 'youtube', `shorts-${index}`);
    const audioCandidates = [
        join(ytDir, 'voice-clean.wav'),
        join(ytDir, 'voice-clean.mp3'),
        join(ytDir, 'voice.mp3'),
    ];
    const audioPath = audioCandidates.find((p) => existsSync(p));
    if (!audioPath) throw new Error(`Temiz ses yok: ${ytDir}`);

    const script =
        item.youtubeScript ||
        (existsSync(join(ROOT, 'logs/social-drafts', date, 'youtube', `shorts-${index}-teleprompter.txt`))
            ? await readFile(
                join(ROOT, 'logs/social-drafts', date, 'youtube', `shorts-${index}-teleprompter.txt`),
                'utf8'
            )
            : '');

    // Prefer story lines only
    const cleanScript = String(script)
        .split(/\n+/)
        .filter((l) => {
            const t = l.trim();
            if (!t) return false;
            if (/TELEPROMPTER|Konu:|Kaynak:|Süre hedefi|^---$/i.test(t)) return false;
            return true;
        })
        .join('\n');

    const outPath = join(ytDir, 'shorts-animated.mp4');
    console.log(`[youtube-animate-render] audio=${audioPath}`);
    console.log(`[youtube-animate-render] out=${outPath}`);

    await renderAnimatedShort({
        audioPath,
        script: cleanScript,
        outPath,
        kunye: item.topic?.kunye || '',
        title: item.topic?.title || item.youtubeTitle || '',
        fps,
    });

    console.log('[youtube-animate-render] done →', outPath);
}

main().catch((e) => {
    console.error('[youtube-animate-render] fatal:', e.message);
    process.exit(1);
});
