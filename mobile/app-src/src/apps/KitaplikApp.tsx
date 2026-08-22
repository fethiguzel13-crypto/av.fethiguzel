import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  BookMarked,
  GraduationCap,
  ChevronRight,
  Search,
  X,
  Copy,
  Check,
  Share2,
  Scale,
  Calculator,
  FileText,
} from 'lucide-react';

import { useRoute, navigate, match } from '../lib/router';
import { tapFeedback } from '../lib/haptics';
import { share } from '../lib/external';
import { usePersisted, KEYS } from '../lib/storage';
import { foldTr } from '../lib/packs';
import { kanunAdi, kanunKodu } from '../lib/kanunlar';
import {
  tumKavramlar,
  kavramBul,
  kavramMaddeleri,
  kavramAraclari,
  kavramRehberleri,
} from '../lib/baglanti';
import { loadEserler, okumaSuresi, type Eser } from '../lib/kutuphane';
import MorePage from '../shell/MorePage';
import SettingsPage from '../shell/SettingsPage';
import EmptyState from '../shell/EmptyState';

/**
 * Kitaplık — okunacak her şeyin tek çatısı.
 *
 * Uygulama dört bölümken rehber tek başına bir sekmeydi ve kavram sözlüğü
 * ile akademik eserler hiç yoktu; ikisi de yalnız sitede duruyordu. Bu
 * bölüm üçünü bir araya getirir:
 *
 *   · Vatandaş rehberi — «ne yapmalıyım» sorusunun cevabı
 *   · Kavram sözlüğü   — «bu terim ne demek» sorusunun cevabı
 *   · Akademik eserler — yazarın makaleleri, tam metin
 *
 * Rehber alt yolları RehberApp'e devredilir; o bileşen zaten test edilmiş
 * durumda, burada yeniden yazılmaz.
 */

const RehberApp = lazy(() => import('./RehberApp'));

/** Rehber bileşenine ait yollar — Kitaplık bunları devreder. */
const REHBER_YOLLARI = ['/rehber', '/kategori', '/kategoriler', '/kaydettiklerim'];

function rehberYolu(path: string): boolean {
  return REHBER_YOLLARI.some((p) => path === p || path.startsWith(`${p}/`));
}

export default function KitaplikApp() {
  const route = useRoute();

  if (route.path === '/diger') return <MorePage />;
  if (route.path === '/ayarlar') return <SettingsPage />;

  if (rehberYolu(route.path)) {
    return (
      <Suspense fallback={<Skeleton />}>
        <RehberApp />
      </Suspense>
    );
  }

  const kavramMatch = match('/kavram/:slug', route.path);
  if (kavramMatch) return <KavramPage slug={kavramMatch.slug} />;
  if (route.path === '/kavram') return <KavramListPage />;

  const eserMatch = match('/eser/:slug', route.path);
  if (eserMatch) return <EserPage slug={eserMatch.slug} />;
  if (route.path === '/eserler') return <EserListPage />;

  return <HubPage />;
}

// ─── Hub ─────────────────────────────────────────────────────────────────────

