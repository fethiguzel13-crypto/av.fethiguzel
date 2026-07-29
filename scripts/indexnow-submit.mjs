/**
 * IndexNow — Bing/Yandex/Seznam anında URL bildirimi.
 * Google IndexNow'u desteklemez; GSC URL Denetimi ayrıca gerekir.
 *
 * Run: node scripts/indexnow-submit.mjs
 * Optional: node scripts/indexnow-submit.mjs --all-priority
 */
import https from 'node:https';

const HOST = 'www.avfethiguzel.com';
const KEY = 'fethiguzel-indexnow-2026-07-29-avfethiguzel';
const KEY_LOC = `https://${HOST}/indexnow-key.txt`;

const PRIORITY = [
  `https://${HOST}/`,
  `https://${HOST}/mevzuat`,
  `https://${HOST}/mevzuat/tbk`,
  `https://${HOST}/mevzuat/tbk/madde-1`,
  `https://${HOST}/mevzuat/tbk/madde-13`,
  `https://${HOST}/bilgi/tbk-madde-13`,
  `https://${HOST}/priority-sitemap.xml`,
  `https://${HOST}/ara?q=TBK%2013`,
  `https://${HOST}/mevzuat/tbk/madde-49`,
  `https://${HOST}/mevzuat/tbk/madde-112`,
  `https://${HOST}/mevzuat/tbk/madde-125`,
  `https://${HOST}/mevzuat/tmk`,
  `https://${HOST}/mevzuat/tmk/madde-1`,
  `https://${HOST}/mevzuat/tck/madde-86`,
  `https://${HOST}/mevzuat/hmk/madde-119`,
  `https://${HOST}/ara`,
  `https://${HOST}/bilgi`,
  `https://${HOST}/bilgi/emlak-vergisi-nedir`,
  `https://${HOST}/bilgi/kidem-tazminati-nasil-alinir`,
  `https://${HOST}/bilgi/bosanma-davasi-nasil-acilir`,
  `https://${HOST}/bilgi/icra-takibi-nedir`,
  `https://${HOST}/bilgi/kira-artis-orani-nasil-hesaplanir`,
  `https://${HOST}/bilgi/nafaka-davasi-nedir`,
  `https://${HOST}/bilgi/arabuluculuk-nasil-yapilir`,
  `https://${HOST}/bilgi/trafik-cezasina-itiraz`,
  `https://${HOST}/bilgi/hukuk-davasi-nasil-acilir`,
  `https://${HOST}/hesaplama/kidem`,
  `https://${HOST}/avukat-fethi-guzel`,
  `https://${HOST}/ders-notlari`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/borclar-genel`,
  `https://${HOST}/ders-notlari/marmara`,
  `https://${HOST}/ders-notlari/van-yyu`,
  `https://${HOST}/van-avukat`,
  `https://${HOST}/ercis-avukat`,
  `https://${HOST}/ankara-avukat`,
  `https://${HOST}/bitlis-avukat`,
  `https://${HOST}/hizmet-bolgeleri`,
  `https://${HOST}/site-haritasi`,
  `https://${HOST}/ders-notlari-sitemap.xml`,
  `https://${HOST}/bolge-yazi`,
  `https://${HOST}/bolge-yazi/van-golu-havzasi-tasinmaz-ve-miras-hukuku`,
  `https://${HOST}/bolge-yazi/van-2011-depremi-sozlesme-ve-konut-hukuku`,
  `https://${HOST}/bolge-yazi/ahlat-vakif-miras-ve-tarihi-tasinmazlar`,
  `https://${HOST}/bolge-yazi/caldiran-tarimsal-tasinmaz-kadastro-ve-nufus`,
  `https://${HOST}/bolge-yazi/bitlis-miras-paydasligi-ve-daglik-tasinmaz`,
  `https://${HOST}/bolge-yazi/tatvan-ticaret-kira-ve-ulastirma-hukuku`,
  `https://${HOST}/bolge-yazi/adilcevaz-gol-kiyisi-mulkiyet-ve-miras`,
  `https://${HOST}/bolge-yazi/agri-sinir-bolgesi-tasinmaz-miras-ve-idare`,
  `https://${HOST}/bolge-yazi/patnos-icra-tarimsal-alacak-ve-nufus`,
  `https://${HOST}/bolge-yazi/muradiye-aile-miras-ve-nufus-olaylari`,
  `https://${HOST}/bolge-yazi/ercis-nufus-veraset-tapu-intikali`,
  `https://${HOST}/bolge-yazi/dogu-anadolu-el-birligi-mulkiyet-ve-miras-pratikleri`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/borclar-genel-donem-1`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/borclar-genel-donem-2`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/borclar-genel-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/borclar-genel-donem-1/pdf`,
  `https://${HOST}/ders-notlari/marmara/borclar-genel-yillik`,
  `https://${HOST}/ders-notlari/van-yyu/borclar-genel-donem-1`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/borclar-ozel-donem-1`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/borclar-ozel-donem-2`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/borclar-ozel-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/borclar-ozel-donem-1/pdf`,
  `https://${HOST}/ders-notlari/marmara/borclar-ozel-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/esya-hukuku-donem-1`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/esya-hukuku-donem-2`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/esya-hukuku-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/esya-hukuku-donem-1/pdf`,
  `https://${HOST}/ders-notlari/marmara/esya-hukuku-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/miras-hukuku-donem-1`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/miras-hukuku-donem-2`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/miras-hukuku-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/miras-hukuku-donem-1/pdf`,
  `https://${HOST}/ders-notlari/marmara/miras-hukuku-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/tmk-1-kitap-donem-1`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/tmk-1-kitap-donem-2`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/tmk-1-kitap-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/tmk-1-kitap-donem-1/pdf`,
  `https://${HOST}/ders-notlari/marmara/tmk-1-kitap-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/tmk-2-kitap-donem-1`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/tmk-2-kitap-donem-2`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/tmk-2-kitap-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/tmk-2-kitap-donem-1/pdf`,
  `https://${HOST}/ders-notlari/marmara/tmk-2-kitap-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/hmk-donem-1`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/hmk-donem-2`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/hmk-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/hmk-donem-1/pdf`,
  `https://${HOST}/ders-notlari/marmara/hmk-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/icra-donem-1`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/icra-donem-2`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/icra-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/icra-donem-1/pdf`,
  `https://${HOST}/ders-notlari/marmara/icra-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/iflas-donem-1`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/iflas-donem-2`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/iflas-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/iflas-donem-1/pdf`,
  `https://${HOST}/ders-notlari/marmara/iflas-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/sirketler-donem-1`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/sirketler-donem-2`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/sirketler-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/sirketler-donem-1/pdf`,
  `https://${HOST}/ders-notlari/marmara/sirketler-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/kiymetli-evrak-donem-1`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/kiymetli-evrak-donem-2`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/kiymetli-evrak-yillik`,
  `https://${HOST}/ders-notlari/ankara-yildirim-beyazit/kiymetli-evrak-donem-1/pdf`,
  `https://${HOST}/ders-notlari/marmara/kiymetli-evrak-yillik`,
];

// First 80 TBK maddeleri — crawl seed
for (let n = 1; n <= 80; n++) {
  PRIORITY.push(`https://${HOST}/mevzuat/tbk/madde-${n}`);
}

const urlList = [...new Set(PRIORITY)];

function post(endpoint, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(endpoint);
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => resolve({ status: res.statusCode, body: d.slice(0, 200) }));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOC,
  urlList,
};

console.log(`[indexnow] submitting ${urlList.length} URLs…`);
for (const ep of [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
]) {
  try {
    const r = await post(ep, payload);
    console.log(ep, r.status, r.body);
  } catch (e) {
    console.warn(ep, e.message);
  }
}
console.log('[indexnow] done — Google için Search Console URL Denetimi kullanın.');
