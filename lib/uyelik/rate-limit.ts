type Bucket = { n: number; reset: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const cur = buckets.get(key);
  if (!cur || cur.reset < now) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  if (cur.n >= limit) return false;
  cur.n += 1;
  return true;
}

/** Sayacı artırmadan sınırın dolup dolmadığını söyler; yalnız başarısız denemeleri saymak için. */
export function rateLimitDolu(key: string, limit: number): boolean {
  const cur = buckets.get(key);
  return Boolean(cur && cur.reset >= Date.now() && cur.n >= limit);
}

export function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'local'
  );
}
