import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OdemePaneli from '@/components/uyelik/OdemePaneli';
import { getAccess } from '@/lib/uyelik/session';
import { iyzicoConfigured, priceLabel } from '@/lib/uyelik/config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Üyelik ödemesi',
  robots: { index: false, follow: false },
};

export default async function OdemePage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string }>;
}) {
  const { publicUser, member } = await getAccess();
  if (!publicUser) redirect('/uyelik/giris?next=/uyelik/odeme');
  if (member) redirect('/yargi-kararlari');
  const q = await searchParams;

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream pt-36 pb-20 px-5 sm:px-6">
        <div className="max-w-md mx-auto">
          <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">Ödeme</p>
          <h1 className="text-3xl font-heading font-bold text-charcoal mb-2">
            Arşivi aç — {priceLabel()}
          </h1>
          <p className="text-sm text-charcoal/55 mb-6">
            {publicUser.email}
          </p>
          {q.durum === 'hata' ? (
            <p className="mb-4 text-sm font-semibold text-accent">Ödeme tamamlanamadı. Yeniden deneyin.</p>
          ) : null}
          {q.durum === 'hesap' ? (
            <p className="mb-4 text-sm font-semibold text-accent">Hesap eşleşmedi. Giriş yapıp tekrar deneyin.</p>
          ) : null}
          <OdemePaneli
            iyzicoReady={iyzicoConfigured()}
            havaleReady={true}
            pendingRef={publicUser.pendingRef}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
