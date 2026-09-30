#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = (
    "HKZ201",
    "HUK201",
    "HUKK2074",
    "borcun kaynağını",
    "vergiyi doğuran",
    "tüketici sıfatı",
    "iş güvencesi",
    "sigorta bedeli",
)
ORDER = [
    "eser sözleşmesi",
    "bedel",
    "ayıp",
    "teslim ve fesih",
    "ruhsat",
    "ruhsatsız yapı",
    "kamulaştırma",
    "kat karşılığı",
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
        "Cebeci'de bir götürü bedel ve ayıplı kaba inşaat",
        "Cebeci şerh geleneği; TBK eser lafzı bağlar",
        [
            "Kâğıdın ilk cümlesinde eser mi hizmet mi, götürü mü yaklaşık bedel mi yazın.",
            "Taşınmaz üzerindeki eserde sözleşmeden dönmeyi serbest sanmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AÜHF Cebeci geleneği eser sözleşmesini önce yazar.",
            "Borçlar genel kaynak kapısı ayrı derstir; bu kâğıtta TBK eser ve imar konuşur.",
        ],
    ),
    "ankara-yildirim-beyazit": (
        "Esenboğa yolunda bir yaklaşık bedel aşımı",
        "Ankara dogmatiği; TBK m.480 ve m.482 lafzı bağlar",
        [
            "AYBÜ kâğıdında bedel türü ilk cümlede durur.",
            "Kabulden sonra açık ayıbı gizlenmiş ayıp sanmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AYBÜ dönemlik okur; inşaat hukuku TBK ve imar lafzına bağlanır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "istanbul": (
        "Beyazıt'ta bir kat karşılığı ve resmi şekil",
        "İstanbul ekolü; TBK m.237 ve m.470 lafzı bağlar",
        [
            "Beyazıt kâğıdında ilk cümle eser mi arsa payı temliki mi söyler.",
            "Satış vaadini adi yazılı sanmayın.",
            "EBS bağlayıcıdır.",
        ],
        [
            "İÜHF inşaat hukuku amfi + pratik; kâğıtta TBK lafzı önce gelir.",
            "HUKK2074 borçlar genel ayrı derstir.",
        ],
    ),
    "marmara": (
        "Kadıköy'de bir ruhsatsız kat ve mühür",
        "Marmara pratik hattı; İmar Kanunu m.32 lafzı bağlar",
        [
            "Marmara kâğıdında özel hukuk ayıbını idari mühürden ayırın.",
            "Götürü bedelde artırım kapısını açık sanmayın.",
            "MEOBS bağlayıcıdır.",
        ],
        [
            "Marmara pratik çalışmayı teorinin yanına koyar.",
            "HUK201 borçlar genel ayrı derstir.",
        ],
    ),
    "dokuz-eylul": (
        "Alsancak'ta bir işe geç başlama ve sözleşmeden dönme",
        "Ege/İzmir dogmatiği; TBK m.473 lafzı bağlar",
        [
            "DEÜ kâğıdında önce eserin tanımını yazın.",
            "Teslim gününü beklemeden dönmeyi her gecikmeye uygulamayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "DEÜ inşaat hukuku dönemlik Bologna hattındadır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "hacettepe": (
        "Beytepe'de bir malzeme ayıbı ve bildirim",
        "Ankara hattı; TBK m.472 lafzı Bologna çıktısıyla okunur",
        [
            "Hacettepe kâğıdında malzemeyi ayırır, ayıbı bildirir, seçimlik hakkı yazar.",
            "İşsahibinin talimatından doğan ayıpta yükleniciyi sorumlu sanmayın.",
            "Ders bilgi formu bağlayıcıdır.",
        ],
        [
            "Hacettepe inşaat hukukunda öğrenme çıktısı fiili kâğıtta görünür.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "galatasaray": (
        "Ortaköy'de contrat d'entreprise ve götürü bedel karşılaştırması",
        "Fransız eser hukuku; kâğıtta Türkçe TBK lafzı bağlar",
        [
            "GSÜ kâğıdında mehaz karşılaştırması TBK m.470'i aydınlatır.",
            "Eser kapısı ilk cümlede durur.",
            "Yönetmelik bağlayıcıdır.",
        ],
        [
            "GSÜ inşaat hukukunda Fransızca terim süs, TBK Türkçe bağlar.",
            "HUK222 borçlar genel ayrı derstir.",
        ],
    ),
    "bilkent": (
        "Bilkent yurdunda lump sum versus cost plus tartışması",
        "Karşılaştırmalı construction; kâğıtta TBK lafzı bağlar",
        [
            "Bilkent kâğıdında lump sum cümlesi TBK m.480'in yerine geçmez.",
            "Acceptance, kasten gizlenen ayıbı silmez.",
            "Künye yoksa E./K. yazılmaz.",
        ],
        [
            "Bilkent inşaat hukukunda issue spotting unsur listesinin yerine geçmez.",
            "TBK lafzı Türkçe kâğıtta yazılır.",
        ],
    ),
    "koc": (
        "Rumelifeneri'nde kat karşılığı hypo'su",
        "Karşılaştırmalı construction; bağlayıcı metin TBK m.470 ve m.237'dir",
        [
            "Koç kâğıdında İngilizce terim resmi şeklin yerine geçmez.",
            "Policy cümlesi unsur ve lafızdan sonra gelir.",
            "Eser kapısı ilk cümlede durur.",
        ],
        [
            "Koç inşaat hukukunda hypo künye uydurmayı serbest bırakmaz.",
            "Kanun lafzı FSEK m. 31 ile serbesttir.",
        ],
    ),
}

CAL = {"ankara": "karma", "istanbul": "yillik"}


def main() -> None:
    for slug, (hook, mehaz, tips, notes) in PATCHES.items():
        p = ROOT / f"{slug}.json"
        data = json.loads(p.read_text(encoding="utf-8"))
        data.setdefault("byCourse", {})["insaat-hukuku"] = {
            "cityHook": hook,
            "mehaz": mehaz,
            "examBox": {
                "calendar": CAL.get(slug, "donemlik"),
                "typicalWeights": "Ara sınav + final; oran OBS/dönem ilanı esas.",
                "format": "Klasik yazılı: TBK veya İmar maddesi + inşaat kurumu + olaya yedirme.",
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
