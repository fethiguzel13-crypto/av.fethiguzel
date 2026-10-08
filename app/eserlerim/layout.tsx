import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Metadata burada kalır (G06b'de sayfa istemci bileşeniydi; G16'da sunucu bileşenine döndü).
export const metadata: Metadata = {
  title: 'Eserlerim ve Yayınlar',
  description:
    'Av. Fethi Güzel’in kitabı, kanun şerhleri ve makaleleri: e-duruşma monografisi, yayınevi ve satış kanalları.',
  alternates: { canonical: 'https://www.avfethiguzel.com/eserlerim' },
};

export default function EserlerimLayout({ children }: { children: ReactNode }) {
  return children;
}
