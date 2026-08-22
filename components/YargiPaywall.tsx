import Link from 'next/link';
import { Lock, Scale, BookOpen, Ban } from 'lucide-react';
import { priceLabel, UYELIK } from '@/lib/uyelik/config';
import type { PublicSession } from '@/lib/uyelik/types';

export default function YargiPaywall({
  total,
  user,
  compact = false,
  kunye,
}: {
  total?: number;
  user: PublicSession | null;
  compact?: boolean;
  kunye?: string;
}) {
  const n = total ? `${total.toLocaleString('tr-TR')} ` : '';
  const logged = Boolean(user);
  const pending = user?.durum === 'pending';

  return (
    <section className={`rounded-[2rem] bg-charcoal text-cream ${compact ? 'p-6 sm:p-8' : 'p-8 sm:p-12'}`}>
      <p className="text-[11px] font-mono uppercase tracking-widest text-accent mb-3 flex items-center gap-2">
        <Lock size={13} aria-hidden />
        Üyelik kapısı
      </p>
      <h2 className={`font-heading font-bold tracking-tight ${compact ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}>
        Yargıtay arşivi{' '}
        <span className="font-drama italic text-accent font-medium">üyelikle</span>
      </h2>
      {kunye ? (
        <p className="mt-3 text-cream/70 text-sm leading-relaxed">{kunye}</p>
      ) : (
        <p className="mt-4 text-cream/65 text-sm sm:text-base leading-relaxed max-w-2xl">
          {n}karar; içtihadı birleştirme, Hukuk Genel Kurulu, Ceza Genel Kurulu ve daire
          metinleri. Arama ve okuma üyelere açıktır. Kararlar sitede okunur; dosya
          indirme yoktur.
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-end gap-6">
        <div>
          <p className="text-cream/40 text-[10px] uppercase tracking-widest font-bold">Aylık üyelik</p>
          <p className="text-4xl sm:text-5xl font-heading font-bold mt-1">
            {priceLabel()}
            <span className="text-base font-sans font-semibold text-cream/45 ml-2">/ {UYELIK.periodDays} gün</span>
          </p>
        </div>
      </div>

      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <li className="rounded-2xl border border-cream/10 bg-cream/[0.04] p-4 flex gap-3">
          <Scale size={18} className="text-accent shrink-0 mt-0.5" aria-hidden />
          <span>Tam metin sitede okunur</span>
        </li>
        <li className="rounded-2xl border border-cream/10 bg-cream/[0.04] p-4 flex gap-3">
          <BookOpen size={18} className="text-accent shrink-0 mt-0.5" aria-hidden />
          <span>Künye, daire ve içtihat araması</span>
        </li>
        <li className="rounded-2xl border border-cream/10 bg-cream/[0.04] p-4 flex gap-3">
          <Ban size={18} className="text-accent shrink-0 mt-0.5" aria-hidden />
          <span>PDF / JSON indirme kapalı</span>
        </li>
      </ul>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        {logged ? (
          <Link href="/uyelik/odeme" className="btn-primary justify-center">
            {pending ? 'Havale bekleniyor — talimatı gör' : `${priceLabel()} ile üyeliği aç`}
          </Link>
        ) : (
          <>
            <Link href="/uyelik/kayit" className="btn-primary justify-center">
              Üye ol — {priceLabel()}
            </Link>
            <Link
              href="/uyelik/giris"
              className="inline-flex items-center justify-center border border-cream/20 text-cream px-6 py-3.5 rounded-full text-sm font-bold hover:bg-cream/10"
            >
              Giriş yap
            </Link>
          </>
        )}
      </div>
      <p className="mt-5 text-[12px] leading-relaxed text-cream/40 max-w-xl">
        Bu tutar avukatlık ücreti veya hukuki danışmanlık bedeli değildir; yalnızca
        dijital arşiv erişimidir. Mevzuat, rehber ve hesaplama araçları ücretsiz
        kalır.
      </p>
    </section>
  );
}
