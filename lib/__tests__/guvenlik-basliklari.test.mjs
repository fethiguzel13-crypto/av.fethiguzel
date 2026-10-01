/**
 * Güvenlik başlıkları (G03).  node --test lib/__tests__/guvenlik-basliklari.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildCsp, cspDirectives, securityHeaders } from "../guvenlik-basliklari.mjs";

describe("CSP", () => {
  const prod = cspDirectives();

  it("tıklama korsanlığı, eklenti, base ve form sızdırmasına kapalı", () => {
    assert.deepEqual(prod["object-src"], ["'none'"]);
    assert.deepEqual(prod["base-uri"], ["'self'"]);
    assert.deepEqual(prod["frame-ancestors"], ["'self'"]);
    assert.deepEqual(prod["form-action"], ["'self'", "https://*.iyzipay.com"]);
  });

  it("üretimde eval yok; dev'de yalnız React yenilemesi için var", () => {
    assert.ok(!prod["script-src"].includes("'unsafe-eval'"));
    assert.ok(cspDirectives({ dev: true })["script-src"].includes("'unsafe-eval'"));
  });

  it("betik kaynakları yalnız site + iyzico (joker * yok)", () => {
    assert.ok(prod["script-src"].every((s) => s !== "*" && !/^https?:$/.test(s)));
    assert.deepEqual(
      prod["script-src"].filter((s) => s.startsWith("https://")),
      ["https://*.iyzipay.com"]
    );
  });

  it("sitenin kullandığı dış kaynaklar izinli", () => {
    assert.ok(prod["font-src"].includes("https://fonts.gstatic.com"));
    assert.ok(prod["style-src"].includes("https://fonts.googleapis.com"));
    assert.ok(prod["img-src"].includes("https://images.unsplash.com"));
    assert.ok(prod["connect-src"].includes("https://cdn.jsdelivr.net"));
    assert.ok(prod["connect-src"].includes("https://raw.githubusercontent.com"));
    assert.ok(prod["frame-src"].includes("https://www.google.com"));
    assert.ok(prod["connect-src"].includes("https://www.avfethiguzel.com"));
    assert.ok(prod["connect-src"].includes("https://avfethiguzel.com"));
  });

  it("başlık dizgisi biçimi", () => {
    const s = buildCsp();
    assert.match(s, /^default-src 'self'; script-src /);
    assert.match(s, /; upgrade-insecure-requests$/);
    assert.ok(!s.includes(";;"));
  });

  it("başlık listesi CSP + HSTS + nosniff içerir, tekrar yok", () => {
    const h = securityHeaders();
    const keys = h.map((x) => x.key);
    assert.equal(new Set(keys).size, keys.length);
    for (const k of ["Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options"]) {
      assert.ok(keys.includes(k), k);
    }
  });
});
