import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const kanunId = searchParams.get('kanun') || 'cek';
    const base =
        process.env.VERCEL_URL != null
            ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}`
            : 'https://avfethiguzel.com';

    const url = `${base}/content-packs/${kanunId}.json.gz`;
    try {
        const res = await fetch(url, { cache: 'no-store' });
        const ab = await res.arrayBuffer();
        const buf = Buffer.from(ab);
        const isGzip = buf.length >= 2 && buf[0] === 0x1f && buf[1] === 0x8b;
        let keys = 0;
        if (isGzip) {
            const { gunzipSync } = await import('zlib');
            const json = gunzipSync(buf).toString('utf8');
            keys = Object.keys(JSON.parse(json)).length;
        }
        return NextResponse.json({
            ok: res.ok,
            status: res.status,
            url,
            bytes: buf.length,
            isGzip,
            keys,
            vercelUrl: process.env.VERCEL_URL || null,
            vercelEnv: process.env.VERCEL_ENV || null,
        });
    } catch (e) {
        return NextResponse.json(
            {
                ok: false,
                url,
                error: e instanceof Error ? e.message : String(e),
                vercelUrl: process.env.VERCEL_URL || null,
            },
            { status: 500 }
        );
    }
}
