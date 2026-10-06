"use client";

import { useEffect, useRef, useState } from 'react';

/**
 * Google Haritalar gömmesini yalnız kutu görünür alana yaklaşınca yükler (Aylık plan G13).
 *
 * `loading="lazy"` tek başına yetmiyor: tarayıcı kısa sayfalarda alt bilgideki iframe'i erken yükleme eşiği içinde
 * görüp ~400 KB harita betiği indiriyor. Yüklenene kadar yerinde haritayı yeni sekmede açan bağlantı durur
 * (JavaScript kapalıyken de çalışır).
 */
export default function ErtelenmisHarita({
  src,
  title,
  aramaUrl,
  className,
  iframeClassName,
}: {
  src: string;
  title: string;
  aramaUrl: string;
  className?: string;
  iframeClassName?: string;
}) {
  const kutu = useRef<HTMLDivElement>(null);
  const [goster, setGoster] = useState(false);

  useEffect(() => {
    const el = kutu.current;
    // Gözlemcisi olmayan tarayıcıda bağlantı yerinde kalır; harita yeni sekmede açılır.
    if (!el || !('IntersectionObserver' in window)) return;
    const gozlemci = new IntersectionObserver(
      (girdiler) => {
        if (girdiler.some((g) => g.isIntersecting)) {
          setGoster(true);
          gozlemci.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    gozlemci.observe(el);
    return () => gozlemci.disconnect();
  }, []);

  return (
    <div ref={kutu} className={className}>
      {goster ? (
        <iframe
          title={title}
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={iframeClassName}
        />
      ) : (
        <a
          href={aramaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full w-full items-center justify-center text-sm text-cream/50 hover:text-cream"
        >
          {title} — haritada aç
        </a>
      )}
    </div>
  );
}
