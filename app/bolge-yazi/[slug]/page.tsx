import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BolgeMakaleView from '@/components/BolgeMakaleView';
import {
  BOLGE_MAKALELER,
  getAllBolgeMakaleSlugs,
  getBolgeMakale,
  getMakalelerByYerlesim,
} from '@/lib/bolge-makaleler';
import { SITE_URL } from '@/lib/profile';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllBolgeMakaleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = getBolgeMakale(slug);
  if (!m) return { title: 'Yazı bulunamadı' };
  return {
    title: { absolute: m.title },
    description: m.description,
    keywords: m.keywords,
    alternates: { canonical: `${SITE_URL}/bolge-yazi/${m.slug}` },
    openGraph: {
      type: 'article',
      title: m.h1,
      description: m.description,
      url: `${SITE_URL}/bolge-yazi/${m.slug}`,
      locale: 'tr_TR',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
  };
}

export default async function BolgeYaziSlugPage({ params }: Props) {
  const { slug } = await params;
  const makale = getBolgeMakale(slug);
  if (!makale) notFound();
  const siblings = getMakalelerByYerlesim(makale.yerlesim).filter((x) => x.slug !== makale.slug);

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <main id="main-content" className="pt-32 sm:pt-40 pb-24 px-5 sm:px-6 max-w-3xl lg:max-w-4xl mx-auto">
        <BolgeMakaleView makale={makale} siblings={siblings} />
        <p className="mt-10 text-center text-xs text-charcoal/40">
          Tüm yazılar:{' '}
          <a href="/bolge-yazi" className="text-accent font-semibold hover:underline">
            /bolge-yazi
          </a>
          {' · '}
          {BOLGE_MAKALELER.length} makale
        </p>
      </main>
      <Footer />
    </div>
  );
}
