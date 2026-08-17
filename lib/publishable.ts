/**
 * Yayınlanabilir içerik listesi.
 *
 * `scripts/build-publishable-manifest.mjs` prebuild'de üretir; burada
 * yalnızca okunur. Amaç: site haritası üretilirken 46 içerik paketini
 * açıp yüz megabaytlarca metni belleğe almamak.
 *
 * Manifest bulunamazsa liste boş döner ve çağıran taraf "hiçbiri
 * yayınlanabilir değil" varsayar. Bu bilinçli olarak güvenli taraftır:
 * eksik manifest yüzünden kalıp metinlerin sessizce indekse dönmesi,
 * eksik site haritasından çok daha pahalıdır.
 */

type Manifest = {
  generatedAt: string;
  counts: { mevzuat: number; rehber: number; dersNotlari: number };
  mevzuat: string[];
  rehber: string[];
  dersNotlari: string[];
};

const EMPTY: Manifest = {
  generatedAt: '',
  counts: { mevzuat: 0, rehber: 0, dersNotlari: 0 },
  mevzuat: [],
  rehber: [],
  dersNotlari: [],
};

let cache: Manifest | null = null;

function load(): Manifest {
  if (cache) return cache;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path') as typeof import('path');
    const p = path.join(
      /* turbopackIgnore: true */ process.cwd(),
      'public/data/publishable.json'
    );
    if (fs.existsSync(p)) {
      cache = JSON.parse(fs.readFileSync(p, 'utf8')) as Manifest;
      return cache;
    }
  } catch {
    /* derleme dışı ortam */
  }
  cache = EMPTY;
  return cache;
}

/** `tmk/madde-1` biçiminde anahtar kümesi. */
export function publishableMevzuat(): Set<string> {
  return new Set(load().mevzuat);
}

export function publishableRehber(): Set<string> {
  return new Set(load().rehber);
}

export function publishableDersNotlari(): Set<string> {
  return new Set(load().dersNotlari);
}

export function publishableCounts() {
  return load().counts;
}
