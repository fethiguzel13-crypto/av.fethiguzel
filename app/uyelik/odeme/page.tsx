import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OdemeSayfasi from '@/components/uyelik/OdemeSayfasi';
import { priceLabel } from '@/lib/uyelik/config';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Üyelik ödemesi',
  robots: { index: false, follow: false },
};

export default function OdemePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream pt-36 pb-20 px-5 sm:px-6">
        <div className="max-w-md mx-auto">
          <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">Ödeme</p>
          <h1 className="text-3xl font-heading font-bold text-charcoal mb-2">
            Arşivi aç — {priceLabel()}
          </h1>
          <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-white border border-charcoal/10" />}>
            <OdemeSayfasi />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
