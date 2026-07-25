import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Serves content-packs/{kanun}.json.gz for the mevzuat viewer.
 * Bypasses poisoned CDN cache of empty static stubs.
 */
export async function GET(
    _request: Request,
    context: { params: Promise<{ kanunId: string }> }
) {
    const { kanunId: raw } = await context.params;
    const kanunId = String(raw || '')
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '');
    if (!kanunId || kanunId.length > 64) {
        return NextResponse.json({ error: 'invalid kanunId' }, { status: 400 });
    }

    const file = `${kanunId}.json.gz`;
    const candidates = [
        join(process.cwd(), 'public', 'content-packs', file),
        join(process.cwd(), 'content-packs', file),
    ];

    for (const p of candidates) {
        if (!existsSync(p)) continue;
        const buf = readFileSync(p);
        if (buf.length < 64) continue; // skip empty gzip stubs
        return new NextResponse(new Uint8Array(buf), {
            status: 200,
            headers: {
                'Content-Type': 'application/gzip',
                'Content-Length': String(buf.length),
                'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
                'X-Pack-Source': p.includes(`${join('public', 'content-packs')}`)
                    ? 'public'
                    : 'content-packs',
                'X-Pack-Bytes': String(buf.length),
            },
        });
    }

    return NextResponse.json(
        { error: 'pack not found', kanunId, tried: candidates.map((c) => c.split(/[/\\]/).slice(-3).join('/')) },
        { status: 404 }
    );
}
