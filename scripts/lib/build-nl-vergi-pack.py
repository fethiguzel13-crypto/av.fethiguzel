#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "ders-notlari" / "notebooklm" / "dalga-a-vergi"
GRAPH = ROOT / "lib" / "ders-notlari" / "graphs" / "vergi-hukuku.json"
MEV = ROOT / "content" / "mevzuat"


def official(kanun: str, n: str) -> str | None:
    p = MEV / kanun / f"madde-{n}.md"
    if not p.exists():
        return None
    raw = p.read_text(encoding="utf-8")
    raw = re.sub(r"^[\s\n]*", "", raw)
    body = re.sub(r"^---[\s\S]*?---\n", "", raw)
    official = re.split(r"\n### (?:Akademik Yorum ve Analiz|Bizim Yorumumuz)\s*\n", body)[0]
    return re.sub(r"\n---\s*$", "", official).strip()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    g = json.loads(GRAPH.read_text(encoding="utf-8"))
    parts = ["# Vergi hukuku — resmi lafız (FSEK m. 31)\n", "Şerh yoktur. VUK, GVK, KDVK.\n"]
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
    (OUT / "vergi-lafiz.md").write_text("\n".join(parts), encoding="utf-8")
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
        """# Dalga A — Vergi hukuku

Quiz VUK, GVK ve KDVK lafzına ve graf unsura dayanır. Künye uydurulmaz. Slayt yoktur. Hapiz süresi ve güncel ceza tutarı yazılmaz.

Kurum id: vergiyi-doguran, mukellef, tarh, resen, zamanasimi-vuk, vergi-ceza, gelir, kdv.

Tuzaklar: doğum/tarh; mükellef/sorumlu; ikmalen/re'sen; tarh zamanaşımı; ziya/usulsüzlük/kaçakçılık; tam mükellef; KDV indirimi.

Fakülte sesi overlay'dedir. Borçlar ve tüketici ayrı derstir.
""",
        encoding="utf-8",
    )
    if missing:
        print("MISSING", missing)
    for p in sorted(OUT.iterdir()):
        print(f"{p.name}\t{p.stat().st_size}")


if __name__ == "__main__":
    main()
