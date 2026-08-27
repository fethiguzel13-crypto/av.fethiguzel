/**
 * MARKA İŞARETİ — «FG» mührü
 *
 * Av. Fethi Güzel'in baş harfleri, dolu bir disk üzerine oyulmuş hâlde.
 * Hem site hem mobil uygulama bu tek kaynaktan beslenir.
 *
 * ─── Neden monogram ────────────────────────────────────────────────────────
 * Marka, kişinin adının kendisi. Stok bir ikon (terazi, tokmak, kitap) her
 * hukuk uygulamasında bulunur ve kimseyi işaret etmez; baş harfler yalnız
 * bir kişiyi işaret eder. Dolu disk + oyuk harf düzeni ise mühür/damga
 * geleneğine yaslanır — hukuk metninin kendi görsel dili.
 *
 * ─── Neden YOL, yazı tipi değil ────────────────────────────────────────────
 * Harfler `d` içinde vektör yol olarak duruyor; hiçbir yazı tipine bağlı
 * değil. Bu bir kez ölçülerek öğrenildi: `font-family="Cormorant Garamond"`
 * yazan bir SVG, o yazı tipi kurulu olmayan makinede var olmayan bir
 * fontla BİREBİR aynı çıktıyı veriyordu — yani logo sessizce bozuluyordu.
 * Android WebView'de, Linux CI'da, başka bir bilgisayarda aynı riskin
 * tamamı ortadan kalksın diye harfler dış hatta çevrildi.
 *
 * ─── Kaynak ────────────────────────────────────────────────────────────────
 * Lora Italic (Google Fonts, SIL Open Font License 1.1) — OFL, harf dış
 * hatlarından logo türetmeye açıkça izin verir. Lora uygulamada okuma
 * yüzeyinin serif yüzü olarak zaten paketli; logo ile metin aynı aileden.
 *
 * Yeniden üretim: opentype.js ile `font.charToGlyph()`,
 * 300 birim gövde. Ayrıntı: docs/MARKA.md
 */

/** «FG» dış hattı — 512×512 tuvale göre konumlandırılmış. */
export const FG_PATH = 'M23.40-210L161.40-210L160.20-157.50L150.30-157.50Q151.20-175.20 145.95-184.35Q140.70-193.50 131.55-196.65Q122.40-199.80 111-199.50L89.10-198.90Q78.90-198.60 74.25-194.70Q69.60-190.80 68.40-183.45Q67.20-176.10 66.60-165.60L63.60-110.40L87-110.40Q97.80-110.70 104.40-112.50Q111-114.30 114.45-120.30Q117.90-126.30 118.50-138.60L128.40-138.60L125.10-72.90L115.20-72.90Q115.80-85.20 112.95-90.75Q110.10-96.30 103.65-97.80Q97.20-99.30 86.40-99.30Q80.70-99.30 74.85-99.15Q69-99 63-98.40L59.70-35.70Q59.40-27.60 58.80-21.75Q58.20-15.90 57.60-12Q62.70-12.30 67.80-12.45Q72.90-12.60 78-12.90Q83.10-13.20 88.20-13.20L87.60 0L12.30 0L12.90-9.90Q24.30-10.50 28.80-15.15Q33.30-19.80 34.20-28.05Q35.10-36.30 35.40-46.80L42.60-176.40Q42.90-182.40 43.50-187.95Q44.10-193.50 44.70-198Q39.30-197.70 33.75-197.40Q28.20-197.10 22.80-196.80 M272.10 4.80Q242.10 4.80 220.05-7.80Q198-20.40 186.75-44.10Q175.50-67.80 177.30-100.50Q178.50-121.80 185.85-142.05Q193.20-162.30 206.70-178.80Q220.20-195.30 240.15-205.05Q260.10-214.80 286.20-214.80Q297-214.80 307.95-212.85Q318.90-210.90 329.10-207.30Q339.30-203.70 347.40-198.60L346.80-212.70L363.30-212.70L359.70-144L348.90-144Q348.60-162.90 340.50-175.95Q332.40-189 318.60-195.90Q304.80-202.80 287.40-202.80Q271.50-202.80 257.10-195.75Q242.70-188.70 231.60-175.95Q220.50-163.20 213.60-145.80Q206.70-128.40 205.50-107.40Q204-79.20 213-57Q222-34.80 239.55-22.20Q257.10-9.60 280.80-9.60Q288.90-9.60 297.90-11.10Q306.90-12.60 315.90-16.05Q324.90-19.50 333-24.60L334.80-59.70Q335.40-67.50 335.70-75Q336-82.50 336.30-90Q331.20-89.70 325.80-89.40Q320.40-89.10 315.30-88.80L315.90-102L382.80-102L382.20-92.10Q373.80-92.10 369.15-87.75Q364.50-83.40 362.40-77.25Q360.30-71.10 359.70-65.25Q359.10-59.40 358.80-56.40L356.40-10.80L349.20-10.80Q344.40-10.80 336-9Q327.60-7.20 316.50-3Q307.20 0.60 294.60 2.70Q282 4.80 272.10 4.80';

/** Yolun ham sınır kutusu (ölçeklemeden önce). */
export const FG_BBOX = {"x1":12.299999999999999,"y1":-214.79999999999998,"x2":382.8,"y2":4.8};

/** Harf ölçeği — 28 pikselde bile okunur kalması ölçülerek seçildi. */
export const FG_OLCEK = 0.8;

/** Diskin yarıçapı (512 tuvalde). */
export const DISK_R = 208;

/**
 * Mührü SVG parçası olarak üretir.
 *
 * @param {string} diskRenk  Dolu diskin rengi
 * @param {string} harfRenk  Oyuk harflerin rengi (diskin üstünde)
 */
export function muhurSvg(diskRenk, harfRenk) {
  return (
    '<circle cx="256" cy="256" r="' + DISK_R + '" fill="' + diskRenk + '"/>' +
    '<g transform="translate(97.96 340.00) scale(' + FG_OLCEK + ')">' +
    '<path d="' + FG_PATH + '" fill="' + harfRenk + '"/>' +
    '</g>'
  );
}

/** React/JSX tarafının kullandığı hazır dönüşüm dizesi. */
export const FG_TRANSFORM = 'translate(97.96 340.00) scale(0.8)';
