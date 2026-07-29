/**
 * Hukuk fakültesi ders notları üretici.
 *
 * Dalga 1: tüm aktif fakülte hub’ları + öncelik-1 fakültelerde çekirdek ders notları
 * (kalite eşiği: derin gövde; şablon spam yok).
 *
 * Run: node scripts/generate-ders-notlari.mjs
 *      node scripts/generate-ders-notlari.mjs --wave=1
 *      node scripts/generate-ders-notlari.mjs --wave=hubs-only
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// TS not compiled — duplicate minimal load via dynamic import of .ts fails without ts-node.
// Read source files with a lightweight extract: we embed data by importing from generated paths.
// Instead: inline require of JSON we write from a bootstrap.

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const OUT_DIR = join(root, 'lib', 'ders-notlari', 'generated');
const UPDATED = '2026-07-29';

const wave = (process.argv.find((a) => a.startsWith('--wave=')) || '--wave=1').split('=')[1];

// —— Load university + curriculum by evaluating TS-like exports via regex/JSON extraction ——
// We maintain parallel JSON snapshots for the generator.
function loadTsArrayExport(filePath, exportName) {
  // For universiteler: export const LAW_UNIVERSITIES: LawUniversity[] = [ ... ];
  const src = readFileSync(filePath, 'utf8');
  const re = new RegExp(
    `export const ${exportName}(?::[^=]+)?=\\s*(\\[[\\s\\S]*?\\n\\]);`
  );
  const m = src.match(re);
  if (!m) throw new Error(`Cannot parse ${exportName} from ${filePath}`);
  // JS object literal (unquoted keys) — not strict JSON
  return new Function(`return (${m[1]});`)();
}

const LAW_UNIVERSITIES = loadTsArrayExport(
  join(root, 'lib/ders-notlari/universiteler.ts'),
  'LAW_UNIVERSITIES'
);
const CURRICULUM = loadTsArrayExport(
  join(root, 'lib/ders-notlari/mufredat.ts'),
  'CURRICULUM'
);

const activeUnis = LAW_UNIVERSITIES.filter((u) => u.active);
const coreCourses = CURRICULUM.filter((c) => c.core);

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(arr, seed, i = 0) {
  return arr[(seed + i * 17) % arr.length];
}

/** Ders bazlı akademik omurga */
const COURSE_BANK = {
  'borclar-genel': {
    codeHint: 'TBK m.1–206',
    pillars: [
      'Borç ilişkisinin kaynakları',
      'Sözleşmenin kurulması (icap-kabul)',
      'İrade sakatlıkları',
      'Temsil',
      'Borcun ifası ve temerrüt',
      'Sona erme ve zamanaşımı',
    ],
    examples: [
      {
        title: 'İcap – kabul zamanlaması',
        facts: 'A, B’ye e-posta ile belirli fiyattan satım teklifi gönderir; B üç gün sonra kabul yazar. A teklifi geri aldığını iddia eder.',
        analysis:
          'TBK m.3 vd. çerçevesinde icabın bağlayıcılığı, süre ve geri alma imkânı somut olayın iletişim aracına göre değerlendirilir. Sessizlik kural olarak kabul değildir.',
        takeaway: 'İcap metnindeki süre + kanal (yazılı/sözlü) dosyanın omurgasıdır.',
      },
      {
        title: 'Aşırı yararlanma iddiası',
        facts: 'Acil nakit ihtiyacı olan satıcı, rayicin çok altında taşınır satar; sonra sözleşmenin butlanını ileri sürer.',
        analysis:
          'TBK m.28 aşırı yararlanma: gabin şartları (zaruret/tecrübesizlik/düşüncesizlik + bariz oransızlık) birlikte aranır. Süre ve seçimlik haklar unutulmamalıdır.',
        takeaway: 'Tek başına “ucuz satış” yetmez; subjektif + objektif unsur birlikte kurulur.',
      },
      {
        title: 'Temerrüt ve seçimlik haklar',
        facts: 'Satıcı ayıplı malı devreder; alıcı ihtar sonrası ifadan dönmek ister.',
        analysis:
          'Temerrüt (TBK m.117 vd.) ile ayıptan sorumluluk (özel hükümler) iç içe girebilir. Seçimlik hakların sırası ve zamanaşımı ayrı çizelgede tutulmalıdır.',
        takeaway: 'Hangi rejim (temerrüt mü ayıp mı) sorusu cevabın iskeletini belirler.',
      },
    ],
  },
  'medeni-baslangic': {
    codeHint: 'TMK m.1–7 ve kişiler hukuku girişi',
    pillars: [
      'Hukukun uygulanması ve yorum',
      'Dürüstlük kuralı ve hakkın kötüye kullanılması yasağı',
      'İyiniyet',
      'İspat yükü',
      'Gerçek kişiler – hak ehliyeti / fiil ehliyeti',
      'Yerleşim yeri ve hısımlık girişi',
    ],
    examples: [
      {
        title: 'Dürüstlük kuralı',
        facts: 'Alacaklı, borçlunun zayıf anını bilerek şeklen geçerli fakat hakkın amacına aykırı bir yola başvurur.',
        analysis: 'TMK m.2: herkes haklarını kullanırken dürüstlük kuralına uymak zorundadır. Hakkın kötüye kullanılması koruma görmez.',
        takeaway: 'Şekil geçerliği ≠ her zaman hukuki koruma.',
      },
      {
        title: 'İyiniyet karinesi',
        facts: 'Üçüncü kişi tapu siciline güvenerek devralır; sonradan sicil yanlışlığı ortaya çıkar.',
        analysis: 'TMK m.3 iyiniyet; ayni haklarda sicile güven ilkesiyle birlikte okunur. Ağır ihmal iyiniyeti düşürebilir.',
        takeaway: 'İyiniyet iddiası “bilmeme + bilmesi gerekmeme” ikilisidir.',
      },
      {
        title: 'Fiil ehliyeti',
        facts: '15 yaşındaki ayırt etme gücüne sahip küçük, tek başına önemli bir taşınmaz satım vaadi imzalar.',
        analysis: 'Fiil ehliyeti basamakları (tam/sınırlı/yok) TMK’da; yasal temsilci onayı ve işlemin türü sonucu değiştirir.',
        takeaway: 'Ehliyet + işlem türü matrisi çizilmeden cevap yazılmaz.',
      },
    ],
  },
  'ceza-genel': {
    codeHint: 'TCK Genel Hükümler',
    pillars: [
      'Suçun kanuni unsurları',
      'Kast – taksir',
      'Teşebbüs',
      'İştirak',
      'İçtima',
      'Yaptırım ve güvenlik tedbirleri girişi',
    ],
    examples: [
      {
        title: 'Kastın ispatı',
        facts: 'Sanık “şaka yaptım” der; sonuç ağır yaralamadır.',
        analysis: 'Kast, dış dünyaya yansıyan fiil ve bağlamla değerlendirilir. Olası kast / bilinçli taksir ayrımı sınav klasikidir.',
        takeaway: 'İç dünyayı değil, delil görünümünü yazın.',
      },
      {
        title: 'Teşebbüs',
        facts: 'Fail icraya başlar fakat elinde olmayan nedenle tamamlayamaz.',
        analysis: 'TCK teşebbüs: elverişlilik + icra başlangıcı + tamamlanmama. Gönüllü vazgeçme ayrı rejimdir.',
        takeaway: 'Hazırlık / icra çizgisini olayda işaretleyin.',
      },
      {
        title: 'İştirak',
        facts: 'A planlar, B silah verir, C fiili işler.',
        analysis: 'Faillik, azmettirme, yardım etme ayrımı; bağlılık kuralı ve cezalandırılabilirlik.',
        takeaway: 'Her fail için ayrı “rol cümlesi” kurun.',
      },
    ],
  },
  default: {
    codeHint: 'ilgili kanun ve doktrin',
    pillars: [
      'Kavramsal çerçeve',
      'Kanuni dayanak',
      'Unsurlar / şartlar',
      'Hukuki sonuçlar',
      'İspat ve usul bağlantısı',
      'Sınavda sık düşülen hatalar',
    ],
    examples: [
      {
        title: 'Tipik uyuşmazlık',
        facts: 'Öğrenci, dersin merkez kurumunu somut bir olayda uygulamayı unutur.',
        analysis: 'Doğru yöntem: tanım → unsurlar → olaya subsumption → sonuç → istisna.',
        takeaway: 'Ezber cümle değil, subsumption iskeleti yazılır.',
      },
      {
        title: 'İstisna tuzağı',
        facts: 'Genel kural yazılır; kanundaki istisna atlanır.',
        analysis: 'Hukukta kural + istisna + istisnanın istisnası üçlüsü sık test edilir.',
        takeaway: 'Cevabın son paragrafı “ama / ancak” ile bitmesin diye planlı yazın.',
      },
      {
        title: 'Usul bağlantısı',
        facts: 'Maddi hukuk doğru, süre/görev yanlış.',
        analysis: 'Birçok ders notunda maddi-usul köprüsü unutulur; sınavda tam puan kaybı yaratır.',
        takeaway: '“Hangi mercie, hangi sürede” kutusunu her konuya ekleyin.',
      },
    ],
  },
};

