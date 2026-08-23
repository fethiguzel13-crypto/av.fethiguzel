import { match } from '../lib/router';
import { kanunAdi, kanunKodu } from '../lib/kanunlar';
import { APP_TABS } from '../lib/nav';

/** Sekmeye dokunularak varılan sayfalar — kendi büyük başlıklarını taşırlar. */
const KOKLER = new Set(APP_TABS.map((t) => t.path));

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
  /*
    Sekme köklerinde çubuk uygulamanın ADINI yazar.

    Bu sayfaların hepsi kendi başlığını zaten büyük puntoyla basıyor:
    ekranın üstünde «Mevzuat», hemen altında yine «Mevzuat» görünüyordu.
    Aynı kelimeyi iki kez yazmak bilgi vermez; oysa uygulamanın adı ancak
    bir yerde durabilir ve doğru yer burasıdır. İçeri girildiğinde çubuk
    yeniden bağlama döner: bir maddedeyken kanunun adına, bir kararda
    arşive.
  */
  if (KOKLER.has(path)) return uygulamaAdi;

  const madde = match('/mevzuat/:kanun/:madde', path);
  if (madde) return kanunAdi(madde.kanun);

  const kanun = match('/mevzuat/:kanun', path);
  if (kanun) return kanunKodu(kanun.kanun);

  if (path === '/ara') return 'Mevzuatta ara';
  if (path === '/indirilenler') return 'Kaydettikleriniz';

  if (path.startsWith('/karar/')) return 'Yargıtay arşivi';
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
