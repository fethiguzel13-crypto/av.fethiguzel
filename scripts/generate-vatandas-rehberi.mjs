/**
 * Generates lib/vatandas-rehberi/data.ts — SEO citizen guides (target: 500).
 * Run: node scripts/generate-vatandas-rehberi.mjs
 *
 * Ana sayfada listelenmez; /bilgi dizini + sitemap + arama motorları için.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { EXTRA_ROWS } from './vatandas-topics-extra.mjs';
import {
  buildDeepBody,
  buildSpokeBody,
  buildBridgeBody,
  bodyWordCount,
} from './vatandas-content-engine.mjs';
import { applyProfessionalLayer } from './vatandas-professional-layer.mjs';
import { resolveSeoRole } from './vatandas-clusters.mjs';
import { getPillarBody } from './vatandas-pillars-wave2.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, '..', 'lib', 'vatandas-rehberi', 'data.ts');
const UPDATED = '2026-07-29';

/** Wave paketleri kısaysa deep engine’e düş; profesyonel katman sonra eklenir */
function pickDeepOrCustom(custom, deep, minWords) {
  if (custom && bodyWordCount(custom) >= minWords) return custom;
  return deep;
}

/**
 * Compact topic: [slug, title, description, h1, category, keywordsCsv, relatedCsv, linkLabel|href;..., seed?]
 * seed optional — uses generic builder if missing.
 */
