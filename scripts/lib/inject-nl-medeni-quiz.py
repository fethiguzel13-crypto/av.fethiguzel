#!/usr/bin/env python3
"""Inject NotebookLM exam traps + MCQ into AÜHF medeni-baslangic notes."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PACK = ROOT / "docs" / "ders-notlari" / "notebooklm" / "auhf-medeni-baslangic" / "nl-quiz.json"
NOTES = ROOT / "lib" / "ders-notlari" / "generated" / "notes"
GUZ = {"uygulama", "durustluk", "iyiniyet", "hakim-takdiri", "ehliyet"}
BAHAR = {"genel-hukumler", "ispat", "kisilik", "yerlesim", "ad"}


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
        bag += [e.get("title") or "", e.get("facts") or "", e.get("analysis") or "", e.get("takeaway") or ""]
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


def inject(path: Path, pack: dict) -> None:
    note = json.loads(path.read_text(encoding="utf-8"))
    code = note.get("courseCode") or ""
    traps = []
    if "donem-1" in code:
        traps = pack["guz"]
    elif "donem-2" in code:
        traps = pack["bahar"]
    else:
        traps = pack["guz"] + pack["bahar"]

    heading = "Cebeci tuzak defteri"
    note["sections"] = [s for s in note.get("sections") or [] if s.get("heading") != heading]
    note["sections"].append(
        {
            "heading": heading,
            "paragraphs": [
                "AÜHF yazılısında puan, doğru sloganı yazmaktan değil kapıyı ayırmaktan düşer. Aşağıdaki tuzaklar HKZ-104 başlık omurgasına ve TMK lafzına dayanır; slayt cümlesi değildir.",
                *traps,
            ],
            "uyari": "Boşluk, belirsizlik ve takdir aynı torbaya konmaz. Dürüstlük ile iyiniyet, hak ehliyeti ile fiil ehliyeti, yerleşim ile adres ayrı kapılardır.",
        }
    )

    for topic in note.get("topics") or []:
        tid = topic.get("id")
        q = pack["mcq"].get(tid)
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
    pack = json.loads(PACK.read_text(encoding="utf-8"))
    for name in (
        "ankara__medeni-baslangic-donem-1.json",
        "ankara__medeni-baslangic-donem-2.json",
        "ankara__medeni-baslangic-yillik.json",
    ):
        inject(NOTES / name, pack)


if __name__ == "__main__":
    main()
