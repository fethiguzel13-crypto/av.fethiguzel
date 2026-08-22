import React from 'react';
import { ExternalLink, Shield, FileText, Mail, Globe, Star } from 'lucide-react';

import { SIBLINGS, APP, appName, appShort, playUrl, SITE, BUILT_AT } from '../lib/config';
import { openExternal, openOnSite } from '../lib/external';
import { navigate } from '../lib/router';

/**
 * "Diğer" sekmesi — kardeş uygulamalar, yasal bağlantılar, iletişim.
 *
 * Kardeş uygulamalar burada Play bağlantısıyla listelenir. Bu, dört
 * uygulamanın bilinçli bir aile olduğunu hem kullanıcıya hem incelemeciye
 * gösterir; birbirinin kopyası dört liste yerine birbirini tamamlayan
 * dört araç izlenimi verir.
 */
export default function MorePage() {
  return (
    <div className="page">
      {/*
        SIBLINGS boşsa (dört uygulama birleştikten sonra hep boş) bölüm
        TAMAMEN atlanır. Yalnız listeyi boş göstermek yetmez — başlığı
        görünür bırakıp altını boş bırakmak "bitmemiş uygulama" izlenimi
        veriyordu; bir Play incelemecisinin ya da bu uygulamayı denetleyen
        bir meslektaşın ilk fark edeceği şey tam olarak buydu.
      */}
      {SIBLINGS.length > 0 && (
        <section className="mb-7">
          <h2 className="text-[12px] font-mono tracking-widest uppercase text-ink-3 mb-2.5">
            Aynı ailedeki diğer uygulamalar
          </h2>
          <ul className="space-y-2">
            {SIBLINGS.map((app) => (
              <li key={app.id}>
                <button
                  type="button"
                  onClick={() => void openExternal(playUrl(app))}
                  className="w-full card p-3.5 flex items-center gap-3 text-left tap"
                >
                  <span
                    className="w-10 h-10 rounded-xl grid place-items-center text-white text-sm font-bold shrink-0"
                    style={{ background: app.accent }}
                    aria-hidden
                  >
                    {appName(app).slice(0, 1)}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] font-bold leading-snug">{appName(app)}</span>
                    <span className="block text-[12px] text-ink-3 leading-snug mt-0.5">
                      {appShort(app)}
                    </span>
                  </span>
                  <ExternalLink size={15} className="text-ink-4 shrink-0" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-7">
        <h2 className="text-[12px] font-mono tracking-widest uppercase text-ink-3 mb-2.5">
          Bilgi
        </h2>
        <ul className="space-y-2">
          <Row icon={<Globe size={16} />} label="Web sitesi" onClick={() => void openExternal(SITE)} />
          <Row
            icon={<Shield size={16} />}
            label="Gizlilik politikası"
            onClick={() => void openOnSite('/gizlilik')}
          />
          <Row
            icon={<FileText size={16} />}
            label="Yasal uyarı"
            onClick={() => void openOnSite('/yasal-uyari')}
          />
          <Row
            icon={<Mail size={16} />}
            label="İletişim"
            onClick={() => void openExternal('mailto:fethiguzel@hotmail.com')}
          />
          <Row
            icon={<Star size={16} />}
            label="Uygulamayı değerlendir"
            onClick={() => void openExternal(playUrl(APP))}
          />
        </ul>
      </section>

      <button
        type="button"
        className="btn-ghost w-full mb-6"
        onClick={() => navigate('/ayarlar')}
      >
        Ayarlar
      </button>

      <div className="rounded-2xl p-4 text-[12px] leading-relaxed text-ink-2 bg-white/70 border border-tel">
        <p className="mb-2">
          Bu uygulama bilgilendirme amaçlıdır; resmî hukuki tavsiye veya vekâlet ilişkisi
          kurmaz. Somut uyuşmazlığınızda bir avukata danışın.
        </p>
        <p className="text-ink-3 font-mono text-[12px]">
          {appName()} · s{APP.versionName} ({APP.versionCode})
          {BUILT_AT ? ` · ${BUILT_AT.slice(0, 10)}` : ''}
        </p>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="w-full card px-4 py-3.5 flex items-center gap-3 text-left tap"
      >
        <span className="text-ink-3" aria-hidden>
          {icon}
        </span>
        <span className="flex-1 text-[14px] font-semibold">{label}</span>
        <ExternalLink size={14} className="text-ink-4" aria-hidden />
      </button>
    </li>
  );
}
