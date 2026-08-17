#!/usr/bin/env node
/**
 * Madde metni sorgulama — yazım sırasında doğrulama aracı.
 *
 *   node scripts/madde.mjs tmk 605
 *   node scripts/madde.mjs tmk 605-618          aralık
 *   node scripts/madde.mjs --ara "mirasın reddi"   başlıkta ara
 *   node scripts/madde.mjs --ara "ret" --kanun=tmk
 *
 * Rehber ve şerh yazarken her madde göndermesi buradan doğrulanır. Bir madde
 * numarasını hafızadan yazmak, bu projede zaten bir kez 8.000 sayfalık yanlış
 * içerik üretmiş bir hata sınıfıdır; araç o yolu kapatmak için var.
 */
import { gunzipSync } from 'node:zlib';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = existsSync(join(root, 'content-packs'))
  ? join(root, 'content-packs')
  : join(root, 'public', 'content-packs');

const args = process.argv.slice(2);
const searchArg = argValue('--ara');
const kanunFilter = argValue('--kanun');
const full = args.includes('--tam');

function argValue(flag) {
  const i = args.indexOf(flag);
  if (i >= 0 && args[i + 1] && !args[i + 1].startsWith('--')) return args[i + 1];
  const inline = args.find((a) => a.startsWith(`${flag}=`));
  return inline ? inline.slice(flag.length + 1) : null;
}

function foldTr(s) {
  return String(s || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

function loadPack(kanunId) {
  const p = join(dir, `${kanunId}.json.gz`);
  if (!existsSync(p)) return null;
  return JSON.parse(gunzipSync(readFileSync(p)));
}

function clean(md) {
  return String(md || '')
    .replace(/\r/g, '')
    .replace(/^\*\*(.+?)\*\*\s*\n+---\s*\n+/, '$1\n\n')
    .replace(/\*\*/g, '')
    .trim();
}

// ─── Arama kipi ─────────────────────────────────────────────────────────────
if (searchArg) {
  const q = foldTr(searchArg);
  const tokens = q.split(/\s+/).filter(Boolean);
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.json.gz'))
    .filter((f) => !kanunFilter || f.startsWith(`${kanunFilter}.`));

  let hits = 0;
  for (const file of files) {
    const kanunId = file.replace('.json.gz', '');
    const pack = loadPack(kanunId);
    if (!pack) continue;
    for (const [key, a] of Object.entries(pack)) {
      const hay = foldTr(`${a.title} ${a.official}`);
      if (!tokens.every((t) => hay.includes(t))) continue;
      hits += 1;
      const head = clean(a.official).split('\n')[0].slice(0, 90);
      console.log(`${kanunId.toUpperCase().padEnd(8)} m.${String(a.maddeNo).padEnd(5)} ${head}`);
      if (hits >= 60) {
        console.log('\n… ilk 60 sonuç');
        process.exit(0);
      }
    }
  }
  if (!hits) console.log('sonuç yok');
  process.exit(0);
}

// ─── Madde kipi ─────────────────────────────────────────────────────────────
const [kanunId, range] = args.filter((a) => !a.startsWith('--'));
if (!kanunId || !range) {
  console.log('Kullanım:');
  console.log('  node scripts/madde.mjs tmk 605');
  console.log('  node scripts/madde.mjs tmk 605-618');
  console.log('  node scripts/madde.mjs --ara "mirasın reddi" [--kanun=tmk]');
  console.log('\nKanunlar:', readdirSync(dir).filter((f) => f.endsWith('.json.gz')).map((f) => f.replace('.json.gz', '')).join(', '));
  process.exit(1);
}

const pack = loadPack(kanunId.toLowerCase());
if (!pack) {
  console.error(`Kanun bulunamadı: ${kanunId}`);
  process.exit(1);
}

const m = /^(\d+)(?:-(\d+))?$/.exec(range);
if (!m) {
  console.error(`Geçersiz madde: ${range}`);
  process.exit(1);
}
const from = Number(m[1]);
const to = m[2] ? Number(m[2]) : from;

let found = 0;
for (let n = from; n <= to; n += 1) {
  const entry =
    pack[`madde-${n}`] || Object.values(pack).find((a) => a.maddeNo === n);
  if (!entry) continue;
  found += 1;
  const body = clean(entry.official);
  console.log('─'.repeat(72));
  console.log(`${kanunId.toUpperCase()} m. ${entry.maddeNo}`);
  console.log('─'.repeat(72));
  console.log(full ? body : body.slice(0, 1800));
  if (!full && body.length > 1800) console.log(`\n… (${body.length - 1800} karakter daha — --tam ile tamamı)`);
  console.log();
}

if (!found) console.error(`${kanunId.toUpperCase()} içinde ${range} bulunamadı`);
