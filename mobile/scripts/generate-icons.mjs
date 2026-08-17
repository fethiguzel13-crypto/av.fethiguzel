#!/usr/bin/env node
/**
 * Uygulama başına ayrı görsel kimlik üretir.
 *
 *   assets/icons/<id>-512.png        Play simgesi
 *   assets/icons/<id>-1024.png       Play mağaza simgesi
 *   assets/icons/<id>-feature.png    1024×500 öne çıkan grafik
 *   assets/icons/<id>-fg.png         Android uyarlanabilir simge ön planı
 *   assets/icons/<id>-notify.png     Bildirim çubuğu simgesi (tek renk)
 *   assets/icons/<id>-splash.png     Açılış ekranı
 *
 * ── Neden ───────────────────────────────────────────────────────────────────
 * Önceki sürümde dört flavor da `assets/icon-512.png` dosyasının BİREBİR
 * kopyasını taşıyordu. Aynı geliştirici hesabından, aynı simgeyle, aynı alan
 * adına bakan dört uygulama, Play'in Repetitive Content değerlendirmesinde
 * en görünür kırmızı bayraktır. Her uygulamanın kendi rengi ve kendi işareti
 * olması, ayrımın mağaza listesinde ilk bakışta görünmesini sağlar.
 *
 * İşaretler bilinçli olarak sade: küçük boyutta okunmalı ve marka ailesine
 * ait olduğu anlaşılmalı.
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const catalog = JSON.parse(
  (await import('node:fs')).readFileSync(join(root, 'galaxy', 'catalog.json'), 'utf8')
);

const outDir = join(root, 'assets', 'icons');
mkdirSync(outDir, { recursive: true });

const CREAM = '#F2F0E9';

/** Her uygulamanın işareti — 512×512 kutu içinde, SVG parçası olarak. */
const MARKS = {
  // Mevzuat: paragraf işareti, altında sayfa çizgileri
  portal: (c) => `
    <text x="256" y="300" font-family="Georgia,serif" font-size="270" font-weight="700"
          fill="${c}" text-anchor="middle">§</text>
    <rect x="150" y="352" width="212" height="14" rx="7" fill="${c}" opacity="0.55"/>
    <rect x="150" y="386" width="150" height="14" rx="7" fill="${c}" opacity="0.32"/>`,

  // Hesap: hesap makinesi tuş ızgarası + eşittir
  hesap: (c) => `
    <rect x="150" y="132" width="212" height="60" rx="16" fill="${c}" opacity="0.45"/>
    ${[0, 1, 2]
      .flatMap((r) =>
        [0, 1, 2].map(
          (k) =>
            `<rect x="${150 + k * 76}" y="${222 + r * 68}" width="60" height="52" rx="14" fill="${c}" opacity="${r === 2 && k === 2 ? 1 : 0.8}"/>`
        )
      )
      .join('\n    ')}`,

  // İçtihat: tokmak — daire + eğik sap + kaide
  icthat: (c) => `
    <g transform="rotate(-38 256 236)">
      <rect x="176" y="150" width="160" height="66" rx="20" fill="${c}"/>
      <rect x="238" y="216" width="36" height="150" rx="14" fill="${c}" opacity="0.85"/>
    </g>
    <rect x="132" y="384" width="248" height="34" rx="17" fill="${c}"/>`,

  // Rehber: açık kitap
  rehber: (c) => `
    <path d="M256 168 C214 138 168 132 122 140 L122 372 C168 364 214 370 256 400 Z"
          fill="${c}"/>
    <path d="M256 168 C298 138 344 132 390 140 L390 372 C344 364 298 370 256 400 Z"
          fill="${c}" opacity="0.72"/>
    <rect x="246" y="168" width="20" height="232" rx="10" fill="${c}" opacity="0.35"/>`,
};

