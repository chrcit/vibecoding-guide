// Fig. 43: what subagents add to the meter. Each subagent starts its own context, writes its own
// cache and reads none of the parent's, so it adds a whole prompt of fresh tokens before its first
// answer. Token volumes are the lab's assumptions (ASSUME in plan-week/model.ts).
import { ASSUME, addMix, bill, mixTotal, money, requestsMix, type Catalogue, type Mix } from '../plan-week/model';

/** The main thread doing the task, with `n` subagent summaries handed back into its prompt. */
export function mainMix(n: number): Mix {
  return requestsMix(ASSUME.taskRequests, ASSUME.freshPrompt + n * ASSUME.subagentSummary, 1);
}

/** One subagent: its first request writes its whole starting prompt, the rest read it from the cache. */
export function subagentMix(): Mix {
  const m = requestsMix(ASSUME.subagentRequests, ASSUME.subagentPrompt, 1);
  const first = ASSUME.subagentPrompt - ASSUME.newTokensPerRequest;
  return { cacheRead: m.cacheRead - first, fresh: m.fresh + first, output: m.output };
}

export function meter(cat: Catalogue, modelId: string, n: number) {
  const m = cat.models.find((x) => x.id === modelId) ?? cat.models[0]!;
  const one = mainMix(0);
  const main = mainMix(n);
  const sub = subagentMix();
  let total = main;
  for (let i = 0; i < n; i++) total = addMix(total, sub);
  const base = mixTotal(one);
  const times = mixTotal(total) / base;
  const cost = bill(m, total, cat, { cache: '5m', prompt: ASSUME.freshPrompt });
  const oneCost = bill(m, one, cat, { cache: '5m', prompt: ASSUME.freshPrompt });
  return {
    segments: [mixTotal(main) / base, ...Array.from({ length: n }, () => mixTotal(sub) / base)],
    times,
    cost: money(cost.total),
    oneCost: money(oneCost.total),
    model: m.name,
  };
}
