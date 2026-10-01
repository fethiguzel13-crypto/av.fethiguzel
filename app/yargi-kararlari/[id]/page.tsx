import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import YargiKararSayfasi from '@/components/YargiKararSayfasi';

export const metadata: Metadata = {
  title: 'Yargıtay kararı | Yargıtay Arşivi',
  robots: { index: false, follow: true },
};

// Kabuk sayfa: karar metni istemcide üyelik denetimli /api/yargi/karar/[id]'den gelir; sunucu çizimi kimliğe
// bağlı değildir. Boş liste → her kimlik ilk ziyarette bir kez çizilir ve önbellekten sunulur (ISR); önceden
// her istek ayrı fonksiyon çağrısıydı (Aylık plan G00 — Vercel kullanımı).
export function generateStaticParams() {
  return [];
}

export default function YargiKararPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream pt-36 pb-20 px-5 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <YargiKararSayfasi />
        </div>
      </main>
      <Footer />
    </>
  );
}
