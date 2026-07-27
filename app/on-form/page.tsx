'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PROFILE } from '@/lib/profile';

const KONULAR = [
    'Ceza hukuku',
    'Aile / boşanma / nafaka',
    'Miras',
    'İş hukuku',
    'İcra / alacak',
    'Gayrimenkul / kira',
    'Ticaret / şirket',
    'Arabuluculuk',
    'Diğer',
];

export default function OnFormPage() {
    const [ad, setAd] = useState('');
    const [email, setEmail] = useState('');
    const [telefon, setTelefon] = useState('');
    const [konu, setKonu] = useState(KONULAR[0]);
    const [ozet, setOzet] = useState('');
    const [sehir, setSehir] = useState('');
    const [kvkk, setKvkk] = useState(false);

    const mailto = useMemo(() => {
        const subject = encodeURIComponent(`[Ön form] ${konu} — ${ad || 'İsimsiz'}`);
        const body = encodeURIComponent(
            [
                'Merhaba,',
                '',
                'Site üzerindeki ön değerlendirme formunu doldurdum.',
                '',
                `Ad Soyad: ${ad}`,
                `E-posta: ${email}`,
                `Telefon: ${telefon || '—'}`,
                `Şehir: ${sehir || '—'}`,
                `Konu: ${konu}`,
                '',
                'Olay özeti:',
                ozet,
                '',
                'KVKK bilgilendirmesini okudum; iletişim için açık rıza veriyorum.',
                '',
                '— avfethiguzel.com/on-form',
            ].join('\n')
        );
        return `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
    }, [ad, email, telefon, konu, ozet, sehir]);

    const valid = ad.trim() && email.trim() && ozet.trim().length >= 30 && kvkk;

    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-xl mx-auto">
                <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
                    Ön değerlendirme
                </p>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-3">
                    Müvekkil ön formu
                </h1>
                <p className="text-charcoal/55 text-sm leading-relaxed mb-8">
                    Form, e-posta uygulamanızı açar; veriler tarayıcınızda kalır, sunucuya kaydedilmez.
                    Sonuç vaadi yoktur. Acil durumlarda doğrudan e-posta:{' '}
                    <a href={`mailto:${PROFILE.email}`} className="text-accent font-semibold">
                        {PROFILE.email}
                    </a>
                </p>

                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!valid) return;
                        window.location.href = mailto;
                    }}
                >
                    <label className="block">
                        <span className="text-xs font-bold text-charcoal/50 uppercase tracking-wider">
                            Ad soyad *
                        </span>
                        <input
                            required
                            value={ad}
                            onChange={(e) => setAd(e.target.value)}
                            className="mt-1 w-full border border-charcoal/15 rounded-xl px-4 py-2.5 text-sm bg-white"
                        />
                    </label>
                    <label className="block">
                        <span className="text-xs font-bold text-charcoal/50 uppercase tracking-wider">
                            E-posta *
                        </span>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full border border-charcoal/15 rounded-xl px-4 py-2.5 text-sm bg-white"
                        />
                    </label>
                    <label className="block">
                        <span className="text-xs font-bold text-charcoal/50 uppercase tracking-wider">
                            Telefon
                        </span>
                        <input
                            value={telefon}
                            onChange={(e) => setTelefon(e.target.value)}
                            className="mt-1 w-full border border-charcoal/15 rounded-xl px-4 py-2.5 text-sm bg-white"
                        />
                    </label>
                    <label className="block">
                        <span className="text-xs font-bold text-charcoal/50 uppercase tracking-wider">
                            Şehir
                        </span>
                        <input
                            value={sehir}
                            onChange={(e) => setSehir(e.target.value)}
                            placeholder="Örn. Van / Erciş"
                            className="mt-1 w-full border border-charcoal/15 rounded-xl px-4 py-2.5 text-sm bg-white"
                        />
                    </label>
                    <label className="block">
                        <span className="text-xs font-bold text-charcoal/50 uppercase tracking-wider">
                            Konu
                        </span>
                        <select
                            value={konu}
                            onChange={(e) => setKonu(e.target.value)}
                            className="mt-1 w-full border border-charcoal/15 rounded-xl px-4 py-2.5 text-sm bg-white"
                        >
                            {KONULAR.map((k) => (
                                <option key={k} value={k}>
                                    {k}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <span className="text-xs font-bold text-charcoal/50 uppercase tracking-wider">
                            Olay özeti * (en az 30 karakter)
                        </span>
                        <textarea
                            required
                            rows={6}
                            value={ozet}
                            onChange={(e) => setOzet(e.target.value)}
                            placeholder="Tarihler, taraflar, ne talep ettiğiniz — gizli kalmasını istediğiniz ayrıntıları yazmayın."
                            className="mt-1 w-full border border-charcoal/15 rounded-xl px-4 py-2.5 text-sm bg-white"
                        />
                    </label>
                    <label className="flex gap-2 items-start text-sm text-charcoal/60">
                        <input
                            type="checkbox"
                            checked={kvkk}
                            onChange={(e) => setKvkk(e.target.checked)}
                            className="mt-1"
                        />
                        <span>
                            <Link href="/gizlilik" className="text-accent underline">
                                Gizlilik / KVKK
                            </Link>{' '}
                            metnini okudum; iletişim amacıyla açık rıza veriyorum. *
                        </span>
                    </label>
                    <button
                        type="submit"
                        disabled={!valid}
                        className="w-full bg-accent text-white font-bold py-3.5 rounded-full disabled:opacity-40 hover:bg-accent/90 transition-colors"
                    >
                        E-posta ile gönder
                    </button>
                </form>

                <p className="mt-6 text-[11px] text-charcoal/40 leading-relaxed">
                    Reklam yasağına uygun bilgilendirme formu · Ücret teklifi veya sonuç vaadi içermez ·{' '}
                    <Link href="/yasal-uyari" className="underline">
                        Yasal uyarı
                    </Link>
                </p>
            </main>
            <Footer />
        </div>
    );
}
