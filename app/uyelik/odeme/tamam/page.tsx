import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAccess, setSessionCookie } from '@/lib/uyelik/session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Üyelik açıldı',
  robots: { index: false, follow: false },
};

export default async function OdemeTamamPage() {
  const { user, member, publicUser } = await getAccess();
  if (user) await setSessionCookie(user);
  if (!publicUser) redirect('/uyelik/giris');

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream pt-36 pb-20 px-5 sm:px-6">
        <div className="max-w-md mx-auto">
          <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">Tamam</p>
          <h1 className="text-3xl font-heading font-bold text-charcoal">
            {member ? 'Arşiv açık.' : 'Ödeme alındı, onay bekleniyor.'}
          </h1>
          <p className="mt-3 text-sm text-charcoal/60 leading-relaxed">
            {member
              ? 'Karar metinleri sitede okunur; indirme yoktur.'
              : 'Havale onaylanınca erişim açılır. Aynı tarayıcıda oturumunuz duruyor.'}
          </p>
          <Link href={member ? '/yargi-kararlari' : '/uyelik'} className="btn-primary mt-8 inline-flex">
            {member ? 'Arşive git' : 'Hesabıma dön'}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
