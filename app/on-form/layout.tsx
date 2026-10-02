import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Sayfa istemci bileşeni olduğu için metadata burada (G06b).
export const metadata: Metadata = {
  title: 'Müvekkil Ön Formu',
  description:
    'Konu ve iletişim bilgilerini e-posta uygulamanıza aktaran ön form; veriler tarayıcıda kalır, sunucuya kaydedilmez.',
  alternates: { canonical: 'https://www.avfethiguzel.com/on-form' },
};

export default function OnFormLayout({ children }: { children: ReactNode }) {
  return children;
}
