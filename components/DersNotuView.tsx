import Link from 'next/link';
import type { ReactNode } from 'react';
import type { CourseNote, NoteDiagram, UniHubContent } from '@/lib/ders-notlari';

const SITE = 'https://www.avfethiguzel.com';

/* ─── Diyagramlar ─────────────────────────────────────── */

function ProcessDiagram({ title, steps }: { title: string; steps: string[] }) {
  return (
    <figure className="my-8 rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6 shadow-sm overflow-hidden">
      <figcaption className="text-[11px] font-mono uppercase tracking-[0.14em] text-accent mb-5 font-bold">
        Şekil · {title}
      </figcaption>
      <div className="flex flex-col gap-0">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3 sm:gap-4">
            <div className="flex flex-col items-center w-10 shrink-0">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white text-sm font-bold shadow-md ring-4 ring-cream">
                {i + 1}
              </span>
              {i < steps.length - 1 && <span className="w-0.5 flex-1 min-h-[1.25rem] bg-accent/30" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="rounded-xl border border-charcoal/8 bg-charcoal/[0.02] px-4 py-3 text-sm sm:text-[15px] text-charcoal/80 font-medium leading-snug">
                {step}
              </div>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function CompareDiagram({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <figure className="my-8 rounded-2xl border border-charcoal/10 bg-white shadow-sm overflow-x-auto">
      <figcaption className="px-5 pt-5 text-[11px] font-mono uppercase tracking-[0.14em] text-accent font-bold">
        Tablo · {title}
      </figcaption>
      <table className="w-full text-sm mt-3 min-w-[320px]">
        <thead>
          <tr className="bg-charcoal/[0.04] border-y border-charcoal/8">
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-2.5 font-bold text-charcoal text-xs uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-charcoal/5 hover:bg-accent/[0.03]">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 text-charcoal/70 leading-snug ${ci === 0 ? 'font-semibold text-charcoal/85' : ''}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function ForkDiagram({
  title,
  left,
  right,
  leftTitle = 'Sol',
  rightTitle = 'Sağ',
}: {
  title: string;
  left: string;
  right: string;
  leftTitle?: string;
  rightTitle?: string;
}) {
  return (
    <figure className="my-8">
      <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-accent font-bold mb-3">
        Ayrım · {title}
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-white p-5">
          <p className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold mb-2">{leftTitle}</p>
          <p className="text-sm text-charcoal/80 leading-relaxed m-0">{left}</p>
        </div>
        <div className="rounded-2xl border-2 border-primary/25 bg-gradient-to-br from-primary/10 to-white p-5">
          <p className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold mb-2">{rightTitle}</p>
          <p className="text-sm text-charcoal/80 leading-relaxed m-0">{right}</p>
        </div>
      </div>
    </figure>
  );
}

function MindmapDiagram({
  title,
  center,
  branches,
}: {
  title: string;
  center: string;
  branches: { label: string; items: string[] }[];
}) {
  return (
    <figure className="my-8 rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-7 shadow-sm">
      <figcaption className="text-[11px] font-mono uppercase tracking-[0.14em] text-accent font-bold mb-6">
        Zihin haritası · {title}
      </figcaption>
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-2xl bg-accent text-white px-6 py-3 text-center font-heading font-bold text-base sm:text-lg shadow-lg shadow-accent/25 max-w-xs">
          {center}
        </div>
        <div className="w-px h-4 bg-accent/40" aria-hidden />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
          {branches.map((b) => (
            <div
              key={b.label}
              className="rounded-xl border border-charcoal/10 bg-charcoal/[0.02] p-3 sm:p-4"
            >
              <p className="text-xs font-bold text-accent mb-2 border-b border-accent/20 pb-1.5">{b.label}</p>
              <ul className="m-0 p-0 list-none space-y-1">
                {b.items.map((it) => (
                  <li key={it} className="text-[12px] sm:text-xs text-charcoal/70 flex gap-1.5">
                    <span className="text-accent shrink-0">·</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

function CycleDiagram({ title, steps }: { title: string; steps: string[] }) {
  return (
    <figure className="my-8 rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6 shadow-sm">
      <figcaption className="text-[11px] font-mono uppercase tracking-[0.14em] text-accent font-bold mb-5">
        Döngü · {title}
      </figcaption>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="rounded-full border-2 border-accent/40 bg-accent/5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-charcoal text-center min-w-[4.5rem]">
              <span className="block text-[10px] text-accent font-mono mb-0.5">{i + 1}</span>
              {s}
            </div>
            {i < steps.length - 1 && (
              <span className="text-accent/50 text-lg font-light hidden sm:inline" aria-hidden>
                →
              </span>
            )}
          </div>
        ))}
        <span className="text-accent/40 text-xs font-mono w-full text-center mt-2">↻ tekrarla</span>
      </div>
    </figure>
  );
}

function LadderDiagram({ title, levels }: { title: string; levels: string[] }) {
  return (
    <figure className="my-8 rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6 shadow-sm">
      <figcaption className="text-[11px] font-mono uppercase tracking-[0.14em] text-accent font-bold mb-5">
        Merdiven · {title}
      </figcaption>
      <ol className="m-0 p-0 list-none space-y-2">
        {levels.map((lv, i) => (
          <li key={i} className="flex items-stretch gap-0">
            <div
              className="flex items-center justify-center text-white text-xs font-bold shrink-0 px-3 rounded-l-xl"
              style={{
                background: `hsl(${28 + i * 12} 70% ${42 + i * 4}%)`,
                minWidth: `${4.5 + i * 0.6}rem`,
              }}
            >
              {i + 1}
            </div>
            <div
              className="flex-1 rounded-r-xl border border-l-0 border-charcoal/10 px-4 py-2.5 text-sm text-charcoal/80 font-medium"
              style={{ marginLeft: `${i * 0.35}rem` }}
            >
              {lv}
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function Diagram({ d }: { d: NoteDiagram }) {
  switch (d.kind) {
    case 'process':
      return <ProcessDiagram title={d.title} steps={d.steps} />;
    case 'compare':
      return <CompareDiagram title={d.title} headers={d.headers} rows={d.rows} />;
    case 'fork':
      return (
        <ForkDiagram
          title={d.title}
          left={d.left}
          right={d.right}
          leftTitle={d.leftTitle}
          rightTitle={d.rightTitle}
        />
      );
    case 'mindmap':
      return <MindmapDiagram title={d.title} center={d.center} branches={d.branches} />;
    case 'cycle':
      return <CycleDiagram title={d.title} steps={d.steps} />;
    case 'ladder':
      return <LadderDiagram title={d.title} levels={d.levels} />;
    default:
      return null;
  }
}

/* ─── Ana görünüm ─────────────────────────────────────── */

export function DersNotuView({
  note,
  hub,
}: {
  note: CourseNote;
  hub: UniHubContent;
}) {
  const pageUrl = `${SITE}/ders-notlari/${note.uniSlug}/${note.courseCode}`;
  const pdfHref = `/ders-notlari/${note.uniSlug}/${note.courseCode}/pdf`;
  const toc = note.sections.map((s) => s.heading);

  // Diyagramları bölümlere serpiştir (0, 1, 3. bölüm sonrası)
  const insertAfter = [0, 1, 3];
  const graphicsAfter = new Map<number, NoteDiagram[]>();
  note.diagrams.forEach((d, i) => {
    const slot = insertAfter[i] ?? insertAfter[insertAfter.length - 1];
    if (!graphicsAfter.has(slot)) graphicsAfter.set(slot, []);
    // ilk 3 diyagramı serpiştir, kalan sonda
    if (i < 3) graphicsAfter.get(slot)!.push(d);
  });
  const restDiagrams = note.diagrams.slice(3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: note.h1,
    description: note.description,
    url: pageUrl,
    inLanguage: 'tr-TR',
    isAccessibleForFree: true,
    learningResourceType: 'Ders notu',
    educationalLevel: 'Lisans — Hukuk Fakültesi',
    author: { '@type': 'Person', name: 'Av. Fethi Güzel', url: `${SITE}/avukat-fethi-guzel` },
    provider: { '@type': 'Organization', name: 'Av. Fethi Güzel Hukuk Portalı', url: SITE },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-[11px] text-charcoal/40 mb-5 flex flex-wrap gap-1.5 print:hidden">
        <Link href="/ders-notlari" className="hover:text-accent">
          Ders notları
        </Link>
        <span>/</span>
        <Link href={`/ders-notlari/${note.uniSlug}`} className="hover:text-accent">
          {hub.uni.shortName}
        </Link>
        <span>/</span>
        <span className="text-charcoal/60">{note.courseCode}</span>
      </nav>

      {/* Hero band */}
      <div className="mb-8 rounded-3xl border border-charcoal/10 overflow-hidden bg-white shadow-sm">
        <div className="bg-gradient-to-br from-charcoal via-charcoal to-[#2a2520] px-5 sm:px-8 py-7 sm:py-9 text-cream">
          <p className="text-accent font-mono text-[10px] tracking-[0.2em] uppercase mb-3">
            Ücretsiz premium not · {hub.uni.city} · {hub.uni.shortName}
          </p>
          <h1 className="text-2xl sm:text-4xl font-heading font-bold leading-tight mb-3 text-cream">
            {note.h1}
          </h1>
          {note.promise && (
            <p className="text-accent/95 text-sm sm:text-base font-medium leading-relaxed max-w-2xl mb-3">
              {note.promise}
            </p>
          )}
          <p className="text-cream/65 text-sm sm:text-base leading-relaxed max-w-3xl">{note.lead}</p>
          <div className="flex flex-wrap gap-2 mt-5 print:hidden">
            <Link
              href={`${pdfHref}?print=1`}
              className="inline-flex text-sm font-bold px-4 py-2.5 rounded-full bg-accent text-white hover:bg-accent/90"
            >
              PDF indir / Yazdır
            </Link>
            <Link
              href={pdfHref}
              className="inline-flex text-sm font-semibold px-4 py-2.5 rounded-full border border-cream/20 text-cream/85 hover:bg-cream/10"
            >
              PDF sayfası
            </Link>
            <Link
              href={`/ders-notlari/${note.uniSlug}`}
              className="inline-flex text-sm font-semibold px-4 py-2.5 rounded-full border border-cream/20 text-cream/85 hover:bg-cream/10"
            >
              Tüm {hub.uni.shortName} notları
            </Link>
            <Link
              href="/mevzuat/tbk"
              className="inline-flex text-sm font-semibold px-4 py-2.5 rounded-full border border-cream/20 text-cream/85 hover:bg-cream/10"
            >
              TBK mevzuat
            </Link>
          </div>
        </div>
      </div>

      {/* Borçlar Genel / Özel üçlü paket geçişi */}
      {(() => {
        const packs: {
          match: boolean;
          title: string;
          items: { code: string; label: string; desc: string }[];
          footer?: ReactNode;
        }[] = [
          {
            match:
              note.variantOf === 'borclar-genel' ||
              note.courseCode === 'borclar-genel' ||
              note.courseCode.startsWith('borclar-genel-'),
            title: 'Borçlar Genel · üç paket',
            items: [
              { code: 'borclar-genel-donem-1', label: '1. Dönem (Güz)', desc: 'Kaynak · kuruluş · irade · temsil' },
              { code: 'borclar-genel-donem-2', label: '2. Dönem (Bahar)', desc: 'Temerrüt · haksız fiil · zamanaşımı' },
              { code: 'borclar-genel-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
          },
          {
            match:
              note.variantOf === 'borclar-ozel' ||
              note.courseCode === 'borclar-ozel' ||
              note.courseCode.startsWith('borclar-ozel-'),
            title: 'Borçlar Özel · üç paket',
            items: [
              { code: 'borclar-ozel-donem-1', label: '1. Dönem (Güz)', desc: 'Satım · kira · bağış · ödünç' },
              { code: 'borclar-ozel-donem-2', label: '2. Dönem (Bahar)', desc: 'Eser · vekâlet · kefalet' },
              { code: 'borclar-ozel-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
            footer: (
              <p className="text-[11px] text-charcoal/45 mt-3 m-0">
                Genel hükümler için:{' '}
                <Link
                  href={`/ders-notlari/${note.uniSlug}/borclar-genel-yillik`}
                  className="text-accent font-semibold hover:underline"
                >
                  Borçlar Genel yıllık
                </Link>
              </p>
            ),
          },
          {
            match:
              note.variantOf === 'esya-hukuku' ||
              note.courseCode === 'esya-hukuku' ||
              note.courseCode.startsWith('esya-hukuku-'),
            title: 'Eşya Hukuku · üç paket',
            items: [
              { code: 'esya-hukuku-donem-1', label: '1. Dönem (Güz)', desc: 'Zilyetlik · sicil · mülkiyet' },
              { code: 'esya-hukuku-donem-2', label: '2. Dönem (Bahar)', desc: 'İrtifak · rehin · davalar' },
              { code: 'esya-hukuku-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
          },
          {
            match:
              note.variantOf === 'miras-hukuku' ||
              note.courseCode === 'miras-hukuku' ||
              note.courseCode.startsWith('miras-hukuku-'),
            title: 'Miras Hukuku · üç paket',
            items: [
              { code: 'miras-hukuku-donem-1', label: '1. Dönem (Güz)', desc: 'Zümre · eş · saklı pay · ret' },
              { code: 'miras-hukuku-donem-2', label: '2. Dönem (Bahar)', desc: 'Vasiyet · tenkis · paylaşma' },
              { code: 'miras-hukuku-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
          },
          {
            match:
              note.variantOf === 'tmk-1-kitap' ||
              note.courseCode === 'medeni-baslangic' ||
              note.courseCode.startsWith('tmk-1-kitap-'),
            title: 'TMK 1. Kitap · üç paket',
            items: [
              { code: 'tmk-1-kitap-donem-1', label: '1. Dönem (Güz)', desc: 'Başlangıç · ehliyet · yerleşim' },
              { code: 'tmk-1-kitap-donem-2', label: '2. Dönem (Bahar)', desc: 'Kişilik · vesayet · dernek/vakıf' },
              { code: 'tmk-1-kitap-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
          },
          {
            match:
              note.variantOf === 'tmk-2-kitap' ||
              note.courseCode === 'aile-hukuku' ||
              note.courseCode.startsWith('tmk-2-kitap-'),
            title: 'TMK 2. Kitap · üç paket',
            items: [
              { code: 'tmk-2-kitap-donem-1', label: '1. Dönem (Güz)', desc: 'Nişan · evlenme · boşanma' },
              { code: 'tmk-2-kitap-donem-2', label: '2. Dönem (Bahar)', desc: 'Mal · velayet · nafaka' },
              { code: 'tmk-2-kitap-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
          },
          {
            match:
              note.variantOf === 'hmk' ||
              note.courseCode === 'medeni-usul' ||
              note.courseCode.startsWith('hmk-'),
            title: 'HMK · üç paket',
            items: [
              { code: 'hmk-donem-1', label: '1. Dönem (Güz)', desc: 'Görev · yetki · dava şartı' },
              { code: 'hmk-donem-2', label: '2. Dönem (Bahar)', desc: 'İspat · hüküm · istinaf' },
              { code: 'hmk-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
          },
          {
            match:
              note.variantOf === 'icra' ||
              note.courseCode === 'icra-iflas' ||
              note.courseCode.startsWith('icra-'),
            title: 'İcra Hukuku · üç paket',
            items: [
              { code: 'icra-donem-1', label: '1. Dönem (Güz)', desc: 'Takip · ödeme emri · itiraz' },
              { code: 'icra-donem-2', label: '2. Dönem (Bahar)', desc: 'Haciz · satış · sıra' },
              { code: 'icra-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
            footer: (
              <p className="text-[11px] text-charcoal/45 mt-3 m-0">
                İflas / konkordato için:{' '}
                <Link
                  href={`/ders-notlari/${note.uniSlug}/iflas-yillik`}
                  className="text-accent font-semibold hover:underline"
                >
                  İflas Hukuku yıllık
                </Link>
              </p>
            ),
          },
          {
            match:
              note.variantOf === 'iflas' ||
              note.courseCode === 'icra-iflas' ||
              note.courseCode.startsWith('iflas-'),
            title: 'İflas Hukuku · üç paket',
            items: [
              { code: 'iflas-donem-1', label: '1. Dönem (Güz)', desc: 'Sebep · yol · masa' },
              { code: 'iflas-donem-2', label: '2. Dönem (Bahar)', desc: 'Kayıt · iptal · konkordato' },
              { code: 'iflas-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
            footer: (
              <p className="text-[11px] text-charcoal/45 mt-3 m-0">
                Ferdi takip / haciz için:{' '}
                <Link
                  href={`/ders-notlari/${note.uniSlug}/icra-yillik`}
                  className="text-accent font-semibold hover:underline"
                >
                  İcra Hukuku yıllık
                </Link>
              </p>
            ),
          },
          {
            match:
              note.variantOf === 'sirketler' ||
              note.courseCode === 'ticaret-sirketler' ||
              note.courseCode.startsWith('sirketler-'),
            title: 'Şirketler Hukuku · üç paket',
            items: [
              { code: 'sirketler-donem-1', label: '1. Dönem (Güz)', desc: 'Tür · limited · kuruluş' },
              { code: 'sirketler-donem-2', label: '2. Dönem (Bahar)', desc: 'AŞ · birleşme · sorumluluk' },
              { code: 'sirketler-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
          },
          {
            match:
              note.variantOf === 'kiymetli-evrak' ||
              note.courseCode === 'kiymetli-evrak' ||
              note.courseCode.startsWith('kiymetli-evrak-'),
            title: 'Kıymetli Evrak · üç paket',
            items: [
              { code: 'kiymetli-evrak-donem-1', label: '1. Dönem (Güz)', desc: 'Poliçe · bono · ciro' },
              { code: 'kiymetli-evrak-donem-2', label: '2. Dönem (Bahar)', desc: 'Çek · başvuru · def’i' },
              { code: 'kiymetli-evrak-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
          },
          {
            match:
              note.variantOf === 'sigorta-hukuku' ||
              note.courseCode === 'sigorta-hukuku' ||
              note.courseCode.startsWith('sigorta-hukuku-'),
            title: 'Sigorta Hukuku · üç paket',
            items: [
              { code: 'sigorta-hukuku-donem-1', label: '1. Dönem (Güz)', desc: 'Sözleşme · menfaat · beyan' },
              { code: 'sigorta-hukuku-donem-2', label: '2. Dönem (Bahar)', desc: 'Branş · rücu · tahkim' },
              { code: 'sigorta-hukuku-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
          },
          {
            match:
              note.variantOf === 'ticari-isletme' ||
              note.courseCode === 'ticari-isletme' ||
              note.courseCode.startsWith('ticari-isletme-'),
            title: 'Ticari İşletme · üç paket',
            items: [
              { code: 'ticari-isletme-donem-1', label: '1. Dönem (Güz)', desc: 'Tacir · unvan · sicil' },
              { code: 'ticari-isletme-donem-2', label: '2. Dönem (Bahar)', desc: 'Acente · defter · devir' },
              { code: 'ticari-isletme-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
          },
          {
            match:
              note.variantOf === 'ceza-genel' ||
              note.courseCode === 'ceza-genel' ||
              note.courseCode.startsWith('ceza-genel-'),
            title: 'Ceza Genel · üç paket',
            items: [
              { code: 'ceza-genel-donem-1', label: '1. Dönem (Güz)', desc: 'Tipiklik · kast · meşru savunma' },
              { code: 'ceza-genel-donem-2', label: '2. Dönem (Bahar)', desc: 'Teşebbüs · iştirak · yaptırım' },
              { code: 'ceza-genel-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
            footer: (
              <p className="text-[11px] text-charcoal/45 mt-3 m-0">
                Somut suç tipleri için:{' '}
                <Link
                  href={`/ders-notlari/${note.uniSlug}/ceza-ozel-yillik`}
                  className="text-accent font-semibold hover:underline"
                >
                  Ceza Özel yıllık
                </Link>
              </p>
            ),
          },
          {
            match:
              note.variantOf === 'ceza-ozel' ||
              note.courseCode === 'ceza-ozel' ||
              note.courseCode.startsWith('ceza-ozel-'),
            title: 'Ceza Özel · üç paket',
            items: [
              { code: 'ceza-ozel-donem-1', label: '1. Dönem (Güz)', desc: 'Öldürme · yaralama · hürriyet' },
              { code: 'ceza-ozel-donem-2', label: '2. Dönem (Bahar)', desc: 'Hırsızlık · dolandırıcılık · kamu' },
              { code: 'ceza-ozel-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
            footer: (
              <p className="text-[11px] text-charcoal/45 mt-3 m-0">
                Suç teorisi için:{' '}
                <Link
                  href={`/ders-notlari/${note.uniSlug}/ceza-genel-yillik`}
                  className="text-accent font-semibold hover:underline"
                >
                  Ceza Genel yıllık
                </Link>
              </p>
            ),
          },
          {
            match:
              note.variantOf === 'cmk' ||
              note.courseCode === 'ceza-muhakemesi' ||
              note.courseCode.startsWith('cmk-'),
            title: 'CMK · üç paket',
            items: [
              { code: 'cmk-donem-1', label: '1. Dönem (Güz)', desc: 'Yakalama · tutuklama · arama' },
              { code: 'cmk-donem-2', label: '2. Dönem (Bahar)', desc: 'Duruşma · delil · istinaf' },
              { code: 'cmk-yillik', label: 'Yıllık tam not', desc: '1. + 2. dönem birleşik paket' },
            ],
            footer: (
              <p className="text-[11px] text-charcoal/45 mt-3 m-0">
                Maddi ceza için:{' '}
                <Link
                  href={`/ders-notlari/${note.uniSlug}/ceza-genel-yillik`}
                  className="text-accent font-semibold hover:underline"
                >
                  Ceza Genel
                </Link>
                {' · '}
                <Link
                  href={`/ders-notlari/${note.uniSlug}/ceza-ozel-yillik`}
                  className="text-accent font-semibold hover:underline"
                >
                  Ceza Özel
                </Link>
              </p>
            ),
          },
        ];
        const activePacks = packs.filter((p) => p.match);
        if (!activePacks.length) return null;
        return (
          <nav
            aria-label="Ders paketleri"
            className="mb-8 rounded-2xl border-2 border-accent/25 bg-white p-4 sm:p-5 shadow-sm print:hidden space-y-5"
          >
            {activePacks.map((pack) => (
              <div key={pack.title}>
                <p className="text-[11px] font-mono uppercase tracking-wider text-accent font-bold mb-3">
                  {pack.title}
                </p>
                <div className="grid sm:grid-cols-3 gap-2">
                  {pack.items.map((v) => {
                    const active = note.courseCode === v.code;
                    return (
                      <Link
                        key={v.code}
                        href={`/ders-notlari/${note.uniSlug}/${v.code}`}
                        className={`rounded-xl border px-3 py-3 text-sm transition-colors ${
                          active
                            ? 'border-accent bg-accent/10 font-bold text-charcoal'
                            : 'border-charcoal/10 hover:border-accent/40 text-charcoal/80'
                        }`}
                      >
                        <span className="block font-semibold">{v.label}</span>
                        <span className="block text-[11px] font-normal text-charcoal/50 mt-0.5">
                          {v.desc}
                        </span>
                        <span className="block text-[10px] text-accent mt-1.5 font-semibold">
                          PDF → /{v.code}/pdf
                        </span>
                      </Link>
                    );
                  })}
                </div>
                {pack.footer}
              </div>
            ))}
          </nav>
        );
      })()}

      {/* 60 saniye */}
      {note.sixtySecond && note.sixtySecond.length > 0 && (
        <aside className="mb-8 rounded-2xl border-2 border-accent/25 bg-accent/[0.06] p-5 sm:p-6">
          <h2 className="text-sm font-heading font-bold text-charcoal mb-3 flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
              60
            </span>
            Saniyede omurga
          </h2>
          <ol className="m-0 p-0 list-none space-y-2">
            {note.sixtySecond.map((line, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-charcoal/75 leading-snug">
                <span className="text-accent font-bold shrink-0">{i + 1}.</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </aside>
      )}

      {/* Sınav kutusu + öğrenme çıktıları */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <aside className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-heading font-bold text-charcoal mb-3">Sınav kutusu</h2>
          <ul className="text-sm text-charcoal/70 space-y-2 m-0 p-0 list-none">
            <li>
              <span className="text-charcoal/45 text-xs uppercase tracking-wide">Takvim</span>
              <br />
              <strong className="text-charcoal">{note.examBox.calendar}</strong>
            </li>
            <li>
              <span className="text-charcoal/45 text-xs uppercase tracking-wide">Ağırlık (tipik)</span>
              <br />
              {note.examBox.typicalWeights}
            </li>
            <li>
              <span className="text-charcoal/45 text-xs uppercase tracking-wide">Format</span>
              <br />
              {note.examBox.format}
            </li>
          </ul>
          {note.examBox.tips?.length > 0 && (
            <ul className="mt-4 pt-3 border-t border-charcoal/8 space-y-1 m-0 p-0 list-none">
              {note.examBox.tips.map((t) => (
                <li key={t} className="text-xs text-charcoal/60 flex gap-1.5">
                  <span className="text-accent">✓</span> {t}
                </li>
              ))}
            </ul>
          )}
        </aside>
        <aside className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-heading font-bold text-charcoal mb-3">Bu notu bitirince</h2>
          <ul className="space-y-2 m-0 p-0 list-none">
            {note.learningOutcomes.map((o) => (
              <li key={o} className="flex gap-2 text-sm text-charcoal/75">
                <span className="text-accent font-bold shrink-0">→</span> {o}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* İçindekiler */}
      <nav
        aria-label="İçindekiler"
        className="mb-10 rounded-2xl border border-charcoal/8 bg-charcoal/[0.02] p-5 print:hidden"
      >
        <p className="text-[11px] font-mono uppercase tracking-wider text-charcoal/45 mb-3 font-bold">
          İçindekiler
        </p>
        <ol className="m-0 p-0 list-none columns-1 sm:columns-2 gap-x-8 space-y-1.5">
          {toc.map((h, i) => (
            <li key={h} className="text-sm text-charcoal/70 break-inside-avoid">
              <span className="text-accent font-mono text-xs mr-1.5">{i + 1}.</span>
              {h.replace(/^\d+\.\s*/, '')}
            </li>
          ))}
        </ol>
      </nav>

      {/* Bölümler + grafikler */}
      {note.sections.map((sec, si) => (
        <div key={sec.heading}>
          <section className="mb-10 scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal mb-4 pb-2 border-b border-charcoal/10">
              {sec.heading}
            </h2>
            {sec.paragraphs.map((p, pi) => (
              <p key={pi} className="text-charcoal/75 leading-[1.8] mb-3.5 text-[15px] sm:text-base">
                {p}
              </p>
            ))}
            {sec.hapBilgi && (
              <div className="my-4 rounded-xl border border-amber-400/40 bg-amber-50/80 px-4 py-3.5">
                <p className="text-[10px] font-mono uppercase tracking-wider text-amber-800/80 font-bold mb-1">
                  Hap bilgi
                </p>
                <p className="text-sm text-amber-950/80 leading-relaxed m-0">{sec.hapBilgi}</p>
              </div>
            )}
            {sec.uyari && (
              <div className="my-4 rounded-xl border border-red-300/50 bg-red-50/70 px-4 py-3.5">
                <p className="text-[10px] font-mono uppercase tracking-wider text-red-800/80 font-bold mb-1">
                  Sınav tuzağı
                </p>
                <p className="text-sm text-red-950/80 leading-relaxed m-0">{sec.uyari}</p>
              </div>
            )}
            {sec.kartlar && sec.kartlar.length > 0 && (
              <div className="my-5 grid sm:grid-cols-3 gap-3">
                {sec.kartlar.map((k) => (
                  <div
                    key={k.baslik}
                    className="rounded-2xl border border-charcoal/10 bg-white p-4 shadow-sm border-t-4 border-t-accent"
                  >
                    <p className="text-sm font-heading font-bold text-charcoal mb-2 m-0">{k.baslik}</p>
                    <p className="text-xs sm:text-[13px] text-charcoal/65 leading-relaxed m-0">{k.govde}</p>
                  </div>
                ))}
              </div>
            )}
            {sec.bullets && sec.bullets.length > 0 && (
              <ul className="mt-4 space-y-2 m-0 p-0 list-none">
                {sec.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex gap-2.5 rounded-xl border border-charcoal/8 bg-white px-3.5 py-2.5 text-sm text-charcoal/75"
                  >
                    <span className="text-accent font-bold shrink-0">•</span>
                    <span className="leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          {(graphicsAfter.get(si) || []).map((d) => (
            <Diagram key={d.title} d={d} />
          ))}
        </div>
      ))}

      {restDiagrams.map((d) => (
        <Diagram key={d.title} d={d} />
      ))}

      {/* Örnekler */}
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal mb-2">
          İşlenmiş örnek olaylar
        </h2>
        <p className="text-sm text-charcoal/50 mb-5">
          Her örnekte: olay → çözüm iskeleti → tek cümlelik çıkış. Kendi defterinizde yeniden yazın.
        </p>
        <div className="flex flex-col gap-5">
          {note.examples.map((ex, i) => (
            <article
              key={ex.title}
              className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden shadow-sm"
            >
              <div className="bg-charcoal text-cream px-4 sm:px-5 py-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold">
                  {i + 1}
                </span>
                <h3 className="font-heading font-bold text-sm sm:text-base m-0 text-cream">{ex.title}</h3>
              </div>
              <div className="px-4 sm:px-5 py-4 space-y-3">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-charcoal/40 font-bold m-0 mb-1">
                    Olay
                  </p>
                  <p className="text-sm text-charcoal/70 leading-relaxed m-0">{ex.facts}</p>
                </div>
                <div className="rounded-xl bg-charcoal/[0.03] border border-charcoal/8 px-3.5 py-3">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold m-0 mb-1">
                    Çözüm iskeleti
                  </p>
                  <p className="text-sm text-charcoal/80 leading-relaxed m-0">{ex.analysis}</p>
                </div>
                <p className="text-sm font-semibold text-accent m-0 flex gap-2">
                  <span aria-hidden>→</span>
                  <span>{ex.takeaway}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold text-charcoal mb-4">Kontrol listesi</h2>
        <ul className="grid sm:grid-cols-2 gap-2 m-0 p-0 list-none">
          {note.checklist.map((c, i) => (
            <li
              key={c}
              className="flex gap-3 rounded-xl border border-charcoal/8 bg-white px-3 py-2.5 text-sm text-charcoal/75"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-charcoal/15 text-[11px] font-bold text-charcoal/40">
                {i + 1}
              </span>
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* SSS */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold text-charcoal mb-4">Sık sorulanlar</h2>
        <div className="space-y-2">
          {note.faq.map((f) => (
            <details
              key={f.q}
              className="rounded-2xl border border-charcoal/10 bg-white open:border-accent/30 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none p-4 font-semibold text-sm text-charcoal">
                {f.q}
              </summary>
              <p className="px-4 pb-4 text-sm text-charcoal/65 leading-relaxed m-0">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* İlişkili dersler */}
      {note.relatedCourses.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-bold text-charcoal/50 uppercase tracking-wider mb-3">
            Aynı dönemden diğer notlar
          </h2>
          <div className="flex flex-wrap gap-2">
            {note.relatedCourses.map((code) => (
              <Link
                key={code}
                href={`/ders-notlari/${note.uniSlug}/${code}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-charcoal/5 text-charcoal/70 hover:bg-accent/10 hover:text-accent"
              >
                {code}
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="text-xs text-charcoal/45 border-t border-charcoal/10 pt-6 leading-relaxed">
        <p className="m-0 mb-1">
          <strong className="text-charcoal/60">Av. Fethi Güzel Hukuk Portalı</strong> · ücretsiz öğrenci
          desteği · bilgilendirme / eğitim materyali
        </p>
        <p className="m-0">
          Resmi müfredatın ve sorumlu öğretim elemanının yerine geçmez · telifli slayt kopyalanmaz ·
          güncelleme: {note.updated}
          {note.qualityTier === 'premium' ? ' · premium şematik sürüm' : ''}
        </p>
      </footer>
    </>
  );
}

export function UniHubView({ hub }: { hub: UniHubContent }) {
  const byYear = [1, 2, 3, 4].map((y) => ({
    year: y,
    items: hub.courses.filter((c) => c.year === y),
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: hub.h1,
    description: hub.description,
    url: `${SITE}/ders-notlari/${hub.uni.slug}`,
    isPartOf: { '@type': 'WebSite', url: SITE, name: 'Av. Fethi Güzel Hukuk Portalı' },
    about: { '@type': 'CollegeOrUniversity', name: hub.uni.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-[11px] text-charcoal/40 mb-5 flex flex-wrap gap-1.5">
        <Link href="/ders-notlari" className="hover:text-accent">
          Ders notları
        </Link>
        <span>/</span>
        <span>{hub.uni.shortName}</span>
      </nav>

      <div className="mb-8 rounded-3xl bg-gradient-to-br from-charcoal to-[#2a2520] px-6 sm:px-8 py-8 text-cream">
        <p className="text-accent font-mono text-[10px] tracking-[0.2em] uppercase mb-2">
          {hub.uni.city} · {hub.uni.type} · {hub.uni.calendar} · ücretsiz premium
        </p>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3 text-cream">{hub.h1}</h1>
        <p className="text-cream/70 text-base leading-relaxed max-w-3xl m-0">{hub.lead}</p>
      </div>

      {hub.seoParagraphs.map((p) => (
        <p key={p.slice(0, 30)} className="text-sm text-charcoal/65 leading-relaxed mb-3">
          {p}
        </p>
      ))}

      <div className="my-8 rounded-2xl border border-accent/20 bg-accent/[0.06] p-4 text-sm text-charcoal/70">
        Her notta: <strong>zihin haritası</strong>, tanım kartları, sınav iskeleti, işlenmiş örnek olay ve
        kontrol listesi. PDF yazdırılabilir.
      </div>

      {/* Borçlar Genel + Özel öne çıkan paketler */}
      <div className="mt-10 space-y-4">
        {[
          {
            show: hub.courses.some((c) => String(c.code).startsWith('borclar-genel')),
            title: 'Borçlar Genel — 1. dönem · 2. dönem · yıllık',
            desc: 'Dönemlik ve yıllık programlara uygun üç premium not + PDF.',
            border: 'border-accent/20 bg-accent/[0.05]',
            itemBorder: 'border-accent/25',
            accent: 'text-accent',
            items: [
              { code: 'borclar-genel-donem-1', title: '1. Dönem (Güz)' },
              { code: 'borclar-genel-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'borclar-genel-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some((c) => String(c.code).startsWith('borclar-ozel')),
            title: 'Borçlar Özel — 1. dönem · 2. dönem · yıllık',
            desc: 'Satım–kira–eser–vekâlet–kefalet… üç premium not + PDF.',
            border: 'border-primary/20 bg-primary/[0.04]',
            itemBorder: 'border-primary/25',
            accent: 'text-primary',
            items: [
              { code: 'borclar-ozel-donem-1', title: '1. Dönem (Güz)' },
              { code: 'borclar-ozel-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'borclar-ozel-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some((c) => String(c.code).startsWith('esya-hukuku')),
            title: 'Eşya Hukuku — 1. dönem · 2. dönem · yıllık',
            desc: 'Zilyetlik–mülkiyet–irtifak–rehin–davalar… üç premium not + PDF.',
            border: 'border-charcoal/15 bg-charcoal/[0.03]',
            itemBorder: 'border-charcoal/15',
            accent: 'text-accent',
            items: [
              { code: 'esya-hukuku-donem-1', title: '1. Dönem (Güz)' },
              { code: 'esya-hukuku-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'esya-hukuku-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some((c) => String(c.code).startsWith('miras-hukuku')),
            title: 'Miras Hukuku — 1. dönem · 2. dönem · yıllık',
            desc: 'Zümre–saklı pay–vasiyet–tenkis–paylaşma… üç premium not + PDF.',
            border: 'border-primary/15 bg-primary/[0.03]',
            itemBorder: 'border-primary/20',
            accent: 'text-primary',
            items: [
              { code: 'miras-hukuku-donem-1', title: '1. Dönem (Güz)' },
              { code: 'miras-hukuku-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'miras-hukuku-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some(
              (c) =>
                String(c.code).startsWith('tmk-1-kitap') ||
                c.code === 'medeni-baslangic'
            ),
            title: 'TMK 1. Kitap — 1. dönem · 2. dönem · yıllık',
            desc: 'Başlangıç–ehliyet–kişilik–vesayet–dernek/vakıf… üç premium not + PDF.',
            border: 'border-accent/20 bg-accent/[0.04]',
            itemBorder: 'border-accent/25',
            accent: 'text-accent',
            items: [
              { code: 'tmk-1-kitap-donem-1', title: '1. Dönem (Güz)' },
              { code: 'tmk-1-kitap-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'tmk-1-kitap-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some(
              (c) =>
                String(c.code).startsWith('tmk-2-kitap') ||
                c.code === 'aile-hukuku'
            ),
            title: 'TMK 2. Kitap — 1. dönem · 2. dönem · yıllık',
            desc: 'Nişan–boşanma–mal rejimi–velayet–nafaka… üç premium not + PDF.',
            border: 'border-primary/20 bg-primary/[0.04]',
            itemBorder: 'border-primary/25',
            accent: 'text-primary',
            items: [
              { code: 'tmk-2-kitap-donem-1', title: '1. Dönem (Güz)' },
              { code: 'tmk-2-kitap-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'tmk-2-kitap-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some(
              (c) =>
                String(c.code).startsWith('hmk-') ||
                c.code === 'medeni-usul' ||
                c.code === 'hmk'
            ),
            title: 'HMK — 1. dönem · 2. dönem · yıllık',
            desc: 'Görev–yetki–ispat–hüküm–istinaf–tedbir… üç premium not + PDF.',
            border: 'border-charcoal/15 bg-charcoal/[0.03]',
            itemBorder: 'border-charcoal/15',
            accent: 'text-accent',
            items: [
              { code: 'hmk-donem-1', title: '1. Dönem (Güz)' },
              { code: 'hmk-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'hmk-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some(
              (c) =>
                String(c.code).startsWith('icra-') ||
                c.code === 'icra-iflas'
            ),
            title: 'İcra Hukuku — 1. dönem · 2. dönem · yıllık',
            desc: 'Takip–itiraz–haciz–satış–sıra… üç premium not + PDF (iflas ayrı).',
            border: 'border-accent/20 bg-accent/[0.04]',
            itemBorder: 'border-accent/25',
            accent: 'text-accent',
            items: [
              { code: 'icra-donem-1', title: '1. Dönem (Güz)' },
              { code: 'icra-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'icra-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some((c) => String(c.code).startsWith('iflas-')),
            title: 'İflas Hukuku — 1. dönem · 2. dönem · yıllık',
            desc: 'Masa–kayıt–sıra–iptal–konkordato… üç premium not + PDF (icra ayrı).',
            border: 'border-primary/20 bg-primary/[0.04]',
            itemBorder: 'border-primary/25',
            accent: 'text-primary',
            items: [
              { code: 'iflas-donem-1', title: '1. Dönem (Güz)' },
              { code: 'iflas-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'iflas-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some(
              (c) =>
                String(c.code).startsWith('sirketler-') ||
                c.code === 'ticaret-sirketler'
            ),
            title: 'Şirketler Hukuku — 1. dönem · 2. dönem · yıllık',
            desc: 'Limited–AŞ–birleşme–sorumluluk… üç premium not + PDF.',
            border: 'border-accent/20 bg-accent/[0.04]',
            itemBorder: 'border-accent/25',
            accent: 'text-accent',
            items: [
              { code: 'sirketler-donem-1', title: '1. Dönem (Güz)' },
              { code: 'sirketler-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'sirketler-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some(
              (c) =>
                String(c.code).startsWith('kiymetli-evrak') ||
                c.code === 'kiymetli-evrak'
            ),
            title: 'Kıymetli Evrak — 1. dönem · 2. dönem · yıllık',
            desc: 'Poliçe–bono–çek–ciro–başvuru… üç premium not + PDF.',
            border: 'border-primary/20 bg-primary/[0.04]',
            itemBorder: 'border-primary/25',
            accent: 'text-primary',
            items: [
              { code: 'kiymetli-evrak-donem-1', title: '1. Dönem (Güz)' },
              { code: 'kiymetli-evrak-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'kiymetli-evrak-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some(
              (c) =>
                String(c.code).startsWith('sigorta-hukuku') ||
                c.code === 'sigorta-hukuku'
            ),
            title: 'Sigorta Hukuku — 1. dönem · 2. dönem · yıllık',
            desc: 'Sözleşme–menfaat–rücu–tahkim… üç premium not + PDF.',
            border: 'border-accent/20 bg-accent/[0.04]',
            itemBorder: 'border-accent/25',
            accent: 'text-accent',
            items: [
              { code: 'sigorta-hukuku-donem-1', title: '1. Dönem (Güz)' },
              { code: 'sigorta-hukuku-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'sigorta-hukuku-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some(
              (c) =>
                String(c.code).startsWith('ticari-isletme') ||
                c.code === 'ticari-isletme'
            ),
            title: 'Ticari İşletme — 1. dönem · 2. dönem · yıllık',
            desc: 'Tacir–sicil–acente–devir… üç premium not + PDF.',
            border: 'border-primary/20 bg-primary/[0.04]',
            itemBorder: 'border-primary/25',
            accent: 'text-primary',
            items: [
              { code: 'ticari-isletme-donem-1', title: '1. Dönem (Güz)' },
              { code: 'ticari-isletme-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'ticari-isletme-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some(
              (c) =>
                String(c.code).startsWith('ceza-genel') ||
                c.code === 'ceza-genel'
            ),
            title: 'Ceza Genel — 1. dönem · 2. dönem · yıllık',
            desc: 'Tipiklik–kast–teşebbüs–iştirak–yaptırım… üç premium not + PDF.',
            border: 'border-charcoal/15 bg-charcoal/[0.03]',
            itemBorder: 'border-charcoal/15',
            accent: 'text-accent',
            items: [
              { code: 'ceza-genel-donem-1', title: '1. Dönem (Güz)' },
              { code: 'ceza-genel-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'ceza-genel-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some(
              (c) =>
                String(c.code).startsWith('ceza-ozel') ||
                c.code === 'ceza-ozel'
            ),
            title: 'Ceza Özel — 1. dönem · 2. dönem · yıllık',
            desc: 'Öldürme–hırsızlık–dolandırıcılık–kamu… üç premium not + PDF.',
            border: 'border-accent/20 bg-accent/[0.04]',
            itemBorder: 'border-accent/25',
            accent: 'text-accent',
            items: [
              { code: 'ceza-ozel-donem-1', title: '1. Dönem (Güz)' },
              { code: 'ceza-ozel-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'ceza-ozel-yillik', title: 'Yıllık tam not' },
            ],
          },
          {
            show: hub.courses.some(
              (c) =>
                String(c.code).startsWith('cmk-') ||
                c.code === 'ceza-muhakemesi' ||
                c.code === 'cmk'
            ),
            title: 'CMK — 1. dönem · 2. dönem · yıllık',
            desc: 'Yakalama–tutuklama–duruşma–istinaf… üç premium not + PDF.',
            border: 'border-primary/20 bg-primary/[0.04]',
            itemBorder: 'border-primary/25',
            accent: 'text-primary',
            items: [
              { code: 'cmk-donem-1', title: '1. Dönem (Güz)' },
              { code: 'cmk-donem-2', title: '2. Dönem (Bahar)' },
              { code: 'cmk-yillik', title: 'Yıllık tam not' },
            ],
          },
        ]
          .filter((b) => b.show)
          .map((block) => (
            <section key={block.title} className={`rounded-2xl border-2 ${block.border} p-5`}>
              <h2 className="text-lg font-heading font-bold text-charcoal mb-2">{block.title}</h2>
              <p className="text-sm text-charcoal/60 mb-4">{block.desc}</p>
              <ul className="grid sm:grid-cols-3 gap-2 m-0 p-0 list-none">
                {block.items.map((v) => (
                  <li key={v.code}>
                    <Link
                      href={`/ders-notlari/${hub.uni.slug}/${v.code}`}
                      className={`block rounded-xl border ${block.itemBorder} bg-white hover:border-accent px-3 py-3 text-sm font-semibold text-charcoal`}
                    >
                      {v.title}
                      <span className={`block text-[10px] font-normal ${block.accent} mt-1`}>
                        Not + PDF indir
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>

      {byYear.map(
        (b) =>
          b.items.length > 0 && (
            <section key={b.year} className="mt-10">
              <h2 className="text-lg font-heading font-bold text-charcoal mb-3">
                {b.year}. sınıf ders notları
              </h2>
              <ul className="grid sm:grid-cols-2 gap-2 m-0 p-0 list-none">
                {b.items
                  .filter(
                    (c) =>
                      !String(c.code).match(/^borclar-genel-(donem|yillik)/) &&
                      !String(c.code).match(/^borclar-ozel-(donem|yillik)/) &&
                      !String(c.code).match(/^esya-hukuku-(donem|yillik)/)
                  )
                  .map((c) => (
                  <li key={c.code}>
                    {'ready' in c && c.ready === false ? (
                      <span className="block rounded-xl border border-dashed border-charcoal/15 bg-charcoal/[0.02] px-3 py-2.5 text-sm text-charcoal/40">
                        {c.title}
                        <span className="block text-[10px] mt-0.5">Yakında</span>
                      </span>
                    ) : (
                      <Link
                        href={c.href}
                        className="block rounded-xl border border-charcoal/10 bg-white hover:border-accent/40 hover:shadow-sm px-3 py-3 text-sm font-semibold text-charcoal transition-all"
                      >
                        {c.title}
                        <span className="block text-[10px] font-normal text-charcoal/40 mt-1">
                          şematik · örnekli · premium
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )
      )}

      <section className="mt-12">
        <h2 className="text-lg font-heading font-bold text-charcoal mb-3">SSS</h2>
        {hub.faq.map((f) => (
          <details key={f.q} className="mb-2 rounded-xl border border-charcoal/10 bg-white">
            <summary className="cursor-pointer p-3 text-sm font-semibold">{f.q}</summary>
            <p className="px-3 pb-3 text-sm text-charcoal/65 m-0">{f.a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
