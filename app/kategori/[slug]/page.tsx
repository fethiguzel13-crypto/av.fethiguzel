import type { Metadata } from 'next'
import { getArticlesByCategory } from '@/lib/api'
import { getCategoryBySlug, categories } from '@/lib/categories'
import Kirinti from '@/components/Kirinti';
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CategoryArticleList from '@/components/CategoryArticleList'
import { BookOpen, Scale } from 'lucide-react'

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }))
}

export const dynamicParams = true;

// Önceden metadata yoktu: sayfa kökün başlığını ve ana sayfa canonical'ını taşıyordu (G06b).
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  return {
    // Sayfanın h1'i ile aynı; kanun adı açıklamada (başlık 65 karakteri aşmasın).
    title: `${category.name} Arşivi`,
    description: `${category.description} ile ilgili akademik incelemeler, güncel mevzuat maddeleri ve emsal Yargıtay kararları.`,
    alternates: { canonical: `https://www.avfethiguzel.com/kategori/${category.slug}` },
  }
}

export default async function KategoriPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const categoryArticles = await getArticlesByCategory(slug)

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <Kirinti
          ogeler={[
            { ad: 'Mevzuat', yol: '/mevzuat' },
            { ad: category.name, yol: `/kategori/${category.slug}` },
          ]}
          className="text-[11px] text-charcoal/40 mb-12 flex flex-wrap gap-1.5"
        />

        <header className="mb-20">
          <div className="flex items-center gap-4 text-accent font-mono text-xs tracking-[0.2em] uppercase mb-4">
            <Scale size={18} />
            <span>MEVZUAT KATEGORİSİ</span>
          </div>
          <h1 className="text-4xl md:text-6xl text-charcoal font-bold mb-6">
            {category.name} <span className="font-drama italic text-accent">Arşivi</span>
          </h1>
          <p className="text-charcoal/60 max-w-3xl text-lg font-sans">
            {category.description} ile ilgili akademik incelemeler, güncel mevzuat maddeleri ve emsal teşkil eden Yargıtay kararları.
          </p>
        </header>

        {categoryArticles.length === 0 ? (
          <div className="bg-white/50 border border-charcoal/5 rounded-[3rem] p-24 text-center">
            <BookOpen size={48} className="mx-auto text-charcoal/10 mb-6" />
            <p className="text-charcoal/40 font-heading text-xl italic">Bu kategoriye ait henüz akademik veri girişi yapılmamıştır.</p>
          </div>
        ) : (
          <CategoryArticleList articles={categoryArticles} />
        )}
      </main>

      <Footer />
    </div>
  )
}
