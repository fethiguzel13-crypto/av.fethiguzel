import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import YargiArchiveClient from '@/components/YargiArchiveClient';
import YargiPaywall from '@/components/YargiPaywall';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getAccess } from '@/lib/uyelik/session';
import { priceLabel } from '@/lib/uyelik/config';

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

function readStats(): { total?: number; byTier?: Record<string, number> } {
  const p = join(process.cwd(), 'public', 'data', 'yargi-stats.json');
  if (!existsSync(p)) return {};
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return {};
  }
}

/*
  Sayaç HER İSTEKTE okunur.

  Önceki sürümde `readStats()` modül gövdesinde bir kez çalışıyor ve sonuç
  süreç ömrü boyunca donuyordu. Arşiv her gün büyüdüğü için sayfa gövdesinde
  «25.902 Yargıtay kararı» yazarken hemen altındaki süzgeç çipi «Tümü
  (27.147)» diyordu: aynı ekranda iki farklı gerçek. Sayfa zaten
  `force-dynamic`; küçük bir JSON okumasının maliyeti bu tutarsızlığın
  yanında yok sayılır.
*/
function toplamEtiketi(): string {
  const stats = readStats();
  return stats.total
    ? `${stats.total.toLocaleString('tr-TR')} Yargıtay kararı`
    : 'Yargıtay karar arşivi';
}

export function generateMetadata(): Metadata {
  const totalLabel = toplamEtiketi();
  return {
  title: `Yargıtay Karar Arşivi | ${totalLabel}`,
  description: `İçtihadı birleştirme, HGK, CGK ve daire kararları. Aylık üyelik ${priceLabel()}. Kararlar sitede okunur; indirme yoktur.`,
  alternates: { canonical: 'https://www.avfethiguzel.com/yargi-kararlari' },
  openGraph: {
    title: 'Yargıtay Karar Arşivi | Av. Fethi Güzel',
    description: `Üyelikle açılan araştırma arşivi. Aylık ${priceLabel()}.`,
    url: 'https://www.avfethiguzel.com/yargi-kararlari',
  },
  };
}

export default async function YargiKararlariPage() {
  const stats = readStats();
  const totalLabel = toplamEtiketi();
  const { member, publicUser, user } = await getAccess();

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream pt-36 pb-20 px-5 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-charcoal tracking-tight">
            Yargıtay karar arşivi
          </h1>
          <p className="mt-4 max-w-2xl text-charcoal/60 leading-relaxed">
            {totalLabel}. Öncelik içtihadı birleştirme, Hukuk Genel Kurulu ve
            Ceza Genel Kurulu&apos;ndadır. Metinler sitede okunur; dosya indirme
            yoktur. Bağlayıcı olan kararın aslıdır.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/icthat" className="text-accent hover:underline">
              Günlük içtihat
            </Link>
            <span className="text-charcoal/20">·</span>
            <Link href="/mevzuat/tbk" className="text-accent hover:underline">
              TBK
            </Link>
            <span className="text-charcoal/20">·</span>
            <Link href="/mevzuat/tmk" className="text-accent hover:underline">
              TMK
            </Link>
            <span className="text-charcoal/20">·</span>
            <Link href="/ara" className="text-accent hover:underline">
              Madde ara
            </Link>
          </div>

          <div className="mt-10">
            {member ? (
              <YargiArchiveClient />
            ) : (
              <YargiPaywall total={stats.total} user={publicUser} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
