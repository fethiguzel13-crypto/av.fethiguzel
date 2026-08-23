import React, { useEffect, useState } from 'react';
import { App as CapApp } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { WifiOff, Share2, Settings } from 'lucide-react';

import { APP, appName } from '../lib/config';
import { useRoute, navigate } from '../lib/router';
import { APP_TABS, sectionOf, BOLUM_RENK, BOLUM_SERIT } from '../lib/nav';
import { share } from '../lib/external';
import { siteUrlFor } from '../lib/deeplink';
import { cubukBasligi } from './baslik';
import BottomNav from './BottomNav';

/**
 * Ortak kabuk: başlık, alt gezinme, çevrimdışı şeridi, Android geri tuşu.
 *
 * Çevrimdışı şerit bilinçli olarak bilgilendirici; uygulamanın kendisi
 * çevrimdışı çalıştığı için kullanıcıyı engellemez, yalnız hangi bölümün
 * ağ istediğini söyler.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const route = useRoute();
  const [online, setOnline] = useState(true);

  // ── Ağ durumu ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let handle: { remove: () => void } | null = null;

    Network.getStatus()
      .then((s) => setOnline(s.connected))
      .catch(() => setOnline(navigator.onLine));

    Network.addListener('networkStatusChange', (s) => setOnline(s.connected))
      .then((h) => {
        handle = h;
      })
      .catch(() => {
        const on = () => setOnline(true);
        const off = () => setOnline(false);
        window.addEventListener('online', on);
        window.addEventListener('offline', off);
        handle = {
          remove: () => {
            window.removeEventListener('online', on);
            window.removeEventListener('offline', off);
          },
        };
      });

    return () => handle?.remove();
  }, []);

  // ── Android geri tuşu ──────────────────────────────────────────────────────
  useEffect(() => {
    let handle: { remove: () => void } | null = null;

    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (window.location.hash && window.location.hash !== '#/') {
        if (canGoBack) window.history.back();
        else navigate('/', { replace: true });
        return;
      }
      // Kök ekrandayız → uygulamadan çık
      CapApp.exitApp();
    })
      .then((h) => {
        handle = h;
      })
      .catch(() => {});

    return () => handle?.remove();
  }, []);

  /*
    Sekme kökleri de KÖKTÜR.

    Önceki sürümde yalnız `/` kök sayılıyordu; Mevzuat, Yargı, Kitaplık ve
    Araçlar sekmelerine dokunup gelen kullanıcı çubukta bir geri oku
    buluyordu. Oysa oraya sekmeye basarak gelmişti, geri gidilecek bir yer
    yoktu; ok, tarayıcı geçmişindeki rastgele bir sayfaya götürüyordu.
    Sekme kökünde marka işareti durur, geri oku yalnız gerçekten içeri
    girildiğinde çıkar.
  */
  const atRoot = APP_TABS.some((t) => t.path === route.path);
  const bolum = sectionOf(route.path) ?? 'home';
  const bolumRengi = BOLUM_RENK[bolum] ?? BOLUM_RENK.home;
  const seritRengi = BOLUM_SERIT[bolum] ?? BOLUM_SERIT.home;
  const baslik = cubukBasligi(route.path, appName());

  /*
    Bölüm rengi köke yazılır; rozetler, vurgular ve başlık altındaki şerit
    aynı değişkenden beslenir. Böylece «neredeyim» sorusu tek bir kaynaktan
    cevaplanır ve bir bölüme yeni ekran eklendiğinde renk kendiliğinden
    doğru gelir.
  */
  useEffect(() => {
    document.documentElement.style.setProperty('--bolum', bolumRengi);
  }, [bolumRengi]);

  return (
    <div className="min-h-[100dvh] bg-cream flex flex-col">
      <header
        className="sticky top-0 z-30 text-white"
        style={{ background: 'var(--brand)' }}
      >
        <div className="flex items-center gap-1 px-2.5 h-14">
          {!atRoot ? (
            <button
              type="button"
              aria-label="Geri"
              className="w-11 h-11 grid place-items-center rounded-full tap"
              onClick={() => (window.history.length > 1 ? window.history.back() : navigate('/'))}
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : (
            /*
              Marka işareti — terazi ikonu, sitenin logosuyla aynı.

              Önceki sürüm § (paragraf işareti) kullanıyordu. Serif yüzde
              kıvrımlı bir harf küçük punto ve düşük çözünürlükte belirsiz
              duruyor, bir yılan kıvrımına benziyordu — okunaklı bir marka
              değil. Site zaten kendi logosunda `Scale` ikonunu kullanıyor
              (bkz. components/Navbar.tsx); iki yüzey artık aynı işareti
              taşıyor.
            */
            <span
              className="w-11 h-11 grid place-items-center shrink-0"
              aria-hidden
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="FG"
                role="img"
              >
                {/* F dikme */}
                <rect x="14" y="18" width="12" height="84" rx="1" fill="#fff" />
                {/* F üst serif */}
                <rect x="8" y="18" width="18" height="7" rx="1" fill="#fff" />
                {/* F alt serif */}
                <rect x="8" y="95" width="18" height="7" rx="1" fill="#fff" />
                {/* F üst çubuk */}
                <rect x="14" y="18" width="52" height="9" rx="1" fill="#fff" />
                <rect x="60" y="18" width="8" height="5" rx="1" fill="#fff" />
                {/* F orta çubuk — terazi çubuğu */}
                <rect x="14" y="52" width="56" height="7" rx="1" fill="#fff" />
                {/* Sol terazi */}
                <line x1="18" y1="59" x2="14" y2="74" stroke="#fff" strokeWidth="1.5" />
                <line x1="18" y1="59" x2="22" y2="74" stroke="#fff" strokeWidth="1.5" />
                <path d="M10 74 L26 74 L23 80 L13 80 Z" fill="#fff" opacity="0.85" />
                {/* Sağ terazi */}
                <line x1="66" y1="59" x2="62" y2="74" stroke="#fff" strokeWidth="1.5" />
                <line x1="66" y1="59" x2="70" y2="74" stroke="#fff" strokeWidth="1.5" />
                <path d="M58 74 L74 74 L71 80 L61 80 Z" fill="#fff" opacity="0.85" />
                {/* G ana kavsi */}
                <path
                  d="M100 30 C82 14, 54 20, 54 60 C54 100, 82 106, 100 90 L100 84 C86 96, 62 92, 62 60 C62 28, 86 22, 100 36 Z"
                  fill="#fff"
                />
                {/* G iç çubukları */}
                <rect x="82" y="56" width="24" height="8" rx="1" fill="#fff" />
                <rect x="98" y="56" width="8" height="36" rx="1" fill="#fff" />
                <rect x="92" y="86" width="18" height="6" rx="1" fill="#fff" />
              </svg>
            </span>
          )}

          <h1
            className={`flex-1 min-w-0 truncate ${
              atRoot
                ? 'font-heading font-bold text-[16px] tracking-tight'
                : 'font-heading font-semibold text-[15px]'
            } leading-tight`}
          >
            {baslik}
          </h1>

          <button
            type="button"
            aria-label="Paylaş"
            className="w-11 h-11 grid place-items-center rounded-full tap"
            onClick={() =>
              void share({
                title: appName(),
                text: `${appName()} — ${APP.short.tr}`,
                url: siteUrlFor(route.path),
              })
            }
          >
            <Share2 size={19} />
          </button>

          <button
            type="button"
            aria-label="Ayarlar"
            className="w-11 h-11 grid place-items-center rounded-full tap"
            onClick={() => navigate('/ayarlar')}
          >
            <Settings size={19} />
          </button>
        </div>

        {!online && (
          <div
            role="status"
            className="flex items-center gap-2 px-4 py-1.5 text-[12px] font-semibold bg-black/25"
          >
            <WifiOff size={13} aria-hidden />
            <span>Çevrimdışısınız — mevzuat, karar arşivi ve hesaplamalar cihazda çalışır.</span>
          </div>
        )}

        {/*
          Bölüm şeridi — kitabın kenarındaki fihrist sekmesi gibi.
          Başlık çubuğuyla sayfa arasındaki tek çizgi, hangi bölümde
          olunduğunu renkle söyler.
        */}
        <div
          aria-hidden
          className="h-[3px] w-full transition-colors duration-300"
          style={{ background: seritRengi }}
        />
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
