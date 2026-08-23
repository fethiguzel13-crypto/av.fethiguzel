import { NextResponse } from 'next/server';
import { getAccess, setSessionCookie } from '@/lib/uyelik/session';
import { havaleInfo, iyzicoConfigured, priceLabel, UYELIK } from '@/lib/uyelik/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const { publicUser, member, user } = await getAccess();

  /*
    Oturum çerezinin tazelendiği TEK yer.

    Bu iş daha önce sayfaların kendisinde yapılıyordu; Next.js render
    sırasında çerez yazmayı yasakladığı için üye olarak açılan her sayfa
    500 veriyordu. Route handler çerez yazabilen bir bağlam olduğu için
    tazeleme buraya alındı.

    İki şeyi güncel tutar: imzalı oturumun ömrünü ve gezinme çubuğunun
    okuduğu görünürlük çerezini. İkincisi, üyelik yönetici tarafından
    uzatıldığında ya da süresi dolduğunda arayüzün doğruyu göstermesini
    sağlar.
  */
  if (user) {
    try {
      await setSessionCookie(user);
    } catch {
      // Çerez yazılamazsa yanıt yine doğru veriyi taşır.
    }
  }
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
