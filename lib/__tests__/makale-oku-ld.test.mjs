/**
 * Makale okuma sayfası (`/makale-oku/*`) dosya yolu ve JSON-LD'si (Aylık plan G10 adım 3).
 * Sayfada yapılandırılmış veri yoktu; adres parçaları çözülüp doğrudan `path.join`'e veriliyordu
 * (`..%2F..%2F` ile `public/makaleler` dışındaki dosyaya ulaşılabiliyordu).
 *   node --test lib/__tests__/makale-oku-ld.test.mjs
 */
import { register } from "node:module";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { jsonLdDenetle } from "../../scripts/lib/jsonld-denetim.mjs";

register("../uyelik/__tests__/ts-hooks.mjs", import.meta.url);

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const yukle = (yol) => import(pathToFileURL(join(KOK, yol)).href);

describe("makaleOkuJsonLd", () => {
  it("ScholarlyArticle + BreadcrumbList üretir; yazar kök kişiye bağlı, tarih uydurmaz, denetimden geçer", async () => {
    const { makaleOkuJsonLd } = await yukle("lib/makale-oku.ts");
    const { YAZAR_ID } = await yukle("lib/yazar.ts");
    const ld = makaleOkuJsonLd(["ARABULUCULUK", "arabuluculuk anlaşma belgesi.docx"]);
    const [makale, kirinti] = ld["@graph"];
    const url = "https://www.avfethiguzel.com/makale-oku/ARABULUCULUK/arabuluculuk%20anla%C5%9Fma%20belgesi.docx";
    assert.equal(makale["@type"], "ScholarlyArticle");
    assert.equal(makale.headline, "arabuluculuk anlaşma belgesi");
    assert.equal(makale.author["@id"], YAZAR_ID);
    assert.equal(makale.inLanguage, "tr-TR");
    assert.equal(makale.url, url);
    assert.equal(makale.mainEntityOfPage, url);
    assert.deepEqual(makale.encoding, {
      "@type": "MediaObject",
      contentUrl: "https://www.avfethiguzel.com/makaleler/ARABULUCULUK/arabuluculuk%20anla%C5%9Fma%20belgesi.docx",
      encodingFormat: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    for (const alan of ["datePublished", "dateModified"]) assert.equal(alan in makale, false, alan);
    assert.deepEqual(kirinti.itemListElement.map((e) => [e.position, e.name]), [
      [1, "Ana sayfa"],
      [2, "Makaleler"],
      [3, "arabuluculuk anlaşma belgesi"],
    ]);
    assert.deepEqual(jsonLdDenetle(ld), []);
  });

  it("PDF dosyasında biçim application/pdf; tanınmayan uzantıda biçim yazılmaz", async () => {
    const { makaleOkuJsonLd } = await yukle("lib/makale-oku.ts");
    assert.equal(makaleOkuJsonLd(["malpraktis", "Malpraktis.pdf"])["@graph"][0].encoding.encodingFormat, "application/pdf");
    assert.equal("encodingFormat" in makaleOkuJsonLd(["x.udf"])["@graph"][0].encoding, false);
  });
});

describe("makaleDosyaYolu", () => {
  it("makale klasöründeki dosyayı döndürür", async () => {
    const { makaleDosyaYolu } = await yukle("lib/makale-oku.ts");
    const yol = makaleDosyaYolu(["malpraktis", "Malpraktis.pdf"]);
    assert.equal(yol, join(KOK, "public", "makaleler", "malpraktis", "Malpraktis.pdf"));
  });

  it("klasör dışına çıkan, ayraç içeren ya da mutlak parçayı reddeder", async () => {
    const { makaleDosyaYolu } = await yukle("lib/makale-oku.ts");
    for (const parcalar of [
      ["..", "..", "package.json"],
      ["../../package.json"],
      ["..\\..\\package.json"],
      ["malpraktis/../../../package.json"],
      ["C:\\Windows\\win.ini"],
      ["/etc/passwd"],
      [],
      [""],
      ["malpraktis"],
      ["malpraktis", "yok.docx"],
    ]) {
      assert.equal(makaleDosyaYolu(parcalar), null, JSON.stringify(parcalar));
    }
  });
});

describe("makale-oku sayfası", () => {
  it("dosya yolunu denetimli işlevden alır ve JSON-LD'yi basar", () => {
    const s = readFileSync(join(KOK, "app/makale-oku/[...slug]/page.tsx"), "utf8");
    assert.match(s, /makaleDosyaYolu\(/);
    assert.doesNotMatch(s, /path\.join\(process\.cwd\(\), 'public', 'makaleler', \.\.\./);
    assert.match(s, /jsonLdHtml\(makaleOkuJsonLd\(/);
  });
});
