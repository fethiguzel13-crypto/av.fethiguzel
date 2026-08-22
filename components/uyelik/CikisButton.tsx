'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CikisButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch('/api/uyelik/cikis', { method: 'POST' });
        router.push('/');
        router.refresh();
      }}
      className="inline-flex items-center justify-center border border-charcoal/15 px-6 py-3.5 rounded-full text-sm font-bold hover:border-accent hover:text-accent disabled:opacity-60"
    >
      Çıkış
    </button>
  );
}
