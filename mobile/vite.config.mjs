import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import tailwindConfig from './tailwind.config.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const portal = resolve(here, '..');

/** Flavor kimliği → uygulama kökü dosyası */
const ROOTS = {
  // Birleşik uygulama: dört bölümü tek kabukta barındırır.
  asistan: 'AsistanApp.tsx',
  portal: 'PortalApp.tsx',
  hesap: 'HesapApp.tsx',
  icthat: 'IcthatApp.tsx',
  rehber: 'RehberApp.tsx',
};

/**
 * Galaxy çevrimdışı uygulama derlemesi.
 *
 * Tek kaynak ağacından dört uygulama çıkar; hangisinin derlendiğini
 * GALAXY_APP ortam değişkeni belirler (scripts/build-app.mjs bunu ayarlar).
 *
 * Portal (Next.js) bileşenleri olduğu gibi kullanılabilsin diye `@/…`
 * takma adları portal köküne bağlanır; Next.js'e özgü iki modül
 * (`next/link`, Navbar/Footer) yerel kabuk karşılıklarıyla değiştirilir.
 * Böylece 33 hesaplama aracı gibi test edilmiş kod yeniden yazılmaz.
 */
export default defineConfig(() => {
  const app = process.env.GALAXY_APP || 'portal';
  if (!ROOTS[app]) {
    throw new Error(`Bilinmeyen GALAXY_APP: ${app} (geçerli: ${Object.keys(ROOTS).join(', ')})`);
  }

  return {
    root: resolve(here, 'app-src'),
    base: './',
    plugins: [react()],
    // PostCSS zinciri burada, doğrudan verilir. Dosyadan keşif, Vite kökü
    // app-src olduğu için yapılandırmayı bulamıyor ve Tailwind sessizce
    // varsayılan paletle çalışıyordu (marka renkleri "class does not exist").
    css: {
      postcss: {
        plugins: [tailwindcss(tailwindConfig), autoprefixer()],
      },
    },
    define: {
      __GALAXY_APP__: JSON.stringify(app),
      __GALAXY_BUILT_AT__: JSON.stringify(process.env.GALAXY_BUILT_AT || ''),
      // Giriş ekranındaki sayılar; build-app.mjs gerçek veriden hesaplar.
      __GALAXY_STATS__: process.env.GALAXY_STATS || '{}',
      /*
        Karar kasasının anahtar parçaları.

        build-yargi-sifrele.mjs her derlemede yeni bir anahtar üretir,
        dörde bölüp maskeler; parçalar buradan pakete girer. Anahtar
        bütün hâlde hiçbir dosyada bulunmaz (bkz. app-src/src/lib/kasa.ts).
      */
      __KASA_PARCA__: process.env.KASA_PARCA || '[]',
      __KASA_TUZ__: JSON.stringify(process.env.KASA_TUZ || ''),
      __KASA_TUR__: Number(process.env.KASA_TUR || 100000),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    },
    resolve: {
      alias: [
        // Yalnız derlenen uygulamanın kökü paketlenir. Dört kökü birden
        // içe aktarmak, hesap uygulamasına 6 MB'lık rehber verisini de
        // sokuyordu.
        {
          find: /^@galaxy-root$/,
          replacement: resolve(here, `app-src/src/apps/${ROOTS[app]}`),
        },
        // Next.js kabuk bileşenleri → mobil kabuk karşılıkları
        { find: /^next\/link$/, replacement: resolve(here, 'app-src/src/shims/Link.tsx') },
        { find: /^next\/image$/, replacement: resolve(here, 'app-src/src/shims/Image.tsx') },
        { find: /^next\/navigation$/, replacement: resolve(here, 'app-src/src/shims/navigation.ts') },
        { find: /^@\/components\/Navbar$/, replacement: resolve(here, 'app-src/src/shims/Navbar.tsx') },
        { find: /^@\/components\/Footer$/, replacement: resolve(here, 'app-src/src/shims/Footer.tsx') },
        // Geri kalan @/… portal köküne
        { find: /^@\//, replacement: `${portal.replace(/\\/g, '/')}/` },
      ],
    },
    build: {
      outDir: resolve(here, 'flavors', app, 'www'),
      emptyOutDir: true,
      target: 'es2020',
      sourcemap: false,
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
              return 'react';
            }
            if (id.includes('node_modules/lucide-react')) return 'icons';
            // Büyük veri modülleri ayrı parçalara — ilk açılış hızlansın
            if (id.includes('/lib/vatandas-rehberi/')) return 'data-rehber';
            if (id.includes('/lib/kavramlar')) return 'data-kavram';
            if (id.includes('/lib/hesaplama-meta')) return 'data-hesap';
            return undefined;
          },
        },
      },
    },
    server: { port: 5177, strictPort: false },
  };
});
