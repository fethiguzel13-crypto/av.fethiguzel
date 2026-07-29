/**
 * Sağlık / Tıp Hukuku —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * saglik-hukuku dersiyle hizalı (mufredat: year 4, seçmeli).
 */

function baseMeta(variant) {
  const labels = {
    'saglik-hukuku-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'Sağlık hukuku · 1. yarı (sağlık sistemi, hasta hakları, aydınlatılmış onam, hekim–hasta, kayıt, KVKK girişi)',
    },
    'saglik-hukuku-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'Sağlık hukuku · 2. yarı (malpraktis, hukuki–cezai–idari sorumluluk, organ–üreme girişi, sigorta/SGK köprüsü)',
    },
    'saglik-hukuku-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'Sağlık/tıp hukuku tam omurga · hasta hakları + malpraktis + sorumluluk · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Hasta hakları, onam ve kayıt. Tedavi ilişkisinin hukuki kapısı burada açılır.',
    promise:
      'Sağlık sisteminin hukuki iskeleti, hasta hakları, aydınlatılmış onam, hekim–hasta ilişkisi, tıbbi kayıt, gizlilik ve KVKK girişi. Güz finalinde “hak + onam + kayıt” bozulmadan yazarsınız.',
    sixtySecond: [
      'Sağlık hukuku: hasta, hekim, kurum ve kamu arasındaki ilişki.',
      'Hasta hakları: bilgilendirme, rıza, mahremiyet, hizmete erişim.',
      'Aydınlatılmış onam: bilgilendirme + özgür rıza + belgeleme.',
      'Hekim–hasta: sözleşme / vekâlet / özel statü tartışması (çerçeve).',
      'Tıbbi kayıt: zorunluluk, saklama, erişim.',
      'Gizlilik + KVKK: sağlık verisi özel nitelikli veridir.',
    ],
    pillars: [
      'Sağlık hukukunun konusu ve kaynakları',
      'Sağlık sistemi ve kurumlar (çerçeve)',
      'Hasta hakları',
      'Aydınlatılmış onam',
      'Hekim–hasta hukuki ilişkisi',
      'Tıbbi kayıt ve belgeleme',
      'Mahremiyet ve kişisel veri (giriş)',
      'Acil durum ve rıza istisnaları',
    ],
    definitions: [
      {
        baslik: 'Aydınlatılmış onam',
        govde:
          'Hastanın, müdahalenin amacı, riskleri, alternatifleri ve sonuçları hakkında yeterince bilgilendirildikten sonra özgür iradesiyle verdiği rızadır. Eksik aydınlatma rızayı sakatlar.',
      },
      {
        baslik: 'Hasta hakları',
        govde:
          'Sağlık hizmetinden yararlanan kişinin bilgilendirme, rıza, mahremiyet, saygınlık, hizmete erişim ve şikâyet gibi hukuken korunan menfaatleridir.',
      },
      {
        baslik: 'Tıbbi müdahale',
        govde:
          'Teşhis, tedavi, koruma veya araştırma amacıyla beden bütünlüğüne yönelik mesleki eylemdir. Hukuka uygunluk için yetki, endikasyon, onam ve özen aranır (çerçeve).',
      },
      {
        baslik: 'Mahremiyet',
        govde:
          'Hastanın sağlık durumuna ve özel hayatına ilişkin bilgilerin izinsiz açıklanmamasıdır. Meslek sırrı ve kişisel veri koruması ile kesişir.',
      },
      {
        baslik: 'Tıbbi kayıt',
        govde:
          'Muayene, teşhis, tedavi ve onama ilişkin tutulan belgeler bütünüdür. İspat, süreklilik ve denetim işlevi görür.',
      },
    ],
    traps: [
      'Onamı “imza kağıdı” sanmak — bilgilendirme asıldır.',
      'Acil istisnayı her müdahaleye yaymak.',
      'Hasta haklarını yalnız etik sayıp hukuku atlamak.',
      'Kayıt eksikliğini “önemsiz” görmek — ispat yükü kayar.',
      'Sağlık verisini sıradan KVKK verisi sanmak — özel nitelikli veri.',
    ],
    keyMadde: [
      'Anayasa m.17 — kişi dokunulmazlığı / beden bütünlüğü (çerçeve)',
      'Anayasa m.56 — sağlık hakkı / çevre (çerçeve)',
      'Hasta Hakları Yönetmeliği (çerçeve; güncel metin)',
      '1219 s.K. — tababet ve şuabatı (çerçeve)',
      'KVKK m.6 — özel nitelikli kişisel veri (sağlık)',
      'TMK / TBK — kişilik hakkı, sözleşme, haksız fiil köprüsü',
    ],
    sectionsExtra: [
      {
        heading: 'A. Sağlık hukuku nedir?',
        paragraphs: [
          'Sağlık hizmetinin sunumu, hasta ve meslek mensuplarının hak ve yükümlülükleri, kurumsal sorumluluk ve kamu sağlığı kurallarını kapsar. Etik ile hukuk iç içedir; sınavda hukuki dayanak yazılır.',
          '1. dönem hak–onam–kayıt omurgasını taşır. Malpraktis ve çoklu sorumluluk 2. döneme kalır.',
        ],
        hapBilgi: 'Kapı: hak + onam + kayıt + gizlilik.',
      },
      {
        heading: 'B. Sistem ve kurumlar (çerçeve)',
        paragraphs: [
          'Kamu hastanesi, üniversite hastanesi, özel hastane, aile hekimliği, acil servis rolleri bilinir. İdare hukuku ile özel hukuk ilişkisi kurum tipine göre değişir.',
          'Ruhsat, denetim ve standartlar çerçevede tanınır; uydurma yönetmelik numarası yazılmaz.',
        ],
        bullets: [
          'Kamu / özel / üniversite ayrımı',
          'Acil sağlık hizmeti',
          'Aile hekimliği girişi',
          'Denetim ve ruhsat (çerçeve)',
        ],
      },
      {
        heading: 'C. Hasta hakları',
        paragraphs: [
          'Bilgilendirilme, rıza, mahremiyet, saygın tedavi, hizmete erişim, kayıt inceleme, şikâyet ve ikinci görüş (çerçeve). Haklar somut olayda yazılır; liste ezberi yetmez.',
          'Refüze / tedaviyi ret hakkı ile acil zorunluluk gerilimi bilinir.',
        ],
        kartlar: [
          { baslik: 'Bilgi', govde: 'Aydınlatılma hakkı.' },
          { baslik: 'Rıza', govde: 'Özgür onam.' },
          { baslik: 'Mahremiyet', govde: 'Sır + veri.' },
          { baslik: 'Erişim', govde: 'Hizmete ulaşma.' },
        ],
      },
      {
        heading: 'D. Aydınlatılmış onam',
        paragraphs: [
          'Kim aydınlatır, ne anlatılır, ne zaman, nasıl belgelenir? Risk, alternatif, başarı ihtimali, red sonucu. Yazılı onam formları ispat aracıdır; form tek başına yetmez.',
          'Küçük, kısıtlı, bilinci kapalı hasta; yasal temsilci ve acil istisnalar ayrı kutudur.',
        ],
        hapBilgi: 'Onam = bilgilendirme + özgür irade + belgeleme.',
        uyari: 'İmza ≠ onam. İçerik yoksa rıza sakat.',
      },
      {
        heading: 'E. Hekim–hasta ilişkisi',
        paragraphs: [
          'Özel hastanede sözleşme / vekâlet; kamu hastanesinde idari ilişki + hasta hakları birlikte düşünülür. Özen borcu ve sadakat çerçevesi yazılır.',
          'Ekip çalışması ve sevk sorumluluğu girişi tanınır.',
        ],
      },
      {
        heading: 'F. Tıbbi kayıt ve gizlilik',
        paragraphs: [
          'Kayıt tutma, saklama, düzeltme, hastanın erişimi. Eksik kayıt ispatta aleyhe yorum riski doğurur.',
          'Meslek sırrı ve KVKK: sağlık verisi özel niteliklidir; açık rıza / istisna rejimleri güncel metinden doğrulanır.',
        ],
      },
      {
        heading: 'G. Acil ve istisnalar',
        paragraphs: [
          'Hayati tehlike, bilinç kapalılığı, salgın ve zorunlu bildirimler (çerçeve). İstisna dar yorumlanır; “acil” etiketi her şeyi meşrulaştırmaz.',
        ],
      },
    ],
    examples: [
      {
        title: 'Eksik aydınlatma',
        facts:
          'Form imzalatılır; riskler anlatılmaz. Komplikasyon çıkar.',
        analysis:
          'Onam sakatlığı. Hukuka aykırılık / sorumluluk kapısı. Kayıt ispatı.',
        takeaway: 'Form ≠ bilgilendirme.',
      },
      {
        title: 'Acil istisna',
        facts:
          'Bilinç kapalı hasta; hayati müdahale. Yakın yok.',
        analysis:
          'Acil istisna. Dar yorum. Sonradan bilgilendirme / kayıt.',
        takeaway: 'Acil ≠ sınırsız yetki.',
      },
      {
        title: 'Mahremiyet',
        facts:
          'Hekim, hastanın tanısını sosyal medyada “ilginç vaka” diye anlatır.',
        analysis:
          'Meslek sırrı + KVKK. Rıza yok. Disiplin / ceza / tazminat riski.',
        takeaway: 'Sağlık verisi özel nitelikli.',
      },
      {
        title: 'Kayıt eksikliği',
        facts:
          'Onam ve vital bulgular dosyada yok; uyuşmazlık çıkar.',
        analysis:
          'İspat. Özen. Aleyhe karine riski.',
        takeaway: 'Yazılmayan yapılmamış sayılabilir.',
      },
    ],
    mindmap: {
      center: 'Sağlık Hukuku · 1. dönem',
      branches: [
        { label: 'Haklar', items: ['Bilgi', 'Rıza', 'Mahremiyet'] },
        { label: 'Onam', items: ['Aydınlatma', 'Belge', 'İstisna'] },
        { label: 'İlişki', items: ['Hekim', 'Kurum'] },
        { label: 'Kayıt', items: ['Dosya', 'KVKK'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Malpraktis ve sorumluluk. Zarar, illiyet, özen ve çoklu dava yolu.',
    promise:
      'Tıbbi malpraktis, hukuki–cezai–idari sorumluluk, kurum sorumluluğu, organ–üreme hukuku girişi, sigorta/SGK köprüsü. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Malpraktis: standart altı uygulama + zarar + illiyet.',
      'Hukuki sorumluluk: sözleşme / haksız fiil / idare (kuruma göre).',
      'Cezai: TCK çerçevesi (taksirli yaralama/ölüm vb.) — somut madde doğrula.',
      'İdari/disiplin: meslek odası ve kurum içi.',
      'Komplikasyon ≠ otomatik malpraktis; özen ve bilgilendirme kritik.',
      'Organ, üreme, klinik araştırma: özel rejimler (giriş).',
    ],
    pillars: [
      'Malpraktis kavramı ve unsurları',
      'Özen standardı ve komplikasyon',
      'Hukuki sorumluluk yolları',
      'Cezai sorumluluk girişi',
      'İdari ve disiplin sorumluluğu',
      'Kurum / hastane sorumluluğu',
      'Organ–üreme–araştırma girişi',
      'Sigorta ve uyuşmazlık çözümü',
    ],
    definitions: [
      {
        baslik: 'Malpraktis',
        govde:
          'Tıp mesleğinin kabul ettiği standartlara aykırı eylem veya ihmal nedeniyle hastada zarar doğmasıdır. Komplikasyondan ayrılır; ispat ve özen ölçütü merkezdedir.',
      },
      {
        baslik: 'Tıbbi standart / özen',
        govde:
          'Benzer koşullardaki basiretli hekimin göstermesi beklenen mesleki özen ve bilinen tıp kurallarına uygunluktur. Bilirkişi incelemesi sık devreye girer.',
      },
      {
        baslik: 'Komplikasyon',
        govde:
          'Özenli uygulamaya rağmen ortaya çıkabilen, bilinen risk kapsamındaki olumsuz sonuçtur. Tek başına sorumluluk doğurmaz; aydınlatma ve özen ayrıca incelenir.',
      },
      {
        baslik: 'İlliyet bağı',
        govde:
          'Eylem/ihmal ile zarar arasındaki nedensellik bağlantısıdır. Tazminat ve ceza sorumluluğunda ortak eşiktir.',
      },
      {
        baslik: 'Kurum sorumluluğu',
        govde:
          'Hastanenin organizasyon, personel, cihaz, hijyen ve sevk kusurundan doğan sorumluluğudur. Hekim ile birlikte veya ayrı gündeme gelir.',
      },
    ],
    traps: [
      'Her kötü sonucu malpraktis saymak.',
      'Komplikasyonu “hiç sorumlu olunmaz” diye okumak — onam/özen ayrı.',
      'Yalnız hekimi yazıp kurum organizasyon kusurunu unutmak.',
      'Hukuki / cezai / idari yolları tek torbada karıştırmak.',
      'Özel kanunları yok sayıp her şeyi TBK ile bitirmek.',
    ],
    keyMadde: [
      'TBK haksız fiil / sözleşme sorumluluğu (çerçeve)',
      'TMK kişilik hakkı / beden bütünlüğü (çerçeve)',
      'TCK taksirli yaralama–ölüm (somut madde: güncel metin)',
      'İdare hukuku — kamu hastanesi hizmet kusuru (çerçeve)',
      'Organ ve Doku Nakli Kanunu (çerçeve; güncel metin)',
      'Mesleki sorumluluk sigortası / hasta şikâyet yolları (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Malpraktis unsurları',
        paragraphs: [
          ' (1) Tıbbi eylem/ihmal (2) standarta aykırılık (3) zarar (4) illiyet. Eksik unsurda sorumluluk kurulamaz. Bilirkişi raporu sık ama hâkim hukuku uygular.',
          'Teşhis gecikmesi, yanlış tedavi, takip eksikliği, sevk ihmalı tipik senaryolardır.',
        ],
        hapBilgi: 'Malpraktis = standart ihlali + zarar + illiyet.',
      },
      {
        heading: 'B. Özen ve komplikasyon',
        paragraphs: [
          'Komplikasyon bilgilendirilmiş risk alanındadır; özen ihlali yoksa tek başına tazminat doğurmayabilir. Ancak aydınlatma eksikliği ayrı hukuka aykırılık yaratır.',
          'Sınavda: “komplikasyon mu, malpraktis mi?” kutusunu bilinçli seç.',
        ],
        kartlar: [
          { baslik: 'Özen var', govde: 'Standart uygun.' },
          { baslik: 'Risk anlatıldı', govde: 'Onam sağlam.' },
          { baslik: 'Zarar komplikasyon', govde: 'Sorumluluk zor.' },
          { baslik: 'Özen yok', govde: 'Malpraktis yolu.' },
        ],
        uyari: 'Komplikasyon kalkanı özen ve onamı silmez.',
      },
      {
        heading: 'C. Hukuki sorumluluk yolları',
        paragraphs: [
          'Özel hastane/hekim: sözleşme ve/veya haksız fiil. Kamu: idari yargı / hizmet kusuru (çerçeve). Zamanaşımı ve merciler olay tipine göre yazılır; uydurma süre yok.',
          'Maddi–manevi tazminat; destekten yoksun kalma (ölüm) girişi.',
        ],
      },
      {
        heading: 'D. Cezai ve disiplin',
        paragraphs: [
          'Taksirli yaralama/ölüm, bilinci bozacak şekilde müdahale, sır ihlali gibi başlıklar çerçevede bilinir; somut TCK maddesi güncel metinden doğrulanır.',
          'Disiplin: Tabip Odası / kurum içi soruşturma. Ceza beraati disiplin soruşturmasını otomatik bitirmez (olay tipine göre).',
        ],
      },
      {
        heading: 'E. Kurum sorumluluğu',
        paragraphs: [
          'Yetersiz personel, arızalı cihaz, enfeksiyon kontrolü, sevk zinciri, acil triyaj hataları. Hekim kusuru olmasa da organizasyon kusuru gündeme gelebilir.',
          'Özel hastanede işveren / yardımcı kişi sorumluluğu köprüsü (TBK çerçevesi).',
        ],
        hapBilgi: 'Hekim + kurum = iki ayrı sorumluluk kutusunu düşün.',
      },
      {
        heading: 'F. Özel alanlar girişi',
        paragraphs: [
          'Organ ve doku nakli: rıza, yasaklar, kurum yetkisi. Üreme / gebelik sonlandırma: özel rejim ve süre (güncel metin). Klinik araştırma: etik kurul ve onam.',
          'Sınavda “özel kanun var” diye işaretlemek puan getirir; uydurma madde yazma.',
        ],
      },
      {
        heading: 'G. Sigorta ve uyuşmazlık',
        paragraphs: [
          'Mesleki sorumluluk sigortası, hasta şikâyet mercileri, arabuluculuk (varsa zorunluluk güncel rejim), yargı yolu seçimi. Delil: kayıt, görüntü, tanık, bilirkişi.',
        ],
      },
    ],
    examples: [
      {
        title: 'Malpraktis iskeleti',
        facts:
          'Ameliyat sonrası sinir hasarı; hekim “komplikasyon” der; onam yok.',
        analysis:
          'Komplikasyon iddiası + aydınlatma eksikliği. Zarar–illiyet–özen.',
        takeaway: 'Onam ve özen ayrı satır.',
      },
      {
        title: 'Kurum kusuru',
        facts:
          'Yoğun bakımda cihaz arızası; hekim protokole uygun.',
        analysis:
          'Organizasyon / cihaz sorumluluğu. Kurum odaklı inceleme.',
        takeaway: 'Yalnız hekim kutusu yetmez.',
      },
      {
        title: 'Yol ayrımı',
        facts:
          'Hasta hem tazminat hem ceza şikâyeti düşünür.',
        analysis:
          'Hukuki / cezai / disiplin yolları ayrı. Delil ortak, şartlar farklı.',
        takeaway: 'Üç yolu karıştırma.',
      },
      {
        title: 'Sevk ihmalı',
        facts:
          'İleri merkez endikasyonu var; sevk gecikir; zarar artar.',
        analysis:
          'Özen + illiyet (zararın artması). Kurum ve hekim.',
        takeaway: 'Sevk de özen borcudur.',
      },
    ],
    mindmap: {
      center: 'Sağlık Hukuku · 2. dönem',
      branches: [
        { label: 'Malpraktis', items: ['Standart', 'Zarar', 'İlliyet'] },
        { label: 'Yollar', items: ['Hukuki', 'Cezai', 'Disiplin'] },
        { label: 'Kurum', items: ['Organizasyon', 'Cihaz'] },
        { label: 'Özel', items: ['Organ', 'Araştırma'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Hasta haklarından malpraktise, onamdan kurum sorumluluğuna tek omurga.',
    promise:
      '1. + 2. dönem birleşik; sağlık/tıp hukuku için “tek cilt” not. Hak–onam–kayıt + sorumluluk yolları.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: onam/hak mı, malpraktis/sorumluluk mu?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: hasta hakları–onam–kayıt → deneme → malpraktis–yollar–kurum → karma.',
          'Her soruda: “Onam var mı? Özen var mı? Kim sorumlu? Hangi yol?”',
        ],
        hapBilgi: 'Yıllık başarı = sağlam onam + doğru sorumluluk yolu.',
        bullets: [
          'Hafta 1–3: sistem + hasta hakları',
          'Hafta 4–6: onam + kayıt + KVKK',
          'Hafta 7–10: malpraktis + hukuki/cezai/idari',
          'Hafta 11–14: kurum + özel alanlar + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Onam sakatlığı. Tip 2 — Mahremiyet/KVKK. Tip 3 — Malpraktis unsurları. Tip 4 — Komplikasyon ayrımı. Tip 5 — Kurum kusuru. Tip 6 — Yol seçimi.',
          'Karma olayda önce onam/kayıt, sonra özen/zarar/illiyet, en sonda merciler. Uydurma madde ve süre yazma; güncel metni doğrula.',
        ],
        uyari: 'Etik gerekçe hukuki dayanağın yerini tutmaz.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Sağlık Hukuku · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Haklar', 'Onam', 'Kayıt'] },
        { label: '2. yarı', items: ['Malpraktis', 'Yollar', 'Kurum'] },
        { label: 'İspat', items: ['Dosya', 'Bilirkişi'] },
        { label: 'Yöntem', items: ['Kutu seç', 'Dayanak yaz'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'saglik-hukuku-donem-1': d1Content,
  'saglik-hukuku-donem-2': d2Content,
  'saglik-hukuku-yillik': yillikContent,
};

export const SAGLIK_HUKUKU_VARIANTS = [
  'saglik-hukuku-donem-1',
  'saglik-hukuku-donem-2',
  'saglik-hukuku-yillik',
];

export function buildSaglikHukukuVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Sağlık Hukuku ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Sağlık / Tıp Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için Sağlık Hukuku ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Sağlık / Tıp Hukuku ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: hasta hakları, onam ve malpraktis sorumluluğunu sınavda bozmadan yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Etik tartışma destekler; puan hukuki dayanak ve unsur yazımındadır.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: onam var mı? özen var mı?',
        'Hukuki / cezai / idari yolu ayır',
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
        'Anayasa, hasta hakları rejimı, KVKK, TBK/TMK, TCK ve özel kanunlar köprüdür. Güncel metinden doğrulayın; uydurma madde yazmayın.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Süre ve madde numaralarını ezbere uydurmayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Sağlık Hukuku)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık işe yarar. 60 dk / 2–3 soruda: hak-onam mı, sorumluluk mu önce ayır.`,
        'İskelet: (1) ilişki tipi (2) onam/kayıt (3) özen/zarar/illiyet (4) sorumlu (5) yol.',
      ],
      bullets: [
        'Onamı ilk kontrol et',
        'Komplikasyon / malpraktis ayır',
        'Hekim + kurum düşün',
        'Üç sorumluluk yolunu karıştırma',
      ],
      hapBilgi: 'Sağlam onam + doğru yol = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Sağlık Hukuku ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Kurum / hekim ilişkisi',
        'Onam ve kayıt',
        'Özen standardı',
        'Zarar ve illiyet',
        'Sorumlu kişi/kurum',
        'Hukuki–cezai–idari yol',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'saglik-hukuku-donem-2'
          ? [
              ['Malpraktis', 'Komplikasyon', 'Standart ihlali var mı?'],
              ['Hukuki sorumluluk', 'Cezai sorumluluk', 'Tazminat mı ceza mı?'],
              ['Hekim kusuru', 'Kurum kusuru', 'Kim organize etti?'],
              ['Zarar', 'İlliyet', 'Sonuç mu bağ mı?'],
            ]
          : variantCode === 'saglik-hukuku-donem-1'
            ? [
                ['Onam formu', 'Aydınlatılmış onam', 'İmza mı bilgilendirme mi?'],
                ['Mahremiyet', 'KVKK', 'Meslek sırrı mı veri mi?'],
                ['Acil istisna', 'Rutin müdahale', 'Hayati tehlike var mı?'],
                ['Hasta hakkı', 'Etik ilke', 'Hukuki dayanak yazıldı mı?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Hak/onam mı malpraktis/yol mu?'],
                ['Onam', 'Özen', 'Rıza mı standart mı?'],
                ['Malpraktis', 'Komplikasyon', 'İhlal var mı?'],
                ['Hekim', 'Kurum', 'Kim sorumlu?'],
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
      leftTitle: 'Hak / onam / kayıt',
      rightTitle: 'Malpraktis / yol',
      left: 'Hasta hakları–aydınlatma–KVKK',
      right: 'Özen–zarar–hukuki/cezai/idari',
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
      a: '1. dönem hasta hakları–onam–kayıt–gizlilik; 2. dönem malpraktis–sorumluluk yolları–kurum–özel alanlar; yıllık ikisini birleştirir.',
    },
    {
      q: 'Komplikasyon her zaman sorumluluk dışı mı?',
      a: 'Hayır. Özen ve aydınlatma ayrı incelenir; komplikasyon etiketi tek başına kalkan değildir.',
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
    'Onam–malpraktis ayrımını denedim',
    'PDF’i arşivledim',
    variantCode === 'saglik-hukuku-yillik'
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
      `${uni.shortName} sağlık hukuku ${meta.short}`,
      `${uni.shortName} tıp hukuku ders notu`,
      `sağlık hukuku ${meta.short} not pdf`,
      'malpraktis aydınlatılmış onam hasta hakları',
      'sağlık hukuku yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} sağlık hukuku`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format: uni.type === 'vakif' ? 'Klasik + ara; ödev/vaka olabilir' : 'Klasik yazılı + vaka analizi',
      tips: [
        'Önce onam/kayıt kontrol et',
        'Malpraktis unsurlarını yaz',
        'Komplikasyon kutusunu bilinçli seç',
        'Hekim + kurum düşün',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Sağlık hukuku ${meta.short} kavramlarını ayırır`,
      'Hasta hakları ve aydınlatılmış onamı kurar',
      'Malpraktis unsurlarını ve yolları uygular',
      'Kurum ve hekim sorumluluğunu birlikte değerlendirir',
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
    relatedCourses: SAGLIK_HUKUKU_VARIANTS.filter((c) => c !== variantCode).concat([
      'saglik-hukuku',
      'ceza-genel-yillik',
      'borclar-genel-yillik',
      'idare-hukuku-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'saglik-hukuku-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'saglik-hukuku',
    variantLabel: meta.label,
  };
}
