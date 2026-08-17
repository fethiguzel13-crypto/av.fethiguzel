#!/usr/bin/env node
/**
 * Külliyattaki resmî madde metnini kaynakla karşılaştırır — DEĞİŞTİRMEZ.
 *
 * Amaç, "gösterdiğimiz metin Resmî Gazete'dekiyle aynı mı" sorusuna ölçüyle
 * cevap vermek. OCR kaynaklı kelime yapışması ve boşluk kayması bu depoda
 * 1.027 maddede tespit edilmişti; hangi maddede gerçek bir SÖZCÜK farkı
 * olduğunu ise ancak kaynakla kıyaslamak gösterir.
 *
 * Üç ayrı normalleştirme düzeyinde karşılaştırır:
 *   1. boşluk  — yalnız boşluklar sadeleştirilir
 *   2. sözcük  — bütün boşluklar silinir (yapışmalar eşitlenir)
 *   3. harf    — noktalama da silinir
 *
 * "boşluk" farklı ama "sözcük" aynı ise sorun yalnız boşluktadır ve arama
 * boşluğa duyarsız olduğu için kullanıcıya yansımaz. "sözcük" de farklıysa
 * metinde gerçek bir sapma vardır ve elle bakılması gerekir.
 *
 *   node scripts/compare-official-text.mjs --kanun=tmk --kaynak=4721.txt
 *   node scripts/compare-official-text.mjs --kanun=tmk --kaynak=4721.txt --detay=606
 */
import { gunzipSync } from 'node:zlib';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MADDE_BASI, baslikGorunumlu, dipnotAyikla, satirlaraBol } from './lib/official-text.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const arg = (n) => {
  const h = process.argv.find((a) => a.startsWith(`--${n}=`));
  return h ? h.slice(n.length + 3) : null;
};

const kanunId = arg('kanun');
const kaynakYolu = arg('kaynak');
const detay = arg('detay');

if (!kanunId || !kaynakYolu) {
  console.error('kullanım: node scripts/compare-official-text.mjs --kanun=tmk --kaynak=4721.txt [--detay=606]');
  process.exit(1);
}

const packDir = existsSync(join(root, 'content-packs'))
  ? join(root, 'content-packs')
  : join(root, 'public', 'content-packs');
const pack = JSON.parse(gunzipSync(readFileSync(join(packDir, `${kanunId}.json.gz`))).toString());

/* ── Kaynağı maddelere böl ──────────────────────────────────────────── */

const GECICI = /^(?:EK|GEÇİCİ|Ek|Geçici)\s+[Mm]adde/;

const satirlar = satirlaraBol(readFileSync(kaynakYolu, 'utf8'));

const kaynakMaddeleri = new Map();
let aktif = null;
for (const satir of satirlar) {
  const m = satir.match(MADDE_BASI);
  if (m && !GECICI.test(satir)) {
    const anahtar = `${m[2]}${(m[3] || '').toLocaleUpperCase('tr')}`;
    aktif = kaynakMaddeleri.has(anahtar) ? null : { anahtar, satirlar: [satir] };
    if (aktif) kaynakMaddeleri.set(anahtar, aktif);
    continue;
  }
  if (m) aktif = null; // ek/geçici madde: sayısal anahtarla karıştırma
  if (aktif) aktif.satirlar.push(satir);
}

/*
 * Kaynak tarafına da onarımın uyguladığı ayıklama uygulanır. Uygulanmazsa
 * doğrulama, onarımın attığı dipnotları "fark" diye sayar ve her madde
 * sapmış görünür — İİK %98 sapma raporu tam olarak bu yüzden çıkmıştı.
 */
for (const madde of kaynakMaddeleri.values()) {
  madde.satirlar = dipnotAyikla(madde.satirlar).kalan;
}

/* ── Normalleştirme ─────────────────────────────────────────────────── */

/**
 * Kıyaslanacak gövdeyi ayıklar.
 *
 * Külliyattaki `official` alanı madde metninden fazlasını taşır: üstünde
 * kalın yazılmış kenar başlığı, altında `---` ayracı vardır. Kaynak tarafta
 * ise bir sonraki maddenin kenar başlığı metnin sonuna yapışır. İkisi de
 * kıyaslamaya girerse her madde "farklı" çıkar — ilk denemede %100 sapma
 * bundan doğdu.
 */
const govdeyiAl = (s) => {
  let t = s.replace(/\*\*/g, '').replace(/^\s*---\s*$/gm, '\n');

  // İki adım gerekir, biri diğerinin yerini tutmaz:
  //  1. İlk `Madde N` işaretinden ÖNCESİNİ at — külliyatta metnin üstünde
  //     kenar başlığı durur ("2. Süre / a. Genel olarak"), kaynakta durmaz.
  //  2. Kalan `Madde N` işaretlerini de at — külliyat aynı işareti bir kez
  //     başlıkta, bir kez metnin içinde tekrarlıyor.
  const bas = t.search(/(?:^|\n)[ \t]*(?:MADDE|Madde)[ \t]+\d+[ \t]*(?:\/|[–—-]|[A-ZÇĞİÖŞÜ(]|$)/m);
  if (bas >= 0) t = t.slice(bas);
  t = t.replace(
    /(?:^|\n)[ \t]*(?:MADDE|Madde)[ \t]+\d+[ \t]*(?:\/[ \t]*[A-ZÇĞİÖŞÜa-zçğıöşü])?[ \t]*[–—-]?[ \t]*/g,
    '\n',
  );

  // Değişiklik künyeleri metnin parçası değil.
  t = t.replace(/\(\s*(?:Değişik|Ek|Mülga|İptal)[^)]*\)/gi, ' ');

  // Sondaki kenar başlıkları bir SONRAKİ maddeye aittir. Ölçüt onarım
  // betiğiyle aynı olmalı; ayrı bir kural yazınca İİK ve VUK'ta iki nokta
  // ile biten başlıklar ("Verginin terkini:") kaynakta kaldı ve her madde
  // sapmış göründü.
  const satir = t.split('\n').map((x) => x.trim());
  while (satir.length && (!satir[satir.length - 1] || baslikGorunumlu(satir[satir.length - 1]))) {
    satir.pop();
  }
  return satir.join(' ');
};

