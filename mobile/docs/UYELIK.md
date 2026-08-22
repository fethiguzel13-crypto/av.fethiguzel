# Yargı arşivi üyeliği

Uygulamanın dört bölümünden yalnız biri ücretlidir: **Yargıtay arşivindeki
kararların tam metni**. Mevzuat, Kitaplık ve Hesaplama ücretsizdir ve öyle
kalacaktır; günlük içtihat özetleri de üyelik istemez.

## Sınır tam olarak nerede

| Ücretsiz | Üyelik ister |
|---|---|
| Arşiv listesi, arama, süzme | Kararın tam metni |
| Künye (daire, esas, karar, tarih) | — |
| Uyuşmazlık konusu, dava türü | — |
| Kararın atıf yaptığı maddeler | — |
| Kararın ilk ~420 karakteri (önizleme) | Gerisi |
| Günlük içtihat özetleri | — |

Listeyi de kapatmak ilk bakışta daha tutarlı görünür; ne var ki bölüm o zaman
boş bir duvara döner ve kullanıcı neye para ödeyeceğini göremez. Sınır tek
yerden değiştirilebilir: `lib/uyelik.ts` → `ARSIV_LISTESI_ACIK`.

## Play Console kurulumu

Uygulama yayımlanmadan önce Play Console'da abonelik ürünü tanımlanmalıdır.
Ürün kimliği koda gömülüdür ve **birebir** aynı olmalıdır:

```
Ürün kimliği : yargi_arsivi_aylik      (lib/uyelik.ts → URUN_ID)
Fatura dönemi: aylık (P1M)
Fiyat        : 500,00 TL
Ülke         : Türkiye
```

Adımlar: *Para kazanma → Abonelikler → Abonelik oluştur*. Bir **temel plan**
(`aylik`, otomatik yenilemeli) eklenmeli ve etkinleştirilmelidir. Ürün etkin
değilse uygulama fiyatı okuyamaz ve yedek değeri (`YEDEK_FIYAT`) gösterir;
satın alma da başlamaz.

Ödeme **Google Play Faturalandırma** ile alınır. Play, uygulama içi dijital
içeriği havale, iyzico ya da başka bir sağlayıcıyla satmayı yasaklar; ihlâl
uygulamanın kaldırılması demektir. Play komisyonu ilk 1 milyon dolara kadar
%15'tir.

## Mağaza kaydı

Play politikası, uygulama içi satın alma taşıyan bir uygulamanın açıklamasında
bunun belirtilmesini zorunlu kılar. Vitrin metnine şu bilgi girmelidir:

> Mevzuat, kavram sözlüğü, rehberler ve hesaplama araçları ücretsizdir.
> Yargıtay arşivindeki kararların tam metni aylık 500 TL abonelikle açılır.

## Çevrimdışı geçerlilik

Bu uygulamanın varlık sebebi çevrimdışı çalışmasıdır. Duruşma salonunda çeken
telefon yoktur; Play sunucusuna ulaşılamadığı için aboneliğin kapanması, ödeme
yapmış bir avukatı tam ihtiyaç anında kapıda bırakır.

Bu yüzden Play'den alınan son doğrulama cihazda saklanır ve ağ olmadan
**14 gün** geçerli sayılır (`CEVRIMDISI_GUN`). Sayaç yalnız Play'e
*ulaşılamadığında* işler; Play "abonelik yok" derse pay uzatılmaz.

## İndirme koruması — ne yapar, ne yapmaz

Üç katman vardır:

1. **Şifreli kasa.** Karar metinleri pakete AES-256-GCM ile şifrelenmiş 80
   parça hâlinde girer (`data-src/icthat/kasa/sNN.bin`). Şifresiz kopya
   pakete hiç girmez; `build-app.mjs` içindeki `PAKETE_GIRMEZ` süzgeci eler,
   `verify-release.mjs` süzgecin çalıştığını ayrıca doğrular.
2. **Ekran koruması.** Karar okuma ekranı açıkken Android penceresine
   `FLAG_SECURE` konur: ekran görüntüsü ve ekran kaydı engellenir, son
   kullanılanlar listesinde içerik yerine boş kart görünür
   (`EkranKorumaPlugin.java`). Bayrak yalnız bu ekranda açılır; kanun
   maddesinin ekran görüntüsü alınabilmelidir.
3. **Metin seçilemezliği.** Ücretli metin blokunda seçim ve kopyalama
   kapalıdır (`SECILEMEZ`). Künye ayrı düğmeyle kopyalanabilir — dilekçeye
   yazılacak olan zaten künyedir.

**Dürüst sınır:** uygulama çevrimdışı çalışmak zorunda olduğu için anahtar da
uygulamayla birlikte dağıtılır. Anahtar dört parçaya bölünüp XOR maskesiyle
gizlenir ve derleme sırasında koda gömülür; bu, APK'yı açıp dosyaları okumayı,
dosya dosya paylaşmayı ve `strings` ile aramayı durdurur. Kararlı bir tersine
mühendisi durdurmaz. Bunu durdurmanın tek yolu metni sunucuda tutmaktır ki bu
da çevrimdışı çalışmayı bitirir. Tercih bilinçlidir.

`FLAG_SECURE` cihaz üzerindeki yazılımsal kaydı engeller; ikinci bir telefonla
ekranın fotoğrafını çekmeyi engellemez.

## Anahtar yönetimi

`build-yargi-sifrele.mjs` her koşuda yeni anahtar üretip
`data-src/icthat/kasa-anahtar.json` dosyasına yazar. Bu dosya `.gitignore`
içindedir ve pakete girmez.

Yeni anahtarla üretilen kasa, eski anahtarla derlenmiş bir arayüzle
çözülemez — kasa ve arayüz **aynı koşuda** üretilmelidir. `build-app.mjs`
bunu zaten sırayla yapar. CI'da anahtar gizli değişken olarak verilir:
`KASA_PARCA`, `KASA_TUZ`, `KASA_TUR`.

## Geliştirme ve mağaza incelemesi

Play inceleme ekibinin ücretli içeriği görebilmesi gerekir. `uyelik.ts`
içindeki `uyelikElleAc(gun)` erişimi elle açar; incelemeye lisanslı bir test
hesabı tanımlamak (Play Console → *Ayarlar → Lisans testi*) daha temizdir,
zira o yolda satın alma akışının kendisi de denenebilir.

## Avukatlık Kanunu notu

Uygulama avukatın kendi adını taşıyor ve ücretli abonelik satıyor. Avukatlık
Kanunu'nun ticaret yasağı ve reklam yasağı hükümleri karşısında bunun baroya
sorulması yerinde olur; teknik taraf hazırdır, değerlendirme meslek
mevzuatına aittir.
