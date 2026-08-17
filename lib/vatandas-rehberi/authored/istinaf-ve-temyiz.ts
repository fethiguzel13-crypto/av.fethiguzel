import type { VatandasArticle } from '../types';

/**
 * Kaynak doğrulaması — content-packs/hmk.json.gz resmî metninden:
 *   HMK m.341     istinaf yoluna başvurulabilen kararlar · kesinlik sınırı
 *                 (kanun metnindeki taban: üç bin TL) · manevi tazminatta
 *                 miktara bakılmaksızın istinaf · kısmi/tam dava kuralı
 *                 · AYM 24/2/2022 E.2021/34 K.2022/21 — kamulaştırma
 *                   bedelinin tespiti yönünden iptal (dipnot 45)
 *   HMK m.342     istinaf dilekçesinin unsurları · f.3 kurtarıcı hüküm
 *   HMK m.343     dilekçenin hangi mahkemeye verileceği · alındı belgesi
 *   HMK m.344     harç ve giderler dilekçe verilirken ödenir · bir haftalık
 *                 kesin süre · başvurunun yapılmamış sayılması
 *   HMK m.345     istinaf süresi iki hafta, tebliğle işlemeye başlar
 *   HMK m.361     temyiz süresi iki hafta · haklı çıkan tarafın temyizi
 *   HMK m.362     temyiz edilemeyen kararlar (a-g) · taban rakam kırk bin TL
 *                 · f.2 kısmi dava ve katılma yoluyla temyiz
 *                 · AYM 8/10/2025 E.2025/124 K.2025/203 (dipnot 57)
 *                 · AYM 26/2/2026 E.2026/49 K.2026/48 (dipnot 58)
 *   HMK EK m.1    parasal sınırlar her takvim yılı başında yeniden değerleme
 *                 oranında artırılır · bin TL'yi aşmayan kısım dikkate
 *                 alınmaz · sınırda DAVANIN AÇILDIĞI TARİH esas alınır
 *
 * Doğrulama: node scripts/madde.mjs hmk 341-345 · 361-362 · 449-452
 *
 * SAYI UYARISI: Kanundaki "üç bin" ve "kırk bin" rakamları TABAN değerdir ve
 * EK m.1 uyarınca her yıl yeniden değerlemeyle artar. Bu metinde güncel yıl
 * rakamı VERİLMEZ; mekanizma anlatılır ve rakamın yıllık ilandan okunması
 * gerektiği söylenir.
 */
