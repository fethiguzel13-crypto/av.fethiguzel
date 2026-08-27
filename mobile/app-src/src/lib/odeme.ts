import { URUN_ID, YEDEK_FIYAT } from './uyelik';

/**
 * Google Play Billing köprüsü.
 *
 * Play mağazasında dijital içerik satışı yalnız Play Billing üzerinden
 * yapılabilir; havale, kredi kartı ya da üçüncü taraf ödeme sayfası
 * kullanmak uygulamanın kaldırılmasıyla sonuçlanır. Bu dosya, uygulamanın
 * geri kalanını satın alma kütüphanesinin ayrıntılarından ayırır: arayüz
 * yalnız «sahibi mi», «satın al», «geri yükle» bilir.
 *
 * Kütüphane bulunamadığında (tarayıcıda geliştirme, duman testi) sessizce
 * boş bir cevap döner — uygulama çökmez, yalnız erişim kapalı görünür.
 */

export type BillingDurum = {
  /** Şu anda geçerli aboneliği var mı? */
  sahip: boolean;
  /** Aboneliğin bittiği an (biliniyorsa) */
  bitis?: number;
  /** Daha önce satın alınmış ama süresi dolmuş mu? */
  dahaOnceAlinmis?: boolean;
};

export type UrunBilgisi = {
  id: string;
  baslik?: string;
  aciklama?: string;
  /** Play'in yerelleştirilmiş fiyatı — «₺500,00» */
  fiyat: string;
  donem?: string;
};

type Store = {
  register: (u: unknown) => void;
  /** HATA DİZİSİ döndürür — boş dizi «sorun yok» demektir. */
  initialize: (p?: unknown) => Promise<unknown[] | void>;
  /** Asenkron hata dinleyicisi. */
  error?: (cb: (e: unknown) => void) => void;
  update?: () => Promise<void>;
  get: (id: string, platform?: string) => unknown;
  when: () => { approved: (cb: (t: unknown) => void) => void };
  restorePurchases?: () => Promise<void>;
  verbosity?: number;
  DEBUG?: number;
  ProductType?: Record<string, string>;
  Platform?: Record<string, string>;
};

function store(): Store | null {
  const g = globalThis as unknown as { CdvPurchase?: { store?: Store } };
  return g.CdvPurchase?.store ?? null;
}

/** Kütüphane bu cihazda var mı? Tarayıcıda çalışırken yok. */
export function odemeVarMi(): boolean {
  return store() !== null;
}

let hazir = false;
let hazirlaniyor: Promise<void> | null = null;

/**
 * Play'in bildirdiği son hatalar.
 *
 * `store.initialize()` bir HATA DİZİSİ döndürür ve önceki sürüm o diziyi
 * tümüyle yok sayıyordu. Play bağlantısı kurulamadığında ya da ürün
 * bulunamadığında kullanıcı yalnız «mağazadan okunamadı» görüyor, sebebini
 * ne o ne de biz öğrenebiliyorduk. Artık hem başlatma hatası hem eklentinin
 * asenkron bildirdiği hatalar burada birikiyor ve mesaja yansıyor.
 */
const hatalar: string[] = [];

function hataYaz(e: unknown): void {
  const h = e as { code?: number | string; message?: string } | undefined;
  const metin = h?.message ? `${h.message}${h.code != null ? ` (${h.code})` : ''}` : String(e);
  if (metin && !hatalar.includes(metin)) hatalar.push(metin);
}

/** Tanılama için: Play'den gelen son hata metinleri. */
export function odemeHatalari(): string[] {
  return hatalar.slice();
}

export function billingBaslat(): Promise<void> {
  if (hazir) return Promise.resolve();
  if (hazirlaniyor) return hazirlaniyor;

  const s = store();
  if (!s) return Promise.reject(new Error('billing yok'));

  hazirlaniyor = (async () => {
    const g = globalThis as unknown as { CdvPurchase?: Record<string, Record<string, string>> };
    const tur = g.CdvPurchase?.ProductType?.PAID_SUBSCRIPTION ?? 'paid subscription';
    const platform = g.CdvPurchase?.Platform?.GOOGLE_PLAY ?? 'android-playstore';

    // Eklentinin asenkron bildirdiği hatalar (bağlantı kopması, iptal, vb.)
    if (typeof s.error === 'function') s.error(hataYaz);

    s.register([{ id: URUN_ID, type: tur, platform }]);

    /*
      Onaylanan işlem doğrulanmalı ve "tamamlandı" denmelidir; aksi hâlde
      Play üç gün sonra ödemeyi iade eder. Sunucu tarafı doğrulama
      kurulana kadar işlem cihazda tamamlanır (bkz. docs/UYELIK.md).
    */
    s.when().approved((t: unknown) => {
      const islem = t as { verify?: () => void; finish?: () => void };
      if (typeof islem.finish === 'function') islem.finish();
    });

    const sonuc = await s.initialize([{ platform }]);
    if (Array.isArray(sonuc)) sonuc.forEach(hataYaz);

    hazir = true;
  })();

  return hazirlaniyor;
}

/**
 * Ürünün Play'den gelmesini bekler.
 *
 * `initialize()` dönmüş olması ürün listesinin hazır olduğu anlamına
 * gelmez: Play kataloğu ayrı bir tur olarak getirir. Önceki sürüm hemen
 * sorup boş bulunca «okunamadı» diyordu; oysa ürün bir saniye sonra
 * geliyordu.
 */
