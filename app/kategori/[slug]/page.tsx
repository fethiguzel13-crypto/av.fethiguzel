import { getArticlesByCategory } from '@/lib/api'
import { getCategoryBySlug, categories } from '@/lib/categories'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CategoryArticleList from '@/components/CategoryArticleList'
import { ArrowLeft, BookOpen, Scale } from 'lucide-react'

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export default async function KategoriPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const categoryArticles = getArticlesByCategory(slug)

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <Link
          href="/mevzuat"
          className="group flex items-center gap-2 text-accent font-bold text-xs tracking-widest uppercase mb-12 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} /> TÜM KATEGORİLERE DÖN
        </Link>

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
