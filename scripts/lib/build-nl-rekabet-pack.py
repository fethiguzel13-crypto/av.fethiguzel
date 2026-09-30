#!/usr/bin/env python3
import json, re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "ders-notlari" / "notebooklm" / "dalga-a-rekabet"
MEV = ROOT / "content" / "mevzuat"
g = json.loads((ROOT / "lib" / "ders-notlari" / "graphs" / "rekabet-hukuku.json").read_text(encoding="utf-8"))
OUT.mkdir(parents=True, exist_ok=True)
parts = ["# Rekabet hukuku — resmi lafız (FSEK m. 31)\n", "Şerh yoktur. 4054.\n"]
seen = set()
for inst in g["institutions"]:
    for r in inst.get("statuteRefs") or []:
        key = (r["kanunId"], str(r["maddeNo"]))
        if key in seen:
            continue
        seen.add(key)
        p = MEV / r["kanunId"] / f"madde-{r['maddeNo']}.md"
        if not p.exists():
            continue
        raw = re.sub(r"^[\s\n]*", "", p.read_text(encoding="utf-8"))
        body = re.sub(r"^---[\s\S]*?---\n", "", raw)
        text = re.split(r"\n### (?:Akademik Yorum ve Analiz|Bizim Yorumumuz)\s*\n", body)[0]
        parts.append(f"\n## {r['kanunId'].upper()} m.{r['maddeNo']}\n\n{text.strip()}\n")
(OUT / "rekabet-lafiz.md").write_text("\n".join(parts), encoding="utf-8")
lines = [f"# Graf: {g['title']}", f"Güz: {', '.join(g['guzInstitutionIds'])}", f"Bahar: {', '.join(g['baharInstitutionIds'])}", ""]
for inst in g["institutions"]:
    refs = ", ".join(f"{r['kanunId'].upper()} m.{r['maddeNo']}" for r in inst.get("statuteRefs") or [])
    lines += [f"## {inst['title']} ({inst['id']})", f"Tanım: {inst['definition']}", f"Unsurlar: {'; '.join(inst['elements'])}", f"Madde: {refs}", ""]
(OUT / "graf.md").write_text("\n".join(lines), encoding="utf-8")
(OUT / "harita.md").write_text("# Dalga A — Rekabet hukuku\n\nQuiz 4054 lafzına dayanır. Ciro eşiği ve ceza yüzdesi yazılmaz. Künye uydurulmaz.\n\nKurum id: tesebbus-rekabet, anlasma, hakim-durum, yogunlasma, muafiyet, sorusturma-rekabet, kurul, ceza-rekabet.\n", encoding="utf-8")
print("ok", OUT)
