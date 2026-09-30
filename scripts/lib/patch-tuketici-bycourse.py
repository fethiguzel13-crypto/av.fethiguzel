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
    "iş güvencesi",
    "kıdem",
    "tacir sıfatı",
)
ORDER = [
    "tüketici",
    "ayıplı mal",
    "ayıplı hizmet",
    "mesafeli sözleşme",
    "haksız şart",
    "taksitli satış",
    "uyuşmazlık",
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
        "Cebeci'de bir ayıplı telefon ve seçimlik hak",
        "Cebeci şerh geleneği; 6502 lafzı bağlar",
        [
            "Kâğıdın ilk cümlesinde tüketici sıfatı mı ticari amaç mı olduğunu yazın.",
            "Ayıp ile caymayı, hakem heyeti ile tüketici mahkemesini karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AÜHF Cebeci geleneği tüketici sıfatını önce yazar.",
            "Borçlar özel satım ayrı derstir; bu kâğıtta 6502 konuşur.",
        ],
    ),
    "ankara-yildirim-beyazit": (
        "Esenboğa yolunda bir mesafeli sipariş ve cayma",
        "Ankara dogmatiği; 6502 lafzı bağlar",
        [
            "AYBÜ kâğıdında tüketici işlemi ilk cümlede durur.",
            "Cayma hakkını ayıp seçimlik hakkının yerine koymayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AYBÜ dönemlik okur; tüketici hukuku 6502 lafzına bağlanır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "istanbul": (
        "Beyazıt'ta bir haksız şart ve yazılmamış sayılma",
        "İstanbul ekolü; 6502 m.5 lafzı bağlar",
        [
            "Beyazıt kâğıdında ilk cümle tüketici sıfatını veya ayıp kapısını söyler.",
            "TBK satım ayıbını TKHK m.11 ile karıştırmayın.",
            "EBS bağlayıcıdır.",
        ],
        [
            "İÜHF tüketici hukuku amfi + pratik; kâğıtta 6502 lafzı önce gelir.",
            "HUKK2074 borçlar genel ayrı derstir.",
        ],
    ),
    "marmara": (
        "Kadıköy'de bir taksitli satış ve bağlı kredi",
        "Marmara pratik hattı; 6502 lafzı bağlar",
        [
            "Marmara kâğıdında ayıplı malı ayıplı hizmetten ayırın.",
            "Bağlı krediyi adi kefalet sanmayın.",
            "MEOBS bağlayıcıdır.",
        ],
        [
            "Marmara pratik çalışmayı teorinin yanına koyar.",
            "HUK201 borçlar genel ayrı derstir.",
        ],
    ),
    "dokuz-eylul": (
        "Alsancak'ta bir mesafeli hizmet ve cayma süresi",
        "Ege/İzmir dogmatiği; 6502 lafzı bağlar",
        [
            "DEÜ kâğıdında önce tüketici sıfatını yazın.",
            "Ön bilgilendirme eksikliğini ayıp bildirimi sanmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "DEÜ tüketici hukuku dönemlik Bologna hattındadır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "hacettepe": (
        "Beytepe'de bir ayıplı hizmet ve yeniden ifa",
        "Ankara hattı; 6502 lafzı Bologna çıktısıyla okunur",
        [
            "Hacettepe kâğıdında sıfatı ayırır, seçimlik hakkı uygular, süreyi yazar.",
            "Hakem heyeti parasal sınırını mahkeme görevi sanmayın.",
            "Ders bilgi formu bağlayıcıdır.",
        ],
        [
            "Hacettepe tüketici hukukunda öğrenme çıktısı fiili kâğıtta görünür.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "galatasaray": (
        "Ortaköy'de clause abusive ve haksız şart karşılaştırması",
        "Fransız tüketici hukuku; kâğıtta Türkçe 6502 lafzı bağlar",
        [
            "GSÜ kâğıdında mehaz karşılaştırması 6502 lafzını aydınlatır.",
            "Tüketici kapısı ilk cümlede durur.",
            "Yönetmelik bağlayıcıdır.",
        ],
        [
            "GSÜ tüketici hukukunda Fransızca terim süs, 6502 Türkçe bağlar.",
            "HUK222 borçlar genel ayrı derstir.",
        ],
    ),
    "bilkent": (
        "Bilkent yurdunda consumer vs merchant tartışması",
        "Karşılaştırmalı consumer; kâğıtta 6502 lafzı bağlar",
        [
            "Bilkent kâğıdında consumer cümlesi 6502 tüketici tanımının yerine geçmez.",
            "Unfair term haksız şartın yazılmamış sayılmasını silmez.",
            "Künye yoksa E./K. yazılmaz.",
        ],
        [
            "Bilkent tüketici hukukunda issue spotting unsur listesinin yerine geçmez.",
            "6502 lafzı Türkçe kâğıtta yazılır.",
        ],
    ),
    "koc": (
        "Rumelifeneri'nde cayma hypo'su",
        "Karşılaştırmalı consumer; bağlayıcı metin 6502'dir",
        [
            "Koç kâğıdında İngilizce terim TKHK m.11'in yerine geçmez.",
            "Policy cümlesi unsur ve lafızdan sonra gelir.",
            "Tüketici kapısı ilk cümlede durur.",
        ],
        [
            "Koç tüketici hukukunda hypo künye uydurmayı serbest bırakmaz.",
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
                "format": "Klasik yazılı: TKHK maddesi + tüketici kurumu + olaya yedirme.",
                "tips": tips,
            },
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        data.setdefault("byCourse", {})["tuketici-hukuku"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
