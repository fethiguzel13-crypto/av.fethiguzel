import React, { useEffect, useState } from 'react';
import {
  Landmark,
  Check,
  Loader2,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  WifiOff,
  Search,
  Scale,
} from 'lucide-react';

import { navigate } from '../lib/router';
import { tapFeedback } from '../lib/haptics';
import { openExternal } from '../lib/external';
import { APP, STATS, trNum } from '../lib/config';
import {
  useUyelik,
  uyelikYenile,
  erisimVar,
  kalanCevrimdisiGun,
  YEDEK_FIYAT,
} from '../lib/uyelik';
import { odemeVarMi, satinAl, geriYukle, urunBilgisi, yonetimAdresi } from '../lib/odeme';

/**
 * Yargı arşivi üyeliği.
 *
 * Ekran bir reklam değil, bir vitrindir: neyin açıldığını sayıyla söyler,
 * fiyatı ve dönemi saklamaz, iptalin nereden yapılacağını gösterir. Play'in
 * abonelik politikası bunların hepsini zaten zorunlu kılar; ürün olarak da
 * doğrusu budur.
 *
 * Fiyat Play'den okunur. Mağazadan okunamazsa yedek değer gösterilir; ne var
 * ki asıl tutarı her zaman Play belirler ve satın alma ekranında o görünür.
 */
