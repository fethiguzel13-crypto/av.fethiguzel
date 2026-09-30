/**
 * Kalite kapısı (scripts/kalite.mjs) — ayrıştırıcı ve adım listesi.
 *   node --test scripts/__tests__/kalite.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ADIMLAR, testSayilari } from "../kalite.mjs";
import { hataHaritasi, karsilastir } from "../lint-cirir.mjs";

describe("kalite kapısı", () => {
  it("node --test özetinden geçen/kalan sayısını okur", () => {
    assert.deepEqual(testSayilari("ℹ tests 12\nℹ pass 11\nℹ fail 1\n"), { gecen: 11, kalan: 1 });
    assert.equal(testSayilari("derleme tamam"), null);
  });

  it("tüm test takımları ve tam modda derleme adımı var", () => {
    const adlar = ADIMLAR.map((a) => a.ad);
    for (const ad of ["tip", "lint", "test:quality", "test:ders-notlari", "test:uyelik", "test:yargi", "test:mobil"]) {
      assert.ok(adlar.includes(ad), ad);
    }
    assert.equal(ADIMLAR.find((a) => a.ad === "derleme").tam, true);
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
