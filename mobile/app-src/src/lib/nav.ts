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
  /**
   * Birleşik uygulama — dört bölüm tek kabukta.
   *
   * Bölümlerin iç yolları birbirine karışmaz: dört uygulamanın rota
   * kümeleri zaten ayrıktı (`/arac/:id`, `/mevzuat/:kanun`, `/arsiv`,
   * `/kategori/:cat` …). Yalnız her birinin ana sayfası `/` idi; burada
   * her bölüme kendi kökü verildi ve `/` bölümleri tanıtan giriş
   * ekranına ayrıldı.
   */
  asistan: [
    { id: 'home', path: '/', label: 'Ana', icon: 'apps' },
    { id: 'laws', path: '/mevzuat', label: 'Mevzuat', icon: 'scale' },
    { id: 'tools', path: '/hesap', label: 'Hesap', icon: 'calc' },
    { id: 'cases', path: '/icthat', label: 'İçtihat', icon: 'today' },
    { id: 'guides', path: '/rehber', label: 'Rehber', icon: 'book' },
  ],
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

export const APP_TABS: Tab[] = TABS[APP_ID] ?? TABS.asistan;

/**
 * Birleşik uygulamada hangi yol hangi bölüme ait.
 *
 * TEK KAYNAK: hem alt gezinmedeki etkin sekmeyi hem `AsistanApp`'in hangi
 * bölüm bileşenini göstereceğini bu tablo belirler. İkisi ayrı listeler
 * tutarsa, bir bölüme yeni yol eklendiğinde sekme yanlış yerde parlar ya da
 * sayfa hiç açılmaz.
 *
 * Bölümlerin ana sayfası dışındaki yolları, dört uygulama ayrıyken de
 * benzersizdi; bu yüzden önek çakışması yok. `/diger` ve `/ayarlar` bilinçli
 * olarak listede değil — onlar bölüme değil kabuğa aittir.
 */
export const SECTION_PATHS: Record<string, string[]> = {
  laws: ['/mevzuat', '/ara', '/indirilenler'],
  tools: ['/hesap', '/arac', '/favoriler', '/gecmis'],
  cases: ['/icthat', '/karar', '/arsiv', '/takip'],
  guides: ['/rehber', '/kategori', '/kategoriler', '/kaydettiklerim'],
};

/** Yol bu önekin kendisi mi, yoksa altında mı? (`/kategoriler` ≠ `/kategori`) */
function under(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}

/** Verilen yol hangi bölüme ait? Bölüm dışı yollarda null. */
export function sectionOf(path: string): string | null {
  for (const [section, paths] of Object.entries(SECTION_PATHS)) {
    if (paths.some((p) => under(path, p))) return section;
  }
  return null;
}

/** Verilen yol hangi sekmeye ait? En uzun eşleşen önek kazanır. */
export function activeTabId(path: string): string {
  // Birleşik uygulamada sekme kimliği bölüm kimliğiyle aynıdır; böylece
  // `/arac/5` gibi alt yollar da kendi sekmesini işaretler.
  const section = sectionOf(path);
  if (section && APP_TABS.some((t) => t.id === section)) return section;

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
    if (under(path, t.path) && t.path.length > bestLen) {
      best = t.id;
      bestLen = t.path.length;
    }
  }
  return best;
}
