import { getArticleData, getNavigationInfo } from '@/lib/api'
import Link from 'next/link'
import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Book, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import ArticleToc from '@/components/ArticleToc'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{
    kanunId: string
    id: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  try {
    const articleData = await getArticleData(resolvedParams.kanunId, resolvedParams.id)
    return {
      title: `${articleData.title} | Av. Fethi Güzel — Akademik Şerh`,
      description: `${articleData.title}: resmî madde metni ve akademik şerh. Av. Fethi Güzel dijital hukuk kütüphanesi.`,
      openGraph: {
        title: `${articleData.title} | Av. Fethi Güzel`,
        description: `${articleData.kanun} — akademik madde şerhi ve resmî metin.`,
        type: 'article',
      },
    }
  } catch {
    return { title: 'Madde | Av. Fethi Güzel' }
  }
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params

  let articleData: Awaited<ReturnType<typeof getArticleData>>
  try {
    articleData = await getArticleData(resolvedParams.kanunId, resolvedParams.id)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return (
      <div className="min-h-screen bg-cream pt-40 px-6">
        <Navbar />
        <div className="max-w-xl mx-auto p-8 rounded-2xl border border-red-200 bg-white text-charcoal">
          <h1 className="text-xl font-bold mb-2">İçerik yüklenemedi</h1>
          <p className="text-sm text-charcoal/70 mb-4">
            {resolvedParams.kanunId}/{resolvedParams.id}
          </p>
          <pre className="text-xs whitespace-pre-wrap bg-charcoal/5 p-4 rounded-xl overflow-auto">
            {message}
          </pre>
          <Link href="/mevzuat" className="inline-block mt-6 text-accent font-bold text-sm">
            ← Mevzuata dön
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const navInfo = await getNavigationInfo(resolvedParams.kanunId, articleData.maddeNo)
  const breadcrumb = `Ana Sayfa / ${articleData.kanun} / ${articleData.title}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleData.title,
    about: articleData.kanun,
    inLanguage: 'tr-TR',
    author: { '@type': 'Person', name: 'Av. Fethi Güzel' },
    publisher: {
      '@type': 'Organization',
      name: 'Av. Fethi Güzel Hukuk Portalı',
      url: 'https://avfethiguzel.com',
    },
    mainEntityOfPage: `https://avfethiguzel.com/mevzuat/${resolvedParams.kanunId}/${resolvedParams.id}`,
  }

  return (
    <div className="bg-cream min-h-screen selection:bg-accent selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <div className="fixed top-20 left-0 w-full z-40 bg-cream/80 backdrop-blur-md border-b border-charcoal/5">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-4">
          <div className="flex-1 flex justify-start">
            {navInfo.prev ? (
              <Link
                href={`/mevzuat/${resolvedParams.kanunId}/${navInfo.prev.id}`}
                className="group flex items-center gap-2 bg-charcoal/5 hover:bg-charcoal/10 px-4 py-2 rounded-full transition-all"
              >
                <ChevronLeft size={16} className="text-accent" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-charcoal/60">
                  ← Önceki [{navInfo.prev.maddeNo}]
                </span>
              </Link>
            ) : (
              <div className="opacity-30 flex items-center gap-2 px-4 py-2">
                <ChevronLeft size={16} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Önceki</span>
              </div>
            )}
          </div>

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
                className="flex items-center gap-1 text-[9px] font-bold text-accent uppercase tracking-widest"
              >
                <RotateCcw size={10} /> Maddelere Dön
              </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-end">
            {navInfo.next ? (
              <Link
                href={`/mevzuat/${resolvedParams.kanunId}/${navInfo.next.id}`}
                className="group flex items-center gap-2 bg-charcoal/5 hover:bg-charcoal/10 px-4 py-2 rounded-full transition-all"
              >
                <span className="text-[10px] font-bold tracking-widest uppercase text-charcoal/60">
                  [{navInfo.next.maddeNo}] Sonraki →
                </span>
                <ChevronRight size={16} className="text-accent" />
              </Link>
            ) : (
              <div className="opacity-30 flex items-center gap-2 px-4 py-2">
                <span className="text-[10px] font-bold tracking-widest uppercase">Son</span>
                <ChevronRight size={16} />
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="pt-48 pb-20 px-6 max-w-5xl mx-auto">
        <section className="mb-16">
          <div className="bg-primary rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.07]">
              <Book size={120} className="text-cream" />
            </div>
            <div className="flex items-center gap-3 text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-8">
              <span className="w-8 h-px bg-accent/40"></span>
              RESMİ METİN
            </div>
            <div
              className="prose prose-invert prose-lg max-w-none text-cream/95
                         prose-headings:text-cream prose-headings:font-bold
                         prose-p:text-cream/95 prose-p:leading-[1.95] prose-p:font-light
                         prose-strong:text-accent prose-strong:font-bold
                         prose-hr:border-cream/15 prose-li:text-cream/95"
              dangerouslySetInnerHTML={{ __html: articleData.officialHtml }}
            />
          </div>
        </section>

        {articleData.commentaryHtml ? (
          <section className="mb-16">
            <div className="bg-cream/60 border border-charcoal/10 rounded-[2.5rem] p-8 md:p-16 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-accent via-accent/70 to-transparent"></div>
              <div className="flex items-center gap-3 text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-10 mt-4">
                <span className="w-12 h-px bg-accent/40"></span>
                AKADEMİK YORUM VE ANALİZ
                <span className="flex-1 h-px bg-accent/15"></span>
              </div>
              <div className="max-w-3xl mx-auto">
                <ArticleToc />
              </div>
              <div
                className="commentary-prose prose prose-lg prose-charcoal max-w-3xl mx-auto
                           prose-p:text-charcoal/85 prose-p:text-[17px]
                           prose-headings:font-heading prose-headings:text-charcoal prose-headings:font-bold
                           prose-strong:text-charcoal prose-strong:font-bold
                           prose-li:text-charcoal/85
                           prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-white prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-xl"
                dangerouslySetInnerHTML={{ __html: articleData.commentaryHtml }}
              />
            </div>
          </section>
        ) : null}

        <div className="mt-20 p-12 bg-charcoal/5 border border-charcoal/10 rounded-[2rem] text-center">
          <h3 className="text-charcoal font-heading text-xl font-bold mb-4">Metodolojik Not</h3>
          <p className="text-charcoal/60 max-w-xl mx-auto text-sm leading-relaxed mb-0">
            Bu çalışma, <strong>Av. Fethi Güzel</strong> tarafından akademik dürüstlük ilkeleri
            çerçevesinde hazırlanmıştır.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
