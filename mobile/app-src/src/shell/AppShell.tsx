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
              Marka işareti. Paragraf işareti (§) hukuk metninin kendi
              tipografik damgasıdır; ikon kütüphanesinden ödünç alınmış bir
              sembol değil. Serif yüzde ve ince bir halka içinde dizilince
              yedek karakter gibi değil, çizilmiş bir marka gibi durur.
            */
            <span
              className="w-11 h-11 grid place-items-center shrink-0"
              aria-hidden
            >
              <span className="w-9 h-9 grid place-items-center rounded-full border border-white/25 bg-white/[0.10] font-serif text-[19px] leading-none pt-[1px]">
                §
              </span>
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
