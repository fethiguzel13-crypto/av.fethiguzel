import { test } from 'node:test';
import assert from 'node:assert/strict';

import { defteriOku, yayinaGirer } from '../lib/yayin-suzgec.mjs';

const satir = (o) => JSON.stringify(o);

test('defteriOku: yararlı, benzer ve zayıf kayıtları kimlikle eşler', () => {
  const defter = defteriOku([
    satir({ i: '1', u: 1, e: 1, dp: null }),
    satir({ i: '2', u: 0, e: 1, dp: '1' }),
    satir({ i: '3', u: 0, e: 0, dp: null }),
  ]);
  assert.equal(defter.size, 3);
  assert.deepEqual(defter.get('1'), { u: true, e: true, dp: null });
  assert.deepEqual(defter.get('2'), { u: false, e: true, dp: '1' });
  assert.deepEqual(defter.get('3'), { u: false, e: false, dp: null });
});

test('defteriOku: bozuk ve kimliksiz satırı atlar, ilk kaydı geçerli sayar', () => {
  const defter = defteriOku(['{bozuk', '', satir({ u: 1 }), satir({ i: 7, u: 0 }), satir({ i: '7', u: 1 })]);
  assert.equal(defter.size, 1);
  assert.equal(defter.get('7').u, false);
});

test('yayinaGirer: yalnız yararlı karar girer', () => {
  const defter = defteriOku([
    satir({ i: '1', u: 1, e: 1 }),
    satir({ i: '2', u: 0, e: 1, dp: '1' }),
    satir({ i: '3', u: 0, e: 0 }),
  ]);
  assert.equal(yayinaGirer({ id: '1', tierId: 'hgk' }, defter), true);
  assert.equal(yayinaGirer({ id: '2', tierId: 'hgk' }, defter), false, 'benzer karar girmez');
  assert.equal(yayinaGirer({ id: '3', tierId: 'is-daire' }, defter), false, 'emsal niteliği zayıf karar girmez');
});

test('yayinaGirer: defterde olmayan karar girmez, kimlik sayı da olsa eşleşir', () => {
  const defter = defteriOku([satir({ i: '10', u: 1 })]);
  assert.equal(yayinaGirer({ id: 10 }, defter), true);
  assert.equal(yayinaGirer({ id: '11', tierId: 'hgk' }, defter), false);
});

test('yayinaGirer: içtihadı birleştirme kararı etiketten bağımsız girer', () => {
  const defter = defteriOku([satir({ i: '5', u: 0, dp: '4' })]);
  assert.equal(yayinaGirer({ id: '5', tierId: 'yibk' }, defter), true);
  assert.equal(yayinaGirer({ id: '6', tierId: 'yibk' }, defter), true, 'defterde olmasa da');
  assert.equal(yayinaGirer({ id: '6', daire: 'Yargıtay Büyük Genel Kurulu' }, defter), true, 'kademe daireden çıkarılır');
});
