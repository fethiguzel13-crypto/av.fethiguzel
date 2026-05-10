import React from 'react';
import Link from 'next/link';
import { categories } from '@/lib/categories';
import { getArticlesByCategory } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, Search, Scale } from 'lucide-react';

export default function MevzuatPage() {
  return (
    <div className="bg-cream min-h-screen font-sans">
      <Navbar />
      
      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <h2 className="text-accent font-heading text-sm tracking-widest uppercase mb-4">Dijital Hukuk Kütüphanesi</h2>
          <h1 className="text-4xl md:text-6xl text-charcoal font-bold mb-6">
            Mevzuat ve <span className="font-drama italic text-accent">İçtihat Bankası</span>
          </h1>
          <p className="text-charcoal/60 max-w-2xl mx-auto text-lg">
            Türkiye'nin en kapsamlı özel hukuk arşivinde akademik standartlarda arama yapın. 
            Medeni Hukuk, Borçlar Hukuku ve Ticaret Hukuku dokümanlarına erişin.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const articles = getArticlesByCategory(category.slug);
            return (
              <div key={category.id} className="bg-white/50 border border-charcoal/5 rounded-[2rem] p-8 hover:bg-white transition-all hover:shadow-xl group">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <BookOpen size={24} />
                  </div>
                  <span className="font-mono text-[10px] text-charcoal/40 uppercase tracking-widest">
                    {category.kanunId.toUpperCase()}
                  </span>
                </div>
                
                <h3 className="text-2xl font-heading font-bold text-charcoal mb-4">{category.name}</h3>
                <p className="text-charcoal/60 text-sm mb-8">{category.description}</p>
                
                <div className="space-y-4">
                   <Link 
                     href={`/kategori/${category.slug}`}
                     className="block w-full text-center py-3 bg-charcoal text-white rounded-xl text-sm font-bold hover:bg-accent transition-colors"
                   >
                     TÜMÜNÜ İNCELE
                   </Link>
                   
                   <details className="group/details">
                     <summary className="list-none cursor-pointer text-center text-xs font-bold text-accent tracking-widest flex items-center justify-center gap-2">
                       SON MADDELER ({articles.length})
                       <Search size={14} />
                     </summary>
                     <div className="mt-4 max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                       {articles.slice(0, 20).map(article => (
                         <Link 
                           href={`/mevzuat/${article.kanunId}/${article.id}`} 
                           key={article.id}
                           className="block text-xs text-charcoal/70 hover:text-accent border-b border-charcoal/5 pb-2 transition-colors"
                         >
                           {article.title}
                         </Link>
                       ))}
                       {articles.length > 20 && (
                         <p className="text-[10px] text-center text-charcoal/30 pt-2 italic">...ve daha fazlası</p>
                       )}
                     </div>
                   </details>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
