import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * G04 B7–B10: üyelik dışındaki API uçlarının küçük açıkları. Rota dosyaları `next/server` çalışma
 * bağlamı istediği için karar mantığı `lib/paket-kaynak.ts`'e çıkarıldı; rotaların onu kullandığı
 * kaynaktan denetlenir.
 */

import { kanunKimligi, paketAdresleri } from '../../paket-kaynak.ts';

function kaynak(dosya) {
  return readFileSync(join(process.cwd(), dosya), 'utf8');
}

// B7 — 500 yanıtı iç hata metnini istemciye veriyordu; rota kullanımdan kalkan Edge çalışma ortamındaydı.

test('B7: üyelik rotası iç hata metnini döndürmez ve Node çalışma ortamındadır', () => {
  const src = kaynak('app/api/uyelik/[...path]/route.ts');
  assert.ok(!/runtime\s*=\s*['"]edge['"]/.test(src), "runtime = 'edge' duruyor");
  assert.ok(!/NextResponse\.json\(\s*\{[^}]*\bmsg\b/.test(src), 'hata metni yanıtta');
  assert.ok(!/error:\s*e\.message/.test(src), 'hata metni yanıtta');
});

// B8/B9 — kanun kimliği süzgeci tek yerde.

test('B8: kanun kimliği süzülür, boş ya da aşırı uzunsa reddedilir', () => {
  assert.equal(kanunKimligi('TBK'), 'tbk');
  assert.equal(kanunKimligi('../../etc/passwd'), 'etcpasswd');
  assert.equal(kanunKimligi('a?b=c#d'), 'abcd');
  assert.equal(kanunKimligi(''), null);
  assert.equal(kanunKimligi(null), null);
  assert.equal(kanunKimligi('a'.repeat(65)), null);
});

test('B8: pack-health süzgeç ve deneme sınırı kullanır, ortam bilgisi sızdırmaz', () => {
  const src = kaynak('app/api/pack-health/route.ts');
  assert.ok(/kanunKimligi\(/.test(src), 'kanun parametresi süzülmüyor');
  assert.ok(/rateLimit\(/.test(src), 'deneme sınırı yok');
  assert.ok(!/VERCEL_ENV/.test(src), 'VERCEL_ENV yanıtta');
  assert.ok(!/vercelUrl/.test(src), 'VERCEL_URL yanıtta');
});

// B9 — content-pack isteğin Host başlığından türeyen kökene istek atıyordu (kendi kendine barındırmada
// SSRF ve önbellek zehirlenmesi).

const URETIM = { NODE_ENV: 'production' };

test('B9: tanınmayan Host başlığı paket kaynağı olarak kullanılmaz', () => {
  const adresler = paketAdresleri('https://saldirgan.example/api/content-pack/tbk', 'tbk', URETIM);
  assert.ok(adresler.length > 0);
  assert.ok(adresler.every((u) => !u.includes('saldirgan.example')), adresler.join('\n'));
});

test('B9: sitenin kendi alan adı ve dağıtım adresi kaynak olarak kalır', () => {
  const site = paketAdresleri('https://www.avfethiguzel.com/api/content-pack/tbk', 'tbk', URETIM);
  assert.equal(site[0], 'https://www.avfethiguzel.com/packs/tbk.json.gz');
  const onizleme = paketAdresleri('https://proje-abc.vercel.app/api/content-pack/tbk', 'tbk', {
    ...URETIM,
    VERCEL_URL: 'proje-abc.vercel.app',
  });
  assert.equal(onizleme[0], 'https://proje-abc.vercel.app/packs/tbk.json.gz');
});

test('B9: yerel sunucu kendi paketlerini okur', () => {
  const yerel = paketAdresleri('http://localhost:3000/api/content-pack/tbk', 'tbk', URETIM);
  assert.equal(yerel[0], 'http://localhost:3000/packs/tbk.json.gz');
});

test('B9: content-pack rotası adresleri yardımcıdan alır', () => {
  const src = kaynak('app/api/content-pack/[kanunId]/route.ts');
  assert.ok(/paketAdresleri\(/.test(src));
  assert.ok(/kanunKimligi\(/.test(src));
});

// B10 — Ücretli arşiv uçlarında deneme sınırı yoktu: tek üyelikle toplu çekim ve Yargıtay'a canlı istek.

test('B10: yargı arşivi uçları üye başına deneme sınırı uygular', () => {
  const src = kaynak('app/api/yargi/[...path]/route.ts');
  assert.ok(/rateLimit\(/.test(src), 'deneme sınırı yok');
});
