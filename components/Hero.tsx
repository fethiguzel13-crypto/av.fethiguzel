"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-text",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        ".hero-photo-container",
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.5 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] flex items-end justify-start pb-20 md:pb-32 px-6 md:px-20 overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=2000&auto=format&fit=crop')" }} // Dark marble / luxury interior
      ></div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent"></div>

      {/* Content Grid */}
      <div className="relative z-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
        {/* Left Side: Text */}
        <div className="max-w-4xl flex flex-col items-start gap-4">
          <h1 className="flex flex-col">
            <span className="hero-text font-sans font-bold text-3xl md:text-5xl text-light tracking-tight mb-2">
              Hukukta Akademik Derinlik
            </span>
            <span className="hero-text font-drama italic text-5xl md:text-[6rem] leading-[1.1] text-accent mt-2">
              Pratik Çözümler.
            </span>
          </h1>
          
          <p className="hero-text mt-4 max-w-xl text-lg md:text-xl text-light/70 font-sans font-light">
            Avukatlık ve arabuluculuk pratiğini, teknoloji entegreli içtihat mühendisliğiyle birleştiriyoruz.
          </p>

          <div className="hero-text mt-8 flex flex-wrap gap-4">
            <Link href="#iletisim" className="magnetic-btn px-8 py-4 bg-accent text-primary rounded-full font-bold tracking-wide shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-transform hover:scale-[1.03]">
              <span className="relative z-10">Ofisimizi Ziyaret Edin</span>
            </Link>
            <Link href="/mevzuat" className="magnetic-btn px-8 py-4 border border-white/20 text-light rounded-full font-semibold tracking-wide hover:border-accent hover:text-accent transition-all">
              <span className="relative z-10">İçtihat Bankasına Git</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Photo */}
        <div className="hero-photo-container hidden lg:flex justify-end items-end relative h-full">
          <div className="relative w-[450px] aspect-[3/4] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
            <img 
              src="/fethi-guzel.jpg" 
              alt="Av. Fethi Güzel"
              className="w-full h-full object-cover grayscale-[0.3] brightness-90 hover:grayscale-0 transition-all duration-700"
            />
            {/* Soft Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-4 -right-4 w-32 h-32 border-b-2 border-r-2 border-accent/30 rounded-br-[3rem]"></div>
          <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-accent/20 rounded-tl-[3rem]"></div>
        </div>
      </div>
    </section>
  );
}
