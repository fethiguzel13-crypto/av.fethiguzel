#!/usr/bin/env node
/**
 * Vercel "Ignored Build Step" (vercel.json → ignoreCommand). Çıkış kodu 0 derlemeyi atlar, 1 derler.
 *
 * Günlük içtihat botu her sabah commit atıyor; her yeni yayın CDN önbelleğini sıfırladığı için arama motoru
 * botları bütün madde sayfalarını yeniden ürettiriyor ve Hobby kullanım sınırı doluyordu (2026-11). Bot commit'leri
 * yalnız pazartesi (İstanbul saati) derlenir; o derleme haftanın birikmiş verisini taşır. Diğer commit'ler her zaman.
 */
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export const BOT_MESAJI = /^chore: günlük içtihat\b/;

export function derlensinMi(mesaj, tarih = new Date()) {
  if (!BOT_MESAJI.test(String(mesaj ?? ""))) return true;
  const gun = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Istanbul", weekday: "short" }).format(tarih);
  return gun === "Mon";
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const mesaj = process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "";
  const derle = derlensinMi(mesaj);
  console.log(derle ? "Derleniyor." : "Günlük içtihat commit'i: derleme pazartesiye bırakıldı.");
  process.exit(derle ? 1 : 0);
}
