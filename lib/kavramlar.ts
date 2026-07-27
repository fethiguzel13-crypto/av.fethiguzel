/**
 * Kavram landing sayfaları — SEO + forum/paylaşım için kısa, reklam yasağına uygun bilgilendirme.
 */

export type Kavram = {
    slug: string;
    baslik: string;
    ozet: string;
    /** Forum / sosyal için ~400–700 karakter, kopyalanabilir */
    miniCevap: string;
    paragraflar: string[];
    keywords: string[];
    mevzuat: { label: string; href: string }[];
    hesaplama?: { label: string; href: string }[];
    rehber?: { label: string; href: string }[];
    ilgili?: string[];
};

export const KAVRAMLAR: Kavram[] = [
    {
        slug: 'satim',
        baslik: 'Satım sözleşmesi',
        ozet: 'TBK’da satım; satıcının malı devir, alıcının bedeli ödeme borcudur. Taşınır ve taşınmaz satımı farklı hükümlere tabi olabilir.',
        miniCevap:
            'Satım, satıcının bir malı alıcıya devretmeyi, alıcının da bedeli ödemeyi üstlendiği sözleşmedir (TBK satım hükümleri). Taşınır ve taşınmaz satımında şekil, ayıp, zapt ve temerrüt kuralları somut olaya göre değişir. Genel bilgilendirme amaçlıdır; somut uyuşmazlıkta avukata danışılmalıdır.\n\nMadde ve şerh: https://avfethiguzel.com/ara?q=sat%C4%B1m\nKavram: https://avfethiguzel.com/kavram/satim\n— Av. Fethi Güzel',
        paragraflar: [
            'Türk Borçlar Kanunu satım sözleşmesini özel borç ilişkileri içinde düzenler. Temel yapı: satıcı malı devreder, alıcı bedeli öder; tarafların ayıba karşı tekeffül, zapt ve temerrüt gibi hak ve borçları somut sözleşmeye ve malın niteliğine göre şekillenir.',
            'Taşınır satımı ile taşınmaz satımı uygulamada sıklıkla karışır. Taşınmazda tapu ve şekil şartları; taşınırda zilyetlik ve teslim fiilleri ön plandadır. “Satım” kelimesi icra ve amme alacakları satışı gibi başka bağlamlarda da geçer; arama sonuçlarını bu yüzden kanuna göre süzmek gerekir.',
            'Bu sayfa bilgilendirme amaçlıdır. Sözleşme taslağı, ayıp ihbarı veya dava stratejisi için dosya bazlı hukuki değerlendirme gerekir.',
        ],
        keywords: ['satım', 'satış', 'taşınır satışı', 'taşınmaz satışı', 'TBK satım'],
        mevzuat: [
            { label: 'TBK satım (arama)', href: '/ara?q=sat%C4%B1m' },
            { label: 'TBK m.207 civarı', href: '/mevzuat/tbk/madde-207' },
        ],
        hesaplama: [{ label: 'Damga vergisi (sözleşme)', href: '/hesaplama/damga-vergisi' }],
        ilgili: ['ayip', 'kira', 'vekalet'],
    },
    {
        slug: 'kidem-tazminati',
        baslik: 'Kıdem tazminatı',
        ozet: 'İş Kanunu çerçevesinde, kanunda sayılan koşullarda işçinin kıdemine bağlı olarak gündeme gelebilecek bir işçilik alacağıdır.',
        miniCevap:
            'Kıdem tazminatı, İş Kanunu’nda öngörülen koşullar oluştuğunda ve kanunda sayılan fesih/ayrılış hâllerinde gündeme gelebilir; her işten ayrılış otomatik hak doğurmaz. Tutar; giydirilmiş ücret, kıdem süresi ve dönemsel tavan ile ilişkilidir. Bilgilendirme amaçlı kabaca hesap: https://avfethiguzel.com/hesaplama/kidem\nRehber: https://avfethiguzel.com/rehber/kidem-tazminati\n— Av. Fethi Güzel (sonuç vaadi yoktur)',
        paragraflar: [
            'Kıdem tazminatı, iş ilişkisinin belirli şekilde sona ermesi ve yasal şartların oluşması hâlinde gündeme gelir. Hak kazanma koşulları, tavan ve vergi/damga uygulamaları dönemsel mevzuata bağlıdır.',
            'Portal üzerindeki hesaplama aracı bilgilendirme amaçlıdır; bordro, toplu iş sözleşmesi ve yargı uygulaması somut tutarı değiştirebilir.',
        ],
        keywords: ['kıdem tazminatı', 'ihbar', 'iş hukuku', 'işten çıkarma'],
        mevzuat: [{ label: 'İş Kanunu', href: '/mevzuat/is-kanunu/madde-1' }],
        hesaplama: [
            { label: 'Kıdem & ihbar', href: '/hesaplama/kidem' },
            { label: 'Birleşik işçilik raporu', href: '/hesaplama/kidem-ise-iade' },
        ],
        rehber: [{ label: 'Kıdem rehberi', href: '/rehber/kidem-tazminati' }],
        ilgili: ['ihbar-tazminati', 'ise-iade'],
    },
    {
        slug: 'ihbar-tazminati',
        baslik: 'İhbar tazminatı',
        ozet: 'Bildirim sürelerine uyulmadan yapılan fesihlerde gündeme gelebilecek işçilik alacağıdır; kıdemden ayrı değerlendirilir.',
        miniCevap:
            'İhbar tazminatı, kanundaki bildirim sürelerine uyulmadan fesih hâlinde gündeme gelebilir; kıdem tazminatından ayrı bir kalemdir. Süre ve tutar kıdeme göre değişir. Kabaca hesap: https://avfethiguzel.com/hesaplama/kidem\n— Av. Fethi Güzel · bilgilendirme',
        paragraflar: [
            'İhbar (bildirim) süreleri iş süresine göre kademelidir. Usule uygun bildirim veya ihbar tazminatı ödemesi seçenekleri somut fesih türüne bağlıdır.',
        ],
        keywords: ['ihbar tazminatı', 'bildirim süresi', 'fesih'],
        mevzuat: [{ label: 'İş Kanunu', href: '/mevzuat/is-kanunu/madde-1' }],
        hesaplama: [{ label: 'Kıdem & ihbar aracı', href: '/hesaplama/kidem' }],
        ilgili: ['kidem-tazminati'],
    },
    {
        slug: 'ise-iade',
        baslik: 'İşe iade',
        ozet: 'İş güvencesi kapsamındaki işçiler için, geçersiz feshe karşı yasal yoldur; süre ve işyeri şartları aranır.',
        miniCevap:
            'İşe iade, iş güvencesi kapsamındaki işçiler için öngörülmüş bir yoldur; süre, işçi sayısı ve fesih usulü şartları aranır. Boşta geçen süre ve işe başlatmama tazminatı mahkeme sonucuna bağlıdır. Bilgi aracı: https://avfethiguzel.com/hesaplama/ise-iade\n— Av. Fethi Güzel',
        paragraflar: [
            'İşe iade davası, her fesih için açık değildir. Sürelerin kaçırılması hak kaybına yol açabilir; tebliğ ve başvuru usulü kritiktir.',
        ],
        keywords: ['işe iade', 'iş güvencesi', 'geçersiz fesih'],
        mevzuat: [{ label: 'İş Kanunu', href: '/mevzuat/is-kanunu/madde-1' }],
        hesaplama: [{ label: 'İşe iade tahmini', href: '/hesaplama/ise-iade' }],
        ilgili: ['kidem-tazminati'],
    },
    {
        slug: 'nafaka',
        baslik: 'Nafaka',
        ozet: 'İştirak, yoksulluk ve tedbir nafakası gibi türleri vardır; miktar hâkimin takdirindedir.',
        miniCevap:
            'Nafaka türleri (iştirak, yoksulluk, tedbir) ve miktarı; tarafların ekonomik-sosyal durumu, çocuğun ihtiyaçları ve hakkaniyete göre hâkim tarafından takdir edilir. Yüzde “garanti” yoktur. Artış senaryosu (bilgi): https://avfethiguzel.com/hesaplama/nafaka\n— Av. Fethi Güzel',
        paragraflar: [
            'Nafaka, aile hukukunun en sık uyuşmazlık alanlarından biridir. Artış/azalış davalarında delil ve güncel gelir gider tablosu belirleyicidir.',
        ],
        keywords: ['nafaka', 'iştirak nafakası', 'yoksulluk nafakası'],
        mevzuat: [{ label: 'TMK nafaka (ör. m.330)', href: '/mevzuat/tmk/madde-330' }],
        hesaplama: [{ label: 'Nafaka artış aracı', href: '/hesaplama/nafaka' }],
        ilgili: ['mal-rejimi', 'bosanma'],
    },
    {
        slug: 'mal-rejimi',
        baslik: 'Mal rejimi (edinilmiş mallara katılma)',
        ozet: 'Yasal rejim kural olarak edinilmiş mallara katılmadır; kişisel mal / edinilmiş mal ayrımı esastır.',
        miniCevap:
            'Eşler arasında kural olarak edinilmiş mallara katılma rejimi geçerlidir (sözleşme ile başka rejim seçilmedikçe). Katılma alacağı, edinilmiş malların tasfiyesine bağlıdır; kişisel mallar kural olarak tasfiye dışındadır. Kabaca araç: https://avfethiguzel.com/hesaplama/mal-rejimi\n— Av. Fethi Güzel · bilgilendirme',
        paragraflar: [
            'Mal rejimi sözleşmesi ve ispat yükü uygulamada sık tartışılır. Tasfiye hesabı bilirkişi ve delil ile somutlaşır.',
        ],
        keywords: ['mal rejimi', 'edinilmiş mallara katılma', 'katılma alacağı'],
        mevzuat: [{ label: 'TMK mal rejimi', href: '/mevzuat/tmk/madde-202' }],
        hesaplama: [{ label: 'Mal rejimi aracı', href: '/hesaplama/mal-rejimi' }],
        ilgili: ['nafaka', 'miras'],
    },
    {
        slug: 'miras',
        baslik: 'Yasal mirasçılık ve miras paylaşımı',
        ozet: 'TMK zümre sistemine göre yasal mirasçılar ve paylar belirlenir; vasiyet ve saklı pay ayrıca değerlendirilir.',
        miniCevap:
            'Yasal mirasçılık Türk Medeni Kanunu’nda zümre esasına dayanır; sağ kalan eş ve altsoy/üstsoy payları olaya göre değişir. Vasiyet ve saklı pay ayrı rejimlerdir. Kabaca pay hesabı: https://avfethiguzel.com/hesaplama/miras\nRehber: https://avfethiguzel.com/rehber/miras-paylasimi\n— Av. Fethi Güzel',
        paragraflar: [
            'Veraset ilamı, tereke tespiti ve tenkis davaları miras uyuşmazlıklarının tipik aşamalarıdır. Bu portal yalnızca genel çerçeve sunar.',
        ],
        keywords: ['miras', 'yasal mirasçı', 'miras payı', 'zümre'],
        mevzuat: [{ label: 'TMK miras', href: '/mevzuat/tmk/madde-495' }],
        hesaplama: [
            { label: 'Miras paylaşımı', href: '/hesaplama/miras' },
            { label: 'Saklı pay', href: '/hesaplama/sakli-pay' },
        ],
        rehber: [{ label: 'Miras rehberi', href: '/rehber/miras-paylasimi' }],
        ilgili: ['sakli-pay', 'mal-rejimi'],
    },
    {
        slug: 'sakli-pay',
        baslik: 'Saklı pay',
        ozet: 'Belirli mirasçıların kanunen korunan asgari payıdır; ihlalde tenkis gündeme gelebilir.',
        miniCevap:
            'Saklı pay, yasal mirasçılardan bir kısmının kanunen korunan asgari payıdır. Vasiyet veya kazandırmalar saklı payı ihlal ederse tenkis söz konusu olabilir. Bilgi aracı: https://avfethiguzel.com/hesaplama/sakli-pay\n— Av. Fethi Güzel',
        paragraflar: [
            'Saklı pay oranları mirasçı grubuna göre değişir. Tereke değeri ve mahsuplar somut hesapta belirleyicidir.',
        ],
        keywords: ['saklı pay', 'tenkis', 'tasarruf nisabı'],
        mevzuat: [{ label: 'TMK saklı pay', href: '/mevzuat/tmk/madde-506' }],
        hesaplama: [{ label: 'Saklı pay hesabı', href: '/hesaplama/sakli-pay' }],
        ilgili: ['miras'],
    },
    {
        slug: 'faiz',
        baslik: 'Faiz (yasal / ticari)',
        ozet: 'Alacağın niteliğine ve sözleşmeye göre yasal, ticari veya avans faizi uygulanabilir; oranlar dönemseldir.',
        miniCevap:
            'Faiz türü (yasal, ticari, avans) alacağın niteliğine ve taraflar arasındaki ilişkiye göre değişir. Oranlar dönemsel tebliğlerle güncellenir. Dönem dilimli kabaca hesap: https://avfethiguzel.com/hesaplama/faiz\n— Av. Fethi Güzel · bilgilendirme',
        paragraflar: [
            'Faiz başlangıç tarihi, temerrüt ve bileşik/basit faiz tartışmaları dosyaya özgüdür. Amme alacaklarında gecikme zammı ayrı rejimdir.',
        ],
        keywords: ['faiz', 'yasal faiz', 'ticari faiz', 'temerrüt'],
        mevzuat: [{ label: 'TBK faiz', href: '/mevzuat/tbk/madde-88' }],
        hesaplama: [
            { label: 'Faiz hesaplama', href: '/hesaplama/faiz' },
            { label: 'Gecikme zammı', href: '/hesaplama/gecikme-zammi' },
        ],
        ilgili: ['icra', 'sure'],
    },
    {
        slug: 'icra',
        baslik: 'İcra takibi (genel çerçeve)',
        ozet: 'Alacağın cebri icra yoluyla tahsiline ilişkin süreç; ilamlı / ilamsız yollar ve itiraz imkânları vardır.',
        miniCevap:
            'İcra takibi, alacağın cebri icra ile tahsiline yönelik bir yoldur; ilamlı ve ilamsız takip türleri ve itiraz süreleri somut olaya göre değişir. Kapak/harç kabaca: https://avfethiguzel.com/hesaplama/icra-kapak\nİİK maddeleri: https://avfethiguzel.com/mevzuat/iik/madde-1\n— Av. Fethi Güzel',
        paragraflar: [
            'İtiraz, şikâyet ve istirdat gibi yollar süreye bağlıdır. Yanlış takip yolu veya süre kaçırma hak kaybı doğurabilir.',
        ],
        keywords: ['icra', 'ilamsız takip', 'haciz', 'itiraz'],
        mevzuat: [{ label: 'İİK', href: '/mevzuat/iik/madde-1' }],
        hesaplama: [
            { label: 'İcra kapak hesabı', href: '/hesaplama/icra-kapak' },
            { label: 'İnkâr tazminatı', href: '/hesaplama/inkar-tazminati' },
        ],
        ilgili: ['faiz', 'sure'],
    },
    {
        slug: 'sure',
        baslik: 'Süre hesabı (tebliğden)',
        ozet: 'İstinaf, temyiz, itiraz gibi süreler tebliğle işlemeye başlar; tatil günleri ve özel hükümler sonucu etkiler.',
        miniCevap:
            'Usul süreleri çoğunlukla tebliğle başlar; son günün tatile rastlaması ve özel kanun hükümleri hesabı kaydırabilir. Süre kaçırma hak kaybı doğurabilir. Kabaca araç: https://avfethiguzel.com/hesaplama/sure\n— Av. Fethi Güzel · kesin işlem öncesi avukata danışın',
        paragraflar: [
            'Süre hesabı “basit takvim” değildir. Tebligat usulü ve kanundaki özel süreler dosyayı belirler.',
        ],
        keywords: ['süre hesabı', 'tebliğ', 'istinaf süresi', 'temyiz süresi'],
        mevzuat: [{ label: 'HMK', href: '/mevzuat/hmk/madde-1' }],
        hesaplama: [
            { label: 'Süre hesabı', href: '/hesaplama/sure' },
            { label: 'İstinaf/temyiz harç', href: '/hesaplama/istinaf-temyiz' },
        ],
        ilgili: ['icra', 'arabuluculuk'],
    },
    {
        slug: 'arabuluculuk',
        baslik: 'Arabuluculuk',
        ozet: 'Bazı uyuşmazlıklarda dava şartı olan, tarafların anlaşmasıyla sonuçlanabilen alternatif çözüm yoludur.',
        miniCevap:
            'Arabuluculuk, bazı uyuşmazlıklarda dava şartıdır; anlaşma belgesi belirli koşullarda ilam niteliği taşıyabilir. Süreç ve ücret tarifeye bağlıdır. Rehber: https://avfethiguzel.com/rehber/arabuluculuk\nÜcret kabaca: https://avfethiguzel.com/hesaplama/arabuluculuk\n— Av. Fethi Güzel',
        paragraflar: [
            'Dava şartı arabuluculukta başvuru ve son tutanak usulü, davanın esasına etki eder. Anlaşma kapsamı dikkatle yazılmalıdır.',
        ],
        keywords: ['arabuluculuk', 'dava şartı', 'anlaşma belgesi'],
        mevzuat: [{ label: 'Arabuluculuk Kanunu', href: '/mevzuat/arabuluculuk/madde-1' }],
        hesaplama: [{ label: 'Arabuluculuk ücreti', href: '/hesaplama/arabuluculuk' }],
        rehber: [{ label: 'Arabuluculuk rehberi', href: '/rehber/arabuluculuk' }],
        ilgili: ['sure', 'vekalet'],
    },
    {
        slug: 'vekalet',
        baslik: 'Vekalet ücreti (yargılama)',
        ozet: 'Mahkemece hükmedilecek vekalet ücreti AAÜT ve yargılama sonucuna bağlıdır; avukat-müvekkil ücreti ayrıdır.',
        miniCevap:
            'Yargılama gideri olarak vekalet ücreti ile avukat-müvekkil sözleşme ücreti farklıdır. Mahkemece hükmedilecek tutar AAÜT ve sonuçla ilişkilidir. Kabaca: https://avfethiguzel.com/hesaplama/vekalet\n— Av. Fethi Güzel',
        paragraflar: [
            'Tarife her yıl güncellenir. Kısmi kabul, feragat ve ıslah gibi usul hareketleri ücreti etkiler.',
        ],
        keywords: ['vekalet ücreti', 'AAÜT', 'yargılama gideri'],
        mevzuat: [{ label: 'HMK', href: '/mevzuat/hmk/madde-1' }],
        hesaplama: [{ label: 'Vekalet ücreti aracı', href: '/hesaplama/vekalet' }],
        ilgili: ['dava-harci', 'arabuluculuk'],
    },
    {
        slug: 'dava-harci',
        baslik: 'Dava harcı ve gider avansı',
        ozet: 'Dava açılışında harç ve gider avansı; dava türü ve değere göre değişir.',
        miniCevap:
            'Dava açılış harcı ve gider avansı, dava türü ve değerine göre değişir; tevzi bürosu tahakkuku esastır. Kabaca: https://avfethiguzel.com/hesaplama/dava-harci\n— Av. Fethi Güzel',
        paragraflar: [
            'Harç muafiyetleri ve erteleme imkânları ayrı rejimlere tabidir. Yanlış harç yatırımı usul sonuçları doğurabilir.',
        ],
        keywords: ['dava harcı', 'gider avansı', 'nispi harç'],
        mevzuat: [{ label: 'HMK', href: '/mevzuat/hmk/madde-1' }],
        hesaplama: [{ label: 'Dava harcı aracı', href: '/hesaplama/dava-harci' }],
        ilgili: ['vekalet'],
    },
    {
        slug: 'kira',
        baslik: 'Kira artışı ve kira tespit',
        ozet: 'Konut ve işyeri kiralarında artış tavanları dönemsel düzenlemelere bağlıdır; tespit davası ayrı bir yoldur.',
        miniCevap:
            'Kira artışında yasal tavan ve endeks uygulamaları dönemseldir. Beş yılı aşan kirada tespit davası emsal ve rayiçle ilişkilidir; tek oran her dosyada geçerli değildir. Araçlar: https://avfethiguzel.com/hesaplama/kira · https://avfethiguzel.com/hesaplama/kira-tespit\n— Av. Fethi Güzel',
        paragraflar: [
            'Kira sözleşmesi tarihi, yenileme ve kullanım amacı (konut/işyeri) uygulanacak rejimi değiştirir.',
        ],
        keywords: ['kira artışı', 'kira tespit', 'TBK kira'],
        mevzuat: [{ label: 'TBK kira', href: '/mevzuat/tbk/madde-344' }],
        hesaplama: [
            { label: 'Kira artışı', href: '/hesaplama/kira' },
            { label: 'Kira tespit (ÜFE)', href: '/hesaplama/kira-tespit' },
        ],
        ilgili: ['satim'],
    },
    {
        slug: 'e-durusma',
        baslik: 'e-Duruşma',
        ozet: 'Ses ve görüntünün nakli yoluyla duruşma icrası; medeni usulde teknoloji entegrasyonu.',
        miniCevap:
            'e-Duruşma, ses ve görüntünün nakledilmesi yoluyla duruşma icrasına ilişkin usul kurumudur. Uygulama ve teknik altyapı mahkeme ve dosya türüne göre değişir. Monografi ve kaynaklar: https://avfethiguzel.com/e-durusma\n— Av. Fethi Güzel',
        paragraflar: [
            'Portalda e-duruşma monografisi ve HMK bağlantıları bir arada sunulur. Bu sayfa akademik/bilgilendirme amaçlıdır.',
        ],
        keywords: ['e-duruşma', 'ses görüntü nakli', 'medeni usul'],
        mevzuat: [{ label: 'HMK', href: '/mevzuat/hmk/madde-1' }],
        rehber: [{ label: 'e-Duruşma hub', href: '/e-durusma' }],
        ilgili: ['sure'],
    },
    {
        slug: 'zamanasimi',
        baslik: 'Zamanaşımı',
        ozet: 'Alacak ve bazı ceza ilişkilerinde hakkın süreyle sınırlanması; kesilme ve durma sebepleri sonucu etkiler.',
        miniCevap:
            'Zamanaşımı süreleri borcun veya suçun niteliğine göre değişir; kesilme ve durma sebepleri hesabı etkiler. Kabaca kontrol: https://avfethiguzel.com/hesaplama/zamanasimi · ceza: https://avfethiguzel.com/hesaplama/ceza-zamanasimi\n— Av. Fethi Güzel · bilgilendirme',
        paragraflar: [
            'Genel zamanaşımı ile özel süreler karıştırılmamalıdır. Somut alacak tipini doğru tespit etmek ilk adımdır.',
        ],
        keywords: ['zamanaşımı', 'hak düşürücü süre', 'TBK 146'],
        mevzuat: [{ label: 'TBK zamanaşımı', href: '/mevzuat/tbk/madde-146' }],
        hesaplama: [
            { label: 'Zamanaşımı sihirbazı', href: '/hesaplama/zamanasimi' },
            { label: 'Ceza zamanaşımı', href: '/hesaplama/ceza-zamanasimi' },
        ],
        ilgili: ['faiz', 'icra'],
    },
    {
        slug: 'bosanma',
        baslik: 'Boşanma (genel bilgilendirme)',
        ozet: 'Anlaşmalı ve çekişmeli boşanma; nafaka, velayet ve mal rejimi sonuçları birlikte değerlendirilir.',
        miniCevap:
            'Boşanma; anlaşmalı veya çekişmeli yollarla görülür. Nafaka, velayet, kişisel ilişki ve mal rejimi tasfiyesi ayrı başlıklardır. Genel araçlar: https://avfethiguzel.com/hesaplama/nafaka · https://avfethiguzel.com/hesaplama/mal-rejimi\n— Av. Fethi Güzel · sonuç vaadi yoktur',
        paragraflar: [
            'Boşanma davasında delil ve usul, nafaka ve mal rejiminden bağımsız yürüyebilir. Bu metin genel çerçevedir.',
        ],
        keywords: ['boşanma', 'anlaşmalı boşanma', 'çekişmeli boşanma'],
        mevzuat: [{ label: 'TMK aile', href: '/mevzuat/tmk/madde-161' }],
        hesaplama: [
            { label: 'Nafaka', href: '/hesaplama/nafaka' },
            { label: 'Mal rejimi', href: '/hesaplama/mal-rejimi' },
        ],
        ilgili: ['nafaka', 'mal-rejimi'],
    },
    {
        slug: 'ayip',
        baslik: 'Ayıp (satımda)',
        ozet: 'Satılan maldaki ayıplar; ihbar, seçimlik haklar ve zamanaşımı satım hükümleriyle bağlantılıdır.',
        miniCevap:
            'Satımdaki ayıp; alıcının ihbar yükümü, seçimlik hakları ve süreleri TBK satım hükümlerine tabidir. Somut mal ve sözleşme metni belirleyicidir. İlgili maddeler: https://avfethiguzel.com/ara?q=ay%C4%B1p\nSatım kavramı: https://avfethiguzel.com/kavram/satim\n— Av. Fethi Güzel',
        paragraflar: [
            'Gizli ayıp, açık ayıp ve muayene külfeti uygulamada sık tartışılır. Süreler kaçırıldığında haklar zayıflayabilir.',
        ],
        keywords: ['ayıp', 'ayıba karşı tekeffül', 'satım ayıp'],
        mevzuat: [{ label: 'Satım arama', href: '/ara?q=ay%C4%B1p' }],
        ilgili: ['satim'],
    },
    {
        slug: 'fazla-mesai',
        baslik: 'Fazla mesai (fazla çalışma)',
        ozet: 'Haftalık/günlük çalışma sürelerini aşan çalışmalar; zamlı ücret ve ispat kuralları somut olaya bağlıdır.',
        miniCevap:
            'Fazla çalışma (fazla mesai), kanuni süreleri aşan çalışmalarda gündeme gelebilir; zam oranı, denkleştirme ve ispat (bordro, puantaj, tanık) somut olaya bağlıdır. Kabaca hesap: https://avfethiguzel.com/hesaplama/fazla-mesai\n— Av. Fethi Güzel · bilgilendirme',
        paragraflar: [
            'Fazla mesai alacağı zamanaşımı ve ispat yükü uygulamada sık tartışılır. Toplu iş sözleşmesi özel rejim getirebilir.',
        ],
        keywords: ['fazla mesai', 'fazla çalışma', 'ücret zammı'],
        mevzuat: [{ label: 'İş Kanunu', href: '/mevzuat/is-kanunu/madde-1' }],
        hesaplama: [{ label: 'Fazla mesai aracı', href: '/hesaplama/fazla-mesai' }],
        ilgili: ['kidem-tazminati', 'yillik-izin'],
    },
    {
        slug: 'yillik-izin',
        baslik: 'Yıllık ücretli izin',
        ozet: 'Kıdeme göre artan yıllık izin hakkı; kullanılmayan izin ücreti işten ayrılışta gündeme gelebilir.',
        miniCevap:
            'Yıllık ücretli izin süreleri kıdeme göre kademelidir; kullanılmayan izin ücreti iş ilişkisinin sona ermesinde talep edilebilir. Kabaca: https://avfethiguzel.com/hesaplama/yillik-izin\n— Av. Fethi Güzel',
        paragraflar: [
            'İzin kullandırma usulü ve ücret hesabında giydirilmiş ücret tartışmaları dosyaya özgüdür.',
        ],
        keywords: ['yıllık izin', 'izin ücreti', 'kullanılmayan izin'],
        mevzuat: [{ label: 'İş Kanunu', href: '/mevzuat/is-kanunu/madde-1' }],
        hesaplama: [{ label: 'Yıllık izin aracı', href: '/hesaplama/yillik-izin' }],
        ilgili: ['kidem-tazminati', 'fazla-mesai'],
    },
    {
        slug: 'is-kazasi',
        baslik: 'İş kazası',
        ozet: 'İşyerinde veya iş nedeniyle oluşan kazalarda SGK ödenekleri ile maddi/manevi tazminat ayrı hukuki yollardır.',
        miniCevap:
            'İş kazasında SGK geçici iş göremezlik ödeneği, rücu ve maddi/manevi tazminat ayrı rejimlere tabidir. Kabaca ödenek senaryosu (SGK yerine geçmez): https://avfethiguzel.com/hesaplama/is-kazasi\n— Av. Fethi Güzel · bilgilendirme',
        paragraflar: [
            'Bildirim süreleri, kusur ve maluliyet oranı somut dosyayı belirler. Bu sayfa genel çerçevedir.',
        ],
        keywords: ['iş kazası', 'geçici iş göremezlik', 'iş güvenliği'],
        mevzuat: [{ label: 'İş Kanunu / arama', href: '/ara?q=i%C5%9F%20kazas%C4%B1' }],
        hesaplama: [{ label: 'İş kazası kabaca', href: '/hesaplama/is-kazasi' }],
        ilgili: ['kidem-tazminati'],
    },
    {
        slug: 'tapu',
        baslik: 'Tapu harcı ve tescil (genel)',
        ozet: 'Taşınmaz devrinde tapu harcı matrah ve oranlara bağlıdır; işlem türü harcı değiştirir.',
        miniCevap:
            'Tapu harcı, işlem türü ve matrah (beyan/rayiç) üzerinden hesaplanır; tapu müdürlüğü tahakkuku esastır. Kabaca: https://avfethiguzel.com/hesaplama/tapu\n— Av. Fethi Güzel',
        paragraflar: [
            'İptal-tescil, izale-i şüyu ve bağış gibi yollar harç ve usul bakımından farklıdır. Somut işlem için avukata danışın.',
        ],
        keywords: ['tapu harcı', 'tescil', 'taşınmaz devri'],
        mevzuat: [{ label: 'Kat mülkiyeti / arama', href: '/ara?q=tapu' }],
        hesaplama: [{ label: 'Tapu harcı', href: '/hesaplama/tapu' }],
        ilgili: ['satim', 'kira'],
    },
    {
        slug: 'infaz',
        baslik: 'İnfaz (yatar) hesabı',
        ozet: 'Ceza infazında koşullu salıverme ve iyi hâl rejimi suç tipine ve kanuna göre değişir.',
        miniCevap:
            'İnfaz (yatar) süresi; suç tipi, mükerrirlik, iyi hâl ve özel kanunlara bağlıdır. Resmî hesap savcılık/infaz hâkimliğindedir. Kabaca: https://avfethiguzel.com/hesaplama/infaz\n— Av. Fethi Güzel · bilgilendirme',
        paragraflar: [
            'Koşullu salıverme oranları ve denetimli serbestlik uygulamaları sık değişir; bu araç kesin sonuç vermez.',
        ],
        keywords: ['infaz', 'yatar', 'koşullu salıverme'],
        mevzuat: [{ label: 'TCK', href: '/mevzuat/tck/madde-1' }],
        hesaplama: [
            { label: 'İnfaz hesabı', href: '/hesaplama/infaz' },
            { label: 'Ceza zamanaşımı', href: '/hesaplama/ceza-zamanasimi' },
        ],
        ilgili: ['zamanasimi'],
    },
    {
        slug: 'iddet',
        baslik: 'İddet (bekleme) süresi',
        ozet: 'Boşanma veya evliliğin sona ermesinden sonra yeniden evlenme için kanuni bekleme süresi.',
        miniCevap:
            'İddet (bekleme) süresi TMK’da düzenlenir; istisnalar ve mahkeme kararı somut durumu değiştirebilir. Kabaca bitiş: https://avfethiguzel.com/hesaplama/iddet\n— Av. Fethi Güzel',
        paragraflar: [
            'Süre başlangıcı ve istisnalar dosyaya özgüdür; nüfus işlemi öncesi teyit gerekir.',
        ],
        keywords: ['iddet', 'bekleme süresi', 'yeniden evlenme'],
        mevzuat: [{ label: 'TMK', href: '/mevzuat/tmk/madde-1' }],
        hesaplama: [{ label: 'İddet hesabı', href: '/hesaplama/iddet' }],
        ilgili: ['bosanma', 'nafaka'],
    },
    {
        slug: 'gecikme-zammi',
        baslik: 'Gecikme zammı (amme alacağı)',
        ozet: 'Vergi ve amme alacaklarında gecikme zammı oranları dönemsel tebliğlerle belirlenir.',
        miniCevap:
            'Amme alacaklarında gecikme zammı, dönemsel oranlara ve vade tarihine bağlıdır; vergi dairesi tahakkuku esastır. Kabaca: https://avfethiguzel.com/hesaplama/gecikme-zammi\n— Av. Fethi Güzel',
        paragraflar: [
            'Tecil, yapılandırma ve uzlaşma rejimleri gecikme hesabını değiştirebilir.',
        ],
        keywords: ['gecikme zammı', 'amme alacağı', 'vergi faizi'],
        mevzuat: [{ label: 'AATUHK', href: '/mevzuat/aatuhk/madde-1' }],
        hesaplama: [{ label: 'Gecikme zammı', href: '/hesaplama/gecikme-zammi' }],
        ilgili: ['faiz'],
    },
    {
        slug: 'kdv',
        baslik: 'KDV (katma değer vergisi) kabaca',
        ozet: 'Mal ve hizmet teslimlerinde KDV; oran mal/hizmet türüne göre değişir.',
        miniCevap:
            'KDV oranı mal/hizmet türüne göre değişir; dahil/hariç ayrıştırma fatura düzenine bağlıdır. Kabaca: https://avfethiguzel.com/hesaplama/kdv\n— Av. Fethi Güzel · muhasebe kaydı yerine geçmez',
        paragraflar: [
            'İstisna ve tevkifat rejimleri özeldir. Resmî beyanname ve fatura esastır.',
        ],
        keywords: ['KDV', 'katma değer vergisi', 'KDV dahil hariç'],
        mevzuat: [{ label: 'KDVK', href: '/mevzuat/kdvk/madde-1' }],
        hesaplama: [{ label: 'KDV aracı', href: '/hesaplama/kdv' }],
        ilgili: ['damga-vergisi'],
    },
    {
        slug: 'damga-vergisi',
        baslik: 'Damga vergisi',
        ozet: 'Belirli kâğıt ve sözleşmelerde maktu veya nispi damga vergisi gündeme gelebilir.',
        miniCevap:
            'Damga vergisi kâğıt türü ve tutara göre maktu/nispi olabilir; istisnalar önemlidir. Kabaca: https://avfethiguzel.com/hesaplama/damga-vergisi\n— Av. Fethi Güzel',
        paragraflar: [
            'Sözleşme sayısı, ek protokoller ve elektronik belgeler uygulamada sık soru konusudur.',
        ],
        keywords: ['damga vergisi', 'sözleşme damga'],
        mevzuat: [{ label: 'VUK / arama', href: '/ara?q=damga' }],
        hesaplama: [{ label: 'Damga vergisi aracı', href: '/hesaplama/damga-vergisi' }],
        ilgili: ['kdv', 'satim'],
    },
    {
        slug: 'inkar-tazminati',
        baslik: 'İcra inkâr tazminatı',
        ozet: 'İtirazın iptali ve benzeri yollarda kanuni şartlar oluşursa inkâr tazminatı gündeme gelebilir.',
        miniCevap:
            'İcra inkâr tazminatı her itirazda otomatik doğmaz; yasal şartlar ve oran dosyaya bağlıdır. Kabaca: https://avfethiguzel.com/hesaplama/inkar-tazminati\n— Av. Fethi Güzel',
        paragraflar: [
            'Haksız itiraz ve alacağın likit olup olmadığı uygulamada belirleyicidir.',
        ],
        keywords: ['inkâr tazminatı', 'itirazın iptali', 'icra'],
        mevzuat: [{ label: 'İİK', href: '/mevzuat/iik/madde-1' }],
        hesaplama: [{ label: 'İnkâr tazminatı', href: '/hesaplama/inkar-tazminati' }],
        ilgili: ['icra'],
    },
    {
        slug: 'issizlik-odenegi',
        baslik: 'İşsizlik ödeneği',
        ozet: 'İŞKUR işsizlik ödeneği; prim günü, ayrılış nedeni ve başvuru şartlarına bağlıdır.',
        miniCevap:
            'İşsizlik ödeneği hak kazanma; prim günü, işten ayrılış nedeni ve İŞKUR başvurusuna bağlıdır. Resmî tutar İŞKUR kaydındadır. Kabaca: https://avfethiguzel.com/hesaplama/issizlik-maasi\n— Av. Fethi Güzel',
        paragraflar: [
            'Hak düşürücü başvuru süreleri vardır. Kıdem/ihbar ile karıştırılmamalıdır.',
        ],
        keywords: ['işsizlik maaşı', 'işsizlik ödeneği', 'İŞKUR'],
        mevzuat: [{ label: 'SSGSSK', href: '/mevzuat/ssgssk/madde-1' }],
        hesaplama: [{ label: 'İşsizlik ödeneği', href: '/hesaplama/issizlik-maasi' }],
        ilgili: ['kidem-tazminati'],
    },
    {
        slug: 'arac-deger-kaybi',
        baslik: 'Araç değer kaybı',
        ozet: 'Trafik kazası sonrası aracın piyasa değerindeki azalma; ekspertiz ve hasar durumuna bağlıdır.',
        miniCevap:
            'Araç değer kaybı; hasar, km, piyasa ve ekspertize bağlıdır. Sigorta ve yargı uygulaması farklılık gösterebilir. Kabaca: https://avfethiguzel.com/hesaplama/arac-deger-kaybi\n— Av. Fethi Güzel · bilgilendirme',
        paragraflar: [
            'Kusur oranı ve poliçe kapsamı talebi etkiler. Bu araç garanti sonuç üretmez.',
        ],
        keywords: ['değer kaybı', 'trafik kazası', 'araç hasarı'],
        mevzuat: [{ label: 'TBK haksız fiil', href: '/mevzuat/tbk/madde-49' }],
        hesaplama: [{ label: 'Değer kaybı aracı', href: '/hesaplama/arac-deger-kaybi' }],
        ilgili: ['faiz'],
    },
];

