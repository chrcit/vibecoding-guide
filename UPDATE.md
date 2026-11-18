# Updating the facts

Every price, limit, score and product claim lives in `site/src/data/`. Each entry has a value, a one-sentence claim, the URL that says it, the date you read that URL and a status:

```ts
price: fact(20, 'Claude Pro costs $20 a month.', 'https://claude.com/pricing'),
```

`fact()` stamps the entry `verified` with the date in `CHECKED` (`site/src/data/types.ts`). Pass `{ verified: '2026-12-02' }` to date one entry on its own. Use `unverified(...)` with a note when you cannot confirm something; the site will refuse to render it. Estimates and experience go in `observations.ts` with status `observation` and the person's name, link and date.

A fact's id is its path: `plans.claude.pro.price`. Pages read it with `<Fact id="plans.claude.pro.price" />`. Renaming a key breaks every page that uses the id, and the build says where.

## Change a price or limit

1. Open the source page and read the new value.
2. Edit the entry in the data file. Update `verified` if you only re-read one entry, or `CHECKED` if you re-checked everything.
3. If the old value was published, add a row to `site/src/data/corrections.ts`: what it said, what it says now, the source, and the fact ids.
4. Search the guides (`guides/*.md`, `skills-table.md`, `README.md`) for the old value and fix the prose.

## Add a model

1. Add an entry to `models` in `site/src/data/models.ts`, keyed by the API id (`claude-opus-5-5`). Fill in name, lab, links (docs, announcement, system card) and the facts you can source: release date, context window, max output, prices (with `longPrompt` if it is priced by prompt length), effort levels and default.
2. For the model pages, also set:
   - `current: true` if it is in the lab's current line-up (older models stay in the data for price comparisons and get a card, but not a row in the index table);
   - `purpose`: the lab's own one-line description, quoted from its models page;
   - `harness`: `'claudeCode'` or `'codex'`, and `pick`: how to select it there;
   - `plans`: the ids of the facts in `plans.ts` that say which plans include it (add those facts first if they are missing);
   - `knowledgeCutoff` and `retirement` where the lab publishes them;
   - `changed: { date, note }` when something a reader should know about has changed (a price cut, a new default).
3. Add its benchmark score to `benchmarks.aa.index` in `benchmarks.ts` once Artificial Analysis has one, keyed by the same id. Write the claim as "… at <level> effort." so the pages can show the effort it was measured at.
4. Build. The card at `/models/<id>/`, its row in the `/models/` table and its point in Fig. 10 appear with no page edit. A field you could not source shows as "not published"; an `unverified(...)` fact shows as "not confirmed". The place in the family is worked out from the output prices of the lab's current models.
5. Retire nothing: an older model stays until no page mentions it. When a model leaves the line-up, set `current` to false (or remove it) instead of deleting its facts.

Fig. 11, the effort dial, reads `benchmarks.aa.opusByEffort` and `benchmarks.aa.fableByEffort`. When a newer pair of models gets per-effort numbers, add them in the same shape and change the two model ids in `effortInputs()` in `site/src/components/models/view.ts`.

## Refresh the benchmark numbers

There is no Artificial Analysis API key yet, so this is by hand:

1. Open the [leaderboard](https://artificialanalysis.ai/leaderboards/models) and each model page in `benchmarks.ts`. The leaderboard shows whole numbers; the decimal comes from the model page.
2. Update the scores and, per effort level, the totals the model page shows. Per-task figures that the page no longer shows become `unverified`.
3. For METR, download `https://metr.org/assets/benchmark_results_1_1.yaml` and copy the `is_sota: true` entries into `metrPoints()`. The page has not been updated since 8 September 2026.

Artificial Analysis requires a visible credit wherever its numbers appear. The future route is their free API at `https://artificialanalysis.ai/api/v2` (100 requests a day, attribution required), which a refresh script can call once there is a key.

## Afterwards

From `site/`:

```sh
node scripts/check-facts.mjs --write          # regenerate guides/fact-check.md
pnpm judge                                    # check-facts, build, check-dist, check-links
BASE_PATH=/agentic-coding-guide/ pnpm judge
node scripts/check-facts.mjs --online         # optional: every source URL still answers
```

`check-facts` fails on a missing source, date, status or claim, a duplicate id, a malformed link, a correction that points at no fact, or a stale `guides/fact-check.md`. It warns on entries verified more than 60 days ago: that list is the to-do list for the next check.
