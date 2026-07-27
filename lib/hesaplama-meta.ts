/**
 * Hesaplama araçları — SEO meta, rehber metinleri, mevzuat çapraz linkleri.
 * Tek kaynak; hub, slug sayfaları, sitemap ve madde bağlantıları buradan beslenir.
 */

export type HesaplamaAracMeta = {
    id: string;
    icon: string;
    baslik: string;
    tag: string;
    /** Arama / SEO kısa açıklama */
    aciklama: string;
    keywords: string[];
    /** Mini rehber (bilgilendirme; sonuç vaadi yok) */
    rehber: string[];
    /** İlgili mevzuat linkleri */
    mevzuat: { label: string; href: string }[];
    /** Aynı sayfada önerilen diğer araç id'leri */
    ilgili?: string[];
};

export const HESAPLAMA_ARACLAR: HesaplamaAracMeta[] = [
    {
        id: 'miras',
        icon: '🏛️',
        baslik: 'Miras Paylaşımı (Yasal Mirasçılık)',
        tag: 'Miras Hukuku',
        aciklama:
            'TMK zümre sistemine göre yasal mirasçı paylarını hesaplayın. Bilgilendirme amaçlıdır; somut dosyada avukata danışın.',
        keywords: ['miras payı hesaplama', 'yasal mirasçılık', 'TMK miras', 'miras paylaşımı'],
        rehber: [
            'Yasal mirasçılık Türk Medeni Kanunu’nda zümre esasına dayanır; sağ kalan eş ve altsoy/üstsoy payları olayın somut durumuna göre değişir.',
            'Bu araç yalnızca yasal pay oranlarını kabaca gösterir. Vasiyet, miras sözleşmesi, saklı pay ihlali ve tenkis bu hesap dışında kalabilir.',
            'Resmî işlem ve dava için veraset ilamı ve güncel nüfus kayıtları esastır.',
        ],
        mevzuat: [
            { label: 'TMK m.495 vd. (mirasçılık)', href: '/mevzuat/tmk/madde-495' },
            { label: 'Saklı pay aracı', href: '/hesaplama/sakli-pay' },
        ],
        ilgili: ['sakli-pay', 'mal-rejimi'],
    },
    {
        id: 'sakli-pay',
        icon: '🔏',
        baslik: 'Saklı Pay Hesabı (TMK)',
        tag: 'Miras Hukuku',
        aciklama: 'Saklı pay ve tasarruf nisabı hakkında bilgilendirici hesap. Vasiyet planlamasında genel çerçeve sunar.',
        keywords: ['saklı pay hesaplama', 'tasarruf nisabı', 'TMK saklı pay'],
        rehber: [
            'Saklı pay, belirli mirasçıların kanunen korunan asgari payıdır; ihlal hâlinde tenkis gündeme gelebilir.',
            'Hesap, terekenin net değeri ve mirasçı grubuna göre değişir; mahkeme ve bilirkişi süreçleri sonuçta belirleyicidir.',
        ],
        mevzuat: [
            { label: 'TMK saklı pay', href: '/mevzuat/tmk/madde-506' },
            { label: 'Miras paylaşımı', href: '/hesaplama/miras' },
        ],
        ilgili: ['miras'],
    },
    {
        id: 'kidem',
        icon: '💼',
        baslik: 'Kıdem & İhbar Tazminatı',
        tag: 'İş Hukuku',
        aciklama:
            'Giydirilmiş ücret, kıdem tavanı, damga ve gelir vergisi dikkate alınarak kıdem ve ihbar tazminatı tahmini.',
        keywords: ['kıdem tazminatı hesaplama', 'ihbar tazminatı', 'iş hukuku hesaplama 2026'],
        rehber: [
            'Kıdem tazminatı, kanunda sayılan fesih hâllerinde ve şartları oluştuğunda gündeme gelir; her işten ayrılış otomatik hak doğurmaz.',
            'Tavan tutarları dönemsel genelgelerle güncellenir; işlem tarihindeki tavan esas alınmalıdır.',
            'İşe iade ve birleşik işçilik raporu için ilgili diğer araçları da kullanabilirsiniz.',
        ],
        mevzuat: [
            { label: 'İş Kanunu', href: '/mevzuat/is-kanunu/madde-1' },
            { label: 'Kıdem rehberi', href: '/rehber/kidem-tazminati' },
        ],
        ilgili: ['ise-iade', 'kidem-ise-iade', 'fazla-mesai', 'yillik-izin'],
    },
    {
        id: 'ise-iade',
        icon: '🔄',
        baslik: 'İşe İade Tazminatı Tahmini',
        tag: 'İş Hukuku',
        aciklama: 'İşe iade davasında boşta geçen süre ve işe başlatmama tazminatı için kabaca tahmin aracı.',
        keywords: ['işe iade tazminatı', 'işe başlatmama tazminatı hesaplama'],
        rehber: [
            'İşe iade, iş güvencesi kapsamındaki işçiler için öngörülmüş bir yoldur; süre, işyeri ve işçi sayısı şartları aranır.',
            'Mahkeme kararı ve fiilî işe başlatma/başlatmama, nihai tutarı belirler.',
        ],
        mevzuat: [{ label: 'İş Kanunu', href: '/mevzuat/is-kanunu/madde-1' }],
        ilgili: ['kidem', 'kidem-ise-iade'],
    },
    {
        id: 'kidem-ise-iade',
        icon: '📑',
        baslik: 'Kıdem + İhbar + İşe İade (Birleşik Rapor)',
        tag: 'İş Hukuku',
        aciklama: 'Kıdem, ihbar ve işe iade kalemlerini tek sayfada toplayan birleşik tahmin raporu.',
        keywords: ['işçilik alacakları hesaplama', 'kıdem ihbar işe iade'],
        rehber: [
            'Birleşik rapor, kalemleri yan yana görmek içindir; hangi kalemin somut olayda talep edilebilir olduğu ayrı hukuki değerlendirme ister.',
        ],
        mevzuat: [{ label: 'İş Kanunu', href: '/mevzuat/is-kanunu/madde-1' }],
        ilgili: ['kidem', 'ise-iade'],
    },
    {
        id: 'fazla-mesai',
        icon: '⏰',
        baslik: 'Fazla Mesai Ücreti',
        tag: 'İş Hukuku',
        aciklama: 'Fazla çalışma ve fazla sürelerle çalışma ücreti için bilgilendirici hesap.',
        keywords: ['fazla mesai hesaplama', 'fazla çalışma ücreti'],
        rehber: [
            'Fazla mesai ispatı ve haftalık/günlük sınırlar somut bordro ve fiilî çalışma düzenine bağlıdır.',
            'Zam oranları ve denkleştirme uygulamaları olaya göre değişebilir.',
        ],
        mevzuat: [{ label: 'İş Kanunu', href: '/mevzuat/is-kanunu/madde-1' }],
        ilgili: ['kidem', 'yillik-izin', 'net-brut-maas'],
    },
    {
        id: 'yillik-izin',
        icon: '🏖️',
        baslik: 'Yıllık İzin Ücreti',
        tag: 'İş Hukuku',
        aciklama: 'Kullanılmayan yıllık izin ücreti için kabaca hesaplama aracı.',
        keywords: ['yıllık izin ücreti hesaplama', 'kullanılmayan izin'],
        rehber: [
            'Yıllık izin süreleri kıdeme göre artar; ücret hesabında giydirilmiş ücret tartışmaları gündeme gelebilir.',
        ],
        mevzuat: [{ label: 'İş Kanunu', href: '/mevzuat/is-kanunu/madde-1' }],
        ilgili: ['kidem', 'fazla-mesai'],
    },
    {
        id: 'smm',
        icon: '🧾',
        baslik: 'Serbest Meslek Makbuzu (SMM)',
        tag: 'İş Hukuku',
        aciklama: 'SMM stopaj ve KDV ayrıştırması için bilgilendirici araç.',
        keywords: ['SMM hesaplama', 'serbest meslek makbuzu stopaj'],
        rehber: [
            'Stopaj ve KDV oranları dönemsel mevzuata bağlıdır; fatura/makbuz düzenlemeden önce güncel oranları teyit edin.',
        ],
        mevzuat: [{ label: 'GVK', href: '/mevzuat/gvk/madde-1' }],
        ilgili: ['kdv', 'net-brut-maas'],
    },
    {
        id: 'net-brut-maas',
        icon: '💵',
        baslik: 'Net / Brüt Maaş (2026 Bordro)',
        tag: 'İş Hukuku',
        aciklama: '2026 bordro parametreleriyle net-brüt dönüşüm tahmini.',
        keywords: ['net brüt maaş hesaplama 2026', 'bordro hesaplama'],
        rehber: [
            'Bordro parametreleri (asgari ücret, prim matrahı, vergi dilimleri) yıl içinde değişebilir.',
            'Bu araç genel tahmindir; SGK ve muhasebe kaydı yerine geçmez.',
        ],
        mevzuat: [{ label: 'İş Kanunu', href: '/mevzuat/is-kanunu/madde-1' }],
        ilgili: ['issizlik-maasi', 'smm'],
    },
    {
        id: 'issizlik-maasi',
        icon: '🛟',
        baslik: 'İşsizlik Maaşı (Ödeneği) 2026',
        tag: 'İş Hukuku',
        aciklama: 'İşsizlik ödeneği süre ve tutar tahmini — bilgilendirme amaçlı.',
        keywords: ['işsizlik maaşı hesaplama', 'işsizlik ödeneği 2026'],
        rehber: [
            'Hak kazanma; prim günü, işten ayrılış nedeni ve İŞKUR başvurusuna bağlıdır.',
            'Resmî tutar İŞKUR kaydına göre belirlenir.',
        ],
        mevzuat: [{ label: 'SSGSSK', href: '/mevzuat/ssgssk/madde-1' }],
        ilgili: ['kidem', 'net-brut-maas'],
    },
    {
        id: 'nafaka',
        icon: '👨‍👩‍👧',
        baslik: 'Nafaka Artış / Azaltış Hesaplayıcı',
        tag: 'Aile Hukuku',
        aciklama: 'Nafaka artışı için kaba tahmin; hâkim takdirine bağlıdır, garanti değildir.',
        keywords: ['nafaka artışı hesaplama', 'iştirak nafakası'],
        rehber: [
            'Nafaka miktarı tarafların ekonomik-sosyal durumu, çocuğun ihtiyaçları ve hakkaniyete göre hâkim tarafından takdir edilir.',
            'Bu araç yalnızca yüzde senaryosu üretir; kesin sonuç değildir.',
        ],
        mevzuat: [
            { label: 'TMK nafaka', href: '/mevzuat/tmk/madde-330' },
            { label: 'Mal rejimi', href: '/hesaplama/mal-rejimi' },
        ],
        ilgili: ['mal-rejimi', 'iddet'],
    },
    {
        id: 'iddet',
        icon: '📅',
        baslik: 'İddet Müddeti Hesabı',
        tag: 'Aile Hukuku',
        aciklama: 'TMK iddet (bekleme) süresinin bitiş tarihine dair bilgilendirici hesap.',
        keywords: ['iddet müddeti hesaplama', 'bekleme süresi boşanma'],
        rehber: [
            'İddet süresi kanunda düzenlenir; istisnalar ve mahkeme kararı somut durumu değiştirebilir.',
        ],
        mevzuat: [{ label: 'TMK', href: '/mevzuat/tmk/madde-1' }],
        ilgili: ['nafaka', 'mal-rejimi'],
    },
    {
        id: 'mal-rejimi',
        icon: '💍',
        baslik: 'Mal Rejimi — Edinilmiş Mallara Katılma',
        tag: 'Aile Hukuku',
        aciklama: 'Edinilmiş mallara katılma rejimine göre artı değer / katılma alacağı kabaca tahmini.',
        keywords: ['mal rejimi hesaplama', 'edinilmiş mallara katılma', 'katılma alacağı'],
        rehber: [
            'Yasal rejim kural olarak edinilmiş mallara katılmadır; sözleşme ile başka rejim seçilmiş olabilir.',
            'Kişisel mal / edinilmiş mal ayrımı ve ispat yükü somut delillere bağlıdır.',
        ],
        mevzuat: [{ label: 'TMK mal rejimi', href: '/mevzuat/tmk/madde-202' }],
        ilgili: ['nafaka', 'miras'],
    },
    {
        id: 'faiz',
        icon: '📊',
        baslik: 'Faiz Hesaplama (Yasal / Ticari / Avans)',
        tag: 'Alacak',
        aciklama: 'Tek oran veya dönemsel dilimlerle yasal/ticari/avans faiz tahmini.',
        keywords: ['faiz hesaplama', 'yasal faiz', 'ticari faiz hesaplama'],
        rehber: [
            'Uygulanacak faiz türü sözleşmeye, alacağın niteliğine ve yasal düzenlemeye göre değişir.',
            'Değişken oranlı dönemler için dilim dilim giriş yapın; resmi oran değişikliklerini teyit edin.',
        ],
        mevzuat: [
            { label: 'TBK faiz', href: '/mevzuat/tbk/madde-88' },
            { label: 'Gecikme zammı', href: '/hesaplama/gecikme-zammi' },
        ],
        ilgili: ['icra-kapak', 'gecikme-zammi'],
    },
    {
        id: 'icra-kapak',
        icon: '📁',
        baslik: 'İcra Dosyası Kapak Hesabı & Harçlar (2026)',
        tag: 'Alacak',
        aciklama: 'İcra dosyası kapak hesabı ve harç kalemleri için bilgilendirici araç.',
        keywords: ['icra kapak hesabı', 'icra harçları 2026'],
        rehber: [
            'Kapak hesabı dosya kalemlerine, tahsilata ve harç tarifesine bağlıdır; UYAP / icra dairesi kaydı esastır.',
        ],
        mevzuat: [{ label: 'İİK', href: '/mevzuat/iik/madde-1' }],
        ilgili: ['inkar-tazminati', 'faiz'],
    },
    {
        id: 'inkar-tazminati',
        icon: '⚖️',
        baslik: 'İcra İnkâr Tazminatı',
        tag: 'Alacak',
        aciklama: 'İcra inkâr tazminatı oranı üzerinden kabaca tutar tahmini.',
        keywords: ['icra inkâr tazminatı hesaplama'],
        rehber: [
            'İnkâr tazminatı şartları ve oranı yasal düzenleme ile içtihada bağlıdır; her itiraz otomatik tazminat doğurmaz.',
        ],
        mevzuat: [{ label: 'İİK', href: '/mevzuat/iik/madde-1' }],
        ilgili: ['icra-kapak'],
    },
    {
        id: 'kira',
        icon: '🏠',
        baslik: 'Kira Artış Oranı',
        tag: 'Gayrimenkul',
        aciklama: 'Kira artışına ilişkin bilgilendirici oran/tutar hesabı.',
        keywords: ['kira artış oranı hesaplama', 'kira zammı'],
        rehber: [
            'Konut kiralarında yasal tavan ve TÜFE/ÜFE uygulamaları dönemsel kanun ve CB kararı ile değişebilir.',
            'Sözleşme tarihi ve yenileme dönemi somut hesabı etkiler.',
        ],
        mevzuat: [
            { label: 'TBK kira', href: '/mevzuat/tbk/madde-344' },
            { label: 'Kira tespit (ÜFE)', href: '/hesaplama/kira-tespit' },
        ],
        ilgili: ['kira-tespit', 'tapu'],
    },
    {
        id: 'kira-tespit',
        icon: '📈',
        baslik: 'Kira Tespit — ÜFE Senaryosu',
        tag: 'Gayrimenkul',
        aciklama:
            'Beş yılı dolmuş kiralar için ÜFE ortalaması senaryosu ile kaba kira tespit tahmini. Bilgilendirme amaçlıdır.',
        keywords: ['kira tespit davası hesaplama', 'ÜFE kira', 'kira bedeli tespit'],
        rehber: [
            'Kira tespit davalarında emsal, rayiç ve yasal ölçütler birlikte değerlendirilir; tek oran her dosyada geçerli değildir.',
            'Bu araç yalnızca girdiğiniz ÜFE oranıyla senaryo üretir; bilirkişi ve mahkeme sonucu yerine geçmez.',
        ],
        mevzuat: [
            { label: 'TBK kira', href: '/mevzuat/tbk/madde-344' },
            { label: 'Kira artışı', href: '/hesaplama/kira' },
        ],
        ilgili: ['kira'],
    },
    {
        id: 'tapu',
        icon: '📋',
        baslik: 'Tapu Harcı Hesaplama',
        tag: 'Gayrimenkul',
        aciklama: 'Tapu harcı matrahı üzerinden bilgilendirici harç tahmini.',
        keywords: ['tapu harcı hesaplama', 'tapu masrafı'],
        rehber: [
            'Harç oranları ve matrah (beyan / rayiç) işlem türüne göre değişir; tapu müdürlüğü tahakkuku esastır.',
        ],
        mevzuat: [{ label: 'Kat Mülkiyeti', href: '/mevzuat/katmulkiyeti/madde-1' }],
        ilgili: ['kira', 'damga-vergisi'],
    },
    {
        id: 'arac-deger-kaybi',
        icon: '🚗',
        baslik: 'Araç Değer Kaybı Analizi',
        tag: 'Sigorta',
        aciklama: 'Trafik kazası sonrası araç değer kaybı için kaba analiz aracı.',
        keywords: ['araç değer kaybı hesaplama', 'trafik değer kaybı'],
        rehber: [
            'Değer kaybı; hasar, km, piyasa ve ekspertiz raporuna bağlıdır. Sigorta şirketi ve yargı uygulaması farklılık gösterebilir.',
        ],
        mevzuat: [{ label: 'TBK haksız fiil', href: '/mevzuat/tbk/madde-49' }],
        ilgili: ['faiz'],
    },
    {
        id: 'vekalet',
        icon: '⚖️',
        baslik: 'Vekalet Ücreti (Nispi / Maktu — AAÜT)',
        tag: 'Dava Masrafı',
        aciklama: 'AAÜT esaslı nispi/maktu vekalet ücreti tahmini (yıl tarifesine göre).',
        keywords: ['vekalet ücreti hesaplama', 'AAÜT 2026', 'nispi vekalet'],
        rehber: [
            'Mahkemece hükmedilecek vekalet ücreti tarife ve yargılama sonucuna bağlıdır; avukat-müvekkil sözleşmesi ayrıdır.',
            'Tarife her yıl güncellenir; işlem yılını kontrol edin.',
        ],
        mevzuat: [{ label: 'HMK', href: '/mevzuat/hmk/madde-1' }],
        ilgili: ['dava-harci', 'arabuluculuk', 'risk'],
    },
    {
        id: 'dava-harci',
        icon: '🏛️',
        baslik: 'Dava Açma Harcı ve Gider Avansı',
        tag: 'Dava Masrafı',
        aciklama: 'Dava açılış harcı ve gider avansı için bilgilendirici tahmin.',
        keywords: ['dava harcı hesaplama', 'gider avansı'],
        rehber: [
            'Harç ve gider avansı dava türü, değer ve mahkemeye göre değişir; tevzi bürosu tahakkuku bağlayıcıdır.',
        ],
        mevzuat: [{ label: 'HMK', href: '/mevzuat/hmk/madde-1' }],
        ilgili: ['vekalet', 'istinaf-temyiz'],
    },
    {
        id: 'arabuluculuk',
        icon: '🤝',
        baslik: 'Arabuluculuk Asgari Ücret',
        tag: 'Dava Masrafı',
        aciklama: 'Arabuluculuk asgari ücret tarifesine göre kabaca ücret tahmini.',
        keywords: ['arabuluculuk ücreti hesaplama', 'arabuluculuk tarife'],
        rehber: [
            'Bazı uyuşmazlıklarda arabuluculuk dava şartıdır; ücret paylaşımı ve tarife dönemseldir.',
        ],
        mevzuat: [
            { label: 'Arabuluculuk Kanunu', href: '/mevzuat/arabuluculuk/madde-1' },
            { label: 'Arabuluculuk rehberi', href: '/rehber/arabuluculuk' },
        ],
        ilgili: ['vekalet', 'dava-harci'],
    },
    {
        id: 'sure',
        icon: '📆',
        baslik: 'Süre Hesabı (Tebliğden — HMK/İİK)',
        tag: 'Usul',
        aciklama: 'Tebliğden itibaren istinaf, temyiz, itiraz gibi sürelerin son günü tahmini.',
        keywords: ['süre hesabı tebliğ', 'istinaf süresi', 'temyiz süresi hesaplama'],
        rehber: [
            'Süreler tebliğ usulü, tatil günleri ve kanundaki özel hükümlere göre kayabilir; kaçırılan süre hak kaybı doğurabilir.',
            'Kesin işlem öncesi avukatınıza veya dosya kaydına bakın.',
        ],
        mevzuat: [
            { label: 'HMK', href: '/mevzuat/hmk/madde-1' },
            { label: 'İstinaf/temyiz harç', href: '/hesaplama/istinaf-temyiz' },
        ],
        ilgili: ['istinaf-temyiz', 'zamanasimi'],
    },
    {
        id: 'zamanasimi',
        icon: '⏱️',
        baslik: 'Zamanaşımı Kontrol Sihirbazı',
        tag: 'Usul',
        aciklama: 'Alacak türüne göre zamanaşımı süresi için bilgilendirici kontrol aracı.',
        keywords: ['zamanaşımı hesaplama', 'alacak zamanaşımı'],
        rehber: [
            'Zamanaşımı süreleri borcun niteliğine göre değişir; kesilme ve durma sebepleri sonucu etkiler.',
        ],
        mevzuat: [
            { label: 'TBK zamanaşımı', href: '/mevzuat/tbk/madde-146' },
            { label: 'Ceza zamanaşımı', href: '/hesaplama/ceza-zamanasimi' },
        ],
        ilgili: ['ceza-zamanasimi', 'sure'],
    },
    {
        id: 'ceza-zamanasimi',
        icon: '⌛',
        baslik: 'Ceza Zamanaşımı (TCK kabaca)',
        tag: 'Usul',
        aciklama:
            'TCK dava ve ceza zamanaşımı sürelerine dair bilgilendirici üst sınır senaryosu. Somut suç ve kesilme sebepleri sonucu değiştirir.',
        keywords: ['ceza zamanaşımı hesaplama', 'TCK zamanaşımı', 'dava zamanaşımı'],
        rehber: [
            'Dava ve ceza zamanaşımı, suçun kanuni cezasının üst sınırına ve özel hükümlere göre belirlenir.',
            'Kesilme, durma ve özel suç tipleri bu basit aracı aşar; kesin değerlendirme için ceza avukatına danışın.',
        ],
        mevzuat: [
            { label: 'TCK', href: '/mevzuat/tck/madde-1' },
            { label: 'Genel zamanaşımı', href: '/hesaplama/zamanasimi' },
        ],
        ilgili: ['zamanasimi', 'infaz'],
    },
    {
        id: 'istinaf-temyiz',
        icon: '📨',
        baslik: 'İstinaf / Temyiz Harç ve Süre 2026',
        tag: 'Usul',
        aciklama: 'İstinaf ve temyiz harç/süre bilgisi için bilgilendirici araç.',
        keywords: ['istinaf harcı', 'temyiz süresi', 'kanun yolu harcı'],
        rehber: [
            'Kanun yolu süreleri tebliğle işlemeye başlar; harç yatırılmaması usul sonuçları doğurabilir.',
        ],
        mevzuat: [{ label: 'HMK', href: '/mevzuat/hmk/madde-1' }],
        ilgili: ['sure', 'dava-harci'],
    },
    {
        id: 'risk',
        icon: '🔍',
        baslik: 'Dava Risk ve Maliyet Analizi',
        tag: 'Analiz',
        aciklama: 'Dava maliyeti ve senaryo karşılaştırması için kaba analiz aracı. Sonuç vaadi içermez.',
        keywords: ['dava maliyeti hesaplama', 'dava risk analizi'],
        rehber: [
            'Her dava özgüdelidir; bu araç yalnızca girdiğiniz varsayımlarla maliyet senaryosu üretir.',
            'Kazanma ihtimali sayısal olarak garanti edilemez.',
        ],
        mevzuat: [{ label: 'HMK', href: '/mevzuat/hmk/madde-1' }],
        ilgili: ['vekalet', 'dava-harci', 'arabuluculuk'],
    },
    {
        id: 'infaz',
        icon: '⛓️',
        baslik: 'İnfaz (Yatar) Hesaplama 2026',
        tag: 'Ceza İnfaz',
        aciklama: 'İnfaz ve koşullu salıverme için kabaca yatar süresi tahmini.',
        keywords: ['infaz hesaplama', 'yatar hesabı', 'koşullu salıverme'],
        rehber: [
            'İnfaz rejimi suç tipi, mükerrirlik, iyi hâl ve özel kanunlara göre değişir.',
            'Cumhuriyet savcılığı / infaz hâkimliği hesabı resmî sonuçtur.',
        ],
        mevzuat: [{ label: 'TCK', href: '/mevzuat/tck/madde-1' }],
        ilgili: ['ceza-zamanasimi'],
    },
    {
        id: 'kdv',
        icon: '🧮',
        baslik: 'KDV Hesaplama (Dahil / Hariç)',
        tag: 'Vergi',
        aciklama: 'KDV dahil/hariç matrah ve tutar ayrıştırma aracı.',
        keywords: ['KDV hesaplama', 'KDV dahil hariç'],
        rehber: [
            'KDV oranları mal/hizmet türüne göre değişir; fatura düzeni vergi mevzuatına tabidir.',
        ],
        mevzuat: [{ label: 'KDVK', href: '/mevzuat/kdvk/madde-1' }],
        ilgili: ['damga-vergisi', 'smm'],
    },
    {
        id: 'gecikme-zammi',
        icon: '⏳',
        baslik: 'Gecikme Zammı (Amme Alacağı 2026)',
        tag: 'Vergi',
        aciklama: 'Amme alacaklarında gecikme zammı için bilgilendirici hesap.',
        keywords: ['gecikme zammı hesaplama', 'amme alacağı faiz'],
        rehber: [
            'Gecikme zammı oranları dönemsel tebliğlerle belirlenir; vergi dairesi tahakkuku esastır.',
        ],
        mevzuat: [{ label: 'AATUHK', href: '/mevzuat/aatuhk/madde-1' }],
        ilgili: ['faiz', 'kdv'],
    },
    {
        id: 'damga-vergisi',
        icon: '📜',
        baslik: 'Damga Vergisi (Sözleşme) 2026',
        tag: 'Vergi',
        aciklama: 'Sözleşme damga vergisi için kabaca tutar tahmini.',
        keywords: ['damga vergisi hesaplama', 'sözleşme damga'],
        rehber: [
            'Damga vergisi kağıt türü ve tutara göre değişir; istisnalar ve maktu/nispi ayrımı önemlidir.',
        ],
        mevzuat: [{ label: 'VUK', href: '/mevzuat/vuk/madde-1' }],
        ilgili: ['kdv', 'tapu'],
    },
    {
        id: 'is-kazasi',
        icon: '🩹',
        baslik: 'İş Kazası — Geçici İş Göremezlik Kabaca',
        tag: 'İş Hukuku',
        aciklama:
            'Günlük kazanç ve istirahat gününe göre geçici iş göremezlik ödeneği kabaca tahmini. SGK hesabı yerine geçmez.',
        keywords: ['iş kazası tazminatı', 'geçici iş göremezlik hesaplama'],
        rehber: [
            'İş kazasında SGK ödenekleri, rücu ve maddi/manevi tazminat ayrı hukuki yollardır.',
            'Bu araç yalnızca basit günlük × gün senaryosu üretir; maluliyet ve destekten yoksun kalma kapsanmaz.',
        ],
        mevzuat: [{ label: 'İş Kanunu', href: '/mevzuat/is-kanunu/madde-1' }],
        ilgili: ['kidem', 'fazla-mesai'],
    },
];

