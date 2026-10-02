/**
 * JSON-LD alan denetimi (Aylık plan G10 adım 2). Bir `application/ld+json` bloğunun ayrıştırılmış değerini alır,
 * sorunları `{ kural, yol, tur }` listesi olarak döndürür. Kurallar Google'ın zengin sonuç belgelerindeki zorunlu
 * alanlarla sınırlıdır; öneri niteliğindeki alanlar (image, publisher) denetlenmez.
 *
 * - context-yok: kök düğümde (ya da dizi kökündeki her düğümde) `@context` yok
 * - person-id: Person düğümü kök kişinin `@id`'sini taşımıyor (aynı kişi ayrı varlık görünür; G09)
 * - article-headline / article-author: Article türünde başlık ya da yazar yok
 * - tarih-iso: datePublished / dateModified / dateCreated / uploadDate ISO 8601 değil
 * - breadcrumb-bos / breadcrumb-sira / breadcrumb-ad: boş liste, 1'den kesintisiz olmayan sıra, adsız öğe
 * - faq-bos / faq-soru / faq-cevap: boş FAQPage, adsız soru, metinsiz cevap
 */

export const PERSON_ID = "https://www.avfethiguzel.com/#person";

const MAKALE = new Set(["Article", "ScholarlyArticle", "NewsArticle", "BlogPosting", "TechArticle", "Report"]);
const TARIHLER = ["datePublished", "dateModified", "dateCreated", "uploadDate"];
const ISO = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

const dolu = (v) => typeof v === "string" && v.trim().length > 0;
const turler = (o) => (Array.isArray(o["@type"]) ? o["@type"] : o["@type"] ? [o["@type"]] : []);

function dugumDenetle(o, yol, ekle) {
  const t = turler(o);
  const tur = t.join(",");
  const sorun = (kural) => ekle({ kural, yol, tur });

  if (t.includes("Person") && o["@id"] !== PERSON_ID) sorun("person-id");

  if (t.some((x) => MAKALE.has(x))) {
    if (!dolu(o.headline)) sorun("article-headline");
    if (!o.author) sorun("article-author");
  }

  for (const alan of TARIHLER) {
    if (o[alan] !== undefined && !(typeof o[alan] === "string" && ISO.test(o[alan]))) sorun("tarih-iso");
  }

  if (t.includes("BreadcrumbList")) {
    const ogeler = Array.isArray(o.itemListElement) ? o.itemListElement : [];
    if (!ogeler.length) sorun("breadcrumb-bos");
    else {
      if (ogeler.some((e, i) => Number(e?.position) !== i + 1)) sorun("breadcrumb-sira");
      if (ogeler.some((e) => !dolu(e?.name) && !dolu(e?.item?.name))) sorun("breadcrumb-ad");
    }
  }

  if (t.includes("FAQPage")) {
    const sorular = Array.isArray(o.mainEntity) ? o.mainEntity : o.mainEntity ? [o.mainEntity] : [];
    if (!sorular.length) sorun("faq-bos");
    if (sorular.some((s) => !dolu(s?.name))) sorun("faq-soru");
    if (sorular.some((s) => !dolu(s?.acceptedAnswer?.text))) sorun("faq-cevap");
  }
}

function gez(deger, yol, ekle) {
  if (Array.isArray(deger)) deger.forEach((d, i) => gez(d, `${yol}[${i}]`, ekle));
  else if (deger && typeof deger === "object") {
    if (deger["@type"]) dugumDenetle(deger, yol, ekle);
    for (const [k, v] of Object.entries(deger)) if (v && typeof v === "object") gez(v, yol ? `${yol}.${k}` : k, ekle);
  }
}

/** @param {unknown} blok JSON.parse edilmiş tek `ld+json` bloğu */
export function jsonLdDenetle(blok) {
  const sonuc = [];
  const ekle = (s) => sonuc.push(s);
  const kokler = Array.isArray(blok) ? blok.map((b, i) => [b, `[${i}]`]) : [[blok, ""]];
  for (const [kok, yol] of kokler) {
    if (!kok || typeof kok !== "object" || !kok["@context"]) ekle({ kural: "context-yok", yol, tur: "" });
  }
  gez(blok, "", ekle);
  return sonuc;
}
