import Image from 'next/image';
import Link from 'next/link';
import type { BolgeMakale, MakaleFoto, MakaleGrafik } from '@/lib/bolge-makaleler';
import { BookOpen, Clock, MapPin, ArrowRight, Info } from 'lucide-react';
import { SITE_URL, PROFILE } from '@/lib/profile';

function PhotoFigure({ photo, priority = false }: { photo: MakaleFoto; priority?: boolean }) {
  return (
    <figure className="my-8 overflow-hidden rounded-3xl border border-charcoal/10 bg-white shadow-soft">
      <div className="relative aspect-[16/9] w-full bg-charcoal/5">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
          priority={priority}
        />
      </div>
      <figcaption className="px-4 py-3 text-sm text-charcoal/60 leading-relaxed">
        <span className="text-charcoal/80">{photo.caption}</span>
        {photo.credit && (
          <span className="block text-[11px] text-charcoal/40 mt-1">{photo.credit}</span>
        )}
      </figcaption>
    </figure>
  );
}

function GraphicBlock({ g }: { g: MakaleGrafik }) {
  if (g.kind === 'timeline') {
    return (
      <figure className="my-10 rounded-2xl border border-charcoal/8 bg-white p-5 sm:p-7 shadow-soft">
        <figcaption className="text-[11px] font-mono uppercase tracking-widest text-accent mb-5">
          Zaman çizelgesi · {g.title}
        </figcaption>
        <ol className="relative m-0 p-0 list-none space-y-0">
          <span className="absolute left-4 top-2 bottom-2 w-0.5 bg-accent/30" aria-hidden />
          {g.items.map((it, idx) => (
            <li key={idx} className="relative flex gap-4 pb-6 last:pb-0">
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {idx + 1}
              </span>
              <div>
                <p className="text-xs font-mono text-accent mb-0.5">{it.year}</p>
                <p className="text-sm font-semibold text-charcoal m-0">{it.label}</p>
                {it.note && <p className="text-xs text-charcoal/50 mt-1 m-0">{it.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </figure>
    );
  }
  if (g.kind === 'flow') {
    return (
      <figure className="my-10 rounded-2xl border border-charcoal/8 bg-white p-5 sm:p-7 shadow-soft">
        <figcaption className="text-[11px] font-mono uppercase tracking-widest text-accent mb-5">
          Akış · {g.title}
        </figcaption>
        <ol className="flex flex-wrap gap-2 m-0 p-0 list-none">
          {g.steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className="rounded-full bg-charcoal text-cream text-xs font-semibold px-3 py-1.5">
                {i + 1}. {s}
              </span>
              {i < g.steps.length - 1 && <span className="text-charcoal/30">→</span>}
            </li>
          ))}
        </ol>
      </figure>
    );
  }
  if (g.kind === 'compare') {
    return (
      <figure className="my-10 overflow-x-auto rounded-2xl border border-charcoal/8 bg-white p-5 sm:p-7 shadow-soft">
        <figcaption className="text-[11px] font-mono uppercase tracking-widest text-accent mb-4">
          Karşılaştırma · {g.title}
        </figcaption>
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr>
              {g.headers.map((h) => (
                <th key={h} className="border-b border-charcoal/10 pb-2 pr-3 font-semibold text-charcoal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {g.rows.map((row, ri) => (
              <tr key={ri} className="border-b border-charcoal/5">
                {row.map((cell, ci) => (
                  <td key={ci} className="py-2.5 pr-3 text-charcoal/65 align-top">
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
  if (g.kind === 'bars') {
    return (
      <figure className="my-10 rounded-2xl border border-charcoal/8 bg-white p-5 sm:p-7 shadow-soft">
        <figcaption className="text-[11px] font-mono uppercase tracking-widest text-accent mb-5">
          {g.title}
        </figcaption>
        <ul className="space-y-3 m-0 p-0 list-none">
          {g.items.map((it) => (
            <li key={it.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-charcoal">{it.label}</span>
                <span className="text-charcoal/45">{it.hint || `${it.value}${g.unit ? ` ${g.unit}` : ''}`}</span>
              </div>
              <div className="h-2 rounded-full bg-charcoal/5 overflow-hidden">
                <div className="h-full rounded-full bg-accent/80" style={{ width: `${Math.min(100, it.value)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </figure>
    );
  }
  // map-hint
  return (
    <figure className="my-10 rounded-2xl border border-charcoal/8 bg-white p-5 sm:p-7 shadow-soft">
      <figcaption className="text-[11px] font-mono uppercase tracking-widest text-accent mb-4">
        Harita notu · {g.title}
      </figcaption>
      <ul className="grid sm:grid-cols-2 gap-3 m-0 p-0 list-none">
        {g.places.map((p) => (
          <li key={p.name} className="rounded-xl bg-charcoal/[0.03] px-3 py-2.5">
            <p className="text-sm font-semibold text-charcoal m-0 flex items-center gap-1.5">
              <MapPin size={14} className="text-accent" />
              {p.name}
            </p>
            <p className="text-xs text-charcoal/55 mt-1 m-0">{p.role}</p>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export default function BolgeMakaleView({
  makale,
  siblings = [],
}: {
  makale: BolgeMakale;
  siblings?: BolgeMakale[];
}) {
  const pageUrl = `${SITE_URL}/bolge-yazi/${makale.slug}`;
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: makale.h1,
    description: makale.description,
    inLanguage: 'tr-TR',
    dateModified: makale.updated,
    image: makale.heroPhoto?.src?.startsWith('http')
      ? makale.heroPhoto.src
      : `${SITE_URL}${makale.heroPhoto?.src || ''}`,
    author: { '@type': 'Person', name: PROFILE.name, url: `${SITE_URL}/avukat-fethi-guzel` },
    publisher: {
      '@type': 'Organization',
      name: 'Av. Fethi Güzel Hukuk Portalı',
      url: SITE_URL,
    },
    mainEntityOfPage: pageUrl,
    about: { '@type': 'Place', name: `${makale.yerlesim}, ${makale.il}` },
  };
  const faqLd =
    makale.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: makale.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null;

  const insertSlots = [0, 2, Math.max(0, makale.sections.length - 2)].filter(
    (n, i, a) => a.indexOf(n) === i && n < makale.sections.length
  );
  const graphicsAfterSection = new Map<number, MakaleGrafik>();
  insertSlots.forEach((slot, i) => {
    if (makale.graphics[i]) graphicsAfterSection.set(slot, makale.graphics[i]);
  });
  const restGraphics = makale.graphics.slice(insertSlots.length);

  // extra photos after section 1 if present
  const gallery = makale.photos || [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}

      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-charcoal/40">
        <Link href="/" className="hover:text-accent">
          Ana sayfa
        </Link>
        <span className="mx-2">/</span>
        <Link href="/bolge-yazi" className="hover:text-accent">
          Bölge yazıları
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal/60">{makale.yerlesim}</span>
      </nav>

      <header className="mb-6">
        <p className="text-accent font-mono text-[10px] tracking-[0.2em] uppercase mb-3">{makale.eyebrow}</p>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal leading-tight mb-4">
          {makale.h1}
        </h1>
        <div className="flex flex-wrap gap-2 text-xs text-charcoal/45 mb-5">
          <span className="inline-flex items-center gap-1 rounded-full bg-charcoal/5 px-3 py-1">
            <MapPin size={12} className="text-accent" />
            {makale.yerlesim}
            {makale.il !== 'Bölgesel' ? ` · ${makale.il}` : ''}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-charcoal/5 px-3 py-1">
            <Clock size={12} />
            ~{makale.okumaDk} dk okuma
          </span>
          <span className="rounded-full bg-charcoal/5 px-3 py-1">Güncelleme: {makale.updated}</span>
          <span className="rounded-full bg-accent/10 text-accent px-3 py-1 font-medium">Deneme · fotoğraflı</span>
        </div>
        <p className="text-charcoal/65 text-base sm:text-lg leading-relaxed">{makale.lead}</p>
      </header>

      {makale.heroPhoto && <PhotoFigure photo={makale.heroPhoto} priority />}

      <div className="mb-8 flex items-start gap-2 rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm text-charcoal/75">
        <Info size={16} className="text-accent shrink-0 mt-0.5" />
        <p>
          <strong className="text-charcoal">Kilit nokta: </strong>
          {makale.keyInsight}
        </p>
      </div>

      <article className="prose-none">
        {makale.sections.map((sec, si) => {
          const g = graphicsAfterSection.get(si);
          return (
            <div key={sec.heading}>
              <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal mb-3">{sec.heading}</h2>
                {sec.paragraphs.map((p, pi) => (
                  <p key={pi} className="text-charcoal/70 text-[15px] sm:text-base leading-[1.75] mb-4">
                    {p}
                  </p>
                ))}
                {sec.bullets && sec.bullets.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {sec.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-sm text-charcoal/65">
                        <span className="text-accent mt-1.5">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {sec.callout && (
                  <div className="mt-5 rounded-xl border-l-4 border-accent bg-charcoal/[0.03] px-4 py-3">
                    <p className="text-xs font-bold text-accent uppercase tracking-wide mb-1">{sec.callout.title}</p>
                    <p className="text-sm text-charcoal/70 leading-relaxed m-0">{sec.callout.body}</p>
                  </div>
                )}
                {sec.photo && <PhotoFigure photo={sec.photo} />}
              </section>
              {si === 0 && gallery[0] && <PhotoFigure photo={gallery[0]} />}
              {g && <GraphicBlock g={g} />}
            </div>
          );
        })}
        {restGraphics.map((g, i) => (
          <GraphicBlock key={`rest-${i}`} g={g} />
        ))}
        {gallery.slice(1).map((ph) => (
          <PhotoFigure key={ph.src + ph.caption} photo={ph} />
        ))}
      </article>

      {makale.faq.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-heading font-bold text-charcoal mb-4">Sık sorulanlar</h2>
          <div className="space-y-3">
            {makale.faq.map((f) => (
              <details key={f.q} className="group bg-white border border-charcoal/6 rounded-xl">
                <summary className="cursor-pointer list-none p-4 font-semibold text-sm text-charcoal flex justify-between gap-3">
                  {f.q}
                  <span className="text-charcoal/30 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-charcoal/60 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-lg font-heading font-bold text-charcoal mb-4">İlgili yazılar ve kaynaklar</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {makale.related.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between gap-3 bg-white border border-charcoal/8 rounded-xl px-4 py-3.5 hover:border-accent/40 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-charcoal">
                <BookOpen size={15} className="text-accent shrink-0" />
                {l.label}
              </span>
              <ArrowRight size={14} className="text-charcoal/30 group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-charcoal/50 uppercase tracking-wider mb-3">
            Aynı yerden diğer denemeler
          </h2>
          <ul className="space-y-2">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link href={`/bolge-yazi/${s.slug}`} className="text-sm text-accent font-semibold hover:underline">
                  {s.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-charcoal/40 leading-relaxed border-t border-charcoal/10 pt-6">
        Yazar: {PROFILE.name}. Mekân ve tarih bağlamlı deneme; reklam veya iş edinme metni değildir. Resmi mevzuat
        ve mahkeme kararı yerine geçmez.
      </p>
    </>
  );
}
