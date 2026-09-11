#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "HUK201", "HUKK2074", "borclar", "borçlar", "eşya", "zilyetlik", "icra", "nişan", "zümre")
ORDER = ["iş sözleşmesi", "süre ve tür", "fesih", "kıdem ve ihbar", "ücret ve süre", "iş sağlığı"]


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
        "Cebeci'de bir işyeri feshinin geçersizliği ve işe iade",
        "Cebeci şerh geleneği; 4857 ve 1475 m.14 lafzı bağlar",
        [
            "Kâğıdın ilk cümlesinde iş güvencesi kapsamı mı haklı fesih mi olduğunu yazın.",
            "Kıdem ile ihbarı, belirli süre ile belirsiz süreyi karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AÜHF Cebeci geleneği kapsam ve fesih kapısını önce yazar.",
            "TBK hizmeti ayrı derstir; bu kâğıtta 4857 konuşur.",
        ],
    ),
    "ankara-yildirim-beyazit": (
        "Esenboğa yolunda bir şoförün fazla çalışması",
        "Ankara dogmatiği; 4857 lafzı bağlar",
        [
            "AYBÜ kâğıdında iş sözleşmesi unsuru ilk cümlede durur.",
            "İş güvencesi eşiğini her feshin işe iade doğurduğu sanmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AYBÜ dönemlik okur; iş hukuku 4857 lafzına bağlanır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "istanbul": (
        "Beyazıt'ta bir alt işveren zinciri ve asıl işveren",
        "İstanbul ekolü; 4857 m.2 lafzı bağlar",
        [
            "Beyazıt kâğıdında ilk cümle kapsam veya fesih türünü söyler.",
            "Kıdem 1475 m.14'ü ihbar 4857 m.17 ile karıştırmayın.",
            "EBS bağlayıcıdır.",
        ],
        [
            "İÜHF iş hukuku amfi + pratik; kâğıtta 4857 lafzı önce gelir.",
            "HUKK2074 borçlar genel ayrı derstir.",
        ],
    ),
    "marmara": (
        "Kadıköy'de bir çağrı üzerine çalışma ve ücret",
        "Marmara pratik hattı; 4857 lafzı bağlar",
        [
            "Marmara kâğıdında belirli süreyi belirsiz süreden ayırın.",
            "Fazla çalışma onayını yıllık izinle karıştırmayın.",
            "MEOBS bağlayıcıdır.",
        ],
        [
            "Marmara pratik çalışmayı teorinin yanına koyar.",
            "HUK201 borçlar genel ayrı derstir.",
        ],
    ),
    "dokuz-eylul": (
        "Alsancak'ta bir sezonluk iş ve belirli süre",
        "Ege/İzmir dogmatiği; 4857 lafzı bağlar",
        [
            "DEÜ kâğıdında önce kapsamı yazın.",
            "Deneme süresini belirsiz süre feshinin yerine koymayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "DEÜ iş hukuku dönemlik Bologna hattındadır.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "hacettepe": (
        "Beytepe hastanesinde bir hemşirenin işe iadesi",
        "Ankara hattı; 4857 lafzı Bologna çıktısıyla okunur",
        [
            "Hacettepe kâğıdında kapsamı ayırır, geçerli nedeni uygular, işe iade sonucunu yazar.",
            "Haklı fesih 25 ile iş güvencesi 18-21'i karıştırmayın.",
            "Ders bilgi formu bağlayıcıdır.",
        ],
        [
            "Hacettepe iş hukukunda öğrenme çıktısı fiili kâğıtta görünür.",
            "Borçlar genel ayrı derstir.",
        ],
    ),
    "galatasaray": (
        "Ortaköy'de licenciement ve iş güvencesi karşılaştırması",
        "Fransız iş hukuku; kâğıtta Türkçe 4857 lafzı bağlar",
        [
            "GSÜ kâğıdında mehaz karşılaştırması 4857 lafzını aydınlatır.",
            "Fesih kapısı ilk cümlede durur.",
            "Yönetmelik bağlayıcıdır.",
        ],
        [
            "GSÜ iş hukukunda Fransızca terim süs, 4857 Türkçe bağlar.",
            "HUK222 borçlar genel ayrı derstir.",
        ],
    ),
    "bilkent": (
        "Bilkent yurdunda at-will employment tartışması",
        "Karşılaştırmalı employment; kâğıtta 4857 lafzı bağlar",
        [
            "Bilkent kâğıdında at-will cümlesi 4857 iş güvencesinin yerine geçmez.",
            "Wrongful dismissal işe iade davasını silmez.",
            "Künye yoksa E./K. yazılmaz.",
        ],
        [
            "Bilkent iş hukukunda issue spotting unsur listesinin yerine geçmez.",
            "4857 lafzı Türkçe kâğıtta yazılır.",
        ],
    ),
    "koc": (
        "Rumelifeneri'nde kıdem hypo'su",
        "Karşılaştırmalı labor; bağlayıcı metin 4857 ve 1475 m.14'tür",
        [
            "Koç kâğıdında İngilizce terim 1475 m.14'ün yerine geçmez.",
            "Policy cümlesi unsur ve lafızdan sonra gelir.",
            "Fesih kapısı ilk cümlede durur.",
        ],
        [
            "Koç iş hukukunda hypo künye uydurmayı serbest bırakmaz.",
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
                "format": "Klasik yazılı: 4857 maddesi + fesih türü + olaya yedirme.",
                "tips": tips,
            },
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        data.setdefault("byCourse", {})["is-hukuku"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
