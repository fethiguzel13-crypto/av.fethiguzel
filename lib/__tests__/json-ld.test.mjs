/**
 * jsonLdHtml (G03).  node --test lib/__tests__/json-ld.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { jsonLdHtml } from "../json-ld.ts";

describe("jsonLdHtml", () => {
  it("içerikteki </script> betik bloğunu kapatamaz", () => {
    const out = jsonLdHtml({ name: 'Karar </script><script>alert(1)</script>' });
    assert.ok(!out.includes("</script>"));
    assert.ok(!out.includes("<"));
  });

  it("JSON anlamı değişmez (geri ayrıştırınca aynı nesne)", () => {
    const obj = { a: "x < y & z > w", b: "satır" + String.fromCharCode(0x2028) + "ayırıcı", c: [1, { d: "Yargıtay 3. HD" }] };
    assert.deepEqual(JSON.parse(jsonLdHtml(obj)), obj);
  });
});
