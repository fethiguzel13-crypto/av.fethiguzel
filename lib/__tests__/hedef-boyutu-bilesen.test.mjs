/**
 * Bileşen hedef boyutları (G24, WCAG 2.2 2.5.8).
 *
 * 2026-10-17 kapanış taramasında (`raporlar/tasarim-denetim-g24.json`) içtihat listesinin 390 px görünümünde "Kaynak" bağlantısı
 * 73×16 px ölçülmüştür. Yanındaki "Analizi Oku" bağlantısıyla aralığı 16 px olduğundan aralık istisnası da uygulanmaz. Kart altındaki
 * iki bağlantı en az 24 px yüksekliğe (`min-h-6`) sahip satır içi esnek kutudur.
 *   node --test lib/__tests__/hedef-boyutu-bilesen.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const oku = (yol) => readFileSync(join(KOK, yol), "utf8");
const siniflar = (kaynak, metin) => {
  const i = kaynak.indexOf(metin);
  assert.ok(i > 0, `${metin} bulunamadı`);
  const once = kaynak.slice(0, i);
  const m = [...once.matchAll(/className="([^"]*)"/g)].at(-1);
  return m[1].split(/\s+/);
};

describe("içtihat kartı bağlantıları", () => {
  for (const metin of ["Analizi Oku", "Kaynak <ExternalLink"]) {
    it(`${metin} en az 24 px yüksekliktedir`, () => {
      const s = siniflar(oku("components/IcthatList.tsx"), metin);
      assert.ok(s.includes("min-h-6"), s.join(" "));
      assert.ok(s.includes("inline-flex") || s.includes("flex"), s.join(" "));
    });
  }
});
