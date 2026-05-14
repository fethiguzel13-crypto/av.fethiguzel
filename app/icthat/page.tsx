import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { loadDaily } from '@/lib/daily-server';
import IcthatList from '@/components/IcthatList';

export const metadata: Metadata = {
  title: 'Güncel İçtihat & Mevzuat',
  description: 'Yargıtay, Anayasa Mahkemesi, AİHM kararları ve Resmî Gazete mevzuat değişikliklerinin günlük takibi.'
};

export default function IcthatPage() {
  const data = loadDaily();

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h2 className="text-accent font-heading text-sm tracking-widest uppercase mb-4">Günlük Takip</h2>
          <h1 className="text-4xl md:text-6xl text-charcoal font-bold mb-6">
            İçtihat & <span className="font-drama italic text-accent">Mevzuat</span>
          </h1>
          <p className="text-charcoal/60 max-w-2xl mx-auto text-base">
            Yargıtay, Anayasa Mahkemesi, AİHM kararları ve Resmî Gazete'de yayımlanan mevzuat değişikliklerinin günlük takibi.
          </p>
          {data && (
            <p className="text-charcoal/40 text-xs font-mono uppercase tracking-widest mt-4">
              Son güncelleme: {data.dateLabel}
            </p>
          )}
        </header>

        {!data || data.stats.totalItems === 0 ? (
          <div className="text-center py-20 text-charcoal/50">
            <p className="text-lg">Bugün için yeni gelişme bulunmuyor.</p>
          </div>
        ) : (
          <IcthatList data={data} />
        )}
      </main>

      <Footer />
    </div>
  );
}
