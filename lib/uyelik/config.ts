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

export function iyzicoConfigured(): boolean {
  return Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
}

export function iyzicoBaseUrl(): string {
  const mode = (process.env.IYZICO_MODE || 'sandbox').toLowerCase();
  if (mode === 'live' || mode === 'prod' || mode === 'production') {
    return 'https://api.iyzipay.com';
  }
  return 'https://sandbox-api.iyzipay.com';
}

export function havaleInfo(): { iban: string; hesapAdi: string; banka: string } {
  return {
    iban: (process.env.UYELIK_IBAN || '').replace(/\s+/g, ''),
    hesapAdi: process.env.UYELIK_HESAP_ADI || PROFILE.name,
    banka: process.env.UYELIK_BANKA || '',
  };
}

export function adminSecret(): string {
  if (process.env.UYELIK_ADMIN_SECRET) return process.env.UYELIK_ADMIN_SECRET;
  if (process.env.NODE_ENV === 'production') return '';
  return 'dev-admin';
}

export function sessionSecret(): string {
  const s = process.env.UYELIK_SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('UYELIK_SESSION_SECRET (en az 16 karakter) tanımlı değil.');
  }
  return 'dev-only-uyelik-session-secret';
}
