/**
 * Yazar kutusu (Aylık plan G09): her içerik türünde yazar satırı, son güncelleme, kaynaklar ve yazar sayfasına
 * bağlantı. React bileşeni gerçek kaynaktan çizilir; madde sayfaları rota işleyicisinde HTML olarak üretildiği için
 * aynı veriden HTML sürümü de ölçülür.
 *   node --test lib/__tests__/yazar-kutusu.test.mjs
 */
import { register } from "node:module";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

register("../uyelik/__tests__/ts-hooks.mjs", import.meta.url);
register("./tsx-hooks.mjs", import.meta.url);

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const yukle = (yol) => import(pathToFileURL(join(KOK, yol)).href);

async function ciz(props = {}) {
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { default: YazarKutusu } = await yukle("components/YazarKutusu.tsx");
  return renderToStaticMarkup(createElement(YazarKutusu, props));
}

/** Reklam Yasağı Yönetmeliği: üstünlük iddiası, sonuç vaadi ve iş çağrısı yok. */
const REKLAM = /en iyi|en başarılı|uzman avukat|lider|garanti|kazan|hemen ara|bizi arayın|randevu|ücretsiz danışma/i;

describe("tarih metni", () => {
  it("ISO tarihi Türkçe gün-ay-yıl olarak yazar, geçersizi atar", async () => {
    const { tarihVerisi } = await yukle("lib/yazar.ts");
    assert.deepEqual(tarihVerisi("2026-09-30"), { iso: "2026-09-30", metin: "30 Eylül 2026" });
    assert.deepEqual(tarihVerisi("2026-01-05T10:00:00.000Z"), { iso: "2026-01-05", metin: "5 Ocak 2026" });
    assert.equal(tarihVerisi(""), null);
    assert.equal(tarihVerisi(undefined), null);
    assert.equal(tarihVerisi("2026-13-40"), null);
    assert.equal(tarihVerisi("geçen hafta"), null);
  });
});

describe("<YazarKutusu>", () => {
  it("yazar adını yazar sayfasına bağlar ve akademik kimliği PROFILE'dan yazar", async () => {
    const { PROFILE } = await yukle("lib/profile.ts");
    const html = await ciz();
    assert.match(html, /^<aside[^>]*aria-label="Yazar ve kaynak bilgisi"/);
    assert.match(html, new RegExp(`<a[^>]*href="/avukat-fethi-guzel"[^>]*>${PROFILE.name}</a>`));
    assert.ok(html.includes(PROFILE.academic.headline));
    assert.ok(html.includes(PROFILE.book.shortTitle));
  });

  it("son güncellemeyi <time> ile verir; tarih yoksa ya da geçersizse satır yoktur", async () => {
    assert.match(await ciz({ guncelleme: "2026-09-30" }), /Son güncelleme: <time dateTime="2026-09-30">30 Eylül 2026<\/time>/);
    assert.doesNotMatch(await ciz(), /Son güncelleme/);
    assert.doesNotMatch(await ciz({ guncelleme: "bilinmiyor" }), /Son güncelleme/);
  });

  it("kaynakları listeler: dış bağlantı yeni sekmede ve noopener, iç bağlantı site içinde, adressiz kaynak düz metin", async () => {
    const html = await ciz({
      kaynaklar: [
        { ad: "mevzuat.gov.tr — 6098 sayılı TBK", url: "https://www.mevzuat.gov.tr/" },
        { ad: "TBK m. 207", url: "/mevzuat/tbk/madde-207" },
        { ad: "Ders izlencesi" },
        { ad: "  " },
      ],
    });
    assert.match(html, /Kaynaklar/);
    assert.match(html, /<a[^>]*href="https:\/\/www\.mevzuat\.gov\.tr\/"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[^>]*>mevzuat\.gov\.tr — 6098 sayılı TBK<\/a>/);
    assert.match(html, /<a[^>]*href="\/mevzuat\/tbk\/madde-207"[^>]*>TBK m\. 207<\/a>/);
    assert.match(html, /<li[^>]*>Ders izlencesi<\/li>/);
    assert.equal((html.match(/<li/g) || []).length, 3);
    assert.doesNotMatch(await ciz({ kaynaklar: [] }), /Kaynaklar/);
  });

  it("reklam dili içermez", async () => {
    assert.doesNotMatch(await ciz({ guncelleme: "2026-09-30", kaynaklar: [{ ad: "x" }] }), REKLAM);
  });
});

describe("yazarKutusuHtml (madde sayfası rota işleyicisi)", () => {
  it("aynı veriyi kaçışlı HTML olarak üretir", async () => {
    const { yazarKutusuHtml } = await yukle("lib/yazar.ts");
    const { PROFILE, SITE_URL } = await yukle("lib/profile.ts");
    const html = yazarKutusuHtml({
      guncelleme: "2026-09-30",
      kaynaklar: [{ ad: "<b>mevzuat.gov.tr</b>", url: "https://www.mevzuat.gov.tr/?a=1&b=2" }],
    });
    assert.match(html, /^<aside[^>]*aria-label="Yazar ve kaynak bilgisi"/);
    assert.ok(html.includes(`<a href="${SITE_URL}/avukat-fethi-guzel">${PROFILE.name}</a>`));
    assert.ok(html.includes('<time datetime="2026-09-30">30 Eylül 2026</time>'));
    assert.ok(html.includes("&lt;b&gt;mevzuat.gov.tr&lt;/b&gt;"));
    assert.ok(html.includes('href="https://www.mevzuat.gov.tr/?a=1&amp;b=2"'));
    assert.doesNotMatch(html, REKLAM);
    assert.doesNotMatch(yazarKutusuHtml({}), /Son güncelleme|Kaynaklar/);
  });

  it("yalnız http(s) ve site içi adresleri bağlantı yapar; diğer şemalar düz metin kalır", async () => {
    const { yazarKutusuHtml } = await yukle("lib/yazar.ts");
    const html = yazarKutusuHtml({ kaynaklar: [{ ad: "x", url: "javascript:alert(1)" }, { ad: "y", url: "//kotu.example" }] });
    assert.doesNotMatch(html, /javascript:|kotu\.example/);
    assert.match(html, /<li>x<\/li><li>y<\/li>/);
    assert.doesNotMatch(await ciz({ kaynaklar: [{ ad: "x", url: "javascript:alert(1)" }] }), /javascript:/);
  });
});

describe("yerleşim: altı içerik türü", () => {
  const TURLER = {
    makale: "app/makale-oku/[...slug]/page.tsx",
    rehber: "components/VatandasRehberArticle.tsx",
    "ders notu": "components/DersNotuView.tsx",
    "karar özeti": "app/icthat/[id]/page.tsx",
    kavram: "app/kavram/[slug]/page.tsx",
  };
  for (const [tur, dosya] of Object.entries(TURLER)) {
    it(`${tur} sayfası <YazarKutusu> çizer`, () => {
      const s = readFileSync(join(KOK, dosya), "utf8");
      assert.match(s, /import YazarKutusu from ['"]@\/components\/YazarKutusu['"]/);
      assert.match(s, /<YazarKutusu\b/);
    });
  }
  it("şerh (madde sayfası) yalnız şerh varken yazar kutusu basar", () => {
    const s = readFileSync(join(KOK, "app/mevzuat/[kanunId]/[id]/route.ts"), "utf8");
    assert.match(s, /hasCommentary \? yazarKutusuHtml\(/);
  });
});
