/**
 * Vercel derleme atlama kararı: günlük içtihat commit'i yalnız pazartesi derlenir.
 *   node --test lib/__tests__/vercel-derleme-atla.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { derlensinMi } from "../../scripts/vercel-derleme-atla.mjs";

const PAZARTESI = new Date("2026-11-09T06:05:00Z");
const SALI = new Date("2026-11-10T06:05:00Z");

describe("derlensinMi", () => {
  it("bot commit'i pazartesi derlenir, diğer günler atlanır", () => {
    assert.equal(derlensinMi("chore: günlük içtihat 2026-11-09", PAZARTESI), true);
    assert.equal(derlensinMi("chore: günlük içtihat 2026-11-10", SALI), false);
  });
  it("gün İstanbul saatine göre hesaplanır (pazar 22:30 UTC = pazartesi 01:30)", () => {
    assert.equal(derlensinMi("chore: günlük içtihat x", new Date("2026-11-08T22:30:00Z")), true);
  });
  it("bot dışındaki commit her gün derlenir; boş mesaj da derlenir", () => {
    assert.equal(derlensinMi("fix: telefon numarası", SALI), true);
    assert.equal(derlensinMi("", SALI), true);
    assert.equal(derlensinMi(undefined, SALI), true);
  });
});
