#!/usr/bin/env node
/**
 * Geçersiz Tailwind opaklık değerlerini bulur.
 *
 * Tailwind 3'te renk opaklığı yalnız `opacity` ölçeğindeki değerlerle
 * yazılabilir (0, 5, 10, 15 … 100). Ölçek dışı bir değer — `border-charcoal/8`
 * gibi — HATA VERMEZ; Tailwind o sınıfı sessizce üretmez. Sonuç: kenarlık
 * hiç çizilmez, metin varsayılan renkte kalır, kimse fark etmez.
 *
 * Doğrusu köşeli parantez biçimidir: `border-charcoal/[0.08]`
 *
 *   node scripts/lint-tailwind-opacity.mjs          # rapor
 *   node scripts/lint-tailwind-opacity.mjs --fix    # /8 → /[0.08] dönüşümü
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fix = process.argv.includes('--fix');

// Tailwind 3 varsayılan opaklık ölçeği: 0 ve 5'in katları
const VALID = new Set(Array.from({ length: 21 }, (_, i) => i * 5));

const SCAN_DIRS = ['app', 'components', 'lib', 'mobile/app-src/src'];
const EXT = /\.(tsx?|jsx?|css)$/;
const SKIP = /node_modules|\.next|generated|__tests__/;

/** class="… border-charcoal/8 …" biçimindeki opaklık ekleri */
const RE = /\b((?:bg|text|border|ring|divide|placeholder|from|via|to|shadow|outline|decoration|accent|caret|fill|stroke)-[a-z]+(?:-\d{2,3})?)\/(\d{1,3})\b/g;

const findings = [];

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const p = join(dir, name);
    if (SKIP.test(p)) continue;
    let st;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(p);
    else if (EXT.test(name)) scan(p);
  }
}

function scan(file) {
  const src = readFileSync(file, 'utf8');
  let changed = src;
  let hits = 0;

  const lines = src.split('\n');
  lines.forEach((line, i) => {
    RE.lastIndex = 0;
    let m;
    while ((m = RE.exec(line))) {
      const value = parseInt(m[2], 10);
      if (VALID.has(value)) continue;
      hits += 1;
      findings.push({
        file: relative(root, file),
        line: i + 1,
        cls: `${m[1]}/${m[2]}`,
        suggest: `${m[1]}/[${(value / 100).toFixed(2)}]`,
      });
    }
  });

  if (fix && hits > 0) {
    changed = src.replace(RE, (whole, prefix, num) => {
      const value = parseInt(num, 10);
      if (VALID.has(value)) return whole;
      return `${prefix}/[${(value / 100).toFixed(2)}]`;
    });
    if (changed !== src) writeFileSync(file, changed);
  }
}

for (const d of SCAN_DIRS) walk(join(root, d));

if (findings.length === 0) {
  console.log('[opacity] geçersiz opaklık değeri yok');
  process.exit(0);
}

const byClass = new Map();
for (const f of findings) byClass.set(f.cls, (byClass.get(f.cls) ?? 0) + 1);

const byFile = new Map();
for (const f of findings) byFile.set(f.file, (byFile.get(f.file) ?? 0) + 1);

console.log(`[opacity] ${findings.length} geçersiz kullanım · ${byFile.size} dosya\n`);
console.log('en sık geçenler:');
for (const [cls, n] of [...byClass.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)) {
  console.log(`  ${String(n).padStart(4)}×  ${cls}`);
}
console.log('\nen çok etkilenen dosyalar:');
for (const [file, n] of [...byFile.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)) {
  console.log(`  ${String(n).padStart(4)}×  ${file}`);
}

if (fix) {
  console.log('\n→ düzeltildi (köşeli parantez biçimine çevrildi)');
} else {
  console.log('\nDüzeltmek için: node scripts/lint-tailwind-opacity.mjs --fix');
  process.exitCode = 1;
}
