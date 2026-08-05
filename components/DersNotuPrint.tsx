'use client';

import { useEffect } from 'react';

/**
 * PDF sayfasında yazdırma / “PDF olarak kaydet” akışı.
 * Eski inline script regex'i bozuktu: /(?:[?&]print=|/pdf)/i → erken kapanıyordu.
 */
export function DersNotuPrintTrigger({ auto = false }: { auto?: boolean }) {
  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => {
      try {
        window.print();
      } catch {
        /* ignore */
      }
    }, 600);
    return () => window.clearTimeout(t);
  }, [auto]);

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-accent/90"
    >
      PDF olarak kaydet / Yazdır
    </button>
  );
}
