"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

export default function Publication() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Book entrance animation
      gsap.fromTo(
        ".book-image",
        { opacity: 0, x: -60, rotateY: 15 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );

      // Text stagger
      gsap.fromTo(
        ".pub-text-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="yayin"
      ref={sectionRef}
      className="relative w-full py-32 px-6 md:px-20 overflow-hidden bg-primary"
    >
      {/* Subtle accent glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="pub-text-item mb-16">
          <span className="text-accent font-data text-sm tracking-[0.3em] uppercase block mb-4">
            Akademik Yayın
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-light">
            Resmi Yayınlarım
          </h2>
        </div>

        {/* Book card */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Book Cover */}
          <div className="book-image relative flex-shrink-0 perspective-[1200px]">
            <div className="relative w-[280px] md:w-[320px] rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10 transition-transform duration-500 hover:scale-[1.03] hover:shadow-[0_40px_80px_-15px_rgba(201,168,76,0.15)]">
              <Image
                src="/resmi-gazete-yayin.jpg"
                alt="Medeni Usul Hukukunda Ses ve Görüntünün Nakledilmesi Yoluyla Duruşma İcrası (E-Duruşma) - Av. Fethi Güzel - Filiz Kitabevi, İstanbul 2024"
                width={320}
                height={460}
                className="w-full h-auto object-cover"
                priority={false}
              />
            </div>
            {/* Reflection glow under the book */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-accent/10 rounded-full blur-xl"></div>
          </div>

          {/* Book Info */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="pub-text-item">
              <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent font-data text-xs tracking-[0.15em] uppercase px-4 py-2 rounded-full mb-4">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                Filiz Kitabevi – İstanbul 2024
              </span>
            </div>

            <h3 className="pub-text-item text-2xl md:text-4xl font-sans font-bold text-light leading-tight">
              Medeni Usul Hukukunda<br />
              <span className="font-drama italic text-accent font-normal">
                Ses ve Görüntünün Nakledilmesi Yoluyla Duruşma İcrası
              </span>
            </h3>

            <p className="pub-text-item text-lg text-light/50 font-sans leading-relaxed max-w-xl">
              (E-Duruşma) — Dijitalleşen yargılama süreçlerinde ses ve görüntü nakli yoluyla duruşma 
              yapılmasının hukuki çerçevesi, uygulamadaki sorunlar ve çözüm önerilerinin kapsamlı 
              akademik analizi.
            </p>

            <div className="pub-text-item flex flex-wrap gap-3 mt-2">
              {[
                "Medeni Usul Hukuku",
                "E-Duruşma",
                "HMK",
                "Dijital Yargılama",
                "SEGBİS",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-data text-light/50"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Author attribution */}
            <div className="pub-text-item flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="font-drama text-accent font-bold text-xl">FG</span>
              </div>
              <div>
                <p className="font-sans font-semibold text-light">Av. Fethi Güzel</p>
                <p className="font-sans text-sm text-light/40">
                  Yazar &amp; Özel Hukuk Uzmanı – Erciş/Van
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schema.org Book Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            "name": "Medeni Usul Hukukunda Ses ve Görüntünün Nakledilmesi Yoluyla Duruşma İcrası (E-Duruşma)",
            "author": {
              "@type": "Person",
              "name": "Av. Fethi Güzel",
              "jobTitle": "Avukat & Arabulucu",
              "url": "https://avfethiguzel.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Filiz Kitabevi"
            },
            "datePublished": "2024",
            "inLanguage": "tr",
            "about": [
              "Medeni Usul Hukuku",
              "E-Duruşma",
              "SEGBİS",
              "Dijital Yargılama",
              "HMK"
            ],
            "image": "https://avfethiguzel.com/resmi-gazete-yayin.jpg"
          })
        }}
      />
    </section>
  );
}
