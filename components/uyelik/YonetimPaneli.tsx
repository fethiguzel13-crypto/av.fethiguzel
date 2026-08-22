'use client';

import { useState } from 'react';

type Row = {
  id: string;
  email: string;
  name: string;
  membershipUntil: string | null;
  pendingRef: string | null;
  lastPaymentKind: string | null;
};

export default function YonetimPaneli() {
  const [secret, setSecret] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<Row[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function call(body: Record<string, unknown>) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/uyelik/admin/aktifle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, ...body }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; users?: Row[]; user?: Row };
      if (!res.ok || !json.ok) {
        setMsg(json.error || 'İşlem başarısız.');
        return;
      }
      if (json.users) setUsers(json.users as Row[]);
      if (json.user) setMsg(`${json.user.email} için üyelik açıldı.`);
    } catch {
      setMsg('Bağlantı kurulamadı.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-widest text-charcoal/45">Yönetim anahtarı</span>
        <input
          type="password"
          className="mt-1.5 w-full rounded-2xl border border-charcoal/10 bg-white px-4 py-3 text-sm"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          disabled={busy || !secret}
          onClick={() => call({ list: true })}
          className="btn-primary disabled:opacity-60"
        >
          Üyeleri listele
        </button>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="aktif edilecek e-posta"
          className="flex-1 rounded-2xl border border-charcoal/10 bg-white px-4 py-3 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="button"
          disabled={busy || !secret || !email}
          onClick={() => call({ email })}
          className="shrink-0 border border-charcoal/15 px-4 py-3 rounded-2xl text-sm font-bold hover:border-accent hover:text-accent disabled:opacity-60"
        >
          30 gün aç
        </button>
      </div>
      {msg ? <p className="text-sm font-semibold text-accent">{msg}</p> : null}
      {users ? (
        <ul className="space-y-2 text-sm">
          {users.map((u) => (
            <li key={u.id} className="rounded-2xl bg-white border border-charcoal/10 p-4">
              <p className="font-bold">{u.name} · {u.email}</p>
              <p className="text-charcoal/50 text-[12px] mt-1">
                Bitiş: {u.membershipUntil ? new Date(u.membershipUntil).toLocaleDateString('tr-TR') : '—'}
                {u.pendingRef ? ` · havale ${u.pendingRef}` : ''}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
