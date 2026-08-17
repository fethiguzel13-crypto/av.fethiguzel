/**
 * mevzuat.gov.tr resmî metninin düz metin hâlini okumak için ortak ilkeler.
 *
 * Hem `repair-official-text.mjs` (metni külliyata yazar) hem
 * `compare-official-text.mjs` (yazılanı kaynakla karşılaştırır) buradan
 * beslenir. Ayrı kopyalar tutulursa doğrulama, onarımın yaptığı işi "fark"
 * diye raporlar — İİK'da %98 sapma tam olarak bu yüzden çıkmıştı.
 */

/**
 * Sayfa sınırı işareti akışta BIRAKILIR.
 *
 * Resmî PDF'te dipnotlar sayfanın altında durur; düz metne çevrildiğinde
 * dipnot gövdesinden hemen sonra sayfa değişir. Bu, dipnotun nerede
 * bittiğini söyleyen en güvenilir işarettir — fiil kalıbına bakmaktan çok
 * daha sağlam, zira "…eklenmiş ve mevcut fıkralar teselsül ettirilmiştir"
 * gibi bileşik bitişler kalıba uymuyor.
 *
 * Nöbetçi değer resmî metinde geçemeyecek bir dizi olmalıdır.
 */
export const SAYFA_SINIRI = '<<<SAYFA-SINIRI>>>';

/**
 * `MADDE 14 –`, `Madde 8/a –`, `MADDE 25/A –`, `MADDE 428 İşyerinin…`
 *
 * İki incelik var, ikisi de sessiz hataya yol açmıştı:
 *  · Tire zorunlu DEĞİL — TBK m.428 tiresiz yazılmış.
 *  · Harf eki büyük ya da küçük olabilir — İSG "24/A", İİK "8/a".
 *    Harf ayrı yakalanmazsa `MADDE 25/A` gerçek 25 inci maddeyi ezer.
 */
