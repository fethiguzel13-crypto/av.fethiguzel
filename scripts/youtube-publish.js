/**
 * Publish shorts-cast.mp4 to YouTube Studio.
 * Usage:
 *   node scripts/youtube-publish.js --date 2026-07-20 --index 1
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { uploadYoutubeVideo } from './lib/youtube-poster.js';

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
    const ytDir = join(ROOT, 'logs/social-drafts', date, 'youtube', `shorts-${index}`);
    const videoPath = [
        join(ytDir, 'shorts-cast.mp4'),
        join(ytDir, 'shorts-cinematic.mp4'),
        join(ytDir, 'shorts-story.mp4'),
        join(ytDir, 'shorts.mp4'),
    ].find((p) => existsSync(p));

    if (!videoPath) throw new Error(`Video yok: ${ytDir}`);

    let title = 'Islah dilekçesi yok sayılamaz: AYM mahkemeye erişim';
    let description = '';
    try {
        const draft = JSON.parse(await readFile(join(ROOT, 'logs/social-drafts', `${date}.json`), 'utf8'));
        const item = draft.items?.[index - 1];
        if (item) {
            title = (
                item.youtubeTitle ||
                item.cardHeadline ||
                item.topic?.title ||
                title
            )
                .toString()
                .slice(0, 100);
            const script = (item.youtubeScript || '').trim();
            const kunye = item.topic?.kunye || '';
            description = [
                script,
                '',
                kunye ? `Kaynak: ${kunye}` : null,
                'avfethiguzel.com',
                '',
                '#hukuk #shorts #içtihat #AYM #Pembo #avukat',
                '',
                'Genel bilgilendirmedir; somut dosya için ayrı değerlendirme gerekir.',
            ]
                .filter(Boolean)
                .join('\n');
        }
    } catch {
        /* defaults */
    }

    // Prefer short punchy title if too long/abstract
    if (title.length > 90 || /Anayasa Mahkemesi, mahkemelerin/i.test(title)) {
        title = 'Pembo ve ıslah dilekçesi: mahkeme yok sayamaz | AYM';
    }

    console.log('[youtube-publish] video:', videoPath);
    console.log('[youtube-publish] title:', title);

    const result = await uploadYoutubeVideo({
        videoPath,
        title,
        description,
        madeForKids: false,
    });

    const logPath = join(ytDir, 'youtube-publish.json');
    await writeFile(
        logPath,
        JSON.stringify(
            {
                publishedAt: new Date().toISOString(),
                videoPath,
                title,
                result,
            },
            null,
            2
        ),
        'utf8'
    );
    console.log('[youtube-publish] done', result);
    if (result.url) console.log('[youtube-publish] URL:', result.url);
}

main().catch((e) => {
    console.error('[youtube-publish] fatal:', e.message);
    process.exit(1);
});
