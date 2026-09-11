#!/usr/bin/env python3
"""NotebookLM pack for İÜHF borçlar-genel. Reuses TBK official text; faculty map is İÜHF."""
from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "ders-notlari" / "notebooklm" / "iuhf-borclar-genel"
SRC = ROOT / "docs" / "ders-notlari" / "notebooklm" / "aybu-borclar-genel"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(SRC / "tbk-genel-lafiz.md", OUT / "tbk-genel-lafiz.md")
    shutil.copyfile(SRC / "graf.md", OUT / "graf.md")
    (OUT / "iuhf-harita.md").write_text(
        """# İÜHF Borçlar Genel — kamuya açık harita

Slug: istanbul. Kampüs: Beyazıt. Takvim: yıllık zorunlu (HUKK2074, 12 AKTS).

Hoca slaytı ve amfi notu yoktur. Yalnız EBS ders adı, AKTS ve başlık omurgası.

## Fakülte sınav kültürü

- Klasik uzun yazılı: kurumun adı, TBK maddesi, unsur, Yargıtay cümlesi (künye varsa)
- İlk cümle kaynağı söyler: sözleşme / haksız fiil / sebepsiz zenginleşme
- Güz paketi vizeye, yıllık paket finale daha yakındır
- İstanbul ekolü: Oğuzman/Öz hattı izlencelerde anılır, sayfa uydurulmaz
- City hook: Beyazıt'taki dükkân devri ve icap-kabul uyuşmazlığı
- Amfi + pratik çalışma; kâğıtta lafız önce gelir

## EBS başlık omurgası

kaynaklar → sözleşme → haksız fiil → sebepsiz zenginleşme → ifa → sona erme → zamanaşımı → temlik

Graf kurumları (Güz): borç ilişkisi, icap-kabul, irade sakatlıkları, temsil, genel işlem koşulları
Graf kurumları (Bahar): ifa, temerrüt, ifa imkânsızlığı, haksız fiil, sebepsiz zenginleşme, sona erme, zamanaşımı

Temlik (alacağın devri) EBS başlığındadır; bu pakette ayrı graf kurumu yoktur — uydurma madde yazılmaz.

## Tuzaklar

- İcap ile icaba davet
- Temerrüt ile ayıp
- Zamanaşımı ile hak düşürücü süre (resen ileri sürülemez)
- GİK yazılmamış sayılma ile genel butlan
- Kaynak kapısı yazılmadan temerrüt/tazminat
- Sebepsiz zenginleşmeyi asli kaynak sanmak

## Kaynaklar

- https://ebs.istanbul.edu.tr/home/dersprogram?id=1117
- https://cdn.istanbul.edu.tr/FileHandler2.ashx?f=2024-2025-ogretim-yili--guz-yariyili-ders--programi.pdf

## Üretim kuralı

Quiz TBK lafzı ve unsurları ölçer. Slayt cümlesi yok. Künye yoksa yazılmaz. AYBÜ veya AÜHF notunu İÜHF diye etiketlemek yasak.
""",
        encoding="utf-8",
    )
    for p in sorted(OUT.iterdir()):
        print(f"{p.name}\t{p.stat().st_size}")


if __name__ == "__main__":
    main()
