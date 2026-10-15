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
// ISO 8601 azaltılmış hassasiyet de geçerlidir (schema.org Date): kitabevi yalnız ay verirse gün uydurulmaz.
const ISO = /^\d{4}(-\d{2}(-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?)?)?$/;

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

const VARLIK = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const varlikCoz = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, v) =>
    v[0] === "#" ? String.fromCodePoint(v[1] === "x" || v[1] === "X" ? parseInt(v.slice(2), 16) : Number(v.slice(1))) : VARLIK[v.toLowerCase()] ?? m,
  );
const bosluk = (s) => s.replace(/\s+/g, " ").trim();

const ldBloklari = (html) => {
  const bloklar = [];
  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      bloklar.push(JSON.parse(m[1]));
    } catch {
      /* geçersiz blok jsonLdDenetle taramasında ayrıca bildirilir */
    }
  }
  return bloklar;
};

/**
 * Sayfanın dizine açık olup olmadığı (G12 adım 5): robots meta'sında noindex yoksa ve derleme kaydı yönlendirme ya da
 * hata durumu göstermiyorsa açıktır.
 * @param {string} html derlenmiş sayfa
 * @param {{ status?: number } | null} meta derleme çıktısındaki `.meta` kaydı (yoksa null)
 */
export function dizineAcikSayfa(html, meta) {
  if (meta?.status && meta.status >= 300) return false;
  const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  return !(robots && /noindex/i.test(robots[1]));
}

/**
 * Kırıntı denetimi (G12 adım 5): BreadcrumbList şeması tek, görünür kırıntı (`<nav aria-label="Konum">`, `<Kirinti>`)
 * var ve ikisi aynı basamak sayısında. Görünür basamak = bağlantılar + `aria-current="page"` öğesi.
 * @param {string} html derlenmiş sayfa
 * @returns {string[]} ihlal edilen kurallar
 */
export function kirintiDenetle(html) {
  const listeler = [];
  for (const blok of ldBloklari(html)) {
    (function topla(d) {
      if (Array.isArray(d)) return d.forEach(topla);
      if (!d || typeof d !== "object") return;
      if (turler(d).includes("BreadcrumbList")) listeler.push(d);
      for (const v of Object.values(d)) if (v && typeof v === "object") topla(v);
    })(blok);
  }
  const nav = html.match(/<nav\b[^>]*\baria-label=["']Konum["'][^>]*>([\s\S]*?)<\/nav>/i);
  const sorunlar = [];
  if (!listeler.length) sorunlar.push("kirinti-sema-yok");
  if (listeler.length > 1) sorunlar.push("kirinti-sema-cift");
  if (!nav) sorunlar.push("kirinti-gorunur-yok");
  if (listeler.length === 1 && nav) {
    const sema = Array.isArray(listeler[0].itemListElement) ? listeler[0].itemListElement.length : 0;
    const gorunur = (nav[1].match(/<a\b|<span\b[^>]*aria-current=["']page["']/gi) || []).length;
    if (sema !== gorunur) sorunlar.push("kirinti-basamak-farki");
  }
  return sorunlar;
}

/**
 * FAQPage sorularının sayfada görünür olup olmadığını denetler (G10 adım 5). Google'ın SSS yönergesi: işaretlenen
 * soru-cevap sayfada kullanıcıya görünmelidir. Görünür metin betik, stil ve yorumlar atılarak çıkarılır.
 * @param {string} html derlenmiş sayfa
 * @returns {string[]} görünür metinde bulunmayan sorular
 */
export function faqGorunurlukDenetle(html) {
  const sorular = [];
  for (const veri of ldBloklari(html)) {
    (function topla(d) {
      if (Array.isArray(d)) return d.forEach(topla);
      if (!d || typeof d !== "object") return;
      if (turler(d).includes("FAQPage")) {
        for (const s of Array.isArray(d.mainEntity) ? d.mainEntity : [d.mainEntity]) if (dolu(s?.name)) sorular.push(s.name);
      }
      for (const v of Object.values(d)) if (v && typeof v === "object") topla(v);
    })(veri);
  }
  if (!sorular.length) return [];
  const metin = bosluk(
    varlikCoz(
      html
        .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
        .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<[^>]+>/g, " "),
    ),
  );
  return sorular.filter((s) => !metin.includes(bosluk(s)));
}
