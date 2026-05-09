"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

const menuData = [
  {
    label: "Medeni Hukuk",
    href: "/medeni-hukuk",
    items: [
      { label: "Başlangıç Hükümleri", href: "/medeni-hukuk/baslangic-hukumleri" },
      { label: "Kişiler Hukuku", href: "/medeni-hukuk/kisiler-hukuku" },
      { label: "Aile Hukuku", href: "/medeni-hukuk/aile-hukuku" },
      { label: "Miras Hukuku", href: "/medeni-hukuk/miras-hukuku" },
      { label: "Eşya Hukuku", href: "/medeni-hukuk/esya-hukuku" },
    ],
  },
  {
    label: "Borçlar Hukuku",
    href: "/borclar-hukuku",
    items: [
      { label: "Genel Hükümler", href: "/borclar-hukuku/genel-hukumler" },
      { label: "Özel Hükümler", href: "/borclar-hukuku/ozel-hukumler" },
    ],
  },
  {
    label: "Ticaret Hukuku",
    href: "/ticaret-hukuku",
    items: [
      { label: "Ticari İşletme Hukuku", href: "/ticaret-hukuku/ticari-isletme-hukuku" },
      { label: "Şirketler Hukuku", href: "/ticaret-hukuku/sirketler-hukuku" },
      { label: "Kıymetli Evrak Hukuku", href: "/ticaret-hukuku/kiymetli-evrak-hukuku" },
      { label: "Sigorta Hukuku", href: "/ticaret-hukuku/sigorta-hukuku" },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out w-[95%] max-w-6xl rounded-[2rem] px-6 py-4 flex items-center justify-between ${
        scrolled
          ? "bg-primary/80 backdrop-blur-xl border border-white/10 shadow-2xl"
          : "bg-transparent border border-transparent"
      }`}
    >
      <Link href="/" className="font-drama font-bold text-2xl tracking-tighter text-light">
        FG.
      </Link>

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-6">
        <Link href="#hakkimda" className="text-sm font-sans tracking-wide hover:text-accent transition-colors duration-300">
          Hakkımda
        </Link>

        {menuData.map((menu) => (
          <div
            key={menu.label}
            className="relative"
            onMouseEnter={() => setOpenDropdown(menu.label)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="text-sm font-sans tracking-wide hover:text-accent transition-colors duration-300 flex items-center gap-1 focus:outline-none">
              {menu.label}
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${openDropdown === menu.label ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 ease-out ${
                openDropdown === menu.label
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="bg-primary/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2 min-w-[220px]">
                {menu.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2.5 text-sm font-sans text-light/80 hover:text-accent hover:bg-white/5 rounded-xl transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}

        <Link href="#makaleler" className="text-sm font-sans tracking-wide hover:text-accent transition-colors duration-300">
          Makalelerim
        </Link>
      </div>

      <div className="hidden lg:block">
        <Link href="#iletisim" className="magnetic-btn px-6 py-2 rounded-full border border-accent text-accent hover:text-primary text-sm font-semibold tracking-wide">
          <span className="relative z-10">Bize Ulaşın</span>
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="lg:hidden text-light"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-primary/95 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6 flex flex-col gap-3 shadow-2xl">
          <Link href="#hakkimda" onClick={() => setMobileMenuOpen(false)} className="text-lg font-sans py-1">
            Hakkımda
          </Link>

          {menuData.map((menu) => (
            <div key={menu.label}>
              <button
                className="w-full text-left text-lg font-sans py-1 flex items-center justify-between hover:text-accent transition-colors"
                onClick={() => setMobileExpandedMenu(mobileExpandedMenu === menu.label ? null : menu.label)}
              >
                {menu.label}
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${mobileExpandedMenu === menu.label ? "rotate-180" : ""}`}
                />
              </button>
              {mobileExpandedMenu === menu.label && (
                <div className="pl-4 flex flex-col gap-2 mt-2 border-l-2 border-accent/30 ml-2">
                  {menu.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-sans text-light/70 hover:text-accent transition-colors py-1"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link href="#makaleler" onClick={() => setMobileMenuOpen(false)} className="text-lg font-sans py-1">
            Makalelerim
          </Link>
          <Link
            href="#iletisim"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 px-6 py-3 rounded-full border border-accent text-accent text-center text-sm font-semibold"
          >
            Bize Ulaşın
          </Link>
        </div>
      )}
    </nav>
  );
}
