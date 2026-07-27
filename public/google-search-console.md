# Google Search Console — kurulum notu

Canlı sitede sürekli arama görünürlüğü için:

1. https://search.google.com/search-console adresine gidin
2. Mülk ekleyin: `https://avfethiguzel.com`
3. HTML etiket veya DNS doğrulaması yapın
4. `app/layout.tsx` içindeki `verification.google` alanına kodu yazın
5. Sitemap gönderin: `https://avfethiguzel.com/sitemap.xml`
6. URL Denetimi ile öncelikli sayfalar:
   - `/` `/ara` `/mevzuat` `/icthat` `/icthat/haftalik`
   - `/hesaplama` `/hesaplama/kidem` `/hesaplama/miras` `/hesaplama/faiz` `/hesaplama/vekalet`
   - `/van-avukat` `/ercis-avukat` `/avukat-fethi-guzel` `/e-durusma`
7. Performans raporunda en çok tıklanan 20 sorguyu ayda bir inceleyin (bakım loglarıyla birlikte)
8. Google İşletme Profili: Erciş ofis adresi + site + mesai (Maps görünürlüğü)

Bing Webmaster: aynı sitemap’i ekleyin.

Görseller: `https://avfethiguzel.com/images-sitemap.xml`
