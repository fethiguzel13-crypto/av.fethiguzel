const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36';
const urls = [
  'https://emsal.uyap.gov.tr/',
  'https://bedesten.adalet.gov.tr/',
  'https://karararama.danistay.gov.tr/',
  'https://www.lexpera.com.tr/',
];
for (const u of urls) {
  try {
    const r = await fetch(u, { headers: { 'User-Agent': UA }, redirect: 'follow' });
    const t = await r.text();
    console.log(u, r.status, t.length, (t.match(/<title>[^<]+/i)||[])[0]);
  } catch (e) {
    console.log(u, 'ERR', e.message);
  }
}

// Try bedesten API patterns
const probes = [
  'https://bedesten.adalet.gov.tr/emsal-karar',
  'https://emsal.uyap.gov.tr/getDokuman?id=638154500',
  'https://emsal.uyap.gov.tr/aramadetaylist',
];
for (const u of probes) {
  try {
    const r = await fetch(u, { headers: { 'User-Agent': UA, Accept: 'application/json' }, method: u.includes('list') ? 'POST' : 'GET' });
    const t = await r.text();
    console.log('probe', u, r.status, t.slice(0, 120).replace(/\s+/g,' '));
  } catch (e) {
    console.log('probe', u, e.message);
  }
}

// Check if getDokuman works with Accept: text/html and different base path on karararama after search cookie flow with proper session via undici
import { writeFileSync } from 'fs';
// Try ID as number without string
for (const id of ['638154500', 638154500, '6381545', 'HGK-2020-1057']) {
  const r = await fetch('https://karararama.yargitay.gov.tr/getDokuman?id=' + id, {
    headers: {
      'User-Agent': UA,
      Accept: '*/*',
      Referer: 'https://karararama.yargitay.gov.tr/',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
  const t = await r.text();
  const is404 = t.includes('böyle bir içerik') || t.includes('mevcut değildir');
  const isJson = t.trim().startsWith('{');
  console.log('id', id, 'json', isJson, '404page', is404, 'len', t.length);
}
