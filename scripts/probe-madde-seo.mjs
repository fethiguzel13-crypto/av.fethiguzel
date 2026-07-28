import https from 'node:https';

function get(u) {
  return new Promise((res, rej) => {
    https
      .get(
        u,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          },
        },
        (r) => {
          let d = '';
          r.on('data', (c) => (d += c));
          r.on('end', () => res({ s: r.statusCode, d, len: d.length }));
        }
      )
      .on('error', rej);
  });
}

const urls = [
  'https://www.avfethiguzel.com/mevzuat/tbk/madde-16',
  'https://www.avfethiguzel.com/mevzuat/tbk/madde-1',
  'https://www.avfethiguzel.com/sitemap.xml',
];

for (const u of urls) {
  const r = await get(u);
  const title = (r.d.match(/<title[^>]*>([^<]*)/i) || [])[1];
  const can = (r.d.match(/rel=["']canonical["'][^>]*href=["']([^"']+)/i) ||
    r.d.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i) ||
    [])[1];
  const hasMadde = /Madde\s*16|TBK\s*m\.?\s*16/i.test(r.d);
  const isViewer = /mevzuat-viewer|loadPack|content-packs/i.test(r.d);
  const hasJsonLd = /application\/ld\+json/i.test(r.d);
  console.log('\n==', u, r.s, 'len', r.len);
  console.log('title:', title);
  console.log('canonical:', can);
  console.log('hasMadde16inHtml:', hasMadde);
  console.log('isClientViewer:', isViewer);
  console.log('jsonLd:', hasJsonLd);
  if (u.includes('sitemap')) {
    console.log('has tbk/madde-16 in sitemap:', /mevzuat\/tbk\/madde-16/.test(r.d));
    console.log('sitemap urls sample count', (r.d.match(/<loc>/g) || []).length);
  }
}
