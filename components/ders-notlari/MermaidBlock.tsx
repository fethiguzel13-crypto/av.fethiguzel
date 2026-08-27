'use client';

import { useEffect, useId, useState } from 'react';

export function MermaidBlock({ title, diagram }: { title: string; diagram: string }) {
    const reactId = useId().replace(/:/g, '');
    const [svg, setSvg] = useState('');
    const [err, setErr] = useState('');

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const mermaid = (await import('mermaid')).default;
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'neutral',
                    securityLevel: 'strict',
                });
                const id = `mmd-${reactId}`;
                const { svg: out } = await mermaid.render(id, diagram);
                if (alive) setSvg(out);
            } catch (e) {
                if (alive) setErr(e instanceof Error ? e.message : 'diyagram üretilemedi');
            }
        })();
        return () => {
            alive = false;
        };
    }, [diagram, reactId]);

    return (
        <figure className="my-8 rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm overflow-x-auto">
            <figcaption className="text-[11px] font-mono uppercase tracking-[0.14em] text-accent mb-4 font-bold">
                Süreç · {title}
            </figcaption>
            {svg ? (
                <div className="mermaid-svg [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
            ) : err ? (
                <pre className="text-xs text-charcoal/60 whitespace-pre-wrap m-0">{diagram}</pre>
            ) : (
                <p className="text-xs text-charcoal/40 m-0">Diyagram yükleniyor…</p>
            )}
        </figure>
    );
}
