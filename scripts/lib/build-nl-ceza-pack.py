#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "ders-notlari" / "notebooklm" / "dalga-a-ceza-genel"
GRAPH = ROOT / "lib" / "ders-notlari" / "graphs" / "ceza-genel.json"
TCK = ROOT / "content" / "mevzuat" / "tck"
ARTICLES = [
    "1", "2", "7", "21", "22", "23", "24", "25", "26", "27",
    "30", "31", "32", "34", "35", "36", "37", "38", "39", "40",
    "42", "43", "44", "45", "46", "50", "51", "52", "53", "58",
]


def official_of(n: str) -> str | None:
    p = TCK / f"madde-{n}.md"
    if not p.exists():
        return None
    raw = p.read_text(encoding="utf-8")
    body = re.sub(r"^---[\s\S]*?---\n", "", raw)
    official = re.split(
        r"\n### (?:Akademik Yorum ve Analiz|Bizim Yorumumuz)\s*\n", body
    )[0]
    return re.sub(r"\n---\s*$", "", official).strip()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    parts = ["# TCK Genel Hükümler — resmi lafız (FSEK m. 31)\n", "Şerh yoktur.\n"]
    for n in ARTICLES:
        text = official_of(n)
        if not text:
            continue
        parts.append(f"\n## Madde {n}\n\n{text}\n")
    (OUT / "tck-genel-lafiz.md").write_text("\n".join(parts), encoding="utf-8")
    g = json.loads(GRAPH.read_text(encoding="utf-8"))
    lines = [
        f"# Graf: {g['title']}",
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
            f"Madde: {refs}",
            "",
        ]
    (OUT / "graf.md").write_text("\n".join(lines), encoding="utf-8")
    (OUT / "harita.md").write_text(
        """# Dalga A — Ceza hukuku genel hükümler

Quiz TCK lafzı ve graf unsura dayanır. Künye uydurulmaz. Slayt yoktur.

Kurum id: kanunilik, kast-taksir, hukuka-uygunluk, tesebbus, istirak, ictima, kusurluluk-yas, yaptirim.

Tuzaklar: kıyas yasağı; olası kast / bilinçli taksir; meşru savunma sınırı; icraya başlama; azmettirme / yardım; zincirleme suç / fikri içtima; yaş küçüklüğü; seçenek yaptırım.

Fakülte sesi overlay'dedir; quiz madde ve unsur ölçer.
""",
        encoding="utf-8",
    )
    for p in sorted(OUT.iterdir()):
        print(f"{p.name}\t{p.stat().st_size}")


if __name__ == "__main__":
    main()
