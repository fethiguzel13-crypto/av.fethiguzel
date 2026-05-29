# Twitter Startup Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bilgisayar açılışında Claude Haiku ile insansı tweet metinleri üretip mevcut Chrome profiliyle Twitter'a otomatik olarak gönderen lokal Windows ajanı.

**Architecture:** Windows Task Scheduler tetikler → `scripts/startup-tweet.js` orkestratör olarak çalışır → `avfethiguzel.com/data/daily.json` canlı verisini çeker → Claude Haiku tweet yazar → Playwright Chrome profilini açar ve tweetleri gönderir → `.tweet-log.json` ile tekrar atma koruması sağlar.

**Tech Stack:** Node.js ESM, Playwright (chromium), @anthropic-ai/sdk, Windows Task Scheduler, PowerShell

---

## Dosya Haritası

| Dosya | İşlem | Açıklama |
|---|---|---|
| `package.json` | Modify | `playwright` bağımlılığı ekle |
| `.gitignore` | Modify | `.tweet-log.json` ve `logs/` ekle |
| `scripts/lib/tweet-writer.js` | Create | Claude Haiku ile tweet metni üretimi |
| `scripts/lib/playwright-poster.js` | Create | Chrome profili ile Twitter'a gönderme |
| `scripts/startup-tweet.js` | Create | Ana orkestratör |
| `setup-startup.ps1` | Create | Task Scheduler kurulum scripti |

---

## Task 1: Playwright'ı Root'a Ekle + .gitignore Güncelle

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Playwright'ı root bağımlılıklarına ekle**

```bash
cd C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal
npm install playwright
npx playwright install chromium
```

Beklenen: `node_modules/playwright/` oluşur, `package.json` güncellenir.

- [ ] **Step 2: .gitignore'a log ve tweet-log ekle**

`.gitignore` dosyasının sonuna ekle:

```
# Twitter startup agent
.tweet-log.json
logs/
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: add playwright to root deps for startup tweet agent"
```

---

## Task 2: tweet-writer.js — Claude Haiku Tweet Üretimi

**Files:**
- Create: `scripts/lib/tweet-writer.js`
- Create: `scripts/lib/__tests__/tweet-writer.test.js`

- [ ] **Step 1: Failing testi yaz**

`scripts/lib/__tests__/tweet-writer.test.js`:

```js
import { strict as assert } from 'node:assert';
import { test, mock } from 'node:test';

// Mock Anthropic SDK
mock.module('@anthropic-ai/sdk', {
  namedExports: {},
  defaultExport: class MockAnthropic {
    get messages() {
      return {
        create: async () => ({
          content: [{ text: 'Bir vatandaş yıllarca bekledi ve sonunda hakkını aldı.' }]
        })
      };
    }
  }
});

const { writeTweets } = await import('../tweet-writer.js');

test('writeTweets returns one tweet per highlight', async () => {
  const highlights = [
    { source: 'AYM', publicSummary: 'Test özeti', id: 'aym-1' }
  ];
  const tweets = await writeTweets(highlights, 'avfethiguzel.com');
  assert.equal(tweets.length, 1);
  assert.ok(tweets[0].includes('avfethiguzel.com/icthat'));
  assert.ok(tweets[0].length <= 280);
});

test('writeTweets handles missing publicSummary', async () => {
  const highlights = [
    { source: 'Yargıtay', konu: 'Konu metni', id: 'yargitay-1' }
  ];
  const tweets = await writeTweets(highlights, 'avfethiguzel.com');
  assert.equal(tweets.length, 1);
  assert.ok(tweets[0].length <= 280);
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu doğrula**

```bash
node --test "scripts/lib/__tests__/tweet-writer.test.js"
```

Beklenen: `ERR_MODULE_NOT_FOUND` veya `SyntaxError` — dosya henüz yok.

- [ ] **Step 3: tweet-writer.js'i oluştur**

`scripts/lib/tweet-writer.js`:

```js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM = `Sen Av. Fethi Güzel adına Twitter'da hukuki içtihatları paylaşan bir asistansın.
Görevin: Verilen içtihat özetini doğal, insansı ve yaratıcı bir tweet'e dönüştürmek.

Kurallar:
- Maksimum 200 karakter yaz (link ve hashtag ayrıca eklenecek)
- Türkçe, sohbet tonu — resmi veya bot dili yok
- Siyasi olarak tamamen nötr: taraf tutma, eleştiri yapma, yorum ekleme
- Her tweet farklı bir giriş kullansın: bazen soru, bazen anlatı, bazen çarpıcı bir cümle
- "Mahkeme karar verdi" veya "Anayasa Mahkemesi'ne göre" gibi klişe başlangıçlardan kaçın
- Sadece tweet metnini döndür, tırnak işareti veya açıklama ekleme`;

