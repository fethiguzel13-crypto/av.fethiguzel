import type { BolgeMakale } from './types';

const UPDATED = '2026-07-29';

/**
 * Yerleşim bağlamlı hukuki tarih / olay / nüfus / taşınmaz makaleleri.
 * Reklam yasağına uygun: “X avukat” yok; genel bilgilendirme + iç link.
 * Tarihsel anlatım kamuya açık genel çerçeveye dayanır; somut dosyada avukata danışılmalıdır.
 */
export const BOLGE_MAKALELER: BolgeMakale[] = [
  // ─── VAN ─────────────────────────────────────────────
  {
    slug: 'van-golu-havzasi-tasinmaz-ve-miras-hukuku',
    yerlesim: 'Van',
    il: 'Van',
    kategori: 'tasinmaz',
    title: 'Van Gölü Havzasında Taşınmaz ve Miras Hukuku: Tarihsel Çerçeve',
    description:
      'Van Gölü çevresinde tapu, miras paydaşlığı, el birliği mülkiyet ve kadastro süreçlerinin hukuki çerçevesi. Genel bilgilendirme makalesi.',
    keywords: [
      'Van Gölü taşınmaz hukuku',
      'Van miras paylaşımı',
      'Van tapu kadastro',
      'el birliği mülkiyet Doğu Anadolu',
      'Van veraset ilamı',
    ],
    h1: 'Van Gölü havzasında taşınmaz ve miras hukuku',
    eyebrow: 'Bölgesel hukuki makale · Van',
    lead:
      'Van Gölü havzası; kıyı ve tarımsal taşınmazlar, uzun süren miras paydaşlıkları ve kadastro sonrası sınır uyuşmazlıklarıyla hukuk pratiğinde sık sorulan bir coğrafyadır. Bu yazı, bölgeyi “avukat arama” metni olarak değil, taşınmaz ve miras hukuku merceğinden genel bilgilendirme amacıyla ele alır.',
    keyInsight:
      'Fiilî kullanım yıllarca sürmüş olsa da hukuki pay durumu tapu ve veraset kaydı netleşmeden “satış / rehin / icra” planı güvenli kurulamaz.',
    okumaDk: 12,
    updated: UPDATED,
    theme: 'lake',
    bolgeHref: '/van-avukat',
    graphics: [
      {
        kind: 'timeline',
        title: 'Taşınmaz rejimine dair genel zaman çizgisi (Türkiye geneli + yerel etki)',
        items: [
          { year: '1926–', label: 'Medeni Kanun miras/zümre iskeleti', note: 'Yasal mirasçılık ve saklı pay' },
          { year: 'Kadastro', label: 'Kadastro tespit ve tapu sicili', note: 'Sınır ve pay kaydı' },
          { year: '2000’ler', label: 'e-Devlet / dijital tapu sorguları', note: 'Erişim kolaylaştı; uyuşmazlık bitmedi' },
          { year: 'Bugün', label: 'El birliği + fiilî kullanım gerilimi', note: 'İzale-i şüyu ve ecrimisil' },
        ],
      },
      {
        kind: 'flow',
        title: 'Miras → tapu intikali → tasarruf yolu',
        steps: [
          'Mirasın açılması',
          'Veraset / mirasçılık belgesi',
          'Tapu intikali',
          'Paylaşım veya satış/izale',
        ],
      },
      {
        kind: 'compare',
        title: 'El birliği vs paylı mülkiyet (özet)',
        headers: ['Ölçüt', 'El birliği', 'Paylı'],
        rows: [
          ['Tasarruf', 'Kural: birlikte', 'Kendi payı üzerinde'],
          ['Satış kolaylığı', 'Daha zor', 'Daha esnek'],
          ['Sık sonuç', 'Fiilî kilitlenme', 'Pay devri / haciz'],
        ],
      },
    ],
    sections: [
      {
        heading: 'Havzanın hukuki “tipolojisi”',
        paragraphs: [
          'Van merkez ve ilçelerinde taşınmaz dosyaları çoğu zaman üç katmanın üst üste binmesiyle zorlaşır: (1) mirasın yıllarca intikal etmemesi, (2) fiilî tarım/kullanımın tek veya birkaç mirasçıda toplanması, (3) kadastro kaydı ile zemin gerçeğinin uyuşmazlığı iddiası.',
          'Bu tablo, sırf “tapu var / yok” sorusuna indirgenemez. Önce kimlerin mirasçı olduğu, sonra sicilde payın nasıl göründüğü, en sonunda da fiilî kullanımın hukuki niteliği (ecrimisil, el atmanın önlenmesi, ortaklığın giderilmesi) sırayla netleştirilmelidir.',
        ],
        bullets: [
          'Veraset olmadan satış vaadi ve “harici satış” riskli ispat alanı doğurur',
          'Kıyı ve tarımsal parsellerde sınır keşfi sıklıkla bilirkişiye kalır',
          'Belediye / imar katmanı özel hukuk davasından ayrı yürüyebilir',
        ],
      },
      {
        heading: 'Miras ve nüfus kayıtlarının rolü',
        paragraphs: [
          'Mirasçılık, nüfus kütüğü ve aile bağlarının ispatına sıkı bağlıdır. Nüfus olayları (doğum, ölüm, evlilik, boşanma, soybağı) taşınmaz dosyasının “görünmez” belgeleridir; eksik nüfus kaydı, veraset sürecini uzatır.',
          'Doğu Anadolu’da sık görülen senaryo, miras bırakanın ölümünden yıllar sonra intikal yapılmasıdır. Bu arada taşınmaz üzerinde fiilî tarım, kira benzeri kullanım veya üçüncü kişi zilyetliği oluşmuş olabilir. Hukuken “zaman geçti” demek, her zaman hakkın düştüğü anlamına gelmez; zamanaşımı ve hak düşürücü süreler talep türüne göre değişir.',
        ],
        callout: {
          title: 'Pratik not',
          body: 'Önce envanter (aktif-pasif) ve mirasçılar listesi, sonra tapu; aksi hâlde dava konusu “yanlış kişiye” kurulabilir.',
        },
      },
      {
        heading: 'Kadastro, sınır ve delil',
        paragraphs: [
          'Kadastro tespitine itiraz süreleri kaçırıldığında bazı idari-yargı yolları daralır; buna karşılık özel hukukta sınır ve el atma uyuşmazlıkları farklı temellere dayanabilir. Delil seti genelde: tapu kaydı, eski harita/kroki, tanık, zilyetlik belirtileri ve bilirkişi keşfidir.',
          'Van Gölü çevresinde su seviyesine bağlı fiilî sınır kaymaları iddiaları da gündeme gelebilir. Bu tür iddialar, teknik ölçüm olmadan salt anlatı ile çözülmez.',
        ],
      },
      {
        heading: 'Ortaklığın giderilmesi ve ecrimisil',
        paragraphs: [
          'Paydaşlar arasında anlaşma yoksa izale-i şüyu (ortaklığın giderilmesi) yolu gündeme gelir. Bu dava, “kim haklı” sorusundan çok “ortaklık nasıl sona ersin” sorusuna cevap arar; masraf ve süre planı yapılmalıdır.',
          'Fiilî kullanıcı diğer paydaşlara karşı ecrimisil talebiyle karşılaşabilir. Ecrimisil, haksız işgalin bedeli niteliğindedir; hesap, süre ve emsal bedele bağlıdır.',
        ],
      },
      {
        heading: 'Bu makalenin sınırı',
        paragraphs: [
          'Metin, Van Gölü havzasındaki sık görülen hukuki gerilim noktalarını genel çerçevede anlatır. Somut parsel, somut mirasçı listesi ve güncel mevzuat/içtihat olmadan sonuç vaadi verilemez. Reklam niteliğinde “yerel avukat” vaadi içermez.',
        ],
      },
    ],
    faq: [
      {
        q: 'Veraset ilamı olmadan tapu devri yapılır mı?',
        a: 'Kural olarak mirasçıların sicile intikali için mirasçılık belgesi / veraset süreci gerekir. İstisna ve usuller somut dosyada kontrol edilmelidir.',
      },
      {
        q: 'Kardeşlerden biri tarlayı yıllarca ektiyse malik midir?',
        a: 'Tek başına uzun kullanım, otomatik mülkiyet kazandırmaz. Zilyetlik ve kazandırıcı zamanaşımı iddiaları sıkı şartlara ve ispatı gerektirir.',
      },
    ],
    related: [
      { label: 'Van bilgilendirme', href: '/van-avukat' },
      { label: 'Miras payı', href: '/bilgi/miras-payi-nasil-hesaplanir' },
      { label: 'Tapu iptal-tescil', href: '/bilgi/tapu-iptal-tescil' },
      { label: 'İzale-i şüyu', href: '/bilgi/izale-i-suyu' },
      { label: 'TMK', href: '/mevzuat/tmk' },
    ],
  },
  {
    slug: 'van-2011-depremi-sozlesme-ve-konut-hukuku',
    yerlesim: 'Van',
    il: 'Van',
    kategori: 'olay',
    title: 'Van 2011 Depremi Sonrası Sözleşme, Konut ve İcra Hukuku Notları',
    description:
      '2011 Van depremi bağlamında ifa imkânsızlığı, kira, konut ve icra dosyalarına dair genel hukuki çerçeve. Bilgilendirme makalesi.',
    keywords: [
      'Van depremi hukuki sonuçlar',
      'deprem ifa imkânsızlığı',
      'Van kira deprem',
      'mücbir sebep kira',
      'afet sonrası sözleşmeler',
    ],
    h1: 'Van 2011 depremi sonrası sözleşme ve konut hukuku notları',
    eyebrow: 'Hukuki olay · Van',
    lead:
      '2011’de Van ve çevresini etkileyen deprem, yalnızca can ve mal kaybı değil; kira, inşaat, satış vaadi, sigorta ve icra dosyalarında da hukuki sorular üretti. Bu yazı, o dönemin “dosya tipolojisini” genel borçlar ve taşınmaz hukuku dilinde özetler.',
    keyInsight:
      'Afet, her sözleşmeyi otomatik sona erdirmez; imkânsızlık, aşırı ifa güçlüğü ve kusur ayrımı dosya dosya yapılır.',
    okumaDk: 10,
    updated: UPDATED,
    theme: 'mountain',
    bolgeHref: '/van-avukat',
    graphics: [
      {
        kind: 'flow',
        title: 'Deprem sonrası sözleşme değerlendirme iskeleti',
        steps: [
          'Sözleşme tipi (kira/satış/eser)',
          'İfa hâlâ mümkün mü?',
          'Geçici mi kalıcı mı?',
          'TBK imkânsızlık / aşırı güçlük',
          'Sonuç: ifa / uyarlama / sona erme',
        ],
      },
      {
        kind: 'bars',
        title: 'Sık görülen uyuşmazlık alanları (nispi yoğunluk — şematik)',
        unit: 'yoğunluk',
        items: [
          { label: 'Kira / tahliye', value: 85, hint: 'Konut kullanılamazlığı' },
          { label: 'İnşaat / eser', value: 70, hint: 'Hasar ve teslim' },
          { label: 'Satış vaadi', value: 55, hint: 'İfa ve ayıp' },
          { label: 'İcra / haciz', value: 60, hint: 'Ödeme güçlüğü' },
          { label: 'Sigorta', value: 50, hint: 'Teminat kapsamı' },
        ],
      },
    ],
    sections: [
      {
        heading: 'Olayın hukuki okunuşu',
        paragraphs: [
          'Deprem gibi doğal afetler, borçlar hukukunda “ifa engeli” tartışmasını tetikler. TBK çerçevesinde ifanın imkânsızlaşması, borçlunun sorumluluğu ve alacaklının hakları somut olaya göre belirlenir. “Herkes mağdur” demek, her dosyada aynı sonucu doğurmaz.',
          'Konutun oturulamaz hâle gelmesi kira ilişkisinde kullanım borcunun ifasını etkiler. Buna karşılık, hasarın kapsamı, onarım imkânı ve tarafların iradesi ayrı ayrı bakılmalıdır.',
        ],
      },
      {
        heading: 'Kira ve konut',
        paragraphs: [
          'Kiralananın tamamen yok olması veya kullanılamaz hâle gelmesi senaryolarında kira ilişkisinin akıbeti, TBK kira hükümleri ve genel hükümlerin kesişiminde değerlendirilir. Geçici kullanılamama ile kalıcı yok olma ayrımı kritiktir.',
          'Deprem sonrası hızlı “sözlü anlaşmalar” (indirim, tahliye, onarım) sonradan ispat sorunu üretir. Yazılı protokol ve tarihli yazışma, uyuşmazlıkta belirleyici olabilir.',
        ],
      },
      {
        heading: 'İcra ve ödeme güçlüğü',
        paragraphs: [
          'Afet sonrası gelir kaybı, icra takiplerinde “ödeme planı / yapılandırma / haczedilemezlik” tartışmalarını artırır. Ancak deprem, tek başına tüm borçları silmez; usul ve süre kuralları işlemeye devam eder.',
        ],
        callout: {
          title: 'Dikkat',
          body: 'Tebligat ve itiraz süreleri afet döneminde de kaçırılabilir; somut mevzuat ve idari düzenlemeler o dönem için ayrıca kontrol edilmelidir.',
        },
      },
      {
        heading: 'Bugüne kalan ders',
        paragraphs: [
          '2011 deneyimi, bölgede “afet + sözleşme + taşınmaz” üçlüsünün hâlâ güncel olduğunu gösterir. Yeni inşaat, kentsel dönüşüm ve sigorta poliçelerinde de benzer iskelet kullanılır: risk, teminat, ifa, ispat.',
        ],
      },
    ],
    faq: [
      {
        q: 'Deprem kira sözleşmesini otomatik bitirir mi?',
        a: 'Hayır. Kiralananın durumu, onarım imkânı ve TBK hükümleri somut olayda değerlendirilir.',
      },
    ],
    related: [
      { label: 'Kira tahliye', href: '/bilgi/kiraci-nasil-tahliye-edilir' },
      { label: 'TBK', href: '/mevzuat/tbk' },
      { label: 'İcra takibi', href: '/bilgi/icra-takibi-nedir' },
      { label: 'Van bilgilendirme', href: '/van-avukat' },
    ],
  },

  // ─── AHLAT ───────────────────────────────────────────
  {
    slug: 'ahlat-vakif-miras-ve-tarihi-tasinmazlar',
    yerlesim: 'Ahlat',
    il: 'Bitlis',
    kategori: 'tarih',
    title: 'Ahlat’ta Vakıf, Miras ve Tarihi Taşınmazların Hukuki Çerçevesi',
    description:
      'Ahlat’ın tarihsel dokusu bağlamında vakıf taşınmazları, miras ve tescil sorunlarına dair genel hukuki bilgilendirme.',
    keywords: [
      'Ahlat vakıf taşınmaz',
      'Ahlat miras hukuku',
      'Bitlis Ahlat tapu',
      'tarihi taşınmaz tescil',
      'Ahlat hukuki tarih',
    ],
    h1: 'Ahlat’ta vakıf, miras ve tarihi taşınmazlar',
    eyebrow: 'Bölgesel hukuki makale · Ahlat / Bitlis',
    lead:
      'Ahlat, Selçuklu ve Osmanlı izlerini taşıyan mezarlıklar, yapılar ve yerleşim dokusuyla yalnızca kültür tarihi değil; vakıf, tescil ve miras hukuku açısından da özgün sorular üreten bir yerleşimdir. Bu makale, o soruları reklam dili olmadan hukuki iskelete oturtur.',
    keyInsight:
      'Tarihi/kültürel değer ile özel mülkiyet iddiası çakıştığında çözüm çoğu zaman tek bir “tapu fotokopisi”nden ibaret değildir; vakıf ve tescil katmanları devreye girer.',
    okumaDk: 11,
    updated: UPDATED,
    theme: 'historic',
    bolgeHref: '/ahlat-avukat',
    graphics: [
      {
        kind: 'map-hint',
        title: 'Ahlat ve yakın yerleşimler (bağlam)',
        places: [
          { name: 'Ahlat', role: 'Tarihi doku · vakıf/taşınmaz' },
          { name: 'Adilcevaz', role: 'Göl kıyısı · tarım/konut' },
          { name: 'Tatvan', role: 'Ulaşım/ticaret' },
          { name: 'Bitlis', role: 'İl merkezi · idare' },
        ],
      },
      {
        kind: 'timeline',
        title: 'Mülkiyet katmanlarına dair şematik çizgi',
        items: [
          { year: 'Tarihsel', label: 'Vakıf / kamu yararı izleri', note: 'Sicil ve belgeler' },
          { year: 'Cumhuriyet', label: 'Medeni Kanun + tapu sicili', note: 'Modern tescil' },
          { year: 'Kadastro', label: 'Tespit ve sınır', note: 'İtiraz süreleri' },
          { year: 'Bugün', label: 'Miras + koruma + özel hukuk', note: 'Katmanlı uyuşmazlık' },
        ],
      },
      {
        kind: 'flow',
        title: 'Şüpheli taşınmazda kontrol listesi',
        steps: [
          'Tapu kaydı',
          'Vakıf / kamu kaydı var mı?',
          'Mirasçılar net mi?',
          'Koruma / imar durumu',
          'Uyuşmazlık yolu seçimi',
        ],
      },
    ],
    sections: [
      {
        heading: 'Neden Ahlat “hukuken” özgün?',
        paragraphs: [
          'Tarihi yerleşimlerde taşınmaz, salt “arsa m²” değildir. Kültürel varlık, mezarlık alanı, vakıf kaydı ve özel mülkiyet iddiaları aynı parselde üst üste binebilir. Bu, hem ispatı hem de yetkili mercileri çoğaltır.',
          'Ahlat’ta sık sorulan pratik soru şudur: “Aileden kalma” narratifi ile sicil kaydı çelişirse hangisi üstün gelir? Cevap, delil hiyerarşisi ve tescilin kurucu/etkisi tartışmasıyla verilir; sloganla değil.',
        ],
      },
      {
        heading: 'Vakıf ve kamu katmanı',
        paragraphs: [
          'Vakıf taşınmazları, özel mülkiyet rejiminden farklı kurallara tabidir. “Yıllardır kullanıyorum” iddiası, vakıf/kamu niteliğini tek başına ortadan kaldırmaz. Bu nedenle ilk adım, taşınmazın hukuki niteliğini (özel / vakıf / kamu) netleştirmektir.',
        ],
        bullets: [
          'Sicil ve vakıf kayıtları çapraz kontrol',
          'Kullanım zilyetliği ≠ otomatik mülkiyet',
          'İdari başvurular ile özel hukuk davası karıştırılmamalı',
        ],
      },
      {
        heading: 'Miras ve nüfus',
        paragraphs: [
          'Tarihi yerleşimlerde miras dosyaları uzun kuşaklara yayılır. Nüfus kütüğünde eksik bağ, yurt dışı mirasçı, birden fazla evlilik ve soybağı iddiaları veraseti uzatır. Taşınmazın “tarihi” olması, miras usulünü basitleştirmez; bazen daha da belgelendirmeyi zorunlu kılar.',
        ],
      },
      {
        heading: 'Koruma ve imar kesişimi',
        paragraphs: [
          'Kültür varlıkları ve koruma alanlarında yapılaşma, tadilat ve devir işlemleri ek izin/şartlara bağlanabilir. Özel hukuk satışı yapılsa bile idari engel fiilî kullanım ve inşaatı kilitleyebilir. İki katman birlikte okunmalıdır.',
        ],
      },
    ],
    faq: [
      {
        q: 'Vakıf taşınmaz mirasçılara kalır mı?',
        a: 'Vakıf niteliğindeki mallar özel miras rejimine girmez. Niteliğin tespiti önceliklidir; genel miras kuralları körlemesine uygulanmaz.',
      },
    ],
    related: [
      { label: 'Ahlat bilgilendirme', href: '/ahlat-avukat' },
      { label: 'Mirasın reddi', href: '/bilgi/mirasin-reddi' },
      { label: 'Veraset ilamı', href: '/bilgi/veraset-ilami-nasil-alinir' },
      { label: 'TMK', href: '/mevzuat/tmk' },
    ],
  },

  // ─── ÇALDIRAN ────────────────────────────────────────
  {
    slug: 'caldiran-tarimsal-tasinmaz-kadastro-ve-nufus',
    yerlesim: 'Çaldıran',
    il: 'Van',
    kategori: 'tasinmaz',
    title: 'Çaldıran’da Tarımsal Taşınmaz, Kadastro ve Nüfus Hukuku',
    description:
      'Çaldıran’da tarımsal parseller, kadastro, miras paydaşlığı ve nüfus kayıtlarına dair hukuki bilgilendirme makalesi.',
    keywords: [
      'Çaldıran tapu',
      'Çaldıran miras',
      'Çaldıran kadastro',
      'Van Çaldıran tarımsal taşınmaz',
      'el birliği mülkiyet tarla',
    ],
    h1: 'Çaldıran’da tarımsal taşınmaz, kadastro ve nüfus',
    eyebrow: 'Bölgesel hukuki makale · Çaldıran / Van',
    lead:
      'Çaldıran, tarımsal üretim ve dağınık yerleşim yapısıyla taşınmaz uyuşmazlıklarının “paydaşlık + sınır + tebligat” üçlüsünde yoğunlaştığı bir ilçedir. Bu yazı, tarımsal taşınmaz ve nüfus-veraset bağlantısını genel hukuki dilde anlatır.',
    keyInsight:
      'Tarla fiilen bölünmüş görünse de hukuken hâlâ el birliği veya paylı mülkiyet olabilir; fiilî çizgi, sicil çizgisi değildir.',
    okumaDk: 10,
    updated: UPDATED,
    theme: 'plain',
    bolgeHref: '/caldiran-avukat',
    graphics: [
      {
        kind: 'bars',
        title: 'Çaldıran tipi dosyalarda sık konular (şematik)',
        items: [
          { label: 'Miras paydaşlığı', value: 90 },
          { label: 'Sınır / kadastro', value: 75 },
          { label: 'Ecrimisil / kullanım', value: 65 },
          { label: 'İcra / tebligat', value: 55 },
          { label: 'Nüfus / veraset', value: 70 },
        ],
      },
      {
        kind: 'flow',
        title: 'Tarımsal parselde uyuşmazlık öncesi yol',
        steps: [
          'Tapu + hisse dökümü',
          'Mirasçılar listesi',
          'Fiilî kullanım haritası',
          'Anlaşma / protokol',
          'Dava yolu (gerekirse)',
        ],
      },
      {
        kind: 'timeline',
        title: 'Nüfus olayı → taşınmaz etkisi',
        items: [
          { year: 'Doğum/ölüm', label: 'Mirasçı çevresi değişir' },
          { year: 'Evlilik/boşanma', label: 'Mal rejimi / nafaka kesişimi' },
          { year: 'Veraset', label: 'Hisse intikali' },
          { year: 'Tasarruf', label: 'Satış, rehin, izale' },
        ],
      },
    ],
    sections: [
      {
        heading: 'Tarımsal taşınmazda klasik gerilim',
        paragraphs: [
          'Çaldıran’da birçok parsel, birden fazla mirasçının el birliği veya paylı mülkiyeti altındadır. Fiilen “şu çizgiden benim” denilerek ekim yapılsa da, hukuki tasarruf (satış, rehin, hibe) sicile ve pay durumuna bağlıdır.',
          'Bu gerilim, kredi ve icra dosyalarında da görünür: Haciz hangi hisseye işler? Satış mümkün mü? Paydaşlar itiraz eder mi?',
        ],
      },
      {
        heading: 'Kadastro ve sınır',
        paragraphs: [
          'Sınır uyuşmazlıklarında tanık ve keşif neredeyse standarttır. Eski kullanım, yol, su arkı ve taş yığını gibi zilyetlik belirtileri delil olabilir; fakat kadastro kaydı ve teknik ölçü ile çelişince mahkeme bilirkişiye gider.',
          'Kadastro tespitine itiraz süreleri kaçırılmışsa, özel hukuk yollarının hâlâ açık olup olmadığı talep türüne göre değişir. “Süre bitti” genellemesi her dava için doğru değildir.',
        ],
      },
      {
        heading: 'Nüfus ve tebligat',
        paragraphs: [
          'Kırsal adreslerde tebligat usulü, icra ve dava dosyalarının gidişatını değiştirir. Nüfus kaydındaki adres ile fiilî ikamet farkı, usulsüz tebligat iddialarını besler. Bu iddialar da somut delile dayanmalıdır.',
          'Nüfus olaylarının (ölüm, evlilik) zamanında bildirilmemesi, veraset ve intikalde gecikme üretir; gecikme ise fiilî kullanımın “yerleşik hak” gibi algılanmasına yol açar — hukuken her zaman öyle değildir.',
        ],
      },
    ],
    faq: [
      {
        q: 'Tarla fiilen bölündüyse hisseli satış gerekir mi?',
        a: 'Hukuki pay durumu sicile bakılarak belirlenir. Fiilî bölünme, otomatik paylı mülkiyet yaratmayabilir; intikal ve tescil şarttır.',
      },
    ],
    related: [
      { label: 'Çaldıran bilgilendirme', href: '/caldiran-avukat' },
      { label: 'Ecrimisil', href: '/bilgi/ecrimisil-nedir' },
      { label: 'Miras ortaklığı', href: '/bilgi/miras-ortakligi-nedir' },
      { label: 'TMK', href: '/mevzuat/tmk' },
    ],
  },

  // ─── BİTLİS ──────────────────────────────────────────
  {
    slug: 'bitlis-miras-paydasligi-ve-daglik-tasinmaz',
    yerlesim: 'Bitlis',
    il: 'Bitlis',
    kategori: 'miras',
    title: 'Bitlis’te Miras Paydaşlığı ve Dağlık Taşınmaz Uyuşmazlıkları',
    description:
      'Bitlis ilinde miras paydaşlığı, dağlık/tarımsal taşınmazlar ve ortaklığın giderilmesine dair bilgilendirme makalesi.',
    keywords: [
      'Bitlis miras paylaşımı',
      'Bitlis tapu uyuşmazlığı',
      'Bitlis izale-i şüyu',
      'dağlık taşınmaz hukuku',
      'Bitlis veraset',
    ],
    h1: 'Bitlis’te miras paydaşlığı ve dağlık taşınmazlar',
    eyebrow: 'Bölgesel hukuki makale · Bitlis',
    lead:
      'Bitlis ve çevresinde miras dosyaları, dağınık parseller ve uzun fiilî kullanımlarla birleşince “kim ne kadar ekmiş” anlatısı hukuki pay tablosunun önüne geçebiliyor. Bu makale, o anlatıyı TMK iskeletine geri çeker.',
    keyInsight:
      'Dağlık arazide erişim ve keşif maliyeti yüksektir; delil planı yapılmadan açılan dava, usul ve masraf tuzağına dönüşebilir.',
    okumaDk: 9,
    updated: UPDATED,
    theme: 'mountain',
    bolgeHref: '/bitlis-avukat',
    graphics: [
      {
        kind: 'compare',
        title: 'Anlaşma vs dava (şematik)',
        headers: ['Yol', 'Artı', 'Eksi'],
        rows: [
          ['Paylaşım protokolü', 'Hızlı, ucuz', 'İyi niyet ve net metin gerekir'],
          ['İzale-i şüyu', 'Zorunlu çözüm', 'Süre + masraf + satış riski'],
          ['Ecrimisil', 'Kullanım bedeli', 'İspat ve hesap tartışması'],
        ],
      },
      {
        kind: 'flow',
        title: 'Miras paydaşlığında adımlar',
        steps: ['Mirasçılar', 'Envanter', 'İntikal', 'Anlaşma denemesi', 'İzale / dava'],
      },
    ],
    sections: [
      {
        heading: 'Miras paydaşlığının Bitlis’teki görünümü',
        paragraphs: [
          'Birden fazla parsel, birden fazla mirasçı ve yıllarca süren fiilî tarım; Bitlis tipi dosyanın tipik üçlüsüdür. El birliği mülkiyette kural, birlikte tasarruftur. Bu kural, “ben ektim, ben satarım” refleksini hukuken sınırlar.',
          'Nüfus ve veraset gecikmesi, fiilî kullanıcıyı “tek malik” gibi hissettirse de sicil ve miras hukuku bu hissi otomatik meşrulaştırmaz.',
        ],
      },
      {
        heading: 'Dağlık taşınmazda delil',
        paragraphs: [
          'Keşif, ulaşım ve mevsim koşulları delil ekonomisini etkiler. Uydu görüntüsü, eski vergi/beyan kayıtları, tanık ve zilyetlik belirtileri bir arada değerlendirilir. Tek tanıkla “sınır bu” iddiası çoğu zaman yetmez.',
        ],
      },
      {
        heading: 'İdare ile özel hukukun kesişimi',
        paragraphs: [
          'Orman, mera, hazine ve özel mülkiyet sınırları dağlık bölgelerde sık tartışılır. Yanlış mercie açılan dava zaman kaybettirir. Önce taşınmazın hukuki niteliği, sonra özel hukuk talebi gelmelidir.',
        ],
      },
    ],
    faq: [
      {
        q: 'Ortaklığın giderilmesi zorunlu mu?',
        a: 'Hayır. Paydaşlar anlaşarak paylaştırabilir veya satabilir. Anlaşma yoksa dava yolu gündeme gelir.',
      },
    ],
    related: [
      { label: 'Bitlis bilgilendirme', href: '/bitlis-avukat' },
      { label: 'İzale-i şüyu', href: '/bilgi/izale-i-suyu' },
      { label: 'Yasal mirasçılar', href: '/bilgi/yasal-mirascilar' },
      { label: 'TMK', href: '/mevzuat/tmk' },
    ],
  },

  // ─── TATVAN ──────────────────────────────────────────
  {
    slug: 'tatvan-ticaret-kira-ve-ulastirma-hukuku',
    yerlesim: 'Tatvan',
    il: 'Bitlis',
    kategori: 'ticaret',
    title: 'Tatvan’da Ticaret, Kira ve Ulaştırma Bağlamlı Hukuki Uyuşmazlıklar',
    description:
      'Tatvan’ın ulaşım ve ticaret hareketliliği bağlamında kira, ticari alacak ve taşınmaz hukuku bilgilendirmesi.',
    keywords: [
      'Tatvan kira hukuku',
      'Tatvan ticari alacak',
      'Tatvan işyeri kirası',
      'Bitlis Tatvan sözleşme',
      'Tatvan taşınmaz',
    ],
    h1: 'Tatvan’da ticaret, kira ve ulaştırma bağlamlı uyuşmazlıklar',
    eyebrow: 'Bölgesel hukuki makale · Tatvan / Bitlis',
    lead:
      'Tatvan, Van Gölü kıyısı ve ulaşım hatlarının kesişiminde ticaret ve kira dosyalarının görece sık görüldüğü bir merkezdir. Bu yazı, ticari işletme, çatılı işyeri kirası ve alacak takiplerinin genel çerçevesini çizer.',
    keyInsight:
      'Ticari dosyada “sözleşme + fatura + yazışma” üçlüsü yoksa ispat yükü hızla ağırlaşır; sözlü teamül yetmeyebilir.',
    okumaDk: 9,
    updated: UPDATED,
    theme: 'trade',
    bolgeHref: '/tatvan-avukat',
    graphics: [
      {
        kind: 'bars',
        title: 'Tatvan tipi ticari-hukuki konular (şematik)',
        items: [
          { label: 'İşyeri kirası', value: 88 },
          { label: 'Ticari alacak', value: 80 },
          { label: 'Çek/senet', value: 60 },
          { label: 'Konut kirası', value: 70 },
          { label: 'Taşınmaz satışı', value: 55 },
        ],
      },
      {
        kind: 'flow',
        title: 'Ticari alacakta tipik yol',
        steps: ['Belge topla', 'İhtar', 'İcra / dava', 'İtiraz', 'İspat'],
      },
      {
        kind: 'compare',
        title: 'Konut vs çatılı işyeri kirası (özet farklar)',
        headers: ['Konu', 'Konut', 'İşyeri'],
        rows: [
          ['TBK özel hükümler', 'Var', 'Var (farklı vurgular)'],
          ['Tahliye sebepleri', 'Sınırlı listeler', 'Sözleşme + kanun'],
          ['İspat', 'Yazılı tercih', 'Ticari defter/fatura'],
        ],
      },
    ],
    sections: [
      {
        heading: 'Ulaşım ve ticaretin hukuka yansıması',
        paragraphs: [
          'Lojistik ve geçiş noktası olan yerleşimlerde sözleşme yoğunluğu artar: depo kirası, işyeri kirası, taşıma, satış ve alacak. Uyuşmazlıklar çoğu zaman “kim haklı”dan önce “belge var mı” sorusunda düğümlenir.',
          'Tatvan’da kira tespit/tahliye ve ihtiyaç nedeniyle tahliye talepleri, TBK’nın çatılı işyeri ve konut rejimine göre ayrıştırılmalıdır. Aynı “kira” kelimesi, farklı usul ve süreler demektir.',
        ],
      },
      {
        heading: 'Ticari alacak ve kıymetli evrak',
        paragraphs: [
          'Fatura, irsaliye, cari hesap mutabakatı ve yazışma, ticari ispatın omurgasıdır. Çek ve bono dosyalarında başvuru hakları ve zamanaşımı TTK/TBK kesişiminde yürür. İcra takibi ile menfi tespit davası stratejisi delile göre seçilir.',
        ],
      },
      {
        heading: 'Aile ve miras kesişimi',
        paragraphs: [
          'Ticari işletmenin mirasa girmesi, şirket payı ve işyeri kirası devri gibi yan sorunlar üretir. “Dükkân babadan kaldı” cümlesi, şirket sicili ve kira sözleşmesi kontrol edilmeden hukuki sonuç doğurmaz.',
        ],
      },
    ],
    faq: [
      {
        q: 'İşyeri kirasında tahliye taahhüdü geçerli midir?',
        a: 'Şartları ve şekli doğru düzenlenmişse gündeme gelebilir; her taahhüt metni aynı sonuç vermez. Somut metin incelenmelidir.',
      },
    ],
    related: [
      { label: 'Tatvan bilgilendirme', href: '/tatvan-avukat' },
      { label: 'Kira tahliye', href: '/bilgi/kiraci-nasil-tahliye-edilir' },
      { label: 'Çek', href: '/bilgi/cek-nasil-yazilir' },
      { label: 'TBK', href: '/mevzuat/tbk' },
      { label: 'TTK', href: '/mevzuat/ttk' },
    ],
  },

  // ─── ADİLCEVAZ ───────────────────────────────────────
  {
    slug: 'adilcevaz-gol-kiyisi-mulkiyet-ve-miras',
    yerlesim: 'Adilcevaz',
    il: 'Bitlis',
    kategori: 'tasinmaz',
    title: 'Adilcevaz’da Göl Kıyısı Mülkiyet, Miras ve Kullanım Uyuşmazlıkları',
    description:
      'Adilcevaz’da göl kıyısı ve tarımsal taşınmazlarda mülkiyet, miras ve kullanım bedeli konularına dair bilgilendirme.',
    keywords: [
      'Adilcevaz tapu',
      'Adilcevaz miras',
      'Van Gölü Adilcevaz taşınmaz',
      'Adilcevaz ecrimisil',
      'Bitlis Adilcevaz hukuki',
    ],
    h1: 'Adilcevaz’da göl kıyısı mülkiyet ve miras',
    eyebrow: 'Bölgesel hukuki makale · Adilcevaz / Bitlis',
    lead:
      'Adilcevaz, Van Gölü kıyısı ve tarımsal alanların bir arada olduğu bir yerleşimdir. Kıyıya yakın parsellerde sınır, kullanım ve miras paydaşlığı dosyaları sık sorulur. Bu yazı genel hukuki çerçeveyi sunar.',
    keyInsight:
      'Kıyı ve tarım parsellerinde “manzara / fiilî yol / su” fiilî değeri yükseltir; hukuki pay net değilse değer, uyuşmazlığı büyütür.',
    okumaDk: 8,
    updated: UPDATED,
    theme: 'lake',
    bolgeHref: '/adilcevaz-avukat',
    graphics: [
      {
        kind: 'flow',
        title: 'Kıyı/tarım parselinde kontrol',
        steps: ['Tapu niteliği', 'Miras/hisse', 'Sınır', 'Kullanım', 'Anlaşma/dava'],
      },
      {
        kind: 'bars',
        title: 'Sık talep türleri (şematik)',
        items: [
          { label: 'Miras intikali', value: 85 },
          { label: 'Sınır / el atma', value: 70 },
          { label: 'Ecrimisil', value: 60 },
          { label: 'Kira', value: 50 },
        ],
      },
    ],
    sections: [
      {
        heading: 'Göl kıyısı ve tarımın birlikteliği',
        paragraphs: [
          'Aynı ilçede hem tarımsal hem konut/kıyı niteliği taşıyan parseller bulunabilir. Niteliğin yanlış varsayılması, imar ve özel hukuk taleplerini bozar. İlk iş: sicil ve fiilî durum fotoğrafı.',
        ],
      },
      {
        heading: 'Miras ve paydaşlık',
        paragraphs: [
          'Kıyıya yakın değerli parsellerde miras paydaşlığı, satış ve rehin engellerini görünür kılar. Protokolsüz “ben sattım” işlemleri iptal ve tazminat riski taşır.',
        ],
      },
      {
        heading: 'Kullanım bedeli',
        paragraphs: [
          'Diğer paydaşlar aleyhine tek başına kullanım, ecrimisil tartışması doğurabilir. Hesap için süre, emsal ve rıza/izin iddiası kritiktir.',
        ],
      },
    ],
    faq: [
      {
        q: 'Kıyı şeridi özel mülkiyete konu olur mu?',
        a: 'Kamu malları ve kıyı rejimleri özel kurallara tabidir. Her parselin niteliği ayrı tespit edilmelidir; genelleme yanıltır.',
      },
    ],
    related: [
      { label: 'Adilcevaz bilgilendirme', href: '/adilcevaz-avukat' },
      { label: 'Ecrimisil', href: '/bilgi/ecrimisil-nedir' },
      { label: 'Tapu devri', href: '/bilgi/tapu-devri-nasil-yapilir' },
    ],
  },

  // ─── AĞRI ────────────────────────────────────────────
  {
    slug: 'agri-sinir-bolgesi-tasinmaz-miras-ve-idare',
    yerlesim: 'Ağrı',
    il: 'Ağrı',
    kategori: 'genel',
    title: 'Ağrı’da Sınır Bölgesi Taşınmazı, Miras ve İdare Hukuku Kesişimleri',
    description:
      'Ağrı ilinde taşınmaz, miras ve idari işlemlerin kesiştiği hukuki konulara dair bilgilendirme makalesi.',
    keywords: [
      'Ağrı miras hukuku',
      'Ağrı tapu',
      'Ağrı idare hukuku',
      'Ağrı kamulaştırma',
      'sınır bölgesi taşınmaz',
    ],
    h1: 'Ağrı’da taşınmaz, miras ve idare hukuku kesişimleri',
    eyebrow: 'Bölgesel hukuki makale · Ağrı',
    lead:
      'Ağrı, tarımsal taşınmazların yanı sıra idari işlemler ve kamu yatırımlarının özel mülkiyetle kesiştiği dosyaların da görüldüğü bir ildir. Bu makale, özel hukuk ile idare hukukunun sınırını genel dilde çizer.',
    keyInsight:
      'Yanlış yargı kolu (idare / adliye) seçmek, süre ve görev itirazıyla dosyayı baştan yazdırabilir.',
    okumaDk: 10,
    updated: UPDATED,
    theme: 'plain',
    bolgeHref: '/agri-avukat',
    graphics: [
      {
        kind: 'compare',
        title: 'Adliye vs idare (kaba pusula)',
        headers: ['Konu', 'Tipik yol'],
        rows: [
          ['Miras / tapu iptal-tescil', 'Adli yargı'],
          ['İdari işlemin iptali', 'İdari yargı'],
          ['Kamulaştırma bedeli', 'Özel usuller + yargı'],
          ['Kira / alacak', 'Adli yargı'],
        ],
      },
      {
        kind: 'timeline',
        title: 'Kamulaştırma / idari işlemde genel akış (şema)',
        items: [
          { year: '1', label: 'İdari işlem / tebliğ' },
          { year: '2', label: 'Süre kontrolü' },
          { year: '3', label: 'Başvuru / dava' },
          { year: '4', label: 'Delil ve keşif' },
        ],
      },
      {
        kind: 'flow',
        title: 'Miras + taşınmaz iskeleti',
        steps: ['Nüfus', 'Veraset', 'İntikal', 'Paylaşım', 'Tasarruf'],
      },
    ],
    sections: [
      {
        heading: 'Sınır bölgesi ve taşınmaz',
        paragraphs: [
          'Sınır illerinde taşınmaz dosyaları, güvenlik ve idari düzenlemelerle ek katman kazanabilir. Buna karşılık temel medeni hukuk iskeleti (mülkiyet, miras, zilyetlik) geçerliliğini korur. “Sınır ili” sloganı, somut mevzuat yerine geçmez.',
        ],
      },
      {
        heading: 'Miras ve nüfus hareketleri',
        paragraphs: [
          'İç göç ve yurt dışı mirasçılar, veraseti uzatır. Nüfus kayıtlarındaki eksikler, taşınmaz intikalini bloke eder. Bu nedenle miras dosyası aynı zamanda bir nüfus dosyasıdır.',
        ],
      },
      {
        heading: 'İdare ve kamulaştırma',
        paragraphs: [
          'Kamu yatırımları kamulaştırma ve bedel uyuşmazlıkları doğurabilir. Süreler ve görevli mahkeme özel hukuk davalarından farklı işler. Erken “adliyeye gidelim” refleksi bazen yanlış kapıdır.',
        ],
        callout: {
          title: 'Süre uyarısı',
          body: 'İdari yargıda dava açma süreleri kaçırıldığında hak kaybı riski yüksektir; tebliğ tarihi belgelenmelidir.',
        },
      },
    ],
    faq: [
      {
        q: 'Kamulaştırma bedeline itiraz nereye yapılır?',
        a: 'Usul ve merciler somut işleme ve yürürlükteki kanuna göre değişir. Genel bilgilendirme somut dilekçe yerine geçmez.',
      },
    ],
    related: [
      { label: 'Ağrı bilgilendirme', href: '/agri-avukat' },
      { label: 'Kamulaştırma', href: '/bilgi/kamulastirma-nedir' },
      { label: 'İptal davası', href: '/bilgi/iptal-davasi-nedir' },
      { label: 'Miras', href: '/bilgi/miras-payi-nasil-hesaplanir' },
    ],
  },

  // ─── PATNOS ──────────────────────────────────────────
  {
    slug: 'patnos-icra-tarimsal-alacak-ve-nufus',
    yerlesim: 'Patnos',
    il: 'Ağrı',
    kategori: 'olay',
    title: 'Patnos’ta İcra, Tarımsal Alacak ve Nüfus Kayıtlarının Hukuki Etkisi',
    description:
      'Patnos’ta icra takipleri, tarımsal alacaklar ve nüfus/tebligat sorunlarına dair hukuki bilgilendirme makalesi.',
    keywords: [
      'Patnos icra',
      'Patnos miras',
      'Patnos tebligat',
      'Ağrı Patnos hukuki',
      'tarımsal alacak icra',
    ],
    h1: 'Patnos’ta icra, tarımsal alacak ve nüfus',
    eyebrow: 'Bölgesel hukuki makale · Patnos / Ağrı',
    lead:
      'Patnos’ta icra ve alacak dosyaları, tebligat adresi ile fiilî ikamet farkı ve tarımsal gelirin düzensizliği nedeniyle özgün ispat sorunları üretir. Bu yazı, İİK iskeletini yerel pratikle buluşturur.',
    keyInsight:
      'Tebligat usulü bozulursa süreler kayar; ama “ben duymadım” iddiası tek başına yetmez — usul ve delil gerekir.',
    okumaDk: 9,
    updated: UPDATED,
    theme: 'plain',
    bolgeHref: '/patnos-avukat',
    graphics: [
      {
        kind: 'flow',
        title: 'İlamsız icrada kaba iskelet',
        steps: ['Takip talebi', 'Ödeme emri', 'İtiraz süresi', 'Haciz', 'Satış'],
      },
      {
        kind: 'bars',
        title: 'Risk noktaları (şematik)',
        items: [
          { label: 'Tebligat', value: 90 },
          { label: 'İtiraz süresi', value: 85 },
          { label: 'Haczedilemezlik', value: 70 },
          { label: 'İstihkak', value: 55 },
        ],
      },
    ],
    sections: [
      {
        heading: 'İcra pratiği',
        paragraphs: [
          'İlamsız ve ilamlı icra yolları farklıdır. Ödeme emrine itiraz süreleri kaçırıldığında borçlu tarafın savunma alanı daralır. Alacaklı tarafında ise tebligat ve dosya güncelliği belirleyicidir.',
          'Tarımsal alacaklarda “hasat sonrası öderim” teamülü, yazılı delil yoksa ispatta zayıf kalabilir. Senet, fatura ve yazışma hâlâ temeldir.',
        ],
      },
      {
        heading: 'Nüfus ve adres',
        paragraphs: [
          'Nüfus sistemindeki adres ile köy/mahalle fiilî adresi uyuşmazsa tebligat tartışması büyür. Komşu bilgilendirmesi ve usul kuralları devreye girer. Bu, hem icra hem aile/miras dosyalarını etkiler.',
        ],
      },
      {
        heading: 'Taşınmaz haczi',
        paragraphs: [
          'Hisseli tarlalarda haciz ve satış, paydaşlık nedeniyle karmaşıklaşır. Hangi hisseye haciz işlediği, satışın nasıl yapılacağı ve istihkak iddiaları ayrı başlıklardır.',
        ],
      },
    ],
    faq: [
      {
        q: 'Ödeme emrine itiraz süresi ne kadardır?',
        a: 'İlamsız icrada kural olarak tebliğden itibaren yedi gündür (İİK). Dosya türüne göre istisnalar kontrol edilmelidir.',
      },
    ],
    related: [
      { label: 'Patnos bilgilendirme', href: '/patnos-avukat' },
      { label: 'İcra takibi', href: '/bilgi/icra-takibi-nedir' },
      { label: 'Haciz', href: '/bilgi/haciz-islemleri-nasil-yapilir' },
      { label: 'İİK', href: '/mevzuat/iik' },
    ],
  },

  // ─── MURADİYE ────────────────────────────────────────
  {
    slug: 'muradiye-aile-miras-ve-nufus-olaylari',
    yerlesim: 'Muradiye',
    il: 'Van',
    kategori: 'nufus',
    title: 'Muradiye’de Aile, Miras ve Nüfus Olaylarının Hukuki Etkileri',
    description:
      'Muradiye’de nüfus olayları, aile hukuku ve miras intikali arasındaki bağlantıya dair bilgilendirme makalesi.',
    keywords: [
      'Muradiye miras',
      'Muradiye boşanma',
      'Muradiye nüfus',
      'Van Muradiye veraset',
      'nüfus olayları hukuki etki',
    ],
    h1: 'Muradiye’de aile, miras ve nüfus olayları',
    eyebrow: 'Bölgesel hukuki makale · Muradiye / Van',
    lead:
      'Nüfus olayları — doğum, ölüm, evlilik, boşanma, soybağı — yalnızca “kimlik işi” değildir; miras, nafaka, velayet ve taşınmaz intikalinin anahtarıdır. Muradiye bağlamında bu bağlantıyı genel hukuki dilde anlatıyoruz.',
    keyInsight:
      'Nüfus kaydı düzeltilmeden açılan miras ve aile dosyası, yanlış taraf ve yanlış pay riski taşır.',
    okumaDk: 9,
    updated: UPDATED,
    theme: 'mountain',
    bolgeHref: '/muradiye-avukat',
    graphics: [
      {
        kind: 'timeline',
        title: 'Nüfus olayı → hukuki sonuç zinciri',
        items: [
          { year: 'Evlilik', label: 'Mal rejimi başlar / değişir' },
          { year: 'Boşanma', label: 'Velayet · nafaka · tasfiye' },
          { year: 'Ölüm', label: 'Miras açılır' },
          { year: 'Veraset', label: 'Hisse ve tasarruf' },
        ],
      },
      {
        kind: 'flow',
        title: 'Aile + miras dosyasında belge iskeleti',
        steps: [
          'Nüfus kayıt örneği',
          'Evlilik / boşanma kararı',
          'Ölüm belgesi',
          'Veraset',
          'Tapu intikali',
        ],
      },
      {
        kind: 'compare',
        title: 'Velayet / nafaka / miras (ayrım)',
        headers: ['Kurum', 'Ne zaman', 'Odak'],
        rows: [
          ['Velayet', 'Boşanma / ayrı yaşam', 'Çocuk yararı'],
          ['Nafaka', 'Tedbir / yoksulluk / iştirak', 'İhtiyaç + gelir'],
          ['Miras', 'Ölüm', 'Zümre + saklı pay'],
        ],
      },
    ],
    sections: [
      {
        heading: 'Nüfus olayları neden “hukuk dosyası”dır?',
        paragraphs: [
          'Mirasçılık belgesi, nüfus kütüğündeki soybağı ve evlilik bilgisine dayanır. Hatalı veya eksik kayıt, yanlış mirasçı listesi üretir. Aynı hata, nafaka ve velayet dosyalarında da taraf sıfatını etkiler.',
          'Muradiye gibi yerleşimlerde yurt içi-gök göç ve geç bildirilen ölüm/evlilik olayları, belgenin sonradan düzeltilmesini zorunlu kılabilir. Düzeltme tamamlanmadan taşınmaz intikali “kilit”lenebilir.',
        ],
      },
      {
        heading: 'Aile hukuku kesiti',
        paragraphs: [
          'Anlaşmalı boşanmada protokol metni; velayet, nafaka ve mal rejimini net yazmazsa sonraki icra ve dava kapısını açar. “Anlaştık” sözü, icra edilebilir metin değildir.',
          'Çocukla kişisel ilişki ve nafaka kararlarının infazı, icra daireleri üzerinden de yürüyebilir. Kararın açık yazılması, infazı kolaylaştırır.',
        ],
      },
      {
        heading: 'Miras ve taşınmaz',
        paragraphs: [
          'Ölümle miras açılır; fakat sicile yansıma ayrı bir adımdır. Muradiye’de tarımsal parsellerde fiilî kullanım, intikal gecikince “yerleşik düzen” gibi görünür. Hukuki pay ise veraset ve tescile bağlı kalır.',
        ],
      },
    ],
    faq: [
      {
        q: 'Nüfus kaydı yanlışsa ne yapılır?',
        a: 'Düzeltme yolları idari ve adli usullere tabidir. Yanlış kayıtla veraset almak, sonraki iptal riski doğurur.',
      },
    ],
    related: [
      { label: 'Muradiye bilgilendirme', href: '/muradiye-avukat' },
      { label: 'Boşanma', href: '/bilgi/bosanma-davasi-nasil-acilir' },
      { label: 'Nafaka', href: '/bilgi/nafaka-davasi-nedir' },
      { label: 'Velayet', href: '/bilgi/velayet-davasi' },
      { label: 'Veraset', href: '/bilgi/veraset-ilami-nasil-alinir' },
    ],
  },

  // ─── ERCİŞ (bonus, ofis bölgesi) ─────────────────────
  {
    slug: 'ercis-nufus-veraset-tapu-intikali',
    yerlesim: 'Erciş',
    il: 'Van',
    kategori: 'nufus',
    title: 'Erciş’te Nüfus, Veraset ve Tapu İntikali: Uygulamalı İskelet',
    description:
      'Erciş ve çevresinde nüfus kayıtları, veraset ilamı ve tapu intikali sürecinin genel hukuki bilgilendirmesi.',
    keywords: [
      'Erciş veraset',
      'Erciş tapu intikali',
      'Erciş miras',
      'Van Erciş nüfus',
      'veraset tapu süreci',
    ],
    h1: 'Erciş’te nüfus, veraset ve tapu intikali',
    eyebrow: 'Bölgesel hukuki makale · Erciş / Van',
    lead:
      'Erciş, Van ilinde nüfus hareketliliği ve taşınmaz işlemlerinin yoğun olduğu merkezlerden biridir. Veraset ve tapu intikali, “tek form” gibi görünse de nüfus, miras ve sicil üçlüsünün senkronuna bağlıdır.',
    keyInsight:
      'İntikal tamamlanmadan yapılan “harici satış” vaadi, hem satıcı hem alıcı için ispat ve iptal riski üretir.',
    okumaDk: 8,
    updated: UPDATED,
    theme: 'lake',
    bolgeHref: '/ercis-avukat',
    graphics: [
      {
        kind: 'flow',
        title: 'Verasetten tasarrufa',
        steps: [
          'Ölüm / nüfus',
          'Mirasçılık belgesi',
          'Tapu intikali',
          'Paylaşım / satış',
          'Tescil',
        ],
      },
      {
        kind: 'bars',
        title: 'Gecikme nedenleri (şematik)',
        items: [
          { label: 'Eksik nüfus', value: 75 },
          { label: 'Ulaşılamayan mirasçı', value: 80 },
          { label: 'Anlaşmazlık', value: 85 },
          { label: 'Belge eksikliği', value: 70 },
        ],
      },
    ],
    sections: [
      {
        heading: 'Süreç iskeleti',
        paragraphs: [
          'Miras, ölümle açılır. Mirasçılık belgesi, yasal mirasçıları gösterir. Tapuda intikal, bu belgenin sicile yansımasıdır. İntikal olmadan “malik gibi” satış yapmak, sonraki iptal ve tazminat tartışmalarını davet eder.',
        ],
      },
      {
        heading: 'Erciş pratiğinde sık tıkanmalar',
        paragraphs: [
          'Birden fazla mirasçı, yurt dışı adres, eksik nüfus bağları ve fiilî kullanıcı-mirasçı gerilimi en sık tıkanma noktalarıdır. Her biri ayrı belge ve bazen ayrı dava ister.',
        ],
      },
      {
        heading: 'Aile hukuku bağlantısı',
        paragraphs: [
          'Boşanma sonrası mal rejimi tasfiyesi ile miras bazen peş peşe gelir. Edinilmiş mallara katılma rejiminde katkı ve değer artış payı iddiaları delile bağlıdır; nüfus ve evlilik tarihi bu hesabın başlangıcıdır.',
        ],
      },
    ],
    faq: [
      {
        q: 'e-Devlet’ten veraset alınır mı?',
        a: 'Bazı hallerde elektronik yollar vardır; kapsam ve şartlar güncel uygulamaya göre değişir. Her dosya için uygun yol ayrı kontrol edilmelidir.',
      },
    ],
    related: [
      { label: 'Erciş bilgilendirme', href: '/ercis-avukat' },
      { label: 'Veraset ilamı', href: '/bilgi/veraset-ilami-nasil-alinir' },
      { label: 'Miras payı', href: '/bilgi/miras-payi-nasil-hesaplanir' },
      { label: 'Tapu devri', href: '/bilgi/tapu-devri-nasil-yapilir' },
    ],
  },

  // ─── ÇAPRAZ BÖLGE ────────────────────────────────────
  {
    slug: 'dogu-anadolu-el-birligi-mulkiyet-ve-miras-pratikleri',
    yerlesim: 'Doğu Anadolu',
    il: 'Bölgesel',
    kategori: 'miras',
    title: 'Doğu Anadolu’da El Birliği Mülkiyet ve Miras Pratikleri',
    description:
      'Van, Bitlis, Ağrı ve çevresinde sık görülen el birliği mülkiyet, fiilî kullanım ve miras paydaşlığı pratiklerine dair genel makale.',
    keywords: [
      'el birliği mülkiyet',
      'Doğu Anadolu miras',
      'paydaşlık tarla',
      'izale-i şüyu Doğu Anadolu',
      'miras ortaklığı pratik',
    ],
    h1: 'Doğu Anadolu’da el birliği mülkiyet ve miras pratikleri',
    eyebrow: 'Bölgesel hukuki makale · Van · Bitlis · Ağrı havzası',
    lead:
      'Van, Bitlis, Ağrı ve ilçelerinde (Tatvan, Ahlat, Adilcevaz, Çaldıran, Patnos, Muradiye…) tarımsal taşınmaz uyuşmazlıklarının ortak dili çoğu zaman el birliği mülkiyet ve uzun fiilî kullanımdır. Bu yazı, bölge geneli için ortak iskeleti verir.',
    keyInsight:
      'Fiilî “bölüştük” ile hukuki el birliği aynı şey değildir; sicil ve veraset düzelmeden satış güvenli sayılmaz.',
    okumaDk: 11,
    updated: UPDATED,
    theme: 'plain',
    graphics: [
      {
        kind: 'map-hint',
        title: 'Bu makalenin kapsadığı örnek yerleşimler',
        places: [
          { name: 'Van / Erciş', role: 'Havza merkezi' },
          { name: 'Çaldıran / Muradiye', role: 'Tarımsal paydaşlık' },
          { name: 'Bitlis / Tatvan', role: 'Dağ + ticaret' },
          { name: 'Ahlat / Adilcevaz', role: 'Tarih + kıyı' },
          { name: 'Ağrı / Patnos', role: 'Tarla + icra' },
        ],
      },
      {
        kind: 'compare',
        title: 'El birliği vs paylı (tekrar özet)',
        headers: ['', 'El birliği', 'Paylı'],
        rows: [
          ['Karar', 'Birlikte', 'Pay oranında esnek'],
          ['Haciz', 'Daha karmaşık', 'Pay haczedilebilir'],
          ['Satış', 'Zor', 'Pay satışı mümkün'],
        ],
      },
      {
        kind: 'flow',
        title: 'Bölgede “kilit açma” yolu',
        steps: [
          'Mirasçılar netleştir',
          'İntikal yap',
          'Paylıya geçiş / anlaşma',
          'Protokol veya izale',
          'Tescil',
        ],
      },
    ],
    sections: [
      {
        heading: 'Neden bu bölgede sık?',
        paragraphs: [
          'Tarımsal üretim, geniş aile yapıları ve intikalin yıllarca ertelenmesi, el birliği mülkiyeti “kalıcı fiilî rejim” gibi gösterir. Oysa TMK’da bu, mirasın tasfiye edilmemiş hâlidir; sonsuz “doğal düzen” değildir.',
          'Çaldıran’dan Ahlat’a, Patnos’tan Tatvan’a kadar ortak şikâyet cümlesi benzerdir: “Kardeşler anlaşamıyor, tarla işleniyor ama satılamıyor.”',
        ],
      },
      {
        heading: 'Hukuki araçlar',
        paragraphs: [
          'Paylaşım sözleşmesi, ayın taksimi, satarak paylaşma ve izale-i şüyu temel araçlardır. Ecrimisil, fiilî kullanıcıyı dengelemek için yan talep olabilir. Hangi aracın seçileceği; parsel sayısı, mirasçı sayısı, değer ve delile bağlıdır.',
        ],
      },
      {
        heading: 'Nüfus ve tebligat ortak sorunu',
        paragraphs: [
          'Ulaşılamayan mirasçı, yurt dışı adres ve tebligat usulü, tüm ilçelerde dosyayı uzatır. İlanen tebligat ve kayyım gibi usul kurumları, somut şartlarda devreye girebilir.',
        ],
      },
      {
        heading: 'Reklam yasağı ve bu metnin amacı',
        paragraphs: [
          'Bu makale dizisi, yerleşim adlarını “avukat reklamı” için değil; hukuki bilgilendirme ve arama niyetiyle kullanır. Sonuç vaadi yoktur. Somut dosyada avukata danışılmalıdır.',
        ],
      },
    ],
    faq: [
      {
        q: 'El birliği nasıl paylı mülkiyete döner?',
        a: 'Paylaşım, mahkeme kararı veya kanunun öngördüğü yollarla. Her somut geçiş, tescile yansımalıdır.',
      },
    ],
    related: [
      { label: 'Tüm bölge makaleleri', href: '/bolge-yazi' },
      { label: 'İzale-i şüyu', href: '/bilgi/izale-i-suyu' },
      { label: 'Miras ortaklığı', href: '/bilgi/miras-ortakligi-nedir' },
      { label: 'Van makalesi', href: '/bolge-yazi/van-golu-havzasi-tasinmaz-ve-miras-hukuku' },
    ],
  },
];

export function getBolgeMakale(slug: string): BolgeMakale | undefined {
  return BOLGE_MAKALELER.find((m) => m.slug === slug);
}

export function getAllBolgeMakaleSlugs(): string[] {
  return BOLGE_MAKALELER.map((m) => m.slug);
}

export function getMakalelerByYerlesim(yerlesim: string): BolgeMakale[] {
  return BOLGE_MAKALELER.filter(
    (m) => m.yerlesim.toLocaleLowerCase('tr-TR') === yerlesim.toLocaleLowerCase('tr-TR')
  );
}

export function getYerlesimList(): string[] {
  return [...new Set(BOLGE_MAKALELER.map((m) => m.yerlesim))];
}
