import { gunzipSync, strFromU8 } from 'fflate';

/**
 * Şifreli karar kasası.
 *
 * Karar tam metinleri pakete AES-256-GCM ile şifrelenmiş girer
 * (scripts/build-yargi-sifrele.mjs). Burada çözülürler.
 *
 * Anahtar dört parça hâlinde ve maskelenmiş olarak derleme değişkenlerinden
 * gelir; paket içinde bütün hâlde hiçbir yerde bulunmaz. Parçalar
 * birleştirilip PBKDF2 ile asıl anahtar türetilir.
 *
 * Bunun sunucu tarafı bir hak yönetimi olmadığı açıktır: uygulama çevrimdışı
 * çalıştığı için anahtar da cihazdadır. Sağladığı şey, APK'yı açan birinin
 * metinleri doğrudan okuyamamasıdır — sıradan kopyalamayı durdurur,
 * kararlı bir tersine mühendisi durdurmaz.
 */

declare const __KASA_PARCA__: string[];
declare const __KASA_TUZ__: string;
declare const __KASA_TUR__: number;

const MASKE = [0x3b, 0x91, 0x5d, 0xc7];

function parcalar(): string[] {
  return typeof __KASA_PARCA__ !== 'undefined' && Array.isArray(__KASA_PARCA__)
    ? __KASA_PARCA__
    : [];
}

function tuz(): string {
  return typeof __KASA_TUZ__ === 'string' ? __KASA_TUZ__ : '';
}

function tur(): number {
  return typeof __KASA_TUR__ === 'number' ? __KASA_TUR__ : 100000;
}

/** Kasa bu derlemede var mı? Yoksa şifresiz parçalara düşülür. */
export function kasaVarMi(): boolean {
  return parcalar().length === 4 && !!tuz();
}

function b64Coz(s: string): Uint8Array {
  const ham = atob(s);
  const out = new Uint8Array(ham.length);
  for (let i = 0; i < ham.length; i += 1) out[i] = ham.charCodeAt(i);
  return out;
}

let anahtarSozu: Promise<CryptoKey> | null = null;

async function anahtar(): Promise<CryptoKey> {
  if (anahtarSozu) return anahtarSozu;

  anahtarSozu = (async () => {
    const p = parcalar();
    if (p.length !== 4) throw new Error('kasa anahtarı eksik');

    // Parçaları maskeden arındırıp birleştir
    const sir = new Uint8Array(32);
    for (let i = 0; i < 4; i += 1) {
      const dilim = b64Coz(p[i]);
      for (let j = 0; j < dilim.length; j += 1) sir[i * 8 + j] = dilim[j] ^ MASKE[i];
    }

    const taban = await crypto.subtle.importKey('raw', sir, 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode(tuz()),
        iterations: tur(),
        hash: 'SHA-256',
      },
      taban,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
  })();

  return anahtarSozu;
}

/**
 * Şifreli parçayı çözer ve içindeki JSON'u döndürür.
 *
 * Biçim: [12 bayt IV][16 bayt etiket][şifreli gzip gövde]
 * GCM etiketi WebCrypto'da gövdenin SONUNA eklenmiş beklenir, bu yüzden
 * yeniden birleştirilir.
 */
export async function kasadanCoz<T>(bayt: ArrayBuffer): Promise<T> {
  const veri = new Uint8Array(bayt);
  if (veri.length < 29) throw new Error('kasa parçası bozuk');

  const iv = veri.subarray(0, 12);
  const etiket = veri.subarray(12, 28);
  const govde = veri.subarray(28);

  const birlesik = new Uint8Array(govde.length + etiket.length);
  birlesik.set(govde, 0);
  birlesik.set(etiket, govde.length);

  const cozulen = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    await anahtar(),
    birlesik
  );

  return JSON.parse(strFromU8(gunzipSync(new Uint8Array(cozulen)))) as T;
}
