import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const BASE = 'https://karararama.yargitay.gov.tr';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const reqs = [];
page.on('request', (r) => {
  const u = r.url();
  if (!/\.(css|png|jpg|woff|js)(\?|$)/i.test(u) || /dokuman|arama|karar/i.test(u)) {
    if (/yargitay|dokuman|arama|karar/i.test(u)) reqs.push({ method: r.method(), url: u });
  }
});
page.on('response', async (res) => {
  const u = res.url();
  if (/dokuman|getDoc|icerik|document/i.test(u) || (res.request().resourceType() === 'xhr' && /yargitay/.test(u))) {
    let head = '';
    try { head = (await res.text()).slice(0, 150).replace(/\s+/g, ' '); } catch {}
    console.log('RESP', res.status(), u, head);
  }
});

await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });

// Use page's openKararIceregi if available after search via UI
// Set dates and HGK via DOM
await page.evaluate(() => {
  const s = document.querySelector('#baslangicTarihi') || document.querySelector('[name=baslangicTarihi]');
  const e = document.querySelector('#bitisTarihi') || document.querySelector('[name=bitisTarihi]');
  if (s) s.value = '01.01.2020';
  if (e) e.value = '31.12.2020';
});

// try click detailed search
const buttons = await page.$$eval('button, a, input[type=button], input[type=submit]', (els) =>
  els.map((el) => ({ text: (el.innerText || el.value || '').trim(), id: el.id, cls: el.className }))
);
console.log('buttons sample', buttons.filter((b) => /ara|ara |search|detay/i.test(b.text + b.id)).slice(0, 30));

// Call openKararIceregi from page if defined, after injecting a mock
const result = await page.evaluate(async () => {
  // replicate site call
  if (typeof openKararIceregi === 'function') {
    return { hasFn: true };
  }
  // look for function in window
  return {
    hasFn: typeof openKararIceregi !== 'undefined',
    keys: Object.keys(window).filter((k) => /karar|dokuman|open/i.test(k)).slice(0, 40),
  };
});
console.log('page fns', result);

// Direct jQuery if available
const jq = await page.evaluate(async () => {
  if (typeof jQuery === 'undefined' && typeof $ === 'undefined') return { nojq: true };
  const $ = window.jQuery || window.$;
  return await new Promise((resolve) => {
    $.get('getDokuman?id=638154500')
      .done((response) => resolve({ ok: true, type: typeof response, keys: response && Object.keys(response), dataLen: response?.data ? String(response.data).length : 0, sample: String(response?.data || response).slice(0, 200) }))
      .fail((xhr) => resolve({ ok: false, status: xhr.status, text: String(xhr.responseText).slice(0, 200) }));
  });
});
console.log('jquery get', jq);

// Try alternate endpoints discovered
const alts = [
  '/getDokumanHtml?id=638154500',
  '/getKarar?id=638154500',
  '/karar?id=638154500',
  '/dokuman?id=638154500',
  '/getDokuman.do?id=638154500',
  '/YargitayBilgiBankasiIslemleri/getDokuman?id=638154500',
];
for (const p of alts) {
  const r = await page.evaluate(async (path) => {
    try {
      const res = await fetch(path, { headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json, text/javascript, */*; q=0.01' }, credentials: 'include' });
      const t = await res.text();
      return { path, status: res.status, len: t.length, isJson: t.trim().startsWith('{'), head: t.slice(0, 100).replace(/\s+/g, ' ') };
    } catch (e) {
      return { path, err: e.message };
    }
  }, p);
  console.log('alt', JSON.stringify(r));
}

writeFileSync('data/yargi-kararlari/_state/probe-reqs.json', JSON.stringify(reqs, null, 2));
await browser.close();
console.log('done reqs', reqs.length);
