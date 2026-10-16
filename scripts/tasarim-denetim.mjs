#!/usr/bin/env node
/**
 * Web tasarım denetimi (G15) — derlenmiş siteyi gerçek tarayıcıda ölçer.
 *
 * Her sayfada masaüstü (1280) ve mobil (390) genişlikte:
 *   - axe-core WCAG 2.x A/AA kuralları (kontrast dahil; büyük metin ve saydamlığı axe hesaplar),
 *   - hedef boyutu (WCAG 2.2 2.5.8, 24 px; aralık istisnası ve cümle içindeki bağlantı istisnası uygulanır),
 *   - yatay taşma (yatay kaydırıcı içindekiler sayılmaz),
 *   - ilk ekranın görüntüsü,
 *   - `--yapi` verilirse (G24) belge dili, başlık sırası, işaret bölgeleri, alt metni olmayan görsel, adı olmayan grafik ve atlama
 *     bağlantısının hedefi (`lib/erisilebilirlik.mjs`).
 *
 * Sunucu bu betik tarafından başlatılmaz; önce `npx next start -p 3123` çalışmalıdır.
 *
 * Kullanım:
 *   node scripts/tasarim-denetim.mjs --etiket=once [--taban=http://localhost:3123] [--sadece=anasayfa,madde] [--yapi]
 *     [--genislik=320]   (varsayılan 1280,390; 320 px WCAG 1.4.10 yeniden akış ölçümüdür)
 * Çıktı:
 *   docs/aylik-plan/raporlar/tasarim-denetim-<etiket>.json
 *   docs/aylik-plan/raporlar/gorsel/g15-<sayfa>-<genişlik>-<etiket>.jpg
 *   docs/aylik-plan/raporlar/erisilebilirlik-<etiket>.json (`--yapi` ile)
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { DENETIM_SAYFALARI, genislikSec, hedefIhlalleri, ozetle } from '../lib/tasarim-denetim.mjs';
import { yapiDenetimi, yapiOzeti } from '../lib/erisilebilirlik.mjs';

const kok = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (ad, varsayilan) => {
  const a = process.argv.find((x) => x.startsWith(`--${ad}=`));
  return a ? a.slice(ad.length + 3) : varsayilan;
};
const etiket = arg('etiket', '');
if (!/^[a-z0-9-]+$/.test(etiket)) {
  console.error('--etiket=<once|sonra|…> gerekli');
  process.exit(1);
}
const taban = arg('taban', 'http://localhost:3123');
const sadece = arg('sadece', '');
const yapi = process.argv.includes('--yapi');
const sayfalar = sadece ? DENETIM_SAYFALARI.filter((s) => sadece.split(',').includes(s.ad)) : DENETIM_SAYFALARI;
const raporKlasoru = join(kok, 'docs', 'aylik-plan', 'raporlar');
const gorselKlasoru = join(raporKlasoru, 'gorsel');
mkdirSync(gorselKlasoru, { recursive: true });

const axeKaynak = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const GENISLIKLER = genislikSec(arg('genislik', ''));

/** Sayfa içinde: hedef kutuları ve taşma. */
const OLC = () => {
  const hedefler = [];
  for (const el of document.querySelectorAll('a[href], button, [role="button"], input:not([type="hidden"]), select, textarea, summary')) {
    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || st.display === 'none') continue;
    const k = el.getBoundingClientRect();
    if (!k.width || !k.height) continue;
    // 2.5.8 istisnası: cümle içindeki bağlantı (ebeveyninde kendi metni olan satır içi bağlantı).
    if (el.tagName === 'A' && st.display === 'inline') {
      const ebeveynMetni = [...el.parentElement.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
      if (ebeveynMetni) continue;
    }
    hedefler.push({
      x: Math.round(k.left + scrollX),
      y: Math.round(k.top + scrollY),
      w: Math.round(k.width),
      h: Math.round(k.height),
      etiket: el.tagName.toLowerCase(),
      metin: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
      sinif: (typeof el.className === 'string' ? el.className : '').slice(0, 120),
    });
  }
  const tasanlar = [];
  for (const el of document.querySelectorAll('body *')) {
    const k = el.getBoundingClientRect();
    if (k.right <= window.innerWidth + 1 || !k.width) continue;
    let kaydirici = false;
    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      const ox = getComputedStyle(n).overflowX;
      if (ox === 'auto' || ox === 'scroll' || ox === 'hidden' || ox === 'clip') {
        kaydirici = true;
        break;
      }
    }
    if (!kaydirici) tasanlar.push({ etiket: el.tagName.toLowerCase(), sag: Math.round(k.right), sinif: String(el.className).slice(0, 80) });
  }
  return { hedefler, tasanlar, belgeGenisligi: document.documentElement.scrollWidth };
};

