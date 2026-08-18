import React, { useMemo, useState } from 'react';
import { Search, Star, Clock, X, ExternalLink, ChevronRight, Info, type LucideIcon } from 'lucide-react';

import { ARACLAR, HesaplamaToolBody } from '@/components/hesaplama/HesaplamaTools';
import { HESAPLAMA_ARACLAR } from '@/lib/hesaplama-meta';
import { matchHesaplamaTool, normalizeTr } from '@/lib/hesaplama-search';

import { useRoute, navigate, match } from '../lib/router';
import { usePersisted, KEYS } from '../lib/storage';
import { openOnSite, share } from '../lib/external';
import { tapFeedback } from '../lib/haptics';
import MorePage from '../shell/MorePage';
import SettingsPage from '../shell/SettingsPage';
import EmptyState from '../shell/EmptyState';

type ToolRow = { id: string; icon: LucideIcon; baslik: string; tag: string };

const TOOLS: ToolRow[] = ARACLAR.map(({ id, icon, baslik, tag }) => ({ id, icon, baslik, tag }));
const META = new Map(HESAPLAMA_ARACLAR.map((m) => [m.id, m]));
const TAGS = Array.from(new Set(TOOLS.map((t) => t.tag)));

/**
 * Hukuki Hesap — tamamen çevrimdışı çalışan 33 hesaplama aracı.
 *
 * Hesaplama motoru portalın `HesaplamaTools` bileşeninden olduğu gibi
 * alınır; burada yalnız mobil kabuk (liste, arama, favori, geçmiş) yeniden
 * yazılır. Web hub'ının Navbar/Footer ve URL senkronizasyonu mobilde
 * yanlış davranıyordu, o yüzden yeniden kullanılmadı.
 */
export default function HesapApp() {
  const route = useRoute();

  const toolMatch = match('/arac/:id', route.path);
  if (toolMatch) return <ToolPage id={toolMatch.id} />;

  if (route.path === '/favoriler') return <ListPage mode="fav" />;
  if (route.path === '/gecmis') return <ListPage mode="recent" />;
  if (route.path === '/diger') return <MorePage />;
  if (route.path === '/ayarlar') return <SettingsPage />;

  return <HubPage />;
}

// ─── Hub ─────────────────────────────────────────────────────────────────────

