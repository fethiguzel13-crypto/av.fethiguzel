import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PROFILE, SITE_URL } from '@/lib/profile';

export const metadata: Metadata = {
    title: 'محامٍ في تركيا | فان · أرجيش — Av. Fethi Güzel',
    description:
        'معلومات مهنية: محامٍ ووسيط في فان / أرجيش، تركيا. دراسات دكتوراه في القانون الخاص. للتواصل عبر البريد الإلكتروني.',
    alternates: { canonical: `${SITE_URL}/ar` },
    openGraph: {
        title: 'محامٍ تركي — Av. Fethi Güzel',
        url: `${SITE_URL}/ar`,
        locale: 'ar_AR',
    },
};

export default function ArabicLandingPage() {
    return (
        <div className="bg-cream min-h-screen" dir="rtl" lang="ar">
            <Navbar />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-2xl mx-auto text-right">
                <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
                    العربية · معلومات مهنية
                </p>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4 leading-tight">
                    محامٍ في تركيا — فان / أرجيش
                </h1>
                <p className="text-charcoal/65 leading-relaxed mb-6">
                    <strong>{PROFILE.name}</strong> محامٍ ووسيط مقره في أرجيش / فان. يعمل في مجال
                    القانون الخاص (مدني، عقود، تجاري، إجراءات) ويجري دراسات دكتوراه. مؤلّف كتاب عن
                    الجلسات عن بُعد (e-duruşma). الإنجليزية بمستوى مهني.
                </p>
                <ul className="space-y-2 text-sm text-charcoal/70 mb-8 list-disc pr-5">
                    <li>معلومات عامة فقط — لا ضمان لنتائج الدعاوى</li>
                    <li>التواصل: البريد الإلكتروني أو نموذج ما قبل التقييم</li>
                    <li>الموقع الرئيسي باللغة التركية: مكتبة تشريع وتعليقات أكاديمية</li>
                </ul>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                    <a
                        href={`mailto:${PROFILE.email}?subject=Legal%20inquiry%20(Arabic%2FEN)`}
                        className="inline-flex justify-center bg-accent text-white px-6 py-3 rounded-full font-bold text-sm"
                    >
                        راسلنا بالبريد
                    </a>
                    <Link
                        href="/english-speaking-lawyer"
                        className="inline-flex justify-center bg-charcoal text-cream px-6 py-3 rounded-full font-bold text-sm"
                    >
                        English
                    </Link>
                    <Link
                        href="/avukat-fethi-guzel"
                        className="inline-flex justify-center border border-charcoal/15 px-6 py-3 rounded-full font-bold text-sm"
                    >
                        التركية
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
