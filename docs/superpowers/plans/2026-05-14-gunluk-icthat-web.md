# Günlük İçtihat Web Yayını (Next.js) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Av. Fethi Güzel'in Next.js portföy sitesinde günlük içtihat ve mevzuat verisini otomatik yayınlamak — ana sayfada 4 öne çıkan kart, `/icthat` alt sayfasında filtrelenebilir tam künyeli liste.

**Architecture:** GitHub Actions → scraper → `scripts/build-daily.js` (normalize + Claude Haiku) → `public/data/daily.json` → commit → Vercel rebuild → Next.js server components fs ile okur, statik HTML render eder.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Node.js 20+, Playwright (mevcut scraper), Anthropic SDK (Haiku), GSAP + lucide-react (mevcut UI patterns), GitHub Actions, Vercel.

**Working Directory:** `C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal`

**Spec:** [../specs/2026-05-14-gunluk-icthat-web-design.md](../specs/2026-05-14-gunluk-icthat-web-design.md)

---

## Dosya Yapısı

| Dosya | Tür | Sorumluluk |
|---|---|---|
| `scraper/` | Yeni (kopyala) | Skill'den gelen Playwright scraper'lar |
| `scripts/build-daily.js` | Yeni | Ham JSON → site şeması orkestratörü |
| `scripts/lib/normalize.js` | Yeni | Kaynak başına normalize |
| `scripts/lib/highlights.js` | Yeni | Highlight seçim |
| `scripts/lib/summarize.js` | Yeni | Anthropic Haiku |
| `scripts/lib/__tests__/*.test.js` | Yeni | Node test runner |
| `scripts/fixtures/raw-sample.json` | Yeni | Test fixture |
| `public/data/daily.json` | Otomatik | Bugünkü veri |
| `public/data/archive/YYYY-MM-DD.json` | Otomatik | Geçmiş 30 gün |
| `lib/daily.ts` | Yeni | TypeScript tipleri + fs reader |
| `components/DailyNews.tsx` | Yeni | Ana sayfa highlight grid (server) |
| `components/DailyNewsCards.tsx` | Yeni | Animasyon için client subcomponent |
| `components/IcthatFilters.tsx` | Yeni | Client filtre |
| `components/IcthatList.tsx` | Yeni | Client list (filtre uygulanmış render) |
| `app/icthat/page.tsx` | Yeni | Alt sayfa server component |
| `app/page.tsx` | Modify | DailyNews ekleme |
| `components/Navbar.tsx` | Modify | "Güncel" menü öğesi |
| `package.json` | Modify | `@anthropic-ai/sdk` + test script |
| `.gitignore` | Modify | scraper/node_modules eklenmesi (varsa) |
| `.github/workflows/daily-icthat.yml` | Yeni | Cron + manuel workflow |

---

## Faz 1: Repo Hazırlığı

### Task 1: Repo durumu doğrula + untracked dosyayı temizle + docs commit

**Files:**
- Existing: `.gitignore`
- Maybe modify: `app/mevzuat/Untitled-1.txt` (delete — accidental)
- Modify: `docs/superpowers/` (already created with spec)

- [ ] **Step 1: Çalışma dizinine geç ve repo temizliğini doğrula**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
git status
git remote -v
git log --oneline -5
```

Expected: Branch main, remote origin https://github.com/fethiguzel13-crypto/av.fethiguzel.git, son commit'ler görünür. Yalnızca `app/mevzuat/Untitled-1.txt` untracked olmalı.

- [ ] **Step 2: Untracked Untitled-1.txt dosyasını incele, gereksizse sil**

```bash
cat "app/mevzuat/Untitled-1.txt"
```

Eğer boş veya kazara oluşmuş ise:

```bash
rm "app/mevzuat/Untitled-1.txt"
git status
```

Eğer içeriği önemliyse: olduğu gibi bırak, sonradan kullanıcı karar verir.

- [ ] **Step 3: docs/superpowers/ klasörlerinin var olduğunu doğrula**

```bash
ls docs/superpowers/specs/ docs/superpowers/plans/
```

Expected: spec ve plan dosyaları görünür.

- [ ] **Step 4: docs'ı commit et**

```bash
git add docs/
git commit -m "docs: spec and plan for daily icthat web feature"
```

- [ ] **Step 5: .gitignore'a scraper artefactlarını ekle**

`.gitignore` mevcut içeriğine ekle (zaten varsa atla):

```
# Scraper artifacts
scraper/node_modules/
/tmp/
*.log
```

Commit:

```bash
git add .gitignore
git diff --staged --quiet || git commit -m "chore: extend .gitignore for scraper"
```

---

## Faz 2: Scraper Migrasyonu

### Task 2: Scraper'ı skill'den repo'ya kopyala

**Files:**
- Create: `scraper/` (klasör kopyası, node_modules hariç)

- [ ] **Step 1: Scraper klasörünü kopyala**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
mkdir -p scraper
cp -r /c/Users/HUAWEI/.claude/skills/gunluk-icthat-takip/scraper/lib scraper/
cp /c/Users/HUAWEI/.claude/skills/gunluk-icthat-takip/scraper/scrape-*.js scraper/
cp /c/Users/HUAWEI/.claude/skills/gunluk-icthat-takip/scraper/package.json scraper/
cp /c/Users/HUAWEI/.claude/skills/gunluk-icthat-takip/scraper/package-lock.json scraper/
ls scraper/
```

Expected: `lib/`, `package.json`, `package-lock.json`, `scrape-all.js`, `scrape-aym.js`, `scrape-hudoc.js`, `scrape-resmigazete.js`, `scrape-yargitay.js`.

- [ ] **Step 2: Bağımlılıkları kur**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal/scraper
npm ci
npx playwright install chromium
```

Expected: Bağımlılıklar ve Chromium kurulur.

- [ ] **Step 3: Smoke test — bir scraper'ı dene**

```bash
node scrape-resmigazete.js --days=2 2>&1 | tail -30
```

Expected: JSON çıktı. Eğer 200OK gelmiyorsa `scrape-hudoc.js --days=7`'yi dene.

- [ ] **Step 4: Commit**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
git add scraper/
git commit -m "feat: add daily case-law scrapers from skill"
```

---

## Faz 3: Build Pipeline

### Task 3: Anthropic SDK + test infrastructure root package.json'a ekle

**Files:**
- Modify: `package.json` (root, mevcut Next.js package.json)

- [ ] **Step 1: Mevcut package.json'ı incele**

```bash
cat /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal/package.json
```

- [ ] **Step 2: `@anthropic-ai/sdk` dependency ekle ve scripts genişlet**

`package.json` içinde:

**`scripts`** bloğuna ekle (existing `"dev"`, `"build"`, `"start"`, `"lint"` korunur):

```json
    "test:scripts": "node --test scripts/lib/__tests__/",
    "build:daily": "node scripts/build-daily.js"
```

**`dependencies`** bloğuna ekle:

```json
    "@anthropic-ai/sdk": "^0.32.0"
```

