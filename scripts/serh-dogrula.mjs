#!/usr/bin/env node
/**
 * Şerh denetimi — yazılan şerh yayımlanabilir mi?
 *
 *   node scripts/serh-dogrula.mjs tmk 166
 *   node scripts/serh-dogrula.mjs tmk           # kanunun tamamı
 *
 * Dört ayrı kapıdan geçirir:
 *
 *   1. KALIP        — lib/content-quality.mjs kalıp metin denetimi
 *   2. KÜNYE        — metindeki her Yargıtay künyesi yerel arşivde var mı?
 *   3. ÇAPRAZ ATIF  — anılan madde numaraları o kanunda gerçekten var mı?
 *   4. ÜSLUP        — staccato, parantez içi yabancı karşılık, kalıp tekrarı
 *
 * İkinci kapı bu betiğin asıl sebebidir. Akademik şerhte en ağır kusur
 * uydurma künyedir; okuyucu bir kararı arayıp bulamadığında metnin tamamına
 * olan güven gider. Künyeler yerel korpusla karşılaştırılarak denetlenir.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { auditCommentary } from '../lib/content-quality.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const kanunId = (process.argv[2] || '').toLowerCase();
const maddeArg = process.argv[3];

if (!kanunId) {
  console.error('Kullanım: node scripts/serh-dogrula.mjs <kanunId> [maddeNo]');
  process.exit(1);
}

// ── Yerel künye kümesi ──────────────────────────────────────────────────────
const kunyeler = new Set();
const indexYolu = join(root, 'data', 'yargi-kararlari', 'index.jsonl');
if (existsSync(indexYolu)) {
  for (const satir of readFileSync(indexYolu, 'utf8').split('\n')) {
    if (!satir.trim()) continue;
    try {
      const r = JSON.parse(satir);
      if (r.kunye) kunyeler.add(normalizeKunye(r.kunye));
    } catch {
      /* bozuk satır atlanır */
    }
  }
}

/** «Yargıtay 2. HD, E. 2020/1, K. 2021/2, T. 01.01.2021» → karşılaştırılabilir biçim */
function normalizeKunye(s) {
  return String(s || '')
    .replace(/\s+/g, ' ')
    .replace(/[.,]/g, '')
    .toLocaleLowerCase('tr-TR')
    .trim();
}

/** Kanunun gerçek madde numaraları */
function maddeKumesi(id) {
  const d = join(root, 'content', 'mevzuat', id);
  if (!existsSync(d)) return new Set();
  return new Set(
    readdirSync(d)
      .map((f) => /^madde-(\d+)\.md$/.exec(f))
      .filter(Boolean)
      .map((m) => Number(m[1]))
  );
}

const gecerliMaddeler = maddeKumesi(kanunId);

// ── Denetim ─────────────────────────────────────────────────────────────────
const RE_KUNYE =
  /\(?\s*(Yargıtay [^,()]{3,60}?,\s*E\.\s*\d{4}\/\d+,\s*K\.\s*\d{4}\/\d+,\s*T\.\s*\d{2}\.\d{2}\.\d{4})\s*\)?/g;
const RE_MADDE_ATIF = /\bm\.\s*(\d{1,4})\b|\b(\d{1,4})\.\s*madde(?:si|sine|sinde|siyle)?\b/g;
const YABANCI_GLOSS = /\(([A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß\s-]{3,50})\)/g;

