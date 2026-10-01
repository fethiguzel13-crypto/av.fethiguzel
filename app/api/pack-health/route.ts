import { NextResponse } from 'next/server';
import { kanunKimligi } from '@/lib/paket-kaynak';
import { clientIp, rateLimit } from '@/lib/uyelik/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Her çağrı bir paketi baştan indirip açar; sınırsız çağrı fonksiyon ve bant kullanımını büyütür (G04/B8).
const SINIR = 20;
const PENCERE = 60 * 60 * 1000;

export async function GET(request: Request) {
    if (!rateLimit(`pack-health:${clientIp(request)}`, SINIR, PENCERE)) {
        return NextResponse.json({ ok: false, error: 'Çok fazla istek.' }, { status: 429 });
    }
    const { searchParams } = new URL(request.url);
    const kanunId = kanunKimligi(searchParams.get('kanun') || 'cek');
    if (!kanunId) {
        return NextResponse.json({ ok: false, error: 'Geçersiz kanun.' }, { status: 400 });
    }
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
        // Dağıtım adresi ve ortam adı yanıta yazılmaz; önizleme adresleri koruma dışı kalabilir.
        return NextResponse.json({
            ok: res.ok,
            status: res.status,
            kanun: kanunId,
            bytes: buf.length,
            isGzip,
            keys,
        });
    } catch (e) {
        console.error('[pack-health]', url, e instanceof Error ? e.message : String(e));
        return NextResponse.json({ ok: false, kanun: kanunId, error: 'Paket okunamadı.' }, { status: 500 });
    }
}
