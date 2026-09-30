#!/usr/bin/env python3
from __future__ import annotations
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2] / "lib" / "ders-notlari" / "overlays"
NEEDLES = ("HKZ201", "HUK201", "HUKK2074", "borcun kaynağını", "hâkim durum", "arabulucu", "iş güvencesi")
ORDER = ["gemi", "donatan", "kaptan", "navlun", "konişmento", "müşterek avarya", "gemi alacağı", "gemi ipoteği"]
CAL = {"ankara": "karma", "istanbul": "yillik"}
PATCHES = {
    "ankara": ("Cebeci'de bir konişmento ve navlun sözleşmesi", "Cebeci şerh geleneği; TTK beşinci kitap lafzı bağlar", ["Kâğıdın ilk cümlesinde donatan mı taşıyan mı olduğunu yazın.", "Gemi alacağını sorumluluğun sınırlanması sanmayın.", "OBS bağlayıcıdır."], ["AÜHF Cebeci geleneği geminin tanımını önce yazar.", "Kıymetli evrak ayrı derstir; bu kâğıtta TTK deniz ticareti konuşur."]),
    "ankara-yildirim-beyazit": ("Esenboğa yolunda bir kırkambar ve çarter", "Ankara dogmatiği; TTK m.1138 lafzı bağlar", ["AYBÜ kâğıdında navlun türü ilk cümlede durur.", "Kusursuz çatmayı kusurlu çatma sanmayın.", "OBS bağlayıcıdır."], ["AYBÜ dönemlik okur; deniz ticareti TTK lafzına bağlanır.", "Borçlar genel ayrı derstir."]),
    "istanbul": ("Beyazıt'ta bir gemi ipoteği ve gemi alacağı", "İstanbul ekolü; TTK m.1014 ve m.1320 lafzı bağlar", ["Beyazıt kâğıdında ilk cümle rehin türünü söyler.", "Sicile kayıtlı gemide adi rehni ipotek sanmayın.", "EBS bağlayıcıdır."], ["İÜHF deniz ticareti amfi + pratik; kâğıtta TTK lafzı önce gelir.", "HUKK2074 ayrı derstir."]),
    "marmara": ("Kadıköy'de bir müşterek avarya ve çatma", "Marmara pratik hattı; TTK m.1272 ve m.1288 lafzı bağlar", ["Marmara kâğıdında müşterek avaryayı çatmadan ayırın.", "Konişmentoyu taşıtan ile hamil arasında aynı rejim sanmayın.", "MEOBS bağlayıcıdır."], ["Marmara pratik çalışmayı teorinin yanına koyar.", "HUK201 ayrı derstir."]),
    "dokuz-eylul": ("Alsancak'ta bir denize elverişsiz gemi", "Ege/İzmir dogmatiği; TTK m.932 ve m.1141 lafzı bağlar", ["DEÜ kâğıdında önce gemiyi tanımlayın.", "Kaptanın donatan emriyle kurtulduğunu sanmayın.", "OBS bağlayıcıdır."], ["DEÜ deniz ticareti dönemlik Bologna hattındadır.", "Borçlar genel ayrı derstir."]),
    "hacettepe": ("Beytepe'de bir donatan ve gemi adamı kusuru", "Ankara hattı; TTK m.1061 ve m.1062 lafzı okunur", ["Hacettepe kâğıdında maliki ayırır, kusuru bağlar, sınırı ayırır.", "Başkasının gemisini işleteni üçüncü kişiye karşı malik sanmayın.", "Ders bilgi formu bağlayıcıdır."], ["Hacettepe deniz ticaretinde öğrenme çıktısı kâğıtta görünür.", "Borçlar genel ayrı derstir."]),
    "galatasaray": ("Ortaköy'de armateur ve connaissement karşılaştırması", "Fransız deniz ticareti; kâğıtta Türkçe TTK lafzı bağlar", ["GSÜ kâğıdında mehaz karşılaştırması m.1061'i aydınlatır.", "Deniz kapısı ilk cümlede durur.", "Yönetmelik bağlayıcıdır."], ["GSÜ deniz ticaretinde Fransızca terim süs, TTK Türkçe bağlar.", "HUK222 ayrı derstir."]),
    "bilkent": ("Bilkent yurdunda bill of lading versus charterparty tartışması", "Karşılaştırmalı maritime; kâğıtta TTK lafzı bağlar", ["Bilkent kâğıdında bill of lading cümlesi m.1237'nin yerine geçmez.", "Limitation, gemi alacaklısı rehnini silmez.", "Künye yoksa E./K. yazılmaz."], ["Bilkent deniz ticaretinde issue spotting unsur listesinin yerine geçmez.", "TTK lafzı Türkçe yazılır."]),
    "koc": ("Rumelifeneri'nde çarter hypo'su", "Karşılaştırmalı carriage; bağlayıcı metin TTK m.1138'dir", ["Koç kâğıdında İngilizce terim yolculuk çarterinin yerine geçmez.", "Policy cümlesi lafızdan sonra gelir.", "Deniz kapısı ilk cümlede durur."], ["Koç deniz ticaretinde hypo künye uydurmayı serbest bırakmaz.", "Kanun lafzı FSEK m. 31 ile serbesttir."]),
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
        data.setdefault("byCourse", {})["deniz-ticareti"] = {
            "cityHook": hook, "mehaz": mehaz,
            "examBox": {"calendar": CAL.get(slug, "donemlik"), "typicalWeights": "Ara sınav + final; oran OBS/dönem ilanı esas.", "format": "Klasik yazılı: TTK maddesi + deniz kurumu + olaya yedirme.", "tips": tips},
            "syllabusOrder": ORDER, "schoolNotes": notes, "sources": srcs(data),
        }
        p.write_text(json.dumps(data, ensure_ascii=False, indent=4) + "\n", encoding="utf-8")
        print("patched", slug)

if __name__ == "__main__":
    main()
