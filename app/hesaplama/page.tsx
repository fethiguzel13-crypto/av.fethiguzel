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
    <div id={id} className="bg-white border border-charcoal/6 rounded-[2rem] overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-7 text-left hover:bg-charcoal/2 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">{icon}</span>
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${TAG_COLORS[tag] ?? "bg-charcoal/5 text-charcoal/40"}`}>
              {tag}
            </span>
            <h2 className="text-lg font-heading font-bold text-charcoal mt-1">{title}</h2>
          </div>
        </div>
        {open ? <ChevronUp size={20} className="text-charcoal/30 shrink-0" /> : <ChevronDown size={20} className="text-charcoal/30 shrink-0" />}
      </button>
      {open && (
        <div className="px-7 pb-8 border-t border-charcoal/5 pt-6">
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

const inp = "border border-charcoal/15 rounded-xl px-4 py-2.5 text-charcoal text-sm focus:outline-none focus:border-accent transition-colors bg-cream/60";
const sel = inp + " cursor-pointer";

function Result({ rows, note }: { rows: [string, string][]; note?: string }) {
  return (
    <div className="mt-6 bg-primary/5 border border-primary/10 rounded-2xl p-5">
      <div className="divide-y divide-charcoal/8">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
            <span className="text-sm text-charcoal/60">{k}</span>
            <span className="text-sm font-bold text-charcoal">{v}</span>
          </div>
        ))}
      </div>
      {note && (
        <p className="mt-4 flex items-start gap-2 text-[11px] text-charcoal/40 leading-relaxed">
          <Info size={12} className="shrink-0 mt-0.5" />
          {note}
        </p>
      )}
    </div>
  );
}

// ─── 1. KIDEM TAZMİNATI ────────────────────────────────────────────────────────

function KidemTazminati() {
  // Kıdem tazminatı tavanı — her 6 ayda Resmi Gazete'de güncellenir
  const TAVAN_2024_II = 47268.37; // 01.07.2024–31.12.2024
  const [baslangic, setBaslangic] = useState("2015-01-01");
  const [bitis, setBitis] = useState(() => new Date().toISOString().slice(0, 10));
  const [brutUcret, setBrutUcret] = useState("50000");
  const [ozelTavan, setOzelTavan] = useState("");

  const result = useMemo(() => {
    const b = new Date(baslangic);
    const e = new Date(bitis);
    if (isNaN(b.getTime()) || isNaN(e.getTime()) || e <= b) return null;
    const gun = daysBetween(b, e);
    const yil = gun / 365;
    const brutNum = parseFloat(brutUcret.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const tavanNum = ozelTavan ? parseFloat(ozelTavan.replace(/[^0-9.,]/g, "").replace(",", ".")) : TAVAN_2024_II;
    const gunlukBrut = brutNum / 30;
    const gunlukTavan = tavanNum / 30;
    const esas = Math.min(gunlukBrut, gunlukTavan);
    const brutKidem = esas * 30 * yil;
    const damagaVergi = brutKidem * 0.00759; // damga vergisi ‰7,59
    const netKidem = brutKidem - damagaVergi;
    const tam = Math.floor(yil);
    const kistGun = gun - tam * 365;
    return { brutKidem, damagaVergi, netKidem, yil, tam, kistGun, esas, gunlukBrut };
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
        <input type="text" value={brutUcret} onChange={e => setBrutUcret(e.target.value)} placeholder="50.000" className={inp} />
      </Field>
      <Field label="Kıdem Tazminatı Tavanı (TL) — opsiyonel">
        <input
          type="text"
          value={ozelTavan}
          onChange={e => setOzelTavan(e.target.value)}
          placeholder={`Varsayılan: ${fmt(TAVAN_2024_II)} (2024/II)`}
          className={inp}
        />
      </Field>

      {result ? (
        <div className="md:col-span-2">
          <Result
            rows={[
              ["Toplam Çalışma Süresi", `${result.tam} tam yıl + ${result.kistGun} gün (${fmt(result.yil, 4)} yıl)`],
              ["Esas Alınan Günlük Ücret", `${fmt(result.esas)} TL (brüt günlük: ${fmt(result.gunlukBrut)} TL)`],
              ["Brüt Kıdem Tazminatı", `${fmt(result.brutKidem)} TL`],
              ["Damga Vergisi (‰7,59)", `${fmt(result.damagaVergi)} TL`],
              ["Net Kıdem Tazminatı", `${fmt(result.netKidem)} TL`],
            ]}
            note="Kıdem tazminatı tavanı her 6 ayda Resmi Gazete'de yayımlanır. 2024/II dönemi tavanı 47.268,37 TL'dir. Net hesaplamada yalnızca damga vergisi kesilir; SGK ve gelir vergisi kesintisi yapılmaz."
          />
        </div>
      ) : (
        <div className="md:col-span-2 text-sm text-charcoal/35 italic">Tarihleri ve ücreti girin.</div>
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
      <div className="md:col-span-2">
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
      <div className="md:col-span-2">
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
  { etiket: "Yasal Faiz (3095 md.1) — 2009–güncel", oran: 9.00 },
  { etiket: "Ticari Avans Faizi — 2024 (approx.)", oran: 52.0 },
  { etiket: "Yasal Faiz — 2006–2008", oran: 19.0 },
  { etiket: "Yasal Faiz — 2004–2005", oran: 28.0 },
  { etiket: "Yasal Faiz — 2003", oran: 50.0 },
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
        <div className="md:col-span-2">
          <Result
            rows={[
              ["Süre", `${result.gun} gün`],
              ["Yıllık Faiz Oranı", `%${fmt(result.oran, 2)}`],
              ["Faiz Miktarı", `${fmt(result.faizMiktari)} TL`],
              ["Anapara + Faiz", `${fmt(result.toplam)} TL`],
            ]}
            note="3095 sayılı Kanun md.1 uyarınca yasal faiz %9'dur. Ticari borçlarda Merkez Bankası kısa vadeli faiz oranları esas alınır ve yılda iki kez güncellenebilir."
          />
        </div>
      ) : (
        <div className="md:col-span-2 text-sm text-charcoal/35 italic">Bilgileri doldurun.</div>
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
        <div className="md:col-span-2">
          <Result
            rows={[
              ["Hasar Oranı (H/R)", `%${fmt(result.hasarOrani * 100, 2)}`],
              ["Tahmini Değer Kaybı Aralığı", `${fmt(result.min)} TL — ${fmt(result.max)} TL`],
            ]}
            note="Bu hesaplama Yargıtay içtihatlarına dayalı genel bir tahminden ibarettir. Mahkemelerde fiilen uygulanacak değer, bilirkişi tespiti, sigorta genel şartları ve aracın özel durumuna göre değişir."
          />
        </div>
      ) : (
        <div className="md:col-span-2 text-sm text-charcoal/35 italic">Bilgileri doldurun.</div>
      )}
    </div>
  );
}

// ─── 11. TAPU HARCI ───────────────────────────────────────────────────────────

function TapuHarci() {
  const [deger, setDeger] = useState("2000000");
  const DÖNER = 1500; // 2024 yaklaşık döner sermaye

  const result = useMemo(() => {
    const d = parseFloat(deger.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const alici = d * 0.02;
    const satici = d * 0.02;
    const toplam = alici + satici + DÖNER;
    return { alici, satici, toplam };
  }, [deger]);

  return (
    <div className="grid grid-cols-1 gap-5">
      <Field label="Beyan Edilen Satış Bedeli (TL)">
        <input type="text" value={deger} onChange={e => setDeger(e.target.value)} className={inp} />
      </Field>
      <Result
        rows={[
          ["Alıcı Harcı (%2)", `${fmt(result.alici)} TL`],
          ["Satıcı Harcı (%2)", `${fmt(result.satici)} TL`],
          ["Döner Sermaye (approx.)", `${fmt(DÖNER, 0)} TL`],
          ["Toplam Maliyet", `${fmt(result.toplam)} TL`],
        ]}
        note="Harçlar Kanunu md.492/5 uyarınca alıcı ve satıcı ayrı ayrı %2 harç öder. Gerçek bedel esas alınır; beyan edilen bedel emsalin altında olamaz. Döner sermaye tutarı yıllık güncellenir."
      />
    </div>
  );
}

// ─── 12. NİSPİ VEKALET ÜCRETİ ─────────────────────────────────────────────────

// 2024 AAÜT md.13 basamakları (yaklaşık)
const AAUT_BASAMAKLAR = [
  { limit: 16000, oran: 0.25 },
  { limit: 46000, oran: 0.20 },
  { limit: 92000, oran: 0.17 },
  { limit: 460000, oran: 0.15 },
  { limit: 920000, oran: 0.13 },
  { limit: 2300000, oran: 0.11 },
  { limit: 4600000, oran: 0.09 },
  { limit: 23000000, oran: 0.07 },
  { limit: 92000000, oran: 0.05 },
  { limit: Infinity, oran: 0.03 },
];
const AAUT_MIN = 8500; // 2024 min. maktu vekalet ücreti

function nispiVekalet(dava: number): number {
  let kalan = dava;
  let toplam = 0;
  let onceki = 0;
  for (const b of AAUT_BASAMAKLAR) {
    const dilimdeki = Math.min(kalan, b.limit - onceki);
    if (dilimdeki <= 0) break;
    toplam += dilimdeki * b.oran;
    kalan -= dilimdeki;
    onceki = b.limit;
    if (kalan <= 0) break;
  }
  return Math.max(toplam, AAUT_MIN);
}

function NispiVekalet() {
  const [davaD, setDavaD] = useState("500000");

  const result = useMemo(() => {
    const d = parseFloat(davaD.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const vekalet = nispiVekalet(d);
    return { vekalet };
  }, [davaD]);

  return (
    <div className="grid grid-cols-1 gap-5">
      <Field label="Dava Değeri / Müddeabih (TL)">
        <input type="text" value={davaD} onChange={e => setDavaD(e.target.value)} className={inp} />
      </Field>
      <Result
        rows={[
          ["Karşı Taraf Vekalet Ücreti", `${fmt(result.vekalet)} TL`],
        ]}
        note="2024 AAÜT md.13 basamaklı oranlar (yaklaşık). Minimum maktu vekalet ücreti 8.500 TL'dir. Gerçek tutar için güncel Avukatlık Asgari Ücret Tarifesini kontrol edin."
      />
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
      <div className="md:col-span-2">
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

// ─── 16. ARABULUCULUK ASGARİ ÜCRET ───────────────────────────────────────────

// 2024 Arabuluculuk Asgari Ücret Tarifesi (yaklaşık)
const ARABULUCULUK_BASAMAKLAR = [
  { limit: 40000, oran: 0.06 },
  { limit: 120000, oran: 0.05 },
  { limit: 400000, oran: 0.04 },
  { limit: 1000000, oran: 0.03 },
  { limit: Infinity, oran: 0.02 },
];
const ARABULUCULUK_MIN_ANLAŞMAZ = 2500; // min. anlaşamama hali
const ARABULUCULUK_MIN_ANLAŞMA = 5000;  // min. anlaşma hali

function ArabuluculukUcret() {
  const [tur, setTur] = useState("ihtiyari");
  const [davaD, setDavaD] = useState("200000");
  const [anlasma, setAnlasma] = useState("anlasmadi");
  const [tarafSayisi, setTarafSayisi] = useState("2");

  const result = useMemo(() => {
    const d = parseFloat(davaD.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const taraf = parseInt(tarafSayisi) || 2;

    let ucret = 0;
    let kalan = d;
    let prev = 0;
    for (const b of ARABULUCULUK_BASAMAKLAR) {
      const dilimdeki = Math.min(kalan, b.limit - prev);
      if (dilimdeki <= 0) break;
      ucret += dilimdeki * b.oran;
      kalan -= dilimdeki;
      prev = b.limit;
      if (kalan <= 0) break;
    }

    const min = anlasma === "anlasti" ? ARABULUCULUK_MIN_ANLAŞMA : ARABULUCULUK_MIN_ANLAŞMAZ;
    ucret = Math.max(ucret, min);

    if (tur === "dava-sarti" && anlasma === "anlasmadi") {
      // dava şartında anlaşamama → Bakanlık öder 2 saatlik ücret (~2.500 TL)
      const devletOdeyecek = Math.min(ucret, ARABULUCULUK_MIN_ANLAŞMAZ);
      const tarafOdeyecek = Math.max(0, ucret - devletOdeyecek);
      return { ucret, devletOdeyecek, tarafOdeyecek, tarafBasi: tarafOdeyecek / taraf, anlasma };
    }

    return { ucret, devletOdeyecek: 0, tarafOdeyecek: ucret, tarafBasi: ucret / taraf, anlasma };
  }, [tur, davaD, anlasma, tarafSayisi]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Arabuluculuk Türü">
        <select value={tur} onChange={e => setTur(e.target.value)} className={sel}>
          <option value="ihtiyari">İhtiyari Arabuluculuk</option>
          <option value="dava-sarti">Dava Şartı Arabuluculuk</option>
        </select>
      </Field>
      <Field label="Uyuşmazlık Değeri (TL)">
        <input type="text" value={davaD} onChange={e => setDavaD(e.target.value)} className={inp} />
      </Field>
      <Field label="Sonuç">
        <select value={anlasma} onChange={e => setAnlasma(e.target.value)} className={sel}>
          <option value="anlasti">Anlaşma sağlandı</option>
          <option value="anlasmadi">Anlaşma sağlanamadı</option>
        </select>
      </Field>
      <Field label="Taraf Sayısı">
        <input type="number" min="2" value={tarafSayisi} onChange={e => setTarafSayisi(e.target.value)} className={inp} />
      </Field>
      <div className="md:col-span-2">
        <Result
          rows={[
            ["Toplam Arabuluculuk Ücreti", `${fmt(result.ucret)} TL`],
            ["Devlet Ödeyecek (dava şartı/anlaşamama)", `${fmt(result.devletOdeyecek)} TL`],
            ["Taraflarca Ödenecek", `${fmt(result.tarafOdeyecek)} TL`],
            ["Taraf Başına Düşen", `${fmt(result.tarafBasi)} TL`],
          ]}
          note="2024 Arabuluculuk Asgari Ücret Tarifesi (yaklaşık). Dava şartı arabuluculukta anlaşamama halinde 2 saatlik ücret Adalet Bakanlığı bütçesinden ödenir. Kesin tutar için güncel tarifeyi inceleyin."
        />
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
      <div className="md:col-span-2">
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
      <main className="min-h-screen bg-cream pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Hero */}
          <div className="mb-16">
            <p className="text-accent font-mono text-[11px] tracking-widest uppercase mb-4">
              Hukuki Hesaplama Araçları
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-5">
              Doğru Hesap,{" "}
              <span className="font-drama italic text-accent">Güçlü Pozisyon.</span>
            </h1>
            <p className="text-charcoal/55 text-lg max-w-2xl leading-relaxed">
              Kıdem tazminatından faize, tapu harcından vekalet ücretine — güncel mevzuat
              esas alınarak hazırlanmış {ARACLAR.length} hesaplama aracı. Her araç anlık sonuç verir.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-[11px] text-charcoal/35 font-mono bg-charcoal/4 px-4 py-2 rounded-full">
              <Info size={12} />
              Hesaplamalar bilgi amaçlıdır · Kesin sonuç için avukatınıza danışın
            </p>
          </div>

          {/* Araçlar */}
          <div className="flex flex-col gap-4">
            {ARACLAR.map(a => (
              <Card key={a.id} id={a.id} icon={a.icon} title={a.baslik} tag={a.tag}>
                {a.comp}
              </Card>
            ))}
          </div>

          {/* Alt CTA */}
          <div className="mt-16 bg-charcoal rounded-[2.5rem] p-10 text-center">
            <h3 className="text-2xl font-bold text-cream mb-3">
              Hesaplamanın Ötesine Mi İhtiyacınız Var?
            </h3>
            <p className="text-cream/55 mb-6 text-sm leading-relaxed max-w-md mx-auto">
              Hesaplama araçları genel bilgi verir. Davanızı tartışmak için avukata danışın.
            </p>
            <Link
              href="/#iletisim"
              className="inline-block bg-accent text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-accent/90 transition-colors"
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
