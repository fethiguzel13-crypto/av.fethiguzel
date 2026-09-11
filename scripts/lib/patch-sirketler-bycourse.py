#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "HUK201", "HUKK2074", "borclar", "borçlar", "eşya", "zilyetlik", "icra", "tacir sıfatı")
ORDER = ["ticaret şirketleri", "kollektif-komandit", "anonim", "organlar", "sermaye-pay", "limited", "sona erme"]


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
        "Cebeci'de bir anonim şirket genel kurulunun iptali",
        "Cebeci şerh geleneği; TTK şirketler lafzı bağlar",
        [
            "Kâğıdın ilk cümlesinde kişi şirketi mi sermaye şirketi mi olduğunu yazın.",
            "Yönetim kurulu ile genel kurulu, AŞ ile limitedi karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AÜHF Cebeci geleneği şirket türünü önce yazar.",
            "Ticari işletme ayrı derstir; tacir sıfatı bu kâğıdın kapısı değildir.",
        ],
    ),
    "ankara-yildirim-beyazit": (
        "Esenboğa'da bir limited şirket pay devri",
        "Ankara dogmatiği; TTK şirketler lafzı bağlar",
        [
            "AYBÜ kâğıdında şirket türü ilk cümlede durur.",
            "Kollektif sınırsız sorumluluğu limited payla karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "AYBÜ dönemlik okur; şirketler TTK lafzına bağlanır.",
            "Ticari işletme ayrı derstir.",
        ],
    ),
    "istanbul": (
        "Beyazıt'ta bir AŞ kuruluşu ve esas sözleşme",
        "İstanbul ekolü; TTK şirketler lafzı bağlar",
        [
            "Beyazıt kâğıdında ilk cümle şirket türünü söyler.",
            "Pay ile sermayeyi, organ yetkisini karıştırmayın.",
            "EBS bağlayıcıdır.",
        ],
        [
            "İÜHF şirketler amfi + pratik; kâğıtta TTK lafzı önce gelir.",
            "HUKK2074 borçlar genel ayrı derstir.",
        ],
    ),
    "marmara": (
        "Kadıköy'de kat karşılığı AŞ ve organ çatışması",
        "Marmara pratik hattı; TTK şirketler lafzı bağlar",
        [
            "Marmara kâğıdında genel kurul ile yönetim kurulunu ayırın.",
            "Limited tek ortaklılığı kollektifle karıştırmayın.",
            "MEOBS bağlayıcıdır.",
        ],
        [
            "Marmara pratik çalışmayı teorinin yanına koyar.",
            "HUK201 borçlar genel ayrı derstir.",
        ],
    ),
    "dokuz-eylul": (
        "Alsancak'ta bir kollektif şirket ve sınırsız sorumluluk",
        "Ege/İzmir dogmatiği; TTK şirketler lafzı bağlar",
        [
            "DEÜ kâğıdında önce şirket türünü yazın.",
            "Komandite ile komanditeri karıştırmayın.",
            "OBS bağlayıcıdır.",
        ],
        [
            "DEÜ şirketler dönemlik Bologna hattındadır.",
            "Ticari işletme ayrı derstir.",
        ],
    ),
    "hacettepe": (
        "Beytepe'de öğrenci limitedi ve müdür",
        "Ankara hattı; TTK şirketler lafzı Bologna çıktısıyla okunur",
        [
            "Hacettepe kâğıdında türü ayırır, organı uygular, sorumluluk sonucunu yazar.",
            "Sona erme ile tasfiyeyi karıştırmayın.",
            "Ders bilgi formu bağlayıcıdır.",
        ],
        [
            "Hacettepe şirketlerde öğrenme çıktısı fiili kâğıtta görünür.",
            "Ticari işletme ayrı derstir.",
        ],
    ),
    "galatasaray": (
        "Ortaköy'de SA ve AŞ karşılaştırması",
        "Fransız şirketler hukuku; kâğıtta Türkçe TTK lafzı bağlar",
        [
            "GSÜ kâğıdında mehaz karşılaştırması TTK lafzını aydınlatır.",
            "Şirket türü kapısı ilk cümlede durur.",
            "Yönetmelik bağlayıcıdır.",
        ],
        [
            "GSÜ şirketlerde Fransızca terim süs, TTK Türkçe bağlar.",
            "HUK222 borçlar genel ayrı derstir.",
        ],
    ),
    "bilkent": (
        "Bilkent yurdunda corporation ve AŞ tartışması",
        "Karşılaştırmalı company; kâğıtta TTK lafzı bağlar",
        [
            "Bilkent kâğıdında corporation cümlesi TTK anonim şirketinin yerine geçmez.",
            "Board / AGM organ yetkisini silmez.",
            "Künye yoksa E./K. yazılmaz.",
        ],
        [
            "Bilkent şirketlerde issue spotting unsur listesinin yerine geçmez.",
            "TTK lafzı Türkçe kâğıtta yazılır.",
        ],
    ),
    "koc": (
        "Rumelifeneri'nde limited hypo'su",
        "Karşılaştırmalı LLC; bağlayıcı metin TTK'dır",
        [
            "Koç kâğıdında İngilizce terim TTK maddesinin yerine geçmez.",
            "Policy cümlesi unsur ve lafızdan sonra gelir.",
            "Şirket türü kapısı ilk cümlede durur.",
        ],
        [
            "Koç şirketlerde hypo künye uydurmayı serbest bırakmaz.",
            "TTK resmi lafzı FSEK m. 31 ile serbesttir.",
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
                "format": "Klasik yazılı: TTK maddesi + şirket türü + olaya yedirme.",
                "tips": tips,
            },
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        data.setdefault("byCourse", {})["ticaret-sirketler"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
