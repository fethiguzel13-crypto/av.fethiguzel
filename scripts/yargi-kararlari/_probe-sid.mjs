const BASE = 'https://karararama.yargitay.gov.tr';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36';

// 1) search to get SID/TID
const body = {
  data: {
    arananKelime: '',
    baslangicTarihi: '01.01.2020',
    bitisTarihi: '31.12.2020',
    siralama: '3',
    siralamaDirection: 'desc',
    birimYrgKurulDaire: 'Hukuk Genel Kurulu',
    birimYrgHukukDaire: '',
    birimYrgCezaDaire: '',
    pageSize: 1,
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
const cookies = r.headers.getSetCookie?.() || [];
console.log('set-cookie', cookies);
const j = await r.json();
const id = j.data.data[0].id;
const { SID, TID } = j.metadata;
console.log('id', id, 'SID', SID, 'TID', TID);

// 2) try getDokuman with SID/TID headers
const variants = [
  { url: `${BASE}/getDokuman?id=${id}`, headers: { SID, TID } },
  { url: `${BASE}/getDokuman?id=${id}&SID=${SID}&TID=${TID}`, headers: {} },
  { url: `${BASE}/getDokuman?id=${id}`, headers: { 'X-SID': SID, 'X-TID': TID } },
  { url: `${BASE}/getDokuman?id=${id}`, headers: { 'Adalet-SID': SID, 'Adalet-TID': TID } },
  { url: `${BASE}/getDokuman`, headers: {}, method: 'GET', qs: true },
];

for (const v of variants) {
  const headers = {
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    Referer: BASE + '/',
    'User-Agent': UA,
    ...v.headers,
  };
  const resp = await fetch(v.url, { headers });
  const t = await resp.text();
  console.log(v.url.slice(0, 80), 'len', t.length, 'json', t.trim().startsWith('{'), '404', /mevcut değildir|böyle bir içerik/i.test(t));
}

// 3) Danistay getDokuman (same stack?)
const d = await fetch('https://karararama.danistay.gov.tr/getDokuman?id=1', {
  headers: { 'User-Agent': UA, 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
});
const dt = await d.text();
console.log('danistay', d.status, dt.slice(0, 150).replace(/\s+/g,' '), 'json', dt.trim().startsWith('{'));

// 4) bedesten search
try {
  const b = await fetch('https://bedesten.adalet.gov.tr/emsal-karar-arama', {
    headers: { 'User-Agent': UA },
  });
  console.log('bedesten emsal', b.status, (await b.text()).slice(0, 200).replace(/\s+/g,' '));
} catch (e) {
  console.log('bedesten', e.message);
}
