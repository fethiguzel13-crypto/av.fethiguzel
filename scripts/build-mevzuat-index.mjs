/**
 * Mevzuat arama indeksi üretir → public/data/mevzuat-index.json
 * Kullanım: node scripts/build-mevzuat-index.mjs
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const contentDir = join(root, 'content', 'mevzuat');
const outDir = join(root, 'public', 'data');
const outFile = join(outDir, 'mevzuat-index.json');

function parseFrontmatter(raw) {
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    if (!m) return { data: {}, body: raw };
    const data = {};
    for (const line of m[1].split(/\r?\n/)) {
        const kv = line.match(/^(\w+):\s*(.+)$/);
        if (!kv) continue;
        let v = kv[2].trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
        }
        data[kv[1]] = v;
    }
    return { data, body: raw.slice(m[0].length) };
}

const items = [];
if (!existsSync(contentDir)) {
    console.error('content/mevzuat yok');
    process.exit(1);
}

for (const kanunId of readdirSync(contentDir)) {
    const dir = join(contentDir, kanunId);
    if (!statSync(dir).isDirectory()) continue;
    for (const file of readdirSync(dir)) {
        if (!file.endsWith('.md') || file.startsWith('_')) continue;
        const id = file.replace(/\.md$/, '');
        const raw = readFileSync(join(dir, file), 'utf8');
        const { data, body } = parseFrontmatter(raw);
        const title = data.title || id;
        const kanun = data.kanun || kanunId;
        const maddeNo = parseInt(data.maddeNo || '0', 10) || 0;
        const status = data.commentaryStatus || 'unknown';
        // arama için kısa snippet (başlık + resmi metin başlangıcı)
        const clean = body
            .replace(/\*\*/g, '')
            .replace(/#+\s*/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 220);
        items.push({
            kanunId,
            id,
            title,
            kanun,
            maddeNo,
            status,
            href: `/mevzuat/${kanunId}/${id}`,
            snippet: clean,
        });
    }
}

items.sort((a, b) => {
    if (a.kanunId !== b.kanunId) return a.kanunId.localeCompare(b.kanunId, 'tr');
    return a.maddeNo - b.maddeNo;
});

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const payload = {
    generatedAt: new Date().toISOString(),
    count: items.length,
    items,
};

writeFileSync(outFile, JSON.stringify(payload), 'utf8');
console.log(`mevzuat-index.json: ${items.length} madde → ${outFile}`);
