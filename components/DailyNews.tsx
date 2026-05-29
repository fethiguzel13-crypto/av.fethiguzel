import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { loadDaily } from '@/lib/daily-server';
import DailyNewsCards from './DailyNewsCards';

export default function DailyNews() {
  const data = loadDaily();
  if (!data || !data.highlights || data.highlights.length === 0) return null;

  return (
    <section id="guncel" className="py-16 sm:py-24 md:py-32 px-5 sm:px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-16 md:mb-20 gap-5 sm:gap-8">
          <div className="max-w-2xl">
            <h2 className="text-accent font-heading text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4">Güncel</h2>
            <p className="text-3xl sm:text-4xl md:text-5xl text-charcoal font-bold font-sans">
              Hukuki <span className="font-drama italic text-accent">Gelişmeler.</span>
            </p>
            <p className="text-charcoal/50 text-xs sm:text-sm font-mono mt-2 sm:mt-3 tracking-widest uppercase">
              {data.dateLabel}
            </p>
          </div>
          <Link
            href="/icthat"
            className="flex items-center gap-2 text-charcoal font-bold text-xs sm:text-sm tracking-widest uppercase group border-b-2 border-accent pb-1 sm:pb-2 shrink-0"
          >
            TÜM İÇTİHATLARI GÖR
            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        <DailyNewsCards highlights={data.highlights} />
      </div>
    </section>
  );
}
