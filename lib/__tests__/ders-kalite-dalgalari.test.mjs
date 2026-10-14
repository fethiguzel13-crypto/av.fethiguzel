import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DALGALAR } from '../ders-notlari/kalite-dalgalari.mjs';

/* G23 adım 1: Ölçüm betiği (`scripts/ders-kanonik-olc.mjs --dalga=2`) ders listesini buradan okur. */
const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const kanonik = JSON.parse(readFileSync(join(kok, 'lib/ders-notlari/dizin-kanonik.json'), 'utf8'));

test('iki dalga onar ders taşır, dersler yinelenmez ve her birinin temsilci notu vardır', () => {
  assert.equal(DALGALAR[1].length, 10);
  assert.equal(DALGALAR[2].length, 10);
  const hepsi = [...DALGALAR[1], ...DALGALAR[2]];
  assert.equal(new Set(hepsi).size, 20, 'bir ders iki dalgada geçmez');
  for (const ders of hepsi) {
    const t = kanonik.dersler[ders];
    assert.ok(t, `${ders}: dizin-kanonik.json'da temsilci yok`);
    assert.ok(existsSync(join(kok, 'lib/ders-notlari/generated/notes', `${t.uni}__${t.ders}.json`)), `${ders}: not dosyası yok`);
  }
});

/* G23 adım 2: Dalga 2 katmanları birer commit'le eklenir; liste her derste büyür, sona erdiğinde dalganın tamamına eşit olur. */
const G23_YAZILAN = ['aile-hukuku', 'borclar-ozel', 'medeni-baslangic', 'kiymetli-evrak'];

test('dalga 1 katmanlarının tamamı ve dalga 2 katmanlarının yazılanları kayıtlıdır', async () => {
  const { KATMANLAR } = await import('../ders-notlari/kanonik-katman.mjs');
  const kayitli = new Set(KATMANLAR.map((k) => k.ders));
  for (const ders of [...DALGALAR[1], ...G23_YAZILAN]) assert.ok(kayitli.has(ders), `${ders}: katman kayıtlı değil`);
  for (const ders of G23_YAZILAN) assert.ok(DALGALAR[2].includes(ders), `${ders}: dalga 2'de yok`);
});

test('ölçüm betiği dalga listesini modülden okur ve --dalga seçeneğini tanır', () => {
  const betik = readFileSync(join(kok, 'scripts/ders-kanonik-olc.mjs'), 'utf8');
  assert.match(betik, /kalite-dalgalari\.mjs/);
  assert.match(betik, /--dalga=/);
});