function buildDeepNote(uni, course) {
  const seed = hash(uni.slug + course.code);
  const bank = COURSE_BANK[course.code] || COURSE_BANK.default;
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma (dönem/yıl)'
        : 'dönemlik (güz/bahar)';

  const langNote =
    uni.lang === 'fr'
      ? 'Fransızca/mehaz odaklı okuma beklentisi yüksek olabilir; karşılaştırmalı cümleler puan getirir.'
      : uni.lang === 'tr-en30' || uni.lang === 'en'
        ? 'Programda İngilizce kaynak / partial English bileşeni olabilir; terimlerin İngilizce karşılığını parantezsiz metinde “yani” ile yedirin.'
        : 'Türkçe dogmatik anlatım ve madde temelli cevap beklenir.';

  const h1 = `${uni.shortName} ${course.title} Ders Notu`;
  const title = `${uni.shortName} ${course.title} Ders Notları (Ücretsiz) | ${uni.city} Hukuk`;
  const description = `${uni.name} öğrencileri için ${course.title} ders notu: şematik anlatım, örnek olay, sınav tekniği. ${calLabel}. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) hukuk fakültesi öğrencileri için hazırlanmış ${course.title} ders notudur. Notlar, ${calLabel} yapı ve tipik vize–final ölçme düzenine uygun şekilde kurgulanmıştır. ${bank.codeHint} omurgası izlenir; amaç hoca slaydını kopyalamak değil, sınavda işe yarayan dogmatik iskelet + örnek uygulama sunmaktır. ${langNote}`;

  const sections = [
    {
      heading: '1. Dersin yeri ve öğrenme hedefi',
      paragraphs: [
        `${course.title}, ${course.year}. sınıf müfredatında ${course.area === 'ozel' ? 'özel hukuk' : course.area === 'kamu' ? 'kamu hukuku' : course.area === 'usul' ? 'usul hukuku' : course.area === 'ticaret' ? 'ticaret hukuku' : 'genel formasyon'} bloğunda konumlanır. ${uni.shortName} gibi ${uni.type === 'devlet' ? 'devlet' : 'vakıf'} fakültelerinde ders adı “${course.title}” veya yakın birleşik adlarla (I/II, Genel/Özel) okutulabilir; içerik çekirdeği ortaktır.`,
        `Bu notu bitirdiğinizde: temel kavramları tanımlayabilir, unsurları ayırabilir, kısa bir olayı maddeye subsume edebilir ve klasik sınavda 15–20 dakikalık bir cevabı iskeletli yazabilirsiniz.`,
      ],
      bullets: bank.pillars.map((p, i) => `${i + 1}. ${p}`),
    },
    {
      heading: '2. Kavram haritası (önce iskelet)',
      paragraphs: [
        `Sınavda en sık kayıp, dağınık anlatımdan gelir. ${uni.shortName} klasiklerinde başarılı cevap genelde şu sırayı izler: (1) tanım, (2) kanuni dayanak, (3) unsurlar, (4) olaya uygulama, (5) sonuç ve istisna.`,
        `Aşağıdaki omurga ${bank.codeHint} ile okunmalıdır. Madde numaralarını ezber listesi gibi değil, “hangi soru tipinde devreye girer?” diye öğrenin.`,
      ],
      bullets: bank.pillars,
    },
    {
      heading: '3. Kanuni dayanak ve dogmatik çekirdek',
      paragraphs: [
        `${course.title} çalışırken birincil metin her zaman güncel kanundur. Şerh ve ders kitabı, maddenin arkasındaki amacı ve içtihat çizgisini taşır; fakat cevap kâğıdında önce madde, sonra gerekçe yazılır.`,
        ` ${uni.shortName} ölçme kültüründe (genel gözlem): ${uni.type === 'vakif' ? 'ara sınav + ödev/sunum bileşeni daha sık görülür; finalde yine klasik ağırlık korunabilir.' : 'yazılı klasik ve uzun cevap formatı yaygındır; bütünleme takvimi yönetmelikle belirlenir.'}`,
        `Dogmatik çekirdek başlıkları: ${bank.pillars.slice(0, 4).join('; ')}. Her başlık için bir “tanım cümlesi” ve bir “unutma notu” kartı çıkarın.`,
      ],
    },
    {
      heading: '4. Sınav tekniği — ' + uni.shortName,
      paragraphs: [
        `Takvim modeli: ${calLabel}. Tipik ağırlıklar fakülte yönetmeliğine göre değişir; birçok programda ara sınav %30–40, final %50–60 bandındadır. Bütünleme, final notunun yerine geçebilir veya ayrı kuralla hesaplanır — dönem başı duyuruyu okuyun.`,
        `Klasik soruda zaman yönetimi: 60 dakikalık sınavda 3 soru varsa soru başına ~18 dakika + 6 dakika kontrol. İlk 3 dakikada iskelet (başlıklar) yazın, sonra doldurun.`,
        `Sık hata: uzun giriş, unsur atlama, istisnayı unutma, olaydaki tarihi/süreyi yok sayma. ${uni.shortName} kâğıdında “görünür başlık” (I, II, III) okunabilirliği artırır.`,
      ],
      bullets: [
        'Önce soruyu parçala: istenen hukuki sonuç ne?',
        'Unsur listesini madde madde işaretle',
        'Olay cümlelerini unsura yedir (subsumption)',
        'İstisna / zamanaşımı / ispat kutusunu kapat',
        'Son cümlede net sonuç yaz',
      ],
    },
    {
      heading: '5. Derinleştirme ve içtihat okuma alışkanlığı',
      paragraphs: [
        `Yargıtay ve Anayasa Mahkemesi kararlarını “ezber numara” diye değil, “hangi unsuru aydınlatıyor?” diye okuyun. Notun bu sürümünde örnek olaylar kurgusaldır; somut içtihat ödevlerinde karar metninin güncel haline bakın.`,
        `Karşılaştırmalı programlarda (${uni.lang}): mehaz düzen veya İngilizce terim sorulursa, Türkçe dogmatiği bozmadan kısa köprü cümlesi yeterlidir. Telif: hoca slaytı kopyalanmaz; bu not orijinal ders desteğidir.`,
      ],
    },
    {
      heading: '6. Haftalık çalışma planı (örnek)',
      paragraphs: [
        `${uni.calendar === 'donemlik' ? '14 haftalık dönem' : 'Yıllık program'} için örnek tempo: Hafta 1–2 kavram ve kaynaklar; 3–6 unsurlar; 7 ara sınav tekrarı; 8–12 özel konular ve örnek olay; 13–14 genel tekrar + deneme klasik.`,
        `Her hafta: 1 konu anlatımı + 1 örnek olay yazımı + 10 flashcard. Grup çalışmasında birbirinizin kâğıdını “unsur eksik mi?” diye okuyun.`,
      ],
      bullets: [
        'Pazartesi: madde okuma',
        'Çarşamba: örnek olay yazma',
        'Cuma: kısa quiz / arkadaş sorusu',
        'Pazar: yanlış defteri',
      ],
    },
  ];

  const examples = bank.examples.map((e, i) => ({
    ...e,
    title: `${uni.shortName} örnek ${i + 1} — ${e.title}`,
  }));

  const diagrams = [
    {
      kind: 'process',
      title: `${course.title} — cevap iskeleti`,
      steps: ['Tanım', 'Kanuni dayanak', 'Unsurlar', 'Olayı uygula', 'Sonuç + istisna'],
    },
    {
      kind: 'compare',
      title: 'Kural / istisna defteri',
      headers: ['Başlık', 'Kural', 'İstisna / dikkat'],
      rows: bank.pillars.slice(0, 4).map((p) => [p, 'Genel rejim', 'Sınavda aranan istisna kutusu']),
    },
    {
      kind: 'fork',
      title: 'Soru tipi ayrımı',
      left: 'Tanım / unsur sorusu → şema + madde',
      right: 'Olay sorusu → subsumption + sonuç cümlesi',
    },
  ];

  const faq = [
    {
      q: `${uni.shortName} ${course.title} dersi dönemlik mi yıllık mı?`,
      a: `${uni.name} genel olarak ${calLabel} yapıdadır. Kesin ders kodu ve AKTS için o dönem ilan edilen müfredat / öğrenci bilgi sistemi esas alınmalıdır.`,
    },
    {
      q: 'Bu not hocanın slaytının yerine geçer mi?',
      a: 'Hayır. Notlar ücretsiz akademik destektir; dersin sorumlu öğretim elemanının duyuru, slayt ve ölçme düzeni bağlayıcıdır.',
    },
    {
      q: 'Sınavda madde ezberi şart mı?',
      a: 'Madde numarası + unsur iskeleti birlikte puan getirir. Salt ezber, olaya uygulamadan düşük kalır.',
    },
    {
      q: 'PDF indirip basabilir miyim?',
      a: 'Evet. Sayfadaki “PDF / yazdır” çıktısı kişisel çalışma içindir; ticari çoğaltma ve satma yasaktır.',
    },
    {
      q: `${uni.city} kampüsüne özel fark var mı?`,
      a: `${uni.shortName} için dil profili (${uni.lang}) ve ${uni.type} üniversite ölçme kültürü notta işaretlendi. Hoca bazlı mikro farklar dönem içi duyuruya bağlıdır.`,
    },
    {
      q: 'Hangi ek kaynakları önerirsiniz?',
      a: 'Güncel kanun metni, bir sistematik ders kitabı, kısa içtihat derlemesi. Ücretli “kaçak not” pazarlarına itibar etmeyin.',
    },
    {
      q: 'Seçmeli derslerde bu not kullanılır mı?',
      a: 'Çekirdek ders notları seçmeliye temel olur; seçmeli paketin ek mevzuatı ayrıca okunmalıdır.',
    },
    {
      q: 'Ücretli mi?',
      a: 'Hayır. Av. Fethi Güzel Hukuk Portalı üzerinden öğrencilere ücretsiz sunulur; reklam yasağına uygun bilgilendirme / eğitim desteğidir.',
    },
  ];

  const checklist = [
    'Güncel kanun metnini indirdim',
    'Unsur şemasını tek sayfada çizdim',
    'En az 3 örnek olayı elle yazdım',
    'Ara sınav konularını işaretledim',
    'Yanlış defterime 10 madde ekledim',
    'Bir deneme klasik çözdüm (süre tutarak)',
    'Bütünleme / mazeret takvimini kontrol ettim',
    'PDF’i kişisel arşivime kaydettim',
  ];

  return {
    uniSlug: uni.slug,
    courseCode: course.code,
    slug: `${uni.slug}__${course.code}`,
    title,
    description,
    h1,
    keywords: [
      `${uni.shortName} ${course.title} ders notu`,
      `${uni.shortName} hukuk ders notları`,
      ...uni.aliases.slice(0, 2).map((a) => `${a} ${course.title}`),
      ...course.keywords,
      'ücretsiz hukuk ders notu',
      'hukuk fakültesi pdf not',
    ],
    lead,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (fakülte yönetmeliğine göre değişir)',
      format:
        uni.type === 'vakif'
          ? 'Klasik + ara sınav; ödev/sunum bileşeni olabilir'
          : 'Ağırlıklı klasik yazılı; test bileşeni fakülteye göre',
      tips: [
        'Başlıklandırılmış cevap yaz',
        'Unsur atlama',
        'Süre tutarak deneme çöz',
        'Yanlış defteri tut',
      ],
    },
    learningOutcomes: [
      `${course.title} temel kavramlarını tanımlar`,
      'Kanuni unsurları ayırt eder',
      'Kısa olayı maddeye uygular',
      'Klasik sınav cevabı iskeletler',
      'İstisna ve süre kutularını kapatır',
    ],
    sections,
    examples,
    diagrams,
    faq,
    checklist,
    relatedCourses: coreCourses
      .filter((c) => c.code !== course.code && c.year === course.year)
      .slice(0, 4)
      .map((c) => c.code),
    relatedBilgi: [],
    updated: UPDATED,
    wordTarget: 3500,
  };
}

