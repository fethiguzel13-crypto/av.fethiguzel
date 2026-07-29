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
  // Borçlar Genel üçlü paket — öncelikli fakültelerde mutlaka SSG
  const borclarTriple = all.filter(
    (p) =>
      priority.has(p.uni) &&
      (p.ders === 'borclar-genel-donem-1' ||
        p.ders === 'borclar-genel-donem-2' ||
        p.ders === 'borclar-genel-yillik' ||
        p.ders === 'borclar-ozel-donem-1' ||
        p.ders === 'borclar-ozel-donem-2' ||
        p.ders === 'borclar-ozel-yillik' ||
        p.ders === 'esya-hukuku-donem-1' ||
        p.ders === 'esya-hukuku-donem-2' ||
        p.ders === 'esya-hukuku-yillik' ||
        p.ders === 'miras-hukuku-donem-1' ||
        p.ders === 'miras-hukuku-donem-2' ||
        p.ders === 'miras-hukuku-yillik' ||
        p.ders === 'tmk-1-kitap-donem-1' ||
        p.ders === 'tmk-1-kitap-donem-2' ||
        p.ders === 'tmk-1-kitap-yillik' ||
        p.ders === 'tmk-2-kitap-donem-1' ||
        p.ders === 'tmk-2-kitap-donem-2' ||
        p.ders === 'tmk-2-kitap-yillik' ||
        p.ders === 'hmk-donem-1' ||
        p.ders === 'hmk-donem-2' ||
        p.ders === 'hmk-yillik' ||
        p.ders === 'icra-donem-1' ||
        p.ders === 'icra-donem-2' ||
        p.ders === 'icra-yillik' ||
        p.ders === 'iflas-donem-1' ||
        p.ders === 'iflas-donem-2' ||
        p.ders === 'iflas-yillik' ||
        p.ders === 'sirketler-donem-1' ||
        p.ders === 'sirketler-donem-2' ||
        p.ders === 'sirketler-yillik')
  );
  const rest = all.filter((p) => !priority.has(p.uni)).slice(0, 200);
  const seen = new Set<string>();
  const out: { uni: string; ders: string }[] = [];
  for (const p of [...borclarTriple, ...first, ...rest]) {
    const k = `${p.uni}/${p.ders}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  return out;
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
