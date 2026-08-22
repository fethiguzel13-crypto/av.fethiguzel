import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
    BANNED_HEADING,
    validateDraft,
    assembleArticle,
    extractJson,
} from '../vatandas-gemini-rewrite.mjs';

test('60 saniyede omurga ve yasal dayanak başlık sayılır', () => {
    assert.equal(BANNED_HEADING.test('2. 60 saniyede omurga'), true);
    assert.equal(BANNED_HEADING.test('Yasal dayanak ve ilgili mevzuat'), true);
    assert.equal(BANNED_HEADING.test('Ne zaman hak doğar?'), false);
});

const good = {
    lead: 'Kıdem tazminatı, iş sözleşmesinin kanunda sayılan biçimde sona ermesi halinde her tam yıl için otuz günlük ücret tutarında ödenir. Artan süreler aynı oran üzerinden hesaplanır ve asıl mesele çalışma yılından önce feshin hukuki sebebini doğru okumaktır.',
    keyInsight: 'Belirleyici olan çalışma süresi değil, sözleşmenin nasıl bittiğidir; sıradan istifa kural olarak hakkı götürür.',
    sections: [
        {
            heading: 'Ne zaman hak doğar?',
            paragraphs: [
                'İşveren sizi ahlak ve iyiniyet kurallarına aykırılık dışında bir sebeple çıkardıysa kıdem doğar. **Kendi isteğinizle istifada kural olarak kıdem yoktur.**',
                'Askerlik, emeklilik ve kadın işçinin evlilikten sonra bir yıl içinde ayrılması ayrıca hak doğurur. Ölüm hâlinde tutar kanuni mirasçılara ödenir.',
                'Listenin dışında kalan sıradan istifa, uygulamada en sık hayal kırıklığı üreten hâldir; ayrılmadan önce sebebini netleştirin.',
            ],
        },
        {
            heading: 'Nasıl hesaplanır?',
            paragraphs: [
                'Her tam yıl için otuz günlük giydirilmiş ücret esas alınır. Artan aylar aynı oranla eklenir.',
            ],
        },
        {
            heading: 'Süreyi kaçırınca ne olur?',
            paragraphs: [
                'İşçilik alacaklarında zamanaşımı kural olarak beş yıldır. Arabuluculuk birçok dosyada dava şartıdır.',
            ],
        },
        {
            heading: 'Sık düşülen tuzak',
            paragraphs: [
                'İbranameyi kalem kalem okumadan imzalamak, sonradan talep edilecek tutarı kilitler.',
            ],
        },
    ],
    steps: [
        'Fesih belgesi ve bordroyu alın.',
        'Ayrılış sebebini yazın.',
        'Giydirilmiş ücreti hesaplayın.',
        'Ödenmezse arabuluculuğa gidin.',
        'Anlaşma olmazsa iş mahkemesinde talep edin.',
    ],
    documents: ['fesih bildirimi', 'bordro', 'SGK hizmet dökümü', 'iş sözleşmesi'],
    faq: [
        { q: 'İstifa edersem kıdem alabilir miyim?', a: 'Kural olarak hayır; haklı nedenle fesih veya kanundaki özel hâller ayrıdır.' },
        { q: 'Tavan nedir?', a: 'Bir yıllık kıdem için ödenecek tutarın üst sınırıdır; rakam dönemsel değişir.' },
        { q: 'Ne kadar sürem var?', a: 'İşçilik alacaklarında zamanaşımı kural olarak beş yıldır.' },
    ],
};

test('sağlam anlatı taslağı geçer', () => {
    const errors = validateDraft(good, { kaynak: '' });
    assert.deepEqual(errors, []);
});

test('yasak başlıklı taslak reddedilir', () => {
    const bad = structuredClone(good);
    bad.sections[0].heading = '60 saniyede omurga';
    const errors = validateDraft(bad, { kaynak: '' });
    assert.ok(errors.some((e) => /yasak başlık/i.test(e)));
});

test('assemble narrative bayrağını koyar', () => {
    const a = assembleArticle(
        { slug: 'x', title: 'T', description: 'D'.repeat(50), h1: 'H1 uzun başlık', keywords: [], category: 'İş', related: [], links: [] },
        good,
        { today: '2026-08-22' }
    );
    assert.equal(a.voice, 'narrative');
    assert.equal(a.source, 'gemini');
    assert.equal(a.documents[0], 'fesih bildirimi');
});

test('çit içindeki JSON ayrışır', () => {
    const obj = extractJson('```json\n{"lead":"abc"}\n```');
    assert.equal(obj.lead, 'abc');
});

test('sondaki virgüllü JSON ayrışır', () => {
    const obj = extractJson('{"lead":"abc","faq":[{"q":"x","a":"y"},],}');
    assert.equal(obj.lead, 'abc');
    assert.equal(obj.faq[0].q, 'x');
});
