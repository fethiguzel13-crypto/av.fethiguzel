/**
 * Wave3: kalan standard sayfaları kategori bazlı pillar/spoke’a bağlar.
 */

function s(heading, paragraphs, bullets) {
  return { heading, paragraphs, bullets };
}
function faq(q, a) {
  return { q, a };
}
function pack(lead, sections, steps, faqList) {
  return { lead, sections, steps, faq: faqList };
}

function buildSpokeMeta(slug, angle) {
  const short = angle || slug.replace(/-/g, ' ');
  return {
    angle: short,
    title: `${short}`,
    h1: short,
    description: `${short}. Dar niyet; ana rehbere yönlendirir. Genel bilgilendirme.`,
    keywords: [short.toLocaleLowerCase('tr-TR'), slug.replace(/-/g, ' ')],
  };
}

/** @type {Array<{ pillar: string, label: string, cat: string, spokes: Record<string, string> }>} */
const WAVE3_SPECS = [
  {
    pillar: 'zamanaşimi-nedir',
    label: 'Zamanaşımı',
    cat: 'Usul',
    spokes: {
      'hak-dusurucu-sure': 'Hak düşürücü süre farkı',
      'kesinti-durma-zamansimi': 'Zamanaşımının kesilmesi ve durması',
      'ispat-yuku': 'İspat yükü',
      'karine-nedir': 'Karine',
      'delil-baslangici-nedir': 'Delil başlangıcı',
      'kesin-delil-nedir': 'Kesin delil',
      'whatsapp-yazismasi-delil': 'WhatsApp yazışması delil',
      'bilirkisi-raporu-itiraz': 'Bilirkişi raporuna itiraz',
      'tanik-dinletme': 'Tanık dinletme',
      'kesif-nedir': 'Keşif',
      'yemin-delili': 'Yemin delili',
      'islah-nedir': 'Islah',
      'belirsiz-alacak-davasi': 'Belirsiz alacak davası',
      'davaya-mudahale': 'Davaya müdahale',
      'bekletici-mesele': 'Bekletici mesele',
      'sulh-nedir': 'Sulh',
      'feragat-nedir': 'Davadan feragat',
      'kabul-nedir-usul': 'Davayı kabul',
      'yargi-giderleri': 'Yargılama giderleri',
      'vekâlet-ucreti-karsi-taraf': 'Karşı taraf vekâlet ücreti',
      'avukat-vekalet-ucreti': 'Avukat vekâlet ücreti',
      'avukat-tutmak-zorunlu-mu': 'Avukat tutmak zorunlu mu',
      'adli-yardim-nedir': 'Adli yardım',
    },
  },
  {
    pillar: 'noter-islemleri',
    label: 'Noter işlemleri',
    cat: 'Usul',
    spokes: {
      'vekaletname-azli': 'Vekâletname azli',
      'noter-vekalet-ucreti': 'Noter vekâlet ücreti',
      'genel-vekaletname-risk': 'Genel vekâletname riskleri',
      'ihtarnama-nasil-cekilir': 'İhtarname çekme',
      'uyap-vatandas-portal': 'UYAP vatandaş portal',
      'e-devlet-dava-dosyasi': 'e-Devlet dava dosyası',
    },
  },
  {
    pillar: 'temerrut-faizi-nedir',
    label: 'Temerrüt faizi ve borçlar',
    cat: 'Borçlar',
    spokes: {
      'faiz-hesaplama-rehberi': 'Faiz hesaplama',
      'maddi-tazminat-nedir': 'Maddi tazminat',
      'manevi-tazminat-nedir': 'Manevi tazminat',
      'kusursuz-sorumluluk': 'Kusursuz sorumluluk',
      'rucu-davasi-nedir': 'Rücu davası',
      'destek-payi-hesabi': 'Destek payı hesabı',
      'kefalet-sozlesmesi': 'Kefalet sözleşmesi',
      'kefil-olursam-ne-olur': 'Kefil olmanın riskleri',
      'kefilden-tahsilat': 'Kefilden tahsilat',
      'hile-ile-sozlesme': 'Hile ile sözleşme',
      'gabin-nedir': 'Gabin',
      'sozlesmeden-donme': 'Sözleşmeden dönme',
      'cezai-sart-nedir': 'Cezai şart',
      'genel-islem-kosullari': 'Genel işlem koşulları',
      'sozlesmenin-yorumu': 'Sözleşmenin yorumu',
      'hukuki-islem-nedir': 'Hukuki işlem',
      'butlan-nedir': 'Butlan',
      'iptal-edilebilirlik': 'İptal edilebilirlik',
      'on-sozlesme-nedir': 'Ön sözleşme',
      'emanet-sozlesmesi': 'Emanet sözleşmesi',
      'odunc-sozlesmesi': 'Ödünç sözleşmesi',
      'bagis-sozlesmesi': 'Bağış sözleşmesi',
      'vekalet-sozlesmesi-tbk': 'Vekâlet sözleşmesi TBK',
      'eser-sozlesmesi-nedir': 'Eser sözleşmesi',
      'yuklenici-temerrudu': 'Yüklenici temerrüdü',
    },
  },
  {
    pillar: 'kat-mulkiyeti-aidat',
    label: 'Kat mülkiyeti aidat',
    cat: 'Eşya',
    spokes: {
      'kat-mulkiyeti-genel-kurul': 'Kat malikleri kurulu',
      'site-yonetim-plani': 'Yönetim planı',
      'ortak-gider-nedir': 'Ortak gider',
      'yonetici-secimi-site': 'Site yöneticisi seçimi',
      'kat-irtifaki-nedir': 'Kat irtifakı',
      'kat-irtifakindan-mulkiyete': 'Kat irtifakından mülkiyete',
      'bagimsiz-bolum-nedir': 'Bağımsız bölüm',
      'arsa-payi-nedir': 'Arsa payı',
    },
  },
  {
    pillar: 'izale-i-suyu',
    label: 'İzale-i şuyu',
    cat: 'Eşya',
    spokes: {
      'ortakligin-giderilmesi-masraf': 'İzale-i şuyu masrafı',
      'on-alim-sufa-hakki': 'Önalım hakkı',
      'zilyetlik-nedir': 'Zilyetlik',
      'intifa-hakki-nedir': 'İntifa hakkı',
      'irtifak-hakki-nedir': 'İrtifak hakkı',
      'gecit-hakki-davasi': 'Geçit hakkı davası',
      'sinir-uyusmazligi': 'Sınır uyuşmazlığı',
      'kadastro-tespitine-itiraz': 'Kadastro tespitine itiraz',
      'orman-kadastro': 'Orman kadastrosu',
      'tapu-iptal-tescil': 'Tapu iptal tescil',
      'tarla-tapu-tarim': 'Tarla tapu',
      'kat-karsiligi-insaat': 'Kat karşılığı inşaat',
      'satis-vaadi-icra': 'Satış vaadi icrası',
      'sahte-vekaletname': 'Sahte vekâletname',
      'rehin-nedir': 'Rehin',
    },
  },
  {
    pillar: 'sirket-kurulusu',
    label: 'Şirket kuruluşu',
    cat: 'Ticaret',
    spokes: {
      'limited-sirket-kurulus': 'Limited şirket kuruluşu',
      'anonim-sirket-kurulus': 'Anonim şirket kuruluşu',
      'sirket-hisse-devri': 'Şirket hisse devri',
      'ticaret-sicili-islemleri': 'Ticaret sicili işlemleri',
      'ticari-isletme-nedir': 'Ticari işletme',
      'unvan-tescili': 'Ticaret unvanı tescili',
      'ticari-defterler': 'Ticari defterler',
      'ticari-is-karinesi': 'Ticari iş karinesi',
      'sirket-borclarinda-ortak': 'Ortağın şirket borcu sorumluluğu',
      'anonim-sirket-yonetim-kurulu': 'Yönetim kurulu sorumluluğu',
      'haksiz-rekabet-nedir': 'Haksız rekabet',
      'marka-tescil': 'Marka tescili',
      'franchise-sozlesmesi': 'Franchise sözleşmesi',
      'acente-sozlesmesi': 'Acente sözleşmesi',
      'tasima-sozlesmesi': 'Taşıma sözleşmesi',
      'cari-hesap-sozlesmesi': 'Cari hesap sözleşmesi',
      'fatura-itiraz-suresi': 'Faturaya itiraz süresi',
      'teminat-mektubu': 'Teminat mektubu',
    },
  },
  {
    pillar: 'cek-karsiliksiz',
    label: 'Karşılıksız çek',
    cat: 'Ticaret',
    spokes: {
      'cek-nasil-yazilir': 'Çek nasıl yazılır',
      'cek-karsiliksiz-ceza': 'Karşılıksız çek cezası',
      'cek-ibraz-suresi': 'Çek ibraz süresi',
      'bono-vade': 'Bono vade ve protesto',
      'senet-nasil-yazilir': 'Senet nasıl yazılır',
    },
  },
  {
    pillar: 'ibraname-nedir',
    label: 'İbraname ve iş ek konular',
    cat: 'İş',
    spokes: {
      'calisma-belgesi': 'Çalışma belgesi',
      'is-mahkemesi-nedir': 'İş mahkemesi',
      'hizmet-sozlesmesi-tbk': 'Hizmet sözleşmesi TBK',
      'asgari-ucret-net-brut': 'Asgari ücret net brüt',
      'ucretsiz-izin-nedir': 'Ücretsiz izin',
      'analik-izin-hakki': 'Analık ve süt izni',
      'agi-nedir': 'AGİ',
      'sendika-ozgurlugu': 'Sendika özgürlüğü',
      'toplu-is-sozlesmesi': 'Toplu iş sözleşmesi',
      'esdeger-is-esit-ucret': 'Eşit işe eşit ücret',
      'uzaklastirma-isyerinden': 'İşyerinden uzaklaştırma',
      'uzaktan-calisma-yonetmelik': 'Uzaktan çalışma',
      'stajyer-haklari': 'Stajyer hakları',
      'cagri-uzerine-calisma': 'Çağrı üzerine çalışma',
      'is-aramaya-izin': 'İş arama izni',
      'surekli-is-goremezlik': 'Sürekli iş göremezlik',
    },
  },
  {
    pillar: 'kentsel-donusum-nedir',
    label: 'Kentsel dönüşüm ve imar',
    cat: 'İmar',
    spokes: {
      'riskli-yapi-tespiti': 'Riskli yapı tespiti',
      'imar-durumu-nedir': 'İmar durumu',
      'imar-planina-itiraz': 'İmar planına itiraz',
      'yapi-tatil-tutanağı': 'Yapı tatil tutanağı',
      'imar-barişi-nedir': 'İmar barışı',
      'imar-affi-nedir': 'İmar affı',
      'belediye-imar-para-cezasi': 'İmar para cezası',
      'kacak-kat-cezasi': 'Kaçak kat cezası',
      'muhür-sokme-sucu': 'Mühür sökme',
      'kiyi-kenar-cizgisi': 'Kıyı kenar çizgisi',
      'sit-alani-nedir': 'Sit alanı',
      'cevre-duzeni-plani': 'Çevre düzeni planı',
      'emsal-nedir-imar': 'Emsal KAKS',
      'taks-nedir': 'TAKS',
    },
  },
  {
    pillar: 'kanun-maddesi-nasil-okunur',
    label: 'Kanun maddesi okuma',
    cat: 'Mevzuat',
    spokes: {
      'mevzuat-nasil-aranir': 'Mevzuat nasıl aranır',
      'tbk-nedir': 'TBK nedir',
      'tmk-nedir': 'TMK nedir',
      'ttk-nedir': 'TTK nedir',
      'tck-nedir': 'TCK nedir',
      'hmk-nedir': 'HMK nedir',
      'iik-nedir': 'İİK nedir',
      'cmk-nedir': 'CMK nedir',
      'is-kanunu-nedir': 'İş Kanunu nedir',
      'tkhk-nedir': 'TKHK nedir',
      'vuk-nedir': 'VUK nedir',
      'anayasa-maddesi-nedir': 'Anayasa maddesi',
      'iyiniyet-nedir': 'İyiniyet',
      'durustluk-kurali': 'Dürüstlük kuralı',
    },
  },
  {
    pillar: 'trafik-kazasi-tazminati',
    label: 'Trafik kazası tazminatı',
    cat: 'Trafik',
    spokes: {
      'trafik-sigortasi-hasar': 'Trafik sigortası hasar',
      'trafik-sigortasi-zorunlu': 'Zorunlu trafik sigortası',
      'kaza-tespit-tutanagi': 'Kaza tespit tutanağı',
      'kusur-orani-trafik': 'Trafik kusur oranı',
      'deger-kaybi-arac': 'Araç değer kaybı',
      'destekten-yoksun-kalma': 'Destekten yoksun kalma',
      'trafik-kazasi-manevvi': 'Trafik kazası manevi tazminat',
      'arac-muayene-gecikme': 'Araç muayene gecikme',
      'plaka-devri-arac-satis': 'Araç satışı plaka devri',
    },
  },
  {
    pillar: 'ehliyet-alma-sartlari',
    label: 'Ehliyet alma',
    cat: 'Trafik',
    spokes: {
      'ehliyet-sinavlari': 'Ehliyet sınavları',
      'src-belgesi-nedir': 'SRC belgesi',
      'psiko-teknik-belge': 'Psikoteknik belge',
    },
  },
  {
    pillar: 'e-devlet-nufus',
    label: 'e-Devlet nüfus işlemleri',
    cat: 'Nüfus',
    spokes: {
      'nufus-kayit-ornegi': 'Nüfus kayıt örneği',
      'pasaport-basvurusu': 'Pasaport başvurusu',
      'adres-degisikligi': 'Adres değişikliği',
      'kimlik-kartı-basvurusu': 'Kimlik kartı başvurusu',
      'dogum-belgesi-nasil-alinir': 'Doğum belgesi',
      'evlilik-basvurusu': 'Evlilik başvurusu',
      'ikametgah-belgesi': 'İkametgâh belgesi',
      'askerlik-durum-belgesi': 'Askerlik durum belgesi',
      'e-devlet-sifresi-alma': 'e-Devlet şifresi',
      'soyadi-degisikligi-davasi': 'Soyadı değişikliği davası',
      'isim-degisikligi-davasi': 'İsim değişikliği davası',
    },
  },
  {
    pillar: 'mal-rejimi-tasfiyesi',
    label: 'Mal rejimi tasfiyesi',
    cat: 'Aile',
    spokes: {
      'ziynet-esyalari-davasi': 'Ziynet eşyası davası',
      'evlilik-sozlesmesi-nedir': 'Evlilik sözleşmesi',
      'aile-konutu-serhi': 'Aile konutu şerhi',
      'ayrilik-karari-nedir': 'Ayrılık kararı',
      'evlilik-iptali-davasi': 'Evliliğin iptali',
      'soybagi-reddi': 'Soybağının reddi',
      'babalik-davasi': 'Babalık davası',
      'evlat-edinme': 'Evlat edinme',
      'nisan-bozulmasi-tazminat': 'Nişan bozulması tazminatı',
      'bosanma-maaliyeti': 'Boşanma maliyeti',
      'aile-mahkamesi-nedir': 'Aile mahkemesi',
    },
  },
  {
    pillar: 'tutuklama-nedir',
    label: 'Tutuklama',
    cat: 'Ceza',
    spokes: {
      'adli-kontrol-nedir': 'Adli kontrol',
      'adli-sicil-kaydi': 'Adli sicil kaydı',
      'sabika-kaydi-nasil-alinir': 'Sabıka kaydı',
      'hizli-yargilama-usulu': 'Seri muhakeme',
      'sorusturma-gizliligi': 'Soruşturma gizliliği',
      'e-devlet-ceza-sorgulama': 'e-Devlet ceza sorgulama',
      'kisisel-verilerin-kaydedilmesi': 'Kişisel verilerin kaydedilmesi suçu',
      'trafik-guvenligini-tehlikeye-sokma': 'Trafik güvenliğini tehlikeye sokma',
      'erisim-engeli-basvurusu': 'Erişim engeli başvurusu',
      'sosyal-medya-hakaret-sikayet': 'Sosyal medya hakaret şikâyeti',
    },
  },
  {
    pillar: 'cimer-sikayet',
    label: 'CİMER ve idari başvuru',
    cat: 'İdare',
    spokes: {
      'bilgi-edinme-basvurusu': 'Bilgi edinme başvurusu',
      'dilekce-hakki-3071': 'Dilekçe hakkı 3071',
      'memur-disiplin-cezasi': 'Memur disiplin cezası',
      'kamu-ihalesi-sikayet': 'Kamu ihalesi şikâyet',
      'cevre-izin-denetim': 'Çevre idari para cezası',
      'cevre-izin-lisans': 'Çevre izin lisans',
      'belediye-encumen-karari': 'Belediye encümen kararı',
      'zabita-cezasi': 'Zabıta cezası',
      'is-yeri-acma-ruhsati': 'İşyeri açma ruhsatı',
      'gida-isletme-kayit': 'Gıda işletme kayıt',
    },
  },
  {
    pillar: 'yabanci-ikamet-izni',
    label: 'Yabancı ikamet izni',
    cat: 'Yabancılar',
    spokes: {
      'oturma-izni-uzatma': 'İkamet izni uzatma',
      'turist-ikamet-izni': 'Turistik ikamet izni',
      'calisma-izni-nedir': 'Çalışma izni',
      'calisma-izni-muafiyeti': 'Çalışma izni muafiyeti',
      'sinir-disi-karari': 'Sınır dışı kararı',
      'turk-vatandasligi-basvurusu': 'Türk vatandaşlığı',
      'evlilikle-vatandaslik': 'Evlilikle vatandaşlık',
      'uluslararasi-koruma': 'Uluslararası koruma',
    },
  },
  {
    pillar: 'bagkur-prim-borcu',
    label: 'Bağ-Kur ve GSS prim',
    cat: 'Sosyal Güvenlik',
    spokes: {
      'genel-saglik-sigortasi': 'GSS prim borcu',
      'e-devlet-sgk-borcu': 'e-Devlet SGK borcu',
      'rapor-parasi-hesaplama': 'Rapor parası',
      'olum-ayligi-dul-yetim': 'Ölüm aylığı dul yetim',
      'sgk-tesvik-nedir': 'SGK teşvikleri',
      'gecici-is-goremezlik': 'Geçici iş göremezlik',
      'prim-iadesi-sgk': 'SGK prim iadesi',
    },
  },
  {
    pillar: 'kdv-nedir',
    label: 'KDV ve fatura',
    cat: 'Vergi',
    spokes: {
      'fatura-iptali': 'Fatura iptali',
      'e-fatura-nedir': 'e-Fatura',
      'vergi-incelemesi-nedir': 'Vergi incelemesi',
      'vergi-ziyai-cezasi': 'Vergi ziyaı cezası',
      'gecikme-zammi-faizi': 'Gecikme zammı',
      'stopaj-nedir': 'Stopaj',
      'muhtasar-beyanname': 'Muhtasar beyanname',
    },
  },
  {
    pillar: 'engelli-raporu-nasil-alinir',
    label: 'Engelli raporu ve haklar',
    cat: 'Engelli Hakları',
    spokes: {
      'engelli-araci-nasil-alinir': 'Engelli aracı',
      'engelli-maasi-sartlari': 'Engelli maaşı şartları',
      'evde-bakim-maasi': 'Evde bakım maaşı',
    },
  },
  {
    pillar: 'kredi-karti-itiraz',
    label: 'Kredi kartı itirazı',
    cat: 'Tüketici',
    spokes: {
      'kredi-borcu-yapislandirma': 'Kredi borcu yapılandırma',
      'kredi-notu-nedir': 'Kredi notu',
      'kredi-karti-asgari-odeme': 'Kredi kartı asgari ödeme',
    },
  },
  {
    pillar: 'malpraktis-davasi',
    label: 'Malpraktis',
    cat: 'Sağlık',
    spokes: {
      'saglik-turizmi-haklar': 'Hasta hakları',
    },
  },
  {
    pillar: 'sigorta-tazminat-reddi',
    label: 'Sigorta tazminat reddi',
    cat: 'Sigorta',
    spokes: {
      'kasko-hasar-sureci': 'Kasko hasar süreci',
      'tss-tamamlayici-saglik': 'Tamamlayıcı sağlık sigortası',
    },
  },
  {
    pillar: 'okul-kayit-ucreti-iade',
    label: 'Eğitim ücreti iade',
    cat: 'Eğitim',
    spokes: {
      'ogrenim-ucreti-iade': 'Üniversite öğrenim ücreti iade',
      'ogrenci-belgesi-e-devlet': 'Öğrenci belgesi e-Devlet',
      'yuksekogretim-disiplin': 'Öğrenci disiplin cezası',
    },
  },
];

