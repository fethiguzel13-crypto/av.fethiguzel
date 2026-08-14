const BASE = "https://karararama.yargitay.gov.tr";

async function search(opts) {
  const body = {
    data: {
      arananKelime: opts.q || "",
      esasYil: "",
      esasIlkSiraNo: "",
      esasSonSiraNo: "",
      kararYil: "",
      kararIlkSiraNo: "",
      kararSonSiraNo: "",
      baslangicTarihi: opts.from || "01.01.1950",
      bitisTarihi: opts.to || "08.08.2026",
      siralama: "3",
      siralamaDirection: "desc",
      birimYrgKurulDaire: opts.kurul || "",
      birimYrgHukukDaire: opts.hukuk || "",
      birimYrgCezaDaire: opts.ceza || "",
      hukuk: opts.hukuk || "",
      pageSize: opts.size || 100,
      pageNumber: opts.page || 1,
    },
  };
  const r = await fetch(`${BASE}/aramadetaylist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Origin: BASE,
      Referer: `${BASE}/`,
    },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => null);
  return {
    status: r.status,
    total: j?.data?.recordsTotal ?? null,
    items: j?.data?.data || [],
  };
}

const units = [
  { kurul: "Büyük Genel Kurulu" },
  { kurul: "Hukuk Genel Kurulu" },
  { kurul: "Ceza Genel Kurulu" },
  { kurul: "Hukuk Daireleri Başkanlar Kurulu" },
  { kurul: "Ceza Daireleri Başkanlar Kurulu" },
  { hukuk: "1. Hukuk Dairesi" },
  { hukuk: "2. Hukuk Dairesi" },
  { hukuk: "3. Hukuk Dairesi" },
  { hukuk: "4. Hukuk Dairesi" },
  { hukuk: "5. Hukuk Dairesi" },
  { hukuk: "6. Hukuk Dairesi" },
  { hukuk: "7. Hukuk Dairesi" },
  { hukuk: "8. Hukuk Dairesi" },
  { hukuk: "9. Hukuk Dairesi" },
  { hukuk: "11. Hukuk Dairesi" },
  { hukuk: "12. Hukuk Dairesi" },
  { hukuk: "13. Hukuk Dairesi" },
  { hukuk: "14. Hukuk Dairesi" },
  { hukuk: "15. Hukuk Dairesi" },
];

for (const u of units) {
  const res = await search({ ...u, size: 3 });
  const label = u.kurul || u.hukuk;
  console.log(label, "→", res.total, res.items[0]?.daire || "");
  await new Promise((r) => setTimeout(r, 600));
}

// pageSize limit test
const p1 = await search({ kurul: "Hukuk Genel Kurulu", size: 100, page: 1 });
const p2 = await search({ kurul: "Hukuk Genel Kurulu", size: 100, page: 2 });
console.log("\nHGK page1", p1.items.length, "page2", p2.items.length, "ids equal?", p1.items[0]?.id === p2.items[0]?.id);
console.log("BGK full page", (await search({ kurul: "Büyük Genel Kurulu", size: 100 })).items.length);
