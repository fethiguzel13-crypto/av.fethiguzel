# G23 — Kanonik katman dayanak denetimi (halüsinasyon denetimi)

Üretim: `node scripts/ders-kanonik-olc.mjs --dayanak` (2026-10-15, `c74889b89`), dalga 2'nin on dersine süzülmüştür. Her satır,
katmandaki bir örnek olay, tuzak ya da test sorusunun dayandığı maddeyi ve o maddenin depodaki kanun metninde
(`content/mevzuat/<kanun>/madde-<n>.md`, `### Akademik` başlığından önceki kısım) aynen aranan ifadeyi gösterir. Aynı denetim
`lib/__tests__/ders-kanonik-katman.test.mjs` içinde her kalite kapısında yinelenir.

Ek denetim: Katman düzyazısındaki 200 kanun maddesi göndermesinin (TMK 48, TTK 35, CMK 22, TBK 20, HUAK 20, VUK 20, TKHK 19,
TCK 15, GVK 1) tamamı depoda var olan bir madde dosyasına gider. Katmanda içtihat künyesi, yüksek mahkeme adı ve doktrin yazarı
yoktur (testte düzenli ifadeyle engellenir). Kaynak olarak gösterilen mevzuat.gov.tr PDF adresleri 2026-10-15 15:30 civarında
denetlenememiştir, zira site bu makineden 30 ve 60 sn'lik iki denemede yanıt vermemiştir. Adres denetimi G25'te yinelenir.

