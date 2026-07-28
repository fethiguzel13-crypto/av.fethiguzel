import https from 'node:https';

function get(u) {
  return new Promise((res, rej) => {
    https
      .get(u, { headers: { 'Cache-Control': 'no-cache', 'User-Agent': 'seo-verify/1.0' } }, (r) => {
        let d = '';
        r.on('data', (c) => (d += c));
        r.on('end', () => res({ s: r.statusCode, d }));
      })
      .on('error', rej);
  });
}

const urls = [
  'https://www.avfethiguzel.com/bilgi',
  'https://www.avfethiguzel.com/bilgi/tbk-madde-125',
  'https://www.avfethiguzel.com/bilgi/emlak-vergisi-nedir',
  'https://www.avfethiguzel.com/ara',
  'https://www.avfethiguzel.com/mevzuat',
];

for (const u of urls) {
  const { s, d } = await get(u);
  console.log('\n==', u, s);
  console.log('title:', (d.match(/<title>([^<]+)/) || [])[1]);
  console.log('553?', /553/.test(d));
  console.log('spam phrase?', /arama motorlar[ıi]nda/.test(d));
  console.log('TBK m.125 substance?', /on y[ıi]ll[ıi]k|10 y[ıi]l|TBK m\.125/.test(d));
  console.log('Kanun Maddesi?', /Kanun [Mm]addesi/.test(d));
}
