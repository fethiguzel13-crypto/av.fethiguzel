import { chromium } from 'playwright';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

function truncate(text, maxLen) {
  if (!text) return '';
  const t = String(text).trim();
  return t.length > maxLen ? t.slice(0, maxLen - 1) + '…' : t;
}

const BADGE_COLORS = {
  AYM: '#c9a84c',
  Yargıtay: '#c9a84c',
  AİHM: '#c9a84c',
  RG: '#c9a84c',
};

export function buildCardHtml(h) {
  const konu = truncate(h.cardText || h.publicSummary || h.konu || '', 160);
  const kunye = h.kunye ? truncate(h.kunye, 80) : '';

  const cornerSvg = `<svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
    <path d="M8,8 L8,90" stroke="#5a3008" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M8,8 L90,8" stroke="#5a3008" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M20,8 Q20,20 8,20" stroke="#5a3008" stroke-width="2.5" fill="none"/>
    <path d="M8,20 Q20,20 20,8" stroke="#5a3008" stroke-width="1" fill="none" opacity="0.5"/>
    <circle cx="8" cy="8" r="5" fill="#5a3008"/>
    <circle cx="50" cy="8" r="3" fill="#5a3008" opacity="0.6"/>
    <circle cx="8" cy="50" r="3" fill="#5a3008" opacity="0.6"/>
    <path d="M30,8 Q40,8 40,18" stroke="#5a3008" stroke-width="1.5" fill="none" opacity="0.7"/>
    <path d="M8,30 Q8,40 18,40" stroke="#5a3008" stroke-width="1.5" fill="none" opacity="0.7"/>
  </svg>`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1080px; height: 1080px; overflow: hidden; }

  body {
    background: radial-gradient(ellipse at center, #3a1e00 0%, #1a0c00 55%, #050200 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card {
    width: 960px;
    height: 960px;
    background: linear-gradient(145deg,
      #b07810 0%, #8a5c08 15%, #7a4e06 30%,
      #a86e0e 48%, #8a5a08 62%, #9c6a0c 78%, #7a4e06 92%, #b07010 100%
    );
    border: 5px solid #4a2e04;
    box-shadow:
      inset 0 0 0 5px #8a6010,
      inset 0 0 0 10px #4a2e04,
      inset 0 0 0 14px #8a6010,
      0 0 0 3px #8a6010,
      0 0 80px rgba(0,0,0,0.95);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
  }

  /* Inner decorative border line */
  .inner-border {
    position: absolute;
    top: 60px; left: 60px; right: 60px; bottom: 60px;
    border: 1.5px solid rgba(40,20,0,0.6);
    pointer-events: none;
  }

  /* Corner SVGs */
  .corner {
    position: absolute;
    width: 110px;
    height: 110px;
  }
  .tl { top: 14px; left: 14px; }
  .tr { top: 14px; right: 14px; transform: scaleX(-1); }
  .bl { bottom: 14px; left: 14px; transform: scaleY(-1); }
  .br { bottom: 14px; right: 14px; transform: scale(-1,-1); }

  /* Content */
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 36px;
    padding: 90px 90px 120px;
    position: relative;
    z-index: 1;
    width: 100%;
  }

  .scales {
    font-size: 96px;
    line-height: 1;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35));
    flex-shrink: 0;
  }

  .main-text {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 48px;
    font-weight: bold;
    color: #0e0700;
    text-align: center;
    line-height: 1.45;
    text-shadow: 0 1px 0 rgba(200,140,40,0.2);
  }

  .citation {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 32px;
    font-weight: bold;
    color: #1e0f00;
    text-align: center;
    line-height: 1.3;
  }

  /* Bottom attribution ribbon */
  .ribbon {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 72px;
    background: linear-gradient(180deg, rgba(80,40,5,0) 0%, rgba(70,35,5,0.88) 45%, rgba(55,28,3,0.97) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Georgia, serif;
    font-style: italic;
    font-size: 28px;
    letter-spacing: 3px;
    color: #f5e090;
    text-shadow: 0 1px 4px rgba(0,0,0,0.6);
    border-top: 1px solid rgba(90,48,8,0.4);
  }
</style>
</head>
<body>
<div class="card">
  <div class="corner tl">${cornerSvg}</div>
  <div class="corner tr">${cornerSvg}</div>
  <div class="corner bl">${cornerSvg}</div>
  <div class="corner br">${cornerSvg}</div>
  <div class="inner-border"></div>

  <div class="content">
    <div class="scales">⚖️</div>
    <div class="main-text">${konu}</div>
    ${kunye ? `<div class="citation">(${kunye})</div>` : ''}
  </div>

  <div class="ribbon">Av. Fethi Güzel</div>
</div>
</body>
</html>`;
}

export async function generateCard(highlight) {
  const html = buildCardHtml(highlight);
  const imgPath = join(tmpdir(), `ig-card-${highlight.id}-${Date.now()}.png`);

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1080 });
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: imgPath });
  } finally {
    await browser.close();
  }

  return imgPath;
}

export async function deleteCard(imgPath) {
  try { await unlink(imgPath); } catch { /* ignore */ }
}