export const MADDE_BASI =
  /^(EK\s+MADDE|GEÇİCİ\s+MADDE|MADDE|Madde)\s+(\d+)\s*(?:\/\s*([A-ZÇĞİÖŞÜa-zçğıöşü]))?\s*(?:[–—-]|(?=[A-ZÇĞİÖŞÜ(]))/;

/**
 * Kenar başlığı: kısa, cümle noktalamasıyla bitmeyen satır.
 *
 * Başlıklar çok satırlı olabilir (TMK "2. Süre" + "a. Genel olarak") ve
 * İİK'da iki nokta ile biter ("Elektronik işlemler:") — bu yüzden `:`
 * başlık dışı sayılamaz. Sayfa numaraları da bu kalıba uyar ama başlık
 * değildir; süzülmezse "**28 / b) İtirazın kaldırılması:**" çıkar.
 */
export const baslikGorunumlu = (s) =>
  s !== SAYFA_SINIRI && s.length < 80 && !/[.;,]$/.test(s) && !MADDE_BASI.test(s) && !/^\d{1,4}$/.test(s);

/**
 * Kanunun künye satırları başlık kalıbına uyar ama hiçbir maddenin kenar
 * başlığı değildir. Süzülmezse ilk maddenin başlığı "TÜRK BORÇLAR KANUNU /
 * Kanun Numarası : 6098 / Kabul Tarihi …" diye açılıyor.
 */
const KUNYE_SATIRI =
  /^(Kanun\s+Numarası|Kabul\s+Tarihi|Yayımlandığı|Not\s*:|Bu\s+Kanun(un|la)?\s|\(?\d{1,2}\/\d{1,2}\/\d{4})/i;

export const kunyeAyikla = (satirlar) => satirlar.filter((s) => !KUNYE_SATIRI.test(s));

/** Ayıklamadan sonra metinde kalmaması gereken satırlar. */
export const supheliSatir = (s) =>
  /^\d{1,4}$/.test(s) || s === SAYFA_SINIRI || /^Bu maddenin uygulanması ile ilgili/.test(s);

/** Sayfa sınırı yoksa dipnot gövdesini bitiren fiiller. */
const DIPNOT_SONU =
  /(değiştirilmiştir|eklenmiştir|yürürlükten kaldırılmıştır|iptal edilmiştir|yürürlüğe girer|bakınız|kaldırılmıştır|çıkarılmıştır|hüküm altına alınmıştır|yayımlanmıştır|kabul edilmiştir)\.\s*$/i;

/**
 * Kaynak metni satırlara böler; sayfa sınırlarını nöbetçi değere çevirir.
 */
export const satirlaraBol = (kaynak) =>
  kaynak
    .split(/\r?\n/)
    .map((s) => (/^={3,}\s*SAYFA/.test(s) ? SAYFA_SINIRI : s.trim()))
    .filter(Boolean);

/**
 * Madde gövdesinden dipnot ve sayfa numarası satırlarını AYIKLAR.
 *
 * Tek güvence: çıktı, girdinin satır alt dizisidir. Hiçbir satır
 * DEĞİŞTİRİLMEZ, yalnız bütünüyle atılır. Böylece elde kalan her karakter
 * resmî metinden gelmiş olur; yazım düzeltme diye metne dokunulmaz.
 *
 * Dipnot gövdesinin nerede bittiği kestirilemezse blok atılmaz ve satır
 * şüpheli olarak raporlanır — yanlış kesmektense kirli bırakmak yeğdir.
 */
export function dipnotAyikla(govde) {
  const kalan = [];
  const atilan = [];
  const cozulemeyen = [];

  for (let i = 0; i < govde.length; i++) {
    const s = govde[i];

    // Sayfa sınırı: metnin parçası değil, yalnız konum bilgisi.
    if (s === SAYFA_SINIRI) continue;

    // Yalnız numaradan ibaret satır: dipnot işareti ya da sayfa numarası.
    if (/^\d{1,4}$/.test(s)) {
      atilan.push(s);
      continue;
    }

    /*
     * Dipnot gövdesi kalıbı, madde METNİNDE de görülür:
     *   HMK m.249   "19/3/1969 tarihli ve 1136 sayılı Avukatlık Kanunu hükmü…"
     *   İİK m.362/a "8/2/2007 tarihli ve 5580 sayılı Özel Öğretim Kurumları…"
     * Bunları dipnot sanıp atmak, kanun metnini sessizce silmek olurdu.
     *
     * Ayırt edici işaret şudur: gerçek dipnot gövdesinden HEMEN ÖNCE, tek
     * başına dipnot numarasını taşıyan bir satır bulunur. Madde metninde
     * böyle bir satır yoktur.
     */
    const dipnotIsaretiVar = i > 0 && /^\d{1,4}$/.test(govde[i - 1]);

    const dipnotKalibi =
      /^\d{1,2}\/\d{1,2}\/\d{4} tarihli ve \d+ sayılı/.test(s) ||
      /^Anayasa Mahkemesi(nin|’nin)? \d/.test(s) ||
      /^Bu (madde|üst) başlığı/.test(s) ||
      /^Bu maddenin uygulanması ile ilgili/.test(s);

    /*
     * Dipnot numarası bazen kendi satırında değil, gövdenin başında duruyor:
     *   "5 2/7/2018 tarihli ve 700 sayılı KHK'nin 139 uncu maddesiyle…"
     * Bu biçimde önceki satır işaret taşımaz; numara satırın kendisindedir
     * ve tek başına ayırt edici olduğu için ayrıca işaret aranmaz.
     */
    const isaretGovdeyeYapisik =
      /^\d{1,3}\s+\d{1,2}\/\d{1,2}\/\d{4} tarihli ve \d+ sayılı/.test(s) ||
      /^\d{1,3}\s+Anayasa Mahkemesi(nin|’nin)?\b/.test(s) ||
      /^\d{1,3}\s+Bu (madde|üst) başlığı/.test(s);

    if (!((dipnotKalibi && dipnotIsaretiVar) || isaretGovdeyeYapisik)) {
      kalan.push(s);
      continue;
    }

    /*
     * Dipnot gövdesi nerede biter?
     *  1. Sayfa sınırında — dipnotlar sayfanın altındadır, en güvenilir işaret.
     *  2. Sayfa sınırı yoksa (belgenin sonu) bilinen bitiş fiiliyle.
     * İkisi de bulunamazsa madde onarılmaz; kesmece tahmin yapılmaz.
     */
    let son = -1;
    for (let j = i; j < govde.length && j - i < 12; j++) {
      if (govde[j] === SAYFA_SINIRI) {
        son = j - 1;
        break;
      }
    }
    if (son === -1) {
      for (let j = i; j < Math.min(i + 8, govde.length); j++) {
        if (DIPNOT_SONU.test(govde[j])) {
          son = j;
          break;
        }
      }
    }
    if (son === -1) {
      cozulemeyen.push(s);
      kalan.push(s);
      continue;
    }
    for (let j = i; j <= son; j++) if (govde[j] !== SAYFA_SINIRI) atilan.push(govde[j]);
    i = son;
  }

  return { kalan, atilan, cozulemeyen };
}