- [ ] **Step 3: npm install**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
npm install
```

Expected: `@anthropic-ai/sdk` indirilir, `package-lock.json` güncellenir.

- [ ] **Step 4: Test klasörlerini hazırla**

```bash
mkdir -p scripts/lib/__tests__ scripts/fixtures
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @anthropic-ai/sdk + test:scripts script"
```

---

### Task 4: Test fixture — örnek ham scraper çıktısı

**Files:**
- Create: `scripts/fixtures/raw-sample.json`

- [ ] **Step 1: Fixture'ı yaz**

`C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal\scripts\fixtures\raw-sample.json`:

```json
{
  "source": "all",
  "elapsedSec": "180.5",
  "sources": {
    "resmigazete": {
      "source": "ResmiGazete",
      "ok": true,
      "items": [
        {
          "date": "2026-05-13",
          "category": "YÖNETMELİKLER",
          "title": "Konkordato Talebine Eklenecek Belgeler Hakkında Yönetmelikte Değişiklik Yapılmasına Dair Yönetmelik",
          "href": "https://www.resmigazete.gov.tr/eskiler/2026/05/20260513-2.htm"
        }
      ]
    },
    "yargitay": {
      "source": "Yargıtay",
      "ok": true,
      "items": [
        {
          "category": "Borçlar/Tüketici/Ticaret",
          "id": "1203880800",
          "daire": "11. Hukuk Dairesi",
          "esas": "2025/4020",
          "karar": "2026/1160",
          "tarih": "26.02.2026",
          "kunye": "Y. 11. Hukuk Dairesi, E. 2025/4020, K. 2026/1160, T. 26.02.2026",
          "konu": "Kefalet sözleşmesinde yazılı şekil şartının yerine getirilmemesi halinde sözleşmenin geçersizliği"
        },
        {
          "category": "HGK",
          "id": "9999999",
          "daire": "Hukuk Genel Kurulu",
          "esas": "2025/100",
          "karar": "2026/50",
          "tarih": "10.03.2026",
          "kunye": "HGK, E. 2025/100, K. 2026/50, T. 10.03.2026",
          "konu": "İçtihadı birleştirme niteliğinde önemli karar"
        }
      ]
    },
    "aym": {
      "source": "AYM-BireyselBasvuru",
      "ok": true,
      "items": [
        {
          "basvuran": "İSA OZAN VE DİĞERLERİ",
          "basvuruNo": "2023/108631",
          "tur": "Esas (İhlal)",
          "birim": "Birinci Bölüm",
          "basvuruTarihi": "15/12/2023",
          "kararTarihi": "04/03/2026",
          "konu": "Başvuru, gerekçeli karar hakkının ihlali iddialarına ilişkindir",
          "kunye": "AYM, B. No: 2023/108631, K.T. 04/03/2026, Birinci Bölüm"
        }
      ]
    },
    "hudoc": {
      "source": "HUDOC",
      "ok": true,
      "items": [
        {
          "itemId": "001-250158",
          "appNo": "17389/20",
          "caseName": "AFFAIRE YASAK c. TÜRKİYE",
          "date": "2026-05-05T00:00:00",
          "conclusion": "Violation de l'article 7",
          "importance": "1"
        }
      ]
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/fixtures/raw-sample.json
git commit -m "test: add raw scraper output fixture"
```

---

### Task 5: Normalize — Resmî Gazete (TDD)

**Files:**
- Create: `scripts/lib/normalize.js`
- Create: `scripts/lib/__tests__/normalize.test.js`

- [ ] **Step 1: Test yaz**

`scripts/lib/__tests__/normalize.test.js`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { normalizeResmiGazete } from '../normalize.js';

const fixture = JSON.parse(
  await readFile(new URL('../../fixtures/raw-sample.json', import.meta.url), 'utf-8')
);

test('normalizeResmiGazete maps title, date, url, category', () => {
  const items = normalizeResmiGazete(fixture.sources.resmigazete);
  assert.equal(items.length, 1);
  const item = items[0];
  assert.equal(item.source, 'RG');
  assert.equal(item.sourceLabel, 'Resmî Gazete');
  assert.equal(item.category, 'Yönetmelik');
  assert.equal(item.title, 'Konkordato Talebine Eklenecek Belgeler Hakkında Yönetmelikte Değişiklik Yapılmasına Dair Yönetmelik');
  assert.equal(item.date, '2026-05-13');
  assert.equal(item.url, 'https://www.resmigazete.gov.tr/eskiler/2026/05/20260513-2.htm');
  assert.equal(item.icon, 'scroll-text');
  assert.ok(item.id.startsWith('rg-'), 'id should start with rg-');
});

test('normalizeResmiGazete handles empty/missing source gracefully', () => {
  assert.deepEqual(normalizeResmiGazete(null), []);
  assert.deepEqual(normalizeResmiGazete({ ok: false }), []);
  assert.deepEqual(normalizeResmiGazete({ ok: true, items: [] }), []);
});
```

- [ ] **Step 2: Testi çalıştır, FAIL'i gör**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
npm run test:scripts 2>&1 | tail -20
```

Expected: FAIL — modül yok.

- [ ] **Step 3: `normalize.js` oluştur**

`scripts/lib/normalize.js`:

```javascript
function categoryFromRGSection(section) {
  if (!section) return 'Diğer';
  const s = section.toUpperCase();
  if (s.includes('YÖNETMELİK')) return 'Yönetmelik';
  if (s.includes('KANUN')) return 'Kanun';
  if (s.includes('TEBLİĞ')) return 'Tebliğ';
  if (s.includes('KARAR')) return 'Karar';
  if (s.includes('GENELGE')) return 'Genelge';
  return 'Diğer';
}

function slugifyId(prefix, ...parts) {
  return prefix + '-' + parts
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeResmiGazete(rawSource) {
  if (!rawSource || rawSource.ok === false || !Array.isArray(rawSource.items)) return [];
  return rawSource.items.map((it) => ({
    id: slugifyId('rg', (it.date || '').replace(/-/g, ''), (it.href || '').split('/').pop()?.replace(/\.htm.*$/, '')),
    source: 'RG',
    sourceLabel: 'Resmî Gazete',
    category: categoryFromRGSection(it.category),
    icon: 'scroll-text',
    title: it.title || '(başlık yok)',
    konu: it.title || '',
    publicSummary: '',
    date: it.date || '',
    url: it.href || ''
  }));
}
```

- [ ] **Step 4: Testi çalıştır, PASS'i gör**

```bash
npm run test:scripts 2>&1 | tail -10
```

Expected: 2 test PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/normalize.js scripts/lib/__tests__/normalize.test.js
git commit -m "feat: normalize Resmî Gazete scraper output"
```

---

### Task 6: Normalize — Yargıtay (TDD)

**Files:**
- Modify: `scripts/lib/normalize.js`
- Modify: `scripts/lib/__tests__/normalize.test.js`

- [ ] **Step 1: Yargıtay testlerini ekle**

`scripts/lib/__tests__/normalize.test.js` dosyasının sonuna ekle:

```javascript
import { normalizeYargitay } from '../normalize.js';

test('normalizeYargitay maps kunye, category, daire, date', () => {
  const items = normalizeYargitay(fixture.sources.yargitay);
  assert.equal(items.length, 2);
  const first = items[0];
  assert.equal(first.source, 'Yargıtay');
  assert.equal(first.kunye, 'Y. 11. Hukuk Dairesi, E. 2025/4020, K. 2026/1160, T. 26.02.2026');
  assert.equal(first.daire, '11. Hukuk Dairesi');
  assert.equal(first.category, 'Borçlar/Tüketici/Ticaret');
  assert.equal(first.date, '2026-02-26');
  assert.equal(first.icon, 'scale');
  assert.ok(first.id.startsWith('y-'));
});

test('normalizeYargitay detects HGK category', () => {
  const items = normalizeYargitay(fixture.sources.yargitay);
  const hgk = items.find((it) => it.daire === 'Hukuk Genel Kurulu');
  assert.ok(hgk, 'HGK item should exist');
  assert.equal(hgk.category, 'HGK');
});
```

- [ ] **Step 2: Testi çalıştır, FAIL'i gör**

```bash
npm run test:scripts 2>&1 | tail -10
```

Expected: FAIL — `normalizeYargitay is not a function`.

- [ ] **Step 3: `normalize.js`'ye ekle**

`scripts/lib/normalize.js` sonuna ekle:

```javascript
function ddmmyyyyToIso(s) {
  if (!s || typeof s !== 'string') return '';
  const m = s.match(/^(\d{2})[.\/](\d{2})[.\/](\d{4})$/);
  if (!m) return '';
  return `${m[3]}-${m[2]}-${m[1]}`;
}

export function normalizeYargitay(rawSource) {
  if (!rawSource || rawSource.ok === false || !Array.isArray(rawSource.items)) return [];
  return rawSource.items.map((it) => ({
    id: slugifyId('y', it.id || `${it.esas}-${it.karar}`.replace(/\//g, '-')),
    source: 'Yargıtay',
    sourceLabel: 'Yargıtay',
    kunye: it.kunye || '',
    daire: it.daire || '',
    esas: it.esas || '',
    karar: it.karar || '',
    category: it.category || (it.daire?.includes('Genel Kurulu') ? 'HGK' : 'Diğer'),
    icon: 'scale',
    konu: it.konu || '',
    publicSummary: '',
    date: ddmmyyyyToIso(it.tarih),
    url: `https://karararama.yargitay.gov.tr/`
  }));
}
```

- [ ] **Step 4: Testi çalıştır, PASS'i gör**

Expected: 4 test PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/normalize.js scripts/lib/__tests__/normalize.test.js
git commit -m "feat: normalize Yargıtay scraper output"
```

