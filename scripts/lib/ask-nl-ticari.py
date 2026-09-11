#!/usr/bin/env python3
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
NB = "bff77f84-b849-4c58-903b-2fc41395c0d9"
PACK = ROOT / "docs" / "ders-notlari" / "notebooklm" / "dalga-a-ticari-isletme"
prompt = (PACK / "ask-prompt.txt").read_text(encoding="utf-8")
out = PACK / "ask-raw.json"
r = subprocess.run(
    ["notebooklm", "ask", prompt, "--notebook", NB, "--json"],
    capture_output=True,
    text=True,
    encoding="utf-8",
)
out.write_text(r.stdout or r.stderr or "", encoding="utf-8")
print("exit", r.returncode, "bytes", out.stat().st_size)
if r.returncode != 0:
    print((r.stderr or r.stdout or "")[-2000:])
