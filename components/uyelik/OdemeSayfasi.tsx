'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OdemePaneli from '@/components/uyelik/OdemePaneli';
import { priceLabel } from '@/lib/uyelik/config';
import type { PublicSession } from '@/lib/uyelik/types';

type Plan = { kart?: boolean; iyzico?: boolean; kartTest?: boolean; havale?: boolean };

export default function OdemeSayfasi() {
    const router = useRouter();
    const sp = useSearchParams();
    const durum = sp?.get('durum') || '';
    const [user, setUser] = useState<PublicSession | null | undefined>(undefined);
    const [plan, setPlan] = useState<Plan>({});

    useEffect(() => {
        let alive = true;
        fetch('/api/uyelik/ben', { credentials: 'same-origin' })
            .then((r) => r.json())
            .then((j: { user?: PublicSession | null; member?: boolean; plan?: Plan }) => {
                if (!alive) return;
                if (j.member) {
                    router.replace('/yargi-kararlari');
                    return;
                }
                if (!j.user) {
                    router.replace('/uyelik/giris?next=/uyelik/odeme');
                    return;
                }
                setPlan(j.plan || {});
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
            <OdemePaneli
                kartReady={Boolean(plan.kart ?? plan.iyzico)}
                havaleReady={Boolean(plan.havale)}
                testModu={Boolean(plan.kartTest)}
                pendingRef={user.pendingRef}
            />
        </>
    );
}
