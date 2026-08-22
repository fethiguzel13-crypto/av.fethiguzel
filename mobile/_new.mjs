import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
function walk(d,o=[]){for(const e of readdirSync(d,{withFileTypes:true})){const p=join(d,e.name);if(e.isDirectory())walk(p,o);else if(e.name.endsWith('.json'))o.push(p);}return o;}
const ENT={'&ldquo;':'“','&rdquo;':'”','&rsquo;':'’','&hellip;':'…','&nbsp;':' ','&amp;':'&','&quot;':'"'};
const dec=s=>String(s||'').replace(/&[a-zA-Z]+;|&#\d+;/g,m=>ENT[m]??' ');
const all = walk('../data/yargi-kararlari/decisions');
const newer = all.filter(f => /[\/](202[2-6])[\/]/.test(f) || !/[\/]\d{4}[\/]/.test(f));
console.log('yeni/tarihsiz klasör dosyası:', newer.length, '/', all.length);
let shown=0;
const step=Math.max(1,Math.floor(newer.length/60));
for(let i=0;i<newer.length&&shown<5;i+=step){
  let d;try{d=JSON.parse(readFileSync(newer[i],'utf8'))}catch{continue}
  const t=dec(d.text||'');
  console.log('#### '+d.alan+' '+d.tarih+' '+d.daire+' ('+t.length+' krk)');
  console.log(JSON.stringify(t.slice(0,820)));console.log('');shown++;
}
