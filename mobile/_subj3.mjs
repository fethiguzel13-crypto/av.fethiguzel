import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
function walk(d,o=[]){for(const e of readdirSync(d,{withFileTypes:true})){const p=join(d,e.name);if(e.isDirectory())walk(p,o);else if(e.name.endsWith('.json'))o.push(p);}return o;}
const ENT={'&ldquo;':'“','&rdquo;':'”','&rsquo;':'’','&lsquo;':'‘','&hellip;':'…','&acirc;':'â','&nbsp;':' ','&amp;':'&','&quot;':'"','&#39;':"'"};
const dec=s=>String(s||'').replace(/&[a-zA-Z]+;|&#\d+;/g,m=>ENT[m]??' ');
const PROSE=[
  t=>{const m=/aras[ıi]ndaki\s*[“"'‘]\s*(?:[\s\S]{0,14}?[“"'‘])?\s*([^”"'’\n]{4,90})[”"'’]/i.exec(t);return m&&m[1];},
  t=>{const m=/aras[ıi]ndaki\s+([a-zçğıöşüA-ZÇĞİÖŞÜ ,\-]{6,70}?)\s+davas[ıi]/i.exec(t);return m&&m[1];},
  t=>{const m=/\bDava[,:]\s*([^.;\n]{8,130}?)\s*(?:istemine|talebine)?\s*ili[şs]kindir/i.exec(t);return m&&m[1];},
  t=>{const m=/([A-ZÇĞİÖŞÜa-zçğıöşü .,()-]{6,80}?)\s+su[çc](?:undan|lar[ıi]ndan)\s+(?:san[ıi][ğg]|dolay[ıi]|hükümlü|kurulan)/i.exec(t);return m&&m[1];},
];
const files=walk('../data/yargi-kararlari/decisions');
const step=Math.max(1,Math.floor(files.length/2500));
let shown=0;
for(let i=0;i<files.length&&shown<6;i+=step){
  let d;try{d=JSON.parse(readFileSync(files[i],'utf8'))}catch{continue}
  const t=dec(d.text||'').slice(0,4000);
  if(PROSE.some(fn=>{const v=fn(t);return v&&v.trim().length>5;}))continue;
  const head=t.split('"İçtihat Metni"')[0]||'';
  if(/[A-ZÇĞİÖŞÜ]{6,}/.test(head.replace(/\d{3,4}\s*S\.[^\n]*/g,'')))continue;
  console.log('#### '+d.alan+' '+d.tarih);
  console.log(JSON.stringify(t.slice(0,560)));console.log('');shown++;
}
