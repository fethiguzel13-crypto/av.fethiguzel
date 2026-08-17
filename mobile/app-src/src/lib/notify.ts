import { LocalNotifications } from '@capacitor/local-notifications';

/**
 * Yerel bildirimler.
 *
 * Bilinçli olarak *yerel* — sunucu tarafı push yok. İki nedeni var:
 * kullanıcının cihaz kimliği hiçbir yere gitmiyor (Play Veri Güvenliği
 * formunda "veri toplanmıyor" beyanını dürüst kılar) ve altyapı gerekmiyor.
 * Uygulama günde bir kez uyanıp içeriği tazeler, bildirimi cihaz üretir.
 */

const DAILY_ID = 1001;
const CHANNEL_ID = 'gunluk-icthat';

export async function ensureNotificationPermission(): Promise<boolean> {
  try {
    const current = await LocalNotifications.checkPermissions();
    if (current.display === 'granted') return true;
    const asked = await LocalNotifications.requestPermissions();
    return asked.display === 'granted';
  } catch {
    return false;
  }
}

async function ensureChannel(): Promise<void> {
  try {
    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: 'Günlük içtihat',
      description: 'Her sabah o günün karar özeti',
      // 3 = DEFAULT: ses çıkarır ama ekranı kaplamaz.
      importance: 3,
      // 1 = PUBLIC: kilit ekranında görünür.
      visibility: 1,
      vibration: false,
    });
  } catch {
    /* Android dışı platform veya eski sürüm */
  }
}

/** Her sabah 08.30 için yinelenen hatırlatma. */
export async function scheduleDailyBrief(hour = 8, minute = 30): Promise<boolean> {
  const ok = await ensureNotificationPermission();
  if (!ok) return false;
  await ensureChannel();

  try {
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_ID }] });
    await LocalNotifications.schedule({
      notifications: [
        {
          id: DAILY_ID,
          title: 'Günün içtihatları hazır',
          body: 'Yargıtay, Danıştay ve AYM kararlarının bugünkü özeti.',
          channelId: CHANNEL_ID,
          // scripts/generate-icons.mjs bu tek renkli simgeyi üretir.
          smallIcon: 'ic_stat_notify',
          schedule: { on: { hour, minute }, allowWhileIdle: false, repeats: true },
          extra: { route: '/' },
        },
      ],
    });
    return true;
  } catch {
    return false;
  }
}

export async function cancelDailyBrief(): Promise<void> {
  try {
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_ID }] });
  } catch {
    /* yok sayılır */
  }
}

/** Bildirime dokunulduğunda ilgili ekrana git. */
export function onNotificationTap(handler: (route: string) => void): () => void {
  let handle: { remove: () => void } | null = null;
  LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
    const route = (event.notification.extra as { route?: string } | undefined)?.route;
    handler(route || '/');
  })
    .then((h) => {
      handle = h;
    })
    .catch(() => {});
  return () => handle?.remove();
}
