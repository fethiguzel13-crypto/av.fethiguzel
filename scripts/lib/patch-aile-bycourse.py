#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "HUK201", "HUKK2074", "borclar", "borçlar", "Borçlar")
ORDER = ["nişan", "evlenme", "butlan", "boşanma", "mal rejimi", "velayet", "nafaka"]


def srcs(data):
    out = []
    for s in data.get("sources") or []:
        blob = f"{s.get('title') or ''} {s.get('url') or ''} {s.get('note') or ''}"
        if any(n.lower() in blob.lower() for n in NEEDLES):
            continue
        out.append(s)
    return out


PATCHES = {
    "ankara": ("Cebeci'de bir boşanma ve velayet tartışması", "Cebeci şerh geleneği; TMK aile lafzı bağlar",
               ["Kâğıdın ilk cümlesinde evlilik bağı mı mal rejimi mi olduğunu yazın.", "Mutlak butlan ile nispi butlanı, yoksulluk nafakası ile tedbir nafakasını karıştırmayın.", "OBS bağlayıcıdır."],
               ["AÜHF Cebeci geleneği evlilik bağını önce yazar.", "Usul ve borçlar ayrı derslerdir."]),
    "ankara-yildirim-beyazit": ("Esenboğa'da bir nişan bozma ve hediye iadesi", "Ankara dogmatiği; TMK aile lafzı bağlar",
               ["AYBÜ kâğıdında aile kapısı ilk cümlede durur.", "Edinilmiş mallara katılma ile mal ayrılığını ayırın.", "OBS bağlayıcıdır."],
               ["AYBÜ dönemlik okur; aile TMK lafzına bağlanır.", "Borçlar genel ayrı derstir."]),
    "istanbul": ("Beyazıt'ta bir boşanma ve yoksulluk nafakası", "İstanbul ekolü; TMK aile lafzı bağlar",
               ["Beyazıt kâğıdında ilk cümle evlilik bağını veya mal rejimini söyler.", "TMK m.166/1 ile m.166/3'ü karıştırmayın.", "EBS bağlayıcıdır."],
               ["İÜHF aile amfi + pratik; kâğıtta TMK lafzı önce gelir.", "HUKK2074 borçlar genel ayrı derstir."]),
    "marmara": ("Kadıköy'de katılma alacağı ve ev eşyası", "Marmara pratik hattı; TMK aile lafzı bağlar",
               ["Marmara kâğıdında edinilmiş mal ile kişisel malı ayırın.", "Velayet ile nafakayı aynı torbaya koymayın.", "MEOBS bağlayıcıdır."],
               ["Marmara pratik çalışmayı teorinin yanına koyar.", "HUK201 borçlar genel ayrı derstir."]),
    "dokuz-eylul": ("Alsancak'ta bir evlenme ehliyeti ve butlan", "Ege/İzmir dogmatiği; TMK aile lafzı bağlar",
               ["DEÜ kâğıdında önce evlilik bağını yazın.", "Mutlak butlan ile boşanmayı karıştırmayın.", "OBS bağlayıcıdır."],
               ["DEÜ aile dönemlik Bologna hattındadır.", "Borçlar genel ayrı derstir."]),
    "hacettepe": ("Beytepe'de öğrenci evliliği ve mal rejimi", "Ankara hattı; TMK aile lafzı Bologna çıktısıyla okunur",
               ["Hacettepe kâğıdında evlilik bağını ayırır, mal rejimini uygular, nafaka sonucunu yazar.", "Tedbir nafakası ile yoksulluk nafakasını karıştırmayın.", "Ders bilgi formu bağlayıcıdır."],
               ["Hacettepe ailede öğrenme çıktısı fiili kâğıtta görünür.", "Borçlar genel ayrı derstir."]),
    "galatasaray": ("Ortaköy'de boşanma ve Code civil karşılaştırması", "Fransız Code civil; kâğıtta Türkçe TMK lafzı bağlar",
               ["GSÜ kâğıdında mehaz karşılaştırması TMK lafzını aydınlatır.", "Evlilik bağı kapısı ilk cümlede durur.", "Yönetmelik bağlayıcıdır."],
               ["GSÜ ailede Fransızca terim süs, TMK Türkçe bağlar.", "HUK222 borçlar genel ayrı derstir."]),
    "bilkent": ("Bilkent yurdunda nişan ve custody tartışması", "Karşılaştırmalı family law; kâğıtta TMK lafzı bağlar",
               ["Bilkent kâğıdında custody cümlesi TMK velayetinin yerine geçmez.", "Community property edinilmiş mallara katılmayı silmez.", "Künye yoksa E./K. yazılmaz."],
               ["Bilkent ailede issue spotting unsur listesinin yerine geçmez.", "TMK lafzı Türkçe kâğıtta yazılır."]),
    "koc": ("Rumelifeneri'nde boşanma hypo'su", "Karşılaştırmalı family law; bağlayıcı metin TMK'dır",
               ["Koç kâğıdında İngilizce terim TMK maddesinin yerine geçmez.", "Policy cümlesi unsur ve lafızdan sonra gelir.", "Evlilik bağı kapısı ilk cümlede durur."],
               ["Koç ailede hypo künye uydurmayı serbest bırakmaz.", "TMK resmi lafzı FSEK m. 31 ile serbesttir."]),
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
                "format": "Klasik yazılı: TMK maddesi + aile kurumu + olaya yedirme.",
                "tips": tips,
            },
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        data.setdefault("byCourse", {})["aile-hukuku"] = patch
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
