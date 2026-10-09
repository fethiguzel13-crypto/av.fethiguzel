# G19 — Ders notları kalite dalgası 1

**Kapsam:** Kalite dalgasındaki on dersin dizine açık temsilci notu (`lib/ders-notlari/dizin-kanonik.json`, hepsi
`ankara/<ders>-yillik`). Ölçüt `docs/ders-notlari/KALITE-VE-ARASTIRMA.md` §4'ten türetilmiş yedi kalemdir
(`lib/ders-notlari/kanonik-kalite.mjs`, test `lib/__tests__/ders-kanonik-kalite.test.mjs`). Ölçüm komutu:
`node scripts/ders-kanonik-olc.mjs --ayrinti`.

## Ölçütler

| Ölçüt | Geçme koşulu |
|---|---|
| Paragraf | Öğretim bölümlerinde ham kanun başlığı artığı (`**…**`, `--- MADDE`) 0 ve her bölümde en az iki paragraf |
| Örnek olay | En az üç olay; iki olay arasında 8 sözcükten uzun ortak dizi yok; her olay kanun metninde doğrulanan bir dayanak taşır |
| İskelet | Sınav iskeleti en az dört adım |
| Tuzak | Tuzak defteri en az beş kalem, her kalem dayanaklı |
| Kaynak | En az bir adresli kaynak; nottaki bütün dayanakların ifadesi `content/mevzuat/<kanun>/madde-<n>.md` kanun metninde aynen geçer |
| Şema | Ders G18 şemalarından en az birini alır |
| Test | En az beş soru; dört şık birbirinden farklı, cevap geçerli, gerekçe ve dayanak var |

Değer sütunu: Paragrafta ham artıklı paragraf sayısı, örnek olay/iskelet/tuzak/testte kalem sayısı, kaynakta doğrulanan dayanak
sayısı, şemada şema sayısı.

## Başlangıç (2026-10-09 07:30, `775cbc258`)

| Ders | Paragraf | Örnek olay | İskelet | Tuzak | Kaynak | Şema | Test | Geçen |
|---|---|---|---|---|---|---|---|---|
| borclar-genel | ✗ 140 | ✗ 12 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| medeni-usul | ✗ 105 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| ceza-genel | ✗ 94 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| icra-iflas | ✗ 111 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| miras-hukuku | ✗ 131 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| esya-hukuku | ✗ 133 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| is-hukuku | ✗ 71 | ✗ 6 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| ticari-isletme | ✗ 97 | ✗ 7 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| ticaret-sirketler | ✗ 96 | ✗ 7 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| idare-hukuku | ✗ 94 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |

Bulgular:

- Örnek olayların tamamı aynı kalıptan üretilmiştir. On notta iki olay arasındaki en uzun ortak dizi 15-16 sözcüktür
  ("…'daki bir kira ve kefalet uyuşmazlığı içinde taraf, X rejimine dayanarak talep yöneltir. Karşı taraf unsurların oluşmadığını
  ileri sürer."); olayda kişi, tarih, tutar ve uyuşmazlık konusu yoktur.
- Notlardaki çoktan seçmeli sorular (`topics[].mcq`) biçimseldir ve yanlış şıkları konu dışıdır ("Hocanın slaytını ezberden aktarmak",
  "İYUK iptal davası"). Ölçüt yalnız yeni `kisaTest` alanını sayar.
- Öğretim bölümlerindeki paragrafların 71-140'ı kanun alıntısını ham başlık artığıyla taşır
  («**Sözleşmeden Doğan Borç İlişkileri A. …** --- MADDE 1- …»).
- Anayasa hukukunun temsilci notu, ders grafı ve yerel mevzuat dosyası bulunmadığından ölçüme girmemiştir (`gorevler/G19.md`).
