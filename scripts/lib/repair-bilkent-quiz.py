#!/usr/bin/env python3
import importlib.util
import json
import sys
from pathlib import Path

mod_path = Path(__file__).with_name("normalize-nl-quiz.py")
spec = importlib.util.spec_from_file_location("normalize_nl_quiz", mod_path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
IDS = mod.IDS
extract_pack = mod.extract_pack

log = Path(sys.argv[1])
out = Path(sys.argv[2])
raw = log.read_text(encoding="utf-8")
obj = json.loads(raw[raw.find("{") :])
obj["answer"] = obj["answer"].replace(
    "\n    \n  ],\n  \"bahar\"",
    "\n    }\n  ],\n  \"bahar\"",
)
pack = extract_pack(obj)
pack["intro"] = "Bilkent kâğıdında issue spotting unsur listesinin yerine geçmez."
pack["uyari"] = "Karşılaştırmalı cümle TBK şartını aydınlatır; künye uydurulmaz."
out.write_text(json.dumps(pack, ensure_ascii=False, indent=2), encoding="utf-8")
print("mcq", len(pack["mcq"]), "guz", len(pack["guz"]), "bahar", len(pack["bahar"]))
missing = [i for i in IDS if i not in pack["mcq"]]
if missing:
    print("MISSING", ",".join(missing))
