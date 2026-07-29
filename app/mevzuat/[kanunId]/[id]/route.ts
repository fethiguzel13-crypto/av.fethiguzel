/**
 * Madde SEO HTML — Node runtime (not Edge).
 *
 * Why Node: full packs are ~25MB uncompressed (TBK); Edge OOMs on gunzip+parse → 500.
 * Node lambdas have enough memory; packs are fetched once from CDN and cached in-process.
 * file-logger Vercel crash is patched in prebuild (patch-next-file-logger.mjs --strict).
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const maxDuration = 30;

import { gunzipSync } from 'node:zlib';

const SITE = 'https://www.avfethiguzel.com';

type PackArticle = {
  title: string;
  kanun: string;
  maddeNo: number;
  official: string;
  commentary: string;
};
type Pack = Record<string, PackArticle>;
type Ctx = { params: Promise<{ kanunId: string; id: string }> };

type GlobalPackCache = { __mevzuatPacks?: Map<string, Pack> };
const g = globalThis as typeof globalThis & GlobalPackCache;
if (!g.__mevzuatPacks) g.__mevzuatPacks = new Map();

function normalizeMaddeId(id: string): string {
  const raw = decodeURIComponent(String(id || '')).trim();
  if (!raw) return raw;
  const lower = raw.toLowerCase();
  if (/^madde[-_]/.test(lower)) return lower.replace(/_/g, '-');
  if (/^\d+[a-z]?$/i.test(raw)) return `madde-${lower}`;
  const spaced = lower.match(/^madde\s+(\d+[a-z]?)$/i);
  if (spaced) return `madde-${spaced[1]}`;
  return lower.replace(/_/g, '-');
}

function esc(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function plain(md: string) {
  return String(md || '')
    .replace(/[#>*_`[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mdLite(md: string) {
  let t = String(md || '');
  t = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  t = t.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  t = t.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  t = t.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\*(.+?)\*/g, '<em>$1</em>');
  t = t.replace(/\n{2,}/g, '</p><p>');
  t = t.replace(/\n/g, '<br/>');
  return `<p>${t}</p>`;
}

async function loadPack(kanunId: string, origin: string): Promise<Pack> {
  const cached = g.__mevzuatPacks!.get(kanunId);
  if (cached) return cached;

  const kid = encodeURIComponent(kanunId);
  const urls = [
    `${origin}/content-packs/${kid}.json.gz`,
    `${SITE}/content-packs/${kid}.json.gz`,
    `https://cdn.jsdelivr.net/gh/fethiguzel13-crypto/av.fethiguzel@main/public/content-packs/${kid}.json.gz`,
    `https://raw.githubusercontent.com/fethiguzel13-crypto/av.fethiguzel/main/public/content-packs/${kid}.json.gz`,
    `https://raw.githubusercontent.com/fethiguzel13-crypto/av.fethiguzel/main/content-packs/${kid}.json.gz`,
  ];

  let last = 'no url';
  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) {
        last = `${url} HTTP ${res.status}`;
        continue;
      }
      const ab = Buffer.from(await res.arrayBuffer());
      if (ab.byteLength < 64) {
        last = `${url} empty`;
        continue;
      }
      let jsonText: string;
      if (ab[0] === 0x1f && ab[1] === 0x8b) {
        jsonText = gunzipSync(ab).toString('utf8');
      } else {
        jsonText = ab.toString('utf8');
      }
      const pack = JSON.parse(jsonText) as Pack;
      g.__mevzuatPacks!.set(kanunId, pack);
      return pack;
    } catch (e) {
      last = e instanceof Error ? e.message : String(e);
    }
  }
  throw new Error(`pack load failed: ${last}`);
}

function resolveArticle(
  pack: Pack,
  id: string
): { key: string; article: PackArticle } | null {
  const candidates = Array.from(
    new Set([normalizeMaddeId(id), id, id.toLowerCase(), `madde-${id}`])
  );
  for (const key of candidates) {
    if (pack[key]) return { key, article: pack[key] };
  }
  const n = parseInt(String(id).replace(/^madde-/i, ''), 10);
  if (!Number.isNaN(n)) {
    for (const [key, article] of Object.entries(pack)) {
      if (article.maddeNo === n) return { key, article };
    }
  }
  return null;
}

