#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "HUK201", "HUKK2074", "borclar", "borçlar", "eşya", "zilyetlik", "icra", "nişan", "TCK")
ORDER = ["ticari iş", "ticari işletme", "tacir", "sicil", "unvan", "haksız rekabet", "basiret ve temsil"]


def srcs(data):
    out = []
    for s in data.get("sources") or []:
        blob = f"{s.get('title') or ''} {s.get('url') or ''} {s.get('note') or ''}"
        if any(n.lower() in blob.lower() for n in NEEDLES):
            continue
        out.append(s)
    return out


PATCHES = {
    "ankara": (
        "Cebeci'de bir bakkalın tacir sıfatı ve sicil tartışması",
        "Cebeci şerh geleneği; TTK birinci kitap lafzı bağlar",
        [
            "Kâğıdın ilk cümlesinde tacir sıfatı mı ticari iş mi olduğunu yazın.",
            "Esnaf sınırı ile taciri, sicil ile unvanı karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AÜHF Cebeci geleneği tacir kapısını önce yazar.",
            "Şirketler ve borçlar genel ayrı derslerdir.",
        ],
    ),
    "ankara-yildirim-beyazit": (
        "Esenboğa yolunda bir araç galerisi ve ticaret unvanı",
        "Ankara dogmatiği; TTK birinci kitap lafzı bağlar",
        [
            "AYBÜ kâğıdında tacir-esnaf kapısı ilk cümlede durur.",
            "Ticari iş karinesini tacir sıfatıyla karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AYBÜ dönemlik okur; ticari işletme TTK lafzına bağlanır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "istanbul": (
        "Beyazıt'ta bir dükkân devri ve sicile güven",
        "İstanbul ekolü; TTK birinci kitap lafzı bağlar",
        [
            "Beyazıt kâğıdında ilk cümle tacir veya işletmeyi söyler.",
            "Haksız rekabet genel klozunu 55 listesiyle karıştırmayın.",
            "EBS bağlayıcıdır.",
        ],
        [
            "İÜHF ticari işletme amfi + pratik; kâğıtta TTK lafzı önce gelir.",
            "HUKK2074 borçlar genel ayrı derstir.",
        ],
    ),
    "marmara": (
        "Kadıköy'de bir unvan ve haksız rekabet",
        "Marmara pratik hattı; TTK birinci kitap lafzı bağlar",
        [
            "Marmara kâğıdında unvanı markadan, sicili tapudan ayırın.",
            "Basiretli iş adamı özenini TBK m.2 ile karıştırmayın.",
            "MEOBS bağlayıcıdır.",
        ],
        [
            "Marmara pratik çalışmayı teorinin yanına koyar.",
            "HUK201 borçlar genel ayrı derstir.",
        ],
    ),
    "dokuz-eylul": (
        "Alsancak'ta bir esnaf işletmesi ve tacir sınırı",
        "Ege/İzmir dogmatiği; TTK birinci kitap lafzı bağlar",
        [
            "DEÜ kâğıdında önce işletme-esnaf kapısını yazın.",
            "Tescilsiz olguyu iyiniyetli üçüncü kişiye karşı ileri sürmeyin.",
            "OBS bağlayıcıdır.",
        ],
        [
            "DEÜ ticari işletme dönemlik Bologna hattındadır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "hacettepe": (
        "Beytepe'de öğrenci kırtasiyesi ve ticari iş",
        "Ankara hattı; TTK lafzı Bologna çıktısıyla okunur",
        [
            "Hacettepe kâğıdında işletmeyi ayırır, taciri uygular, sicil sonucunu yazar.",
            "Ticari dava ile genel mahkemeyi karıştırmayın.",
            "Ders bilgi formu bağlayıcıdır.",
        ],
        [
            "Hacettepe ticari işletmede öğrenme çıktısı fiili kâğıtta görünür.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "galatasaray": (
        "Ortaköy'de fonds de commerce ve işletme karşılaştırması",
        "Fransız ticaret hukuku; kâğıtta Türkçe TTK lafzı bağlar",
        [
            "GSÜ kâğıdında mehaz karşılaştırması TTK lafzını aydınlatır.",
            "Tacir kapısı ilk cümlede durur.",
            "Yönetmelik bağlayıcıdır.",
        ],
        [
            "GSÜ ticari işletmede Fransızca terim süs, TTK Türkçe bağlar.",
            "HUK222 borçlar genel ayrı derstir.",
        ],
    ),
    "bilkent": (
        "Bilkent yurdunda merchant ve tacir tartışması",
        "Karşılaştırmalı commercial; kâğıtta TTK lafzı bağlar",
        [
            "Bilkent kâğıdında merchant cümlesi TTK tacirinin yerine geçmez.",
            "Goodwill unvan ve işletme devrini silmez.",
            "Künye yoksa E./K. yazılmaz.",
        ],
        [
            "Bilkent ticari işletmede issue spotting unsur listesinin yerine geçmez.",
            "TTK lafzı Türkçe kâğıtta yazılır.",
        ],
    ),
    "koc": (
        "Rumelifeneri'nde haksız rekabet hypo'su",
        "Karşılaştırmalı unfair competition; bağlayıcı metin TTK'dır",
        [
            "Koç kâğıdında İngilizce terim TTK maddesinin yerine geçmez.",
            "Policy cümlesi unsur ve lafızdan sonra gelir.",
            "Tacir kapısı ilk cümlede durur.",
        ],
        [
            "Koç ticari işletmede hypo künye uydurmayı serbest bırakmaz.",
            "TTK resmi lafzı FSEK m. 31 ile serbesttir.",
        ],
    ),
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
                "format": "Klasik yazılı: TTK maddesi + tacir/işletme kapısı + olaya yedirme.",
                "tips": tips,
            },
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        data.setdefault("byCourse", {})["ticari-isletme"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
