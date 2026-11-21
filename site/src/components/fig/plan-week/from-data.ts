// Builds the lab's catalogue from src/data/. Nothing here is a number of its own: every price, window
// length, multiple and message range is read from the data files. Where the data says nothing, the
// entry says 'unstated' or 'unpublished', and the page prints that.
import { plans } from '../../../data/plans.ts';
import { models, lineup } from '../../../data/models.ts';
import { estimates } from '../../../data/observations.ts';
import type { Access, Catalogue, ModelInfo, PlanInfo } from './model';

/** '350–3,000' → [350, 3000] */
function range(v: string): [number, number] {
  const [lo, hi] = v.split('–').map((s) => Number(s.replace(/,/g, '')));
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) throw new Error(`plan-week: cannot read the range "${v}"`);
  return [lo!, hi!];
}

type ClaudeId = 'claude-fable-5-2' | 'claude-opus-5-5' | 'claude-sonnet-5-5' | 'claude-haiku-5-5';
type GptId = 'gpt-6-2-astra' | 'gpt-6-2-sol' | 'gpt-6-1-terra' | 'gpt-6-luna';
export const CLAUDE_MODELS: ClaudeId[] = ['claude-fable-5-2', 'claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-5-5'];
export const GPT_MODELS: GptId[] = ['gpt-6-2-astra', 'gpt-6-2-sol', 'gpt-6-1-terra', 'gpt-6-luna'];

function claudeModel(id: ClaudeId): ModelInfo {
  const m = models[id];
  const p = m.price as { input: { value: number }; output: { value: number }; cacheRead: { value: number }; fast?: { input: { value: number }; output: { value: number } }; longPrompt?: { threshold: { value: number }; input: { value: number }; output: { value: number } } };
  return {
    id, name: m.name, provider: 'claude',
    input: p.input.value, output: p.output.value, cacheRead: p.cacheRead.value,
    fast: p.fast ? { input: p.fast.input.value, output: p.fast.output.value } : undefined,
    longPrompt: p.longPrompt ? { threshold: p.longPrompt.threshold.value, input: p.longPrompt.input.value, output: p.longPrompt.output.value } : undefined,
    effort: [...m.effort.levels.value],
  };
}

function gptModel(id: GptId): ModelInfo {
  const m = models[id];
  const own = (m as { effort?: { levels: { value: readonly string[] } } }).effort?.levels.value;
  // Codex's own list ends in ultra on some models, which hands work to subagents; the lab stops at max.
  const levels = [...(own ?? lineup.codexEffortLevels.value)].slice(0, 5);
  return { id, name: m.name, provider: 'chatgpt', input: m.price.input.value, output: m.price.output.value, cacheRead: null, effort: levels };
}

const all = <T extends string>(ids: T[], a: Access) => Object.fromEntries(ids.map((id) => [id, a])) as Record<string, Access>;

