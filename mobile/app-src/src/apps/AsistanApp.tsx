import React, { Suspense, lazy } from 'react';
import { Scale, Calculator, CalendarDays, BookOpen, ChevronRight, MoreHorizontal } from 'lucide-react';

import { useRoute, navigate } from '../lib/router';
import { sectionOf } from '../lib/nav';
import { STATS, trNum, BRAND } from '../lib/config';
import MorePage from '../shell/MorePage';
import SettingsPage from '../shell/SettingsPage';

/**
 * Av. Fethi Güzel Hukuk Asistanı — dört bölüm tek uygulamada.
 *
 * ── Neden birleşik ──────────────────────────────────────────────────────────
 * Dört ayrı Play uygulaması olarak tasarlanmıştı. Play'in yeni geliştirici
 * hesaplarına dayattığı "12 test kullanıcısı × 14 gün kapalı test" şartı HER
 * UYGULAMA için ayrı işlediğinden, dört uygulama dört ayrı kapalı test
 * demekti. Ayrıca tek işlevli bir hesaplama uygulaması Play'in Minimum
 * Functionality politikasına yakın duruyordu. Birleşme, dört uygulamanın ayrı
 * tutulma gerekçesi olan Repetitive Content riskini de ortadan kaldırdı.
 *
 * ── Nasıl çalışıyor ─────────────────────────────────────────────────────────
 * Dört bölüm bileşeni DEĞİŞTİRİLMEDEN kullanılır. Bu mümkün, çünkü dört
 * uygulamanın rota kümeleri zaten ayrıktı (`/arac/:id`, `/mevzuat/:kanun`,
 * `/arsiv`, `/kategori/:cat` …). Tek çakışma her birinin ana sayfasının `/`
 * olmasıydı; artık her bölümün kendi kökü var (`/hesap`, `/mevzuat`, …) ve
 * bölüm bileşeni o yolda hiçbir iç rotasıyla eşleşmediği için kendi ana
 * sayfasına düşer — istediğimiz davranış.
 *
 * Hangi yolun hangi bölüme ait olduğu `lib/nav.ts` → `SECTION_PATHS` içinde
 * TEK YERDE durur; alt gezinmedeki etkin sekme de oradan hesaplanır.
 *
 * Bölümler `lazy` ile ayrı parçalara bölünür: uygulama açılırken yalnız giriş
 * ekranı yüklenir, 8.000 maddelik mevzuat bölümü kullanıcı oraya girene kadar
 * ayrıştırılmaz.
 */
const PortalApp = lazy(() => import('./PortalApp'));
const HesapApp = lazy(() => import('./HesapApp'));
const IcthatApp = lazy(() => import('./IcthatApp'));
const RehberApp = lazy(() => import('./RehberApp'));

const SECTIONS: Record<string, React.ComponentType> = {
  laws: PortalApp,
  tools: HesapApp,
  cases: IcthatApp,
  guides: RehberApp,
};

export default function AsistanApp() {
  const route = useRoute();

  // Kabuğa ait sayfalar — bölüm değiller, her bölümden erişilirler.
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

/* ── Giriş ekranı ─────────────────────────────────────────────────────────── */

type Card = {
  path: string;
  label: string;
  desc: string;
  stat: string | null;
  icon: React.ReactNode;
  tint: string;
};

function cards(): Card[] {
  const { laws, articles, tools, decisions, guides } = STATS;

  return [
    {
      path: '/mevzuat',
      label: 'Mevzuat',
      desc: 'Kanun maddesi metni ve arama',
      stat: articles && laws ? `${trNum(articles)} madde · ${laws} kanun` : null,
      icon: <Scale size={20} aria-hidden />,
      tint: '#2E4036',
    },
    {
      path: '/hesap',
      label: 'Hesaplama',
      desc: 'Kıdem, faiz, harç, nafaka ve diğerleri',
      stat: tools ? `${tools} araç` : null,
      icon: <Calculator size={20} aria-hidden />,
      tint: '#CC5833',
    },
    {
      path: '/icthat',
      label: 'İçtihat',
      desc: 'Günün kararları ve arşiv',
      stat: decisions ? `${trNum(decisions)} karar` : null,
      icon: <CalendarDays size={20} aria-hidden />,
      tint: '#1B4F72',
    },
    {
      path: '/rehber',
      label: 'Vatandaş rehberi',
      desc: 'Merci, süre ve belge — adım adım',
      stat: guides ? `${trNum(guides)} rehber` : null,
      icon: <BookOpen size={20} aria-hidden />,
      tint: '#6B4F3A',
    },
  ];
}

function HomePage() {
  return (
    <div className="page">
      <header className="pt-2 pb-6">
        <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-charcoal/40">
          {BRAND}
        </p>
        <h2 className="mt-1.5 text-[26px] leading-[1.15] font-heading font-bold text-charcoal">
          Hukuk Asistanı
        </h2>
        <p className="mt-2.5 text-[14px] leading-relaxed text-charcoal/55">
          Mevzuat metni, hesaplama araçları, günlük içtihat ve vatandaş rehberi —
          tamamı cihazınızda, internet olmadan.
        </p>
      </header>

      <nav aria-label="Bölümler">
        <ul className="space-y-2.5">
          {cards().map((c) => (
            <li key={c.path}>
              <button
                type="button"
                onClick={() => navigate(c.path)}
                className="w-full card p-4 flex items-center gap-3.5 text-left tap"
              >
                <span
                  className="w-11 h-11 rounded-2xl grid place-items-center text-white shrink-0"
                  style={{ background: c.tint }}
                >
                  {c.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-bold leading-snug text-charcoal">
                    {c.label}
                  </span>
                  <span className="block text-[12.5px] leading-snug text-charcoal/50 mt-0.5">
                    {c.desc}
                  </span>
                  {c.stat ? (
                    <span className="block text-[11px] font-mono text-charcoal/35 mt-1">
                      {c.stat}
                    </span>
                  ) : null}
                </span>
                <ChevronRight size={17} className="text-charcoal/25 shrink-0" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        onClick={() => navigate('/diger')}
        className="btn-ghost w-full mt-5"
      >
        <MoreHorizontal size={16} aria-hidden />
        Diğer ve ayarlar
      </button>

      <p className="mt-6 text-[11.5px] leading-relaxed text-charcoal/45 text-center px-2">
        Bilgilendirme amaçlıdır; hukuki tavsiye veya vekâlet ilişkisi kurmaz.
      </p>
    </div>
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
