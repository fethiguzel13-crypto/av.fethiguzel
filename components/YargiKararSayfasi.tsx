'use client';

import { useEffect, useState } from 'react';
import Link from "@/components/SiteLink";
import { useParams } from 'next/navigation';
import YargiPaywall from '@/components/YargiPaywall';
import YargiKararMetni from '@/components/YargiKararMetni';
import type { PublicSession } from '@/lib/uyelik/types';

type KararJson = {
    ok?: boolean;
    error?: string;
    text?: string;
};

// Künye, daire, tarih ve kararın başı sunucuda basılır (app/yargi-kararlari/[id]/page.tsx, G14 adım 4);
// bu bileşen yalnız üyelik kapısını ya da üyeye tam metni gösterir.
export default function YargiKararSayfasi() {
    const params = useParams();
    const id = String(params?.id || '');
    const [user, setUser] = useState<PublicSession | null>(null);
    const [member, setMember] = useState<boolean | null>(null);
    const [karar, setKarar] = useState<KararJson | null>(null);
    const [missing, setMissing] = useState(false);

    useEffect(() => {
        let alive = true;
        fetch('/api/uyelik/ben', { credentials: 'same-origin' })
            .then((r) => r.json())
            .then((j: { user?: PublicSession | null; member?: boolean }) => {
                if (!alive) return;
                setUser(j.user ?? null);
                setMember(Boolean(j.member));
            })
            .catch(() => {
                if (alive) {
                    setUser(null);
                    setMember(false);
                }
            });
        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        if (member !== true || !id) return;
        let alive = true;
        fetch(`/api/yargi/karar/${encodeURIComponent(id)}`, { credentials: 'same-origin' })
            .then(async (r) => {
                const j = (await r.json()) as KararJson;
                if (!alive) return;
                if (!r.ok || !j.ok) setMissing(true);
                else setKarar(j);
            })
            .catch(() => {
                if (alive) setMissing(true);
            });
        return () => {
            alive = false;
        };
    }, [member, id]);

    if (member === null) {
        return <div className="mt-8 h-56 animate-pulse rounded-2xl bg-charcoal/5" />;
    }

    if (!member) {
        return (
            <div className="mt-10">
                <YargiPaywall
                    user={user}
                    compact
                    kunye="Kararın tam metni üyelere açıktır. Metin sitede okunur; dosya indirme yoktur."
                />
            </div>
        );
    }

    if (missing) {
        return (
            <section className="mt-8 rounded-2xl bg-white border border-charcoal/10 p-6 sm:p-8">
                <p className="text-charcoal/60">Tam metin şu an yüklenemedi. Biraz sonra yeniden deneyin.</p>
                <Link href="/yargi-kararlari" className="mt-4 inline-block text-accent font-bold">
                    Arşive dön
                </Link>
            </section>
        );
    }

    if (!karar) {
        return <div className="mt-8 h-56 animate-pulse rounded-2xl bg-charcoal/5" />;
    }

    return (
        <>
            <YargiKararMetni text={karar.text || ''} />
            <div className="mt-8">
                <Link
                    href="/yargi-kararlari"
                    className="inline-flex items-center justify-center border border-charcoal/15 px-6 py-3 rounded-full text-sm font-bold text-charcoal hover:border-accent hover:text-accent"
                >
                    Arşive dön
                </Link>
            </div>
            <p className="mt-8 text-[12px] leading-relaxed text-charcoal/40">
                Künye ve metin Yargıtay resmi karar aramasından derlenmiştir. Bilgilendirme
                amaçlıdır; bağlayıcı olan kararın aslıdır. İndirme kapalıdır.
            </p>
        </>
    );
}
