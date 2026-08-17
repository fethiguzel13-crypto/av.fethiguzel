import https from 'node:https';

function get(u) {
  return new Promise((res, rej) => {
    https
      .get(u, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)', 'Cache-Control': 'no-cache' } }, (r) => {
        let d = '';
        r.on('data', (c) => (d += c));
        r.on('end', () => res({ s: r.statusCode, d }));
      })
      .on('error', rej);
  });
}

const checks = [
  'https://www.avfethiguzel.com/deploy-check',
  'https://www.avfethiguzel.com/mevzuat/tbk/madde-13',
  'https://www.avfethiguzel.com/mevzuat/tbk',
  'https://www.avfethiguzel.com/mevzuat',
  'https://www.avfethiguzel.com/bilgi',
  'https://www.avfethiguzel.com/',
  'https://www.avfethiguzel.com/sitemap.xml',
  'https://www.avfethiguzel.com/sitemap/0.xml',
  'https://www.avfethiguzel.com/sitemap/1.xml',
  'https://www.avfethiguzel.com/robots.txt',
];

for (const u of checks) {
  const { s, d } = await get(u);
  const title = (d.match(/<title>([^<]+)/) || [])[1];
  const h1 = (d.match(/<h1[^>]*>([\s\S]{0,120}?)<\/h1>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim();
  console.log('\n', u, s);
  if (title) console.log(' title:', title.slice(0, 110));
  if (h1) console.log(' h1:', h1.slice(0, 90));
  if (u.includes('madde-13')) {
    console.log(' TBK 13 title start?', /^TBK 13/.test(title || ''));
    console.log(' body has TBK 13?', /TBK 13/.test(d));
  }
  if (u.endsWith('/tbk')) {
    console.log(' madde-13 links', (d.match(/madde-13/g) || []).length);
    console.log(' popular block?', /Sık aranan|1–50|1-50|madde listesi/i.test(d));
  }
  if (u.endsWith('/mevzuat')) console.log(' popular chips TBK 13?', /TBK 13/.test(d));
  if (u.endsWith('/bilgi')) console.log(' 553?', /553/.test(d), 'index follow?', /index/.test(d));
  if (u === 'https://www.avfethiguzel.com/') {
    console.log(' hero VATANDAŞ?', /VATANDAŞ/.test(d), 'bilgi href?', /href="\/bilgi"/.test(d));
  }
  if (u.includes('sitemap')) {
    console.log(' len', d.length);
    console.log(' bilgi urls?', /\/bilgi\//.test(d), 'madde-13?', /madde-13/.test(d));
    console.log(' sitemapindex?', /sitemapindex/i.test(d), 'loc sample', (d.match(/<loc>[^<]+/g) || []).slice(0, 3));
  }
  if (u.includes('robots')) {
    console.log(d.split('\n').filter((l) => /Sitemap|sitemap/i.test(l)).join('\n'));
  }
}
