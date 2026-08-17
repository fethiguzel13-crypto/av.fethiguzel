const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36';
for (const u of [
  'https://karar.yargitay.gov.tr/',
  'https://karararama.yargitay.gov.tr/',
  'https://emsal.uyap.gov.tr/',
]) {
  try {
    const r = await fetch(u, { headers: { 'User-Agent': UA }, redirect: 'follow' });
    const t = await r.text();
    console.log(u, '->', r.url, r.status, (t.match(/<title>[^<]+/i)||[])[0], 'len', t.length);
    console.log('  banner', /Hata taraf|getDokuman|mevcut değildir/i.test(t));
    const scripts = [...t.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]).slice(0,10);
    console.log('  scripts', scripts);
  } catch (e) {
    console.log(u, e.message);
  }
}

// emsal uyap search API
const emsalHome = await fetch('https://emsal.uyap.gov.tr/', { headers: { 'User-Agent': UA }});
const emsalHtml = await emsalHome.text();
import { writeFileSync } from 'fs';
writeFileSync('data/yargi-kararlari/_state/probe-emsal.html', emsalHtml);
const endpoints = [...emsalHtml.matchAll(/url\s*:\s*["']([^"']+)["']/gi)].map(m=>m[1]);
const endpoints2 = [...emsalHtml.matchAll(/["']\/[a-zA-Z][^"']{2,60}["']/g)].map(m=>m[0]);
console.log('emsal urls', [...new Set([...endpoints, ...endpoints2])].slice(0,40));
