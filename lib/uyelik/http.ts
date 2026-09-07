import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
    adminSecret,
    hasSessionSecret,
    havaleEnabled,
    havaleInfo,
    kartCanli,
    kartEnabled,
    periodLabel,
    priceLabel,
    siteOrigin,
    UYELIK,
} from './config';
import { hashPassword, newHavaleRef, newId, normalizeEmail, verifyPassword } from './crypto';
import { paymentOk, retrieveCheckout, startCheckout, userIdFromResponse } from './iyzico';
import { activateMembership } from './membership';
import { clientIp, rateLimit } from './rate-limit';
import { applySessionCookies, cookieOptions, getAccess, setSessionCookie, clearSessionCookie } from './session';
import { getUserByEmail, getUserById, listUsers, updateUser, upsertUser } from './store';
import type { UserRecord } from './types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data: unknown, status = 200, extra?: HeadersInit) {
    return NextResponse.json(data, { status, headers: extra });
}

function stripHash(u: UserRecord) {
    const { passwordHash: _pw, ...rest } = u;
    void _pw;
    return rest;
}

const IPV4_RE = /^(\d{1,3}\.){3}\d{1,3}$/;

/** iyzico geçerli bir IP bekler; yerelde `local`/IPv6 gelirse yedeğe düşülür. */
function payerIp(req: Request): string {
    const ip = clientIp(req);
    if (IPV4_RE.test(ip) && !ip.startsWith('127.') && !ip.startsWith('10.') && !ip.startsWith('192.168.')) {
        return ip;
    }
    return '85.34.78.112';
}

async function isAdmin(req: Request): Promise<boolean> {
    const secret = adminSecret();
    if (!secret) return false;
    const auth = req.headers.get('authorization') || '';
    if (auth === `Bearer ${secret}`) return true;
    const jar = await cookies();
    return jar.get(UYELIK.adminCookie)?.value === secret;
}

async function needSecret(): Promise<NextResponse | null> {
    if (process.env.NODE_ENV === 'production' && !hasSessionSecret()) {
        // Vercel Environment Variables: UYELIK_SESSION_SECRET (≥16 karakter).
        // Eksikse kayıt/giriş bilinçli olarak kapanır; sahte oturum üretilmez.
        return json(
            {
                ok: false,
                error:
                    'Üyelik şu an açılamıyor: sunucuda oturum anahtarı (UYELIK_SESSION_SECRET) tanımlı değil. Site yöneticisinin Vercel ortam değişkenlerine eklemesi gerekir.',
                code: 'MISSING_SESSION_SECRET',
            },
            503
        );
    }
    return null;
}