/** Hesaplama araç id → kavram slug (çapraz link) */
export const HESAPLAMA_TO_KAVRAM: Record<string, string> = {
    miras: 'miras',
    'sakli-pay': 'sakli-pay',
    kidem: 'kidem-tazminati',
    'ise-iade': 'ise-iade',
    'kidem-ise-iade': 'kidem-tazminati',
    'fazla-mesai': 'fazla-mesai',
    'yillik-izin': 'yillik-izin',
    'issizlik-maasi': 'issizlik-odenegi',
    nafaka: 'nafaka',
    iddet: 'iddet',
    'mal-rejimi': 'mal-rejimi',
    faiz: 'faiz',
    'icra-kapak': 'icra',
    'inkar-tazminati': 'inkar-tazminati',
    kira: 'kira',
    'kira-tespit': 'kira',
    tapu: 'tapu',
    'arac-deger-kaybi': 'arac-deger-kaybi',
    vekalet: 'vekalet',
    'dava-harci': 'dava-harci',
    arabuluculuk: 'arabuluculuk',
    sure: 'sure',
    zamanasimi: 'zamanasimi',
    'ceza-zamanasimi': 'zamanasimi',
    'istinaf-temyiz': 'sure',
    infaz: 'infaz',
    kdv: 'kdv',
    'gecikme-zammi': 'gecikme-zammi',
    'damga-vergisi': 'damga-vergisi',
    'is-kazasi': 'is-kazasi',
};

export function getKavram(slug: string): Kavram | undefined {
    return KAVRAMLAR.find((k) => k.slug === slug);
}

export function getAllKavramSlugs(): string[] {
    return KAVRAMLAR.map((k) => k.slug);
}

export function getKavramForHesaplama(toolId: string): Kavram | undefined {
    const slug = HESAPLAMA_TO_KAVRAM[toolId];
    return slug ? getKavram(slug) : undefined;
}
