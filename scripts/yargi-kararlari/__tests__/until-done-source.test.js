/**
 * Structural checks that continuous runner ships the required control flow.
 *   node --test scripts/yargi-kararlari/__tests__/until-done-source.test.js
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { isHarvestComplete, isDailyBudgetExhausted, msUntilNextBudgetDay } from "../lib.mjs";

const dir = dirname(fileURLToPath(import.meta.url));
const untilDoneSrc = readFileSync(join(dir, "..", "until-done.mjs"), "utf8");
const archiveSrc = readFileSync(join(dir, "..", "archive-yargitay.mjs"), "utf8");

describe("until-done.mjs shipped control flow", () => {
  it("loops until complete and waits on daily budget", () => {
    assert.match(untilDoneSrc, /while\s*\(\s*true\s*\)/);
    assert.match(untilDoneSrc, /HARVEST COMPLETE/);
    assert.match(untilDoneSrc, /budget exhausted/i);
    assert.match(untilDoneSrc, /msUntilNextBudgetDay/);
    assert.match(untilDoneSrc, /budget wait finished/i);
    assert.match(untilDoneSrc, /UTC budget rollover|UTC day=/i);
    assert.match(untilDoneSrc, /archive-yargitay\.mjs/);
    assert.match(untilDoneSrc, /download-only/);
    assert.match(untilDoneSrc, /needsHighPrioritySeed|high-priority seed/i);
  });

  it("status path reports COMPLETE via isHarvestComplete", () => {
    assert.match(archiveSrc, /isHarvestComplete/);
    assert.match(archiveSrc, /HARVEST COMPLETE|COMPLETE:/);
  });
});

describe("budget wait uses real helper", () => {
  it("msUntilNextBudgetDay integrates with exhausted daily flag", () => {
    const today = new Date().toISOString().slice(0, 10);
    const budget = isDailyBudgetExhausted(
      { date: today, fullText: 180, searchCalls: 0 },
      { maxFullTextPerDay: 180, maxSearchCallsPerDay: 250 }
    );
    assert.equal(budget.exhausted, true);
    const wait = msUntilNextBudgetDay(new Date(), 2500);
    assert.equal(wait, 2500);
  });

  it("complete false while queue non-empty even if yibk done", () => {
    const r = isHarvestComplete({
      cfg: { tiers: [{ id: "yibk" }, { id: "hgk" }] },
      cursor: { tiers: { yibk: { done: true }, hgk: { done: true } } },
      queue: [{ id: "x" }],
    });
    assert.equal(r.complete, false);
  });
});
