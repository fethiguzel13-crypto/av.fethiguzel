import { bytesToB64, bytesToHex, hmacSha256, randomBytes, sha256 } from './crypto';
import { iyzicoBaseUrl, iyzicoKeys, siteOrigin, UYELIK } from './config';
import type { UserRecord } from './types';

export type IyzicoResponse = {
  status?: string;
  errorMessage?: string;
  errorCode?: string;
  checkoutFormContent?: string;
  token?: string;
  paymentId?: string;
  paymentStatus?: string;
  fraudStatus?: number | string;
  currency?: string;
  price?: number | string;
  paidPrice?: number | string;
  basketId?: string;
  conversationId?: string;
};

const BASKET_PREFIX = 'yargi-';
const CONVERSATION_PREFIX = 'uyelik-';

async function authHeader(uriPath: string, body: string): Promise<{ rnd: string; authorization: string }> {
  const keys = iyzicoKeys();
  const apiKey = keys?.apiKey || '';
  const secret = keys?.secretKey || '';
  const rnd = bytesToHex(randomBytes(8));
  const payload = rnd + uriPath + body;
  const signature = bytesToHex(await hmacSha256(secret, payload));
  const raw = `apiKey:${apiKey}&randomKey:${rnd}&signature:${signature}`;
  return { rnd, authorization: `IYZWSv2 ${bytesToB64(new TextEncoder().encode(raw))}` };
}

async function iyzicoPost(uriPath: string, payload: Record<string, unknown>): Promise<IyzicoResponse> {
  const body = JSON.stringify(payload);
  const { rnd, authorization } = await authHeader(uriPath, body);
  let res: Response;
  try {
    res = await fetch(`${iyzicoBaseUrl()}${uriPath}`, {
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
  } catch {
    return { status: 'failure', errorMessage: 'Ödeme sağlayıcısına ulaşılamadı.' };
  }
  const json = (await res.json().catch(() => ({}))) as IyzicoResponse;
  if (!json.status && !res.ok) {
    return { status: 'failure', errorMessage: `Ödeme sağlayıcısı ${res.status} döndü.` };
  }
  return json;
}

function conversationId(userId: string): string {
  return `${CONVERSATION_PREFIX}${userId}-${Date.now()}`;
}

export function basketIdFor(userId: string): string {
  return `${BASKET_PREFIX}${userId}`;
}

/** iyzico yanıtından üye kimliğini çıkarır: önce basketId, olmazsa conversationId. */
export function userIdFromResponse(res: IyzicoResponse): string {
  const basket = String(res.basketId || '');
  if (basket.startsWith(BASKET_PREFIX)) {
    const id = basket.slice(BASKET_PREFIX.length).trim();
    if (id) return id;
  }
  const conversation = String(res.conversationId || '');
  if (conversation.startsWith(CONVERSATION_PREFIX)) {
    return conversation.slice(CONVERSATION_PREFIX.length).replace(/-\d+$/, '').trim();
  }
  return '';
}

function normalizeName(user: UserRecord): { name: string; surname: string } {
  const parts = String(user.name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { name: 'Uye', surname: 'Arsiv' };
  if (parts.length === 1) return { name: parts[0], surname: parts[0] };
  return { name: parts.slice(0, -1).join(' '), surname: parts[parts.length - 1] };
}

export async function startCheckout(user: UserRecord, ip = '85.34.78.112'): Promise<IyzicoResponse> {
  const origin = siteOrigin();
  const price = UYELIK.priceTl.toFixed(2);
  const buyerId = bytesToHex(await sha256(user.email)).slice(0, 16);
  const { name, surname } = normalizeName(user);
  const created = user.createdAt ? user.createdAt.slice(0, 19).replace('T', ' ') : '2026-01-01 00:00:00';
  const uri = '/payment/iyzipos/checkoutform/initialize/auth/ecom';
  return iyzicoPost(uri, {
    locale: 'tr',
    conversationId: conversationId(user.id),
    price,
    paidPrice: price,
    currency: UYELIK.currency,
    basketId: basketIdFor(user.id),
    paymentGroup: 'PRODUCT',
    callbackUrl: `${origin}/api/uyelik/odeme/sonuc`,
    enabledInstallments: [1],
    buyer: {
      id: buyerId,
      name,
      surname,
      gsmNumber: '+905350000000',
      email: user.email,
      identityNumber: '11111111111',
      lastLoginDate: created,
      registrationDate: created,
      registrationAddress: 'Erciş / Van',
      ip,
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

/**
 * Tahsilatın gerçekten ve doğru tutarda gerçekleştiğini doğrular.
 * `status: success` tek başına yetmez; iyzico 3D akışının yarıda kaldığı
 * durumlarda da başarı döndürebildiğinden ödeme durumu, para birimi, tutar
 * ve fraud sonucu ayrı ayrı denetlenir.
 */
export function paymentOk(res: IyzicoResponse): boolean {
  if (res.status !== 'success') return false;
  if (String(res.paymentStatus || '').toUpperCase() !== 'SUCCESS') return false;
  if (res.currency && String(res.currency).toUpperCase() !== UYELIK.currency) return false;
  const paid = Number(res.paidPrice ?? res.price ?? NaN);
  if (!Number.isFinite(paid) || paid + 0.01 < UYELIK.priceTl) return false;
  if (res.fraudStatus !== undefined && res.fraudStatus !== null && Number(res.fraudStatus) < 0) return false;
  return true;
}
