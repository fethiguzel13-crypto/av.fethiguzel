import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  VATANDAS_ARTICLES,
  getVatandasCategories,
} from '@/lib/vatandas-rehberi';
import { BookOpen } from 'lucide-react';

const SITE = 'https://www.avfethiguzel.com';

type Props = { params: Promise<{ cat: string }> };

export function generateStaticParams() {
  return getVatandasCategories().map((cat) => ({ cat }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat: raw } = await params;
  const cat = decodeURIComponent(raw);
  const items = VATANDAS_ARTICLES.filter((a) => a.category === cat);
  if (!items.length) return { title: 'Kategori bulunamadı' };
  const url = `${SITE}/bilgi/kategori/${encodeURIComponent(cat)}`;
  return {
    title: {
      absolute: `${cat} Hukuki Rehberler (${items.length}) | Vatandaş Bilgi | Av. Fethi Güzel`,
    },
    description: `${cat} kategorisinde ${items.length} vatandaş bilgilendirme rehberi. Adım adım süreç, belge ve süre notları — Av. Fethi Güzel.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${cat} — Vatandaş rehberleri`,
      description: `${items.length} rehber · Av. Fethi Güzel Hukuk Portalı`,
      url,
    },
    robots: { index: true, follow: true },
  };
}

export default async function BilgiKategoriPage({ params }: Props) {
  const { cat: raw } = await params;
  const cat = decodeURIComponent(raw);
  const items = VATANDAS_ARTICLES.filter((a) => a.category === cat).sort((a, b) => {
    const ra = a.role === 'pillar' ? 0 : 1;
    const rb = b.role === 'pillar' ? 0 : 1;
    return ra - rb || a.h1.localeCompare(b.h1, 'tr');
  });
  if (!items.length) notFound();

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat} hukuki rehberler`,
    url: `${SITE}/bilgi/kategori/${encodeURIComponent(cat)}`,
    numberOfItems: items.length,
    isPartOf: { '@type': 'WebSite', url: SITE, name: 'Av. Fethi Güzel Hukuk Portalı' },
  };

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <main className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-4xl mx-auto">
        <nav className="text-[11px] text-charcoal/40 mb-5 flex flex-wrap gap-1.5">
          <Link href="/" className="hover:text-accent">
            Ana sayfa
          </Link>
          <span>/</span>
          <Link href="/bilgi" className="hover:text-accent">
            Vatandaş rehberi
          </Link>
          <span>/</span>
          <span className="text-charcoal/60">{cat}</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-3">
          {cat} — vatandaş rehberleri
        </h1>
        <p className="text-charcoal/55 text-sm mb-8 max-w-2xl">
          {items.length} bilgilendirme sayfası. Genel bilgilendirme amaçlıdır; somut uyuşmazlıkta
          avukata danışın.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/bilgi/${a.slug}`}
                className="block h-full rounded-2xl border border-charcoal/8 bg-white/60 hover:bg-white hover:border-accent/30 p-4 transition-colors"
              >
                <div className="flex gap-2">
                  <BookOpen className="text-accent shrink-0 mt-0.5" size={16} />
                  <div>
                    <h2 className="text-sm font-semibold text-charcoal leading-snug mb-1">{a.h1}</h2>
                    {a.role === 'pillar' && (
                      <span className="text-[9px] uppercase font-mono text-accent">Ana rehber</span>
                    )}
                    <p className="text-xs text-charcoal/55 line-clamp-2 mt-1">{a.description}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10">
          <Link href="/bilgi" className="text-sm font-bold text-accent hover:underline">
            ← Tüm vatandaş rehberleri
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
