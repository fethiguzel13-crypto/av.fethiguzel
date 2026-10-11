import { jsonLdHtml } from "@/lib/json-ld";
import { getLawCategoryBySlug, lawCategories } from '@/lib/laws';
import Link from "@/components/SiteLink";
import Kirinti from '@/components/Kirinti';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { paylasimMeta } from '@/lib/paylasim';
import { yazarRef } from '@/lib/yazar';

export function generateStaticParams() {
  return lawCategories.map(cat => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = getLawCategoryBySlug(category);

  if (!cat) {
    return { title: 'Sayfa Bulunamadı' };
  }

  return {
    title: `${cat.name} – ${cat.kanunAdi}`,
    description: cat.description,
    keywords: cat.seoKeywords.join(', '),
    ...paylasimMeta({
      baslik: `${cat.name} | Av. Fethi Güzel`,
      aciklama: cat.description,
      adres: `/${category}`,
      tur: 'alan',
      anahtar: cat.slug,
    }),
    alternates: {
      canonical: `https://www.avfethiguzel.com/${category}`,
    },
  };
}

export default async function CategoryLandingPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getLawCategoryBySlug(category);

  if (!cat) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-primary text-light">
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <Kirinti
            ogeler={[{ ad: cat.name, yol: `/${category}` }]}
            className="flex items-center gap-2 text-sm font-data text-light/50 mb-8"
            baglantiSinifi="hover:text-accent transition-colors"
            sonSinif="text-accent"
          />

          <span className="text-accent font-data text-sm tracking-[0.2em] uppercase block mb-4">{cat.kanunAdi}</span>
          <h1 className="text-4xl md:text-6xl font-sans font-bold mb-6">{cat.name}</h1>
          <p className="text-light/60 font-sans text-lg max-w-3xl leading-relaxed">{cat.description}</p>
        </div>
      </div>

      {/* Sub-Category Grid */}
      <div className="px-6 md:px-20 pb-32">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cat.subCategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/${category}/${sub.slug}`}
              className="group card-hover bg-white/[0.03] border border-white/10 hover:border-accent/30 rounded-[2rem] p-8 flex flex-col transition-all duration-300"
            >
              <h3 className="font-sans font-bold text-xl text-light group-hover:text-accent transition-colors mb-3">
                {sub.name}
              </h3>
              <p className="text-light/50 font-sans text-sm leading-relaxed flex-1">
                {sub.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-accent text-sm font-semibold">
                <span>Maddeleri İncele</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${cat.name} – ${cat.kanunAdi}`,
            "description": cat.description,
            "url": `https://www.avfethiguzel.com/${category}`,
            "author": yazarRef()
          })
        }}
      />
    </main>
  );
}
