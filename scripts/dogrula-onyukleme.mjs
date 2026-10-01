/**
 * Önden yükleme denetimi (Aylık plan G00) — madde sayfaları rota işleyicisidir; hiçbir sayfa onlara
 * `?_rsc=` önden yükleme isteği atmamalı (2026-10-01 öncesi /mevzuat/tbk tek ziyarette 84 istek atıyordu).
 *
 *   npx next start -p 3123   (derlenmiş site)
 *   node scripts/dogrula-onyukleme.mjs [--taban=http://localhost:3123]
 */
import { chromium } from "playwright";

const TABAN = (process.argv.find((a) => a.startsWith("--taban=")) || "").slice(8) || "http://localhost:3123";
const SAYFALAR = ["/mevzuat/tbk", "/mevzuat", "/", "/ara?q=kira", "/hesaplama", "/bilgi", "/kavram", "/ders-notlari"];

const b = await chromium.launch();
let kotu = 0;
for (const yol of SAYFALAR) {
  const p = await b.newPage();
  const madde = [];
  p.on("request", (r) => {
    const u = new URL(r.url());
    if (u.host.startsWith("localhost") && /^\/mevzuat\/[^/]+\/[^/]+/.test(u.pathname) && u.searchParams.has("_rsc")) madde.push(u.pathname);
  });
  const r = await p.goto(TABAN + yol, { waitUntil: "networkidle", timeout: 120_000 });
  for (let i = 0; i < 8; i++) {
    await p.mouse.wheel(0, 3000);
    await p.waitForTimeout(400);
  }
  await p.waitForTimeout(2000);
  const ok = madde.length === 0;
  if (!ok) kotu++;
  console.log(`${ok ? "✔" : "✖"} ${String(r?.status()).padEnd(3)} ${yol.padEnd(16)} madde önden yükleme: ${madde.length}${madde.length ? ` (${madde[0]} …)` : ""}`);
  await p.close();
}
await b.close();
process.exit(kotu ? 1 : 0);
