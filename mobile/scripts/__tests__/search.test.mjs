import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gunzipSync } from 'node:zlib';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  foldTr,
  tighten,
  tokenize,
  scoreArticle,
  parseMaddeQuery,
} from '../../app-src/src/lib/text.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const packPath = join(root, 'data-src', 'packs', 'tmk.json.gz');

// ─── Türkçe sadeleştirme ────────────────────────────────────────────────────

test('Türkçe harfler sadeleşiyor', () => {
  assert.equal(foldTr('İÇTİHAT'), 'ictihat');
  assert.equal(foldTr('Zamanaşımı'), 'zamanasimi');
  assert.equal(foldTr('MÜŞTEREK'), 'musterek');
});

test('boşluk duyarsız anahtar', () => {
  assert.equal(tighten('zaman aşımı'), 'zamanasimi');
  assert.equal(tighten('Zamanaşımı'), 'zamanasimi');
  assert.equal(tighten('m. 13'), 'm13');
});

// ─── OCR kırıklarına rağmen arama ───────────────────────────────────────────

test('OCR ile bölünmüş kelime yine de bulunur', () => {
  // Resmî metinde "re ddolunabilir" yazıyor; kullanıcı "reddolunabilir" arar.
  const body = 'Miras, üç ay içinde re ddolunabilir. Bu süre, yasal mirasçılar için…';
  assert.ok(scoreArticle('2. Süre', body, tokenize('reddolunabilir')) > 0);
});

test('bölünmüş başlık da bulunur', () => {
  const title = 'Zaman aşımı';
  assert.ok(scoreArticle(title, '', tokenize('zamanaşımı')) > 0);
});

test('normal eşleşme boşluksuz eşleşmeden yüksek puan alır', () => {
  const exact = scoreArticle('Zamanaşımı', '', tokenize('zamanaşımı'));
  const loose = scoreArticle('Zaman aşımı', '', tokenize('zamanaşımı'));
  assert.ok(exact > loose, `tam=${exact} gevşek=${loose}`);
});

test('başlıkta geçen terim gövdedekinden değerli', () => {
  const inTitle = scoreArticle('Mirasın reddi', 'başka metin', tokenize('reddi'));
  const inBody = scoreArticle('Başka başlık', 'mirasın reddi mümkündür', tokenize('reddi'));
  assert.ok(inTitle > inBody);
});

test('tokenlardan biri yoksa madde elenir', () => {
  assert.equal(scoreArticle('Mirasın reddi', 'üç ay içinde', tokenize('mirasın kabulü')), 0);
});

// ─── Doğrudan madde sorgusu ─────────────────────────────────────────────────

test('«TBK 13» doğrudan maddeye çözülür', () => {
  assert.deepEqual(parseMaddeQuery('TBK 13', ['tbk', 'tmk']), {
    kanunId: 'tbk',
    maddeNo: 13,
  });
});

test('«tbk m.13» ve «tbk madde 13» aynı sonucu verir', () => {
  const a = parseMaddeQuery('tbk m.13', ['tbk']);
  const b = parseMaddeQuery('tbk madde 13', ['tbk']);
  assert.deepEqual(a, b);
});

test('yalnız numara verilirse kanun boş kalır', () => {
  assert.deepEqual(parseMaddeQuery('166', ['tmk']), { maddeNo: 166 });
});

test('serbest metin madde sorgusu sayılmaz', () => {
  assert.equal(parseMaddeQuery('dürüstlük kuralı', ['tmk']), null);
});

test('tanınmayan kanun kimliği kanunsuz döner', () => {
  const r = parseMaddeQuery('xyz 13', ['tmk', 'tbk']);
  assert.equal(r?.kanunId, undefined);
  assert.equal(r?.maddeNo, 13);
});

// ─── Gerçek külliyata karşı ─────────────────────────────────────────────────

test(
  'gerçek pakette bilinen maddeler bulunuyor',
  { skip: !existsSync(packPath) },
  () => {
    const pack = JSON.parse(gunzipSync(readFileSync(packPath)).toString('utf8'));
    const entries = Object.values(pack);

    // TMK m.606 — mirasın reddi süresi.
    const tokens = tokenize('reddolunabilir');
    const found = entries.filter((e) => scoreArticle(e.t, e.o, tokens) > 0);
    assert.ok(found.length > 0, 'kelime bulunamıyor');
    assert.ok(
      found.some((e) => e.n === 606),
      `m.606 bulunamadı (bulunan: ${found.map((e) => e.n).join(', ')})`
    );

    /*
     * Bu test bir zamanlar "düz eşleme bulamıyor" diye ölçüyordu: resmî
     * metin OCR yüzünden "re ddolunabilir" biçiminde bölünmüştü ve madde
     * ancak boşluksuz eşleme sayesinde bulunuyordu.
     *
     * 17.08.2026'da metin mevzuat.gov.tr kaynağından yeniden yazıldı ve
     * bölünme kaynağında kapandı (`docs/RESMI-METIN-ONARIMI.md`). Artık
     * düz eşleme de bulmalı; bulamıyorsa metin yeniden bozulmuş demektir.
     *
     * Boşluksuz eşlemenin kendisi yukarıdaki birim testinde sınanıyor;
     * külliyat temizlense de o yetenek korunmalıdır.
     */
    const duz = entries.filter((e) => foldTr(e.o).includes('reddolunabilir'));
    assert.ok(
      duz.some((e) => e.n === 606),
      'm.606 metni yeniden bölünmüş — resmî metin bozulmuş olabilir'
    );
  }
);
