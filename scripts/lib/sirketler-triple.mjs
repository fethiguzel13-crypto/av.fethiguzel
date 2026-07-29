/**
 * Şirketler Hukuku (TTK ticaret şirketleri) —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * ticaret-sirketler dersiyle hizalı.
 */

function baseMeta(variant) {
  const labels = {
    'sirketler-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'TTK Şirketler · 1. yarı (genel hükümler, kollektif/komandit, limited kuruluş–organ–pay, AŞ kuruluş girişi)',
    },
    'sirketler-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'TTK Şirketler · 2. yarı (AŞ organları, pay–sermaye, birleşme–bölünme, sorumluluk, sona erme, limited derin)',
    },
    'sirketler-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'Ticaret şirketleri tam omurga · şahıs + sermaye şirketleri · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Hangi şirket türü, nasıl kurulur, kim yönetir? TTK şirketler kapısı.',
    promise:
      'Ticaret şirketleri genel, kollektif/komandit, limited şirket (kuruluş, organ, pay devri), anonim şirket kuruluş girişi. Güz finalinde tür seçimi bozulmadan yazarsınız.',
    sixtySecond: [
      'Ticaret şirketi = tüzel kişilik + ortak amaç + sermaye/emek.',
      'Şahıs şirketleri: kollektif, komandit (sınırsız sorumluluk çekirdeği).',
      'Sermaye şirketleri: limited, anonim (sınırlı sorumluluk kuralı).',
      'Kuruluş: sözleşme/esas sözleşme + tescil + ilan (türe göre).',
      'Limited: ortak sayısı, esas sermaye, müdürler.',
      'AŞ girişi: kurucular, esas sözleşme, tescil.',
    ],
    pillars: [
      'Ticaret şirketleri genel hükümler',
      'Şirket türleri ve ayrım ölçütleri',
      'Kollektif şirket',
      'Komandit şirket',
      'Limited şirket kuruluşu',
      'Limited organları ve temsil',
      'Limited pay ve devir',
      'Anonim şirket kuruluş girişi',
    ],
    definitions: [
      {
        baslik: 'Ticaret şirketi',
        govde:
          'TTK’da düzenlenen kollektif, komandit, anonim, limited ve kooperatif şirketlerdir. Tüzel kişilik kazanımı tescille bağlantılıdır.',
      },
      {
        baslik: 'Kollektif şirket',
        govde:
          'Ticari işletme işletmek amacıyla gerçek kişiler arasında kurulan, ortakların şirket borçlarından ikinci derecede sınırsız sorumlu olduğu şahıs şirketidir.',
      },
      {
        baslik: 'Limited şirket',
        govde:
          'Bir veya daha fazla gerçek/tüzel kişi tarafından, esas sermayesi belirli, ortakların sorumluluğu kural olarak taahhüt ettikleri sermaye ile sınırlı olan sermaye şirketidir.',
      },
      {
        baslik: 'Anonim şirket',
        govde:
          'Sermayesi belirli ve paylara bölünmüş, borçlarından yalnız malvarlığıyla sorumlu olan sermaye şirketidir. Pay sahipleri taahhütleriyle sınırlıdır.',
      },
      {
        baslik: 'Tescil',
        govde:
          'Şirketin ticaret siciline kaydıdır. Tüzel kişilik ve üçüncü kişilere karşı hüküm çoğu zaman tescil/ilan ile tamamlanır.',
      },
    ],
    traps: [
      'Limited ile anonimi organ ve pay rejiminde karıştırmak.',
      'Sınırsız sorumluluğu limited/AŞ’ye taşımak.',
      'Tescili “sadece formalite” sanmak — tüzel kişilik/üçüncü kişi etkisi.',
      'Pay devrinde limited’de genel kurul onayı kutusunu unutmak.',
      'Kooperatifi ticaret şirketi listesinden tamamen silmek (TTK listesinde vardır).',
    ],
    keyMadde: [
      'TTK m.124 vd. — ticaret şirketleri genel (çerçeve)',
      'TTK m.211 vd. — kollektif (çerçeve)',
      'TTK m.304 vd. — komandit (çerçeve)',
      'TTK m.573 vd. — limited şirket (çerçeve)',
      'TTK m.329 vd. — anonim şirket (çerçeve)',
      'TTK m.335 vd. — AŞ kuruluş (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Şirketler hukuku nedir?',
        paragraphs: [
          'Ticaret şirketleri, ticari işletme ve sermaye organizasyonunun tüzel kişilikli formudur. Sınavda önce türü sabitleyin; sorumluluk, organ ve kuruluş o türe göre yazılır.',
          '1. dönem genel + şahıs şirketleri + limited omurgası + AŞ kuruluş girişidir. AŞ organ derinliği, birleşme ve sorumluluk 2. döneme kalır.',
        ],
        hapBilgi: 'Tür seç → sorumluluk + organ + kuruluş yaz.',
      },
      {
        heading: 'B. Genel hükümler',
        paragraphs: [
          'Ortaklık sözleşmesi, sermaye koyma borcu, rekabet yasağı, tasfiye ve türler arası geçiş genel iskelette yer alır. Tüzel kişilik, ehliyet ve organ teorisi ticaret hukukuyla bağlanır.',
          'Tek ortaklı limited ve AŞ imkânı güncel TTK’da bilinmelidir.',
        ],
        bullets: [
          'Tüzel kişilik',
          'Sermaye koyma',
          'Temsil',
          'Sona erme girişi',
        ],
      },
      {
        heading: 'C. Kollektif ve komandit',
        paragraphs: [
          'Kollektifte ortaklar kural olarak ikinci derecede sınırsız ve müteselsil sorumludur. Yönetim ve temsil ortaklara aittir (aksi kararılabilir).',
          'Komanditte komandite sınırsız, komanditer sınırlı sorumludur. Komanditerin yönetime karışma sınırları sınav klasikidir.',
        ],
        kartlar: [
          { baslik: 'Kollektif', govde: 'Sınırsız sorumluluk çekirdeği.' },
          { baslik: 'Komandite', govde: 'Sınırsız sorumlu ortak.' },
          { baslik: 'Komanditer', govde: 'Sınırlı; yönetim sınırlı.' },
          { baslik: 'Kuruluş', govde: 'Sözleşme + tescil.' },
        ],
        uyari: 'Şahıs şirketi ≠ limited. Sorumluluk rejimini karıştırmayın.',
      },
      {
        heading: 'D. Limited şirket — kuruluş',
        paragraphs: [
          'Kurucular, esas sermaye, şirket sözleşmesi, tescil ve ilan. Asgari sermaye ve ayni sermaye koyma kuralları güncel TTK’dan doğrulanır.',
          'Tek kişilik limited mümkündür. Kuruluştaki beyan ve sorumluluk 2. dönemle bağlanır.',
        ],
        hapBilgi: 'Limited = sözleşme + sermaye + tescil.',
      },
      {
        heading: 'E. Limited — organ ve temsil',
        paragraphs: [
          'Müdür(ler) yönetim ve temsili yürütür; genel kurul ortaklar karar organıdır. Temsil yetkisinin kapsamı ve sınırlandırılmasının üçüncü kişilere etkisi yazılır.',
          'Karar nisapları (özellikle önemli işlemler ve sözleşme değişiklikleri) final sorusudur.',
        ],
      },
      {
        heading: 'F. Limited — pay ve devir',
        paragraphs: [
          'Esas sermaye payı devredilebilir; kural olarak genel kurul onayı aranır (sözleşme ve kanun çerçevesi). Devir şekli (yazılı, noter) güncel metinden kontrol edilir.',
          'Pay defteri ve miras yoluyla geçiş ayrı kutulardır.',
        ],
        uyari: 'Onaysız devir = geçersizlik / bağlayıcılık riski. Onayı yazın.',
      },
      {
        heading: 'G. Anonim şirket kuruluş girişi',
        paragraphs: [
          'Kurucular, esas sözleşme, sermaye (nakdi/ayni), tescil. Halka açık / kapalı ayrımı 2. dönemde derinleşir; 1. dönemde kavram tanınır.',
          'Kuruluşa ilişkin sorumluluk ve kanuna karşı hile 2. dönem köprüsüdür.',
        ],
      },
    ],
    examples: [
      {
        title: 'Tür seçimi',
        facts:
          'İki girişimci “sınırsız sorumluluk istemiyoruz, az ortaklı olacağız” der.',
        analysis:
          'Limited veya AŞ. Kollektif uygun değil. Limited sade omurga; AŞ ölçek/sermaye.',
        takeaway: 'Sorumluluk + ölçek = tür.',
      },
      {
        title: 'Komanditer yönetim',
        facts:
          'Komanditer ortak günlük işleri fiilen yönetir; alacaklı onu da sınırsız sorumlu saymak ister.',
        analysis:
          'Komanditerin yönetim yasağı/sınırı. İstisnalar. Sorumluluk genişlemesi riski.',
        takeaway: 'Komanditer fiilî yönetim = alarm.',
      },
      {
        title: 'Limited pay devri',
        facts:
          'Ortak payını satar; genel kurul onayı alınmaz, alıcı “ben ortağım” der.',
        analysis:
          'Onay şartı. Şekil. Şirkete karşı hüküm. Pay defteri.',
        takeaway: 'Devir + onay + şekil.',
      },
      {
        title: 'Kuruluş tescili',
        facts:
          'Sözleşme imzalanır ama tescil gecikir; “şirket varmış gibi” sözleşme yapılır.',
        analysis:
          'Tüzel kişilik anı. Kurucu işlemler. Üçüncü kişi koruması.',
        takeaway: 'Tescil öncesi ≠ tam tüzel kişilik.',
      },
    ],
    mindmap: {
      center: 'Şirketler · 1. dönem',
      branches: [
        { label: 'Tür', items: ['Şahıs', 'Sermaye'] },
        { label: 'Şahıs', items: ['Kollektif', 'Komandit'] },
        { label: 'Limited', items: ['Kuruluş', 'Müdür', 'Pay'] },
        { label: 'AŞ giriş', items: ['Esas sözleşme', 'Tescil'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: AŞ organları, pay–sermaye, birleşme, sorumluluk, sona erme. Sermaye şirketinin ağır topu.',
    promise:
      'Anonim şirket organları ve kararlar, pay ve sermaye işlemleri, birleşme–bölünme–tür değiştirme, organ sorumluluğu, limited derinleştirme, sona erme/tasfiye. Bahar finalinin omurgası.',
    sixtySecond: [
      'AŞ organları: genel kurul, yönetim kurulu, (denetim çerçevesi).',
      'Karar: toplantı ve karar nisabı + iptal/butlan.',
      'Pay: nama/hamiline, devir, sermaye artırımı/azaltımı girişi.',
      'Birleşme–bölünme–tür değiştirme: yapısal değişiklikler.',
      'Sorumluluk: organlar ve kurucular (çerçeve).',
      'Sona erme + tasfiye: sebep ve usul.',
    ],
    pillars: [
      'Anonim şirket organları',
      'Genel kurul kararlarının iptali / butlanı',
      'Pay ve sermaye işlemleri',
      'Limited derinleştirme (önemli kararlar, çıkarma)',
      'Birleşme, bölünme, tür değiştirme',
      'Organ ve kurucu sorumluluğu',
      'Sona erme ve tasfiye',
      'Halka açık şirket / SPK girişi',
    ],
    definitions: [
      {
        baslik: 'Genel kurul',
        govde:
          'Pay sahiplerinin karar organıdır. Kanunun ve esas sözleşmenin öngördüğü yetkileri kullanır; toplantı ve karar nisapları türe/konuya göre değişir.',
      },
      {
        baslik: 'Yönetim kurulu',
        govde:
          'Anonim şirketin yönetim ve temsil organıdır. Özen ve bağlılık borcu vardır; devredilemez görevler saklıdır.',
      },
      {
        baslik: 'Karar iptali',
        govde:
          'Kanuna, esas sözleşmeye veya dürüstlük kuralına aykırı genel kurul kararlarının iptali davasıdır. Süre ve husumet kritiktir.',
      },
      {
        baslik: 'Birleşme',
        govde:
          'Bir veya daha fazla şirketin malvarlığının tasfiye olmaksızın başka bir şirkete devri veya yeni şirkette birleşmesidir. Alacaklı ve ortak koruması vardır.',
      },
      {
        baslik: 'Organ sorumluluğu',
        govde:
          'Yönetim kurulu üyeleri ve belirli hâllerde diğer organ kişilerinin kanuna/esas sözleşmeye aykırı fiillerinden doğan tazminat sorumluluğudur.',
      },
    ],
    traps: [
      'Her genel kurul kararını “otomatik butlan” sanmak — iptal/butlan ayrımı.',
      'Yönetim kurulunu genel kurula indirgemek.',
      'Birleşmeyi “sadece sözleşme” sanmak — tescil, rapor, alacaklı koruması.',
      'Sorumlulukta kusur/illiyet kutusunu atlamak.',
      'Limited’de çıkarma/ayrılma şartlarını AŞ ile karıştırmak.',
    ],
    keyMadde: [
      'TTK m.359 vd. — yönetim kurulu (çerçeve)',
      'TTK m.407 vd. — genel kurul (çerçeve)',
      'TTK m.445 vd. — karar iptali (çerçeve)',
      'TTK m.136 vd. — birleşme (çerçeve)',
      'TTK m.159 vd. — bölünme (çerçeve)',
      'TTK m.553 vd. — sorumluluk (çerçeve)',
      'TTK m.529 vd. — sona erme (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Anonim şirket organları',
        paragraphs: [
          'Genel kurul irade, yönetim kurulu icra/temsil organıdır. Denetim ve bağımsız denetim çerçevesi bilinir. Organlar arası yetki gaspı kararları sakatlar.',
          'Toplantı çağrısı, gündem bağlılığı, temsil ve oy hakları sınavda sık sorulur.',
        ],
        hapBilgi: 'Organ = yetki + özen. Yetki dışı işlem riskli.',
      },
      {
        heading: 'B. Genel kurul kararları: iptal ve butlan',
        paragraphs: [
          'İptal: kanuna, esas sözleşmeye veya dürüstlüğe aykırılık; süre içinde dava. Butlan: ağır aykırılıklar, emredici hükümlere açık aykırılık (çerçeve).',
          'Davacı sıfatı, husumet (şirket) ve yürütmenin geri bırakılması ayrı yazılır.',
        ],
        bullets: [
          'İptal sebepleri',
          'Butlan sebepleri',
          'Süre',
          'Sonuç',
        ],
        uyari: 'İptal ≠ butlan. Süre ve sebep ağırlığı farklıdır.',
      },
      {
        heading: 'C. Pay ve sermaye',
        paragraphs: [
          'Nama / hamiline yazılır pay, devir, rehin, sermaye taahhüdünün ifası. Sermaye artırımı ve azaltımı usul ve alacaklı koruması ister.',
          'Kaydi sistem ve halka açıklık SPK ile kesişir; 2. dönemde giriş yeterlidir.',
        ],
      },
      {
        heading: 'D. Limited derinleştirme',
        paragraphs: [
          'Önemli karar nisapları, müdürlerin azli, ortaklıktan çıkarma/çıkma, ek ödeme ve rekabet yasağı 1. dönem üzerine eklenir.',
          'Limited–AŞ ayrımı organ ve pay devrinde tekrar yazılır.',
        ],
      },
      {
        heading: 'E. Birleşme, bölünme, tür değiştirme',
        paragraphs: [
          'Yapısal değişiklikler ortak, alacaklı ve çalışan koruması içerir. Birleşme sözleşmesi/raporu, inceleme hakkı, tescil zinciri bilinir.',
          'Bölünme (tam/kısmi) ve tür değiştirme ayrı iskeletlerdir; “hepsi aynı” demeyin.',
        ],
        kartlar: [
          { baslik: 'Birleşme', govde: 'Devralma / yeni kuruluş.' },
          { baslik: 'Bölünme', govde: 'Malvarlığı bölünür.' },
          { baslik: 'Tür değiştirme', govde: 'Şirket türü değişir.' },
          { baslik: 'Koruma', govde: 'Ortak + alacaklı.' },
        ],
      },
      {
        heading: 'F. Sorumluluk',
        paragraphs: [
          'Kurucular, yönetim kurulu üyeleri ve belirli belgelerdeki yanlış beyanlar tazminat doğurabilir. Kusur, illiyet, zarar ve zamanaşımı yazılır.',
          'Şirket alacaklılarının ve pay sahiplerinin dava imkânları (çerçeve) ayırt edilir.',
        ],
        hapBilgi: 'Sorumluluk = aykırılık + kusur + zarar + illiyet.',
      },
      {
        heading: 'G. Sona erme ve tasfiye',
        paragraphs: [
          'Kanuni ve sözleşmesel sona erme sebepleri, mahkeme kararıyla fesih, tasfiye memurları ve alacaklı çağrısı iskeleti bilinir.',
          'İflas ile şirketler hukuku sona ermesi kesişir; iflas triple notuyla bağ kurulur.',
        ],
      },
    ],
    examples: [
      {
        title: 'Genel kurul iptali',
        facts:
          'Azınlık, çağrısız toplantıda alınan sermaye artırım kararını iptal ettirmek ister.',
        analysis:
          'Çağrı usulü. İptal sebebi. Süre. Yürütmenin durdurulması.',
        takeaway: 'Usul aykırılığı + süre = iptal davası.',
      },
      {
        title: 'Yönetim kurulu sorumluluğu',
        facts:
          'YK, şirketi zarara sokan ilişkili taraf işlemini özen göstermeden onaylar.',
        analysis:
          'Özen/bağlılık borcu. Zarar. İlliyet. Davacı (şirket/pay sahibi çerçevesi).',
        takeaway: 'Özen borcu somut yazılır.',
      },
      {
        title: 'Birleşme',
        facts:
          'İki limited birleşmek ister; azınlık ortak “benim payım eridi” der.',
        analysis:
          'Birleşme usulü. Denkleştirme / ayrılma akçesi çerçevesi. Tescil.',
        takeaway: 'Yapısal değişiklik = ortak koruması.',
      },
      {
        title: 'Limited çıkarma',
        facts:
          'Ortaklar, “haklı sebeple” bir ortağı çıkarmak ister.',
        analysis:
          'Çıkarma şartları. Mahkeme. Pay bedeli. Limited’e özgü rejim.',
        takeaway: 'Çıkarma ≠ keyfî; haklı sebep + usul.',
      },
    ],
    mindmap: {
      center: 'Şirketler · 2. dönem',
      branches: [
        { label: 'AŞ', items: ['GK', 'YK', 'İptal'] },
        { label: 'Sermaye', items: ['Pay', 'Artırım'] },
        { label: 'Yapı', items: ['Birleşme', 'Bölünme'] },
        { label: 'Son', items: ['Sorumluluk', 'Tasfiye'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Şirket türünden AŞ organları, birleşme ve sorumluluğa kadar tek omurga.',
    promise:
      '1. + 2. dönem birleşik; ticaret şirketleri / şirketler hukuku için “tek cilt” not.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: tür/kuruluş mu, organ/birleşme/sorumluluk mu?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: tür–limited–AŞ kuruluş → deneme → organ–birleşme–sorumluluk → karma.',
          'Her soruda etiket: “Hangi şirket türü? Hangi organ? Hangi işlem?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru tür + doğru organ/işlem.',
        bullets: [
          'Hafta 1–3: genel + kollektif/komandit',
          'Hafta 4–7: limited + AŞ kuruluş',
          'Hafta 8–11: AŞ organ + pay + karar iptali',
          'Hafta 12–14: birleşme + sorumluluk + tasfiye + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Tür seçimi. Tip 2 — Limited pay devri. Tip 3 — GK iptali. Tip 4 — YK sorumluluğu. Tip 5 — Birleşme. Tip 6 — Komanditer yönetim.',
          'Karma olayda limited pay devri + AŞ karar iptali üst üste binmez; türü sabitleyin.',
        ],
        uyari: 'Tek cevapta tüm TTK şirketler kitabını özetlemeyin; türü seçin.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Şirketler · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Tür', 'Limited', 'Kuruluş'] },
        { label: '2. yarı', items: ['AŞ organ', 'Birleşme', 'Sorumluluk'] },
        { label: 'Şahıs', items: ['Kollektif', 'Komandit'] },
        { label: 'Yöntem', items: ['Tür seç', 'Organ yaz'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'sirketler-donem-1': d1Content,
  'sirketler-donem-2': d2Content,
  'sirketler-yillik': yillikContent,
};

export const SIRKETLER_VARIANTS = [
  'sirketler-donem-1',
  'sirketler-donem-2',
  'sirketler-yillik',
];

export function buildSirketlerVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Şirketler Hukuku ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Şirketler Hukuku (TTK) ${meta.h1Extra}`;
  const description = `${uni.name} için Şirketler Hukuku ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Ticaret Şirketleri Hukuku ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: doğru şirket türünü, organı ve işlemi seçip TTK iskeletiyle yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Dönemlik program kendi yarısını; yıllık veya bütüncül tekrar yıllık paketi kullanır.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: hangi şirket türü?',
        'Limited mi AŞ mi organ/pay rejimini ayır',
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
      paragraphs: ['Soru tipine göre dayanaklar. Güncel metin: TTK şirketler.'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde no yazmayın; TTK metninden doğrulayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Şirketler Hukuku)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) tür (2) organ/işlem (3) şart (4) olgu (5) sonuç (geçerli/iptal/sorumluluk).',
      ],
      bullets: [
        'Türü ilk cümlede yaz',
        'Limited ≠ AŞ organ/pay',
        'İptal / butlan ayır',
        'Sorumlulukta kusur+zarar yaz',
      ],
      hapBilgi: 'Doğru tür + doğru organ = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Şirketler Hukuku ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Şirket türünü seç',
        'Organ / işlem adlandır',
        'Kanuni şart listesi',
        'Olayı yedir',
        'Sonuç (geçerli / iptal / sorumluluk)',
        'Üçüncü kişi / tescil notu',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'sirketler-donem-2'
          ? [
              ['İptal', 'Butlan', 'Süreye bağlı dava mı ağır yokluk mu?'],
              ['Genel kurul', 'Yönetim kurulu', 'Ortak iradesi mi yönetim mi?'],
              ['Birleşme', 'Tür değiştirme', 'Birleşme mi tür değişimi mi?'],
              ['Limited çıkarma', 'AŞ pay devri', 'Ortaklıktan çıkarma mı pay satışı mı?'],
            ]
          : variantCode === 'sirketler-donem-1'
            ? [
                ['Limited', 'Anonim', 'Organ ve pay rejimi?'],
                ['Kollektif', 'Limited', 'Sınırsız mı sınırlı sorumluluk mu?'],
                ['Komandite', 'Komanditer', 'Sınırsız mı sınırlı mı?'],
                ['Tescil öncesi', 'Tescil sonrası', 'Tüzel kişilik tamam mı?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Tür/kuruluş mu organ/birleşme mi?'],
                ['Limited', 'AŞ', 'Hangi organ/pay?'],
                ['Şahıs şirketi', 'Sermaye şirketi', 'Sorumluluk çekirdeği?'],
                ['İptal', 'Sorumluluk', 'Karar sakatlığı mı tazminat mı?'],
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
      leftTitle: 'Tür / kuruluş',
      rightTitle: 'Organ / yapı',
      left: 'Tür seç + kuruluş + limited pay',
      right: 'AŞ organ + iptal + birleşme + sorumluluk',
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
      a: '1. dönem genel + şahıs şirketleri + limited + AŞ kuruluş girişi; 2. dönem AŞ organları, birleşme, sorumluluk, sona erme; yıllık ikisini birleştirir.',
    },
    {
      q: 'Ticaret şirketleri dersiyle aynı mı?',
      a: 'Evet, hizalıdır. Fakültede “Ticaret Şirketleri / Şirketler Hukuku” adıyla okutulan TTK omurgasıdır.',
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
    'Pusula maddeleri TTK’dan doğruladım',
    'PDF’i arşivledim',
    variantCode === 'sirketler-yillik'
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
      `${uni.shortName} şirketler hukuku ${meta.short}`,
      `${uni.shortName} ticaret şirketleri ders notu`,
      `şirketler hukuku ${meta.short} not pdf`,
      'anonim limited şirket TTK ders notu',
      'şirketler hukuku yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} şirketler hukuku`),
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
        'Türü ilk cümlede yaz',
        'Limited ≠ AŞ',
        'Organ yetkisini netleştir',
        'İptal/sorumluluk kapısını seç',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Şirketler Hukuku ${meta.short} kapsamındaki kurumları ayırır`,
      'Şirket türü ve kuruluş rejimini uygular',
      'Organ ve pay işlemlerini doğru adlandırır',
      'Birleşme/sorumluluk/sona erme iskeletini kurar',
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
    relatedCourses: SIRKETLER_VARIANTS.filter((c) => c !== variantCode).concat([
      'ticaret-sirketler',
      'ticari-isletme',
      'iflas-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: variantCode === 'sirketler-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'sirketler',
    variantLabel: meta.label,
  };
}
