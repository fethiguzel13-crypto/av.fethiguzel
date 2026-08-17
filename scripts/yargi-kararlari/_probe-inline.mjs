import { readFileSync, writeFileSync } from 'fs';
const html = readFileSync('data/yargi-kararlari/_state/probe-home.html', 'utf8');
// find all URL-like paths and dokuman mentions
const hits = [];
for (const re of [
  /getDokuman[^"'<\s]*/gi,
  /['\"]\/[a-zA-Z0-9_\/-]*[Dd]okuman[a-zA-Z0-9_\/-]*['\"]/g,
  /['\"]\/[a-zA-Z][a-zA-Z0-9_\/-]{2,40}['\"]/g,
  /fetch\([^)]+\)/gi,
  /\.ajax\([^)]{0,200}/gi,
  /url\s*:\s*['\"][^'\"]+['\"]/gi,
]) {
  for (const m of html.matchAll(re)) hits.push(m[0]);
}
console.log([...new Set(hits)].slice(0, 80).join('\n'));

// extract large inline scripts containing arama or karar
let i = 0;
for (const m of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) {
  const t = m[1] || '';
  if (t.length > 200 && /arama|karar|dokuman|detay/i.test(t)) {
    writeFileSync('data/yargi-kararlari/_state/probe-inline-' + i + '.js', t);
    console.log('wrote inline', i, 'len', t.length);
    i++;
  }
}
