import { cookies } from 'next/headers';
import { hasSessionSecret, UYELIK } from './config';
import { membershipActive, readSession, signSession } from './crypto';
import { getUserById } from './store';
import type { PublicSession, SessionPayload, UyelikDurum, UserRecord } from './types';

const COOKIE_MAX = 60 * 60 * 24 * 180;

function durumOf(user: Pick<UserRecord, 'membershipUntil' | 'pendingRef'>): UyelikDurum {
  if (membershipActive(user.membershipUntil)) return 'active';
  if (user.pendingRef) return 'pending';
  if (user.membershipUntil) return 'expired';
  return 'none';
}

export function toPublic(user: UserRecord, cookieUntil?: number): PublicSession {
  const untilIso = user.membershipUntil;
  const untilMs = Math.max(untilIso ? Date.parse(untilIso) || 0 : 0, cookieUntil || 0);
  const member = membershipActive(untilMs);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    member,
    membershipUntil: untilMs ? new Date(untilMs).toISOString() : null,
    pendingRef: user.pendingRef,
    durum: member ? 'active' : durumOf(user),
  };
}

export function cookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: COOKIE_MAX,
  };
}

export async function setSessionCookie(user: UserRecord): Promise<void> {
  if (!hasSessionSecret() && process.env.NODE_ENV === 'production') {
    throw new Error('UYELIK_SESSION_SECRET (en az 16 karakter) tanımlı değil.');
  }
  const now = Math.floor(Date.now() / 1000);
  const until = user.membershipUntil ? Date.parse(user.membershipUntil) || 0 : 0;
  const payload: SessionPayload = {
    uid: user.id,
    em: user.email,
    until,
    exp: now + COOKIE_MAX,
  };
  const jar = await cookies();
  jar.set(UYELIK.cookie, signSession(payload), cookieOptions());
  jar.set(UYELIK.uiCookie, user.membershipUntil && membershipActive(user.membershipUntil) ? '1' : '0', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(UYELIK.cookie, '', { ...cookieOptions(), maxAge: 0 });
  jar.set(UYELIK.uiCookie, '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function readSessionCookie(): Promise<SessionPayload | null> {
  const jar = await cookies();
  return readSession(jar.get(UYELIK.cookie)?.value);
}

const EMPTY_ACCESS = {
  session: null as SessionPayload | null,
  user: null as UserRecord | null,
  publicUser: null as PublicSession | null,
  member: false,
};

export async function getAccess(): Promise<{
  session: SessionPayload | null;
  user: UserRecord | null;
  publicUser: PublicSession | null;
  member: boolean;
}> {
  try {
    const session = await readSessionCookie();
    if (!session) return EMPTY_ACCESS;
    const user = await getUserById(session.uid);
    if (user) {
      const pub = toPublic(user, session.until);
      return { session, user, publicUser: pub, member: pub.member };
    }
    const member = membershipActive(session.until);
    return {
      session,
      user: null,
      publicUser: {
        id: session.uid,
        email: session.em,
        name: '',
        member,
        membershipUntil: session.until ? new Date(session.until).toISOString() : null,
        pendingRef: null,
        durum: member ? 'active' : 'none',
      },
      member,
    };
  } catch {
    return EMPTY_ACCESS;
  }
}

export function requestHasMemberCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const parts = cookieHeader.split(';');
  for (const p of parts) {
    const [k, ...rest] = p.trim().split('=');
    if (k === UYELIK.cookie) {
      const session = readSession(rest.join('='));
      return Boolean(session && membershipActive(session.until));
    }
  }
  return false;
}
