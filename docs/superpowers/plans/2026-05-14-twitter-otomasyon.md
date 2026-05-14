# Twitter/X Otomasyon — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mevcut günlük içtihat verisinden 4 tweet üretip, gün boyu zamanlanmış olarak (09/13/17/20 TR) otomatik Twitter/X paylaşımı.

**Architecture:** Sabah workflow generate-tweets.js'i çağırır → `public/data/twitter-queue.json` üretir. Ayrı bir 30dk cron poster workflow'u queue'yu okur, vakti gelmiş tweet'leri Twitter API ile post eder.

**Tech Stack:** Node.js 20 (ESM), `oauth-1.0a` + `crypto` (Twitter OAuth 1.0a user context), GitHub Actions, mevcut `@anthropic-ai/sdk` (gerekirse tweet metnini özetlemek için).

**Spec:** [../specs/2026-05-14-twitter-otomasyon-design.md](../specs/2026-05-14-twitter-otomasyon-design.md)

**Working Directory:** `C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal`

---

## Dosya Yapısı

| Dosya | Tür | Sorumluluk |
|---|---|---|
| `scripts/lib/tweet-format.js` | Yeni | Tweet metni üretim mantığı (prefix + body + link + hashtag + 280 sınırı) |
| `scripts/lib/__tests__/tweet-format.test.js` | Yeni | Format unit testleri |
| `scripts/generate-tweets.js` | Yeni | daily.json → twitter-queue.json (CLI) |
| `scripts/lib/twitter-client.js` | Yeni | OAuth 1.0a imzalı POST /2/tweets wrapper |
| `scripts/lib/__tests__/twitter-client.test.js` | Yeni | OAuth imza testleri (network'süz) |
| `scripts/post-due-tweets.js` | Yeni | queue okur, vakti gelmişleri post eder (CLI) |
| `public/data/twitter-queue.json` | Otomatik | Bot tarafından her sabah üretilir, her postlamada güncellenir |
| `.github/workflows/daily-icthat.yml` | Modify | generate-tweets adımı eklenir |
| `.github/workflows/tweet-poster.yml` | Yeni | 30dk cron + post-due-tweets çağrısı |
| `package.json` | Modify | `oauth-1.0a` dependency eklenir |

Tüm yeni Node.js dosyaları ESM (`import`/`export`), root `package.json`'da `"type": "module"` zaten var.

---

## Faz 1: Tweet Format Üretimi

### Task 1: package.json'a oauth-1.0a ekle

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Mevcut package.json'ı oku ve oauth-1.0a ekle**

`package.json`'da `dependencies` bloğuna ekle:

```json
"oauth-1.0a": "^2.2.6"
```

Alfabetik konum: `@anthropic-ai/sdk`'dan sonra (`@`'lar önce, sonra `a-z`).

- [ ] **Step 2: npm install**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
npm install
```

Expected: `oauth-1.0a` indirilir, `package-lock.json` güncellenir.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add oauth-1.0a for Twitter API"
```

---

### Task 2: Tweet format fixture + ilk testler

**Files:**
- Create: `scripts/fixtures/daily-sample.json`
- Create: `scripts/lib/__tests__/tweet-format.test.js` (sadece import + 1 test)

- [ ] **Step 1: Fixture daily.json oluştur**

`scripts/fixtures/daily-sample.json`:

```json
{
  "generatedAt": "2026-05-15T06:00:00Z",
  "dateLabel": "15 Mayıs 2026",
  "highlights": [
    {
      "id": "aym-2022-41459",
      "source": "AYM",
      "sourceLabel": "Anayasa Mahkemesi",
      "icon": "landmark",
      "category": "Bireysel Başvuru",
      "kunye": "AYM, B. No: 2022/41459, K.T. 11/03/2026, Birinci Bölüm",
      "konu": "Disiplin cezasına ilişkin başvuru",
      "publicSummary": "Cezaevindeki disiplin cezasına itirazda adil savunma hakkı engellendi.",
      "date": "2026-03-11",
      "url": "https://kararlarbilgibankasi.anayasa.gov.tr/"
    },
    {
      "id": "y-yibk-123",
      "source": "Yargıtay",
      "sourceLabel": "Yargıtay",
      "icon": "scale",
      "category": "YİBK",
      "kunye": "YİBK 2026/1, T. 10/03/2026",
      "konu": "İçtihadı birleştirme kararı",
      "publicSummary": "Kefalet sözleşmelerinde yazılı şekil zorunluluğunun kapsamı netleştirildi.",
      "date": "2026-03-10",
      "url": "https://karararama.yargitay.gov.tr/"
    },
    {
      "id": "hudoc-001-1",
      "source": "AİHM",
      "sourceLabel": "AİHM",
      "icon": "flag",
      "category": "Türkiye Kararı",
      "caseName": "AFFAIRE YASAK c. TÜRKİYE",
      "appNo": "17389/20",
      "importance": "1",
      "konu": "Violation de l'article 7",
      "publicSummary": "Türkiye'nin geriye dönük yasa uygulaması ifade özgürlüğünü ihlal etti.",
      "date": "2026-05-05",
      "url": "https://hudoc.echr.coe.int/eng?i=001-250158"
    },
    {
      "id": "rg-20260513-2",
      "source": "RG",
      "sourceLabel": "Resmî Gazete",
      "icon": "scroll-text",
      "category": "Yönetmelik",
      "title": "Konkordato Talebi Yönetmeliğinde Değişiklik",
      "konu": "İflas erteleme süreci için yeni belge zorunlulukları",
      "publicSummary": "Konkordato başvurusunda istenen belgeler güncellendi.",
      "date": "2026-05-13",
      "url": "https://www.resmigazete.gov.tr/eskiler/2026/05/20260513-2.htm"
    }
  ],
  "items": { "resmigazete": [], "yargitay": [], "aym": [], "hudoc": [], "mevzuat": [] },
  "stats": { "totalItems": 4, "perSource": {} },
  "errors": []
}
```

