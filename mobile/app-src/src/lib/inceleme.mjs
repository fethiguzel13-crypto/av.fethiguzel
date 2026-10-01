/**
 * Mağaza inceleme erişim kodu — doğrulama.
 *
 * Kod paketin içinde düz metin olarak durmaz. Derleme kodu git dışı bir
 * dosyadan (`mobile/inceleme-kodu.local.txt`) ya da `INCELEME_KODU` ortam
 * değişkeninden okur, pakete yalnız tuzlu SHA-256 özetini gömer (bkz.
 * scripts/build-app.mjs). Önceki sürümde kod kaynakta yazılıydı; depo herkese
 * açık olduğu için ücretli tam metin kodu okuyan herkese açılıyordu (G05/M1).
 *
 * Kod 80 bit rastgelelik taşır; özetten geriye kaba kuvvetle bulunamaz.
 * Paketi değiştirip denetimi atlamak hâlâ mümkündür, o sınır bilinçlidir
 * (docs/UYELIK.md → «Dürüst sınır»).
 *
 * Saf JavaScript: hem WebView'da hem düğüm testlerinde ve derleme betiğinde
 * aynı özet hesaplansın diye. Türler: inceleme.d.ts
 */

const TUZ = 'fg-inceleme-v1:';

/** Okunaklı alfabe: 0/O, 1/I/L ve U yok (Crockford). 32 harf = 5 bit. */
const ALFABE = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function normallestir(kod) {
  return String(kod ?? '').replace(/\s+/g, '').toUpperCase();
}

/** Kodun derlemeye gömülen özeti (64 haneli onaltılık). */
export async function incelemeOzeti(kod) {
  const veri = new TextEncoder().encode(TUZ + normallestir(kod));
  const ozet = new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', veri));
  return Array.from(ozet, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Girilen kod derlemedeki özetle eşleşiyor mu?
 * Özet yoksa (kod tanımlanmadan derlenmiş paket) özellik kapalıdır.
 */
export async function incelemeKoduGecerli(kod, ozet) {
  if (!/^[0-9a-f]{64}$/.test(String(ozet ?? ''))) return false;
  if (!normallestir(kod)) return false;
  return (await incelemeOzeti(kod)) === ozet;
}

/** Yeni kod: FG-XXXX-XXXX-XXXX-XXXX (16 harf × 5 bit = 80 bit). */
export function yeniIncelemeKodu() {
  const bayt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const harfler = Array.from(bayt, (b) => ALFABE[b & 31]).join('');
  return `FG-${harfler.match(/.{4}/g).join('-')}`;
}
