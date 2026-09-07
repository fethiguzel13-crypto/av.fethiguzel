'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { priceLabel, UYELIK } from '@/lib/uyelik/config';

type Havale = {
  ref: string;
  amount: string;
  iban: string;
  hesapAdi: string;
  banka: string;
};

const KARTLAR = ['Visa', 'Mastercard', 'Troy', 'Amex'];

/**
 * iyzico'nun döndürdüğü `checkoutFormContent` bir <script> bloğudur.
 * React'in `dangerouslySetInnerHTML` yolu ile basılan script etiketleri
 * tarayıcıda ÇALIŞMAZ; form hiç görünmez. Bu yüzden düğümler yeniden
 * kurulup DOM'a öyle ekleniyor.
 */
function icerigiCalistir(hedef: HTMLElement, html: string): void {
  hedef.innerHTML = '';
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  for (const node of Array.from(tpl.content.childNodes)) {
    if (node.nodeName === 'SCRIPT') {
      const eski = node as HTMLScriptElement;
      const yeni = document.createElement('script');
      for (const attr of Array.from(eski.attributes)) yeni.setAttribute(attr.name, attr.value);
      yeni.text = eski.text;
      hedef.appendChild(yeni);
    } else {
      hedef.appendChild(node.cloneNode(true));
    }
  }
}

export default function OdemePaneli({
  kartReady,
  havaleReady,
  testModu = false,
  pendingRef,
}: {
  kartReady: boolean;
  havaleReady: boolean;
  testModu?: boolean;
  pendingRef: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formHtml, setFormHtml] = useState<string | null>(null);
  const [onay, setOnay] = useState(false);
  const [havale, setHavale] = useState<Havale | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!formHtml || !formRef.current) return;
    icerigiCalistir(formRef.current, formHtml);
    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [formHtml]);

  const kartla = useCallback(async () => {
    if (!onay) {
      setError('Devam etmek için sözleşme onayını işaretleyin.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/uyelik/odeme/baslat', {
        method: 'POST',
        credentials: 'same-origin',
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        next?: string;
        already?: boolean;
        checkoutFormContent?: string;
      };
      if (json.already && json.next) {
        window.location.href = json.next;
        return;
      }
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
  }, [onay]);

  async function havaleAl() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/uyelik/havale', { method: 'POST', credentials: 'same-origin' });
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
        {kartReady ? (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {KARTLAR.map((k) => (
              <span
                key={k}
                className="rounded-md border border-cream/20 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-cream/70"
              >
                {k}
              </span>
            ))}
            <span className="text-[11px] text-cream/45 ml-1">tek çekim · 3D Secure</span>
          </div>
        ) : null}
      </div>

      {testModu ? (
        <p className="rounded-2xl border border-accent/30 bg-accent/5 px-4 py-3 text-[13px] leading-relaxed text-charcoal/75">
          <strong className="font-bold">Test modu.</strong> Kart formu iyzico sandbox ortamına bağlı;
          gerçek tahsilat yapılmaz. Canlı anahtarlar tanımlanınca bu uyarı kendiliğinden kalkar.
        </p>
      ) : null}

      {kartReady && !formHtml ? (
        <div className="rounded-3xl bg-white border border-charcoal/10 p-6">
          <h2 className="font-heading font-bold text-lg">Kredi / banka kartı</h2>
          <p className="mt-2 text-sm text-charcoal/60 leading-relaxed">
            Kart bilgileri iyzico ödeme sayfasında girilir ve bu siteye hiçbir aşamada gelmez.
            Onay anında {UYELIK.periodDays} günlük erişim açılır.
          </p>

          <label className="mt-5 flex items-start gap-3 text-[13px] leading-relaxed text-charcoal/70 cursor-pointer">
            <input
              type="checkbox"
              checked={onay}
              onChange={(e) => {
                setOnay(e.target.checked);
                if (e.target.checked) setError(null);
              }}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#CC5833]"
            />
            <span>
              <Link href="/uyelik/sozlesme" className="text-accent font-semibold hover:underline">
                Mesafeli satış sözleşmesini
              </Link>{' '}
              ve ön bilgilendirme metnini okudum; dijital içeriğin ödeme sonrası derhal ifasını
              kabul ediyorum.
            </span>
          </label>

          <button
            type="button"
            onClick={kartla}
            disabled={busy || !onay}
            className="btn-primary w-full mt-5 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? 'Açılıyor…' : `Kart ile öde — ${priceLabel()}`}
          </button>
          <p className="mt-3 text-[11px] text-charcoal/40 text-center">
            Ödeme altyapısı: iyzico · 256-bit SSL · kart verisi saklanmaz
          </p>
        </div>
      ) : null}

      {formHtml ? (
        <div className="rounded-3xl bg-white border border-charcoal/10 p-4 overflow-hidden">
          <div ref={formRef} id="iyzipay-checkout-form" className="responsive" />
          <button
            type="button"
            onClick={() => {
              setFormHtml(null);
              setOnay(false);
            }}
            className="mt-3 w-full text-[12px] text-charcoal/45 hover:text-accent"
          >
            Vazgeç
          </button>
        </div>
      ) : null}

      {!kartReady && !havaleReady ? (
        <div className="rounded-3xl bg-white border border-charcoal/10 p-6">
          <h2 className="font-heading font-bold text-lg">Ödeme şu an alınamıyor</h2>
          <p className="mt-2 text-sm text-charcoal/60 leading-relaxed">
            Kart ödemesi kısa süre içinde açılacak. Erişim açtırmak için{' '}
            <a href="mailto:fethiguzel@hotmail.com" className="text-accent font-semibold">
              fethiguzel@hotmail.com
            </a>{' '}
            adresine yazabilirsiniz.
          </p>
        </div>
      ) : null}

      {havaleReady ? (
        <div className="rounded-3xl bg-white border border-charcoal/10 p-6">
          <h2 className="font-heading font-bold text-lg">
            {kartReady ? 'Alternatif: havale / EFT' : 'Havale / EFT'}
          </h2>
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
