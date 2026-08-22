import { match } from '../lib/router';
import { kanunAdi, kanunKodu } from '../lib/kanunlar';

/**
 * Başlık çubuğunun yazacağı metin.
 *
 * Önceki sürüm her ekranda «Av. Fethi Güzel Hukuk Asistanı» yazıyordu.
 * Kullanıcı zaten hangi uygulamada olduğunu biliyor; bilmediği şey nerede
 * olduğu. Başlık artık ÜST bağlamı söyler: bir maddedeyken kanunun adını,
 * bir kararda arşivi, bir kavramda sözlüğü.
 *
 * Detay ekranının kendi başlığı sayfanın içinde zaten büyük puntoyla duruyor;
 * çubukta onu tekrar etmek aynı bilgiyi iki kez yazmak olurdu.
 */
export function cubukBasligi(path: string, uygulamaAdi: string): string {
  const madde = match('/mevzuat/:kanun/:madde', path);
  if (madde) return kanunAdi(madde.kanun);

  const kanun = match('/mevzuat/:kanun', path);
  if (kanun) return kanunKodu(kanun.kanun);

  if (path === '/mevzuat') return 'Mevzuat';
  if (path === '/ara') return 'Mevzuatta ara';
  if (path === '/indirilenler') return 'Kaydettikleriniz';

  if (path === '/arsiv' || path.startsWith('/karar/')) return 'Yargıtay arşivi';
  if (path === '/uyelik') return 'Arşiv üyeliği';
  if (path === '/icthat') return 'Günlük içtihat';
  if (path === '/takip') return 'Takip ettikleriniz';

  if (path === '/kitaplik') return 'Kitaplık';
  if (path === '/kavram' || path.startsWith('/kavram/')) return 'Kavram sözlüğü';
  if (path === '/eserler' || path.startsWith('/eser/')) return 'Akademik eserler';
  if (path === '/rehber' || path.startsWith('/rehber/')) return 'Vatandaş rehberi';
  if (path === '/kategoriler' || path.startsWith('/kategori/')) return 'Rehber konuları';
  if (path === '/kaydettiklerim') return 'Kaydettikleriniz';

  if (path === '/hesap' || path.startsWith('/arac/')) return 'Hesaplama';
  if (path === '/favoriler') return 'Favori araçlar';
  if (path === '/gecmis') return 'Hesap geçmişi';

  if (path === '/ayarlar') return 'Ayarlar';
  if (path === '/diger') return 'Diğer';

  return uygulamaAdi;
}
