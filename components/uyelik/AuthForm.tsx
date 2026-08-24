'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { priceLabel } from '@/lib/uyelik/config';

const inp =
  'w-full rounded-2xl border border-charcoal/10 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent';

export default function AuthForm({ mode }: { mode: 'giris' | 'kayit' }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kvkk, setKvkk] = useState(false);
  const [dijitalIfa, setDijitalIfa] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const kayit = mode === 'kayit';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(kayit ? '/api/uyelik/kayit' : '/api/uyelik/giris', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          kayit
            ? { name, email, password, kvkk, dijitalIfa }
            : { email, password }
        ),
      });
      const raw = await res.text();
      let json: { ok?: boolean; error?: string; next?: string } = {};
      try {
        json = JSON.parse(raw) as { ok?: boolean; error?: string; next?: string };
      } catch {
        setError('Sunucu yanıt vermedi. Biraz sonra yeniden deneyin.');
        return;
      }
      if (!res.ok || !json.ok) {
        setError(json.error || 'İşlem tamamlanamadı.');
        return;
      }
      router.push(json.next || '/uyelik/odeme');
      router.refresh();
    } catch {
      setError('Bağlantı kurulamadı.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {kayit ? (
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-widest text-charcoal/45">Ad soyad</span>
          <input className={`${inp} mt-1.5`} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        </label>
      ) : null}
      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-widest text-charcoal/45">E-posta</span>
        <input
          type="email"
          className={`${inp} mt-1.5`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>
      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-widest text-charcoal/45">Şifre</span>
        <input
          type="password"
          className={`${inp} mt-1.5`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={kayit ? 8 : 1}
          autoComplete={kayit ? 'new-password' : 'current-password'}
        />
      </label>
      {kayit ? (
        <div className="space-y-3 text-[13px] text-charcoal/70 leading-relaxed">
          <label className="flex gap-2 items-start">
            <input type="checkbox" className="mt-1" checked={kvkk} onChange={(e) => setKvkk(e.target.checked)} />
            <span>
              <Link href="/gizlilik" className="text-accent font-semibold hover:underline">
                Gizlilik / KVKK
              </Link>{' '}
              metnini okudum; üyeliğin yürütülmesi için e-posta ve şifre kaydına açık rıza veriyorum.
            </span>
          </label>
          <label className="flex gap-2 items-start">
            <input
              type="checkbox"
              className="mt-1"
              checked={dijitalIfa}
              onChange={(e) => setDijitalIfa(e.target.checked)}
            />
            <span>
              Dijital içeriğin (karar metinleri) anında ifasını kabul ediyorum;{' '}
              <Link href="/uyelik/sozlesme" className="text-accent font-semibold hover:underline">
                mesafeli satış
              </Link>{' '}
              uyarınca cayma hakkımı kaybedeceğimi biliyorum. Aylık bedel {priceLabel()}.
            </span>
          </label>
        </div>
      ) : null}
      {error ? <p className="text-sm text-accent font-semibold">{error}</p> : null}
      <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
        {busy ? 'Gönderiliyor…' : kayit ? `Üye ol — ${priceLabel()}/ay` : 'Giriş yap'}
      </button>
    </form>
  );
}
