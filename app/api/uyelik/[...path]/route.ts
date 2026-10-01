import { NextResponse } from 'next/server';
import { handleUyelik } from '@/lib/uyelik/http';

// Edge çalışma ortamı Next 16'da kullanımdan kalktı; lib/uyelik Node'un Web Crypto'su ve node:crypto ile çalışır.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ path: string[] }> };

async function run(req: Request, ctx: Ctx) {
    try {
        const { path } = await ctx.params;
        return await handleUyelik(req, path || []);
    } catch (e) {
        // İç hata metni (depo, ödeme sağlayıcısı) istemciye verilmez; sunucu logunda kalır.
        console.error('[uyelik]', e instanceof Error ? e.message : String(e));
        return NextResponse.json({ ok: false, error: 'Sunucu hatası. Biraz sonra yeniden deneyin.' }, { status: 500 });
    }
}

export async function GET(req: Request, ctx: Ctx) {
    return run(req, ctx);
}

export async function POST(req: Request, ctx: Ctx) {
    return run(req, ctx);
}
