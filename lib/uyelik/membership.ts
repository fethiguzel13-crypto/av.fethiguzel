import { UYELIK } from './config';
import { membershipActive } from './crypto';
import { mutateUser } from './store';
import type { UserRecord } from './types';

const ODEME_HAFIZASI = 20;

export function extendUntil(fromIso: string | null | undefined, days = UYELIK.periodDays): string {
  const base = membershipActive(fromIso) && fromIso ? Date.parse(fromIso) : Date.now();
  const start = Number.isFinite(base) ? base : Date.now();
  return new Date(start + days * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * Üyeliği bir dönem uzatır. `odemeKimligi` verilirse aynı ödeme ikinci kez işlenmez: ödeme dönüşü
 * adresi (`odeme/sonuc?token=…`) tekrar çağrılınca üyelik yeniden uzamaz. Denetim yazma kuyruğunda,
 * deponun güncel kaydı üzerinde yapılır.
 */
export async function activateMembership(
  user: UserRecord,
  kind: NonNullable<UserRecord['lastPaymentKind']>,
  odemeKimligi?: string
): Promise<UserRecord> {
  const next = await mutateUser(user.id, (current) => {
    const islenen = current.islenenOdemeler || [];
    if (odemeKimligi && islenen.includes(odemeKimligi)) return null;
    return {
      membershipUntil: extendUntil(current.membershipUntil),
      pendingRef: null,
      pendingAt: null,
      lastPaymentAt: new Date().toISOString(),
      lastPaymentKind: kind,
      ...(odemeKimligi ? { islenenOdemeler: [...islenen, odemeKimligi].slice(-ODEME_HAFIZASI) } : {}),
    };
  });
  return next || { ...user, membershipUntil: extendUntil(user.membershipUntil) };
}
