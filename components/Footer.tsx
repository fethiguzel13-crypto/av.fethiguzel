"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Scale, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal pt-16 sm:pt-24 md:pt-32 pb-8 sm:pb-12 px-5 sm:px-6 rounded-t-[2rem] sm:rounded-t-[3rem] md:rounded-t-[4rem] overflow-hidden" id="iletisim">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 md:gap-24 mb-16 sm:mb-24 md:mb-32">
          <div>
            <h2 className="text-accent font-heading text-xs sm:text-sm tracking-widest uppercase mb-5 sm:mb-8">İletişim & Ofis</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-cream font-bold mb-6 sm:mb-8 leading-tight">
              Çözüm için <span className="font-drama italic text-accent">Buradayız.</span>
            </h3>
            <p className="text-cream/55 text-sm sm:text-base max-w-md mb-8 sm:mb-12 leading-relaxed">
              Erciş / Van ofisi · dava vekilliği, arabuluculuk ve hukuki danışmanlık.
              Talebinizi e-posta ile iletebilir veya ofisi ziyaret edebilirsiniz.
            </p>

            <div className="space-y-8 sm:space-y-12">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-cream/5 rounded-full flex items-center justify-center text-accent shrink-0">
                  <MapPin size={24} aria-hidden />
                </div>
                <div>
                  <h4 className="text-cream/40 text-[10px] uppercase tracking-widest mb-2 font-bold">Ofis Adresi</h4>
                  <p className="text-cream text-lg leading-relaxed">
                    Vanyolu Mah. Karayusuf Bey Bulvarı<br />
                    Zenginler İş Hanı Kat 4 No 26<br />
                    Erciş / VAN
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Vanyolu+Mah.+Karayusuf+Bey+Bulvar%C4%B1+Zenginler+I%C5%9F+Han%C4%B1+Erci%C5%9F+Van"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-accent text-xs font-bold uppercase tracking-widest hover:underline"
                  >
                    Google Haritalar&apos;da Aç →
                  </a>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-cream/5 rounded-full flex items-center justify-center text-accent shrink-0">
                  <Mail size={24} aria-hidden />
                </div>
                <div>
                  <h4 className="text-cream/40 text-[10px] uppercase tracking-widest mb-2 font-bold">E-Posta</h4>
                  <a
                    href="mailto:av.fethiguzel@hotmail.com"
                    className="text-cream text-lg hover:text-accent transition-colors"
                  >
                    av.fethiguzel@hotmail.com
                  </a>
                  <p className="mt-2 text-cream/40 text-xs">Yanıt süresi genellikle 1–2 iş günü</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-cream/5 rounded-full flex items-center justify-center text-accent shrink-0">
                  <Clock size={24} aria-hidden />
                </div>
                <div>
                  <h4 className="text-cream/40 text-[10px] uppercase tracking-widest mb-2 font-bold">Çalışma</h4>
                  <p className="text-cream text-base leading-relaxed">
                    Hafta içi 09:00 – 18:00<br />
                    <span className="text-cream/50 text-sm">Randevu ile görüşme önerilir</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[280px] sm:h-[380px] md:h-full md:min-h-[400px] rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-cream/10 grayscale hover:grayscale-0 transition-all duration-700 relative group">
            <iframe
              title="Av. Fethi Güzel ofis konumu — Erciş Van"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3089.4754512457813!2d43.35!3d39.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDAxJzEyLjAiTiA0M8KwMjEnMDAuMCJF!5e0!3m2!1str!2str!4v1715340000000!5m2!1str!2str&q=Vanyolu+Mah.+Karayusuf+Bey+Bulvar%C4%B1+Zenginler+I%C5%9F+Han%C4%B1+Erci%C5%9F+Van"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-60 group-hover:opacity-100 transition-opacity duration-700"
            />
          </div>
        </div>

        <div className="mb-12 sm:mb-16 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left">
          <div>
            <p className="text-cream/40 text-[10px] uppercase tracking-widest font-bold mb-3">Kütüphane</p>
            <div className="flex flex-col gap-2 text-sm text-cream/70">
              <Link href="/ara" className="hover:text-accent transition-colors">Mevzuat Ara</Link>
              <Link href="/mevzuat" className="hover:text-accent transition-colors">Tüm Kanunlar</Link>
              <Link href="/icthat" className="hover:text-accent transition-colors">Günlük İçtihat</Link>
              <Link href="/hesaplama" className="hover:text-accent transition-colors">Hesaplama Araçları</Link>
            </div>
          </div>
          <div>
            <p className="text-cream/40 text-[10px] uppercase tracking-widest font-bold mb-3">İçerik</p>
            <div className="flex flex-col gap-2 text-sm text-cream/70">
              <Link href="/makaleler" className="hover:text-accent transition-colors">Makaleler</Link>
              <Link href="/eserlerim" className="hover:text-accent transition-colors">Kitap / Eserler</Link>
              <Link href="/akademik-profil" className="hover:text-accent transition-colors">Akademik Profil</Link>
              <Link href="/english-speaking-lawyer" className="hover:text-accent transition-colors">English</Link>
              <Link href="/site-haritasi" className="hover:text-accent transition-colors">Site Haritası</Link>
            </div>
          </div>
          <div>
            <p className="text-cream/40 text-[10px] uppercase tracking-widest font-bold mb-3">Bölge</p>
            <div className="flex flex-col gap-2 text-sm text-cream/70">
              <Link href="/hizmet-bolgeleri" className="hover:text-accent transition-colors">Tüm Bölgeler</Link>
              <Link href="/hizmetler" className="hover:text-accent transition-colors">Hizmet Alanları</Link>
              <Link href="/van-avukat" className="hover:text-accent transition-colors">Van Avukat</Link>
              <Link href="/ercis-avukat" className="hover:text-accent transition-colors">Erciş Avukat</Link>
              <Link href="/ankara-avukat" className="hover:text-accent transition-colors">Ankara Avukat</Link>
              <Link href="/bitlis-avukat" className="hover:text-accent transition-colors">Bitlis Avukat</Link>
              <Link href="/tatvan-avukat" className="hover:text-accent transition-colors">Tatvan Avukat</Link>
              <Link href="/avukat-fethi-guzel" className="hover:text-accent transition-colors">Av. Fethi Güzel</Link>
            </div>
          </div>
          <div>
            <p className="text-cream/40 text-[10px] uppercase tracking-widest font-bold mb-3">Profil</p>
            <p className="text-cream/50 text-xs leading-relaxed">
              Özel hukuk doktora çalışmaları · e-duruşma monografisi · iyi düzeyde İngilizce · 45+ kanun · 7.800+ madde şerhi
            </p>
          </div>
        </div>

        <div className="pt-10 sm:pt-16 md:pt-20 border-t border-cream/5 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-10 md:gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-cream">
                <Scale size={12} />
              </div>
              <span className="text-cream font-bold font-heading tracking-tight">AV. FETHİ GÜZEL</span>
            </Link>
            <p className="text-cream/30 text-xs font-sans">
              © {new Date().getFullYear()} Tüm Hakları Saklıdır. Reklam Yasağına Uygundur.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-cream/5 px-6 py-3 rounded-full border border-cream/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-mono text-[10px] text-cream/60 tracking-widest uppercase">
              Sistem Operasyonel // Mevzuat Güncel
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-[10px] font-bold text-cream/40 tracking-widest uppercase">
            <Link href="/avukat-fethi-guzel" className="hover:text-accent transition-colors">Avukat Profili</Link>
            <Link href="/gizlilik" className="hover:text-accent transition-colors">Gizlilik / KVKK</Link>
            <Link href="/yasal-uyari" className="hover:text-accent transition-colors">Yasal Uyarı</Link>
            <Link href="/#sss" className="hover:text-accent transition-colors">SSS</Link>
          </div>
        </div>

        {/* Hizmet bölgeleri — dahili bağlantı / yerel SEO */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-bold uppercase tracking-widest">
          {[
            { ad: 'Van Avukat', href: '/van-avukat' },
            { ad: 'Erciş Avukat', href: '/ercis-avukat' },
            { ad: 'Çaldıran Avukat', href: '/caldiran-avukat' },
            { ad: 'Özalp Avukat', href: '/ozalp-avukat' },
            { ad: 'Muradiye Avukat', href: '/muradiye-avukat' },
            { ad: 'Patnos Avukat', href: '/patnos-avukat' },
            { ad: 'Ağrı Avukat', href: '/agri-avukat' },
            { ad: 'Tatvan Avukat', href: '/tatvan-avukat' },
            { ad: 'Bitlis Avukat', href: '/bitlis-avukat' },
            { ad: 'Adilcevaz Avukat', href: '/adilcevaz-avukat' },
            { ad: 'Ahlat Avukat', href: '/ahlat-avukat' },
            { ad: 'Ankara Avukat', href: '/ankara-avukat' },
            { ad: 'Av. Fethi Güzel', href: '/avukat-fethi-guzel' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="text-cream/40 hover:text-accent transition-colors">
              {l.ad}
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center text-cream/45 text-xs font-sans leading-relaxed max-w-3xl mx-auto">
          Av. Fethi Güzel — özel hukuk alanında doktora çalışmaları yürüten avukat ve arabulucu; e-duruşma monografisi yazarı; iyi düzeyde İngilizce.
          <strong className="text-cream/60"> Van avukat</strong>, <strong className="text-cream/60">Erciş avukat</strong>,{' '}
          <strong className="text-cream/60">Çaldıran</strong>, <strong className="text-cream/60">Özalp</strong>,{' '}
          <strong className="text-cream/60">Muradiye</strong>, <strong className="text-cream/60">Patnos</strong>,{' '}
          <strong className="text-cream/60">Ağrı</strong>, <strong className="text-cream/60">Tatvan</strong>,{' '}
          <strong className="text-cream/60">Bitlis</strong>, <strong className="text-cream/60">Adilcevaz</strong>,{' '}
          <strong className="text-cream/60">Ahlat</strong> ve uzaktan <strong className="text-cream/60">Ankara</strong> erişimi
          için bilgilendirme sayfaları sunulmaktadır. Reklam yasağına uygundur; sonuç vaadi içermez.
        </p>
      </div>
    </footer>
  );
}