export default function UyelikPage() {
  const uyelik = useUyelik();
  const [fiyat, setFiyat] = useState(YEDEK_FIYAT);
  const [donem, setDonem] = useState('ay');
  const [islem, setIslem] = useState<'yok' | 'satin' | 'geri'>('yok');
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    urunBilgisi()
      .then((u) => {
        if (!alive) return;
        setFiyat(u.fiyat);
        if (u.donem) setDonem(u.donem);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const acik = erisimVar(uyelik);
  const kalan = kalanCevrimdisiGun(uyelik);

  async function satinAlmaya() {
    setHata(null);
    setIslem('satin');
    try {
      void tapFeedback();
      await satinAl();
      await uyelikYenile();
    } catch (e) {
      setHata(e instanceof Error ? e.message : 'Satın alma tamamlanamadı.');
    } finally {
      setIslem('yok');
    }
  }

  async function geriYuklemeye() {
    setHata(null);
    setIslem('geri');
    try {
      await geriYukle();
      const u = await uyelikYenile();
      if (!erisimVar(u)) setHata('Bu hesapta etkin bir abonelik bulunamadı.');
    } catch (e) {
      setHata(e instanceof Error ? e.message : 'Geri yükleme başarısız oldu.');
    } finally {
      setIslem('yok');
    }
  }

  return (
    <div className="page">
      <header className="pt-2 pb-5">
        <span
          className="w-12 h-12 rounded-2xl grid place-items-center text-white mb-3"
          style={{ background: '#1B4F72' }}
          aria-hidden
        >
          <Landmark size={22} />
        </span>
        <h2 className="text-[25px] font-heading font-bold leading-tight tracking-tight">
          Yargıtay arşivi üyeliği
        </h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
          {STATS.decisions ? `${trNum(STATS.decisions)} kararın` : 'Yirmi binden fazla kararın'} tam
          metni cihazınızda, internet olmadan.
        </p>
      </header>

      {acik ? (
        <section className="kagit mb-5">
          <p className="etiket mb-2">Üyeliğiniz etkin</p>
          <p className="text-[14.5px] leading-relaxed text-ink m-0">
            Arşivin tamamı açık. Kararları çevrimdışı okuyabilirsiniz.
          </p>
          {kalan !== null && (
            <p className="mt-2.5 text-[13px] text-ink-2 flex items-start gap-2 m-0">
              <WifiOff size={14} className="shrink-0 mt-0.5" aria-hidden />
              <span>
                Uygulama mağazaya ulaşamadı; üyelik çevrimdışı doğrulamayla{' '}
                <strong>{kalan} gün</strong> daha geçerli. Bir kez internete bağlandığınızda
                kendiliğinden tazelenir.
              </span>
            </p>
          )}
        </section>
      ) : (
        <>
          <section className="kagit mb-4">
            <p className="etiket mb-3">Üyelikle açılan</p>
            <ul className="space-y-2.5">
              <Madde
                ikon={<Landmark size={15} />}
                baslik="Kararların tam metni"
                alt="İçtihadı birleştirme, Hukuk ve Ceza Genel Kurulu, daire kararları"
              />
              <Madde
                ikon={<Search size={15} />}
                baslik="Konu ve künyede arama"
                alt="Daire, kademe, esas–karar numarası ve uyuşmazlık konusuyla"
              />
              <Madde
                ikon={<Scale size={15} />}
                baslik="Madde ile karar bağı"
                alt="Bir maddeyi açtığınızda o maddeye atıf yapan kararlar listelenir"
              />
              <Madde
                ikon={<WifiOff size={15} />}
                baslik="Tamamen çevrimdışı"
                alt="Duruşma salonunda, çekmeyen yerde açılır"
              />
            </ul>
          </section>

          <section className="card p-4 mb-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[26px] font-heading font-bold tracking-tight rakam">
                {fiyat}
              </span>
              <span className="text-[13px] text-ink-2">/ {donem}</span>
            </div>
            <p className="mt-1.5 text-[12.5px] text-ink-3 leading-snug m-0">
              Aylık yenilenir, istediğiniz an iptal edilebilir. Ödeme Google Play hesabınızdan
              alınır.
            </p>

            <button
              type="button"
              onClick={satinAlmaya}
              disabled={islem !== 'yok' || !odemeVarMi()}
              className="btn-brand w-full mt-4 disabled:opacity-55"
            >
              {islem === 'satin' ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Play açılıyor…
                </>
              ) : (
                'Üyeliği başlat'
              )}
            </button>

            <button
              type="button"
              onClick={geriYuklemeye}
              disabled={islem !== 'yok' || !odemeVarMi()}
              className="btn-ghost w-full mt-2 disabled:opacity-55"
            >
              {islem === 'geri' ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <RotateCcw size={15} />
              )}
              Satın almalarımı geri yükle
            </button>

            {!odemeVarMi() && (
              <p className="mt-3 text-[12.5px] text-ink-3 leading-snug m-0">
                Satın alma yalnız Google Play üzerinden kurulan uygulamada çalışır.
              </p>
            )}

            {hata && (
              <p className="mt-3 text-[13px] leading-snug m-0" style={{ color: '#A32B21' }}>
                {hata}
              </p>
            )}
          </section>
        </>
      )}

      <section className="mb-5">
        <h3 className="etiket mb-2 flex items-center gap-1.5">
          <ShieldCheck size={13} aria-hidden />
          Ücretsiz kalanlar
        </h3>
        <p className="text-[13.5px] leading-relaxed text-ink-2 m-0">
          Mevzuat, kavram sözlüğü, vatandaş rehberi, akademik eserler ve 33 hesaplama aracı
          ücretsizdir ve öyle kalacaktır. Günlük içtihat özetleri de üyelik istemez. Kapalı olan
          yalnız arşivdeki kararların tam metnidir; künye, konu ve atıf yapılan maddeler herkese
          açıktır.
        </p>
      </section>

      <button
        type="button"
        onClick={() => void openExternal(yonetimAdresi(APP.packageId))}
        className="btn-ghost w-full"
      >
        <ExternalLink size={15} /> Aboneliği Play'de yönet
      </button>

      <button
        type="button"
        onClick={() => navigate('/arsiv')}
        className="w-full text-center mt-3 hedef inline-flex items-center justify-center text-[13px] font-bold"
        style={{ color: 'var(--brand)' }}
      >
        Arşive dön
      </button>

      <p className="mt-6 text-[12.5px] leading-relaxed text-ink-3">
        Karar metinleri karararama.yargitay.gov.tr kaynağından derlenmiştir. Üyelik, metinlerin
        cihazınızda derlenmiş ve aranabilir hâlde sunulması hizmetini kapsar; kararların kendisi
        kamuya açık belgelerdir. Bilgilendirme amaçlıdır, hukuki tavsiye yerine geçmez.
      </p>
    </div>
  );
}

function Madde({
  ikon,
  baslik,
  alt,
}: {
  ikon: React.ReactNode;
  baslik: string;
  alt: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="w-6 h-6 rounded-lg grid place-items-center shrink-0 mt-0.5"
        style={{ background: 'rgba(27,79,114,0.1)', color: '#1B4F72' }}
        aria-hidden
      >
        <Check size={13} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[14px] font-semibold leading-snug">{baslik}</span>
        <span className="block text-[12.5px] text-ink-2 mt-0.5 leading-snug">{alt}</span>
      </span>
      <span className="text-ink-4 shrink-0 mt-1" aria-hidden>
        {ikon}
      </span>
    </li>
  );
}
