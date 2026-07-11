"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Scale, Users, Home as HomeIcon, Briefcase, Landmark, Gavel,
  Mail, Video, MapPin, ArrowRight, ChevronDown,
} from "lucide-react";

const HIZMET_ALANLARI = [
  { icon: Gavel, ad: "Ceza Hukuku", aciklama: "Soruşturma ve kovuşturma aşamalarında sanık/mağdur vekilliği, ağır ceza ve asliye ceza davaları." },
  { icon: Users, ad: "Aile Hukuku", aciklama: "Boşanma, velayet, nafaka, mal paylaşımı ve aile içi uyuşmazlıklarda temsil." },
  { icon: Landmark, ad: "Miras Hukuku", aciklama: "Veraset ilamı, miras paylaşımı, tenkis ve mirasçılık davaları." },
  { icon: HomeIcon, ad: "Gayrimenkul Hukuku", aciklama: "Tapu iptal ve tescil, izale-i şüyu, kamulaştırma ve kira uyuşmazlıkları." },
  { icon: Briefcase, ad: "İş Hukuku", aciklama: "Kıdem/ihbar tazminatı, işe iade ve iş kazası davaları." },
  { icon: Scale, ad: "Borçlar & Ticaret Hukuku", aciklama: "Alacak davaları, sözleşme uyuşmazlıkları ve şirket danışmanlığı." },
  { icon: Landmark, ad: "İcra ve İflas Hukuku", aciklama: "İcra takibi, itirazın iptali ve borçlu/alacaklı vekilliği." },
  { icon: Gavel, ad: "İdare ve Vergi Hukuku", aciklama: "İptal davaları, tam yargı davaları ve vergi uyuşmazlıkları." },
];

const SSS = [
  {
    soru: "Avukatlık ücreti nasıl belirlenir?",
    cevap: "Ücretlendirme, Avukatlık Asgari Ücret Tarifesi esas alınarak davanın niteliği, değeri ve iş yüküne göre belirlenir. İlk görüşmede size özel, şeffaf bir ücret bilgisi verilir.",
  },
  {
    soru: "Yüz yüze gelmeden önce e-posta veya video ile görüşebilir miyim?",
    cevap: "Evet. Uzak ilçe veya illerden müvekkillerimizle e-posta ve video görüşmesi yoluyla ön değerlendirme yapılabilir; evrak ve belgeler dijital ortamda paylaşılabilir.",
  },
  {
    soru: "Davamı bulunduğum yerdeki mahkemede takip edebilir misiniz?",
    cevap: "Evet, yetkili mahkeme neresi olursa olsun dosya takibi ve duruşma temsili sağlanabilir; gerektiğinde ilgili adliyeye gidilerek işlemler yürütülür.",
  },
  {
    soru: "İlk görüşme ücretli mi?",
    cevap: "İlk ön değerlendirme görüşmesinde davanızın niteliği hakkında genel bilgi verilir; görüşme sonrası süreç ve ücretlendirme netleştirilir.",
  },
];

export interface IlceVerisi {
  ilce: string;
  il: string;
  slug: string;
  eyebrow: string;
  giris: string[];
  neden: string;
}

