/**
 * Builds static crawlable HTML for every madde:
 *   public/seo-madde/{kanunId}/{id}.html
 *
 * Why: App Router SSR was 500 on Vercel; SPA viewer gave Google empty pages.
 * These static files include unique <title>, canonical, JSON-LD, full resmi metin.
 *
 * Run: node scripts/build-seo-madde-html.mjs
 * Hooked from prebuild (Vercel + local).
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'public', 'seo-madde');
const SITE = 'https://www.avfethiguzel.com';

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function mdLite(md) {
  // Minimal markdown → HTML (#### ve altı dahil; uzun başlıklar önce)
  let t = String(md || '').replace(/\r\n/g, '\n');
  t = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // #### 2. Maddedeki Kavram → <h4>…</h4> (ham ### kalmasın)
  t = t.replace(/^######\s+(.+?)\s*#*\s*$/gm, '<h6>$1</h6>');
  t = t.replace(/^#####\s+(.+?)\s*#*\s*$/gm, '<h5>$1</h5>');
  t = t.replace(/^####\s+(.+?)\s*#*\s*$/gm, '<h4>$1</h4>');
  t = t.replace(/^###\s+(.+?)\s*#*\s*$/gm, '<h3>$1</h3>');
  t = t.replace(/^##\s+(.+?)\s*#*\s*$/gm, '<h2>$1</h2>');
  t = t.replace(/^#\s+(.+?)\s*#*\s*$/gm, '<h1>$1</h1>');
  // Satır ortasında kalmış ham #### kalıntısı
  t = t.replace(/(^|\n)\s*#{1,6}\s+/g, '$1');
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\*(.+?)\*/g, '<em>$1</em>');
  t = t.replace(/\n{2,}/g, '</p><p>');
  t = t.replace(/\n/g, '<br/>');
  return `<div class="prose">${t.startsWith('<h') ? t : `<p>${t}</p>`}</div>`;
}

function plain(md) {
  return String(md || '')
    .replace(/[#>*_`\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function loadPack(kanunId) {
  const candidates = [
    join(root, 'public', 'content-packs', `${kanunId}.json.gz`),
    join(root, 'content-packs', `${kanunId}.json.gz`),
    join(root, 'public', 'content-packs', `${kanunId}.json`),
    join(root, 'content-packs', `${kanunId}.json`),
  ];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    const buf = readFileSync(p);
    if (buf[0] === 0x1f && buf[1] === 0x8b) {
      return JSON.parse(gunzipSync(buf).toString('utf8'));
    }
    return JSON.parse(buf.toString('utf8'));
  }
  return null;
}

function listKanunIds() {
  const dirs = [
    join(root, 'public', 'content-packs'),
    join(root, 'content-packs'),
  ];
  const ids = new Set();
  for (const d of dirs) {
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d)) {
      const m = f.match(/^(.+)\.json(\.gz)?$/);
      if (m && m[1] !== 'manifest') ids.add(m[1]);
    }
  }
  return [...ids].sort();
}

