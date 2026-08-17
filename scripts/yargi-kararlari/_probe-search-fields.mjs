const BASE = 'https://karararama.yargitay.gov.tr';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36';
const body = {
  data: {
    arananKelime: '',
    esasYil: '',
    esasIlkSiraNo: '',
    esasSonSiraNo: '',
    kararYil: '',
    kararIlkSiraNo: '',
    kararSonSiraNo: '',
    baslangicTarihi: '01.01.2020',
    bitisTarihi: '31.12.2020',
    siralama: '3',
    siralamaDirection: 'desc',
    birimYrgKurulDaire: 'Hukuk Genel Kurulu',
    birimYrgHukukDaire: '',
    birimYrgCezaDaire: '',
    pageSize: 2,
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
const j = await r.json();
console.log(JSON.stringify(j, null, 2).slice(0, 2500));

// try aramalist simple
const r2 = await fetch(BASE + '/aramalist', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    Origin: BASE,
    Referer: BASE + '/',
    'User-Agent': UA,
  },
  body: JSON.stringify({ data: { arananKelime: 'haksız fiil', pageSize: 2, pageNumber: 1 } }),
});
const t2 = await r2.text();
console.log('aramalist', r2.status, t2.slice(0, 500));
