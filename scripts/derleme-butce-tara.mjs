/**
 * İlk yük betik bütçesi taraması (Aylık plan G13 adım 6). Anahtar sayfaların derleme HTML'inden ilk yük betiklerini
 * okur, `.next/static` altındaki dosya boyutlarını toplar (sıkıştırmasız KB) ve tabanla karşılaştırır. Kural
 * `scripts/lib/betik-butce.mjs`'te. Taban yalnız düşer; düşüşte taban dosyası yeniden yazılır.
 *   npm run build && node scripts/derleme-butce-tara.mjs            # bütçe aşılırsa çıkış kodu 1
 *   node scripts/derleme-butce-tara.mjs --taban                     # tabanı mevcut derlemeden yaz (yalnız ilk kurulum)
 * Ders notu sayfası derlemede önceden üretilmediği için hub sayfası temsil eder; madde sayfaları rota işleyicisi (betiksiz).
 */
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { butceKarsilastir, ilkYukBetikleri } from './lib/betik-butce.mjs';

const SAYFALAR = {
  '/': 'index.html',
  '/rehber/kidem-tazminati': 'rehber/kidem-tazminati.html',
  '/bilgi/kidem-tazminati-hesaplama': 'bilgi/kidem-tazminati-hesaplama.html',
  '/ders-notlari': 'ders-notlari.html',
  '/hesaplama/kidem': 'hesaplama/kidem.html',
  '/yargi-kararlari': 'yargi-kararlari.html',
  '/kavram/kidem-tazminati': 'kavram/kidem-tazminati.html',
  '/ercis-avukat': 'ercis-avukat.html',
  '/avukat-fethi-guzel': 'avukat-fethi-guzel.html',
};
const PAY = 0.02;
const APP = '.next/server/app';
const TABAN = 'scripts/betik-butce-taban.json';

if (!existsSync(APP)) {
  console.error(`${APP} yok; önce derleme gerekir (npm run build).`);
  process.exit(2);
}

const simdi = {};
for (const [sayfa, dosya] of Object.entries(SAYFALAR)) {
  const yol = join(APP, dosya);
  if (!existsSync(yol)) continue;
  let bayt = 0;
  for (const src of ilkYukBetikleri(readFileSync(yol, 'utf8'))) {
    const parca = join('.next', src.replace(/^\/_next\//, '').split('?')[0]);
    if (existsSync(parca)) bayt += statSync(parca).size;
  }
  simdi[sayfa] = Math.round(bayt / 102.4) / 10;
}

if (process.argv.includes('--taban') || !existsSync(TABAN)) {
  writeFileSync(TABAN, JSON.stringify(simdi, null, 2) + '\n', 'utf8');
  console.log(`Betik bütçesi tabanı yazıldı: ${Object.keys(simdi).length} sayfa`);
  process.exit(0);
}

const taban = JSON.parse(readFileSync(TABAN, 'utf8'));
const { asan, dusen, eksik, yeniTaban } = butceKarsilastir(taban, simdi, PAY);
for (const [sayfa, kb] of Object.entries(simdi)) console.log(`  ${sayfa}: ${kb} KB (taban ${taban[sayfa] ?? '—'})`);
if (dusen.length && !asan.length && !eksik.length) {
  writeFileSync(TABAN, JSON.stringify(yeniTaban, null, 2) + '\n', 'utf8');
  console.log(`Taban düştü: ${dusen.map((d) => d.sayfa).join(', ')}`);
}
for (const a of asan) console.log(`  BÜTÇE AŞILDI ${a.sayfa}: ${a.taban} → ${a.simdi} KB (pay %${PAY * 100})`);
for (const s of eksik) console.log(`  SAYFA DERLEMEDE YOK ${s}`);
if (asan.length || eksik.length) process.exit(1);
console.log(`Betik bütçesi: ${Object.keys(simdi).length} sayfa tabanın içinde`);
