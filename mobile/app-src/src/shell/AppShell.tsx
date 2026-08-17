import React, { useEffect, useState } from 'react';
import { App as CapApp } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { WifiOff, Share2, Settings } from 'lucide-react';

import { APP, appName } from '../lib/config';
import { useRoute, navigate } from '../lib/router';
import { share } from '../lib/external';
import { siteUrlFor } from '../lib/deeplink';
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

  const atRoot = route.path === '/';

  return (
    <div className="min-h-[100dvh] bg-cream flex flex-col">
      <header
        className="sticky top-0 z-30 text-white"
        style={{ background: 'var(--brand)' }}
      >
        <div className="flex items-center gap-2 px-3 h-14">
          {!atRoot ? (
            <button
              type="button"
              aria-label="Geri"
              className="w-10 h-10 -ml-1 grid place-items-center rounded-full tap"
              onClick={() => (window.history.length > 1 ? window.history.back() : navigate('/'))}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : (
            <span className="w-9 h-9 grid place-items-center rounded-xl bg-white/[0.12] text-base font-bold" aria-hidden>
              §
            </span>
          )}

          <h1 className="flex-1 font-heading font-bold text-[15px] leading-tight truncate">
            {appName()}
          </h1>

          <button
            type="button"
            aria-label="Paylaş"
            className="w-10 h-10 grid place-items-center rounded-full tap"
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
            className="w-10 h-10 grid place-items-center rounded-full tap"
            onClick={() => navigate('/ayarlar')}
          >
            <Settings size={19} />
          </button>
        </div>

        {!online && (
          <div
            role="status"
            className="flex items-center gap-2 px-4 py-1.5 text-[11.5px] font-semibold bg-black/25"
          >
            <WifiOff size={13} aria-hidden />
            <span>Çevrimdışısınız — indirilmiş içerik ve hesaplamalar çalışmaya devam eder.</span>
          </div>
        )}
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
