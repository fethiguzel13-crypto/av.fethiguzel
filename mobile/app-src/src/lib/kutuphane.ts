import { gunzipSync, strFromU8 } from 'fflate';
import { GZ } from './varlik';

/**
 * Akademik eserler — makalelerin cihazda okunabilir hâli.
 *
 * Metin derleme anında .docx/.pdf dosyalarından çıkarılır
 * (scripts/build-kutuphane.mjs). Uygulama harici bir okuyucuya düşmez;
 * eser kendi okuma görünümünde, çevrimdışı açılır.
 */

export type Eser = {
  slug: string;
  baslik: string;
  kategori: string;
  ozet: string;
  paragraflar: string[];
  kelime: number;
  kaynakBiçim: string;
  bayt: number;
};

let cache: Eser[] | null = null;
let inflight: Promise<Eser[]> | null = null;

export function loadEserler(): Promise<Eser[]> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;

  inflight = fetch(`./kutuphane/eserler.json${GZ}`)
    .then(async (res) => {
      if (!res.ok) throw new Error(String(res.status));
      const buf = new Uint8Array(await res.arrayBuffer());
      return JSON.parse(strFromU8(gunzipSync(buf))) as Eser[];
    })
    .then((list) => {
      cache = Array.isArray(list) ? list : [];
      return cache;
    })
    .catch(() => {
      cache = [];
      return cache;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** Okuma süresi — dakikada ~200 kelime, hukuk metninde daha yavaş sayılır. */
export function okumaSuresi(kelime: number): string {
  const dk = Math.max(1, Math.round(kelime / 180));
  return `${dk} dk okuma`;
}