const ROWS = [
  // —— Mevcut 35 (özel seed) ——
  ['emlak-vergisi-nedir', 'Emlak Vergisi Nedir? Nasıl Hesaplanır ve Ödenir?', 'Emlak vergisi nedir, kimler öder, oranlar, beyan, taksit ve e-Devlet ödeme. Vatandaş bilgilendirme rehberi.', 'Emlak vergisi nedir? Nasıl hesaplanır ve ödenir?', 'Vergi', 'emlak vergisi nedir,emlak vergisi nasıl ödenir,emlak vergisi oranları', 'vergi-borcu-yapislandirma,tapu-devri-nasil-yapilir,veraset-ilami-nasil-alinir', 'VUK|/kategori/vuk;Hesaplama|/hesaplama', 'emlak_vergisi'],
  ['veraset-ilami-nasil-alinir', 'Veraset İlamı Nasıl Alınır? e-Devlet ve Noter', 'Veraset ilamı nedir, e-Devlet, noter ve mahkeme yolu, belgeler. Adım adım rehber.', 'Veraset ilamı nasıl alınır?', 'Miras', 'veraset ilamı nasıl alınır,mirasçılık belgesi,veraset e-devlet', 'miras-payi-nasil-hesaplanir,e-devlet-veraset,tapu-devri-nasil-yapilir', 'Miras hukuku|/kategori/miras-hukuku;Miras hesap|/hesaplama/miras', 'veraset'],
  ['trafik-cezasina-itiraz', 'Trafik Cezasına İtiraz Nasıl Yapılır?', 'Trafik cezası itiraz süresi, usulü, e-Devlet ve merciler. Adım adım bilgilendirme.', 'Trafik cezasına itiraz nasıl yapılır?', 'Trafik', 'trafik cezasına itiraz,EDS ceza itiraz,trafik cezası süresi', 'idari-dava-nasil-acilir,tebligat-usulsuzlugu,ehliyet-alma-sartlari', 'KTK|/kategori/ktk;Ara|/ara?q=trafik', 'trafik'],
  ['idari-dava-nasil-acilir', 'İdari Dava Nasıl Açılır? Süre, Görev ve Dilekçe', 'İptal ve tam yargı davası, süre, görevli mahkeme, dilekçe. Vatandaş rehberi.', 'İdari dava nasıl açılır?', 'İdare', 'idari dava nasıl açılır,iptal davası,tam yargı davası', 'hukuk-davasi-nasil-acilir,trafik-cezasina-itiraz,kamulastirma-nedir', 'Mevzuat|/mevzuat;İçtihat|/icthat', 'idari'],
  ['hukuk-davasi-nasil-acilir', 'Hukuk Davası Nasıl Açılır? Görev, Yetki, Harç', 'Hukuk davası, görevli mahkeme, harç, tebligat, arabuluculuk dava şartı. Rehber.', 'Hukuk davası nasıl açılır?', 'Usul', 'hukuk davası nasıl açılır,dava dilekçesi,mahkeme harcı', 'idari-dava-nasil-acilir,arabuluculuk-nasil-yapilir,ihtiyati-tedbir-nedir', 'HMK|/kategori/hmk;Arabuluculuk|/rehber/arabuluculuk', 'hukuk'],
  ['engelli-araci-nasil-alinir', 'Engelli Aracı Nasıl Alınır? ÖTV Muafiyeti ve Plaka', 'Engelli aracı şartları, ÖTV muafiyeti, rapor, plaka ve devir. Bilgilendirme.', 'Engelli aracı nasıl alınır?', 'Engelli Hakları', 'engelli aracı nasıl alınır,engelli ÖTV,engelli plaka', 'engelli-raporu-nasil-alinir,emlak-vergisi-nedir,vergi-borcu-yapislandirma', 'ÖTV|/kategori/otv;Ara|/ara?q=%C3%96TV', 'engelli_arac'],
  ['bosanma-davasi-nasil-acilir', 'Boşanma Davası Nasıl Açılır? Anlaşmalı ve Çekişmeli', 'Anlaşmalı/çekişmeli boşanma, nafaka, velayet, mal rejimi. Adım adım rehber.', 'Boşanma davası nasıl açılır?', 'Aile', 'boşanma davası nasıl açılır,anlaşmalı boşanma,çekişmeli boşanma', 'nafaka-davasi-nedir,velayet-davasi,koruma-karari-6284', 'Aile hukuku|/kategori/aile-hukuku;Hesaplama|/hesaplama', 'bosanma'],
  ['nafaka-davasi-nedir', 'Nafaka Davası Nedir? Türleri ve Hesaplama', 'İştirak, yoksulluk, tedbir nafakası; nasıl istenir. Bilgilendirme rehberi.', 'Nafaka davası nedir? Türleri ve süreç', 'Aile', 'nafaka davası,yoksulluk nafakası,iştirak nafakası', 'bosanma-davasi-nasil-acilir,velayet-davasi,hukuk-davasi-nasil-acilir', 'Nafaka hesap|/hesaplama/nafaka;Aile|/kategori/aile-hukuku', 'nafaka'],
  ['icra-takibi-nedir', 'İcra Takibi Nedir? Nasıl Başlatılır ve Durdurulur?', 'İlamlı/ilamsız takip, ödeme emri, haciz, itiraz. Sade anlatım.', 'İcra takibi nedir? Nasıl işler?', 'İcra', 'icra takibi nedir,haciz nedir,ödeme emri', 'odeme-emrine-itiraz,icra-dosyasi-sorgulama,senet-icra-takibi', 'İİK|/kategori/iik;Faiz|/hesaplama/faiz', 'icra'],
  ['odeme-emrine-itiraz', 'Ödeme Emrine İtiraz Nasıl Yapılır? Süre ve Sonuç', '7 günlük itiraz, usul, itirazın iptali. Adım adım rehber.', 'Ödeme emrine itiraz nasıl yapılır?', 'İcra', 'ödeme emrine itiraz,7 gün itiraz,itirazın iptali', 'icra-takibi-nedir,tebligat-usulsuzlugu,hukuk-davasi-nasil-acilir', 'İİK|/kategori/iik;Tebligat|/kategori/tebligat', 'odeme_emri'],
  ['arabuluculuk-nasil-yapilir', 'Arabuluculuk Nasıl Yapılır? Dava Şartı ve Süreç', 'Zorunlu arabuluculuk, başvuru, anlaşma belgesi. Bilgilendirme.', 'Arabuluculuk nasıl yapılır?', 'Usul', 'arabuluculuk nedir,zorunlu arabuluculuk,anlaşma belgesi', 'hukuk-davasi-nasil-acilir,is-sozlesmesi-feshi,tuketici-hakem-heyeti', 'Arabuluculuk rehberi|/rehber/arabuluculuk;Kanun|/kategori/arabuluculuk', 'arabuluculuk'],
  ['kira-artis-orani-nasil-hesaplanir', 'Kira Artış Oranı Nasıl Hesaplanır?', 'Konut/işyeri kira artışı, yasal sınır, TÜFE. Vatandaş rehberi.', 'Kira artış oranı nasıl hesaplanır?', 'Kira', 'kira artış oranı,kira zammı,konut kira artışı', 'hukuk-davasi-nasil-acilir,arabuluculuk-nasil-yapilir,kiraci-nasil-tahliye-edilir', 'Kira hesap|/hesaplama/kira;TBK|/kategori/borclar-ozel', 'kira'],
  ['tapu-devri-nasil-yapilir', 'Tapu Devri Nasıl Yapılır? Belgeler ve Masraflar', 'Tapu satış/devir, belgeler, harç, randevu. Adım adım rehber.', 'Tapu devri nasıl yapılır?', 'Eşya', 'tapu devri nasıl yapılır,tapu harcı,tapu randevu', 'iskan-belgesi-nedir,emlak-vergisi-nedir,veraset-ilami-nasil-alinir', 'Eşya hukuku|/kategori/esya-hukuku;Kat mülkiyeti|/kategori/katmulkiyeti', 'tapu'],
  ['iskan-belgesi-nedir', 'İskan Belgesi Nedir? Nasıl Alınır?', 'Yapı kullanma izni, başvuru, iskansız daire riskleri. Bilgilendirme.', 'İskan belgesi (yapı kullanma izni) nedir?', 'İmar', 'iskan belgesi nedir,iskan nasıl alınır,yapı kullanma izni', 'kacak-yapi-cezasi,tapu-devri-nasil-yapilir,kamulastirma-nedir', 'İmar|/kategori/imar;Belediye|/kategori/belediye', 'iskan'],
  ['tuketici-hakem-heyeti', 'Tüketici Hakem Heyeti Başvurusu Nasıl Yapılır?', 'Başvuru şartları, e-Devlet, parasal sınır, itiraz. Rehber.', 'Tüketici hakem heyetine nasıl başvurulur?', 'Tüketici', 'tüketici hakem heyeti,tüketici şikayeti,e-devlet tüketici', 'abonelik-iptali-tuketici,hukuk-davasi-nasil-acilir,ayip-mal-iade', 'TKHK|/kategori/tkhk;Ara|/ara?q=t%C3%BCketici', 'tuketici'],
  ['savcilik-suc-duyurusu', 'Savcılığa Suç Duyurusu Nasıl Yapılır?', 'Suç duyurusu, dilekçe, e-şikayet, delil. Bilgilendirme rehberi.', 'Savcılığa suç duyurusu nasıl yapılır?', 'Ceza', 'suç duyurusu nasıl yapılır,savcılığa şikayet,e-şikayet', 'hukuk-davasi-nasil-acilir,koruma-karari-6284,tebligat-usulsuzlugu', 'CMK|/kategori/cmk;TCK|/kategori/tck-genel', 'suc'],
  ['koruma-karari-6284', '6284 Koruma Kararı Nedir? Nasıl Alınır?', 'Koruma ve uzaklaştırma kararı, başvuru mercileri. Bilgilendirme.', '6284 koruma kararı nedir? Nasıl alınır?', 'Aile', '6284 koruma kararı,uzaklaştırma kararı,aile içi şiddet', 'bosanma-davasi-nasil-acilir,savcilik-suc-duyurusu,velayet-davasi', '6284|/kategori/aile-koruma;Aile|/kategori/aile-hukuku', 'k6284'],
  ['velayet-davasi', 'Velayet Davası Nedir? Nasıl Açılır?', 'Velayet, kişisel ilişki, çocuğun üstün yararı. Vatandaş rehberi.', 'Velayet davası nedir? Nasıl yürütülür?', 'Aile', 'velayet davası,çocuk velayeti,kişisel ilişki', 'bosanma-davasi-nasil-acilir,nafaka-davasi-nedir,koruma-karari-6284', 'Aile|/kategori/aile-hukuku;Çocuk|/kategori/cck', 'velayet'],
  ['is-kazasi-tazminati', 'İş Kazası Tazminatı Nedir? Nasıl Alınır?', 'Bildirim, SGK, maddi-manevi tazminat. İşçi rehberi.', 'İş kazası tazminatı nedir? Nasıl talep edilir?', 'İş', 'iş kazası tazminatı,iş kazası bildirimi,SGK iş kazası', 'kidem-tazminati-nasil-alinir,is-sozlesmesi-feshi,arabuluculuk-nasil-yapilir', 'İş Kanunu|/kategori/is-kanunu;İSG|/kategori/isg', 'is_kazasi'],
  ['kidem-tazminati-nasil-alinir', 'Kıdem Tazminatı Nasıl Alınır? Şartlar ve Hesap', 'Kıdem şartları, tavan, arabuluculuk, dava. Bilgilendirme.', 'Kıdem tazminatı nasıl alınır?', 'İş', 'kıdem tazminatı nasıl alınır,kıdem şartları,kıdem hesabı', 'is-sozlesmesi-feshi,arabuluculuk-nasil-yapilir,is-kazasi-tazminati', 'Kıdem rehberi|/rehber/kidem-tazminati;Hesap|/hesaplama/kidem', 'kidem'],
  ['e-devlet-veraset', 'e-Devlet Veraset İlamı Sorgulama ve Alma', 'e-Devlet mirasçılık belgesi adımları. Pratik rehber.', 'e-Devlet ile veraset ilamı nasıl alınır?', 'Miras', 'e-devlet veraset ilamı,mirasçılık belgesi e-devlet', 'veraset-ilami-nasil-alinir,miras-payi-nasil-hesaplanir,tapu-devri-nasil-yapilir', 'Miras hesap|/hesaplama/miras;Miras|/kategori/miras-hukuku', 'edevlet_veraset'],
  ['miras-payi-nasil-hesaplanir', 'Miras Payı Nasıl Hesaplanır? Yasal Mirasçılık', 'Zümre sistemi, eşin payı, saklı pay. Bilgilendirme.', 'Miras payı nasıl hesaplanır?', 'Miras', 'miras payı nasıl hesaplanır,yasal mirasçılık,saklı pay', 'veraset-ilami-nasil-alinir,e-devlet-veraset,tapu-devri-nasil-yapilir', 'Miras rehberi|/rehber/miras-paylasimi;Hesap|/hesaplama/miras', 'miras_pay'],
  ['tebligat-usulsuzlugu', 'Tebligat Usulsüzlüğü Nedir? Ne Yapılır?', 'Usulsüz tebligat, öğrenme tarihi, itiraz. Bilgilendirme.', 'Tebligat usulsüzlüğü nedir? Ne yapılmalı?', 'Usul', 'tebligat usulsüzlüğü,usulsüz tebligat,e-tebligat', 'odeme-emrine-itiraz,hukuk-davasi-nasil-acilir,icra-takibi-nedir', 'Tebligat|/kategori/tebligat;HMK|/kategori/hmk', 'tebligat'],
  ['ihtiyati-tedbir-nedir', 'İhtiyati Tedbir Nedir? Nasıl İstenir?', 'Tedbir şartları, teminat, başvuru. Usul rehberi.', 'İhtiyati tedbir nedir? Nasıl alınır?', 'Usul', 'ihtiyati tedbir nedir,ihtiyati tedbir nasıl alınır,tedbir kararı', 'hukuk-davasi-nasil-acilir,icra-takibi-nedir,tapu-devri-nasil-yapilir', 'HMK|/kategori/hmk;Ara|/ara?q=ihtiyati%20tedbir', 'tedbir'],
  ['engelli-raporu-nasil-alinir', 'Engelli Raporu Nasıl Alınır? Sağlık Kurulu', 'Sağlık kurulu raporu, oran, e-Devlet, haklar. Rehber.', 'Engelli raporu nasıl alınır?', 'Engelli Hakları', 'engelli raporu nasıl alınır,sağlık kurulu raporu,engelli oranı', 'engelli-araci-nasil-alinir,emlak-vergisi-nedir,vergi-borcu-yapislandirma', 'Ara|/ara?q=engelli;Hesaplama|/hesaplama', 'engelli_rapor'],
  ['vergi-borcu-yapislandirma', 'Vergi Borcu Yapılandırma Nedir? Nasıl Başvurulur?', 'Yapılandırma, başvuru, peşin/taksit. Bilgilendirme.', 'Vergi borcu yapılandırma nedir? Nasıl başvurulur?', 'Vergi', 'vergi borcu yapılandırma,vergi affı,e-devlet yapılandırma', 'emlak-vergisi-nedir,icra-takibi-nedir,odeme-emrine-itiraz', 'AATUHK|/kategori/aatuhk;VUK|/kategori/vuk', 'yapilandirma'],
  ['kamulastirma-nedir', 'Kamulaştırma Nedir? Bedel ve Dava Yolları', 'Kamulaştırma süreci, bedel, itiraz. Mal sahibi rehberi.', 'Kamulaştırma nedir? Haklarınız nelerdir?', 'İdare', 'kamulaştırma nedir,kamulaştırma bedeli,acele kamulaştırma', 'idari-dava-nasil-acilir,tapu-devri-nasil-yapilir,kacak-yapi-cezasi', 'Kamulaştırma|/kategori/kamulastirma;İmar|/kategori/imar', 'kamulastirma'],
  ['kacak-yapi-cezasi', 'Kaçak Yapı Cezası Nedir? Yıkım ve İtiraz', 'Ruhsatsız yapı, para cezası, mühürleme, yargı yolu. Rehber.', 'Kaçak yapı cezası nedir? Ne yapılır?', 'İmar', 'kaçak yapı cezası,ruhsatsız yapı,yıkım kararı', 'iskan-belgesi-nedir,idari-dava-nasil-acilir,kamulastirma-nedir', 'İmar|/kategori/imar;Belediye|/kategori/belediye', 'kacak'],
  ['abonelik-iptali-tuketici', 'Abonelik İptali Nasıl Yapılır? Tüketici Hakları', 'İnternet/GSM iptali, cayma, taahhüt. Pratik rehber.', 'Abonelik iptali nasıl yapılır?', 'Tüketici', 'abonelik iptali,internet abonelik iptali,cayma hakkı', 'tuketici-hakem-heyeti,hukuk-davasi-nasil-acilir,ayip-mal-iade', 'TKHK|/kategori/tkhk;Ara|/ara?q=t%C3%BCketici', 'abonelik'],
  ['ehliyet-alma-sartlari', 'Ehliyet Alma Şartları Nelerdir? Süreç Rehberi', 'Sürücü belgesi şartları, kurs, sınav, sağlık raporu. Bilgilendirme.', 'Ehliyet alma şartları nelerdir?', 'Trafik', 'ehliyet alma şartları,sürücü belgesi nasıl alınır,ehliyet yenileme', 'trafik-cezasina-itiraz,engelli-araci-nasil-alinir,idari-dava-nasil-acilir', 'KTK|/kategori/ktk;Mevzuat|/mevzuat', 'ehliyet'],
  ['nufus-kayit-ornegi', 'Nüfus Kayıt Örneği Nasıl Alınır? e-Devlet', 'Vukuatlı nüfus kayıt, e-Devlet ve müdürlük. Rehber.', 'Nüfus kayıt örneği nasıl alınır?', 'Nüfus', 'nüfus kayıt örneği,vukuatlı nüfus kayıt,e-devlet nüfus', 'veraset-ilami-nasil-alinir,e-devlet-veraset,bosanma-davasi-nasil-acilir', 'NHK|/kategori/nhk;Ara|/ara?q=n%C3%BCfus', 'nufus'],
  ['icra-dosyasi-sorgulama', 'İcra Dosyası Sorgulama Nasıl Yapılır? UYAP', 'UYAP ve e-Devlet icra dosyası sorgulama. Bilgilendirme.', 'İcra dosyası nasıl sorgulanır?', 'İcra', 'icra dosyası sorgulama,UYAP icra,e-devlet icra', 'icra-takibi-nedir,odeme-emrine-itiraz,senet-icra-takibi', 'İİK|/kategori/iik;Faiz|/hesaplama/faiz', 'icra_sorgu'],
  ['senet-icra-takibi', 'Senetle İcra Takibi Nasıl Yapılır?', 'Bono/senet icrası, kambiyo yolu, itiraz. Rehber.', 'Senetle icra takibi nasıl yapılır?', 'İcra', 'senet icra takibi,bono icra,kambiyo senetleri', 'icra-takibi-nedir,odeme-emrine-itiraz,hukuk-davasi-nasil-acilir', 'İİK|/kategori/iik;Kıymetli evrak|/kategori/kiymetli-evrak', 'senet'],
  ['is-sozlesmesi-feshi', 'İş Sözleşmesi Feshi Nedir? Haklı ve Bildirimli Fesih', 'İşçi/işveren feshi, kıdem-ihbar ilişkisi. İş rehberi.', 'İş sözleşmesi feshi nedir? Nelere dikkat edilmeli?', 'İş', 'iş sözleşmesi feshi,haklı fesih,işten çıkarma', 'kidem-tazminati-nasil-alinir,arabuluculuk-nasil-yapilir,is-kazasi-tazminati', 'İş Kanunu|/kategori/is-kanunu;Kıdem|/hesaplama/kidem', 'fesih'],
  ['gayrimenkul-satis-vaadi', 'Gayrimenkul Satış Vaadi Sözleşmesi Nedir?', 'Satış vaadi, noter şekli, tapu şerhi, dava. Bilgilendirme.', 'Gayrimenkul satış vaadi sözleşmesi nedir?', 'Eşya', 'gayrimenkul satış vaadi,satış vaadi sözleşmesi,tapuya şerh', 'tapu-devri-nasil-yapilir,iskan-belgesi-nedir,hukuk-davasi-nasil-acilir', 'TBK|/kategori/borclar-ozel;Eşya|/kategori/esya-hukuku', 'satis_vaadi'],

  // —— Yeni 65 (100’e tamamlar) ——
  ['kiraci-nasil-tahliye-edilir', 'Kiracı Nasıl Tahliye Edilir? Yasal Yollar', 'Tahliye taahhüdü, ihtiyaç, iki haklı ihtar, temerrüt. Kiraya veren rehberi.', 'Kiracı nasıl tahliye edilir?', 'Kira', 'kiracı nasıl çıkarılır,tahliye davası,kira tahliye taahhüdü', 'kira-artis-orani-nasil-hesaplanir,arabuluculuk-nasil-yapilir,hukuk-davasi-nasil-acilir', 'TBK kira|/kategori/borclar-ozel;Hesaplama|/hesaplama'],
  ['kira-teminati-iadesi', 'Kira Depozitosu / Teminat Nasıl Geri Alınır?', 'Depozito iadesi, kesinti sebepleri, ihtar ve dava. Kiracı rehberi.', 'Kira teminatı (depozito) nasıl iade alınır?', 'Kira', 'kira depozitosu iadesi,teminat iadesi,kira depozito', 'kiraci-nasil-tahliye-edilir,tuketici-hakem-heyeti,hukuk-davasi-nasil-acilir', 'TBK|/kategori/borclar-ozel;Ara|/ara?q=kira'],
  ['ayip-mal-iade', 'Ayıplı Mal İade ve Değişim Hakkı Nedir?', 'Ayıp bildirimi, seçimlik haklar, garanti, tüketici başvurusu. Rehber.', 'Ayıplı malda iade ve değişim hakkı nedir?', 'Tüketici', 'ayıplı mal iade,ayıplı mal hakları,garanti iade', 'tuketici-hakem-heyeti,abonelik-iptali-tuketici,hukuk-davasi-nasil-acilir', 'TKHK|/kategori/tkhk;TBK|/kategori/borclar-ozel'],
  ['mesafeli-satis-cayma', 'Mesafeli Satışta Cayma Hakkı Nasıl Kullanılır?', '14 günlük cayma, istisnalar, iade kargo. E-ticaret tüketicisi rehberi.', 'Mesafeli satışta cayma hakkı nasıl kullanılır?', 'Tüketici', 'cayma hakkı,mesafeli satış cayma,e-ticaret iade', 'ayip-mal-iade,tuketici-hakem-heyeti,abonelik-iptali-tuketici', 'TKHK|/kategori/tkhk;Ara|/ara?q=cayma'],
  ['ise-iade-davasi', 'İşe İade Davası Nedir? Şartlar ve Süre', 'İşe iade şartları, arabuluculuk, süre, sonuçlar. İşçi rehberi.', 'İşe iade davası nedir? Nasıl açılır?', 'İş', 'işe iade davası,işe iade şartları,geçersiz fesih', 'is-sozlesmesi-feshi,kidem-tazminati-nasil-alinir,arabuluculuk-nasil-yapilir', 'İş Kanunu|/kategori/is-kanunu;Arabuluculuk|/rehber/arabuluculuk'],
  ['ihbar-tazminati-nedir', 'İhbar Tazminatı Nedir? Nasıl Hesaplanır?', 'İhbar süreleri, hesap, kıdemle ilişki. İş hukuku bilgilendirme.', 'İhbar tazminatı nedir? Nasıl hesaplanır?', 'İş', 'ihbar tazminatı,ihbar süresi,ihbar tazminatı hesabı', 'kidem-tazminati-nasil-alinir,is-sozlesmesi-feshi,arabuluculuk-nasil-yapilir', 'İş Kanunu|/kategori/is-kanunu;Hesaplama|/hesaplama'],
  ['fazla-mesai-ucreti', 'Fazla Mesai Ücreti Nasıl Hesaplanır ve Alınır?', 'Fazla çalışma, ispat, zamanaşımı, arabuluculuk. İşçi rehberi.', 'Fazla mesai ücreti nasıl hesaplanır?', 'İş', 'fazla mesai ücreti,fazla çalışma,mesai alacağı', 'kidem-tazminati-nasil-alinir,arabuluculuk-nasil-yapilir,is-sozlesmesi-feshi', 'İş Kanunu|/kategori/is-kanunu;Hesaplama|/hesaplama'],
  ['issizlik-maasi-sartlari', 'İşsizlik Maaşı Şartları Nelerdir? Başvuru', 'İşsizlik ödeneği prim günü, başvuru, e-Devlet. Bilgilendirme.', 'İşsizlik maaşı şartları nelerdir?', 'İş', 'işsizlik maaşı şartları,işsizlik ödeneği,işsizlik maaşı başvuru', 'is-sozlesmesi-feshi,kidem-tazminati-nasil-alinir,sgk-hizmet-dokumu', 'SSGSSK|/kategori/ssgssk;Ara|/ara?q=i%C5%9Fsizlik'],
  ['sgk-hizmet-dokumu', 'SGK Hizmet Dökümü Nasıl Alınır? e-Devlet', 'Hizmet dökümü, prim günü, e-Devlet adımları. Pratik rehber.', 'SGK hizmet dökümü nasıl alınır?', 'Sosyal Güvenlik', 'SGK hizmet dökümü,e-devlet hizmet dökümü,prim günü sorgulama', 'issizlik-maasi-sartlari,emeklilik-sartlari,kidem-tazminati-nasil-alinir', 'SSGSSK|/kategori/ssgssk;Ara|/ara?q=SGK'],
  ['emeklilik-sartlari', 'Emeklilik Şartları Nelerdir? Yaş ve Prim', 'Yaşlılık aylığı, prim günü, yaş. Genel bilgilendirme rehberi.', 'Emeklilik şartları nelerdir?', 'Sosyal Güvenlik', 'emeklilik şartları,kaç prim günü,emeklilik yaşı', 'sgk-hizmet-dokumu,issizlik-maasi-sartlari,malulen-emeklilik', 'SSGSSK|/kategori/ssgssk;Ara|/ara?q=emeklilik'],
  ['malulen-emeklilik', 'Malulen Emeklilik Nedir? Şartları', 'Maluliyet oranı, prim, SGK süreci. Bilgilendirme rehberi.', 'Malulen emeklilik nedir? Şartları nelerdir?', 'Sosyal Güvenlik', 'malulen emeklilik,maluliyet aylığı,malulen emeklilik şartları', 'emeklilik-sartlari,engelli-raporu-nasil-alinir,sgk-hizmet-dokumu', 'SSGSSK|/kategori/ssgssk;Ara|/ara?q=malul'],
  ['sakli-pay-nedir', 'Saklı Pay Nedir? Tenkis Davası', 'Saklı pay oranları, tenkis, mirasçılar. Miras rehberi.', 'Saklı pay nedir? Tenkis ne demektir?', 'Miras', 'saklı pay nedir,tenkis davası,saklı pay oranları', 'miras-payi-nasil-hesaplanir,veraset-ilami-nasil-alinir,vasiyetname-nasil-yapilir', 'Miras|/kategori/miras-hukuku;Hesap|/hesaplama/sakli-pay'],
  ['vasiyetname-nasil-yapilir', 'Vasiyetname Nasıl Yapılır? Noter ve El Yazısı', 'Resmi, el yazılı vasiyet, şartlar, saklı pay. Bilgilendirme.', 'Vasiyetname nasıl yapılır?', 'Miras', 'vasiyetname nasıl yapılır,noter vasiyet,el yazılı vasiyet', 'sakli-pay-nedir,veraset-ilami-nasil-alinir,miras-payi-nasil-hesaplanir', 'Miras|/kategori/miras-hukuku;Rehber|/rehber/miras-paylasimi'],
  ['mirasin-reddi', 'Mirasın Reddi Nasıl Yapılır? Süre', 'Red süresi, usul, sonuçlar. Mirasçı rehberi.', 'Mirasın reddi nasıl yapılır?', 'Miras', 'mirasın reddi,miras reddi süresi,mirası reddetme', 'veraset-ilami-nasil-alinir,miras-payi-nasil-hesaplanir,icra-takibi-nedir', 'Miras|/kategori/miras-hukuku;Ara|/ara?q=miras'],
  ['izale-i-suyu', 'İzale-i Şuyu (Ortaklığın Giderilmesi) Nedir?', 'Paylı taşınmazda satış/paylaşma davası. Bilgilendirme.', 'İzale-i şuyu nedir? Nasıl açılır?', 'Eşya', 'izale-i şuyu,ortaklığın giderilmesi,paylı mülkiyet satış', 'tapu-devri-nasil-yapilir,miras-payi-nasil-hesaplanir,hukuk-davasi-nasil-acilir', 'Eşya|/kategori/esya-hukuku;HMK|/kategori/hmk'],
  ['tapu-iptal-tescil', 'Tapu İptal ve Tescil Davası Nedir?', 'Muris muvazaası, sahtecilik, tescil. Gayrimenkul rehberi.', 'Tapu iptal ve tescil davası nedir?', 'Eşya', 'tapu iptal tescil,muris muvazaası,tapu iptal davası', 'tapu-devri-nasil-yapilir,veraset-ilami-nasil-alinir,hukuk-davasi-nasil-acilir', 'Eşya|/kategori/esya-hukuku;Miras|/kategori/miras-hukuku'],
  ['kat-mulkiyeti-aidat', 'Kat Mülkiyeti Aidat Borcu ve İcra', 'Ortak gider, aidat, icra, genel kurul. Site sakinleri rehberi.', 'Kat mülkiyeti aidat borcu nasıl tahsil edilir?', 'Eşya', 'aidat borcu,kat mülkiyeti aidat,site aidatı icra', 'icra-takibi-nedir,tapu-devri-nasil-yapilir,hukuk-davasi-nasil-acilir', 'Kat mülkiyeti|/kategori/katmulkiyeti;İİK|/kategori/iik'],
  ['ihtiyati-haciz-nedir', 'İhtiyati Haciz Nedir? Nasıl Konulur?', 'İhtiyati haciz şartları, teminat, icra. Alacaklı rehberi.', 'İhtiyati haciz nedir? Nasıl istenir?', 'İcra', 'ihtiyati haciz,ihtiyati haciz nasıl konulur,teminat', 'icra-takibi-nedir,ihtiyati-tedbir-nedir,senet-icra-takibi', 'İİK|/kategori/iik;HMK|/kategori/hmk'],
  ['haciz-nasil-kaldirilir', 'Haciz Nasıl Kaldırılır? Borç Ödeme ve İtiraz', 'Haczin kalkması, ödeme, menfi tespit, istihkak. Borçlu rehberi.', 'Haciz nasıl kaldırılır?', 'İcra', 'haciz nasıl kaldırılır,haciz kaldırma,menkul haciz', 'icra-takibi-nedir,odeme-emrine-itiraz,icra-dosyasi-sorgulama', 'İİK|/kategori/iik;Faiz|/hesaplama/faiz'],
  ['kefalet-sozlesmesi', 'Kefalet Sözleşmesi Nedir? Riskler', 'Kefil sorumluluğu, şekil, azami tutar. Bilgilendirme.', 'Kefalet sözleşmesi nedir? Nelere dikkat edilmeli?', 'Borçlar', 'kefalet sözleşmesi,kefil olmak,kefalet riski', 'icra-takibi-nedir,hukuk-davasi-nasil-acilir,senet-icra-takibi', 'TBK|/kategori/borclar-genel;İİK|/kategori/iik'],
  ['zamanaşimi-nedir', 'Zamanaşımı Nedir? Alacaklarda Süreler', 'Zamanaşımı, hak düşürücü süre, kesilme. Genel rehber.', 'Zamanaşımı nedir? Ne zaman dolur?', 'Usul', 'zamanaşımı nedir,alacak zamanaşımı,10 yıllık zamanaşımı', 'hukuk-davasi-nasil-acilir,icra-takibi-nedir,kidem-tazminati-nasil-alinir', 'TBK|/kategori/borclar-genel;HMK|/kategori/hmk'],
  ['istinaf-nedir', 'İstinaf Nedir? Nasıl Başvurulur?', 'İstinaf süresi, dilekçe, BAM. Kanun yolu rehberi.', 'İstinaf nedir? Nasıl başvurulur?', 'Usul', 'istinaf nedir,istinaf süresi,istinaf dilekçesi', 'temyiz-nedir,hukuk-davasi-nasil-acilir,idari-dava-nasil-acilir', 'HMK|/kategori/hmk;Mevzuat|/mevzuat'],
  ['temyiz-nedir', 'Temyiz Nedir? Yargıtay Başvurusu', 'Temyiz şartları, süre, Yargıtay. Kanun yolu rehberi.', 'Temyiz nedir? Nasıl yapılır?', 'Usul', 'temyiz nedir,Yargıtay temyiz,temyiz süresi', 'istinaf-nedir,hukuk-davasi-nasil-acilir,idari-dava-nasil-acilir', 'HMK|/kategori/hmk;İçtihat|/icthat'],
  ['bilirkisi-raporu-itiraz', 'Bilirkişi Raporuna İtiraz Nasıl Yapılır?', 'Süre, ek rapor, itiraz gerekçesi. Yargılama rehberi.', 'Bilirkişi raporuna itiraz nasıl yapılır?', 'Usul', 'bilirkişi raporuna itiraz,bilirkişi itiraz süresi', 'hukuk-davasi-nasil-acilir,istinaf-nedir,is-kazasi-tazminati', 'HMK|/kategori/hmk;Ara|/ara?q=bilirki%C5%9Fi'],
  ['tanik-dinletme', 'Duruşmada Tanık Dinletme Nasıl Olur?', 'Tanık listesi, usul, yalan tanıklık riski. Bilgilendirme.', 'Mahkemede tanık nasıl dinletir?', 'Usul', 'tanık dinletme,tanık listesi,mahkeme tanık', 'hukuk-davasi-nasil-acilir,savcilik-suc-duyurusu,bosanma-davasi-nasil-acilir', 'HMK|/kategori/hmk;CMK|/kategori/cmk'],
  ['arabuluculuk-anlasma-belgesi', 'Arabuluculuk Anlaşma Belgesi Nedir?', 'İlam niteliği, icra, iptal. Pratik rehber.', 'Arabuluculuk anlaşma belgesi nedir?', 'Usul', 'arabuluculuk anlaşma belgesi,arabuluculuk icra', 'arabuluculuk-nasil-yapilir,icra-takibi-nedir,hukuk-davasi-nasil-acilir', 'Arabuluculuk|/kategori/arabuluculuk;Rehber|/rehber/arabuluculuk'],
  ['is-kazasi-bildirimi', 'İş Kazası Bildirimi Nasıl Yapılır? Süre', 'İşveren bildirimi, SGK, süreler. İşyeri rehberi.', 'İş kazası bildirimi nasıl yapılır?', 'İş', 'iş kazası bildirimi,SGK iş kazası bildirimi,iş kazası süresi', 'is-kazasi-tazminati,is-sozlesmesi-feshi,sgk-hizmet-dokumu', 'İSG|/kategori/isg;İş Kanunu|/kategori/is-kanunu'],
  ['mobbing-nedir', 'Mobbing (Psikolojik Taciz) Nedir? Ne Yapılır?', 'İşyerinde mobbing ispatı, ihbar, tazminat. Bilgilendirme.', 'Mobbing nedir? Hukuken ne yapılabilir?', 'İş', 'mobbing nedir,işyerinde mobbing,psikolojik taciz işyeri', 'is-sozlesmesi-feshi,kidem-tazminati-nasil-alinir,ise-iade-davasi', 'İş Kanunu|/kategori/is-kanunu;TCK|/kategori/tck-kisiler'],
  ['cinsel-taciz-sikayet', 'İşyerinde Cinsel Taciz Şikayeti Nasıl Yapılır?', 'Şikayet mercileri, delil, 6284 ve ceza. Bilgilendirme.', 'İşyerinde cinsel taciz şikayeti nasıl yapılır?', 'İş', 'işyerinde cinsel taciz,cinsel taciz şikayet', 'koruma-karari-6284,savcilik-suc-duyurusu,is-sozlesmesi-feshi', 'TCK|/kategori/tck-kisiler;CMK|/kategori/cmk'],
  ['cocuk-nafaka-artirim', 'Çocuk Nafakası Artırım Davası', 'İştirak nafakası artırım şartları. Aile rehberi.', 'Çocuk nafakası nasıl artırılır?', 'Aile', 'nafaka artırım davası,iştirak nafakası artırma', 'nafaka-davasi-nedir,velayet-davasi,bosanma-davasi-nasil-acilir', 'Nafaka|/hesaplama/nafaka;Aile|/kategori/aile-hukuku'],
  ['mal-rejimi-tasfiyesi', 'Mal Rejimi Tasfiyesi Nedir? Katılma Alacağı', 'Edinilmiş mallara katılma, tasfiye davası. Bilgilendirme.', 'Mal rejimi tasfiyesi nedir?', 'Aile', 'mal rejimi tasfiyesi,katılma alacağı,edinilmiş mallar', 'bosanma-davasi-nasil-acilir,tapu-devri-nasil-yapilir,hukuk-davasi-nasil-acilir', 'Aile|/kategori/aile-hukuku;Hesaplama|/hesaplama'],
  ['ziynet-esyalari-davasi', 'Ziynet Eşyası (Altın) Davası Nedir?', 'Düğün takıları, ispat, iade. Aile/borçlar rehberi.', 'Ziynet eşyası davası nedir?', 'Aile', 'ziynet davası,düğün takıları davası,altın iadesi', 'bosanma-davasi-nasil-acilir,mal-rejimi-tasfiyesi,hukuk-davasi-nasil-acilir', 'Aile|/kategori/aile-hukuku;TBK|/kategori/borclar-genel'],
  ['soybagi-reddi', 'Soybağının Reddi Davası Nedir?', 'Babalık karinesi, süre, DNA. Aile hukuku rehberi.', 'Soybağının reddi davası nedir?', 'Aile', 'soybağının reddi,babalık davası,soybağı reddi süresi', 'velayet-davasi,nafaka-davasi-nedir,nufus-kayit-ornegi', 'Aile|/kategori/aile-hukuku;NHK|/kategori/nhk'],
  ['evlat-edinme', 'Evlat Edinme Şartları Nelerdir?', 'Yaş, rıza, mahkeme. Aile rehberi.', 'Evlat edinme şartları nelerdir?', 'Aile', 'evlat edinme şartları,evlat edinme davası', 'velayet-davasi,nufus-kayit-ornegi,veraset-ilami-nasil-alinir', 'Aile|/kategori/aile-hukuku;NHK|/kategori/nhk'],
  ['ceza-sorusturmasi-sureci', 'Ceza Soruşturması Nasıl İşler?', 'İfade, gözaltı, iddianame. Vatandaş bilgilendirme.', 'Ceza soruşturması nasıl yürür?', 'Ceza', 'ceza soruşturması,ifade alma,gözaltı hakları', 'savcilik-suc-duyurusu,gozalti-haklari,tebligat-usulsuzlugu', 'CMK|/kategori/cmk;TCK|/kategori/tck-genel'],
  ['gozalti-haklari', 'Gözaltında Haklarınız Nelerdir?', 'Müdafi, susma, aile bilgilendirme. Temel haklar rehberi.', 'Gözaltında haklarınız nelerdir?', 'Ceza', 'gözaltı hakları,müdafi hakkı,gözaltı süresi', 'ceza-sorusturmasi-sureci,savcilik-suc-duyurusu,koruma-karari-6284', 'CMK|/kategori/cmk;PVSK|/kategori/pvsk'],
  ['uzlastirma-nedir', 'Ceza Uzlaştırması Nedir?', 'Uzlaştırma kapsamı, süreç, sonuç. Bilgilendirme.', 'Uzlaştırma nedir? Nasıl işler?', 'Ceza', 'ceza uzlaştırması,uzlaştırma nedir,uzlaştırma dosyası', 'savcilik-suc-duyurusu,ceza-sorusturmasi-sureci,hukuk-davasi-nasil-acilir', 'CMK|/kategori/cmk;TCK|/kategori/tck-genel'],
  ['adli-sicil-kaydi', 'Adli Sicil Kaydı Nasıl Alınır? Silinme', 'e-Devlet adli sicil, arşiv kaydı. Bilgilendirme.', 'Adli sicil kaydı nasıl alınır?', 'Ceza', 'adli sicil kaydı,sabıka kaydı e-devlet,adli sicil silme', 'ceza-sorusturmasi-sureci,ehliyet-alma-sartlari,is-sozlesmesi-feshi', 'Ara|/ara?q=adli%20sicil;CMK|/kategori/cmk'],
  ['trafik-kazasi-tazminati', 'Trafik Kazası Tazminatı Nasıl Alınır?', 'Maddi-manevi, sigorta, kusur. Kaza mağduru rehberi.', 'Trafik kazası tazminatı nasıl alınır?', 'Trafik', 'trafik kazası tazminatı,trafik sigortası tazminat,maddi hasar', 'trafik-cezasina-itiraz,hukuk-davasi-nasil-acilir,is-kazasi-tazminati', 'KTK|/kategori/ktk;TBK|/kategori/borclar-genel'],
  ['trafik-sigortasi-hasar', 'Trafik Sigortası Hasar İhbarı Nasıl Yapılır?', 'Zorunlu trafik, kasko, ihbar süresi. Pratik rehber.', 'Trafik sigortası hasar ihbarı nasıl yapılır?', 'Trafik', 'trafik sigortası hasar,kasko hasar ihbarı,sigorta dosyası', 'trafik-kazasi-tazminati,trafik-cezasina-itiraz,tuketici-hakem-heyeti', 'KTK|/kategori/ktk;Ara|/ara?q=sigorta'],
  ['ehliyet-geri-alma', 'Ehliyete El Koyma ve Geri Alma', 'Alkol, ceza puanı, iade şartları. Bilgilendirme.', 'Ehliyete el konulursa nasıl geri alınır?', 'Trafik', 'ehliyete el koyma,ehliyet iadesi,ehliyet ceza puanı', 'ehliyet-alma-sartlari,trafik-cezasina-itiraz,idari-dava-nasil-acilir', 'KTK|/kategori/ktk;Mevzuat|/mevzuat'],
  ['pasaport-basvurusu', 'Pasaport Başvurusu Nasıl Yapılır? e-Devlet', 'Randevu, belgeler, süre. Vatandaş rehberi.', 'Pasaport başvurusu nasıl yapılır?', 'Nüfus', 'pasaport başvurusu,e-devlet pasaport,pasaport randevu', 'nufus-kayit-ornegi,ehliyet-alma-sartlari,yabanci-ikamet-izni', 'NHK|/kategori/nhk;Ara|/ara?q=pasaport'],
  ['yabanci-ikamet-izni', 'Yabancı İkamet İzni Nedir? Başvuru', 'Kısa/uzun dönem ikamet, evrak. Bilgilendirme.', 'Yabancılar için ikamet izni nasıl alınır?', 'Yabancılar', 'ikamet izni,yabancı ikamet izni başvuru', 'pasaport-basvurusu,calisma-izni-nedir,sinir-disi-karari', 'YUKK|/kategori/yukk;Ara|/ara?q=ikamet'],
  ['calisma-izni-nedir', 'Çalışma İzni Nedir? Nasıl Alınır?', 'Yabancı çalışma izni, işveren başvurusu. Rehber.', 'Çalışma izni nedir? Nasıl alınır?', 'Yabancılar', 'çalışma izni,yabancı çalışma izni', 'yabanci-ikamet-izni,is-sozlesmesi-feshi,sgk-hizmet-dokumu', 'YUKK|/kategori/yukk;İş Kanunu|/kategori/is-kanunu'],
  ['sinir-disi-karari', 'Sınır Dışı Kararı Nedir? İtiraz', 'Sınır dışı, idari gözetim, itiraz. Bilgilendirme.', 'Sınır dışı kararına nasıl itiraz edilir?', 'Yabancılar', 'sınır dışı kararı,sınır dışı itiraz,idari gözetim', 'idari-dava-nasil-acilir,yabanci-ikamet-izni,tebligat-usulsuzlugu', 'YUKK|/kategori/yukk;İdare|/mevzuat'],
  ['kvkk-basvuru-hakki', 'KVKK Başvuru ve Şikayet Hakkı Nedir?', 'Veri sorumlusuna başvuru, Kurul şikayeti. Bilgilendirme.', 'KVKK kapsamında haklarınız nelerdir?', 'Kişisel Veri', 'KVKK başvuru,kişisel veri şikayet,veri silme talebi', 'tuketici-hakem-heyeti,idari-dava-nasil-acilir,hukuk-davasi-nasil-acilir', 'KVKK|/kategori/kvkk;Ara|/ara?q=KVKK'],
  ['bilgi-edinme-basvurusu', 'Bilgi Edinme Başvurusu Nasıl Yapılır?', '4982 sayılı Kanun, CİMER, red itirazı. Rehber.', 'Bilgi edinme başvurusu nasıl yapılır?', 'İdare', 'bilgi edinme başvurusu,CİMER bilgi edinme,4982', 'idari-dava-nasil-acilir,tebligat-usulsuzlugu,kamulastirma-nedir', 'Mevzuat|/mevzuat;Ara|/ara?q=bilgi%20edinme'],
  ['cimer-sikayet', 'CİMER Şikayet / Başvuru Nasıl Yapılır?', 'CİMER adımları, süre, takip. Pratik rehber.', 'CİMER’e nasıl başvurulur?', 'İdare', 'CİMER şikayet,CİMER başvuru,CİMER ne işe yarar', 'bilgi-edinme-basvurusu,idari-dava-nasil-acilir,trafik-cezasina-itiraz', 'Mevzuat|/mevzuat;İçtihat|/icthat'],
  ['belediye-cezasi-itiraz', 'Belediye Cezasına İtiraz Nasıl Yapılır?', 'İdari para cezası, zabıta, itiraz mercileri. Rehber.', 'Belediye cezasına nasıl itiraz edilir?', 'İdare', 'belediye cezası itiraz,zabıta cezası,idari para cezası belediye', 'idari-dava-nasil-acilir,trafik-cezasina-itiraz,kacak-yapi-cezasi', 'Belediye|/kategori/belediye;İmar|/kategori/imar'],
  ['imar-durumu-nedir', 'İmar Durumu Belgesi Nedir? Nasıl Alınır?', 'İmar lejandı, emsal, başvuru. Arsa/malik rehberi.', 'İmar durumu belgesi nedir?', 'İmar', 'imar durumu,imar lejandı,imar durumu nasıl alınır', 'iskan-belgesi-nedir,kacak-yapi-cezasi,tapu-devri-nasil-yapilir', 'İmar|/kategori/imar;Belediye|/kategori/belediye'],
  ['yapı-ruhsati-nedir', 'Yapı Ruhsatı Nedir? Nasıl Alınır?', 'Ruhsat evrakı, yapı denetim, süre. İnşaat rehberi.', 'Yapı ruhsatı nasıl alınır?', 'İmar', 'yapı ruhsatı,inşaat ruhsatı,ruhsat nasıl alınır', 'iskan-belgesi-nedir,imar-durumu-nedir,kacak-yapi-cezasi', 'İmar|/kategori/imar;Belediye|/kategori/belediye'],
  ['dask-nedir', 'DASK Nedir? Zorunlu Deprem Sigortası', 'DASK poliçesi, teminat, tapu ilişkisi. Bilgilendirme.', 'DASK nedir? Neden zorunlu?', 'Sigorta', 'DASK nedir,zorunlu deprem sigortası,DASK poliçesi', 'tapu-devri-nasil-yapilir,trafik-sigortasi-hasar,emlak-vergisi-nedir', 'Ara|/ara?q=DASK;Eşya|/kategori/esya-hukuku'],
  ['noter-islemleri', 'Noter İşlemleri Nelerdir? Vekâletname', 'Vekâlet, taahhütname, satış vaadi. Pratik rehber.', 'Noterde hangi işlemler yapılır?', 'Usul', 'noter vekâletname,noter işlemleri,genel vekaletname', 'gayrimenkul-satis-vaadi,tapu-devri-nasil-yapilir,veraset-ilami-nasil-alinir', 'TBK|/kategori/borclar-genel;Mevzuat|/mevzuat'],
  ['vekaletname-azli', 'Vekâletname Nasıl Azledilir / İptal Edilir?', 'Azil, bildirim, üçüncü kişiler. Bilgilendirme.', 'Vekâletname nasıl iptal (azil) edilir?', 'Usul', 'vekaletname iptali,vekalet azli,noter azil', 'noter-islemleri,hukuk-davasi-nasil-acilir,tapu-devri-nasil-yapilir', 'TBK|/kategori/borclar-ozel;Noter|/mevzuat'],
  ['cek-karsiliksiz', 'Karşılıksız Çek Şikayeti ve Süreç', 'Karşılıksız çek, şikayet, tazmin. Bilgilendirme.', 'Karşılıksız çek durumunda ne yapılır?', 'Ticaret', 'karşılıksız çek,çek şikayeti,karşılıksız çek cezası', 'senet-icra-takibi,icra-takibi-nedir,savcilik-suc-duyurusu', 'Çek|/kategori/cek;İİK|/kategori/iik'],
  ['sirket-kurulusu', 'Limited / Anonim Şirket Nasıl Kurulur?', 'MERSİS, ana sözleşme, sermaye. Girişimci rehberi.', 'Şirket nasıl kurulur? (LTD / A.Ş.)', 'Ticaret', 'limited şirket kuruluşu,anonim şirket nasıl kurulur,MERSİS', 'vergi-borcu-yapislandirma,sgk-hizmet-dokumu,ticari-isletme-nedir', 'TTK|/kategori/ticari-sirketler;Mevzuat|/mevzuat'],
  ['ticari-isletme-nedir', 'Ticari İşletme ve Tacir Sıfatı Nedir?', 'Tacir, ticaret sicili, unvan. Ticaret rehberi.', 'Ticari işletme nedir? Tacir kimdir?', 'Ticaret', 'ticari işletme nedir,tacir kimdir,ticaret sicili', 'sirket-kurulusu,iflas-nedir,icra-takibi-nedir', 'TTK|/kategori/ticari-isletme;Mevzuat|/mevzuat'],
  ['iflas-nedir', 'İflas Nedir? Konkordato ile Farkı', 'İflas sebepleri, sonuçlar, konkordato. Bilgilendirme.', 'İflas nedir? Konkordatodan farkı nedir?', 'İcra', 'iflas nedir,konkordato nedir,iflas davası', 'icra-takibi-nedir,sirket-kurulusu,odeme-emrine-itiraz', 'İİK|/kategori/iik;TTK|/kategori/ticari-sirketler'],
  ['icra-inkar-tazminati', 'İcra İnkâr Tazminatı Nedir?', 'Haksız itiraz, oran, şartlar. İcra rehberi.', 'İcra inkâr tazminatı nedir?', 'İcra', 'icra inkâr tazminatı,inkar tazminatı oranı', 'odeme-emrine-itiraz,icra-takibi-nedir,hukuk-davasi-nasil-acilir', 'İİK|/kategori/iik;HMK|/kategori/hmk'],
  ['nafaka-odenmezse', 'Nafaka Ödenmezse Ne Olur? İcra ve Ceza', 'Nafaka icrası, tazyik hapsi. Bilgilendirme.', 'Nafaka ödenmezse ne yapılır?', 'Aile', 'nafaka ödenmezse,nafaka icra,nafaka hapis', 'nafaka-davasi-nedir,icra-takibi-nedir,cocuk-nafaka-artirim', 'İİK|/kategori/iik;Aile|/kategori/aile-hukuku'],
  ['ortakligin-giderilmesi-masraf', 'Ortaklığın Giderilmesi Davası Masrafı', 'Harç, satış, pay. İzale-i şuyu rehberi.', 'İzale-i şuyu davası ne kadar tutar?', 'Eşya', 'izale-i şuyu masraf,ortaklığın giderilmesi harç', 'izale-i-suyu,tapu-devri-nasil-yapilir,hukuk-davasi-nasil-acilir', 'Eşya|/kategori/esya-hukuku;HMK|/kategori/hmk'],
  ['e-devlet-icra', 'e-Devlet İcra Borcu Sorgulama', 'Borç dökümü, dosya, ödeme. Pratik rehber.', 'e-Devletten icra borcu nasıl bakılır?', 'İcra', 'e-devlet icra borcu,icra borcu sorgulama', 'icra-dosyasi-sorgulama,icra-takibi-nedir,haciz-nasil-kaldirilir', 'İİK|/kategori/iik;Faiz|/hesaplama/faiz'],
  ['elektronik-tebligat', 'e-Tebligat Nedir? Ne Zaman Tebliğ Sayılır?', 'UETS, açılmasa da tebliğ, süre. Bilgilendirme.', 'Elektronik tebligat (e-tebligat) nedir?', 'Usul', 'e-tebligat,UETS,elektronik tebligat ne zaman', 'tebligat-usulsuzlugu,odeme-emrine-itiraz,idari-dava-nasil-acilir', 'Tebligat|/kategori/tebligat;HMK|/kategori/hmk'],
  ['dava-harci-nedir', 'Dava Harcı ve Gider Avansı Nedir?', 'Harç, avans, iade. Dava açanlar rehberi.', 'Dava harcı nedir? Nasıl hesaplanır?', 'Usul', 'dava harcı,gider avansı,mahkeme masrafı', 'hukuk-davasi-nasil-acilir,idari-dava-nasil-acilir,arabuluculuk-nasil-yapilir', 'HMK|/kategori/hmk;Hesaplama|/hesaplama'],
  ['arabuluculuk-ucreti', 'Arabuluculuk Ücreti Kim Öder?', 'Tarife, peşin, paylaşım. Bilgilendirme.', 'Arabuluculuk ücretini kim öder?', 'Usul', 'arabuluculuk ücreti,arabuluculuk tarife', 'arabuluculuk-nasil-yapilir,arabuluculuk-anlasma-belgesi,hukuk-davasi-nasil-acilir', 'Arabuluculuk|/rehber/arabuluculuk;Tarife|/tarife-guncellemeleri'],
  ['is-kazasi-maluliyet', 'İş Kazasında Maluliyet Oranı ve Tazminat', 'Maluliyet, SGK, tazminat ilişkisi. Rehber.', 'İş kazasında maluliyet oranı ne anlama gelir?', 'İş', 'iş kazası maluliyet,maluliyet oranı tazminat', 'is-kazasi-tazminati,malulen-emeklilik,engelli-raporu-nasil-alinir', 'İSG|/kategori/isg;SSGSSK|/kategori/ssgssk'],
  ['kidem-tavan', 'Kıdem Tazminatı Tavanı Nedir?', 'Yıllık tavan, hesap etkisi. İş rehberi.', 'Kıdem tazminatı tavanı nedir?', 'İş', 'kıdem tazminatı tavanı,kıdem tavan tutarı', 'kidem-tazminati-nasil-alinir,ihbar-tazminati-nedir,is-sozlesmesi-feshi', 'Kıdem|/rehber/kidem-tazminati;Hesap|/hesaplama/kidem'],
  ['askeri-hizmet-borclanma', 'Askerlik Borçlanması Nedir? SGK', 'Borçlanma, prim, emeklilik etkisi. Bilgilendirme.', 'Askerlik borçlanması nasıl yapılır?', 'Sosyal Güvenlik', 'askerlik borçlanması,SGK askerlik borçlanma', 'emeklilik-sartlari,sgk-hizmet-dokumu,issizlik-maasi-sartlari', 'SSGSSK|/kategori/ssgssk;Ara|/ara?q=bor%C3%A7lanma'],
  ['dogum-borclanmasi', 'Doğum Borçlanması Nedir? Şartları', 'Doğum borçlanması, prim, başvuru. Rehber.', 'Doğum borçlanması nasıl yapılır?', 'Sosyal Güvenlik', 'doğum borçlanması,SGK doğum borçlanma', 'emeklilik-sartlari,sgk-hizmet-dokumu,askeri-hizmet-borclanma', 'SSGSSK|/kategori/ssgssk;Ara|/ara?q=do%C4%9Fum'],
  ['e-devlet-vergi-borcu', 'e-Devlet Vergi Borcu Sorgulama', 'GİB borç, ödeme, yapılandırma. Pratik rehber.', 'e-Devletten vergi borcu nasıl bakılır?', 'Vergi', 'e-devlet vergi borcu,vergi borcu sorgulama', 'vergi-borcu-yapislandirma,emlak-vergisi-nedir,icra-takibi-nedir', 'VUK|/kategori/vuk;AATUHK|/kategori/aatuhk'],
  ['mtk-aidat-icra', 'Site / Apartman Aidatı Ödenmezse Ne Olur?', 'İhtar, icra, haciz. Kat malikleri rehberi.', 'Aidat ödenmezse ne yapılır?', 'Eşya', 'aidat ödenmezse,apartman aidatı icra', 'kat-mulkiyeti-aidat,icra-takibi-nedir,hukuk-davasi-nasil-acilir', 'Kat mülkiyeti|/kategori/katmulkiyeti;İİK|/kategori/iik'],
  ['kira-tespit-davasi', 'Kira Tespit Davası Nedir?', '5 yıl, rayiç, arabuluculuk. Kira rehberi.', 'Kira tespit davası nedir? Ne zaman açılır?', 'Kira', 'kira tespit davası,kira bedeli tespit', 'kira-artis-orani-nasil-hesaplanir,kiraci-nasil-tahliye-edilir,arabuluculuk-nasil-yapilir', 'TBK|/kategori/borclar-ozel;Hesap|/hesaplama/kira'],
  ['tahliye-taahhutnamesi', 'Tahliye Taahhütnamesi Nedir? Geçerlilik', 'Tarih, imza, icra. Kiraya veren-kiracı rehberi.', 'Tahliye taahhütnamesi nedir? Geçerli midir?', 'Kira', 'tahliye taahhütnamesi,tahliye taahhüdü icra', 'kiraci-nasil-tahliye-edilir,kira-artis-orani-nasil-hesaplanir,icra-takibi-nedir', 'TBK|/kategori/borclar-ozel;İİK|/kategori/iik'],
  ['e-devlet-nufus', 'e-Devlet Nüfus İşlemleri Rehberi', 'Kimlik, adres, kayıt örneği. Pratik rehber.', 'e-Devlette hangi nüfus işlemleri yapılır?', 'Nüfus', 'e-devlet nüfus işlemleri,adres beyanı e-devlet', 'nufus-kayit-ornegi,pasaport-basvurusu,veraset-ilami-nasil-alinir', 'NHK|/kategori/nhk;Ara|/ara?q=n%C3%BCfus'],
  ['adres-degisikligi', 'Adres Değişikliği Beyanı Nasıl Yapılır?', 'e-Devlet adres, süre, sonuçlar. Bilgilendirme.', 'Yerleşim yeri adresi nasıl değiştirilir?', 'Nüfus', 'adres değişikliği e-devlet,yerleşim yeri beyanı', 'e-devlet-nufus,nufus-kayit-ornegi,tebligat-usulsuzlugu', 'NHK|/kategori/nhk;Tebligat|/kategori/tebligat'],

  // —— EXTRA_ROWS: Google TR’de sık aranan ~390+ ek konu (sitemap / SEO) ——
  ...EXTRA_ROWS,
];

