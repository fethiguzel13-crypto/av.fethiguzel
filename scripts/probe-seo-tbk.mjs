import https from 'node:https';

function get(u, ua = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)') {
  return new Promise((res, rej) => {
    https
      .get(u, { headers: { 'User-Agent': ua, 'Cache-Control': 'no-cache' } }, (r) => {
        let d = '';
        r.on('data', (c) => (d += c));
        r.on('end', () => res({ s: r.statusCode, h: r.headers, d, final: r.headers.location }));
      })
      .on('error', rej);
  });
}

const urls = [
  'https://www.avfethiguzel.com/mevzuat/tbk/madde-13',
  'https://avfethiguzel.com/mevzuat/tbk/madde-13',
  'https://www.avfethiguzel.com/mevzuat/tbk/madde-1',
  'https://www.avfethiguzel.com/bilgi/tbk-madde-125',
  'https://www.avfethiguzel.com/bilgi/emlak-vergisi-nedir',
  'https://www.avfethiguzel.com/robots.txt',
  'https://www.avfethiguzel.com/sitemap.xml',
  'https://www.avfethiguzel.com/llms.txt',
];

for (const u of urls) {
  try {
    const { s, h, d } = await get(u);
    console.log('\n==', u, s, 'ct=', String(h['content-type'] || '').slice(0, 50));
    if (u.includes('robots') || u.includes('llms')) {
      console.log(d.slice(0, 900));
      continue;
    }
    if (u.includes('sitemap')) {
      console.log('sitemap len', d.length);
      console.log('has madde-13?', /madde-13/.test(d));
      console.log('has /bilgi/?', /\/bilgi\//.test(d));
      console.log('url count ~', (d.match(/<loc>/g) || []).length);
      console.log('sample:', d.slice(0, 400));
      // sitemap index?
      console.log('sitemapindex?', /sitemapindex/i.test(d));
      continue;
    }
    console.log('title:', (d.match(/<title>([^<]+)/) || [])[1]);
    console.log(
      'canonical:',
      (d.match(/rel=["']canonical["'][^>]*href=["']([^"']+)/i) ||
        d.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i) ||
        [])[1]
    );
    console.log('robots:', (d.match(/name=["']robots["'][^>]*content=["']([^"']+)/i) || [])[1]);
    console.log('h1:', (d.match(/<h1[^>]*>([\s\S]{0,150}?)<\/h1>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim());
    console.log('len', d.length, 'TBK?', /TBK|6098/.test(d), 'madde 13 text?', /madde\s*13|m\.\s*13/i.test(d));
    // noindex?
    console.log('noindex?', /noindex/i.test(d));
  } catch (e) {
    console.log(u, e.message);
  }
}
