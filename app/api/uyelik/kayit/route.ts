import { NextResponse } from 'next/server';
import { hashPassword, newId, normalizeEmail } from '@/lib/uyelik/crypto';
import { getUserByEmail, upsertUser } from '@/lib/uyelik/store';
import { setSessionCookie } from '@/lib/uyelik/session';
import { clientIp, rateLimit } from '@/lib/uyelik/rate-limit';
import type { UserRecord } from '@/lib/uyelik/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  if (!rateLimit(`kayit:${clientIp(req)}`, 8, 60 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: 'Çok fazla deneme. Bir süre sonra yeniden deneyin.' }, { status: 429 });
  }
  let body: {
    email?: string;
    password?: string;
    name?: string;
    kvkk?: boolean;
    dijitalIfa?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Geçersiz istek.' }, { status: 400 });
  }
  const email = normalizeEmail(body.email || '');
  const password = String(body.password || '');
  const name = String(body.name || '').trim();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'Geçerli bir e-posta girin.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ ok: false, error: 'Şifre en az 8 karakter olmalı.' }, { status: 400 });
  }
  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: 'Ad soyad girin.' }, { status: 400 });
  }
  if (!body.kvkk) {
    return NextResponse.json({ ok: false, error: 'KVKK aydınlatmasını onaylamanız gerekir.' }, { status: 400 });
  }
  if (!body.dijitalIfa) {
    return NextResponse.json(
      { ok: false, error: 'Dijital içeriğin anında ifasını kabul etmeniz gerekir.' },
      { status: 400 }
    );
  }
  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ ok: false, error: 'Bu e-posta ile kayıt var. Giriş yapın.' }, { status: 409 });
  }
  const user: UserRecord = {
    id: newId('u'),
    email,
    name,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
    membershipUntil: null,
    pendingRef: null,
    pendingAt: null,
    lastPaymentAt: null,
    lastPaymentKind: null,
  };
  await upsertUser(user);
  await setSessionCookie(user);
  return NextResponse.json({ ok: true, next: '/uyelik/odeme' });
}
