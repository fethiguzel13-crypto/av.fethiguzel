# Hukuk Fakültesi Ders Notları — Uygulama Planı

> **Sınıf:** Mimari (yeni alt sistem; mevcut portal içinde). Kod yazılmaz; onay sonrası uygulanır.
> **Ortam:** Grok ajan orkestrasyonu (mevcut). Google Antigravity “Manager View” kavramları buradaki ajan rollerine eşlenir; ayrı bir IDE’ye göç yok.
> **Hedef ürün:** Türkiye hukuk fakültesi öğrencisine, kendi fakültesinin takvimine ve ekolüne oturan, FSEK-temiz, sınavı baştan sona götüren başvuru notu.

**Goal:** Mevcut `/ders-notlari` yığınını (84 fakülte, ~36 ders, 7.999 kalıp JSON, kalite kapısıyla yayından çekilmiş) FSEK-uyumlu bilgi grafı + fakülte katmanı + RAG + pedagoji araçları (test, kart, Mermaid) + denetçi ajan ile yeniden inşa etmek.

**Architecture:** Her ders için **tek kanonik bilgi grafı** (kurum, unsur, madde, içtihat, ekol ayrımı) üretilir. Fakülte sayfası bu grafı **örtü** ile giydirir (takvim, dil, sınav kültürü, yayımlanmış müfredat sırası, mehaz). Çıktı üç varyanttır: Güz, Bahar, Konsolide Yıllık Master. Ham hoca notu hiçbir zaman çıktıya cümle olarak geçmez.

**Tech Stack:** Next.js (mevcut `fethiguzel-portal`), `lib/ders-notlari/*`, mevzuat paketleri, yerel Yargıtay arşivi, Gemini (yapılandırılabilir model kimliği), benzerlik kapısı, Playwright **yalnız görsel QA ve kamuya açık müfredat**, pgvector/sqlite-vec (2. faz).

**Spec / zemin:** `docs/ders-notlari/KALITE-VE-ARASTIRMA.md`, `docs/ders-notlari/ANALIZ-TURKIYE-HUKUK-FAKULTETLERI.md`, `lib/ders-notlari/types.ts`, `lib/content-quality.mjs`.

---

## 0. Sınıflandırma ve duruş

Bu iş **yeni bir site değil**. Portalda rota, tip, PDF, sitemap, kalite kapısı ve 84 fakülte kaydı duruyor. 14.08.2026 denetiminde 7.999 notun aynı kalıptan 84 fakülteye çoğaltıldığı ölçüldü; `auditLectureNote` hepsini gizledi. Asıl iş: kalıbı öldürmek, kanonik grafı yazmak, fakülteyi örtü yapmak.

Üç yaklaşım:

| | A. 84 bağımsız risale | B. Kanonik graf + fakülte örtüsü (önerilen) | C. Tek ulusal not, fakülte yalnızca kenar çubuğu |
|---|---|---|---|
| Benzersizlik | Yüksek, sürdürülemez | Fakülte ekolü + sınav + sıra gerçekten değişir | Zayıf |
| FSEK | 84 kaynak azlığıyla kopyaya kayar | Kaynak graf + kanun/içtihat | Temiz ama “ekol” vaadi boş |
| Bakım | 84 × 36 × 3 varyant | 36 graf + 84 ince örtü | En ucuz |
| SEO scaled-content | En riskli | Kontrol edilebilir (yalnız `curated` indekslenir) | Düşük |

**Karar (öneri):** B. “Her üniversiteye sıfırdan 40.000 kelimelik ayrı kitap” hem FSEK hem halüsinasyon hem SEO açısından önceki felaketin büyütülmüş halidir.

---

## 1. Hukuki sınır — FSEK ve “stealth” kazıma

### 1.1 Ne serbest (FSEK m. 31 ve açık kaynak)

- Resmen yayımlanmış kanun, yönetmelik, yargı kararı metni — zaten `content/mevzuat` ve `data/yargi-kararlari` duruyor.
- Fakültenin **kamuya açık** Bologna/AKTS izlencesi, ders adı, haftalık **başlık listesi** (Ankara `acikders` örneği: slayt başlığı alınır, slayt cümlesi alınmaz — `docs/ders-notlari/research/ankara.md`).
- Öğretide yerleşik kavramlar: sayfa uydurmadan, doctrine listelerindeki yazar adıyla.