function HubPage() {
  const [eserSayisi, setEserSayisi] = useState<number | null>(null);
  const kavramSayisi = tumKavramlar().length;

  useEffect(() => {
    let alive = true;
    loadEserler().then((l) => alive && setEserSayisi(l.length));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="page">
      <header className="pt-1 pb-4">
        <h2 className="text-[24px] leading-tight font-heading font-bold tracking-tight">
          Kitaplık
        </h2>
        <p className="mt-1 text-[13.5px] text-ink-2 leading-snug">
          Rehberler, kavram sözlüğü ve akademik eserler — tamamı çevrimdışı okunur.
        </p>
      </header>

      <ul className="space-y-2.5">
        <HubCard
          renk="#6B4F3A"
          icon={<BookOpen size={20} />}
          baslik="Vatandaş rehberi"
          alt="Merci, süre, belge — adım adım anlatım"
          onClick={() => navigate('/rehber')}
        />
        <HubCard
          renk="#4B3F72"
          icon={<BookMarked size={20} />}
          baslik="Kavram sözlüğü"
          alt={`${kavramSayisi} hukuki kavram, dayanağı ve ilgili araçlarıyla`}
          onClick={() => navigate('/kavram')}
        />
        <HubCard
          renk="#7B241C"
          icon={<GraduationCap size={20} />}
          baslik="Akademik eserler"
          alt={
            eserSayisi === null
              ? 'Makaleler, tam metin'
              : `${eserSayisi} makale, tam metin cihazda`
          }
          onClick={() => navigate('/eserler')}
        />
      </ul>

      <p className="mt-8 text-[12.5px] leading-relaxed text-ink-3">
        Rehber ve kavram metinleri bilgilendirme amaçlıdır; hukuki tavsiye yerine geçmez.
        Akademik eserler yazarın kendi çalışmalarıdır.
      </p>
    </div>
  );
}

function HubCard({
  renk,
  icon,
  baslik,
  alt,
  onClick,
}: {
  renk: string;
  icon: React.ReactNode;
  baslik: string;
  alt: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => {
          void tapFeedback();
          onClick();
        }}
        className="w-full card p-4 flex items-center gap-3 text-left tap"
      >
        <span
          className="w-11 h-11 rounded-2xl grid place-items-center text-white shrink-0"
          style={{ background: renk }}
          aria-hidden
        >
          {icon}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[16px] font-heading font-bold">{baslik}</span>
          <span className="block text-[12.5px] text-ink-2 mt-0.5 leading-snug">{alt}</span>
        </span>
        <ChevronRight size={18} className="text-ink-4 shrink-0" aria-hidden />
      </button>
    </li>
  );
}

// ─── Kavram sözlüğü ──────────────────────────────────────────────────────────

