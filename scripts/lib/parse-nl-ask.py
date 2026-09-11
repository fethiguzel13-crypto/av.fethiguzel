#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

log = Path(sys.argv[1])
out = Path(sys.argv[2])
raw = log.read_text(encoding="utf-8")
obj = json.loads(raw[raw.find("{") :])
block = re.search(r"```json\s*([\s\S]*?)```", obj["answer"]).group(1)
pack = json.loads(block)
pack.setdefault(
    "intro",
    "AYBÜ yazılısında puan, kaynak kapısını yazmaktan düşer. Tuzaklar TBK lafzı ve graf unsura dayanır; slayt cümlesi değildir.",
)
pack.setdefault(
    "uyari",
    "İcap ile davet, temerrüt ile ayıp, zamanaşımı ile hak düşürücü süre aynı torbaya konmaz. OBS bağlayıcıdır.",
)
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(pack, ensure_ascii=False, indent=2), encoding="utf-8")
print("mcq", len(pack["mcq"]), "guz", len(pack["guz"]), "bahar", len(pack["bahar"]))