### 1.2 Ne yasak

- Hoca slaytı, fotokopi not, NotPazarı, öğrenci WhatsApp PDF’i, şifreli LMS (Moodle/ALMS) içeriği.
- Kaynak cümlenin eşanlamlı “spin”i. Telif, ifade biçimini korur; spinning kaçış değildir.
- **Tespit edilemeyen (stealth) tarama:** `navigator.webdriver` maskesi, plugin yaması, yerleşim yeri proxy rotasyonu, ban-kaçınma amaçlı insan taklidi. Bu, yetkisiz erişimi gizlemek için tasarlanır; FSEK-temiz üretim iddiasını da çökertir. Bu planda **yoktur**, uygulanmayacaktır.

### 1.3 Yerine konan yasal kaynak broker’ı

Kimlikli, yavaş, `robots.txt` + site kullanım şartına bağlı **kamuya açık** sayfa okuma:

- Fakülte “ders içerikleri / Bologna” HTML-PDF’leri.
- YÖK Atlas / resmi program sayfaları (fakülte var/yok doğrulaması — sahte üni temizliği zaten yapıldı).
- `acikders.*` yalnızca ToS izin veriyorsa, yalnız başlık omurgası.
- Birincil zenginleştirme: mevcut mevzuat paketleri + Yargıtay arşivi + `mobile/data-src/mevzuat/atif.json.gz`.

Hız tavanı (mevcut disiplin, `KALITE-VE-ARASTIRMA.md`): fakülte başına günde 3–8 sayfa; istek arası ≥ 8–15 sn; peş peşe 20 istek yok. User-Agent **projeyi tanıtır**, gizlemez.

Playwright’ın yeri: (1) bizim `/ders-notlari` sayfasının görsel doğrulaması, (2) kamuya açık izlence PDF/HTML’nin **açık kimlikle** alınması. Stealth eklentisi kurulmaz.

İsteğe bağlı 2. faz: öğretim elemanı / fakülte ile lisanslı içerik; öğrenci notu yalnızca CC-BY + “kaynak slayt değil” beyanı ile.

### 1.4 Çıktı kapısı (telifi ölçen)

Her üretilen not, eldeki kaynak parçalarına karşı:

- 8+ kelimelik n-gram örtüşmesi eşiği,
- gömme kosinüs (faz 2),
- mevcut `LECTURE_FINGERPRINTS` + yeni kalıp listesi,
- künye doğrulaması (`scripts/serh-dogrula.mjs` mantığı: yerel arşivde yoksa künye yok).

Eşik aşılırsa not `curated` olamaz; yayımlanmaz.

---

## 2. Mevcut yığın (kopyalanacak / dokunulacak)

| Parça | Yol | Durum |
|--------|-----|--------|
| Rotalar | `app/ders-notlari/**` | Hub / ders / PDF; kalıp not `WithdrawnNote` |
| Tipler | `lib/ders-notlari/types.ts` | `examBox`, `kartlar`, diyagram türleri, `variantOf` / `variantLabel` zaten var |
| Fakülte | `lib/ders-notlari/universiteler.ts` | ~84 aktif, öncelik 1–3 |
| Müfredat | `lib/ders-notlari/mufredat.ts` | Çekirdek + seçmeli |
| Üretim | `scripts/generate-ders-notlari.mjs`, `generate-*-triple.mjs` | **Varsayılan yol değil** (kalite dokümanı) |
| Banka | `scripts/lib/ders-note-banks-all-core.mjs`, `ders-lecture-compose.mjs` | Kalıp kokusu; grafın ilk tohumu olabilir, çıktı olamaz |
| Araştırma | `docs/ders-notlari/research/{slug}.md` | Şimdilik 2 fakülte |
| Not dosyaları | `lib/ders-notlari/generated/notes/*.json` | 7.999; NFT yüzünden runtime tek dosya okuma |
| Kapı | `auditLectureNote` in `lib/content-quality.mjs` | 2+ parmak izi → gizle |
| Kanun | `content/mevzuat`, `content-packs/*.json.gz` | 8.088 madde |
| İçtihat | `data/yargi-kararlari/**`, `index.jsonl` | Künye + metin |
| LLM | `scripts/lib/llm-client.js` | Gemini varsayılan, kuyruklu |
| Görünüm | `components/DersNotuView.tsx` | Mermaid / MCQ yok |

