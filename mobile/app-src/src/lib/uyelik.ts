import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';

import { billingBaslat, billingDurum, type BillingDurum } from './odeme';

/**
 * Yargı arşivi üyeliği.
 *
 * ─── Neyi kapatıyoruz ──────────────────────────────────────────────────────
 *
 * Uygulamanın dört bölümünden yalnız biri ücretli: Yargıtay arşivinin TAM
 * METNİ. Mevzuat, Kitaplık ve Hesaplama ücretsiz kalır; günlük içtihat
 * özetleri de öyle. Arşiv listesi de açıktır — künye, konu ve atıf yapılan
 * maddeler görünür. Kapalı olan, kararın metnini okumaktır.
 *
 * Listeyi de kapatmak ilk bakışta daha tutarlı görünür; ne var ki o zaman
 * bölüm boş bir duvara dönüşür ve kullanıcı neye para ödeyeceğini göremez.
 * Sınır tek yerden değiştirilebilir (ARSIV_LISTESI_ACIK).
 *
 * ─── Çevrimdışı süre ───────────────────────────────────────────────────────
 *
 * Bu uygulamanın varlık sebebi çevrimdışı çalışmasıdır. Duruşma salonunda
 * çeken telefon yoktur ve Play sunucusuna ulaşılamadığı için aboneliğin
 * kapanması, ödeme yapmış bir avukatı tam ihtiyaç anında kapıda bırakır.
 * Bu yüzden Play'den alınan son doğrulama CIHAZDA saklanır ve ağ olmadan
 * ÇEVRIMDISI_GUN kadar geçerli sayılır.
 *
 * Yerel kaydın kurcalanabileceği açıktır. Cihaza tam erişimi olan biri her
 * hâlükârda içeriği çıkarabilir; buradaki amaç sıradan kullanımı düzenlemek,
 * kararlı bir saldırganı durdurmak değildir.
 */

/** Arşiv listesi ücretsiz mi? Tam metin her hâlde üyelik ister. */
export const ARSIV_LISTESI_ACIK = true;

/** Play'e ulaşılamadığında son doğrulamanın geçerli sayılacağı gün sayısı. */
const CEVRIMDISI_GUN = 14;

/** Play Console'da tanımlanacak abonelik ürünü. */
export const URUN_ID = 'yargi_arsivi_aylik';

/** Görünen fiyat, Play'den okunamazsa yedek olarak kullanılır. */
export const YEDEK_FIYAT = '500,00 TL';

const ANAHTAR = 'galaxy:uyelik';

export type UyelikDurumu =
  | 'bilinmiyor'
  | 'yok'
  | 'etkin'
  | 'cevrimdisi'
  | 'suresi-doldu';

export type Uyelik = {
  durum: UyelikDurumu;
  /** Aboneliğin bittiği an (epoch ms) — biliniyorsa */
  bitis?: number;
  /** Play'den en son ne zaman doğrulandı (epoch ms) */
  sonDogrulama?: number;
  /** Çevrimdışı geçerliliğin bittiği an */
  cevrimdisiBitis?: number;
};

const BASLANGIC: Uyelik = { durum: 'bilinmiyor' };

let bellek: Uyelik = BASLANGIC;
const dinleyiciler = new Set<(u: Uyelik) => void>();

function yayinla(u: Uyelik) {
  bellek = u;
  for (const d of dinleyiciler) d(u);
}

async function kaydet(u: Uyelik) {
  try {
    await Preferences.set({ key: ANAHTAR, value: JSON.stringify(u) });
  } catch {
    /* depolama yoksa oturum boyunca bellekte kalır */
  }
}

async function oku(): Promise<Uyelik | null> {
  try {
    const { value } = await Preferences.get({ key: ANAHTAR });
    if (!value) return null;
    const u = JSON.parse(value) as Uyelik;
    return u && typeof u === 'object' ? u : null;
  } catch {
    return null;
  }
}

/**
 * Kayıtlı üyeliği bugünün tarihine göre yeniden değerlendirir.
 *
 * Play'den taze bilgi gelmediğinde kullanılır: abonelik bitiş tarihi
 * geçmemişse ve çevrimdışı payı dolmamışsa erişim sürer.
 */
