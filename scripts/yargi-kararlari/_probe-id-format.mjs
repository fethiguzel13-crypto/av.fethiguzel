const BASE = 'https://karararama.yargitay.gov.tr';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36';

async function getDoc(id) {
  const r = await fetch(BASE + '/getDokuman?id=' + encodeURIComponent(id), {
    headers: {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      Referer: BASE + '/',
      'User-Agent': UA,
    },
  });
  const t = await r.text();
  const isJson = t.trim().startsWith('{');
  let summary = '';
  if (isJson) {
    try {
      const j = JSON.parse(t);
      const data = j.data;
      summary = JSON.stringify({
        keys: Object.keys(j),
        meta: j.metadata,
        dataType: typeof data,
        dataLen: data == null ? 0 : String(data).length,
        dataHead: data == null ? null : String(data).slice(0, 200),
      });
    } catch (e) {
      summary = 'parse err ' + e.message;
    }
  } else {
    summary = 'html len=' + t.length + ' 404=' + /mevcut değil|böyle bir içerik/i.test(t);
  }
  console.log('ID', id, '->', summary);
}

// known search id
await getDoc('638154500');
// truncated
await getDoc('6381545');
await getDoc('63815450');
await getDoc('6381545000');
// from our downloaded files
import { readdirSync, readFileSync } from 'fs';
const f = readdirSync('data/yargi-kararlari/by-tier/hgk').filter((x) => x.endsWith('.json'))[0];
const rec = JSON.parse(readFileSync('data/yargi-kararlari/by-tier/hgk/' + f, 'utf8'));
console.log('sample rec id', rec.id, 'docUrl', rec.documentUrl);
await getDoc(rec.id);

// try with known working historical id from 2010 folder
const y2010 = readdirSync('data/yargi-kararlari/decisions/2010').filter((x) => x.endsWith('.json'))[0];
const rec2 = JSON.parse(readFileSync('data/yargi-kararlari/decisions/2010/' + y2010, 'utf8'));
console.log('2010 rec id', rec2.id, 'textLen', (rec2.text||'').length);
await getDoc(rec2.id);
