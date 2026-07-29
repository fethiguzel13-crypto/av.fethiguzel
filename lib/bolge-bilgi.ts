/**
 * Bölgesel hukuki bilgilendirme içerikleri.
 * Reklam yasağına uygun: "X avukat" / "X avukatı" kalıbı yok.
 * Ana sayfada listelenmez; sitemap + /bilgi hub üzerinden keşfedilir.
 */

export type BolgeBolum = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BolgeFaq = { q: string; a: string };

export type BolgeBilgi = {
  /** Eski SEO URL (korunur; içerik bilgilendirmeye çevrildi) */
  slug: string;
  yerlesim: string;
  il: string;
  merkezOfis?: boolean;
  uzaktan?: boolean;
  /** Kısa dizin etiketi — "Avukat" kelimesi yok */
  dizinAd: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  eyebrow: string;
  lead: string[];
  sections: BolgeBolum[];
  faq: BolgeFaq[];
  /** /bilgi/{slug} iç linkleri */
  relatedBilgi: { label: string; href: string }[];
  /** Mevzuat / araç linkleri */
  links: { label: string; href: string }[];
};

const DISCLAIMER_FAQ: BolgeFaq = {
  q: 'Bu sayfa ne işe yarar?',
  a: 'Genel hukuki bilgilendirmedir; somut dosyada sonuç vaadi veya “en iyi avukat” iddiası içermez. Yerel uygulamalar ve delil durumuna göre yol haritası değişebilir; bireysel danışmanlık ayrıdır.',
};

