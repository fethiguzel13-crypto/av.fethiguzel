/**
 * CMK / Ceza Muhakemesi Hukuku —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * ceza-muhakemesi dersiyle hizalı.
 */

function baseMeta(variant) {
  const labels = {
    'cmk-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'CMK · 1. yarı (ilkeler, soruşturma, görev–yetki, yakalama–gözaltı, arama–elkoyma, tutuklama, adli kontrol)',
    },
    'cmk-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'CMK · 2. yarı (iddianame, duruşma, delil, hükmün açıklanması, istinaf–temyiz, özel usuller girişi)',
    },
    'cmk-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'Ceza muhakemesi tam omurga · soruşturma + kovuşturma + kanun yolu · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Soruşturma. Kim yakalanır, ne aranır, tutuklama şartı ne, haklar nasıl korunur?',
    promise:
      'Muhakeme ilkeleri, soruşturma–kovuşturma, görev–yetki, yakalama–gözaltı, arama–elkoyma, tutuklama, adli kontrol, ifade ve sorgu. Güz finalinde koruma tedbiri iskeleti bozulmadan yazarsınız.',
    sixtySecond: [
      'Soruşturma: suç şüphesi → delil toplama; kovuşturma: iddianame sonrası.',
      'Görev / yetki ceza mahkemelerinde ayrı yazılır.',
      'Yakalama ≠ tutuklama; süre ve makam farklıdır.',
      'Gözaltı: yasal süre + haklar (müdafi, yakınlara haber).',
      'Arama–elkoyma: karar, gecikmesinde sakınca, oran.',
      'Tutuklama: kuvvetli şüphe + tutuklama nedeni + ölçülülük.',
    ],
    pillars: [
      'Ceza muhakemesi ilkeleri',
      'Soruşturma ve kovuşturma ayrımı',
      'Görev ve yetki',
      'Yakalama ve gözaltı',
      'Arama ve elkoyma',
      'Tutuklama ve adli kontrol',
      'İfade alma ve sorgu',
      'Müdafi ve mağdur hakları girişi',
    ],
    definitions: [
      {
        baslik: 'Soruşturma',
        govde:
          'Yetkili mercilerin suç şüphesinin öğrenilmesinden iddianamenin kabulüne kadar yürüttüğü delil toplama ve hazırlık sürecidir.',
      },
      {
        baslik: 'Yakalama',
        govde:
          'Kişinin özgürlüğünün, kanunda sayılan hâllerde geçici olarak kısıtlanmasıdır. Tutuklamadan farklı olarak kural olarak kısa süreli ve kararsız başlayabilir.',
      },
      {
        baslik: 'Gözaltı',
        govde:
          'Yakalanan kişinin, soruşturma işlemleri için kanuni süreyle özgürlüğünün kısıtlı tutulmasıdır. Süre ve haklar emredicidir.',
      },
      {
        baslik: 'Tutuklama',
        govde:
          'Kuvvetli suç şüphesi ve kanundaki tutuklama nedenlerinin varlığı hâlinde, ölçülülük ilkesi gözetilerek verilen özgürlük kısıtlayıcı koruma tedbiridir.',
      },
      {
        baslik: 'Adli kontrol',
        govde:
          'Tutuklama yerine veya yanında uygulanabilen, yurt dışına çıkmama, imza, teminat gibi yükümlülüklerden oluşan alternatif tedbirdir.',
      },
    ],
    traps: [
      'Yakalama ile tutuklamayı aynı sanmak.',
      'Tutuklamada yalnız “şüphe var” yazmak — neden + ölçülülük şart.',
      'Aramada karar/oran kutusunu atlamak.',
      'Gözaltı süresini uydurmak.',
      'Müdafi hakkını “isteğe bağlı lüks” sanmak.',
    ],
    keyMadde: [
      'CMK m.2 — tanımlar (çerçeve)',
      'CMK m.90 vd. — yakalama / gözaltı (çerçeve)',
      'CMK m.116 vd. — arama (çerçeve)',
      'CMK m.123 vd. — elkoyma (çerçeve)',
      'CMK m.100 vd. — tutuklama',
      'CMK m.109 vd. — adli kontrol',
      'CMK m.147 vd. — ifade ve sorgu (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. CMK nedir?',
        paragraphs: [
          'Ceza muhakemesi, maddi gerçeğe ulaşırken temel hakları koruyan usul hukukudur. TCK suçu tanımlar; CMK yargılama yolunu çizer.',
          '1. dönem soruşturma ve koruma tedbirlerini; 2. dönem iddianame, duruşma, delil ve kanun yollarını taşır.',
        ],
        hapBilgi: 'Şüphe → tedbir → delil → iddia. Sıra ve şart yazılır.',
      },
      {
        heading: 'B. İlkeler',
        paragraphs: [
          'Masumiyet karinesi, silahların eşitliği, hukuki dinlenilme, aleniyet, doğrudanlık, dosya üzerinden karar yasağı (kural) iskeleti bilinir.',
          'Delil yasakları ve hukuka aykırı delil sonucu sınav klasikidir (2. dönemle bağ).',
        ],
        bullets: [
          'Masumiyet karinesi',
          'Adil yargılanma',
          'Ölçülülük',
          'Hukuka uygun delil',
        ],
      },
      {
        heading: 'C. Görev ve yetki',
        paragraphs: [
          'Asliye ceza / ağır ceza görevi suçun niteliğine; yetki yer kurallarına bağlıdır. Görevsizlik ve yetkisizlik sonuçları ayrı yazılır.',
          'Bağlantılı suçlar ve birleştirme girişi tanınır.',
        ],
      },
      {
        heading: 'D. Yakalama ve gözaltı',
        paragraphs: [
          'Yakalama şartları (suçüstü, tutuklama kararı vb.) ve yakalananın hakları yazılır. Gözaltı süreleri, uzatma ve savcı/hâkim denetimi emredicidir.',
          'Müdafi, yakınlara haber, hekim muayenesi, susma hakkı kutuları kapatılır.',
        ],
        kartlar: [
          { baslik: 'Yakalama', govde: 'Geçici özgürlük kısıtı.' },
          { baslik: 'Gözaltı', govde: 'Kanuni süre + haklar.' },
          { baslik: 'Müdafi', govde: 'Zorunlu / isteğe bağlı.' },
          { baslik: 'Süre', govde: 'Aşım hukuka aykırı.' },
        ],
        uyari: 'Süre ve hak ihlali = delil / tazminat riski.',
      },
      {
        heading: 'E. Arama ve elkoyma',
        paragraphs: [
          'Konut, işyeri, üst araması farklı rejimlere tabidir. Hâkim kararı kural; gecikmesinde sakınca hâlinde savcı/kolluk yetkisi istisnadır.',
          'Elkoyma, delil ve müsadere amacıyla yapılır; iade ve itiraz yolları vardır.',
        ],
      },
      {
        heading: 'F. Tutuklama ve adli kontrol',
        paragraphs: [
          'Kuvvetli suç şüphesi + CMK m.100 nedenleri (kaçma, delil karartma vb.) + ölçülülük. Katalog suçlar neden karinesini güçlendirebilir ama otomatik tutuklama değildir.',
          'Adli kontrol tutuklamaya alternatif veya tamamlayıcıdır. İtiraz ve süre denetimi yazılır.',
        ],
        hapBilgi: 'Tutuklama = şüphe + neden + ölçülülük. Üçü birden.',
      },
      {
        heading: 'G. İfade, sorgu, müdafi',
        paragraphs: [
          'İfade alma ve sorgu usulü, yasak usuller (işkence, baskı) ve hukuka aykırı ifadenin delil değeri bilinir. Müdafi hazır bulunma ve dosya inceleme hakları soruşturma dengesi için kritiktir.',
        ],
      },
    ],
    examples: [
      {
        title: 'Tutuklama şartı',
        facts:
          'Şüpheli ilk kez suç isnadıyla yakalanır; savcılık “katalog suç” diyerek tutuklama ister. Kaçma şüphesi somutlaştırılmaz.',
        analysis:
          'Kuvvetli şüphe. Tutuklama nedeni. Ölçülülük. Katalog = otomatik değil. Adli kontrol alternatifi.',
        takeaway: 'Üç şart + alternatif tedbir.',
      },
      {
        title: 'Gözaltı süresi',
        facts:
          'Gözaltı kanuni süreyi aşar; bu sürede alınan ifade dosyaya girer.',
        analysis:
          'Süre. Haklar. Hukuka aykırı delil. Tazminat ihtimali.',
        takeaway: 'Süre aşımı = usul alarmı.',
      },
      {
        title: 'Konut araması',
        facts:
          'Gece vakti, hâkim kararı olmadan konut aranır; “gecikmesinde sakınca” denir.',
        analysis:
          'Karar kuralı. Gecikmesinde sakınca ispatı. Oran. Elde edilen delil.',
        takeaway: 'İstisna dar yorumlanır.',
      },
      {
        title: 'Yakalama–tutuklama',
        facts:
          'Öğrenci “yakalandı, demek tutuklu” yazar.',
        analysis:
          'Yakalama geçici. Tutuklama hâkim kararı. Süre ve makam farkı.',
        takeaway: 'İki ayrı tedbir.',
      },
    ],
    mindmap: {
      center: 'CMK · 1. dönem',
      branches: [
        { label: 'Aşama', items: ['Soruşturma', 'Kovuşturma'] },
        { label: 'Özgürlük', items: ['Yakalama', 'Gözaltı', 'Tutuklama'] },
        { label: 'Delil', items: ['Arama', 'Elkoyma'] },
        { label: 'Hak', items: ['Müdafi', 'İfade'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Kovuşturma. İddianame, duruşma, delil, hüküm, istinaf–temyiz.',
    promise:
      'İddianame ve kabulü, duruşma düzeni, delil ve tanık, hükmün açıklanması, istinaf ve temyiz, uzlaştırma/seri muhakeme girişi. Bahar finalinin ağır topu.',
    sixtySecond: [
      'İddianame: yeterli şüphe + unsurlar; iade mümkün.',
      'Kovuşturma: duruşma + doğrudanlık + çelişme.',
      'Delil: hukuka uygunluk + serbest değerlendirme sınırları.',
      'Hüküm: beraat, mahkûmiyet, düşme… gerekçe şart.',
      'İstinaf / temyiz: süre, sebep, kapsam.',
      'Özel usuller: uzlaştırma, seri muhakeme, basit yargılama girişi.',
    ],
    pillars: [
      'İddianame ve iadesi',
      'Duruşma ve yargılama ilkeleri',
      'Delil, tanık, bilirkişi, keşif',
      'Hukuka aykırı delil',
      'Hüküm türleri ve gerekçe',
      'İstinaf',
      'Temyiz',
      'Özel muhakeme usulleri girişi',
    ],
    definitions: [
      {
        baslik: 'İddianame',
        govde:
          'Cumhuriyet savcısının, yeterli şüpheye dayanarak kamu davası açmak için mahkemeye sunduğu belgedir. Eksiklik hâlinde iade edilebilir.',
      },
      {
        baslik: 'Hukuka aykırı delil',
        govde:
          'Kanuna aykırı yöntemlerle elde edilen delildir. Kural olarak hükme esas alınamaz; zehirli ağaç doktrini tartışmaları çerçevede bilinir.',
      },
      {
        baslik: 'İstinaf',
        govde:
          'İlk derece ceza mahkemesi hükümlerinin bölge adliye mahkemesinde maddi ve hukuki yönden denetlendiği kanun yoludur.',
      },
      {
        baslik: 'Temyiz',
        govde:
          'İstinaf (veya kanunun öngördüğü) kararlarının Yargıtay’da hukuka uygunluk denetimidir. Süre ve temyiz edilebilirlik sınırları vardır.',
      },
      {
        baslik: 'Uzlaştırma',
        govde:
          'Kanundaki suçlarda, mağdur ile şüpheli/sanığın anlaşmasıyla muhakemenin sona erdirilebildiği özel usuldür (şart ve sonuçlar çerçeve).',
      },
    ],
    traps: [
      'İddianame iadesini “dava düştü” sanmak.',
      'Hukuka aykırı delili her zaman “dosyada kalır, kullanılır” yazmak.',
      'İstinaf ile temyizi aynı süre/kapsam sanmak.',
      'Hüküm gerekçesini “kısa karar yeter” sanmak.',
      'Uzlaştırmayı her suça yaymak — katalog/şart var.',
    ],
    keyMadde: [
      'CMK m.170 vd. — iddianame (çerçeve)',
      'CMK m.174 — iddianamenin iadesi',
      'CMK m.182 vd. — duruşma (çerçeve)',
      'CMK m.206 vd. — delil / tanık (çerçeve)',
      'CMK m.217 — delillerin değerlendirilmesi',
      'CMK m.223 — hüküm',
      'CMK m.272 vd. — istinaf',
      'CMK m.286 vd. — temyiz (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. İddianame',
        paragraphs: [
          'Yeterli şüphe, fiil ve delillerin açıklanması, uygulanacak madde iddianamenin omurgasıdır. Eksik veya usulsüz iddianame iade edilir; bu beraat değildir.',
          'Kamu davasının açılmasıyla kovuşturma evresi başlar.',
        ],
        hapBilgi: 'İade ≠ beraat. Düzelt–yeniden sun.',
      },
      {
        heading: 'B. Duruşma',
        paragraphs: [
          'Doğrudanlık, sözlülük, çelişme ve aleniyet (istisnalarla) duruşmayı taşır. Yoklukta yargılama, erteleme, oturum düzeni bilinir.',
          'Sanık hazır bulunma ve son söz hakkı kapatılmalıdır.',
        ],
        bullets: [
          'Açılış ve kimlik',
          'İddia ve savunma',
          'Delil ikamesi',
          'Esas hakkında mütalaa / savunma',
          'Hüküm',
        ],
      },
      {
        heading: 'C. Delil',
        paragraphs: [
          'Tanık, bilirkişi, keşif, belge, görüntü-ses kayıtları. Hâkim delilleri serbestçe değerlendirir; hukuka aykırı delil yasağı sınırı çizer.',
          'Tanıklıktan çekinme, yemin, yüzleştirme pratik tuzaklardır.',
        ],
        uyari: 'Hukuka aykırı elde edilen delil hükme dayanak olamaz (kural).',
      },
      {
        heading: 'D. Hüküm',
        paragraphs: [
          'Beraat, mahkûmiyet, ceza verilmesine yer olmadığı, düşme, görevsizlik vb. Hükmün gerekçesi, tefhim ve tebliğ kanun yolu takvimini başlatır.',
          'Kısa karar / gerekçeli karar ayrımı pratikte önemlidir.',
        ],
        kartlar: [
          { baslik: 'Beraat', govde: 'Suç sabit değil.' },
          { baslik: 'Mahkûmiyet', govde: 'Suç + ceza.' },
          { baslik: 'Düşme', govde: 'Muhakeme engeli.' },
          { baslik: 'Gerekçe', govde: 'Denetlenebilirlik.' },
        ],
      },
      {
        heading: 'E. Kanun yolları',
        paragraphs: [
          'İstinaf: bölge adliye; maddi + hukuki denetim (çerçeve). Temyiz: Yargıtay; hukuka uygunluk. Süre, dilekçe, temyiz nedenleri yazılır.',
          'Olağanüstü kanun yolları (yargılamanın yenilenmesi, kanun yararına bozma) giriş düzeyinde tanınır.',
        ],
        hapBilgi: 'İstinaf ≠ temyiz. Süre başlangıcını tebliğden kur.',
      },
      {
        heading: 'F. Özel usuller girişi',
        paragraphs: [
          'Uzlaştırma, seri muhakeme, basit yargılama, önödeme gibi kurumlar belirli suç ve şartlara bağlıdır. Katalog ve rıza unsurları atlanmaz.',
        ],
      },
      {
        heading: 'G. Ceza maddi hukuk ile bağ',
        paragraphs: [
          'CMK usuldür; suçun varlığı TCK ile çözülür. “Delil yok” usul; “tipiklik yok” maddi hukuk. İkisini karıştırmayın.',
        ],
      },
    ],
    examples: [
      {
        title: 'İddianame iadesi',
        facts:
          'İddianamede deliller ve fiil özeti eksiktir; mahkeme iade eder. Savunma “dava bitti” der.',
        analysis:
          'İade sebepleri. Sonuç. Yeniden düzenleme. Beraat değil.',
        takeaway: 'İade = usul düzeltmesi.',
      },
      {
        title: 'Hukuka aykırı delil',
        facts:
          'İzinsiz dinleme kaydı hükme dayanak yapılır.',
        analysis:
          'Elde ediş hukuka aykırı mı? Yasak delil. Hükmün bozulması.',
        takeaway: 'Elde ediş yöntemi = delil kaderi.',
      },
      {
        title: 'İstinaf süresi',
        facts:
          'Hüküm tefhim edilir; gerekçeli karar sonra tebliğ olur. Süre karıştırılır.',
        analysis:
          'Kanun yolu süresi başlangıcı. Kaçırılan süre. Kesinlik riski.',
        takeaway: 'Tebliğ / tefhim kuralını sabitle.',
      },
      {
        title: 'Uzlaştırma',
        facts:
          'Şikâyete bağlı bir suçta taraflar anlaşır; savcılık dosyayı kapatır.',
        analysis:
          'Uzlaştırma şartları. Sonuç. Anlaşmazlık hâli.',
        takeaway: 'Şart + rıza + sonuç.',
      },
    ],
    mindmap: {
      center: 'CMK · 2. dönem',
      branches: [
        { label: 'Kovuşturma', items: ['İddianame', 'Duruşma'] },
        { label: 'Delil', items: ['Tanık', 'Yasak delil'] },
        { label: 'Hüküm', items: ['Tür', 'Gerekçe'] },
        { label: 'Denetim', items: ['İstinaf', 'Temyiz'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Soruşturma tedbirlerinden duruşma, hüküm ve kanun yoluna kadar tek omurga.',
    promise:
      '1. + 2. dönem birleşik; ceza muhakemesi / CMK için “tek cilt” not.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: tedbir/soruşturma mı, kovuşturma/kanun yolu mu?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 4), ...b.keyMadde.slice(0, 4)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: yakalama–tutuklama–arama → deneme → iddianame–duruşma–istinaf → karma.',
          'Her soruda etiket: “Tedbir mi, delil mi, hüküm/kanun yolu mı?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru aşama + doğru şart + doğru süre.',
        bullets: [
          'Hafta 1–4: ilkeler + yakalama + gözaltı + tutuklama',
          'Hafta 5–7: arama + elkoyma + ifade',
          'Hafta 8–11: iddianame + duruşma + delil',
          'Hafta 12–14: hüküm + istinaf/temyiz + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Tutuklama. Tip 2 — Konut araması. Tip 3 — Hukuka aykırı delil. Tip 4 — İddianame iadesi. Tip 5 — İstinaf süresi. Tip 6 — Uzlaştırma.',
          'Karma olayda hukuka aykırı arama + ifade + hüküm üst üste binebilir. Sıra: tedbir hukuka uygun mu → delil → hüküm → kanun yolu.',
        ],
        uyari: 'TCK suç unsurunu CMK usulüyle karıştırmayın; ikisini bağlayın.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'CMK · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Yakalama', 'Tutuklama', 'Arama'] },
        { label: '2. yarı', items: ['Duruşma', 'Delil', 'Kanun yolu'] },
        { label: 'Hak', items: ['Müdafi', 'Masumiyet'] },
        { label: 'Yöntem', items: ['Aşama seç', 'Süre tut'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'cmk-donem-1': d1Content,
  'cmk-donem-2': d2Content,
  'cmk-yillik': yillikContent,
};

export const CMK_VARIANTS = ['cmk-donem-1', 'cmk-donem-2', 'cmk-yillik'];

export function buildCmkVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} CMK ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Ceza Muhakemesi (CMK) ${meta.h1Extra}`;
  const description = `${uni.name} için CMK / ceza muhakemesi ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Ceza Muhakemesi Kanunu ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: doğru aşamada doğru tedbir, delil ve kanun yolunu yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Suçun maddi unsurları için ceza genel/özel triple notlarını kullanın.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: soruşturma mı kovuşturma mı?',
        'Tutuklamada üç şartı yaz',
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
      paragraphs: ['Soru tipine göre dayanaklar. Güncel metin: CMK.'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde no / süre yazmayın; CMK metninden doğrulayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (CMK)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) aşama (2) tedbir/usul kurumu (3) şart (4) haklar (5) sonuç / kanun yolu.',
      ],
      bullets: [
        'Aşamayı ilk yaz',
        'Yakalama ≠ tutuklama',
        'Ölçülülük kutusunu aç',
        'Kanun yolu süresini tebliğden kur',
      ],
      hapBilgi: 'Doğru aşama + doğru şart = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `CMK ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Aşamayı seç (soruşturma/kovuşturma)',
        'Kurumu adlandır',
        'Şart listesi',
        'Haklar / oran',
        'Sonuç',
        'Kanun yolu notu',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'cmk-donem-2'
          ? [
              ['İstinaf', 'Temyiz', 'Maddi+hukuki mi esasen hukuki mi?'],
              ['İddianame iadesi', 'Beraat', 'Usul düzeltmesi mi esastan ret mi?'],
              ['Hukuka aykırı delil', 'Zayıf delil', 'Elde ediş yasak mı ispat zayıf mı?'],
              ['Uzlaştırma', 'Mahkûmiyet', 'Anlaşma ile sona erme mi hüküm mü?'],
            ]
          : variantCode === 'cmk-donem-1'
            ? [
                ['Yakalama', 'Tutuklama', 'Geçici mi hâkim kararı mı?'],
                ['Gözaltı', 'Tutuklama', 'Süre+makam farkı?'],
                ['Arama', 'Elkoyma', 'Yer/kişi mi eşya mı?'],
                ['Tutuklama', 'Adli kontrol', 'Özgürlük kısıtı mı alternatif mi?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Tedbir mi kovuşturma mı?'],
                ['Yakalama', 'Tutuklama', 'Karar ve süre?'],
                ['İstinaf', 'Temyiz', 'Denetim kapsamı?'],
                ['Soruşturma', 'Kovuşturma', 'İddianame öncesi mi sonrası mı?'],
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
      leftTitle: 'Koruma tedbiri',
      rightTitle: 'Kovuşturma / yol',
      left: 'Yakalama–gözaltı–arama–tutuklama',
      right: 'İddianame–duruşma–delil–istinaf/temyiz',
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
      a: '1. dönem soruşturma ve koruma tedbirleri; 2. dönem iddianame–duruşma–delil–kanun yolları; yıllık ikisini birleştirir.',
    },
    {
      q: 'Ceza maddi hukuk notlarıyla birlikte mi?',
      a: 'Evet. Suçun varlığı TCK (genel/özel); yargılama CMK triple notundadır.',
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
    'Pusula maddeleri CMK’dan doğruladım',
    'PDF’i arşivledim',
    variantCode === 'cmk-yillik'
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
      `${uni.shortName} cmk ${meta.short}`,
      `${uni.shortName} ceza muhakemesi ders notu`,
      `cmk ${meta.short} not pdf`,
      'tutuklama yakalama iddianame istinaf ders notu',
      'ceza muhakemesi yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} cmk`),
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
        'Aşamayı ilk yaz',
        'Tedbir şartlarını numarala',
        'Ölçülülük kutusunu aç',
        'Kanun yolu süresini kur',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `CMK ${meta.short} kapsamındaki kurumları ayırır`,
      'Koruma tedbirleri şartlarını uygular',
      'Kovuşturma ve delil rejimini kurar',
      'Hüküm ve kanun yolu takvimini yönetir',
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
    relatedCourses: CMK_VARIANTS.filter((c) => c !== variantCode).concat([
      'ceza-muhakemesi',
      'ceza-genel-yillik',
      'ceza-ozel-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: variantCode === 'cmk-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'cmk',
    variantLabel: meta.label,
  };
}
