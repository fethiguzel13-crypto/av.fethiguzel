import { handleUyelik } from '@/lib/uyelik/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: Request, ctx: Ctx) {
    const { path } = await ctx.params;
    return handleUyelik(req, path || []);
}

export async function POST(req: Request, ctx: Ctx) {
    const { path } = await ctx.params;
    return handleUyelik(req, path || []);
}
