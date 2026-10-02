/**
 * JSON-LD alan denetimi (Aylık plan G10 adım 2). Saf işlev `scripts/lib/jsonld-denetim.mjs`; derleme çıktısının
 * tamamı `node scripts/derleme-jsonld-tara.mjs` ile taranır.
 *   node --test lib/__tests__/jsonld-denetim.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { jsonLdDenetle, PERSON_ID } from "../../scripts/lib/jsonld-denetim.mjs";

const kurallar = (blok) => jsonLdDenetle(blok).map((s) => s.kural);
const yazar = { "@type": "Person", "@id": PERSON_ID, name: "Av. Fethi Güzel" };

describe("jsonLdDenetle", () => {
  it("geçerli blokta sorun yok", () => {
    assert.deepEqual(
      kurallar({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Article", headline: "TBK 1", author: yazar, datePublished: "2026-09-30", dateModified: "2026-10-01T10:00:00Z" },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://www.avfethiguzel.com" },
              { "@type": "ListItem", position: 2, name: "Mevzuat" },
            ],
          },
        ],
      }),
      [],
    );
  });

  it("@context yoksa bildirir", () => {
    assert.deepEqual(kurallar({ "@type": "WebPage", name: "x" }), ["context-yok"]);
  });

  it("Person kök düğümün @id'sini taşımalı; iç içe Person da denetlenir", () => {
    assert.deepEqual(
      kurallar({ "@context": "https://schema.org", "@type": "Book", name: "e-duruşma", author: { "@type": "Person", name: "Av. Fethi Güzel" } }),
      ["person-id"],
    );
  });

  it("Article türleri headline ve author ister", () => {
    assert.deepEqual(
      kurallar({ "@context": "https://schema.org", "@type": "ScholarlyArticle", name: "x" }).sort(),
      ["article-author", "article-headline"],
    );
  });

  it("tarih alanları ISO 8601 olmalı", () => {
    assert.deepEqual(
      kurallar({ "@context": "https://schema.org", "@type": "WebPage", dateModified: "30.09.2026" }),
      ["tarih-iso"],
    );
  });

  it("BreadcrumbList sıraları 1'den kesintisiz, her öğenin adı var", () => {
    const ogeler = [
      { "@type": "ListItem", position: 1, name: "A", item: "https://www.avfethiguzel.com" },
      { "@type": "ListItem", position: 3, item: "https://www.avfethiguzel.com/x" },
    ];
    assert.deepEqual(
      kurallar({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: ogeler }).sort(),
      ["breadcrumb-ad", "breadcrumb-sira"],
    );
    assert.deepEqual(kurallar({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [] }), ["breadcrumb-bos"]);
  });

  it("FAQPage soruları ad ve kabul edilmiş cevap metni taşır", () => {
    assert.deepEqual(
      kurallar({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Soru?", acceptedAnswer: { "@type": "Answer", text: "Cevap." } },
          { "@type": "Question", name: "Soru 2?", acceptedAnswer: { "@type": "Answer", text: "" } },
        ],
      }),
      ["faq-cevap"],
    );
    assert.deepEqual(kurallar({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [] }), ["faq-bos"]);
  });

  it("dizi kökü (birden çok düğüm) desteklenir; sorun yolu verir", () => {
    const s = jsonLdDenetle([{ "@context": "https://schema.org", "@type": "Thing" }, { "@context": "https://schema.org", "@type": "Person", name: "x" }]);
    assert.equal(s.length, 1);
    assert.equal(s[0].kural, "person-id");
    assert.equal(s[0].yol, "[1]");
  });
});
