#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "eşya", "zilyetlik", "icra", "İİK", "nişan", "zümre", "HMK", "TCK")
ORDER = ["satış", "bağışlama", "kira", "eser", "hizmet", "vekâlet", "kefalet", "ödünç"]


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
        "Cebeci'de ikinci el bir araç satımı ve ayıp bildirimi",
        "Cebeci şerh geleneği; TBK özel sözleşme lafzı bağlar",
        [
            "Kâğıdın ilk cümlesinde hangi özel sözleşmenin kurulduğunu yazın.",
            "Ayıp ile seçimlik hakları, kira ile eseri, hizmet ile vekâleti karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AÜHF Cebeci geleneği sözleşme türünü önce yazar.",
            "Borçlar genel ayrı derstir; borcun kaynağı bu kâğıtta aranmaz.",
        ],
    ),
    "ankara-yildirim-beyazit": (
        "Esenboğa'da bir konut kirası ve tahliye",
        "Ankara dogmatiği; TBK özel sözleşme lafzı bağlar",
        [
            "AYBÜ kâğıdında sözleşme türü ilk cümlede durur.",
            "Konut kirası korumasını genel kira ile, eseri satış ayıbı ile karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AYBÜ dönemlik okur; özel hüküm TBK lafzına bağlanır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "istanbul": (
        "Beyazıt'ta bir dükkân kirası ve tahliye",
        "İstanbul ekolü; TBK özel sözleşme lafzı bağlar",
        [
            "Beyazıt kâğıdında ilk cümle sözleşme türünü söyler.",
            "Kefalet şekli ile azami miktarı, eser bedelini kira bedeliyle karıştırmayın.",
            "EBS bağlayıcıdır.",
        ],
        [
            "İÜHF özel borçlar amfi + pratik; kâğıtta TBK lafzı önce gelir.",
            "HUKK2074 borçlar genel ayrı derstir.",
        ],
    ),
    "marmara": (
        "Kadıköy'de kat karşılığı inşaat ve eser ayıbı",
        "Marmara pratik hattı; TBK özel sözleşme lafzı bağlar",
        [
            "Marmara kâğıdında eseri satıştan, kirayı ödünçten ayırın.",
            "Götürü bedel ile yaklaşık bedeli karıştırmayın.",
            "MEOBS bağlayıcıdır.",
        ],
        [
            "Marmara pratik çalışmayı teorinin yanına koyar.",
            "HUK201 borçlar genel ayrı derstir.",
        ],
    ),
    "dokuz-eylul": (
        "Alsancak'ta bir yazlık kira ve ayıp",
        "Ege/İzmir dogmatiği; TBK özel sözleşme lafzı bağlar",
        [
            "DEÜ kâğıdında önce sözleşme türünü yazın.",
            "Hizmet ile vekâleti, kullanım ödüncü ile kirayı karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "DEÜ özel borçlar dönemlik Bologna hattındadır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "hacettepe": (
        "Beytepe'de öğrenci evi kirası ve depozito",
        "Ankara hattı; TBK özel lafız Bologna çıktısıyla okunur",
        [
            "Hacettepe kâğıdında türü ayırır, ayıbı uygular, seçimlik hakkı yazar.",
            "Konut kirası belirsiz süre feshini genel kira ile karıştırmayın.",
            "Ders bilgi formu bağlayıcıdır.",
        ],
        [
            "Hacettepe özel borçlarda öğrenme çıktısı fiili kâğıtta görünür.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "galatasaray": (
        "Ortaköy'de vente ve kira karşılaştırması",
        "Fransız Code civil; kâğıtta Türkçe TBK lafzı bağlar",
        [
            "GSÜ kâğıdında mehaz karşılaştırması TBK lafzını aydınlatır.",
            "Sözleşme türü kapısı ilk cümlede durur.",
            "Yönetmelik bağlayıcıdır.",
        ],
        [
            "GSÜ özel borçlarda Fransızca terim süs, TBK Türkçe bağlar.",
            "HUK222 borçlar genel ayrı derstir.",
        ],
    ),
    "bilkent": (
        "Bilkent yurdunda kira ve warranty tartışması",
        "Karşılaştırmalı contracts; kâğıtta TBK lafzı bağlar",
        [
            "Bilkent kâğıdında warranty cümlesi TBK ayıp seçimlik haklarının yerine geçmez.",
            "Lease / hire kira-eser ayrımını silmez.",
            "Künye yoksa E./K. yazılmaz.",
        ],
        [
            "Bilkent özel borçlarda issue spotting unsur listesinin yerine geçmez.",
            "TBK lafzı Türkçe kâğıtta yazılır.",
        ],
    ),
    "koc": (
        "Rumelifeneri'nde kefalet hypo'su",
        "Karşılaştırmalı suretyship; bağlayıcı metin TBK'dır",
        [
            "Koç kâğıdında İngilizce terim TBK maddesinin yerine geçmez.",
            "Policy cümlesi unsur ve lafızdan sonra gelir.",
            "Sözleşme türü kapısı ilk cümlede durur.",
        ],
        [
            "Koç özel borçlarda hypo künye uydurmayı serbest bırakmaz.",
            "TBK resmi lafzı FSEK m. 31 ile serbesttir.",
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
                "format": "Klasik yazılı: TBK maddesi + sözleşme türü + olaya yedirme.",
                "tips": tips,
            },
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        data.setdefault("byCourse", {})["borclar-ozel"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
