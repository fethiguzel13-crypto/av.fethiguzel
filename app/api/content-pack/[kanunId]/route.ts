import { NextResponse } from 'next/server';
import { kanunKimligi, paketAdresleri } from '@/lib/paket-kaynak';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Serves {kanun}.json.gz for the mevzuat viewer.
 *
 * IMPORTANT: Do NOT use fs.existsSync/readFileSync with dynamic paths here.
 * Turbopack NFT treats those as <dynamic> and packs half the repo into the
 * lambda (notes + public/data + seo-madde ≈ 300MB) → Vercel deploy fails.
 *
 * Packs live under public/ and are served from the CDN / deployment static files.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ kanunId: string }> }
) {
  const { kanunId: raw } = await context.params;
  const kanunId = kanunKimligi(raw);
  if (!kanunId) {
    return NextResponse.json({ error: 'invalid kanunId' }, { status: 400 });
  }

  // Same-deploy host (preview URLs) + production mirrors; request Host is used only if trusted.
  const urls = paketAdresleri(request.url, kanunId);

  const tried: { url: string; status?: number; bytes?: number; error?: string }[] = [];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        // Packs change rarely; edge/CDN can cache.
        next: { revalidate: 3600 },
        headers: { Accept: 'application/gzip, application/octet-stream, */*' },
      });
      if (!res.ok) {
        tried.push({ url, status: res.status });
        continue;
      }
      const ab = await res.arrayBuffer();
      const bytes = ab.byteLength;
      tried.push({ url, status: res.status, bytes });
      if (bytes < 64) continue;
      return new NextResponse(ab, {
        status: 200,
        headers: {
          'Content-Type': 'application/gzip',
          'Content-Length': String(bytes),
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
          'X-Pack-Bytes': String(bytes),
          'X-Pack-Source': url,
        },
      });
    } catch (e) {
      // Internal error text stays in the server log, not in the public 404 body.
      console.error('[content-pack]', url, e instanceof Error ? e.message : String(e));
      tried.push({ url, error: 'unreachable' });
    }
  }

  return NextResponse.json(
    { error: 'pack not found', kanunId, tried },
    { status: 404 }
  );
}
