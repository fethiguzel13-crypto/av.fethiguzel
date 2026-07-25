/**
 * Safe prebuild for local + Vercel.
 * On Vercel NEVER rebuild packs from markdown (content/ is often missing or partial)
 * and NEVER overwrite good public packs with empty stubs.
 */
import { spawnSync } from 'node:child_process';
import {
    existsSync,
    statSync,
    copyFileSync,
    readdirSync,
    mkdirSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const packsDir = join(root, 'content-packs');
const publicDirs = [
    join(root, 'public', 'packs'),
    join(root, 'public', 'content-packs'),
];

function packCount(gzPath) {
    try {
        const buf = readFileSync(gzPath);
        if (buf.length < 64) return 0;
        return Object.keys(JSON.parse(gunzipSync(buf).toString('utf8'))).length;
    } catch {
        return 0;
    }
}

function copyAllPacks() {
    if (!existsSync(packsDir)) {
        console.error('FATAL: content-packs/ missing');
        process.exit(1);
    }
    for (const dir of publicDirs) mkdirSync(dir, { recursive: true });
    const files = readdirSync(packsDir).filter(
        (f) => f.endsWith('.json.gz') || f === 'manifest.json'
    );
    let articles = 0;
    for (const f of files) {
        const src = join(packsDir, f);
        for (const dir of publicDirs) {
            copyFileSync(src, join(dir, f));
        }
        if (f.endsWith('.json.gz')) {
            const n = packCount(src);
            articles += n;
            const kb = (statSync(src).size / 1024).toFixed(0);
            if (n === 0) {
                console.error(`FATAL: source pack empty: ${f}`);
                process.exit(1);
            }
            console.log(`ensure ${f}: ${n} articles, ${kb}KB`);
        }
    }
    console.log(`prebuild-safe: ${files.length} files, ~${articles} articles → public/packs + public/content-packs`);
}

function verifyPublic() {
    const probe = join(root, 'public', 'packs', 'tbk.json.gz');
    const n = packCount(probe);
    const size = existsSync(probe) ? statSync(probe).size : 0;
    console.log(`verify public/packs/tbk.json.gz: ${size} bytes, ${n} articles`);
    if (size < 1000 || n < 10) {
        console.error('FATAL: public packs still empty after copy — şerhler will not show');
        process.exit(1);
    }
}

const onVercel = !!(process.env.VERCEL || process.env.CI);

// Always restore packs from committed content-packs (source of truth)
copyAllPacks();
verifyPublic();

if (onVercel) {
    // Index: keep committed public/data/mevzuat-index.json if present
    const index = join(root, 'public', 'data', 'mevzuat-index.json');
    if (existsSync(index) && statSync(index).size > 10000) {
        console.log('Vercel: keeping existing mevzuat-index.json');
    } else {
        console.log('Vercel: building index from packs…');
        const r = spawnSync(process.execPath, [join(__dir, 'build-mevzuat-index.mjs')], {
            cwd: root,
            stdio: 'inherit',
            env: process.env,
        });
        if (r.status !== 0) process.exit(r.status || 1);
    }
    console.log('Vercel prebuild done (packs only, no markdown rebuild)');
    process.exit(0);
}

// Local: full index rebuild from markdown when available
const r = spawnSync(process.execPath, [join(__dir, 'build-mevzuat-index.mjs')], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
});
if (r.status !== 0) process.exit(r.status || 1);
console.log('Local prebuild done');
