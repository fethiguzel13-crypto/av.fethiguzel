package com.avfethiguzel.hukuk;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Ekran koruma eklentisi köprü kurulmadan ÖNCE kaydedilmelidir;
        // super.onCreate çağrıldıktan sonra kaydedilen eklenti arayüzden
        // görünmez ve karar okuma ekranı sessizce korumasız kalır.
        registerPlugin(EkranKorumaPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
