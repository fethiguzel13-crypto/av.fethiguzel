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

  onePlanceBagla();
}

/**
 * Uygulama öne geldiğinde üyeliği yeniden doğrular.
 *
 * Durum yalnız açılışta bir kez okunuyordu. Bu, üyeliği Play'in web
 * arayüzünden alan ya da uygulama açıkken iptal eden kullanıcıyı bir sonraki
 * TAM YENİDEN BAŞLATMAYA kadar yanlış durumda bırakır: biri ödediği hâlde
 * kapıda kalır, öteki iptalden sonra okumayı sürdürür. Android'de uygulama
 * günlerce arka planda durabildiği için "yeniden başlatma" hiç gelmeyebilir.
 *
 * Tazeleme kısılır: öne her gelişte Play'e sormak, uygulamaya her dönüşte
 * ağ isteği demektir.
 */
const TAZELEME_ARALIGI = 6 * 3600e3;
let sonTazeleme = Date.now();
let onePlanceBagliMi = false;

function onePlanceBagla(): void {
  if (onePlanceBagliMi) return;
  onePlanceBagliMi = true;

  const uygula = () => {
    if (Date.now() - sonTazeleme < TAZELEME_ARALIGI) return;
    sonTazeleme = Date.now();
    void uyelikYenile();
  };

  void import('@capacitor/app')
    .then(({ App }) => {
      void App.addListener('resume', uygula);
    })
    .catch(() => {
      // Capacitor yoksa (tarayıcı) sekme görünürlüğü aynı işi görür.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') uygula();
      });
    });
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

/**
 * MAĞAZA İNCELEMESİ ERİŞİM KODU.
 *
 * Google Play incelemecisi uygulamanın ücretli bölümünü göremezse sürüm
 * reddedilir. Play'in kendi formu bunu açıkça söylüyor: incelemeciler
 * ücretsiz deneme kullanamaz, hesap açamaz, kendi hesaplarıyla giremez.
 *
 * Bu uygulamada hesap sistemi yok — üyelik doğrudan Play satın almasına
 * bağlı. Dolayısıyla incelemeciye verilecek bir kullanıcı adı/şifre de yok.
 * Onun yerine Ayarlar ekranında bir kod alanı var; bu kod üyeliği 30 gün
 * yerel olarak açar.
 *
 * ─── Güvenlik sınırı ───────────────────────────────────────────────────────
 * Kod, paketin içinde düz metin olarak durur ve tersine mühendislikle
 * çıkarılabilir. Bu bilinçli bir kabul: kodun açtığı içerik ZATEN aynı
 * pakette şifreli olarak geliyor ve çözme anahtarı da uygulamayla birlikte
 * dağıtılıyor (bkz. docs/UYELIK.md → «Dürüst sınır»). Yani kod yeni bir
 * açık yaratmıyor, var olan sınırın ötesine geçmiyor.
 *
 * Kodu değiştirirsen `docs/PLAY-STORE.md` içindeki inceleme metnini de
 * güncelle — Play'e verilen bilgi yanlış kalırsa sürüm reddedilir.
 */
export const INCELEME_KODU = 'FG-REVIEW-2026';

/** Girilen kod doğruysa erişimi açar. */
export async function incelemeKoduDene(kod: string): Promise<boolean> {
  if (kod.trim().toUpperCase() !== INCELEME_KODU) return false;
  await uyelikElleAc(30);
  return true;
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

/**
 * Üyelik kaydını CIHAZDAN SİLER — «tüm yerel verileri sil» için.
 *
 * `uyelikSifirla` kaydı «yok» diye yeniden yazar; bu, veri silme talebini
 * karşılamaz çünkü dosya yerinde kalır. Burada anahtar tamamen kaldırılır.
 *
 * Erişim kaybı yaratmaz: kayıt Play'deki gerçeğin yerel kopyasıdır. Bir
 * sonraki açılışta `uyelikBaslat` Play'e sorar ve ödeme yapan kullanıcının
 * üyeliği kendiliğinden geri gelir.
 */
export async function uyelikVerisiniSil(): Promise<void> {
  try {
    await Preferences.remove({ key: ANAHTAR });
  } catch {
    /* depolama yoksa bellek sıfırlaması yeterli */
  }
  baslatildi = false;
  yayinla({ durum: 'bilinmiyor' });
}
