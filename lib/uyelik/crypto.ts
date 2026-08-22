import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { sessionSecret } from './config';
import type { SessionPayload } from './types';

const KEYLEN = 32;

function scryptHash(
  password: string,
  salt: Buffer,
  keylen: number,
  opts: { N: number; r: number; p: number }
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(password, salt, keylen, opts, (err, derived) => {
      if (err) reject(err);
      else resolve(derived as Buffer);
    });
  });
}

export function newId(prefix = 'u'): string {
  return `${prefix}_${randomBytes(12).toString('hex')}`;
}

export function normalizeEmail(email: string): string {
  return String(email || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
}

export function newHavaleRef(): string {
  return `FG${randomBytes(4).toString('hex').toUpperCase()}`;
}

export async function hashPassword(password: string): Promise<string> {
  const N = 16384;
  const r = 8;
  const p = 1;
  const salt = randomBytes(16);
  const hash = await scryptHash(password, salt, KEYLEN, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString('base64url')}$${hash.toString('base64url')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = String(stored || '').split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!N || !r || !p) return false;
  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(parts[4], 'base64url');
    expected = Buffer.from(parts[5], 'base64url');
  } catch {
    return false;
  }
  if (!salt.length || !expected.length) return false;
  const hash = await scryptHash(password, salt, expected.length, { N, r, p });
  if (hash.length !== expected.length) return false;
  return timingSafeEqual(hash, expected);
}

export function signSession(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const mac = createHmac('sha256', sessionSecret()).update(body).digest('base64url');
  return `${body}.${mac}`;
}

export function readSession(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 8) return null;
  const body = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = createHmac('sha256', sessionSecret()).update(body).digest('base64url');
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload?.uid || !payload.em || !payload.exp) return null;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function membershipActive(untilMs: number | string | null | undefined): boolean {
  if (untilMs == null || untilMs === '') return false;
  const n = typeof untilMs === 'number' ? untilMs : Date.parse(untilMs);
  if (!Number.isFinite(n)) return false;
  return n > Date.now();
}
