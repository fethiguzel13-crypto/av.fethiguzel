"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const text1Ref = useRef<HTMLParagraphElement>(null);
  const text2Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.to(".parallax-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Text Fade-up
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      });

      timeline
        .fromTo(
          text1Ref.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        )
        .fromTo(
          text2Ref.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
          "-=0.6"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hakkimda"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center py-32 px-6 overflow-hidden bg-primary"
    >
      {/* Parallax Background */}
      <div 
        className="parallax-bg absolute inset-[-20%] z-0 bg-cover bg-center opacity-10 mix-blend-luminosity grayscale"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop')" }} // Dark luxury texture
      ></div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-start gap-8">
        <p ref={text1Ref} className="text-xl md:text-3xl text-light/60 font-sans tracking-wide max-w-2xl">
          Çoğu avukatlık pratiği şuna odaklanır: Geleneksel ihtilaf çözümü ve yüzeysel süreç takibi.
        </p>
        
        <p ref={text2Ref} className="text-4xl md:text-7xl font-sans font-bold text-light max-w-4xl leading-tight">
          Biz odaklanıyoruz: <span className="font-drama italic text-accent font-normal block mt-4">Akademik temelli, teknoloji entegreli içtihat mühendisliği.</span>
        </p>
      </div>
    </section>
  );
}
