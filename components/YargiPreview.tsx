'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Landmark } from 'lucide-react';
import { priceLabel } from '@/lib/uyelik/config';

type FeaturedItem = {
  id: string;
  kunye: string;
  daire: string;
  tarih: string;
  tier: string;
  excerpt: string;
};

type FeaturedFile = { items?: FeaturedItem[] };
type StatsFile = { total?: number; byTier?: Record<string, number> };

const TIER: Record<string, string> = {
  yibk: 'İçtihadı Birleştirme',
  hgk: 'Hukuk Genel Kurulu',
  cgk: 'Ceza Genel Kurulu',
};

export default function YargiPreview() {
  const [items, setItems] = useState<FeaturedItem[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch('/data/yargi-featured.json')
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch('/data/yargi-stats.json')
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]).then(([feat, stats]: [FeaturedFile | null, StatsFile | null]) => {
      if (!alive) return;
      if (feat?.items?.length) setItems(feat.items.slice(0, 6));
      if (stats?.total) setTotal(stats.total);
    });
    return () => {
      alive = false;
    };
  }, []);

  const show = items.length
    ? items
    : [
        {
          id: '496939500',
          kunye: 'Yargıtay Büyük Genel Kurulu, E. 2019/2, K. 2019/2, T. 30.01.2019',
          daire: 'Büyük Genel Kurulu',
          tarih: '30.01.2019',
          tier: 'yibk',
          excerpt: 'İçtihadı birleştirme kararı — Yargıtay Büyük Genel Kurulu.',
        },
      ];

  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6 bg-charcoal text-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight">
              Yargıtay arşivi,{' '}
              <span className="font-drama italic text-accent font-medium">üyelikle.</span>
            </h2>
            <p className="mt-4 text-cream/65 text-sm sm:text-base leading-relaxed">
              İçtihadı birleştirme, Hukuk Genel Kurulu, Ceza Genel Kurulu ve daire
              kararları. Aylık {priceLabel()}. Kararlar sitede okunur; dosya indirme yoktur.
            </p>
          </div>
          <Link
            href="/yargi-kararlari"
            className="self-start inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-accent/90 transition-colors"
          >
            {total ? `${total.toLocaleString('tr-TR')} karar · üyelik` : 'Üyelikle aç'}
            <ArrowRight size={15} />
          </Link>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {show.map((it) => (
            <li key={it.id}>
              <Link
                href={`/yargi-kararlari/${it.id}`}
                className="block h-full rounded-2xl border border-cream/10 bg-cream/[0.04] p-5 hover:bg-cream/[0.08] transition-colors"
              >
                <p className="text-[11px] font-mono uppercase tracking-widest text-accent mb-2">
                  {TIER[it.tier] || it.daire} · {it.tarih}
                </p>
                <h3 className="text-sm font-heading font-bold leading-snug">{it.kunye}</h3>
                {it.excerpt ? (
                  <p className="mt-2 text-[13px] text-cream/55 leading-relaxed line-clamp-3">
                    {it.excerpt}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 flex items-center gap-2 text-cream/40 text-[12px]">
          <Landmark size={14} aria-hidden />
          Kaynak: karararama.yargitay.gov.tr · Bilgilendirme amaçlıdır
        </p>
      </div>
    </section>
  );
}
