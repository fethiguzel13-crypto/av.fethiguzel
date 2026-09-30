#!/usr/bin/env python3
from __future__ import annotations
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "HUK201", "HUKK2074", "borcun kaynağını", "hâkim durum", "yüklenici", "iş güvencesi")
ORDER = ["iradi olma", "gizlilik", "arabulucu", "ücret", "ilk toplantı", "süreç", "anlaşma", "dava şartı"]
CAL = {"ankara": "karma", "istanbul": "yillik"}
PATCHES = {
    "ankara": ("Cebeci'de bir son tutanak ve usulden ret", "Cebeci şerh geleneği; 6325 lafzı bağlar", ["Kâğıdın ilk cümlesinde iradi arabuluculuk mu dava şartı mı yazın.", "Aile içi şiddeti elverişli sanmayın.", "OBS bağlayıcıdır."], ["AÜHF Cebeci geleneği kapsamı önce yazar.", "HMK ayrı derstir; bu kâğıtta 6325 konuşur."]),
    "ankara-yildirim-beyazit": ("Esenboğa yolunda bir ilk toplantı tutanağı", "Ankara dogmatiği; 6325 m.16 lafzı bağlar", ["AYBÜ kâğıdında sürecin başlangıcını yazın.", "Zamanaşımının işlemeye devam ettiğini sanmayın.", "OBS bağlayıcıdır."], ["AYBÜ dönemlik okur; arabuluculuk 6325 lafzına bağlanır.", "Borçlar genel ayrı derstir."]),
    "istanbul": ("Beyazıt'ta bir icra edilebilirlik şerhi", "İstanbul ekolü; 6325 m.18 lafzı bağlar", ["Beyazıt kâğıdında ilk cümle şerhin hangi mahkemeden istendiğini söyler.", "Arabulucuyu hâkim sanmayın.", "EBS bağlayıcıdır."], ["İÜHF arabuluculuk amfi + pratik; kâğıtta 6325 lafzı önce gelir.", "HUKK2074 ayrı derstir."]),
    "marmara": ("Kadıköy'de bir gizlilik ve delil yasağı", "Marmara pratik hattı; 6325 m.4 ve m.5 lafzı bağlar", ["Marmara kâğıdında gizlilik ile beyan yasağını ayırın.", "Dava şartını 6325'in kendisinin saydığını sanmayın.", "MEOBS bağlayıcıdır."], ["Marmara pratik çalışmayı teorinin yanına koyar.", "HUK201 ayrı derstir."]),
    "dokuz-eylul": ("Alsancak'ta bir çekilme bildirimi", "Ege/İzmir dogmatiği; 6325 m.17 lafzı bağlar", ["DEÜ kâğıdında önce elverişliliği yazın.", "Çekilmenin süreci sürdürdüğünü sanmayın.", "OBS bağlayıcıdır."], ["DEÜ arabuluculuk dönemlik Bologna hattındadır.", "Borçlar genel ayrı derstir."]),
    "hacettepe": ("Beytepe'de bir haftalık kesin süre", "Ankara hattı; 6325 m.18/A lafzı okunur", ["Hacettepe kâğıdında kapsamı ayırır, tutanağı ekler, süreyi yazar.", "Bir haftalık kesin süreyi esnek sanmayın.", "Ders bilgi formu bağlayıcıdır."], ["Hacettepe arabuluculukta öğrenme çıktısı kâğıtta görünür.", "Borçlar genel ayrı derstir."]),
    "galatasaray": ("Ortaköy'de médiation ve iradi olma karşılaştırması", "Fransız arabuluculuk; kâğıtta Türkçe 6325 lafzı bağlar", ["GSÜ kâğıdında mehaz karşılaştırması m.3'ü aydınlatır.", "Arabuluculuk kapısı ilk cümlede durur.", "Yönetmelik bağlayıcıdır."], ["GSÜ arabuluculukta Fransızca terim süs, 6325 Türkçe bağlar.", "HUK222 ayrı derstir."]),
    "bilkent": ("Bilkent yurdunda mandatory mediation tartışması", "Karşılaştırmalı mediation; kâğıtta 6325 lafzı bağlar", ["Bilkent kâğıdında mandatory cümlesi m.18/A'nın yerine geçmez.", "Confidentiality, m.5 delil yasağını silmez.", "Künye yoksa E./K. yazılmaz."], ["Bilkent arabuluculukta issue spotting unsur listesinin yerine geçmez.", "6325 lafzı Türkçe yazılır."]),
    "koc": ("Rumelifeneri'nde icra şerhi hypo'su", "Karşılaştırmalı mediation; bağlayıcı metin 6325 m.18'dir", ["Koç kâğıdında İngilizce terim sulh hukuk mahkemesinin yerine geçmez.", "Policy cümlesi lafızdan sonra gelir.", "Arabuluculuk kapısı ilk cümlede durur."], ["Koç arabuluculukta hypo künye uydurmayı serbest bırakmaz.", "Kanun lafzı FSEK m. 31 ile serbesttir."]),
}

def srcs(data):
    out = []
    for s in data.get("sources") or []:
        blob = f"{s.get('title') or ''} {s.get('url') or ''} {s.get('note') or ''}"
        if any(n.lower() in blob.lower() for n in NEEDLES):
            continue
        out.append(s)
    return out

def main() -> None:
    for slug, (hook, mehaz, tips, notes) in PATCHES.items():
        p = ROOT / f"{slug}.json"
        data = json.loads(p.read_text(encoding="utf-8"))
        data.setdefault("byCourse", {})["arabuluculuk"] = {
            "cityHook": hook, "mehaz": mehaz,
            "examBox": {"calendar": CAL.get(slug, "donemlik"), "typicalWeights": "Ara sınav + final; oran OBS/dönem ilanı esas.", "format": "Klasik yazılı: 6325 maddesi + süreç + olaya yedirme.", "tips": tips},
            "syllabusOrder": ORDER, "schoolNotes": notes, "sources": srcs(data),
        }
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)

if __name__ == "__main__":
    main()
