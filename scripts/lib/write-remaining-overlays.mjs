#!/usr/bin/env node
/**
 * Kalan fakülteler için örtü + research (kimlik sayfası; slayt yok).
 *   node scripts/lib/write-remaining-overlays.mjs
 */
import { writeFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

function loadUnis() {
    const src = readFileSync(join(ROOT, 'lib/ders-notlari/universiteler.ts'), 'utf8');
    const re = /export const LAW_UNIVERSITIES(?::[^=]+)?=\s*(\[[\s\S]*?\n\]);/;
    const m = src.match(re);
    if (!m) throw new Error('universiteler parse');
    return new Function(`return (${m[1]});`)();
}

/** Fakülte kimlik sayfası + kampüs/vakıa kancası. Slayt yok. */
const EXTRA = [
    { slug: 'altinbas', campus: 'Mahmutbey', cityHook: "Bağcılar'daki bir sanayi sitesi kira ve ayıp uyuşmazlığı", mehaz: 'Altınbaş; Köln UOLP ayrı programdır, sayfa uydurulmaz', url: 'https://hukuk.altinbas.edu.tr/', tip: "Altınbaş kâğıdında TBK lafzı bağlar; UOLP Köln hattı ayrı kayıttır." },
    { slug: 'maltepe', campus: 'Maltepe', cityHook: "Bağdat Caddesi'ndeki bir konut kirası ve tahliye ihtilafı", mehaz: 'Maltepe vakıf fakültesi; TBK/TMK lafzı bağlar', url: 'https://www.maltepe.edu.tr/hukuk', tip: "Maltepe kâğıdında kira ile tüketici sıfatını ayırın." },
    { slug: 'dogus', campus: 'Dudullu / Çamlıca', cityHook: "Ümraniye'deki bir kat karşılığı inşaat ve temerrüt", mehaz: 'Doğuş vakıf fakültesi; TBK eser ve kira lafzı bağlar', url: 'https://www.dogus.edu.tr/akademik/fakulteler/hukuk-fakultesi', tip: "Doğuş kâğıdında eser ile satımı karıştırmayın." },
    { slug: 'okan', campus: 'Tuzla', cityHook: "Tuzla tersane hattındaki bir hizmet sözleşmesi ve fazla mesai", mehaz: 'Okan vakıf fakültesi; İşK/TBK yan yana', url: 'https://www.okan.edu.tr/hukuk/', tip: "Okan kâğıdında bağımlılık unsurunu vekâletten ayırın." },
    { slug: 'kultur', campus: 'Ataköy / İncirli', cityHook: "Bakırköy'deki bir aile konutu ve mal rejimi tasfiyesi", mehaz: 'İKÜ vakıf fakültesi; TMK lafzı bağlar', url: 'https://www.iku.edu.tr/tr/hukuk-fakultesi', tip: "İKÜ kâğıdında aile konutu şerhini unutmayın." },
    { slug: 'aydin', campus: 'Florya', cityHook: "Küçükçekmece göl kenarındaki bir imar ve kira uyuşmazlığı", mehaz: 'İAÜ vakıf fakültesi; TBK/İmarK lafzı bağlar', url: 'https://www.aydin.edu.tr/tr-tr/akademik/fakulteler/hukuk', tip: "Aydın kâğıdında imar ile kira rejimini ayırın." },
    { slug: 'beykent', campus: 'Ayazağa / Taksim', cityHook: "Sarıyer'deki bir taşınmaz satışı ve şekil eksikliği", mehaz: 'Beykent vakıf fakültesi; TBK şekil hükümleri bağlar', url: 'https://www.beykent.edu.tr/akademik/fakulteler/hukuk-fakultesi', tip: "Beykent kâğıdında resmi şekli iradi şekille karıştırmayın." },
    { slug: 'fatih-sultan', campus: 'Fatih / Valide-i Atik', cityHook: "Fatih'teki bir vakıf taşınmazı ve kira tespiti", mehaz: 'FSMVÜ; vakıf hukuku izlencede anılır, sayfa uydurulmaz', url: 'https://hukuk.fsm.edu.tr/', tip: "FSM kâğıdında vakıf malı ile özel mülkiyeti ayırın." },
    { slug: 'ataturk', campus: 'Yakutiye', cityHook: "Palandöken'deki bir kış turizmi işletmesi kirası", mehaz: 'Atatürk devlet fakültesi; TBK/TMK lafzı bağlar', url: 'https://atauni.edu.tr/hukuk-fakultesi/', tip: "Erzurum kâğıdında kira ile eser sözleşmesini ayırın." },
    { slug: 'inonu', campus: 'Malatya merkez', cityHook: "Kayısı bahçesi satışı ve ayıplı ifa", mehaz: 'İnönü devlet fakültesi; TBK satım lafzı bağlar', url: 'https://www.inonu.edu.tr/hukuk', tip: "İnönü kâğıdında ayıp ile zapttı karıştırmayın." },
    { slug: 'dicle', campus: 'Sur / Kıbrıs', cityHook: "Diyarbakır'daki bir taşınmaz zilyetliği ve tapu tescili", mehaz: 'Dicle devlet fakültesi; TMK zilyetlik lafzı bağlar', url: 'https://www.dicle.edu.tr/tr/birim/hukuk-fakultesi', tip: "Dicle kâğıdında zilyetliği mülkiyet davasıyla karıştırmayın." },
    { slug: 'gaziantep', campus: 'Şehitkamil', cityHook: "Antepfıstığı ticarethanesindeki bir ticari satış ve ayıp", mehaz: 'GAÜN devlet fakültesi; TTK/TBK yan yana', url: 'https://hukuk.gantep.edu.tr/', tip: "Gaziantep kâğıdında ticari iş karinesini yazın." },
    { slug: 'suleyman-demirel', campus: 'Doğu Kampüsü / Isparta', cityHook: "Gül yağı kooperatifindeki bir ortaklık ve temerrüt", mehaz: 'SDÜ devlet fakültesi; TBK/TTK lafzı bağlar', url: 'https://hukuk.sdu.edu.tr/', tip: "SDÜ kâğıdında kooperatif ile adi ortaklığı ayırın." },
    { slug: 'pamukkale', campus: 'Kınıklı', cityHook: "Pamukkale'deki bir turizm tesisi kirası ve tahliye", mehaz: 'PAÜ devlet fakültesi; TBK konut/çatılı işyeri koruması', url: 'https://www.pau.edu.tr/hukuk', tip: "PAÜ kâğıdında konut kirası ile genel kirayı ayırın." },
    { slug: 'sakarya', campus: 'Esentepe / Serdivan', cityHook: "Adapazarı'ndaki bir otomotiv yan sanayi eser sözleşmesi", mehaz: 'SAÜ devlet fakültesi; TBK eser lafzı bağlar', url: 'https://hukuk.sakarya.edu.tr/', tip: "Sakarya kâğıdında sonuç borcu ile faaliyet borcunu ayırın." },
    { slug: 'kocaeli', campus: 'Umuttepe', cityHook: "Gebze'deki bir fabrika iş kazası ve rücu", mehaz: 'KOÜ devlet fakültesi; İşK/TBK haksız fiil yan yana', url: 'https://hukuk.kocaeli.edu.tr/', tip: "Kocaeli kâğıdında iş kazasını haksız fiille karıştırmayın; rejim seçin." },
    { slug: 'balikesir', campus: 'Çağış', cityHook: "Ayvalık'taki bir zeytinlik satışı ve şekil", mehaz: 'BAÜN devlet fakültesi; TBK/TMK lafzı bağlar', url: 'https://www.balikesir.edu.tr/site/birim/hukuk-fakultesi-937', tip: "Balıkesir kâğıdında taşınmaz satışında resmi şekli yazın." },
    { slug: 'afyon', campus: 'Afyonkarahisar merkez', cityHook: "Termal otel kirası ve mermer ocağı imtiyaz uyuşmazlığı", mehaz: 'AKÜ devlet fakültesi; TBK kira lafzı bağlar', url: 'https://hukuk.aku.edu.tr/', tip: "Afyon kâğıdında kira bedeli ile eser bedelini ayırın." },
    { slug: 'eskisehir-osmangazi', campus: 'Meşelik', cityHook: "Odunpazarı'ndaki bir restorasyon eser sözleşmesi", mehaz: 'ESOGÜ devlet fakültesi; TBK eser ve ayıp lafzı bağlar', url: 'https://hukuk.ogu.edu.tr/', tip: "Osmangazi kâğıdında ayıp bildirim süresini yazın." },
    { slug: 'sivas-cumhuriyet', campus: 'Sivas merkez', cityHook: "Kangal'daki bir maden iş sözleşmesi ve kıdem", mehaz: 'SCÜ devlet fakültesi; İşK lafzı bağlar', url: 'https://hukuk.cumhuriyet.edu.tr/', tip: "Sivas kâğıdında kıdem ile ihbarı karıştırmayın." },
    { slug: 'samsun', campus: 'Kurupelit', cityHook: "Samsun limanındaki bir navlun ve ticari satış", mehaz: 'OMÜ devlet fakültesi; TTK/TBK yan yana', url: 'https://hukuk.omu.edu.tr/', tip: "OMÜ kâğıdında ticari satış karinesini yazın." },
    { slug: 'erzincan', campus: 'Erzincan merkez', cityHook: "Erzincan'daki bir bağışlama ve tenkis tartışması", mehaz: 'EBYÜ devlet fakültesi; TBK bağış / TMK tenkis', url: 'https://hukuk.ebyu.edu.tr/', tip: "Erzincan kâğıdında bağışı satımın bedelsiz kardeşi gibi okuyun; tenkis ayrı derstir." },
    { slug: 'kirikkale', campus: 'Yahşihan', cityHook: "Kırıkkale silah sanayii çevresindeki bir hizmet sözleşmesi", mehaz: 'Kırıkkale devlet fakültesi; TBK/İşK yan yana', url: 'https://hukuk.kku.edu.tr/', tip: "Kırıkkale kâğıdında bağımlılığı vekâletten ayırın." },
    { slug: 'necmettin-erbakan', campus: 'Meram / Köyceğiz', cityHook: "Meram'daki bir taşınmaz bağışı ve resmi şekil", mehaz: 'NEÜ devlet fakültesi; TBK bağış lafzı bağlar', url: 'https://www.erbakan.edu.tr/hukuk', tip: "NEÜ kâğıdında taşınmaz bağışında şekli yazın." },
    { slug: 'atilim', campus: 'Gölbaşı / Kızılcaşar', cityHook: "Gölbaşı'ndaki bir site aidatı ve kat mülkiyeti", mehaz: 'Atılım vakıf fakültesi; KMK/TMK lafzı bağlar', url: 'https://www.atilim.edu.tr/tr/law', tip: "Atılım kâğıdında kat mülkiyetini paylı mülkiyetle karıştırmayın." },
    { slug: 'cankaya', campus: 'Yukarıyurtçu / Etimesgut', cityHook: "Etimesgut'taki bir konut kooperatifi ve tapu tescili", mehaz: 'Çankaya vakıf fakültesi; TMK tapu lafzı bağlar', url: 'https://hukuk.cankaya.edu.tr/', tip: "Çankaya kâğıdında tescil kuralını istisnalarla yazın." },
    { slug: 'baskent', campus: 'Bağlıca', cityHook: "Bağlıca'daki bir özel hastane vekâleti ve özen borcu", mehaz: 'Başkent vakıf fakültesi; TBK vekâlet lafzı bağlar', url: 'https://hukuk.baskent.edu.tr/', tip: "Başkent kâğıdında vekâleti hizmet sözleşmesinden ayırın." },
    { slug: 'yasar', campus: 'Bornova', cityHook: "Alsancak'taki bir ticari kira ve tahliye", mehaz: 'Yaşar vakıf fakültesi; TBK kira lafzı bağlar', url: 'https://hukuk.yasar.edu.tr/', tip: "Yaşar kâğıdında çatılı işyeri korumasını genel kiradan ayırın." },
    { slug: 'izmir-ekonomi', campus: 'Balçova', cityHook: "İnciraltı'ndaki bir yabancı unsurlu satım ve MÖHUK kapısı", mehaz: 'İEÜ; kısmen İngilizce izlence, kâğıtta Türkçe lafız bağlar', url: 'https://www.ieu.edu.tr/tr/akademik/fakulteler/hukuk-fakultesi', tip: "İEÜ kâğıdında yabancı unsur varsa önce kanunlar ihtilafı, sonra TBK yazılır." },
    { slug: 'antalya-bilim', campus: 'Dosemealtı', cityHook: "Lara'daki bir devre mülk ve tüketici işlemi", mehaz: 'ABÜ vakıf fakültesi; TKHK/TBK yan yana', url: 'https://www.antalya.edu.tr/tr/akademik/fakulteler/hukuk-fakultesi', tip: "ABÜ kâğıdında TKHK sıfatı yoksa TBK açılır." },
    { slug: 'hasan-kalyoncu', campus: 'Şahinbey', cityHook: "Gaziantep OSB'deki bir ticari vekâlet ve hesap verme", mehaz: 'HKÜ vakıf fakültesi; TBK vekâlet / TTK ticari temsilci', url: 'https://hukuk.hku.edu.tr/', tip: "HKÜ kâğıdında ticari temsilciyi adi vekâletten ayırın." },
    { slug: 'turk-alman', campus: 'Beykoz / Tuzla hattı', cityHook: "Beykoz'daki bir karşılaştırmalı satım ve ayıp", mehaz: 'TAÜ; Alman mehazı izlencede anılır, kâğıtta TBK lafzı bağlar', url: 'https://hukuk.tau.edu.tr/', tip: "TAÜ kâğıdında BGB karşılaştırması dipnota kalır; yürürlük cümlesi TBK'dır." },
    { slug: 'mef', campus: 'Maslak / Ayazağa', cityHook: "Maslak'taki bir ofis kirası ve genel işlem koşulu", mehaz: 'MEF vakıf fakültesi; TBK GİK lafzı bağlar', url: 'https://www.mef.edu.tr/tr/hukuk-fakultesi', tip: "MEF kâğıdında yürürlük-yorum-içerik denetimini üç basamak yazın." },
    { slug: 'ibn-haldun', campus: 'Başakşehir', cityHook: "Başakşehir'deki bir aile konutu ve velayet", mehaz: 'İHÜ; karşılaştırmalı izlence anılır, kâğıtta TMK lafzı bağlar', url: 'https://law.ihu.edu.tr/', tip: "İHÜ kâğıdında karşılaştırmalı not, yürürlük cümlesinin yerini almaz." },
    { slug: 'tokat', campus: 'Tokat merkez', cityHook: "Kazova'daki bir tarım arazisi satışı ve ön alım", mehaz: 'TOGÜ devlet fakültesi; TMK önalım lafzı bağlar', url: 'https://hukuk.gop.edu.tr/', tip: "Tokat kâğıdında yasal önalımı sözleşmesel önalımla karıştırmayın." },
    { slug: 'yozgat', campus: 'Yozgat merkez', cityHook: "Bozok yaylasındaki bir kira ve tahliye", mehaz: 'Bozok devlet fakültesi; TBK kira lafzı bağlar', url: 'https://bozok.edu.tr/birim/hukuk', tip: "Yozgat kâğıdında tahliye sebebini kira bedeli tespitinden ayırın." },
    { slug: 'rize', campus: 'Zihni Derin', cityHook: "Çay bahçesi kira ve ürün paylaşımı", mehaz: 'RTEÜ devlet fakültesi; TBK kira / ürün kirası lafzı bağlar', url: 'https://hukuk.erdogan.edu.tr/', tip: "Rize kâğıdında ürün kirasını adî kiradan ayırın." },
    { slug: 'bolu', campus: 'Gölköy', cityHook: "Abant'taki bir otel işletmesi kirası", mehaz: 'BAİBÜ devlet fakültesi; TBK kira lafzı bağlar', url: 'https://hukuk.ibu.edu.tr/', tip: "Bolu kâğıdında işletme kirasını konut kirasıyla karıştırmayın." },
    { slug: 'cankiri', campus: 'Uluyazı', cityHook: "Çankırı'daki bir tuz ocağı imtiyaz ve kira", mehaz: 'Karatekin devlet fakültesi; TBK lafzı bağlar', url: 'https://www.karatekin.edu.tr/hukuk-fakultesi-anabirim-1-1', tip: "Karatekin kâğıdında imtiyazı kira ile karıştırmayın." },
    { slug: 'tekirdag', campus: 'Namık Kemal / Değirmenaltı', cityHook: "Şarköy'deki bir bağ satışı ve ayıp", mehaz: 'NKÜ devlet fakültesi; TBK satım lafzı bağlar', url: 'https://hukuk.nku.edu.tr/', tip: "NKÜ kâğıdında ayıp bildirimini yazın." },
    { slug: 'kirklareli', campus: 'Kayalı', cityHook: "Lüleburgaz'daki bir sanayi sitesi kira", mehaz: 'Kırklareli devlet fakültesi; TBK kira lafzı bağlar', url: 'https://hukuk.klu.edu.tr/', tip: "Kırklareli kâğıdında çatılı işyeri korumasını yazın." },
    { slug: 'trabzon', campus: 'Trabzon Üniversitesi kampüsü', cityHook: "Sürmene'deki bir denizcilik işletmesi ve ticari vekâlet", mehaz: 'Trabzon Üniversitesi (KTÜ değil); TTK/TBK lafzı bağlar', url: 'https://hukuk.trabzon.edu.tr/', tip: "Trabzon kâğıdında fakülte KTÜ değildir; rejim TTK/TBK'dır." },
    { slug: 'yalova', campus: 'Yalova merkez', cityHook: "Termal'deki bir kaplıca işletmesi kirası", mehaz: 'Yalova devlet fakültesi; TBK kira lafzı bağlar', url: 'https://hukuk.yalova.edu.tr/', tip: "Yalova kâğıdında işletme kirasını konut kirasıyla karıştırmayın." },
    { slug: 'izmir-bakircay', campus: 'Seyrek / Menemen', cityHook: "Menemen'deki bir tarım arazisi zilyetliği", mehaz: 'Bakırçay devlet fakültesi; TMK zilyetlik lafzı bağlar', url: 'https://hukuk.bakircay.edu.tr/', tip: "Bakırçay kâğıdında zilyetlik korumasını tapu davasıyla karıştırmayın." },
    { slug: 'izmir-demokrasi', campus: 'Üçkuyular / Güzelbahçe hattı', cityHook: "Narlıdere'deki bir konut aidatı", mehaz: 'İDÜ devlet fakültesi; KMK lafzı bağlar', url: 'https://hukuk.idu.edu.tr/', tip: "İDÜ kâğıdında ortak gideri kira bedeliyle karıştırmayın." },
    { slug: 'izmir-katip-celebi', campus: 'Çiğli', cityHook: "Çiğli'deki bir işyeri devri ve icap-kabul", mehaz: 'İKÇÜ devlet fakültesi; TBK kuruluş lafzı bağlar', url: 'https://hukuk.ikc.edu.tr/', tip: "İKÇÜ kâğıdında işletme devrini satımla karıştırmayın." },
    { slug: 'ufuk', campus: 'Kızılcaşar / İncek', cityHook: "İncek'teki bir site yönetimi ve KMK yaptırımı", mehaz: 'Ufuk vakıf fakültesi; KMK lafzı bağlar', url: 'https://www.ufuk.edu.tr/hukuk-fakultesi', tip: "Ufuk kâğıdında kat malikleri kurulunu paylı mülkiyetle karıştırmayın." },
    { slug: 'ankara-bilim', campus: 'Çankaya / Balgat hattı', cityHook: "Balgat'taki bir ofis GİK ve kira", mehaz: 'Ankara Bilim vakıf fakültesi; TBK GİK lafzı bağlar', url: 'https://ankarabilim.edu.tr/akademik/fakulteler/hukuk-fakultesi', tip: "Ankara Bilim kâğıdında GİK denetimini üç basamak yazın." },
    { slug: 'ankara-medipol', campus: 'Ankara Medipol kampüsü', cityHook: "Ankara'daki bir özel sağlık vekâleti ve özen", mehaz: 'Ankara Medipol vakıf fakültesi; TBK vekâlet lafzı bağlar', url: 'https://www.ankaramedipol.edu.tr/akademik/fakulteler/hukuk-fakultesi', tip: "Ankara Medipol kâğıdında hekim sözleşmesini hizmetle karıştırmayın." },
    { slug: 'cag', campus: 'Yenice / Tarsus', cityHook: "Tarsus'taki bir narenciye bahçesi kira ve ürün", mehaz: 'Çağ vakıf fakültesi; TBK kira lafzı bağlar', url: 'https://www.cag.edu.tr/tr/hukuk-fakultesi', tip: "Çağ kâğıdında ürün kirasını adî kiradan ayırın." },
    { slug: 'istanbul-29-mayis', campus: 'Ümraniye / Yamanevler', cityHook: "Ümraniye'deki bir aile konutu ve tasarruf sınırı", mehaz: '29 Mayıs vakıf fakültesi; TMK aile konutu lafzı bağlar', url: 'https://www.29mayis.edu.tr/akademik/fakulteler/hukuk-fakultesi', tip: "29 Mayıs kâğıdında aile konutu rızasını yazın." },
    { slug: 'istanbul-gedik', campus: 'Kartal / Yakacık', cityHook: "Kartal sanayi sitesindeki bir eser ve ayıp", mehaz: 'Gedik vakıf fakültesi; TBK eser lafzı bağlar', url: 'https://www.gedik.edu.tr/akademik/fakulteler/hukuk-fakultesi', tip: "Gedik kâğıdında eser ayıbını satım ayıbıyla karıştırmayın." },
    { slug: 'istanbul-zaim', campus: 'Halkalı', cityHook: "Halkalı'daki bir kat karşılığı inşaat", mehaz: 'İZÜ vakıf fakültesi; TBK eser lafzı bağlar', url: 'https://www.izu.edu.tr/akademik/fakulteler/hukuk-fakultesi', tip: "Zaim kâğıdında kat karşılığını bağışla karıştırmayın." },
    { slug: 'istanbul-ticaret', campus: 'Sütlüce / Küçükyalı', cityHook: "Sütlüce'deki bir ticari işletme devri", mehaz: 'Ticaret vakıf fakültesi; TTK ticari işletme lafzı bağlar', url: 'https://www.ticaret.edu.tr/hukuk-fakultesi', tip: "Ticaret kâğıdında işletme devrini mal satımıyla karıştırmayın." },
    { slug: 'yeni-yuzyil', campus: 'Topkapı / Cevizlibağ', cityHook: "Cevizlibağ'daki bir konut kirası ve GİK", mehaz: 'Yeni Yüzyıl vakıf fakültesi; TBK kira/GİK lafzı bağlar', url: 'https://www.yeniyuzyil.edu.tr/akademik/fakulteler/hukuk-fakultesi', tip: "Yeni Yüzyıl kâğıdında GİK yürürlük denetimini yazın." },
    { slug: 'kto-karatay', campus: 'Karatay / Konya', cityHook: "Karatay sanayi sitesindeki bir ticari satış", mehaz: 'KTO Karatay vakıf fakültesi; TTK/TBK yan yana', url: 'https://www.karatay.edu.tr/tr/akademik/fakulteler/hukuk-fakultesi', tip: "Karatay kâğıdında ticari iş karinesini yazın." },
    { slug: 'nuh-naci-yazgan', campus: 'Kayseri', cityHook: "Kayseri OSB'deki bir eser sözleşmesi ve gecikme", mehaz: 'NNY vakıf fakültesi; TBK eser lafzı bağlar', url: 'https://www.nny.edu.tr/akademik/fakulteler/hukuk-fakultesi', tip: "NNY kâğıdında temerrüdü ayıpla karıştırmayın." },
    { slug: 'piri-reis', campus: 'Tuzla', cityHook: "Tuzla tersanesindeki bir gemi inşa eser sözleşmesi", mehaz: 'Piri Reis; deniz ticareti izlencede anılır, kâğıtta TBK/TTK lafzı bağlar', url: 'https://www.pirireis.edu.tr/akademik/fakulteler/hukuk-fakultesi', tip: "Piri Reis kâğıdında gemi inşasını adî eserden ayırın; TTK deniz hükümleri varsa onu yazın." },
];

function overlayOf(uni, extra) {
    const typeNote = uni.type === 'vakif' ? 'vakıf fakültesidir' : 'devlet fakültesidir';
    const langNote = String(uni.lang || 'tr').startsWith('tr-en')
        ? 'Kısmen İngilizce izlence olabilir; kâğıtta Türkçe lafız bağlar.'
        : uni.lang === 'fr'
            ? 'Fransızca izlence anılır; kâğıtta Türkçe (ve varsa mehaz) yazılır.'
            : 'Eğitim dili Türkçedir.';
    return {
        uniSlug: uni.slug,
        calendar: uni.calendar || 'donemlik',
        lang: uni.lang || 'tr',
        campus: extra.campus,
        cityHook: extra.cityHook,
        mehaz: extra.mehaz,
        examBox: {
            calendar: uni.calendar || 'donemlik',
            typicalWeights: 'Ara sınav %30–40, final %50–60 (OBS / dönem ilanı).',
            format: 'Klasik yazılı: madde + unsur + vakıaya yedirme. Oran dönem ilanına bağlıdır.',
            tips: [
                extra.tip,
                `${uni.shortName} kâğıdında ilk cümle kurumu adlandırır; slogan yetmez.`,
                'Öğretim elemanı duyurusu ve OBS bu notun üstündedir.',
            ],
        },
        syllabusOrder: [
            'borçlar genel kavramları ve kaynaklar',
            'sözleşme, haksız fiil, sebepsiz zenginleşme',
            'ifa ve ifa etmeme',
            'borcu sona erdiren sebepler',
            'zamanaşımı',
        ],
        schoolNotes: [
            `${uni.name}, ${uni.city} merkezli bir ${typeNote} ${langNote}`,
            `${extra.campus} usulü: kaynak ve lafız önce, slayt cümlesi yok.`,
            'Bu örtü kamuya açık kimlik sayfasından üretilmiştir; amfi notu kopyalanmaz.',
        ],
        sources: [
            {
                title: `${uni.shortName} Hukuk Fakültesi`,
                url: extra.url,
                note: 'fakülte kimliği; slayt ve amfi notu yok',
            },
        ],
    };
}

function researchMd(uni, extra) {
    return `# Araştırma: ${uni.name}

**Slug:** \`${uni.slug}\`  
**Son tarama:** 2026-08-27  
**Kaynak:** Fakülte kimlik sayfası (slayt yok)

## Kimlik

| Alan | Bilgi |
|------|--------|
| Tür | ${uni.type === 'vakif' ? 'Vakıf' : 'Devlet'}, ${uni.city} |
| Kampüs | ${extra.campus} |
| Takvim | ${uni.calendar === 'yillik' ? 'Yıllık' : 'Dönemlik'} (OBS kesinler) |
| Dil | ${uni.lang || 'tr'} |
| Site | ${extra.url} |

## Kullanılan başlıklar

- Fakülte kimliği ve kampüs.
- Haftalık slayt omurgası **alınmadı**; Bologna PDF'si bu taramada kopyalanmadı.

## Telif

Slayt, fotokopi not ve LMS içeriği yok. Yalnız kamuya açık fakülte adı, kampüs ve kimlik URL'si.
`;
}

function researchFromOverlay(overlay, uni) {
    const src = overlay.sources?.[0] || {};
    return `# Araştırma: ${uni?.name || overlay.uniSlug}

**Slug:** \`${overlay.uniSlug}\`  
**Son tarama:** 2026-08-27  
**Kaynak:** ${src.title || 'Fakülte kimlik sayfası'} (slayt yok)

## Kimlik

| Alan | Bilgi |
|------|--------|
| Kampüs | ${overlay.campus || ''} |
| Dil | ${overlay.lang || 'tr'} |
| Takvim | ${overlay.calendar || 'donemlik'} |
| Site | ${src.url || ''} |

## Kullanılan başlıklar

${(overlay.syllabusOrder || []).map((s) => `- ${s}`).join('\n') || '- Fakülte kimliği'}

## Telif

Slayt ve amfi notu alınmadı. ${src.note || 'Yalnız kimlik ve kamuya açık başlık omurgası.'}
`;
}

function main() {
    const unis = loadUnis();
    const bySlug = Object.fromEntries(unis.map((u) => [u.slug, u]));
    const overlayDir = join(ROOT, 'lib/ders-notlari/overlays');
    const researchDir = join(ROOT, 'docs/ders-notlari/research');
    mkdirSync(overlayDir, { recursive: true });
    mkdirSync(researchDir, { recursive: true });

    let wrote = 0;
    for (const extra of EXTRA) {
        const uni = bySlug[extra.slug];
        if (!uni) throw new Error(`üniversite yok: ${extra.slug}`);
        if (!uni.active) throw new Error(`pasif üni: ${extra.slug}`);
        const overlay = overlayOf(uni, extra);
        writeFileSync(join(overlayDir, `${extra.slug}.json`), `${JSON.stringify(overlay, null, 4)}\n`, 'utf8');
        writeFileSync(join(researchDir, `${extra.slug}.md`), researchMd(uni, extra), 'utf8');
        wrote += 1;
    }

    let backfill = 0;
    for (const f of readdirSync(overlayDir).filter((x) => x.endsWith('.json'))) {
        const slug = f.replace(/\.json$/, '');
        const mdPath = join(researchDir, `${slug}.md`);
        if (existsSync(mdPath)) continue;
        const overlay = JSON.parse(readFileSync(join(overlayDir, f), 'utf8'));
        writeFileSync(mdPath, researchFromOverlay(overlay, bySlug[slug]), 'utf8');
        backfill += 1;
    }

    console.log(`[ok] overlays=${wrote} research-backfill=${backfill} total-overlays=${readdirSync(overlayDir).filter((x) => x.endsWith('.json')).length}`);
}

main();
