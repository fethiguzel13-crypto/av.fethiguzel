import { APP_ID, type GalaxyAppId } from './config';

/**
 * Alt gezinme sekmeleri — uygulama başına ayrı.
 *
 * Katalogdaki `tabs` alanı dört uygulamayı birbirinin kopyası gibi
 * gösteriyordu (hepsinde home/search/guide/calc/cases). Burada her uygulama
 * yalnız KENDİ içeriğinde gezinir; kardeş uygulamalar "Diğer" sekmesinde
 * ayrıca listelenir. Play'in Repetitive Content değerlendirmesinde uygulamalar
 * arasındaki işlevsel ayrım en görünür yerde bu sekmelerdir.
 */
export type Tab = {
  id: string;
  path: string;
  label: string;
  icon: 'calc' | 'star' | 'clock' | 'book' | 'grid' | 'bookmark' | 'today' | 'archive' | 'bell' | 'search' | 'download' | 'apps' | 'scale';
};

const TABS: Record<GalaxyAppId, Tab[]> = {
  hesap: [
    { id: 'tools', path: '/', label: 'Araçlar', icon: 'calc' },
    { id: 'fav', path: '/favoriler', label: 'Favoriler', icon: 'star' },
    { id: 'history', path: '/gecmis', label: 'Geçmiş', icon: 'clock' },
    { id: 'more', path: '/diger', label: 'Diğer', icon: 'apps' },
  ],
  rehber: [
    { id: 'guides', path: '/', label: 'Rehberler', icon: 'book' },
    { id: 'cats', path: '/kategoriler', label: 'Konular', icon: 'grid' },
    { id: 'saved', path: '/kaydettiklerim', label: 'Kaydettiklerim', icon: 'bookmark' },
    { id: 'more', path: '/diger', label: 'Diğer', icon: 'apps' },
  ],
  icthat: [
    { id: 'today', path: '/', label: 'Bugün', icon: 'today' },
    { id: 'archive', path: '/arsiv', label: 'Arşiv', icon: 'archive' },
    { id: 'follow', path: '/takip', label: 'Takip', icon: 'bell' },
    { id: 'more', path: '/diger', label: 'Diğer', icon: 'apps' },
  ],
  portal: [
    { id: 'laws', path: '/', label: 'Mevzuat', icon: 'scale' },
    { id: 'search', path: '/ara', label: 'Ara', icon: 'search' },
    { id: 'offline', path: '/indirilenler', label: 'İndirilenler', icon: 'download' },
    { id: 'more', path: '/diger', label: 'Diğer', icon: 'apps' },
  ],
};

export const APP_TABS: Tab[] = TABS[APP_ID] ?? TABS.portal;

/** Verilen yol hangi sekmeye ait? En uzun eşleşen önek kazanır. */
export function activeTabId(path: string): string {
  let best = APP_TABS[0]?.id ?? '';
  let bestLen = -1;
  for (const t of APP_TABS) {
    if (t.path === '/') {
      if (path === '/' && bestLen < 0) {
        best = t.id;
        bestLen = 0;
      }
      continue;
    }
    if ((path === t.path || path.startsWith(`${t.path}/`)) && t.path.length > bestLen) {
      best = t.id;
      bestLen = t.path.length;
    }
  }
  return best;
}
