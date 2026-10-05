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

describe("faqGorunurlukDenetle (G10 adım 5)", () => {
  const ld = (sorular) =>
    `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: sorular.map((name) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text: "Cevap." } })),
    })}</script>`;

  it("sayfada görünen soru geçer; React yorum ayracı ve HTML varlıkları soruyu bölmez", async () => {
    const { faqGorunurlukDenetle } = await import("../../scripts/lib/jsonld-denetim.mjs");
    const html = `<html><head>${ld(["Kira bedeli ne zaman artar?", "Avukat'ın ücreti nasıl belirlenir?"])}</head>
      <body><h3>Kira bedeli <!-- -->ne zaman artar?</h3><p>Cevap.</p><h3>Avukat&#x27;ın ücreti nasıl belirlenir?</h3></body></html>`;
    assert.deepEqual(faqGorunurlukDenetle(html), []);
  });

  it("yalnız yapılandırılmış veride (ya da betik içinde) geçen soruyu bildirir", async () => {
    const { faqGorunurlukDenetle } = await import("../../scripts/lib/jsonld-denetim.mjs");
    const html = `<html><head>${ld(["Haksız fiil nedir?"])}</head>
      <body><h1>Haksız fiil</h1><p>Özet.</p><script>self.__next_f.push("Haksız fiil nedir?")</script></body></html>`;
    assert.deepEqual(faqGorunurlukDenetle(html), ["Haksız fiil nedir?"]);
  });
});

describe("kirintiDenetle (G12 adım 5)", () => {
  const sema = (adlar, sarmal = false) => {
    const bl = {
      "@type": "BreadcrumbList",
      itemListElement: adlar.map((name, i) => ({ "@type": "ListItem", position: i + 1, name, item: `https://www.avfethiguzel.com/${i}` })),
    };
    const veri = sarmal ? { "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", name: "X" }, bl] } : { "@context": "https://schema.org", ...bl };
    return `<script type="application/ld+json">${JSON.stringify(veri)}</script>`;
  };
  const nav = (adlar) =>
    `<nav class="k" aria-label="Konum">${adlar
      .map((a, i) => (i < adlar.length - 1 ? `<a href="/${i}">${a}</a>` : `<span aria-current="page">${a}</span>`))
      .join('<span aria-hidden="true">/</span>')}</nav>`;
  const kurallarK = async (html) => {
    const { kirintiDenetle } = await import("../../scripts/lib/jsonld-denetim.mjs");
    return kirintiDenetle(html);
  };

  it("şema (grafik içinde de) ve görünür kırıntı aynı basamak sayısıyla varsa sorun yok", async () => {
    assert.deepEqual(await kurallarK(`<head>${sema(["Ana sayfa", "Kavramlar", "Haksız fiil"], true)}</head><body>${nav(["Ana sayfa", "Kavramlar", "Haksız fiil"])}</body>`), []);
  });

  it("şemasız, görünür kırıntısız, basamağı farklı ve çift şemalı sayfayı ayrı kurallarla bildirir", async () => {
    assert.deepEqual(await kurallarK(`<body>${nav(["Ana sayfa", "Bilgi"])}</body>`), ["kirinti-sema-yok"]);
    assert.deepEqual(await kurallarK(`<head>${sema(["Ana sayfa", "Bilgi"])}</head><body><nav aria-label="Ana"><a href="/">x</a></nav></body>`), ["kirinti-gorunur-yok"]);
    assert.deepEqual(await kurallarK(`<head>${sema(["Ana sayfa", "Bilgi", "Kira"])}</head><body>${nav(["Ana sayfa", "Kira"])}</body>`), ["kirinti-basamak-farki"]);
    assert.deepEqual(
      await kurallarK(`<head>${sema(["Ana sayfa", "Bilgi"])}${sema(["Ana sayfa", "Bilgi"], true)}</head><body>${nav(["Ana sayfa", "Bilgi"])}</body>`),
      ["kirinti-sema-cift"],
    );
  });
});

describe("dizineAcikSayfa (G12 adım 5)", () => {
  it("noindex sayfayı ve yönlendirmeyi dışarıda bırakır", async () => {
    const { dizineAcikSayfa } = await import("../../scripts/lib/jsonld-denetim.mjs");
    assert.equal(dizineAcikSayfa('<meta name="robots" content="index, follow"/>', { status: 200 }), true);
    assert.equal(dizineAcikSayfa("<head></head>", null), true);
    assert.equal(dizineAcikSayfa('<meta name="robots" content="noindex, follow"/>', null), false);
    assert.equal(dizineAcikSayfa('<meta name="robots" content="noindex"/>', null), false);
    assert.equal(dizineAcikSayfa('<meta name="robots" content="index, follow"/>', { status: 308, headers: { location: "/x" } }), false);
  });
});

describe("kavram sayfası", () => {
  it("görünür soru-cevap olmadan FAQPage basmaz", async () => {
    const { readFileSync } = await import("node:fs");
    const s = readFileSync(new URL("../../app/kavram/[slug]/page.tsx", import.meta.url), "utf8");
    assert.doesNotMatch(s, /FAQPage/);
  });
});
