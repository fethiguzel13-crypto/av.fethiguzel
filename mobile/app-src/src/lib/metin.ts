/**
 * Resmî metnin okunabilir hâle getirilmesi.
 *
 * Kanun metinleri mevzuat.gov.tr PDF'lerinden alındığı için satırlar SAYFA
 * genişliğinde kırılmış durumda — cümlenin ortasında. Telefonda bu, her
 * satırın rastgele yerde bittiği bir duvar üretiyor:
 *
 *   Madde 17 - Belirsiz süreli iş sözleşmelerinin feshinden önce durumun diğer tarafa
 *   bildirilmesi gerekir.
 *
 * Burada satırlar CÜMLEYE göre birleştirilir, fıkra ve bent yapısı korunur.
 * Kanun metninin yapısı anlamın parçasıdır: «a) …» ile «(2) …» ayrı
 * satırlarda durmalı, ama cümlenin devamı aynı satıra dönmeli.
 */

export type BlokTur = 'baslik' | 'fikra' | 'bent' | 'paragraf';

export type Blok = {
  tur: BlokTur;
  metin: string;
  /** Bent işareti — «a)», «(2)», «I –» */
  isaret?: string;
};

/**
 * Yeni bir yapı birimi başlatan satır mı?
 *
 * Fıkra «(1)», bent «a)» / «A)» / «1)», romen «I -», madde başı «MADDE 5-»
 * ve büyük harfli kenar başlıkları. Bu satırlar bir öncekine YAPIŞTIRILMAZ.
 */
const YAPI_BASI =
  /^\s*(?:\(\d{1,3}\)|\d{1,3}\s*\)|[a-zçğıöşü]\s*\)|[A-ZÇĞİÖŞÜ]\s*\)|[IVXLCDM]{1,5}\s*[-–—.)]|(?:EK\s+|GEÇİCİ\s+)?MADDE\s+\d|Madde\s+\d)/;

/** Cümle bitmiş mi? */
const CUMLE_SONU = /[.:;!?]\s*$/;

/** Yalnız büyük harflerden oluşan kenar başlığı satırı */
function buyukHarfBasligi(satir: string): boolean {
  const s = satir.trim();
  if (s.length < 4 || s.length > 90) return false;
  if (!/[A-ZÇĞİÖŞÜ]{3}/.test(s)) return false;
  return s === s.toLocaleUpperCase('tr-TR') && !/\d{3,}/.test(s);
}

/**
 * Resmî metnin markdown işaretlerini temizler.
 *
 * Metin markdown olarak saklanır: kenar başlığı `**kalın**`, ardından `---`
 * ayracı, sonra madde metni, sonunda bir ayraç daha. Başlık ÇOK SATIRLI
 * olabilir ("BAŞLANGIÇ\nA. Hukukun uygulanması…"), o yüzden `[\s\S]` gerekir;
 * `.` satır sonunu geçmediği için önceki desen bu başlıklarda hiç eşleşmiyor
 * ve kullanıcı madde metninin ortasında ham `---` görüyordu.
 */
export function temizleResmi(md: string): { baslik: string; govde: string } {
  const ham = String(md || '').replace(/\r/g, '');
  let baslik = '';
  let govde = ham;

  const m = /^\*\*([\s\S]+?)\*\*\s*\n+---\s*\n+/.exec(ham);
  if (m) {
    baslik = m[1].replace(/\s*\n\s*/g, ' · ').trim();
    govde = ham.slice(m[0].length);
  }

  govde = govde
    .replace(/^[ \t]*---[ \t]*$/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { baslik, govde };
}

/**
 * Satırları cümleye göre birleştirip yapı bloklarına ayırır.
 *
 * Birleştirme kuralı: önceki satır cümle sonu noktalamasıyla BİTMİYORSA ve
 * sonraki satır yeni bir yapı birimi BAŞLATMIYORSA, iki satır tek satıra
 * getirilir. Böylece PDF'ten gelen sayfa genişliği kırıkları kapanır, kanunun
 * kendi fıkra/bent düzeni bozulmaz.
 */
export function bloklaResmi(govde: string): Blok[] {
  const satirlar = String(govde || '')
    .replace(/\r/g, '')
    .split('\n');

  // 1. Aşama — satırları birleştir
  const birlesik: string[] = [];
  for (const ham of satirlar) {
    const satir = ham.replace(/\s+$/, '');
    if (!satir.trim()) {
      if (birlesik.length && birlesik[birlesik.length - 1] !== '') birlesik.push('');
      continue;
    }

    const onceki = birlesik.length ? birlesik[birlesik.length - 1] : '';
    const yeniYapi = YAPI_BASI.test(satir) || buyukHarfBasligi(satir);
    const oncekiBitmis = !onceki || onceki === '' || CUMLE_SONU.test(onceki);
    const oncekiBaslik = buyukHarfBasligi(onceki);

    if (!onceki || onceki === '' || yeniYapi || oncekiBitmis || oncekiBaslik) {
      birlesik.push(satir.trim());
    } else {
      // Tireyle bölünmüş kelime: «sorum-\nluluk» → «sorumluluk»
      const kirikKelime = /[a-zçğıöşü]-$/.test(onceki);
      birlesik[birlesik.length - 1] = kirikKelime
        ? onceki.slice(0, -1) + satir.trim()
        : `${onceki} ${satir.trim()}`;
    }
  }

  // 2. Aşama — blok türü ver
  const bloklar: Blok[] = [];
  for (const satir of birlesik) {
    if (!satir) continue;
    if (buyukHarfBasligi(satir)) {
      bloklar.push({ tur: 'baslik', metin: satir });
      continue;
    }
    const bent = /^\s*((?:\(\d{1,3}\)|\d{1,3}\)|[a-zçğıöşüA-ZÇĞİÖŞÜ]\)|[IVXLCDM]{1,5}\s*[-–—.)]))\s*(.*)$/.exec(satir);
    if (bent) {
      const isaret = bent[1].trim();
      const govdeMetni = bent[2].trim();
      bloklar.push({
        tur: /^\(\d/.test(isaret) ? 'fikra' : 'bent',
        isaret,
        metin: govdeMetni || satir.trim(),
      });
      continue;
    }
    bloklar.push({ tur: 'paragraf', metin: satir });
  }

  return bloklar;
}

