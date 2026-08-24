'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import YargiPaywall from '@/components/YargiPaywall';
import YargiKararMetni from '@/components/YargiKararMetni';
import type { PublicSession } from '@/lib/uyelik/types';

const TIER_LABEL: Record<string, string> = {
    yibk: 'İçtihadı Birleştirme',
    hgk: 'Hukuk Genel Kurulu',
    cgk: 'Ceza Genel Kurulu',
};

type KararJson = {
    ok?: boolean;
    error?: string;
    kunye?: string;
    daire?: string;
    tarih?: string;
    excerpt?: string;
    text?: string;
};

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
        return <div className="h-56 animate-pulse rounded-2xl bg-charcoal/5" />;
    }

    if (!member) {
        return (
            <div className="mt-10">
                <YargiPaywall user={user} compact kunye={id ? `Karar ${id}` : undefined} />
            </div>
        );
    }

    if (missing) {
        return (
            <>
                <h1 className="text-2xl font-heading font-bold">Karar bulunamadı</h1>
                <p className="mt-3 text-charcoal/60">Bu künye arşivde yok.</p>
                <Link href="/yargi-kararlari" className="mt-6 inline-block text-accent font-bold">
                    Arşive dön
                </Link>
            </>
        );
    }

    if (!karar) {
        return <div className="h-56 animate-pulse rounded-2xl bg-charcoal/5" />;
    }

    return (
        <article>
            <p className="text-[11px] font-mono uppercase tracking-widest text-accent">
                {TIER_LABEL[String(karar.daire || '')] || karar.daire} · {karar.tarih}
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-heading font-bold leading-snug text-charcoal">
                {karar.kunye}
            </h1>
            {karar.daire ? <p className="mt-2 text-charcoal/55">{karar.daire}</p> : null}
            <YargiKararMetni text={karar.text || ''} excerpt={karar.excerpt} />
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
        </article>
    );
}
