package com.avfethiguzel.hukuk;

import android.view.WindowManager;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Ekran görüntüsü ve ekran kaydı engeli.
 *
 * Yargıtay karar arşivi ücretli bir külliyattır. Kararın tam metni açıkken
 * ekran görüntüsü alınmasını ve ekran kaydını engellemek için pencereye
 * FLAG_SECURE konur; Android bu bayrak açıkken hem ekran görüntüsünü hem
 * de ekran paylaşımını reddeder, son kullanılanlar listesinde de içerik
 * yerine boş bir kart gösterir.
 *
 * Bayrak UYGULAMA GENELİNDE değil, YALNIZ KARAR OKUMA EKRANINDA açılır.
 * Sürekli açık bırakmak, kanun maddesinin ekran görüntüsünü almak isteyen
 * kullanıcıyı da engellerdi; mevzuat ücretsiz ve paylaşılabilir olmalıdır.
 *
 * Sınırı açıkça belirtmek gerekir: FLAG_SECURE cihaz üzerindeki yazılım
 * kaydını durdurur, ikinci bir telefonla ekranın fotoğrafını çekmeyi
 * durdurmaz. Amaç toplu kopyalamayı zorlaştırmaktır.
 */
@CapacitorPlugin(name = "EkranKoruma")
public class EkranKorumaPlugin extends Plugin {

    @PluginMethod
    public void ac(PluginCall call) {
        final PluginCall cagri = call;
        getActivity()
            .runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        getActivity()
                            .getWindow()
                            .setFlags(
                                WindowManager.LayoutParams.FLAG_SECURE,
                                WindowManager.LayoutParams.FLAG_SECURE
                            );
                        cagri.resolve();
                    }
                }
            );
    }

    @PluginMethod
    public void kapat(PluginCall call) {
        final PluginCall cagri = call;
        getActivity()
            .runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
                        cagri.resolve();
                    }
                }
            );
    }
}
