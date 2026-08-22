import { NextResponse } from 'next/server';
import { getAccess } from '@/lib/uyelik/session';
import { havaleInfo, iyzicoConfigured, priceLabel, UYELIK } from '@/lib/uyelik/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const { publicUser, member } = await getAccess();
  const havale = havaleInfo();
  return NextResponse.json({
    ok: true,
    user: publicUser,
    member,
    plan: {
      name: UYELIK.name,
      priceTl: UYELIK.priceTl,
      priceLabel: priceLabel(),
      periodDays: UYELIK.periodDays,
      iyzico: iyzicoConfigured(),
      havale: Boolean(havale.iban),
    },
  });
}