- [ ] **Step 2: Test dosyasını oluştur (sadece import + 1 test)**

`scripts/lib/__tests__/tweet-format.test.js`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildTweet } from '../tweet-format.js';

const fixture = JSON.parse(
  await readFile(new URL('../../fixtures/daily-sample.json', import.meta.url), 'utf-8')
);

test('buildTweet AYM: prefix, summary, link, hashtag', () => {
  const aym = fixture.highlights[0];
  const text = buildTweet(aym, 'avfethiguzel.com');
  assert.ok(text.startsWith('AYM:'), `prefix should be AYM: but got: ${text.slice(0, 30)}`);
  assert.ok(text.includes('adil savunma'), 'should include publicSummary');
  assert.ok(text.includes('avfethiguzel.com/icthat'), 'should include site link');
  assert.ok(text.includes('#hukuk'), 'should include #hukuk hashtag');
  assert.ok(text.includes('#AYM'), 'should include #AYM hashtag');
  assert.ok(text.length <= 280, `must be <= 280 chars, got ${text.length}`);
});
```

- [ ] **Step 3: Testi çalıştır, FAIL'i gör**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
npm run test:scripts 2>&1 | tail -15
```

Expected: FAIL — `Cannot find module '../tweet-format.js'`.

- [ ] **Step 4: Commit (failing test)**

```bash
git add scripts/fixtures/daily-sample.json scripts/lib/__tests__/tweet-format.test.js
git commit -m "test: tweet-format fixture + failing AYM test"
```

---

### Task 3: tweet-format.js — buildTweet (AYM ile başla)

**Files:**
- Create: `scripts/lib/tweet-format.js`

- [ ] **Step 1: tweet-format.js'i yaz (sadece AYM case geçecek kadar)**

```javascript
const PREFIXES = {
  AYM: 'AYM',
  Yargıtay: 'Yargıtay',
  AİHM: 'AİHM',
  RG: 'Resmî Gazete',
  Mevzuat: 'Mevzuat'
};

const HASHTAGS = {
  AYM: ['#hukuk', '#içtihat', '#AYM'],
  Yargıtay: ['#hukuk', '#içtihat', '#yargıtay'],
  YİBK: ['#hukuk', '#YİBK', '#içtihat'],
  AİHM: ['#hukuk', '#içtihat', '#AİHM'],
  RG: ['#hukuk', '#mevzuat', '#resmigazete'],
  Mevzuat: ['#hukuk', '#mevzuat']
};

function prefixFor(item) {
  if (item.source === 'Yargıtay' && item.category === 'YİBK') return 'YİBK';
  return PREFIXES[item.source] || item.source;
}

function hashtagsFor(item) {
  if (item.source === 'Yargıtay' && item.category === 'YİBK') return HASHTAGS.YİBK;
  return HASHTAGS[item.source] || HASHTAGS.Mevzuat;
}

function bodyFor(item) {
  if (item.publicSummary && item.publicSummary.trim()) return item.publicSummary.trim();
  if (item.konu && item.konu.trim()) return item.konu.trim().slice(0, 150);
  return item.title || item.kunye || item.caseName || '';
}

function truncateToTweet(text, max) {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice) + '…';
}

export function buildTweet(item, siteDomain) {
  const prefix = prefixFor(item);
  const link = `${siteDomain}/icthat`;
  const tags = hashtagsFor(item).join(' ');
  const linkAndTags = `\n\nKünye ve detay: ${link}\n\n${tags}`;
  const bodyMax = 280 - (prefix.length + 2) - linkAndTags.length;  // "prefix: " = +2
  const body = truncateToTweet(bodyFor(item), bodyMax);
  return `${prefix}: ${body}${linkAndTags}`;
}
```