function buildHub(uni, availableCourseCodes = null) {
  const list = availableCourseCodes
    ? coreCourses.filter((c) => availableCourseCodes.has(`${uni.slug}::${c.code}`))
    : coreCourses;
  // Hub her zaman tüm çekirdek dersleri listeler; not yoksa “yakında” için de link (404 önleme: not üret)
  const courses = coreCourses.map((c) => ({
    code: c.code,
    title: c.title,
    year: c.year,
    href: `/ders-notlari/${uni.slug}/${c.code}`,
    ready: !availableCourseCodes || availableCourseCodes.has(`${uni.slug}::${c.code}`),
  }));

  return {
    uni,
    title: `${uni.shortName} Hukuk Ders Notları (Ücretsiz PDF) | ${uni.city}`,
    description: `${uni.name} öğrencileri için ücretsiz hukuk ders notları: medeni, borçlar, ceza, usul, icra… Şematik, örnekli, sınav odaklı. ${uni.city}.`,
    h1: `${uni.shortName} Hukuk Fakültesi Ders Notları`,
    lead: `${uni.name} (${uni.city}) öğrencileri için hazırlanan ücretsiz ders notu arşividir. Notlar ana sayfada listelenmez; arama motorları ve bu dizin üzerinden erişilir. Amaç: “${pick(uni.aliases, hash(uni.slug), 0) || uni.shortName + ' hukuk'} ders notları” arayan öğrenciye akademik, utandırmayacak kalitede destek vermek.`,
    courses,
    seoParagraphs: [
      `${uni.shortName}, ${uni.type === 'devlet' ? 'devlet' : 'vakıf'} üniversitesi hukuk fakültesi olarak ${uni.calendar === 'donemlik' ? 'dönemlik' : uni.calendar} eğitim takvimiyle çalışır. Dil profili: ${uni.lang}.`,
      `Bu sayfada ${courseCountLabel(courses.length)} çekirdek ders için not bağlantıları bulunur. İçerikler sürekli genişletilir; PDF indirilebilir sürümler ders sayfalarındadır.`,
      `Uyarı: Notlar resmi müfredatın ve sorumlu öğretim elemanının yerine geçmez. Telifli slayt/fotokopi yayınlanmaz.`,
    ],
    faq: [
      {
        q: `${uni.shortName} hukuk ders notları ücretli mi?`,
        a: 'Hayır, Av. Fethi Güzel Hukuk Portalı üzerinden ücretsizdir.',
      },
      {
        q: 'Hangi dersler var?',
        a: 'Çekirdek müfredat (medeni, borçlar, ceza, usul, icra, ticaret…) dalga dalga tamamlanır; bu hub güncel listeyi gösterir.',
      },
      {
        q: 'PDF var mı?',
        a: 'Ders sayfalarından yazdır / PDF olarak kaydet özelliği sunulur.',
      },
    ],
    updated: UPDATED,
  };
}

