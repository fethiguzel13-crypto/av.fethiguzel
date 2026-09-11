#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "HUK201", "HUKK2074", "borclar", "borçlar", "tacir sıfatı", "anonim")
ORDER = ["kıymetli evrak", "poliçe", "bono", "ciro", "çek", "def'i", "başvuru", "karşılıksız çek"]


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
        "Cebeci'de bir bono ve ciro tartışması",
        "Cebeci şerh geleneği; TTK kıymetli evrak lafzı bağlar",
        [
            "Kâğıdın ilk cümlesinde poliçe mi bono mu çek mi olduğunu yazın.",
            "Ciro ile teslimi, nama ile emreyi karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AÜHF Cebeci geleneği senet türünü önce yazar.",
            "Ticari işletme ve şirketler ayrı derslerdir.",
        ],
    ),
    "ankara-yildirim-beyazit": (
        "Esenboğa yolunda bir çek ve karşılıksız bedel",
        "Ankara dogmatiği; TTK ve ÇekK lafzı bağlar",
        [
            "AYBÜ kâğıdında senet türü ilk cümlede durur.",
            "Poliçe kabulünü bono ile karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AYBÜ dönemlik okur; kıymetli evrak TTK lafzına bağlanır.",
            "Ticari işletme ayrı derstir.",
        ],
    ),
    "istanbul": (
        "Beyazıt'ta bir poliçe kabulü ve protesto",
        "İstanbul ekolü; TTK kıymetli evrak lafzı bağlar",
        [
            "Beyazıt kâğıdında ilk cümle senet türünü söyler.",
            "Def'i ile başvuruyu, ciroyu teslimle karıştırmayın.",
            "EBS bağlayıcıdır.",
        ],
        [
            "İÜHF kıymetli evrak amfi + pratik; kâğıtta TTK lafzı önce gelir.",
            "HUKK2074 borçlar genel ayrı derstir.",
        ],
    ),
    "marmara": (
        "Kadıköy'de bir emre yazılı senet ve aval",
        "Marmara pratik hattı; TTK kıymetli evrak lafzı bağlar",
        [
            "Marmara kâğıdında bonoyu poliçeden ayırın.",
            "Karşılıksız çeki TTK unsur eksikliği ile karıştırmayın.",
            "MEOBS bağlayıcıdır.",
        ],
        [
            "Marmara pratik çalışmayı teorinin yanına koyar.",
            "HUK201 borçlar genel ayrı derstir.",
        ],
    ),
    "dokuz-eylul": (
        "Alsancak'ta bir hamile yazılı senet ve zayi",
        "Ege/İzmir dogmatiği; TTK kıymetli evrak lafzı bağlar",
        [
            "DEÜ kâğıdında önce senet türünü yazın.",
            "Nama yazılıyı emre yazılı ile karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "DEÜ kıymetli evrak dönemlik Bologna hattındadır.",
            "Ticari işletme ayrı derstir.",
        ],
    ),
    "hacettepe": (
        "Beytepe'de öğrenci çeki ve ibraz",
        "Ankara hattı; TTK lafzı Bologna çıktısıyla okunur",
        [
            "Hacettepe kâğıdında türü ayırır, ciroyu uygular, başvuru sonucunu yazar.",
            "Zamanaşımını ibraz süresi ile karıştırmayın.",
            "Ders bilgi formu bağlayıcıdır.",
        ],
        [
            "Hacettepe kıymetli evrakta öğrenme çıktısı fiili kâğıtta görünür.",
            "Ticari işletme ayrı derstir.",
        ],
    ),
    "galatasaray": (
        "Ortaköy'de lettre de change ve poliçe karşılaştırması",
        "Fransız kıymetli evrak; kâğıtta Türkçe TTK lafzı bağlar",
        [
            "GSÜ kâğıdında mehaz karşılaştırması TTK lafzını aydınlatır.",
            "Senet türü kapısı ilk cümlede durur.",
            "Yönetmelik bağlayıcıdır.",
        ],
        [
            "GSÜ kıymetli evrakta Fransızca terim süs, TTK Türkçe bağlar.",
            "HUK222 borçlar genel ayrı derstir.",
        ],
    ),
    "bilkent": (
        "Bilkent yurdunda negotiable instrument tartışması",
        "Karşılaştırmalı negotiable; kâğıtta TTK lafzı bağlar",
        [
            "Bilkent kâğıdında negotiable cümlesi TTK kıymetli evrakının yerine geçmez.",
            "Endorsement ciro unsurunu silmez.",
            "Künye yoksa E./K. yazılmaz.",
        ],
        [
            "Bilkent kıymetli evrakta issue spotting unsur listesinin yerine geçmez.",
            "TTK lafzı Türkçe kâğıtta yazılır.",
        ],
    ),
    "koc": (
        "Rumelifeneri'nde çek hypo'su",
        "Karşılaştırmalı cheque; bağlayıcı metin TTK ve ÇekK'dır",
        [
            "Koç kâğıdında İngilizce terim TTK maddesinin yerine geçmez.",
            "Policy cümlesi unsur ve lafızdan sonra gelir.",
            "Senet türü kapısı ilk cümlede durur.",
        ],
        [
            "Koç kıymetli evrakta hypo künye uydurmayı serbest bırakmaz.",
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
                "format": "Klasik yazılı: TTK maddesi + senet türü + olaya yedirme.",
                "tips": tips,
            },
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        data.setdefault("byCourse", {})["kiymetli-evrak"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
