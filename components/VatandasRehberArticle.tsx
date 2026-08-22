import Link from 'next/link';
import type { VatandasArticle } from '@/lib/vatandas-rehberi';
import { toReadableView } from '@/lib/vatandas-rehberi/readable';
import { hesaplamaToolsForBilgiSlug } from '@/lib/hesaplama-bilgi';
import { buildVisualPlan } from '@/lib/vatandas-rehberi/visual-plan';
import RehberHero from '@/components/rehber/RehberHero';
import {
  RehberAftermath,
  RehberClocks,
  RehberConditions,
  RehberDossier,
  RehberFork,
  RehberLedger,
  RehberMeasures,
  RehberProcess,
  RehberTrap,
} from '@/components/rehber/RehberFigures';

const SITE = 'https://www.avfethiguzel.com';

const HEADING_TONES = [
  { text: 'text-accent', bar: 'bg-accent', wash: 'from-accent/12' },
  { text: 'text-primary', bar: 'bg-primary', wash: 'from-primary/12' },
  { text: 'text-[#1F6F8B]', bar: 'bg-[#1F6F8B]', wash: 'from-[#1F6F8B]/12' },
  { text: 'text-[#9A4A1E]', bar: 'bg-[#9A4A1E]', wash: 'from-[#9A4A1E]/12' },
] as const;

function ColorHeading({ children, index }: { children: string; index: number }) {
  const tone = HEADING_TONES[index % HEADING_TONES.length];
  return (
    <h2
      className={`relative pl-4 pr-2 py-1.5 -ml-1 rounded-r-lg bg-gradient-to-r ${tone.wash} to-transparent text-xl sm:text-2xl font-heading font-bold ${tone.text} mb-4 leading-snug`}
    >
      <span className={`absolute left-0 top-1 bottom-1 w-1 rounded-full ${tone.bar}`} aria-hidden />
      {children}
    </h2>
  );
}

/** **vurgu** → altı çizili, renkli vurgu. */
function RichText({ text }: { text: string }) {
  const parts = String(text || '').split(/(\*\*[^*]+?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\*\*([^*]+)\*\*$/);
        if (m) {
          return (
            <u
              key={i}
              className="decoration-accent decoration-2 underline-offset-[5px] text-charcoal font-semibold not-italic"
            >
              {m[1]}
            </u>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
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
  const plan = buildVisualPlan(article);
  const calcLinks = hesaplamaToolsForBilgiSlug(article.slug);
  const conditionAt = new Set(plan.conditions.map((c) => c.sectionIndex));
  const measureAfter = (article.sections || []).findIndex((s) =>
    /hesap|ücret|tavan|oran|yüzde/i.test(s.heading)
  );

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

      <RehberHero article={article} clocks={plan.clocks} />

      <aside className="mb-10 rounded-2xl border border-accent/25 bg-gradient-to-b from-accent/[0.08] to-white px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-[11px] font-mono tracking-[0.16em] uppercase text-accent font-bold m-0 mb-2">
          Kısa cevap
        </p>
        <p className="text-[16px] sm:text-[17px] text-charcoal/85 leading-relaxed m-0">
          <RichText text={view.answer} />
        </p>
      </aside>

      {plan.clocks.length > 0 ? <RehberClocks clocks={plan.clocks} /> : null}
      {plan.fork ? <RehberFork fork={plan.fork} /> : null}
      {plan.trap ? <RehberTrap text={plan.trap} /> : article.keyInsight ? (
        <p className="mb-10 rounded-xl border-l-4 border-accent bg-accent/[0.06] px-4 py-3 text-[15px] text-charcoal/85 leading-relaxed">
          <RichText text={article.keyInsight} />
        </p>
      ) : null}

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

      <RehberProcess steps={view.steps} />
      <RehberDossier documents={view.documents} />

      {view.sections.map((sec, si) => (
        <section key={sec.heading} className="mb-10">
          <ColorHeading index={si + 2}>{sec.heading}</ColorHeading>
          {sec.paragraphs.map((p) => (
            <p
              key={p.slice(0, 48)}
              className="text-charcoal/75 leading-[1.75] mb-3.5 text-[15px] sm:text-[16px]"
            >
              <RichText text={p} />
            </p>
          ))}
          {conditionAt.has(si)
            ? plan.conditions
              .filter((c) => c.sectionIndex === si)
              .map((c) => (
                <RehberConditions key={c.heading} heading={c.heading} items={c.items} nested />
              ))
            : sec.bullets && sec.bullets.length > 0 ? (
              <ul className="mt-2 space-y-2 list-none m-0 p-0">
                {sec.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex gap-3 text-charcoal/75 text-[15px] leading-relaxed rounded-xl bg-white border border-charcoal/[0.06] px-3 py-2.5"
                  >
                    <span className="text-accent font-bold shrink-0" aria-hidden>
                      ·
                    </span>
                    <span>
                      <RichText text={b} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          {plan.measures.length > 0 &&
            (si === measureAfter || (measureAfter < 0 && si === 1)) ? (
            <RehberMeasures measures={plan.measures} />
          ) : null}
        </section>
      ))}

      {plan.table ? <RehberLedger table={plan.table} /> : null}
      {plan.aftermath ? <RehberAftermath aftermath={plan.aftermath} /> : null}

      {view.showChecklist && (
        <section className="mb-12">
          <ColorHeading index={7}>Kontrol listesi</ColorHeading>
          <ul className="flex flex-col gap-2 m-0 p-0 list-none">
            {view.checklist.map((item, i) => (
              <li
                key={item}
                className="flex gap-3 items-start rounded-xl border border-charcoal/[0.08] bg-white px-3.5 py-3 text-[15px] text-charcoal/75 leading-relaxed"
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
          <ColorHeading index={8}>Sık sorulan sorular</ColorHeading>
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
                  <RichText text={f.a} />
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {calcLinks.length > 0 && (
        <section className="mb-10 rounded-2xl border border-primary/15 bg-primary/[0.04] p-5">
          <ColorHeading index={9}>Hesaplamak isterseniz</ColorHeading>
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
          <ColorHeading index={10}>İlgili mevzuat</ColorHeading>
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
          <ColorHeading index={11}>Bunlar da işinize yarar</ColorHeading>
          <ul className="flex flex-col gap-2 m-0 p-0 list-none">
            {related.slice(0, 5).map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/bilgi/${r.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-charcoal/[0.08] bg-white px-3 py-2.5 text-sm text-charcoal font-semibold hover:border-accent/40 hover:text-accent transition-colors"
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