- [ ] **Step 2: Testi çalıştır, PASS'i gör**

```bash
npm run test:scripts 2>&1 | grep -E "(pass|fail|tests)" | tail -5
```

Expected: 1 yeni test PASS (eski 14 + 1 = 15 toplam).

- [ ] **Step 3: Commit**

```bash
git add scripts/lib/tweet-format.js
git commit -m "feat(tweet-format): buildTweet for AYM source"
```

---

### Task 4: tweet-format — diğer kaynaklar (YİBK, AİHM, RG)

**Files:**
- Modify: `scripts/lib/__tests__/tweet-format.test.js`

- [ ] **Step 1: Testlere ekle**

`scripts/lib/__tests__/tweet-format.test.js` sonuna ekle:

```javascript
test('buildTweet YİBK: prefix is YİBK (not Yargıtay), uses YİBK hashtag set', () => {
  const yibk = fixture.highlights[1];
  const text = buildTweet(yibk, 'avfethiguzel.com');
  assert.ok(text.startsWith('YİBK:'), `prefix should be YİBK: but got: ${text.slice(0, 30)}`);
  assert.ok(text.includes('#YİBK'), 'should include #YİBK');
  assert.ok(!text.includes('#yargıtay'), 'YİBK should NOT include #yargıtay');
});

test('buildTweet AİHM: uses caseName fallback when title/kunye missing', () => {
  const aihm = fixture.highlights[2];
  const text = buildTweet(aihm, 'avfethiguzel.com');
  assert.ok(text.startsWith('AİHM:'), `prefix should be AİHM:`);
  assert.ok(text.includes('ifade özgürlüğünü'), 'should include publicSummary');
  assert.ok(text.includes('#AİHM'), 'should include #AİHM');
});

test('buildTweet RG: Resmî Gazete prefix and hashtags', () => {
  const rg = fixture.highlights[3];
  const text = buildTweet(rg, 'avfethiguzel.com');
  assert.ok(text.startsWith('Resmî Gazete:'), `prefix should be Resmî Gazete:`);
  assert.ok(text.includes('#mevzuat'), 'should include #mevzuat');
  assert.ok(text.includes('#resmigazete'), 'should include #resmigazete');
});

test('buildTweet truncates body > 280 chars', () => {
  const longItem = {
    id: 'long-1',
    source: 'AYM',
    publicSummary: 'A'.repeat(500),
    konu: '',
    kunye: ''
  };
  const text = buildTweet(longItem, 'avfethiguzel.com');
  assert.ok(text.length <= 280, `should fit in 280 chars, got ${text.length}`);
  assert.ok(text.includes('…'), 'should end body with ellipsis');
});
```

- [ ] **Step 2: Testi çalıştır, hepsinin PASS olduğunu gör**

```bash
npm run test:scripts 2>&1 | grep -E "(pass|fail|tests)" | tail -5
```

Expected: 18 tests PASS (14 önceki + 4 yeni).

- [ ] **Step 3: Commit**

```bash
git add scripts/lib/__tests__/tweet-format.test.js
git commit -m "test: tweet-format coverage for YİBK, AİHM, RG, 280-char limit"
```

---

## Faz 2: Queue Generator

### Task 5: generate-tweets.js orkestratörü

**Files:**
- Create: `scripts/generate-tweets.js`

- [ ] **Step 1: generate-tweets.js'i yaz**

`scripts/generate-tweets.js`:

