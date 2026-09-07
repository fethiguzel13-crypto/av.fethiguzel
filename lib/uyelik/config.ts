import { PROFILE, SITE_URL } from '@/lib/profile';

/** Dijital arşiv aboneliği — avukatlık/danışmanlık ücreti değildir. */
export const UYELIK = {
  name: 'Yargıtay arşivi üyeliği',
  priceTl: 500,
  periodDays: 30,
  currency: 'TRY' as const,
  cookie: 'fg_arsiv',
  uiCookie: 'fg_arsiv_ui',
  adminCookie: 'fg_arsiv_admin',
} as const;

export function priceLabel(): string {
  return `${UYELIK.priceTl.toLocaleString('tr-TR')} TL`;
}

export function periodLabel(): string {
  return `${UYELIK.periodDays} gün`;
}

export function siteOrigin(): string {
  const env = process.env.UYELIK_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/^https?:\/\//, '')}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}`;
  }
  return SITE_URL;
}

function envTrim(name: string): string {
  return (process.env[name] || '').trim();
}

function boolFlag(raw: string): boolean | null {
  const v = raw.trim().toLowerCase();
  if (!v) return null;
  if (['1', 'true', 'on', 'acik', 'açık', 'evet', 'yes'].includes(v)) return true;
  if (['0', 'false', 'off', 'kapali', 'kapalı', 'hayir', 'hayır', 'no'].includes(v)) return false;
  return null;
}

/** Kart ödemesi için kullanılacak anahtar çifti; yoksa null. */
export function iyzicoKeys(): { apiKey: string; secretKey: string } | null {
  const apiKey = envTrim('IYZICO_API_KEY');
  const secretKey = envTrim('IYZICO_SECRET_KEY');
  if (apiKey && secretKey) return { apiKey, secretKey };
  return null;
}

export function iyzicoConfigured(): boolean {
  return iyzicoKeys() !== null;
}

/** Kart ödemesi açık mı? UYELIK_KART=0 ile bilinçli kapatılabilir. */
export function kartEnabled(): boolean {
  const flag = boolFlag(envTrim('UYELIK_KART'));
  if (flag === false) return false;
  return iyzicoConfigured();
}

/**
 * Hangi iyzico ortamı: açık env kazanır, yoksa anahtarın kendisi (`sandbox-`
 * öneki) belirler, o da yoksa üretimde `live`, geliştirmede `sandbox`.
 */
export function iyzicoMode(): 'live' | 'sandbox' {
  const explicit = envTrim('IYZICO_MODE').toLowerCase();
  if (['live', 'prod', 'production', 'gercek', 'gerçek'].includes(explicit)) return 'live';
  if (['sandbox', 'test', 'deneme'].includes(explicit)) return 'sandbox';
  const keys = iyzicoKeys();
  if (keys?.apiKey.startsWith('sandbox-')) return 'sandbox';
  return process.env.NODE_ENV === 'production' ? 'live' : 'sandbox';
}

export function iyzicoBaseUrl(): string {
  return iyzicoMode() === 'live' ? 'https://api.iyzipay.com' : 'https://sandbox-api.iyzipay.com';
}

/** Gerçek para akan kurulum mu? Test rozetini bu belirler. */
export function kartCanli(): boolean {
  return Boolean(iyzicoKeys()) && iyzicoMode() === 'live';
}

export function havaleInfo(): { iban: string; hesapAdi: string; banka: string } {
  return {
    iban: envTrim('UYELIK_IBAN').replace(/\s+/g, ''),
    hesapAdi: process.env.UYELIK_HESAP_ADI || PROFILE.name,
    banka: process.env.UYELIK_BANKA || '',
  };
}

/**
 * Havale/EFT yolu. Varsayılan artık kapalı: kart açıkken IBAN gösterilmez.
 * Kart hiç kurulu değilse site ödemesiz kalmasın diye IBAN yedeğe düşer.
 * `UYELIK_HAVALE=1` ile ikisi birlikte de açılabilir.
 */
export function havaleEnabled(): boolean {
  const iban = Boolean(havaleInfo().iban);
  const flag = boolFlag(envTrim('UYELIK_HAVALE'));
  if (flag === true) return iban;
  if (flag === false) return false;
  if (kartEnabled()) return false;
  return iban;
}

export function adminSecret(): string {
  if (process.env.UYELIK_ADMIN_SECRET) return process.env.UYELIK_ADMIN_SECRET;
  if (process.env.NODE_ENV === 'production') return '';
  return 'dev-admin';
}

export function hasSessionSecret(): boolean {
  const s = process.env.UYELIK_SESSION_SECRET;
  return Boolean(s && s.length >= 16);
}

export function sessionSecret(): string {
  const s = process.env.UYELIK_SESSION_SECRET;
  if (s && s.length >= 16) return s;
  // Üretimde throw, Vercel SSR/prerender'da tüm dinamik rotayı 500 yapar.
  // İmza yazan yollar hasSessionSecret() ile reddeder.
  if (process.env.NODE_ENV === 'production') {
    return 'production-missing-uyelik-session-secret';
  }
  return 'dev-only-uyelik-session-secret';
}
