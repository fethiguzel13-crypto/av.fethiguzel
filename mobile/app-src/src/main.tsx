import React, { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

import './app.css';
import { APP, APP_ID, appName } from './lib/config';
import { navigate } from './lib/router';
import { pathFromDeepLink } from './lib/deeplink';
import AppShell from './shell/AppShell';
import ErrorBoundary from './shell/ErrorBoundary';

/*
  Uygulama kökü derleme anında sabitlenir.

  `@galaxy-root` takma adı vite.config.mjs içinde GALAXY_APP'a göre tek bir
  dosyaya bağlanır. Dört kökü birden içe aktarmak, Rollup'a hepsini analiz
  ettirip hesap uygulamasının paketine 6 MB'lık rehber verisini sokuyordu.
*/
// @ts-expect-error — takma ad derleme anında çözülür
const Root = lazy(() => import('@galaxy-root'));

// ── Marka rengi ──────────────────────────────────────────────────────────────
function applyBrand() {
  const el = document.documentElement;
  el.style.setProperty('--brand', APP.accent);
  el.style.setProperty('--brand-dark', shade(APP.accent, -0.25));
  el.style.setProperty('--brand-soft', hexToRgba(APP.accent, 0.08));

  const meta = document.getElementById('theme-color');
  if (meta) meta.setAttribute('content', APP.accent);
  document.title = appName();

  const boot = document.getElementById('boot');
  if (boot) boot.style.background = APP.accent;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, '$1$1') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function shade(hex: string, amount: number): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, '$1$1') : h, 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 255) * (1 + amount));
  const g = clamp(((n >> 8) & 255) * (1 + amount));
  const b = clamp((n & 255) * (1 + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// ── Native köprü ─────────────────────────────────────────────────────────────
async function initNative() {
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: APP.accent });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch {
    /* tarayıcıda çalışıyoruz */
  }

  // Derin bağlantı: uygulama açıkken gelen avfethiguzel-*:// veya https://
  CapApp.addListener('appUrlOpen', ({ url }) => {
    const path = pathFromDeepLink(url);
    if (path) navigate(path);
  }).catch(() => {});

  // Soğuk açılışta gelen bağlantı
  CapApp.getLaunchUrl()
    .then((res) => {
      if (!res?.url) return;
      const path = pathFromDeepLink(res.url);
      if (path) navigate(path, { replace: true });
    })
    .catch(() => {});

  try {
    await SplashScreen.hide();
  } catch {
    /* yok sayılır */
  }
}

// ── Montaj ───────────────────────────────────────────────────────────────────
applyBrand();

const container = document.getElementById('root');
if (!container) throw new Error('#root bulunamadı');

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <AppShell>
        <Suspense fallback={<ShellSkeleton />}>
          <Root />
        </Suspense>
      </AppShell>
    </ErrorBoundary>
  </StrictMode>
);

function ShellSkeleton() {
  return (
    <div className="page space-y-3" aria-busy="true" aria-label="Yükleniyor">
      <div className="skeleton h-8 w-2/3 rounded-lg" />
      <div className="skeleton h-24 rounded-2xl" />
      <div className="skeleton h-24 rounded-2xl" />
      <div className="skeleton h-24 rounded-2xl" />
    </div>
  );
}

// React monte olur olmaz açılış katmanını kaldır
requestAnimationFrame(() => {
  const boot = document.getElementById('boot');
  if (boot) boot.remove();
});

void initNative();
