/**
 * Sayfa başlığında çift marka eki (Aylık plan G10, S7). Kök yerleşim `template: '%s | Av. Fethi Güzel'` ile eki
 * kendisi ekler; başlığı ekle yazan sayfa "… | Av. Fethi Güzel | Av. Fethi Güzel" olur. 2026-10-02 derlemesinde
 * 915 sayfanın 402'si böyleydi (335'i rehber: ek veride). OG ve Twitter başlıkları şablondan geçmez, onlara dokunulmaz.
 *   node --test lib/__tests__/sayfa-basligi.test.mjs
 */
import { register } from "node:module";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

register("../uyelik/__tests__/ts-hooks.mjs", import.meta.url);

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const yukle = (yol) => import(pathToFileURL(join(KOK, yol)).href);
const MARKA = "Av. Fethi Güzel";

function sayfalar(dizin) {
  const sonuc = [];
  for (const o of readdirSync(join(KOK, dizin), { withFileTypes: true })) {
    const yol = `${dizin}/${o.name}`;
    if (o.isDirectory()) sonuc.push(...sayfalar(yol));
    else if (/^(page|layout)\.tsx$/.test(o.name) && yol !== "app/layout.tsx") sonuc.push(yol);
  }
  return sonuc;
}

/** `openGraph` / `twitter` dışındaki `title: '…'` değerlerinden markayı taşıyanlar (dosya:satır). */
function markaliBasliklar(dosya) {
  const kaynak = readFileSync(join(KOK, dosya), "utf8");
  const sf = ts.createSourceFile(dosya, kaynak, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const bulgu = [];
  const gez = (dugum, sosyal) => {
    if (ts.isPropertyAssignment(dugum)) {
      const ad = dugum.name.getText(sf).replace(/['"]/g, "");
      if (ad === "openGraph" || ad === "twitter") sosyal = true;
      const d = dugum.initializer;
      const dize = ts.isStringLiteral(d) || ts.isNoSubstitutionTemplateLiteral(d) || ts.isTemplateExpression(d);
      if (ad === "title" && !sosyal && dize && d.getText(sf).includes(MARKA)) {
        bulgu.push(`${dosya}:${sf.getLineAndCharacterOfPosition(d.getStart(sf)).line + 1}`);
      }
    }
    ts.forEachChild(dugum, (c) => gez(c, sosyal));
  };
  gez(sf, false);
  return bulgu;
}

describe("sayfaBasligi", () => {
  it("sondaki marka ekini atar, gerisini korur", async () => {
    const { sayfaBasligi } = await yukle("lib/sayfa-basligi.ts");
    const ornekler = {
      "Acele kamulaştırma ne demektir — Vatandaş Rehberi | Av. Fethi Güzel": "Acele kamulaştırma ne demektir — Vatandaş Rehberi",
      "Borçlar Hukuku – Türk Borçlar Kanunu (TBK) | Av. Fethi Güzel Hukuk Portalı": "Borçlar Hukuku – Türk Borçlar Kanunu (TBK)",
      "Genel Hükümler | Av. Fethi Güzel – Hukuk Portalı": "Genel Hükümler",
      "محامٍ في تركيا | فان · أرجيش — Av. Fethi Güzel": "محامٍ في تركيا | فان · أرجيش",
      "Kanun Maddesi Arama": "Kanun Maddesi Arama",
      "Av. Fethi Güzel akademik yayınları": "Av. Fethi Güzel akademik yayınları",
    };
    for (const [girdi, beklenen] of Object.entries(ornekler)) assert.equal(sayfaBasligi(girdi), beklenen, girdi);
  });
});

describe("çift marka eki", () => {
  it("app altındaki sayfa başlıkları markayı yazmaz (kök şablon ekler; gerekiyorsa `absolute`)", () => {
    assert.deepEqual(sayfalar("app").flatMap(markaliBasliklar), []);
  });

  it("rehber sayfası veriden gelen başlığı sayfaBasligi()'ndan geçirir", () => {
    const s = readFileSync(join(KOK, "app/bilgi/[slug]/page.tsx"), "utf8");
    assert.match(s, /\btitle:\s*sayfaBasligi\(title\)/);
  });
});
