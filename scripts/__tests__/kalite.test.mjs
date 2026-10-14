/**
 * Kalite kapısı (scripts/kalite.mjs) — ayrıştırıcı ve adım listesi.
 *   node --test scripts/__tests__/kalite.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ADIMLAR, adimOrtami, derlemeIsciSayisi, kirikGunlukYolu, testSayilari } from "../kalite.mjs";
import { hataHaritasi, karsilastir } from "../lint-cirir.mjs";

describe("kalite kapısı", () => {
  it("node --test özetinden geçen/kalan sayısını okur", () => {
    assert.deepEqual(testSayilari("ℹ tests 12\nℹ pass 11\nℹ fail 1\n"), { gecen: 11, kalan: 1 });
    assert.equal(testSayilari("derleme tamam"), null);
  });

  it("kırık adımın tam çıktısı adıma özgü dosyaya yazılır (2026-10-12: derleme hatası son 25 satırın uyarılarında kayboldu)", () => {
    assert.equal(kirikGunlukYolu("derleme"), "logs/kalite-derleme-kirik.log");
    assert.equal(kirikGunlukYolu("test:quality"), "logs/kalite-test-quality-kirik.log");
    const kaynak = readFileSync(new URL("../kalite.mjs", import.meta.url), "utf8");
    assert.match(kaynak, /writeFileSync\(join\(ROOT, kirikGunlukYolu\(/);
  });

  it("tüm test takımları ve tam modda derleme adımı var", () => {
    const adlar = ADIMLAR.map((a) => a.ad);
    for (const ad of ["tip", "lint", "test:quality", "test:ders-notlari", "test:uyelik", "test:yargi", "test:mobil"]) {
      assert.ok(adlar.includes(ad), ad);
    }
    assert.equal(ADIMLAR.find((a) => a.ad === "derleme").tam, true);
  });

  it("tam modda derlemeden sonra derleme çıktısı taranır (başlık eki, JSON-LD; G10)", () => {
    const i = ADIMLAR.findIndex((a) => a.ad === "derleme");
    const tarama = ADIMLAR.findIndex((a) => a.ad === "derleme-tarama");
    assert.ok(tarama > i, "derleme-tarama derlemeden sonra gelmeli");
    assert.equal(ADIMLAR[tarama].tam, true);
    assert.match(ADIMLAR[tarama].komut, /derleme-baslik-tara\.mjs/);
    assert.match(ADIMLAR[tarama].komut, /derleme-jsonld-tara\.mjs/);
  });

  it("tam modda derlenmiş site uçtan uca testlerle sınanır, hızlı kapı tarayıcı açmaz (G22)", () => {
    const i = ADIMLAR.findIndex((a) => a.ad === "derleme");
    const e2e = ADIMLAR.findIndex((a) => a.ad === "test:e2e");
    assert.ok(e2e > i, "test:e2e derlemeden sonra gelmeli");
    assert.equal(ADIMLAR[e2e].tam, true);
    assert.match(ADIMLAR[e2e].komut, /test:e2e/);
  });

  it("derleme işçi sayısı boş belleğe göre sınırlanır (2026-10-13/14: 11 işçi ~1 GB boş bellekte sayfa başına 60 sn'yi aştı)", () => {
    assert.equal(derlemeIsciSayisi(1.06e9, 12), 4);
    assert.equal(derlemeIsciSayisi(458e6, 12), 2);
    assert.equal(derlemeIsciSayisi(8e9, 12), 11);
    assert.equal(derlemeIsciSayisi(8e9, 4), 3);
    assert.equal(derlemeIsciSayisi(8e9, 1), 1);
  });

  it("işçi sınırı yalnız derleme adımına ortam değişkeniyle geçer; next.config yalnız bu değişken varsa uygular", () => {
    assert.deepEqual(adimOrtami({ ad: "derleme" }, 1.06e9, 12), { DERLEME_ISCI: "4" });
    assert.deepEqual(adimOrtami({ ad: "test:e2e" }, 1.06e9, 12), {});
    const config = readFileSync(new URL("../../next.config.ts", import.meta.url), "utf8");
    assert.match(config, /process\.env\.DERLEME_ISCI\s*&&\s*\{\s*experimental:\s*\{\s*cpus:\s*Number\(process\.env\.DERLEME_ISCI\)/);
  });
});


describe("lint cırcırı", () => {
  it("ESLint JSON'dan dosya başına hata sayısı çıkarır (uyarılar sayılmaz)", () => {
    const json = [
      { filePath: "/r/app/a.tsx", messages: [{ severity: 2 }, { severity: 1 }, { severity: 2 }] },
      { filePath: "/r/lib/b.ts", messages: [{ severity: 1 }] },
    ];
    assert.deepEqual(hataHaritasi(json, "/r"), { "app/a.tsx": 2 });
  });

  it("yeni ya da artan hata kırar; azalan taban düşürür; artan dosyanın tabanı yükselmez", () => {
    const taban = { "a.tsx": 3, "b.tsx": 2, "c.tsx": 1 };
    const simdi = { "a.tsx": 1, "b.tsx": 4, "d.tsx": 2 };
    const r = karsilastir(taban, simdi);
    assert.deepEqual(r.artan.map((x) => x.dosya).sort(), ["b.tsx", "d.tsx"]);
    assert.deepEqual(r.azalan.map((x) => x.dosya).sort(), ["a.tsx", "c.tsx"]);
    assert.deepEqual(r.yeniTaban, { "a.tsx": 1, "b.tsx": 2 });
  });
});
