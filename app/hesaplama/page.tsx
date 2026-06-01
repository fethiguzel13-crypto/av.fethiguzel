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
    "Miras Hukuku": "bg-indigo-50 text-indigo-700",
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

function KidemIhbarTazminati() {
  // Kıdem tazminatı tavanı — her 6 ayda Resmi Gazete'de güncellenir
  const TAVAN_2026_I = 64948.77; // 01.01.2026–30.06.2026
  const [baslangic, setBaslangic] = useState("2015-01-01");
  const [bitis, setBitis] = useState(() => new Date().toISOString().slice(0, 10));
  const [maas, setMaas] = useState("60000");
  const [yemekYol, setYemekYol] = useState("0");
  const [ikramiye, setIkramiye] = useState("0");
  const [digerYillik, setDigerYillik] = useState("0");
  const [kumulatifMatrah, setKumulatifMatrah] = useState("0");
  const [ozelTavan, setOzelTavan] = useState("");

  const result = useMemo(() => {
    const b = new Date(baslangic);
    const e = new Date(bitis);
    if (isNaN(b.getTime()) || isNaN(e.getTime()) || e <= b) return null;
    const num = (s: string) => parseFloat(s.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const gun = daysBetween(b, e);
    const yil = gun / 365;
    const tam = Math.floor(yil);
    const kistGun = gun - tam * 365;

    // Giydirilmiş brüt ücret = maaş + yemek/yol + ikramiye/12 + diğer yıllık/12
    const giydirilmisAylik = num(maas) + num(yemekYol) + num(ikramiye) / 12 + num(digerYillik) / 12;
    const gunlukGiydirilmis = giydirilmisAylik / 30;

    // ── KIDEM (tavana tabi, gelir vergisinden muaf) ──
    const tavanNum = ozelTavan ? num(ozelTavan) : TAVAN_2026_I;
    const gunlukTavan = tavanNum / 30;
    const esasKidem = Math.min(gunlukGiydirilmis, gunlukTavan);
    const tavanAsildi = gunlukGiydirilmis > gunlukTavan;
    const brutKidem = esasKidem * 30 * yil;
    const damgaKidem = brutKidem * 0.00759;
    const netKidem = brutKidem - damgaKidem;

    // ── İHBAR (tavansız, gelir vergisine tabi) ──
    let hafta = 2;
    if (yil >= 0.5 && yil < 1.5) hafta = 4;
    else if (yil >= 1.5 && yil < 3) hafta = 6;
    else if (yil >= 3) hafta = 8;
    const brutIhbar = gunlukGiydirilmis * hafta * 7;
    const gvIhbar = hesaplaGelirVergisi(num(kumulatifMatrah), brutIhbar);
    const damgaIhbar = brutIhbar * 0.00759;
    const netIhbar = brutIhbar - gvIhbar - damgaIhbar;

    return {
      yil, tam, kistGun, giydirilmisAylik, gunlukGiydirilmis,
      esasKidem, tavanAsildi, tavanNum, brutKidem, damgaKidem, netKidem,
      hafta, brutIhbar, gvIhbar, damgaIhbar, netIhbar,
    };
  }, [baslangic, bitis, maas, yemekYol, ikramiye, digerYillik, kumulatifMatrah, ozelTavan]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="İşe Giriş Tarihi">
        <input type="date" value={baslangic} onChange={e => setBaslangic(e.target.value)} className={inp} />
      </Field>
      <Field label="İşten Ayrılış Tarihi">
        <input type="date" value={bitis} onChange={e => setBitis(e.target.value)} className={inp} />
      </Field>
      <Field label="Aylık Brüt Maaş (TL)">
        <input type="text" value={maas} onChange={e => setMaas(e.target.value)} placeholder="60.000" className={inp} />
      </Field>
      <Field label="Aylık Brüt Yemek ve Yol (TL)">
        <input type="text" value={yemekYol} onChange={e => setYemekYol(e.target.value)} className={inp} />
      </Field>
      <Field label="Yıllık Brüt İkramiye (TL)">
        <input type="text" value={ikramiye} onChange={e => setIkramiye(e.target.value)} className={inp} />
      </Field>
      <Field label="Diğer Yıllık Brüt Kazanç (TL)">
        <input type="text" value={digerYillik} onChange={e => setDigerYillik(e.target.value)} className={inp} />
      </Field>
      <Field label="Kümüle Gelir Vergisi Matrahı (TL)">
        <input type="text" value={kumulatifMatrah} onChange={e => setKumulatifMatrah(e.target.value)} placeholder="İhbar gelir vergisi için" className={inp} />
      </Field>
      <Field label="Kıdem Tavanı (TL) — opsiyonel">
        <input type="text" value={ozelTavan} onChange={e => setOzelTavan(e.target.value)} placeholder={`Varsayılan: ${fmt(TAVAN_2026_I)} (2026/I)`} className={inp} />
      </Field>

      {result ? (
        <div className="col-span-full flex flex-col gap-4">
          <div>
            <div className="mb-2 text-[11px] font-mono uppercase tracking-widest text-accent">Giydirilmiş Ücret & Süre</div>
            <Result
              rows={[
                ["Toplam Çalışma Süresi", `${result.tam} tam yıl + ${result.kistGun} gün (${fmt(result.yil, 4)} yıl)`],
                ["Giydirilmiş Aylık Brüt Ücret", `${fmt(result.giydirilmisAylik)} TL`],
                ["Giydirilmiş Günlük Brüt Ücret", `${fmt(result.gunlukGiydirilmis)} TL`],
              ]}
              note="Giydirilmiş brüt ücret = aylık brüt maaş + aylık brüt yemek/yol + (yıllık ikramiye ÷ 12) + (diğer yıllık brüt kazanç ÷ 12). Kıdem ve ihbar tazminatı bu giydirilmiş ücret üzerinden hesaplanır (Yargıtay yerleşik içtihadı)."
            />
          </div>
          <div>
            <div className="mb-2 text-[11px] font-mono uppercase tracking-widest text-accent">Kıdem Tazminatı</div>
            <Result
              rows={[
                ["Esas Alınan Günlük Ücret", `${fmt(result.esasKidem)} TL`],
                ...(result.tavanAsildi ? [["Tavan Uygulandı", `Giydirilmiş ücret tavanı (${fmt(result.tavanNum)} TL) aştı`] as [string, string]] : []),
                ["Brüt Kıdem Tazminatı", `${fmt(result.brutKidem)} TL`],
                ["Damga Vergisi (‰7,59)", `− ${fmt(result.damgaKidem)} TL`],
                ["Net Kıdem Tazminatı", `${fmt(result.netKidem)} TL`],
              ]}
              note="2026/I dönemi (01.01–30.06.2026) kıdem tavanı 64.948,77 TL'dir; giydirilmiş aylık ücret tavanı aşarsa hesap tavandan yapılır. Her tam yıl için 30 günlük giydirilmiş ücret + artan süre için kıst hesap. Kıdem tazminatından yalnızca damga vergisi (‰7,59) kesilir; SGK primi ve gelir vergisi kesilmez."
            />
          </div>
          <div>
            <div className="mb-2 text-[11px] font-mono uppercase tracking-widest text-accent">İhbar Tazminatı</div>
            <Result
              rows={[
                ["Bildirim Süresi", `${result.hafta} hafta (${result.hafta * 7} gün)`],
                ["Brüt İhbar Tazminatı", `${fmt(result.brutIhbar)} TL`],
                ["Gelir Vergisi", `− ${fmt(result.gvIhbar)} TL`],
                ["Damga Vergisi (‰7,59)", `− ${fmt(result.damgaIhbar)} TL`],
                ["Net İhbar Tazminatı", `${fmt(result.netIhbar)} TL`],
              ]}
              note="İhbar süresi (İş K. md.17): 0–6 ay 2 hafta · 6 ay–1,5 yıl 4 hafta · 1,5–3 yıl 6 hafta · 3+ yıl 8 hafta. İhbar tazminatı giydirilmiş ücret üzerinden, TAVANSIZ hesaplanır. İhbar tazminatından gelir vergisi (kümüle matrah dilimine göre) ve damga vergisi (‰7,59) kesilir; SGK primi kesilmez."
            />
          </div>
        </div>
      ) : (
        <div className="col-span-full text-sm text-charcoal/35 italic">Tarihleri ve ücret bilgilerini girin.</div>
      )}
    </div>
  );
}

// ─── 2. İHBAR TAZMİNATI ───────────────────────────────────────────────────────

// 2026 Gelir Vergisi Dilimleri (ücret gelirleri)
const GELIR_VERGISI_DILIMLERI = [
  { ust: 190000, oran: 0.15 },
  { ust: 400000, oran: 0.20 },
  { ust: 1500000, oran: 0.27 },
  { ust: 5300000, oran: 0.35 },
  { ust: Infinity, oran: 0.40 },
];

function hesaplaGelirVergisi(kumulatifMatrah: number, ekGelir: number): number {
  // Kümülatif matraha eklenen gelir üzerindeki vergiyi hesaplar (dilim geçişlerini dikkate alarak)
  const oncekiVergi = gelirVergisiTopla(kumulatifMatrah);
  const sonrakiVergi = gelirVergisiTopla(kumulatifMatrah + ekGelir);
  return sonrakiVergi - oncekiVergi;
}

function gelirVergisiTopla(matrah: number): number {
  let toplam = 0;
  let kalan = matrah;
  let oncekiUst = 0;
  for (const d of GELIR_VERGISI_DILIMLERI) {
    const dilimGenisligi = d.ust - oncekiUst;
    const dilimdeki = Math.min(kalan, dilimGenisligi);
    if (dilimdeki <= 0) break;
    toplam += dilimdeki * d.oran;
    kalan -= dilimdeki;
    oncekiUst = d.ust;
    if (kalan <= 0) break;
  }
  return toplam;
}

// İhbar Tazminatı, yukarıdaki birleşik "Kıdem & İhbar Tazminatı" aracına (KidemIhbarTazminati) taşındı.
// Gelir vergisi yardımcıları (GELIR_VERGISI_DILIMLERI, hesaplaGelirVergisi) birleşik araç ve diğer hesaplamalarca kullanılır.

// ─── 3. FAZLA MESAİ ───────────────────────────────────────────────────────────

function FazlaMesai() {
  // Yarım saat yuvarlama: yarım saatten az → 0,5 saat; yarım saati aşan → 1 saat (md.41)
  const yuvarla = (h: number) => {
    if (h <= 0) return 0;
    const tam = Math.floor(h);
    const frac = h - tam;
    if (frac === 0) return h;
    return frac <= 0.5 ? tam + 0.5 : tam + 1;
  };

  const [halen, setHalen] = useState<"evet" | "hayir">("hayir");
  const [yeralti, setYeralti] = useState<"hayir" | "evet">("hayir");
  const [iseGiris, setIseGiris] = useState("2020-01-01");
  const [istenAyrilma, setIstenAyrilma] = useState(() => new Date().toISOString().slice(0, 10));
  const [anlasmaSaat, setAnlasmaSaat] = useState("45");
  const [fiiliSaat, setFiiliSaat] = useState("55");
  const [aylikBrut, setAylikBrut] = useState("50000");
  const [tanikIndirim, setTanikIndirim] = useState<"hayir" | "evet">("hayir");

  const result = useMemo(() => {
    const num = (s: string) => parseFloat(s.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const brut = num(aylikBrut);
    const limit = yeralti === "evet" ? 37.5 : 45;       // haftalık yasal sınır
    const fazlaCalismaCarpan = yeralti === "evet" ? 2.0 : 1.5; // yeraltı %100, normal %50
    const anlasma = Math.min(Math.max(0, num(anlasmaSaat)), limit);
    const fiili = num(fiiliSaat);

    // Haftalık fazla saatler (yuvarlanmış)
    const fazlaSurelerleHam = Math.max(0, Math.min(fiili, limit) - anlasma); // anlaşma→limit, %25
    const fazlaCalismaHam = Math.max(0, fiili - limit);                       // limit üstü, %50/%100
    const fazlaSurelerle = yuvarla(fazlaSurelerleHam);
    const fazlaCalisma = yuvarla(fazlaCalismaHam);

    const saatlik = brut / 225; // aylık 30 gün × 7,5 saat
    const haftalikUcret = fazlaSurelerle * saatlik * 1.25 + fazlaCalisma * saatlik * fazlaCalismaCarpan;

    // Dönem ve zamanaşımı (5 yıl = 260 hafta)
    const b = new Date(iseGiris);
    const e = halen === "evet" ? new Date() : new Date(istenAyrilma);
    const gecerli = !isNaN(b.getTime()) && !isNaN(e.getTime()) && e > b;
    const toplamGun = gecerli ? daysBetween(b, e) : 0;
    const toplamHafta = toplamGun / 7;
    const ZAMANASIMI_HAFTA = 5 * 52; // 260
    const hesapHafta = Math.min(toplamHafta, ZAMANASIMI_HAFTA);
    const zamanasimiVar = toplamHafta > ZAMANASIMI_HAFTA;

    let toplamBrut = haftalikUcret * hesapHafta;
    const indirimliBrut = tanikIndirim === "evet" ? toplamBrut * 0.7 : toplamBrut;

    return {
      limit, fazlaCalismaCarpan, anlasma, fiili,
      fazlaSurelerle, fazlaCalisma, saatlik, haftalikUcret,
      toplamHafta, hesapHafta, zamanasimiVar, toplamBrut, indirimliBrut, gecerli,
    };
  }, [halen, yeralti, iseGiris, istenAyrilma, anlasmaSaat, fiiliSaat, aylikBrut, tanikIndirim]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Halen Çalışmakta mısınız?">
        <select value={halen} onChange={e => setHalen(e.target.value as "evet" | "hayir")} className={sel}>
          <option value="hayir">Hayır (işten ayrıldım)</option>
          <option value="evet">Evet</option>
        </select>
      </Field>
      <Field label="Yeraltı İşçisi misiniz?">
        <select value={yeralti} onChange={e => setYeralti(e.target.value as "hayir" | "evet")} className={sel}>
          <option value="hayir">Hayır</option>
          <option value="evet">Evet (yeraltı maden işi)</option>
        </select>
      </Field>
      <Field label="İşe Giriş Tarihi">
        <input type="date" value={iseGiris} onChange={e => setIseGiris(e.target.value)} className={inp} />
      </Field>
      <Field label="İşten Ayrılma Tarihi">
        <input type="date" value={istenAyrilma} onChange={e => setIstenAyrilma(e.target.value)} disabled={halen === "evet"} className={inp + (halen === "evet" ? " opacity-50" : "")} />
      </Field>
      <Field label="Anlaşmadaki Haftalık Çalışma Süresi (saat)">
        <input type="number" min="0" max="45" step="0.5" value={anlasmaSaat} onChange={e => setAnlasmaSaat(e.target.value)} className={inp} />
      </Field>
      <Field label="Haftalık Fiilen Çalıştığınız Süre (saat)">
        <input type="number" min="0" step="0.5" value={fiiliSaat} onChange={e => setFiiliSaat(e.target.value)} className={inp} />
      </Field>
      <Field label="Aylık Brüt Maaş (TL)">
        <input type="text" value={aylikBrut} onChange={e => setAylikBrut(e.target.value)} className={inp} />
      </Field>
      <Field label="Sadece Tanık Beyanına mı Dayanıyor?">
        <select value={tanikIndirim} onChange={e => setTanikIndirim(e.target.value as "hayir" | "evet")} className={sel}>
          <option value="hayir">Hayır (yazılı delil var)</option>
          <option value="evet">Evet (hakkaniyet indirimi %30)</option>
        </select>
      </Field>

      <div className="md:col-span-2">
        {result.gecerli ? (
          <Result
            rows={[
              ["Haftalık Yasal Sınır", `${fmt(result.limit, 1)} saat ${yeralti === "evet" ? "(yeraltı)" : ""}`],
              ["Saatlik Ücret (brüt ÷ 225)", `${fmt(result.saatlik)} TL`],
              ["Haftalık Fazla Sürelerle Çalışma (%25)", `${fmt(result.fazlaSurelerle, 1)} saat`],
              [`Haftalık Fazla Çalışma (%${result.fazlaCalismaCarpan === 2 ? "100" : "50"})`, `${fmt(result.fazlaCalisma, 1)} saat`],
              ["Haftalık Fazla Mesai Ücreti (brüt)", `${fmt(result.haftalikUcret)} TL`],
              ["Toplam Süre", `${fmt(result.toplamHafta, 0)} hafta${result.zamanasimiVar ? " (zamanaşımı: son 260 hafta hesaplandı)" : ""}`],
              ["Hesaplanan Hafta", `${fmt(result.hesapHafta, 0)} hafta`],
              ...(result.indirimliBrut !== result.toplamBrut
                ? [["Toplam Brüt (indirimsiz)", `${fmt(result.toplamBrut)} TL`] as [string, string],
                   ["Hakkaniyet İndirimi (−%30)", `− ${fmt(result.toplamBrut - result.indirimliBrut)} TL`] as [string, string]]
                : []),
              ["TOPLAM BRÜT FAZLA MESAİ ÜCRETİ", `${fmt(result.indirimliBrut)} TL`],
            ]}
            note="4857 md.41 — Haftalık yasal çalışma süresi 45 saattir (yeraltı maden işlerinde 37,5 saat). ANLAŞILAN süre ile 45 saat (yeraltında 37,5) arasındaki çalışma 'fazla sürelerle çalışma' olup %25 zamlıdır; 45 saati (yeraltında 37,5) aşan çalışma 'fazla çalışma' olup %50 (yeraltında %100) zamlıdır. Hesapta yarım saatten az süreler yarım saat, yarım saati aşanlar bir saat sayılır. Saatlik ücret = aylık brüt ÷ 225. Fazla mesai alacağı 5 yıllık zamanaşımına tabidir; bu nedenle hesap son 260 hafta ile sınırlandırılmıştır. Tutar brüttür; gelir ve damga vergisi ile SGK primi ayrıca kesilir. İşçi iddiasını yalnızca tanık beyanıyla ispatlıyorsa mahkemeler genellikle ~%30 hakkaniyet/takdiri indirim uygular. Ayrıca fazla çalışma yılda 270 saatle sınırlıdır."
          />
        ) : (
          <div className="text-sm text-charcoal/35 italic">Geçerli tarih aralığı ve ücret bilgilerini girin.</div>
        )}
      </div>
    </div>
  );
}

// ─── 4. YILLIK İZİN ───────────────────────────────────────────────────────────

function YillikIzin() {
  const [dogum, setDogum] = useState("1985-01-01");
  const [baslama, setBaslama] = useState("2010-01-01");
  const [ayrilma, setAyrilma] = useState(() => new Date().toISOString().slice(0, 10));
  const [kullanilanGun, setKullanilanGun] = useState("0");
  const [mod, setMod] = useState<"net" | "brut">("net");
  const [maas, setMaas] = useState("50000");
  const [kumulatifMatrah, setKumulatifMatrah] = useState("0");

  const result = useMemo(() => {
    const num = (s: string) => parseFloat(s.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const d = new Date(dogum), b = new Date(baslama), a = new Date(ayrilma);
    if (isNaN(d.getTime()) || isNaN(b.getTime()) || isNaN(a.getTime()) || a <= b) return null;

    const toplamGun = daysBetween(b, a);
    const yilTam = Math.floor(toplamGun / 365);

    // Kademeli toplam hak ediş (her tam hizmet yılı için), yaş kuralı ile
    let hakGun = 0;
    for (let i = 1; i <= yilTam; i++) {
      let gun = i <= 5 ? 14 : i <= 14 ? 20 : 26; // 1-5:14 · 6-14:20 · 15+:26
      // O hizmet yılının sonundaki yaş (18 dahil altı veya 50 dahil üstü → min 20)
      const yilSonu = new Date(b); yilSonu.setFullYear(b.getFullYear() + i);
      const yas = Math.floor(daysBetween(d, yilSonu) / 365);
      if (yas <= 18 || yas >= 50) gun = Math.max(gun, 20);
      hakGun += gun;
    }

    const kullanilan = parseInt(kullanilanGun) || 0;
    const kalan = Math.max(0, hakGun - kullanilan);

    const aylik = num(maas);
    const gunluk = aylik / 30;

    let brutIzin = 0, gvIzin = 0, damgaIzin = 0, netIzin = 0;
    if (mod === "net") {
      netIzin = kalan * gunluk; // net maaş üzerinden net izin ücreti
    } else {
      brutIzin = kalan * gunluk;
      // Fesihte ödenen kullanılmayan izin ücretinden SGK primi KESİLMEZ (5510); yalnız GV + damga
      gvIzin = hesaplaGelirVergisi(num(kumulatifMatrah), brutIzin);
      damgaIzin = brutIzin * 0.00759;
      netIzin = brutIzin - gvIzin - damgaIzin;
    }

    return { yilTam, hakGun, kalan, gunluk, brutIzin, gvIzin, damgaIzin, netIzin };
  }, [dogum, baslama, ayrilma, kullanilanGun, mod, maas, kumulatifMatrah]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Doğum Tarihi">
        <input type="date" value={dogum} onChange={e => setDogum(e.target.value)} className={inp} />
      </Field>
      <Field label="İşe Başlama Tarihi (deneme süresi dahil)">
        <input type="date" value={baslama} onChange={e => setBaslama(e.target.value)} className={inp} />
      </Field>
      <Field label="İşten Ayrılma Tarihi">
        <input type="date" value={ayrilma} onChange={e => setAyrilma(e.target.value)} className={inp} />
      </Field>
      <Field label="Kullanılan Toplam İzin Günü">
        <input type="number" min="0" value={kullanilanGun} onChange={e => setKullanilanGun(e.target.value)} placeholder="Tüm hizmet boyunca kullanılan" className={inp} />
      </Field>
      <Field label="Hesaplama Şekli">
        <select value={mod} onChange={e => setMod(e.target.value as "net" | "brut")} className={sel}>
          <option value="net">Net maaş ile hesapla</option>
          <option value="brut">Brüt maaş ile hesapla</option>
        </select>
      </Field>
      <Field label={mod === "net" ? "Aylık Net Maaş (TL)" : "Aylık Brüt Maaş (TL)"}>
        <input type="text" value={maas} onChange={e => setMaas(e.target.value)} placeholder="Son çalışma ayı" className={inp} />
      </Field>
      {mod === "brut" && (
        <Field label="Kümüle Gelir Vergisi Matrahı (TL)">
          <input type="text" value={kumulatifMatrah} onChange={e => setKumulatifMatrah(e.target.value)} className={inp} />
        </Field>
      )}

      <div className="md:col-span-2">
        {result ? (
          <Result
            rows={[
              ["Toplam Hizmet Süresi", `${result.yilTam} tam yıl`],
              ["Hak Edilen Toplam İzin", `${result.hakGun} gün`],
              ["Kullanılmayan (Kalan) İzin", `${result.kalan} gün`],
              ["Günlük Ücret", `${fmt(result.gunluk)} TL`],
              ...(mod === "brut"
                ? [
                    ["Brüt İzin Ücreti", `${fmt(result.brutIzin)} TL`] as [string, string],
                    ["Gelir Vergisi", `− ${fmt(result.gvIzin)} TL`] as [string, string],
                    ["Damga Vergisi (‰7,59)", `− ${fmt(result.damgaIzin)} TL`] as [string, string],
                    ["Net İzin Ücreti", `${fmt(result.netIzin)} TL`] as [string, string],
                  ]
                : [["Net İzin Ücreti", `${fmt(result.netIzin)} TL`] as [string, string]]),
            ]}
            note="4857 md.53: hizmet süresi 1–5 yıl 14 gün, 5–15 yıl 20 gün, 15+ yıl 26 gün; her tam hizmet yılı için kademeli hesaplanır. 18 yaşından küçük (18 dahil) ve 50 yaşından büyük (50 dahil) işçilere yılda en az 20 gün verilir (doğum tarihinden hesaplanır). İlk yıl dolmadan izne hak kazanılmaz. İzin günlük ücreti çıplak brüt/net maaşın 30'a bölümüdür; yol/yemek gibi ek ödemeler dahil edilmez. ÖNEMLİ: İş sözleşmesi sona erdiğinde ödenen kullanılmayan yıllık izin ücretinden SGK primi KESİLMEZ (5510 s.K.); yalnızca gelir vergisi (brüt modda kümüle matraha göre) ve damga vergisi kesilir. Net modda girilen net maaş doğrudan esas alınır. İzin alacağı zamanaşımı, iş sözleşmesinin sona erdiği tarihte işlemeye başlar (5 yıl)."
          />
        ) : (
          <div className="text-sm text-charcoal/35 italic">Tarihleri ve maaş bilgisini girin (ayrılma, başlamadan sonra olmalı).</div>
        )}
      </div>
    </div>
  );
}

// ─── 5. SMM HESAPLAMA ─────────────────────────────────────────────────────────

// KDV kısmi tevkifatı — işin türü ve oranı (KDV Genel Uygulama Tebliği)
const SMM_ISIN_TURU = [
  { ad: "Tevkifat Yok (nihai tüketici / belirlenmiş alıcı değil)", pay: 0, payda: 1 },
  { ad: "Etüt, plan-proje, danışmanlık, denetim ve benzeri", pay: 9, payda: 10 },
  { ad: "Yapı denetim hizmetleri", pay: 9, payda: 10 },
  { ad: "Temizlik, çevre ve bahçe bakım hizmetleri", pay: 9, payda: 10 },
  { ad: "İşgücü temini (özel güvenlik dahil)", pay: 9, payda: 10 },
  { ad: "Makine, teçhizat, demirbaş bakım ve onarım", pay: 7, payda: 10 },
  { ad: "Fason tekstil, konfeksiyon, çanta, ayakkabı dikim", pay: 7, payda: 10 },
  { ad: "Baskı ve basım hizmetleri", pay: 7, payda: 10 },
  { ad: "Servis taşımacılığı hizmeti", pay: 5, payda: 10 },
  { ad: "Yemek servisi ve organizasyon hizmetleri", pay: 5, payda: 10 },
  { ad: "Diğer hizmetler (belirlenmiş alıcılara)", pay: 5, payda: 10 },
  { ad: "Yapım işleri ile mühendislik-mimarlık-etüt/proje", pay: 4, payda: 10 },
  { ad: "Ticari reklam hizmetleri", pay: 3, payda: 10 },
];

function SmmHesaplama() {
  const [mod, setMod] = useState<"brut" | "net" | "tahsil">("brut");
  const [tutar, setTutar] = useState("10000");
  const [stopajOran, setStopajOran] = useState("0.20"); // GVK md.94 serbest meslek stopajı
  const [kdvOran, setKdvOran] = useState("0.20");
  const [isinTuru, setIsinTuru] = useState("0"); // SMM_ISIN_TURU index

  const result = useMemo(() => {
    const n = parseFloat(tutar.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const st = parseFloat(stopajOran) || 0;
    const kd = parseFloat(kdvOran) || 0;
    const it = SMM_ISIN_TURU[parseInt(isinTuru) || 0];
    const tevk = it.pay / it.payda; // KDV tevkifat oranı (örn. 9/10 = 0,9)

    // Brüt matrahı moda göre çöz
    let brut: number;
    if (mod === "brut") {
      brut = n;
    } else if (mod === "net") {
      brut = st < 1 ? n / (1 - st) : 0; // net = brüt(1−stopaj)
    } else {
      // Tahsil Edilen = net + (KDV − KDV tevkifatı) = brüt[(1−stopaj) + kdv(1−tevk)]
      const kat = (1 - st) + kd * (1 - tevk);
      brut = kat > 0 ? n / kat : 0;
    }

    const stopaj = brut * st;
    const net = brut - stopaj;
    const kdv = brut * kd;
    const kdvTevkifat = kdv * tevk;        // alıcı tarafından sorumlu sıfatıyla kesilir
    const kdvTahsil = kdv - kdvTevkifat;   // makbuzda nakden tahsil edilen KDV
    const tahsilEdilen = net + kdvTahsil;

    return { brut, st, kd, tevk, it, stopaj, net, kdv, kdvTevkifat, kdvTahsil, tahsilEdilen };
  }, [tutar, mod, stopajOran, kdvOran, isinTuru]);

  const inputLabel = mod === "brut" ? "Brüt Tutar / Matrah (TL)"
    : mod === "net" ? "Net Tutar (TL)"
    : "Tahsil Edilen Tutar (TL)";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Hesap Türü">
        <select value={mod} onChange={e => setMod(e.target.value as "brut" | "net" | "tahsil")} className={sel}>
          <option value="brut">Brütten Nete</option>
          <option value="net">Netten Brüte</option>
          <option value="tahsil">Tahsil Edilenden</option>
        </select>
      </Field>
      <Field label={inputLabel}>
        <input type="text" value={tutar} onChange={e => setTutar(e.target.value)} className={inp} />
      </Field>
      <Field label="G.V. Stopaj (Tevkifat) Oranı">
        <select value={stopajOran} onChange={e => setStopajOran(e.target.value)} className={sel}>
          <option value="0.20">%20 (serbest meslek — GVK md.94)</option>
          <option value="0.17">%17 (telif kazançları)</option>
          <option value="0">Yok (alıcı vergi sorumlusu değil)</option>
        </select>
      </Field>
      <Field label="KDV Oranı">
        <select value={kdvOran} onChange={e => setKdvOran(e.target.value)} className={sel}>
          <option value="0.20">%20</option>
          <option value="0.10">%10</option>
          <option value="0.01">%1</option>
        </select>
      </Field>
      <Field label="İşin Türü (KDV Tevkifatı)">
        <select value={isinTuru} onChange={e => setIsinTuru(e.target.value)} className={sel}>
          {SMM_ISIN_TURU.map((t, i) => (
            <option key={i} value={i}>{t.pay > 0 ? `${t.ad} — ${t.pay}/${t.payda}` : t.ad}</option>
          ))}
        </select>
      </Field>

      <div className="col-span-full">
        <Result
          rows={[
            ["Brüt Tutar (Matrah)", `${fmt(result.brut)} TL`],
            [`G.V. Tevkifatı (Stopaj) — %${fmt(result.st * 100, 0)}`, `− ${fmt(result.stopaj)} TL`],
            ["Net Tutar", `${fmt(result.net)} TL`],
            [`KDV — %${fmt(result.kd * 100, 0)}`, `+ ${fmt(result.kdv)} TL`],
            ...(result.tevk > 0
              ? [[`KDV Tevkifatı (${result.it.pay}/${result.it.payda}) — alıcı keser`, `− ${fmt(result.kdvTevkifat)} TL`] as [string, string],
                 ["Makbuzda Tahsil Edilen KDV", `${fmt(result.kdvTahsil)} TL`] as [string, string]]
              : []),
            ["TAHSİL EDİLEN (Net + Tahsil KDV)", `${fmt(result.tahsilEdilen)} TL`],
          ]}
          note="Serbest meslek kazancında, ödeme yapan vergi sorumlusu ise GVK md.94/2 uyarınca brüt üzerinden %20 gelir vergisi stopajı (telif kazançlarında %17) kesilir; nihai tüketiciye düzenlenen makbuzda stopaj olmaz. KDV genel oran %20'dir. KDV tevkifatı yalnızca 'belirlenmiş alıcılara' (kamu, banka, büyük şirket vb.) verilen ve tevkifat listesindeki hizmetlerde, işlem bedeli alt sınırı aşıyorsa uygulanır; bu hâlde KDV'nin işin türüne göre belirlenen kısmı (ör. 9/10) alıcı tarafından sorumlu sıfatıyla beyan edilir, kalan kısım makbuzda nakden tahsil edilir. Oranlar KDV Genel Uygulama Tebliği esasındadır; somut işlemde alıcının niteliği ve bedel sınırı kontrol edilmelidir."
        />
      </div>
    </div>
  );
}

// ─── 6. NAFAKA ARTIŞI ──────────────────────────────────────────────────────────

function NafakaArtisi() {
  const [yon, setYon] = useState<"artir" | "azalt">("artir");
  const [mevcutNafaka, setMevcutNafaka] = useState("5000");
  // TÜİK 12 aylık ortalama oranlar — aylık değişir; güncel değeri TÜİK'ten girin
  const [tufe, setTufe] = useState("32.82");
  const [ufe, setUfe] = useState("25.98");
  const [oranTuru, setOranTuru] = useState<"tufe" | "ufe" | "ortalama" | "ozel">("tufe");
  const [ozelOran, setOzelOran] = useState("30");
  const [nafakaTuru, setNafakaTuru] = useState<"istirak" | "yoksulluk" | "tedbir">("istirak");
  const [kararTarihi, setKararTarihi] = useState("");
  const [baslangicNafaka, setBaslangicNafaka] = useState("");
  const [odemeDurumu, setOdemeDurumu] = useState<"duzenli" | "aksiyor" | "odenmiyor">("duzenli");
  const [odenenYuzde, setOdenenYuzde] = useState("50");
  const [birikenAy, setBirikenAy] = useState("12");
  const [cocuk, setCocuk] = useState("0");
  const [aylikMasraf, setAylikMasraf] = useState("");
  const [borcluGelir, setBorcluGelir] = useState("");
  const [tab, setTab] = useState<"artis" | "gelecek" | "sans" | "biriken">("artis");

  const r = useMemo(() => {
    const num = (s: string) => parseFloat(s.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const mevcut = num(mevcutNafaka);
    const tufeN = num(tufe), ufeN = num(ufe);
    const oran = oranTuru === "tufe" ? tufeN : oranTuru === "ufe" ? ufeN : oranTuru === "ortalama" ? (tufeN + ufeN) / 2 : num(ozelOran);
    const yeni = mevcut * (1 + oran / 100);
    const artis = yeni - mevcut;

    // Gelecek 5 yıl projeksiyonu (bileşik)
    const gelecek: { yil: number; tutar: number }[] = [];
    let acc = mevcut;
    const buYil = new Date().getFullYear();
    for (let i = 1; i <= 5; i++) { acc = acc * (1 + oran / 100); gelecek.push({ yil: buYil + i, tutar: acc }); }

    // Enflasyon kaybı (karar tarihi + başlangıç nafaka varsa) — tahmini, güncel oran bileşik
    let enflasyonKaybi: { yilSayisi: number; olmasiGereken: number; kayip: number } | null = null;
    if (kararTarihi && baslangicNafaka) {
      const k = new Date(kararTarihi);
      if (!isNaN(k.getTime())) {
        const yilSayisi = daysBetween(k, new Date()) / 365;
        const bas = num(baslangicNafaka);
        const olmasiGereken = bas * Math.pow(1 + oran / 100, yilSayisi);
        enflasyonKaybi = { yilSayisi, olmasiGereken, kayip: olmasiGereken - mevcut };
      }
    }

    // Biriken alacak (ödeme durumu)
    const ay = parseInt(birikenAy) || 0;
    const aylikAcik = odemeDurumu === "odenmiyor" ? mevcut : odemeDurumu === "aksiyor" ? mevcut * (1 - num(odenenYuzde) / 100) : 0;
    const birikenAnapara = aylikAcik * ay;

    // Dava şansı (kaba tahmin, 0-95)
    const masraf = num(aylikMasraf), gelir = num(borcluGelir);
    let puan = 35;
    if (yon === "artir") {
      if (enflasyonKaybi && enflasyonKaybi.yilSayisi >= 1) puan += Math.min(25, enflasyonKaybi.yilSayisi * 8);
      if (odemeDurumu === "odenmiyor") puan += 15; else if (odemeDurumu === "aksiyor") puan += 8;
      if (nafakaTuru === "istirak" && (parseInt(cocuk) || 0) > 0) puan += 10;
      if (gelir > 0 && mevcut > 0) { const k = (gelir) / (mevcut * 4); if (k >= 1) puan += 12; else puan += Math.round(k * 12); }
      if (gelir > 0 && masraf > 0 && masraf / gelir >= 0.4) puan += 8;
    } else {
      // azaltma: borçlu lehine — gelir düşük / masraf düşük / çocuk reşit vb.
      if (gelir > 0 && mevcut > 0 && gelir < mevcut * 3) puan += 18;
      if (nafakaTuru === "yoksulluk") puan += 10; // yoksulluk nafakası kaldırma/azaltma şartları
      if (gelir > 0 && masraf > 0 && masraf / gelir < 0.25) puan += 8;
    }
    puan = Math.max(5, Math.min(95, puan));
    const band = puan >= 66 ? "Yüksek" : puan >= 40 ? "Orta" : "Düşük";

    return { mevcut, oran, yeni, artis, gelecek, enflasyonKaybi, aylikAcik, birikenAnapara, ay, puan, band };
  }, [yon, mevcutNafaka, tufe, ufe, oranTuru, ozelOran, nafakaTuru, kararTarihi, baslangicNafaka, odemeDurumu, odenenYuzde, birikenAy, cocuk, aylikMasraf, borcluGelir]);

  const tabBtn = (key: typeof tab, label: string) => (
    <button
      onClick={() => setTab(key)}
      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${tab === key ? "bg-accent text-white" : "bg-charcoal/5 text-charcoal/50 hover:bg-charcoal/10"}`}
    >{label}</button>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Durumunuz">
        <select value={yon} onChange={e => setYon(e.target.value as "artir" | "azalt")} className={sel}>
          <option value="artir">Nafaka Alacaklısıyım — artırmak istiyorum</option>
          <option value="azalt">Nafaka Yükümlüsüyüm — azaltmak istiyorum</option>
        </select>
      </Field>
      <Field label="Nafaka Türü">
        <select value={nafakaTuru} onChange={e => setNafakaTuru(e.target.value as "istirak" | "yoksulluk" | "tedbir")} className={sel}>
          <option value="istirak">Çocuk için (İştirak — TMK 330)</option>
          <option value="yoksulluk">Eşe (Yoksulluk — TMK 175-176)</option>
          <option value="tedbir">Dava süresince (Tedbir — TMK 169)</option>
        </select>
      </Field>
      <Field label="Mevcut Aylık Nafaka (₺)">
        <input type="text" value={mevcutNafaka} onChange={e => setMevcutNafaka(e.target.value)} className={inp} />
      </Field>
      <Field label="Artış Oranı Türü">
        <select value={oranTuru} onChange={e => setOranTuru(e.target.value as "tufe" | "ufe" | "ortalama" | "ozel")} className={sel}>
          <option value="tufe">TÜFE (%{tufe})</option>
          <option value="ufe">ÜFE (%{ufe})</option>
          <option value="ortalama">Ortalama (TÜFE+ÜFE)/2</option>
          <option value="ozel">Özel %</option>
        </select>
      </Field>
      <Field label="TÜFE 12 Aylık Ort. (%) — güncel">
        <input type="number" step="0.01" value={tufe} onChange={e => setTufe(e.target.value)} className={inp} />
      </Field>
      <Field label="ÜFE 12 Aylık Ort. (%) — güncel">
        <input type="number" step="0.01" value={ufe} onChange={e => setUfe(e.target.value)} className={inp} />
      </Field>
      {oranTuru === "ozel" && (
        <Field label="Özel Artış Oranı (%)">
          <input type="number" step="0.01" value={ozelOran} onChange={e => setOzelOran(e.target.value)} className={inp} />
        </Field>
      )}
      <Field label="Ödeme Durumu">
        <select value={odemeDurumu} onChange={e => setOdemeDurumu(e.target.value as "duzenli" | "aksiyor" | "odenmiyor")} className={sel}>
          <option value="duzenli">Düzenli ödeniyor</option>
          <option value="aksiyor">Aksıyor (kısmi)</option>
          <option value="odenmiyor">Hiç ödenmiyor</option>
        </select>
      </Field>
      {odemeDurumu === "aksiyor" && (
        <Field label="Ödenen Oran (%)">
          <input type="number" min="0" max="100" value={odenenYuzde} onChange={e => setOdenenYuzde(e.target.value)} className={inp} />
        </Field>
      )}
      {odemeDurumu !== "duzenli" && (
        <Field label="Biriken Ay Sayısı">
          <input type="number" min="0" value={birikenAy} onChange={e => setBirikenAy(e.target.value)} className={inp} />
        </Field>
      )}
      <Field label="Nafaka Kararı Tarihi (ops. — enflasyon kaybı)">
        <input type="date" value={kararTarihi} onChange={e => setKararTarihi(e.target.value)} className={inp} />
      </Field>
      <Field label="Başlangıçtaki Nafaka (₺) (ops.)">
        <input type="text" value={baslangicNafaka} onChange={e => setBaslangicNafaka(e.target.value)} className={inp} />
      </Field>
      <Field label="Çocuk Sayısı">
        <input type="number" min="0" value={cocuk} onChange={e => setCocuk(e.target.value)} className={inp} />
      </Field>
      <Field label="Aylık Toplam Masraflarınız (₺) (ops.)">
        <input type="text" value={aylikMasraf} onChange={e => setAylikMasraf(e.target.value)} className={inp} />
      </Field>
      <Field label="Borçlunun Tahmini Aylık Geliri (₺) (ops.)">
        <input type="text" value={borcluGelir} onChange={e => setBorcluGelir(e.target.value)} className={inp} />
      </Field>

      <div className="col-span-full">
        <div className="flex flex-wrap gap-2 mb-3">
          {tabBtn("artis", "Artış Tutarı")}
          {tabBtn("gelecek", "Gelecek Yıllar")}
          {tabBtn("sans", "Dava Şansı")}
          {tabBtn("biriken", "Biriken Alacak")}
        </div>

        {tab === "artis" && (
          <Result
            rows={[
              ["Uygulanan Artış Oranı", `%${fmt(r.oran, 2)}`],
              ["Mevcut Aylık Nafaka", `${fmt(r.mevcut)} ₺`],
              ["Artış Miktarı", `${fmt(r.artis)} ₺`],
              ["Yeni Aylık Nafaka", `${fmt(r.yeni)} ₺`],
              ...(r.enflasyonKaybi
                ? [["Karardan Bu Yana Süre", `${fmt(r.enflasyonKaybi.yilSayisi, 1)} yıl`] as [string, string],
                   ["Endekslenmiş Olması Gereken (tahmini)", `${fmt(r.enflasyonKaybi.olmasiGereken)} ₺`] as [string, string],
                   ["Enflasyon Kaybı (tahmini)", `${fmt(r.enflasyonKaybi.kayip)} ₺`] as [string, string]]
                : []),
            ]}
            note="Yeni nafaka = mevcut nafaka × (1 + artış oranı). Nafaka artırım/uyarlamada (TMK 176/son ve 331) hâkim TÜFE'yi (12 aylık ortalama) esas alma eğilimindedir; ÜFE veya ortalama da uygulanabilir. Oranlar TÜİK'ten güncellenmelidir; buradaki değerler örnektir. Enflasyon kaybı, başlangıç nafakasının güncel oranla bileşik endekslenmesiyle yapılan TAHMİNÎ bir hesaptır (gerçek hesap dönem dönem TÜİK endeksiyle yapılır)."
          />
        )}
        {tab === "gelecek" && (
          <Result
            rows={r.gelecek.map(g => [`${g.yil}`, `${fmt(g.tutar)} ₺`] as [string, string])}
            note="Gelecek yıllar, seçilen artış oranının her yıl bileşik uygulanmasıyla projekte edilmiştir (her yıl bir önceki yılın tutarı × (1+oran)). Gerçek artış, ilgili yılın TÜİK oranına göre değişir; bu yalnızca mevcut orana dayalı bir öngörüdür."
          />
        )}
        {tab === "sans" && (
          <Result
            rows={[
              [yon === "artir" ? "Artırım Davası Tahmini Şans" : "Azaltım/Kaldırma Davası Tahmini Şans", `%${r.puan} (${r.band})`],
              ["Değerlendirme", yon === "artir"
                ? "Enflasyon kaybı, ödeme düzeni, çocuk sayısı ve borçlunun gelir durumu birlikte değerlendirildi."
                : "Borçlunun gelir durumu, masraf oranı ve nafaka türü birlikte değerlendirildi."],
            ]}
            note="⚠️ Bu yüzde KABA BİR TAHMİNDİR, hukuki bir sonuç veya garanti değildir. Nafaka davalarında sonuç; tarafların ekonomik-sosyal durumu, çocuğun ihtiyaçları (TMK 330), hakkaniyet (TMK 4) ve somut delillere göre hâkimin takdirindedir (Yargıtay 3. HD emsalleri). Avukatla yürütülen dosyalarda talebin somut gerekçelendirilmesi sonucu olumlu etkiler. Kesin değerlendirme için avukata danışın."
          />
        )}
        {tab === "biriken" && (
          <Result
            rows={[
              ["Ödeme Durumu", odemeDurumu === "duzenli" ? "Düzenli — birikme yok" : odemeDurumu === "aksiyor" ? "Aksıyor (kısmi)" : "Hiç ödenmiyor"],
              ["Aylık Açık (ödenmeyen)", `${fmt(r.aylikAcik)} ₺`],
              ["Biriken Ay", `${r.ay} ay`],
              ["Biriken Anapara", `${fmt(r.birikenAnapara)} ₺`],
            ]}
            note="Biriken alacak = aylık ödenmeyen tutar × birikme süresi (anapara). Her nafaka taksiti muaccel olduğu tarihten itibaren değişen oranlı YASAL FAİZE tabidir; faiz buraya dâhil edilmemiştir (dönemsel oranlarla ayrıca hesaplanır). Nafaka alacakları İİK m.206 uyarınca hacizde imtiyazlıdır; ödenmemesi İİK m.344 uyarınca tazyik hapsi yaptırımına yol açabilir. Birikmiş nafaka için icra takibi ve faiz talebi mümkündür."
          />
        )}
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
  { etiket: "Ticari Avans Faizi (TCMB 20.12.2025) — %39,75", oran: 39.75 },
  { etiket: "TCMB Reeskont Faizi (20.12.2025) — %38,75", oran: 38.75 },
  { etiket: "TTK md.1530 Mal/Hizmet Temerrüt (01.01.2026) — %43", oran: 43.0 },
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

const AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

function KiraArtis() {
  const now = new Date();
  const [ay, setAy] = useState(String(now.getMonth())); // 0-11
  const [yil, setYil] = useState(String(now.getFullYear()));
  const [tur, setTur] = useState<"konut" | "isyeri">("konut");
  const [oranTuru, setOranTuru] = useState<"tufe" | "ozel">("tufe");
  const [tufe12, setTufe12] = useState("35.0");
  const [ozelOran, setOzelOran] = useState("25");
  const [mevcutKira, setMevcutKira] = useState("16750.25");

  const result = useMemo(() => {
    const kira = parseFloat(mevcutKira.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const tufe = parseFloat(tufe12) || 0;
    const ozel = parseFloat(ozelOran) || 0;

    // Artış ayı M ise, M-1 ayının 12 aylık ortalama TÜFE'si esas alınır
    const ayIdx = parseInt(ay) || 0;
    const yilN = parseInt(yil) || now.getFullYear();
    const refAyIdx = (ayIdx + 11) % 12;
    const refYil = ayIdx === 0 ? yilN - 1 : yilN;
    const refAy = `${AYLAR[refAyIdx]} ${refYil}`;

    // TBK 344: kararlaştırılan (özel) oran, TÜFE 12 aylık ortalamayı GEÇEMEZ
    let uygulanacak: number;
    let capUygulandi = false;
    if (oranTuru === "tufe") {
      uygulanacak = tufe;
    } else {
      capUygulandi = ozel > tufe;
      uygulanacak = Math.min(ozel, tufe);
    }
    const yeniKira = kira * (1 + uygulanacak / 100);
    const artis = yeniKira - kira;
    return { kira, tufe, ozel, uygulanacak, capUygulandi, yeniKira, artis, refAy };
  }, [ay, yil, tur, oranTuru, tufe12, ozelOran, mevcutKira]);

  const yillar = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Artış Yapılacak Ay">
        <div className="flex gap-2">
          <select value={ay} onChange={e => setAy(e.target.value)} className={sel}>
            {AYLAR.map((a, i) => <option key={i} value={i}>{a}</option>)}
          </select>
          <select value={yil} onChange={e => setYil(e.target.value)} className={sel}>
            {yillar.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </Field>
      <Field label="Kiralanan">
        <select value={tur} onChange={e => setTur(e.target.value as "konut" | "isyeri")} className={sel}>
          <option value="konut">Konut</option>
          <option value="isyeri">İş yeri</option>
        </select>
      </Field>
      <Field label="Artış Oranı Türü">
        <select value={oranTuru} onChange={e => setOranTuru(e.target.value as "tufe" | "ozel")} className={sel}>
          <option value="tufe">Tüketici Fiyat Endeksi (TÜFE)</option>
          <option value="ozel">Sözleşmedeki Özel Artış Oranı %</option>
        </select>
      </Field>
      <Field label={`12 Aylık TÜFE Ort. (%) — ${result.refAy}`}>
        <input type="number" step="0.01" value={tufe12} onChange={e => setTufe12(e.target.value)} className={inp} />
      </Field>
      {oranTuru === "ozel" && (
        <Field label="Sözleşmedeki Özel Oran (%)">
          <input type="number" step="0.01" value={ozelOran} onChange={e => setOzelOran(e.target.value)} className={inp} />
        </Field>
      )}
      <Field label="Mevcut Kira Tutarı (TL)">
        <input type="text" value={mevcutKira} onChange={e => setMevcutKira(e.target.value)} className={inp} />
      </Field>

      <div className="md:col-span-2">
        <Result
          rows={[
            ["Referans Endeks Ayı", result.refAy],
            ["12 Aylık TÜFE Ortalaması", `%${fmt(result.tufe, 2)}`],
            ...(oranTuru === "ozel"
              ? [["Sözleşmedeki Özel Oran", `%${fmt(result.ozel, 2)}`] as [string, string],
                 ...(result.capUygulandi ? [["⚠️ TBK 344 Üst Sınırı", `Özel oran TÜFE'yi (%${fmt(result.tufe, 2)}) aştığından TÜFE uygulanır`] as [string, string]] : [])]
              : []),
            ["Uygulanacak Artış Oranı", `%${fmt(result.uygulanacak, 2)}`],
            ["Artış Miktarı", `${fmt(result.artis)} TL`],
            ["Yeni Kira Bedeli", `${fmt(result.yeniKira)} TL`],
          ]}
          note={`Artış ayı seçildiğinde, bir önceki ayın (${result.refAy}) TÜİK 12 aylık ortalama TÜFE değişim oranı esas alınır; güncel oranı TÜİK'ten girin. TBK md.344 uyarınca hem KONUT hem İŞ YERİ kiralarında artış, 12 aylık TÜFE ortalamasını GEÇEMEZ (işyeri için 01.07.2020'den itibaren). Sözleşmede kararlaştırılan özel oran TÜFE'yi aşarsa, aşan kısım geçersizdir ve TÜFE uygulanır. Konutlarda uygulanan geçici %25 üst sınırı 01.07.2024 itibarıyla sona ermiştir. Yeni kira = mevcut kira × (1 + uygulanacak oran).`}
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
            note="Bu hesaplama genel bir tahminden ibarettir. AYM'nin sigorta genel şartlarına ilişkin iptal kararları sonrası sabit formül uygulanmamakta; araç değer kaybı, bilirkişi tarafından aracın kaza öncesi ve sonrası piyasa rayiç değeri arasındaki fark olarak somut analiz ile belirlenmektedir. Mahkemelerde uygulanacak değer, bilirkişi tespiti ve aracın özel durumuna göre değişir."
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
  const [doner, setDoner] = useState("2534"); // 2026 döner sermaye (gösterge 2.227 + ilave 307 TL)

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
  { dilim: 600000, oran: 0.16 },
  { dilim: 600000, oran: 0.15 },
  { dilim: 1200000, oran: 0.14 },
  { dilim: 2400000, oran: 0.11 },
  { dilim: 2400000, oran: 0.08 },
  { dilim: 2400000, oran: 0.05 },
  { dilim: 2400000, oran: 0.03 },
  { dilim: 3000000, oran: 0.02 },
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
          note="2026 AAÜT Üçüncü Kısım basamaklı oranları uygulanmıştır (%16, %15, %14, %11, %8, %5, %3, %2, %1). Kısmen kabul/ret halinde her iki taraf lehine ayrı vekalet ücretine hükmedilir. Vekalet ücreti yargılama giderlerine dahildir; davanın türü ve mahkemeye göre maktu alt sınır değişebilir (asliye hukuk: 30.000 TL)."
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
    // Harçlar Kanunu Tarife No.1 — 2026 tutarları
    const basvuruHarci = 732; // Asliye mahkemeleri maktu başvuru harcı (2026)
    const nispiHarc = d * 0.06831; // ‰68,31 nispi karar ve ilam harcı
    const pesinHarc = nispiHarc / 4; // Peşin harç = nispi harcın 1/4'ü
    // Gider avansı (HMK md.120) — 2026 tarifesi
    let giderAvans = taraf * 5 * 265 + 530; // taraf × 5 × tebligat ücreti + diğer işlemler
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
            ["Peşin Harç (nispi harcın 1/4'ü)", `${fmt(result.pesinHarc)} TL`],
            ["Gider Avansı (tahmini)", `${fmt(result.giderAvans)} TL`],
            ["Toplam Başlangıç Masrafı", `${fmt(result.toplam)} TL`],
          ]}
          note="Harç tutarları 492 sayılı Harçlar Kanunu Tarife No.1 (2026) esasında hesaplanmıştır. Nispi harç oranı ‰68,31 olup peşin harç bunun 1/4'üdür. Başvuru harcı asliye mahkemeleri için 732 TL'dir (sulh: 335,20 TL). Gider avansı HMK md.120 ve 2026 tarifesine göre hesaplanmıştır (tebligat birim: 265 TL). Yargılama sonunda kullanılmayan kısım iade edilir."
        />
      </div>
    </div>
  );
}

