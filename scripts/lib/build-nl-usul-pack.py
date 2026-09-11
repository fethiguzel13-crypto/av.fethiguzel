#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "ders-notlari" / "notebooklm" / "dalga-a-medeni-usul"
GRAPH = ROOT / "lib" / "ders-notlari" / "graphs" / "medeni-usul.json"
HMK = ROOT / "content" / "mevzuat" / "hmk"
ARTICLES = [
    "1", "2", "3", "4", "5", "6", "9", "10", "12", "19",
    "114", "115", "116", "117", "119", "122", "127", "128", "141", "176",
    "137", "138", "140", "147", "184",
    "189", "190", "200", "225", "266", "282",
    "294", "297", "298", "301", "303",
    "341", "345", "353", "361", "369", "373",
]


def official_of(n: str) -> str | None:
    p = HMK / f"madde-{n}.md"
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
    parts = ["# HMK — resmi lafız (FSEK m. 31)\n", "Şerh yoktur.\n"]
    for n in ARTICLES:
        text = official_of(n)
        if not text:
            continue
        parts.append(f"\n## Madde {n}\n\n{text}\n")
    (OUT / "hmk-lafiz.md").write_text("\n".join(parts), encoding="utf-8")
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
        """# Dalga A — Medeni usul

Quiz HMK lafzı ve graf unsura dayanır. Künye uydurulmaz. Slayt yoktur.

Kurum id: gorev, yetki, dava-sartlari, dilekce, tahkikat, delil, hukum, kanun-yolu.

Tuzaklar: görev/yetki; kesin yetki/yetki sözleşmesi; dava şartı/ilk itiraz; ıslah/iddianın genişletilmesi; senetle ispat/tanık; istinaf/temyiz; kesin hüküm.

Fakülte sesi overlay'dedir; quiz madde ve unsur ölçer.
""",
        encoding="utf-8",
    )
    for p in sorted(OUT.iterdir()):
        print(f"{p.name}\t{p.stat().st_size}")


if __name__ == "__main__":
    main()
