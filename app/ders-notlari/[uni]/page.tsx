import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UniHubView } from '@/components/DersNotuView';
import { getAllUniSlugs, getHub, getNotesForUni } from '@/lib/ders-notlari';
import { auditLectureNote } from '@/lib/content-quality.mjs';

const SITE = 'https://www.avfethiguzel.com';

type Props = { params: Promise<{ uni: string }> };

export function generateStaticParams() {
  return getAllUniSlugs().map((uni) => ({ uni }));
}

/**
 * Fakülte sayfası, yayınlanabilir en az bir not varsa indekse girer.
 *
 * 84 fakülte sayfasının tamamı aynı ~160 dersi listeliyor ve notların hepsi
 * kalıp metin. Hiçbiri açılamıyorken sayfayı indekste tutmak, Google'a
 * içeriği olmayan 84 giriş kapısı sunmak demektir.
 */
function hasPublishableNote(uniSlug: string): boolean {
  return getNotesForUni(uniSlug).some((n) => auditLectureNote(n).publishable);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uni } = await params;
  const hub = getHub(uni);
  if (!hub) return { title: 'Fakülte bulunamadı' };
  return {
    title: { absolute: `${hub.title} | Av. Fethi Güzel` },
    description: hub.description,
    keywords: [
      `${hub.uni.shortName} hukuk ders notları`,
      ...hub.uni.aliases.map((a) => `${a} ders notları`),
      `${hub.uni.city} hukuk fakültesi not`,
      'ücretsiz hukuk ders notu pdf',
    ],
    alternates: { canonical: `${SITE}/ders-notlari/${uni}` },
    openGraph: {
      title: hub.h1,
      description: hub.description,
      url: `${SITE}/ders-notlari/${uni}`,
    },
    robots: hasPublishableNote(uni)
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
