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
