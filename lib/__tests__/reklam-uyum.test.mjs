/**
 * Avukatlık reklam yasağı kilitleri (Aylık plan G07; rapor docs/aylik-plan/raporlar/reklam-uyum.md).
 *
 * TBB Reklam Yasağı Yönetmeliği m.7/1-e (RG 9/8/2024-32627 değişikliği): iş elde etmeye yönelik olarak arama
 * motorlarında üst sıraya çıkmaya yarayan "anahtar sözcük" ve "sayfa adresi" kullanılamaz. "Erciş avukat" türü
 * arama ifadesi metadata'ya ve mağaza metnine yazılmaz; ad-soyad ile avukat unvanı (m.7/1-d) serbesttir.
 *   node --test lib/__tests__/reklam-uyum.test.mjs
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

/** Ad-soyadı taşımayan avukat/büro arama ifadesi ("Erciş avukat", "Van Erciş hukuk bürosu"). */
const aramaIfadesi = (v) => /\b(avukat\w*|lawyer|attorney|hukuk bürosu|law firm)\b/iu.test(v) && !/Fethi Güzel/i.test(v);

describe("reklam yasağı — anahtar sözcük (m.7/1-e)", () => {
  it("metadata keywords dizilerinde avukat arama ifadesi yok", () => {
    const kaynaklar = [...dosyalar("app", /\.(ts|tsx)$/), ...dosyalar("components", /\.(ts|tsx)$/), "lib/bolge-bilgi.ts", "lib/profile.ts"];
    const bulunan = [];
    for (const f of kaynaklar) {
      for (const m of oku(f).matchAll(/keywords\s*:\s*\[([\s\S]*?)\]/g)) {
        for (const k of m[1].matchAll(/['"`]([^'"`]+)['"`]/g)) if (aramaIfadesi(k[1])) bulunan.push(`${f}: ${k[1]}`);
      }
    }
    assert.deepEqual(bulunan, []);
  });

  it("yapılandırılmış veride ücret düzeyi (priceRange) ilan edilmez", () => {
    const bulunan = [...dosyalar("app", /\.(ts|tsx)$/), ...dosyalar("components", /\.(ts|tsx)$/)].filter((f) =>
      /\bpriceRange\s*:/.test(oku(f)),
    );
    assert.deepEqual(bulunan, []);
  });

  it("mobil mağaza metinlerinde 'yer + avukat' arama kalıbı yok", () => {
    const bulunan = dosyalar("mobile/store-listing", /\.txt$/).flatMap((f) =>
      oku(f)
        .split("\n")
        .filter((satir) => /\b(Van|Erciş|Ankara|Ağrı|Bitlis|Tatvan|Patnos)\s+avukat/u.test(satir))
        .map((satir) => `${f}: ${satir.trim()}`),
    );
    assert.deepEqual(bulunan, []);
  });
});
