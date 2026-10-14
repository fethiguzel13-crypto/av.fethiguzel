/**
 * Kalite kapısı — tip denetimi, lint ve tüm test takımları tek komutta (Aylık plan G01).
 *
 *   npm run kalite:hizli     # derlemesiz (her commit öncesi)
 *   npm run kalite           # + next build (günde en az bir kez)
 *
 * Adımlar sırayla koşar, biri kırılsa da diğerleri denenir; sonunda özet tablo basılır ve
 * logs/kalite-son.json yazılır (otonom oturumlar ilerleme kaydına buradan aktarır).
 */

import { spawnSync } from "child_process";
import { mkdirSync, writeFileSync } from "fs";
import { cpus, freemem } from "os";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export const ADIMLAR = [
  { ad: "tip", komut: "npx tsc --noEmit -p tsconfig.json" },
  { ad: "lint", komut: "node scripts/lint-cirir.mjs" },
  { ad: "test:quality", komut: "npm run -s test:quality" },
  { ad: "test:ders-notlari", komut: "npm run -s test:ders-notlari" },
  { ad: "test:scripts", komut: "npm run -s test:scripts" },
  { ad: "test:uyelik", komut: "npm run -s test:uyelik" },
  { ad: "test:galaxy", komut: "npm run -s test:galaxy" },
  { ad: "test:yargi", komut: "npm run -s yargi:test" },
  { ad: "test:mobil", komut: "npm test --prefix mobile --silent" },
  { ad: "derleme", komut: "npm run -s build", tam: true },
  // Örneklemli SEO taramasının göremediği sınıflar: tüm derlenmiş sayfalarda çift marka eki ve JSON-LD alanları (G10), paylaşım etiketleri ve kırık paylaşım görseli (G20).
  { ad: "derleme-tarama", komut: "node scripts/derleme-baslik-tara.mjs && node scripts/derleme-jsonld-tara.mjs && node scripts/derleme-butce-tara.mjs && node scripts/derleme-og-tara.mjs", tam: true },
  // Derlenmiş site tarayıcıda: arama, madde, hesaplama, üyelik, yargı arşivi, ders notu akışları (G22). Koşucu 3123'ü kendisi açıp kapatır.
  { ad: "test:e2e", komut: "npm run -s test:e2e", tam: true },
];

/** node --test çıktısından geçen/kalan sayısını çıkarır (yoksa null). */
export function testSayilari(cikti) {
  const pass = /^ℹ pass (\d+)/m.exec(cikti);
  const fail = /^ℹ fail (\d+)/m.exec(cikti);
  return pass ? { gecen: Number(pass[1]), kalan: Number(fail?.[1] ?? 0) } : null;
}

/**
 * Derleme işçi sayısı: işçi başına ~250 MB boş bellek, en az 2, en çok çekirdek - 1 (Next.js varsayılanı).
 * 2026-10-13/14'te 11 işçi ~1 GB boş bellekte sayfa başına 60 sn sınırını aşmış, derleme üç kez kırılmıştır.
 */
export function derlemeIsciSayisi(bosBayt, cekirdek) {
  const ust = Math.max(1, cekirdek - 1);
  return Math.min(ust, Math.max(2, Math.floor(bosBayt / 250e6)));
}

/** Adıma özgü ek ortam değişkenleri. İşçi sınırı yalnız yerel kapının derlemesine geçer; yayın derlemesi etkilenmez. */
export function adimOrtami(adim, bosBayt = freemem(), cekirdek = cpus().length) {
  return adim.ad === "derleme" ? { DERLEME_ISCI: String(derlemeIsciSayisi(bosBayt, cekirdek)) } : {};
}

/** Kırık adımın tam çıktısının yazıldığı dosya; ekrandaki 25 satırlık kuyruk derlemede uyarılarla dolup hatayı gizleyebilir. */
export function kirikGunlukYolu(ad) {
  return `logs/kalite-${ad.replace(/[^a-z0-9-]+/gi, "-")}-kirik.log`;
}

function calistir(adim) {
  const t0 = Date.now();
  const ek = adimOrtami(adim);
  if (ek.DERLEME_ISCI) process.stderr.write(`(${ek.DERLEME_ISCI} işçi) `);
  const r = spawnSync(adim.komut, { cwd: ROOT, shell: true, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, ...ek, FORCE_COLOR: "0" } });
  const cikti = `${r.stdout || ""}\n${r.stderr || ""}`;
  if (r.status !== 0) {
    mkdirSync(join(ROOT, "logs"), { recursive: true });
    writeFileSync(join(ROOT, kirikGunlukYolu(adim.ad)), cikti, "utf8");
  }
  return {
    ad: adim.ad,
    ok: r.status === 0,
    kod: r.status,
    sure: Math.round((Date.now() - t0) / 1000),
    testler: testSayilari(cikti),
    kuyruk: cikti.trim().split("\n").slice(-25).join("\n"),
  };
}

function main() {
  const tam = process.argv.includes("--tam");
  const sonuc = [];
  for (const adim of ADIMLAR) {
    if (adim.tam && !tam) continue;
    process.stderr.write(`▶ ${adim.ad} … `);
    const r = calistir(adim);
    process.stderr.write(`${r.ok ? "✔" : "✖"} (${r.sure} sn)\n`);
    if (!r.ok) process.stderr.write(`${r.kuyruk}\n(tam çıktı: ${kirikGunlukYolu(adim.ad)})\n\n`);
    sonuc.push(r);
  }
  const toplamTest = sonuc.reduce((s, r) => s + (r.testler?.gecen || 0), 0);
  const ozet = {
    at: new Date().toISOString(),
    tam,
    ok: sonuc.every((r) => r.ok),
    toplamTest,
    adimlar: sonuc.map(({ kuyruk, ...r }) => (r.ok ? r : { ...r, kuyruk })),
  };
  mkdirSync(join(ROOT, "logs"), { recursive: true });
  writeFileSync(join(ROOT, "logs", "kalite-son.json"), JSON.stringify(ozet, null, 2), "utf8");
  console.log("\nAdım                 Durum   Süre   Test");
  for (const r of sonuc) {
    const t = r.testler ? `${r.testler.gecen}/${r.testler.gecen + r.testler.kalan}` : "—";
    console.log(`${r.ad.padEnd(20)} ${r.ok ? "geçti " : "KIRIK "}  ${String(r.sure).padStart(4)} sn  ${t}`);
  }
  console.log(`\n${ozet.ok ? "KALİTE KAPISI GEÇTİ" : "KALİTE KAPISI KIRIK"} — toplam ${toplamTest} test`);
  process.exit(ozet.ok ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
