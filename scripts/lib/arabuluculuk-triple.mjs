/**
 * Arabuluculuk Hukuku —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * arabuluculuk dersiyle hizalı (mufredat: year 4, seçmeli).
 */

function baseMeta(variant) {
  const labels = {
    'arabuluculuk-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'Arabuluculuk · 1. yarı (kavram, ilkeler, arabulucu, süreç, gönüllü/zorunlu, dava şartı girişi)',
    },
    'arabuluculuk-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'Arabuluculuk · 2. yarı (anlaşma belgesi, icra, iş–ticari dava şartı, aile/tüketici girişi, etik–sır)',
    },
    'arabuluculuk-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'Arabuluculuk tam omurga · süreç + dava şartı + anlaşma/icra · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Arabuluculuk nedir, kim yönetir, süreç nasıl işler? ADR kapısı burada açılır.',
    promise:
      'Arabuluculuk kavramı ve ilkeleri, arabulucu sıfatı, başvuru ve süreç, gönüllü/zorunlu ayrımı, dava şartı arabuluculuğa giriş. Güz finalinde “ilke + süreç + kapsam” bozulmadan yazarsınız.',
    sixtySecond: [
      'Arabuluculuk: tarafların, arabulucu eşliğinde uyuşmazlığı kendilerinin çözmesi.',
      'İlkeler: iradi, eşitlik, gizlilik, tarafsızlık, doğruluk.',
      'Arabulucu: çözüm dayatmaz; süreci yönetir.',
      'Gönüllü / zorunlu (dava şartı) ayrımı kritiktir.',
      'Süreç: başvuru → oturum → sona erme.',
      'Dava açmadan önce zorunlu alanlarda arabuluculuk kapısı (çerçeve).',
    ],
    pillars: [
      'Arabuluculuğun tanımı ve ADR içindeki yeri',
      'Temel ilkeler',
      'Arabulucu: nitelik, yetki, yasaklar',
      'Başvuru ve süreç aşamaları',
      'Gönüllü arabuluculuk',
      'Zorunlu / dava şartı arabuluculuk (giriş)',
      'Kapsam: hangi uyuşmazlıklar?',
      'Arabuluculuk–mahkeme–tahkim ayrımı',
    ],
    definitions: [
      {
        baslik: 'Arabuluculuk',
        govde:
          'Sistematik teknikler uygulayan, uzmanlık eğitimi almış bir arabulucunun katılımıyla, uyuşmazlık taraflarının kendi çözümlerini oluşturmalarını sağlayan gönüllü uyuşmazlık çözüm yöntemidir (kanun çerçevesi).',
      },
      {
        baslik: 'Arabulucu',
        govde:
          'Tarafları bir araya getiren, iletişimi kolaylaştıran, çözüm dayatmayan tarafsız üçüncü kişidir. Sicile kayıt ve eğitim şartları aranır (güncel rejim).',
      },
      {
        baslik: 'Dava şartı arabuluculuk',
        govde:
          'Kanunun öngördüğü uyuşmazlıklarda dava açılmadan önce arabuluculuğa başvurulmasının zorunlu olduğu rejimdir. Başvurulmaması dava şartı eksikliğidir.',
      },
      {
        baslik: 'Gizlilik',
        govde:
          'Arabuluculukta paylaşılan bilgi ve belgelerin, kanuni istisnalar dışında açıklanmamasıdır. Süreç güveninin temelidir.',
      },
      {
        baslik: 'İradi olma',
        govde:
          'Tarafların sürece katılma, devam etme ve anlaşmaya varma iradelerinin esas olmasıdır. Zorunlu başvuru, zorunlu anlaşma demek değildir.',
      },
    ],
    traps: [
      'Arabulucuyu hâkim / tahkim hakemi sanmak — karar dayatmaz.',
      'Zorunlu başvuruyu “anlaşmak zorunda” sanmak.',
      'Gizliliği mutlak sanmak — kanuni istisnalar.',
      'Her uyuşmazlığı dava şartı sanmak — kapsam listesi.',
      'Tahkim ile arabuluculuğu eşitlemek.',
    ],
    keyMadde: [
      '6325 s. Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu (HUAK) — çerçeve',
      'HUAK — ilkeler, arabulucu, süreç (güncel metin)',
      'HUAK / özel kanunlar — dava şartı alanları (iş, ticari vb.; güncel liste)',
      'HMK — dava şartı ve usul köprüsü (çerçeve)',
      'İş Mahkemeleri Kanunu — iş arabuluculuğu (çerçeve)',
      'TTK / ilgili mevzuat — ticari dava şartı (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Arabuluculuk nedir?',
        paragraphs: [
          'Yargıya alternatif, taraf odaklı çözüm. Amaç: hızlı, düşük maliyetli, ilişkileri koruyan anlaşma imkânı. 1. dönem kavram ve süreç omurgasını taşır; anlaşma belgesi ve özel dava şartı alanları 2. dönemde derinleşir.',
        ],
        hapBilgi: 'Arabulucu yönetir; çözümü taraflar üretir.',
      },
      {
        heading: 'B. Temel ilkeler',
        paragraphs: [
          'İradi olma, eşitlik, gizlilik, tarafsızlık/bağımsızlık, doğruluk ve dürüstlük. İlke ihlali sürecin ve belgenin değerini sarsar.',
          'Sınavda her ilkeyi bir cümle örnekle bağla.',
        ],
        bullets: [
          'İradi olma',
          'Eşitlik',
          'Gizlilik',
          'Tarafsızlık',
          'Dürüstlük',
        ],
      },
      {
        heading: 'C. Arabulucu',
        paragraphs: [
          'Hukuk fakültesi mezuniyeti + arabuluculuk eğitimi + sicil (çerçeve; güncel şartlar). Yasaklılık ve ret sebepleri bilinir.',
          'Yetki: süreci yönetmek, özel oturum (caucus) düzenlemek; karar vermemek.',
        ],
        kartlar: [
          { baslik: 'Sıfat', govde: 'Sicile kayıtlı arabulucu.' },
          { baslik: 'Rol', govde: 'Kolaylaştırıcı.' },
          { baslik: 'Yasak', govde: 'Taraflı davranma.' },
          { baslik: 'Sır', govde: 'Gizlilik borcu.' },
        ],
      },
      {
        heading: 'D. Süreç aşamaları',
        paragraphs: [
          'Başvuru (büro/arabulucu), görevlendirme, ilk oturum, müzakere, sona erme (anlaşma / anlaşamama / vazgeçme). Süreler dava şartı alanlarında özel önem taşır.',
          'Tutanak ve son tutanak ispat ve sonraki dava için kritiktir.',
        ],
        uyari: 'Süreleri uydurma; HUAK ve özel kanundan doğrula.',
      },
      {
        heading: 'E. Gönüllü ve zorunlu',
        paragraphs: [
          'Gönüllü: taraflar isterse. Zorunlu/dava şartı: kanun listesi. Zorunluluk başvuruya; anlaşmaya zorlama yok.',
          'Dava şartı eksikliğinde usul sonucu: dava açılırsa ret/süre (güncel usul).',
        ],
        hapBilgi: 'Zorunlu başvuru ≠ zorunlu anlaşma.',
      },
      {
        heading: 'F. Kapsam girişi',
        paragraphs: [
          'Özel hukuk uyuşmazlıkları esastır; ceza ve bazı kamu konuları dışındadır (çerçeve). İş ve ticari uyuşmazlıklarda dava şartı rejimleri 2. dönemde ayrı işlenir.',
        ],
      },
      {
        heading: 'G. ADR haritası',
        paragraphs: [
          'Arabuluculuk ≠ tahkim (bağlayıcı karar) ≠ uzlaştırma (ceza) ≠ sulh (mahkeme içi). Karşılaştırma tablosu sınavda puan getirir.',
        ],
      },
    ],
    examples: [
      {
        title: 'Rol karışıklığı',
        facts:
          'Arabulucu “şu rakamı kabul edin” diye dayatır.',
        analysis:
          'Tarafsızlık ve iradi ilke. Rol aşımı. Süreç sakatlığı riski.',
        takeaway: 'Dayatma yok; kolaylaştırma var.',
      },
      {
        title: 'Dava şartı',
        facts:
          'İşçi alacağı davası doğrudan açılır; arabuluculuk yok.',
        analysis:
          'Dava şartı eksikliği. Usul sonucu. Başvuru zorunluluğu.',
        takeaway: 'Önce kapsam listesi.',
      },
      {
        title: 'Gizlilik',
        facts:
          'Taraf, oturumda söylenen teklifi sonradan mahkemede delil yapar.',
        analysis:
          'Gizlilik ilkesi. İstisna var mı? Genel kural koruma.',
        takeaway: 'Süreç sırdır (istisnalarla).',
      },
      {
        title: 'Gönüllü süreç',
        facts:
          'Taraflardan biri oturuma gelmez; arabulucu karar verir.',
        analysis:
          'Karar yetkisi yok. Süreç sona erer. Anlaşamama tutanağı.',
        takeaway: 'Yokluk = dayatma hakkı vermez.',
      },
    ],
    mindmap: {
      center: 'Arabuluculuk · 1. dönem',
      branches: [
        { label: 'İlkeler', items: ['İradi', 'Gizlilik', 'Tarafsızlık'] },
        { label: 'Aktör', items: ['Arabulucu', 'Taraflar'] },
        { label: 'Süreç', items: ['Başvuru', 'Oturum', 'Tutanak'] },
        { label: 'Tür', items: ['Gönüllü', 'Dava şartı'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Anlaşma belgesi, icra ve dava şartı alanları. Sonuç ve yaptırım burada.',
    promise:
      'Anlaşma belgesi ve icra edilebilirlik, iş ve ticari dava şartı, aile–tüketici girişi, ücret, etik ve sır, başarısız süreç sonrası dava. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Anlaşma belgesi: taraflar + arabulucu imzası; icra edilebilirlik yolu.',
      'İcra edilebilirlik şerhi / mahkeme (çerçeve; güncel usul).',
      'İş arabuluculuğu: dava şartı klasik alan.',
      'Ticari arabuluculuk: belirli ticari davalar (çerçeve).',
      'Anlaşamama: tutanak + dava yolu açılır.',
      'Etik: çıkar çatışması, sır, reklam sınırları.',
    ],
    pillars: [
      'Anlaşma belgesinin hukuki niteliği',
      'İcra edilebilirlik',
      'İş uyuşmazlıklarında arabuluculuk',
      'Ticari dava şartı arabuluculuk',
      'Diğer özel alanlar (aile, tüketici girişi)',
      'Ücret ve giderler',
      'Etik, sır ve disiplin',
      'Süreç sonrası yargılama',
    ],
    definitions: [
      {
        baslik: 'Anlaşma belgesi',
        govde:
          'Tarafların arabuluculuk sonunda vardıkları çözümü yazdıkları belgedir. Kanunî şartları taşıması icra ve ispat bakımından önemlidir.',
      },
      {
        baslik: 'İcra edilebilirlik',
        govde:
          'Anlaşma belgesinin, kanunun öngördüğü usulle ilam niteliği kazanarak cebri icraya konu olabilmesidir (şerh/mahkeme yolu — güncel metin).',
      },
      {
        baslik: 'Son tutanak',
        govde:
          'Sürecin anlaşma, anlaşamama veya başka nedenle sona erdiğini gösteren belgedir. Dava şartı ispatında ve sürelerde işlev görür.',
      },
      {
        baslik: 'İş arabuluculuğu',
        govde:
          'İşçi–işveren uyuşmazlıklarında, kanunun öngördüğü hâllerde dava açmadan önce başvurulması zorunlu arabuluculuk rejimidir.',
      },
      {
        baslik: 'Çıkar çatışması',
        govde:
          'Arabulucunun tarafsızlığını zedeleyebilecek kişisel, mesleki veya ekonomik bağdır. Red/çekilme sebebidir.',
      },
    ],
    traps: [
      'Anlaşma belgesini her hâlde ilam sanmak — icra edilebilirlik usulü.',
      'İş ve ticari dava şartı listesini ezbere uydurmak.',
      'Anlaşamama tutanağı olmadan “başvurdum” demek.',
      'Arabulucunun sır saklama borcunu yok saymak.',
      'Aile/ceza alanlarını iş arabuluculuğu gibi genellemek.',
    ],
    keyMadde: [
      'HUAK — anlaşma belgesi ve icra (çerçeve; güncel metin)',
      'İş Mahkemeleri K. / ilgili — iş dava şartı arabuluculuk',
      'TTK / HUAK — ticari dava şartı (çerçeve)',
      'HMK — dava şartı sonuçları',
      'Arabuluculuk asgari ücret tarifesi (çerçeve; güncel tarife)',
      'Etik kurallar / yönetmelik (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Anlaşma belgesi',
        paragraphs: [
          'Kim imzalar, ne yazılır, ekler nelerdir? Belirsiz ifade icrada sorun çıkarır. Avukat/temsil yetkisi kontrol edilir.',
          'Kısmi anlaşma mümkündür; kalan kısım yargıya kalır.',
        ],
        hapBilgi: 'Anlaşma = açık edim + imza + usul.',
      },
      {
        heading: 'B. İcra edilebilirlik',
        paragraphs: [
          'Kanunî yol: arabulucunun şerhi veya mahkeme (güncel usule göre). Şerh sonrası ilamlı icra imkânı tartışılır.',
          'Sınavda: “anlaşma var → icra yolu → şartlar” zinciri. Uydurma merci yazma.',
        ],
        kartlar: [
          { baslik: 'Belge', govde: 'Anlaşma metni.' },
          { baslik: 'Usul', govde: 'Şerh / mahkeme.' },
          { baslik: 'Sonuç', govde: 'İcra kabiliyeti.' },
          { baslik: 'İtiraz', govde: 'Geçersizlik iddiası.' },
        ],
      },
      {
        heading: 'C. İş arabuluculuğu',
        paragraphs: [
          'İşçilik alacakları ve işe iade gibi tipik alanlar (güncel kapsam). Süre, başvuru mercisi, anlaşamama sonrası dava süresi kritiktir.',
          'Toplu iş hukuku / grev vb. ayrı rejim; karıştırma.',
        ],
        uyari: 'İş listesini ve süreleri güncel kanundan doğrula.',
      },
      {
        heading: 'D. Ticari dava şartı',
        paragraphs: [
          'Belirli ticari davalar için arabuluculuk dava şartı olabilir (TTK/HUAK çerçevesi). Konu ve miktar/ nitelik şartları değişebilir.',
          'Ticari sıfat ve dava türü ilk cümlede yazılır.',
        ],
      },
      {
        heading: 'E. Diğer alanlar girişi',
        paragraphs: [
          'Aile arabuluculuğu, tüketici, kira vb. özel tartışmalar ve gönüllü modeller. Her alanı iş arabuluculuğu kalıbına sokma.',
        ],
      },
      {
        heading: 'F. Ücret, etik, sır',
        paragraphs: [
          'Ücret tarifesi ve paylaşım. Reklam ve unvan kullanımı sınırları. Sır saklama ve tanıklık yasakları (istisnalarla).',
          'Çıkar çatışmasında çekilme.',
        ],
        hapBilgi: 'Etik ihlal = süreç güveni biter.',
      },
      {
        heading: 'G. Süreç sonrası dava',
        paragraphs: [
          'Anlaşamama tutanağı + dava açma. Zamanaşımı / hak düşürücü sürelerin arabuluculukta durması/kesilmesi (güncel rejim). Gizlilik nedeniyle delil kullanımı sınırlıdır.',
        ],
      },
    ],
    examples: [
      {
        title: 'İcra',
        facts:
          'Anlaşma belgesi var; taraf ödemez; alacaklı doğrudan haciz ister, usul atlanır.',
        analysis:
          'İcra edilebilirlik usulü. Şerh/mahkeme. İlamlı icra.',
        takeaway: 'Önce icra kabiliyeti usulü.',
      },
      {
        title: 'İş dava şartı',
        facts:
          'Kıdem tazminatı davası; arabuluculuk dosyası yok.',
        analysis:
          'Dava şartı. Usul ret riski. Başvuru zorunluluğu.',
        takeaway: 'İşte kapı arabuluculuk olabilir.',
      },
      {
        title: 'Kısmi anlaşma',
        facts:
          'Taraflar alacağın bir kısmında anlaşır; kalanı için dava.',
        analysis:
          'Kısmi anlaşma geçerli. Kalan uyuşmazlık yargıda.',
        takeaway: 'Kısmi sonuç mümkündür.',
      },
      {
        title: 'Çıkar çatışması',
        facts:
          'Arabulucu, taraflardan birinin eski avukatıdır; söylemez.',
        analysis:
          'Tarafsızlık. Çekilme/ret. Süreç sakatlığı.',
        takeaway: 'Bağ açıklanır veya çekilinir.',
      },
    ],
    mindmap: {
      center: 'Arabuluculuk · 2. dönem',
      branches: [
        { label: 'Sonuç', items: ['Anlaşma', 'İcra'] },
        { label: 'Alan', items: ['İş', 'Ticari'] },
        { label: 'Etik', items: ['Sır', 'Çıkar'] },
        { label: 'Sonra', items: ['Tutanak', 'Dava'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: İlkelerden dava şartına, süreçten anlaşma ve icraya tek omurga.',
    promise:
      '1. + 2. dönem birleşik; arabuluculuk hukuku için “tek cilt” not. Süreç + zorunluluk + sonuç.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: ilke/süreç mi, dava şartı/anlaşma-icra mı?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: ilkeler–süreç → gönüllü/zorunlu → iş/ticari → anlaşma/icra → karma.',
          'Her soruda: “Zorunlu mu? Süreç tamam mı? Anlaşma/icra mı?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru kapsam + doğru tutanak + doğru sonuç.',
        bullets: [
          'Hafta 1–3: kavram + ilkeler + arabulucu',
          'Hafta 4–6: süreç + gönüllü/zorunlu',
          'Hafta 7–10: iş + ticari dava şartı',
          'Hafta 11–14: anlaşma–icra–etik + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — İlke ihlali. Tip 2 — Dava şartı eksikliği. Tip 3 — Süreç/tutanak. Tip 4 — Anlaşma belgesi. Tip 5 — İcra. Tip 6 — İş/ticari kapsam.',
          'Karma olayda önce kapsam (zorunlu mu), sonra süreç, en sonda anlaşma/icra veya dava. Uydurma süre ve liste yazma.',
        ],
        uyari: 'Tahkim / uzlaştırma ile karıştırma.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Arabuluculuk · Yıllık',
      branches: [
        { label: '1. yarı', items: ['İlke', 'Süreç', 'Zorunlu'] },
        { label: '2. yarı', items: ['Anlaşma', 'İcra', 'İş/ticari'] },
        { label: 'Aktör', items: ['Arabulucu', 'Taraf'] },
        { label: 'Yöntem', items: ['Kapsam seç', 'Tutanak tut'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'arabuluculuk-donem-1': d1Content,
  'arabuluculuk-donem-2': d2Content,
  'arabuluculuk-yillik': yillikContent,
};

export const ARABULUCULUK_VARIANTS = [
  'arabuluculuk-donem-1',
  'arabuluculuk-donem-2',
  'arabuluculuk-yillik',
];

export function buildArabuluculukVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Arabuluculuk ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Arabuluculuk Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için Arabuluculuk ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Arabuluculuk Hukuku ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: ilkeler, süreç, dava şartı ve anlaşma–icra zincirini sınavda bozmadan yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. HUAK omurgadır; iş ve ticari dava şartı özel kanunlarla bağlanır.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: zorunlu mu gönüllü mü?',
        'Anlaşma / anlaşamama / icra kutusunu seç',
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
      heading: '5. Pusula dayanaklar',
      paragraphs: [
        '6325 s. HUAK ana kaynaktır. Dava şartı alanları ve süreler değişebilir; güncel metinden doğrulayın.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma dava şartı listesi / süre yazmayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Arabuluculuk)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık işe yarar. 60 dk / 2–3 soruda önce kapsam, sonra süreç/sonuç.`,
        'İskelet: (1) gönüllü/zorunlu (2) ilkeler (3) süreç/tutanak (4) anlaşma/icra veya dava (5) etik.',
      ],
      bullets: [
        'Zorunlu başvuru ≠ zorunlu anlaşma',
        'Arabulucu karar dayatmaz',
        'İş/ticari kapsamı ayır',
        'İcra usulünü atlama',
      ],
      hapBilgi: 'Doğru kapsam + doğru tutanak = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Arabuluculuk ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Uyuşmazlık türü',
        'Gönüllü / dava şartı',
        'Süreç ve tutanak',
        'Anlaşma veya anlaşamama',
        'İcra veya dava',
        'Etik/gizlilik notu',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'arabuluculuk-donem-2'
          ? [
              ['Anlaşma belgesi', 'Mahkeme ilamı', 'İcra usulü tamam mı?'],
              ['İş arabuluculuğu', 'Ticari arabuluculuk', 'Hangi uyuşmazlık alanı?'],
              ['Anlaşamama', 'Vazgeçme', 'Süreç nasıl bitti?'],
              ['Şerh', 'Dava', 'İcra mı yargılama mı?'],
            ]
          : variantCode === 'arabuluculuk-donem-1'
            ? [
                ['Arabuluculuk', 'Tahkim', 'Karar dayatılır mı?'],
                ['Gönüllü', 'Dava şartı', 'Başvuru zorunlu mu?'],
                ['Arabulucu', 'Hâkim', 'Hüküm mü kolaylaştırma mı?'],
                ['Gizlilik', 'Aleniyet', 'Süreç bilgisi açıklanır mı?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'İlke/süreç mi anlaşma/icra mı?'],
                ['Gönüllü', 'Zorunlu', 'Kanun zorluyor mu?'],
                ['Anlaşma', 'Anlaşamama', 'Belge sonucu ne?'],
                ['Arabuluculuk', 'Tahkim', 'Karar var mı?'],
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
      leftTitle: 'İlke / süreç',
      rightTitle: 'Dava şartı / icra',
      left: 'İlkeler–arabulucu–oturum',
      right: 'İş/ticari–anlaşma–icra–dava',
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
      a: '1. dönem kavram–ilkeler–süreç–gönüllü/zorunlu giriş; 2. dönem anlaşma–icra–iş/ticari dava şartı–etik; yıllık ikisini birleştirir.',
    },
    {
      q: 'Zorunlu arabuluculukta anlaşmak zorunda mıyız?',
      a: 'Hayır. Zorunlu olan başvurudur; anlaşma iradidir. Anlaşamazsanız tutanakla dava yoluna gidersiniz.',
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
    'Dava şartı / gönüllü ayrımını denedim',
    'PDF’i arşivledim',
    variantCode === 'arabuluculuk-yillik'
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
      `${uni.shortName} arabuluculuk ${meta.short}`,
      `${uni.shortName} HUAK ders notu`,
      `arabuluculuk ${meta.short} not pdf`,
      'dava şartı arabuluculuk anlaşma belgesi',
      'arabuluculuk yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} arabuluculuk`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format: uni.type === 'vakif' ? 'Klasik + ara; vaka/rol play olabilir' : 'Klasik yazılı + vaka analizi',
      tips: [
        'Gönüllü/zorunlu ayır',
        'İlkeleri örnekle bağla',
        'Tutanak ve anlaşmayı yaz',
        'İş/ticari kapsamı doğrula',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Arabuluculuk ${meta.short} kurumlarını ayırır`,
      'İlke ve süreç omurgasını kurar',
      'Dava şartı rejimini uygular',
      'Anlaşma–icra ve süreç sonrası davayı yazar',
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
    relatedCourses: ARABULUCULUK_VARIANTS.filter((c) => c !== variantCode).concat([
      'arabuluculuk',
      'hmk-yillik',
      'is-hukuku',
      'ticari-isletme-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'arabuluculuk-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'arabuluculuk',
    variantLabel: meta.label,
  };
}
