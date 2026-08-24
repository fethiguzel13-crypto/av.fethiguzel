import { scryptAsync } from '@noble/hashes/scrypt.js';
import { sessionSecret } from './config';
import type { SessionPayload } from './types';

const KEYLEN = 32;
const enc = new TextEncoder();

function bytesToB64url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, '0');
  return hex;
}

export function bytesToB64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export function randomBytes(n: number): Uint8Array {
  const out = new Uint8Array(n);
  crypto.getRandomValues(out);
  return out;
}

export async function hmacSha256(key: string, data: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data));
  return new Uint8Array(sig);
}

export async function sha256(data: string): Promise<Uint8Array> {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(data));
  return new Uint8Array(buf);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
  return d === 0;
}

export function newId(prefix = 'u'): string {
  return `${prefix}_${bytesToHex(randomBytes(12))}`;
}

export function normalizeEmail(email: string): string {
  return String(email || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
}

export function newHavaleRef(): string {
  return `FG${bytesToHex(randomBytes(4)).toUpperCase()}`;
}

export async function hashPassword(password: string): Promise<string> {
  const N = 16384;
  const r = 8;
  const p = 1;
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, { N, r, p, dkLen: KEYLEN });
  return `scrypt$${N}$${r}$${p}$${bytesToB64url(salt)}$${bytesToB64url(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = String(stored || '').split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!N || !r || !p) return false;
  let salt: Uint8Array;
  let expected: Uint8Array;
  try {
    salt = b64urlToBytes(parts[4]);
    expected = b64urlToBytes(parts[5]);
  } catch {
    return false;
  }
  if (!salt.length || !expected.length) return false;
  const hash = await scryptAsync(password, salt, { N, r, p, dkLen: expected.length });
  return timingSafeEqual(hash, expected);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const body = bytesToB64url(enc.encode(JSON.stringify(payload)));
  const mac = bytesToB64url(await hmacSha256(sessionSecret(), body));
  return `${body}.${mac}`;
}

export async function readSession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 8) return null;
  const body = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = bytesToB64url(await hmacSha256(sessionSecret(), body));
  if (mac.length !== expected.length) return null;
  const a = enc.encode(mac);
  const b = enc.encode(expected);
  if (!timingSafeEqual(a, b)) return null;
  try {
    const json = new TextDecoder().decode(b64urlToBytes(body));
    const payload = JSON.parse(json) as SessionPayload;
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
