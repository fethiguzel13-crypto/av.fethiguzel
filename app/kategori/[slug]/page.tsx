import { getArticlesByCategory } from '@/lib/api'
import { getCategoryBySlug, categories } from '@/lib/categories'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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
    <main className="container" style={{paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh'}}>
      <div className="section-header">
          <span className="section-subtitle">Mevzuat Kategorisi</span>
          <h2 className="section-title">{category.name}</h2>
          <div className="divider"></div>
          <p className="section-desc" style={{marginLeft: 0}}>
            {category.description} ile ilgili tüm mevzuat maddeleri ve Yargıtay kararları.
          </p>
      </div>

      <div style={{marginBottom: '2rem'}}>
        <Link href="/mevzuat" className="btn btn-outline" style={{borderColor: 'var(--text-secondary)', color: 'var(--text-secondary)', padding: '0.5rem 1rem', fontSize: '0.9rem'}}>
          &larr; Tüm Kategorilere Dön
        </Link>
      </div>

      {categoryArticles.length === 0 ? (
        <div style={{textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px'}}>
          <p style={{color: 'var(--text-secondary)'}}>Bu kategoriye ait henüz mevzuat maddesi eklenmemiş.</p>
        </div>
      ) : (
        <div className="articles-grid" style={{marginTop: '2rem'}}>
          {categoryArticles.map(({ id, kanunId, title, kanun }) => (
            <Link href={`/mevzuat/${kanunId}/${id}`} key={`${kanunId}-${id}`}>
              <div className="article-card" style={{cursor: 'pointer'}}>
                <div className="article-category">{kanun}</div>
                <h4 style={{fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)'}}>{title}</h4>
                <p style={{color: 'var(--accent-gold)', fontSize: '0.9rem'}}>Yargıtay Kararı ve Hukuki İncelemeyi Oku &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