function parseRow(row) {
  const [slug, title, description, h1, category, kw, rel, linksRaw, seed] = row;
  const keywords = kw.split(',').map((s) => s.trim());
  const related = rel.split(',').map((s) => s.trim());
  const links = linksRaw.split(';').map((pair) => {
    const [label, href] = pair.split('|');
    return { label: label.trim(), href: href.trim() };
  });
  return { slug, title, description, h1, category, keywords, related, links, seed: seed || slug.replace(/-/g, '_') };
}

/** Specialized long bodies for original topics (seed keys) */
const BODIES = {
  emlak_vergisi: bodyPack(
    'Emlak vergisi, Türkiye’de taşınmaz maliki olanların belediyeye ödemekle yükümlü olduğu yıllık bir vergidir. Konut, işyeri ve arsa için farklı oranlar uygulanır; muafiyet ve indirimler engellilik, şehit yakını ve küçük konut gibi hallerde gündeme gelebilir. Bu sayfa genel bilgilendirmedir; oran ve muafiyet için ilgili yılın mevzuatı ile belediyenizin duyuruları esas alınmalıdır.',
    [
      s('Emlak vergisi kime aittir?', [
        'Kural olarak verginin mükellefi taşınmazın malikidir. Paylı mülkiyette her paydaş kendi payı oranında sorumlu olabilir. Kiracı kural olarak asıl mükellef değildir.',
        'Yıl içinde el değiştiren taşınmazlarda devir tarihine göre mükellefiyet değişebilir. Tapu devrinden sonra belediyeye bildirim ve borç sorgusu ihmal edilmemelidir.',
      ], ['Malik / paydaş esası', 'Devir yılında bildirim', 'Belediye yetki alanı']),
      s('Nasıl hesaplanır?', [
        'Emlak vergisi, vergi değeri üzerinden kanunda ve oran cetvellerinde öngörülen oranlarla hesaplanır. Büyükşehir ve diğer belediyelerde oranlar farklılaşabilir.',
        'İndirim ve muafiyet şartları güncellenebilir; belediye ve Gelir İdaresi duyuruları kontrol edilmelidir. Sitedeki araçlar kabaca fikir verir.',
      ]),
      s('Ne zaman ve nasıl ödenir?', [
        'Çoğu belediyede iki taksitte tahsil edilir. e-Devlet, vezne ve banka kanalları yaygındır. Gecikmede gecikme zammı gündeme gelebilir.',
      ], ['Taksit takvimini doğrulayın', 'e-Devlet / online ödeme', 'Dekontu saklayın']),
    ],
    ['Ada-parsel ve belediyeyi tespit edin.', 'Borç ve beyanı sorgulayın.', 'Muafiyet belgelerini tamamlayın.', 'Ödemeyi resmî kanaldan yapın.', 'Devir öncesi borç sıfırlayın.'],
    [
      faq('Kiracı emlak vergisi öder mi?', 'Asıl mükellef maliktir. Sözleşmeyle yansıtma ayrı bir borçlar hukuku meselesidir.'),
      faq('Ödemezsem ne olur?', 'Gecikme zammı, takibat ve işlem engelleri gündeme gelebilir.'),
    ]
  ),
};

