import { NextResponse } from 'next/server';
import { paymentOk, retrieveCheckout } from '@/lib/uyelik/iyzico';
import { getUserById } from '@/lib/uyelik/store';
import { activateMembership } from '@/lib/uyelik/membership';
import { siteOrigin } from '@/lib/uyelik/config';
import { setSessionCookie } from '@/lib/uyelik/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handle(token: string | null) {
  const origin = siteOrigin();
  if (!token) {
    return NextResponse.redirect(`${origin}/uyelik/odeme?durum=hata`);
  }
  const result = await retrieveCheckout(token);
  if (!paymentOk(result)) {
    return NextResponse.redirect(`${origin}/uyelik/odeme?durum=hata`);
  }
  const conversation = String(result.conversationId || '');
  const fullId = conversation.startsWith('uyelik-')
    ? conversation.slice('uyelik-'.length).replace(/-\d+$/, '')
    : '';
  const found = fullId ? await getUserById(fullId) : null;
  if (!found) {
    return NextResponse.redirect(`${origin}/uyelik/odeme?durum=hesap`);
  }
  const activated = await activateMembership(found, 'iyzico');
  await setSessionCookie(activated);
  return NextResponse.redirect(`${origin}/uyelik/odeme/tamam`);
}

export async function POST(req: Request) {
  const ctype = req.headers.get('content-type') || '';
  let token: string | null = null;
  if (ctype.includes('application/x-www-form-urlencoded') || ctype.includes('multipart/form-data')) {
    const form = await req.formData();
    token = String(form.get('token') || '');
  } else {
    try {
      const json = (await req.json()) as { token?: string };
      token = json.token || null;
    } catch {
      token = null;
    }
  }
  return handle(token);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  return handle(url.searchParams.get('token'));
}
