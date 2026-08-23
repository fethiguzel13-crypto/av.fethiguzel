/**
 * Birleşik uygulamanın gerçekten AÇILDIĞINI ve bölümler arasında
 * gezinebildiğini doğrular.
 *
 * Neden var: bu depoda 'derleme geçti' ile 'uygulama çalışıyor' bir kez
 * ayrıştı. Vite hatasız derleyip Play'e imzasız/boş bir paket gönderebilir;
 * bölüm yönlendirmesi bozulduğunda da derleme yine yeşil kalır. Bu betik
 * derlenmiş www'yi gerçek bir tarayıcıda açar ve dört bölümü tek tek gezer.
 *
 * Çalıştırma (playwright PORTAL kökünün bağımlılığıdır, mobile'ın değil):
 *   cd fethiguzel-portal && node mobile/scripts/smoke-ui.mjs
 *
 * Önce derlenmiş olmalı:  cd mobile && node scripts/build-app.mjs --app=asistan
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const WWW = 'mobile/flavors/asistan/www';
const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.gz': 'application/gzip',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = join(WWW, url === '/' ? 'index.html' : url);
  if (!existsSync(file)) file = join(WWW, 'index.html');
  const body = readFileSync(file);
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(body);
});

await new Promise((r) => server.listen(4599, r));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

const errors = [];
page.on('pageerror', (e) => errors.push(`SAYFA HATASI: ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`KONSOL: ${m.text()}`);
});

const results = [];
async function step(name, fn) {
  try {
    await fn();
    results.push(`  ✓ ${name}`);
  } catch (e) {
    results.push(`  ✗ ${name} — ${e.message.split('\n')[0]}`);
  }
}

await page.goto('http://localhost:4599/', { waitUntil: 'networkidle' });

await step('giriş ekranı açılıyor', async () => {
  await page.waitForSelector('text=Hukuk Asistanı', { timeout: 8000 });
});

await step('bölüm kartları görünüyor', async () => {
  for (const label of ['Mevzuat', 'Yargıtay arşivi', 'Kitaplık', 'Hesaplama araçları']) {
    await page.waitForSelector(`text=${label}`, { timeout: 5000 });
  }
});

await step('külliyat sayaçları gerçek veriden', async () => {
  const body = await page.textContent('body');
  // Sayılar derleme anında üretilir; burada YALNIZ biçim denetlenir,
  // sabit bir rakam beklenmez — külliyat her gün büyüyor ve sabit beklenti
  // testi kaçınılmaz olarak kırmızıya döner.
  if (!/madde metni/.test(body)) throw new Error('madde sayacı yok');
  if (!/Yargıtay kararı/.test(body)) throw new Error('karar sayacı yok');
  if (!/kavram/.test(body)) throw new Error('kavram sayacı yok');
  if (!/akademik eser/.test(body)) throw new Error('eser sayacı yok');
  if (!/\d\.\d{3}/.test(body)) throw new Error('binlik ayraçlı sayı yok — sayaçlar boş');
});

await step('alt gezinme 5 sekme', async () => {
  const n = await page.locator('nav[aria-label], footer nav, [role="tablist"]').count();
  const tabs = await page
    .locator('button, a')
    .filter({ hasText: /Mevzuat|Yargı|Kitaplık|Araçlar|Ana/ })
    .count();
  if (tabs < 5) throw new Error(`sekme/kart sayısı ${tabs} (nav ${n})`);
});

for (const [path, expect] of [
  ['/mevzuat', /kanun|Mevzuat/i],
  ['/hesap', /hesap|araç/i],
  ['/arsiv', /arşiv|karar/i],
  ['/icthat', /içtihat|karar|bugün/i],
  ['/kitaplik', /kitaplık|kavram|eser/i],
  ['/kavram', /kavram/i],
  ['/eserler', /eser|makale/i],
  ['/rehber', /rehber|konu/i],
  ['/diger', /gizlilik|ayarlar|bilgi/i],
]) {
  await step(`bölüm açılıyor: ${path}`, async () => {
    await page.goto(`http://localhost:4599/#${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const body = await page.textContent('body');
    if (!expect.test(body)) throw new Error(`beklenen içerik yok (${body.slice(0, 70)}…)`);
  });
}


await step('arşiv satırları konu başlığı taşıyor', async () => {
  await page.goto('http://localhost:4599/#/arsiv', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const body = await page.textContent('body');
  // Künye duvarı geri dönerse burada yakalanır: konu başlığı çıkarımı
  // bozulduğunda liste yine yalnız «E. …, K. …» satırlarından oluşur.
  const kunyeSayisi = (body.match(/E\. \d{4}\//g) || []).length;
  if (kunyeSayisi < 3) throw new Error('arşiv listesi boş');
  const suc = /(suçu|davası|tazminat|alacak|tespit|iptal|fesih|yağma|hırsızlık)/i.test(body);
  if (!suc) throw new Error('hiçbir satırda konu başlığı yok — çıkarım bozuk');
});

await step('madde metni yeniden akıtılmış', async () => {
  await page.goto('http://localhost:4599/#/mevzuat/is-kanunu/madde-17', {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(900);
  const body = await page.textContent('body');
  if (!/Belirsiz süreli iş sözleşmelerinin feshinden önce/.test(body)) {
    throw new Error('resmî metin görünmüyor');
  }
  if (/---/.test(body)) throw new Error('ham markdown ayracı ekranda');
});

/*
  ÜCRETLİ BÖLÜM — iki yönlü denetim.

  Buradaki hata iki türlüdür ve ikisi de sessizdir: kapı açık kalırsa ücretli
  külliyat bedava dağılır, kapı takılı kalırsa ödeme yapmış avukat kararı
  açamaz. İkisi de ancak çalıştırıp bakınca görülür, bu yüzden her ikisi de
  duman testine bağlandı.
*/
const ORNEK_KARAR = '16851400';