function s(heading, paragraphs, bullets) {
  return { heading, paragraphs, bullets };
}
function faq(q, a) {
  return { q, a };
}
function bodyPack(lead, sections, steps, faqList) {
  return { lead, sections, steps: steps || [], faq: faqList || [] };
}

function buildArticle(t) {
  const seo = resolveSeoRole(t.slug);
  let title = t.title;
  let description = t.description;
  let h1 = t.h1;
  let keywords = [...t.keywords];
  let related = t.related.filter((r) => r);
  let links = [...t.links];
  let b;
  let role = seo.role;
  let pillar = seo.pillar || undefined;
  let angle = seo.angle || undefined;
  let canonicalPath;
  let sitemapPriority = 0.88;

  if (seo.role === 'bridge' && seo.bridge) {
    const br = seo.bridge;
    title = br.title;
    description = br.description;
    h1 = br.h1;
    keywords = br.keywords;
    canonicalPath = br.canonicalPath;
    sitemapPriority = 0.45;
    angle = br.angle;
    b = buildBridgeBody(t, br);
    links = [
      { label: 'Tam madde metni + şerh', href: br.canonicalPath },
      { label: 'Kanun maddesi ara', href: '/ara' },
      ...links,
    ];
  } else if (seo.role === 'pillar') {
    sitemapPriority = 0.95;
    // Kısa wave paketleri yerine deep engine (hedef ≥1000)
    b = pickDeepOrCustom(getPillarBody(t.slug), buildDeepBody(t), 1000);
    // pillar related: own spokes first
    if (seo.cluster?.spokes) {
      const spokeSlugs = Object.keys(seo.cluster.spokes);
      related = [...new Set([...spokeSlugs.slice(0, 6), ...related])];
    }
  } else if (seo.role === 'spoke' && seo.spokeMeta) {
    const sm = seo.spokeMeta;
    title = sm.title || title;
    description = sm.description || description;
    h1 = sm.h1 || h1;
    keywords = sm.keywords || keywords;
    angle = sm.angle;
    pillar = seo.pillar;
    sitemapPriority = 0.62;
    const spokeTopic = { ...t, title, description, h1, keywords };
    const spokeBuilt = buildSpokeBody(spokeTopic, {
      pillar: seo.pillar,
      angle: sm.angle,
      clusterLabel: seo.cluster?.label,
    });
    // Elle derinleştirilmiş spoke yeterince uzunsa korunur; aksi halde deep spoke (≥700)
    b = pickDeepOrCustom(getPillarBody(t.slug), spokeBuilt, 700);
    related = [seo.pillar, ...related.filter((r) => r !== seo.pillar)];
    links = [
      { label: 'Ana rehber (tam süreç)', href: `/bilgi/${seo.pillar}` },
      ...links,
    ];
  } else {
    role = 'standard';
    b = pickDeepOrCustom(getPillarBody(t.slug), buildDeepBody(t), 650);
    sitemapPriority = 0.85;
  }

  // Profesyonel katman: örnek, senaryo, tablo, checklist, diyagram ipucu
  b = applyProfessionalLayer(
    { ...t, title, description, h1, keywords },
    b,
    role,
    { angle, pillar }
  );

  return {
    slug: t.slug,
    title,
    description,
    h1,
    keywords,
    category: t.category,
    related,
    links,
    lead: b.lead,
    sections: b.sections,
    steps: b.steps || [],
    faq: b.faq || [],
    updated: UPDATED,
    role,
    pillar,
    angle,
    canonicalPath,
    sitemapPriority,
    examples: b.examples || [],
    scenarios: b.scenarios || [],
    table: b.table,
    checklist: b.checklist || [],
    visual: b.visual,
    keyInsight: b.keyInsight,
  };
}

