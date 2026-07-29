/**
 * İdare Hukuku —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * idare-hukuku dersiyle hizalı; idari yargılama ayrı derstir.
 */

function baseMeta(variant) {
  const labels = {
    'idare-hukuku-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'İdare · 1. yarı (idare kavramı, teşkilat, idari işlem, idari sözleşme girişi, kamu malları, personel girişi)',
    },
    'idare-hukuku-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'İdare · 2. yarı (kamu hizmeti, kolluk, idari sorumluluk, yargı denetimi girişi, kamulaştırma/özelleştirme girişi)',
    },
    'idare-hukuku-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'İdare hukuku tam omurga · teşkilat–işlem–sorumluluk · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: İdare kimdir, nasıl örgütlenir, idari işlem nasıl kurulur ve bozulur?',
    promise:
      'İdare ve kamu gücü, merkezden/yerinden yönetim, idari işlem (unsur–şekil–yetki–sebep–konu–amaç), idari sözleşme girişi, kamu malları, kamu görevlisi girişi. Güz finalinde işlem iskeleti bozulmadan yazarsınız.',
    sixtySecond: [
      'İdare: kamu yararı için kamu gücü kullanan örgüt.',
      'Merkezden yönetim / yerinden yönetim / yetki genişliği.',
      'İdari işlem: tek yanlı, icrai, hukuki sonuç doğuran.',
      'Beş unsur: yetki, şekil, sebep, konu, amaç.',
      'Yokluk / iptal / geri alma / kaldırma ayrımı bilin.',
      'Kamu malı ve kamu görevlisi girişi: özel rejim.',
    ],
    pillars: [
      'İdare hukuku kavramı ve ilkeleri',
      'İdari teşkilat',
      'İdari işlem teorisi',
      'İşlemin unsurları ve sakatlıkları',
      'İdari işlemin sona ermesi',
      'İdari sözleşme girişi',
      'Kamu malları',
      'Kamu personeli girişi',
    ],
    definitions: [
      {
        baslik: 'İdari işlem',
        govde:
          'İdarenin, kamu gücü kullanarak, tek yanlı iradesiyle hukuki sonuç doğuran icrai işlemidir. Bireysel ve düzenleyici işlem ayrımı vardır.',
      },
      {
        baslik: 'Yetki',
        govde:
          'İşlemi yapmaya kanunen yetkili makamın, konu–yer–zaman bakımından yetkili olmasıdır. Yetki gasbı en ağır sakatlıklardandır.',
      },
      {
        baslik: 'Düzenleyici işlem',
        govde:
          'Genel, soyut ve sürekli kurallar koyan idari işlemdir (yönetmelik, tebliğ vb. çerçeve). Birel işlemden ayrılır.',
      },
      {
        baslik: 'Kamu malı',
        govde:
          'Kamu hizmetine veya kamunun ortak kullanımına tahsis edilmiş mallardır. Özel mülkiyete göre devir ve haciz rejimi farklıdır.',
      },
      {
        baslik: 'Kamu hizmeti (giriş)',
        govde:
          'Devlet veya kamu tüzel kişilerinin kamu yararı amacıyla yürüttüğü sürekli faaliyetlerdir. Tanım ve yürütme usulleri 2. dönemde derinleşir.',
      },
    ],
    traps: [
      'İdari işlemi her idare eylemi sanmak — icrailik şart.',
      'Yetki gasbı ile yetki tecavüzünü karıştırmak.',
      'Geri alma ile kaldırmayı aynı sanmak.',
      'Kamu malını “devletin her malı” diye genellemek.',
      'İdari yargıyı bu derste tamamen çözmeye çalışmak — ayrı ders var.',
    ],
    keyMadde: [
      'Anayasa m.123 vd. — idarenin bütünlüğü / kanunilik (çerçeve)',
      'İYUK — yargı denetimi çerçevesi (köprü)',
      '657 s.K. — memurlar (personel girişi)',
      '2886 / 4734 vb. — ihale/sözleşme çerçevesi (giriş)',
      'Kamu malları ve tahsis — doktrin + ilgili kanunlar',
    ],
    sectionsExtra: [
      {
        heading: 'A. İdare hukuku nedir?',
        paragraphs: [
          'İdare hukuku, idarenin örgütlenmesi, işlemesi ve denetlenmesinin kurallarını koyar. Özel hukuktan farkı kamu gücü ve kamu yararıdır.',
          '1. dönem teşkilat ve işlem omurgasını taşır. Sorumluluk, kolluk, kamu hizmeti derinliği 2. döneme kalır; iptal/tam yargı ayrıntısı idari yargılama dersindedir.',
        ],
        hapBilgi: 'Kamu gücü + kamu yararı = idare hukuku damgası.',
      },
      {
        heading: 'B. İdari teşkilat',
        paragraphs: [
          'Merkezden yönetim (bakanlıklar, taşra) ve yerinden yönetim (mahalli idareler, hizmet yerinden yönetim) ayrılır. Yetki genişliği ve vesayet denetimi yazılır.',
          'Kamu tüzel kişiliği, bakanlık hiyerarşisi ve bağlı/ilgili kuruluşlar sınavda sık sorulur.',
        ],
        bullets: [
          'Merkezden yönetim',
          'Yerinden yönetim',
          'Vesayet / hiyerarşi',
          'Kamu tüzel kişisi',
        ],
      },
      {
        heading: 'C. İdari işlem',
        paragraphs: [
          'Tek yanlılık, icrailik, hukuki sonuç. Bireysel (birel) ve düzenleyici işlem. Zımni ret/kabul gibi kurumlar bilinir.',
          'İşlemin yürürlüğü, tebliğ/ilan ve icrai karakter sınav iskeletidir.',
        ],
        kartlar: [
          { baslik: 'Yetki', govde: 'Kim, hangi konuda?' },
          { baslik: 'Şekil', govde: 'Usul ve biçim.' },
          { baslik: 'Sebep', govde: 'Hukuki/fiili dayanak.' },
          { baslik: 'Konu', govde: 'Hukuki sonuç.' },
          { baslik: 'Amaç', govde: 'Kamu yararı.' },
        ],
      },
      {
        heading: 'D. Sakatlıklar ve sona erme',
        paragraphs: [
          'Yokluk, iptal edilebilirlik, geri alınabilirlik ayrı sonuçlar doğurur. Yetki gasbı yokluk; diğer sakatlıklar genelde iptal edilebilirlik rejimindedir (çerçeve).',
          'Geri alma (geçmişe etkili) ile kaldırma (geleceğe etkili) ve süreler yazılır. Yargısal iptal idari yargılamaya bağlanır.',
        ],
        uyari: 'Yokluk ≠ iptal. Sonuç ve süre farklıdır.',
      },
      {
        heading: 'E. İdari sözleşme girişi',
        paragraphs: [
          'İdarenin özel hukuk sözleşmesinden farklı, kamu hizmeti / imtiyaz / yap-işlet devret benzeri idari sözleşmeler vardır. Kamu gücü ayrıcalıkları ve özel yargı yolu tartışılır.',
          '2. dönemde kamu hizmeti ile birlikte okunur; ihale hukuku girişi yeterlidir.',
        ],
      },
      {
        heading: 'F. Kamu malları',
        paragraphs: [
          'Orta mallar, hizmet malları, sahipsiz mallar sınıflandırması bilinir. Tahsis, devir yasağı, haciz yasağı ve kamulaştırma köprüsü yazılır.',
        ],
      },
      {
        heading: 'G. Kamu personeli girişi',
        paragraphs: [
          'Memur, sözleşmeli, işçi ayrımı; atama, disiplin, güvence iskeleti. Detay 657 ve personel hukuku derinliğindedir; 1. dönemde statü farkı yeterlidir.',
        ],
      },
    ],
    examples: [
      {
        title: 'Yetki gasbı',
        facts:
          'Yetkisiz birim, başka makama ait ruhsatı iptal eder.',
        analysis:
          'Yetki unsuru. Gasbın sonucu (yokluk). İptal davası köprüsü.',
        takeaway: 'Yetkisiz makam = en ağır sakatlık.',
      },
      {
        title: 'Düzenleyici / birel',
        facts:
          'Genel bir yönetmelik maddesi ve buna dayanan bireysel ret kararı tartışılır.',
        analysis:
          'Düzenleyici işlem. Birel işlem. İkisi de idari işlem. Denetim yolu.',
        takeaway: 'Soyut kural ≠ somut uygulama; ikisi de işlem.',
      },
      {
        title: 'Geri alma',
        facts:
          'İdare, hukuka aykırı ruhsatı yıllar sonra geri alır; ilgililer kazanılmış hak iddia eder.',
        analysis:
          'Geri alma şartları. Süre. Kazanılmış hak / güven ilkesi dengesi.',
        takeaway: 'Geri alma serbest değildir; şart ve süre var.',
      },
      {
        title: 'Kamu malı',
        facts:
          'Park alanı özel kişice satılmak istenir; haciz konulur.',
        analysis:
          'Kamu malı niteliği. Devir/haciz yasağı. Tahsisin kalkması.',
        takeaway: 'Kamu malı özel rejimdedir.',
      },
    ],
    mindmap: {
      center: 'İdare · 1. dönem',
      branches: [
        { label: 'Teşkilat', items: ['Merkez', 'Yerel', 'Vesayet'] },
        { label: 'İşlem', items: ['Yetki', 'Şekil', 'Sebep', 'Konu', 'Amaç'] },
        { label: 'Sakatlık', items: ['Yokluk', 'İptal', 'Geri alma'] },
        { label: 'Mal / personel', items: ['Kamu malı', 'Memur'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Kamu hizmeti, kolluk, sorumluluk, yargı denetimi girişi. İdare zarar verirse ve denetlenirse ne olur?',
    promise:
      'Kamu hizmeti, kolluk yetkisi, idari sorumluluk (hizmet kusuru / kusursuz), yargı denetimi girişi, kamulaştırma ve özelleştirme girişi. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Kamu hizmeti: süreklilik, eşitlik, değişkenlik ilkeleri.',
      'Kolluk: kamu düzeni (dirlik, güvenlik, sağlık, ahlak çerçevesi).',
      'Hizmet kusuru: kötü, geç, hiç işlememe.',
      'Kusursuz sorumluluk: risk / fedakârlığın denkleştirilmesi.',
      'Yargı denetimi: iptal + tam yargı (ayrıntı idari yargılama).',
      'Kamulaştırma: kamu yararı + bedel + usul.',
    ],
    pillars: [
      'Kamu hizmeti',
      'Kolluk ve kamu düzeni',
      'İdari sorumluluk genel',
      'Hizmet kusuru',
      'Kusursuz sorumluluk',
      'Yargı denetimi girişi',
      'Kamulaştırma girişi',
      'Özelleştirme / ruhsat rejimleri girişi',
    ],
    definitions: [
      {
        baslik: 'Hizmet kusuru',
        govde:
          'Kamu hizmetinin kötü işlemesi, geç işlemesi veya hiç işlememesi nedeniyle doğan kusur temelli idari sorumluluktur.',
      },
      {
        baslik: 'Kusursuz sorumluluk',
        govde:
          'İdarenin kusuru aranmaksızın, risk veya fedakârlığın denkleştirilmesi gibi sebeplerle tazminat ödemesidir.',
      },
      {
        baslik: 'Kolluk',
        govde:
          'Kamu düzenini korumak ve bozulmasını önlemek için idarenin kullandığı yetki ve faaliyetler bütünüdür.',
      },
      {
        baslik: 'İptal davası (giriş)',
        govde:
          'İdari işlemin hukuka aykırılığının tespiti ve iptali için idari yargıda açılan davadır. Ayrıntı idari yargılama dersindedir.',
      },
      {
        baslik: 'Tam yargı davası (giriş)',
        govde:
          'İdareden tazminat veya idari eyleme/işleme bağlı hak taleplerinin görüldüğü davadır. Sorumlulukla bağlanır.',
      },
    ],
    traps: [
      'Hizmet kusurunu her zaman “memurun kişisel kusuru” sanmak.',
      'Kişisel kusur / hizmet kusuru ayrımını atlamak.',
      'Kusursuz sorumluluğu her zarara yaymak.',
      'Kolluk yetkisini sınırsız sanmak — ölçülülük.',
      'İYUK sürelerini bu notta uydurmak — yargılama dersine bırak/ doğrula.',
    ],
    keyMadde: [
      'Anayasa m.125 — idarenin yargısal denetimi',
      'Anayasa m.46 — kamulaştırma (çerçeve)',
      'İYUK — iptal / tam yargı (çerçeve, köprü)',
      '2942 s.K. — kamulaştırma (çerçeve)',
      'Kolluk ve kamu hizmeti — doktrin + ilgili özel kanunlar',
    ],
    sectionsExtra: [
      {
        heading: 'A. Kamu hizmeti',
        paragraphs: [
          'Kamu yararı, süreklilik, eşitlik, değişkenlik (adaptasyon) ilkeleri bilinir. Emanet, imtiyaz, ruhsat, şirketleştirme gibi yürütme usulleri ayrılır.',
          'Özelleştirme ve kamu–özel işbirliği girişi 2. dönem finalinde sık sorulur.',
        ],
        hapBilgi: 'Kamu hizmeti = kamu yararı + süreklilik iskeleti.',
      },
      {
        heading: 'B. Kolluk',
        paragraphs: [
          'Kamu düzeninin unsurları ve kolluk tedbirlerinin ölçülülüğü yazılır. Adli kolluk / idari kolluk ayrımı bilinir.',
          'Genel kolluk ve özel kolluk (belediye, orman vb.) yetki kaynağı farklıdır.',
        ],
        bullets: [
          'Kamu düzeni',
          'Ölçülülük',
          'Genel / özel kolluk',
          'Tedbir–yaptırım',
        ],
      },
      {
        heading: 'C. İdari sorumluluk',
        paragraphs: [
          'İdare, eylem ve işlemleriyle verdiği zarardan sorumludur (Anayasa m.125 çerçevesi). Hizmet kusuru klasik yoldur; kusursuz sorumluluk istisnai/genişleyen alandır.',
          'Nedensellik, zarar, illiyet bağı ve rücu (kişisel kusurda memura) yazılır.',
        ],
        kartlar: [
          { baslik: 'Hizmet kusuru', govde: 'Kötü / geç / hiç.' },
          { baslik: 'Kusursuz', govde: 'Risk / denkleştirme.' },
          { baslik: 'Kişisel kusur', govde: 'Görevden ayrılabilir.' },
          { baslik: 'Rücu', govde: 'İdare → görevli.' },
        ],
        uyari: 'Kişisel kusur varsa idare–görevli ilişkisi ayrı kutu.',
      },
      {
        heading: 'D. Yargı denetimi girişi',
        paragraphs: [
          'İdari işlem ve eylemler yargı denetimine tabidir. İptal (hukuka aykırılık) ve tam yargı (tazminat) ana davalaradır. Süre, ehliyet, menfaat, görev — idari yargılama dersinde derinleşir.',
          'Bu notta “hangi dava, ne için?” seviyesinde kalın; İYUK ezberini oraya taşıyın.',
        ],
      },
      {
        heading: 'E. Kamulaştırma girişi',
        paragraphs: [
          'Kamu yararı kararı, tebliğ, bedel, tescil ve acele kamulaştırma çerçevesi bilinir. Anayasa güvencesi ve bedelin peşin ödenmesi ilkesi yazılır.',
        ],
      },
      {
        heading: 'F. Ruhsat ve özelleştirme girişi',
        paragraphs: [
          'Ruhsat, izin, lisans kamu hizmeti/kolluk kesişimindedir. Özelleştirme yöntemleri ve yargı denetimi sınavda çerçeve olarak sorulur.',
        ],
      },
      {
        heading: 'G. 1. dönem ile bağ',
        paragraphs: [
          'Sorumluluk çoğu zaman sakat işlem veya kötü hizmetten doğar. Önce işlem unsuru, sonra zarar–illiyet–davayı yazın.',
        ],
      },
    ],
    examples: [
      {
        title: 'Hizmet kusuru',
        facts:
          'Belediye yol çukurunu uzun süre onarmaz; vatandaş zarar görür.',
        analysis:
          'Hizmetin geç/kötü işlemesi. Zarar. İlliyet. Tam yargı.',
        takeaway: 'Kötü/geç/hiç = hizmet kusuru kutusu.',
      },
      {
        title: 'Kişisel / hizmet kusuru',
        facts:
          'Memur görevde ağır hakaret ve darp eder; mağdur idareyi de davalı yapar.',
        analysis:
          'Hizmetle bağlantı. Kişisel kusur. İdarenin sorumluluğu / rücu.',
        takeaway: 'Bağlantı var mı, ayrılabilir mi?',
      },
      {
        title: 'Kolluk ölçülülüğü',
        facts:
          'Belediye, orantısız yasak getirir; esnaf kapanır.',
        analysis:
          'Kamu düzeni. Ölçülülük. İşlem sakatlığı. İptal.',
        takeaway: 'Kolluk sınırsız değildir.',
      },
      {
        title: 'Kamulaştırma',
        facts:
          'Kamu yararı ilan edilir; bedel düşük bulunur.',
        analysis:
          'Usul. Bedel tespiti. Dava yolu. Anayasal güvence.',
        takeaway: 'Yarar + bedel + usul.',
      },
    ],
    mindmap: {
      center: 'İdare · 2. dönem',
      branches: [
        { label: 'Hizmet', items: ['İlkeler', 'Yürütme usulü'] },
        { label: 'Kolluk', items: ['Düzen', 'Ölçülülük'] },
        { label: 'Sorumluluk', items: ['Hizmet kusuru', 'Kusursuz'] },
        { label: 'Denetim', items: ['İptal', 'Tam yargı'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Teşkilat ve idari işlemden sorumluluk ve yargı denetimine kadar tek omurga.',
    promise:
      '1. + 2. dönem birleşik; idare hukuku için “tek cilt” not. İptal/tam yargı usulü için idari yargılama ders notuna bakın.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: işlem/teşkilat mı, sorumluluk/kolluk/hizmet mi?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: teşkilat–işlem unsurları → deneme → sorumluluk–kolluk–hizmet → karma.',
          'Her soruda etiket: “İşlem sakatlığı mı, zarar/sorumluluk mu, kolluk/hizmet mi?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru işlem unsuru + doğru sorumluluk yolu.',
        bullets: [
          'Hafta 1–4: teşkilat + idari işlem unsurları',
          'Hafta 5–7: sakatlık + kamu malı + personel',
          'Hafta 8–11: kamu hizmeti + kolluk + sorumluluk',
          'Hafta 12–14: yargı girişi + kamulaştırma + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Yetki gasbı. Tip 2 — Geri alma. Tip 3 — Hizmet kusuru. Tip 4 — Kolluk ölçülülüğü. Tip 5 — Kusursuz sorumluluk. Tip 6 — Kamulaştırma.',
          'Karma olayda sakat ruhsat + zarar üst üste binebilir. Sıra: işlem hukuka uygun mu → zarar → sorumluluk türü → dava türü.',
        ],
        uyari: 'İYUK süre/ehliyet detayını idari yargılama notuna bırakın; burada köprü kurun.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'İdare · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Teşkilat', 'İşlem', 'Sakatlık'] },
        { label: '2. yarı', items: ['Hizmet', 'Kolluk', 'Sorumluluk'] },
        { label: 'Denetim', items: ['İptal', 'Tam yargı'] },
        { label: 'Yöntem', items: ['Unsur yaz', 'Zarar bağla'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'idare-hukuku-donem-1': d1Content,
  'idare-hukuku-donem-2': d2Content,
  'idare-hukuku-yillik': yillikContent,
};

export const IDARE_HUKUKU_VARIANTS = [
  'idare-hukuku-donem-1',
  'idare-hukuku-donem-2',
  'idare-hukuku-yillik',
];

export function buildIdareHukukuVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} İdare Hukuku ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} İdare Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için İdare Hukuku ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için İdare Hukuku ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: idari işlem unsurlarını ve sorumluluk/kolluk iskeletini doğru yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. İptal/tam yargı usulü için idari yargılama ders notunu kullanın.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: işlem mi eylem mi?',
        'Beş unsuru numarala',
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
      paragraphs: ['Soru tipine göre dayanaklar. Anayasa + özel kanunlar + İYUK köprüsü.'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde no yazmayın; metinden doğrulayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (İdare Hukuku)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) işlem/eylem (2) unsur veya sorumluluk türü (3) olgu (4) sonuç (iptal/tazminat/yokluk).',
      ],
      bullets: [
        'Yetki–şekil–sebep–konu–amaç yaz',
        'Yokluk / iptal ayır',
        'Hizmet kusuru / kusursuz ayır',
        'Yargı yolunu köprüle (İYUK detayı ayrı)',
      ],
      hapBilgi: 'Doğru unsur + doğru sorumluluk = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `İdare Hukuku ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'İşlem mi eylem mi?',
        'Beş unsur / sorumluluk türü',
        'Sakatlık veya kusur',
        'Olayı yedir',
        'Sonuç (yokluk/iptal/tazminat)',
        'Yargı yolu notu',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'idare-hukuku-donem-2'
          ? [
              ['Hizmet kusuru', 'Kusursuz sorumluluk', 'Kusur aranıyor mu?'],
              ['Hizmet kusuru', 'Kişisel kusur', 'Görevle bağlantı ayrılabilir mi?'],
              ['İptal', 'Tam yargı', 'İşlem iptali mi tazminat mı?'],
              ['Kolluk', 'Kamu hizmeti', 'Düzen koruma mı hizmet sunumu mu?'],
            ]
          : variantCode === 'idare-hukuku-donem-1'
            ? [
                ['Yokluk', 'İptal edilebilirlik', 'En ağır sakatlık mı?'],
                ['Geri alma', 'Kaldırma', 'Geçmişe mi geleceğe mi etkili?'],
                ['Düzenleyici işlem', 'Birel işlem', 'Genel-soyut mu somut mu?'],
                ['Hiyerarşi', 'Vesayet', 'Aynı tüzel kişilik içi mi dışı mı?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'İşlem/teşkilat mı sorumluluk mu?'],
                ['Yokluk', 'İptal', 'Sakatlık ağırlığı?'],
                ['Hizmet kusuru', 'Kusursuz', 'Kusur var mı?'],
                ['İptal', 'Tam yargı', 'İptal mi tazminat mı?'],
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
      leftTitle: 'İşlem / teşkilat',
      rightTitle: 'Sorumluluk / kolluk',
      left: 'Yetki–şekil–sebep–konu–amaç + sakatlık',
      right: 'Hizmet kusuru–kusursuz–kolluk–kamulaştırma',
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
      a: '1. dönem teşkilat–idari işlem–kamu malı–personel girişi; 2. dönem kamu hizmeti–kolluk–sorumluluk–yargı girişi; yıllık ikisini birleştirir.',
    },
    {
      q: 'İdari yargılama ile farkı ne?',
      a: 'Bu not maddi idare hukukudur. İptal/tam yargı usulü, süre ve ehliyet için idari yargılama ders notunu kullanın.',
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
    'Dayanakları metinden doğruladım',
    'PDF’i arşivledim',
    variantCode === 'idare-hukuku-yillik'
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
      `${uni.shortName} idare hukuku ${meta.short}`,
      `${uni.shortName} idare hukuku ders notu`,
      `idare hukuku ${meta.short} not pdf`,
      'idari işlem yetki şekil sebep konu amaç ders notu',
      'hizmet kusuru kolluk yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} idare hukuku`),
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
        'Beş unsuru numarala',
        'Yokluk / iptal ayır',
        'Sorumluluk türünü seç',
        'Yargı yolunu köprüle',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `İdare Hukuku ${meta.short} kapsamındaki kurumları ayırır`,
      'İdari işlem unsurlarını uygular',
      'Sorumluluk ve kolluk rejimini kurar',
      'Yargı denetimi köprüsünü kurar',
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
    relatedCourses: IDARE_HUKUKU_VARIANTS.filter((c) => c !== variantCode).concat([
      'idare-hukuku',
      'idari-yargilama',
      'anayasa-2',
    ]),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: variantCode === 'idare-hukuku-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'idare-hukuku',
    variantLabel: meta.label,
  };
}
