/**
 * Bölge denemesi derinlik barı.
 * Run:
 *   node scripts/verify-bolge-deep.mjs
 *   node scripts/verify-bolge-deep.mjs --slug=van-golu-havzasi-tasinmaz-ve-miras-hukuku
 *   node scripts/verify-bolge-deep.mjs --require-all
 * Env VERIFY_OUT / VERIFY_SLUG_OUT for evidence paths.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const dataPath = join(root, 'lib/bolge-makaleler/data.ts');
const publicRoot = join(root, 'public');

const QUEUE = [
  'van-golu-havzasi-tasinmaz-ve-miras-hukuku',
  'van-2011-depremi-sozlesme-ve-konut-hukuku',
  'ahlat-vakif-miras-ve-tarihi-tasinmazlar',
  'caldiran-tarimsal-tasinmaz-kadastro-ve-nufus',
  'bitlis-miras-paydasligi-ve-daglik-tasinmaz',
  'tatvan-ticaret-kira-ve-ulastirma-hukuku',
  'adilcevaz-gol-kiyisi-mulkiyet-ve-miras',
  'agri-sinir-bolgesi-tasinmaz-miras-ve-idare',
  'patnos-icra-tarimsal-alacak-ve-nufus',
  'muradiye-aile-miras-ve-nufus-olaylari',
  'ercis-nufus-veraset-tapu-intikali',
  'dogu-anadolu-el-birligi-mulkiyet-ve-miras-pratikleri',
];

const HIRE_RE =
  /avukat\s*ara|hemen\s*ara|bizi\s*aray[ıi]n|ücretsiz\s*görüşme|randevu\s*al[ıi]n|en\s*iyi\s*avukat|X avukat|yerel\s*avukat\s*bul|şimdi\s*iletişime/i;

function loadMakaleler() {
  const src = readFileSync(dataPath, 'utf8');
  const re = /export const BOLGE_MAKALELER(?::[^=]+)?=\s*(\[[\s\S]*?\n\]);/;
  const m = src.match(re);
  if (!m) throw new Error('Cannot parse BOLGE_MAKALELER');
  // data.ts uses UPDATED constant inside the array literal
  const updatedMatch = src.match(/const UPDATED\s*=\s*['"]([^'"]+)['"]/);
  const UPDATED = updatedMatch ? updatedMatch[1] : '2026-08-05';
  return new Function('UPDATED', `return (${m[1]});`)(UPDATED);
}

function publicExists(src) {
  if (!src) return false;
  if (src.startsWith('http')) return true;
  const rel = src.startsWith('/') ? src.slice(1) : src;
  return existsSync(join(publicRoot, rel));
}

function score(m) {
  const fails = [];
  if (!m) {
    return { ok: false, fails: ['missing entry'], stats: {} };
  }
  const secs = m.sections || [];
  if (secs.length < 6) fails.push(`sections ${secs.length} < 6`);
  const multiPara = secs.filter((s) => (s.paragraphs || []).length >= 2).length;
  if (multiPara < 4) fails.push(`multi-para sections ${multiPara} < 4`);

  const body = [
    m.lead,
    m.h1,
    m.description,
    ...secs.flatMap((s) => [s.heading, ...(s.paragraphs || []), ...(s.bullets || []), s.callout?.body || '']),
    ...(m.faq || []).flatMap((f) => [f.q, f.a]),
  ].join('\n');

  if (HIRE_RE.test(body) || HIRE_RE.test((m.keywords || []).join(' '))) {
    fails.push('hire/soft-CTA pattern');
  }

  if (!m.heroPhoto?.src || !publicExists(m.heroPhoto.src)) {
    fails.push(`heroPhoto missing on disk: ${m.heroPhoto?.src}`);
  }
  const extraPhoto =
    (m.photos || []).some((p) => publicExists(p.src)) ||
    secs.some((s) => s.photo?.src && publicExists(s.photo.src));
  if (!extraPhoto) fails.push('no extra photo (photos[] or section.photo) on disk');

  if (!(m.graphics || []).length) fails.push('graphics empty');

  const faqN = (m.faq || []).length;
  // All reader-facing paragraphs (for de-dup + length)
  const paraList = [
    m.lead,
    ...secs.flatMap((s) => [...(s.paragraphs || []), ...(s.bullets || []), s.callout?.body].filter(Boolean)),
    ...(m.faq || []).flatMap((f) => [f.q, f.a]),
  ].filter((p) => typeof p === 'string' && p.trim());

  function normPara(p) {
    return p
      .toLocaleLowerCase('tr')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  /** Fingerprint: drop short place tokens so "van golu hattında" vs "ahlat vakif hattında" still collide */
  function finger(p) {
    return normPara(p)
      .split(' ')
      .filter((w) => w.length > 3)
      .filter((w) => !/^(van|golu|gölü|ahlat|bitlis|tatvan|erciş|ercis|ağrı|agri|patnos|muradiye|çaldıran|caldiran|adilcevaz|anadolu|hattında|hattinda)$/i.test(w))
      .join(' ');
  }

  const rawWords = paraList.join(' ').split(/\s+/).filter(Boolean).length;
  // Unique-paragraph word sum (first occurrence only)
  const seen = new Map(); // finger -> word count of first
  let dupHeavy = 0; // paras ≥50 words appearing ≥3 times
  const fingerCounts = new Map();
  for (const p of paraList) {
    const f = finger(p);
    const wc = p.split(/\s+/).filter(Boolean).length;
    fingerCounts.set(f, (fingerCounts.get(f) || 0) + 1);
    if (!seen.has(f)) seen.set(f, wc);
  }
  for (const [f, c] of fingerCounts) {
    const wc = seen.get(f) || 0;
    if (wc >= 50 && c >= 3) dupHeavy++;
  }
  const uniqueWords = [...seen.values()].reduce((a, b) => a + b, 0);
  const wordish = uniqueWords; // length gate uses UNIQUE prose only

  if (dupHeavy > 0) {
    fails.push(`duplicate long paragraphs (≥50 words appearing ≥3×): ${dupHeavy}`);
  }
  // Any exact-norm paragraph ≥50 words repeated ≥3 times (even with place token swap) already covered;
  // also fail if raw/unique ratio shows heavy padding
  if (rawWords > 0 && uniqueWords / rawWords < 0.75 && rawWords - uniqueWords > 300) {
    fails.push(
      `pad inflation: uniqueWords ${uniqueWords} / rawWords ${rawWords} = ${(uniqueWords / rawWords).toFixed(2)}`
    );
  }

  if (faqN > 0 && faqN < 3) fails.push(`faq ${faqN} (need ≥3 or 0 with long prose)`);
  if (faqN === 0 && wordish < 1800) fails.push('no faq and prose too short for exception');

  const okuma = m.okumaDk || 0;
  if (okuma < 16) fails.push(`okumaDk ${okuma} < 16`);

  // Honest length on UNIQUE words only
  const minWords = Math.max(1800, Math.round(okuma * 120));
  if (wordish < minWords) {
    fails.push(
      `uniqueWords ${wordish} < min ${minWords} for okumaDk=${okuma} (raw=${rawWords}; need real longform)`
    );
  }
  const maxHonestDk = Math.max(1, Math.ceil(wordish / 100));
  if (okuma > maxHonestDk) {
    fails.push(`okumaDk ${okuma} > honest ceiling ${maxHonestDk} for uniqueWords ${wordish}`);
  }

  // Real multi-paragraph depth: ≥6 sections with ≥3 paragraphs each for at least 5 sections
  const triplePara = secs.filter((s) => (s.paragraphs || []).length >= 3).length;
  if (triplePara < 5) fails.push(`sections with ≥3 paragraphs: ${triplePara} < 5`);

  // place-specific: yerlesim token or distinctive markers in body
  const place = (m.yerlesim || '').toLocaleLowerCase('tr');
  if (place && !body.toLocaleLowerCase('tr').includes(place.split(' ')[0].toLocaleLowerCase('tr'))) {
    // Doğu Anadolu / bölgesel may use different markers
    if (m.slug !== 'dogu-anadolu-el-birligi-mulkiyet-ve-miras-pratikleri') {
      fails.push(`place marker "${m.yerlesim}" weak in body`);
    }
  }

  if ((m.related || []).some((r) => /avukat/i.test(r.href) && !/bolge-yazi|mevzuat|bilgi/.test(r.href))) {
    fails.push('related points to avukat landing');
  }

  const stats = {
    sections: secs.length,
    multiPara,
    triplePara,
    faq: faqN,
    graphics: (m.graphics || []).length,
    okumaDk: m.okumaDk,
    words: wordish,
    rawWords,
    uniqueWords,
    minWords,
    hero: m.heroPhoto?.src,
    extraPhoto: !!extraPhoto,
  };
  return { ok: fails.length === 0, fails, stats };
}

