#!/usr/bin/env node
/**
 * Tasarım denetimi — derlenmiş arayüzü gerçek tarayıcıda ölçer.
 *
 * Ekran görüntüsü almakla yetinmez; sayfanın HESAPLANMIŞ değerlerini okur:
 * kontrast, dokunma hedefi, taşma, punto tabanı, odak halkası. Gözle
 * bakarak yakalanmayan kusurlar bunlar.
 *
 * Çalıştırma (playwright PORTAL kökünün bağımlılığıdır):
 *   cd fethiguzel-portal && node mobile/scripts/design-audit.mjs
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const WWW = 'mobile/flavors/asistan/www';
const OUT = process.argv[2] || 'mobile/.design-audit';
const ONLY = process.argv.slice(3);

mkdirSync(OUT, { recursive: true });

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.gz': 'application/octet-stream',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = join(WWW, url === '/' ? 'index.html' : url);
  if (!existsSync(file) || file.endsWith('/')) file = join(WWW, 'index.html');
  const body = readFileSync(file);
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(body);
});
await new Promise((r) => server.listen(4712, r));

/** Denetlenecek ekranlar — ürünün gerçek gezinme yolu. */
const EKRANLAR = [
  ['home', '/'],
  ['mevzuat', '/mevzuat'],
  ['kanun', '/mevzuat/tbk'],
  ['madde', '/mevzuat/is-kanunu/madde-17'],
  ['madde-serh', '/mevzuat/cek/madde-5'],
  ['ara', '/ara'],
  ['arsiv', '/arsiv'],
  // Ücretli bölümün iki yüzü: kilitli karar ve üyelik vitrini. Bunlar
  // denetim dışında kalırsa, uygulamanın PARA İSTEDİĞİ tek iki ekranın
  // kontrastı ve dokunma hedefleri hiç ölçülmemiş olur.
  ['karar-kilitli', '/karar/16851400'],
  ['uyelik', '/uyelik'],
  ['icthat', '/icthat'],
  ['kitaplik', '/kitaplik'],
  ['kavram', '/kavram'],
  ['kavram-detay', '/kavram/kidem-tazminati'],
  ['eserler', '/eserler'],
  ['rehber', '/rehber'],
  ['hesap', '/hesap'],
  ['arac', '/arac/kidem'],
  ['diger', '/diger'],
  ['ayarlar', '/ayarlar'],
];

const hedefler = ONLY.length ? EKRANLAR.filter(([ad]) => ONLY.includes(ad)) : EKRANLAR;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 2,
});

