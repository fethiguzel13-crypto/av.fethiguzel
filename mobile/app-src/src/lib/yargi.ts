import { gunzipSync, strFromU8 } from 'fflate';

import { kasaVarMi, kasadanCoz } from './kasa';
import { erisimVar } from './uyelik';

/**
 * Yargıtay arşivi — indeks + parça parça tam metin.
 *
 * İndeks uygulamayla gelir. Tam metin, karar açıldığında ilgili parçadan
 * okunur; böylece 20 bin kararın hepsi ilk karede belleğe girmez.
 */

export type ArchiveRow = {
  /** id */
  i: string;
  /** künye */
  k: string;
  /** alan */
  a: string;
  /** tarih */
  t: string;
  /** daire */
  d: string;
  /** anahtar kelimeler */
  w: string[];
  /** slug */
  s: string;
  /** kademe: yibk | hgk | cgk | … */
  r?: string;
  /** özet */
  e?: string;
  /** yıl */
  y?: string;

  /*
    Aşağıdakiler derleme anında karar METNİNDEN çıkarılır
    (scripts/build-yargi-index.mjs). Arşiv listesini künye duvarı olmaktan
    çıkaran alanlar bunlardır; hepsi isteğe bağlıdır, çünkü her kararda
    çıkarılamıyor — çıkarılamayanda satır künyeyle yetinir.
  */
  /** konu başlıkları — «Kamulaştırmasız elatma nedeniyle tazminat» */
  j?: string[];
  /** dava türü — künyedeki tırnak içi ifade */
  v?: string;
  /** ilk derece mahkemesi */
  h?: string;
  /** tam metnin karakter sayısı — okuma süresi ve indirme göstergesi */
  c?: number;
  /** atıf yapılan maddeler — «tck/103» biçiminde */
  m?: string[];
};

export const TIER_LABEL: Record<string, string> = {
  yibk: 'İçtihadı Birleştirme',
  hgk: 'Hukuk Genel Kurulu',
  cgk: 'Ceza Genel Kurulu',
  hdbk: 'Hukuk Daireleri Başkanlar Kurulu',
  borclar: 'Borçlar',
  medeni: 'Medeni',
  is_sgk: 'İş / SGK',
  icra: 'İcra',
  ceza: 'Ceza',
  diger: 'Diğer',
};

export const TIER_ORDER = [
  'yibk',
  'hgk',
  'cgk',
  'hdbk',
  'borclar',
  'medeni',
  'is_sgk',
  'icra',
  'ceza',
];

export function tierLabel(tier?: string): string {
  if (!tier) return '';
  return TIER_LABEL[tier] || tier;
}

export function officialUrl(id: string): string {
  return `https://karararama.yargitay.gov.tr/getDokuman?id=${id}`;
}

const SHARD_COUNT = 80;

export function shardOf(id: string): number {
  let h = 0;
  const s = String(id);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % SHARD_COUNT;
}

function shardName(n: number): string {
  return `s${String(n).padStart(2, '0')}.json.gz`;
}

async function gunzipJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  return JSON.parse(strFromU8(gunzipSync(buf))) as T;
}

let archiveCache: ArchiveRow[] | null = null;
let archiveInflight: Promise<ArchiveRow[]> | null = null;

export function loadArchive(): Promise<ArchiveRow[]> {
  if (archiveCache) return Promise.resolve(archiveCache);
  if (archiveInflight) return archiveInflight;
  archiveInflight = gunzipJson<ArchiveRow[]>('./icthat/archive.json.gz')
    .then((rows) => {
      archiveCache = Array.isArray(rows) ? rows : [];
      return archiveCache;
    })
    .catch(() => {
      archiveCache = [];
      return archiveCache;
    })
    .finally(() => {
      archiveInflight = null;
    });
  return archiveInflight;
}

const shardCache = new Map<number, Record<string, string>>();
const shardInflight = new Map<number, Promise<Record<string, string>>>();

/**
 * Karar metni parçasını yükler.
 *
 * Yayın derlemesinde parçalar şifrelidir (`icthat/kasa/sNN.bin`); geliştirme
 * derlemesinde şifresiz `icthat/fulltext/sNN.json.gz` kullanılır. Hangisinin
 * bulunduğu çalışma anında anlaşılır, böylece iki derleme de aynı kodla
 * çalışır.
 */
function loadShard(n: number): Promise<Record<string, string>> {
  const hit = shardCache.get(n);
  if (hit) return Promise.resolve(hit);
  const running = shardInflight.get(n);
  if (running) return running;

  const job = (async () => {
    if (kasaVarMi()) {
      const res = await fetch(`./icthat/kasa/s${String(n).padStart(2, '0')}.bin`);
      if (res.ok) return kasadanCoz<Record<string, string>>(await res.arrayBuffer());
    }
    return gunzipJson<Record<string, string>>(`./icthat/fulltext/${shardName(n)}`);
  })()
    .then((bag) => {
      shardCache.set(n, bag || {});
      return bag || {};
    })
    .catch(() => {
      const empty = {};
      shardCache.set(n, empty);
      return empty;
    })
    .finally(() => {
      shardInflight.delete(n);
    });

  shardInflight.set(n, job);
  return job;
}

