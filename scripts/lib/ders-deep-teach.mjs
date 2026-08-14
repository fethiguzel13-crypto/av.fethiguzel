/**
 * Derin anlatım bankası — kuru iskeleti ders anlatısına çevirir.
 * Her aile: 6–8 öğretici bölüm + işlenmiş örnek + sınav cümlesi.
 */

function S(heading, paragraphs, extra = {}) {
  return { heading, paragraphs, ...extra };
}

const BORCLAR_GENEL = {
  teach: [
    S(
      'Borç ilişkisi nedir? (tek cümle yetmez)',
      [
        'Günlük dilde borç, “ödeyeceğim para”dır. Hukukta borç ilişkisi daha geniştir: bir tarafta talep yetkisi (alacak), karşı tarafta edim yükümü (borç) vardır. Edim para olabileceği gibi bir iş yapmak, bir şey vermek veya bir şeyden kaçınmak da olabilir. TBK’nın genel hükümleri (m.1–206) tam bu iskeleti kurar.',
        'İlk ayrım şudur: borç ilişkisi ile tek bir borç aynı şey değildir. Bir satımda satıcının teslim borcu ve alıcının bedel borcu aynı ilişkinin iki yüzüdür. Sınavda “kim kime neyi borçludur?” diye sorun; cevap netleşmeden unsur yazmayın.',
        'Kaynak seçimi ikinci hamledir. İlişki sözleşmeden mi doğdu, haksız fiilden mi, sebepsiz zenginleşmeden mi, yoksa kanundan mı? Rejim değişir: irade sakatlığı sözleşmede vardır, haksız fiilde kusur ve illiyet konuşulur. Kaynağı yanlış seçmek, sonraki bütün puanı kaybettirir.',
      ],
      {
        hapBilgi: 'Önce kaynak, sonra unsur, en sonda sonuç. Tersinden yazılan kâğıt dağılır.',
        uyari: '“Borç var” demek yetmez. Alacaklı, borçlu ve edimi isimlendirin.',
        kartlar: [
          { baslik: 'Sözleşme', govde: 'İki iradenin uygunlaşması. İcap + kabul (+ şekil varsa).' },
          { baslik: 'Haksız fiil', govde: 'Hukuka aykırı fiil + zarar + illiyet + kusur (istisnalar hariç).' },
          { baslik: 'Sebepsiz zenginleşme', govde: 'Haklı bir sebep olmadan malvarlığı kayması; iade borcu.' },
        ],
      }
    ),
    S('Sözleşme nasıl kurulur?', [
      'Sözleşme, icap ve kabulün uygunlaşmasıyla kurulur. İcap, yeterince belirli ve bağlanma iradesi taşıyan tekliftir. “Konuşalım” veya şaka, icap değildir. Kabul, icaba uygun irade beyanıdır; esaslı noktada değişiklik karşı icaptır.',
      'Geri alma ve süre klasik tuzaktır. İcap, kural olarak kabul edilinceye kadar geri alınabilir; fakat geri alma, kabulden önce muhataba ulaşmalıdır. Süreli icapta süre dolmadan dönmek kural olarak bağlar. İletişim aracının (yüz yüze, mektup, e-posta) ulaşma anı ayrı yazılır.',
      'Şekil varsa geçerlilik şartı olabilir. Kanuni şekil (taşınmaz satımı resmî senet) ile iradi şekil karışmasın. Şekil eksikliği çoğu halde butlan doğurur; geçersizlik def’i ve re’sen gözetim tartışılır. Genel işlem koşulları (TBK m.20 vd.) ayrıca yazılır: yürürlük, yorum, içerik denetimi üç basamaktır.',
    ], {
      hapBilgi: 'İcap = belirli + bağlanma iradesi. Sessizlik kural olarak kabul değildir.',
      uyari: 'Karşı icabı “kabul” diye yazmak klasik sıfırdır.',
    }),
    S('İrade sakatlıkları ve gabin', [
      'Kurulan sözleşme her zaman ayakta kalmaz. Hata, hile ve korkutma irade sakatlıklarıdır; her birinin unsuru ve süresi ayrıdır. Esaslı hatada yanılan, belirli sürede sözleşmeyi iptal edebilir. Hilede aldatma + illiyet; korkutmada ciddi ve hukuka aykırı tehdit aranır.',
      'Gabin (aşırı yararlanma, TBK m.28) ayrı kutudur: subjektif unsur (zaruret, tecrübesizlik, düşüncesizlik) ile objektif bariz oransızlık birlikte aranır. “Ucuz sattım” gabin değildir. Süre ve seçimlik hak (iptal / uyarlama) kapatılmadan sonuç yazılmaz.',
      'Sınav cümlesi şöyle kurulur: “X sözleşmesi kurulmuştur; ancak … sebebiyle iptal edilebilir / ayakta kalır, çünkü …” İptal hakkı kullanılmazsa sözleşme bağlar. Kullanılırsa geçmişe etkili çöker; ifa edilmişse sebepsiz zenginleşme devreye girer.',
    ], {
      hapBilgi: 'Sakatlık ≠ yokluk. Sözleşme vardır; iptal edilirse yıkılır.',
      uyari: 'Hata, hile, korkutma ve gabini tek torbaya koymayın. Süreleri karıştırmayın.',
    }),
    S('Temsil', [
      'Temsil, birinin başkası adına ve hesabına irade açıklamasıdır. Yetki varsa hukuki sonuç doğrudan temsil olunana aittir. Yetkisiz temsilde (falsus procurator) kural: işlem temsil olunanı bağlamaz; onaylarsa bağlar. Üçüncü kişinin iyiniyeti, özellikle yetki belgesi ve görünüşte yetki hallerinde ayrı tartılır.',
      'Yetki aşımı ile yetkisizlik karışmasın. Aşımda yetkinin sınırı aşılmıştır; tamamen yetkisizlikte baştan yetki yoktur. Her iki halde de onay, reddetme ve tazminat sonuçları yazılır. Temsilcinin kendi menfaati ile çatışması (kendisiyle işlem) özel bir yasaktır.',
    ], {
      hapBilgi: 'Yetki var mı? Aşım var mı? Onaylandı mı? Üç soru, üç cümle.',
    }),
    S('İfa, temerrüt, ayıp — rejimi seçin', [
      'İfa, borcun doğru zamanda, doğru yerde, doğru edimle yerine getirilmesidir. İfa ile borç sona erer. İfa yerine edim, ifa uğruna edim ve takas ayrı kurumladır; isimlerini karıştırmayın.',
      'Temerrüt, muaccel borcun borçluya yüklenebilir sebeple zamanında ifa edilmemesidir. Kural ihtardır; ihtarın gerekmediği haller (vade, süre, ihtarın yararsızlığı) tek tek yazılır. Temerrütte seçimlik haklar: aynen ifa + gecikme tazminatı, ifadan dönme, olumlu/olumsuz zarar.',
      'Ayıp ayrı rejimdir. Satımda ayıplı ifa, temerrüt değildir. Ayıpta bildirim, zamanaşımı ve seçimlik haklar (dönme, indirim, onarım, değişim) özel hükümlere bağlıdır. Sınavda önce “bu ayıp mı temerrüt mü?” diye sorun; sonra ilgili maddeye gidin.',
    ], {
      uyari: 'Ayıp ile temerrüdü aynı paragrafta eritmek, hocanın kırmızı kalemini çeker.',
    }),
    S('Sona erme ve zamanaşımı', [
      'Borç ifa, ibra, takas, birleşme, imkânsızlık ve yenileme ile sona erebilir. Her birinin şartı ayrıdır. İbra bir sözleşmedir; tek taraflı “vazgeçtim” yetmez. Takasta karşılıklı, muaccel ve aynı cinsten alacaklar gerekir.',
      'Zamanaşımı hakkı yok etmez, dava edilebilirliği keser. Süre alacağın türüne göre değişir (TBK m.146 vd.). Başlangıç, kesilme ve durma ayrı kutulardır. Hak düşürücü süre ise hakkın kendisini bitirir ve çoğu halde re’sen gözetilir. Bu ayrımı yazmadan “süre doldu” demeyin.',
    ], {
      hapBilgi: 'Zamanaşımı def’idir; mahkeme kendiliğinden bakmaz. Hak düşürücü süre başkadır.',
    }),
  ],
  examples: [
    {
      title: 'İcap geri alındı mı?',
      facts: 'A, B’ye belirli fiyattan satım teklifi e-postasını Pazartesi gönderir. Salı günü “vazgeçtim” yazar. B’nin “kabul”ü Çarşamba A’ya ulaşır.',
      analysis: 'Önce teklifin icap olup olmadığı (belirlilik + bağlanma). Sonra geri almanın kabule ulaşmasından önce B’ye ulaşıp ulaşmadığı. Ulaştıysa sözleşme kurulmaz; ulaşmadıysa kabulle kurulur.',
      takeaway: 'Sıra: icap mı → geri alma ulaştı mı → kabul zamanı.',
    },
    {
      title: 'Gabin iddiası',
      facts: 'Acil nakit ihtiyacı olan satıcı, rayicin üçte birine taşınır satar; bir ay sonra butlan ister.',
      analysis: 'TBK m.28: subjektif (zaruret) + objektif oransızlık. Süre ve seçimlik hak. Tek başına ucuzluk yetmez. “Butlan” ile “iptal” karışmasın.',
      takeaway: 'İki unsur + doğru talep.',
    },
    {
      title: 'Ayıp mı temerrüt mü?',
      facts: 'Satıcı malı teslim eder; mal çalışmaz. Alıcı “süre verip dönmek” ister.',
      analysis: 'Teslim edilmiş ayıplı mal, kural olarak ayıp rejimidir. Temerrüt seçimlik hakları doğrudan uygulanmaz. Bildirim ve satıma özgü haklar yazılır.',
      takeaway: 'Önce rejim seç, sonra hak yaz.',
    },
  ],
  examWrite:
    '1) İstenen sonuç. 2) Kaynak (sözleşme/haksız fiil/…). 3) Tanım + madde. 4) Unsurlar numaralı. 5) Olay cümlelerini unsura bağla. 6) İstisna/süre. 7) Net hüküm.',
};

