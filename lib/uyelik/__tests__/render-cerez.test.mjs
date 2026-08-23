import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Server Component içinde çerez yazılmasını engelleyen bekçi.
 *
 * Yaşanan hata: `app/yargi-kararlari/page.tsx` render sırasında
 * `setSessionCookie(user)` çağırıyordu. Next.js render sırasında çerez
 * yazmayı yasaklar ve isteği 500'e düşürür. Kusur ANONİM ziyaretçide hiç
 * görünmüyordu — `user` boş olduğu için satır çalışmıyordu — ama oturum
 * açmış her üyede sayfa her yenilemede patlıyordu. Aynı satır dört sayfada
 * birden vardı.
 *
 * Çerez yazma yalnız route handler ve server action içinde yasaldır. Bu test
 * kuralı mekanik olarak tutar: `app/` altındaki `page.tsx` / `layout.tsx`
 * dosyaları çerez yazan bir çağrı içeremez.
 */

const KOK = join(process.cwd(), 'app');

/** Çerez YAZAN çağrılar. Okuma (`cookies().get`) serbesttir. */
const YAZAN = [
  { desen: /setSessionCookie\s*\(/, ad: 'setSessionCookie()' },
  { desen: /clearSessionCookie\s*\(/, ad: 'clearSessionCookie()' },
  { desen: /cookies\(\)\s*\)?\s*\.set\s*\(/, ad: 'cookies().set()' },
  { desen: /\bjar\.set\s*\(/, ad: 'jar.set()' },
];

/**
 * Yorumları düşürür.
 *
 * Gerekli, çünkü bu kusuru anlatan açıklama satırlarının kendisi «çerez
 * yazma» deseniyle eşleşiyor ve testi kendi belgesi düşürüyordu.
 */
function yorumsuz(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*$/gm, '');
}

function sayfalar(dir, out = []) {
  for (const ad of readdirSync(dir)) {
    const p = join(dir, ad);
    if (statSync(p).isDirectory()) {
      sayfalar(p, out);
    } else if (ad === 'page.tsx' || ad === 'layout.tsx' || ad === 'template.tsx') {
      out.push(p);
    }
  }
  return out;
}

test('hiçbir sayfa render sırasında çerez yazmıyor', () => {
  const suclular = [];

  for (const p of sayfalar(KOK)) {
    const src = yorumsuz(readFileSync(p, 'utf8'));

    // 'use server' taşıyan bir dosyadaki server action'lar bu yasağın
    // dışındadır; sayfa gövdesinde çağrı olup olmadığını ayırt edemediğimiz
    // için böyle dosyalar elle incelenmek üzere atlanır.
    if (/^\s*['"]use server['"]/m.test(src)) continue;

    for (const { desen, ad } of YAZAN) {
      if (desen.test(src)) {
        suclular.push(`${p.replace(process.cwd(), '.')} → ${ad}`);
      }
    }
  }

  assert.deepEqual(
    suclular,
    [],
    'Server Component içinde çerez yazılamaz (Next.js isteği 500 yapar). ' +
      'Çağrıyı bir route handler ya da server action içine taşıyın:\n  ' +
      suclular.join('\n  ')
  );
});

test('oturum çerezi tazelemesi route handler içinde duruyor', () => {
  const p = join(KOK, 'api', 'uyelik', 'ben', 'route.ts');
  const src = yorumsuz(readFileSync(p, 'utf8'));
  assert.match(
    src,
    /setSessionCookie\s*\(/,
    'Tazeleme /api/uyelik/ben içinden kaldırılmış — çerez artık hiç yenilenmiyor'
  );
});
