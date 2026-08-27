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
  /*
    Sekme sırası ürünün ne olduğunu söyler.

    Önceki dizilimde «Hesap» ortadaydı ve dört bölümün en gelişmişiydi;
    uygulama dışarıdan hesap makinesi gibi görünüyordu. Hesaplama artık
    beş sekmenin sonuncusu: yararlı bir araç, ama ürünün yüzü değil.
    Yerine mevzuat ve yargı arşivi öne alındı; Kitaplık rehber, kavram
    sözlüğü ve akademik eserleri tek çatı altında toplar.
  */
  asistan: [
    { id: 'home', path: '/', label: 'Ana', icon: 'apps' },
    { id: 'laws', path: '/mevzuat', label: 'Mevzuat', icon: 'scale' },
    { id: 'cases', path: '/arsiv', label: 'Yargı', icon: 'archive' },
    { id: 'library', path: '/kitaplik', label: 'Kitaplık', icon: 'book' },
    { id: 'tools', path: '/hesap', label: 'Araçlar', icon: 'calc' },
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
  cases: ['/icthat', '/karar', '/arsiv', '/takip', '/uyelik'],
  // Kitaplık: rehber + kavram sözlüğü + akademik eserler
  library: [
    '/kitaplik',
    '/rehber',
    '/kategori',
    '/kategoriler',
    '/kaydettiklerim',
    '/kavram',
    '/eserler',
    '/eser',
  ],
};

/**
 * Bölüm rengi — uygulamanın «neredeyim» işareti.
 *
 * Beş sekmenin hepsi tek yeşille boyanınca ekranlar birbirinden ayrılmıyordu.
 * Her bölümün kendi rengi var ve bu renk başlık çubuğunun altındaki ince
 * şeride, rozetlere ve vurgu ögelerine geçiyor; kullanıcı sayfayı okumadan
 * hangi bölümde olduğunu görüyor.
 *
 * Renkler mevzuat kategorileriyle aynı aileden: kütüphanenin kendi tasnifi.
 */
export const BOLUM_RENK: Record<string, string> = {
  home: '#2E4036',
  laws: '#2E4036',
  cases: '#1B4F72',
  library: '#6B4F3A',
  tools: '#B24A28',
};

/**
 * Şeridin rengi — KÖMÜR başlık çubuğunun üstünde okunan açık ton.
 *
 * Bölüm rengini olduğu gibi kullanmak eski yeşil çubukta şeridi görünmez
 * kılıyordu: çubuk da şerit de aynı ormanı yeşiliydi. Açık tonlar önceden
 * hesaplandı; `color-mix` eski WebView sürümlerinde bulunmuyor.
 *
 * Çubuk kömür siyahına çevrilince beşi de zeminden ayrılır oldu; yalnız
 * giriş ekranının şeridi markanın kendi turuncusuna alındı — orası bir
 * bölüm değil, uygulamanın kendisidir.
 */
export const BOLUM_SERIT: Record<string, string> = {
  home: '#D96B45',
  laws: '#8FAE9B',
  cases: '#7FB3DC',
  library: '#C9A886',
  tools: '#F0906B',
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

/**
 * Verilen yol hangi sekmeye ait? En uzun eşleşen önek kazanır.
 *
 * Eşleşme yoksa BOŞ döner — ilk sekmeye düşmez. `/diger` ve `/ayarlar`
 * kabuğa ait olup hiçbir sekmenin sahiplenmediği yollardır; önceki sürüm
 * burada `APP_TABS[0]` (Ana) döndürüyordu, bu da kullanıcı "Diğer"
 * sayfasındayken alt menünün "Ana"yı vurgulaması demekti — nerede
 * olduğuna dair yanlış bilgi. Boş dönüş, `BottomNav`'ın hiçbir sekmeyi
 * etkin işaretlememesini sağlar (`tab.id === active` hiçbir sekme için
 * doğru olmaz).
 */
export function activeTabId(path: string): string {
  // Birleşik uygulamada sekme kimliği bölüm kimliğiyle aynıdır; böylece
  // `/arac/5` gibi alt yollar da kendi sekmesini işaretler.
  const section = sectionOf(path);
  if (section && APP_TABS.some((t) => t.id === section)) return section;

  let best = '';
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
