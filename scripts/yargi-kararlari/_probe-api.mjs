import { writeFileSync } from 'fs';
const BASE = 'https://karararama.yargitay.gov.tr';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36';
const home = await fetch(BASE + '/', { headers: { 'User-Agent': UA } });
const html = await home.text();
writeFileSync('data/yargi-kararlari/_state/probe-home.html', html);
const scripts = [...html.matchAll(/src="([^"]+\.js)"/g)].map((m) => m[1]);
console.log('scripts', scripts);
for (const s of scripts) {
  const url = s.startsWith('http') ? s : BASE + (s.startsWith('/') ? s : '/' + s);
  try {
    const t = await (await fetch(url, { headers: { 'User-Agent': UA } })).text();
    if (/getDokuman|Dokuman|dokuman|getDocument|aramadetay/i.test(t)) {
      console.log('HIT', url, t.length);
      for (const m of t.matchAll(/.{0,80}(getDokuman|Dokuman|aramadetaylist|getDocument).{0,120}/gi)) {
        console.log('  ', m[0].replace(/\s+/g, ' ').slice(0, 200));
      }
    }
  } catch (e) {
    console.log('err', url, e.message);
  }
}
// also scan inline script
for (const m of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) {
  const t = m[1] || '';
  if (/getDokuman|dokuman/i.test(t)) {
    console.log('INLINE', t.replace(/\s+/g, ' ').slice(0, 400));
  }
}
