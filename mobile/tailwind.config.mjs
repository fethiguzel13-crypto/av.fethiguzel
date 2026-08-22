import typography from '@tailwindcss/typography';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const portal = join(here, '..');

/**
 * Portal ile aynı marka paleti — mobil uygulama sitenin devamı gibi görünsün.
 *
 * content yolları MUTLAK: portalın components/ ve lib/ klasörleri de taranır,
 * çünkü çevrimdışı uygulama o bileşenleri doğrudan içe aktarıyor. Göreli yol
 * verilince Vite kökü (app-src) esas alınıyor ve sınıflar bulunamıyordu.
 */
export default {
  content: [
    join(here, 'app-src/index.html'),
    join(here, 'app-src/src/**/*.{js,ts,jsx,tsx}'),
    join(portal, 'components/**/*.{js,ts,jsx,tsx}'),
    join(portal, 'lib/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E4036',
        accent: '#CC5833',
        cream: '#F2F0E9',
        charcoal: '#1A1A1A',
        surface: '#FFFEFA',
        // Flavor vurgusu CSS değişkeninden gelir (app-src/src/app.css)
        brand: 'var(--brand)',
        'brand-dark': 'var(--brand-dark)',
        /*
          Mürekkep basamakları — ölçülmüş kontrastla.
          Krem zeminde: ink 12,4:1 · ink-2 6,8:1 · ink-3 4,9:1
          ink-4 METİN İÇİN DEĞİLDİR (2,9:1); çizgi ve pasif ikon içindir.
        */
        ink: 'var(--ink-1)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        'ink-4': 'var(--ink-4)',
        kagit: 'var(--kagit)',
        tel: 'var(--tel)',
        bolum: 'var(--bolum)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
        drama: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        // Kanun ve karar metni — arayüzden ayrışsın diye serif
        serif: ['Lora', 'Georgia', '"Times New Roman"', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(26, 26, 26, 0.08), 0 1px 3px rgba(26, 26, 26, 0.04)',
        lift: '0 20px 50px -16px rgba(26, 26, 26, 0.14), 0 4px 12px rgba(26, 26, 26, 0.06)',
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      },
    },
  },
  plugins: [typography],
};
