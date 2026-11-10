#!/usr/bin/env node
/**
 * Karar arama — yerel sunucu. Yalnız bu bilgisayardan (127.0.0.1) erişilir; üyelik ya da şifre istemez.
 *
 *   node scripts/karar-arama/sunucu.mjs          # http://127.0.0.1:4400
 *   node scripts/karar-arama/sunucu.mjs --ac     # tarayıcıyı da açar (masaüstü kısayolu bunu kullanır)
 *
 * Açılışta ve saatte bir kur.mjs'yi ayrı süreçte çalıştırır: hasat motorunun yeni indirdiği kararlar eklenir.
 * Sunucu zaten açıksa ikinci kez başlamaz, yalnız tarayıcıyı açar.
 */
import { createServer } from "node:http";
import { appendFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { BETIK_DIZINI, DB, DB_DIZINI, PORT, dizinHazirla, durumOku } from "./ayar.mjs";
import { ac, ara, daireler, durum, getir } from "./veritabani.mjs";

const GUVENLIK = {
  "Content-Security-Policy":
    "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Cache-Control": "no-store",
};

const TURLER = new Set(["ibk", "hgk", "cgk", "hukuk", "ceza"]);
const yil = (s) => (/^\d{4}$/.test(s ?? "") ? Number(s) : undefined);

/** http.Server döner; dinlemeye başlatmak çağırana kalır (testler 0 numaralı kapıyı kullanır). */
export function sunucuOlustur({ db, arayuz = join(BETIK_DIZINI, "arayuz.html") }) {
  let daireOnbellek = null;
  let daireZamani = 0;

  const gonder = (y, kod, govde, tur = "application/json; charset=utf-8") => {
    y.writeHead(kod, { "Content-Type": tur, ...GUVENLIK });
    y.end(typeof govde === "string" ? govde : JSON.stringify(govde));
  };

  return createServer((i, y) => {
    try {
      const kapi = i.socket.localPort;
      const izinli = [`127.0.0.1:${kapi}`, `localhost:${kapi}`];
      if (!izinli.includes(String(i.headers.host || "").toLowerCase())) return gonder(y, 403, { hata: "yalnız yerel erişim" });
      if (i.method !== "GET" && i.method !== "HEAD") return gonder(y, 405, { hata: "yalnız GET" });

      const u = new URL(i.url, `http://127.0.0.1:${kapi}`);
      const p = u.searchParams;
      switch (u.pathname) {
        case "/":
          return gonder(y, 200, readFileSync(arayuz, "utf8"), "text/html; charset=utf-8");
        case "/api/ara": {
          const tur = p.get("tur");
          return gonder(
            y,
            200,
            ara(db, (p.get("q") || "").slice(0, 500), {
              tur: TURLER.has(tur) ? tur : undefined,
              daire: p.get("daire") || undefined,
              yil1: yil(p.get("yil1")),
              yil2: yil(p.get("yil2")),
              sirala: p.get("sirala") === "ilgili" ? "ilgili" : "yeni",
              sayfa: Number(p.get("sayfa")) || 1,
              boyut: Number(p.get("boyut")) || 20,
            }),
          );
        }
        case "/api/karar": {
          const k = getir(db, p.get("id") || "", (p.get("q") || "").slice(0, 500));
          return k ? gonder(y, 200, k) : gonder(y, 404, { hata: "karar bulunamadı" });
        }
        case "/api/daireler":
          if (!daireOnbellek || Date.now() - daireZamani > 10 * 60_000) {
            daireOnbellek = daireler(db);
            daireZamani = Date.now();
          }
          return gonder(y, 200, daireOnbellek);
        case "/api/durum":
          return gonder(y, 200, { ...durum(db), kur: durumOku() });
        default:
          return gonder(y, 404, { hata: "bulunamadı" });
      }
    } catch (e) {
      gunluk(`istek hatası ${i.url}: ${e?.stack || e}`);
      return gonder(y, 500, { hata: "sunucu hatası" });
    }
  });
}

function gunluk(mesaj) {
  const satir = `${new Date().toISOString()} ${mesaj}\n`;
  process.stdout.write(satir);
  try {
    dizinHazirla();
    appendFileSync(join(DB_DIZINI, "sunucu.log"), satir);
  } catch {
    /* günlük yazılamazsa sunucu yine çalışır */
  }
}

function tarayiciAc(adres) {
  const [komut, arg] = process.platform === "win32" ? ["cmd", ["/c", "start", "", adres]] : [process.platform === "darwin" ? "open" : "xdg-open", [adres]];
  spawn(komut, arg, { detached: true, stdio: "ignore", windowsHide: true }).unref();
}

let kurSureci = null;
function guncelle() {
  if (kurSureci) return;
  kurSureci = spawn(process.execPath, [join(BETIK_DIZINI, "kur.mjs"), "--sessiz"], { stdio: "ignore", windowsHide: true });
  kurSureci.on("exit", (kod) => {
    if (kod) gunluk(`güncelleme ${kod} koduyla bitti`);
    kurSureci = null;
  });
}

async function zatenAcik(adres) {
  try {
    const y = await fetch(`${adres}/api/durum`, { signal: AbortSignal.timeout(3000) });
    return y.ok && typeof (await y.json()).karar === "number";
  } catch {
    return false;
  }
}

function ana() {
  const acilsin = process.argv.includes("--ac");
  const adres = `http://127.0.0.1:${PORT}`;
  const db = ac(DB);
  const sunucu = sunucuOlustur({ db });
  sunucu.on("error", async (e) => {
    if (e.code === "EADDRINUSE" && (await zatenAcik(adres))) {
      if (acilsin) tarayiciAc(adres);
      process.exit(0);
    }
    gunluk(`sunucu başlatılamadı: ${e.message}`);
    process.exit(1);
  });
  sunucu.listen(PORT, "127.0.0.1", () => {
    gunluk(`Karar arama açık: ${adres} (veritabanı ${DB})`);
    if (acilsin) tarayiciAc(adres);
    if (!process.argv.includes("--guncelleme-yok")) {
      setTimeout(guncelle, 5_000);
      setInterval(guncelle, 60 * 60_000);
    }
  });
}

const ayni = (a, b) => (process.platform === "win32" ? a.toLowerCase() === b.toLowerCase() : a === b);
if (process.argv[1] && ayni(resolve(process.argv[1]), fileURLToPath(import.meta.url))) ana();
