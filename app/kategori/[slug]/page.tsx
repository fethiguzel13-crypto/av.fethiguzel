import { getArticlesByCategory } from '@/lib/api'
import { getCategoryBySlug, categories } from '@/lib/categories'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryArticles.map(({ id, kanunId, title, kanun }) => (
              <Link href={`/mevzuat/${kanunId}/${id}`} key={`${kanunId}-${id}`} className="group">
                <div className="h-full p-10 bg-white border border-charcoal/5 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest mb-4 block">{kanun}</span>
                    <h4 className="text-xl font-heading font-bold text-charcoal mb-4 group-hover:text-accent transition-colors">{title}</h4>
                  </div>
                  <div className="pt-8 border-t border-charcoal/5 mt-8 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-charcoal/40 tracking-widest uppercase">AKADEMİK İNCELEME</span>
                    <ArrowLeft size={16} className="rotate-180 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
