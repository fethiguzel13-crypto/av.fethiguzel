import { useCallback, useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';

/**
 * Kalıcı depolama.
 *
 * WebView'ın localStorage'ı Android'de "uygulama verilerini temizle" dışında
 * da silinebiliyor (düşük depolama baskısı altında WebView önbelleği ile
 * birlikte). Kullanıcının favorileri ve notları bu yüzden Capacitor
 * Preferences'a (native SharedPreferences) yazılır; localStorage yalnız
 * senkron okuma için ayna görevi görür.
 */

const memory = new Map<string, string>();

function readMirror(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeMirror(key: string, value: string | null) {
  if (value === null) {
    memory.delete(key);
    try {
      localStorage.removeItem(key);
    } catch {
      /* yok sayılır */
    }
    return;
  }
  memory.set(key, value);
  try {
    localStorage.setItem(key, value);
  } catch {
    /* kota dolu — native tarafta yine de saklanır */
  }
}

/** Native depodan oku ve aynayı tazele. Uygulama açılışında bir kez çağrılır. */
export async function hydrate(keys: string[]): Promise<void> {
  await Promise.all(
    keys.map(async (key) => {
      try {
        const { value } = await Preferences.get({ key });
        if (value !== null && value !== undefined) writeMirror(key, value);
      } catch {
        /* tarayıcıda çalışıyoruz */
      }
    })
  );
}

export function getJSON<T>(key: string, fallback: T): T {
  const raw = readMirror(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJSON<T>(key: string, value: T): void {
  const raw = JSON.stringify(value);
  writeMirror(key, raw);
  Preferences.set({ key, value: raw }).catch(() => {});
  notify(key);
}

export function remove(key: string): void {
  writeMirror(key, null);
  Preferences.remove({ key }).catch(() => {});
  notify(key);
}

// ── Tepkisel katman ──────────────────────────────────────────────────────────
const subs = new Map<string, Set<() => void>>();

function notify(key: string) {
  subs.get(key)?.forEach((fn) => fn());
}

/**
 * Depolanan bir değeri React durumu gibi kullanır.
 * Aynı anahtarı dinleyen tüm bileşenler tek yazımda güncellenir.
 */
export function usePersisted<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => getJSON(key, fallback));

  useEffect(() => {
    const listener = () => setValue(getJSON(key, fallback));
    let set = subs.get(key);
    if (!set) {
      set = new Set();
      subs.set(key, set);
    }
    set.add(listener);
    listener();
    return () => {
      set?.delete(listener);
    };
    // fallback kasıtlı olarak bağımlılık dışı: her renderda yeni referans olur
    // ve sonsuz döngü doğururdu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(getJSON(key, fallback)) : next;
      setJSON(key, resolved);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  return [value, update];
}

// ── Ortak anahtarlar ─────────────────────────────────────────────────────────
export const KEYS = {
  favorites: 'galaxy:favorites',
  recent: 'galaxy:recent',
  saved: 'galaxy:saved',
  calcHistory: 'galaxy:calc-history',
  followTopics: 'galaxy:follow-topics',
  installedPacks: 'galaxy:packs',
  lastSeenIcthat: 'galaxy:icthat-seen',
  notifyDaily: 'galaxy:notify-daily',
  fontScale: 'galaxy:font-scale',
  /** Son okunan madde ve kararlar — ana ekrandaki «kaldığınız yer» şeridi */
  lastRead: 'galaxy:last-read',
  onboarded: 'galaxy:onboarded',
} as const;

export const ALL_KEYS = Object.values(KEYS);
