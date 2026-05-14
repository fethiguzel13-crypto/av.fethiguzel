"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Scale, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Hakkımda', href: '/#manifesto' },
    { name: 'Güncel', href: '/icthat' },
    {
      name: 'Medeni Hukuk',
      href: '/mevzuat',
      dropdown: [
        { name: 'Başlangıç Hükümleri', href: '/kategori/tmk-baslangic' },
        { name: 'Kişiler Hukuku', href: '/kategori/kisiler-hukuku' },
        { name: 'Aile Hukuku', href: '/kategori/aile-hukuku' },
        { name: 'Miras Hukuku', href: '/kategori/miras-hukuku' },
        { name: 'Eşya Hukuku', href: '/kategori/esya-hukuku' },
      ]
    },
    { 
      name: 'Borçlar Hukuku', 
      href: '/mevzuat',
      dropdown: [
        { name: 'Genel Hükümler', href: '/kategori/borclar-genel' },
        { name: 'Özel Hükümler', href: '/kategori/borclar-ozel' },
      ]
    },
    { 
      name: 'Ticaret Hukuku', 
      href: '/mevzuat',
      dropdown: [
        { name: 'Ticari İşletme Hukuku', href: '/kategori/ticari-isletme' },
        { name: 'Şirketler Hukuku', href: '/kategori/ticari-sirketler' },
        { name: 'Kıymetli Evrak Hukuku', href: '/kategori/kiymetli-evrak' },
        { name: 'Sigorta Hukuku', href: '/kategori/sigorta-hukuku' },
      ]
    },
    { name: 'Makalelerim', href: '/makaleler' },
    { name: 'Eserlerim', href: '/eserlerim' },
  ];

  return (
    <nav className={`fixed top-8 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-7xl transition-all duration-500 rounded-pill ${
      scrolled ? 'glass py-3 px-8' : 'bg-transparent py-6 px-4'
    }`}>
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold font-heading tracking-tight flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-cream transition-transform group-hover:rotate-12">
            <Scale size={18} />
          </div>
          <span className={scrolled ? 'text-charcoal' : 'text-cream'}>AV. FETHİ GÜZEL</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 font-heading text-[13px] font-bold tracking-wide">
          {menuItems.map((item) => (
            <div key={item.name} className="relative group/item py-2">
              <Link 
                href={item.href} 
                className={`flex items-center gap-1 ${scrolled ? 'text-charcoal' : 'text-cream/80'} hover:text-accent transition-colors uppercase`}
              >
                {item.name}
                {item.dropdown && <ChevronDown size={14} className="opacity-40 group-hover/item:rotate-180 transition-transform" />}
              </Link>

              {item.dropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 glass rounded-2xl p-4 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 transform translate-y-2 group-hover/item:translate-y-0 shadow-2xl border border-charcoal/5">
                  <div className="flex flex-col gap-2">
                    {item.dropdown.map((sub) => (
                      <Link 
                        key={sub.name} 
                        href={sub.href} 
                        className="text-charcoal/70 hover:text-accent hover:bg-accent/5 px-4 py-2 rounded-xl transition-all text-xs"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Link 
          href="/#iletisim" 
          className="hidden lg:block relative overflow-hidden group magnetic-btn bg-accent text-white px-6 py-2.5 rounded-full text-xs font-bold shrink-0"
        >
          <span className="relative z-10">DANIŞMANLIK</span>
          <div className="absolute inset-0 w-0 bg-charcoal transition-all duration-500 ease-out group-hover:w-full"></div>
        </Link>

        <button className={scrolled ? 'lg:hidden text-charcoal' : 'lg:hidden text-cream'} onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="absolute top-full left-0 right-0 mt-4 glass rounded-[2rem] p-6 flex flex-col gap-2 lg:hidden max-h-[80vh] overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.name} className="flex flex-col gap-2">
              <Link 
                href={item.href} 
                className="text-charcoal font-heading text-lg font-bold uppercase py-2 border-b border-charcoal/5" 
                onClick={() => !item.dropdown && setMobileMenu(false)}
              >
                {item.name}
              </Link>
              {item.dropdown && (
                <div className="pl-4 flex flex-col gap-2 mb-4">
                  {item.dropdown.map((sub) => (
                    <Link 
                      key={sub.name} 
                      href={sub.href} 
                      className="text-charcoal/60 text-sm font-medium" 
                      onClick={() => setMobileMenu(false)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
