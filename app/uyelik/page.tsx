import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UyelikDurum from '@/components/uyelik/UyelikDurum';
import { priceLabel, UYELIK } from '@/lib/uyelik/config';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Yargıtay arşivi üyeliği',
  description: `Yargıtay karar arşivine aylık erişim. ${priceLabel()} / ${UYELIK.periodDays} gün. Kararlar sitede okunur; indirme yoktur.`,
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.avfethiguzel.com/uyelik' },
};

export default function UyelikPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream pt-36 pb-20 px-5 sm:px-6">
        <div className="max-w-xl mx-auto">
          <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">Arşiv üyeliği</p>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal">
            Yargıtay arşivi
          </h1>
          <p className="mt-3 text-charcoal/60 text-sm leading-relaxed">
            Aylık {priceLabel()}. Mevzuat ve rehber ücretsizdir; bu plan yalnız karar
            arşivini açar. İndirme yoktur.
          </p>
          <UyelikDurum />
        </div>
      </main>
      <Footer />
    </>
  );
}
