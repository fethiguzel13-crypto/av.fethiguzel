'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { CATEGORY_BLURB, FEATURED_SLUGS, firstSentence } from '@/lib/vatandas-rehberi/catalog';

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
      const hay = norm(`${a.h1} ${a.title} ${a.description} ${a.category}`);
      return nq.split(/\s+/).every((t) => hay.includes(t));
    });
  }, [articles, q, cat]);

  const featured = useMemo(() => {
    const map = new Map(articles.map((a) => [a.slug, a]));
    return FEATURED_SLUGS.map((s) => map.get(s)).filter(Boolean) as BilgiCard[];
  }, [articles]);

  const searching = Boolean(q.trim()) || cat !== 'all';

  const catCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of articles) m.set(a.category, (m.get(a.category) || 0) + 1);
    return m;
  }, [articles]);

  return (
    <div>
      <div className="sticky top-24 z-20 mb-10 rounded-2xl border border-charcoal/10 bg-cream/95 backdrop-blur-md p-3 sm:p-4 shadow-sm">
        <label className="relative block">
          <span className="sr-only">Rehber ara</span>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ne arıyorsunuz? Kıdem, nafaka, ödeme emri, emlak vergisi…"
            className="w-full pl-9 pr-9 py-3 rounded-xl border border-charcoal/10 bg-white text-sm text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:border-accent"
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
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCat('all')}
            className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold ${
              cat === 'all'
                ? 'bg-accent text-white border-accent'
                : 'bg-white border-charcoal/10 text-charcoal/60'
            }`}
          >
            Tümü
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold ${
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

      {searching ? (
        <section>
          <h2 className="text-lg font-heading font-bold text-charcoal mb-3">
            {filtered.length} rehber
            {cat !== 'all' ? ` · ${cat}` : ''}
            {q ? ` · «${q}»` : ''}
          </h2>
          {filtered.length === 0 ? (
            <p className="text-sm text-charcoal/55 py-8 text-center">
              Eşleşen rehber yok.{' '}
              <button
                type="button"
                className="text-accent font-semibold"
                onClick={() => {
                  setQ('');
                  setCat('all');
                }}
              >
                Aramayı temizleyin
              </button>
              .
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {filtered.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/bilgi/${a.slug}`}
                    className="block h-full rounded-2xl border border-charcoal/[0.08] bg-white hover:border-accent/35 p-4 transition-colors"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-accent font-semibold mb-1">
                      {a.category}
                    </p>
                    <h3 className="font-semibold text-charcoal text-sm leading-snug mb-1">{a.h1}</h3>
                    <p className="text-xs text-charcoal/55 line-clamp-2 leading-relaxed">
                      {firstSentence(a.description)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <>
          <section className="mb-12">
            <h2 className="text-lg font-heading font-bold text-charcoal mb-1">Sık arananlar</h2>
            <p className="text-sm text-charcoal/50 mb-4">Doğrudan işinize yarayan ana rehberler.</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {featured.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/bilgi/${a.slug}`}
                    className="block h-full rounded-2xl border border-accent/15 bg-white hover:border-accent/40 hover:bg-accent/[0.03] p-4 transition-colors"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-accent font-semibold mb-1">
                      {a.category}
                    </p>
                    <h3 className="font-heading font-bold text-charcoal text-[15px] leading-snug mb-1.5">
                      {a.h1}
                    </h3>
                    <p className="text-xs text-charcoal/55 line-clamp-2 leading-relaxed">
                      {firstSentence(a.description)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-heading font-bold text-charcoal mb-1">Konular</h2>
            <p className="text-sm text-charcoal/50 mb-4">
              Bir kategoriye girin; listede yalnız o konunun rehberleri çıkar.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {categories.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => {
                      setCat(c);
                      if (typeof window !== 'undefined') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="w-full text-left rounded-2xl border border-charcoal/[0.08] bg-white hover:border-accent/30 p-4 transition-colors"
                  >
                    <span className="block font-heading font-bold text-charcoal">{c}</span>
                    <span className="block text-xs text-charcoal/55 mt-1">
                      {CATEGORY_BLURB[c] || 'Vatandaş bilgilendirme rehberleri.'}{' '}
                      <span className="text-charcoal/35">{catCounts.get(c) || 0} yazı</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
