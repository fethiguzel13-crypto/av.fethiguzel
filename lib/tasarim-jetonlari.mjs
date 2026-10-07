/**
 * Renk jetonları — tek kaynak (G15). `tailwind.config.ts` buradan okur, kontrastı `lib/__tests__/tasarim-jeton.test.mjs` sınar.
 *
 * Marka paleti (primary, accent, cream, charcoal, surface) değişmez. G15 denetimi, ikincil metnin saydamlıkla
 * (`text-charcoal/40` vb.) ve küçük etiketlerin vurgu turuncusuyla krem zeminde AA'nın altında kaldığını ölçmüştür
 * (`docs/aylik-plan/raporlar/tasarim-denetimi.md`). Metin için düz tonlar bu yüzden ayrı jetondur:
 *   - `ink-muted`: açık zeminde ikincil metin (bugünkü `charcoal/65` görünümü, en az 4,94:1).
 *   - `accent-ink`: açık zeminde vurgu rengi metin ve beyaz yazılı düğme zemini (en az 4,76:1).
 *   - `accent-light`: kömür ve koyu kart zeminde vurgu rengi metin (en az 4,61:1).
 * Dolgu, kenar ve büyük başlıkta `accent` olduğu gibi kullanılır.
 */
export const RENKLER = {
  primary: '#2E4036',
  accent: {
    DEFAULT: '#CC5833',
    ink: '#A7482A',
    light: '#D47354',
  },
  ink: {
    muted: '#636360',
  },
  cream: '#F2F0E9',
  charcoal: '#1A1A1A',
  surface: '#FFFEFA',
};

/** Kömür bölümlerin içindeki koyu kart zeminleri (G15 ölçümü). */
export const KOYU_ZEMINLER = ['#1A1A1A', '#232322', '#252524', '#2A2520'];

/** Sitede metnin üzerinde durduğu açık zeminler (G15 ölçümünde görülen krem tonları dahil). */
export const ACIK_ZEMINLER = ['#F2F0E9', '#FFFEFA', '#FFFFFF', '#EEECE5', '#F0E7DE', '#F9F8F4', '#FAEEEB'];

const parlaklik = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const d = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * d(r) + 0.7152 * d(g) + 0.0722 * d(b);
};

/** WCAG 2.x kontrast oranı, iki `#RRGGBB` renk arasında. */
export function kontrastOrani(on, zemin) {
  const a = parlaklik(on);
  const b = parlaklik(zemin);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
