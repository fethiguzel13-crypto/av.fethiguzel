import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import YargiArchiveClient from '@/components/YargiArchiveClient';
import YargiPaywall from '@/components/YargiPaywall';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getAccess, setSessionCookie } from '@/lib/uyelik/session';
import { priceLabel } from '@/lib/uyelik/config';

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

const stats = readStats();
const totalLabel = stats.total
  ? `${stats.total.toLocaleString('tr-TR')} Yargıtay kararı`
  : 'Yargıtay karar arşivi';

export const metadata: Metadata = {
  title: `Yargıtay Karar Arşivi | ${totalLabel}`,
  description: `İçtihadı birleştirme, HGK, CGK ve daire kararları. Aylık üyelik ${priceLabel()}. Kararlar sitede okunur; indirme yoktur.`,
  alternates: { canonical: 'https://www.avfethiguzel.com/yargi-kararlari' },
  openGraph: {
    title: 'Yargıtay Karar Arşivi | Av. Fethi Güzel',
    description: `Üyelikle açılan araştırma arşivi. Aylık ${priceLabel()}.`,
    url: 'https://www.avfethiguzel.com/yargi-kararlari',
  },
};

export default async function YargiKararlariPage() {
  const { member, publicUser, user } = await getAccess();
  if (user) await setSessionCookie(user);

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
