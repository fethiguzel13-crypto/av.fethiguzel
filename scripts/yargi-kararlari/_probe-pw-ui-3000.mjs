import { chromium } from "playwright";
import { writeFileSync } from "fs";

const BASE = "https://karararama.yargitay.gov.tr";
const out =
  "C:/Users/HUAWEI/AppData/Local/Temp/grok-goal-819df232d772/implementer/yargi-3000-pw-ui.json";

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  locale: "tr-TR",
});
const page = await ctx.newPage();
const hits = [];
page.on("response", async (res) => {
  const u = res.url();
  if (!/getDokuman|dokuman|document/i.test(u)) return;
  let body = "";
  try {
    body = await res.text();
  } catch {}
  hits.push({
    url: u,
    status: res.status(),
    len: body.length,
    json: body.trim().startsWith("{"),
    head: body.slice(0, 120).replace(/\s+/g, " "),
  });
});

await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 90000 });
// try direct evaluate after warm
const direct = await page.evaluate(async () => {
  const body = {
    data: {
      arananKelime: "",
      esasYil: "",
      esasIlkSiraNo: "",
      esasSonSiraNo: "",
      kararYil: "",
      kararIlkSiraNo: "",
      kararSonSiraNo: "",
      baslangicTarihi: "01.01.2020",
      bitisTarihi: "31.12.2020",
      siralama: "3",
      siralamaDirection: "desc",
      birimYrgKurulDaire: "Hukuk Genel Kurulu",
      birimYrgHukukDaire: "",
      birimYrgCezaDaire: "",
      pageSize: 3,
      pageNumber: 1,
    },
  };
  const s = await fetch("/aramadetaylist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const j = await s.json();
  const id = j?.data?.data?.[0]?.id;
  if (!id) return { error: "no id", j };
  const d = await fetch("/getDokuman?id=" + id, {
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
    },
    credentials: "include",
  });
  const t = await d.text();
  return {
    id: String(id),
    status: d.status,
    len: t.length,
    json: t.trim().startsWith("{"),
    head: t.slice(0, 150).replace(/\s+/g, " "),
  };
});

writeFileSync(out, JSON.stringify({ direct, hits }, null, 2));
console.log(JSON.stringify({ direct, hitsCount: hits.length, hits }, null, 2));
await browser.close();
