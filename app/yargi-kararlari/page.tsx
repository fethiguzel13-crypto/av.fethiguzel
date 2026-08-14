import type { Metadata } from 'next';
import Link from 'next/link';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/** Yerel dosya okur; production'da arşiv yoksa boş liste. */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'Yargı Kararları | Borçlar ve Medeni Hukuk',
  description:
    'Yargıtay borçlar ve medeni hukuk emsal karar arşivi. Künye ve tam metin — akademik / bilgilendirme amaçlı.',
  robots: { index: false, follow: false }, // deploy öncesi index kapalı; arşiv dolunca açılır
};

type Pointer = {
  id: string;
  kunye?: string;
  alan?: string;
  tarih?: string;
  daire?: string;
  keywords?: string[];
  file?: string;
};

function loadLocalPointers(): Pointer[] {
  try {
    // Önce public (deploy sonrası), yoksa yerel data (dev)
    const candidates = [
      join(process.cwd(), 'public', 'data', 'yargi-kararlari', 'by-alan'),
      join(process.cwd(), 'data', 'yargi-kararlari', 'by-alan'),
    ];
    const out: Pointer[] = [];
    for (const base of candidates) {
      if (!existsSync(base)) continue;
      for (const alan of ['borclar', 'medeni']) {
        const dir = join(base, alan);
        if (!existsSync(dir)) continue;
        for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
          try {
            out.push(JSON.parse(readFileSync(join(dir, f), 'utf8')));
          } catch {
            /* skip corrupt pointer */
          }
        }
      }
      if (out.length) break;
    }
    return out.sort((a, b) => String(b.tarih || '').localeCompare(String(a.tarih || '')));
  } catch {
    // Vercel'de fs yok / path yok → boş arşiv göster
    return [];
  }
}

export default function YargiKararlariPage() {
  const items = loadLocalPointers();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <p className="text-sm uppercase tracking-wide text-stone-500">Yargı kararları</p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-900">
            Borçlar ve medeni hukuk emsalleri
          </h1>
          <p className="mt-4 max-w-2xl text-stone-600 leading-relaxed">
            Yargıtay resmi karar aramasından derlenen arşiv. Öncelik: içtihadı birleştirme (Büyük
            Genel Kurulu), Hukuk Genel Kurulu, ardından borçlar ve medeni daire kararları. BAM ve
            ilk derece şimdilik yok. İçerik bilgisayarda birikir; Vercel limiti açılınca siteye
            aktarılır. Bilgilendirme amaçlıdır.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/icthat" className="text-accent hover:underline">
              Günlük içtihat
            </Link>
            <span className="text-stone-300">·</span>
            <Link href="/mevzuat/tbk" className="text-accent hover:underline">
              TBK
            </Link>
            <span className="text-stone-300">·</span>
            <Link href="/mevzuat/tmk" className="text-accent hover:underline">
              TMK
            </Link>
          </div>

          {!items.length ? (
            <div className="mt-10 rounded-xl border border-dashed border-stone-300 bg-white p-8 text-stone-600">
              <p className="font-medium text-stone-800">Arşiv henüz boş veya yerelde.</p>
              <p className="mt-2 text-sm leading-relaxed">
                Terminalde{' '}
                <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">
                  npm run yargi:run
                </code>{' '}
                ile indirmeyi başlat; liste{' '}
                <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">
                  data/yargi-kararlari/
                </code>{' '}
                altında birikir. Karar JSON dosyaları Vercel limitleri nedeniyle
                henüz production&apos;a yüklenmez; sayfa yerelde dolu, canlıda
                boş arşiv mesajı gösterir.
              </p>
            </div>
          ) : (
            <ul className="mt-10 space-y-4">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-indigo-800">
                      {it.alan === 'medeni' ? 'Medeni' : 'Borçlar'}
                    </span>
                    <span>{it.tarih}</span>
                    {it.daire ? <span>· {it.daire}</span> : null}
                  </div>
                  <h2 className="mt-2 text-base font-medium text-stone-900 leading-snug">
                    {it.kunye || it.id}
                  </h2>
                  {it.keywords?.length ? (
                    <p className="mt-1 text-sm text-stone-500">{it.keywords.join(' · ')}</p>
                  ) : null}
                  <p className="mt-3 text-xs text-stone-400">
                    Detay sayfası deploy sonrası · id: {it.id}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