const konsolHatalari = [];
page.on('pageerror', (e) => konsolHatalari.push(`SAYFA: ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') konsolHatalari.push(`KONSOL: ${m.text()}`);
});

/** Sayfa içinde çalışan ölçüm — hesaplanmış değerleri okur. */
const OLC = () => {
  const out = { kontrast: [], hedef: [], punto: [], tasma: [], odak: [], sayi: {} };

  function rgb(s) {
    const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(s || '');
    return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null;
  }
  function lum([r, g, b]) {
    const f = (v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function karistir(on, alt) {
    const a = on[3];
    return [0, 1, 2].map((i) => on[i] * a + alt[i] * (1 - a));
  }
  /** Şeffaf katmanları geçerek gerçek arka planı bulur. */
  function arkaPlan(el) {
    let n = el;
    let birikim = null;
    while (n && n !== document.documentElement) {
      const c = rgb(getComputedStyle(n).backgroundColor);
      if (c && c[3] > 0) {
        birikim = birikim ? karistir(birikim, c) : c;
        if (c[3] >= 0.999) return birikim.slice(0, 3);
      }
      n = n.parentElement;
    }
    return birikim ? birikim.slice(0, 3) : [255, 255, 255];
  }
  function oran(a, b) {
    const l1 = lum(a);
    const l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  function yol(el) {
    const parcalar = [];
    let n = el;
    for (let i = 0; n && i < 3; i += 1, n = n.parentElement) {
      parcalar.unshift(
        n.tagName.toLowerCase() +
          (n.className && typeof n.className === 'string'
            ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.')
            : '')
      );
    }
    return parcalar.join(' > ');
  }

  const hepsi = [...document.querySelectorAll('body *')];
  out.sayi.dugum = hepsi.length;

  for (const el of hepsi) {
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden' || st.opacity === '0') continue;
    const kutu = el.getBoundingClientRect();
    if (kutu.width === 0 || kutu.height === 0) continue;

    // Yalnız doğrudan metin taşıyan düğümler
    const dogrudanMetin = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim();

    if (dogrudanMetin.length > 1) {
      const fg = rgb(st.color);
      const bg = arkaPlan(el);
      const px = parseFloat(st.fontSize);
      const kalin = parseInt(st.fontWeight, 10) >= 700;
      const buyuk = px >= 24 || (px >= 18.66 && kalin);
      if (fg) {
        const gercek = fg[3] < 1 ? karistir(fg, bg) : fg.slice(0, 3);
        const o = oran(gercek, bg);
        const esik = buyuk ? 3 : 4.5;
        if (o < esik) {
          out.kontrast.push({
            yol: yol(el),
            metin: dogrudanMetin.slice(0, 40),
            oran: +o.toFixed(2),
            esik,
            px: +px.toFixed(1),
          });
        }
      }
      if (px < 12) out.punto.push({ yol: yol(el), px: +px.toFixed(1), metin: dogrudanMetin.slice(0, 30) });
    }

    // Dokunma hedefi
    if (
      (el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'link') &&
      el.offsetParent !== null
    ) {
      const h = kutu.height;
      const w = kutu.width;
      if (h < 40 || w < 40) {
        out.hedef.push({ yol: yol(el), w: Math.round(w), h: Math.round(h), metin: (el.textContent || '').trim().slice(0, 28) });
      }
    }

    // Yatay taşma — YATAY KAYDIRICI içindekiler sayılmaz.
    // «-mx-4 px-4 overflow-x-auto» şeritleri bilinçli olarak ekranın
    // dışına taşar; onları kusur saymak gerçek taşmaları gizliyordu.
    if (kutu.right > window.innerWidth + 1) {
      let kaydirici = false;
      for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
        const ox = getComputedStyle(n).overflowX;
        if (ox === 'auto' || ox === 'scroll') { kaydirici = true; break; }
      }
      if (!kaydirici) {
        out.tasma.push({ yol: yol(el), sag: Math.round(kutu.right), metin: (el.textContent || '').trim().slice(0, 30) });
      }
    }
  }

  // Tarayıcı yüzeyleri — tasarımın çizilmeyen parçaları
  const kok = getComputedStyle(document.documentElement);
  const govde = getComputedStyle(document.body);
  out.yuzey = {
    secimTanimli: [...document.styleSheets].some((ss) => {
      try {
        return [...ss.cssRules].some((r) => /::selection/.test(r.cssText || ''));
      } catch {
        return false;
      }
    }),
    caret: govde.caretColor,
    scrollbarWidth: govde.scrollbarWidth || '(varsayılan)',
    accentColor: govde.accentColor,
    colorScheme: kok.colorScheme,
  };

  return out;
};

const rapor = [];

for (const [ad, yolu] of hedefler) {
  await page.goto(`http://localhost:4712/#${yolu}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  await page.screenshot({ path: join(OUT, `${ad}.png`), fullPage: false });
  await page.screenshot({ path: join(OUT, `${ad}-tam.png`), fullPage: true });

  const olcum = await page.evaluate(OLC);
  rapor.push({ ad, yol: yolu, ...olcum });
}

await browser.close();
server.close();

// ── Rapor ───────────────────────────────────────────────────────────────────
console.log('\n══ TASARIM DENETİMİ ══\n');

let toplamKontrast = 0;
let toplamHedef = 0;
let toplamPunto = 0;
let toplamTasma = 0;

for (const r of rapor) {
  const sorun = r.kontrast.length + r.hedef.length + r.punto.length + r.tasma.length;
  toplamKontrast += r.kontrast.length;
  toplamHedef += r.hedef.length;
  toplamPunto += r.punto.length;
  toplamTasma += r.tasma.length;

  console.log(`${sorun === 0 ? '✓' : '✗'} ${r.ad.padEnd(14)} ${String(r.yol).padEnd(30)} ${sorun} bulgu`);

  for (const k of r.kontrast.slice(0, 6)) {
    console.log(`    kontrast ${k.oran}:1 (< ${k.esik}) ${k.px}px · "${k.metin}" · ${k.yol}`);
  }
  for (const h of r.hedef.slice(0, 5)) {
    console.log(`    dokunma  ${h.w}×${h.h} · "${h.metin}" · ${h.yol}`);
  }
  for (const p of r.punto.slice(0, 4)) {
    console.log(`    punto    ${p.px}px · "${p.metin}"`);
  }
  for (const t of r.tasma.slice(0, 4)) {
    console.log(`    taşma    sağ ${t.sag}px · "${t.metin}"`);
  }
}

console.log('\n── toplam ──');
console.log(`  kontrast altı : ${toplamKontrast}`);
console.log(`  küçük hedef   : ${toplamHedef}`);
console.log(`  12px altı     : ${toplamPunto}`);
console.log(`  yatay taşma   : ${toplamTasma}`);
console.log(`  tarayıcı yüzeyleri:`, JSON.stringify(rapor[0]?.yuzey ?? {}));

if (konsolHatalari.length) {
  console.log('\n── tarayıcı hataları ──');
  for (const e of [...new Set(konsolHatalari)].slice(0, 10)) console.log('  !', e);
}

console.log(`\ngörüntüler: ${OUT}`);
