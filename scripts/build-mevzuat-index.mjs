/**
 * Mevzuat arama indeksi → public/data/mevzuat-index.json
 * content/ yoksa (Vercel) mevcut indeksi korur veya content-packs'ten üretir.
 */
import {
    readdirSync,
    readFileSync,
    writeFileSync,
    existsSync,
    mkdirSync,
    statSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const contentDir = join(root, 'content', 'mevzuat');
const packsDir = join(root, 'content-packs');
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

function writeIndex(items) {
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
    writeFileSync(outFile, JSON.stringify(payload));
    console.log(`mevzuat-index: ${items.length} items → ${outFile}`);
    if (items.length === 0) {
        console.error('FATAL: empty mevzuat index');
        process.exit(1);
    }
}

function buildFromMarkdown() {
    const items = [];
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
    writeIndex(items);
}

function buildFromPacks() {
    if (!existsSync(packsDir)) {
        if (existsSync(outFile)) {
            const prev = JSON.parse(readFileSync(outFile, 'utf8'));
            console.warn(
                `content missing; keeping existing index (${prev.count || prev.items?.length || 0} items)`
            );
            return;
        }
        console.error('No content/ and no packs/ for index');
        process.exit(1);
    }
    const items = [];
    for (const f of readdirSync(packsDir).filter((x) => x.endsWith('.json.gz'))) {
        const kanunId = f.replace(/\.json\.gz$/, '');
        let pack;
        try {
            pack = JSON.parse(gunzipSync(readFileSync(join(packsDir, f))).toString('utf8'));
        } catch (e) {
            console.warn('skip pack', f, e.message);
            continue;
        }
        for (const [id, a] of Object.entries(pack)) {
            const snippet = String(a.official || a.commentary || '')
                .replace(/\*\*/g, '')
                .replace(/#+\s*/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .slice(0, 220);
            items.push({
                kanunId,
                id,
                title: a.title || id,
                kanun: a.kanun || kanunId,
                maddeNo: Number(a.maddeNo) || 0,
                status: a.commentary ? 'completed' : 'unknown',
                href: `/mevzuat/${kanunId}/${id}`,
                snippet,
            });
        }
    }
    writeIndex(items);
}

if (existsSync(contentDir)) {
    buildFromMarkdown();
} else {
    console.warn('content/mevzuat missing — building index from content-packs/');
    buildFromPacks();
}
