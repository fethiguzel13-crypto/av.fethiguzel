#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "HUK201", "HUKK2074", "borclar", "borçlar", "Borçlar")
ORDER = ["ilamlı icra", "ilamsız takip", "itiraz", "haciz", "istihkak", "cebri satış", "sıra cetveli", "iflas"]


def srcs(data):
    out = []
    for s in data.get("sources") or []:
        blob = f"{s.get('title') or ''} {s.get('url') or ''} {s.get('note') or ''}"
        if any(n.lower() in blob.lower() for n in NEEDLES):
            continue
        out.append(s)
    return out


PATCHES = {
    "ankara": ("Cebeci'de bir kira ilamı ve icra emri", "Cebeci şerh geleneği; İİK lafzı bağlar",
               ["Kâğıdın ilk cümlesinde ilamlı mı ilamsız mı olduğunu yazın.", "İtirazın iptali ile kaldırılmasını, haciz ile istihkakı karıştırmayın.", "OBS bağlayıcıdır."],
               ["AÜHF Cebeci geleneği takip yolunu önce yazar.", "Usul ve borçlar ayrı derslerdir."]),
    "ankara-yildirim-beyazit": ("Esenboğa yolunda bir araç haczi ve istihkak", "Ankara dogmatiği; İİK lafzı bağlar",
               ["AYBÜ kâğıdında takip yolu ilk cümlede durur.", "İlamlı itiraz darlığını ilamsız 7 günle karıştırmayın.", "OBS bağlayıcıdır."],
               ["AYBÜ dönemlik okur; icra İİK lafzına bağlanır.", "Borçlar genel ayrı derstir."]),
    "istanbul": ("Beyazıt'ta bir kambiyo takibi ve itirazın iptali", "İstanbul ekolü; İİK lafzı bağlar",
               ["Beyazıt kâğıdında ilk cümle takip yolunu söyler.", "Kambiyo ile genel haciz yolunu karıştırmayın.", "EBS bağlayıcıdır."],
               ["İÜHF icra amfi + pratik; kâğıtta İİK lafzı önce gelir.", "HUKK2074 borçlar genel ayrı derstir."]),
    "marmara": ("Kadıköy'de kat karşılığı alacak ve sıra cetveli", "Marmara pratik hattı; İİK lafzı bağlar",
               ["Marmara kâğıdında satış talebi ile haczi ayırın.", "Aciz vesikası ile sıra cetvelini karıştırmayın.", "MEOBS bağlayıcıdır."],
               ["Marmara pratik çalışmayı teorinin yanına koyar.", "HUK201 borçlar genel ayrı derstir."]),
    "dokuz-eylul": ("Alsancak'ta taşınır haczi ve istihkak", "Ege/İzmir dogmatiği; İİK lafzı bağlar",
               ["DEÜ kâğıdında önce takip yolunu yazın.", "İstihkak 96-99 kapılarını karıştırmayın.", "OBS bağlayıcıdır."],
               ["DEÜ icra dönemlik Bologna hattındadır.", "Borçlar genel ayrı derstir."]),
    "hacettepe": ("Beytepe'de öğrenci borcu ilamsız takip", "Ankara hattı; İİK lafzı Bologna çıktısıyla okunur",
               ["Hacettepe kâğıdında takip yolunu ayırır, itirazı uygular, haciz sonucunu yazar.", "İlamlı 7 gün ile ilamsız 7 günü aynı kapı sanmayın.", "Ders bilgi formu bağlayıcıdır."],
               ["Hacettepe icrada öğrenme çıktısı fiili kâğıtta görünür.", "Borçlar genel ayrı derstir."]),
    "galatasaray": ("Ortaköy'de kira icrası ve voie d'exécution karşılaştırması", "Fransız icra geleneği; kâğıtta Türkçe İİK lafzı bağlar",
               ["GSÜ kâğıdında mehaz karşılaştırması İİK lafzını aydınlatır.", "Takip yolu kapısı ilk cümlede durur.", "Yönetmelik bağlayıcıdır."],
               ["GSÜ icrada Fransızca terim süs, İİK Türkçe bağlar.", "HUK222 borçlar genel ayrı derstir."]),
    "bilkent": ("Bilkent yurdunda kira alacağı ve haciz", "Karşılaştırmalı enforcement; kâğıtta İİK lafzı bağlar",
               ["Bilkent kâğıdında judgment cümlesi İİK ilamlı takibin yerine geçmez.", "Stay / objection itirazın iptali-kaldırılması ayrımını silmez.", "Künye yoksa E./K. yazılmaz."],
               ["Bilkent icrada issue spotting unsur listesinin yerine geçmez.", "İİK lafzı Türkçe kâğıtta yazılır."]),
    "koc": ("Rumelifeneri'nde iflas hypo'su", "Karşılaştırmalı bankruptcy; bağlayıcı metin İİK'dır",
               ["Koç kâğıdında İngilizce terim İİK maddesinin yerine geçmez.", "Policy cümlesi unsur ve lafızdan sonra gelir.", "Takip yolu kapısı ilk cümlede durur."],
               ["Koç icrada hypo künye uydurmayı serbest bırakmaz.", "İİK resmi lafzı FSEK m. 31 ile serbesttir."]),
}

CAL = {"ankara": "karma", "istanbul": "yillik"}


def main() -> None:
    for slug, (hook, mehaz, tips, notes) in PATCHES.items():
        p = ROOT / f"{slug}.json"
        data = json.loads(p.read_text(encoding="utf-8"))
        patch = {
            "cityHook": hook,
            "mehaz": mehaz,
            "examBox": {
                "calendar": CAL.get(slug, "donemlik"),
                "typicalWeights": "Ara sınav + final; oran OBS/dönem ilanı esas.",
                "format": "Klasik yazılı: İİK maddesi + takip yolu + olaya yedirme.",
                "tips": tips,
            },
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        data.setdefault("byCourse", {})["icra-iflas"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