**Korunacak kararlar:** ana menüde ders notu yok (footer); `generateStaticParams = []`; yalnız `curated` indeks; sahte üniversite yok.

---

## 3. Hedef bilgi mimarisi

```
CourseGraph (kanonik, fakülteden bağımsız)
  Institution[]          borç ilişkisi, icap, temerrüt…
    definition           1. sınıf dilinde
    elements[]
    organicLinks[]       önce/sonra/komşu kurum
    statuteRefs[]        kanunId + maddeNo (yalnız gerçek madde)
    caseRefs[]           yerel arşiv id + künye
    doctrineSplit[]      Ankara/İstanbul/mehaz ayrımı (atıfsız genel ifade + listeli yazar adı)
  TopicOrder             Güz / Bahar dilimleri
  CoverageManifest       denetçinin “atlanan kurum” listesi

FacultyOverlay (üniversite)
  calendar, lang, examBox
  syllabusOrder[]        kamuya açık izlenceden başlık sırası
  schoolNotes            o fakültenin ekol cümleleri (research dosyasından)
  sources[]              URL + “ne alındı: başlık omurgası”

RenderedNote = Graph ⋈ Overlay ⋈ Variant(guz|bahar|yillik)
  sections[]  pedagoji: tanım → organik bağ → ekol
  examples[]  kurmaca, işaretli
  mermaid[]   süreç / çatal
  flashcards[]
  mcq[]       konu sonu; cevap + gerekçe; kopyalanmış sınav sorusu yok
```

Pedagoji sırası her konuda zorunlu:

1. Terim tanımı (birinci sınıfın ilk karşılaşması),
2. Kurumun komşularıyla organik bağ,
3. Okul/ekol farkı (varsa; yoksa “Türk hukukunda hâkim görüş” — uydurma hoca doktrini yok).

Varyantlar (`types.ts` `variantOf` / `variantLabel` ile uyumlu):

- `{code}-donem-1` — Güz,
- `{code}-donem-2` — Bahar,
- `{code}-yillik` — Konsolide master (her iki dönemin grafı + tekrar ve çapraz gönderim).

Kelime tabanı (öneri, onayda kilitlenir):

| Varyant | Hedef gövde |
|---------|-------------|
| Güz / Bahar | 8.000–12.000 kelime |
| Yıllık master | 18.000–28.000 kelime |

10–20 sayfalık özet **yetersiz** kabul edilir; 84×40k risale de üretilmez. Derinlik grafın kurum sayısından gelir.

---

## 4. Veri şeması

### 4.1 Faz 1 — git + JSON (mevcut disipline sadık)

Vercel NFT limiti yüzünden notlar zaten tek tek dosya (`{uni}__{code}.json`). Buna ek:

```
lib/ders-notlari/
  graphs/{courseCode}.json          # kanonik graf
  overlays/{uniSlug}.json           # fakülte örtüsü
  generated/notes/{uni}__{code}.json
docs/ders-notlari/research/{uniSlug}.md
docs/ders-notlari/coverage/{courseCode}.yaml   # denetçi manifesti
```

`CourseNote` genişlemesi (`types.ts`):

```ts
export type NoteMcq = {
  q: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  reason: string; // neden doğru; diğer şık tuzağı
};

export type NoteFlashcard = { front: string; back: string };

export type NoteMermaid = {
  title: string;
  diagram: string; // mermaid kaynak; sunucuda sanitize
};

// CourseNote'a ek:
// topics?: { id: string; heading: string; mcq: NoteMcq[]; flashcards: NoteFlashcard[] }[];
// mermaid?: NoteMermaid[];
// qualityTier: 'template' | 'research-draft' | 'curated';
// fsek: { similarityMax: number; sourceIds: string[] };
```

Eski `NoteDiagram` türleri kalır; Mermaid **ek** kanaldır (süreç zihin haritası). İkisi birden kırılırsa sayfa yine ayakta kalır.

### 4.2 Faz 2 — RAG deposu (ayrı PR, not gövdesini taşımaz)

