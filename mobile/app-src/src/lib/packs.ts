import { gunzipSync, strFromU8 } from 'fflate';
import { foldTr, tighten, tokenize, scoreArticle, parseMaddeQuery } from './text.mjs';

export { foldTr, tighten, tokenize, parseMaddeQuery };

/**
 * Mevzuat paketleri — tamamen cihazda.
 *
 * 46 kanunun 8.087 maddesinin resmî metni, sıkıştırılmış hâlde 2,9 MB tutuyor
 * ve uygulamayla birlikte kuruluyor. İndirme yöneticisi, hesap, sunucu yok:
 * uçak modunda kurulan uygulama, ilk açılışta tüm Türk mevzuatını gösteriyor.
 *
 * Açma işi `fflate` ile yapılır; tarayıcının DecompressionStream API'si eski
 * WebView sürümlerinde bulunmadığı için ona güvenilmez.
 */

export type PackEntry = {
  /** başlık */
  t: string;
  /** madde numarası */
  n: number;
  /** resmî metin */
  o: string;
  /** şerh — yalnız denetimden geçen 95 maddede var */
  c?: string;
  /**
   * 1 = resmî metin eksik ya da yerine özet konulmuş.
   *
   * 8.088 maddenin 23'ünde `official` alanı kanun metni değil, kanun metni
   * hakkında bir cümle taşıyor. Uygulamanın tek vaadi metnin Resmî
   * Gazete'deki hâliyle aynı olmasıdır; bu maddeler uyarı şeridiyle
   * gösterilir, sessizce kanun diye sunulmaz.
   */
  x?: 1;
};

export type Pack = Record<string, PackEntry>;

export type PackMeta = {
  id: string;
  name: string;
  articles: number;
  commentaries: number;
  bytes: number;
};

export type Manifest = {
  generatedAt: string;
  format: number;
  totalArticles: number;
  totalBytes: number;
  note: string;
  packs: PackMeta[];
};

const packCache = new Map<string, Pack>();
const inflight = new Map<string, Promise<Pack>>();
let manifestCache: Manifest | null = null;

/** Paket dosyalarının kök yolu — Capacitor'da uygulama içi varlık. */
const BASE = './packs';

export async function loadManifest(): Promise<Manifest> {
  if (manifestCache) return manifestCache;
  const res = await fetch(`${BASE}/manifest.json`);
  if (!res.ok) throw new Error(`manifest yüklenemedi: ${res.status}`);
  manifestCache = (await res.json()) as Manifest;
  return manifestCache;
}

export async function loadPack(kanunId: string): Promise<Pack> {
  const cached = packCache.get(kanunId);
  if (cached) return cached;

  const running = inflight.get(kanunId);
  if (running) return running;

  const job = (async () => {
    const res = await fetch(`${BASE}/${kanunId}.json.gz`);
    if (!res.ok) throw new Error(`${kanunId} paketi yüklenemedi: ${res.status}`);
    const buf = new Uint8Array(await res.arrayBuffer());
    const pack = JSON.parse(strFromU8(gunzipSync(buf))) as Pack;
    packCache.set(kanunId, pack);
    inflight.delete(kanunId);
    return pack;
  })();

  inflight.set(kanunId, job);
  try {
    return await job;
  } catch (e) {
    inflight.delete(kanunId);
    throw e;
  }
}

/** Bellekte tutulan paketleri boşalt — düşük bellekli cihazlarda. */
export function evictPacks(keep: string[] = []) {
  const keepSet = new Set(keep);
  for (const id of packCache.keys()) {
    if (!keepSet.has(id)) packCache.delete(id);
  }
}

// ─── Arama ───────────────────────────────────────────────────────────────────

export type SearchHit = {
  kanunId: string;
  kanunName: string;
  key: string;
  maddeNo: number;
  title: string;
  /** eşleşmenin geçtiği kısa alıntı */
  excerpt: string;
  score: number;
};

/**
 * Yüklü paketlerde tam metin arama.
 *
 * Yalnız BELLEKTEKİ paketlerde arar; hepsini açmak düşük bellekli cihazda
 * uygulamayı düşürür. Çağıran taraf hangi kanunların yükleneceğine karar
 * verir (varsayılan: çekirdek kanunlar).
 */
export function searchLoaded(
  query: string,
  names: Map<string, string>,
  limit = 60
): SearchHit[] {
  const tokens = tokenize(query);
  if (!tokens.length || query.trim().length < 2) return [];
  const hits: SearchHit[] = [];

  for (const [kanunId, pack] of packCache) {
    const kanunName = names.get(kanunId) || kanunId.toUpperCase();
    for (const [key, e] of Object.entries(pack)) {
      const score = scoreArticle(e.t, e.o, tokens);
      if (score === 0) continue;

      // Alıntı için önce normal eşleşmeyi dene; bulunamazsa maddenin başı
      const at = foldTr(e.o).indexOf(tokens[0]);
      const start = at >= 0 ? Math.max(0, at - 60) : 0;
      const excerpt =
        (start > 0 ? '…' : '') +
        e.o.slice(start, start + 180).replace(/\s+/g, ' ').trim() +
        '…';

      hits.push({ kanunId, kanunName, key, maddeNo: e.n, title: e.t, excerpt, score });
      if (hits.length > limit * 8) break;
    }
  }

  return hits.sort((a, b) => b.score - a.score || a.maddeNo - b.maddeNo).slice(0, limit);
}

/** Bellekte hangi paketler var? */
export function loadedPacks(): string[] {
  return Array.from(packCache.keys());
}