const HASHTAGS = {
  AYM: '#hukuk #AYM',
  Yargıtay: '#hukuk #Yargıtay',
  YİBK: '#hukuk #YİBK',
  AİHM: '#hukuk #AİHM',
  RG: '#hukuk #mevzuat',
};

function hashtagsFor(source, category) {
  if (source === 'Yargıtay' && category === 'YİBK') return HASHTAGS.YİBK;
  return HASHTAGS[source] || '#hukuk #içtihat';
}

function summaryFor(h) {
  return (h.publicSummary || h.konu || h.title || '').trim().slice(0, 500);
}

export async function writeTweets(highlights, siteDomain = 'avfethiguzel.com') {
  const tweets = [];
  for (const h of highlights) {
    const summary = summaryFor(h);
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: SYSTEM,
      messages: [{
        role: 'user',
        content: `Mahkeme: ${h.source}\nÖzet: ${summary}\n\nSadece tweet metnini yaz.`
      }]
    });
    const body = msg.content[0].text.trim();
    const hashtags = hashtagsFor(h.source, h.category);
    const link = `${siteDomain}/icthat`;
    const full = `${body}\n\n${link} ${hashtags}`;
    tweets.push(full.slice(0, 280));
  }
  return tweets;
}
```

- [ ] **Step 4: Testleri çalıştır, geçtiğini doğrula**

```bash
node --test "scripts/lib/__tests__/tweet-writer.test.js"
```

Beklenen: `✓ writeTweets returns one tweet per highlight`, `✓ writeTweets handles missing publicSummary`

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/tweet-writer.js scripts/lib/__tests__/tweet-writer.test.js
git commit -m "feat: add tweet-writer — Claude Haiku generates human-like legal tweets"
```

---

## Task 3: playwright-poster.js — Chrome Profili ile Tweet Gönderme

**Files:**
- Create: `scripts/lib/playwright-poster.js`

> Not: Bu modül gerçek Chrome ve Twitter oturumu gerektirdiğinden birim testi yoktur. Task 5'te manuel olarak test edilir.

- [ ] **Step 1: playwright-poster.js'i oluştur**

`scripts/lib/playwright-poster.js`:

```js
import { chromium } from 'playwright';
import { homedir } from 'node:os';
import { join } from 'node:path';

const CHROME_PROFILE = join(homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'TwitterBot');
const TWEET_DELAY_MS = 30_000;
const COMPOSE_URL = 'https://x.com/compose/tweet';

export async function postTweets(tweets) {
  const context = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome',
    headless: false,
    args: ['--no-first-run', '--no-default-browser-check'],
  });

  const page = await context.newPage();

  for (let i = 0; i < tweets.length; i++) {
    const text = tweets[i];
    console.log(`[playwright-poster] posting tweet ${i + 1}/${tweets.length}`);

    await page.goto(COMPOSE_URL, { waitUntil: 'domcontentloaded' });

    const textarea = page.locator('[data-testid="tweetTextarea_0"]');
    await textarea.waitFor({ timeout: 20_000 });
    await textarea.fill(text);
    await page.waitForTimeout(1_500);

    const postBtn = page.locator('[data-testid="tweetButtonInline"]');
    await postBtn.waitFor({ timeout: 10_000 });
    await postBtn.click();
    await page.waitForTimeout(3_000);

    console.log(`[playwright-poster] ✓ tweet ${i + 1} posted`);

    if (i < tweets.length - 1) {
      console.log(`[playwright-poster] waiting ${TWEET_DELAY_MS / 1000}s before next tweet...`);
      await page.waitForTimeout(TWEET_DELAY_MS);
    }
  }

  await context.close();
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/lib/playwright-poster.js
git commit -m "feat: add playwright-poster — posts tweets via Chrome user profile"
```

---