async function urunuBekle(s: Store, platform: string, sureMs = 6000): Promise<unknown> {
  const basla = Date.now();
  for (;;) {
    const u = s.get(URUN_ID, platform);
    if (u) return u;
    if (Date.now() - basla > sureMs) return undefined;
    await new Promise((r) => setTimeout(r, 300));
  }
}

/** Play'e sorup güncel abonelik durumunu getirir. */
export async function billingDurum(): Promise<BillingDurum> {
  const s = store();
  if (!s) throw new Error('billing yok');
  await billingBaslat();
  if (typeof s.update === 'function') await s.update();

  const g = globalThis as unknown as { CdvPurchase?: Record<string, Record<string, string>> };
  const platform = g.CdvPurchase?.Platform?.GOOGLE_PLAY ?? 'android-playstore';
  const urun = s.get(URUN_ID, platform) as
    | { owned?: boolean; expiryDate?: string | number; transaction?: { expirationDate?: string } }
    | undefined;

  if (!urun) return { sahip: false };

  const bitisHam = urun.expiryDate ?? urun.transaction?.expirationDate;
  const bitis = bitisHam ? new Date(bitisHam).getTime() : undefined;

  return {
    sahip: !!urun.owned,
    bitis: Number.isFinite(bitis) ? (bitis as number) : undefined,
    dahaOnceAlinmis: !!bitis && !urun.owned,
  };
}

/** Play'in yerelleştirilmiş ürün bilgisi. */
export async function urunBilgisi(): Promise<UrunBilgisi> {
  const s = store();
  if (!s) return { id: URUN_ID, fiyat: YEDEK_FIYAT, donem: 'ay' };
  try {
    await billingBaslat();
    const g = globalThis as unknown as { CdvPurchase?: Record<string, Record<string, string>> };
    const platform = g.CdvPurchase?.Platform?.GOOGLE_PLAY ?? 'android-playstore';
    // Fiyat ekranı da ürünün gelmesini bekler; yoksa hep yedek fiyat gösterir.
    const urun = (await urunuBekle(s, platform)) as
      | {
          title?: string;
          description?: string;
          pricing?: { price?: string };
          offers?: { pricingPhases?: { price?: string; billingPeriod?: string }[] }[];
        }
      | undefined;

    const faz = urun?.offers?.[0]?.pricingPhases?.[0];
    return {
      id: URUN_ID,
      baslik: urun?.title,
      aciklama: urun?.description,
      fiyat: faz?.price ?? urun?.pricing?.price ?? YEDEK_FIYAT,
      donem: faz?.billingPeriod === 'P1M' ? 'ay' : faz?.billingPeriod,
    };
  } catch {
    return { id: URUN_ID, fiyat: YEDEK_FIYAT, donem: 'ay' };
  }
}

/** Satın alma akışını başlatır. Play'in kendi ekranı açılır. */
export async function satinAl(): Promise<void> {
  const s = store();
  if (!s) throw new Error('Satın alma bu cihazda kullanılamıyor.');
  await billingBaslat();

  const g = globalThis as unknown as { CdvPurchase?: Record<string, Record<string, string>> };
  const platform = g.CdvPurchase?.Platform?.GOOGLE_PLAY ?? 'android-playstore';

  const urun = (await urunuBekle(s, platform)) as
    | { getOffer?: () => { order?: () => Promise<unknown> } | undefined }
    | undefined;

  const teklif = urun?.getOffer?.();

  /*
    Buradaki mesaj TANILAYICI olmalı.

    Önceki sürüm yalnız «Abonelik ürünü mağazadan okunamadı» diyordu; bu,
    kullanıcı için çıkmaz bir cümle. Ürünün gelmemesinin üç ayrı sebebi var
    ve üçünün çözümü de farklı:

      · Uygulama Play'den kurulmamış (yandan yükleme) — Play Billing
        yalnız mağazadan kurulan pakette çalışır. En sık sebep budur.
      · Play Console'da ürün ya da temel plan etkinleştirilmemiş.
      · Ürün yeni oluşturulmuş; yayılması birkaç saat sürebilir.

    Play'in kendi hata metni varsa onu da ekliyoruz — «okunamadı» demek
    yerine neyin okunamadığını söylüyor.
  */
  if (!teklif?.order) {
    const ek = hatalar.length ? ` Play şunu bildirdi: ${hatalar.join(' · ')}` : '';
    throw new Error(
      `«${URUN_ID}» aboneliği Play'den gelmedi.${ek} ` +
        'Sık sebep: uygulama Google Play üzerinden kurulmamış olabilir — ' +
        'satın alma yalnız mağazadan (dahili test bağlantısı dâhil) kurulan ' +
        'pakette çalışır. Ayrıca Play Console → Abonelikler bölümünde ürünün ' +
        've temel planın ETKİN olduğunu doğrulayın.'
    );
  }

  await teklif.order();
}

/** Cihaz değiştiren ya da uygulamayı silip kuran kullanıcı için. */
export async function geriYukle(): Promise<void> {
  const s = store();
  if (!s) throw new Error('Satın alma bu cihazda kullanılamıyor.');
  await billingBaslat();
  if (typeof s.restorePurchases === 'function') await s.restorePurchases();
  else if (typeof s.update === 'function') await s.update();
}

/** Play'in abonelik yönetim sayfası — iptal buradan yapılır. */
export function yonetimAdresi(paketAdi: string): string {
  return `https://play.google.com/store/account/subscriptions?sku=${URUN_ID}&package=${paketAdi}`;
}
