#!/usr/bin/env python3
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
NB = "3258f82e-287d-4385-bdf7-8b5c21275684"
PACK = ROOT / "docs" / "ders-notlari" / "notebooklm" / "dalga-a-miras-hukuku"
prompt = (PACK / "ask-prompt.txt").read_text(encoding="utf-8")
out = PACK / "ask-raw.json"
subprocess.run(["notebooklm", "language", "set", "tr"], check=False)
r = subprocess.run(
    [
        "notebooklm",
        "ask",
        prompt,
        "--notebook",
        NB,
        "--json",
    ],
    capture_output=True,
    text=True,
    encoding="utf-8",
)
out.write_text(r.stdout or r.stderr or "", encoding="utf-8")
print("exit", r.returncode, "bytes", out.stat().st_size)
if r.returncode != 0:
    print(r.stderr[-2000:] if r.stderr else r.stdout[-2000:])
