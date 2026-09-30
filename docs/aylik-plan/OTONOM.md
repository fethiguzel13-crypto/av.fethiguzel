# Otonom oturum yordamı (1–30 Ekim 2026)

Bu dosya, `scripts/otonom/calis.ps1` tarafından 3 saatte bir başlatılan başsız (`claude -p`) oturumun
talimatıdır. Kullanıcı bu dönemde "ben demeden çalışmaya başla ve devam ettir" dedi; soru sorulmaz,
karar gerekiyorsa en güvenli seçenek uygulanır ve `raporlar/kullaniciya-sorular.md`'ye yazılır.

## Kesin yasaklar

1. `git push` (hangi biçimde olursa olsun), `--no-verify`, `PUSH_IZNI`, hook dosyasına dokunmak.
2. `vercel`, `npm publish`, Play Console / App Store yüklemesi, sosyal medya paylaşımı, e-posta gönderimi.
3. `data/yargi-kararlari/`, `data/uyelik/`, `.env*`, `*.jks`, anahtar dosyalarını silmek/taşımak ya da
   içeriğini loga yazmak.
4. Hasat motorunun hız ayarlarını yükseltmek; motoru `hasat-servis.ps1 -Durdur` dışında durdurmak.
5. Doğrulanmamış kanun maddesi, karar künyesi, yazar atfı yazmak.
6. Avukatlık reklam yasağına aykırı metin eklemek.

## Yordam

1. `docs/aylik-plan/DURAKLAT` dosyası varsa hiçbir şey yapmadan çık.
2. `docs/aylik-plan/PLAN.md` ve `docs/aylik-plan/ILERLEME.md` (son 40 satır) dosyalarını oku.
3. `git status --porcelain` ile çalışma ağacını kontrol et:
   - `ILERLEME.md`'de "DEVAM EDİYOR" işaretli görev varsa ve değişiklikler onunsa, o görevi sürdür.
   - Tanınmayan değişiklik varsa (başka oturum): dokunma, raporla, yalnız kendi dosyalarınla çalış.
4. Görev seç: `DEVAM EDİYOR` olan, yoksa bağımlılıkları `[x]` olan ilk `[ ]` görev. Pazartesi günleri
   önce G08 (hasat bakımı) yapılır.
5. Alt plan: `docs/aylik-plan/gorevler/Gxx.md` yoksa önce onu yaz (dosyalar, adımlar, testler,
   kabul ölçütü). Varsa kaldığın adımdan devam et.
6. Uygula: kod değişikliğinde önce test (TDD), küçük adımlar. İlgili becerileri yükle (security-review,
   impeccable, dataviz, hukuki-halusinasyon-onleme, akademik-hukuk-uslubu, test-driven-development).
7. Doğrula: `npm run kalite:hizli` (G01 bitmeden önce: ilgili test takımı + `npx tsc --noEmit`).
   Günün ilk oturumunda ya da büyük değişiklikten sonra `npm run kalite` (derleme dahil).
8. Commit (yerel): yalnız bu oturumun dosyalarını ekle (`git add <yollar>`), mesaj depo alışkanlığıyla:
   `feat(alan): ...`, `fix(alan): ...`; son satır:
   `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.
9. Kayıt: `ILERLEME.md` sonuna bir blok ekle (tarih-saat, görev, yapılanlar, test sonucu, commit kısa
   hash, sıradaki adım). Görev bittiyse `PLAN.md`'de `[x]` yap; bitmediyse "DEVAM EDİYOR" yaz.
10. Süre: yaklaşık 110 dakikadan sonra yeni iş başlatma; ağacı temiz bırak (gerekirse `wip:` önekli
    yerel commit) ve 9. adımı yap. Kullanım sınırı uyarısı gelirse hemen 8–9. adımları yap.

## Kalite çıtası

- Her görev bittiğinde kullanıcıya gösterilebilir durumda olmalı: test yeşil, derleme geçer, rapor yazılı.
- Görsel işlerde önce/sonra ekran görüntüsü `raporlar/gorsel/` altına.
- Emin olunamayan hukuki içerik yayına hazır işaretlenmez; `raporlar/kullaniciya-sorular.md`'ye yazılır.
