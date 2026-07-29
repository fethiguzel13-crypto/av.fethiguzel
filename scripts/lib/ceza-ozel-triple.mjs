/**
 * Ceza Hukuku Özel Hükümler (TCK özel suç tipleri) —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 */

function baseMeta(variant) {
  const labels = {
    'ceza-ozel-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'TCK Özel · 1. yarı (hayata, vücut bütünlüğüne, hürriyete, şerefe, özel hayata karşı suçlar)',
    },
    'ceza-ozel-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'TCK Özel · 2. yarı (malvarlığı, kamu idaresi, adliyeye karşı, bilişim girişi, seçilmiş diğer tipler)',
    },
    'ceza-ozel-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'Ceza özel hükümler tam omurga · kişiye karşı + malvarlığı/kamu · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Kişiye karşı suçlar. Önce tipi seç, unsurları yaz, genel hükümleri bağla.',
    promise:
      'Kasten öldürme, kasten yaralama, işkence/eziyet girişi, tehdit, şantaj, kişiyi hürriyetinden yoksun kılma, hakaret, özel hayatın gizliliği. Güz finalinde tip unsurları bozulmadan yazarsınız.',
    sixtySecond: [
      'Önce suç tipi + maddi unsur listesi.',
      'Kasten öldürme: netice ölüm; nitelikli hâller ayrı.',
      'Kasten yaralama: netice + basit/nitelikli.',
      'Hürriyete karşı: tehdit, şantaj, kişiyi hürriyetinden yoksun kılma.',
      'Hakaret: onur + aleniyet tartışması.',
      'Her tipte: genel teşebbüs/iştirak kutusu açık.',
    ],
    pillars: [
      'Özel hükümlerde yöntem',
      'Hayata karşı suçlar (öldürme)',
      'Vücut bütünlüğüne karşı suçlar (yaralama)',
      'İşkence ve eziyet girişi',
      'Hürriyete karşı suçlar',
      'Şerefe karşı suçlar (hakaret)',
      'Özel hayata ve hayatın gizli alanına karşı suçlar girişi',
      'Genel hükümlerle bağ (teşebbüs/nitelik)',
    ],
    definitions: [
      {
        baslik: 'Kasten öldürme',
        govde:
          'Bir insanı kasten öldürmektir. Nitelikli hâller (tasarlama, canavarca his vb.) cezayı ağırlaştırır; teşebbüs mümkündür.',
      },
      {
        baslik: 'Kasten yaralama',
        govde:
          'Başkasının vücut bütünlüğüne kasten zarar vermektir. Neticeye göre basit/nitelikli ayrımı ve etkili eylem tartışması yapılır.',
      },
      {
        baslik: 'Tehdit',
        govde:
          'Bir başkasını, kendisinin veya yakınının hayatına, vücut veya cinsel dokunulmazlığına yönelik bir saldırı gerçekleştireceğinden bahisle korkutmaktır (çerçeve).',
      },
      {
        baslik: 'Kişiyi hürriyetinden yoksun kılma',
        govde:
          'Bir kimseyi hukuka aykırı olarak bir yere gitmek veya bir yerde kalmak hürriyetinden yoksun bırakmaktır.',
      },
      {
        baslik: 'Hakaret',
        govde:
          'Bir kimseye onur, şeref ve saygınlığını rencide edebilecek somut bir fiil veya olgu isnat etmek veya sövmektir.',
      },
    ],
    traps: [
      'Öldürme / yaralama neticesini karıştırmak.',
      'Nitelikli hâli “genel kötü niyet” sanmak — kanuni liste.',
      'Tehdit ile şantajı aynı yazmak.',
      'Hakarette ispat/aleniyet kutusunu atlamak.',
      'Genel teşebbüs kuralını özel tipte unutmak.',
    ],
    keyMadde: [
      'TCK m.81–82 — kasten öldürme / nitelikli',
      'TCK m.86–87 — kasten yaralama / neticesi sebebiyle ağırlaşmış',
      'TCK m.94–96 — işkence / eziyet (çerçeve)',
      'TCK m.106–107 — tehdit / şantaj',
      'TCK m.109 — kişiyi hürriyetinden yoksun kılma',
      'TCK m.125 — hakaret',
      'TCK m.132 vd. — özel hayat (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Özel hüküm yöntemi',
        paragraphs: [
          'Her soruda: (1) hangi madde/tip (2) maddi unsurlar (3) manevi unsur (4) nitelikli hâl (5) teşebbüs/iştirak (6) ceza. Genel nottaki iskelet burada uygulanır.',
          '1. dönem kişiye karşı suçları; 2. dönem malvarlığı ve kamu suçlarını taşır.',
        ],
        hapBilgi: 'Tip seç → unsur yaz → genel kutuyu bağla.',
      },
      {
        heading: 'B. Kasten öldürme',
        paragraphs: [
          'Maddi unsur: ölüm neticesi + nedensellik. Manevi: kast/olası kast. Nitelikli hâller kanuni listeden (tasarlama, canavarca his, üstsoy-altsoy vb.).',
          'Teşebbüs: ölüm gerçekleşmezse. Kasten yaralama ile sınır çizgisi netice ve kastla çizilir.',
        ],
        bullets: ['Basit', 'Nitelikli', 'Teşebbüs', 'Olası kast'],
      },
      {
        heading: 'C. Kasten yaralama',
        paragraphs: [
          'Netice: acı, sağlık bozulması, algılama yeteneğinin bozulması vb. Neticesi sebebiyle ağırlaşmış yaralama ayrı rejimdir.',
          'Etkili eylem / hakaret kesişimi olayda tartılır; tipe sadık kalın.',
        ],
      },
      {
        heading: 'D. Hürriyete karşı suçlar',
        paragraphs: [
          'Tehdit, şantaj, kişiyi hürriyetinden yoksun kılma en sık sorulanlardır. Şantajda menfaat temini unsuru tehditten ayırır.',
          'Hürriyetten yoksun kılmada süre, nitelikli hâller ve rıza tartışması yazılır.',
        ],
        kartlar: [
          { baslik: 'Tehdit', govde: 'Korkutma.' },
          { baslik: 'Şantaj', govde: 'Menfaat + tehdit.' },
          { baslik: 'Hürriyet yoksunu', govde: 'Gitme/kalma engeli.' },
        ],
      },
      {
        heading: 'E. Hakaret ve özel hayat',
        paragraphs: [
          'Hakaret: somut isnat veya sövme; mağdurun onuru. İspat hakkı ve aleniyet bazı hâllerde tartışılır.',
          'Özel hayatın gizliliği, haberleşmenin gizliliği girişi 1. dönemde tanınır; bilişimle kesişim 2. döneme kalır.',
        ],
      },
      {
        heading: 'F. İşkence / eziyet girişi',
        paragraphs: [
          'Kamu görevlisi unsuru işkencede tipiktir (çerçeve). Eziyet daha geniş mağdur kitlesine yayılabilir. Ayrıntılı unsur listesi güncel maddeden doğrulanır.',
        ],
      },
      {
        heading: 'G. Sınav iskeleti (1. dönem)',
        paragraphs: [
          '(1) tip (2) maddi unsur (3) kast (4) nitelik (5) teşebbüs/iştirak (6) ceza aralığı.',
        ],
      },
    ],
    examples: [
      {
        title: 'Öldürme mi yaralama mı?',
        facts:
          'Sanık bıçaklar; mağdur yoğun bakımda kalır, ölmez. “Öldürmek istedim” der.',
        analysis:
          'Kastın yöneldiği netice. Teşebbüs (öldürme) vs tamamlanmış yaralama. Delil.',
        takeaway: 'Kast + netice çizgisi.',
      },
      {
        title: 'Tehdit / şantaj',
        facts:
          '“Paranı vermezsen ifşa ederim” denir.',
        analysis:
          'Şantaj unsurları. Tehditten fark. Menfaat.',
        takeaway: 'Menfaat varsa şantaj kutusu.',
      },
      {
        title: 'Hürriyetten yoksun kılma',
        facts:
          'Mağdur arabada kilitlenir; kapı sonradan açılır.',
        analysis:
          'Hürriyet unsuru. Süre. Nitelikli hâl var mı? Rıza?',
        takeaway: 'Gitme/kalma özgürlüğü engellendi mi?',
      },
      {
        title: 'Hakaret',
        facts:
          'Sosyal medyada somut isnat yapılır; mağdur şikâyetçi olur.',
        analysis:
          'Hakaret unsurları. Aleniyet. İspat tartışması. Şikâyet.',
        takeaway: 'Onur + isnat/sövme.',
      },
    ],
    mindmap: {
      center: 'Ceza Özel · 1. dönem',
      branches: [
        { label: 'Hayat', items: ['Öldürme', 'Teşebbüs'] },
        { label: 'Vücut', items: ['Yaralama', 'Ağır netice'] },
        { label: 'Hürriyet', items: ['Tehdit', 'Şantaj', 'Alıkoyma'] },
        { label: 'Onur', items: ['Hakaret', 'Özel hayat'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Malvarlığı ve kamu suçları. Hırsızlık–dolandırıcılık–güveni kötüye kullanma + kamu idaresi.',
    promise:
      'Hırsızlık, yağma, dolandırıcılık, güveni kötüye kullanma, karşılıksız yararlanma girişi, kamu idaresine karşı suçlar, adliyeye karşı suçlar, bilişim suçları girişi. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Hırsızlık: zilyetlikten rızasız alma + yararlanma kastı.',
      'Yağma: cebir/tehdit + mal.',
      'Dolandırıcılık: hile + hata + zarar + yarar.',
      'Güveni kötüye kullanma: zilyetlik devri + sadakat ihlali.',
      'Kamu idaresi: zimmet, irtikap, rüşvet, görevi kötüye kullanma girişi.',
      'Her tipte nitelikli hâller ve etkin pişmanlık kutusu.',
    ],
    pillars: [
      'Hırsızlık ve yağma',
      'Dolandırıcılık',
      'Güveni kötüye kullanma',
      'Karşılıksız yararlanma / dolandırıcılık sınırları',
      'Kamu idaresinin güvenilirliğine ve işleyişine karşı suçlar',
      'Adliyeye karşı suçlar girişi',
      'Bilişim sistemine karşı suçlar girişi',
      'Etkin pişmanlık ve şikâyet',
    ],
    definitions: [
      {
        baslik: 'Hırsızlık',
        govde:
          'Zilyedinin rızası olmadan başkasına ait taşınır bir malı, kendisine veya başkasına bir yarar sağlamak maksadıyla bulunduğu yerden almaktır.',
      },
      {
        baslik: 'Yağma',
        govde:
          'Cebir veya tehdit kullanarak bir malı alma veya teslime zorlamadır. Hırsızlıktan cebir/tehdit unsuruyla ayrılır.',
      },
      {
        baslik: 'Dolandırıcılık',
        govde:
          'Hileli davranışlarla bir kimseyi aldatıp, onun veya başkasının zararına, kendisine veya başkasına yarar sağlamaktır.',
      },
      {
        baslik: 'Güveni kötüye kullanma',
        govde:
          'Başkasına ait olup da muhafaza etmek üzere zilyetliğine devredilen mal üzerinde, devir amacı dışında tasarrufta bulunarak kendisine veya başkasına yarar sağlamaktır.',
      },
      {
        baslik: 'Rüşvet',
        govde:
          'Bir kamu görevlisinin, görevinin ifasıyla ilgili bir işi yapması veya yapmaması için çıkar sağlaması/sağlanmasıdır (çerçeve).',
      },
    ],
    traps: [
      'Hırsızlık / güveni kötüye kullanma zilyetlik çizgisini karıştırmak.',
      'Dolandırıcılıkta hile unsurunu atlamak.',
      'Yağmayı “korkutarak alma” diye gevşek yazmak — cebir/tehdit + mal.',
      'Kamu suçlarında “kamu görevlisi” unsurunu unutmak.',
      'Etkin pişmanlığı her suçta aynı sanmak — tipe özgü.',
    ],
    keyMadde: [
      'TCK m.141–142 — hırsızlık / nitelikli',
      'TCK m.148–149 — yağma',
      'TCK m.157–158 — dolandırıcılık',
      'TCK m.155 — güveni kötüye kullanma',
      'TCK m.247 vd. — zimmet (çerçeve)',
      'TCK m.250–252 — irtikap / rüşvet (çerçeve)',
      'TCK m.243–244 — bilişim (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Hırsızlık ve yağma',
        paragraphs: [
          'Hırsızlıkta alma + yararlanma maksadı + rıza yokluğu. Nitelikli hâller (gece, konut, silah vb.) listeden yazılır. Etkin pişmanlık özel hükmü vardır.',
          'Yağmada cebir veya tehdit malın alınmasına araçtır. Yağma / hırsızlık + tehdit içtimaı dikkat ister.',
        ],
        hapBilgi: 'Cebir/tehdit var mı? Varsa yağma kutusu.',
      },
      {
        heading: 'B. Dolandırıcılık',
        paragraphs: [
          'Hileli davranış → mağdurun hatası → tasarruf → zarar → failin yararı zinciri kurulur. Basit/nitelikli (kamu kurumları, bilişim sistemleri vb.) ayrılır.',
          'Yalan vaat tek başına yetmeyebilir; hilenin ağırlığı yazılır.',
        ],
        bullets: ['Hile', 'Hata', 'Tasarruf', 'Zarar', 'Yarar'],
      },
      {
        heading: 'C. Güveni kötüye kullanma',
        paragraphs: [
          'Mal rıza ile zilyetliğe bırakılmıştır; fail devir amacına aykırı tasarruf eder. Hırsızlıktan fark: başlangıçta rıza vardır.',
          'Hizmet nedeniyle / ordinary ayrımı ve etkin pişmanlık bilinir.',
        ],
        uyari: 'Rıza ile teslim = güveni kötüye kullanma çizgisi.',
      },
      {
        heading: 'D. Kamu idaresine karşı suçlar',
        paragraphs: [
          'Zimmet, irtikap, rüşvet, görevi kötüye kullanma, ihtilas girişi. Kamu görevlisi ve görevle bağlantı unsurları zorunludur.',
          'Özel–genel norm ilişkisi ve içtima dikkatle yazılır.',
        ],
        kartlar: [
          { baslik: 'Zimmet', govde: 'Görev nedeniyle zilyetlik + mal edinme.' },
          { baslik: 'Rüşvet', govde: 'Görev–çıkar bağı.' },
          { baslik: 'İrtikap', govde: 'İkrah/ comminatory çıkar (çerçeve).' },
          { baslik: 'Görevi kötüye kullanma', govde: 'Genel norm.' },
        ],
      },
      {
        heading: 'E. Adliyeye ve bilişime karşı suçlar girişi',
        paragraphs: [
          'Yalan tanıklık, suç uydurma, delil gizleme gibi adliye suçları; sisteme girme, engelleme, bilişim yoluyla dolandırıcılık girişi tanınır.',
          'Detaylı unsur listeleri güncel TCK’dan doğrulanır; sınavda tip + ana unsur yeterlidir.',
        ],
      },
      {
        heading: 'F. Etkin pişmanlık ve şikâyet',
        paragraphs: [
          'Malvarlığı suçlarında etkin pişmanlık cezada indirim/kaldırma doğurabilir. Bazı suçlar şikâyete bağlıdır — takibi etkiler.',
        ],
      },
      {
        heading: 'G. Genel–özel entegrasyon',
        paragraphs: [
          'Teşebbüs, iştirak, içtima her tipte genel nottan taşınır. “Hırsızlığa teşebbüs + yardım” = özel tip + genel genişleme.',
        ],
      },
    ],
    examples: [
      {
        title: 'Hırsızlık / GKK',
        facts:
          'Komşu ödünç telefonu satar.',
        analysis:
          'Zilyetlik rıza ile devredilmiş. Güveni kötüye kullanma. Hırsızlık değil.',
        takeaway: 'Başta rıza var mı?',
      },
      {
        title: 'Dolandırıcılık',
        facts:
          'Sahte belgeyle kredi alınır; banka zarar eder.',
        analysis:
          'Hile + hata + tasarruf + zarar + yarar. Nitelikli hâl?',
        takeaway: 'Hile zinciri eksiksiz.',
      },
      {
        title: 'Yağma',
        facts:
          'Silah gösterilerek cüzdan alınır.',
        analysis:
          'Tehdit/cebir + mal. Nitelikli yağma. Hırsızlık+tehdit içtimaı değil yağma.',
        takeaway: 'Cebir/tehditle alma = yağma.',
      },
      {
        title: 'Rüşvet',
        facts:
          'Memura işin hızlı bitmesi için para verilir.',
        analysis:
          'Kamu görevlisi + görevle bağlantı + çıkar. Veren/alan. Etkin pişmanlık?',
        takeaway: 'Görev–çıkar bağı.',
      },
    ],
    mindmap: {
      center: 'Ceza Özel · 2. dönem',
      branches: [
        { label: 'Mal', items: ['Hırsızlık', 'Yağma', 'Dolandırıcılık', 'GKK'] },
        { label: 'Kamu', items: ['Zimmet', 'Rüşvet'] },
        { label: 'Diğer', items: ['Adliye', 'Bilişim'] },
        { label: 'Sonuç', items: ['Etkin pişmanlık', 'Şikâyet'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Kişiye karşı suçlardan malvarlığı ve kamu suçlarına kadar tek omurga.',
    promise:
      '1. + 2. dönem birleşik; ceza özel hükümler için “tek cilt” not. Genel iskelet için ceza genel triple’ına bakın.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: kişiye karşı mı, mal/kamu mu?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: öldürme–yaralama–hürriyet → deneme → hırsızlık–dolandırıcılık–kamu → karma.',
          'Her soruda: tip + unsur + genel bağ (teşebbüs/iştirak).',
        ],
        hapBilgi: 'Yıllık başarı = doğru tip + eksiksiz unsur.',
        bullets: [
          'Hafta 1–4: öldürme + yaralama',
          'Hafta 5–7: hürriyet + hakaret + özel hayat',
          'Hafta 8–11: hırsızlık + yağma + dolandırıcılık + GKK',
          'Hafta 12–14: kamu suçları + bilişim + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Öldürmeye teşebbüs. Tip 2 — Tehdit/şantaj. Tip 3 — Hırsızlık/GKK. Tip 4 — Dolandırıcılık. Tip 5 — Yağma. Tip 6 — Rüşvet.',
          'Karma olayda yaralama + yağma üst üste binebilir. İçtima kutusunu genel nottan açın.',
        ],
        uyari: 'Genel hüküm boşsa özel tip cevabı eksik kalır.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Ceza Özel · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Öldürme', 'Yaralama', 'Hürriyet'] },
        { label: '2. yarı', items: ['Mal', 'Kamu', 'Bilişim'] },
        { label: 'Yöntem', items: ['Tip seç', 'Unsur yaz'] },
        { label: 'Genel bağ', items: ['Teşebbüs', 'İştirak'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'ceza-ozel-donem-1': d1Content,
  'ceza-ozel-donem-2': d2Content,
  'ceza-ozel-yillik': yillikContent,
};

export const CEZA_OZEL_VARIANTS = [
  'ceza-ozel-donem-1',
  'ceza-ozel-donem-2',
  'ceza-ozel-yillik',
];

export function buildCezaOzelVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Ceza Özel ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Ceza Hukuku Özel Hükümler ${meta.h1Extra}`;
  const description = `${uni.name} için Ceza Özel ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Ceza Hukuku Özel Hükümler ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: doğru suç tipini seçip unsurlarıyla yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Suç teorisi için Ceza Genel triple notlarını kullanın.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda önce tipi seç',
        'Nitelikli hâlleri listeden yaz',
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
      paragraphs: ['Soru tipine göre dayanaklar. Güncel metin: TCK Özel.'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde no yazmayın; TCK metninden doğrulayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Ceza Özel)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) tip (2) maddi unsur (3) kast (4) nitelik (5) genel bağ (6) ceza.',
      ],
      bullets: [
        'Tipi ilk cümlede yaz',
        'Unsurları numarala',
        'Hırsızlık/GKK zilyetlik çizgisi',
        'Teşebbüs/iştirak bağını unutma',
      ],
      hapBilgi: 'Doğru tip + eksiksiz unsur = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Ceza Özel ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Suç tipini seç',
        'Maddi unsurları yaz',
        'Manevi unsur',
        'Nitelikli hâl',
        'Teşebbüs / iştirak',
        'Ceza / etkin pişmanlık',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'ceza-ozel-donem-2'
          ? [
              ['Hırsızlık', 'Güveni kötüye kullanma', 'Başta rıza var mıydı?'],
              ['Hırsızlık', 'Yağma', 'Cebir/tehdit var mı?'],
              ['Dolandırıcılık', 'Hırsızlık', 'Hile + tasarruf mu alma mı?'],
              ['Zimmet', 'GKK', 'Kamu görevlisi + görev bağı?'],
            ]
          : variantCode === 'ceza-ozel-donem-1'
            ? [
                ['Öldürme', 'Yaralama', 'Netice ölüm mü?'],
                ['Tehdit', 'Şantaj', 'Menfaat temini var mı?'],
                ['Hakaret', 'İftira', 'Suç isnadı mı onur ihlali mi?'],
                ['Öldürmeye teşebbüs', 'Yaralama', 'Kast ölüm mü yaralama mı?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Kişiye karşı mı mal/kamu mu?'],
                ['Hırsızlık', 'GKK', 'Rıza ile zilyetlik?'],
                ['Öldürme', 'Yaralama', 'Netice?'],
                ['Yağma', 'Tehdit', 'Mal alındı mı?'],
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
      leftTitle: 'Kişiye karşı',
      rightTitle: 'Mal / kamu',
      left: 'Öldürme–yaralama–hürriyet–hakaret',
      right: 'Hırsızlık–dolandırıcılık–kamu suçları',
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
      a: '1. dönem kişiye karşı suçlar; 2. dönem malvarlığı ve kamu/adliye/bilişim girişi; yıllık ikisini birleştirir.',
    },
    {
      q: 'Ceza genel ile birlikte mi?',
      a: 'Evet. Teşebbüs, iştirak, kast formları için ceza genel triple notunu açık tutun.',
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
    'Pusula maddeleri TCK’dan doğruladım',
    'PDF’i arşivledim',
    variantCode === 'ceza-ozel-yillik'
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
      `${uni.shortName} ceza özel ${meta.short}`,
      `${uni.shortName} ceza hukuku özel ders notu`,
      `ceza özel ${meta.short} not pdf`,
      'hırsızlık dolandırıcılık öldürme yaralama ders notu',
      'ceza özel yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} ceza özel`),
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
        'Tipi ilk yaz',
        'Unsurları numarala',
        'Nitelikli hâli listeden seç',
        'Genel kutuyu bağla',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Ceza Özel ${meta.short} kapsamındaki suç tiplerini ayırır`,
      'Kişiye karşı suç unsurlarını uygular',
      'Malvarlığı ve kamu suç iskeletini kurar',
      'Genel hükümlerle bağ kurar',
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
    relatedCourses: CEZA_OZEL_VARIANTS.filter((c) => c !== variantCode).concat([
      'ceza-ozel',
      'ceza-genel-yillik',
      'ceza-muhakemesi',
    ]),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: variantCode === 'ceza-ozel-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'ceza-ozel',
    variantLabel: meta.label,
  };
}
