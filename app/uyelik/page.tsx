import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAccess } from '@/lib/uyelik/session';
import { priceLabel, UYELIK } from '@/lib/uyelik/config';
import CikisButton from '@/components/uyelik/CikisButton';

/*
  Oturum çerezi burada TAZELENMEZ.

  Bu sayfa bir Server Component; Next.js render sırasında çerez yazmayı
  yasaklar ve cookies().set() çağrısı isteği 500e düşürür. Hata yalnız
  OTURUM AÇMIŞ ziyaretçide görülüyordu: anonim ziyaretçide user boş olduğu
  için satır hiç çalışmıyor, üyede ise sayfa her açılışta, yani her
  yenilemede patlıyordu.

  Tazeleme buna izin verilen tek yere taşındı: /api/uyelik/ben route
  handler. Çerezin ömrü zaten girişte 180 güne kuruluyor; sayfa görüntüsü
  başına yeniden yazmanın işlevsel bir karşılığı yoktu.
*/

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Yargıtay arşivi üyeliği',
  description: `Yargıtay karar arşivine aylık erişim. ${priceLabel()} / ${UYELIK.periodDays} gün. Kararlar sitede okunur; indirme yoktur.`,
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.avfethiguzel.com/uyelik' },
};

export default async function UyelikPage() {
  const { publicUser, user, member } = await getAccess();

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

          {publicUser ? (
            <div className="mt-8 rounded-3xl bg-white border border-charcoal/10 p-6 space-y-3">
              <p className="text-sm">
                <span className="text-charcoal/45">Hesap:</span>{' '}
                <strong>{publicUser.email}</strong>
              </p>
              <p className="text-sm">
                <span className="text-charcoal/45">Durum:</span>{' '}
                {member
                  ? `Açık — ${publicUser.membershipUntil ? new Date(publicUser.membershipUntil).toLocaleDateString('tr-TR') : ''}`
                  : publicUser.durum === 'pending'
                    ? `Havale bekleniyor (${publicUser.pendingRef})`
                    : 'Kapalı'}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {member ? (
                  <Link href="/yargi-kararlari" className="btn-primary">
                    Arşivi aç
                  </Link>
                ) : (
                  <Link href="/uyelik/odeme" className="btn-primary">
                    Ödeme — {priceLabel()}
                  </Link>
                )}
                <CikisButton />
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/uyelik/kayit" className="btn-primary justify-center">
                Üye ol
              </Link>
              <Link
                href="/uyelik/giris"
                className="inline-flex items-center justify-center border border-charcoal/15 px-6 py-3.5 rounded-full text-sm font-bold hover:border-accent hover:text-accent"
              >
                Giriş
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
