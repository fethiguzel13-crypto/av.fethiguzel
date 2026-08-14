# Vatandaş rehberi iskeletleri

- `parts/*.json` — elde yazılmış adım / belge / not (151 rehber)
- `all.json` — `node scripts/merge-vatandas-guides.mjs` ile birleşir
- `infer.ts` — kalan 403 rehber için sluğa özel iskelet
- `load.ts` — önce all.json, yoksa infer

Yeni elde yazım: `parts/` altına JSON ekle, merge’i çalıştır.
