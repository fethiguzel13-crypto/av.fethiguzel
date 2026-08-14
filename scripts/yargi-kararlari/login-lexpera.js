/**
 * Tek seferlik Lexpera oturumu — ayrı Chrome profili (LexperaBot).
 * Açık Default Chrome'a bağlanamayız; bu profilde bir kez giriş yeterli.
 *
 *   node scripts/yargi-kararlari/login-lexpera.js
 *
 * Giriş bitince terminalde Ctrl+C.
 */

import { chromium } from "playwright";
import { homedir } from "os";
import { join } from "path";

const profile = join(homedir(), "AppData", "Local", "Google", "Chrome", "User Data", "LexperaBot");

const ctx = await chromium.launchPersistentContext(profile, {
  channel: "chrome",
  headless: false,
  ignoreDefaultArgs: ["--enable-automation"],
  args: [
    "--disable-blink-features=AutomationControlled",
    "--no-first-run",
    "--no-default-browser-check",
  ],
  viewport: { width: 1400, height: 900 },
  locale: "tr-TR",
});

const page = await ctx.newPage();
await page.goto("https://www.lexpera.com.tr/", { waitUntil: "domcontentloaded" });

console.log("LexperaBot profili açıldı.");
console.log("Giriş yap (abonelik hesabın). Oturum kalıcı olacak.");
console.log("Bitince bu terminale Ctrl+C bas.");

await new Promise((r) => setTimeout(r, 600_000));
await ctx.close();