const HUKUKA_GIRIS = {
  teach: [
    S('Hukuk kuralı başka kurallardan nasıl ayrılır?', [
      'Hukuk, toplumsal düzeni sağlamak için konulan, genel-soyut ve yaptırımlı kurallar bütünüdür. Ahlak “iyi insan ol” der, din “inancına uy” der, görgü “selam ver” der. Hukuk ise ihlalde devletin zorlama aygıtını devreye sokar: ceza, tazminat, butlan, iptal, icra.',
      'Yaptırım testi sınavın kapısıdır. Yaptırım yoksa kural hukuk kuralı olmayabilir. Ama her yaptırım ceza değildir. Özel hukuktaki butlan da yaptırımdır. Türü, kuralın niteliğine göre değişir.',
      'Kaynak meselesi ikinci kapıdır. Yazılı kaynak (Anayasa, kanun, CK, yönetmelik) ile yazısız kaynak (örf, teamül) ve yardımcı kaynak (öğreti, içtihat) ayrılır. Hiyerarşi bozulursa “yönetmelik kanunu ezer” gibi hatalar çıkar.',
    ], {
      hapBilgi: 'Hukuk kuralı = genellik + soyutluk + yaptırım + devlet gücü.',
      kartlar: [
        { baslik: 'Ahlak', govde: 'İç yaptırım (vicdan); devlet zorlamaz.' },
        { baslik: 'Din', govde: 'İnanç topluluğuna özgüdür; laik düzende devlet dini kural uygulamaz.' },
        { baslik: 'Hukuk', govde: 'Dış yaptırım; mahkeme ve icra.' },
      ],
    }),
    S('Kamu hukuku – özel hukuk', [
      'Ayrım “devlet taraf mı?” diye basitlemez. Kamu hukukunda üstünlük ve kamu yararı; özel hukukta eşitlik ve irade özerkliği ağır basar. Belediyenin ruhsat iptali idare hukukudur; iki komşunun gürültü davası özel hukuktur.',
      'Usul ve merci bu ayrımdan çıkar. İdari işlem idare mahkemesine, özel hukuk uyuşmazlığı hukuk mahkemesine gider. Yanlış merci, süreyi yakar. Sınavda önce ilişkiyi nitelendirin, sonra mahkemeyi yazın.',
    ]),
    S('Hak, hukuki işlem, ehliyet', [
      'Sübjektif hak, hukuk düzeninin kişiye tanıdığı yetkidir. Mutlak hak herkese karşı (mülkiyet), nisbi hak belirli kişiye karşı (alacak) ileri sürülür. Ayni–şahsi ayrımı eşya ve borçlar sınavının ortak anahtarıdır.',
      'Hukuki işlem, hukuki sonuç doğurmaya yönelik irade beyanıdır. Tek taraflı (vasiyet, fesih) veya çok taraflı (sözleşme) olur. Borçlandırıcı işlem borç doğurur, tasarrufi işlem mevcut hakkı doğrudan etkiler. Bu ayrım “satış vaadi / tapuda satış” sorusunda puan getirir.',
      'Hak ehliyeti herkese aittir (TMK m.8). Fiil ehliyeti yaş, ayırtım gücü ve kısıtlılığa bağlıdır. Tam ehliyetli, sınırlı ehliyetli, sınırlı ehliyetsiz, tam ehliyetsiz dörtlüsü ezber değil, işlem geçerliliği anahtarıdır.',
    ], {
      uyari: 'Hak ehliyeti ile fiil ehliyetini karıştırmak birinci sınıf klasiğidir.',
    }),
    S('Yorum ve uygulama (giriş)', [
      'Kanun boşluğu ile kanunun susması aynı şey değildir. TMK m.1: önce kanun, yoksa örf, o da yoksa hâkim hukuk yaratır. Yorum yöntemleri (lafzî, tarihî, sistematik, gaye) araçtır; sonucu tek başına taşımaz.',
      'Dürüstlük kuralı (m.2) ve iyiniyet (m.3) her derse sızar. Hakkın açık kötüye kullanımı korunmaz. İyiniyet, kural olarak asıldır; ağır ihmal iyiniyeti düşürür. İspat yükü (m.6) iddia edendedir.',
    ]),
  ],
  examples: [
    {
      title: 'Selam ve borç',
      facts: 'Mahallede selam vermemek ayıplanır; borç ödememek icraya konu olur.',
      analysis: 'Yaptırım ve kaynak testi. İlki sosyal kural, ikincisi hukuk kuralı.',
      takeaway: 'Yaptırım kimden geliyor?',
    },
    {
      title: 'Ruhsat ve gürültü',
      facts: 'Belediye ruhsatı iptal eder; komşu ayrıca gürültüden tazminat ister.',
      analysis: 'İdari işlem / özel hukuk. İki merci, iki rejim.',
      takeaway: 'Nitelendirme mercı belirler.',
    },
  ],
  examWrite: 'Tanım (yaptırım testi) → nitelendirme (kamu/özel veya hak türü) → merci/sonuç.',
};