function HubPage() {
  const [q, setQ] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [favs] = usePersisted<string[]>(KEYS.favorites, []);
  const [recent] = usePersisted<string[]>(KEYS.recent, []);

  const filtered = useMemo(() => {
    return TOOLS.filter((t) => {
      if (tag && t.tag !== tag) return false;
      const meta = META.get(t.id);
      return matchHesaplamaTool(
        {
          id: t.id,
          baslik: t.baslik,
          tag: t.tag,
          keywords: meta ? [...meta.keywords] : [],
          aciklama: meta?.aciklama,
        },
        q
      );
    });
  }, [q, tag]);

  const grouped = useMemo(() => {
    const map = new Map<string, ToolRow[]>();
    for (const t of filtered) {
      const list = map.get(t.tag) ?? [];
      list.push(t);
      map.set(t.tag, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const favTools = favs.map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean) as ToolRow[];
  const recentTools = recent
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 6) as ToolRow[];

  return (
    <div className="page">
      {/* Arama */}
      <div className="relative mb-3">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35"
          aria-hidden
        />
        <input
          type="search"
          inputMode="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Kıdem, faiz, harç, nafaka…"
          aria-label="Hesaplama aracı ara"
          className="w-full rounded-2xl border border-charcoal/10 bg-white pl-10 pr-10 py-3.5
                     text-[15px] outline-none focus:border-[color:var(--brand)]"
        />
        {q && (
          <button
            type="button"
            aria-label="Aramayı temizle"
            onClick={() => setQ('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center
                       rounded-full text-charcoal/40"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Kategori şeridi */}
      <div className="-mx-4 px-4 mb-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 w-max pb-1">
          <Chip active={tag === null} onClick={() => setTag(null)}>
            Tümü ({TOOLS.length})
          </Chip>
          {TAGS.map((t) => (
            <Chip key={t} active={tag === t} onClick={() => setTag(tag === t ? null : t)}>
              {t}
            </Chip>
          ))}
        </div>
      </div>

      {!q && !tag && favTools.length > 0 && (
        <Section title="Favorileriniz" icon={<Star size={14} />}>
          <div className="grid grid-cols-2 gap-2">
            {favTools.map((t) => (
              <MiniCard key={t.id} tool={t} />
            ))}
          </div>
        </Section>
      )}

      {!q && !tag && recentTools.length > 0 && (
        <Section title="Son kullandıklarınız" icon={<Clock size={14} />}>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
            {recentTools.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => open(t.id)}
                className="shrink-0 card px-3.5 py-2.5 text-left tap"
              >
                <t.icon size={15} className="inline mr-1.5 -mt-0.5 text-accent" aria-hidden />
                <span className="text-[13px] font-semibold">{shortTitle(t.baslik)}</span>
              </button>
            ))}
          </div>
        </Section>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title="Eşleşen araç yok"
          body={`"${q}" için sonuç bulunamadı. Farklı bir terim deneyin — örneğin “kıdem”, “faiz”, “harç”.`}
          actionLabel="Aramayı temizle"
          onAction={() => {
            setQ('');
            setTag(null);
          }}
        />
      ) : (
        grouped.map(([groupTag, tools]) => (
          <Section key={groupTag} title={groupTag}>
            <ul className="space-y-2">
              {tools.map((t) => (
                <li key={t.id}>
                  <ToolRowButton tool={t} />
                </li>
              ))}
            </ul>
          </Section>
        ))
      )}

      <p className="mt-8 text-[12px] leading-relaxed text-charcoal/40">
        Hesaplar bilgilendirme amaçlıdır ve resmî tavsiye yerine geçmez. Tüm hesaplama
        cihazınızda yapılır; girdiğiniz veriler hiçbir sunucuya gönderilmez.
      </p>
    </div>
  );
}

// ─── Tek araç ────────────────────────────────────────────────────────────────

function ToolPage({ id }: { id: string }) {
  const tool = TOOLS.find((t) => t.id === id);
  const meta = META.get(id);
  const [favs, setFavs] = usePersisted<string[]>(KEYS.favorites, []);
  const [, setRecent] = usePersisted<string[]>(KEYS.recent, []);

  React.useEffect(() => {
    if (!tool) return;
    setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 12));
    // yalnız araç değişince
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!tool) {
    return (
      <EmptyState
        title="Araç bulunamadı"
        body="Bu bağlantı eski bir sürüme ait olabilir."
        actionLabel="Araç listesine dön"
        onAction={() => navigate('/', { replace: true })}
      />
    );
  }

  const isFav = favs.includes(id);

  return (
    <div className="page">
      <div className="flex items-start gap-3 mb-1">
        <span
          className="w-11 h-11 rounded-2xl grid place-items-center shrink-0 bg-accent/10 text-accent"
          aria-hidden
        >
          <tool.icon size={22} strokeWidth={2} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-mono tracking-widest uppercase text-charcoal/40">
            {tool.tag}
          </p>
          <h2 className="text-[24px] font-heading font-bold leading-tight">{tool.baslik}</h2>
        </div>
        <button
          type="button"
          aria-label={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          aria-pressed={isFav}
          className="w-10 h-10 grid place-items-center rounded-full tap"
          onClick={() => {
            void tapFeedback();
            setFavs((prev) => (isFav ? prev.filter((x) => x !== id) : [id, ...prev]));
          }}
        >
          <Star
            size={20}
            strokeWidth={2}
            fill={isFav ? 'var(--brand)' : 'none'}
            color={isFav ? 'var(--brand)' : 'rgba(26,26,26,0.35)'}
          />
        </button>
      </div>

      {meta?.aciklama && (
        <p className="text-[14px] text-charcoal/60 leading-relaxed mb-4">{meta.aciklama}</p>
      )}

      <HesaplamaToolBody id={id} title={tool.baslik} />

      {meta?.rehber?.length ? (
        <section className="mt-6">
          <h3 className="flex items-center gap-1.5 text-[13px] font-bold text-charcoal/70 mb-2.5">
            <Info size={14} aria-hidden /> Kısa bilgilendirme
          </h3>
          <ul className="space-y-2.5">
            {meta.rehber.map((p) => (
              <li
                key={p.slice(0, 40)}
                className="text-[13px] text-charcoal/60 leading-relaxed pl-3 border-l-2"
                style={{ borderColor: 'var(--brand-soft)' }}
              >
                {p}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {meta?.mevzuat?.length ? (
        <section className="mt-6">
          <h3 className="text-[13px] font-bold text-charcoal/70 mb-2.5">İlgili mevzuat</h3>
          <ul className="space-y-2">
            {meta.mevzuat.map((m) => (
              <li key={m.href}>
                <button
                  type="button"
                  onClick={() => void openOnSite(m.href)}
                  className="w-full card px-3.5 py-3 flex items-center gap-2 text-left tap"
                >
                  <span className="flex-1 text-[14px] font-semibold">{m.label}</span>
                  <ExternalLink size={14} className="text-charcoal/30" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] text-charcoal/35">
            Mevzuat metinleri sitede açılır; bağlantı için internet gerekir.
          </p>
        </section>
      ) : null}

      {meta?.ilgili?.length ? (
        <section className="mt-6">
          <h3 className="text-[13px] font-bold text-charcoal/70 mb-2.5">İlgili araçlar</h3>
          <div className="grid grid-cols-2 gap-2">
            {meta.ilgili
              .map((rid) => TOOLS.find((t) => t.id === rid))
              .filter(Boolean)
              .map((t) => (
                <MiniCard key={(t as ToolRow).id} tool={t as ToolRow} />
              ))}
          </div>
        </section>
      ) : null}

      <div className="mt-8 flex gap-2">
        <button
          type="button"
          className="btn-ghost flex-1"
          onClick={() =>
            void share({
              title: tool.baslik,
              text: `${tool.baslik} — Hukuki Hesap uygulaması`,
              url: `https://www.avfethiguzel.com/hesaplama/${id}`,
            })
          }
        >
          Paylaş
        </button>
        <button
          type="button"
          className="btn-ghost flex-1"
          onClick={() => void openOnSite(`/hesaplama/${id}`)}
        >
          Sitede aç
        </button>
      </div>
    </div>
  );
}

// ─── Favoriler / geçmiş ──────────────────────────────────────────────────────

function ListPage({ mode }: { mode: 'fav' | 'recent' }) {
  const [favs] = usePersisted<string[]>(KEYS.favorites, []);
  const [recent] = usePersisted<string[]>(KEYS.recent, []);
  const ids = mode === 'fav' ? favs : recent;
  const tools = ids.map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean) as ToolRow[];

  if (tools.length === 0) {
    return (
      <EmptyState
        title={mode === 'fav' ? 'Henüz favori yok' : 'Geçmiş boş'}
        body={
          mode === 'fav'
            ? 'Sık kullandığınız araçların yanındaki yıldıza dokunun; buraya gelsin.'
            : 'Kullandığınız araçlar burada birikir, böylece ikinci kez aramak zorunda kalmazsınız.'
        }
        actionLabel="Araçlara git"
        onAction={() => navigate('/')}
      />
    );
  }

  return (
    <div className="page">
      <h2 className="text-[20px] font-heading font-bold mb-3">
        {mode === 'fav' ? 'Favorileriniz' : 'Son kullandıklarınız'}
      </h2>
      <ul className="space-y-2">
        {tools.map((t) => (
          <li key={t.id}>
            <ToolRowButton tool={t} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Parçacıklar ─────────────────────────────────────────────────────────────

function open(id: string) {
  void tapFeedback();
  navigate(`/arac/${id}`);
}

function shortTitle(t: string): string {
  return t.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+—.*$/, '').trim();
}

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

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <h2 className="flex items-center gap-1.5 text-[12px] font-mono tracking-widest uppercase text-charcoal/40 mb-2.5">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function ToolRowButton({ tool }: { tool: ToolRow }) {
  const meta = META.get(tool.id);
  return (
    <button
      type="button"
      onClick={() => open(tool.id)}
      className="w-full card px-4 py-3.5 flex items-center gap-3 text-left tap"
    >
      <span
        className="w-9 h-9 rounded-xl grid place-items-center shrink-0 bg-accent/10 text-accent"
        aria-hidden
      >
        <tool.icon size={17} strokeWidth={2} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[14px] font-bold leading-snug">{tool.baslik}</span>
        {meta?.aciklama && (
          <span className="block text-[13px] text-charcoal/45 leading-snug mt-0.5 line-clamp-1">
            {meta.aciklama}
          </span>
        )}
      </span>
      <ChevronRight size={16} className="text-charcoal/25 shrink-0" aria-hidden />
    </button>
  );
}

function MiniCard({ tool }: { tool: ToolRow }) {
  return (
    <button
      type="button"
      onClick={() => open(tool.id)}
      className="card p-3 text-left tap flex flex-col gap-1.5 min-h-[76px]"
    >
      <span
        className="w-8 h-8 rounded-lg grid place-items-center bg-accent/10 text-accent"
        aria-hidden
      >
        <tool.icon size={15} strokeWidth={2} />
      </span>
      <span className="text-[13px] font-bold leading-snug">{shortTitle(tool.baslik)}</span>
    </button>
  );
}

export { normalizeTr };
