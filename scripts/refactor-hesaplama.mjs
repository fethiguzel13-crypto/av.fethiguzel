import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const p = join(root, 'components/hesaplama/HesaplamaTools.tsx');
let s = readFileSync(p, 'utf8');

if (!s.includes('Share2')) {
  s = s.replace(
    'import { ChevronDown, ChevronUp, Info, Copy, Check, Search, Printer } from "lucide-react";',
    'import { ChevronDown, ChevronUp, Info, Copy, Check, Search, Printer, Share2, ExternalLink } from "lucide-react";'
  );
}

const newTools = `
// ─── YENİ: KİRA TESPİT (ÜFE SENARYOSU) ────────────────────────────────────────
function KiraTespitUfe() {
  const [mevcut, setMevcut] = useState("15000");
  const [ufeYillik, setUfeYillik] = useState("45");
  const [yil, setYil] = useState("5");
  const m = parseFloat(mevcut) || 0;
  const u = (parseFloat(ufeYillik) || 0) / 100;
  const y = Math.max(1, parseInt(yil) || 5);
  const tespit = m * Math.pow(1 + u, y);
  const artis = tespit - m;
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="Mevcut aylık kira (TL)"><MoneyInput value={mevcut} onChange={setMevcut} /></Field>
        <Field label="Varsayılan yıllık ÜFE %"><MoneyInput value={ufeYillik} onChange={setUfeYillik} placeholder="örn. 45" /></Field>
        <Field label="Sözleşme / dolum yılı">
          <input type="number" min={1} max={30} value={yil} onChange={e => setYil(e.target.value)} className={inp} />
        </Field>
      </div>
      <Result
        rows={[
          ["Senaryo tespit kirası (aylık)", fmt(tespit) + " TL"],
          ["Mevcut kira", fmt(m) + " TL"],
          ["Fark (kabaca)", fmt(artis) + " TL"],
          ["Kullanılan model", \`Bileşik: (1 + ÜFE)^\${y}\`],
        ]}
        note="⚠️ Bilgilendirme senaryosudur. Kira tespit davasında emsal, rayiç, bilirkişi ve TBK ölçütleri esastır; bu hesap mahkeme sonucu veya garanti değildir."
      />
    </div>
  );
}

// ─── YENİ: CEZA ZAMANAŞIMI (TCK KABACA) ───────────────────────────────────────
function CezaZamanasimi() {
  const [ustSinirYil, setUstSinirYil] = useState("5");
  const [baslangic, setBaslangic] = useState(new Date().toISOString().slice(0, 10));
  const [tur, setTur] = useState("dava");
  const y = parseFloat(ustSinirYil) || 0;
  let zaYil = 8;
  if (y >= 20) zaYil = 30;
  else if (y >= 5) zaYil = 15;
  else if (y >= 2) zaYil = 8;
  else if (y > 0) zaYil = 5;
  else zaYil = 3;
  if (tur === "ceza") zaYil = Math.min(40, Math.round(zaYil * 1.5));
  const bas = new Date(baslangic + "T12:00:00");
  const bit = new Date(bas);
  bit.setFullYear(bit.getFullYear() + zaYil);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="Kanuni ceza üst sınırı (yıl)">
          <input type="number" min={0} step={0.5} value={ustSinirYil} onChange={e => setUstSinirYil(e.target.value)} className={inp} />
        </Field>
        <Field label="Başlangıç tarihi (suç / kesinleşme)">
          <input type="date" value={baslangic} onChange={e => setBaslangic(e.target.value)} className={inp} />
        </Field>
        <Field label="Tür">
          <select value={tur} onChange={e => setTur(e.target.value)} className={sel}>
            <option value="dava">Dava zamanaşımı (kabaca)</option>
            <option value="ceza">Ceza zamanaşımı (kabaca)</option>
          </select>
        </Field>
      </div>
      <Result
        rows={[
          ["Kabaca zamanaşımı süresi", \`\${zaYil} yıl\`],
          ["Tahmini bitiş", fmtDate(bit)],
          ["Model", tur === "dava" ? "TCK m.66 basitleştirilmiş dilim" : "TCK m.68 kabaca çarpan"],
        ]}
        note="⚠️ ÇOK KABA MODEL. Özel suçlar, kesilme/durma ve lehe kanun bu aracı geçersiz kılabilir. Kesin değerlendirme için ceza avukatına danışın."
      />
    </div>
  );
}

// ─── YENİ: İŞ KAZASI GEÇİCİ İŞ GÖREMEZLİK ─────────────────────────────────────
function IsKazasiGecici() {
  const [gunluk, setGunluk] = useState("1000");
  const [gun, setGun] = useState("30");
  const [oran, setOran] = useState("66.7");
  const g = parseFloat(gunluk) || 0;
  const n = parseInt(gun) || 0;
  const o = (parseFloat(oran) || 0) / 100;
  const toplam = g * n * o;
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="Günlük kazanç (TL)"><MoneyInput value={gunluk} onChange={setGunluk} /></Field>
        <Field label="İstirahat günü">
          <input type="number" min={1} value={gun} onChange={e => setGun(e.target.value)} className={inp} />
        </Field>
        <Field label="Ödenek oranı % (varsayım)">
          <MoneyInput value={oran} onChange={setOran} />
        </Field>
      </div>
      <Result
        rows={[
          ["Kabaca ödenek toplamı", fmt(toplam) + " TL"],
          ["Formül", "günlük × gün × oran"],
        ]}
        note="⚠️ SGK resmî hesabı esastır. Maddi/manevi tazminat ve maluliyet bu araca dahil değildir."
      />
    </div>
  );
}

`;

