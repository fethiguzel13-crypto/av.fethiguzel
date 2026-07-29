/**
 * Anayasa Hukuku —
 * 1. dönem (genel esaslar) / 2. dönem (Türk anayasa düzeni) / yıllık.
 * anayasa-1 + anayasa-2 müfredatıyla hizalı.
 */

function baseMeta(variant) {
  const labels = {
    'anayasa-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu (Genel Esaslar)',
      scope:
        'Anayasa hukuku · 1. yarı (anayasa kavramı, anayasalcılık, hukuk devleti, kuvvetler ayrılığı, temel haklar teorisi)',
    },
    'anayasa-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu (Türk Anayasa Düzeni)',
      scope:
        'Anayasa hukuku · 2. yarı (1982 AY organları, yasama–yürütme–yargı, AYM, bireysel başvuru girişi)',
    },
    'anayasa-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'Anayasa hukuku tam omurga · genel esaslar + Türk anayasa düzeni · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Anayasa nedir, devleti nasıl bağlar, haklar nasıl korunur? Genel esaslar kapısı burada açılır.',
    promise:
      'Anayasa kavramı ve türleri, anayasalcılık, egemenlik, hukuk devleti, kuvvetler ayrılığı, temel hakların genel teorisi ve sınırlama. Güz finalinde “ilke + hak iskeleti” bozulmadan yazarsınız.',
    sixtySecond: [
      'Anayasa: devletin temel organ ve hak düzenini kuran üst norm.',
      'Anayasalcılık: iktidarın hukuka bağlanması.',
      'Hukuk devleti: kanunilik, belirlilik, yargısal denetim.',
      'Kuvvetler ayrılığı: yasama–yürütme–yargı dengesi.',
      'Temel hak: özne, konu, yükümlü, sınırlama rejimi.',
      'Sınırlama: kanun + meşru amaç + ölçülülük (çerçeve).',
    ],
    pillars: [
      'Anayasa kavramı ve işlevleri',
      'Anayasa türleri ve yapım yöntemleri',
      'Anayasalcılık ve egemenlik',
      'Hukuk devleti',
      'Kuvvetler ayrılığı ve hükümet sistemleri girişi',
      'Temel hak ve özgürlükler teorisi',
      'Hakların sınıflandırılması',
      'Sınırlama ve güvence ilkeleri',
    ],
    definitions: [
      {
        baslik: 'Anayasa',
        govde:
          'Devletin kuruluşunu, organlarını, işleyişini ve temel hakları düzenleyen, hukuk düzeninin en üstündeki normlar bütünüdür. Yazılı/yazısız, katı/yumuşak ayrımları bilinir.',
      },
      {
        baslik: 'Anayasalcılık',
        govde:
          'Kamusal iktidarın anayasa ile sınırlanması ve bu sınırların fiilen işlemesi idealidir. Kâğıt üzerindeki anayasa ile canlı anayasa ayrımı tartışılır.',
      },
      {
        baslik: 'Hukuk devleti',
        govde:
          'Devlet organlarının hukuka bağlı, öngörülebilir ve yargısal denetime açık hareket etmesidir. Biçimsel ve maddi hukuk devleti boyutları ayrılır.',
      },
      {
        baslik: 'Kuvvetler ayrılığı',
        govde:
          'Yasama, yürütme ve yargı işlevlerinin farklı organlara verilmesi ve karşılıklı denetim mekanizmalarıyla dengelenmesidir. Sert / yumuşak ayrım bilinir.',
      },
      {
        baslik: 'Ölçülülük',
        govde:
          'Hak sınırlamasında elverişlilik, gereklilik ve orantılılık basamaklarının birlikte aranmasıdır. Sınırlama sınavının kalbidir.',
      },
    ],
    traps: [
      'Anayasayı yalnız “siyasi metin” sanmak — üst norm + yaptırım.',
      'Kuvvetler ayrılığını duvar gibi mutlak sanmak — denge ve işbirliği var.',
      'Hak sınırlamasını “kanun çıktı yeter” diye bitirmek — ölçülülük.',
      'Hukuk devletini yalnız “kanun var”a indirgemek.',
      'Temel hak öznesini her zaman yalnız vatandaş sanmak — insan/yabancı ayrımı olay tipine göre.',
    ],
    keyMadde: [
      'Anayasa — üstünlük ve bağlayıcılık (çerçeve)',
      'AY m.2 — Cumhuriyetin nitelikleri / hukuk devleti',
      'AY m.5 — devletin temel amaç ve görevleri',
      'AY m.10 — eşitlik',
      'AY m.13 — temel hakların sınırlanması (çerçeve; güncel metin)',
      'AY m.14 — kötüye kullanma yasağı (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Anayasa hukuku ne işe yarar?',
        paragraphs: [
          'Devlet iktidarının kurucu çerçevesini ve birey–devlet ilişkisini çizer. 1. dönem genel esasları; 2. dönem 1982 düzeninin organ haritasını taşır.',
          'Sınav iskeleti: kavram → ilke → hak/sınırlama → örnek.',
        ],
        hapBilgi: 'Anayasa = iktidarı bağlayan üst norm.',
      },
      {
        heading: 'B. Anayasa türleri ve yapımı',
        paragraphs: [
          'Yazılı / yazısız, katı / yumuşak, monist / federal bağlamlar. Yapım: kurucu meclis, referandum, olağan değişiklik usulleri (genel teori).',
          'Katılık, kolay değiştirilemezlik ve güvence işlevi görür.',
        ],
        bullets: [
          'Yazılı anayasa',
          'Katı anayasa',
          'Kurucu iktidar / tali kurucu iktidar',
          'Değişiklik usulü (genel)',
        ],
      },
      {
        heading: 'C. Anayasalcılık ve egemenlik',
        paragraphs: [
          'Egemenlik: asli, sürekli, bölünmez tartışmaları; ulusal / halk egemenliği formülleri. Anayasalcılık egemenliği hukuka bağlar.',
          'Meşruiyet: usul, rıza, performans. Sınavda uç ideolojik slogan değil, hukuki çerçeve yazılır.',
        ],
      },
      {
        heading: 'D. Hukuk devleti',
        paragraphs: [
          'Kanunilik, belirlilik, idari işlemlerin yargısal denetimi, temel hak güvenceleri. Sosyal hukuk devleti ile biçimsel hukuk devleti gerilimi bilinir.',
        ],
        kartlar: [
          { baslik: 'Kanunilik', govde: 'Hukuka bağlılık.' },
          { baslik: 'Belirlilik', govde: 'Öngörülebilirlik.' },
          { baslik: 'Denetim', govde: 'Yargı yolu.' },
          { baslik: 'Haklar', govde: 'Maddi boyut.' },
        ],
        hapBilgi: 'Hukuk devleti = bağ + öngörü + denetim.',
      },
      {
        heading: 'E. Kuvvetler ayrılığı',
        paragraphs: [
          'Yasama kural koyar, yürütme uygular, yargı uyuşmazlık çözer — klasik şema. Parlamenter / başkanlık / yarı başkanlık sistemlerinde denge farklı kurulur (giriş).',
          '2. dönemde 1982 organlarıyla somutlaşır.',
        ],
        uyari: 'Sistem adı yetmez; denetim mekanizmasını yaz.',
      },
      {
        heading: 'F. Temel haklar teorisi',
        paragraphs: [
          'Özne, yükümlü (devlet / yatay etki tartışması), koruma alanı, müdahale, sınırlama, güvence. Negatif / pozitif statü hakları girişi.',
          'Eşitlik ilkesi hem bağımsız hak hem kesen ilkedir.',
        ],
      },
      {
        heading: 'G. Sınırlama rejimi',
        paragraphs: [
          'Kanunla sınırlama, Anayasa’nın gösterdiği sebepler, ölçülülük, hakkın özüne dokunmama, laiklik/demokratik toplum düzeni gibi ölçütler (çerçeve, güncel AY).',
          'Sınav zinciri: müdahale var mı → kanun var mı → amaç meşru mu → ölçülü mü?',
        ],
      },
    ],
    examples: [
      {
        title: 'Sınırlama',
        facts:
          'Kanun bir hakkı sınırlar; amaç ve orantı yazılmaz.',
        analysis:
          'Ölçülülük eksik. Sınırlama iskeleti tamamlanmamış.',
        takeaway: 'Kanun + amaç + ölçülülük.',
      },
      {
        title: 'Hukuk devleti',
        facts:
          '“Kanun çıktı, hukuk devletidir” cümlesi.',
        analysis:
          'Biçimsel asgari. Denetim ve hak boyutu eksik.',
        takeaway: 'Üç ayağı yaz.',
      },
      {
        title: 'Kuvvetler',
        facts:
          'Yürütme yargı kararına uymaz; “ayrılık” denir, denetim yok.',
        analysis:
          'Ayrılık + denge. Yargı kararlarına uyma.',
        takeaway: 'Ayrılık denetimsiz olmaz.',
      },
      {
        title: 'Hak öznesi',
        facts:
          'Yabancı, “ben vatandaş değilim hak yok” denir.',
        analysis:
          'İnsan hakları / vatandaş hakları ayrımı. Metin ve konu.',
        takeaway: 'Özneyi metinden kur.',
      },
    ],
    mindmap: {
      center: 'Anayasa · 1. dönem',
      branches: [
        { label: 'Kavram', items: ['Anayasa', 'Anayasalcılık'] },
        { label: 'İlkeler', items: ['Hukuk devleti', 'Kuvvetler'] },
        { label: 'Haklar', items: ['Koruma alanı', 'Sınırlama'] },
        { label: 'Yöntem', items: ['Ölçülülük', 'Güvence'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: 1982 düzeni — yasama, yürütme, yargı ve AYM. Organ haritası burada kurulur.',
    promise:
      '1982 Anayasası’nın organları, yasama–yürütme–yargı, Anayasa Mahkemesi, bireysel başvuru girişi, siyasi partiler ve olağanüstü hâl çerçevesi. Bahar finalinin ağır topu.',
    sixtySecond: [
      '1982 AY: organlar + haklar + değiştirme usulü.',
      'Yasama: TBMM; kanun, CBK ilişkisi (çerçeve).',
      'Yürütme: Cumhurbaşkanı / idare iskeleti (güncel sistem).',
      'Yargı: bağımsızlık, hâkim güvencesi, yargı kolları.',
      'AYM: norm denetimi + bireysel başvuru (giriş).',
      'Olağanüstü hâl: yetki genişler, sınırsız olmaz (çerçeve).',
    ],
    pillars: [
      '1982 Anayasası’nın yapısı',
      'Yasama organı ve işlevleri',
      'Yürütme organı ve idare',
      'Yargı ve bağımsızlık',
      'Anayasa Mahkemesi',
      'Bireysel başvuru girişi',
      'Siyasi partiler ve seçim girişi',
      'Olağanüstü yönetim usulleri',
    ],
    definitions: [
      {
        baslik: 'Norm denetimi',
        govde:
          'Kanun ve diğer denetime tabi normların Anayasa’ya uygunluğunun Anayasa Mahkemesince incelenmesidir. İptal / itiraz yolları bilinir (çerçeve).',
      },
      {
        baslik: 'Bireysel başvuru',
        govde:
          'Anayasa’da güvence altına alınan temel hak ve özgürlükleri ihlal edilenlerin, olağan kanun yollarını tükettikten sonra AYM’ye başvurabilmesidir (çerçeve; şartlar güncel metinden).',
      },
      {
        baslik: 'Yasama yetkisi',
        govde:
          'Genel, asli ve devredilemez nitelikte kural koyma yetkisidir. Yetki devri ve CBK alanları anayasal sınırlara tabidir.',
      },
      {
        baslik: 'Yargı bağımsızlığı',
        govde:
          'Hâkimlerin görevlerinde bağımsız olması; emir ve talimat almaması ilkesidir. Güvence kurumları (HSK vb.) çerçevede anılır.',
      },
      {
        baslik: 'Olağanüstü hâl',
        govde:
          'Anayasa’nın öngördüğü hâllerde temel hakların daha geniş sınırlanabildiği, yetkilerin genişlediği geçici rejimdir. Süre, usul ve yargısal denetim yazılır.',
      },
    ],
    traps: [
      'Organ listesini ezberleyip işlev yazmamak.',
      'CBK ile kanunu aynı sanmak — alan ve sınır.',
      'Bireysel başvuruyu her uyuşmazlığa açmak — hak + yol tüketme.',
      'AYM’yi “üst temyiz” sanmak — anayasal denetim.',
      'OHAL’i “anayasa askıya alındı” diye okumak — sınırlı rejim.',
    ],
    keyMadde: [
      'AY — yasama (TBMM) hükümleri (çerçeve)',
      'AY — yürütme / Cumhurbaşkanı (çerçeve; güncel sistem)',
      'AY — yargı ve bağımsızlık (çerçeve)',
      'AY — Anayasa Mahkemesi (çerçeve)',
      'AY — bireysel başvuru (çerçeve)',
      'AY — olağanüstü hâl (çerçeve; güncel metin)',
    ],
    sectionsExtra: [
      {
        heading: 'A. 1982 düzenine giriş',
        paragraphs: [
          'Başlangıç, genel esaslar, temel haklar, organlar, değiştirme. 1. dönem ilkeleri burada somut organ ve usule bağlanır.',
          'Sınavda: “hangi organ, hangi yetki, hangi denetim?”',
        ],
        hapBilgi: 'Organ + yetki + denetim üçlüsü.',
      },
      {
        heading: 'B. Yasama',
        paragraphs: [
          'TBMM yapısı, yasama dokunulmazlığı, kanun yapımı, bütçe, meclis araştırması/soruşturması (çerçeve). Kanun–CBK ilişkisi ve yetki alanları güncel metinden doğrulanır.',
        ],
        kartlar: [
          { baslik: 'Kanun', govde: 'TBMM iradesi.' },
          { baslik: 'CBK', govde: 'Anayasal alan + sınır.' },
          { baslik: 'Denetim', govde: 'AYM / siyasi denetim.' },
          { baslik: 'Dokunulmazlık', govde: 'İşlevsel güvence.' },
        ],
      },
      {
        heading: 'C. Yürütme',
        paragraphs: [
          'Cumhurbaşkanlığı hükümet sistemi çerçevesinde yürütme tek başlı yapı ve idare (güncel). Atama, kararname, idarenin kanuniliği.',
          'Uydurma organ şeması yazma; güncel AY’ye uy.',
        ],
        uyari: 'Eski parlamenter şemayı ezbere yapıştırma; güncel sistemi yaz.',
      },
      {
        heading: 'D. Yargı',
        paragraphs: [
          'Adli, idari, anayasa yargısı. Bağımsızlık ve tarafsızlık. Hâkimlik teminatı. Uyuşmazlık mahkemesi fikri.',
        ],
      },
      {
        heading: 'E. Anayasa Mahkemesi',
        paragraphs: [
          'Norm denetimi: iptal ve itiraz. Biçim / esas. Yürürlüğün durdurulması (çerçeve). Siyasi parti kapatma vb. özel yetkiler çerçevede anılır.',
          'Kararların bağlayıcılığı ve yasama–yürütmeye etkisi yazılır.',
        ],
        hapBilgi: 'AYM = anayasaya uygunluk denetimi (esas işlev).',
      },
      {
        heading: 'F. Bireysel başvuru girişi',
        paragraphs: [
          'Hak ihlali iddiası, yol tüketme, süre, kabul edilebilirlik. Esastan inceleme ve ihlal kararı. AİHM ile ilişki (ikincillik) bir cümleyle bağlanır.',
          'Detay insan hakları dersinde derinleşir; burada kapı ve şart iskeleti yeter.',
        ],
      },
      {
        heading: 'G. OHAL ve siyasi hayat girişi',
        paragraphs: [
          'OHAL ilanı, süre, CBK/kanun ilişkisi, hak sınırlama rejimi, yargısal denetim imkânı (çerçeve). Siyasi partiler ve seçim hukuku giriş düzeyinde tanınır.',
        ],
      },
    ],
    examples: [
      {
        title: 'Norm denetimi',
        facts:
          'Kanun maddesi Anayasa’ya aykırı iddiası; mahkeme itiraz yoluna başvurur.',
        analysis:
          'İtiraz. AYM. Esas/biçim. Sonuç.',
        takeaway: 'Denetim yolunu seç.',
      },
      {
        title: 'Bireysel başvuru',
        facts:
          'Dava bitmeden AYM’ye gidilir.',
        analysis:
          'Yol tüketme. Kabul edilemezlik riski.',
        takeaway: 'Önce olağan yollar.',
      },
      {
        title: 'CBK–kanun',
        facts:
          'CBK, kanunun açıkça düzenlediği alanda çelişir.',
        analysis:
          'Alan sınırı. Hiyerarşi / aykırılık. AYM denetimi.',
        takeaway: 'Alan + aykırılık yaz.',
      },
      {
        title: 'OHAL',
        facts:
          '“OHAL’de her şey serbest” iddiası.',
        analysis:
          'Sınırlı rejim. Süre. Denetim. Ölçülülük.',
        takeaway: 'OHAL sınırsız iktidar değildir.',
      },
    ],
    mindmap: {
      center: 'Anayasa · 2. dönem',
      branches: [
        { label: 'Yasama', items: ['TBMM', 'Kanun', 'CBK'] },
        { label: 'Yürütme', items: ['CB', 'İdare'] },
        { label: 'Yargı', items: ['Bağımsızlık', 'Kollar'] },
        { label: 'AYM', items: ['Norm', 'Bireysel'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Genel esaslardan 1982 organlarına, hak sınırlamasından AYM’ye tek omurga.',
    promise:
      '1. + 2. dönem birleşik; anayasa hukuku için “tek cilt” not. İlke + Türk anayasa düzeni.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: ilke/hak mı, organ/denetim mi?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: anayasa/anayasalcılık → hukuk devleti/kuvvetler → hak/sınırlama → organlar → AYM → karma.',
          'Her soruda: “İlke mi organ mı? Hak mı denetim mi?”',
        ],
        hapBilgi: 'Yıllık başarı = ilke dili + organ haritası + ölçülülük.',
        bullets: [
          'Hafta 1–3: anayasa kavramı + anayasalcılık + hukuk devleti',
          'Hafta 4–6: kuvvetler + temel haklar + sınırlama',
          'Hafta 7–10: yasama–yürütme–yargı',
          'Hafta 11–14: AYM + bireysel başvuru + OHAL + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Hukuk devleti. Tip 2 — Hak sınırlama. Tip 3 — Kuvvetler ayrılığı. Tip 4 — Yasama/CBK. Tip 5 — AYM norm denetimi. Tip 6 — Bireysel başvuru.',
          'Karma soruda önce ilke, sonra organ, en sonda denetim yolu. Güncel 1982 metnini doğrula; eski sistem şemasını yapıştırma.',
        ],
        uyari: 'Genel esas ile organ cevabını karıştırma; kutuyu seç.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Anayasa · Yıllık',
      branches: [
        { label: '1. yarı', items: ['İlkeler', 'Haklar', 'Sınırlama'] },
        { label: '2. yarı', items: ['Organlar', 'AYM', 'OHAL'] },
        { label: 'Yöntem', items: ['Ölçülülük', 'Denetim'] },
        { label: 'Köprü', items: ['m.2', 'm.13'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'anayasa-donem-1': d1Content,
  'anayasa-donem-2': d2Content,
  'anayasa-yillik': yillikContent,
};

export const ANAYASA_VARIANTS = [
  'anayasa-donem-1',
  'anayasa-donem-2',
  'anayasa-yillik',
];

export function buildAnayasaVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Anayasa Hukuku ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Anayasa Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için Anayasa Hukuku ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Anayasa Hukuku ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: anayasal ilkeleri, hak sınırlamasını ve 1982 organ–denetim haritasını sınavda bozmadan yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. anayasa-1 (genel esaslar) ve anayasa-2 (Türk düzeni) müfredatına hizalıdır.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her soruda: ilke mi organ mı?',
        'Hak sorularında ölçülülük zincirini yaz',
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
        '1982 Anayasası ana kaynaktır. Madde yazacaksanız güncel metinden doğrulayın; uydurma yasak.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Eski hükümet sistemi şemasını güncel AY’ye yapıştırmayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Anayasa Hukuku)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık işe yarar. Hak sorularında ölçülülük; organ sorularında yetki + denetim yazın.`,
        'İskelet: (1) kavram/ilke (2) anayasal dayanak (3) organ/usul (4) denetim (5) sonuç.',
      ],
      bullets: [
        'İlke ile organı karıştırma',
        'Sınırlamada ölçülülüğü yaz',
        'AYM yolunu net seç',
        'Güncel yürütme sistemini kullan',
      ],
      hapBilgi: 'İlke + organ + denetim = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Anayasa Hukuku ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Kavram / ilke',
        'Anayasal dayanak',
        'Organ veya hak',
        'Sınırlama / yetki',
        'Denetim yolu',
        'Sonuç',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'anayasa-donem-2'
          ? [
              ['Kanun', 'CBK', 'Hangi organ / hangi alan?'],
              ['Norm denetimi', 'Bireysel başvuru', 'Norm mu hak ihlali mi?'],
              ['İptal davası', 'İtiraz yolu', 'Kim / nasıl başvurur?'],
              ['OHAL', 'Olağan dönem', 'Yetki ve sınır rejimi?'],
            ]
          : variantCode === 'anayasa-donem-1'
            ? [
                ['Hukuk devleti', 'Demokrasi', 'Bağlılık mı çoğunluk mu?'],
                ['Kuvvetler ayrılığı', 'Kuvvetler birliği', 'Denetim var mı?'],
                ['Hak', 'Sınırlama', 'Koruma alanı mı müdahale mi?'],
                ['Anayasa', 'Kanun', 'Hangi norm üstün?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'İlke/hak mı organ/denetim mi?'],
                ['Genel esas', 'Türk düzeni', 'Teori mi 1982 organı mı?'],
                ['Sınırlama', 'Norm denetimi', 'Hak mı norm uygunluğu mu?'],
                ['AYM', 'AİHM', 'İç denetim mi uluslararası mı?'],
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
      leftTitle: 'Genel esaslar / haklar',
      rightTitle: 'Organlar / denetim',
      left: 'Hukuk devleti–kuvvetler–sınırlama',
      right: 'Yasama–yürütme–AYM–bireysel başvuru',
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
      a: '1. dönem genel esaslar (anayasa-1): kavram, hukuk devleti, kuvvetler, hak teorisi. 2. dönem Türk anayasa düzeni (anayasa-2): organlar, AYM, OHAL. Yıllık ikisini birleştirir.',
    },
    {
      q: 'Hükümet sistemi hangi şemayla yazılmalı?',
      a: 'Güncel 1982 Anayasası ve yürürlükteki Cumhurbaşkanlığı hükümet sistemi çerçevesiyle. Eski parlamenter şemayı güncel cevap gibi sunmayın.',
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
    'Ölçülülük ve AYM yollarını denedim',
    'PDF’i arşivledim',
    variantCode === 'anayasa-yillik'
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
      `${uni.shortName} anayasa hukuku ${meta.short}`,
      `${uni.shortName} anayasa ders notu`,
      `anayasa hukuku ${meta.short} not pdf`,
      'hukuk devleti temel haklar AYM',
      'anayasa hukuku yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} anayasa hukuku`),
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
        'İlke / organ kutusunu seç',
        'Hak sorularında ölçülülük yaz',
        'Güncel yürütme sistemini kullan',
        'AYM yolunu net belirt',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Anayasa hukuku ${meta.short} ilkelerini ayırır`,
      'Temel hak sınırlama rejimini uygular',
      '1982 organ haritasını kurar',
      'AYM ve bireysel başvuru kapısını tanır',
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
    relatedCourses: ANAYASA_VARIANTS.filter((c) => c !== variantCode).concat([
      'anayasa-1',
      'anayasa-2',
      'hukuka-giris-yillik',
      'insan-haklari',
      'idare-hukuku-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'anayasa-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'anayasa',
    variantLabel: meta.label,
  };
}
