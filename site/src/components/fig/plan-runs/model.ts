// Fig. 9, what your plan runs. For one price level, what each provider's plan includes and what it says
// about one five-hour window. Only published quantities are drawn: OpenAI's estimated message ranges
// for Plus, and Anthropic's multipliers of Pro usage. Where a provider publishes no figure, the model
// says so and the drawing shows no bar.

export interface MessageRange {
  model: string;
  lo: number;
  hi: number;
}

export interface ClaudeTier {
  name: string;
  /** Usage per five hours as a multiple of Pro; null when the plan has no five-hour limit. */
  window: number | null;
  /** Usage per week as a multiple of Pro. */
  week: number;
  /** Share of the weekly limit Fable may use, in percent; null when Fable runs on usage credits only. */
  fableShare: number | null;
  /** Monthly API credit in dollars; null when there is none. */
  apiCredit: number | null;
  /** Models included in the plan limits. */
  models: string[];
}

export interface ChatGptTier {
  name: string;
  fiveHourLimit: boolean;
  /** Published estimates of local Codex messages per five hours, where they exist. */
  messages: MessageRange[];
}

export interface Level {
  price: number;
  claude: ClaudeTier;
  chatgpt: ChatGptTier;
}

export interface PlanRunsInputs {
  currency: string;
  levels: Level[];
}

/** Axis for the message ranges: powers of ten that cover every published range. */
export function messageAxis(levels: Level[]): [number, number] {
  const all = levels.flatMap((l) => l.chatgpt.messages);
  if (!all.length) return [1, 10];
  const lo = 10 ** Math.floor(Math.log10(Math.min(...all.map((r) => r.lo))));
  const hi = 10 ** Math.ceil(Math.log10(Math.max(...all.map((r) => r.hi))));
  return [lo, hi];
}

/** Position of a value on a log axis, as a share from 0 to 1. */
export const logShare = (v: number, [lo, hi]: [number, number]) => (Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo));

/** Largest multiple of Pro across levels, for the shared scale of the Claude bars. */
export const maxMultiple = (levels: Level[]) => Math.max(1, ...levels.flatMap((l) => [l.claude.window ?? 0, l.claude.week]));

const num = (n: number) => n.toLocaleString('en-GB');
export const multiple = (n: number) => (n === 1 ? 'the Pro allowance' : `${num(n)} times Pro`);

export function describe(l: Level, x: PlanRunsInputs): string {
  const price = `${x.currency}${num(l.price)}`;
  const c = l.claude;
  const claude = c.window === null
    ? `${c.name} has no five-hour limit on a verified account; its weekly allowance is ${multiple(c.week)}.`
    : c.window === 1
      ? `${c.name} gives one five-hour window of a size Anthropic does not publish, inside a weekly limit.`
      : `${c.name} gives ${multiple(c.window)} every five hours and ${multiple(c.week)} every week, with no absolute figure published for either.`;
  const g = l.chatgpt;
  const chatgpt = g.messages.length
    ? (() => {
        const lo = g.messages.reduce((a, b) => (b.hi < a.hi ? b : a));
        const hi = g.messages.reduce((a, b) => (b.hi > a.hi ? b : a));
        return `${g.name} lists estimates per five hours, from ${num(lo.lo)} to ${num(lo.hi)} local Codex messages on ${lo.model} up to ${num(hi.lo)} to ${num(hi.hi)} on ${hi.model}.`;
      })()
    : `${g.name} has ${g.fiveHourLimit ? 'a five-hour limit' : 'no five-hour limit'}, and OpenAI publishes no message estimates for it.`;
  return `At ${price} a month: ${claude} ${chatgpt}`;
}
