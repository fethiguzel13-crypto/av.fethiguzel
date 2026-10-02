import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Sayfa istemci bileşeni olduğu için metadata burada (G06b).
export const metadata: Metadata = {
  title: 'Eserlerim ve Yayınlar',
  description:
    'Av. Fethi Güzel’in kitap ve akademik yayınlarına ilişkin nesnel yayın bilgisi: e-duruşma monografisi ve diğer çalışmalar.',
  alternates: { canonical: 'https://www.avfethiguzel.com/eserlerim' },
};

export default function EserlerimLayout({ children }: { children: ReactNode }) {
  return children;
}
