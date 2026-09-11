#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "HUK201", "HUKK2074", "borclar", "borçlar", "Borçlar")
ORDER = ["yasal mirasçılık", "saklı pay", "ölüme bağlı tasarruf", "miras sözleşmesi", "iptal", "tenkis", "ret", "tereke paylaşma"]


def srcs(data):
    out = []
    for s in data.get("sources") or []:
        blob = f"{s.get('title') or ''} {s.get('url') or ''} {s.get('note') or ''}"
        if any(n.lower() in blob.lower() for n in NEEDLES):
            continue
        out.append(s)
    return out


PATCHES = {
    "ankara": ("Cebeci'de bir vasiyetname ve saklı pay tartışması", "Cebeci şerh geleneği; TMK miras lafzı bağlar",
               ["Kâğıdın ilk cümlesinde yasal mirasçı mı atanmış mirasçı mı olduğunu yazın.", "Tenkis ile iptali, ret ile feragati karıştırmayın.", "OBS bağlayıcıdır."],
               ["AÜHF Cebeci geleneği zümreyi önce yazar.", "Aile ve borçlar ayrı derslerdir."]),
    "ankara-yildirim-beyazit": ("Esenboğa'da resmi vasiyet ve zümre hesabı", "Ankara dogmatiği; TMK miras lafzı bağlar",
               ["AYBÜ kâğıdında zümre kapısı ilk cümlede durur.", "Saklı pay ile yasal payı ayırın.", "OBS bağlayıcıdır."],
               ["AYBÜ dönemlik okur; miras TMK lafzına bağlanır.", "Borçlar genel ayrı derstir."]),
    "istanbul": ("Beyazıt'ta tenkis ve mirasın reddi", "İstanbul ekolü; TMK miras lafzı bağlar",
               ["Beyazıt kâğıdında ilk cümle zümreyi veya tasarrufu söyler.", "El yazısı vasiyet ile resmi vasiyeti karıştırmayın.", "EBS bağlayıcıdır."],
               ["İÜHF miras amfi + pratik; kâğıtta TMK lafzı önce gelir.", "HUKK2074 borçlar genel ayrı derstir."]),
    "marmara": ("Kadıköy'de tereke paylaşması ve elbirliği", "Marmara pratik hattı; TMK miras lafzı bağlar",
               ["Marmara kâğıdında tereke ile kişisel malı ayırın.", "Ret süresini tenkis süresine karıştırmayın.", "MEOBS bağlayıcıdır."],
               ["Marmara pratik çalışmayı teorinin yanına koyar.", "HUK201 borçlar genel ayrı derstir."]),
    "dokuz-eylul": ("Alsancak'ta miras sözleşmesi ve iptal", "Ege/İzmir dogmatiği; TMK miras lafzı bağlar",
               ["DEÜ kâğıdında önce zümreyi yazın.", "Miras sözleşmesi ile vasiyeti karıştırmayın.", "OBS bağlayıcıdır."],
               ["DEÜ miras dönemlik Bologna hattındadır.", "Borçlar genel ayrı derstir."]),
    "hacettepe": ("Beytepe'de saklı pay ve tenkis", "Ankara hattı; TMK miras lafzı Bologna çıktısıyla okunur",
               ["Hacettepe kâğıdında zümreyi ayırır, saklı payı uygular, tenkis sonucunu yazar.", "İptal ile tenkisi karıştırmayın.", "Ders bilgi formu bağlayıcıdır."],
               ["Hacettepe mirasta öğrenme çıktısı fiili kâğıtta görünür.", "Borçlar genel ayrı derstir."]),
    "galatasaray": ("Ortaköy'de vasiyet ve Code civil karşılaştırması", "Fransız Code civil; kâğıtta Türkçe TMK lafzı bağlar",
               ["GSÜ kâğıdında mehaz karşılaştırması TMK lafzını aydınlatır.", "Zümre kapısı ilk cümlede durur.", "Yönetmelik bağlayıcıdır."],
               ["GSÜ mirasta Fransızca terim süs, TMK Türkçe bağlar.", "HUK222 borçlar genel ayrı derstir."]),
    "bilkent": ("Bilkent'te will / forced share tartışması", "Karşılaştırmalı succession; kâğıtta TMK lafzı bağlar",
               ["Bilkent kâğıdında forced heirship cümlesi TMK saklı payının yerine geçmez.", "Probate tereke paylaşmasını silmez.", "Künye yoksa E./K. yazılmaz."],
               ["Bilkent mirasta issue spotting unsur listesinin yerine geçmez.", "TMK lafzı Türkçe kâğıtta yazılır."]),
    "koc": ("Rumelifeneri'nde tenkis hypo'su", "Karşılaştırmalı succession; bağlayıcı metin TMK'dır",
               ["Koç kâğıdında İngilizce terim TMK maddesinin yerine geçmez.", "Policy cümlesi unsur ve lafızdan sonra gelir.", "Zümre kapısı ilk cümlede durur."],
               ["Koç mirasta hypo künye uydurmayı serbest bırakmaz.", "TMK resmi lafzı FSEK m. 31 ile serbesttir."]),
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
                "format": "Klasik yazılı: TMK maddesi + miras kurumu + olaya yedirme.",
                "tips": tips,
            },
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        data.setdefault("byCourse", {})["miras-hukuku"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
