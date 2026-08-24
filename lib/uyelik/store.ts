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

async function kvGet(): Promise<StoreFile | null> {
  const json = await kvCommand(['GET', KV_KEY]);
  if (!json || json.result == null) return null;
  try {
    const parsed = JSON.parse(String(json.result)) as StoreFile;
    if (!parsed || !Array.isArray(parsed.users)) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function kvSet(store: StoreFile): Promise<boolean> {
  const json = await kvCommand(['SET', KV_KEY, JSON.stringify(store)]);
  return Boolean(json);
}

async function loadStore(): Promise<StoreFile> {
  if (mem) return mem;
  if (kvConfigured()) {
    const fromKv = await kvGet();
    if (fromKv) {
      mem = fromKv;
      return mem;
    }
  }
  mem = emptyStore();
  return mem;
}

async function persist(store: StoreFile): Promise<void> {
  mem = store;
  if (kvConfigured()) await kvSet(store);
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
    const store = await loadStore();
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
  return enqueue(async () => {
    const store = await loadStore();
    const i = store.users.findIndex((u) => u.id === id);
    if (i < 0) return null;
    store.users[i] = { ...store.users[i], ...patch, id: store.users[i].id };
    await persist(store);
    return store.users[i];
  });
}
