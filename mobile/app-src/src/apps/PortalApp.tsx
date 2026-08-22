import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  X,
  ChevronRight,
  ChevronLeft,
  Star,
  Share2,
  ExternalLink,
  Loader2,
  Landmark,
  Copy,
  Check,
  Type,
  AlertTriangle,
  BookMarked,
  Calculator,
} from 'lucide-react';

import { useRoute, navigate, match } from '../lib/router';
import { usePersisted, KEYS } from '../lib/storage';
import { share, openOnSite } from '../lib/external';
import { tapFeedback } from '../lib/haptics';
import {
  loadManifest,
  loadPack,
  searchLoaded,
  parseMaddeQuery,
  loadedPacks,
  foldTr,
  tighten,
  type Manifest,
  type Pack,
  type PackEntry,
  type SearchHit,
} from '../lib/packs';
import {
  kanunAdi,
  kanunKodu,
  kanunMeta,
  kategoriGruplari,
  KANUNLAR,
  KATEGORI,
} from '../lib/kanunlar';
import {
  temizleResmi,
  bloklaResmi,
  duzMetin,
  maddeBasligiTemizle,
  atifMetni,
  type Blok,
} from '../lib/metin';
import { atiflar, kanunAtifHaritasi, type AtifKaydi } from '../lib/atif';
import { kavramlarIcin, araclarIcin } from '../lib/baglanti';
import { okumaKaydet } from '../lib/okuma';
import { loadArchive, tierLabel, type ArchiveRow } from '../lib/yargi';
import MorePage from '../shell/MorePage';
import SettingsPage from '../shell/SettingsPage';
import EmptyState from '../shell/EmptyState';
import Serh from '../shell/Serh';

/**
 * Mevzuat — 46 kanun, 8.088 madde, tamamı çevrimdışı.
 *
 * Üç şey bu bölümü bir "metin dökümü"nden araştırma aracına çevirir:
 *
 *   1. Kanun listesi KATEGORİLİ. Alfabetik tek liste 46 kanunu «bk, spk,
 *      yukk» çorbasına çeviriyordu; hukukçunun zihnindeki tasnif başka.
 *   2. Resmî metin YENİDEN AKITILIR. PDF'ten gelen satır kırıkları cümle
 *      ortasında duruyordu (bkz. lib/metin.ts).
 *   3. Her madde İÇTİHADA BAĞLI. «Bu maddeye atıf yapan Yargıtay kararları»
 *      bölümü, mevzuat ile arşivi aynı ekranda buluşturur.
 *
 * Kanun ADLARI kütükten gelir (lib/kanunlar.ts), manifestten değil: manifest
 * adı klasör adından üretiliyordu ve dört kanunda içerikle tutmuyordu.
 */

/** İlk açılışta arama için belleğe alınan çekirdek kanunlar. */
const CORE = ['tmk', 'tbk', 'tck', 'hmk', 'iik', 'is-kanunu', 'cmk', 'ttk'];

export default function PortalApp() {
  const route = useRoute();

  const maddeMatch = match('/mevzuat/:kanun/:madde', route.path);
  if (maddeMatch) return <MaddePage kanunId={maddeMatch.kanun} maddeKey={maddeMatch.madde} />;

  const kanunMatch = match('/mevzuat/:kanun', route.path);
  if (kanunMatch) return <KanunPage kanunId={kanunMatch.kanun} />;

  if (route.path === '/ara') return <SearchPage />;
  if (route.path === '/indirilenler') return <SavedPage />;
  if (route.path === '/diger') return <MorePage />;
  if (route.path === '/ayarlar') return <SettingsPage />;

  return <KanunListPage />;
}

// ─── Ortak kancalar ──────────────────────────────────────────────────────────

function useManifest() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadManifest()
      .then((m) => alive && setManifest(m))
      .catch((e) => alive && setError(e instanceof Error ? e.message : 'yüklenemedi'));
    return () => {
      alive = false;
    };
  }, []);

  return { manifest, error };
}

function usePack(kanunId: string) {
  const [pack, setPack] = useState<Pack | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setPack(null);
    setError(null);
    loadPack(kanunId)
      .then((p) => alive && setPack(p))
      .catch((e) => alive && setError(e instanceof Error ? e.message : 'yüklenemedi'));
    return () => {
      alive = false;
    };
  }, [kanunId]);

  return { pack, error };
}

/** Okuma puntosu — üç kademe, cihazda saklanır. */
function useOkumaOlcek() {
  const [olcek, setOlcek] = usePersisted<number>(KEYS.fontScale, 1);
  useEffect(() => {
    document.documentElement.style.setProperty('--okuma-olcek', String(olcek));
  }, [olcek]);
  return [olcek, setOlcek] as const;
}