```sql
-- Postgres + pgvector  veya  sqlite-vec (yerel üretim makinesi)
CREATE TABLE rag_chunk (
  id            TEXT PRIMARY KEY,
  corpus        TEXT NOT NULL, -- 'mevzuat' | 'yargi' | 'graph' | 'overlay' | 'doctrine'
  kanun_id      TEXT,
  madde_no      TEXT,
  karar_id      TEXT,
  course_code   TEXT,
  text          TEXT NOT NULL,
  embedding     VECTOR(768),
  source_uri    TEXT NOT NULL
);

CREATE INDEX rag_chunk_embedding_idx ON rag_chunk
  USING ivfflat (embedding vector_cosine_ops);
```

Üretim ajanı not yazarken yalnız bu parçaları görür. Öğrenciye v1’de sohbet RAG’i **yok** (TBB + halüsinasyon). RAG, **yazar ajanın** madde ve künye seçicisidir.

Öğrenci ilerleme / quiz skoru istenirse 3. faz: mevcut `lib/uyelik` oturumu üzerine `note_progress(user, uni, course, topic, score)`.

---

## 5. RAG ve üretim döngüsü

```
Coverage YAML ──► Graph-builder ajan
                      │
Mevzuat pack ─────────┤
Yargı index + atif ───┤──► Retriever (önce yapısal madde/künye, sonra gömme)
Doctrine listeleri ───┤
Overlay / research ───┘
                      ▼
              Writer ajan (Gemini, model env)
                      ▼
         Citation-verifier (künye yerel arşivde mi?
                            madde gerçekten var mı?
                            n-gram kaynakla mı çakışıyor?)
                      ▼
              Pedagogy-editor (tanım→bağ→ekol; staccato yasağı)
                      ▼
              auditLectureNote + yeni FSEK kapısı
                      ▼
         curated JSON + noindex kalkar
                      ▼
              Auditor ajan (manifest boşlukları → yama kuyruğu)
```

Retriever kuralları (halüsinasyon önleme skill ile aynı):

- Künye yoksa “içtihat yok” yazılır; E./K./T. uydurulmaz.
- Çapraz madde yalnız graf + gerçek dosyadan.
- Doktrin: `doctrine-tbk.md` vb. listedeki ad, sayfa yok.

LLM: `scripts/lib/llm-client.js` genişletilir. `GEMINI_NOTE_MODEL` ortam değişkeni (varsayılan mevcut çalışan Pro/Flash-Lite; “Gemini 3.1 Pro” id’si belgelenmiş ve anahtarda açılmışsa seçilir — uydurma model adı yok).

---

## 6. Ajan orkestrasyonu (Antigravity eşlemesi)

| Antigravity kavramı | Bu repoda |
|---------------------|-----------|
| Manager View paralel ajan | `spawn_subagent` / Grok workflow: Researcher, Graph-builder, Writer, Verifier, Auditor |
| Dahili Chrome görsel doğrulama | Playwright **bizim** sayfada: tanım kutusu, Mermaid SVG, MCQ tıklama, PDF yazdırma |
| Skills / MCP | Mevcut: `hukuki-halusinasyon-onleme`, `kanun-maddesi-yorumla`, `akademik-hukuk-uslubu`, GitHub; yeni: `ders-notu-fsek-gate` |
| NotebookLM | İsteğe bağlı: kanonik grafı NotebookLM’e kaynak olarak vermek (podcast değil; quiz tohumu). Zorunlu değil; MCQ bizde üretilir |

Rol sözleşmesi:

1. **Researcher** — `docs/ders-notlari/research/{slug}.md` doldurur; slayt cümlesi yazmaz.
2. **Graph-builder** — `graphs/{code}.json` + `coverage/{code}.yaml`.
3. **Writer** — overlay ⋈ graph ⋈ variant; JSON şema.
4. **Verifier** — künye, madde, n-gram, parmak izi, üslup.
5. **Auditor** — “müfredatta atlanan kurum var mı?” → eksik topic’i Writer kuyruğuna iter.

Kodlama oturumu: onaylı plandaki **tek ders (borçlar-genel) × 3 varyant × 1 fakülte (AÜHF)** altın örnek bitmeden 84 fakülteye çoğaltma **yasak**.

---

## 7. Ön yüz

`DersNotuView` genişler:

