/**
 * Ders notu şeması (Aylık plan G18 adım 2): `AkisSemasi` sunucu bileşeni. Şema SVG'dir ve `role="img"` ile başlığını ve
 * özetini taşır; adımlar ve kanun dayanakları altta metin olarak da okunur. Bileşen statik HTML'e çizilip ölçülür.
 *   node --test lib/__tests__/ders-sema-bilesen.test.mjs
 */
import { register } from "node:module";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { SEMALAR } from "../ders-notlari/semalar.mjs";

register("../uyelik/__tests__/ts-hooks.mjs", import.meta.url);
register("./tsx-hooks.mjs", import.meta.url);

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const yukle = (yol) => import(pathToFileURL(join(KOK, yol)).href);

async function ciz(sema) {
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { default: AkisSemasi } = await yukle("components/ders-notlari/AkisSemasi.tsx");
  return renderToStaticMarkup(createElement(AkisSemasi, { sema }));
}

const akis = SEMALAR.find((s) => s.id === "medeni-yargilama");
const dal = SEMALAR.find((s) => s.id === "borc-kaynaklari");
const say = (html, desen) => (html.match(desen) || []).length;

describe("<AkisSemasi>", () => {
  it("SVG görsel rolüyle başlığa ve özete bağlanır", async () => {
    const html = await ciz(akis);
    const svg = html.match(/<svg[^>]*>/)[0];
    assert.match(svg, /role="img"/);
    const [, ids] = svg.match(/aria-labelledby="([^"]+)"/);
    const [baslikId, ozetId] = ids.split(" ");
    assert.match(html, new RegExp(`<title id="${baslikId}">${akis.baslik}</title>`));
    assert.match(html, new RegExp(`<desc id="${ozetId}">`));
    assert.ok(html.includes(akis.ozet));
  });

  // Ölçüm (2026-10-08, `g18-sema-olcum.json`): 360 px ekranda ders notu figürünün içinde çizime 278 px kalır. Etkin yazı boyu
  // orada 12 px'in altına, geniş ekranda gövde yazısının (16 px) üstüne çıkmaz.
  it("dar ekranda yazı 12 px'in altına inmez, geniş ekranda 16 px'i geçmez", async () => {
    const html = await ciz(akis);
    const [, en] = html.match(/viewBox="0 0 (\d+) \d+"/);
    const [, enCok] = html.match(/max-width:(\d+)px/);
    const boylar = [...html.matchAll(/font-size="(\d+)"/g)].map(([, b]) => Number(b));
    assert.ok(boylar.length > 0);
    for (const boy of boylar) {
      assert.ok((278 / Number(en)) * boy >= 12, `360 px'te ${((278 / Number(en)) * boy).toFixed(1)} px`);
      assert.ok((Number(enCok) / Number(en)) * boy <= 16.05, `geniş ekranda ${((Number(enCok) / Number(en)) * boy).toFixed(1)} px`);
    }
  });

  it("akış adımları numaralıdır, aralarında n-1 ok vardır", async () => {
    const html = await ciz(akis);
    assert.equal(say(html, /<circle\b/g), akis.adimlar.length);
    assert.equal(say(html, /marker-end=/g), akis.adimlar.length - 1);
  });

  it("dal şemasında numara ve ok yoktur, her kalem gövdeye bir çizgiyle bağlanır", async () => {
    const html = await ciz(dal);
    assert.equal(say(html, /marker-end=/g), 0);
    assert.equal(say(html, /<circle\b/g), dal.adimlar.length);
    assert.equal(say(html, /data-dal=/g), dal.adimlar.length);
  });

  it("metin karşılığı her adımı açıklaması ve kanun maddesi bağlantısıyla verir", async () => {
    const html = await ciz(akis);
    const liste = html.slice(html.indexOf("<ol"));
    assert.equal(say(liste, /<li\b/g), akis.adimlar.length);
    for (const a of akis.adimlar) {
      assert.ok(liste.includes(a.aciklama), a.etiket);
      assert.ok(liste.includes(`href="/mevzuat/${a.dayanak.kanun}/madde-${a.dayanak.madde}"`), a.etiket);
    }
  });

  it("uzun etiket sözcük sınırında satırlara bölünür, hiçbir satır taşmaz", async () => {
    const { satirlara } = await yukle("components/ders-notlari/AkisSemasi.tsx");
    const satirlar = satirlara("Üçüncü zümre: büyük ana ve büyük baba", 26);
    assert.ok(satirlar.length >= 2);
    for (const s of satirlar) assert.ok(s.length <= 26, s);
    assert.equal(satirlar.join(" "), "Üçüncü zümre: büyük ana ve büyük baba");
    assert.deepEqual(satirlara("Hüküm", 26), ["Hüküm"]);
  });

  it("bütün şemalar hata vermeden çizilir", async () => {
    for (const s of SEMALAR) assert.ok((await ciz(s)).includes(s.baslik), s.id);
  });
});
