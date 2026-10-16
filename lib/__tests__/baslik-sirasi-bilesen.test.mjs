/**
 * Bileşen başlık düzeyleri (G24, WCAG 1.3.1).
 *
 * 2026-10-16 yapı taramasında (`raporlar/erisilebilirlik-g24-once.json`) iki düzey atlaması bulunmuştur: Ana sayfada "Akademik Arşiv"
 * `h2`'sinden sonra makale kartları `h4`'tür, kavram sayfasında `h1`'den hemen sonra paylaşılabilir cevap kutusu `h3`'tür. Görünüm
 * sınıflarla verildiğinden düzey değişikliği görünümü etkilemez.
 *   node --test lib/__tests__/baslik-sirasi-bilesen.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const oku = (yol) => readFileSync(join(KOK, yol), "utf8");
const duzeyler = (yol) => [...oku(yol).matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));

describe("bileşen başlık düzeyleri", () => {
  it("bölüm başlığı h2 olan kart listelerinde kart başlığı h3'tür", () => {
    for (const f of ["components/Articles.tsx", "components/DailyNews.tsx"]) assert.ok(duzeyler(f).includes(2), f);
    assert.deepEqual(duzeyler("components/Articles.tsx"), [2, 3]);
    assert.deepEqual(duzeyler("components/DailyNewsCards.tsx"), [3]);
  });

  it("paylaşılabilir cevap kutusunun başlık düzeyi verilebilir, kavram sayfası h1'in altında h2 kullanır", () => {
    const kutu = oku("components/ShareableAnswer.tsx");
    assert.match(kutu, /duzey\?: 2 \| 3/);
    assert.match(kutu, /<Baslik\b/);
    assert.match(oku("app/kavram/[slug]/page.tsx"), /<ShareableAnswer\b[^>]*\bduzey=\{2\}/);
  });
});
