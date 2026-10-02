# Avukatlık reklam yasağı uyum denetimi (G07) — 2026-10-02

## Ölçüt metinleri

Denetimde yalnız birincil kaynaktan bugün okunan metinler esas alınmıştır.

- **1136 sayılı Avukatlık Kanunu m.55.** Avukatların iş elde etmek için reklam sayılabilecek her türlü teşebbüs ve
  harekette bulunmaları, tabela ve basılı kâğıtlarda avukat unvanı ile akademik unvanları dışında sıfat
  kullanmaları yasaktır; esaslar TBB yönetmeliğiyle belirlenir. Kanunun 24/12/2025 tarihli ve 7571 sayılı Kanunla
  değişik m.135/2-a hükmü, reklam yasağının ihlalini kınama cezasına bağlamıştır.
  (mevzuat.gov.tr, `mevzuatmetin/1.5.1136.pdf`, erişim 02.10.2026)
- **Türkiye Barolar Birliği Reklam Yasağı Yönetmeliği** (RG 21/11/2003-25296; son değişiklikler RG 9/8/2024-32627 ve
  RG 2/5/2026-33241). Denetimle ilgili hükümler şunlardır:
  - m.6/2 ve m.6/5: Basılı ve elektronik belgelerde yalnız sayılan bilgiler yer alabilir. Avukat ve hukuk alanındaki
    akademik unvan dışında "hukuk uzmanı, … bilirkişi … ve benzeri sıfatlar" kullanılamaz.
  - m.7/1-c: Avukatlar *iş elde etme amacıyla, ulaşılması herkes için mümkün olan genel ve soyut içerikli bilgiler
    paylaşmak suretiyle* yayın yapamaz.
  - m.7/1-d: İnternet sitesinin içerebileceği bilgiler tek tek sayılmıştır (ad-soyad, akademik unvan, fotoğraf, sicil
    numaraları, mesleğe başlama tarihi, mezun olunan üniversite, yabancı dil, büro adresi, telefon, e-posta). Sitede
    "referanslar" adı altında müvekkil bilgisi paylaşılamaz. Uzmanlık anlamına gelmemek üzere faaliyet alanları
    hakkında bilgi verilebilir.
  - m.7/1-e: İş elde etme amacıyla ve meslektaşlarla rekabete yol açacak şekilde, site tasarımında ya da arama
    motorlarınca algılanan kodlarda *arama motorlarında üst sıralarda yer almaya yönelik yönlendirici kod, anahtar
    sözcük, alt alan adı, sayfa adresi* kullanılamaz; çevrimiçi mecralarda reklam verilemez.
  - m.11: Üçüncü kişilerin reklam sayılabilecek eylemlerine izin verilmez.
  - m.12/A (2026): Çevrimiçi ihlalleri izleyip barolara bildiren Reklam Yasağı İhlallerini Takip Merkezi kurulmuştur.
  (mevzuat.gov.tr, mevzuat no. 8111, KurumVeKurulusYonetmeligi PDF; yayım bilgisi d.barobirlik.org.tr
  `Reklam_Yasagi_Yonetmeligi.pdf` kapağından, erişim 02.10.2026)

Bu iki metin, 2026-09-30 tarihli plan ölçütünü daraltmaktadır. Plan "üstünlük iddiası, müvekkil yorumu, ücret
ilanı, çağrı" yasağını sayıyordu. 2024 değişikliği ise arama motoru odaklı sayfa adresi ve anahtar sözcüğü
doğrudan yasak kapsamına almıştır. Bu nedenle sitenin en büyük riski tek tek ifadelerde değil, yapıdadır.

## Yöntem

`app/`, `components/`, `lib/bolge-bilgi.ts`, `lib/profile.ts`, `lib/bolge-makaleler/`, `mobile/store-listing/` ve
`mobile/app-src/` kaynakları ifade sınıflarına göre taranmıştır. Bu sınıflar üstünlük iddiası, sonuç ve başarı
vaadi, çağrı, ücret ve indirim, müvekkil ve referans, sıfat, anahtar sözcük ile sayfa adresidir. Bulgular kaynakta
bağlamıyla okunmuştur. "En iyi" ve "garanti" eşleşmelerinin çoğu "en iyi avukat iddiası içermez" türü uyarılar ya da
hesaplama araçlarındaki "bilgi amaçlıdır, garanti değildir" notlarıdır; bunlar sorun değildir. Sitede madde numarası
veren bir reklam yasağı atfı bulunmamaktadır; yasal uyarı ve akademik profil sayfası genel gönderme yapmaktadır.

