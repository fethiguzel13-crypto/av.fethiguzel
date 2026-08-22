import { createHash, createHmac, randomBytes } from 'node:crypto';
import { iyzicoBaseUrl, siteOrigin, UYELIK } from './config';
import type { UserRecord } from './types';

type IyzicoResponse = {
  status?: string;
  errorMessage?: string;
  errorCode?: string;
  checkoutFormContent?: string;
  token?: string;
  paymentStatus?: string;
  conversationId?: string;
};

function authHeader(uriPath: string, body: string): { rnd: string; authorization: string } {
  const apiKey = process.env.IYZICO_API_KEY || '';
  const secret = process.env.IYZICO_SECRET_KEY || '';
  const rnd = randomBytes(8).toString('hex');
  const payload = rnd + uriPath + body;
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  const raw = `apiKey:${apiKey}&randomKey:${rnd}&signature:${signature}`;
  return { rnd, authorization: `IYZWSv2 ${Buffer.from(raw, 'utf8').toString('base64')}` };
}

async function iyzicoPost(uriPath: string, payload: Record<string, unknown>): Promise<IyzicoResponse> {
  const body = JSON.stringify(payload);
  const { rnd, authorization } = authHeader(uriPath, body);
  const res = await fetch(`${iyzicoBaseUrl()}${uriPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
      'x-iyzi-rnd': rnd,
      'x-iyzi-client-version': 'avfethiguzel-portal-1',
    },
    body,
    cache: 'no-store',
  });
  const json = (await res.json().catch(() => ({}))) as IyzicoResponse;
  return json;
}

function conversationId(userId: string): string {
  return `uyelik-${userId}-${Date.now()}`;
}

export async function startCheckout(user: UserRecord): Promise<IyzicoResponse> {
  const origin = siteOrigin();
  const price = UYELIK.priceTl.toFixed(2);
  const buyerId = createHash('sha256').update(user.email).digest('hex').slice(0, 16);
  const uri = '/payment/iyzipos/checkoutform/initialize/auth/ecom';
  return iyzicoPost(uri, {
    locale: 'tr',
    conversationId: conversationId(user.id),
    price,
    paidPrice: price,
    currency: 'TRY',
    basketId: `yargi-${user.id}`,
    paymentGroup: 'PRODUCT',
    callbackUrl: `${origin}/api/uyelik/odeme/sonuc`,
    enabledInstallments: [1],
    buyer: {
      id: buyerId,
      name: user.name.split(' ')[0] || 'Uye',
      surname: user.name.split(' ').slice(1).join(' ') || 'Arsiv',
      gsmNumber: '+905350000000',
      email: user.email,
      identityNumber: '11111111111',
      lastLoginDate: '2026-01-01 00:00:00',
      registrationDate: '2026-01-01 00:00:00',
      registrationAddress: 'Erciş / Van',
      ip: '172.16.0.1',
      city: 'Van',
      country: 'Turkey',
      zipCode: '65400',
    },
    shippingAddress: {
      contactName: user.name || 'Üye',
      city: 'Van',
      country: 'Turkey',
      address: 'Dijital içerik — fiziksel teslimat yok',
      zipCode: '65400',
    },
    billingAddress: {
      contactName: user.name || 'Üye',
      city: 'Van',
      country: 'Turkey',
      address: 'Dijital içerik — fiziksel teslimat yok',
      zipCode: '65400',
    },
    basketItems: [
      {
        id: 'yargi-aylik',
        name: 'Yargıtay arşivi aylık üyelik',
        category1: 'Dijital içerik',
        itemType: 'VIRTUAL',
        price,
      },
    ],
  });
}

export async function retrieveCheckout(token: string): Promise<IyzicoResponse> {
  return iyzicoPost('/payment/iyzipos/checkoutform/auth/ecom/detail', {
    locale: 'tr',
    conversationId: `retrieve-${Date.now()}`,
    token,
  });
}

export function paymentOk(res: IyzicoResponse): boolean {
  return res.status === 'success' && (res.paymentStatus === 'SUCCESS' || !res.paymentStatus);
}
