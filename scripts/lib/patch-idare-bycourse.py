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
    "vergiyi doğuran",
    "tüketici sıfatı",
    "sigorta bedeli",
    "iş güvencesi",
)
ORDER = [
    "hemşehri ve görev",
    "belediye organı",
    "memur",
    "yetki",
    "disiplin",
    "kamulaştırma",
    "imar",
    "vali ve kaymakam",
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
        "Cebeci'de bir meclis kararı ve mülki amire gönderme",
        "Cebeci şerh geleneği; 5393 ve 657 lafzı bağlar",
        [
            "Kâğıdın ilk cümlesinde meclis kararı mı başkan işlemi mi olduğunu yazın.",
            "Valiyi belediye başkanı, görevden uzaklaştırmayı disiplin cezası sanmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AÜHF Cebeci geleneği organı ve yetkiyi önce yazar.",
            "İYUK ayrı derstir; bu kâğıtta 5393, 657, 2942, 3194 ve 5442 konuşur.",
        ],
    ),
    "ankara-yildirim-beyazit": (
        "Esenboğa yolunda bir ruhsatsız yapı ve mühür",
        "Ankara dogmatiği; İmar Kanunu m.32 lafzı bağlar",
        [
            "AYBÜ kâğıdında görev ile yetki ilk cümlede ayrılır.",
            "Satın alma usulünü bedel davasının yerine koymayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AYBÜ dönemlik okur; idare hukuku kanun lafzına bağlanır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "istanbul": (
        "Beyazıt'ta bir kamulaştırma bedeli ve asliye hukuk",
        "İstanbul ekolü; 2942 m.8 ve m.10 lafzı bağlar",
        [
            "Beyazıt kâğıdında ilk cümle kamu yararı mı satın alma mı söyler.",
            "İptal davasını maddi hata düzeltimi sanmayın.",
            "EBS bağlayıcıdır.",
        ],
        [
            "İÜHF idare hukuku amfi + pratik; kâğıtta kanun lafzı önce gelir.",
            "HUKK2074 borçlar genel ayrı derstir.",
        ],
    ),
    "marmara": (
        "Kadıköy'de bir disiplin savunması ve yedi gün",
        "Marmara pratik hattı; 657 m.130 lafzı bağlar",
        [
            "Marmara kâğıdında uyarma ile kınamayı ayırın.",
            "Memuru sözleşmeli personel veya işçi sanmayın.",
            "MEOBS bağlayıcıdır.",
        ],
        [
            "Marmara pratik çalışmayı teorinin yanına koyar.",
            "HUK201 borçlar genel ayrı derstir.",
        ],
    ),
    "dokuz-eylul": (
        "Alsancak'ta bir vali talimatı ve belediye meclisi",
        "Ege/İzmir dogmatiği; 5442 m.9 lafzı bağlar",
        [
            "DEÜ kâğıdında önce vali ile belediye başkanını ayırın.",
            "Meclis kararının mülki amire gitmemesini yürürlük sanmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "DEÜ idare hukuku dönemlik Bologna hattındadır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "hacettepe": (
        "Beytepe'de bir hemşehri hakkı ve belediye görevi",
        "Ankara hattı; 5393 lafzı Bologna çıktısıyla okunur",
        [
            "Hacettepe kâğıdında hemşehriyi ayırır, görevi sayar, organı yazar.",
            "Encümeni meclisin yerine koymayın.",
            "Ders bilgi formu bağlayıcıdır.",
        ],
        [
            "Hacettepe idare hukukunda öğrenme çıktısı fiili kâğıtta görünür.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "galatasaray": (
        "Ortaköy'de décentralisation ve yetki genişliği karşılaştırması",
        "Fransız idare hukuku; kâğıtta Türkçe 5442 ve 5393 lafzı bağlar",
        [
            "GSÜ kâğıdında mehaz karşılaştırması vali ile belediyeyi ayırır.",
            "İdare kapısı ilk cümlede durur.",
            "Yönetmelik bağlayıcıdır.",
        ],
        [
            "GSÜ idare hukukunda Fransızca terim süs, kanun Türkçe bağlar.",
            "HUK222 borçlar genel ayrı derstir.",
        ],
    ),
    "bilkent": (
        "Bilkent yurdunda ultra vires tartışması",
        "Karşılaştırmalı administrative law; kâğıtta 5393 lafzı bağlar",
        [
            "Bilkent kâğıdında ultra vires cümlesi m.15 yetki listesinin yerine geçmez.",
            "Dismissal, görevden uzaklaştırma tedbirini silmez.",
            "Künye yoksa E./K. yazılmaz.",
        ],
        [
            "Bilkent idare hukukunda issue spotting unsur listesinin yerine geçmez.",
            "Kanun lafzı Türkçe kâğıtta yazılır.",
        ],
    ),
    "koc": (
        "Rumelifeneri'nde kamulaştırma hypo'su",
        "Karşılaştırmalı expropriation; bağlayıcı metin 2942'dir",
        [
            "Koç kâğıdında İngilizce terim 2942 m.8'in yerine geçmez.",
            "Policy cümlesi unsur ve lafızdan sonra gelir.",
            "İdare kapısı ilk cümlede durur.",
        ],
        [
            "Koç idare hukukunda hypo künye uydurmayı serbest bırakmaz.",
            "Kanun lafzı FSEK m. 31 ile serbesttir.",
        ],
    ),
}

CAL = {"ankara": "karma", "istanbul": "yillik"}


def main() -> None:
    for slug, (hook, mehaz, tips, notes) in PATCHES.items():
        p = ROOT / f"{slug}.json"
        data = json.loads(p.read_text(encoding="utf-8"))
        data.setdefault("byCourse", {})["idare-hukuku"] = {
            "cityHook": hook,
            "mehaz": mehaz,
            "examBox": {
                "calendar": CAL.get(slug, "donemlik"),
                "typicalWeights": "Ara sınav + final; oran OBS/dönem ilanı esas.",
                "format": "Klasik yazılı: kanun maddesi + idare kurumu + olaya yedirme.",
                "tips": tips,
            },
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
