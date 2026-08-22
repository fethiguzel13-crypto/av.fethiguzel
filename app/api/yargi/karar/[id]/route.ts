import { NextResponse } from 'next/server';
import { getAccess } from '@/lib/uyelik/session';
import { findKararRow, loadKararText } from '@/lib/uyelik/karar-text';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { member } = await getAccess();
  if (!member) {
    return NextResponse.json(
      { ok: false, error: 'Yargıtay arşivi üyelik gerektirir.', next: '/uyelik' },
      { status: 401 }
    );
  }
  const { id } = await params;
  if (!/^[0-9A-Za-z._-]{3,64}$/.test(id)) {
    return NextResponse.json({ ok: false, error: 'Geçersiz künye.' }, { status: 400 });
  }
  const row = findKararRow(id);
  if (!row) {
    return NextResponse.json({ ok: false, error: 'Karar bulunamadı.' }, { status: 404 });
  }
  const text = await loadKararText(id, row);
  return NextResponse.json(
    {
      ok: true,
      id: row.i,
      kunye: row.k,
      daire: row.d,
      tarih: row.t,
      excerpt: row.e,
      text,
      download: false,
    },
    {
      headers: {
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}