---

### Task 7: Normalize — AYM + HUDOC (TDD)

**Files:**
- Modify: `scripts/lib/normalize.js`
- Modify: `scripts/lib/__tests__/normalize.test.js`

- [ ] **Step 1: AYM + HUDOC testleri ekle**

`scripts/lib/__tests__/normalize.test.js` sonuna ekle:

```javascript
import { normalizeAym, normalizeHudoc } from '../normalize.js';

test('normalizeAym maps basvuruNo, konu, date', () => {
  const items = normalizeAym(fixture.sources.aym);
  assert.equal(items.length, 1);
  const item = items[0];
  assert.equal(item.source, 'AYM');
  assert.equal(item.kunye, 'AYM, B. No: 2023/108631, K.T. 04/03/2026, Birinci Bölüm');
  assert.equal(item.date, '2026-03-04');
  assert.equal(item.icon, 'landmark');
  assert.equal(item.basvuruNo, '2023/108631');
});

test('normalizeHudoc maps caseName, importance, date', () => {
  const items = normalizeHudoc(fixture.sources.hudoc);
  assert.equal(items.length, 1);
  const item = items[0];
  assert.equal(item.source, 'AİHM');
  assert.equal(item.caseName, 'AFFAIRE YASAK c. TÜRKİYE');
  assert.equal(item.importance, '1');
  assert.equal(item.date, '2026-05-05');
  assert.equal(item.icon, 'flag');
  assert.equal(item.appNo, '17389/20');
});
```

- [ ] **Step 2: Testi çalıştır, FAIL'i gör**

Expected: FAIL.

- [ ] **Step 3: `normalize.js`'ye ekle**

```javascript
export function normalizeAym(rawSource) {
  if (!rawSource || rawSource.ok === false || !Array.isArray(rawSource.items)) return [];
  return rawSource.items.map((it) => ({
    id: slugifyId('aym', (it.basvuruNo || '').replace(/\//g, '-')),
    source: 'AYM',
    sourceLabel: 'Anayasa Mahkemesi',
    kunye: it.kunye || '',
    basvuruNo: it.basvuruNo || '',
    basvuran: it.basvuran || '',
    birim: it.birim || '',
    tur: it.tur || '',
    category: 'Bireysel Başvuru',
    icon: 'landmark',
    konu: it.konu || '',
    publicSummary: '',
    date: ddmmyyyyToIso(it.kararTarihi),
    url: `https://kararlarbilgibankasi.anayasa.gov.tr/`
  }));
}

export function normalizeHudoc(rawSource) {
  if (!rawSource || rawSource.ok === false || !Array.isArray(rawSource.items)) return [];
  return rawSource.items.map((it) => ({
    id: slugifyId('hudoc', it.itemId),
    source: 'AİHM',
    sourceLabel: 'AİHM',
    caseName: it.caseName || '',
    appNo: it.appNo || '',
    importance: it.importance || '',
    category: 'Türkiye Kararı',
    icon: 'flag',
    konu: it.conclusion || '',
    publicSummary: '',
    date: (it.date || '').slice(0, 10),
    url: `https://hudoc.echr.coe.int/eng?i=${encodeURIComponent(it.itemId || '')}`
  }));
}
```

- [ ] **Step 4: Testi çalıştır, PASS'i gör**

Expected: 6 test PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/normalize.js scripts/lib/__tests__/normalize.test.js
git commit -m "feat: normalize AYM and HUDOC scraper output"
```

---

### Task 8: Highlight seçim mantığı (TDD)

**Files:**
- Create: `scripts/lib/highlights.js`
- Create: `scripts/lib/__tests__/highlights.test.js`

- [ ] **Step 1: Test yaz**

`scripts/lib/__tests__/highlights.test.js`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectHighlights } from '../highlights.js';

const sampleItems = {
  resmigazete: [
    { id: 'rg-1', source: 'RG', category: 'Yönetmelik', title: 'Tüketici Yönetmeliği değişikliği' },
    { id: 'rg-2', source: 'RG', category: 'Tebliğ', title: 'Bütçe tebliği' }
  ],
  yargitay: [
    { id: 'y-1', source: 'Yargıtay', daire: '11. Hukuk Dairesi', category: 'Borçlar/Tüketici/Ticaret', kunye: '...' },
    { id: 'y-hgk', source: 'Yargıtay', daire: 'Hukuk Genel Kurulu', category: 'HGK', kunye: '...' },
    { id: 'y-yibk', source: 'Yargıtay', daire: 'YİBK', category: 'YİBK', kunye: 'YİBK ...' }
  ],
  aym: [
    { id: 'aym-1', source: 'AYM', tur: 'Esas (İhlal)', konu: 'mülkiyet hakkı ihlali' }
  ],
  hudoc: [
    { id: 'hudoc-1', source: 'AİHM', importance: '1', caseName: 'KEY CASE' },
    { id: 'hudoc-2', source: 'AİHM', importance: '3', caseName: 'low importance' }
  ],
  mevzuat: []
};

