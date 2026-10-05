/**
 * Mevzuat madde sayfası (`/mevzuat/[kanunId]/[id]`, rota işleyicisi) JSON-LD'si (Aylık plan G10 adım 4).
 * Önceden: blok `JSON.stringify` ile kaçışsız basılıyordu (G03 `jsonLdHtml` kuralı dışında), şerhsiz sayfa
 * da `author` taşıyordu (resmî metin alıntısında yazarlık iddiası) ve `legislationIdentifier` resmî olmayan
 * bir kısaltmaydı ("TBK-49"). Rota derlemede çizilmediği için kurucu işlev burada ölçülür.
 *   node --test lib/__tests__/madde-ld.test.mjs
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

const GIRDI = {
  kanunId: "tbk",
  id: "madde-49",
  kanun: "Türk Borçlar Kanunu",
  maddeNo: 49,
  aciklama: "TBK 49 / TBK madde 49 / TBK m. 49 (Türk Borçlar Kanunu): Kusurlu ve hukuka aykırı…",
};

describe("maddeJsonLd", () => {
  it("şerhli maddede Article + BreadcrumbList; yazar kök kişiye bağlı, Legislation uydurma kimlik taşımaz", async () => {
    const { maddeJsonLd } = await yukle("lib/madde-ld.ts");
    const { YAZAR_ID } = await yukle("lib/yazar.ts");
    const ld = maddeJsonLd({ ...GIRDI, serhVar: true });
    const [sayfa, kirinti] = ld["@graph"];
    assert.equal(sayfa["@type"], "Article");
    assert.equal(sayfa.headline, "TBK 49 | TBK Madde 49");
    assert.equal(sayfa.author["@id"], YAZAR_ID);
    assert.equal(sayfa.mainEntityOfPage, "https://www.avfethiguzel.com/mevzuat/tbk/madde-49");
    assert.deepEqual(sayfa.about, {
      "@type": "Legislation",
      name: "Türk Borçlar Kanunu Madde 49",
      legislationJurisdiction: "TR",
    });
    // G12: kırıntı kanun sayfasından geçer (görünür kırıntıyla aynı), ad ve adresler tek kaynaktan.
    assert.deepEqual(kirinti.itemListElement.map((e) => [e.position, e.name, e.item]), [
      [1, "Ana sayfa", "https://www.avfethiguzel.com/"],
      [2, "Mevzuat", "https://www.avfethiguzel.com/mevzuat"],
      [3, "TBK", "https://www.avfethiguzel.com/mevzuat/tbk"],
      [4, "TBK Madde 49", "https://www.avfethiguzel.com/mevzuat/tbk/madde-49"],
    ]);
    assert.deepEqual(jsonLdDenetle(ld), []);
  });

  it("şerhsiz madde WebPage'dir ve yazar taşımaz", async () => {
    const { maddeJsonLd } = await yukle("lib/madde-ld.ts");
    const ld = maddeJsonLd({ ...GIRDI, serhVar: false });
    const sayfa = ld["@graph"][0];
    assert.equal(sayfa["@type"], "WebPage");
    assert.equal("author" in sayfa, false);
    assert.deepEqual(jsonLdDenetle(ld), []);
  });
});

describe("madde rotası", () => {
  it("JSON-LD'yi kaçışlı basar ve kurucu işlevden alır", () => {
    const s = readFileSync(join(KOK, "app/mevzuat/[kanunId]/[id]/route.ts"), "utf8");
    assert.match(s, /jsonLdHtml\(\s*maddeJsonLd\(/);
    assert.doesNotMatch(s, /JSON\.stringify\(jsonLd\)/);
  });
});