const args = process.argv.slice(2);
const slugArg = (args.find((a) => a.startsWith('--slug=')) || '').split('=')[1];
const requireAll = args.includes('--require-all');
const onlyDeep = args.includes('--only-deep'); // report who passes

const all = loadMakaleler();
const bySlug = Object.fromEntries(all.map((m) => [m.slug, m]));

// ensure all queue slugs exist
const missingQueue = QUEUE.filter((s) => !bySlug[s]);
const lines = [];
const log = (s) => lines.push(s);

if (missingQueue.length) {
  log(`FAIL missing queue slugs: ${missingQueue.join(', ')}`);
}

const targets = slugArg ? [slugArg] : requireAll ? QUEUE : QUEUE;

let passN = 0;
const results = [];
for (const slug of targets) {
  const r = score(bySlug[slug]);
  results.push({ slug, ...r });
  if (r.ok) {
    passN++;
    log(
      `PASS ${slug} sections=${r.stats.sections} triplePara=${r.stats.triplePara} uniqueWords=${r.stats.uniqueWords} rawWords=${r.stats.rawWords} minWords=${r.stats.minWords} okumaDk=${r.stats.okumaDk}`
    );
  } else {
    log(
      `FAIL ${slug} unique=${r.stats?.uniqueWords ?? '?'} raw=${r.stats?.rawWords ?? '?'} okumaDk=${r.stats?.okumaDk ?? '?'}: ${r.fails.join('; ')}`
    );
  }
}

