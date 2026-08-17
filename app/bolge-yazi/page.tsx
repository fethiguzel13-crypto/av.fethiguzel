import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BOLGE_MAKALELER } from '@/lib/bolge-makaleler';
import { SITE_URL } from '@/lib/profile';
import { BookOpen, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: {
    absolute: 'Bölge Yazıları | Van Gölü Havzası ve Doğu Anadolu Denemeleri',
  },
  description:
    'Van, Bitlis, Ağrı ve ilçelerine dair fotoğraflı denemeler: göl, taş, ova, liman, deprem belleği. Reklam değil; mekânın ruhunu anlatan uzun okumalar.',
  keywords: [
    'Van Gölü deneme',
    'Ahlat Selçuklu mezarlığı yazı',
    'Bitlis vadi',
    'Tatvan feribot',
    'Ağrı Dağı deneme',
    'Doğu Anadolu bellek',
  ],
  alternates: { canonical: `${SITE_URL}/bolge-yazi` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Bölge yazıları — fotoğraflı denemeler',
    description: 'Şehrin ruhu, tarih ve bellek. “X avukat” sayfası değildir.',
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
    name: 'Bölge yazıları',
    url: `${SITE_URL}/bolge-yazi`,
    numberOfItems: BOLGE_MAKALELER.length,
  };

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-4xl mx-auto">
        <p className="text-accent font-mono text-[10px] tracking-[0.2em] uppercase mb-3">
          Deneme dizisi · fotoğraflı
        </p>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
          Bölge yazıları
        </h1>
        <p className="text-charcoal/60 text-base sm:text-lg leading-relaxed mb-3 max-w-2xl">
          Van Gölü havzası, Bitlis vadisi, Ağrı ovası… Burada “Tatvan avukat” türü eşleştirme yok.
          Her yazı, bir yerin rüzgârını, taşını veya belleğini anlatır; hukuki izler metnin içinde
          yeri geldikçe belirir.
        </p>
        <p className="text-sm text-charcoal/50 mb-10">
          {BOLGE_MAKALELER.length} deneme · iş edinme / reklam metni değildir ·{' '}
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
            <ul className="space-y-4">
              {list.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/bolge-yazi/${m.slug}`}
                    className="group grid sm:grid-cols-[140px_1fr] gap-4 rounded-2xl border border-charcoal/[0.08] bg-white p-3 sm:p-4 hover:border-accent/35 transition-colors overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden bg-charcoal/5">
                      <Image
                        src={m.heroPhoto.src}
                        alt={m.heroPhoto.alt}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        sizes="140px"
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0 py-1">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-accent mb-1">
                        {m.eyebrow}
                      </p>
                      <h3 className="font-heading font-bold text-charcoal group-hover:text-accent leading-snug">
                        {m.h1}
                      </h3>
                      <p className="text-sm text-charcoal/55 mt-1.5 leading-relaxed line-clamp-2">
                        {m.description}
                      </p>
                      <p className="text-[11px] text-charcoal/40 mt-2 flex items-center gap-1">
                        <BookOpen size={12} /> ~{m.okumaDk} dk · {m.kategori} · {m.updated}
                      </p>
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
