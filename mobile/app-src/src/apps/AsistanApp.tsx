import React, { Suspense, lazy, useEffect, useState } from 'react';
import {
  Scale,
  Landmark,
  BookOpen,
  ChevronRight,
  CalendarDays,
  Calculator,
  History,
} from 'lucide-react';

import { useRoute, navigate } from '../lib/router';
import { sectionOf } from '../lib/nav';
import { STATS, trNum } from '../lib/config';
import { tapFeedback } from '../lib/haptics';
import { QUICK_LAWS } from '../lib/command';
import { usePersisted, KEYS } from '../lib/storage';
import type { OkunanKayit } from '../lib/okuma';
import { kanunKodu, kanunAdi } from '../lib/kanunlar';
import { loadArchive, tierLabel, type ArchiveRow } from '../lib/yargi';
import CommandSearch from '../shell/CommandSearch';
import MorePage from '../shell/MorePage';
import SettingsPage from '../shell/SettingsPage';

/**
 * Av. Fethi Güzel Hukuk Asistanı — araştırma kütüphanesi.
 *
 * Giriş ekranı bir KISAYOL MENÜSÜ değildir. Önceki sürüm dört satırlık bir
 * liste gösteriyordu ve uygulama dışarıdan hesap makinesi gibi görünüyordu;
 * oysa külliyat 8.088 madde, 19.891 karar, 94 rehber, 33 kavram ve 11
 * akademik eserden oluşuyor. Ekran artık bunu söylüyor:
 *
 *   1. İlk jest ARAMA — hukukçu bir şey aramaya gelir, menü gezmeye değil.
 *   2. KÜLLİYAT SAYAÇLARI — kütüphanenin ağırlığı ilk karede görünür.
 *   3. KALDIĞINIZ YER — son okunan madde ve karar, tek dokunuşla geri.
 *   4. GÜNÜN İÇTİHADI ve ARŞİVDEN — kütüphane yaşayan bir şey.
 *   5. Hesaplama en altta bir ŞERİT — yararlı, ama ürünün yüzü değil.
 */

const PortalApp = lazy(() => import('./PortalApp'));
const HesapApp = lazy(() => import('./HesapApp'));
const IcthatApp = lazy(() => import('./IcthatApp'));
const KitaplikApp = lazy(() => import('./KitaplikApp'));

const SECTIONS: Record<string, React.ComponentType> = {
  laws: PortalApp,
  tools: HesapApp,
  cases: IcthatApp,
  library: KitaplikApp,
};

const TOOL_CHIPS = [
  { id: 'kidem', label: 'Kıdem' },
  { id: 'faiz', label: 'Faiz' },
  { id: 'miras', label: 'Miras' },
  { id: 'nafaka', label: 'Nafaka' },
  { id: 'sure', label: 'Süre' },
  { id: 'vekalet', label: 'Vekâlet' },
];

export default function AsistanApp() {
  const route = useRoute();

  if (route.path === '/diger') return <MorePage />;
  if (route.path === '/ayarlar') return <SettingsPage />;

  const section = sectionOf(route.path);
  const Section = section ? SECTIONS[section] : null;

  if (Section) {
    return (
      <Suspense fallback={<SectionSkeleton />}>
        <Section />
      </Suspense>
    );
  }

  return <HomePage />;
}