const AILE = {
  teach: [
    S('Nişan, evlenme, evliliğin hükmü', [
      'Nişan, evlenme vaadidir; evlendirmez. Bozulursa hediye iadesi ve belirli şartlarda tazminat gündeme gelir. Evlenme, kanuni şekle bağlı bir aile hukuku sözleşmesidir: yetkili memur + iki tanık.',
      'Evliliğin kişisel sonuçları (sadakat, yardım, birlikte yaşam) ile mali sonuçları (yasal mal rejimi) ayrı yazılır. Aile konutu, rızasız tasarrufu sınırlar. Bu kutu boşanma sorusunda da açılır.',
    ]),
    S('Boşanma: genel ve özel sebepler', [
      'TMK m.166 genel boşanma sebebidir: evlilik birliğinin temelinden sarsılması. Anlaşmalı boşanma (en az 1 yıl + protokol + duruşmada irade) ayrı bir yoldur. Özel sebepler (zina, hayata kast, terk, suç ve haysiyetsiz hayat) kendi süre ve ispat rejimleriyle gelir.',
      'Sınavda önce yol seçin: anlaşmalı mı, genel sebep mi, özel sebep mi? Kusur, nafaka ve tazminatı etkiler ama velayette asıl ölçü çocuğun üstün yararıdır. Mal rejimi tasfiyesi çoğu kez ayrı hesaptır; “malları yarıla” diye yazmayın.',
    ], {
      hapBilgi: 'Anlaşmalı: 1 yıl + protokol + duruşmada irade. Eksikse çekişmeliye döner.',
      uyari: 'Velayet “annede kalır” kalıbı değildir. Üstün yarar yazılmazsa puan kırılır.',
    }),
    S('Mal rejimi, velayet, nafaka', [
      'Yasal rejim edinilmiş mallara katılmadır. Evlilik sözleşmesi yoksa bu rejim uygulanır. Tasfiye, tapuyu yarılamak değil; artık değere katılma alacağıdır. Kişisel mallar (miras, bağış, evlilik öncesi) ayrı tutulur.',
      'Velayet, çocuğun bakım ve temsilidir. Kişisel ilişki velayetten bağımsızdır. Nafaka üçlüdür: tedbir (yargılama sürerken), yoksulluk (eş), iştirak (çocuk). Türü yanlış yazmak sonucu yanlış yazdırır.',
    ]),
  ],
  examples: [
    {
      title: 'Anlaşmalı protokol eksik',
      facts: 'Eşler 8 aydır evlidir; “anlaşmalı boşanalım, malı sonra konuşuruz” der.',
      analysis: '1 yıl şartı yok. Protokol belirsiz. Anlaşmalı yol kapanır.',
      takeaway: 'Şart + içerik + irade.',
    },
    {
      title: 'Katılma alacağı',
      facts: 'Evlilikte alınan daire koca adına. Karı yarım hisse tescil ister.',
      analysis: 'Yasal rejimde tapu kendiliğinden yarılanmaz; katılma alacağı doğar. Değerleme ve kişisel mal iddiası yazılır.',
      takeaway: 'Alacak ≠ kendiliğinden paylı tapu.',
    },
  ],
  examWrite: 'Yol (anlaşmalı/genel/özel) → unsur → kusur/yarar → nafaka türü → mal rejimi ayrı kutu.',
};

const CEZA_GENEL = {
  teach: [
    S('Suç teorisinin iskeleti', [
      'Modern suç teorisi üç katmandır: tipiklik, hukuka aykırılık, kusur. Önce kanuni tipe uygun fiil var mı, sonra hukuka uygunluk nedeni var mı, en sonda fail kusurlu mu? Katman atlamak, “kast vardı o halde suç var” gibi kısa devre üretir.',
      'Tipiklik objektif (fiil, netice, nedensellik, objektif isnadiyet) ve subjektif (kast / taksir) unsurları içerir. Neticesiz suçlarda netice aranmaz. İhmali suçlarda yükümlülük ve kaçınma yazılır.',
    ], {
      hapBilgi: 'Sıra: tipiklik → hukuka aykırılık → kusur. Tersine yazmayın.',
    }),
    S('Kast, taksir, hukuka uygunluk', [
      'Kast, kanuni unsurları bilerek ve isteyerek gerçekleştirmektir. Olası kast, neticeyi göze almaktır. Taksir, dikkat yükümlülüğünün ihlaliyle neticenin öngörülmemesi (bilinçli taksirde öngörülüp istenmemesi)dir. Bu dörtlü ayrım olay sorusunun kalbidir.',
      'Hukuka uygunluk nedenleri (meşru savunma, zorunluluk, hakkın kullanılması, ilgilinin rızası) tipi silmez, hukuka aykırılığı kaldırır. Meşru savunmada saldırı, savunma, orantı yazılır. Zorunlulukta korunacak menfaat ve başka çare yokluğu aranır. Kusurluluğu kaldıran haller (yaş, akıl hastalığı, zorunluluk-kaçınılmazlık) ayrı kattadır.',
    ], {
      uyari: 'Meşru savunmayı zorunlulukla, olası kastı bilinçli taksirle karıştırmayın.',
    }),
    S('Teşebbüs, iştirak, içtima', [
      'Teşebbüs, icraya elverişli hareketle başlayıp elinde olmayan sebeple tamamlanamamaktır. Hazırlık hareketi cezalandırılmaz. Gönüllü vazgeçme ve etkin pişmanlık ayrı kapılardır.',
      'İştirak: azmettirme, yardım etme, müşterek fail. Bağlılık kuralı ve özel kişisel nedenler yazılır. İçtima: bileşik suç, zincirleme suç, fikri içtima. “İki madde yazdım, iki kez ceza” çoğu kez yanlıştır.',
    ]),
  ],
  examples: [
    {
      title: 'Olası kast mı bilinçli taksir mi?',
      facts: 'Sürücü kırmızı ışıkta geçer; yayayı görür, yavaşlamaz, çarpar.',
      analysis: 'Netice öngörüldü mü, göze alındı mı, istenmediği halde yükümlülük mü ihlal edildi? Olay cümlelerini bu sorulara bağlayın.',
      takeaway: 'Öngörme + göze alma = olası kast istikameti.',
    },
  ],
  examWrite: 'Tipiklik (obj+subj) → uygunluk nedeni? → kusur → teşebbüs/iştirak/içtima → ceza.',
};