export const istinafVeTemyiz: VatandasArticle = {
  slug: 'istinaf-ve-temyiz-sureleri',
  title: 'İstinaf ve Temyiz: Süreler, Parasal Sınırlar ve Dilekçe',
  description:
    'İstinaf süresi iki hafta, temyiz süresi iki hafta. Hangi karar istinaf edilebilir, hangi karar temyiz edilemez, parasal sınır hangi tarihe göre belirlenir? HMK m.341-345, m.361-362 ve EK m.1 çerçevesinde.',
  h1: 'İstinaf ve temyiz nasıl işler?',
  keywords: [
    'istinaf süresi',
    'temyiz süresi',
    'istinaf dilekçesi',
    'temyiz edilemeyen kararlar',
    'istinaf parasal sınır',
    'kesinlik sınırı',
  ],
  category: 'Usul',
  role: 'pillar',
  related: ['dava-nasil-acilir', 'usulsuz-tebligat-ve-itiraz'],
  links: [
    { label: 'HMK m.341 — İstinaf yoluna başvurulabilen kararlar', href: '/mevzuat/hmk/madde-341' },
    { label: 'HMK m.342 — İstinaf dilekçesi', href: '/mevzuat/hmk/madde-342' },
    { label: 'HMK m.344 — Harç ve giderlerin yatırılması', href: '/mevzuat/hmk/madde-344' },
    { label: 'HMK m.345 — Başvuru süresi', href: '/mevzuat/hmk/madde-345' },
    { label: 'HMK m.361 — Temyiz edilebilen kararlar', href: '/mevzuat/hmk/madde-361' },
    { label: 'HMK m.362 — Temyiz edilemeyen kararlar', href: '/mevzuat/hmk/madde-362' },
    { label: 'İstinaf ve temyiz süresi aracı', href: '/hesaplama/istinaf-temyiz' },
  ],
  lead:
    'İstinaf ve temyiz sürelerinin ikisi de iki haftadır ve ikisi de kararın usulüne uygun tebliğiyle işlemeye başlar. Asıl güçlük süredeyse değil, kararın kanun yoluna açık olup olmadığındadır; parasal sınırlar her yıl değişir ve hangi yılın sınırının uygulanacağı davanın açıldığı tarihe göre belirlenir.',
  keyInsight:
    'Parasal sınır, kanun yoluna başvurduğunuz yılın değil, DAVANIN AÇILDIĞI yılın sınırıdır. HMK EK m.1 bunu açıkça söyler ve pratikte en sık yapılan hata buradadır.',
  sections: [
    {
      heading: 'Süreler',
      paragraphs: [
        'İstinaf yoluna başvuru süresi iki haftadır ve bu süre, ilamın usulen taraflardan her birine tebliğiyle işlemeye başlar. Özel kanun hükümleri saklı tutulmuştur; iş davaları gibi alanlarda farklı süre öngörülmüş olabilir.',
        'Temyiz süresi de iki haftadır. Bölge adliye mahkemesi hukuk dairelerinden verilen temyizi kabil nihai kararlar ile hakem kararlarının iptali talebi üzerine verilen kararlara karşı, tebliğ tarihinden itibaren iki hafta içinde temyiz yoluna başvurulabilir.',
        'Sürenin başlangıcı tebliğdir, öğrenme değil. Kararı duruşmada öğrenmiş olmanız süreyi başlatmaz; usulüne uygun tebligat yapılmadıkça süre işlemez.',
        'Buna karşılık usulsüz bir tebligat da süreyi kendiliğinden geçersiz kılmaz. Usulsüzlüğün ileri sürülmesi ayrı bir usul meselesidir.',
      ],
    },
    {
      heading: 'Hangi kararlar istinaf edilebilir?',
      paragraphs: [
        'Kanun iki grup karar sayar: Nihai kararlar ile ihtiyati tedbir ve ihtiyati haciz taleplerinin reddi kararları, karşı tarafın yüzüne karşı verilen ihtiyati tedbir ve ihtiyati haciz kararları ve karşı tarafın yokluğunda verilen bu kararlara karşı yapılan itiraz üzerine verilen kararlar.',
        'Bir de kesinlik sınırı vardır. Miktar veya değeri kanunda yazılı sınırı geçmeyen malvarlığı davalarına ilişkin kararlar kesindir; bu kararlara karşı istinaf yolu kapalıdır.',
        'Manevi tazminat bu sınırın dışında tutulmuştur. Manevi tazminat davalarında verilen kararlara karşı, miktar veya değere bakılmaksızın istinaf yoluna başvurulabilir.',
        'Anayasa Mahkemesi 24/2/2022 tarihli ve E.2021/34, K.2022/21 sayılı kararıyla, kesinlik kuralını kamulaştırma bedelinin tespitine ilişkin davalar yönünden iptal etmiştir.',
      ],
    },
    {
      heading: 'Kısmi dava ve tam dava ayrımı',
      paragraphs: [
        'Sınırın nasıl ölçüleceği alacağın ne kadarının dava edildiğine bağlıdır ve bu ayrım gözden kaçarsa başvuru boşa gider.',
        'Alacağın bir kısmı dava edilmişse kesinlik sınırı alacağın tamamına göre belirlenir. Yani talep ettiğiniz kısım küçük olsa bile ölçü, alacağın bütünüdür.',
        'Alacağın tamamı dava edilmişse ölçü değişir: Kararda asıl talebinin kabul edilmeyen bölümü sınırı geçmeyen taraf istinaf yoluna başvuramaz. Burada bakılan şey, o tarafın kaybettiği miktardır.',
        'Aynı mantık temyizde de geçerlidir. Ne var ki temyizde bir imkân daha vardır: Karşı taraf temyiz yoluna başvurduğu takdirde, diğer taraf da düzenleyeceği cevap dilekçesiyle kararı temyiz edebilir.',
      ],
    },
    {
      heading: 'Parasal sınır hangi yılın sınırıdır?',
      paragraphs: [
        'Kanun metnindeki rakamlar taban değerdir ve olduğu gibi uygulanmaz. HMK EK m.1 uyarınca bu sınırlar her takvim yılı başından geçerli olmak üzere, önceki yılda uygulanan sınırların yeniden değerleme oranında artırılması suretiyle uygulanır.',
        'Artırma sonrası bulunan tutarın bin Türk lirasını aşmayan kısımları dikkate alınmaz; sınır bin liralık basamaklara yuvarlanır.',
        'Asıl kritik hüküm ikinci fıkradadır. İstinaf ve temyiz parasal sınırlarının uygulanmasında davanın açıldığı tarihteki miktar esas alınır.',
        'Sonucu şudur: 2023 yılında açılmış bir dava, kararı 2026 yılında istinaf edilse bile 2023 yılının sınırına tabidir. Kanun yoluna başvurduğunuz yılın rakamına bakmak yanlış sonuç verir.',
        'Bu nedenle güncel rakam bu metinde yazılmaz. Dosyanızda uygulanacak sınırı, davanın açıldığı yıl için ilan edilmiş tutardan okumanız gerekir.',
      ],
    },
    {
      heading: 'Temyiz edilemeyen kararlar',
      paragraphs: [
        'Bölge adliye mahkemesinin her kararı temyize açık değildir. Kanun kapalı olanları tek tek sayar.',
        'Parasal sınırın altında kalan davalara ilişkin kararlar ilk sırada gelir. Kira ilişkisinden doğan davalar bakımından ayrı bir düzenleme yapılmış olup, miktar veya değeri itibarıyla temyiz edilebilen alacak davaları ile üç aylık kira tutarı temyiz sınırının üzerinde olan diğer davalar bu kapsamın dışında tutulmuştur.',
        'Görev ve yetki kararları, yargı yeri belirlenmesine ilişkin kararlar, çekişmesiz yargı işlerinde verilen kararlar ve geçici hukuki korumalar hakkındaki kararlar da temyiz edilemez.',
        'Nüfus kayıtlarının düzeltilmesine ilişkin davalarla ilgili kararlar kapalıdır; ancak soybağına ilişkin sonuçlar doğuran davalar bu istisnanın dışında bırakılmıştır.',
        'Bu listenin bir bölümü Anayasa Mahkemesi denetiminden geçmiştir. 8/10/2025 tarihli ve E.2025/124, K.2025/203 sayılı kararla parasal sınır bendi kamulaştırma bedelinin tespitine ilişkin davalar yönünden iptal edilmiş olup, karar Resmî Gazete’de yayımlanmasından dokuz ay sonra yürürlüğe girer. 26/2/2026 tarihli ve E.2026/49, K.2026/48 sayılı kararla ise aynı bent, istinaf başvurusunun kısmen veya tümden kabulü hâli yönünden iptal edilmiştir.',
      ],
    },
    {
      heading: 'İstinaf dilekçesi ve harç',
      paragraphs: [
        'İstinaf yoluna başvurma dilekçeyle yapılır ve dilekçeye karşı tarafın sayısı kadar örnek eklenir.',
        'Dilekçede tarafların davadaki sıfatları ve kimlik bilgileri, varsa temsilci ve vekil bilgileri, kararın hangi mahkemeden verildiği, tarihi ve sayısı, kararın başvurana tebliğ edildiği tarih, kararın özeti, başvuru sebepleri ve gerekçesi, talep sonucu ve imza bulunur.',
        'Kanun burada bir güvenlik ağı bırakmıştır: Dilekçe, başvuranın kimliği ve imzasıyla, başvurulan kararı yeteri kadar belli edecek kayıtları taşıyorsa diğer hususlar bulunmasa bile reddolunmaz.',
        'Dilekçe kararı veren mahkemeye verilebileceği gibi başka bir yer mahkemesine de verilebilir. Hangi mahkemeye verilmişse orada bölge adliye mahkemesi başvuru defterine kaydolunur ve başvurana ücretsiz bir alındı belgesi verilir.',
        'Harç ve giderler dilekçe verilirken ödenir. Hiç ödenmediği veya eksik ödendiği sonradan anlaşılırsa, kararı veren mahkeme bir haftalık kesin süre verir ve aksi hâlde başvurudan vazgeçmiş sayılacağını yazılı olarak bildirir. Süre içinde tamamlanmazsa mahkeme başvurunun yapılmamış sayılmasına karar verir.',
      ],
    },
    {
      heading: 'Haklı çıkan taraf da başvurabilir mi?',
      paragraphs: [
        'Evet, ama şartlıdır. Davada haklı çıkmış olan taraf da, hukuki yararı bulunmak şartıyla temyiz yoluna başvurabilir.',
        'Uygulamada bunun karşılığı şudur: Talebiniz kabul edilmiş olsa bile gerekçe aleyhinize sonuç doğuruyorsa ya da faiz başlangıcı, vekâlet ücreti veya yargılama gideri gibi kalemler zarar veriyorsa hukuki yarar doğabilir.',
        'Hukuki yarar gösterilemezse başvuru bu sebeple reddedilir. Yalnızca gerekçeden memnun olmamak tek başına yeterli sayılmaz.',
      ],
    },
  ],
  steps: [
    'Kararın tebliğ tarihini tebligat parçasından tespit edin; süre buradan işler.',
    'Kararın kanun yoluna açık olup olmadığını kontrol edin.',
    'Parasal sınıra tabiyse, DAVANIN AÇILDIĞI yıl için ilan edilmiş sınırı bulun.',
    'Kısmi dava mı tam dava mı açıldığına göre sınırın neye göre ölçüleceğini belirleyin.',
    'İstinaf dilekçesini karşı taraf sayısı kadar örnekle hazırlayın.',
    'Başvuru sebeplerini ve gerekçesini somut biçimde yazın.',
    'Harç ve tebliğ giderleri dâhil tüm giderleri dilekçeyi verirken ödeyin.',
    'Alındı belgesini alın ve saklayın.',
  ],
  checklist: [
    'Gerekçeli karar örneği',
    'Tebligat parçası veya tebliğ tarihini gösteren belge',
    'İstinaf dilekçesi ve karşı taraf sayısı kadar örneği',
    'Vekâletname — vekille takip ediliyorsa',
    'Harç ve gider ödeme makbuzu',
    'Başvuru alındı belgesi',
  ],
  faq: [
    {
      q: 'İstinaf süresi kaç gündür?',
      a: 'İki haftadır ve ilamın usulen tebliğiyle işlemeye başlar. Özel kanunlarda öngörülen farklı süreler saklıdır.',
    },
    {
      q: 'Temyiz süresi kaç gündür?',
      a: 'İki haftadır; bölge adliye mahkemesi kararının tebliğ tarihinden itibaren işler.',
    },
    {
      q: 'Parasal sınır hangi yıla göre belirlenir?',
      a: 'Davanın açıldığı tarihteki miktar esas alınır. HMK EK m.1 bunu açıkça düzenler; kanun yoluna başvurduğunuz yılın rakamı değil, davayı açtığınız yılın rakamı uygulanır.',
    },
    {
      q: 'Kanundaki üç bin ve kırk bin lira rakamları bugün de geçerli mi?',
      a: 'Hayır, bunlar taban değerdir. Sınırlar her takvim yılı başından geçerli olmak üzere yeniden değerleme oranında artırılır ve bin lirayı aşmayan kısımlar dikkate alınmaz.',
    },
    {
      q: 'Manevi tazminat kararı kesinlik sınırının altında kalırsa istinaf edilebilir mi?',
      a: 'Evet. Manevi tazminat davalarında verilen kararlara karşı miktar veya değere bakılmaksızın istinaf yoluna başvurulabilir.',
    },
    {
      q: 'Kısmi dava açtım, sınır hangi tutara göre hesaplanır?',
      a: 'Alacağın bir kısmının dava edilmiş olması durumunda kesinlik sınırı alacağın tamamına göre belirlenir.',
    },
    {
      q: 'İstinaf dilekçesini hangi mahkemeye vermeliyim?',
      a: 'Kararı veren mahkemeye verebileceğiniz gibi başka bir yer mahkemesine de verebilirsiniz. Verdiğiniz mahkeme başvuru defterine kaydeder ve size ücretsiz alındı belgesi verir.',
    },
    {
      q: 'Harcı eksik yatırırsam başvurum düşer mi?',
      a: 'Doğrudan düşmez. Mahkeme bir haftalık kesin süre verir ve tamamlanmazsa başvurunun yapılmamış sayılmasına karar verir.',
    },
    {
      q: 'Karşı taraf temyize gitti, ben süreyi kaçırdım. Yapabileceğim bir şey var mı?',
      a: 'Parasal sınır nedeniyle temyiz hakkı bulunmayan taraf için kanun bir imkân tanır: Karşı taraf temyize başvurduğunda diğer taraf da cevap dilekçesiyle kararı temyiz edebilir.',
    },
    {
      q: 'Davayı kazandım ama gerekçe aleyhime. Temyize gidebilir miyim?',
      a: 'Davada haklı çıkmış taraf da hukuki yararı bulunmak şartıyla temyiz yoluna başvurabilir. Hukuki yararın somut olarak gösterilmesi gerekir.',
    },
  ],
  updated: '2026-08-16',
  sitemapPriority: 0.93,
};
