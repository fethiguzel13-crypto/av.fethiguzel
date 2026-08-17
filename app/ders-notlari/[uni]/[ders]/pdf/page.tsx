import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { DersNotuView } from '@/components/DersNotuView';
import { DersNotuPrintTrigger } from '@/components/DersNotuPrint';
import {
  getAllNoteParams,
  getHub,
  getNote,
  resolveNoteCourseCode,
} from '@/lib/ders-notlari';
import { auditLectureNote } from '@/lib/content-quality.mjs';

type Props = {
  params: Promise<{ uni: string; ders: string }>;
  searchParams: Promise<{ print?: string }>;
};

export function generateStaticParams() {
  // Notların tamamı kalıp metin olduğu ve indekse girmediği için önceden
  // üretim yapılmaz; hepsi dynamicParams ile karşılanır.
  return getAllNoteParams().slice(0, 0);
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
export default async function DersNotuPdfPage({ params, searchParams }: Props) {
  const { uni, ders } = await params;
  const sp = await searchParams;
  const resolved = resolveNoteCourseCode(uni, ders);
  if (resolved && resolved !== ders) {
    const q = sp?.print ? `?print=${encodeURIComponent(sp.print)}` : '';
    permanentRedirect(`/ders-notlari/${uni}/${resolved}/pdf${q}`);
  }
  const note = getNote(uni, ders);
  const hub = getHub(uni);
  if (!note || !hub) notFound();

  // Kalıp metni PDF olarak indirtmek, kaldırma kararını anlamsız kılar.
  if (!auditLectureNote(note).publishable) {
    permanentRedirect(`/ders-notlari/${uni}/${ders}`);
  }

  const autoPrint = sp?.print === '1' || sp?.print === 'true';

  return (
    <div className="bg-white min-h-screen text-black print:bg-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              .print\\:hidden, nav, footer, a[href].print-hide { display: none !important; }
              body { background: white !important; }
              a { color: black !important; text-decoration: none !important; }
            }
          `,
        }}
      />
      <div className="max-w-3xl mx-auto px-6 py-10 print:py-4 print:px-0">
        <div className="mb-6 rounded-xl border border-charcoal/15 bg-charcoal/[0.03] p-4 print:hidden">
          <p className="text-sm font-bold text-charcoal m-0 mb-1">PDF indir</p>
          <p className="text-xs text-charcoal/65 m-0 mb-3">
            Tarayıcı yazdırma penceresini açın → hedef olarak <strong>“PDF olarak kaydet”</strong> seçin.
            <br />
            <strong>Windows:</strong> Ctrl+P · <strong>Mac:</strong> Cmd+P
          </p>
          <p className="text-xs text-charcoal/50 m-0 mb-3">
            Dosya adı önerisi: <code className="text-accent">{note.slug || `${uni}-${ders}`}.pdf</code>
          </p>
          <DersNotuPrintTrigger auto={autoPrint} />
        </div>
        <DersNotuView note={note} hub={hub} />
      </div>
    </div>
  );
}
