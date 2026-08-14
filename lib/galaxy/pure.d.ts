export const LOCALE_ORDER: string[];
export const DEFAULT_LOCALE: string;
export const ACTIVE_LOCALES: string[];
export const SITE: string;
export const SCHEME: string;

export function isLocale(v: string | null | undefined, order?: string[]): boolean;
export function normalizeLocale(
  v: string | null | undefined,
  order?: string[],
  fallback?: string
): string;
export function translate(
  dicts: Record<string, object>,
  locale: string,
  key: string,
  vars?: Record<string, string | number>
): string;
export function getGalaxyApp<T extends { id: string }>(apps: T[], id: string | null | undefined): T;
export function localized(
  map: Record<string, string>,
  locale: string,
  fallback?: string
): string;
export function appHomeUrl(
  app: { id: string; path: string },
  locale?: string,
  site?: string
): string;
export function deepLinkFor(appId: string, path?: string, scheme?: string): string;
export function webUrlFor(
  apps: Array<{ id: string; path: string }>,
  appId: string,
  site?: string
): string;
export function inferAppFromPath(pathname: string): string;
export function pathFromAppUrl(
  raw: string,
  apps: Array<{ id: string; path: string }>,
  site?: string,
  scheme?: string
): string | null;
export function tabsForApp(
  apps: Array<{ id: string; tabs?: string[] }>,
  appId: string
): string[];
export function packageIdFor(
  apps: Array<{ id: string; packageId: string }>,
  appId: string
): string;
