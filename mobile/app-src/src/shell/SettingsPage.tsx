import React, { useEffect, useState } from 'react';
import { Type, Vibrate, Bell, Trash2, Database } from 'lucide-react';

import { usePersisted, KEYS, ALL_KEYS, remove } from '../lib/storage';
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
      <h2 className="text-base font-heading font-bold mb-4">Ayarlar</h2>

      {/* Yazı boyutu */}
      <section className="card p-4 mb-3">
        <h3 className="flex items-center gap-2 text-[13.5px] font-bold mb-1">
          <Type size={16} className="text-charcoal/40" aria-hidden /> Yazı boyutu
        </h3>
        <p className="text-[12px] text-charcoal/50 leading-relaxed mb-3">
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

      {/* Veri */}
      <section className="card p-4 mt-3">
        <h3 className="flex items-center gap-2 text-[13.5px] font-bold mb-1">
          <Database size={16} className="text-charcoal/40" aria-hidden /> Verileriniz
        </h3>
        <p className="text-[12px] text-charcoal/50 leading-relaxed mb-3">
          Favoriler, kayıtlar ve hesap geçmişi yalnız bu cihazda tutulur. Uygulama
          hiçbir kişisel veriyi sunucuya göndermez.
        </p>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                     text-[13px] font-bold border border-red-200 text-red-600 bg-red-50 tap"
          onClick={() => {
            ALL_KEYS.forEach(remove);
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
      <span className="text-charcoal/40 mt-0.5" aria-hidden>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="text-[13.5px] font-bold mb-0.5">{title}</h3>
        <p className="text-[12px] text-charcoal/50 leading-relaxed">{body}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => void onChange(!checked)}
        className="shrink-0 w-12 h-7 rounded-full p-0.5 transition-colors tap"
        style={{ background: checked ? 'var(--brand)' : 'rgba(26,26,26,0.18)' }}
      >
        <span
          className="block w-6 h-6 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>
    </section>
  );
}