const topics = ROWS.map(parseRow);
const seen = new Set();
for (const t of topics) {
  if (seen.has(t.slug)) throw new Error('duplicate slug ' + t.slug);
  seen.add(t.slug);
}

const articles = topics.map(buildArticle);

// Fix related links to only existing slugs + SEO rules
const slugSet = new Set(articles.map((a) => a.slug));
const byPillar = new Map();
for (const a of articles) {
  if (a.role === 'spoke' && a.pillar) {
    if (!byPillar.has(a.pillar)) byPillar.set(a.pillar, []);
    byPillar.get(a.pillar).push(a.slug);
  }
}

for (const a of articles) {
  a.related = a.related.filter((s) => slugSet.has(s) && s !== a.slug);

  if (a.role === 'spoke' && a.pillar && slugSet.has(a.pillar)) {
    a.related = [a.pillar, ...a.related.filter((s) => s !== a.pillar)].slice(0, 5);
  } else if (a.role === 'pillar') {
    const spokes = byPillar.get(a.slug) || [];
    a.related = [...new Set([...spokes, ...a.related])].filter((s) => s !== a.slug).slice(0, 8);
  } else if (a.role === 'bridge') {
    // keep process guides, not other madde bridges first
    a.related = a.related.filter((s) => !String(s).includes('madde-')).slice(0, 5);
  }

  if (a.related.length < 3) {
    for (const x of articles) {
      if (x.slug === a.slug) continue;
      if (x.category === a.category && !a.related.includes(x.slug)) a.related.push(x.slug);
      if (a.related.length >= 4) break;
    }
  }
}

