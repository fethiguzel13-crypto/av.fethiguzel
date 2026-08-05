/**
 * Prebuild:
 * 1) Light index check
 * 2) Per-madde JSON shards for Edge SEO (public/data/m/) — NOT full-pack Edge load
 */
import { existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

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

if (existsSync(indexPath)) {
    console.log(
        `[prebuild-safe] index ok (${(statSync(indexPath).size / 1e6).toFixed(2)}MB)`
    );
} else {
    console.warn('[prebuild-safe] no index — run: npm run build:index');
}

// Madde HTML artık Node route ile tam şerh sunulur (next.config rewrite kaldırıldı).
// İsteğe bağlı statik üretim: FULL_SEO_MADDE_HTML=1 ile açılır (büyük artifact).
if (process.env.FULL_SEO_MADDE_HTML === '1') {
    const r = spawnSync(process.execPath, [join(root, 'scripts', 'build-seo-madde-html.mjs')], {
        cwd: root,
        stdio: 'inherit',
        env: process.env,
    });
    if (r.status !== 0) {
        console.error('[prebuild-safe] build-seo-madde-html failed');
        process.exit(r.status || 1);
    }
} else {
    console.log('[prebuild-safe] skip seo-madde static HTML (route serves full şerh)');
}

const r2 = spawnSync(process.execPath, [join(root, 'scripts', 'build-priority-sitemap.mjs')], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
});
if (r2.status !== 0) {
    console.warn('[prebuild-safe] priority-sitemap failed (non-fatal)');
}

const r3 = spawnSync(process.execPath, [join(root, 'scripts', 'build-bilgi-sitemap.mjs')], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
});
if (r3.status !== 0) {
    console.warn('[prebuild-safe] bilgi-sitemap failed (non-fatal)');
}

const r4 = spawnSync(process.execPath, [join(root, 'scripts', 'build-ders-notlari-sitemap.mjs')], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
});
if (r4.status !== 0) {
    console.warn('[prebuild-safe] ders-notlari-sitemap failed (non-fatal)');
}

const r5 = spawnSync(process.execPath, [join(root, 'scripts', 'build-site-search-only.mjs')], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
});
if (r5.status !== 0) {
    console.warn('[prebuild-safe] site-search failed (non-fatal)');
}

console.log('[prebuild-safe] done');
