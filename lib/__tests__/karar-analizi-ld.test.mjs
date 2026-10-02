/**
 * Karar analizi sayfası (`/icthat/[id]`) JSON-LD'si (Aylık plan G10 adım 3). Sayfada yapılandırılmış veri yoktu.
 * Analiz verisi yalnız uzak dalda üretildiği için yerel derlemede sayfa yok; kurucu işlev burada ölçülür.
 *   node --test lib/__tests__/karar-analizi-ld.test.mjs
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

const ORNEK = {
  id: "2026-09-30-yargitay-3hd",
  generatedAt: "2026-09-30T06:12:00.000Z",
  sections: { davaSozeti: "Kiracı…", mahkemeninKarari: "Daire…", benimGozlemim: "…", pratikEtki: "…" },
  highlight: {
    source: "Yargıtay",
    kunye: "3. HD, E. 2025/1, K. 2025/2",
    konu: "Kira tespiti",
    date: "2025-06-01",
    url: "https://karararama.yargitay.gov.tr/",
  },
};

describe("kararAnaliziJsonLd", () => {
  it("Article + BreadcrumbList üretir; yazar kök kişiye bağlı, denetimden sorunsuz geçer", async () => {
    const { kararAnaliziJsonLd } = await yukle("lib/karar-analizi-ld.ts");
    const { YAZAR_ID } = await yukle("lib/yazar.ts");
    const ld = kararAnaliziJsonLd(ORNEK);
    const [makale, kirinti] = ld["@graph"];
    assert.equal(makale["@type"], "Article");
    assert.equal(makale.headline, "Yargıtay 3. HD, E. 2025/1, K. 2025/2 Analizi");
    assert.equal(makale.author["@id"], YAZAR_ID);
    assert.equal(makale.datePublished, "2026-09-30T06:12:00.000Z");
    assert.equal(makale.mainEntityOfPage, "https://www.avfethiguzel.com/icthat/2026-09-30-yargitay-3hd");
    assert.equal(makale.about, "Kira tespiti");
    assert.deepEqual(makale.citation, { "@type": "CreativeWork", name: "3. HD, E. 2025/1, K. 2025/2", url: "https://karararama.yargitay.gov.tr/" });
    assert.deepEqual(kirinti.itemListElement.map((e) => e.position), [1, 2, 3]);
    assert.deepEqual(jsonLdDenetle(ld), []);
  });

  it("eksik alanları uydurmaz: tarih ISO değilse, künye ve adres yoksa alan yazılmaz", async () => {
    const { kararAnaliziJsonLd } = await yukle("lib/karar-analizi-ld.ts");
    const ld = kararAnaliziJsonLd({
      ...ORNEK,
      generatedAt: "dün",
      highlight: { source: "Danıştay", kunye: null, konu: null, date: null, url: null },
    });
    const makale = ld["@graph"][0];
    assert.equal(makale.headline, "Danıştay 2026-09-30-yargitay-3hd Analizi");
    for (const alan of ["datePublished", "about", "citation"]) assert.equal(alan in makale, false, alan);
    assert.deepEqual(jsonLdDenetle(ld), []);
  });

  it("sayfa JSON-LD'yi basar ve başlığı aynı işlevden alır", () => {
    const s = readFileSync(join(KOK, "app/icthat/[id]/page.tsx"), "utf8");
    assert.match(s, /jsonLdHtml\(kararAnaliziJsonLd\(data\)\)/);
    assert.match(s, /title:\s*kararAnaliziBasligi\(data\)/);
  });
});
