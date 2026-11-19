// Fig. 40, a week on a plan and the same week on the meter. The maths behind the lab on
// /explain/plans-and-api/ and the smaller tiles beside it.
//
// Two kinds of number meet here and must never mix unnoticed:
//   - facts: prices, window lengths, published message ranges and multiples. They arrive as inputs
//     (a Catalogue, built from src/data/ in from-data.ts) and are used as given.
//   - assumptions: how many tokens an hour of agent work moves. Nobody publishes that; it depends on
//     the work. Each one is a named constant in ASSUME below, with a comment, and the long read lists
//     them under "How the model works". Change them here and the page and the long read follow.
//
// Where a provider publishes no limit, the model returns `null` and the page says "not published".
// It never fills the gap with a guess.

/** The modelling assumptions. Every one is ours, not a provider's. */
export const ASSUME = {
  /** Requests an agent sends to the model in an hour of work on one thread: each tool call is one. */
  requestsPerThreadHour: 40,
  /** Average length of each request's prompt in a thread that has been running a while, in tokens. */
  promptTokens: 80_000,
  /** The new part of each request (your message, tool results), sent fresh and written to the cache. */
  newTokensPerRequest: 3_000,
  /** Output (reply, tool calls and thinking) per request at medium effort, in tokens. */
  outputPerRequest: 800,
  /** Output per request at each effort step, low to max, as a multiple of medium. */
  effortOutput: [0.4, 1, 2, 3, 4.5],
  /** Requests per hour at each effort step, low to max, as a multiple of medium. */
  effortRequests: [0.8, 1, 1.1, 1.2, 1.3],
  /** Codex messages you send per thread per hour (OpenAI counts limits in messages). */
  messagesPerThreadHour: 6,
  /** Working days in the week drawn, Monday onwards. */
  workdays: 5,
  /** The hour each working day starts. */
  dayStart: 9,
  /** Weeks in a month, to turn a monthly price into a weekly one. */
  weeksPerMonth: 52 / 12,
  /** One task in the "same task" tile: the holiday hours fix, in requests at medium effort. */
  taskRequests: 30,
  /** Prompt length of a fresh thread, and of one that has been open about six hours, in tokens. */
  freshPrompt: 30_000,
  longPrompt: 300_000,
  /** A subagent: requests it sends, and the prompt it starts with (its own instructions, files it reads). */
  subagentRequests: 15,
  subagentPrompt: 25_000,
  /** What a subagent's summary adds to the main thread's prompt, in tokens. */
  subagentSummary: 2_000,
} as const;

export const EFFORT_STEPS = 5;

// ---------- the catalogue: facts, as the page passes them in ----------

export type Provider = 'claude' | 'chatgpt';

export interface ModelInfo {
  id: string;
  name: string;
  provider: Provider;
  /** Per million tokens. */
  input: number;
  output: number;
  /** Per million; null when the guide's data has no cached-input price for the model. */
  cacheRead: number | null;
  /** Fast mode prices, where the model has them. */
  fast?: { input: number; output: number };
  /** Above this prompt length a model pays its long-prompt prices. */
  longPrompt?: { threshold: number; input: number; output: number };
  /** The five effort steps by name. */
  effort: string[];
}

/** What a plan says about one model. */
export type Access =
  | { kind: 'included' }
  | { kind: 'apps' } // in the chat apps, not in the coding tool
  | { kind: 'credits' } // runs on usage credits at API rates from the start
  | { kind: 'share'; percent: number } // up to a share of the weekly limit, then credits
  | { kind: 'range'; lo: number; hi: number } // OpenAI's estimated messages per five hours
  | { kind: 'desktop' } // in the Codex desktop app
  | { kind: 'no' }
  | { kind: 'unstated' };

/** What a plan says about its short window. */
export type Window =
  | { kind: 'none' } // published: no five-hour limit
  | { kind: 'unpublished'; times?: number } // there is one; its size is not published (`times` Pro, if stated)
  | { kind: 'messages' } // published as message ranges per model (see Access 'range')
  | { kind: 'elsewhere' }; // published by the provider, not in the guide's data

export interface PlanInfo {
  id: string;
  name: string;
  provider: Provider | 'api';
  /** Per month, in dollars. */
  price: number;
  /** Whether the provider's coding agent (Claude Code, Codex) is on the plan. */
  agent: boolean;
  windowHours: number | null;
  window: Window;
  /** The weekly limit as a multiple of Pro, when stated; its size is never published. */
  weekTimes?: number;
  /** Monthly API credit in dollars, null if none, undefined if the data does not say. */
  apiCredit?: number | null;
  models: Record<string, Access>;
  /** Fact ids behind the row, for the sources links. */
  facts: string[];
}

