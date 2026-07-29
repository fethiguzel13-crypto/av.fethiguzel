import Link from 'next/link';
import type { BolgeMakale, MakaleGrafik } from '@/lib/bolge-makaleler';
import { BookOpen, Clock, MapPin, ArrowRight, Info, Scale } from 'lucide-react';
import { SITE_URL, PROFILE } from '@/lib/profile';

const THEME: Record<
  BolgeMakale['theme'],
  { from: string; to: string; accent: string; label: string }
> = {
  lake: {
    from: '#0c4a6e',
    to: '#0e7490',
    accent: '#22d3ee',
    label: 'Göl / havza',
  },
  mountain: {
    from: '#1c1917',
    to: '#44403c',
    accent: '#fbbf24',
    label: 'Dağ / yayla',
  },
  plain: {
    from: '#14532d',
    to: '#3f6212',
    accent: '#a3e635',
    label: 'Ova / tarım',
  },
  historic: {
    from: '#7c2d12',
    to: '#a16207',
    accent: '#fcd34d',
    label: 'Tarihi doku',
  },
  trade: {
    from: '#1e3a8a',
    to: '#5b21b6',
    accent: '#c4b5fd',
    label: 'Ticaret / ulaşım',
  },
};

function HeroArt({ makale }: { makale: BolgeMakale }) {
  const t = THEME[makale.theme];
  return (
    <figure className="relative mb-10 overflow-hidden rounded-3xl border border-charcoal/10 shadow-soft">
      <svg viewBox="0 0 960 320" className="w-full h-auto block" role="img" aria-label={makale.h1}>
        <defs>
          <linearGradient id={`g-${makale.slug}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={t.from} />
            <stop offset="100%" stopColor={t.to} />
          </linearGradient>
          <pattern id={`dots-${makale.slug}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill={t.accent} opacity="0.25" />
          </pattern>
        </defs>
        <rect width="960" height="320" fill={`url(#g-${makale.slug})`} />
        <rect width="960" height="320" fill={`url(#dots-${makale.slug})`} />
        {/* stilize siluet */}
        {makale.theme === 'lake' && (
          <>
            <ellipse cx="480" cy="250" rx="420" ry="48" fill={t.accent} opacity="0.2" />
            <path d="M0 200 Q 240 140 480 180 T 960 160 L 960 320 L 0 320 Z" fill="#000" opacity="0.15" />
          </>
        )}
        {makale.theme === 'mountain' && (
          <path
            d="M0 320 L0 210 L160 90 L300 200 L420 60 L560 180 L700 40 L860 170 L960 120 L960 320 Z"
            fill="#000"
            opacity="0.22"
          />
        )}
        {makale.theme === 'plain' && (
          <>
            <path d="M0 200 Q 200 170 400 200 T 800 190 T 960 210 L 960 320 L 0 320 Z" fill="#000" opacity="0.18" />
            <circle cx="820" cy="70" r="28" fill={t.accent} opacity="0.35" />
          </>
        )}
        {makale.theme === 'historic' && (
          <>
            <rect x="120" y="120" width="40" height="120" fill="#000" opacity="0.2" />
            <rect x="180" y="90" width="50" height="150" fill="#000" opacity="0.25" />
            <rect x="250" y="140" width="35" height="100" fill="#000" opacity="0.2" />
            <path d="M400 220 L520 80 L640 220 Z" fill="#000" opacity="0.2" />
          </>
        )}
        {makale.theme === 'trade' && (
          <>
            <path d="M80 240 L200 240 L220 160 L300 160 L320 240 L900 240" stroke={t.accent} strokeWidth="4" fill="none" opacity="0.5" />
            <rect x="700" y="100" width="90" height="140" rx="6" fill="#000" opacity="0.2" />
            <rect x="600" y="140" width="70" height="100" rx="6" fill="#000" opacity="0.18" />
          </>
        )}
        <text x="48" y="64" fill="#fff" fontSize="14" fontFamily="ui-monospace, monospace" opacity="0.85" letterSpacing="3">
          {t.label.toUpperCase()} · HUKUKİ BİLGİLENDİRME
        </text>
        <text x="48" y="120" fill="#fff" fontSize="32" fontFamily="Georgia, serif" fontWeight="700">
          {makale.yerlesim}
        </text>
        <text x="48" y="158" fill={t.accent} fontSize="16" fontFamily="system-ui, sans-serif" opacity="0.95">
          {makale.il === 'Bölgesel' ? 'Bölgesel çerçeve' : `${makale.il} · makale`}
        </text>
        <text x="48" y="280" fill="#fff" fontSize="13" fontFamily="system-ui, sans-serif" opacity="0.7">
          Grafik şematiktir · sonuç vaadi içermez · {PROFILE.name}
        </text>
      </svg>
    </figure>
  );
}

function GraphicBlock({ g, i }: { g: MakaleGrafik; i: number }) {
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
              <span className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white text-[10px] font-bold ring-4 ring-cream">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-mono text-accent font-bold">{it.year}</p>
                <p className="text-sm font-bold text-charcoal mt-0.5">{it.label}</p>
                {it.note && <p className="text-xs text-charcoal/50 mt-1">{it.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </figure>
    );
  }

  if (g.kind === 'bars') {
    const max = Math.max(...g.items.map((x) => x.value), 1);
    return (
      <figure className="my-10 rounded-2xl border border-charcoal/8 bg-white p-5 sm:p-7 shadow-soft">
        <figcaption className="text-[11px] font-mono uppercase tracking-widest text-accent mb-5">
          Grafik · {g.title}
        </figcaption>
        <ul className="space-y-3 m-0 p-0 list-none">
          {g.items.map((it) => (
            <li key={it.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-charcoal">{it.label}</span>
                <span className="text-charcoal/45">{it.hint || `${it.value}${g.unit ? ` ${g.unit}` : ''}`}</span>
              </div>
              <div className="h-2.5 rounded-full bg-charcoal/8 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent/70"
                  style={{ width: `${(it.value / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[10px] text-charcoal/40">Şematik yoğunluk; istatistik iddiası değildir.</p>
      </figure>
    );
  }

  if (g.kind === 'flow') {
    return (
      <figure className="my-10 rounded-2xl border border-charcoal/8 bg-white p-5 sm:p-7 shadow-soft overflow-x-auto">
        <figcaption className="text-[11px] font-mono uppercase tracking-widest text-accent mb-5">
          Süreç · {g.title}
        </figcaption>
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {g.steps.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="rounded-xl border border-accent/25 bg-accent/5 px-3 py-2 text-xs sm:text-sm font-semibold text-charcoal max-w-[10rem] text-center">
                <span className="block text-[10px] text-accent font-mono mb-0.5">{idx + 1}</span>
                {s}
              </div>
              {idx < g.steps.length - 1 && (
                <ArrowRight size={14} className="text-charcoal/25 shrink-0 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </figure>
    );
  }

  if (g.kind === 'compare') {
    return (
      <figure className="my-10 rounded-2xl border border-charcoal/8 bg-white p-5 sm:p-7 shadow-soft overflow-x-auto">
        <figcaption className="text-[11px] font-mono uppercase tracking-widest text-accent mb-4">
          Tablo · {g.title}
        </figcaption>
        <table className="w-full text-sm text-left border-collapse min-w-[280px]">
          <thead>
            <tr className="border-b border-charcoal/10">
              {g.headers.map((h) => (
                <th key={h} className="py-2 pr-3 font-bold text-charcoal text-xs uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {g.rows.map((row, ri) => (
              <tr key={ri} className="border-b border-charcoal/5">
                {row.map((cell, ci) => (
                  <td key={ci} className="py-2.5 pr-3 text-charcoal/70">
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

  // map-hint
  return (
    <figure className="my-10 rounded-2xl border border-charcoal/8 bg-white p-5 sm:p-7 shadow-soft">
      <figcaption className="text-[11px] font-mono uppercase tracking-widest text-accent mb-5">
        Harita bağlamı · {g.title}
      </figcaption>
      <div className="grid sm:grid-cols-2 gap-3">
        {g.places.map((p) => (
          <div
            key={p.name}
            className="flex items-start gap-3 rounded-xl border border-charcoal/8 bg-charcoal/[0.02] px-4 py-3"
          >
            <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-charcoal">{p.name}</p>
              <p className="text-xs text-charcoal/50 mt-0.5">{p.role}</p>
            </div>
          </div>
        ))}
      </div>
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
    author: { '@type': 'Person', name: PROFILE.name, url: `${SITE_URL}/avukat-fethi-guzel` },
    publisher: {
      '@type': 'Organization',
      name: 'Av. Fethi Güzel Hukuk Portalı',
      url: SITE_URL,
    },
    mainEntityOfPage: pageUrl,
    about: { '@type': 'Place', name: `${makale.yerlesim}, ${makale.il}` },
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: makale.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  // Bölüm sonlarına grafik ata (saf: gPtr++ render içinde yok)
  const insertSlots = [0, 2, Math.max(0, makale.sections.length - 2)].filter(
    (n, i, a) => a.indexOf(n) === i && n < makale.sections.length
  );
  const graphicsAfterSection = new Map<number, MakaleGrafik>();
  insertSlots.forEach((slot, i) => {
    if (makale.graphics[i]) graphicsAfterSection.set(slot, makale.graphics[i]);
  });
  const restGraphics = makale.graphics.slice(insertSlots.length);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {makale.faq.length > 0 && (
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

      <header className="mb-8">
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
          <span className="rounded-full bg-accent/10 text-accent px-3 py-1 font-medium">Makale · bilgilendirme</span>
        </div>
        <p className="text-charcoal/65 text-base sm:text-lg leading-relaxed">{makale.lead}</p>
      </header>

      <HeroArt makale={makale} />

      <div className="mb-10 flex items-start gap-2 rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm text-charcoal/75">
        <Info size={16} className="text-accent shrink-0 mt-0.5" />
        <p>
          <strong className="text-charcoal">Kilit nokta: </strong>
          {makale.keyInsight}
        </p>
      </div>

      <div className="mb-8 flex items-start gap-2 rounded-2xl border border-charcoal/10 bg-white p-4 text-xs sm:text-sm text-charcoal/55">
        <Scale size={15} className="text-accent shrink-0 mt-0.5" />
        <p>
          Bu metin reklam veya iş edinme yazısı değildir; yerleşim adları hukuki bilgilendirme ve tarihsel/olaysal
          bağlam içindir. Somut dosyada avukata danışılmalıdır. Sonuç vaadi yoktur.
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
                  <p key={pi} className="text-charcoal/65 text-[15px] sm:text-base leading-relaxed mb-3">
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
                    <p className="text-sm text-charcoal/70 leading-relaxed">{sec.callout.body}</p>
                  </div>
                )}
              </section>
              {g && <GraphicBlock g={g} i={si} />}
            </div>
          );
        })}
        {restGraphics.map((g, i) => (
          <GraphicBlock key={`rest-${i}`} g={g} i={i} />
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
        <h2 className="text-lg font-heading font-bold text-charcoal mb-4">İlgili rehberler</h2>
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
            Aynı yerleşimden diğer yazılar
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

      <p className="text-xs text-charcoal/40 leading-relaxed">
        Yazar: {PROFILE.name}. Genel bilgilendirme; resmi mevzuat ve mahkeme kararı yerine geçmez.
      </p>
    </>
  );
}
