'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OdemeTamam() {
    const router = useRouter();
    const [member, setMember] = useState<boolean | null>(null);

    useEffect(() => {
        let alive = true;
        fetch('/api/uyelik/ben', { credentials: 'same-origin' })
            .then((r) => r.json())
            .then((j: { user?: unknown; member?: boolean }) => {
                if (!alive) return;
                if (!j.user) {
                    router.replace('/uyelik/giris');
                    return;
                }
                setMember(Boolean(j.member));
            })
            .catch(() => {
                if (alive) router.replace('/uyelik/giris');
            });
        return () => {
            alive = false;
        };
    }, [router]);

    if (member === null) {
        return <div className="h-40 animate-pulse rounded-2xl bg-white border border-charcoal/10" />;
    }

    return (
        <>
            <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">Tamam</p>
            <h1 className="text-3xl font-heading font-bold text-charcoal">
                {member ? 'Arşiv açık.' : 'Ödeme alındı, onay bekleniyor.'}
            </h1>
            <p className="mt-3 text-sm text-charcoal/60 leading-relaxed">
                {member
                    ? 'Karar metinleri sitede okunur; indirme yoktur.'
                    : 'Havale onaylanınca erişim açılır. Aynı tarayıcıda oturumunuz duruyor.'}
            </p>
            <Link href={member ? '/yargi-kararlari' : '/uyelik'} className="btn-primary mt-8 inline-flex">
                {member ? 'Arşive git' : 'Hesabıma dön'}
            </Link>
        </>
    );
}