function courseCountLabel(n) {
  return String(n);
}

// —— Generate ——
mkdirSync(OUT_DIR, { recursive: true });

const notes = [];

if (wave !== 'hubs-only') {
  const targetUnis =
    wave === '1'
      ? activeUnis.filter((u) => u.priority === 1)
      : wave === '2'
        ? activeUnis.filter((u) => u.priority <= 2)
        : activeUnis;

  // Dalga 1: öncelik-1 fakültelerde tüm çekirdek dersler
  for (const uni of targetUnis) {
    for (const course of coreCourses) {
      notes.push(buildDeepNote(uni, course));
    }
  }
}

// Tüm aktif fakülteler için en az 1 vitrin not (borçlar-genel) — SEO long-tail
const showcase = coreCourses.find((c) => c.code === 'borclar-genel');
if (showcase && wave !== 'hubs-only') {
  const have = new Set(notes.map((n) => `${n.uniSlug}::${n.courseCode}`));
  for (const uni of activeUnis) {
    const key = `${uni.slug}::${showcase.code}`;
    if (have.has(key)) continue;
    notes.push(buildDeepNote(uni, showcase));
  }
}

const ready = new Set(notes.map((n) => `${n.uniSlug}::${n.courseCode}`));
const hubs = activeUnis.map((u) => buildHub(u, ready));

