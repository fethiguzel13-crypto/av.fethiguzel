import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  SITE_ORIGIN,
  getArticleData,
  getArticleSeoFields,
  getNavigationInfo,
  normalizeMaddeId,
} from '@/lib/api';
import { araclarForKanun } from '@/lib/hesaplama-meta';

type Props = { params: Promise<{ kanunId: string; id: string }> };

export const revalidate = 86400;
export const dynamicParams = true;

/**
 * Prefetch highest-traffic kanun first pages so Google sees real HTML immediately.
 * Remaining maddeler: on-demand ISR (revalidate 86400).
 */
export async function generateStaticParams() {
  try {
    const { getArticlesByKanun } = await import('@/lib/api');
    // Core codes users actually search: TBK m.16, TCK, HMK…
    const core = ['tbk', 'tmk', 'tck', 'hmk', 'iik', 'cmk', 'ttk', 'is-kanunu', 'tbk'];
    const seen = new Set<string>();
    const out: { kanunId: string; id: string }[] = [];
    for (const kanunId of [...new Set(core)]) {
      const arts = await getArticlesByKanun(kanunId);
      // First 80 per kanun covers most head queries without exploding build
      for (const a of arts.slice(0, 80)) {
        const k = `${kanunId}/${a.id}`;
        if (seen.has(k)) continue;
        seen.add(k);
        out.push({ kanunId, id: a.id });
      }
    }
    return out;
  } catch {
    return [] as { kanunId: string; id: string }[];
  }
}