export const ICRA_EXTRA_SPOKES = {
  'banka-hesap-haczi-maas': buildSpokeMeta('banka-hesap-haczi-maas', 'Maaş hesabına haciz'),
  'memur-maas-haczi': buildSpokeMeta('memur-maas-haczi', 'Memur maaşına haciz'),
  'emekli-maas-haczi': buildSpokeMeta('emekli-maas-haczi', 'Emekli maaşına haciz'),
};

function deepPillar(label, spokeSlugs) {
  const links = spokeSlugs
    .slice(0, 10)
    .map((s) => `/bilgi/${s}`)
    .join(' · ');
  return pack(
    `${label} konusunda sık sorulan sorular bu ana rehberde birleştirilir. Metin genel bilgilendirmedir; somut dosyada yürürlükteki mevzuat ve avukat değerlendirmesi esastır.`,
    [
      s(`${label}: kapsam`, [
        `${label} birden fazla alt soruyu içerir. Bu sayfa merciler, belgeler, süreç ve riskleri ana hatlarıyla anlatır.`,
        `Dar sorular (oran, tek belge, tek adım) için alt sayfalar kullanılır: ${links}`,
      ]),
      s('Merciler, süreler, belgeler', [
        'Doğru merci (idare, arabuluculuk, icra, mahkeme) ve tebliğ/öğrenme tarihi hak kaybını önler. e-Devlet ve UYAP birçok adımı hızlandırır.',
        'Kimlik, sözleşme, tebligat, dekont, tutanak ve dijital yazışmalar tipik delil setidir.',
      ]),
      s('Sık hatalar', [
        'Yanlış mercie başvuru, süre kaçırma, sözlü anlaşmaya güvenme ve metni okumadan ödeme/feragat en yaygın risklerdir.',
        'Kanun maddesi aramak için /ara; madde metni ve akademik şerh için /mevzuat kullanılır.',
      ]),
      s('İç linkler', [
        'Hesaplama: /hesaplama · İçtihat: /icthat · Alt niyet sayfaları bu rehberin ilgili listesinde yer alır.',
      ]),
    ],
    [
      `${label} ile ilgili belgeleri toplayın.`,
      'Tebliğ veya öğrenme tarihini sabitleyin.',
      'Doğru mercie karar verin.',
      'Yazılı başvuru yapın; numarayı saklayın.',
      'Sonucu takip edin; itiraz süresini kaçırmayın.',
    ],
    [
      faq('Alt sayfa ile bu sayfa farkı nedir?', 'Alt sayfa dar niyettir; tam süreç bu ana rehberdedir.'),
      faq('Avukat zorunlu mu?', 'Çoğu başvuruda zorunlu değildir; süre-usul riski yüksekse önerilir.'),
      faq('Bu metin bağlayıcı mıdır?', 'Hayır. Genel bilgilendirmedir.'),
      faq('Kanun maddesi nerede?', 'https://www.avfethiguzel.com/ara'),
    ]
  );
}

