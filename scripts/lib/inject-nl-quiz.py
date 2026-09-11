#!/usr/bin/env python3
"""Inject NotebookLM traps + MCQ into a composed course triple."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
NOTES = ROOT / "lib" / "ders-notlari" / "generated" / "notes"


def word_count(note: dict) -> int:
    bag = [note.get("lead") or "", note.get("promise") or ""]
    bag += note.get("sixtySecond") or []
    for s in note.get("sections") or []:
        bag.append(s.get("heading") or "")
        bag += s.get("paragraphs") or []
        bag.append(s.get("hapBilgi") or "")
        bag.append(s.get("uyari") or "")
        for k in s.get("kartlar") or []:
            bag += [k.get("baslik") or "", k.get("govde") or ""]
    for e in note.get("examples") or []:
        bag += [
            e.get("title") or "",
            e.get("facts") or "",
            e.get("analysis") or "",
            e.get("takeaway") or "",
        ]
    for f in note.get("faq") or []:
        bag += [f.get("q") or "", f.get("a") or ""]
    bag += note.get("checklist") or []
    for t in note.get("topics") or []:
        bag.append(t.get("heading") or "")
        for m in t.get("mcq") or []:
            bag += [m.get("q") or "", m.get("reason") or "", *(m.get("choices") or [])]
        for c in t.get("flashcards") or []:
            bag += [c.get("front") or "", c.get("back") or ""]
    return len(" ".join(bag).split())


def inject(path: Path, pack: dict, heading: str) -> None:
    note = json.loads(path.read_text(encoding="utf-8"))
    code = note.get("courseCode") or ""
    if "donem-1" in code:
        traps = pack.get("guz") or []
    elif "donem-2" in code:
        traps = pack.get("bahar") or []
    else:
        traps = (pack.get("guz") or []) + (pack.get("bahar") or [])

    note["sections"] = [s for s in note.get("sections") or [] if s.get("heading") != heading]
    intro = pack.get("intro") or (
        "Sınav puanı sloganı yazmaktan değil kapıyı ayırmaktan düşer. "
        "Aşağıdaki tuzaklar resmi lafza ve graf unsura dayanır; slayt cümlesi değildir."
    )
    note["sections"].append(
        {
            "heading": heading,
            "paragraphs": [intro, *traps],
            "uyari": pack.get("uyari")
            or "Kaynak, unsur ve süre aynı torbaya konmaz. OBS ve öğretim elemanı bağlayıcıdır.",
        }
    )

    mcq_map = pack.get("mcq") or {}
    for topic in note.get("topics") or []:
        tid = topic.get("id")
        q = mcq_map.get(tid)
        if not q:
            continue
        existing = topic.get("mcq") or []
        if any(m.get("q") == q["q"] for m in existing):
            continue
        topic["mcq"] = [q, *existing[:1]]

    note["wordTarget"] = word_count(note)
    path.write_text(json.dumps(note, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"[ok] {path.name} words={note['wordTarget']}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--pack", required=True)
    ap.add_argument("--slug", required=True)
    ap.add_argument("--course", required=True)
    ap.add_argument("--heading", required=True)
    args = ap.parse_args()
    pack = json.loads(Path(args.pack).read_text(encoding="utf-8"))
    for v in ("donem-1", "donem-2", "yillik"):
        inject(NOTES / f"{args.slug}__{args.course}-{v}.json", pack, args.heading)


if __name__ == "__main__":
    main()
