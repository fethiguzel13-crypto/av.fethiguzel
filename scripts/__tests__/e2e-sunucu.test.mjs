import { test } from 'node:test';
import assert from 'node:assert/strict';
import { portSahibi, portKarari, hazirBekle } from '../lib/e2e-sunucu.mjs';

/*
  G22 adım 1: Uçtan uca koşucunun sunucu kararları. Koşucu 3123'ü kendisi açar ve kapatır; port doluysa başka
  oturumun sunucusunu öldürmez, durur (OTONOM: kesilen oturumdan kalan `next start` eski derlemeyi sınar). Kendi sunucusunu
  `taskkill /T` ile süreç ağacıyla kapatır, ardından portun boşaldığını bu modülle doğrular.
*/

const NETSTAT = [
  '  Proto  Local Address          Foreign Address        State           PID',
  '  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       1180',
  '  TCP    0.0.0.0:31230          0.0.0.0:0              LISTENING       77',
  '  TCP    127.0.0.1:3123         127.0.0.1:52011        TIME_WAIT       0',
  '  TCP    [::]:3123              [::]:0                 LISTENING       4242',
].join('\r\n');

test('netstat çıktısından portu dinleyen süreci bulur, benzer port ve TIME_WAIT satırını saymaz', () => {
  assert.equal(portSahibi(NETSTAT, 3123), 4242);
  assert.equal(portSahibi(NETSTAT, 135), 1180);
  assert.equal(portSahibi(NETSTAT.replace(/^.*\[::\]:3123.*$/m, ''), 3123), null);
});

test('port boşsa sunucu başlatılır', () => {
  assert.deepEqual(portKarari(null), { eylem: 'baslat' });
});

test('port doluysa koşucu durur ve tutan süreci yazar; next start olsa bile öldürmez', () => {
  const next = portKarari({ pid: 4242, komut: 'node node_modules/next/dist/bin/next start -p 3123' });
  assert.equal(next.eylem, 'dur');
  assert.match(next.mesaj, /4242/);
  assert.match(next.mesaj, /next start/);

  const baska = portKarari({ pid: 9, komut: 'python -m http.server 3123' });
  assert.equal(baska.eylem, 'dur');
  assert.match(baska.mesaj, /9/);
  assert.doesNotMatch(baska.mesaj, /next start/);
});

test('sunucu 200 dönene kadar bekler', async () => {
  const yanitlar = [new Error('ECONNREFUSED'), 503, 200];
  const getir = async () => {
    const y = yanitlar.shift();
    if (y instanceof Error) throw y;
    return { status: y };
  };
  assert.equal(await hazirBekle('http://localhost:3123/', { sureMs: 1000, aralikMs: 1, getir }), true);
  assert.equal(yanitlar.length, 0);
});

test('süre dolunca hata verir', async () => {
  const getir = async () => {
    throw new Error('ECONNREFUSED');
  };
  await assert.rejects(hazirBekle('http://localhost:3123/', { sureMs: 30, aralikMs: 5, getir }), /30 ms/);
});
