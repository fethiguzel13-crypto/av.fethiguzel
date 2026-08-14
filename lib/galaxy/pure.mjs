/**
 * Hukuk Galaxy — saf (React/DOM-free) yardımcılar.
 * UI ve node --test aynı fonksiyonları çağırır.
 */

export const LOCALE_ORDER = ['tr', 'en', 'de', 'fr', 'ar'];
export const DEFAULT_LOCALE = 'tr';
export const ACTIVE_LOCALES = ['tr', 'en'];
export const SITE = 'https://www.avfethiguzel.com';
export const SCHEME = 'avfethiguzel';

export function isLocale(v, order = LOCALE_ORDER) {
  return !!v && order.includes(v);
}

export function normalizeLocale(v, order = LOCALE_ORDER, fallback = DEFAULT_LOCALE) {
  if (isLocale(v, order)) return v;
  if (!v) return fallback;
  const short = String(v).slice(0, 2).toLowerCase();
  if (isLocale(short, order)) return short;
  return fallback;
}

function resolveKey(dict, key) {
  if (!dict || typeof dict !== 'object') return undefined;
  const parts = String(key).split('.');
  let cur = dict;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return undefined;
  }
  return typeof cur === 'string' ? cur : undefined;
}

/**
 * @param {Record<string, object>} dicts locale → dictionary
 * @param {string} locale
 * @param {string} key e.g. common.retry
 * @param {Record<string, string|number>} [vars]
 */
export function translate(dicts, locale, key, vars) {
  const primary = dicts[locale];
  const en = dicts.en;
  const tr = dicts.tr;
  let s =
    resolveKey(primary, key) ??
    resolveKey(en, key) ??
    resolveKey(tr, key) ??
    key;
  if (vars && typeof s === 'string') {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return s;
}

export function getGalaxyApp(apps, id) {
  if (!Array.isArray(apps) || apps.length === 0) {
    throw new Error('getGalaxyApp: apps required');
  }
  return apps.find((a) => a.id === id) ?? apps[0];
}

export function localized(map, locale, fallback = 'en') {
  if (!map || typeof map !== 'object') return '';
  return map[locale] || map[fallback] || map.tr || '';
}

export function appHomeUrl(app, locale = 'tr', site = SITE) {
  const base = `${site}${app.path === '/' ? '' : app.path}`;
  const params = new URLSearchParams();
  params.set('app', app.id);
  if (locale && locale !== 'tr') params.set('lang', locale);
  return `${base}?${params.toString()}`;
}

export function deepLinkFor(appId, path = '', scheme = SCHEME) {
  const p = String(path || '').replace(/^\//, '');
  return p ? `${scheme}://${appId}/${p}` : `${scheme}://${appId}`;
}

export function webUrlFor(apps, appId, site = SITE) {
  const app = getGalaxyApp(apps, appId);
  return `${site}${app.path === '/' ? '/' : app.path}`;
}

export function inferAppFromPath(pathname) {
  const p = pathname || '/';
  if (p.startsWith('/hesaplama')) return 'hesap';
  if (p.startsWith('/icthat') || p.startsWith('/yargi')) return 'icthat';
  if (p.startsWith('/bilgi') || p.startsWith('/rehber')) return 'rehber';
  return 'portal';
}

/**
 * Deep link / https URL → site path (+ search + hash), app query enjekte edilir.
 * avfethiguzel://hesap → /hesaplama?app=hesap
 * avfethiguzel://portal/mevzuat/tbk → /mevzuat/tbk?app=portal
 * https://www.avfethiguzel.com/bilgi?x=1 → /bilgi?x=1 (app eklenir yoksa)
 */
export function pathFromAppUrl(raw, apps, site = SITE, scheme = SCHEME) {
  if (!raw) return null;
  try {
    const list = Array.isArray(apps) ? apps : [];
    const byId = Object.fromEntries(list.map((a) => [a.id, a]));

    if (String(raw).startsWith(`${scheme}://`)) {
      const rest = String(raw).slice(`${scheme}://`.length).replace(/^\/+/, '');
      const [head, ...tail] = rest.split('/');
      const app = byId[head];
      if (app) {
        const sub = tail.filter(Boolean).join('/');
        let path;
        if (!sub) {
          path = app.path === '/' ? '/' : app.path;
        } else if (app.path === '/') {
          path = `/${sub}`;
        } else {
          path = `${app.path}/${sub}`.replace(/\/+/g, '/');
        }
        const u = new URL(path, site);
        if (!u.searchParams.has('app')) u.searchParams.set('app', app.id);
        return `${u.pathname}${u.search}${u.hash}` || '/';
      }
      // bilinmeyen app id → path olarak yorumla
      const u = new URL(`https://www.avfethiguzel.com/${rest}`);
      return `${u.pathname || '/'}${u.search || ''}${u.hash || ''}` || '/';
    }

    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, '');
    if (host && host !== 'avfethiguzel.com') return null;
    if (!u.searchParams.has('app')) {
      const inferred = inferAppFromPath(u.pathname || '/');
      u.searchParams.set('app', inferred);
    }
    return `${u.pathname || '/'}${u.search || ''}${u.hash || ''}` || '/';
  } catch {
    return null;
  }
}

/** Catalog tab keys for an app id */
export function tabsForApp(apps, appId) {
  const app = getGalaxyApp(apps, appId);
  return Array.isArray(app.tabs) ? [...app.tabs] : ['home', 'search', 'guide', 'calc', 'cases'];
}

export function packageIdFor(apps, appId) {
  return getGalaxyApp(apps, appId).packageId;
}
