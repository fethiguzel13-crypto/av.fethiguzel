/**
 * İnşaat Hukuku —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * insaat-hukuku dersiyle hizalı (mufredat: year 4, seçmeli).
 */

function baseMeta(variant) {
  const labels = {
    'insaat-hukuku-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'İnşaat hukuku · 1. yarı (eser sözleşmesi, taraflar, bedel, imar–ruhsat girişi, kat karşılığı omurga)',
    },
    'insaat-hukuku-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'İnşaat hukuku · 2. yarı (ayıp–gecikme–fesih, alt yüklenici, teminat, kamu ihalesi girişi, uyuşmazlık)',
    },
    'insaat-hukuku-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'İnşaat hukuku tam omurga · eser + imar + ayıp/gecikme + uyuşmazlık · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Eser sözleşmesi, bedel ve ruhsat. İnşaat ilişkisinin hukuki iskeleti burada kurulur.',
    promise:
      'Eser (inşaat) sözleşmesi, iş sahibi–yüklenici, bedel ve değişiklikler, imar–yapı ruhsatı girişi, kat karşılığı inşaat omurgası. Güz finalinde “sözleşme + ruhsat + taraflar” bozulmadan yazarsınız.',
    sixtySecond: [
      'İnşaat hukuku: özel hukuk (eser) + kamu (imar/ruhsat) kesişimi.',
      'TBK eser sözleşmesi: sonuç taahhüdü, özen, teslim.',
      'Taraflar: iş sahibi / yüklenici / alt yüklenici (giriş).',
      'Bedel: götürü, birim fiyat, maliyet + kâr (çerçeve).',
      'İmar ve yapı ruhsatı: inşaata hukuki izin kapısı.',
      'Kat karşılığı: arsa payı ↔ bağımsız bölüm vaadi.',
    ],
    pillars: [
      'İnşaat hukukunun konusu ve kaynakları',
      'Eser sözleşmesi (TBK) omurgası',
      'İş sahibi ve yüklenici borçları',
      'Bedel sistemleri ve iş değişiklikleri',
      'İmar planı ve yapı ruhsatı girişi',
      'Yapı denetimi ve iskan (çerçeve)',
      'Kat karşılığı inşaat sözleşmesi',
      'Temel teminat ve sigorta girişi',
    ],
    definitions: [
      {
        baslik: 'Eser sözleşmesi',
        govde:
          'Yüklenicinin bir eser meydana getirmeyi, iş sahibinin de bedel ödemeyi üstlendiği sözleşmedir. İnşaatta sonuç (eser) taahhüdü ve özen borcu merkezdedir.',
      },
      {
        baslik: 'Yüklenici',
        govde:
          'Eseri kendi organizasyonuyla meydana getirmeyi üstlenen taraftır. Alt yüklenici kullanabilir; asıl borç ilişkisi kural olarak iş sahibiyle kendisi arasındadır.',
      },
      {
        baslik: 'Yapı ruhsatı',
        govde:
          'İlgili idarenin, imar ve teknik mevzuata uygunluğu denetleyerek yapıya izin verdiği idari işlemdir. Ruhsatsız / ruhsata aykırı yapı yaptırımlara tabidir.',
      },
      {
        baslik: 'Kat karşılığı inşaat',
        govde:
          'Arsa sahibinin arsasını, yüklenicinin de inşaatı üstlendiği; bedelin genellikle bağımsız bölüm / arsa payı devriyle ödendiği özel inşaat modelidir.',
      },
      {
        baslik: 'Götürü bedel',
        govde:
          'Eserin tamamı için peşinen kararlaştırılan toplu bedeldir. İş artışı / azalışı ve olağanüstü durumlar özel rejimle tartışılır (TBK çerçevesi).',
      },
    ],
    traps: [
      'İnşaatı yalnız “sözleşme” sanmak — imar/ruhsat kamu boyutudur.',
      'Eser ile vekâleti karıştırmak — sonuç mu özenli ifa mı?',
      'Kat karşılığını sıradan satış saymak — inşaat + pay devri birleşiktir.',
      'Ruhsatı “belediye kağıdı” diye küçümsemek — geçerlilik ve yaptırım.',
      'Bedel tipini yazmadan ayıp/gecikme tartışmak.',
    ],
    keyMadde: [
      'TBK eser sözleşmesi hükümleri (çerçeve; güncel madde aralığı)',
      'TMK — mülkiyet, kat mülkiyeti köprüsü (çerçeve)',
      'İmar Kanunu — plan, ruhsat, yapı (çerçeve; güncel metin)',
      'Yapı Denetimi Kanunu (çerçeve)',
      'Kat Mülkiyeti Kanunu — bağımsız bölüm / arsa payı (çerçeve)',
      'Kamu İhale Kanunu — kamu inşaatı girişi (2. dönem bağ)',
    ],
    sectionsExtra: [
      {
        heading: 'A. İnşaat hukuku nedir?',
        paragraphs: [
          'Özel hukukta eser ve kat karşılığı; kamu hukukunda imar, ruhsat, denetim ve idari yaptırımlar birlikte okunur. Sınavda iki katmanı ayırmak puan getirir.',
          '1. dönem sözleşme + ruhsat + kat karşılığı omurgasını taşır. Ayıp, gecikme, fesih ve uyuşmazlık 2. döneme kalır.',
        ],
        hapBilgi: 'Özel sözleşme + kamu izni = inşaat hukuku.',
      },
      {
        heading: 'B. Eser sözleşmesi omurgası',
        paragraphs: [
          'Kuruluş, şekil (kural serbesti; ispat ve tapu işlemleri ayrı), konu, bedel, süre, teslim. Yüklenici özen ve sadakat; iş sahibi bedel ve işbirliği.',
          'Malzeme kimin? Risk geçişi teslimle bağlanır (çerçeve).',
        ],
        bullets: [
          'Sonuç taahhüdü',
          'Özen borcu',
          'Bedel',
          'Teslim / kabul',
        ],
      },
      {
        heading: 'C. Bedel ve iş değişikliği',
        paragraphs: [
          'Götürü, birim fiyat, maliyet + kâr. Keşif artışı, ek iş, fiyat farkı sözleşmeyle ve TBK ile çözülür. Yazısız ek iş ispat riski taşır.',
          'Sınav iskeleti: bedel tipi → değişiklik var mı → kim üstlenir?',
        ],
        kartlar: [
          { baslik: 'Götürü', govde: 'Toplu bedel.' },
          { baslik: 'Birim fiyat', govde: 'Miktar × birim.' },
          { baslik: 'Ek iş', govde: 'Sözleşme / onay.' },
          { baslik: 'İspat', govde: 'Yazı + hakediş.' },
        ],
      },
      {
        heading: 'D. İmar ve ruhsat',
        paragraphs: [
          'Plan–parsel–ruhsat–yapı kullanma (iskan) zinciri. Ruhsatsız yapı, ruhsata aykırılık, mühür, yıkım ve idari para cezası çerçevede bilinir.',
          'Yüklenici ve arsa sahibi sorumluluğu olay tipine göre ayrılır; “ben bilmiyordum” yetmez.',
        ],
        uyari: 'Ruhsat yoksa sözleşme geçerli olsa da kamu yaptırımı ayrıdır.',
      },
      {
        heading: 'E. Yapı denetimi ve iskan (giriş)',
        paragraphs: [
          'Yapı denetim kuruluşu, fenni mesul, kontrol. Yapı kullanma izni olmadan kullanım riskleri. 2. dönemde ayıp ve sorumlulukla bağlanır.',
        ],
      },
      {
        heading: 'F. Kat karşılığı inşaat',
        paragraphs: [
          'Arsa payı devri, bağımsız bölüm vaadi, inşaat süresi, teminat, cezai şart. Şekil ve tapu işlemleri kritiktir; vaadin gücü ispat ve tescile bağlıdır.',
          'Arsa sahibi–yüklenici–üçüncü kişi alıcı üçgeni sınav klasiğidir.',
        ],
        hapBilgi: 'Kat karşılığı = inşaat borcu + pay/bağımsız bölüm.',
      },
      {
        heading: 'G. Teminat girişi',
        paragraphs: [
          'Kesin teminat, avans teminatı, performans bond (uygulama dili), ipotek, cezai şart. Kamu işlerinde ihale teminatları 2. dönemde açılır.',
        ],
      },
    ],
    examples: [
      {
        title: 'Eser mi vekâlet mi?',
        facts:
          'Mimar “proje çizeyim, sonucu garanti etmem” der; müteahhit “binayı teslim ederim” der.',
        analysis:
          'Vekâlet / eser ayrımı. Sonuç taahhüdü. Borç türü.',
        takeaway: 'Sonuç vaadi = eser izi.',
      },
      {
        title: 'Ruhsat',
        facts:
          'Sözleşme imzalanır; ruhsat alınmadan kaba inşaat başlar.',
        analysis:
          'İdari aykırılık. Yaptırım. Sözleşme–kamu gerilimi.',
        takeaway: 'Ruhsat kapısını yaz.',
      },
      {
        title: 'Kat karşılığı',
        facts:
          'Arsa sahibi pay devreder; yüklenici inşaatı yarıda bırakır.',
        analysis:
          'Eser borcu. Teminat. Dönme / tazminat. Üçüncü kişi alıcı.',
        takeaway: 'Pay devri inşaatı bitirmez.',
      },
      {
        title: 'Götürü bedel',
        facts:
          'Keşif artar; yüklenici ek bedel ister; sözleşmede sessizlik.',
        analysis:
          'Götürü rejim. Olağanüstü durum / ek iş ayrımı. İspat.',
        takeaway: 'Bedel tipini ilk yaz.',
      },
    ],
    mindmap: {
      center: 'İnşaat Hukuku · 1. dönem',
      branches: [
        { label: 'Sözleşme', items: ['Eser', 'Bedel', 'Taraflar'] },
        { label: 'Kamu', items: ['İmar', 'Ruhsat'] },
        { label: 'Model', items: ['Kat karşılığı'] },
        { label: 'Güvence', items: ['Teminat'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Ayıp, gecikme, fesih ve uyuşmazlık. İnşaat sahadaki kriz hukuku.',
    promise:
      'Eserde ayıp ve kabul, gecikme ve cezai şart, fesih, alt yüklenici, kamu inşaatı/ihale girişi, teminatın paraya çevrilmesi, arabuluculuk/yargı. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Ayıp: eserin kararlaştırılan / beklenen niteliğe aykırılığı.',
      'Kabul / teslim: risk ve ayıp sürelerini etkiler.',
      'Gecikme: süre + cezai şart + temerrüt.',
      'Fesih: iş sahibi / yüklenici sebepleri (TBK çerçevesi).',
      'Alt yüklenici: zincir sorumluluk; asıl sözleşme kuralı.',
      'Kamu işi: KİK + idari şartname + teminat.',
    ],
    pillars: [
      'Eserde ayıp ve seçimlik haklar',
      'Teslim, kabul ve zamanaşımı (çerçeve)',
      'Gecikme ve cezai şart',
      'Sözleşmenin sona ermesi / fesih',
      'Alt yüklenici ilişkileri',
      'Kamu inşaatı ve ihale girişi',
      'Teminatın paraya çevrilmesi',
      'Uyuşmazlık çözümü',
    ],
    definitions: [
      {
        baslik: 'Eserde ayıp',
        govde:
          'Eserin sözleşmede kararlaştırılan veya objektif olarak beklenen niteliklere aykırı olmasıdır. Açık/gizli ayıp, bildirim ve zamanaşımı ayrı yazılır.',
      },
      {
        baslik: 'Kabul',
        govde:
          'İş sahibinin eseri ayıplı olup olmadığını denetleyerek devralmasıdır. Açık ayıplarda susma sonuç doğurabilir; gizli ayıp ayrı rejimdedir (çerçeve).',
      },
      {
        baslik: 'Cezai şart',
        govde:
          'Gecikme veya aykırılık hâlinde kararlaştırılan götürü edimdir. Aşırıysa indirim talep edilebilir (TBK). İnşaatta günlük gecikme cezası yaygındır.',
      },
      {
        baslik: 'Alt yüklenici',
        govde:
          'Asıl yüklenicinin işin bir kısmını devrettiği üçüncü kişidir. İş sahibiyle doğrudan sözleşme kural olarak yoktur; istisnalar ve müteselsil sorumluluk olay tipine göre tartışılır.',
      },
      {
        baslik: 'Kesin teminat',
        govde:
          'Özellikle kamu ihalelerinde, sözleşmenin ifasını güvence altına alan teminattır. İhlalde paraya çevrilebilir; şartları ihale/sözleşme metnindedir.',
      },
    ],
    traps: [
      'Her çatlağı ayıp sanmak — tolerans / kullanım / bakım ayrımı.',
      'Kabulü “anahtar teslimi” sanıp ayıp hakkını silmek — gizli ayıp.',
      'Cezai şartı sınırsız sanmak — aşırılık indirimi.',
      'Alt yükleniciyi iş sahibiyle doğrudan borçlu saymak (kural).',
      'Kamu işinde yalnız TBK yazmak — KİK/şartname unutma.',
    ],
    keyMadde: [
      'TBK eser — ayıp, kabul, zamanaşımı (çerçeve; güncel metin)',
      'TBK — temerrüt, fesih, cezai şart (çerçeve)',
      'Kamu İhale Kanunu / sözleşme uygulamaları (giriş)',
      'İmar / yapı denetimi — ayıp ve sorumluluk köprüsü',
      'Kat karşılığı — ayıp ve gecikmede arsa sahibi–yüklenici',
      'İİK / teminat paraya çevirme (uygulama köprüsü, çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Ayıp ve seçimlik haklar',
        paragraphs: [
          'Onarım, bedelden indirim, sözleşmeden dönme, tazminat (TBK eser çerçevesi). Sıra ve bildirim süreleri yazılır; uydurma gün yok.',
          'Statik, su yalıtımı, ısıtma, işçilik ayıpları tipik senaryodur. Bilirkişi sık devreye girer.',
        ],
        hapBilgi: 'Ayıp = nitelik aykırılığı + bildirim + hak.',
      },
      {
        heading: 'B. Teslim ve kabul',
        paragraphs: [
          'Fiili teslim, tutanak, anahtar, iskan ilişkisi. Kabul, açık ayıpları etkiler; gizli ayıp sonradan ortaya çıkar.',
          'Risk geçişi ve bedel muacceliyeti teslim/kabulle bağlanabilir.',
        ],
        kartlar: [
          { baslik: 'Teslim', govde: 'Fiili devir.' },
          { baslik: 'Kabul', govde: 'Denetim + devralma.' },
          { baslik: 'Açık ayıp', govde: 'Görülebilir.' },
          { baslik: 'Gizli ayıp', govde: 'Sonradan ortaya çıkar.' },
        ],
      },
      {
        heading: 'C. Gecikme ve cezai şart',
        paragraphs: [
          'Süre uzatımı sebepleri: mücbir sebep, iş sahibi gecikmesi, ruhsat/idare. Yüklenici temerrüdünde cezai şart + tazminat yarışı bilinçli yazılır.',
          'Günlük ceza birikimi aşırıya varırsa indirim talebi.',
        ],
        uyari: 'Gecikme sebebini ilk cümlede ayır: kimin kusuru?',
      },
      {
        heading: 'D. Fesih ve sona erme',
        paragraphs: [
          'İş sahibinin keyfi fesihte tazminat; yüklenici ayıbı/gecikmesiyle fesih; imkânsızlık. Kat karşılığında pay iadesi ve inşaatın durumu özel hesap ister.',
          'Sınav iskeleti: sebep → sonuç → tasfiye.',
        ],
      },
      {
        heading: 'E. Alt yüklenici',
        paragraphs: [
          'Asıl yüklenici iş sahibine karşı sorumlu kalır (kural). Alt yükleniciyle ilişki iç ilişkidir. Yasak alt yüklenici / onay şartı sözleşmede aranır.',
          'İş kazası ve SGK boyutu ayrı ders köprüsüdür; sınavda bir cümle yeter.',
        ],
      },
      {
        heading: 'F. Kamu inşaatı girişi',
        paragraphs: [
          'İhale, yaklaşık maliyet, sözleşmeye davet, kesin teminat, hakediş, fiyat farkı, iş artışı–azalışı (çerçeve). İdari yargı / özel hukuk ayrımı olay tipine göre.',
          'Uydurma ihale eşiği yazma; güncel KİK’i doğrula.',
        ],
        hapBilgi: 'Kamu işi = KİK + şartname + teminat.',
      },
      {
        heading: 'G. Uyuşmazlık',
        paragraphs: [
          'Arabuluculuk (varsa zorunluluk güncel rejim), bilirkişi, ihtiyati tedbir, tapu iptal–tescil (kat karşılığı), tahkim (uluslararası/büyük projeler). Delil: sözleşme, hakediş, fotoğraf, yapı denetim raporları.',
        ],
      },
    ],
    examples: [
      {
        title: 'Gizli ayıp',
        facts:
          'Teslimden 1 yıl sonra su yalıtımı çöker; yüklenici “kabul ettiniz” der.',
        analysis:
          'Gizli ayıp. Bildirim. Zamanaşımı. Onarım/tazminat.',
        takeaway: 'Kabul her ayıbı silmez.',
      },
      {
        title: 'Gecikme cezası',
        facts:
          '200 gün × yüksek günlük ceza; bedelin katı talep edilir.',
        analysis:
          'Cezai şart. Aşırılık indirimi. Kusur / süre uzatımı.',
        takeaway: 'Ceza + indirim birlikte düşün.',
      },
      {
        title: 'Alt yüklenici',
        facts:
          'İş sahibi doğrudan alt yükleniciye dava açar; sözleşme yok.',
        analysis:
          'Nispilik. Asıl yüklenici. İstisna / müteselsil iddiası.',
        takeaway: 'Zinciri çiz.',
      },
      {
        title: 'Kamu teminatı',
        facts:
          'Yüklenici gecikir; idare kesin teminatı irat kaydeder.',
        analysis:
          'Sözleşme/şartname. Teminat şartları. İtiraz yolu.',
        takeaway: 'Kamu işinde teminat metni okunur.',
      },
    ],
    mindmap: {
      center: 'İnşaat Hukuku · 2. dönem',
      branches: [
        { label: 'Ayıp', items: ['Kabul', 'Haklar'] },
        { label: 'Süre', items: ['Gecikme', 'Cezai şart'] },
        { label: 'Zincir', items: ['Alt yüklenici', 'Fesih'] },
        { label: 'Kamu', items: ['İhale', 'Teminat'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Eser ve ruhsattan ayıp–gecikme–feshe, kat karşılığından kamu işine tek omurga.',
    promise:
      '1. + 2. dönem birleşik; inşaat hukuku için “tek cilt” not. Sözleşme + imar + sahadaki kriz hukuku.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: sözleşme/ruhsat mı, ayıp/gecikme/merci mi?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: eser–bedel–ruhsat → kat karşılığı → ayıp–gecikme → alt yüklenici–kamu → karma.',
          'Her soruda: “Sözleşme tipi? Ruhsat? Ayıp/gecikme? Kim sorumlu?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru sözleşme + kamu kapısı + doğru talep.',
        bullets: [
          'Hafta 1–3: eser + taraflar + bedel',
          'Hafta 4–6: imar/ruhsat + kat karşılığı',
          'Hafta 7–10: ayıp + kabul + gecikme + fesih',
          'Hafta 11–14: alt yüklenici + kamu + uyuşmazlık + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Eser/vekâlet. Tip 2 — Ruhsat. Tip 3 — Kat karşılığı. Tip 4 — Ayıp. Tip 5 — Gecikme/cezai şart. Tip 6 — Kamu teminatı.',
          'Karma olayda önce özel hukuk ilişkisi, sonra kamu boyutu, en sonda talep ve delil. Uydurma süre/eşiği yazma.',
        ],
        uyari: 'İmar/ruhsatı unutup yalnız TBK ile bitirme.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'İnşaat Hukuku · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Eser', 'Ruhsat', 'Kat karşılığı'] },
        { label: '2. yarı', items: ['Ayıp', 'Gecikme', 'Kamu'] },
        { label: 'Taraflar', items: ['İş sahibi', 'Yüklenici'] },
        { label: 'Yöntem', items: ['Kapı seç', 'Talep yaz'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'insaat-hukuku-donem-1': d1Content,
  'insaat-hukuku-donem-2': d2Content,
  'insaat-hukuku-yillik': yillikContent,
};

export const INSAAT_HUKUKU_VARIANTS = [
  'insaat-hukuku-donem-1',
  'insaat-hukuku-donem-2',
  'insaat-hukuku-yillik',
];

export function buildInsaatHukukuVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} İnşaat Hukuku ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} İnşaat Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için İnşaat Hukuku ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için İnşaat Hukuku ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: eser sözleşmesi, imar–ruhsat ve sahadaki ayıp/gecikme sorunlarını sınavda bozmadan yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Özel hukuk (TBK eser) ile kamu (imar/ruhsat/ihale) katmanını ayırarak okuyun.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: sözleşme tipi + ruhsat durumu',
        'Ayıp / gecikme / fesih kutusunu seç',
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
        'TBK eser, İmar Kanunu, yapı denetimi, KMK ve (kamu işinde) KİK köprüdür. Güncel metinden doğrulayın.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma süre / ihale eşiği / ruhsat yaptırımı yazmayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (İnşaat Hukuku)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık işe yarar. 60 dk / 2–3 soruda önce sözleşme + ruhsat, sonra talep.`,
        'İskelet: (1) sözleşme tipi (2) taraflar (3) ruhsat/imar (4) ayıp-gecikme-fesih (5) sonuç.',
      ],
      bullets: [
        'Eser / kat karşılığı / kamu işi ayır',
        'Ruhsat cümlesini unutma',
        'Ayıp ve gecikmeyi karıştırma',
        'Alt yüklenici zincirini çiz',
      ],
      hapBilgi: 'Doğru sözleşme + kamu kapısı = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `İnşaat Hukuku ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Sözleşme tipi',
        'Taraflar ve bedel',
        'İmar / ruhsat',
        'Ayıp veya gecikme',
        'Fesih / teminat',
        'Talep ve delil',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'insaat-hukuku-donem-2'
          ? [
              ['Ayıp', 'Gecikme', 'Nitelik mi süre mi?'],
              ['Açık ayıp', 'Gizli ayıp', 'Kabulde görünür mü?'],
              ['Asıl yüklenici', 'Alt yüklenici', 'Kimle sözleşme var?'],
              ['Özel inşaat', 'Kamu ihalesi', 'TBK mi KİK mi?'],
            ]
          : variantCode === 'insaat-hukuku-donem-1'
            ? [
                ['Eser', 'Vekâlet', 'Sonuç taahhüdü var mı?'],
                ['Götürü bedel', 'Birim fiyat', 'Toplu mu miktar mı?'],
                ['Ruhsat', 'Sözleşme', 'Kamu izni mi borç ilişkisi mi?'],
                ['Kat karşılığı', 'Satış', 'İnşaat borcu var mı?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Kuruluş/ruhsat mı ayıp/gecikme mi?'],
                ['Eser', 'Kat karşılığı', 'Bedel nakit mi pay mı?'],
                ['Ayıp', 'Gecikme', 'Nitelik mi süre mi?'],
                ['Özel', 'Kamu', 'TBK mi ihale mi?'],
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
      leftTitle: 'Sözleşme / ruhsat',
      rightTitle: 'Ayıp / gecikme',
      left: 'Eser–bedel–imar–kat karşılığı',
      right: 'Kabul–gecikme–fesih–kamu teminatı',
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
      a: '1. dönem eser–bedel–imar/ruhsat–kat karşılığı; 2. dönem ayıp–gecikme–fesih–alt yüklenici–kamu/uyuşmazlık; yıllık ikisini birleştirir.',
    },
    {
      q: 'İmar bilgisi ne kadar gerekli?',
      a: 'Sınavda ruhsat–iskan–yaptırım omurgası yeter; detay plan notasyonu değil, hukuki sonuç yazılır.',
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
    'Eser / kat karşılığı / kamu ayrımını denedim',
    'PDF’i arşivledim',
    variantCode === 'insaat-hukuku-yillik'
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
      `${uni.shortName} inşaat hukuku ${meta.short}`,
      `${uni.shortName} eser sözleşmesi ders notu`,
      `inşaat hukuku ${meta.short} not pdf`,
      'kat karşılığı yapı ruhsatı ayıp gecikme',
      'inşaat hukuku yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} inşaat hukuku`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format: uni.type === 'vakif' ? 'Klasik + ara; vaka/ödev olabilir' : 'Klasik yazılı + vaka analizi',
      tips: [
        'Sözleşme tipini ilk yaz',
        'Ruhsat cümlesini ekle',
        'Ayıp / gecikme ayır',
        'Kat karşılığı üçgenini çiz',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `İnşaat hukuku ${meta.short} kurumlarını ayırır`,
      'Eser ve kat karşılığı rejimini kurar',
      'İmar–ruhsat boyutunu soruya bağlar',
      'Ayıp, gecikme ve fesih taleplerini uygular',
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
    relatedCourses: INSAAT_HUKUKU_VARIANTS.filter((c) => c !== variantCode).concat([
      'insaat-hukuku',
      'borclar-ozel-yillik',
      'esya-hukuku-yillik',
      'idare-hukuku-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'insaat-hukuku-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'insaat-hukuku',
    variantLabel: meta.label,
  };
}
