import { Haptics, ImpactStyle } from '@capacitor/haptics';

/**
 * Dokunsal geri bildirim. Native uygulama hissinin en ucuz ve en etkili
 * bileşeni; tarayıcıda sessizce yok sayılır.
 *
 * Kullanıcı tercihi kapalıysa hiç tetiklenmez — bazı kullanıcılar titreşimi
 * rahatsız edici buluyor ve bunu kapatamamak düşük puan sebebi oluyor.
 */
let enabled = true;

export function setHapticsEnabled(v: boolean) {
  enabled = v;
  try {
    localStorage.setItem('galaxy:haptics', v ? '1' : '0');
  } catch {
    /* yok sayılır */
  }
}

export function hapticsEnabled(): boolean {
  try {
    const v = localStorage.getItem('galaxy:haptics');
    if (v !== null) enabled = v === '1';
  } catch {
    /* yok sayılır */
  }
  return enabled;
}

export async function tapFeedback(): Promise<void> {
  if (!hapticsEnabled()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    /* tarayıcı veya donanım desteklemiyor */
  }
}

export async function successFeedback(): Promise<void> {
  if (!hapticsEnabled()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    /* yok sayılır */
  }
}
