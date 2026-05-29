# İçtihat Analiz Sayfaları Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Her mahkeme kararı için ayrı analiz sayfası oluştur (`/icthat/[id]`) — Claude Sonnet 4.6 tarafından üretilen 4 bölümlü Türkçe analiz, günlük GitHub Actions pipeline'ına entegre.

**Architecture:** `build-analysis.js` scripti `public/data/daily.json` highlights'larını okur, her biri için Claude Sonnet'e Av. Fethi Güzel sesiyle 4-bölümlü analiz yazdırır ve `public/data/analyses/[id].json` olarak kaydeder. Next.js `app/icthat/[id]/page.tsx` dynamic route bu JSON dosyalarını okur ve render eder. `IcthatList` içindeki kartlara analiz mevcutsa "Analizi Oku →" linki eklenir.

**Tech Stack:** Node.js ESM, `@anthropic-ai/sdk`, Next.js 16 App Router, TypeScript, Tailwind CSS

---

### Task 1: scripts/lib/analysis-writer.js

**Files:**
- Create: `scripts/lib/analysis-writer.js`
- Create: `scripts/lib/__tests__/analysis-writer.test.js`

- [ ] **Step 1: Write the failing test**

```js
// scripts/lib/__tests__/analysis-writer.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { writeAnalysis } from '../analysis-writer.js';

const MOCK_SECTIONS = {
  davaSozeti: 'Dava özeti metni.',
  mahkemeninKarari: 'Mahkeme kararı metni.',
  benimGozlemim: 'Gözlem metni.',
  pratikEtki: 'Pratik etki metni.'
};

const MOCK_HIGHLIGHT = {
  id: 'aym-2024-28913',
  source: 'AYM',
  kunye: 'AYM, B. No: 2024/28913',
  konu: 'İfade özgürlüğü',
  publicSummary: 'Test özeti.',
  date: '2026-05-06',
  url: 'https://example.com'
};

describe('writeAnalysis', () => {
  it('calls Sonnet and returns structured analysis', async () => {
    const mockClient = {
      messages: {
        create: async () => ({
          content: [{ type: 'text', text: JSON.stringify(MOCK_SECTIONS) }]
        })
      }
    };
    const result = await writeAnalysis(MOCK_HIGHLIGHT, mockClient);
    assert.equal(result.id, 'aym-2024-28913');
    assert.ok(result.generatedAt);
    assert.deepEqual(result.sections, MOCK_SECTIONS);
    assert.equal(result.highlight.source, 'AYM');
    assert.equal(result.highlight.kunye, 'AYM, B. No: 2024/28913');
  });

  it('strips markdown code fences from response', async () => {
    const mockClient = {
      messages: {
        create: async () => ({
          content: [{ type: 'text', text: '```json\n' + JSON.stringify(MOCK_SECTIONS) + '\n```' }]
        })
      }
    };
    const result = await writeAnalysis(MOCK_HIGHLIGHT, mockClient);
    assert.deepEqual(result.sections, MOCK_SECTIONS);
  });

  it('throws when response is empty', async () => {
    const mockClient = {
      messages: {
        create: async () => ({ content: [] })
      }
    };
    await assert.rejects(
      () => writeAnalysis(MOCK_HIGHLIGHT, mockClient),
      /empty/i
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/__tests__/analysis-writer.test.js`
Expected: FAIL — `writeAnalysis` not found

- [ ] **Step 3: Implement analysis-writer.js**

```js
// scripts/lib/analysis-writer.js
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM = `Sen Av. Fethi Güzel'sin. Mahkeme kararlarını hukuk meraklısı vatandaşlar için analiz ediyorsun.

Ton: Deneyimli bir avukatın sohbet diliyle yazdığı kişisel analiz — bilgili ama jargonsuz. "Bu kararda dikkatimi çeken..." gibi kişisel gözlemler ekle.

Uzunluk: Her bölüm 80-120 kelime. Toplam 400-600 kelime.

