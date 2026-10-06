import type { Metadata } from 'next';
import Link from "@/components/SiteLink";
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VatandasRehberArticle from '@/components/VatandasRehberArticle';
import { getGuidePageSlugs, getGuidePageState, getGuideView, getRelatedPublished } from '@/lib/vatandas-rehberi/published';
import { sayfaBasligi } from '@/lib/sayfa-basligi';
import Kirinti from '@/components/Kirinti';
import IlgiliIcerik from '@/components/IlgiliIcerik';
import { sayfaIlgiliIcerik } from '@/lib/ic-baglanti/sayfa';

const SITE = 'https://www.avfethiguzel.com';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getGuidePageSlugs().map((slug) => ({ slug }));
}

// Next Türkçe karakterli segmenti kodlu verir (`muh%C3%BCr-…`); çözülmezse rehber bulunamaz
// ve sayfa derlemede 404 olarak üretilir (G06b: 8 rehber). Kategori sayfasıyla aynı düzen.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const quality = getGuidePageState(slug);
  if (!quality) return { title: 'Rehber bulunamadı' };
  const a = quality.article;

  // Yayında olmayan rehber indekse verilmez; başlık ve açıklama da olmayan bir içeriği vaat etmemelidir.
  // Karar site haritasıyla aynı seçimden gelir (G11): sayfa ayrıca denetim yapmaz.

  const canonicalPath = a.canonicalPath || `/bilgi/${encodeURIComponent(a.slug)}`;
  const canonical = canonicalPath.startsWith('http')
    ? canonicalPath
    : `${SITE}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`;

  const ogUrl = `${SITE}/bilgi/${encodeURIComponent(a.slug)}`;
  const title = quality.publishable ? a.title : `${a.h1} — yeniden yazılıyor`;
  const description = quality.publishable
    ? a.description
    : 'Bu rehber yeniden yazılıyor. Doğru ve güncel bilgi için mevzuat sayfalarına bakabilirsiniz.';

  return {
    // Veri başlığı "… | Av. Fethi Güzel" ekiyle geliyor; kök şablon eki yeniden ekler (G10). OG/Twitter ekli kalır.
    title: sayfaBasligi(title),
    description,
    keywords: quality.publishable ? a.keywords : undefined,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'tr_TR',
      url: ogUrl,
      title,
      description,
      siteName: 'Av. Fethi Güzel Hukuk Portalı',
    },
    twitter: { card: 'summary', title, description },
    robots: quality.publishable
      ? { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' }
      : { index: false, follow: true },
  };
}

export default async function BilgiSlugPage({ params }: Props) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const quality = getGuidePageState(slug);
  if (!quality) notFound();
  const article = getGuideView(quality.article);
  const related = getRelatedPublished(slug, 5);
  const ayniMadde = quality.publishable
    ? sayfaIlgiliIcerik(`/bilgi/${article.slug}`, [
        ...related.map((r) => `/bilgi/${r.slug}`),
        ...article.links.map((l) => l.href),
      ])
    : [];

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <main
        id="main-content"
        className="pt-32 sm:pt-40 pb-24 px-5 sm:px-6 max-w-3xl lg:max-w-4xl mx-auto"
      >
        {quality.publishable ? (
          <>
            <VatandasRehberArticle article={article} related={related} />
            <IlgiliIcerik ogeler={ayniMadde} />
          </>
        ) : (
          <WithdrawnGuide
            slug={article.slug}
            h1={article.h1}
            category={article.category}
            reason={quality.reason}
            links={article.links}
            related={related.map((r) => ({ slug: r.slug, h1: r.h1 }))}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

/**
 * Yayından kaldırılmış rehber ekranı.
 *
 * Sayfa 404 vermez: dışarıdan verilmiş bağlantılar kırılmasın ve kullanıcı
 * ne olduğunu öğrensin diye durur. Ama içerik gösterilmez, indekse girmez ve
 * kullanıcı gerçekten yararlı olan yere — resmî mevzuat metnine — yönlendirilir.
 */
function WithdrawnGuide({
  slug,
  h1,
  category,
  reason,
  links,
  related,
}: {
  slug: string;
  h1: string;
  category: string;
  reason?: string;
  links: { label: string; href: string }[];
  related: { slug: string; h1: string }[];
}) {
  return (
    <>
      {/* Sayfa noindex: görünür kırıntı yeterli, şema basılmaz. */}
      <Kirinti
        ogeler={[
          { ad: 'Vatandaş rehberi', yol: '/bilgi' },
          { ad: category, yol: `/bilgi/kategori/${encodeURIComponent(category)}` },
          { ad: h1, yol: `/bilgi/${slug}` },
        ]}
        ld={false}
        className="text-[11px] sm:text-xs text-charcoal/50 mb-5 flex flex-wrap gap-1.5"
      />

      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal mb-6 leading-tight">
        {h1}
      </h1>

      <aside className="rounded-2xl border border-accent/30 bg-accent/[0.06] px-5 py-5 sm:px-6 sm:py-6 mb-10">
        <p className="text-[11px] font-mono tracking-[0.16em] uppercase text-accent font-bold m-0 mb-2">
          Bu sayfa yeniden yazılıyor
        </p>
        <p className="text-[15px] text-charcoal/80 leading-relaxed m-0">
          {reason ??
            'Bu rehber otomatik üretilmiş kalıp metin içerdiği için yayından kaldırıldı.'}
        </p>
        <p className="text-sm text-charcoal/60 leading-relaxed mt-3 mb-0">
          Yanlış bilgi vermektense hiç bilgi vermemeyi tercih ediyoruz. Konu yeniden,
          kaynağı doğrulanmış biçimde yazıldığında bu sayfa açılacak.
        </p>
      </aside>

      {links.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-heading font-bold text-charcoal mb-3">
            Bu arada resmî metne bakabilirsiniz
          </h2>
          <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex text-sm font-semibold px-3.5 py-2 rounded-full bg-white border border-charcoal/10 text-charcoal hover:border-accent hover:text-accent transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-heading font-bold text-charcoal mb-3">İlgili konular</h2>
          <ul className="flex flex-col gap-2 m-0 p-0 list-none">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/bilgi/${r.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-charcoal/[0.08] bg-white px-3.5 py-3 text-sm text-charcoal font-semibold hover:border-accent/40 hover:text-accent transition-colors"
                >
                  <span className="text-accent" aria-hidden>
                    →
                  </span>
                  {r.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-sm">
        <Link href="/hesaplama" className="text-accent font-bold hover:underline">
          Hesaplama araçları →
        </Link>
        {'  ·  '}
        <Link href="/mevzuat" className="text-accent font-bold hover:underline">
          Mevzuat →
        </Link>
      </p>
    </>
  );
}
