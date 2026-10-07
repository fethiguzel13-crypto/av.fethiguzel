import { test } from 'node:test';
import assert from 'node:assert/strict';

import { gondermeAdi } from '../lib/atif-ad.mjs';

test('gondermeAdi: «sayılı Kanun’un» türü geri göndermeleri tanır', () => {
  for (const ad of ['Kanun’un', "Kanun'un", 'Kanunun', 'Kanun', 'KANUNUN', 'Kanuna', 'Kanunda', "Yasa'nın", 'Yasanın', ' Kanun ’un ']) {
    assert.equal(gondermeAdi(ad), true, ad);
  }
});

test('gondermeAdi: kanunun gerçek adını ve kısaltmasını gönderme saymaz', () => {
  for (const ad of [
    'CEZA MUHAKEMESİ KANUNU',
    'Türk Medeni Kanunu',
    'Türk Medeni Kanununun',
    'CMK’nın',
    'İş Kanunu',
    'Kanun Hükmünde Kararname',
    '',
  ]) {
    assert.equal(gondermeAdi(ad), false, ad);
  }
});