function HomePage() {
  const laws = STATS.laws;
  const articles = STATS.articles;
  const decisions = STATS.decisions;
  const guides = STATS.guides;
  const concepts = STATS.concepts;
  const works = STATS.works;

  /*
    Giriş ekranı bir KART IZGARASI değil, kütüphanenin FİHRİSTİDİR.

    Önceki iki sürüm de aynı kalıba düşüyordu: eşit ağırlıkta, ikon +
    başlık + açıklama taşıyan kutular. O kalıp hiçbir şeyi öne çıkarmaz;
    dört kutu da aynı şeyi söyler ve ürünün ne olduğu ancak yazılar
    okununca anlaşılır.

    Basılı bir külliyatın ilk sayfası ne yapıyorsa o yapılıyor: künye,
    sonra içindekiler. Bölümler çizgiyle ayrılmış satırlar hâlinde, her
    birinin ağırlığı sağdaki sayıda görünür.
  */
  const bolumler = [
    {
      yol: '/mevzuat',
      renk: '#2E4036',
      ikon: <Scale size={18} />,
      ad: 'Mevzuat',
      alt: 'Resmî madde metni, kanun kanun',
      sayi: articles ? trNum(articles) : null,
      birim: 'madde',
    },
    {
      yol: '/arsiv',
      renk: '#1B4F72',
      ikon: <Landmark size={18} />,
      ad: 'Yargıtay arşivi',
      alt: 'İçtihadı birleştirme, genel kurul ve daire kararları',
      sayi: decisions ? trNum(decisions) : null,
      birim: 'karar',
    },
    {
      yol: '/kitaplik',
      renk: '#6B4F3A',
      ikon: <BookOpen size={18} />,
      ad: 'Kitaplık',
      alt: 'Vatandaş rehberi, kavram sözlüğü, akademik eserler',
      sayi: guides && concepts && works ? trNum(guides + concepts + works) : null,
      birim: 'metin',
    },
    {
      yol: '/hesap',
      renk: '#B24A28',
      ikon: <Calculator size={18} />,
      ad: 'Hesaplama',
      alt: 'Kıdem, faiz, harç, nafaka, miras, süre',
      sayi: STATS.tools ? String(STATS.tools) : null,
      birim: 'araç',
    },
  ];

  return (
    <div className="page pt-0">
      <header className="-mx-4 px-4 pt-6 pb-5 mb-4 border-b border-tel">
        {/*
          İtalik/kiremit deneme geri alındı.

          Başlığın ikinci satırını serif italik ve kiremit renginde deneyip
          zeminle birlikte gösterdik; kullanıcı beğenmedi. Markanın
          kararlılığı artık başlıkta değil, yapısal ögelerde (düğme, rozet,
          üst çubuk) taşınıyor — bkz. app.css «KARARLI VURGU».
        */}
        <h2 className="text-[28px] leading-[1.1] font-heading font-bold text-ink tracking-[-0.018em]">
          Türk hukuku
          <br />
          araştırma kütüphanesi
        </h2>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-2">
          Kanun maddesi, Yargıtay kararı, kavram ve rehber — cihazınızda, sunucu beklemeden.
        </p>
        {laws && articles ? (
          <p className="mt-3 text-[12.5px] text-ink-3 rakam">
            {laws} kanun · {trNum(articles)} madde · tamamı çevrimdışı
          </p>
        ) : null}
      </header>

      <CommandSearch />

      <SonOkunanlar />

      <section className="mt-6">
        <h3 className="etiket mb-1">İçindekiler</h3>
        <ul>
          {bolumler.map((b) => (
            <li key={b.yol}>
              <button
                type="button"
                onClick={() => {
                  void tapFeedback();
                  navigate(b.yol);
                }}
                className="w-full text-left flex items-center gap-3.5 py-3.5 border-b border-tel tap"
              >
                <span
                  className="w-9 h-9 rounded-xl grid place-items-center shrink-0"
                  style={{ background: `${b.renk}12`, color: b.renk }}
                  aria-hidden
                >
                  {b.ikon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[16px] font-heading font-bold leading-tight">
                    {b.ad}
                  </span>
                  <span className="block text-[12.5px] text-ink-3 mt-0.5 leading-snug">
                    {b.alt}
                  </span>
                </span>
                {b.sayi && (
                  <span className="text-right shrink-0">
                    <span className="block font-heading font-bold text-[15px] leading-none rakam text-ink">
                      {b.sayi}
                    </span>
                    <span className="block text-[12px] text-ink-3 mt-0.5">{b.birim}</span>
                  </span>
                )}
                <ChevronRight size={16} className="text-ink-4 shrink-0" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h3 className="etiket mb-2.5">Sık açılan kanunlar</h3>
        <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max pb-1">
            {QUICK_LAWS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  void tapFeedback();
                  navigate(`/mevzuat/${l.id}`);
                }}
                className="hedef inline-flex items-center px-4 rounded-xl border border-tel bg-surface
                           font-mono font-bold text-[12px] text-ink-2 tap"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <TodayStrip />
      <RecentDecisions />

      <section className="mt-7">
        <div className="flex items-baseline justify-between mb-2.5">
          <h3 className="etiket">Hesaplama araçları</h3>
          <button
            type="button"
            onClick={() => navigate('/hesap')}
            className="text-[12.5px] font-bold hedef inline-flex items-center px-1"
            style={{ color: 'var(--vurgu)' }}
          >
            Tümü{STATS.tools ? ` (${STATS.tools})` : ''}
          </button>
        </div>
        <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max pb-1">
            {TOOL_CHIPS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  void tapFeedback();
                  navigate(`/arac/${t.id}`);
                }}
                className="hedef inline-flex items-center px-4 rounded-xl border border-tel bg-surface text-[13.5px] font-semibold tap"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <p className="mt-8 pt-5 border-t border-tel text-[12.5px] leading-relaxed text-ink-3">
        Bilgilendirme amaçlıdır; hukuki tavsiye veya vekâlet ilişkisi kurmaz. Bağlayıcı metin
        için mevzuat.gov.tr ve kararın aslı esastır.
      </p>
    </div>
  );
}

/**
 * Kaldığınız yer.
 *
 * Araştırma kesintili bir iştir: telefon kapanır, duruşma başlar, dosya
 * değişir. Uygulamayı yeniden açan kişi en son baktığı maddeyi aramak
 * zorunda kalmamalı. Kayıt yalnız cihazda tutulur.
 */
function SonOkunanlar() {
  const [kayitlar] = usePersisted<OkunanKayit[]>(KEYS.lastRead, []);
  if (!kayitlar.length) return null;

  return (
    <section className="mt-6">
      <h3 className="etiket flex items-center gap-1.5 mb-2.5">
        <History size={13} aria-hidden />
        Kaldığınız yer
      </h3>
      <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 w-max pb-1">
          {kayitlar.slice(0, 8).map((k) => (
            <button
              key={k.yol}
              type="button"
              onClick={() => {
                void tapFeedback();
                navigate(k.yol);
              }}
              className="card px-3.5 py-3 text-left tap min-w-[11rem] max-w-[13.5rem]"
            >
              <span className="block text-[12px] font-mono uppercase tracking-wide text-ink-3 truncate">
                {k.altSatir}
              </span>
              <span className="block text-[13px] font-semibold leading-snug mt-0.5 line-clamp-2">
                {k.baslik}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

type Daily = {
  dateLabel?: string;
  highlights?: { id: string; title?: string; konu?: string; kunye?: string; publicSummary?: string }[];
  stats?: { totalItems?: number };
};

function TodayStrip() {
  const [daily, setDaily] = useState<Daily | null>(null);

  useEffect(() => {
    let alive = true;
    fetch('./icthat/seed.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d) setDaily(d as Daily);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const items = (daily?.highlights || []).slice(0, 2);
  if (!items.length) return null;

  return (
    <section className="mt-6">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="etiket flex items-center gap-1.5">
          <CalendarDays size={13} aria-hidden />
          {daily?.dateLabel || 'Günün içtihadı'}
        </h3>
        <button
          type="button"
          onClick={() => navigate('/icthat')}
          className="text-[12.5px] font-bold hedef inline-flex items-center px-1"
          style={{ color: 'var(--vurgu)' }}
        >
          Günlük
        </button>
      </div>
      <ul className="satir-grup">
        {items.map((it) => (
          <li key={it.id}>
            <button
              type="button"
              onClick={() => navigate('/icthat')}
              className="satir hedef"
            >
              <span className="block text-[13.5px] font-semibold leading-snug">
                {it.title || it.kunye || it.konu}
              </span>
              {it.publicSummary && (
                <span className="block text-[12.5px] text-ink-2 mt-1 line-clamp-2 leading-snug">
                  {it.publicSummary}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Arşivden — kararın KONUSUYLA.
 *
 * Önceki sürüm burada yalnız künye gösteriyordu; «Yargıtay 2. Hukuk Dairesi,
 * E. 2026/3322» satırının kullanıcıya söylediği hiçbir şey yok. Konu
 * başlıkları derleme anında karar metinlerinden çıkarıldı, satır artık
 * kararın neyle ilgili olduğunu söylüyor.
 */
function RecentDecisions() {
  const [rows, setRows] = useState<ArchiveRow[]>([]);

  useEffect(() => {
    let alive = true;
    loadArchive().then((all) => {
      if (!alive) return;
      // Konusu çıkarılabilmiş kararlar öne alınır — vitrinde okunmayan
      // künye satırı göstermenin anlamı yok.
      const konulu = all.filter((r) => r.j?.length);
      const havuz = konulu.length >= 3 ? konulu : all;
      const yibk = havuz.filter((r) => r.r === 'yibk').slice(0, 2);
      const rest = havuz.filter((r) => r.r !== 'yibk').slice(0, 3 - yibk.length);
      setRows([...yibk, ...rest].slice(0, 3));
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!rows.length) return null;

  return (
    <section className="mt-5">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="etiket">Arşivden</h3>
        <button
          type="button"
          onClick={() => navigate('/arsiv')}
          className="text-[12.5px] font-bold hedef inline-flex items-center px-1"
          style={{ color: 'var(--vurgu)' }}
        >
          Tüm kararlar
        </button>
      </div>
      <ul className="satir-grup">
        {rows.map((r) => (
          <li key={r.i}>
            <button
              type="button"
              onClick={() => {
                void tapFeedback();
                navigate(`/karar/${r.i}`);
              }}
              className="satir hedef"
            >
              <span className="block text-[12px] font-mono uppercase tracking-wide text-ink-3">
                {tierLabel(r.r) || r.d} · {r.t}
              </span>
              <span className="block text-[13.5px] font-semibold leading-snug mt-0.5">
                {r.j?.[0] || r.v || r.k}
              </span>
              {r.m?.length ? (
                <span className="flex flex-wrap gap-1 mt-1.5">
                  {r.m.slice(0, 3).map((ref) => {
                    const [kanunId, no] = ref.split('/');
                    return (
                      <span
                        key={ref}
                        title={kanunAdi(kanunId)}
                        className="px-1.5 py-0.5 rounded text-[12px] font-mono font-bold"
                        style={{ background: 'var(--brand-soft)', color: 'var(--vurgu)' }}
                      >
                        {kanunKodu(kanunId)} {no}
                      </span>
                    );
                  })}
                </span>
              ) : r.e ? (
                <span className="block text-[12.5px] text-ink-2 mt-1 line-clamp-2 leading-snug">
                  {r.e}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionSkeleton() {
  return (
    <div className="page space-y-3" aria-busy="true" aria-label="Yükleniyor">
      <div className="skeleton h-8 w-2/3 rounded-lg" />
      <div className="skeleton h-24 rounded-2xl" />
      <div className="skeleton h-24 rounded-2xl" />
      <div className="skeleton h-24 rounded-2xl" />
    </div>
  );
}
