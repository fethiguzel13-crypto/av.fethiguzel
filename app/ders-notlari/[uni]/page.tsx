import type { Metadata } from 'next';
import { paylasimMeta } from '@/lib/paylasim';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UniHubView } from '@/components/DersNotuView';
import { getAllUniSlugs, getHub } from '@/lib/ders-notlari';
import { hubDizinde } from '@/lib/ders-notlari/dizin.mjs';
import kanonik from '@/lib/ders-notlari/dizin-kanonik.json';

const SITE = 'https://www.avfethiguzel.com';

type Props = { params: Promise<{ uni: string }> };

export function generateStaticParams() {
  return getAllUniSlugs().map((uni) => ({ uni }));
}

export const dynamicParams = true;

/**
 * Fakülte sayfası, bir dersin temsilci notunu barındırıyorsa indekse girer (G11).
 *
 * 84 fakülte sayfası ad değiştirilerek üretilmiş, aynı ders listesine bağlanıyor;
 * notlar da üniversiteler arasında kopya. Temsilci notu olmayan sayfayı indekste
 * tutmak Google'a içeriği aynı 84 giriş kapısı sunmak demektir.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uni } = await params;
  const hub = getHub(uni);
  if (!hub) return { title: 'Fakülte bulunamadı' };
  return {
    title: { absolute: `${hub.title} | Av. Fethi Güzel` },
    description: hub.description,
    alternates: { canonical: `${SITE}/ders-notlari/${uni}` },
    ...paylasimMeta({ baslik: hub.h1, aciklama: hub.description, adres: `/ders-notlari/${uni}`, tur: 'ders-notu', anahtar: hub.uni.slug }),
    robots: hubDizinde(uni, kanonik)
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function UniDersNotlariPage({ params }: Props) {
  const { uni } = await params;
  const hub = getHub(uni);
  if (!hub) notFound();

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <main className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-3xl mx-auto">
        <UniHubView hub={hub} />
      </main>
      <Footer />
    </div>
  );
}
