import { getArticleData, getAllArticles, getNavigationInfo } from '@/lib/api'
import Link from 'next/link'
import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ArrowLeft, ArrowRight, Book, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import ArticleClient from './ArticleClient'

type Props = {
  params: Promise<{
    kanunId: string
    id: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const articleData = await getArticleData(resolvedParams.kanunId, resolvedParams.id)
  return {
    title: `${articleData.title} | Fethi Güzel Akademik Arşiv`,
    description: `${articleData.title} maddesi ve akademik analizi.`,
  }
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const articleData = await getArticleData(resolvedParams.kanunId, resolvedParams.id)
  const navInfo = getNavigationInfo(resolvedParams.kanunId, articleData.maddeNo)

  const breadcrumb = `Ana Sayfa / ${articleData.kanun} / ${articleData.title}`

  const NavContent = ({ isFooter = false }) => (
    <div className={`flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-4 ${isFooter ? 'border-t' : 'border-b'} border-charcoal/5`}>
      {/* Sol Uç: Önceki Madde */}
      <div className="flex-1 flex justify-start">
        {navInfo.prev ? (
          <Link 
            href={`/mevzuat/${resolvedParams.kanunId}/${navInfo.prev.id}`}
            className="group flex items-center gap-2 bg-charcoal/5 hover:bg-charcoal/10 px-4 py-2 rounded-full transition-all magnetic-btn"
          >
            <ChevronLeft size={16} className="text-accent" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-charcoal/60">
              ← Önceki Madde [{navInfo.prev.maddeNo}]
            </span>
          </Link>
        ) : (
          <div className="opacity-30 flex items-center gap-2 px-4 py-2">
             <ChevronLeft size={16} />
             <span className="text-[10px] font-bold tracking-widest uppercase">Önceki Bölüm</span>
          </div>
        )}
      </div>

      {/* Orta: Breadcrumb & Title (Sadece Header'da) */}
      {!isFooter && (
        <div className="hidden md:flex flex-col items-center gap-1">
          <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-charcoal/40">
            {breadcrumb}
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-heading font-bold text-charcoal tracking-tight">
              {articleData.title}
            </h1>
            <Link 
              href="/mevzuat"
              className="flex items-center gap-1 text-[9px] font-bold text-accent uppercase tracking-widest hover:translate-x-1 transition-transform"
            >
              <RotateCcw size={10} /> Maddelere Dön
            </Link>
          </div>
        </div>
      )}

      {/* Sağ Uç: Sonraki Madde */}
      <div className="flex-1 flex justify-end">
        {navInfo.next ? (
          <Link 
            href={`/mevzuat/${resolvedParams.kanunId}/${navInfo.next.id}`}
            className="group flex items-center gap-2 bg-charcoal/5 hover:bg-charcoal/10 px-4 py-2 rounded-full transition-all magnetic-btn"
          >
            <span className="text-[10px] font-bold tracking-widest uppercase text-charcoal/60">
              [{navInfo.next.maddeNo}] Sonraki Madde →
            </span>
            <ChevronRight size={16} className="text-accent" />
          </Link>
        ) : (
          <div className="opacity-30 flex items-center gap-2 px-4 py-2">
             <span className="text-[10px] font-bold tracking-widest uppercase">Son Madde</span>
             <ChevronRight size={16} />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="bg-cream min-h-screen selection:bg-accent selection:text-white">
      <Navbar />
      
      {/* Article Header Navigation */}
      <div className="fixed top-20 left-0 w-full z-40 bg-cream/80 backdrop-blur-md">
        <NavContent />
      </div>

      <main className="pt-48 pb-20 px-6 max-w-5xl mx-auto">
        <ArticleClient>
          {/* Resmi Metin Kutusu (Karanlık) */}
          <section className="article-section-official mb-12">
            <div className="bg-charcoal rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Book size={120} className="text-cream" />
              </div>
              
              <div className="flex items-center gap-3 text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-8">
                <span className="w-8 h-px bg-accent/30"></span>
                RESMİ METİN
              </div>

              <div 
                className="prose prose-invert prose-lg max-w-none 
                           prose-p:text-cream/90 prose-p:leading-[1.9] prose-p:font-light
                           prose-strong:text-accent prose-strong:font-bold
                           prose-hr:border-cream/10"
                dangerouslySetInnerHTML={{ __html: articleData.officialHtml }} 
              />
            </div>
          </section>

          {/* Yorum ve Analiz Kutusu (Açık) */}
          {articleData.commentaryHtml && (
            <section className="article-section-commentary mb-16">
              <div className="bg-white border border-charcoal/5 rounded-[2.5rem] p-8 md:p-14 shadow-sm relative">
                <div className="flex items-center gap-3 text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-8">
                  <span className="w-8 h-px bg-accent/30"></span>
                  AKADEMİK YORUM VE ANALİZ
                </div>

                <div 
                  className="prose prose-lg prose-charcoal max-w-none 
                             prose-p:text-charcoal/80 prose-p:leading-[1.9]
                             prose-headings:font-heading prose-headings:text-charcoal
                             prose-strong:text-charcoal prose-strong:font-bold
                             prose-blockquote:border-accent prose-blockquote:bg-charcoal/5 prose-blockquote:p-6 prose-blockquote:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: articleData.commentaryHtml }} 
                />
              </div>
            </section>
          )}

          {/* Alt Navigasyon Barı */}
          <div className="article-footer-nav mt-12">
             <NavContent isFooter={true} />
          </div>

          <div className="mt-20 p-12 bg-charcoal/5 border border-charcoal/10 rounded-[2rem] text-center">
            <h3 className="text-charcoal font-heading text-xl font-bold mb-4">Metodolojik Not</h3>
            <p className="text-charcoal/60 max-w-xl mx-auto text-sm leading-relaxed mb-0">
              Bu çalışma, <strong>Av. Fethi Güzel</strong> tarafından akademik dürüstlük ilkeleri çerçevesinde hazırlanmıştır. 
              İçerik, güncel kanun değişiklikleri ve yüksek yargı kararları ışığında revize edilmektedir.
            </p>
          </div>
        </ArticleClient>
      </main>

      <Footer />
    </div>
  )
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({
    kanunId: article.kanunId,
    id: article.id,
  }))
}
