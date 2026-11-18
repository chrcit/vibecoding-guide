// Builds Fig. 9's props from the data layer, so the page and the review page draw the same facts.
// Nothing here is a number of its own: every value is read from src/data/.
import { plans } from '../../../data/plans.ts';
import { models } from '../../../data/models.ts';
import type { Level, MessageRange, PlanRunsInputs } from './model';

/** '350–3,000' → [350, 3000] */
function range(v: string): [number, number] {
  const [lo, hi] = v.split('–').map((s) => Number(s.replace(/,/g, '')));
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) throw new Error(`plan-runs: cannot read the range "${v}"`);
  return [lo!, hi!];
}

export function planRunsFromData(): PlanRunsInputs {
  const c = plans.claude, g = plans.chatgpt;
  const m = g.plus.messages;
  const pairs: [string, string][] = [
    [models['gpt-6-2-astra'].name, m.astra.value],
    [models['gpt-6-2-sol'].name, m.sol.value],
    [models['gpt-6-1-terra'].name, m.terra.value],
    [models['gpt-6-luna'].name, m.luna.value],
  ];
  const messages: MessageRange[] = pairs.map(([model, v]) => {
    const [lo, hi] = range(v);
    return { model, lo, hi };
  });
  const short = (k: 'claude-opus-5-5' | 'claude-sonnet-5-5' | 'claude-haiku-5-5') => models[k].name.replace(/^Claude /, '');
  const included = [short('claude-opus-5-5'), short('claude-sonnet-5-5'), short('claude-haiku-5-5')];
  const [pro100, pro200] = g.pro.price.value;
  if (pro100 !== c.max.price.value || pro200 !== c.ultra.price.value) {
    throw new Error('plan-runs: the ChatGPT Pro prices no longer line up with Max and Ultra; regroup the levels.');
  }
  const levels: Level[] = [
    {
      price: c.pro.price.value,
      claude: { name: 'Claude Pro', window: 1, week: 1, fableShare: null, apiCredit: null, models: included },
      chatgpt: { name: 'ChatGPT Plus', fiveHourLimit: true, messages },
    },
    {
      price: c.max.price.value,
      claude: { name: 'Claude Max', window: c.max.usage.value, week: c.max.usage.value, fableShare: c.max.fable.value, apiCredit: c.max.apiCredit.value, models: included },
      chatgpt: { name: `ChatGPT Pro at $${pro100}`, fiveHourLimit: !g.pro.noFiveHourLimit.value, messages: [] },
    },
    {
      price: c.ultra.price.value,
      claude: { name: 'Claude Ultra', window: c.ultra.noFiveHourLimit.value ? null : 1, week: c.ultra.usage.value, fableShare: c.ultra.fable.value, apiCredit: c.ultra.apiCredit.value, models: included },
      chatgpt: { name: `ChatGPT Pro at $${pro200}`, fiveHourLimit: !g.pro.noFiveHourLimit.value, messages: [] },
    },
  ];
  return { currency: '$', levels };
}

/** The fact ids Fig. 9 draws on, for the page's Verified line. */
export const planRunsFacts = [
  'plans.claude.pro.price', 'plans.claude.max.price', 'plans.claude.max.usage', 'plans.claude.max.fable', 'plans.claude.max.apiCredit',
  'plans.claude.ultra.price', 'plans.claude.ultra.usage', 'plans.claude.ultra.noFiveHourLimit', 'plans.claude.ultra.fable', 'plans.claude.ultra.apiCredit',
  'plans.chatgpt.plus.messages.astra', 'plans.chatgpt.plus.messages.sol', 'plans.chatgpt.plus.messages.terra', 'plans.chatgpt.plus.messages.luna',
  'plans.chatgpt.pro.price', 'plans.chatgpt.pro.noFiveHourLimit', 'plans.chatgpt.limits.proNoEstimates',
];