if (!s.includes('function KiraTespitUfe')) {
  s = s.replace('// ─── ARAÇLAR LİSTESİ', newTools + '\n// ─── ARAÇLAR LİSTESİ');
}

if (!s.includes('id: "kira-tespit"')) {
  s = s.replace(
    '{ id: "kira", icon: "🏠", baslik: "Kira Artış Oranı", tag: "Gayrimenkul", comp: <KiraArtis /> },',
    '{ id: "kira", icon: "🏠", baslik: "Kira Artış Oranı", tag: "Gayrimenkul", comp: <KiraArtis /> },\n  { id: "kira-tespit", icon: "📈", baslik: "Kira Tespit — ÜFE Senaryosu", tag: "Gayrimenkul", comp: <KiraTespitUfe /> },'
  );
}
if (!s.includes('id: "ceza-zamanasimi"')) {
  s = s.replace(
    '{ id: "zamanasimi", icon: "⏱️", baslik: "Zamanaşımı Kontrol Sihirbazı", tag: "Usul", comp: <ZamanAsimiKontrol /> },',
    '{ id: "zamanasimi", icon: "⏱️", baslik: "Zamanaşımı Kontrol Sihirbazı", tag: "Usul", comp: <ZamanAsimiKontrol /> },\n  { id: "ceza-zamanasimi", icon: "⌛", baslik: "Ceza Zamanaşımı (TCK kabaca)", tag: "Usul", comp: <CezaZamanasimi /> },'
  );
}
if (!s.includes('id: "is-kazasi"')) {
  s = s.replace(
    '{ id: "issizlik-maasi", icon: "🛟", baslik: "İşsizlik Maaşı (Ödeneği) 2026", tag: "İş Hukuku", comp: <IssizlikMaasi /> },',
    '{ id: "issizlik-maasi", icon: "🛟", baslik: "İşsizlik Maaşı (Ödeneği) 2026", tag: "İş Hukuku", comp: <IssizlikMaasi /> },\n  { id: "is-kazasi", icon: "🩹", baslik: "İş Kazası — Geçici İş Göremezlik Kabaca", tag: "İş Hukuku", comp: <IsKazasiGecici /> },'
  );
}

