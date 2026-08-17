import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { SITE } from './config';

const OWN_HOSTS = new Set(['avfethiguzel.com', 'www.avfethiguzel.com', 'localhost', '127.0.0.1']);

/** Site dışı mı? Uygulama içi yollar (`/hesaplama`) daima false. */
export function isExternalHref(href: string): boolean {
  if (!href) return false;
  if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) return false;
  if (/^(tel|mailto|sms|geo|market|intent):/i.test(href)) return true;
  try {
    const u = new URL(href, SITE);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return true;
    return !OWN_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}

/**
 * Harici adres sistem tarayıcısında açılır.
 *
 * Play politikası: uygulama içi WebView'da üçüncü taraf sayfa (özellikle
 * oturum açma) göstermek reddedilme sebebi. Capacitor Browser eklentisi
 * Chrome Custom Tab kullanır; adres çubuğu görünür, oturum cihazla paylaşılır.
 */
export async function openExternal(url: string): Promise<void> {
  if (!url) return;
  try {
    await Browser.open({ url, presentationStyle: 'popover' });
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/** Site içi bir yolu tarayıcıda açar — "web sürümünde gör" bağlantıları için. */
export async function openOnSite(path: string): Promise<void> {
  const clean = path.startsWith('/') ? path : `/${path}`;
  await openExternal(`${SITE}${clean}?utm_source=android_app&utm_medium=deeplink`);
}

export type SharePayload = { title?: string; text?: string; url?: string };

/** Native paylaşım → Web Share → panoya kopyala. Dönen değer: iletildi mi. */
export async function share(payload: SharePayload): Promise<boolean> {
  const title = payload.title || 'Av. Fethi Güzel';
  const text = payload.text || '';
  const url = payload.url || '';

  try {
    const { value } = await Share.canShare();
    if (value) {
      await Share.share({ title, text: text || title, url: url || undefined, dialogTitle: 'Paylaş' });
      return true;
    }
  } catch {
    /* kullanıcı iptali veya eklenti yok */
  }

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text: text || undefined, url: url || undefined });
      return true;
    } catch {
      /* iptal */
    }
  }

  const combined = [text, url].filter(Boolean).join('\n').trim() || title;
  try {
    await navigator.clipboard.writeText(combined);
    return true;
  } catch {
    return false;
  }
}
