/**
 * Uyarlamalı istek valisi — karararama.yargitay.gov.tr'ye giden HER istek
 * (oturum, arama, tam metin) önce buradan slot alır. Böylece kaç işçi çalışırsa
 * çalışsın siteye giden toplam hız tek elden yönetilir.
 *
 * - AIMD (TCP tıkanıklık denetimi gibi): sorunsuz akışta hızı yavaşça artırır,
 *   429 gelince çarparak düşürür ve bekler (Retry-After varsa ona uyar).
 * - 429 yağmuru: kısa sürede birden çok 429 → uzun mola + geçici hız tavanı.
 * - Devre kesici: art arda ağ hatasında siteyi dövmez; üstel geri çekilir,
 *   sonra tek bir "sonda" istekle yoklar.
 * - Mesai tavanı: TR hafta içi mesai saatlerinde daha düşük azami hız.
 *
 * Saat, uyku ve rastgelelik enjekte edilebilir; testler sahte saatle koşar.
 */

export const RATE_DEFAULTS = {
  startPerMin: 6.5,
  minPerMin: 2,
  maxPerMin: 8,
  peak: { enabled: true, days: [1, 2, 3, 4, 5], fromHour: 9, toHour: 18, maxPerMin: 7 },
  increaseStepPerMin: 0.5,
  increaseEvery: 40,
  increaseQuietMs: 8 * 60_000,
  decreaseFactor: 0.7,
  serverFactor: 0.85,
  resumeFactor: 0.7,
  jitter: [0.6, 1.4],
  cooldown429Ms: [45_000, 90_000],
  maxRetryAfterMs: 15 * 60_000,
  burst429: { count: 3, windowMs: 10 * 60_000, pauseMs: 10 * 60_000, capHoldMs: 60 * 60_000 },
  serverErrorPauseMs: [20_000, 60_000],
  endpointDown: { baseMs: 3 * 60_000, maxMs: 30 * 60_000 },
  blockedPauseMs: [30 * 60_000, 45 * 60_000],
  // Captcha = sitenin "bot musun?" sorusu. Oturumu değiştirip atlatmaya çalışılmaz;
  // yavaşlanır ve beklenir. 30 dk içinde ikinci kez gelirse uzun mola (blocked).
  captcha: { factor: 0.5, pauseMs: [5 * 60_000, 10 * 60_000], capHoldMs: 2 * 3_600_000, windowMs: 30 * 60_000, escalateCount: 2 },
  network: { failThreshold: 3, backoffBaseMs: 60_000, backoffMaxMs: 30 * 60_000, offlineRecheckMs: 60_000 },
  emptyStreak: { count: 4, pauseMs: [60_000, 120_000] },
};

export class StopError extends Error {
  constructor() {
    super("vali durduruldu");
    this.name = "StopError";
  }
}

/** Türkiye saati (UTC+3, 2016'dan beri yaz saati yok). */
export function trClock(ms) {
  const d = new Date(ms + 3 * 3_600_000);
  return { hour: d.getUTCHours(), day: d.getUTCDay() };
}

function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

export function mergeRate(cfg = {}) {
  const out = structuredClone(RATE_DEFAULTS);
  for (const [k, v] of Object.entries(cfg || {})) {
    if (isPlainObject(v) && isPlainObject(out[k])) out[k] = { ...out[k], ...v };
    else if (v !== undefined) out[k] = v;
  }
  return out;
}

const fmt = (n) => (Math.round(n * 10) / 10).toFixed(1);

export class Governor {
  constructor(rateCfg = {}, deps = {}) {
    this.now = deps.now ?? (() => Date.now());
    this.sleep = deps.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
    this.random = deps.random ?? Math.random;
    this.log = deps.log ?? (() => {});
    this.cfg = mergeRate(rateCfg);
    this.rate = this.cfg.startPerMin;
    this.nextSlotAt = 0;
    this.pausedUntil = 0;
    this.pauseReason = "";
    this.successStreak = 0;
    this.last429At = -Infinity;
    this.recent429 = [];
    this.capPerMin = Infinity;
    this.capUntil = 0;
    this.netFailStreak = 0;
    this.emptyStreak = 0;
    this.downStreak = 0;
    this.recentCaptcha = [];
    this.lastCaptchaAt = -Infinity;
    this.circuit = { state: "closed", level: 0, probeInFlight: false };
    this.stopped = false;
  }

  updateConfig(rateCfg) {
    this.cfg = mergeRate(rateCfg);
    this.rate = Math.min(Math.max(this.rate, this.cfg.minPerMin), this.ceiling());
  }

  stop() {
    this.stopped = true;
  }

  randIn([lo, hi]) {
    return Math.round(lo + this.random() * (hi - lo));
  }

  isPeak(at = this.now()) {
    const p = this.cfg.peak;
    if (!p?.enabled) return false;
    const { hour, day } = trClock(at);
    return p.days.includes(day) && hour >= p.fromHour && hour < p.toHour;
  }

