#!/usr/bin/env python3
"""Normalize NotebookLM quiz JSON (string traps, object traps, mcq dict vs list)."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

CITE = re.compile(r"\s*\[[0-9,\s\-]+\]")
PREFIX = re.compile(r"^[A-D]\)\s*")
IDS = [
    "borc-iliskisi",
    "sozlesmenin-kurulmasi",
    "irade-sakatliklari",
    "temsil",
    "genel-islem-kosullari",
    "ifa",
    "temerrut",
    "ifa-imkansizligi",
    "haksiz-fiil",
    "sebepsiz-zenginlesme",
    "sona-erme",
    "zamanasimi",
]


def clean(s: str) -> str:
    s = CITE.sub("", s or "")
    s = PREFIX.sub("", s.strip())
    return re.sub(r"\s+", " ", s).strip()


def trap_of(item) -> str | None:
    if isinstance(item, str):
        t = clean(item)
        return t or None
    if not isinstance(item, dict):
        return None
    for k in ("tuzak", "aciklama"):
        if item.get(k):
            head = clean(item.get("tuzak") or "")
            body = clean(item.get("aciklama") or "")
            if head and body and head not in body:
                return f"{head}: {body}"
            return body or head
    if item.get("konu") and item.get("aciklama"):
        return f"{clean(item['konu'])}: {clean(item['aciklama'])}"
    if item.get("q"):
        return clean(item["q"])
    return None


def answer_index(ans, choices: list[str]) -> int | None:
    if isinstance(ans, int):
        return ans if 0 <= ans <= 3 else None
    s = clean(str(ans or ""))
    letter = s[:1].upper()
    if letter in "ABCD" and (len(s) == 1 or s[1:2] in "):."):
        return "ABCD".index(letter)
    for i, c in enumerate(choices[:4]):
        if s == c or s.endswith(c) or c.endswith(s):
            return i
    return None


def mcq_of(item: dict) -> dict | None:
    q = clean(item.get("q") or "")
    choices = [clean(c) for c in item.get("choices") or []]
    if not q or len(choices) < 4:
        return None
    ans = answer_index(item.get("answer"), choices)
    if ans is None:
        return None
    return {
        "q": q,
        "choices": choices[:4],
        "answer": ans,
        "reason": clean(item.get("reason") or ""),
    }


def collect_mcq(raw) -> dict:
    out = {}
    if isinstance(raw, dict):
        items = [{"id": k, **v} if isinstance(v, dict) else {"id": k} for k, v in raw.items()]
    elif isinstance(raw, list):
        items = raw
    else:
        items = []
    for item in items:
        if not isinstance(item, dict):
            continue
        tid = item.get("id")
        q = mcq_of(item)
        if tid and q:
            out[tid] = q
    return out


def extract_pack(obj: dict) -> dict:
    ans = obj.get("answer") or ""
    m = re.search(r"```json\s*([\s\S]*?)```", ans)
    if m:
        data = json.loads(m.group(1))
    else:
        try:
            data = json.loads(ans)
        except json.JSONDecodeError:
            data = {}
    guz = [t for t in (trap_of(x) for x in data.get("guz") or []) if t]
    bahar = [t for t in (trap_of(x) for x in data.get("bahar") or []) if t]
    mcq = collect_mcq(data.get("mcq"))
    # Hacettepe put MCQs inside guz/bahar
    for bucket in (data.get("guz") or []) + (data.get("bahar") or []):
        if isinstance(bucket, dict) and bucket.get("choices"):
            tid = bucket.get("id")
            q = mcq_of(bucket)
            if tid and q and tid not in mcq:
                mcq[tid] = q
    return {"guz": guz[:5] or guz, "bahar": bahar[:5] or bahar, "mcq": mcq}


def main() -> None:
    log = Path(sys.argv[1])
    out = Path(sys.argv[2])
    intro = sys.argv[3] if len(sys.argv) > 3 else ""
    uyari = sys.argv[4] if len(sys.argv) > 4 else ""
    raw = log.read_text(encoding="utf-8")
    obj = json.loads(raw[raw.find("{") :])
    pack = extract_pack(obj)
    if intro:
        pack["intro"] = intro
    if uyari:
        pack["uyari"] = uyari
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(pack, ensure_ascii=False, indent=2), encoding="utf-8")
    print(out.name, "mcq", len(pack["mcq"]), "ids", ",".join(pack["mcq"]), "guz", len(pack["guz"]), "bahar", len(pack["bahar"]))


if __name__ == "__main__":
    main()
