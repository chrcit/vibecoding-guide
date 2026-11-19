// Fig. 42: one task run two ways. Prices come in through the lab's catalogue; token volumes are the
// lab's assumptions (ASSUME in plan-week/model.ts).
import { ASSUME, bill, money, requestsMix, type Catalogue, type Mix, type PriceOpts } from '../plan-week/model';

export type Lever = 'effort' | 'thread' | 'cache';
export const KINDS = ['cacheRead', 'fresh', 'output'] as const;

interface Run { label: string; mix: Mix; opts: PriceOpts }

function runs(lever: Lever): [Run, Run] {
  const req = (e: number) => ASSUME.taskRequests * ASSUME.effortRequests[e]!;
  const p = ASSUME.freshPrompt;
  switch (lever) {
    case 'effort':
      return [
        { label: 'Medium effort', mix: requestsMix(req(1), p, 1), opts: { cache: '5m', prompt: p } },
        { label: 'Max effort', mix: requestsMix(req(4), p, 4), opts: { cache: '5m', prompt: p } },
      ];
    case 'thread':
      return [
        { label: 'Fresh thread', mix: requestsMix(req(1), p, 1), opts: { cache: '5m', prompt: p } },
        { label: 'Six hours into a thread', mix: requestsMix(req(1), ASSUME.longPrompt, 1), opts: { cache: '5m', prompt: ASSUME.longPrompt } },
      ];
    case 'cache':
      return [
        { label: 'Cache on', mix: requestsMix(req(1), p, 1), opts: { cache: '5m', prompt: p } },
        { label: 'Cache off', mix: requestsMix(req(1), p, 1, false), opts: { cache: 'off', prompt: p } },
      ];
  }
}

export function compare(cat: Catalogue, modelId: string, lever: Lever) {
  const m = cat.models.find((x) => x.id === modelId) ?? cat.models[0]!;
  const [a, b] = runs(lever);
  const bills = [a, b].map((r) => bill(m, r.mix, cat, r.opts));
  const top = Math.max(...bills.map((x) => x.total[1]), 1e-9);
  const rows = [a, b].map((r, i) => {
    const x = bills[i]!;
    return {
      label: r.label,
      total: money(x.total),
      share: { cacheRead: x.cacheRead[1] / top, fresh: x.fresh[1] / top, output: x.output[1] / top },
    };
  });
  const lo = bills[1]!.total[0] / bills[0]!.total[0], hi = bills[1]!.total[1] / bills[0]!.total[1];
  const ratio = Math.abs(lo - hi) < 0.05 ? `${hi.toFixed(1)} times` : `${Math.min(lo, hi).toFixed(1)} to ${Math.max(lo, hi).toFixed(1)} times`;
  const long = m.longPrompt && lever === 'thread' && ASSUME.longPrompt > m.longPrompt.threshold ? ` Past ${(m.longPrompt.threshold / 1000).toFixed(0)}K tokens of prompt, ${m.name} also charges its higher long-prompt prices.` : '';
  const say = `The holiday hours fix on ${m.name}: ${rows[1]!.label.toLowerCase()} costs ${ratio} as much, ${rows[1]!.total} against ${rows[0]!.total}.${long}`;
  return { rows, say, unknownCache: m.cacheRead === null };
}
