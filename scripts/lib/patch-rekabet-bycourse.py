#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "HUK201", "HUKK2074", "borcun kaynağını", "vergiyi doğuran", "iş güvencesi", "yüklenici")
ORDER = ["teşebbüs", "anlaşma", "hâkim durum", "birleşme", "muafiyet", "soruşturma", "kurul", "idari para cezası"]
CAL = {"ankara": "karma", "istanbul": "yillik"}
PATCHES = {
    "ankara": ("Cebeci'de bir fiyat anlaşması ve muafiyet", "Cebeci şerh geleneği; 4054 lafzı bağlar", ["Kâğıdın ilk cümlesinde anlaşma mı hâkim durumun kötüye kullanılması mı yazın.", "Hâkim durumu kendiliğinden yasak sanmayın.", "OBS bağlayıcıdır."], ["AÜHF Cebeci geleneği ilgili pazarı önce yazar.", "Borçlar genel ayrı derstir."]),
    "ankara-yildirim-beyazit": ("Esenboğa yolunda bir bildirilmemiş devralma", "Ankara dogmatiği; 4054 m.7 ve m.11 lafzı bağlar", ["AYBÜ kâğıdında birleşme ile anlaşmayı ayırın.", "Muafiyetin dört şartını eksik saymayın.", "OBS bağlayıcıdır."], ["AYBÜ dönemlik okur; rekabet 4054 lafzına bağlanır.", "Borçlar genel ayrı derstir."]),
    "istanbul": ("Beyazıt'ta bir yerinde inceleme", "İstanbul ekolü; 4054 m.15 lafzı bağlar", ["Beyazıt kâğıdında ilk cümle ihlal türünü söyler.", "Yerinde incelemeyi arama sanmayın.", "EBS bağlayıcıdır."], ["İÜHF rekabet hukuku amfi + pratik; kâğıtta 4054 lafzı önce gelir.", "HUKK2074 ayrı derstir."]),
    "marmara": ("Kadıköy'de eşit durumdaki alıcılara farklı şart", "Marmara pratik hattı; 4054 m.6 lafzı bağlar", ["Marmara kâğıdında ayırımcılığı anlaşma yasağından ayırın.", "İzin eşiğini kendiniz uydurmayın; tebliğ bağlar.", "MEOBS bağlayıcıdır."], ["Marmara pratik çalışmayı teorinin yanına koyar.", "HUK201 ayrı derstir."]),
    "dokuz-eylul": ("Alsancak'ta bir pazar paylaşımı", "Ege/İzmir dogmatiği; 4054 m.4 lafzı bağlar", ["DEÜ kâğıdında önce teşebbüsü yazın.", "Uyumlu eylemi tek taraflı fiil sanmayın.", "OBS bağlayıcıdır."], ["DEÜ rekabet hukuku dönemlik Bologna hattındadır.", "Borçlar genel ayrı derstir."]),
    "hacettepe": ("Beytepe'de bir muafiyet şartı eksikliği", "Ankara hattı; 4054 m.5 lafzı okunur", ["Hacettepe kâğıdında pazarı ayırır, ihlali yazar, muafiyeti dört şartla kapatır.", "Hâkim durumun kötüye kullanılmasını m.5 ile muaf tutmayın.", "Ders bilgi formu bağlayıcıdır."], ["Hacettepe rekabet hukukunda öğrenme çıktısı kâğıtta görünür.", "Borçlar genel ayrı derstir."]),
    "galatasaray": ("Ortaköy'de entente ve abus de position dominante karşılaştırması", "Fransız rekabet hukuku; kâğıtta Türkçe 4054 lafzı bağlar", ["GSÜ kâğıdında mehaz karşılaştırması m.4 ile m.6'yı ayırır.", "Rekabet kapısı ilk cümlede durur.", "Yönetmelik bağlayıcıdır."], ["GSÜ rekabet hukukunda Fransızca terim süs, 4054 Türkçe bağlar.", "HUK222 ayrı derstir."]),
    "bilkent": ("Bilkent yurdunda cartel versus dominance tartışması", "Karşılaştırmalı antitrust; kâğıtta 4054 lafzı bağlar", ["Bilkent kâğıdında cartel cümlesi m.4'ün yerine geçmez.", "Dominance kendiliğinden ihlal değildir.", "Künye yoksa E./K. yazılmaz."], ["Bilkent rekabet hukukunda issue spotting unsur listesinin yerine geçmez.", "4054 lafzı Türkçe yazılır."]),
    "koc": ("Rumelifeneri'nde birleşme eşiği hypo'su", "Karşılaştırmalı merger; bağlayıcı metin 4054 m.7'dir", ["Koç kâğıdında İngilizce terim tebliğ eşiğinin yerine geçmez.", "Policy cümlesi lafızdan sonra gelir.", "Rekabet kapısı ilk cümlede durur."], ["Koç rekabet hukukunda hypo künye uydurmayı serbest bırakmaz.", "Kanun lafzı FSEK m. 31 ile serbesttir."]),
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
        data.setdefault("byCourse", {})["rekabet-hukuku"] = {
            "cityHook": hook,
            "mehaz": mehaz,
            "examBox": {"calendar": CAL.get(slug, "donemlik"), "typicalWeights": "Ara sınav + final; oran OBS/dönem ilanı esas.", "format": "Klasik yazılı: 4054 maddesi + ihlal türü + olaya yedirme.", "tips": tips},
            "syllabusOrder": ORDER,
            "schoolNotes": notes,
            "sources": srcs(data),
        }
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)


if __name__ == "__main__":
    main()
