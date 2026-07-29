/**
 * TMK 2. Kitap (Aile Hukuku) —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * Pedagojik yarıyıl bölünmesi; aile-hukuku dersiyle hizalı.
 */

function baseMeta(variant) {
  const labels = {
    'tmk-2-kitap-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'TMK Aile · 1. yarı (nişan, evlenme, evliliğin genel hükümleri, boşanma sebepleri ve sonuçları girişi, aile konutu)',
    },
    'tmk-2-kitap-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'TMK Aile · 2. yarı (mal rejimleri ve tasfiye, soybağı, velayet, nafaka, evlat edinme, kişisel ilişki)',
    },
    'tmk-2-kitap-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'TMK 2. Kitap tam omurga · aile hukuku dönemlik + yıllık programlar için tek cilt',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Nişan–evlenme–evlilik düzeni–boşanma. İlişki kurulur, sürer, bozulursa ne olur?',
    promise:
      'Nişan, evlenme şartları, evliliğin genel hükümleri, boşanma sebepleri ve sonuçları girişi, aile konutu. Güz finalinde dosya mantığı bozulmadan yazarsınız.',
    sixtySecond: [
      'Nişan: evlenme vaadi; bozulunca hediye/tazminat tartışması.',
      'Evlenme: maddi + şeklî şartlar; yokluk / butlan / iptal ayrımı.',
      'Evlilikte eşitlik, birlikte yaşam, sadakat, yardım ödevleri.',
      'Boşanma: özel sebepler + genel (şiddetli geçimsizlik) iskeleti.',
      'Sonuç: nafaka türleri, velayet girişi, tazminat — her biri ayrı kutu.',
      'Aile konutu: rıza ve şerh; üçüncü kişi etkisi.',
    ],
    pillars: [
      'Nişanlanma ve sonuçları',
      'Evlenmenin maddi şartları',
      'Evlenmenin şeklî şartları',
      'Yokluk, butlan, iptal',
      'Evliliğin genel hükümleri',
      'Boşanma sebepleri',
      'Boşanmanın kişisel ve mali sonuçları (giriş)',
      'Aile konutu',
    ],
    definitions: [
      {
        baslik: 'Nişanlanma',
        govde:
          'Evlenme vaadiyle kurulan hukuki ilişkidir. Evlenmeye zorlama yoktur; bozulunca hediye iadesi ve belirli şartlarda tazminat gündeme gelebilir.',
      },
      {
        baslik: 'Butlan',
        govde:
          'Evlenmenin kanunda sayılan ağır sakatlıklarla geçersiz sayılması rejimidir. Mutlak / nisbi butlan ayrımı ve süreler sınavda yazılır.',
      },
      {
        baslik: 'Şiddetli geçimsizlik',
        govde:
          'Ortak hayatın çekilmez hâle gelmesi esasına dayanan genel boşanma sebebidir. Olayda somut olgular ve kusur dağılımı tartışılır.',
      },
      {
        baslik: 'Aile konutu',
        govde:
          'Eşlerin birlikte yaşadığı konuttur. Belirli tasarruflarda diğer eşin rızası aranır; şerh üçüncü kişilere karşı görünürlük sağlar.',
      },
      {
        baslik: 'Tedbir nafakası',
        govde:
          'Boşanma davası sırasında eş ve çocuklar için geçici koruma niteliğindeki nafakadır. İştirak ve yoksulluk nafakasından ayrılır.',
      },
    ],
    traps: [
      'Nişanı “küçük evlilik” sanmak — evlenmeye zorlanamaz.',
      'Yokluk / butlan / boşanmayı aynı torbaya koymak.',
      'Tüm nafakaları tek sepete yazmak (tedbir / iştirak / yoksulluk).',
      'Boşanmada kusuru tek başına velayet “cezası” sanmak.',
      'Aile konutunda rızasız işlemi her zaman yok saymak — tescil/iyiniyet senaryosu dikkatli.',
    ],
    keyMadde: [
      'TMK m.118 vd. — nişanlanma (çerçeve)',
      'TMK m.124 vd. — evlenme ehliyeti ve engelleri (çerçeve)',
      'TMK m.134 vd. — evlenme başvurusu ve tören (şekil)',
      'TMK m.145 vd. — butlan (çerçeve)',
      'TMK m.185 vd. — evliliğin genel hükümleri',
      'TMK m.161 vd. — boşanma sebepleri',
      'TMK m.194 — aile konutu',
      'TMK m.169 / 175 vd. — tedbir / yoksulluk nafakası (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. TMK 2. Kitap nedir?',
        paragraphs: [
          'İkinci kitap aile hukukudur: nişan, evlilik, boşanma, mal rejimleri, soybağı, velayet. Sınavda her kurum ayrı “dosya”dır; tek paragrafta her şeyi eritmek puan kaybettirir.',
          '1. dönem ilişki kurma–sürdürme–bozma omurgasını taşır. Mal rejimi tasfiyesi, soybağı ve velayet derinliği 2. döneme kalır; giriş bağları kurulur.',
        ],
        hapBilgi: 'Aile hukuku = dosya dosya düşün. Karıştırma.',
      },
      {
        heading: 'B. Nişanlanma',
        paragraphs: [
          'Nişan evlenme vaadidir; cebri icra ile evlendirme yoktur. Bozulunca hediyelerin iadesi ve kusura bağlı manevi/maddi tazminat tartışılır.',
          'Süre ve ispat olayda yazılır. “Nişanlıyız o hâlde mal paylaşırız” genellemesi yanlıştır.',
        ],
        bullets: ['Kuruluş', 'Bozulma', 'Hediye iadesi', 'Tazminat şartları'],
      },
      {
        heading: 'C. Evlenmenin şartları',
        paragraphs: [
          'Maddi şartlar: ehliyet, yaş, engeller (hısımlık, mevcut evlilik vb.). Şeklî şartlar: başvuru, yetkili memur önünde tören, sicil.',
          'Eksikliğin sonucu yokluk, butlan veya düzeltilmiş geçerlilik olabilir. “Geçersiz” tek kelimesi yetmez; hangi rejim yazın.',
        ],
        kartlar: [
          { baslik: 'Maddi', govde: 'Ehliyet, yaş, engel yokluğu.' },
          { baslik: 'Şekil', govde: 'Başvuru + tören + sicil.' },
          { baslik: 'Sonuç', govde: 'Yokluk / butlan / geçerli.' },
        ],
        uyari: 'Yokluk ≠ butlan ≠ boşanma. Kapıyı seçin.',
      },
      {
        heading: 'D. Evliliğin genel hükümleri',
        paragraphs: [
          'Eşler eşit hak ve yükümlülüklere sahiptir. Birlikte yaşam, sadakat, yardım, eve emek katkısı temel ödevlerdir. Konut seçimi ve meslekî faaliyet dengesi yazılır.',
          'Temsil ve evlilik birliğinin korunması (tedbirler) boşanma öncesi de devreye girebilir.',
        ],
      },
      {
        heading: 'E. Boşanma sebepleri',
        paragraphs: [
          'Özel sebepler (zina, hayata kast, pek kötü/onur kırıcı davranış, suç ve haysiyetsiz hayat, terk, akıl hastalığı — güncel madde listesi) ve genel sebep (şiddetli geçimsizlik) ayrılır.',
          'Olayda olguları sebebe yedirin. Anlaşmalı boşanma ayrı usuldür; protokol netliği şarttır. Çekişmeli boşanmada kusur, nafaka ve tazminatı etkiler ama velayette tek ölçü değildir.',
        ],
        hapBilgi: 'Sebep → olgu → kusur → sonuç talepleri (ayrı kutular).',
        bullets: [
          'Özel sebepler',
          'Şiddetli geçimsizlik',
          'Anlaşmalı boşanma',
          'Çekişmeli usul iskeleti',
        ],
      },
      {
        heading: 'F. Boşanmanın sonuçları (giriş)',
        paragraphs: [
          'Kişisel sonuçlar: soyadı, mirasçılık, evlilik birliğinin sona ermesi. Mali sonuçlar: maddi/manevi tazminat, nafaka türleri. Çocuklar: velayet ve kişisel ilişki (derinlik 2. dönem).',
          'Tedbir nafakası dava sürecinde; yoksulluk nafakası boşanma sonrası; iştirak nafakası çocuk içindir. İsimleri karıştırmayın.',
        ],
        uyari: 'Nafaka türü = farklı şart + farklı süre/hesap.',
      },
      {
        heading: 'G. Aile konutu',
        paragraphs: [
          'Aile konutu üzerinde diğer eşin rızası aranan tasarruflar vardır. Şerh, üçüncü kişilere karşı korumayı güçlendirir. Kira sözleşmesinin feshinde de özel rejim gündeme gelebilir.',
          'Eşya ve borçlar hukukuyla kesişir; sınavda “hangi eş, hangi işlem, rıza var mı, tescil/şerh?” yazın.',
        ],
      },
    ],
    examples: [
      {
        title: 'Nişanın bozulması',
        facts:
          'Nişan bozulur; bir taraf pahalı hediyelerin iadesini, diğer taraf manevi tazminat ister.',
        analysis:
          'Hediye iadesi kuralı + kusur + tazminat şartları. Evlenmeye zorlama yok.',
        takeaway: 'Nişan ≠ cebri evlilik.',
      },
      {
        title: 'Butlan mı boşanma mı?',
        facts:
          'Evlenme sırasında mevcut evlilik engeli olduğu sonradan ortaya çıkar.',
        analysis:
          'Mutlak butlan çerçevesi. Boşanma değil butlan yolu. Çocuklar ve iyiniyetli eş koruması.',
        takeaway: 'Engel türü = rejim seçimi.',
      },
      {
        title: 'Şiddetli geçimsizlik',
        facts:
          'Taraflar uzun süredir ayrı yaşıyor; karşılıklı ağır ithamlar var. Biri boşanma + yoksulluk nafakası ister.',
        analysis:
          'Çekilmezlik olguları + kusur. Nafakada “daha ağır kusurlu olmama”. Tedbir ayrı kutu.',
        takeaway: 'Olgular → sebep → mali sonuç ayrı.',
      },
      {
        title: 'Aile konutu satışı',
        facts:
          'Eşlerden biri, diğerinin rızası olmadan aile konutunu satmak ister; tapuda şerh vardır.',
        analysis:
          'TMK m.194 rıza. Şerhin üçüncü kişi etkisi. İşlemin akıbeti.',
        takeaway: 'Rıza + şerh = aile konutu kalkanı.',
      },
    ],
    mindmap: {
      center: 'TMK 2. Kitap · 1. dönem',
      branches: [
        { label: 'Kuruluş', items: ['Nişan', 'Evlenme', 'Şekil'] },
        { label: 'Sakatlık', items: ['Yokluk', 'Butlan'] },
        { label: 'Boşanma', items: ['Sebepler', 'Sonuçlar'] },
        { label: 'Koruma', items: ['Aile konutu', 'Tedbir'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Mal rejimi, soybağı, velayet, nafaka, evlat edinme. Çocuk ve mal dosyaları.',
    promise:
      'Edinilmiş mallara katılma ve tasfiye, soybağı, velayet, kişisel ilişki, nafaka türleri, evlat edinme. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Yasal mal rejimi: edinilmiş mallara katılma (aksi karar yoksa).',
      'Tasfiye: kişisel mal / edinilmiş mal ayrımı + katılma alacağı.',
      'Soybağı: nesep; babalık, tanıma, iptal çerçeveleri.',
      'Velayet: çocuk yararı; ödül-ceza değil.',
      'Nafaka: tedbir / iştirak / yoksulluk — şartları ayır.',
      'Evlat edinme: şartlar + sonuçlar (giriş+uygulama).',
    ],
    pillars: [
      'Mal rejimleri genel ve sözleşme',
      'Edinilmiş mallara katılma ve tasfiye',
      'Soybağı (nesep)',
      'Velayet',
      'Kişisel ilişki',
      'Nafaka türleri (derin)',
      'Evlat edinme',
      'Çocuk malları / temsil girişi',
    ],
    definitions: [
      {
        baslik: 'Edinilmiş mallara katılma',
        govde:
          'Yasal mal rejimidir. Edinilmiş mallar ile kişisel mallar ayrılır; tasfiyede katılma alacağı hesaplanır.',
      },
      {
        baslik: 'Velayet',
        govde:
          'Çocuğun bakım, eğitim, temsil ve korunmasına ilişkin ana-baba yetki ve ödevidir. Ölçüt çocuk yararıdır.',
      },
      {
        baslik: 'İştirak nafakası',
        govde:
          'Velayet kendisinde olmayan veya çocuğa bakmayan ana-babanın, çocuğun bakım ve eğitim giderlerine katılma borcudur.',
      },
      {
        baslik: 'Yoksulluk nafakası',
        govde:
          'Boşanma yüzünden yoksulluğa düşecek tarafın, kusuru daha ağır olmamak kaydıyla talep edebileceği nafakadır.',
      },
      {
        baslik: 'Soybağı',
        govde:
          'Çocuk ile ana-baba arasındaki hukuki bağdır. Kuruluş (doğum, tanıma, babalık, evlat edinme) ve iptal/itiraz yolları vardır.',
      },
    ],
    traps: [
      'Mal rejimini boşanma sebebine karıştırmak.',
      'Velayeti “kusurlu eşe ceza” gibi yazmak.',
      'İştirak ile yoksulluk nafakasını aynı şartlarla yazmak.',
      'Kişisel malı edinilmiş mal saymak (veya tersi) — tasfiye bozulur.',
      'Soybağı davasını velayet davasıyla tek cümlede eritmek.',
    ],
    keyMadde: [
      'TMK m.202 vd. — mal rejimleri genel',
      'TMK m.218 vd. — edinilmiş mallara katılma',
      'TMK m.282 vd. — soybağı (çerçeve)',
      'TMK m.335 vd. — velayet',
      'TMK m.182 / 323 vd. — kişisel ilişki / çocukla ilişki (çerçeve)',
      'TMK m.175 / 327 vd. — yoksulluk / iştirak nafakası',
      'TMK m.305 vd. — evlat edinme (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Mal rejimleri genel',
        paragraphs: [
          'Eşler mal rejimini sözleşme ile seçebilir; seçim yoksa yasal rejim (edinilmiş mallara katılma) uygulanır. Mal ayrılığı, paylaşmalı mal ayrılığı, mal ortaklığı bilinen seçeneklerdir.',
          'Boşanma sebebinden bağımsız bir “hesap dosyası”dır. Sınavda önce hangi rejim, sonra tasfiye adımları yazılır.',
        ],
        hapBilgi: 'Rejim seç → mal grupla → alacak hesapla.',
      },
      {
        heading: 'B. Edinilmiş mallara katılma ve tasfiye',
        paragraphs: [
          'Kişisel mallar (kişisel kullanıma yarayan eşya, manevi tazminat, miras/bağış vb. — madde listesi) ile edinilmiş mallar (emek karşılığı, kişisel malların gelirleri vb.) ayrılır.',
          'Tasfiye: her eşin edinilmiş mallarından borçlar düşülür; artık değer üzerinden katılma alacağı doğar. İspat ve değerleme tarihi klasik tuzaklardır.',
        ],
        kartlar: [
          { baslik: 'Kişisel mal', govde: 'Tasfiyeye katılmaz (kural).' },
          { baslik: 'Edinilmiş mal', govde: 'Artık değer hesabına girer.' },
          { baslik: 'Katılma alacağı', govde: 'Artık değerin payı.' },
          { baslik: 'İspat', govde: 'Mal grubu + değer.' },
        ],
        uyari: 'Hangi mal grubu belirsizse hesap çöker — önce sınıflandırın.',
      },
      {
        heading: 'C. Soybağı',
        paragraphs: [
          'Ana yönünden soybağı doğumla; baba yönünden evlilik karinesi, tanıma veya babalık davası ile kurulabilir (çerçeve). İptal ve itiraz süreleri vardır.',
          'Soybağı, velayet, nafaka ve mirasın kapısını açar. “Önce soybağı, sonra velayet/nafaka” sırası unutulmamalıdır.',
        ],
        bullets: [
          'Kuruluş yolları',
          'Karine ve çürütme',
          'Tanıma',
          'Babalık davası',
          'İptal / itiraz',
        ],
      },
      {
        heading: 'D. Velayet ve kişisel ilişki',
        paragraphs: [
          'Velayet çocuk yararınadır. Fiilî bakım, kardeşlerin birliği, istikrar, sosyal inceleme raporları dikkate alınır. Ana-baba kusuru tek başına belirleyici değildir.',
          'Velayet kendisinde olmayan taraf kural olarak kişisel ilişki hakkına sahiptir. Sınırlama, çocuğun üstün yararıyla gerekçelenir.',
        ],
        hapBilgi: 'Velayet = çocuk yararı. Kişisel ilişki = kural; sınır = istisna.',
      },
      {
        heading: 'E. Nafaka türleri (derin)',
        paragraphs: [
          'Tedbir: dava sırasında geçici. İştirak: çocuğun giderlerine katılma. Yoksulluk: boşanma sonrası yoksulluğa düşen eş (kusur şartı). Miktarda gelir-gider dengesi ve hakkaniyet yazılır.',
          'Artırım, indirim, kaldırılma sebepleri ayrı kutudur. İcra ile kesişir ama aile hukuku şartları önce gelir.',
        ],
        uyari: 'Tür karışırsa şartlar ve sonuç yanlış yazılır.',
      },
      {
        heading: 'F. Evlat edinme',
        paragraphs: [
          'Şartlar (yaş farkı, bakım süresi, rızalar — güncel madde) ve sonuçlar (soybağı, velayet, miras) bilinir. Küçük ve ergin evlat edinme ayrımı yapılır.',
          'Sınavda “kuruluş şartları → usul → hükümler” sırası yeterlidir; uydurma süre yazmayın.',
        ],
      },
      {
        heading: 'G. Çocuk malları ve temsil',
        paragraphs: [
          'Velayet sahibi ana-baba çocuğu temsil eder; çocuk mallarının yönetimi özen borcu altındadır. Önemli tasarruflarda sınırlar ve mahkeme izni gündeme gelebilir (giriş).',
          '1. kitaptaki fiil ehliyeti ile bağ kurulur: çocuk işlem ehliyeti dar, temsil devreye girer.',
        ],
      },
    ],
    examples: [
      {
        title: 'Mal rejimi tasfiyesi',
        facts:
          'Boşanmada bir eş “ev benim maaşımla alındı, tamamen benim” der; diğer eş katılma alacağı ister. Sözleşme yoktur.',
        analysis:
          'Yasal rejim. Edinilmiş mal mı? Artık değer. Katılma alacağı. Kişisel mal iddiası ispatı.',
        takeaway: 'Önce grupla, sonra hesapla.',
      },
      {
        title: 'Velayet',
        facts:
          'Her iki taraf da velayet ister; çocuk 8 yaşında, fiilen anneyle yaşamaktadır.',
        analysis:
          'Çocuk yararı, fiilî bakım, istikrar, kardeşler, sosyal inceleme. Kusur tek ölçü değil.',
        takeaway: 'Ödül-ceza değil; çocuk yararı.',
      },
      {
        title: 'İştirak vs yoksulluk',
        facts:
          'Boşanan eş hem kendisi için hem çocuk için “nafaka” ister; tek rakam yazar.',
        analysis:
          'İki ayrı nafaka: iştirak (çocuk) + yoksulluk (eş, kusur şartı). Miktar ve şart ayrı.',
        takeaway: 'Türleri ayır, şartları ayır.',
      },
      {
        title: 'Soybağı — babalık',
        facts:
          'Evlilik dışı çocuk; baba tanımayı reddeder. Anne nafaka ve soybağı ister.',
        analysis:
          'Önce soybağı (babalık). Sonra velayet/iştirak nafakası. Süre ve ispat.',
        takeaway: 'Soybağı kapısı önce açılır.',
      },
    ],
    mindmap: {
      center: 'TMK 2. Kitap · 2. dönem',
      branches: [
        { label: 'Mal', items: ['Rejim', 'Tasfiye', 'Katılma'] },
        { label: 'Çocuk', items: ['Soybağı', 'Velayet', 'İlişki'] },
        { label: 'Nafaka', items: ['Tedbir', 'İştirak', 'Yoksulluk'] },
        { label: 'Özel', items: ['Evlat edinme'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Nişan ve boşanmadan mal rejimi, velayet ve nafakaya kadar tek omurga.',
    promise:
      '1. + 2. dönem birleşik; aile hukuku / TMK 2. Kitap için “tek cilt” not.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: ilişki dosyası mı, çocuk dosyası mı, mal dosyası mı?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 4), ...b.keyMadde.slice(0, 4)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: nişan–evlenme–boşanma → deneme → mal rejimi–velayet–nafaka → karma deneme.',
          'Her soruda etiket: “Kuruluş/bozma mı, mal mı, çocuk mu?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru dosya + doğru şart listesi.',
        bullets: [
          'Hafta 1–3: nişan + evlenme + butlan',
          'Hafta 4–7: boşanma sebepleri + sonuçlar + aile konutu',
          'Hafta 8–11: mal rejimi + tasfiye',
          'Hafta 12–14: soybağı + velayet + nafaka + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon: sık soru tipleri',
        paragraphs: [
          'Tip 1 — Şiddetli geçimsizlik. Tip 2 — Aile konutu. Tip 3 — Nafaka türü. Tip 4 — Velayet. Tip 5 — Katılma alacağı. Tip 6 — Soybağı.',
          'Karma olayda boşanma + velayet + mal rejimi üst üste binebilir. Sıra: evlilik sona erdi mi → çocuk dosyası → mal dosyası → nafaka/tazminat.',
        ],
        uyari: 'Tek cevapta tüm aile hukukunu özetlemeyin; dosyayı seçin.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'TMK 2. Kitap · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Nişan', 'Evlenme', 'Boşanma'] },
        { label: '2. yarı', items: ['Mal', 'Velayet', 'Nafaka'] },
        { label: 'Çocuk', items: ['Soybağı', 'İlişki'] },
        { label: 'Yöntem', items: ['Dosya seç', 'Şart yaz'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'tmk-2-kitap-donem-1': d1Content,
  'tmk-2-kitap-donem-2': d2Content,
  'tmk-2-kitap-yillik': yillikContent,
};

export const TMK_2_KITAP_VARIANTS = [
  'tmk-2-kitap-donem-1',
  'tmk-2-kitap-donem-2',
  'tmk-2-kitap-yillik',
];

export function buildTmk2KitapVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} TMK 2. Kitap ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} TMK 2. Kitap (Aile Hukuku) ${meta.h1Extra}`;
  const description = `${uni.name} için TMK 2. Kitap ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Türk Medenî Kanunu 2. Kitap — aile hukuku — ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: doğru dosyayı (kuruluş-boşanma / mal / çocuk) seçip şartlarıyla yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır; aile hukuku dersiyle hizalıdır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Dönemlik program kendi yarısını; yıllık veya bütüncül tekrar yıllık paketi kullanır.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: ilişki mi, mal mı, çocuk mu?',
        'Nafaka türünü ilk satırda adlandır',
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
      paragraphs: ['Soru tipine göre dayanaklar. Güncel metin: TMK 2. Kitap.'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde no yazmayın; TMK metninden doğrulayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (TMK 2. Kitap / Aile)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) dosya seç (2) tanım (3) şart/sebep (4) olgu (5) sonuç talepleri ayrı kutuda.',
      ],
      bullets: [
        'Yokluk / butlan / boşanma kapısını seç',
        'Nafaka türünü ayır',
        'Velayette çocuk yararını yaz',
        'Mal rejiminde önce grupla',
      ],
      hapBilgi: 'Doğru dosya + doğru şart = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `TMK 2. Kitap ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Dosyayı seç (ilişki / mal / çocuk)',
        'Tanım (1 cümle)',
        'Şart veya sebep listesi',
        'Olayı yedir',
        'Sonuç taleplerini ayır',
        'Süre / ispat kapat',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'tmk-2-kitap-donem-2'
          ? [
              ['İştirak nafakası', 'Yoksulluk nafakası', 'Çocuk mu eş mi?'],
              ['Kişisel mal', 'Edinilmiş mal', 'Tasfiyeye girer mi?'],
              ['Velayet', 'Kişisel ilişki', 'Bakım yetkisi mi görüşme mi?'],
              ['Soybağı', 'Velayet', 'Nesep mi bakım yetkisi mi?'],
            ]
          : variantCode === 'tmk-2-kitap-donem-1'
            ? [
                ['Butlan', 'Boşanma', 'Kuruluş sakatlığı mı sona erme mi?'],
                ['Nişan', 'Evlenme', 'Vaad mi kurulu evlilik mi?'],
                ['Tedbir nafakası', 'Yoksulluk nafakası', 'Dava içi mi sonrası mı?'],
                ['Özel sebep', 'Şiddetli geçimsizlik', 'Kanunda sayılan mı genel mi?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Kuruluş-boşanma mı mal-çocuk mu?'],
                ['İştirak', 'Yoksulluk', 'Çocuk mu eş mi?'],
                ['Butlan', 'Boşanma', 'Sakatlık mı sona erme mi?'],
                ['Velayet', 'Mal rejimi', 'Çocuk mu mal dosyası mı?'],
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
      leftTitle: 'İlişki / boşanma',
      rightTitle: 'Mal / çocuk',
      left: 'Nişan–evlenme–sebep–sonuç + aile konutu',
      right: 'Rejim–tasfiye veya soybağı–velayet–nafaka',
    },
    {
      kind: 'cycle',
      title: 'Haftalık döngü',
      steps: ['Madde', 'Şema', 'Örnek', 'Quiz', 'Yanlış defteri'],
    },
  ];

  const faq = [
    {
      q: '1. dönem / 2. dönem / yıllık farkı ne?',
      a: '1. dönem nişan–evlenme–boşanma–aile konutu; 2. dönem mal rejimi–soybağı–velayet–nafaka–evlat edinme; yıllık ikisini birleştirir.',
    },
    {
      q: 'Aile hukuku dersiyle aynı mı?',
      a: 'Evet, hizalıdır. Fakültede “Aile Hukuku” adıyla okutulan TMK 2. Kitap omurgasıdır.',
    },
    {
      q: 'PDF nasıl indirilir?',
      a: '“PDF indir / Yazdır” veya …/pdf → Ctrl+P → PDF olarak kaydet. Kişisel kullanım.',
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
    'Pusula maddeleri TMK’dan doğruladım',
    'PDF’i arşivledim',
    variantCode === 'tmk-2-kitap-yillik'
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
      `${uni.shortName} tmk 2. kitap ${meta.short}`,
      `${uni.shortName} aile hukuku ders notu`,
      `tmk 2. kitap ${meta.short} not pdf`,
      'boşanma velayet nafaka mal rejimi ders notu',
      'aile hukuku yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} aile hukuku`),
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
        'Dosyayı ilk cümlede seç',
        'Nafaka türünü ayır',
        'Velayette çocuk yararını yaz',
        'Malda önce grupla',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `TMK 2. Kitap ${meta.short} kapsamındaki kurumları ayırır`,
      'Boşanma sebebi ve sonuçlarını dosya dosya yazar',
      'Mal rejimi tasfiye iskeletini kurar',
      'Velayet ve nafaka şartlarını uygular',
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
    relatedCourses: TMK_2_KITAP_VARIANTS.filter((c) => c !== variantCode).concat([
      'aile-hukuku',
      'miras-hukuku-donem-1',
      'tmk-1-kitap-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: variantCode === 'tmk-2-kitap-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'tmk-2-kitap',
    variantLabel: meta.label,
  };
}