function tazele(u: Uyelik | null): Uyelik {
  if (!u || !u.sonDogrulama) return { durum: 'yok' };
  const simdi = Date.now();

  if (u.bitis && u.bitis < simdi) return { ...u, durum: 'suresi-doldu' };

  const pay = u.cevrimdisiBitis ?? u.sonDogrulama + CEVRIMDISI_GUN * 864e5;
  if (simdi <= pay) {
    return { ...u, durum: u.durum === 'etkin' ? 'cevrimdisi' : u.durum, cevrimdisiBitis: pay };
  }
  return { ...u, durum: 'suresi-doldu', cevrimdisiBitis: pay };
}

/** Play'den gelen sonucu yerel kayda işler. */
async function playSonucunuIsle(d: BillingDurum): Promise<Uyelik> {
  const simdi = Date.now();
  if (d.sahip) {
    const u: Uyelik = {
      durum: 'etkin',
      bitis: d.bitis,
      sonDogrulama: simdi,
      cevrimdisiBitis: simdi + CEVRIMDISI_GUN * 864e5,
    };
    await kaydet(u);
    return u;
  }
  // Play "sahip değil" diyorsa çevrimdışı pay uzatılmaz; abonelik gerçekten
  // bitmiş ya da hiç alınmamıştır.
  const u: Uyelik = { durum: d.dahaOnceAlinmis ? 'suresi-doldu' : 'yok', sonDogrulama: simdi };
  await kaydet(u);
  return u;
}

let baslatildi = false;

/**
 * Açılışta bir kez çağrılır.
 *
 * Önce yerel kayıttan hızlı bir cevap üretir (ekran beklemesin), sonra
 * Play'e sorup sonucu günceller.
 */
export async function uyelikBaslat(): Promise<void> {
  if (baslatildi) return;
  baslatildi = true;

  yayinla(tazele(await oku()));

  try {
    await billingBaslat();
    const d = await billingDurum();
    yayinla(await playSonucunuIsle(d));
  } catch {
    // Play'e ulaşılamadı — yerel değerlendirme geçerli kalır.
    yayinla(tazele(await oku()));
  }
}

/** Satın alma ya da geri yükleme sonrası durumu yeniden çeker. */
export async function uyelikYenile(): Promise<Uyelik> {
  try {
    const d = await billingDurum();
    const u = await playSonucunuIsle(d);
    yayinla(u);
    return u;
  } catch {
    const u = tazele(await oku());
    yayinla(u);
    return u;
  }
}

/** Tam metne erişim var mı? */
export function erisimVar(u: Uyelik = bellek): boolean {
  return u.durum === 'etkin' || u.durum === 'cevrimdisi';
}

export function uyelikOku(): Uyelik {
  return bellek;
}

/** Bileşenlerin abone olduğu kanca. */
export function useUyelik(): Uyelik {
  const [u, setU] = useState<Uyelik>(bellek);
  useEffect(() => {
    dinleyiciler.add(setU);
    void uyelikBaslat();
    return () => {
      dinleyiciler.delete(setU);
    };
  }, []);
  return u;
}

/** «14 gün» gibi kalan çevrimdışı süre — kullanıcıya gösterilir. */
export function kalanCevrimdisiGun(u: Uyelik = bellek): number | null {
  if (u.durum !== 'cevrimdisi' || !u.cevrimdisiBitis) return null;
  return Math.max(0, Math.ceil((u.cevrimdisiBitis - Date.now()) / 864e5));
}

/** Geliştirme ve mağaza incelemesi için erişimi elle açar. */
export async function uyelikElleAc(gun = 30): Promise<void> {
  const simdi = Date.now();
  const u: Uyelik = {
    durum: 'etkin',
    bitis: simdi + gun * 864e5,
    sonDogrulama: simdi,
    cevrimdisiBitis: simdi + gun * 864e5,
  };
  await kaydet(u);
  yayinla(u);
}

export async function uyelikSifirla(): Promise<void> {
  await kaydet({ durum: 'yok' });
  yayinla({ durum: 'yok' });
}
