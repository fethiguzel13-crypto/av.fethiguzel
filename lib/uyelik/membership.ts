import { UYELIK } from './config';
import { membershipActive } from './crypto';
import { updateUser } from './store';
import type { UserRecord } from './types';

export function extendUntil(fromIso: string | null | undefined, days = UYELIK.periodDays): string {
  const base = membershipActive(fromIso) && fromIso ? Date.parse(fromIso) : Date.now();
  const start = Number.isFinite(base) ? base : Date.now();
  return new Date(start + days * 24 * 60 * 60 * 1000).toISOString();
}

export async function activateMembership(
  user: UserRecord,
  kind: NonNullable<UserRecord['lastPaymentKind']>
): Promise<UserRecord> {
  const next = await updateUser(user.id, {
    membershipUntil: extendUntil(user.membershipUntil),
    pendingRef: null,
    pendingAt: null,
    lastPaymentAt: new Date().toISOString(),
    lastPaymentKind: kind,
  });
  return next || { ...user, membershipUntil: extendUntil(user.membershipUntil) };
}