```javascript
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { buildTweet } from './lib/tweet-format.js';

// Türkiye saatleri 09/13/17/20 → UTC 06/10/14/17
const SLOTS_UTC = [6, 10, 14, 17];

function scheduledForSlot(baseDate, slotHourUtc) {
  const d = new Date(baseDate);
  d.setUTCHours(slotHourUtc, 0, 0, 0);
  return d.toISOString();
}

async function main() {
  const [, , dailyPath, queuePath] = process.argv;
  if (!dailyPath || !queuePath) {
    console.error('Usage: node generate-tweets.js <daily.json> <queue.json>');
    process.exit(1);
  }

  const siteDomain = process.env.SITE_DOMAIN || 'avfethiguzel.com';

  const daily = JSON.parse(await readFile(dailyPath, 'utf-8'));
  const highlights = Array.isArray(daily.highlights) ? daily.highlights.slice(0, 4) : [];

  const now = new Date();
  const isoDate = now.toISOString().slice(0, 10);

  const tweets = highlights.map((h, i) => ({
    id: `${isoDate}-${i + 1}`,
    highlightId: h.id,
    text: buildTweet(h, siteDomain),
    scheduledFor: scheduledForSlot(now, SLOTS_UTC[i]),
    posted: false,
    postedAt: null,
    tweetId: null,
    error: null
  }));

  const queue = {
    generatedAt: now.toISOString(),
    dateLabel: daily.dateLabel || isoDate,
    tweets
  };

  await mkdir(dirname(queuePath), { recursive: true });
  await writeFile(queuePath, JSON.stringify(queue, null, 2));
  console.log(`[generate-tweets] wrote ${tweets.length} tweets to ${queuePath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Lokal smoke test**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
node scripts/generate-tweets.js scripts/fixtures/daily-sample.json /tmp/queue-test.json
node --input-type=module -e "import fs from 'node:fs'; const q = JSON.parse(fs.readFileSync('/tmp/queue-test.json','utf-8')); console.log('tweet count:', q.tweets.length); q.tweets.forEach((t,i) => console.log(\`[\${i+1}] @\${t.scheduledFor} (\${t.text.length} chars): \${t.text.slice(0,60)}...\`));"
```

Expected:
- `tweet count: 4`
- Her tweet 280'in altında karakter
- scheduledFor zamanları: bugün 06/10/14/17 UTC
- Tweet'ler AYM/YİBK/AİHM/Resmî Gazete prefix'leriyle

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-tweets.js
git commit -m "feat: generate-tweets orchestrator (daily.json → twitter-queue.json)"
```

---

### Task 6: daily-icthat workflow'a generate-tweets ekle

**Files:**
- Modify: `.github/workflows/daily-icthat.yml`

- [ ] **Step 1: Workflow'u oku**

```bash
cat .github/workflows/daily-icthat.yml
```

- [ ] **Step 2: "Build daily.json" adımının sonrasına "Generate tweets" adımı ekle**

`.github/workflows/daily-icthat.yml`'de `Build daily.json` adımının HEMEN SONRASINA, `Commit if changed` adımından önce ekle:

```yaml
      - name: Generate tweets
        run: node scripts/generate-tweets.js public/data/daily.json public/data/twitter-queue.json
```

- [ ] **Step 3: Commit step'inin de twitter-queue.json'u commit'lemesini sağla**

Mevcut "Commit if changed" adımındaki `git add public/data/` zaten klasörü recursive ekliyor, yani `twitter-queue.json` da otomatik eklenir. Değişiklik gerekmez.

Tam yeni yapı şu şekilde olmalı:

```yaml
      - name: Build daily.json
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: node scripts/build-daily.js /tmp/raw.json public/data/

      - name: Generate tweets
        run: node scripts/generate-tweets.js public/data/daily.json public/data/twitter-queue.json

      - name: Commit if changed
        run: |
          git config user.name "icthat-bot"
          ...
```

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/daily-icthat.yml
git commit -m "ci: daily workflow generates twitter-queue.json after daily.json"
```

---

## Faz 3: Twitter Client + Posting

### Task 7: Twitter client (OAuth 1.0a imza)

**Files:**
- Create: `scripts/lib/twitter-client.js`
- Create: `scripts/lib/__tests__/twitter-client.test.js`

- [ ] **Step 1: Test yaz (network'süz, sadece imza ve istek hazırlama)**

`scripts/lib/__tests__/twitter-client.test.js`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAuthHeader } from '../twitter-client.js';

const FAKE_CREDS = {
  apiKey: 'k', apiSecret: 's',
  accessToken: 'at', accessTokenSecret: 'ats'
};

test('buildAuthHeader returns OAuth string with required params', () => {
  const header = buildAuthHeader('POST', 'https://api.x.com/2/tweets', FAKE_CREDS);
  assert.ok(header.startsWith('OAuth '), 'starts with OAuth');
  assert.ok(header.includes('oauth_consumer_key="k"'), 'has consumer_key');
  assert.ok(header.includes('oauth_token="at"'), 'has token');
  assert.ok(header.includes('oauth_signature_method="HMAC-SHA1"'), 'uses HMAC-SHA1');
  assert.ok(header.includes('oauth_signature='), 'has signature');
  assert.ok(header.includes('oauth_nonce='), 'has nonce');
  assert.ok(header.includes('oauth_timestamp='), 'has timestamp');
});

test('buildAuthHeader signatures differ across nonce calls', () => {
  const h1 = buildAuthHeader('POST', 'https://api.x.com/2/tweets', FAKE_CREDS);
  const h2 = buildAuthHeader('POST', 'https://api.x.com/2/tweets', FAKE_CREDS);
  // Different nonce/timestamp → different signature
  assert.notEqual(h1, h2);
});
```

- [ ] **Step 2: Testi çalıştır, FAIL'i gör**

Expected: `Cannot find module '../twitter-client.js'`.

- [ ] **Step 3: twitter-client.js'i yaz**

`scripts/lib/twitter-client.js`:

```javascript
import OAuth from 'oauth-1.0a';
import crypto from 'node:crypto';

function makeOAuth(creds) {
  return new OAuth({
    consumer: { key: creds.apiKey, secret: creds.apiSecret },
    signature_method: 'HMAC-SHA1',
    hash_function: (base, key) =>
      crypto.createHmac('sha1', key).update(base).digest('base64')
  });
}

export function buildAuthHeader(method, url, creds) {
  const oauth = makeOAuth(creds);
  const token = { key: creds.accessToken, secret: creds.accessTokenSecret };
  const requestData = { url, method };
  const headerData = oauth.toHeader(oauth.authorize(requestData, token));
  return headerData.Authorization;
}

export async function postTweet(text, creds) {
  const url = 'https://api.x.com/2/tweets';
  const authHeader = buildAuthHeader('POST', url, creds);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });
  const bodyText = await res.text();
  let body;
  try { body = JSON.parse(bodyText); } catch { body = { raw: bodyText }; }
  return { status: res.status, body };
}
```

- [ ] **Step 4: Testi çalıştır, PASS'i gör**

```bash
npm run test:scripts 2>&1 | grep -E "(pass|fail|tests)" | tail -5
```

Expected: 20 tests PASS (18 + 2 yeni).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/twitter-client.js scripts/lib/__tests__/twitter-client.test.js
git commit -m "feat: Twitter OAuth 1.0a client (buildAuthHeader + postTweet)"
```

---

### Task 8: post-due-tweets.js (filtreleme + posting)

**Files:**
- Create: `scripts/post-due-tweets.js`

- [ ] **Step 1: post-due-tweets.js'i yaz**

`scripts/post-due-tweets.js`:

```javascript
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { postTweet } from './lib/twitter-client.js';

function getCreds() {
  const c = {
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };
  const missing = Object.entries(c).filter(([k, v]) => !v).map(([k]) => k);
  if (missing.length > 0) {
    console.error(`[post-due-tweets] missing env vars: ${missing.join(', ')}`);
    process.exit(2);
  }
  return c;
}

async function main() {
  const [, , queuePath] = process.argv;
  if (!queuePath) {
    console.error('Usage: node post-due-tweets.js <queue.json>');
    process.exit(1);
  }

  if (!existsSync(queuePath)) {
    console.log('[post-due-tweets] queue not found, nothing to do');
    process.exit(0);
  }

  const creds = getCreds();
  const queue = JSON.parse(await readFile(queuePath, 'utf-8'));
  const now = Date.now();
  const due = queue.tweets.filter((t) =>
    !t.posted &&
    !t.error &&
    new Date(t.scheduledFor).getTime() <= now
  );

  if (due.length === 0) {
    console.log('[post-due-tweets] nothing due');
    process.exit(0);
  }

  console.log(`[post-due-tweets] ${due.length} tweet(s) due`);

  let stopOnAuth = false;
  for (const tweet of due) {
    if (stopOnAuth) break;
    try {
      const res = await postTweet(tweet.text, creds);
      if (res.status === 201) {
        tweet.posted = true;
        tweet.postedAt = new Date().toISOString();
        tweet.tweetId = res.body?.data?.id || null;
        console.log(`  ✓ posted ${tweet.id} → ${tweet.tweetId}`);
      } else if (res.status === 401) {
        tweet.error = 'auth';
        stopOnAuth = true;
        console.error(`  ✗ ${tweet.id}: 401 auth — stopping remaining tweets`);
      } else if (res.status === 403 && /duplicate/i.test(JSON.stringify(res.body))) {
        tweet.posted = true;
        tweet.error = 'duplicate';
        tweet.postedAt = new Date().toISOString();
        console.log(`  ⚠ ${tweet.id}: duplicate, marking posted`);
      } else if (res.status === 429) {
        console.log(`  ⏸ ${tweet.id}: rate limit, exit for retry`);
        break;
      } else {
        tweet.error = `HTTP ${res.status}: ${JSON.stringify(res.body).slice(0, 200)}`;
        console.error(`  ✗ ${tweet.id}: ${tweet.error}`);
      }
    } catch (err) {
      tweet.error = `network: ${err.message}`;
      console.error(`  ✗ ${tweet.id}: ${tweet.error}`);
    }
  }

  await writeFile(queuePath, JSON.stringify(queue, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Dry-run (env yokken hızlı sağlık testi)**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
unset TWITTER_API_KEY TWITTER_API_SECRET TWITTER_ACCESS_TOKEN TWITTER_ACCESS_TOKEN_SECRET
node scripts/post-due-tweets.js public/data/twitter-queue.json
echo "exit: $?"
```

Expected: Exit code 2, mesaj: `missing env vars: apiKey, apiSecret, accessToken, accessTokenSecret`.

- [ ] **Step 3: Boş queue testi**

```bash
node scripts/post-due-tweets.js /tmp/non-existent-queue.json
echo "exit: $?"
```

Expected: Exit code 0, mesaj: `queue not found, nothing to do`.

- [ ] **Step 4: Commit**

```bash
git add scripts/post-due-tweets.js
git commit -m "feat: post-due-tweets posts queued tweets that are scheduled for now or earlier"
```

---

## Faz 4: GitHub Actions + Secrets

### Task 9: tweet-poster.yml workflow

**Files:**
- Create: `.github/workflows/tweet-poster.yml`

- [ ] **Step 1: Workflow dosyasını yaz**

```yaml
name: Tweet Poster

on:
  schedule:
    - cron: '*/30 * * * *'   # her 30 dakika
  workflow_dispatch:

jobs:
  post:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: '20'
      - run: npm ci

      - name: Post due tweets
        env:
          TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
          TWITTER_API_SECRET: ${{ secrets.TWITTER_API_SECRET }}
          TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
          TWITTER_ACCESS_TOKEN_SECRET: ${{ secrets.TWITTER_ACCESS_TOKEN_SECRET }}
        run: node scripts/post-due-tweets.js public/data/twitter-queue.json

      - name: Commit queue if changed
        run: |
          git config user.name "icthat-bot"
          git config user.email "bot@fethiguzel.com"
          git add public/data/twitter-queue.json
          if git diff --staged --quiet; then
            echo "No changes to commit."
          else
            git commit -m "chore: tweet status update $(date -u +%Y-%m-%dT%H:%M)"
            git pull --rebase origin main || true
            git push
          fi
```

**Not:** `git pull --rebase` ekledim çünkü diğer workflow (daily-icthat) aynı dosyaya commit atabilir; çakışmayı önler.

- [ ] **Step 2: Commit + push**

```bash
git add .github/workflows/tweet-poster.yml
git commit -m "ci: tweet poster workflow (30dk cron)"
git push
```

---

### Task 10: Twitter secrets ekleme (kullanıcı adımı)

Bu adım kod değil, kullanıcının GitHub UI'da yapacağı manuel iş.

- [ ] **Step 1: Kullanıcıya talimat ver**

Kullanıcıya söyle:

1. https://developer.x.com/en/portal/projects-and-apps — X Developer Portal'a gir
2. Mevcut Project + App'ini aç (yoksa "Create Project" → minimal app)
3. App ayarlarında **"User authentication settings"** → ayarla:
   - **App permissions**: `Read and write`
   - **Type of App**: `Web App, Automated App or Bot`
   - **Callback URL**: `https://example.com` (geçici, kullanılmayacak)
   - **Website URL**: `https://avfethiguzel.com` (veya gerçek domain)
4. **"Keys and tokens"** sekmesinde:
   - **API Key** ve **API Secret** notu al (varsa, yoksa Regenerate)
   - **Access Token & Secret** bölümünde **Generate** (yoksa Regenerate). Önemli: bu generate User context altında olmalı, ve permission `Read and Write` olmalı (yoksa post atamaz).
5. https://github.com/fethiguzel13-crypto/av.fethiguzel/settings/secrets/actions adresine git, sırasıyla 4 secret ekle:
   - `TWITTER_API_KEY` → (API Key)
   - `TWITTER_API_SECRET` → (API Secret)
   - `TWITTER_ACCESS_TOKEN` → (Access Token)
   - `TWITTER_ACCESS_TOKEN_SECRET` → (Access Token Secret)

- [ ] **Step 2: Kullanıcı eklediğini teyit ettikten sonra devam et**

---

### Task 11: SITE_DOMAIN secret (opsiyonel ama önerilen)

- [ ] **Step 1: Vercel domain'i tespit et**

Vercel dashboard'dan projenin gerçek domain'ini öğren. Üç olasılık:
- Özel domain (örn `avfethiguzel.com`)
- `*.vercel.app` subdomain
- Henüz tanımsız

- [ ] **Step 2: Eğer özel domain varsa SITE_DOMAIN secret olarak ekle**

GitHub Settings → Secrets → Actions:
- `SITE_DOMAIN`: `avfethiguzel.com` (HTTPS prefix YOK, sadece domain)

Daily workflow'a env eklenecek (sonraki step).

- [ ] **Step 3: daily-icthat.yml'de Generate tweets adımına env ekle**

`.github/workflows/daily-icthat.yml`'deki Generate tweets adımını değiştir:

```yaml
      - name: Generate tweets
        env:
          SITE_DOMAIN: ${{ secrets.SITE_DOMAIN }}
        run: node scripts/generate-tweets.js public/data/daily.json public/data/twitter-queue.json
```

Eğer SITE_DOMAIN tanımlı değilse generate-tweets.js varsayılan `avfethiguzel.com`'u kullanır (kodda fallback var).

- [ ] **Step 4: Commit + push**

```bash
git add .github/workflows/daily-icthat.yml
git commit -m "ci: SITE_DOMAIN env for generate-tweets"
git push
```

---

## Faz 5: End-to-End Test

### Task 12: Daily workflow manuel tetikle, queue üret

- [ ] **Step 1: Daily workflow'u manuel tetikle**

https://github.com/fethiguzel13-crypto/av.fethiguzel/actions/workflows/daily-icthat.yml → "Run workflow"

- [ ] **Step 2: Workflow yeşil yandıktan sonra repo'yu pull**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
git pull --rebase
```

- [ ] **Step 3: twitter-queue.json'u incele**

```bash
node --input-type=module -e "import fs from 'node:fs'; const q = JSON.parse(fs.readFileSync('public/data/twitter-queue.json','utf-8')); console.log('Generated:', q.generatedAt); console.log('Count:', q.tweets.length); q.tweets.forEach((t,i) => console.log(\`[\${i+1}] @\${t.scheduledFor} (\${t.text.length} chars):\n   \${t.text}\n\`));"
```

Expected:
- 4 tweet (eğer daily.json'da 4 highlight varsa; AYM-only durumunda muhtemelen sadece var olan kadar)
- Her tweet 280 altında
- scheduledFor 06/10/14/17 UTC

---

### Task 13: tweet-poster.yml manuel tetikle (ilk post)

- [ ] **Step 1: Poster workflow'u manuel tetikle**

https://github.com/fethiguzel13-crypto/av.fethiguzel/actions/workflows/tweet-poster.yml → "Run workflow"

- [ ] **Step 2: Log'u izle**

Aksiyon log'unda "Post due tweets" adımına bak.

**Beklenen senaryolar:**

| Saat (UTC) | Beklenen davranış |
|---|---|
| 00:00 – 05:59 | "nothing due" (henüz hiçbir slot gelmedi) |
| 06:00 – 09:59 | İlk slot vakti, 1 tweet post edildi |
| 10:00 – 13:59 | 2 slot vakti, 2 tweet (eğer önceki run çalışmadıysa) |
| 14:00 – 16:59 | 3 slot |
| 17:00 + | 4 slot, hepsi |

- [ ] **Step 3: Twitter profilinde doğrula**

Kullanıcı kendi X profilini açıp tweet'in canlı yayında olduğunu görür.

- [ ] **Step 4: Eğer hata varsa**

| Log mesajı | Sorun | Çözüm |
|---|---|---|
| `missing env vars` | Secret eklenmemiş | Task 10'a dön |
| `401 auth` | Key/secret yanlış veya read-only token | App permissions "Read and write" mi? Access token regenerate |
| `403 duplicate` | Aynı içerik daha önce atılmış | İlk seferde olmaz; sonraki gün farklı içerik atılır, normalleşir |
| `429 rate limit` | Free tier 1500/ay aşıldı (olmamalı) | 24 saat bekle |

---

### Task 14: Beklenen otomatik akışı doğrula (24 saat içinde)

- [ ] **Step 1: Ertesi sabah daily workflow'unun otomatik çalıştığını doğrula**

06:00 UTC = 09:00 TR civarında. GitHub Actions'ta yeni run yeşil yandı mı?

- [ ] **Step 2: twitter-queue.json'un yeni gün için üretildiğini doğrula**

```bash
git pull --rebase
node --input-type=module -e "import fs from 'node:fs'; const q = JSON.parse(fs.readFileSync('public/data/twitter-queue.json','utf-8')); console.log('Date:', q.dateLabel); console.log('First tweet scheduledFor:', q.tweets[0]?.scheduledFor);"
```

- [ ] **Step 3: Gün boyu poster cron'unun her 30dk'da çalıştığını ve slot vakitleri geldikçe post attığını izle**

GitHub Actions sayfasında tweet-poster'ın runs listesi her saat başı yeni yeşil tikler göstermeli. Slot vakti gelen runs'larda log "posted X → tweetId" satırı olmalı.

- [ ] **Step 4: 4 tweet'in gün sonunda X profilinde olduğunu doğrula**

---

### Task 15: Memory + README güncellemesi

- [ ] **Step 1: Proje memory'sine Twitter setup'ı ekle**

`C:\Users\HUAWEI\.claude\projects\c--Users-HUAWEI-Desktop-internet\memory\twitter_otomasyon_setup.md`:

```markdown
---
name: twitter-otomasyon-setup
description: Av. Fethi Güzel sitesinin günlük içtihat verisinden Twitter/X'e otomatik paylaşım kurulumu
type: project
---

Repo: github.com/fethiguzel13-crypto/av.fethiguzel
Çalışma dizini: C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal
Kurulum tarihi: 2026-05-14

**Akış:**
- Daily workflow (.github/workflows/daily-icthat.yml) sabah scraper sonrası generate-tweets.js çağırır → public/data/twitter-queue.json üretir
- tweet-poster.yml (her 30dk cron) queue'yu okur, scheduledFor <= now olan tweetleri Twitter API ile post eder
- Slotlar (UTC): 06:00, 10:00, 14:00, 17:00 (TR: 09:00, 13:00, 17:00, 20:00)
- Tweet formatı: {Kaynak}: {publicSummary}\n\nKünye ve detay: {SITE_DOMAIN}/icthat\n\n#hukuk #içtihat ...

**Secrets (GitHub repo):**
- TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET (Read+Write permissions, user context OAuth 1.0a)
- SITE_DOMAIN (opsiyonel, varsayılan avfethiguzel.com)
- ANTHROPIC_API_KEY (mevcut, daily.json publicSummary için)

**Why:** Avukatın günlük içtihat takibini halka açık bir yayın kanalına çevirmek; siteye trafik çekmek; sosyal medya görünürlüğünü artırmak.
**How to apply:**
- Tweet metnini değiştirmek için sadece scripts/lib/tweet-format.js (buildTweet) değiştirilir.
- Slot zamanlarını değiştirmek için scripts/generate-tweets.js'deki SLOTS_UTC array'i.
- Yeni hashtag kaynağı için tweet-format.js'deki HASHTAGS object'i.
- Twitter API quota: free tier 1500/ay, günde 4 = ayda 120 (rahat).
```

MEMORY.md'ye satır ekle:

```markdown
- [Twitter Otomasyon Setup](twitter_otomasyon_setup.md) — Twitter/X otomatik paylaşım pipeline kurulumu
```

- [ ] **Step 2: README'ye Twitter bölümü ekle**

`README.md` sonuna ekle:

```markdown
## Twitter/X Otomasyon

Site, günde 4 öne çıkan içtihat/mevzuat gelişmesini otomatik olarak Twitter/X'e paylaşır.

**Pipeline:**
1. Sabah daily workflow scraper + build-daily çalışır
2. `scripts/generate-tweets.js` 4 highlight'tan 4 tweet üretir → `public/data/twitter-queue.json`
3. Her 30dk'da `tweet-poster.yml` workflow'u queue'yu kontrol eder, vakti gelen tweetleri post eder
4. Slotlar (Türkiye saati): 09:00, 13:00, 17:00, 20:00

**Secret gereksinimi:** `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_TOKEN_SECRET` (Read+Write app permissions), opsiyonel `SITE_DOMAIN`.

**Spec & Plan:**
- [Spec](docs/superpowers/specs/2026-05-14-twitter-otomasyon-design.md)
- [Plan](docs/superpowers/plans/2026-05-14-twitter-otomasyon.md)
```

- [ ] **Step 3: Commit + push**

```bash
git add README.md
git commit -m "docs: README with Twitter automation overview"
git push
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Veri akışı (sabah generate + 30dk poster) — Task 5, 6, 9
- ✅ Queue şeması (id, highlightId, text, scheduledFor, posted, postedAt, tweetId, error) — Task 5
- ✅ Tweet format (prefix + body + link + hashtag + 280 sınırı) — Task 2-4
- ✅ Posting (OAuth 1.0a, POST /2/tweets) — Task 7, 8
- ✅ Workflow (30dk cron) — Task 9
- ✅ Secrets — Task 10, 11
- ✅ Hata yönetimi (401 stop, 429 retry, 403 duplicate, 5xx retry) — Task 8
- ✅ Test stratejisi (tweet-format unit, twitter-client signature, post-due dry-run) — Task 2-4, 7, 8

**Type/method tutarlılığı:**
- `buildTweet(item, siteDomain)` — Task 3'te tanımlandı, Task 5'te kullanıldı ✓
- `buildAuthHeader(method, url, creds)` — Task 7'de tanımlandı ✓
- `postTweet(text, creds)` — Task 7'de tanımlandı, Task 8'de kullanıldı ✓
- Queue field'ları (id, highlightId, text, scheduledFor, posted, postedAt, tweetId, error) — Task 5'te yazıldı, Task 8'de okundu/yazıldı ✓

**Placeholder taraması:** "TBD/TODO" — yok ✓

**Açık nokta:** `SITE_DOMAIN` secret'ı tanımlanmazsa kodda `avfethiguzel.com` fallback. Vercel domain'in farklı çıkarsa kullanıcı SITE_DOMAIN ekler. Bu plan'da açıkça ele alınıyor (Task 11).