export function getAracMeta(id: string): HesaplamaAracMeta | undefined {
    return HESAPLAMA_ARACLAR.find((a) => a.id === id);
}

export function getAllAracIds(): string[] {
    return HESAPLAMA_ARACLAR.map((a) => a.id);
}

/** Kanun id → önerilen hesaplama araçları (madde sayfalarında çapraz link) */
export const KANUN_ARAC_MAP: Record<string, string[]> = {
    tmk: ['miras', 'sakli-pay', 'nafaka', 'mal-rejimi', 'iddet'],
    tbk: ['faiz', 'kira', 'kira-tespit', 'arac-deger-kaybi', 'zamanasimi'],
    'is-kanunu': ['kidem', 'ise-iade', 'fazla-mesai', 'yillik-izin', 'is-kazasi', 'net-brut-maas'],
    iik: ['icra-kapak', 'inkar-tazminati', 'sure'],
    hmk: ['sure', 'dava-harci', 'istinaf-temyiz', 'vekalet', 'risk'],
    tck: ['infaz', 'ceza-zamanasimi'],
    arabuluculuk: ['arabuluculuk'],
    kdvk: ['kdv'],
    gvk: ['smm', 'net-brut-maas'],
    aatuhk: ['gecikme-zammi'],
    vuk: ['damga-vergisi'],
    ssgssk: ['issizlik-maasi', 'is-kazasi'],
    ttk: ['faiz', 'vekalet'],
    katmulkiyeti: ['tapu'],
};

export function araclarForKanun(kanunId: string): HesaplamaAracMeta[] {
    const ids = KANUN_ARAC_MAP[kanunId] ?? [];
    return ids.map(getAracMeta).filter((x): x is HesaplamaAracMeta => Boolean(x));
}