function pageHtml({ kanunId, id, article, prevId, nextId }) {
  const code = kanunId.toUpperCase();
  const n = article.maddeNo;
  const kanun = article.kanun || code;
  const official = plain(article.official);
  const lead = official.replace(/^.*?Madde\s+\d+\s*[-–—:]?\s*/i, '').trim().slice(0, 130);
  // Exact-match first: "TBK 13" is how people type in Google
  const shortLead = lead.length > 12 ? lead.slice(0, 42).replace(/\s+\S*$/, '') : '';
  const title = shortLead
    ? `${code} ${n} | ${code} Madde ${n} (m. ${n}) — ${shortLead} | Av. Fethi Güzel`
    : `${code} ${n} | ${code} Madde ${n} (m. ${n}) Resmî Metin ve Şerh | Av. Fethi Güzel`;
  const description = lead
    ? `${code} ${n} / ${code} madde ${n} / ${code} m. ${n} (${kanun}): ${lead}${lead.length >= 120 ? '…' : ''} Resmî metin + akademik şerh — Av. Fethi Güzel.`
    : `${code} ${n} — ${kanun} Madde ${n} (${code} m. ${n}) resmî metni ve akademik şerh. Av. Fethi Güzel.`;
  const h1 = `${code} ${n} — ${code} Madde ${n} (${code} m. ${n})`;
  const canonical = `${SITE}/mevzuat/${kanunId}/${id}`;
  const hubUrl = `${SITE}/mevzuat/${kanunId}`;
  const officialHtml = mdLite(article.official);
  // Tam şerh — bu sayfa zaten portalın kendisi; kesme / “arşivde” notu yok
  const rawComm = String(article.commentary || '').trim();
  const commentaryHtml = rawComm
    ? mdLite(rawComm)
    : '<p>Bu madde için şerh metni henüz eklenmemiştir.</p>';

  const keywords = [
    `${code} ${n}`,
    `${code} madde ${n}`,
    `${code} m. ${n}`,
    `${code} m ${n}`,
    `${code} Madde ${n}`,
    `${kanun} madde ${n}`,
    'Av. Fethi Güzel',
    'Fethi Güzel',
    'kanun maddesi',
    'akademik şerh',
  ].join(', ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: `${code} ${n} | ${code} Madde ${n}`,
        name: `${code} Madde ${n}`,
        alternateName: [
          `${code} ${n}`,
          `${code} m. ${n}`,
          `${code} m ${n}`,
          `${code} madde ${n}`,
          `${code} Madde ${n}`,
        ],
        description: description,
        inLanguage: 'tr-TR',
        isAccessibleForFree: true,
        dateModified: new Date().toISOString().slice(0, 10),
        author: {
          '@type': 'Person',
          name: 'Av. Fethi Güzel',
          url: `${SITE}/avukat-fethi-guzel`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Av. Fethi Güzel Hukuk Portalı',
          url: SITE,
        },
        mainEntityOfPage: canonical,
        about: {
          '@type': 'Legislation',
          name: `${kanun} Madde ${n}`,
          legislationIdentifier: `${code}-${n}`,
          legislationJurisdiction: 'TR',
        },
        keywords,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Mevzuat', item: `${SITE}/mevzuat` },
          { '@type': 'ListItem', position: 3, name: code, item: hubUrl },
          { '@type': 'ListItem', position: 4, name: `${code} ${n}`, item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `${code} ${n} nedir?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: description,
            },
          },
          {
            '@type': 'Question',
            name: `${code} madde ${n} metni nerede?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${code} Madde ${n} resmî metni ve Av. Fethi Güzel akademik şerhi bu sayfada yer alır: ${canonical}`,
            },
          },
        ],
      },
    ],
  };

  const prevLink = prevId
    ? `<a href="${SITE}/mevzuat/${kanunId}/${prevId}">← Önceki madde</a>`
    : '';
  const nextLink = nextId
    ? `<a href="${SITE}/mevzuat/${kanunId}/${nextId}">Sonraki madde →</a>`
    : '';

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}"/>
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"/>
<meta name="author" content="Av. Fethi Güzel"/>
<meta name="keywords" content="${escapeHtml(keywords)}"/>
<link rel="canonical" href="${canonical}"/>
${prevId ? `<link rel="prev" href="${SITE}/mevzuat/${kanunId}/${prevId}"/>` : ''}
${nextId ? `<link rel="next" href="${SITE}/mevzuat/${kanunId}/${nextId}"/>` : ''}
<meta property="og:type" content="article"/>
<meta property="og:locale" content="tr_TR"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:title" content="${escapeHtml(title)}"/>
<meta property="og:description" content="${escapeHtml(description)}"/>
<meta property="og:site_name" content="Av. Fethi Güzel Hukuk Portalı"/>
<meta name="twitter:card" content="summary"/>
<meta name="twitter:title" content="${escapeHtml(title)}"/>
<meta name="twitter:description" content="${escapeHtml(description)}"/>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>
body{margin:0;font-family:system-ui,sans-serif;background:#F4F1EA;color:#1C1C1C;line-height:1.55}
a{color:#C45A38;text-decoration:none} a:hover{text-decoration:underline}
main{max-width:42rem;margin:0 auto;padding:2rem 1.1rem 3rem}
.badge{display:inline-block;padding:.25rem .7rem;border-radius:999px;background:rgba(196,90,56,.12);color:#C45A38;font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.box{border-radius:1.1rem;padding:1.25rem 1.35rem;margin:1rem 0}
.off{background:linear-gradient(135deg,#2E4036,#24352c);color:#FFFEFA}
.com{background:#FFFEFA;border:1px solid rgba(0,0,0,.08)}
h1{font-size:1.55rem;line-height:1.25;margin:.4rem 0 0;font-weight:800}
.prose h2,.prose h3,.prose h4,.prose h5,.prose h6{font-weight:700;line-height:1.3;margin:1.15rem 0 .45rem;color:#1C1C1C}
.prose h2{font-size:1.15rem}.prose h3{font-size:1.05rem}.prose h4{font-size:1rem;color:#2a2a2a}
.prose h5,.prose h6{font-size:.95rem;color:#333}
.prose p{margin:.55rem 0}.prose strong{font-weight:700}
.muted{color:rgba(28,28,28,.55);font-size:.9rem}
.nav{font-size:.8rem;color:rgba(28,28,28,.5);margin-bottom:1rem}
.pager{display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;margin:1.25rem 0;font-size:.9rem;font-weight:600}
.aliases{font-size:.85rem;color:rgba(28,28,28,.62);margin:.6rem 0 0}
</style>
</head>
<body>
<main>
<nav class="nav" aria-label="Konum">
<a href="${SITE}/">Ana Sayfa</a> ·
<a href="${SITE}/mevzuat">Mevzuat</a> ·
<a href="${hubUrl}">${code}</a> ·
<strong>${code} ${n}</strong>
</nav>
<p class="badge">${escapeHtml(kanun)} · ${code} ${n}</p>
<h1>${escapeHtml(h1)}</h1>
<p class="aliases">
Arama adları: <strong>${code} ${n}</strong> · <strong>${code} madde ${n}</strong> ·
<strong>${code} m. ${n}</strong> · <strong>${code} m ${n}</strong>
— <strong>Av. Fethi Güzel</strong> Hukuk Portalı
</p>
<p class="muted" style="margin-top:.75rem">
${code} ${n} maddesinin resmî hükmü ve akademik şerhi bu sayfadadır.
Kanun maddesi araması için: «${code} ${n}», «${code} madde ${n}», «${code} m. ${n}».
</p>
<div class="pager">${prevLink}<span></span>${nextLink}</div>
<section class="box off">
<p style="font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;opacity:.85;margin:0 0 .75rem">Resmî metin — ${code} ${n} / ${code} Madde ${n}</p>
<article>${officialHtml}</article>
</section>
<section class="box com">
<h2 style="font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:#C45A38;margin:0 0 .75rem">Akademik yorum — ${code} ${n} şerhi (Av. Fethi Güzel)</h2>
<article>${commentaryHtml}</article>
</section>
<aside class="muted" style="font-size:.8rem;margin-top:1.5rem">
Kaynak ve uyarı: Bilgilendirme amaçlıdır; Resmî Gazete / mevzuat.gov.tr esas alınmalıdır.
Şerh akademik niteliktedir. Google arama: ${code} ${n}, ${code} madde ${n}, Fethi Güzel.
</aside>
<p style="margin-top:1.25rem;font-size:.9rem">
<a href="${hubUrl}">← Tüm ${code} maddeleri</a> ·
<a href="${SITE}/mevzuat">Mevzuat bankası</a> ·
<a href="${SITE}/bilgi">Vatandaş rehberi</a> ·
<a href="${SITE}/ara?q=${encodeURIComponent(code + ' ' + n)}">Ara: ${code} ${n}</a> ·
<a href="${SITE}/avukat-fethi-guzel">Av. Fethi Güzel</a>
</p>
<div class="pager">${prevLink}<span></span>${nextLink}</div>
</main>
</body>
</html>`;
}

// Clean output dir for idempotent builds
if (existsSync(OUT)) {
  rmSync(OUT, { recursive: true, force: true });
}
mkdirSync(OUT, { recursive: true });

const kanunIds = listKanunIds();
let pages = 0;
let failed = 0;

const t0 = Date.now();
for (const kanunId of kanunIds) {
  let pack;
  try {
    pack = loadPack(kanunId);
  } catch (e) {
    console.warn('[seo-madde] pack fail', kanunId, e.message);
    failed++;
    continue;
  }
  if (!pack) {
    console.warn('[seo-madde] missing pack', kanunId);
    failed++;
    continue;
  }
  const dir = join(OUT, kanunId);
  mkdirSync(dir, { recursive: true });
  const entries = Object.entries(pack)
    .filter(([, article]) => article && typeof article.maddeNo === 'number')
    .sort((a, b) => a[1].maddeNo - b[1].maddeNo);
  for (let i = 0; i < entries.length; i++) {
    const [id, article] = entries[i];
    const prevId = i > 0 ? entries[i - 1][0] : null;
    const nextId = i < entries.length - 1 ? entries[i + 1][0] : null;
    const html = pageHtml({ kanunId, id, article, prevId, nextId });
    writeFileSync(join(dir, `${id}.html`), html, 'utf8');
    pages++;
  }
  // free
  pack = null;
}

const sec = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`[seo-madde] wrote ${pages} pages for ${kanunIds.length} kanun in ${sec}s (fail packs: ${failed})`);
console.log(`[seo-madde] out=${OUT}`);
if (pages < 100) {
  console.error('[seo-madde] too few pages — aborting build signal');
  process.exit(1);
}