export interface Catalogue {
  models: ModelInfo[];
  plans: PlanInfo[];
  /** Cache write price multiples on Claude models (5-minute, 1-hour). */
  cacheWrite: { m5: number; h1: number };
  /** Batch discount on Claude models, percent. */
  batchDiscount: number;
}

// ---------- tokens and prices ----------

export interface Mix {
  /** Tokens read from the cache. */
  cacheRead: number;
  /** Tokens sent fresh and written to the cache. */
  fresh: number;
  output: number;
}

export const mixTotal = (m: Mix) => m.cacheRead + m.fresh + m.output;
const scale = (m: Mix, k: number): Mix => ({ cacheRead: m.cacheRead * k, fresh: m.fresh * k, output: m.output * k });
export const addMix = (a: Mix, b: Mix): Mix => ({ cacheRead: a.cacheRead + b.cacheRead, fresh: a.fresh + b.fresh, output: a.output + b.output });

/** Tokens in `requests` requests with a given prompt length and effort step. */
export function requestsMix(requests: number, prompt: number, effort: number, cached = true): Mix {
  const out = ASSUME.outputPerRequest * ASSUME.effortOutput[effort]!;
  const fresh = cached ? Math.min(prompt, ASSUME.newTokensPerRequest) : prompt;
  return { cacheRead: requests * (prompt - fresh), fresh: requests * fresh, output: requests * out };
}

/** Tokens in one hour of one thread at an effort step. */
export function threadHour(effort: number): Mix {
  return requestsMix(ASSUME.requestsPerThreadHour * ASSUME.effortRequests[effort]!, ASSUME.promptTokens, effort);
}

export type Money = [number, number]; // low, high: equal when the price is known

export interface PriceOpts {
  /** Cache lifetime asked for, which sets the write price on Claude; 'off' sends everything as plain input. */
  cache?: '5m' | '1h' | 'off';
  batch?: boolean;
  fast?: boolean;
  /** Prompt length, for models with long-prompt prices. */
  prompt?: number;
}

/** The parts of an API bill, each a [low, high] range. */
export interface Bill { cacheRead: Money; fresh: Money; output: Money; total: Money }

/**
 * What a mix of tokens costs on the API. Claude: cache reads at the model's cache price, fresh input
 * at the cache-write price. A model with no cached-input price in the data (the OpenAI models here)
 * gets a range: cache reads anywhere from free to the full input price, fresh input at the input price.
 */
export function bill(m: ModelInfo, mix: Mix, c: Catalogue, o: PriceOpts = {}): Bill {
  const long = m.longPrompt && (o.prompt ?? ASSUME.promptTokens) > m.longPrompt.threshold ? m.longPrompt : undefined;
  let input = long?.input ?? m.input;
  let output = long?.output ?? m.output;
  if (o.fast && m.fast) { input = m.fast.input; output = m.fast.output; }
  const k = o.batch && m.provider === 'claude' ? 1 - c.batchDiscount / 100 : 1;
  const per = (tokens: number, price: number) => (tokens / 1e6) * price * k;
  const write = m.provider !== 'claude' || o.cache === 'off' ? 1 : o.cache === '1h' ? c.cacheWrite.h1 : c.cacheWrite.m5;
  // The cached-read price scales with the input price when long-prompt or fast prices apply.
  const readPrice = m.cacheRead === null ? null : m.cacheRead * (input / m.input);
  const cacheRead: Money = readPrice === null ? [0, per(mix.cacheRead, input)] : [per(mix.cacheRead, readPrice), per(mix.cacheRead, readPrice)];
  const f = per(mix.fresh, input * write);
  const out = per(mix.output, output);
  return {
    cacheRead,
    fresh: [f, f],
    output: [out, out],
    total: [cacheRead[0] + f + out, cacheRead[1] + f + out],
  };
}

// ---------- the week ----------

export interface LabState {
  planId: string;
  modelId: string;
  /** 0 to 4: low, medium, high, xhigh, max. */
  effort: number;
  threads: number;
  hoursPerDay: number;
}

export type Run = 'run' | 'maybe' | 'stop' | 'credits';

export interface Segment { from: number; to: number; state: Run }

export interface WindowSpan {
  from: number;
  to: number;
  /** Fill at the end of the window as a share of its size, for the low and the high estimate; null when unknown. */
  fill: [number, number] | null;
  /** Where the fill line reaches its top, in hours, for each estimate. */
  full: [number | null, number | null];
  /** The last minute of work inside the window, for each estimate. */
  last: [number, number];
}

