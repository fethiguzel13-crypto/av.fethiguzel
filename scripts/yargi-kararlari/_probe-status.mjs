const BASE = 'https://karararama.yargitay.gov.tr';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36';
const resp = await fetch(BASE + '/getDokuman?id=638154500', {
  headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest', Referer: BASE + '/', 'User-Agent': UA },
});
const raw = await resp.text();
const down =
  /mevcut de[gğ]ildir|böyle bir i[cç]erik/i.test(raw) ||
  (/Adalet Bakanl/i.test(raw) && /<!doctype html/i.test(raw) && !/"data"\s*:/.test(raw));
console.log('endpoint_down_detect', down, 'rawLen', raw.length);
const s = await fetch(BASE + '/aramadetaylist', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    Origin: BASE,
    Referer: BASE + '/',
    'User-Agent': UA,
  },
  body: JSON.stringify({
    data: {
      arananKelime: '',
      baslangicTarihi: '01.01.2024',
      bitisTarihi: '31.12.2024',
      siralama: '3',
      siralamaDirection: 'desc',
      birimYrgKurulDaire: 'Hukuk Genel Kurulu',
      pageSize: 2,
      pageNumber: 1,
    },
  }),
});
const st = await s.text();
console.log('search_ok', s.status, st.trim().startsWith('{'), st.includes('recordsTotal'));
