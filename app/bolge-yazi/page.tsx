import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BOLGE_MAKALELER } from '@/lib/bolge-makaleler';
import { SITE_URL } from '@/lib/profile';
import { BookOpen, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: {
    absolute: 'Bölgesel Hukuki Makaleler | Tarih, Nüfus, Taşınmaz | Av. Fethi Güzel',
  },
  description:
    'Van, Bitlis, Ağrı, Tatvan, Ahlat, Adilcevaz, Çaldıran, Patnos, Muradiye… tarihi hukuki gelişmeler, nüfus ve taşınmaz olayları. Reklam yasağına uygun bilgilendirme makaleleri.',
  keywords: [
    'Van hukuki makale',
    'Bitlis miras hukuku',
    'Ahlat vakıf taşınmaz',
    'Çaldıran kadastro',
    'Tatvan kira hukuku',
    'Doğu Anadolu el birliği mülkiyet',
  ],
  alternates: { canonical: `${SITE_URL}/bolge-yazi` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Bölgesel hukuki makaleler',
    description: 'Yerleşim bağlamlı tarih, nüfus ve taşınmaz hukuku yazıları — bilgilendirme.',
    url: `${SITE_URL}/bolge-yazi`,
  },
};

export default function BolgeYaziHubPage() {
  const byYer = new Map<string, typeof BOLGE_MAKALELER>();
  for (const m of BOLGE_MAKALELER) {
    if (!byYer.has(m.yerlesim)) byYer.set(m.yerlesim, []);
    byYer.get(m.yerlesim)!.push(m);
  }

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Bölgesel hukuki makaleler',
    url: `${SITE_URL}/bolge-yazi`,
    numberOfItems: BOLGE_MAKALELER.length,
  };

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-4xl mx-auto">
        <p className="text-accent font-mono text-[10px] tracking-[0.2em] uppercase mb-3">
          Makale dizisi · ana sayfada listelenmez
        </p>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
          Bölgesel hukuki makaleler
        </h1>
        <p className="text-charcoal/60 text-base sm:text-lg leading-relaxed mb-4 max-w-2xl">
          Van, Bitlis, Ağrı ve ilçelerinde (Tatvan, Ahlat, Adilcevaz, Çaldıran, Patnos, Muradiye, Erciş…)
          tarihi hukuki gelişmeler, nüfus olayları, taşınmaz ve miras pratikleri. Grafikli, makale
          formatında genel bilgilendirme — “X avukat” reklamı değildir.
        </p>
        <p className="text-sm text-charcoal/50 mb-10">
          {BOLGE_MAKALELER.length} yazı · arama motorları ve bu dizin üzerinden keşif ·{' '}
          <Link href="/bilgi" className="text-accent font-semibold hover:underline">
            vatandaş rehberi
          </Link>
        </p>

        {[...byYer.entries()].map(([yer, list]) => (
          <section key={yer} className="mb-12">
            <h2 className="text-lg font-heading font-bold text-charcoal mb-4 flex items-center gap-2 border-b border-charcoal/10 pb-2">
              <MapPin size={16} className="text-accent" />
              {yer}
            </h2>
            <ul className="space-y-3">
              {list.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/bolge-yazi/${m.slug}`}
                    className="group block rounded-2xl border border-charcoal/8 bg-white p-5 hover:border-accent/35 transition-colors"
                  >
                    <div className="flex gap-3">
                      <BookOpen size={18} className="text-accent shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-heading font-bold text-charcoal group-hover:text-accent">
                          {m.h1}
                        </h3>
                        <p className="text-sm text-charcoal/55 mt-1.5 leading-relaxed line-clamp-2">
                          {m.description}
                        </p>
                        <p className="text-[11px] text-charcoal/40 mt-2">
                          ~{m.okumaDk} dk · {m.kategori} · {m.updated}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