const HTML_VARLIK: Record<string, string> = {
  '&ldquo;': '“', '&rdquo;': '”', '&rsquo;': '’', '&lsquo;': '‘', '&hellip;': '…',
  '&acirc;': 'â', '&Acirc;': 'Â', '&icirc;': 'î', '&Icirc;': 'Î', '&ucirc;': 'û',
  '&ocirc;': 'ô', '&nbsp;': ' ', '&amp;': '&', '&quot;': '"', '&#39;': "'",
  '&ccedil;': 'ç', '&Ccedil;': 'Ç', '&uuml;': 'ü', '&Uuml;': 'Ü', '&ouml;': 'ö',
  '&Ouml;': 'Ö', '&mdash;': '—', '&ndash;': '–', '&lt;': '<', '&gt;': '>',
};

/**
 * Yargıtay karar metnini okunabilir hâle getirir.
 *
 * Karar metinleri karararama.yargitay.gov.tr'den HTML olarak alındığı için
 * üç sorun taşır ve üçü de ekranda görünür:
 *
 *   1. Kodlanmış varlıklar: «&ldquo;alacak&rdquo;», «TCY&rsquo;nın».
 *   2. Künye satırı İKİ KEZ tekrar eder (kaynak sayfada başlık + gövde).
 *   3. `\r\n` ve boşluk yığınları paragrafları parçalar.
 *
 * Üçü de burada temizlenir; metnin kendisine dokunulmaz.
 */
export function temizleKarar(ham: string): string {
  let s = String(ham || '').replace(/&[a-zA-Z]+;|&#\d+;/g, (m) => {
    if (HTML_VARLIK[m]) return HTML_VARLIK[m];
    const kod = /^&#(\d+);$/.exec(m);
    if (kod) {
      const n = Number(kod[1]);
      if (n > 31 && n < 0x10000) return String.fromCharCode(n);
    }
    return ' ';
  });

  s = s.replace(/\r/g, '');

  // Künye tekrarı: ilk satır aynen ikinci kez geçiyorsa ikincisi atılır
  const ilkSatir = s.split('\n').find((l) => l.trim().length > 10)?.trim();
  if (ilkSatir) {
    const ikinci = s.indexOf(ilkSatir, s.indexOf(ilkSatir) + ilkSatir.length);
    if (ikinci > 0 && ikinci < 900) {
      s = s.slice(0, ikinci) + s.slice(ikinci + ilkSatir.length);
    }
  }

  return s
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Karar metnini paragraflara böler — okuma görünümü için. */
export function kararParagraflari(ham: string): string[] {
  return temizleKarar(ham)
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 1);
}

/** Arama alıntısı ve paylaşım için düz metin. */
export function duzMetin(md: string): string {
  const { govde } = temizleResmi(md);
  return bloklaResmi(govde)
    .map((b) => (b.isaret ? `${b.isaret} ${b.metin}` : b.metin))
    .join('\n');
}

/**
 * «Türk Medeni Kanunu Madde 166 - Boşanma» → «Boşanma».
 *
 * Geriye bir şey kalmıyorsa BOŞ döner, başlığı olduğu gibi geri vermez:
 * çoğu maddenin `title` alanı yalnız «İş Kanunu Madde 17» biçiminde ve onu
 * madde numarasının altına ikinci kez basmak, ekranda aynı bilginin iki kez
 * yazılması demekti. Çağıran taraf boş dönüşte kenar başlığına düşer.
 */
export function maddeBasligiTemizle(title: string): string {
  const s = String(title || '');
  return s.replace(/^.*?Madde\s+\d+[a-zA-Z]?\s*[-–—:]?\s*/i, '').trim();
}

/**
 * Paylaşım ve alıntı için Türk hukuk atıf biçimi.
 *
 * «TBK m. 13 — Sözleşmenin şekli» satırından sonra metin, en altta kaynak.
 * Avukatın dilekçeye yapıştırabileceği hâl budur; ham ekran metni değil.
 */
export function atifMetni(opts: {
  kod: string;
  kanunAdi: string;
  maddeNo: number | string;
  baslik?: string;
  govde: string;
  url?: string;
}): string {
  const bas = opts.baslik ? ` — ${opts.baslik}` : '';
  const satirlar = [
    `${opts.kod} m. ${opts.maddeNo}${bas}`,
    '',
    opts.govde.trim(),
    '',
    `Kaynak: ${opts.kanunAdi}`,
  ];
  if (opts.url) satirlar.push(opts.url);
  return satirlar.join('\n');
}
