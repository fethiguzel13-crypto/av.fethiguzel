import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Sitenin her yerinde görünen külliyat sayıları — TEK KAYNAK.
 *
 * Bu sayılar altı ayrı bileşene elle yazılmıştı (Hero, TrustBar,
 * LibraryStrip, RegionsPreview, app/page.tsx, mevzuat sayfaları) ve
 * kaçınılmaz olarak kaydı: ana sayfa «19.000+ Yargıtay kararı» derken arşiv
 * sayfası aynı anda 25.902 diyordu, kanun sayısı 46 yazıyordu ama külliyatta
 * 47 kanun vardı. Ziyaretçi iki sayfayı yan yana açtığında gördüğü şey
 * tutarsızlıktı — bir hukuk kaynağında en pahalı kusur budur.
 *
 * Değerler artık üretimin kendi çıktısından okunur. Veri büyüdüğünde metin
 * kendiliğinden büyür; kimsenin bir sayıyı elle güncellemesi gerekmez.
 *
 * Bu modül YALNIZ sunucuda çalışır (node:fs). İstemci bileşenlerine değer
 * geçirilerek kullanılır.
 */

type Sayilar = {
  /** Külliyattaki kanun sayısı */
  kanun: number;
  /** Resmî metni bulunan madde sayısı */
  madde: number;
  /** Kalite kapısından geçmiş, yayımlanabilir şerh sayısı */
  serh: number;
  /** Arşivdeki Yargıtay kararı sayısı */
  karar: number;
  /** Yayımlanabilir vatandaş rehberi sayısı */
  rehber: number;
};

function oku<T>(gorece: string): T | null {
  const p = join(process.cwd(), gorece);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, 'utf8')) as T;
  } catch {
    return null;
  }
}

/*
  Yedek değerler.

  Veri dosyası bulunamazsa sayfa sayısız kalmasın diye son bilinen değerler
  burada durur. Yedeğe düşmek bir kusurdur; bu yüzden değerler GERÇEKTEN
  ölçülmüş olanlardır, yuvarlanmış tahminler değil.
*/
const YEDEK: Sayilar = { kanun: 47, madde: 8088, serh: 5143, karar: 25902, rehber: 579 };

let onbellek: Sayilar | null = null;

export function siteSayilari(): Sayilar {
  if (onbellek) return onbellek;

  const paket = oku<{ packs?: unknown[]; totalArticles?: number }>('public/app-packs/manifest.json');
  const yargi = oku<{ total?: number }>('public/data/yargi-stats.json');
  const yayin = oku<{ counts?: { mevzuat?: number; rehber?: number } }>('public/data/publishable.json');

  onbellek = {
    kanun: Array.isArray(paket?.packs) ? paket.packs.length : YEDEK.kanun,
    madde: paket?.totalArticles ?? YEDEK.madde,
    serh: yayin?.counts?.mevzuat ?? YEDEK.serh,
    karar: yargi?.total ?? YEDEK.karar,
    rehber: yayin?.counts?.rehber ?? YEDEK.rehber,
  };
  return onbellek;
}

/** «25.902» — Türkçe binlik ayracıyla. */
export function tr(n: number): string {
  return n.toLocaleString('tr-TR');
}

/**
 * «25.900+» — yuvarlanmış, iddiayı küçülterek.
 *
 * Yuvarlama her zaman AŞAĞI yapılır. Yukarı yuvarlamak, elinizde olmayan
 * içeriği varmış gibi göstermek olurdu; aşağı yuvarlanan bir sayı ise her
 * zaman doğrudur.
 */
export function yaklasik(n: number, basamak = 100): string {
  if (n < basamak) return tr(n);
  return `${tr(Math.floor(n / basamak) * basamak)}+`;
}
