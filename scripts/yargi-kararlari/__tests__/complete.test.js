/**
 * Unit tests for harvest complete + daily budget helpers (shipped lib.mjs).
 *   node --test scripts/yargi-kararlari/__tests__/complete.test.js
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isHarvestComplete,
  isDailyBudgetExhausted,
  msUntilNextBudgetDay,
  buildYearWindows,
  rollDaily,
} from "../lib.mjs";

const cfg = {
  tiers: [
    { id: "yibk", priority: 0 },
    { id: "hgk", priority: 1 },
    { id: "hdbk", priority: 2 },
    { id: "borclar-daire", priority: 3 },
    { id: "medeni-daire", priority: 3 },
  ],
  rateLimit: { maxFullTextPerDay: 180, maxSearchCallsPerDay: 250 },
};

describe("isHarvestComplete", () => {
  it("false when queue has items even if tiers done", () => {
    const cursor = {
      tiers: {
        yibk: { done: true },
        hgk: { done: true },
        hdbk: { done: true },
        "borclar-daire": { done: true },
        "medeni-daire": { done: true },
      },
    };
    const r = isHarvestComplete({
      cfg,
      cursor,
      queue: [{ id: "1" }],
    });
    assert.equal(r.complete, false);
    assert.equal(r.reason, "queue-not-empty");
    assert.equal(r.queueLen, 1);
  });

  it("false when queue empty but a tier unfinished", () => {
    const cursor = {
      tiers: {
        yibk: { done: true },
        hgk: { done: false },
      },
    };
    const r = isHarvestComplete({ cfg, cursor, queue: [] });
    assert.equal(r.complete, false);
    assert.equal(r.reason, "tiers-unfinished");
    assert.ok(r.unfinished.includes("hgk"));
  });

  it("true only when all tiers done and queue empty", () => {
    const cursor = {
      tiers: Object.fromEntries(cfg.tiers.map((t) => [t.id, { done: true }])),
    };
    const r = isHarvestComplete({ cfg, cursor, queue: [] });
    assert.equal(r.complete, true);
    assert.equal(r.reason, "all-tiers-done-queue-empty");
    assert.equal(r.tiersDone, 5);
  });
});

describe("isDailyBudgetExhausted", () => {
  it("not exhausted on different calendar day", () => {
    const r = isDailyBudgetExhausted(
      { date: "1999-01-01", fullText: 999, searchCalls: 999 },
      cfg.rateLimit,
      new Date("2026-08-08T12:00:00.000Z")
    );
    assert.equal(r.exhausted, false);
  });

  it("exhausted when fullText hits cap on today", () => {
    const today = new Date().toISOString().slice(0, 10);
    const r = isDailyBudgetExhausted(
      { date: today, fullText: 180, searchCalls: 10 },
      cfg.rateLimit,
      new Date()
    );
    assert.equal(r.exhausted, true);
    assert.equal(r.fullText, true);
  });

  it("not exhausted when only search is high but fullText below cap", () => {
    const today = new Date().toISOString().slice(0, 10);
    const r = isDailyBudgetExhausted(
      { date: today, fullText: 50, searchCalls: 250 },
      cfg.rateLimit,
      new Date()
    );
    assert.equal(r.exhausted, false);
    assert.equal(r.search, true);
  });
});

describe("msUntilNextBudgetDay", () => {
  it("honors overrideMs for tests", () => {
    assert.equal(msUntilNextBudgetDay(new Date(), 0), 0);
    assert.equal(msUntilNextBudgetDay(new Date(), 5000), 5000);
  });

  it("returns positive wait without override", () => {
    const ms = msUntilNextBudgetDay(new Date("2026-08-08T15:00:00.000Z"));
    assert.ok(ms >= 1000);
    assert.ok(ms <= 48 * 3600 * 1000);
  });

  it("aligns wait with UTC day key so rollDaily resets after wait (TRT-safe)", async () => {
    const { todayKey, rollDaily, budgetWouldResetAfterWait } = await import("../lib.mjs");
    // 22:00 UTC = 01:00 TRT next calendar day locally — local midnight would be wrong
    const now = new Date("2026-08-08T22:00:00.000Z");
    assert.equal(todayKey(now), "2026-08-08");
    const wait = msUntilNextBudgetDay(now);
    const after = new Date(now.getTime() + wait);
    assert.equal(todayKey(after), "2026-08-09");
    const daily = { date: "2026-08-08", fullText: 180, searchCalls: 0 };
    const rl = { maxFullTextPerDay: 180, maxSearchCallsPerDay: 250 };
    assert.equal(isDailyBudgetExhausted(daily, rl, now).exhausted, true);
    assert.equal(budgetWouldResetAfterWait(daily, rl, now, wait), true);
    const rolled = rollDaily(daily, after);
    assert.equal(rolled.date, "2026-08-09");
    assert.equal(rolled.fullText, 0);
    assert.equal(isDailyBudgetExhausted(rolled, rl, after).exhausted, false);
  });

  it("UTC wait is shorter than local-midnight trap after UTC evening", () => {
    const now = new Date("2026-08-08T22:30:00.000Z"); // still 2026-08-08 UTC
    const utcWait = msUntilNextBudgetDay(now);
    // Fake local-midnight style (bug): setHours(24) in local TZ — compare only that UTC wait < 3h
    // After 22:30 UTC, next UTC midnight is ~1.5h, not ~24h
    assert.ok(utcWait < 3 * 3600 * 1000, `utcWait=${utcWait}`);
    assert.ok(utcWait > 60 * 1000);
  });

  it("shipped msUntilNextBudgetDay derives UTC wait from todayKey + Date.UTC (never local midnight)", async () => {
    const { readFileSync } = await import("fs");
    const { fileURLToPath } = await import("url");
    const { dirname, join } = await import("path");
    const dir = dirname(fileURLToPath(import.meta.url));
    const src = readFileSync(join(dir, "..", "lib.mjs"), "utf8");
    const start = src.indexOf("export function msUntilNextBudgetDay");
    assert.ok(start >= 0, "msUntilNextBudgetDay missing");
    const end = src.indexOf("export function budgetWouldResetAfterWait", start);
    const body = src.slice(start, end > start ? end : start + 800);
    // Single source of truth with daily day keys (UTC YYYY-MM-DD)
    assert.match(body, /todayKey\s*\(/);
    assert.match(body, /Date\.UTC\s*\(/);
    assert.doesNotMatch(body, /setHours\s*\(/);
    // Classic TRT trap: 20:00 UTC = 23:00 TRT — local midnight still same UTC day
    const now = new Date("2026-08-08T20:00:00.000Z");
    const wait = msUntilNextBudgetDay(now);
    const after = new Date(now.getTime() + wait);
    assert.equal(after.toISOString().slice(0, 10), "2026-08-09");
    // Local-midnight style would leave exhausted=true on same UTC day
    const loc = new Date(now.getTime());
    loc.setHours(24, 0, 30, 0);
    const afterLocal = new Date(now.getTime() + Math.max(1000, loc - now));
    assert.equal(afterLocal.toISOString().slice(0, 10), "2026-08-08");
    const daily = { date: "2026-08-08", fullText: 400, searchCalls: 0 };
    const rl = { maxFullTextPerDay: 400, maxSearchCallsPerDay: 400 };
    assert.equal(isDailyBudgetExhausted(daily, rl, now).exhausted, true);
    assert.equal(isDailyBudgetExhausted(rollDaily(daily, after), rl, after).exhausted, false);
    assert.equal(isDailyBudgetExhausted(rollDaily(daily, afterLocal), rl, afterLocal).exhausted, true);
  });
});

describe("buildYearWindows", () => {
  it("covers range without gaps", () => {
    const w = buildYearWindows(2010, 2015, 2);
    assert.deepEqual(
      w.map((x) => x.label),
      ["2010-2011", "2012-2013", "2014-2015"]
    );
  });
});
