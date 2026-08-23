'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

type Row = {
  i: string;
  k: string;
  a: string;
  t: string;
  d: string;
  w: string[];
  r: string;
  e: string;
  s: string;
  y: string;
  /** Karar metninden çıkarılmış uyuşmazlık konusu başlıkları */
  j?: string[];
};

const TIER_LABEL: Record<string, string> = {
  yibk: 'İçtihadı Birleştirme',
  hgk: 'Hukuk Genel Kurulu',
  cgk: 'Ceza Genel Kurulu',
  hdbk: 'Başkanlar Kurulu',
  borclar: 'Borçlar',
  medeni: 'Medeni',
  is_sgk: 'İş / SGK',
  icra: 'İcra',
  ceza: 'Ceza',
};

const TIER_ORDER = ['yibk', 'hgk', 'cgk', 'hdbk', 'borclar', 'medeni', 'is_sgk', 'icra', 'ceza'];

function foldTr(s: string): string {
  return String(s || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

async function loadIndex(): Promise<Row[]> {
  const res = await fetch('/api/yargi/index', { credentials: 'same-origin' });
  if (res.status === 401) {
    throw new Error('üyelik');
  }
  if (!res.ok) throw new Error(String(res.status));
  const buf = await res.arrayBuffer();
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('gzip');
  }
  const stream = new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip')));
  const data = (await stream.json()) as Row[];
  return Array.isArray(data) ? data : [];
}

export default function YargiArchiveClient() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [tier, setTier] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadIndex()
      .then((data) => {
        if (alive) setRows(data);
      })
      .catch((e) => {
        if (alive) setError(e instanceof Error ? e.message : 'yüklenemedi');
      });
    return () => {
      alive = false;
    };
  }, []);

  const tiers = useMemo(() => {
    if (!rows) return [];
    const counts = new Map<string, number>();
    for (const r of rows) {
      const key = r.r || r.a;
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return TIER_ORDER.filter((t) => counts.has(t)).map((t) => [t, counts.get(t) ?? 0] as const);
  }, [rows]);

  /*
    Liste kaydırdıkça uzar.

    Önceki sürümde 80 sonuçta duruyor ve daha fazlasına ulaşmanın yolu
    yoktu: yirmi beş binden fazla kararlık bir arşive üyelik ödeyen
    kullanıcı seksen karar görüyordu. Bir seferde çizilen satır sayısı
    yine sınırlı kalır, yalnız sınır kullanıcı istedikçe yükselir.
  */
  const [sayfa, setSayfa] = useState(1);
  useEffect(() => {
    setSayfa(1);
  }, [q, tier]);

  const { results, dahaVar } = useMemo(() => {
    if (!rows) return { results: [] as Row[], dahaVar: false };
    const sinir = SAYFA_BOYU * sayfa;
    const tokens = foldTr(q.trim()).split(/\s+/).filter(Boolean);
    const out: Row[] = [];
    let tarandi = 0;
    for (const r of rows) {
      tarandi += 1;
      if (tier && r.r !== tier && r.a !== tier) continue;
      if (tokens.length) {
        // Konu başlıkları da aranır: künyede geçmeyen ama konusu eşleşen
        // kararlar da çıkmalı — arşivi asıl aranabilir kılan alan budur.
        const hay = foldTr([r.k, r.d, r.a, r.e, r.r, ...(r.j || []), ...(r.w || [])].join(' '));
        if (!tokens.every((t) => hay.includes(t))) continue;
      }
      out.push(r);
      if (out.length >= sinir) break;
    }
    return { results: out, dahaVar: out.length >= sinir && tarandi < rows.length };
  }, [rows, q, tier, sayfa]);

  if (error) {
    return (
      <p className="text-charcoal/60 text-sm">
        {error === 'üyelik' ? (
          <>
            Arşiv üyelik gerektirir.{' '}
            <Link href="/uyelik" className="text-accent underline">
              Üyelik
            </Link>
            .
          </>
        ) : (
          <>
            Arşiv indeksi yüklenemedi. Günlük içtihat için{' '}
            <Link href="/icthat" className="text-accent underline">
              /icthat
            </Link>
            .
          </>
        )}
      </p>
    );
  }

  if (!rows) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Yükleniyor">
        <div className="h-12 rounded-2xl bg-charcoal/5 animate-pulse" />
        <div className="h-24 rounded-2xl bg-charcoal/5 animate-pulse" />
        <div className="h-24 rounded-2xl bg-charcoal/5 animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative mb-4">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35"
          aria-hidden
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="HGK · vekâlet · 2026/3267 · Türk Borçlar Kanunu"
          aria-label="Yargıtay arşivinde ara"
          className="w-full rounded-2xl border border-charcoal/10 bg-white pl-10 pr-10 py-3.5 text-sm outline-none focus:border-accent"
        />
        {q && (
          <button
            type="button"
            aria-label="Temizle"
            onClick={() => setQ('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-full text-charcoal/40"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <FilterChip active={tier === null} onClick={() => setTier(null)}>
          Tümü ({rows.length.toLocaleString('tr-TR')})
        </FilterChip>
        {tiers.map(([t, n]) => (
          <FilterChip
            key={t}
            active={tier === t}
            onClick={() => setTier(tier === t ? null : t)}
          >
            {TIER_LABEL[t] || t} ({n.toLocaleString('tr-TR')})
          </FilterChip>
        ))}
      </div>

      {q.trim() || tier ? (
        <p className="text-[12px] text-charcoal/40 mb-3">
          {dahaVar ? `${results.length}+` : results.length} sonuç
        </p>
      ) : null}

      <ul className="space-y-2.5">
        {results.map((r) => (
          <li key={r.i}>
            <Link
              href={`/yargi-kararlari/${r.i}`}
              className="block surface-card-hover p-4 sm:p-5"
            >
              <p className="text-[11px] font-mono uppercase tracking-widest text-accent">
                {TIER_LABEL[r.r] || r.d} · {r.t}
              </p>
              {/*
                Konu önde, künye arkada.

                Satırlar yalnız künye basıyordu: yan yana yirmi tane
                «Yargıtay Ceza Genel Kurulu, E. 2025/585, K. 2026/353»
                hiçbir bilgi taşımayan bir duvar üretiyordu. Konu başlıkları
                karar metinlerinden çıkarıldı; hukukçu künyeye de ihtiyaç
                duyar, ama önce kararın neyle ilgili olduğunu okur.
              */}
              {r.j && r.j.length ? (
                <>
                  <h2 className="mt-1 text-sm sm:text-base font-heading font-bold leading-snug first-letter:uppercase">
                    {r.j[0]}
                  </h2>
                  <p className="mt-1 text-[12px] text-charcoal/45 font-mono truncate">
                    {kunyeKisa(r)}
                  </p>
                </>
              ) : (
                <h2 className="mt-1 text-sm sm:text-base font-heading font-bold leading-snug">
                  {r.k}
                </h2>
              )}
              {r.e ? (
                <p className="mt-2 text-[13px] text-charcoal/55 leading-relaxed line-clamp-2">
                  {r.e}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>

      {dahaVar ? (
        <button
          type="button"
          onClick={() => setSayfa((n) => n + 1)}
          className="mt-4 w-full rounded-full border border-charcoal/12 bg-white px-5 py-3 text-[13px] font-bold text-charcoal transition-colors hover:border-accent hover:text-accent"
        >
          Daha fazla karar göster
        </button>
      ) : null}
    </div>
  );
}

const SAYFA_BOYU = 60;

/**
 * Künyeden, üstteki rozetle çakışan kısmı atar.
 *
 * Ham künye «Yargıtay Ceza Genel Kurulu, E. 2025/585, K. 2026/353,
 * T. 10.06.2026» der; oysa rozet zaten daireyi ve tarihi yazıyor. Aynı bilgi
 * bir satırda üç kez görününce göz asıl ayırt ediciye, esas ve karar
 * numarasına odaklanamaz.
 */
function kunyeKisa(r: Row): string {
  let k = String(r.k || '');
  const daire = TIER_LABEL[r.r] || r.d || '';
  if (daire) {
    const kacis = kacisla(daire);
    k = k.replace(new RegExp(`^\\s*(yargıtay\\s+)?${kacis}\\s*[,·-]?\\s*`, 'i'), '');
  }
  if (r.t) {
    k = k.replace(new RegExp(`\\s*[,·-]?\\s*T\\.?\\s*${kacisla(r.t)}\\s*$`, 'i'), '');
  }
  return k.replace(/^[\s,·-]+|[\s,·-]+$/g, '') || String(r.k || '');
}

/** Düzenli ifade içinde geçecek metni kaçırır. */
function kacisla(x: string): string {
  return x.replace(/[.*+?^${}()|[\]\\]/g, (m) => '\\' + m);
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? 'bg-charcoal text-cream border-charcoal'
          : 'bg-white text-charcoal/65 border-charcoal/10 hover:border-accent hover:text-accent'
      }`}
    >
      {children}
    </button>
  );
}
