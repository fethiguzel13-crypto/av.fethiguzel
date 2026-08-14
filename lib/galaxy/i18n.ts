/**
 * Galaxy UI i18n — hafif, next-intl’siz.
 * Dil sırası: tr → en → de → fr → ar
 */

import type { LocaleCode } from './catalog';
import { DEFAULT_LOCALE, LOCALE_ORDER } from './catalog';

import tr from '@/locales/tr.json';
import en from '@/locales/en.json';
import de from '@/locales/de.json';
import fr from '@/locales/fr.json';
import ar from '@/locales/ar.json';

type Dict = typeof tr;

const DICTS: Record<LocaleCode, Dict> = { tr, en, de, fr, ar };

const STORAGE_KEY = 'fg_locale';
const COOKIE_KEY = 'fg_lang';

export function isLocale(v: string | null | undefined): v is LocaleCode {
  return !!v && (LOCALE_ORDER as string[]).includes(v);
}

export function normalizeLocale(v: string | null | undefined): LocaleCode {
  if (isLocale(v)) return v;
  if (!v) return DEFAULT_LOCALE;
  const short = v.slice(0, 2).toLowerCase();
  if (isLocale(short)) return short;
  return DEFAULT_LOCALE;
}

export function getDict(locale: LocaleCode): Dict {
  return DICTS[locale] || DICTS.tr;
}

/** "common.retry" veya "shell.opening" */
export function t(locale: LocaleCode, key: string, vars?: Record<string, string | number>): string {
  const dict = getDict(locale) as Record<string, unknown>;
  const fallback = getDict('en') as Record<string, unknown>;
  const trDict = getDict('tr') as Record<string, unknown>;

  const resolve = (d: Record<string, unknown>): string | undefined => {
    const parts = key.split('.');
    let cur: unknown = d;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in (cur as object)) {
        cur = (cur as Record<string, unknown>)[p];
      } else {
        return undefined;
      }
    }
    return typeof cur === 'string' ? cur : undefined;
  };

  let s = resolve(dict) ?? resolve(fallback) ?? resolve(trDict) ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return s;
}

export function readStoredLocale(): LocaleCode | null {
  if (typeof window === 'undefined') return null;
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (isLocale(q)) return q;
    const ls = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(ls)) return ls;
    const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]+)`));
    if (m && isLocale(m[1])) return m[1];
  } catch {
    /* ignore */
  }
  return null;
}

export function persistLocale(locale: LocaleCode): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.cookie = `${COOKIE_KEY}=${locale};path=/;max-age=31536000;samesite=lax`;
    document.documentElement.lang = locale === 'ar' ? 'ar' : locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  } catch {
    /* ignore */
  }
}

export function detectBrowserLocale(): LocaleCode {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const list = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const l of list) {
    const n = normalizeLocale(l);
    if (n !== DEFAULT_LOCALE || l.toLowerCase().startsWith('tr')) {
      if (isLocale(l.slice(0, 2).toLowerCase())) return n;
    }
  }
  return DEFAULT_LOCALE;
}