## Bu görevde düzeltilenler

| Yer | Eski | Kural | Yeni |
|---|---|---|---|
| `app/layout.tsx` (site geneli metadata) | anahtar sözcük "Erciş avukat" | m.7/1-e | çıkarıldı |
| `app/avukat-fethi-guzel/page.tsx` | "Erciş avukat", "İngilizce bilen avukat" | m.7/1-e | çıkarıldı (ad-soyad ve unvan kaldı) |
| `lib/bolge-bilgi.ts` (Erciş sayfası) | "Erciş avukat", "Van Erciş hukuk bürosu" | m.7/1-e | çıkarıldı |
| Mobil mağaza metni ×4 (`hesap`, `icthat`, `portal`, `rehber`) | "Av. Fethi Güzel — Van · Erciş avukat ve arabulucu" | m.7/1-e | "Av. Fethi Güzel — Avukat & Arabulucu · Van, Erciş" (`asistan` metniyle aynı) |
| `app/layout.tsx` LegalService JSON-LD | `priceRange: '$$'` | m.7/1-d (izinli bilgilerde ücret yok) | çıkarıldı |
| `components/FaqSection.tsx` | "Dünyanın en iyi hukuk siteleri ziyaretçiyi belirsizlikte bırakmaz." | m.55 (örtük üstünlük karşılaştırması) | cümle çıkarıldı |

Meta `keywords` etiketi Google sıralamasında kullanılmadığından bu çıkarmaların arama görünürlüğüne etkisi yoktur.
Kilit testi `lib/__tests__/reklam-uyum.test.mjs` (3 test, önce kırmızı) metadata'ya ve mağaza metnine yeniden
"yer + avukat" arama ifadesi yazılmasını ve JSON-LD'de ücret düzeyi ilanını engeller.

## Kullanıcı kararı gereken yapısal riskler

Aşağıdaki maddeler sitenin arama stratejisini değiştirdiği için ajan tarafından uygulanmamıştır. 30 Ekim'e kadar
yayın olmadığından mevcut durum korunmuş olup riski artırmamaktadır. Kararlar `kullaniciya-sorular.md` 10–13'tedir;
push öncesi (G26) yanıtlanmaları gerekir.

**R1 — Bölge sayfası adresleri (yüksek).** `adilcevaz-avukat`, `agri-avukat`, `ahlat-avukat`, `ankara-avukat`,
`bitlis-avukat`, `caldiran-avukat`, `ercis-avukat`, `muradiye-avukat`, `ozalp-avukat`, `patnos-avukat`,
`tatvan-avukat`, `van-avukat` (12 sayfa) ile `english-speaking-lawyer` dizine açıktır ve site haritasındadır. Sayfa
içerikleri daha önce bilgilendirmeye çevrilmiştir. Ne var ki adreslerin kendisi "yer + avukat" aramasına göre
kurulmuştur ve m.7/1-e "sayfa adresi" yasağının tarif ettiği yapıya uymaktadır. Büronun bulunmadığı yerler (Ankara,
Ağrı, Bitlis gibi) için iş elde etme amacı çıkarımı daha güçlüdür. Önerimiz şöyledir: Erciş sayfası büro adres
bilgisi olarak (m.7/1-d) tarafsız bir adrese, örneğin `/buro`, 308 ile taşınır. Diğer 11 bölge sayfası ile
`english-speaking-lawyer` için `noindex` verilir ve site haritalarından çıkarılır; sayfalar ziyaretçi için açık
kalır. Daha hafif seçenek yalnız adres değiştirmektir, ancak eski adresler yönlendirme olarak yaşamaya devam eder.

