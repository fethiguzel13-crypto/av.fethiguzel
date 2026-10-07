import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Kirinti from '@/components/Kirinti';
import YargiKararSayfasi from '@/components/YargiKararSayfasi';
import { findKararRow } from '@/lib/uyelik/karar-text';
import { KARAR_SAYFASI_DIZINDE, kararKimligiGecerli, kararSayfaBilgisi } from '@/lib/yargi-karar-sayfa.mjs';

type Props = { params: Promise<{ id: string }> };

const KADEME: Record<string, string> = {
  yibk: 'İçtihadı Birleştirme',
  hgk: 'Hukuk Genel Kurulu',
  cgk: 'Ceza Genel Kurulu',
};

// Kabuk sayfa: künye ve kararın başı sunucuda yayın indeksinden, tam metin istemcide üyelik denetimli
// /api/yargi/karar/[id]'den gelir. Boş liste → her kimlik ilk ziyarette bir kez çizilir ve önbellekten sunulur
// (ISR; Aylık plan G00 — Vercel kullanımı). İndekste olmayan kimlik 404'tür (G14 adım 4).
export function generateStaticParams() {
  return [];
}

function bilgiAl(id: string) {
  if (!kararKimligiGecerli(id)) return null;
  const satir = findKararRow(id);
  return satir ? { satir, bilgi: kararSayfaBilgisi(satir) } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const bulunan = bilgiAl(id);
  if (!bulunan) return { title: 'Karar bulunamadı', robots: { index: false, follow: false } };
  const { bilgi } = bulunan;
  const adres = `https://www.avfethiguzel.com/yargi-kararlari/${bilgi.id}`;
  return {
    title: bilgi.baslik,
    description: bilgi.aciklama,
    alternates: { canonical: adres },
    robots: { index: KARAR_SAYFASI_DIZINDE, follow: true },
    openGraph: { title: bilgi.kunye, description: bilgi.aciklama, url: adres, type: 'article' },
  };
}

export default async function YargiKararPage({ params }: Props) {
  const { id } = await params;
  const bulunan = bilgiAl(id);
  if (!bulunan) notFound();
  const { satir, bilgi } = bulunan;
  const kademe = KADEME[satir.r] || bilgi.daire;

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream pt-36 pb-20 px-5 sm:px-6">
        <article className="max-w-3xl mx-auto">
          <Kirinti
            ogeler={[
              { ad: 'Yargıtay karar arşivi', yol: '/yargi-kararlari' },
              { ad: bilgi.kunye, yol: `/yargi-kararlari/${bilgi.id}` },
            ]}
          />
          <p className="text-[11px] font-mono uppercase tracking-widest text-accent">
            {kademe}
            {bilgi.tarih ? ` · ${bilgi.tarih}` : ''}
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-heading font-bold leading-snug text-charcoal">{bilgi.kunye}</h1>
          {bilgi.daire && bilgi.daire !== kademe ? <p className="mt-2 text-charcoal/55">{bilgi.daire}</p> : null}
          {bilgi.konu.length ? (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Konu">
              {bilgi.konu.map((k) => (
                <li key={k} className="rounded-full border border-charcoal/15 px-3 py-1 text-[12px] text-charcoal/70">
                  {k}
                </li>
              ))}
            </ul>
          ) : null}
          {bilgi.ozet ? (
            <section className="mt-6 rounded-2xl bg-white border border-charcoal/10 p-6 sm:p-8">
              <h2 className="text-[11px] uppercase tracking-widest text-charcoal/40 mb-3">Kararın başı</h2>
              <p className="text-[15px] leading-relaxed text-charcoal/80">{bilgi.ozet}</p>
            </section>
          ) : null}
          <YargiKararSayfasi />
        </article>
      </main>
      <Footer />
    </>
  );
}
