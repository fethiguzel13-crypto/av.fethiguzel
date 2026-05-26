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
  const badge = String(h.source || '');
  const kunye = h.kunye ? truncate(h.kunye, 60) : null;
  const konu = truncate(h.publicSummary || h.konu || '', 120);
  const badgeColor = BADGE_COLORS[h.source] || '#c9a84c';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1080px; height: 1080px; overflow: hidden; }
  body {
    background: #0f0f1a;
    color: #f5f5f5;
    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 90px;
  }
  .badge {
    display: inline-block;
    background: ${badgeColor};
    color: #0f0f1a;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 10px 22px;
    border-radius: 6px;
    margin-bottom: 36px;
    align-self: flex-start;
  }
  .kunye {
    font-family: 'Courier New', monospace;
    font-size: 24px;
    color: #777;
    margin-bottom: 44px;
  }
  .divider {
    border: none;
    border-top: 2px solid #2a2a3a;
    margin-bottom: 52px;
  }
  .konu {
    font-size: 48px;
    font-weight: 700;
    line-height: 1.3;
    color: #f5f5f5;
    margin-bottom: 64px;
    flex: 1;
  }
  .footer {
    border-top: 1px solid #2a2a3a;
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 22px;
    color: #666;
  }
</style>
</head>
<body>
  <div class="badge">${badge}</div>
  ${kunye ? `<div class="kunye">${kunye}</div>` : ''}
  <hr class="divider">
  <div class="konu">${konu}</div>
  <div class="footer">
    <span>Av. Fethi Güzel</span>
    <span>avfethiguzel.com</span>
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
