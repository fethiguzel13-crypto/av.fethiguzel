/**
 * Generate daily social drafts (X, Instagram, YouTube) WITHOUT posting.
 * Usage: node scripts/social-draft.js [--count 2]
 *
 * Output: logs/social-drafts/YYYY-MM-DD.json + .md for review
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSocialTopics } from './lib/content-source.js';
import { writeTweets } from './lib/tweet-writer.js';
import { writeCaptions, generateCardHeadlines } from './lib/instagram-caption-writer.js';
import { writeYoutubeScripts } from './lib/youtube-script-writer.js';
import { generateCard } from './lib/instagram-card-writer.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const OUT_DIR = join(ROOT, 'logs', 'social-drafts');

function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

function parseCount() {
    const i = process.argv.indexOf('--count');
    if (i >= 0 && process.argv[i + 1]) return Math.max(1, Number(process.argv[i + 1]) || 2);
    return 2;
}

function toMarkdown(draft) {
    let md = `# Sosyal medya taslakları — ${draft.date}\n\n`;
    md += `Üretim: ${draft.generatedAt}\n`;
    md += `Durum: **ONAY BEKLİYOR** (otomatik paylaşım yok)\n\n`;
    md += `> Kalite notu: Hukuki üslup, sansasyonsuz; site referansı sade domain/URL.\n\n`;

    draft.items.forEach((item, i) => {
        md += `---\n\n## ${i + 1}. ${item.topic.title || item.topic.source}\n\n`;
        md += `- Kaynak: ${item.topic.source}\n`;
        md += `- Künye: ${item.topic.kunye || '—'}\n`;
        md += `- Sayfa: ${item.topic.url || '—'}\n`;
        if (item.cardPath) md += `- Instagram kartı: \`${item.cardPath}\`\n`;
        md += `\n### X / Twitter\n\n\`\`\`\n${item.tweet}\n\`\`\`\n\n`;
        md += `### Instagram caption\n\n\`\`\`\n${item.instagramCaption}\n\`\`\`\n\n`;
        md += `### Instagram kart başlığı\n\n> ${item.cardHeadline}\n\n`;
        md += `### YouTube Shorts metni\n\n${item.youtubeScript}\n\n`;
    });

    md += `---\n\nOnay için: taslakları gözden geçirin. Yayın: \`node scripts/social-publish.js --date ${draft.date}\`\n`;
    return md;
}

async function main() {
    const count = parseCount();
    const date = todayISO();
    console.log(`[social-draft] ${date} count=${count}`);

    const topics = await getSocialTopics(count);
    if (topics.length === 0) throw new Error('İçerik kaynağı boş');
    console.log(
        '[social-draft] topics:',
        topics.map((t) => t.id || t.title).join(', ')
    );

    const [tweets, captions, headlines, youtube] = await Promise.all([
        writeTweets(topics),
        writeCaptions(topics),
        generateCardHeadlines(topics),
        writeYoutubeScripts(topics),
    ]);

    await mkdir(OUT_DIR, { recursive: true });
    const cardDir = join(OUT_DIR, date);
    await mkdir(cardDir, { recursive: true });

    const items = [];
    for (let i = 0; i < topics.length; i++) {
        const h = { ...topics[i], cardText: headlines[i] };
        let cardPath = null;
        try {
            cardPath = await generateCard(h, join(cardDir, `card-${i + 1}.png`));
        } catch (err) {
            console.warn('[social-draft] card gen failed:', err.message);
        }
        items.push({
            topic: topics[i],
            tweet: tweets[i],
            instagramCaption: captions[i],
            cardHeadline: headlines[i],
            cardPath,
            youtubeScript: youtube[i]?.script || '',
        });
    }

    const draft = {
        date,
        generatedAt: new Date().toISOString(),
        status: 'pending_approval',
        items,
    };

    const jsonPath = join(OUT_DIR, `${date}.json`);
    const mdPath = join(OUT_DIR, `${date}.md`);
    await writeFile(jsonPath, JSON.stringify(draft, null, 2), 'utf-8');
    await writeFile(mdPath, toMarkdown(draft), 'utf-8');

    console.log(`[social-draft] wrote ${jsonPath}`);
    console.log(`[social-draft] wrote ${mdPath}`);
    console.log('[social-draft] OTOMATİK PAYLAŞIM YOK — onayınızı bekliyor.');
}

main().catch((err) => {
    console.error('[social-draft] fatal:', err.message);
    process.exit(1);
});
