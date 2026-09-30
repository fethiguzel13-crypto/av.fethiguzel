#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "ders-notlari" / "notebooklm" / "dalga-a-idare"
GRAPH = ROOT / "lib" / "ders-notlari" / "graphs" / "idare-hukuku.json"
MEV = ROOT / "content" / "mevzuat"


def official(kanun: str, n: str) -> str | None:
    p = MEV / kanun / f"madde-{n}.md"
    if not p.exists():
        return None
    raw = re.sub(r"^[\s\n]*", "", p.read_text(encoding="utf-8"))
    body = re.sub(r"^---[\s\S]*?---\n", "", raw)
    text = re.split(r"\n### (?:Akademik Yorum ve Analiz|Bizim Yorumumuz)\s*\n", body)[0]
    return re.sub(r"\n---\s*$", "", text).strip()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    g = json.loads(GRAPH.read_text(encoding="utf-8"))
    parts = [
        "# İdare hukuku — resmi lafız (FSEK m. 31)\n",
        "Şerh yoktur. 5393, 657, 2942, 3194, 5442.\n",
    ]
    seen = set()
    missing = []
    for inst in g["institutions"]:
        for r in inst.get("statuteRefs") or []:
            key = (r["kanunId"], str(r["maddeNo"]))
            if key in seen:
                continue
            seen.add(key)
            text = official(r["kanunId"], str(r["maddeNo"]))
            if not text:
                missing.append(key)
                continue
            parts.append(f"\n## {r['kanunId'].upper()} m.{r['maddeNo']}\n\n{text}\n")
    (OUT / "idare-lafiz.md").write_text("\n".join(parts), encoding="utf-8")
    lines = [
        f"# Graf: {g['title']}",
        f"Güz: {', '.join(g['guzInstitutionIds'])}",
        f"Bahar: {', '.join(g['baharInstitutionIds'])}",
        "",
    ]
    for inst in g["institutions"]:
        refs = ", ".join(
            f"{r['kanunId'].upper()} m.{r['maddeNo']}" for r in inst.get("statuteRefs") or []
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
        """# Dalga A — İdare hukuku

Quiz 5393, 657, 2942, 3194 ve 5442 lafzına dayanır. Künye uydurulmaz. Slayt yoktur. Para cezası tutarı yazılmaz.

Kurum id: idari-teskilat, belediye-organ, kamu-gorevlisi, idari-yetki, disiplin, kamulastirma, imar-denetim, il-idaresi.

Tuzaklar: hemşehri/görev/yetki; meclis/başkan/encümen; memur/işçi; disiplin/görevden uzaklaştırma; satın alma/bedel davası; ruhsat/mühür; vali/başkan.

Fakülte sesi overlay'dedir. İYUK bu kâğıdın asıl kapısı değildir. m.54 denetimdir ve organ sayılmaz.
""",
        encoding="utf-8",
    )
    if missing:
        print("MISSING", missing)
    for p in sorted(OUT.iterdir()):
        print(f"{p.name}\t{p.stat().st_size}")


if __name__ == "__main__":
    main()
