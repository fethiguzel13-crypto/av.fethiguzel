import React, { useEffect, useState } from 'react';
import { Type, Vibrate, Bell, Trash2, Database, KeyRound } from 'lucide-react';

import { usePersisted, KEYS, ALL_KEYS, remove } from '../lib/storage';
import { uyelikVerisiniSil, incelemeKoduDene } from '../lib/uyelik';
import { hapticsEnabled, setHapticsEnabled, tapFeedback } from '../lib/haptics';
import { ensureNotificationPermission, scheduleDailyBrief, cancelDailyBrief } from '../lib/notify';
import { APP_ID } from '../lib/config';

const FONT_STEPS = [
  { v: 0.9, label: 'Küçük' },
  { v: 1, label: 'Normal' },
  { v: 1.15, label: 'Büyük' },
  { v: 1.3, label: 'Çok büyük' },
];

/**
 * Ayarlar.
 *
 * Yazı boyutu, titreşim ve bildirim denetimi kullanıcıya bırakılır. Bunları
 * kapatamamak hem erişilebilirlik hem mağaza puanı açısından sorun; özellikle
 * hukuk metni okuyan kullanıcı kitlesinde yazı boyutu talebi yüksek.
 */
export default function SettingsPage() {
  const [scale, setScale] = usePersisted<number>(KEYS.fontScale, 1);
  const [haptics, setHaptics] = useState(hapticsEnabled);
  const [daily, setDaily] = usePersisted<boolean>(KEYS.notifyDaily, false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * scale}px`;
  }, [scale]);

  return (
    <div className="page">
      <h2 className="text-[20px] font-heading font-bold mb-4">Ayarlar</h2>

      {/* Yazı boyutu */}
      <section className="card p-4 mb-3">
        <h3 className="flex items-center gap-2 text-[14px] font-bold mb-1">
          <Type size={16} className="text-ink-3" aria-hidden /> Yazı boyutu
        </h3>
        <p className="text-[12px] text-ink-2 leading-relaxed mb-3">
          Uzun madde ve gerekçe metinlerini rahat okumak için.
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {FONT_STEPS.map((s) => (
            <button
              key={s.v}
              type="button"
              aria-pressed={scale === s.v}
              onClick={() => {
                void tapFeedback();
                setScale(s.v);
              }}
              className="py-2.5 rounded-xl text-[12px] font-bold border tap"
              style={
                scale === s.v
                  ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' }
                  : { background: '#fff', borderColor: 'rgba(26,26,26,0.12)' }
              }
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {/* Titreşim */}
      <Toggle
        icon={<Vibrate size={16} />}
        title="Dokunsal geri bildirim"
        body="Düğmelere dokunduğunuzda kısa titreşim."
        checked={haptics}
        onChange={(v) => {
          setHapticsEnabled(v);
          setHaptics(v);
          if (v) void tapFeedback();
        }}
      />

      {/* Günlük bildirim — yalnız içtihat uygulamasında anlamlı */}
      {APP_ID === 'icthat' && (
        <Toggle
          icon={<Bell size={16} />}
          title="Günlük içtihat bildirimi"
          body="Her sabah 08.30'da o günün özetini hatırlatır. Bildirim cihazınızda üretilir; sunucuya veri gitmez."
          checked={daily}
          onChange={async (v) => {
            if (v) {
              const ok = await ensureNotificationPermission();
              if (!ok) return;
              await scheduleDailyBrief();
            } else {
              await cancelDailyBrief();
            }
            setDaily(v);
          }}
        />
      )}

      {/*
        MAĞAZA İNCELEMESİ ERİŞİMİ

        Google Play incelemecisi ücretli bölümü göremezse sürüm reddedilir;
        Play'in kendi formu incelemecinin hesap açamayacağını, kendi
        hesabıyla giremeyeceğini ve ücretsiz deneme kullanamayacağını
        söylüyor. Uygulamada hesap sistemi olmadığı için verilecek bir
        kullanıcı adı/şifre de yok — kod alanı o boşluğu dolduruyor.

        Ayarlar'ın en altında, sade bir satır: sıradan kullanıcı için
        anlamsız, incelemeci için tarif edilen tek adım.
      */}
      <IncelemeErisimi />

      {/* Veri */}
      <section className="card p-4 mt-3">
        <h3 className="flex items-center gap-2 text-[14px] font-bold mb-1">
          <Database size={16} className="text-ink-3" aria-hidden /> Verileriniz
        </h3>
        <p className="text-[12px] text-ink-2 leading-relaxed mb-3">
          Favoriler, kayıtlar, hesap geçmişi ve tercihleriniz yalnız bu cihazda
          tutulur. Uygulama hiçbir kişisel veriyi sunucuya göndermez. Silme,
          üyelik kaydınızın yerel kopyasını da kaldırır; ödeme yaptıysanız
          üyeliğiniz bir sonraki açılışta Google Play'den geri gelir.
        </p>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                     text-[13px] font-bold border border-red-200 bg-red-50 tap hedef"
          style={{ color: '#A32B21' }}
          onClick={() => {
            ALL_KEYS.forEach(remove);
            // Üyelik kaydı ayrı modülde tutulur; bellekteki durumu da sıfırlar.
            void uyelikVerisiniSil();
            setCleared(true);
            setTimeout(() => setCleared(false), 2500);
          }}
        >
          <Trash2 size={15} aria-hidden />
          {cleared ? 'Temizlendi' : 'Tüm yerel verileri sil'}
        </button>
      </section>
    </div>
  );
}

function Toggle({
  icon,
  title,
  body,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  checked: boolean;
  onChange: (v: boolean) => void | Promise<void>;
}) {
  return (
    <section className="card p-4 mb-3 flex items-start gap-3">
      <span className="text-ink-3 mt-0.5" aria-hidden>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="text-[14px] font-bold mb-0.5">{title}</h3>
        <p className="text-[12px] text-ink-2 leading-relaxed">{body}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => void onChange(!checked)}
        className="shrink-0 grid place-items-center w-14 h-11 -mr-1 rounded-xl tap"
      >
        {/*
          Dokunma hedefi 48×28'di; parmak için alçak. Kutu 56×44'e çıkarıldı,
          görünen ray aynı ölçüde kaldı — hedef büyüdü, tasarım değişmedi.
        */}
        <span
          className="block w-12 h-7 rounded-full p-0.5 transition-colors"
          style={{ background: checked ? 'var(--brand)' : 'var(--ink-4)' }}
        >
          <span
            className="block w-6 h-6 rounded-full bg-white shadow transition-transform"
            style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
          />
        </span>
      </button>
    </section>
  );
}

/**
 * İnceleme erişim kodu alanı.
 *
 * Kod doğruysa üyelik 30 gün yerel olarak açılır. Yanlış kodda alan
 * sessizce kalmaz; incelemecinin yazım hatası mı yaptığını yoksa kodun mu
 * eskidiğini anlaması gerekir.
 */
function IncelemeErisimi() {
  const [acik, setAcik] = useState(false);
  const [kod, setKod] = useState('');
  const [durum, setDurum] = useState<'bos' | 'oldu' | 'yanlis'>('bos');

  return (
    <section className="card p-4 mt-3">
      <h3 className="flex items-center gap-2 text-[14px] font-bold mb-1">
        <KeyRound size={16} className="text-ink-3" aria-hidden /> İnceleme erişimi
      </h3>
      <p className="text-[12px] text-ink-2 leading-relaxed mb-3">
        Mağaza incelemesi için ayrılmıştır. Yargıtay arşivi üyeliği normalde
        Google Play üzerinden alınır.
      </p>

      {!acik ? (
        <button
          type="button"
          onClick={() => setAcik(true)}
          className="btn-ghost w-full"
        >
          Erişim kodu gir
        </button>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={kod}
            onChange={(e) => {
              setKod(e.target.value);
              setDurum('bos');
            }}
            placeholder="Erişim kodu"
            aria-label="İnceleme erişim kodu"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            className="w-full rounded-xl border border-tel bg-white px-3.5 py-3
                       text-[16px] outline-none focus:border-[color:var(--brand)]"
          />
          <button
            type="button"
            className="btn-brand w-full"
            onClick={async () => {
              const oldu = await incelemeKoduDene(kod);
              setDurum(oldu ? 'oldu' : 'yanlis');
              if (oldu) setKod('');
            }}
          >
            Doğrula
          </button>
          {durum === 'oldu' && (
            <p className="text-[13px] m-0" style={{ color: 'var(--vurgu)' }}>
              Erişim açıldı. Yargı bölümündeki kararların tam metni artık okunabilir.
            </p>
          )}
          {durum === 'yanlis' && (
            <p className="text-[13px] m-0" style={{ color: '#A32B21' }}>
              Kod doğrulanamadı.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
