/**
 * Grafik paleti (Aylık plan G17) — dataviz yöntemi, site jetonları (`lib/tasarim-jetonlari.mjs`).
 *
 * Tek serili çubuk ve sütun grafiği `GRAFIK.isaret` ile çizilir; adlandırılmış kategoriler değerine göre boyanmaz.
 * `KATEGORIK` yalnız yığılmış dökümde kullanılır ve sırası değiştirilmez: Sıra, dataviz doğrulayıcısından
 * (`validate_palette.js --mode light`, `#FFFEFA` zemin) geçen sıradır (çıktı `docs/aylik-plan/raporlar/g17-grafikler.md`).
 * Üçüncü renk zeminde 2,79:1 verdiği için onu kullanan grafikte görünür etiket ya da tablo görünümü zorunludur.
 * Sitede karanlık kip yoktur; kömür zeminde grafik çizilecekse palet `--mode dark` ile ayrıca doğrulanır.
 */
import { RENKLER } from './tasarim-jetonlari.mjs';

export const KATEGORIK = [RENKLER.accent.DEFAULT, '#2a78d6', '#1baf7a'];

export const GRAFIK = {
  isaret: RENKLER.accent.DEFAULT,
  metin: RENKLER.charcoal,
  ikincilMetin: RENKLER.ink.muted,
  eksen: '#C9C6BD',
  izgara: '#E4E1D8',
  zemin: RENKLER.surface,
};
