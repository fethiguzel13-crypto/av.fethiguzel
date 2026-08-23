import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import YargiPaywall from '@/components/YargiPaywall';
import YargiKararMetni from '@/components/YargiKararMetni';
import { getAccess } from '@/lib/uyelik/session';
import { findKararRow, loadKararText } from '@/lib/uyelik/karar-text';

/*
  Oturum çerezi burada TAZELENMEZ.

  Bu sayfa bir Server Component; Next.js render sırasında çerez yazmayı
  yasaklar ve cookies().set() çağrısı isteği 500e düşürür. Hata yalnız
  OTURUM AÇMIŞ ziyaretçide görülüyordu: anonim ziyaretçide user boş olduğu
  için satır hiç çalışmıyor, üyede ise sayfa her açılışta, yani her
  yenilemede patlıyordu.

  Tazeleme buna izin verilen tek yere taşındı: /api/uyelik/ben route
  handler. Çerezin ömrü zaten girişte 180 güne kuruluyor; sayfa görüntüsü
  başına yeniden yazmanın işlevsel bir karşılığı yoktu.
*/

export const dynamic = 'force-dynamic';

const TIER_LABEL: Record<string, string> = {
  yibk: 'İçtihadı Birleştirme',
  hgk: 'Hukuk Genel Kurulu',
  cgk: 'Ceza Genel Kurulu',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const row = findKararRow(id);
  const title = row?.k || 'Yargıtay kararı';
  return {
    title: `${title} | Yargıtay Arşivi`,
    description: row?.e || `${row?.d || 'Yargıtay'} kararı — Av. Fethi Güzel arşivi.`,
    alternates: { canonical: `https://www.avfethiguzel.com/yargi-kararlari/${id}` },
  };
}

export default async function YargiKararPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = findKararRow(id);
  const { member, publicUser, user } = await getAccess();

  if (!row) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-cream pt-36 pb-20 px-5">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-heading font-bold">Karar bulunamadı</h1>
            <p className="mt-3 text-charcoal/60">Bu künye arşivde yok.</p>
            <Link href="/yargi-kararlari" className="mt-6 inline-block text-accent font-bold">
              Arşive dön
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const text = member ? await loadKararText(id, row) : '';

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream pt-36 pb-20 px-5 sm:px-6">
        <article className="max-w-3xl mx-auto">
          <p className="text-[11px] font-mono uppercase tracking-widest text-accent">
            {TIER_LABEL[row.r] || row.d} · {row.t}
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-heading font-bold leading-snug text-charcoal">
            {row.k}
          </h1>
          {row.d ? <p className="mt-2 text-charcoal/55">{row.d}</p> : null}

          {member ? (
            <>
              {row.w?.length ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {row.w.map((w) => (
                    <li
                      key={w}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent"
                    >
                      {w}
                    </li>
                  ))}
                </ul>
              ) : null}
              <YargiKararMetni text={text} excerpt={row.e} />
              <div className="mt-8">
                <Link
                  href="/yargi-kararlari"
                  className="inline-flex items-center justify-center border border-charcoal/15 px-6 py-3 rounded-full text-sm font-bold text-charcoal hover:border-accent hover:text-accent"
                >
                  Arşive dön
                </Link>
              </div>
              <p className="mt-8 text-[12px] leading-relaxed text-charcoal/40">
                Künye ve metin Yargıtay resmi karar aramasından derlenmiştir.
                Bilgilendirme amaçlıdır; bağlayıcı olan kararın aslıdır. İndirme
                kapalıdır.
              </p>
            </>
          ) : (
            <div className="mt-10">
              <YargiPaywall user={publicUser} compact kunye={row.k} />
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
