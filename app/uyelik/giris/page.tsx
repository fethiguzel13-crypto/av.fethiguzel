import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthForm from '@/components/uyelik/AuthForm';
import { getAccess } from '@/lib/uyelik/session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Üye girişi',
  robots: { index: false, follow: true },
};

export default async function GirisPage() {
  const { publicUser, member } = await getAccess();
  if (member) redirect('/yargi-kararlari');
  if (publicUser) redirect('/uyelik/odeme');

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream pt-36 pb-20 px-5 sm:px-6">
        <div className="max-w-md mx-auto">
          <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">Arşiv</p>
          <h1 className="text-3xl font-heading font-bold text-charcoal mb-2">Giriş</h1>
          <p className="text-sm text-charcoal/55 mb-8">
            Hesabınız yoksa{' '}
            <Link href="/uyelik/kayit" className="text-accent font-semibold hover:underline">
              üye olun
            </Link>
            .
          </p>
          <AuthForm mode="giris" />
        </div>
      </main>
      <Footer />
    </>
  );
}
