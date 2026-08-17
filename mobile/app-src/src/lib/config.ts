/**
 * Derleme anında sabitlenen uygulama kimliği.
 * `__GALAXY_APP__` vite.config.mjs içinde define ile enjekte edilir.
 */
declare const __GALAXY_APP__: string;
declare const __GALAXY_BUILT_AT__: string;
declare const __GALAXY_STATS__: Partial<GalaxyStats>;

/** Giriş ekranındaki sayılar — derleme anında gerçek veriden okunur. */
export type GalaxyStats = {
  laws: number;
  articles: number;
  tools: number;
  decisions: number;
  guides: number;
};

import catalog from '../../../galaxy/catalog.json';

export type GalaxyAppId = 'asistan' | 'portal' | 'hesap' | 'icthat' | 'rehber';

export type GalaxyApp = {
  id: GalaxyAppId;
  packageId: string;
  versionName: string;
  versionCode: number;
  /**
   * Play'de yayınlanıyor mu? Dört ayrı uygulama `asistan` içinde
   * birleştirildi; eskiler kodda duruyor ama yayında değil ve
   * "diğer uygulamalar" listesinde gösterilmezler.
   */
  published?: boolean;
  name: Record<string, string>;
  short: Record<string, string>;
  path: string;
  accent: string;
  role: string;
  /** 'full' = her şey cihazda · 'cache' = ağdan tazelenir, önbellekten okunur */
  offline: 'full' | 'cache';
  needsNetwork: boolean;
};

export const SITE: string = catalog.site;
export const SCHEME: string = catalog.scheme;
export const BRAND: string = catalog.brand;
export const ALL_APPS = catalog.apps as GalaxyApp[];
export const BUILT_AT: string = typeof __GALAXY_BUILT_AT__ === 'string' ? __GALAXY_BUILT_AT__ : '';

/**
 * Sayı yoksa gösterilmez — uydurma değer üretmektense alanı boş bırakırız.
 * (Geliştirme sunucusunda `vite` doğrudan çalıştırıldığında boş gelir.)
 */
export const STATS: Partial<GalaxyStats> =
  typeof __GALAXY_STATS__ === 'object' && __GALAXY_STATS__ ? __GALAXY_STATS__ : {};

/** 8088 → "8.088" */
export function trNum(n: number): string {
  return n.toLocaleString('tr-TR');
}

export const APP_ID = (typeof __GALAXY_APP__ === 'string' ? __GALAXY_APP__ : 'asistan') as GalaxyAppId;

export const APP: GalaxyApp =
  ALL_APPS.find((a) => a.id === APP_ID) ?? (ALL_APPS[0] as GalaxyApp);

/**
 * "Diğer uygulamalar" listesi — yalnız GERÇEKTEN yayında olanlar.
 *
 * Birleşmeden sonra bu liste boş kalır ve MorePage o bölümü hiç
 * göstermez. Yayında olmayan bir uygulamayı Play bağlantısıyla listelemek
 * kullanıcıyı var olmayan bir sayfaya götürürdü.
 */
export const SIBLINGS = ALL_APPS.filter((a) => a.id !== APP_ID && a.published === true);

/** Aktif arayüz dili. Cihaz dili TR değilse EN'e düşer. */
export function detectLang(): string {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('galaxy:lang') : null;
  if (stored) return stored;
  const nav = typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : 'tr';
  return catalog.localeOrder.includes(nav) ? nav : catalog.defaultLocale;
}

export function appName(app: GalaxyApp = APP, lang: string = detectLang()): string {
  return app.name[lang] || app.name.en || app.name.tr;
}

export function appShort(app: GalaxyApp = APP, lang: string = detectLang()): string {
  return app.short[lang] || app.short.en || app.short.tr;
}

/** Kardeş uygulamanın Play mağaza adresi — "diğer uygulamalar" bölümü için. */
export function playUrl(app: GalaxyApp): string {
  return `https://play.google.com/store/apps/details?id=${app.packageId}`;
}
