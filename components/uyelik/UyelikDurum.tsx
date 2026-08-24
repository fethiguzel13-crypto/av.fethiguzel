'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CikisButton from '@/components/uyelik/CikisButton';
import { priceLabel } from '@/lib/uyelik/config';
import type { PublicSession } from '@/lib/uyelik/types';

type Ben = {
    ok?: boolean;
    user?: PublicSession | null;
    member?: boolean;
};

export default function UyelikDurum() {
    const [ben, setBen] = useState<Ben | null>(null);

    useEffect(() => {
        let alive = true;
        fetch('/api/uyelik/ben', { credentials: 'same-origin' })
            .then((r) => r.json())
            .then((j: Ben) => {
                if (alive) setBen(j);
            })
            .catch(() => {
                if (alive) setBen({ ok: false, user: null, member: false });
            });
        return () => {
            alive = false;
        };
    }, []);

    if (!ben) {
        return <div className="mt-8 h-40 animate-pulse rounded-3xl bg-white border border-charcoal/10" />;
    }

    const user = ben.user;
    if (!user) {
        return (
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/uyelik/kayit" className="btn-primary justify-center">
                    Üye ol
                </Link>
                <Link
                    href="/uyelik/giris"
                    className="inline-flex items-center justify-center border border-charcoal/15 px-6 py-3.5 rounded-full text-sm font-bold hover:border-accent hover:text-accent"
                >
                    Giriş
                </Link>
            </div>
        );
    }

    return (
        <div className="mt-8 rounded-3xl bg-white border border-charcoal/10 p-6 space-y-3">
            <p className="text-sm">
                <span className="text-charcoal/45">Hesap:</span> <strong>{user.email}</strong>
            </p>
            <p className="text-sm">
                <span className="text-charcoal/45">Durum:</span>{' '}
                {ben.member
                    ? `Açık — ${user.membershipUntil ? new Date(user.membershipUntil).toLocaleDateString('tr-TR') : ''}`
                    : user.durum === 'pending'
                        ? `Havale bekleniyor (${user.pendingRef})`
                        : 'Kapalı'}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
                {ben.member ? (
                    <Link href="/yargi-kararlari" className="btn-primary">
                        Arşivi aç
                    </Link>
                ) : (
                    <Link href="/uyelik/odeme" className="btn-primary">
                        Ödeme — {priceLabel()}
                    </Link>
                )}
                <CikisButton />
            </div>
        </div>
    );
}
