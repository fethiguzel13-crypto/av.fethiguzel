import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminSecret, UYELIK } from '@/lib/uyelik/config';
import { normalizeEmail } from '@/lib/uyelik/crypto';
import { getUserByEmail, listUsers } from '@/lib/uyelik/store';
import { activateMembership } from '@/lib/uyelik/membership';
import { cookieOptions } from '@/lib/uyelik/session';
import type { UserRecord } from '@/lib/uyelik/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function stripHash(u: UserRecord) {
  const { passwordHash: _pw, ...rest } = u;
  void _pw;
  return rest;
}

async function isAdmin(req: Request): Promise<boolean> {
  const secret = adminSecret();
  if (!secret) return false;
  const auth = req.headers.get('authorization') || '';
  if (auth === `Bearer ${secret}`) return true;
  const jar = await cookies();
  return jar.get(UYELIK.adminCookie)?.value === secret;
}

export async function POST(req: Request) {
  const secret = adminSecret();
  if (!secret) {
    return NextResponse.json({ ok: false, error: 'UYELIK_ADMIN_SECRET tanımlı değil.' }, { status: 503 });
  }
  let body: { secret?: string; email?: string; list?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Geçersiz istek.' }, { status: 400 });
  }
  if (body.secret === secret) {
    const jar = await cookies();
    jar.set(UYELIK.adminCookie, secret, { ...cookieOptions(), maxAge: 60 * 60 * 12 });
  }
  if (!(await isAdmin(req)) && body.secret !== secret) {
    return NextResponse.json({ ok: false, error: 'Yetkisiz.' }, { status: 401 });
  }
  if (body.list) {
    const users = await listUsers();
    return NextResponse.json({
      ok: true,
      users: users.map((u) => stripHash(u)),
    });
  }
  const email = normalizeEmail(body.email || '');
  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Üye bulunamadı.' }, { status: 404 });
  }
  const activated = await activateMembership(user, 'admin');
  return NextResponse.json({ ok: true, user: stripHash(activated) });
}

export async function GET(req: Request) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ ok: false, error: 'Yetkisiz.' }, { status: 401 });
  }
  const users = await listUsers();
  return NextResponse.json({ ok: true, users: users.map((u) => stripHash(u)) });
}
