/**
 * rotaIsleyicisiMi (G00).  node --test lib/__tests__/rota-isleyici.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { rotaIsleyicisiMi } from "../rota-isleyici.ts";

describe("rotaIsleyicisiMi", () => {
  it("madde sayfaları (iki parçalı /mevzuat yolu) rota işleyicisidir", () => {
    for (const h of ["/mevzuat/tbk/madde-13", "/mevzuat/kvk/madde-5b", "/mevzuat/tmk/gecici-madde-1", "/mevzuat/tbk/madde-13/", "/mevzuat/tbk/madde-13#serh", "/mevzuat/tbk/madde-13?x=1"]) {
      assert.equal(rotaIsleyicisiMi(h), true, h);
    }
  });

  it("kanun ana sayfası, mevzuat listesi ve diğer sayfalar değildir", () => {
    for (const h of ["/mevzuat", "/mevzuat/", "/mevzuat/tbk", "/mevzuat/tbk/", "/ara?q=tbk", "/bilgi/kira", "/mevzuat/tbk/madde-13/ek", "https://www.avfethiguzel.com/mevzuat/tbk/madde-13"]) {
      assert.equal(rotaIsleyicisiMi(h), false, h);
    }
  });
});