Yanıtı SADECE aşağıdaki JSON formatında ver, başka hiçbir şey ekleme:
{
  "davaSozeti": "Ne oldu? Kim, neden mahkemeye gitti? (sade dil)",
  "mahkemeninKarari": "Ne karar verildi, hukuki gerekçe ne?",
  "benimGozlemim": "Av. Fethi Güzel'in kişisel değerlendirmesi. Karar standart mı, istisnai mi? Neden önemli?",
  "pratikEtki": "Bu karar hangi durumlarda emsal oluşturur? Benzer durumda olan biri için ne anlam taşır?"
}`;

function parseResponse(text) {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(cleaned);
}

export async function writeAnalysis(highlight, client = new Anthropic()) {
  const content = [
    `Mahkeme: ${highlight.source}`,
    highlight.kunye ? `Künyesi: ${highlight.kunye}` : null,
    `Konu: ${highlight.konu || ''}`,
    `Özet: ${(highlight.publicSummary || highlight.konu || '').slice(0, 600)}`,
    highlight.date ? `Tarih: ${highlight.date}` : null,
  ].filter(Boolean).join('\n');

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM,
    messages: [{ role: 'user', content }]
  });

  const raw = msg.content?.[0]?.text;
  if (!raw) throw new Error(`Empty API response for highlight ${highlight.id}`);

  const sections = parseResponse(raw);

  return {
    id: highlight.id,
    generatedAt: new Date().toISOString(),
    sections,
    highlight: {
      source: highlight.source,
      kunye: highlight.kunye || null,
      konu: highlight.konu || null,
      date: highlight.date || null,
      url: highlight.url || null
    }
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/__tests__/analysis-writer.test.js`
Expected: 3 tests pass

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/analysis-writer.js scripts/lib/__tests__/analysis-writer.test.js
git commit -m "feat: add analysis-writer.js for Sonnet-based legal analysis"
```

---

### Task 2: scripts/build-analysis.js

**Files:**
- Create: `scripts/build-analysis.js`

- [ ] **Step 1: Create build-analysis.js**

```js
// scripts/build-analysis.js
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import { writeAnalysis } from './lib/analysis-writer.js';

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function main() {
  const [, , dailyPath, outDir] = process.argv;
  if (!dailyPath || !outDir) {
    console.error('Usage: node build-analysis.js <daily.json> <analyses-dir>');
    process.exit(1);
  }

  const daily = JSON.parse(await readFile(dailyPath, 'utf-8'));
  const highlights = daily.highlights || [];

  if (highlights.length === 0) {
    console.log('[build-analysis] no highlights found, nothing to do');
    return;
  }

  await mkdir(outDir, { recursive: true });

  let generated = 0;
  let skipped = 0;

  for (const h of highlights) {
    const outPath = join(outDir, `${h.id}.json`);
    if (await exists(outPath)) {
      console.log(`[build-analysis] skip ${h.id} (already exists)`);
      skipped++;
      continue;
    }
    console.log(`[build-analysis] generating ${h.id}...`);
    const analysis = await writeAnalysis(h);
    await writeFile(outPath, JSON.stringify(analysis, null, 2));
    console.log(`[build-analysis] ✓ ${h.id}`);
    generated++;
  }

  console.log(`[build-analysis] done: ${generated} generated, ${skipped} skipped`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Smoke test (requires ANTHROPIC_API_KEY and existing daily.json)**

Run: `node scripts/build-analysis.js public/data/daily.json public/data/analyses/`

Expected (if daily.json has highlights):
```
[build-analysis] generating aym-XXXX...
[build-analysis] ✓ aym-XXXX
[build-analysis] done: N generated, 0 skipped
```

Expected (if daily.json is empty or not present — safe to skip):
```
[build-analysis] no highlights found, nothing to do
```

- [ ] **Step 3: Commit**

```bash
git add scripts/build-analysis.js
git commit -m "feat: add build-analysis.js orchestrator"
```

---

### Task 3: lib/analysis.ts

**Files:**
- Create: `lib/analysis.ts`

- [ ] **Step 1: Create lib/analysis.ts**

```typescript
// lib/analysis.ts
import 'server-only';
import fs from 'fs';
import path from 'path';

export interface AnalysisSections {
  davaSozeti: string;
  mahkemeninKarari: string;
  benimGozlemim: string;
  pratikEtki: string;
}

export interface AnalysisData {
  id: string;
  generatedAt: string;
  sections: AnalysisSections;
  highlight: {
    source: string;
    kunye: string | null;
    konu: string | null;
    date: string | null;
    url: string | null;
  };
}

export function loadAnalysis(id: string): AnalysisData | null {
  const file = path.join(process.cwd(), 'public', 'data', 'analyses', `${id}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as AnalysisData;
  } catch (err) {
    console.error(`[loadAnalysis] parse failed for ${id}:`, err);
    return null;
  }
}

