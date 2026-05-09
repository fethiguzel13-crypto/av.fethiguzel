import { getLawCategoryBySlug, getLawSubCategoryBySlug, lawCategories } from '@/lib/laws';
import { getArticleData, getArticlesByCategory } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Map new sub-category slugs to old category slugs
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
  const params: { category: string; slug: string; maddeId: string }[] = [];
  for (const cat of lawCategories) {
    for (const sub of cat.subCategories) {
      const oldSlug = getOldSlug(cat.slug, sub.slug);
      if (!oldSlug) continue;
      const articles = getArticlesByCategory(oldSlug);
      for (const article of articles) {
        params.push({
          category: cat.slug,
          slug: sub.slug,
          maddeId: article.id,
        });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string; maddeId: string }> }): Promise<Metadata> {
  const { category, slug, maddeId } = await params;
  const parent = getLawCategoryBySlug(category);
  const sub = getLawSubCategoryBySlug(category, slug);

  if (!parent || !sub) {
    return { title: 'Sayfa Bulunamadı' };
  }

  // Extract madde number from the ID
  const maddeNo = maddeId.replace('madde-', '');

  return {
    title: `${parent.kanunAdi} ${sub.name} Madde ${maddeNo} – Yorum ve Analiz | Av. Fethi Güzel`,
    description: `${parent.kanunAdi} ${sub.name} Madde ${maddeNo} resmi metni, Yargıtay kararları ve Av. Fethi Güzel'in akademik yorumu. Erciş/Van hukuk danışmanlığı.`,
    keywords: [...sub.seoKeywords, `madde ${maddeNo}`, parent.kanunAdi, 'Fethi Güzel', 'Van avukat'].join(', '),
    openGraph: {
      title: `${sub.name} Madde ${maddeNo} | Av. Fethi Güzel`,
      description: `${parent.kanunAdi} Madde ${maddeNo} – Resmi metin ve akademik analiz.`,
      type: 'article',
      locale: 'tr_TR',
    },
    alternates: {
      canonical: `https://avfethiguzel.com/${category}/${slug}/${maddeId}`,
    },
  };
}

export default async function MaddeDetailPage({ params }: { params: Promise<{ category: string; slug: string; maddeId: string }> }) {
  const { category, slug, maddeId } = await params;
  const parent = getLawCategoryBySlug(category);
  const sub = getLawSubCategoryBySlug(category, slug);

  if (!parent || !sub) {
    notFound();
  }

  let articleData;
  try {
    articleData = await getArticleData(sub.kanunId, maddeId);
  } catch {
    notFound();
  }

  // Split content into official text and analysis
  const htmlContent = articleData.contentHtml;
  const analysisSplit = htmlContent.split(/<h3[^>]*>.*?Yorum.*?<\/h3>/i);
  const officialText = analysisSplit[0] || htmlContent;
  const analysisText = analysisSplit.length > 1 ? analysisSplit[1] : '';

  return (
    <main className="min-h-screen bg-primary text-light">
      {/* Header */}
      <div className="pt-32 pb-12 px-6 md:px-20 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-2 text-sm font-data text-light/50 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link href={`/${category}`} className="hover:text-accent transition-colors">{parent.name}</Link>
            <span>/</span>
            <Link href={`/${category}/${slug}`} className="hover:text-accent transition-colors">{sub.name}</Link>
            <span>/</span>
            <span className="text-accent">{articleData.title}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-accent font-data text-xs tracking-[0.2em] uppercase block mb-3">{parent.kanunAdi}</span>
              <h1 className="text-3xl md:text-5xl font-sans font-bold">{articleData.title}</h1>
            </div>
            <Link
              href={`/${category}/${slug}`}
              className="text-sm font-sans text-light/50 hover:text-accent transition-colors flex items-center gap-2 shrink-0"
            >
              ← {sub.name} Maddelerine Dön
            </Link>
          </div>
        </div>
      </div>

      {/* Content: Dual Layout */}
      <div className="px-6 md:px-20 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: Resmi Metin */}
          <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <h2 className="font-sans font-bold text-xl text-light">Resmi Metin</h2>
            </div>
            <article
              className="prose prose-invert prose-sm max-w-none font-sans leading-relaxed
                prose-headings:text-light prose-headings:font-sans
                prose-p:text-light/80 prose-p:leading-relaxed
                prose-strong:text-accent
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: officialText }}
            />
          </div>

          {/* Right: Analiz */}
          <div className="bg-accent/5 border border-accent/20 rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="font-drama text-accent font-bold text-lg">FG</span>
              </div>
              <div>
                <h2 className="font-sans font-bold text-xl text-light">Fethi Güzel&apos;in Yorumu ve Analizi</h2>
                <p className="text-xs font-data text-light/40">Akademik Değerlendirme</p>
              </div>
            </div>
            {analysisText ? (
              <article
                className="prose prose-invert prose-sm max-w-none font-sans leading-relaxed
                  prose-headings:text-light prose-headings:font-sans
                  prose-p:text-light/80 prose-p:leading-relaxed
                  prose-strong:text-accent"
                dangerouslySetInnerHTML={{ __html: analysisText }}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-light/40 font-sans">Bu maddeye ait akademik yorum ve analiz yakında eklenecektir.</p>
                <p className="text-light/25 font-sans text-sm mt-2">İçerik hazırlanma aşamasındadır.</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Schema.org Article Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": articleData.title,
            "description": `${parent.kanunAdi} ${sub.name} ${articleData.title} – Resmi metin ve akademik analiz`,
            "url": `https://avfethiguzel.com/${category}/${slug}/${maddeId}`,
            "author": {
              "@type": "Person",
              "name": "Av. Fethi Güzel",
              "jobTitle": "Avukat & Arabulucu",
              "url": "https://avfethiguzel.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Erciş",
                "addressRegion": "Van",
                "addressCountry": "TR"
              }
            },
            "publisher": {
              "@type": "Organization",
              "name": "Av. Fethi Güzel Hukuk Portalı",
              "url": "https://avfethiguzel.com"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://avfethiguzel.com/${category}/${slug}/${maddeId}`
            },
            "about": {
              "@type": "Legislation",
              "name": parent.kanunAdi,
              "legislationIdentifier": sub.kanunId.toUpperCase()
            }
          })
        }}
      />
    </main>
  );
}
