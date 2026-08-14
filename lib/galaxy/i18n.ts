/**
 * Galaxy UI i18n — pure.mjs translate + locale JSON.
 * Dil sırası: tr → en → de → fr → ar
 */

import type { LocaleCode } from './catalog';
import { DEFAULT_LOCALE, LOCALE_ORDER } from './catalog';
import {
  isLocale as pureIsLocale,
  normalizeLocale as pureNormalize,
  translate,
} from './pure.mjs';

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
  return pureIsLocale(v, LOCALE_ORDER);
}

export function normalizeLocale(v: string | null | undefined): LocaleCode {
  return pureNormalize(v, LOCALE_ORDER, DEFAULT_LOCALE) as LocaleCode;
}

export function getDict(locale: LocaleCode): Dict {
  return DICTS[locale] || DICTS.tr;
}

/** "common.retry" veya "shell.opening" — shipped UI path */
export function t(
  locale: LocaleCode,
  key: string,
  vars?: Record<string, string | number>
): string {
  return translate(DICTS as unknown as Record<string, object>, locale, key, vars);
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
    const short = l.slice(0, 2).toLowerCase();
    if (isLocale(short)) return short;
  }
  return DEFAULT_LOCALE;
}

/** Test / smoke: raw dict map for pure translate */
export function getAllDicts(): Record<LocaleCode, Dict> {
  return DICTS;
}
