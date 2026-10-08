"use client";

import React, { useEffect, useRef } from 'react';
import Link from "@/components/SiteLink";
import { ArrowRight } from 'lucide-react';
import { gsapGorununce } from '@/lib/gsap-yukle';

/**
 * `serh`: yayımlanabilir şerh sayısı, sunucuda `siteSayilari()`'ndan yuvarlanmış olarak gelir (istemci bileşeni dosya okuyamaz).
 * `kitap`: kitabın kısa adı ve yayınevi, `PROFILE.book`'tan (istemci paketine bütün profil nesnesi girmesin diye).
 */
export default function About({ serh, kitap }: { serh: string; kitap: string }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    return gsapGorununce(containerRef.current, (gsap) => {
      gsap.from(".philo-text", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out"
      });

      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        },
        scale: 1.1,
        opacity: 0,
        duration: 2,
        ease: "power2.out"
      });
    });
  }, []);

  return (
    <section id="manifesto" className="relative py-20 sm:py-28 md:py-32 px-5 sm:px-6 bg-charcoal overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-20">

        <div className="w-full lg:w-1/2 relative group">
          <div className="absolute -inset-4 bg-accent/20 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:rounded-[3rem] border border-cream/10 shadow-2xl">
            <img
              ref={imageRef}
              src="/images/av-fethi-guzel-van-ercis-avukat.jpg"
              alt="Av. Fethi Güzel — avukat, arabulucu, hukuk portalı kurucusu"
              width={800}
              height={1000}
              loading="lazy"
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
            <div className="absolute bottom-8 sm:bottom-10 left-6 sm:left-10">
              <span className="text-accent-light font-mono text-[10px] tracking-[0.3em] uppercase block mb-2">Kurucu</span>
              <h3 className="text-cream text-2xl sm:text-3xl font-heading font-bold">Av. Fethi Güzel</h3>
              <p className="text-cream/50 text-xs mt-1 tracking-wide">Avukat &amp; Arabulucu · Erciş / Van</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-8 sm:space-y-10">
          <div className="space-y-5 sm:space-y-6">
            <h2 className="philo-text text-accent-light font-heading text-xs sm:text-sm tracking-[0.35em] uppercase">
              Hakkımda
            </h2>
            <p className="philo-text text-3xl sm:text-4xl md:text-5xl text-cream font-bold leading-tight font-sans">
              Hukuki temsil,{' '}
              <span className="font-drama italic text-accent font-medium">şerh ve danışmanlık.</span>
            </p>
          </div>

          <p className="philo-text text-cream/65 text-base sm:text-lg md:text-xl font-sans leading-relaxed">
            Avukatlık; mevzuata hâkimiyet, güncel içtihat takibi ve somut olayın çok yönlü incelenmesini gerektirir. Av. Fethi Güzel, özel hukuk alanında doktora çalışmaları yürüten bir avukat ve arabulucu olarak Van, Erciş ve çevre bölgelerde dava vekilliği ile önleyici danışmanlık sunar.
          </p>
          {/*
            Yazar ve eserler (G16): Bu liste eskiden üç yerde yazılıydı (TrustBar başlığı, CredentialsStrip, buradaki
            sayı satırı) ve hemen üstteki paragraf aynı bilgiyi dördüncü kez veriyordu. Artık yalnız burada, her satır
            ilgili sayfaya bağlı olarak durur. Eser künyesi `lib/profile.ts`'ten prop olarak gelir.
          */}
          <ul className="philo-text pt-6 sm:pt-8 border-t border-cream/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { baslik: 'Doktora çalışmaları', metin: 'Özel hukuk', href: '/akademik-profil' },
              { baslik: 'Yayımlanmış kitap', metin: kitap, href: '/eserlerim' },
              { baslik: `${serh} şerhli madde`, metin: 'Açık erişimli kanun şerhi', href: '/mevzuat' },
              { baslik: 'İngilizce', metin: 'İyi düzeyde iletişim ve yazışma', href: '/english-speaking-lawyer' },
            ].map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="block h-full rounded-2xl border border-cream/10 px-4 py-3.5 hover:border-accent-light/50 hover:bg-cream/[0.04] transition-colors"
                >
                  <span className="block text-accent-light font-heading font-bold text-base">{s.baslik}</span>
                  <span className="block text-cream/60 text-xs mt-1 leading-snug">{s.metin}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="philo-text pt-2">
            <Link
              href="/avukat-fethi-guzel"
              className="btn-primary"
            >
              Tam profil
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
