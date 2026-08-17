#!/usr/bin/env node
/**
 * Mobil uygulama içerik paketleri → public/app-packs/{kanun}.json.gz
 *
 * Sitedeki içerik paketleri madde başına hem resmî metni hem şerhi taşır.
 * Uygulamaya yalnız RESMÎ METİN girer:
 *
 *  1. Şerhlerin %98,8'i kalıptan üretilmiş ve maddeyle ilgisiz — bir hukuk
 *     uygulamasına konulamaz.
 *  2. Resmî metin otantiktir; Resmî Gazete'de yayımlanan hâlidir.
 *  3. Boyut: şerh, paketin neredeyse tamamını kaplıyor. Atınca uygulama
 *     çevrimdışı tüm mevzuatı makul bir indirmeyle taşıyabiliyor.
 *
 * Denetimden geçen 95 şerh ayrıca `c` alanıyla eklenir — gerçek olan gider,
 * kalıp olan gitmez. Şerh yeniden yazıldıkça bu sayı kendiliğinden büyür.
 *
 * Biçim (kısa anahtarlar — mobilde her kilobayt indirme demek):
 *   { "madde-1": { t: başlık, n: maddeNo, o: resmîMetin, c?: şerh } }
 */
import { gunzipSync, gzipSync } from 'node:zlib';
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { auditCommentary, isOfficialTextComplete } from '../lib/content-quality.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = existsSync(join(root, 'content-packs'))
  ? join(root, 'content-packs')
  : join(root, 'public', 'content-packs');
const outDir = join(root, 'public', 'app-packs');

if (!existsSync(srcDir)) {
  console.error('content-packs bulunamadı:', srcDir);
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

// Kanun adı paketin kendi kayıtlarından okunur; ayrı bir ad tablosuna
// bağlanmak, tablo ile paket listesi ayrıştığında sessiz boşluk üretiyordu.
const manifest = [];
let totalSrc = 0;
let totalOut = 0;
let totalArticles = 0;
let keptCommentary = 0;
let incompleteOfficial = 0;

for (const file of readdirSync(srcDir).filter((f) => f.endsWith('.json.gz'))) {
  const kanunId = file.replace('.json.gz', '');
  const raw = readFileSync(join(srcDir, file));
  let pack;
  try {
    pack = JSON.parse(gunzipSync(raw));
  } catch {
    console.warn(`  ! ${file} açılamadı, atlandı`);
    continue;
  }

  const slim = {};
  let kanunLabel = '';
  let withCommentary = 0;

  for (const [key, art] of Object.entries(pack)) {
    if (!kanunLabel && art?.kanun) kanunLabel = art.kanun;
    const official = String(art?.official || '');
    const entry = {
      t: art?.title || key,
      n: typeof art?.maddeNo === 'number' ? art.maddeNo : 0,
      o: official,
    };
    // x: 1 → resmî metin eksik ya da yerine özet konulmuş. Uygulama bu
    // maddeleri uyarı şeridiyle gösterir; metin sessizce kanun diye
    // sunulmaz.
    if (!isOfficialTextComplete(official)) {
      entry.x = 1;
      incompleteOfficial += 1;
    }
    const commentary = String(art?.commentary || '');
    if (commentary && auditCommentary(kanunId, commentary).publishable) {
      entry.c = commentary;
      withCommentary += 1;
    }
    slim[key] = entry;
  }

  const json = JSON.stringify(slim);
  const gz = gzipSync(Buffer.from(json, 'utf8'), { level: 9 });
  writeFileSync(join(outDir, `${kanunId}.json.gz`), gz);

  const count = Object.keys(slim).length;
  totalSrc += raw.length;
  totalOut += gz.length;
  totalArticles += count;
  keptCommentary += withCommentary;

  manifest.push({
    id: kanunId,
    name: kanunLabel || kanunId.toUpperCase(),
    articles: count,
    commentaries: withCommentary,
    bytes: gz.length,
  });
}

manifest.sort((a, b) => b.articles - a.articles);

writeFileSync(
  join(outDir, 'manifest.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      format: 1,
      totalArticles,
      totalBytes: totalOut,
      note:
        'Yalnız resmî metin. Şerh alanı (c) yalnız denetimden geçen maddelerde bulunur.',
      packs: manifest,
    },
    null,
    2
  )
);

console.log(`[app-packs] ${manifest.length} kanun · ${totalArticles} madde`);
console.log(
  `[app-packs] kaynak ${(totalSrc / 1048576).toFixed(1)} MB → uygulama ${(totalOut / 1048576).toFixed(1)} MB ` +
    `(%${((1 - totalOut / totalSrc) * 100).toFixed(0)} küçültme)`
);
console.log(`[app-packs] taşınan gerçek şerh: ${keptCommentary}`);
if (incompleteOfficial > 0) {
  console.log(
    `[app-packs] resmî metni eksik işaretlenen madde: ${incompleteOfficial} ` +
      '(uygulamada uyarı şeridiyle gösterilir)'
  );
}
console.log('\nen büyük 8:');
for (const p of [...manifest].sort((a, b) => b.bytes - a.bytes).slice(0, 8)) {
  console.log(
    `  ${p.id.padEnd(18)}${String(p.articles).padStart(5)} madde  ${(p.bytes / 1024).toFixed(0).padStart(6)} KB`
  );
}
