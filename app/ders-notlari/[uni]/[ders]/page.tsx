import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DersNotuView } from '@/components/DersNotuView';
import { getAllNoteParams, getHub, getNote } from '@/lib/ders-notlari';

const SITE = 'https://www.avfethiguzel.com';

type Props = { params: Promise<{ uni: string; ders: string }> };

/**
 * 3360 notun tamamını SSG etmek Vercel build süresini şişirir.
 * Öncelikli ~600 not önceden üretilir; diğerleri dynamicParams ile runtime.
 */
export function generateStaticParams() {
  const all = getAllNoteParams();
  // Öncelik: bilinen yüksek arama uni slug’ları + ilk dilim
  const priority = new Set([
    'ankara-yildirim-beyazit',
    'ankara',
    'istanbul',
    'marmara',
    'galatasaray',
    'dokuz-eylul',
    'hacettepe',
    'bilkent',
    'koc',
    'tobb-etu',
    'van-yyu',
    'bogazici',
  ]);
  const first = all.filter((p) => priority.has(p.uni));
  const rest = all.filter((p) => !priority.has(p.uni)).slice(0, 200);
  return [...first, ...rest];
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uni, ders } = await params;
  const note = getNote(uni, ders);
  if (!note) return { title: 'Not bulunamadı' };
  return {
    title: { absolute: `${note.title} | Av. Fethi Güzel` },
    description: note.description,
    keywords: note.keywords,
    alternates: { canonical: `${SITE}/ders-notlari/${uni}/${ders}` },
    openGraph: {
      title: note.h1,
      description: note.description,
      url: `${SITE}/ders-notlari/${uni}/${ders}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function DersNotuPage({ params }: Props) {
  const { uni, ders } = await params;
  const note = getNote(uni, ders);
  const hub = getHub(uni);
  if (!note || !hub) notFound();

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <main className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-3xl mx-auto">
        <DersNotuView note={note} hub={hub} />
      </main>
      <Footer />
    </div>
  );
}
