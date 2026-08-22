import { readFileSync } from 'node:fs';
const RE_BRACKET = /(\d{3,4})\s*S\.\s*([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ0-9 .,()'’\-]{4,90}?)\s*\[\s*Madde\s+(\d+)/g;
const RE_PAREN = /([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ0-9 .,'’\-]{4,90}?)\s*(?:\([A-ZÇĞİÖŞÜ]{2,8}\)\s*)?\((\d{3,4})\)\s*Madde\s+(\d+)/g;
function toTitle(s){const l=s.toLocaleLowerCase('tr-TR');return l.charAt(0).toLocaleUpperCase('tr-TR')+l.slice(1);}
function subjectsOf(text) {
  const head = text.split('"İçtihat Metni"')[0] || text.slice(0, 1500);
  const body = head.replace(RE_BRACKET,' ').replace(RE_PAREN,' ')
    .replace(/\d{3,4}\s*S\.\s*[A-ZÇĞİÖŞÜ][^\n\]]{4,90}\]?/g,' ')
    .replace(/\[[^\]]*\]|\]/g,' ');
  const out=[]; const seen=new Set();
  for (const raw of body.split(/[\n\r]+/)) {
    const line = raw.replace(/\s+/g,' ').trim();
    if (line.length<6||line.length>110) { continue; }
    if (/\d{4}\s*\/\s*[\d-]+\s*E\./.test(line) || /\bK\.\s*$/.test(line)) continue;
    if (/^(MAHKEMES[İI]|TAR[İI]H[İI]|NUMARASI|DAVACI|DAVALI|DAVALILAR|TÜRK M[İI]LLET[İI] ADINA)\b/.test(line)) continue;
    if (!/^[A-ZÇĞİÖŞÜ0-9][A-ZÇĞİÖŞÜ0-9 .,()'’/-]*$/.test(line)) { continue; }
    if (!/[A-ZÇĞİÖŞÜ]{3}/.test(line)) continue;
    const key=line.toLocaleLowerCase('tr-TR'); if(seen.has(key))continue; seen.add(key);
    out.push(toTitle(line)); if(out.length>=4)break;
  }
  return out;
}
const sample = readFileSync('../data/yargi-kararlari/decisions/2010/16851400.json','utf8');
const d = JSON.parse(sample);
console.log('KONU:', subjectsOf(d.text));
// satır satır neden elendiğini göster
const head = d.text.split('"İçtihat Metni"')[0];
for (const raw of head.split(/[\n\r]+/)) {
  const line = raw.replace(/\s+/g,' ').trim();
  if (!line) continue;
  const reasons=[];
  if (line.length<6||line.length>110) reasons.push('uzunluk');
  if (/\d{4}\s*\/\s*[\d-]+\s*E\./.test(line)||/\bK\.\s*$/.test(line)) reasons.push('künye');
  if (!/^[A-ZÇĞİÖŞÜ0-9][A-ZÇĞİÖŞÜ0-9 .,()'’/-]*$/.test(line)) reasons.push('desen');
  console.log((reasons.length?'✗ '+reasons.join(','):'✓ ').padEnd(18), JSON.stringify(line));
}
