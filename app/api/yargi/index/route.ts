import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getAccess } from '@/lib/uyelik/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const { member } = await getAccess();
  if (!member) {
    return NextResponse.json(
      { ok: false, error: 'Yargıtay arşivi üyelik gerektirir.', next: '/uyelik' },
      { status: 401 }
    );
  }
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
