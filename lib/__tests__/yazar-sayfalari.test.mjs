import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/*
  G16 adım 4: Yazar sayfası (`/avukat-fethi-guzel`), akademik profil ve eserler sayfası aynı yazar ve eser verisini tek
  kaynaktan (`lib/yazar.ts`) gösterir, birbirine bağlanır ve yazarın sitedeki asıl külliyatına (şerhler, makaleler) açılır.
  Önceden `/eserlerim` kitap adını, yayınevini ve yazar adını elle yazıyordu; yazar sayfası ana sayfadaki kutucuk sırasını
  (CredentialsStrip) üstteki listenin hemen altında yineliyordu. Üç sayfa da uyumu okura beyan ediyordu.
*/
const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const oku = (d) => readFileSync(join(kok, d), 'utf8');

const SAYFALAR = {
  '/avukat-fethi-guzel': 'app/avukat-fethi-guzel/page.tsx',
  '/akademik-profil': 'app/akademik-profil/page.tsx',
  '/eserlerim': 'app/eserlerim/page.tsx',
};

test('üç sayfa yazar adını ve eser künyesini lib/yazar.ts\'ten alır', () => {
  for (const d of Object.values(SAYFALAR)) {
    const s = oku(d);
    assert.match(s, /import \{[^}]*\bYAZAR\b[^}]*\} from '@\/lib\/yazar'/, `${d}: YAZAR içe aktarılmalı`);
    // Kitaplar tek kaynaktan: ESERLER listesi (iki monografi, lib/profile.ts → books).
    assert.match(s, /\bESERLER\b/, `${d}: eser künyesi ESERLER'den`);
    assert.match(s, /YAZAR\.ad\b/, `${d}: yazar adı YAZAR.ad'dan`);
    // Elle yazılmış künye: kitap adı, yayınevi, yazar adı.
    for (const m of s.matchAll(/Ses ve Görüntünün|Seçkin|AV\. FETHİ GÜZEL|"Av\. Fethi Güzel"|'Av\. Fethi Güzel'/g)) {
      assert.fail(`${d}: elle yazılmış künye «${m[0]}»`);
    }
    assert.doesNotMatch(s, /PROFILE\.(?:name|book)\b/, `${d}: künye PROFILE yerine YAZAR'dan`);
  }
});

test('üç sayfa birbirine bağlanır', () => {
  for (const [yol, d] of Object.entries(SAYFALAR)) {
    const s = oku(d);
    for (const hedef of Object.keys(SAYFALAR)) {
      if (hedef === yol) continue;
      assert.match(s, new RegExp(`href=["{\`']*${hedef}["\`']`), `${d} → ${hedef}`);
    }
  }
});

test('yazar ve eserler sayfası sitedeki yayınlara (şerh, makale) bağlanır', () => {
  for (const d of [SAYFALAR['/avukat-fethi-guzel'], SAYFALAR['/eserlerim']]) {
    const s = oku(d);
    assert.match(s, /href(?:=|: )["']\/mevzuat["']/, `${d} → /mevzuat`);
    assert.match(s, /href(?:=|: )["']\/makaleler["']/, `${d} → /makaleler`);
    assert.match(s, /siteSayilari\(\)/, `${d}: şerh sayısı siteSayilari()'ndan`);
  }
});

test('yazar sayfası kutucuk sırasını yinelemez, CredentialsStrip kaldırılmıştır', () => {
  assert.doesNotMatch(oku(SAYFALAR['/avukat-fethi-guzel']), /CredentialsStrip/);
  assert.equal(existsSync(join(kok, 'components/CredentialsStrip.tsx')), false);
});

test('yazar sayfalarında uyum beyanı yoktur', () => {
  const bulunan = [];
  for (const d of [...Object.values(SAYFALAR), 'app/eserlerim/layout.tsx']) {
    const s = oku(d);
    for (const m of s.matchAll(/reklam yasağ\S* (?:kurallarına )?uygun|nesnel (?:unvan|mesleki|yayın|bilgilendirme)|sonuç vaadi/giu)) {
      bulunan.push(`${d}: ${m[0]}`);
    }
  }
  assert.deepEqual(bulunan, []);
});
