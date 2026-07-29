/**
 * İdari Yargılama Hukuku (İYUK) —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * idari-yargilama dersiyle hizalı; idare hukuku maddi köprü.
 */

function baseMeta(variant) {
  const labels = {
    'idari-yargilama-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'İYUK · 1. yarı (teşkilat, görev–yetki, ehliyet–menfaat, süre, iptal davası)',
    },
    'idari-yargilama-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'İYUK · 2. yarı (tam yargı, yürütmenin durdurulması, istinaf–temyiz, yargılama usulü, özel davalar girişi)',
    },
    'idari-yargilama-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'İdari yargılama tam omurga · iptal + tam yargı + kanun yolu · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Doğru mercie, doğru sürede, doğru dava. İptal davasının kapısı burada açılır.',
    promise:
      'İdari yargı teşkilatı, görev–yetki, dava ehliyeti ve menfaat, dava açma süresi, iptal davası şartları ve sonuçları. Güz finalinde “nereye / ne zaman / kim?” bozulmadan yazarsınız.',
    sixtySecond: [
      'İdari yargı: idari işlem ve eylemlerin yargısal denetimi.',
      'Görev: idare/vergi mahkemesi, bölge, Danıştay (çerçeve).',
      'Yetki: yer bakımından hangi mahkeme.',
      'Ehliyet + menfaat: dava açabilme şartı.',
      'Süre: kural olarak 60 gün (özel süreler istisna) — metinden doğrula.',
      'İptal: hukuka aykırı işlemin ortadan kaldırılması.',
    ],
    pillars: [
      'İdari yargının işlevi ve ilkeleri',
      'Yargı teşkilatı',
      'Görev ve yetki',
      'Dava ehliyeti ve menfaat',
      'Dava açma süresi',
      'İptal davası şartları',
      'İptal sebepleri (işlem unsurları ile bağ)',
      'İptal kararının sonuçları',
    ],
    definitions: [
      {
        baslik: 'İptal davası',
        govde:
          'İdari işlemin yetki, şekil, sebep, konu veya amaç yönünden hukuka aykırılığının tespiti ve iptali için açılan davadır.',
      },
      {
        baslik: 'Menfaat ihlali',
        govde:
          'Dava açabilmek için ilgilinin meşru, kişisel ve güncel bir menfaatinin ihlal edilmiş olmasıdır. Ehliyetten ayrı ama birlikte aranır.',
      },
      {
        baslik: 'Dava açma süresi',
        govde:
          'İdari davanın kanunda öngörülen süre içinde açılması şartıdır. Süreler hak düşürücüdür; tebliğ/ilan/öğrenme başlangıcı kritiktir.',
      },
      {
        baslik: 'Görev',
        govde:
          'Uyuşmazlığın idare mahkemesi, vergi mahkemesi veya Danıştay’da görülmesi meselesidir. Kamu düzenine ilişkindir.',
      },
      {
        baslik: 'Yetki',
        govde:
          'Aynı tür mahkemeler arasında yer bakımından hangi mahkemenin bakacağıdır. Genel ve özel yetki kuralları vardır.',
      },
    ],
    traps: [
      'Süreyi “zamanaşımı” sanmak — hak düşürücü süre.',
      'Menfaati “her vatandaş davalı olur” diye genişletmek.',
      'Görev ile yetkiyi karıştırmak.',
      'İptali tazminat sanmak — o tam yargıdır.',
      'Özel süreleri yok sayıp her yerde 60 gün yazmak — doğrula.',
    ],
    keyMadde: [
      'İYUK m.2 — idari dava türleri',
      'İYUK m.3–5 — dilekçe / ehliyet çerçevesi',
      'İYUK m.7 — dava açma süresi (çerçeve; güncel metin)',
      'İYUK m.14–15 — ilk inceleme / süre aşımı',
      'İYUK m.32 vd. — yetki (çerçeve)',
      '2575 / 2576 s.K. — teşkilat (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. İdari yargılama nedir?',
        paragraphs: [
          'İdari yargılama, idarenin işlem ve eylemlerinin hukuka uygunluğunu yargı yoluyla denetler. Maddi idare hukuku “işlem nedir?” sorusunu; bu ders “nasıl dava edilir?” sorusunu cevaplar.',
          '1. dönem kapı ve iptal omurgasını taşır. Tam yargı, YD ve kanun yolları 2. döneme kalır.',
        ],
        hapBilgi: 'Kapı: görev + yetki + ehliyet + menfaat + süre.',
      },
      {
        heading: 'B. Teşkilat',
        paragraphs: [
          'İdare mahkemeleri, vergi mahkemeleri, bölge idare mahkemeleri ve Danıştay iskeleti bilinir. İlk derece / istinaf / temyiz rolleri yazılır.',
          'Tek hâkimli / heyetli yargılama ve özel daireler çerçevede tanınır.',
        ],
        bullets: [
          'İdare mahkemesi',
          'Vergi mahkemesi',
          'Bölge idare mahkemesi',
          'Danıştay',
        ],
      },
      {
        heading: 'C. Görev ve yetki',
        paragraphs: [
          'Görev kamu düzenindendir; re’sen gözetilir. Yetki yer kurallarına bağlıdır; itiraz ve gönderim sonuçları ayrı yazılır.',
          'Bağlantılı davalar ve birleştirme girişi tanınır.',
        ],
        kartlar: [
          { baslik: 'Görev', govde: 'Mahkeme türü · re’sen.' },
          { baslik: 'Yetki', govde: 'Yer · kural + istisna.' },
          { baslik: 'Sonuç', govde: 'Görevsizlik / yetkisizlik.' },
        ],
        uyari: 'Görev ≠ yetki. Karıştırma puan kaybettirir.',
      },
      {
        heading: 'D. Ehliyet ve menfaat',
        paragraphs: [
          'Dava ehliyeti ve taraf sıfatı ile menfaat ihlali birlikte aranır. Menfaat meşru, kişisel ve güncel olmalıdır; dernek/ meslek örgütü menfaati özel tartışılır.',
          'Sübjektif ehliyet ile objektif iptal (bazı düzenleyici işlemler) doktrini çerçevede bilinir.',
        ],
      },
      {
        heading: 'E. Dava açma süresi',
        paragraphs: [
          'Süreler hak düşürücüdür. Başlangıç: tebliğ, ilan, öğrenme (olay tipine göre). Özel kanunlardaki süreler genel kuralı bozar.',
          'Süre aşımı ilk incelemede ret sebebidir. Uydurma süre yazmayın; güncel İYUK/özel kanunu doğrulayın.',
        ],
        hapBilgi: 'Süre = kapı. Kaçarsa esas konuşulmaz.',
      },
      {
        heading: 'F. İptal davası',
        paragraphs: [
          'Konu: kesin ve yürütülebilir idari işlem. Sebepler: yetki, şekil, sebep, konu, amaç aykırılığı (idare hukuku unsurlarıyla bağ).',
          'İptal kararı işlemi geçmişe etkili ortadan kaldırır (kural); uygulanması ve idarenin uyması ayrı sonuçtur.',
        ],
      },
      {
        heading: 'G. İlk inceleme',
        paragraphs: [
          'Görev, yetki, ehliyet, menfaat, süre, husumet, kesin ve yürütülebilir işlem gibi şartlar ilk incelemede denetlenir. Eksiklikte ret veya süre verilir (çerçeve).',
        ],
      },
    ],
    examples: [
      {
        title: 'Süre',
        facts:
          'İşlem tebliğ edilir; davacı 90. günde iptal davası açar. Özel süre yoktur.',
        analysis:
          'Genel dava açma süresi. Hak düşürücü karakter. İlk inceleme ret riski.',
        takeaway: 'Takvim tut; süre kapıdır.',
      },
      {
        title: 'Menfaat',
        facts:
          'Şehir dışındaki kişi, başka ildeki imar planına “vatandaşım” diye dava açar.',
        analysis:
          'Kişisel-güncel menfaat. Soyut vatandaşlık yetmez (kural). İstisnalar dikkatli.',
        takeaway: 'Menfaat somut yazılır.',
      },
      {
        title: 'Görev–yetki',
        facts:
          'Vergi uyuşmazlığı idare mahkemesine açılır.',
        analysis:
          'Vergi mahkemesi görevi. Görevsizlik. Gönderim.',
        takeaway: 'Doğru mahkeme türü.',
      },
      {
        title: 'İptal konusu',
        facts:
          'Henüz icrai olmayan hazırlık işlemi dava edilir.',
        analysis:
          'Kesin ve yürütülebilir işlem şartı. Dava dinlenir mi?',
        takeaway: 'İcrai işlem yoksa iptal kapısı kapanır.',
      },
    ],
    mindmap: {
      center: 'İdari Yargılama · 1. dönem',
      branches: [
        { label: 'Kapı', items: ['Görev', 'Yetki', 'Süre'] },
        { label: 'Taraf', items: ['Ehliyet', 'Menfaat'] },
        { label: 'Dava', items: ['İptal', 'Sebepler'] },
        { label: 'Sonuç', items: ['İptal hükmü', 'Uygulama'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Tam yargı, YD, istinaf–temyiz. Zarar ve denetim yolları.',
    promise:
      'Tam yargı davası, yürütmenin durdurulması, yargılama usulü, istinaf ve temyiz, yargılama giderleri, özel dava türleri girişi. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Tam yargı: idareden tazminat / hak talebi.',
      'İptal + tam yargı birlikte veya ayrı açılabilir (şartlar).',
      'Yürütmenin durdurulması: açık hukuka aykırılık + telafisi güç zarar.',
      'İstinaf / temyiz: süre ve kapsam farklıdır.',
      'Gerekçeli karar ve tebliğ kanun yolu takvimini başlatır.',
      'Özel usuller: vergi, ihale, kamulaştırma bedeli (giriş).',
    ],
    pillars: [
      'Tam yargı davası',
      'İptal–tam yargı ilişkisi',
      'Yürütmenin durdurulması',
      'Yargılama usulü ve ispat',
      'İstinaf',
      'Temyiz (Danıştay)',
      'Yargılama giderleri',
      'Özel dava ve usuller girişi',
    ],
    definitions: [
      {
        baslik: 'Tam yargı davası',
        govde:
          'İdari eylem veya işlem nedeniyle uğranılan zararın tazmini ya da idari işleme bağlı bir hakkın tanınması için açılan davadır.',
      },
      {
        baslik: 'Yürütmenin durdurulması',
        govde:
          'Dava sonuçlanana kadar idari işlemin uygulanmasının geçici olarak durdurulması tedbiridir. İki şart birlikte aranır (çerçeve).',
      },
      {
        baslik: 'İstinaf (idari yargı)',
        govde:
          'İlk derece idari yargı kararlarının bölge idare mahkemesinde denetlendiği kanun yoludur.',
      },
      {
        baslik: 'Temyiz (idari yargı)',
        govde:
          'Kanunun öngördüğü kararların Danıştay’da hukuka uygunluk denetimidir. Süre ve temyiz edilebilirlik sınırları vardır.',
      },
      {
        baslik: 'İdari mercie başvuru',
        govde:
          'Bazı hâllerde dava öncesi veya süre bakımından idareye başvuru imkânıdır; süreyi etkiler (çerçeve, özel kanunlar).',
      },
    ],
    traps: [
      'YD’yi “otomatik verilir” sanmak — iki şart.',
      'Tam yargıyı her zaman iptale bağlamak zorunda sanmak — bağ kurulabilir ama şartlar yazılır.',
      'İstinaf ile temyizi aynı süre sanmak.',
      'Zarar–illiyet kutusunu atlayıp yalnız “idare haksız” yazmak.',
      'Özel kanun sürelerini yok saymak.',
    ],
    keyMadde: [
      'İYUK m.2/1-b — tam yargı (çerçeve)',
      'İYUK m.12–13 — iptal–tam yargı ilişkisi / idari başvuru (çerçeve)',
      'İYUK m.27 — yürütmenin durdurulması',
      'İYUK m.45 vd. — istinaf (çerçeve)',
      'İYUK m.46 vd. — temyiz (çerçeve)',
      'İYUK m.28 — kararların sonuçları / uygulanması (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Tam yargı davası',
        paragraphs: [
          'Konu: zarar veya idari işleme bağlı hak. Unsurlar: idari eylem/işlem, zarar, illiyet, hukuka aykırılık/sorumluluk bağı (idare hukuku sorumlulukla bağ).',
          'Dava açma süresi ve idari mercie başvuru özel kurallara tabi olabilir; güncel metinden doğrulanır.',
        ],
        hapBilgi: 'Tam yargı = zarar + illiyet + idareye yüklenebilirlik.',
      },
      {
        heading: 'B. İptal ve tam yargı birlikte',
        paragraphs: [
          'İşlem iptal edilmeden de tam yargı açılabilir; bazen iptal + tazminat birlikte istenir. Süre ve bağlama kuralları olay tipine göre yazılır.',
          'İptal kararı tek başına tazminat doğurmaz; zarar ayrıca ispatlanır.',
        ],
      },
      {
        heading: 'C. Yürütmenin durdurulması',
        paragraphs: [
          'Açık hukuka aykırılık + telafisi güç veya imkânsız zarar şartları birlikte aranır. Teminat istenebilir. Karara itiraz imkânı vardır.',
          'YD, esasa ilişkin nihai hüküm değildir; geçici korumadır.',
        ],
        kartlar: [
          { baslik: 'Şart 1', govde: 'Açık hukuka aykırılık.' },
          { baslik: 'Şart 2', govde: 'Telafisi güç zarar.' },
          { baslik: 'Sonuç', govde: 'Uygulama durur.' },
          { baslik: 'İtiraz', govde: 'Kanuni yol.' },
        ],
        uyari: 'Tek şart yetmez. İkisi birden.',
      },
      {
        heading: 'D. Yargılama usulü',
        paragraphs: [
          'Dilekçe, tebliğ, savunma, duruşma (istisnai), keşif, bilirkişi. Yazılılık ilkesi idari yargıda ağır basar.',
          'İspat yükü ve re’sen araştırma ilkesi çerçevede bilinir.',
        ],
      },
      {
        heading: 'E. Kanun yolları',
        paragraphs: [
          'İstinaf: bölge idare mahkemesi. Temyiz: Danıştay (kanunun öngördüğü hâller). Süre, dilekçe ve temyiz nedenleri yazılır.',
          'Karar düzeltme gibi yollar yürürlükteki rejimle kontrol edilir; uydurma yol yazmayın.',
        ],
        hapBilgi: 'İstinaf ≠ temyiz. Süre başlangıcını tebliğden kur.',
      },
      {
        heading: 'F. Kararların uygulanması',
        paragraphs: [
          'İdare, yargı kararlarını gecikmeksizin uygular (Anayasa / İYUK çerçevesi). Uygulanmama tazminat ve sorumluluk doğurabilir.',
        ],
      },
      {
        heading: 'G. Özel alanlar girişi',
        paragraphs: [
          'Vergi yargılaması, ihale uyuşmazlıkları, kamulaştırma bedel davaları özel süre ve merciler içerebilir. Sınavda “genel İYUK + özel kanun” diye not düşün.',
        ],
      },
    ],
    examples: [
      {
        title: 'Tam yargı',
        facts:
          'Belediye hizmet kusuruyla zarar verir; vatandaş tazminat ister. İptal konusu işlem yoktur.',
        analysis:
          'Tam yargı. Zarar–illiyet–hizmet kusuru. Süre. Menfaat/ehliyet.',
        takeaway: 'İşlem yoksa da tam yargı mümkün (eylem).',
      },
      {
        title: 'YD şartları',
        facts:
          'Davacı yalnız “zararım var” diyerek YD ister; hukuka aykırılık somutlaştırılmaz.',
        analysis:
          'İki şart birlikte. Eksik başvuru. Red riski.',
        takeaway: 'Açık aykırılık + ağır zarar.',
      },
      {
        title: 'İstinaf süresi',
        facts:
          'Karar tebliğ edilir; süre kaçırılır; temyiz denir.',
        analysis:
          'Hangi kanun yolu? Süre. Kaçırılan sürenin sonucu.',
        takeaway: 'Yol + süre birlikte.',
      },
      {
        title: 'İptal + tazminat',
        facts:
          'Ruhsat iptal edilir; hem işlemin iptali hem zarar istenilir.',
        analysis:
          'İptal + tam yargı. Süreler. Zararın ispatı.',
        takeaway: 'İki talep, iki iskelet.',
      },
    ],
    mindmap: {
      center: 'İdari Yargılama · 2. dönem',
      branches: [
        { label: 'Tam yargı', items: ['Zarar', 'İlliyet', 'Süre'] },
        { label: 'YD', items: ['Aykırılık', 'Zarar'] },
        { label: 'Denetim', items: ['İstinaf', 'Temyiz'] },
        { label: 'Sonuç', items: ['Uygulama', 'Gider'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Kapı şartlarından iptal, tam yargı ve kanun yoluna kadar tek omurga.',
    promise:
      '1. + 2. dönem birleşik; idari yargılama için “tek cilt” not. Maddi idare için idare hukuku triple’ına bakın.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: kapı/iptal mi, tam yargı/YD/kanun yolu mu?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: görev–süre–iptal → deneme → tam yargı–YD–istinaf → karma.',
          'Her soruda: “Kapı açık mı? Hangi dava? Hangi tedbir/yol?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru kapı + doğru dava türü + doğru süre.',
        bullets: [
          'Hafta 1–3: teşkilat + görev + yetki',
          'Hafta 4–7: menfaat + süre + iptal',
          'Hafta 8–11: tam yargı + YD + usul',
          'Hafta 12–14: istinaf/temyiz + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Süre aşımı. Tip 2 — Menfaat. Tip 3 — İptal sebebi. Tip 4 — Tam yargı. Tip 5 — YD. Tip 6 — Kanun yolu.',
          'Karma olayda süre + menfaat + YD üst üste binebilir. Sıra: kapı → dava türü → tedbir → esas → yol.',
        ],
        uyari: 'İşlem unsuru idare hukuku notundan; usul bu nottan.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'İdari Yargılama · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Kapı', 'İptal', 'Süre'] },
        { label: '2. yarı', items: ['Tam yargı', 'YD', 'Kanun yolu'] },
        { label: 'Taraf', items: ['Ehliyet', 'Menfaat'] },
        { label: 'Yöntem', items: ['Kapı seç', 'Takvim tut'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'idari-yargilama-donem-1': d1Content,
  'idari-yargilama-donem-2': d2Content,
  'idari-yargilama-yillik': yillikContent,
};

export const IDARI_YARGILAMA_VARIANTS = [
  'idari-yargilama-donem-1',
  'idari-yargilama-donem-2',
  'idari-yargilama-yillik',
];

export function buildIdariYargilamaVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} İdari Yargılama ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} İdari Yargılama Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için İdari Yargılama ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için İdari Yargılama Hukuku (İYUK) ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: doğru mercie, doğru sürede, doğru dava ve tedbiri yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. İdari işlem unsurları için idare hukuku triple notunu kullanın.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: kapı açık mı? (görev–yetki–süre–menfaat)',
        'İptal mi tam yargı mı ilk cümlede ayır',
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
      paragraphs: ['Soru tipine göre dayanaklar. Güncel metin: İYUK + özel kanunlar.'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma süre yazmayın; İYUK/özel kanundan doğrulayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (İdari Yargılama)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) kapı (2) dava türü (3) şart (4) tedbir/yol (5) sonuç.',
      ],
      bullets: [
        'Görev ≠ yetki',
        'Süre başlangıcını yaz',
        'İptal / tam yargı ayır',
        'YD’de iki şartı birlikte yaz',
      ],
      hapBilgi: 'Doğru kapı + doğru dava = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `İdari Yargılama ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Görev / yetki',
        'Ehliyet / menfaat',
        'Süre',
        'Dava türü (iptal / tam yargı)',
        'YD veya esas',
        'Kanun yolu',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'idari-yargilama-donem-2'
          ? [
              ['İptal', 'Tam yargı', 'İşlem iptali mi tazminat mı?'],
              ['YD', 'İptal hükmü', 'Geçici mi nihai mi?'],
              ['İstinaf', 'Temyiz', 'Bölge mi Danıştay mı?'],
              ['Zarar', 'Hukuka aykırılık', 'Tazminat unsuru mu iptal sebebi mi?'],
            ]
          : variantCode === 'idari-yargilama-donem-1'
            ? [
                ['Görev', 'Yetki', 'Mahkeme türü mü yer mi?'],
                ['Ehliyet', 'Menfaat', 'Taraf olabilme mi ihlal mi?'],
                ['İptal', 'Tam yargı', 'İşlem mi zarar mı?'],
                ['Tebliğ', 'Öğrenme', 'Süre ne zaman başlar?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Kapı/iptal mi tam yargı/yol mu?'],
                ['Görev', 'Yetki', 'Tür mü yer mi?'],
                ['İptal', 'Tam yargı', 'İptal mi tazminat mı?'],
                ['YD', 'Esas', 'Geçici mi nihai mi?'],
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
      leftTitle: 'Kapı / iptal',
      rightTitle: 'Tam yargı / yol',
      left: 'Görev–yetki–süre–menfaat–iptal',
      right: 'Zarar–YD–istinaf/temyiz',
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
      a: '1. dönem teşkilat–görev–yetki–süre–iptal; 2. dönem tam yargı–YD–istinaf/temyiz; yıllık ikisini birleştirir.',
    },
    {
      q: 'İdare hukuku notuyla birlikte mi?',
      a: 'Evet. İşlem unsurları idare hukuku triple’ında; dava usulü bu nottadır.',
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
    'Süreleri İYUK’tan doğruladım',
    'PDF’i arşivledim',
    variantCode === 'idari-yargilama-yillik'
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
      `${uni.shortName} idari yargılama ${meta.short}`,
      `${uni.shortName} İYUK ders notu`,
      `idari yargılama ${meta.short} not pdf`,
      'iptal davası tam yargı yürütmenin durdurulması ders notu',
      'idari yargı yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} idari yargılama`),
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
        'Kapıyı ilk kontrol et',
        'Süre başlangıcını yaz',
        'İptal / tam yargı ayır',
        'YD’de iki şartı yaz',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `İdari Yargılama ${meta.short} kapsamındaki kurumları ayırır`,
      'Görev–yetki–süre–menfaat kapısını kurar',
      'İptal ve tam yargı rejimini uygular',
      'YD ve kanun yolu takvimini yönetir',
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
    relatedCourses: IDARI_YARGILAMA_VARIANTS.filter((c) => c !== variantCode).concat([
      'idari-yargilama',
      'idare-hukuku-yillik',
      'anayasa-2',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'idari-yargilama-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'idari-yargilama',
    variantLabel: meta.label,
  };
}
