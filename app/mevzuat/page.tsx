import { categories } from '@/lib/categories'
import { getArticlesByCategory } from '@/lib/api'
import Link from 'next/link'

export default function MevzuatPage() {
  return (
    <main className="container" style={{paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh'}}>
      <div className="section-header">
          <span className="section-subtitle">Arama & Filtreleme</span>
          <h2 className="section-title">İçtihat ve Mevzuat Bankası Kategorileri</h2>
          <div className="divider"></div>
          <p className="section-desc" style={{marginLeft: 0}}>
            Türkiye'nin en kapsamlı özel hukuk içtihat ve mevzuat arşivi. Aşağıdaki kategorilerden birini seçerek ilgili kanun maddelerine ve Yargıtay kararlarına ulaşabilirsiniz.
          </p>
      </div>

      <div className="expertise-grid" style={{marginTop: '2rem'}}>
          {categories.map((category) => {
              const articles = getArticlesByCategory(category.slug);
              return (
                  <div className="expertise-card" key={category.id} style={{height: '100%', transition: 'transform 0.3s ease, box-shadow 0.3s ease', display: 'flex', flexDirection: 'column'}}>
                      <Link href={`/kategori/${category.slug}`} style={{textDecoration: 'none', color: 'inherit', flexGrow: 1}}>
                          <div className="card-icon" style={{fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-gold)'}}>
                              <i className={category.icon}></i>
                          </div>
                          <h3 style={{marginBottom: '0.5rem'}}>{category.name}</h3>
                          <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>{category.description}</p>
                      </Link>
                      <details style={{marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>
                          <summary style={{cursor: 'pointer', fontWeight: 'bold', color: 'var(--accent-gold)'}}>Maddeleri Görüntüle ({articles.length})</summary>
                          <div style={{maxHeight: '200px', overflowY: 'auto', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', fontSize: '0.9rem'}}>
                              {articles.map(article => (
                                  <Link href={`/mevzuat/${article.kanunId}/${article.id}`} key={article.id} style={{textDecoration: 'none', color: 'var(--text-primary)', borderBottom: '1px solid var(--bg-main)', paddingBottom: '0.2rem'}}>
                                      {article.title}
                                  </Link>
                              ))}
                          </div>
                      </details>
                  </div>
              )
          })}
      </div>
    </main>
  )
}
