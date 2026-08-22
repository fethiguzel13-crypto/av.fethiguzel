import { KAVRAMLAR, type Kavram } from '@/lib/kavramlar';
import { HESAPLAMA_ARACLAR } from '@/lib/hesaplama-meta';

/**
 * Bölümler arası bağlantı katmanı.
 *
 * Portalda kavramlar ve hesaplama araçları zaten kanun maddelerine
 * bağlanıyor — ama bağ TEK YÖNLÜ: kavramdan maddeye gidiliyor, maddeden
 * kavrama gelinmiyordu. Burada bağ TERS ÇEVRİLİR: bir maddeyi açan kişi
 * o maddeyle ilgili kavramı, rehberi ve hesaplama aracını aynı ekranda
 * görür.
 *
 * Veri portalın kendi kaynağından okunur (`@/lib/…`); ikinci bir kopya
 * tutulmaz, böylece portal güncellendiğinde uygulama da güncellenir.
 */

export type MaddeAnahtari = string; // «tbk/207»

export type BagliKavram = { slug: string; baslik: string; ozet: string };
export type BagliArac = { id: string; baslik: string; tag: string };
export type BagliRehber = { slug: string; h1: string; category: string };

/** «/mevzuat/tbk/madde-207» → «tbk/207» · eşleşmezse boş */
function maddeAnahtari(href: string): MaddeAnahtari | '' {
  const m = /\/mevzuat\/([a-z0-9-]+)\/madde-(\d+)/i.exec(String(href || ''));
  return m ? `${m[1]}/${Number(m[2])}` : '';
}

/** «/hesaplama/kidem» → «kidem» */
function aracId(href: string): string {
  const m = /\/hesaplama\/([a-z0-9-]+)/i.exec(String(href || ''));
  return m ? m[1] : '';
}

/** «/rehber/kidem-tazminati» ya da «/bilgi/kidem-…» → slug */
function rehberSlug(href: string): string {
  const m = /\/(?:rehber|bilgi)\/([a-z0-9-]+)/i.exec(String(href || ''));
  return m ? m[1] : '';
}

// ── Ters indeksler (modül yüklenirken bir kez kurulur) ──────────────────────

const maddeKavram = new Map<MaddeAnahtari, BagliKavram[]>();
const maddeArac = new Map<MaddeAnahtari, BagliArac[]>();
const kanunKavram = new Map<string, BagliKavram[]>();

const ARAC_ADI = new Map(HESAPLAMA_ARACLAR.map((a) => [a.id, { baslik: a.baslik, tag: a.tag }]));

function ekle<T>(map: Map<string, T[]>, key: string, deger: T, esitMi: (a: T, b: T) => boolean) {
  if (!key) return;
  const list = map.get(key);
  if (!list) {
    map.set(key, [deger]);
    return;
  }
  if (list.some((x) => esitMi(x, deger))) return;
  list.push(deger);
}

for (const k of KAVRAMLAR as Kavram[]) {
  const kisa: BagliKavram = { slug: k.slug, baslik: k.baslik, ozet: k.ozet };
  for (const link of k.mevzuat || []) {
    const anahtar = maddeAnahtari(link.href);
    if (anahtar) {
      ekle(maddeKavram, anahtar, kisa, (a, b) => a.slug === b.slug);
      ekle(kanunKavram, anahtar.split('/')[0], kisa, (a, b) => a.slug === b.slug);
      continue;
    }
    // «/ara?q=satım» gibi bağlantılar maddeye çözülmez ama kanunu belli
    // olabilir; kanun düzeyinde bağ yine de kurulur.
    const kanun = /\/mevzuat\/([a-z0-9-]+)/i.exec(link.href);
    if (kanun) ekle(kanunKavram, kanun[1], kisa, (a, b) => a.slug === b.slug);
  }
  for (const link of k.hesaplama || []) {
    const id = aracId(link.href);
    const meta = ARAC_ADI.get(id);
    if (!meta) continue;
    for (const link2 of k.mevzuat || []) {
      const anahtar = maddeAnahtari(link2.href);
      if (anahtar) {
        ekle(maddeArac, anahtar, { id, ...meta }, (a, b) => a.id === b.id);
      }
    }
  }
}

for (const a of HESAPLAMA_ARACLAR) {
  for (const link of a.mevzuat || []) {
    const anahtar = maddeAnahtari(link.href);
    if (!anahtar) continue;
    ekle(maddeArac, anahtar, { id: a.id, baslik: a.baslik, tag: a.tag }, (x, y) => x.id === y.id);
  }
}

// ── Sorgular ────────────────────────────────────────────────────────────────

/** Bu maddeyle ilgili kavramlar; madde düzeyinde yoksa kanun düzeyine düşer. */
export function kavramlarIcin(kanunId: string, maddeNo: number): BagliKavram[] {
  const tam = maddeKavram.get(`${kanunId}/${maddeNo}`);
  if (tam && tam.length) return tam;
  return kanunKavram.get(kanunId) ?? [];
}

/** Bu maddeyle ilgili hesaplama araçları. */
export function araclarIcin(kanunId: string, maddeNo: number): BagliArac[] {
  return maddeArac.get(`${kanunId}/${maddeNo}`) ?? [];
}

/** Kavram kütüğünün tamamı — Kitaplık bölümü için. */
export function tumKavramlar(): Kavram[] {
  return KAVRAMLAR as Kavram[];
}

export function kavramBul(slug: string): Kavram | undefined {
  return (KAVRAMLAR as Kavram[]).find((k) => k.slug === slug);
}

/**
 * Kavramın işaret ettiği maddeler — kavram sayfasından mevzuata gitmek için.
 * Çözülemeyen bağlantılar (arama bağlantıları) elenir; ekranda tıklandığında
 * hiçbir yere gitmeyen bir bağ bırakmaktansa hiç göstermemek yeğdir.
 */
export function kavramMaddeleri(k: Kavram): { kanunId: string; maddeNo: number; label: string }[] {
  const out: { kanunId: string; maddeNo: number; label: string }[] = [];
  for (const link of k.mevzuat || []) {
    const anahtar = maddeAnahtari(link.href);
    if (!anahtar) continue;
    const [kanunId, no] = anahtar.split('/');
    out.push({ kanunId, maddeNo: Number(no), label: link.label });
  }
  return out;
}

/** Kavramın işaret ettiği hesaplama araçları. */
export function kavramAraclari(k: Kavram): BagliArac[] {
  const out: BagliArac[] = [];
  for (const link of k.hesaplama || []) {
    const id = aracId(link.href);
    const meta = ARAC_ADI.get(id);
    if (meta) out.push({ id, ...meta });
  }
  return out;
}

/** Kavramın işaret ettiği rehber sayfaları. */
export function kavramRehberleri(k: Kavram): string[] {
  const out: string[] = [];
  for (const link of k.rehber || []) {
    const slug = rehberSlug(link.href);
    if (slug) out.push(slug);
  }
  return out;
}