await step('üyeliksiz karar: tam metin kapalı, önizleme açık', async () => {
  await page.evaluate(() => localStorage.removeItem('CapacitorStorage.galaxy:uyelik'));
  await page.goto(`http://localhost:4599/#/karar/${ORNEK_KARAR}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const body = await page.textContent('body');
  if (!/Tam metin üyelik gerektirir/.test(body)) throw new Error('kilit uyarısı yok — kapı AÇIK');
  if (body.length > 3000) throw new Error(`tam metin sızıyor (${body.length} karakter)`);
  if (!/Karar metni/.test(body)) throw new Error('önizleme hiç görünmüyor');
});

await step('üyelik ekranı fiyatı ve dönemi söylüyor', async () => {
  await page.goto('http://localhost:4599/#/uyelik', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const body = await page.textContent('body');
  if (!/Yargıtay arşivi üyeliği/.test(body)) throw new Error('üyelik ekranı açılmıyor');
  if (!/500/.test(body)) throw new Error('fiyat görünmüyor');
  if (!/Üyeliği başlat/.test(body)) throw new Error('satın alma düğmesi yok');
});

await step('üyelik açıkken şifreli kasa çözülüyor', async () => {
  await page.evaluate(() => {
    const n = Date.now();
    localStorage.setItem(
      'CapacitorStorage.galaxy:uyelik',
      JSON.stringify({
        durum: 'etkin',
        bitis: n + 30 * 864e5,
        sonDogrulama: n,
        cevrimdisiBitis: n + 30 * 864e5,
      })
    );
  });
  // Tam yeniden yükleme şart: aynı belge içinde hash değiştirmek uygulamayı
  // baştan başlatmaz ve üyelik durumu açılışta bir kez okunur.
  await page.goto(`http://localhost:4599/#/karar/${ORNEK_KARAR}`, { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  const body = await page.textContent('body');
  if (/Tam metin üyelik gerektirir/.test(body)) throw new Error('ödeyen kullanıcı kapıda kaldı');
  if (body.length < 3000) throw new Error(`kasa çözülmedi (${body.length} karakter)`);
  await page.evaluate(() => localStorage.removeItem('CapacitorStorage.galaxy:uyelik'));
});

await step('arama tuş başına donmuyor', async () => {
  await page.goto('http://localhost:4599/#/arsiv', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500); // boştaki dizin hazırlığı
  const enKotu = await page.evaluate(async () => {
    const el = document.querySelector('input[type=search]');
    const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    let kotu = 0;
    for (const c of 'kamulastirma') {
      const t0 = performance.now();
      set.call(el, el.value + c);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      kotu = Math.max(kotu, performance.now() - t0);
    }
    return Math.round(kotu);
  });
  // Katlanmış dizin (icthat/arama.txt.gz) düşerse tarama cihazda yapılır ve
  // bu değer saniyelere fırlar — sessiz bir bozulma, yalnız ölçerek görülür.
  if (enKotu > 250) throw new Error(`tuş başına ${enKotu} ms — arama dizini devre dışı olabilir`);
});

await step('liste kaydırdıkça uzuyor (120 sınırı yok)', async () => {
  await page.goto('http://localhost:4599/#/arsiv', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const once = await page.$$eval('.satir-grup > li', (n) => n.length);
  for (let i = 0; i < 4; i += 1) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
  }
  const sonra = await page.$$eval('.satir-grup > li', (n) => n.length);
  if (sonra <= once) throw new Error(`liste uzamıyor (${once} → ${sonra})`);
});

await step('marka yazı tipleri gerçekten uygulanıyor', async () => {
  /*
    Sessiz kusurların en görünmezi.

    Bir dönem yalnız `latin-ext` alt kümesi yükleniyordu; o alt küme A–Z ve
    a–z içermez. Uygulamanın bütün metni işletim sisteminin yedek yüzüyle,
    yalnız Türkçe aksanlı harfler marka yazı tipiyle çiziliyordu. Hiçbir
    hata çıkmadığı ve yedek yüz makul göründüğü için aylarca fark edilmedi.

    Ölçüt genişliktir: marka yüzü uygulanıyorsa aynı kelime yedek yüzden
    FARKLI genişlikte gelir.
  */
  await page.goto('http://localhost:4599/#/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const dusenler = await page.evaluate(async () => {
    const AILELER = [
      ['Plus Jakarta Sans', '"Plus Jakarta Sans"', [400, 500, 600, 700]],
      ['Outfit', 'Outfit', [500, 600, 700]],
      ['Lora', 'Lora', [400, 500, 600]],
      ['IBM Plex Mono', '"IBM Plex Mono"', [400, 500, 600, 700]],
    ];
    for (const [, fam, ws] of AILELER) {
      for (const w of ws) await document.fonts.load(`${w} 40px ${fam}`);
    }
    const olc = (fam, w) => {
      const s = document.createElement('span');
      s.textContent = 'Hukuk';
      s.style.cssText = `position:absolute;font-family:${fam};font-weight:${w};font-size:40px`;
      document.body.appendChild(s);
      const x = s.getBoundingClientRect().width;
      s.remove();
      return Math.round(x * 10) / 10;
    };
    const kotu = [];
    for (const [ad, fam, ws] of AILELER) {
      for (const w of ws) {
        if (olc(`${fam}, serif`, w) === olc('serif', w)) kotu.push(`${ad} ${w}`);
      }
    }
    return kotu;
  });
  if (dusenler.length) {
    throw new Error(`yedek yazı tipine düşen yüzler: ${dusenler.join(', ')}`);
  }
});

await step('giriş ekranına dönülüyor', async () => {
  await page.goto('http://localhost:4599/#/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.waitForSelector('text=Hukuk Asistanı', { timeout: 5000 });
});

console.log('\n── duman testi ──');
for (const r of results) console.log(r);
if (errors.length) {
  console.log('\n── tarayıcı hataları ──');
  for (const e of [...new Set(errors)].slice(0, 12)) console.log(`  ! ${e}`);
}

await browser.close();
server.close();

const failed = results.filter((r) => r.includes('✗')).length;
console.log(`\n${failed ? `${failed} adım BAŞARISIZ` : 'tüm adımlar geçti'}${errors.length ? ` · ${errors.length} tarayıcı hatası` : ''}`);
process.exit(failed || errors.length ? 1 : 0);
