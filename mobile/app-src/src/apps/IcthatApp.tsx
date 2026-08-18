import React, { useEffect, useMemo, useState } from 'react';
import { gunzipSync, strFromU8 } from 'fflate';
import {
  Search,
  RefreshCw,
  ExternalLink,
  Bell,
  BellOff,
  ChevronRight,
  Star,
  Share2,
} from 'lucide-react';

import { useRoute, navigate, match } from '../lib/router';
import { usePersisted, KEYS } from '../lib/storage';
import { share, openExternal, openOnSite } from '../lib/external';
import { tapFeedback } from '../lib/haptics';
import { ensureNotificationPermission, scheduleDailyBrief, cancelDailyBrief } from '../lib/notify';
import MorePage from '../shell/MorePage';
import SettingsPage from '../shell/SettingsPage';
import EmptyState from '../shell/EmptyState';

/**
 * İçtihat Günü — günlük karar özeti + 3.800 kararlık arşiv.
 *
 * Uygulama ağ beklemeden dolu açılır: son özet ve arşiv indeksi uygulamayla
 * birlikte gelir (scripts/build-icthat-data.mjs). Açılışta canlı veri çekilir
 * ve tohumun üzerine yazılır; ağ yoksa en son indirilen özet gösterilir.
 *
 * Bildirimler cihazda üretilir — sunucuya cihaz kimliği gitmez.
 */

const DAILY_URL = 'https://www.avfethiguzel.com/data/daily.json';
const CACHE_KEY = 'galaxy:icthat-cache';

type DailyItem = {
  id: string;
  source: string;
  sourceLabel: string;
  icon?: string;
  title?: string;
  kunye?: string;
  caseName?: string;
  daire?: string;
  konu: string;
  publicSummary: string;
  date: string;
  url: string;
};

type Daily = {
  generatedAt: string;
  dateLabel: string;
  items: Record<string, DailyItem[]>;
  highlights: DailyItem[];
  stats: { totalItems: number; perSource: Record<string, number> };
};

type ArchiveRow = {
  /** id */ i: string;
  /** künye */ k: string;
  /** alan */ a: string;
  /** tarih */ t: string;
  /** daire */ d: string;
  /** anahtar kelimeler */ w: string[];
  /** slug */ s: string;
};

const SOURCE_ORDER = ['yargitay', 'aym', 'hudoc', 'resmigazete', 'mevzuat'] as const;
const SOURCE_LABEL: Record<string, string> = {
  yargitay: 'Yargıtay',
  aym: 'Anayasa Mahkemesi',
  hudoc: 'AİHM',
  resmigazete: 'Resmî Gazete',
  mevzuat: 'Mevzuat değişikliği',
};

export default function IcthatApp() {
  const route = useRoute();

  const kararMatch = match('/karar/:id', route.path);
  if (kararMatch) return <ArchiveDetail id={kararMatch.id} />;

  if (route.path === '/arsiv') return <ArchivePage />;
  if (route.path === '/takip') return <FollowPage />;
  if (route.path === '/diger') return <MorePage />;
  if (route.path === '/ayarlar') return <SettingsPage />;

  return <TodayPage />;
}

// ─── Günlük veri ─────────────────────────────────────────────────────────────

