/**
 * Paylaşım görselleri (Open Graph / Twitter, 1200×630 PNG) — Aylık plan G20.
 *
 * Kapalı küme: Yalnız `lib/paylasim-kayit.ts`'teki kartlar derlemede üretilir, listede olmayan adres 404'tür.
 * Metin sorgu dizgisinden alınmaz; bu hem alan adı altında keyfî yazılı görsel üretilmesini hem de her paylaşımda
 * sunucu fonksiyonu çağrısını (Vercel kullanım sınırı, G00) önler.
 */
import { ImageResponse } from 'next/og';
import { kartAgaci, kartFontlari, KART_BOYUT } from '@/lib/paylasim-kart.mjs';
import { paylasimKartlari, turEtiketi } from '@/lib/paylasim-kayit';
import type { PaylasimTuru } from '@/lib/paylasim';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await paylasimKartlari()).map(({ tur, anahtar }) => ({ tur, anahtar }));
}

let fontlar: ReturnType<typeof kartFontlari> | undefined;

export async function GET(_istek: Request, { params }: { params: Promise<{ tur: string; anahtar: string }> }) {
  const { tur, anahtar } = await params;
  const kart = (await paylasimKartlari()).find((k) => k.tur === tur && k.anahtar === anahtar);
  if (!kart) return new Response('Bulunamadı', { status: 404 });
  fontlar ??= kartFontlari();
  return new ImageResponse(kartAgaci({ tur: turEtiketi(kart.tur as PaylasimTuru), baslik: kart.baslik, ust: kart.ust }), {
    ...KART_BOYUT,
    fonts: fontlar,
  });
}