/** @type {Record<string, any>} */
export const CLUSTERS_WAVE3 = {};
/** @type {Record<string, any>} */
export const PILLAR_BODIES_WAVE3 = {};

for (const spec of WAVE3_SPECS) {
  const key = 'w3_' + spec.pillar.replace(/-/g, '_');
  const spokes = {};
  for (const [slug, angle] of Object.entries(spec.spokes)) {
    spokes[slug] = buildSpokeMeta(slug, angle);
  }
  CLUSTERS_WAVE3[key] = { pillar: spec.pillar, label: spec.label, spokes };
  PILLAR_BODIES_WAVE3[spec.pillar] = deepPillar(spec.label, Object.keys(spec.spokes));
}

export function getWave3PillarBody(slug) {
  return PILLAR_BODIES_WAVE3[slug] || null;
}

export function applyIcraExtras(clusters) {
  if (clusters.icra) {
    for (const [slug, meta] of Object.entries(ICRA_EXTRA_SPOKES)) {
      if (!clusters.icra.spokes[slug]) clusters.icra.spokes[slug] = meta;
    }
  }
  return clusters;
}

const spokeCount = Object.values(CLUSTERS_WAVE3).reduce((n, c) => n + Object.keys(c.spokes).length, 0);
console.log(
  '[wave3] pillars',
  Object.keys(PILLAR_BODIES_WAVE3).length,
  'spokes',
  spokeCount + Object.keys(ICRA_EXTRA_SPOKES).length
);
