import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  VATANDAS_ARTICLES,
  getVatandasCategories,
} from '@/lib/vatandas-rehberi';
import { BookOpen } from 'lucide-react';

const SITE = 'https://www.avfethiguzel.com';

export const metadata: Metadata = {
  title: 'Vatandaş Bilgi Rehberi | 500+ Sık Aranan Hukuki Konu',
  description:
    '500+ vatandaş rehberi: emlak vergisi, veraset, boşanma, icra, kira, kıdem, trafik cezası, kanun maddesi, e-Devlet ve Google’da en çok aranan hukuki konular. Av. Fethi Güzel.',
  keywords: [
    'hukuki bilgi',
    'vatandaş rehberi',
    'sık sorulan hukuki sorular',
    'kanun maddesi',
    'dava nasıl açılır',
    'icra takibi',
    'kıdem tazminatı',
    'boşanma davası',
  ],
  alternates: { canonical: `${SITE}/bilgi` },
  openGraph: {
    title: 'Vatandaş Bilgi Rehberi | 500+ Konu',
    description: 'Google’da en çok aranan 500+ hukuki ve idari konuda sade, detaylı bilgilendirme.',
    url: `${SITE}/bilgi`,
  },
  robots: { index: true, follow: true },
};

export default function BilgiIndexPage() {
  const categories = getVatandasCategories();
  const byCat = categories.map((cat) => ({
    cat,
    items: VATANDAS_ARTICLES.filter((a) => a.category === cat),
  }));

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-4xl mx-auto">
        <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
          SEO bilgilendirme arşivi
        </p>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
          Vatandaş bilgi rehberi
        </h1>
        <p className="text-charcoal/60 text-sm sm:text-base leading-relaxed mb-4 max-w-2xl">
          Emlak vergisi, veraset ilamı, trafik cezasına itiraz, idari ve hukuk davası, engelli
          aracı, icra, nafaka ve onlarca sık aranan konuda adım adım bilgilendirme. Metinler genel
          bilgilendirme amaçlıdır; somut dosyada avukata danışılmalıdır.
        </p>
        <p className="text-[12px] text-charcoal/45 mb-10">
          {VATANDAS_ARTICLES.length} rehber · Türkiye’de en çok aranan hukuki/idari konular · Ana
          sayfada öne çıkarılmaz; sitemap.xml ve bu dizin üzerinden indekslenir.
        </p>

        <div className="space-y-10">
          {byCat.map(({ cat, items }) => (
            <section key={cat}>
              <h2 className="text-lg font-heading font-bold text-charcoal mb-4 border-b border-charcoal/10 pb-2">
                {cat}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {items.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/bilgi/${a.slug}`}
                      className="block h-full rounded-2xl border border-charcoal/8 bg-white/50 hover:bg-white hover:border-accent/30 p-4 transition-colors"
                    >
                      <div className="flex gap-2 items-start">
                        <BookOpen className="text-accent shrink-0 mt-0.5" size={16} />
                        <div>
                          <h3 className="font-semibold text-charcoal text-sm leading-snug mb-1">
                            {a.h1}
                          </h3>
                          <p className="text-[12px] text-charcoal/50 line-clamp-2">{a.description}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