const file = `/* AUTO-GENERATED by scripts/generate-vatandas-rehberi.mjs — do not hand-edit */
import type { VatandasArticle } from './types';

export const VATANDAS_ARTICLES: VatandasArticle[] = ${JSON.stringify(articles, null, 2)};

export function getAllVatandasSlugs(): string[] {
  return VATANDAS_ARTICLES.map((a) => a.slug);
}

export function getVatandasBySlug(slug: string): VatandasArticle | undefined {
  return VATANDAS_ARTICLES.find((a) => a.slug === slug);
}

export function getVatandasCategories(): string[] {
  return Array.from(new Set(VATANDAS_ARTICLES.map((a) => a.category))).sort((a, b) =>
    a.localeCompare(b, 'tr')
  );
}

export function getRelatedArticles(slug: string, limit = 4): VatandasArticle[] {
  const a = getVatandasBySlug(slug);
  if (!a) return [];
  const out: VatandasArticle[] = [];
  for (const s of a.related) {
    const x = getVatandasBySlug(s);
    if (x) out.push(x);
    if (out.length >= limit) break;
  }
  if (out.length < limit) {
    for (const x of VATANDAS_ARTICLES) {
      if (x.slug === slug) continue;
      if (out.some((o) => o.slug === x.slug)) continue;
      if (x.category === a.category) out.push(x);
      if (out.length >= limit) break;
    }
  }
  return out;
}
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, file, 'utf8');
console.log('Wrote', OUT);
console.log('Articles:', articles.length);
console.log('Categories:', [...new Set(articles.map((a) => a.category))].join(', '));

// Hard gate: 553 sayfanın tamamı eşik üstü olmalı — tek ince sayfa = fail
const gate = spawnSync(process.execPath, [join(__dir, 'vatandas-depth-gate.mjs')], {
  cwd: join(__dir, '..'),
  stdio: 'inherit',
});
if (gate.status !== 0) {
  console.error('generate-vatandas-rehberi: depth gate failed — not shipping thin pages');
  process.exit(gate.status || 1);
}
