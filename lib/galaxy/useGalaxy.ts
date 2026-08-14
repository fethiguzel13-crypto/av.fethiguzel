'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  type GalaxyApp,
  type GalaxyAppId,
  type LocaleCode,
  ACTIVE_LOCALES,
  DEFAULT_LOCALE,
  getGalaxyApp,
  inferAppFromPath,
} from './catalog';
import {
  detectBrowserLocale,
  persistLocale,
  readStoredLocale,
  t as translate,
} from './i18n';

const APP_STORAGE = 'fg_app';

export function useGalaxy() {
  const pathname = usePathname() || '/';
  const search = useSearchParams();
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);
  const [appId, setAppIdState] = useState<GalaxyAppId>('portal');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fromQuery = search?.get('lang');
    const fromApp = search?.get('app') as GalaxyAppId | null;
    const stored = readStoredLocale();
    const nextLocale =
      (fromQuery as LocaleCode) ||
      stored ||
      detectBrowserLocale() ||
      DEFAULT_LOCALE;
    // Yalnızca aktif UI dilleri (TR/EN); diğerleri metin hazır, menüde sonra
    const safeLocale = (ACTIVE_LOCALES as string[]).includes(nextLocale)
      ? nextLocale
      : DEFAULT_LOCALE;
    setLocaleState(safeLocale);
    persistLocale(safeLocale);

    let nextApp: GalaxyAppId = 'portal';
    if (fromApp && ['portal', 'hesap', 'icthat', 'rehber'].includes(fromApp)) {
      nextApp = fromApp;
    } else {
      try {
        const s = window.localStorage.getItem(APP_STORAGE) as GalaxyAppId | null;
        if (s && ['portal', 'hesap', 'icthat', 'rehber'].includes(s)) nextApp = s;
        else nextApp = inferAppFromPath(pathname);
      } catch {
        nextApp = inferAppFromPath(pathname);
      }
    }
    setAppIdState(nextApp);
    try {
      window.localStorage.setItem(APP_STORAGE, nextApp);
      document.documentElement.dataset.galaxyApp = nextApp;
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [pathname, search]);

  const setLocale = useCallback((l: LocaleCode) => {
    const safe = (ACTIVE_LOCALES as string[]).includes(l) ? l : DEFAULT_LOCALE;
    setLocaleState(safe);
    persistLocale(safe);
  }, []);

  const setAppId = useCallback((id: GalaxyAppId) => {
    setAppIdState(id);
    try {
      window.localStorage.setItem(APP_STORAGE, id);
      document.documentElement.dataset.galaxyApp = id;
    } catch {
      /* ignore */
    }
  }, []);

  const app: GalaxyApp = useMemo(() => getGalaxyApp(appId), [appId]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale]
  );

  return {
    ready,
    locale,
    setLocale,
    appId,
    setAppId,
    app,
    t,
    activeLocales: ACTIVE_LOCALES,
  };
}
