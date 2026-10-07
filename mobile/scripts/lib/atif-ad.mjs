/**
 * Atıf adında geri gönderme ayıklaması (G14).
 *
 * `build-yargi-index.mjs` bir kanun numarasını pakete, o numarayla en sık anılan ada bakarak bağlar. Hasat motorunun 2026'da
 * indirdiği kararlar atfı çoğunlukla «5271 sayılı Kanun'un 230. maddesi» diye yazar. Bu yüzden 2026-10-07 derlemesinde 5271 ve
 * 4721 için en sık ad «Kanun’un» çıktı ve Ceza Muhakemesi Kanunu ile Türk Medeni Kanunu eşlemeden düştü. Böyle bir ad kanunu
 * tanıtmaz, yalnız önceki tam ada gönderme yapar. Ad sayımına katılmaz, atfın kendisi ise numarayla bağlanmaya devam eder.
 *
 * @param {string} ad  atıf deseninin yakaladığı ad
 * @returns {boolean}  ad yalnız «Kanun» ya da «Yasa» ile çekim ekinden oluşuyorsa true
 */
export function gondermeAdi(ad) {
  const s = String(ad || '')
    .trim()
    .toLocaleLowerCase('tr-TR');
  return /^(?:kanun|yasa)(?:\s*['’]?\s*[a-zçğıöşü]{1,4})?$/.test(s);
}
