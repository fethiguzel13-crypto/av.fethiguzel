# Instagram Otomasyon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bilgisayar açıldığında günlük mahkeme kararlarından otomatik Instagram gönderisi üretip paylaşır — her highlight için 1080×1080px koyu görsel kart + Türkçe caption.

**Architecture:** `startup-instagram.js` orchestrator, `.instagram-log.json` ile tekrar paylaşımı önler; `avfethiguzel.com/data/daily.json`'dan highlights çeker; `instagram-card-writer.js` HTML→PNG kart üretir; `instagram-caption-writer.js` Claude Sonnet ile caption yazar; `instagram-poster.js` Playwright ile InstagramBot Chrome profili üzerinden Instagram web'e yükler ve paylaşır.

**Tech Stack:** Node.js ESM, `@anthropic-ai/sdk`, `playwright` (zaten yüklü), Windows Startup folder

---

### Task 1: instagram-caption-writer.js

**Files:**
- Create: `scripts/lib/instagram-caption-writer.js`
- Create: `scripts/lib/__tests__/instagram-caption-writer.test.js`

- [ ] **Step 1: Write the failing test**

```js
// scripts/lib/__tests__/instagram-caption-writer.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { writeCaptions } from '../instagram-caption-writer.js';

const MOCK_HIGHLIGHTS = [
  { id: 'aym-1', source: 'AYM', konu: 'İfade özgürlüğü', publicSummary: 'Test özeti.', category: undefined },
  { id: 'yarg-1', source: 'Yargıtay', konu: 'Tazminat', publicSummary: 'Yargıtay özeti.', category: 'YİBK' },
];

describe('writeCaptions', () => {
  it('returns one caption per highlight', async () => {
    const mockClient = {
      messages: { create: async () => ({ content: [{ type: 'text', text: 'Test caption metni.' }] }) }
    };
    const result = await writeCaptions(MOCK_HIGHLIGHTS, mockClient);
    assert.equal(result.length, 2);
  });

  it('appends correct AYM hashtags', async () => {
    const mockClient = {
      messages: { create: async () => ({ content: [{ type: 'text', text: 'Caption.' }] }) }
    };
    const [caption] = await writeCaptions([MOCK_HIGHLIGHTS[0]], mockClient);
    assert.ok(caption.includes('#AYM'));
    assert.ok(caption.includes('#hukuk'));
  });

  it('appends YİBK hashtags for Yargıtay YİBK category', async () => {
    const mockClient = {
      messages: { create: async () => ({ content: [{ type: 'text', text: 'Caption.' }] }) }
    };
    const [caption] = await writeCaptions([MOCK_HIGHLIGHTS[1]], mockClient);
    assert.ok(caption.includes('#YİBK'));
  });

  it('throws when API response is empty', async () => {
    const mockClient = {
      messages: { create: async () => ({ content: [] }) }
    };
    await assert.rejects(
      () => writeCaptions([MOCK_HIGHLIGHTS[0]], mockClient),
      /empty/i
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/__tests__/instagram-caption-writer.test.js`
Expected: FAIL — `writeCaptions` not found

- [ ] **Step 3: Create instagram-caption-writer.js**

```js
// scripts/lib/instagram-caption-writer.js
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM = `Sen Av. Fethi Güzel'sin. Mahkeme kararlarını Instagram'da hukuk meraklısı vatandaşlarla paylaşıyorsun.

Hedef kitle: Hukuku takip eden, merak eden, öğrenmek isteyen takipçiler.

Ton: Sohbet dili, bilgili ama samimi. Merak uyandırıcı ama didaktik değil.

