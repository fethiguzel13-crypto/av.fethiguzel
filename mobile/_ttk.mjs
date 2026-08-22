import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
function walk(d,o=[]){for(const e of readdirSync(d,{withFileTypes:true})){const p=join(d,e.name);if(e.isDirectory())walk(p,o);else if(e.name.endsWith('.json'))o.push(p);}return o;}
const files = walk('../data/yargi-kararlari/decisions');
const RE = /([^.;\n]{0,120}?)(6102|6762)\s*say[ıi]l[ıi]([^.;\n]{0,120})/gi;
const hits = { 6102: [], 6762: [] };
const yururluk = { 6102: 0, 6762: 0 };
const mulga = { 6102: 0, 6762: 0 };
for (const f of files) {
  let d; try { d = JSON.parse(readFileSync(f,'utf8')); } catch { continue; }
  const t = String(d.text||'');
  if (!/6102|6762/.test(t)) continue;
  for (const m of t.matchAll(RE)) {
    const num = m[2];
    const ctx = (m[1] + m[2] + ' sayılı' + m[3]).replace(/\s+/g,' ').trim();
    if (/y[üu]r[üu]rl[üu][ğg]e\s+(gir|kon)/i.test(ctx)) yururluk[num]++;
    if (/m[üu]lga|y[üu]r[üu]rl[üu]kten\s+kalk/i.test(ctx)) mulga[num]++;
    if (hits[num].length < 4 && /y[üu]r[üu]rl[üu]|m[üu]lga/i.test(ctx)) hits[num].push(ctx.slice(0,190));
  }
}
console.log('6102 → yürürlüğe girdi:', yururluk[6102], '· mülga bağlamı:', mulga[6102]);
console.log('6762 → yürürlüğe girdi:', yururluk[6762], '· mülga bağlamı:', mulga[6762]);
for (const n of ['6102','6762']) { console.log('\n--- '+n+' ---'); for (const h of hits[n]) console.log(' ·', h); }
