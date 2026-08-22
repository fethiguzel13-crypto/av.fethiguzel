import type { ReactNode } from 'react';
import type { VatandasTable } from '@/lib/vatandas-rehberi';
import type {
    RehberAftermath,
    RehberClock,
    RehberFork,
    RehberMeasure,
} from '@/lib/vatandas-rehberi/visual-plan';

function Fig({
    caption,
    children,
    className = '',
}: {
    caption: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <figure className={`mb-10 ${className}`}>
            <figcaption className="font-drama italic text-[1.05rem] sm:text-lg text-primary mb-3 leading-snug">
                {caption}
            </figcaption>
            {children}
        </figure>
    );
}

export function RehberClocks({ clocks }: { clocks: RehberClock[] }) {
    if (!clocks.length) return null;
    const urgent = clocks[0].days <= 15;
    return (
        <Fig caption={urgent ? 'Bu süre kaçmasın.' : 'Takvime yazmanız gerekenler.'}>
            <ol
                className={`m-0 p-0 list-none grid gap-3 ${clocks.length === 1 ? 'max-w-sm' : clocks.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'
                    }`}
            >
                {clocks.map((c) => (
                    <li
                        key={`${c.amount}-${c.unit}-${c.context.slice(0, 16)}`}
                        className="relative overflow-hidden rounded-2xl border border-charcoal/10 bg-[#FFFEFA] px-4 py-4 shadow-soft"
                    >
                        <p
                            className={`font-drama font-semibold leading-none m-0 ${c.days <= 15 ? 'text-accent text-6xl' : 'text-primary text-5xl'
                                }`}
                        >
                            {c.amount}
                        </p>
                        <p className="mt-1 mb-2 font-heading font-bold uppercase tracking-[0.14em] text-[11px] text-charcoal/55">
                            {c.unit}
                        </p>
                        <p className="m-0 text-[13px] leading-snug text-charcoal/75">{c.context}</p>
                    </li>
                ))}
            </ol>
        </Fig>
    );
}

export function RehberFork({ fork }: { fork: RehberFork }) {
    return (
        <Fig caption={fork.title}>
            <div className="grid sm:grid-cols-2 gap-0 sm:gap-0 rounded-[1.4rem] overflow-hidden border border-charcoal/10 shadow-soft">
                <div className="bg-primary text-cream px-5 py-6 sm:px-6">
                    <p className="font-heading font-bold text-cream text-lg m-0 mb-3">{fork.leftTitle}</p>
                    <p className="m-0 text-[15px] leading-relaxed text-cream/85">{fork.left}</p>
                </div>
                <div className="bg-accent text-cream px-5 py-6 sm:px-6">
                    <p className="font-heading font-bold text-cream text-lg m-0 mb-3">{fork.rightTitle}</p>
                    <p className="m-0 text-[15px] leading-relaxed text-cream/90">{fork.right}</p>
                </div>
            </div>
        </Fig>
    );
}

export function RehberTrap({ text }: { text: string }) {
    return (
        <aside className="mb-10 bg-[#FFFEFA] border-t-2 border-b-2 border-accent px-5 py-5 sm:px-6 sm:py-6">
            <p className="font-drama italic text-primary text-xl sm:text-[1.35rem] leading-snug m-0">
                {text}
            </p>
        </aside>
    );
}

export function RehberProcess({ steps }: { steps: string[] }) {
    if (!steps.length) return null;
    return (
        <Fig caption="Sırayla bunlar.">
            <ol className="m-0 p-0 list-none relative">
                <span
                    className="absolute left-[1.15rem] top-3 bottom-3 w-px bg-primary/25"
                    aria-hidden
                />
                {steps.map((step, i) => (
                    <li key={`${i}-${step.slice(0, 20)}`} className="relative flex gap-4 pb-5 last:pb-0">
                        <span className="relative z-[1] mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary text-cream font-drama text-xl font-semibold shadow-soft">
                            {i + 1}
                        </span>
                        <p className="flex-1 min-w-0 m-0 bg-[#FFFEFA] border border-charcoal/10 px-4 py-3 text-[15px] text-charcoal/80 leading-relaxed shadow-soft">
                            {step}
                        </p>
                    </li>
                ))}
            </ol>
        </Fig>
    );
}