  ceiling(at = this.now()) {
    let c = this.cfg.maxPerMin;
    if (this.isPeak(at)) c = Math.min(c, this.cfg.peak.maxPerMin);
    if (at < this.capUntil) c = Math.min(c, this.capPerMin);
    if (this.learned && at < this.learned.until) c = Math.min(c, this.learned.perMin);
    return Math.max(this.cfg.minPerMin, c);
  }

  /** Öğrenilmiş tavan (captcha geldiği hızın altı) — süreç yeniden başlasa da korunur. */
  learnedState() {
    return this.learned ? { ...this.learned } : null;
  }

  restoreLearned(s, at = this.now()) {
    if (s && Number.isFinite(s.perMin) && Number.isFinite(s.until) && s.until > at) this.learned = { ...s };
  }

  effectiveRate(at = this.now()) {
    return Math.min(this.rate, this.ceiling(at));
  }

  pause(ms, reason) {
    const until = this.now() + ms;
    if (until > this.pausedUntil) {
      this.pausedUntil = until;
      this.pauseReason = reason;
    }
    this.log(`[vali] mola ${(ms / 1000).toFixed(0)} sn — ${reason}`);
  }

  /** Bir istek slotu bekler. Devre yarı açıkken yalnız tek sonda isteğine izin verir. */
  async acquire() {
    for (;;) {
      if (this.stopped) throw new StopError();
      const now = this.now();
      const c = this.circuit;
      if (c.state === "open" && now >= this.pausedUntil) {
        c.state = "half-open";
        c.probeInFlight = false;
      }
      const probeBusy = c.state === "half-open" && c.probeInFlight;
      const gate = Math.max(this.nextSlotAt, this.pausedUntil);
      if (!probeBusy && now >= gate) {
        const probe = c.state === "half-open";
        if (probe) c.probeInFlight = true;
        const interval = 60_000 / this.effectiveRate(now);
        const [jl, jh] = this.cfg.jitter;
        this.nextSlotAt = now + interval * (jl + this.random() * (jh - jl));
        return { probe };
      }
      const wait = probeBusy ? 1_000 : Math.min(Math.max(gate - now, 50), 5_000);
      await this.sleep(wait);
    }
  }

  closeCircuit() {
    const c = this.circuit;
    if (c.state === "closed") return;
    c.state = "closed";
    c.level = 0;
    c.probeInFlight = false;
    this.pausedUntil = 0;
    this.rate = Math.max(this.cfg.minPerMin, this.rate * this.cfg.resumeFactor);
    this.log(`[vali] devre kapandı — site yanıt veriyor; hız ${fmt(this.rate)}/dk`);
  }