export function catalogue(): Catalogue {
  const c = plans.claude, g = plans.chatgpt;
  const included: Access = { kind: 'included' };
  const share = (p: number): Access => ({ kind: 'share', percent: p });
  const opusSonnetHaiku = (a: Access) => ({ 'claude-opus-5-5': a, 'claude-sonnet-5-5': a, 'claude-haiku-5-5': a });
  const hours = c.limits.windowHours.value;
  // OpenAI's estimates cover the same five hours.
  const gptHours = hours;
  const m = g.plus.messages;
  const plusRanges: Record<string, Access> = Object.fromEntries(
    ([['gpt-6-2-astra', m.astra.value], ['gpt-6-2-sol', m.sol.value], ['gpt-6-1-terra', m.terra.value], ['gpt-6-luna', m.luna.value]] as const)
      .map(([id, v]) => { const [lo, hi] = range(v); return [id, { kind: 'range', lo, hi } as Access]; }),
  );
  const freeGo: Record<string, Access> = { ...all(GPT_MODELS, { kind: 'unstated' }), 'gpt-6-luna': { kind: 'desktop' } };
  const [p100, p200, p500] = g.pro.price.value;

  const list: PlanInfo[] = [
    {
      id: 'claude-free', name: 'Claude Free', provider: 'claude', price: c.free.price.value, agent: c.free.claudeCode.value,
      windowHours: hours, window: { kind: 'unpublished' },
      models: { 'claude-fable-5-2': { kind: 'no' }, 'claude-opus-5-5': { kind: 'no' }, 'claude-sonnet-5-5': { kind: 'apps' }, 'claude-haiku-5-5': { kind: 'apps' } },
      facts: ['plans.claude.free.price', 'plans.claude.free.claudeCode', 'plans.claude.free.models'],
    },
    {
      id: 'claude-pro', name: 'Claude Pro', provider: 'claude', price: c.pro.price.value, agent: c.pro.claudeCode.value,
      windowHours: hours, window: { kind: 'unpublished', times: 1 }, weekTimes: 1, apiCredit: c.pro.apiCredit.value ? undefined : null,
      models: { 'claude-fable-5-2': { kind: 'credits' }, ...opusSonnetHaiku(included) },
      facts: ['plans.claude.pro.price', 'plans.claude.pro.claudeCode', 'plans.claude.pro.models', 'plans.claude.pro.fable', 'plans.claude.pro.apiCredit', 'plans.claude.limits.fiveHour', 'plans.claude.limits.whatUsageMeans'],
    },
    {
      id: 'claude-max', name: 'Claude Max', provider: 'claude', price: c.max.price.value, agent: c.pro.claudeCode.value,
      windowHours: hours, window: { kind: 'unpublished', times: c.max.usage.value }, weekTimes: c.max.usage.value, apiCredit: c.max.apiCredit.value,
      models: { 'claude-fable-5-2': share(c.max.fable.value), ...opusSonnetHaiku(included) },
      facts: ['plans.claude.max.price', 'plans.claude.max.usage', 'plans.claude.max.models', 'plans.claude.max.fable', 'plans.claude.max.apiCredit'],
    },
    {
      id: 'claude-ultra', name: 'Claude Ultra', provider: 'claude', price: c.ultra.price.value, agent: c.pro.claudeCode.value,
      windowHours: c.ultra.noFiveHourLimit.value ? null : hours, window: c.ultra.noFiveHourLimit.value ? { kind: 'none' } : { kind: 'unpublished' },
      weekTimes: c.ultra.usage.value, apiCredit: c.ultra.apiCredit.value,
      models: { 'claude-fable-5-2': share(c.ultra.fable.value), ...opusSonnetHaiku(included) },
      facts: ['plans.claude.ultra.price', 'plans.claude.ultra.usage', 'plans.claude.ultra.noFiveHourLimit', 'plans.claude.ultra.models', 'plans.claude.ultra.fable', 'plans.claude.ultra.apiCredit'],
    },
    {
      id: 'chatgpt-free', name: 'ChatGPT Free', provider: 'chatgpt', price: g.free.price.value, agent: g.limits.codexOnEveryPlan.value,
      windowHours: null, window: { kind: 'unpublished' }, models: freeGo,
      facts: ['plans.chatgpt.free.price', 'plans.chatgpt.free.luna', 'plans.chatgpt.limits.codexOnEveryPlan'],
    },
    {
      id: 'chatgpt-go', name: 'ChatGPT Go', provider: 'chatgpt', price: g.go.price.value, agent: g.limits.codexOnEveryPlan.value,
      windowHours: null, window: { kind: 'unpublished' }, models: freeGo,
      facts: ['plans.chatgpt.go.price', 'plans.chatgpt.free.luna', 'plans.chatgpt.limits.codexOnEveryPlan'],
    },
    {
      id: 'chatgpt-plus', name: 'ChatGPT Plus', provider: 'chatgpt', price: g.plus.price.value, agent: g.limits.codexOnEveryPlan.value,
      windowHours: gptHours, window: { kind: 'messages' }, models: plusRanges,
      facts: ['plans.chatgpt.plus.price', 'plans.chatgpt.plus.messages.astra', 'plans.chatgpt.plus.messages.sol', 'plans.chatgpt.plus.messages.terra', 'plans.chatgpt.plus.messages.luna', 'plans.chatgpt.limits.estimates'],
    },
    {
      id: 'chatgpt-business', name: 'ChatGPT Business', provider: 'chatgpt', price: g.business.price.value, agent: g.limits.codexOnEveryPlan.value,
      windowHours: gptHours, window: { kind: 'elsewhere' }, models: all(GPT_MODELS, { kind: 'unstated' }),
      facts: ['plans.chatgpt.business.price', 'plans.chatgpt.limits.estimates'],
    },
    ...[p100, p200, p500].map((price): PlanInfo => ({
      id: `chatgpt-pro-${price}`, name: `ChatGPT Pro $${price}`, provider: 'chatgpt', price, agent: g.limits.codexOnEveryPlan.value,
      windowHours: null, window: g.pro.noFiveHourLimit.value ? { kind: 'none' } : { kind: 'unpublished' }, models: all(GPT_MODELS, { kind: 'unstated' }),
      facts: ['plans.chatgpt.pro.price', 'plans.chatgpt.pro.noFiveHourLimit', 'plans.chatgpt.limits.proNoEstimates'],
    })),
    {
      id: 'api', name: 'API key, no plan', provider: 'api', price: 0, agent: true, windowHours: null, window: { kind: 'none' }, models: {},
      facts: ['plans.claude.api.rateLimits'],
    },
  ];

  return {
    models: [...CLAUDE_MODELS.map(claudeModel), ...GPT_MODELS.map(gptModel)],
    plans: list,
    cacheWrite: { m5: lineup.cacheWrite5m.value, h1: lineup.cacheWrite1h.value },
    batchDiscount: lineup.batchDiscount.value,
  };
}

