import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { paylasimMeta } from '@/lib/paylasim';

// Sayfa istemci bileşeni olduğu için metadata burada (G06b).
export const metadata: Metadata = {
  title: 'Müvekkil Ön Formu',
  description:
    'Konu ve iletişim bilgilerini e-posta uygulamanıza aktaran ön form; veriler tarayıcıda kalır, sunucuya kaydedilmez.',
  alternates: { canonical: 'https://www.avfethiguzel.com/on-form' },
  // Genel site kartı: kartta çağrı ya da iletişim ifadesi yer almaz (G07, reklam yasağı).
  ...paylasimMeta({ adres: '/on-form', tur: 'site' }),
};

export default function OnFormLayout({ children }: { children: ReactNode }) {
  return children;
}
