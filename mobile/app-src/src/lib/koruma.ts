import { useEffect } from 'react';
import { registerPlugin } from '@capacitor/core';

/**
 * Karar metni ekran koruması.
 *
 * Ücretli külliyatın toplu kopyalanmasını zorlaştırmak için karar okuma
 * ekranı açıkken Android penceresine FLAG_SECURE konur: ekran görüntüsü ve
 * ekran kaydı engellenir, son kullanılanlar listesinde içerik yerine boş
 * kart görünür.
 *
 * Bayrak YALNIZ bu ekranda açılır. Uygulama genelinde açık bırakmak, kanun
 * maddesinin ya da bir hesaplama sonucunun ekran görüntüsünü almak isteyen
 * kullanıcıyı da engellerdi; o içerik ücretsiz ve paylaşılabilir olmalıdır.
 *
 * Neyi durdurmadığı açıkça söylenmelidir: FLAG_SECURE cihaz üzerindeki
 * yazılımsal kaydı engeller, ikinci bir telefonla ekranın fotoğrafını
 * çekmeyi engellemez.
 */

type EkranKorumaEklentisi = {
  ac(): Promise<void>;
  kapat(): Promise<void>;
};

const EkranKoruma = registerPlugin<EkranKorumaEklentisi>('EkranKoruma');

/**
 * Bileşen ekranda olduğu sürece korumayı açık tutar.
 *
 * Sayaç tutulur: iki korumalı ekran üst üste açılıp biri kapandığında
 * bayrak erken sönmesin. Sayaç sıfırlanmadan kapatma yapılmaz.
 */
let acikSayac = 0;

export function useEkranKoruma(etkin = true): void {
  useEffect(() => {
    if (!etkin) return undefined;

    acikSayac += 1;
    if (acikSayac === 1) {
      EkranKoruma.ac().catch(() => {
        /* tarayıcıda ya da eklentisiz derlemede yok sayılır */
      });
    }

    return () => {
      acikSayac = Math.max(0, acikSayac - 1);
      if (acikSayac === 0) {
        EkranKoruma.kapat().catch(() => {});
      }
    };
  }, [etkin]);
}

/**
 * Metnin seçilmesini, kopyalanmasını ve sürüklenmesini engelleyen sınıf.
 *
 * Uygulama genelinde hukuk metni seçilebilir olmalıdır — avukat maddeyi
 * kopyalayıp dilekçesine yapıştırır. Ücretli karar metni bunun istisnasıdır.
 */
export const SECILEMEZ =
  'select-none [-webkit-user-select:none] [-webkit-touch-callout:none] pointer-events-none';
