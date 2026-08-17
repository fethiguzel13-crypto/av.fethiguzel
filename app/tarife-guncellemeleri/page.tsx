import type { Metadata } from 'next';
import Link from 'next/link';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/profile';
import { getAracMeta } from '@/lib/hesaplama-meta';

export const metadata: Metadata = {
    title: 'Tarife ve Parametre Güncellemeleri',
    description:
        'Kıdem tavanı, AAÜT, harç ve bordro parametrelerinin portal güncelleme kaydı. Av. Fethi Güzel Hukuk Portalı.',
    alternates: { canonical: `${SITE_URL}/tarife-guncellemeleri` },
};

type Changelog = {
    updatedAt: string;
    title: string;
    disclaimer: string;
    items: {
        id: string;
        date: string;
        category: string;
        title: string;
        detail: string;
        affects: string[];
        source: string;
    }[];
    watch: { key: string; label: string; cadence: string; months: number[]; hint: string }[];
};

function loadChangelog(): Changelog {
    const p = join(process.cwd(), 'public/data/tarife-changelog.json');
    if (!existsSync(p)) {
        return {
            updatedAt: new Date().toISOString().slice(0, 10),
            title: 'Tarife güncellemeleri',
            disclaimer: 'Kayıt henüz oluşturulmadı.',
            items: [],
            watch: [],
        };
    }
    return JSON.parse(readFileSync(p, 'utf8')) as Changelog;
}

export default function TarifeGuncellemeleriPage() {
    const data = loadChangelog();
    const sorted = [...data.items].sort((a, b) => (a.date < b.date ? 1 : -1));

    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-3xl mx-auto">
                <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
                    Bakım kaydı
                </p>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-3">
                    Tarife ve parametre güncellemeleri
                </h1>
                <p className="text-charcoal/55 text-sm leading-relaxed mb-2">{data.disclaimer}</p>
                <p className="text-[11px] text-charcoal/40 mb-10">
                    Son kayıt güncellemesi: {data.updatedAt} · Otomatik kontrol:{' '}
                    <code className="bg-charcoal/5 px-1 rounded">npm run maintenance:tarifeler</code>
                </p>

                <section className="mb-12">
                    <h2 className="text-lg font-heading font-bold text-charcoal mb-4">Değişiklik günlüğü</h2>
                    <ul className="space-y-4">
                        {sorted.map((it) => (
                            <li key={it.id} className="bg-white border border-charcoal/[0.08] rounded-2xl p-5">
                                <div className="flex flex-wrap gap-2 items-center mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                                        {it.category}
                                    </span>
                                    <time className="text-[11px] text-charcoal/40 font-mono">{it.date}</time>
                                </div>
                                <h3 className="font-bold text-charcoal mb-2">{it.title}</h3>
                                <p className="text-sm text-charcoal/65 leading-relaxed mb-3">{it.detail}</p>
                                <p className="text-[11px] text-charcoal/40 mb-2">Kaynak: {it.source}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {it.affects.map((id) => {
                                        const m = getAracMeta(id);
                                        return (
                                            <Link
                                                key={id}
                                                href={`/hesaplama/${id}`}
                                                className="text-[11px] px-2.5 py-1 rounded-full bg-charcoal/5 text-charcoal/60 hover:text-accent"
                                            >
                                                {m?.baslik ?? id}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg font-heading font-bold text-charcoal mb-4">
                        Dönemsel izleme listesi
                    </h2>
                    <p className="text-sm text-charcoal/55 mb-4 leading-relaxed">
                        Aşağıdaki kalemler her Ocak/Temmuz (veya yıllık) otomatik kontrol scripti ile
                        hatırlatılır; güncelleme sizin onayıyla changelog&apos;a yazılır.
                    </p>
                    <ul className="space-y-2">
                        {data.watch.map((w) => (
                            <li
                                key={w.key}
                                className="flex flex-col sm:flex-row sm:justify-between gap-1 p-3 rounded-xl bg-white border border-charcoal/[0.08] text-sm"
                            >
                                <span className="font-semibold text-charcoal">{w.label}</span>
                                <span className="text-charcoal/45 text-xs">
                                    {w.hint} · aylar: {w.months.join(', ')}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>

                <Link href="/hesaplama" className="text-accent font-bold text-sm hover:underline">
                    ← Hesaplama araçları
                </Link>
            </main>
            <Footer />
        </div>
    );
}