export const BOLGE_BILGILERI: BolgeBilgi[] = [
  {
    slug: 'ercis-avukat',
    yerlesim: 'Erciş',
    il: 'Van',
    merkezOfis: true,
    dizinAd: 'Erciş hukuki bilgilendirme',
    title: 'Erciş’te Sık Karşılaşılan Hukuki Konular | Bilgilendirme',
    description:
      'Erciş ve çevresinde miras, aile, icra, taşınmaz ve iş uyuşmazlıklarına dair sade hukuki bilgilendirme. Genel rehber — sonuç vaadi yok.',
    keywords: [
      'Erciş miras paylaşımı',
      'Erciş boşanma süreci',
      'Erciş icra takibi',
      'Van Erciş hukuki bilgi',
      'taşınmaz uyuşmazlığı bilgilendirme',
    ],
    h1: 'Erciş’te sık karşılaşılan hukuki konular',
    eyebrow: 'Bölgesel bilgilendirme · Erciş / Van',
    lead: [
      'Erciş, Van ilinde hem tarımsal hem de kentsel işlemlerin yoğunlaştığı bir yerleşimdir. Tapu devri, miras intikali, aile hukuku ve icra dosyaları günlük hayatta en sık sorulan konuların başında gelir.',
      'Bu metin reklam veya iş edinme metni değildir. Amaç, sık aranan hukuki kavramları sade dilde açıklamak ve site içindeki mevzuat ile vatandaş rehberlerine yönlendirmektir.',
    ],
    sections: [
      {
        heading: 'Miras ve veraset işlemleri',
        paragraphs: [
          'Mirasçılık belgesi (veraset ilamı), yasal miras payları ve saklı pay kuralları TMK hükümlerine göre belirlenir. Yerel uygulamada sık görülen senaryo, birden fazla mirasçının aynı taşınmaz üzerinde paydaş kalması ve fiilî kullanımın yıllarca sürmesidir.',
          'Paylaşım anlaşması yapılamazsa izale-i şüyu (ortaklığın giderilmesi) yolu gündeme gelebilir. Önce envanter ve tapu kaydı netleştirilmeden dava stratejisi kurulmamalıdır.',
        ],
        bullets: [
          'Veraset ilamı için yetkili merciler ve e-Devlet seçenekleri',
          'Saklı pay ve tenkis talebinin zamanaşımı riski',
          'Mirasın reddi ve devletin mirasçılığı istisnaları',
        ],
      },
      {
        heading: 'Aile hukuku ve arabuluculuk',
        paragraphs: [
          'Boşanma, velayet, nafaka ve mal rejimi tasfiyesi aile mahkemesi yargılamasına girer. Anlaşmalı boşanmada protokol metni kritik olup tek cümlelik “mal paylaşımı yapılsın” ifadeleri sonradan uyuşmazlık doğurabilir.',
          'Bazı uyuşmazlıklarda arabuluculuk zorunlu veya en azından pratik bir ön adımdır. Anlaşma belgesi, şartları net yazıldığında icra edilebilirlik kazanır.',
        ],
      },
      {
        heading: 'İcra ve alacak',
        paragraphs: [
          'İlamlı ve ilamsız icra yolları, itirazın iptali/kaldırılması ve haczedilemezlik iddiaları İİK çerçevesinde yürür. Maaş haczi, taşınır haczi ve taşınmaz satışında usul hataları sık görülen risklerdir.',
          'Borçlu tarafında süreler kaçırıldığında itiraz hakkı zayıflar; alacaklı tarafında tebligat ve takip dosyasının güncelliği belirleyicidir.',
        ],
      },
      {
        heading: 'Taşınmaz, kira ve komşuluk',
        paragraphs: [
          'Kira tespit/tahliye, el atmanın önlenmesi ve irtifak hakkı uyuşmazlıkları bölgede sık sorulur. Sözleşme yazılı olmasa da ispat araçları (havale, tanık, mesaj) önem kazanır.',
          'İmar ve ruhsat meseleleri belediye ve idare hukuku katmanına taşınabilir; özel hukuk davası ile idari başvuru bazen paralel ilerler.',
        ],
      },
    ],
    faq: [
      DISCLAIMER_FAQ,
      {
        q: 'Miras payımı nasıl hesaplanır?',
        a: 'Önce yasal mirasçılar ve zümreler tespit edilir; saklı pay ve vasiyet/tenkis ayrı değerlendirilir. Sitedeki miras hesaplama aracı yalnızca kaba oryantasyon içindir, mahkeme kararı yerine geçmez.',
      },
      {
        q: 'İcra takibine itiraz süresi ne kadardır?',
        a: 'İlamsız icrada ödeme emrine itiraz kural olarak tebliğden itibaren yedi gündür (İİK). Süre ve usul dosyanın niteliğine göre değişir; tebligat tarihi belgelenmelidir.',
      },
      {
        q: 'Ofis adresi nedir?',
        a: 'Merkez ofis Erciş / Van’dadır. Adres ve iletişim bilgileri profil sayfasında yer alır. Bu sayfa konum tanıtımı değil, hukuki bilgilendirmedir.',
      },
    ],
    relatedBilgi: [
      { label: 'Miras paylaşımı', href: '/bilgi/miras-payi-nasil-hesaplanir' },
      { label: 'Veraset ilamı', href: '/bilgi/veraset-ilami-nasil-alinir' },
      { label: 'Kıdem tazminatı', href: '/bilgi/kidem-tazminati-nasil-alinir' },
      { label: 'Arabuluculuk', href: '/rehber/arabuluculuk' },
    ],
    links: [
      { label: 'TMK', href: '/mevzuat/tmk' },
      { label: 'TBK', href: '/mevzuat/tbk' },
      { label: 'İİK', href: '/mevzuat/iik' },
      { label: 'Hesaplama araçları', href: '/hesaplama' },
      { label: 'Vatandaş rehberi', href: '/bilgi' },
    ],
  },
  {
    slug: 'van-avukat',
    yerlesim: 'Van',
    il: 'Van',
    dizinAd: 'Van hukuki bilgilendirme',
    title: 'Van’da Miras, Taşınmaz ve Aile Hukuku Bilgilendirmesi',
    description:
      'Van merkez ve ilçelerinde miras, tapu, kira, aile ve ticaret uyuşmazlıklarına dair genel hukuki bilgilendirme. Reklam niteliği taşımaz.',
    keywords: [
      'Van miras paylaşımı',
      'Van tapu iptal tescil',
      'Van kira tahliye',
      'Van aile hukuku bilgi',
      'Doğu Anadolu hukuki rehber',
    ],
    h1: 'Van’da miras, taşınmaz ve aile hukuku bilgilendirmesi',
    eyebrow: 'Bölgesel bilgilendirme · Van',
    lead: [
      'Van il merkezinde iş hacmi; tapu işlemleri, miras intikalleri, kira ve ticari alacak dosyalarında yoğunlaşır. İlçe bağlantılı dosyalar da sıklıkla merkez mahkemelerde görünür.',
      'Aşağıdaki özet, “yerel avukat arama” metni değildir. Konu başlıklarını yasal çerçeveye oturtup site içi derin rehberlere köprü kurar.',
    ],
    sections: [
      {
        heading: 'Taşınmaz ve tapu uyuşmazlıkları',
        paragraphs: [
          'Tapu iptal ve tescil, kazandırıcı zamanaşımı, sınır uyuşmazlığı ve kamulaştırma bedeli gibi konular TMK ve ilgili özel kanunlarla iç içedir. Kadastro tespitine itiraz süreleri kaçırıldığında haklar zayıflayabilir.',
          'Satış vaadi, harici satış ve vekâletle devir senaryolarında ispat yükü ve muvazaa iddiaları sık gündeme gelir.',
        ],
        bullets: [
          'Resmî şekil ve tapu siciline güven ilkesi',
          'El birliği / paylı mülkiyet farkı',
          'İzale-i şüyu ve satışa elverişlilik',
        ],
      },
      {
        heading: 'Aile ve miras kesişimi',
        paragraphs: [
          'Boşanma sonrası mal rejimi tasfiyesi ile miras paylaşımı bazen aynı aile içinde peş peşe gelir. Edinilmiş mallara katılma rejiminde katkı payı ve değer artış payı hesapları delile bağlıdır.',
          'Vasiyetname şekil şartları (resmî, el yazısı, sözlü istisnalar) yerine getirilmezse geçersizlik riski doğar.',
        ],
      },
      {
        heading: 'Ticaret ve tüketici',
        paragraphs: [
          'Şirket ortaklık uyuşmazlıkları, çek-senet ve tüketici sözleşmeleri TTK / TKHK / TBK kesişiminde yürür. Tüketici uyuşmazlıklarında başvuru yolları ve parasal eşikler dönemsel olarak güncellenir.',
        ],
      },
      {
        heading: 'Ceza ve soruşturma bilgilendirmesi',
        paragraphs: [
          'Soruşturma ve kovuşturma aşamalarında haklar CMK ile güvence altındadır. İfade, tutuklama itirazı ve mağdur vekilliği ayrı usul adımlarıdır. Bu sayfa savunma stratejisi sunmaz; yalnızca genel çerçeve verir.',
        ],
      },
    ],
    faq: [
      DISCLAIMER_FAQ,
      {
        q: 'Tapu iptal davası ne kadar sürer?',
        a: 'Dosyanın delil yoğunluğuna, keşif ve bilirkişi ihtiyacına göre değişir. Süre vaadi verilemez; usul ve delil planı somut olayda netleşir.',
      },
      {
        q: 'Kira artış oranı nasıl hesaplanır?',
        a: 'TBK ve ilgili dönemsel sınırlamalar esas alınır. Sitedeki kira artış aracı bilgilendirme içindir; sözleşme maddesi ve yürürlük tarihi kontrol edilmelidir.',
      },
    ],
    relatedBilgi: [
      { label: 'Tapu iptal ve tescil', href: '/bilgi/tapu-iptal-tescil' },
      { label: 'İzale-i şüyu', href: '/bilgi/izale-i-suyu' },
      { label: 'Boşanma süreci', href: '/bilgi/bosanma-davasi-nasil-acilir' },
      { label: 'Kira tahliye', href: '/bilgi/kiraci-nasil-tahliye-edilir' },
    ],
    links: [
      { label: 'TMK', href: '/mevzuat/tmk' },
      { label: 'TBK', href: '/mevzuat/tbk' },
      { label: 'TTK', href: '/mevzuat/ttk' },
      { label: 'Hesaplama', href: '/hesaplama' },
      { label: 'Bilgi rehberi', href: '/bilgi' },
    ],
  },
  {
    slug: 'caldiran-avukat',
    yerlesim: 'Çaldıran',
    il: 'Van',
    dizinAd: 'Çaldıran hukuki bilgilendirme',
    title: 'Çaldıran’da Taşınmaz, Miras ve İcra Bilgilendirmesi',
    description:
      'Çaldıran’da tarımsal taşınmaz, miras paydaşlığı ve icra dosyalarına dair genel hukuki bilgilendirme. Sonuç vaadi içermez.',
    keywords: [
      'Çaldıran miras',
      'Çaldıran tapu',
      'Çaldıran icra',
      'Van Çaldıran hukuki bilgi',
    ],
    h1: 'Çaldıran’da taşınmaz, miras ve icra bilgilendirmesi',
    eyebrow: 'Bölgesel bilgilendirme · Çaldıran / Van',
    lead: [
      'Çaldıran’da uyuşmazlıkların önemli kısmı tarımsal taşınmaz, miras paydaşlığı ve icra takiplerinden kaynaklanır. Ulaşım mesafesi, tebligat ve duruşma planlamasını etkiler.',
      'Bu sayfa genel çerçeve sunar; somut dosyada belge ve süre incelemesi şarttır.',
    ],
    sections: [
      {
        heading: 'Tarımsal taşınmaz ve paydaşlık',
        paragraphs: [
          'El birliği mülkiyetinde tüm mirasçıların birlikte hareket etmesi gerekir; paylı mülkiyette her paydaş kendi payı üzerinde tasarruf edebilir. Bu ayrım satış, kira ve rehin işlemlerinde kritiktir.',
          'Fiilî kullanımın uzun sürmesi, zilyetlik ve ecrimisil taleplerini gündeme getirebilir.',
        ],
      },
      {
        heading: 'İcra ve tebligat',
        paragraphs: [
          'Kırsal adreslerde tebligat usulü ve komşu bilgilendirmesi dosyanın gidişatını değiştirir. Usulsüz tebligat iddiası süreleri etkileyebilir; yine de her iddia somut delile dayanmalıdır.',
        ],
      },
      {
        heading: 'Aile hukuku notları',
        paragraphs: [
          'Velayet ve nafaka kararlarının infazı ile çocukla kişisel ilişki, icra daireleri üzerinden de gündeme gelebilir. Protokol metinleri açık yazılmadığında uygulama sorunları artar.',
        ],
      },
    ],
    faq: [
      DISCLAIMER_FAQ,
      {
        q: 'Ecrimisil nedir?',
        a: 'Haksız işgal tazminatına benzer bir taleptir; paydaş veya malikin rızası olmadan taşınmazı kullananlara karşı gündeme gelebilir. Hesap, kullanım süresi ve emsal bedele bağlıdır.',
      },
    ],
    relatedBilgi: [
      { label: 'Ecrimisil', href: '/bilgi/ecrimisil-nedir' },
      { label: 'Miras paylaşımı', href: '/bilgi/miras-payi-nasil-hesaplanir' },
      { label: 'İcra takibi', href: '/bilgi/icra-takibi-nedir' },
    ],
    links: [
      { label: 'TMK', href: '/mevzuat/tmk' },
      { label: 'İİK', href: '/mevzuat/iik' },
      { label: 'Hesaplama', href: '/hesaplama' },
    ],
  },
  {
    slug: 'ozalp-avukat',
    yerlesim: 'Özalp',
    il: 'Van',
    dizinAd: 'Özalp hukuki bilgilendirme',
    title: 'Özalp’ta Miras, Sınır ve Taşınmaz Uyuşmazlıkları',
    description:
      'Özalp ve çevresinde miras, sınır/taşınmaz ve aile hukuku konularında genel bilgilendirme. Reklam yasağına uygun metin.',
    keywords: ['Özalp miras', 'Özalp tapu', 'Özalp sınır uyuşmazlığı', 'Van Özalp hukuki bilgi'],
    h1: 'Özalp’ta miras, sınır ve taşınmaz uyuşmazlıkları',
    eyebrow: 'Bölgesel bilgilendirme · Özalp / Van',
    lead: [
      'Özalp’ta kadastro, sınır ve miras kaynaklı taşınmaz dosyaları sık sorulur. Sınır komşuluğu ve zilyetlik iddiaları delil planını belirler.',
    ],
    sections: [
      {
        heading: 'Sınır ve kadastro',
        paragraphs: [
          'Kadastro tespitine itiraz ve sınırın düzeltilmesi talepleri süreye bağlıdır. Eski harita, tanık ve bilirkişi keşfi çoğu dosyada zorunlu hale gelir.',
        ],
      },
      {
        heading: 'Miras ve ortaklık',
        paragraphs: [
          'Birden fazla mirasçının aynı tarlada fiilen tarım yapması, ileride satış ve rehin işlemlerini kilitleyebilir. Önce hukuki pay durumu netleştirilmelidir.',
        ],
      },
      {
        heading: 'Sözleşmeler ve ispat',
        paragraphs: [
          'Yazılı sözleşme yoksa TBK ispat kuralları ve tanık delili devreye girer. Büyük miktarlı iddialarda yazılı delil ihtiyacı artar.',
        ],
      },
    ],
    faq: [DISCLAIMER_FAQ],
    relatedBilgi: [
      { label: 'Tapu iptal', href: '/bilgi/tapu-iptal-tescil' },
      { label: 'Miras', href: '/bilgi/miras-payi-nasil-hesaplanir' },
    ],
    links: [
      { label: 'TMK', href: '/mevzuat/tmk' },
      { label: 'HMK', href: '/mevzuat/hmk' },
      { label: 'Bilgi', href: '/bilgi' },
    ],
  },
  {
    slug: 'muradiye-avukat',
    yerlesim: 'Muradiye',
    il: 'Van',
    dizinAd: 'Muradiye hukuki bilgilendirme',
    title: 'Muradiye’de Aile, Miras ve İş Hukuku Bilgilendirmesi',
    description:
      'Muradiye’de aile, miras, iş ve icra konularına dair genel hukuki bilgilendirme. Sonuç vaadi yoktur.',
    keywords: ['Muradiye miras', 'Muradiye boşanma bilgi', 'Muradiye iş hukuku', 'Van Muradiye'],
    h1: 'Muradiye’de aile, miras ve iş hukuku bilgilendirmesi',
    eyebrow: 'Bölgesel bilgilendirme · Muradiye / Van',
    lead: [
      'Muradiye’de aile hukuku, miras ve iş sözleşmesinden doğan alacaklar sık aranan konulardır. Aşağıdaki özet yasal çerçeveyi hatırlatır.',
    ],
    sections: [
      {
        heading: 'İş hukuku özeti',
        paragraphs: [
          'Kıdem, ihbar, yıllık izin ücreti ve işe iade koşulları İş Kanunu ve ilgili Yargıtay içtihatları çerçevesinde değerlendirilir. Arabuluculuk birçok iş uyuşmazlığında dava şartıdır.',
        ],
      },
      {
        heading: 'Aile ve nafaka',
        paragraphs: [
          'Tedbir, yoksulluk ve iştirak nafakası ayrı hukuki temellere dayanır. Gelir ispatı ve çocuk yararı ilkesi belirleyicidir.',
        ],
      },
      {
        heading: 'Miras ve veraset',
        paragraphs: [
          'Veraset ilamı sonrası tapu intikali yapılmadan satış işlemleri takılır. Ortaklığın giderilmesi davası son çare olarak düşünülmelidir.',
        ],
      },
    ],
    faq: [
      DISCLAIMER_FAQ,
      {
        q: 'İşçi alacağı için arabuluculuk zorunlu mu?',
        a: 'Birçok işçi-işveren alacağı ve işe iade talebinde arabuluculuk dava şartıdır. İstisnalar ve kapsam dosya türüne göre kontrol edilmelidir.',
      },
    ],
    relatedBilgi: [
      { label: 'Kıdem tazminatı', href: '/bilgi/kidem-tazminati-nasil-alinir' },
      { label: 'İşe iade', href: '/bilgi/ise-iade-davasi' },
      { label: 'Nafaka', href: '/bilgi/nafaka-davasi-nedir' },
    ],
    links: [
      { label: 'İş Kanunu', href: '/mevzuat/is-kanunu' },
      { label: 'TMK', href: '/mevzuat/tmk' },
      { label: 'Hesaplama', href: '/hesaplama' },
    ],
  },
  {
    slug: 'patnos-avukat',
    yerlesim: 'Patnos',
    il: 'Ağrı',
    dizinAd: 'Patnos hukuki bilgilendirme',
    title: 'Patnos’ta İcra, Ceza ve Taşınmaz Bilgilendirmesi',
    description:
      'Patnos’ta icra, ceza soruşturması ve taşınmaz uyuşmazlıklarına dair genel bilgilendirme. Reklam niteliği taşımaz.',
    keywords: ['Patnos icra', 'Patnos taşınmaz', 'Patnos hukuki bilgi', 'Ağrı Patnos'],
    h1: 'Patnos’ta icra, ceza ve taşınmaz bilgilendirmesi',
    eyebrow: 'Bölgesel bilgilendirme · Patnos / Ağrı',
    lead: [
      'Patnos’ta icra takipleri, ceza soruşturmaları ve taşınmaz paydaşlığı dosyaları sık sorulur. Usul süreleri ve tebligat kaydı kritik önemdedir.',
    ],
    sections: [
      {
        heading: 'İcra pratikleri',
        paragraphs: [
          'Ödeme emrine itiraz, menfi tespit ve istihkak iddiaları farklı yollardır. Haciz sırasında haczedilemezlik listesi (maaşın bir kısmı, zorunlu eşya vb.) unutulmamalıdır.',
        ],
      },
      {
        heading: 'Ceza yargılaması çerçevesi',
        paragraphs: [
          'Şüpheli ve sanık hakları CMK’da düzenlenir. İfade alma, müdafi talebi ve tutukluluğa itiraz ayrı usul adımlarıdır. Bu metin savunma stratejisi değildir.',
        ],
      },
      {
        heading: 'Taşınmaz',
        paragraphs: [
          'Paydaşlar arası fiilî kullanım ve satış engelleri, izale-i şüyu ve ecrimisil talepleriyle kesişir. Önce tapu ve mirasçılık durumu netleşmelidir.',
        ],
      },
    ],
    faq: [DISCLAIMER_FAQ],
    relatedBilgi: [
      { label: 'İcra takibi', href: '/bilgi/icra-takibi-nedir' },
      { label: 'Haciz', href: '/bilgi/haciz-islemleri-nasil-yapilir' },
    ],
    links: [
      { label: 'İİK', href: '/mevzuat/iik' },
      { label: 'CMK', href: '/mevzuat/cmk' },
      { label: 'TMK', href: '/mevzuat/tmk' },
    ],
  },
  {
    slug: 'agri-avukat',
    yerlesim: 'Ağrı',
    il: 'Ağrı',
    dizinAd: 'Ağrı hukuki bilgilendirme',
    title: 'Ağrı’da Miras, İdare ve Taşınmaz Bilgilendirmesi',
    description:
      'Ağrı ilinde miras, idari işlemler ve taşınmaz uyuşmazlıklarına dair genel hukuki bilgilendirme.',
    keywords: ['Ağrı miras', 'Ağrı tapu', 'Ağrı idare hukuku bilgi', 'Ağrı hukuki rehber'],
    h1: 'Ağrı’da miras, idare ve taşınmaz bilgilendirmesi',
    eyebrow: 'Bölgesel bilgilendirme · Ağrı',
    lead: [
      'Ağrı’da miras intikali, idari başvurular ve taşınmaz dosyaları öne çıkar. İdari yargıda süreler (dava açma süreleri) özel hukuk sürelerinden farklı işler.',
    ],
    sections: [
      {
        heading: 'İdare ve tam yargı',
        paragraphs: [
          'İptal ve tam yargı davalarında menfaat, süre ve görevli mahkeme (idare/vergi) doğru tespit edilmelidir. Başvuru yolları tüketilmeden dava açmak bazen usul engeli doğurur.',
        ],
      },
      {
        heading: 'Miras ve tapu',
        paragraphs: [
          'Veraset sonrası intikal, hisse devri ve paydaşlık sorunları TMK ve tapu mevzuatıyla çözülür. Kamulaştırma bedeli uyuşmazlıkları ayrı bir idari-özel hukuk katmanıdır.',
        ],
      },
      {
        heading: 'Aile hukuku',
        paragraphs: [
          'Boşanma ve velayet dosyalarında delil (mesaj, tanık, sosyal inceleme) ve çocuk yararı ilkesi öne çıkar. Anlaşmalı protokol net yazılmalıdır.',
        ],
      },
    ],
    faq: [DISCLAIMER_FAQ],
    relatedBilgi: [
      { label: 'İptal davası', href: '/bilgi/iptal-davasi-nedir' },
      { label: 'Kamulaştırma', href: '/bilgi/kamulastirma-nedir' },
      { label: 'Miras', href: '/bilgi/miras-payi-nasil-hesaplanir' },
    ],
    links: [
      { label: 'TMK', href: '/mevzuat/tmk' },
      { label: 'İYUK', href: '/kategori/idare' },
      { label: 'Bilgi', href: '/bilgi' },
    ],
  },
  {
    slug: 'tatvan-avukat',
    yerlesim: 'Tatvan',
    il: 'Bitlis',
    dizinAd: 'Tatvan hukuki bilgilendirme',
    title: 'Tatvan’da Ticaret, Kira ve Aile Hukuku Bilgilendirmesi',
    description:
      'Tatvan’da ticaret, kira, aile ve taşınmaz konularında genel hukuki bilgilendirme. Reklam yasağına uygundur.',
    keywords: ['Tatvan kira', 'Tatvan ticaret hukuku', 'Tatvan aile hukuku', 'Bitlis Tatvan bilgi'],
    h1: 'Tatvan’da ticaret, kira ve aile hukuku bilgilendirmesi',
    eyebrow: 'Bölgesel bilgilendirme · Tatvan / Bitlis',
    lead: [
      'Tatvan, ulaşım ve ticaret hareketliliği nedeniyle kira, ticari alacak ve aile dosyalarının sık görüldüğü bir merkezdir.',
    ],
    sections: [
      {
        heading: 'Kira ve işyeri',
        paragraphs: [
          'Konut ve çatılı işyeri kiralarında TBK özel hükümleri uygulanır. Tahliye taahhüdü, ihtiyaç nedeniyle tahliye ve kira tespit davaları farklı şartlara bağlıdır.',
        ],
      },
      {
        heading: 'Ticari alacak ve kıymetli evrak',
        paragraphs: [
          'Çek, bono ve fatura alacaklarında zamanaşımı ve başvuru hakları TTK/TBK ile belirlenir. İcra takibi ile menfi tespit davası stratejisi somut delile göre seçilir.',
        ],
      },
      {
        heading: 'Aile hukuku',
        paragraphs: [
          'Anlaşmalı ve çekişmeli boşanma, velayet ve mal rejimi tasfiyesi aile mahkemesinde görülür. Arabuluculuk bazı yan uyuşmazlıklarda yararlı olabilir.',
        ],
      },
    ],
    faq: [DISCLAIMER_FAQ],
    relatedBilgi: [
      { label: 'Kira tahliye', href: '/bilgi/kiraci-nasil-tahliye-edilir' },
      { label: 'Çek hukuku', href: '/bilgi/cek-nasil-yazilir' },
      { label: 'Boşanma', href: '/bilgi/bosanma-davasi-nasil-acilir' },
    ],
    links: [
      { label: 'TBK', href: '/mevzuat/tbk' },
      { label: 'TTK', href: '/mevzuat/ttk' },
      { label: 'Hesaplama', href: '/hesaplama' },
    ],
  },
  {
    slug: 'bitlis-avukat',
    yerlesim: 'Bitlis',
    il: 'Bitlis',
    dizinAd: 'Bitlis hukuki bilgilendirme',
    title: 'Bitlis’te Miras, Taşınmaz ve İdare Bilgilendirmesi',
    description:
      'Bitlis ilinde miras, taşınmaz ve idari uyuşmazlıklara dair genel hukuki bilgilendirme.',
    keywords: ['Bitlis miras', 'Bitlis tapu', 'Bitlis idare hukuku', 'Bitlis hukuki rehber'],
    h1: 'Bitlis’te miras, taşınmaz ve idare bilgilendirmesi',
    eyebrow: 'Bölgesel bilgilendirme · Bitlis',
    lead: [
      'Bitlis’te miras intikali, tarihî/taşınmaz niteliği taşıyan uyuşmazlıklar ve idari başvurular sık gündeme gelir.',
    ],
    sections: [
      {
        heading: 'Miras ve ortaklık',
        paragraphs: [
          'Uzun yıllar fiilen bölünmüş taşınmazlarda hukuki pay durumu belirsiz kalabilir. Önce veraset ve tapu kaydı, sonra paylaşım veya satış planı yapılmalıdır.',
        ],
      },
      {
        heading: 'İdari işlemler',
        paragraphs: [
          'Belediye ve kamu kurum işlemlerine karşı idari başvuru ve dava yolları süreye bağlıdır. Özel hukuk davası her zaman doğru yol değildir.',
        ],
      },
      {
        heading: 'Aile ve iş',
        paragraphs: [
          'Boşanma, nafaka ve işçi alacakları usul kurallarıyla yürür. İş uyuşmazlıklarında arabuluculuk şartı kontrol edilmelidir.',
        ],
      },
    ],
    faq: [DISCLAIMER_FAQ],
    relatedBilgi: [
      { label: 'Miras', href: '/bilgi/miras-payi-nasil-hesaplanir' },
      { label: 'İptal davası', href: '/bilgi/iptal-davasi-nedir' },
    ],
    links: [
      { label: 'TMK', href: '/mevzuat/tmk' },
      { label: 'Bilgi', href: '/bilgi' },
    ],
  },
  {
    slug: 'adilcevaz-avukat',
    yerlesim: 'Adilcevaz',
    il: 'Bitlis',
    dizinAd: 'Adilcevaz hukuki bilgilendirme',
    title: 'Adilcevaz’da Taşınmaz, Miras ve Kira Bilgilendirmesi',
    description:
      'Adilcevaz’da taşınmaz, miras ve kira uyuşmazlıklarına dair genel hukuki bilgilendirme.',
    keywords: ['Adilcevaz miras', 'Adilcevaz tapu', 'Adilcevaz kira', 'Bitlis Adilcevaz'],
    h1: 'Adilcevaz’da taşınmaz, miras ve kira bilgilendirmesi',
    eyebrow: 'Bölgesel bilgilendirme · Adilcevaz / Bitlis',
    lead: [
      'Adilcevaz’da tarımsal ve konut nitelikli taşınmazlar, miras paydaşlığı ve kira ilişkileri öne çıkar.',
    ],
    sections: [
      {
        heading: 'Taşınmaz ve miras',
        paragraphs: [
          'Paydaşlar arası satış ve rehin engelleri, önce hukuki payın netleşmesini gerektirir. Ortaklığın giderilmesi davası masraf ve süre açısından planlanmalıdır.',
        ],
      },
      {
        heading: 'Kira',
        paragraphs: [
          'Konut kiralarında dönemsel artış sınırları ve tahliye sebepleri TBK’da sayılmıştır. Sözleşme süresi ve tebligat usulü dosyayı belirler.',
        ],
      },
      {
        heading: 'İcra',
        paragraphs: [
          'Kira alacağı ve diğer alacaklar icra yoluyla takip edilebilir. İtiraz ve menfi tespit yolları karıştırılmamalıdır.',
        ],
      },
    ],
    faq: [DISCLAIMER_FAQ],
    relatedBilgi: [
      { label: 'Kira', href: '/bilgi/kiraci-nasil-tahliye-edilir' },
      { label: 'Miras', href: '/bilgi/miras-payi-nasil-hesaplanir' },
    ],
    links: [
      { label: 'TBK', href: '/mevzuat/tbk' },
      { label: 'TMK', href: '/mevzuat/tmk' },
    ],
  },
  {
    slug: 'ahlat-avukat',
    yerlesim: 'Ahlat',
    il: 'Bitlis',
    dizinAd: 'Ahlat hukuki bilgilendirme',
    title: 'Ahlat’ta Miras, Taşınmaz ve Aile Hukuku Bilgilendirmesi',
    description:
      'Ahlat’ta miras, taşınmaz ve aile hukuku konularında genel bilgilendirme. Sonuç vaadi içermez.',
    keywords: ['Ahlat miras', 'Ahlat tapu', 'Ahlat aile hukuku', 'Bitlis Ahlat'],
    h1: 'Ahlat’ta miras, taşınmaz ve aile hukuku bilgilendirmesi',
    eyebrow: 'Bölgesel bilgilendirme · Ahlat / Bitlis',
    lead: [
      'Ahlat’ta miras ve taşınmaz paydaşlığı ile aile hukuku dosyaları sık aranır. Bu metin genel çerçeve sunar.',
    ],
    sections: [
      {
        heading: 'Miras ve envanter',
        paragraphs: [
          'Mirasın açılmasıyla birlikte aktif-pasif envanter önem kazanır. Borçlu miras bırakıldığında ret veya resmi defter tutma seçenekleri değerlendirilebilir.',
        ],
      },
      {
        heading: 'Taşınmaz',
        paragraphs: [
          'Kadastro ve sınır uyuşmazlıklarında bilirkişi ve keşif sık zorunludur. Süre kaçırıldığında bazı idari-yargı yolları kapanabilir.',
        ],
      },
      {
        heading: 'Aile',
        paragraphs: [
          'Velayet ve nafaka kararlarının uygulanması, icra daireleri üzerinden de takip edilebilir. Protokol netliği infazı kolaylaştırır.',
        ],
      },
    ],
    faq: [DISCLAIMER_FAQ],
    relatedBilgi: [
      { label: 'Mirasın reddi', href: '/bilgi/mirasin-reddi' },
      { label: 'Velayet', href: '/bilgi/velayet-davasi' },
    ],
    links: [
      { label: 'TMK', href: '/mevzuat/tmk' },
      { label: 'Bilgi', href: '/bilgi' },
    ],
  },
  {
    slug: 'ankara-avukat',
    yerlesim: 'Ankara',
    il: 'Ankara',
    uzaktan: true,
    dizinAd: 'Ankara hukuki bilgilendirme',
    title: 'Ankara’da İdare, Ticaret ve Özel Hukuk Bilgilendirmesi',
    description:
      'Ankara’da idare, ticaret, tüketici ve özel hukuk konularında genel bilgilendirme. Uzaktan dosya takibi bağlamı; reklam metni değildir.',
    keywords: [
      'Ankara idare hukuku bilgi',
      'Ankara ticaret hukuku',
      'Ankara tüketici uyuşmazlığı',
      'e-duruşma bilgilendirme',
    ],
    h1: 'Ankara’da idare, ticaret ve özel hukuk bilgilendirmesi',
    eyebrow: 'Bölgesel bilgilendirme · Ankara (uzaktan erişim bağlamı)',
    lead: [
      'Ankara, idari yargı, temyiz mercileri ve şirket merkezleri açısından yoğun bir hukuk ortamıdır. Birçok dosya e-duruşma ve dijital tebligat ile uzaktan izlenebilir.',
      'Bu sayfa “Ankara avukat” reklamı değildir. Sık aranan konu başlıklarını ve site içi kaynakları bir araya getirir.',
    ],
    sections: [
      {
        heading: 'İdare ve vergi',
        paragraphs: [
          'İptal davası, tam yargı ve vergi uyuşmazlıklarında görevli mahkeme ve dava açma süreleri esastır. İdari başvurunun sonucu beklenmeden açılan davalar usulden reddedilebilir.',
        ],
      },
      {
        heading: 'Ticaret ve şirketler',
        paragraphs: [
          'Anonim ve limited şirket uyuşmazlıkları, genel kurul kararlarının iptali, rekabet ve haksız rekabet TTK çerçevesinde yürür. Ortaklık sözleşmesi ve ana sözleşme maddeleri ilk bakılacak belgelerdir.',
        ],
      },
      {
        heading: 'Tüketici ve sözleşmeler',
        paragraphs: [
          'Mesafeli satış, ayıplı mal ve cayma hakkı TKHK ve ilgili yönetmeliklerle düzenlenir. Parasal eşikler ve başvuru mercileri güncel mevzuata göre kontrol edilmelidir.',
        ],
      },
      {
        heading: 'e-Duruşma ve uzaktan takip',
        paragraphs: [
          'HMK ve ilgili düzenlemeler çerçevesinde ses ve görüntü nakliyle duruşma mümkündür. Teknik ve usuli şartlar mahkeme uygulamasına göre değişir; ayrıntılar için e-duruşma monografisi ve ilgili rehber sayfasına bakılabilir.',
        ],
      },
    ],
    faq: [
      DISCLAIMER_FAQ,
      {
        q: 'e-Duruşma her dosyada zorunlu mu?',
        a: 'Hayır. Mahkemenin ve tarafın talebi, teknik imkân ve usul kuralları çerçevesinde uygulanır. Zorunluluk genel kural değildir.',
      },
    ],
    relatedBilgi: [
      { label: 'İptal davası', href: '/bilgi/iptal-davasi-nedir' },
      { label: 'Tüketici hakları', href: '/bilgi/tuketici-hakem-heyeti' },
      { label: 'e-Duruşma', href: '/e-durusma' },
    ],
    links: [
      { label: 'HMK', href: '/mevzuat/hmk' },
      { label: 'TTK', href: '/mevzuat/ttk' },
      { label: 'TKHK', href: '/mevzuat/tkhk' },
      { label: 'e-Duruşma', href: '/e-durusma' },
      { label: 'Bilgi', href: '/bilgi' },
    ],
  },
];

export function bolgeBilgiBySlug(slug: string): BolgeBilgi | undefined {
  return BOLGE_BILGILERI.find((b) => b.slug === slug);
}

export function allBolgeSlugs(): string[] {
  return BOLGE_BILGILERI.map((b) => b.slug);
}
