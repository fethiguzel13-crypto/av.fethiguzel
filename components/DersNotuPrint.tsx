'use client';

import { useEffect } from 'react';

/**
 * PDF sayfasında yazdırma / “PDF olarak kaydet” akışı.
 * Eski inline script regex'i bozuktu: /(?:[?&]print=|/pdf)/i → erken kapanıyordu.
 * `?print=1` burada okunur; sayfa statik üretildiği için sunucu sorgu dizgesini görmez.
 */
export function DersNotuPrintTrigger() {
  useEffect(() => {
    const print = new URLSearchParams(window.location.search).get('print');
    if (print !== '1' && print !== 'true') return;
    const t = window.setTimeout(() => {
      try {
        window.print();
      } catch {
        /* ignore */
      }
    }, 600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center justify-center rounded-full bg-accent-solid px-4 py-2.5 text-sm font-bold text-white hover:bg-accent-ink"
    >
      PDF olarak kaydet / Yazdır
    </button>
  );
}
