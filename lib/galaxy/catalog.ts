/**
 * Hukuk Galaxy — uygulama kataloğu.
 * Saf mantık: ./pure.mjs · veri: mobile/galaxy/catalog.json ile senkron.
 */

import {
  ACTIVE_LOCALES as PURE_ACTIVE,
  DEFAULT_LOCALE as PURE_DEFAULT,
  LOCALE_ORDER as PURE_ORDER,
  SCHEME as PURE_SCHEME,
  SITE as PURE_SITE,
  appHomeUrl as pureAppHomeUrl,
  deepLinkFor as pureDeepLinkFor,
  getGalaxyApp as pureGetGalaxyApp,
  inferAppFromPath as pureInfer,
  localized as pureLocalized,
  pathFromAppUrl as purePathFromAppUrl,
  tabsForApp as pureTabsForApp,
  webUrlFor as pureWebUrlFor,
} from './pure.mjs';

export type LocaleCode = 'tr' | 'en' | 'de' | 'fr' | 'ar';
export type GalaxyAppId = 'portal' | 'hesap' | 'icthat' | 'rehber';
export type LocalizedString = Record<LocaleCode, string>;
export type TabKey = 'home' | 'search' | 'guide' | 'calc' | 'cases';

export type GalaxyApp = {
  id: GalaxyAppId;
  packageId: string;
  versionName: string;
  versionCode: number;
  name: LocalizedString;
  short: LocalizedString;
  path: string;
  accent: string;
  role: 'hub' | 'tool' | 'research' | 'citizen';
  tabs: TabKey[];
};

export const LOCALE_ORDER = PURE_ORDER as LocaleCode[];
export const DEFAULT_LOCALE = PURE_DEFAULT as LocaleCode;
export const ACTIVE_LOCALES = PURE_ACTIVE as LocaleCode[];
export const SITE = PURE_SITE;
export const SCHEME = PURE_SCHEME;

export const LOCALE_LABELS: Record<LocaleCode, string> = {
  tr: 'Türkçe',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  ar: 'العربية',
};

export const GALAXY_APPS: GalaxyApp[] = [
  {
    id: 'portal',
    packageId: 'com.avfethiguzel.hukuk',
    versionName: '1.2.0',
    versionCode: 3,
    name: {
      tr: 'Av. Fethi Güzel',
      en: 'Fethi Güzel Law',
      de: 'Fethi Güzel Recht',
      fr: 'Fethi Güzel Droit',
      ar: 'فتحي كوزيل للقانون',
    },
    short: {
      tr: 'Mevzuat, şerh, hesap ve içtihat.',
      en: 'Statutes, commentary, calculators and case law.',
      de: 'Gesetze, Kommentare, Rechner und Rechtsprechung.',
      fr: 'Textes, commentaires, calculateurs et jurisprudence.',
      ar: 'تشريعات وشروح وحاسبات واجتهاد.',
    },
    path: '/',
    accent: '#2E4036',
    role: 'hub',
    tabs: ['home', 'search', 'guide', 'calc', 'cases'],
  },
  {
    id: 'hesap',
    packageId: 'com.avfethiguzel.hesap',
    versionName: '1.0.0',
    versionCode: 1,
    name: {
      tr: 'Hukuki Hesap',
      en: 'Legal Calc TR',
      de: 'Rechtsrechner TR',
      fr: 'Calcul Juridique TR',
      ar: 'الحاسبة القانونية',
    },
    short: {
      tr: 'Kıdem, faiz, harç ve 30+ hukuki hesaplama.',
      en: 'Severance, interest, fees and 30+ legal calculators.',
      de: 'Abfindung, Zinsen, Gebühren und 30+ Rechner.',
      fr: 'Indemnités, intérêts, frais et 30+ calculateurs.',
      ar: 'تعويضات وفوائد ورسوم وأكثر من 30 حاسبة.',
    },
    path: '/hesaplama',
    accent: '#CC5833',
    role: 'tool',
    tabs: ['calc', 'home', 'guide', 'cases'],
  },
  {
    id: 'icthat',
    packageId: 'com.avfethiguzel.icthat',
    versionName: '1.0.0',
    versionCode: 1,
    name: {
      tr: 'İçtihat Günü',
      en: 'Case Law Daily',
      de: 'Rechtsprechung Täglich',
      fr: 'Jurisprudence Quotidienne',
      ar: 'الاجتهاد اليومي',
    },
    short: {
      tr: 'Günlük Yargıtay, Danıştay ve AYM özetleri.',
      en: 'Daily high-court case briefs.',
      de: 'Tägliche Zusammenfassungen höchster Gerichte.',
      fr: 'Résumés quotidiens des hautes juridictions.',
      ar: 'ملخصات يومية لأعلى المحاكم.',
    },
    path: '/icthat',
    accent: '#1B4F72',
    role: 'research',
    tabs: ['cases', 'search', 'home', 'calc'],
  },
  {
    id: 'rehber',
    packageId: 'com.avfethiguzel.rehber',
    versionName: '1.0.0',
    versionCode: 1,
    name: {
      tr: 'Vatandaş Hukuku',
      en: 'Citizen Law TR',
      de: 'Bürgerrecht TR',
      fr: 'Droit du Citoyen TR',
      ar: 'قانون المواطن',
    },
    short: {
      tr: 'Adım adım vatandaş rehberi: merci, süre, belge.',
      en: 'Step-by-step citizen guides: forum, deadline, documents.',
      de: 'Schritt-für-Schritt: Zuständigkeit, Frist, Unterlagen.',
      fr: 'Guides pas à pas: instance, délai, documents.',
      ar: 'أدلة خطوة بخطوة: الجهة والمدة والمستندات.',
    },
    path: '/bilgi',
    accent: '#6B4F3A',
    role: 'citizen',
    tabs: ['guide', 'calc', 'home', 'cases'],
  },
];

export function getGalaxyApp(id: string | null | undefined): GalaxyApp {
  return pureGetGalaxyApp(GALAXY_APPS, id) as GalaxyApp;
}

export function localized(
  map: LocalizedString,
  locale: LocaleCode,
  fallback: LocaleCode = 'en'
): string {
  return pureLocalized(map, locale, fallback);
}

export function appHomeUrl(app: GalaxyApp, locale: LocaleCode = 'tr'): string {
  return pureAppHomeUrl(app, locale, SITE);
}

export function deepLinkFor(appId: GalaxyAppId, path = ''): string {
  return pureDeepLinkFor(appId, path, SCHEME);
}

export function webUrlFor(appId: GalaxyAppId): string {
  return pureWebUrlFor(GALAXY_APPS, appId, SITE);
}

export function inferAppFromPath(pathname: string): GalaxyAppId {
  return pureInfer(pathname) as GalaxyAppId;
}

export function pathFromGalaxyUrl(raw: string): string | null {
  return purePathFromAppUrl(raw, GALAXY_APPS, SITE, SCHEME);
}

export function tabsForApp(appId: GalaxyAppId): TabKey[] {
  return pureTabsForApp(GALAXY_APPS, appId) as TabKey[];
}