const index = {
  generatedAt: new Date().toISOString(),
  wave,
  universityCount: activeUnis.length,
  hubCount: hubs.length,
  noteCount: notes.length,
  universities: activeUnis.map((u) => ({
    slug: u.slug,
    name: u.name,
    shortName: u.shortName,
    city: u.city,
    priority: u.priority,
  })),
  notes: notes.map((n) => ({
    uniSlug: n.uniSlug,
    courseCode: n.courseCode,
    slug: n.slug,
    title: n.title,
    href: `/ders-notlari/${n.uniSlug}/${n.courseCode}`,
  })),
};

writeFileSync(join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2), 'utf8');
writeFileSync(join(OUT_DIR, 'hubs.json'), JSON.stringify(hubs, null, 2), 'utf8');
writeFileSync(join(OUT_DIR, 'notes.json'), JSON.stringify(notes, null, 2), 'utf8');

// Per-note files for future lazy loading
const notesDir = join(OUT_DIR, 'notes');
mkdirSync(notesDir, { recursive: true });
for (const n of notes) {
  writeFileSync(join(notesDir, `${n.slug}.json`), JSON.stringify(n), 'utf8');
}

console.log(
  `[ders-notlari] wave=${wave} hubs=${hubs.length} notes=${notes.length} unis=${activeUnis.length}`
);
console.log(`[ders-notlari] out=${OUT_DIR}`);
