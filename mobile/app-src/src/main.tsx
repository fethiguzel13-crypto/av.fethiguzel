import React, { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * Marka fontları — kendi barındırılan (self-hosted).
 *
 * Bu uygulama çevrimdışı çalışmak zorunda (Play mağaza politikası bunu
 * istiyor); bir CDN'den font çekmek yanlış çözüm olurdu. `@fontsource`
 * paketleri woff2 dosyalarını doğrudan pakete gömer, Vite derleme
 * çıktısına kopyalar.
 *
 * ★ İKİ alt küme de gerekir: `latin` VE `latin-ext`.
 *
 * Burada bir kez `latin-ext` tek başına yüklendi; gerekçe «Türkçe İ/ğ/Ş
 * temel Latin kümesinde yok» idi ve doğruydu. Yanlış olan, `latin-ext`in
 * `latin`i KAPSADIĞI varsayımıydı. İkisi kapsayan-kapsanan değil, ayrık
 * kümedir: `latin-ext` yalnız U+0100 sonrasını taşır, A–Z ve a–z hiç
 * yoktur.
 *
 * Sonuç ölçüldü: «Hukuk» kelimesi Plus Jakarta Sans ile de düz serif ile
 * de 108,9 piksel geliyordu — yani marka fontu temel Latin harflerinde hiç
 * uygulanmıyor, işletim sisteminin yedek yüzü çiziyordu. Yalnız «Şşğİ»
 * doğru yüzden geliyordu. Türkçe metinde aksanlı harf her kelimede
 * bulunduğu için ekrandaki her satır iki ayrı yazı tipinin karışımıydı;
 * harf genişlikleri tutmadığı için tek boşluklu etiketlerde aralık da
 * bozuluyordu.
 *
 * Portalın kendi yüklemesi baştan doğruydu (`app/layout.tsx` →
 * `subsets: ['latin', 'latin-ext']`); mobil taraf ondan ayrılmıştı.
 *
 * Ağırlıklar kod tabanında GERÇEKTEN kullanılanlarla sınırlı — kullanılmayan
 * ağırlık indirmek çevrimdışı bir uygulamada saf israf.
 *
 * Lora (serif) kanun ve karar METNİ içindir. Uzun hukuk metnini gövde
 * fontuyla dizmek, telefonda dakikalarca okunan madde metnini yorucu
 * kılıyordu; serif satır boyunca gözü taşır ve resmî metni arayüz
 * metninden görsel olarak ayırır — hukukçunun "burası kanunun kendisi"
 * demesi için tipografiden başka işaret yok.
 *
 * Cormorant Garamond ("drama") bilinçli olarak YOK: küçük punto ve düşük
 * kontrastta ekranda dağılıyor, gövde metni için uygun değil.
 */
import '@fontsource/plus-jakarta-sans/latin-400.css';
import '@fontsource/plus-jakarta-sans/latin-ext-400.css';
import '@fontsource/plus-jakarta-sans/latin-500.css';
import '@fontsource/plus-jakarta-sans/latin-ext-500.css';
import '@fontsource/plus-jakarta-sans/latin-600.css';
import '@fontsource/plus-jakarta-sans/latin-ext-600.css';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import '@fontsource/plus-jakarta-sans/latin-ext-700.css';
import '@fontsource/outfit/latin-500.css';
import '@fontsource/outfit/latin-ext-500.css';
import '@fontsource/outfit/latin-600.css';
import '@fontsource/outfit/latin-ext-600.css';
import '@fontsource/outfit/latin-700.css';
import '@fontsource/outfit/latin-ext-700.css';
import '@fontsource/lora/latin-400.css';
import '@fontsource/lora/latin-ext-400.css';
import '@fontsource/lora/latin-500.css';
import '@fontsource/lora/latin-ext-500.css';
import '@fontsource/lora/latin-600.css';
import '@fontsource/lora/latin-ext-600.css';
import '@fontsource/lora/latin-400-italic.css';
import '@fontsource/lora/latin-ext-400-italic.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-ext-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-ext-500.css';
import '@fontsource/ibm-plex-mono/latin-600.css';
import '@fontsource/ibm-plex-mono/latin-ext-600.css';
// 700: rozetler ve kanun kodu çipleri `font-mono font-bold` ile diziliyor.
// Yüz yoksa tarayıcı sahte kalın üretir; tek boşluklu bir yüzde bu, harf
// gövdesini şişirip ızgarayı bozar.
import '@fontsource/ibm-plex-mono/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-ext-700.css';

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
/*
  İki ayrı renk rolü.

  Önceki sürümde tek bir `accent` hem vurguyu hem kabuğu sürüklüyordu; asistan
  uygulamasında o değer orman yeşiliydi ve sonuç, baştan sona resesif yeşile
  boyanmış bir arayüzdü. Site ise iki rolü ayırır: kabuk kömür siyahı
  (`chrome`), vurgu ise kiremit turuncusu (`accent`) — kararlı kontrast
  oradan gelir.

  `chrome` tanımlı değilse eski davranış korunur: kabuk da vurgu rengini alır.
*/
function applyBrand() {
  const el = document.documentElement;
  const kabuk = APP.chrome || APP.accent;

  el.style.setProperty('--brand', APP.accent);
  el.style.setProperty('--brand-dark', shade(APP.accent, -0.25));
  el.style.setProperty('--brand-soft', hexToRgba(APP.accent, 0.08));
  el.style.setProperty('--cubuk', kabuk);

  const meta = document.getElementById('theme-color');
  if (meta) meta.setAttribute('content', kabuk);
  document.title = appName();

  const boot = document.getElementById('boot');
  if (boot) boot.style.background = kabuk;
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
    await StatusBar.setBackgroundColor({ color: APP.chrome || APP.accent });
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
