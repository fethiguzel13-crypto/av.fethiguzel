/**
 * Hukuk Galaxy — uygulama kataloğu (tek kaynak).
 * mobile/galaxy/catalog.json ile senkron tutulur.
 */

export type LocaleCode = 'tr' | 'en' | 'de' | 'fr' | 'ar';

export type GalaxyAppId = 'portal' | 'hesap' | 'icthat' | 'rehber';

export type LocalizedString = Record<LocaleCode, string>;

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
  tabs: Array<'home' | 'search' | 'guide' | 'calc' | 'cases'>;
};

export const LOCALE_ORDER: LocaleCode[] = ['tr', 'en', 'de', 'fr', 'ar'];
export const DEFAULT_LOCALE: LocaleCode = 'tr';
/** UI’da önce aktif olan diller (DE/FR/AR metin hazır, menüde kademeli açılır) */
export const ACTIVE_LOCALES: LocaleCode[] = ['tr', 'en'];

export const LOCALE_LABELS: Record<LocaleCode, string> = {
  tr: 'Türkçe',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  ar: 'العربية',
};

export const SITE = 'https://www.avfethiguzel.com';
export const SCHEME = 'avfethiguzel';

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
  return GALAXY_APPS.find((a) => a.id === id) ?? GALAXY_APPS[0];
}

export function localized(
  map: LocalizedString,
  locale: LocaleCode,
  fallback: LocaleCode = 'en'
): string {
  return map[locale] || map[fallback] || map.tr;
}

export function appHomeUrl(app: GalaxyApp, locale: LocaleCode = 'tr'): string {
  const base = `${SITE}${app.path === '/' ? '' : app.path}`;
  const params = new URLSearchParams();
  params.set('app', app.id);
  if (locale !== 'tr') params.set('lang', locale);
  return `${base}?${params.toString()}`;
}

export function deepLinkFor(appId: GalaxyAppId, path = ''): string {
  const p = path.replace(/^\//, '');
  return p ? `${SCHEME}://${appId}/${p}` : `${SCHEME}://${appId}`;
}

export function webUrlFor(appId: GalaxyAppId): string {
  const app = getGalaxyApp(appId);
  return `${SITE}${app.path === '/' ? '/' : app.path}`;
}

/** Path’e göre hangi galaxy uygulamasına ait olduğunu tahmin et */
export function inferAppFromPath(pathname: string): GalaxyAppId {
  if (pathname.startsWith('/hesaplama')) return 'hesap';
  if (pathname.startsWith('/icthat') || pathname.startsWith('/yargi')) return 'icthat';
  if (pathname.startsWith('/bilgi') || pathname.startsWith('/rehber')) return 'rehber';
  return 'portal';
}