- Konu ânkeri + içindekiler,
- Tanım kartları (`kartlar` zaten var),
- Mermaid (`mermaid` paketi, `dangerouslySetInnerHTML` yok — `mermaid.parse` + SVG),
- Konu sonu MCQ (istemci; skor v1’de localStorage, üyelik 3. faz),
- Flashcard (çevir),
- Fakülte sınav kutusu,
- “Resmi müfredatın yerine geçmez” bandı,
- PDF rotası aynı içeriği print CSS ile basar (Mermaid SVG basılabilir olmalı).

Kalıp notlar: `qualityTier: template` kalır, kapı gizler. Silmek zorunlu değil; yeni `curated` aynı slug’ı ezer.

---

## 8. Adım adım eylem planı (onay sonrası PR’lar)

Her PR kendi başına yayımlanabilir; altın örnek görünür olmadan SEO açılmaz.

### PR 1 — Şema, kapı, yasal broker iskeleti

**Dosyalar:** `lib/ders-notlari/types.ts`, `lib/content-quality.mjs`, `lib/ders-notlari/fsek-gate.mjs` (yeni), `scripts/lib/source-broker.mjs` (yeni), testler.

- `CourseNote` alanları: `mermaid`, `mcq`, `flashcards`, `fsek`.
- `auditLectureNote` genişler: parmak izi **veya** n-gram **veya** ince gövde → `publishable: false`.
- Source-broker: allowlist host, robots, kimlikli UA, 8–15 sn aralık. Stealth yok.
- Test: kalıp not fail; AÜHF research başlık omurgası pass; uydurma künye fail.

**Doğrulama:** `node --test lib/__tests__/content-quality.test.mjs` + yeni fsek-gate testi.

### PR 2 — Borçlar genel kanonik graf + coverage YAML

**Dosyalar:** `lib/ders-notlari/graphs/borclar-genel.json`, `docs/ders-notlari/coverage/borclar-genel.yaml`, Graph-builder betiği.

- Kurum listesi TBK m.1–206 omurgası (mevcut `ders-note-quality.mjs` bankası tohum, cümle kopyası değil).
- Her kuruma gerçek madde numarası (dosyası var mı diye `content/mevzuat/tbk/madde-N.md`).
- İçtihat: yalnız `atif` + `index.jsonl`.

**Doğrulama:** coverage’daki her `institution.id` grafda var; her `statuteRefs` dosyada var.

### PR 3 — Writer + üç varyant, tek fakülte

**Dosyalar:** `scripts/compose-note-from-graph.mjs` (yeni), `lib/ders-notlari/overlays/ankara.json`, `generated/notes/ankara__borclar-genel-{donem-1,donem-2,yillik}.json`.

- Overlay: `docs/ders-notlari/research/ankara.md` (yıllık+yarıyıl, acikders başlık sırası).
- Gemini ile üretim; Verifier kapıdan geçmezse yazılmaz.
- Hub linkleri üçlü (mevcut `generate-borclar-genel-triple.mjs` örüntüsü, kalıp gövde **yok**).

**Doğrulama:** üç dosya `auditLectureNote` + fsek-gate `publishable`; kelime tabanı; “çek tedavülü” vb. yok.

### PR 4 — Ön yüz: Mermaid, MCQ, kart

**Dosyalar:** `components/DersNotuView.tsx`, `components/ders-notlari/MermaidBlock.tsx`, `McqBlock.tsx`, `FlashcardBlock.tsx`, CSS.

- Playwright: `/ders-notlari/ankara/borclar-genel-yillik` — tanım görünür, mermaid SVG, MCQ doğru şık, PDF’de başlıklar.

**Doğrulama:** tarayıcıda (mevcut kural) masaüstü + mobil.

### PR 5 — Denetçi ajan

**Dosyalar:** `scripts/audit-course-coverage.mjs`, workflow/skill `ders-notu-denetci`.

- Coverage YAML vs graf vs render edilen not.
- Eksik kurum → Writer kuyruğu (otomatik yama, insan onayı `curated` bayrağında).

**Doğrulama:** kasıtlı eksik kurum enjekte et → denetçi yakalar.

### PR 6 — Dalga: öncelik-1 fakülteler, çekirdek özel hukuk

AYBÜ, AÜHF, İÜHF, Marmara, DEÜ, Hacettepe, GSÜ, Bilkent, Koç — borçlar / medeni / ceza / usul. Her fakülteye research dosyası **önce**. Toplu `generate-ders-notlari.mjs --wave=all` **hâlâ yasak**.

### PR 7 — RAG deposu (gömme)

