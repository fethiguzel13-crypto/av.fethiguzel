import { chromium } from "playwright";
import { writeFileSync } from "fs";

const BASE = "https://karararama.yargitay.gov.tr";
const id = "16851400"; // previously downloaded known id
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  locale: "tr-TR",
});
const page = await ctx.newPage();
await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
const title = await page.title();
const res = await page.evaluate(async (id) => {
  const r = await fetch("/getDokuman?id=" + id, {
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
    },
    credentials: "include",
  });
  const t = await r.text();
  return {
    status: r.status,
    len: t.length,
    json: t.trim().startsWith("{"),
    head: t.slice(0, 180).replace(/\s+/g, " "),
  };
}, id);
console.log(JSON.stringify({ title, res }, null, 2));
writeFileSync(
  "C:/Users/HUAWEI/AppData/Local/Temp/grok-goal-819df232d772/implementer/yargi-3000-playwright-probe.json",
  JSON.stringify({ title, res }, null, 2)
);
await browser.close();
