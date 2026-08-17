import React from 'react';
import { navigate } from '../lib/router';
import { isExternalHref, openExternal } from '../lib/external';

/**
 * `next/link` karşılığı.
 *
 * Portal bileşenleri `<Link href="/hesaplama/kidem">` yazar. Mobil kabukta
 * yönlendirme hash tabanlıdır ve site dışı adresler sistem tarayıcısına
 * gider — WebView içinde harici sayfa açmak Play incelemesinde "gizli
 * tarayıcı" olarak değerlendiriliyor.
 */
type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  children?: React.ReactNode;
};

export default function Link({
  href,
  children,
  onClick,
  prefetch: _prefetch,
  replace,
  scroll: _scroll,
  ...rest
}: Props) {
  const external = isExternalHref(href);

  return (
    <a
      {...rest}
      href={external ? href : `#${href}`}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        // Yeni sekme / orta tık davranışını bozma
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        if (external) {
          void openExternal(href);
          return;
        }
        navigate(href, { replace });
      }}
    >
      {children}
    </a>
  );
}
