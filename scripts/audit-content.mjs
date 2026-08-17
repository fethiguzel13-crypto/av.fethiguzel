#!/usr/bin/env node
/**
 * Tüm içerik kümelerini kalıp metin bakımından denetler ve rapor üretir.
 *
 *   node scripts/audit-content.mjs              # özet
 *   node scripts/audit-content.mjs --json       # data/content-audit.json yaz
 *   node scripts/audit-content.mjs --list=tmk   # bir kanunun madde madde hükmü
 *
 * Çıktı, sitede hangi sayfaların gizleneceğini/noindex alacağını belirleyen
 * lib/content-quality.mjs ile AYNI mantığı kullanır; rapor ile sitenin
 * davranışı arasında sapma olmaz.
 */
import { gunzipSync } from 'node:zlib';
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  auditCommentary,
  auditGuide,
  auditLectureNote,
  hasRealCaseLaw,
} from '../lib/content-quality.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const wantJson = args.includes('--json');
const listArg = (args.find((a) => a.startsWith('--list=')) || '').split('=')[1];

const summary = { generatedAt: new Date().toISOString(), mevzuat: {}, rehber: {}, dersNotlari: {} };

// ─── 1. Mevzuat şerhleri ─────────────────────────────────────────────────────
function auditMevzuat() {
  const dir = join(root, 'content-packs');
  if (!existsSync(dir)) return console.log('content-packs yok, atlandı.');

  const files = readdirSync(dir).filter((f) => f.endsWith('.json.gz'));
  const rows = [];
  let total = 0;
  let publishable = 0;
  let withCaseLaw = 0;
  const flaggedByKanun = {};

  for (const file of files) {
    const kanunId = file.replace('.json.gz', '');
    const pack = JSON.parse(gunzipSync(readFileSync(join(dir, file))));
    const entries = Object.entries(pack);
    let ok = 0;
    const bad = [];

    for (const [key, art] of entries) {
      const r = auditCommentary(kanunId, art?.commentary || '');
      total += 1;
      if (r.publishable) {
        ok += 1;
        publishable += 1;
        if (hasRealCaseLaw(art?.commentary || '')) withCaseLaw += 1;
      } else {
        bad.push({ key, verdict: r.verdict, hits: r.hits });
      }
    }

    flaggedByKanun[kanunId] = bad.map((b) => b.key);
    rows.push({ kanunId, articles: entries.length, ok, flagged: bad.length });

    if (listArg === kanunId) {
      console.log(`\n── ${kanunId} madde hükümleri ──`);
      for (const b of bad.slice(0, 40)) console.log(`  ${b.verdict.padEnd(9)} ${b.key} (${b.hits} parmak izi)`);
      if (bad.length > 40) console.log(`  … ve ${bad.length - 40} madde daha`);
    }
  }

  rows.sort((a, b) => b.flagged - a.flagged);
  console.log('\n═══ MEVZUAT ŞERHLERİ ═══');
  console.log(`toplam madde: ${total}`);
  console.log(`yayınlanabilir: ${publishable} (%${((publishable / total) * 100).toFixed(1)})`);
  console.log(`gerçek emsal karar içeren: ${withCaseLaw}`);
  console.log(`\n${'kanun'.padEnd(26)}${'madde'.padStart(7)}${'temiz'.padStart(7)}${'kalıp'.padStart(7)}`);
  for (const r of rows) {
    console.log(`${r.kanunId.padEnd(26)}${String(r.articles).padStart(7)}${String(r.ok).padStart(7)}${String(r.flagged).padStart(7)}`);
  }

  summary.mevzuat = { total, publishable, withCaseLaw, byKanun: rows, flaggedByKanun };
}

// ─── 2. Vatandaş rehberi ─────────────────────────────────────────────────────
function auditRehber() {
  const file = join(root, 'lib', 'vatandas-rehberi', 'data.ts');
  if (!existsSync(file)) return console.log('vatandas-rehberi yok, atlandı.');

  const raw = readFileSync(file, 'utf8');
  const decl = raw.indexOf('VATANDAS_ARTICLES');
  const start = raw.indexOf('= [', decl) + 2;
  const end = raw.indexOf('\n];', start);
  const articles = JSON.parse(raw.slice(start, end + 2));

  const flagged = [];
  let ok = 0;
  for (const a of articles) {
    const r = auditGuide(a);
    if (r.publishable) ok += 1;
    else flagged.push(a.slug);
  }

  console.log('\n═══ VATANDAŞ REHBERİ ═══');
  console.log(`toplam: ${articles.length}, yayınlanabilir: ${ok}, kalıp: ${flagged.length}`);
  summary.rehber = { total: articles.length, publishable: ok, flagged };
}

// ─── 3. Ders notları ─────────────────────────────────────────────────────────
function auditDersNotlari() {
  const dir = join(root, 'lib', 'ders-notlari', 'generated', 'notes');
  if (!existsSync(dir)) return console.log('ders-notlari yok, atlandı.');

  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  const flagged = [];
  let ok = 0;
  for (const f of files) {
    const note = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    const r = auditLectureNote(note);
    if (r.publishable) ok += 1;
    else flagged.push(f.replace('.json', ''));
  }

  console.log('\n═══ DERS NOTLARI ═══');
  console.log(`toplam: ${files.length}, yayınlanabilir: ${ok}, kalıp: ${flagged.length}`);
  summary.dersNotlari = { total: files.length, publishable: ok, flaggedCount: flagged.length };
}

auditMevzuat();
auditRehber();
auditDersNotlari();

if (wantJson) {
  const out = join(root, 'data', 'content-audit.json');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(summary, null, 2));
  console.log(`\n→ ${out}`);
}

const totalFlagged =
  (summary.mevzuat.total ?? 0) -
  (summary.mevzuat.publishable ?? 0) +
  (summary.rehber.flagged?.length ?? 0) +
  (summary.dersNotlari.flaggedCount ?? 0);

console.log(`\nToplam yayından kaldırılması gereken belge: ${totalFlagged}`);