**R2 — Her sayfadaki LegalService şeması (orta).** Kök yerleşim her sayfaya `areaServed` (7 yerleşim) ve hizmet
`OfferCatalog`'u taşıyan bir LegalService bloğu basmaktadır. Bu blok, m.7/1-e'deki "arama motorlarınca algılanan
kod" kapsamına girer. Önerimiz LegalService'in yalnız yazar/profil sayfasında, m.7/1-d'deki bilgilerle (ad, unvan,
adres, telefon, e-posta) sınırlı tutulmasıdır. `areaServed` ve `OfferCatalog` bu blokta yer almamalıdır. Site
genelinde Person şeması yazar kimliği olarak kalır (G09/G10 ile aynı iş). Aynı blokta ve profil bileşenlerinde
kullanılan fotoğrafın dosya adı (`av-fethi-guzel-van-ercis-avukat.jpg`) de "yer + avukat" kalıbını taşımaktadır;
R1 kararıyla birlikte tarafsız bir adla (örneğin `av-fethi-guzel.jpg`) değiştirilmelidir.

**R3 — "Arabulucu" sıfatı (orta).** Ad-soyadın yanında "Avukat & Arabulucu" kullanılmaktadır: Person `jobTitle`,
ana sayfa, `TrustBar`, `Footer` ve mağaza metinleri. m.55 tabela ve basılı kâğıtta, Yönetmelik m.6/5 ise elektronik
belgede avukat ve akademik unvan dışındaki "benzeri sıfatları" yasaklamaktadır. Arabuluculuğun bu kapsamda
sayılıp sayılmadığına dair bir TBB ya da baro disiplin kararı bu oturumda doğrulanamamıştır; bu nedenle kesin
hüküm kurulmamıştır. Daha güvenli kullanım, arabuluculuğu adın yanında sıfat olarak değil, faaliyet alanı bilgisi
olarak vermektir (m.7/1-d son cümle).

**R4 — İçerik sayfalarında iş elde etme bağlantısı (orta).** Mobil yapışkan çubuk (`StickyMobileCta`) her içerik
sayfasında "Form" düğmesiyle müvekkil ön formuna götürmektedir. SSS'de "Danışmanlık veya randevu nasıl alınır?"
sorusu yer almaktadır. m.7/1-c genel ve soyut içerikli yayını tek başına yasaklamamakta, yalnız iş elde etme
amacıyla yapılanı yasaklamaktadır. Mevzuat, şerh ve rehber sayfalarını müvekkil kabul akışına bağlayan öğeler bu
amaç çıkarımını güçlendirmektedir. Önerimiz, çubukta yalnız "Ara" ve "Hesap" düğmelerinin kalması, ön forma ise
yalnız yazar/iletişim sayfasından ulaşılmasıdır.

**R5 — Plan hedefi (bilgi).** Kullanıcı talimatındaki "Tüm Türkiye'de ön sıralarda çıksın" hedefi, m.7/1-e
karşısında yalnız içerik sorgularına (kanun maddesi, şerh, karar, hesaplama, rehber) yönelik olarak
uygulanabilir. PLAN.md genel kurallarına bu yönde bir satır eklenmiştir; sonraki SEO görevleri (G09–G13) "avukat"
içeren yerel arama ifadesini hedeflemeyecektir.

## Düşük risk ve gözlemler

- "Reklam yasağına uygun(dur)" ibaresi arayüzde 17 yerde tekrarlanmaktadır (alt bilgi, profil, rehber, hizmetler, form).
  Bir beyan içeriği uyumlu kılmaz; tekrarlanması savunmacı bir izlenim bırakır. İbarenin yasal uyarı sayfası ile alt
  bilgide kalması yeterlidir (G16).
- Hesaplama aracındaki "Tahmini Başarı Olasılığı" çıktısı avukatın başarısına değil davanın genel risk çerçevesine
  ilişkindir ve uyarı taşımaktadır; reklam yasağı kapsamında görülmemiştir. Etiketin "kaba risk göstergesi" olarak
  adlandırılması G22'de değerlendirilebilir.
- WhatsApp bağlantısı `PROFILE.whatsapp` boş olduğu için görünmemektedir. Müvekkil yorumu, referans, ücret ilanı,
  indirim ve "hemen arayın" türü çağrı bulunmamıştır ("indirim" ve "ücretsiz" eşleşmeleri ücretsiz mevzuat
  erişimi ile hesaplama terimleridir).