// ─── Kanun listesi ───────────────────────────────────────────────────────────

function KanunListPage() {
  const { manifest, error } = useManifest();
  const [q, setQ] = useState('');

  if (error) {
    return (
      <EmptyState
        title="Mevzuat yüklenemedi"
        body={`Uygulama içeriği okunamadı (${error}). Uygulamayı yeniden başlatmak sorunu çözebilir.`}
        actionLabel="Yeniden dene"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (!manifest) return <ListSkeleton />;

  const sayilar = new Map(manifest.packs.map((p) => [p.id, p]));
  const nq = foldTr(q.trim());

  /**
   * Arama kanun ADI, KISALTMA ve KÜTÜKTEKİ ANAHTARLAR üzerinde çalışır.
   * «borçlar» yazan TBK'yı, «boşanma» yazan TMK'yı bulur — kanun adını
   * ezberlemek zorunda kalmaz.
   */
  const eslesenler = nq
    ? manifest.packs.filter((p) => {
        const meta = kanunMeta(p.id);
        const havuz = [
          kanunAdi(p.id, p.name),
          kanunKodu(p.id),
          p.id,
          ...(meta?.arama ?? []),
        ].join(' ');
        return foldTr(havuz).includes(nq);
      })
    : manifest.packs;

  const gruplar = kategoriGruplari(eslesenler.map((p) => p.id));
  const toplamMadde = eslesenler.reduce((n, p) => n + p.articles, 0);

  return (
    <div className="page">
      <header className="pt-1 pb-3">
        <h2 className="text-[24px] leading-tight font-heading font-bold tracking-tight">
          Mevzuat
        </h2>
        <p className="mt-1 text-[13.5px] text-ink-2 leading-snug">
          {manifest.packs.length} kanun · {manifest.totalArticles.toLocaleString('tr-TR')} madde,
          resmî metniyle cihazınızda.
        </p>
      </header>

      <div className="relative mb-3">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"
          aria-hidden
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Kanun ara — borçlar, icra, boşanma…"
          aria-label="Kanun ara"
          className="w-full rounded-2xl border border-tel bg-white pl-10 pr-10 py-3.5
                     text-[15px] outline-none focus:border-[color:var(--brand)]"
        />
        {q && (
          <button
            type="button"
            aria-label="Temizle"
            onClick={() => setQ('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-full text-ink-3"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/*
        Üstteki alan kanun ADINDA arar; bu bağlantı madde METNİNDE.
        İkisini de kutu olarak koymak, üst üste iki arama kutusu gibi
        görünüyordu — ikincisi artık bir satır bağlantısı.
      */}
      <button
        type="button"
        onClick={() => navigate('/ara')}
        className="hedef inline-flex items-center gap-2 text-[13px] font-bold mb-5 -mt-1"
        style={{ color: 'var(--brand)' }}
      >
        <Search size={15} aria-hidden />
        Madde metninde ara
        <ChevronRight size={15} aria-hidden />
      </button>

      {q && (
        <p className="text-[12.5px] font-mono tracking-wide uppercase text-ink-3 mb-3">
          {eslesenler.length} kanun · {toplamMadde.toLocaleString('tr-TR')} madde
        </p>
      )}

      {eslesenler.length === 0 ? (
        <EmptyState
          title="Eşleşen kanun yok"
          body={`"${q}" bu külliyatta bulunamadı. Konu adıyla da arayabilirsiniz: «kira», «haciz», «velayet».`}
          actionLabel="Aramayı temizle"
          onAction={() => setQ('')}
        />
      ) : (
        gruplar.map((grup) => (
          <section key={grup.ad} className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: grup.renk }}
                aria-hidden
              />
              <h3 className="text-[12.5px] font-mono uppercase tracking-[0.14em] text-ink-3">
                {grup.ad}
              </h3>
              <span className="text-[12px] text-ink-3">{grup.kanunlar.length}</span>
            </div>

            <ul className="satir-grup">
              {grup.kanunlar.map((k) => {
                const p = sayilar.get(k.id);
                return (
                  <li key={k.id}>
                    <button
                      type="button"
                      onClick={() => {
                        void tapFeedback();
                        navigate(`/mevzuat/${k.id}`);
                      }}
                      className="satir hedef flex items-center gap-3"
                    >
                      <span
                        className="w-[3.2rem] shrink-0 font-mono font-bold text-[12px] leading-none"
                        style={{ color: grup.renk }}
                        aria-hidden
                      >
                        {k.kod}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[14.5px] font-semibold leading-snug">
                          {k.ad}
                        </span>
                        <span className="block text-[12.5px] text-ink-3 mt-0.5 rakam">
                          {p ? `${p.articles.toLocaleString('tr-TR')} madde` : ''}
                          {p && p.commentaries > 0 ? ` · ${p.commentaries} şerh` : ''}
                        </span>
                      </span>
                      <ChevronRight size={16} className="text-ink-4 shrink-0" aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}

      <p className="mt-6 text-[12.5px] leading-relaxed text-ink-3">
        Metinler Resmî Gazete'de yayımlanan hâlleriyle uygulamaya gömülüdür; okumak için
        internet gerekmez. Bağlayıcı metin için mevzuat.gov.tr esastır.
      </p>
    </div>
  );
}

// ─── Bir kanunun maddeleri ───────────────────────────────────────────────────

function KanunPage({ kanunId }: { kanunId: string }) {
  const { pack, error } = usePack(kanunId);
  const { manifest } = useManifest();
  const [q, setQ] = useState('');
  const [atifHarita, setAtifHarita] = useState<Map<number, number>>(new Map());

  const meta = manifest?.packs.find((p) => p.id === kanunId);
  const kutuk = kanunMeta(kanunId);
  const ad = kanunAdi(kanunId, meta?.name);
  const renk = kutuk ? KATEGORI[kutuk.kategori].renk : 'var(--brand)';

  useEffect(() => {
    let alive = true;
    kanunAtifHaritasi(kanunId).then((m) => alive && setAtifHarita(m));
    return () => {
      alive = false;
    };
  }, [kanunId]);

  const rows = useMemo(() => {
    if (!pack) return [];
    const all = Object.entries(pack)
      .map(([key, e]) => ({ key, ...e }))
      .sort((a, b) => a.n - b.n);

    const nq = foldTr(q.trim());
    if (!nq) return all;

    const tq = tighten(q);
    const asNum = parseInt(nq.replace(/\D/g, ''), 10);

    return all.filter((r) => {
      if (asNum && r.n === asNum) return true;
      const t = foldTr(r.t + ' ' + r.o.slice(0, 400));
      return t.includes(nq) || t.replace(/[\s.]+/g, '').includes(tq);
    });
  }, [pack, q]);

  if (error) {
    return (
      <EmptyState
        title="Kanun yüklenemedi"
        body={`${ad} paketi okunamadı (${error}).`}
        actionLabel="Kanun listesine dön"
        onAction={() => navigate('/mevzuat', { replace: true })}
      />
    );
  }

  if (!pack) return <ListSkeleton />;

  const icthatliMadde = atifHarita.size;

  return (
    <div className="page">
      <header className="pt-1 pb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="px-2 py-0.5 rounded-md text-[12px] font-heading font-bold tracking-wide"
            style={{ background: `${renk}16`, color: renk }}
          >
            {kanunKodu(kanunId)}
          </span>
          {kutuk && (
            <span className="text-[12px] font-mono uppercase tracking-wider text-ink-3">
              {KATEGORI[kutuk.kategori].ad}
            </span>
          )}
        </div>
        <h2 className="text-[22px] font-heading font-bold leading-tight">{ad}</h2>
        <p className="text-[12.5px] text-ink-2 mt-1">
          {Object.keys(pack).length.toLocaleString('tr-TR')} madde
          {meta && meta.commentaries > 0 ? ` · ${meta.commentaries} şerh` : ''}
          {icthatliMadde > 0 ? ` · ${icthatliMadde} maddede içtihat` : ''}
        </p>
      </header>

      {kutuk?.not && (
        <p className="mb-4 rounded-xl border border-amber-300/70 bg-amber-50 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-amber-900">
          {kutuk.not}
        </p>
      )}

      <div className="relative mb-4">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"
          aria-hidden
        />
        <input
          type="search"
          inputMode="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Madde numarası, başlık veya metin"
          aria-label="Madde ara"
          className="w-full rounded-2xl border border-tel bg-white pl-10 pr-4 py-3
                     text-[15px] outline-none focus:border-[color:var(--brand)]"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="Eşleşen madde yok"
          body="Madde numarası ya da başlıktan bir kelime deneyin."
          actionLabel="Aramayı temizle"
          onAction={() => setQ('')}
        />
      ) : (
        <ul className="satir-grup satir-liste">
          {rows.map((r) => {
            const kararSayisi = atifHarita.get(r.n) ?? 0;
            return (
              <li key={r.key}>
                <button
                  type="button"
                  onClick={() => {
                    void tapFeedback();
                    navigate(`/mevzuat/${kanunId}/${r.key}`);
                  }}
                  className="satir hedef flex items-start gap-3"
                >
                  <span
                    className="text-[12.5px] font-mono font-bold shrink-0 mt-0.5 min-w-[2.6rem]"
                    style={{ color: renk }}
                  >
                    m.{r.n}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] font-semibold leading-snug">
                      {maddeBasligiTemizle(r.t)}
                    </span>
                    <span className="block text-[12.5px] text-ink-3 leading-snug mt-0.5 line-clamp-1">
                      {duzMetin(r.o).replace(/\n/g, ' ').slice(0, 95)}
                    </span>
                    {(r.c || kararSayisi > 0) && (
                      <span className="flex flex-wrap gap-1.5 mt-1.5">
                        {r.c && (
                          <span
                            className="text-[12px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
                          >
                            ŞERH
                          </span>
                        )}
                        {kararSayisi > 0 && (
                          <span
                            className="text-[12px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(27,79,114,0.09)', color: '#1B4F72' }}
                          >
                            {kararSayisi} KARAR
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                  <ChevronRight size={16} className="text-ink-4 shrink-0 mt-1" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── Madde detayı ────────────────────────────────────────────────────────────

function MaddePage({ kanunId, maddeKey }: { kanunId: string; maddeKey: string }) {
  const { pack, error } = usePack(kanunId);
  const { manifest } = useManifest();
  const [saved, setSaved] = usePersisted<string[]>(KEYS.saved, []);
  const [olcek, setOlcek] = useOkumaOlcek();
  const [kopyalandi, setKopyalandi] = useState(false);

  const id = `${kanunId}/${maddeKey}`;
  const entry: PackEntry | undefined = pack?.[maddeKey];
  const meta = manifest?.packs.find((p) => p.id === kanunId);
  const ad = kanunAdi(kanunId, meta?.name);
  const kod = kanunKodu(kanunId);
  const kutuk = kanunMeta(kanunId);
  const renk = kutuk ? KATEGORI[kutuk.kategori].renk : 'var(--brand)';

  // Okuma geçmişine yaz — ana ekrandaki «kaldığınız yer» şeridi bunu okur.
  useEffect(() => {
    if (!entry) return;
    okumaKaydet({
      yol: `/mevzuat/${kanunId}/${maddeKey}`,
      baslik: `${kod} m. ${entry.n}`,
      altSatir: maddeBasligiTemizle(entry.t) || temizleResmi(entry.o).baslik || ad,
      tur: 'madde',
    });
  }, [entry, kanunId, maddeKey, kod, ad]);

  /** Önceki/sonraki madde — kanun içinde sıralı gezinme. */
  const komsular = useMemo(() => {
    if (!pack) return { onceki: null as string | null, sonraki: null as string | null };
    const sirali = Object.entries(pack)
      .map(([key, e]) => ({ key, n: e.n }))
      .sort((a, b) => a.n - b.n);
    const i = sirali.findIndex((x) => x.key === maddeKey);
    return {
      onceki: i > 0 ? sirali[i - 1].key : null,
      sonraki: i >= 0 && i < sirali.length - 1 ? sirali[i + 1].key : null,
    };
  }, [pack, maddeKey]);

  if (error || (pack && !entry)) {
    return (
      <EmptyState
        title="Madde bulunamadı"
        body="Bu bağlantı eski bir sürüme ait olabilir."
        actionLabel="Kanuna dön"
        onAction={() => navigate(`/mevzuat/${kanunId}`, { replace: true })}
      />
    );
  }

  if (!pack || !entry) return <ListSkeleton />;

  const { baslik: kenarBaslik, govde } = temizleResmi(entry.o);
  const bloklar = bloklaResmi(govde);
  // Madde başlığı çoğu kanunda «İş Kanunu Madde 17»den ibaret; o hâlde
  // maddenin gerçek adı kenar başlığında durur.
  const altBaslik = maddeBasligiTemizle(entry.t) || kenarBaslik;
  const isSaved = saved.includes(id);
  const duz = duzMetin(entry.o);
  const siteUrl = `https://www.avfethiguzel.com/mevzuat/${kanunId}/${maddeKey}`;

  async function kopyalaAtif() {
    const metin = atifMetni({
      kod,
      kanunAdi: ad,
      maddeNo: entry!.n,
      baslik: altBaslik,
      govde: duz,
      url: siteUrl,
    });
    try {
      await navigator.clipboard.writeText(metin);
      setKopyalandi(true);
      void tapFeedback();
      window.setTimeout(() => setKopyalandi(false), 1800);
    } catch {
      void share({ title: `${kod} m. ${entry!.n}`, text: metin, url: siteUrl });
    }
  }

  return (
    <div className="page selectable">
      <header className="pt-2 pb-3">
        {/*
          Kanunun adı başlık çubuğunda duruyor; burada tekrar yazmak aynı
          bilgiyi iki kez göstermekti. Ekranın kendi başlığı maddedir.
        */}
        <h2 className="text-[27px] font-heading font-bold leading-tight tracking-tight">
          <span style={{ color: renk }}>{kod}</span> m. {entry.n}
        </h2>
        {altBaslik && (
          <p className="text-[14px] text-ink-2 leading-snug mt-1">{altBaslik}</p>
        )}
      </header>

      <div className="flex gap-1.5 mb-4">
        <ActionButton
          label={isSaved ? 'Kayıtlı' : 'Kaydet'}
          active={isSaved}
          icon={
            <Star
              size={15}
              fill={isSaved ? 'var(--brand)' : 'none'}
              color={isSaved ? 'var(--brand)' : 'currentColor'}
            />
          }
          onClick={() => {
            void tapFeedback();
            setSaved((prev) => (isSaved ? prev.filter((s) => s !== id) : [id, ...prev]));
          }}
        />
        <ActionButton
          label={kopyalandi ? 'Kopyalandı' : 'Alıntı'}
          icon={kopyalandi ? <Check size={15} /> : <Copy size={15} />}
          onClick={kopyalaAtif}
        />
        <ActionButton
          label="Paylaş"
          icon={<Share2 size={15} />}
          onClick={() =>
            void share({
              title: `${kod} m. ${entry.n}`,
              text: duz.slice(0, 240),
              url: siteUrl,
            })
          }
        />
        <PuntoButton olcek={olcek} setOlcek={setOlcek} />
      </div>

      {entry.x === 1 && (
        <section className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3.5 mb-4 flex gap-3">
          <AlertTriangle size={17} className="text-amber-600 shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="text-[12.5px] tracking-wide uppercase font-bold text-amber-800 mb-1">
              Bu maddenin metni eksik
            </p>
            <p className="text-[13px] leading-relaxed text-ink m-0">
              Aşağıdaki metnin bir kısmı, kanun metni yerine onu özetleyen cümleler içeriyor. Bu
              maddeye dayanacaksanız resmî kaynaktan doğrulayın.
            </p>
          </div>
        </section>
      )}

      <section className="kagit mb-5">
        <p className="etiket mb-2.5">
          {entry.x === 1 ? 'Resmî metin — eksik' : 'Resmî metin'}
        </p>
        <ResmiMetin bloklar={bloklar} />
      </section>

      <IlgiliKararlar kanunId={kanunId} maddeNo={entry.n} />

      {entry.c ? (
        <section className="card p-4 mb-5">
          <h3
            className="text-[12px] tracking-[0.16em] uppercase font-bold mb-2.5"
            style={{ color: 'var(--brand)' }}
          >
            Akademik şerh
          </h3>
          <Serh metin={entry.c} />
        </section>
      ) : null}

      <IlgiliIcerik kanunId={kanunId} maddeNo={entry.n} />

      <nav className="flex gap-2 mt-6" aria-label="Madde gezinmesi">
        <KomsuButton
          yon="onceki"
          kanunId={kanunId}
          hedef={komsular.onceki}
          pack={pack}
        />
        <KomsuButton
          yon="sonraki"
          kanunId={kanunId}
          hedef={komsular.sonraki}
          pack={pack}
        />
      </nav>

      <button
        type="button"
        className="btn-ghost w-full mt-3"
        onClick={() => void openOnSite(`/mevzuat/${kanunId}/${maddeKey}`)}
      >
        <ExternalLink size={15} /> Sitede aç
      </button>

      <p className="mt-5 text-[12.5px] leading-relaxed text-ink-3">
        Bilgilendirme amaçlıdır. Bağlayıcı metin için mevzuat.gov.tr esas alınmalıdır.
      </p>
    </div>
  );
}

/** Resmî metnin fıkra/bent yapısını koruyan dizgi. */
function ResmiMetin({ bloklar }: { bloklar: Blok[] }) {
  return (
    <div className="space-y-2.5">
      {bloklar.map((b, i) => {
        if (b.tur === 'baslik') {
          return (
            <p
              key={i}
              className="text-[12px] font-heading font-bold tracking-wide uppercase text-ink-2 mt-3 first:mt-0 m-0"
            >
              {b.metin}
            </p>
          );
        }
        if (b.isaret) {
          return (
            <div key={i} className="okuma-bent">
              <span className="okuma-isaret" aria-hidden>
                {b.isaret}
              </span>
              <p className="okuma m-0 flex-1">{b.metin}</p>
            </div>
          );
        }
        return (
          <p key={i} className="okuma m-0">
            {b.metin}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Bu maddeye atıf yapan Yargıtay kararları.
 *
 * Uygulamada mevzuatla içtihadın buluştuğu tek yer. İndeks derleme anında
 * 21.702 karar metninden çıkarılır; burada yalnız okunur ve kademeye göre
 * (İçtihadı Birleştirme → Genel Kurul → daire) sıralı gösterilir.
 */
function IlgiliKararlar({ kanunId, maddeNo }: { kanunId: string; maddeNo: number }) {
  const [kayit, setKayit] = useState<AtifKaydi | null>(null);
  const [rows, setRows] = useState<ArchiveRow[]>([]);
  const [hepsi, setHepsi] = useState(false);

  useEffect(() => {
    let alive = true;
    setKayit(null);
    setRows([]);
    setHepsi(false);
    atiflar(kanunId, maddeNo).then(async (k) => {
      if (!alive || !k) return;
      setKayit(k);
      const arsiv = await loadArchive();
      if (!alive) return;
      const index = new Map(arsiv.map((r) => [r.i, r]));
      setRows(k.ids.map((id) => index.get(id)).filter(Boolean) as ArchiveRow[]);
    });
    return () => {
      alive = false;
    };
  }, [kanunId, maddeNo]);

  if (!kayit || rows.length === 0) return null;

  const gorunen = hepsi ? rows : rows.slice(0, 4);

  return (
    <section className="mb-5">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-[12px] tracking-[0.16em] uppercase font-bold flex items-center gap-1.5" style={{ color: '#1B4F72' }}>
          <Landmark size={13} aria-hidden />
          Bu maddeye atıf yapan kararlar
        </h3>
        <span className="text-[12px] font-mono text-ink-3">{kayit.n}</span>
      </div>

      <ul className="space-y-1.5">
        {gorunen.map((r) => (
          <li key={r.i}>
            <button
              type="button"
              onClick={() => {
                void tapFeedback();
                navigate(`/karar/${r.i}`);
              }}
              className="w-full rounded-2xl border border-[#1B4F72]/15 bg-[#1B4F72]/[0.035] px-3.5 py-3 text-left tap"
            >
              <span className="block text-[12px] font-mono uppercase tracking-wide text-[#1B4F72]/70">
                {tierLabel(r.r) || r.d} · {r.t}
              </span>
              <span className="block text-[13.5px] font-semibold leading-snug mt-0.5">
                {r.j?.[0] || r.v || r.k}
              </span>
              {r.j?.[0] || r.v ? (
                <span className="block text-[12px] text-ink-3 mt-0.5 truncate">{r.k}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {rows.length > 4 && (
        <button
          type="button"
          onClick={() => setHepsi((v) => !v)}
          className="mt-2 text-[12.5px] font-bold"
          style={{ color: '#1B4F72' }}
        >
          {hepsi ? 'Daha az göster' : `${rows.length - 4} karar daha`}
        </button>
      )}

      {kayit.n > rows.length && (
        <p className="mt-1.5 text-[12px] text-ink-3 m-0">
          Toplam {kayit.n} karar bu maddeye atıf yapıyor; en yüksek kademeli {rows.length} tanesi
          listelendi.
        </p>
      )}
    </section>
  );
}

/** İlgili kavram ve hesaplama aracı — portalın çapraz bağları tersine çevrilmiş. */
function IlgiliIcerik({ kanunId, maddeNo }: { kanunId: string; maddeNo: number }) {
  const kavramlar = kavramlarIcin(kanunId, maddeNo).slice(0, 3);
  const araclar = araclarIcin(kanunId, maddeNo).slice(0, 3);

  if (!kavramlar.length && !araclar.length) return null;

  return (
    <section className="mb-5">
      <h3 className="text-[12px] tracking-[0.16em] uppercase font-bold text-ink-3 mb-2">
        İlgili
      </h3>
      <ul className="space-y-1.5">
        {kavramlar.map((k) => (
          <li key={k.slug}>
            <button
              type="button"
              onClick={() => navigate(`/kavram/${k.slug}`)}
              className="w-full card px-3.5 py-3 flex items-start gap-2.5 text-left tap"
            >
              <BookMarked size={15} className="shrink-0 mt-0.5 text-ink-3" aria-hidden />
              <span className="flex-1 min-w-0">
                <span className="block text-[13.5px] font-semibold leading-snug">{k.baslik}</span>
                <span className="block text-[12px] text-ink-3 mt-0.5 line-clamp-2 leading-snug">
                  {k.ozet}
                </span>
              </span>
            </button>
          </li>
        ))}
        {araclar.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => navigate(`/arac/${a.id}`)}
              className="w-full card px-3.5 py-3 flex items-center gap-2.5 text-left tap"
            >
              <Calculator size={15} className="shrink-0 text-ink-3" aria-hidden />
              <span className="flex-1 min-w-0">
                <span className="block text-[13.5px] font-semibold leading-snug">{a.baslik}</span>
                <span className="block text-[12px] text-ink-3 mt-0.5">{a.tag}</span>
              </span>
              <ChevronRight size={15} className="text-ink-4 shrink-0" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function KomsuButton({
  yon,
  kanunId,
  hedef,
  pack,
}: {
  yon: 'onceki' | 'sonraki';
  kanunId: string;
  hedef: string | null;
  pack: Pack;
}) {
  if (!hedef) return <span className="flex-1" />;
  const e = pack[hedef];
  const onceki = yon === 'onceki';

  return (
    <button
      type="button"
      onClick={() => {
        void tapFeedback();
        navigate(`/mevzuat/${kanunId}/${hedef}`);
        window.scrollTo(0, 0);
      }}
      className={`flex-1 card px-3 py-2.5 flex items-center gap-2 tap ${
        onceki ? 'text-left' : 'text-right flex-row-reverse'
      }`}
    >
      {onceki ? (
        <ChevronLeft size={16} className="text-ink-3 shrink-0" aria-hidden />
      ) : (
        <ChevronRight size={16} className="text-ink-3 shrink-0" aria-hidden />
      )}
      <span className="flex-1 min-w-0">
        <span className="block text-[12px] font-mono uppercase tracking-wide text-ink-3">
          {onceki ? 'önceki' : 'sonraki'}
        </span>
        <span className="block text-[13px] font-semibold truncate">m. {e?.n}</span>
      </span>
    </button>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex-1 rounded-xl border border-tel bg-white px-2 py-2.5
                 flex flex-col items-center gap-1 tap"
    >
      <span className="text-ink">{icon}</span>
      <span className="text-[12px] font-semibold leading-none">{label}</span>
    </button>
  );
}

/** Okuma puntosu — üç kademe arasında döner. */
function PuntoButton({
  olcek,
  setOlcek,
}: {
  olcek: number;
  setOlcek: (v: number | ((p: number) => number)) => void;
}) {
  const KADEME = [1, 1.15, 1.32];
  const i = Math.max(0, KADEME.indexOf(olcek));
  return (
    <button
      type="button"
      onClick={() => {
        void tapFeedback();
        setOlcek(KADEME[(i + 1) % KADEME.length]);
      }}
      aria-label={`Yazı boyutu — ${i + 1}. kademe`}
      className="flex-1 rounded-xl border border-tel bg-white px-2 py-2.5
                 flex flex-col items-center gap-1 tap"
    >
      <span className="text-ink">
        <Type size={15} />
      </span>
      <span className="text-[12px] font-semibold leading-none">
        {['Normal', 'Büyük', 'En büyük'][i]}
      </span>
    </button>
  );
}

// ─── Arama ───────────────────────────────────────────────────────────────────

function SearchPage() {
  const { manifest } = useManifest();
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  const names = useMemo(
    () => new Map((manifest?.packs ?? []).map((p) => [p.id, kanunAdi(p.id, p.name)])),
    [manifest]
  );

  useEffect(() => {
    if (!manifest) return;
    let alive = true;
    (async () => {
      for (const id of CORE) {
        if (!alive) return;
        try {
          await loadPack(id);
        } catch {
          /* eksik paket aramayı durdurmasın */
        }
      }
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [manifest]);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setHits([]);
      return;
    }

    const t = window.setTimeout(async () => {
      setBusy(true);

      const direct = parseMaddeQuery(term, manifest?.packs.map((p) => p.id) ?? []);
      if (direct?.kanunId && direct.maddeNo) {
        try {
          await loadPack(direct.kanunId);
        } catch {
          /* yoksay */
        }
        navigate(`/mevzuat/${direct.kanunId}/madde-${direct.maddeNo}`);
        setBusy(false);
        return;
      }

      setHits(searchLoaded(term, names));
      setBusy(false);
    }, 220);

    return () => window.clearTimeout(t);
  }, [q, names, manifest]);

  return (
    <div className="page">
      <div className="relative mb-3">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"
          aria-hidden
        />
        <input
          type="search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="TBK 13 · dürüstlük · haksız fiil"
          aria-label="Madde metninde ara"
          className="w-full rounded-2xl border border-tel bg-white pl-10 pr-10 py-3.5
                     text-[15px] outline-none focus:border-[color:var(--brand)]"
        />
        {busy && (
          <Loader2
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-ink-3"
            aria-hidden
          />
        )}
      </div>

      {!ready && (
        <p className="text-[12.5px] text-ink-3 mb-3">
          Çekirdek kanunlar belleğe alınıyor… ({loadedPacks().length}/{CORE.length})
        </p>
      )}

      {q.trim().length >= 2 && hits.length === 0 && !busy ? (
        <EmptyState
          title="Sonuç yok"
          body={`"${q}" için madde bulunamadı. Arama şimdilik çekirdek kanunlarda çalışır; belirli bir kanunda aramak için o kanunun sayfasını açın.`}
          actionLabel="Kanun listesine dön"
          onAction={() => navigate('/mevzuat')}
        />
      ) : (
        <ul className="satir-grup satir-liste">
          {hits.map((h) => (
            <li key={`${h.kanunId}/${h.key}`}>
              <button
                type="button"
                onClick={() => navigate(`/mevzuat/${h.kanunId}/${h.key}`)}
                className="satir hedef"
              >
                <span className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[12px] font-mono font-bold"
                    style={{ color: 'var(--brand)' }}
                  >
                    {kanunKodu(h.kanunId)} m.{h.maddeNo}
                  </span>
                  <span className="text-[12px] text-ink-3 truncate">{h.kanunName}</span>
                </span>
                <span className="block text-[14px] font-semibold leading-snug">
                  {maddeBasligiTemizle(h.title) || `Madde ${h.maddeNo}`}
                </span>
                <span className="block text-[12.5px] text-ink-2 leading-snug mt-1">
                  {h.excerpt}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Kaydedilenler ───────────────────────────────────────────────────────────

function SavedPage() {
  const [saved] = usePersisted<string[]>(KEYS.saved, []);
  const { manifest } = useManifest();

  if (saved.length === 0) {
    return (
      <EmptyState
        icon={<Star size={20} />}
        title="Kayıtlı madde yok"
        body="Bir maddeyi açıp «Kaydet» dediğinizde burada birikir. Tüm mevzuat zaten cihazınızda — kayıt yalnız hızlı erişim içindir."
        actionLabel="Mevzuata git"
        onAction={() => navigate('/mevzuat')}
      />
    );
  }

  return (
    <div className="page">
      <h2 className="text-[22px] font-heading font-bold mb-1">Kaydettikleriniz</h2>
      <p className="text-[12.5px] text-ink-2 mb-3">{saved.length} madde</p>
      <ul className="satir-grup">
        {saved.map((id) => {
          const [kanunId, key] = id.split('/');
          const name = kanunAdi(kanunId, manifest?.packs.find((p) => p.id === kanunId)?.name);
          const no = key?.replace('madde-', '') ?? '';
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => navigate(`/mevzuat/${kanunId}/${key}`)}
                className="satir hedef flex items-center gap-3"
              >
                <span
                  className="text-[12px] font-mono font-bold shrink-0 min-w-[3.2rem]"
                  style={{ color: 'var(--brand)' }}
                >
                  {kanunKodu(kanunId)}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[14px] font-semibold truncate">m. {no}</span>
                  <span className="block text-[12px] text-ink-3 truncate">{name}</span>
                </span>
                <ChevronRight size={16} className="text-ink-4" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Parçacıklar ─────────────────────────────────────────────────────────────

/**
 * Liste satırının başlığı.
 *
 * `title` çoğu kanunda «İş Kanunu Madde 17»den ibaret; onu olduğu gibi
 * basmak, madde numarasının yanında aynı numarayı ikinci kez göstermek
 * demekti. Maddenin gerçek adı resmî metnin kenar başlığındadır.
 */
function satirBasligi(r: PackEntry & { key: string }): string {
  const temiz = maddeBasligiTemizle(r.t);
  if (temiz) return temiz;
  const kenar = temizleResmi(r.o).baslik;
  if (kenar) return kenar;
  return `Madde ${r.n}`;
}

/** Satır altındaki tek satırlık önizleme — tam blok çözümlemesine gerek yok. */
function satirOnizleme(o: string): string {
  return temizleResmi(o)
    .govde.replace(/\s+/g, ' ')
    .trim()
    .slice(0, 95);
}

function ListSkeleton() {
  return (
    <div className="page space-y-2" aria-busy="true" aria-label="Yükleniyor">
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="skeleton h-16 rounded-2xl" />
      ))}
    </div>
  );
}

/** Kanun kütüğünde olup pakette bulunmayan kanun var mı? Ayarlar ekranı kullanır. */
export function kutuktekiKanunSayisi(): number {
  return KANUNLAR.length;
}
