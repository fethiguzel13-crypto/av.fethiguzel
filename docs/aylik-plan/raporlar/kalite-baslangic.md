# Kalite kapısı — başlangıç raporu (G01, 2026-09-30)

## Başlangıç (her takım ayrı çalıştırıldı)

| Adım | Sonuç | Süre |
|---|---|---|
| `tsc --noEmit` | geçti | 128 sn (soğuk) |
| test:quality | 28/28 | 4 sn |
| test:ders-notlari | 243/243 | 22 sn |
| test:scripts | **42/45 — 3 kırık** | 20 sn |
| test:uyelik | 27/27 | 2 sn |
| test:galaxy | **16/20 — 4 kırık** | 2 sn |
| yargi:test | 59/59 | 8 sn |
| `npm run lint` (tüm depo) | **kırık — 115 hata, 7.558 uyarı** | 347 sn |

## Kök nedenler ve düzeltmeler

1. **test:scripts (3):** Sosyal medya yazarları (`tweet-writer`, `instagram-caption-writer`) ortak
   `llm-client.js → completeText`'e taşınmış, testlerin verdiği sahte istemci yok sayılıyordu; testler
   ortamda anahtar varsa **gerçek Gemini/Claude çağrısı** yapıyordu (yavaş ve ücretli).
   → Yazarlara açık bağımlılık (`{ complete }`) eklendi; testler sahte LLM ile, ağsız koşuyor
   (20 sn → 2 sn). Kart testi, parşömen tasarımıyla gelen 190 karakter sınırına güncellendi.
2. **test:galaxy (4):** Testler 17.08.2026'daki "dört uygulama → tek asistan uygulaması" birleşmesinden
   önceki sözleşmeyi bekliyordu. → Katalog v2 sözleşmesine göre yeniden yazıldı (tek yayındaki uygulama
   `asistan`/`com.avfethiguzel.hesap`, eski dört kayıt `published:false`, sekmeler `nav.ts`'de).
3. **Lint:** Hataların bir kısmı derleme çıktısı (`mobile/android` içindeki paket JS), günlükler ve kökteki
   eski tek seferlik betiklerdi → `eslint.config.mjs` yok sayma listesine alındı. Kalan **82 hata / 34
   dosya** `scripts/lint-taban.json` tabanına yazıldı; `scripts/lint-cirir.mjs` yeni hata eklenince kapıyı
   kırar, azaldıkça tabanı düşürür. Önbellekle lint 347 sn → 8–45 sn.

## Son durum

| Adım | Sonuç | Süre |
|---|---|---|
| tip | geçti | 15 sn |
| lint (cırcır) | geçti — 82 bilinen hata tabanda | 8 sn |
| test:quality | 30/30 | 1 sn |
| test:ders-notlari | 243/243 | 11 sn |
| test:scripts | 49/49 | 2 sn |
| test:uyelik | 27/27 | 1 sn |
| test:galaxy | 22/22 | 1 sn |
| test:yargi | 59/59 | 7 sn |
| test:mobil | 36/36 | 1 sn |
| **Toplam** | **466 test, kapı geçti** | **48 sn** |

## Açık kalan (G01b)

Tabandaki 82 lint hatası: öncelik sırası
1. `react-hooks/rules-of-hooks` (3) — koşullu hook çağrısı, gerçek hata adayı.
2. `react-hooks/set-state-in-effect` (16) — gereksiz yeniden çizim.
3. `@next/next/no-html-link-for-pages` (25) — iç bağlantılarda `<a>` yerine `<Link>` (istemci geçişi, performans).
4. Diğerleri (no-unescaped-entities, prefer-const, no-explicit-any, no-require-imports).
