import type { Metadata } from 'next';
import Link from 'next/link';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/profile';

export const metadata: Metadata = {
    title: 'Haftalık İçtihat Özeti',
    description:
        'Otomatik derlenen haftalık içtihat özetleri — Yargıtay, AYM ve güncel gelişmeler. Av. Fethi Güzel Hukuk Portalı.',
    alternates: { canonical: `${SITE_URL}/icthat/haftalik` },
};

type Digest = {
    weekOf: string;
    generatedAt: string;
    items: { title: string; summary?: string; source?: string; href?: string }[];
};

function loadLatestDigest(): Digest | null {
    const dir = join(process.cwd(), 'public/data/weekly-digests');
    if (!existsSync(dir)) return null;
    const files = readdirSync(dir)
        .filter((f) => f.endsWith('.json'))
        .sort()
        .reverse();
    if (!files.length) return null;
    try {
        return JSON.parse(readFileSync(join(dir, files[0]), 'utf8')) as Digest;
    } catch {
        return null;
    }
}

function loadDailyHighlights(): { title: string; summary?: string; id?: string }[] {
    const p = join(process.cwd(), 'public/data/daily.json');
    if (!existsSync(p)) return [];
    try {
        const j = JSON.parse(readFileSync(p, 'utf8')) as {
            highlights?: { title?: string; summary?: string; id?: string }[];
            items?: { title?: string; summary?: string; id?: string }[];
        };
        const list = j.highlights?.length ? j.highlights : j.items ?? [];
        return list.slice(0, 8).map((x) => ({
            title: x.title || 'Gelişme',
            summary: x.summary,
            id: x.id,
        }));
    } catch {
        return [];
    }
}

export default function HaftalikIctihatPage() {
    const digest = loadLatestDigest();
    const fallback = loadDailyHighlights();
    const items =
        digest?.items?.length
            ? digest.items
            : fallback.map((f) => ({
                title: f.title,
                summary: f.summary,
                href: f.id ? `/icthat/${f.id}` : '/icthat',
                source: 'Günlük tarama',
            }));

    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-3xl mx-auto">
                <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
                    İçtihat
                </p>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-3">
                    Haftalık içtihat özeti
                </h1>
                <p className="text-charcoal/55 text-sm leading-relaxed mb-2">
                    Otomatik derleme: her Pazartesi script çalışır, öne çıkan kararları listeler.
                    Bilgilendirme amaçlıdır; resmî metin ve dosya incelemesi yerine geçmez.
                </p>
                <p className="text-[11px] text-charcoal/40 mb-10">
                    {digest
                        ? `Hafta: ${digest.weekOf} · Üretim: ${digest.generatedAt.slice(0, 16)}`
                        : 'Henüz haftalık paket yok — günlük öne çıkanlar gösteriliyor. Script: npm run maintenance:weekly'}
                </p>

                <ul className="space-y-4 mb-12">
                    {items.map((it, i) => (
                        <li key={`${it.title}-${i}`} className="bg-white border border-charcoal/8 rounded-2xl p-5">
                            <h2 className="font-bold text-charcoal mb-2 leading-snug">{it.title}</h2>
                            {it.summary && (
                                <p className="text-sm text-charcoal/60 leading-relaxed mb-2">{it.summary}</p>
                            )}
                            <div className="flex flex-wrap gap-3 text-[11px]">
                                {it.source && <span className="text-charcoal/40">{it.source}</span>}
                                {it.href && (
                                    <Link href={it.href} className="text-accent font-bold hover:underline">
                                        Detay →
                                    </Link>
                                )}
                            </div>
                        </li>
                    ))}
                    {items.length === 0 && (
                        <li className="text-sm text-charcoal/45">Özet henüz oluşmadı.</li>
                    )}
                </ul>

                <div className="flex flex-wrap gap-4 text-sm font-bold">
                    <Link href="/icthat" className="text-accent hover:underline">
                        Tüm günlük içtihat
                    </Link>
                    <Link href="/hesaplama" className="text-charcoal/50 hover:text-accent">
                        Hesaplama araçları
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
