import type { Metadata } from 'next';
import { paylasimMeta } from '@/lib/paylasim';
import Link from "@/components/SiteLink";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Kirinti from '@/components/Kirinti';
import YargiGate from '@/components/YargiGate';
import { priceLabel } from '@/lib/uyelik/config';
import { siteSayilari, tr } from '@/lib/site-stats';

export const dynamic = 'force-static';

function toplamEtiketi(): string {
  return `${tr(siteSayilari().karar)} Yargıtay kararı`;
}

export function generateMetadata(): Metadata {
  const totalLabel = toplamEtiketi();
  return {
    title: `Yargıtay Karar Arşivi | ${totalLabel}`,
    description: `İçtihadı birleştirme, HGK, CGK ve daire kararları. Aylık üyelik ${priceLabel()}. Kararlar sitede okunur; indirme yoktur.`,
    alternates: { canonical: 'https://www.avfethiguzel.com/yargi-kararlari' },
    ...paylasimMeta({
      baslik: 'Yargıtay Karar Arşivi | Av. Fethi Güzel',
      aciklama: `Üyelikle açılan araştırma arşivi. Aylık ${priceLabel()}.`,
      adres: '/yargi-kararlari',
      tur: 'bolum',
      anahtar: 'yargi-kararlari',
    }),
  };
}

export default function YargiKararlariPage() {
  const totalLabel = toplamEtiketi();

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream pt-36 pb-20 px-5 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Kirinti
            ogeler={[
              { ad: 'Yargıtay karar arşivi', yol: '/yargi-kararlari' },
            ]}
          />
          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-charcoal tracking-tight">
            Yargıtay karar arşivi
          </h1>
          <p className="mt-4 max-w-2xl text-ink-muted leading-relaxed">
            {totalLabel}. Öncelik içtihadı birleştirme, Hukuk Genel Kurulu ve
            Ceza Genel Kurulu&apos;ndadır. Metinler sitede okunur; dosya indirme
            yoktur. Bağlayıcı olan kararın aslıdır.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/icthat" className="text-accent-ink hover:underline">
              Günlük içtihat
            </Link>
            <span className="text-charcoal/20">·</span>
            <Link href="/mevzuat/tbk" className="text-accent-ink hover:underline">
              TBK
            </Link>
            <span className="text-charcoal/20">·</span>
            <Link href="/mevzuat/tmk" className="text-accent-ink hover:underline">
              TMK
            </Link>
            <span className="text-charcoal/20">·</span>
            <Link href="/ara" className="text-accent-ink hover:underline">
              Madde ara
            </Link>
            <span aria-hidden="true" className="text-ink-muted">·</span>
            <Link href="/yargi-kararlari/istatistik" className="text-accent-ink hover:underline">
              Arşiv istatistikleri
            </Link>
          </div>

          <div className="mt-10">
            <YargiGate />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