function useDaily() {
  const [daily, setDaily] = useState<Daily | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [fresh, setFresh] = useState(false);

  // 1) Önbellek → 2) gömülü tohum → 3) ağ
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw && alive) setDaily(JSON.parse(raw) as Daily);
      } catch {
        /* bozuk önbellek */
      }

      if (!localStorage.getItem(CACHE_KEY)) {
        try {
          const res = await fetch('./icthat/seed.json');
          if (res.ok && alive) setDaily((await res.json()) as Daily);
        } catch {
          /* tohum yoksa boş ekran gösterilir */
        }
      }

      void refresh(alive);
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh(alive = true) {
    setRefreshing(true);
    try {
      const res = await fetch(`${DAILY_URL}?t=${Math.floor(Date.now() / 3600000)}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = (await res.json()) as Daily;
        if (alive) {
          setDaily(data);
          setFresh(true);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          } catch {
            /* kota */
          }
        }
      }
    } catch {
      /* çevrimdışı — önbellekteki kalır */
    } finally {
      if (alive) setRefreshing(false);
    }
  }

  return { daily, refreshing, fresh, refresh: () => refresh(true) };
}

// ─── Bugün ───────────────────────────────────────────────────────────────────

function TodayPage() {
  const { daily, refreshing, refresh } = useDaily();
  const [seen, setSeen] = usePersisted<string[]>(KEYS.lastSeenIcthat, []);

  const groups = useMemo(() => {
    if (!daily) return [];
    return SOURCE_ORDER.map((key) => ({
      key,
      label: SOURCE_LABEL[key] ?? key,
      items: daily.items?.[key] ?? [],
    })).filter((g) => g.items.length > 0);
  }, [daily]);

  useEffect(() => {
    if (!daily) return;
    const ids = groups.flatMap((g) => g.items.map((i) => i.id));
    if (ids.length) setSeen(ids.slice(0, 200));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daily]);

  if (!daily) return <ListSkeleton />;

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="page">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h2 className="text-[20px] font-heading font-bold leading-tight">
            {daily.dateLabel || 'Günün kararları'}
          </h2>
          <p className="text-[12px] text-charcoal/50 mt-0.5">
            {total} kayıt · {groups.length} kaynak
          </p>
        </div>
        <button
          type="button"
          aria-label="Yenile"
          onClick={() => {
            void tapFeedback();
            void refresh();
          }}
          className="w-10 h-10 grid place-items-center rounded-full border border-charcoal/[0.12] bg-white tap shrink-0"
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'animate-spin' : ''}
            style={{ color: 'var(--brand)' }}
          />
        </button>
      </div>

      {total === 0 ? (
        <EmptyState
          title="Bugün yeni kayıt yok"
          body="Resmî Gazete ve yüksek mahkeme kaynaklarında bugüne ait yeni bir gelişme bulunmuyor. Arşivde 3.800'den fazla karar sizi bekliyor."
          actionLabel="Arşive git"
          onAction={() => navigate('/arsiv')}
        />
      ) : (
        groups.map((g) => (
          <section key={g.key} className="mb-6">
            <h3 className="text-[12px] font-mono tracking-widest uppercase text-charcoal/40 mb-2.5">
              {g.label} · {g.items.length}
            </h3>
            <ul className="space-y-2">
              {g.items.map((item) => (
                <li key={item.id}>
                  <DailyCard item={item} isNew={!seen.includes(item.id)} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      <p className="mt-6 text-[12px] leading-relaxed text-charcoal/40">
        Özetler bilgilendirme amaçlıdır; bağlayıcı olan karar metninin kendisidir. Kaynak
        bağlantısı için internet gerekir.
      </p>
    </div>
  );
}

function DailyCard({ item, isNew }: { item: DailyItem; isNew: boolean }) {
  const title = item.title || item.caseName || item.kunye || item.konu;
  return (
    <div className="card p-4">
      <div className="flex items-start gap-2 mb-1.5">
        {isNew && (
          <span
            className="text-[12px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
            style={{ background: 'var(--brand)', color: '#fff' }}
          >
            YENİ
          </span>
        )}
        <h4 className="flex-1 text-[14px] font-bold leading-snug">{title}</h4>
      </div>

      {item.kunye && item.kunye !== title && (
        <p className="text-[12px] font-mono text-charcoal/45 mb-1.5">{item.kunye}</p>
      )}

      <p className="text-[13px] text-charcoal/65 leading-relaxed selectable">
        {item.publicSummary || item.konu}
      </p>

      <div className="flex gap-2 mt-3">
        <button
          type="button"
          className="text-[12px] font-bold flex items-center gap-1 tap"
          style={{ color: 'var(--brand)' }}
          onClick={() => void openExternal(item.url)}
        >
          <ExternalLink size={12} /> Kaynak
        </button>
        <button
          type="button"
          className="text-[12px] font-bold flex items-center gap-1 text-charcoal/45 tap"
          onClick={() =>
            void share({ title, text: item.publicSummary || item.konu, url: item.url })
          }
        >
          <Share2 size={12} /> Paylaş
        </button>
      </div>
    </div>
  );
}

// ─── Arşiv ───────────────────────────────────────────────────────────────────

function useArchive() {
  const [rows, setRows] = useState<ArchiveRow[] | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('./icthat/archive.json.gz');
        if (!res.ok) throw new Error(String(res.status));
        const buf = new Uint8Array(await res.arrayBuffer());
        const data = JSON.parse(strFromU8(gunzipSync(buf))) as ArchiveRow[];
        if (alive) setRows(data);
      } catch {
        if (alive) setRows([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return rows;
}

function foldTr(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

function ArchivePage() {
  const rows = useArchive();
  const [q, setQ] = useState('');
  const [alan, setAlan] = useState<string | null>(null);

  const alanlar = useMemo(() => {
    if (!rows) return [];
    const counts = new Map<string, number>();
    for (const r of rows) if (r.a) counts.set(r.a, (counts.get(r.a) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [rows]);

  const results = useMemo(() => {
    if (!rows) return [];
    const nq = foldTr(q.trim());
    const tokens = nq.split(/\s+/).filter(Boolean);
    return rows
      .filter((r) => {
        if (alan && r.a !== alan) return false;
        if (!tokens.length) return true;
        const hay = foldTr([r.k, r.d, r.a, ...(r.w || [])].join(' '));
        return tokens.every((t) => hay.includes(t));
      })
      .slice(0, 200);
  }, [rows, q, alan]);

  if (!rows) return <ListSkeleton />;

  return (
    <div className="page">
      <div className="relative mb-3">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35"
          aria-hidden
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Daire, künye, konu…"
          aria-label="Arşivde ara"
          className="w-full rounded-2xl border border-charcoal/10 bg-white pl-10 pr-4 py-3.5
                     text-[15px] outline-none focus:border-[color:var(--brand)]"
        />
      </div>

      <div className="-mx-4 px-4 mb-4 overflow-x-auto">
        <div className="flex gap-2 w-max pb-1">
          <Chip active={alan === null} onClick={() => setAlan(null)}>
            Tümü ({rows.length})
          </Chip>
          {alanlar.map(([a, n]) => (
            <Chip key={a} active={alan === a} onClick={() => setAlan(alan === a ? null : a)}>
              {a} ({n})
            </Chip>
          ))}
        </div>
      </div>

      <p className="text-[12px] font-mono tracking-widest uppercase text-charcoal/40 mb-2.5">
        {results.length === 200 ? 'ilk 200' : results.length} sonuç
      </p>

      {results.length === 0 ? (
        <EmptyState
          title="Sonuç yok"
          body="Daire adı («2. Hukuk Dairesi»), künye numarası veya konu kelimesi deneyin."
          actionLabel="Filtreleri temizle"
          onAction={() => {
            setQ('');
            setAlan(null);
          }}
        />
      ) : (
        <ul className="space-y-2">
          {results.map((r) => (
            <li key={r.i}>
              <button
                type="button"
                onClick={() => navigate(`/karar/${r.i}`)}
                className="w-full card px-4 py-3.5 flex items-start gap-3 text-left tap"
              >
                <span className="flex-1 min-w-0">
                  <span className="block text-[12px] font-mono tracking-wide uppercase text-charcoal/35">
                    {r.a} · {r.t}
                  </span>
                  <span className="block text-[13px] font-semibold leading-snug mt-0.5">
                    {r.k}
                  </span>
                  {r.w?.length > 0 && (
                    <span className="block text-[12px] text-charcoal/45 mt-1 line-clamp-1">
                      {r.w.join(' · ')}
                    </span>
                  )}
                </span>
                <ChevronRight size={16} className="text-charcoal/25 shrink-0 mt-1" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ArchiveDetail({ id }: { id: string }) {
  const rows = useArchive();
  const [saved, setSaved] = usePersisted<string[]>(KEYS.saved, []);

  if (!rows) return <ListSkeleton />;
  const row = rows.find((r) => r.i === id);

  if (!row) {
    return (
      <EmptyState
        title="Karar bulunamadı"
        body="Bu kayıt arşivden kaldırılmış olabilir."
        actionLabel="Arşive dön"
        onAction={() => navigate('/arsiv', { replace: true })}
      />
    );
  }

  const isSaved = saved.includes(row.i);
  const sitePath = `/yargi-kararlari/${row.s}`;

  return (
    <div className="page selectable">
      <p className="text-[12px] font-mono tracking-widest uppercase text-charcoal/40">
        {row.a} · {row.t}
      </p>
      <h2 className="text-[16px] font-heading font-bold leading-snug mb-1">{row.k}</h2>
      {row.d && <p className="text-[13px] text-charcoal/55 mb-4">{row.d}</p>}

      {row.w?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {row.w.map((w) => (
            <span
              key={w}
              className="pill"
              style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
            >
              {w}
            </span>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-charcoal/10 bg-white/60 p-4 mb-5">
        <p className="text-[13px] text-charcoal/60 leading-relaxed m-0">
          Karar künyesi ve konu etiketleri cihazınızda saklanır. Kararın tam metni site
          üzerinden açılır; bunun için internet gerekir.
        </p>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          type="button"
          aria-pressed={isSaved}
          className="btn-ghost flex-1 !py-2.5 text-[13px]"
          onClick={() => {
            void tapFeedback();
            setSaved((prev) => (isSaved ? prev.filter((s) => s !== row.i) : [row.i, ...prev]));
          }}
        >
          <Star
            size={15}
            fill={isSaved ? 'var(--brand)' : 'none'}
            color={isSaved ? 'var(--brand)' : 'currentColor'}
          />
          {isSaved ? 'Kaydedildi' : 'Kaydet'}
        </button>
        <button
          type="button"
          className="btn-ghost flex-1 !py-2.5 text-[13px]"
          onClick={() =>
            void share({
              title: row.k,
              text: `${row.a} · ${row.t}`,
              url: `https://www.avfethiguzel.com${sitePath}`,
            })
          }
        >
          <Share2 size={15} /> Paylaş
        </button>
      </div>

      <button
        type="button"
        className="btn-brand w-full"
        onClick={() => void openOnSite(sitePath)}
      >
        <ExternalLink size={15} /> Kararın tam metni
      </button>
    </div>
  );
}

