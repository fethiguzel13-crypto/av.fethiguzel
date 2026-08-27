import React, { useEffect, useMemo, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { gunzipSync, strFromU8 } from 'fflate';

import { navigate } from '../lib/router';
import { tapFeedback } from '../lib/haptics';
import { KIND_LABEL, runCommand, type CommandHit, type GuideLite } from '../lib/command';
import { loadArchive, type ArchiveRow } from '../lib/yargi';
import { GZ } from '../lib/varlik';

const KIND_TINT: Record<CommandHit['kind'], string> = {
  madde: '#2E4036',
  kanun: '#2E4036',
  karar: '#1B4F72',
  rehber: '#6B4F3A',
  hesap: '#CC5833',
};

/**
 * Tek kutu — madde, karar, rehber, hesap.
 * Araştırma kütüphanesinin ilk jesti burasıdır.
 */
export default function CommandSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const [q, setQ] = useState('');
  const [archive, setArchive] = useState<ArchiveRow[]>([]);
  const [guides, setGuides] = useState<GuideLite[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [rows, g] = await Promise.all([loadArchive(), loadGuidesLite()]);
        if (!alive) return;
        setArchive(rows);
        setGuides(g);
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const hits = useMemo(() => runCommand({ query: q, archive, guides }), [q, archive, guides]);

  return (
    <div>
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"
          aria-hidden
        />
        <input
          type="search"
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="TBK 13 · HGK · kıdem · nafaka"
          aria-label="Madde, karar, rehber veya hesaplama ara"
          className="w-full rounded-2xl border border-tel bg-white pl-11 pr-11 py-3.5
                     text-[16px] outline-none focus:border-[color:var(--brand)]"
        />
        {q && !ready ? (
          <Loader2
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-ink-3"
            aria-hidden
          />
        ) : q ? (
          <button
            type="button"
            aria-label="Temizle"
            onClick={() => setQ('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-full text-ink-3"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      {q.trim().length >= 2 && (
        <ul className="mt-2 space-y-1.5" role="listbox" aria-label="Arama sonuçları">
          {hits.length === 0 && ready ? (
            <li className="card px-4 py-3 text-[13px] text-ink-2">
              «{q}» için sonuç yok. Kanun kodu (TBK 13), daire (HGK) veya bir konu deneyin.
            </li>
          ) : (
            hits.map((h) => (
              <li key={`${h.kind}-${h.path}`}>
                <button
                  type="button"
                  role="option"
                  onClick={() => {
                    void tapFeedback();
                    navigate(h.path);
                  }}
                  className="w-full card px-3.5 py-3 flex items-start gap-3 text-left tap"
                >
                  <span
                    className="text-[12px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded mt-0.5 shrink-0"
                    style={{ background: `${KIND_TINT[h.kind]}18`, color: KIND_TINT[h.kind] }}
                  >
                    {KIND_LABEL[h.kind]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold leading-snug">{h.title}</span>
                    <span className="block text-[12px] text-ink-3 mt-0.5">{h.subtitle}</span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

async function loadGuidesLite(): Promise<GuideLite[]> {
  try {
    const res = await fetch(`./rehber/guides.json${GZ}`);
    if (!res.ok) return [];
    const buf = new Uint8Array(await res.arrayBuffer());
    const all = JSON.parse(strFromU8(gunzipSync(buf))) as GuideLite[];
    return Array.isArray(all) ? all : [];
  } catch {
    return [];
  }
}
