'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/uyelik/AuthForm';

export default function AuthGate({ mode }: { mode: 'giris' | 'kayit' }) {
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let alive = true;
        fetch('/api/uyelik/ben', { credentials: 'same-origin' })
            .then((r) => r.json())
            .then((j: { member?: boolean; user?: unknown }) => {
                if (!alive) return;
                if (j.member) {
                    router.replace('/yargi-kararlari');
                    return;
                }
                if (j.user) {
                    router.replace('/uyelik/odeme');
                    return;
                }
                setReady(true);
            })
            .catch(() => {
                if (alive) setReady(true);
            });
        return () => {
            alive = false;
        };
    }, [router]);

    if (!ready) {
        return <div className="h-48 animate-pulse rounded-2xl bg-white border border-charcoal/10" />;
    }
    return <AuthForm mode={mode} />;
}
