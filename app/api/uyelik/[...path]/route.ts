import { NextResponse } from 'next/server';
import { handleUyelik } from '@/lib/uyelik/http';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ path: string[] }> };

async function run(req: Request, ctx: Ctx) {
    try {
        const { path } = await ctx.params;
        return await handleUyelik(req, path || []);
    } catch (e) {
        const msg = e instanceof Error ? e.message : 'Sunucu hatası';
        return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
}

export async function GET(req: Request, ctx: Ctx) {
    return run(req, ctx);
}

export async function POST(req: Request, ctx: Ctx) {
    return run(req, ctx);
}