// full queue deep count
let deepAll = 0;
for (const slug of QUEUE) {
  if (score(bySlug[slug]).ok) deepAll++;
}
log('');
log(`deep_count ${deepAll}/12`);
log(`queue_intact ${QUEUE.every((s) => bySlug[s])}`);
log(`total_makaleler ${all.length}`);

// no new avukat landings in related of any
let avukatRelated = 0;
for (const m of all) {
  for (const r of m.related || []) {
    if (/\/[a-z0-9-]+-avukat$/.test(r.href)) avukatRelated++;
  }
}
log(`avukat_related_links ${avukatRelated}`);

const out = lines.join('\n');
console.log(out);

if (process.env.VERIFY_OUT) {
  writeFileSync(process.env.VERIFY_OUT, out + '\n', 'utf8');
}
if (process.env.VERIFY_SLUG_OUT && slugArg) {
  const r = results[0];
  writeFileSync(
    process.env.VERIFY_SLUG_OUT,
    JSON.stringify({ slug: slugArg, ...r, at: new Date().toISOString() }, null, 2),
    'utf8'
  );
}

const claimed = slugArg ? results : requireAll ? results : results.filter((r) => r.ok);
// exit: if --slug, that slug must pass; if --require-all, all 12; else exit 0 if at least parsing works and print status
if (slugArg) {
  process.exit(results[0]?.ok && avukatRelated === 0 ? 0 : 1);
}
if (requireAll) {
  process.exit(deepAll === 12 && avukatRelated === 0 && missingQueue.length === 0 ? 0 : 1);
}
// default: informational, fail only if parse/missing queue
process.exit(missingQueue.length === 0 ? 0 : 1);