function KavramListPage() {
  const [q, setQ] = useState('');
  const kavramlar = tumKavramlar();

  const eslesen = useMemo(() => {
    const nq = foldTr(q.trim());
    if (!nq) return kavramlar;
    return kavramlar.filter((k) =>
      foldTr([k.baslik, k.ozet, ...(k.keywords || [])].join(' ')).includes(nq)
    );
  }, [q, kavramlar]);

  return (
    <div className="page">
      <header className="pt-1 pb-3">
        <h2 className="text-[22px] font-heading font-bold leading-tight">Kavram sözlüğü</h2>
        <p className="text-[12.5px] text-ink-2 mt-1">
          {kavramlar.length} kavram · dayanak maddesi ve ilgili araçlarıyla
        </p>
      </header>

      <div className="relative mb-4">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"
          aria-hidden
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Kavram ara — kıdem, zamanaşımı, ayıp…"
          aria-label="Kavram ara"
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

      {eslesen.length === 0 ? (
        <EmptyState
          title="Kavram bulunamadı"
          body={`"${q}" sözlükte yok. Madde metninde aramayı deneyebilirsiniz.`}
          actionLabel="Mevzuatta ara"
          onAction={() => navigate('/ara')}
        />
      ) : (
        <ul className="satir-grup">
          {eslesen.map((k) => (
            <li key={k.slug}>
              <button
                type="button"
                onClick={() => {
                  void tapFeedback();
                  navigate(`/kavram/${k.slug}`);
                }}
                className="satir hedef"
              >
                <span className="block text-[15px] font-heading font-bold leading-snug">
                  {k.baslik}
                </span>
                <span className="block text-[12.5px] text-ink-2 mt-1 leading-snug line-clamp-2">
                  {k.ozet}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function KavramPage({ slug }: { slug: string }) {
  const kavram = kavramBul(slug);
  const [kopyalandi, setKopyalandi] = useState(false);

  if (!kavram) {
    return (
      <EmptyState
        title="Kavram bulunamadı"
        body="Bu bağlantı eski bir sürüme ait olabilir."
        actionLabel="Sözlüğe dön"
        onAction={() => navigate('/kavram', { replace: true })}
      />
    );
  }

  const maddeler = kavramMaddeleri(kavram);
  const araclar = kavramAraclari(kavram);
  const rehberler = kavramRehberleri(kavram);

  /**
   * «Kısa cevap» panosu — forum, WhatsApp ve dilekçe eki için hazır metin.
   * Portalda bu alan zaten var (miniCevap); mobilde kopyalanabilir olması
   * onu gerçekten kullanılır kılar.
   */
  async function kopyala() {
    try {
      await navigator.clipboard.writeText(kavram!.miniCevap);
      setKopyalandi(true);
      void tapFeedback();
      window.setTimeout(() => setKopyalandi(false), 1800);
    } catch {
      void share({ title: kavram!.baslik, text: kavram!.miniCevap });
    }
  }

  return (
    <div className="page selectable">
      <header className="pt-1 pb-3">
        <button
          type="button"
          onClick={() => navigate('/kavram')}
          className="text-[12px] font-mono uppercase tracking-[0.14em] text-ink-3 tap inline-flex items-center min-h-[44px] pr-3 -my-1"
        >
          Kavram sözlüğü
        </button>
        <h2 className="text-[25px] font-heading font-bold leading-tight mt-1 tracking-tight">
          {kavram.baslik}
        </h2>
        <p className="text-[14px] text-ink-2 leading-snug mt-1.5">{kavram.ozet}</p>
      </header>

      <section className="kagit mb-5">
        <p className="text-[12px] tracking-[0.16em] uppercase font-bold text-ink-3 mb-2.5">
          Kısa cevap
        </p>
        {/*
          Ekranda BAĞLANTISIZ hâli gösterilir.

          «Kısa cevap» portalda foruma yapıştırılmak üzere yazıldığı için
          içinde tam URL'ler var. Uygulamanın kendi içinde o adresler
          gereksiz: kullanıcı zaten oradaki içeriğe bir dokunuşla gidebiliyor
          ve ekrandaki ham adres metni okumayı bölüyor. Kopyalanan metinde
          bağlantılar aynen durur — paylaşımın işlevi onlar.
        */}
        <p className="okuma m-0 whitespace-pre-line">{ekranMetni(kavram.miniCevap)}</p>
        <div className="flex gap-2 mt-3.5">
          <button type="button" onClick={kopyala} className="btn-ghost flex-1 !py-2.5 text-[13px]">
            {kopyalandi ? <Check size={15} /> : <Copy size={15} />}
            {kopyalandi ? 'Kopyalandı' : 'Kopyala'}
          </button>
          <button
            type="button"
            className="btn-ghost flex-1 !py-2.5 text-[13px]"
            onClick={() => void share({ title: kavram.baslik, text: kavram.miniCevap })}
          >
            <Share2 size={15} /> Paylaş
          </button>
        </div>
      </section>

      <section className="mb-5 space-y-2.5">
        {kavram.paragraflar.map((p, i) => (
          <p key={i} className="text-[14.5px] leading-relaxed text-ink m-0">
            {p}
          </p>
        ))}
      </section>

      {maddeler.length > 0 && (
        <BagSection baslik="Dayanak maddeler" ikon={<Scale size={13} />}>
          {maddeler.map((m) => (
            <BagSatir
              key={`${m.kanunId}/${m.maddeNo}`}
              ustSatir={kanunAdi(m.kanunId)}
              baslik={`${kanunKodu(m.kanunId)} m. ${m.maddeNo}`}
              onClick={() => navigate(`/mevzuat/${m.kanunId}/madde-${m.maddeNo}`)}
            />
          ))}
        </BagSection>
      )}

      {araclar.length > 0 && (
        <BagSection baslik="Hesaplama araçları" ikon={<Calculator size={13} />}>
          {araclar.map((a) => (
            <BagSatir
              key={a.id}
              ustSatir={a.tag}
              baslik={a.baslik}
              onClick={() => navigate(`/arac/${a.id}`)}
            />
          ))}
        </BagSection>
      )}

      {rehberler.length > 0 && (
        <BagSection baslik="Rehberler" ikon={<BookOpen size={13} />}>
          {rehberler.map((slugRehber) => (
            <BagSatir
              key={slugRehber}
              ustSatir="Vatandaş rehberi"
              baslik={slugRehber.replace(/-/g, ' ')}
              onClick={() => navigate(`/rehber/${slugRehber}`)}
            />
          ))}
        </BagSection>
      )}

      {kavram.ilgili && kavram.ilgili.length > 0 && (
        <BagSection baslik="İlgili kavramlar" ikon={<BookMarked size={13} />}>
          {kavram.ilgili
            .map((s) => kavramBul(s))
            .filter(Boolean)
            .map((k) => (
              <BagSatir
                key={k!.slug}
                ustSatir="Kavram"
                baslik={k!.baslik}
                onClick={() => navigate(`/kavram/${k!.slug}`)}
              />
            ))}
        </BagSection>
      )}

      <p className="mt-6 text-[12.5px] leading-relaxed text-ink-3">
        Genel bilgilendirmedir; somut uyuşmazlıkta dosya bazlı değerlendirme gerekir.
      </p>
    </div>
  );
}

/** Kısa cevabın ekranda gösterilen hâli — tam URL taşıyan satırlar atılır. */
function ekranMetni(metin: string): string {
  return String(metin || '')
    .split('\n')
    .filter((satir) => !/https?:\/\//i.test(satir))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function BagSection({
  baslik,
  ikon,
  children,
}: {
  baslik: string;
  ikon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4">
      <h3 className="text-[12px] tracking-[0.16em] uppercase font-bold text-ink-3 mb-2 flex items-center gap-1.5">
        {ikon}
        {baslik}
      </h3>
      <ul className="satir-grup">{children}</ul>
    </section>
  );
}

function BagSatir({
  ustSatir,
  baslik,
  onClick,
}: {
  ustSatir: string;
  baslik: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => {
          void tapFeedback();
          onClick();
        }}
        className="satir hedef flex items-center gap-3"
      >
        <span className="flex-1 min-w-0">
          <span className="block text-[12px] font-mono uppercase tracking-wide text-ink-3 truncate">
            {ustSatir}
          </span>
          <span className="block text-[13.5px] font-semibold leading-snug first-letter:uppercase">
            {baslik}
          </span>
        </span>
        <ChevronRight size={15} className="text-ink-4 shrink-0" aria-hidden />
      </button>
    </li>
  );
}

// ─── Akademik eserler ────────────────────────────────────────────────────────

function EserListPage() {
  const [eserler, setEserler] = useState<Eser[] | null>(null);

  useEffect(() => {
    let alive = true;
    loadEserler().then((l) => alive && setEserler(l));
    return () => {
      alive = false;
    };
  }, []);

  if (!eserler) return <Skeleton />;

  if (eserler.length === 0) {
    return (
      <EmptyState
        title="Eser bulunamadı"
        body="Akademik eserler bu sürümde yüklenemedi."
        actionLabel="Kitaplığa dön"
        onAction={() => navigate('/kitaplik', { replace: true })}
      />
    );
  }

  const gruplar = new Map<string, Eser[]>();
  for (const e of eserler) {
    const list = gruplar.get(e.kategori) ?? [];
    list.push(e);
    gruplar.set(e.kategori, list);
  }
  const toplamKelime = eserler.reduce((n, e) => n + e.kelime, 0);

  return (
    <div className="page">
      <header className="pt-1 pb-4">
        <h2 className="text-[22px] font-heading font-bold leading-tight">Akademik eserler</h2>
        <p className="text-[12.5px] text-ink-2 mt-1">
          {eserler.length} makale · {toplamKelime.toLocaleString('tr-TR')} kelime, tam metin
        </p>
      </header>

      {[...gruplar.entries()].map(([kategori, list]) => (
        <section key={kategori} className="mb-5">
          <h3 className="text-[12px] font-mono uppercase tracking-[0.14em] text-ink-3 mb-2">
            {kategori}
          </h3>
          <ul className="satir-grup">
            {list.map((e) => (
              <li key={e.slug}>
                <button
                  type="button"
                  onClick={() => {
                    void tapFeedback();
                    navigate(`/eser/${e.slug}`);
                  }}
                  className="satir hedef"
                >
                  <span className="flex items-center gap-2 mb-1">
                    <FileText size={13} className="text-ink-3 shrink-0" aria-hidden />
                    <span className="text-[12px] font-mono uppercase tracking-wide text-ink-3">
                      {okumaSuresi(e.kelime)}
                    </span>
                  </span>
                  <span className="block text-[15px] font-heading font-bold leading-snug">
                    {e.baslik}
                  </span>
                  <span className="block text-[12.5px] text-ink-2 mt-1 leading-snug line-clamp-2">
                    {e.ozet}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="mt-4 text-[12.5px] leading-relaxed text-ink-3">
        Eserler Av. Fethi Güzel'e aittir. Alıntı yapılırken kaynak gösterilmelidir.
      </p>
    </div>
  );
}

function EserPage({ slug }: { slug: string }) {
  const [eserler, setEserler] = useState<Eser[] | null>(null);
  const [olcek, setOlcek] = usePersisted<number>(KEYS.fontScale, 1);

  useEffect(() => {
    let alive = true;
    loadEserler().then((l) => alive && setEserler(l));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--okuma-olcek', String(olcek));
  }, [olcek]);

  if (!eserler) return <Skeleton />;

  const eser = eserler.find((e) => e.slug === slug);
  if (!eser) {
    return (
      <EmptyState
        title="Eser bulunamadı"
        body="Bu bağlantı eski bir sürüme ait olabilir."
        actionLabel="Eserlere dön"
        onAction={() => navigate('/eserler', { replace: true })}
      />
    );
  }

  const KADEME = [1, 1.15, 1.32];
  const i = Math.max(0, KADEME.indexOf(olcek));

  return (
    <div className="page selectable">
      <header className="pt-1 pb-3">
        <button
          type="button"
          onClick={() => navigate('/eserler')}
          className="text-[12px] font-mono uppercase tracking-[0.14em] text-ink-3 tap inline-flex items-center min-h-[44px] pr-3 -my-1"
        >
          {eser.kategori}
        </button>
        <h2 className="text-[24px] font-heading font-bold leading-tight mt-1 tracking-tight">
          {eser.baslik}
        </h2>
        <p className="text-[12.5px] text-ink-3 mt-1.5">
          Av. Fethi Güzel · {eser.kelime.toLocaleString('tr-TR')} kelime ·{' '}
          {okumaSuresi(eser.kelime)}
        </p>
      </header>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => {
            void tapFeedback();
            setOlcek(KADEME[(i + 1) % KADEME.length]);
          }}
          className="btn-ghost flex-1 !py-2.5 text-[13px]"
        >
          Yazı boyutu: {['Normal', 'Büyük', 'En büyük'][i]}
        </button>
        <button
          type="button"
          className="btn-ghost flex-1 !py-2.5 text-[13px]"
          onClick={() =>
            void share({
              title: eser.baslik,
              text: `${eser.baslik} — Av. Fethi Güzel`,
              url: 'https://www.avfethiguzel.com/eserlerim',
            })
          }
        >
          <Share2 size={15} /> Paylaş
        </button>
      </div>

      <article className="kagit space-y-3">
        {eser.paragraflar.map((p, idx) => (
          <p key={idx} className="okuma m-0">
            {p}
          </p>
        ))}
      </article>

      <p className="mt-6 text-[12.5px] leading-relaxed text-ink-3">
        Metin yazarın kendi çalışmasından çıkarılmıştır. Yayımlanmış hâli ile biçimsel farklar
        bulunabilir; akademik atıfta yayımlanmış künye esas alınmalıdır.
      </p>
    </div>
  );
}

// ─── Parçacıklar ─────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="page space-y-2" aria-busy="true" aria-label="Yükleniyor">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="skeleton h-20 rounded-2xl" />
      ))}
    </div>
  );
}
