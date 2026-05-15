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
          {/* Resmi Metin Kutusu (Koyu Yeşil — sitenin primary rengi, göze yumuşak) */}
          <section className="article-section-official mb-16">
            <div className="bg-primary rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.07]">
                <Book size={120} className="text-cream" />
              </div>

              <div className="flex items-center gap-3 text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-8">
                <span className="w-8 h-px bg-accent/40"></span>
                RESMİ METİN
              </div>

              <div
                className="prose prose-invert prose-lg max-w-none
                           text-cream/95
                           prose-headings:text-cream prose-headings:font-bold
                           prose-p:text-cream/95 prose-p:leading-[1.95] prose-p:font-light
                           prose-strong:text-accent prose-strong:font-bold
                           prose-hr:border-cream/15
                           prose-li:text-cream/95"
                dangerouslySetInnerHTML={{ __html: articleData.officialHtml }}
              />
            </div>
          </section>

          {/* Yorum ve Analiz Kutusu (Açık krem zemin, sol kenarda accent şerit — net ayrım) */}
          {articleData.commentaryHtml && (
            <section className="article-section-commentary mb-16">
              <div className="bg-cream/60 border border-charcoal/10 rounded-[2.5rem] p-8 md:p-16 shadow-sm relative overflow-hidden">
                {/* Sol üstte accent şerit — net görsel ayrım */}
                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-accent via-accent/70 to-transparent"></div>

                <div className="flex items-center gap-3 text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-16 mt-4">
                  <span className="w-12 h-px bg-accent/40"></span>
                  AKADEMİK YORUM VE ANALİZ
                  <span className="flex-1 h-px bg-accent/15"></span>
                </div>

                <div
                  className="commentary-prose prose prose-lg prose-charcoal max-w-3xl mx-auto
                             prose-p:text-charcoal/85 prose-p:text-[17px]
                             prose-headings:font-heading prose-headings:text-charcoal prose-headings:font-bold prose-headings:tracking-tight
                             prose-strong:text-charcoal prose-strong:font-bold
                             prose-em:text-charcoal/90 prose-em:italic
                             prose-li:text-charcoal/85
                             prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-white prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:shadow-sm
                             prose-hr:border-charcoal/10
                             prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
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