## Task 4: startup-tweet.js — Ana Orkestratör

**Files:**
- Create: `scripts/startup-tweet.js`

- [ ] **Step 1: startup-tweet.js'i oluştur**

`scripts/startup-tweet.js`:

```js
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { writeTweets } from './lib/tweet-writer.js';
import { postTweets } from './lib/playwright-poster.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const LOG_PATH = join(__dir, '..', '.tweet-log.json');
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
  }, null, 2));
}

async function fetchHighlights() {
  const res = await fetch(DAILY_URL);
  if (!res.ok) throw new Error(`daily.json fetch failed: ${res.status}`);
  const daily = await res.json();
  return (daily.highlights || []).slice(0, 4);
}

async function main() {
  console.log(`[startup-tweet] ${new Date().toISOString()} — starting`);

  if (await alreadyPostedToday()) {
    console.log('[startup-tweet] already posted today, exiting');
    return;
  }

  const highlights = await fetchHighlights();
  if (highlights.length === 0) {
    console.log('[startup-tweet] no highlights today, exiting');
    return;
  }
  console.log(`[startup-tweet] ${highlights.length} highlights fetched`);

  const tweets = await writeTweets(highlights);
  console.log(`[startup-tweet] ${tweets.length} tweets generated`);

  await postTweets(tweets);

  await markPostedToday();
  console.log('[startup-tweet] done');
}

main().catch(err => {
  console.error('[startup-tweet] fatal:', err.message);
  process.exit(1);
});
```

- [ ] **Step 2: Manuel ön test — önce kuru çalıştırma**

`ANTHROPIC_API_KEY` ortam değişkenini ayarla (henüz ayarlanmadıysa):

```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-..."
```

Sonra sadece tweet üretimini test et (poster'ı atlayarak):

```powershell
cd C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal
node -e "
import('./scripts/lib/tweet-writer.js').then(async ({writeTweets}) => {
  const r = await fetch('https://avfethiguzel.com/data/daily.json');
  const d = await r.json();
  const tweets = await writeTweets(d.highlights.slice(0,2));
  tweets.forEach((t,i) => console.log('--- Tweet', i+1, '---\n' + t + '\n'));
});
"
```

Beklenen: 2 adet Türkçe, insansı tweet metni konsola yazdırılır.

- [ ] **Step 3: Commit**

```bash
git add scripts/startup-tweet.js
git commit -m "feat: add startup-tweet orchestrator — fetches daily.json, writes and posts tweets"
```

---

## Task 5: Dedike Chrome Profili Kur + Manuel Playwright Testi

Bu task elle yapılır, kod değişikliği yoktur.

- [ ] **Step 1: TwitterBot Chrome profili için klasör oluştur**

```powershell
New-Item -ItemType Directory -Force -Path "$env:LOCALAPPDATA\Google\Chrome\User Data\TwitterBot"
```

- [ ] **Step 2: Playwright ile profili aç ve Twitter'a giriş yap**

```powershell
cd C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal
node -e "
import {chromium} from 'playwright';
import {homedir} from 'os';
import {join} from 'path';
const profile = join(homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'TwitterBot');
(async () => {
  const ctx = await chromium.launchPersistentContext(profile, {channel:'chrome', headless:false});
  const page = await ctx.newPage();
  await page.goto('https://x.com/login');
  console.log('Login yapıp işin bitince Enter a bas...');
  await new Promise(r => process.stdin.once('data', r));
  await ctx.close();
})();
"
```

Chrome açılır → Twitter'a manuel giriş yap → Enter'a bas → profil kaydedilir.

- [ ] **Step 3: Tek tweet ile uçtan uca test**

```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-..."
node -e "
import('./scripts/lib/playwright-poster.js').then(async ({postTweets}) => {
  await postTweets(['Test tweet — otomatik sistem testi. avfethiguzel.com/icthat #hukuk']);
  console.log('done');
});
"
```

Beklenen: Chrome açılır, `x.com/compose/tweet`'e gider, tweet yazar, gönderir, kapanır.

---

## Task 6: setup-startup.ps1 — Task Scheduler Kurulumu

**Files:**
- Create: `setup-startup.ps1`

- [ ] **Step 1: setup-startup.ps1'i oluştur**

`setup-startup.ps1` (proje kökünde):

```powershell
param(
  [string]$ApiKey = $env:ANTHROPIC_API_KEY
)

if (-not $ApiKey) {
  Write-Error "ANTHROPIC_API_KEY parametresi gerekli: .\setup-startup.ps1 -ApiKey sk-ant-..."
  exit 1
}

$projectDir = $PSScriptRoot
$nodePath   = (Get-Command node -ErrorAction Stop).Source
$scriptPath = Join-Path $projectDir "scripts\startup-tweet.js"
$logDir     = Join-Path $projectDir "logs"
$logPath    = Join-Path $logDir "startup-tweet.log"

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

# ANTHROPIC_API_KEY'i kullanıcı ortam değişkeni olarak kaydet
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", $ApiKey, "User")
Write-Output "✓ ANTHROPIC_API_KEY kullanıcı ortam değişkeni olarak kaydedildi"

$psArgs = "-NonInteractive -WindowStyle Hidden -Command `"node '$scriptPath' >> '$logPath' 2>&1`""

$action   = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $psArgs -WorkingDirectory $projectDir
$trigger  = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Minutes 15) -StartWhenAvailable

