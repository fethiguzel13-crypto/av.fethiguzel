import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getAccess } from '@/lib/uyelik/session';
import { clientIp, rateLimit } from '@/lib/uyelik/rate-limit';
import { findKararRow, loadKararText } from '@/lib/uyelik/karar-text';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ path: string[] }> };

// Üye başına 10 dakikada: 300 karar metni, 30 indeks indirmesi. Okuma için bol; tek üyelikle toplu
// çekimi ve Yargıtay'a giden canlı istek yağmurunu keser (G04/B10).
const PENCERE = 10 * 60 * 1000;
const KARAR_SINIRI = 300;
const INDEKS_SINIRI = 30;

function cokFazla() {
    return NextResponse.json(
        { ok: false, error: 'Çok fazla istek. Birkaç dakika sonra yeniden deneyin.' },
        { status: 429, headers: { 'Retry-After': '600' } }
    );
}

export async function GET(req: Request, ctx: Ctx) {
    const { path } = await ctx.params;
    const [a, b] = path || [];
    const { member, session } = await getAccess();
    if (!member) {
        return NextResponse.json(
            { ok: false, error: 'Yargıtay arşivi üyelik gerektirir.', next: '/uyelik' },
            { status: 401 }
        );
    }

    const kimlik = session?.uid || clientIp(req);

    if (a === 'index' && !b) {
        if (!rateLimit(`yargi-index:${kimlik}`, INDEKS_SINIRI, PENCERE)) return cokFazla();
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
        if (!rateLimit(`yargi-karar:${kimlik}`, KARAR_SINIRI, PENCERE)) return cokFazla();
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
