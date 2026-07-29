/**
 * İş ve Sosyal Güvenlik Hukuku —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * is-hukuku dersiyle hizalı (mufredat: year 3).
 */

function baseMeta(variant) {
  const labels = {
    'is-hukuku-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'İş hukuku · 1. yarı (işçi–işveren, iş sözleşmesi, ücret, çalışma süresi, izin, iş sağlığı girişi)',
    },
    'is-hukuku-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'İş hukuku · 2. yarı (fesih, kıdem–ihbar, iş güvencesi, toplu iş hukuku ve SGK girişi, arabuluculuk)',
    },
    'is-hukuku-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'İş ve sosyal güvenlik hukuku tam omurga · sözleşme + fesih + toplu/SGK · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: İşçi kim, sözleşme nasıl kurulur, ücret ve süre nasıl korunur? Bireysel iş hukuku kapısı burada açılır.',
    promise:
      'İşçi–işveren–işyeri, iş sözleşmesi türleri, ücret, çalışma süresi, dinlenme ve izin, iş sağlığı ve güvenliği girişi. Güz finalinde “sıfat + sözleşme + ücret/süre” bozulmadan yazarsınız.',
    sixtySecond: [
      'İş hukuku: bağımlı çalışanı koruyan özel hukuk + kamu düzeni karışımı.',
      'İşçi: ücret karşılığı, işverene bağımlı çalışan gerçek kişi (çerçeve).',
      'İş sözleşmesi: sürekli / belirli / kısmi / çağrı üzerine (türler).',
      'Ücret: asgari ücret, ödeme, zamanaşımı (çerçeve; güncel metin).',
      'Süre: haftalık çalışma, fazla çalışma, gece, ara dinlenme.',
      'İzin: yıllık ücretli izin ve diğer izinler (çerçeve).',
    ],
    pillars: [
      'İş hukukunun konusu ve kaynakları',
      'İşçi, işveren, işyeri, asıl–alt işveren',
      'İş sözleşmesinin kuruluşu ve türleri',
      'Tarafların borçları',
      'Ücret ve ücretin korunması',
      'Çalışma ve dinlenme süreleri',
      'İzinler',
      'İş sağlığı ve güvenliği girişi',
    ],
    definitions: [
      {
        baslik: 'İşçi',
        govde:
          'Bir iş sözleşmesine dayanarak çalışan gerçek kişidir. Ücret, bağımlılık ve işverenin talimatı unsurları birlikte aranır (çerçeve).',
      },
      {
        baslik: 'İş sözleşmesi',
        govde:
          'Bir tarafın (işçi) bağımlı olarak iş görmeyi, diğer tarafın (işveren) ücret ödemeyi üstlendiği sözleşmedir. Şekil kuralı tür ve kanuna göre değişir.',
      },
      {
        baslik: 'Bağımlılık',
        govde:
          'İşçinin işverenin yönetim ve denetimi altında çalışmasıdır. İş hukuku ile vekâlet / eser ayrımında ayırıcı ölçüttür.',
      },
      {
        baslik: 'Ücret',
        govde:
          'İşçinin emeğinin karşılığıdır. Asgari ücret, fazla çalışma ücreti ve ücretin güvenceleri kanunla korunur.',
      },
      {
        baslik: 'Asıl–alt işveren',
        govde:
          'Asıl işverenin işyerinde, işin bir bölümünü üstlenen alt işveren ilişkisidir. Muvazaa yasağı ve birlikte sorumluluk çerçevede bilinir.',
      },
    ],
    traps: [
      'Her çalışanı işçi saymak — bağımlılık testi.',
      'Belirli süreli sözleşmeyi keyfi zincirleme yapmak — şartlar.',
      'Fazla çalışmayı “ücret içinde” saymak (kural dışı iddia).',
      'Asıl–alt işvereni “taşeron her zaman serbest” sanmak — muvazaa.',
      'Süre ve asgari ücret rakamlarını uydurmak — güncel metin.',
    ],
    keyMadde: [
      '4857 s. İş Kanunu — kapsam, sözleşme, ücret, süre (çerçeve; güncel metin)',
      '6098 s. TBK — hizmet sözleşmesi köprüsü (uygulama alanı)',
      'Asgari ücret tesbiti — güncel tutar (doğrula)',
      'İş Sağlığı ve Güvenliği Kanunu (çerçeve)',
      'Deniz / basın / diğer özel kanunlar (kapsam istisnası, çerçeve)',
      'İş arabuluculuğu — 2. dönem bağ (dava şartı)',
    ],
    sectionsExtra: [
      {
        heading: 'A. İş hukuku ne işe yarar?',
        paragraphs: [
          'Zayıf tarafı (işçiyi) korur; emredici hükümler ve kamu düzeni ağır basar. 1. dönem bireysel iş ilişkisinin kuruluş ve içerik omurgasını taşır; fesih ve toplu/SGK 2. döneme kalır.',
        ],
        hapBilgi: 'İş hukuku = bağımlılık + koruma + emredici norm.',
      },
      {
        heading: 'B. Sıfatlar ve kapsam',
        paragraphs: [
          'İşçi, işveren, işveren vekili, işyeri, işletme. İş Kanunu kapsamı ve istisnalar. TBK hizmet sözleşmesiyle yarış/öncelik bilinçli yazılır.',
          'Asıl–alt işveren: muvazaa, birlikte sorumluluk, devir.',
        ],
        bullets: [
          'Bağımlılık testi',
          'Kapsam içi / dışı',
          'Asıl–alt işveren',
          'İşyeri devri girişi',
        ],
      },
      {
        heading: 'C. İş sözleşmesi türleri',
        paragraphs: [
          'Belirsiz süreli kural; belirli süreli objektif neden ister (çerçeve). Kısmi süreli, çağrı üzerine, deneme kaydı, takım sözleşmesi.',
          'Yazılı şekil şartı bazı türlerde aranır; ispat ayrıdır.',
        ],
        kartlar: [
          { baslik: 'Belirsiz', govde: 'Kural tür.' },
          { baslik: 'Belirli', govde: 'Objektif neden.' },
          { baslik: 'Kısmi', govde: 'Süre kıyası.' },
          { baslik: 'Deneme', govde: 'Sınırlı süre.' },
        ],
      },
      {
        heading: 'D. Tarafların borçları',
        paragraphs: [
          'İşçi: iş görme, sadakat, özen. İşveren: ücret, eşit davranma, gözetme, alet–malzeme (çerçeve). Değişiklik ve yönetim hakkı sınırlıdır.',
        ],
        uyari: 'Tek taraflı esaslı değişiklik fesih riski doğurur.',
      },
      {
        heading: 'E. Ücret',
        paragraphs: [
          'Asgari ücret, ödeme zamanı, bankaya yatırma, ücretin haczi/sınırları, zamanaşımı. Fazla çalışma ücreti ayrı kalemdir.',
          'Uydurma oran/tutar yazma; güncel asgari ücret ve kanun metnini doğrula.',
        ],
        hapBilgi: 'Ücret alacağı = iş hukukunun omurgası.',
      },
      {
        heading: 'F. Süre ve izin',
        paragraphs: [
          'Haftalık çalışma, denkleştirme, fazla sürelerle çalışma, gece çalışması, ara dinlenme. Yıllık ücretli izin koşulları ve kullandırma.',
        ],
      },
      {
        heading: 'G. İSG girişi',
        paragraphs: [
          'İşverenin koruma borcu, risk değerlendirmesi, eğitim, iş kazası–meslek hastalığı köprüsü (SGK 2. dönem).',
        ],
      },
    ],
    examples: [
      {
        title: 'Bağımlılık',
        facts:
          '“Serbest çalışan” denir; mesai, talimat, tek işveren var.',
        analysis:
          'Bağımlılık testi. İşçi sıfatı. Muvazaalı dışarıdan alım.',
        takeaway: 'Etiket değil fiili durum.',
      },
      {
        title: 'Belirli süre',
        facts:
          'Sözleşme her yıl yenilenir; objektif neden yok.',
        analysis:
          'Zincirleme belirli süre. Belirsiz sayılma riski.',
        takeaway: 'Objektif neden yaz.',
      },
      {
        title: 'Fazla çalışma',
        facts:
          'İşveren “maaş içinde” der; onay ve ücret yok.',
        analysis:
          'Fazla çalışma şartları. Ücret / serbest zaman. İspat.',
        takeaway: 'Fazla çalışma ayrı kalem.',
      },
      {
        title: 'Alt işveren',
        facts:
          'Asıl iş, alt işverene devredilir; muvazaa iddiası.',
        analysis:
          'Asıl iş yasağı / sınır. Birlikte sorumluluk.',
        takeaway: 'Muvazaayı test et.',
      },
    ],
    mindmap: {
      center: 'İş Hukuku · 1. dönem',
      branches: [
        { label: 'Sıfat', items: ['İşçi', 'İşveren'] },
        { label: 'Sözleşme', items: ['Tür', 'Borçlar'] },
        { label: 'Koruma', items: ['Ücret', 'Süre', 'İzin'] },
        { label: 'Güvenlik', items: ['İSG'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Fesih, kıdem, iş güvencesi. İş ilişkisinin bitiş ve sonrası hukuku.',
    promise:
      'Fesih türleri, bildirimli/bildirimsiz fesih, kıdem ve ihbar, iş güvencesi ve işe iade, toplu iş hukuku girişi, SGK omurgası, dava şartı arabuluculuk. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Fesih: işçi veya işveren; haklı / geçerli / bildirimli ayrımı.',
      'İhbar süresi ve ihbar tazminatı.',
      'Kıdem tazminatı: şartlar + hesap (çerçeve; güncel metin).',
      'İş güvencesi: işe iade davası (kapsam ve süre).',
      'Toplu iş hukuku: sendika, TİS, grev girişi.',
      'SGK: sigortalılık, prim, iş kazası–meslek hastalığı (çerçeve).',
    ],
    pillars: [
      'İş sözleşmesinin sona erme hâlleri',
      'Bildirimli fesih ve ihbar',
      'Haklı nedenle derhal fesih',
      'Kıdem tazminatı',
      'İş güvencesi ve işe iade',
      'Toplu iş hukuku girişi',
      'Sosyal güvenlik girişi',
      'Uyuşmazlık ve arabuluculuk',
    ],
    definitions: [
      {
        baslik: 'Kıdem tazminatı',
        govde:
          'Kanunun aradığı süre ve koşullarda iş sözleşmesi sona eren işçiye ödenen götürü nitelikli alacaktır. Haklı fesih yönü ve istisnalar yazılır.',
      },
      {
        baslik: 'İhbar tazminatı',
        govde:
          'Bildirim sürelerine uyulmadan yapılan fesihte, süreye ait ücret tutarında tazminattır.',
      },
      {
        baslik: 'İş güvencesi',
        govde:
          'Belirli kapsamda işçinin feshinin geçerli nedene dayanması ve geçersizlikte işe iade imkânıdır (çerçeve; işçi sayısı/süre şartları güncel metinden).',
      },
      {
        baslik: 'Geçerli neden',
        govde:
          'İşçinin yeterliliği, davranışı veya işletme/işyeri gereklerinden kaynaklanan, haklı neden kadar ağır olmayan fakat feshî haklı kılan nedendir (iş güvencesi bağlamı).',
      },
      {
        baslik: 'İş kazası',
        govde:
          'Sigortalının işyerinde veya iş nedeniyle uğradığı, bedensel/ruhsal engel doğuran olaydır. SGK ve işverenin hukuki sorumluluğu kesişir.',
      },
    ],
    traps: [
      'Haklı neden ile geçerli nedeni karıştırmak.',
      'Kıdem şartlarını ve tavanı uydurmak.',
      'İşe iadeyi her işçiye tanımak — kapsam şartı.',
      'Arabuluculuğu atlayıp doğrudan dava açmak — dava şartı.',
      'SGK ile iş kanununu tek torbada eritmek — iki rejim.',
    ],
    keyMadde: [
      '4857 s.K. — fesih, iş güvencesi (çerçeve; güncel metin)',
      '1475 s.K. m.14 — kıdem (yürürlükteki hüküm çerçevesi; doğrula)',
      'İş Mahkemeleri Kanunu — arabuluculuk dava şartı',
      '6356 s.K. — sendikalar ve toplu iş sözleşmesi (giriş)',
      '5510 s.K. — sosyal sigortalar (çerçeve)',
      'TBK — haksız fesih / genel hükümler köprüsü',
    ],
    sectionsExtra: [
      {
        heading: 'A. Sona erme ve fesih haritası',
        paragraphs: [
          'Süre bitimi, anlaşma, ölüm, fesih. Fesihte: kim feshetti, haklı mı, bildirimli mi, iş güvencesi kapsamında mı?',
          'Sınav iskeleti: sona erme tipi → tazminatlar → dava/arabuluculuk.',
        ],
        hapBilgi: 'Önce fesih türü, sonra hesap.',
      },
      {
        heading: 'B. Bildirimli fesih ve ihbar',
        paragraphs: [
          'Bildirim süreleri kıdeme göre artar (çerçeve). Usulsüz bildirimde ihbar tazminatı. Peşin ödeme ile süreye uymak mümkündür (çerçeve).',
        ],
        kartlar: [
          { baslik: 'Bildirim', govde: 'Süreye uy.' },
          { baslik: 'İhbar', govde: 'Uymama tazminatı.' },
          { baslik: 'İspat', govde: 'Yazılı / tebliğ.' },
          { baslik: 'Kötüye kullanım', govde: 'Ek tazminat riski.' },
        ],
      },
      {
        heading: 'C. Haklı nedenle fesih',
        paragraphs: [
          'İşçi ve işveren yönünden kanuni sebepler. Süre (hak düşürücü bildirim süreleri çerçeve). Haklı fesihte kıdem/ihbar sonuçları yönlere göre değişir.',
        ],
        uyari: 'Sebep + süre + ispat birlikte yazılır.',
      },
      {
        heading: 'D. Kıdem tazminatı',
        paragraphs: [
          'En az bir yıl, belirli sona erme hâlleri, giydirilmiş ücret, tavan (güncel). Askerlik, emeklilik, kadın evlilik istisnaları çerçevede bilinir.',
          'Hesap uydurma; formül ve tavanı güncel metinden doğrula.',
        ],
        hapBilgi: 'Kıdem = süre + haklı sona erme hâli + hesap.',
      },
      {
        heading: 'E. İş güvencesi / işe iade',
        paragraphs: [
          'Kapsam: işçi sayısı, kıdem, belirsiz süreli (çerçeve). Geçerli neden, feshin son çare olması. Arabuluculuk + işe iade davası süreleri.',
          'Geçersizlikte işe iade veya tazminat sonuçları yazılır.',
        ],
      },
      {
        heading: 'F. Toplu iş hukuku girişi',
        paragraphs: [
          'Sendika özgürlüğü, yetki, TİS, grev ve lokavt iskeleti. Bireysel iş hukukuna üstünlük alanları çerçevede.',
        ],
      },
      {
        heading: 'G. SGK ve uyuşmazlık',
        paragraphs: [
          'Sigortalılık, prim, kısa ve uzun vadeli sigorta kolları, iş kazası–meslek hastalığı. İş mahkemesi / arabuluculuk dava şartı. Zamanaşımı ayrı kalemler için yazılır.',
        ],
      },
    ],
    examples: [
      {
        title: 'Haklı / geçerli',
        facts:
          'İşveren “verimsiz” diye haklı fesih der; ispat zayıf.',
        analysis:
          'Haklı mı geçerli mi? İş güvencesi. İspat yükü.',
        takeaway: 'Sebep rejimini seç.',
      },
      {
        title: 'Kıdem',
        facts:
          'İşçi istifa eder; kıdem ister (haklı neden yok).',
        analysis:
          'İstifa kuralda kıdem vermez. İstisna var mı?',
        takeaway: 'Sona erme hâlini yaz.',
      },
      {
        title: 'İşe iade',
        facts:
          '30’dan az işçili işyeri; işe iade davası.',
        analysis:
          'Kapsam şartı. Dava dinlenir mi? (güncel metin).',
        takeaway: 'Önce kapsam kapısı.',
      },
      {
        title: 'Arabuluculuk',
        facts:
          'Kıdem alacağı doğrudan mahkemeye gider.',
        analysis:
          'Dava şartı arabuluculuk. Usul ret riski.',
        takeaway: 'Önce arabuluculuk.',
      },
    ],
    mindmap: {
      center: 'İş Hukuku · 2. dönem',
      branches: [
        { label: 'Fesih', items: ['Haklı', 'Bildirimli', 'Geçerli'] },
        { label: 'Tazminat', items: ['Kıdem', 'İhbar'] },
        { label: 'Güvence', items: ['İşe iade'] },
        { label: 'Diğer', items: ['Toplu', 'SGK', 'Arabuluculuk'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: İş sözleşmesinden feshе, ücretten kıdeme, bireyselden toplu/SGK’ye tek omurga.',
    promise:
      '1. + 2. dönem birleşik; iş ve sosyal güvenlik hukuku için “tek cilt” not. Kuruluş + içerik + sona erme + uyuşmazlık.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: sözleşme/ücret mi, fesih/kıdem/işe iade mi?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: sıfat–sözleşme → ücret/süre → fesih haritası → kıdem/işe iade → arabuluculuk/SGK → karma.',
          'Her soruda: “İşçi mi? Hangi sözleşme? Nasıl bitti? Hangi alacak? Hangi merci?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru sıfat + doğru fesih + doğru alacak.',
        bullets: [
          'Hafta 1–3: işçi–işveren–sözleşme türleri',
          'Hafta 4–6: ücret–süre–izin–İSG',
          'Hafta 7–10: fesih–ihbar–kıdem–iş güvencesi',
          'Hafta 11–14: toplu/SGK–arabuluculuk–karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Bağımlılık. Tip 2 — Ücret/fazla çalışma. Tip 3 — Haklı fesih. Tip 4 — Kıdem. Tip 5 — İşe iade. Tip 6 — Arabuluculuk.',
          'Rakam, süre ve tavan uydurma; 4857 / 1475 m.14 / 5510 güncel metnini doğrula.',
        ],
        uyari: 'TBK hizmet ile İş Kanunu yarışını bilinçli yaz.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'İş Hukuku · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Sözleşme', 'Ücret', 'Süre'] },
        { label: '2. yarı', items: ['Fesih', 'Kıdem', 'İşe iade'] },
        { label: 'Usul', items: ['Arabuluculuk', 'Dava'] },
        { label: 'Köprü', items: ['Toplu', 'SGK'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'is-hukuku-donem-1': d1Content,
  'is-hukuku-donem-2': d2Content,
  'is-hukuku-yillik': yillikContent,
};

export const IS_HUKUKU_VARIANTS = [
  'is-hukuku-donem-1',
  'is-hukuku-donem-2',
  'is-hukuku-yillik',
];

export function buildIsHukukuVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} İş Hukuku ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} İş ve Sosyal Güvenlik Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için İş Hukuku ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için İş ve Sosyal Güvenlik Hukuku ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: işçi sıfatı, sözleşme içeriği, fesih ve alacakları sınavda bozmadan yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Emredici iş hukuku normları TBK hizmet sözleşmesinden önce gelir (kapsamda).`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: işçi sıfatı var mı?',
        'Fesih türü + alacak + arabuluculuk',
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
        '4857 s. İş Kanunu omurgadır. Süre, tutar ve tavan değişebilir; güncel metinden doğrulayın.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma kıdem tavanı / ihbar süresi / asgari ücret yazmayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (İş Hukuku)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık işe yarar. 60 dk / 2–3 soruda önce sıfat, sonra fesih/alacak.`,
        'İskelet: (1) işçi sıfatı (2) sözleşme türü (3) fesih/sona erme (4) alacaklar (5) arabuluculuk/dava.',
      ],
      bullets: [
        'Bağımlılığı ilk yaz',
        'Haklı / geçerli / bildirimli ayır',
        'Kıdem ve ihbarı ayrı hesapla',
        'Arabuluculuk kapısını unutma',
      ],
      hapBilgi: 'Doğru sıfat + doğru fesih = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `İş Hukuku ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'İşçi / işveren sıfatı',
        'Sözleşme türü',
        'İçerik (ücret–süre) veya fesih',
        'Alacak kalemleri',
        'Arabuluculuk',
        'Dava / sonuç',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'is-hukuku-donem-2'
          ? [
              ['Haklı neden', 'Geçerli neden', 'Derhal mi iş güvencesi mi?'],
              ['Kıdem', 'İhbar', 'Yıllık götürü mi bildirim süresi mi?'],
              ['İşe iade', 'Tazminat', 'Kapsam var mı?'],
              ['İş Kanunu', 'SGK', 'İş ilişkisi mi sigorta mı?'],
            ]
          : variantCode === 'is-hukuku-donem-1'
            ? [
                ['İşçi', 'Bağımsız çalışan', 'Bağımlılık var mı?'],
                ['Belirli süre', 'Belirsiz süre', 'Objektif neden var mı?'],
                ['Ücret', 'Fazla çalışma ücreti', 'Normal mi ek mi?'],
                ['Asıl işveren', 'Alt işveren', 'Muvazaa / birlikte sorumluluk?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Kuruluş/içerik mi fesih/alacak mı?'],
                ['Haklı fesih', 'Bildirimli fesih', 'Derhal mi süreli mi?'],
                ['Kıdem', 'İhbar', 'Hangi alacak?'],
                ['Bireysel', 'Toplu/SGK', 'Hangi rejim?'],
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
      leftTitle: 'Sözleşme / ücret / süre',
      rightTitle: 'Fesih / kıdem / işe iade',
      left: 'Sıfat–sözleşme–ücret–fazla çalışma',
      right: 'Fesih türü–kıdem–ihbar–arabuluculuk',
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
      a: '1. dönem işçi–sözleşme–ücret–süre–izin; 2. dönem fesih–kıdem–iş güvencesi–toplu/SGK–arabuluculuk; yıllık ikisini birleştirir.',
    },
    {
      q: 'Her işçi alacağı için arabuluculuk zorunlu mu?',
      a: 'Kanunun öngördüğü işçi–işveren uyuşmazlıklarında dava şartı arabuluculuk kuraldır; kapsam ve istisnalar güncel metinden doğrulanır.',
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
    'Fesih türü ve alacak ayrımını denedim',
    'PDF’i arşivledim',
    variantCode === 'is-hukuku-yillik'
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
      `${uni.shortName} iş hukuku ${meta.short}`,
      `${uni.shortName} kıdem tazminatı ders notu`,
      `iş hukuku ${meta.short} not pdf`,
      'iş sözleşmesi fesih işe iade arabuluculuk',
      'iş hukuku yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} iş hukuku`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format: uni.type === 'vakif' ? 'Klasik + ara; vaka/hesap olabilir' : 'Klasik yazılı + vaka analizi',
      tips: [
        'İşçi sıfatını ilk yaz',
        'Fesih türünü seç',
        'Kıdem ve ihbarı ayır',
        'Arabuluculuk kapısını kontrol et',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `İş hukuku ${meta.short} kurumlarını ayırır`,
      'İş sözleşmesi ve ücret–süre rejimini kurar',
      'Fesih ve tazminatları uygular',
      'İş güvencesi ve arabuluculuk yolunu seçer',
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
    relatedCourses: IS_HUKUKU_VARIANTS.filter((c) => c !== variantCode).concat([
      'is-hukuku',
      'borclar-genel-yillik',
      'arabuluculuk-yillik',
      'hmk-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'is-hukuku-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'is-hukuku',
    variantLabel: meta.label,
  };
}
