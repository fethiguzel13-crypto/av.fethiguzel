import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getAccess } from '@/lib/uyelik/session';
import { findKararRow, loadKararText } from '@/lib/uyelik/karar-text';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(_req: Request, ctx: Ctx) {
    const { path } = await ctx.params;
    const [a, b] = path || [];
    const { member } = await getAccess();
    if (!member) {
        return NextResponse.json(
            { ok: false, error: 'Yargıtay arşivi üyelik gerektirir.', next: '/uyelik' },
            { status: 401 }
        );
    }

    if (a === 'index' && !b) {
        const p = join(process.cwd(), 'public', 'data', 'yargi-index.json.gz');
        if (!existsSync(p)) {
            return NextResponse.json({ ok: false, error: 'Arşiv indeksi yok.' }, { status: 404 });
        }
        const buf = readFileSync(p);
        return new NextResponse(buf, {
            status: 200,
            headers: {
                'Content-Type': 'application/gzip',
                'Cache-Control': 'private, no-store',
                'X-Content-Type-Options': 'nosniff',
            },
        });
    }

    if (a === 'karar' && b) {
        if (!/^[0-9A-Za-z._-]{3,64}$/.test(b)) {
            return NextResponse.json({ ok: false, error: 'Geçersiz künye.' }, { status: 400 });
        }
        const row = findKararRow(b);
        if (!row) {
            return NextResponse.json({ ok: false, error: 'Karar bulunamadı.' }, { status: 404 });
        }
        const text = await loadKararText(b, row);
        return NextResponse.json(
            {
                ok: true,
                id: row.i,
                kunye: row.k,
                daire: row.d,
                tarih: row.t,
                excerpt: row.e,
                text,
                download: false,
            },
            {
                headers: {
                    'Cache-Control': 'private, no-store',
                    'X-Content-Type-Options': 'nosniff',
                },
            }
        );
    }

    return NextResponse.json({ ok: false, error: 'Bulunamadı.' }, { status: 404 });
}
