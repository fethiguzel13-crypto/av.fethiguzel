import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
function walk(d,o=[]){for(const e of readdirSync(d,{withFileTypes:true})){const p=join(d,e.name);if(e.isDirectory())walk(p,o);else if(e.name.endsWith('.json'))o.push(p);}return o;}
const ENT={'&ldquo;':'“','&rdquo;':'”','&rsquo;':'’','&lsquo;':'‘','&hellip;':'…','&acirc;':'â','&nbsp;':' ','&amp;':'&','&quot;':'"','&#39;':"'",'&ccedil;':'ç','&uuml;':'ü','&ouml;':'ö'};
const dec=s=>String(s||'').replace(/&[a-zA-Z]+;|&#\d+;/g,m=>ENT[m]??' ');

const PATTERNS = [
  ['kunye-caps', t => { const m=/\d{4}\/[\d-]+\s*E\.\s*,?\s*\d{4}\/\d+\s*K\.\s*([A-ZÇĞİÖŞÜI][A-ZÇĞİÖŞÜI ]{8,120}?)(?=\s{2,}|\s+[A-ZÇĞİÖŞÜ]{2,}\s*\(|\s+\d{3,4}\s*S\.|\n)/.exec(t); return m?m[1]:null; }],
  ['dava-tirnak', t => { const m=/aras[ıi]ndaki\s*[“"'‘]([^”"'’\n]{4,90})[”"'’]/i.exec(t); return m?m[1]:null; }],
  ['dava-ilişkin', t => { const m=/\bDava[,:]\s*([^.;\n]{8,120}?)\s*(?:istemine|talebine|davas[ıi]na)?\s*ili[şs]kindir/i.exec(t); return m?m[1]:null; }],
  ['istem-ilişkin', t => { const m=/\b(?:Uyu[şs]mazl[ıi]k|[İI]stem)[,:]\s*([^.;\n]{8,120}?)\s*ili[şs]kindir/i.exec(t); return m?m[1]:null; }],
  ['suctan-sanik', t => { const m=/([A-ZÇĞİÖŞÜa-zçğıöşü .,()-]{6,80}?)\s+su[çc]undan\s+(?:san[ıi][ğg][ıi]|dolay[ıi]|hükümlü)/i.exec(t); return m?m[1]:null; }],
  ['ozet', t => { const m=/[ÖO]ZET\s*[:：]\s*([^\n]{10,160})/.exec(t); return m?m[1]:null; }],
  ['istemli-dava', t => { const m=/[“"'‘]([^”"'’\n]{6,90})[”"'’]\s*(?:istemli|talepli)/i.exec(t); return m?m[1]:null; }],
];

const files = walk('../data/yargi-kararlari/decisions');
const step = Math.max(1, Math.floor(files.length/5000));
const hit = Object.fromEntries(PATTERNS.map(([k])=>[k,0]));
let n=0, any=0;
const samples=[];
for (let i=0;i<files.length;i+=step) {
  let d; try{d=JSON.parse(readFileSync(files[i],'utf8'))}catch{continue}
  const t = dec(d.text||'').slice(0,4000); n++;
  let got=null;
  for (const [k,fn] of PATTERNS) { const v=fn(t); if(v){hit[k]++; if(!got)got=[k,v];} }
  if(got){any++; if(samples.length<18 && n%230===0) samples.push([d.alan,d.tarih,got[0],got[1].replace(/\s+/g,' ').trim().slice(0,90)]);}
}
console.log('örneklem:',n,'· en az bir desen tutan:',any,`(${(any/n*100).toFixed(1)}%)`);
for(const [k,v] of Object.entries(hit)) console.log('  ',k.padEnd(16), v, `${(v/n*100).toFixed(1)}%`);
console.log('--- örnekler ---');
for(const s of samples) console.log(' ',s[0].padEnd(8), s[2].padEnd(15), JSON.stringify(s[3]));