export function loadAvailableAnalysisIds(): string[] {
  const dir = path.join(process.cwd(), 'public', 'data', 'analyses');
  if (!fs.existsSync(dir)) return [];
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''));
  } catch {
    return [];
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/analysis.ts
git commit -m "feat: add lib/analysis.ts server-side helpers"
```

---

### Task 4: app/icthat/[id]/page.tsx

**Files:**
- Create: `app/icthat/[id]/page.tsx`

- [ ] **Step 1: Create the directory and page file**

```tsx
// app/icthat/[id]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { loadAnalysis } from '@/lib/analysis';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = loadAnalysis(id);
  if (!data) return { title: 'Analiz Bulunamadı' };

  const court = data.highlight.source || '';
  const ref = data.highlight.kunye || id;
  const desc = data.sections.davaSozeti?.slice(0, 155) || '';

  return {
    title: `${court} ${ref} Analizi | Av. Fethi Güzel`,
    description: desc,
  };
}

export default async function AnalysisPage({ params }: Props) {
  const { id } = await params;
  const data = loadAnalysis(id);
  if (!data) notFound();

  const { sections, highlight } = data;

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <main className="pt-40 pb-20 px-6 max-w-3xl mx-auto">
        <Link
          href="/icthat"
          className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-accent transition mb-10 font-mono uppercase tracking-widest"
        >
          ← Tüm Kararlar
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-accent/10 text-accent text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded-md">
              {highlight.source}
            </span>
            {highlight.date && (
              <span className="text-charcoal/40 text-xs font-mono">{highlight.date}</span>
            )}
          </div>
          {highlight.kunye && (
            <p className="text-charcoal/60 text-sm font-mono">{highlight.kunye}</p>
          )}
        </header>

        <div className="space-y-10">
          <Section title="Dava Özeti" text={sections.davaSozeti} />
          <Section title="Mahkemenin Kararı" text={sections.mahkemeninKarari} />
          <Section title="Benim Gözlemim" text={sections.benimGozlemim} />
          <Section title="Pratik Etki" text={sections.pratikEtki} />
        </div>

        {highlight.url && (
          <div className="mt-12 pt-8 border-t border-charcoal/10">
            <a
              href={highlight.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-widest hover:underline"
            >
              Resmi Karar Metnine Git <ExternalLink size={14} />
            </a>
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/icthat"
            className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-accent transition font-mono uppercase tracking-widest"
          >
            ← Tüm Kararlar
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <section>
      <h2 className="text-charcoal font-heading text-xl font-bold mb-3">{title}</h2>
      <p className="text-charcoal/70 leading-relaxed">{text}</p>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add "app/icthat/[id]/page.tsx"
git commit -m "feat: add /icthat/[id] analysis page route"
```

---

### Task 5: components/IcthatList.tsx + app/icthat/page.tsx

**Files:**
- Modify: `components/IcthatList.tsx`
- Modify: `app/icthat/page.tsx`

- [ ] **Step 1: Replace components/IcthatList.tsx**

The only changes vs. current: (1) add `Link` import, (2) `Item` receives `hasAnalysis: boolean` and renders "Analizi Oku →" link, (3) `Section` passes `analysisIdSet` down, (4) `IcthatList` accepts `analysisIds?: string[]` prop and builds a `Set` internally.

```tsx
// components/IcthatList.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
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

function Item({ item, hasAnalysis }: { item: DailyItem; hasAnalysis: boolean }) {
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
        <div className="flex items-center gap-4">
          {hasAnalysis && (
            <Link
              href={`/icthat/${item.id}`}
              className="text-xs text-accent font-bold tracking-widest uppercase hover:underline"
            >
              Analizi Oku →
            </Link>
          )}
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-accent font-bold tracking-widest uppercase">
              Kaynak <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Section({ sourceKey, items, analysisIdSet }: { sourceKey: keyof DailyData['items']; items: DailyItem[]; analysisIdSet: Set<string> }) {
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
        {items.map((it) => <Item key={it.id} item={it} hasAnalysis={analysisIdSet.has(it.id)} />)}
      </div>
    </section>
  );
}

export default function IcthatList({ data, analysisIds = [] }: { data: DailyData; analysisIds?: string[] }) {
  const [filter, setFilter] = useState<string>('all');
  const analysisIdSet = new Set(analysisIds);

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
            <Section key={key} sourceKey={key} items={data.items[key]} analysisIdSet={analysisIdSet} />
          ))}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Update app/icthat/page.tsx to load and pass analysisIds**

```tsx
// app/icthat/page.tsx
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { loadDaily } from '@/lib/daily-server';
import { loadAvailableAnalysisIds } from '@/lib/analysis';
import IcthatList from '@/components/IcthatList';

export const metadata: Metadata = {
  title: 'Güncel İçtihat & Mevzuat',
  description: 'Yargıtay, Anayasa Mahkemesi, AİHM kararları ve Resmî Gazete mevzuat değişikliklerinin günlük takibi.'
};

export default function IcthatPage() {
  const data = loadDaily();
  const analysisIds = loadAvailableAnalysisIds();

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
          <IcthatList data={data} analysisIds={analysisIds} />
        )}
      </main>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add components/IcthatList.tsx app/icthat/page.tsx
git commit -m "feat: show 'Analizi Oku' link on cards when analysis exists"
```

---

### Task 6: .github/workflows/daily-icthat.yml

**Files:**
- Modify: `.github/workflows/daily-icthat.yml`

- [ ] **Step 1: Add build-analysis step after Build daily.json**

Replace `.github/workflows/daily-icthat.yml` with:

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
      - uses: actions/checkout@v5

      - name: Node setup
        uses: actions/setup-node@v5
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

      - name: Build analyses
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: node scripts/build-analysis.js public/data/daily.json public/data/analyses/

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

Note: `git add public/data/` already covers `public/data/analyses/` recursively — no further change needed.

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/daily-icthat.yml
git commit -m "chore: add build-analysis step to daily workflow"
```

---

## Self-Review

**Spec coverage:**
- `scripts/lib/analysis-writer.js` — Task 1 ✓
- `scripts/build-analysis.js` — Task 2 ✓
- `public/data/analyses/[id].json` generated output — Task 2 ✓
- `app/icthat/[id]/page.tsx` — Task 4 ✓
- `lib/analysis.ts` — Task 3 ✓
- `components/IcthatList.tsx` "Analizi Oku →" link (only if analysis exists) — Task 5 ✓
- `.github/workflows/daily-icthat.yml` build-analysis step — Task 6 ✓
- SEO: `generateMetadata` with title format and description — Task 4 ✓
- Model: `claude-sonnet-4-6` — Task 1 ✓
- Language: Turkish, jargon-free — Task 1 SYSTEM prompt ✓
- 4 sections: davaSozeti, mahkemeninKarari, benimGozlemim, pratikEtki — Task 1 ✓
- JSON output format per spec — Task 1 ✓

**No gaps found.**
