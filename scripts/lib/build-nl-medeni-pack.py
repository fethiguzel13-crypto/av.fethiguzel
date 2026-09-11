#!/usr/bin/env python3
"""Build NotebookLM source pack for AÜHF medeni-baslangic. FSEK: official text only."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "ders-notlari" / "notebooklm" / "auhf-medeni-baslangic"
TMK = ROOT / "content" / "mevzuat" / "tmk"


def official_of(n: int) -> str | None:
    p = TMK / f"madde-{n}.md"
    if not p.exists():
        return None
    raw = p.read_text(encoding="utf-8")
    body = re.sub(r"^---[\s\S]*?---\n", "", raw)
    official = re.split(
        r"\n### (?:Akademik Yorum ve Analiz|Bizim Yorumumuz)\s*\n", body
    )[0]
    return re.sub(r"\n---\s*$", "", official).strip()


def write_lafiz() -> None:
    parts = [
        "# TMK Başlangıç Hükümleri — resmi lafız (FSEK m. 31)\n",
        "Şerh metni yoktur. Yalnız Resmi Gazete lafzı.\n",
    ]
    for n in range(1, 28):
        text = official_of(n)
        if not text:
            continue
        parts.append(f"\n## Madde {n}\n\n{text}\n")
    (OUT / "tmk-1-27-lafiz.md").write_text("\n".join(parts), encoding="utf-8")


def write_graf() -> None:
    g = json.loads(
        (ROOT / "lib" / "ders-notlari" / "graphs" / "medeni-baslangic.json").read_text(
            encoding="utf-8"
        )
    )
    lines = [
        f"# Graf: {g['title']}",
        "",
        f"Ders kodu: {g['courseCode']}",
        f"Güz kurumları: {', '.join(g['guzInstitutionIds'])}",
        f"Bahar kurumları: {', '.join(g['baharInstitutionIds'])}",
        "",
    ]
    for inst in g["institutions"]:
        refs = ", ".join(
            f"{r['kanunId'].upper()} m.{r['maddeNo']}"
            for r in inst.get("statuteRefs") or []
        )
        lines += [
            f"## {inst['title']} ({inst['id']})",
            f"Tanım: {inst['definition']}",
            f"Unsurlar: {'; '.join(inst['elements'])}",
            f"Organik bağ: {' / '.join(inst.get('organicLinks') or [])}",
            f"Madde: {refs}",
            f"Ekol notu: {' / '.join(inst.get('doctrineSplit') or [])}",
            "",
        ]
    (OUT / "graf.md").write_text("\n".join(lines), encoding="utf-8")


def write_harita() -> None:
    (OUT / "auhf-harita.md").write_text(
        """# AÜHF Medeni Hukuka Giriş — kamuya açık konu haritası

Slug: ankara. Kampüs: Cebeci. Dil: TR.

Bu dosya hoca slaytı değildir. Yalnız açık ders başlık omurgası ve fakülte sınav kültürü.

## HKZ-104 haftalık başlıklar (slayt metni yok)

1. Hukuk kavramı ve dalları, medeni hukuk sistemleri, kanunlaştırma
2. Yürürlük kaynakları, uygulanma, yorum
3. Kanun hükmü, hâkimin takdir yetkisi
4. Kanun boşluğu
5. Hak kavramı, türleri
6. Hukuki işlemler — tür, unsur, hükümsüzlük
7. Kazanma/kaybetme, iyiniyet
8. Dürüstlük kuralı
9. Korunma, ispat
10-14. Kişilik, ehliyet, ad, hısımlık, yerleşim

## Sınav kültürü

- Klasik uzun yazılı; madde + unsur + olaya yedirme
- Cebeci geleneği: dogmatik, şerh ve Yargıtay satırı beklenir
- Tuzaklar: boşluk ile takdir karışması; hak ehliyeti ile fiil ehliyeti; dürüstlük ile iyiniyet; yerleşim ile adres

## Kaynaklar

- https://acikders.ankara.edu.tr/course/view.php?id=5044
- https://acikders.ankara.edu.tr/course/view.php?id=1613
- https://www.law.ankara.edu.tr/ders-icerikleri/

## Üretim kuralı

Quiz ve kart, TMK lafzı ve kurum unsurlarını ölçer. Slayt cümlesi üretilmez. Künye uydurulmaz.
""",
        encoding="utf-8",
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    write_lafiz()
    write_graf()
    write_harita()
    for p in sorted(OUT.iterdir()):
        print(f"{p.name}\t{p.stat().st_size}")


if __name__ == "__main__":
    main()