/**
 * Kararın tam metni — ÜYELİK GEREKTİRİR.
 *
 * Kapı burada, tek noktada durur. Arayüzde birden çok yerde denetim yapmak,
 * bir ekranın gözden kaçmasıyla bütün korumayı boşa çıkarırdı; metin yalnız
 * bu fonksiyondan geçtiği için kapı da burada.
 */
export async function loadFullText(id: string): Promise<string | null> {
  if (!erisimVar()) return null;
  const bag = await loadShard(shardOf(id));
  return bag[id] || null;
}

/** Üyelik denetimi yapmadan metni getirir — yalnız ücretsiz önizleme için. */
export async function loadOnizleme(id: string, harf = 420): Promise<string | null> {
  const bag = await loadShard(shardOf(id));
  const tam = bag[id];
  if (!tam) return null;
  return tam.slice(0, harf);
}

export function foldTr(s: string): string {
  return String(s || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

/**
 * Katlanmış arama dizini — arşivle aynı sırada, satır satır.
 *
 * Katlama eskiden her tuş vuruşunda cihazda yapılıyordu: 23 bin satır ×
 * ICU `toLocaleLowerCase('tr-TR')` + yedi regex. Ölçüldüğünde orta sınıf bir
 * telefonda tek tuş 4,8 saniye sürüyor, arama kutusu uygulamayı
 * donduruyordu. İş derleme zamanına taşındı (`build-yargi-index.mjs`);
 * cihaz artık hazır metni `indexOf` ile tarar.
 *
 * Dizin ayrı dosyadadır ve YALNIZ ilk aramada indirilir; arşiv listesini
 * açıp hiç arama yapmayan kullanıcı bu 1 MB'ı hiç görmez.
 */
let foldCache: string[] | null = null;
let foldInflight: Promise<string[]> | null = null;

export function foldHazirMi(): boolean {
  return foldCache !== null;
}

export function loadFoldIndex(): Promise<string[]> {
  if (foldCache) return Promise.resolve(foldCache);
  if (foldInflight) return foldInflight;
  foldInflight = fetch('./icthat/arama.txt.gz')
    .then(async (res) => {
      if (!res.ok) throw new Error(`arama.txt.gz ${res.status}`);
      const buf = new Uint8Array(await res.arrayBuffer());
      return strFromU8(gunzipSync(buf)).split('\n');
    })
    .then((satirlar) => {
      foldCache = satirlar;
      return satirlar;
    })
    .catch(() => {
      // Dizin yoksa arama yine çalışır, yalnız yavaşlar (aşağıdaki yedek yol).
      foldCache = [];
      return foldCache;
    })
    .finally(() => {
      foldInflight = null;
    });
  return foldInflight;
}

/** Dizin yokken kullanılan yedek: satırı yerinde katlar. */
function satirSamani(r: ArchiveRow): string {
  return foldTr(
    [r.k, r.d, r.a, r.e, r.r, r.v, r.h, ...(r.j || []), ...(r.w || [])].join(' ')
  );
}

/**
 * Arşivde arama.
 *
 * `limit` kadar sonuç toplanınca durulur; `offset` ile bir sonraki dilim
 * istenir. Tarama nerede kaldıysa oradan sürsün diye satır indisi de
 * döndürülür — «daha fazla göster» her seferinde baştan taramaz.
 */
export type AramaSonucu = {
  rows: ArchiveRow[];
  /** Taramanın bittiği satır indisi — bir sonraki çağrıya `imlec` olarak verilir */
  imlec: number;
  /** Arşivin sonuna ulaşıldı mı? */
  bitti: boolean;
};

export function searchArchive(
  rows: ArchiveRow[],
  query: string,
  tier: string | null,
  limit = 80,
  imlec = 0
): AramaSonucu {
  const tokens = foldTr(query.trim()).split(/\s+/).filter(Boolean);
  const fold = foldCache;
  const out: ArchiveRow[] = [];

  let i = imlec;
  for (; i < rows.length; i += 1) {
    const r = rows[i];
    if (tier && r.r !== tier && r.a !== tier) continue;
    if (tokens.length) {
      const hay = fold && fold.length === rows.length ? fold[i] : satirSamani(r);
      let uyar = true;
      for (const t of tokens) {
        if (!hay.includes(t)) {
          uyar = false;
          break;
        }
      }
      if (!uyar) continue;
    }
    out.push(r);
    if (out.length >= limit) {
      i += 1;
      break;
    }
  }

  return { rows: out, imlec: i, bitti: i >= rows.length };
}
