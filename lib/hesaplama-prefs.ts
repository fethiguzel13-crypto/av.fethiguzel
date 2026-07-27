/** localStorage — favori ve son kullanılan hesaplama araçları (istemci) */

const FAV_KEY = 'fg-hesaplama-favs';
const RECENT_KEY = 'fg-hesaplama-recent';
const MAX_RECENT = 8;

function safeParse(raw: string | null): string[] {
    if (!raw) return [];
    try {
        const v = JSON.parse(raw);
        return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
    } catch {
        return [];
    }
}

export function loadFavorites(): string[] {
    if (typeof window === 'undefined') return [];
    return safeParse(localStorage.getItem(FAV_KEY));
}

export function saveFavorites(ids: string[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FAV_KEY, JSON.stringify(ids));
}

export function toggleFavorite(id: string): string[] {
    const cur = loadFavorites();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur];
    saveFavorites(next);
    return next;
}

export function loadRecent(): string[] {
    if (typeof window === 'undefined') return [];
    return safeParse(localStorage.getItem(RECENT_KEY));
}

export function pushRecent(id: string): string[] {
    if (typeof window === 'undefined') return [];
    const cur = loadRecent().filter((x) => x !== id);
    const next = [id, ...cur].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    return next;
}
