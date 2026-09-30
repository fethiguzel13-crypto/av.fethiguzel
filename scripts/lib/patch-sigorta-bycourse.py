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
    "iş güvencesi",
)
ORDER = [
    "sigorta sözleşmesi",
    "riziko",
    "prim",
    "teminat",
    "beyan ve ihbar",
    "tazmin ve halefiyet",
    "hayat sigortası",
    "sona erme ve zamanaşımı",
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
        "Cebeci'de bir menfaat ve prim temerrüdü tartışması",
        "Cebeci şerh geleneği; TTK sigorta lafzı bağlar",
        [
            "Kâğıdın ilk cümlesinde menfaat var mı, prim ödendi mi yazın.",
            "İki yıllık zamanaşımı ile on yıllık sorumluluk süresini karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AÜHF Cebeci geleneği sigorta menfaatini önce yazar.",
            "Ticari işletme ve vergi ayrı derslerdir; bu kâğıtta TTK altıncı kitap konuşur.",
        ],
    ),
    "ankara-yildirim-beyazit": (
        "Esenboğa yolunda bir kasko ihbarı ve halefiyet",
        "Ankara dogmatiği; TTK m.1401 ve devamı bağlar",
        [
            "AYBÜ kâğıdında sigorta sözleşmesinin türü ilk cümlede durur.",
            "Eksik sigortayı aşkın sigorta sanmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AYBÜ dönemlik okur; sigorta TTK lafzına bağlanır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "istanbul": (
        "Beyazıt'ta bir başkasının hayatı üzerine sigorta ve yazılı izin",
        "İstanbul ekolü; TTK m.1490 lafzı bağlar",
        [
            "Beyazıt kâğıdında ilk cümle menfaati veya rizikonun gerçekleşmesini söyler.",
            "Halefiyeti cebri icra öncesi alacak sanmayın.",
            "EBS bağlayıcıdır.",
        ],
        [
            "İÜHF sigorta hukuku amfi + pratik; kâğıtta TTK lafzı önce gelir.",
            "HUKK2074 borçlar genel ayrı derstir.",
        ],
    ),
    "marmara": (
        "Kadıköy'de bir prim taksidi ve on günlük ihtar",
        "Marmara pratik hattı; TTK m.1434 lafzı bağlar",
        [
            "Marmara kâğıdında ilk taksit temerrüdünü sonraki prim temerrüdünden ayırın.",
            "Beyan yükümlülüğünü riziko ihbarı sanmayın.",
            "MEOBS bağlayıcıdır.",
        ],
        [
            "Marmara pratik çalışmayı teorinin yanına koyar.",
            "HUK201 borçlar genel ayrı derstir.",
        ],
    ),
    "dokuz-eylul": (
        "Alsancak'ta bir sigortacı iflası ve sözleşmenin sona ermesi",
        "Ege/İzmir dogmatiği; TTK m.1418 ve m.1420 lafzı bağlar",
        [
            "DEÜ kâğıdında önce sözleşmenin tanımını yazın.",
            "Sigortacının iflasını sigorta ettirenin aczi sanmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "DEÜ sigorta hukuku dönemlik Bologna hattındadır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "hacettepe": (
        "Beytepe'de bir eksik sigorta ve oran kuralı",
        "Ankara hattı; TTK lafzı Bologna çıktısıyla okunur",
        [
            "Hacettepe kâğıdında menfaati ayırır, tazminatı orana bağlar, süreyi yazar.",
            "Halefiyeti ödeme olmadan doğmuş sanmayın.",
            "Ders bilgi formu bağlayıcıdır.",
        ],
        [
            "Hacettepe sigorta hukukunda öğrenme çıktısı fiili kâğıtta görünür.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "galatasaray": (
        "Ortaköy'de intérêt d'assurance ve menfaat karşılaştırması",
        "Fransız sigorta hukuku; kâğıtta Türkçe TTK lafzı bağlar",
        [
            "GSÜ kâğıdında mehaz karşılaştırması TTK m.1408'i aydınlatır.",
            "Sigorta kapısı ilk cümlede durur.",
            "Yönetmelik bağlayıcıdır.",
        ],
        [
            "GSÜ sigorta hukukunda Fransızca terim süs, TTK Türkçe bağlar.",
            "HUK222 borçlar genel ayrı derstir.",
        ],
    ),
    "bilkent": (
        "Bilkent yurdunda insurable interest tartışması",
        "Karşılaştırmalı insurance; kâğıtta TTK lafzı bağlar",
        [
            "Bilkent kâğıdında insurable interest cümlesi TTK m.1408'in yerine geçmez.",
            "Subrogation, ödemeden önce doğmuş sayılmaz.",
            "Künye yoksa E./K. yazılmaz.",
        ],
        [
            "Bilkent sigorta hukukunda issue spotting unsur listesinin yerine geçmez.",
            "TTK lafzı Türkçe kâğıtta yazılır.",
        ],
    ),
    "koc": (
        "Rumelifeneri'nde prim temerrüdü hypo'su",
        "Karşılaştırmalı insurance; bağlayıcı metin TTK m.1401 ve devamıdır",
        [
            "Koç kâğıdında İngilizce terim TTK m.1420'nin yerine geçmez.",
            "Policy cümlesi unsur ve lafızdan sonra gelir.",
            "Sigorta kapısı ilk cümlede durur.",
        ],
        [
            "Koç sigorta hukukunda hypo künye uydurmayı serbest bırakmaz.",
            "Kanun lafzı FSEK m. 31 ile serbesttir.",
        ],
    ),
}

CAL = {"ankara": "karma", "istanbul": "yillik"}


def main() -> None:
    for slug, (hook, mehaz, tips, notes) in PATCHES.items():
        p = ROOT / f"{slug}.json"
        data = json.loads(p.read_text(encoding="utf-8"))
        data.setdefault("byCourse", {})["sigorta-hukuku"] = {
            "cityHook": hook,
            "mehaz": mehaz,
            "examBox": {
                "calendar": CAL.get(slug, "donemlik"),
                "typicalWeights": "Ara sınav + final; oran OBS/dönem ilanı esas.",
                "format": "Klasik yazılı: TTK maddesi + sigorta kurumu + olaya yedirme.",
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
