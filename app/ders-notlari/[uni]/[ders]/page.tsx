import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DersNotuView } from '@/components/DersNotuView';
import { getHub, getNote, resolveNoteCourseCode } from '@/lib/ders-notlari';
import { auditLectureNote } from '@/lib/content-quality.mjs';

const SITE = 'https://www.avfethiguzel.com';

type Props = { params: Promise<{ uni: string; ders: string }> };

/**
 * Önceden üretim yok.
 *
 * 14.08.2026 denetiminde 7.999 ders notunun tamamının aynı kalıptan üretildiği
 * ve ~160 gerçek dersin 84 üniversiteye çoğaltıldığı ölçüldü. Hiçbiri indekse
 * girmediği için yüzlerce sayfayı derleme anında üretmek boşa harcanan build
 * süresidir; tamamı dynamicParams ile çalışma anında karşılanır.
 */
export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uni, ders } = await params;
  const note = getNote(uni, ders);
  if (!note) return { title: 'Not bulunamadı' };

  const quality = auditLectureNote(note);

  return {
    title: quality.publishable
      ? { absolute: `${note.title} | Av. Fethi Güzel` }
      : { absolute: `${note.h1} — yeniden yazılıyor | Av. Fethi Güzel` },
    description: quality.publishable
      ? note.description
      : 'Bu ders notu yeniden yazılıyor. Kanun metinleri ve hesaplama araçları kullanılabilir durumda.',
    keywords: quality.publishable ? note.keywords : undefined,
    alternates: { canonical: `${SITE}/ders-notlari/${uni}/${ders}` },
    openGraph: {
      title: note.h1,
      description: quality.publishable ? note.description : 'Yeniden yazılıyor.',
      url: `${SITE}/ders-notlari/${uni}/${ders}`,
    },
    robots: quality.publishable
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function DersNotuPage({ params }: Props) {
  const { uni, ders } = await params;
  const resolved = resolveNoteCourseCode(uni, ders);
  if (resolved && resolved !== ders) {
    permanentRedirect(`/ders-notlari/${uni}/${resolved}`);
  }
  const note = getNote(uni, ders);
  const hub = getHub(uni);
  if (!note || !hub) notFound();

  const quality = auditLectureNote(note);

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <main className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-3xl mx-auto">
        {quality.publishable ? (
          <DersNotuView note={note} hub={hub} />
        ) : (
          <WithdrawnNote
            h1={note.h1}
            uni={hub.uni.shortName || hub.uni.name || uni}
            reason={quality.reason}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

/**
 * Yayından kaldırılmış ders notu ekranı.
 *
 * 404 vermez: bağlantı kırılmasın ve öğrenci ne olduğunu görsün. İçerik
 * gösterilmez; gerçekten işe yarar olan yere yönlendirilir.
 */
function WithdrawnNote({
  h1,
  uni,
  reason,
}: {
  h1: string;
  uni: string;
  reason?: string;
}) {
  return (
    <>
      <nav className="text-[11px] text-charcoal/40 mb-5 flex flex-wrap gap-1.5">
        <Link href="/" className="hover:text-accent">
          Ana sayfa
        </Link>
        <span>/</span>
        <Link href="/ders-notlari" className="hover:text-accent">
          Ders notları
        </Link>
        <span>/</span>
        <span className="text-charcoal/60">{uni}</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal mb-6 leading-tight">
        {h1}
      </h1>

      <aside className="rounded-2xl border border-accent/30 bg-accent/[0.06] px-5 py-5 mb-10">
        <p className="text-[11px] font-mono tracking-[0.16em] uppercase text-accent font-bold m-0 mb-2">
          Bu not yayından kaldırıldı
        </p>
        <p className="text-[15px] text-charcoal/80 leading-relaxed m-0">
          {reason ??
            'Bu ders notu, tüm üniversite ve ders kombinasyonlarına çoğaltılmış kalıp metindir.'}
        </p>
        <p className="text-sm text-charcoal/60 leading-relaxed mt-3 mb-0">
          Sınavına çalışan bir öğrenciye yanlış veya içi boş not vermektense hiç
          vermemeyi tercih ediyoruz.
        </p>
      </aside>

      <section>
        <h2 className="text-lg font-heading font-bold text-charcoal mb-3">
          Bunun yerine kullanabilecekleriniz
        </h2>
        <ul className="flex flex-col gap-2 m-0 p-0 list-none">
          {[
            { href: '/mevzuat', label: 'Kanun maddeleri — resmî metinler' },
            { href: '/hesaplama', label: 'Hesaplama araçları — 33 araç' },
            { href: '/icthat', label: 'Güncel içtihat takibi' },
          ].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="flex items-center gap-2 rounded-xl border border-charcoal/[0.08] bg-white px-3.5 py-3 text-sm text-charcoal font-semibold hover:border-accent/40 hover:text-accent transition-colors"
              >
                <span className="text-accent" aria-hidden>
                  →
                </span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
