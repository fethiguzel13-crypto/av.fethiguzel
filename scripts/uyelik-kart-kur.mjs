#!/usr/bin/env node
/**
 * Kart ödemesi kurulum ve doğrulama aracı.
 *
 *   npm run uyelik:kart                                 → mevcut kurulumu doğrular
 *   npm run uyelik:kart -- --api-key=… --secret-key=…   → anahtarları yazar + doğrular
 *   npm run uyelik:kart -- … --mode=sandbox             → sandbox ortamına zorlar
 *
 * Anahtarlar `.env.local` dosyasına yazılır (git'e girmez) ve aynı anda
 * iyzico'ya gerçek bir checkout isteği atılarak çalıştığı kanıtlanır.
 * Sonda Vercel'e taşımak için hazır komutlar basılır.
 */

import { createHmac, randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENV_LOCAL = resolve(KOK, '.env.local');

function arg(ad) {
  const bayrak = `--${ad}=`;
  const bulunan = process.argv.find((a) => a.startsWith(bayrak));
  return bulunan ? bulunan.slice(bayrak.length).trim() : '';
}

function envOku() {
  if (!existsSync(ENV_LOCAL)) return new Map();
  const satirlar = readFileSync(ENV_LOCAL, 'utf8').split(/\r?\n/);
  const harita = new Map();
  for (const satir of satirlar) {
    const m = satir.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) harita.set(m[1], m[2]);
  }
  return harita;
}

function envYaz(yeni) {
  const mevcut = envOku();
  for (const [k, v] of Object.entries(yeni)) mevcut.set(k, v);
  const govde = [...mevcut.entries()].map(([k, v]) => `${k}=${v}`).join('\n');
  writeFileSync(ENV_LOCAL, `${govde}\n`, 'utf8');
}

function taban(mode) {
  return mode === 'live' ? 'https://api.iyzipay.com' : 'https://sandbox-api.iyzipay.com';
}

function yetkiBasligi(apiKey, secretKey, uriPath, body) {
  const rnd = randomBytes(8).toString('hex');
  const imza = createHmac('sha256', secretKey).update(rnd + uriPath + body).digest('hex');
  const ham = `apiKey:${apiKey}&randomKey:${rnd}&signature:${imza}`;
  return { rnd, authorization: `IYZWSv2 ${Buffer.from(ham, 'utf8').toString('base64')}` };
}

