/**
 * SEO taraması saf işlevleri (scripts/lib/seo-analiz.mjs, Aylık plan G06).
 *   node --test scripts/__tests__/seo-analiz.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { sitemapAyristir, sayfaOzeti, grupAdi, ornekle, tekrarlar } from "../lib/seo-analiz.mjs";

describe("site haritası ayrıştırma", () => {
  it("dizin dosyasını tanır ve alt haritaları verir", () => {
    const xml = `<?xml version="1.0"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap><loc>https://www.avfethiguzel.com/a.xml</loc></sitemap>
      <sitemap><loc> https://www.avfethiguzel.com/b.xml </loc></sitemap></sitemapindex>`;
    assert.deepEqual(sitemapAyristir(xml), {
      tur: "index",
      adresler: ["https://www.avfethiguzel.com/a.xml", "https://www.avfethiguzel.com/b.xml"],
    });
  });

  it("URL kümesini tanır ve &amp; kaçışını çözer", () => {
    const xml = `<urlset><url><loc>https://x.com/ara?q=a&amp;s=1</loc><lastmod>2026</lastmod></url>
      <url><loc>https://x.com/b</loc></url></urlset>`;
    assert.deepEqual(sitemapAyristir(xml), { tur: "urlset", adresler: ["https://x.com/ara?q=a&s=1", "https://x.com/b"] });
  });
});

describe("sayfa özeti", () => {
  const html = `<!doctype html><html><head>
    <title>Kira &amp; Tahliye | Av. Fethi Güzel</title>
    <meta content="Kiracının tahliyesi &quot;koşulları&quot;." name="description">
    <link rel="canonical" href="https://www.avfethiguzel.com/bilgi/kira"/>
    <meta name="robots" content="noindex, follow">
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"x"}</script>
    <script type="application/ld+json">[{"@type":"BreadcrumbList"},{"@type":["Person","Attorney"]}]</script>
    <script type="application/ld+json">{"@type": "FAQPage",}</script>
    </head><body><h1>Kira</h1><h1 class="x">İkinci</h1>
    <a href="/mevzuat/tbk/347">m.347</a> <a href="https://www.avfethiguzel.com/hesaplama?x=1#y">h</a>
    <a href="https://www.google.com/">g</a> <a href="#ust">üst</a> <a href="mailto:a@b.c">m</a>
    <a href="/mevzuat/tbk/347">yine</a></body></html>`;
  const o = sayfaOzeti(html, "https://www.avfethiguzel.com");

  it("başlık ve açıklamayı varlıkları çözerek okur", () => {
    assert.equal(o.baslik, "Kira & Tahliye | Av. Fethi Güzel");
    assert.equal(o.aciklama, 'Kiracının tahliyesi "koşulları".');
  });

  it("canonical ve noindex okunur", () => {
    assert.equal(o.canonical, "https://www.avfethiguzel.com/bilgi/kira");
    assert.equal(o.noindex, true);
  });

  it("JSON-LD bloklarını geçerli/geçersiz ayırır ve türleri toplar", () => {
    assert.equal(o.jsonLd.toplam, 3);
    assert.equal(o.jsonLd.gecersiz, 1);
    assert.deepEqual(o.jsonLd.turler.sort(), ["Article", "Attorney", "BreadcrumbList", "Person"]);
  });

  it("h1 sayısı ve tekilleştirilmiş iç bağlantılar (çapa ve sorgusuz yol)", () => {
    assert.equal(o.h1, 2);
    assert.deepEqual(o.icBaglantilar.sort(), ["/hesaplama", "/mevzuat/tbk/347"]);
  });

  it("etiketi olmayan sayfada boş değerler döner", () => {
    const b = sayfaOzeti("<html><body>x</body></html>", "https://www.avfethiguzel.com");
    assert.equal(b.baslik, null);
    assert.equal(b.aciklama, null);
    assert.equal(b.canonical, null);
    assert.equal(b.noindex, false);
    assert.equal(b.jsonLd.toplam, 0);
  });
});

describe("gruplama, örnekleme, tekrar", () => {
  it("yol ilk bölüm ve derinlikle gruplanır; bölge sayfaları tek grupta", () => {
    assert.equal(grupAdi("/"), "/");
    assert.equal(grupAdi("/mevzuat/tbk/49"), "mevzuat/3");
    assert.equal(grupAdi("/mevzuat/tbk"), "mevzuat/2");
    assert.equal(grupAdi("/ercis-avukat"), "bolge/1");
    assert.equal(grupAdi("/van-avukat/kira"), "bolge/2");
    assert.equal(grupAdi("https://www.avfethiguzel.com/ders-notlari/a/b?x=1"), "ders-notlari/3");
  });

  it("örnek deterministik, eşit aralıklı, ilk ve son öğeyi içerir", () => {
    const d = Array.from({ length: 100 }, (_, i) => i);
    const o = ornekle(d, 5);
    assert.equal(o.length, 5);
    assert.equal(o[0], 0);
    assert.equal(o[4], 99);
    assert.deepEqual(ornekle(d, 5), o);
    assert.deepEqual(ornekle([1, 2], 5), [1, 2]);
  });

  it("aynı değeri taşıyan sayfaları kümeler; boş değerleri yok sayar", () => {
    const s = [
      { yol: "/a", baslik: "X" },
      { yol: "/b", baslik: "X" },
      { yol: "/c", baslik: "Y" },
      { yol: "/d", baslik: null },
      { yol: "/e", baslik: null },
    ];
    assert.deepEqual(tekrarlar(s, "baslik"), [{ deger: "X", yollar: ["/a", "/b"] }]);
  });
});
