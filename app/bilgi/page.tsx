import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BilgiHubClient from '@/components/BilgiHubClient';
import {
  VATANDAS_ARTICLES,
  getVatandasCategories,
} from '@/lib/vatandas-rehberi';

const SITE = 'https://www.avfethiguzel.com';
const N = VATANDAS_ARTICLES.length;
const pillars = VATANDAS_ARTICLES.filter((a) => a.role === 'pillar');

export const metadata: Metadata = {
  title: {
    absolute: `Vatandaş Bilgi Rehberi | ${N} Hukuki Konu | Av. Fethi Güzel`,
  },
  description: `${N} vatandaş bilgilendirme sayfası: emlak vergisi, veraset, boşanma, icra, kira, kıdem, trafik cezası, kanun maddesi, e-Devlet. Sade anlatım — Av. Fethi Güzel Hukuk Portalı.`,
  keywords: [
    'vatandaş bilgi rehberi',
    'hukuki bilgi',
    'vatandaş rehberi',
    'sık sorulan hukuki sorular',
    'kanun maddesi',
    'dava nasıl açılır',
    'icra takibi',
    'kıdem tazminatı',
    'boşanma davası',
    'Av. Fethi Güzel',
  ],
  alternates: { canonical: `${SITE}/bilgi` },
  openGraph: {
    title: `Vatandaş Bilgi Rehberi | ${N} Konu | Av. Fethi Güzel`,
    description: `Google’da aranan ${N} hukuki ve idari konuda sade, detaylı bilgilendirme.`,
    url: `${SITE}/bilgi`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
};

export default function BilgiIndexPage() {
  const categories = getVatandasCategories();
  const cards = VATANDAS_ARTICLES.map((a) => ({
    slug: a.slug,
    h1: a.h1,
    title: a.title,
    description: a.description,
    category: a.category,
    role: a.role,
    keywords: a.keywords,
  }));

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Vatandaş Bilgi Rehberi',
    description: `${N} hukuki bilgilendirme rehberi — Av. Fethi Güzel`,
    url: `${SITE}/bilgi`,
    isPartOf: { '@type': 'WebSite', name: 'Av. Fethi Güzel Hukuk Portalı', url: SITE },
    numberOfItems: N,
    about: {
      '@type': 'Thing',
      name: 'Türk hukuku vatandaş bilgilendirme',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: pillars.length,
      itemListElement: pillars.slice(0, 30).map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/bilgi/${a.slug}`,
        name: a.h1,
      })),
    },
  };

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-4xl mx-auto">
        <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
          Vatandaş bilgilendirme · {N} rehber
        </p>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
          Vatandaş bilgi rehberi
        </h1>
        <p className="text-charcoal/60 text-sm sm:text-base leading-relaxed mb-3 max-w-2xl">
          Emlak vergisi, veraset ilamı, trafik cezasına itiraz, boşanma, icra, nafaka, kıdem ve{' '}
          {N} sık aranan konuda adım adım bilgilendirme. Metinler genel bilgilendirme amaçlıdır;
          somut dosyada avukata danışılmalıdır.
        </p>
        <p className="text-[12px] text-charcoal/45 mb-4">
          {N} rehber · {pillars.length} ana rehber · hub–spoke yapı ·{' '}
          <Link href="/mevzuat" className="text-accent font-semibold hover:underline">
            Kanun maddeleri
          </Link>{' '}
          ·{' '}
          <Link href="/hesaplama" className="text-accent font-semibold hover:underline">
            Hesaplama araçları
          </Link>
        </p>

        <nav className="mb-8 flex flex-wrap gap-2" aria-label="Kategori dizinleri">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/bilgi/kategori/${encodeURIComponent(c)}`}
              className="text-xs px-2.5 py-1 rounded-full bg-white border border-charcoal/10 text-charcoal/70 hover:border-accent hover:text-accent font-semibold"
            >
              {c}
            </Link>
          ))}
        </nav>

        <BilgiHubClient articles={cards} categories={categories} />
      </main>
      <Footer />
    </div>
  );
}