export async function handleUyelik(
    req: Request,
    path: string[]
): Promise<NextResponse> {
    const key = path.filter(Boolean).join('/');
    const method = req.method.toUpperCase();

    if (method === 'GET' && (key === 'ben' || key === '')) {
        const { publicUser, member, user } = await getAccess();
        if (user) {
            try {
                await setSessionCookie(user);
            } catch {
                /* ignore */
            }
        }
        const kart = kartEnabled();
        return json({
            ok: true,
            user: publicUser,
            member,
            plan: {
                name: UYELIK.name,
                priceTl: UYELIK.priceTl,
                priceLabel: priceLabel(),
                periodDays: UYELIK.periodDays,
                periodLabel: periodLabel(),
                kart,
                kartTest: kart && !kartCanli(),
                // Geriye dönük ad; eski istemciler `iyzico` alanını okuyor.
                iyzico: kart,
                havale: havaleEnabled(),
            },
        });
    }

    if (method === 'POST' && key === 'cikis') {
        await clearSessionCookie();
        return json({ ok: true, next: '/' });
    }

    if (method === 'POST' && key === 'giris') {
        const blocked = await needSecret();
        if (blocked) return blocked;
        if (!rateLimit(`giris:${clientIp(req)}`, 12, 15 * 60 * 1000)) {
            return json({ ok: false, error: 'Çok fazla deneme. Bir süre sonra yeniden deneyin.' }, 429);
        }
        let body: { email?: string; password?: string };
        try {
            body = await req.json();
        } catch {
            return json({ ok: false, error: 'Geçersiz istek.' }, 400);
        }
        const email = normalizeEmail(body.email || '');
        const password = String(body.password || '');
        const user = await getUserByEmail(email);
        if (!user || !(await verifyPassword(password, user.passwordHash))) {
            return json({ ok: false, error: 'E-posta veya şifre hatalı.' }, 401);
        }
        await setSessionCookie(user);
        return json({
            ok: true,
            next:
                user.membershipUntil && Date.parse(user.membershipUntil) > Date.now()
                    ? '/yargi-kararlari'
                    : '/uyelik/odeme',
        });
    }

    if (method === 'POST' && key === 'kayit') {
        const blocked = await needSecret();
        if (blocked) return blocked;
        if (!rateLimit(`kayit:${clientIp(req)}`, 8, 60 * 60 * 1000)) {
            return json({ ok: false, error: 'Çok fazla deneme. Bir süre sonra yeniden deneyin.' }, 429);
        }
        let body: {
            email?: string;
            password?: string;
            name?: string;
            kvkk?: boolean;
            dijitalIfa?: boolean;
        };
        try {
            body = await req.json();
        } catch {
            return json({ ok: false, error: 'Geçersiz istek.' }, 400);
        }
        const email = normalizeEmail(body.email || '');
        const password = String(body.password || '');
        const name = String(body.name || '').trim();
        if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'Geçerli bir e-posta girin.' }, 400);
        if (password.length < 8) return json({ ok: false, error: 'Şifre en az 8 karakter olmalı.' }, 400);
        if (name.length < 2) return json({ ok: false, error: 'Ad soyad girin.' }, 400);
        if (!body.kvkk) return json({ ok: false, error: 'KVKK aydınlatmasını onaylamanız gerekir.' }, 400);
        if (!body.dijitalIfa) {
            return json({ ok: false, error: 'Dijital içeriğin anında ifasını kabul etmeniz gerekir.' }, 400);
        }
        const existing = await getUserByEmail(email);
        if (existing) {
            return json({ ok: false, error: 'Bu e-posta ile kayıt var. Giriş yapın.' }, 409);
        }
        const user: UserRecord = {
            id: newId('u'),
            email,
            name,
            passwordHash: await hashPassword(password),
            createdAt: new Date().toISOString(),
            membershipUntil: null,
            pendingRef: null,
            pendingAt: null,
            lastPaymentAt: null,
            lastPaymentKind: null,
        };
        await upsertUser(user);
        await setSessionCookie(user);
        return json({ ok: true, next: '/uyelik/odeme' });
    }

    if (method === 'POST' && key === 'havale') {
        if (!rateLimit(`havale:${clientIp(req)}`, 8, 60 * 60 * 1000)) {
            return json({ ok: false, error: 'Çok fazla deneme.' }, 429);
        }
        if (!havaleEnabled()) {
            return json(
                { ok: false, error: 'Havale kapalı; ödeme kredi/banka kartı ile alınıyor.', code: 'HAVALE_KAPALI' },
                409
            );
        }
        const { user } = await getAccess();
        if (!user) return json({ ok: false, error: 'Giriş yapın.', next: '/uyelik/giris' }, 401);
        const ref = user.pendingRef || newHavaleRef();
        const updated = await updateUser(user.id, {
            pendingRef: ref,
            pendingAt: new Date().toISOString(),
        });
        const saved = updated || { ...user, pendingRef: ref };
        try {
            await setSessionCookie(saved);
        } catch {
            /* ignore */
        }
        const havale = havaleInfo();
        return json({
            ok: true,
            ref,
            amount: priceLabel(),
            periodDays: UYELIK.periodDays,
            iban: havale.iban,
            hesapAdi: havale.hesapAdi,
            banka: havale.banka,
        });
    }

    if (method === 'POST' && key === 'odeme/baslat') {
        if (!rateLimit(`odeme:${clientIp(req)}`, 10, 60 * 60 * 1000)) {
            return json({ ok: false, error: 'Çok fazla deneme.' }, 429);
        }
        const { user, member } = await getAccess();
        if (!user) return json({ ok: false, error: 'Giriş yapın.', next: '/uyelik/giris' }, 401);
        if (member) return json({ ok: true, already: true, next: '/yargi-kararlari' });
        if (!kartEnabled()) {
            return json(
                {
                    ok: false,
                    error: havaleEnabled()
                        ? 'Kart ödemesi henüz açık değil. Havale ile devam edin.'
                        : 'Kart ödemesi şu an kapalı. Kısa süre içinde yeniden deneyin.',
                    code: 'KART_KAPALI',
                },
                503
            );
        }
        const result = await startCheckout(user, payerIp(req));
        if (result.status !== 'success' || !result.checkoutFormContent) {
            return json({ ok: false, error: result.errorMessage || 'Ödeme formu açılamadı.' }, 502);
        }
        return json({
            ok: true,
            token: result.token,
            test: !kartCanli(),
            checkoutFormContent: result.checkoutFormContent,
        });
    }

    if ((method === 'POST' || method === 'GET') && key === 'odeme/sonuc') {
        const origin = siteOrigin();
        let token: string | null = null;
        if (method === 'GET') {
            token = new URL(req.url).searchParams.get('token');
        } else {
            const ctype = req.headers.get('content-type') || '';
            if (ctype.includes('application/x-www-form-urlencoded') || ctype.includes('multipart/form-data')) {
                const form = await req.formData();
                token = String(form.get('token') || '');
            } else {
                try {
                    const body = (await req.json()) as { token?: string };
                    token = body.token || null;
                } catch {
                    token = null;
                }
            }
        }
        if (!token) return NextResponse.redirect(`${origin}/uyelik/odeme?durum=hata`, 303);
        const result = await retrieveCheckout(token);
        if (!paymentOk(result)) return NextResponse.redirect(`${origin}/uyelik/odeme?durum=hata`, 303);
        const fullId = userIdFromResponse(result);
        const found = fullId ? await getUserById(fullId) : null;
        if (!found) return NextResponse.redirect(`${origin}/uyelik/odeme?durum=hesap`, 303);
        const activated = await activateMembership(found, 'iyzico');
        // Çerezi hem jar hem yanıt üzerinden yaz: iyzico geri dönüşü siteler
        // arası POST olduğu için yalnız jar'a güvenilmez.
        try {
            await setSessionCookie(activated);
        } catch {
            /* ignore */
        }
        const res = NextResponse.redirect(`${origin}/uyelik/odeme/tamam`, 303);
        await applySessionCookies(res, activated);
        return res;
    }

    if ((method === 'POST' || method === 'GET') && key === 'admin/aktifle') {
        const secret = adminSecret();
        if (!secret) return json({ ok: false, error: 'UYELIK_ADMIN_SECRET tanımlı değil.' }, 503);
        if (method === 'GET') {
            if (!(await isAdmin(req))) return json({ ok: false, error: 'Yetkisiz.' }, 401);
            const users = await listUsers();
            return json({ ok: true, users: users.map(stripHash) });
        }
        let body: { secret?: string; email?: string; list?: boolean };
        try {
            body = await req.json();
        } catch {
            return json({ ok: false, error: 'Geçersiz istek.' }, 400);
        }
        if (body.secret === secret) {
            const jar = await cookies();
            jar.set(UYELIK.adminCookie, secret, { ...cookieOptions(), maxAge: 60 * 60 * 12 });
        }
        if (!(await isAdmin(req)) && body.secret !== secret) {
            return json({ ok: false, error: 'Yetkisiz.' }, 401);
        }
        if (body.list) {
            const users = await listUsers();
            return json({ ok: true, users: users.map(stripHash) });
        }
        const email = normalizeEmail(body.email || '');
        const user = await getUserByEmail(email);
        if (!user) return json({ ok: false, error: 'Üye bulunamadı.' }, 404);
        const activated = await activateMembership(user, 'admin');
        return json({ ok: true, user: stripHash(activated) });
    }

    return json({ ok: false, error: 'Bulunamadı.' }, 404);
}
