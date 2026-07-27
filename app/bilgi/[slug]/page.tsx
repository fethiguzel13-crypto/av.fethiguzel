import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VatandasRehberArticle from '@/components/VatandasRehberArticle';
import {
  getAllVatandasSlugs,
  getRelatedArticles,
  getVatandasBySlug,
} from '@/lib/vatandas-rehberi';

const SITE = 'https://www.avfethiguzel.com';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllVatandasSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getVatandasBySlug(slug);
  if (!a) return { title: 'Rehber bulunamadı' };

  const canonical = `${SITE}/bilgi/${a.slug}`;
  return {
    title: a.title,
    description: a.description,
    keywords: a.keywords,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'tr_TR',
      url: canonical,
      title: a.title,
      description: a.description,
      siteName: 'Av. Fethi Güzel Hukuk Portalı',
    },
    twitter: {
      card: 'summary',
      title: a.title,
      description: a.description,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  };
}

export default async function BilgiSlugPage({ params }: Props) {
  const { slug } = await params;
  const article = getVatandasBySlug(slug);
  if (!article) notFound();
  const related = getRelatedArticles(slug, 5);

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-3xl mx-auto">
        <VatandasRehberArticle article={article} related={related} />
      </main>
      <Footer />
    </div>
  );
}
