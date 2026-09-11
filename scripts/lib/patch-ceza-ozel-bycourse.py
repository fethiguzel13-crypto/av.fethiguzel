#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "HUK201", "HUKK2074", "borclar", "borçlar", "eşya", "zilyetlik", "icra", "nişan", "zümre")
ORDER = ["kasten öldürme", "kasten yaralama", "hakaret", "hırsızlık", "dolandırıcılık", "uyuşturucu", "zimmet", "görevi kötüye kullanma"]


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
        "Cebeci'de bir kasten öldürme ve nitelikli hâl tartışması",
        "Cebeci şerh geleneği; TCK özel lafız bağlar",
        [
            "Kâğıdın ilk cümlesinde hangi suç tipinin kurulduğunu yazın.",
            "81 ile 82'yi, 86 ile 87'yi, zimmet ile görevi kötüye kullanmayı karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AÜHF Cebeci geleneği tipi önce yazar.",
            "Ceza genel ayrı derstir; tipiklik bu kâğıtta suç unsurunun yerine geçmez.",
        ],
    ),
    "ankara-yildirim-beyazit": (
        "Esenboğa yolunda bir hırsızlık ve nitelikli hâl",
        "Ankara dogmatiği; TCK özel lafız bağlar",
        [
            "AYBÜ kâğıdında suç tipi ilk cümlede durur.",
            "Basit hırsızlık ile nitelikliyi, 188 ile 191'i karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AYBÜ dönemlik okur; özel ceza TCK lafzına bağlanır.",
            "Ceza genel ayrı derstir.",
        ],
    ),
    "istanbul": (
        "Beyazıt'ta bir dolandırıcılık ve hile",
        "İstanbul ekolü; TCK özel lafız bağlar",
        [
            "Beyazıt kâğıdında ilk cümle suç tipini söyler.",
            "Hırsızlık ile dolandırıcılığı, hakaret ile sövme kırmasını karıştırmayın.",
            "EBS bağlayıcıdır.",
        ],
        [
            "İÜHF özel ceza amfi + pratik; kâğıtta TCK lafzı önce gelir.",
            "HUKK2074 borçlar genel ayrı derstir.",
        ],
    ),
    "marmara": (
        "Kadıköy'de bir zimmet ve kamu görevi",
        "Marmara pratik hattı; TCK özel lafız bağlar",
        [
            "Marmara kâğıdında zimmeti görevi kötüye kullanmadan ayırın.",
            "Nitelikli öldürmeyi temel tipi ile karıştırmayın.",
            "MEOBS bağlayıcıdır.",
        ],
        [
            "Marmara pratik çalışmayı teorinin yanına koyar.",
            "HUK201 borçlar genel ayrı derstir.",
        ],
    ),
    "dokuz-eylul": (
        "Alsancak'ta bir kasten yaralama ve neticesi sebebiyle ağırlaşmış hâl",
        "Ege/İzmir dogmatiği; TCK özel lafız bağlar",
        [
            "DEÜ kâğıdında önce suç tipini yazın.",
            "86 ile 87'yi, 81 ile 83'ü karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "DEÜ özel ceza dönemlik Bologna hattındadır.",
            "Ceza genel ayrı derstir.",
        ],
    ),
    "hacettepe": (
        "Beytepe yurdunda bir hakaret ve isnadın ispatı",
        "Ankara hattı; TCK özel lafız Bologna çıktısıyla okunur",
        [
            "Hacettepe kâğıdında tipi ayırır, niteliği uygular, neticeyi yazar.",
            "Hakaret ile sövme kırmasını karıştırmayın.",
            "Ders bilgi formu bağlayıcıdır.",
        ],
        [
            "Hacettepe özel cezada öğrenme çıktısı fiili kâğıtta görünür.",
            "Ceza genel ayrı derstir.",
        ],
    ),
    "galatasaray": (
        "Ortaköy'de vol ve hakaret karşılaştırması",
        "Fransız Code pénal; kâğıtta Türkçe TCK lafzı bağlar",
        [
            "GSÜ kâğıdında mehaz karşılaştırması TCK lafzını aydınlatır.",
            "Suç tipi kapısı ilk cümlede durur.",
            "Yönetmelik bağlayıcıdır.",
        ],
        [
            "GSÜ özel cezada Fransızca terim süs, TCK Türkçe bağlar.",
            "HUK222 borçlar genel ayrı derstir.",
        ],
    ),
    "bilkent": (
        "Bilkent yurdunda theft ve hırsızlık tartışması",
        "Karşılaştırmalı criminal; kâğıtta TCK lafzı bağlar",
        [
            "Bilkent kâğıdında theft cümlesi TCK hırsızlığının yerine geçmez.",
            "Fraud dolandırıcılık hile unsurunu silmez.",
            "Künye yoksa E./K. yazılmaz.",
        ],
        [
            "Bilkent özel cezada issue spotting unsur listesinin yerine geçmez.",
            "TCK lafzı Türkçe kâğıtta yazılır.",
        ],
    ),
    "koc": (
        "Rumelifeneri'nde kasten öldürme hypo'su",
        "Karşılaştırmalı homicide; bağlayıcı metin TCK'dır",
        [
            "Koç kâğıdında İngilizce terim TCK maddesinin yerine geçmez.",
            "Policy cümlesi unsur ve lafızdan sonra gelir.",
            "Suç tipi kapısı ilk cümlede durur.",
        ],
        [
            "Koç özel cezada hypo künye uydurmayı serbest bırakmaz.",
            "TCK resmi lafzı FSEK m. 31 ile serbesttir.",
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
                "format": "Klasik yazılı: TCK maddesi + suç tipi + olaya yedirme.",
                "tips": tips,
            },
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        data.setdefault("byCourse", {})["ceza-ozel"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
