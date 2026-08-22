'use client';

import { useState } from 'react';
import Link from 'next/link';
import { priceLabel, UYELIK } from '@/lib/uyelik/config';

type Havale = {
  ref: string;
  amount: string;
  iban: string;
  hesapAdi: string;
  banka: string;
};

export default function OdemePaneli({
  iyzicoReady,
  havaleReady,
  pendingRef,
}: {
  iyzicoReady: boolean;
  havaleReady: boolean;
  pendingRef: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formHtml, setFormHtml] = useState<string | null>(null);
  const [havale, setHavale] = useState<Havale | null>(null);

  async function kartla() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/uyelik/odeme/baslat', { method: 'POST' });
      const json = (await res.json()) as { ok?: boolean; error?: string; checkoutFormContent?: string };
      if (!res.ok || !json.ok || !json.checkoutFormContent) {
        setError(json.error || 'Kart formu açılamadı.');
        return;
      }
      setFormHtml(json.checkoutFormContent);
    } catch {
      setError('Bağlantı kurulamadı.');
    } finally {
      setBusy(false);
    }
  }

  async function havaleAl() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/uyelik/havale', { method: 'POST' });
      const json = (await res.json()) as Havale & { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error || 'Havale talimatı üretilemedi.');
        return;
      }
      setHavale(json);
    } catch {
      setError('Bağlantı kurulamadı.');
    } finally {
      setBusy(false);
    }
  }

  const ref = havale?.ref || pendingRef;

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-charcoal text-cream p-8">
        <p className="text-[11px] font-mono uppercase tracking-widest text-accent">Aylık plan</p>
        <p className="mt-2 text-4xl font-heading font-bold">
          {priceLabel()}
          <span className="text-base font-sans text-cream/50 ml-2">/ {UYELIK.periodDays} gün</span>
        </p>
        <p className="mt-3 text-sm text-cream/60 leading-relaxed">
          Yargıtay arşivini sitede okuma. İndirme yok. Bu tutar avukatlık ücreti değildir.
        </p>
      </div>

      {iyzicoReady && !formHtml ? (
        <button type="button" onClick={kartla} disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? 'Açılıyor…' : 'Kart ile öde'}
        </button>
      ) : null}

      {formHtml ? (
        <div className="rounded-3xl bg-white border border-charcoal/10 p-4 overflow-hidden">
          <div id="iyzipay-checkout-form" className="popup" dangerouslySetInnerHTML={{ __html: formHtml }} />
        </div>
      ) : null}

      {havaleReady || !iyzicoReady ? (
        <div className="rounded-3xl bg-white border border-charcoal/10 p-6">
          <h2 className="font-heading font-bold text-lg">Havale / EFT</h2>
          <p className="mt-2 text-sm text-charcoal/60 leading-relaxed">
            {priceLabel()} gönderin; açıklamaya aşağıdaki referansı yazın. Onay sonrası
            {` ${UYELIK.periodDays} `}
            günlük erişim açılır.
          </p>
          {!havale && !ref ? (
            <button
              type="button"
              onClick={havaleAl}
              disabled={busy}
              className="mt-4 inline-flex items-center justify-center border border-charcoal/15 px-5 py-2.5 rounded-full text-sm font-bold hover:border-accent hover:text-accent disabled:opacity-60"
            >
              Havale referansı al
            </button>
          ) : null}
          {(havale || ref) && (
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4 border-b border-charcoal/5 py-2">
                <dt className="text-charcoal/45">Tutar</dt>
                <dd className="font-bold">{havale?.amount || priceLabel()}</dd>
              </div>
              {havale?.hesapAdi ? (
                <div className="flex justify-between gap-4 border-b border-charcoal/5 py-2">
                  <dt className="text-charcoal/45">Hesap adı</dt>
                  <dd className="font-semibold text-right">{havale.hesapAdi}</dd>
                </div>
              ) : null}
              {havale?.banka ? (
                <div className="flex justify-between gap-4 border-b border-charcoal/5 py-2">
                  <dt className="text-charcoal/45">Banka</dt>
                  <dd className="font-semibold">{havale.banka}</dd>
                </div>
              ) : null}
              {havale?.iban ? (
                <div className="flex justify-between gap-4 border-b border-charcoal/5 py-2">
                  <dt className="text-charcoal/45">IBAN</dt>
                  <dd className="font-mono text-[13px]">{havale.iban}</dd>
                </div>
              ) : (
                <p className="text-[13px] text-charcoal/55 pt-2">
                  IBAN henüz panelde yoksa tutarı{' '}
                  <a href="mailto:fethiguzel@hotmail.com" className="text-accent font-semibold">
                    fethiguzel@hotmail.com
                  </a>{' '}
                  üzerinden sorun; açıklamaya referansı yazın.
                </p>
              )}
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-charcoal/45">Açıklama</dt>
                <dd className="font-mono font-bold text-accent">{ref}</dd>
              </div>
            </dl>
          )}
        </div>
      ) : null}

      {error ? <p className="text-sm text-accent font-semibold">{error}</p> : null}

      <p className="text-[12px] text-charcoal/40 leading-relaxed">
        <Link href="/uyelik/sozlesme" className="text-accent hover:underline">
          Mesafeli satış sözleşmesi
        </Link>
        {' · '}
        <Link href="/gizlilik" className="text-accent hover:underline">
          KVKK
        </Link>
      </p>
    </div>
  );
}
