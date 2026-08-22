import { NextResponse } from 'next/server';
import { getAccess, setSessionCookie } from '@/lib/uyelik/session';
import { newHavaleRef } from '@/lib/uyelik/crypto';
import { updateUser } from '@/lib/uyelik/store';
import { havaleInfo, priceLabel, UYELIK } from '@/lib/uyelik/config';
import { clientIp, rateLimit } from '@/lib/uyelik/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!rateLimit(`havale:${clientIp(req)}`, 8, 60 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: 'Çok fazla deneme.' }, { status: 429 });
  }
  const { user } = await getAccess();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Giriş yapın.', next: '/uyelik/giris' }, { status: 401 });
  }
  const ref = user.pendingRef || newHavaleRef();
  const updated = await updateUser(user.id, {
    pendingRef: ref,
    pendingAt: new Date().toISOString(),
  });
  const saved = updated || { ...user, pendingRef: ref };
  await setSessionCookie(saved);
  const havale = havaleInfo();
  return NextResponse.json({
    ok: true,
    ref,
    amount: priceLabel(),
    periodDays: UYELIK.periodDays,
    iban: havale.iban,
    hesapAdi: havale.hesapAdi,
    banka: havale.banka,
  });
}