const IS_HUKUKU = {
  teach: [
    S('İş sözleşmesi ve kapsam', [
      'İş sözleşmesi, bir tarafın bağımlı olarak iş görmeyi, diğerinin ücret ödemeyi üstlendiği sözleşmedir. Üç unsur: iş, ücret, bağımlılık. Bağımlılık ekonomik ve hukuki talimattır. Vekâlet ve eser ile karışır; sınav buradan gelir.',
      'İş Kanunu kapsamı (m.4 istisnaları) önce bakılır. Belirli / belirsiz süreli ayrımı objektif nedene bağlıdır. Zincirleme belirli süre belirsize döner. Kısmi süre ve çağrı üzerine çalışma orantılı haklar doğurur.',
    ]),
    S('Fesih haritası', [
      'Bildirimli fesih ihbar süresine bağlıdır (m.17). Haklı fesih derhal olur (işçi m.24, işveren m.25). Geçerli fesih iş güvencesinde (30 işçi + 6 ay) işe iadeyi ilgilendirir. Üçü aynı şey değildir.',
      'İşe iadede süreler kısadır: tebliğden 1 ay arabuluculuk, tutanak sonrası 2 hafta dava. Kıdem, haklı/geçerli/istifa ayrımına göre doğar veya doğmaz. İbraname şekle bağlıdır; peşin feragat çoğu kez düşer.',
    ], {
      hapBilgi: 'Haklı ≠ geçerli ≠ bildirimli. Önce türü yazın.',
      uyari: 'İşe iade sürelerini kıdem zamanaşımıyla karıştırmayın.',
    }),
    S('Kıdem, ihbar, işçilik alacakları', [
      'Kıdem: en az 1 yıl + kanunda sayılan ayrılış. Giydirilmiş brüt × yıl, tavan keser. İstifa kural olarak vermez; emeklilik, askerlik, evlilik (kadın, 1 yıl) istisnadır.',
      'İhbar, süreyi kullandırmayan tarafın borcudur. Fazla mesai, UBGT, izin ücreti ayrı kalemlerdir; ispat ve zamanaşımı (çoğu 5 yıl) yazılır. Arabuluculuk dava şartıdır.',
    ]),
  ],
  examples: [
    {
      title: 'İstifa ve kıdem',
      facts: 'İşçi “bıktım” diye WhatsApp’tan ayrılır; 4 yıl çalışmıştır.',
      analysis: 'Yazılı/irade, haklı neden var mı, kıdem istisnası var mı. Düz istifa kıdem vermez.',
      takeaway: 'İstifa sebebini nitelendir.',
    },
  ],
  examWrite: 'Kapsam → sözleşme türü → fesih türü → hangi kalem doğar → süre/arabuluculuk.',
};

const ESYA = {
  teach: [
    S('Zilyetlik ve mülkiyet', [
      'Zilyetlik, eşya üzerinde fiilî hâkimiyettir. Mülkiyet değildir. İspat ve koruma işlevi vardır. Zilyetlik davaları kısa süreli ve elverişlidir; istihkak mülkiyete dayanır. Sınavda “hangi dava?” diye sorun.',
      'Mülkiyet, eşya üzerinde en geniş ayni haktır. Paylı mülkiyette paylar bellidir; herkes payını satabilir (önalım hariç). El birliğinde pay ayrılmamıştır; kural birlikte tasarruf. Miras ortaklığı klasik el birliği örneğidir.',
    ], {
      hapBilgi: 'Zilyetlik ≠ mülkiyet. Dava türü buradan seçilir.',
    }),
    S('Tapu sicili ve sınırlı ayni haklar', [
      'Taşınmazda kural tescildir. Sicile güven, iyiniyetli üçüncü kişiyi korur; istisnalar (tahsis, ağır ihmal, yolsuz tescilin bilinmesi) yazılmadan sonuç çıkmaz. Şerh ve beyan ayrımı unutulmamalıdır.',
      'Sınırlı ayni haklar: irtifak, rehin (ipotek/taşınır rehni), taşınmaz yükü. İpotek fekki tescile bağlıdır; borç bitince kendiliğinden silinmez. Önalım (şufa) süresi kısadır.',
    ]),
  ],
  examples: [
    {
      title: 'Sicile güven',
      facts: 'Alıcı tapuya bakıp alır; asıl malik kaydın yolsuz olduğunu söyler.',
      analysis: 'İyiniyet + sicile güven + istisna. Ağır ihmal tartışılır.',
      takeaway: 'Sicil fotoğrafı yetmez, iyiniyet de yazılır.',
    },
  ],
  examWrite: 'Ayni hak türü → kazanma yolu (tescil/zilyetlik) → koruma davası → istisna.',
};

