import { useSyncExternalStore } from 'react';

/**
 * Hash tabanlı mini yönlendirici.
 *
 * Neden hash: uygulama `file://` benzeri bir yerel köke yüklenir (Capacitor
 * `https://localhost` sunar ama servis çalışanı yok). History API ile derin
 * yol yazmak yenilemede 404 üretir; hash her koşulda çalışır ve Android geri
 * tuşu doğal olarak `popstate` üretir.
 */

export type Route = {
  path: string;
  query: URLSearchParams;
  params: Record<string, string>;
  hash: string;
};

const listeners = new Set<() => void>();
let current: Route = parse(readHash());
let snapshotKey = 0;
let cachedKey = -1;
let cachedRoute: Route = current;

function readHash(): string {
  if (typeof window === 'undefined') return '/';
  const raw = window.location.hash.replace(/^#/, '');
  return raw || '/';
}

function parse(raw: string): Route {
  const [beforeHash, innerHash = ''] = raw.split('#');
  const [pathname, search = ''] = beforeHash.split('?');
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return {
    path: path.length > 1 ? path.replace(/\/+$/, '') : '/',
    query: new URLSearchParams(search),
    params: {},
    hash: innerHash,
  };
}

/**
 * ─── Kaydırma belleği ──────────────────────────────────────────────────────
 *
 * Her gezinme sayfayı tepeye alıyordu — GERİ dönüş dâhil. Arşivde beş yüz
 * satır kaydırıp bir kararı açan kullanıcı, geri döndüğünde listenin en
 * başında buluyordu kendini; okuduğu yer kayboluyor, aşağı inmek için
 * yeniden yüzlerce satır kaydırmak gerekiyordu.
 *
 * İleri gezinmede tepeden başlamak doğrudur: yeni bir sayfa açılıyordur.
 * Geri dönüşte yanlıştır: kullanıcı bıraktığı yere döner. İkisini ayırmak
 * için `navigate()` bir bayrak bırakır; bayrak yoksa değişimi tarayıcı
 * (geri/ileri tuşu) yapmıştır.
 */
const konumlar = new Map<string, number>();
let ileriGezinme = false;

function konumKaydet() {
  if (typeof window === 'undefined') return;
  konumlar.set(toHref(current), window.scrollY || 0);
}

/** Bir sayfanın hatırlanan kaydırma konumu — yoksa 0. */
export function hatirlananKonum(href: string): number {
  return konumlar.get(href) ?? 0;
}

/**
 * Sayfayı hatırlanan yerine götürür.
 *
 * Uzun listeler satırlarını kademeli çizdiği için yönlendiricinin tek
 * seferlik geri sarması yetmez: geri dönüldüğü anda sayfa henüz kısadır ve
 * tarayıcı istenen konuma inemez. Bu yüzden liste sayfaları, satırlarını
 * geri getirdikten sonra bunu kendileri çağırır.
 */
export function konumaGit(y: number): void {
  if (y <= 0) return;
  window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
}

function emit() {
  // Ayrılan sayfanın konumu, `current` değişmeden önce yazılır. Geri tuşuyla
  // çıkışta `navigate()` hiç çalışmadığı için kayıt burada tutulmalı.
  konumKaydet();

  current = parse(readHash());
  snapshotKey += 1;
  listeners.forEach((l) => l());

  const href = toHref(current);
  const geri = !ileriGezinme;
  ileriGezinme = false;

  requestAnimationFrame(() => {
    window.scrollTo({
      top: geri ? konumlar.get(href) ?? 0 : 0,
      behavior: 'instant' as ScrollBehavior,
    });
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', emit);
}

export function navigate(href: string, opts: { replace?: boolean } = {}) {
  if (!href) return;
  const target = href.startsWith('#') ? href.slice(1) : href;
  const normalized = target.startsWith('/') ? target : `/${target}`;
  if (normalized === toHref(current)) return;

  ileriGezinme = true;

  if (opts.replace) {
    const url = `${window.location.pathname}${window.location.search}#${normalized}`;
    window.history.replaceState(null, '', url);
    emit();
  } else {
    window.location.hash = normalized;
  }
}

export function toHref(route: Route): string {
  const q = route.query.toString();
  return `${route.path}${q ? `?${q}` : ''}`;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Route {
  if (cachedKey !== snapshotKey) {
    cachedKey = snapshotKey;
    cachedRoute = current;
  }
  return cachedRoute;
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * `/mevzuat/tbk/madde-6` gibi bir yolu desene göre çözer.
 * Dönen nesne eşleşme yoksa null.
 */
export function match(pattern: string, path: string): Record<string, string> | null {
  const pp = pattern.split('/').filter(Boolean);
  const ap = path.split('/').filter(Boolean);
  const params: Record<string, string> = {};

  for (let i = 0; i < pp.length; i += 1) {
    const seg = pp[i];
    if (seg === '*') {
      params['*'] = ap.slice(i).join('/');
      return params;
    }
    if (i >= ap.length) return null;
    if (seg.startsWith(':')) {
      params[seg.slice(1)] = decodeURIComponent(ap[i]);
    } else if (seg !== ap[i]) {
      return null;
    }
  }
  return pp.length === ap.length ? params : null;
}

/** Geri gidilecek bir geçmiş var mı — Android geri tuşu davranışı için. */
export function canGoBack(): boolean {
  return window.history.length > 1 && current.path !== '/';
}
