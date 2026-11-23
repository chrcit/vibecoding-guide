// Fig. 44: the next turn after a break, with the cache still warm or gone. The lifetimes (an hour on a
// plan, five minutes on a key, in Claude Code) and every price come in from the data; the prompt
// length is the lab's assumption.
import { ASSUME, bill, money, type Catalogue } from '../plan-week/model';

export function nextTurn(cat: Catalogue, modelId: string, route: 'plan' | 'key', breakMin: number, ttl: { plan: number; key: number }) {
  const m = cat.models.find((x) => x.id === modelId) ?? cat.models[0]!;
  const cache = route === 'plan' ? '1h' : '5m';
  const p = ASSUME.promptTokens, fresh = ASSUME.newTokensPerRequest, out = ASSUME.outputPerRequest;
  const warmBill = bill(m, { cacheRead: p - fresh, fresh, output: out }, cat, { cache });
  const coldBill = bill(m, { cacheRead: 0, fresh: p, output: out }, cat, { cache });
  const life = ttl[route];
  const gone = breakMin > life;
  const warm = money(warmBill.total), cold = money(coldBill.total);
  const now = gone ? cold : warm;
  const k = Math.round(p / 1000);
  const where = route === 'plan' ? 'on a plan, where Claude Code keeps the cache for an hour' : 'on a key, where Claude Code keeps it for five minutes';
  const say = m.provider !== 'claude'
    ? `OpenAI's cache terms are not in this guide's data, so this tile follows Claude models. Pick one in the lab.`
    : gone
      ? `Back after ${breakMin} minutes ${where}: the next turn writes all ${k}K tokens of prompt again, ${cold} against ${warm} warm.`
      : `Back after ${breakMin} minutes ${where}: the cache is still there, and the next turn reads the prompt for ${warm}.`;
  return { warm: m.provider === 'claude' ? warm : '–', now: m.provider === 'claude' ? now : '–', say };
}
