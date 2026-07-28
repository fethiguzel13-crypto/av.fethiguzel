import Link from 'next/link';
import type { VatandasArticle } from '@/lib/vatandas-rehberi';

const SITE = 'https://www.avfethiguzel.com';

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
          { '@type': 'ListItem', position: 2, name: 'Vatandaş Bilgi Rehberi', item: `${SITE}/bilgi` },
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

      <p className="text-accent font-mono text-[10px] tracking-[0.2em] uppercase mb-3">
        Vatandaş bilgilendirme · {article.category}
      </p>
      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-5 leading-tight">
        {article.h1}
      </h1>
      <p className="text-charcoal/65 text-base sm:text-lg leading-relaxed mb-8">{article.lead}</p>

      <p className="text-[12px] text-charcoal/45 mb-10 border-l-2 border-accent/40 pl-3">
        Bu metin genel bilgilendirme amaçlıdır; somut olayda avukata danışılmalıdır. Sonuç vaadi
        içermez. Güncelleme: {article.updated}.
      </p>

      {article.steps && article.steps.length > 0 && (
        <section className="mb-10 rounded-2xl bg-white/70 border border-charcoal/8 p-5 sm:p-6">
          <h2 className="text-lg font-heading font-bold text-charcoal mb-4">Adım adım özet</h2>
          <ol className="list-decimal pl-5 space-y-2 text-charcoal/70 text-sm sm:text-base leading-relaxed">
            {article.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
      )}

      {article.sections.map((sec) => (
        <section key={sec.heading} className="mb-9">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-3">{sec.heading}</h2>
          {sec.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="text-charcoal/70 leading-relaxed mb-3 text-[15px] sm:text-base">
              {p}
            </p>
          ))}
          {sec.bullets && sec.bullets.length > 0 && (
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal/70 text-sm sm:text-base mt-2">
              {sec.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {article.faq.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold text-charcoal mb-4">Sık sorulan sorular</h2>
          <div className="space-y-4">
            {article.faq.map((f) => (
              <div key={f.q} className="rounded-xl border border-charcoal/8 bg-white/60 p-4 sm:p-5">
                <h3 className="font-semibold text-charcoal mb-2 text-[15px]">{f.q}</h3>
                <p className="text-charcoal/65 text-sm sm:text-[15px] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-lg font-heading font-bold text-charcoal mb-3">İlgili mevzuat ve araçlar</h2>
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
          <h2 className="text-lg font-heading font-bold text-charcoal mb-3">İlgili rehberler</h2>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/bilgi/${r.slug}`}
                  className="text-accent font-semibold hover:underline text-sm sm:text-base"
                >
                  {r.h1} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

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
