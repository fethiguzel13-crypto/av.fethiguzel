"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer id="iletisim" className="bg-[#08080C] text-light pt-24 pb-12 px-6 rounded-t-[4rem] relative z-20 mt-[-2rem]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
        
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-5 flex flex-col items-start">
          <Link href="/" className="font-drama font-bold text-4xl mb-6">FG.</Link>
          <p className="font-sans text-light/60 text-lg max-w-sm mb-8">
            Özel hukukta akademik uzmanlık. Tüm Türkiye'de çözüm odaklı temsil.
          </p>
          
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-data text-xs tracking-widest text-light/80 uppercase">System Operational</span>
          </div>
        </div>

        {/* Links Column */}
        <div className="col-span-1 md:col-span-3">
          <h4 className="font-sans font-bold mb-6 text-lg">Hukuk Portalı</h4>
          <ul className="flex flex-col gap-4 font-sans text-light/60">
            <li><Link href="/medeni-hukuk" className="hover:text-accent transition-colors">Medeni Hukuk</Link></li>
            <li><Link href="/borclar-hukuku" className="hover:text-accent transition-colors">Borçlar Hukuku</Link></li>
            <li><Link href="/ticaret-hukuku" className="hover:text-accent transition-colors">Ticaret Hukuku</Link></li>
            <li><Link href="#makaleler" className="hover:text-accent transition-colors">Makalelerim</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="col-span-1 md:col-span-4 flex flex-col">
          <h4 className="font-sans font-bold mb-6 text-lg">İletişim & Lokasyon</h4>
          <p className="font-sans text-light/60 mb-4">
            Van Yolu Mah. Karayusuf Bey Bulvarı<br/>
            EYC İş Merkezi A Blok Kat 4 Daire 37<br/>
            Erciş / VAN
          </p>
          <div className="w-full h-40 rounded-2xl overflow-hidden border border-white/10 mt-4">
            <iframe 
              src="https://maps.google.com/maps?q=Van%20Yolu%20Mah.%20Karayusuf%20Bey%20Bulvar%C4%B1%20EYC%20%C4%B0%C5%9F%20Merkezi%20Erci%C5%9F%20Van&t=&z=14&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between font-sans text-sm text-light/40">
        <p>&copy; {new Date().getFullYear()} Av. Fethi Güzel. Tüm hakları saklıdır.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="#" className="hover:text-light transition-colors">Gizlilik Politikası</Link>
          <Link href="#" className="hover:text-light transition-colors">Aydınlatma Metni</Link>
        </div>
      </div>
    </footer>
  );
}
