/**
 * İcra Hukuku (İİK — takip, haciz, satış) —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * İflas triple’ından ayrıdır; icra-iflas dersiyle hizalı.
 */

function baseMeta(variant) {
  const labels = {
    'icra-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'İİK İcra · 1. yarı (takip yolları, ilamsız takip, ödeme emri, itiraz, itirazın iptali/kaldırılması, ilamlı takip girişi)',
    },
    'icra-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'İİK İcra · 2. yarı (haciz, haczedilemezlik, satış, sıra cetveli, istihkak, ihtiyati haciz, şikâyet)',
    },
    'icra-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'İcra hukuku tam omurga · ilamsız/ilamlı takip + haciz–satış · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Takip yolu seç → tebliğ → süre → itiraz. Kapı burada açılır veya kapanır.',
    promise:
      'İlamlı/ilamsız ayrımı, ödeme emri, itiraz ve kaldırılması/iptali, ilamlı takip girişi. Güz finalinde süre ve yol seçimi bozulmadan yazarsınız.',
    sixtySecond: [
      'İlamlı ≠ ilamsız: ilam var mı yok mu?',
      'İlamsızda ödeme emri + itiraz (kural 7 gün) merkezi.',
      'İtiraz takibi durdurur; kaldırılması/iptali ayrı yollar.',
      'İlamlıda icra emri; itiraz imkânı daralır.',
      'Yetkili icra dairesi ve takip talebi şekil şartları.',
      'Cevap: yol → tebliğ → süre → sonuç.',
    ],
    pillars: [
      'İcra hukukunun konusu ve organları',
      'İlamlı / ilamsız takip ayrımı',
      'Takip talebi ve icra dairesi',
      'Ödeme emri',
      'İtiraz ve süreleri',
      'İtirazın iptali ve kaldırılması',
      'İlamlı takip girişi',
      'Takibin iptali / geri bırakılması girişi',
    ],
    definitions: [
      {
        baslik: 'İlamsız icra',
        govde:
          'Mahkeme ilamı olmadan, alacaklının takip talebiyle başlayan icra yoludur. Ödeme emri ve itiraz merkezi önemdedir.',
      },
      {
        baslik: 'İlamlı icra',
        govde:
          'Mahkeme ilamına veya ilam niteliğindeki belgelere dayanan icra yoludur. İcra emri tebliğ edilir; itiraz imkânı ilamsıza göre dardır.',
      },
      {
        baslik: 'İtiraz',
        govde:
          'Borçlunun ödeme emrine karşı süresinde başvurduğu savunma yoludur. Süresinde itiraz takibi durdurur; süre kaçınca sonuç ağırlaşır.',
      },
      {
        baslik: 'İtirazın iptali',
        govde:
          'İtirazın haksızlığını mahkemede ispatlayarak takibin devamını sağlayan davadır. İtirazın kaldırılmasından farklı usul ve ispat rejimine sahiptir.',
      },
      {
        baslik: 'İtirazın kaldırılması',
        govde:
          'Belirli belgelere dayanan alacaklarda icra mahkemesinde itirazın kaldırılmasını sağlayan yoldur. Şartları dar ve belgeseldir.',
      },
    ],
    traps: [
      'İtiraz süresini “genel 2 hafta” sanmak — ilamsızda kural 7 gündür.',
      'İlamlı ile ilamsızı aynı rejimde yazmak.',
      'İtirazın iptali ile kaldırılmasını karıştırmak.',
      'Tebliği yok sayıp süreyi başlatmamak.',
      'Yetkili icra dairesini atlamak.',
    ],
    keyMadde: [
      'İİK m.42 vd. — takip talebi / genel (çerçeve)',
      'İİK m.46 vd. — yetki (çerçeve)',
      'İİK m.58 vd. — ilamsız takip / ödeme emri (çerçeve)',
      'İİK m.62 vd. — itiraz',
      'İİK m.67 — itirazın iptali',
      'İİK m.68 vd. — itirazın kaldırılması (çerçeve)',
      'İİK m.24 vd. / 32 vd. — ilamlı takip (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. İcra hukuku nedir?',
        paragraphs: [
          'İcra, alacağın cebri icra yoluyla tahsilidir. İflastan ayrı bir disiplindir: burada amaç kural olarak tek alacaklının takibidir; iflasta kolektif tasfiye öne çıkar.',
          '1. dönem yol seçimi ve itiraz omurgasını taşır. Haciz–satış–sıra 2. döneme kalır.',
        ],
        hapBilgi: 'Önce yol (ilamlı/ilamsız), sonra süre, en sonda sonuç.',
      },
      {
        heading: 'B. Organlar ve takip talebi',
        paragraphs: [
          'İcra dairesi, icra mahkemesi ve genel mahkemeler farklı roller oynar. Takip talebi şekil ve içerik unsurlarıyla açılır; eksiklik sonradan pahalıya patlar.',
          'Yetkili icra dairesi kural ve istisnaları olayda yazılır. Şikâyet yolu (2. dönem derin) giriş olarak tanınır.',
        ],
      },
      {
        heading: 'C. İlamsız takip ve ödeme emri',
        paragraphs: [
          'Alacaklı takip talebi verir; borçluya ödeme emri tebliğ edilir. Ödeme veya itiraz için kanuni süre işler. Süresinde itiraz takibi durdurur.',
          'Kambiyo senetlerine özgü takip gibi özel yollar ayrı rejimdir; sınavda “genel ilamsız mı özel mi?” diye ayırın.',
        ],
        kartlar: [
          { baslik: 'Takip talebi', govde: 'Alacaklı başlatır.' },
          { baslik: 'Ödeme emri', govde: 'Tebliğ + süre.' },
          { baslik: 'İtiraz', govde: 'Takibi durdurur (kural).' },
          { baslik: 'Süre', govde: 'Kural 7 gün (ilamsız).' },
        ],
        uyari: 'Süre tebliğden işler. Tebliğ yoksa süre yok.',
      },
      {
        heading: 'D. İtirazın iptali ve kaldırılması',
        paragraphs: [
          'İtirazın iptali: genel mahkemede, alacağın varlığını ispat. İtirazın kaldırılması: icra mahkemesinde, kanundaki belgelerle (senet vb.).',
          'Hangisinin seçileceği belgenin niteliğine bağlıdır. Yanlış yol = zaman ve harç kaybı.',
        ],
        hapBilgi: 'İptal = dava. Kaldırma = belgesel / icra mahkemesi.',
      },
      {
        heading: 'E. İlamlı takip girişi',
        paragraphs: [
          'İlam veya ilam niteliğinde belge varsa ilamlı yol açılır. İcra emri tebliğ edilir; borçlunun itiraz imkânı ilamsıza göre sınırlıdır (icranın geri bırakılması vb.).',
          'İlamın kesinleşmesi ve icra kabiliyeti olayda kontrol edilir.',
        ],
      },
      {
        heading: 'F. Takibin durması, iptali, geri bırakılması',
        paragraphs: [
          'İtiraz, icranın geri bırakılması, takibin iptali/taliki gibi kurumlar 1. dönemde tanınır. Şart ve merci ayrımı yazılır.',
          '2. dönemde haciz sonrası şikâyet ve istihkak ile bağ kurulur.',
        ],
      },
      {
        heading: 'G. Sınav iskeleti (1. dönem)',
        paragraphs: [
          'Her olayda: (1) ilam var mı (2) hangi takip (3) tebliğ (4) süre (5) itiraz oldu mu (6) iptal mi kaldırma mı (7) sonuç.',
        ],
        bullets: [
          'Yol seçimi',
          'Tebliğ + süre',
          'İtiraz etkisi',
          'Alacaklının karşı yolu',
        ],
      },
    ],
    examples: [
      {
        title: 'İtiraz süresi',
        facts:
          'Ödeme emri tebliğ edilir; borçlu 10. günde itiraz eder. Alacaklı takibe devam etmek ister.',
        analysis:
          'İlamsızda kural 7 gün. Geç itiraz. Takibin durumu. İptal/kaldırma gerekmez çünkü itiraz süresinde değilse…',
        takeaway: '7 gün kuralını ilk yaz.',
      },
      {
        title: 'İptal mi kaldırma mı?',
        facts:
          'Borçlu itiraz eder; alacaklının elinde imzalı senet vardır.',
        analysis:
          'Belge niteliği. Kaldırma şartları. Yoksa iptal davası. Merci farkı.',
        takeaway: 'Belge → yol seçimi.',
      },
      {
        title: 'İlamlı / ilamsız',
        facts:
          'Alacaklının kesinleşmiş mahkeme ilamı vardır; ilamsız takip açar.',
        analysis:
          'İlamlı yol mümkün/gerekli mi? Yanlış yolun sonuçları. Strateji ve süre.',
        takeaway: 'İlam varsa ilamlı düşün.',
      },
      {
        title: 'Tebliğ',
        facts:
          'Ödeme emri usulsüz tebliğ iddiası; süreler tartışmalı.',
        analysis:
          'Usulüne tebliğ. Şikâyet / süre başlangıcı. Takibin akıbeti.',
        takeaway: 'Tebliğ = süre anahtarı.',
      },
    ],
    mindmap: {
      center: 'İcra · 1. dönem',
      branches: [
        { label: 'Yol', items: ['İlamlı', 'İlamsız', 'Kambiyo'] },
        { label: 'Emir', items: ['Ödeme', 'İcra'] },
        { label: 'İtiraz', items: ['Süre', 'Etki'] },
        { label: 'Karşı yol', items: ['İptal', 'Kaldırma'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Haciz–satış–sıra–istihkak. Malvarlığına el koyma ve paraya çevirme.',
    promise:
      'Haciz, haczedilemezlik, satış, sıra cetveli, istihkak, ihtiyati haciz, şikâyet. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Haciz: borçlunun malvarlığına cebri el koyma.',
      'Haczedilemezlik: kanuni koruma; kısmi haciz ihtimali.',
      'Satış: paraya çevirme; süre ve usul.',
      'Sıra cetveli: alacaklılar arası öncelik.',
      'İstihkak: üçüncü kişinin “mal benim” iddiası.',
      'İhtiyati haciz + şikâyet: geçici koruma ve denetim.',
    ],
    pillars: [
      'Haciz türleri ve usulü',
      'Haczedilemezlik',
      'Satış ve paraya çevirme',
      'Sıra cetveli ve paylaştırma',
      'İstihkak davası / iddiası',
      'İhtiyati haciz',
      'Şikâyet',
      'İcranın iadesi / kötüniyet sonuçları girişi',
    ],
    definitions: [
      {
        baslik: 'Haciz',
        govde:
          'Borçlunun mal ve haklarına, alacağın tahsili amacıyla cebri icra yoluyla el konulmasıdır. Taşınır, taşınmaz, alacak haczi ayrılır.',
      },
      {
        baslik: 'Haczedilemezlik',
        govde:
          'Kanunun haczi yasakladığı veya sınırladığı mal ve haklardır. Kısmi haciz imkânları unutulmamalıdır.',
      },
      {
        baslik: 'Sıra cetveli',
        govde:
          'Birden fazla alacaklı arasında satış bedelinin hangi sırayla paylaştırılacağını gösteren listedir. İtiraz ve şikâyet yolları vardır.',
      },
      {
        baslik: 'İstihkak',
        govde:
          'Haczedilen mal üzerinde üçüncü kişinin mülkiyet veya sınırlı ayni hak iddiasıdır. İcra içi ve dava yolları bilinir.',
      },
      {
        baslik: 'İhtiyati haciz',
        govde:
          'Alacağın tehlikede olduğu hâllerde, esas takip/dava sonuçlanmadan önce mahkeme kararıyla konulan geçici hacizdir.',
      },
    ],
    traps: [
      'Haczedilemezliği hiç tartışmamak.',
      'Sıra cetvelini “kim önce başvurdu”ya indirgemek — kanuni sıra.',
      'İstihkakı iflas masasıyla karıştırmak.',
      'İhtiyati haczi nihai haciz sanmak.',
      'Şikâyet süresini kaçırıp hâlâ şikâyet iddia etmek.',
    ],
    keyMadde: [
      'İİK m.78 vd. — haciz (çerçeve)',
      'İİK m.82 vd. — haczedilemezlik',
      'İİK m.106 vd. — satış (çerçeve)',
      'İİK m.140 vd. — sıra cetveli / paylaştırma (çerçeve)',
      'İİK m.96 vd. — istihkak (çerçeve)',
      'İİK m.257 vd. — ihtiyati haciz',
      'İİK m.16 vd. — şikâyet (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Haciz',
        paragraphs: [
          'Takip kesinleştikten (veya kanunun öngördüğü hâllerde) haciz istenir. Taşınır, taşınmaz, üçüncü kişideki hak ve alacaklar farklı usullerle haczedilir.',
          'Haciz tutanağı, tebliğ ve koruma tedbirleri ispat ve şikâyet bakımından önemlidir.',
        ],
        hapBilgi: 'Haciz = el koyma. Satış = paraya çevirme. İkisi ayrı aşama.',
      },
      {
        heading: 'B. Haczedilemezlik',
        paragraphs: [
          'Kanun belirli malları tamamen veya kısmen haczedilemez sayar (zorunlu geçim, emekli maaşı dilimleri vb. — güncel madde).',
          'Sınavda “tamamen mi kısmen mi?” ve borçlunun itiraz/şikâyet yolu yazılır.',
        ],
        bullets: [
          'Tam haczedilemezlik',
          'Kısmi haciz',
          'İleri sürülme zamanı',
          'Sonuç',
        ],
      },
      {
        heading: 'C. Satış ve paraya çevirme',
        paragraphs: [
          'Haczedilen mal satışa çıkarılır; süreler ve ilan usulü kaçırılırsa ihalenin feshi gündeme gelir. Artırma, teminat, ihale kararı iskeleti bilinir.',
          'Taşınır ve taşınmazda satış usulü farklıdır. Bedel paylaşıma gider.',
        ],
        uyari: 'Satış süresi ve ilan usulü = ihale güvenliği.',
      },
      {
        heading: 'D. Sıra cetveli',
        paragraphs: [
          'Birden fazla alacaklı varsa bedel kanuni sıraya göre paylaşılır (rehinli, imtiyazlı, adi…). Sıra cetveline itiraz/şikâyet yolları vardır.',
          '“Kim önce haciz koydu” tek başına her zaman yetmez; imtiyaz ve rehin sırası yazılır.',
        ],
        kartlar: [
          { baslik: 'Rehinli', govde: 'Teminatlı alacak.' },
          { baslik: 'İmtiyazlı', govde: 'Kanuni öncelik.' },
          { baslik: 'Adi', govde: 'Genel sıra.' },
          { baslik: 'İtiraz', govde: 'Cetvele karşı yol.' },
        ],
      },
      {
        heading: 'E. İstihkak',
        paragraphs: [
          'Üçüncü kişi “mal benim” derse istihkak prosedürü devreye girer. İcra dairesi işlemleri ve istihkak davası ayrılır. İspat yükü olay tipine göre kayar.',
          'Eşya hukuku mülkiyet ispatı ile bağ kurulur; süreler kaçırılmamalıdır.',
        ],
      },
      {
        heading: 'F. İhtiyati haciz ve şikâyet',
        paragraphs: [
          'İhtiyati haciz: alacağın tahsilinin tehlikede olması, teminat, süre içinde takibe geçme. Şikâyet: icra organlarının hukuka aykırı işlemlerine karşı icra mahkemesi yolu.',
          'Şikâyet süreleri ve konusu (işlemin iptali/düzeltilmesi) sınav klasikidir.',
        ],
        hapBilgi: 'İhtiyati haciz geçicidir. Şikâyet = denetim yolu.',
      },
      {
        heading: 'G. Kötüniyet ve iade',
        paragraphs: [
          'Haksız veya usulsüz icra sonucunda iade ve tazminat gündeme gelebilir. 2. dönemde en azından çerçeve bilinir; detay maddeler güncel İİK’dan doğrulanır.',
        ],
      },
    ],
    examples: [
      {
        title: 'Haczedilemezlik',
        facts:
          'İcra, borçlunun maaşının tamamını haczeder; borçlu itiraz eder.',
        analysis:
          'Kısmi haciz kuralları. Haczedilemez dilim. Şikâyet/itiraz yolu.',
        takeaway: 'Tamamı değil; kanuni dilim.',
      },
      {
        title: 'Sıra cetveli',
        facts:
          'Satış bedeli yetersiz; rehinli banka, işçi alacağı ve adi alacaklı çakışır.',
        analysis:
          'Kanuni sıra. İmtiyaz. Cetvele itiraz.',
        takeaway: 'Sıra = kanun, salt başvuru tarihi değil.',
      },
      {
        title: 'İstihkak',
        facts:
          'Haczedilen araçta üçüncü kişi “benim arabam” der; ruhsat kendi adınadır.',
        analysis:
          'İstihkak iddiası. İspat. İcra içi / dava. Haczin akıbeti.',
        takeaway: 'Üçüncü kişi = istihkak kutusu.',
      },
      {
        title: 'İhtiyati haciz',
        facts:
          'Alacaklı, dava açmadan borçlunun mallarının kaçırılacağını iddia ederek ihtiyati haciz ister.',
        analysis:
          'Şartlar + teminat + süre içinde takip. İtiraz.',
        takeaway: 'Geçici haciz = şart + süre.',
      },
    ],
    mindmap: {
      center: 'İcra · 2. dönem',
      branches: [
        { label: 'Haciz', items: ['Tür', 'Usul', 'Koruma'] },
        { label: 'Satış', items: ['Süre', 'İhale', 'Fesih'] },
        { label: 'Pay', items: ['Sıra', 'Cetvel'] },
        { label: 'Üçüncü', items: ['İstihkak', 'Şikâyet'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Takip yolundan haciz ve satışa kadar tek omurga. İflas ayrı nottadır.',
    promise:
      '1. + 2. dönem birleşik; icra hukuku için “tek cilt” not. İflas/konkordato için ayrı iflas triple’ına bakın.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: yol/itiraz mı, haciz/satış/sıra mı?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 4), ...b.keyMadde.slice(0, 4)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. İflas sorusu gelirse iflas triple notuna geçin; bu paket icraya odaklanır.',
          'Öneri: yol–ödeme emri–itiraz → deneme → haciz–satış–sıra → karma.',
        ],
        hapBilgi: 'Yıllık icra = doğru yol + doğru süre + doğru haciz/satış adımı.',
        bullets: [
          'Hafta 1–4: ilamlı/ilamsız + ödeme emri + itiraz',
          'Hafta 5–7: iptal/kaldırma + ilamlı',
          'Hafta 8–11: haciz + haczedilemezlik + satış',
          'Hafta 12–14: sıra + istihkak + ihtiyati haciz + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — İtiraz süresi. Tip 2 — İptal/kaldırma. Tip 3 — Haczedilemezlik. Tip 4 — Sıra cetveli. Tip 5 — İstihkak. Tip 6 — İhtiyati haciz.',
          'Karma olayda itiraz + haciz + istihkak üst üste binebilir. Sıra: takip durumu → haciz geçerli mi → üçüncü kişi/sıra.',
        ],
        uyari: 'İflas masası sorusunu bu notta zorlamayın; iflas paketini açın.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'İcra · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Yol', 'Emir', 'İtiraz'] },
        { label: '2. yarı', items: ['Haciz', 'Satış', 'Sıra'] },
        { label: 'Koruma', items: ['İhtiyati', 'Şikâyet'] },
        { label: 'Yöntem', items: ['Süre tut', 'Yol seç'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'icra-donem-1': d1Content,
  'icra-donem-2': d2Content,
  'icra-yillik': yillikContent,
};

export const ICRA_VARIANTS = ['icra-donem-1', 'icra-donem-2', 'icra-yillik'];

export function buildIcraVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} İcra Hukuku ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} İcra Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için İcra Hukuku ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için İcra Hukuku ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: doğru takip yolu, süre ve haciz/satış adımını yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır. İflas ayrı pakettedir.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. İflas/konkordato için “İflas Hukuku” triple notlarını kullanın.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: ilamlı mı ilamsız mı?',
        'Süreleri tebliğden kur',
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
      paragraphs: ['Soru tipine göre dayanaklar. Güncel metin: İİK (icra).'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde no yazmayın; İİK metninden doğrulayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (İcra)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) yol (2) tebliğ (3) süre (4) itiraz/haciz (5) sonuç.',
      ],
      bullets: [
        'İlamlı / ilamsız ilk cümlede',
        '7 gün itiraz kuralını yaz',
        'İptal ≠ kaldırma',
        'Haczedilemezliği unutma',
      ],
      hapBilgi: 'Doğru yol + doğru süre = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `İcra Hukuku ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Takip yolunu seç',
        'Tebliğ + süre',
        'İtiraz / kesinleşme',
        'Haciz / satış adımı',
        'Sıra / istihkak',
        'Sonuç',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'icra-donem-2'
          ? [
              ['Haciz', 'Satış', 'El koyma mı paraya çevirme mi?'],
              ['Sıra cetveli', 'Öncelik başvurusu', 'Kanuni sıra mı tarih mi?'],
              ['İstihkak', 'Şikâyet', 'Mülkiyet iddiası mı işlem denetimi mi?'],
              ['İhtiyati haciz', 'Kesin haciz', 'Geçici mi takip kesin mi?'],
            ]
          : variantCode === 'icra-donem-1'
            ? [
                ['İlamlı', 'İlamsız', 'İlam var mı?'],
                ['İtirazın iptali', 'Kaldırılması', 'Dava mı belgesel yol mu?'],
                ['Ödeme emri', 'İcra emri', 'İlamsız mı ilamlı mı?'],
                ['İtiraz', 'Şikâyet', 'Borca itiraz mı işlem denetimi mi?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Yol/itiraz mı haciz/satış mı?'],
                ['İlamlı', 'İlamsız', 'İlam var mı?'],
                ['İptal', 'Kaldırma', 'Dava mı belge mi?'],
                ['Haciz', 'İstihkak', 'El koyma mı üçüncü kişi mi?'],
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
      leftTitle: 'Takip / itiraz',
      rightTitle: 'Haciz / satış',
      left: 'Yol + emir + süre + iptal/kaldırma',
      right: 'Haciz + satış + sıra + istihkak',
    },
    {
      kind: 'cycle',
      title: 'Haftalık döngü',
      steps: ['Madde', 'Şema', 'Örnek', 'Quiz', 'Yanlış defteri'],
    },
  ];

  const faq = [
    {
      q: 'İcra ile iflas farkı ne?',
      a: 'İcra kural olarak ferdi takip ve tahsildir. İflas kolektif tasfiyedir. Bu not yalnız icradır; iflas triple ayrıdır.',
    },
    {
      q: '1. dönem / 2. dönem / yıllık farkı ne?',
      a: '1. dönem yol–ödeme emri–itiraz; 2. dönem haciz–satış–sıra–istihkak; yıllık ikisini birleştirir.',
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
    'Pusula maddeleri İİK’dan doğruladım',
    'PDF’i arşivledim',
    variantCode === 'icra-yillik'
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
      `${uni.shortName} icra hukuku ${meta.short}`,
      `${uni.shortName} icra ders notu`,
      `icra hukuku ${meta.short} not pdf`,
      'ilamsız takip ödeme emri itiraz haciz ders notu',
      'icra yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} icra hukuku`),
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
        'Yolu ilk cümlede seç',
        'Süreleri tebliğden yaz',
        'İptal ≠ kaldırma',
        'Haczedilemezliği aç',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `İcra Hukuku ${meta.short} kapsamındaki kurumları ayırır`,
      'İlamlı/ilamsız takip ve itiraz rejimini uygular',
      'Haciz–satış–sıra adımlarını kurar',
      'İstihkak ve ihtiyati haciz yolunu seçer',
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
    relatedCourses: ICRA_VARIANTS.filter((c) => c !== variantCode).concat([
      'icra-iflas',
      'iflas-yillik',
      'hmk-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: variantCode === 'icra-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'icra',
    variantLabel: meta.label,
  };
}