export default function IlceAvukatSayfasi({ veri }: { veri: IlceVerisi }) {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      {/* JSON-LD: bu sayfaya özel LegalService + FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Attorney",
            "name": "Av. Fethi Güzel",
            "description": `${veri.ilce} ve çevresinde hukuki danışmanlık ve dava vekilliği hizmeti veren Av. Fethi Güzel Hukuk Bürosu.`,
            "url": `https://avfethiguzel.com/${veri.slug}`,
            "areaServed": { "@type": "City", "name": veri.ilce },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Vanyolu Mah. Karayusuf Bey Bulvarı Zenginler İş Hanı Kat 4 No 26",
              "addressLocality": "Erciş",
              "addressRegion": "Van",
              "postalCode": "65400",
              "addressCountry": "TR",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": SSS.map(s => ({
              "@type": "Question",
              "name": s.soru,
              "acceptedAnswer": { "@type": "Answer", "text": s.cevap },
            })),
          }),
        }}
      />

      <main className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-5 sm:px-6 max-w-5xl mx-auto">
        {/* Başlık */}
        <header className="mb-12 sm:mb-16">
          <p className="text-accent font-mono text-[10px] sm:text-[11px] tracking-widest uppercase mb-3 sm:mb-4">
            {veri.eyebrow}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-4 sm:mb-5 leading-tight">
            {veri.ilce} <span className="font-drama italic text-accent">Avukat</span>
          </h1>
          {veri.giris.map((p, i) => (
            <p key={i} className="text-charcoal/60 text-base sm:text-lg leading-relaxed max-w-3xl mb-4">
              {p}
            </p>
          ))}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-7 sm:mt-8">
            <a
              href="mailto:av.fethiguzel@hotmail.com"
              className="group flex items-center justify-center gap-2 bg-accent text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-accent/90 transition-colors"
            >
              <Mail size={16} />
              <span>E-posta ile İletişime Geçin</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              href="/#iletisim"
              className="flex items-center justify-center gap-2 bg-charcoal/5 text-charcoal px-6 py-3.5 rounded-full font-bold text-sm hover:bg-charcoal/10 transition-colors"
            >
              <Video size={16} />
              <span>Online Danışmanlık Talep Et</span>
            </Link>
          </div>
        </header>

        {/* Neden bölümü */}
        <section className="mb-14 sm:mb-20 bg-white border border-charcoal/6 rounded-2xl sm:rounded-[2rem] p-6 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal mb-4">
            {veri.ilce}&apos;de Hukuki Destek
          </h2>
          <p className="text-charcoal/60 leading-relaxed text-sm sm:text-base">{veri.neden}</p>
        </section>

        {/* Hizmet Alanları */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal mb-2">
            {veri.ilce}&apos;de Sunulan Hukuki Hizmetler
          </h2>
          <p className="text-charcoal/50 text-sm mb-6 sm:mb-8">
            Aşağıdaki alanların tümünde {veri.ilce} ve çevresinden gelen müvekkillere danışmanlık ve dava vekilliği sağlanmaktadır.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {HIZMET_ALANLARI.map(h => (
              <div key={h.ad} className="bg-white border border-charcoal/6 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4">
                <h.icon size={20} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-charcoal text-sm mb-1">{h.ad}</h3>
                  <p className="text-charcoal/50 text-xs leading-relaxed">{h.aciklama}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nasıl Çalışıyoruz */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal mb-6 sm:mb-8">Nasıl Çalışıyoruz?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { no: "01", baslik: "İletişime Geçin", aciklama: "E-posta veya web sitesi üzerinden talebinizi iletin." },
              { no: "02", baslik: "Ön Değerlendirme", aciklama: "Yüz yüze, e-posta veya video görüşmeyle dosyanız değerlendirilir." },
              { no: "03", baslik: "Süreç Takibi", aciklama: "Vekillik anlaşması sonrası dosyanız titizlikle ve düzenli bilgilendirmeyle takip edilir." },
            ].map(a => (
              <div key={a.no} className="bg-charcoal rounded-2xl sm:rounded-[2rem] p-6 sm:p-8">
                <span className="text-accent font-heading text-3xl font-bold">{a.no}</span>
                <h3 className="text-cream font-bold text-sm mt-3 mb-2">{a.baslik}</h3>
                <p className="text-cream/50 text-xs leading-relaxed">{a.aciklama}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SSS */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal mb-6 sm:mb-8">Sıkça Sorulan Sorular</h2>
          <div className="flex flex-col gap-3">
            {SSS.map((s, i) => (
              <div key={i} className="bg-white border border-charcoal/6 rounded-xl sm:rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
                >
                  <span className="font-bold text-charcoal text-sm">{s.soru}</span>
                  <ChevronDown
                    size={18}
                    className={`text-charcoal/30 shrink-0 ml-3 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-charcoal/55 text-sm leading-relaxed">{s.cevap}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Ofis / İletişim */}
        <section className="bg-charcoal rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 text-center">
          <MapPin className="text-accent mx-auto mb-3" size={24} />
          <h3 className="text-xl sm:text-2xl font-bold text-cream mb-2 sm:mb-3">
            Ofisimiz Erciş&apos;te, Hizmetimiz {veri.ilce}&apos;de
          </h3>
          <p className="text-cream/55 mb-5 sm:mb-6 text-sm leading-relaxed max-w-md mx-auto">
            Vanyolu Mah. Karayusuf Bey Bulvarı, Zenginler İş Hanı Kat 4 No 26, Erciş / Van.
            Talebinize göre yüz yüze, e-posta veya video görüşmesiyle destek sağlanır.
          </p>
          <Link
            href="/#iletisim"
            className="inline-block bg-accent text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm hover:bg-accent/90 transition-colors"
          >
            İletişime Geçin
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
