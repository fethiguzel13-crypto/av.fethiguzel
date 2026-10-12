import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { paylasimMeta } from '@/lib/paylasim';

// Metadata burada kalır (G06b'de sayfa istemci bileşeniydi; G16'da sunucu bileşenine döndü).
export const metadata: Metadata = {
  title: 'Eserlerim ve Yayınlar',
  description:
    'Av. Fethi Güzel’in kitabı, kanun şerhleri ve makaleleri: e-duruşma monografisi, yayınevi ve satış kanalları.',
  alternates: { canonical: 'https://www.avfethiguzel.com/eserlerim' },
  // Eser listesi yazarın "yayımlanmış eser" kartını paylaşır; ayrı kart üretilmez.
  ...paylasimMeta({ adres: '/eserlerim', tur: 'yazar', anahtar: 'akademik-profil' }),
};

export default function EserlerimLayout({ children }: { children: ReactNode }) {
  return children;
}
