/**
 * Yazar kimliği tek kaynaktan (Aylık plan G09). Person JSON-LD 17 yerde elle yazılıyordu ve kopyaların hiçbiri kök
 * düğümün `@id`'sini taşımıyordu; arama motoru aynı kişiyi birden çok varlık olarak görebiliyordu.
 *   node --test lib/__tests__/yazar.test.mjs
 */
import { register } from "node:module";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

register("../uyelik/__tests__/ts-hooks.mjs", import.meta.url);

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const yukle = (yol) => import(pathToFileURL(join(KOK, yol)).href);

function kaynaklar(dizin) {
  const sonuc = [];
  for (const o of readdirSync(join(KOK, dizin), { withFileTypes: true })) {
    const yol = `${dizin}/${o.name}`;
    if (o.isDirectory()) sonuc.push(...kaynaklar(yol));
    else if (/\.(ts|tsx)$/.test(o.name)) sonuc.push(yol);
  }
  return sonuc;
}

describe("yazar kimliği", () => {
  it("yazarRef kök Person düğümüne @id ile bağlanır", async () => {
    const { yazarRef, YAZAR_ID } = await yukle("lib/yazar.ts");
    const { PROFILE, SITE_URL } = await yukle("lib/profile.ts");
    assert.equal(YAZAR_ID, `${SITE_URL}/#person`);
    assert.deepEqual(yazarRef(), {
      "@type": "Person",
      "@id": YAZAR_ID,
      name: PROFILE.name,
      url: `${SITE_URL}/avukat-fethi-guzel`,
    });
  });

  it("tam Person düğümü aynı @id'yi taşır ve kimliği PROFILE'dan alır", async () => {
    const { yazarPersonDugumu, YAZAR_ID } = await yukle("lib/yazar.ts");
    const { PROFILE, SITE_URL, SOCIAL_SAME_AS } = await yukle("lib/profile.ts");
    const d = yazarPersonDugumu();
    assert.equal(d["@id"], YAZAR_ID);
    assert.equal(d.name, PROFILE.name);
    assert.equal(d.jobTitle, PROFILE.jobTitle);
    assert.equal(d.email, PROFILE.email);
    assert.equal(d.image, `${SITE_URL}${PROFILE.photo}`);
    assert.equal(d.address.streetAddress, PROFILE.office.street);
    assert.deepEqual(d.sameAs, [...SOCIAL_SAME_AS]);
  });

  it("app ve components altında Person elle yazılmaz (yazarRef / yazarPersonDugumu kullanılır)", () => {
    const elle = [...kaynaklar("app"), ...kaynaklar("components")].filter((f) =>
      /["']@type["']\s*:\s*["']Person["']/.test(readFileSync(join(KOK, f), "utf8")),
    );
    assert.deepEqual(elle, []);
  });
});
