import { getArticleData, getAllArticles } from '@/lib/api'
import Link from 'next/link'
import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ArrowLeft, Book, Share2 } from 'lucide-react'

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

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      
      <main className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
        <Link 
          href="/mevzuat" 
          className="group flex items-center gap-2 text-accent font-bold text-xs tracking-widest uppercase mb-12 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} /> MEVZUAT BANKASINA DÖN
        </Link>

        <article className="bg-white border border-charcoal/5 rounded-[3rem] p-8 md:p-16 shadow-sm">
          <header className="mb-12">
            <div className="flex items-center gap-3 text-accent font-mono text-[10px] tracking-[0.2em] uppercase mb-4">
              <Book size={14} />
              <span>{articleData.kanun}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-charcoal leading-tight">
              {articleData.title}
            </h1>
          </header>
          
          <div 
            className="prose prose-lg prose-charcoal max-w-none 
                       prose-headings:font-heading prose-headings:text-charcoal
                       prose-p:text-charcoal/80 prose-p:leading-[1.8]
                       prose-strong:text-charcoal prose-strong:font-bold
                       prose-hr:border-charcoal/10"
            dangerouslySetInnerHTML={{ __html: articleData.contentHtml }} 
          />

          <div className="mt-16 pt-8 border-t border-charcoal/5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-charcoal/5 rounded-full flex items-center justify-center text-charcoal/40">
                <Share2 size={14} />
              </div>
              <span className="text-[10px] font-bold text-charcoal/40 tracking-widest uppercase">Akademik Paylaşım</span>
            </div>
            <span className="text-[10px] font-mono text-charcoal/20">ID: {articleData.id}</span>
          </div>
        </article>

        <div className="mt-20 p-12 bg-charcoal rounded-[2rem] text-center">
          <h3 className="text-cream font-heading text-2xl font-bold mb-4">Metodolojik Analiz</h3>
          <p className="text-cream/60 max-w-xl mx-auto text-sm leading-relaxed mb-0">
            Bu madde, Av. Fethi Güzel'in özel hukuk doktora çalışmaları kapsamında akademik olarak analiz edilmektedir. 
            Güncel içtihat ve doktrin görüşleri periyodik olarak güncellenmektedir.
          </p>
        </div>
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
