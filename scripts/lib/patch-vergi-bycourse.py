#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = (
    "HKZ201",
    "HUK201",
    "HUKK2074",
    "borclar",
    "borçlar",
    "tüketici sıfatı",
    "iş güvencesi",
    "kıdem",
)
ORDER = [
    "vergiyi doğuran olay",
    "mükellef",
    "tarh",
    "re'sen tarh",
    "zamanaşımı",
    "vergi cezası",
    "gelir vergisi",
    "katma değer vergisi",
]


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
        "Cebeci'de bir tarh ve tebliğ tartışması",
        "Cebeci şerh geleneği; VUK lafzı bağlar",
        [
            "Kâğıdın ilk cümlesinde vergiyi doğuran olay mı tarh mı olduğunu yazın.",
            "Mükellef ile vergi sorumlusunu, ikmalen ile re'sen tarhı karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AÜHF Cebeci geleneği vergi alacağının doğumunu önce yazar.",
            "Borçlar genel ve tüketici ayrı derslerdir; bu kâğıtta VUK konuşur.",
        ],
    ),
    "ankara-yildirim-beyazit": (
        "Esenboğa yolunda bir re'sen tarh ve beyanname",
        "Ankara dogmatiği; VUK lafzı bağlar",
        [
            "AYBÜ kâğıdında vergi alacağının doğumu ilk cümlede durur.",
            "Beş yıllık tarh zamanaşımını tahsil zamanaşımı sanmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AYBÜ dönemlik okur; vergi hukuku VUK lafzına bağlanır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "istanbul": (
        "Beyazıt'ta bir vergi ziyaı ve kaçakçılık ayrımı",
        "İstanbul ekolü; VUK m.341 ve m.359 lafzı bağlar",
        [
            "Beyazıt kâğıdında ilk cümle doğum anını veya ceza türünü söyler.",
            "Usulsüzlüğü vergi ziyaı saymayın.",
            "EBS bağlayıcıdır.",
        ],
        [
            "İÜHF vergi hukuku amfi + pratik; kâğıtta VUK lafzı önce gelir.",
            "HUKK2074 borçlar genel ayrı derstir.",
        ],
    ),
    "marmara": (
        "Kadıköy'de bir katma değer indirimi ve mükellef",
        "Marmara pratik hattı; VUK ve KDVK lafzı bağlar",
        [
            "Marmara kâğıdında tarhı tahakkuktan ayırın.",
            "Tam mükellefi dar mükellef sanmayın.",
            "MEOBS bağlayıcıdır.",
        ],
        [
            "Marmara pratik çalışmayı teorinin yanına koyar.",
            "HUK201 borçlar genel ayrı derstir.",
        ],
    ),
    "dokuz-eylul": (
        "Alsancak'ta bir takdir komisyonu ve zamanaşımının durması",
        "Ege/İzmir dogmatiği; VUK m.114 lafzı bağlar",
        [
            "DEÜ kâğıdında önce vergiyi doğuran olayı yazın.",
            "Takdir komisyonuna sevki süresiz durma sanmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "DEÜ vergi hukuku dönemlik Bologna hattındadır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "hacettepe": (
        "Beytepe'de bir ikmalen tarh ve matrah farkı",
        "Ankara hattı; VUK lafzı Bologna çıktısıyla okunur",
        [
            "Hacettepe kâğıdında doğumu ayırır, tarhı uygular, süreyi yazar.",
            "Re'sen tarhı deftere dayanan her farkta işletmeyin.",
            "Ders bilgi formu bağlayıcıdır.",
        ],
        [
            "Hacettepe vergi hukukunda öğrenme çıktısı fiili kâğıtta görünür.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "galatasaray": (
        "Ortaköy'de prescription fiscale ve tarh zamanaşımı karşılaştırması",
        "Fransız vergi usulü; kâğıtta Türkçe VUK lafzı bağlar",
        [
            "GSÜ kâğıdında mehaz karşılaştırması VUK lafzını aydınlatır.",
            "Vergi kapısı ilk cümlede durur.",
            "Yönetmelik bağlayıcıdır.",
        ],
        [
            "GSÜ vergi hukukunda Fransızca terim süs, VUK Türkçe bağlar.",
            "HUK222 borçlar genel ayrı derstir.",
        ],
    ),
    "bilkent": (
        "Bilkent yurdunda assessment vs accrual tartışması",
        "Karşılaştırmalı tax; kâğıtta VUK lafzı bağlar",
        [
            "Bilkent kâğıdında assessment cümlesi VUK m.20 tarhın yerine geçmez.",
            "Tax fraud, m.359 kaçakçılığının unsurunu silmez.",
            "Künye yoksa E./K. yazılmaz.",
        ],
        [
            "Bilkent vergi hukukunda issue spotting unsur listesinin yerine geçmez.",
            "VUK lafzı Türkçe kâğıtta yazılır.",
        ],
    ),
    "koc": (
        "Rumelifeneri'nde tam mükellefiyet hypo'su",
        "Karşılaştırmalı tax; bağlayıcı metin VUK, GVK ve KDVK'dir",
        [
            "Koç kâğıdında İngilizce terim VUK m.19'un yerine geçmez.",
            "Policy cümlesi unsur ve lafızdan sonra gelir.",
            "Vergi kapısı ilk cümlede durur.",
        ],
        [
            "Koç vergi hukukunda hypo künye uydurmayı serbest bırakmaz.",
            "Kanun lafzı FSEK m. 31 ile serbesttir.",
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
                "format": "Klasik yazılı: VUK maddesi + vergi kurumu + olaya yedirme.",
                "tips": tips,
            },
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        data.setdefault("byCourse", {})["vergi-hukuku"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
