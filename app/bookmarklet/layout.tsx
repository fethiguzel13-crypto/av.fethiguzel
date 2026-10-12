import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { paylasimMeta } from '@/lib/paylasim';

// Sayfa istemci bileşeni olduğu için metadata burada (G20: önceden hiç yoktu, sayfa ana sayfanın başlığını taşıyordu).
export const metadata: Metadata = {
  title: 'Mevzuat ara — yer imi aracı',
  description:
    'Seçili metni ya da yazdığınız ifadeyi portalın mevzuat aramasında açan tarayıcı yer imi; kurulum için bağlantıyı yer imleri çubuğuna sürüklemek yeterlidir.',
  alternates: { canonical: 'https://www.avfethiguzel.com/bookmarklet' },
  ...paylasimMeta({ adres: '/bookmarklet', tur: 'site' }),
};

export default function BookmarkletLayout({ children }: { children: ReactNode }) {
  return children;
}