/** Sayfa içinde (G24 `--yapi`): dil, başlıklar, işaret bölgeleri, adsız görsel ve grafik, atlama hedefi. */
const YAPI = () => {
  // Yardımcı teknolojinin gördüğü öğeler: sr-only öğe sayılır, display:none ve aria-hidden altı sayılmaz.
  const erisilir = (el) =>
    (el.checkVisibility ? el.checkVisibility({ visibilityProperty: true }) : true) && !el.closest('[aria-hidden="true"]');
  const say = (secici) => [...document.querySelectorAll(secici)].filter(erisilir).length;
  const tanim = (el) => {
    const sinif = (el.getAttribute('class') || '').trim();
    return el.tagName.toLowerCase() + (sinif ? '.' + sinif.split(/\s+/).slice(0, 3).join('.') : '');
  };
  const adli = (el) => {
    const baslik = el.querySelector(':scope > title');
    return Boolean((el.getAttribute('aria-label') || '').trim() || el.getAttribute('aria-labelledby') || (baslik && baslik.textContent.trim()));
  };
  return {
    lang: document.documentElement.getAttribute('lang'),
    basliklar: [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].filter(erisilir).map((h) => ({
      duzey: Number(h.tagName[1]),
      metin: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 60),
    })),
    bolgeler: {
      main: say('main, [role="main"]'),
      nav: say('nav, [role="navigation"]'),
      header: say('header, [role="banner"]'),
      footer: say('footer, [role="contentinfo"]'),
    },
    altsizGorsel: [...document.querySelectorAll('img:not([alt])')]
      .filter((el) => erisilir(el) && !['presentation', 'none'].includes(el.getAttribute('role')))
      .slice(0, 10)
      .map((el) => (el.getAttribute('src') || '').slice(0, 120)),
    adsizGrafik: [...document.querySelectorAll('[role="img"]')].filter((el) => erisilir(el) && !adli(el)).slice(0, 10).map(tanim),
    atlama: {
      baglanti: Boolean(document.querySelector('a[href="#main-content"]')),
      hedef: Boolean(document.getElementById('main-content')),
    },
  };
};

const browser = await chromium.launch();
const sonuclar = [];
const yapiSonuclari = [];
try {
  for (const g of GENISLIKLER) {
    const ctx = await browser.newContext({ viewport: { width: g.w, height: g.h }, deviceScaleFactor: 1, locale: 'tr-TR' });
    const page = await ctx.newPage();
    for (const s of sayfalar) {
      const t0 = Date.now();
      let yanit = await page.goto(taban + s.yol, { waitUntil: 'networkidle', timeout: 90_000 });
      let adres = s.yol;
      if (s.izle) {
        const href = await page.getAttribute(s.izle, 'href').catch(() => null);
        if (href) {
          adres = href;
          yanit = await page.goto(taban + href, { waitUntil: 'networkidle', timeout: 90_000 });
        }
      }
      // Giriş canlandırmaları (hero-fade vb.) bitsin, yoksa saydam ara karede kontrast yanlış ölçülür.
      await page.waitForTimeout(1500);
      await page.screenshot({ path: join(gorselKlasoru, `g15-${s.ad}-${g.ad}-${etiket}.jpg`), type: 'jpeg', quality: 80 });
      await page.addScriptTag({ content: axeKaynak });
      const axe = await page.evaluate(async () => {
        const r = await window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
          resultTypes: ['violations'],
        });
        return r.violations.map((v) => ({
          id: v.id,
          etki: v.impact,
          dugum: v.nodes.length,
          ornekler: v.nodes.slice(0, 40).map((n) => ({
            hedef: n.target.join(' '),
            html: n.html.slice(0, 220),
            veri: n.any[0] && n.any[0].data && typeof n.any[0].data === 'object' ? n.any[0].data : null,
          })),
        }));
      });
      const olcum = await page.evaluate(OLC);
      sonuclar.push({
        sayfa: s.ad,
        adres,
        durum: yanit ? yanit.status() : null,
        genislik: g.w,
        ihlaller: axe,
        hedef: hedefIhlalleri(olcum.hedefler),
        tasma: olcum.belgeGenisligi > g.w + 1,
        tasanlar: olcum.tasanlar.slice(0, 10),
        sure: Date.now() - t0,
      });
      const kontrast = axe.find((v) => v.id === 'color-contrast');
      console.log(
        `${s.ad.padEnd(13)} ${String(g.w).padStart(4)}  durum ${yanit && yanit.status()}  ihlal ${axe.length}  kontrast ${kontrast ? kontrast.dugum : 0}` +
          `  küçük hedef ${hedefIhlalleri(olcum.hedefler).length}  taşma ${olcum.belgeGenisligi > g.w + 1 ? 'VAR' : 'yok'}`
      );
      if (yapi) {
        const veri = await page.evaluate(YAPI);
        const bulgular = yapiDenetimi(veri);
        yapiSonuclari.push({ sayfa: s.ad, adres, genislik: g.w, bulgular, basliklar: veri.basliklar, bolgeler: veri.bolgeler });
        console.log(`${''.padEnd(19)}yapı bulgusu ${bulgular.length}${bulgular.length ? '  ' + bulgular.map((b) => b.kural).join(', ') : ''}`);
      }
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}

const ozet = ozetle(sonuclar);
writeFileSync(
  join(raporKlasoru, `tasarim-denetim-${etiket}.json`),
  JSON.stringify({ etiket, taban, tarih: new Date().toISOString(), ozet, sonuclar }, null, 1)
);
console.log('\nkural başına:');
for (const k of ozet.kurallar) console.log(`  ${k.id.padEnd(28)} ${k.etki.padEnd(9)} düğüm ${String(k.dugum).padStart(4)}  sayfa ${k.sayfa}`);
console.log(`küçük hedef: ${ozet.kucukHedef}  ·  taşan: ${ozet.tasan.join(', ') || 'yok'}`);

if (yapi) {
  const yapiOzet = yapiOzeti(yapiSonuclari);
  writeFileSync(
    join(raporKlasoru, `erisilebilirlik-${etiket}.json`),
    JSON.stringify({ etiket, taban, tarih: new Date().toISOString(), ozet: yapiOzet, sonuclar: yapiSonuclari }, null, 1)
  );
  console.log('\nyapı kuralı başına:');
  for (const k of yapiOzet) console.log(`  ${k.kural.padEnd(20)} bulgu ${String(k.bulgu).padStart(3)}  sayfa ${k.sayfalar.join(', ')}`);
  if (!yapiOzet.length) console.log('  yapı bulgusu yok');
}
