import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DersNotuView } from '@/components/DersNotuView';
import { getAllNoteParams, getHub, getNote } from '@/lib/ders-notlari';

type Props = { params: Promise<{ uni: string; ders: string }> };

export function generateStaticParams() {
  // PDF sayfaları da tam SSG yapmaz — build bütçesi
  return getAllNoteParams()
    .filter((p) =>
      [
        'ankara-yildirim-beyazit',
        'ankara',
        'istanbul',
        'marmara',
        'van-yyu',
        'bilkent',
      ].includes(p.uni)
    )
    .slice(0, 120);
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uni, ders } = await params;
  const note = getNote(uni, ders);
  if (!note) return { title: 'PDF' };
  return {
    title: { absolute: `${note.h1} — PDF` },
    robots: { index: false, follow: true },
  };
}

/** Yazdır / PDF kaydet için sade sayfa (tarayıcı print → PDF) */
export default async function DersNotuPdfPage({ params }: Props) {
  const { uni, ders } = await params;
  const note = getNote(uni, ders);
  const hub = getHub(uni);
  if (!note || !hub) notFound();

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="max-w-3xl mx-auto px-6 py-10 print:py-4">
        <p className="text-xs mb-4 print:hidden">
          <strong>PDF için:</strong> Ctrl+P (Cmd+P) → “PDF olarak kaydet”.
        </p>
        <DersNotuView note={note} hub={hub} />
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `if (typeof window !== 'undefined' && /pdf|print/i.test(location.search)) setTimeout(()=>window.print(), 400);`,
        }}
      />
    </div>
  );
}
