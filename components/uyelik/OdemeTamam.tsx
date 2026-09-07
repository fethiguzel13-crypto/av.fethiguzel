'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DENEME = 5;

export default function OdemeTamam() {
    const router = useRouter();
    const [member, setMember] = useState<boolean | null>(null);

    useEffect(() => {
        let alive = true;
        let timer: ReturnType<typeof setTimeout> | undefined;

        // Ödeme onayı ile üye kaydının yazılması arasında kısa bir gecikme
        // olabildiğinden birkaç kez yoklanır; ilk «kapalı» yanıtı sonuç sayılmaz.
        async function bak(kalan: number): Promise<void> {
            try {
                const r = await fetch('/api/uyelik/ben', { credentials: 'same-origin', cache: 'no-store' });
                const j = (await r.json()) as { user?: unknown; member?: boolean };
                if (!alive) return;
                if (!j.user) {
                    router.replace('/uyelik/giris');
                    return;
                }
                if (j.member || kalan <= 0) {
                    setMember(Boolean(j.member));
                    return;
                }
            } catch {
                if (!alive) return;
                if (kalan <= 0) {
                    router.replace('/uyelik/giris');
                    return;
                }
            }
            timer = setTimeout(() => void bak(kalan - 1), 1200);
        }

        void bak(DENEME);
        return () => {
            alive = false;
            if (timer) clearTimeout(timer);
        };
    }, [router]);

    if (member === null) {
        return (
            <>
                <div className="h-40 animate-pulse rounded-2xl bg-white border border-charcoal/10" />
                <p className="mt-4 text-sm text-charcoal/50">Ödeme doğrulanıyor…</p>
            </>
        );
    }

    return (
        <>
            <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">Tamam</p>
            <h1 className="text-3xl font-heading font-bold text-charcoal">
                {member ? 'Arşiv açık.' : 'Ödeme alındı, erişim hazırlanıyor.'}
            </h1>
            <p className="mt-3 text-sm text-charcoal/60 leading-relaxed">
                {member
                    ? 'Karar metinleri sitede okunur; indirme yoktur.'
                    : 'Tahsilat tamamlandı; erişim birkaç dakika içinde açılır. Sayfayı yenilemeniz yeterli, açılmazsa fethiguzel@hotmail.com adresine yazın.'}
            </p>
            <Link href={member ? '/yargi-kararlari' : '/uyelik'} className="btn-primary mt-8 inline-flex">
                {member ? 'Arşive git' : 'Hesabıma dön'}
            </Link>
        </>
    );
}
