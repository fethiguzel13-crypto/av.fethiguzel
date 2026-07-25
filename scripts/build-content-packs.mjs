/**
 * Packs content/mevzuat/{kanun}/*.md into content-packs/{kanun}.json.gz
 * and public/content-packs/ (browser + CDN).
 *
 * On Vercel, `content/` is often excluded (.vercelignore) to shrink upload size.
 * In that case we COPY committed content-packs/*.json.gz → public/content-packs/
 * so şerhler remain available. Never write empty packs over good gz files.
 */
import {
    readdirSync,
    readFileSync,
    writeFileSync,
    existsSync,
    mkdirSync,
    statSync,
    copyFileSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync, gunzipSync } from 'node:zlib';
import matter from 'gray-matter';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const contentDir = join(root, 'content', 'mevzuat');
const packsDir = join(root, 'content-packs');
const publicPacksDir = join(root, 'public', 'content-packs');

mkdirSync(packsDir, { recursive: true });
mkdirSync(publicPacksDir, { recursive: true });

const splitRegex = /\n### (?:Bizim Yorumumuz|Akademik Yorum ve Analiz)\s*\n/;

function packArticleCount(gzPath) {
    try {
        const buf = readFileSync(gzPath);
        if (buf.length < 50) return 0;
        const json = gunzipSync(buf).toString('utf8');
        return Object.keys(JSON.parse(json)).length;
    } catch {
        return 0;
    }
}

/** Copy committed packs → public (deploy path when content/ is absent). */
function copyPacksToPublic() {
    if (!existsSync(packsDir)) {
        console.error('content-packs/ missing — cannot serve şerhler');
        process.exit(1);
    }
    const files = readdirSync(packsDir).filter(
        (f) => f.endsWith('.json.gz') || f === 'manifest.json'
    );
    if (files.length === 0) {
        console.error('content-packs/ has no .json.gz files');
        process.exit(1);
    }
    let copied = 0;
    let articles = 0;
    for (const f of files) {
        const src = join(packsDir, f);
        const dest = join(publicPacksDir, f);
        copyFileSync(src, dest);
        copied++;
        if (f.endsWith('.json.gz')) {
            const n = packArticleCount(src);
            articles += n;
            const kb = (statSync(src).size / 1024).toFixed(0);
            console.log(`copy ${f}: ${n} articles, ${kb}KB → public/content-packs/`);
            if (n === 0) {
                console.warn(`WARN empty pack: ${f}`);
            }
        }
    }
    console.log(
        `content-packs: copied ${copied} files (~${articles} articles) to public/ (no content rebuild)`
    );
}

function buildFromMarkdown() {
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

        // Never overwrite a good committed pack with an empty rebuild
        if (Object.keys(pack).length === 0) {
            const existing = join(packsDir, `${kanunId}.json.gz`);
            if (existsSync(existing) && packArticleCount(existing) > 0) {
                copyFileSync(existing, join(publicPacksDir, `${kanunId}.json.gz`));
                console.warn(`skip empty rebuild ${kanunId}: kept committed pack`);
                continue;
            }
            console.warn(`skip empty pack ${kanunId}`);
            continue;
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

    if (totalArticles === 0) {
        console.warn('Rebuild produced 0 articles — falling back to copy from content-packs/');
        copyPacksToPublic();
    }
}

// Prefer rebuild when source markdown is present; otherwise deploy committed packs.
if (existsSync(contentDir)) {
    buildFromMarkdown();
} else {
    console.warn('content/mevzuat missing (e.g. Vercel .vercelignore) — copying content-packs/ → public/');
    copyPacksToPublic();
}

// Final safety: at least one non-empty pack must exist in public/
const publicGz = existsSync(publicPacksDir)
    ? readdirSync(publicPacksDir).filter((f) => f.endsWith('.json.gz'))
    : [];
const good = publicGz.filter((f) => packArticleCount(join(publicPacksDir, f)) > 0);
if (good.length === 0) {
    console.error('FATAL: no non-empty packs in public/content-packs/ — şerhler will not load');
    process.exit(1);
}
console.log(`verify: ${good.length}/${publicGz.length} public packs have articles`);
