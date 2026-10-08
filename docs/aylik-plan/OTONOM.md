# Otonom oturum yordamı (1–30 Ekim 2026)

Bu dosya, `scripts/otonom/calis.ps1` tarafından saatte bir (ve kullanım limiti yenilenince) başlatılan başsız (`claude -p`) oturumun
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
8. Commit (yerel): derlemenin yeniden ürettiği yalnız zaman damgası değişen dosyaları geri al
   (`git checkout -- public/*sitemap*.xml public/data/publishable.json public/data/site-search-index.json`);
   bunlar yayın günü tek seferde üretilir. Sonra yalnız bu oturumun dosyalarını ekle (`git add <yollar>`),
   mesaj depo alışkanlığıyla:
   `feat(alan): ...`, `fix(alan): ...`; son satır:
   `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.
9. Kayıt: `ILERLEME.md` sonuna bir blok ekle (tarih-saat, görev, yapılanlar, test sonucu, commit kısa
   hash, sıradaki adım). Görev bittiyse `PLAN.md`'de `[x]` yap; bitmediyse "DEVAM EDİYOR" yaz.
10. Süre: yaklaşık 110 dakikadan sonra yeni iş başlatma; ağacı temiz bırak (gerekirse `wip:` önekli
    yerel commit) ve 9. adımı yap. Kullanım sınırı uyarısı gelirse hemen 8–9. adımları yap.

## Teknik tuzaklar

- **Bilinmeyen betiği denemek için çalıştırma.** Çoğu betik argüman beklemeden işe başlar ve dosya yazar
  (2026-10-01: `parse-kanun.cjs --help` 648 TBK şerh dosyasının üzerine yazdı; git'ten geri yüklendi).
  Yüklenebilirliği `node --check dosya` ile doğrula; çalıştırman gerekiyorsa önce kaynağını oku ve
  çıktı yolunu geçici bir klasöre yönlendir. İşten sonra `git status` ile beklenmeyen değişikliği ara.

- **Kullanım sınırı uyarısız gelebilir** (2026-10-02 07:47: oturum 429 ile kesildi; G09 alt planı ve ilk dosyalar
  commit'siz, ILERLEME kaydı olmadan kaldı). Alt planı yazar yazmaz `ILERLEME.md`'ye tek satır
  "Gxx DEVAM EDİYOR (başladı HH:MM)" ekle. İşaretsiz izlenmeyen dosya bulunursa son oturumun dökümünün sonu
  (`~/.claude/projects/<proje>/*.jsonl`, `"error":"rate_limit"`) ile kesintiyi doğrula.
- **Satır sonları karışık:** depodaki dosyaların çoğu CRLF, bir kısmı LF. Betikle değiştirirken `\n` içeren desen
  CRLF dosyada sıfır eşleşir; deseni `\r?\n` yap, satır sonunu dosyadan oku. Git Bash'in `od`, `cat -A`, `grep`
  araçları CR'yi göstermez; sayımı `node` ile yap. `sed -i` dosyayı LF'ye çevirir.
- **Ters bölü içeren kodu heredoc'taki betikle yazma** (2026-10-05: `node - <<'EOF'` içindeki şablon dizgisinde çift ters bölü
  dosyaya bir düzey eksik geçti; düzenli ifade kaçışları düştü, `\b` geri silme karakterine döndü). Düzenli ifade ya da kaçış
  dizisi taşıyan parçayı Edit/Write aracıyla yaz; betikten sonra `node --check` çalıştır. Aynısı kesme işaretinde de
  olur (2026-10-06: tek tırnaklı `node -e '…'` ILERLEME'ye "14:34'te" yerine "14:34te" yazdı). Türkçe metni Edit aracıyla ekle.
- **Git Bash `/` ile başlayan argümanı Windows yoluna çevirir** (2026-10-08: `node betik.mjs / anasayfa` tarayıcıya
  `http://localhost:3123C:/Program Files/Git/` adresini verdi). Adres yolu geçen komuttan önce `export MSYS_NO_PATHCONV=1` yazılır.
- `.ps1` dosyası düzenlendikten sonra UTF-8 BOM yeniden eklenir (düzenleme aracı BOM'u siler; PowerShell 5.1
  Türkçe karakterli betiği BOM'suz ANSI okur ve ayrıştırma hatası verir). Sonra
  `[System.Management.Automation.Language.Parser]::ParseFile` ile sözdizimi doğrulanır.
- **Derleme sürerken büyük klasörü listeleme** (2026-10-05: `lib/ders-notlari/generated/notes`, 11.623 dosya): `next build`
  aynı dosyaları okurken `ls`/`grep` 3 dakikayı aşıp arka plana düştü. Örnek adres ve sayımı küçük dizin dosyalarından
  al (`generated/hubs.json`, `dizin-kanonik.json`) ya da derleme bitince tara.
- **Düşük boş bellekte derleme yavaşlar** (2026-10-06 18:50: 777 MB boş bellek, işlemci %1; 88 sayfa "took more than 60 seconds"
  ile yeniden denendi, derleme 12 yerine 26 dk sürdü ama geçti). Yeniden deneme iletisi hata değildir, derleme iptal edilmez.
  Derlemeden önce boş belleği denetle (`Win32_OperatingSystem.FreePhysicalMemory`) ve kendi `next start` sunucularını kapat.
- **Sahte KIRIK kalite günlüğü** (2026-10-05 16:46: arka planda başlatılan `npm run kalite`, oturum sınırıyla süreç ağacı
  öldürülünce tip adımından sonraki her adımı "KIRIK 0 sn" ve "toplam 0 test" diye yazdı). Devralmada her adım 0 sn ise
  kırmızı test aranmaz, kapı yeniden çalıştırılır. Tam kapıyı oturumun sonuna bırakma; ~15 dk sürer. 21:33'te aynısı
  sınır olmadan tekrarladı: başsız oturum arka plan işini başlatıp turu (son yanıtı) bitirince `claude -p` süreci kapanır,
  iş de ölür. Arka plandaki kapının bitiş bildirimi gelmeden son yanıt yazılmaz.
- **Kesilen oturumdan kalan `next start`** (2026-10-06 11:25: 06:38'de başlatılan sunucu 3123'ü tutuyordu). Yeni `next start`
  `EADDRINUSE` ile ölür, ama eski süreç yanıt verdiği için ölçüm eski derlemeyi ve başlatıldığı andaki `next.config`'i
  (başlık kuralları dahil) sınar. Sunucu başlatmadan önce `netstat -ano | grep ":3123 "` ile portu kontrol et; tutan süreç
  `next start` ise (komut satırı `Get-CimInstance Win32_Process`) durdur. Oturum bitmeden kendi sunucunu kapat: arka plan
  işini durdurmak yalnız `npx` sarmalayıcısını öldürür, portu tutan `node … next start` alt süreci ayrıca durdurulur.
- Makine kapanınca ya da uykuya geçince oturum uyarısız kesilir (2026-10-03 06:48 → 2026-10-05 10:23 arası ne oturum
  ne hasat çalıştı); devralmada hasat günlüğünün son satır saati kesinti anını doğrulamaya yarar.
- Başsız oturum `ANTHROPIC_API_KEY` görürse abonelik yerine API kredisi kullanır; çalıştırıcı bunu
  kaldırır, elle `claude -p` çağrılırken de kaldırılmalıdır.

## Kalite çıtası

- Her görev bittiğinde kullanıcıya gösterilebilir durumda olmalı: test yeşil, derleme geçer, rapor yazılı.
- Görsel işlerde önce/sonra ekran görüntüsü `raporlar/gorsel/` altına.
- Emin olunamayan hukuki içerik yayına hazır işaretlenmez; `raporlar/kullaniciya-sorular.md`'ye yazılır.