test('selectHighlights prioritizes YİBK first', () => {
  const result = selectHighlights(sampleItems);
  assert.equal(result.length, 4);
  assert.equal(result[0].id, 'y-yibk');
});

test('selectHighlights includes AYM ihlal, HUDOC importance=1, HGK', () => {
  const result = selectHighlights(sampleItems);
  const ids = result.map((x) => x.id);
  assert.ok(ids.includes('aym-1'));
  assert.ok(ids.includes('hudoc-1'));
  assert.ok(ids.includes('y-hgk'));
});

test('selectHighlights returns empty for empty input', () => {
  const sparse = { resmigazete: [], yargitay: [], aym: [], hudoc: [], mevzuat: [] };
  assert.deepEqual(selectHighlights(sparse), []);
});

test('selectHighlights caps at 4', () => {
  const many = {
    ...sampleItems,
    yargitay: Array.from({ length: 20 }, (_, i) => ({
      id: `y-extra-${i}`, source: 'Yargıtay', daire: 'YİBK', category: 'YİBK', kunye: `YİBK ${i}`
    }))
  };
  const result = selectHighlights(many);
  assert.equal(result.length, 4);
});
```

- [ ] **Step 2: Testi çalıştır, FAIL'i gör**

- [ ] **Step 3: `highlights.js` oluştur**

`scripts/lib/highlights.js`:

```javascript
const RG_KEYWORDS = /tüketici|borçlar|borcl|ticaret|sözleşme|iş kanunu|sgk|sosyal güvenlik|miras|aile|tmk|tbk|ttk|kefalet|icra|iflas/i;
const AYM_KEYWORDS = /ihlal|pilot|mülkiyet|adil yargılanma/i;

function pickYIBK(yargitay) {
  return yargitay.filter((it) => /YİBK|içtihadı birleştirme/i.test(it.daire || '') || /YİBK/i.test(it.category || '') || /YİBK/i.test(it.kunye || ''));
}

function pickAymHighPriority(aym) {
  return aym.filter((it) => AYM_KEYWORDS.test(`${it.tur || ''} ${it.konu || ''}`));
}

function pickHudocKey(hudoc) {
  return hudoc.filter((it) => it.importance === '1');
}

function pickRgRelevant(resmigazete) {
  return resmigazete.filter((it) => RG_KEYWORDS.test(it.title || ''));
}

function pickHgk(yargitay) {
  return yargitay.filter((it) => /Genel Kurulu/i.test(it.daire || ''));
}

export function selectHighlights(items) {
  const buckets = [
    pickYIBK(items.yargitay || []),
    pickAymHighPriority(items.aym || []),
    pickHudocKey(items.hudoc || []),
    pickRgRelevant(items.resmigazete || []),
    pickHgk(items.yargitay || [])
  ];

  const seen = new Set();
  const result = [];
  for (const bucket of buckets) {
    for (const item of bucket) {
      if (result.length >= 4) break;
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      result.push(item);
    }
    if (result.length >= 4) break;
  }
  return result;
}
```

- [ ] **Step 4: Testi çalıştır, PASS'i gör**

Expected: 10 test toplam PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/highlights.js scripts/lib/__tests__/highlights.test.js
git commit -m "feat: highlight selection (YİBK > AYM > HUDOC > RG > HGK)"
```

---

### Task 9: Claude Haiku özet (TDD)

**Files:**
- Create: `scripts/lib/summarize.js`
- Create: `scripts/lib/__tests__/summarize.test.js`

- [ ] **Step 1: Test yaz (sadece prompt + skip mantığı, network yok)**

`scripts/lib/__tests__/summarize.test.js`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPrompt, shouldSummarize } from '../summarize.js';

test('buildPrompt includes title and konu, asks for plain Turkish', () => {
  const prompt = buildPrompt({ title: 'Konkordato yönetmeliği', konu: 'İflas erteleme süreci...' });
  assert.ok(prompt.includes('Konkordato yönetmeliği'));
  assert.ok(prompt.includes('İflas erteleme süreci'));
  assert.ok(prompt.toLowerCase().includes('vatandaş'));
  assert.ok(prompt.toLowerCase().includes('jargon'));
});

test('buildPrompt uses kunye if title missing', () => {
  const prompt = buildPrompt({ kunye: 'Y. 11. HD, E. 2025/4020', konu: 'kefalet' });
  assert.ok(prompt.includes('Y. 11. HD'));
});

test('shouldSummarize skips if publicSummary already present', () => {
  assert.equal(shouldSummarize({ publicSummary: 'Zaten var.' }), false);
  assert.equal(shouldSummarize({ publicSummary: '' }), true);
  assert.equal(shouldSummarize({ konu: 'x' }), true);
});

test('shouldSummarize skips if no konu and no title', () => {
  assert.equal(shouldSummarize({}), false);
  assert.equal(shouldSummarize({ konu: '', title: '' }), false);
});
```

- [ ] **Step 2: Testi çalıştır, FAIL'i gör**

- [ ] **Step 3: `summarize.js` yaz**

`scripts/lib/summarize.js`:

```javascript
import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 80;
const CONCURRENCY = 5;

export function buildPrompt(item) {
  const label = item.title || item.kunye || '(başlık yok)';
  const konu = item.konu || '';
  return `Sen bir hukuk iletişim uzmanısın. Sıradan bir vatandaşın anlayabileceği, jargon içermeyen, 1-2 cümlelik (max 30 kelime) açıklama yaz. Hukuki kavramları gündelik dile çevir.

Başlık: ${label}
Hukuki konu: ${konu}

Vatandaş için açıkla:`;
}

export function shouldSummarize(item) {
  if (item.publicSummary && item.publicSummary.trim().length > 0) return false;
  const hasContent = (item.konu && item.konu.trim()) || (item.title && item.title.trim()) || (item.kunye && item.kunye.trim());
  return Boolean(hasContent);
}

async function summarizeOne(client, item) {
  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content: buildPrompt(item) }]
    });
    return resp.content?.[0]?.text?.trim() || '';
  } catch (err) {
    console.error(`[summarize] failed for ${item.id}: ${err.message}`);
    return '';
  }
}

async function processInBatches(items, fn, concurrency) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

export async function summarizeAll(items, apiKey) {
  if (!apiKey) {
    console.warn('[summarize] ANTHROPIC_API_KEY missing — skipping summaries');
    return items;
  }
  const client = new Anthropic({ apiKey });
  const toSummarize = items.filter(shouldSummarize);
  if (toSummarize.length === 0) return items;
  const summaries = await processInBatches(toSummarize, (it) => summarizeOne(client, it), CONCURRENCY);
  const byId = new Map(toSummarize.map((it, i) => [it.id, summaries[i]]));
  return items.map((it) => byId.has(it.id) ? { ...it, publicSummary: byId.get(it.id) || '' } : it);
}
```

- [ ] **Step 4: Testi çalıştır, PASS'i gör**

Expected: 14 test toplam PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/summarize.js scripts/lib/__tests__/summarize.test.js
git commit -m "feat: Anthropic Haiku publicSummary generation"
```

