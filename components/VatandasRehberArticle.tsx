import Link from 'next/link';
import type { VatandasArticle } from '@/lib/vatandas-rehberi';
import { toReadableView } from '@/lib/vatandas-rehberi/readable';
import { hesaplamaToolsForBilgiSlug } from '@/lib/hesaplama-bilgi';

const SITE = 'https://www.avfethiguzel.com';

function Timeline({ steps }: { steps: string[] }) {
  if (!steps.length) return null;
  return (
    <section className="mb-12">
      <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal mb-5">
        Ne yapmalısınız?
      </h2>
      <ol className="relative m-0 p-0 list-none">
        <span
          className="absolute left-[1.15rem] top-3 bottom-3 w-0.5 bg-gradient-to-b from-accent via-accent/35 to-primary/20"
          aria-hidden
        />
        {steps.map((step, i) => (
          <li key={`${i}-${step.slice(0, 24)}`} className="relative flex gap-4 pb-5 last:pb-0">
            <span className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white text-sm font-bold shadow-md ring-4 ring-cream">
              {i + 1}
            </span>
            <p className="flex-1 min-w-0 m-0 rounded-2xl border border-charcoal/8 bg-white px-4 py-3.5 text-[15px] sm:text-base text-charcoal/80 leading-relaxed">
              {step}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function VatandasRehberArticle({
  article,
  related,
}: {
  article: VatandasArticle;
  related: VatandasArticle[];
}) {
  const pageUrl = `${SITE}/bilgi/${article.slug}`;
  const view = toReadableView(article);
  const calcLinks = hesaplamaToolsForBilgiSlug(article.slug);

  const howTo = view.steps.length
    ? {
        '@type': 'HowTo',
        name: article.h1,
        description: article.description,
        inLanguage: 'tr-TR',
        step: view.steps.map((text, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: `Adım ${i + 1}`,
          text,
        })),
      }
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: article.h1,
        description: article.description,
        dateModified: article.updated,
        datePublished: article.updated,
        inLanguage: 'tr-TR',
        isAccessibleForFree: true,
        author: {
          '@type': 'Person',
          name: 'Av. Fethi Güzel',
          url: `${SITE}/avukat-fethi-guzel`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Av. Fethi Güzel Hukuk Portalı',
          url: SITE,
        },
        mainEntityOfPage: pageUrl,
      },
      ...(view.faq.length
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: view.faq.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            },
          ]
        : []),
      ...(howTo ? [howTo] : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Vatandaş Rehberi',
            item: `${SITE}/bilgi`,
          },
          { '@type': 'ListItem', position: 3, name: article.h1, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-[11px] sm:text-xs text-charcoal/50 mb-5" aria-label="Konum">
        <Link href="/" className="hover:text-accent">
          Ana Sayfa
        </Link>
        {' · '}
        <Link href="/bilgi" className="hover:text-accent">
          Vatandaş rehberi
        </Link>
        {' · '}
        <Link
          href={`/bilgi/kategori/${encodeURIComponent(article.category)}`}
          className="hover:text-accent"
        >
          {article.category}
        </Link>
      </nav>

      <p className="text-accent font-mono text-[10px] tracking-[0.18em] uppercase mb-3">
        {article.category}
      </p>

      <h1 className="text-3xl sm:text-[2.15rem] font-heading font-bold text-charcoal mb-6 leading-[1.2]">
        {article.h1}
      </h1>

      <aside className="mb-10 rounded-2xl border border-accent/25 bg-gradient-to-b from-accent/[0.08] to-white px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-[11px] font-mono tracking-[0.16em] uppercase text-accent font-bold m-0 mb-2">
          Kısa cevap
        </p>
        <p className="text-[16px] sm:text-[17px] text-charcoal/85 leading-relaxed m-0">
          {view.answer}
        </p>
      </aside>

      {article.role === 'spoke' && article.pillar && (
        <p className="mb-8 text-sm text-charcoal/65">
          Konunun tamamı için{' '}
          <Link href={`/bilgi/${article.pillar}`} className="text-accent font-bold hover:underline">
            ana rehberi açın
          </Link>
          .
        </p>
      )}

      {article.role === 'bridge' && article.canonicalPath && (
        <p className="mb-8 text-sm text-charcoal/65">
          Resmî madde metni:{' '}
          <Link href={article.canonicalPath} className="text-accent font-bold hover:underline">
            madde sayfasına git
          </Link>
        </p>
      )}

      <Timeline steps={view.steps} />

      {view.documents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-4">
            Yanınızda ne olsun?
          </h2>
          <ul className="m-0 p-0 list-none grid gap-2 sm:grid-cols-2">
            {view.documents.map((d) => (
              <li
                key={d}
                className="rounded-xl border border-charcoal/8 bg-white px-3.5 py-2.5 text-[15px] text-charcoal/75"
              >
                {d}
              </li>
            ))}
          </ul>
        </section>
      )}

      {view.sections.map((sec) => (
        <section key={sec.heading} className="mb-10">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-4">{sec.heading}</h2>
          {sec.paragraphs.map((p) => (
            <p
              key={p.slice(0, 48)}
              className="text-charcoal/75 leading-[1.75] mb-3.5 text-[15px] sm:text-[16px]"
            >
              {p}
            </p>
          ))}
          {sec.bullets && sec.bullets.length > 0 && (
            <ul className="mt-2 space-y-2 list-none m-0 p-0">
              {sec.bullets.map((b) => (
                <li
                  key={b}
                  className="flex gap-3 text-charcoal/75 text-[15px] leading-relaxed rounded-xl bg-white border border-charcoal/6 px-3 py-2.5"
                >
                  <span className="text-accent font-bold shrink-0" aria-hidden>
                    ·
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {view.showTable && article.table && (
        <section className="mb-12 overflow-x-auto">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-4">
            {article.table.caption}
          </h2>
          <table className="w-full min-w-[20rem] text-left text-sm border-collapse">
            <thead>
              <tr className="bg-primary text-cream">
                {article.table.headers.map((h) => (
                  <th
                    key={h}
                    className="px-3 py-3 font-semibold text-[13px] first:rounded-tl-xl last:rounded-tr-xl"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {article.table.rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-cream/70'}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-3 py-2.5 text-charcoal/75 leading-snug border-t border-charcoal/5 ${ci === 0 ? 'font-medium text-charcoal' : ''}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {view.showChecklist && (
        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-4">Kontrol listesi</h2>
          <ul className="flex flex-col gap-2 m-0 p-0 list-none">
            {view.checklist.map((item, i) => (
              <li
                key={item}
                className="flex gap-3 items-start rounded-xl border border-charcoal/8 bg-white px-3.5 py-3 text-[15px] text-charcoal/75 leading-relaxed"
              >
                <span className="shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-md border border-accent/30 text-accent text-xs font-bold">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {view.faq.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-5">
            Sık sorulan sorular
          </h2>
          <div className="flex flex-col gap-3">
            {view.faq.map((f, i) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-charcoal/10 bg-white open:border-accent/25"
              >
                <summary className="cursor-pointer list-none flex items-start gap-3 p-4 sm:p-5 font-semibold text-charcoal text-[15px] [&::-webkit-details-marker]:hidden">
                  <span className="shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="flex-1">{f.q}</span>
                  <span className="text-charcoal/25 group-open:rotate-45 transition-transform text-lg leading-none">
                    +
                  </span>
                </summary>
                <p className="px-4 sm:px-5 pb-4 sm:pb-5 pl-14 text-charcoal/70 text-[15px] leading-relaxed m-0 -mt-1">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {calcLinks.length > 0 && (
        <section className="mb-10 rounded-2xl border border-primary/15 bg-primary/[0.04] p-5">
          <h2 className="text-lg font-heading font-bold text-charcoal mb-2">Hesaplamak isterseniz</h2>
          <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
            {calcLinks.map((c) => (
              <li key={c.id}>
                <Link
                  href={c.href}
                  className="inline-flex text-sm font-semibold px-3 py-1.5 rounded-full bg-white border border-charcoal/10 text-charcoal hover:border-accent hover:text-accent"
                >
                  {c.id} hesapla
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {article.links.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-heading font-bold text-charcoal mb-3">İlgili mevzuat</h2>
          <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
            {article.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex text-xs font-semibold px-3 py-1.5 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-heading font-bold text-charcoal mb-3">Bunlar da işinize yarar</h2>
          <ul className="flex flex-col gap-2 m-0 p-0 list-none">
            {related.slice(0, 5).map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/bilgi/${r.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-charcoal/8 bg-white px-3 py-2.5 text-sm text-charcoal font-semibold hover:border-accent/40 hover:text-accent transition-colors"
                >
                  <span className="text-accent">→</span>
                  {r.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-sm text-charcoal/45 border-t border-charcoal/10 pt-6 m-0">
        Genel bilgilendirme. Somut dosyada süre ve merci değişebilir; güncel metin ve gerektiğinde
        avukat esastır. Güncelleme: {article.updated}
      </p>
      <p className="mt-5 mb-0">
        <Link href="/bilgi" className="text-accent font-bold hover:underline">
          ← Tüm rehberler
        </Link>
      </p>
    </>
  );
}
