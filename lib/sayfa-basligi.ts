/**
 * Sayfa başlığı (Aylık plan G10, S7). Kök yerleşim `title.template: '%s | Av. Fethi Güzel'` markayı kendisi ekler;
 * sayfanın `title` alanı ekle yazılırsa başlık "… | Av. Fethi Güzel | Av. Fethi Güzel" olur. Veriden gelen ekli
 * başlıklar (rehber verisi) buradan geçer; OG ve Twitter başlıkları şablondan geçmediği için ekli kalır.
 */
const MARKA_EKI = /\s*[|—–-]\s*Av\. Fethi Güzel(?:\s*[–—-]?\s*Hukuk Portalı)?\s*$/;

export function sayfaBasligi(baslik: string): string {
  return baslik.replace(MARKA_EKI, '');
}
