#!/usr/bin/env node
/**
 * Elle yazılan rehberleri TypeScript kaynağından JSON'a çevirir.
 *
 *   lib/vatandas-rehberi/authored/*.ts  →  lib/vatandas-rehberi/authored/*.json
 *
 * Neden gerek var: metinler yazarken tip denetimi olsun diye TS olarak
 * tutuluyor, ama site haritası, kalite denetimi ve mobil uygulama derleyicisi
 * düz Node betikleri; TS'i içe aktaramıyorlar. Bu betik ikisini bağlar.
 *
 * TS dosyaları tek bir nesne sabiti dışa aktarır ve yalnız düz veri içerir;
 * bu yüzden dinamik içe aktarma yerine güvenli bir değerlendirme yeterlidir.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'lib', 'vatandas-rehberi', 'authored');

const files = readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
let written = 0;

for (const file of files) {
  const src = readFileSync(join(dir, file), 'utf8');

  // `export const x: VatandasArticle = { … };` → nesne gövdesi
  const start = src.indexOf('= {', src.indexOf('export const'));
  const end = src.lastIndexOf('};');
  if (start < 0 || end < 0) {
    console.error(`  ! ${file}: nesne bulunamadı, atlandı`);
    continue;
  }

  const body = src.slice(start + 2, end + 1);
  let obj;
  try {
    // Düz veri; fonksiyon veya referans içermez.
    // eslint-disable-next-line no-new-func
    obj = new Function(`return (${body});`)();
  } catch (e) {
    console.error(`  ! ${file}: ayrıştırılamadı — ${e.message}`);
    process.exitCode = 1;
    continue;
  }

  const out = join(dir, file.replace(/\.ts$/, '.json'));
  writeFileSync(out, `${JSON.stringify(obj, null, 2)}\n`);
  written += 1;
  console.log(`  ✓ ${obj.slug}  (${countWords(obj)} kelime)`);
}

console.log(`\n[authored] ${written} rehber JSON'a yazıldı`);

if (written === 0) {
  console.error('[authored] hiçbir rehber çevrilemedi');
  process.exit(1);
}

function countWords(a) {
  const text = [
    a.lead,
    a.keyInsight,
    ...(a.sections || []).flatMap((s) => [
      s.heading,
      ...(s.paragraphs || []),
      ...(s.bullets || []),
    ]),
    ...(a.steps || []),
    ...(a.checklist || []),
    ...(a.faq || []).flatMap((f) => [f.q, f.a]),
  ]
    .filter(Boolean)
    .join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}
