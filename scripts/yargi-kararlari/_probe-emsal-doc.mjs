const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36';
const BASE = 'https://emsal.uyap.gov.tr';

// search for yargitay HGK
const body = {
  data: {
    arananKelime: 'Hukuk Genel Kurulu',
    baslangicTarihi: '01.01.2020',
    bitisTarihi: '31.12.2020',
    siralama: '3',
    siralamaDirection: 'desc',
    pageSize: 3,
    pageNumber: 1,
  },
};
const r = await fetch(BASE + '/aramadetaylist', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    Origin: BASE,
    Referer: BASE + '/',
    'User-Agent': UA,
  },
  body: JSON.stringify(body),
});
const t = await r.text();
console.log('search', r.status, t.slice(0, 600));
let j;
try { j = JSON.parse(t); } catch { console.log('not json'); process.exit(0); }
const item = j?.data?.data?.[0];
console.log('item', item);
if (!item) process.exit(0);
const id = item.id;
const doc = await fetch(BASE + '/getDokuman?id=' + id, {
  headers: {
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    Referer: BASE + '/',
    'User-Agent': UA,
  },
});
const dt = await doc.text();
console.log('getDokuman', doc.status, 'json', dt.trim().startsWith('{'), 'len', dt.length);
console.log(dt.slice(0, 400).replace(/\s+/g, ' '));
if (dt.trim().startsWith('{')) {
  const dj = JSON.parse(dt);
  console.log('keys', Object.keys(dj), 'dataLen', String(dj.data||'').length);
  console.log(String(dj.data||'').replace(/<[^>]+>/g,' ').slice(0,300));
}