  /**
   * Sonucu bildir. kind: ok | permanent | throttled | blocked | server |
   * endpoint-down | empty | network | offline
   */
  report(kind, info = {}) {
    const now = this.now();
    const c = this.circuit;
    // Sitenin HTTP yanıtı (hata kodu bile olsa) hattın açık olduğunu gösterir.
    if (kind !== "network" && kind !== "offline") {
      this.netFailStreak = 0;
      this.closeCircuit();
    }

    switch (kind) {
      case "captcha": {
        this.successStreak = 0;
        this.last429At = now;
        // Aynı patlamada (işteki ikinci istek) gelen yanıt ayrıca sayılmaz.
        if (now - this.lastCaptchaAt < 10_000) break;
        this.lastCaptchaAt = now;
        const cc = this.cfg.captcha;
        // Mandal: captcha geldiği hızın %85'i, 24 saat tavan olur; her yeni captcha daha aşağı çeker.
        // (2026-09-30: 5,5–8/dk'da 4 günde 30 captcha — hız her 2 saatte tekrar tırmanıp çarpıyordu.)
        const hit = this.effectiveRate(now);
        const perMin = Math.max(this.cfg.minPerMin, Math.min(this.learned?.until > now ? this.learned.perMin : Infinity, hit) * (cc.learnFactor ?? 0.85));
        this.learned = { perMin: Math.round(perMin * 10) / 10, until: now + (cc.learnHoldMs ?? 24 * 3_600_000) };
        this.recentCaptcha = this.recentCaptcha.filter((t) => now - t < cc.windowMs);
        this.recentCaptcha.push(now);
        if (this.recentCaptcha.length >= cc.escalateCount) {
          this.recentCaptcha = [];
          this.rate = this.cfg.minPerMin;
          this.capPerMin = this.cfg.minPerMin * 2;
          this.capUntil = now + 3 * 3_600_000;
          this.pause(this.randIn(this.cfg.blockedPauseMs), "captcha tekrarladı — uzun mola, 3 saat düşük tavan");
        } else {
          this.rate = Math.max(this.cfg.minPerMin, this.rate * cc.factor);
          this.capPerMin = this.rate;
          this.capUntil = now + cc.capHoldMs;
          this.pause(this.randIn(cc.pauseMs), `captcha istendi → hız ${fmt(this.rate)}/dk, ${cc.capHoldMs / 3_600_000} saat tavan`);
        }
        break;
      }
      case "ok":
      case "permanent":
      case "doc-error": {
        this.emptyStreak = 0;
        this.downStreak = 0;
        this.successStreak++;
        if (
          this.successStreak >= this.cfg.increaseEvery &&
          now - this.last429At >= this.cfg.increaseQuietMs
        ) {
          const ceil = this.ceiling(now);
          if (this.rate < ceil) {
            this.rate = Math.min(ceil, this.rate + this.cfg.increaseStepPerMin);
            this.log(`[vali] akış temiz → hız ${fmt(this.rate)}/dk (tavan ${fmt(ceil)})`);
          }
          this.successStreak = 0;
        }
        break;
      }
      case "throttled": {
        this.successStreak = 0;
        this.last429At = now;
        this.recent429 = this.recent429.filter((t) => now - t < this.cfg.burst429.windowMs);
        this.recent429.push(now);
        this.rate = Math.max(this.cfg.minPerMin, this.rate * this.cfg.decreaseFactor);
        const ra = Number(info.retryAfterMs) || 0;
        let ms = ra > 0 ? Math.min(ra, this.cfg.maxRetryAfterMs) : this.randIn(this.cfg.cooldown429Ms);
        let reason = `429 (yavaşla) → hız ${fmt(this.rate)}/dk`;
        if (this.recent429.length >= this.cfg.burst429.count) {
          ms = Math.max(ms, this.cfg.burst429.pauseMs);
          this.capPerMin = this.rate;
          this.capUntil = now + this.cfg.burst429.capHoldMs;
          this.recent429 = [];
          reason = `429 yağmuru → hız ${fmt(this.rate)}/dk, ${this.cfg.burst429.capHoldMs / 60_000} dk tavan`;
        }
        this.pause(ms, reason);
        break;
      }
      case "blocked": {
        this.successStreak = 0;
        this.rate = this.cfg.minPerMin;
        this.capPerMin = this.cfg.minPerMin * 2;
        this.capUntil = now + 3 * 3_600_000;
        this.pause(this.randIn(this.cfg.blockedPauseMs), `engel/captcha işareti (${info.error || "?"})`);
        break;
      }
      case "server": {
        this.successStreak = 0;
        this.rate = Math.max(this.cfg.minPerMin, this.rate * this.cfg.serverFactor);
        this.pause(this.randIn(this.cfg.serverErrorPauseMs), `sunucu hatası ${info.error || ""}`.trim());
        break;
      }
      case "endpoint-down": {
        this.downStreak++;
        const ms = Math.min(
          this.cfg.endpointDown.maxMs,
          this.cfg.endpointDown.baseMs * 2 ** (this.downStreak - 1)
        );
        this.pause(ms, "getDokuman bakanlık sayfası (tam metin servisi kapalı)");
        break;
      }
      case "empty": {
        this.emptyStreak++;
        if (this.emptyStreak >= this.cfg.emptyStreak.count) {
          this.emptyStreak = 0;
          this.pause(this.randIn(this.cfg.emptyStreak.pauseMs), "art arda boş gövde");
        }
        break;
      }
      case "network": {
        this.successStreak = 0;
        this.netFailStreak++;
        const n = this.cfg.network;
        if (c.state === "open") break; // zaten beklemede; uçuştaki eski istek
        if (c.state === "half-open" || this.netFailStreak >= n.failThreshold) {
          c.level = c.state === "half-open" ? c.level + 1 : Math.max(1, c.level);
          c.state = "open";
          c.probeInFlight = false;
          const base = Math.min(n.backoffMaxMs, n.backoffBaseMs * 2 ** (c.level - 1));
          const ms = Math.round(base * (0.8 + this.random() * 0.4));
          this.pause(ms, `ağ hatası ×${this.netFailStreak} (${info.error || "?"}) — devre açık, seviye ${c.level}`);
        }
        break;
      }
      case "offline": {
        c.state = "open";
        c.probeInFlight = false;
        this.pause(this.cfg.network.offlineRecheckMs, "yerel internet bağlantısı yok");
        break;
      }
      default:
        break;
    }
  }

  snapshot(at = this.now()) {
    return {
      ratePerMin: Number(fmt(this.effectiveRate(at))),
      targetPerMin: Number(fmt(this.rate)),
      ceilingPerMin: Number(fmt(this.ceiling(at))),
      peak: this.isPeak(at),
      circuit: this.circuit.state,
      circuitLevel: this.circuit.level,
      pausedUntil: this.pausedUntil > at ? new Date(this.pausedUntil).toISOString() : null,
      pauseReason: this.pausedUntil > at ? this.pauseReason : null,
      learned: this.learned && this.learned.until > at ? this.learned : null,
    };
  }
}
