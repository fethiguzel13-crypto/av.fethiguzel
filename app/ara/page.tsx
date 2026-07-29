import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MevzuatSearch from '@/components/MevzuatSearch';
import { parseMaddeQuery } from '@/lib/parse-madde-query';

export const metadata: Metadata = {
  title: {
    absolute: 'Kanun Maddesi Arama — 7800+ Madde, Şerh, Hesaplama | Av. Fethi Güzel',
  },
  description:
    'Kanun maddesi arama: TBK 13, TMK, TCK, HMK, İİK… 7.800+ madde metni + akademik şerh. Av. Fethi Güzel Hukuk Portalı.',
  keywords: [
    'kanun maddesi arama',
    'kanun maddesi',
    'mevzuat arama',
    'TBK 13',
    'TBK madde ara',
    'TCK madde ara',
    'madde metni',
    'akademik şerh arama',
  ],
  alternates: { canonical: 'https://www.avfethiguzel.com/ara' },
  openGraph: {
    title: 'Kanun Maddesi Arama | Av. Fethi Güzel',
    description:
      'Kanun maddesi arama: TBK 13, satım, kıdem… madde metni + şerh. Av. Fethi Güzel.',
    url: 'https://www.avfethiguzel.com/ara',
  },
  robots: { index: true, follow: true },
};

type Props = { searchParams: Promise<{ q?: string }> };

/**
 * «TBK 13» gibi tam madde sorgularında Googlebot ve kullanıcıyı
 * doğrudan kanonik madde sayfasına alır (SSR, JS gerekmez).
 */
export default async function AraPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp?.q?.trim() || '';
  const exact = parseMaddeQuery(q);
  if (exact) {
    redirect(exact.href);
  }

  return (
    <div className="bg-cream min-h-screen font-sans">
      <Navbar />
      <main className="pt-36 sm:pt-40 pb-20 px-5 sm:px-6 max-w-4xl mx-auto">
        <header className="mb-10 sm:mb-14 text-center">
          <p className="section-label mb-3">Kanun maddesi arama motoru</p>
          <h1 className="text-3xl sm:text-5xl text-charcoal font-bold mb-4 text-balance">
            Kanun Maddesi <span className="font-drama italic text-accent">Ara</span>
          </h1>
          <p className="text-charcoal/55 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            Kanun maddesi aramak için kelime veya madde no yazın. Örn.{' '}
            <Link
              href="/mevzuat/tbk/madde-13"
              className="text-charcoal/70 font-semibold hover:text-accent underline-offset-2 hover:underline"
            >
              TBK 13
            </Link>
            ,{' '}
            <Link
              href="/mevzuat/tbk/madde-125"
              className="text-charcoal/70 font-semibold hover:text-accent underline-offset-2 hover:underline"
            >
              TBK 125
            </Link>
            ,{' '}
            <strong className="text-charcoal/70 font-semibold">kıdem</strong> —
            ilgili madde metinleri, şerhler ve hesaplama araçları listelenir.
          </p>
          {/* Googlebot için taranabilir hızlı linkler (JS aramasından bağımsız) */}
          <nav
            className="mt-6 flex flex-wrap justify-center gap-2"
            aria-label="Sık aranan maddeler"
          >
            {[
              ['TBK 1', '/mevzuat/tbk/madde-1'],
              ['TBK 13', '/mevzuat/tbk/madde-13'],
              ['TBK 49', '/mevzuat/tbk/madde-49'],
              ['TBK 125', '/mevzuat/tbk/madde-125'],
              ['TMK 166', '/mevzuat/tmk/madde-166'],
              ['TCK 86', '/mevzuat/tck/madde-86'],
              ['HMK 119', '/mevzuat/hmk/madde-119'],
              ['Tüm TBK', '/mevzuat/tbk'],
              ['Vatandaş rehberi', '/bilgi'],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-white border border-charcoal/10 font-semibold text-charcoal hover:border-accent hover:text-accent"
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-charcoal/5" />}>
          <MevzuatSearch autoFocus initialQuery={q} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