function denetle(no) {
  const yol = join(root, 'content', 'mevzuat', kanunId, `madde-${no}.md`);
  if (!existsSync(yol)) return null;
  const s = readFileSync(yol, 'utf8');
  const bas = s.indexOf('### Akademik Yorum');
  if (bas < 0) return { no, durum: 'şerh yok' };

  const serh = s.slice(bas);
  const bulgular = [];

  // 1. Kalıp metin
  const kalip = auditCommentary(kanunId, serh);
  if (!kalip.publishable) {
    bulgular.push(`kalıp metin (${kalip.hits} eşleşme) — yayımlanamaz`);
  }

  // 2. Künye doğrulaması
  let kunyeSayisi = 0;
  for (const m of serh.matchAll(RE_KUNYE)) {
    kunyeSayisi += 1;
    if (kunyeler.size && !kunyeler.has(normalizeKunye(m[1]))) {
      bulgular.push(`YEREL ARŞİVDE YOK: ${m[1]}`);
    }
  }

  // 3. Çapraz atıf
  //
  // Yalnız KENDİ kanununa yapılan atıflar denetlenir. Başka bir kanuna ya da
  // yabancı bir koda yapılan atıf, metinde o kanunun adıyla birlikte geçer.
  // Önceki sürüm yalnız 40 karakter geriye bakıyordu ve «TMK m. 988, m. 1023»
  // gibi virgülle sıralanmış göndermelerin ikincisini, «Code Civil m. 1290»
  // gibi yabancı kod atıflarını kendi kanununa yapılmış sanıp uydurma
  // sayıyordu. Üç yanlış alarmın üçü de böyle doğdu.
  const YABANCI_KOD =
    /(Code\s+Civil|Code\s+de|BGB|OR|ZGB|HGB|ZPO|StGB|Codice|Obligationenrecht|Zivilgesetzbuch)/i;
  const BASKA_KANUN =
    /\b(TMK|TTK|HMK|CMK|[İI]{2}K|TCK|HUMK|CMUK|MK|BK|[İI]YUK|VUK|KVKK|SPK|TKHK|KTK|AY|Anayasa|Kanunu|Kanunun|Kanununun|say[ıi]l[ıi])\b/i;

  if (gecerliMaddeler.size) {
    for (const m of serh.matchAll(RE_MADDE_ATIF)) {
      const n = Number(m[1] || m[2]);
      if (!Number.isFinite(n) || n < 1) continue;

      // Geniş bakış: aynı cümle içinde başka bir kanun adı geçiyorsa
      // gönderme o kanunadır.
      const oncesi = serh.slice(Math.max(0, m.index - 140), m.index);
      const cumleBasi = oncesi.lastIndexOf('.') + 1;
      const baglam = oncesi.slice(cumleBasi);
      if (YABANCI_KOD.test(baglam) || BASKA_KANUN.test(baglam)) continue;

      if (!gecerliMaddeler.has(n)) {
        bulgular.push(`OLMAYAN MADDE: m.${n}`);
      }
    }
  }

  // 4. Üslup
  const paragraflar = serh
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#') && !l.startsWith('---'));

  for (const p of paragraflar) {
    for (const g of p.matchAll(YABANCI_GLOSS)) {
      if (/kurmaca|m\.\s*\d|md\.|bkz/i.test(g[0])) continue;
      bulgular.push(`parantez içi yabancı karşılık: ${g[0]}`);
    }
    const nv = (p.match(/;/g) || []).length;
    if (nv > 2) bulgular.push(`paragrafta ${nv} noktalı virgül`);
    const olup = (p.match(/\bolup\b/g) || []).length - (p.match(/olup olmad/g) || []).length;
    if (olup > 1) bulgular.push(`paragrafta «olup» ${olup} kez`);
  }

  // Staccato: art arda 3+ kısa cümle
  for (const p of paragraflar) {
    const cumleler = p
      .replace(/\b(m|md|vd|s|E|K|T)\./g, '$1<D>')
      .replace(/(\d)\./g, '$1<D>')
      .split(/(?<=[.!?])\s+/)
      .map((x) => x.trim())
      .filter(Boolean);
    let ard = 0;
    for (const c of cumleler) {
      ard = c.split(/\s+/).length < 10 ? ard + 1 : 0;
      if (ard >= 3) {
        bulgular.push('staccato: art arda 3+ kısa cümle');
        break;
      }
    }
  }

  const kelime = serh.split(/\s+/).length;
  return { no, durum: bulgular.length ? 'kusurlu' : 'temiz', kunyeSayisi, kelime, bulgular };
}

const hedefler = maddeArg
  ? [Number(maddeArg)]
  : [...gecerliMaddeler].sort((a, b) => a - b);

let temiz = 0;
let kusurlu = 0;
let serhsiz = 0;

for (const no of hedefler) {
  const r = denetle(no);
  if (!r) continue;
  if (r.durum === 'şerh yok') {
    serhsiz += 1;
    if (maddeArg) console.log(`m.${no}: şerh yok`);
    continue;
  }
  if (r.durum === 'temiz') {
    temiz += 1;
    console.log(`✓ m.${r.no}  ${r.kelime} kelime · ${r.kunyeSayisi} künye doğrulandı`);
  } else {
    kusurlu += 1;
    console.log(`✗ m.${r.no}  ${r.kelime} kelime`);
    for (const b of [...new Set(r.bulgular)].slice(0, 8)) console.log(`    ${b}`);
  }
}

console.log('');
console.log(`temiz ${temiz} · kusurlu ${kusurlu} · şerhsiz ${serhsiz}`);
if (!kunyeler.size) {
  console.log('UYARI: yerel karar arşivi okunamadı — künye doğrulaması yapılmadı.');
}
process.exit(kusurlu > 0 ? 1 : 0);