const MEDENI_USUL = {
  teach: [
    S('Görev, yetki, dava şartı', [
      'Görev, mahkemenin konu bakımından bakıp bakamayacağıdır; kamu düzenindendir, re’sen bakılır. Yetki yer bakımından bakmaktır; kural olarak ilk itirazdır (kesin yetki istisnaları hariç). Karıştırmak usul sınavının bir numaralı tuzağıdır.',
      'Dava şartları (HMK m.114) eksikse mahkeme esasa giremez. Taraf ehliyeti, dava ehliyeti, hukuki yarar, kesin hüküm, derdestlik… Eksiklik giderilebilirse süre verilir. İlk itirazlar (yetki, tahkim) sürelidir.',
    ], {
      hapBilgi: 'Görev = neye bakar. Yetki = nerede bakar. Dava şartı = esasa girilir mi?',
    }),
    S('İspat, hüküm, kanun yolu', [
      'İspat yükü iddia edendedir. Senetle ispat zorunluluğu ve istisnaları (senede karşı senet, hukuki işlem eşiği) yazılır. Islah, feragat, kabul davayı şeklen bitirir; sonuçları ayrıdır.',
      'Hüküm kesinleşince kesin hüküm doğar. İstinaf olayı yeniden inceler, temyiz hukuk denetimi yapar. Süreler tebliğle başlar. İhtiyati tedbir geçicidir; esasın yerini tutmaz.',
    ]),
  ],
  examples: [
    {
      title: 'Yanlış mahkeme',
      facts: 'Davacı yetkisiz yerde açar; davalı ikinci hafta yetki itirazı yapar.',
      analysis: 'Yetki kural olarak ilk itiraz ve süreye bağlıdır. Görev olsaydı re’sen bakılırdı.',
      takeaway: 'Görev ≠ yetki.',
    },
  ],
  examWrite: 'Görev/yetki/dava şartı → delil yolu → hüküm → kanun yolu süresi.',
};

const ICRA = {
  teach: [
    S('Takip yolu seçimi', [
      'İlamlı takip mahkeme kararına dayanır; borçlu ilamsızdaki gibi borca itirazla işi durduramaz. İlamsız takip senet veya faturaya dayanır; ödeme emri ve 7 günlük itiraz merkezidir. Kambiyo senetlerine özgü takip daha serttir; itiraz takibi kendiliğinden durdurmaz.',
      'Yanlış yol seçmek dosyayı yakar. Elinizde ilam varken ilamsız açmak, senet yokken kambiyo yolu denemek klasik hatadır. Sınavın ilk cümlesi: “Hangi takip?”',
    ], {
      hapBilgi: 'İlamlı / ilamsız / kambiyo. Üç kapı, üç süre.',
    }),
    S('Ödeme emri, haciz, satış', [
      'Ödeme emri tebliğden itibaren kural 7 gündür. İtiraz ilamsız takibi durdurur. İtirazın iptali genel mahkemede (1 yıl), kaldırılması icra mahkemesinde (daha dar, belgesel) görülür.',
      'Haciz, malları takibe bağlar. Maaş ve bazı eşyada yasal sınır vardır. Satış ve sıra cetveli kimlerin önce alacağını keser. İstihkak, üçüncü kişinin “mal benim” iddiasıdır; süre kaçınca mal satılır.',
    ], {
      uyari: '7 günü 10 gün yazmak, kâğıdı bitirir.',
    }),
  ],
  examples: [
    {
      title: 'Ödeme emrine sessiz kalmak',
      facts: 'Borçlu 7 gün geçer; sonra “borçlu değilim” der.',
      analysis: 'Süre kaçınca itiraz kapanır. Menfi tespit / istirdat ayrı ve daha zor yollardır.',
      takeaway: 'İlamsızda takvim her şeydir.',
    },
  ],
  examWrite: 'Yol seç → tebliğ tarihi → süre → itirazın etkisi → haciz/satış/istihkak.',
};

const MIRAS = {
  teach: [
    S('Yasal mirasçılık ve eşin payı', [
      'Yasal mirasçılık zümre sistemidir. Birinci zümre altsoy, ikinci ana-baba ve kardeşler, üçüncü büyükbaba-büyükanne ve onların altsoyudur. Önceki zümre sonrakini düşürür.',
      'Sağ kalan eş, zümreye göre pay alır: çocuklarla birlikte kural 1/4. Mal rejimi tasfiyesi mirastan önce gelir. Bu sırayı yazmazsanız pay hesabı yanlış çıkar.',
    ]),
    S('Saklı pay, vasiyet, ret', [
      'Saklı paylılar: altsoy, ana-baba, eş. Kardeşlerin saklı payı yoktur. Muris malının tamamını dilediğine bırakamaz; aşan kısım tenkis edilir.',
      'Vasiyet şekle bağlıdır: el yazılı (tamamı el yazısı + tarih + imza), resmi (noter + tanık). Bilgisayarla yazılıp imzalanan metin el yazılı vasiyet değildir. Mirasın reddi 3 aylık hak düşürücü süreye bağlıdır; terekeye karışmak zımnî kabul sayılabilir.',
    ], {
      hapBilgi: 'Saklı pay tenkis edilir, tüm tasarruf yok sayılmaz.',
    }),
  ],
  examples: [
    {
      title: 'Eş ve iki çocuk',
      facts: 'Muris ölür; eş ve iki çocuk kalır. Vasiyet yoktur.',
      analysis: 'Eş 1/4, kalan 3/4 çocuklara eşit. Mal rejimi ayrıca tasfiye edilir.',
      takeaway: 'Önce tasfiye, sonra zümre, sonra eş.',
    },
  ],
  examWrite: 'Zümre → eş payı → saklı pay/tenkis → vasiyet şekli → ret süresi.',
};

const ANAYASA = {
  teach: [
    S('Anayasa, hukuk devleti, temel haklar', [
      'Anayasa, devletin kuruluşu ve temel hakların güvencesidir. Normlar hiyerarşisinin tepesindedir. Kanun anayasaya aykırı olamaz; yönetmelik kanuna aykırı olamaz. Bu merdiven idare ve vergi sorularına da taşınır.',
      'Hukuk devleti (AY m.2): idarenin kanuniliği, yargı denetimi, temel hakların korunması. Temel haklar sınırlanırken ölçülülük, özüne dokunmama ve kanunilik aranır. Sınavda “sınırlama var” deyip geçmeyin; üçlü testi yazın.',
    ]),
    S('Organlar ve Anayasa Mahkemesi', [
      'Yasama, yürütme, yargı ayrılığı 1982 Anayasası’nın omurgasıdır. Görev gaspı ve yetki tecavüzü idare hukukuna da sızar. AYM soyut/somut norm denetimi ve bireysel başvuruyu yürütür. Bireysel başvuruda hak ihlali + olağan yolların tüketilmesi yazılır.',
    ]),
  ],
  examples: [
    {
      title: 'Sınırlama testi',
      facts: 'Kanun, toplantı hakkını belirsiz “kamu düzeni” gerekçesiyle genişçe yasaklar.',
      analysis: 'Kanunilik, meşru amaç, ölçülülük, öz güvencesi. Belirsiz sınırlama ölçülülüğü düşürür.',
      takeaway: 'Üçlü + öz.',
    },
  ],
  examWrite: 'Normlar hiyerarşisi → hak/sınırlama testi → yetkili organ → AYM yolu.',
};

