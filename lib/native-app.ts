/**
 * Capacitor WebView köprüsü — portal npm'ine bağımlı değil.
 * Native uygulama sunucu URL'sini yüklerken window.Capacitor enjekte edilir.
 */

export type CapPlatform = 'web' | 'android' | 'ios' | 'unknown';

type CapBridge = {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
  Plugins?: Record<string, any>;
};

function cap(): CapBridge | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { Capacitor?: CapBridge }).Capacitor ?? null;
}

export function isNativeApp(): boolean {
  const c = cap();
  if (!c) return false;
  try {
    if (typeof c.isNativePlatform === 'function') return c.isNativePlatform();
  } catch {
    /* ignore */
  }
  const p = c.getPlatform?.();
  return p === 'android' || p === 'ios';
}

export function getNativePlatform(): CapPlatform {
  if (!isNativeApp()) return 'web';
  const p = cap()?.getPlatform?.();
  if (p === 'android' || p === 'ios') return p;
  return 'unknown';
}

export function getCapPlugin<T = any>(name: string): T | null {
  const plugins = cap()?.Plugins;
  if (!plugins || !plugins[name]) return null;
  return plugins[name] as T;
}

const OWN_HOSTS = new Set([
  'avfethiguzel.com',
  'www.avfethiguzel.com',
  'localhost',
  '127.0.0.1',
]);

/** Aynı site mi, yoksa sistem tarayıcısına mı açılmalı? */
export function isExternalUrl(href: string): boolean {
  if (!href || href.startsWith('#') || href.startsWith('javascript:')) return false;
  if (
    href.startsWith('tel:') ||
    href.startsWith('mailto:') ||
    href.startsWith('sms:') ||
    href.startsWith('geo:') ||
    href.startsWith('market:') ||
    href.startsWith('intent:')
  ) {
    return true;
  }
  try {
    const u = new URL(href, typeof window !== 'undefined' ? window.location.href : 'https://www.avfethiguzel.com');
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return true;
    const host = u.hostname.replace(/^www\./, '');
    if (OWN_HOSTS.has(u.hostname) || OWN_HOSTS.has(host) || OWN_HOSTS.has(`www.${host}`)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/** Harici URL: Capacitor Browser veya yeni sekme. */
export async function openExternalUrl(url: string): Promise<boolean> {
  if (!url) return false;
  const Browser = getCapPlugin<{
    open?: (o: { url: string; windowName?: string }) => Promise<void>;
  }>('Browser');
  if (Browser?.open) {
    try {
      await Browser.open({ url });
      return true;
    } catch {
      /* fall through */
    }
  }
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  }
  return false;
}

export type SharePayload = {
  title?: string;
  text?: string;
  url?: string;
  dialogTitle?: string;
};

/**
 * Native Share → Web Share API → panoya kopyala.
 * true = bir yolla iletildi / kopyalandı.
 */
export async function shareContent(payload: SharePayload): Promise<boolean> {
  const title = payload.title || 'Av. Fethi Güzel Hukuk Portalı';
  const text = payload.text || '';
  const url = payload.url || (typeof window !== 'undefined' ? window.location.href : '');
  const combined = [text, url].filter(Boolean).join('\n').trim();

  const Share = getCapPlugin<{
    share?: (o: {
      title?: string;
      text?: string;
      url?: string;
      dialogTitle?: string;
    }) => Promise<void>;
  }>('Share');

  if (Share?.share) {
    try {
      await Share.share({
        title,
        text: text || title,
        url: url || undefined,
        dialogTitle: payload.dialogTitle || 'Paylaş',
      });
      return true;
    } catch {
      /* kullanıcı iptal veya eklenti hatası */
    }
  }

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title,
        text: text || undefined,
        url: url || undefined,
      });
      return true;
    } catch {
      /* iptal */
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(combined || title);
      return true;
    } catch {
      /* ignore */
    }
  }
  return false;
}

/** Deep link URL → sitedeki path (+ search + hash). */
export function pathFromAppUrl(raw: string): string | null {
  if (!raw) return null;
  try {
    // avfethiguzel://mevzuat/tbk  veya https://www.avfethiguzel.com/...
    let normalized = raw;
    if (raw.startsWith('avfethiguzel://')) {
      normalized =
        'https://www.avfethiguzel.com/' +
        raw.slice('avfethiguzel://'.length).replace(/^\/+/, '');
    }
    const u = new URL(normalized);
    const host = u.hostname.replace(/^www\./, '');
    if (host && host !== 'avfethiguzel.com') return null;
    const path = `${u.pathname || '/'}${u.search || ''}${u.hash || ''}`;
    return path || '/';
  } catch {
    return null;
  }
}
