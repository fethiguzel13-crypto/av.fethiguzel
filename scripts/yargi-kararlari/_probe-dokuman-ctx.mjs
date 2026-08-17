import { readFileSync } from 'fs';
for (const f of ['probe-inline-0.js','probe-inline-1.js','probe-inline-2.js','probe-inline-3.js']) {
  const t = readFileSync('data/yargi-kararlari/_state/' + f, 'utf8');
  const idx = t.indexOf('getDokuman');
  console.log('====', f, 'len', t.length, 'idx', idx);
  if (idx >= 0) {
    console.log(t.slice(Math.max(0, idx - 200), idx + 500));
  }
  // also print any ajax/get with id
  for (const m of t.matchAll(/.{0,60}getDokuman.{0,200}/g)) {
    console.log('CTX:', m[0].replace(/\s+/g, ' '));
  }
}
