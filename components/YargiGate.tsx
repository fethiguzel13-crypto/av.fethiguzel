'use client';

import { useEffect, useState } from 'react';
import YargiArchiveClient from '@/components/YargiArchiveClient';
import YargiPaywall from '@/components/YargiPaywall';
import type { PublicSession } from '@/lib/uyelik/types';

export default function YargiGate() {
    const [state, setState] = useState<'load' | 'member' | 'anon'>('load');
    const [user, setUser] = useState<PublicSession | null>(null);
    const [total, setTotal] = useState<number | undefined>(undefined);

    useEffect(() => {
        let alive = true;
        Promise.all([
            fetch('/api/uyelik/ben', { credentials: 'same-origin' })
                .then((r) => r.json())
                .catch(() => null),
            fetch('/data/yargi-stats.json')
                .then((r) => (r.ok ? r.json() : {}))
                .catch(() => ({})),
        ]).then(([ben, stats]: [{ member?: boolean; user?: PublicSession | null } | null, { total?: number }]) => {
            if (!alive) return;
            setUser(ben?.user ?? null);
            setTotal(typeof stats?.total === 'number' ? stats.total : undefined);
            setState(ben?.member ? 'member' : 'anon');
        });
        return () => {
            alive = false;
        };
    }, []);

    if (state === 'load') {
        return <div className="h-56 animate-pulse rounded-[2rem] bg-charcoal/5" />;
    }
    if (state === 'member') return <YargiArchiveClient />;
    return <YargiPaywall total={total} user={user} />;
}
