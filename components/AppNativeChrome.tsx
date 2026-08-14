'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCapPlugin, isNativeApp } from '@/lib/native-app';
import MobileBottomNav from '@/components/MobileBottomNav';

/**
 * Native Android kabuğu + mobil alt menü.
 * - Geri tuşu: geçmiş varsa geri, yoksa uygulamadan çık
 * - Çevrimdışı şeridi
 * - Safe-area ve alt menü boşluğu
 */
export default function AppNativeChrome() {
  const router = useRouter();
  const pathname = usePathname();
  const [native, setNative] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const on = isNativeApp();
    setNative(on);
    document.documentElement.classList.toggle('app-native', on);
    document.documentElement.classList.add('app-mobile-chrome');

    // Status bar (varsa)
    if (on) {
      const StatusBar = getCapPlugin<{
        setBackgroundColor?: (o: { color: string }) => Promise<void>;
        setStyle?: (o: { style: string }) => Promise<void>;
      }>('StatusBar');
      StatusBar?.setBackgroundColor?.({ color: '#2E4036' }).catch(() => {});
      StatusBar?.setStyle?.({ style: 'DARK' }).catch(() => {});
    }

    return () => {
      document.documentElement.classList.remove('app-native', 'app-mobile-chrome');
    };
  }, []);

  // Donanım geri tuşu
  useEffect(() => {
    if (!native) return;
    const App = getCapPlugin<{
      addListener: (
        event: string,
        cb: (data: { canGoBack: boolean }) => void
      ) => Promise<{ remove: () => void }> | { remove: () => void };
      exitApp?: () => void;
    }>('App');
    if (!App?.addListener) return;

    let handle: { remove: () => void } | null = null;
    const bind = async () => {
      const h = await App.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack || window.history.length > 1) {
          window.history.back();
        } else if (pathname !== '/') {
          router.push('/');
        } else {
          App.exitApp?.();
        }
      });
      handle = h;
    };
    bind();
    return () => {
      try {
        handle?.remove();
      } catch {
        /* ignore */
      }
    };
  }, [native, pathname, router]);

  // Çevrimiçi / çevrimdışı
  useEffect(() => {
    const sync = () => setOffline(typeof navigator !== 'undefined' && !navigator.onLine);
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);

    const Network = getCapPlugin<{
      addListener: (
        e: string,
        cb: (s: { connected: boolean }) => void
      ) => Promise<{ remove: () => void }> | { remove: () => void };
      getStatus?: () => Promise<{ connected: boolean }>;
    }>('Network');

    let nHandle: { remove: () => void } | null = null;
    if (Network) {
      Network.getStatus?.()
        .then((s) => setOffline(!s.connected))
        .catch(() => {});
      Promise.resolve(
        Network.addListener('networkStatusChange', (s) => setOffline(!s.connected))
      ).then((h) => {
        nHandle = h;
      });
    }

    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
      try {
        nHandle?.remove();
      } catch {
        /* ignore */
      }
    };
  }, []);

  return (
    <>
      {offline && (
        <div
          role="status"
          className="fixed top-0 inset-x-0 z-[70] bg-charcoal text-cream text-center text-xs sm:text-sm font-medium py-2 px-3"
          style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
        >
          Çevrimdışısınız. Mevzuat ve hesaplama için internet gerekir — bağlantı gelince
          yenileyin.
        </div>
      )}
      <MobileBottomNav />
    </>
  );
}