function buildHtml(kanunId: string, id: string, article: PackArticle): string {
  const code = kanunId.toUpperCase();
  const n = article.maddeNo;
  const kanun = article.kanun || code;
  const officialPlain = plain(article.official);
  const lead = officialPlain
    .replace(/^.*?Madde\s+\d+\s*[-–—:]?\s*/i, '')
    .trim()
    .slice(0, 130);
  const shortLead = lead.length > 12 ? lead.slice(0, 42).replace(/\s+\S*$/, '') : '';
  // Exact query first: "TBK 13"
  const title = shortLead
    ? `${code} ${n} | ${code} Madde ${n} (m. ${n}) — ${shortLead} | Av. Fethi Güzel`
    : `${code} ${n} | ${code} Madde ${n} (m. ${n}) Resmî Metin ve Şerh | Av. Fethi Güzel`;
  const description = lead
    ? `${code} ${n} / ${code} madde ${n} / ${code} m. ${n} (${kanun}): ${lead}${lead.length >= 120 ? '…' : ''} Resmî metin + akademik şerh — Av. Fethi Güzel.`
    : `${code} ${n} — ${kanun} Madde ${n} (${code} m. ${n}) resmî metni ve akademik şerh. Av. Fethi Güzel.`;
  const h1 = `${code} ${n} — ${code} Madde ${n} (${code} m. ${n})`;
  const canonical = `${SITE}/mevzuat/${kanunId}/${id}`;
  // Cap commentary size for response weight (full text still huge for SEO snippet)
  const commentarySrc = String(article.commentary || '');
  const commentary =
    commentarySrc.length > 14000
      ? commentarySrc.slice(0, 14000) +
        '\n\n… (tam metin portal arşivinde)'
      : commentarySrc;
  const officialHtml = mdLite(article.official);
  const commentaryHtml = commentary
    ? mdLite(commentary)
    : '<p>Bu madde için şerh pakette yer alır.</p>';

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
        description,
        inLanguage: 'tr-TR',
        isAccessibleForFree: true,
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
        keywords: `${code} madde ${n}, ${code} m. ${n}, Av. Fethi Güzel, Fethi Güzel, kanun maddesi`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Mevzuat',
            item: `${SITE}/mevzuat`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${code} Madde ${n}`,
            item: canonical,
          },
        ],
      },
    ],
  };

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}"/>
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"/>
<meta name="author" content="Av. Fethi Güzel"/>
<meta name="keywords" content="${esc(`${code} ${n}, ${code} madde ${n}, ${code} m. ${n}, ${code} m ${n}, ${code} Madde ${n}, ${kanun} madde ${n}, Av. Fethi Güzel, Fethi Güzel, kanun maddesi, akademik şerh`)}"/>
<link rel="canonical" href="${canonical}"/>
<meta property="og:type" content="article"/>
<meta property="og:locale" content="tr_TR"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<meta property="og:site_name" content="Av. Fethi Güzel Hukuk Portalı"/>
<meta name="twitter:card" content="summary"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:description" content="${esc(description)}"/>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>
body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#F4F1EA;color:#1C1C1C;line-height:1.55}
a{color:#C45A38;text-decoration:none} a:hover{text-decoration:underline}
main{max-width:42rem;margin:0 auto;padding:1.75rem 1.1rem 3rem}
.badge{display:inline-block;padding:.28rem .75rem;border-radius:999px;background:rgba(196,90,56,.12);color:#C45A38;font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.box{border-radius:1.15rem;padding:1.25rem 1.4rem;margin:1.1rem 0}
.off{background:linear-gradient(145deg,#2E4036,#1f2e26);color:#FFFEFA}
.com{background:#FFFEFA;border:1px solid rgba(0,0,0,.08)}
h1{font-size:clamp(1.45rem,3vw,2rem);line-height:1.22;margin:.45rem 0 0;font-weight:800}
.muted{color:rgba(28,28,28,.55);font-size:.9rem}
.nav{font-size:.78rem;color:rgba(28,28,28,.5);margin-bottom:1rem}
.topbar{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:space-between;align-items:center;padding:.85rem 1.1rem;background:rgba(244,241,234,.95);border-bottom:1px solid rgba(0,0,0,.07);position:sticky;top:0;z-index:5}
.topbar a.brand{font-weight:800;color:#1C1C1C;font-size:.95rem}
.topbar nav a{margin-left:.85rem;font-size:.8rem;font-weight:600;color:rgba(28,28,28,.65)}
.prose p{margin:.55rem 0}
</style>
</head>
<body>
<header class="topbar">
  <a class="brand" href="${SITE}/">Av. Fethi Güzel</a>
  <nav>
    <a href="${SITE}/mevzuat">Mevzuat</a>
    <a href="${SITE}/ara">Ara</a>
    <a href="${SITE}/bilgi">Rehber</a>
    <a href="${SITE}/avukat-fethi-guzel">Profil</a>
  </nav>
</header>
<main>
<nav class="nav" aria-label="Konum">
<a href="${SITE}/">Ana Sayfa</a> ·
<a href="${SITE}/mevzuat">Mevzuat</a> ·
<a href="${SITE}/ara?q=${encodeURIComponent(code + ' madde ' + n)}">${code}</a> ·
Madde ${n}
</nav>
<p class="badge">${esc(kanun)} · ${code} ${n}</p>
<h1>${esc(h1)}</h1>
<p class="muted" style="margin-top:.8rem">
Arama adları: <strong>${code} ${n}</strong> · <strong>${code} madde ${n}</strong> ·
<strong>${code} m. ${n}</strong> · <strong>${code} m ${n}</strong>
— resmî metin ve akademik şerh: <strong>Av. Fethi Güzel</strong> Hukuk Portalı.
</p>
<section class="box off">
<p style="font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;opacity:.88;margin:0 0 .8rem">Resmî metin — ${code} Madde ${n}</p>
<article class="prose">${officialHtml}</article>
</section>
<section class="box com">
<h2 style="font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:#C45A38;margin:0 0 .75rem">Akademik yorum ve analiz — ${code} m. ${n} şerhi</h2>
<article class="prose">${commentaryHtml}</article>
</section>
<aside class="muted" style="font-size:.8rem;margin-top:1.4rem">
Kaynak ve uyarı: Bilgilendirme amaçlıdır; Resmî Gazete / mevzuat.gov.tr esas alınmalıdır.
Şerh akademik niteliktedir. Arama: ${code} madde ${n}, ${code} m. ${n}, Fethi Güzel.
</aside>
<p style="margin-top:1.35rem;font-size:.9rem">
<a href="${SITE}/mevzuat">← Tüm mevzuat</a> ·
<a href="${SITE}/ara?q=${encodeURIComponent(code + ' madde ' + n)}">Benzer maddelerde ara</a> ·
<a href="${SITE}/avukat-fethi-guzel">Av. Fethi Güzel</a>
</p>
</main>
</body>
</html>`;
}

