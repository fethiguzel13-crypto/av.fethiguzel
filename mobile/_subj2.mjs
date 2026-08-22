import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
function walk(d,o=[]){for(const e of readdirSync(d,{withFileTypes:true})){const p=join(d,e.name);if(e.isDirectory())walk(p,o);else if(e.name.endsWith('.json'))o.push(p);}return o;}
const ENT={'&ldquo;':'“','&rdquo;':'”','&rsquo;':'’','&lsquo;':'‘','&hellip;':'…','&acirc;':'â','&nbsp;':' ','&amp;':'&','&quot;':'"','&#39;':"'",'&ccedil;':'ç','&uuml;':'ü','&ouml;':'ö'};
const dec=s=>String(s||'').replace(/&[a-zA-Z]+;|&#\d+;/g,m=>ENT[m]??' ');
const RE_BRACKET=/(\d{3,4})\s*S\.\s*([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ0-9 .,()'’\-]{4,90}?)\s*\[\s*Madde\s+(\d+)/g;
const RE_PAREN=/([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ0-9 .,'’\-]{4,90}?)\s*(?:\([A-ZÇĞİÖŞÜ]{2,8}\)\s*)?\((\d{3,4})\)\s*Madde\s+(\d+)/g;

function capsLines(head){
  const body=head.replace(RE_BRACKET,' ').replace(RE_PAREN,' ')
    .replace(/\d{3,4}\s*S\.\s*[A-ZÇĞİÖŞÜ][^\n\]]{4,90}\]?/g,' ').replace(/\[[^\]]*\]|\]/g,' ');
  const out=[];
  for(const raw of body.split(/[\n\r]+/)){
    const line=raw.replace(/\s+/g,' ').trim();
    if(line.length<6||line.length>110)continue;
    if(/\d{4}\s*\/\s*[\d-]+\s*E\./.test(line)||/\bK\.\s*$/.test(line))continue;
    if(/^(MAHKEMES[İI]|TAR[İI]H[İI]|NUMARASI|DAVACI|DAVALI|TÜRK M[İI]LLET[İI])/.test(line))continue;
    if(!/^[A-ZÇĞİÖŞÜ0-9][A-ZÇĞİÖŞÜ0-9 .,()'’/-]*$/.test(line))continue;
    if(!/[A-ZÇĞİÖŞÜ]{3}/.test(line))continue;
    out.push(line); if(out.length>=4)break;
  }
  return out;
}
function sameLineCaps(head){
  const m=/\d{4}\/[\d-]+\s*E\.\s*,?\s*\d{4}\/\d+\s*K\.\s+([A-ZÇĞİÖŞÜI][A-ZÇĞİÖŞÜI ]{8,140}?)(?=\s+[A-ZÇĞİÖŞÜ ]{3,}\s*\(|\s+\d{3,4}\s*S\.|\n|$)/.exec(head);
  if(!m)return [];
  return m[1].trim().split(/\s{2,}/).filter(s=>s.length>5).slice(0,4);
}
const PROSE=[
  t=>{const m=/aras[ıi]ndaki\s*[“"'‘]\s*(?:[\s\S]{0,12}?[“"'‘])?\s*([^”"'’\n]{4,90})[”"'’]/i.exec(t);return m&&m[1];},
  t=>{const m=/aras[ıi]ndaki\s+([a-zçğıöşüA-ZÇĞİÖŞÜ ,\-]{6,70}?)\s+davas[ıi]ndan/i.exec(t);return m&&m[1];},
  t=>{const m=/\bDava[,:]\s*([^.;\n]{8,130}?)\s*(?:istemine|talebine)?\s*ili[şs]kindir/i.exec(t);return m&&m[1];},
  t=>{const m=/\b(?:Uyu[şs]mazl[ıi]k|[İI]stem|Talep)[,:]\s*([^.;\n]{8,130}?)\s*ili[şs]kindir/i.exec(t);return m&&m[1];},
  t=>{const m=/([A-ZÇĞİÖŞÜa-zçğıöşü .,()-]{6,80}?)\s+su[çc]undan\s+(?:san[ıi][ğg]|dolay[ıi]|hükümlü|kurulan)/i.exec(t);return m&&m[1];},
  t=>{const m=/([A-ZÇĞİÖŞÜa-zçğıöşü .,()-]{6,80}?)\s+su[çc]lar[ıi]ndan\s+(?:san[ıi][ğg]|dolay[ıi])/i.exec(t);return m&&m[1];},
  t=>{const m=/hükmün[^.]{0,40}?\b([a-zçğıöşü ]{6,60})\s+davas[ıi]/i.exec(t);return m&&m[1];},
];
const files=walk('../data/yargi-kararlari/decisions');
const step=Math.max(1,Math.floor(files.length/6000));
let n=0,any=0,capsN=0,slN=0,prN=0;
const samples=[];
for(let i=0;i<files.length;i+=step){
  let d;try{d=JSON.parse(readFileSync(files[i],'utf8'))}catch{continue}
  const t=dec(d.text||''); n++;
  const head=t.split('"İçtihat Metni"')[0]||t.slice(0,1200);
  let subs=capsLines(head); if(subs.length)capsN++;
  if(!subs.length){subs=sameLineCaps(head); if(subs.length)slN++;}
  if(!subs.length){for(const fn of PROSE){const v=fn(t.slice(0,4000));if(v&&v.trim().length>5){subs=[v.replace(/\s+/g,' ').trim()];prN++;break;}}}
  if(subs.length){any++; if(samples.length<20&&n%290===0)samples.push([d.alan,subs.join(' · ').slice(0,95)]);}
}
console.log(`örneklem ${n} · konu bulunan ${any} (${(any/n*100).toFixed(1)}%)`);
console.log(`  satır-caps ${capsN} · künye-caps ${slN} · düzyazı ${prN}`);
console.log('--- örnekler ---');
for(const s of samples)console.log(' ',s[0].padEnd(9),JSON.stringify(s[1]));