const IDARE = {
  teach: [
    S('İdari işlem', [
      'İdari işlem, idarenin kamu gücü kullanarak yaptığı, tek yanlı ve icrai işlemdir. Unsurları: yetki, şekil, sebep, konu, amaç. Yetki unsuru sakatlığı çoğu halde yokluk veya iptal doğurur. Sebep ve amaç sapması “sapma” (détournement) tartışmasıdır.',
      'Birel işlem ile düzenleyici işlem ayrılır. Düzenleyici işlem kural koyar; birel işlem kişiyi etkiler. İptal davasında süre tebliğ/öğrenmeden işler (İYUK). Yürütmenin durdurulması ayrı şartlara bağlıdır.',
    ], {
      hapBilgi: 'Beş unsur: yetki, şekil, sebep, konu, amaç. Eksik unsur = iptal riski.',
    }),
    S('İdari yargı yolları', [
      'İptal, işlemin hukuka aykırılığını; tam yargı zararın giderilmesini ister. İkisi birlikte de açılabilir. Görevli mahkeme idare veya vergi mahkemesidir. Üst başvuru bazı hallerde dava şartıdır.',
    ]),
  ],
  examples: [
    {
      title: 'Yetkisiz imza',
      facts: 'Memur, yetki devri olmadan ruhsat iptal eder.',
      analysis: 'Yetki unsuru. Yokluk/iptal. Süre ve YD.',
      takeaway: 'Önce yetki.',
    },
  ],
  examWrite: 'İşlem nitelik → 5 unsur → iptal/tam yargı → süre/YD.',
};

const BORCLAR_OZEL = {
  teach: [
    S('Özel borç ilişkisi nasıl okunur?', [
      'Özel hükümler, genel hükümlerin üzerine biner. Önce sözleşmenin türünü seçin (satım, kira, eser, vekâlet, kefalet…). Tür yanlışsa bütün madde yanlış olur. Sonra o türe özgü ayıp, temerrüt ve sona erme rejimini yazın; genel hükümlere ancak boşlukta dönün.',
      'Satımda zapt ve ayıp; kirada kullanım ve depozito; eserde sonuç yükümlülüğü; vekâlette özen; kefalette şekil. Her birinin “bu türün damgası” cümlesi kâğıtta görünmelidir.',
    ], { hapBilgi: 'Önce tür, sonra özel rejim, en sonda TBK genel.' }),
    S('Satım, kira, eser', [
      'Satımda satıcı mülkiyeti ve zilyetliği geçirir, alıcı bedeli öder. Ayıplı ifada bildirim + seçimlik haklar. Kirada kullanımın teslimi ve korunması esastır; konutta şekil ve artış tavanı ayrıca bakılır. Eserde yüklenici sonucu borçlanır; ayıp ve gecikme ayrıdır.',
      'Sınavda “bu kira mı eser mi?” diye durun. Bir evin boyanması eser, evin kiralanması kiradır. Karışırsa ayıp rejimini yanlış yazarsınız.',
    ]),
    S('Vekâlet, kefalet, bağış', [
      'Vekâlet menfaatine iş görmedir; özen borcu ağırdır, ücret kural değil istisnadır (aksi kararlaştırılmazsa). Kefalet gerçek kişide yazılı şekil + azami tutar + el yazısı ister; müteselsil kefalet alacaklıyı doğrudan size götürür. Bağış şekle bağlı olabilir; geri alma sebepleri dardır.',
    ], { uyari: 'Kefaleti “imza attım olur” diye geçmeyin. Şekil katıdır.' }),
  ],
  examples: [
    {
      title: 'Kira mı eser mi?',
      facts: 'A, B’den daireyi 1 yıllığına alır; ayrıca C’ye mutfağı yeniletmek ister.',
      analysis: 'Daire ilişkisi kira; mutfak yenileme eser. İki sözleşme, iki ayıp rejimi.',
      takeaway: 'Türü ayır, maddeyi sonra yaz.',
    },
  ],
  examWrite: 'Tür → özel hüküm → ayıp/temerrüt → genel hükme dönüş.',
};

const CEZA_OZEL = {
  teach: [
    S('Özel hüküm nasıl okunur?', [
      'Özel hükümler, genel teorinin üzerine suç tipini oturtur. Her suçta önce kanuni tanım, sonra objektif unsurlar, sonra subjektif unsur, en sonda hukuka uygunluk ve içtima. “Hırsızlık var çünkü aldı” cümlesi unsur yazmadan puan getirmez.',
      'Kasten yaralama, hakaret, hırsızlık, dolandırıcılık, mala zarar, tehdit ve trafik güvenliğini tehlikeye sokma klasik tiplerdir. Nitelikli haller (silah, konut, zincirleme) cezayı artırır; bunları unutmak eksik yazımdır.',
    ]),
    S('Hayata, vücut ve malvarlığı', [
      'Kasten öldürme ile kasten yaralamanın netice ve kast yönü ayrılır. Olası kast tartışması burada sık gelir. Hırsızlıkta zilyetliğin rızasız alınması + yararlanma kastı; yağmada şiddet/tehdit eklenir. Dolandırıcılıkta hile + hataya düşürme + zarar vardır; hırsızlıkla karışır.',
    ], { hapBilgi: 'Hırsızlık = zilyetlik. Dolandırıcılık = hile ile irade. Yağma = zor + alma.' }),
  ],
  examples: [
    {
      title: 'Hile mi hırsızlık mı?',
      facts: 'Fail, sahte kimlikle telefonu “deneyeceğim” deyip kaçar.',
      analysis: 'Zilyetlik rıza ile mi geçti, rıza hileyle mi alındı? Hile varsa dolandırıcılık istikameti; rıza yoksa hırsızlık.',
      takeaway: 'Rızanın niteliği tipi belirler.',
    },
  ],
  examWrite: 'Tip → unsurlar → nitelikli hâl → içtima → ceza.',
};

const CMK = {
  teach: [
    S('Soruşturma ve kovuşturma', [
      'Ceza muhakemesi iki evredir: soruşturma (savcı) ve kovuşturma (mahkeme). Soruşturma gizlidir. Koruma tedbirleri (yakalama, gözaltı, tutuklama, adli kontrol, arama) şartlara ve süreye bağlıdır. Gözaltı kural 24 saat; tutuklama ölçülülük ister.',
      'Müdafi hakkı vazgeçilemez temel güvencedir. İfade özgür iradeyle alınmalıdır. KYOK’a itiraz ayrı sürelidir. Uzlaştırma kapsamındaki suçlarda süreç sapar.',
    ], { hapBilgi: 'Önce evre, sonra tedbir, en sonda haklar.' }),
    S('Delil ve duruşma', [
      'Hukuka aykırı delil yasaktır. Zincirleme aykırılık tartışılır. Duruşmada doğrudanlık, sözlülük ve çelişme ilkeleri yazılır. Mağdur ve şüpheli sıfatları hakları değiştirir.',
    ]),
  ],
  examples: [
    {
      title: 'Gözaltı süresi',
      facts: 'Şüpheli 36 saattir gözaltındadır; müdafi çağrılmamıştır.',
      analysis: 'Süre + müdafi. Aşım hukuka aykırı delil ve tazminat doğurabilir.',
      takeaway: 'Süre ve müdafi birlikte yazılır.',
    },
  ],
  examWrite: 'Evre → tedbir şartı/süre → haklar → delil yasağı.',
};

