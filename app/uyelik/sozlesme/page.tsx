import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { priceLabel, UYELIK } from '@/lib/uyelik/config';
import { PROFILE } from '@/lib/profile';

export const metadata: Metadata = {
  title: 'Mesafeli satış sözleşmesi — arşiv üyeliği',
  description: 'Yargıtay arşivi dijital üyelik mesafeli satış metni.',
};

export default function SozlesmePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream pt-36 pb-20 px-5 sm:px-6">
        <article className="max-w-3xl mx-auto space-y-5 text-[15px] leading-relaxed text-charcoal/80">
          <p className="text-accent text-xs font-bold tracking-widest uppercase">Yasal</p>
          <h1 className="text-3xl font-heading font-bold text-charcoal">
            Mesafeli satış sözleşmesi
          </h1>
          <p>
            Satıcı: {PROFILE.name} — {PROFILE.office.street}, {PROFILE.office.locality} /{' '}
            {PROFILE.office.region}. İletişim:{' '}
            <a href={`mailto:${PROFILE.email}`} className="text-accent font-semibold">
              {PROFILE.email}
            </a>
            .
          </p>
          <h2 className="text-xl font-heading font-bold text-charcoal pt-2">1. Konu</h2>
          <p>
            Konu, sitedeki Yargıtay karar arşivine {UYELIK.periodDays} günlük dijital erişimdir.
            Bedel {priceLabel()} (KDV dahil görünen tutar). Bu bedel avukatlık ücreti,
            vekâlet veya hukuki danışmanlık karşılığı değildir.
          </p>
          <h2 className="text-xl font-heading font-bold text-charcoal pt-2">2. İfa</h2>
          <p>
            İçerik dijitaldir; ödeme (veya havale onayı) sonrası sitede okunur. Dosya,
            PDF veya toplu indirme verilmez. Yazdırma kapatılmıştır.
          </p>
          <h2 className="text-xl font-heading font-bold text-charcoal pt-2">3. Cayma</h2>
          <p>
            6502 sayılı Kanun m. 47 vd. uyarınca mesafeli sözleşmelerde cayma hakkı
            kuraldır. Dijital içeriğin ifasına kayıttaki onayla derhal başlanır; bu
            onay verildiğinde cayma hakkı kullanılamaz. Havale henüz onaylanmamışsa
            erişim açılmadan vazgeçilebilir.
          </p>
          <h2 className="text-xl font-heading font-bold text-charcoal pt-2">4. Sorumluluk</h2>
          <p>
            Metinler resmi kaynaktan derlenir; güncellik ve hatasızlık taahhüt edilmez.
            Bağlayıcı olan kararın aslıdır. Üyelik, somut dosyada vekâlet doğurmaz.
          </p>
          <p className="pt-4">
            <Link href="/uyelik" className="text-accent font-bold">
              Üyelik sayfasına dön
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
