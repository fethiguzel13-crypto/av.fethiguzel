import { ALL_APPS, SITE } from './config';

/**
 * Derin bağlantı → uygulama içi yol.
 *
 * Kabul edilen biçimler:
 *   https://www.avfethiguzel.com/hesaplama/kidem   → /hesaplama/kidem
 *   avfethiguzel-hesap://kidem                     → /hesaplama/kidem
 *   avfethiguzel://hesap/kidem                     → /hesaplama/kidem
 *
 * Tanınmayan adres için null döner; çağıran taraf onu sistem tarayıcısına
 * bırakır. Sessizce ana sayfaya düşmek, kullanıcının tıkladığı bağlantıyı
 * kaybettiği için kötü bir davranış.
 */
export function pathFromDeepLink(raw: string): string | null {
  if (!raw) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  const proto = url.protocol.replace(':', '').toLowerCase();

  // avfethiguzel-hesap://kidem  → host="kidem" veya pathname="/kidem"
  const flavorMatch = /^avfethiguzel-(portal|hesap|icthat|rehber)$/.exec(proto);
  if (flavorMatch) {
    const app = ALL_APPS.find((a) => a.id === flavorMatch[1]);
    if (!app) return null;
    const rest = `${url.hostname}${url.pathname}`.replace(/^\/+/, '');
    return joinAppPath(app.path, rest, url.search);
  }

  // avfethiguzel://hesap/kidem → host = app id
  if (proto === 'avfethiguzel') {
    const app = ALL_APPS.find((a) => a.id === url.hostname);
    if (app) {
      return joinAppPath(app.path, url.pathname.replace(/^\/+/, ''), url.search);
    }
    return `/${url.hostname}${url.pathname}${url.search}` || '/';
  }

  // https://www.avfethiguzel.com/...
  if (proto === 'https' || proto === 'http') {
    const site = new URL(SITE);
    const host = url.hostname.replace(/^www\./, '');
    if (host !== site.hostname.replace(/^www\./, '')) return null;
    return `${url.pathname}${url.search}` || '/';
  }

  return null;
}

function joinAppPath(base: string, rest: string, search: string): string {
  const b = base === '/' ? '' : base.replace(/\/+$/, '');
  const r = rest ? `/${rest.replace(/^\/+/, '')}` : '';
  return `${b}${r}${search}` || '/';
}

/** Uygulama içi yol → paylaşılabilir web adresi. */
export function siteUrlFor(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE}${clean}`;
}
