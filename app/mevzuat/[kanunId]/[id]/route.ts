/**
 * Crawlable madde HTML without React SSR (avoids Vercel lambda 500s).
 * Googlebot receives unique title, canonical, JSON-LD, full resmi metin.
 */
import {
  SITE_ORIGIN,
  getArticleData,
  normalizeMaddeId,
} from '@/lib/api';

export const revalidate = 86400;
export const dynamicParams = true;

type Ctx = { params: Promise<{ kanunId: string; id: string }> };

function esc(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripTags(html: string) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildHtml(opts: {
  kanunId: string;
  id: string;
  code: string;
  kanun: string;
  maddeNo: number;
  h1: string;
  officialHtml: string;
  commentaryHtml: string;
}) {
  const { kanunId, id, code, kanun, maddeNo: n, h1, officialHtml, commentaryHtml } = opts;
  const plain = stripTags(officialHtml);
  const lead = plain.replace(/^.*?Madde\s+\d+\s*[-–—:]?\s*/i, '').trim().slice(0, 130);
  const title = lead.length > 8
    ? `${code} Madde ${n} (${code} m. ${n}) ${lead.slice(0, 40)} | Av. Fethi Güzel`
    : `${code} Madde ${n} | ${code} m. ${n} Resmî Metin ve Şerh | Av. Fethi Güzel`;
  const description = lead
    ? `${code} madde ${n} / ${code} m. ${n} (${kanun}): ${lead}${lead.length >= 120 ? '…' : ''} Akademik şerh — Av. Fethi Güzel.`
    : `${kanun} Madde ${n} (${code} m. ${n}) resmî metni ve akademik şerh. Av. Fethi Güzel.`;
  const canonical = `${SITE_ORIGIN}/mevzuat/${kanunId}/${id}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: `${code} Madde ${n} | ${code} m. ${n}`,
        name: `${code} Madde ${n}`,
        alternateName: [`${code} m. ${n}`, `${code} m ${n}`, `${code} ${n}`],
        description,
        inLanguage: 'tr-TR',
        isAccessibleForFree: true,
        author: {
          '@type': 'Person',
          name: 'Av. Fethi Güzel',
          url: `${SITE_ORIGIN}/avukat-fethi-guzel`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Av. Fethi Güzel Hukuk Portalı',
          url: SITE_ORIGIN,
        },
        mainEntityOfPage: canonical,
        about: {
          '@type': 'Legislation',
          name: `${kanun} Madde ${n}`,
          legislationIdentifier: `${code}-${n}`,
          legislationJurisdiction: 'TR',
        },
        keywords: `${code} madde ${n}, ${code} m. ${n}, Av. Fethi Güzel, kanun maddesi`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE_ORIGIN },
          { '@type': 'ListItem', position: 2, name: 'Mevzuat', item: `${SITE_ORIGIN}/mevzuat` },
          { '@type': 'ListItem', position: 3, name: `${code} Madde ${n}`, item: canonical },
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
<meta name="keywords" content="${esc(`${code} madde ${n}, ${code} m. ${n}, ${code} m ${n}, ${code} ${n}, ${kanun} madde ${n}, Av. Fethi Güzel, Fethi Güzel, kanun maddesi, akademik şerh`)}"/>
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
.prose p{margin:.55rem 0} .prose h2,.prose h3{margin:1rem 0 .4rem}
</style>
</head>
<body>
<header class="topbar">
  <a class="brand" href="${SITE_ORIGIN}/">Av. Fethi Güzel</a>
  <nav>
    <a href="${SITE_ORIGIN}/mevzuat">Mevzuat</a>
    <a href="${SITE_ORIGIN}/ara">Ara</a>
    <a href="${SITE_ORIGIN}/bilgi">Rehber</a>
    <a href="${SITE_ORIGIN}/avukat-fethi-guzel">Profil</a>
  </nav>
</header>
<main>
<nav class="nav" aria-label="Konum">
<a href="${SITE_ORIGIN}/">Ana Sayfa</a> ·
<a href="${SITE_ORIGIN}/mevzuat">Mevzuat</a> ·
<a href="${SITE_ORIGIN}/ara?q=${encodeURIComponent(code + ' madde ' + n)}">${code}</a> ·
Madde ${n}
</nav>
<p class="badge">${esc(kanun)}</p>
<h1>${esc(h1)}</h1>
<p class="muted" style="margin-top:.8rem">
Bu sayfada <strong>${code} madde ${n}</strong> (<strong>${code} m. ${n}</strong>,
<strong>${code} m ${n}</strong>, <strong>${code} ${n}</strong>)
resmî hükmü ile akademik şerhi yer alır — <strong>Av. Fethi Güzel</strong> Hukuk Portalı.
</p>
<section class="box off">
<p style="font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;opacity:.88;margin:0 0 .8rem">Resmî metin — ${code} Madde ${n}</p>
<article class="prose">${officialHtml}</article>
</section>
<section class="box com">
<h2 style="font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:#C45A38;margin:0 0 .75rem">Akademik yorum ve analiz — ${code} m. ${n} şerhi</h2>
<article class="prose">${commentaryHtml || '<p>Bu madde için şerh pakette yer alır.</p>'}</article>
</section>
<aside class="muted" style="font-size:.8rem;margin-top:1.4rem">
Kaynak ve uyarı: Bilgilendirme amaçlıdır; Resmî Gazete / mevzuat.gov.tr esas alınmalıdır.
Şerh akademik niteliktedir. Arama: ${code} madde ${n}, ${code} m. ${n}, Fethi Güzel.
</aside>
<p style="margin-top:1.35rem;font-size:.9rem">
<a href="${SITE_ORIGIN}/mevzuat">← Tüm mevzuat</a> ·
<a href="${SITE_ORIGIN}/ara?q=${encodeURIComponent(code + ' madde ' + n)}">Benzer maddelerde ara</a> ·
<a href="${SITE_ORIGIN}/avukat-fethi-guzel">Av. Fethi Güzel</a>
</p>
</main>
</body>
</html>`;
}

export async function GET(_req: Request, ctx: Ctx) {
  const { kanunId: rawKanun, id: rawId } = await ctx.params;
  const kanunId = String(rawKanun || '').toLowerCase();
  const id = normalizeMaddeId(rawId);

  if (!kanunId || !id) {
    return new Response('Not found', { status: 404 });
  }

  // Canonical redirect for bare numbers etc.
  if (rawId !== id || rawKanun !== kanunId) {
    return Response.redirect(`${SITE_ORIGIN}/mevzuat/${kanunId}/${id}`, 308);
  }

  try {
    const article = await getArticleData(kanunId, id);
    const code = kanunId.toUpperCase();
    const html = buildHtml({
      kanunId,
      id: article.id,
      code,
      kanun: article.kanun || code,
      maddeNo: article.maddeNo,
      h1: article.title?.trim() || `${article.kanun} Madde ${article.maddeNo}`,
      officialHtml: article.officialHtml,
      commentaryHtml: article.commentaryHtml,
    });

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        'X-Robots-Tag': 'index, follow, max-snippet:-1, max-image-preview:large',
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'load failed';
    // Soft HTML 503 so crawlers retry; avoid opaque Next 500 shell
    const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"/><title>Madde yükleniyor | Av. Fethi Güzel</title>
<meta name="robots" content="noindex"/>
</head><body style="font-family:system-ui;padding:2rem">
<p>Madde geçici olarak yüklenemedi. Lütfen birkaç saniye sonra yenileyin.</p>
<p><a href="${SITE_ORIGIN}/mevzuat">Mevzuat arşivi</a> · <a href="${SITE_ORIGIN}/ara">Ara</a></p>
<!-- ${esc(msg)} -->
</body></html>`;
    return new Response(html, {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Retry-After': '30',
      },
    });
  }
}
