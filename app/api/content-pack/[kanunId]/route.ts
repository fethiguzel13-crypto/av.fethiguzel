import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Serves {kanun}.json.gz for the mevzuat viewer.
 * Prefer public/packs (cache-bust path), then content-packs, skip empty stubs.
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
    const cwd = process.cwd();
    const candidates = [
        join(cwd, 'public', 'packs', file),
        join(cwd, 'public', 'content-packs', file),
        join(cwd, 'content-packs', file),
    ];

    const tried: { path: string; exists: boolean; bytes?: number }[] = [];

    try {
        for (const p of candidates) {
            const exists = existsSync(p);
            if (!exists) {
                tried.push({ path: p, exists: false });
                continue;
            }
            const buf = readFileSync(p);
            tried.push({ path: p, exists: true, bytes: buf.length });
            if (buf.length < 64) continue;
            return new NextResponse(buf, {
                status: 200,
                headers: {
                    'Content-Type': 'application/gzip',
                    'Content-Length': String(buf.length),
                    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
                    'X-Pack-Bytes': String(buf.length),
                },
            });
        }
    } catch (e) {
        return NextResponse.json(
            {
                error: e instanceof Error ? e.message : String(e),
                kanunId,
                cwd,
                tried,
            },
            { status: 500 }
        );
    }

    return NextResponse.json({ error: 'pack not found', kanunId, cwd, tried }, { status: 404 });
}
