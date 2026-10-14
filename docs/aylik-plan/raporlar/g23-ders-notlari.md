# G23 — Ders notları kalite dalgası 2 · rapor

Bu rapor G23 adımları ilerledikçe doldurulmaktadır. Son güncelleme: 2026-10-14 (adım 1).

Ölçütler ve yöntem G19 ile aynıdır (`raporlar/g19-ders-notlari.md`). Ölçüm komutu `node scripts/ders-kanonik-olc.mjs --dalga=2`'dir,
ders listesi `lib/ders-notlari/kalite-dalgalari.mjs`'tedir.

## Başlangıç (2026-10-14 07:35)

Değer sütunu: Paragrafta ham artıklı paragraf sayısı, örnek olay/iskelet/tuzak/testte kalem sayısı, kaynakta doğrulanan dayanak
sayısı, şemada ders şeması sayısıdır.

| Ders | Paragraf | Örnek olay | İskelet | Tuzak | Kaynak | Şema | Test | Geçen |
|---|---|---|---|---|---|---|---|---|
| aile-hukuku | ✗ 119 | ✗ 7 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| borclar-ozel | ✗ 146 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| medeni-baslangic | ✗ 116 | ✗ 10 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| kiymetli-evrak | ✗ 95 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| sigorta-hukuku | ✗ 98 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| ceza-ozel | ✗ 81 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| ceza-muhakemesi | ✗ 80 | ✗ 6 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| tuketici-hukuku | ✗ 82 | ✗ 7 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| arabuluculuk | ✗ 95 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| vergi-hukuku | ✗ 92 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |

Örnek olay sütunu G19 başlangıcındaki gibi kalıp olayları sayar; ölçüt, olayların birbirinden farklı ve dayanaklı olmasını
aradığından hiçbiri geçmemektedir. Dalga 1'in on notu aynı ölçümde 7/7'de kalmaktadır.
