'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OdemePaneli from '@/components/uyelik/OdemePaneli';
import { priceLabel } from '@/lib/uyelik/config';
import type { PublicSession } from '@/lib/uyelik/types';

export default function OdemeSayfasi() {
    const router = useRouter();
    const sp = useSearchParams();
    const durum = sp?.get('durum') || '';
    const [user, setUser] = useState<PublicSession | null | undefined>(undefined);
    const [iyzico, setIyzico] = useState(false);

    useEffect(() => {
        let alive = true;
        fetch('/api/uyelik/ben', { credentials: 'same-origin' })
            .then((r) => r.json())
            .then((j: { user?: PublicSession | null; member?: boolean; plan?: { iyzico?: boolean } }) => {
                if (!alive) return;
                if (j.member) {
                    router.replace('/yargi-kararlari');
                    return;
                }
                if (!j.user) {
                    router.replace('/uyelik/giris?next=/uyelik/odeme');
                    return;
                }
                setIyzico(Boolean(j.plan?.iyzico));
                setUser(j.user);
            })
            .catch(() => {
                if (alive) router.replace('/uyelik/giris?next=/uyelik/odeme');
            });
        return () => {
            alive = false;
        };
    }, [router]);

    if (!user) {
        return <div className="h-48 animate-pulse rounded-2xl bg-white border border-charcoal/10" />;
    }

    return (
        <>
            <p className="text-sm text-charcoal/55 mb-6">{user.email}</p>
            {durum === 'hata' ? (
                <p className="mb-4 text-sm font-semibold text-accent">Ödeme tamamlanamadı. Yeniden deneyin.</p>
            ) : null}
            {durum === 'hesap' ? (
                <p className="mb-4 text-sm font-semibold text-accent">Hesap eşleşmedi. Giriş yapıp tekrar deneyin.</p>
            ) : null}
            <p className="sr-only">{priceLabel()}</p>
            <OdemePaneli iyzicoReady={iyzico} havaleReady pendingRef={user.pendingRef} />
        </>
    );
}