Yerel sqlite-vec veya Postgres. Yalnız üretim makinesi. Öğrenci sohbeti yok.

### PR 8 — Kalan çekirdek dersler, sonra seçmeli

Graf başına aynı döngü. Master not, dönem notlarından türetilir (çift yazım yok).

---

## 9. Anti-kalıp ve kalite kapısı (genişletme)

Mevcut `LECTURE_FINGERPRINTS` kalır. Eklenir:

- Kaynak broker’ın aldığı başlık cümlesinin 12+ kelimelik aynen tekrarı,
- 84 notta aynı 40 kelimelik paragraf (ölçüm: `scripts/audit-content.mjs` ders kolu),
- “60 saniyede omurga” / workshop dili (`vatandas` BANNED ile aynı aile).

`qualityTier: curated` olmadan sitemap’e girmez (`lib/publishable.ts` + `build-ders-notlari-sitemap.mjs`).

---

## 10. Global kısıtlar (her görevde örtük)

- Push yok; kullanıcı ayrıca ister.
- TBB reklam yasağı: geçme garantisi, yüzde, müvekkil yok.
- Resmi metin onarılmaz, şerh/not için uydurma künye yok.
- YAZIM-DILI (Türkçe akademik) **ana not gövdesinde** geçerli; birinci sınıf açıklaması bağlaçlı uzun cümleyle, staccato yasak.
- Stealth / yerleşim proxy / webdriver maskesi **asla**.
- Altın örnek (1 ders × 3 varyant × 1 fakülte) onaylı ve kapıdan geçmiş olmadan ölçek yok.

---

## 11. Doğrulama döngüsü (sistem)

Her kurs için `coverage/{code}.yaml` kanonik müfredat iskeletidir. Denetçi sorar:

1. Tüm kurumlar anlatıldı mı?
2. Güz/Bahar dilimi coverage ile örtüşüyor mu?
3. Fakülte örtüsü kaynak URL’siz ekol cümlesi mi uyduruyor?
4. MCQ, gövdedeki unsuru mu ölçüyor, yoksa ezber tuzak mı?
5. Mermaid, metindeki süreci mi çiziyor?

Eksik → Writer yama PR’ı. İnsan `curated` damgasını basmadan indeks açılmaz.

---

## 12. Kararlar ve kalan sorular

**Kilitlendi (kullanıcı, 2026-08-25):** Benzersizlik mimarisi = **B — kanonik graf + fakülte örtüsü.** 84 bağımsız risale yok.

**Hâlâ onayda:**

1. Kelime tabanı (Güz 8–12k / Master 18–28k) yeterli mi, yoksa master için 40k+ mı?
2. Öğrenci MCQ skoru v1’de localStorage mı, üyelik hesabına mı bağlansın?
3. Stealth kazıma planda yok; yasal broker mı, yoksa web taraması tamamen kapalı mı?

---

## 13. Bilinçli olarak planda olmayanlar

- Playwright-stealth, residential proxy, webdriver gizleme.
- Moodle/şifreli LMS kırılması.
- Öğrenciye serbest “hocaya sor” RAG sohbeti (v1).
- 84 × 36 notun tek gecede üretimi.
- Google Antigravity’ye zorunlu göç (ajan rolleri burada çalışır).

---

## Key Decisions

1. **Mevcut portalde inşa** — yeni domain/stack yok; NFT ve kalite kapısı dersi pahalı ödendi.
2. **Graf + örtü** — benzersizlik fakülte katmanında; risale çoğaltmak kalıbı tekrarlar.
3. **Yasal broker, stealth yok** — FSEK m. 31 + kamuya açık izlence başlığı; gizlenmiş kazıma yok.
4. **RAG yazar içindir** — öğrenci sohbeti yok.
5. **Altın örnek kilidi** — ölçek, bir dersin üç varyantı kapıdan geçmeden açılmaz.
6. **Curated olmadan noindex** — scaled content tekrarı.

## PR Plan (özet sıra)

1. Şema + FSEK kapısı + yasal broker  
2. Borçlar genel graf + coverage  
3. AÜHF üç varyant writer  
4. Mermaid / MCQ / kart UI + tarayıcı doğrulama  
5. Denetçi ajan  
6. Öncelik-1 fakülte dalgası  
7. RAG deposu  
8. Kalan çekirdek dersler  