const nBosluk = (s) =>
  govdeyiAl(s)
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('tr')
    // Tırnak ve tire çeşitlerini tek biçime indir; kaynak ile külliyat
    // farklı tipografik karakterler kullanıyor.
    .replace(/[“”„«»]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-');
const nSozcuk = (s) => nBosluk(s).replace(/\s+/g, '');
const nHarf = (s) => nSozcuk(s).replace(/[^\p{L}\p{N}]/gu, '');

/* ── Karşılaştır ────────────────────────────────────────────────────── */

const sonuc = { ayni: 0, boslukFarki: 0, sozcukFarki: 0, harfFarki: 0, kaynaktaYok: 0 };
const sapanlar = [];

for (const [key, art] of Object.entries(pack)) {
  const m = key.match(/^madde-(\d+)([A-Za-z]?)$/);
  if (!m) continue;
  const anahtar = `${m[1]}${m[2].toLocaleUpperCase('tr')}`;
  const kaynak = kaynakMaddeleri.get(anahtar);
  if (!kaynak) {
    sonuc.kaynaktaYok++;
    continue;
  }
  const a = art.official || '';
  const b = kaynak.satirlar.join('\n');

  if (nBosluk(a) === nBosluk(b)) {
    sonuc.ayni++;
    continue;
  }
  if (nSozcuk(a) === nSozcuk(b)) {
    sonuc.boslukFarki++;
    continue;
  }
  if (nHarf(a) === nHarf(b)) {
    sonuc.harfFarki++;
    sapanlar.push({ anahtar, tur: 'noktalama', a, b });
    continue;
  }
  sonuc.sozcukFarki++;
  sapanlar.push({ anahtar, tur: 'SÖZCÜK', a, b });
}

if (detay) {
  const s = sapanlar.find((x) => x.anahtar === detay);
  if (!s) {
    console.log(`madde-${detay}: sapma yok ya da kaynakta bulunamadı`);
    process.exit(0);
  }
  // Metinlerin tamamını gözle karşılaştırmak yerine AYRILDIĞI yeri göster;
  // uzun maddelerde fark çoğu zaman metnin ortasında tek bir sözcüktür.
  const a = nSozcuk(s.a);
  const b = nSozcuk(s.b);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;

  console.log(`── madde-${s.anahtar} (${s.tur}) ──`);
  console.log(`uzunluk: külliyat ${a.length}, kaynak ${b.length} · ilk ayrılma ${i}\n`);
  console.log(`KÜLLİYAT …${a.slice(Math.max(0, i - 70), i + 70)}…`);
  console.log(`KAYNAK   …${b.slice(Math.max(0, i - 70), i + 70)}…\n`);
  if (process.argv.includes('--tam')) {
    console.log(`KÜLLİYAT (tam):\n${s.a}\n\nKAYNAK (tam):\n${s.b}`);
  }
  process.exit(0);
}

const toplam = sonuc.ayni + sonuc.boslukFarki + sonuc.harfFarki + sonuc.sozcukFarki;
const yuzde = (n) => (toplam ? ((n / toplam) * 100).toFixed(1) : '0.0');

console.log(`\n── ${kanunId} · ${toplam} madde karşılaştırıldı ──\n`);
console.log(`  birebir aynı            ${String(sonuc.ayni).padStart(5)}  %${yuzde(sonuc.ayni)}`);
console.log(`  yalnız boşluk farkı     ${String(sonuc.boslukFarki).padStart(5)}  %${yuzde(sonuc.boslukFarki)}`);
console.log(`  noktalama farkı         ${String(sonuc.harfFarki).padStart(5)}  %${yuzde(sonuc.harfFarki)}`);
console.log(`  SÖZCÜK FARKI            ${String(sonuc.sozcukFarki).padStart(5)}  %${yuzde(sonuc.sozcukFarki)}`);
console.log(`  kaynakta eşleşmeyen     ${String(sonuc.kaynaktaYok).padStart(5)}  (ek/geçici madde olabilir)\n`);

const raporDizini = join(root, 'data', 'official-repair');
mkdirSync(raporDizini, { recursive: true });
const yol = join(raporDizini, `${kanunId}-karsilastirma.md`);
writeFileSync(
  yol,
  [
    `# ${kanunId} — resmî metin karşılaştırması`,
    '',
    `Kaynak: \`${kaynakYolu}\``,
    `Aynı ${sonuc.ayni} · boşluk ${sonuc.boslukFarki} · noktalama ${sonuc.harfFarki} · sözcük ${sonuc.sozcukFarki}`,
    '',
    'Sözcük farkı olan maddeler elle incelenmelidir:',
    '',
    ...sapanlar.filter((s) => s.tur === 'SÖZCÜK').map((s) => `- madde-${s.anahtar}`),
    '',
    'Ayrıntı: `node scripts/compare-official-text.mjs --kanun=<id> --kaynak=<txt> --detay=<madde>`',
  ].join('\n'),
  'utf8',
);
console.log(`  rapor → ${yol}\n`);
