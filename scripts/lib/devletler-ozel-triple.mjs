/**
 * Devletler Özel Hukuku / MÖHUK —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * devletler-ozel dersiyle hizalı (mufredat: year 4).
 */

function baseMeta(variant) {
  const labels = {
    'devletler-ozel-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'MÖHUK · 1. yarı (yabancı unsur, nitelendirme, bağlama, kamu düzeni, kişi–aile statüsü)',
    },
    'devletler-ozel-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'MÖHUK · 2. yarı (sözleşme–haksız fiil–eşya, milletlerarası yetki, tanıma–tenfiz, tahkim girişi)',
    },
    'devletler-ozel-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'MÖHUK tam omurga · bağlama + yetki + tanıma/tenfiz · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Yabancı unsur var mı, hangi hukuk uygulanır? Bağlama kapısı burada açılır.',
    promise:
      'Yabancı unsur, nitelendirme, bağlama noktaları, atıf, kamu düzeni, doğrudan uygulanan kurallar; kişi halleri ve aile hukuku bağlama omurgası. Güz finalinde “kapsam + bağlama + istisna” bozulmadan yazarsınız.',
    sixtySecond: [
      'MÖHUK: yabancı unsur taşıyan özel hukuk ilişkilerinde uygulanacak hukuku gösterir.',
      'Yabancı unsur: taraf, yer, fiil, konu…',
      'Nitelendirme: uyuşmazlığın hukuki kutusu (lex fori ağırlıklı tartışma).',
      'Bağlama noktası: vatandaşlık, mutat mesken, sözleşme yeri vb.',
      'Kamu düzeni: yabancı hukukun uygulanmasını engelleyebilir (dar yorum).',
      'Kişi–aile: statü bağlama kuralları (çerçeve; güncel MÖHUK).',
    ],
    pillars: [
      'Devletler özel hukukunun konusu',
      'Yabancı unsur ve kapsam',
      'Nitelendirme (karakterizasyon)',
      'Bağlama kuralları ve bağlama noktaları',
      'Atıf (renvoi) girişi',
      'Kamu düzeni ve doğrudan uygulanan kurallar',
      'Kişi halleri ve ehliyet',
      'Aile hukuku bağlama girişi',
    ],
    definitions: [
      {
        baslik: 'Yabancı unsur',
        govde:
          'Uyuşmazlığın birden fazla hukuk düzeniyle bağlantı kurmasını sağlayan olgudur: taraf vatandaşlığı/meskeni, işlem yeri, malın bulunduğu yer, zarar yeri vb.',
      },
      {
        baslik: 'Bağlama kuralı',
        govde:
          'Belirli bir hukuki ilişki kategorisi için uygulanacak hukuku, seçilen bağlama noktası üzerinden gösteren kuraldır.',
      },
      {
        baslik: 'Nitelendirme',
        govde:
          'Somut olayın hangi bağlama kuralı kategorisine girdiğinin belirlenmesidir. Kutu yanlış seçilirse sonuç bozulur.',
      },
      {
        baslik: 'Kamu düzeni (ordre public)',
        govde:
          'Yabancı hukukun uygulanmasının veya yabancı kararın sonuçlarının, for’un temel değerleriyle açıkça bağdaşmaması hâlinde devreye giren istisna mekanizmasıdır. Dar yorumlanır.',
      },
      {
        baslik: 'Doğrudan uygulanan kural',
        govde:
          'Bağlama kuralına bakılmaksızın, for’un veya ilgili ülkenin zorunlu nitelikteki kurallarının doğrudan uygulanmasıdır (uluslararası zorunlu normlar çerçevesi).',
      },
    ],
    traps: [
      'Yabancı unsur yokken MÖHUK yazmak.',
      'Nitelendirmeyi atlayıp doğrudan madde numarası ezberlemek.',
      'Kamu düzenini her aykırılığa yapıştırmak — dar yorum.',
      'Vatandaşlık / mutat mesken / ikametgâhı karıştırmak.',
      'Atıf sonucunu uydurmak — güncel MÖHUK rejimini doğrula.',
    ],
    keyMadde: [
      '5718 s. MÖHUK — amaç ve kapsam (çerçeve; güncel metin)',
      'MÖHUK — genel hükümler: nitelendirme, atıf, kamu düzeni (çerçeve)',
      'MÖHUK — kişi halleri / ehliyet (çerçeve)',
      'MÖHUK — evlilik, boşanma, velayet vb. (çerçeve)',
      'Anayasa / AİHS — kamu düzeni ve insan hakları köprüsü',
      'Milletlerarası yetki: MÖHUK II. kısım (2. dönem bağ)',
    ],
    sectionsExtra: [
      {
        heading: 'A. MÖHUK ne işe yarar?',
        paragraphs: [
          'Hangi ülkenin maddi hukuku uygulanır sorusunu cevaplar. Usulde milletlerarası yetki ve tanıma–tenfiz ayrı katmanlardır; 1. dönem bağlama omurgasını taşır.',
          'Sınav iskeleti: yabancı unsur → nitelendirme → bağlama → istisna.',
        ],
        hapBilgi: 'Önce kutu (nitelendirme), sonra bağlama noktası.',
      },
      {
        heading: 'B. Yabancı unsur',
        paragraphs: [
          'Tek taraflı yabancılık yeter; “ne kadar yabancı?” tartışması bağlama yoğunluğuyla ilgilidir. Saf iç ilişki MÖHUK dışındadır.',
          'Örnek: yabancı uyruklu taraf, yurtdışında akdedilen sözleşme, yurtdışındaki taşınmaz.',
        ],
        bullets: [
          'Taraf unsuru',
          'Yer unsuru',
          'Konu / mal unsuru',
          'Fiil / zarar unsuru',
        ],
      },
      {
        heading: 'C. Nitelendirme',
        paragraphs: [
          'Sözleşme mi haksız fiil mi? Evlilik mi nişan mı? Kutu for hukukuna göre mi yoksa başka yaklaşımlarla mı belirlenir? Klasik tartışma: lex fori ağırlıklıdır; sınavda bilinçli cümle yazılır.',
          'Yanlış kutu = yanlış bağlama kuralı.',
        ],
        uyari: 'Madde ezberi nitelendirmenin yerini tutmaz.',
      },
      {
        heading: 'D. Bağlama noktaları',
        paragraphs: [
          'Vatandaşlık, mutat mesken, ikametgâh, işlem yeri, ifa yeri, malın bulunduğu yer, zarar yeri, tarafların seçimi (party autonomy).',
          'Hiyerarşi ve alternatif bağlama kuralları olay tipine göre yazılır.',
        ],
        kartlar: [
          { baslik: 'Vatandaşlık', govde: 'Kişi hallerinde sık.' },
          { baslik: 'Mutat mesken', govde: 'Fiili merkez.' },
          { baslik: 'Sözleşme yeri', govde: 'Akdin yapıldığı yer.' },
          { baslik: 'Seçim', govde: 'Tarafların hukuk seçimi.' },
        ],
      },
      {
        heading: 'E. Atıf, kamu düzeni, doğrudan kurallar',
        paragraphs: [
          'Atıf: yabancı hukukun kendi MÖHUK’u for’a veya üçüncü hukuka gönderebilir (kabul/red rejimine dikkat; güncel MÖHUK).',
          'Kamu düzeni: sonuç odaklı, istisnai. Doğrudan uygulanan kurallar: bağlama zincirini kesebilir.',
        ],
        hapBilgi: 'Kamu düzeni = son kapı, ilk kapı değil.',
      },
      {
        heading: 'F. Kişi halleri ve ehliyet',
        paragraphs: [
          'Hak ve fiil ehliyeti, isim, vesayet gibi statü konuları bağlama kurallarına tabidir. Çifte vatandaşlık / vatansızlık özel durumlardır (çerçeve).',
        ],
      },
      {
        heading: 'G. Aile hukuku bağlama girişi',
        paragraphs: [
          'Evliliğin kuruluşu, genel hükümler, boşanma, velayet, nafaka gibi alanlarda ayrı bağlama kuralları vardır. 2. dönemde sözleşme ve yetkiyle birleşir.',
          'Uydurma madde numarası yazma; kategoriyi ve bağlama noktasını yaz.',
        ],
      },
    ],
    examples: [
      {
        title: 'Yabancı unsur',
        facts:
          'İki Türk, Ankara’da TBK satımı yapar; mal Türkiye’dedir.',
        analysis:
          'Yabancı unsur yok. MÖHUK uygulanmaz. İç hukuk.',
        takeaway: 'Önce yabancı unsur sor.',
      },
      {
        title: 'Nitelendirme',
        facts:
          'Yabancı unsurlu uyuşmazlık; öğrenci “sözleşme” der, olay haksız fiildir.',
        analysis:
          'Yanlış kutu. Yanlış bağlama. Sonuç bozulur.',
        takeaway: 'Kutuyu gerekçeyle seç.',
      },
      {
        title: 'Kamu düzeni',
        facts:
          'Yabancı hukuk for’dan biraz farklıdır; öğrenci kamu düzeni der.',
        analysis:
          'Dar yorum. “Açıkça bağdaşmazlık” eşiği. Aşırı kullanım hata.',
        takeaway: 'Kamu düzeni istisnadır.',
      },
      {
        title: 'Bağlama noktası',
        facts:
          'Kişi hali; vatandaşlık ve mutat mesken çatışır.',
        analysis:
          'Kanunî hiyerarşi / özel kural. Çifte vatandaşlık.',
        takeaway: 'Noktayı kanundan seç.',
      },
    ],
    mindmap: {
      center: 'MÖHUK · 1. dönem',
      branches: [
        { label: 'Kapı', items: ['Yabancı unsur', 'Nitelendirme'] },
        { label: 'Bağlama', items: ['Nokta', 'Kural'] },
        { label: 'İstisna', items: ['Kamu düzeni', 'Doğrudan kural'] },
        { label: 'Statü', items: ['Kişi', 'Aile'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Sözleşme–haksız fiil–eşya, milletlerarası yetki, tanıma–tenfiz. Uygulama sahası.',
    promise:
      'Borçlar ve eşya bağlama kuralları, milletlerarası yetki, yabancı mahkeme kararlarının tanınması ve tenfizi, tahkim girişi. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Sözleşmede hukuk seçimi (party autonomy) önceliklidir (sınırlarla).',
      'Haksız fiilde zarar yeri / ortak mutat mesken vb. (çerçeve).',
      'Eşyada lex rei sitae (malın bulunduğu yer) klasik omurgadır.',
      'Milletlerarası yetki: Türk mahkemesi bakabilir mi?',
      'Tanıma: hüküm etkisi; tenfiz: icra etkisi.',
      'Şartlar: kesinleşme, yetki, kamu düzeni, tebliğ/savunma (çerçeve).',
    ],
    pillars: [
      'Sözleşmelerde uygulanacak hukuk',
      'Haksız fiil ve sebepsiz zenginleşme girişi',
      'Eşya hukuku bağlama',
      'Milletlerarası yetki',
      'Yetki sözleşmeleri',
      'Yabancı kararların tanınması',
      'Tenfiz',
      'Milletlerarası tahkim girişi',
    ],
    definitions: [
      {
        baslik: 'Hukuk seçimi',
        govde:
          'Tarafların sözleşmeye uygulanacak hukuku seçmesidir. MÖHUK’ta serbesti asıldır; sınırlar ve zımnî seçim bilinir.',
      },
      {
        baslik: 'Milletlerarası yetki',
        govde:
          'Yabancı unsurlu uyuşmazlıkta Türk mahkemelerinin dava görmeye yetkili olup olmadığıdır. İç yetki kurallarından ayrı düşünülür (bağlantı kuralları).',
      },
      {
        baslik: 'Tanıma',
        govde:
          'Yabancı mahkeme kararının Türkiye’de kesin hüküm ve benzeri etkiler doğurmasıdır. Ayrı bir tenfiz kararı olmadan da bazı etkiler tartışılır; klasik ayrım tanıma / tenfizdir.',
      },
      {
        baslik: 'Tenfiz',
        govde:
          'Yabancı mahkeme kararının Türkiye’de cebri icraya elverişli kılınmasıdır. Kanunî şartlar birlikte aranır.',
      },
      {
        baslik: 'Lex rei sitae',
        govde:
          'Eşya üzerindeki ayni haklara, malın bulunduğu yer hukukunun uygulanması ilkesidir. Taşınır/taşınmaz ayrımı önem taşır.',
      },
    ],
    traps: [
      'Hukuk seçimini sınırsız sanmak — zayıf taraf / emredici sınırlar.',
      'İç yetki ile milletlerarası yetkiyi karıştırmak.',
      'Tanıma ve tenfizi aynı sanmak.',
      'Tenfiz şartlarını eksik listelemek.',
      'Yabancı hakem kararını mahkeme kararı gibi yazmak — ayrı rejim (NY Sözleşmesi vb.).',
    ],
    keyMadde: [
      'MÖHUK — sözleşmeden doğan borç ilişkileri (çerçeve)',
      'MÖHUK — haksız fiil (çerçeve)',
      'MÖHUK — ayni haklar / eşya (çerçeve)',
      'MÖHUK — milletlerarası yetki (çerçeve)',
      'MÖHUK — tanıma ve tenfiz şartları (çerçeve; güncel metin)',
      'New York Sözleşmesi — yabancı hakem kararları (giriş)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Sözleşmede uygulanacak hukuk',
        paragraphs: [
          'Açık veya zımnî hukuk seçimi. Seçim yoksa objektif bağlama (karakteristik edim, en sıkı irtibat — kanunî formülasyon).',
          'Tüketici / iş sözleşmesi gibi zayıf taraf korumaları bağlama serbestisini sınırlayabilir (çerçeve).',
        ],
        hapBilgi: 'Seçim var mı? Yoksa objektif bağlama.',
      },
      {
        heading: 'B. Haksız fiil ve diğer borçlar',
        paragraphs: [
          'Zararın meydana geldiği yer, ortak mutat mesken, daha sıkı irtibat istisnası (çerçeve). Ürün sorumluluğu / trafik gibi özel bağlar tartışılabilir.',
          'Sebepsiz zenginleşme ve vekâletsiz iş görme ayrı kategoridir; nitelendirme yine kapıdır.',
        ],
      },
      {
        heading: 'C. Eşya hukuku',
        paragraphs: [
          'Taşınmaz: bulunduğu yer. Taşınır: bulunma yeri + istisnalar (transit, taşıma). Rehin / mülkiyet devri bağlama ile tescil ilişkisi yazılır.',
        ],
        kartlar: [
          { baslik: 'Taşınmaz', govde: 'Bulunduğu yer hukuku.' },
          { baslik: 'Taşınır', govde: 'Sitae + istisna.' },
          { baslik: 'Tescil', govde: 'Usul / sicil devleti.' },
          { baslik: 'İstisna', govde: 'Kamu düzeni / doğrudan kural.' },
        ],
      },
      {
        heading: 'D. Milletlerarası yetki',
        paragraphs: [
          'Genel yetki, özel yetki sebepleri, yetki sözleşmesi, münhasır yetki (ör. bazı taşınmazlar). Yetkisizlik itirazı usulü.',
          'Forum non conveniens benzeri tartışmalar sınırlıdır; Türk sisteminde kanunî yetki esastır.',
        ],
        uyari: 'İç yetki ≠ milletlerarası yetki.',
      },
      {
        heading: 'E. Tanıma ve tenfiz',
        paragraphs: [
          'Şartlar: yabancı mahkeme kararı, hukuk uyuşmazlığı, kesinleşme, (tenfizde) mütekabiliyet gibi unsurlar güncel metinden doğrulanır; uydurma liste yok.',
          'Kamu düzeni ve savunma hakkı ihlali ret sebebidir. Esasa girilmez (kural).',
        ],
        hapBilgi: 'Tanıma = etki; tenfiz = icra.',
      },
      {
        heading: 'F. Tahkim girişi',
        paragraphs: [
          'Milletlerarası tahkim anlaşması, New York Sözleşmesi ile yabancı hakem kararlarının tanınması/tenfizi. Mahkeme kararı rejiminden ayrılır.',
          'Sınavda bir paragraf yeter; derin tahkim ayrı derstir.',
        ],
      },
      {
        heading: 'G. Pratik sınav zinciri',
        paragraphs: [
          ' (1) Yabancı unsur (2) Nitelendirme (3) Uygulanacak hukuk (4) Yetki (5) Varsa tanıma/tenfiz. Her kutu bir başlık.',
        ],
      },
    ],
    examples: [
      {
        title: 'Hukuk seçimi',
        facts:
          'Taraflar İsviçre hukuku seçer; uyuşmazlık Türkiye’de görülür.',
        analysis:
          'Party autonomy. Sınır var mı? Maddi hukuk İsviçre; usul for.',
        takeaway: 'Seçim + sınırları yaz.',
      },
      {
        title: 'Yetki',
        facts:
          'Davalı yurtdışında; sözleşme Türkiye’de ifa edilecektir.',
        analysis:
          'Milletlerarası yetki sebepleri. Özel yetki. Tebligat.',
        takeaway: 'Yetki kutusunu ayrı aç.',
      },
      {
        title: 'Tenfiz',
        facts:
          'Yabancı ilam tenfiz istenir; davalı “esas yanlış” der.',
        analysis:
          'Esasa girilmez (kural). Şartlar ve ret sebepleri.',
        takeaway: 'Tenfiz ≠ istinaf.',
      },
      {
        title: 'Eşya',
        facts:
          'Almanya’daki taşınmaz üzerinde ayni hak iddiası.',
        analysis:
          'Lex rei sitae. Münhasır yetki ihtimali. Bağlama + yetki.',
        takeaway: 'Taşınmazda yer hukuku ağır basar.',
      },
    ],
    mindmap: {
      center: 'MÖHUK · 2. dönem',
      branches: [
        { label: 'Borçlar', items: ['Sözleşme', 'Haksız fiil'] },
        { label: 'Eşya', items: ['Sitae', 'Tescil'] },
        { label: 'Yetki', items: ['Genel', 'Özel', 'Sözleşme'] },
        { label: 'Karar', items: ['Tanıma', 'Tenfiz'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Yabancı unsurdan bağlama ve kamu düzenine, yetkiden tanıma–tenfize tek omurga.',
    promise:
      '1. + 2. dönem birleşik; MÖHUK için “tek cilt” not. Bağlama + milletlerarası yetki + yabancı karar.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: bağlama mı, yetki/tenfiz mi?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: yabancı unsur–nitelendirme → bağlama–istisna → sözleşme/eşya → yetki → tanıma/tenfiz → karma.',
          'Her soruda: “Hangi kutu? Hangi hukuk? Hangi mahkeme? Karar etkisi?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru kutu + doğru bağlama + doğru usul katmanı.',
        bullets: [
          'Hafta 1–3: yabancı unsur + nitelendirme + bağlama',
          'Hafta 4–6: kamu düzeni + kişi/aile',
          'Hafta 7–10: sözleşme + haksız fiil + eşya',
          'Hafta 11–14: yetki + tanıma/tenfiz + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Nitelendirme. Tip 2 — Bağlama/istisna. Tip 3 — Hukuk seçimi. Tip 4 — Milletlerarası yetki. Tip 5 — Tanıma. Tip 6 — Tenfiz.',
          'Karma olayda maddi hukuk bağlama ile usul yetki/tenfiz ayrı paragraflarda yazılır. Uydurma madde numarası yerine kategori + bağlama noktası kullan.',
        ],
        uyari: 'Maddi bağlama ile yetkiyi tek torbada eritme.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'MÖHUK · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Unsur', 'Bağlama', 'İstisna'] },
        { label: '2. yarı', items: ['Borçlar', 'Yetki', 'Tenfiz'] },
        { label: 'Yöntem', items: ['Kutu seç', 'Nokta seç'] },
        { label: 'Usul', items: ['Yetki', 'Tanıma'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'devletler-ozel-donem-1': d1Content,
  'devletler-ozel-donem-2': d2Content,
  'devletler-ozel-yillik': yillikContent,
};

export const DEVLETLER_OZEL_VARIANTS = [
  'devletler-ozel-donem-1',
  'devletler-ozel-donem-2',
  'devletler-ozel-yillik',
];

export function buildDevletlerOzelVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} MÖHUK ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Devletler Özel Hukuku (MÖHUK) ${meta.h1Extra}`;
  const description = `${uni.name} için MÖHUK ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Devletler Özel Hukuku / MÖHUK ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: yabancı unsurlu uyuşmazlıkta uygulanacak hukuku, yetkiyi ve tanıma–tenfizi sınavda bozmadan yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. 5718 s. MÖHUK omurgadır; madde numarası uydurulmaz, kategori + bağlama noktası yazılır.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: yabancı unsur var mı?',
        'Nitelendirme → bağlama → istisna / yetki / tenfiz',
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
        '5718 s. MÖHUK ana kaynaktır. Bağlama ve tenfiz şartları metinden doğrulanır; ezbere uydurma yasak.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde / şart listesi yazmayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (MÖHUK)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık işe yarar. 60 dk / 2–3 soruda önce kutu, sonra bağlama veya yetki.`,
        'İskelet: (1) yabancı unsur (2) nitelendirme (3) bağlama/istisna (4) yetki (5) tanıma/tenfiz.',
      ],
      bullets: [
        'Kutuyu ilk yaz',
        'Bağlama noktasını gerekçele',
        'Kamu düzenini dar tut',
        'Yetki ile maddi hukuku ayır',
      ],
      hapBilgi: 'Doğru kutu + doğru nokta = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `MÖHUK ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Yabancı unsur',
        'Nitelendirme',
        'Bağlama kuralı',
        'İstisna (kamu düzeni vb.)',
        'Milletlerarası yetki',
        'Tanıma / tenfiz (varsa)',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'devletler-ozel-donem-2'
          ? [
              ['Hukuk seçimi', 'Objektif bağlama', 'Taraflar hukuk seçti mi?'],
              ['İç yetki', 'Milletlerarası yetki', 'Yabancı unsur + hangi mahkeme?'],
              ['Tanıma', 'Tenfiz', 'Etki mi icra mı?'],
              ['Mahkeme kararı', 'Hakem kararı', 'Hangi rejim?'],
            ]
          : variantCode === 'devletler-ozel-donem-1'
            ? [
                ['Bağlama kuralı', 'Maddi hukuk', 'Hangi hukuk mu ne diyor mu?'],
                ['Vatandaşlık', 'Mutat mesken', 'Hangi bağlama noktası?'],
                ['Kamu düzeni', 'Doğrudan kural', 'İstisna mı emredici uygulama mı?'],
                ['Nitelendirme', 'Bağlama', 'Kutu mu nokta mı?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Bağlama mı yetki/tenfiz mi?'],
                ['Maddi bağlama', 'Yetki', 'Hangi hukuk mu hangi mahkeme mi?'],
                ['Tanıma', 'Tenfiz', 'Etki mi icra mı?'],
                ['Sözleşme', 'Haksız fiil', 'Hangi kutu?'],
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
      leftTitle: 'Bağlama / istisna',
      rightTitle: 'Yetki / tenfiz',
      left: 'Nitelendirme–bağlama–kamu düzeni',
      right: 'Milletlerarası yetki–tanıma–tenfiz',
    },
    {
      kind: 'cycle',
      title: 'Haftalık döngü',
      steps: ['Kural', 'Şema', 'Örnek', 'Quiz', 'Yanlış defteri'],
    },
  ];

  const faq = [
    {
      q: '1. dönem / 2. dönem / yıllık farkı ne?',
      a: '1. dönem yabancı unsur–nitelendirme–bağlama–kişi/aile; 2. dönem sözleşme/haksız fiil/eşya–yetki–tanıma/tenfiz; yıllık ikisini birleştirir.',
    },
    {
      q: 'MÖHUK madde numarası ezberlenecek mi?',
      a: 'Kategori ve bağlama noktası asıldır. Numara yazacaksanız güncel 5718 s. metinden doğrulayın; uydurma yasak.',
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
    'Nitelendirme–bağlama–yetki ayrımını denedim',
    'PDF’i arşivledim',
    variantCode === 'devletler-ozel-yillik'
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
      `${uni.shortName} MÖHUK ${meta.short}`,
      `${uni.shortName} devletler özel hukuku ders notu`,
      `MÖHUK ${meta.short} not pdf`,
      'yabancı unsur bağlama tenfiz tanıma',
      'devletler özel hukuku yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} MÖHUK`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format: uni.type === 'vakif' ? 'Klasik + ara; vaka analizi olabilir' : 'Klasik yazılı + vaka analizi',
      tips: [
        'Yabancı unsuru ilk yaz',
        'Nitelendirme kutusunu seç',
        'Bağlama noktasını gerekçele',
        'Yetki ve tenfizi ayrı başlıkla',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `MÖHUK ${meta.short} kurumlarını ayırır`,
      'Nitelendirme ve bağlama zincirini kurar',
      'Kamu düzeni ve hukuk seçimini uygular',
      'Milletlerarası yetki ile tanıma–tenfizi yazar',
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
    relatedCourses: DEVLETLER_OZEL_VARIANTS.filter((c) => c !== variantCode).concat([
      'devletler-ozel',
      'milletlerarasi-hukuk',
      'medeni-usul',
      'borclar-genel-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'devletler-ozel-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'devletler-ozel',
    variantLabel: meta.label,
  };
}
