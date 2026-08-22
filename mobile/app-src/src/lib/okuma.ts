import { getJSON, setJSON, KEYS } from './storage';

/**
 * Okuma geçmişi — «kaldığınız yer».
 *
 * Hukuk araştırması kesintili bir iştir: telefon kapanır, duruşma başlar,
 * dosya değişir. Uygulamayı yeniden açan kişi en son baktığı maddeyi
 * baştan aramak zorunda kalmamalı.
 *
 * Kayıt yalnız cihazda tutulur; hiçbir sunucuya gitmez. Bu, uygulamanın
 * "aramalarınız hiçbir yere gitmez" vaadinin parçasıdır.
 */

export type OkunanTur = 'madde' | 'karar' | 'kavram' | 'eser' | 'rehber';

export type OkunanKayit = {
  /** «/mevzuat/tbk/madde-13» */
  yol: string;
  baslik: string;
  altSatir: string;
  tur: OkunanTur;
  /** epoch ms */
  zaman: number;
};

const EN_COK = 12;

/**
 * Bir kaydı geçmişin başına koyar.
 *
 * Aynı yol daha önce okunmuşsa ÇOĞALTILMAZ, başa taşınır: aynı maddeye üç
 * kez bakmak listeyi tek başına doldurmamalı.
 */
export function okumaKaydet(kayit: Omit<OkunanKayit, 'zaman'>): void {
  if (!kayit.yol || !kayit.baslik) return;
  try {
    const oncekiler = getJSON<OkunanKayit[]>(KEYS.lastRead, []);
    const kalanlar = oncekiler.filter((k) => k.yol !== kayit.yol);
    const yeni: OkunanKayit[] = [{ ...kayit, zaman: Date.now() }, ...kalanlar].slice(0, EN_COK);
    setJSON(KEYS.lastRead, yeni);
  } catch {
    /* geçmiş tutulamıyorsa okuma yine de çalışsın */
  }
}

export function okumaGecmisi(): OkunanKayit[] {
  try {
    return getJSON<OkunanKayit[]>(KEYS.lastRead, []);
  } catch {
    return [];
  }
}

export function okumaGecmisiniTemizle(): void {
  try {
    setJSON(KEYS.lastRead, []);
  } catch {
    /* yok sayılır */
  }
}