/** iyzico'ya gerçek bir checkout formu açtırarak anahtarları kanıtlar. */
async function dogrula(apiKey, secretKey, mode) {
  const uriPath = '/payment/iyzipos/checkoutform/initialize/auth/ecom';
  const govde = JSON.stringify({
    locale: 'tr',
    conversationId: `kurulum-${Date.now()}`,
    price: '500.00',
    paidPrice: '500.00',
    currency: 'TRY',
    basketId: 'kurulum-testi',
    paymentGroup: 'PRODUCT',
    callbackUrl: 'https://www.avfethiguzel.com/api/uyelik/odeme/sonuc',
    enabledInstallments: [1],
    buyer: {
      id: 'kurulum',
      name: 'Kurulum',
      surname: 'Testi',
      gsmNumber: '+905350000000',
      email: 'kurulum@avfethiguzel.com',
      identityNumber: '11111111111',
      lastLoginDate: '2026-01-01 00:00:00',
      registrationDate: '2026-01-01 00:00:00',
      registrationAddress: 'Erciş / Van',
      ip: '85.34.78.112',
      city: 'Van',
      country: 'Turkey',
      zipCode: '65400',
    },
    shippingAddress: {
      contactName: 'Kurulum Testi',
      city: 'Van',
      country: 'Turkey',
      address: 'Dijital içerik',
      zipCode: '65400',
    },
    billingAddress: {
      contactName: 'Kurulum Testi',
      city: 'Van',
      country: 'Turkey',
      address: 'Dijital içerik',
      zipCode: '65400',
    },
    basketItems: [
      {
        id: 'yargi-aylik',
        name: 'Yargıtay arşivi aylık üyelik',
        category1: 'Dijital içerik',
        itemType: 'VIRTUAL',
        price: '500.00',
      },
    ],
  });

  const { rnd, authorization } = yetkiBasligi(apiKey, secretKey, uriPath, govde);
  let res;
  try {
    res = await fetch(`${taban(mode)}${uriPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
        'x-iyzi-rnd': rnd,
        'x-iyzi-client-version': 'avfethiguzel-portal-1',
      },
      body: govde,
    });
  } catch (e) {
    return { ok: false, hata: `Ağ hatası: ${e.message}` };
  }
  const json = await res.json().catch(() => ({}));
  if (json.status === 'success' && json.checkoutFormContent) {
    return { ok: true, token: json.token };
  }
  return { ok: false, hata: `${json.errorCode || res.status} — ${json.errorMessage || 'bilinmeyen hata'}` };
}

function modBul(apiKey, acik) {
  if (acik === 'live' || acik === 'sandbox') return acik;
  return apiKey.startsWith('sandbox-') ? 'sandbox' : 'live';
}

async function main() {
  const dosyaEnv = envOku();
  const apiKey = arg('api-key') || process.env.IYZICO_API_KEY || dosyaEnv.get('IYZICO_API_KEY') || '';
  const secretKey = arg('secret-key') || process.env.IYZICO_SECRET_KEY || dosyaEnv.get('IYZICO_SECRET_KEY') || '';
  const yaz = Boolean(arg('api-key') && arg('secret-key'));

  if (!apiKey || !secretKey) {
    console.log('Kart ödemesi için iyzico anahtarı bulunamadı.\n');
    console.log('  Canlı (gerçek tahsilat):');
    console.log('    https://merchant.iyzipay.com → Ayarlar → API Anahtarları\n');
    console.log('  Önce denemek isterseniz — kayıt anında, evrak yok:');
    console.log('    https://sandbox-merchant.iyzipay.com → üye ol → API Anahtarları\n');
    console.log('  Anahtarlar elinizdeyken:');
    console.log('    npm run uyelik:kart -- --api-key=BURAYA --secret-key=BURAYA');
    process.exitCode = 1;
    return;
  }

  const mode = modBul(apiKey, arg('mode'));
  console.log(`iyzico ortamı : ${mode}${mode === 'sandbox' ? '  (gerçek tahsilat yok)' : ''}`);
  console.log(`API anahtarı  : ${apiKey.slice(0, 12)}…${apiKey.slice(-4)}`);
  console.log('Doğrulanıyor…\n');

  const sonuc = await dogrula(apiKey, secretKey, mode);
  if (!sonuc.ok) {
    console.error(`✗ Anahtarlar çalışmadı: ${sonuc.hata}`);
    console.error('\n  Sık nedenler: anahtar/secret yer değiştirmiş, panelde IP kısıtı açık,');
    console.error('  ya da sandbox anahtarı live ortama gönderilmiş (--mode=sandbox deneyin).');
    process.exitCode = 1;
    return;
  }

  console.log('✓ iyzico ödeme formu açıldı — anahtarlar çalışıyor.');

  if (yaz) {
    envYaz({ IYZICO_API_KEY: apiKey, IYZICO_SECRET_KEY: secretKey, IYZICO_MODE: mode });
    console.log(`✓ .env.local güncellendi (git'e girmez).`);
  }

  console.log('\nVercel üretimine taşımak için:');
  console.log(`  npx vercel env add IYZICO_API_KEY production     # değer: ${apiKey}`);
  console.log(`  npx vercel env add IYZICO_SECRET_KEY production  # değer: (gizli)`);
  console.log(`  npx vercel env add IYZICO_MODE production        # değer: ${mode}`);
  console.log('  npx vercel --prod                               # env değişince redeploy şart');
  console.log('\nHavale/IBAN varsayılan olarak kapalıdır; kart açıkken gösterilmez.');
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
