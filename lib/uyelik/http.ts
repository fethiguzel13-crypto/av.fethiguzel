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
import { adminCerezDegeri, girisGirdisiDenetle, guvenliEsit, kayitGirdisiDenetle, kokenGuvenilir } from './guvenlik';
import { paymentOk, retrieveCheckout, startCheckout, userIdFromResponse } from './iyzico';
import { activateMembership, extendUntil } from './membership';
import { clientIp, rateLimit, rateLimitDolu } from './rate-limit';
import { applySessionCookies, cookieOptions, getAccess, setSessionCookie, clearSessionCookie } from './session';
import { getUserByEmail, getUserById, listUsers, updateUser, upsertUser } from './store';
import type { UserRecord } from './types';

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
    if (guvenliEsit(auth, `Bearer ${secret}`)) return true;
    const jar = await cookies();
    return guvenliEsit(jar.get(UYELIK.adminCookie)?.value || '', adminCerezDegeri(secret));
}

// Yönetici ucunda IP başına 15 dakikada 10 başarısız deneme; başarılı istekler sayılmaz.
const ADMIN_HATA_SINIRI = 10;
const ADMIN_HATA_PENCERESI = 15 * 60 * 1000;

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

    // Başka sitenin gönderdiği form ziyaretçiyi saldırganın hesabına sokabilir (giriş CSRF'i).
    // iyzico dönüşü siteler arası POST olduğu için denetim dışıdır; o yol token'ı iyzico'dan doğrular.
    if (method === 'POST' && key !== 'odeme/sonuc' && !kokenGuvenilir(req, siteOrigin())) {
        return json({ ok: false, error: 'İstek başka bir siteden geldi.' }, 403);
    }

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
        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return json({ ok: false, error: 'Geçersiz istek.' }, 400);
        }
        const girdi = girisGirdisiDenetle(body);
        if (!girdi.ok) return json({ ok: false, error: girdi.error }, girdi.error === 'Geçersiz istek.' ? 400 : 401);
        const { email, password } = girdi;
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
        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return json({ ok: false, error: 'Geçersiz istek.' }, 400);
        }
        const girdi = kayitGirdisiDenetle(body);
        if (!girdi.ok) return json({ ok: false, error: girdi.error }, 400);
        const { email, password, name } = girdi;
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
        // Aynı ödeme dönüşü tekrar çağrılırsa üyelik yeniden uzamaz (G04/B1).
        let activated: UserRecord;
        try {
            activated = await activateMembership(found, 'iyzico', result.paymentId || token);
        } catch (e) {
            // Tahsilat yapıldı ama depo yazılamadı: üye bekletilmez, dönem sonu çerezde taşınır.
            // Kayıt yönetici panelinden elle etkinleştirilir; log bunun için.
            console.error('[uyelik] ödeme alındı, üyelik kaydı yazılamadı', {
                uid: found.id,
                paymentId: result.paymentId || null,
                hata: e instanceof Error ? e.message : String(e),
            });
            activated = { ...found, membershipUntil: extendUntil(found.membershipUntil) };
        }
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
        const hataAnahtari = `admin:${clientIp(req)}`;
        if (rateLimitDolu(hataAnahtari, ADMIN_HATA_SINIRI)) {
            return json({ ok: false, error: 'Çok fazla başarısız deneme. Bir süre sonra yeniden deneyin.' }, 429);
        }
        const yetkisiz = () => {
            rateLimit(hataAnahtari, ADMIN_HATA_SINIRI, ADMIN_HATA_PENCERESI);
            return json({ ok: false, error: 'Yetkisiz.' }, 401);
        };
        if (method === 'GET') {
            if (!(await isAdmin(req))) return yetkisiz();
            const users = await listUsers();
            return json({ ok: true, users: users.map(stripHash) });
        }
        let body: { secret?: string; email?: string; list?: boolean; odemeKimligi?: string };
        try {
            body = (await req.json()) || {};
        } catch {
            return json({ ok: false, error: 'Geçersiz istek.' }, 400);
        }
        const sirDogru = guvenliEsit(String(body.secret || ''), secret);
        if (sirDogru) {
            const jar = await cookies();
            jar.set(UYELIK.adminCookie, adminCerezDegeri(secret), { ...cookieOptions(), maxAge: 60 * 60 * 12 });
        }
        if (!sirDogru && !(await isAdmin(req))) return yetkisiz();
        if (body.list) {
            const users = await listUsers();
            return json({ ok: true, users: users.map(stripHash) });
        }
        const email = normalizeEmail(body.email || '');
        const user = await getUserByEmail(email);
        if (!user) return json({ ok: false, error: 'Üye bulunamadı.' }, 404);
        // Depo kesintisinde kaydedilemeyen iyzico ödemesi elle işlenirken logdaki paymentId verilir; böylece
        // aynı ödeme dönüşü sonradan tekrar çağrılınca bir dönem daha eklenmez.
        const odemeKimligi = String(body.odemeKimligi || '').trim().slice(0, 100) || undefined;
        const activated = await activateMembership(user, 'admin', odemeKimligi);
        return json({ ok: true, user: stripHash(activated) });
    }

    return json({ ok: false, error: 'Bulunamadı.' }, 404);
}
