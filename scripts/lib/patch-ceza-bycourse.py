#!/usr/bin/env python3
"""Add byCourse.ceza-genel patches without clobbering medeni overlays."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"

PATCHES = {
    "ankara": {
        "cityHook": "Cebeci'de bir kasten yaralama ve meşru savunma tartışması",
        "mehaz": "Cebeci şerh geleneği; TCK lafzı bağlar",
        "examBox": {
            "calendar": "karma",
            "typicalWeights": "Klasik yazılı final ağırlıklı; oran dönem ilanı esas.",
            "format": "Uzun cevap: TCK maddesi + tipiklik + hukuka aykırılık + kusur.",
            "tips": [
                "Kâğıdın ilk cümlesinde tipikliği yazın; meşru savunmayı kasttan önce kapamayın.",
                "Kast ile olası kastı, teşebbüs ile icraya başlamayı karıştırmayın.",
                "OBS bağlayıcıdır.",
            ],
        },
        "syllabusOrder": [
            "kanunilik",
            "kast ve taksir",
            "hukuka uygunluk",
            "teşebbüs",
            "iştirak ve içtima",
            "yaptırım",
        ],
        "schoolNotes": [
            "AÜHF Cebeci geleneği tipikliği önce yazar.",
            "Borçlar ve medeni notlar ayrı derslerdir.",
            "Slayt cümlesi alınmaz.",
        ],
    },
    "ankara-yildirim-beyazit": {
        "cityHook": "Esenboğa yolunda taksirle yaralama ve hukuka uygunluk",
        "mehaz": "Ankara dogmatiği; TCK lafzı bağlar",
        "examBox": {
            "calendar": "donemlik",
            "typicalWeights": "Ara sınav + final (OBS).",
            "format": "Klasik yazılı: madde + unsur + olaya yedirme.",
            "tips": [
                "AYBÜ kâğıdında tipiklik kapısı ilk cümlede durur.",
                "Olası kast ile bilinçli taksiri ayırın.",
                "OBS bağlayıcıdır.",
            ],
        },
        "syllabusOrder": [
            "kanunilik",
            "kast-taksir",
            "hukuka uygunluk",
            "teşebbüs",
            "iştirak",
            "yaptırım",
        ],
        "schoolNotes": [
            "AYBÜ dönemlik okur; ceza genel TCK lafzına bağlanır.",
            "Borçlar genel ayrı derstir.",
        ],
    },
    "istanbul": {
        "cityHook": "Beyazıt'ta bir kasten yaralama ve içtima tartışması",
        "mehaz": "İstanbul ekolü; TCK lafzı bağlar",
        "examBox": {
            "calendar": "yillik",
            "typicalWeights": "Ara sınav + klasik final.",
            "format": "Uzun yazılı: tipiklik, hukuka aykırılık, kusur, (künye varsa) içtihat.",
            "tips": [
                "Beyazıt kâğıdında ilk cümle tipikliği söyler.",
                "İçtima ile iştiraki, teşebbüs ile icraya başlamayı karıştırmayın.",
                "EBS bağlayıcıdır.",
            ],
        },
        "syllabusOrder": [
            "kanunilik ve zaman",
            "kast taksir",
            "hukuka uygunluk",
            "teşebbüs iştirak içtima",
            "yaptırım",
        ],
        "schoolNotes": [
            "İÜHF ceza genel amfi + pratik; kâğıtta TCK lafzı önce gelir.",
            "HUKK2074 borçlar genel ayrı derstir.",
        ],
    },
    "marmara": {
        "cityHook": "Kadıköy'de bir kasten yaralama ve meşru savunma",
        "mehaz": "Marmara pratik hattı; TCK lafzı bağlar",
        "examBox": {
            "calendar": "donemlik",
            "typicalWeights": "Teorik + pratik; ara sınav + final.",
            "format": "Klasik yazılı + pratik: TCK maddesi + unsur + Göztepe olayı.",
            "tips": [
                "Marmara kâğıdında tipiklik ve hukuka uygunluk aynı torbada durmaz.",
                "Teşebbüste icraya başlamayı yazın.",
                "MEOBS bağlayıcıdır.",
            ],
        },
        "syllabusOrder": [
            "kanunilik",
            "kast taksir",
            "hukuka uygunluk",
            "teşebbüs",
            "yaptırım",
        ],
        "schoolNotes": [
            "Marmara pratik çalışmayı teorinin yanına koyar.",
            "HUK201 borçlar genel ayrı derstir.",
        ],
    },
    "dokuz-eylul": {
        "cityHook": "Alsancak'ta taksirle yaralama ve hukuka uygunluk",
        "mehaz": "Ege/İzmir dogmatiği; TCK lafzı bağlar",
        "examBox": {
            "calendar": "donemlik",
            "typicalWeights": "Ara sınav + final (OBS).",
            "format": "Klasik yazılı: madde + unsur + İzmir pratik olayı.",
            "tips": [
                "DEÜ kâğıdında önce tipikliği yazın.",
                "Kast ile taksiri, içtima ile iştiraki ayırın.",
                "OBS bağlayıcıdır.",
            ],
        },
        "syllabusOrder": [
            "kanunilik",
            "kast taksir",
            "hukuka uygunluk",
            "teşebbüs iştirak",
            "yaptırım",
        ],
        "schoolNotes": [
            "DEÜ ceza genel dönemlik Bologna hattındadır.",
            "Borçlar genel ayrı derstir.",
        ],
    },
    "hacettepe": {
        "cityHook": "Beytepe'de bir kasten yaralama ve teşebbüs",
        "mehaz": "Ankara hattı; TCK lafzı Bologna çıktısıyla okunur",
        "examBox": {
            "calendar": "donemlik",
            "typicalWeights": "Ara sınav + final; oran ders bilgi formunda.",
            "format": "Klasik yazılı; öğrenme çıktısı fiili görünür.",
            "tips": [
                "Hacettepe kâğıdında tipikliği yorumlar, hukuka uygunluğu ayırır, yaptırımı uygular.",
                "Olası kast ile bilinçli taksiri karıştırmayın.",
                "Ders bilgi formu bağlayıcıdır.",
            ],
        },
        "syllabusOrder": [
            "kanunilik",
            "kast taksir",
            "hukuka uygunluk",
            "teşebbüs",
            "yaptırım",
        ],
        "schoolNotes": [
            "Hacettepe ceza genelinde öğrenme çıktısı fiili kâğıtta görünür.",
            "Borçlar genel ayrı derstir.",
        ],
    },
    "galatasaray": {
        "cityHook": "Ortaköy'de kasten yaralama ve Code pénal karşılaştırması",
        "mehaz": "Fransız Code pénal; kâğıtta Türkçe TCK lafzı bağlar",
        "examBox": {
            "calendar": "donemlik",
            "typicalWeights": "Ara sınav + final; devam zorunluluğu vardır.",
            "format": "Klasik yazılı; Fransızca terim süs, TCK Türkçe yazılır.",
            "tips": [
                "GSÜ kâğıdında mehaz karşılaştırması TCK lafzını aydınlatır.",
                "Tipiklik kapısı ilk cümlede durur.",
                "Yönetmelik bağlayıcıdır.",
            ],
        },
        "syllabusOrder": [
            "légalité",
            "dol et faute",
            "faits justificatifs",
            "tentative",
            "peine",
        ],
        "schoolNotes": [
            "GSÜ ceza genelinde Fransızca terim süs, TCK Türkçe bağlar.",
            "HUK222 borçlar genel ayrı derstir.",
        ],
    },
    "bilkent": {
        "cityHook": "Bilkent kampüsünde taksirle yaralama ve kanunilik",
        "mehaz": "Karşılaştırmalı / Anglo-Amerikan; kâğıtta TCK lafzı bağlar",
        "examBox": {
            "calendar": "donemlik",
            "typicalWeights": "Ara sınav + final. %30 İngilizce bileşen.",
            "format": "Issue spotting + madde: vakıayı soruna ayır, TCK maddesini bağla.",
            "tips": [
                "Bilkent kâğıdında karşılaştırmalı cümle TCK şartını aydınlatır.",
                "Actus reus / mens rea Türkçe tipiklik ve kastın yerine geçmez.",
                "Künye yoksa E./K. yazılmaz.",
            ],
        },
        "syllabusOrder": [
            "legality",
            "intent and negligence",
            "justifications",
            "attempt and participation",
            "sanctions",
        ],
        "schoolNotes": [
            "Bilkent ceza genelinde issue spotting unsur listesinin yerine geçmez.",
            "TCK lafzı Türkçe kâğıtta yazılır.",
        ],
    },
    "koc": {
        "cityHook": "Rumelifeneri'nde kasten yaralama hypo'su",
        "mehaz": "Karşılaştırmalı / ABD case; bağlayıcı metin TCK'dır",
        "examBox": {
            "calendar": "donemlik",
            "typicalWeights": "Ara sınav + final + ödev.",
            "format": "Hypo + issue spotting: vakıayı soruna ayır, TCK maddesini bağla.",
            "tips": [
                "Koç kâğıdında İngilizce terim TCK maddesinin yerine geçmez.",
                "Policy cümlesi unsur ve lafızdan sonra gelir.",
                "Tipiklik kapısı ilk cümlede durur.",
            ],
        },
        "syllabusOrder": [
            "legality",
            "mens rea",
            "justifications",
            "inchoate offences",
            "sentencing",
        ],
        "schoolNotes": [
            "Koç ceza genelinde hypo usulü künye uydurmayı serbest bırakmaz.",
            "TCK resmi lafzı FSEK m. 31 ile serbesttir.",
        ],
    },
}


def main() -> None:
    for slug, patch in PATCHES.items():
        p = ROOT / f"{slug}.json"
        data = json.loads(p.read_text(encoding="utf-8"))
        data.setdefault("byCourse", {})["ceza-genel"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
