import type { Metadata } from "next";
import IlceAvukatSayfasi, { IlceVerisi } from "@/components/IlceAvukatSayfasi";

export const metadata: Metadata = {
  title: "Erciş Avukat | Av. Fethi Güzel — Merkez Ofis · Doktora · Kitap",
  description:
    "Erciş avukat: Av. Fethi Güzel merkez ofis. Özel hukuk doktora çalışmaları, e-duruşma monografisi, iyi düzeyde İngilizce. Ceza, aile, miras, iş, icra — yüz yüze bilgilendirme.",
  keywords: "Erciş avukat, Erciş avukatı, Fethi Güzel, Van Erciş avukat, boşanma avukatı Erciş, e-duruşma",
  alternates: { canonical: "https://avfethiguzel.com/ercis-avukat" },
  openGraph: {
    title: "Erciş Avukat | Av. Fethi Güzel",
    description: "Erciş merkez ofis — akademik arka plan ve dava vekilliği bilgilendirmesi.",
    url: "https://avfethiguzel.com/ercis-avukat",
    images: [{ url: "/images/av-fethi-guzel-og.jpg", width: 1200, height: 630, alt: "Av. Fethi Güzel Erciş avukat" }],
  },
};

const veri: IlceVerisi = {
  ilce: "Erciş",
  il: "Van",
  slug: "ercis-avukat",
  eyebrow: "Erciş · Van — Merkez Ofis",
  giris: [
    "Av. Fethi Güzel Hukuk Bürosu'nun merkez ofisi Erciş'te, Vanyolu Mahallesi'nde yer almaktadır. Erciş ve çevresinde yaşayan müvekkillerimize yüz yüze görüşme imkânıyla, randevu alarak veya doğrudan ofisimize gelerek danışmanlık alabilirsiniz.",
    "Ceza davalarından aile hukukuna, miras paylaşımından gayrimenkul uyuşmazlıklarına kadar geniş bir yelpazede, akademik bilgi birikimini pratik dava tecrübesiyle birleştiren bir yaklaşımla hizmet verilmektedir.",
  ],
  neden: "Erciş'te ikamet eden veya Erciş'teki mahkeme ve icra dairelerinde işi bulunan müvekkillerimiz için ofisimize kolayca ulaşabilir, dosyanızla ilgili yüz yüze ve ayrıntılı bir görüşme yapabilirsiniz. Şeffaf ücretlendirme, düzenli bilgilendirme ve akademik titizlikle hazırlanan dilekçe ve savunmalar, süreç boyunca önceliğimizdir.",
};

export default function ErcisAvukatPage() {
  return <IlceAvukatSayfasi veri={veri} />;
}
