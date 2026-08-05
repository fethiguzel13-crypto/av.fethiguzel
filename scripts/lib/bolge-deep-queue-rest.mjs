/** Deep essays queue #4–#12 */
function essay(p) {
  return p;
}

export const DEEP_REST = [
  essay({
    slug: 'caldiran-tarimsal-tasinmaz-kadastro-ve-nufus',
    yerlesim: 'Çaldıran',
    il: 'Van',
    kategori: 'tarih',
    title: 'Çaldıran Ovası: İsim, Savaş Belleği ve Tarımın Sessiz Disiplini',
    description:
      'Çaldıran adının 1514 çağrışımı, ova ekonomisi, kış sertliği ve tarımsal toprağın kuşaklar arası aktarımı. Uzun tarih–mekân denemesi.',
    keywords: ['Çaldıran tarihi', 'Çaldıran ova', 'Van Çaldıran', '1514 bellek', 'Çaldıran tarım'],
    h1: 'Çaldıran ovası: isim, savaş belleği ve tarımın disiplini',
    eyebrow: 'Tarih · Çaldıran',
    lead:
      '“Çaldıran” denince birçok zihin 1514’e gider: Yavuz ile Şah İsmail, top sesi, Anadolu’nun doğu kapısı. Klasik anlatı muharebeyi bugünkü İran’a yakın ovalara yerleştirir; Van’ın Çaldıran ilçesi ise ismi devralmış bir bellek mekânıdır. Ova, kışın sert; yazın emektir. Bu yazı, ismin ağırlığı ile tarlanın sessizliğini yan yana koyar.',
    keyInsight:
      'Coğrafi isimler tarih taşır; günlük hayat ise ekim takvimi, nüfus kaydı ve sınır taşı ile yürür. İki katman aynı yerde, farklı dillerde konuşur.',
    okumaDk: 17,
    theme: 'plain',
    heroPhoto: {
      src: '/bolge/ova-tarim.jpg',
      alt: 'Doğu Anadolu ovası tarlaları ve uzak dağlar',
      caption: 'Ova — savaş anlatılarından sonra kalan şey: toprak ve rüzgâr.',
      credit: 'Orijinal görsel · portal arşivi',
    },
    photos: [
      {
        src: '/bolge/agri-ararat.jpg',
        alt: 'Doğu Anadolu dağ silueti',
        caption: 'Ovanın ufkunda dağ: kış ve yaz ritminin pusulası.',
      },
    ],
    graphics: [
      {
        kind: 'compare',
        title: 'İki okuma katmanı',
        headers: ['Katman', 'Ne taşır', 'Bugüne izi'],
        rows: [
          ['Tarihî isim', '1514 muharebe belleği', 'Kimlik ve anlatı'],
          ['Ova ekonomisi', 'Tarım, hayvancılık', 'Taşınmaz ve miras ritmi'],
          ['Devlet kaydı', 'Kadastro, nüfus', 'Sicil dili'],
        ],
      },
      {
        kind: 'timeline',
        title: 'İsimden tarlaya',
        items: [
          { year: '1514', label: 'Muharebe belleği', note: 'Osmanlı–Safevî hattı anlatısı' },
          { year: 'Yerleşim', label: 'İlçe adı ve ova hayatı', note: 'Kimlik gölgesi' },
          { year: 'Cumhuriyet', label: 'Kadastro ve nüfus', note: 'Sicil toprağa iner' },
          { year: 'Bugün', label: 'Ekim + paydaşlık', note: 'Fiilî kullanım ve sınır' },
        ],
      },
    ],
    sections: [
      {
        heading: 'İsim neden ağırdır?',
        paragraphs: [
          'Çaldıran Muharebesi, okul kitaplarından düğün sohbetlerine kadar zafer ve trajediyi aynı anda çağırır. Yerel insan için bu, turist broşürü değil; köy adının gölgesidir. İsim, haritada bir nokta; bellekte bir gürültüdür.',
          'Tarihî savaşlar toprak rejimini de etkiler: güvenlik, göç, yeniden iskân. Modern kadastro bu uzun hikâyenin son cümlelerinden biridir. İlk cümle top sesi olabilir; son cümle sınır taşıdır.',
          'Muharebe sahasının tam koordinatı ile ilçe idari sınırı birebir örtüşmeyebilir. Bu, ismi “sahte” yapmaz; belleğin coğrafyayı nasıl taşıdığını gösterir.',
        ],
      },
      {
        heading: 'Ovanın disiplini',
        paragraphs: [
          'Tarım arazisi, takvim ister. Ekim, hasat, sulama, hayvan — hepsi komşuluk hukukunu da üretir. Sınır taşı kaybolunca “benim sürüm orada otladı” cümlesi dosya olur. Nüfus hareketleri paydaş listesini her kuşakta yeniden karıştırır.',
          'Kış sertliği, ovanın karakteridir. Yol kapanır, iş yavaşlar, ev içi ekonomi öne çıkar. Yaz ise acele hasat ve borç kapama dönemidir. Bu ritim, alacak–borç ve miras konuşmalarının da takvimidir.',
          'Bu deneme, tarımsal taşınmazı soğuk madde listesiyle anlatmaz. Ovanın ruhu, sabah erken çıkanların ayakkabı tozundadır.',
        ],
      },
      {
        heading: 'Kadastro çizgisi, anlatı çizgisi',
        paragraphs: [
          'Kadastro milimetre ister; anlatı metre ve kuşak ister. “Eskiden burası…” cümlesi ile harita çizgisi çatıştığında keşif ve tanık devreye girer. Teknik dil soğuktur; emek sıcaktır.',
          'Paydaşlık, ova ailesinde sık görülür. Kim eker, kim şehirde, kim “hakkımı ister” — üç ses aynı tarlada. El birliği kâğıtta birlikte der; sahada bazen kilit demektir.',
        ],
        photo: {
          src: '/bolge/ova-tarim.jpg',
          alt: 'Tarım arazisi',
          caption: 'Çizgi tarlada görünmez; defterde görünür.',
        },
        callout: {
          title: 'Okuma sırası',
          body: 'Önce mirasçılar, sonra sicil, en sonda fiilî kullanım — sıra bozulursa tartışma bozulur.',
        },
      },
      {
        heading: 'Nüfus ve ova',
        paragraphs: [
          'Doğum, evlilik, ölüm kayıtları toprağın görünmez dosyasıdır. Kayıt gecikirse intikal gecikir; tarla yine de ekilir. Bu gerilim, “zaman geçti, hak bitti” sanrısına yol açmamalıdır; süreler talep türüne göredir.',
          'Göç ve dönüş, ovanın insan stokunu dalgalandırır. Dışarıda yaşayan paydaş, hasat zamanı görünür; kışın sessizdir. Hukuk bu sessizliği yok saymaz; ispat ve tebligat sorunu üretir.',
        ],
      },
      {
        heading: '1514 gölgesi, 21. yüzyıl defteri',
        paragraphs: [
          'İsim ağırdır; defter sadedir. İkisi de Çaldıran’a aittir. Savaş anlatısı kimlik üretir; ekim takvimi ekmek üretir. Deneme, birini diğerine feda etmez.',
          'Reklam ve sonuç vaadi dışarıdadır. Okurun elinde kalan şey, ismin tarih taşıdığını ve tarlanın hâlâ disiplin istediğini hatırlamaktır.',
        ],
      },
      {
        heading: 'Sınır notu',
        paragraphs: [
          'Metin genel okumadır. Somut parsel, mirasçı listesi ve güncel mevzuat olmadan sonuç çıkmaz. Muharebe tarihi tartışmaları arkeoloji ve tarih disiplininindir; bu yazı bellek ve ova ritmine odaklanır.',
          'Şehir adıyla iş edinme dili bilerek kullanılmamıştır. Okuma, pusula içindir; sonuç vaadi içermez.',
        ],
      },
    ],
    faq: [
      {
        q: '1514 savaşı tam olarak bu ilçede mi yapıldı?',
        a: 'Klasik anlatı muharebeyi bugünkü İran’a yakın Çaldıran ovasına yerleştirir. İlçe adı bellek ve idari coğrafyada yaşar; kesin saha arkeolojisi ayrı tartışmadır.',
      },
      {
        q: 'Neden tarım ve savaş birlikte anılıyor?',
        a: 'İsim belleği ile ova ekonomisi aynı yerde durur; biri kimlik, diğeri geçim dilidir.',
      },
      {
        q: 'Bu yazı hukuki tavsiye midir?',
        a: 'Hayır. Mekân ve tarih bağlamlı genel okumadır.',
      },
    ],
    related: [
      { label: 'Patnos: alacak ve tarım', href: '/bolge-yazi/patnos-icra-tarimsal-alacak-ve-nufus' },
      { label: 'Muradiye aile ve nüfus', href: '/bolge-yazi/muradiye-aile-miras-ve-nufus-olaylari' },
      { label: 'Van Gölü havzası', href: '/bolge-yazi/van-golu-havzasi-tasinmaz-ve-miras-hukuku' },
    ],
  }),
  essay({
    slug: 'bitlis-miras-paydasligi-ve-daglik-tasinmaz',
    yerlesim: 'Bitlis',
    il: 'Bitlis',
    kategori: 'tarih',
    title: 'Bitlis Vadisi: Taş Evler, Dar Sokaklar ve Mirasın Eğimi',
    description:
      'Bitlis’in vadiye sıkışmış kentsel dokusu, taş mimari, kale belleği ve dağlık taşınmazın kuşaklar arası paylaşımı. Uzun mekân denemesi.',
    keywords: ['Bitlis tarihi', 'Bitlis vadi', 'Bitlis taş evler', 'Bitlis kale', 'Doğu Anadolu miras'],
    h1: 'Bitlis vadisi: taş evler, dar sokaklar ve mirasın eğimi',
    eyebrow: 'Mekân · Bitlis',
    lead:
      'Bitlis’e iniş, düz ova şehri gibi değildir. Vadi sizi önce daraltır, sonra taş duvarlarla sarar. Evler yamaca yaslanır; sokaklar nefes alır gibi kıvrılır. Kale kayası ve tarihi doku, şehri açık hava arşivine çevirir. Burada miras, haritadaki düz dikdörtgenden çok, eğimli bir avlunun paylaşımıdır.',
    keyInsight:
      'Dağlık ve vadi içi taşınmazda “eşit pay” hesabı ile fiilî kullanım (alt kat, üst kat, avlu, bağ) sık sık çatışır. Eğim, hukuku da eğriltir.',
    okumaDk: 18,
    theme: 'historic',
    heroPhoto: {
      src: '/bolge/bitlis.jpg',
      alt: 'Bitlis vadi yerleşimi ve dağlık siluet',
      caption: 'Vadi — şehir dikey büyür, miras da dikeyleşir.',
      credit: 'Orijinal görsel · portal arşivi',
    },
    photos: [
      {
        src: '/bolge/tatvan.jpg',
        alt: 'Tatvan liman hattı',
        caption: 'Vadi ile göl kapısı: Bitlis–Tatvan nefes hattı.',
      },
      {
        src: '/bolge/ahlat.jpg',
        alt: 'Ahlat taş mezarlık',
        caption: 'İl coğrafyasının diğer yüzü: Ahlat’ın taş arşivi.',
      },
    ],
    graphics: [
      {
        kind: 'map-hint',
        title: 'Bitlis çevresi okuması',
        places: [
          { name: 'Merkez vadi', role: 'Tarihi doku, taş konut' },
          { name: 'Kale hattı', role: 'Bellek ve siluet' },
          { name: 'Tatvan', role: 'Göl kapısı, liman' },
          { name: 'Ahlat', role: 'Mezarlık ve göl kıyısı' },
          { name: 'Yaylalar', role: 'Yazlık kullanım, hayvancılık' },
        ],
      },
      {
        kind: 'compare',
        title: 'Kâğıt payı / fiilî kat',
        headers: ['Ölçüt', 'Kâğıt', 'Vadi gerçeği'],
        rows: [
          ['Pay', 'Eşit hisse satırı', 'Alt kat, üst kat, avlu'],
          ['Erişim', 'Ada-parsel', 'Merdiven, dar sokak, eğim'],
          ['Değer', 'Metrekare', 'Manzara + kullanılabilirlik'],
        ],
      },
    ],
    sections: [
      {
        heading: 'Eğimin mimarisi',
        paragraphs: [
          'Bitlis’te ev, manzaraya göre değil; yamaca göre kurulur. Alt kat ahır veya depo, üst kat yaşam; avlu herkesin geçtiği ortak nefestir. Bu fiziki düzen, hukuki paydaşlığı da etkiler: “eşit hisse” kâğıtta vardır, fiilî oda ve avlu kullanımı yıllarca tek kişide toplanmış olabilir.',
          'Kale ve tarihi doku, şehri bir açık hava arşivine çevirir. Turist fotoğraf çeker; yerli, kışın soba yakacak odun hesabı yapar. İki bakış aynı taş duvarda buluşur.',
          'Dar sokak, sesi büyütür. Komşuluk burada teorik değil; duvar ince, merdiven ortak, kış uzun. Miras konuşması da bu darlıkta yapılır — fısıltı ile, bazen yüksek sesle.',
        ],
      },
      {
        heading: 'Dağlık taşınmazın hukuki gölgesi',
        paragraphs: [
          'Bağ, bahçe, yayla hissesi ve şehir evi — çoğu aile portföyünde bir aradadır. El birliği mülkiyet, vadi içinde satış ve rehin planını yavaşlatır. Keşif bilirkişisi eğimi, erişimi, fiilî yolu ölçer; mahkeme dosyası haritadan çok “ayak izi” ister.',
          'Yayla ve bağ, yazın dolup kışın sönen kullanımlardır. Sicilde “arazi” satırı; sahada mevsimlik nefes. Bu fark anlaşılmadan yalnızca parsel numarasıyla konuşmak eksiktir.',
          'Bu yazı, Bitlis’i dava reklamına alet etmez. Vadiyi anlatır: dar sokak, yüksek duvar, uzun bellek.',
        ],
      },
      {
        heading: 'Kale, bellek, gündelik',
        paragraphs: [
          'Kale kayası, şehrin omurgasıdır. Fotoğrafta siluet; yerelde yön tarifi. “Kalenin o yanı” bir pusuladır. Tarih katmanları (ortaçağdan Cumhuriyete) taş duvarda birikir; modern beton araya sızar.',
          'Gündelik hayat, kaleyi müze gibi değil; arka plan gibi kullanır. Çarşı, okul yolu, kışın buzlu merdiven… Bellek, bu sıradanlığın içindedir.',
        ],
        photo: {
          src: '/bolge/bitlis.jpg',
          alt: 'Bitlis vadi',
          caption: 'Eğim hem mimari hem miras dilidir.',
        },
      },
      {
        heading: 'Paylaşmak: bölmek mi, idare etmek mi?',
        paragraphs: [
          '“Malı bölmek” bazen toprağı öldürmek gibi hissedilir; “bölmemek” ise genç kuşağı kilitlemek. Vadi bu ikilemi sert yaşar: satılacak metrekare az, duygusal yük çok.',
          'Ortaklığın giderilmesi, paylıya geçiş, ecrimisil — soğuk araçlardır. İşe yaradıkları yerde ilişkiyi bitirmez, yeniden biçimlendirir. Anlaşma varsa mahkeme salonu gerekmez; yoksa keşif ve süre devreye girer.',
        ],
        callout: {
          title: 'Sınır',
          body: 'Genel bilgilendirmedir. Somut paydaş listesi, tapu ve güncel içtihat olmadan sonuç çıkmaz.',
        },
      },
      {
        heading: 'Tatvan ve Ahlat: ilin iki nefesi',
        paragraphs: [
          'Bitlis merkeze kapanmaz. Tatvan göl kapısıdır; Ahlat taş arşividir. Aynı il, üç tempo: vadi, liman, mezarlık. Aile malları bazen bu üç coğrafyaya da dağılır.',
          'Bu dağınıklık, miras envanterini zorlaştırır; ama şehrin ruhunu da zenginleştirir. Deneme, merkeze sıkışmayı reddeder.',
        ],
      },
      {
        heading: 'Ne vaat edilmez',
        paragraphs: [
          'Reklam, sonuç vaadi ve şehir adıyla iş edinme dili dışarıdadır. Okurun elinde kalan şey, eğimin yalnızca manzara değil; mülkiyet ve miras dili olduğunu hatırlamaktır.',
          'Vadi dar, bellek uzundur. İkisi birden Bitlis’tir.',
        ],
      },
    ],
    faq: [
      {
        q: 'Neden miras Bitlis’te “zor” anlatılır?',
        a: 'Fiziki eğim ve çok parçalı kullanım, kâğıttaki payı sahada karmaşıklaştırır; bu yapısal bir gözlemdir.',
      },
      {
        q: 'Yayla hissesi neden ayrı konuşulur?',
        a: 'Mevsimlik kullanım, sicil satırı ile fiilî hayat arasında mesafe açar; envanterde unutulmaması gerekir.',
      },
      {
        q: 'Bu yazı hukuki tavsiye midir?',
        a: 'Hayır. Mekân ve bellek bağlamlı genel okumadır.',
      },
    ],
    related: [
      { label: 'Tatvan liman denemesi', href: '/bolge-yazi/tatvan-ticaret-kira-ve-ulastirma-hukuku' },
      { label: 'Ahlat taşların dili', href: '/bolge-yazi/ahlat-vakif-miras-ve-tarihi-tasinmazlar' },
      { label: 'El birliği denemesi', href: '/bolge-yazi/dogu-anadolu-el-birligi-mulkiyet-ve-miras-pratikleri' },
    ],
  }),
  essay({
    slug: 'tatvan-ticaret-kira-ve-ulastirma-hukuku',
    yerlesim: 'Tatvan',
    il: 'Bitlis',
    kategori: 'ticaret',
    title: 'Tatvan: Feribot Düdüğü, Raylar ve Gölün Kapısı',
    description:
      'Tatvan’ın liman ve demiryolu kimliği, Van Gölü geçişi, lojistik bellek ve ticaret temposu. Ulaşımın şekillendirdiği kent denemesi.',
    keywords: ['Tatvan feribot', 'Tatvan liman', 'Van Gölü feribot', 'Tatvan tarihi', 'Tatvan demiryolu'],
    h1: 'Tatvan: feribot düdüğü, raylar ve gölün kapısı',
    eyebrow: 'Kent · Tatvan',
    lead:
      'Tatvan’da sabah sesi bazen ezan, bazen feribot düdüğüdür. Tren vagonlarının gölü “yüzerek” geçtiği bu kapı, Doğu’nun lojistik cümlesidir. Kent, dağ ile su arasında sıkışmış bir nefes alma yeridir; ticaret burada romantik değil, ritmiktir. Bu yazı, düdüğü ve rayı anlatır — iş edinme metni değildir.',
    keyInsight:
      'Liman kenti kimliği; kira, depolama, taşıma ve geçici konaklama ilişkilerini “düz ilçe”den farklı bir tempo ile kurar.',
    okumaDk: 17,
    theme: 'trade',
    heroPhoto: {
      src: '/bolge/tatvan.jpg',
      alt: 'Tatvan liman ve feribot silueti, Van Gölü',
      caption: 'Gölün batı kapısı — ray, iskele, ufuk.',
      credit: 'Orijinal görsel · portal arşivi',
    },
    photos: [
      {
        src: '/bolge/van-golu.jpg',
        alt: 'Van Gölü',
        caption: 'Geçişin diğer ucu: gölün geniş nefesi.',
      },
      {
        src: '/bolge/bitlis.jpg',
        alt: 'Bitlis vadi',
        caption: 'Kapıdan vadiye: Tatvan–Bitlis hattı.',
      },
    ],
    graphics: [
      {
        kind: 'timeline',
        title: 'Tatvan’ın lojistik belleği (özet)',
        items: [
          { year: 'Osmanlı izi', label: 'Göl ve sefer güzergâhları', note: 'Liman fikri' },
          { year: 'Cumhuriyet', label: 'Demiryolu + feribot', note: 'Vagonların göl geçişi' },
          { year: 'Bugün', label: 'Karayolu + göl + demir', note: 'Çok modlu geçit' },
        ],
      },
      {
        kind: 'flow',
        title: 'Geçiş ekonomisinin kaba zinciri',
        steps: ['Yük / yolcu gelir', 'Depo veya otel', 'Feribot / karayolu', 'Karşı kıyı veya dağ geçidi', 'Teslim ve hesap'],
      },
    ],
    sections: [
      {
        heading: 'Kapı kenti olmak',
        paragraphs: [
          'Tatvan, Van’a ve İran yönüne açılan bir eşiktir. Yük ve yolcu, dağ geçitlerinden iner; gölde nefes alır. Bu geçiş ekonomisi; otel, depo, esnaf kirası, nakliye sözü ve “bir gece kalıp sabah feribota” ritmini üretir.',
          'Tarihî anlatılarda Çaldıran sonrası Osmanlı’nın doğuya yerleşmesi ve göl kıyısı liman fikri Tatvan’ı haritada tutar. Modern feribot ise o eski kapı sezgisinin demir ve çelik hâlidir.',
          'Kapı olmak, hem fırsat hem acele demektir. İnsanlar gelir geçer; bazıları kalır. Kalanlar, düdüğü her gün duyar.',
        ],
      },
      {
        heading: 'Ray, iskele, rüzgâr',
        paragraphs: [
          'Demiryolu ve feribot, Tatvan’ı “sıradan ilçe” cümlesinden çıkarır. Vagonların göl geçişi, hem mühendislik hem de bellek imgesidir. Çocuklar iskeleyi seyreder; esnaf sefer saatine göre dükkân açar.',
          'Rüzgâr gölde sertleşir. Sefer aksamaları, “mücbir sebep” tartışmasını tetikleyebilir — ama her aksama o kapıya girmez. Sözleşme dilinde somut şart ve süre istenir.',
        ],
        photo: {
          src: '/bolge/tatvan.jpg',
          alt: 'Liman',
          caption: 'Düdük, ray ve su: üçlü ritim.',
        },
      },
      {
        heading: 'Ticaretin hukuki gölgesi',
        paragraphs: [
          'Taşıma, kira ve esnaf ilişkileri burada “tek seferlik” gibi görünür; oysa fatura, teslim ve gecikme her zaman yazılı iz ister. Göl geçişinin aksamasi, sözleşmede gecikme ve risk dağılımını açar.',
          'Depo ve dükkân kiraları, sefer yoğunluğuna bağlı dalgalanabilir. “Sezon” kelimesi turizmden çok lojistiktir. Bu ritim anlaşılmadan kira tartışması eksik kalır.',
          'Bu metin, Tatvan’ı arama motoru yemi yapmaz. Düdüğü, rayı ve suyu anlatır.',
        ],
        callout: {
          title: 'Not',
          body: 'İşletme düzeni ve seferler dönemseldir; güncel resmî duyuru esastır.',
        },
      },
      {
        heading: 'Geçici konaklama, kalıcı bellek',
        paragraphs: [
          'Bir gece otel, akraba evi, şoför kahvesi… Geçiş kenti, geçici ilişkiler üretir. Geçicilik, bazen ispatı zorlaştırır: kim neyi ne zaman teslim etti?',
          'Kalıcı bellek ise limanın siluetidir. Kent değişse de düdük, “burası kapı” der.',
        ],
      },
      {
        heading: 'Bitlis vadisine bakış',
        paragraphs: [
          'Tatvan merkeze kapanmaz; Bitlis vadisine bağlanır. Dağ yolu, kışın sert; yazın yüklüdür. Kapı ile vadi, aynı ilin iki nefesi.',
          'Aile malları bazen liman dükkânı ile vadi evi arasında bölünür. Envanter, bu iki temposu da görmelidir.',
        ],
      },
      {
        heading: 'Ne vaat edilmez',
        paragraphs: [
          'Reklam ve sonuç vaadi dışarıdadır. Okurun elinde kalan şey, liman kimliğinin kenti nasıl kurduğunu hatırlamaktır.',
          'Feribot düdüğü, şiir değil; ritimdir. Ritim bozulunca sözleşme de konuşur — ama afetten veya aksamadan önce yazılmışsa daha net konuşur.',
        ],
      },
    ],
    faq: [
      {
        q: 'Feribot hâlen vagon taşıyor mu?',
        a: 'İşletme düzeni dönemseldir; güncel sefer ve yük kabulü resmî duyurulardan izlenmelidir.',
      },
      {
        q: 'Neden kira ve taşıma birlikte anılıyor?',
        a: 'Geçiş ekonomisi depo, otel ve nakliyeyi aynı ritimde tutar; biri aksayınca diğeri etkilenir.',
      },
      {
        q: 'Bu yazı hukuki tavsiye midir?',
        a: 'Hayır. Kent ve lojistik bellek denemesidir.',
      },
    ],
    related: [
      { label: 'Bitlis vadi denemesi', href: '/bolge-yazi/bitlis-miras-paydasligi-ve-daglik-tasinmaz' },
      { label: 'Van Gölü havzası', href: '/bolge-yazi/van-golu-havzasi-tasinmaz-ve-miras-hukuku' },
      { label: 'Adilcevaz kıyı', href: '/bolge-yazi/adilcevaz-gol-kiyisi-mulkiyet-ve-miras' },
    ],
  }),
  essay({
    slug: 'adilcevaz-gol-kiyisi-mulkiyet-ve-miras',
    yerlesim: 'Adilcevaz',
    il: 'Bitlis',
    kategori: 'kultur',
    title: 'Adilcevaz: Ceviz Gölgesi, Kıyı Rüzgârı ve Yavaş Zaman',
    description:
      'Adilcevaz’ın ceviz ve göl kimliği, kıyı yerleşiminin ritmi ve toprağın yavaş aktarımı. Uzun kıyı denemesi.',
    keywords: ['Adilcevaz ceviz', 'Adilcevaz Van Gölü', 'Bitlis Adilcevaz', 'Adilcevaz deneme'],
    h1: 'Adilcevaz: ceviz gölgesi, kıyı rüzgârı ve yavaş zaman',
    eyebrow: 'Kıyı · Adilcevaz',
    lead:
      'Adilcevaz’ta yaz, ceviz yaprağının gölgesinde yürür. Göl, ufku açar; dağ, arkayı kapatır. Burası acele şehri değildir. Hasat, düğün, misafir — zaman tarım takvimine göre akar. Bu deneme, o yavaşlığın içinden toprağı okur.',
    keyInsight:
      'Uzun ömürlü dikim (ceviz) ve kıyı arazisi, miras ve kullanım tartışmalarını “bir yıllık ekin”den daha uzun vadeli kılar.',
    okumaDk: 17,
    theme: 'lake',
    heroPhoto: {
      src: '/bolge/van-golu.jpg',
      alt: 'Van Gölü kıyı manzarası',
      caption: 'Kuzeybatı kıyı — Ahlat ile Tatvan arasında bir nefes.',
      credit: 'Orijinal görsel · portal arşivi',
    },
    photos: [
      {
        src: '/bolge/ahlat.jpg',
        alt: 'Ahlat mezar taşları',
        caption: 'Komşu bellek: Ahlat’ın taş ciddiyeti.',
      },
      {
        src: '/bolge/ova-tarim.jpg',
        alt: 'Tarım arazisi',
        caption: 'Ceviz ve tarla: uzun vadeli emek.',
      },
    ],
    graphics: [
      {
        kind: 'timeline',
        title: 'Yavaş zamanın iskeleti',
        items: [
          { year: 'Dikim', label: 'Ceviz ve bağ', note: 'Kuşak ister' },
          { year: 'Bakım', label: 'Budama, sulama, hasat', note: 'Fiilî emek' },
          { year: 'Miras', label: 'Paydaşlık konuşması', note: 'Kim baktı, kim uzak' },
          { year: 'Kıyı', label: 'Manzara ve plan notu', note: 'İmar katmanı' },
        ],
      },
      {
        kind: 'map-hint',
        title: 'Kıyı okuması',
        places: [
          { name: 'Adilcevaz', role: 'Ceviz ve yavaş ritim' },
          { name: 'Ahlat', role: 'Taş arşivi' },
          { name: 'Tatvan', role: 'Liman temposu' },
          { name: 'Göl', role: 'Ortak ufuk' },
        ],
      },
    ],
    sections: [
      {
        heading: 'Cevizin hukuku yoktur, ama zamanı vardır',
        paragraphs: [
          'Ceviz ağacı, bir mevsimlik plan değildir. Dikeni, budaması, hasadı kuşak ister. Bu yüzden “kim dikti, kim baktı” anlatısı, paydaşlar arasında fiilî emek tartışması üretir. Hukuk bunu ecrimisil, el atma, ortaklığın giderilmesi dilleriyle çevirir; köy ise “hak” kelimesini emekle doldurur.',
          'Göl manzaralı parsellerde imar ve kıyı düzenlemeleri ek katman getirir. Manzara, hem güzellik hem de plan notudur.',
          'Yavaş zaman, acele satış baskısını azaltabilir; ama mirasçılar çoğaldıkça yavaşlık da gerilim üretir. “Bırak dursun” ile “benim payım” aynı sofrada çatışır.',
        ],
      },
      {
        heading: 'Yavaş kentin bellek defteri',
        paragraphs: [
          'Adilcevaz, Ahlat’ın taş ciddiyetinden biraz daha yumuşak; Tatvan’ın liman temposundan daha sakindir. Bu orta ritim, ailelerin toprağı acele satmadan tutma eğilimini besler. El birliği yıllarca “idare edilir” — ta ki bir düğün, bir göç veya bir borç kapıyı çalana kadar.',
          'Misafirlik ve düğün, kıyı ilçesinin sosyal takvimidir. Toprak konuşması da çoğu zaman bu takvimde yapılır: hasat sonrası, kış oturumunda.',
        ],
        photo: {
          src: '/bolge/van-golu.jpg',
          alt: 'Göl',
          caption: 'Ufuk açık, tempo yavaş.',
        },
      },
      {
        heading: 'Kıyı rüzgârı ve sınır',
        paragraphs: [
          'Kıyı, rüzgârı ve suyu taşır; bazen de fiilî sınır kayması anlatılarını. “Eskiden burası…” cümlesi ile kadastro çizgisi çatışabilir. Teknik ölçüm olmadan salt anlatı yetmez.',
          'Komşuluk, sazlık ve bağ yolunda yürür. Dar yollar, ortak geçişler, suyun kenarı — hepsi fiilî kullanım fotoğrafına girer.',
        ],
      },
      {
        heading: 'Miras: uzun vadeli emek',
        paragraphs: [
          'Bir yıllık ekin ile ceviz aynı “tarla” kelimesine sığmaz. İkincisi, emek hesabını uzatır. “Ben baktım” iddiası, yılların budama izine yaslanır.',
          'Paylaşım planı yapılacaksa envanter yalnızca metrekare değil; ağaç, verim ve fiilî bakım da taşır. Aksi hâlde adalet duygusu zedelenir — hukuk dili bunu “değer ve kullanım” diye çevirir.',
        ],
        callout: {
          title: 'Not',
          body: 'Genel bilgilendirmedir. Somut ağaç, parsel ve mirasçı listesi olmadan sonuç çıkmaz.',
        },
      },
      {
        heading: 'Ahlat ve Tatvan arasında',
        paragraphs: [
          'Adilcevaz, iki güçlü komşu arasında kendi ritmini korur. Taş arşivi ile liman temposu arasında yavaşlık, bir tercih değil; coğrafi karakterdir.',
          'Bu karakter, denemenin de omurgasıdır: acele etmeden okumak.',
        ],
      },
      {
        heading: 'Ne vaat edilmez',
        paragraphs: [
          'Reklam ve sonuç vaadi dışarıdadır. Okurun elinde kalan şey, ceviz gölgesinin zaman demek olduğunu hatırlamaktır.',
          'Yavaş zaman, dosyayı silmez; sadece temposunu değiştirir.',
        ],
      },
    ],
    faq: [
      {
        q: 'Neden ceviz bu kadar öne çıkıyor?',
        a: 'Uzun ömürlü dikim, miras ve emek tartışmasını bir yıllık ekinden farklı kılar; Adilcevaz kimliğinin de parçasıdır.',
      },
      {
        q: 'Kıyı parseli özel midir?',
        a: 'Manzara ve plan notları ek katman getirebilir; rejim genel hukuk dilindedir, somut kayıt esastır.',
      },
      {
        q: 'Bu yazı hukuki tavsiye midir?',
        a: 'Hayır. Mekân ve bellek denemesidir.',
      },
    ],
    related: [
      { label: 'Ahlat mezarlık denemesi', href: '/bolge-yazi/ahlat-vakif-miras-ve-tarihi-tasinmazlar' },
      { label: 'Tatvan liman', href: '/bolge-yazi/tatvan-ticaret-kira-ve-ulastirma-hukuku' },
      { label: 'El birliği denemesi', href: '/bolge-yazi/dogu-anadolu-el-birligi-mulkiyet-ve-miras-pratikleri' },
    ],
  }),
  essay({
    slug: 'agri-sinir-bolgesi-tasinmaz-miras-ve-idare',
    yerlesim: 'Ağrı',
    il: 'Ağrı',
    kategori: 'tarih',
    title: 'Ağrı ve Ağrı Dağı: Sınır Ufku, Karlı Zirve ve Yayla Belleği',
    description:
      'Ağrı Dağı siluetinin kimlik gücü, sınır coğrafyası, ova ve yayla yaşamının hukuki gölgesi. Uzun coğrafya denemesi.',
    keywords: ['Ağrı Dağı', 'Ağrı yayla', 'Doğu Anadolu sınır', 'Ağrı deneme', 'Ağrı ova'],
    h1: 'Ağrı ve Ağrı Dağı: sınır ufku, karlı zirve ve yayla belleği',
    eyebrow: 'Coğrafya · Ağrı',
    lead:
      'Ağrı Dağı, ova insanının her sabah baktığı bir cümledir. Kar, yazın bile zirvede bir hatırlatma gibi durur. Sınır coğrafyası, ticareti ve göçü şekillendirir; yayla ise yazın nefesi olur. Bu yazı, dağı poster gibi değil; günlük ufkun parçası olarak okur.',
    keyInsight:
      'Sınır ve yayla ekonomisi; taşınmazı, hayvanı ve mevsimlik hareketi aynı aile bütçesinde birleştirir.',
    okumaDk: 17,
    theme: 'mountain',
    heroPhoto: {
      src: '/bolge/agri-ararat.jpg',
      alt: 'Ağrı Dağı karlı zirve ve ön planda plato',
      caption: 'Zirve — hem coğrafya hem kimlik.',
      credit: 'Orijinal görsel · portal arşivi',
    },
    photos: [
      {
        src: '/bolge/ova-tarim.jpg',
        alt: 'Plato tarım',
        caption: 'Ova ve plato: zirvenin altındaki hayat.',
      },
    ],
    graphics: [
      {
        kind: 'map-hint',
        title: 'Okuma noktaları',
        places: [
          { name: 'Ağrı ovası', role: 'Kentsel ve tarımsal zemin' },
          { name: 'Ağrı Dağı', role: 'Siluet ve bellek' },
          { name: 'Yaylalar', role: 'Mevsimlik yaşam' },
          { name: 'Sınır hattı', role: 'Ticaret ve geçiş disiplini' },
        ],
      },
      {
        kind: 'timeline',
        title: 'Mevsimlik nefes',
        items: [
          { year: 'İlkbahar', label: 'Ova uyanır', note: 'Ekim ve yol' },
          { year: 'Yaz', label: 'Yayla dolar', note: 'Hayvan ve geçici yapı' },
          { year: 'Sonbahar', label: 'İniş ve hesap', note: 'Hasat ve borç' },
          { year: 'Kış', label: 'Ova ve ev', note: 'Sert iklim, iç plan' },
        ],
      },
    ],
    sections: [
      {
        heading: 'Dağa bakmak',
        paragraphs: [
          'Ağrı’da yön tarifleri bazen dağa göredir. “Dağın o yanı” bir pusuladır. Fotoğrafçılar altın saati bekler; çoban, bulutun gölgesini. Bu ortak bakış, kenti tek tip AVM şehrinden ayırır.',
          'Sınır bölgesi olmak, idari prosedürleri ve geçiş disiplinini hayata sokar. Gümrük, pasaport, taşıma belgesi — bunlar “merkez” dilidir; yerelde ekmek kapısı da olabilir.',
          'Dağ, poster değildir. Kar, rüzgâr, yol kapanması — hepsi günlük plandır. Hukuk dosyası da bu plana takılır: tebligat, keşif, süre.',
        ],
      },
      {
        heading: 'Yayla ve miras',
        paragraphs: [
          'Yayla hisseleri, fiilî kullanım ve miras paydaşlığı sıklıkla iç içedir. Yazın dolan, kışın boşalan yapılar; sicilde “arazi” satırı olarak kalır. Bu ritim anlaşılmadan sadece parsel numarasıyla konuşmak eksiktir.',
          'Hayvan, yol ve su — yaylanın üçlüsüdür. Paydaşlar arasında “kim çıkardı, kim baktı” sorusu, şehir dairesi mirasından farklı bir emek dili üretir.',
        ],
        photo: {
          src: '/bolge/agri-ararat.jpg',
          alt: 'Ağrı Dağı',
          caption: 'Zirve sabit; yayla mevsimliktir.',
        },
      },
      {
        heading: 'Ova ile sınır arasında',
        paragraphs: [
          'Ova, tarım ve kent zeminidir; sınır hattı ise geçiş ve disiplindir. Aynı aile, iki dilde yaşayabilir: ekim hesabı ve geçiş hesabı.',
          'Taşınmaz portföyü bazen ova tarlası + yayla hissesi + şehir dairesi demetidir. Envanter, dağın gölgesinde unutulmamalıdır.',
        ],
      },
      {
        heading: 'Kışın sertliği, dosyanın yavaşlığı',
        paragraphs: [
          'Kış, yolu ve işi yavaşlatır. Keşif ve tebligat planları da bu yavaşlığa takılabilir. Coğrafya, usulün sessiz ortağıdır.',
          'Bu gözlem, “her şey ertelenir” demek değildir. Yalnızca plan yaparken iklimi yok saymamayı önerir.',
        ],
        callout: {
          title: 'Sınır',
          body: 'Genel bilgilendirmedir. Tırmanış, sınır geçişi ve güvenlik için resmî uyarılar esastır.',
        },
      },
      {
        heading: 'Kimlik olarak zirve',
        paragraphs: [
          'Ağrı Dağı, ilin adıyla özdeşleşir. Bu özdeşlik, turistik slogan değil; sabah bakışıdır. Çocuklar dağı tanıyarak büyür.',
          'Deneme, dağı mülk gibi satmaz. Ufuk olarak bırakır.',
        ],
      },
      {
        heading: 'Ne vaat edilmez',
        paragraphs: [
          'Reklam ve sonuç vaadi dışarıdadır. Okurun elinde kalan şey, zirvenin kimlik; yaylanın ise ritim olduğunu hatırlamaktır.',
          'Sınır coğrafyası, prosedür üretir; prosedür, bellek kadar gerçektir.',
        ],
      },
    ],
    faq: [
      {
        q: 'Yazı dağcılık rehberi midir?',
        a: 'Hayır. Mekân ve bellek denemesidir; tırmanış ve güvenlik için resmî uyarılar esastır.',
      },
      {
        q: 'Yayla hissesi neden önemli?',
        a: 'Mevsimlik kullanım, miras ve fiilî emek tartışmasını ova tarlasından farklı kılar.',
      },
      {
        q: 'Bu yazı hukuki tavsiye midir?',
        a: 'Hayır. Coğrafya bağlamlı genel okumadır.',
      },
    ],
    related: [
      { label: 'Patnos tarım denemesi', href: '/bolge-yazi/patnos-icra-tarimsal-alacak-ve-nufus' },
      { label: 'Çaldıran ovası', href: '/bolge-yazi/caldiran-tarimsal-tasinmaz-kadastro-ve-nufus' },
      { label: 'Doğu Anadolu el birliği', href: '/bolge-yazi/dogu-anadolu-el-birligi-mulkiyet-ve-miras-pratikleri' },
    ],
  }),
  essay({
    slug: 'patnos-icra-tarimsal-alacak-ve-nufus',
    yerlesim: 'Patnos',
    il: 'Ağrı',
    kategori: 'genel',
    title: 'Patnos Ovası: Ekim Hesabı, Veresiye Defteri ve Nüfusun Ritmi',
    description:
      'Patnos ovasının tarımsal temposu, alacak–borç kültürü ve nüfus hareketlerinin toprakla ilişkisi. Uzun ova denemesi.',
    keywords: ['Patnos ova', 'Patnos tarım', 'Ağrı Patnos', 'Patnos deneme'],
    h1: 'Patnos ovası: ekim hesabı, veresiye defteri ve nüfusun ritmi',
    eyebrow: 'Ova · Patnos',
    lead:
      'Patnos’ta yıl, ekinle ölçülür. Tohum, gübre, mazot, yağmur — dört kelime bir bütçe kurar. Veresiye defteri hâlâ bazı dükkânlarda yaşar; icra dosyası ise modern dilin sert yüzüdür. Bu yazı, o iki dili aynı ovada dinler.',
    keyInsight:
      'Tarımsal nakit döngüsü bozulunca alacak hukuku devreye girer; ama sorunun kökü çoğu zaman mevsim ve fiyattır.',
    okumaDk: 17,
    theme: 'plain',
    heroPhoto: {
      src: '/bolge/ova-tarim.jpg',
      alt: 'Tarımsal ova ve uzak dağlar',
      caption: 'Ova — hesap tarlada başlar, defterde biter.',
      credit: 'Orijinal görsel · portal arşivi',
    },
    photos: [
      {
        src: '/bolge/agri-ararat.jpg',
        alt: 'Dağ silueti',
        caption: 'Ovanın ufkunda zirve: Ağrı coğrafyasının ortak cümlesi.',
      },
    ],
    graphics: [
      {
        kind: 'flow',
        title: 'Tarımsal yılın kaba akışı',
        steps: ['Girdi (tohum/mazot)', 'Ekim', 'Bekleyiş / risk', 'Hasat', 'Satış ve borç kapama'],
      },
      {
        kind: 'compare',
        title: 'İki dil',
        headers: ['Dil', 'Araç', 'Risk'],
        rows: [
          ['Veresiye defteri', 'Güven ve alışkanlık', 'İspat zayıf'],
          ['Senet / fatura', 'Yazılı iz', 'Süre ve takip'],
          ['İcra', 'Usul ve tebligat', 'Sert sonuç'],
        ],
      },
    ],
    sections: [
      {
        heading: 'Defterden dosyaya',
        paragraphs: [
          'Küçük esnaf ve tarım ilişkisinde güven, yıllarca sözle yürür. Sonra bir kurak yıl, bir fiyat düşüşü — defter satırları sertleşir. Hukuk, senet, fatura ve icra diliyle devreye girer. Bu geçiş, “kötü niyet”ten çok kırılgan ekonominin sonucudur.',
          'Nüfus hareketleri (şehir göçü, dönüş, mevsimlik iş) miras ve taşınmaz paydaş listesini de etkiler. Ova, insanı tutar veya salar.',
          'Defter, insan yüzüdür; dosya, usuldür. İkisi de gerçektir; karıştırılmamalıdır.',
        ],
      },
      {
        heading: 'Ovanın sesi',
        paragraphs: [
          'Patnos çarşısında sabah erken açılan dükkânlar, öğleden sonra tozlu yolun sessizliğine karışır. Traktör sesi, çay bardaklarının takırtısı, “bu sene fiyat” cümlesi — kentin müziği budur. Alacak hukuku bu müziğin arasına sert bir nota gibi girer; ama kökü çoğu zaman tarladadır.',
          'Bu deneme, icra formülü ezberletmez. Ovanın hesabını anlatır: ekim, bekleyiş, hasat, borç kapama.',
        ],
        photo: {
          src: '/bolge/ova-tarim.jpg',
          alt: 'Ova',
          caption: 'Hesap tarlada başlar.',
        },
      },
      {
        heading: 'Girdi maliyeti, hasat belirsizliği',
        paragraphs: [
          'Mazot ve gübre, bütçenin görünür yüzüdür. Yağmur ve fiyat, belirsiz yüzü. Çiftçi riski taşır; esnaf veresiye ile riski paylaşır. Zincir bozulunca herkes “hak” der.',
          'Hukuk, riski silmez; dağılımı ve ispatı konuşur. Yazılı iz, o konuşmayı netleştirir.',
        ],
      },
      {
        heading: 'Nüfus ritmi',
        paragraphs: [
          'Gençlerin şehre gitmesi, yaşlıların tarlada kalması — klasik ova tablosu. Miras paydaşlığı bu tabloda büyür: uzakta yaşayan paydaş, hasatta görünür.',
          'Nüfus kaydı, bu hareketi resmileştirir. Kayıt eksikse intikal uzar; tarla yine de ekilir.',
        ],
        callout: {
          title: 'Not',
          body: 'Genel bilgilendirmedir. Somut alacak, senet ve takip dosyası olmadan sonuç çıkmaz.',
        },
      },
      {
        heading: 'Ağrı coğrafyasında Patnos',
        paragraphs: [
          'Patnos, Ağrı Dağı siluetinin ufkunda kendi temposunu kurar. Zirve kimliktir; ova ekmektir. İkisi aynı fotoğrafta durur.',
          'Deneme, ovayı “sadece icra” diye etiketlemez. Hesabı ve insanı birlikte okur.',
        ],
      },
      {
        heading: 'Ne vaat edilmez',
        paragraphs: [
          'Reklam ve sonuç vaadi dışarıdadır. Okurun elinde kalan şey, tarımsal yılın kırılganlığını ve defterin neden dosyaya dönüştüğünü hatırlamaktır.',
          'Ova sessiz değildir; hesabı vardır.',
        ],
      },
    ],
    faq: [
      {
        q: 'Veresiye defteri hukuken yeterli midir?',
        a: 'İspat gücü somut olguya bağlıdır; yazılı ve tarihli belgeler genelde daha net omurga sunar. Genel bilgilendirmedir.',
      },
      {
        q: 'Neden nüfus ve tarım birlikte?',
        a: 'Paydaş listesi ve emek, ova ailesinde iç içedir; biri olmadan diğeri eksik okunur.',
      },
      {
        q: 'Bu yazı hukuki tavsiye midir?',
        a: 'Hayır. Ova ve bellek denemesidir.',
      },
    ],
    related: [
      { label: 'Ağrı Dağı denemesi', href: '/bolge-yazi/agri-sinir-bolgesi-tasinmaz-miras-ve-idare' },
      { label: 'Çaldıran ovası', href: '/bolge-yazi/caldiran-tarimsal-tasinmaz-kadastro-ve-nufus' },
      { label: 'El birliği denemesi', href: '/bolge-yazi/dogu-anadolu-el-birligi-mulkiyet-ve-miras-pratikleri' },
    ],
  }),
  essay({
    slug: 'muradiye-aile-miras-ve-nufus-olaylari',
    yerlesim: 'Muradiye',
    il: 'Van',
    kategori: 'nufus',
    title: 'Muradiye: Şelale Sesi, Aile Sofrası ve Kayıt Defteri',
    description:
      'Muradiye’nin doğa imgesi ile aile–nüfus–miras bağlarının iç içe geçtiği uzun deneme. Şelale turizmi ve köy belleği.',
    keywords: ['Muradiye şelale', 'Muradiye Van', 'Muradiye aile', 'Muradiye deneme'],
    h1: 'Muradiye: şelale sesi, aile sofrası ve kayıt defteri',
    eyebrow: 'Yerleşim · Muradiye',
    lead:
      'Muradiye denince çoğu kişi şelaleyi duyar: suyun düşüşü, serinlik, fotoğraf kuyruğu. Yerel için ise şelale sezonluk bir misafirdir; asıl hayat, ova ve köy evlerinin avlusundadır. Aile bağları sıkı, nüfus olayları toprağın anahtarıdır. Bu yazı, suyun sesi ile defterin sessizliğini yan yana koyar.',
    keyInsight:
      'Nüfus kaydı eksikliği, miras ve taşınmaz intikalini yıllarca kilitleyebilir; şelale gürültüsü bu sessiz kilitleri örtmez.',
    okumaDk: 16,
    theme: 'mountain',
    heroPhoto: {
      src: '/bolge/ova-tarim.jpg',
      alt: 'Van bölgesi kırsal manzara',
      caption: 'Turistik görüntünün arkasında: tarla, avlu, nüfus cüzdanı.',
      credit: 'Orijinal görsel · portal arşivi',
    },
    photos: [
      {
        src: '/bolge/ercis.jpg',
        alt: 'Göl ve ova',
        caption: 'Van kuzey hattı: su, ova, aile ritmi.',
      },
    ],
    graphics: [
      {
        kind: 'compare',
        title: 'İki Muradiye',
        headers: ['Yüz', 'Ne görünür', 'Ne konuşulur'],
        rows: [
          ['Broşür', 'Şelale, piknik', 'Sezon ve fotoğraf'],
          ['Avlu', 'Aile, tarla', 'Nüfus, miras, emek'],
        ],
      },
      {
        kind: 'flow',
        title: 'Kayıttan toprağa',
        steps: ['Nüfus olayı', 'Mirasçılar netleşir', 'Veraset / belge', 'Tapu intikali', 'Fiilî kullanım'],
      },
    ],
    sections: [
      {
        heading: 'İki Muradiye',
        paragraphs: [
          'Biri broşürdeki Muradiye’dir: şelale, yeşil, piknik. Diğeri kışın rüzgârı sert, yazın işi bol köy ve ilçe hayatıdır. Aile hukuku ve miras, ikinci Muradiye’de konuşulur — çoğu zaman kapalı kapılar ardında, bazen de düğün sonrası sohbette.',
          'Nüfus kütüğü, “kim kimin çocuğu” sorusunun resmî cevabıdır. Cevap gecikirse, veraset de gecikir; tarla fiilen ekilir, kâğıt susar.',
          'Turist, suyun sesini duyar; yerli, avludaki sessizliği. Deneme ikisini de dinler.',
        ],
      },
      {
        heading: 'Su sesinin arkasında',
        paragraphs: [
          'Şelale turist getirir; ama aile defteri turistle açılmaz. Evlilik, boşanma, velayet, miras — bunlar avlu fısıltısıdır. Resmî kayıt, fısıltıyı mürekkebe çevirdiğinde hem huzur hem gerilim üretebilir.',
          'Bu yazı, Muradiye’yi “hizmet bölgesi” diye etiketlemez. Suyun sesi ile defterin sessizliğini yan yana koyar.',
        ],
        photo: {
          src: '/bolge/ova-tarim.jpg',
          alt: 'Kırsal',
          caption: 'Avlu, tarla, kayıt: üçlü ritim.',
        },
      },
      {
        heading: 'Aile sofrası, miras masası',
        paragraphs: [
          'Sofra, birleştirir; miras masası bazen böler. Aynı aile, iki masayı da kurar. Kim uzakta, kim tarlada, kim “ben baktım” der — sorular yemekten sonra gelir.',
          'El birliği ve paydaşlık, burada da tarım ve konut demetiyle birleşir. Şelale bu demeti süslemez; sadece arka plan sesidir.',
        ],
      },
      {
        heading: 'Kayıt neden gecikir?',
        paragraphs: [
          'Göç, evrak, “sonra yaparız” alışkanlığı… Nüfus olayları gecikince zincir uzar. Gecikme, fiilî kullanımı silmez; intikali yavaşlatır.',
          'Hukuk, yavaşlığı bazen süre ile cezalandırır; bazen de hâlâ yol açar. Talep türü ve somut olgu esastır — genel cümle yetmez.',
        ],
        callout: {
          title: 'Not',
          body: 'Genel bilgilendirmedir. Somut nüfus ve tapu kaydı olmadan sonuç çıkmaz.',
        },
      },
      {
        heading: 'Van hattında Muradiye',
        paragraphs: [
          'Muradiye, Erciş ve merkez Van ile aynı havza nefesini paylaşır. Kuzey hattı, ova ve su imgesiyle örülüdür. Aile bağları bu hat boyunca uzanır.',
          'Deneme, şelaleyi yok saymaz; ama asıl dosyanın avluda olduğunu söyler.',
        ],
      },
      {
        heading: 'Ne vaat edilmez',
        paragraphs: [
          'Reklam ve sonuç vaadi dışarıdadır. Okurun elinde kalan şey, turistik sesin arkasındaki kayıt defterini hatırlamaktır.',
          'Su yüksek sesle akar; nüfus sessizce yazılır. İkisi de Muradiye’dir.',
        ],
      },
    ],
    faq: [
      {
        q: 'Şelale ile miras neden aynı yazıda?',
        a: 'Kamusal imge ile özel aile ritmi aynı yerde durur; biri ötekini silmez.',
      },
      {
        q: 'Nüfus kaydı neden bu kadar kritik?',
        a: 'Mirasçılık zinciri kayda yaslanır; eksik halka intikali geciktirir.',
      },
      {
        q: 'Bu yazı hukuki tavsiye midir?',
        a: 'Hayır. Yerleşim ve bellek denemesidir.',
      },
    ],
    related: [
      { label: 'Erciş nüfus ve intikal', href: '/bolge-yazi/ercis-nufus-veraset-tapu-intikali' },
      { label: 'Van Gölü havzası', href: '/bolge-yazi/van-golu-havzasi-tasinmaz-ve-miras-hukuku' },
      { label: 'El birliği denemesi', href: '/bolge-yazi/dogu-anadolu-el-birligi-mulkiyet-ve-miras-pratikleri' },
    ],
  }),
  essay({
    slug: 'ercis-nufus-veraset-tapu-intikali',
    yerlesim: 'Erciş',
    il: 'Van',
    kategori: 'nufus',
    title: 'Erciş: Ovanın Kapısı, Gölün Kuzeyi ve Kuşak Defteri',
    description:
      'Erciş’in tarımsal ve kentsel kimliği; nüfus, veraset ve tapu intikalinin günlük hayattaki izdüşümü. Uzun kent denemesi.',
    keywords: ['Erciş Van', 'Erciş ova', 'Erciş göl', 'Erciş tarih', 'Erciş deneme'],
    h1: 'Erciş: ovanın kapısı, gölün kuzeyi ve kuşak defteri',
    eyebrow: 'Kent · Erciş',
    lead:
      'Erciş, Van’ın kuzeyinde hem ova hem göl nefesidir. Çarşı kalabalıktır; tarla yolu tozludur. Burada “dosya” kelimesi, mahkeme koridorundan önce noter sırası ve nüfus müdürlüğü gişesinde duyulur. Bu yazı, şehri reklam vitrinine dizmeden anlatır.',
    keyInsight:
      'Yoğun nüfus hareketi ve tarımsal taşınmaz, veraset–tapu intikalini Erciş’in en sıradan bürokratik ritmi yapar.',
    okumaDk: 18,
    theme: 'lake',
    heroPhoto: {
      src: '/bolge/ercis.jpg',
      alt: 'Erciş kıyısı göl ve ova atmosferi',
      caption: 'Kuzey kıyı ovası — tarım ile suyun anlaştığı yer.',
      credit: 'Orijinal görsel · portal arşivi',
    },
    photos: [
      {
        src: '/bolge/van-golu.jpg',
        alt: 'Van Gölü',
        caption: 'Göl, Erciş cümlesinin ufkudur.',
      },
      {
        src: '/bolge/ova-tarim.jpg',
        alt: 'Ova tarım',
        caption: 'Çarşı ile tarla arasında: mal demeti.',
      },
    ],
    graphics: [
      {
        kind: 'flow',
        title: 'Kuşak geçişi (sade iskelet)',
        steps: ['Nüfus ve mirasçılar', 'Veraset / mirasçılık belgesi', 'Tapu intikali', 'Paylaşım veya fiilî idare'],
      },
      {
        kind: 'map-hint',
        title: 'Erciş okuması',
        places: [
          { name: 'Çarşı', role: 'Esnaf ve günlük tempo' },
          { name: 'Ova', role: 'Tarım ve miras demeti' },
          { name: 'Göl kenarı', role: 'Ufuk ve kıyı' },
          { name: 'Van hattı', role: 'Merkez bağlantısı' },
        ],
      },
    ],
    sections: [
      {
        heading: 'Çarşı ile tarla arasında',
        paragraphs: [
          'Erciş’te biri esnaf, biri çiftçi, biri memur — çoğu ailede bu üçü akrabadır. Bu yüzden miras dosyası hem dükkân hem tarla hem daire taşıyabilir. “Tek mal” nadirdir; “mal demeti” kuraldır.',
          'Göl, yaz akşamları serinlik getirir; kışın sis. Kentin ruhu bu iklime yapışıktır: ne tamamen sahil tatili, ne tamamen bozkır.',
          '2011 sarsıntısının belleği de Erciş’te ağırdır. Ova, yalnızca ekim değil; yeniden kurma hikâyesi de taşır.',
        ],
      },
      {
        heading: 'Kayıt, intikal, nefes',
        paragraphs: [
          'Veraset ve tapu intikali, soğuk usul gibi görünür; oysa aile içi gerilimin resmiyet kazandığı andır. Kim başvurur, kim imza verir, kim itiraz eder — her adım ilişkiyi yeniden yazar.',
          'Bu deneme, form doldurma kılavuzu değildir. Erciş’in kuşak defterini okumaya davettir.',
          'Nüfus kaydı eksikse zincir uzar. Uzatmak, fiilî kullanımı silmez; kâğıdı geciktirir.',
        ],
        photo: {
          src: '/bolge/ercis.jpg',
          alt: 'Erciş',
          caption: 'Kuzey kıyı: su ve ova aynı nefeste.',
        },
      },
      {
        heading: 'Mal demeti: dükkân + tarla + daire',
        paragraphs: [
          'Paylaşım konuşulurken “tarlayı böl” demek yetmez. Dükkân cirosu, tarla verimi, dairenin oturulabilirliği — üç farklı değer dili. Adalet duygusu, bu dilleri yok sayınca bozulur.',
          'El birliği, demeti kilitleyebilir. Paylıya geçiş veya ortaklığın giderilmesi, soğuk araçlardır; sofra sıcak kalmak zorunda değildir.',
        ],
        callout: {
          title: 'Okuma sırası',
          body: 'Önce kimler mirasçı, sonra sicil, en sonda fiilî kullanım.',
        },
      },
      {
        heading: 'Göl ve ova temposu',
        paragraphs: [
          'Erciş, gölün kuzey cümlesidir. Rüzgâr, sazlık, tarla yolu — üçü birden kentin temposunu kurar. Bürokrasi bu temponun içinde işler; dışında değil.',
          'Yazın çarşı kalabalık, kışın daha içe kapanık. Intikal dosyaları mevsim tanımaz; ama insanlar tanır.',
        ],
      },
      {
        heading: 'Van hattında Erciş',
        paragraphs: [
          'Merkez Van ile bağ, yol ve bellek iledir. Aileler hat boyunca dağılır; mallar da dağılabilir. Envanter, “yalnız Erciş” sanılıp eksik kalmamalıdır.',
          'Deneme, Erciş’i yalnızca “ilçe” diye etiketlemez. Ovanın kapısı ve gölün kuzeyi olarak okur.',
        ],
      },
      {
        heading: 'Ne vaat edilmez',
        paragraphs: [
          'Reklam ve sonuç vaadi dışarıdadır. Okurun elinde kalan şey, kuşak defterinin çarşı ile tarla arasında yazıldığını hatırlamaktır.',
          'Dosya kelimesi burada gişede başlar; avluda biter — veya bitmez.',
        ],
      },
    ],
    faq: [
      {
        q: 'Yazı işlem adımlarını garanti eder mi?',
        a: 'Hayır. Usul ve yetkili merciler değişebilir; güncel mevzuat ve somut dosya esastır.',
      },
      {
        q: 'Neden 2011 anılıyor?',
        a: 'Erciş hattı sarsıntı belleğinde ağırdır; konut ve aile demeti bu bellekle iç içedir.',
      },
      {
        q: 'Bu yazı hukuki tavsiye midir?',
        a: 'Hayır. Kent ve bellek denemesidir.',
      },
    ],
    related: [
      { label: 'Van Gölü havzası', href: '/bolge-yazi/van-golu-havzasi-tasinmaz-ve-miras-hukuku' },
      { label: '2011 deprem denemesi', href: '/bolge-yazi/van-2011-depremi-sozlesme-ve-konut-hukuku' },
      { label: 'El birliği denemesi', href: '/bolge-yazi/dogu-anadolu-el-birligi-mulkiyet-ve-miras-pratikleri' },
      { label: 'TMK', href: '/mevzuat/tmk' },
    ],
  }),
  essay({
    slug: 'dogu-anadolu-el-birligi-mulkiyet-ve-miras-pratikleri',
    yerlesim: 'Doğu Anadolu',
    il: 'Bölgesel',
    kategori: 'miras',
    title: 'El Birliği: Ortak Sofra, Ortak Tarla, Ayrı Hayaller',
    description:
      'Doğu Anadolu’da el birliği mülkiyet ve miras pratiklerinin sosyal ve hukuki okunuşu. Van–Bitlis–Ağrı hattı üzerinden bölgesel deneme.',
    keywords: [
      'el birliği mülkiyet',
      'Doğu Anadolu miras',
      'paydaşlık pratikleri',
      'izale-i şüyu bellek',
      'el birliği deneme',
    ],
    h1: 'El birliği: ortak sofra, ortak tarla, ayrı hayaller',
    eyebrow: 'Bölgesel deneme',
    lead:
      'El birliği mülkiyet, kanun maddesinde soğuk bir rejimdir; sahada ise sofra düzenidir. Kardeşler aynı tarlaya bakıp farklı gelecek kurar. Biri satmak, biri ekmek, biri “bırak dursun” ister. Bu yazı, Van–Bitlis–Ağrı hattında sık görülen bu ritmi hikâye dilinde açar — reklam değil, yapısal okuma.',
    keyInsight:
      'El birliği, “birlikte malikiz” demektir; “hepimiz aynı şeyi istiyoruz” demek değildir.',
    okumaDk: 18,
    theme: 'plain',
    heroPhoto: {
      src: '/bolge/ova-tarim.jpg',
      alt: 'Ortak tarım arazisi ve dağ silueti',
      caption: 'Ortak toprak — pay kâğıtta, emek sahada.',
      credit: 'Orijinal görsel · portal arşivi',
    },
    photos: [
      {
        src: '/bolge/van-golu.jpg',
        alt: 'Van Gölü',
        caption: 'Havza: ortak ufuk, ayrı hayaller.',
      },
      {
        src: '/bolge/bitlis.jpg',
        alt: 'Bitlis vadi',
        caption: 'Eğimli yerlerde fiilî kullanım daha da karmaşıklaşır.',
      },
    ],
    graphics: [
      {
        kind: 'compare',
        title: 'El birliği ve paylı mülkiyet (özet)',
        headers: ['Ölçüt', 'El birliği', 'Paylı'],
        rows: [
          ['Tasarruf', 'Kural: birlikte', 'Kendi payı daha esnek'],
          ['Fiilî kilit', 'Sık', 'Daha az'],
          ['Aile dili', '“Bizim tarla”', '“Benim payım”'],
        ],
      },
      {
        kind: 'flow',
        title: 'Sık görülen yol haritası (genel)',
        steps: [
          'Mirasçılar netleşir',
          'Fiilî kullanım fotoğrafı',
          'Anlaşma denemesi',
          'Paylıya geçiş / izale',
          'Sonuç: bölünme veya satış',
        ],
      },
    ],
    sections: [
      {
        heading: 'Sofra metaforu',
        paragraphs: [
          'El birliği, büyük bir sofraya benzer: yemek ortadadır, herkes kaşık sallar, ama menüyü kimse tek başına değiştiremez. Hukuken tasarruf kuralı serttir; fiilen ise bir kişi yıllarca eker, diğeri şehirde yaşar, üçüncüsü “hakkımı isterim” der. Çatışma ahlaki değil, yapısal olabilir.',
          'Doğu Anadolu’da bu yapı, tarım ve konutun aile ekonomisindeki ağırlığıyla birleşir. “Malı bölmek” bazen toprağı öldürmek gibi hissedilir; “bölmemek” ise genç kuşağı kilitlemek.',
          'Van Gölü havzası, Bitlis vadisi, Ağrı ovası — üç coğrafya, aynı sofra metaforunu farklı aksanla konuşur.',
        ],
      },
      {
        heading: 'Hukuk neyi çevirir?',
        paragraphs: [
          'Paylı mülkiyete geçiş, ortaklığın giderilmesi, ecrimisil — bunlar soğuk araçlardır. İşe yaradıkları yerde ilişkiyi bitirmez, yeniden biçimlendirir. Anlaşma varsa mahkeme salonu gerekmez; yoksa keşif ve süre devreye girer.',
          'Mevzuatta, mirastan doğan el birliğinin belirli usullerle paylı mülkiyete çevrilmesine imkân tanıyan düzenlemeler vardır; bunlar somut dosyada tapu ve tebligat adımlarıyla işler. Bu yazı formül vaat etmez.',
          'Bu deneme, formül vaat etmez. Ortak sofranın neden hem bereket hem gerginlik ürettiğini anlatır.',
        ],
        callout: {
          title: 'Sınır',
          body: 'Genel bilgilendirmedir. Somut paydaş listesi, tapu kaydı ve güncel içtihat olmadan sonuç çıkmaz.',
        },
      },
      {
        heading: 'Fiilî emek, kâğıt payı',
        paragraphs: [
          '“Ben ektim” ile “benim payım var” aynı cümlede çatışır. İkisi de kendi içinde tutarlıdır. Hukuk, tutarlılıkları tartar; coğrafya her iki sesi de rüzgârla karıştırır.',
          'Uzun ömürlü dikim ve yayla kullanımı, emek hesabını uzatır. Bir yıllık ekin ile ceviz veya yayla aynı “tarla” kelimesine sığmaz.',
        ],
        photo: {
          src: '/bolge/ova-tarim.jpg',
          alt: 'Ortak tarla',
          caption: 'Emek sahada, pay defterde.',
        },
      },
      {
        heading: 'Şehirdeki paydaş, tarladaki paydaş',
        paragraphs: [
          'Göç, paydaş listesini coğrafyaya yayar. Şehirdeki paydaş tebligat ve “hak” dilini konuşur; tarladaki paydaş hasat dilini. İkisi buluşamayınca kilit büyür.',
          'Buluşma, bazen anlaşma; bazen dava; bazen yıllarca “idare”dir. İdare, barış değildir; ertelemedir.',
        ],
      },
      {
        heading: 'Üç coğrafya, bir rejim',
        paragraphs: [
          'Göl kıyısı, vadi eğimi, ova genişliği — fiilî kullanım fotoğrafını değiştirir. Rejim aynı medeni hukuk dilindedir; sahne dekoru değişir.',
          'Bu yüzden “Doğu Anadolu’da el birliği özeldir” demek yanlıştır. Sık görünmesi, ekonomik ve aile yapısından beslenir; ayrı kanun masalı değildir.',
        ],
      },
      {
        heading: 'Ne vaat edilmez',
        paragraphs: [
          'Reklam ve sonuç vaadi dışarıdadır. Okurun elinde kalan şey, ortak sofranın hem bereket hem gerginlik üretebileceğini hatırlamaktır.',
          'Birlikte malik olmak, birlikte istemek demek değildir. Bu cümle, kuyruğun son denemesinin de özeti olsun.',
        ],
      },
    ],
    faq: [
      {
        q: 'El birliği otomatik midir?',
        a: 'Mirasın intikal biçimi ve tarafların seçimine göre değişir; her dosya kendi kaydını taşır.',
      },
      {
        q: 'Paylı mülkiyete geçiş her sorunu çözer mi?',
        a: 'Rejim değişir; hayaller ve fiilî kullanım gerilimi devam edebilir. Araçtır, sihir değildir.',
      },
      {
        q: 'Bu yazı hukuki tavsiye midir?',
        a: 'Hayır. Bölgesel yapı ve bellek denemesidir.',
      },
    ],
    related: [
      { label: 'Van Gölü havzası', href: '/bolge-yazi/van-golu-havzasi-tasinmaz-ve-miras-hukuku' },
      { label: 'Bitlis vadi', href: '/bolge-yazi/bitlis-miras-paydasligi-ve-daglik-tasinmaz' },
      { label: 'Erciş kuşak defteri', href: '/bolge-yazi/ercis-nufus-veraset-tapu-intikali' },
      { label: 'TMK', href: '/mevzuat/tmk' },
    ],
  }),
];
