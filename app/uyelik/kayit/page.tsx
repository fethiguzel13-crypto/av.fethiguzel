import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGate from '@/components/uyelik/AuthGate';
import { priceLabel } from '@/lib/uyelik/config';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Arşiv üyeliği — kayıt',
  description: `Yargıtay arşivi için hesap oluşturun. Aylık ${priceLabel()}.`,
};

export default function KayitPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream pt-36 pb-20 px-5 sm:px-6">
        <div className="max-w-md mx-auto">
          <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">Arşiv üyeliği</p>
          <h1 className="text-3xl font-heading font-bold text-charcoal mb-2">Hesap oluştur</h1>
          <p className="text-sm text-charcoal/55 mb-8 leading-relaxed">
            Kayıt ücretsizdir; arşiv {priceLabel()} / 30 gün ile açılır. Hesabınız varsa{' '}
            <Link href="/uyelik/giris" className="text-accent font-semibold hover:underline">
              giriş yapın
            </Link>
            .
          </p>
          <AuthGate mode="kayit" />
        </div>
      </main>
      <Footer />
    </>
  );
}
