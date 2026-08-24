import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OdemeTamam from '@/components/uyelik/OdemeTamam';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Üyelik açıldı',
  robots: { index: false, follow: false },
};

export default function OdemeTamamPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream pt-36 pb-20 px-5 sm:px-6">
        <div className="max-w-md mx-auto">
          <OdemeTamam />
        </div>
      </main>
      <Footer />
    </>
  );
}
