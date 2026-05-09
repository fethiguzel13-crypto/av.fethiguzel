import { getArticleData, getAllArticles } from '@/lib/api'
import Link from 'next/link'
import { Metadata } from 'next'

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
    title: `${articleData.title} | İçtihat Bankası - Av. Fethi Güzel`,
    description: `${articleData.title} ile ilgili detaylı açıklamalar ve emsal Yargıtay kararları.`,
  }
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const articleData = await getArticleData(resolvedParams.kanunId, resolvedParams.id)

  return (
    <main className="container" style={{paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', maxWidth: '800px'}}>
      
      <Link href="/mevzuat" style={{color: 'var(--accent-gold)', marginBottom: '2rem', display: 'inline-block', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px'}}>
        &larr; Mevzuat Bankasına Dön
      </Link>

      <article style={{background: 'var(--bg-secondary)', padding: '3rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)'}}>
        <div className="section-header" style={{marginBottom: '2rem'}}>
            <span className="section-subtitle">{articleData.kanun}</span>
            <h1 style={{fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem', fontFamily: 'var(--font-heading)'}}>
              {articleData.title}
            </h1>
            <div className="divider"></div>
        </div>
        
        <div 
          style={{fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)'}}
          dangerouslySetInnerHTML={{ __html: articleData.contentHtml }} 
        />
      </article>

      <div style={{marginTop: '4rem', padding: '2rem', background: 'var(--bg-main)', border: '1px solid var(--accent-gold)', borderRadius: '8px', textAlign: 'center'}}>
        <h3 style={{color: 'var(--text-primary)', marginBottom: '1rem', fontFamily: 'var(--font-heading)'}}>Bu Konuda Hukuki Desteğe mi İhtiyacınız Var?</h3>
        <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>Uzman avukat ve arabulucu Fethi Güzel ile iletişime geçin.</p>
        <Link href="/#iletisim" className="btn btn-primary">İletişime Geç</Link>
      </div>
    </main>
  )
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({
    kanunId: article.kanunId,
    id: article.id,
  }))
}
