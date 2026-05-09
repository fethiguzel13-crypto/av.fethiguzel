import { getLawCategoryBySlug, getLawSubCategoryBySlug } from '@/lib/laws';
import { getArticlesByCategory } from '@/lib/api';
import { categories as oldCategories } from '@/lib/categories';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { lawCategories } from '@/lib/laws';

// Map new sub-category slugs to old category slugs for data lookup
function getOldSlug(parentSlug: string, subSlug: string): string | null {
  const mapping: Record<string, Record<string, string>> = {
    'medeni-hukuk': {
      'baslangic-hukumleri': 'tmk-baslangic',
      'kisiler-hukuku': 'kisiler-hukuku',
      'aile-hukuku': 'aile-hukuku',
      'miras-hukuku': 'miras-hukuku',
      'esya-hukuku': 'esya-hukuku',
    },
    'borclar-hukuku': {
      'genel-hukumler': 'borclar-genel',
      'ozel-hukumler': 'borclar-ozel',
    },
    'ticaret-hukuku': {
      'ticari-isletme-hukuku': 'ticari-isletme',
      'sirketler-hukuku': 'ticari-sirketler',
      'kiymetli-evrak-hukuku': 'kiymetli-evrak',
      'sigorta-hukuku': 'sigorta-hukuku',
    },
  };
  return mapping[parentSlug]?.[subSlug] ?? null;
}

export function generateStaticParams() {
  const params: { category: string; slug: string }[] = [];
  for (const cat of lawCategories) {
    for (const sub of cat.subCategories) {
      params.push({ category: cat.slug, slug: sub.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const parent = getLawCategoryBySlug(category);
  const sub = getLawSubCategoryBySlug(category, slug);

  if (!parent || !sub) {
    return { title: 'Sayfa Bulunamadı | Av. Fethi Güzel' };
  }

  return {
    title: `${sub.name} – ${parent.kanunAdi} | Av. Fethi Güzel`,
    description: sub.description,
    keywords: [...sub.seoKeywords, ...parent.seoKeywords].join(', '),
    openGraph: {
      title: `${sub.name} | Av. Fethi Güzel – Hukuk Portalı`,
      description: sub.description,
      type: 'website',
      locale: 'tr_TR',
    },
    alternates: {
      canonical: `https://avfethiguzel.com/${category}/${slug}`,
    },
  };
}

export default async function SubCategoryPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const parent = getLawCategoryBySlug(category);
  const sub = getLawSubCategoryBySlug(category, slug);

  if (!parent || !sub) {
    notFound();
  }

  // Get articles using old category system
  const oldSlug = getOldSlug(category, slug);
  const articles = oldSlug ? getArticlesByCategory(oldSlug) : [];

  return (
    <main className="min-h-screen bg-primary text-light">
      {/* Hero Banner */}
      <div className="relative pt-32 pb-16 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-data text-light/50 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link href={`/${category}`} className="hover:text-accent transition-colors">{parent.name}</Link>
            <span>/</span>
            <span className="text-accent">{sub.name}</span>
          </nav>

          <span className="text-accent font-data text-sm tracking-[0.2em] uppercase block mb-4">{parent.kanunAdi}</span>
          <h1 className="text-4xl md:text-6xl font-sans font-bold mb-6">{sub.name}</h1>
          <p className="text-light/60 font-sans text-lg max-w-3xl leading-relaxed">
            {sub.description}
          </p>

          {/* SEO: Author attribution */}
          <div className="mt-8 flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 w-max">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="font-drama text-accent font-bold text-lg">FG</span>
            </div>
            <div>
              <p className="font-sans text-sm font-semibold text-light">Av. Fethi Güzel</p>
              <p className="font-sans text-xs text-light/50">Özel Hukuk Uzmanı &amp; Arabulucu – Erciş/Van</p>
            </div>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="px-6 md:px-20 pb-32">
        <div className="max-w-5xl mx-auto">
          {articles.length === 0 ? (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-[2rem]">
              <p className="text-light/50 font-sans text-lg">Bu kategoriye ait kanun maddeleri yakında eklenecektir.</p>
              <p className="text-light/30 font-sans text-sm mt-2">Madde içerikleri ve analizleri üzerinde çalışılmaktadır.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-sans font-bold text-2xl">Kanun Maddeleri</h2>
                <span className="font-data text-accent text-sm">{articles.length} madde</span>
              </div>
              {articles.map((article) => (
                <Link
                  key={`${article.kanunId}-${article.id}`}
                  href={`/${category}/${slug}/${article.id}`}
                  className="group block bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-accent/30 rounded-2xl px-6 py-5 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-data text-accent text-xs bg-accent/10 px-3 py-1 rounded-full">
                        Madde {article.maddeNo}
                      </span>
                      <h3 className="font-sans font-semibold text-light group-hover:text-accent transition-colors">
                        {article.title}
                      </h3>
                    </div>
                    <span className="text-light/30 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 text-lg">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schema.org SEO Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${sub.name} – ${parent.kanunAdi}`,
            "description": sub.description,
            "url": `https://avfethiguzel.com/${category}/${slug}`,
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
            },
            "publisher": {
              "@type": "Organization",
              "name": "Av. Fethi Güzel Hukuk Portalı"
            }
          })
        }}
      />
    </main>
  );
}
