import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { loadAnalysis } from '@/lib/analysis';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = loadAnalysis(id);
  if (!data) return { title: 'Analiz Bulunamadı' };

  const court = data.highlight.source || '';
  const ref = data.highlight.kunye || id;
  const desc = data.sections.davaSozeti?.slice(0, 155) || '';

  return {
    title: `${court} ${ref} Analizi | Av. Fethi Güzel`,
    description: desc,
  };
}

export default async function AnalysisPage({ params }: Props) {
  const { id } = await params;
  const data = loadAnalysis(id);
  if (!data) notFound();

  const { sections, highlight } = data;

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <main className="pt-40 pb-20 px-6 max-w-3xl mx-auto">
        <Link
          href="/icthat"
          className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-accent transition mb-10 font-mono uppercase tracking-widest"
        >
          ← Tüm Kararlar
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-accent/10 text-accent text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded-md">
              {highlight.source}
            </span>
            {highlight.date && (
              <span className="text-charcoal/40 text-xs font-mono">{highlight.date}</span>
            )}
          </div>
          {highlight.kunye && (
            <p className="text-charcoal/60 text-sm font-mono">{highlight.kunye}</p>
          )}
        </header>

        <div className="space-y-10">
          <Section title="Dava Özeti" text={sections.davaSozeti} />
          <Section title="Mahkemenin Kararı" text={sections.mahkemeninKarari} />
          <Section title="Benim Gözlemim" text={sections.benimGozlemim} />
          <Section title="Pratik Etki" text={sections.pratikEtki} />
        </div>

        {highlight.url && (
          <div className="mt-12 pt-8 border-t border-charcoal/10">
            <a
              href={highlight.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-widest hover:underline"
            >
              Resmi Karar Metnine Git <ExternalLink size={14} />
            </a>
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/icthat"
            className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-accent transition font-mono uppercase tracking-widest"
          >
            ← Tüm Kararlar
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <section>
      <h2 className="text-charcoal font-heading text-xl font-bold mb-3">{title}</h2>
      <p className="text-charcoal/70 leading-relaxed">{text}</p>
    </section>
  );
}
