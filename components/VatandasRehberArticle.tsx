import Link from 'next/link';
import type { VatandasArticle, VatandasVisual } from '@/lib/vatandas-rehberi';

const SITE = 'https://www.avfethiguzel.com';

/** Metinde kalan "(1) … (2) …" kalıbını dikey maddelere böler */
function splitNumberedFlow(text: string): string[] | null {
  if (!/\(\s*1\s*\)/.test(text) || !/\(\s*2\s*\)/.test(text)) return null;
  const parts = text
    .split(/\(\s*\d+\s*\)\s*/)
    .map((p) =>
      p
        .replace(/^Tipik akış:\s*/i, '')
        .replace(/^Belgeleri klasörleyin:\s*/i, '')
        .replace(/[.;]\s*$/, '')
        .trim()
    )
    .filter((p) => p.length > 2);
  // İlk parça giriş cümlesi olabilir ("Belgeleri klasörleyin")
  const items = parts.filter((p) => !/:$/.test(p) && p.length < 200);
  return items.length >= 2 ? items : null;
}

/** Dikey süreç zaman çizelgesi — asla yan yana kart dizisi değil */
function VerticalTimeline({
  steps,
  title = 'Adım adım',
}: {
  steps: string[];
  title?: string;
}) {
  if (!steps.length) return null;
  return (
    <section className="mb-12" aria-labelledby={title ? 'vatandas-adimlar' : undefined}>
      {title ? (
        <h2
          id="vatandas-adimlar"
          className="text-xl sm:text-2xl font-heading font-bold text-charcoal mb-6"
        >
          {title}
        </h2>
      ) : null}
      <ol className="relative m-0 p-0 list-none">
        {/* dikey çizgi */}
        <span
          className="absolute left-[1.15rem] top-3 bottom-3 w-0.5 bg-gradient-to-b from-accent via-accent/40 to-primary/30"
          aria-hidden
        />
        {steps.map((step, i) => {
          const clean = step.replace(/^\d+\.\s*/, '').trim();
          return (
            <li key={`${i}-${clean.slice(0, 24)}`} className="relative flex gap-4 pb-6 last:pb-0">
              <span className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white text-sm font-bold shadow-md ring-4 ring-cream">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0 rounded-2xl border border-charcoal/8 bg-white px-4 py-3.5 shadow-[var(--shadow-soft)]">
                <p className="text-[15px] sm:text-base text-charcoal/80 leading-relaxed m-0">
                  {clean}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function ProcessGraphic({ steps }: { steps?: string[] }) {
  const n = Math.min(Math.max(steps?.length || 4, 3), 6);
  const labels =
    steps?.slice(0, n).map((s, i) => {
      const t = s.replace(/^\d+\.\s*/, '').trim();
      return t.length > 42 ? t.slice(0, 40) + '…' : t;
    }) || Array.from({ length: n }, (_, i) => `Adım ${i + 1}`);

  return (
    <figure className="mb-10 rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6 shadow-[var(--shadow-soft)] overflow-hidden">
      <figcaption className="text-[11px] font-mono tracking-[0.14em] uppercase text-accent mb-5">
        Görsel özet · süreç
      </figcaption>
      <svg
        viewBox={`0 0 320 ${n * 56 + 16}`}
        className="w-full h-auto max-w-md mx-auto text-charcoal"
        role="img"
        aria-label="Süreç adımları dikey şema"
      >
        {labels.map((label, i) => {
          const y = 28 + i * 56;
          return (
            <g key={i}>
              {i < labels.length - 1 && (
                <line
                  x1="28"
                  y1={y + 16}
                  x2="28"
                  y2={y + 40}
                  stroke="#CC5833"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  opacity="0.45"
                />
              )}
              <circle cx="28" cy={y} r="14" fill="#CC5833" />
              <text
                x="28"
                y={y + 5}
                textAnchor="middle"
                fill="#fff"
                fontSize="12"
                fontWeight="700"
                fontFamily="system-ui,sans-serif"
              >
                {i + 1}
              </text>
              <rect
                x="52"
                y={y - 16}
                width="250"
                height="32"
                rx="8"
                fill="#F2F0E9"
                stroke="rgba(26,26,26,0.08)"
              />
              <text
                x="64"
                y={y + 5}
                fill="#1A1A1A"
                fontSize="11"
                fontFamily="system-ui,sans-serif"
                opacity="0.8"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

function MiniVisual({ type }: { type?: VatandasVisual }) {
  const t = type || 'process';
  if (t === 'clock') {
    return (
      <div className="mb-8 flex items-center gap-4 rounded-2xl border border-charcoal/10 bg-white p-4 shadow-sm">
        <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0 text-accent" aria-hidden>
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="60 120"
            strokeLinecap="round"
            className="origin-center -rotate-90"
          />
          <line x1="32" y1="32" x2="32" y2="18" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="32" r="2.5" fill="#CC5833" />
        </svg>
        <p className="text-sm text-charcoal/70 leading-relaxed m-0">
          <strong className="text-charcoal">Süreye dikkat.</strong> Tebliğ veya öğrenme tarihini
          yazmadan işlem yapmayın.
        </p>
      </div>
    );
  }
  if (t === 'shield') {
    return (
      <div className="mb-8 flex items-center gap-4 rounded-2xl border border-accent/20 bg-accent/5 p-4">
        <svg viewBox="0 0 48 56" className="h-12 w-10 shrink-0 text-accent" aria-hidden>
          <path
            d="M24 4 L42 12 V28 C42 40 32 48 24 52 C16 48 6 40 6 28 V12 Z"
            fill="currentColor"
            opacity="0.15"
          />
          <path
            d="M24 8 L38 14 V28 C38 37 30 44 24 47 C18 44 10 37 10 28 V14 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M17 28 L22 33 L32 21"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-sm text-charcoal/70 leading-relaxed m-0">
          <strong className="text-charcoal">Koruma üçlüsü:</strong> doğru merci · doğru süre · yazılı
          belge.
        </p>
      </div>
    );
  }
  if (t === 'fork') {
    return (
      <div className="mb-8 rounded-2xl border border-charcoal/10 bg-white p-4 shadow-sm">
        <p className="text-[11px] font-mono uppercase tracking-wider text-accent mb-3">İki yol</p>
        <div className="flex flex-col gap-2">
          <div className="rounded-xl bg-accent/8 border border-accent/20 px-3 py-2.5 text-sm text-charcoal/75">
            <strong className="text-accent">A ·</strong> Süre yakınsa önce yazılı başvur, belgeyi
            sonra tamamla
          </div>
          <div className="rounded-xl bg-primary/8 border border-primary/15 px-3 py-2.5 text-sm text-charcoal/75">
            <strong className="text-primary">B ·</strong> Süre varsa önce belge ve merciyi netleştir
          </div>
        </div>
      </div>
    );
  }
  if (t === 'scale') {
    return (
      <div className="mb-8 grid grid-cols-3 gap-2">
        {['Delil', 'Süre', 'Merci'].map((lab, i) => (
          <div
            key={lab}
            className="rounded-xl border border-charcoal/8 bg-white py-3 text-center shadow-sm"
          >
            <div
              className="mx-auto mb-1.5 h-8 w-8 rounded-full text-white text-xs font-bold flex items-center justify-center"
              style={{ background: i === 0 ? '#CC5833' : i === 1 ? '#2E4036' : '#1A1A1A' }}
            >
              {i + 1}
            </div>
            <p className="text-xs font-semibold text-charcoal m-0">{lab}</p>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function SectionBlock({
  heading,
  paragraphs,
  bullets,
}: {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-heading font-bold text-charcoal mb-4">{heading}</h2>
      {paragraphs.map((p) => {
        const numbered = splitNumberedFlow(p);
        if (numbered) {
          return (
            <VerticalTimeline key={p.slice(0, 20)} steps={numbered} title="" />
          );
        }
        return (
          <p
            key={p.slice(0, 48)}
            className="text-charcoal/70 leading-[1.7] mb-3.5 text-[15px] sm:text-[16px]"
          >
            {p}
          </p>
        );
      })}
      {bullets && bullets.length > 0 && (
        <ul className="mt-3 space-y-2.5 list-none m-0 p-0">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex gap-3 text-charcoal/70 text-[15px] leading-relaxed rounded-xl bg-cream/80 border border-charcoal/6 px-3 py-2.5"
            >
              <span className="text-accent font-bold shrink-0" aria-hidden>
                ·
              </span>
              <span>{b.replace(/^\d+\.\s*/, '')}</span>
            </li>
          ))}
        </ul>
      )}
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

  // Bölümleri katmanla: önce temel, sonra derin
  const basicSections = article.sections.slice(0, 3);
  const deepSections = article.sections.slice(3);

  // Adımlar: steps yoksa section bullets'tan topla
  const flowSteps =
    article.steps && article.steps.length > 0
      ? article.steps
      : article.sections
          .flatMap((s) => s.bullets || [])
          .filter((b) => /^\d+\./.test(b) || b.length > 20)
          .slice(0, 8);

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
          Vatandaş Bilgi Rehberi
        </Link>
        {' · '}
        <span className="text-charcoal/70">{article.category}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <p className="text-accent font-mono text-[10px] tracking-[0.18em] uppercase m-0">
          {article.category}
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
      </div>

      <h1 className="text-3xl sm:text-[2.15rem] font-heading font-bold text-charcoal mb-6 leading-[1.2]">
        {article.h1}
      </h1>

      {/* —— 1. HAP BİLGİ (önce bu) —— */}
      <aside className="mb-8 rounded-2xl border border-accent/25 bg-gradient-to-b from-accent/[0.09] to-white px-5 py-5 sm:px-6 sm:py-6 shadow-[var(--shadow-soft)]">
        <p className="text-[11px] font-mono tracking-[0.16em] uppercase text-accent font-bold m-0 mb-2">
          Hap bilgi
        </p>
        {article.keyInsight && (
          <p className="text-lg sm:text-xl font-heading font-semibold text-charcoal leading-snug m-0 mb-3">
            {article.keyInsight}
          </p>
        )}
        <p className="text-[15px] sm:text-base text-charcoal/75 leading-relaxed m-0">
          {article.lead}
        </p>
      </aside>

      <p className="text-[12px] text-charcoal/45 mb-8 m-0">
        Genel bilgilendirme · sonuç vaadi yok · güncelleme: {article.updated}
      </p>

      {article.role === 'spoke' && article.pillar && (
        <div className="mb-8 rounded-xl border border-charcoal/10 bg-cream/90 px-4 py-3 text-sm text-charcoal/70">
          Tam süreç için:{' '}
          <Link href={`/bilgi/${article.pillar}`} className="text-accent font-bold hover:underline">
            Ana rehberi aç →
          </Link>
        </div>
      )}

      {article.role === 'bridge' && article.canonicalPath && (
        <div className="mb-8 rounded-xl border border-charcoal/10 bg-white px-4 py-3 text-sm text-charcoal/70">
          Resmî metin + şerh:{' '}
          <Link href={article.canonicalPath} className="text-accent font-bold hover:underline">
            Madde sayfasına git →
          </Link>
        </div>
      )}

      {/* —— 2. GÖRSEL —— */}
      <MiniVisual type={article.visual} />
      {flowSteps.length > 0 && <ProcessGraphic steps={flowSteps} />}

      {/* —— 3. ADIMLAR (dikey, yan yana değil) —— */}
      {flowSteps.length > 0 && (
        <VerticalTimeline steps={flowSteps} title="Ne yapmalısınız? (sırayla)" />
      )}

      {/* —— 4. TEMEL DETAY —— */}
      <div className="mb-2">
        <p className="text-[11px] font-mono tracking-[0.14em] uppercase text-charcoal/40 mb-6">
          Temel bilgiler
        </p>
      </div>
      {basicSections.map((sec) => (
        <SectionBlock
          key={sec.heading}
          heading={sec.heading}
          paragraphs={sec.paragraphs}
          bullets={
            // Süreç bölümündeki numaralı bullets zaten timeline'da — tekrar etme
            /süreç|adım/i.test(sec.heading) ? undefined : sec.bullets
          }
        />
      ))}

      {/* —— 5. ÖRNEK / SENARYO (orta derinlik) —— */}
      {article.examples && article.examples.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-5">Örnekler</h2>
          <div className="flex flex-col gap-4">
            {article.examples.map((ex) => (
              <article
                key={ex.title}
                className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden shadow-sm"
              >
                <div className="border-l-4 border-accent px-4 py-4 sm:px-5">
                  <h3 className="font-heading font-bold text-charcoal text-base m-0 mb-2">
                    {ex.title}
                  </h3>
                  <p className="text-charcoal/70 text-[15px] leading-relaxed m-0 mb-3">{ex.body}</p>
                  {ex.takeaway && (
                    <p className="text-sm font-semibold text-primary bg-primary/5 rounded-lg px-3 py-2 m-0">
                      Özet: {ex.takeaway}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {article.scenarios && article.scenarios.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-5">Senaryolar</h2>
          <div className="flex flex-col gap-4">
            {article.scenarios.map((sc) => (
              <div
                key={sc.title}
                className="rounded-2xl border border-charcoal/10 bg-white p-4 sm:p-5 shadow-sm"
              >
                <h3 className="font-semibold text-charcoal text-[15px] m-0 mb-3">{sc.title}</h3>
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl bg-charcoal/[0.03] p-3">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-charcoal/40 m-0 mb-1">
                      Durum
                    </p>
                    <p className="text-sm text-charcoal/70 leading-relaxed m-0">{sc.facts}</p>
                  </div>
                  <div className="rounded-xl bg-accent/5 border border-accent/15 p-3">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-accent m-0 mb-1">
                      Ne yapın?
                    </p>
                    <p className="text-sm text-charcoal/75 leading-relaxed m-0">{sc.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {article.table && (
        <section className="mb-12 overflow-x-auto">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-4">
            {article.table.caption}
          </h2>
          <table className="w-full min-w-[20rem] text-left text-sm border-collapse">
            <thead>
              <tr className="bg-primary text-cream">
                {article.table.headers.map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold text-[13px] first:rounded-tl-xl last:rounded-tr-xl">
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

      {article.checklist && article.checklist.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-4">Kontrol listesi</h2>
          <ul className="flex flex-col gap-2 m-0 p-0 list-none">
            {article.checklist.map((item, i) => (
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

      {/* —— 6. DERİNLEŞTİRME —— */}
      {deepSections.length > 0 && (
        <>
          <div className="my-12 flex items-center gap-3">
            <span className="h-px flex-1 bg-charcoal/10" />
            <p className="text-[11px] font-mono tracking-[0.14em] uppercase text-charcoal/40 m-0 shrink-0">
              Daha ayrıntılı
            </p>
            <span className="h-px flex-1 bg-charcoal/10" />
          </div>
          {deepSections.map((sec) => (
            <SectionBlock
              key={sec.heading}
              heading={sec.heading}
              paragraphs={sec.paragraphs}
              bullets={/süreç|adım/i.test(sec.heading) ? undefined : sec.bullets}
            />
          ))}
        </>
      )}

      {/* —— 7. SSS —— */}
      {article.faq.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-5">
            Sık sorulan sorular
          </h2>
          <div className="flex flex-col gap-3">
            {article.faq.map((f, i) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-charcoal/10 bg-white open:border-accent/25 open:shadow-sm"
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
                <p className="px-4 sm:px-5 pb-4 sm:pb-5 pl-14 text-charcoal/65 text-[15px] leading-relaxed m-0 -mt-1">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-lg font-heading font-bold text-charcoal mb-3">Araçlar ve mevzuat</h2>
        <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
          <li>
            <Link
              href={`/ara?q=${encodeURIComponent(article.keywords[0] || article.h1)}`}
              className="inline-flex text-xs font-semibold px-3 py-1.5 rounded-full bg-charcoal text-cream hover:bg-accent transition-colors"
            >
              Kanun maddesi ara
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
          <h2 className="text-lg font-heading font-bold text-charcoal mb-3">İlgili rehberler</h2>
          <ul className="flex flex-col gap-2 m-0 p-0 list-none">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/bilgi/${r.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-charcoal/8 bg-white px-3 py-2.5 text-sm text-accent font-semibold hover:border-accent/30 transition-colors"
                >
                  <span className="text-charcoal/25">→</span>
                  {r.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-sm text-charcoal/45 border-t border-charcoal/10 pt-6 m-0">
        Av. Fethi Güzel Hukuk Portalı · bilgilendirme
      </p>
      <p className="mt-4 mb-0">
        <Link href="/bilgi" className="text-accent font-bold hover:underline">
          ← Tüm rehberler
        </Link>
      </p>
    </>
  );
}
