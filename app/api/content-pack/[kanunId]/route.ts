import { NextResponse } from 'next/server';

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
  const kanunId = String(raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
  if (!kanunId || kanunId.length > 64) {
    return NextResponse.json({ error: 'invalid kanunId' }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const file = `${encodeURIComponent(kanunId)}.json.gz`;
  const urls = [
    `${origin}/packs/${file}`,
    `${origin}/content-packs/${file}`,
    // Same-deploy host (preview URLs) + production mirrors
    ...(process.env.VERCEL_URL
      ? [
          `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}/packs/${file}`,
          `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}/content-packs/${file}`,
        ]
      : []),
    `https://www.avfethiguzel.com/content-packs/${file}`,
    `https://cdn.jsdelivr.net/gh/fethiguzel13-crypto/av.fethiguzel@main/content-packs/${file}`,
  ];

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
      tried.push({
        url,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return NextResponse.json(
    { error: 'pack not found', kanunId, tried },
    { status: 404 }
  );
}