---

### Task 10: build-daily.js orkestratörü

**Files:**
- Create: `scripts/build-daily.js`

- [ ] **Step 1: `build-daily.js` yaz**

`scripts/build-daily.js`:

```javascript
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import {
  normalizeResmiGazete,
  normalizeYargitay,
  normalizeAym,
  normalizeHudoc
} from './lib/normalize.js';
import { selectHighlights } from './lib/highlights.js';
import { summarizeAll } from './lib/summarize.js';

const TR_MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

function formatDateLabel(date) {
  return `${date.getUTCDate()} ${TR_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

async function main() {
  const [, , inputPath, outputDir] = process.argv;
  if (!inputPath || !outputDir) {
    console.error('Usage: node build-daily.js <raw.json> <output-dir>');
    process.exit(1);
  }

  const raw = JSON.parse(await readFile(inputPath, 'utf-8'));
  const sources = raw.sources || {};

  const items = {
    resmigazete: normalizeResmiGazete(sources.resmigazete),
    yargitay: normalizeYargitay(sources.yargitay),
    aym: normalizeAym(sources.aym),
    hudoc: normalizeHudoc(sources.hudoc),
    mevzuat: []
  };

  const errors = [];
  for (const [name, src] of Object.entries(sources)) {
    if (src && src.ok === false) {
      errors.push({ source: name, message: src.error || 'unknown failure' });
    }
  }

  const allItems = Object.values(items).flat();
  const summarized = await summarizeAll(allItems, process.env.ANTHROPIC_API_KEY);
  const byId = new Map(summarized.map((it) => [it.id, it]));
  for (const key of Object.keys(items)) {
    items[key] = items[key].map((it) => byId.get(it.id) || it);
  }

  const highlights = selectHighlights(items);

  const now = new Date();
  const isoDate = now.toISOString().slice(0, 10);

  const output = {
    generatedAt: now.toISOString(),
    dateLabel: formatDateLabel(now),
    highlights,
    items,
    stats: {
      totalItems: allItems.length,
      perSource: Object.fromEntries(Object.entries(items).map(([k, v]) => [k, v.length]))
    },
    errors
  };

  await mkdir(outputDir, { recursive: true });
  await mkdir(join(outputDir, 'archive'), { recursive: true });
  await writeFile(join(outputDir, 'daily.json'), JSON.stringify(output, null, 2));
  await writeFile(join(outputDir, 'archive', `${isoDate}.json`), JSON.stringify(output, null, 2));

  console.log(`[build-daily] wrote ${allItems.length} items, ${highlights.length} highlights, ${errors.length} errors`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Lokal fixture testi**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
node scripts/build-daily.js scripts/fixtures/raw-sample.json /tmp/test-out/
ls /tmp/test-out/
node -e "const d=require('/tmp/test-out/daily.json'); console.log({stats:d.stats, highlightCount:d.highlights.length})"
```

Expected: `daily.json` ve archive yazılır; `totalItems: 4` (1 RG + 2 Yargıtay + 1 AYM + 1 HUDOC), `highlightCount: 4`.

- [ ] **Step 3: Commit**

```bash
git add scripts/build-daily.js
git commit -m "feat: build-daily orchestrator (scraper raw → site JSON)"
```

---

### Task 11: Canlı veri ile end-to-end test + public/data'ya yaz

- [ ] **Step 1: Canlı scraper'ı çalıştır**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
node scraper/scrape-all.js --yargitay-days=30 --hudoc-days=14 --aym-days=60 > /tmp/raw-real.json
wc -c /tmp/raw-real.json
```

Expected: 30-180 saniye sonra dolu JSON. (Eğer Yargıtay scraper özellikle yavaşsa flag'lerle kısalt.)

- [ ] **Step 2: build-daily ile public/data/'ya yaz**

```bash
mkdir -p public/data
node scripts/build-daily.js /tmp/raw-real.json public/data/
ls public/data/
```

Expected: `public/data/daily.json` + `public/data/archive/2026-05-14.json`.

- [ ] **Step 3: Çıktıyı incele**

```bash
node -e "const d=require('./public/data/daily.json'); console.log({stats:d.stats, highlightCount:d.highlights.length, errors:d.errors.length, firstHighlight:d.highlights[0]?.title || d.highlights[0]?.kunye})"
```

Expected: `totalItems > 0`, highlight'lar mantıklı görünür.

- [ ] **Step 4: Commit**

```bash
git add public/data/
git commit -m "data: initial public/data/daily.json from live scrape"
```

---

## Faz 4: Next.js Components

### Task 12: TypeScript types + lib/daily.ts + DailyNews component

**Files:**
- Create: `lib/daily.ts`
- Create: `components/DailyNews.tsx`
- Create: `components/DailyNewsCards.tsx`

- [ ] **Step 1: `lib/daily.ts` yaz**

`C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal\lib\daily.ts`:

```typescript
import fs from 'fs';
import path from 'path';

export type DailySource = 'RG' | 'Yargıtay' | 'AYM' | 'AİHM' | 'Mevzuat';

export interface DailyItem {
  id: string;
  source: DailySource;
  sourceLabel: string;
  icon: string;
  category?: string;
  title?: string;
  kunye?: string;
  caseName?: string;
  appNo?: string;
  basvuruNo?: string;
  daire?: string;
  esas?: string;
  karar?: string;
  konu: string;
  publicSummary: string;
  date: string;
  url: string;
  importance?: string;
}

export interface DailyData {
  generatedAt: string;
  dateLabel: string;
  highlights: DailyItem[];
  items: {
    resmigazete: DailyItem[];
    yargitay: DailyItem[];
    aym: DailyItem[];
    hudoc: DailyItem[];
    mevzuat: DailyItem[];
  };
  stats: {
    totalItems: number;
    perSource: Record<string, number>;
  };
  errors: Array<{ source: string; message: string }>;
}

export function loadDaily(): DailyData | null {
  const file = path.join(process.cwd(), 'public', 'data', 'daily.json');
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as DailyData;
  } catch (err) {
    console.error('[loadDaily] parse failed:', err);
    return null;
  }
}

export function itemTitle(item: DailyItem): string {
  return item.title || item.caseName || item.kunye || '(başlık yok)';
}

const TR_MONTHS_SHORT = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];

export function formatTrDate(iso: string): string {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${parseInt(m[3], 10)} ${TR_MONTHS_SHORT[parseInt(m[2], 10) - 1]} ${m[1]}`;
}
```

- [ ] **Step 2: `components/DailyNews.tsx` (server component, sıfır içerikte hidden)**

`components/DailyNews.tsx`:

```typescript
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { loadDaily } from '@/lib/daily';
import DailyNewsCards from './DailyNewsCards';

export default function DailyNews() {
  const data = loadDaily();
  if (!data || !data.highlights || data.highlights.length === 0) return null;

  return (
    <section id="guncel" className="py-32 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-accent font-heading text-sm tracking-widest uppercase mb-4">Güncel</h2>
            <p className="text-4xl md:text-5xl text-charcoal font-bold font-sans">
              Hukuki <span className="font-drama italic text-accent">Gelişmeler.</span>
            </p>
            <p className="text-charcoal/50 text-sm font-mono mt-3 tracking-widest uppercase">
              {data.dateLabel}
            </p>
          </div>
          <Link
            href="/icthat"
            className="flex items-center gap-2 text-charcoal font-bold text-sm tracking-widest uppercase group border-b-2 border-accent pb-2"
          >
            TÜM İÇTİHATLARI GÖR
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        <DailyNewsCards highlights={data.highlights} />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: `components/DailyNewsCards.tsx` (client, GSAP animasyon)**

`components/DailyNewsCards.tsx`:

```typescript
"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollText, Scale, Landmark, Flag, BookOpen, ArrowUpRight } from 'lucide-react';
import type { DailyItem } from '@/lib/daily';
import { itemTitle, formatTrDate } from '@/lib/daily';

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  'scroll-text': ScrollText,
  'scale': Scale,
  'landmark': Landmark,
  'flag': Flag,
  'book': BookOpen
};

function ItemIcon({ name }: { name: string }) {
  const Icon = ICONS[name] || Scale;
  return <Icon size={20} />;
}

export default function DailyNewsCards({ highlights }: { highlights: DailyItem[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.daily-card', {
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {highlights.map((item) => (
        <article
          key={item.id}
          className="daily-card group p-10 bg-white border border-charcoal/5 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 flex flex-col"
        >
          <div className="flex justify-between items-start mb-8">
            <div className="w-10 h-10 bg-accent/5 rounded-full flex items-center justify-center text-accent">
              <ItemIcon name={item.icon} />
            </div>
            <span className="text-[10px] font-mono font-bold text-charcoal/30 uppercase tracking-widest">
              {item.sourceLabel}
            </span>
          </div>
          <h4 className="text-xl font-heading font-bold text-charcoal mb-4 group-hover:text-accent transition-colors line-clamp-3">
            {itemTitle(item)}
          </h4>
          <p className="text-charcoal/60 text-sm leading-relaxed mb-8 line-clamp-3 flex-1">
            {item.publicSummary || item.konu.slice(0, 200)}
          </p>
          <div className="flex items-center justify-between pt-6 border-t border-charcoal/5">
            <span className="text-charcoal/40 text-xs font-mono uppercase tracking-widest">
              {formatTrDate(item.date)}
            </span>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-bold text-accent tracking-[0.2em] uppercase"
              >
                DETAY
                <ArrowUpRight size={12} />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Type check**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
npx tsc --noEmit 2>&1 | head -30
```

Expected: Hata yok (yeni yazılan dosyalar TypeScript syntax açısından doğru). Eğer "Cannot find module '@/lib/daily'" varsa tsconfig path mapping zaten var demek; Next.js varsayılan olarak `@/*` mapping'i ile çalışır.

- [ ] **Step 5: Commit**

```bash
git add lib/daily.ts components/DailyNews.tsx components/DailyNewsCards.tsx
git commit -m "feat(site): DailyNews server component + animated client cards"
```

---

### Task 13: Ana sayfa'ya DailyNews ekle

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: `app/page.tsx` import + JSX'e ekle**

`app/page.tsx` import bölümüne ekle (mevcut import'ların altına):

```typescript
import DailyNews from "@/components/DailyNews";
```

`<Articles />` öğesinin **üstüne** ekle (yani `<PropertyLaw />` ile `<Articles />` arasına):

```tsx
      <DailyNews />
```

Tam görünüm:

```tsx
      <PropertyLaw />
      <DailyNews />
      <Articles />
```

- [ ] **Step 2: Local dev server ile test et**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
npm run dev
```

Tarayıcıda `http://localhost:3000` aç. "Güncel" bölümünü kontrol et. Hata varsa terminal'deki log'u oku.

- [ ] **Step 3: Build test**

```bash
# dev server'ı kapat (Ctrl+C)
npm run build 2>&1 | tail -30
```

Expected: Build başarılı (`✓ Generating static pages`). Hata varsa düzelt.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(site): integrate DailyNews into homepage"
```

---

### Task 14: app/icthat/page.tsx (server-side)

**Files:**
- Create: `app/icthat/page.tsx`

- [ ] **Step 1: `app/icthat/page.tsx` oluştur**

```bash
mkdir -p app/icthat
```

`app/icthat/page.tsx`:

```typescript
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { loadDaily } from '@/lib/daily';
import IcthatFilters from '@/components/IcthatFilters';
import IcthatList from '@/components/IcthatList';

export const metadata: Metadata = {
  title: 'Güncel İçtihat & Mevzuat',
  description: 'Yargıtay, Anayasa Mahkemesi, AİHM kararları ve Resmî Gazete mevzuat değişikliklerinin günlük takibi.'
};

export default function IcthatPage() {
  const data = loadDaily();

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h2 className="text-accent font-heading text-sm tracking-widest uppercase mb-4">Günlük Takip</h2>
          <h1 className="text-4xl md:text-6xl text-charcoal font-bold mb-6">
            İçtihat & <span className="font-drama italic text-accent">Mevzuat</span>
          </h1>
          <p className="text-charcoal/60 max-w-2xl mx-auto text-base">
            Yargıtay, Anayasa Mahkemesi, AİHM kararları ve Resmî Gazete'de yayımlanan mevzuat değişikliklerinin günlük takibi.
          </p>
          {data && (
            <p className="text-charcoal/40 text-xs font-mono uppercase tracking-widest mt-4">
              Son güncelleme: {data.dateLabel}
            </p>
          )}
        </header>

        {!data || data.stats.totalItems === 0 ? (
          <div className="text-center py-20 text-charcoal/50">
            <p className="text-lg">Bugün için yeni gelişme bulunmuyor.</p>
          </div>
        ) : (
          <IcthatList data={data} />
        )}
      </main>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Commit (henüz IcthatFilters/IcthatList yok, build sonradan)**

```bash
git add app/icthat/page.tsx
git commit -m "feat(site): icthat page scaffold (will fail build until Task 15)"
```

---

### Task 15: IcthatFilters + IcthatList client components

**Files:**
- Create: `components/IcthatFilters.tsx`
- Create: `components/IcthatList.tsx`

- [ ] **Step 1: `components/IcthatList.tsx` oluştur**

```typescript
"use client";

import React, { useState } from 'react';
import { ScrollText, Scale, Landmark, Flag, BookOpen, Copy, Check, ExternalLink } from 'lucide-react';
import type { DailyData, DailyItem } from '@/lib/daily';
import { itemTitle, formatTrDate } from '@/lib/daily';
import IcthatFilters from './IcthatFilters';

const SOURCE_ORDER: (keyof DailyData['items'])[] = ['resmigazete', 'yargitay', 'aym', 'hudoc', 'mevzuat'];

const SOURCE_HEADERS: Record<string, { label: string; icon: React.ComponentType<{ size?: number }> }> = {
  resmigazete: { label: 'Resmî Gazete', icon: ScrollText },
  yargitay: { label: 'Yargıtay', icon: Scale },
  aym: { label: 'Anayasa Mahkemesi', icon: Landmark },
  hudoc: { label: 'AİHM', icon: Flag },
  mevzuat: { label: 'Mevzuat', icon: BookOpen }
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="shrink-0 w-8 h-8 rounded-lg border border-charcoal/10 text-charcoal/60 hover:text-accent hover:border-accent/30 transition flex items-center justify-center"
      title="Künyeyi kopyala"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

function Item({ item }: { item: DailyItem }) {
  return (
    <article className="bg-white border border-charcoal/5 rounded-[1.5rem] p-6 hover:border-charcoal/20 transition">
      <div className="flex justify-between items-start gap-4 mb-3">
        <h3 className="text-base md:text-lg font-heading font-bold text-charcoal flex-1">{itemTitle(item)}</h3>
        {item.category && (
          <span className="shrink-0 bg-accent/10 text-accent text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded-md">
            {item.category}
          </span>
        )}
      </div>
      {item.kunye && (
        <div className="flex items-center gap-2 mb-3">
          <code className="flex-1 bg-charcoal/5 text-charcoal/80 text-xs font-mono px-3 py-2 rounded-lg overflow-x-auto">
            {item.kunye}
          </code>
          <CopyButton text={item.kunye} />
        </div>
      )}
      {item.konu && (
        <p className="text-charcoal/60 text-sm leading-relaxed mb-4">
          {item.publicSummary || item.konu}
        </p>
      )}
      <div className="flex items-center justify-between pt-3 border-t border-charcoal/5">
        <span className="text-charcoal/40 text-xs font-mono uppercase tracking-widest">{formatTrDate(item.date)}</span>
        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-accent font-bold tracking-widest uppercase">
            Kaynak <ExternalLink size={12} />
          </a>
        )}
      </div>
    </article>
  );
}

function Section({ sourceKey, items }: { sourceKey: keyof DailyData['items']; items: DailyItem[] }) {
  if (!items || items.length === 0) return null;
  const header = SOURCE_HEADERS[sourceKey];
  const HeaderIcon = header.icon;
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-accent/5 rounded-full flex items-center justify-center text-accent">
          <HeaderIcon size={18} />
        </div>
        <h2 className="text-charcoal font-heading text-2xl font-bold flex-1">{header.label}</h2>
        <span className="text-xs font-mono text-charcoal/40 uppercase tracking-widest">{items.length} kayıt</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => <Item key={it.id} item={it} />)}
      </div>
    </section>
  );
}

export default function IcthatList({ data }: { data: DailyData }) {
  const [filter, setFilter] = useState<string>('all');

  const visibleKeys = filter === 'all' ? SOURCE_ORDER : [filter as keyof DailyData['items']];
  const visibleSections = visibleKeys.filter((key) => (data.items[key] || []).length > 0);

  return (
    <>
      <IcthatFilters active={filter} onChange={setFilter} />
      {visibleSections.length === 0 ? (
        <div className="text-center py-20 text-charcoal/50">
          <p>Bu filtre için sonuç yok.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {visibleSections.map((key) => (
            <Section key={key} sourceKey={key} items={data.items[key]} />
          ))}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: `components/IcthatFilters.tsx` oluştur**

```typescript
"use client";

import React from 'react';

const FILTERS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'Tümü' },
  { value: 'yargitay', label: 'Yargıtay' },
  { value: 'aym', label: 'AYM' },
  { value: 'hudoc', label: 'AİHM' },
  { value: 'resmigazete', label: 'Resmî Gazete' }
];

export default function IcthatFilters({ active, onChange }: { active: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-5 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-widest transition ${
            active === f.value
              ? 'bg-accent text-white'
              : 'bg-white text-charcoal/70 border border-charcoal/10 hover:border-accent/40'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Build test**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
npm run build 2>&1 | tail -30
```

Expected: `✓ Compiled successfully`. `/icthat` route'u prerender edildi.

- [ ] **Step 4: Dev server ile manuel test**

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000/icthat` aç. Kontrol et:
- Sayfa açılıyor, tarih başlıkta görünür
- Filtre butonları çalışıyor
- Künye kopyala butonu tıklanınca ikon Check'e dönüşüyor
- Mobile responsive (DevTools)

- [ ] **Step 5: Commit**

```bash
git add components/IcthatFilters.tsx components/IcthatList.tsx
git commit -m "feat(site): IcthatList + IcthatFilters client components"
```

---

### Task 16: Navbar'a "Güncel" linki ekle

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: `menuItems` array'ine ekle**

`components/Navbar.tsx` içindeki `menuItems` array'inin **başına** (Hakkımda'dan sonra) ekle:

```tsx
    { name: 'Güncel', href: '/icthat' },
```

Tam görünüm:

```tsx
  const menuItems = [
    { name: 'Hakkımda', href: '/#manifesto' },
    { name: 'Güncel', href: '/icthat' },
    {
      name: 'Medeni Hukuk',
      // ... mevcut
```

- [ ] **Step 2: Tarayıcıda doğrula**

`npm run dev` çalışırken sayfayı yenile, navbar'da "GÜNCEL" görünmeli. Tıklayınca /icthat'a gitsin.

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat(site): add 'Güncel' link to navbar"
```

---

## Faz 5: Deploy + Otomasyon

### Task 17: İlk canlı deploy

- [ ] **Step 1: Local dev server'ı durdur** (Ctrl+C if running)

- [ ] **Step 2: Push**

```bash
cd /c/Users/HUAWEI/Desktop/internet/fethiguzel-portal
git push origin main
```

- [ ] **Step 3: Vercel deploy'unu izle**

Vercel dashboard'a git, en son deployment'ı izle. Build log'unda hata olmamalı.

- [ ] **Step 4: Canlı site doğrulaması**

Tarayıcıda canlı URL aç (Vercel dashboard'dan domain'i öğren):
- Ana sayfada "Güncel" bölümü görünür ve 4 kart var
- `/icthat` açılıyor, kaynaklar gruplu listelenmiş
- Navbar'da "GÜNCEL" linki çalışıyor
- Mobil görünüm OK

- [ ] **Step 5: Hata varsa**

| Hata | Çözüm |
|---|---|
| Build fail "Cannot find module '@/lib/daily'" | tsconfig.json `paths` kontrol et, mevcut import alias'ları neyi gösteriyor |
| `/icthat` 404 | `app/icthat/page.tsx` commit'lenmiş mi? `git ls-files app/icthat/` |
| public/data/daily.json 404 | `git ls-files public/data/` ile doğrula |
| Karakter sorunu (Türkçe ı, ü) | Dosya UTF-8 mi? VS Code alt sağ köşe |

---

### Task 18: GitHub Actions workflow

**Files:**
- Create: `.github/workflows/daily-icthat.yml`

- [ ] **Step 1: Workflow dosyasını oluştur**

```bash
mkdir -p .github/workflows
```

`.github/workflows/daily-icthat.yml`:

```yaml
name: Günlük İçtihat Çekme

on:
  schedule:
    - cron: '0 6 * * *'  # 06:00 UTC = 09:00 Türkiye
  workflow_dispatch:

jobs:
  scrape-and-publish:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - name: Node setup
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Root deps
        run: npm ci

      - name: Scraper deps + Chromium
        working-directory: scraper
        run: |
          npm ci
          npx playwright install --with-deps chromium

      - name: Run scrapers
        run: node scraper/scrape-all.js > /tmp/raw.json
        timeout-minutes: 10

      - name: Build daily.json
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: node scripts/build-daily.js /tmp/raw.json public/data/

      - name: Commit if changed
        run: |
          git config user.name "icthat-bot"
          git config user.email "bot@fethiguzel.com"
          git add public/data/
          if git diff --staged --quiet; then
            echo "No changes to commit."
          else
            git commit -m "chore: günlük içtihat $(date -u +%Y-%m-%d)"
            git push
          fi
```

- [ ] **Step 2: Workflow'u commit + push**

```bash
git add .github/workflows/daily-icthat.yml
git commit -m "ci: daily icthat scrape workflow"
git push
```

---

### Task 19: ANTHROPIC_API_KEY secret (kullanıcı adımı)

Bu adım kod değil, kullanıcının GitHub UI'da yapacağı manuel iş.

- [ ] **Step 1: Kullanıcıya talimat ver**

Kullanıcıya söyle:

1. https://console.anthropic.com/settings/keys → API key oluştur (veya mevcut bir tanesini kullan)
2. https://github.com/fethiguzel13-crypto/av.fethiguzel/settings/secrets/actions → "New repository secret"
3. Name: `ANTHROPIC_API_KEY`
4. Value: (API key)
5. "Add secret"

- [ ] **Step 2: Eklendiğini kullanıcıdan teyit al**

---

### Task 20: Manuel workflow_dispatch testi

- [ ] **Step 1: GitHub Actions'tan elle tetikle**

https://github.com/fethiguzel13-crypto/av.fethiguzel/actions/workflows/daily-icthat.yml → "Run workflow" → "Run workflow".

- [ ] **Step 2: İzle**

Run'a tıkla, log'u canlı izle. Beklenen aşamalar: checkout → Node setup → root deps → scraper deps → run scrapers → build daily.json → commit. Toplam ~5-8 dakika.

- [ ] **Step 3: Sonucu doğrula**

- Run yeşil (success)
- Repo'da `public/data/daily.json` yeni commit ile güncellendi (author: `icthat-bot`)
- Vercel otomatik rebuild tetiklendi
- 2-3 dakika sonra canlı site güncel veriyle çalışıyor

- [ ] **Step 4: Hata durumunda**

| Hata | Çözüm |
|---|---|
| `ANTHROPIC_API_KEY` undefined | Secret yanlış adlandırılmış olabilir |
| Playwright Chromium hata | `--with-deps` flag eksik mi? |
| `git push` 403 | Workflow `permissions: contents: write` var mı? |
| Yargıtay scraper timeout | `--yargitay-days=30` ile run komutuna ekle |
| Next.js build fail (Vercel'de) | daily.json valid JSON mı? schema değişti mi? |

Düzelt + tekrar push + tekrar dispatch.

---

### Task 21: Memory + README güncellemesi

- [ ] **Step 1: Proje memory'sine kayıt**

`C:\Users\HUAWEI\.claude\projects\c--Users-HUAWEI-Desktop-internet\memory\daily_icthat_setup.md`:

```markdown
---
name: daily-icthat-setup
description: Av. Fethi Güzel Next.js sitesinde günlük içtihat yayını otomasyonu kurulum bilgisi
type: project
---

Site: github.com/fethiguzel13-crypto/av.fethiguzel (Next.js 16 + Tailwind), Vercel'de yayında.
Çalışma dizini: C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal
Otomasyon: .github/workflows/daily-icthat.yml her gün 06:00 UTC = 09:00 TR.
Veri çıktısı: public/data/daily.json (canonical) + public/data/archive/YYYY-MM-DD.json
Render: ana sayfada components/DailyNews.tsx (4 highlight kartı), /icthat sayfasında app/icthat/page.tsx + IcthatList/IcthatFilters client component'leri.
Secrets: ANTHROPIC_API_KEY (Haiku özet için, repo secret)
Kurulum tarihi: 2026-05-14

**Why:** Vatandaşa hızlı gelişme erişimi + meslektaşa tam künyeli takip + manuel iş yükünü kaldırma.
**How to apply:**
- Yeni kaynak ekleneceğinde scraper/ + scripts/lib/normalize.js + scripts/lib/highlights.js + lib/daily.ts type'ları güncellenir.
- Site UI değişikliği yalnız components/DailyNews* veya IcthatList'i değiştirir; build-daily.js sözleşmesi sabit kalır.
- Eski statik prototip lokal `C:\Users\HUAWEI\Desktop\internet\` klasöründe (Vercel'e bağlı değil — terkedilmiş).
```

`MEMORY.md`'ye satır ekle:

```markdown
- [Daily İçtihat Setup](daily_icthat_setup.md) — Next.js sitesinde günlük içtihat otomasyonu kurulum bilgisi
```

- [ ] **Step 2: Repo README'ye not ekle**

`README.md` sonuna ekle:

```markdown
## Günlük İçtihat Otomasyonu

`.github/workflows/daily-icthat.yml` her gün 06:00 UTC (09:00 TR) tetiklenir:
1. `scraper/scrape-all.js` → ham JSON (Yargıtay, AYM, AİHM, Resmî Gazete)
2. `scripts/build-daily.js` → normalize + Claude Haiku ile vatandaş özetleri → `public/data/daily.json`
3. Değişiklik varsa commit + push → Vercel rebuild

### Local dev
```bash
npm install
cd scraper && npm install && npx playwright install chromium && cd ..
node scraper/scrape-all.js > /tmp/raw.json
node scripts/build-daily.js /tmp/raw.json public/data/
npm run dev
```

### Scripts testi
```bash
npm run test:scripts
```
```

- [ ] **Step 3: Commit + push**

```bash
git add README.md
git commit -m "docs: project README with daily icthat automation overview"
git push
```

---

## Self-Review Checklist

Plan yazıldıktan sonra spec'e karşı kontrol:

- ✅ Spec "Ana sayfa bölümü" — Task 12 (component), Task 13 (integration)
- ✅ Spec "Alt sayfa /icthat" — Task 14 (server page), Task 15 (client components)
- ✅ Spec "JSON şeması" — Task 5-7 (normalize) + Task 10 (orkestratör), `lib/daily.ts` types
- ✅ Spec "Highlight seçim mantığı" — Task 8
- ✅ Spec "Claude Haiku özeti" — Task 9
- ✅ Spec "GitHub Actions" — Task 18, 19, 20
- ✅ Spec "Hata yönetimi" — Task 10'da errors[], Task 12'de null check, Task 14'te empty state, Task 20 hata-çözüm tablosu
- ✅ Spec "Test stratejisi" — Task 5-9 unit tests, Task 11 end-to-end live, Task 13/15 manuel browser
- ✅ Spec "Next.js veri okuma stratejisi" — Task 12 `loadDaily()` server-side fs

**Tip tutarlılığı**: `DailyItem` interface'i `lib/daily.ts`'de tanımlı, tüm component'ler aynı şekilde tüketiyor. `icon` alanı normalize katmanında `scroll-text`, `scale`, `landmark`, `flag`, `book` üretiyor; `DailyNewsCards` ve `IcthatList` aynı setle eşliyor. ✓

**Placeholder taraması**: "TBD/TODO" — yok ✓
