/**
 * Borçlar Özel — 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * TBK Özel Hükümler (tipik sözleşmeler); pedagojik yarıyıl bölünmesi.
 */

function baseMeta(variant) {
  const labels = {
    'borclar-ozel-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'TBK Özel · 1. yarı (satım, trampa, bağışlama, kira, ödünç — devir ve kullanım sözleşmeleri)',
    },
    'borclar-ozel-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'TBK Özel · 2. yarı (eser, vekâlet, havale, saklama, kefalet, garanti, sulh — sonuç/özen ve teminat)',
    },
    'borclar-ozel-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'TBK özel borç ilişkileri tam omurga · dönemlik + yıllık programlar için tek cilt',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Satım–kira–bağışlama–ödünç. Devir ve kullanım sözleşmelerinin omurgası.',
    promise:
      'Satımda ayıp/zapto, kirada kullanım-bedel-tahliye, bağışlama ve ödünç. Güz finalinde tip seçip unsur yazarsınız.',
    sixtySecond: [
      'Önce tip seç: satım mı kira mı bağışlama mı?',
      'Satım: devir + semen; ayıp ve zapto ayrı rejim.',
      'Kira: kullanım bırakma + bedel; tahliye sebepleri kanuni listededir.',
      'Bağışlama: ivazsız kazandırma; şekil ve rücu halleri.',
      'Ödünç: tüketilebilen / kullanma ödüncü ayrımı.',
      'Cevap: tanım → unsur → olaya yedir → seçimlik hak / süre.',
    ],
    pillars: [
      'Satım sözleşmesi: kuruluş ve borçlar',
      'Ayıptan sorumluluk',
      'Zapto (hukuki ayıp / üçüncü kişi hakkı)',
      'Trampa',
      'Bağışlama',
      'Kira: genel hükümler',
      'Konut ve çatılı işyeri kirası (giriş)',
      'Kullanım ödüncü ve tüketim ödüncü',
    ],
    definitions: [
      {
        baslik: 'Satım',
        govde:
          'Satıcının satılanın zilyetlik ve mülkiyetini alıcıya devretmeyi, alıcının semeni ödemeyi üstlendiği sözleşmedir.',
      },
      {
        baslik: 'Ayıp',
        govde:
          'Satılandaki değer veya yararlanmaya ilişkin eksikliktir. Gözden geçirme, bildirim ve seçimlik haklar süreye bağlıdır.',
      },
      {
        baslik: 'Zapto',
        govde:
          'Satılan üzerinde üçüncü kişinin üstün hakkı nedeniyle alıcının hakkının kısıtlanması/yok olmasıdır. Ayıptan ayrı rejimdir.',
      },
      {
        baslik: 'Kira',
        govde:
          'Kiraya verenin bir şeyin kullanılmasını veya kullanmayla birlikte yararlanılmasını kiracıya bırakmayı, kiracının kira bedeli ödemeyi üstlendiği sözleşmedir.',
      },
      {
        baslik: 'Bağışlama',
        govde:
          'Bağışlayanın malvarlığından ivazsız olarak bağışlanana kazandırma yaptığı sözleşmedir. Şekil ve rücu halleri önemlidir.',
      },
    ],
    traps: [
      'Ayıp ile zaptoyu aynı torbaya koymak.',
      'Kira tahliyesini “sözleşmede yazıyor” diye bitirmek — kanuni sebepler.',
      'Konut kirası ile işyeri kirasını aynı rejim sanmak.',
      'Bağışlamada şekli yok saymak.',
      'Ödünçte “iade aynı şey mi, misli mi?” ayrımını atlamak.',
    ],
    keyMadde: [
      'TBK m.207 vd. — satım',
      'TBK m.219 vd. — satıcının ayıptan sorumluluğu',
      'TBK m.214 vd. — zapto (çerçeve)',
      'TBK m.282 vd. — bağışlama',
      'TBK m.299 vd. — kira genel',
      'TBK m.339 vd. — konut ve çatılı işyeri kirası',
      'TBK m.379 vd. — kullanım ödüncü',
      'TBK m.386 vd. — tüketim ödüncü',
    ],
    sectionsExtra: [
      {
        heading: 'A. Satım: borçlar ve risk',
        paragraphs: [
          'Satımda iki ana borç: satıcı devir (zilyetlik + mülkiyet), alıcı semen. Sınavda “kim neyi borçlandı?” cümlesi ilk satırda yazılmalıdır.',
          'Hasarın intikali ve teslim anı final klasikidir. “Sözleşme kuruldu = risk alıcıda” genellemesi yapmayın; teslim ve ayrım kurallarına bakın.',
        ],
        hapBilgi: 'Satım = devir borcu + semen borcu. Ayıp/zapto ayrı kapılar.',
        bullets: [
          'Kuruluş: icap–kabul (+ şekil varsa)',
          'Satıcının borçları: devir, ayıpsız ifa, zaptoya karşı garanti',
          'Alıcının borçları: semen, tesellüm',
        ],
      },
      {
        heading: 'B. Ayıptan sorumluluk',
        paragraphs: [
          'Ayıp: satılanın sözleşmede kararlaştırılan veya makul olarak beklenen nitelikleri taşımaması. Açık / gizli ayıp ayrımı bildirim süresini etkiler.',
          'Seçimlik haklar: sözleşmeden dönme, bedelden indirim, ücretsiz onarım, yenisiyle değiştirme (şartlara göre). Süreleri kaçıran alıcı zayıflar.',
        ],
        kartlar: [
          {
            baslik: 'Gözden geçirme',
            govde: 'Alıcı, işlerin olağan akışına göre satılanı gözden geçirmelidir.',
          },
          {
            baslik: 'Bildirim',
            govde: 'Ayıp ortaya çıkınca satıcıya usulüne uygun bildirim.',
          },
          {
            baslik: 'Seçimlik hak',
            govde: 'Dönme / indirim / onarım / değiştirme — olguya göre.',
          },
        ],
        uyari: 'Bildirim süresini yazmayan ayıp cevabı yarıda kalır.',
      },
      {
        heading: 'C. Zapto',
        paragraphs: [
          'Üçüncü kişinin üstün hakkı alıcının mülkiyet/zilyetliğini bozuyorsa zapto hattı açılır. Ayıp “nitelik eksikliği”, zapto “hukuki engel”dir.',
          'Satıcının garanti borcu ve alıcının hakları (borçtan kurtulma, tazminat vb.) tipik şemada yazılır.',
        ],
        hapBilgi: 'Fiziki kusur → ayıp. Üçüncü kişi hakkı → zapto.',
      },
      {
        heading: 'D. Trampa ve bağışlama',
        paragraphs: [
          'Trampada her iki taraf da satıcı gibi düşünülür; ayıp/zapto kuralları kıyasen devreye girebilir.',
          'Bağışlamada ivazsızlık esastır. Elden bağışlama / bağışlama vaadi şekil farkı finalde sorulur. Rücu (nankörlük, yoksulluk vb.) halleri ayrı listelenir.',
        ],
      },
      {
        heading: 'E. Kira (genel + konut/çatılı işyeri girişi)',
        paragraphs: [
          'Kira: kullanım (ve varsa semere) bırakma + bedel. Kiraya verenin ayıptan sorumluluğu ve kiracının özen/bedel borçları omurgadır.',
          'Konut ve çatılı işyeri kiralarında TBK özel hükümleri (süre, tahliye sebepleri, güvence, kira artışı çerçevesi) genel kiradan ayrılır. “Tahliye taahhüdü” şekli ve zamanı dikkat ister.',
        ],
        bullets: [
          'Genel kira vs konut/çatılı işyeri',
          'Güvence (depozito) sınırları',
          'Tahliye: ihtiyaç, yeniden inşa, taahhüt…',
          'Kira tespit / uyarlama tartışması (çerçeve)',
        ],
        uyari: 'Tahliye sebebini uydurmayın; kanuni listeye oturtun.',
      },
      {
        heading: 'F. Ödünç',
        paragraphs: [
          'Kullanım ödüncü: aynı şeyin iadesi. Tüketim ödüncü: aynı cins ve nitelikte mislin iadesi. Faiz kararlaştırılmışsa ispat ve sınırlar yazılır.',
        ],
      },
    ],
    examples: [
      {
        title: 'Ayıplı satım',
        facts:
          'Alıcı ikinci el aracı teslim alır; bir hafta sonra gizli motor arızası çıkar. Satıcıya mesaj atar; satıcı “garantisi bitti” der.',
        analysis:
          'Ayıp var mı? Gizli ayıp + bildirim. Seçimlik haklar. Süre. “Garanti bitti” tek başına TBK ayıp rejimini silmez.',
        takeaway: 'Bildirim + seçimlik hak + süre.',
      },
      {
        title: 'Zapto',
        facts:
          'Satın alınan tarlada üçüncü kişinin tescilli irtifakı ortaya çıkar; alıcı kullanamaz.',
        analysis:
          'Ayıp değil zapto hattı. Üstün hak + satıcının garanti borcu + alıcının hakları.',
        takeaway: 'Üçüncü kişi hakkı = zapto kapısı.',
      },
      {
        title: 'Konut kirası tahliye',
        facts:
          'Kiraya veren “oğlum oturacak” diyerek tahliye ister; gerçekte evi başkasına kiralar.',
        analysis:
          'İhtiyaç nedeniyle tahliye şartları + dürüstlük. İhtiyacın samimiyeti. Yeniden kiralama yasağı çerçevesi.',
        takeaway: 'İhtiyaç samimi ve sürekli olmalı.',
      },
      {
        title: 'Bağışlama vaadi',
        facts:
          'A, B’ye taşınmaz bağışlayacağını sözlü vaat eder; sonra vazgeçer.',
        analysis:
          'Bağışlama vaadinde şekil. Geçersizlik sonucu. Elden bağışlama ile karıştırma.',
        takeaway: 'Şekil kutusunu ilk yaz.',
      },
    ],
    mindmap: {
      center: 'Borçlar Özel · 1. dönem',
      branches: [
        { label: 'Satım', items: ['Devir', 'Ayıp', 'Zapto'] },
        { label: 'Kira', items: ['Kullanım', 'Bedel', 'Tahliye'] },
        { label: 'Bağış', items: ['İvazsız', 'Şekil', 'Rücu'] },
        { label: 'Ödünç', items: ['Kullanım', 'Tüketim'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Eser–vekâlet–kefalet–havale–saklama. Sonuç borcu, özen borcu, teminat.',
    promise:
      'Eser ayıbı, vekâlette özen, kefalette şekil ve sınır, havale/saklama. Bahar finalinin özel tip soruları.',
    sixtySecond: [
      'Eser: sonuç (eser) borcu; vekâlet: özen borcu — karıştırma.',
      'Eser ayıbı: bildirim + seçimlik haklar + zamanaşımı özel olabilir.',
      'Vekâlet: talimata uygunluk, sadakat, özen, hesap.',
      'Kefalet: şekil + azami tutar + kapsam; ek kefalet türleri.',
      'Havale / saklama: taraflar ve iade.',
      'Tip seçimi yanlışsa tüm unsur listesi boşa gider.',
    ],
    pillars: [
      'Eser sözleşmesi',
      'Eserin ayıplı ifası',
      'Vekâlet sözleşmesi',
      'Havale',
      'Saklama (vedia)',
      'Kefalet',
      'Garanti ve teminat işlevli taahhütler (giriş)',
      'Sulh ve ibra ile ilişki (giriş)',
    ],
    definitions: [
      {
        baslik: 'Eser sözleşmesi',
        govde:
          'Yüklenicinin bir eser meydana getirip teslim etmeyi, iş sahibinin bedel ödemeyi üstlendiği sözleşmedir. Sonuç borcu vurgusu vardır.',
      },
      {
        baslik: 'Vekâlet',
        govde:
          'Vekilin, vekâlet verenin menfaatine ve iradesine uygun iş görmeyi üstlendiği sözleşmedir. Özen ve sadakat merkezidir.',
      },
      {
        baslik: 'Kefalet',
        govde:
          'Kefilin, borçlunun borcunu ifa etmemesinden kişisel olarak sorumlu olmayı üstlendiği sözleşmedir. Şekil ve azami tutar şartları sıkıdır.',
      },
      {
        baslik: 'Havale',
        govde:
          'Havale edenin, havale ödeyicisine, havale alıcısına bir edimde bulunması talimatını verdiği üçlü ilişkidir.',
      },
      {
        baslik: 'Saklama (vedia)',
        govde:
          'Saklayanın, saklatanın bıraktığı taşınırı güvenle koruyup iade etmeyi üstlendiği sözleşmedir.',
      },
    ],
    traps: [
      'Eser ile vekâleti “ikisi de iş görme” diye birleştirmek.',
      'Kefalette şekil ve azami miktarı unutmak.',
      'Eser ayıbında satım ayıbı sürelerini körlemesine kopyalamak.',
      'Garanti ile kefaleti aynı yazmak.',
      'Vekâlette “sonuç garanti ettim” sanmak — kural özen borcudur.',
    ],
    keyMadde: [
      'TBK m.470 vd. — eser',
      'TBK m.474 vd. — eserin ayıbı',
      'TBK m.502 vd. — vekâlet',
      'TBK m.555 vd. — havale',
      'TBK m.561 vd. — saklama',
      'TBK m.581 vd. — kefalet',
      'TBK m.128 — garanti (ilgili çerçeve / öğreti ile)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Eser sözleşmesi',
        paragraphs: [
          'Yüklenici “sonuç” borçlanır: eserin meydana getirilip teslimi. Malzeme kimin, ne zaman teslim, bedel götürü mü yoksa değer üzerinden mi — olgu kutuları açılır.',
          'İş sahibinin bedel borcu ve eseri gözden geçirme / ayıp bildirimi 2. dönem finalinin kalbidir.',
        ],
        hapBilgi: 'Eser = sonuç. Vekâlet = özen. Bu cümleyi kâğıda yazın.',
        bullets: [
          'Kuruluş ve taraflar',
          'Yüklenicinin borçları',
          'İş sahibinin borçları',
          'Ayıp ve seçimlik haklar',
        ],
      },
      {
        heading: 'B. Eserin ayıplı ifası',
        paragraphs: [
          'Ayıp: eserin kararlaştırılan / beklenen nitelikleri taşımaması. Açık-gizli ayıp, bildirim, süre. Seçimlik haklar: bedelden indirim, ücretsiz onarım, yeniden yapım, sözleşmeden dönme (şartlara göre).',
          'Zamanaşımı satımdan farklı süreler taşıyabilir; uydurma süre yazmayın, “özel süre — kanuna bak” demek yanlış sayıdan iyidir.',
        ],
        uyari: 'Bildirim + seçimlik hak + süre üçlüsü eksikse cevap yarım kalır.',
      },
      {
        heading: 'C. Vekâlet',
        paragraphs: [
          'Vekil özenle, sadakatle, talimata uygun iş görür; kural olarak sonucu garanti etmez (aksine anlaşma / garanti yoksa). Hesap verme ve sır saklama unutulmamalıdır.',
          'Vekâlet ücreti kararlaştırılmış olabilir. Vekâletten dönme / azil ve sonuçları ayrı yazılır. Avukatlık / danışmanlık örneklerinde özen ölçüsü yükselir.',
        ],
        kartlar: [
          { baslik: 'Özen', govde: 'Basiretli bir vekilin göstereceği dikkat.' },
          { baslik: 'Sadakat', govde: 'Menfaat çatışmasından kaçınma.' },
          { baslik: 'Talimat', govde: 'Vekâlet verenin yasal ve mümkün talimatları.' },
          { baslik: 'Hesap', govde: 'Gördüğü iş ve sarfiyat hakkında hesap.' },
        ],
      },
      {
        heading: 'D. Havale ve saklama',
        paragraphs: [
          'Havale üç köşelidir: havale eden, ödeyici, alıcı. Kabul, ödeme, rücu ilişkileri karıştırılmamalıdır.',
          'Saklamada iade borcu ve özen; ücretli/ücretsiz saklama özen ölçüsünü etkileyebilir. Tüketilebilen şeylerde rejim değişebilir.',
        ],
      },
      {
        heading: 'E. Kefalet ve teminat',
        paragraphs: [
          'Kefalet sıkı şekle bağlıdır; azami tutar ve kefalet tarihi gibi unsurlar eksikse geçerlilik sarsılır. Adi / müteselsil kefalet, belirli–belirsiz süre ayrımı yazılır.',
          'Kefilin def’ileri ve asıl borçtaki değişikliklerin kefalete etkisi final klasikidir. Garanti sözleşmesi ile kefalet farkını bir cümlede ayırın.',
        ],
        hapBilgi: 'Kefalet = şekil + azami tutar + kapsam. Eksik şekil = risk.',
        bullets: [
          'Şekil şartı',
          'Azami miktar',
          'Kefalet türü',
          'Def’i ve rücu',
        ],
      },
      {
        heading: 'F. Tip seçimi ve karma sözleşmeler',
        paragraphs: [
          'Olay “tamir + malzeme + işçilik” ise eser mi satım mı vekâlet mi? Ağırlıklı edime göre tip seçilir; karma sözleşmelerde yarıya yarıya bölmek yerine hâkim edim / yama yöntemi anlatılır.',
          'Yanlış tip seçimi, tüm ayıp/temerrüt rejimini yanlış kapıya götürür.',
        ],
        uyari: 'İlk 3 satırda tipi yaz: “Bu olay eser sözleşmesidir, çünkü…”',
      },
    ],
    examples: [
      {
        title: 'Eser ayıbı',
        facts:
          'Yüklenici daireyi teslim eder; 2 ay sonra su yalıtımı bozulur. İş sahibi bedelden indirim ve onarım ister.',
        analysis:
          'Eser ayıbı + bildirim. Seçimlik haklar. Süre. Yüklenicinin ayıptan sorumluluğu.',
        takeaway: 'Eser ayıbı = bildirim + seçim.',
      },
      {
        title: 'Vekâlette özen',
        facts:
          'Danışman süre kaçırır; müvekkil hak kaybına uğrar.',
        analysis:
          'Özen borcu ihlali + zarar + illiyet. Sonuç garantisi yoksa bile özen ihlali tazminat doğurabilir.',
        takeaway: 'Özen + zarar + illiyet.',
      },
      {
        title: 'Kefalet şekli',
        facts:
          'Kefil “istersen öderim” diye mesaj atar; tutar yazılmaz. Alacaklı kefili icra eder.',
        analysis:
          'Şekil ve azami tutar. Geçersizlik riski. Adi vaat ile kefalet ayrımı.',
        takeaway: 'Şekil + miktar yoksa kefalet zayıf.',
      },
      {
        title: 'Tip seçimi',
        facts:
          'Terzi kumaşla elbise diker; elbise dar gelir.',
        analysis:
          'Malzeme kimin? Eser mi satım mı? Ayıp rejimi tipe göre değişir.',
        takeaway: 'Önce tip, sonra ayıp.',
      },
    ],
    mindmap: {
      center: 'Borçlar Özel · 2. dönem',
      branches: [
        { label: 'Eser', items: ['Sonuç', 'Ayıp', 'Bedel'] },
        { label: 'Vekâlet', items: ['Özen', 'Sadakat', 'Hesap'] },
        { label: 'Kefalet', items: ['Şekil', 'Tutar', 'Def’i'] },
        { label: 'Diğer', items: ['Havale', 'Saklama'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Satım ve kiradan eser, vekâlet ve kefalete kadar tek omurga.',
    promise:
      '1. + 2. dönem birleşik; yıllık program ve bütüncül tekrar için “tek cilt” borçlar özel notu.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: önce sözleşme tipini seç, sonra o tipin ayıp/temerrüt rejimini yaz.',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 4), ...b.keyMadde.slice(0, 4)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyanlar kendi yarılarını, yıllık okuyanlar bu tam paketi kullanır. Öneri: 1. dönem tiplerini bitir → mini deneme (satım+kira) → 2. dönem tipleri → karma deneme (eser+kefalet+tip seçimi).',
          'Her soruda ilk cümle: “Bu sözleşme … tipindedir, çünkü …”.',
        ],
        hapBilgi: 'Yıllık başarı = doğru sözleşme tipi + o tipin özel rejimi.',
        bullets: [
          'Hafta 1–6: satım + ayıp + zapto + bağışlama',
          'Hafta 7–8: kira + ödünç + ara deneme',
          'Hafta 9–12: eser + vekâlet',
          'Hafta 13–14: kefalet + havale + saklama + karma deneme',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon: sık soru tipleri',
        paragraphs: [
          'Tip 1 — Satım ayıbı seçimlik hakları. Tip 2 — Kira tahliye sebebi. Tip 3 — Eser ayıbı. Tip 4 — Vekâlette özen. Tip 5 — Kefalet şekli. Tip 6 — “Bu hangi sözleşme?” (tip seçimi).',
          'Karma olayda birden fazla tip yan yana gelebilir (satım + eser). Hâkim edimi bulun.',
        ],
        uyari: 'Tek cevapta tüm TBK özelini özetlemeyin; sorunun tipini seçin.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Borçlar Özel · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Satım', 'Kira', 'Bağış', 'Ödünç'] },
        { label: '2. yarı', items: ['Eser', 'Vekâlet', 'Kefalet'] },
        { label: 'Rejim', items: ['Ayıp', 'Özen', 'Şekil'] },
        { label: 'Yöntem', items: ['Tip seç', 'Unsur yaz'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'borclar-ozel-donem-1': d1Content,
  'borclar-ozel-donem-2': d2Content,
  'borclar-ozel-yillik': yillikContent,
};

export const BORCLAR_OZEL_VARIANTS = [
  'borclar-ozel-donem-1',
  'borclar-ozel-donem-2',
  'borclar-ozel-yillik',
];

export function buildBorclarOzelVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Borçlar Özel ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Borçlar Hukuku Özel Hükümler ${meta.h1Extra}`;
  const description = `${uni.name} için Borçlar Özel ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Borçlar Özel ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: sözleşme tipini doğru seçmek, o tipin ayıp/özen/şekil rejimini unsurlarıyla yazmak. Fakülte ${calLabel} kullansa da 1. dönem / 2. dönem / yıllık üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Dönemlik program kendi yarısını; yıllık veya bütüncül tekrar yıllık paketi kullanır. Üç not birbirini tamamlar.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → tip bölümleri → örnek olay (süre tut) → PDF alıp basılı tekrarla.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda ilk cümle: “Bu sözleşme … tipindedir”',
        'Ayıp/özen/şekil kutusunu sona bırakma',
      ],
      hapBilgi: bank.oneLiner,
    },
    {
      heading: '2. 60 saniyede omurga',
      paragraphs: ['Sesli oku, kapat, yaz.'],
      bullets: bank.sixtySecond,
    },
    {
      heading: '3. Kavram haritası ve omurga',
      paragraphs: [`Omurga: ${bank.pillars.join('; ')}.`],
      bullets: bank.pillars.map((p, i) => `${i + 1}) ${p}`),
      hapBilgi: bank.promise,
    },
    {
      heading: '4. Tanım kartları',
      paragraphs: ['İşler tanım = unsur fısıldayan cümle.'],
      kartlar: bank.definitions,
    },
    {
      heading: '5. Pusula maddeler',
      paragraphs: [
        'Soru tipine göre işaretlenecek dayanaklar. Güncel metin: mevzuat bankası / TBK.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde no yazmayın; kurumu doğru adlandırın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Borçlar Özel)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) sözleşme tipi (2) tanım (3) unsurlar (4) olgu eşlemesi (5) seçimlik hak/süre (6) sonuç.',
      ],
      bullets: [
        'Tip seçimini ilk 2 satırda yaz',
        'Ayıp ise bildirim kutusunu aç',
        'Kefalet ise şekil + tutar yaz',
        'Eser/vekâlet ayrımını bir cümleyle kilitle',
      ],
      hapBilgi: 'Doğru tip + eksiksiz özel rejim = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Borçlar Özel ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Sözleşme tipini seç',
        'Tanım (1 cümle)',
        'Unsurları numarala',
        'Olayı unsura yedir',
        'Özel rejim (ayıp/özen/şekil)',
        'Sonuç + süre/istisna',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'borclar-ozel-donem-2'
          ? [
              ['Eser', 'Vekâlet', 'Sonuç mu özen mi?'],
              ['Kefalet', 'Garanti', 'Asıl borca bağlılık?'],
              ['Eser ayıbı', 'Satım ayıbı', 'Hangi sözleşme tipi?'],
              ['Havale', 'Vekâlet', 'Üçlü ilişki var mı?'],
            ]
          : variantCode === 'borclar-ozel-donem-1'
            ? [
                ['Ayıp', 'Zapto', 'Fiziki kusur mu üçüncü kişi hakkı mı?'],
                ['Konut kirası', 'Genel kira', 'TBK özel hükümler?'],
                ['Bağışlama', 'Satım', 'İvaz var mı?'],
                ['Kullanım ödüncü', 'Tüketim ödüncü', 'Aynı şey mi misil mi?'],
              ]
            : [
                ['1. yarı tipi', '2. yarı tipi', 'Devir/kullanım mı eser/özen mi?'],
                ['Satım ayıbı', 'Eser ayıbı', 'Sözleşme tipi?'],
                ['Kira', 'Ödünç', 'Bedel var mı?'],
                ['Kefalet', 'Vekâlet', 'Teminat mı iş görme mi?'],
              ],
    },
    {
      kind: 'ladder',
      title: 'Öğrenme merdiveni',
      levels: [
        'Tip listesini ezberle',
        'Her tip için 1 tanım kartı',
        'Ayıp/özen/şekil şeması çiz',
        '4 örnek olayı süreyle çöz',
        'Karma deneme + yanlış defteri',
      ],
    },
    {
      kind: 'fork',
      title: 'Soru tipi',
      leftTitle: 'Tanım / karşılaştırma',
      rightTitle: 'Olay',
      left: 'Tanım + ayırıcı tablo + 1 cümle örnek',
      right: 'Tip seç → unsur → özel rejim → net hüküm',
    },
    {
      kind: 'cycle',
      title: 'Haftalık döngü',
      steps: ['Tip oku', 'Şema', 'Örnek yaz', 'Quiz', 'Yanlış defteri'],
    },
  ];

  const faq = [
    {
      q: '1. dönem / 2. dönem / yıllık farkı ne?',
      a: '1. dönem satım–kira–bağış–ödünç; 2. dönem eser–vekâlet–kefalet–havale–saklama; yıllık ikisini birleştirir.',
    },
    {
      q: 'PDF nasıl indirilir?',
      a: 'Notta “PDF indir / Yazdır” veya …/pdf adresi → Ctrl+P → PDF olarak kaydet. Kişisel kullanım.',
    },
    {
      q: 'Borçlar Genel notuyla birlikte mi çalışayım?',
      a: 'Evet. Genel hükümler (temerrüt, zamanaşımı) özel tiplerle birlikte sorulur. Genel paketi de açık tutun.',
    },
    {
      q: 'Hoca slaydı farklı sıraladıysa?',
      a: 'Duyuru bağlayıcıdır. Bu not ücretsiz destektir; sırayı hocaya göre yeniden dizinebilirsiniz.',
    },
    {
      q: 'Ücretli mi?',
      a: 'Hayır. Av. Fethi Güzel Hukuk Portalı üzerinden ücretsizdir.',
    },
  ];

  const checklist = [
    '60 sn omurgayı kapalı yazdım',
    'Tanım kartlarını ezberden yazdım',
    'Zihin haritasını çizdim',
    'Tuzak listesinden 5 madde işaretledim',
    'En az 3 örnek olayı süreyle çözdüm',
    'Pusula maddeleri TBK’dan doğruladım',
    'PDF’i arşivledim',
    variantCode === 'borclar-ozel-yillik'
      ? '1. ve 2. dönem notlarıyla çapraz tekrar yaptım'
      : 'Diğer yarı / yıllık notla bağlantıyı kontrol ettim',
  ];

  return {
    uniSlug: uni.slug,
    courseCode: variantCode,
    slug: `${uni.slug}__${variantCode}`,
    title,
    description,
    h1,
    keywords: [
      `${uni.shortName} borçlar özel ${meta.short}`,
      `${uni.shortName} borçlar özel hükümler ders notu`,
      `borçlar özel ${meta.short} not pdf`,
      'TBK satım kira eser vekâlet ders notu',
      'borçlar özel yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} borçlar özel`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format: uni.type === 'vakif' ? 'Klasik + ara; ödev olabilir' : 'Klasik yazılı ağırlıklı',
      tips: [
        'Sözleşme tipini ilk yaz',
        'Unsurları numarala',
        'Ayıp/özen/şekil kutusunu kapat',
        'Süre/bildirim yaz',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Borçlar Özel ${meta.short} kapsamındaki sözleşme tiplerini ayırır`,
      'Doğru tipi seçer ve tanımlar',
      'Ayıp / özen / şekil rejimini olaya uygular',
      'Seçimlik hak ve süre kutularını kontrol eder',
      'PDF notla düzenli tekrar yapar',
    ],
    sections,
    examples: bank.examples.map((e, i) => ({
      ...e,
      title: `Örnek ${i + 1} — ${e.title}`,
    })),
    diagrams,
    faq,
    checklist,
    relatedCourses: BORCLAR_OZEL_VARIANTS.filter((c) => c !== variantCode).concat([
      'borclar-genel-yillik',
      'borclar-genel',
      'borclar-ozel',
    ]),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: variantCode === 'borclar-ozel-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'borclar-ozel',
    variantLabel: meta.label,
  };
}
