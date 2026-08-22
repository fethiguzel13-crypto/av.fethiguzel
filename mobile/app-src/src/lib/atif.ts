import { gunzipSync, strFromU8 } from 'fflate';

/**
 * Madde → o maddeye atıf yapan Yargıtay kararları.
 *
 * İndeks derleme anında karar metinlerinden çıkarılır
 * (scripts/build-yargi-index.mjs). Uygulama yalnız okur.
 *
 * Neden önemli: mevzuat ile içtihat, uygulamada birbirine yalnız burada
 * bağlanır. «TBK m.49»u açan hukukçu, aynı ekranda o maddeye dayanan
 * Yargıtay kararlarını da görür — iki ayrı bölümde ayrı ayrı aramak
 * zorunda kalmaz.
 */

export type AtifKaydi = {
  /** Toplam karar sayısı — listede kesilse bile gerçek sayı budur */
  n: number;
  /** Kademe ve tarihe göre sıralı karar kimlikleri (en çok 40) */
  ids: string[];
};

export type AtifIndeksi = Record<string, AtifKaydi>;

let cache: AtifIndeksi | null = null;
let inflight: Promise<AtifIndeksi> | null = null;

/**
 * İndeksi yükler. Dosya yoksa BOŞ döner ve uygulama çalışmaya devam eder:
 * atıf katmanı bir zenginleştirmedir, madde metninin okunmasının şartı
 * değildir.
 */
export function loadAtif(): Promise<AtifIndeksi> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;

  inflight = fetch('./mevzuat/atif.json.gz')
    .then(async (res) => {
      if (!res.ok) throw new Error(String(res.status));
      const buf = new Uint8Array(await res.arrayBuffer());
      return JSON.parse(strFromU8(gunzipSync(buf))) as AtifIndeksi;
    })
    .then((data) => {
      cache = data && typeof data === 'object' ? data : {};
      return cache;
    })
    .catch(() => {
      cache = {};
      return cache;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** «madde-13» → 13 · «madde-13/a» → 13 */
export function maddeNoOf(key: string): number {
  const m = /(\d+)/.exec(String(key || ''));
  return m ? Number(m[1]) : 0;
}

/** Bu maddeye atıf yapan kararlar. */
export async function atiflar(kanunId: string, maddeNo: number): Promise<AtifKaydi | null> {
  if (!kanunId || !maddeNo) return null;
  const idx = await loadAtif();
  return idx[`${kanunId}/${maddeNo}`] ?? null;
}

/**
 * Bir kanunun hangi maddelerinin içtihatla desteklendiği.
 *
 * Kanun sayfasında «içtihatlı madde» rozeti bunu kullanır: hukukçu 1.535
 * maddelik TTK içinde hangi maddenin Yargıtay'da işlendiğini bir bakışta
 * görür.
 */
export async function kanunAtifHaritasi(kanunId: string): Promise<Map<number, number>> {
  const idx = await loadAtif();
  const out = new Map<number, number>();
  const onek = `${kanunId}/`;
  for (const [key, kayit] of Object.entries(idx)) {
    if (!key.startsWith(onek)) continue;
    const no = Number(key.slice(onek.length));
    if (no) out.set(no, kayit.n);
  }
  return out;
}
