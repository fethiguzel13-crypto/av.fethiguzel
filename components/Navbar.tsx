"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Scale, ChevronDown, Search } from 'lucide-react';

const MEVZUAT_GRUPLARI = [
  {
    grup: 'Medeni & Aile Hukuku',
    maddeler: [
      { ad: 'Başlangıç Hükümleri', href: '/kategori/tmk-baslangic' },
      { ad: 'Kişiler Hukuku', href: '/kategori/kisiler-hukuku' },
      { ad: 'Aile Hukuku', href: '/kategori/aile-hukuku' },
      { ad: 'Ailenin Korunması', href: '/kategori/aile-koruma' },
      { ad: 'Miras Hukuku', href: '/kategori/miras-hukuku' },
      { ad: 'Eşya Hukuku', href: '/kategori/esya-hukuku' },
      { ad: 'Kat Mülkiyeti', href: '/kategori/katmulkiyeti' },
    ],
  },
  {
    grup: 'Borçlar & Ticaret',
    maddeler: [
      { ad: 'Borçlar Genel', href: '/kategori/borclar-genel' },
      { ad: 'Borçlar Özel', href: '/kategori/borclar-ozel' },
      { ad: 'Ticari İşletme', href: '/kategori/ticari-isletme' },
      { ad: 'Şirketler', href: '/kategori/ticari-sirketler' },
      { ad: 'Kıymetli Evrak', href: '/kategori/kiymetli-evrak' },
      { ad: 'Çek Kanunu', href: '/kategori/cek' },
      { ad: 'Rekabetin Korunması', href: '/kategori/rkhk' },
      { ad: 'Bankacılık', href: '/kategori/bk' },
      { ad: 'Sermaye Piyasası', href: '/kategori/spk' },
    ],
  },
  {
    grup: 'Ceza & Usul',
    maddeler: [
      { ad: 'TCK Genel', href: '/kategori/tck-genel' },
      { ad: 'Kişilere Karşı Suçlar', href: '/kategori/tck-kisiler' },
      { ad: 'Topluma Karşı Suçlar', href: '/kategori/tck-toplum' },
      { ad: 'Millete/Devlete Karşı', href: '/kategori/tck-devlet' },
      { ad: 'Ceza Muhakemesi (CMK)', href: '/kategori/cmk' },
      { ad: 'Çocuk Koruma', href: '/kategori/cck' },
      { ad: 'HMK', href: '/kategori/hmk' },
      { ad: 'İcra ve İflas (İİK)', href: '/kategori/iik' },
      { ad: 'Tebligat Kanunu', href: '/kategori/tebligat' },
      { ad: 'Arabuluculuk', href: '/kategori/arabuluculuk' },
    ],
  },
  {
    grup: 'Vergi & Finans',
    maddeler: [
      { ad: 'Vergi Usul (VUK)', href: '/kategori/vuk' },
      { ad: 'Gelir Vergisi (GVK)', href: '/kategori/gvk' },
      { ad: 'Kurumlar Vergisi', href: '/kategori/kvk' },
      { ad: 'KDV Kanunu', href: '/kategori/kdvk' },
      { ad: 'ÖTV Kanunu', href: '/kategori/otv' },
      { ad: 'AATUHK', href: '/kategori/aatuhk' },
      { ad: 'Kaçakçılıkla Mücadele', href: '/kategori/kmk' },
    ],
  },
  {
    grup: 'İdare & Kamu',
    maddeler: [
      { ad: 'Devlet Memurları (DMK)', href: '/kategori/dmk' },
      { ad: 'Polis Vazife (PVSK)', href: '/kategori/pvsk' },
      { ad: 'Jandarma Teşkilat', href: '/kategori/jandarma' },
      { ad: 'TSK İç Hizmet', href: '/kategori/tsk-ic-hizmet' },
      { ad: 'İl İdaresi', href: '/kategori/il-idaresi' },
      { ad: 'Belediye', href: '/kategori/belediye' },
      { ad: 'Büyükşehir Belediyesi', href: '/kategori/buyuksehir' },
      { ad: 'İmar Kanunu', href: '/kategori/imar' },
      { ad: 'Kamulaştırma', href: '/kategori/kamulastirma' },
      { ad: 'Devlet İhale', href: '/kategori/devlet-ihale' },
      { ad: 'Kamu İhale Sözleşmeleri', href: '/kategori/kamu-ihale-sozlesmeleri' },
      { ad: 'Dernekler', href: '/kategori/dernekler' },
      { ad: 'Vakıflar', href: '/kategori/vakiflar' },
    ],
  },
  {
    grup: 'İş & Tüketici',
    maddeler: [
      { ad: 'İş Kanunu', href: '/kategori/is-kanunu' },
      { ad: 'SSGSSK', href: '/kategori/ssgssk' },
      { ad: 'Sendikalar ve TİS', href: '/kategori/sendikalar' },
      { ad: 'İş Sağlığı ve Güvenliği', href: '/kategori/isg' },
      { ad: 'Tüketicinin Korunması', href: '/kategori/tkhk' },
      { ad: 'KVKK', href: '/kategori/kvkk' },
      { ad: 'Karayolları Trafik', href: '/kategori/ktk' },
      { ad: 'Türk Vatandaşlığı', href: '/kategori/tvk' },
      { ad: 'Nüfus Hizmetleri', href: '/kategori/nhk' },
      { ad: 'Yabancılar (YUKK)', href: '/kategori/yukk' },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [navQ, setNavQ] = useState('');
  const megaRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const submitNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = navQ.trim();
    if (!q) {
      router.push('/ara');
      return;
    }
    setMobileOpen(false);
    setMegaOpen(false);
    router.push(`/ara?q=${encodeURIComponent(q)}`);
  };

  // Ana sayfa dışındaki sayfaların üstü açık zeminli olduğundan, navbar
  // oralarda her zaman "solid" (koyu yazı + glass) görünmeli; yoksa açık
  // krem yazı açık zeminde kaybolur. Ana sayfada eski davranış (scroll'a bağlı).
  const solid = scrolled || pathname !== '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mega on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const simpleLinks = [
    { name: 'Ara', href: '/ara' },
    { name: 'Rehber', href: '/bilgi' },
    { name: 'Hesaplama', href: '/hesaplama' },
    { name: 'Güncel', href: '/icthat' },
    { name: 'Yargı', href: '/yargi-kararlari' },
    { name: 'Hakkımda', href: '/avukat-fethi-guzel' },
    { name: 'Akademik', href: '/akademik-profil' },
    { name: 'Ders notları', href: '/ders-notlari' },
  ];

  const linkCls = solid ? 'text-charcoal hover:text-accent' : 'text-cream/85 hover:text-accent';

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-[900] w-[95%] max-w-7xl transition-all duration-500 rounded-[3rem] ${solid ? 'glass py-3 px-6' : 'bg-transparent py-4 px-4'
      }`}>
      <div className="flex items-center justify-between gap-3">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading font-bold text-lg tracking-tight group shrink-0"
        >
          <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-cream shadow-md shadow-accent/25 group-hover:rotate-12 transition-transform">
            <Scale size={17} />
          </div>
          <span className={`${solid ? 'text-charcoal' : 'text-cream'} tracking-tight`}>AV. FETHİ GÜZEL</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1 font-heading text-[12px] font-bold tracking-wide uppercase">
          {simpleLinks.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-3 py-2 rounded-full transition-colors ${linkCls}`}
            >
              {item.name}
            </Link>
          ))}

          {/* Mevzuat mega trigger */}
          <div ref={megaRef} className="relative">
            <button
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen(v => !v)}
              className={`flex items-center gap-1 px-3 py-2 rounded-full transition-colors ${linkCls}`}
            >
              Mevzuat
              <ChevronDown size={13} className={`transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`} />
            </button>

            {megaOpen && (
              <div
                onMouseLeave={() => setMegaOpen(false)}
                className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-[860px] max-w-[calc(100vw-2rem)] glass rounded-[2rem] shadow-2xl border border-charcoal/8 z-[9999] p-6 lg:p-8"
              >
                <div className="grid grid-cols-3 gap-x-10 gap-y-6">
                  {MEVZUAT_GRUPLARI.map(g => (
                    <div key={g.grup}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-3">{g.grup}</p>
                      <div className="flex flex-col gap-[3px]">
                        {g.maddeler.map(m => (
                          <Link
                            key={m.href}
                            href={m.href}
                            onClick={() => setMegaOpen(false)}
                            className="text-charcoal/65 hover:text-accent text-[11px] leading-5 transition-colors"
                          >
                            {m.ad}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-charcoal/8 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/ara"
                      onClick={() => setMegaOpen(false)}
                      className="text-[11px] font-bold text-accent hover:underline"
                    >
                      Mevzuat Ara →
                    </Link>
                    <Link
                      href="/mevzuat"
                      onClick={() => setMegaOpen(false)}
                      className="text-[11px] font-bold text-charcoal/50 hover:text-accent"
                    >
                      Tüm Kanunlar
                    </Link>
                  </div>
                  <span className="text-[10px] font-mono text-charcoal/30 uppercase tracking-widest">
                    45+ Kanun · 7800+ Madde
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gerçek arama — /ara?q= */}
        <form
          onSubmit={submitNavSearch}
          className={`hidden md:flex items-center gap-1 rounded-full border px-2.5 py-1.5 shrink-0 max-w-[14rem] lg:max-w-[16rem] ${solid ? 'border-charcoal/12 bg-white/90' : 'border-cream/25 bg-cream/10'
            }`}
          role="search"
        >
          <Search size={14} className={solid ? 'text-charcoal/40' : 'text-cream/70'} aria-hidden />
          <input
            type="search"
            value={navQ}
            onChange={(e) => setNavQ(e.target.value)}
            placeholder="Satım, kıdem, TBK…"
            aria-label="Site ve mevzuat ara"
            className={`w-full min-w-0 bg-transparent text-[11px] outline-none placeholder:opacity-60 ${solid ? 'text-charcoal placeholder:text-charcoal/40' : 'text-cream placeholder:text-cream/55'
              }`}
          />
        </form>

        {/* CTA */}
        <Link
          href="/#iletisim"
          className="hidden lg:block relative overflow-hidden group bg-accent text-white px-5 py-2.5 rounded-full text-[11px] font-bold shrink-0 transition-all"
        >
          <span className="relative z-10">DANIŞMANLIK</span>
          <div className="absolute inset-0 w-0 bg-charcoal transition-all duration-500 group-hover:w-full rounded-full" />
        </Link>

        {/* Mobile burger */}
        <button
          className={`lg:hidden transition-colors ${solid ? 'text-charcoal' : 'text-cream'}`}
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Menü"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-cream rounded-[2rem] p-6 lg:hidden max-h-[82vh] overflow-y-auto flex flex-col gap-1 z-[9999] shadow-2xl border border-charcoal/10">
          {simpleLinks.map(item => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-charcoal font-heading font-bold uppercase text-base py-2.5 border-b border-charcoal/6"
            >
              {item.name}
            </Link>
          ))}
          <form onSubmit={submitNavSearch} className="mt-2 mb-3 flex gap-2" role="search">
            <input
              type="search"
              value={navQ}
              onChange={(e) => setNavQ(e.target.value)}
              placeholder="Satım, kıdem, TBK 207…"
              aria-label="Site ve mevzuat ara"
              className="flex-1 rounded-2xl border border-charcoal/12 bg-white px-4 py-3 text-sm text-charcoal"
            />
            <button
              type="submit"
              className="shrink-0 bg-charcoal text-white px-4 py-3 rounded-2xl font-bold text-sm"
            >
              Ara
            </button>
          </form>
          <div className="mt-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-charcoal/30 mb-4">Mevzuat</p>
            {MEVZUAT_GRUPLARI.map(g => (
              <div key={g.grup} className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">{g.grup}</p>
                <div className="pl-3 flex flex-col gap-1">
                  {g.maddeler.map(m => (
                    <Link
                      key={m.href}
                      href={m.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-charcoal/60 text-sm py-0.5"
                    >
                      {m.ad}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/#iletisim"
            onClick={() => setMobileOpen(false)}
            className="mt-4 block text-center bg-accent text-white py-3 rounded-2xl font-bold text-sm"
          >
            DANIŞMANLIK
          </Link>
        </div>
      )}
    </nav>
  );
}
