import React, { useEffect, useMemo, useState } from 'react';
import { gunzipSync, strFromU8 } from 'fflate';
import { Search, X, Bookmark, ChevronRight, Share2, ExternalLink } from 'lucide-react';

import { useRoute, navigate, match } from '../lib/router';
import { usePersisted, KEYS } from '../lib/storage';
import { share, openOnSite } from '../lib/external';
import { tapFeedback } from '../lib/haptics';
import MorePage from '../shell/MorePage';
import SettingsPage from '../shell/SettingsPage';
import EmptyState from '../shell/EmptyState';

/**
 * Vatandaş Hukuku — denetimden geçmiş rehberler, tamamı cihazda.
 *
 * Uygulama, sitedeki 554 rehberin yalnız 67'sini taşır. Kalanı otomatik
 * kalıptan üretilmiş, "yasal süre vardır" deyip süreyi söylemeyen metinlerdi
 * ve uygulamaya alınmadı (scripts/build-rehber-data.mjs). Yeniden yazılan her
 * rehber denetimden geçer geçmez bir sonraki sürüme kendiliğinden girer.
 */

type Section = { heading: string; paragraphs?: string[]; bullets?: string[] };
type Faq = { q: string; a: string };
type Table = { caption: string; headers: string[]; rows: string[][] };
type Example = { title: string; body: string; takeaway?: string };
type Scenario = { title: string; facts: string; outcome: string };

type Guide = {
  slug: string;
  h1: string;
  category: string;
  lead: string;
  keywords: string[];
  sections: Section[];
  steps: string[];
  faq: Faq[];
  checklist: string[];
  table: Table | null;
  examples: Example[];
  scenarios: Scenario[];
  keyInsight: string;
  links: { label: string; href: string }[];
  related: string[];
  updated: string;
  role: string;
};

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

let cache: Guide[] | null = null;

