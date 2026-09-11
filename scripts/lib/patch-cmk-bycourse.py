#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "HUK201", "HUKK2074", "borclar", "borçlar", "eşya", "TCK m.81", "tacir")
ORDER = ["soruşturma", "koruma tedbirleri", "ifade ve sorgu", "kovuşturma", "delil", "hüküm ve kanun yolu"]


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
        "Cebeci'de bir tutuklama ve adli kontrol tartışması",
        "Cebeci şerh geleneği; CMK lafzı bağlar",
        [
            "Kâğıdın ilk cümlesinde soruşturma mı kovuşturma mı olduğunu yazın.",
            "İfade ile sorguyu, tutuklama ile adli kontrolü karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AÜHF Cebeci geleneği evreyi önce yazar.",
            "Ceza genel ve özel ayrı derslerdir.",
        ],
    ),
    "ankara-yildirim-beyazit": (
        "Esenboğa yolunda bir yakalama ve gözaltı",
        "Ankara dogmatiği; CMK lafzı bağlar",
        [
            "AYBÜ kâğıdında evre kapısı ilk cümlede durur.",
            "KYOK ile iddianameyi, istinaf ile temyizi karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AYBÜ dönemlik okur; CMK lafzına bağlanır.",
            "Ceza genel ayrı derstir.",
        ],
    ),
    "istanbul": (
        "Beyazıt'ta bir iddianame iadesi ve duruşma",
        "İstanbul ekolü; CMK lafzı bağlar",
        [
            "Beyazıt kâğıdında ilk cümle evreyi söyler.",
            "Yasak delili hükme esas almayın.",
            "EBS bağlayıcıdır.",
        ],
        [
            "İÜHF CMK amfi + pratik; kâğıtta CMK lafzı önce gelir.",
            "HUKK2074 borçlar genel ayrı derstir.",
        ],
    ),
    "marmara": (
        "Kadıköy'de bir müdafi ve sorgu",
        "Marmara pratik hattı; CMK lafzı bağlar",
        [
            "Marmara kâğıdında ifadeyi sorgudan ayırın.",
            "Tutuklama nedenini yakalama ile karıştırmayın.",
            "MEOBS bağlayıcıdır.",
        ],
        [
            "Marmara pratik çalışmayı teorinin yanına koyar.",
            "HUK201 borçlar genel ayrı derstir.",
        ],
    ),
    "dokuz-eylul": (
        "Alsancak'ta bir arama ve elkoyma",
        "Ege/İzmir dogmatiği; CMK lafzı bağlar",
        [
            "DEÜ kâğıdında önce evreyi yazın.",
            "Hâkim kararı ile gecikmesinde sakıncayı karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "DEÜ CMK dönemlik Bologna hattındadır.",
            "Ceza genel ayrı derstir.",
        ],
    ),
    "hacettepe": (
        "Beytepe'de öğrenci ifadesi ve müdafi",
        "Ankara hattı; CMK lafzı Bologna çıktısıyla okunur",
        [
            "Hacettepe kâğıdında evreyi ayırır, tedbiri uygular, hükmü yazar.",
            "Hükmün açıklanmasının geri bırakılmasını beraat ile karıştırmayın.",
            "Ders bilgi formu bağlayıcıdır.",
        ],
        [
            "Hacettepe CMK'da öğrenme çıktısı fiili kâğıtta görünür.",
            "Ceza genel ayrı derstir.",
        ],
    ),
    "galatasaray": (
        "Ortaköy'de instruction ve soruşturma karşılaştırması",
        "Fransız usul; kâğıtta Türkçe CMK lafzı bağlar",
        [
            "GSÜ kâğıdında mehaz karşılaştırması CMK lafzını aydınlatır.",
            "Evre kapısı ilk cümlede durur.",
            "Yönetmelik bağlayıcıdır.",
        ],
        [
            "GSÜ CMK'da Fransızca terim süs, CMK Türkçe bağlar.",
            "HUK222 borçlar genel ayrı derstir.",
        ],
    ),
    "bilkent": (
        "Bilkent yurdunda Miranda ve ifade tartışması",
        "Karşılaştırmalı criminal procedure; kâğıtta CMK lafzı bağlar",
        [
            "Bilkent kâğıdında Miranda cümlesi CMK m.147'nin yerine geçmez.",
            "Bail tutuklama-adli kontrol ayrımını silmez.",
            "Künye yoksa E./K. yazılmaz.",
        ],
        [
            "Bilkent CMK'da issue spotting unsur listesinin yerine geçmez.",
            "CMK lafzı Türkçe kâğıtta yazılır.",
        ],
    ),
    "koc": (
        "Rumelifeneri'nde tutuklama hypo'su",
        "Karşılaştırmalı detention; bağlayıcı metin CMK'dır",
        [
            "Koç kâğıdında İngilizce terim CMK maddesinin yerine geçmez.",
            "Policy cümlesi unsur ve lafızdan sonra gelir.",
            "Evre kapısı ilk cümlede durur.",
        ],
        [
            "Koç CMK'da hypo künye uydurmayı serbest bırakmaz.",
            "CMK resmi lafzı FSEK m. 31 ile serbesttir.",
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
                "format": "Klasik yazılı: CMK maddesi + evre + olaya yedirme.",
                "tips": tips,
            },
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        data.setdefault("byCourse", {})["ceza-muhakemesi"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
