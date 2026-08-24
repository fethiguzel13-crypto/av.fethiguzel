import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
    adminSecret,
    hasSessionSecret,
    havaleInfo,
    iyzicoConfigured,
    priceLabel,
    siteOrigin,
    UYELIK,
} from './config';
import { hashPassword, newHavaleRef, newId, normalizeEmail, verifyPassword } from './crypto';
import { paymentOk, retrieveCheckout, startCheckout } from './iyzico';
import { activateMembership } from './membership';
import { clientIp, rateLimit } from './rate-limit';
import { cookieOptions, getAccess, setSessionCookie, clearSessionCookie } from './session';
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
        return json({ ok: false, error: 'Oturum anahtarı tanımlı değil.' }, 503);
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
        const havale = havaleInfo();
        return json({
            ok: true,
            user: publicUser,
            member,
            plan: {
                name: UYELIK.name,
                priceTl: UYELIK.priceTl,
                priceLabel: priceLabel(),
                periodDays: UYELIK.periodDays,
                iyzico: iyzicoConfigured(),
                havale: Boolean(havale.iban),
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
        const { user } = await getAccess();
        if (!user) return json({ ok: false, error: 'Giriş yapın.', next: '/uyelik/giris' }, 401);
        if (!iyzicoConfigured()) {
            return json({ ok: false, error: 'Kart ödemesi henüz açık değil. Havale ile devam edin.' }, 503);
        }
        const result = await startCheckout(user);
        if (result.status !== 'success' || !result.checkoutFormContent) {
            return json({ ok: false, error: result.errorMessage || 'Ödeme formu açılamadı.' }, 502);
        }
        return json({
            ok: true,
            token: result.token,
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
        if (!token) return NextResponse.redirect(`${origin}/uyelik/odeme?durum=hata`);
        const result = await retrieveCheckout(token);
        if (!paymentOk(result)) return NextResponse.redirect(`${origin}/uyelik/odeme?durum=hata`);
        const conversation = String(result.conversationId || '');
        const fullId = conversation.startsWith('uyelik-')
            ? conversation.slice('uyelik-'.length).replace(/-\d+$/, '')
            : '';
        const found = fullId ? await getUserById(fullId) : null;
        if (!found) return NextResponse.redirect(`${origin}/uyelik/odeme?durum=hesap`);
        const activated = await activateMembership(found, 'iyzico');
        await setSessionCookie(activated);
        return NextResponse.redirect(`${origin}/uyelik/odeme/tamam`);
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
