import React, { useEffect, useMemo, useState } from 'react';
import { Search, X, ChevronRight, Star, Share2, ExternalLink, Loader2 } from 'lucide-react';

import { useRoute, navigate, match } from '../lib/router';
import { usePersisted, KEYS } from '../lib/storage';
import { share, openOnSite } from '../lib/external';
import { tapFeedback } from '../lib/haptics';
import {
  loadManifest,
  loadPack,
  searchLoaded,
  parseMaddeQuery,
  loadedPacks,
  foldTr,
  tighten,
  type Manifest,
  type Pack,
  type PackEntry,
  type SearchHit,
} from '../lib/packs';
import MorePage from '../shell/MorePage';
import SettingsPage from '../shell/SettingsPage';
import EmptyState from '../shell/EmptyState';

/**
 * Mevzuat — 46 kanun, 8.087 madde, tamamı çevrimdışı.
 *
 * Ekrandaki her metin uygulamanın içinden gelir. İnternet yalnız "sitede aç"
 * ve paylaşım için gerekir.
 *
 * Şerh yalnız denetimden geçmiş 95 maddede gösterilir. Kalan maddelerde şerh
 * alanı hiç yoktur — kalıptan üretilmiş, maddeyle ilgisiz metinler pakete
 * alınmadı (bkz. scripts/build-app-packs.mjs).
 */

/** İlk açılışta arama için yüklenen çekirdek kanunlar. */
const CORE = ['tmk', 'tbk', 'tck', 'hmk', 'iik', 'is-kanunu', 'cmk', 'ttk'];

export default function PortalApp() {
  const route = useRoute();

  const maddeMatch = match('/mevzuat/:kanun/:madde', route.path);
  if (maddeMatch) return <MaddePage kanunId={maddeMatch.kanun} maddeKey={maddeMatch.madde} />;

  const kanunMatch = match('/mevzuat/:kanun', route.path);
  if (kanunMatch) return <KanunPage kanunId={kanunMatch.kanun} />;

  if (route.path === '/ara') return <SearchPage />;
  if (route.path === '/indirilenler') return <SavedPage />;
  if (route.path === '/diger') return <MorePage />;
  if (route.path === '/ayarlar') return <SettingsPage />;

  return <KanunListPage />;
}

// ─── Manifest kancası ────────────────────────────────────────────────────────

function useManifest() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadManifest()
      .then((m) => alive && setManifest(m))
      .catch((e) => alive && setError(e instanceof Error ? e.message : 'yüklenemedi'));
    return () => {
      alive = false;
    };
  }, []);

  return { manifest, error };
}

function usePack(kanunId: string) {
  const [pack, setPack] = useState<Pack | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setPack(null);
    setError(null);
    loadPack(kanunId)
      .then((p) => alive && setPack(p))
      .catch((e) => alive && setError(e instanceof Error ? e.message : 'yüklenemedi'));
    return () => {
      alive = false;
    };
  }, [kanunId]);

  return { pack, error };
}

// ─── Kanun listesi ───────────────────────────────────────────────────────────

