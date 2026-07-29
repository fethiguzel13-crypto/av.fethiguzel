import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { categories } from '@/lib/categories';
import { getArticlesByCategory } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MevzuatSearch from '@/components/MevzuatSearch';
import { BookOpen, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kanun Maddesi ve Mevzuat Arama | 7800+ Madde + Şerh',
  description:
    'Kanun maddesi ara ve oku: 7.800+ madde metni + akademik şerh. TBK, TMK, TTK, TCK, HMK, İİK, VUK, İş Kanunu ve 40+ kanun — ücretsiz açık erişim mevzuat bankası.',
  keywords: [
    'kanun maddesi',
    'kanun maddesi arama',
    'mevzuat arama',
    'TBK madde',
    'TMK madde',
    'TCK madde',
    'HMK madde',
    'İİK madde',
    'akademik şerh',
    'mevzuat bankası',
  ],
  alternates: { canonical: 'https://www.avfethiguzel.com/mevzuat' },
  openGraph: {
    title: 'Kanun Maddesi ve Mevzuat Bankası | 7800+ Madde + Şerh',
    description:
      'Kanun maddesi arama: 45+ kanun, 7.800+ madde metni ve akademik şerh. Açık erişim dijital hukuk arşivi.',
    url: 'https://www.avfethiguzel.com/mevzuat',
  },
};

export default async function MevzuatPage() {
  // Pre-render at build (packs on disk). Avoid force-dynamic — Vercel SSR was 500.
  const cards = await Promise.all(
    categories.map(async (category) => {
      const articles = await getArticlesByCategory(category.slug);
      return { category, articles };
    })
  );

  return (
    <div className="bg-cream min-h-screen font-sans">
      <Navbar />

      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-12 sm:mb-16 text-center">
          <h2 className="text-accent font-heading text-sm tracking-widest uppercase mb-4">Kanun maddesi · Mevzuat arama</h2>
          <h1 className="text-4xl md:text-6xl text-charcoal font-bold mb-6">
            Kanun Maddesi ve <span className="font-drama italic text-accent">Şerh Bankası</span>
          </h1>
          <p className="text-charcoal/60 max-w-2xl mx-auto text-lg mb-10">
            Kanun maddesi arayın: TBK, TMK, TTK, TCK, HMK, İİK ve 40+ kanun —
            resmî madde metni ile akademik şerh aynı sayfada. 7.800+ madde, ücretsiz açık erişim.
          </p>
          <div className="max-w-3xl mx-auto mb-6">
            <MevzuatSearch compact />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Link
              href="/ara"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-accent hover:underline"
            >
              <Search size={14} /> Tam ekran arama
            </Link>
            <Link
              href="/bilgi"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-charcoal/55 hover:text-accent"
            >
              Vatandaş rehberi (550+)
            </Link>
          </div>
          {/* Google exact-match crawl paths: TBK 13, TBK 1, … */}
          <section className="max-w-4xl mx-auto mb-12 text-left rounded-2xl border border-charcoal/8 bg-white/70 p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-3">
              Sık aranan kanun maddeleri
            </h2>
            <p className="text-sm text-charcoal/55 mb-4">
              «TBK 13», «TBK madde 1», «TCK 86» gibi aramalar için doğrudan sayfalar — Av. Fethi Güzel.
            </p>
            <ul className="flex flex-wrap gap-2">
              {[
                { label: 'TBK 1', href: '/mevzuat/tbk/madde-1' },
                { label: 'TBK 13', href: '/mevzuat/tbk/madde-13' },
                { label: 'TBK 49', href: '/mevzuat/tbk/madde-49' },
                { label: 'TBK 112', href: '/mevzuat/tbk/madde-112' },
                { label: 'TBK 125', href: '/mevzuat/tbk/madde-125' },
                { label: 'TMK 1', href: '/mevzuat/tmk/madde-1' },
                { label: 'TMK 166', href: '/mevzuat/tmk/madde-166' },
                { label: 'TCK 86', href: '/mevzuat/tck/madde-86' },
                { label: 'HMK 119', href: '/mevzuat/hmk/madde-119' },
                { label: 'İİK 62', href: '/mevzuat/iik/madde-62' },
                { label: 'Tüm TBK', href: '/mevzuat/tbk' },
                { label: 'Tüm TMK', href: '/mevzuat/tmk' },
                { label: 'Tüm TCK', href: '/mevzuat/tck' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block text-sm px-3 py-1.5 rounded-full bg-cream border border-charcoal/10 font-semibold text-charcoal hover:border-accent hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map(({ category, articles }) => (
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
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
