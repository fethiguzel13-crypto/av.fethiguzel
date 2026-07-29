import Link from 'next/link';
import type { CourseNote, UniHubContent } from '@/lib/ders-notlari';

const SITE = 'https://www.avfethiguzel.com';

function Diagram({ d }: { d: CourseNote['diagrams'][0] }) {
  if (d.kind === 'process') {
    return (
      <figure className="my-8 rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
        <figcaption className="text-[11px] font-mono uppercase tracking-wider text-accent mb-4">
          {d.title}
        </figcaption>
        <ol className="relative m-0 p-0 list-none">
          <span className="absolute left-4 top-2 bottom-2 w-0.5 bg-accent/30" aria-hidden />
          {d.steps.map((step, i) => (
            <li key={step} className="relative flex gap-3 pb-4 last:pb-0">
              <span className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-sm text-charcoal/80 pt-1.5">{step}</span>
            </li>
          ))}
        </ol>
      </figure>
    );
  }
  if (d.kind === 'compare') {
    return (
      <figure className="my-8 overflow-x-auto rounded-2xl border border-charcoal/10 bg-white shadow-sm">
        <figcaption className="px-4 pt-4 text-[11px] font-mono uppercase tracking-wider text-accent">
          {d.title}
        </figcaption>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="bg-charcoal/[0.04]">
              {d.headers.map((h) => (
                <th key={h} className="text-left px-3 py-2 font-semibold text-charcoal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.rows.map((row, ri) => (
              <tr key={ri} className="border-t border-charcoal/5">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2 text-charcoal/70">
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
  return (
    <figure className="my-8 grid sm:grid-cols-2 gap-3">
      <div className="rounded-xl border border-accent/25 bg-accent/5 p-4 text-sm text-charcoal/75">
        <p className="text-[10px] font-mono uppercase text-accent mb-2">Sol dal</p>
        {d.left}
      </div>
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-charcoal/75">
        <p className="text-[10px] font-mono uppercase text-primary mb-2">Sağ dal</p>
        {d.right}
      </div>
      <figcaption className="sm:col-span-2 text-[11px] text-charcoal/45">{d.title}</figcaption>
    </figure>
  );
}

export function DersNotuView({
  note,
  hub,
}: {
  note: CourseNote;
  hub: UniHubContent;
}) {
  const pageUrl = `${SITE}/ders-notlari/${note.uniSlug}/${note.courseCode}`;
  const pdfHref = `/ders-notlari/${note.uniSlug}/${note.courseCode}/pdf`;

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

      <p className="text-accent font-mono text-[10px] tracking-widest uppercase mb-2">
        Ücretsiz öğrenci notu · {hub.uni.city} · {hub.uni.type}
      </p>
      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4 leading-tight">
        {note.h1}
      </h1>
      <p className="text-charcoal/60 text-base leading-relaxed mb-6 max-w-3xl">{note.lead}</p>

      <div className="flex flex-wrap gap-2 mb-8 print:hidden">
        <Link
          href={pdfHref}
          className="inline-flex text-sm font-bold px-4 py-2 rounded-full bg-accent text-white hover:bg-accent/90"
        >
          PDF / Yazdır
        </Link>
        <Link
          href={`/ders-notlari/${note.uniSlug}`}
          className="inline-flex text-sm font-semibold px-4 py-2 rounded-full border border-charcoal/15 text-charcoal/70"
        >
          Tüm {hub.uni.shortName} notları
        </Link>
        <Link
          href="/mevzuat"
          className="inline-flex text-sm font-semibold px-4 py-2 rounded-full border border-charcoal/15 text-charcoal/70"
        >
          Mevzuat bankası
        </Link>
      </div>

      <aside className="mb-10 rounded-2xl border border-accent/20 bg-accent/[0.06] p-5">
        <h2 className="text-sm font-heading font-bold text-charcoal mb-2">Sınav kutusu — {hub.uni.shortName}</h2>
        <ul className="text-sm text-charcoal/70 space-y-1.5 m-0 p-0 list-none">
          <li>
            <strong>Takvim:</strong> {note.examBox.calendar}
          </li>
          <li>
            <strong>Tipik ağırlık:</strong> {note.examBox.typicalWeights}
          </li>
          <li>
            <strong>Format:</strong> {note.examBox.format}
          </li>
        </ul>
        <p className="text-xs text-charcoal/50 mt-3 mb-0">
          Kesin oran ve tarih için fakülte yönetmeliği / OBS duyurusu esastır.
        </p>
      </aside>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold text-charcoal mb-3">Öğrenme çıktıları</h2>
        <ul className="space-y-2">
          {note.learningOutcomes.map((o) => (
            <li key={o} className="flex gap-2 text-sm text-charcoal/75">
              <span className="text-accent font-bold">✓</span> {o}
            </li>
          ))}
        </ul>
      </section>

      {note.diagrams.map((d) => (
        <Diagram key={d.title} d={d} />
      ))}

      {note.sections.map((sec) => (
        <section key={sec.heading} className="mb-10">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-4">{sec.heading}</h2>
          {sec.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="text-charcoal/70 leading-[1.75] mb-3 text-[15px]">
              {p}
            </p>
          ))}
          {sec.bullets && (
            <ul className="mt-3 space-y-2">
              {sec.bullets.map((b) => (
                <li
                  key={b}
                  className="rounded-xl border border-charcoal/8 bg-white px-3 py-2 text-sm text-charcoal/75"
                >
                  {b}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold text-charcoal mb-5">İşlenmiş örnek olaylar</h2>
        <div className="flex flex-col gap-4">
          {note.examples.map((ex) => (
            <article
              key={ex.title}
              className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden shadow-sm"
            >
              <div className="border-l-4 border-accent px-4 py-4 sm:px-5">
                <h3 className="font-heading font-bold text-charcoal text-base m-0 mb-2">{ex.title}</h3>
                <p className="text-sm text-charcoal/55 m-0 mb-2">
                  <strong>Olay:</strong> {ex.facts}
                </p>
                <p className="text-sm text-charcoal/75 m-0 mb-2">
                  <strong>Çözüm iskeleti:</strong> {ex.analysis}
                </p>
                <p className="text-sm text-accent font-semibold m-0">→ {ex.takeaway}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold text-charcoal mb-4">Kontrol listesi</h2>
        <ul className="space-y-2">
          {note.checklist.map((c, i) => (
            <li
              key={c}
              className="flex gap-3 rounded-xl border border-charcoal/8 bg-white px-3 py-2.5 text-sm text-charcoal/75"
            >
              <span className="text-accent font-bold">{i + 1}</span>
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold text-charcoal mb-4">SSS</h2>
        <div className="space-y-3">
          {note.faq.map((f) => (
            <details
              key={f.q}
              className="rounded-2xl border border-charcoal/10 bg-white open:border-accent/25"
            >
              <summary className="cursor-pointer list-none p-4 font-semibold text-sm text-charcoal">
                {f.q}
              </summary>
              <p className="px-4 pb-4 text-sm text-charcoal/65 m-0">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="text-xs text-charcoal/45 border-t border-charcoal/10 pt-6">
        Av. Fethi Güzel Hukuk Portalı · ücretsiz öğrenci desteği · bilgilendirme / eğitim materyali ·
        resmi müfredatın yerine geçmez · güncelleme: {note.updated}
      </p>
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
      <p className="text-accent font-mono text-[10px] tracking-widest uppercase mb-2">
        {hub.uni.city} · {hub.uni.type} · {hub.uni.calendar} · ücretsiz
      </p>
      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">{hub.h1}</h1>
      <p className="text-charcoal/60 text-base leading-relaxed mb-6 max-w-3xl">{hub.lead}</p>

      {hub.seoParagraphs.map((p) => (
        <p key={p.slice(0, 30)} className="text-sm text-charcoal/65 leading-relaxed mb-3">
          {p}
        </p>
      ))}

      {byYear.map(
        (b) =>
          b.items.length > 0 && (
            <section key={b.year} className="mt-10">
              <h2 className="text-lg font-heading font-bold text-charcoal mb-3">
                {b.year}. sınıf ders notları
              </h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {b.items.map((c) => (
                  <li key={c.code}>
                    {'ready' in c && c.ready === false ? (
                      <span className="block rounded-xl border border-dashed border-charcoal/15 bg-charcoal/[0.02] px-3 py-2.5 text-sm text-charcoal/40">
                        {c.title}
                        <span className="block text-[10px] mt-0.5">Dalga planında genişletilecek</span>
                      </span>
                    ) : (
                      <Link
                        href={c.href}
                        className="block rounded-xl border border-charcoal/10 bg-white hover:border-accent/40 px-3 py-2.5 text-sm font-semibold text-charcoal"
                      >
                        {c.title}
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
