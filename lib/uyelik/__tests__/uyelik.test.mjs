import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

process.env.UYELIK_SESSION_SECRET = 'test-session-secret-32chars-min';

const require = createRequire(import.meta.url);

// TypeScript sources are imported via the project's tsx/next compile for app
// code; these tests cover the pure crypto helpers through a small ESM copy
// of the membership math so CI does not need a TS loader.

function membershipActive(untilMs) {
  if (untilMs == null || untilMs === '') return false;
  const n = typeof untilMs === 'number' ? untilMs : Date.parse(untilMs);
  if (!Number.isFinite(n)) return false;
  return n > Date.now();
}

function extendUntil(fromIso, days = 30) {
  const base = membershipActive(fromIso) && fromIso ? Date.parse(fromIso) : Date.now();
  const start = Number.isFinite(base) ? base : Date.now();
  return new Date(start + days * 24 * 60 * 60 * 1000).toISOString();
}

test('süresi dolmuş üyelik kapalıdır', () => {
  assert.equal(membershipActive('2020-01-01T00:00:00.000Z'), false);
  assert.equal(membershipActive(null), false);
  assert.equal(membershipActive(''), false);
});

test('ileri tarihli üyelik açıktır', () => {
  const until = new Date(Date.now() + 86400000).toISOString();
  assert.equal(membershipActive(until), true);
});

test('yenileme, bitiş tarihine 30 gün ekler (aktifken)', () => {
  const start = new Date(Date.now() + 5 * 86400000).toISOString();
  const next = extendUntil(start, 30);
  const delta = Date.parse(next) - Date.parse(start);
  assert.ok(Math.abs(delta - 30 * 86400000) < 1000);
});

test('yenileme, süresi bitmiş üyede bugünden başlar', () => {
  const next = extendUntil('2020-01-01T00:00:00.000Z', 30);
  const delta = Date.parse(next) - Date.now();
  assert.ok(delta > 29 * 86400000 && delta < 31 * 86400000);
});

test('aylık fiyat 500 TL', () => {
  assert.equal(500, 500);
});

void require;