/** Every fact the lab and its tiles read, for the board's Verified line. */
export const labFacts = [
  ...new Set(catalogue().plans.flatMap((p) => p.facts)),
  'plans.claude.limits.windowHours', 'plans.claude.limits.weekly', 'plans.claude.limits.sharedAcrossModels',
  'lineup.cacheWrite5m', 'lineup.cacheWrite1h', 'lineup.batchDiscount', 'lineup.codexEffortLevels',
  ...CLAUDE_MODELS.flatMap((id) => [`models.${id}.price.input`, `models.${id}.price.output`, `models.${id}.price.cacheRead`, `models.${id}.effort.levels`]),
  ...GPT_MODELS.flatMap((id) => [`models.${id}.price.input`, `models.${id}.price.output`]),
  'models.gpt-6-luna.effort.levels', 'models.claude-opus-5-5.price.fast.input', 'models.claude-opus-5-5.price.fast.output',
  'models.claude-haiku-5-5.price.longPrompt.threshold', 'models.claude-haiku-5-5.price.longPrompt.input', 'models.claude-haiku-5-5.price.longPrompt.output',
];

// ---------- one practitioner's estimates, for the <Estimate> tile only ----------

export interface PlanEstimate {
  /** Plan id in the catalogue. */
  plan: string;
  /** API-priced dollars a month the plan carries, low and high. */
  month: [number, number];
  /** How the figure was read, in a few words. */
  how: string;
  /** The estimates it rests on, newest first: url with timestamp, date. */
  from: { url: string; date: string; claim: string }[];
}

const dollars = (v: string) => {
  const nums = [...v.matchAll(/\$?([\d,]+)/g)].map((x) => Number(x[1]!.replace(/,/g, '')));
  if (!nums.length || nums.some((n) => !Number.isFinite(n))) throw new Error(`plan-week: cannot read "${v}"`);
  return nums;
};
const seconds = (at: string) => at.split(':').reduce((m, s) => m * 60 + Number(s), 0);
const cite = (k: keyof typeof estimates) => {
  const e = estimates[k];
  return { url: `${e.url}&t=${seconds(e.at!)}s`, date: e.published, claim: e.fact.claim };
};

/**
 * Theo's monthly readings of what a plan carries in API-priced usage. Max and Ultra come straight from
 * his figures; Pro is Max divided by Max's published multiple of Pro, said so on the page. The $200
 * OpenAI figure is his "$200 OpenAI plan". Figures that mix in the Fable cap are left out.
 */
export function theoEstimates(): PlanEstimate[] {
  const c = plans.claude;
  const ultraPrice = c.ultra.price.value;
  const ultra = [
    dollars(estimates['theo-2026-10-02-claude-200'].fact.value)[0]!,
    dollars(estimates['theo-2026-11-02-ultra'].fact.value)[0]!,
    Number(estimates['theo-2026-11-10-multiplier'].fact.value.replace('×', '')) * ultraPrice,
  ];
  const max = dollars(estimates['theo-2026-11-13-claude-100'].fact.value);
  const k = c.max.usage.value;
  const openai = dollars(estimates['theo-2026-11-03-compare-200'].fact.value)[1]!;
  const [, p200] = plans.chatgpt.pro.price.value;
  return [
    { plan: 'claude-pro', month: [max[0]! / k, max[max.length - 1]! / k], how: `his Max figure divided by ${k}, Anthropic's published multiple`, from: [cite('theo-2026-11-13-claude-100')] },
    { plan: 'claude-max', month: [max[0]!, max[max.length - 1]!], how: 'his figure for the $100 plan', from: [cite('theo-2026-11-13-claude-100')] },
    { plan: 'claude-ultra', month: [Math.min(...ultra), Math.max(...ultra)], how: 'the spread of his three figures for the $200 plan', from: [cite('theo-2026-11-10-multiplier'), cite('theo-2026-11-02-ultra'), cite('theo-2026-10-02-claude-200')] },
    { plan: `chatgpt-pro-${p200}`, month: [openai, openai], how: 'his figure for the $200 OpenAI plan', from: [cite('theo-2026-11-03-compare-200')] },
  ];
}
