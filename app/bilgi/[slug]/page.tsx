import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VatandasRehberArticle from '@/components/VatandasRehberArticle';
import {
  getAllVatandasSlugs,
  getRelatedArticles,
  getVatandasBySlug,
} from '@/lib/vatandas-rehberi';
import { getPublishedBySlug } from '@/lib/vatandas-rehberi/published';
import { auditGuide } from '@/lib/content-quality.mjs';

const SITE = 'https://www.avfethiguzel.com';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllVatandasSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const published = getPublishedBySlug(slug);
  const a = published || getVatandasBySlug(slug);
  if (!a) return { title: 'Rehber bulunamadı' };

  // Kalıp metin içeren rehber indekse verilmez; başlık ve açıklama da
  // olmayan bir içeriği vaat etmemelidir. Anlatı sürümü (Gemini) yayındadır.
  const quality = published
    ? { publishable: true as const, reason: undefined }
    : auditGuide(a);

  const canonicalPath = a.canonicalPath || `/bilgi/${a.slug}`;
  const canonical = canonicalPath.startsWith('http')
    ? canonicalPath
    : `${SITE}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`;

  const ogUrl = `${SITE}/bilgi/${a.slug}`;
  const title = quality.publishable ? a.title : `${a.h1} — yeniden yazılıyor`;
  const description = quality.publishable
    ? a.description
    : 'Bu rehber yeniden yazılıyor. Doğru ve güncel bilgi için mevzuat sayfalarına bakabilirsiniz.';

  return {
    title,
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
  const { slug } = await params;
  const published = getPublishedBySlug(slug);
  const article = published || getVatandasBySlug(slug);
  if (!article) notFound();

  const quality = published
    ? { publishable: true as const, reason: undefined }
    : auditGuide(article);
  const related = getRelatedArticles(slug, 5).map((r) => getPublishedBySlug(r.slug) || r);

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <main
        id="main-content"
        className="pt-32 sm:pt-40 pb-24 px-5 sm:px-6 max-w-3xl lg:max-w-4xl mx-auto"
      >
        {quality.publishable ? (
          <VatandasRehberArticle article={article} related={related} />
        ) : (
          <WithdrawnGuide
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
  h1,
  category,
  reason,
  links,
  related,
}: {
  h1: string;
  category: string;
  reason?: string;
  links: { label: string; href: string }[];
  related: { slug: string; h1: string }[];
}) {
  return (
    <>
      <nav className="text-[11px] sm:text-xs text-charcoal/50 mb-5" aria-label="Konum">
        <Link href="/" className="hover:text-accent">
          Ana Sayfa
        </Link>
        {' · '}
        <Link href="/bilgi" className="hover:text-accent">
          Vatandaş rehberi
        </Link>
        {' · '}
        <span>{category}</span>
      </nav>

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