export interface Week {
  /** Hours from Monday 00:00 shown on the axis. */
  span: number;
  /** Hours of wanted work, all threads together counting as one hour of your day. */
  workHours: number;
  segments: Segment[];
  windows: WindowSpan[];
  /** What the plan publishes about stops: null where nothing is published. */
  firstStop: [number | null, number | null] | null; // hours of work, low and high estimate; null inside = never
  stops: [number, number] | null;
  /** The plan route: the plan's price for the week plus any credits. */
  planWeek: Money | null;
  /** API price of the whole week's work. */
  apiWeek: Money;
  /** API price per hour of your working day, all threads together. */
  apiHour: Money;
  /** Thread-hours of work. */
  threadHours: number;
  mix: Mix;
  /** Why the plan route cannot run this, if it cannot. */
  blocked?: 'agent' | 'model';
  access: Access | null;
  plan: PlanInfo;
  model: ModelInfo;
}

const MIN = 60;

/** Working minutes, from Monday 00:00. */
function isWorking(t: number, hours: number): boolean {
  for (let d = 0; d < ASSUME.workdays; d++) {
    const s = (d * 24 + ASSUME.dayStart) * MIN;
    if (t >= s && t < s + hours * MIN) return true;
  }
  return false;
}

interface Sim { states: Run[]; windows: { from: number; to: number; used: number; fullAt: number | null; last: number }[]; firstStop: number | null; stops: number }

/**
 * Minute by minute through the week. A window opens with the first message after the last one closed
 * and lasts `windowMin`; inside it `cap` messages may be used at `rate` per hour. cap = Infinity
 * draws the windows' timing alone.
 */
function simulate(span: number, hours: number, windowMin: number | null, cap: number, rate: number): Sim {
  const states: Run[] = [];
  const windows: Sim['windows'] = [];
  let end = -1, used = 0, ran = 0, firstStop: number | null = null, stops = 0, cur: Sim['windows'][number] | undefined;
  for (let t = 0; t < span * MIN; t++) {
    const w = isWorking(t, hours);
    if (windowMin !== null && t >= end && cur) { cur = undefined; }
    if (!w) { states.push('stop'); continue; }
    if (windowMin !== null && !cur) {
      end = t + windowMin; used = 0;
      cur = { from: t / MIN, to: end / MIN, used: 0, fullAt: null, last: t / MIN };
      windows.push(cur);
    }
    if (used < cap) {
      used += rate / MIN; ran++;
      if (cur) { cur.used = used; cur.last = (t + 1) / MIN; }
      if (used >= cap) {
        stops++;
        if (cur) cur.fullAt = (t + 1) / MIN;
        if (firstStop === null) firstStop = ran / MIN;
      }
      states.push('run');
    } else states.push('stop');
  }
  return { states, windows, firstStop, stops };
}

const NIGHT: Run = 'stop';

/** Turn per-minute states for the low and high estimate into drawn segments. */
function segmentsOf(lo: Run[], hi: Run[], hours: number, credits: boolean): Segment[] {
  const out: Segment[] = [];
  for (let t = 0; t < lo.length; t++) {
    if (!isWorking(t, hours)) continue;
    let s: Run = lo[t] === 'run' ? 'run' : hi[t] === 'run' ? 'maybe' : 'stop';
    if (credits) s = 'credits';
    const last = out[out.length - 1];
    if (last && last.state === s && Math.abs(last.to - t / MIN) < 1e-6) last.to = (t + 1) / MIN;
    else out.push({ from: t / MIN, to: (t + 1) / MIN, state: s });
  }
  void NIGHT;
  return out;
}