function stripHtml(html: string): string {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Absolute title — bypass layout template; hit queries like "TBK m. 16", "TBK madde 16". */
function seoTitleAbsolute(
  kanunId: string,
  maddeNo: number,
  headingHint: string
): string {
  const code = kanunId.toUpperCase();
  const hint = headingHint
    .replace(/^[IVXLC]+\.\s*/i, '')
    .replace(/\d+\.\s*/g, '')
    .replace(/^[a-z]\.\s*/i, '')
    .trim()
    .slice(0, 40);
  // Keep under ~60–70 chars for SERP; include m. variant for exact match
  if (hint && hint.length > 5) {
    return `${code} Madde ${maddeNo} (${code} m. ${maddeNo}) ${hint} | Av. Fethi Güzel`;
  }
  return `${code} Madde ${maddeNo} | ${code} m. ${maddeNo} Resmî Metin ve Şerh | Av. Fethi Güzel`;
}

function seoDescription(
  kanunId: string,
  maddeNo: number,
  kanun: string,
  officialText: string,
  commentaryLead: string
): string {
  const lead =
    officialText.replace(/^.*?Madde\s+\d+\s*[-–—:]?\s*/i, '').trim() ||
    commentaryLead ||
    '';
  const clipped = lead.slice(0, 130).trim();
  const code = kanunId.toUpperCase();
  if (clipped) {
    return `${code} madde ${maddeNo} / ${code} m. ${maddeNo} (${kanun}): ${clipped}${clipped.length >= 125 ? '…' : ''} Akademik şerh — Av. Fethi Güzel.`;
  }
  return `${kanun} Madde ${maddeNo} (${code} m. ${maddeNo}) resmî metni ve akademik şerh. Av. Fethi Güzel dijital hukuk kütüphanesi.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kanunId: rawKanun, id: rawId } = await params;
  const kanunId = rawKanun.toLowerCase();
  const id = normalizeMaddeId(rawId);
  const seo = await getArticleSeoFields(kanunId, id);

  if (!seo) {
    return {
      title: {
        absolute: `${kanunId.toUpperCase()} ${rawId} | Mevzuat | Av. Fethi Güzel`,
      },
      description: 'Kanun maddesi metni ve akademik şerh — Av. Fethi Güzel Hukuk Portalı.',
      robots: { index: false, follow: true },
    };
  }

  const title = seoTitleAbsolute(kanunId, seo.maddeNo, seo.headingHint);
  const description = seoDescription(
    kanunId,
    seo.maddeNo,
    seo.kanun,
    seo.officialText,
    seo.commentaryLead
  );
  const canonical = `${SITE_ORIGIN}/mevzuat/${kanunId}/${seo.id}`;
  const code = kanunId.toUpperCase();
  const n = seo.maddeNo;

  return {
    title: { absolute: title },
    description,
    keywords: [
      `${code} madde ${n}`,
      `${code} m. ${n}`,
      `${code} m ${n}`,
      `${code} ${n}`,
      `${code.toLowerCase()} madde ${n}`,
      `${code.toLowerCase()} m. ${n}`,
      `${seo.kanun} madde ${n}`,
      `${code} madde ${n} metni`,
      `${code} madde ${n} şerh`,
      `${code} madde ${n} fethi güzel`,
      'Av. Fethi Güzel',
      'Fethi Güzel',
      'kanun maddesi',
      'akademik şerh',
      'mevzuat',
    ],
    authors: [{ name: 'Av. Fethi Güzel', url: `${SITE_ORIGIN}/avukat-fethi-guzel` }],
    creator: 'Av. Fethi Güzel',
    publisher: 'Av. Fethi Güzel Hukuk Portalı',
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'tr_TR',
      url: canonical,
      siteName: 'Av. Fethi Güzel Hukuk Portalı',
      title,
      description,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large' as const,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large' as const,
      },
    },
  };
}

export default async function MaddePage({ params }: Props) {
  const { kanunId: rawKanun, id: rawId } = await params;
  const kanunId = rawKanun.toLowerCase();
  const normalized = normalizeMaddeId(rawId);

  // Canonical path: /mevzuat/tbk/madde-13 (not /mevzuat/tbk/13)
  if (rawId !== normalized || rawKanun !== kanunId) {
    permanentRedirect(`/mevzuat/${kanunId}/${normalized}`);
  }

  let article;
  try {
    article = await getArticleData(kanunId, normalized);
  } catch {
    notFound();
  }

  // If pack key differs from URL (e.g. resolved by maddeNo), redirect once
  if (article.id !== normalized) {
    permanentRedirect(`/mevzuat/${kanunId}/${article.id}`);
  }

  const nav = await getNavigationInfo(kanunId, article.maddeNo);
  const code = kanunId.toUpperCase();
  const pageUrl = `${SITE_ORIGIN}/mevzuat/${kanunId}/${article.id}`;
  const h1 = article.title?.trim() || `${article.kanun} Madde ${article.maddeNo}`;
  const plainOfficial = stripHtml(article.officialHtml).slice(0, 280);
  const relatedTools = araclarForKanun(kanunId);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: `${code} Madde ${article.maddeNo} | ${code} m. ${article.maddeNo}`,
        name: `${code} Madde ${article.maddeNo}`,
        alternateName: [`${code} m. ${article.maddeNo}`, `${code} m ${article.maddeNo}`, `${code} ${article.maddeNo}`],
        description: plainOfficial || h1,
        inLanguage: 'tr-TR',
        isAccessibleForFree: true,
        author: {
          '@type': 'Person',
          name: 'Av. Fethi Güzel',
          url: `${SITE_ORIGIN}/avukat-fethi-guzel`,
          jobTitle: 'Avukat',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Av. Fethi Güzel Hukuk Portalı',
          url: SITE_ORIGIN,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
        about: {
          '@type': 'Legislation',
          name: `${article.kanun} Madde ${article.maddeNo}`,
          legislationIdentifier: `${code}-${article.maddeNo}`,
          legislationJurisdiction: 'TR',
        },
        keywords: `${code} madde ${article.maddeNo}, ${code} m. ${article.maddeNo}, Av. Fethi Güzel`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Ana Sayfa',
            item: SITE_ORIGIN,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Mevzuat',
            item: `${SITE_ORIGIN}/mevzuat`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${code} Madde ${article.maddeNo}`,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': pageUrl,
        url: pageUrl,
        name: `${code} Madde ${article.maddeNo} | Akademik Şerh`,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Av. Fethi Güzel Hukuk Portalı',
          url: SITE_ORIGIN,
        },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '.madde-prose-official'],
        },
      },
    ],
  };

  return (
    <div className="madde-shell min-h-screen bg-[#F4F1EA] text-[#1C1C1C]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-20 px-4 sm:px-5 max-w-[46rem] mx-auto">
        <nav
          className="text-[11px] sm:text-xs text-[#1C1C1C]/55 mb-6 tracking-wide"
          aria-label="Konum"
        >
          <Link href="/" className="hover:text-[#C45A38]">
            Ana Sayfa
          </Link>
          {' · '}
          <Link href="/mevzuat" className="hover:text-[#C45A38]">
            Mevzuat
          </Link>
          {' · '}
          <Link href={`/ara?q=${encodeURIComponent(code)}`} className="hover:text-[#C45A38]">
            {code}
          </Link>
          {' · '}
          <span className="text-[#1C1C1C]/70">Madde {article.maddeNo}</span>
        </nav>

        <header className="mb-7 sm:mb-9">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#C45A38] mb-2">
            {article.kanun || code}
          </p>
          <h1 className="font-heading text-[1.65rem] sm:text-[2.1rem] font-bold leading-[1.2] tracking-tight text-[#1C1C1C]">
            {h1}
          </h1>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex px-3 py-1 rounded-full bg-[#C45A38]/12 text-[#C45A38] text-[11px] font-bold uppercase tracking-wider">
              {code} Madde {article.maddeNo}
            </span>
            <span className="inline-flex px-3 py-1 rounded-full bg-[#2E4036]/10 text-[#2E4036] text-[11px] font-semibold tracking-wide">
              Resmî metin + akademik şerh
            </span>
          </div>
          {/* Visible keyword variants for long-tail queries (tbk 13, tbk m. 13) */}
          <p className="mt-4 text-[13px] text-[#1C1C1C]/55 leading-relaxed">
            Bu sayfada <strong className="font-semibold text-[#1C1C1C]/75">{code} madde {article.maddeNo}</strong>
            {' '}(<strong className="font-semibold text-[#1C1C1C]/75">{code} m. {article.maddeNo}</strong>
            {', '}
            <strong className="font-semibold text-[#1C1C1C]/75">{code} {article.maddeNo}</strong>)
            resmî hükmü ile akademik şerhi bir arada yer alır.
          </p>
        </header>

        <nav
          className="flex flex-wrap gap-2 justify-between items-center mb-6 pb-4 border-b border-black/8"
          aria-label="Madde gezinme"
        >
          {nav.prev ? (
            <Link
              href={`/mevzuat/${kanunId}/${nav.prev.id}`}
              className="text-sm font-semibold px-4 py-2.5 rounded-full bg-white border border-black/10 hover:border-[#C45A38]/40 hover:text-[#C45A38] transition-colors max-w-[48%] truncate"
              title="Önceki madde"
            >
              ← {nav.prev.title || `Madde ${nav.prev.maddeNo}`}
            </Link>
          ) : (
            <span />
          )}
          {nav.next ? (
            <Link
              href={`/mevzuat/${kanunId}/${nav.next.id}`}
              className="text-sm font-semibold px-4 py-2.5 rounded-full bg-white border border-black/10 hover:border-[#C45A38]/40 hover:text-[#C45A38] transition-colors max-w-[48%] truncate"
              title="Sonraki madde"
            >
              {nav.next.title || `Madde ${nav.next.maddeNo}`} →
            </Link>
          ) : null}
        </nav>

        <section className="rounded-2xl sm:rounded-[1.35rem] bg-gradient-to-br from-[#2E4036] to-[#24352c] text-[#FFFEFA]/95 p-5 sm:p-8 shadow-lg mb-5 sm:mb-6">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a48a] mb-4">
            <span className="w-4 h-0.5 bg-[#e8a48a] rounded-full" />
            Resmî metin
          </p>
          <article
            className="madde-prose madde-prose-official"
            dangerouslySetInnerHTML={{ __html: article.officialHtml }}
          />
        </section>

        <section className="rounded-2xl sm:rounded-[1.35rem] bg-[#FFFEFA] border border-black/8 p-5 sm:p-8 shadow-sm mb-8">
          <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C45A38] mb-4">
            <span className="w-4 h-0.5 bg-[#C45A38] rounded-full" />
            Akademik yorum ve analiz — {code} m. {article.maddeNo} şerhi
          </h2>
          {article.commentaryHtml ? (
            <article
              className="madde-prose madde-prose-commentary"
              dangerouslySetInnerHTML={{ __html: article.commentaryHtml }}
            />
          ) : (
            <p className="text-sm text-[#1C1C1C]/50">
              Bu madde için şerh henüz eklenmemiş. Resmî metin yukarıdadır.
            </p>
          )}
        </section>

        {relatedTools.length > 0 && (
          <section className="mb-8 rounded-2xl bg-white border border-black/8 p-5 sm:p-6">
            <h2 className="text-sm font-bold text-[#1C1C1C] mb-2">İlgili hesaplama araçları</h2>
            <p className="text-[11px] text-[#1C1C1C]/45 mb-3 leading-relaxed">
              Bilgilendirme amaçlıdır; bu maddenin somut olaya uygulanması avukat değerlendirmesi
              gerektirir.
            </p>
            <ul className="flex flex-wrap gap-2">
              {relatedTools.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/hesaplama/${a.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#C45A38]/8 text-[#C45A38] hover:bg-[#C45A38] hover:text-white transition-colors"
                  >
                    {a.baslik}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <aside className="rounded-2xl border border-black/8 bg-white/70 p-5 text-[12px] text-[#1C1C1C]/55 leading-relaxed mb-10">
          <p>
            <strong className="text-[#1C1C1C]/70">Kaynak ve uyarı:</strong> Madde metni bilgilendirme
            amaçlıdır; yürürlük ve değişiklik kontrolü için Resmî Gazete / mevzuat.gov.tr esas alınmalıdır.
            Şerh akademik niteliktedir ve hukuki danışmanlık yerine geçmez.
          </p>
          <p className="mt-2">
            Arama: {code} madde {article.maddeNo}, {code} m. {article.maddeNo}, {article.kanun}{' '}
            {article.maddeNo}.
          </p>
        </aside>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/mevzuat"
            className="font-semibold text-[#C45A38] hover:underline"
          >
            ← Tüm mevzuat
          </Link>
          <Link
            href={`/ara?q=${encodeURIComponent(`${code} madde ${article.maddeNo}`)}`}
            className="font-semibold text-[#2E4036] hover:underline"
          >
            Benzer maddelerde ara
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
