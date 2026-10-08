import Link from "@/components/SiteLink";
import { BookOpen, FileText, Gavel, MapPin, Newspaper, Scale } from 'lucide-react';

/** Külliyat sayıları — lib/site-stats.ts tarafından üretilir. */
export type Sayilar = {
  kanun: string;
  madde: string;
  karar: string;
  rehber: string;
};

/**
 * Külliyat şeridi: ana sayfada sayıların ayrıntısıyla yazıldığı TEK yer.
 *
 * G16'ya kadar bu bölüm "Neden bu portal?" başlığıyla yazarın akademik bilgisini ve kitabını da taşıyordu. Aynı bilgi
 * CredentialsStrip'te ve Hakkımda bölümünde yinelendiğinden yazar bilgisi Hakkımda'ya, kaynaklara giden bağlantılar
 * (eski LibraryStrip) bu şeride toplanmıştır. Her kutucuk sayının ait olduğu kaynağa açılır.
 */
export default function TrustBar({ sayilar }: { sayilar: Sayilar }) {
  const KAYNAKLAR = [
      {
          icon: BookOpen,
          value: sayilar.madde,
          label: 'Madde metni ve akademik şerh',
          href: '/mevzuat',
      },
      {
          icon: Scale,
          value: sayilar.kanun,
          label: 'Kanun',
          href: '/mevzuat',
      },
      {
          icon: Gavel,
          value: sayilar.karar,
          label: 'Yargıtay kararı arşivi',
          href: '/yargi-kararlari',
      },
      {
          icon: FileText,
          value: sayilar.rehber,
          label: 'Vatandaş rehberi',
          href: '/bilgi',
      },
      {
          icon: Newspaper,
          value: 'Günlük',
          label: 'İçtihat ve Resmî Gazete',
          href: '/icthat',
      },
      // Bölge bilgisi kullanıcı yanıtı bekleyen soru 10'a bağlıdır; metni değiştirilmeden korunur.
      {
          icon: MapPin,
          value: 'Van · Erciş',
          label: 'Yerel avukatlık ve arabuluculuk',
          href: null,
      },
  ];

    return (
        <section
            aria-labelledby="kulliyat-baslik"
            className="relative z-20 -mt-6 sm:-mt-10 px-5 sm:px-6"
        >
            <div className="max-w-7xl mx-auto">
                <div className="surface-card px-4 py-5 sm:px-8 sm:py-7 shadow-lift border-charcoal/[0.08]">
                    <div className="mb-5 sm:mb-6">
                        <p className="section-label mb-1.5">Külliyat</p>
                        <h2 id="kulliyat-baslik" className="text-xl sm:text-2xl font-heading font-bold text-charcoal tracking-tight">
                            Sitede yayımlanan kaynaklar
                        </h2>
                    </div>

                    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                        {KAYNAKLAR.map((s) => {
                            const Icon = s.icon;
                            const icerik = (
                                <>
                                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent/10 text-accent mb-3">
                                        <Icon size={18} aria-hidden />
                                    </div>
                                    <p className="text-lg sm:text-xl font-heading font-bold text-charcoal tracking-tight">
                                        {s.value}
                                    </p>
                                    <p className="text-[11px] sm:text-xs text-ink-muted leading-snug mt-1">
                                        {s.label}
                                    </p>
                                </>
                            );
                            const kutu = 'block h-full rounded-2xl bg-cream/80 border border-charcoal/5 px-3.5 py-4 text-center sm:text-left';
                            return (
                                <li key={s.label}>
                                    {s.href ? (
                                        // Ön getirme kapalı (G16): şerit ilk ekranda, /bilgi ve /mevzuat yükü her açılışta iniyordu.
                                        <Link href={s.href} prefetch={false} className={`${kutu} hover:border-accent/40 transition-colors`}>
                                            {icerik}
                                        </Link>
                                    ) : (
                                        <div className={kutu}>{icerik}</div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>
    );
}
