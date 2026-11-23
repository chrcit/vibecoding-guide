# Fact-check

Every dated fact the site states lives in `src/data/*.ts` with its source, the date it was verified and a status. Pages read them through `<Fact id="…" />` and `<Verified>` in `src/components/data/`.

Two views are generated from the same files:

- `/sources/` on the site (`src/pages/sources/index.astro`), with an anchor per fact.
- [`guides/fact-check.md`](../guides/fact-check.md), so GitHub readers get the table too. Regenerate it with `node scripts/check-facts.mjs --write`; the build fails when it is stale.

How to update a fact, add a model or refresh benchmark numbers: [`UPDATE.md`](../UPDATE.md).