Kurallar:
- 150-250 karakter (hashtag hariç)
- Kararın en çarpıcı noktasını öne çıkar
- "Bu kararda dikkat çeken..." gibi kişisel girişler dene
- Siyasi taraf tutma yok
- Son satır: "Kararın tam analizi için bağlantı profilde 🔗"
- Sadece caption metnini döndür, hashtag dahil etme`;

const HASHTAGS = {
  AYM:     '#hukuk #içtihat #AYM #anayasaMahkemesi #avukatlık',
  Yargıtay:'#hukuk #içtihat #Yargıtay #avukatlık',
  YİBK:    '#hukuk #içtihat #Yargıtay #YİBK #avukatlık',
  AİHM:    '#hukuk #içtihat #AİHM #insanHakları #avukatlık',
  RG:      '#hukuk #mevzuat #resmiGazete #avukatlık',
};

function hashtagsFor(source, category) {
  if (source === 'Yargıtay' && category === 'YİBK') return HASHTAGS.YİBK;
  return HASHTAGS[source] || '#hukuk #içtihat #avukatlık';
}

function summaryFor(h) {
  return (h.publicSummary || h.konu || '').trim().slice(0, 500);
}

export async function writeCaptions(highlights, client = new Anthropic()) {
  const captions = [];
  for (const h of highlights) {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: SYSTEM,
      messages: [{
        role: 'user',
        content: `Mahkeme: ${h.source}\nÖzet: ${summaryFor(h)}\n\nSadece caption metnini yaz.`
      }]
    });
    const raw = msg.content?.[0]?.text;
    if (!raw) throw new Error(`Empty API response for highlight ${h.id || h.source}`);
    const hashtags = hashtagsFor(h.source, h.category);
    captions.push(`${raw.trim()}\n\n${hashtags}`);
  }
  return captions;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/lib/__tests__/instagram-caption-writer.test.js`
Expected: 4 tests pass

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/instagram-caption-writer.js scripts/lib/__tests__/instagram-caption-writer.test.js
git commit -m "feat: add instagram-caption-writer.js"
```

---

### Task 2: instagram-card-writer.js

**Files:**
- Create: `scripts/lib/instagram-card-writer.js`
- Create: `scripts/lib/__tests__/instagram-card-writer.test.js`

- [ ] **Step 1: Write the failing test**

`buildCardHtml` pure fonksiyon olarak export edilecek — Playwright olmadan test edilebilir.

```js
// scripts/lib/__tests__/instagram-card-writer.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildCardHtml } from '../instagram-card-writer.js';

const HIGHLIGHT = {
  id: 'aym-2024-28913',
  source: 'AYM',
  kunye: 'AYM, B. No: 2024/28913',
  konu: 'İfade özgürlüğü ihlali iddiası',
  publicSummary: 'Test özeti metni burada yer alır.',
  date: '2026-05-26',
};

