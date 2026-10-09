# G19 — Kanonik katman dayanak denetimi (halüsinasyon denetimi)

Üretim: `node scripts/ders-kanonik-olc.mjs --dayanak` (2026-10-09). Her satır, katmandaki bir örnek olay, tuzak ya da test sorusunun dayandığı maddeyi ve o maddenin depodaki kanun metninde (`content/mevzuat/<kanun>/madde-<n>.md`, `### Akademik` başlığından önceki kısım) aynen aranan ifadeyi gösterir. Aynı denetim `lib/__tests__/ders-kanonik-katman.test.mjs` içinde her kalite kapısında yinelenir.

Ek denetim: Katman düzyazısındaki 190 kanun maddesi göndermesinin (dayanak listesinde olmayanlar dahil) tamamı depoda var olan bir madde dosyasına gider. Katmanda içtihat künyesi, yüksek mahkeme adı ve doktrin yazarı yoktur (testte düzenli ifadeyle engellenir). Kaynak olarak gösterilen dokuz mevzuat.gov.tr PDF adresi 2026-10-09'da yanıt vermiştir (HTTP 206).

| Ders | Kalem | Dayanak | İfade (kanun metninde aranan) | Sonuç |
|---|---|---|---|---|
| borclar-genel | Olay: Vitrindeki fiyat etiketi ve yanlış yazılan bedel | tbk m.8 | fiyatını göstererek mal sergilenmesi | metinde geçer |
| borclar-genel | Olay: Vitrindeki fiyat etiketi ve yanlış yazılan bedel | tbk m.31 | gerçekte istediğinden önemli ölçüde az bir karşı edim için iradesini açıklamışsa | metinde geçer |
| borclar-genel | Olay: Vitrindeki fiyat etiketi ve yanlış yazılan bedel | tbk m.39 | öğrendiği ya da korkutmanın etkisinin ortadan kalktığı andan başlayarak bir yıl içinde | metinde geçer |
| borclar-genel | Olay: Vitrindeki fiyat etiketi ve yanlış yazılan bedel | tbk m.35 | diğer taraf yanılmayı biliyor veya bilmesi gerekiyorsa, tazminat istenemez | metinde geçer |
| borclar-genel | Olay: Süreli öneriye geç ulaşan kabul | tbk m.3 | kabul bu süre içinde kendisine ulaşmazsa; öneren, önerisiyle bağlılıktan kurtulur | metinde geçer |
| borclar-genel | Olay: Süreli öneriye geç ulaşan kabul | tbk m.5 | durumu hemen kabul edene bildirmek zorundadır | metinde geçer |
| borclar-genel | Olay: Kararlaştırılan teslim gününde ifa edilmeyen satım | tbk m.117 | borcun ifa edileceği gün, birlikte belirlenmiş | metinde geçer |
| borclar-genel | Olay: Kararlaştırılan teslim gününde ifa edilmeyen satım | tbk m.123 | borcun ifa edilmesi için uygun bir süre verebilir | metinde geçer |
| borclar-genel | Olay: Kararlaştırılan teslim gününde ifa edilmeyen satım | tbk m.125 | vazgeçtiğini hemen bildirerek | metinde geçer |
| borclar-genel | Olay: Kaldırımdaki çarpışma ve iki yıllık süre | tbk m.49 | kusurlu ve hukuka aykırı bir fiille başkasına zarar veren | metinde geçer |
| borclar-genel | Olay: Kaldırımdaki çarpışma ve iki yıllık süre | tbk m.50 | zarar gören, zararını ve zarar verenin kusurunu ispat yükü altındadır | metinde geçer |
| borclar-genel | Olay: Kaldırımdaki çarpışma ve iki yıllık süre | tbk m.72 | tazminat ceza kanunlarının daha uzun bir zamanaşımı öngördüğü cezayı gerektiren bir fiilden doğmuşsa | metinde geçer |
| borclar-genel | Olay: Kaldırımdaki çarpışma ve iki yıllık süre | tbk m.161 | zamanaşımı ileri sürülmedikçe, hâkim bunu kendiliğinden göz önüne alamaz | metinde geçer |
| borclar-genel | Olay: Kaldırımdaki çarpışma ve iki yıllık süre | tbk m.117 | haksız fiilde fiilin işlendiği | metinde geçer |
| borclar-genel | Tuzak: Vitrinde fiyatıyla sergilenen mal icaba davettir. | tbk m.8 | aksi açıkça ve kolaylıkla anlaşılmadıkça öneri sayılır | metinde geçer |
| borclar-genel | Tuzak: Temerrüt için her durumda ihtar gerekir. | tbk m.117 | bu günün geçmesiyle | metinde geçer |
| borclar-genel | Tuzak: Haksız fiilden doğan tazminat istemi on yılda zamanaşımına uğrar. | tbk m.72 | iki yılın ve her hâlde fiilin işlendiği tarihten başlayarak on yılın geçmesiyle | metinde geçer |
| borclar-genel | Tuzak: Sözleşmenin bir hükmü kesin hükümsüzse sözleşmenin tamamı hükümsüz olur. | tbk m.27 | diğerlerinin geçerliliğini etkilemez | metinde geçer |
| borclar-genel | Tuzak: Aldatmaya dayanmak için yanılmanın esaslı olması gerekir. | tbk m.36 | yanılması esaslı olmasa bile | metinde geçer |
| borclar-genel | Tuzak: Saikte yanılma her zaman esaslı yanılmadır. | tbk m.32 | saikte yanılma, esaslı yanılma sayılmaz | metinde geçer |
| borclar-genel | Tuzak: Kira bedeli alacağı genel kural gereği on yıllık zamanaşımına tabidir. | tbk m.147 | kira bedelleri, anapara faizleri ve ücret gibi diğer dönemsel edimler | metinde geçer |
| borclar-genel | Tuzak: Hâkim zamanaşımının dolduğunu dosyadan görürse davayı kendiliğinden reddeder. | tbk m.161 | hâkim bunu kendiliğinden göz önüne alamaz | metinde geçer |
| borclar-genel | Soru: Kabul için süre belirlenerek yapılan öneride kabul, süre bittikten sonra önerene ulaşmıştır. Sonuç nedir? | tbk m.3 | bu sürenin sona ermesine kadar önerisiyle bağlıdır | metinde geçer |
| borclar-genel | Soru: Aşırı yararlanmada zarar gören, zor durumda kalma hâlinde hakkını hangi süre içinde kullanmalıdır? | tbk m.28 | bu durumun ortadan kalktığı tarihten başlayarak bir yıl | metinde geçer |
| borclar-genel | Soru: Haksız fiil sorumluluğunda zararı ve kusuru kim ispat eder? | tbk m.50 | zarar gören, zararını ve zarar verenin kusurunu ispat yükü altındadır | metinde geçer |
| borclar-genel | Soru: Sebepsiz zenginleşmeden doğan geri isteme hakkı hangi sürede zamanaşımına uğrar? | tbk m.82 | geri isteme hakkı olduğunu öğrendiği tarihten başlayarak iki yılın | metinde geçer |
| borclar-genel | Soru: Borç hiç veya gereği gibi ifa edilmediğinde borçlu tazminattan nasıl kurtulur? | tbk m.112 | kendisine hiçbir kusurun yüklenemeyeceğini ispat etmedikçe | metinde geçer |
| borclar-genel | Soru: Hazır olan bir kişiye kabul süresi belirlenmeden yapılan öneri hemen kabul edilmezse ne olur? | tbk m.4 | hemen kabul edilmezse; öneren, önerisiyle bağlılıktan kurtulur | metinde geçer |
| medeni-usul | Olay: Antalya’daki taşınmaz için Ankara’da açılan tapu iptali davası | hmk m.12 | taşınmazın bulunduğu yer mahkemesi kesin yetkilidir | metinde geçer |
| medeni-usul | Olay: Antalya’daki taşınmaz için Ankara’da açılan tapu iptali davası | hmk m.19 | davanın sonuna kadar kendiliğinden araştırmak zorundadır | metinde geçer |
| medeni-usul | Olay: Antalya’daki taşınmaz için Ankara’da açılan tapu iptali davası | hmk m.114 | yetkinin kesin olduğu hâllerde, mahkemenin yetkili bulunması | metinde geçer |
| medeni-usul | Olay: Süresinde cevap vermeyen davalının sonradan öne sürdüğü ödeme | hmk m.127 | dava dilekçesinin davalıya tebliğinden itibaren iki haftadır | metinde geçer |
| medeni-usul | Olay: Süresinde cevap vermeyen davalının sonradan öne sürdüğü ödeme | hmk m.128 | vakıaların tamamını inkâr etmiş sayılır | metinde geçer |
| medeni-usul | Olay: Süresinde cevap vermeyen davalının sonradan öne sürdüğü ödeme | hmk m.190 | iddia edilen vakıaya bağlanan hukuki sonuçtan kendi lehine hak çıkaran tarafa aittir | metinde geçer |
| medeni-usul | Olay: Süresinde cevap vermeyen davalının sonradan öne sürdüğü ödeme | hmk m.141 | ıslah ve karşı tarafın açık muvafakati hükümleri saklıdır | metinde geçer |
| medeni-usul | Olay: Aynı alacak için ikinci dava ve tahkim şartı | hmk m.114 | aynı davanın, daha önceden açılmış ve hâlen görülmekte olmaması | metinde geçer |
| medeni-usul | Olay: Aynı alacak için ikinci dava ve tahkim şartı | hmk m.115 | davanın her aşamasında kendiliğinden araştırır | metinde geçer |
| medeni-usul | Olay: Aynı alacak için ikinci dava ve tahkim şartı | hmk m.116 | uyuşmazlığın tahkim yoluyla çözümlenmesi gerektiği itirazı | metinde geçer |
| medeni-usul | Olay: Aynı alacak için ikinci dava ve tahkim şartı | hmk m.117 | ilk itirazların hepsi cevap dilekçesinde ileri sürülmek zorundadır | metinde geçer |
| medeni-usul | Tuzak: Görevsizlik itirazı cevap dilekçesinde yapılmazsa mahkeme görevli hâle gelir. | hmk m.1 | göreve ilişkin kurallar, kamu düzenindendir | metinde geçer |
| medeni-usul | Tuzak: Yetki itirazı ön inceleme duruşmasında da ilk kez ileri sürülebilir. | hmk m.19 | yetki itirazının, cevap dilekçesinde ileri sürülmesi gerekir | metinde geçer |
| medeni-usul | Tuzak: Süresinde cevap vermeyen davalı, davacının iddialarını kabul etmiş sayılır. | hmk m.128 | vakıaların tamamını inkâr etmiş sayılır | metinde geçer |
| medeni-usul | Tuzak: Her sözleşmeye yetki şartı konularak dava belirli bir mahkemeye bağlanabilir. | hmk m.17 | tacirler veya kamu tüzel kişileri | metinde geçer |
| medeni-usul | Tuzak: İstinaf süresi kararın tefhim edildiği duruşmadan başlar. | hmk m.345 | ilamın usulen taraflardan her birine tebliğiyle işlemeye başlar | metinde geçer |
| medeni-usul | Tuzak: İspat yükü her durumda davacıya aittir. | hmk m.190 | kendi lehine hak çıkaran tarafa aittir | metinde geçer |
| medeni-usul | Soru: Malvarlığı haklarına ilişkin bir davada, aksine düzenleme yoksa görevli mahkeme hangisidir? | hmk m.2 | dava konusunun değer ve miktarına bakılmaksızın malvarlığı haklarına ilişkin davalarla | metinde geçer |
| medeni-usul | Soru: Genel yetkili mahkeme hangisidir? | hmk m.6 | davalı gerçek veya tüzel kişinin davanın açıldığı tarihteki yerleşim yeri mahkemesidir | metinde geçer |
| medeni-usul | Soru: Aşağıdakilerden hangisi HMK’ya göre ilk itirazdır? | hmk m.116 | ilk itirazlar aşağıdakilerden ibarettir | metinde geçer |
| medeni-usul | Soru: Cevap dilekçesi için ek süre hangi koşulla verilebilir? | hmk m.127 | bir defaya mahsus olmak ve bir ayı geçmemek üzere ek bir süre verilebilir | metinde geçer |
| medeni-usul | Soru: Dava dilekçesinde davalının adresi eksikse hâkim ne yapar? | hmk m.119 | bir haftalık kesin süre verir | metinde geçer |
| medeni-usul | Soru: Kanuni bir karineye dayanan taraf neyi ispat etmek zorundadır? | hmk m.190 | sadece karinenin temelini oluşturan vakıaya ilişkin ispat yükü altındadır | metinde geçer |
| ceza-genel | Olay: Yumrukla saldırana bıçakla karşılık verme | tck m.25 | saldırı ile orantılı biçimde defetmek zorunluluğu ile işlenen fiillerden dolayı faile ceza verilmez | metinde geçer |
| ceza-genel | Olay: Yumrukla saldırana bıçakla karşılık verme | tck m.27 | mazur görülebilecek bir heyecan, korku veya telaştan ileri gelmiş ise faile ceza verilmez | metinde geçer |
| ceza-genel | Olay: Kilidi kırdıktan sonra kasaya dokunmadan ayrılan fail | tck m.35 | elinde olmayan nedenlerle tamamlayamaz ise teşebbüsten dolayı sorumlu tutulur | metinde geçer |
| ceza-genel | Olay: Kilidi kırdıktan sonra kasaya dokunmadan ayrılan fail | tck m.36 | tamam olan kısım esasen bir suç oluşturduğu takdirde, sadece o suça ait ceza ile cezalandırılır | metinde geçer |
| ceza-genel | Olay: Kilidi kırdıktan sonra kasaya dokunmadan ayrılan fail | tck m.151 | mağdurun şikayeti üzerine | metinde geçer |
| ceza-genel | Olay: Kilidi kırdıktan sonra kasaya dokunmadan ayrılan fail | tck m.116 | açık bir rızaya gerek duyulmaksızın girilmesi mutat olan yerler dışında kalan işyerleri | metinde geçer |
| ceza-genel | Olay: Okul önünde aşırı hızla yayaya çarpan sürücü | tck m.21 | gerçekleşebileceğini öngörmesine rağmen, fiili işlemesi halinde olası kast vardır | metinde geçer |
| ceza-genel | Olay: Okul önünde aşırı hızla yayaya çarpan sürücü | tck m.22 | öngördüğü neticeyi istememesine karşın, neticenin meydana gelmesi halinde bilinçli taksir vardır | metinde geçer |
| ceza-genel | Tuzak: Taksirle işlenen her fiil, kasten işlenen hâlinin cezası indirilerek cezalandırılır. | tck m.22 | taksirle işlenen fiiller, kanunun açıkça belirttiği hallerde cezalandırılır | metinde geçer |
| ceza-genel | Tuzak: Suç ve ceza içeren hükümlerde kanunun amacına uygun kıyas yapılabilir. | tck m.2 | kıyas yapılamaz | metinde geçer |
| ceza-genel | Tuzak: Suç tarihinden sonra yürürlüğe giren kanun her durumda uygulanır. | tck m.7 | failin lehine olan kanun uygulanır | metinde geçer |
| ceza-genel | Tuzak: On iki yaşını doldurmamış çocuk hakkında kovuşturma yapılır, ceza indirilir. | tck m.31 | bu kişiler hakkında, ceza kovuşturması yapılamaz | metinde geçer |
| ceza-genel | Tuzak: Aynı kişiye farklı zamanlarda yapılan kasten yaralamalar zincirleme suç sayılır. | tck m.43 | kasten öldürme, kasten yaralama, işkence ve yağma suçlarında bu madde hükümleri uygulanmaz | metinde geçer |
| ceza-genel | Tuzak: Tek fiille birden fazla farklı suç oluşursa cezalar toplanır. | tck m.44 | en ağır cezayı gerektiren suçtan dolayı cezalandırılır | metinde geçer |
| ceza-genel | Tuzak: Konusu suç olan bir emri yerine getiren memur, emir aldığı için sorumlu olmaz. | tck m.24 | konusu suç teşkil eden emir hiçbir surette yerine getirilemez | metinde geçer |
| ceza-genel | Soru: TCK’ya göre kastın tanımı hangisidir? | tck m.21 | kast, suçun kanuni tanımındaki unsurların bilerek ve istenerek gerçekleştirilmesidir | metinde geçer |
| ceza-genel | Soru: Suçun işlenmesinde kusur yeteneği olmayan birini araç olarak kullanan kişinin durumu nedir? | tck m.37 | kusur yeteneği olmayanları suçun işlenmesinde araç olarak kullanan kişinin cezası | metinde geçer |
| ceza-genel | Soru: Haksız tahrik, müebbet hapis dışındaki hâllerde cezayı nasıl etkiler? | tck m.29 | diğer hallerde verilecek cezanın dörtte birinden dörtte üçüne kadarı indirilir | metinde geçer |
| ceza-genel | Soru: Fiilinin haksızlık oluşturduğu konusunda kaçınılmaz bir hataya düşen kişi hakkında hangisi doğrudur? | tck m.30 | haksızlık oluşturduğu hususunda kaçınılmaz bir hataya düşen kişi, cezalandırılmaz | metinde geçer |
| ceza-genel | Soru: İlgilinin rızası hangi hâlde ceza verilmesini engeller? | tck m.26 | mutlak surette tasarruf edebileceği bir hakkına ilişkin olmak üzere | metinde geçer |
| ceza-genel | Soru: Suç işleme kararını kuvvetlendiren kişi hangi sıfatla sorumludur? | tck m.39 | suç işleme kararını kuvvetlendirmek | metinde geçer |
| icra-iflas | Olay: Faturaya dayanan ilamsız takibe süresinde itiraz | iik m.62 | ödeme emrinin tebliği tarihinden itibaren yedi gün içinde | metinde geçer |
| icra-iflas | Olay: Faturaya dayanan ilamsız takibe süresinde itiraz | iik m.66 | müddeti içinde yapılan itiraz takibi durdurur | metinde geçer |
| icra-iflas | Olay: Faturaya dayanan ilamsız takibe süresinde itiraz | iik m.68 | imzası ikrar veya noterlikçe tasdik edilen borç ikrarını içeren bir senede | metinde geçer |
| icra-iflas | Olay: Faturaya dayanan ilamsız takibe süresinde itiraz | iik m.67 | itirazın tebliği tarihinden itibaren bir sene içinde mahkemeye başvurarak | metinde geçer |
| icra-iflas | Olay: Süresi geçmiş itiraz, ev eşyasının haczi ve menfi tespit | iik m.66 | itiraz müddetinde değilse alacaklının talebi üzerine icra memuru takip muamelelerine alacağın tamamı için devam eder | metinde geçer |
| icra-iflas | Olay: Süresi geçmiş itiraz, ev eşyasının haczi ve menfi tespit | iik m.82 | ailenin ortak kullanımına hizmet eden tüm ev eşyası | metinde geçer |
| icra-iflas | Olay: Süresi geçmiş itiraz, ev eşyasının haczi ve menfi tespit | iik m.16 | şikayet bu muamelelerin öğrenildiği tarihten yedi gün içinde yapılır | metinde geçer |
| icra-iflas | Olay: Süresi geçmiş itiraz, ev eşyasının haczi ve menfi tespit | iik m.72 | icra takibinden sonra açılan menfi tesbit davasında ihtiyati tedbir yolu ile takibin durdurulmasına karar verilemez | metinde geçer |
| icra-iflas | Olay: Bonoya dayanan kambiyo takibinde imza inkârı | iik m.168 | borcun ve takip masraflarının on gün içinde | metinde geçer |
| icra-iflas | Olay: Bonoya dayanan kambiyo takibinde imza inkârı | iik m.168 | bunu beş gün içinde açıkça bir dilekçe ile icra mahkemesine bildirmesi | metinde geçer |
| icra-iflas | Olay: Bonoya dayanan kambiyo takibinde imza inkârı | iik m.170 | bu itiraz satıştan başka icra takip muamelelerini durdurmaz | metinde geçer |
| icra-iflas | Olay: Bonoya dayanan kambiyo takibinde imza inkârı | iik m.170 | alacaklının genel hükümlere göre dava açma hakkı saklıdır | metinde geçer |
| icra-iflas | Tuzak: İlamsız takipte ödeme emrine itiraz süresi on beş gündür. | iik m.62 | ödeme emrinin tebliği tarihinden itibaren yedi gün içinde | metinde geçer |
| icra-iflas | Tuzak: Kambiyo takibinde borca itiraz icra dairesine yapılır ve takibi durdurur. | iik m.169 | bu itiraz satıştan başka icra takip muamelelerini durdurmaz | metinde geçer |
| icra-iflas | Tuzak: Alacaklı elindeki her yazılı belgeyle itirazın kaldırılmasını isteyebilir. | iik m.68 | altı ay içinde itirazın kaldırılmasını isteyebilir | metinde geçer |
| icra-iflas | Tuzak: İcra dairesinin işlemlerine karşı şikâyet süreye bağlı değildir. | iik m.16 | sebepsiz sürüncemede bırakılmasından dolayı her zaman şikayet olunabilir | metinde geçer |
| icra-iflas | Tuzak: Haczedilen malın satışı süre sınırı olmaksızın istenebilir. | iik m.106 | hacizden itibaren bir yıl içinde haczolunan malın satışını isteyebilir | metinde geçer |
| icra-iflas | Tuzak: Takipten sonra açılan menfi tespit davasında teminat karşılığı ihtiyati tedbirle takip durdurulur. | iik m.72 | icra veznesindeki paranın alacaklıya verilmemesini istiyebilir | metinde geçer |
| icra-iflas | Soru: Genel haciz yoluyla ilamsız takipte ödeme emri borçluya ödeme için hangi süreyi verir? | iik m.60 | borcun ve masrafların yedi gün içinde | metinde geçer |
| icra-iflas | Soru: Takibe itiraz edilen alacaklı itirazın iptali davasını hangi süre içinde açmalıdır? | iik m.67 | itirazın tebliği tarihinden itibaren bir sene içinde | metinde geçer |
| icra-iflas | Soru: İlamsız takipte alacaklı haciz talebini en erken ne zaman yapabilir? | iik m.78 | ödeme emrindeki müddet geçtikten ve borçlu itiraz etmiş ise itirazı kaldırıldıktan sonra | metinde geçer |
| icra-iflas | Soru: Borçlunun üçüncü kişideki alacağı haczedildiğinde icra müdürü üçüncü kişiye ne bildirir? | iik m.89 | borcunu ancak icra dairesine ödiyebileceğini | metinde geçer |
| icra-iflas | Soru: Aşağıdakilerden hangisi alacaklıya önceden takibe gerek kalmaksızın iflas isteme imkânı verir? | iik m.177 | borçlu ödemelerini tatil eylemiş bulunursa | metinde geçer |
| miras-hukuku | Olay: Bütün terekeyi derneğe bırakan vasiyetname ve saklı paylar | tmk m.499 | mirasbırakanın altsoyu ile birlikte mirasçı olursa, mirasın dörtte biri | metinde geçer |
| miras-hukuku | Olay: Bütün terekeyi derneğe bırakan vasiyetname ve saklı paylar | tmk m.495 | çocuklar eşit olarak mirasçıdırlar | metinde geçer |
| miras-hukuku | Olay: Bütün terekeyi derneğe bırakan vasiyetname ve saklı paylar | tmk m.506 | altsoy için yasal miras payının yarısı | metinde geçer |
| miras-hukuku | Olay: Bütün terekeyi derneğe bırakan vasiyetname ve saklı paylar | tmk m.506 | altsoy veya ana ve baba zümresiyle birlikte mirasçı olması hâlinde yasal miras payının tamamı | metinde geçer |
| miras-hukuku | Olay: Bütün terekeyi derneğe bırakan vasiyetname ve saklı paylar | tmk m.505 | mirasının saklı paylar dışında kalan kısmında ölüme bağlı tasarrufta bulunabilir | metinde geçer |
| miras-hukuku | Olay: Bütün terekeyi derneğe bırakan vasiyetname ve saklı paylar | tmk m.571 | saklı paylarının zedelendiğini öğrendikleri tarihten başlayarak bir yıl | metinde geçer |
| miras-hukuku | Olay: Bilgisayarda yazılıp imzalanan tarihsiz vasiyetname | tmk m.531 | resmî şekilde veya mirasbırakanın el yazısı ile ya da sözlü olarak yapılabilir | metinde geçer |
| miras-hukuku | Olay: Bilgisayarda yazılıp imzalanan tarihsiz vasiyetname | tmk m.538 | başından sonuna kadar mirasbırakanın el yazısıyla yazılmış ve imzalanmış olması zorunludur | metinde geçer |
| miras-hukuku | Olay: Bilgisayarda yazılıp imzalanan tarihsiz vasiyetname | tmk m.557 | tasarruf kanunda öngörülen şekillere uyulmadan yapılmışsa | metinde geçer |
| miras-hukuku | Olay: Bilgisayarda yazılıp imzalanan tarihsiz vasiyetname | tmk m.559 | iyiniyetli davalılara karşı on yıl | metinde geçer |
| miras-hukuku | Olay: Borçlu ölen babanın mirasını dört ay sonra reddetmek | tmk m.599 | mirasbırakanın borçlarından kişisel olarak sorumlu olurlar | metinde geçer |
| miras-hukuku | Olay: Borçlu ölen babanın mirasını dört ay sonra reddetmek | tmk m.606 | miras, üç ay içinde reddolunabilir | metinde geçer |
| miras-hukuku | Olay: Borçlu ölen babanın mirasını dört ay sonra reddetmek | tmk m.605 | ödemeden aczi açıkça belli veya resmen tespit edilmiş ise, miras reddedilmiş sayılır | metinde geçer |
| miras-hukuku | Tuzak: Sağ kalan eşin yasal payı her durumda mirasın dörtte biridir. | tmk m.499 | bunlar da yoksa mirasın tamamı eşe kalır | metinde geçer |
| miras-hukuku | Tuzak: Kardeşler saklı paylı mirasçıdır. | tmk m.506 | ana ve babadan her biri için yasal miras payının dörtte biri | metinde geçer |
| miras-hukuku | Tuzak: Evlilik dışında doğan çocuk babasına mirasçı olamaz. | tmk m.498 | baba yönünden evlilik içi hısımlar gibi mirasçı olurlar | metinde geçer |
| miras-hukuku | Tuzak: Mirasbırakan saklı paylı mirasçısını dilediği sebeple mirasçılıktan çıkarabilir. | tmk m.510 | aile hukukundan doğan yükümlülüklerini önemli ölçüde yerine getirmemişse | metinde geçer |
| miras-hukuku | Tuzak: Miras sözleşmesi adi yazılı şekilde yapılabilir. | tmk m.545 | resmî vasiyetname şeklinde düzenlenmesi gerekir | metinde geçer |
| miras-hukuku | Tuzak: Mirasçı terekedeki haklara ancak paylaşmadan sonra sahip olur. | tmk m.640 | mirasçılar terekeye elbirliğiyle sahip olurlar | metinde geçer |
| miras-hukuku | Soru: Altsoyu bulunmayan mirasbırakanın yasal mirasçıları kimlerdir? | tmk m.496 | altsoyu bulunmayan mirasbırakanın mirasçıları, ana ve babasıdır | metinde geçer |
| miras-hukuku | Soru: Mirasbırakandan önce ölmüş çocuğun yerini kim alır? | tmk m.495 | her derecede halefiyet yoluyla kendi altsoyları alır | metinde geçer |
| miras-hukuku | Soru: Aşağıdakilerden hangisi kanunda sayılan vasiyet şekillerinden biri değildir? | tmk m.531 | vasiyet, resmî şekilde veya mirasbırakanın el yazısı ile ya da sözlü olarak yapılabilir | metinde geçer |
| miras-hukuku | Soru: Mirasbırakanın saklı pay kurallarını etkisiz kılmak amacıyla yaptığı açık kazandırma hakkında hangisi doğrudur? | tmk m.565 | saklı pay kurallarını etkisiz kılmak amacıyla yaptığı açık olan kazandırmalar | metinde geçer |
| miras-hukuku | Soru: Vasiyetname ile atanmış mirasçı için ret süresi ne zaman işlemeye başlar? | tmk m.606 | mirasbırakanın tasarrufunun kendilerine resmen bildirildiği tarihten işlemeye başlar | metinde geçer |
| miras-hukuku | Soru: Tenkis iddiası, dava süresi geçtikten sonra nasıl ileri sürülebilir? | tmk m.571 | yoluyla her zaman ileri sürülebilir | metinde geçer |
| esya-hukuku | Olay: Harici satışla alınan arsa için tescil talebi | tmk m.705 | taşınmaz mülkiyetinin kazanılması, tescille olur | metinde geçer |
| esya-hukuku | Olay: Harici satışla alınan arsa için tescil talebi | tmk m.706 | resmî şekilde düzenlenmiş bulunmalarına bağlıdır | metinde geçer |
| esya-hukuku | Olay: Harici satışla alınan arsa için tescil talebi | tmk m.716 | mülkiyetin kazanılmasına esas olacak bir hukukî sebebe dayanarak | metinde geçer |
| esya-hukuku | Olay: Harici satışla alınan arsa için tescil talebi | tbk m.77 | zenginleşmenin geçerli olmayan veya gerçekleşmemiş ya da sona ermiş bir sebebe dayanması | metinde geçer |
| esya-hukuku | Olay: Sahte vekâletnameyle satılan daire ve iyiniyetli alıcı | tmk m.1024 | bağlayıcı olmayan bir hukukî işleme dayanan veya hukukî sebepten yoksun bulunan tescil yolsuzdur | metinde geçer |
| esya-hukuku | Olay: Sahte vekâletnameyle satılan daire ve iyiniyetli alıcı | tmk m.1025 | tapu sicilinin düzeltilmesini dava edebilir | metinde geçer |
| esya-hukuku | Olay: Sahte vekâletnameyle satılan daire ve iyiniyetli alıcı | tmk m.1023 | tapu kütüğündeki tescile iyiniyetle dayanarak mülkiyet veya bir başka aynî hak kazanan üçüncü kişinin bu kazanımı korunur | metinde geçer |
| esya-hukuku | Olay: Sahte vekâletnameyle satılan daire ve iyiniyetli alıcı | tmk m.3 | asıl olan iyiniyetin varlığıdır | metinde geçer |
| esya-hukuku | Olay: Sahte vekâletnameyle satılan daire ve iyiniyetli alıcı | tmk m.1007 | tapu sicilinin tutulmasından doğan bütün zararlardan devlet sorumludur | metinde geçer |
| esya-hukuku | Olay: Tamirciye bırakılan dizüstü bilgisayar ile çalınan bisiklet | tmk m.763 | taşınır mülkiyetinin nakli için zilyetliğin devri gerekir | metinde geçer |
| esya-hukuku | Olay: Tamirciye bırakılan dizüstü bilgisayar ile çalınan bisiklet | tmk m.988 | emin sıfatıyla zilyedinden o şey üzerinde iyiniyetle mülkiyet | metinde geçer |
| esya-hukuku | Olay: Tamirciye bırakılan dizüstü bilgisayar ile çalınan bisiklet | tmk m.989 | ancak ödenen bedelin geri verilmesi koşuluyla açılabilir | metinde geçer |
| esya-hukuku | Tuzak: Taşınmaz mülkiyeti her durumda tapuya tescil anında kazanılır. | tmk m.705 | mülkiyet tescilden önce kazanılır | metinde geçer |
| esya-hukuku | Tuzak: Tapuda kayıtlı olmayan taşınmazı on yıl zilyetlikte bulunduran kişi tescil isteyebilir. | tmk m.713 | davasız ve aralıksız olarak yirmi yıl süreyle ve malik sıfatıyla | metinde geçer |
| esya-hukuku | Tuzak: Taşınırda kazandırıcı zamanaşımı süresi on yıldır. | tmk m.777 | davasız ve aralıksız beş yıl iyiniyetle ve malik sıfatıyla | metinde geçer |
| esya-hukuku | Tuzak: Zilyet, malını almaya çalışana karşı kuvvet kullanamaz, yalnız dava açabilir. | tmk m.981 | her türlü gasp veya saldırıyı kuvvet kullanarak defedebilir | metinde geçer |
| esya-hukuku | Tuzak: Komşuya her türlü gürültü ve koku yasaktır. | tmk m.737 | hoş görülebilecek dereceyi aşan | metinde geçer |
| esya-hukuku | Tuzak: Bütünleyici parça asıl şeyden ayrı olarak başka birinin mülkiyetinde kalabilir. | tmk m.684 | bütünleyici parçalarına da malik olur | metinde geçer |
| esya-hukuku | Soru: Malik, malını haksız olarak elinde bulunduran kişiye karşı hangi davayı açar? | tmk m.683 | istihkak davası açabileceği gibi | metinde geçer |
| esya-hukuku | Soru: TMK’ya göre zilyet kimdir? | tmk m.973 | bir şey üzerinde fiilî hâkimiyeti bulunan kimse onun zilyedidir | metinde geçer |
| esya-hukuku | Soru: Tapu sicilindeki bir kaydı bilmediğini ileri süren kişi hakkında hangisi doğrudur? | tmk m.1020 | kimse tapu sicilindeki bir kaydı bilmediğini ileri süremez | metinde geçer |
| esya-hukuku | Soru: Başkasının zilyetliğindeki şeyi gasbeden kişi, üstün hakkı olduğunu ileri sürerse ne olur? | tmk m.982 | o şey üzerinde üstün bir hakka sahip olduğunu iddia etse bile onu geri vermekle yükümlüdür | metinde geçer |
| esya-hukuku | Soru: Taşınmazı miras yoluyla kazanan mirasçı tescili nasıl yaptırır? | tmk m.716 | tescili doğrudan doğruya yaptırabilir | metinde geçer |
| is-hukuku | Olay: Savunma alınmadan performans gerekçesiyle fesih | is-kanunu m.18 | otuz veya daha fazla işçi çalıştıran işyerlerinde en az altı aylık kıdemi olan işçinin | metinde geçer |
| is-hukuku | Olay: Savunma alınmadan performans gerekçesiyle fesih | is-kanunu m.19 | fesih sebebini açık ve kesin bir şekilde belirtmek zorundadır | metinde geçer |
| is-hukuku | Olay: Savunma alınmadan performans gerekçesiyle fesih | is-kanunu m.20 | fesih bildiriminin tebliği tarihinden itibaren bir ay içinde işe iade talebiyle | metinde geçer |
| is-hukuku | Olay: Savunma alınmadan performans gerekçesiyle fesih | is-kanunu m.21 | en az dört aylık ve en çok sekiz aylık ücreti tutarında tazminat | metinde geçer |
| is-hukuku | Olay: Kasadan para alan işçinin geç feshedilen sözleşmesi | is-kanunu m.25 | işverenin güvenini kötüye kullanmak, hırsızlık yapmak | metinde geçer |
| is-hukuku | Olay: Kasadan para alan işçinin geç feshedilen sözleşmesi | is-kanunu m.26 | diğer tarafın öğrendiği günden başlayarak altı iş günü geçtikten | metinde geçer |
| is-hukuku | Olay: Kasadan para alan işçinin geç feshedilen sözleşmesi | is-kanunu m.26 | işçinin olayda maddi çıkar sağlaması halinde bir yıllık süre uygulanmaz | metinde geçer |
| is-hukuku | Olay: Kasadan para alan işçinin geç feshedilen sözleşmesi | is-kanunu m.17 | işi üç yıldan fazla sürmüş işçi için, bildirim yapılmasından başlayarak sekiz hafta sonra | metinde geçer |
| is-hukuku | Olay: Kasadan para alan işçinin geç feshedilen sözleşmesi | is-kanunu-1475 m.14 | her geçen tam yıl için işverence işçiye 30 günlük ücreti tutarında kıdem tazminatı ödenir | metinde geçer |
| is-hukuku | Olay: Ödenmeyen ücret ve fazla çalışma | is-kanunu m.34 | ücreti ödeme gününden itibaren yirmi gün içinde mücbir bir neden dışında ödenmeyen işçi | metinde geçer |
| is-hukuku | Olay: Ödenmeyen ücret ve fazla çalışma | is-kanunu m.41 | normal çalışma ücretinin saat başına düşen miktarının yüzde elli yükseltilmesi suretiyle ödenir | metinde geçer |
| is-hukuku | Olay: Ödenmeyen ücret ve fazla çalışma | is-kanunu m.24 | işçinin ücreti kanun hükümleri veya sözleşme şartlarına uygun olarak hesap edilmez veya ödenmezse | metinde geçer |
| is-hukuku | Tuzak: İşe iade davası fesihten sonra doğrudan iş mahkemesinde açılır. | is-kanunu m.20 | arabulucuya başvurmak zorundadır | metinde geçer |
| is-hukuku | Tuzak: Her işyerinde çalışan her işçi iş güvencesinden yararlanır. | is-kanunu m.18 | belirsiz süreli iş sözleşmesini fesheden işveren | metinde geçer |
| is-hukuku | Tuzak: İki yıllık belirli süreli iş sözleşmesi sözlü yapılabilir. | is-kanunu m.8 | süresi bir yıl ve daha fazla olan iş sözleşmelerinin yazılı şekilde yapılması zorunludur | metinde geçer |
| is-hukuku | Tuzak: Haftalık normal çalışma süresi en çok kırk sekiz saattir. | is-kanunu m.63 | genel bakımdan çalışma süresi haftada en çok kırkbeş saattir | metinde geçer |
| is-hukuku | Tuzak: İşçi yıllık ücretli izin hakkından yazılı olarak vazgeçebilir. | is-kanunu m.53 | yıllık ücretli izin hakkından vazgeçilemez | metinde geçer |
| is-hukuku | Tuzak: Fazla çalışmanın her saati normal ücretin yüzde yirmi beş fazlasıyla ödenir. | is-kanunu m.41 | yüzde elli yükseltilmesi suretiyle ödenir | metinde geçer |
| is-hukuku | Soru: Kıdemi bir buçuk yıldan üç yıla kadar olan işçinin belirsiz süreli sözleşmesi bildirimden kaç hafta sonra sona erer? | is-kanunu m.17 | işi birbuçuk yıldan üç yıla kadar sürmüş olan işçi için, bildirimin diğer tarafa yapılmasından başlayarak altı hafta sonra | metinde geçer |
| is-hukuku | Soru: Feshin geçersizliğine karar verilen işçiyi işveren işe başlatmazsa ödeyeceği tazminat ne kadardır? | is-kanunu m.21 | en az dört aylık ve en çok sekiz aylık ücreti tutarında tazminat | metinde geçer |
| is-hukuku | Soru: Ahlak ve iyiniyet kurallarına aykırılığa dayanan derhal fesih hakkı hangi süre geçince kullanılamaz? | is-kanunu m.26 | her halde fiilin gerçekleşmesinden itibaren bir yıl sonra kullanılamaz | metinde geçer |
| is-hukuku | Soru: Hizmet süresi üç yıl olan işçinin yıllık ücretli izni en az kaç gündür? | is-kanunu m.53 | bir yıldan beş yıla kadar (beş yıl dahil) olanlara ondört günden | metinde geçer |
| is-hukuku | Soru: İş Kanunu’na göre işçi kimdir? | is-kanunu m.2 | bir iş sözleşmesine dayanarak çalışan gerçek kişiye işçi | metinde geçer |
| ticari-isletme | Olay: Tacirler arasında mesajla yapılan temerrüt ihtarı | ttk m.12 | bir ticari işletmeyi, kısmen de olsa, kendi adına işleten kişiye tacir denir | metinde geçer |
| ticari-isletme | Olay: Tacirler arasında mesajla yapılan temerrüt ihtarı | ttk m.18 | noter aracılığıyla, taahhütlü mektupla, telgrafla veya güvenli elektronik imza kullanılarak kayıtlı elektronik posta sistemi ile yapılır | metinde geçer |
| ticari-isletme | Olay: Tacirler arasında mesajla yapılan temerrüt ihtarı | tbk m.117 | muaccel bir borcun borçlusu, alacaklının ihtarıyla temerrüde düşer | metinde geçer |
| ticari-isletme | Olay: Tacirler arasında mesajla yapılan temerrüt ihtarı | ttk m.4 | her iki tarafın da ticari işletmesiyle ilgili hususlardan doğan hukuk davaları | metinde geçer |
| ticari-isletme | Olay: Tek başına çalışan tacirin şirket izlenimi veren unvanı | ttk m.40 | ticari işletmenin açıldığı günden itibaren onbeş gün içinde | metinde geçer |
| ticari-isletme | Olay: Tek başına çalışan tacirin şirket izlenimi veren unvanı | ttk m.41 | kısaltılmadan yazılacak adı ve soyadından oluşur | metinde geçer |
| ticari-isletme | Olay: Tek başına çalışan tacirin şirket izlenimi veren unvanı | ttk m.46 | bir şirketin var olduğu izlenimini uyandıracak ekler yapamazlar | metinde geçer |
| ticari-isletme | Olay: Tek başına çalışan tacirin şirket izlenimi veren unvanı | ttk m.50 | usulen tescil ve ilan edilmiş olan ticaret unvanını kullanma hakkı sadece sahibine aittir | metinde geçer |
| ticari-isletme | Olay: Tacir yüklenicinin yüksek gecikme cezasına itirazı | ttk m.18 | basiretli bir iş adamı gibi hareket etmesi gerekir | metinde geçer |
| ticari-isletme | Olay: Tacir yüklenicinin yüksek gecikme cezasına itirazı | ttk m.22 | ücret veya sözleşme cezasının indirilmesini mahkemeden isteyemez | metinde geçer |
| ticari-isletme | Olay: Tacir yüklenicinin yüksek gecikme cezasına itirazı | ttk m.15 | tacirlere özgü 20 ve 53 üncü maddeler | metinde geçer |
| ticari-isletme | Tuzak: Tacir sayılmak için işletmenin fiilen faaliyete geçmesi şarttır. | ttk m.12 | fiilen işletmeye başlamamış olsa bile tacir sayılır | metinde geçer |
| ticari-isletme | Tuzak: Esnaf da tacir hükümlerine tâbidir. | ttk m.15 | ekonomik faaliyeti sermayesinden fazla bedenî çalışmasına dayanan | metinde geçer |
| ticari-isletme | Tuzak: Ticari işletme devredilirken her malvarlığı unsuru ayrı ayrı devredilmek zorundadır. | ttk m.11 | ayrı ayrı yapılmasına gerek olmaksızın bir bütün hâlinde devredilebilir | metinde geçer |
| ticari-isletme | Tuzak: Tacirler arasında temerrüt ihtarı e-postayla da yapılabilir. | ttk m.18 | diğer tarafı temerrüde düşürmeye, sözleşmeyi feshe, sözleşmeden dönmeye ilişkin ihbarlar veya ihtarlar | metinde geçer |
| ticari-isletme | Tuzak: Tacirin yaptığı her işlem ticari iştir ve aksi ispat edilemez. | ttk m.19 | işlemi yaptığı anda bunun ticari işletmesiyle ilgili olmadığını diğer tarafa açıkça bildirdiği | metinde geçer |
| ticari-isletme | Tuzak: Tacir, ticari işletmesini açtıktan sonra bir ay içinde tescil ettirir. | ttk m.40 | onbeş gün içinde | metinde geçer |
| ticari-isletme | Soru: Aşağıdakilerden hangisi kanunen tacir sayılır? | ttk m.16 | ticaret şirketleriyle | metinde geçer |
| ticari-isletme | Soru: Taraflardan yalnız biri için ticari iş niteliğinde olan sözleşme, kanunda aksine hüküm yoksa diğer taraf için nasıl sayılır? | ttk m.19 | diğeri için de ticari iş sayılır | metinde geçer |
| ticari-isletme | Soru: Ticari işletmesiyle ilgili bir iş gören tacirin ücret hakkı hakkında hangisi doğrudur? | ttk m.20 | tacir olan veya olmayan bir kişiye | metinde geçer |
| ticari-isletme | Soru: Ticari davalarda görevli mahkeme hangisidir? | ttk m.5 | dava olunan şeyin değerine veya tutarına bakılmaksızın asliye ticaret mahkemesi tüm ticari davalar | metinde geçer |
| ticari-isletme | Soru: “Türk” veya “Türkiye” kelimesi bir ticaret unvanına nasıl konabilir? | ttk m.46 | bir ticaret unvanına ancak cumhurbaşkanı kararıyla konabilir | metinde geçer |
| ticaret-sirketler | Olay: Tescilden önce şirket adına kiralanan depo | ttk m.339 | bütün kurucuların imzalarının noterce onaylanması | metinde geçer |
| ticaret-sirketler | Olay: Tescilden önce şirket adına kiralanan depo | ttk m.355 | şirket ticaret siciline tescil ile tüzel kişilik kazanır | metinde geçer |
| ticaret-sirketler | Olay: Tescilden önce şirket adına kiralanan depo | ttk m.355 | üç aylık süre içinde bu taahhütler şirket tarafından kabul olunmuşsa, yalnız şirket sorumlu olur | metinde geçer |
| ticaret-sirketler | Olay: Genel kurul kararına geç açılan iptal davası ve bilgi alma hakkı | ttk m.445 | karar tarihinden itibaren üç ay içinde | metinde geçer |
| ticaret-sirketler | Olay: Genel kurul kararına geç açılan iptal davası ve bilgi alma hakkı | ttk m.446 | karara olumsuz oy veren ve bu muhalefetini tutanağa geçirten | metinde geçer |
| ticaret-sirketler | Olay: Genel kurul kararına geç açılan iptal davası ve bilgi alma hakkı | ttk m.447 | bilgi alma, inceleme ve denetleme haklarını, kanunen izin verilen ölçü dışında sınırlandıran | metinde geçer |
| ticaret-sirketler | Olay: Adi yazılı sözleşmeyle devredilen limited şirket payı | ttk m.595 | yazılı şekilde yapılır ve tarafların imzaları noterce onanır | metinde geçer |
| ticaret-sirketler | Olay: Adi yazılı sözleşmeyle devredilen limited şirket payı | ttk m.595 | devir bu onayla geçerli olur | metinde geçer |
| ticaret-sirketler | Olay: Adi yazılı sözleşmeyle devredilen limited şirket payı | ttk m.616 | esas sermaye paylarının devirlerinin onaylanması | metinde geçer |
| ticaret-sirketler | Olay: Adi yazılı sözleşmeyle devredilen limited şirket payı | tbk m.77 | haklı bir sebep olmaksızın, bir başkasının malvarlığından veya emeğinden zenginleşen | metinde geçer |
| ticaret-sirketler | Tuzak: Adi ortaklık bir ticaret şirketidir. | ttk m.124 | kollektif, komandit, anonim, limited ve kooperatif şirketlerden ibarettir | metinde geçer |
| ticaret-sirketler | Tuzak: Anonim şirket pay sahibi şirket borçlarından alacaklılara karşı kişisel olarak sorumludur. | ttk m.329 | sadece taahhüt etmiş oldukları sermaye payları ile ve şirkete karşı sorumludur | metinde geçer |
| ticaret-sirketler | Tuzak: Limited şirket ortakları şirket borçlarından sınırsız sorumludur. | ttk m.573 | ortaklar, şirket borçlarından sorumlu olmayıp | metinde geçer |
| ticaret-sirketler | Tuzak: Yönetim kurulu üyesi toplantıya vekil göndererek oy kullanabilir. | ttk m.390 | toplantılara vekil aracılığıyla da katılamazlar | metinde geçer |
| ticaret-sirketler | Tuzak: Genel kurul yönetim kurulu üyelerinin seçimini yönetim kuruluna bırakabilir. | ttk m.408 | yönetim kurulu üyelerinin seçimi | metinde geçer |
| ticaret-sirketler | Tuzak: Genel kurul kararlarının iptali davası bir yıl içinde açılır. | ttk m.445 | karar tarihinden itibaren üç ay içinde | metinde geçer |
| ticaret-sirketler | Soru: TTK’ya göre aşağıdakilerden hangisi sermaye şirketidir? | ttk m.124 | anonim, limited ve sermayesi paylara bölünmüş komandit şirket sermaye şirketi sayılır | metinde geçer |
| ticaret-sirketler | Soru: Anonim şirket tüzel kişiliği ne zaman kazanır? | ttk m.355 | şirket ticaret siciline tescil ile tüzel kişilik kazanır | metinde geçer |
| ticaret-sirketler | Soru: Esas sözleşmede ağırlaştırıcı hüküm yoksa anonim şirket yönetim kurulu nasıl toplanır ve karar alır? | ttk m.390 | üye tam sayısının çoğunluğu ile toplanır ve kararlarını toplantıda hazır bulunan üyelerin çoğunluğu ile alır | metinde geçer |
| ticaret-sirketler | Soru: Limited şirkette yönetim ve temsil hakkında hangisi doğrudur? | ttk m.623 | en azından bir ortağın, şirketi yönetim hakkının ve temsil yetkisinin bulunması gerekir | metinde geçer |
| ticaret-sirketler | Soru: Yönetim kurulunda oyların eşit çıkması hâlinde ne olur? | ttk m.390 | ikinci toplantıda da eşitlik olursa söz konusu öneri reddedilmiş sayılır | metinde geçer |
| idare-hukuku | Olay: Park alanı için belediyenin arsa kamulaştırması | kamulastirma m.5 | belediye yararına kamulaştırmalarda belediye encümeni | metinde geçer |
| idare-hukuku | Olay: Park alanı için belediyenin arsa kamulaştırması | belediye m.34 | kamulaştırma kararlarını almak ve uygulamak | metinde geçer |
| idare-hukuku | Olay: Park alanı için belediyenin arsa kamulaştırması | kamulastirma m.8 | satın alma usulünü öncelikle uygulamaları esastır | metinde geçer |
| idare-hukuku | Olay: Park alanı için belediyenin arsa kamulaştırması | kamulastirma m.10 | taşınmaz malın bulunduğu yer asliye hukuk mahkemesine müracaat eder | metinde geçer |
| idare-hukuku | Olay: Park alanı için belediyenin arsa kamulaştırması | kamulastirma m.14 | otuz gün içinde, kamulaştırma işlemine karşı idari yargıda iptal | metinde geçer |
| idare-hukuku | Olay: Park alanı için belediyenin arsa kamulaştırması | kamulastirma m.25 | mülkiyetin idareye geçmesi, mahkemece verilen tescil kararı ile olur | metinde geçer |
| idare-hukuku | Olay: Kamulaştırılıp boş bırakılan taşınmazın geri istenmesi | kamulastirma m.23 | kamulaştırma bedelinin kesinleşmesi tarihinden itibaren beş yıl içinde | metinde geçer |
| idare-hukuku | Olay: Kamulaştırılıp boş bırakılan taşınmazın geri istenmesi | kamulastirma m.23 | doğmasından itibaren bir yıl içinde kullanılmayan geri alma hakkı düşer | metinde geçer |
| idare-hukuku | Olay: Kamulaştırılıp boş bırakılan taşınmazın geri istenmesi | kamulastirma m.23 | idareden herhangi bir sebeple hak, bedel veya tazminat talebinde bulunulama | metinde geçer |
| idare-hukuku | Olay: Ruhsatsız kat ilavesi ve belediyenin yaptırımları | imar m.21 | yapı ruhsatiyesi alınması mecburidir | metinde geçer |
| idare-hukuku | Olay: Ruhsatsız kat ilavesi ve belediyenin yaptırımları | imar m.21 | iç ve dış sıva, boya, badana | metinde geçer |
| idare-hukuku | Olay: Ruhsatsız kat ilavesi ve belediyenin yaptırımları | imar m.32 | yapı mühürlenerek inşaat derhal durdurulur | metinde geçer |
| idare-hukuku | Olay: Ruhsatsız kat ilavesi ve belediyenin yaptırımları | imar m.32 | belediye encümeni veya il idare kurulu kararını müteakip, belediye veya valilikçe yıktırılır | metinde geçer |
| idare-hukuku | Olay: Ruhsatsız kat ilavesi ve belediyenin yaptırımları | imar m.42 | tespit edildiği tarihten itibaren on iş günü içinde ilgili idare encümenince | metinde geçer |
| idare-hukuku | Tuzak: İdare kamulaştırmada uzlaşma aramadan doğrudan mahkemeye başvurabilir. | kamulastirma m.8 | satın alma usulünü öncelikle uygulamaları esastır | metinde geçer |
| idare-hukuku | Tuzak: Kamulaştırılan taşınmazın mülkiyeti bedelin bankaya yatırılmasıyla idareye geçer. | kamulastirma m.25 | mahkemece verilen tescil kararı ile olur | metinde geçer |
| idare-hukuku | Tuzak: Belediyede kamulaştırma kararını belediye meclisi alır. | belediye m.34 | yıllık çalışma programına alınan işlerle ilgili kamulaştırma kararlarını almak | metinde geçer |
| idare-hukuku | Tuzak: Belediye meclisi kararları başkanın onayıyla kesinleşir; başkan onaylamazsa karar hüküm doğurmaz. | belediye m.23 | belediye başkanı, meclisin ısrarı ile kesinleşen kararlar aleyhine on gün içinde idarî yargıya başvurabilir | metinde geçer |
| idare-hukuku | Tuzak: Çatı onarımı ve kiremit aktarılması yapı ruhsatı gerektirir. | imar m.21 | çatı onarımı ve kiremit aktarılması | metinde geçer |
| idare-hukuku | Tuzak: Geri alma hakkı kamulaştırmadan sonra süresiz olarak kullanılabilir. | kamulastirma m.23 | doğmasından itibaren bir yıl içinde kullanılmayan geri alma hakkı düşer | metinde geçer |
| idare-hukuku | Soru: Belediye yararına yapılacak kamulaştırmada kamu yararı kararını hangi merci verir? | kamulastirma m.5 | belediye yararına kamulaştırmalarda belediye encümeni | metinde geçer |
| idare-hukuku | Soru: Belediyenin imar planlarını görüşmek ve onaylamak hangi organın görevidir? | belediye m.18 | belediyenin imar plânlarını görüşmek ve onaylamak | metinde geçer |
| idare-hukuku | Soru: Belediyeyi yargı yerlerinde davacı veya davalı olarak kim temsil eder? | belediye m.38 | davacı veya davalı olarak da yargı yerlerinde temsil etmek | metinde geçer |
| idare-hukuku | Soru: Ruhsatsız başlanan yapı mühürlendikten sonra yapı sahibine ruhsat almak için ne kadar süre tanınır? | imar m.32 | bu tarihten itibaren en çok bir ay içinde yapı sahibi | metinde geçer |
| idare-hukuku | Soru: Kamulaştırma işlemine karşı malikin iptal davası açma süresi ne zaman başlar? | kamulastirma m.14 | 10 uncu madde gereğince mahkemece yapılan tebligat gününden | metinde geçer |
| idare-hukuku | Soru: Belediyenin yetkileri arasında hangisi yer alır? | belediye m.15 | kanunların belediyeye verdiği yetki çerçevesinde yönetmelik çıkarmak | metinde geçer |

Toplam 235 dayanak, 235 kanun metninde doğrulandı.
