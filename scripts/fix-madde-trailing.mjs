// Madde dosyalarının resmî metninin sonuna yapışmış "bir sonraki maddenin başlığı"
// (ve varsa önündeki BÖLÜM/KISIM başlığı) artığını temizler.
//
// Mantık: madde N'in resmî metninin SON satırı, sonraki maddenin (sıralı) bold
// başlığına eşitse, o satır (ve hemen üstündeki bölüm/kısım başlığı bloğu) silinir.
// Eşleşme yoksa dosyaya DOKUNULMAZ (güvenli).
//
// Kullanım:
//   node scripts/fix-madde-trailing.mjs            # dry-run (sadece rapor)
//   node scripts/fix-madde-trailing.mjs --apply    # değişiklikleri yaz

import fs from "fs";
import path from "path";

const APPLY = process.argv.includes("--apply");
const ROOT = path.join(process.cwd(), "content", "mevzuat");

const norm = (s) => s.replace(/\s+/g, " ").trim().toLocaleLowerCase("tr");
// Başlık eşleştirme için gevşek anahtar: sondaki iki nokta, nokta, dipnot rakamı ve (1) gibi ekleri at
const keyend = (s) => {
  let x = s.replace(/\s+/g, " ").trim();
  x = x.replace(/\s*\(\d+\)\s*$/, "");      // sondaki (1)
  x = x.replace(/[:：.;,\s]+$/, "");          // sondaki noktalama
  x = x.replace(/\d+$/, "");                  // sondaki dipnot rakamları
  x = x.replace(/[:：.;,\s]+$/, "");
  return x.toLocaleLowerCase("tr");
};
const BOLUM_RE = /\b(BÖLÜM|KISIM|KİTAP|AYIRIM|AYRIM|FASIL|BAP)\b/;

// Bir madde dosyasından bold başlığı çıkarır
function getBaslik(lines) {
  let dashCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/^---\s*$/.test(lines[i])) { dashCount++; continue; }
    if (dashCount >= 2) {
      const m = lines[i].match(/^\*\*(.+?)\*\*\s*$/);
      if (m) return m[1].trim();
    }
  }
  return null;
}

// Resmî metin bloğunun sınırlarını bulur: başlık sonrası ayraç (---) ile ilk ### arası
function bounds(lines) {
  let dashCount = 0, baslikIdx = -1, sepIdx = -1, yorumIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^---\s*$/.test(lines[i])) {
      dashCount++;
      if (dashCount >= 3 && sepIdx === -1 && baslikIdx !== -1) sepIdx = i;
      continue;
    }
    if (dashCount >= 2 && baslikIdx === -1 && /^\*\*(.+?)\*\*\s*$/.test(lines[i])) baslikIdx = i;
    if (sepIdx !== -1 && yorumIdx === -1 && /^#{2,4}\s/.test(lines[i])) { yorumIdx = i; break; }
  }
  return { sepIdx, yorumIdx };
}

let changed = 0, skipped = 0, scanned = 0;
const reasons = { nextBaslikYok: 0, sinirYok: 0, bosMetin: 0, eslesmedi: 0, kalanMadde: 0, bukukBlok: 0 };
const samples = [];
const eslesmediSamples = [];

for (const kanun of fs.readdirSync(ROOT)) {
  const dir = path.join(ROOT, kanun);
  if (!fs.statSync(dir).isDirectory()) continue;
  const files = fs.readdirSync(dir).filter((f) => /^madde-\d+\.md$/.test(f));
  // maddeNo'ya göre sırala
  files.sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  // Her dosyanın başlığını önceden oku
  const info = files.map((f) => {
    const lines = fs.readFileSync(path.join(dir, f), "utf8").split(/\r?\n/);
    return { f, lines, baslik: getBaslik(lines) };
  });

  for (let k = 0; k < info.length - 1; k++) {
    scanned++;
    const cur = info[k];
    const nextBaslik = info[k + 1].baslik;
    if (!nextBaslik) { skipped++; reasons.nextBaslikYok++; continue; }

    const { sepIdx, yorumIdx } = bounds(cur.lines);
    if (sepIdx === -1 || yorumIdx === -1) { skipped++; reasons.sinirYok++; continue; }

    // resmî metin satırları (sep ile yorum arası), sondaki boşları kırp
    let end = yorumIdx - 1;
    while (end > sepIdx && cur.lines[end].trim() === "") end--;
    let start = sepIdx + 1;
    while (start < end && cur.lines[start].trim() === "") start++;
    if (end <= start) { skipped++; reasons.bosMetin++; continue; }

    // son dolu satır sonraki başlıkla eşleşiyor mu? (gevşek anahtar)
    if (keyend(cur.lines[end]) !== keyend(nextBaslik) || keyend(nextBaslik) === "") {
      skipped++; reasons.eslesmedi++;
      if (eslesmediSamples.length < 15) eslesmediSamples.push(`${kanun}/${cur.f}: son="${cur.lines[end]}" | sonrakiBaşlık="${nextBaslik}"`);
      continue;
    }

    // kesim başlangıcı: varsa hemen üstteki BÖLÜM/KISIM başlık bloğu
    let cut = end;
    // en fazla 3 satır yukarı bak: bölüm başlığı (kısa) satırlarını da dahil et
    let probe = end - 1;
    let bolumIdx = -1;
    for (let up = 0; up < 3 && probe > start; up++, probe--) {
      if (BOLUM_RE.test(cur.lines[probe]) && cur.lines[probe].trim().length < 60) { bolumIdx = probe; break; }
    }
    if (bolumIdx !== -1) cut = bolumIdx;

    // güvenlik: kesimden sonra hâlâ gerçek içerik (MADDE) kalmalı
    const kalan = cur.lines.slice(start, cut).join(" ");
    if (!/madde/i.test(kalan)) { skipped++; reasons.kalanMadde++; continue; }
    if ((end - cut) > 5) { skipped++; reasons.bukukBlok++; continue; } // çok büyük blok → şüpheli, atla

    // kesim: cut..end satırlarını sil + öncesindeki olası boş satırları kırp
    const before = cur.lines.slice(0, cut);
    while (before.length && before[before.length - 1].trim() === "") before.pop();
    const after = cur.lines.slice(end + 1); // yorum bloğu vb.
    while (after.length && after[0].trim() === "") after.shift();
    const yeni = [...before, "", ...after];

    if (APPLY) fs.writeFileSync(path.join(dir, cur.f), yeni.join("\n"), "utf8");
    changed++;
    if (samples.length < 12) samples.push(`${kanun}/${cur.f}: sildi → "${cur.lines.slice(cut, end + 1).join(" / ")}"`);
  }
}

console.log(`Mod: ${APPLY ? "APPLY (yazıldı)" : "DRY-RUN (yazılmadı)"}`);
console.log(`Taranan: ${scanned} | Temizlenecek/temizlenen: ${changed} | Atlanan: ${skipped}`);
console.log("Atlama sebepleri:", JSON.stringify(reasons));
console.log("\nTemizlenecek örnekler:");
for (const s of samples) console.log(" - " + s);
console.log("\nEŞLEŞMEDİ örnekleri (kontrol için):");
for (const s of eslesmediSamples) console.log(" - " + s);
