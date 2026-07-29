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
            <strong>Windows:</strong> Ctrl+P → Hedef: “PDF olarak kaydet” → Kaydet.
            <br />
            <strong>Mac:</strong> Cmd+P → PDF → “PDF olarak kaydet”.
          </p>
          <p className="text-xs text-charcoal/50 m-0">
            Dosya: <code className="text-accent">{note.slug}.pdf</code> · kişisel arşiv · ticari satış yok
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              'borclar-genel-donem-1',
              'borclar-genel-donem-2',
              'borclar-genel-yillik',
              'borclar-ozel-donem-1',
              'borclar-ozel-donem-2',
              'borclar-ozel-yillik',
              'esya-hukuku-donem-1',
              'esya-hukuku-donem-2',
              'esya-hukuku-yillik',
              'miras-hukuku-donem-1',
              'miras-hukuku-donem-2',
              'miras-hukuku-yillik',
              'tmk-1-kitap-donem-1',
              'tmk-1-kitap-donem-2',
              'tmk-1-kitap-yillik',
              'tmk-2-kitap-donem-1',
              'tmk-2-kitap-donem-2',
              'tmk-2-kitap-yillik',
              'hmk-donem-1',
              'hmk-donem-2',
              'hmk-yillik',
              'icra-donem-1',
              'icra-donem-2',
              'icra-yillik',
              'iflas-donem-1',
              'iflas-donem-2',
              'iflas-yillik',
              'sirketler-donem-1',
              'sirketler-donem-2',
              'sirketler-yillik',
              'kiymetli-evrak-donem-1',
              'kiymetli-evrak-donem-2',
              'kiymetli-evrak-yillik',
            ].map((code) => (
              <a
                key={code}
                href={`/ders-notlari/${uni}/${code}/pdf`}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-charcoal/15 hover:border-accent text-charcoal/70"
              >
                {code.replace('borclar-', '')} PDF
              </a>
            ))}
          </div>
        </div>
        <DersNotuView note={note} hub={hub} />
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `if (typeof window !== 'undefined' && /(?:[?&]print=|/pdf)/i.test(location.href)) setTimeout(function(){window.print()}, 500);`,
        }}
      />
    </div>
  );
}
