#!/usr/bin/env node
/**
 * G19: Kalite dalgası derslerinin temsilci notlarını yedi ölçütle ölçer ve Markdown tablo basar (yalnız stdout, dosya yazmaz).
 *
 *   node scripts/ders-kanonik-olc.mjs            # tablo
 *   node scripts/ders-kanonik-olc.mjs --ayrinti  # ölçüt ayrıntısıyla
 *
 * Not, sitede gösterildiği gibi kanonik katman uygulanarak ölçülür (`lib/ders-notlari/kanonik-katman.mjs`).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { kanonikKalite, OLCUTLER } from '../lib/ders-notlari/kanonik-kalite.mjs';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const kanonik = JSON.parse(readFileSync(join(KOK, 'lib/ders-notlari/dizin-kanonik.json'), 'utf8'));

/** Plan G19'daki on ders (anayasa notu yok; ticari işletme ve şirketler iki ayrı ders, `gorevler/G19.md`). */
export const G19_DERSLER = [
  'borclar-genel',
  'medeni-usul',
  'ceza-genel',
  'icra-iflas',
  'miras-hukuku',
  'esya-hukuku',
  'is-hukuku',
  'ticari-isletme',
  'ticaret-sirketler',
  'idare-hukuku',
];

let uygula = (n) => n;
const katmanYolu = join(KOK, 'lib/ders-notlari/kanonik-katman.mjs');
if (existsSync(katmanYolu)) {
  const m = await import(new URL('../lib/ders-notlari/kanonik-katman.mjs', import.meta.url));
  uygula = (n) => m.kanonikKatmanUygula(n);
}

const ayrinti = process.argv.includes('--ayrinti');
const KISA = { paragraf: 'Paragraf', ornekOlay: 'Örnek olay', sinavIskeleti: 'İskelet', tuzakDefteri: 'Tuzak', kaynak: 'Kaynak', sema: 'Şema', kisaTest: 'Test' };

console.log(`| Ders | ${OLCUTLER.map((o) => KISA[o]).join(' | ')} | Geçen |`);
console.log(`|---|${OLCUTLER.map(() => '---').join('|')}|---|`);
const notlar = [];
for (const ders of G19_DERSLER) {
  const t = kanonik.dersler[ders];
  if (!t) {
    console.log(`| ${ders} | ${OLCUTLER.map(() => '—').join(' | ')} | temsilci yok |`);
    continue;
  }
  const note = uygula(JSON.parse(readFileSync(join(KOK, 'lib/ders-notlari/generated/notes', `${t.uni}__${t.ders}.json`), 'utf8')));
  const k = kanonikKalite(note);
  notlar.push({ ders, k });
  console.log(`| ${ders} | ${OLCUTLER.map((o) => `${k[o].gecti ? '✓' : '✗'} ${k[o].deger}`).join(' | ')} | ${k.gecen}/7 |`);
}
if (ayrinti) {
  for (const { ders, k } of notlar) {
    console.log(`\n${ders}`);
    for (const o of OLCUTLER) console.log(`  ${o}: ${k[o].ayrinti}`);
  }
}
