import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import YonetimPaneli from '@/components/uyelik/YonetimPaneli';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Üyelik yönetimi',
  robots: { index: false, follow: false },
};

export default function YonetimPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream pt-36 pb-20 px-5 sm:px-6">
        <div className="max-w-xl mx-auto">
          <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">Yönetim</p>
          <h1 className="text-3xl font-heading font-bold text-charcoal mb-6">Havale onayları</h1>
          <YonetimPaneli />
        </div>
      </main>
      <Footer />
    </>
  );
}
