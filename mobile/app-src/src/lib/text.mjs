/**
 * Türkçe metin eşleme yardımcıları.
 *
 * Saf JS: hem uygulama (TypeScript) hem `node --test` betikleri aynı mantığı
 * kullansın diye. Tip yüzeyi için bkz. text.d.ts
 */

/** Türkçe harfleri arama için sadeleştirir. */
export function foldTr(s) {
  return String(s || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

/**
 * Boşluk duyarsız eşleme anahtarı.
 *
 * Resmî metinler tarandığında kelimelerin bir kısmı ortadan bölünmüş:
 * 8.087 maddenin 1.027'sinde "zaman aşımı", "re ddolunabilir", "ol arak"
 * gibi kırıklar var. Metnin kendisine DOKUNMUYORUZ — bir kanun uygulamasında
 * resmî metni "düzeltmek", çözdüğü sorundan büyük bir sorun üretir; üstelik
 * ölçümde kırıkların bir kısmının meşru yazım varyantı olduğu görüldü
 * ("ay başında" ≠ "aybaşında").
 *
 * Bunun yerine karşılaştırma, boşlukları atılmış bir kopya üzerinden de
 * yapılır. Yan fayda: "TBK m13" ile "TBK m. 13" aynı sonucu verir.
 */
export function tighten(s) {
  return foldTr(s).replace(/[\s.]+/g, '');
}

/**
 * Bir maddenin sorguya uygunluk puanı.
 *
 * Başlıkta geçen terim gövdede geçenden değerlidir; boşluksuz eşleşme
 * normalinden bir basamak aşağıdadır çünkü daha gevşektir. Tokenlardan biri
 * hiç bulunamazsa madde elenir — kullanıcı iki kelime yazdıysa ikisini de
 * içeren maddeyi kastediyordur.
 *
 * @param {string} title  madde başlığı (ham)
 * @param {string} body   resmî metin (ham)
 * @param {string[]} tokens  foldTr'den geçmiş sorgu parçaları
 * @returns {number} 0 = eşleşme yok
 */
export function scoreArticle(title, body, tokens) {
  if (!tokens.length) return 0;

  const hayTitle = foldTr(title);
  const hayBody = foldTr(body);
  const tightTitle = hayTitle.replace(/[\s.]+/g, '');
  const tightBody = hayBody.replace(/[\s.]+/g, '');

  let score = 0;
  for (const tok of tokens) {
    const tk = tok.replace(/[\s.]+/g, '');
    if (hayTitle.includes(tok)) score += 3;
    else if (tightTitle.includes(tk)) score += 2;
    else if (hayBody.includes(tok)) score += 1;
    else if (tightBody.includes(tk)) score += 1;
    else return 0;
  }
  return score;
}

/** Sorguyu arama parçalarına böler. */
export function tokenize(query) {
  return foldTr(query).trim().split(/\s+/).filter(Boolean);
}

/**
 * «TBK 13», «tbk m.13», «13» gibi doğrudan madde sorgularını çözer.
 * Kullanıcıların çoğu tam olarak böyle arıyor; bunu kaçırmak aramayı
 * kullanışsız kılar.
 *
 * @param {string} q
 * @param {string[]} known  tanınan kanun kimlikleri
 */
export function parseMaddeQuery(q, known = []) {
  const t = foldTr(q).replace(/\s+/g, ' ').trim();
  if (!t) return null;

  const m = t.match(/^([a-z-]{2,20})?\s*(?:m\.?|madde)?\s*(\d{1,4})[a-z]?$/);
  if (!m) return null;

  const [, rawKanun, num] = m;
  const maddeNo = parseInt(num, 10);
  if (!Number.isFinite(maddeNo)) return null;

  if (!rawKanun) return { maddeNo };
  const kanunId = known.find((k) => foldTr(k) === rawKanun);
  return kanunId ? { kanunId, maddeNo } : { maddeNo };
}
