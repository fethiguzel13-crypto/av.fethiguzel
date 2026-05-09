import { getLawCategoryBySlug, lawCategories } from '@/lib/laws';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return lawCategories.map(cat => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = getLawCategoryBySlug(category);

  if (!cat) {
    return { title: 'Sayfa Bulunamadı | Av. Fethi Güzel' };
  }

  return {
    title: `${cat.name} – ${cat.kanunAdi} | Av. Fethi Güzel Hukuk Portalı`,
    description: cat.description,
    keywords: cat.seoKeywords.join(', '),
    openGraph: {
      title: `${cat.name} | Av. Fethi Güzel`,
      description: cat.description,
      type: 'website',
      locale: 'tr_TR',
    },
    alternates: {
      canonical: `https://avfethiguzel.com/${category}`,
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
          <nav className="flex items-center gap-2 text-sm font-data text-light/50 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-accent">{cat.name}</span>
          </nav>

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
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${cat.name} – ${cat.kanunAdi}`,
            "description": cat.description,
            "url": `https://avfethiguzel.com/${category}`,
            "author": {
              "@type": "Person",
              "name": "Av. Fethi Güzel",
              "jobTitle": "Avukat & Arabulucu",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Erciş",
                "addressRegion": "Van",
                "addressCountry": "TR"
              }
            }
          })
        }}
      />
    </main>
  );
}
