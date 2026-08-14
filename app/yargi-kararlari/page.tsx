import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Yargı Kararları | Borçlar ve Medeni Hukuk',
  description:
    'Yargıtay borçlar ve medeni hukuk emsal karar arşivi. Künye ve tam metin — akademik / bilgilendirme amaçlı.',
  robots: { index: false, follow: false },
};

/**
 * Canlıda arşiv JSON'ları (onlarca MB) henüz Vercel'e yüklenmiyor.
 * Yerel arşiv: data/yargi-kararlari/ + npm run yargi:run
 * Production'da boş durum gösterilir; indeks hazır olunca pointer listesi eklenecek.
 */
export default function YargiKararlariPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <p className="text-sm uppercase tracking-wide text-stone-500">Yargı kararları</p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-900">
            Borçlar ve medeni hukuk emsalleri
          </h1>
          <p className="mt-4 max-w-2xl text-stone-600 leading-relaxed">
            Yargıtay resmi karar aramasından derlenen arşiv. Öncelik: içtihadı birleştirme (Büyük
            Genel Kurulu), Hukuk Genel Kurulu, ardından borçlar ve medeni daire kararları. BAM ve
            ilk derece şimdilik yok. İçerik bilgisayarda birikir; Vercel limiti nedeniyle canlı
            arşiv henüz bağlı değildir. Bilgilendirme amaçlıdır.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/icthat" className="text-accent hover:underline">
              Günlük içtihat
            </Link>
            <span className="text-stone-300">·</span>
            <Link href="/mevzuat/tbk" className="text-accent hover:underline">
              TBK
            </Link>
            <span className="text-stone-300">·</span>
            <Link href="/mevzuat/tmk" className="text-accent hover:underline">
              TMK
            </Link>
          </div>

          <div className="mt-10 rounded-xl border border-dashed border-stone-300 bg-white p-8 text-stone-600">
            <p className="font-medium text-stone-800">Canlı arşiv henüz bağlı değil.</p>
            <p className="mt-2 text-sm leading-relaxed">
              Karar dosyaları yerelde{' '}
              <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">
                data/yargi-kararlari/
              </code>{' '}
              altında birikir (
              <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">
                npm run yargi:run
              </code>
              ). Production&apos;a taşınacak hafif indeks hazır olunca bu sayfada listelenecek.
              Güncel özetler için{' '}
              <Link href="/icthat" className="text-accent hover:underline">
                günlük içtihat
              </Link>{' '}
              bölümünü kullanın.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
