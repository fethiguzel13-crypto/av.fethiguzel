import React, {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Search,
  RefreshCw,
  ExternalLink,
  Bell,
  BellOff,
  Star,
  Share2,
  Scale,
  Gavel,
  Copy,
  Check,
  Type,
  Lock,
  Landmark,
} from 'lucide-react';

import { useRoute, navigate, match, hatirlananKonum, konumaGit } from '../lib/router';
import { usePersisted, KEYS } from '../lib/storage';
import { share, openExternal } from '../lib/external';
import { tapFeedback } from '../lib/haptics';
import { ensureNotificationPermission, scheduleDailyBrief, cancelDailyBrief } from '../lib/notify';
import {
  loadArchive,
  loadFoldIndex,
  loadFullText,
  loadOnizleme,
  officialUrl,
  searchArchive,
  tierLabel,
  TIER_ORDER,
  type ArchiveRow,
} from '../lib/yargi';
import { STATS, trNum } from '../lib/config';
import { kanunAdi, kanunKodu } from '../lib/kanunlar';
import { kararParagraflari, kararGovdesi } from '../lib/metin';
import { useUyelik, erisimVar } from '../lib/uyelik';
import { useEkranKoruma, SECILEMEZ } from '../lib/koruma';
import { okumaKaydet } from '../lib/okuma';
import MorePage from '../shell/MorePage';
import UyelikPage from '../shell/UyelikPage';
import SettingsPage from '../shell/SettingsPage';
import EmptyState from '../shell/EmptyState';

