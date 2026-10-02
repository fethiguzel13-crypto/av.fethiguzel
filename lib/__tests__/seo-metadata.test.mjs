/**
 * Canonical, metadata ve site haritası değişmezleri (Aylık plan G06b; bulgular raporlar/seo-baslangic.md S1–S4, S8).
 *
 * Next metadata'yı bölümler arasında yüzeysel birleştirir: kök yerleşimdeki `alternates` kendi `alternates`
 * alanı olmayan her sayfaya miras kalır ve o sayfalar ana sayfayı canonical gösterir. Uçtan uca doğrulama
 * derlenmiş site üzerinde `node scripts/seo-tara.mjs` ile yapılır; buradaki testler kaynak düzeyinde kilittir.
 *   node --test lib/__tests__/seo-metadata.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const oku = (yol) => readFileSync(join(KOK, yol), "utf8");

function kaynaklar(dizin) {
  const sonuc = [];
  for (const o of readdirSync(join(KOK, dizin), { withFileTypes: true })) {
    const yol = `${dizin}/${o.name}`;
    if (o.isDirectory()) sonuc.push(...kaynaklar(yol));
    else if (/\.(ts|tsx)$/.test(o.name)) sonuc.push(yol);
  }
  return sonuc;
}

describe("canonical", () => {
  it("kök yerleşim canonical ve hreflang tanımlamaz (alt sayfalara miras kalıyordu)", () => {
    const src = oku("app/layout.tsx");
    const bas = src.indexOf("export const metadata");
    assert.ok(bas >= 0);
    const blok = src.slice(bas, src.indexOf("\n}\n", bas));
    assert.doesNotMatch(blok, /\balternates\s*:/);
  });

  it("ana sayfa kendi canonical'ını tanımlar", () => {
    assert.match(oku("app/page.tsx"), /canonical\s*:\s*['"`]https:\/\/www\.avfethiguzel\.com/);
  });

  it("app altında www'siz canonical yok (yönlenen adresi gösteriyordu)", () => {
    const bulunan = kaynaklar("app").filter((f) => /canonical\s*:\s*[`'"]https:\/\/avfethiguzel\.com/.test(oku(f)));
    assert.deepEqual(bulunan, []);
  });

  it("kökten canonical alan sayfalar artık kendi canonical'ını ve başlığını tanımlar", () => {
    const ROTALAR = ["makaleler", "eserlerim", "on-form", "icthat", "uyelik/sozlesme", "kategori/[slug]", "makale-oku/[...slug]"];
    const eksik = ROTALAR.filter((r) => {
      const metin = ["page.tsx", "layout.tsx"]
        .map((d) => `app/${r}/${d}`)
        .filter((f) => existsSync(join(KOK, f)))
        .map(oku)
        .join("\n");
      return !/canonical\s*:/.test(metin) || !/(title\s*:|generateMetadata)/.test(metin);
    });
    assert.deepEqual(eksik, []);
  });
});

describe("site haritası", () => {
  it("sitemap-index.xml yalnız robots.txt'de listelenen haritaları gösterir", () => {
    const robots = [...oku("app/robots.ts").matchAll(/\$\{base\}\/([\w.-]+\.xml)/g)].map((m) => `/${m[1]}`);
    assert.ok(robots.length >= 3);
    const yol = "public/sitemap-index.xml";
    if (!existsSync(join(KOK, yol))) return;
    const locs = [...oku(yol).matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    assert.ok(locs.length > 0);
    assert.deepEqual(locs.filter((l) => !robots.includes(l)), []);
  });

  it("/ingilizce-avukat kalıcı yönlenir ve site haritasında yer almaz", () => {
    assert.match(oku("app/ingilizce-avukat/page.tsx"), /permanentRedirect\(\s*['"]\/english-speaking-lawyer['"]\s*\)/);
    assert.doesNotMatch(oku("app/sitemap.ts"), /\/ingilizce-avukat[`'"]/);
  });

  it("haritalardaki adresler URL-kodludur (Türkçe karakterli 7 rehber ham yazılıyordu)", () => {
    const haritalar = readdirSync(join(KOK, "public")).filter((f) => /sitemap.*\.xml$/.test(f));
    assert.ok(haritalar.length >= 3);
    const ham = haritalar.flatMap((f) =>
      [...oku(`public/${f}`).matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)]
        .map((m) => m[1])
        .filter((u) => /[^\x21-\x7E]/.test(u))
        .map((u) => `${f}: ${u}`),
    );
    assert.deepEqual(ham, []);
  });

  it("rehber adresini üreten haritalar slug'ı kodlar", () => {
    const ureticiler = ["app/sitemap.ts", "scripts/build-bilgi-sitemap.mjs", "scripts/build-priority-sitemap.mjs"];
    const kodlamayan = ureticiler.filter((f) => /\/bilgi\/\$\{a\.slug\}/.test(oku(f)));
    assert.deepEqual(kodlamayan, []);
  });
});

describe("dinamik rotalar", () => {
  it("önceden üretilen rota searchParams okumaz (çalışma anı çiziminde DYNAMIC_SERVER_USAGE → 500)", () => {
    const hatali = kaynaklar("app").filter((f) => {
      if (!/\/page\.tsx$/.test(f)) return false;
      const src = oku(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
      return /generateStaticParams/.test(src) && /\bsearchParams\b/.test(src) && !/force-dynamic/.test(src);
    });
    assert.deepEqual(hatali, []);
  });

  it("/bilgi/[slug] Türkçe karakterli slug'ı çözer (Next parametreyi kodlu verir; 8 rehber 404 üretiliyordu)", () => {
    const veri = oku("lib/vatandas-rehberi/data.ts");
    assert.match(veri, /"slug":\s*"[^"]*[^\x00-\x7F][^"]*"/, "ön koşul: Türkçe karakterli slug var");
    const src = oku("app/bilgi/[slug]/page.tsx");
    const cozen = [...src.matchAll(/const\s*\{\s*slug(?::\s*(\w+))?\s*\}\s*=\s*await params;/g)];
    assert.equal(cozen.length, 2, "generateMetadata ve sayfa");
    for (const m of cozen) assert.ok(m[1], "ham parametre ayrı adla alınır ve çözülür");
    assert.equal((src.match(/decodeURIComponent\(/g) || []).length, 2);
    assert.match(src, /\/bilgi\/\$\{encodeURIComponent\(a\.slug\)\}/);
  });
});
