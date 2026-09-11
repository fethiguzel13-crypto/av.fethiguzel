#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "HUK201", "HUKK2074", "borclar", "borçlar", "Borçlar")
ORDER = ["zilyetlik", "tapu", "mülkiyet", "paylı mülkiyet", "irtifak", "ipotek", "taşınır rehni", "kat mülkiyeti"]

def srcs(data):
    out = []
    for s in data.get("sources") or []:
        blob = f"{s.get('title') or ''} {s.get('url') or ''} {s.get('note') or ''}"
        if any(n.lower() in blob.lower() for n in NEEDLES):
            continue
        out.append(s)
    return out

PATCHES = {
    "ankara": ("Cebeci'de bir tapu iptali ve zilyetlik koruması", "Cebeci şerh geleneği; TMK eşya lafzı bağlar",
               ["Kâğıdın ilk cümlesinde zilyetlik mi mülkiyet mi olduğunu yazın.", "Sicile güven ile yolsuz tescili, paylı mülkiyet ile elbirliğini karıştırmayın.", "OBS bağlayıcıdır."],
               ["AÜHF Cebeci geleneği zilyetlik-mülkiyet kapısını önce yazar.", "Usul ve borçlar ayrı derslerdir."]),
    "ankara-yildirim-beyazit": ("Esenboğa yolunda bir araç teslimi ve iyi niyetle iktisap", "Ankara dogmatiği; TMK eşya lafzı bağlar",
               ["AYBÜ kâğıdında zilyetlik-mülkiyet kapısı ilk cümlede durur.", "Menkul iktisabı ile tapu siciline güveni ayırın.", "OBS bağlayıcıdır."],
               ["AYBÜ dönemlik okur; eşya TMK lafzına bağlanır.", "Borçlar genel ayrı derstir."]),
    "istanbul": ("Beyazıt'ta bir dükkân tapusu ve sicile güven", "İstanbul ekolü; TMK eşya lafzı bağlar",
               ["Beyazıt kâğıdında ilk cümle zilyetlik veya mülkiyeti söyler.", "Tescil ile tapu kaydının düzeltilmesini karıştırmayın.", "EBS bağlayıcıdır."],
               ["İÜHF eşya amfi + pratik; kâğıtta TMK lafzı önce gelir.", "HUKK2074 borçlar genel ayrı derstir."]),
    "marmara": ("Kadıköy'de kat karşılığı inşaat ve kat mülkiyeti", "Marmara pratik hattı; TMK ve KMK lafzı bağlar",
               ["Marmara kâğıdında kat mülkiyeti ile paylı mülkiyeti ayırın.", "İpotek belirliliğini yazın.", "MEOBS bağlayıcıdır."],
               ["Marmara pratik çalışmayı teorinin yanına koyar.", "HUK201 borçlar genel ayrı derstir."]),
    "dokuz-eylul": ("Alsancak'ta taşınır satımı ve zilyetlik devri", "Ege/İzmir dogmatiği; TMK eşya lafzı bağlar",
               ["DEÜ kâğıdında önce zilyetlik-mülkiyet kapısını yazın.", "Teslim ile tescili karıştırmayın.", "OBS bağlayıcıdır."],
               ["DEÜ eşya dönemlik Bologna hattındadır.", "Borçlar genel ayrı derstir."]),
    "hacettepe": ("Beytepe yurdunda depozito ve taşınır rehni", "Ankara hattı; TMK eşya lafzı Bologna çıktısıyla okunur",
               ["Hacettepe kâğıdında zilyetliği ayırır, tapuyu uygular, rehin sonucunu yazar.", "Elbirliği ile paylı mülkiyeti karıştırmayın.", "Ders bilgi formu bağlayıcıdır."],
               ["Hacettepe eşyada öğrenme çıktısı fiili kâğıtta görünür.", "Borçlar genel ayrı derstir."]),
    "galatasaray": ("Ortaköy'de kira ve Code civil zilyetlik karşılaştırması", "Fransız Code civil; kâğıtta Türkçe TMK lafzı bağlar",
               ["GSÜ kâğıdında mehaz karşılaştırması TMK lafzını aydınlatır.", "Zilyetlik-mülkiyet kapısı ilk cümlede durur.", "Yönetmelik bağlayıcıdır."],
               ["GSÜ eşyada Fransızca terim süs, TMK Türkçe bağlar.", "HUK222 borçlar genel ayrı derstir."]),
    "bilkent": ("Bilkent yurdunda GİK ve taşınır teslimi", "Karşılaştırmalı property; kâğıtta TMK lafzı bağlar",
               ["Bilkent kâğıdında possession cümlesi TMK zilyetliğinin yerine geçmez.", "Title / registry TMK tescil kuralını silmez.", "Künye yoksa E./K. yazılmaz."],
               ["Bilkent eşyada issue spotting unsur listesinin yerine geçmez.", "TMK lafzı Türkçe kâğıtta yazılır."]),
    "koc": ("Rumelifeneri'nde ipotek hypo'su", "Karşılaştırmalı property/security; bağlayıcı metin TMK'dır",
               ["Koç kâğıdında İngilizce terim TMK maddesinin yerine geçmez.", "Policy cümlesi unsur ve lafızdan sonra gelir.", "Zilyetlik-mülkiyet kapısı ilk cümlede durur."],
               ["Koç eşyada hypo künye uydurmayı serbest bırakmaz.", "TMK resmi lafzı FSEK m. 31 ile serbesttir."]),
}

CAL = {
    "ankara": "karma",
    "istanbul": "yillik",
}


def main() -> None:
    for slug, (hook, mehaz, tips, notes) in PATCHES.items():
        p = ROOT / f"{slug}.json"
        data = json.loads(p.read_text(encoding="utf-8"))
        cal = CAL.get(slug, "donemlik")
        patch = {
            "cityHook": hook,
            "mehaz": mehaz,
            "examBox": {
                "calendar": cal,
                "typicalWeights": "Ara sınav + final; oran OBS/dönem ilanı esas.",
                "format": "Klasik yazılı: TMK maddesi + ayni hak unsuru + olaya yedirme.",
                "tips": tips,
            },
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        data.setdefault("byCourse", {})["esya-hukuku"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
