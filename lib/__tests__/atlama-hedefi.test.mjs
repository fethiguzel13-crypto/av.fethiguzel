/**
 * Atlama bağlantısının hedefi (G24, WCAG 2.4.1).
 *
 * Kök yerleşim (`app/layout.tsx`) her sayfaya `components/SkipLink.tsx`'i koyar ve bağlantı `#main-content`'e gider. Hedef kimlik ortak
 * yerleşimde değil, sayfa ya da bileşen düzeyindeki `<main>` öğesinde verilir. 2026-10-16 yapı taramasında makale, mevzuat, içtihat
 * ve ders notu sayfalarında hedef bulunmamış, bağlantı boşa düşmüştür (`raporlar/erisilebilirlik-g24-once.json`).
 *   node --test lib/__tests__/atlama-hedefi.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const oku = (yol) => readFileSync(join(KOK, yol), "utf8");

function dosyalar(dizin, uzanti) {
  const sonuc = [];
  for (const o of readdirSync(join(KOK, dizin), { withFileTypes: true })) {
    const yol = `${dizin}/${o.name}`;
    if (o.isDirectory()) sonuc.push(...dosyalar(yol, uzanti));
    else if (uzanti.test(o.name)) sonuc.push(yol);
  }
  return sonuc;
}

describe("atlama bağlantısının hedefi", () => {
  it("kök yerleşim atlama bağlantısını koyar ve bağlantı #main-content'e gider", () => {
    assert.match(oku("app/layout.tsx"), /<SkipLink\s*\/>/);
    assert.match(oku("components/SkipLink.tsx"), /href="#main-content"/);
  });

  it("app/ ve components/ altındaki her <main> öğesi id=\"main-content\" taşır", () => {
    const eksik = [];
    for (const f of [...dosyalar("app", /\.tsx$/), ...dosyalar("components", /\.tsx$/)]) {
      for (const m of oku(f).matchAll(/<main\b([^>]*)>/g)) {
        if (!/\bid="main-content"/.test(m[1])) eksik.push(`${f}:${oku(f).slice(0, m.index).split("\n").length}`);
      }
    }
    assert.deepEqual(eksik, []);
  });
});
