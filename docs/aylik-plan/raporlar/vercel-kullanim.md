# Vercel kullanımı ve site kapanması (G00) — 2026-10-01

## Durum

2026-10-01 sabahı avfethiguzel.com ve www.avfethiguzel.com'daki **tüm adresler** (ana sayfa, robots.txt,
sitemap, API) Vercel'den `402 Payment required` + `X-Vercel-Error: DEPLOYMENT_DISABLED` dönüyor.
Bu yanıt, Vercel'in ücretsiz (Hobby) planda kullanım limiti aşılınca ya da ödeme sorununda projeyi
durdurduğunda verilir. **Hangi limitin aşıldığı yalnız Vercel panelinde (Usage) görülebilir** — ajanın
erişimi yok.

Çalışmaya devam eden: jsDelivr/GitHub üzerinden sunulan içerik paketleri (mobil uygulamanın çevrimdışı
mevzuatı). Kapalı olan: tüm web sayfaları, üyelik ve ödeme API'leri.

## Kod tarafındaki kullanım sürücüleri (ölçüldü)

| # | Sürücü | Ölçüm | Durum |
|---|---|---|---|
| 1 | `/mevzuat` ve `/ara` her açılışta tam metin indeksini indiriyordu | 8,9 MB ham, ~1,0–1,5 MB sıkıştırılmış; 6,5 MB'ı madde metinleri | **Düzeltildi** (`a33f0aa67`): yalnız arama yapılınca iner |
| 2 | Tüm yapay zekâ tarayıcılarına açık `robots.ts` (Bytespider, CCBot dahil) | On binlerce sayfa × sık tarama → istek ve aktarım | **Karar sizde** (aşağıda) |
| 3 | Her madde sayfası sunucu fonksiyonu (`/mevzuat/[kanunId]/[id]`, ~7.600 madde) | Başarılı yanıt 24 saat CDN önbelleğinde; hata yanıtlarında önbellek yok | İzleniyor |
| 4 | Karar sayfaları (`/icthat/[id]`, `/yargi-kararlari/[id]`) dinamik | Her ziyaret fonksiyon çağrısı | G13'te önbellek/ISR |
| 5 | `public/` 307 MB (seo-madde 102 MB, aynı paketlerin üç kopyası: packs / content-packs / app-packs) | Dağıtım boyutu (kullanım değil) | G13 |
| 6 | Kullanılmayan 9 bileşen + 4 adet 5,5–7,1 MB PNG | Sayfalara inmiyor; yalnız yük ve lint borcu | G01b'de temizlik |

## Kullanıcıdan gereken

1. Vercel → proje → **Usage** sekmesi: hangi kalem kırmızı (Function Invocations, Fast Data Transfer,
   Edge Requests, Image Optimization, Build minutes)? Bunu bildirin; ajan önceliği buna göre belirler.
2. Hızlı açmak için iki yol: (a) Pro plana geçmek (aylık ücretli, limitler çok daha yüksek),
   (b) kullanım döneminin sıfırlanmasını beklemek (site o güne kadar kapalı kalır).
3. Site açıldıktan sonra bu aylık çalışmadaki iyileştirmeler 30 Ekim'de yayına girecek; erken yayın
   isterseniz (ör. yalnız #1 düzeltmesi) karar sizin.
