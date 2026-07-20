/**
 * Generate Play Store / Android adaptive icons from portal photo.
 */
import sharp from 'sharp';
import { mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
// mobile/ lives inside fethiguzel-portal/ OR next to it
const candidates = [
  join(root, '..', 'public', 'fethi-guzel.jpg'),
  join(root, '..', 'fethiguzel-portal', 'public', 'fethi-guzel.jpg'),
];
const portalPhoto = candidates.find((p) => existsSync(p));
if (!portalPhoto) {
  console.error('Photo not found. Tried:', candidates.join(' | '));
  process.exit(1);
}
const assets = join(root, 'assets');
mkdirSync(assets, { recursive: true });

console.log('using photo', portalPhoto);
const bg = { r: 46, g: 64, b: 54, alpha: 1 }; // #2E4036

async function squareIcon(size, out) {
  const img = sharp(portalPhoto).resize(size, size, { fit: 'cover', position: 'attention' });
  await img.png().toFile(out);
  console.log('wrote', out);
}

async function playFeatureGraphic() {
  // 1024 x 500 Play feature graphic
  const w = 1024;
  const h = 500;
  const photo = await sharp(portalPhoto)
    .resize(420, 420, { fit: 'cover', position: 'attention' })
    .png()
    .toBuffer();

  const svg = Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2E4036"/>
          <stop offset="100%" stop-color="#1A1A1A"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="72" y="210" fill="#F2F0E9" font-family="Arial, sans-serif" font-size="48" font-weight="700">Av. Fethi Güzel</text>
      <text x="72" y="270" fill="#CC5833" font-family="Arial, sans-serif" font-size="28" font-weight="600">Hukuk Portalı</text>
      <text x="72" y="320" fill="#F2F0E9" font-family="Arial, sans-serif" font-size="20" opacity="0.8">7800+ madde · Şerh · Hesaplama</text>
    </svg>
  `);

  await sharp(svg)
    .composite([{ input: photo, left: 560, top: 40 }])
    .png()
    .toFile(join(assets, 'play-feature-graphic.png'));
  console.log('wrote play-feature-graphic.png');
}

await squareIcon(512, join(assets, 'icon-512.png'));
await squareIcon(192, join(assets, 'icon-192.png'));
await squareIcon(1024, join(assets, 'play-icon-1024.png'));
await playFeatureGraphic();

// Foreground for adaptive icon (safe zone)
await sharp(portalPhoto)
  .resize(768, 768, { fit: 'cover', position: 'attention' })
  .extend({ top: 128, bottom: 128, left: 128, right: 128, background: bg })
  .resize(1024, 1024)
  .png()
  .toFile(join(assets, 'icon-foreground-1024.png'));

console.log('icons ready in assets/');
