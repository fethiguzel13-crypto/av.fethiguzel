/**
 * Safe prebuild for local + Vercel.
 *
 * Madde pages (App Router) load packs from jsDelivr/GitHub first.
 * On Vercel we avoid heavy pack rebuild/copy so builds stay fast and reliable.
 * Locally we still copy packs for offline / static viewer fallback.
 */
import { spawnSync } from 'node:child_process';
import {
    existsSync,
    statSync,
    copyFileSync,
    readdirSync,
    mkdirSync,
    readFileSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

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
            if (n === 0) {
                console.error(`FATAL: source pack empty: ${f}`);
                process.exit(1);
            }
        }
    }
    console.log(
        `prebuild-safe: copied ${files.length} files (~${articles} articles) → public/`
    );
}

const onVercel = !!(process.env.VERCEL || process.env.CI);

if (onVercel) {
    // Client loads packs from jsDelivr — do not rebuild/copy 30MB+ packs on every deploy.
    // Index: keep committed public/data/mevzuat-index.json when present.
    const index = join(root, 'public', 'data', 'mevzuat-index.json');
    if (existsSync(index) && statSync(index).size > 10000) {
        console.log(
            `Vercel: skip pack rebuild; index ok (${(statSync(index).size / 1e6).toFixed(1)}MB)`
        );
    } else if (existsSync(packsDir)) {
        console.log('Vercel: index missing — building from packs…');
        const r = spawnSync(process.execPath, [join(__dir, 'build-mevzuat-index.mjs')], {
            cwd: root,
            stdio: 'inherit',
            env: process.env,
        });
        if (r.status !== 0) process.exit(r.status || 1);
    } else {
        console.warn('Vercel: no index and no packs — listings may be empty');
    }
    console.log('Vercel prebuild done (App Router + jsDelivr packs)');
    process.exit(0);
}

// Local: full copy + index
copyAllPacks();
const probe = join(root, 'public', 'packs', 'tbk.json.gz');
if (!existsSync(probe) || packCount(probe) < 10) {
    console.error('FATAL: public packs empty after copy');
    process.exit(1);
}
const r = spawnSync(process.execPath, [join(__dir, 'build-mevzuat-index.mjs')], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
});
if (r.status !== 0) process.exit(r.status || 1);
console.log('Local prebuild done');
