/**
 * Lint cırcırı (Aylık plan G01) — mevcut hatalar dosya başına tabanda (`scripts/lint-taban.json`)
 * kayıtlıdır; yeni hata eklenirse kapı kırılır, hata azalırsa taban aşağı çekilir (asla yukarı).
 * Böylece eski hatalar tek seferde riskli biçimde yeniden yazılmadan ay boyunca adım adım temizlenir.
 *
 *   node scripts/lint-cirir.mjs             # denetle (kalite kapısı bunu çağırır)
 *   node scripts/lint-cirir.mjs --taban     # tabanı mevcut duruma göre yeniden yaz (yalnız ilk kurulum)
 *
 * ESLint önbelleği logs/.eslintcache — değişmeyen dosyalar yeniden taranmaz.
 */

import { spawnSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TABAN = join(ROOT, "scripts", "lint-taban.json");

/** ESLint JSON çıktısı → { "yol/dosya.tsx": hataSayısı } (yalnız hatası olanlar). */
export function hataHaritasi(eslintJson, root = ROOT) {
  const out = {};
  for (const f of eslintJson) {
    const n = f.messages.filter((m) => m.severity === 2).length;
    if (n) out[relative(root, f.filePath).replace(/\\/g, "/")] = n;
  }
  return out;
}

/** Tabanla karşılaştır: yeni/artan hatalar, azalanlar, yeni taban. */
export function karsilastir(taban, simdi) {
  const artan = [];
  const azalan = [];
  const yeniTaban = {};
  for (const [f, n] of Object.entries(simdi)) {
    const t = taban[f] ?? 0;
    if (n > t) artan.push({ dosya: f, taban: t, simdi: n });
    else if (n < t) azalan.push({ dosya: f, taban: t, simdi: n });
    yeniTaban[f] = Math.min(n, t || n);
  }
  for (const [f, t] of Object.entries(taban)) if (!(f in simdi)) azalan.push({ dosya: f, taban: t, simdi: 0 });
  // Artan dosyalarda taban eski değerinde kalır (düzeltilene kadar kapı kırık).
  for (const a of artan) yeniTaban[a.dosya] = a.taban || undefined;
  for (const k of Object.keys(yeniTaban)) if (!yeniTaban[k]) delete yeniTaban[k];
  return { artan, azalan, yeniTaban };
}

function eslintCalistir() {
  const r = spawnSync(
    "npx eslint --cache --cache-location logs/.eslintcache -f json app components lib scripts proxy.ts mobile/app-src/src",
    { cwd: ROOT, shell: true, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 }
  );
  const start = r.stdout.indexOf("[");
  if (start < 0) throw new Error(`ESLint çıktısı okunamadı: ${(r.stderr || r.stdout).slice(0, 400)}`);
  return JSON.parse(r.stdout.slice(start));
}

function main() {
  const simdi = hataHaritasi(eslintCalistir());
  const toplam = Object.values(simdi).reduce((s, n) => s + n, 0);
  if (process.argv.includes("--taban") || !existsSync(TABAN)) {
    writeFileSync(TABAN, JSON.stringify(simdi, null, 2) + "\n", "utf8");
    console.log(`Lint tabanı yazıldı: ${toplam} hata, ${Object.keys(simdi).length} dosya`);
    return;
  }
  const taban = JSON.parse(readFileSync(TABAN, "utf8"));
  const { artan, azalan, yeniTaban } = karsilastir(taban, simdi);
  if (azalan.length && !artan.length) {
    writeFileSync(TABAN, JSON.stringify(yeniTaban, null, 2) + "\n", "utf8");
    console.log(`Taban düştü: ${azalan.length} dosyada hata azaldı`);
  }
  console.log(`Lint: ${toplam} hata (tabanda ${Object.values(taban).reduce((s, n) => s + n, 0)})`);
  if (artan.length) {
    for (const a of artan) console.log(`  YENİ HATA ${a.dosya}: ${a.taban} → ${a.simdi}`);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