// ─── Takip ───────────────────────────────────────────────────────────────────

function FollowPage() {
  const rows = useArchive();
  const [topics, setTopics] = usePersisted<string[]>(KEYS.followTopics, []);
  const [daily, setDaily] = usePersisted<boolean>(KEYS.notifyDaily, false);
  const [denied, setDenied] = useState(false);

  const alanlar = useMemo(() => {
    if (!rows) return [];
    const counts = new Map<string, number>();
    for (const r of rows) if (r.a) counts.set(r.a, (counts.get(r.a) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [rows]);

  return (
    <div className="page">
      <h2 className="text-[20px] font-heading font-bold mb-1">Takip</h2>
      <p className="text-[13px] text-charcoal/55 leading-relaxed mb-5">
        İlgilendiğiniz alanları işaretleyin; günlük özet açıldığında bunlar üste gelir.
        Bildirim cihazınızda üretilir, hiçbir veri sunucuya gönderilmez.
      </p>

      <section className="card p-4 mb-4 flex items-start gap-3">
        <span className="mt-0.5 text-charcoal/40" aria-hidden>
          {daily ? <Bell size={16} /> : <BellOff size={16} />}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-bold mb-0.5">Günlük hatırlatma</h3>
          <p className="text-[12px] text-charcoal/50 leading-relaxed">
            Her sabah 08.30'da o günün özetini hatırlatır.
          </p>
          {denied && (
            <p className="text-[12px] text-red-600 mt-1.5">
              Bildirim izni verilmedi. Cihaz ayarlarından açabilirsiniz.
            </p>
          )}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={daily}
          aria-label="Günlük hatırlatma"
          className="shrink-0 w-12 h-7 rounded-full p-0.5 transition-colors tap"
          style={{ background: daily ? 'var(--brand)' : 'rgba(26,26,26,0.18)' }}
          onClick={async () => {
            if (daily) {
              await cancelDailyBrief();
              setDaily(false);
              return;
            }
            const ok = await ensureNotificationPermission();
            if (!ok) {
              setDenied(true);
              return;
            }
            setDenied(false);
            await scheduleDailyBrief();
            setDaily(true);
          }}
        >
          <span
            className="block w-6 h-6 rounded-full bg-white shadow transition-transform"
            style={{ transform: daily ? 'translateX(20px)' : 'translateX(0)' }}
          />
        </button>
      </section>

      <h3 className="text-[12px] font-mono tracking-widest uppercase text-charcoal/40 mb-2.5">
        İlgi alanları
      </h3>

      {alanlar.length === 0 ? (
        <p className="text-[13px] text-charcoal/45">Arşiv yükleniyor…</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {alanlar.map(([a, n]) => {
            const on = topics.includes(a);
            return (
              <button
                key={a}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  void tapFeedback();
                  setTopics((prev) => (on ? prev.filter((x) => x !== a) : [...prev, a]));
                }}
                className="pill border tap"
                style={
                  on
                    ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' }
                    : {
                        background: '#fff',
                        color: 'rgba(26,26,26,0.6)',
                        borderColor: 'rgba(26,26,26,0.12)',
                      }
                }
              >
                {a} · {n}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Parçacıklar ─────────────────────────────────────────────────────────────

function Chip({
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
      className="pill border tap whitespace-nowrap"
      style={
        active
          ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' }
          : { background: '#fff', color: 'rgba(26,26,26,0.6)', borderColor: 'rgba(26,26,26,0.12)' }
      }
    >
      {children}
    </button>
  );
}

function ListSkeleton() {
  return (
    <div className="page space-y-2" aria-busy="true" aria-label="Yükleniyor">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="skeleton h-24 rounded-2xl" />
      ))}
    </div>
  );
}
