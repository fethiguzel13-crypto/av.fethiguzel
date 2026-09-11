#!/usr/bin/env python3
"""NotebookLM source pack for AYBÜ borçlar-genel. Official TBK text only (FSEK m.31)."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "ders-notlari" / "notebooklm" / "aybu-borclar-genel"
GRAPH = ROOT / "lib" / "ders-notlari" / "graphs" / "borclar-genel.json"
TBK = ROOT / "content" / "mevzuat" / "tbk"

ARTICLES = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
    "20", "21", "22", "23", "24", "25",
    "30", "31", "32", "36", "37", "38", "39",
    "40", "41", "42", "43", "44", "45", "46", "47", "48",
    "49", "50", "51", "52", "53", "54", "55", "56",
    "77", "78", "79", "80", "81", "82",
    "83", "84", "85", "86", "87", "88", "89", "90",
    "117", "118", "119", "120", "121", "122", "123", "124", "125",
    "132", "133", "134", "135", "136", "137",
    "146", "147", "148", "149", "150", "151", "152", "153",
    "154", "155", "156", "157", "158", "159", "160", "161",
]


def official_of(n: str) -> str | None:
    p = TBK / f"madde-{n}.md"
    if not p.exists():
        return None
    raw = p.read_text(encoding="utf-8")
    body = re.sub(r"^---[\s\S]*?---\n", "", raw)
    official = re.split(
        r"\n### (?:Akademik Yorum ve Analiz|Bizim Yorumumuz)\s*\n", body
    )[0]
    return re.sub(r"\n---\s*$", "", official).strip()


def write_lafiz() -> None:
    parts = [
        "# TBK Genel Hükümler — resmi lafız (FSEK m. 31)\n",
        "Şerh metni yoktur. Yalnız Resmi Gazete lafzı. AYBÜ notu için kaynak paketi.\n",
    ]
    for n in ARTICLES:
        text = official_of(n)
        if not text:
            continue
        parts.append(f"\n## Madde {n}\n\n{text}\n")
    (OUT / "tbk-genel-lafiz.md").write_text("\n".join(parts), encoding="utf-8")


def write_graf() -> None:
    g = json.loads(GRAPH.read_text(encoding="utf-8"))
    lines = [
        f"# Graf: {g['title']}",
        "",
        f"Ders kodu: {g['courseCode']}",
        f"Güz: {', '.join(g['guzInstitutionIds'])}",
        f"Bahar: {', '.join(g['baharInstitutionIds'])}",
        "",
    ]
    for inst in g["institutions"]:
        refs = ", ".join(
            f"{r['kanunId'].upper()} m.{r['maddeNo']}"
            for r in inst.get("statuteRefs") or []
        )
        lines += [
            f"## {inst['title']} ({inst['id']})",
            f"Tanım: {inst['definition']}",
            f"Unsurlar: {'; '.join(inst['elements'])}",
            f"Organik bağ: {' / '.join(inst.get('organicLinks') or [])}",
            f"Madde: {refs}",
            f"Ekol notu: {' / '.join(inst.get('doctrineSplit') or [])}",
            "",
        ]
    (OUT / "graf.md").write_text("\n".join(lines), encoding="utf-8")


def write_harita() -> None:
    (OUT / "aybu-harita.md").write_text(
        """# AYBÜ Borçlar Genel — kamuya açık harita

Slug: ankara-yildirim-beyazit. Kampüs: Esenboğa / Çubuk hattı. Takvim: dönemlik.

Hoca slaytı yoktur. Resmi açık ders arşivi yoktur. İzlence OBS ve fakülte duyurusundadır.

## Fakülte sınav kültürü

- Klasik yazılı: madde + unsur + olaya yedirme
- İlk cümle borcun kaynağını yazar (sözleşme / haksız fiil / sebepsiz zenginleşme / kanunî borç)
- Güz ve bahar ayrı kod; yıllık paket bütünleme/tekrar içindir
- Ankara dogmatiği (AÜHF/AHBV ile kaynak paylaşımı) ama kâğıtta TBK lafzı bağlar
- City hook: Esenboğa yolundaki araç satımı ve ayıp iddiası

## Güz omurgası

borç ilişkisi → icap-kabul → irade sakatlıkları → temsil → genel işlem koşulları

## Bahar omurgası

ifa → temerrüt → ifa imkânsızlığı → haksız fiil → sebepsiz zenginleşme → sona erme → zamanaşımı

## Tuzaklar (öğreti + lafız; künye uydurma)

- İcap ile icaba davet
- Temerrüt ile ayıp
- Zamanaşımı ile hak düşürücü süre
- GİK denetimi ile genel butlan
- Kaynak kapısı yazılmadan temerrüt/tazminat

## Kaynaklar

- https://aybu.edu.tr/hukuk
- https://aybu.edu.tr/Hukuk/tr/sayfa/1058/Ders-Programı

## Üretim kuralı

Quiz TBK lafzı ve unsurları ölçer. Slayt cümlesi yok. Künye yoksa yazılmaz. AÜHF notunu AYBÜ diye etiketlemek yasak.
""",
        encoding="utf-8",
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    write_lafiz()
    write_graf()
    write_harita()
    for p in sorted(OUT.iterdir()):
        print(f"{p.name}\t{p.stat().st_size}")


if __name__ == "__main__":
    main()
