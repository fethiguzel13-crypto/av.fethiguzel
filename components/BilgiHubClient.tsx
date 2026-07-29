'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search, X } from 'lucide-react';

export type BilgiCard = {
  slug: string;
  h1: string;
  title: string;
  description: string;
  category: string;
  role?: string;
  keywords?: string[];
};

function norm(s: string) {
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

export default function BilgiHubClient({
  articles,
  categories,
}: {
  articles: BilgiCard[];
  categories: string[];
}) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('all');

  const filtered = useMemo(() => {
    const nq = norm(q.trim());
    return articles.filter((a) => {
      if (cat !== 'all' && a.category !== cat) return false;
      if (!nq) return true;
      const hay = norm(
        `${a.h1} ${a.title} ${a.description} ${a.category} ${(a.keywords || []).join(' ')}`
      );
      return nq.split(/\s+/).every((t) => hay.includes(t));
    });
  }, [articles, q, cat]);

  const pillars = filtered.filter((a) => a.role === 'pillar');
  const rest = filtered.filter((a) => a.role !== 'pillar');

  return (
    <div>
      <div className="sticky top-24 z-20 mb-8 rounded-2xl border border-charcoal/10 bg-cream/95 backdrop-blur-md p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Rehber ara</span>
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Örn. kıdem, nafaka, TBK 13, emlak vergisi…"
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-charcoal/10 bg-white text-sm text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:border-accent"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-charcoal/40 hover:text-charcoal"
                aria-label="Temizle"
              >
                <X size={14} />
              </button>
            )}
          </label>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="sm:w-48 py-2.5 px-3 rounded-xl border border-charcoal/10 bg-white text-sm text-charcoal"
            aria-label="Kategori"
          >
            <option value="all">Tüm kategoriler</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-2 text-[11px] text-charcoal/45">
          {filtered.length} / {articles.length} rehber
          {cat !== 'all' ? ` · ${cat}` : ''}
          {q ? ` · «${q}»` : ''}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCat('all')}
            className={`text-[10px] px-2 py-1 rounded-full border font-semibold ${
              cat === 'all'
                ? 'bg-accent text-white border-accent'
                : 'bg-white border-charcoal/10 text-charcoal/60'
            }`}
          >
            Tümü
          </button>
          {categories.slice(0, 12).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`text-[10px] px-2 py-1 rounded-full border font-semibold ${
                cat === c
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white border-charcoal/10 text-charcoal/60 hover:border-accent/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {pillars.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-heading font-bold text-charcoal mb-3">
            Ana rehberler ({pillars.length})
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {pillars.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/bilgi/${a.slug}`}
                  className="block rounded-xl border border-accent/20 bg-accent/5 hover:bg-accent/10 px-3 py-2 text-sm font-semibold text-charcoal transition-colors"
                >
                  {a.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-lg font-heading font-bold text-charcoal mb-3">
          {q || cat !== 'all' ? `Sonuçlar (${filtered.length})` : `Tüm rehberler (${rest.length})`}
        </h2>
        {filtered.length === 0 ? (
          <p className="text-sm text-charcoal/55 py-8 text-center">
            Eşleşen rehber yok. Farklı bir kelime deneyin veya{' '}
            <button type="button" className="text-accent font-semibold" onClick={() => { setQ(''); setCat('all'); }}>
              filtreyi temizleyin
            </button>
            .
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {(q || cat !== 'all' ? filtered : rest).map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/bilgi/${a.slug}`}
                  className="block h-full rounded-2xl border border-charcoal/8 bg-white/50 hover:bg-white hover:border-accent/30 p-4 transition-colors"
                >
                  <div className="flex gap-2 items-start">
                    <BookOpen className="text-accent shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-charcoal text-sm leading-snug">{a.h1}</h3>
                        {a.role === 'pillar' && (
                          <span className="text-[9px] uppercase tracking-wider font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                            ana
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-charcoal/45 mb-1">{a.category}</p>
                      <p className="text-xs text-charcoal/55 line-clamp-2 leading-relaxed">
                        {a.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