export function week(c: Catalogue, s: LabState): Week {
  const plan = c.plans.find((p) => p.id === s.planId) ?? c.plans[0]!;
  const model = c.models.find((m) => m.id === s.modelId) ?? c.models[0]!;
  const hours = Math.max(1, Math.min(24, s.hoursPerDay));
  const span = Math.max(5 * 24, (ASSUME.workdays - 1) * 24 + ASSUME.dayStart + hours);
  const workHours = ASSUME.workdays * hours;
  const threadHours = workHours * s.threads;
  const hourMix = threadHour(s.effort);
  const mix = scale(hourMix, threadHours);
  const perThread = bill(model, hourMix, c, { cache: '5m' }).total;
  const apiHour: Money = [perThread[0] * s.threads, perThread[1] * s.threads];
  const apiWeek: Money = [apiHour[0] * workHours, apiHour[1] * workHours];

  const isApi = plan.provider === 'api';
  const access = isApi ? null : plan.models[model.id] ?? { kind: 'unstated' };
  const wrongLab = !isApi && plan.provider !== model.provider;
  const blocked = isApi ? undefined : !plan.agent ? 'agent' : wrongLab || access?.kind === 'no' || access?.kind === 'apps' ? 'model' : undefined;
  const credits = !isApi && !blocked && access?.kind === 'credits';
  const flat = plan.price / ASSUME.weeksPerMonth;

  const windowMin = !isApi && plan.windowHours && plan.window.kind !== 'none' ? plan.windowHours * MIN : null;
  // Only a published message range gives the window a size.
  const range = !blocked && !credits && access?.kind === 'range' ? access : null;
  const rate = s.threads * ASSUME.messagesPerThreadHour;
  const lo = simulate(span, hours, windowMin, range ? range.lo : Infinity, rate);
  const hi = range ? simulate(span, hours, windowMin, range.hi, rate) : lo;

  const windows: WindowSpan[] = lo.windows.map((w, i) => {
    const h = hi.windows[i];
    return {
      from: w.from, to: w.to,
      fill: range ? [Math.min(1, w.used / range.lo), Math.min(1, (h?.used ?? 0) / range.hi)] : null,
      full: range ? [w.fullAt, h?.fullAt ?? null] : [null, null],
      last: [w.last, h?.last ?? w.last],
    };
  });

  let planWeek: Money | null = isApi || blocked ? null : [flat, flat];
  if (planWeek && credits) planWeek = [flat + apiWeek[0], flat + apiWeek[1]];

  return {
    span, workHours, threadHours, mix,
    segments: blocked ? [] : segmentsOf(lo.states, hi.states, hours, credits),
    windows: blocked || isApi ? [] : windows,
    firstStop: isApi ? [null, null] : range ? [lo.firstStop, hi.firstStop] : null,
    stops: isApi ? [0, 0] : range ? [hi.stops, lo.stops] : null,
    planWeek, apiWeek, apiHour, blocked, access, plan, model,
  };
}

/** Hours of work after which the API has cost more than the plan's week: [low, high] or null if never this week. */
export function crossover(w: Week): Money | null {
  if (!w.planWeek) return null;
  if (w.access?.kind === 'credits') return null;
  const at = (k: 0 | 1) => (w.apiHour[k] > 0 ? w.planWeek![0] / w.apiHour[k] : Infinity);
  const a = at(1), b = at(0); // the dearer API reaches it first
  if (a > w.workHours) return null;
  return [a, b];
}

// ---------- words and numbers ----------

const gb = (n: number, d = 0) => n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });

export function usd(n: number): string {
  if (!Number.isFinite(n)) return '–';
  if (n === 0) return '$0';
  if (n < 0.01) return `$${n.toPrecision(1)}`;
  if (n < 10) return `$${gb(n, 2)}`;
  return `$${gb(Math.round(n))}`;
}

export const money = ([a, b]: Money) => (Math.abs(a - b) <= Math.max(0.005, a * 0.02) ? usd(a) : `${usd(a)}–${usd(b)}`);

export function hrs(h: number): string {
  if (h < 1 / 60) return 'under a minute';
  if (h < 1) return `${Math.round(h * 60)} min`;
  if (h < 10) return `${gb(h, 1).replace(/\.0$/, '')} h`;
  return `${gb(Math.round(h))} h`;
}

/** A range of hours: "4–32 min", "2.9–8 h". */
export function hrsRange(a: number, b: number): string {
  if (Math.abs(a - b) < 1 / 60) return hrs(a);
  if (a >= 1 / 60 && b < 1) return `${Math.round(a * 60)}–${Math.round(b * 60)} min`;
  if (a >= 1 && b >= 1) return `${hrs(a).replace(' h', '')}–${hrs(b)}`;
  return `${hrs(a)}–${hrs(b)}`;
}

export function tokens(n: number): string {
  if (n >= 1e9) return `${gb(n / 1e9, 1).replace(/\.0$/, '')}B`;
  if (n >= 1e6) return `${gb(n / 1e6, 1).replace(/\.0$/, '')}M`;
  if (n >= 1e3) return `${gb(n / 1e3, 0)}K`;
  return gb(n);
}

export interface Numbers {
  firstStop: string;
  stops: string;
  apiWeek: string;
  apiMonth: string;
  planWeek: string;
  apiPerHour: string;
  planPerHour: string;
  crossover: string;
}