describe('buildCardHtml', () => {
  it('includes source badge text', () => {
    const html = buildCardHtml(HIGHLIGHT);
    assert.ok(html.includes('AYM'));
  });

  it('includes kunye text', () => {
    const html = buildCardHtml(HIGHLIGHT);
    assert.ok(html.includes('AYM, B. No: 2024/28913'));
  });

  it('includes publicSummary text', () => {
    const html = buildCardHtml(HIGHLIGHT);
    assert.ok(html.includes('Test özeti metni burada yer alır.'));
  });

  it('truncates konu at 120 chars', () => {
    const longKonu = 'A'.repeat(200);
    const html = buildCardHtml({ ...HIGHLIGHT, konu: longKonu, publicSummary: '' });
    assert.ok(html.includes('…'));
    assert.ok(!html.includes('A'.repeat(121)));
  });

  it('renders without kunye when missing', () => {
    const html = buildCardHtml({ ...HIGHLIGHT, kunye: undefined });
    assert.ok(!html.includes('undefined'));
  });

  it('sets 1080px dimensions', () => {
    const html = buildCardHtml(HIGHLIGHT);
    assert.ok(html.includes('1080px'));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/__tests__/instagram-card-writer.test.js`
Expected: FAIL — `buildCardHtml` not found

- [ ] **Step 3: Create instagram-card-writer.js**

```js
// scripts/lib/instagram-card-writer.js
import { chromium } from 'playwright';
import { writeFile, unlink } from 'node:fs/promises';
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/lib/__tests__/instagram-card-writer.test.js`
Expected: 6 tests pass

- [ ] **Step 5: Smoke test — generate one card visually**

```bash
node -e "
import('./scripts/lib/instagram-card-writer.js').then(async ({ generateCard }) => {
  const path = await generateCard({ id: 'test', source: 'AYM', kunye: 'AYM, B. No: 2024/28913', konu: 'İfade özgürlüğü ihlali — test kartı', publicSummary: '' });
  console.log('Kart oluşturuldu:', path);
});
"
```

Expected: `/tmp/ig-card-test-*.png` dosya yolu yazdırır. Dosyayı açıp görselі doğrula.

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/instagram-card-writer.js scripts/lib/__tests__/instagram-card-writer.test.js
git commit -m "feat: add instagram-card-writer.js — HTML to PNG card generator"
```

---

### Task 3: instagram-poster.js

**Files:**
- Create: `scripts/lib/instagram-poster.js`

Unit test yoktur — Playwright + gerçek Instagram oturumu gerektirir. Task 5'te login sonrası manuel test edilir.

- [ ] **Step 1: Create instagram-poster.js**

```js
// scripts/lib/instagram-poster.js
import { chromium } from 'playwright';
import { homedir } from 'node:os';
import { join } from 'node:path';

const CHROME_PROFILE = join(homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'InstagramBot');
const INSTAGRAM_URL = 'https://www.instagram.com';
const POST_DELAY_MS = 60_000;

async function postSingle(page, imagePath, caption) {
  console.log('[instagram-poster] navigating to home...');
  await page.goto(INSTAGRAM_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3_000);

  // Click the Create / New Post button
  const createBtn = page.locator('[aria-label="New post"], [aria-label="Yeni gönderi"], [aria-label="Create"]').first();
  await createBtn.waitFor({ timeout: 20_000 });
  await createBtn.click();
  await page.waitForTimeout(2_000);

  // Set image file on the hidden file input
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.waitFor({ timeout: 15_000 });
  await fileInput.setInputFiles(imagePath);
  await page.waitForTimeout(3_000);

  // Next → (crop screen)
  const next1 = page.locator('button:has-text("Next"), button:has-text("İleri")').first();
  await next1.waitFor({ timeout: 15_000 });
  await next1.click();
  await page.waitForTimeout(2_000);

  // Next → (filter screen)
  const next2 = page.locator('button:has-text("Next"), button:has-text("İleri")').first();
  await next2.waitFor({ timeout: 15_000 });
  await next2.click();
  await page.waitForTimeout(2_000);

  // Type caption (contenteditable div on share screen)
  const captionArea = page.locator(
    'div[aria-label*="caption"], div[aria-label*="açıklama"], div[role="textbox"]'
  ).first();
  await captionArea.waitFor({ timeout: 15_000 });
  await captionArea.click();
  await page.waitForTimeout(500);
  await captionArea.pressSequentially(caption, { delay: 15 });
  await page.waitForTimeout(1_000);

  // Share
  const shareBtn = page.locator('button:has-text("Share"), button:has-text("Paylaş")').first();
  await shareBtn.waitFor({ timeout: 15_000 });
  await shareBtn.click({ force: true });
  await page.waitForTimeout(5_000);
}

export async function postInstagram(posts) {
  if (!posts || posts.length === 0) {
    console.warn('[instagram-poster] no posts to share');
    return;
  }

  let context;
  try {
    context = await chromium.launchPersistentContext(CHROME_PROFILE, {
      channel: 'chrome',
      headless: false,
      ignoreDefaultArgs: ['--enable-automation'],
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-first-run',
        '--no-default-browser-check',
      ],
    });
  } catch (err) {
    console.error(`[instagram-poster] Chrome profili açılamadı: ${CHROME_PROFILE}`);
    console.error('[instagram-poster] Önce login-instagram.js ile giriş yapın');
    throw err;
  }

  const page = await context.newPage();

  try {
    for (let i = 0; i < posts.length; i++) {
      const { imagePath, caption } = posts[i];
      console.log(`[instagram-poster] posting ${i + 1}/${posts.length}...`);
      await postSingle(page, imagePath, caption);
      console.log(`[instagram-poster] ✓ post ${i + 1} shared`);

      if (i < posts.length - 1) {
        console.log(`[instagram-poster] waiting ${POST_DELAY_MS / 1000}s before next post...`);
        await page.waitForTimeout(POST_DELAY_MS);
      }
    }
  } finally {
    await context?.close();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/lib/instagram-poster.js
git commit -m "feat: add instagram-poster.js — Playwright Instagram web poster"
```

---

### Task 4: startup-instagram.js

**Files:**
- Create: `scripts/startup-instagram.js`

- [ ] **Step 1: Create startup-instagram.js**

```js
// scripts/startup-instagram.js
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { writeCaptions } from './lib/instagram-caption-writer.js';
import { generateCard, deleteCard } from './lib/instagram-card-writer.js';
import { postInstagram } from './lib/instagram-poster.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const LOG_PATH = join(__dir, '..', '.instagram-log.json');
const DAILY_URL = 'https://avfethiguzel.com/data/daily.json';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function alreadyPostedToday() {
  if (!existsSync(LOG_PATH)) return false;
  try {
    const log = JSON.parse(await readFile(LOG_PATH, 'utf-8'));
    return log.lastPostedDate === todayISO();
  } catch {
    return false;
  }
}

async function markPostedToday() {
  await writeFile(LOG_PATH, JSON.stringify({
    lastPostedDate: todayISO(),
    postedAt: new Date().toISOString()
  }, null, 2), 'utf-8');
}

async function fetchHighlights() {
  const res = await fetch(DAILY_URL);
  if (!res.ok) throw new Error(`daily.json fetch failed: ${res.status}`);
  const daily = await res.json();
  return (daily.highlights || []).slice(0, 4);
}

async function main() {
  console.log(`[startup-instagram] ${new Date().toISOString()} — starting`);

  if (await alreadyPostedToday()) {
    console.log('[startup-instagram] already posted today, exiting');
    return;
  }

  const highlights = await fetchHighlights();
  if (highlights.length === 0) {
    console.log('[startup-instagram] no highlights today, exiting');
    return;
  }
  console.log(`[startup-instagram] ${highlights.length} highlights fetched`);

  const captions = await writeCaptions(highlights);
  console.log(`[startup-instagram] ${captions.length} captions generated`);

  const cardPaths = [];
  for (const h of highlights) {
    console.log(`[startup-instagram] generating card for ${h.id}...`);
    const path = await generateCard(h);
    cardPaths.push(path);
  }
  console.log(`[startup-instagram] ${cardPaths.length} cards generated`);

  const posts = cardPaths.map((imagePath, i) => ({ imagePath, caption: captions[i] }));
  await postInstagram(posts);

  for (const p of cardPaths) await deleteCard(p);

  await markPostedToday();
  console.log('[startup-instagram] done');
}

main().catch(err => {
  console.error('[startup-instagram] fatal:', err.message);
  process.exit(1);
});
```

- [ ] **Step 2: Commit**

```bash
git add scripts/startup-instagram.js
git commit -m "feat: add startup-instagram.js orchestrator"
```

---

### Task 5: login-instagram.js + InstagramBot profil oluşturma

**Files:**
- Create: `login-instagram.js`

- [ ] **Step 1: Create login-instagram.js**

```js
// login-instagram.js
import { chromium } from 'playwright';
import { homedir } from 'os';
import { join } from 'path';

const p = join(homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'InstagramBot');

const ctx = await chromium.launchPersistentContext(p, {
  channel: 'chrome',
  headless: false,
  ignoreDefaultArgs: ['--enable-automation'],
  args: [
    '--disable-blink-features=AutomationControlled',
    '--no-first-run',
    '--no-default-browser-check',
  ],
});

const page = await ctx.newPage();
await page.goto('https://www.instagram.com/accounts/login/');

console.log('Instagram açıldı. Giriş yap. Bittikten sonra bu terminale Ctrl+C bas.');
await new Promise(r => setTimeout(r, 600_000));
await ctx.close();
```

- [ ] **Step 2: InstagramBot profil dizinini oluştur**

PowerShell:
```powershell
New-Item -ItemType Directory -Force -Path "$env:LOCALAPPDATA\Google\Chrome\User Data\InstagramBot"
```

- [ ] **Step 3: Instagram'a giriş yap**

Run: `node login-instagram.js`

Chrome açılır, Instagram login sayfası gelir. Kullanıcı adı ve şifreyi gir. "Beni hatırla" seçeneğini kabul et. Giriş tamamlandıktan sonra terminalde Ctrl+C bas.

- [ ] **Step 4: Commit**

```bash
git add login-instagram.js
git commit -m "feat: add login-instagram.js one-time login helper"
```

---

### Task 6: Windows Startup kaydı

**Files:**
- Create: `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\fethiguzel-instagram.cmd`

- [ ] **Step 1: Startup CMD dosyasını oluştur**

PowerShell:
```powershell
$startupDir = [System.Environment]::GetFolderPath('Startup')
$cmdPath = Join-Path $startupDir 'fethiguzel-instagram.cmd'
$content = "@echo off`r`ntimeout /t 90 /nobreak >nul`r`nnode `"C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal\scripts\startup-instagram.js`"`r`n"
Set-Content -Path $cmdPath -Value $content -Encoding ASCII
Write-Host "Startup dosyası oluşturuldu: $cmdPath"
```

90 saniyelik gecikme Twitter agent'ın önce başlamasını sağlar (Chrome profilleri ayrı ama sistem yüküne karşı önlem).

- [ ] **Step 2: Startup dosyasını doğrula**

PowerShell:
```powershell
$startupDir = [System.Environment]::GetFolderPath('Startup')
Get-Content (Join-Path $startupDir 'fethiguzel-instagram.cmd')
```

Expected çıktı:
```
@echo off
timeout /t 90 /nobreak >nul
node "C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal\scripts\startup-instagram.js"
```

- [ ] **Step 3: Manuel test — startup-instagram.js'i elle çalıştır**

PowerShell:
```powershell
$env:ANTHROPIC_API_KEY = "sk-..."  # gerçek key
node "C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal\scripts\startup-instagram.js"
```

Expected:
```
[startup-instagram] 2026-05-26T... — starting
[startup-instagram] 4 highlights fetched
[startup-instagram] 4 captions generated
[startup-instagram] generating card for aym-...
...
[startup-instagram] done
```

Instagram'da gönderileri kontrol et.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore: add Instagram startup agent to Windows Startup folder"
```

---

## Self-Review

**Spec coverage:**

| Spec gereksinimi | Task |
|---|---|
| `instagram-caption-writer.js` — Claude Sonnet caption + hashtag | Task 1 ✓ |
| `instagram-card-writer.js` — HTML → PNG kart üretici | Task 2 ✓ |
| `instagram-poster.js` — Playwright Instagram poster | Task 3 ✓ |
| `startup-instagram.js` — orchestrator + log kontrolü | Task 4 ✓ |
| `login-instagram.js` — tek seferlik login | Task 5 ✓ |
| Windows Startup CMD | Task 6 ✓ |
| 1080×1080px görsel format | Task 2 `buildCardHtml` ✓ |
| Koyu tasarım (#0f0f1a arka plan) | Task 2 ✓ |
| `#c9a84c` badge accent rengi | Task 2 ✓ |
| Postlar arası 60s bekleme | Task 3 `POST_DELAY_MS` ✓ |
| 90s gecikme (Twitter'dan sonra) | Task 6 `timeout /t 90` ✓ |
| Temp PNG temizliği | Task 4 `deleteCard` ✓ |
| `.instagram-log.json` tekrar paylaşım koruması | Task 4 ✓ |

**Placeholder taraması:** Yok. ✓

**Tip tutarlılığı:**
- `generateCard(highlight)` → `string` (path) — Task 2'de tanımlandı, Task 4'te kullanıldı ✓
- `writeCaptions(highlights)` → `string[]` — Task 1'de tanımlandı, Task 4'te kullanıldı ✓
- `postInstagram(posts: Array<{imagePath, caption}>)` — Task 3'te tanımlandı, Task 4'te kullanıldı ✓
- `deleteCard(path)` — Task 2'de tanımlandı, Task 4'te kullanıldı ✓
