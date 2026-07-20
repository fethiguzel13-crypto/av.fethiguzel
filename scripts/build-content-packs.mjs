/**
 * Packs content/mevzuat/{kanun}/*.md into content-packs/{kanun}.json.gz
 * and public/content-packs/ (CDN fallback for Vercel SSR).
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import matter from 'gray-matter';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const contentDir = join(root, 'content', 'mevzuat');
const packsDir = join(root, 'content-packs');
const publicPacksDir = join(root, 'public', 'content-packs');

if (!existsSync(contentDir)) {
    console.error('content/mevzuat missing');
    process.exit(1);
}
mkdirSync(packsDir, { recursive: true });
mkdirSync(publicPacksDir, { recursive: true });

const splitRegex = /\n### (?:Bizim Yorumumuz|Akademik Yorum ve Analiz)\s*\n/;
const kanuns = readdirSync(contentDir).filter((k) =>
    statSync(join(contentDir, k)).isDirectory()
);

let totalRaw = 0;
let totalGz = 0;
let totalArticles = 0;

for (const kanunId of kanuns) {
    const dir = join(contentDir, kanunId);
    const files = readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
    /** @type {Record<string, { title: string, kanun: string, maddeNo: number, official: string, commentary: string }>} */
    const pack = {};

    for (const file of files) {
        const id = file.replace(/\.md$/, '');
        const raw = readFileSync(join(dir, file), 'utf8');
        totalRaw += Buffer.byteLength(raw);
        const { data, content } = matter(raw);
        const parts = content.split(splitRegex);
        const official = (parts[0] || '').trim() || content.trim();
        let commentary = parts.length > 1 ? parts[1].trim() : '';
        if (commentary === 'Bu maddeye ait akademik yorum ve analiz yakında eklenecektir.') {
            commentary = '';
        }
        pack[id] = {
            title: String(data.title ?? id),
            kanun: String(data.kanun ?? kanunId),
            maddeNo: Number(data.maddeNo ?? 0),
            official,
            commentary,
        };
        totalArticles++;
    }

    const json = JSON.stringify(pack);
    const gz = gzipSync(Buffer.from(json, 'utf8'), { level: 6 });
    totalGz += gz.length;
    writeFileSync(join(packsDir, `${kanunId}.json.gz`), gz);
    writeFileSync(join(publicPacksDir, `${kanunId}.json.gz`), gz);
    console.log(`pack ${kanunId}: ${files.length} articles, gz=${(gz.length / 1024).toFixed(0)}KB`);
}

const manifest = JSON.stringify({
    generatedAt: new Date().toISOString(),
    kanuns,
    totalArticles,
    rawBytes: totalRaw,
    gzBytes: totalGz,
});
writeFileSync(join(packsDir, 'manifest.json'), manifest);
writeFileSync(join(publicPacksDir, 'manifest.json'), manifest);

console.log(
    `content-packs: ${totalArticles} articles, raw=${(totalRaw / 1e6).toFixed(1)}MB → gz=${(totalGz / 1e6).toFixed(1)}MB (+ public/)`
);