export function RehberDossier({ documents }: { documents: string[] }) {
    if (!documents.length) return null;
    return (
        <Fig caption="Masaya koyacaklarınız.">
            <ul className="m-0 p-0 list-none relative min-h-[12rem]">
                {documents.map((d, i) => {
                    const tilt = ((i % 5) - 2) * 1.4;
                    return (
                        <li
                            key={d}
                            className="relative bg-[#FFFEFA] border border-charcoal/10 px-4 py-3.5 mb-2 shadow-soft"
                            style={{
                                transform: `rotate(${tilt}deg)`,
                                marginLeft: `${(i % 3) * 0.35}rem`,
                            }}
                        >
                            <p className="m-0 text-[15px] text-charcoal/80 leading-snug">
                                <span className="font-drama text-accent text-lg mr-2">{i + 1}</span>
                                {d}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </Fig>
    );
}

export function RehberConditions({
    heading,
    items,
    nested = false,
}: {
    heading: string;
    items: string[];
    nested?: boolean;
}) {
    const list = (
        <ol className="m-0 p-0 list-none divide-y divide-charcoal/10 border border-charcoal/10 rounded-2xl overflow-hidden bg-[#FFFEFA] shadow-soft">
            {items.map((it, i) => (
                <li key={it} className="flex gap-3 items-start px-4 py-3.5">
                    <span className="font-drama text-accent text-2xl leading-none w-7 shrink-0">{i + 1}</span>
                    <span className="text-[15px] text-charcoal/80 leading-snug">{it}</span>
                </li>
            ))}
        </ol>
    );
    if (nested) return <div className="mt-4">{list}</div>;
    return <Fig caption={heading}>{list}</Fig>;
}

export function RehberMeasures({ measures }: { measures: RehberMeasure[] }) {
    if (!measures.length) return null;
    return (
        <Fig caption="Hesabın ve oranın durduğu yer.">
            <ul className="m-0 p-0 list-none grid gap-3 sm:grid-cols-2">
                {measures.map((m) => (
                    <li
                        key={m.value}
                        className="rounded-2xl bg-primary text-cream px-5 py-5 shadow-soft"
                    >
                        <p className="m-0 mb-2 text-[11px] tracking-[0.14em] uppercase text-cream/60 font-heading">
                            {m.kicker}
                        </p>
                        <p className="m-0 font-drama text-3xl sm:text-4xl leading-tight">{m.value}</p>
                        {m.note ? (
                            <p className="m-0 mt-3 text-[13px] leading-snug text-cream/75">{m.note}</p>
                        ) : null}
                    </li>
                ))}
            </ul>
        </Fig>
    );
}

export function RehberLedger({ table }: { table: VatandasTable }) {
    return (
        <Fig caption={table.caption}>
            <div className="overflow-x-auto rounded-2xl border border-charcoal/10 shadow-soft">
                <table className="w-full min-w-[20rem] text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-primary text-cream">
                            {table.headers.map((h) => (
                                <th key={h} className="px-3 py-3 font-heading font-semibold text-[13px]">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {table.rows.map((row, ri) => (
                            <tr key={ri} className={ri % 2 === 0 ? 'bg-[#FFFEFA]' : 'bg-cream/80'}>
                                {row.map((cell, ci) => (
                                    <td
                                        key={ci}
                                        className={`px-3 py-2.5 text-charcoal/75 leading-snug ${ci === 0 ? 'font-medium text-charcoal' : ''
                                            }`}
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Fig>
    );
}

export function RehberAftermath({ aftermath }: { aftermath: RehberAftermath }) {
    return (
        <Fig caption={aftermath.title}>
            <ol className="m-0 p-0 list-none flex flex-col sm:flex-row sm:items-stretch gap-2">
                {aftermath.beats.map((b, i) => (
                    <li key={b} className="flex-1 flex sm:flex-col gap-3 items-start">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-cream font-drama text-lg">
                            {i + 1}
                        </span>
                        <p className="m-0 text-[15px] leading-snug text-charcoal/80 bg-[#FFFEFA] border border-charcoal/10 px-3 py-3 flex-1 shadow-soft">
                            {b}
                        </p>
                    </li>
                ))}
            </ol>
        </Fig>
    );
}
