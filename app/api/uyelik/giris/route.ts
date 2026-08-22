import { NextResponse } from 'next/server';
import { normalizeEmail, verifyPassword } from '@/lib/uyelik/crypto';
import { getUserByEmail } from '@/lib/uyelik/store';
import { setSessionCookie } from '@/lib/uyelik/session';
import { clientIp, rateLimit } from '@/lib/uyelik/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!rateLimit(`giris:${clientIp(req)}`, 12, 15 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: 'Çok fazla deneme. Bir süre sonra yeniden deneyin.' }, { status: 429 });
  }
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Geçersiz istek.' }, { status: 400 });
  }
  const email = normalizeEmail(body.email || '');
  const password = String(body.password || '');
  const user = await getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ ok: false, error: 'E-posta veya şifre hatalı.' }, { status: 401 });
  }
  await setSessionCookie(user);
  return NextResponse.json({
    ok: true,
    next: user.membershipUntil && Date.parse(user.membershipUntil) > Date.now()
      ? '/yargi-kararlari'
      : '/uyelik/odeme',
  });
}