function KanunListPage() {
  const { manifest, error } = useManifest();
  const [q, setQ] = useState('');

  if (error) {
    return (
      <EmptyState
        title="Mevzuat yüklenemedi"
        body={`Uygulama içeriği okunamadı (${error}). Uygulamayı yeniden başlatmak sorunu çözebilir.`}
        actionLabel="Yeniden dene"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (!manifest) return <ListSkeleton />;

  const nq = q.trim().toLocaleLowerCase('tr-TR');
  const packs = nq
    ? manifest.packs.filter(
        (p) =>
          p.name.toLocaleLowerCase('tr-TR').includes(nq) ||
          p.id.toLocaleLowerCase('tr-TR').includes(nq)
      )
    : manifest.packs;

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
          placeholder="Kanun ara — TMK, borçlar, icra…"
          aria-label="Kanun ara"
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

      <button
        type="button"
        onClick={() => navigate('/ara')}
        className="w-full card px-4 py-3.5 flex items-center gap-3 text-left tap mb-5"
      >
        <Search size={17} style={{ color: 'var(--brand)' }} aria-hidden />
        <span className="flex-1">
          <span className="block text-[14px] font-bold">Madde metninde ara</span>
          <span className="block text-[12px] text-charcoal/45 mt-0.5">
            «TBK 13» yazarsanız doğrudan maddeye gider
          </span>
        </span>
        <ChevronRight size={16} className="text-charcoal/25" aria-hidden />
      </button>

      <p className="text-[12px] font-mono tracking-widest uppercase text-charcoal/40 mb-2.5">
        {packs.length} kanun · {manifest.totalArticles.toLocaleString('tr-TR')} madde
      </p>

      <ul className="space-y-2">
        {packs.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => {
                void tapFeedback();
                navigate(`/mevzuat/${p.id}`);
              }}
              className="w-full card px-4 py-3.5 flex items-center gap-3 text-left tap"
            >
              <span
                className="w-10 h-10 rounded-xl grid place-items-center text-[12px] font-bold shrink-0"
                style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
                aria-hidden
              >
                {p.id.slice(0, 4).toUpperCase()}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[14px] font-bold leading-snug">{p.name}</span>
                <span className="block text-[12px] text-charcoal/45 mt-0.5">
                  {p.articles} madde
                  {p.commentaries > 0 ? ` · ${p.commentaries} şerh` : ''}
                </span>
              </span>
              <ChevronRight size={16} className="text-charcoal/25 shrink-0" aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-[12px] leading-relaxed text-charcoal/40">
        Metinler Resmî Gazete'de yayımlanan hâlleriyle uygulamaya gömülüdür; okumak için
        internet gerekmez. Bağlayıcı metin için mevzuat.gov.tr esastır.
      </p>
    </div>
  );
}

// ─── Bir kanunun maddeleri ───────────────────────────────────────────────────

function KanunPage({ kanunId }: { kanunId: string }) {
  const { pack, error } = usePack(kanunId);
  const { manifest } = useManifest();
  const [q, setQ] = useState('');

  const meta = manifest?.packs.find((p) => p.id === kanunId);

  const rows = useMemo(() => {
    if (!pack) return [];
    const all = Object.entries(pack)
      .map(([key, e]) => ({ key, ...e }))
      .sort((a, b) => a.n - b.n);

    const nq = foldTr(q.trim());
    if (!nq) return all;

    // Boşluksuz karşılaştırma, OCR'de bölünmüş başlıkları da yakalar
    const tq = tighten(q);
    const asNum = parseInt(nq.replace(/\D/g, ''), 10);

    return all.filter((r) => {
      if (asNum && r.n === asNum) return true;
      const t = foldTr(r.t);
      return t.includes(nq) || t.replace(/[\s.]+/g, '').includes(tq);
    });
  }, [pack, q]);

  if (error) {
    return (
      <EmptyState
        title="Kanun yüklenemedi"
        body={`${kanunId} paketi okunamadı (${error}).`}
        actionLabel="Kanun listesine dön"
        onAction={() => navigate('/', { replace: true })}
      />
    );
  }

  if (!pack) return <ListSkeleton />;

  return (
    <div className="page">
      <h2 className="text-[20px] font-heading font-bold leading-snug">
        {meta?.name || kanunId.toUpperCase()}
      </h2>
      <p className="text-[12px] text-charcoal/50 mb-3">{Object.keys(pack).length} madde</p>

      <div className="relative mb-4">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35"
          aria-hidden
        />
        <input
          type="search"
          inputMode="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Madde numarası veya başlık"
          aria-label="Madde ara"
          className="w-full rounded-2xl border border-charcoal/10 bg-white pl-10 pr-4 py-3
                     text-[15px] outline-none focus:border-[color:var(--brand)]"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="Eşleşen madde yok"
          body="Madde numarası ya da başlıktan bir kelime deneyin."
          actionLabel="Aramayı temizle"
          onAction={() => setQ('')}
        />
      ) : (
        <ul className="space-y-1.5">
          {rows.map((r) => (
            <li key={r.key}>
              <button
                type="button"
                onClick={() => {
                  void tapFeedback();
                  navigate(`/mevzuat/${kanunId}/${r.key}`);
                }}
                className="w-full card px-4 py-3 flex items-start gap-3 text-left tap"
              >
                <span
                  className="text-[12px] font-mono font-bold shrink-0 mt-0.5 min-w-[2.5rem]"
                  style={{ color: 'var(--brand)' }}
                >
                  m.{r.n}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[14px] font-semibold leading-snug">
                    {stripKanunPrefix(r.t)}
                  </span>
                  <span className="block text-[12px] text-charcoal/45 leading-snug mt-0.5 line-clamp-1">
                    {plain(r.o).slice(0, 90)}
                  </span>
                </span>
                {r.c && (
                  <span
                    className="text-[12px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                    style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
                  >
                    ŞERH
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Madde detayı ────────────────────────────────────────────────────────────

function MaddePage({ kanunId, maddeKey }: { kanunId: string; maddeKey: string }) {
  const { pack, error } = usePack(kanunId);
  const { manifest } = useManifest();
  const [saved, setSaved] = usePersisted<string[]>(KEYS.saved, []);

  const id = `${kanunId}/${maddeKey}`;
  const entry: PackEntry | undefined = pack?.[maddeKey];
  const meta = manifest?.packs.find((p) => p.id === kanunId);

  if (error || (pack && !entry)) {
    return (
      <EmptyState
        title="Madde bulunamadı"
        body="Bu bağlantı eski bir sürüme ait olabilir."
        actionLabel="Kanuna dön"
        onAction={() => navigate(`/mevzuat/${kanunId}`, { replace: true })}
      />
    );
  }

  if (!pack || !entry) return <ListSkeleton />;

  const isSaved = saved.includes(id);
  const code = kanunId.toUpperCase();

  return (
    <div className="page selectable">
      <p className="text-[12px] font-mono tracking-widest uppercase text-charcoal/40">
        {meta?.name || code}
      </p>
      <h2 className="text-[24px] font-heading font-bold leading-tight mb-1">
        {code} m. {entry.n}
      </h2>
      <p className="text-[13px] text-charcoal/55 leading-snug mb-4">
        {stripKanunPrefix(entry.t)}
      </p>

      <div className="flex gap-2 mb-5">
        <button
          type="button"
          aria-pressed={isSaved}
          className="btn-ghost flex-1 !py-2.5 text-[13px]"
          onClick={() => {
            void tapFeedback();
            setSaved((prev) => (isSaved ? prev.filter((s) => s !== id) : [id, ...prev]));
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
              title: `${code} m. ${entry.n}`,
              text: plain(entry.o).slice(0, 200),
              url: `https://www.avfethiguzel.com/mevzuat/${kanunId}/${maddeKey}`,
            })
          }
        >
          <Share2 size={15} /> Paylaş
        </button>
      </div>

      {entry.x === 1 && (
        <section className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 mb-4">
          <p className="text-[12px] tracking-[0.16em] uppercase font-bold text-amber-700 mb-1.5">
            Bu maddenin metni eksik
          </p>
          <p className="text-[13px] leading-relaxed text-charcoal/75 m-0">
            Aşağıdaki metnin bir kısmı, kanun metni yerine onu özetleyen cümleler
            içeriyor. Bu maddeye dayanacaksanız resmî kaynaktan doğrulayın.
          </p>
        </section>
      )}

      <section
        className="rounded-2xl p-4 mb-5 text-white"
        style={{ background: 'var(--brand)' }}
      >
        <p className="text-[12px] tracking-[0.16em] uppercase opacity-80 mb-2">
          {entry.x === 1 ? 'Resmî metin — eksik' : 'Resmî metin'}
        </p>
        <div className="text-[14.5px] leading-relaxed whitespace-pre-wrap">
          {cleanOfficial(entry.o)}
        </div>
      </section>

      {entry.c ? (
        <section className="card p-4 mb-5">
          <h3
            className="text-[12px] tracking-[0.16em] uppercase font-bold mb-2.5"
            style={{ color: 'var(--brand)' }}
          >
            Akademik şerh
          </h3>
          <Markdown text={entry.c} />
        </section>
      ) : (
        <section className="rounded-2xl border border-charcoal/10 bg-white/60 p-4 mb-5">
          <p className="text-[13px] text-charcoal/60 leading-relaxed m-0">
            Bu madde için şerh henüz yazılmadı. Uygulamaya yalnız denetimden geçmiş şerhler
            alınır; yukarıdaki resmî metin Resmî Gazete'deki hâliyle doğrudur.
          </p>
        </section>
      )}

      <button
        type="button"
        className="btn-ghost w-full"
        onClick={() => void openOnSite(`/mevzuat/${kanunId}/${maddeKey}`)}
      >
        <ExternalLink size={15} /> Sitede aç
      </button>

      <p className="mt-5 text-[12px] leading-relaxed text-charcoal/40">
        Bilgilendirme amaçlıdır. Bağlayıcı metin için mevzuat.gov.tr esas alınmalıdır.
      </p>
    </div>
  );
}

// ─── Arama ───────────────────────────────────────────────────────────────────

function SearchPage() {
  const { manifest } = useManifest();
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  const names = useMemo(
    () => new Map((manifest?.packs ?? []).map((p) => [p.id, p.name])),
    [manifest]
  );

  // Çekirdek kanunları arka planda belleğe al
  useEffect(() => {
    if (!manifest) return;
    let alive = true;
    (async () => {
      for (const id of CORE) {
        if (!alive) return;
        try {
          await loadPack(id);
        } catch {
          /* eksik paket aramayı durdurmasın */
        }
      }
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [manifest]);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setHits([]);
      return;
    }

    const t = window.setTimeout(async () => {
      setBusy(true);

      // «TBK 13» → doğrudan maddeye
      const direct = parseMaddeQuery(term, manifest?.packs.map((p) => p.id) ?? []);
      if (direct?.kanunId && direct.maddeNo) {
        try {
          await loadPack(direct.kanunId);
        } catch {
          /* yoksay */
        }
        navigate(`/mevzuat/${direct.kanunId}/madde-${direct.maddeNo}`);
        setBusy(false);
        return;
      }

      setHits(searchLoaded(term, names));
      setBusy(false);
    }, 220);

    return () => window.clearTimeout(t);
  }, [q, names, manifest]);

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
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="TBK 13 · dürüstlük · haksız fiil"
          aria-label="Madde metninde ara"
          className="w-full rounded-2xl border border-charcoal/10 bg-white pl-10 pr-10 py-3.5
                     text-[15px] outline-none focus:border-[color:var(--brand)]"
        />
        {busy && (
          <Loader2
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-charcoal/35"
            aria-hidden
          />
        )}
      </div>

      {!ready && (
        <p className="text-[12px] text-charcoal/45 mb-3">
          Çekirdek kanunlar belleğe alınıyor… ({loadedPacks().length}/{CORE.length})
        </p>
      )}

      {q.trim().length >= 2 && hits.length === 0 && !busy ? (
        <EmptyState
          title="Sonuç yok"
          body={`"${q}" için madde bulunamadı. Arama şimdilik çekirdek kanunlarda çalışır; belirli bir kanunda aramak için o kanunun sayfasını açın.`}
          actionLabel="Kanun listesine dön"
          onAction={() => navigate('/')}
        />
      ) : (
        <ul className="space-y-2">
          {hits.map((h) => (
            <li key={`${h.kanunId}/${h.key}`}>
              <button
                type="button"
                onClick={() => navigate(`/mevzuat/${h.kanunId}/${h.key}`)}
                className="w-full card px-4 py-3.5 text-left tap"
              >
                <span className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[12px] font-mono font-bold"
                    style={{ color: 'var(--brand)' }}
                  >
                    {h.kanunId.toUpperCase()} m.{h.maddeNo}
                  </span>
                  <span className="text-[12px] text-charcoal/35 truncate">{h.kanunName}</span>
                </span>
                <span className="block text-[14px] font-semibold leading-snug">
                  {stripKanunPrefix(h.title)}
                </span>
                <span className="block text-[12px] text-charcoal/50 leading-snug mt-1">
                  {h.excerpt}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Kaydedilenler ───────────────────────────────────────────────────────────

function SavedPage() {
  const [saved] = usePersisted<string[]>(KEYS.saved, []);
  const { manifest } = useManifest();

  if (saved.length === 0) {
    return (
      <EmptyState
        icon={<Star size={20} />}
        title="Kayıtlı madde yok"
        body="Bir maddeyi açıp «Kaydet» dediğinizde burada birikir. Tüm mevzuat zaten cihazınızda — kayıt yalnız hızlı erişim içindir."
        actionLabel="Mevzuata git"
        onAction={() => navigate('/')}
      />
    );
  }

  return (
    <div className="page">
      <h2 className="text-[20px] font-heading font-bold mb-1">Kaydettikleriniz</h2>
      <p className="text-[12px] text-charcoal/50 mb-3">{saved.length} madde</p>
      <ul className="space-y-2">
        {saved.map((id) => {
          const [kanunId, key] = id.split('/');
          const name = manifest?.packs.find((p) => p.id === kanunId)?.name || kanunId;
          const no = key?.replace('madde-', '') ?? '';
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => navigate(`/mevzuat/${kanunId}/${key}`)}
                className="w-full card px-4 py-3.5 flex items-center gap-3 text-left tap"
              >
                <span
                  className="text-[12px] font-mono font-bold shrink-0"
                  style={{ color: 'var(--brand)' }}
                >
                  m.{no}
                </span>
                <span className="flex-1 text-[14px] font-semibold truncate">{name}</span>
                <ChevronRight size={16} className="text-charcoal/25" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Parçacıklar ─────────────────────────────────────────────────────────────

function ListSkeleton() {
  return (
    <div className="page space-y-2" aria-busy="true" aria-label="Yükleniyor">
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="skeleton h-16 rounded-2xl" />
      ))}
    </div>
  );
}

function plain(md: string): string {
  return String(md || '')
    .replace(/[*_#>`[\]()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** «Türk Medeni Kanunu Madde 166» → «Madde 166» kısmını atıp başlığı bırakır. */
function stripKanunPrefix(title: string): string {
  return String(title || '')
    .replace(/^.*?Madde\s+\d+[a-zA-Z]?\s*[-–—:]?\s*/i, '')
    .trim() || String(title || '');
}

/**
 * Resmî metnin markdown işaretlerini temizler.
 *
 * Resmî metin markdown olarak saklanır: kenar başlığı `**kalın**`, ardından
 * `---` ayracı, sonra madde metni, sonunda bir ayraç daha. Mobilde bu blok
 * düz metin olarak basıldığı için işaretlerin temizlenmesi gerekir.
 *
 * Başlık ÇOK SATIRLI olabilir ("BAŞLANGIÇ\nA. Hukukun uygulanması…"): resmî
 * metin 17.08.2026'da mevzuat.gov.tr kaynağından yeniden yazılınca kenar
 * başlıkları olduğu gibi alındı ve çoğu iki satır. Önceki desen `.+?`
 * kullanıyordu; nokta satır sonunu geçmediği için bu başlıklarda hiç
 * eşleşmiyor ve kullanıcı madde metninin ortasında ham `---` görüyordu —
 * uygulamanın tek vaadi olan resmî metnin tam ortasında.
 */
function cleanOfficial(md: string): string {
  return String(md || '')
    .replace(/\r/g, '')
    // Baştaki "**başlık**" + ayraç → yalnız başlık ([\s\S] satır sonunu geçer)
    .replace(/^\*\*([\s\S]+?)\*\*\s*\n+---\s*\n+/, '$1\n\n')
    // Kalan ayraç satırları (metnin sonundaki dâhil) tamamen atılır
    .replace(/^[ \t]*---[ \t]*$/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Şerh metni için asgari markdown — yalnız başlık ve kalın. */
function Markdown({ text }: { text: string }) {
  const blocks = String(text || '')
    .replace(/\r/g, '')
    .split(/\n{2,}/)
    .filter(Boolean);

  return (
    <div className="space-y-2.5">
      {blocks.map((b, i) => {
        const h = b.match(/^(#{1,6})\s+(.*)$/);
        if (h) {
          const level = h[1].length;
          return (
            <h4
              key={i}
              className={`font-bold leading-snug ${level <= 4 ? 'text-[14px]' : 'text-[13px]'} mt-3`}
            >
              {h[2].replace(/\*\*/g, '')}
            </h4>
          );
        }
        return (
          <p key={i} className="text-[14px] leading-relaxed text-charcoal/75">
            {b.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^[-*]\s+/gm, '• ')}
          </p>
        );
      })}
    </div>
  );
}