function iconSvg(app, size) {
  const mark = MARKS[app.id] ?? MARKS.portal;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${app.accent}"/>
  <circle cx="256" cy="256" r="300" fill="#FFFFFF" opacity="0.05"/>
  ${mark(CREAM)}
</svg>`;
}

/** Uyarlanabilir simge ön planı — güvenli alan içinde kalsın diye %68 ölçek. */
function foregroundSvg(app) {
  const mark = MARKS[app.id] ?? MARKS.portal;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512">
  <g transform="translate(256 256) scale(0.68) translate(-256 -256)">
    ${mark(CREAM)}
  </g>
</svg>`;
}

/** Bildirim simgesi: Android yalnız alfa kanalını kullanır, beyaz çizim şart. */
function notifySvg(app) {
  const mark = MARKS[app.id] ?? MARKS.portal;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 512 512">
  <g transform="translate(256 256) scale(0.78) translate(-256 -256)">
    ${mark('#FFFFFF')}
  </g>
</svg>`;
}

function featureSvg(app, lang = 'tr') {
  const name = app.name[lang] || app.name.tr;
  const short = app.short[lang] || app.short.tr;
  const mark = MARKS[app.id] ?? MARKS.portal;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${app.accent}"/>
      <stop offset="100%" stop-color="${shade(app.accent, -0.35)}"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#g)"/>
  <circle cx="880" cy="80" r="260" fill="#FFFFFF" opacity="0.05"/>
  <g transform="translate(96 106) scale(0.56)">
    ${mark(CREAM)}
  </g>
  <text x="360" y="228" font-family="Segoe UI,Roboto,Helvetica,Arial,sans-serif"
        font-size="62" font-weight="700" fill="${CREAM}">${esc(name)}</text>
  <text x="360" y="288" font-family="Segoe UI,Roboto,Helvetica,Arial,sans-serif"
        font-size="30" fill="${CREAM}" opacity="0.82">${esc(short)}</text>
  <text x="360" y="356" font-family="Segoe UI,Roboto,Helvetica,Arial,sans-serif"
        font-size="24" fill="${CREAM}" opacity="0.55">Av. Fethi Güzel Hukuk Portalı</text>
</svg>`;
}

function splashSvg(app) {
  const mark = MARKS[app.id] ?? MARKS.portal;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <rect width="1080" height="1920" fill="${app.accent}"/>
  <g transform="translate(284 704) scale(1.0)">
    ${mark(CREAM)}
  </g>
</svg>`;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function shade(hex, amount) {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 255) * (1 + amount));
  const g = clamp(((n >> 8) & 255) * (1 + amount));
  const b = clamp((n & 255) * (1 + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

async function png(svg, size, file) {
  const buf = Buffer.from(svg, 'utf8');
  const img = sharp(buf, { density: 400 });
  await (Array.isArray(size) ? img.resize(size[0], size[1]) : img.resize(size, size))
    .png({ compressionLevel: 9 })
    .toFile(file);
}

for (const app of catalog.apps) {
  await png(iconSvg(app, 512), 512, join(outDir, `${app.id}-512.png`));
  await png(iconSvg(app, 1024), 1024, join(outDir, `${app.id}-1024.png`));
  await png(foregroundSvg(app), 1024, join(outDir, `${app.id}-fg.png`));
  await png(notifySvg(app), 96, join(outDir, `${app.id}-notify.png`));
  await png(featureSvg(app), [1024, 500], join(outDir, `${app.id}-feature.png`));
  await png(splashSvg(app), [1080, 1920], join(outDir, `${app.id}-splash.png`));

  // SVG kaynakları da bırakılır — vektör gerekirse elden geçirilebilir
  writeFileSync(join(outDir, `${app.id}.svg`), iconSvg(app, 512));

  console.log(`  ✓ ${app.id.padEnd(8)} ${app.accent}`);
}

console.log(`\n${catalog.apps.length} uygulama için simge üretildi → assets/icons/`);
console.log('Android kaynaklarına yazmak için: node scripts/build-flavor.mjs --app=<id>');

if (!existsSync(join(outDir, 'portal-512.png'))) {
  console.error('simge üretilemedi');
  process.exit(1);
}