const SIRKETLER = {
  teach: [
    S('Şirket türü seçimi', [
      'Kollektif ve komandit şahıs; limited ve anonim sermaye şirketidir. Sermaye şirketinde ortak kural olarak şirket borçlarından kişisel sorumlu değildir; istisnalar (karine, organ sıfatı, örtülü mal kaçırma) yazılır.',
      'Kuruluş: ana sözleşme, sermaye, sicil. Tescil kurucudur. Unvan ve işletme adı ayrıdır. Ticari iş karinesi faizi ve ispatı değiştirir.',
    ]),
    S('Organlar ve sorumluluk', [
      'Limitedde müdür, AŞ’de yönetim kurulu ve genel kurul. Görevden doğan sorumluluk ayrı davadır. Pay devri limitedde daha sıkı, AŞ’de serbestiye yakındır. Birleşme, bölünme ve tür değiştirme TTK’nın yapısal işlemleridir.',
    ], { uyari: '“Limited ortak şirket borcundan sorumlu değildir” cümlesini istisnasız yazmayın.' }),
  ],
  examples: [
    {
      title: 'Limited borç',
      facts: 'Alacaklı, limited ortağın evine haciz koymak ister.',
      analysis: 'Kural: şirket tüzel kişiliği. İstisna var mı (müteselsil taahhüt, organ sorumluluğu)?',
      takeaway: 'Önce tüzel kişilik, sonra istisna.',
    },
  ],
  examWrite: 'Tür → organ → işlem → sorumluluk istisnası.',
};

const KIYMETLI = {
  teach: [
    S('Kambiyo senedi nedir?', [
      'Poliçe, bono ve çek kambiyo senetleridir. Şekil katıdır: eksik unsur seneti adi belgeye düşürür. Ciro, aval, ibraz ve zamanaşımı ayrı kutulardır. Kambiyo takibi icrada daha serttir.',
      'Çekte ibraz süresi ve karşılıksızlık hem özel hukuk hem (şartları varsa) ceza doğurur. Bonoda vade ve keşideci imzası merkezidir. “Fotokopiyle kambiyo takibi” olmaz.',
    ], { hapBilgi: 'Şekil eksiği = kambiyo sıfatı düşer.' }),
  ],
  examples: [
    {
      title: 'Eksik bono',
      facts: 'Senette vade yoktur; alacaklı kambiyo takibi açar.',
      analysis: 'Zorunlu unsur. Eksikse adi belge / ilamsız yol.',
      takeaway: 'Önce şekil kontrolü.',
    },
  ],
  examWrite: 'Şekil → tür → ibraz/vade → takip yolu.',
};

const MEDENI_BAS = {
  teach: [
    S('TMK başlangıç hükümleri', [
      'm.1 uygulama, m.2 dürüstlük, m.3 iyiniyet, m.6 ispat. Bu dört madde bütün özel hukukun omurgasıdır. Kanun boşluğunda hâkim hukuk yaratır; kanunun susması her zaman boşluk değildir.',
      'Dürüstlük, hakkın kullanılmasında ölçüdür. Açık kötüye kullanım korunmaz. İyiniyet asıldır; ağır ihmal düşürür. İspat yükü iddia edendedir; karine istisna üretir.',
    ]),
    S('Kişiler hukuku girişi', [
      'Hak ehliyeti herkese aittir. Fiil ehliyeti yaş, ayırtım gücü, kısıtlılık. Yerleşim yeri tebligat ve yetkiyi etkiler. Kişiliğin korunması (m.23–25) maddi-manevi tazminat ve durdurma davası doğurur.',
    ]),
  ],
  examples: [
    {
      title: 'Kötüye kullanma',
      facts: 'Malik, komşuyu sırf incitmek için duvar örer.',
      analysis: 'm.2/2 hakkın kötüye kullanılması. Ayni hak sınırsız değildir.',
      takeaway: 'Yetki var ≠ her kullanım korunur.',
    },
  ],
  examWrite: 'm.1–3–6 kutusu → ehliyet → sonuç.',
};

const ROMA = {
  teach: [
    S('Roma neden okunur?', [
      'Roma hukuku, kıta Avrupası özel hukukunun iskeletidir. Kişi (persona), şey (res), dava (actio) üçlüsü bugünkü hak–eşya–usul ayrımının atasıdır. Ius civile / ius gentium, ius strictum / bona fides ayrımları modern dürüstlük ve iyiniyet tartışmasına bağlanır.',
      'Sınavda Latince ezber değil, kurumu bugüne bağlamak puan getirir. Stipulatio bugünkü şekli sözleşmeye, traditio teslime, usucapio kazandırıcı zamanaşımına komşudur. Bağlantıyı yazın.',
    ]),
    S('Kişi, aile, borç, actio', [
      'Status (özgürlük, yurttaşlık, aile) ehliyeti belirlerdi. Patria potestas ve manus bugünkü velayet/vesayetle karıştırılmamalı; tarihsel kurumdur. Borç (obligatio) contractus ve delictum’dan doğardı. Actio, hakkın dava edilebilir yüzüdür — sübjektif hak düşüncesinin usul kapısı.',
    ]),
  ],
  examples: [
    {
      title: 'Actio ve hak',
      facts: 'Öğrenci “Roma’da hak yok, sadece dava var” der.',
      analysis: 'Klasik dönemde actio merkezidir; bu, hakkın yokluğu değil, hakkın dava ile görünmesidir. Modern sübjektif hak ayrımı sonradır.',
      takeaway: 'Actio = hakkın usul yüzü.',
    },
  ],
  examWrite: 'Roma kurumu → modern karşılık → farkı bir cümle.',
};

const TUKETICI = {
  teach: [
    S('Tüketici kim, satıcı kim?', [
      '6502 sayılı Kanun, ticari/mesleki olmayan amaçla hareket eden kişiyi tüketici sayar. Karşı taraf satıcı veya sağlayıcıdır. Ayıp, haksız şart, mesafeli satış ve cayma bu kanunun omurgasıdır.',
      'Hakem heyeti parasal sınıra kadar bakar; üstünde tüketici mahkemesi. Birçok uyuşmazlıkta arabuluculuk dava şartıdır. Önce satıcıya başvuru ispatı işe yarar.',
    ]),
    S('Ayıp ve cayma', [
      'Ayıplı malda seçimlik haklar tüketicinindir. Satıcı sizi tek yola zorlayamaz. Mesafeli satımda 14 günlük cayma, ayıp olmasa da kullanılır. İstisna listesi yönetmeliktedir.',
    ], { hapBilgi: 'Cayma ≠ ayıp. Cayma sebepsizdir; ayıp kusurlu ifadır.' }),
  ],
  examples: [
    {
      title: '14 gün',
      facts: 'İnternetten ayakkabı alır; 10. gün vazgeçer, ayıp yoktur.',
      analysis: 'Mesafeli satışta cayma. Ayıp aranmaz. İstisna değilse bedel iadesi.',
      takeaway: 'Cayma sebepsizdir.',
    },
  ],
  examWrite: 'Tüketici sıfatı → ayıp/cayma → merci (heyet/mahkeme).',
};