const exportBlock = `
export function getToolComponent(id: string): React.ReactNode | null {
  const found = ARACLAR.find(a => a.id === id);
  return found ? found.comp : null;
}

export function getAllToolIds(): string[] {
  return ARACLAR.map(a => a.id);
}

export { ARACLAR };

/** Tek araç sayfası gövdesi */
export function HesaplamaToolBody({ id, title }: { id: string; title: string }) {
  const comp = getToolComponent(id);
  if (!comp) {
    return <p className="text-charcoal/50 text-sm">Araç bulunamadı.</p>;
  }
  return (
    <KartBaslikContext.Provider value={title}>
      <div className="bg-white border border-charcoal/8 rounded-2xl p-4 sm:p-6 shadow-sm">
        {comp}
      </div>
    </KartBaslikContext.Provider>
  );
}

/** Hub: arama + kart listesi (detay sayfasına link) */
export default function HesaplamaHub() {
  const [arama, setArama] = useState("");
  const [aktifTag, setAktifTag] = useState<string | null>(null);
  const tumTagler = Array.from(new Set(ARACLAR.map(a => a.tag)));
  const q = arama.trim().toLocaleLowerCase("tr-TR");
  const filtrelenmis = ARACLAR.filter(a => {
    const aramaUyar = !q || a.baslik.toLocaleLowerCase("tr-TR").includes(q) || a.tag.toLocaleLowerCase("tr-TR").includes(q);
    const tagUyar = !aktifTag || a.tag === aktifTag;
    return aramaUyar && tagUyar;
  });
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 sm:pt-32 md:pt-36 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
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
              esas alınarak hazırlanmış {ARACLAR.length} hesaplama aracı. Her aracın kendi sayfası vardır.
            </p>
            <p className="mt-3 sm:mt-4 inline-flex items-start gap-2 text-[10px] sm:text-[11px] text-charcoal/35 font-mono bg-charcoal/4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl leading-relaxed">
              <Info size={11} className="shrink-0 mt-0.5" />
              <span>2026 mevzuat · Tarife güncellemeleri: /tarife-guncellemeleri · Kesin sonuç için avukata danışın</span>
            </p>
          </div>

          <div className="mb-5 sm:mb-7">
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/30 pointer-events-none" />
              <input
                type="text"
                value={arama}
                onChange={e => setArama(e.target.value)}
                placeholder="Araç ara — örn. kıdem, faiz, vekalet, infaz, miras..."
                aria-label="Hesaplama aracı ara"
                className="w-full border border-charcoal/15 rounded-full pl-10 pr-4 py-2.5 sm:py-3 text-sm text-charcoal bg-white focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setAktifTag(null)}
                className={\`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors \${aktifTag === null ? "bg-charcoal text-cream" : "bg-charcoal/5 text-charcoal/45 hover:bg-charcoal/10"}\`}
              >
                Tümü ({ARACLAR.length})
              </button>
              {tumTagler.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAktifTag(aktifTag === t ? null : t)}
                  className={\`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors \${aktifTag === t ? "bg-charcoal text-cream" : "bg-charcoal/5 text-charcoal/45 hover:bg-charcoal/10"}\`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filtrelenmis.map(a => (
              <Link
                key={a.id}
                href={\`/hesaplama/\${a.id}\`}
                className="group flex gap-3 items-start p-4 sm:p-5 bg-white border border-charcoal/8 rounded-2xl hover:border-accent/40 hover:shadow-md transition-all"
              >
                <span className="text-2xl shrink-0" aria-hidden>{a.icon}</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-accent mb-1">{a.tag}</p>
                  <h2 className="text-sm sm:text-base font-bold text-charcoal group-hover:text-accent transition-colors leading-snug">{a.baslik}</h2>
                  <p className="mt-2 text-[11px] text-charcoal/40 font-medium">Hesapla →</p>
                </div>
              </Link>
            ))}
            {filtrelenmis.length === 0 && (
              <div className="col-span-full text-center py-10 text-sm text-charcoal/40">
                Aramanızla eşleşen araç bulunamadı.
              </div>
            )}
          </div>

          <div className="mt-10 sm:mt-16 bg-charcoal rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-cream mb-2 sm:mb-3">
              Hesaplamanın Ötesine Mi İhtiyacınız Var?
            </h3>
            <p className="text-cream/55 mb-5 sm:mb-6 text-sm leading-relaxed max-w-md mx-auto">
              Hesaplama araçları genel bilgi verir. Ön değerlendirme formu veya e-posta ile iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/on-form" className="inline-block bg-accent text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm hover:bg-accent/90 transition-colors">
                Ön değerlendirme formu
              </Link>
              <Link href="/#iletisim" className="inline-block bg-cream/10 text-cream px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm hover:bg-cream/20 transition-colors">
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
`;

const marker = '// ─── SAYFA';
const idx = s.indexOf(marker);
const idx2 = s.indexOf('export default function HesaplamaPage');
if (idx !== -1) {
  s = s.slice(0, idx) + exportBlock;
} else if (idx2 !== -1) {
  s = s.slice(0, idx2) + exportBlock;
} else {
  throw new Error('Could not find page export to replace');
}

writeFileSync(p, s);
console.log('OK', p, 'lines', s.split('\n').length);
