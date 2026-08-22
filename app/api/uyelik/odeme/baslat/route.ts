import { NextResponse } from 'next/server';
import { getAccess } from '@/lib/uyelik/session';
import { iyzicoConfigured } from '@/lib/uyelik/config';
import { startCheckout } from '@/lib/uyelik/iyzico';
import { clientIp, rateLimit } from '@/lib/uyelik/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!rateLimit(`odeme:${clientIp(req)}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: 'Çok fazla deneme.' }, { status: 429 });
  }
  const { user } = await getAccess();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Giriş yapın.', next: '/uyelik/giris' }, { status: 401 });
  }
  if (!iyzicoConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'Kart ödemesi henüz açık değil. Havale ile devam edin.' },
      { status: 503 }
    );
  }
  const result = await startCheckout(user);
  if (result.status !== 'success' || !result.checkoutFormContent) {
    return NextResponse.json(
      { ok: false, error: result.errorMessage || 'Ödeme formu açılamadı.' },
      { status: 502 }
    );
  }
  return NextResponse.json({
    ok: true,
    token: result.token,
    checkoutFormContent: result.checkoutFormContent,
  });
}