| Ders | Kalem | Dayanak | İfade (kanun metninde aranan) | Sonuç |
|---|---|---|---|---|
| aile-hukuku | Olay: Düğünden iki hafta önce bozulan nişan ve geri istenen altın takı | tmk m.119 | Nişanlılık, evlenmeye zorlamak için dava hakkı vermez | metinde geçer |
| aile-hukuku | Olay: Düğünden iki hafta önce bozulan nişan ve geri istenen altın takı | tmk m.120 | aynı koşullar altında yaptıkları harcamalar için uygun bir tazminat isteyebilirler | metinde geçer |
| aile-hukuku | Olay: Düğünden iki hafta önce bozulan nişan ve geri istenen altın takı | tmk m.121 | kişilik hakkı saldırıya uğrayan taraf | metinde geçer |
| aile-hukuku | Olay: Düğünden iki hafta önce bozulan nişan ve geri istenen altın takı | tmk m.122 | alışılmışın dışındaki hediyeler, verenler tarafından geri istenebilir | metinde geçer |
| aile-hukuku | Olay: Düğünden iki hafta önce bozulan nişan ve geri istenen altın takı | tmk m.123 | sona ermenin üzerinden bir yıl geçmekle zamanaşımına uğrar | metinde geçer |
| aile-hukuku | Olay: Kredili daire, miras arsa ve kira geliri: katılma alacağının hesabı | tmk m.202 | Eşler arasında edinilmiş mallara katılma rejiminin uygulanması asıldır | metinde geçer |
| aile-hukuku | Olay: Kredili daire, miras arsa ve kira geliri: katılma alacağının hesabı | tmk m.225 | mal rejimi dava tarihinden geçerli olmak üzere sona erer | metinde geçer |
| aile-hukuku | Olay: Kredili daire, miras arsa ve kira geliri: katılma alacağının hesabı | tmk m.220 | sonradan miras yoluyla ya da herhangi bir şekilde karşılıksız kazanma yoluyla | metinde geçer |
| aile-hukuku | Olay: Kredili daire, miras arsa ve kira geliri: katılma alacağının hesabı | tmk m.222 | Bir eşin bütün malları, aksi ispat edilinceye kadar edinilmiş mal kabul edilir | metinde geçer |
| aile-hukuku | Olay: Kredili daire, miras arsa ve kira geliri: katılma alacağının hesabı | tmk m.219 | Kişisel mallarının gelirleri | metinde geçer |
| aile-hukuku | Olay: Kredili daire, miras arsa ve kira geliri: katılma alacağının hesabı | tmk m.231 | bu mallara ilişkin borçlar çıkarıldıktan sonra kalan miktardır | metinde geçer |
| aile-hukuku | Olay: Kredili daire, miras arsa ve kira geliri: katılma alacağının hesabı | tmk m.236 | diğer eşe ait artık değerin yarısı üzerinde hak sahibi olurlar. Alacaklar takas edilir | metinde geçer |
| aile-hukuku | Olay: Ortak konutu terk eden eş ve ihtarın takvimi | tmk m.164 | ayrılık, en az altı ay sürmüş ve bu durum devam etmekte | metinde geçer |
| aile-hukuku | Olay: Ortak konutu terk eden eş ve ihtarın takvimi | tmk m.164 | belirli sürenin dördüncü ayı bitmedikçe ihtar isteminde bulunulamaz | metinde geçer |
| aile-hukuku | Olay: Ortak konutu terk eden eş ve ihtarın takvimi | tmk m.164 | ihtardan sonra iki ay geçmedikçe dava açılamaz | metinde geçer |
| aile-hukuku | Olay: Ortak konutu terk eden eş ve ihtarın takvimi | tmk m.164 | ortak konutu terk etmeye zorlayan | metinde geçer |
| aile-hukuku | Olay: Boşanmadan sonra doğan çocuk, soybağının reddi ve babalık davası | tmk m.285 | evliliğin sona ermesinden başlayarak üçyüz gün içinde doğan çocuğun babası kocadır | metinde geçer |
| aile-hukuku | Olay: Boşanmadan sonra doğan çocuk, soybağının reddi ve babalık davası | tmk m.286 | soybağının reddi davasını açarak babalık karinesini çürütebilir | metinde geçer |
| aile-hukuku | Olay: Boşanmadan sonra doğan çocuk, soybağının reddi ve babalık davası | tmk m.289 | doğumu ve baba olmadığını | metinde geçer |
| aile-hukuku | Olay: Boşanmadan sonra doğan çocuk, soybağının reddi ve babalık davası | tmk m.303 | bir yıllık süre bu ilişkinin ortadan kalktığı tarihte işlemeye başlar | metinde geçer |
| aile-hukuku | Olay: Boşanmadan sonra doğan çocuk, soybağının reddi ve babalık davası | tmk m.301 | Dava babaya, baba ölmüşse mirasçılarına karşı açılır | metinde geçer |
| aile-hukuku | Tuzak: Mutlak butlanla batıl bir evlilik baştan hiç doğmamış sayılır. | tmk m.156 | hâkimin kararına kadar geçerli bir evliliğin bütün sonuçlarını doğurur | metinde geçer |
| aile-hukuku | Tuzak: Yoksulluk nafakası ancak kusurlu eşten istenebilir. | tmk m.175 | Nafaka yükümlüsünün kusuru aranmaz | metinde geçer |
| aile-hukuku | Tuzak: Mal rejimi boşanma kararının kesinleştiği gün sona erer. | tmk m.225 | dava tarihinden geçerli olmak üzere sona erer | metinde geçer |
| aile-hukuku | Tuzak: Evliliğin süresi ne olursa olsun eşler anlaşmalı boşanabilir. | tmk m.166 | Evlilik en az bir yıl sürmüş ise | metinde geçer |
| aile-hukuku | Tuzak: Manevî tazminat da nafaka gibi aylık irat olarak ödetilebilir. | tmk m.176 | Manevî tazminatın irat biçiminde ödenmesine karar verilemez | metinde geçer |
| aile-hukuku | Tuzak: Aile konutu kendi adına kayıtlı olan eş onu dilediği gibi satabilir. | tmk m.194 | diğer eşin açık rızası bulunmadıkça | metinde geçer |
| aile-hukuku | Tuzak: Zina sebebiyle boşanma davası süresiz açılabilir. | tmk m.161 | Affeden tarafın dava hakkı yoktur | metinde geçer |
| aile-hukuku | Soru: Olağan durumda evlenebilmek için kaç yaşın doldurulması gerekir? | tmk m.124 | onyedi yaşını doldurmadıkça evlenemez | metinde geçer |
| aile-hukuku | Soru: Devam eden bir evliliğin mutlak butlanı davasını re’sen kim açar? | tmk m.146 | Mutlak butlan davası, Cumhuriyet savcısı tarafından re'sen açılır | metinde geçer |
| aile-hukuku | Soru: Eşlerden birine sonradan miras yoluyla kalan taşınmaz hangi mal grubundadır? | tmk m.220 | Aşağıda sayılanlar, kanun gereğince kişisel maldır | metinde geçer |
| aile-hukuku | Soru: Eşin mal rejiminin sona ermesinden önceki bir yıl içinde rızası alınmadan yaptığı olağan dışı bağış tasfiyede nasıl değerlendirilir? | tmk m.229 | edinilmiş mallara değer olarak eklenir | metinde geçer |
| aile-hukuku | Soru: Evliliğin boşanma sebebiyle sona ermesinden doğan dava hakları ne kadar sürede zamanaşımına uğrar? | tmk m.178 | boşanma hükmünün kesinleşmesinin üzerinden bir yıl geçmekle zamanaşımına uğrar | metinde geçer |
| aile-hukuku | Soru: Boşanma davasında tarafların boşanma sebebine ilişkin ikrarı hakkında hangisi doğrudur? | tmk m.184 | Tarafların bu konudaki her türlü ikrarları hâkimi bağlamaz | metinde geçer |
| borclar-ozel | Olay: İkinci el otomobilde teslimden üç ay sonra ortaya çıkan şanzıman arızası | tbk m.219 | Satıcı, bu ayıpların varlığını bilmese bile onlardan sorumludur | metinde geçer |
| borclar-ozel | Olay: İkinci el otomobilde teslimden üç ay sonra ortaya çıkan şanzıman arızası | tbk m.223 | olağan bir gözden geçirmeyle ortaya çıkarılamayacak bir ayıp | metinde geçer |
| borclar-ozel | Olay: İkinci el otomobilde teslimden üç ay sonra ortaya çıkan şanzıman arızası | tbk m.227 | aşağıdaki seçimlik haklardan birini kullanabilir | metinde geçer |
| borclar-ozel | Olay: İkinci el otomobilde teslimden üç ay sonra ortaya çıkan şanzıman arızası | tbk m.231 | satılanın alıcıya devrinden başlayarak iki yıl geçmekle zamanaşımına uğrar | metinde geçer |
| borclar-ozel | Olay: Süre bitti diye tahliye, yüzde altmış artış ve ödenmeyen bir aylık kira | tbk m.347 | Kiraya veren, sözleşme süresinin bitimine dayanarak sözleşmeyi sona erdiremez | metinde geçer |
| borclar-ozel | Olay: Süre bitti diye tahliye, yüzde altmış artış ve ödenmeyen bir aylık kira | tbk m.344 | oniki aylık ortalamalara göre değişim oranını geçmemek koşuluyla geçerlidir | metinde geçer |
| borclar-ozel | Olay: Süre bitti diye tahliye, yüzde altmış artış ve ödenmeyen bir aylık kira | tbk m.315 | konut ve çatılı işyeri kiralarında ise en az otuz gündür | metinde geçer |
| borclar-ozel | Olay: Tarihi el yazısıyla yazılmamış ve eşin rızası alınmamış kefalet | tbk m.583 | kefalet sözleşmesinde kendi el yazısıyla belirtmesi şarttır | metinde geçer |
| borclar-ozel | Olay: Tarihi el yazısıyla yazılmamış ve eşin rızası alınmamış kefalet | tbk m.584 | ancak diğerinin yazılı rızasıyla kefil olabilir | metinde geçer |
| borclar-ozel | Olay: Tarihi el yazısıyla yazılmamış ve eşin rızası alınmamış kefalet | tbk m.586 | borçlunun, ifada gecikmesi ve ihtarın sonuçsuz kalması | metinde geçer |
| borclar-ozel | Olay: Teslimden üç yıl sonra su sızdıran teras çatı | tbk m.477 | gecikmeksizin durumu yükleniciye bildirmek zorundadır | metinde geçer |
| borclar-ozel | Olay: Teslimden üç yıl sonra su sızdıran teras çatı | tbk m.475 | sökülüp kaldırılması aşırı zarar doğuracaksa işsahibi, sözleşmeden dönme hakkını kullanamaz | metinde geçer |
| borclar-ozel | Olay: Teslimden üç yıl sonra su sızdıran teras çatı | tbk m.478 | taşınmaz yapılarda ise beş yılın | metinde geçer |
| borclar-ozel | Tuzak: Ayıbı bilmeyen satıcı ayıptan sorumlu tutulamaz. | tbk m.219 | bilmese bile onlardan sorumludur | metinde geçer |
| borclar-ozel | Tuzak: Taşınmaz satış vaadi noterde düzenlenmese de yazılı yapılmışsa geçerlidir. | tbk m.237 | resmî şekilde düzenlenmedikçe geçerli olmaz | metinde geçer |
| borclar-ozel | Tuzak: Bağışlama sözü sözlü olarak da geçerli biçimde verilebilir. | tbk m.288 | bu sözleşmenin yazılı şekilde yapılmasına bağlıdır | metinde geçer |
| borclar-ozel | Tuzak: Henüz edinilmemiş bir haktan karşılıksız feragat bağışlamadır. | tbk m.285 | Henüz edinilmemiş olan bir haktan feragat etmek veya bir mirası reddetmek, bağışlama değildir | metinde geçer |
| borclar-ozel | Tuzak: Vekâlet sözleşmesi ancak haklı sebeple sona erdirilebilir. | tbk m.512 | her zaman sözleşmeyi tek taraflı olarak sona erdirebilir | metinde geçer |
| borclar-ozel | Tuzak: Satılanda alıcının sözleşme anında bildiği ayıplar için de satıcı sorumludur. | tbk m.222 | alıcı tarafından bilinen ayıplardan sorumlu değildir | metinde geçer |
| borclar-ozel | Tuzak: Ağır kusurlu satıcı da sözleşmedeki sorumsuzluk kaydına dayanabilir. | tbk m.221 | sınırlayan her anlaşma kesin olarak hükümsüzdür | metinde geçer |
| borclar-ozel | Soru: Satılanın ayıbından doğan dava, satıcı daha uzun süre üstlenmemişse ne zaman zamanaşımına uğrar? | tbk m.231 | satılandaki ayıp daha sonra ortaya çıksa bile | metinde geçer |
| borclar-ozel | Soru: Belirli süreli konut kirasında kiracı, sözleşmenin uzamasını önlemek için en geç ne zaman bildirimde bulunmalıdır? | tbk m.347 | süresinin bitiminden en az onbeş gün önce bildirimde bulunmadıkça | metinde geçer |
| borclar-ozel | Soru: Taşınmaz yapılardaki ayıp sebebiyle yükleniciye karşı açılacak dava, ağır kusur yoksa ne zaman zamanaşımına uğrar? | tbk m.478 | teslim tarihinden başlayarak | metinde geçer |
| borclar-ozel | Soru: Kefalet sözleşmesinin geçerliliği için aşağıdakilerden hangisi yeterli değildir? | tbk m.583 | yazılı şekilde yapılmadıkça ve kefilin sorumlu olacağı azamî miktar ile kefalet tarihi belirtilmedikçe geçerli olmaz | metinde geçer |
| borclar-ozel | Soru: Vekil hangi durumda ücrete hak kazanır? | tbk m.502 | Sözleşme veya teamül varsa vekil, ücrete hak kazanır | metinde geçer |
| borclar-ozel | Soru: Adi kefalette alacaklı, borçluya başvurmadan kefile hangi durumda doğrudan gidebilir? | tbk m.585 | Borçlunun iflasına karar verilmesi | metinde geçer |
| medeni-baslangic | Olay: On altı yaşındaki Efe: taksitli telefon, teyzeden dizüstü bilgisayar ve kırılan cam | tmk m.11 | Erginlik onsekiz yaşın doldurulmasıyla başlar | metinde geçer |
| medeni-baslangic | Olay: On altı yaşındaki Efe: taksitli telefon, teyzeden dizüstü bilgisayar ve kırılan cam | tmk m.14 | küçüklerin ve kısıtlıların fiil ehliyeti yoktur | metinde geçer |
| medeni-baslangic | Olay: On altı yaşındaki Efe: taksitli telefon, teyzeden dizüstü bilgisayar ve kırılan cam | tmk m.16 | Karşılıksız kazanmada ve kişiye sıkı sıkıya bağlı hakları kullanmada bu rıza gerekli değildir | metinde geçer |
| medeni-baslangic | Olay: On altı yaşındaki Efe: taksitli telefon, teyzeden dizüstü bilgisayar ve kırılan cam | tmk m.16 | haksız fiillerinden sorumludurlar | metinde geçer |
| medeni-baslangic | Olay: Haber sitesinde fotoğrafla yayımlanan asılsız iddia | tmk m.24 | saldırıda bulunanlara karşı korunmasını isteyebilir | metinde geçer |
| medeni-baslangic | Olay: Haber sitesinde fotoğrafla yayımlanan asılsız iddia | tmk m.24 | daha üstün nitelikte özel veya kamusal yarar | metinde geçer |
| medeni-baslangic | Olay: Haber sitesinde fotoğrafla yayımlanan asılsız iddia | tmk m.6 | hakkını dayandırdığı olguların varlığını ispatla yükümlüdür | metinde geçer |
| medeni-baslangic | Olay: Haber sitesinde fotoğrafla yayımlanan asılsız iddia | tmk m.25 | sürmekte olan saldırıya son verilmesini | metinde geçer |
| medeni-baslangic | Olay: Haber sitesinde fotoğrafla yayımlanan asılsız iddia | tmk m.25 | kendi yerleşim yeri veya davalının yerleşim yeri mahkemesinde dava açabilir | metinde geçer |
| medeni-baslangic | Olay: Fırtınada batan teknede kaybolan balıkçı | tmk m.31 | cesedi bulunamamış olsa bile gerçekten ölmüş sayılır | metinde geçer |
| medeni-baslangic | Olay: Fırtınada batan teknede kaybolan balıkçı | tmk m.32 | kişinin Türkiye'deki son yerleşim yeri | metinde geçer |
| medeni-baslangic | Olay: Fırtınada batan teknede kaybolan balıkçı | tmk m.33 | ölüm tehlikesinin üzerinden en az bir yıl | metinde geçer |
| medeni-baslangic | Olay: Fırtınada batan teknede kaybolan balıkçı | tmk m.35 | son haberin alındığı günden başlayarak hüküm doğurur | metinde geçer |
| medeni-baslangic | Olay: Çevresinde başka adla tanınan kişinin ad değiştirme istemi | tmk m.27 | ancak haklı sebeplere dayanılarak hâkimden istenebilir | metinde geçer |
| medeni-baslangic | Olay: Çevresinde başka adla tanınan kişinin ad değiştirme istemi | tmk m.4 | hâkim, hukuka ve hakkaniyete göre karar verir | metinde geçer |
| medeni-baslangic | Olay: Çevresinde başka adla tanınan kişinin ad değiştirme istemi | tmk m.27 | Ad değişmekle kişisel durum değişmez | metinde geçer |
| medeni-baslangic | Tuzak: Kanunda hüküm yoksa hâkim doğrudan hakkaniyete göre karar verir. | tmk m.1 | hâkim, örf ve âdet hukukuna göre | metinde geçer |
| medeni-baslangic | Tuzak: İyiniyet iddia eden kişi iyiniyetini ispat etmek zorundadır. | tmk m.3 | asıl olan iyiniyetin varlığıdır | metinde geçer |
| medeni-baslangic | Tuzak: Bir kişinin aynı anda iki yerleşim yeri olabilir. | tmk m.19 | aynı zamanda birden çok yerleşim yeri olamaz | metinde geçer |
| medeni-baslangic | Tuzak: Küçük on altı yaşında kendi başvurusuyla ergin kılınabilir. | tmk m.12 | kendi isteği ve velisinin rızasıyla mahkemece ergin kılınabilir | metinde geçer |
| medeni-baslangic | Tuzak: Ana rahmindeki çocuğun hiçbir hak ehliyeti yoktur. | tmk m.28 | sağ doğmak koşuluyla, ana rahmine düştüğü andan başlayarak | metinde geçer |
| medeni-baslangic | Tuzak: Kayın hısımlığı, onu doğuran evlilik boşanmayla sona erince kalkar. | tmk m.18 | evliliğin sona ermesiyle ortadan kalkmaz | metinde geçer |
| medeni-baslangic | Tuzak: Manevî tazminat istemi her durumda mirasçılara geçer. | tmk m.25 | miras bırakan tarafından ileri sürülmüş olmadıkça mirasçılara geçmez | metinde geçer |
| medeni-baslangic | Soru: Kanuna göre erginlik hangi yaşın doldurulmasıyla başlar? | tmk m.11 | Evlenme kişiyi ergin kılar | metinde geçer |
| medeni-baslangic | Soru: Birden fazla kişiden hangisinin önce öldüğü ispat edilemezse ne olur? | tmk m.29 | hepsi aynı anda ölmüş sayılır | metinde geçer |
| medeni-baslangic | Soru: Uzun zamandan beri haber alınamayan kişinin gaipliği, son haberden en az ne kadar süre sonra istenebilir? | tmk m.33 | son haber tarihinin üzerinden en az beş yıl | metinde geçer |
| medeni-baslangic | Soru: Resmî sicil kaydının içeriğinin doğru olmadığı hangi yolla ispat edilebilir? | tmk m.7 | her hangi bir şekle bağlı değildir | metinde geçer |
| medeni-baslangic | Soru: Kanunun hâkime takdir yetkisi tanıdığı konularda hâkim neye göre karar verir? | tmk m.4 | durumun gereklerini ya da haklı sebepleri | metinde geçer |
| medeni-baslangic | Soru: Kişi hak ve fiil ehliyetinden sözleşmeyle kısmen vazgeçebilir mi? | tmk m.23 | Kimse, hak ve fiil ehliyetlerinden kısmen de olsa vazgeçemez | metinde geçer |
| kiymetli-evrak | Olay: Biri vadesiz, öteki tarihsiz iki senet | ttk m.776 | Düzenlenme tarihini ve yerini | metinde geçer |
| kiymetli-evrak | Olay: Biri vadesiz, öteki tarihsiz iki senet | ttk m.777 | unsurlardan birini içermeyen bir senet bono sayılmaz | metinde geçer |
| kiymetli-evrak | Olay: Biri vadesiz, öteki tarihsiz iki senet | ttk m.777 | görüldüğünde ödenmesi şart olan bir bono sayılır | metinde geçer |
| kiymetli-evrak | Olay: Biri vadesiz, öteki tarihsiz iki senet | ttk m.777 | senedin düzenlendiği yer, ödeme yeri | metinde geçer |
| kiymetli-evrak | Olay: Ayıplı mal için verilen bononun iyiniyetli üçüncü kişiye cirosu | ttk m.778 | Poliçelerin cirosuna ilişkin 681 ilâ 690 | metinde geçer |
| kiymetli-evrak | Olay: Ayıplı mal için verilen bononun iyiniyetli üçüncü kişiye cirosu | ttk m.681 | ciro ve zilyetliğin geçirilmesi yoluyla devredilebilir | metinde geçer |
| kiymetli-evrak | Olay: Ayıplı mal için verilen bononun iyiniyetli üçüncü kişiye cirosu | ttk m.686 | müteselsil ve birbirine bağlı cirolardan anlaşıldığı takdirde, yetkili hamil sayılır | metinde geçer |
| kiymetli-evrak | Olay: Ayıplı mal için verilen bononun iyiniyetli üçüncü kişiye cirosu | ttk m.687 | bile bile borçlunun zararına hareket etmiş olsun | metinde geçer |
| kiymetli-evrak | Olay: Üzerine bir ay sonrasının tarihi yazılan çek | ttk m.795 | Düzenlenme günü olarak gösterilen günden önce ödenmek için ibraz olunan çek, ibraz günü ödenir | metinde geçer |
| kiymetli-evrak | Olay: Üzerine bir ay sonrasının tarihi yazılan çek | ttk m.796 | çekte yazılı olan düzenlenme tarihinin ertesi günü başlar | metinde geçer |
| kiymetli-evrak | Olay: Üzerine bir ay sonrasının tarihi yazılan çek | ttk m.808 | Zamanında ibraz edilmiş olan çekin ödenmemiş olduğu | metinde geçer |
| kiymetli-evrak | Olay: Üzerine bir ay sonrasının tarihi yazılan çek | ttk m.732 | onun zararına zenginleşmiş olabilecekleri kadar borçlu kalırlar | metinde geçer |
| kiymetli-evrak | Olay: On yedi yaşındaki düzenleyen ve bonoya aval veren arkadaşı | ttk m.778 | Avale ilişkin 700 ilâ 702 nci maddeler de bonolar hakkında uygulanır | metinde geçer |
| kiymetli-evrak | Olay: On yedi yaşındaki düzenleyen ve bonoya aval veren arkadaşı | ttk m.701 | aval veren kişi tarafından imzalanır | metinde geçer |
| kiymetli-evrak | Olay: On yedi yaşındaki düzenleyen ve bonoya aval veren arkadaşı | ttk m.778 | bonoyu düzenleyen kimse hesabına verilmiş sayılır | metinde geçer |
| kiymetli-evrak | Olay: On yedi yaşındaki düzenleyen ve bonoya aval veren arkadaşı | ttk m.702 | şekle ait noksandan başka bir sebepten dolayı batıl olsa da aval verenin taahhüdü geçerlidir | metinde geçer |
| kiymetli-evrak | Tuzak: Açıkça emre yazılı olmayan poliçe ciro edilemez. | ttk m.681 | Her poliçe açıkça emre yazılı olmasa da | metinde geçer |
| kiymetli-evrak | Tuzak: Kıymetli evrakın borçlusu, senet kendisine verilmeden de ödemeye zorlanabilir. | ttk m.646 | ancak senedin teslimi karşılığında ödeme ile yükümlüdür | metinde geçer |
| kiymetli-evrak | Tuzak: Çeke yazılan vade kaydı geçerlidir ve çek o tarihten önce ödenmez. | ttk m.795 | Buna aykırı herhangi bir kayıt yazılmamış hükmündedir | metinde geçer |
| kiymetli-evrak | Tuzak: Tahsil cirosuyla senedi alan hamil onu tam ciroyla başkasına devredebilir. | ttk m.688 | o poliçeyi ancak tahsil cirosu ile tekrar ciro edebilir | metinde geçer |
| kiymetli-evrak | Tuzak: Nama yazılı senet de emre yazılı senet gibi ciroyla devredilir. | ttk m.647 | nama yazılı senetlerde yazılı bir devir beyanına da gerek vardır | metinde geçer |
| kiymetli-evrak | Tuzak: Açık bırakılan senedin anlaşmaya aykırı doldurulması her hamile karşı ileri sürülebilir. | ttk m.680 | bu anlaşmalara uyulmadığı iddiası, hamile karşı ileri sürülemez | metinde geçer |
| kiymetli-evrak | Soru: Kıymetli evrakı diğer senetlerden ayıran özellik nedir? | ttk m.645 | senetten ayrı olarak ileri sürülemediği gibi başkalarına da devredilemez | metinde geçer |
| kiymetli-evrak | Soru: Aşağıdakilerden hangisi bononun zorunlu unsurlarından biri değildir? | ttk m.776 | Kayıtsız ve şartsız belirli bir bedeli ödemek vaadini | metinde geçer |
| kiymetli-evrak | Soru: Düzenlendiği yerde ödenecek bir çek hangi süre içinde muhataba ibraz edilmelidir? | ttk m.796 | düzenlendiği yerde ödenecekse on gün | metinde geçer |
| kiymetli-evrak | Soru: Poliçeyi kabul edene karşı poliçeden doğan istemler ne zaman zamanaşımına uğrar? | ttk m.749 | vadenin geldiği tarihten itibaren üç yıl geçmekle zamanaşımına uğrar | metinde geçer |
| kiymetli-evrak | Soru: Kimin için verildiği belirtilmeyen poliçe avali kimin için verilmiş sayılır? | ttk m.701 | Kimin için verildiği belirtilmemişse aval, düzenleyici için verilmiş sayılır | metinde geçer |
| kiymetli-evrak | Soru: Hamilin çek borçlularına karşı başvurma hakları ne zaman zamanaşımına uğrar? | ttk m.814 | ibraz süresinin bitiminden itibaren üç yıl geçmekle zamanaşımına uğrar | metinde geçer |
| sigorta-hukuku | Olay: Değerinin yarısına sigortalanan ev ve komşudan çıkan yangın | ttk m.1462 | sigorta bedelinin sigorta değerine olan oranına göre tazminat öder | metinde geçer |
| sigorta-hukuku | Olay: Değerinin yarısına sigortalanan ev ve komşudan çıkan yangın | ttk m.1446 | durumu gecikmeksizin sigortacıya bildirir | metinde geçer |
| sigorta-hukuku | Olay: Değerinin yarısına sigortalanan ev ve komşudan çıkan yangın | ttk m.1472 | tazmin ettiği bedel kadar, sigortacıya intikal eder | metinde geçer |
| sigorta-hukuku | Olay: Değerinin yarısına sigortalanan ev ve komşudan çıkan yangın | ttk m.1472 | kalan kısımdan dolayı sorumlulara karşı sahip olduğu başvurma hakkını korur | metinde geçer |
| sigorta-hukuku | Olay: Konut diye sigortalanan binanın zemin katındaki restoran mutfağı | ttk m.1435 | aksi ispat edilinceye kadar önemli sayılır | metinde geçer |
| sigorta-hukuku | Olay: Konut diye sigortalanan binanın zemin katındaki restoran mutfağı | ttk m.1436 | sunulan listede yer alan sorular dışında kalan hususlara ilişkin | metinde geçer |
| sigorta-hukuku | Olay: Konut diye sigortalanan binanın zemin katındaki restoran mutfağı | ttk m.1439 | sigortacının tazminat veya bedel ödeme borcu ortadan kalkar | metinde geçer |
| sigorta-hukuku | Olay: İlk primi ödenmeden çalınan otomobil | ttk m.1421 | sigortacının sorumluluğu primin veya ilk taksidinin ödenmesi ile başlar | metinde geçer |
| sigorta-hukuku | Olay: İlk primi ödenmeden çalınan otomobil | ttk m.1434 | sözleşmeden üç ay içinde cayabilir | metinde geçer |
| sigorta-hukuku | Olay: İlk primi ödenmeden çalınan otomobil | ttk m.1434 | dava veya takip yoluyla istenmemiş olması hâlinde, sözleşmeden cayılmış olunur | metinde geçer |
| sigorta-hukuku | Olay: Eşinin hayatı üzerine izinsiz yapılan ölüm sigortası | ttk m.1490 | o kişinin hayatının devamında lehtarın menfaatinin bulunması şarttır | metinde geçer |
| sigorta-hukuku | Olay: Eşinin hayatı üzerine izinsiz yapılan ölüm sigortası | ttk m.1490 | İzin olmadan yapılan sözleşme, icazet verilmediği takdirde geçersizdir | metinde geçer |
| sigorta-hukuku | Tuzak: Sigortalının ihmaliyle gerçekleşen riziko teminat dışındadır. | ttk m.1429 | ihmallerinden kaynaklanan zararları tazmin ile yükümlüdür | metinde geçer |
| sigorta-hukuku | Tuzak: Sigortacı tazminatı geç öderse temerrüt için ayrıca ihtar gerekir. | ttk m.1427 | sigortacı ihtara gerek kalmaksızın temerrüde düşer | metinde geçer |
| sigorta-hukuku | Tuzak: Rizikonun geç ihbar edilmesi sigortacıyı tazminat borcundan tamamen kurtarır. | ttk m.1446 | kusurun ağırlığına göre, tazminattan veya bedelden indirim yoluna gidilir | metinde geçer |
| sigorta-hukuku | Tuzak: Sigorta ettiren önemli saymadığı bir hususu bildirmemişse sigortacı cayamaz. | ttk m.1439 | sigorta ettiren tarafından önemli sayılmaması durumu değiştirmez | metinde geçer |
| sigorta-hukuku | Tuzak: Aşkın sigortada sözleşme her durumda bütünüyle geçersizdir. | ttk m.1463 | aşan kısım geçersizdir | metinde geçer |
| sigorta-hukuku | Tuzak: Sigortacı tazminatı ancak aynen, yani onarım ya da yenileme yoluyla öder. | ttk m.1427 | Aynen tazmine ilişkin sözleşme yoksa sigorta tazminatı nakden ödenir | metinde geçer |
| sigorta-hukuku | Soru: Sigorta tazminatına ilişkin istemler, rizikonun gerçekleşmesinden itibaren en geç ne zaman zamanaşımına uğrar? | ttk m.1420 | rizikonun gerçekleştiği tarihten itibaren altı yıl geçmekle zamanaşımına uğrar | metinde geçer |
| sigorta-hukuku | Soru: Zarar sigortasında tazminat, rizikonun ihbarından en geç kaç gün sonra muaccel olur? | ttk m.1427 | ihbardan kırkbeş gün sonra muaccel olur | metinde geçer |
| sigorta-hukuku | Soru: İzleyen primlerden biri ödenmezse sigortacı sigorta ettirene kaç günlük süre vererek ihtarda bulunur? | ttk m.1434 | on günlük süre vererek borcunu yerine getirmesini | metinde geçer |
| sigorta-hukuku | Soru: Sigortacı tazminatı ödediğinde sorumlu üçüncü kişiye karşı hangi sıfatla başvurur? | ttk m.1472 | Sigortacı, sigorta tazminatını ödediğinde, hukuken sigortalının yerine geçer | metinde geçer |
| sigorta-hukuku | Soru: Sigorta ettirenin bilgisi dışında riziko ağırlaşmışsa bunu sigortacıya en geç ne zaman bildirmelidir? | ttk m.1444 | öğrendiği tarihten itibaren en geç on gün içinde | metinde geçer |
| sigorta-hukuku | Soru: Beyan yükümlülüğünün ihlalini öğrenen sigortacı caymayı hangi süre içinde bildirmelidir? | ttk m.1440 | Cayma, onbeş gün içinde sigorta ettirene bildirilir | metinde geçer |
| ceza-ozel | Olay: Düğünde kullanıp geri vermek üzere alınan fotoğraf makinesi | tck m.141 | Zilyedinin rızası olmadan başkasına ait taşınır bir malı | metinde geçer |
| ceza-ozel | Olay: Düğünde kullanıp geri vermek üzere alınan fotoğraf makinesi | tck m.146 | malın geçici bir süre kullanılıp zilyedine iade edilmek üzere işlenmesi halinde | metinde geçer |
| ceza-ozel | Olay: Düğünde kullanıp geri vermek üzere alınan fotoğraf makinesi | tck m.146 | malın suç işlemek için kullanılmış olması halinde bu hüküm uygulanmaz | metinde geçer |
| ceza-ozel | Olay: Depozitosunu geri almak için ev sahibini iten kiracı | tck m.148 | bir malı teslime veya malın alınmasına karşı koymamaya mecbur kılan kişi | metinde geçer |
| ceza-ozel | Olay: Depozitosunu geri almak için ev sahibini iten kiracı | tck m.150 | ancak tehdit veya kasten yaralama suçuna ilişkin hükümler uygulanır | metinde geçer |
| ceza-ozel | Olay: Depozitosunu geri almak için ev sahibini iten kiracı | tck m.86 | basit bir tıbbî müdahaleyle giderilebilecek ölçüde hafif olması hâlinde, mağdurun şikâyeti üzerine | metinde geçer |
| ceza-ozel | Olay: Babasının cüzdanından ve ağabeyinin evinden alınan para | tck m.167 | Yağma ve nitelikli yağma hariç | metinde geçer |
| ceza-ozel | Olay: Babasının cüzdanından ve ağabeyinin evinden alınan para | tck m.167 | ilgili akraba hakkında cezaya hükmolunmaz | metinde geçer |
| ceza-ozel | Olay: Babasının cüzdanından ve ağabeyinin evinden alınan para | tck m.167 | aynı konutta beraber yaşamayan kardeşlerden birinin | metinde geçer |
| ceza-ozel | Olay: Onarım için bırakılan bilgisayarı satan tamirci | tck m.141 | Zilyedinin rızası olmadan | metinde geçer |
| ceza-ozel | Olay: Onarım için bırakılan bilgisayarı satan tamirci | tck m.155 | zilyedliğin devri amacı dışında tasarrufta bulunan | metinde geçer |
| ceza-ozel | Olay: Onarım için bırakılan bilgisayarı satan tamirci | tck m.155 | ticaret veya hizmet ilişkisinin | metinde geçer |
| ceza-ozel | Tuzak: Kasten yaralamanın her türü şikâyete bağlıdır. | tck m.86 | basit bir tıbbî müdahaleyle giderilebilecek ölçüde hafif olması hâlinde, mağdurun şikâyeti üzerine | metinde geçer |
| ceza-ozel | Tuzak: Taksirle yaralama istisnasız şikâyete bağlıdır. | tck m.89 | suçun bilinçli taksirle işlenmesi halinde şikâyet aranmaz | metinde geçer |
| ceza-ozel | Tuzak: Mağdurun bulunmadığı ortamda söylenen her hakaret sözü cezalandırılır. | tck m.125 | fiilin en az üç kişiyle ihtilat ederek işlenmesi gerekir | metinde geçer |
| ceza-ozel | Tuzak: Kasten yaralamaya tepki olarak hakaret eden kişinin cezası yalnız indirilebilir. | tck m.129 | kasten yaralama suçuna tepki olarak işlenmesi halinde, kişiye ceza verilmez | metinde geçer |
| ceza-ozel | Tuzak: Bayıltılan mağdurun malını alan kişi cebir kullanmadığından hırsızlıktan sorumludur. | tck m.148 | kendisini bilmeyecek ve savunamayacak hale getirilmesi de, yağma suçunda cebir sayılır | metinde geçer |
| ceza-ozel | Tuzak: Kovuşturma başladıktan sonra zararı gideren faile etkin pişmanlık indirimi uygulanmaz. | tck m.168 | hüküm verilmezden önce gösterilmesi halinde, verilecek cezanın yarısına kadarı indirilir | metinde geçer |
| ceza-ozel | Tuzak: Konutu ortak kullanan kişilerden birinin rızası, girişi her durumda hukuka uygun kılar. | tck m.116 | rıza açıklamasının meşru bir amaca yönelik olması gerekir | metinde geçer |
| ceza-ozel | Soru: Bir insanı kasten öldüren kişiye temel hâlde hangi ceza verilir? | tck m.81 | Bir insanı kasten öldüren kişi, müebbet hapis cezası ile cezalandırılır | metinde geçer |
| ceza-ozel | Soru: Hırsızlık gece vakti işlenirse ceza hangi oranda artırılır? | tck m.143 | gece vakti işlenmesi halinde, verilecek ceza yarı oranında artırılır | metinde geçer |
| ceza-ozel | Soru: Hırsızlıkta zarar kovuşturma başlamadan önce tamamen giderilirse ceza en çok ne kadar indirilir? | tck m.168 | verilecek cezanın üçte ikisine kadarı indirilir | metinde geçer |
| ceza-ozel | Soru: Zarar kısmen giderilmişse etkin pişmanlık hükümlerinin uygulanması için ayrıca ne aranır? | tck m.168 | ayrıca mağdurun rızası aranır | metinde geçer |
| ceza-ozel | Soru: Kasten yaralama mağdurun yüzünde sabit ize neden olmuşsa temel cezaya ne olur? | tck m.87 | belirlenen ceza, bir kat artırılır | metinde geçer |
| ceza-ozel | Soru: Yağma suçunun konusu olan malın değeri az ise ceza ne ölçüde indirilebilir? | tck m.150 | verilecek ceza üçte birden yarıya kadar indirilebilir | metinde geçer |
| ceza-muhakemesi | Olay: Otuz iki saat sonra hâkim önüne çıkarılan şüpheli | cmk m.91 | yakalama anından itibaren yirmidört saati geçemez | metinde geçer |
| ceza-muhakemesi | Olay: Otuz iki saat sonra hâkim önüne çıkarılan şüpheli | cmk m.91 | Toplu olarak işlenen suçlarda | metinde geçer |
| ceza-muhakemesi | Olay: Otuz iki saat sonra hâkim önüne çıkarılan şüpheli | cmk m.141 | Kanunî gözaltı süresi içinde hâkim önüne çıkarılmayan | metinde geçer |
| ceza-muhakemesi | Olay: Serbest bırakılma vaadiyle alınan ikrar | cmk m.148 | Kanuna aykırı bir yarar vaat edilemez | metinde geçer |
| ceza-muhakemesi | Olay: Serbest bırakılma vaadiyle alınan ikrar | cmk m.148 | rıza ile verilmiş olsa da delil olarak değerlendirilemez | metinde geçer |
| ceza-muhakemesi | Olay: Serbest bırakılma vaadiyle alınan ikrar | cmk m.148 | Müdafi hazır bulunmaksızın kollukça alınan ifade | metinde geçer |
| ceza-muhakemesi | Olay: Serbest bırakılma vaadiyle alınan ikrar | cmk m.223 | Yüklenen suçun sanık tarafından işlendiğinin sabit olmaması | metinde geçer |
| ceza-muhakemesi | Olay: Katalog suç şüphelisi için tutuklama istemi | cmk m.100 | ölçülü olmaması halinde, tutuklama kararı verilemez | metinde geçer |
| ceza-muhakemesi | Olay: Katalog suç şüphelisi için tutuklama istemi | cmk m.100 | tutuklama nedeni var sayılabilir | metinde geçer |
| ceza-muhakemesi | Olay: Katalog suç şüphelisi için tutuklama istemi | cmk m.101 | adlî kontrol uygulamasının yetersiz kalacağını belirten hukukî ve fiilî nedenlere yer verilir | metinde geçer |
| ceza-muhakemesi | Olay: Katalog suç şüphelisi için tutuklama istemi | cmk m.109 | şüphelinin tutuklanması yerine adlî kontrol altına alınmasına karar verilebilir | metinde geçer |
| ceza-muhakemesi | Olay: Uzlaştırma yapılmadan düzenlenen iddianame | cmk m.253 | Şikâyete bağlı olup olmadığına bakılmaksızın | metinde geçer |
| ceza-muhakemesi | Olay: Uzlaştırma yapılmadan düzenlenen iddianame | cmk m.253 | Güveni kötüye kullanma (üçüncü fıkra hariç, madde 155) | metinde geçer |
| ceza-muhakemesi | Olay: Uzlaştırma yapılmadan düzenlenen iddianame | tck m.155 | zilyedliğin devri amacı dışında tasarrufta bulunan | metinde geçer |
| ceza-muhakemesi | Olay: Uzlaştırma yapılmadan düzenlenen iddianame | cmk m.174 | uzlaştırma ya da seri muhakeme usulü uygulanmaksızın düzenlenen | metinde geçer |
| ceza-muhakemesi | Olay: Uzlaştırma yapılmadan düzenlenen iddianame | cmk m.174 | Suçun hukukî nitelendirilmesi sebebiyle iddianame iade edilemez | metinde geçer |
| ceza-muhakemesi | Olay: Uzlaştırma yapılmadan düzenlenen iddianame | cmk m.174 | iade edilmeyen iddianame kabul edilmiş sayılır | metinde geçer |
| ceza-muhakemesi | Tuzak: Hâkim dosyadaki her belgeye dayanarak hüküm kurabilir. | cmk m.217 | duruşmaya getirilmiş ve huzurunda tartışılmış delillere | metinde geçer |
| ceza-muhakemesi | Tuzak: Cumhuriyet savcısı yalnız şüphelinin aleyhine olan delilleri toplar. | cmk m.160 | şüphelinin lehine ve aleyhine olan delilleri toplayarak | metinde geçer |
| ceza-muhakemesi | Tuzak: Kovuşturmaya yer olmadığı kararından sonra aynı fiil için her zaman yeniden dava açılabilir. | cmk m.172 | aynı fiilden dolayı kamu davası açılamaz | metinde geçer |
| ceza-muhakemesi | Tuzak: Çocuk şüpheliye müdafi ancak kendisi isterse atanır. | cmk m.150 | istemi aranmaksızın bir müdafi görevlendirilir | metinde geçer |
| ceza-muhakemesi | Tuzak: Tutuklama istemi reddedilen şüpheli, itiraz sonuçlanıncaya kadar gözaltında tutulur. | cmk m.101 | Tutuklama kararı verilmezse, şüpheli veya sanık derhâl serbest bırakılır | metinde geçer |
| ceza-muhakemesi | Tuzak: Delil yetersizse beraat kararı verilemez, dosya yeni delil gelene kadar bekletilir. | cmk m.223 | Yüklenen suçun sanık tarafından işlendiğinin sabit olmaması | metinde geçer |
| ceza-muhakemesi | Soru: Bireysel suçta gözaltı süresi, hâkime gönderilme için zorunlu süre hariç, en çok ne kadardır? | cmk m.91 | yakalama anından itibaren yirmidört saati geçemez | metinde geçer |
| ceza-muhakemesi | Soru: Ağır ceza mahkemesinin görevine girmeyen işlerde tutukluluk süresi, uzatma hariç, en çok ne kadardır? | cmk m.102 | Ağır ceza mahkemesinin görevine girmeyen işlerde tutukluluk süresi en çok bir yıldır | metinde geçer |
| ceza-muhakemesi | Soru: İstinaf istemi, hükmün gerekçesiyle birlikte tebliğinden itibaren hangi süre içinde yapılır? | cmk m.273 | tebliğ edildiği tarihten itibaren iki hafta içinde | metinde geçer |
| ceza-muhakemesi | Soru: Kamu davasının açılmasının ertelenmesine karar verilirse erteleme süresi ne kadardır? | cmk m.171 | beş yıl süre ile ertelenmesine karar verebilir | metinde geçer |
| ceza-muhakemesi | Soru: Aşağıdakilerden hangisinde temyizde hukuka kesin aykırılık var sayılır? | cmk m.289 | Hükmün 230 uncu madde gereğince gerekçeyi içermemesi | metinde geçer |
| ceza-muhakemesi | Soru: Hâkim veya mahkeme kararına karşı itiraz, kanunda ayrık hüküm yoksa hangi süre içinde yapılır? | cmk m.268 | kararı öğrendiği günden itibaren iki hafta içinde | metinde geçer |
| tuketici-hukuku | Olay: Dördüncü ayda arızalanan çamaşır makinesi | tkhk m.10 | Teslim tarihinden itibaren altı ay içinde ortaya çıkan ayıpların, teslim tarihinde var olduğu kabul edilir | metinde geçer |
| tuketici-hukuku | Olay: Dördüncü ayda arızalanan çamaşır makinesi | tkhk m.11 | İmkân varsa, satılanın ayıpsız bir misli ile değiştirilmesini isteme | metinde geçer |
| tuketici-hukuku | Olay: Dördüncü ayda arızalanan çamaşır makinesi | tkhk m.11 | satıcı, üretici ve ithalatçı müteselsilen sorumludur | metinde geçer |
| tuketici-hukuku | Olay: Dördüncü ayda arızalanan çamaşır makinesi | tkhk m.11 | azami otuz iş günü | metinde geçer |
| tuketici-hukuku | Olay: Cayma hakkı bildirilmeden satılan masa lambası | tkhk m.48 | on dört gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir | metinde geçer |
| tuketici-hukuku | Olay: Cayma hakkı bildirilmeden satılan masa lambası | tkhk m.48 | cayma hakkı konusunda tüketicinin bilgilendirildiğini ispat etmekle yükümlüdür | metinde geçer |
| tuketici-hukuku | Olay: Cayma hakkı bildirilmeden satılan masa lambası | tkhk m.48 | cayma hakkını kullanmak için on dört günlük süreyle bağlı değildir | metinde geçer |
| tuketici-hukuku | Olay: Cayma hakkı bildirilmeden satılan masa lambası | tkhk m.48 | malın mutat kullanımı sebebiyle meydana gelen değişiklik ve bozulmalardan sorumlu değildir | metinde geçer |
| tuketici-hukuku | Olay: Tek taksit gecikmesi üzerine muaccel kılınan kredi | tkhk m.28 | birbirini izleyen en az iki taksidi ödemede temerrüde düşmesi | metinde geçer |
| tuketici-hukuku | Olay: Tek taksit gecikmesi üzerine muaccel kılınan kredi | tkhk m.28 | en az otuz gün süre vererek muacceliyet uyarısında bulunması zorunludur | metinde geçer |
| tuketici-hukuku | Olay: Tek taksit gecikmesi üzerine muaccel kılınan kredi | tkhk m.28 | Muaccel kılınan taksitlerin hesaplanmasında faiz, komisyon ve benzeri masraflar dikkate alınmaz | metinde geçer |
| tuketici-hukuku | Olay: Tek taksit gecikmesi üzerine muaccel kılınan kredi | tkhk m.27 | erken ödenen miktara göre gerekli tüm faiz ve diğer maliyet unsurlarına ilişkin indirim yapmakla yükümlüdür | metinde geçer |
| tuketici-hukuku | Olay: Arabulucuya gidilmeden açılan bedel iadesi davası | tkhk m.68 | tüketici hakem heyetlerine başvuru zorunludur | metinde geçer |
| tuketici-hukuku | Olay: Arabulucuya gidilmeden açılan bedel iadesi davası | tkhk m.68 | Bu değerlerin üzerindeki uyuşmazlıklar için tüketici hakem heyetlerine başvuru yapılamaz | metinde geçer |
| tuketici-hukuku | Olay: Arabulucuya gidilmeden açılan bedel iadesi davası | tkhk m.73 | tüketicinin yerleşim yerinin bulunduğu yerdeki tüketici mahkemesinde de açılabilir | metinde geçer |
| tuketici-hukuku | Olay: Arabulucuya gidilmeden açılan bedel iadesi davası | tkhk m.73A | dava açılmadan önce arabulucuya başvurulmuş olması dava şartıdır | metinde geçer |
| tuketici-hukuku | Olay: Arabulucuya gidilmeden açılan bedel iadesi davası | arabuluculuk m.18A | dava şartı yokluğu sebebiyle usulden reddine karar verilir | metinde geçer |
| tuketici-hukuku | Tuzak: Haksız şart içeren tüketici sözleşmesi bütünüyle hükümsüz olur. | tkhk m.5 | Sözleşmenin haksız şartlar dışındaki hükümleri geçerliliğini korur | metinde geçer |
| tuketici-hukuku | Tuzak: Tüketicinin borcu için alınan kefalet, sözleşmede öyle yazılmışsa müteselsil kefalettir. | tkhk m.4 | her ne isim altında olursa olsun adi kefalet sayılır | metinde geçer |
| tuketici-hukuku | Tuzak: Tüketici temerrüde düşerse ödenmeyen faize de faiz yürütülebilir. | tkhk m.4 | tüketici işlemlerinde bileşik faiz uygulanmaz | metinde geçer |
| tuketici-hukuku | Tuzak: Ayıplı maldan sorumluluğun zamanaşımı ayıbın ortaya çıktığı gün başlar. | tkhk m.12 | ayıp daha sonra ortaya çıkmış olsa bile | metinde geçer |
| tuketici-hukuku | Tuzak: Kredi sözleşmesinden cayan tüketici, kullandığı parayı geri ödemeden borçtan kurtulur. | tkhk m.24 | tüketici kredisinden cayılmamış sayılır | metinde geçer |
| tuketici-hukuku | Tuzak: Tüketici hakem heyeti kararı tavsiye niteliğinde olup karşı tarafı bağlamaz. | tkhk m.70 | Tüketici hakem heyeti kararları tarafları bağlar | metinde geçer |
| tuketici-hukuku | Tuzak: Taksitli tüketici satışında bütün borç için tek bir bono düzenlenebilir. | tkhk m.4 | sadece nama yazılı ve her bir taksit ödemesi için ayrı ayrı olacak şekilde senet düzenlenebilir | metinde geçer |
| tuketici-hukuku | Soru: Teslimden itibaren hangi süre içinde ortaya çıkan ayıbın teslim anında var olduğu kabul edilir? | tkhk m.10 | Teslim tarihinden itibaren altı ay içinde ortaya çıkan ayıpların | metinde geçer |
| tuketici-hukuku | Soru: Mesafeli sözleşmede tüketicinin gerekçe göstermeden cayma süresi kaç gündür? | tkhk m.48 | on dört gün içinde herhangi bir gerekçe göstermeksizin | metinde geçer |
| tuketici-hukuku | Soru: Garanti süresi, malın teslim tarihinden itibaren en az ne kadardır? | tkhk m.56 | Garanti süresi malın teslim tarihinden itibaren başlamak üzere asgari iki yıldır | metinde geçer |
| tuketici-hukuku | Soru: Konut veya tatil amaçlı taşınmazda ayıplı maldan sorumluluk teslimden itibaren hangi sürede zamanaşımına uğrar? | tkhk m.12 | Bu süre konut veya tatil amaçlı taşınmaz mallarda taşınmazın teslim tarihinden itibaren beş yıldır | metinde geçer |
| tuketici-hukuku | Soru: Tüketici hakem heyeti kararına karşı tüketici mahkemesine hangi süre içinde itiraz edilir? | tkhk m.70 | tebliğ tarihinden itibaren iki hafta içinde | metinde geçer |
| tuketici-hukuku | Soru: Aşağıdaki uyuşmazlıklardan hangisinde dava şartı olarak arabuluculuk hükümleri uygulanmaz? | tkhk m.73A | Tüketici hakem heyeti kararlarına yapılan itirazlar | metinde geçer |
| arabuluculuk | Olay: İlk toplantıya gelmeyen kiracı | arabuluculuk m.18B | kira ilişkisinden kaynaklanan uyuşmazlıklar | metinde geçer |
| arabuluculuk | Olay: İlk toplantıya gelmeyen kiracı | arabuluculuk m.18A | geçerli bir mazeret göstermeksizin ilk toplantıya katılmaması | metinde geçer |
| arabuluculuk | Olay: İlk toplantıya gelmeyen kiracı | arabuluculuk m.18A | davada kısmen veya tamamen haklı çıksa bile | metinde geçer |
| arabuluculuk | Olay: İlk toplantıya gelmeyen kiracı | arabuluculuk m.18A | vekâlet ücretinin yarısına hükmedilir | metinde geçer |
| arabuluculuk | Olay: Ortaklığın giderilmesinde anlaşma ve sonradan açılan dava | arabuluculuk m.18B | ortaklığın giderilmesine ilişkin uyuşmazlıklar | metinde geçer |
| arabuluculuk | Olay: Ortaklığın giderilmesinde anlaşma ve sonradan açılan dava | arabuluculuk m.18 | icra edilebilirlik şerhi aranmaksızın ilam niteliğinde belge sayılır | metinde geçer |
| arabuluculuk | Olay: Ortaklığın giderilmesinde anlaşma ve sonradan açılan dava | arabuluculuk m.18B | icra edilebilirliğine ilişkin şerhin alınması zorunlu | metinde geçer |
| arabuluculuk | Olay: Ortaklığın giderilmesinde anlaşma ve sonradan açılan dava | arabuluculuk m.18B | icra edilebilirlik şerhi verilmesinden sonra tapu müdürlüğünden tescil talebinde bulunabilir | metinde geçer |
| arabuluculuk | Olay: Ortaklığın giderilmesinde anlaşma ve sonradan açılan dava | arabuluculuk m.18 | üzerinde anlaşılan hususlar hakkında taraflarca dava açılamaz | metinde geçer |
| arabuluculuk | Olay: Arabuluculukta kabul edilen borç ve arabulucunun tanıklığı | arabuluculuk m.5 | herhangi bir vakıa veya iddianın kabulü | metinde geçer |
| arabuluculuk | Olay: Arabuluculukta kabul edilen borç ve arabulucunun tanıklığı | arabuluculuk m.5 | delil olarak sunulmuş olsa dahi hükme esas alınamaz | metinde geçer |
| arabuluculuk | Olay: Arabuluculukta kabul edilen borç ve arabulucunun tanıklığı | arabuluculuk m.9 | daha sonra taraflardan birinin avukatı olarak görev üstlenemez | metinde geçer |
| arabuluculuk | Olay: Arabuluculukta kabul edilen borç ve arabulucunun tanıklığı | arabuluculuk m.16 | zamanaşımı ve hak düşürücü sürelerin hesaplanmasında dikkate alınmaz | metinde geçer |
| arabuluculuk | Olay: Aile içi şiddet iddiası taşıyan tazminat uyuşmazlığı | arabuluculuk m.1 | aile içi şiddet iddiasını içeren uyuşmazlıklar arabuluculuğa elverişli değildir | metinde geçer |
| arabuluculuk | Olay: Aile içi şiddet iddiası taşıyan tazminat uyuşmazlığı | arabuluculuk m.17 | Uyuşmazlığın arabuluculuğa elverişli olmadığının tespit edilmesi | metinde geçer |
| arabuluculuk | Olay: Aile içi şiddet iddiası taşıyan tazminat uyuşmazlığı | arabuluculuk m.3 | bu süreçten vazgeçmek konusunda serbesttirler | metinde geçer |
| arabuluculuk | Olay: Aile içi şiddet iddiası taşıyan tazminat uyuşmazlığı | arabuluculuk m.17 | arabuluculuk faaliyetinden çekildiğini bildirmesi | metinde geçer |
| arabuluculuk | Tuzak: Taraflar anlaşamazsa arabulucu uyuşmazlık hakkında bağlayıcı bir karar verir. | arabuluculuk m.15 | sadece hâkim tarafından yapılabilecek işlemler arabulucu tarafından yapılamaz | metinde geçer |
| arabuluculuk | Tuzak: Arabulucu, kendisini görevlendiren büronun yetkisizliğini kendiliğinden dikkate alır. | arabuluculuk m.18A | büronun yetkili olup olmadığını kendiliğinden dikkate alamaz | metinde geçer |
| arabuluculuk | Tuzak: Dava şartı arabuluculukta arabulucu, süreci gerekli gördüğü kadar uzatabilir. | arabuluculuk m.18A | zorunlu hâllerde arabulucu tarafından en fazla bir hafta uzatılabilir | metinde geçer |
| arabuluculuk | Tuzak: Dava açıldıktan sonra artık arabulucuya başvurulamaz. | arabuluculuk m.13 | davanın görülmesi sırasında arabulucuya başvurma konusunda anlaşabilirler | metinde geçer |
| arabuluculuk | Tuzak: Dava şartı arabuluculuk sürerken zamanaşımı işlemeye devam eder. | arabuluculuk m.18A | zamanaşımı durur ve hak düşürücü süre işlemez | metinde geçer |
| arabuluculuk | Tuzak: Tahkim sözleşmesi bulunsa da kira uyuşmazlığında önce arabulucuya gidilmesi dava şartıdır. | arabuluculuk m.18A | tahkim sözleşmesinin bulunduğu hâllerde, dava şartı olarak arabuluculuğa ilişkin hükümler uygulanmaz | metinde geçer |
| arabuluculuk | Soru: Dava şartı arabuluculukta arabulucu başvuruyu görevlendirildiği tarihten itibaren kural olarak hangi süre içinde sonuçlandırır? | arabuluculuk m.18A | görevlendirildiği tarihten itibaren üç hafta içinde sonuçlandırır | metinde geçer |
| arabuluculuk | Soru: İhtiyari arabuluculukta başvuru teklifine hangi süre içinde olumlu cevap verilmezse teklif reddedilmiş sayılır? | arabuluculuk m.13 | otuz gün içinde olumlu cevap verilmez ise | metinde geçer |
| arabuluculuk | Soru: Dava açıldıktan sonra taraflar birlikte arabulucuya başvuracaklarını beyan ederse yargılama ilk aşamada en çok ne kadar ertelenir? | arabuluculuk m.15 | yargılama, mahkemece üç ayı geçmemek üzere ertelenir | metinde geçer |
| arabuluculuk | Soru: Arabulucu, faaliyete ilişkin belgeleri ve düzenlediği tutanağı ne kadar süre saklamak zorundadır? | arabuluculuk m.17 | beş yıl süre ile saklamak zorundadır | metinde geçer |
| arabuluculuk | Soru: Aşağıdakilerden hangisinde dava açılmadan önce arabulucuya başvurulmuş olması dava şartıdır? | arabuluculuk m.18B | Kat Mülkiyeti Kanunundan kaynaklanan uyuşmazlıklar | metinde geçer |
| arabuluculuk | Soru: Arabuluculuk sonunda anlaşılan hususlar için taraflardan biri sonradan dava açmak isterse hangisi doğrudur? | arabuluculuk m.18 | anlaşmaya varılması hâlinde, üzerinde anlaşılan hususlar | metinde geçer |
| vergi-hukuku | Olay: Kesilmeyen kira stopajı ve “vergiler kiraya verene aittir” kaydı | gvk m.94 | 70 inci maddede yazılı mal ve hakların kiralanması karşılığı yapılan | metinde geçer |
| vergi-hukuku | Olay: Kesilmeyen kira stopajı ve “vergiler kiraya verene aittir” kaydı | gvk m.70 | Arazi, bina | metinde geçer |
| vergi-hukuku | Olay: Kesilmeyen kira stopajı ve “vergiler kiraya verene aittir” kaydı | vuk m.8 | alacaklı vergi dairesine karşı muhatap olan kişidir | metinde geçer |
| vergi-hukuku | Olay: Kesilmeyen kira stopajı ve “vergiler kiraya verene aittir” kaydı | vuk m.11 | verginin tam olarak kesilip ödenmesinden ve bununla ilgili diğer ödevleri yerine getirmekten sorumludurlar | metinde geçer |
| vergi-hukuku | Olay: Kesilmeyen kira stopajı ve “vergiler kiraya verene aittir” kaydı | vuk m.8 | özel mukaveleler vergi dairelerini bağlamaz | metinde geçer |
| vergi-hukuku | Olay: Kesilmeyen kira stopajı ve “vergiler kiraya verene aittir” kaydı | vuk m.11 | asıl mükelleflere rücu etmek hakkını kaldırmaz | metinde geçer |
| vergi-hukuku | Olay: Ticaret sicilinden silinen limited şirketin vergi borcu | vuk m.10 | tasfiye öncesi dönemler için kanuni temsilcilerden, tasfiye dönemi için tasfiye memurlarından herhangi biri adına yapılır | metinde geçer |
| vergi-hukuku | Olay: Ticaret sicilinden silinen limited şirketin vergi borcu | vuk m.10 | şirkete koydukları sermaye hisseleri oranında sorumlu olurlar | metinde geçer |
| vergi-hukuku | Olay: Ticaret sicilinden silinen limited şirketin vergi borcu | vuk m.10 | tasfiye sonucu dağıtılan tutarla sınırlıdır | metinde geçer |
| vergi-hukuku | Olay: Ticaret sicilinden silinen limited şirketin vergi borcu | vuk m.10 | tasfiyeye giriş tarihinden önceki zamanlara ait sorumluluklarını da kaldırmaz | metinde geçer |
| vergi-hukuku | Olay: Takdir komisyonuna sevk ve tarh zamanaşımı | vuk m.30 | Vergi beyannamesi kanuni süresi geçtiği halde verilmemişse | metinde geçer |
| vergi-hukuku | Olay: Takdir komisyonuna sevk ve tarh zamanaşımı | vuk m.114 | beş yıl içinde tarh ve mükellefe tebliğ edilmiyen vergiler zamanaşımına uğrar | metinde geçer |
| vergi-hukuku | Olay: Takdir komisyonuna sevk ve tarh zamanaşımı | vuk m.114 | takdir komisyonuna başvurulması, zamanaşımını durdurur | metinde geçer |
| vergi-hukuku | Olay: Takdir komisyonuna sevk ve tarh zamanaşımı | vuk m.114 | işlemeyen süre her hâl ve takdirde bir yıldan fazla olamaz | metinde geçer |
| vergi-hukuku | Olay: Takdir komisyonuna sevk ve tarh zamanaşımı | vuk m.344 | ziyaa uğratılan verginin bir katı tutarında vergi ziyaı cezası kesilir | metinde geçer |
| vergi-hukuku | Olay: Kendiliğinden düzeltme ile inceleme sonrası düzeltme | vuk m.371 | kanuna aykırı hareketlerini ilgili makamlara kendiliğinden dilekçe ile haber vermesi | metinde geçer |
| vergi-hukuku | Olay: Kendiliğinden düzeltme ile inceleme sonrası düzeltme | vuk m.371 | vergi incelemesine başlandığı | metinde geçer |
| vergi-hukuku | Olay: Kendiliğinden düzeltme ile inceleme sonrası düzeltme | vuk m.371 | haber verme tarihinden başlayarak onbeş gün içinde tamamlanması veya düzeltilmesi | metinde geçer |
| vergi-hukuku | Olay: Kendiliğinden düzeltme ile inceleme sonrası düzeltme | vuk m.376 | otuz gün içinde ilgili vergi dairesine başvurarak | metinde geçer |
| vergi-hukuku | Olay: Kendiliğinden düzeltme ile inceleme sonrası düzeltme | vuk m.376 | dava konusu yaparsa bu madde hükmünden faydalandırılmaz | metinde geçer |
| vergi-hukuku | Tuzak: Vergi kanunları yalnız lafzıyla uygulanır, kanunun amacına bakılmaz. | vuk m.3 | Vergi kanunları lafzı ve ruhu ile hüküm ifade eder | metinde geçer |
| vergi-hukuku | Tuzak: Vergiyi doğuran olay yalnız yazılı belgeyle ispatlanabilir. | vuk m.3 | yemin hariç her türlü delille ispatlanabilir | metinde geçer |
| vergi-hukuku | Tuzak: Olağan dışı bir durumun varlığını ispat yükü her durumda idareye aittir. | vuk m.3 | ispat külfeti bunu iddia eden tarafa aittir | metinde geçer |
| vergi-hukuku | Tuzak: Tarh ile tahakkuk aynı işlemdir. | vuk m.22 | tarh ve tebliğ edilen bir verginin ödenmesi gereken | metinde geçer |
| vergi-hukuku | Tuzak: Eksik vergi sonradan tahakkuk ettirilip ödenirse vergi ziyaı cezası kesilemez. | vuk m.341 | ceza uygulanmasına mani teşkil etmez | metinde geçer |
| vergi-hukuku | Tuzak: Pişmanlık hükümleri emlak vergisi dahil bütün vergilerde uygulanır. | vuk m.371 | emlak vergisi ile ilgili olarak uygulanmaz | metinde geçer |
| vergi-hukuku | Tuzak: Usulsüzlük, verginin eksik tahakkuk etmesi demektir. | vuk m.351 | şekle ve usule mütaallik hükümlerine riayet edilmemesidir | metinde geçer |
| vergi-hukuku | Soru: Tarh zamanaşımı süresi hangi tarihten başlar ve kaç yıldır? | vuk m.114 | takip eden yılın başından başlıyarak beş yıl içinde | metinde geçer |
| vergi-hukuku | Soru: Takdir komisyonuna başvurulması nedeniyle işlemeyen zamanaşımı süresi en çok ne kadar olabilir? | vuk m.114 | bir yıldan fazla olamaz | metinde geçer |
| vergi-hukuku | Soru: Vergi ziyaına VUK m.359’da yazılı fiillerle sebebiyet verilirse vergi ziyaı cezası kaç kat uygulanır? | vuk m.344 | bu ceza üç kat | metinde geçer |
| vergi-hukuku | Soru: İnceleme ya da takdire sevkten önce kanuni süresi geçtikten sonra verilen beyanname için vergi ziyaı cezası hangi oranda uygulanır? | vuk m.344 | kesilecek ceza yüzde elli oranında uygulanır | metinde geçer |
| vergi-hukuku | Soru: Pişmanlıkla haber verilen eksik beyan, haber verme tarihinden itibaren hangi süre içinde düzeltilmelidir? | vuk m.371 | onbeş gün içinde tamamlanması veya düzeltilmesi | metinde geçer |
| vergi-hukuku | Soru: Yerleşim yeri adresinde iki kez bulunamayan muhataba pusula yapıştırılarak yapılan tebliğ, evrak alınmazsa hangi gün yapılmış sayılır? | vuk m.102 | on beşinci günde tebliğ yapılmış sayılır | metinde geçer |

Toplam 287 dayanak, 287 kanun metninde doğrulandı.