/**
 * Yargı — günlük içtihat + tam metinli Yargıtay arşivi.
 *
 * İndeks ve karar metinleri uygulamayla gelir. Günlük özet açılışta
 * canlı çekilir; ağ yoksa gömülü tohum kalır.
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

  if (route.path === '/uyelik') return <UyelikPage />;
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
          <p className="text-[12px] text-ink-2 mt-0.5">
            {total} kayıt · {groups.length} kaynak
            {STATS.decisions ? ` · arşivde ${trNum(STATS.decisions)} karar` : ''}
          </p>
        </div>
        <button
          type="button"
          aria-label="Yenile"
          onClick={() => {
            void tapFeedback();
            void refresh();
          }}
          className="w-10 h-10 grid place-items-center rounded-full border border-tel bg-white tap shrink-0"
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'animate-spin' : ''}
            style={{ color: 'var(--vurgu)' }}
          />
        </button>
      </div>

      {total === 0 ? (
        <EmptyState
          title="Bugün yeni kayıt yok"
          body="Bugün yeni bir günlük kayıt yok. Yargıtay arşivi cihazda açık — künye, özet ve tam metin."
          actionLabel="Arşive git"
          onAction={() => navigate('/arsiv')}
        />
      ) : (
        groups.map((g) => (
          <section key={g.key} className="mb-6">
            <h3 className="text-[12px] font-mono tracking-widest uppercase text-ink-3 mb-2.5">
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

      <button
        type="button"
        onClick={() => navigate('/arsiv')}
        className="btn-brand w-full mt-2"
      >
        Yargıtay arşivini aç
      </button>

      <p className="mt-6 text-[12px] leading-relaxed text-ink-3">
        Özetler bilgilendirme amaçlıdır; bağlayıcı olan karar metninin kendisidir.
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
        <p className="text-[12px] font-mono text-ink-3 mb-1.5">{item.kunye}</p>
      )}

      <p className="text-[13px] text-ink-2 leading-relaxed selectable">
        {item.publicSummary || item.konu}
      </p>

      <div className="flex gap-2 mt-3">
        <button
          type="button"
          className="text-[12px] font-bold flex items-center gap-1 tap hedef px-2 -mx-2"
          style={{ color: 'var(--vurgu)' }}
          onClick={() => void openExternal(item.url)}
        >
          <ExternalLink size={12} /> Kaynak
        </button>
        <button
          type="button"
          className="text-[12px] font-bold flex items-center gap-1 text-ink-3 tap"
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
    loadArchive().then((data) => {
      if (alive) setRows(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  return rows;
}

function ArchivePage() {
  const rows = useArchive();
  const [q, setQ] = useState('');
  const [tier, setTier] = useState<string | null>(null);

  const tiers = useMemo(() => {
    if (!rows) return [];
    const counts = new Map<string, number>();
    for (const r of rows) {
      const key = r.r || r.a;
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return TIER_ORDER.filter((t) => counts.has(t))
      .map((t) => [t, counts.get(t) ?? 0] as const)
      .concat(
        [...counts.entries()]
          .filter(([k]) => !TIER_ORDER.includes(k))
          .sort((a, b) => b[1] - a[1])
      );
  }, [rows]);

  /*
    Yazarken kutu asla beklemez.

    `useDeferredValue` girilen harfi hemen boyar, taramayı bir sonraki boş
    kareye erteler; kullanıcı hızlı yazarken aradaki tarama hiç yapılmaz.
    Ertelenen değer güncel olandan geriye düştüğünde liste soluklaşır ve
    kullanıcı sonucun tazelenmekte olduğunu görür.
  */
  const gecikmeliQ = useDeferredValue(q);
  const gecikmeliTier = useDeferredValue(tier);
  const bekliyor = gecikmeliQ !== q || gecikmeliTier !== tier;

  /*
    Arama dizini kullanıcı yazmadan ÖNCE, boşta hazırlanır.

    Dizini ilk tuşta indirmek doğru görünüyordu — arama yapmayan kullanıcı
    dosyayı hiç istemesin diye. Ne var ki o zaman indirme, açma ve satırlara
    bölme işi tam kullanıcının yazdığı ana denk geliyor ve ölçümde tek bir
    976 ms'lik blok üretiyordu. İş, arşiv listesi açıldıktan sonraki ilk boş
    ana alındı: kullanıcı listeye bakarken dizin sessizce hazırlanır, ilk tuş
    hazır dizine düşer.
  */
  const [dizinSurumu, setDizinSurumu] = useState(0);
  useEffect(() => {
    let alive = true;
    const basla = () => {
      void loadFoldIndex().then(() => {
        if (alive) setDizinSurumu((n) => n + 1);
      });
    };
    const ric = (globalThis as { requestIdleCallback?: typeof requestIdleCallback })
      .requestIdleCallback;
    const zaman = ric ? ric(basla, { timeout: 3000 }) : window.setTimeout(basla, 800);
    return () => {
      alive = false;
      const cic = (globalThis as { cancelIdleCallback?: typeof cancelIdleCallback })
        .cancelIdleCallback;
      if (ric && cic) cic(zaman as number);
      else clearTimeout(zaman as number);
    };
  }, []);

  /*
    Liste uzunluğu geri dönüşte korunur.

    Yönlendirici kaydırma konumunu hatırlıyor; ne var ki liste kademeli
    çizildiği için geri dönüldüğünde sayfa yeniden 60 satıra çöküyor ve
    hatırlanan konuma inecek yükseklik kalmıyordu. Sayfa sayısı bileşenin
    ömrünü aşan bir yerde tutulur ve dönüşte satırlar geri gelir gelmez
    konum yeniden uygulanır.
  */
  const [sayfa, setSayfa] = useState(() => arsivSayfaBellek.sayfa);

  useEffect(() => {
    arsivSayfaBellek.sayfa = sayfa;
  }, [sayfa]);

  // Sorgu ya da süzgeç değişince liste başa döner.
  const ilkCizimRef = useRef(true);
  useEffect(() => {
    if (ilkCizimRef.current) {
      ilkCizimRef.current = false;
      return;
    }
    setSayfa(1);
  }, [gecikmeliQ, gecikmeliTier]);

  const arama = useMemo(() => {
    if (!rows) return { rows: [] as ArchiveRow[], bitti: true };
    void dizinSurumu; // dizin indiğinde yeniden tara
    return searchArchive(rows, gecikmeliQ, gecikmeliTier, SAYFA_BOYU * sayfa);
  }, [rows, gecikmeliQ, gecikmeliTier, sayfa, dizinSurumu]);

  const results = arama.rows;
  const dahaVar = !arama.bitti && results.length === SAYFA_BOYU * sayfa;

  // Satırlar geri geldiğinde bırakılan yere dön — bir kez.
  const konumUygulandiRef = useRef(false);
  useEffect(() => {
    if (konumUygulandiRef.current || results.length === 0) return;
    konumUygulandiRef.current = true;
    const y = hatirlananKonum('/arsiv');
    if (y > 0) requestAnimationFrame(() => konumaGit(y));
  }, [results.length]);

  /*
    Listenin dibine yaklaşınca kendiliğinden devam eder — «daha fazla»
    düğmesine basmak, 23 bin kararlık bir arşivde gereksiz bir engeldir.

    Kilit şart: hızlı kaydırmada sayfa ARKA ARKAYA eklenmemeli. Gözlemci
    her eklemeden sonra yeniden kurulur ve nişan hâlâ görünür alandaysa
    anında yeniden ateşler; ölçümde tek bir kaydırma jesti listeyi birkaç
    yüz satır büyütüyor, her büyüme bütün listeyi yeniden uzlaştırıyordu.
    `bekleyenRef` bir sonraki çizim tamamlanmadan ikinci eklemeyi keser.
  */
  const dipRef = useRef<HTMLDivElement | null>(null);
  const bekleyenRef = useRef(false);

  useEffect(() => {
    bekleyenRef.current = false;
  }, [results.length]);

  useEffect(() => {
    const el = dipRef.current;
    if (!el || !dahaVar) return undefined;
    const göz = new IntersectionObserver(
      (girisler) => {
        if (bekleyenRef.current) return;
        if (!girisler.some((g) => g.isIntersecting)) return;
        bekleyenRef.current = true;
        setSayfa((n) => n + 1);
      },
      { rootMargin: '400px 0px' }
    );
    göz.observe(el);
    return () => göz.disconnect();
  }, [dahaVar, results.length]);

  if (!rows) return <ListSkeleton />;

  return (
    <div className="page">
      <h2 className="text-[22px] font-heading font-bold leading-tight mb-1">
        Yargıtay arşivi
      </h2>
      <p className="text-[13px] text-ink-2 mb-3">
        {trNum(rows.length)} karar · künye, özet ve tam metin cihazda
      </p>

      <div className="relative mb-3">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"
          aria-hidden
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="HGK · vekâlet · 2026/3267"
          aria-label="Arşivde ara"
          className="w-full rounded-2xl border border-tel bg-white pl-10 pr-4 py-3.5
                     text-[16px] outline-none focus:border-[color:var(--brand)]"
        />
      </div>

      <div className="-mx-4 px-4 mb-4 overflow-x-auto">
        <div className="flex gap-2 w-max pb-1">
          <Chip active={tier === null} onClick={() => setTier(null)}>
            Tümü ({trNum(rows.length)})
          </Chip>
          {tiers.map(([t, n]) => (
            <Chip key={t} active={tier === t} onClick={() => setTier(tier === t ? null : t)}>
              {tierLabel(t)} ({trNum(n)})
            </Chip>
          ))}
        </div>
      </div>

      {/*
        Sayaç yalnız SÜZÜLMÜŞ listede anlamlıdır.

        Süzgeç yokken «60+ sonuç» yazmak, başlıkta duran «25.902 karar»ın
        yanında hem yanlış hem gereksiz görünüyordu: kullanıcı arşivin
        tamamına bakıyor, altmış karara değil.
      */}
      {gecikmeliQ.trim() || gecikmeliTier ? (
        <p className="text-[12px] text-ink-3 mb-2.5">
          {dahaVar ? `${trNum(results.length)}+ sonuç` : `${trNum(results.length)} sonuç`}
        </p>
      ) : null}

      {results.length === 0 ? (
        bekliyor ? (
          <ListSkeleton />
        ) : (
          <EmptyState
            title="Sonuç yok"
            body="Daire (HGK), esas/karar numarası veya uyuşmazlık konusu deneyin."
            actionLabel="Filtreleri temizle"
            onAction={() => {
              setQ('');
              setTier(null);
            }}
          />
        )
      ) : (
        <>
          {/*
            Tarama sürerken liste soluklaşır ama YERİNDE kalır: iskelet
            göstermek her tuşta ekranı boşaltır, okuduğunuz satır kaybolur.
          */}
          <ul
            className="satir-grup satir-liste"
            style={{
              opacity: bekliyor ? 0.55 : 1,
              transition: 'opacity 160ms ease-out',
            }}
          >
            {results.map((r) => (
              <li key={r.i}>
                <ArsivSatiri row={r} />
              </li>
            ))}
          </ul>

          <div ref={dipRef} aria-hidden className="h-px" />

          {/*
            Dipteki gösterge SESSİZ olmalı.

            Burada önce bir iskelet çubuğu duruyordu; iskeletin `shimmer`
            animasyonu sonsuz döngüde çalışır ve sonsuz listede o çubuk hep
            ekranda kalır. Kaydırma boyunca her karede boyama isteyen bir
            animasyon, tam da akıcılığı bozmak istemediğiniz anda çalışıyordu.
          */}
          {dahaVar && (
            <p className="py-5 text-center text-[12px] text-ink-3 m-0" aria-live="polite">
              Daha fazla yükleniyor…
            </p>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Bir seferde eklenen satır sayısı.
 *
 * Önceki sürümde liste 120 sonuçta SABİTTİ ve daha fazlasına ulaşmanın yolu
 * yoktu: 23 bin kararlık arşivin görünen yüzü 120 karardı. Artık liste
 * dibe yaklaştıkça uzar; ekranda aynı anda duran satır sayısı ise sınırlı
 * kaldığı için kaydırma da hafif kalır.
 */
const SAYFA_BOYU = 60;

/**
 * Arşiv listesinin kaç sayfa açık olduğu — bileşenin ömrünü aşar.
 *
 * Karara girip geri dönmek bileşeni söker ve yeniden kurar; yerel durumda
 * tutulan sayfa sayısı o anda sıfırlanır. Modül düzeyinde tutulunca liste
 * dönüşte aynı uzunlukta gelir ve hatırlanan kaydırma konumu anlam kazanır.
 * Uygulama kapanınca sıfırlanması istenen bir değerdir; kalıcı depoya
 * yazılmaz.
 */
const arsivSayfaBellek = { sayfa: 1 };

/**
 * Arşiv liste satırı — kararın KONUSU önde.
 *
 * Önceki sürüm yalnız künyeyi basıyordu: «Yargıtay Ceza Genel Kurulu,
 * E. 2025/525, K. 2026/350, T. 10.06.2026». Yan yana yirmi böyle satır,
 * hiçbir bilgi taşımayan bir duvar üretiyordu. Konu başlıkları derleme
 * anında karar metinlerinden çıkarıldı (bkz. scripts/build-yargi-index.mjs);
 * satır artık kararın neyle ilgili olduğunu söylüyor, künye ikinci sıraya
 * geçiyor — hukukçu ona da ihtiyaç duyar, ama önce konuyu okur.
 *
 * `memo` ile sarılıdır: liste dibe yaklaştıkça altına 60 satır daha eklenir
 * ve o anda ekranda duran satırların hepsi yeniden çizilirdi. Satırlar
 * `row` nesnesi dışında hiçbir şeye bakmadığı ve o nesne arşiv yüklendikten
 * sonra hiç değişmediği için karşılaştırma da bedavadır.
 */
/**
 * Satırın ikinci sırasındaki künye — üstteki rozetle çakışan kısmı atılmış.
 *
 * Ham künye «Yargıtay Ceza Genel Kurulu, E. 2025/525, K. 2026/350,
 * T. 10.06.2026» der. Oysa rozet zaten CEZA GENEL KURULU, yanındaki damga da
 * 10.06.2026 yazar. Aynı bilgi bir satırda üç kez görününce göz esas ayırt
 * edici olana, esas ve karar numarasına odaklanamaz.
 */
function kunyeKisa(row: ArchiveRow): string {
  let k = String(row.k || '');
  const daire = tierLabel(row.r) || row.d || '';
  if (daire) {
    // «Yargıtay Ceza Genel Kurulu, » önekini at — büyük/küçük harfe bakmadan.
    const on = new RegExp(`^\\s*(yargıtay\\s+)?${daire.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[,·-]?\\s*`, 'i');
    k = k.replace(on, '');
  }
  if (row.t) k = k.replace(new RegExp(`\\s*[,·-]?\\s*T\\.?\\s*${row.t.replace(/\./g, '\\.')}\\s*$`, 'i'), '');
  return k.replace(/^[\s,·-]+|[\s,·-]+$/g, '') || String(row.k || '');
}

const ArsivSatiri = React.memo(function ArsivSatiri({ row }: { row: ArchiveRow }) {
  const konu = row.j?.[0] || row.v || '';

  return (
    <button
      type="button"
      onClick={() => {
        void tapFeedback();
        navigate(`/karar/${row.i}`);
      }}
      className="satir hedef"
    >
      <span className="flex items-center gap-1.5 mb-0.5">
        <span
          className="text-[12px] font-mono font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(27,79,114,0.08)', color: '#1B4F72' }}
        >
          {tierLabel(row.r) || row.d}
        </span>
        <span className="text-[12px] font-mono text-ink-3">{row.t}</span>
      </span>

      {konu ? (
        <>
          <span className="block text-[14px] font-semibold leading-snug first-letter:uppercase">
            {konu}
          </span>
          <span className="block text-[12px] text-ink-3 mt-0.5 truncate">{kunyeKisa(row)}</span>
        </>
      ) : (
        <span className="block text-[13.5px] font-semibold leading-snug">{row.k}</span>
      )}

      {row.j && row.j.length > 1 && (
        <span className="block text-[12px] text-ink-2 mt-1 line-clamp-1">
          {row.j.slice(1).join(' · ')}
        </span>
      )}

      {row.m?.length ? (
        <span className="flex flex-wrap gap-1 mt-1.5">
          {row.m.slice(0, 4).map((ref) => {
            const [kanunId, no] = ref.split('/');
            return (
              <span
                key={ref}
                className="px-1.5 py-0.5 rounded text-[12px] font-mono font-bold"
                style={{ background: 'var(--brand-soft)', color: 'var(--vurgu)' }}
              >
                {kanunKodu(kanunId)} {no}
              </span>
            );
          })}
          {row.m.length > 4 && (
            <span className="text-[12px] font-mono text-ink-3 py-0.5">
              +{row.m.length - 4}
            </span>
          )}
        </span>
      ) : null}
    </button>
  );
});

function ArchiveDetail({ id }: { id: string }) {
  const rows = useArchive();
  const uyelik = useUyelik();
  const acik = erisimVar(uyelik);
  const [saved, setSaved] = usePersisted<string[]>(KEYS.saved, []);
  const [olcek, setOlcek] = usePersisted<number>(KEYS.fontScale, 1);
  const [text, setText] = useState<string | null>(null);
  const [textState, setTextState] = useState<'loading' | 'ready' | 'missing' | 'kilitli'>(
    'loading'
  );
  const [kopyalandi, setKopyalandi] = useState(false);

  // Ücretli metin ekranda olduğu sürece ekran görüntüsü ve kaydı kapalı.
  useEkranKoruma(acik && textState === 'ready');

  useEffect(() => {
    let alive = true;
    setTextState('loading');

    if (!acik) {
      // Üyelik yoksa yalnız kısa bir önizleme okunur; tam metin hiç
      // getirilmez, böylece bellekte de bulunmaz.
      loadOnizleme(id).then((t) => {
        if (!alive) return;
        setText(t);
        setTextState('kilitli');
      });
      return () => {
        alive = false;
      };
    }

    loadFullText(id).then((t) => {
      if (!alive) return;
      setText(t);
      setTextState(t ? 'ready' : 'missing');
    });
    return () => {
      alive = false;
    };
  }, [id, acik]);

  useEffect(() => {
    document.documentElement.style.setProperty('--okuma-olcek', String(olcek));
  }, [olcek]);

  const row = rows?.find((r) => r.i === id);

  // Okuma gecmisine yaz — «kaldiginiz yer» seridi bunu kullanir.
  useEffect(() => {
    if (!row) return;
    okumaKaydet({
      yol: `/karar/${row.i}`,
      baslik: row.j?.[0] || row.v || row.k,
      altSatir: `${tierLabel(row.r) || row.d} · ${row.t}`,
      tur: 'karar',
    });
  }, [row]);

  if (!rows) return <ListSkeleton />;

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
  const sitePath = `https://www.avfethiguzel.com/yargi-kararlari/${row.i}`;
  const konu = row.j?.[0] || row.v || '';
  /*
    Metin, künye başlığı atılmış hâliyle dizilir.

    Ham metnin ilk yirmi satırı künye, büyük harfli konu başlıkları ve atıf
    yapılan maddelerin listesidir; üçü de bu sayfanın tepesinde zaten
    duruyor. Aynı bilgiyi bir de gövdede okutmak, okumaya kararın kendisiyle
    değil bir kapak sayfasıyla başlatıyordu.
  */
  const paragraflar = text ? kararParagraflari(kararGovdesi(text)) : [];
  const KADEME = [1, 1.15, 1.32];
  const kademeIndex = Math.max(0, KADEME.indexOf(olcek));

  /** Dilekçeye yapıştırılabilir künye + konu. */
  async function kopyalaKunye() {
    const satirlar = [row!.k];
    if (konu) satirlar.unshift(konu.charAt(0).toLocaleUpperCase('tr-TR') + konu.slice(1));
    if (row!.h) satirlar.push(`İlk derece: ${row!.h}`);
    satirlar.push(sitePath);
    const metin = satirlar.join('\n');
    try {
      await navigator.clipboard.writeText(metin);
      setKopyalandi(true);
      void tapFeedback();
      window.setTimeout(() => setKopyalandi(false), 1800);
    } catch {
      void share({ title: row!.k, text: metin, url: sitePath });
    }
  }

  return (
    <div className="page selectable">
      <header className="pt-1 pb-3">
        <button
          type="button"
          onClick={() => navigate('/arsiv')}
          className="flex items-center gap-1.5 tap min-h-[44px] pr-3 -my-1"
        >
          <span
            className="text-[12px] font-mono font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(27,79,114,0.1)', color: '#1B4F72' }}
          >
            {tierLabel(row.r) || row.a}
          </span>
          <span className="text-[12px] font-mono text-ink-3">{row.t}</span>
        </button>

        {konu ? (
          <>
            <h2 className="text-[21px] font-heading font-bold leading-tight mt-1.5 first-letter:uppercase">
              {konu}
            </h2>
            <p className="text-[12.5px] text-ink-2 leading-snug mt-1.5 font-mono">{row.k}</p>
          </>
        ) : (
          <h2 className="text-[17px] font-heading font-bold leading-snug mt-1.5">{row.k}</h2>
        )}

        {row.h && (
          <p className="text-[12.5px] text-ink-2 mt-1 flex items-center gap-1.5">
            <Gavel size={12} aria-hidden /> İlk derece: {row.h}
          </p>
        )}
      </header>

      {row.j && row.j.length > 1 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {row.j.slice(1).map((k) => (
            <span
              key={k}
              className="pill"
              style={{ background: 'rgba(27,79,114,0.07)', color: '#1B4F72' }}
            >
              {k}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-1.5 mb-4">
        <DetayButonu
          label={isSaved ? 'Kayıtlı' : 'Kaydet'}
          active={isSaved}
          icon={
            <Star
              size={15}
              fill={isSaved ? 'var(--brand)' : 'none'}
              color={isSaved ? 'var(--brand)' : 'currentColor'}
            />
          }
          onClick={() => {
            void tapFeedback();
            setSaved((prev) => (isSaved ? prev.filter((s) => s !== row.i) : [row.i, ...prev]));
          }}
        />
        <DetayButonu
          label={kopyalandi ? 'Kopyalandı' : 'Künye'}
          icon={kopyalandi ? <Check size={15} /> : <Copy size={15} />}
          onClick={kopyalaKunye}
        />
        <DetayButonu
          label="Paylaş"
          icon={<Share2 size={15} />}
          onClick={() =>
            void share({ title: row.k, text: konu || `${row.d} · ${row.t}`, url: sitePath })
          }
        />
        <DetayButonu
          label={['Normal', 'Büyük', 'En büyük'][kademeIndex]}
          icon={<Type size={15} />}
          onClick={() => {
            void tapFeedback();
            setOlcek(KADEME[(kademeIndex + 1) % KADEME.length]);
          }}
        />
      </div>

      <AtifYapilanMaddeler refs={row.m} />

      {textState === 'loading' && <div className="skeleton h-40 rounded-2xl mb-4" />}

      {textState === 'kilitli' ? (
        <KilitliMetin onizleme={text} uzunluk={row.c} />
      ) : paragraflar.length > 0 ? (
        <section className="kagit mb-4">
          <div className="flex items-center justify-between mb-2.5">
            <p className="etiket m-0">Karar metni</p>
            {row.c ? (
              <p className="text-[12px] font-mono text-ink-3 m-0">
                {Math.max(1, Math.round(row.c / 1100))} dk
              </p>
            ) : null}
          </div>
          {/*
            Ücretli metin seçilemez ve kopyalanamaz. Künye ayrı bir düğmeyle
            kopyalanabilir; dilekçeye yazılacak olan zaten künyedir.
          */}
          <div className={`space-y-2.5 ${SECILEMEZ}`}>
            {paragraflar.map((p, i) => (
              <p key={i} className="okuma m-0">
                {p}
              </p>
            ))}
          </div>
        </section>
      ) : textState === 'missing' ? (
        <div className="rounded-2xl border border-tel bg-white/60 p-4 mb-4">
          {row.e ? (
            <p className="text-[14px] leading-relaxed text-ink mb-3">{row.e}</p>
          ) : null}
          <p className="text-[13px] text-ink-2 leading-relaxed m-0">
            Bu kaydın tam metni pakette yok. Resmî nüsha Yargıtay karar aramasında.
          </p>
        </div>
      ) : null}

      {row.w && row.w.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {row.w.map((w) => (
            <span
              key={w}
              className="pill"
              style={{ background: 'var(--brand-soft)', color: 'var(--vurgu)' }}
            >
              {w}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        className="btn-ghost w-full"
        onClick={() => void openExternal(officialUrl(row.i))}
      >
        <ExternalLink size={15} /> Resmî kaynakta aç
      </button>

      <p className="mt-5 text-[12.5px] leading-relaxed text-ink-3">
        Metin Yargıtay karar aramasından derlenmiştir. Bilgilendirme amaçlıdır; bağlayıcı olan
        kararın aslıdır.
      </p>
    </div>
  );
}

/**
 * Üyelik olmadan görünen hâl.
 *
 * Boş bir duvar yerine kararın ilk satırları gösterilir ve metin aşağı
 * doğru silinerek biter. Kullanıcı neye para ödeyeceğini görür; ekranda
 * duran şey bir reklam değil, kararın kendisidir.
 */
function KilitliMetin({ onizleme, uzunluk }: { onizleme: string | null; uzunluk?: number }) {
  const paragraflar = onizleme ? kararParagraflari(onizleme) : [];

  return (
    <section className="mb-4">
      <div className="kagit relative overflow-hidden">
        <p className="etiket mb-2.5">Karar metni</p>
        {paragraflar.length > 0 ? (
          <div className={`space-y-2.5 ${SECILEMEZ}`}>
            {paragraflar.map((p, i) => (
              <p key={i} className="okuma m-0">
                {p}
              </p>
            ))}
          </div>
        ) : (
          <div className="space-y-2" aria-hidden>
            <div className="skeleton h-4 rounded" />
            <div className="skeleton h-4 rounded w-[92%]" />
            <div className="skeleton h-4 rounded w-[85%]" />
          </div>
        )}
        {/* Metin aşağı doğru kâğıda karışarak biter */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,254,250,0), var(--kagit) 85%)',
          }}
        />
      </div>

      {/*
        Kilit kartı KOYU zemin üstünde.

        Kart daha önce %5 opaklıkta lacivert bir yıkamaydı; krem sayfada
        neredeyse görünmüyor, ücretli sınır olduğunu söyleyemiyordu. Site
        kararlılığını koyu zeminle gösteriyor — burası uygulamada o jesti
        hak eden tek yer: kullanıcıya «buradan ötesi kapalı» diyen kart.
      */}
      <div
        className="mt-3 rounded-2xl px-4 py-4"
        style={{ background: '#1B4F72' }}
      >
        <p className="flex items-center gap-2 text-[13.5px] font-bold m-0 text-white">
          <Lock size={15} aria-hidden />
          Tam metin üyelik gerektirir
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed m-0 text-white/75">
          {uzunluk
            ? `Bu kararın tamamı ${Math.round(uzunluk / 1000)} bin karakter. `
            : ''}
          Künye, konu ve atıf yapılan maddeler ücretsizdir; kararların tam metni Yargıtay arşivi
          üyeliğiyle açılır.
        </p>
        <button
          type="button"
          onClick={() => {
            void tapFeedback();
            navigate('/uyelik');
          }}
          className="btn-kiremit w-full mt-3.5"
        >
          <Landmark size={16} /> Üyeliği görüntüle
        </button>
      </div>
    </section>
  );
}

/**
 * Kararın atıf yaptığı kanun maddeleri — dokununca mevzuata gider.
 *
 * Bağ çift yönlüdür: maddeden karara (PortalApp) ve karardan maddeye
 * (burası). Hukukçu kararı okurken «hangi maddeye dayanıyor» diye
 * sorduğunda uygulamadan çıkmak zorunda kalmaz.
 */
function AtifYapilanMaddeler({ refs }: { refs?: string[] }) {
  if (!refs || refs.length === 0) return null;

  return (
    <section className="mb-4">
      <h3 className="text-[12px] tracking-[0.16em] uppercase font-bold text-ink-3 mb-2 flex items-center gap-1.5">
        <Scale size={13} aria-hidden />
        Atıf yapılan maddeler
      </h3>
      {/*
        Çipler 44 px yüksekliğinde. Görsel olarak 32 px yeterli görünüyordu;
        ne var ki bunlar kararın gövdesinden mevzuata giden asıl geçitler ve
        yan yana dizildikleri için yanlış maddeye dokunmak kolaydır.
      */}
      <div className="flex flex-wrap gap-1.5">
        {refs.map((ref) => {
          const [kanunId, no] = ref.split('/');
          return (
            <button
              key={ref}
              type="button"
              onClick={() => {
                void tapFeedback();
                navigate(`/mevzuat/${kanunId}/madde-${no}`);
              }}
              title={kanunAdi(kanunId)}
              className="inline-flex items-center px-3 rounded-xl text-[12px] font-mono
                         font-bold border border-tel bg-white tap"
              style={{ color: 'var(--vurgu)', minHeight: 44 }}
            >
              {kanunKodu(kanunId)} m.{no}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function DetayButonu({
  label,
  icon,
  onClick,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex-1 rounded-xl border border-tel bg-white px-2 py-2.5
                 flex flex-col items-center gap-1 tap"
    >
      <span className="text-ink">{icon}</span>
      <span className="text-[12px] font-semibold leading-none">{label}</span>
    </button>
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
      <p className="text-[13px] text-ink-2 leading-relaxed mb-5">
        İlgilendiğiniz alanları işaretleyin; günlük özet açıldığında bunlar üste gelir.
        Bildirim cihazınızda üretilir, hiçbir veri sunucuya gönderilmez.
      </p>

      <section className="card p-4 mb-4 flex items-start gap-3">
        <span className="mt-0.5 text-ink-3" aria-hidden>
          {daily ? <Bell size={16} /> : <BellOff size={16} />}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-bold mb-0.5">Günlük hatırlatma</h3>
          <p className="text-[12px] text-ink-2 leading-relaxed">
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

      <h3 className="text-[12px] font-mono tracking-widest uppercase text-ink-3 mb-2.5">
        İlgi alanları
      </h3>

      {alanlar.length === 0 ? (
        <p className="text-[13px] text-ink-3">Arşiv yükleniyor…</p>
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
