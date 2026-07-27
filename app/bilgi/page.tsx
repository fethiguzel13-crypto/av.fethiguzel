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
  title: 'Vatandaş Bilgi Rehberi | Sık Sorulan Hukuki Konular',
  description:
    'Emlak vergisi, veraset ilamı, trafik cezası itirazı, idari dava, boşanma, icra, engelli aracı ve daha fazlası — vatandaşlar için detaylı bilgilendirme rehberleri. Av. Fethi Güzel.',
  alternates: { canonical: `${SITE}/bilgi` },
  openGraph: {
    title: 'Vatandaş Bilgi Rehberi',
    description: 'Google’da en çok aranan hukuki ve idari konularda sade, detaylı bilgilendirme.',
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
          {VATANDAS_ARTICLES.length} rehber · Ana sayfada öne çıkarılmaz; arama motorları ve bu
          dizin üzerinden erişilir.
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
