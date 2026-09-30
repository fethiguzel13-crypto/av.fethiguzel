/**
 * karararama.yargitay.gov.tr istemcisi — tarayıcı gibi davranır:
 * çerez kavanozu (F5 TS* + JSESSIONID geri gönderilir), zaman aşımı,
 * ağ hatasının gerçek nedenini (ECONNRESET, UND_ERR_CONNECT_TIMEOUT…) raporlar.
 *
 * Her yanıt tek bir "kind" ile sınıflanır; vali (governor) hızı buna göre ayarlar.
 */

import { stripHtml } from "../lib.mjs";

export const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36";

// Yalnız kesin işaretler: F5 ret sayfası ve sitenin kendi captcha bayrağı.
// Normal ana sayfa reCAPTCHA betiğini ve isDisplayCaptcha=false öğesini zaten içerir;
// "captcha" kelimesini aramak yanlış alarm verir (2026-09-26'da verdi).
const BLOCK_MARKERS = [
  /requested URL was rejected/i,
  /support ID is/i,
  /id=["']isDisplayCaptcha["'][^>]*>\s*true/i,
];

export function networkCode(e) {
  const c = e?.cause;
  return String(c?.code || c?.name || e?.code || e?.name || e?.message || "fetch failed");
}

export function parseRetryAfter(v, now = Date.now()) {
  if (!v) return 0;
  const s = Number(v);
  if (Number.isFinite(s)) return Math.max(0, s * 1000);
  const d = Date.parse(v);
  return Number.isFinite(d) ? Math.max(0, d - now) : 0;
}

export function isMinistryEndpointDownPage(raw) {
  if (!raw || typeof raw !== "string") return false;
  if (/mevcut de[gğ]ildir|böyle bir i[cç]erik/i.test(raw)) return true;
  return (
    /Adalet Bakanl[ıi][gğ][ıi] Bilgi [İI][sş]lem/i.test(raw) &&
    /<!doctype html/i.test(raw) &&
    !/"data"\s*:/.test(raw)
  );
}

function looksBlockedHtml(raw) {
  return BLOCK_MARKERS.some((re) => re.test(raw));
}

// Site captcha isteğini iki biçimde döndürür: {status, detailMessage} ya da
// {data:null, metadata:{FMTY:"ERROR", FMC:"ADALET_RUNTIME_EXCEPTION", FMTE:"...DisplayCaptcha"}}.
// İkincisi 2026-09-26'da 8/dk hızda görüldü; eski kod bunu "boş gövde" sanıyordu.
function captchaJson(j) {
  const m = j?.metadata || {};
  const msg = `${j?.status || ""} ${j?.detailMessage || ""} ${m.FMTE || ""} ${m.FMU || ""}`;
  return /captcha/i.test(msg);
}

/** Uygulama düzeyi hata (ör. "Belge alma isleminde hata olustu") — belgeye özgü. */
function appError(j) {
  const m = j?.metadata;
  if (j?.data != null || m?.FMTY !== "ERROR") return null;
  return String(m.FMTE || m.FMU || m.FMC || "uygulama hatası").replace(/^Runtime exception:\{0\}:/, "").slice(0, 120);
}

const sample = (raw) => String(raw || "").replace(/\s+/g, " ").slice(0, 200);

function classifyHttp(r) {
  if (r.status === 0) return { kind: "network", error: r.error };
  if (r.status === 429) return { kind: "throttled", error: "HTTP 429", retryAfterMs: r.retryAfterMs };
  if (r.status === 403) return { kind: "blocked", error: "HTTP 403", sample: sample(r.text) };
  if (r.status !== 200) return { kind: "server", error: `HTTP ${r.status}` };
  return null;
}

/** aramadetaylist yanıtı → { kind, total, items } */
export function classifySearchResponse(r) {
  const early = classifyHttp(r);
  if (early) return early;
  const raw = r.text || "";
  let j = null;
  try {
    j = JSON.parse(raw);
  } catch {
    if (looksBlockedHtml(raw)) return { kind: "blocked", error: "waf/captcha sayfası", sample: sample(raw) };
    return { kind: "server", error: "non-json", sample: sample(raw) };
  }
  if (captchaJson(j)) return { kind: "captcha", error: "captcha istendi", sample: sample(raw) };
  const rows = j?.data?.data;
  if (!Array.isArray(rows)) {
    const ae = appError(j);
    return { kind: "server", error: ae ? `uygulama: ${ae}` : "invalid-json-shape", sample: sample(raw) };
  }
  const items = rows.map((x) => ({
    id: String(x.id),
    daire: x.daire,
    esas: x.esasNo,
    karar: x.kararNo,
    tarih: x.kararTarihi,
    kunye: `Yargıtay ${x.daire}, E. ${x.esasNo}, K. ${x.kararNo}, T. ${x.kararTarihi}`,
  }));
  return { kind: "ok", total: Number(j.data.recordsTotal ?? items.length) || 0, items };
}

/** getDokuman yanıtı → { kind, text } */
export function classifyDocumentResponse(r) {
  if (r.status === 401 || r.status === 404 || r.status === 410) {
    return { kind: "permanent", error: `HTTP ${r.status}` };
  }
  const early = classifyHttp(r);
  if (early) return early;
  const raw = r.text || "";
  const looksJson = raw.trimStart().startsWith("{");
  if (!looksJson) {
    if (isMinistryEndpointDownPage(raw)) return { kind: "endpoint-down", error: "endpoint-down" };
    if (looksBlockedHtml(raw)) return { kind: "blocked", error: "waf/captcha sayfası", sample: sample(raw) };
    if (raw.length < 80) return { kind: "empty", error: "empty-or-short", sample: sample(raw) };
    return { kind: "server", error: "non-json-body", sample: sample(raw) };
  }
  let j = null;
  try {
    j = JSON.parse(raw);
  } catch {
    return { kind: "server", error: "bozuk-json", sample: sample(raw) };
  }
  if (captchaJson(j)) return { kind: "captcha", error: "captcha istendi", sample: sample(raw) };
  const ae = appError(j);
  if (ae) return { kind: "doc-error", error: ae };
  const text = stripHtml(j?.data || "");
  if (!text || text.length < 80) return { kind: "empty", error: "empty-or-short", sample: sample(raw) };
  return { kind: "ok", text };
}

export class YargitayClient {
  constructor(cfg = {}, deps = {}) {
    this.base = cfg.baseUrl || "https://karararama.yargitay.gov.tr";
    this.ua = cfg.userAgent || DEFAULT_UA;
    this.timeoutMs = cfg.requestTimeoutMs || 45_000;
    this.useCookies = cfg.cookieJar !== false;
    this.fetch = deps.fetch ?? globalThis.fetch;
    this.cookies = new Map();
    this.sessionOpenedAt = 0;
  }

  cookieHeader() {
    if (!this.useCookies || !this.cookies.size) return null;
    return [...this.cookies].map(([k, v]) => `${k}=${v}`).join("; ");
  }

  absorbCookies(resp) {
    if (!this.useCookies) return;
    const list =
      typeof resp.headers.getSetCookie === "function"
        ? resp.headers.getSetCookie()
        : [resp.headers.get("set-cookie")].filter(Boolean);
    for (const sc of list) {
      const pair = String(sc).split(";")[0];
      const i = pair.indexOf("=");
      if (i <= 0) continue;
      const name = pair.slice(0, i).trim();
      const value = pair.slice(i + 1).trim();
      const expired = /max-age=0\b|expires=thu, 01 jan 1970/i.test(sc);
      if (!value || expired) this.cookies.delete(name);
      else this.cookies.set(name, value);
    }
  }

  async request(path, { method = "GET", body = null, accept, json = false } = {}) {
    const headers = {
      Accept: accept || "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
      "User-Agent": this.ua,
      Referer: `${this.base}/`,
    };
    if (json) {
      headers["Content-Type"] = "application/json; charset=UTF-8";
      headers.Origin = this.base;
    }
    if (!accept) headers["X-Requested-With"] = "XMLHttpRequest";
    const cookie = this.cookieHeader();
    if (cookie) headers.Cookie = cookie;
    const t0 = Date.now();
    try {
      const resp = await this.fetch(`${this.base}${path}`, {
        method,
        headers,
        body,
        redirect: "follow",
        signal: AbortSignal.timeout(this.timeoutMs),
      });
      this.absorbCookies(resp);
      const text = await resp.text();
      return {
        status: resp.status,
        text,
        retryAfterMs: parseRetryAfter(resp.headers.get("retry-after")),
        ms: Date.now() - t0,
      };
    } catch (e) {
      return { status: 0, error: networkCode(e), ms: Date.now() - t0 };
    }
  }

  /** Ana sayfayı bir tarayıcı gibi açıp oturum çerezlerini alır. */
  async openSession() {
    const r = await this.request("/", {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    });
    const early = classifyHttp(r);
    if (early) return { ...early, ms: r.ms };
    if (/id=["']isDisplayCaptcha["'][^>]*>\s*true/i.test(r.text || "")) {
      return { kind: "captcha", error: "ana sayfa captcha istiyor", ms: r.ms };
    }
    if (looksBlockedHtml(r.text || "")) return { kind: "blocked", error: "ana sayfada engel", ms: r.ms };
    this.sessionOpenedAt = Date.now();
    return { kind: "ok", ms: r.ms, cookies: this.cookies.size };
  }

  async search({ from, to, pageSize = 100, pageNumber = 1, kurul = "", hukuk = "", ceza = "", keyword = "" }) {
    const body = {
      data: {
        arananKelime: keyword,
        esasYil: "",
        esasIlkSiraNo: "",
        esasSonSiraNo: "",
        kararYil: "",
        kararIlkSiraNo: "",
        kararSonSiraNo: "",
        baslangicTarihi: from,
        bitisTarihi: to,
        siralama: "3",
        siralamaDirection: "desc",
        birimYrgKurulDaire: kurul,
        birimYrgHukukDaire: hukuk,
        birimYrgCezaDaire: ceza,
        hukuk,
        pageSize,
        pageNumber,
      },
    };
    const r = await this.request("/aramadetaylist", { method: "POST", body: JSON.stringify(body), json: true });
    return { ...classifySearchResponse(r), ms: r.ms };
  }

  async document(id) {
    const r = await this.request(`/getDokuman?id=${encodeURIComponent(id)}`);
    return { ...classifyDocumentResponse(r), ms: r.ms };
  }
}

/** Yerel internet var mı? (siteyi değil tarafsız uç noktaları yoklar) */
export async function internetReachable(fetchImpl = globalThis.fetch) {
  const targets = [
    "https://www.msftconnecttest.com/connecttest.txt",
    "https://clients3.google.com/generate_204",
    "https://1.1.1.1/cdn-cgi/trace",
  ];
  for (const url of targets) {
    try {
      const r = await fetchImpl(url, { method: "GET", signal: AbortSignal.timeout(8_000) });
      await r.arrayBuffer().catch(() => null);
      if (r.status > 0 && r.status < 500) return true;
    } catch {
      /* sıradaki */
    }
  }
  return false;
}
