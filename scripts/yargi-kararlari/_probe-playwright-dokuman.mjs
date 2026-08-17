import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const BASE = 'https://karararama.yargitay.gov.tr';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
  locale: 'tr-TR',
});
const page = await ctx.newPage();

// capture getDokuman network
const dokResponses = [];
page.on('response', async (res) => {
  const u = res.url();
  if (/getDokuman|aramadetay|dokuman/i.test(u)) {
    let body = '';
    try { body = await res.text(); } catch {}
    dokResponses.push({
      url: u,
      status: res.status(),
      len: body.length,
      head: body.slice(0, 120).replace(/\s+/g, ' '),
      isJson: body.trim().startsWith('{'),
    });
  }
});

await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 90000 });
console.log('title', await page.title());

// try open karar via UI - select HGK and search
// fill date range and click search if possible
const html = await page.content();
writeFileSync('data/yargi-kararlari/_state/probe-playwright-home.html', html);

// Direct evaluate after interacting with captcha field if present
const captchaInfo = await page.evaluate(() => {
  const els = [...document.querySelectorAll('input,img')].map((e) => ({
    tag: e.tagName,
    id: e.id,
    name: e.name,
    src: e.getAttribute('src'),
    type: e.getAttribute('type'),
  }));
  return els.filter((e) => /captcha|guvenlik|kod/i.test(JSON.stringify(e)));
});
console.log('captcha els', captchaInfo);

// warm session with search POST via page.evaluate
const searchRes = await page.evaluate(async () => {
  const body = {
    data: {
      arananKelime: '',
      esasYil: '',
      esasIlkSiraNo: '',
      esasSonSiraNo: '',
      kararYil: '',
      kararIlkSiraNo: '',
      kararSonSiraNo: '',
      baslangicTarihi: '01.01.2020',
      bitisTarihi: '31.12.2020',
      siralama: '3',
      siralamaDirection: 'desc',
      birimYrgKurulDaire: 'Hukuk Genel Kurulu',
      birimYrgHukukDaire: '',
      birimYrgCezaDaire: '',
      pageSize: 5,
      pageNumber: 1,
    },
  };
  const r = await fetch('/aramadetaylist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const t = await r.text();
  let id = null;
  try { id = JSON.parse(t)?.data?.data?.[0]?.id; } catch {}
  return { status: r.status, len: t.length, id, head: t.slice(0, 100) };
});
console.log('search via page', searchRes);

if (searchRes.id) {
  // try jquery-style get like the site
  const doc = await page.evaluate(async (id) => {
    const r = await fetch('getDokuman?id=' + id, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
    });
    const t = await r.text();
    return {
      status: r.status,
      len: t.length,
      isJson: t.trim().startsWith('{'),
      head: t.slice(0, 250).replace(/\s+/g, ' '),
      contentType: r.headers.get('content-type'),
    };
  }, searchRes.id);
  console.log('getDokuman after search', doc);

  // try page.goto to getDokuman URL
  const resp = await page.goto(BASE + '/getDokuman?id=' + searchRes.id, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  const body = await page.content();
  console.log('goto status', resp?.status(), 'bodyLen', body.length, 'title', await page.title());
  writeFileSync('data/yargi-kararlari/_state/probe-goto-dokuman.html', body.slice(0, 5000));
}

console.log('network hits', JSON.stringify(dokResponses, null, 2));
await browser.close();
