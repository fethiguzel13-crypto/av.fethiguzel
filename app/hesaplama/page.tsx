"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

// ─── YARDIMCI ─────────────────────────────────────────────────────────────────

function fmt(n: number, digits = 2) {
  return n.toLocaleString("tr-TR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("tr-TR");
}

function addDays(d: Date, days: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

function daysBetween(a: Date, b: Date) {
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));
}

// ─── KART SARMALAYICI ──────────────────────────────────────────────────────────

function Card({ id, icon, title, tag, children }: {
  id: string; icon: string; title: string; tag: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const TAG_COLORS: Record<string, string> = {
    "İş Hukuku": "bg-blue-50 text-blue-700",
    "Aile Hukuku": "bg-pink-50 text-pink-700",
    "Alacak": "bg-orange-50 text-orange-700",
    "Gayrimenkul": "bg-green-50 text-green-700",
    "Dava Masrafı": "bg-purple-50 text-purple-700",
    "Sigorta": "bg-red-50 text-red-700",
    "Usul": "bg-amber-50 text-amber-700",
    "Analiz": "bg-teal-50 text-teal-700",
  };
  return (
    <div id={id} className="bg-white border border-charcoal/6 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-charcoal/2 transition-colors"
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <span className="text-2xl sm:text-3xl shrink-0">{icon}</span>
          <div className="min-w-0">
            <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 sm:px-2.5 py-0.5 rounded-full ${TAG_COLORS[tag] ?? "bg-charcoal/5 text-charcoal/40"}`}>
              {tag}
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-heading font-bold text-charcoal mt-1 leading-snug">{title}</h2>
          </div>
        </div>
        {open ? <ChevronUp size={18} className="text-charcoal/30 shrink-0 ml-2" /> : <ChevronDown size={18} className="text-charcoal/30 shrink-0 ml-2" />}
      </button>
      {open && (
        <div className="px-4 sm:px-6 pb-5 sm:pb-7 border-t border-charcoal/5 pt-4 sm:pt-6">
          {children}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-charcoal/50 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

const inp = "w-full border border-charcoal/15 rounded-xl px-3 sm:px-4 py-2.5 text-charcoal text-sm focus:outline-none focus:border-accent transition-colors bg-cream/60";
const sel = inp + " cursor-pointer";

function Result({ rows, note }: { rows: [string, string][]; note?: string }) {
  return (
    <div className="mt-5 bg-primary/5 border border-primary/10 rounded-xl sm:rounded-2xl p-4 sm:p-5">
      <div className="divide-y divide-charcoal/8">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5 first:pt-0 last:pb-0 gap-0.5 sm:gap-3">
            <span className="text-xs sm:text-sm text-charcoal/55 leading-snug">{k}</span>
            <span className="text-sm sm:text-sm font-bold text-charcoal sm:text-right shrink-0">{v}</span>
          </div>
        ))}
      </div>
      {note && (
        <p className="mt-3 sm:mt-4 flex items-start gap-2 text-[10px] sm:text-[11px] text-charcoal/40 leading-relaxed">
          <Info size={11} className="shrink-0 mt-0.5" />
          {note}
        </p>
      )}
    </div>
  );
}

// ─── 1. KIDEM TAZMİNATI ────────────────────────────────────────────────────────

function KidemTazminati() {
  // Kıdem tazminatı tavanı — her 6 ayda Resmi Gazete'de güncellenir
  const TAVAN_2026_I = 64948.77; // 01.01.2026–30.06.2026
  const [baslangic, setBaslangic] = useState("2015-01-01");
  const [bitis, setBitis] = useState(() => new Date().toISOString().slice(0, 10));
  const [brutUcret, setBrutUcret] = useState("60000");
  const [ozelTavan, setOzelTavan] = useState("");

  const result = useMemo(() => {
    const b = new Date(baslangic);
    const e = new Date(bitis);
    if (isNaN(b.getTime()) || isNaN(e.getTime()) || e <= b) return null;
    const gun = daysBetween(b, e);
    const yil = gun / 365;
    const brutNum = parseFloat(brutUcret.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const tavanNum = ozelTavan ? parseFloat(ozelTavan.replace(/[^0-9.,]/g, "").replace(",", ".")) : TAVAN_2026_I;
    const gunlukBrut = brutNum / 30;
    const gunlukTavan = tavanNum / 30;
    const esas = Math.min(gunlukBrut, gunlukTavan);
    const tavanAsildi = gunlukBrut > gunlukTavan;
    const brutKidem = esas * 30 * yil;
    const damagaVergi = brutKidem * 0.00759; // damga vergisi ‰7,59
    const netKidem = brutKidem - damagaVergi;
    const tam = Math.floor(yil);
    const kistGun = gun - tam * 365;
    return { brutKidem, damagaVergi, netKidem, yil, tam, kistGun, esas, gunlukBrut, tavanAsildi, tavanNum };
  }, [baslangic, bitis, brutUcret, ozelTavan]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="İşe Giriş Tarihi">
        <input type="date" value={baslangic} onChange={e => setBaslangic(e.target.value)} className={inp} />
      </Field>
      <Field label="İşten Çıkış Tarihi">
        <input type="date" value={bitis} onChange={e => setBitis(e.target.value)} className={inp} />
      </Field>
      <Field label="Brüt Aylık Ücret (TL)">
        <input type="text" value={brutUcret} onChange={e => setBrutUcret(e.target.value)} placeholder="60.000" className={inp} />
      </Field>
      <Field label="Kıdem Tavanı (TL) — opsiyonel">
        <input
          type="text"
          value={ozelTavan}
          onChange={e => setOzelTavan(e.target.value)}
          placeholder={`Varsayılan: ${fmt(TAVAN_2026_I)} (2026/I)`}
          className={inp}
        />
      </Field>

      {result ? (
        <div className="col-span-full">
          <Result
            rows={[
              ["Toplam Çalışma Süresi", `${result.tam} tam yıl + ${result.kistGun} gün (${fmt(result.yil, 4)} yıl)`],
              ["Esas Alınan Günlük Ücret", `${fmt(result.esas)} TL`],
              ...(result.tavanAsildi ? [["Tavan Uygulandı", `Brüt ücret tavanı (${fmt(result.tavanNum)} TL) aştı`] as [string, string]] : []),
              ["Brüt Kıdem Tazminatı", `${fmt(result.brutKidem)} TL`],
              ["Damga Vergisi (‰7,59)", `− ${fmt(result.damagaVergi)} TL`],
              ["Net Kıdem Tazminatı", `${fmt(result.netKidem)} TL`],
            ]}
            note="2026/I dönemi (01.01–30.06.2026) kıdem tazminatı tavanı 64.948,77 TL'dir. Tavanı aşan brüt ücretlerde hesap tavandan yapılır. Kıdem tazminatından yalnızca damga vergisi (‰7,59) kesilir; SGK primi ve gelir vergisi kesilmez."
          />
        </div>
      ) : (
        <div className="col-span-full text-sm text-charcoal/35 italic">Tarihleri ve ücreti girin.</div>
      )}
    </div>
  );
}

// ─── 2. İHBAR TAZMİNATI ───────────────────────────────────────────────────────

function IhbarTazminati() {
  const [yil, setYil] = useState("5");
  const [brutUcret, setBrutUcret] = useState("50000");

  const result = useMemo(() => {
    const y = parseFloat(yil) || 0;
    const brut = parseFloat(brutUcret.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    let haftaSayisi = 2;
    if (y >= 0.5 && y < 1.5) haftaSayisi = 4;
    else if (y >= 1.5 && y < 3) haftaSayisi = 6;
    else if (y >= 3) haftaSayisi = 8;
    const gunluk = brut / 30;
    const brutIhbar = gunluk * haftaSayisi * 7;
    const damga = brutIhbar * 0.00759;
    const net = brutIhbar - damga;
    return { haftaSayisi, brutIhbar, damga, net };
  }, [yil, brutUcret]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Çalışma Süresi (yıl)">
        <input type="number" min="0" step="0.5" value={yil} onChange={e => setYil(e.target.value)} className={inp} />
      </Field>
      <Field label="Brüt Aylık Ücret (TL)">
        <input type="text" value={brutUcret} onChange={e => setBrutUcret(e.target.value)} className={inp} />
      </Field>
      <div className="col-span-full">
        <Result
          rows={[
            ["Bildirim Süresi", `${result.haftaSayisi} hafta (${result.haftaSayisi * 7} gün)`],
            ["Brüt İhbar Tazminatı", `${fmt(result.brutIhbar)} TL`],
            ["Damga Vergisi", `${fmt(result.damga)} TL`],
            ["Net İhbar Tazminatı", `${fmt(result.net)} TL`],
          ]}
          note="0–6 ay: 2 hafta | 6 ay–1,5 yıl: 4 hafta | 1,5–3 yıl: 6 hafta | 3+ yıl: 8 hafta (4857 sayılı İK md.17)"
        />
      </div>
    </div>
  );
}

// ─── 3. FAZLA MESAİ ───────────────────────────────────────────────────────────

function FazlaMesai() {
  const [haftaSaati, setHaftaSaati] = useState("50");
  const [brutUcret, setBrutUcret] = useState("50000");
  const [haftaSayisi, setHaftaSayisi] = useState("4");

  const result = useMemo(() => {
    const hs = parseFloat(haftaSaati) || 0;
    const brut = parseFloat(brutUcret.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const hn = parseInt(haftaSayisi) || 1;
    const fazlaSaat = Math.max(0, hs - 45);
    const saatlikBrut = brut / 225; // aylık 30 gün × 7.5 saat
    const fazlaUcret = fazlaSaat * saatlikBrut * 1.5 * hn;
    const yillikAzami = fazlaSaat * 52; // max 270 saat/yıl
    return { fazlaSaat, saatlikBrut, fazlaUcret, yillikAzami };
  }, [haftaSaati, brutUcret, haftaSayisi]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Field label="Haftalık Çalışma Saati">
        <input type="number" min="45" max="60" value={haftaSaati} onChange={e => setHaftaSaati(e.target.value)} className={inp} />
      </Field>
      <Field label="Brüt Aylık Ücret (TL)">
        <input type="text" value={brutUcret} onChange={e => setBrutUcret(e.target.value)} className={inp} />
      </Field>
      <Field label="Hesaplama Süresi (hafta)">
        <input type="number" min="1" value={haftaSayisi} onChange={e => setHaftaSayisi(e.target.value)} className={inp} />
      </Field>
      <div className="md:col-span-3">
        <Result
          rows={[
            ["Haftalık Fazla Saat", `${fmt(result.fazlaSaat, 1)} saat`],
            ["Saatlik Ücret", `${fmt(result.saatlikBrut)} TL`],
            ["Brüt Fazla Mesai Ücreti", `${fmt(result.fazlaUcret)} TL`],
          ]}
          note="45 saati aşan çalışmalar %50 zamlıdır (4857 md.41). Yılda azami 270 saat fazla mesai yapılabilir."
        />
      </div>
    </div>
  );
}

// ─── 4. YILLIK İZİN ───────────────────────────────────────────────────────────

function YillikIzin() {
  const [calismaSuresi, setCalismaSuresi] = useState("5");
  const [brutUcret, setBrutUcret] = useState("50000");
  const [kullanilanGun, setKullanilanGun] = useState("0");

  const result = useMemo(() => {
    const yil = parseFloat(calismaSuresi) || 0;
    const brut = parseFloat(brutUcret.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const kullanilan = parseInt(kullanilanGun) || 0;
    let hakGun = 14;
    if (yil >= 5 && yil < 15) hakGun = 20;
    else if (yil >= 15) hakGun = 26;
    const kalan = Math.max(0, hakGun - kullanilan);
    const gunlukBrut = brut / 30;
    const ucret = kalan * gunlukBrut;
    return { hakGun, kalan, ucret };
  }, [calismaSuresi, brutUcret, kullanilanGun]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Field label="Çalışma Süresi (yıl)">
        <input type="number" min="1" value={calismaSuresi} onChange={e => setCalismaSuresi(e.target.value)} className={inp} />
      </Field>
      <Field label="Brüt Aylık Ücret (TL)">
        <input type="text" value={brutUcret} onChange={e => setBrutUcret(e.target.value)} className={inp} />
      </Field>
      <Field label="Kullanılan İzin Günü">
        <input type="number" min="0" value={kullanilanGun} onChange={e => setKullanilanGun(e.target.value)} className={inp} />
      </Field>
      <div className="md:col-span-3">
        <Result
          rows={[
            ["Hak Edilen İzin", `${result.hakGun} gün`],
            ["Kalan İzin", `${result.kalan} gün`],
            ["İzin Ücreti", `${fmt(result.ucret)} TL`],
          ]}
          note="1–5 yıl: 14 gün | 5–15 yıl: 20 gün | 15+ yıl: 26 gün (4857 md.53). 18 yaş altı ve 50+ çalışanlara min. 20 gün."
        />
      </div>
    </div>
  );
}

// ─── 5. SMM HESAPLAMA ─────────────────────────────────────────────────────────

function SmmHesaplama() {
  const [mod, setMod] = useState<"brut" | "net">("brut");
  const [tutar, setTutar] = useState("10000");
  const KDV = 0.20;
  const STOPAJ = 0.20;

  const result = useMemo(() => {
    const n = parseFloat(tutar.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    let matrah: number;
    if (mod === "brut") {
      matrah = n;
    } else {
      // net = matrah - stopaj → matrah = net / (1 - stopaj)
      matrah = n / (1 - STOPAJ);
    }
    const kdv = matrah * KDV;
    const stopaj = matrah * STOPAJ;
    const faturaToplamı = matrah + kdv;
    const netTahsilat = faturaToplamı - stopaj;
    const avukatNetGercek = netTahsilat - kdv; // avukat kdv'yi devlete ödeyecek
    return { matrah, kdv, stopaj, faturaToplamı, netTahsilat, avukatNetGercek };
  }, [tutar, mod]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Hesaplama Yönü">
        <select value={mod} onChange={e => setMod(e.target.value as "brut" | "net")} className={sel}>
          <option value="brut">Brütten Nete (matrah belli)</option>
          <option value="net">Netten Brüte (avukatın alacağı belli)</option>
        </select>
      </Field>
      <Field label={mod === "brut" ? "Hizmet Bedeli / Matrah (TL)" : "Avukatın Alacağı Net Tutar (TL)"}>
        <input type="text" value={tutar} onChange={e => setTutar(e.target.value)} className={inp} />
      </Field>
      <div className="col-span-full">
        <Result
          rows={[
            ["Matrah (Hizmet Bedeli)", `${fmt(result.matrah)} TL`],
            ["KDV (%20)", `+ ${fmt(result.kdv)} TL`],
            ["Fatura Toplamı", `${fmt(result.faturaToplamı)} TL`],
            ["Stopaj (%20 — müvekkilce kesilir)", `− ${fmt(result.stopaj)} TL`],
            ["Avukatın Tahsil Edeceği Nakit", `${fmt(result.netTahsilat)} TL`],
            ["Avukatın Gerçek Net Kazancı (KDV öd. sonrası)", `${fmt(result.avukatNetGercek)} TL`],
          ]}
          note="GVK md.94/2 gereği avukatlık hizmetlerinde stopaj %20, KDV %20'dir. Avukat KDV mükellefiyse tahsil ettiği KDV'yi devlete öder."
        />
      </div>
    </div>
  );
}

// ─── 6. NAFAKA ARTIŞI ──────────────────────────────────────────────────────────

function NafakaArtisi() {
  const [mevcutNafaka, setMevcutNafaka] = useState("3000");
  const [tufeOrani, setTufeOrani] = useState("45");
  const [ay, setAy] = useState("12");

  const result = useMemo(() => {
    const nafaka = parseFloat(mevcutNafaka.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const oran = parseFloat(tufeOrani) / 100;
    const aylar = parseInt(ay) || 12;
    const artisOrani = oran * (aylar / 12);
    const yeniNafaka = nafaka * (1 + artisOrani);
    const artis = yeniNafaka - nafaka;
    return { yeniNafaka, artis, artisOrani };
  }, [mevcutNafaka, tufeOrani, ay]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Field label="Mevcut Nafaka Miktarı (TL)">
        <input type="text" value={mevcutNafaka} onChange={e => setMevcutNafaka(e.target.value)} className={inp} />
      </Field>
      <Field label="TÜFE Değişim Oranı (%)">
        <input type="number" step="0.01" value={tufeOrani} onChange={e => setTufeOrani(e.target.value)} className={inp} />
      </Field>
      <Field label="Dönem (ay)">
        <select value={ay} onChange={e => setAy(e.target.value)} className={sel}>
          <option value="12">12 ay (yıllık)</option>
          <option value="6">6 ay</option>
          <option value="3">3 ay</option>
        </select>
      </Field>
      <div className="md:col-span-3">
        <Result
          rows={[
            ["Artış Oranı", `%${fmt(result.artisOrani * 100, 2)}`],
            ["Artış Miktarı", `${fmt(result.artis)} TL`],
            ["Yeni Nafaka", `${fmt(result.yeniNafaka)} TL`],
          ]}
          note="Nafaka artışında TBK md.176/4 uyarınca hâkim TÜFE'yi esas alır. Güncel TÜFE oranı için TÜİK'in aylık açıklamalarını kontrol edin."
        />
      </div>
    </div>
  );
}

// ─── 7. İDDET MÜDDETİ ─────────────────────────────────────────────────────────

function IddetMuddeti() {
  const [tarih, setTarih] = useState(() => new Date().toISOString().slice(0, 10));
  const [sebep, setSebep] = useState("bosanma");

  const result = useMemo(() => {
    const base = new Date(tarih);
    if (isNaN(base.getTime())) return null;
    const bitis = addDays(base, 300);
    const kalan = daysBetween(new Date(), bitis);
    return { bitis, kalan };
  }, [tarih, sebep]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Başlangıç Tarihi">
        <input type="date" value={tarih} onChange={e => setTarih(e.target.value)} className={inp} />
      </Field>
      <Field label="Sebebi">
        <select value={sebep} onChange={e => setSebep(e.target.value)} className={sel}>
          <option value="bosanma">Boşanma kararı kesinleşmesi</option>
          <option value="olum">Kocanın ölümü</option>
          <option value="butlan">Evliliğin iptali</option>
        </select>
      </Field>
      {result && (
        <div className="md:col-span-2">
          <Result
            rows={[
              ["Başlangıç Tarihi", fmtDate(new Date(tarih))],
              ["Bitiş Tarihi (300. gün)", fmtDate(result.bitis)],
              [result.kalan > 0 ? "Kalan Gün" : "Süre Doldu", result.kalan > 0 ? `${result.kalan} gün` : `${Math.abs(result.kalan)} gün önce doldu`],
            ]}
            note="TMK md.132 — Evliliğin sona ermesinden itibaren 300 gün geçmedikçe kadın yeniden evlenemez. Mahkeme kararıyla bu süre kaldırılabilir."
          />
        </div>
      )}
    </div>
  );
}

// ─── 8. FAİZ HESAPLAMA ────────────────────────────────────────────────────────

const FAIZ_ORANLARI = [
  { etiket: "Yasal Faiz (3095 md.1) — %24", oran: 24.0 },
  { etiket: "Ticari Temerrüt / Avans Faizi (TCMB 2026) — %49,25", oran: 49.25 },
  { etiket: "TCMB Reeskont Faizi (2026) — %48,25", oran: 48.25 },
  { etiket: "Eski Yasal Faiz (2005–2024) — %9", oran: 9.0 },
  { etiket: "Özel oran (girin)", oran: 0 },
];

function FaizHesaplama() {
  const [anapara, setAnapara] = useState("100000");
  const [oranIdx, setOranIdx] = useState(0);
  const [ozelOran, setOzelOran] = useState("");
  const [baslangic, setBaslangic] = useState("2024-01-01");
  const [bitis, setBitis] = useState(() => new Date().toISOString().slice(0, 10));
  const [bilesik, setBilesik] = useState(false);

  const result = useMemo(() => {
    const para = parseFloat(anapara.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const secilen = FAIZ_ORANLARI[oranIdx];
    const oran = oranIdx === FAIZ_ORANLARI.length - 1
      ? parseFloat(ozelOran) || 0
      : secilen.oran;
    const b = new Date(baslangic);
    const e = new Date(bitis);
    if (isNaN(b.getTime()) || isNaN(e.getTime()) || e <= b || para === 0) return null;
    const gun = daysBetween(b, e);
    const faizMiktari = bilesik
      ? para * (Math.pow(1 + oran / 100 / 365, gun) - 1)
      : para * (oran / 100) * (gun / 365);
    const toplam = para + faizMiktari;
    return { gun, faizMiktari, toplam, oran };
  }, [anapara, oranIdx, ozelOran, baslangic, bitis, bilesik]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Anapara (TL)">
        <input type="text" value={anapara} onChange={e => setAnapara(e.target.value)} className={inp} />
      </Field>
      <Field label="Faiz Oranı">
        <select value={oranIdx} onChange={e => setOranIdx(parseInt(e.target.value))} className={sel}>
          {FAIZ_ORANLARI.map((o, i) => (
            <option key={i} value={i}>{o.etiket} {o.oran > 0 ? `(${o.oran}%)` : ""}</option>
          ))}
        </select>
      </Field>
      {oranIdx === FAIZ_ORANLARI.length - 1 && (
        <Field label="Özel Yıllık Faiz Oranı (%)">
          <input type="number" value={ozelOran} onChange={e => setOzelOran(e.target.value)} placeholder="Örn: 15" className={inp} />
        </Field>
      )}
      <Field label="Başlangıç Tarihi">
        <input type="date" value={baslangic} onChange={e => setBaslangic(e.target.value)} className={inp} />
      </Field>
      <Field label="Bitiş Tarihi">
        <input type="date" value={bitis} onChange={e => setBitis(e.target.value)} className={inp} />
      </Field>
      <Field label="Hesaplama Yöntemi">
        <select value={bilesik ? "bilesik" : "basit"} onChange={e => setBilesik(e.target.value === "bilesik")} className={sel}>
          <option value="basit">Basit faiz</option>
          <option value="bilesik">Bileşik faiz (günlük)</option>
        </select>
      </Field>

      {result ? (
        <div className="col-span-full">
          <Result
            rows={[
              ["Süre", `${result.gun} gün`],
              ["Yıllık Faiz Oranı", `%${fmt(result.oran, 2)}`],
              ["Faiz Miktarı", `${fmt(result.faizMiktari)} TL`],
              ["Anapara + Faiz", `${fmt(result.toplam)} TL`],
            ]}
            note="3095 sayılı Kanun md.1 uyarınca yasal faiz oranı 2024'ten itibaren %24'tür. Ticari işlerde TCMB'nin kısa vadeli avans faiz oranı (2026: %49,25) esas alınabilir ve bu oran yıl içinde güncellenebilir. Değişken dönemli faiz için her dönemi ayrı hesaplayın."
          />
        </div>
      ) : (
        <div className="col-span-full text-sm text-charcoal/35 italic">Bilgileri doldurun.</div>
      )}
    </div>
  );
}

// ─── 9. KİRA ARTIŞ ORANI ──────────────────────────────────────────────────────

function KiraArtis() {
  const [tur, setTur] = useState("konut");
  const [mevcutKira, setMevcutKira] = useState("10000");
  const [tufe12, setTufe12] = useState("38.5");

  const result = useMemo(() => {
    const kira = parseFloat(mevcutKira.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const tufe = parseFloat(tufe12) || 0;
    let uygulanacak = tufe;
    let aciklama = `TÜFE 12 aylık ortalama: %${fmt(tufe, 2)} uygulanır.`;
    if (tur === "konut") {
      // 2022 Temmuz'a kadar %25 sınırı vardı, sona erdi. Artık TÜFE uygulanıyor.
      aciklama = `Konut kira artışında 12 aylık TÜFE ortalaması esas alınır (%${fmt(tufe, 2)}).`;
    } else {
      aciklama = `İşyeri kiralarında yasal sınır yoktur; TÜFE esas alınmakla birlikte taraflar farklı oran kararlaştırabilir.`;
    }
    const yeniKira = kira * (1 + uygulanacak / 100);
    const artis = yeniKira - kira;
    return { yeniKira, artis, uygulanacak, aciklama };
  }, [tur, mevcutKira, tufe12]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Field label="Kira Türü">
        <select value={tur} onChange={e => setTur(e.target.value)} className={sel}>
          <option value="konut">Konut</option>
          <option value="isyeri">İşyeri</option>
        </select>
      </Field>
      <Field label="Mevcut Aylık Kira (TL)">
        <input type="text" value={mevcutKira} onChange={e => setMevcutKira(e.target.value)} className={inp} />
      </Field>
      <Field label="12 Aylık TÜFE Ort. (%)">
        <input type="number" step="0.01" value={tufe12} onChange={e => setTufe12(e.target.value)} className={inp} />
      </Field>
      <div className="md:col-span-3">
        <Result
          rows={[
            ["Artış Oranı", `%${fmt(result.uygulanacak, 2)}`],
            ["Artış Miktarı", `${fmt(result.artis)} TL`],
            ["Yeni Kira Bedeli", `${fmt(result.yeniKira)} TL`],
          ]}
          note={result.aciklama + " Güncel TÜFE 12 aylık ortalaması için TÜİK resmi sitesini kontrol edin."}
        />
      </div>
    </div>
  );
}

// ─── 10. ARAÇ DEĞER KAYBI ─────────────────────────────────────────────────────

function AracDegerKaybi() {
  const [rayicDeger, setRayicDeger] = useState("500000");
  const [hasarBedeli, setHasarBedeli] = useState("50000");
  const [km, setKm] = useState("80000");
  const [yas, setYas] = useState("3");

  const result = useMemo(() => {
    const R = parseFloat(rayicDeger.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const H = parseFloat(hasarBedeli.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const kmN = parseInt(km) || 0;
    const yasN = parseInt(yas) || 0;
    if (R === 0) return null;

    // Km faktörü (0–1: düşük km yüksek değer kaybı oranı)
    const kmFaktor = kmN <= 30000 ? 1.0 : kmN <= 60000 ? 0.90 : kmN <= 100000 ? 0.80 : kmN <= 150000 ? 0.70 : 0.60;
    // Yaş faktörü
    const yasFaktor = yasN <= 1 ? 1.0 : yasN <= 3 ? 0.95 : yasN <= 5 ? 0.85 : yasN <= 8 ? 0.75 : 0.65;
    // Hasar oranı
    const hasarOrani = H / R;
    // Değer kaybı aralığı
    const base = R * hasarOrani * 0.15;
    const min = base * kmFaktor * yasFaktor;
    const max = base * kmFaktor * yasFaktor * 1.4;
    return { min, max, hasarOrani };
  }, [rayicDeger, hasarBedeli, km, yas]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Araç Rayiç Değeri (TL)">
        <input type="text" value={rayicDeger} onChange={e => setRayicDeger(e.target.value)} className={inp} />
      </Field>
      <Field label="Tamir Bedeli / Hasar (TL)">
        <input type="text" value={hasarBedeli} onChange={e => setHasarBedeli(e.target.value)} className={inp} />
      </Field>
      <Field label="Kilometre">
        <input type="text" value={km} onChange={e => setKm(e.target.value)} className={inp} />
      </Field>
      <Field label="Araç Yaşı">
        <input type="number" min="0" value={yas} onChange={e => setYas(e.target.value)} className={inp} />
      </Field>
      {result ? (
        <div className="col-span-full">
          <Result
            rows={[
              ["Hasar Oranı (H/R)", `%${fmt(result.hasarOrani * 100, 2)}`],
              ["Tahmini Değer Kaybı Aralığı", `${fmt(result.min)} TL — ${fmt(result.max)} TL`],
            ]}
            note="Bu hesaplama Yargıtay içtihatlarına dayalı genel bir tahminden ibarettir. Mahkemelerde fiilen uygulanacak değer, bilirkişi tespiti, sigorta genel şartları ve aracın özel durumuna göre değişir."
          />
        </div>
      ) : (
        <div className="col-span-full text-sm text-charcoal/35 italic">Bilgileri doldurun.</div>
      )}
    </div>
  );
}

// ─── 11. TAPU HARCI ───────────────────────────────────────────────────────────

function TapuHarci() {
  const [deger, setDeger] = useState("3000000");
  const [doner, setDoner] = useState("4500"); // 2026 yaklaşık döner sermaye

  const result = useMemo(() => {
    const d = parseFloat(deger.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const donerN = parseFloat(doner.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const alici = d * 0.02;
    const satici = d * 0.02;
    const toplamHarc = alici + satici;
    const toplam = toplamHarc + donerN;
    return { alici, satici, toplamHarc, toplam };
  }, [deger, doner]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Beyan Edilen Satış Bedeli (TL)">
        <input type="text" value={deger} onChange={e => setDeger(e.target.value)} className={inp} />
      </Field>
      <Field label="Döner Sermaye Bedeli (TL)">
        <input type="text" value={doner} onChange={e => setDoner(e.target.value)} className={inp} />
      </Field>
      <div className="col-span-full">
        <Result
          rows={[
            ["Alıcı Tapu Harcı (%2)", `${fmt(result.alici)} TL`],
            ["Satıcı Tapu Harcı (%2)", `${fmt(result.satici)} TL`],
            ["Toplam Tapu Harcı (%4)", `${fmt(result.toplamHarc)} TL`],
            ["Döner Sermaye Bedeli", `${fmt(result.toplam - result.toplamHarc)} TL`],
            ["Genel Toplam Maliyet", `${fmt(result.toplam)} TL`],
          ]}
          note="Harçlar Kanunu (492 s. Tarife) uyarınca tapu devrinde alıcı ve satıcı ayrı ayrı %2 (toplam %4) harç öder. Harç, gerçek devir bedeli üzerinden hesaplanır; beyan edilen bedel emsal/rayiç bedelin altında olamaz. Döner sermaye bedeli yıllık güncellenir (2026 yaklaşık)."
        />
      </div>
    </div>
  );
}

// ─── 12. NİSPİ VEKALET ÜCRETİ ─────────────────────────────────────────────────

// 2026 AAÜT Üçüncü Kısım — nispi vekalet basamakları (RG 04.11.2025)
// Her dilim için: dilim genişliği (TL) ve oran
const AAUT_BASAMAKLAR = [
  { dilim: 600000,   oran: 0.16 },
  { dilim: 600000,   oran: 0.15 },
  { dilim: 1200000,  oran: 0.14 },
  { dilim: 1200000,  oran: 0.13 },
  { dilim: 1800000,  oran: 0.11 },
  { dilim: 2400000,  oran: 0.08 },
  { dilim: 3000000,  oran: 0.05 },
  { dilim: 3600000,  oran: 0.03 },
  { dilim: 4200000,  oran: 0.02 },
  { dilim: Infinity, oran: 0.01 },
];
const AAUT_MAKTU_ASLIYE = 30000; // 2026 asliye hukuk maktu vekalet ücreti (alt sınır)

function nispiVekalet(dava: number): number {
  let kalan = dava;
  let toplam = 0;
  for (const b of AAUT_BASAMAKLAR) {
    const dilimdeki = Math.min(kalan, b.dilim);
    if (dilimdeki <= 0) break;
    toplam += dilimdeki * b.oran;
    kalan -= dilimdeki;
    if (kalan <= 0) break;
  }
  return Math.max(toplam, AAUT_MAKTU_ASLIYE);
}

function NispiVekalet() {
  const [davaD, setDavaD] = useState("500000");
  const [kabulOrani, setKabulOrani] = useState("100");

  const result = useMemo(() => {
    const d = parseFloat(davaD.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const oran = Math.min(100, Math.max(0, parseFloat(kabulOrani) || 0)) / 100;
    const tamVekalet = nispiVekalet(d);
    const kabulEdilen = d * oran;
    const lehVekalet = nispiVekalet(kabulEdilen);
    const reddedilen = d * (1 - oran);
    const aleyhVekalet = nispiVekalet(reddedilen);
    return { tamVekalet, lehVekalet, aleyhVekalet, kabulEdilen, reddedilen };
  }, [davaD, kabulOrani]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Dava Değeri / Müddeabih (TL)">
        <input type="text" value={davaD} onChange={e => setDavaD(e.target.value)} className={inp} />
      </Field>
      <Field label="Davanın Kabul Oranı (%)">
        <input type="number" min="0" max="100" value={kabulOrani} onChange={e => setKabulOrani(e.target.value)} className={inp} />
      </Field>
      <div className="col-span-full">
        <Result
          rows={[
            ["Tam Kabulde Vekalet Ücreti", `${fmt(result.tamVekalet)} TL`],
            ["Kabul Edilen Kısım İçin (davacı lehine)", `${fmt(result.lehVekalet)} TL`],
            ["Reddedilen Kısım İçin (davalı lehine)", `${fmt(result.aleyhVekalet)} TL`],
          ]}
          note="2026 AAÜT Üçüncü Kısım basamaklı oranları uygulanmıştır (%16, %15, %14, %13, %11, %8, %5, %3, %2, %1). Kısmen kabul/ret halinde her iki taraf lehine ayrı vekalet ücretine hükmedilir. Vekalet ücreti yargılama giderlerine dahildir; davanın türü ve mahkemeye göre maktu alt sınır değişebilir (asliye hukuk: 30.000 TL)."
        />
      </div>
    </div>
  );
}

// ─── 13. DAVA AÇMA HARCI ──────────────────────────────────────────────────────

function DavaAcmaHarci() {
  const [davaD, setDavaD] = useState("500000");
  const [tarafSayisi, setTarafSayisi] = useState("2");
  const [bilirkisi, setBilirkisi] = useState(false);
  const [kesif, setKesif] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(davaD.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const taraf = parseInt(tarafSayisi) || 2;
    // Harçlar Kanunu Tarife No.1 — 2024 yaklaşık oranlar
    const basvuruHarci = 680; // maktu (yıllık güncellenir)
    const pesinHarc = d * 0.0068; // ‰6,831 yaklaşık
    // Gider avansı (HMK md.120)
    let giderAvans = taraf * 850 + 500; // taraf başı tebligat vb.
    if (bilirkisi) giderAvans += 3000;
    if (kesif) giderAvans += 2500;
    const toplam = basvuruHarci + pesinHarc + giderAvans;
    return { basvuruHarci, pesinHarc, giderAvans, toplam };
  }, [davaD, tarafSayisi, bilirkisi, kesif]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Dava Değeri (TL)">
        <input type="text" value={davaD} onChange={e => setDavaD(e.target.value)} className={inp} />
      </Field>
      <Field label="Toplam Taraf Sayısı">
        <input type="number" min="2" value={tarafSayisi} onChange={e => setTarafSayisi(e.target.value)} className={inp} />
      </Field>
      <Field label="Bilirkişi İncelemesi?">
        <select value={bilirkisi ? "evet" : "hayir"} onChange={e => setBilirkisi(e.target.value === "evet")} className={sel}>
          <option value="hayir">Hayır</option>
          <option value="evet">Evet</option>
        </select>
      </Field>
      <Field label="Keşif?">
        <select value={kesif ? "evet" : "hayir"} onChange={e => setKesif(e.target.value === "evet")} className={sel}>
          <option value="hayir">Hayır</option>
          <option value="evet">Evet</option>
        </select>
      </Field>
      <div className="col-span-full">
        <Result
          rows={[
            ["Başvuru Harcı (maktu)", `${fmt(result.basvuruHarci)} TL`],
            ["Peşin Harç (‰6,831 approx.)", `${fmt(result.pesinHarc)} TL`],
            ["Gider Avansı (tahmini)", `${fmt(result.giderAvans)} TL`],
            ["Toplam Başlangıç Masrafı", `${fmt(result.toplam)} TL`],
          ]}
          note="Harç tutarları Harçlar Kanunu Tarife No.1 esasında hesaplanmıştır (2024 approx.). Gider avansı tahminidir; mahkeme türü ve davaya göre değişir. Yargılama sonunda kabul oranında iade yapılabilir."
        />
      </div>
    </div>
  );
}

// ─── 14. İCRA KAPAK HESABI ────────────────────────────────────────────────────

function IcraKapakHesabi() {
  const [anapara, setAnapara] = useState("100000");
  const [faiz, setFaiz] = useState("20000");
  const [harc, setHarc] = useState("2000");
  const [davaVekalet, setDavaVekalet] = useState(false);

  const result = useMemo(() => {
    const ap = parseFloat(anapara.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const fz = parseFloat(faiz.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const hrc = parseFloat(harc.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const alacak = ap + fz;
    // Tahsil harcı (Harçlar Kanunu Tarife No.1)
    const tahsilHarc = alacak * 0.04545; // ‰45,45
    const cezaeviHarc = alacak * 0.00455; // ‰4,55
    const icraVekalet = nispiVekalet(ap) * 0.5; // icra vekalet ücreti (nispi × 0.5 yaklaşık)
    const toplam = alacak + tahsilHarc + cezaeviHarc + hrc + icraVekalet;
    return { alacak, tahsilHarc, cezaeviHarc, icraVekalet, toplam };
  }, [anapara, faiz, harc, davaVekalet]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Field label="Anapara Alacak (TL)">
        <input type="text" value={anapara} onChange={e => setAnapara(e.target.value)} className={inp} />
      </Field>
      <Field label="Birikmiş Faiz (TL)">
        <input type="text" value={faiz} onChange={e => setFaiz(e.target.value)} className={inp} />
      </Field>
      <Field label="Diğer Masraflar (TL)">
        <input type="text" value={harc} onChange={e => setHarc(e.target.value)} className={inp} />
      </Field>
      <div className="md:col-span-3">
        <Result
          rows={[
            ["Alacak Toplamı", `${fmt(result.alacak)} TL`],
            ["Tahsil Harcı (‰45,45)", `${fmt(result.tahsilHarc)} TL`],
            ["Cezaevi Harcı (‰4,55)", `${fmt(result.cezaeviHarc)} TL`],
            ["İcra Vekalet Ücreti (approx.)", `${fmt(result.icraVekalet)} TL`],
            ["Kapak Dosya Toplamı", `${fmt(result.toplam)} TL`],
          ]}
          note="Tahsil ve cezaevi harcı Harçlar Kanunu Tarife No.1 esas alınmıştır. Vekalet ücreti AAÜT icra tarifesine göre değişir. Kesin tutar için dosya avukatınızla çalışın."
        />
      </div>
    </div>
  );
}

// ─── 15. İCRA İNKÂR TAZMİNATI ────────────────────────────────────────────────

function IcraInkarTazminati() {
  const [alacak, setAlacak] = useState("100000");

  const result = useMemo(() => {
    const a = parseFloat(alacak.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const min = a * 0.20;
    return { min };
  }, [alacak]);

  return (
    <div className="grid grid-cols-1 gap-5">
      <Field label="İtiraz Edilen Alacak (TL)">
        <input type="text" value={alacak} onChange={e => setAlacak(e.target.value)} className={inp} />
      </Field>
      <Result
        rows={[
          ["Asgari İnkâr Tazminatı (%20)", `${fmt(result.min)} TL`],
        ]}
        note="İİK md.67 — İtirazın iptali davasında alacaklı haklı çıkarsa borçlu asgari %20 inkâr tazminatına hükmolunur. Mahkeme daha yüksek oran da uygulayabilir."
      />
    </div>
  );
}

// ─── 16. ARABULUCULUK ASGARİ ÜCRET (2026 Resmî Tarife) ───────────────────────
// Kaynak: 2026 Yılı Arabuluculuk Asgari Ücret Tarifesi (RG 26.12.2025 / 33119)

// İKİNCİ KISIM — konusu para olan/para ile ölçülebilen + ANLAŞMA → nispi basamaklar
// Her dilim için: dilim genişliği (TL), tek arabulucu oranı, birden fazla arabulucu oranı
const ARB_NISPI = [
  { dilim: 600000,         tek: 0.06,  coklu: 0.09 },
  { dilim: 960000,         tek: 0.05,  coklu: 0.075 },
  { dilim: 1560000,        tek: 0.04,  coklu: 0.06 },
  { dilim: 3120000,        tek: 0.03,  coklu: 0.045 },
  { dilim: 9360000,        tek: 0.02,  coklu: 0.03 },
  { dilim: 12480000,       tek: 0.015, coklu: 0.025 },
  { dilim: 24960000,       tek: 0.01,  coklu: 0.015 },
  { dilim: Infinity,       tek: 0.005, coklu: 0.01 },
];

// BİRİNCİ KISIM — konusu para olmayan VEYA anlaşmama → maktu saatlik ücretler
// [2 kişi (taraf başına), 3-5 kişi, 6-10 kişi, 11+ kişi]
const ARB_MAKTU: Record<string, { iki: number; uc: number; alti: number; onbir: number; ad: string }> = {
  aile:     { iki: 1000, uc: 2200, alti: 2300, onbir: 2400, ad: "Aile Hukuku" },
  ticari:   { iki: 1500, uc: 3200, alti: 3300, onbir: 3400, ad: "Ticari Uyuşmazlık" },
  isci:     { iki: 1130, uc: 2460, alti: 2560, onbir: 2660, ad: "İşçi-İşveren" },
  tuketici: { iki: 1000, uc: 2200, alti: 2300, onbir: 2400, ad: "Tüketici" },
  kira:     { iki: 1170, uc: 2540, alti: 2640, onbir: 2740, ad: "Kira / Komşu Hakkı / Kat Mülkiyeti" },
  ortaklik: { iki: 1170, uc: 2540, alti: 2640, onbir: 2740, ad: "Ortaklığın Giderilmesi" },
  diger:    { iki: 1000, uc: 2200, alti: 2300, onbir: 2400, ad: "Diğer Uyuşmazlıklar" },
};

const ARB_MIN_ANLASMA = 9000;       // md.7/7 — anlaşma halinde genel asgari
const ARB_MIN_TICARI_ORTAK = 13000; // md.7/6 — ticari + ortaklığın giderilmesi asgari
const ARB_SERI_TICARI = 7500;       // md.7/4 — seri uyuşmazlık, ticari (her uyuşmazlık)
const ARB_SERI_DIGER = 6000;        // md.7/4 — seri uyuşmazlık, diğer (her uyuşmazlık)

function arbNispiUcret(tutar: number, coklu: boolean): number {
  let kalan = tutar, toplam = 0;
  for (const b of ARB_NISPI) {
    const d = Math.min(kalan, b.dilim);
    if (d <= 0) break;
    toplam += d * (coklu ? b.coklu : b.tek);
    kalan -= d;
    if (kalan <= 0) break;
  }
  return toplam;
}

function arbSaatlik(alanKey: string, tarafGrubu: string): number {
  const baseKey = alanKey === "kira-tahliye" || alanKey === "kira-tespiti" ? "kira" : alanKey;
  const a = ARB_MAKTU[baseKey] ?? ARB_MAKTU.diger;
  if (tarafGrubu === "iki") return a.iki * 2; // 2 kişi: ücret "taraf başına" → toplam ×2
  if (tarafGrubu === "uc") return a.uc;
  if (tarafGrubu === "alti") return a.alti;
  return a.onbir;
}

function ArabuluculukUcret() {
  const [tur, setTur] = useState("dava-sarti");
  const [alan, setAlan] = useState("isci");
  const [sonuc, setSonuc] = useState<"anlasti" | "anlasmadi">("anlasti");
  const [paraOlcu, setParaOlcu] = useState<"evet" | "hayir">("evet");
  const [tutar, setTutar] = useState("300000");
  const [yillikKira, setYillikKira] = useState("180000");
  const [tarafGrubu, setTarafGrubu] = useState("iki");
  const [saat, setSaat] = useState("2");
  const [arabulucu, setArabulucu] = useState<"tek" | "coklu">("tek");
  const [seri, setSeri] = useState(false);
  const [seriAdet, setSeriAdet] = useState("10");

  // Kira tahliye/tespiti her zaman para ile ölçülür
  const isKiraOzel = alan === "kira-tahliye" || alan === "kira-tespiti";
  const effParaOlcu = isKiraOzel ? "evet" : paraOlcu;
  const ticariVeyaOrtak = alan === "ticari" || alan === "ortaklik";

  const result = useMemo(() => {
    const coklu = arabulucu === "coklu";

    // SERİ UYUŞMAZLIK + ANLAŞMA (md.7/4)
    if (seri && sonuc === "anlasti") {
      const adet = parseInt(seriAdet) || 1;
      const birim = alan === "ticari" ? ARB_SERI_TICARI : ARB_SERI_DIGER;
      const toplam = birim * adet;
      return {
        mod: "seri" as const,
        rows: [
          ["Uyuşmazlık Başına Ücret", `${fmt(birim)} TL`],
          ["Uyuşmazlık Adedi", `${adet}`],
          ["Toplam Arabuluculuk Ücreti", `${fmt(toplam)} TL`],
        ],
        note: "Md.7/4 — Aynı taraf, bir ay içinde en az 10 başvuru = seri uyuşmazlık. Anlaşma halinde her uyuşmazlık için ticaride 7.500 TL, diğerlerinde 6.000 TL ücret uygulanır.",
      };
    }

    // ANLAŞMA + PARA İLE ÖLÇÜLEBİLİR → İKİNCİ KISIM (nispi)
    if (sonuc === "anlasti" && effParaOlcu === "evet") {
      let baz = parseFloat(tutar.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
      let bazAciklama = "Anlaşılan tutar";
      if (alan === "kira-tahliye") {
        const yk = parseFloat(yillikKira.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
        baz = yk / 2;
        bazAciklama = "Bir yıllık kira bedelinin yarısı (md.7/5)";
      } else if (alan === "kira-tespiti") {
        const yk = parseFloat(yillikKira.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
        baz = yk;
        bazAciklama = "Bir yıllık kira farkı tutarı (md.7/5)";
      }
      let ucret = arbNispiUcret(baz, coklu);
      const min = ticariVeyaOrtak ? ARB_MIN_TICARI_ORTAK : ARB_MIN_ANLASMA;
      const minUygulandi = ucret < min;
      ucret = Math.max(ucret, min);
      const tarafBasi = ucret / 2;
      return {
        mod: "nispi" as const,
        rows: [
          ["Hesaplamaya Esas Tutar", `${fmt(baz)} TL`],
          ["Esas Açıklaması", bazAciklama],
          ["Tarifeye Göre Ücret", `${fmt(arbNispiUcret(baz, coklu))} TL`],
          ...(minUygulandi ? [[`Uygulanan Asgari Ücret`, `${fmt(min)} TL`] as [string, string]] : []),
          ["Toplam Arabuluculuk Ücreti", `${fmt(ucret)} TL`],
          ["Taraf Başına (eşit bölüşüm)", `${fmt(tarafBasi)} TL`],
        ],
        note: `İkinci Kısım basamaklı nispi tarife uygulandı (${coklu ? "birden fazla arabulucu" : "tek arabulucu"}). ${ticariVeyaOrtak ? "Ticari/ortaklığın giderilmesi anlaşmasında asgari 13.000 TL." : "Anlaşma halinde asgari 9.000 TL (md.7/7)."} Ücret aksi kararlaştırılmadıkça taraflarca eşit ödenir (md.3/1).`,
      };
    }

    // ANLAŞMA + PARA İLE ÖLÇÜLEMEZ → BİRİNCİ KISIM (maktu, ama anlaşma asgarisi)
    // VEYA ANLAŞMAMA → BİRİNCİ KISIM (maktu saatlik, md.7/3)
    const saatNum = Math.max(parseFloat(saat) || 0, 0);
    const saatlik = arbSaatlik(alan, tarafGrubu);

    if (sonuc === "anlasti") {
      // para ile ölçülemeyen anlaşma — maktu × saat, ancak 9.000 TL asgari
      let ucret = saatlik * saatNum;
      const min = ticariVeyaOrtak ? ARB_MIN_TICARI_ORTAK : ARB_MIN_ANLASMA;
      const minUygulandi = ucret < min;
      ucret = Math.max(ucret, min);
      return {
        mod: "maktu-anlasma" as const,
        rows: [
          ["Saatlik Ücret", `${fmt(saatlik)} TL/saat`],
          ["Görüşme Süresi", `${fmt(saatNum, 1)} saat`],
          ["Maktu Hesap", `${fmt(saatlik * saatNum)} TL`],
          ...(minUygulandi ? [["Uygulanan Asgari Ücret", `${fmt(min)} TL`] as [string, string]] : []),
          ["Toplam Arabuluculuk Ücreti", `${fmt(ucret)} TL`],
          ["Taraf Başına", `${fmt(ucret / 2)} TL`],
        ],
        note: "Konusu para ile ölçülemeyen uyuşmazlıkta anlaşma — Birinci Kısım saatlik maktu ücret. Anlaşma halinde asgari ücret uygulanır (md.7/7).",
      };
    }

    // ANLAŞMAMA → Birinci Kısım saatlik (md.7/3)
    const toplamMaktu = saatlik * saatNum;
    if (tur === "dava-sarti") {
      // Dava şartı + anlaşmama: ilk 2 saat Adalet Bakanlığı bütçesinden (6325 md.18/A)
      const asanSaat = Math.max(0, saatNum - 2);
      const taraf = saatlik * asanSaat;
      return {
        mod: "maktu-anlasmama-dava" as const,
        rows: [
          ["Saatlik Ücret", `${fmt(saatlik)} TL/saat`],
          ["Görüşme Süresi", `${fmt(saatNum, 1)} saat`],
          ["İlk 2 Saat — Devlet Öder", `${fmt(saatlik * 2)} TL`],
          ["2 Saati Aşan — Taraflar Öder", `${fmt(taraf)} TL`],
          ["Toplam Ücret", `${fmt(saatlik * Math.max(saatNum, 2))} TL`],
        ],
        note: "Dava şartı arabuluculukta anlaşmama — Birinci Kısım saatlik maktu (md.7/3). 6325 sayılı Kanun md.18/A: taraflar anlaşamazsa ilk 2 saatlik ücret Adalet Bakanlığı bütçesinden, 2 saati aşan kısım taraflarca ödenir.",
      };
    }
    // İhtiyari + anlaşmama: tamamı taraflarca
    return {
      mod: "maktu-anlasmama-ihtiyari" as const,
      rows: [
        ["Saatlik Ücret", `${fmt(saatlik)} TL/saat`],
        ["Görüşme Süresi", `${fmt(saatNum, 1)} saat`],
        ["Toplam Arabuluculuk Ücreti", `${fmt(toplamMaktu)} TL`],
        ["Taraf Başına", `${fmt(toplamMaktu / 2)} TL`],
      ],
      note: "İhtiyari arabuluculukta anlaşmama — Birinci Kısım saatlik maktu ücret (md.7/3). Ücret taraflarca eşit ödenir.",
    };
  }, [tur, alan, sonuc, effParaOlcu, tutar, yillikKira, tarafGrubu, saat, arabulucu, seri, seriAdet, ticariVeyaOrtak]);

  // Hangi alanlarda anlaşma+para sorulacak?
  const nispiGirisGoster = sonuc === "anlasti" && effParaOlcu === "evet" && !seri;
  const maktuGirisGoster = (sonuc === "anlasmadi" || (sonuc === "anlasti" && effParaOlcu === "hayir")) && !seri;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Arabuluculuk Türü">
        <select value={tur} onChange={e => setTur(e.target.value)} className={sel}>
          <option value="dava-sarti">Dava Şartı (Zorunlu) Arabuluculuk</option>
          <option value="ihtiyari">İhtiyari Arabuluculuk</option>
        </select>
      </Field>
      <Field label="Uyuşmazlık Alanı">
        <select value={alan} onChange={e => setAlan(e.target.value)} className={sel}>
          <option value="ticari">Ticari Uyuşmazlık</option>
          <option value="isci">İşçi - İşveren</option>
          <option value="tuketici">Tüketici</option>
          <option value="aile">Aile Hukuku</option>
          <option value="kira">Kira / Komşu Hakkı / Kat Mülkiyeti</option>
          <option value="kira-tahliye">Kira — Tahliye Talepli</option>
          <option value="kira-tespiti">Kira — Tespit Talepli</option>
          <option value="ortaklik">Ortaklığın Giderilmesi</option>
          <option value="diger">Diğer Uyuşmazlıklar</option>
        </select>
      </Field>

      <Field label="Sonuç">
        <select value={sonuc} onChange={e => setSonuc(e.target.value as "anlasti" | "anlasmadi")} className={sel}>
          <option value="anlasti">Anlaşma Sağlandı</option>
          <option value="anlasmadi">Anlaşma Sağlanamadı</option>
        </select>
      </Field>
      <Field label="Arabulucu Sayısı">
        <select value={arabulucu} onChange={e => setArabulucu(e.target.value as "tek" | "coklu")} className={sel}>
          <option value="tek">Tek Arabulucu</option>
          <option value="coklu">Birden Fazla Arabulucu</option>
        </select>
      </Field>

      {!isKiraOzel && (
        <Field label="Konusu Para ile Ölçülebilir mi?">
          <select value={paraOlcu} onChange={e => setParaOlcu(e.target.value as "evet" | "hayir")} className={sel}>
            <option value="evet">Evet (alacak, tazminat vb.)</option>
            <option value="hayir">Hayır (boşanma, velayet vb.)</option>
          </select>
        </Field>
      )}

      <Field label="Seri Uyuşmazlık mı?">
        <select value={seri ? "evet" : "hayir"} onChange={e => setSeri(e.target.value === "evet")} className={sel}>
          <option value="hayir">Hayır</option>
          <option value="evet">Evet (aynı taraf, 1 ayda 10+ başvuru)</option>
        </select>
      </Field>

      {seri && sonuc === "anlasti" && (
        <Field label="Uyuşmazlık Adedi">
          <input type="number" min="10" value={seriAdet} onChange={e => setSeriAdet(e.target.value)} className={inp} />
        </Field>
      )}

      {/* Nispi giriş (anlaşma + para) */}
      {nispiGirisGoster && alan === "kira-tahliye" && (
        <Field label="Bir Yıllık Kira Bedeli (TL)">
          <input type="text" value={yillikKira} onChange={e => setYillikKira(e.target.value)} className={inp} />
        </Field>
      )}
      {nispiGirisGoster && alan === "kira-tespiti" && (
        <Field label="Yıllık Kira Farkı (TL)">
          <input type="text" value={yillikKira} onChange={e => setYillikKira(e.target.value)} className={inp} />
        </Field>
      )}
      {nispiGirisGoster && !isKiraOzel && (
        <Field label="Anlaşılan Tutar (TL)">
          <input type="text" value={tutar} onChange={e => setTutar(e.target.value)} className={inp} />
        </Field>
      )}

      {/* Maktu giriş (anlaşmama veya para ölçülemez) */}
      {maktuGirisGoster && (
        <>
          <Field label="Taraf Sayısı">
            <select value={tarafGrubu} onChange={e => setTarafGrubu(e.target.value)} className={sel}>
              <option value="iki">2 Taraf</option>
              <option value="uc">3 - 5 Taraf</option>
              <option value="alti">6 - 10 Taraf</option>
              <option value="onbir">11 ve Üzeri Taraf</option>
            </select>
          </Field>
          <Field label="Görüşme Süresi (saat)">
            <input type="number" min="0" step="0.5" value={saat} onChange={e => setSaat(e.target.value)} className={inp} />
          </Field>
        </>
      )}

      <div className="col-span-full">
        <Result rows={result.rows as [string, string][]} note={result.note} />
      </div>
    </div>
  );
}

// ─── 17. ZAMANAŞIMI KONTROLÜ ──────────────────────────────────────────────────

const ZAMANASIMI_TURLERI = [
  { label: "Haksız fiil — öğrenmeden itibaren (TBK md.72)", gun: 730, aciklama: "Zarar ve failden haberdar olma tarihinden 2 yıl; fiilin işlenmesinden 10 yıl." },
  { label: "Haksız fiil — fiilin işlenmesinden (TBK md.72)", gun: 3650, aciklama: "Fiilin işlendiği tarihten itibaren 10 yıl." },
  { label: "Sebepsiz zenginleşme — öğrenmeden (TBK md.82)", gun: 730, aciklama: "Öğrenmeden 2 yıl; genel 10 yıl." },
  { label: "Genel sözleşme zamanaşımı (TBK md.146)", gun: 3650, aciklama: "10 yıl." },
  { label: "Kira alacakları (TBK md.147/2)", gun: 1825, aciklama: "5 yıl." },
  { label: "Ücret alacakları (TBK md.147/5)", gun: 1825, aciklama: "5 yıl." },
  { label: "Tüketici davaları (TKHK md.82)", gun: 1095, aciklama: "3 yıl." },
  { label: "Çek davası — ibrazdan (5941 md.)", gun: 1095, aciklama: "İbraz tarihinden 3 yıl." },
  { label: "İş hukuku ücret alacağı (İş K. md.32)", gun: 1825, aciklama: "5 yıl." },
  { label: "Kıdem tazminatı (İK md.32)", gun: 1825, aciklama: "5 yıl." },
  { label: "Ölümlü/yaralamalı trafik kazası (TCK)", gun: 3650, aciklama: "Haksız fiil — 10 yıl." },
];

function ZamanAsimiKontrol() {
  const [turIdx, setTurIdx] = useState(0);
  const [olay, setOlay] = useState("2022-01-01");
  const [kesinti, setKesinti] = useState("");

  const result = useMemo(() => {
    const tur = ZAMANASIMI_TURLERI[turIdx];
    const base = new Date(olay);
    if (isNaN(base.getTime())) return null;
    const bitis = addDays(base, tur.gun);
    const bugun = new Date();
    const kalan = daysBetween(bugun, bitis);
    const doldu = bugun >= bitis;
    let kesintiTarih: Date | null = null;
    let kesintiSonrasi: Date | null = null;
    if (kesinti) {
      kesintiTarih = new Date(kesinti);
      if (!isNaN(kesintiTarih.getTime())) {
        kesintiSonrasi = addDays(kesintiTarih, tur.gun);
      }
    }
    return { bitis, kalan, doldu, tur, kesintiSonrasi };
  }, [turIdx, olay, kesinti]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Uyuşmazlık Türü">
        <select value={turIdx} onChange={e => setTurIdx(parseInt(e.target.value))} className={sel}>
          {ZAMANASIMI_TURLERI.map((t, i) => (
            <option key={i} value={i}>{t.label}</option>
          ))}
        </select>
      </Field>
      <Field label="Hak Doğuran Olay Tarihi">
        <input type="date" value={olay} onChange={e => setOlay(e.target.value)} className={inp} />
      </Field>
      <Field label="Zamanaşımı Kesinti Tarihi (opsiyonel)">
        <input type="date" value={kesinti} onChange={e => setKesinti(e.target.value)} className={inp} placeholder="İhtar / dava / icra" />
      </Field>

      {result && (
        <div className="md:col-span-2">
          <Result
            rows={[
              ["Süre", `${result.tur.gun} gün (${(result.tur.gun / 365).toFixed(0)} yıl)`],
              ["Zamanaşımı Dolum Tarihi", fmtDate(result.bitis)],
              result.doldu
                ? ["Durum", "⚠️ Zamanaşımı dolmuştur"]
                : ["Kalan Süre", `${result.kalan} gün`],
              ...(result.kesintiSonrasi
                ? [["Kesintiden Sonra Yeni Son Tarih", fmtDate(result.kesintiSonrasi)] as [string, string]]
                : []),
            ]}
            note={result.tur.aciklama + " Zamanaşımı; dava açılması, icra takibi, noter ihtarı veya borçlunun kabulüyle kesilir/durur (TBK md.153–161)."}
          />
        </div>
      )}
    </div>
  );
}

// ─── 18. DAVA RİSK ANALİZİ ───────────────────────────────────────────────────

function DavaRiskAnalizi() {
  const [davaD, setDavaD] = useState("200000");
  const [bilirkisi, setBilirkisi] = useState(false);
  const [kesif, setKesif] = useState(false);
  const [tanik, setTanik] = useState(false);
  const [kanit, setKanit] = useState("kuvvetli");
  const [sure, setSure] = useState("orta");

  const result = useMemo(() => {
    const d = parseFloat(davaD.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    // Maliyet tahmini
    let maliyet = nispiVekalet(d); // vekalet ücreti
    maliyet += d * 0.0068; // harç
    maliyet += 680; // başvuru harcı
    if (bilirkisi) maliyet += 4000;
    if (kesif) maliyet += 3000;
    if (tanik) maliyet += 1000;
    // Kayıp riski: karşı taraf lehine vekalet
    const karsıVekalet = nispiVekalet(d);
    // Başarı tahmini
    let basariPuan = 50;
    if (kanit === "kuvvetli") basariPuan = 75;
    if (kanit === "zayif") basariPuan = 30;
    if (kanit === "belirsiz") basariPuan = 45;
    // Süre etkisi
    const sureAy = sure === "kisa" ? "6–12 ay" : sure === "orta" ? "1–2 yıl" : "2–4 yıl";
    return { maliyet, karsıVekalet, basariPuan, sureAy };
  }, [davaD, bilirkisi, kesif, tanik, kanit, sure]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Dava Değeri (TL)">
        <input type="text" value={davaD} onChange={e => setDavaD(e.target.value)} className={inp} />
      </Field>
      <Field label="Delil Gücü">
        <select value={kanit} onChange={e => setKanit(e.target.value)} className={sel}>
          <option value="kuvvetli">Kuvvetli (belge, sözleşme, kayıt)</option>
          <option value="belirsiz">Orta (karışık delil)</option>
          <option value="zayif">Zayıf (tanık ağırlıklı)</option>
        </select>
      </Field>
      <Field label="Tahmini Dava Süresi">
        <select value={sure} onChange={e => setSure(e.target.value)} className={sel}>
          <option value="kisa">Kısa (basit alacak, sulh)</option>
          <option value="orta">Orta (asliye, iş)</option>
          <option value="uzun">Uzun (ticaret, mülkiyet)</option>
        </select>
      </Field>
      <Field label="Bilirkişi Gerekir mi?">
        <select value={bilirkisi ? "evet" : "hayir"} onChange={e => setBilirkisi(e.target.value === "evet")} className={sel}>
          <option value="hayir">Hayır</option>
          <option value="evet">Evet</option>
        </select>
      </Field>
      <Field label="Keşif Yapılacak mı?">
        <select value={kesif ? "evet" : "hayir"} onChange={e => setKesif(e.target.value === "evet")} className={sel}>
          <option value="hayir">Hayır</option>
          <option value="evet">Evet</option>
        </select>
      </Field>
      <Field label="Tanık Dinletilecek mi?">
        <select value={tanik ? "evet" : "hayir"} onChange={e => setTanik(e.target.value === "evet")} className={sel}>
          <option value="hayir">Hayır</option>
          <option value="evet">Evet</option>
        </select>
      </Field>
      <div className="col-span-full">
        <Result
          rows={[
            ["Tahmini Dava Maliyeti", `${fmt(result.maliyet)} TL`],
            ["Kaybedilirse Karşı Taraf Vekalet Riski", `${fmt(result.karsıVekalet)} TL`],
            ["Toplam Finansal Risk (kayıp halinde)", `${fmt(result.maliyet + result.karsıVekalet)} TL`],
            ["Tahmini Başarı Olasılığı", `%${result.basariPuan} (delil gücüne göre kaba tahmin)`],
            ["Tahmini Yargılama Süresi", result.sureAy],
          ]}
          note="Bu analiz; dava masrafları ve delil gücüne dayalı genel bir risk çerçevesidir. Gerçek başarı olasılığı davaya özgü hukuki ve fiili duruma bağlıdır. Karar almadan önce avukatınıza danışın."
        />
      </div>
    </div>
  );
}

// ─── ARAÇLAR LİSTESİ ──────────────────────────────────────────────────────────

const ARACLAR = [
  { id: "kidem", icon: "💼", baslik: "Kıdem Tazminatı", tag: "İş Hukuku", comp: <KidemTazminati /> },
  { id: "ihbar", icon: "📋", baslik: "İhbar Tazminatı", tag: "İş Hukuku", comp: <IhbarTazminati /> },
  { id: "fazla-mesai", icon: "⏰", baslik: "Fazla Mesai Ücreti", tag: "İş Hukuku", comp: <FazlaMesai /> },
  { id: "yillik-izin", icon: "🏖️", baslik: "Yıllık İzin Ücreti", tag: "İş Hukuku", comp: <YillikIzin /> },
  { id: "smm", icon: "🧾", baslik: "Serbest Meslek Makbuzu (SMM)", tag: "İş Hukuku", comp: <SmmHesaplama /> },
  { id: "nafaka", icon: "👨‍👩‍👧", baslik: "Nafaka Artış Hesabı", tag: "Aile Hukuku", comp: <NafakaArtisi /> },
  { id: "iddet", icon: "📅", baslik: "İddet Müddeti Hesabı", tag: "Aile Hukuku", comp: <IddetMuddeti /> },
  { id: "faiz", icon: "📊", baslik: "Faiz Hesaplama (Yasal / Ticari / Avans)", tag: "Alacak", comp: <FaizHesaplama /> },
  { id: "icra-kapak", icon: "📁", baslik: "İcra Dosyası Kapak Hesabı", tag: "Alacak", comp: <IcraKapakHesabi /> },
  { id: "inkar-tazminati", icon: "⚖️", baslik: "İcra İnkâr Tazminatı", tag: "Alacak", comp: <IcraInkarTazminati /> },
  { id: "kira", icon: "🏠", baslik: "Kira Artış Oranı", tag: "Gayrimenkul", comp: <KiraArtis /> },
  { id: "tapu", icon: "📋", baslik: "Tapu Harcı Hesaplama", tag: "Gayrimenkul", comp: <TapuHarci /> },
  { id: "arac-deger-kaybi", icon: "🚗", baslik: "Araç Değer Kaybı Analizi", tag: "Sigorta", comp: <AracDegerKaybi /> },
  { id: "vekalet", icon: "⚖️", baslik: "Nispi Vekalet Ücreti (AAÜT)", tag: "Dava Masrafı", comp: <NispiVekalet /> },
  { id: "dava-harci", icon: "🏛️", baslik: "Dava Açma Harcı ve Gider Avansı", tag: "Dava Masrafı", comp: <DavaAcmaHarci /> },
  { id: "arabuluculuk", icon: "🤝", baslik: "Arabuluculuk Asgari Ücret", tag: "Dava Masrafı", comp: <ArabuluculukUcret /> },
  { id: "zamanasimi", icon: "⏱️", baslik: "Zamanaşımı Kontrol Sihirbazı", tag: "Usul", comp: <ZamanAsimiKontrol /> },
  { id: "risk", icon: "🔍", baslik: "Dava Risk ve Maliyet Analizi", tag: "Analiz", comp: <DavaRiskAnalizi /> },
];

// ─── SAYFA ─────────────────────────────────────────────────────────────────────

export default function HesaplamaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 sm:pt-32 md:pt-36 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {/* Hero */}
          <div className="mb-10 sm:mb-16">
            <p className="text-accent font-mono text-[10px] sm:text-[11px] tracking-widest uppercase mb-3 sm:mb-4">
              Hukuki Hesaplama Araçları
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-3 sm:mb-5 leading-tight">
              Doğru Hesap,{" "}
              <span className="font-drama italic text-accent">Güçlü Pozisyon.</span>
            </h1>
            <p className="text-charcoal/55 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
              Kıdem tazminatından faize, tapu harcından vekalet ücretine — güncel mevzuat
              esas alınarak hazırlanmış {ARACLAR.length} hesaplama aracı.
            </p>
            <p className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-[10px] sm:text-[11px] text-charcoal/35 font-mono bg-charcoal/4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              <Info size={11} />
              Hesaplamalar bilgi amaçlıdır · Kesin sonuç için avukatınıza danışın
            </p>
          </div>

          {/* Araçlar */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {ARACLAR.map(a => (
              <Card key={a.id} id={a.id} icon={a.icon} title={a.baslik} tag={a.tag}>
                {a.comp}
              </Card>
            ))}
          </div>

          {/* Alt CTA */}
          <div className="mt-10 sm:mt-16 bg-charcoal rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-cream mb-2 sm:mb-3">
              Hesaplamanın Ötesine Mi İhtiyacınız Var?
            </h3>
            <p className="text-cream/55 mb-5 sm:mb-6 text-sm leading-relaxed max-w-md mx-auto">
              Hesaplama araçları genel bilgi verir. Davanızı tartışmak için avukata danışın.
            </p>
            <Link
              href="/#iletisim"
              className="inline-block bg-accent text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm hover:bg-accent/90 transition-colors"
            >
              Danışmanlık İçin İletişime Geçin
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