Register-ScheduledTask `
  -TaskName "FethiGuzel-TwitterBot" `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Force | Out-Null

Write-Output "✓ Task Scheduler görevi oluşturuldu: FethiGuzel-TwitterBot"
Write-Output "  Tetikleyici: kullanıcı oturumu açıldığında"
Write-Output "  Log: $logPath"
Write-Output ""
Write-Output "Kurulum tamamlandı. Bir sonraki açılışta otomatik çalışacak."
Write-Output "Manuel test: Start-ScheduledTask -TaskName 'FethiGuzel-TwitterBot'"
```

- [ ] **Step 2: Setup scriptini çalıştır**

```powershell
.\setup-startup.ps1 -ApiKey "sk-ant-..."
```

Beklenen:
```
✓ ANTHROPIC_API_KEY kullanıcı ortam değişkeni olarak kaydedildi
✓ Task Scheduler görevi oluşturuldu: FethiGuzel-TwitterBot
```

- [ ] **Step 3: Görevi manuel tetikle ve log'u kontrol et**

```powershell
Start-ScheduledTask -TaskName "FethiGuzel-TwitterBot"
Start-Sleep -Seconds 30
Get-Content (Join-Path $PSScriptRoot "logs\startup-tweet.log") -Tail 20
```

Beklenen: `[startup-tweet] done` satırı görünür.

- [ ] **Step 4: Commit**

```bash
git add setup-startup.ps1
git commit -m "feat: add setup-startup.ps1 — registers Windows Task Scheduler login trigger"
```

---

## Task 7: Eski tweet-poster.yml'ı Devre Dışı Bırak

**Files:**
- Modify: `.github/workflows/tweet-poster.yml`
- Modify: `.github/workflows/daily-icthat.yml`

- [ ] **Step 1: tweet-poster.yml cron'unu kaldır**

`.github/workflows/tweet-poster.yml` dosyasında `on.schedule` bloğunu kaldır, sadece `workflow_dispatch` bırak:

```yaml
on:
  workflow_dispatch:
```

Bu sayede workflow silinmez ama artık otomatik tetiklenmez.

- [ ] **Step 2: daily-icthat.yml'dan generate-tweets adımını kaldır**

`.github/workflows/daily-icthat.yml` içinden şu adımı sil:

```yaml
      - name: Generate tweets
        env:
          SITE_DOMAIN: ${{ secrets.SITE_DOMAIN }}
        run: node scripts/generate-tweets.js public/data/daily.json public/data/twitter-queue.json
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/tweet-poster.yml .github/workflows/daily-icthat.yml
git commit -m "chore: disable tweet-poster workflow — replaced by local startup agent"
```

---

## Kurulum Özeti (Manuel Adımlar)

1. `npm install` → `npx playwright install chromium`
2. `.\setup-startup.ps1 -ApiKey sk-ant-...`
3. TwitterBot Chrome profilini kur ve Twitter'a login ol (Task 5)
4. `Start-ScheduledTask -TaskName "FethiGuzel-TwitterBot"` ile test et
5. GitHub'da `TWITTER_API_KEY` ve ilgili secrets'ları silebilirsin (artık gerekmiyor)
