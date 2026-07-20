/**
 * Publish approved social drafts (X + Instagram).
 * Usage:
 *   node scripts/social-publish.js --date 2026-07-20
 *   node scripts/social-publish.js --date 2026-07-20 --twitter-only
 *   node scripts/social-publish.js --date 2026-07-20 --instagram-only
 *
 * Requires: draft status approved OR --force after human review.
 * Default: refuses if status !== 'approved' unless --force
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { postTweets } from './lib/playwright-poster.js';
import { postInstagram } from './lib/instagram-poster.js';

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
    const force = flag('--force');
    const twitterOnly = flag('--twitter-only');
    const instagramOnly = flag('--instagram-only');
    const path = join(OUT_DIR, `${date}.json`);

    if (!existsSync(path)) {
        throw new Error(`Taslak yok: ${path} — önce: node scripts/social-draft.js`);
    }

    const draft = JSON.parse(await readFile(path, 'utf-8'));
    if (draft.status !== 'approved' && !force) {
        throw new Error(
            `Taslak durumu "${draft.status}". Önce JSON'da status: "approved" yapın veya --force kullanın (yalnızca bilinçli onay sonrası).`
        );
    }

    const tweets = draft.items.map((i) => i.tweet).filter(Boolean);
    const igPosts = draft.items
        .filter((i) => i.cardPath && i.instagramCaption && existsSync(i.cardPath))
        .map((i) => ({ imagePath: i.cardPath, caption: i.instagramCaption }));

    if (!instagramOnly) {
        console.log(`[social-publish] posting ${tweets.length} tweets...`);
        await postTweets(tweets);
    }
    if (!twitterOnly) {
        if (igPosts.length === 0) {
            console.warn('[social-publish] no Instagram cards to post');
        } else {
            console.log(`[social-publish] posting ${igPosts.length} Instagram posts...`);
            await postInstagram(igPosts);
        }
    }

    draft.status = 'published';
    draft.publishedAt = new Date().toISOString();
    await writeFile(path, JSON.stringify(draft, null, 2), 'utf-8');

    // compatibility logs for old startup scripts
    await writeFile(
        join(ROOT, '.tweet-log.json'),
        JSON.stringify({ lastPostedDate: date, postedAt: draft.publishedAt }, null, 2)
    );
    await writeFile(
        join(ROOT, '.instagram-log.json'),
        JSON.stringify({ lastPostedDate: date, postedAt: draft.publishedAt }, null, 2)
    );

    console.log('[social-publish] done');
}

main().catch((err) => {
    console.error('[social-publish] fatal:', err.message);
    process.exit(1);
});
