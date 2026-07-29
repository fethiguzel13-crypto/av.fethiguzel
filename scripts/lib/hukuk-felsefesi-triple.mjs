/**
 * Hukuk Felsefesi ve Sosyolojisi —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * hukuk-felsefesi dersiyle hizalı (mufredat: year 1).
 */

function baseMeta(variant) {
  const labels = {
    'hukuk-felsefesi-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'Hukuk felsefesi · 1. yarı (hukuk nedir, doğal hukuk, pozitivizm, adalet, hukuk–ahlak)',
    },
    'hukuk-felsefesi-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'Hukuk felsefesi–sosyolojisi · 2. yarı (hukuk sosyolojisi, yaşayan hukuk, yorum, hukuk devleti, haklar, eleştirel yaklaşımlar)',
    },
    'hukuk-felsefesi-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'Hukuk felsefesi + sosyoloji tam omurga · akımlar + adalet + toplum · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Hukuk nedir, adalet nedir, kural nereden meşruiyet alır? Felsefe kapısı burada açılır.',
    promise:
      'Hukukun tanımı, doğal hukuk ve pozitivizm, adalet teorileri, hukuk–ahlak ilişkisi, temel düşünür iskeleti. Güz finalinde “akım + tez + karşı tez” bozulmadan yazarsınız.',
    sixtySecond: [
      'Hukuk felsefesi: hukukun “ne olduğu” ve “ne olması gerektiği” sorusu.',
      'Doğal hukuk: ahlaki / akli ölçüt hukukun üstünde veya içinde.',
      'Pozitivizm: hukuk, yetkili mercinin koyduğu kuraldır.',
      'Adalet: dağıtıcı, denkleştirici, usuli — ayrı kutular.',
      'Hukuk ≠ ahlak; bağ ve mesafe birlikte tartışılır.',
      'Sınav dili: isim + tez + karşı tez + örnek.',
    ],
    pillars: [
      'Hukuk felsefesinin konusu ve yöntemi',
      '“Hukuk nedir?” sorusu',
      'Doğal hukuk geleneği',
      'Hukuki pozitivizm',
      'Adalet kavramları',
      'Hukuk ve ahlak',
      'Temel düşünür iskeleti (klasik)',
      'Sınavda akım karşılaştırma tekniği',
    ],
    definitions: [
      {
        baslik: 'Hukuk felsefesi',
        govde:
          'Hukukun özü, geçerliliği, meşruiyeti ve adaletle ilişkisini kavramsal düzeyde inceleyen disiplindir. Dogmatik hukuk “kural ne diyor?”; felsefe “kural nedir / neden bağlar?” sorusunu sorar.',
      },
      {
        baslik: 'Doğal hukuk',
        govde:
          'Hukukun yalnızca iradi koyma ile değil, akıl, doğa, ahlak veya evrensel ilkelerle de ölçülebileceğini savunan yaklaşımlar ailesidir. Biçimleri çağdan çağa değişir.',
      },
      {
        baslik: 'Hukuki pozitivizm',
        govde:
          'Hukuku, yetkili organın koyduğu ve usule uygun yürürlükte olan kurallar bütünü olarak gören yaklaşımdır. Geçerlilik ile ahlaki doğruluk ayrı tutulur (klasik formülasyon).',
      },
      {
        baslik: 'Adalet',
        govde:
          'Hukuki ve ahlaki değerlendirmede “hakça pay / denge / usul” ölçütüdür. Dağıtıcı, denkleştirici ve usuli adalet ayrı yazılır; tek cümlede eritilmez.',
      },
      {
        baslik: 'Geçerlilik',
        govde:
          'Bir kuralın hukuk düzeni içinde bağlayıcı sayılıp sayılmamasıdır. Pozitivizmde usul ve kaynak; doğal hukukta sıklıkla ahlaki ölçüt de devreye girer.',
      },
    ],
    traps: [
      'Doğal hukuku “dini hukuk” diye eşitlemek — aile geniştir.',
      'Pozitivizmi “ahlaksız hukuk savunusu” sanmak — ayırım ile savunma farklıdır.',
      'Adaleti tek tanımla kilitlemek — türleri yaz.',
      'Düşünürü isimle anıp tezi atlamak — puan tezdedir.',
      'Hukuk–ahlakı “hiç ilişki yok / tamamen aynı” uçlarına sıkıştırmak.',
    ],
    keyMadde: [
      'Anayasa başlangıç / m.2 — hukuk devleti (bağlam köprüsü; felsefe sınavında çerçeve)',
      'AY m.10 — eşitlik (adalet tartışmasına köprü)',
      'AY m.36 — hak arama hürriyeti (usuli adalet köprüsü)',
      'İnsan Hakları Evrensel Bildirgesi / AİHS girişi (doğal hukuk mirası tartışması)',
      'TBK / TMK genel ilkeleri (iyi niyet, dürüstlük — ahlak–hukuk köprüsü, çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Hukuk felsefesi ne işe yarar?',
        paragraphs: [
          'Dogmatik dersler kuralı uygular; felsefe kuralın anlamını, sınırını ve meşruiyetini sorgular. Sınavda “tanım + karşıt akım + bir örnek” beklenir.',
          '1. dönem kavram ve klasik akım omurgasını taşır. Sosyoloji, yorum ve güncel tartışmalar 2. döneme kalır.',
        ],
        hapBilgi: 'Felsefe = ne / neden bağlar? Dogmatik = nasıl uygulanır?',
      },
      {
        heading: 'B. “Hukuk nedir?” sorusu',
        paragraphs: [
          'Tanım girişimleri: emir, kural, kurum, dil oyunu, güç ilişkisi, meşru zor kullanma tekeli… Her tanım bir okulun kapısını açar.',
          'Sınavda “tek doğru tanım” aranmaz; tanımın varsayımlarını ve sonuçlarını yazmak puan getirir.',
        ],
        bullets: [
          'Kaynak odaklı tanım (koyma)',
          'İçerik odaklı tanım (adalet / ahlak)',
          'İşlev odaklı tanım (düzen / barış)',
          'Pratik odaklı tanım (yargısal uygulama)',
        ],
      },
      {
        heading: 'C. Doğal hukuk',
        paragraphs: [
          'Antik, skolastik, Aydınlanma ve modern formlar ayırt edilir. Ortak iddia: hukuk yalnızca “koyulmuş olan” değildir; ölçülebilir bir ölçüt vardır.',
          'Eleştiri: kimin aklı, hangi doğa, hangi evrensellik? Karşıt pozitivist cevap: geçerlilik ile doğruluk ayrıdır.',
        ],
        kartlar: [
          { baslik: 'Klasik', govde: 'Doğa / akıl ölçütü.' },
          { baslik: 'Modern', govde: 'Haklar / insan onuru dili.' },
          { baslik: 'Eleştiri', govde: 'Öznel / çoğul ahlak riski.' },
        ],
      },
      {
        heading: 'D. Hukuki pozitivizm',
        paragraphs: [
          'Austin, Kelsen, Hart gibi isimler sınav iskeletinde anılır; her birinin tezi ayrı cümledir. Ortak çizgi: hukukun varlığı ahlaki doğruluğuna bağlı değildir (klasik ayrım tezi).',
          'İç eleştiriler ve “yumuşak / sert” pozitivizm tartışması çerçevede bilinir. Uydurma alıntı yazmayın; tez dilini kullanın.',
        ],
        uyari: 'İsim + tek cümle tez. Ezbere “pozitivizm kötüdür” yazmayın.',
      },
      {
        heading: 'E. Adalet teorileri (giriş)',
        paragraphs: [
          'Dağıtıcı adalet: pay ve yük. Denkleştirici adalet: bozulan dengeyi onarma. Usuli adalet: adil yargılama ve usul güvenceleri.',
          'Rawls tipi “adil kurumlar” ve utilitaryen “en çok fayda” yaklaşımları karşılaştırmalı çerçevede anılır; ayrıntı fakülte programına göre derinleşir.',
        ],
        hapBilgi: 'Adalet türünü soruya göre seç; hepsini bir torbada karıştırma.',
      },
      {
        heading: 'F. Hukuk ve ahlak',
        paragraphs: [
          'Ayrılık tezi: geçerlilik ahlaktan bağımsız olabilir. Bağlantı tezleri: zorunlu içerik, yorumda ahlak, hukuka karşı direnme tartışması.',
          'Sınavda uç cevaplar zayıftır: “hiç ilişki yok” veya “tamamen aynı”. Mesafe + etkileşim birlikte yazılır.',
        ],
      },
      {
        heading: 'G. Karşılaştırma şablonu',
        paragraphs: [
          'Her akım için: (1) hukuk tanımı (2) geçerlilik ölçütü (3) adaletle ilişki (4) güçlü yan (5) zayıf yan. Bu şablon 2. dönemle de taşınır.',
        ],
      },
    ],
    examples: [
      {
        title: 'Pozitivizm mi doğal hukuk mu?',
        facts:
          'Yürürlükteki bir yasa ahlaken ağır eleştiri alır; öğrenci “bu hukuk değildir” der.',
        analysis:
          'Pozitivist ayrım: geçerlilik ≠ ahlaki doğruluk. Doğal hukuk: ölçüt ihlali geçerliliği sarsabilir. İki tez, iki sonuç.',
        takeaway: 'Önce hangi okuldan konuştuğunu yaz.',
      },
      {
        title: 'Adalet türü',
        facts:
          'Sınav sorusu “cezada adalet” der; öğrenci yalnız “eşit pay” yazar.',
        analysis:
          'Denkleştirici / orantılılık / usuli güvenceler. Dağıtıcı adalet tek başına yetmez.',
        takeaway: 'Adalet kutusunu seç.',
      },
      {
        title: 'Tanım tuzağı',
        facts:
          '“Hukuk nedir?” sorusunda tek cümle tanım yazılır, varsayım yok.',
        analysis:
          'Tanımın okulu, eleştirisi ve sonucu eksik. Puan düşük kalır.',
        takeaway: 'Tanım + varsayım + eleştiri.',
      },
      {
        title: 'Hukuk–ahlak',
        facts:
          '“Hukuk ahlaktan tamamen bağımsızdır” mutlak cümle.',
        analysis:
          'Ayrılık tezi ile etkileşim (yorum, boşluk, direnme) karıştırılmış. Nüans yazılmalı.',
        takeaway: 'Uç cümle yerine mesafe + bağ.',
      },
    ],
    mindmap: {
      center: 'Hukuk Felsefesi · 1. dönem',
      branches: [
        { label: 'Soru', items: ['Hukuk nedir?', 'Geçerlilik'] },
        { label: 'Akımlar', items: ['Doğal hukuk', 'Pozitivizm'] },
        { label: 'Ölçüt', items: ['Adalet', 'Ahlak'] },
        { label: 'Yöntem', items: ['Tez', 'Karşı tez'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Hukuk toplumda nasıl yaşar? Yorum, hukuk devleti, haklar ve eleştirel bakış.',
    promise:
      'Hukuk sosyolojisi, yaşayan hukuk, yorum ve argümantasyon, hukuk devleti, hak teorileri, eleştirel yaklaşımlar girişi. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Hukuk sosyolojisi: kuralın toplumdaki fiili işleyişi.',
      'Yaşayan hukuk: kâğıttaki metin ≠ toplumsal pratik.',
      'Yorum: metin, amaç, sistem, tarih — yöntem seçimi gerekçelenir.',
      'Hukuk devleti: bağlayıcılık, öngörülebilirlik, denetim iskeleti.',
      'Haklar: öznel hak, temel hak, insan hakları dili.',
      'Eleştirel bakış: güç, ideoloji, dışlama soruları.',
    ],
    pillars: [
      'Hukuk sosyolojisinin konusu',
      'Normatif hukuk / fiili hukuk',
      'Yaşayan hukuk ve hukuk bilinci',
      'Yorum ve hukuki argümantasyon',
      'Hukuk devleti ve meşruiyet',
      'Hak teorileri (giriş)',
      'Eleştirel ve çağdaş yaklaşımlar girişi',
      'Felsefe–sosyoloji entegrasyonu',
    ],
    definitions: [
      {
        baslik: 'Hukuk sosyolojisi',
        govde:
          'Hukuku toplumsal olgu olarak inceleyen disiplindir: kurumlar, davranış, etki, meşruiyet algısı. Felsefe “olması gerekeni”; sosyoloji “olanı ve etkisini” de sorar.',
      },
      {
        baslik: 'Yaşayan hukuk',
        govde:
          'Resmî metnin ötesinde, toplumsal ilişkilerde fiilen uygulanan ve hissedilen hukuk pratiğidir. Boşluk, sapma ve alternatif normlar tartışılır.',
      },
      {
        baslik: 'Hukuki yorum',
        govde:
          'Norm metninin somut olaya uygulanabilir anlamının belirlenmesidir. Gramatikal, sistematik, tarihsel, teleolojik yöntemler gerekçeli seçilir.',
      },
      {
        baslik: 'Hukuk devleti',
        govde:
          'Kamusal gücün hukuka bağlı, öngörülebilir ve denetime açık kullanılması idealidir. Biçimsel ve maddi hukuk devleti ayrımları sınavda işe yarar.',
      },
      {
        baslik: 'Öznel hak',
        govde:
          'Kişiye, hukuk düzeni tarafından tanınan ve korunabilen talep / yetki alanıdır. Objektif hukuk ile öznel hak ilişkisi yazılır.',
      },
    ],
    traps: [
      'Sosyolojeyi “istatistik dersi” sanmak — kavram + kurum + etki.',
      'Yorum yöntemlerini isim listesi gibi yazıp olaya bağlamamak.',
      'Hukuk devletini yalnız “kanun vardır” diye bitirmek.',
      'Hakları “her istek haktır” diye genişletmek.',
      'Eleştirel yaklaşımı “hukuka düşmanlık” diye karikatürize etmek.',
    ],
    keyMadde: [
      'AY m.2 — demokratik, laik, sosyal hukuk devleti',
      'AY m.5 — devletin temel amaç ve görevleri (bağlam)',
      'AY m.10–13 — eşitlik ve temel hakların sınırlanması (çerçeve)',
      'AY m.36 / AİHS m.6 — adil yargılanma (usuli adalet–hukuk devleti)',
      'Yorumda TMK m.1 ve benzeri genel hükümler (çerçeve; dogmatik köprü)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Hukuk sosyolojisi nedir?',
        paragraphs: [
          'Soru: Hukuk toplumda nasıl üretilir, uygulanır, sapar, meşruiyet kazanır? Ampirik bakış ile normatif bakış karıştırılmaz ama konuşturulur.',
          '1. dönem akımları burada “toplumsal karşılık” testine girer: kâğıttaki pozitivist kural fiilen işliyor mu?',
        ],
        hapBilgi: 'Sosyoloji: metin + pratik + etki.',
      },
      {
        heading: 'B. Normatif ve fiili hukuk',
        paragraphs: [
          'Yürürlükteki kural ile fiili uygulama ayrılır. Sapma, seçici uygulama, enformel normlar sınav örneği olur.',
          '“Hukuk yoktur” demek yerine “hangi hukuk, kimin pratiği?” diye sormak daha güçlüdür.',
        ],
        kartlar: [
          { baslik: 'Normatif', govde: 'Metin / kaynak.' },
          { baslik: 'Fiili', govde: 'Uygulama / alışkanlık.' },
          { baslik: 'Gerilim', govde: 'Sapma / boşluk.' },
        ],
      },
      {
        heading: 'C. Yaşayan hukuk ve hukuk bilinci',
        paragraphs: [
          'Toplumun hukuku bilme, güvenme ve kullanma biçimleri hukuk bilincini oluşturur. Erişim, maliyet, dil ve güç asimetriisi etki eder.',
          'Ehrlich ve benzeri “yaşayan hukuk” vurguları çerçevede anılır; uydurma alıntı yok, tez dili var.',
        ],
      },
      {
        heading: 'D. Yorum ve argümantasyon',
        paragraphs: [
          'Yorum, felsefi varsayımları açığa çıkarır: metne sadakat mi, amaç mı, sistem mi? Argümantasyon: öncül, norm, olgu, sonuç.',
          'Sınavda yöntem adı yetmez; neden o yöntemin seçildiği bir cümleyle gerekçelenir.',
        ],
        uyari: 'Yöntem listesi ≠ cevap. Olaya bağla.',
      },
      {
        heading: 'E. Hukuk devleti ve meşruiyet',
        paragraphs: [
          'Biçimsel: kanunilik, belirlilik, yargısal denetim. Maddi: temel haklar, orantılılık, insan onuru. Meşruiyet: rıza, usul, performans tartışmaları.',
          'Felsefe 1. dönem “adalet”; 2. dönem “kurumsal garanti” diline kayar.',
        ],
        hapBilgi: 'Hukuk devleti = bağ + öngörü + denetim (+ haklar).',
      },
      {
        heading: 'F. Hak teorileri (giriş)',
        paragraphs: [
          'İrade teorisi, menfaat teorisi, temel hak–insan hakları ayrımı çerçevede yazılır. Hak çatışmalarında dengeleme / orantılılık dili devreye girer.',
          '“Hak vardır demek” yetmez; kim, kime karşı, hangi koruma ile sorulur.',
        ],
      },
      {
        heading: 'G. Eleştirel yaklaşımlar girişi',
        paragraphs: [
          'Hukuku tarafsız teknik sanan bakışa karşı: sınıf, cinsiyet, kültür, sömürgecilik, dil ve güç eleştirileri. Amaç yıkmak değil; kör noktaları göstermek olabilir.',
          'Sınavda karikatür yok: eleştirinin tezi + dogmatik cevabın sınırı birlikte yazılır.',
        ],
      },
    ],
    examples: [
      {
        title: 'Metin–pratik',
        facts:
          'Kanun eşitlik der; uygulama seçicidir. Öğrenci yalnız maddeyi yazar.',
        analysis:
          'Normatif kural + fiili sapma. Sosyolojik bakış. Hukuk devleti gerilimi.',
        takeaway: 'Metin ile pratik ayrı satır.',
      },
      {
        title: 'Yorum seçimi',
        facts:
          'Belirsiz madde; öğrenci “lafzı böyle” der, gerekçe yok.',
        analysis:
          'Gramatikal / teleolojik gerilim. Gerekçeli yöntem. Argümantasyon.',
        takeaway: 'Yöntemi gerekçele.',
      },
      {
        title: 'Hukuk devleti',
        facts:
          '“Kanun çıktı, hukuk devletidir” cümlesi.',
        analysis:
          'Biçimsel asgari. Maddi boyut ve denetim eksik. Zayıf cevap.',
        takeaway: 'Biçim + içerik + denetim.',
      },
      {
        title: 'Hak çatışması',
        facts:
          'İki temel hak çatışır; öğrenci birini yok sayar.',
        analysis:
          'Dengeleme / orantılılık. Çekirdek alan. Gerekçe.',
        takeaway: 'Hak silme, dengele.',
      },
    ],
    mindmap: {
      center: 'Hukuk Felsefesi · 2. dönem',
      branches: [
        { label: 'Sosyoloji', items: ['Pratik', 'Yaşayan hukuk'] },
        { label: 'Yöntem', items: ['Yorum', 'Argüman'] },
        { label: 'Kurum', items: ['Hukuk devleti', 'Haklar'] },
        { label: 'Eleştiri', items: ['Güç', 'İdeoloji'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Klasik akımlardan hukuk sosyolojisine, adaletten hukuk devletine tek omurga.',
    promise:
      '1. + 2. dönem birleşik; hukuk felsefesi ve sosyolojisi için “tek cilt” not. Dogmatik derslere kavram köprüsü kurar.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: akım mı, sosyoloji mi, kurumsal meşruiyet mi?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: hukuk nedir + akımlar → adalet/ahlak → sosyoloji/yorum → hukuk devleti/haklar → karma deneme.',
          'Her soruda: “Hangi okul? Hangi ölçüt? Metin mi pratik mi?”',
        ],
        hapBilgi: 'Yıllık başarı = akım dili + toplumsal bakış + gerekçeli yazım.',
        bullets: [
          'Hafta 1–3: hukuk nedir + doğal hukuk + pozitivizm',
          'Hafta 4–6: adalet + hukuk–ahlak',
          'Hafta 7–10: sosyoloji + yaşayan hukuk + yorum',
          'Hafta 11–14: hukuk devleti + haklar + eleştiri + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Akım karşılaştırması. Tip 2 — Adalet türü. Tip 3 — Hukuk–ahlak. Tip 4 — Metin/pratik. Tip 5 — Yorum gerekçesi. Tip 6 — Hukuk devleti / hak çatışması.',
          'Karma soruda önce kavram kutusu seç, sonra örnekle somutlaştır. Dogmatik maddeler köprüdür; felsefe cevabını madde numarasına indirgeme.',
        ],
        uyari: 'İsim listesi değil; tez + eleştiri + örnek yaz.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Hukuk Felsefesi · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Akımlar', 'Adalet', 'Ahlak'] },
        { label: '2. yarı', items: ['Sosyoloji', 'Yorum', 'Hukuk devleti'] },
        { label: 'Yöntem', items: ['Tez', 'Karşı tez', 'Örnek'] },
        { label: 'Köprü', items: ['Haklar', 'Meşruiyet'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'hukuk-felsefesi-donem-1': d1Content,
  'hukuk-felsefesi-donem-2': d2Content,
  'hukuk-felsefesi-yillik': yillikContent,
};

export const HUKUK_FELSEFESI_VARIANTS = [
  'hukuk-felsefesi-donem-1',
  'hukuk-felsefesi-donem-2',
  'hukuk-felsefesi-yillik',
];

export function buildHukukFelsefesiVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Hukuk Felsefesi ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Hukuk Felsefesi ve Sosyolojisi ${meta.h1Extra}`;
  const description = `${uni.name} için Hukuk Felsefesi ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Hukuk Felsefesi ve Sosyolojisi ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: akım dilini, adalet ve meşruiyet tartışmasını, toplumsal bakışı sınavda bozmadan yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Dogmatik dersler kural uygular; bu not kavram ve meşruiyet omurgasını kurar.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her soruda: hangi okul / hangi ölçüt?',
        'İsim + tez + karşı tez + bir örnek',
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
      heading: '5. Pusula dayanaklar (köprü)',
      paragraphs: [
        'Felsefe sınavı madde ezberi değildir; Anayasa ve hak dili bağlamsal köprüdür. Güncel metni doğrulayın.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma alıntı / uydurma madde yazmayın; tez dilini kullanın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Hukuk Felsefesi)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık işe yarar. 60 dk / 2–3 soruda soru başı plan: tez → karşı tez → örnek → sonuç.`,
        'İskelet: (1) kavram kutusu (2) akım/okul (3) ölçüt (4) eleştiri (5) somut köprü.',
      ],
      bullets: [
        'İsim + tek cümle tez',
        'Karşı tezi yazmadan bırakma',
        'Adalet türünü seç',
        'Metin–pratik ayrımını unutma',
      ],
      hapBilgi: 'Gerekçeli yazım = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Hukuk Felsefesi ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Kavramı tanımla',
        'Okulu / akımı seç',
        'Tezi yaz',
        'Karşı tezi yaz',
        'Örnekle somutlaştır',
        'Kısa sonuç',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'hukuk-felsefesi-donem-2'
          ? [
              ['Normatif hukuk', 'Fiili hukuk', 'Metin mi pratik mi?'],
              ['Yorum', 'Yasa koyma', 'Anlam mı yeni kural mı?'],
              ['Biçimsel hukuk devleti', 'Maddi hukuk devleti', 'Usul mü hak içeriği mi?'],
              ['Öznel hak', 'Objektif hukuk', 'Kişiye tanınan yetki mi düzen mi?'],
            ]
          : variantCode === 'hukuk-felsefesi-donem-1'
            ? [
                ['Doğal hukuk', 'Pozitivizm', 'Ölçüt ahlak/akıl mı koyma mı?'],
                ['Geçerlilik', 'Ahlaki doğruluk', 'Bağlar mı doğru mudur?'],
                ['Dağıtıcı adalet', 'Denkleştirici adalet', 'Pay mı bozulan denge mi?'],
                ['Hukuk', 'Ahlak', 'Bağımsız mı etkileşimli mi?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Akım/adalet mi sosyoloji/kurum mu?'],
                ['Doğal hukuk', 'Pozitivizm', 'Ölçüt mü kaynak mı?'],
                ['Metin', 'Pratik', 'Yazılı kural mı yaşayan hukuk mu?'],
                ['Adalet', 'Hukuk devleti', 'Değer mi kurumsal garanti mi?'],
              ],
    },
    {
      kind: 'ladder',
      title: 'Öğrenme merdiveni',
      levels: [
        'Tanım kartları',
        'Zihin haritası çiz',
        'Tuzak listesi',
        '4 örnek olay süreyle',
        'Karma deneme + yanlış defteri',
      ],
    },
    {
      kind: 'fork',
      title: 'Soru tipi',
      leftTitle: 'Akım / adalet',
      rightTitle: 'Sosyoloji / kurum',
      left: 'Doğal hukuk–pozitivizm–adalet–ahlak',
      right: 'Yaşayan hukuk–yorum–hukuk devleti–haklar',
    },
    {
      kind: 'cycle',
      title: 'Haftalık döngü',
      steps: ['Kavram', 'Şema', 'Örnek', 'Quiz', 'Yanlış defteri'],
    },
  ];

  const faq = [
    {
      q: '1. dönem / 2. dönem / yıllık farkı ne?',
      a: '1. dönem hukuk nedir–doğal hukuk–pozitivizm–adalet–hukuk/ahlak; 2. dönem sosyoloji–yorum–hukuk devleti–haklar–eleştirel giriş; yıllık ikisini birleştirir.',
    },
    {
      q: 'Anayasa maddeleri ezberlenecek mi?',
      a: 'Felsefe sınavı madde yarışı değildir; hukuk devleti ve hak dili için köprü dayanaklar yeter. Dogmatik derslerde madde derinleşir.',
    },
    {
      q: 'PDF nasıl indirilir?',
      a: '“PDF indir / Yazdır” veya …/pdf → Ctrl+P → PDF olarak kaydet.',
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
    'Akım karşılaştırma şablonunu denedim',
    'PDF’i arşivledim',
    variantCode === 'hukuk-felsefesi-yillik'
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
      `${uni.shortName} hukuk felsefesi ${meta.short}`,
      `${uni.shortName} hukuk sosyolojisi ders notu`,
      `hukuk felsefesi ${meta.short} not pdf`,
      'doğal hukuk pozitivizm adalet ders notu',
      'hukuk felsefesi yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} hukuk felsefesi`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format: uni.type === 'vakif' ? 'Klasik + ara; ödev/makale olabilir' : 'Klasik yazılı ağırlıklı',
      tips: [
        'Önce kavram kutusunu seç',
        'İsim + tez yaz',
        'Karşı tezi unutma',
        'Örnekle somutlaştır',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Hukuk felsefesi ${meta.short} kapsamındaki akım ve kavramları ayırır`,
      'Doğal hukuk–pozitivizm–adalet dilini kurar',
      'Hukuk–ahlak ve meşruiyet tartışmasını yazar',
      'Sosyolojik bakış ve yorum gerekçesini uygular',
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
    relatedCourses: HUKUK_FELSEFESI_VARIANTS.filter((c) => c !== variantCode).concat([
      'hukuk-felsefesi',
      'anayasa-1',
      'anayasa-2',
      'hukuk-metodolojisi',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'hukuk-felsefesi-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'hukuk-felsefesi',
    variantLabel: meta.label,
  };
}