export async function GET(req: Request, ctx: Ctx) {
  const { kanunId: rawKanun, id: rawId } = await ctx.params;
  const kanunId = String(rawKanun || '').toLowerCase();
  const id = normalizeMaddeId(rawId);
  let origin = SITE;
  try {
    origin = new URL(req.url).origin;
  } catch {
    /* keep SITE */
  }

  if (!kanunId || !id) {
    return new Response('Not found', { status: 404 });
  }

  if (rawId !== id || String(rawKanun) !== kanunId) {
    return Response.redirect(`${SITE}/mevzuat/${kanunId}/${id}`, 308);
  }

  try {
    const pack = await loadPack(kanunId, origin);
    const resolved = resolveArticle(pack, id);
    if (!resolved) {
      return new Response(
        `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"/><title>Madde bulunamadı | Av. Fethi Güzel</title>
<meta name="robots" content="noindex"/><link rel="canonical" href="${SITE}/mevzuat"/></head>
<body style="font-family:system-ui;padding:2rem"><h1>Madde bulunamadı</h1>
<p>${esc(kanunId)} / ${esc(id)}</p>
<p><a href="${SITE}/mevzuat">Mevzuat</a> · <a href="${SITE}/ara">Ara</a></p></body></html>`,
        {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=300',
          },
        }
      );
    }
    const html = buildHtml(kanunId, resolved.key, resolved.article);
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        'X-Robots-Tag': 'index, follow, max-snippet:-1, max-image-preview:large',
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'error';
    console.error('[madde-seo]', kanunId, id, msg);
    return new Response(
      `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"/><title>Yükleniyor | Av. Fethi Güzel</title><meta name="robots" content="noindex"/></head>
<body style="font-family:system-ui;padding:2rem"><p>Madde geçici olarak yüklenemedi; lütfen yenileyin.</p>
<p><a href="${SITE}/mevzuat">Mevzuat</a> · <a href="${SITE}/ara">Ara</a></p>
<!-- ${esc(msg)} --></body></html>`,
      {
        status: 503,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
          'Retry-After': '15',
        },
      }
    );
  }
}
