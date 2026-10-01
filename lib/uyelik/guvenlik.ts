import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { normalizeEmail } from './crypto';

/**
 * Üyelik API'sinin saf güvenlik denetimleri (G04). `next/headers` gerektirmedikleri için doğrudan
 * test edilirler; dağıtıcı (`http.ts`) yalnız sonucu uygular.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tüm üyeler tek KV anahtarında tutulur; sınırsız alan depoyu şişirir. Şifre üst sınırı scrypt'in
// önündeki PBKDF2'nin uzun girdiyle yorulmasını önler.
const EPOSTA_AZAMI = 254;
const AD_AZAMI = 100;
const SIFRE_ASGARI = 8;
const SIFRE_AZAMI = 128;

type Hata = { ok: false; error: string };

function nesne(body: unknown): Record<string, unknown> | null {
  return body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
}

export function kayitGirdisiDenetle(
  body: unknown
): { ok: true; email: string; password: string; name: string } | Hata {
  const b = nesne(body);
  if (!b) return { ok: false, error: 'Geçersiz istek.' };
  const email = normalizeEmail(String(b.email || ''));
  const password = String(b.password || '');
  const name = String(b.name || '').trim();
  if (email.length > EPOSTA_AZAMI || !EMAIL_RE.test(email)) return { ok: false, error: 'Geçerli bir e-posta girin.' };
  if (password.length < SIFRE_ASGARI) return { ok: false, error: 'Şifre en az 8 karakter olmalı.' };
  if (password.length > SIFRE_AZAMI) return { ok: false, error: 'Şifre en fazla 128 karakter olabilir.' };
  if (name.length < 2) return { ok: false, error: 'Ad soyad girin.' };
  if (name.length > AD_AZAMI) return { ok: false, error: 'Ad soyad en fazla 100 karakter olabilir.' };
  if (!b.kvkk) return { ok: false, error: 'KVKK aydınlatmasını onaylamanız gerekir.' };
  if (!b.dijitalIfa) return { ok: false, error: 'Dijital içeriğin anında ifasını kabul etmeniz gerekir.' };
  return { ok: true, email, password, name };
}

/** Sınır dışı girdi, scrypt çalıştırılmadan olağan "hatalı" yanıtını alır. */
export function girisGirdisiDenetle(body: unknown): { ok: true; email: string; password: string } | Hata {
  const b = nesne(body);
  if (!b) return { ok: false, error: 'Geçersiz istek.' };
  const email = normalizeEmail(String(b.email || ''));
  const password = String(b.password || '');
  if (!email || email.length > EPOSTA_AZAMI || !password || password.length > SIFRE_AZAMI) {
    return { ok: false, error: 'E-posta veya şifre hatalı.' };
  }
  return { ok: true, email, password };
}

/** Yönetici çerezine sırrın kendisi değil, ondan türetilmiş bir değer yazılır. */
export function adminCerezDegeri(secret: string): string {
  return createHmac('sha256', secret).update('fg-arsiv-yonetici-cerezi-v1').digest('hex');
}

/** Sabit süreli karşılaştırma; özetlendiği için uzunluk farkı da süreden okunamaz. Boş değer eşleşmez. */
export function guvenliEsit(a: string, b: string): boolean {
  if (!a || !b) return false;
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb) && a === b;
}

function wwwsiz(host: string): string {
  return host.replace(/^www\./, '');
}

/**
 * Durum değiştiren isteğin başka bir siteden gelip gelmediği. Tarayıcı `Sec-Fetch-Site` ya da
 * `Origin` gönderir; ikisi de yoksa istemci tarayıcı değildir (curl, sunucu) ve CSRF söz konusu olmaz.
 * Alan adının www'li ve www'siz hâli aynı site sayılır.
 */
export function kokenGuvenilir(req: Request, siteOrigin: string): boolean {
  if (req.headers.get('sec-fetch-site') === 'cross-site') return false;
  const origin = req.headers.get('origin');
  if (!origin) return true;
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  const izinli = new Set<string>();
  for (const adres of [req.url, siteOrigin]) {
    try {
      izinli.add(wwwsiz(new URL(adres).host));
    } catch {
      /* geçersiz adres yok sayılır */
    }
  }
  return izinli.has(wwwsiz(host));
}
