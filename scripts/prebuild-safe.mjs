/**
 * Vercel-safe prebuild — must finish in seconds, never OOM.
 *
 * Madde pages load packs from jsDelivr at runtime.
 * Do NOT gunzip/parse multi‑MB packs here.
 */
import { existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = join(root, 'public', 'data', 'mevzuat-index.json');

const onRemote = !!(
    process.env.VERCEL ||
    process.env.CI ||
    process.env.VERCEL_ENV ||
    process.env.VERCEL_URL
);

console.log(
    `[prebuild-safe] remote=${onRemote} VERCEL=${process.env.VERCEL || ''} CI=${process.env.CI || ''} NODE=${process.version}`
);

if (onRemote) {
    if (existsSync(indexPath)) {
        const mb = (statSync(indexPath).size / 1e6).toFixed(2);
        console.log(`[prebuild-safe] index present (${mb}MB) — skip pack work`);
    } else {
        console.warn(
            '[prebuild-safe] public/data/mevzuat-index.json missing — mevzuat listings may be empty'
        );
    }
    console.log('[prebuild-safe] done (client packs via jsDelivr)');
    process.exit(0);
}

// Local only: optional light check
if (existsSync(indexPath)) {
    console.log(
        `[prebuild-safe] local: index ok (${(statSync(indexPath).size / 1e6).toFixed(2)}MB)`
    );
} else {
    console.warn('[prebuild-safe] local: no index — run: npm run build:index');
}
console.log('[prebuild-safe] local done');
