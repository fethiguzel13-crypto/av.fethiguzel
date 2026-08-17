#!/usr/bin/env node
/**
 * Tek bir kanunun içerik paketini üretir.
 *
 *   node scripts/build-one-pack.mjs is-kanunu-1475
 *
 * `build-content-packs.mjs` tüm külliyatı (300 MB, 8.000+ dosya) tarar; tek
 * madde eklerken bunu çalıştırmak hem yavaş hem gereksiz risklidir. Bu betik
 * yalnız verilen klasörü okur ve aynı biçimde paket yazar.
 *
 * Çıktı üç yere gider — build-content-packs ile aynı hedefler:
 *   content-packs/<id>.json.gz
 *   public/content-packs/<id>.json.gz
 *   public/packs/<id>.json.gz
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import matter from 'gray-matter';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const kanunId = process.argv[2];

if (!kanunId) {
  console.error('Kullanım: node scripts/build-one-pack.mjs <kanunId>');
  process.exit(1);
}

const srcDir = join(root, 'content', 'mevzuat', kanunId);
if (!existsSync(srcDir)) {
  console.error(`İçerik klasörü yok: ${srcDir}`);
  process.exit(1);
}

const splitRegex = /\n### (?:Bizim Yorumumuz|Akademik Yorum ve Analiz)\s*\n/;
const pack = {};

for (const file of readdirSync(srcDir).filter((f) => f.endsWith('.md'))) {
  const raw = readFileSync(join(srcDir, file), 'utf8');
  const { data, content } = matter(raw);
  const parts = content.split(splitRegex);

  pack[file.replace(/\.md$/, '')] = {
    title: data.title || file,
    kanun: data.kanun || kanunId,
    maddeNo: Number(data.maddeNo) || 0,
    official: parts[0].trim(),
    commentary: (parts[1] || '').trim(),
  };
}

const count = Object.keys(pack).length;
if (count === 0) {
  console.error('Hiç madde bulunamadı — paket yazılmadı');
  process.exit(1);
}

const gz = gzipSync(Buffer.from(JSON.stringify(pack), 'utf8'), { level: 9 });

for (const dir of [
  join(root, 'content-packs'),
  join(root, 'public', 'content-packs'),
  join(root, 'public', 'packs'),
]) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${kanunId}.json.gz`), gz);
}

console.log(`[pack] ${kanunId}: ${count} madde · ${(gz.length / 1024).toFixed(1)} KB`);
console.log('       content-packs/ · public/content-packs/ · public/packs/');
