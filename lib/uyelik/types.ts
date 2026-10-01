export type UyelikDurum = 'none' | 'pending' | 'active' | 'expired';

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  membershipUntil: string | null;
  pendingRef: string | null;
  pendingAt: string | null;
  lastPaymentAt: string | null;
  lastPaymentKind: 'iyzico' | 'havale' | 'admin' | null;
  /** Üyeliği uzatmış ödeme kimlikleri (son 20); aynı ödemenin tekrar işlenmesini engeller. */
  islenenOdemeler?: string[];
};

export type SessionPayload = {
  uid: string;
  em: string;
  until: number;
  exp: number;
};

export type PublicSession = {
  id: string;
  email: string;
  name: string;
  member: boolean;
  membershipUntil: string | null;
  pendingRef: string | null;
  durum: UyelikDurum;
};

export type StoreFile = {
  version: 1;
  users: UserRecord[];
};