function useGuides() {
  const [guides, setGuides] = useState<Guide[] | null>(cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) return;
    let alive = true;
    (async () => {
      try {
        const res = await fetch('./rehber/guides.json.gz');
        if (!res.ok) throw new Error(String(res.status));
        const buf = new Uint8Array(await res.arrayBuffer());
        cache = JSON.parse(strFromU8(gunzipSync(buf))) as Guide[];
        if (alive) setGuides(cache);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'yüklenemedi');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { guides, error };
}

export default function RehberApp() {
  const route = useRoute();

  const articleMatch = match('/rehber/:slug', route.path);
  if (articleMatch) return <ArticlePage slug={articleMatch.slug} />;

  const catMatch = match('/kategori/:cat', route.path);
  if (catMatch) return <CategoryPage cat={decodeURIComponent(catMatch.cat)} />;

  if (route.path === '/kategoriler') return <CategoriesPage />;
  if (route.path === '/kaydettiklerim') return <SavedPage />;
  if (route.path === '/diger') return <MorePage />;
  if (route.path === '/ayarlar') return <SettingsPage />;

  return <HomePage />;
}

// ─── Ana sayfa ───────────────────────────────────────────────────────────────

function HomePage() {
  const { guides, error } = useGuides();
  const [q, setQ] = useState('');

  if (error) {
    return (
      <EmptyState
        title="Rehberler yüklenemedi"
        body={`Uygulama içeriği okunamadı (${error}).`}
        actionLabel="Yeniden dene"
        onAction={() => window.location.reload()}
      />
    );
  }
  if (!guides) return <ListSkeleton />;

  const nq = foldTr(q.trim());
  const tokens = nq.split(/\s+/).filter(Boolean);
  const results = tokens.length
    ? guides.filter((g) => {
        const hay = foldTr([g.h1, g.category, g.lead, ...(g.keywords || [])].join(' '));
        return tokens.every((t) => hay.includes(t));
      })
    : null;

  const cats = countByCategory(guides);

  return (
    <div className="page">
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
          placeholder="Kıdem, boşanma, icra, kira…"
          aria-label="Rehberlerde ara"
          className="w-full rounded-2xl border border-charcoal/10 bg-white pl-10 pr-10 py-3.5
                     text-[15px] outline-none focus:border-[color:var(--brand)]"
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

      {results ? (
        results.length === 0 ? (
          <EmptyState
            title="Sonuç yok"
            body={`"${q}" için rehber bulunamadı. Rehber arşivi yeniden yazılıyor; her sürümde yeni konular ekleniyor.`}
            actionLabel="Aramayı temizle"
            onAction={() => setQ('')}
          />
        ) : (
          <>
            <p className="text-[12px] font-mono tracking-widest uppercase text-charcoal/40 mb-2.5">
              {results.length} sonuç
            </p>
            <ul className="space-y-2">
              {results.map((g) => (
                <li key={g.slug}>
                  <GuideRow g={g} />
                </li>
              ))}
            </ul>
          </>
        )
      ) : (
        <>
          <section className="mb-6">
            <h2 className="text-[12px] font-mono tracking-widest uppercase text-charcoal/40 mb-2.5">
              Konu başlıkları
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {cats.slice(0, 8).map(([name, n]) => (
                <CategoryCard key={name} name={name} count={n} />
              ))}
            </div>
            {cats.length > 8 && (
              <button
                type="button"
                className="btn-ghost w-full mt-2.5"
                onClick={() => navigate('/kategoriler')}
              >
                Tüm konular ({cats.length})
              </button>
            )}
          </section>

          <section className="mb-6">
            <h2 className="text-[12px] font-mono tracking-widest uppercase text-charcoal/40 mb-2.5">
              Tüm rehberler ({guides.length})
            </h2>
            <ul className="space-y-2">
              {guides.map((g) => (
                <li key={g.slug}>
                  <GuideRow g={g} />
                </li>
              ))}
            </ul>
          </section>

          <p className="text-[12px] leading-relaxed text-charcoal/40">
            Rehberler cihazınıza kurulur; okumak için internet gerekmez. Arşiv yeniden
            yazılıyor — her güncellemede yeni konular ekleniyor. Bilgilendirme amaçlıdır.
          </p>
        </>
      )}
    </div>
  );
}

// ─── Kategoriler ─────────────────────────────────────────────────────────────

function CategoriesPage() {
  const { guides } = useGuides();
  if (!guides) return <ListSkeleton />;
  const cats = countByCategory(guides);

  return (
    <div className="page">
      <h2 className="text-[20px] font-heading font-bold mb-3">Konu başlıkları</h2>
      <div className="grid grid-cols-2 gap-2">
        {cats.map(([name, n]) => (
          <CategoryCard key={name} name={name} count={n} />
        ))}
      </div>
    </div>
  );
}

function CategoryPage({ cat }: { cat: string }) {
  const { guides } = useGuides();
  if (!guides) return <ListSkeleton />;
  const rows = guides.filter((g) => g.category === cat);

  if (rows.length === 0) {
    return (
      <EmptyState
        title="Konu bulunamadı"
        body="Bu başlıkta yayında rehber yok."
        actionLabel="Konulara dön"
        onAction={() => navigate('/kategoriler', { replace: true })}
      />
    );
  }

  return (
    <div className="page">
      <h2 className="text-[20px] font-heading font-bold">{cat}</h2>
      <p className="text-[13px] text-charcoal/50 mb-3">{rows.length} rehber</p>
      <ul className="space-y-2">
        {rows.map((g) => (
          <li key={g.slug}>
            <GuideRow g={g} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Makale ──────────────────────────────────────────────────────────────────

function ArticlePage({ slug }: { slug: string }) {
  const { guides } = useGuides();
  const [saved, setSaved] = usePersisted<string[]>(KEYS.saved, []);

  if (!guides) return <ListSkeleton />;
  const g = guides.find((x) => x.slug === slug);

  if (!g) {
    return (
      <EmptyState
        title="Rehber bulunamadı"
        body="Bu rehber yeniden yazılmak üzere yayından kaldırılmış olabilir."
        actionLabel="Rehberlere dön"
        onAction={() => navigate('/', { replace: true })}
      />
    );
  }

  const isSaved = saved.includes(slug);
  const related = g.related
    .map((s) => guides.find((x) => x.slug === s))
    .filter(Boolean) as Guide[];

  return (
    <div className="page selectable">
      <p className="text-[12px] font-mono tracking-widest uppercase text-charcoal/40">
        {g.category}
      </p>
      <h2 className="text-[24px] font-heading font-bold leading-tight mb-3">{g.h1}</h2>

      <div className="flex gap-2 mb-5">
        <button
          type="button"
          aria-pressed={isSaved}
          className="btn-ghost flex-1 !py-2.5 text-[14px]"
          onClick={() => {
            void tapFeedback();
            setSaved((prev) => (isSaved ? prev.filter((s) => s !== slug) : [slug, ...prev]));
          }}
        >
          <Bookmark
            size={15}
            fill={isSaved ? 'var(--brand)' : 'none'}
            color={isSaved ? 'var(--brand)' : 'currentColor'}
          />
          {isSaved ? 'Kaydedildi' : 'Kaydet'}
        </button>
        <button
          type="button"
          className="btn-ghost flex-1 !py-2.5 text-[14px]"
          onClick={() =>
            void share({
              title: g.h1,
              text: firstSentence(g.lead),
              url: `https://www.avfethiguzel.com/bilgi/${slug}`,
            })
          }
        >
          <Share2 size={15} /> Paylaş
        </button>
      </div>

      {/* Kısa cevap */}
      <aside
        className="rounded-2xl p-4 mb-6 border"
        style={{ background: 'var(--brand-soft)', borderColor: 'var(--brand-soft)' }}
      >
        <p
          className="text-[12px] tracking-[0.16em] uppercase font-bold mb-1.5"
          style={{ color: 'var(--brand)' }}
        >
          Kısa cevap
        </p>
        <p className="text-[15px] leading-relaxed text-charcoal/85 m-0">{g.lead}</p>
      </aside>

      {g.keyInsight && (
        <p className="text-[14px] font-semibold leading-relaxed mb-6 pl-3 border-l-2"
           style={{ borderColor: 'var(--brand)' }}>
          {g.keyInsight}
        </p>
      )}

      {/* Adımlar */}
      {g.steps.length > 0 && (
        <section className="mb-7">
          <h3 className="text-[15px] font-heading font-bold mb-3">Ne yapmalısınız?</h3>
          <ol className="space-y-2 list-none p-0 m-0">
            {g.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="shrink-0 w-7 h-7 rounded-full grid place-items-center text-[13px] font-bold text-white"
                  style={{ background: 'var(--brand)' }}
                >
                  {i + 1}
                </span>
                <p className="flex-1 text-[14px] leading-relaxed text-charcoal/75 m-0 pt-0.5">
                  {s}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Bölümler */}
      {g.sections.map((sec) => (
        <section key={sec.heading} className="mb-7">
          <h3 className="text-[15px] font-heading font-bold mb-2.5">{sec.heading}</h3>
          {(sec.paragraphs ?? []).map((p) => (
            <p key={p.slice(0, 40)} className="text-[14px] leading-relaxed text-charcoal/75 mb-2.5">
              {p}
            </p>
          ))}
          {(sec.bullets ?? []).length > 0 && (
            <ul className="space-y-1.5 list-none p-0 m-0 mt-2">
              {(sec.bullets ?? []).map((b) => (
                <li key={b} className="flex gap-2 text-[14px] leading-relaxed text-charcoal/70">
                  <span style={{ color: 'var(--brand)' }} aria-hidden>
                    ·
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* Tablo */}
      {g.table && (
        <section className="mb-7">
          <h3 className="text-[15px] font-heading font-bold mb-2.5">{g.table.caption}</h3>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[18rem] text-left border-collapse text-[13px]">
              <thead>
                <tr style={{ background: 'var(--brand)' }} className="text-white">
                  {g.table.headers.map((h) => (
                    <th key={h} className="px-3 py-2.5 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {g.table.rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 ? 'bg-cream/70' : 'bg-white'}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-3 py-2.5 border-t border-charcoal/[0.06] leading-snug ${ci === 0 ? 'font-medium' : 'text-charcoal/70'}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Kontrol listesi */}
      {g.checklist.length > 0 && (
        <section className="mb-7">
          <h3 className="text-[15px] font-heading font-bold mb-2.5">Kontrol listesi</h3>
          <ul className="space-y-2 list-none p-0 m-0">
            {g.checklist.map((item, i) => (
              <li key={item} className="card px-3.5 py-3 flex gap-3 text-[14px] leading-relaxed">
                <span
                  className="shrink-0 w-6 h-6 rounded-md grid place-items-center text-[12px] font-bold"
                  style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
                >
                  {i + 1}
                </span>
                <span className="text-charcoal/75">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* SSS */}
      {g.faq.length > 0 && (
        <section className="mb-7">
          <h3 className="text-[15px] font-heading font-bold mb-3">Sık sorulan sorular</h3>
          <div className="space-y-2">
            {g.faq.map((f) => (
              <details key={f.q} className="card overflow-hidden">
                <summary className="cursor-pointer list-none p-3.5 text-[14px] font-semibold flex gap-2 [&::-webkit-details-marker]:hidden">
                  <span className="flex-1">{f.q}</span>
                  <span className="text-charcoal/25 text-lg leading-none">+</span>
                </summary>
                <p className="px-3.5 pb-3.5 -mt-1 text-[14px] leading-relaxed text-charcoal/70 m-0">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* İlgili mevzuat */}
      {g.links.length > 0 && (
        <section className="mb-7">
          <h3 className="text-[15px] font-heading font-bold mb-2.5">İlgili mevzuat</h3>
          <ul className="space-y-2 list-none p-0 m-0">
            {g.links.map((l) => (
              <li key={l.href}>
                <button
                  type="button"
                  onClick={() => void openOnSite(l.href)}
                  className="w-full card px-3.5 py-3 flex items-center gap-2 text-left tap"
                >
                  <span className="flex-1 text-[14px] font-semibold">{l.label}</span>
                  <ExternalLink size={14} className="text-charcoal/30" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mb-7">
          <h3 className="text-[15px] font-heading font-bold mb-2.5">Bunlar da işinize yarar</h3>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <GuideRow g={r} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-[12px] leading-relaxed text-charcoal/40 border-t border-charcoal/10 pt-4">
        Genel bilgilendirme. Somut dosyada süre ve merci değişebilir; güncel metin ve
        gerektiğinde avukat esastır.{g.updated ? ` Güncelleme: ${g.updated}` : ''}
      </p>
    </div>
  );
}

// ─── Kaydedilenler ───────────────────────────────────────────────────────────

function SavedPage() {
  const { guides } = useGuides();
  const [saved] = usePersisted<string[]>(KEYS.saved, []);

  if (!guides) return <ListSkeleton />;
  const rows = saved.map((s) => guides.find((g) => g.slug === s)).filter(Boolean) as Guide[];

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark size={20} />}
        title="Henüz kayıt yok"
        body="Bir rehberi açıp «Kaydet» dediğinizde burada birikir."
        actionLabel="Rehberlere git"
        onAction={() => navigate('/')}
      />
    );
  }

  return (
    <div className="page">
      <h2 className="text-[20px] font-heading font-bold mb-3">Kaydettikleriniz</h2>
      <ul className="space-y-2">
        {rows.map((g) => (
          <li key={g.slug}>
            <GuideRow g={g} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Parçacıklar ─────────────────────────────────────────────────────────────

function countByCategory(guides: Guide[]): [string, number][] {
  const m = new Map<string, number>();
  for (const g of guides) m.set(g.category, (m.get(g.category) ?? 0) + 1);
  return Array.from(m.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'tr'));
}

function firstSentence(text: string): string {
  const c = String(text || '').replace(/\s+/g, ' ').trim();
  const part = c.split(/(?<=[.!?])\s+/)[0] || c;
  return part.length > 180 ? `${part.slice(0, 177)}…` : part;
}

function GuideRow({ g }: { g: Guide }) {
  return (
    <button
      type="button"
      onClick={() => {
        void tapFeedback();
        navigate(`/rehber/${g.slug}`);
      }}
      className="w-full card px-4 py-3.5 flex items-start gap-3 text-left tap"
    >
      <span className="flex-1 min-w-0">
        <span className="block text-[12px] font-mono tracking-widest uppercase text-charcoal/35">
          {g.category}
        </span>
        <span className="block text-[15px] font-bold leading-snug mt-0.5">{g.h1}</span>
        <span className="block text-[13px] text-charcoal/45 leading-snug mt-1 line-clamp-2">
          {firstSentence(g.lead)}
        </span>
      </span>
      <ChevronRight size={16} className="text-charcoal/25 shrink-0 mt-1" aria-hidden />
    </button>
  );
}

function CategoryCard({ name, count }: { name: string; count: number }) {
  return (
    <button
      type="button"
      onClick={() => {
        void tapFeedback();
        navigate(`/kategori/${encodeURIComponent(name)}`);
      }}
      className="card p-3.5 text-left tap min-h-[70px] flex flex-col"
    >
      <span className="text-[14px] font-bold leading-snug flex-1">{name}</span>
      <span className="text-[12px] font-mono mt-1.5" style={{ color: 'var(--brand)' }}>
        {count} rehber
      </span>
    </button>
  );
}

function ListSkeleton() {
  return (
    <div className="page space-y-2" aria-busy="true" aria-label="Yükleniyor">
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="skeleton h-20 rounded-2xl" />
      ))}
    </div>
  );
}
