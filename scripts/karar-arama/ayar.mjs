/**
 * Karar arama — yollar ve kilit. Veritabanı varsayılan olarak D: diskindedir (C: dolu); KARAR_ARAMA_DB ile değişir.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, openSync, closeSync, renameSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const BETIK_DIZINI = dirname(fileURLToPath(import.meta.url));
export const PORTAL = resolve(BETIK_DIZINI, "..", "..");
export const VERI = process.env.KARAR_ARAMA_VERI || join(PORTAL, "data", "yargi-kararlari");

function varsayilanDb() {
  if (process.env.KARAR_ARAMA_DB) return process.env.KARAR_ARAMA_DB;
  return existsSync("D:/") ? "D:/karar-arama/kararlar.db" : join(PORTAL, "data", "karar-arama", "kararlar.db");
}

export const DB = varsayilanDb();
export const DB_DIZINI = dirname(DB);
export const DURUM_DOSYASI = join(DB_DIZINI, "kur-durum.json");
export const KILIT = join(DB_DIZINI, "kur.kilit");
export const PORT = Number(process.env.KARAR_ARAMA_PORT || 4400);

export function dizinHazirla() {
  mkdirSync(DB_DIZINI, { recursive: true });
}

function surecYasiyor(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === "EPERM";
  }
}

/** Tek kur.mjs çalışsın: kilit dosyası alınamazsa false. Ölü sürecin kilidi devralınır. */
export function kilitAl() {
  dizinHazirla();
  for (let deneme = 0; deneme < 2; deneme++) {
    try {
      const fd = openSync(KILIT, "wx");
      writeFileSync(fd, String(process.pid));
      closeSync(fd);
      return true;
    } catch (e) {
      if (e.code !== "EEXIST") throw e;
      const pid = Number(readFileSync(KILIT, "utf8")) || 0;
      if (pid && surecYasiyor(pid)) return false;
      try {
        unlinkSync(KILIT);
      } catch {
        /* başka süreç aldıysa ikinci denemede EEXIST */
      }
    }
  }
  return false;
}

export function kilitBirak() {
  try {
    if (Number(readFileSync(KILIT, "utf8")) === process.pid) unlinkSync(KILIT);
  } catch {
    /* yok */
  }
}

export function durumYaz(d) {
  dizinHazirla();
  const gecici = `${DURUM_DOSYASI}.${process.pid}`;
  writeFileSync(gecici, JSON.stringify(d));
  renameSync(gecici, DURUM_DOSYASI);
}

export function durumOku() {
  try {
    return JSON.parse(readFileSync(DURUM_DOSYASI, "utf8"));
  } catch {
    return null;
  }
}