// ─── 14. İCRA KAPAK HESABI ────────────────────────────────────────────────────

function IcraKapakHesabi() {
  // ─── 2026 İcra harç ve gider tarifeleri (düzenlenebilir sabitler) ───
  const BASVURMA_HARCI = 732;        // İcra başvurma harcı (maktu) — 2026
  const PESIN_HARC_ORAN = 0.005;     // Peşin harç ‰5 (binde 5) — yalnız İLAMSIZ takipte
  const TAHSIL = { once: 0.0455, satisOnce: 0.0910, satisSonra: 0.1138 }; // %4,55 / %9,10 / %11,38
  const CEZAEVI_ORAN = 0.02;         // Cezaevi harcı: tahsil edilen asıl alacağın %2'si
  const TEBLIGAT = { normal: 265, aps: 530, uets: 15, mts: 310 }; // 2026 (UETS: borçlu şirketse; MTS: Merkezi Takip Sistemi)
  const AAUT_ICRA_MAKTU = 9000;      // 2026 AAÜT icra maktu vekalet ücreti

  const [tur, setTur] = useState<"ilamsiz" | "ilamli">("ilamsiz");
  const [asilAlacak, setAsilAlacak] = useState("100000");
  const [islemisFaiz, setIslemisFaiz] = useState("0");
  const [borcluSayisi, setBorcluSayisi] = useState("1");
  const [tebligat, setTebligat] = useState<"normal" | "aps" | "uets" | "mts">("normal");
  const [vekilVar, setVekilVar] = useState(true);
  const [dosyaGideri, setDosyaGideri] = useState("500");
  const [digerAvans, setDigerAvans] = useState("0");

  const result = useMemo(() => {
    const ap = parseFloat(asilAlacak.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const fz = parseFloat(islemisFaiz.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const bs = Math.max(1, parseInt(borcluSayisi) || 1);
    const dg = parseFloat(dosyaGideri.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const da = parseFloat(digerAvans.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const takipTutari = ap + fz; // asıl alacak + takip öncesi işlemiş faiz

    // ── 1) AÇILIŞ MASRAFI (alacaklının icra dairesine yatıracağı) ──
    const pesinHarc = tur === "ilamsiz" ? takipTutari * PESIN_HARC_ORAN : 0;
    const tebligatGideri = TEBLIGAT[tebligat] * bs;
    const acilis = BASVURMA_HARCI + pesinHarc + tebligatGideri + dg + da;

    // ── 2) TAHSİL AŞAMASI ──
    const tahsilOnce = takipTutari * TAHSIL.once;
    const tahsilSatisOnce = takipTutari * TAHSIL.satisOnce;
    const tahsilSatisSonra = takipTutari * TAHSIL.satisSonra;
    // Cezaevi harcı: tahsil edilen ASIL alacağın %2'si (takip sonrası faiz hariç) — ALACAKLI öder
    const cezaeviHarc = takipTutari * CEZAEVI_ORAN;
    // İcra vekalet ücreti (AAÜT Üçüncü Kısım basamakları; asgari maktu 9.000 TL,
    // üst sınır: asıl alacağı/takip tutarını geçemez — AAÜT m.13)
    let vek = 0;
    if (vekilVar && takipTutari > 0) {
      let kalan = takipTutari, step = 0;
      for (const b of AAUT_BASAMAKLAR) {
        const d = Math.min(kalan, b.dilim);
        if (d <= 0) break;
        step += d * b.oran; kalan -= d;
        if (kalan <= 0) break;
      }
      vek = Math.min(Math.max(step, AAUT_ICRA_MAKTU), takipTutari);
    }

    return { takipTutari, pesinHarc, tebligatGideri, acilis, tahsilOnce, tahsilSatisOnce, tahsilSatisSonra, cezaeviHarc, vek, dg, da, bs };
  }, [tur, asilAlacak, islemisFaiz, borcluSayisi, tebligat, vekilVar, dosyaGideri, digerAvans]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Dosya Türü">
        <select value={tur} onChange={e => setTur(e.target.value as "ilamsiz" | "ilamli")} className={sel}>
          <option value="ilamsiz">İlamsız İcra</option>
          <option value="ilamli">İlamlı İcra</option>
        </select>
      </Field>
      <Field label="Tebligat Türü">
        <select value={tebligat} onChange={e => setTebligat(e.target.value as "normal" | "aps" | "uets" | "mts")} className={sel}>
          <option value="normal">Normal Tebligat (PTT) — 265 TL</option>
          <option value="aps">Hızlı Tebligat (APS) — 530 TL</option>
          <option value="uets">E-Tebligat (UETS, borçlu şirket) — 15 TL</option>
          <option value="mts">MTS — Merkezi Takip Sistemi — 310 TL</option>
        </select>
      </Field>
      <Field label="Asıl Alacak / Takip Tutarı (TL)">
        <input type="text" value={asilAlacak} onChange={e => setAsilAlacak(e.target.value)} className={inp} />
      </Field>
      <Field label="İşlemiş Faiz (takip öncesi, TL)">
        <input type="text" value={islemisFaiz} onChange={e => setIslemisFaiz(e.target.value)} className={inp} />
      </Field>
      <Field label="Borçlu Sayısı">
        <input type="number" min="1" value={borcluSayisi} onChange={e => setBorcluSayisi(e.target.value)} className={inp} />
      </Field>
      <Field label="Avukatla Takip mi?">
        <select value={vekilVar ? "evet" : "hayir"} onChange={e => setVekilVar(e.target.value === "evet")} className={sel}>
          <option value="evet">Evet (vekalet ücreti dahil)</option>
          <option value="hayir">Hayır</option>
        </select>
      </Field>
      <Field label="Dosya Gideri & Baro Pulu (TL) — düzenlenebilir">
        <input type="text" value={dosyaGideri} onChange={e => setDosyaGideri(e.target.value)} className={inp} />
      </Field>
      <Field label="Diğer İşlemler Avansı (TL) — opsiyonel">
        <input type="text" value={digerAvans} onChange={e => setDigerAvans(e.target.value)} className={inp} />
      </Field>

      <div className="md:col-span-2">
        <div className="mb-2 text-[11px] font-mono uppercase tracking-widest text-accent">1 · Açılış Masrafı — Alacaklının Yatıracağı</div>
        <Result
          rows={[
            ["Başvurma Harcı (maktu)", `${fmt(BASVURMA_HARCI)} TL`],
            tur === "ilamsiz"
              ? ["Peşin Harç (takip tutarının binde 5'i)", `${fmt(result.pesinHarc)} TL`]
              : ["Peşin Harç", "İlamlı takipte alınmaz"],
            [`Tebligat Gideri (${result.bs} borçlu)`, `${fmt(result.tebligatGideri)} TL`],
            ["Dosya Gideri & Baro Pulu", `${fmt(result.dg)} TL`],
            ...(result.da > 0 ? [["Diğer İşlemler Avansı", `${fmt(result.da)} TL`] as [string, string]] : []),
            ["TOPLAM AÇILIŞ MASRAFI", `${fmt(result.acilis)} TL`],
          ]}
          note={"İlamsız takipte peşin harç, takip tutarının binde 5'idir (492 s.K.); ilamlı takipte peşin (nispi) harç alınmaz, yalnız maktu başvurma harcı yatırılır. Başvurma harcı 2026 için 732 TL. Tebligat: normal 265 TL, APS 530 TL, UETS (borçlu şirket) 15 TL, MTS 310 TL (2026). Bu masraflar alacaklı tarafından yatırılır, dosya hesabına eklenir ve tahsilatta borçludan alınır. Dosya gideri/baro pulu değişkendir; kendi tutarınızı girebilirsiniz." + (tebligat === "mts" ? " ⚠️ MTS (Merkezi Takip Sistemi), abonelik sözleşmelerinden doğan para alacakları için elektronik bir takip yoludur; burada MTS harcı PEŞİN alınır ve takip haciz aşamasına geçilmeden biterse ayrıca icraya başvurma harcı ile tahsil harcı ALINMAZ. Bu nedenle MTS'de yukarıdaki başvurma/peşin harç ve tahsil harcı kalemleri farklılaşır; tablo yaklaşık bilgi içindir." : "")}
        />
      </div>

      <div className="md:col-span-2">
        <div className="mb-2 text-[11px] font-mono uppercase tracking-widest text-accent">2 · Tahsil Aşaması — Harçlar & Vekalet</div>
        <Result
          rows={[
            ["Tahsil Harcı — hacizden önce ödeme (%4,55)", `${fmt(result.tahsilOnce)} TL`],
            ["Tahsil Harcı — haciz sonrası / satış öncesi (%9,10)", `${fmt(result.tahsilSatisOnce)} TL`],
            ["Tahsil Harcı — satış sonrası (%11,38)", `${fmt(result.tahsilSatisSonra)} TL`],
            ...(result.vek > 0 ? [["İcra Vekalet Ücreti (AAÜT — tam, asıl alacağı geçemez)", `${fmt(result.vek)} TL`] as [string, string]] : []),
            ...(result.vek > 0 ? [["İcra Vekalet Ücreti — borçlu süresinde öderse (3/4)", `${fmt(result.vek * 0.75)} TL`] as [string, string]] : []),
            ["Cezaevi Harcı (%2) — ALACAKLI öder · kapağa dâhil DEĞİL", `${fmt(result.cezaeviHarc)} TL`],
          ]}
          note="Tahsil harcı borçludan, tahsilatın yapıldığı aşamaya göre TEK olarak alınır (%4,55 / %9,10 / %11,38 — aşamalar alternatiftir, toplanmaz). İcra vekalet ücreti borçludan tahsil edilir; AAÜT Üçüncü Kısım nispi tarifesine göre hesaplanır, 2026 icra maktu alt sınırı 9.000 TL'dir ve hiçbir hâlde asıl alacağı (takip tutarını) geçemez (AAÜT m.13). Borçlu, ödeme/itiraz süresi içinde borcu öderse vekalet ücreti tarifedeki tutarın 3/4'ü (dörtte üçü) oranında uygulanır. CEZAEVİ HARCI (2548 s.K.): tahsil edilen asıl alacağın %2'sidir — takipten SONRA işleyen faiz matraha dâhil edilmez (Danıştay). Bu harcı ALACAKLI öder; tahsil edilen paradan alacaklı aleyhine kesilir, kanun ve Yargıtay içtihadı gereği BORÇLUYA YÜKLETİLEMEZ ve dosya kapak hesabına EKLENMEZ. Yalnızca bilgi amacıyla gösterilmiştir. İcra vekalet ücreti tutarı AAÜT icra tarifesine göre belirlenir; kesin tutarı doğrulayınız."
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
  { dilim: 600000, tek: 0.06, coklu: 0.09 },
  { dilim: 960000, tek: 0.05, coklu: 0.075 },
  { dilim: 1560000, tek: 0.04, coklu: 0.06 },
  { dilim: 3120000, tek: 0.03, coklu: 0.045 },
  { dilim: 9360000, tek: 0.02, coklu: 0.03 },
  { dilim: 12480000, tek: 0.015, coklu: 0.025 },
  { dilim: 24960000, tek: 0.01, coklu: 0.015 },
  { dilim: Infinity, tek: 0.005, coklu: 0.01 },
];

// BİRİNCİ KISIM — konusu para olmayan VEYA anlaşmama → maktu saatlik ücretler
// [2 kişi (taraf başına), 3-5 kişi, 6-10 kişi, 11+ kişi]
const ARB_MAKTU: Record<string, { iki: number; uc: number; alti: number; onbir: number; ad: string }> = {
  aile: { iki: 1000, uc: 2200, alti: 2300, onbir: 2400, ad: "Aile Hukuku" },
  ticari: { iki: 1500, uc: 3200, alti: 3300, onbir: 3400, ad: "Ticari Uyuşmazlık" },
  isci: { iki: 1130, uc: 2460, alti: 2560, onbir: 2660, ad: "İşçi-İşveren" },
  tuketici: { iki: 1000, uc: 2200, alti: 2300, onbir: 2400, ad: "Tüketici" },
  kira: { iki: 1170, uc: 2540, alti: 2640, onbir: 2740, ad: "Kira / Komşu Hakkı / Kat Mülkiyeti" },
  ortaklik: { iki: 1170, uc: 2540, alti: 2640, onbir: 2740, ad: "Ortaklığın Giderilmesi" },
  diger: { iki: 1000, uc: 2200, alti: 2300, onbir: 2400, ad: "Diğer Uyuşmazlıklar" },
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

// ─── 19. MİRAS PAYLAŞIMI (TMK Zümre Sistemi) ─────────────────────────────────
// Yasal mirasçılık — TMK md.495-501 ve sağ kalan eşin payı md.499

type Frac = { n: number; d: number };
function fgcd(a: number, b: number): number { a = Math.abs(a); b = Math.abs(b); return b ? fgcd(b, a % b) : a || 1; }
function fr(n: number, d: number): Frac { if (d < 0) { n = -n; d = -d; } const g = fgcd(n, d); return { n: n / g, d: d / g }; }
function fmul(a: Frac, b: Frac): Frac { return fr(a.n * b.n, a.d * b.d); }
function fsub(a: Frac, b: Frac): Frac { return fr(a.n * b.d - b.n * a.d, a.d * b.d); }
function fdiv(a: Frac, k: number): Frac { return fr(a.n, a.d * k); }
function fval(a: Frac): number { return a.n / a.d; }
function fstr(a: Frac): string { if (a.n === 0) return "0"; if (a.d === 1) return `${a.n}`; return `${a.n}/${a.d}`; }

function MirasPaylasimi() {
  const [tereke, setTereke] = useState("3000000");
  const [esVar, setEsVar] = useState<"evet" | "hayir">("evet");

  // 1. Zümre — altsoy
  const [yasayanCocuk, setYasayanCocuk] = useState("2");
  const [olenCocukDal, setOlenCocukDal] = useState("0");

  // 2. Zümre — ana/baba ve altsoyu (yalnız altsoy yoksa)
  const [anneSag, setAnneSag] = useState<"evet" | "hayir">("evet");
  const [babaSag, setBabaSag] = useState<"evet" | "hayir">("evet");
  const [kardesSayisi, setKardesSayisi] = useState("0");

  // 3. Zümre — büyük ana-baba (yalnız 1. ve 2. zümre yoksa)
  const [buyukSayisi, setBuyukSayisi] = useState("0");

  const cocukDal = (parseInt(yasayanCocuk) || 0) + (parseInt(olenCocukDal) || 0);
  const z1 = cocukDal > 0;
  const z2 = !z1 && (anneSag === "evet" || babaSag === "evet" || (parseInt(kardesSayisi) || 0) > 0);
  const z3 = !z1 && !z2 && (parseInt(buyukSayisi) || 0) > 0;

  const result = useMemo(() => {
    const T = parseFloat(tereke.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    const es = esVar === "evet";
    const rows: { ad: string; pay: Frac }[] = [];

    // Eş payı (TMK 499)
    let esPay: Frac = fr(0, 1);
    if (z1) esPay = fr(1, 4);
    else if (z2) esPay = fr(1, 2);
    else if (z3) esPay = fr(3, 4);
    else esPay = fr(1, 1); // hiç kan hısmı yoksa eş tamamını alır
    if (!es) esPay = fr(0, 1);

    if (es) rows.push({ ad: "Sağ Kalan Eş", pay: esPay });

    const kalan: Frac = fsub(fr(1, 1), esPay);

    if (z1) {
      const yc = parseInt(yasayanCocuk) || 0;
      const oc = parseInt(olenCocukDal) || 0;
      const dalPay = fdiv(kalan, cocukDal);
      if (yc > 0) {
        for (let i = 1; i <= yc; i++) rows.push({ ad: `${i}. Çocuk (yaşayan)`, pay: dalPay });
      }
      for (let i = 1; i <= oc; i++) {
        rows.push({ ad: `Vefat eden ${i}. çocuğun altsoyu (temsilen)`, pay: dalPay });
      }
    } else if (z2) {
      const as = anneSag === "evet";
      const bs = babaSag === "evet";
      const ks = parseInt(kardesSayisi) || 0;
      const yariAnne = fdiv(kalan, 2);
      const yariBaba = fdiv(kalan, 2);

      if (as && bs) {
        rows.push({ ad: "Anne", pay: yariAnne });
        rows.push({ ad: "Baba", pay: yariBaba });
      } else if (as && !bs) {
        rows.push({ ad: "Anne", pay: yariAnne });
        if (ks > 0) {
          const kp = fdiv(yariBaba, ks);
          for (let i = 1; i <= ks; i++) rows.push({ ad: `${i}. Kardeş (baba payından)`, pay: kp });
        } else {
          // baba ölü, altsoyu yok → payı anneye (TMK 496/3)
          rows.length = 0;
          if (es) rows.push({ ad: "Sağ Kalan Eş", pay: esPay });
          rows.push({ ad: "Anne (tamamı)", pay: kalan });
        }
      } else if (!as && bs) {
        rows.push({ ad: "Baba", pay: yariBaba });
        if (ks > 0) {
          const kp = fdiv(yariAnne, ks);
          for (let i = 1; i <= ks; i++) rows.push({ ad: `${i}. Kardeş (anne payından)`, pay: kp });
        } else {
          rows.length = 0;
          if (es) rows.push({ ad: "Sağ Kalan Eş", pay: esPay });
          rows.push({ ad: "Baba (tamamı)", pay: kalan });
        }
      } else {
        // ikisi de ölü → öz kardeşler tüm kalanı eşit paylaşır (temsil)
        if (ks > 0) {
          const kp = fdiv(kalan, ks);
          for (let i = 1; i <= ks; i++) rows.push({ ad: `${i}. Kardeş`, pay: kp });
        }
      }
    } else if (z3) {
      const bk = parseInt(buyukSayisi) || 0;
      const bp = fdiv(kalan, bk);
      for (let i = 1; i <= bk; i++) rows.push({ ad: `${i}. Büyük ana/baba (veya dalı)`, pay: bp });
    } else if (!es) {
      // ne eş ne kan hısmı → Hazine
      rows.push({ ad: "Mirasçı yok — Hazine (TMK 501)", pay: fr(1, 1) });
    }

    const display = rows.map(r => ({
      ad: r.ad,
      payStr: fstr(r.pay),
      yuzde: fval(r.pay) * 100,
      tutar: T * fval(r.pay),
    }));

    // zümre etiketi
    let zumreEtiket = "—";
    if (z1) zumreEtiket = "1. Zümre — Altsoy (TMK 495)";
    else if (z2) zumreEtiket = "2. Zümre — Ana/Baba ve altsoyu (TMK 496)";
    else if (z3) zumreEtiket = "3. Zümre — Büyük ana/baba (TMK 497)";
    else if (es) zumreEtiket = "Yalnızca sağ kalan eş (TMK 499)";
    else zumreEtiket = "Mirasçı yok — Hazine (TMK 501)";

    return { display, esPay, zumreEtiket };
  }, [tereke, esVar, yasayanCocuk, olenCocukDal, anneSag, babaSag, kardesSayisi, buyukSayisi, z1, z2, z3, cocukDal]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Tereke (Toplam Miras) Değeri (TL)">
        <input type="text" value={tereke} onChange={e => setTereke(e.target.value)} className={inp} />
      </Field>
      <Field label="Sağ Kalan Eş Var mı?">
        <select value={esVar} onChange={e => setEsVar(e.target.value as "evet" | "hayir")} className={sel}>
          <option value="evet">Evet</option>
          <option value="hayir">Hayır</option>
        </select>
      </Field>

      {/* 1. Zümre */}
      <Field label="Yaşayan Çocuk Sayısı">
        <input type="number" min="0" value={yasayanCocuk} onChange={e => setYasayanCocuk(e.target.value)} className={inp} />
      </Field>
      <Field label="Vefat Eden (Altsoyu Olan) Çocuk Sayısı">
        <input type="number" min="0" value={olenCocukDal} onChange={e => setOlenCocukDal(e.target.value)} className={inp} />
      </Field>

      {/* 2. Zümre — yalnız altsoy yoksa */}
      {!z1 && (
        <>
          <Field label="Anne Sağ mı?">
            <select value={anneSag} onChange={e => setAnneSag(e.target.value as "evet" | "hayir")} className={sel}>
              <option value="evet">Evet</option>
              <option value="hayir">Hayır</option>
            </select>
          </Field>
          <Field label="Baba Sağ mı?">
            <select value={babaSag} onChange={e => setBabaSag(e.target.value as "evet" | "hayir")} className={sel}>
              <option value="evet">Evet</option>
              <option value="hayir">Hayır</option>
            </select>
          </Field>
          <Field label="Kardeş Sayısı (öz kardeş)">
            <input type="number" min="0" value={kardesSayisi} onChange={e => setKardesSayisi(e.target.value)} className={inp} />
          </Field>
        </>
      )}

      {/* 3. Zümre — yalnız 1 ve 2 yoksa */}
      {!z1 && !z2 && (
        <Field label="Yaşayan Büyük Ana/Baba Sayısı (0-4)">
          <input type="number" min="0" max="4" value={buyukSayisi} onChange={e => setBuyukSayisi(e.target.value)} className={inp} />
        </Field>
      )}

      <div className="col-span-full">
        <div className="mb-3 text-[11px] font-mono uppercase tracking-widest text-accent">{result.zumreEtiket}</div>
        <Result
          rows={result.display.map(d => [
            d.ad,
            `${d.payStr}  ·  %${fmt(d.yuzde, 2)}  ·  ${fmt(d.tutar)} TL`,
          ] as [string, string])}
          note="Hesaplama TMK md.495-501 (zümre/parantel sistemi) ve md.499 (sağ kalan eşin payı) esas alınarak yapılmıştır. Eş; altsoyla 1/4, ana-baba zümresiyle 1/2, büyük ana-baba zümresiyle 3/4 pay alır. Vefat eden mirasçının payı kendi altsoyuna geçer (halefiyet/temsil). Saklı pay, ölüme bağlı tasarruflar (vasiyet), mal rejimi tasfiyesi, evlatlık ve üvey/yarım kan kardeş gibi özel durumlar bu araçta dikkate alınmaz; somut olay için danışmanlık alınız."
        />
      </div>
    </div>
  );
}

// ─── ARAÇLAR LİSTESİ ──────────────────────────────────────────────────────────

const ARACLAR = [
  { id: "miras", icon: "🏛️", baslik: "Miras Paylaşımı (Yasal Mirasçılık)", tag: "Miras Hukuku", comp: <MirasPaylasimi /> },
  { id: "kidem", icon: "💼", baslik: "Kıdem & İhbar Tazminatı", tag: "İş Hukuku", comp: <KidemIhbarTazminati /> },
  { id: "fazla-mesai", icon: "⏰", baslik: "Fazla Mesai Ücreti", tag: "İş Hukuku", comp: <FazlaMesai /> },
  { id: "yillik-izin", icon: "🏖️", baslik: "Yıllık İzin Ücreti", tag: "İş Hukuku", comp: <YillikIzin /> },
  { id: "smm", icon: "🧾", baslik: "Serbest Meslek Makbuzu (SMM)", tag: "İş Hukuku", comp: <SmmHesaplama /> },
  { id: "nafaka", icon: "👨‍👩‍👧", baslik: "Nafaka Artış / Azaltış Hesaplayıcı", tag: "Aile Hukuku", comp: <NafakaArtisi /> },
  { id: "iddet", icon: "📅", baslik: "İddet Müddeti Hesabı", tag: "Aile Hukuku", comp: <IddetMuddeti /> },
  { id: "faiz", icon: "📊", baslik: "Faiz Hesaplama (Yasal / Ticari / Avans)", tag: "Alacak", comp: <FaizHesaplama /> },
  { id: "icra-kapak", icon: "📁", baslik: "İcra Dosyası Kapak Hesabı & Harçlar (2026)", tag: "Alacak", comp: <IcraKapakHesabi /> },
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
