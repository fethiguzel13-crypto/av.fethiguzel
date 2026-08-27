/**
 * Sıkıştırılmış varlıkların uzantısı — TEK KAYNAK.
 *
 * ─── Neden `.gz` DEĞİL ──────────────────────────────────────────────────────
 *
 * Android'in paketleme aracı (aapt2), `assets/` altında `.gz` ile biten her
 * dosyayı paket oluştururken AÇAR ve uzantıyı siler. Kaynakta
 * `packs/tbk.json.gz` duran dosya, AAB'nin içinde 10,3 MB'lık açılmış
 * `packs/tbk.json` olarak yer alır.
 *
 * Sonucu şuydu: uygulama `./packs/tbk.json.gz` istiyor, o adla dosya
 * bulunmuyor, ekranda «kanun yüklenemedi» çıkıyordu. Aynı sebeple rehber,
 * atıf haritası, akademik eserler ve arşiv indeksi de yüklenemiyordu.
 *
 * Kusur YALNIZ gerçek cihazda görünür: tarayıcıda dosyalar `www` klasöründen
 * olduğu gibi sunulduğu için her şey çalışır. Bu yüzden aylarca fark edilmedi.
 *
 * Şifreli kasa parçaları (`.bin`) hiç etkilenmedi — sorunun `.gz` uzantısına
 * özgü olduğunun kanıtı da budur.
 *
 * ─── Çözüm ──────────────────────────────────────────────────────────────────
 *
 * Dosyalar aapt2'nin tanımadığı bir uzantıyla paketlenir. İçerik yine
 * gzip'tir; yalnız adı değişir, uygulama içindeki açma kodu aynı kalır.
 * AGP'de bu davranışı kapatan bir ayar yoktur, tek yol uzantıyı değiştirmektir.
 */
export const GZ = '.gzc';

/** `packs/tbk` → `packs/tbk.gzc` */
export function gz(yolGovdesi: string): string {
  return `${yolGovdesi}${GZ}`;
}