export function numbers(w: Week): Numbers {
  const isApi = w.plan.provider === 'api';
  const np = 'Not published';
  const firstStop = isApi ? 'Never'
    : w.blocked ? '–'
    : w.access?.kind === 'credits' ? 'On credits'
    : w.firstStop === null ? np
    : w.firstStop[0] === null ? 'No stop'
    : w.firstStop[1] === null ? `${hrs(w.firstStop[0])} or none`
    : hrsRange(w.firstStop[0], w.firstStop[1]);
  const stops = isApi ? '0'
    : w.blocked ? '–'
    : w.access?.kind === 'credits' ? '0'
    : w.stops === null ? np
    : w.stops[0] === w.stops[1] ? String(w.stops[0]) : `${w.stops[0]}–${w.stops[1]}`;
  const month: Money = [w.apiWeek[0] * ASSUME.weeksPerMonth, w.apiWeek[1] * ASSUME.weeksPerMonth];
  const ran = w.workHours;
  const planPerHour = !w.planWeek ? '–'
    : w.access?.kind === 'credits' ? money([w.planWeek[0] / ran, w.planWeek[1] / ran])
    : (w.firstStop === null || (w.stops && w.stops[1] > 0)) ? `from ${usd(w.planWeek[0] / ran)}`
    : usd(w.planWeek[0] / ran);
  const x = crossover(w);
  const crossoverText = isApi || !w.planWeek ? '–'
    : w.access?.kind === 'credits' ? 'Same meter'
    : w.planWeek[0] === 0 ? 'From the start'
    : x === null ? 'Not this week'
    : x[1] > w.workHours ? `${hrs(x[0])} or later`
    : hrsRange(x[0], x[1]);
  return {
    firstStop, stops,
    apiWeek: money(w.apiWeek), apiMonth: money(month),
    planWeek: w.planWeek ? money(w.planWeek) : '–',
    apiPerHour: money(w.apiHour),
    planPerHour,
    crossover: crossoverText,
  };
}

const plural = (n: number, one: string, many = `${one}s`) => `${n === 1 ? 'one' : n} ${n === 1 ? one : many}`;

/** The sentence under the lab. */
export function finding(w: Week, s: LabState): string {
  const who = `${plural(s.threads, 'thread')} on ${w.model.name} at ${w.model.effort[s.effort]} effort, ${s.hoursPerDay} h a day`;
  const api = `The same week on the API: ${money(w.apiWeek)}.`;
  if (w.plan.provider === 'api') return `${cap(who)}, on an API key: nothing stops, and the week comes to ${money(w.apiWeek)}, about ${money([w.apiWeek[0] * ASSUME.weeksPerMonth, w.apiWeek[1] * ASSUME.weeksPerMonth])} a month.`;
  if (w.blocked === 'agent') return `${w.plan.name} does not include ${w.plan.provider === 'claude' ? 'Claude Code' : 'Codex'}. ${api}`;
  if (w.blocked === 'model') return `${w.plan.name} does not run ${w.model.name} in its coding agent. ${api}`;
  const a = w.access!;
  if (a.kind === 'credits') return `On ${w.plan.name}, ${w.model.name} runs on usage credits at API rates from the first message: the plan's ${usd(w.plan.price)} plus ${money(w.apiWeek)} this week.`;
  if (a.kind === 'range' && w.firstStop) {
    const [lo, hi] = w.firstStop;
    const stop = lo === null ? 'never runs out' : hi === null ? `can run out after ${hrs(lo)} of work, or not at all` : `runs out after ${hrsRange(lo, hi)} of work`;
    return `${cap(who)}: OpenAI's estimate of ${gb(a.lo)}–${gb(a.hi)} messages per five hours ${stop}. ${api}${rangeNote(w)}`;
  }
  if (w.plan.window.kind === 'none') return `${cap(who)}: ${w.plan.name} has no five-hour limit, and the size of its weekly limit is not published. ${api}${rangeNote(w)}`;
  if (w.plan.window.kind === 'elsewhere') return `${cap(who)}: OpenAI publishes estimates for ${w.plan.name}, but they are not in this guide's data yet. ${api}${rangeNote(w)}`;
  return `${cap(who)}: ${w.plan.name} publishes no size for its windows or its week, so where this stops is not known. ${api}${rangeNote(w)}`;
}

const rangeNote = (w: Week) => (w.model.cacheRead === null ? ` A range, because OpenAI's cache price is not in the guide's data.` : '');

const cap = (t: string) => t[0]!.toUpperCase() + t.slice(1);
