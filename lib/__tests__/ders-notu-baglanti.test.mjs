/**
 * Ders notu bağlantıları (Aylık plan G11; G06 S5): fakülte sayfasının öne çıkan paketleri sürüm kodlarını elle
 * yazıyordu (`hmk-yillik`, `icra-yillik`, `anayasa-donem-2` …); o fakültede not dosyası yoksa bağlantı 404 veriyordu.
 * Bileşen gerçek veriyle çizilir; her not bağlantısı var olan bir nota çözülmelidir.
 *   node --test lib/__tests__/ders-notu-baglanti.test.mjs
 */
import { register } from "node:module";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

register("../uyelik/__tests__/ts-hooks.mjs", import.meta.url);
register("./tsx-hooks.mjs", import.meta.url);

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const yukle = (yol) => import(pathToFileURL(join(KOK, yol)).href);

/** G06 taramasında kırık bağlantı görülen fakülteler. */
const FAKULTELER = ["mef", "asbu", "turk-alman", "izmir-katip-celebi", "ankara-medipol", "izmir-bakircay"];

function notBaglantilari(html, uni) {
  const re = new RegExp(`href="/ders-notlari/${uni}/([a-z0-9-]+)"`, "g");
  return [...new Set([...html.matchAll(re)].map((m) => m[1]))];
}

describe("fakülte sayfası not bağlantıları", () => {
  for (const uni of FAKULTELER) {
    it(`${uni}: her not bağlantısı var olan nota gider`, async () => {
      const { createElement } = await import("react");
      const { renderToStaticMarkup } = await import("react-dom/server");
      const { UniHubView } = await yukle("components/DersNotuView.tsx");
      const { resolveNoteCourseCode } = await yukle("lib/ders-notlari/index.ts");
      const hubs = JSON.parse(readFileSync(join(KOK, "lib/ders-notlari/generated/hubs.json"), "utf8"));
      const hub = hubs.find((h) => h.uni.slug === uni);
      assert.ok(hub, `${uni} hub verisi yok`);
      const kodlar = notBaglantilari(renderToStaticMarkup(createElement(UniHubView, { hub })), uni);
      assert.ok(kodlar.length > 0, "hiç not bağlantısı çizilmedi");
      const kirik = kodlar.filter((k) => resolveNoteCourseCode(uni, k) === null);
      assert.deepEqual(kirik, [], `${uni} sayfasında var olmayan nota bağlantı`);
    });
  }
});

describe("not sayfası paket bağlantıları", () => {
  // ankara: dizine açık temsilci notlar (G11); mef: G06 taramasında kırık bağlantı görülen fakülte.
  for (const uni of ["ankara", "mef"]) it(`${uni}: her ders kökünün yıllık notunda sürüm ve dipnot bağlantıları var olan nota gider`, async () => {
    const { createElement } = await import("react");
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { DersNotuView } = await yukle("components/DersNotuView.tsx");
    const { resolveNoteCourseCode, getNote, getHub } = await yukle("lib/ders-notlari/index.ts");
    const hub = getHub(uni);
    const notlar = readdirSync(join(KOK, "lib/ders-notlari/generated/notes"))
      .filter((f) => f.startsWith(`${uni}__`) && f.endsWith("-yillik.json"))
      .map((f) => f.slice(uni.length + 2, -5));
    assert.ok(notlar.length > 20, `yalnız ${notlar.length} yıllık not`);
    const kirik = [];
    for (const kod of notlar) {
      const html = renderToStaticMarkup(createElement(DersNotuView, { note: getNote(uni, kod), hub }));
      for (const hedef of notBaglantilari(html, uni)) {
        if (resolveNoteCourseCode(uni, hedef) === null) kirik.push(`${kod} → ${hedef}`);
      }
    }
    assert.deepEqual(kirik, []);
  });
});
