#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "ders-notlari" / "notebooklm" / "dalga-a-ticari-isletme"
GRAPH = ROOT / "lib" / "ders-notlari" / "graphs" / "ticari-isletme.json"
MEV = ROOT / "content" / "mevzuat"


def official(kanun: str, n: str) -> str | None:
    p = MEV / kanun / f"madde-{n}.md"
    if not p.exists():
        return None
    raw = p.read_text(encoding="utf-8")
    body = re.sub(r"^---[\s\S]*?---\n", "", raw)
    official = re.split(r"\n### (?:Akademik Yorum ve Analiz|Bizim Yorumumuz)\s*\n", body)[0]
    return re.sub(r"\n---\s*$", "", official).strip()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    g = json.loads(GRAPH.read_text(encoding="utf-8"))
    parts = ["# Ticari işletme — resmi lafız (FSEK m. 31)\n", "Şerh yoktur. TTK birinci kitap.\n"]
    seen = set()
    for inst in g["institutions"]:
        for r in inst.get("statuteRefs") or []:
            key = (r["kanunId"], str(r["maddeNo"]))
            if key in seen:
                continue
            seen.add(key)
            text = official(r["kanunId"], str(r["maddeNo"]))
            if not text:
                continue
            parts.append(f"\n## {r['kanunId'].upper()} m.{r['maddeNo']}\n\n{text}\n")
    (OUT / "ttk-isletme-lafiz.md").write_text("\n".join(parts), encoding="utf-8")
    lines = [
        f"# Graf: {g['title']}",
        f"Güz: {', '.join(g['guzInstitutionIds'])}",
        f"Bahar: {', '.join(g['baharInstitutionIds'])}",
        "",
    ]
    for inst in g["institutions"]:
        refs = ", ".join(f"{r['kanunId'].upper()} m.{r['maddeNo']}" for r in inst.get("statuteRefs") or [])
        lines += [
            f"## {inst['title']} ({inst['id']})",
            f"Tanım: {inst['definition']}",
            f"Unsurlar: {'; '.join(inst['elements'])}",
            f"Madde: {refs}",
            "",
        ]
    (OUT / "graf.md").write_text("\n".join(lines), encoding="utf-8")
    (OUT / "harita.md").write_text(
        """# Dalga A — Ticari işletme hukuku

Quiz TTK lafzı ve graf unsura dayanır. Künye uydurulmaz. Slayt yoktur.

Kurum id: ticari-is, ticari-isletme, tacir, sicil, unvan, haksiz-rekabet, ticari-islemler.

Tuzaklar: ticari iş/tacir; işletme/esnaf sınırı; sicil/unvan; haksız rekabet 54/55; basiret/temsil.

Fakülte sesi overlay'dedir. Borçlar genel ve şirketler ayrı derstir.
""",
        encoding="utf-8",
    )
    for p in sorted(OUT.iterdir()):
        print(f"{p.name}\t{p.stat().st_size}")


if __name__ == "__main__":
    main()
