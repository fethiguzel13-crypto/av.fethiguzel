import Link from 'next/link';
import type { VatandasArticle, VatandasVisual } from '@/lib/vatandas-rehberi';

const SITE = 'https://www.avfethiguzel.com';

function VisualDiagram({
  type,
  title,
  steps,
}: {
  type?: VatandasVisual;
  title: string;
  steps?: string[];
}) {
  const t = type || 'process';
  const n = Math.min(steps?.length || 5, 6);

  if (t === 'process' || t === 'stack') {
    return (
      <figure className="vatandas-visual mb-10 rounded-2xl border border-charcoal/10 bg-gradient-to-br from-white via-cream/80 to-white p-5 sm:p-7 shadow-[var(--shadow-soft)] overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]" aria-hidden>
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-accent blur-2xl" />
          <div className="absolute -left-10 bottom-0 w-48 h-48 rounded-full bg-primary blur-3xl" />
        </div>
        <figcaption className="relative text-[10px] font-mono tracking-[0.18em] uppercase text-accent mb-4">
          Süreç haritası · {title.slice(0, 48)}
          {title.length > 48 ? '…' : ''}
        </figcaption>
        <ol className="relative flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-2">
          {Array.from({ length: n }).map((_, i) => (
            <li
              key={i}
              className="vatandas-step-card flex-1 min-w-[7.5rem] rounded-xl border border-charcoal/10 bg-white/90 px-3 py-3 shadow-sm"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white text-xs font-bold mb-2">
                {i + 1}
              </span>
              <p className="text-[12px] sm:text-[13px] text-charcoal/75 leading-snug font-medium">
                {steps?.[i]
                  ? steps[i].length > 72
                    ? steps[i].slice(0, 72) + '…'
                    : steps[i]
                  : `Adım ${i + 1}`}
              </p>
            </li>
          ))}
        </ol>
        <svg
          className="hidden sm:block absolute left-8 right-8 top-[4.6rem] h-2 text-accent/30"
          viewBox="0 0 100 4"
          preserveAspectRatio="none"
          aria-hidden
        >
          <line
            x1="0"
            y1="2"
            x2="100"
            y2="2"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 2"
            className="vatandas-flow-line"
          />
        </svg>
      </figure>
    );
  }

  if (t === 'fork') {
    return (
      <figure className="vatandas-visual mb-10 rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6 shadow-[var(--shadow-soft)]">
        <figcaption className="text-[10px] font-mono tracking-[0.18em] uppercase text-accent mb-4">
          Karar ağacı · iki yol
        </figcaption>
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-xl bg-primary text-cream px-4 py-2 text-sm font-semibold text-center max-w-xs">
            {title.length > 60 ? title.slice(0, 60) + '…' : title}
          </div>
          <div className="flex gap-6 sm:gap-12 w-full justify-center">
            <div className="vatandas-step-card flex-1 max-w-[11rem] rounded-xl border-2 border-accent/30 bg-accent/5 p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-accent font-bold mb-1">Yol A</p>
              <p className="text-xs text-charcoal/70">Süre koru · yazılı başvur</p>
            </div>
            <div className="vatandas-step-card flex-1 max-w-[11rem] rounded-xl border-2 border-primary/25 bg-primary/5 p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">Yol B</p>
              <p className="text-xs text-charcoal/70">Belge tamamla · planlı ilerle</p>
            </div>
          </div>
        </div>
      </figure>
    );
  }

  if (t === 'clock') {
    return (
      <figure className="vatandas-visual mb-10 rounded-2xl border border-charcoal/10 bg-white p-5 shadow-[var(--shadow-soft)] flex flex-col sm:flex-row gap-5 items-center">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full text-accent" aria-hidden>
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              opacity="0.2"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="180 276"
              strokeLinecap="round"
              className="vatandas-clock-arc origin-center -rotate-90"
            />
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="28"
              stroke="#1A1A1A"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="vatandas-clock-hand origin-[50px_50px]"
            />
            <circle cx="50" cy="50" r="3" fill="#CC5833" />
          </svg>
        </div>
        <div>
          <figcaption className="text-[10px] font-mono tracking-[0.18em] uppercase text-accent mb-2">
            Süre bilinci
          </figcaption>
          <p className="text-sm text-charcoal/75 leading-relaxed">
            Tebliğ veya öğrenme anı takvime işlenmeden «{title.slice(0, 40)}
            {title.length > 40 ? '…' : ''}» dosyasında adım atmak risklidir. e-Tebligat
            kurallarını da hesaba katın.
          </p>
        </div>
      </figure>
    );
  }

  if (t === 'scale') {
    return (
      <figure className="vatandas-visual mb-10 rounded-2xl border border-charcoal/10 bg-white p-5 shadow-[var(--shadow-soft)]">
        <figcaption className="text-[10px] font-mono tracking-[0.18em] uppercase text-accent mb-4">
          Denge: delil × süre × merci
        </figcaption>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          {['Delil', 'Süre', 'Merci'].map((label, i) => (
            <div
              key={label}
              className="vatandas-step-card rounded-xl bg-cream/80 border border-charcoal/8 py-4 px-2"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="mx-auto mb-2 h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{
                  background: i === 0 ? '#CC5833' : i === 1 ? '#2E4036' : '#1A1A1A',
                }}
              >
                {i + 1}
              </div>
              <p className="text-xs font-semibold text-charcoal">{label}</p>
            </div>
          ))}
        </div>
      </figure>
    );
  }

  // shield default
  return (
    <figure className="vatandas-visual mb-10 rounded-2xl border border-accent/20 bg-accent/5 p-5 sm:p-6 shadow-[var(--shadow-soft)] flex gap-4 items-start">
      <svg
        viewBox="0 0 48 56"
        className="h-14 w-12 shrink-0 text-accent vatandas-shield"
        aria-hidden
      >
        <path
          d="M24 2 L44 10 V26 C44 40 32 50 24 54 C16 50 4 40 4 26 V10 Z"
          fill="currentColor"
          opacity="0.15"
        />
        <path
          d="M24 6 L40 12.5 V26 C40 37 31 45.5 24 49 C17 45.5 8 37 8 26 V12.5 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M16 28 L22 34 L34 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div>
        <figcaption className="text-[10px] font-mono tracking-[0.18em] uppercase text-accent mb-1">
          Hak koruma çerçevesi
        </figcaption>
        <p className="text-sm text-charcoal/75 leading-relaxed">
          Yazılı iz, doğru merci ve süre bilinci; «{title.slice(0, 50)}
          {title.length > 50 ? '…' : ''}» dosyasında en sağlam üçlüdür.
        </p>
      </div>
    </figure>
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
  const howTo =
    article.steps && article.steps.length > 0
      ? {
          '@type': 'HowTo',
          name: article.h1,
          description: article.description,
          inLanguage: 'tr-TR',
          step: article.steps.map((text, i) => ({
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
          logo: {
            '@type': 'ImageObject',
            url: `${SITE}/images/av-fethi-guzel-square.jpg`,
          },
        },
        mainEntityOfPage: pageUrl,
        keywords: article.keywords.join(', '),
        about: article.category,
      },
      {
        '@type': 'FAQPage',
        mainEntity: article.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      ...(howTo ? [howTo] : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Vatandaş Bilgi Rehberi',
            item: `${SITE}/bilgi`,
          },
          { '@type': 'ListItem', position: 3, name: article.h1, item: pageUrl },
        ],
      },
    ],
  };

  const toc = [
    article.steps?.length ? 'Adımlar' : null,
    article.examples?.length ? 'Örnekler' : null,
    article.scenarios?.length ? 'Senaryolar' : null,
    article.table ? 'Kontrol tablosu' : null,
    article.checklist?.length ? 'Checklist' : null,
    ...article.sections.slice(0, 4).map((s) => s.heading),
    article.faq.length ? 'SSS' : null,
  ].filter(Boolean) as string[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-[11px] sm:text-xs text-charcoal/50 mb-6" aria-label="Konum">
        <Link href="/" className="hover:text-accent">
          Ana Sayfa
        </Link>
        {' · '}
        <Link href="/bilgi" className="hover:text-accent">
          Vatandaş Bilgi Rehberi
        </Link>
        {' · '}
        <span className="text-charcoal/70">{article.category}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <p className="text-accent font-mono text-[10px] tracking-[0.2em] uppercase">
          Vatandaş bilgilendirme · {article.category}
        </p>
        {article.role === 'pillar' && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            Ana rehber
          </span>
        )}
        {article.role === 'spoke' && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent">
            Alt konu
          </span>
        )}
        {article.role === 'bridge' && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-charcoal/10 text-charcoal/70">
            Madde özeti
          </span>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-5 leading-tight">
        {article.h1}
      </h1>

      {article.keyInsight && (
        <aside className="mb-6 rounded-2xl border-l-4 border-accent bg-gradient-to-r from-accent/10 to-transparent px-4 py-3.5 text-sm text-charcoal/80 leading-relaxed shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-accent font-bold block mb-1">
            Kilit nokta
          </span>
          {article.keyInsight}
        </aside>
      )}

      {article.role === 'spoke' && article.pillar && (
        <div className="mb-6 rounded-2xl border border-accent/25 bg-accent/5 px-4 py-3 text-sm text-charcoal/75 leading-relaxed">
          <strong className="text-charcoal">Bu sayfa dar niyetlidir</strong>
          {article.angle ? ` (${article.angle}).` : '.'} Tam süreç, belgeler ve hak kazanma için ana
          rehbere bakın:{' '}
          <Link href={`/bilgi/${article.pillar}`} className="text-accent font-bold hover:underline">
            Ana rehberi aç →
          </Link>
        </div>
      )}

      {article.role === 'bridge' && article.canonicalPath && (
        <div className="mb-6 rounded-2xl border border-charcoal/15 bg-white/80 px-4 py-3 text-sm text-charcoal/75 leading-relaxed">
          <strong className="text-charcoal">Resmî madde metni ve akademik şerh</strong> bu özetten
          ayrıdır:{' '}
          <Link href={article.canonicalPath} className="text-accent font-bold hover:underline">
            Tam madde + şerh sayfasına git →
          </Link>
        </div>
      )}

      <p className="text-charcoal/70 text-base sm:text-lg leading-relaxed mb-6">{article.lead}</p>

      <p className="text-[12px] text-charcoal/45 mb-8 border-l-2 border-accent/40 pl-3">
        Bu metin genel bilgilendirme amaçlıdır; somut olayda avukata danışılmalıdır. Sonuç vaadi
        içermez. Örnekler kurgusaldır. Güncelleme: {article.updated}.
      </p>

      <VisualDiagram type={article.visual} title={article.h1} steps={article.steps} />

      {toc.length > 3 && (
        <nav
          className="mb-10 rounded-2xl border border-charcoal/8 bg-white/70 p-4 sm:p-5"
          aria-label="İçindekiler"
        >
          <p className="text-[10px] font-mono tracking-[0.16em] uppercase text-charcoal/45 mb-2">
            Bu sayfada
          </p>
          <ul className="flex flex-wrap gap-2">
            {toc.map((item) => (
              <li key={item}>
                <span className="inline-flex text-[11px] sm:text-xs px-2.5 py-1 rounded-full bg-cream border border-charcoal/8 text-charcoal/65">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {article.steps && article.steps.length > 0 && (
        <section className="mb-12" id="adimlar">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-5 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white text-sm">
              →
            </span>
            Adım adım özet
          </h2>
          <ol className="space-y-3">
            {article.steps.map((s, i) => (
              <li
                key={s}
                className="vatandas-step-card flex gap-3 rounded-2xl border border-charcoal/8 bg-white/80 p-4 shadow-sm"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-cream text-sm font-bold">
                  {i + 1}
                </span>
                <p className="text-charcoal/75 text-sm sm:text-[15px] leading-relaxed pt-1.5">{s}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {article.examples && article.examples.length > 0 && (
        <section className="mb-12" id="ornekler">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-5">
            Çalışılmış örnekler
          </h2>
          <div className="grid gap-4">
            {article.examples.map((ex, i) => (
              <article
                key={ex.title}
                className="vatandas-step-card rounded-2xl border border-charcoal/10 bg-white overflow-hidden shadow-[var(--shadow-soft)]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="border-l-4 border-accent px-4 sm:px-5 py-4">
                  <h3 className="font-heading font-bold text-charcoal text-[15px] sm:text-base mb-2">
                    {ex.title}
                  </h3>
                  <p className="text-charcoal/70 text-sm sm:text-[15px] leading-relaxed mb-3">
                    {ex.body}
                  </p>
                  {ex.takeaway && (
                    <p className="text-xs sm:text-sm font-semibold text-primary bg-primary/5 rounded-lg px-3 py-2">
                      Çıkarım: {ex.takeaway}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {article.scenarios && article.scenarios.length > 0 && (
        <section className="mb-12" id="senaryolar">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-5">
            «Ne olur?» senaryoları
          </h2>
          <div className="grid sm:grid-cols-1 gap-4">
            {article.scenarios.map((sc, i) => (
              <div
                key={sc.title}
                className="vatandas-step-card rounded-2xl border border-charcoal/10 bg-gradient-to-br from-white to-cream/50 p-4 sm:p-5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <h3 className="font-semibold text-charcoal mb-3 text-[15px]">{sc.title}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-xl bg-charcoal/[0.03] p-3">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-charcoal/45 mb-1">
                      Olgular
                    </p>
                    <p className="text-sm text-charcoal/70 leading-relaxed">{sc.facts}</p>
                  </div>
                  <div className="rounded-xl bg-accent/5 p-3 border border-accent/15">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-accent mb-1">
                      Ne yapmalı?
                    </p>
                    <p className="text-sm text-charcoal/75 leading-relaxed">{sc.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {article.table && (
        <section className="mb-12 overflow-x-auto" id="tablo">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-4">
            {article.table.caption}
          </h2>
          <table className="w-full min-w-[32rem] text-left text-sm border-collapse rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
            <thead>
              <tr className="bg-primary text-cream">
                {article.table.headers.map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold text-[13px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {article.table.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className={ri % 2 === 0 ? 'bg-white' : 'bg-cream/60'}
                >
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

      {article.checklist && article.checklist.length > 0 && (
        <section className="mb-12" id="checklist">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-4">Kontrol listesi</h2>
          <ul className="space-y-2.5 rounded-2xl border border-charcoal/10 bg-white p-4 sm:p-5 shadow-sm">
            {article.checklist.map((item, i) => (
              <li
                key={item}
                className="flex gap-3 items-start text-sm sm:text-[15px] text-charcoal/75 leading-relaxed"
              >
                <span
                  className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded border-2 border-accent/40 text-accent text-[10px] font-bold"
                  aria-hidden
                >
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {article.sections.map((sec) => (
        <section key={sec.heading} className="mb-10">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-3">{sec.heading}</h2>
          {sec.paragraphs.map((p) => (
            <p
              key={p.slice(0, 48)}
              className="text-charcoal/70 leading-relaxed mb-3 text-[15px] sm:text-base"
            >
              {p}
            </p>
          ))}
          {sec.bullets && sec.bullets.length > 0 && (
            <ul className="mt-3 space-y-2">
              {sec.bullets.map((b) => (
                <li
                  key={b}
                  className="flex gap-2 text-charcoal/70 text-sm sm:text-base leading-relaxed"
                >
                  <span className="text-accent font-bold shrink-0">▸</span>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {article.faq.length > 0 && (
        <section className="mb-12" id="sss">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-5">
            Sık sorulan sorular
          </h2>
          <div className="space-y-3">
            {article.faq.map((f, i) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-charcoal/10 bg-white/80 open:shadow-[var(--shadow-soft)] open:border-accent/25 transition-shadow"
              >
                <summary className="cursor-pointer list-none flex items-start gap-3 p-4 sm:p-5 font-semibold text-charcoal text-[15px] [&::-webkit-details-marker]:hidden">
                  <span className="shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="flex-1">{f.q}</span>
                  <span className="text-charcoal/30 group-open:rotate-45 transition-transform text-lg leading-none">
                    +
                  </span>
                </summary>
                <p className="px-4 sm:px-5 pb-4 sm:pb-5 pl-[3.25rem] text-charcoal/65 text-sm sm:text-[15px] leading-relaxed -mt-1">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-lg font-heading font-bold text-charcoal mb-3">
          İlgili mevzuat ve araçlar
        </h2>
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href={`/ara?q=${encodeURIComponent(article.keywords[0] || article.h1)}`}
              className="inline-flex text-xs font-semibold px-3 py-1.5 rounded-full bg-charcoal text-cream hover:bg-accent transition-colors"
            >
              Kanun maddesi ara: {article.keywords[0] || 'mevzuat'}
            </Link>
          </li>
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

      {related.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-heading font-bold text-charcoal mb-4">İlgili rehberler</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/bilgi/${r.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-charcoal/8 bg-white/70 px-3 py-2.5 text-sm text-accent font-semibold hover:border-accent/40 hover:bg-accent/5 transition-colors"
                >
                  <span className="text-charcoal/30">→</span>
                  <span className="line-clamp-2">{r.h1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="rounded-2xl border border-charcoal/10 bg-primary/5 p-5 mb-8">
        <p className="text-sm text-charcoal/70 leading-relaxed">
          <strong className="text-charcoal">Av. Fethi Güzel Hukuk Portalı</strong> — vatandaş
          bilgilendirme. Bağlayıcı tavsiye veya sonuç vaadi içermez. Güncel madde metni için{' '}
          <Link href="/mevzuat" className="text-accent font-semibold hover:underline">
            mevzuat
          </Link>
          , arama için{' '}
          <Link href="/ara" className="text-accent font-semibold hover:underline">
            kanun maddesi ara
          </Link>
          .
        </p>
      </div>

      <p className="text-sm text-charcoal/50 border-t border-charcoal/10 pt-6">
        Anahtar aramalar: {article.keywords.join(' · ')}
      </p>
      <p className="mt-6">
        <Link href="/bilgi" className="text-accent font-bold hover:underline">
          ← Tüm vatandaş bilgi rehberleri
        </Link>
      </p>
    </>
  );
}
