/**
 * Live Googlebot-style quality probe for one kanun hub + representative maddeler.
 * Usage: node scripts/probe-kanun-seo.mjs tbk [out.json]
 * Exit 0 only if hub + all sample maddeler pass gates.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import {
  representativeMaddeIds,
  PRIORITY_MADDE_BY_KANUN,
  KANUN_SEO_ORDER,
  assertCoreFirstOrder,
} from './lib/kanun-seo-order.mjs';

const HOST = 'https://www.avfethiguzel.com';
const UA =
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const STUB_RE =
  /portal\s+ar[sş]ivinde|tam\s+[şs]erh\s+portal|devam[ıi]\s+portal|bilgilendirme ama[cç]l[ıi]\s+[öo]zet\s+[şs]erh/i;
const RAW_HASH_RE = /####\s+\d|####\s+[A-Za-zÇĞİÖŞÜçğıöşü]/

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const kanunId = String(process.argv[2] || '')
  .toLowerCase()
  .replace(/[^a-z0-9-]/g, '');
const outPath = process.argv[3] || null;

if (!kanunId) {
  console.error('Usage: node scripts/probe-kanun-seo.mjs <kanunId> [out.json]');
  process.exit(2);
}

assertCoreFirstOrder(KANUN_SEO_ORDER);

function loadPackKeys(id) {
  const candidates = [
    join(root, 'public', 'content-packs', `${id}.json.gz`),
    join(root, 'content-packs', `${id}.json.gz`),
  ];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    const buf = readFileSync(p);
    const text =
      buf[0] === 0x1f && buf[1] === 0x8b
        ? gunzipSync(buf).toString('utf8')
        : buf.toString('utf8');
    const pack = JSON.parse(text);
    return { path: p, keys: Object.keys(pack), pack };
  }
  return null;
}

function pickExistingMaddeIds(id) {
  const loaded = loadPackKeys(id);
  const wanted = representativeMaddeIds(id);
  if (!loaded) return { wanted, existing: wanted, packInfo: null };
  const keySet = new Set(loaded.keys.map((k) => k.toLowerCase()));
  const existing = [];
  for (const mid of wanted) {
    if (keySet.has(mid) || keySet.has(mid.replace('madde-', 'Madde-'))) {
      existing.push(mid);
    }
  }
  // fill from pack if pack missing some probe ids
  if (existing.length < 3) {
    const nums = (PRIORITY_MADDE_BY_KANUN[id] || [1, 2, 5, 10])
      .map((n) => `madde-${n}`)
      .filter((k) => keySet.has(k));
    for (const k of nums) {
      if (!existing.includes(k)) existing.push(k);
      if (existing.length >= 3) break;
    }
  }
  if (existing.length < 3) {
    for (const k of loaded.keys) {
      if (/^madde-\d+/i.test(k) && !existing.includes(k.toLowerCase())) {
        existing.push(k.toLowerCase());
      }
      if (existing.length >= 3) break;
    }
  }
  return {
    wanted,
    existing: existing.slice(0, 5),
    packInfo: { path: loaded.path, articleCount: loaded.keys.length },
  };
}

function fetchUrl(url) {
  return fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'text/html,application/xml,*/*' },
    redirect: 'follow',
  }).then(async (res) => {
    const body = await res.text();
    const title = (body.match(/<title[^>]*>([^<]*)/i) || [])[1] || '';
    const robots =
      (body.match(/name=["']robots["'][^>]*content=["']([^"']+)/i) ||
        [])[1] || '';
    const canon =
      (body.match(/rel=["']canonical["'][^>]*href=["']([^"']+)/i) || [])[1] ||
      '';
    const h4 = (body.match(/<h4[\s>]/gi) || []).length;
    return {
      url,
      status: res.status,
      len: body.length,
      title: title.slice(0, 120),
      robots,
      canon,
      noindex: /noindex/i.test(robots) || /noindex/i.test(body.slice(0, 4000)),
      hasStub: STUB_RE.test(body),
      hasRawHash: RAW_HASH_RE.test(body),
      h4Count: h4,
    };
  });
}

function passPage(p, { isMadde = false } = {}) {
  const reasons = [];
  if (p.status !== 200) reasons.push(`status ${p.status}`);
  if (p.noindex) reasons.push('noindex');
  if (p.hasStub) reasons.push('archive-stub');
  if (p.hasRawHash) reasons.push('raw-####');
  if (isMadde) {
    // Full şerh smoke: TBK m.13 baseline ~40k; allow shorter for short articles
    if (p.len < 8000) reasons.push(`short-body ${p.len}`);
    // Prefer real headings over raw markdown
    if (p.hasRawHash) reasons.push('hash-heading');
  } else {
    if (p.len < 2000) reasons.push(`hub-short ${p.len}`);
  }
  return { ok: reasons.length === 0, reasons };
}

const { existing, wanted, packInfo } = pickExistingMaddeIds(kanunId);
const hubUrl = `${HOST}/mevzuat/${kanunId}`;
const maddeUrls = existing.map((id) => `${HOST}/mevzuat/${kanunId}/${id}`);

const hub = await fetchUrl(hubUrl);
const hubGate = passPage(hub, { isMadde: false });
const maddeler = [];
for (const u of maddeUrls) {
  const p = await fetchUrl(u);
  const gate = passPage(p, { isMadde: true });
  maddeler.push({ ...p, ...gate });
}

const allMaddeOk = maddeler.every((m) => m.ok);
const ok = hubGate.ok && allMaddeOk && maddeler.length >= 3;

const report = {
  at: new Date().toISOString(),
  kanunId,
  ok,
  hub: { ...hub, ...hubGate },
  wantedMadde: wanted,
  probedMadde: existing,
  packInfo,
  maddeler,
  priorityMaddeCount: (PRIORITY_MADDE_BY_KANUN[kanunId] || []).length,
};

const text = JSON.stringify(report, null, 2);
if (outPath) {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, text, 'utf8');
  console.log(`[probe-kanun-seo] wrote ${outPath}`);
}
console.log(
  `[probe-kanun-seo] ${kanunId} ok=${ok} hub=${hub.status}/${hub.len} maddeler=${maddeler.map((m) => `${m.status}:${m.len}:${m.ok ? 'pass' : m.reasons.join('+')}`).join(' | ')}`
);
process.exit(ok ? 0 : 1);
