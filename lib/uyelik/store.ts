import type { StoreFile, UserRecord } from './types';

const KV_KEY = 'fg:uyelik:v1';

let mem: StoreFile | null = null;
let writeChain: Promise<void> = Promise.resolve();

function emptyStore(): StoreFile {
  return { version: 1, users: [] };
}

function kvConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function kvCommand(command: unknown[]): Promise<{ result?: unknown } | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as { result?: unknown };
  } catch {
    return null;
  }
}

type KvOkuma = { ok: true; store: StoreFile | null } | { ok: false };

/** `ok: false` = KV'ye ulaşılamadı ya da içerik bozuk; bu durumda depo üzerine yazılmamalıdır. */
async function kvGet(): Promise<KvOkuma> {
  const json = await kvCommand(['GET', KV_KEY]);
  if (!json) return { ok: false };
  if (json.result == null) return { ok: true, store: null };
  try {
    const parsed = JSON.parse(String(json.result)) as StoreFile;
    if (!parsed || !Array.isArray(parsed.users)) return { ok: false };
    return { ok: true, store: parsed };
  } catch {
    return { ok: false };
  }
}

async function kvSet(store: StoreFile): Promise<boolean> {
  const json = await kvCommand(['SET', KV_KEY, JSON.stringify(store)]);
  return Boolean(json);
}

/**
 * Okuma: KV tanımlıysa her seferinde taze okunur; birden çok sunucu örneği aynı anahtarı paylaşır
 * ve bellekteki kopya başka örneğin yazısını görmez (G04/B6). KV'ye ulaşılamazsa son bilinen hâl.
 */
async function loadStore(): Promise<StoreFile> {
  if (kvConfigured()) {
    const r = await kvGet();
    if (r.ok) {
      mem = r.store || emptyStore();
      return mem;
    }
    return mem || emptyStore();
  }
  if (!mem) mem = emptyStore();
  return mem;
}

/** Yazma: KV okunamıyorsa yazı reddedilir; bayat ya da boş kopya bütün üyeleri ezebilir. */
async function loadStoreForWrite(): Promise<StoreFile> {
  if (kvConfigured()) {
    const r = await kvGet();
    if (!r.ok) throw new Error('Üye deposu okunamadı; yazı yapılmadı.');
    return r.store || emptyStore();
  }
  if (!mem) mem = emptyStore();
  return mem;
}

async function persist(store: StoreFile): Promise<void> {
  if (kvConfigured() && !(await kvSet(store))) throw new Error('Üye deposu yazılamadı.');
  mem = store;
}

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const store = await loadStore();
  return store.users.find((u) => u.email === email) || null;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const store = await loadStore();
  return store.users.find((u) => u.id === id) || null;
}

export async function listUsers(): Promise<UserRecord[]> {
  const store = await loadStore();
  return store.users.slice();
}

export async function upsertUser(user: UserRecord): Promise<UserRecord> {
  return enqueue(async () => {
    const store = await loadStoreForWrite();
    const i = store.users.findIndex((u) => u.id === user.id || u.email === user.email);
    if (i >= 0) store.users[i] = user;
    else store.users.push(user);
    await persist(store);
    return user;
  });
}

export async function updateUser(
  id: string,
  patch: Partial<UserRecord>
): Promise<UserRecord | null> {
  return mutateUser(id, () => patch);
}

/**
 * Yazma kuyruğunda kaydın GÜNCEL hâlini görerek değiştirir. `fn` null dönerse kayıt olduğu gibi
 * kalır. Karar güncel kayda bağlıysa (ör. bu ödeme daha önce işlendi mi) updateUser yerine bu
 * kullanılır; çağıranın elindeki nesne bayat olabilir.
 */
export async function mutateUser(
  id: string,
  fn: (current: UserRecord) => Partial<UserRecord> | null
): Promise<UserRecord | null> {
  return enqueue(async () => {
    const store = await loadStoreForWrite();
    const i = store.users.findIndex((u) => u.id === id);
    if (i < 0) return null;
    const patch = fn(store.users[i]);
    if (!patch) return store.users[i];
    store.users[i] = { ...store.users[i], ...patch, id: store.users[i].id };
    await persist(store);
    return store.users[i];
  });
}
