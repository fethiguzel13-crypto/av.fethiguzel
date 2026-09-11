#!/usr/bin/env python3
"""Copy TBK+graf and write a faculty harita for borçlar-genel NotebookLM packs."""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "docs" / "ders-notlari" / "notebooklm" / "aybu-borclar-genel"
OUT_ROOT = ROOT / "docs" / "ders-notlari" / "notebooklm"


def main() -> None:
    slug = sys.argv[1]
    pack = sys.argv[2]
    overlay = json.loads(
        (ROOT / "lib" / "ders-notlari" / "overlays" / f"{slug}.json").read_text(
            encoding="utf-8"
        )
    )
    out = OUT_ROOT / pack
    out.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(SRC / "tbk-genel-lafiz.md", out / "tbk-genel-lafiz.md")
    shutil.copyfile(SRC / "graf.md", out / "graf.md")
    srcs = "\n".join(
        f"- {s.get('url')} — {s.get('title')}" for s in overlay.get("sources") or []
    )
    notes = "\n".join(f"- {n}" for n in overlay.get("schoolNotes") or [])
    order = " → ".join(overlay.get("syllabusOrder") or [])
    tips = "\n".join(f"- {t}" for t in (overlay.get("examBox") or {}).get("tips") or [])
    (out / "harita.md").write_text(
        f"""# {overlay.get('campus')} — Borçlar Genel harita

Slug: {slug}. Kampüs: {overlay.get('campus')}. Takvim: {overlay.get('calendar')}. Dil: {overlay.get('lang')}.
Mehaz: {overlay.get('mehaz')}. City hook: {overlay.get('cityHook')}.

Hoca slaytı yoktur. Quiz TBK lafzı ve graf unsura dayanır. Künye uydurulmaz.
Başka fakültenin notunu bu slug ile etiketlemek yasak.

## Fakülte notları

{notes}

## İzlence omurgası

{order}

## Sınav ipuçları

{tips}

## Graf kurumları

Güz: borç ilişkisi, icap-kabul, irade sakatlıkları, temsil, genel işlem koşulları
Bahar: ifa, temerrüt, ifa imkânsızlığı, haksız fiil, sebepsiz zenginleşme, sona erme, zamanaşımı

## Kaynaklar

{srcs}
""",
        encoding="utf-8",
    )
    for p in sorted(out.iterdir()):
        print(f"{p.name}\t{p.stat().st_size}")


if __name__ == "__main__":
    main()
