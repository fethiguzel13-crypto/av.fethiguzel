#!/usr/bin/env python3
"""Add byCourse.medeni-usul without clobbering other course patches."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "HUK201", "HUKK2074", "borclar", "borçlar", "Borçlar")

PATCHES = {
    "ankara": {
        "cityHook": "Cebeci'de bir tapu iptali davasının görev ve yetki tartışması",
        "mehaz": "Cebeci şerh geleneği; HMK lafzı bağlar",
        "examBox": {
            "calendar": "karma",
            "typicalWeights": "Klasik yazılı final ağırlıklı; oran dönem ilanı esas.",
            "format": "Uzun cevap: HMK maddesi + dava şartı + usul işlemi + sonuç.",
            "tips": [
                "Kâğıdın ilk cümlesinde görev mi yetki mi olduğunu yazın.",
                "Dava şartı ile ilk itirazı, istinaf ile temyizi karıştırmayın.",
                "OBS bağlayıcıdır.",
            ],
        },
        "syllabusOrder": [
            "görev",
            "yetki",
            "dava şartları",
            "dilekçeler",
            "tahkikat ve delil",
            "hüküm ve kanun yolu",
        ],
        "schoolNotes": [
            "AÜHF Cebeci geleneği görev-yetki kapısını önce yazar.",
            "Borçlar ve ceza notları ayrı derslerdir.",
            "Slayt cümlesi alınmaz.",
        ],
    },
    "ankara-yildirim-beyazit": {
        "cityHook": "Esenboğa'da bir alacak davasının yetki itirazı",
        "mehaz": "Ankara dogmatiği; HMK lafzı bağlar",
        "examBox": {
            "calendar": "donemlik",
            "typicalWeights": "Ara sınav + final (OBS).",
            "format": "Klasik yazılı: madde + unsur + olaya yedirme.",
            "tips": [
                "AYBÜ kâğıdında görev-yetki kapısı ilk cümlede durur.",
                "Kesin yetki ile yetki sözleşmesini ayırın.",
                "OBS bağlayıcıdır.",
            ],
        },
        "syllabusOrder": ["görev", "yetki", "dava şartları", "dilekçe", "delil", "kanun yolu"],
        "schoolNotes": [
            "AYBÜ dönemlik okur; medeni usul HMK lafzına bağlanır.",
            "Borçlar genel ayrı derstir.",
        ],
    },
    "istanbul": {
        "cityHook": "Beyazıt'ta bir ticari davanın görev ve istinaf tartışması",
        "mehaz": "İstanbul ekolü; HMK lafzı bağlar",
        "examBox": {
            "calendar": "yillik",
            "typicalWeights": "Ara sınav + klasik final.",
            "format": "Uzun yazılı: HMK maddesi, dava şartı, (künye varsa) içtihat.",
            "tips": [
                "Beyazıt kâğıdında ilk cümle görev veya yetkiyi söyler.",
                "İstinaf ile temyizi, kesin delil ile takdiri delili karıştırmayın.",
                "EBS bağlayıcıdır.",
            ],
        },
        "syllabusOrder": ["görev yetki", "dava şartları", "dilekçeler", "tahkikat", "kanun yolu"],
        "schoolNotes": [
            "İÜHF medeni usul amfi + pratik; kâğıtta HMK lafzı önce gelir.",
            "HUKK2074 borçlar genel ayrı derstir.",
        ],
    },
    "marmara": {
        "cityHook": "Kadıköy'de bir kira davasının dilekçe ve ıslah tartışması",
        "mehaz": "Marmara pratik hattı; HMK lafzı bağlar",
        "examBox": {
            "calendar": "donemlik",
            "typicalWeights": "Teorik + pratik; ara sınav + final.",
            "format": "Klasik yazılı + pratik: HMK maddesi + unsur + Göztepe olayı.",
            "tips": [
                "Marmara kâğıdında dilekçe unsurunu vakıaya bağlayın.",
                "Islah ile iddianın genişletilmesini karıştırmayın.",
                "MEOBS bağlayıcıdır.",
            ],
        },
        "syllabusOrder": ["görev", "yetki", "dilekçe", "tahkikat", "hüküm"],
        "schoolNotes": [
            "Marmara pratik çalışmayı teorinin yanına koyar.",
            "HUK201 borçlar genel ayrı derstir.",
        ],
    },
    "dokuz-eylul": {
        "cityHook": "Alsancak'ta bir alacak davasının yetki ve delil tartışması",
        "mehaz": "Ege/İzmir dogmatiği; HMK lafzı bağlar",
        "examBox": {
            "calendar": "donemlik",
            "typicalWeights": "Ara sınav + final (OBS).",
            "format": "Klasik yazılı: madde + unsur + İzmir pratik olayı.",
            "tips": [
                "DEÜ kâğıdında önce görev-yetkiyi yazın.",
                "Senetle ispat ile tanık yasağını ayırın.",
                "OBS bağlayıcıdır.",
            ],
        },
        "syllabusOrder": ["görev yetki", "dava şartları", "delil", "kanun yolu"],
        "schoolNotes": [
            "DEÜ medeni usul dönemlik Bologna hattındadır.",
            "Borçlar genel ayrı derstir.",
        ],
    },
    "hacettepe": {
        "cityHook": "Beytepe'de bir tüketici davasının görev ve dilekçe tartışması",
        "mehaz": "Ankara hattı; HMK lafzı Bologna çıktısıyla okunur",
        "examBox": {
            "calendar": "donemlik",
            "typicalWeights": "Ara sınav + final; oran ders bilgi formunda.",
            "format": "Klasik yazılı; öğrenme çıktısı fiili görünür.",
            "tips": [
                "Hacettepe kâğıdında görev-yetkiyi ayırır, dilekçeyi uygular, kanun yolunu yorumlar.",
                "Dava şartı ile ilk itirazı karıştırmayın.",
                "Ders bilgi formu bağlayıcıdır.",
            ],
        },
        "syllabusOrder": ["görev", "yetki", "dilekçe", "delil", "kanun yolu"],
        "schoolNotes": [
            "Hacettepe usulünde öğrenme çıktısı fiili kâğıtta görünür.",
            "Borçlar genel ayrı derstir.",
        ],
    },
    "galatasaray": {
        "cityHook": "Ortaköy'de bir alacak davası ve Code de procédure civile karşılaştırması",
        "mehaz": "Fransız usul geleneği; kâğıtta Türkçe HMK lafzı bağlar",
        "examBox": {
            "calendar": "donemlik",
            "typicalWeights": "Ara sınav + final; devam zorunluluğu vardır.",
            "format": "Klasik yazılı; Fransızca terim süs, HMK Türkçe yazılır.",
            "tips": [
                "GSÜ kâğıdında mehaz karşılaştırması HMK lafzını aydınlatır.",
                "Görev-yetki kapısı ilk cümlede durur.",
                "Yönetmelik bağlayıcıdır.",
            ],
        },
        "syllabusOrder": [
            "compétence d'attribution",
            "compétence territoriale",
            "conditions de la demande",
            "preuves",
            "voies de recours",
        ],
        "schoolNotes": [
            "GSÜ medeni usulde Fransızca terim süs, HMK Türkçe bağlar.",
            "HUK222 borçlar genel ayrı derstir.",
        ],
    },
    "bilkent": {
        "cityHook": "Bilkent'te bir yurt alacağı davasının yetki ve delil tartışması",
        "mehaz": "Karşılaştırmalı / common law usul okuması; kâğıtta HMK lafzı bağlar",
        "examBox": {
            "calendar": "donemlik",
            "typicalWeights": "Ara sınav + final. %30 İngilizce bileşen.",
            "format": "Issue spotting + madde: vakıayı soruna ayır, HMK maddesini bağla.",
            "tips": [
                "Bilkent kâğıdında jurisdiction cümlesi HMK görev-yetkisinin yerine geçmez.",
                "Discovery, senetle ispat kuralını silmez.",
                "Künye yoksa E./K. yazılmaz.",
            ],
        },
        "syllabusOrder": [
            "subject-matter jurisdiction",
            "venue",
            "pleadings",
            "evidence",
            "appeals",
        ],
        "schoolNotes": [
            "Bilkent usulünde issue spotting unsur listesinin yerine geçmez.",
            "HMK lafzı Türkçe kâğıtta yazılır.",
        ],
    },
    "koc": {
        "cityHook": "Rumelifeneri'nde bir alacak hypo'sunun dilekçe ve istinaf tartışması",
        "mehaz": "Karşılaştırmalı / ABD civil procedure; bağlayıcı metin HMK'dır",
        "examBox": {
            "calendar": "donemlik",
            "typicalWeights": "Ara sınav + final + ödev.",
            "format": "Hypo + issue spotting: vakıayı soruna ayır, HMK maddesini bağla.",
            "tips": [
                "Koç kâğıdında İngilizce terim HMK maddesinin yerine geçmez.",
                "Policy cümlesi unsur ve lafızdan sonra gelir.",
                "Görev-yetki kapısı ilk cümlede durur.",
            ],
        },
        "syllabusOrder": [
            "jurisdiction",
            "pleadings",
            "discovery and proof",
            "judgment",
            "appeals",
        ],
        "schoolNotes": [
            "Koç usulünde hypo künye uydurmayı serbest bırakmaz.",
            "HMK resmi lafzı FSEK m. 31 ile serbesttir.",
        ],
    },
}


def faculty_sources(data: dict) -> list:
    out = []
    for s in data.get("sources") or []:
        blob = f"{s.get('title') or ''} {s.get('url') or ''} {s.get('note') or ''}"
        if any(n.lower() in blob.lower() for n in NEEDLES):
            continue
        out.append(s)
    return out


def main() -> None:
    for slug, patch in PATCHES.items():
        p = ROOT / f"{slug}.json"
        data = json.loads(p.read_text(encoding="utf-8"))
        patch["sources"] = faculty_sources(data)
        data.setdefault("byCourse", {})["medeni-usul"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug, "sources", len(patch["sources"]))


if __name__ == "__main__":
    main()