export const DEEP = {
  'borclar-genel': BORCLAR_GENEL,
  'hukuka-giris': HUKUKA_GIRIS,
  'aile-hukuku': AILE,
  'tmk-2-kitap': AILE,
  'ceza-genel': CEZA_GENEL,
  'is-hukuku': IS_HUKUKU,
  'esya-hukuku': ESYA,
  'medeni-usul': MEDENI_USUL,
  hmk: MEDENI_USUL,
  'icra-iflas': ICRA,
  icra: ICRA,
  iflas: ICRA,
  'miras-hukuku': MIRAS,
  anayasa: ANAYASA,
  'anayasa-1': ANAYASA,
  'anayasa-2': ANAYASA,
  'idare-hukuku': IDARE,
  'idari-yargilama': IDARE,
  'borclar-ozel': BORCLAR_OZEL,
  'ceza-ozel': CEZA_OZEL,
  'ceza-muhakemesi': CMK,
  cmk: CMK,
  'ticaret-sirketler': SIRKETLER,
  sirketler: SIRKETLER,
  'kiymetli-evrak': KIYMETLI,
  'medeni-baslangic': MEDENI_BAS,
  'tmk-1-kitap': MEDENI_BAS,
  'roma-hukuku': ROMA,
  'tuketici-hukuku': TUKETICI,
};

const ALIAS = {
  'anayasa-1': 'anayasa',
  'anayasa-2': 'anayasa',
  anayasa: 'anayasa',
  hmk: 'medeni-usul',
  'medeni-usul': 'medeni-usul',
  cmk: 'ceza-muhakemesi',
  sirketler: 'ticaret-sirketler',
  'ticaret-sirketler': 'ticaret-sirketler',
  icra: 'icra-iflas',
  iflas: 'icra-iflas',
  'icra-iflas': 'icra-iflas',
  'tmk-1-kitap': 'medeni-baslangic',
  'tmk-2-kitap': 'aile-hukuku',
};

export function familyOf(courseCode) {
  let c = String(courseCode || '')
    .replace(/-donem-[12]$/, '')
    .replace(/-yillik$/, '');
  return ALIAS[c] || c;
}

export function sliceForVariant(teach, courseCode) {
  if (!teach?.length) return [];
  if (/-donem-1$/.test(courseCode)) return teach.slice(0, Math.ceil(teach.length / 2));
  if (/-donem-2$/.test(courseCode)) return teach.slice(Math.floor(teach.length / 2));
  return teach;
}

/**
 * Bankadaki kuru/staccato paragrafları yoğun birleşik cümlelere çevirir.
 * Meta didaktiği cümle düzeyinde atar; ara-regex ile metni yırtmaz.
 */
function elevateDeep(deep) {
  if (!deep) return null;

  const isMetaSentence = (s) =>
    /Sınavda|Kâğıtta|Sınav cümlesi|diye sorun|diye durun|cevap netleşmeden|puan (getirir|kırılır|kaybettirir)|bütün puan|Bence haklıdır|klasik sıfır|kırmızı kalem|Başlıkları I|yazmayın\.?$/i.test(
      s
    );

  const splitSentences = (text) => {
    let t = String(text || '').replace(/\s+/g, ' ').trim();
    if (!t) return [];
    // m.1 / vd. koruması
    t = t.replace(/\b(m|md|vb|vd)\.\s*/gi, '§$1¤');
    const parts = t.split(/(?<=\S[.!?…])\s+(?=["“«A-ZÇĞİÖŞÜ])/);
    return parts
      .map((x) =>
        x
          .replace(/§(m|md|vb|vd)¤/gi, (_, a) => `${a}. `)
          .replace(/¤/g, '.')
          .trim()
      )
      .filter(Boolean);
  };

  const wc = (s) => s.split(/\s+/).filter(Boolean).length;

  const lowerJoin = (body) => {
    if (/^(TBK|TMK|TCK|TTK|HMK|İİK|CMK|AİHM|AYM|“|")/.test(body)) return body;
    // Tek büyük harfle başlayan Türkçe cümle → küçük
    return body.charAt(0).toLocaleLowerCase('tr-TR') + body.slice(1);
  };

  const fuse = (p) => {
    const parts = splitSentences(p).filter((s) => s && !isMetaSentence(s));
    if (!parts.length) return '';

    const out = [];
    let i = 0;
    let usedOlupInPara = false;

    while (i < parts.length) {
      let cur = parts[i].replace(/[.!?…]+$/, '').trim();
      // En fazla bir kısa komşuyu bağla
      if (i + 1 < parts.length && wc(cur) < 15) {
        const nxt = parts[i + 1].replace(/[.!?…]+$/, '').trim();
        if (!isMetaSentence(nxt) && wc(nxt) <= 22) {
          if (!usedOlupInPara) {
            cur = `${cur} olup ${lowerJoin(nxt)}`;
            usedOlupInPara = true;
          } else {
            cur = `${cur}; zira ${lowerJoin(nxt)}`;
          }
          i += 1;
        }
      }
      if (!/[.!?…]$/.test(cur)) cur += '.';
      out.push(cur.replace(/\s+/g, ' ').trim());
      i += 1;
    }

    return out.join(' ').replace(/\s+([,;:])/g, '$1').trim();
  };

  const cleanShort = (s) => {
    if (!s) return s;
    const parts = splitSentences(s).filter((x) => !isMetaSentence(x));
    return parts.join(' ').trim() || s;
  };

  return {
    ...deep,
    teach: (deep.teach || []).map((sec) => ({
      ...sec,
      paragraphs: (sec.paragraphs || []).map(fuse).filter((p) => p.length > 30),
      hapBilgi: cleanShort(sec.hapBilgi),
      uyari: cleanShort(sec.uyari),
    })),
    examples: (deep.examples || []).map((e) => ({
      ...e,
      analysis: fuse(e.analysis || ''),
      takeaway: cleanShort(e.takeaway) || e.takeaway,
    })),
    examWrite: deep.examWrite,
  };
}

export function getDeep(courseCode) {
  const fam = familyOf(courseCode);
  const raw = DEEP[fam] || DEEP[courseCode] || null;
  return elevateDeep(raw);
}
