"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out w-[95%] max-w-5xl rounded-[2rem] px-6 py-4 flex items-center justify-between ${
        scrolled
          ? "bg-primary/80 backdrop-blur-xl border border-white/10 shadow-2xl"
          : "bg-transparent border border-transparent"
      }`}
    >
      <Link href="/" className="font-drama font-bold text-2xl tracking-tighter text-light">
        FG.
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="#hakkimda" className="text-sm font-sans tracking-wide hover:text-accent transition-colors duration-300">
          Felsefe
        </Link>
        <Link href="#uzmanlik" className="text-sm font-sans tracking-wide hover:text-accent transition-colors duration-300">
          Uzmanlık
        </Link>
        <Link href="/mevzuat" className="text-sm font-sans tracking-wide text-accent font-semibold hover:text-light transition-colors duration-300">
          İçtihat Bankası
        </Link>
        <Link href="#makaleler" className="text-sm font-sans tracking-wide hover:text-accent transition-colors duration-300">
          Makalelerim
        </Link>
      </div>

      <div className="hidden md:block">
        <Link href="#iletisim" className="magnetic-btn px-6 py-2 rounded-full border border-accent text-accent hover:text-primary text-sm font-semibold tracking-wide">
          <span className="relative z-10">Bize Ulaşın</span>
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-light"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-primary/95 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
          <Link href="#hakkimda" onClick={() => setMobileMenuOpen(false)} className="text-lg font-sans">Felsefe</Link>
          <Link href="#uzmanlik" onClick={() => setMobileMenuOpen(false)} className="text-lg font-sans">Uzmanlık</Link>
          <Link href="/mevzuat" onClick={() => setMobileMenuOpen(false)} className="text-lg font-sans text-accent">İçtihat Bankası</Link>
          <Link href="#makaleler" onClick={() => setMobileMenuOpen(false)} className="text-lg font-sans">Makalelerim</Link>
          <Link href="#iletisim" onClick={() => setMobileMenuOpen(false)} className="mt-4 px-6 py-3 rounded-full border border-accent text-accent text-center text-sm font-semibold">
            Bize Ulaşın
          </Link>
        </div>
      )}
    </nav>
  );
}
