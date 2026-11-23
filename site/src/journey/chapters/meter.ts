// Lesson 14: what it costs. One made-up job, the date fix from "It gets hands", is counted turn by
// turn: every turn reads the whole window again and writes a little. On the API those tokens are
// multiplied by the real prices the page hands over; on a plan they drain an allowance at a made-up
// rate, because the provider publishes no figure for it.
//
// Every number on the page comes out of `bill()`, and the token counts are chosen so that the job's
// price with the cache on is a whole tenth of a cent: a reader can redo each sum by hand and get the
// figure on screen.
import { byLevel, type Chapter, type Ctx, type Level } from '../chapter';
import type { Script } from '../scene';
import { solo, team, lab } from '../presets';
import { route, reverse, SPOT, BUS_Y, type Kind, type SceneState, type Meter } from '../picture';
import { STEP_NOTES } from '../notes';
import { termLabel } from '../terms';

/** Prices per million tokens, from src/data/models.ts via the page. */
export interface Price { name: string; input: number; output: number; cacheRead?: number }
const MODEL_IDS = ['claude-opus-5-5', 'claude-fable-5-2', 'gpt-6-2-sol'] as const;
const FALLBACK: Price = { name: 'the model', input: 0, output: 0 };
const price = (ctx: Ctx, id?: string): Price => ctx.data.models?.[id ?? ctx.mem.model ?? MODEL_IDS[0]] ?? ctx.data.models?.[MODEL_IDS[0]] ?? FALLBACK;
/** The cache step, the plan and the fleet all run on the first model, which has a cached price. */
const opus = (ctx: Ctx): Price => price(ctx, MODEL_IDS[0]);

// ---------- the made-up job, in thousands of tokens ----------

export const JOB = 'the date fix';
const START = 18; // instructions and tool definitions, in the window before you say anything
const ASK = 0.3;
interface Turn { says: Record<Level, string>; tool?: string; file?: number; w: number; r: number; kind?: Kind; result?: Record<Level, string> }
// Every line is a bubble on the picture, so about 38 characters: the model's at its cap, a tool's
// result at the tool.
const TURNS: Turn[] = [
  {
    says: { plain: 'Find where the list formats dates.', technical: 'Search the repo for date formatting.', engineer: 'Find where dates are parsed and shown.' },
    tool: 'search', file: 1, w: 0.3, r: 2,
    result: { plain: 'Found 2 files that handle dates.', technical: '2 matches: members.ts, dates.test.ts', engineer: 'members.ts parses and renders in one.' },
  },
  {
    says: { plain: 'Open the member list file.', technical: 'Read members.ts and its date parser.', engineer: 'Read members.ts: format and types.' },
    tool: 'read', file: 1, w: 0.2, r: 6,
    result: { plain: 'Read 84 lines of the member list.', technical: '84 lines of members.ts read.', engineer: '84 lines; the date is split by hand.' },
  },
  {
    says: { plain: 'Fix how the date is shown.', technical: 'Change parseDate() in members.ts.', engineer: 'Split out a typed parseMemberDate().' },
    tool: 'edit', file: 1, w: 0.9, r: 0.5,
    result: { plain: 'Changed the member list.', technical: 'members.ts changed.', engineer: 'members.ts: parser split from render.' },
  },
  {
    says: { plain: 'Check whether the dates look right.', technical: 'Run tsc --noEmit and the date tests.', engineer: 'Run tsc and the date edge-case tests.' },
    tool: 'run', w: 0.15, r: 4, kind: 'bad',
    result: { plain: 'Check failed: day and month swapped.', technical: '1 of 12 tests fails: day, month swapped.', engineer: '1 of 12 fails: DD/MM against MM/DD.' },
  },
  {
    says: { plain: 'Swap the day and month back.', technical: 'Fix the day and month order.', engineer: 'Fix the order; reject non-ISO input.' },
    tool: 'edit', file: 1, w: 0.6, r: 0.8,
    result: { plain: 'Changed the member list again.', technical: 'members.ts changed.', engineer: 'members.ts changed.' },
  },
  {
    says: { plain: 'Check the dates again.', technical: 'Run tsc and all 12 tests again.', engineer: 'Run the type check and the suite.' },
    tool: 'run', w: 0.15, r: 2.5,
    result: { plain: 'All dates right: 12 of 12 pass.', technical: 'tsc clean; 12 of 12 tests pass.', engineer: 'tsc clean; 12 of 12 pass in 140 ms.' },
  },
  {
    says: { plain: 'Fixed: day then month, 12 of 12 pass.', technical: 'Fixed. tsc clean, 12 of 12 pass.', engineer: 'Fixed. Typed parser, all green.' },
    w: 0.4, r: 0,
  },
];
/** "Change effort halfway": the turn whose request misses the cache. */
const MISS_AT = 3;

export type Cache = 'off' | 'on' | 'break';
export interface TurnBill { read: number; cached: number; stored: number; written: number; usd: number }
/**
 * What each turn reads and writes, in thousands of tokens, and what it costs at a price.
 * Cache off: every token read is billed at the input price.
 * Cache on: what the previous request read comes from the cache (cache read); the rest is new and
 * is stored in the cache as it is read (cache write, `cacheWrite` times the input price).
 * Break: the request at MISS_AT finds nothing in the cache and stores its whole window again.
 */
export function bill(p: Price, cache: Cache, cacheWrite: number): TurnBill[] {
  let window = START + ASK, prev = 0;
  const priced = cache !== 'off' && p.cacheRead != null;
  return TURNS.map((t, i) => {
    const read = window;
    const cached = priced && !(cache === 'break' && i === MISS_AT) ? prev : 0;
    const stored = priced ? read - cached : 0;
    const usd = priced
      ? (cached * p.cacheRead! + stored * p.input * cacheWrite + t.w * p.output) / 1000
      : (read * p.input + t.w * p.output) / 1000;
    prev = read;
    window = read + t.w + t.r;
    return { read, cached, stored, written: t.w, usd };
  });
}
export const JOB_TURNS = TURNS.length;
/** Made-up: how many times each agent runs the job in an hour. */
export const JOBS_PER_HOUR = 4;
/** The sums for one job, in whole tokens and dollars, for the page to state so a reader can redo them. */
export function sums(p: Price, cache: Cache, cacheWrite: number) {
  const b = bill(p, cache, cacheWrite);
  const add = (f: (t: TurnBill) => number) => Math.round(b.reduce((n, t) => n + f(t), 0) * 1000);
  const usd = b.reduce((n, t) => n + t.usd, 0);
  return { read: add((t) => t.read), cached: add((t) => t.cached), stored: add((t) => t.stored), written: add((t) => t.written), usd, perAgentHour: usd * JOBS_PER_HOUR };
}

// ---------- the readout ----------

const tok = (k: number) => Math.round(k * 1000).toLocaleString('en-GB');
/** A job's price to a tenth of a cent, so sums can be redone; an hour's to the cent. */
export const usd3 = (n: number) => `$${n.toFixed(3)}`;
export const usd2 = (n: number) => `$${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
interface Tally { turns: number; read: number; cached: number; stored: number; written: number; usd: number; used: number }
const zero = (): Tally => ({ turns: 0, read: 0, cached: 0, stored: 0, written: 0, usd: 0, used: 0 });
type Mode = 'none' | 'api' | 'plan';
interface ShowOpts { mode: Mode; cache: Cache | 'none'; turns?: string; hour?: boolean; jobs?: number }
/**
 * One readout for the lesson, the same names in the same order on every step. Plain readers see
 * what was read, how much of it came from the cache, what was written and the cost; technical
 * readers see the four token counts a bill is made of.
 */
function show(ctx: Ctx, t: Tally, o: ShowOpts) {
  const on = o.cache === 'on' || o.cache === 'break';
  const costName = o.mode === 'plan' ? 'allowance used' : o.hour ? 'cost of the hour' : 'cost of the job';
  const cost: [string, string, string?] = o.mode === 'none' ? [costName, 'no meter yet']
    : o.mode === 'plan' ? [costName, `${Math.round(t.used * 100)}%`, 'made-up rate']
    : [costName, o.hour ? usd2(t.usd) : usd3(t.usd), on ? 'cache on' : 'cache off'];
  const share = t.read ? Math.round((t.cached / t.read) * 100) : 0;
  // A plan runs several date fixes on one allowance, and the fleet many at once: count all their turns.
  const turns = o.turns ?? (o.mode === 'plan' ? `${t.turns}` : `${t.turns} of ${TURNS.length}`);
  const turnsName = o.turns ? 'turns, all agents' : o.mode === 'plan' ? 'turns, all date fixes' : 'turns of the date fix';
  if (ctx.level === 'plain') {
    ctx.stat([
      [turnsName, turns],
      ['tokens read, all turns', tok(t.read)],
      ['of those, from the cache', o.cache === 'none' ? 'no cache yet' : on ? `${tok(t.cached)} (${share}%)` : '0', ...(o.cache === 'off' ? ['cache off'] : [])] as [string, string, string?],
      ['written by the model', tok(t.written)],
      cost,
    ]);
  } else {
    ctx.stat([
      [turnsName, turns],
      ['input read, all turns', tok(t.read)],
      ['cache reads', o.cache === 'none' ? '–' : tok(t.cached)],
      ['cache writes', o.cache === 'none' ? '–' : tok(t.stored)],
      ['output written', tok(t.written)],
      cost,
    ]);
  }
}
const add = (t: Tally, b: TurnBill, n = 1) => { t.turns += n; t.read += n * b.read; t.cached += n * b.cached; t.stored += n * b.stored; t.written += n * b.written; t.usd += n * b.usd; };

/** The sum behind a price, written out so it can be redone: tokens times price per million. */
function sumLine(p: Price, cache: Cache, cw: number, n = 1): string {
  const s = sums(p, cache, cw);
  const x = (k: number) => (k * n).toLocaleString('en-GB');
  const m = (v: number) => `$${+v.toFixed(2)}`;
  return cache === 'off' || p.cacheRead == null
    ? `${x(s.read)} × ${m(p.input)} + ${x(s.written)} × ${m(p.output)}, per million tokens`
    : `${x(s.cached)} × ${m(p.cacheRead)} + ${x(s.stored)} × ${m(p.input * cw)} + ${x(s.written)} × ${m(p.output)}, per million tokens`;
}

// ---------- the picture ----------

const meterLabel = (mode: Mode) => termLabel([SPOT.meter[0] + 13, SPOT.meter[1] + 13, 0], mode === 'api' ? 'api' : 'plan', 'bottom', mode === 'api' ? 'the API' : 'a plan');
const base = (ctx: Ctx, mode: Mode, name?: string): SceneState => solo({
  tools: true, project: true,
  blocks: [{ t: 'rules', h: START }],
  meter: mode === 'none' ? undefined : mode,
  labels: [
    lab('you', 'you', 'left'), termLabel('a0', 'model', 'top', name ?? 'the model'), termLabel([15, -15, 44], 'window', 'right', 'its window'),
    termLabel('tools', 'tools'), termLabel('project', 'project', 'top', 'your project'),
    ...(mode === 'none' ? [] : [meterLabel(mode)]),
  ],
});

/** Five cents a coin on one job; the fleet uses a dollar. */
const COIN = 0.05;
/** Made-up: one job uses this share of the allowance. The provider publishes no figure. */
const DRAIN = 0.27;

interface JobOpts { mode: Mode; cache: Cache; p: Price; t: Tally; ms?: number; intro?: string }
/** Play the job once. Returns false if the allowance ran out part-way. */
async function job(ctx: Ctx, h: Script, o: JobOpts): Promise<boolean> {
  const { scene, level } = ctx;
  const cw: number = ctx.data.cacheWrite ?? 1;
  const turns = bill(o.p, o.cache, cw);
  const readAll = turns.reduce((n, t) => n + t.read, 0);
  const who = o.mode === 'none' ? 'the model' : o.p.name;
  const ms = o.ms ?? 1;
  const view: ShowOpts = { mode: o.mode, cache: o.mode === 'none' ? 'none' : o.cache };
  h.set((s) => { const a = s.agents[0]!; a.blocks = [{ t: 'rules', h: START }]; a.lamp = 'off'; s.project!.files = ['', '', '', '', '', '']; });
  if (o.intro) { ctx.say(null, o.intro); show(ctx, o.t, view); await h.wait(1600 * ms); }
  ctx.say('you', byLevel(level, {
    plain: 'The member list dates are back to front.',
    technical: 'Fix the swapped day/month in members.ts.',
    engineer: 'Fix DD/MM in members.ts; prove it.',
  }));
  show(ctx, o.t, view);
  await h.send(route.youToAgent(), 'you', { ms: 420 * ms });
  await h.wait(600 * ms);
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: ASK }); s.agents[0]!.lamp = 'work'; });
  for (const [i, turn] of TURNS.entries()) {
    const b = turns[i]!;
    // The model reads its whole window, from the bottom up.
    h.set((s) => { const a = s.agents[0]!; a.busy = true; a.scan = true; });
    // The window says what this turn reads again, and with the cache on, how much of it is a hit.
    const miss = o.cache === 'break' && i === MISS_AT;
    ctx.say('window', view.cache === 'none' || o.cache === 'off' ? (i ? `Turn ${i + 1}: reads all ${tok(b.read)} again.` : `Turn 1: reads ${tok(b.read)} tokens.`)
      : miss ? `Miss: all ${tok(b.read)} read new.` : b.cached ? `Hit: ${tok(b.cached)} of ${tok(b.read)} cached.` : `Turn 1: ${tok(b.read)} read, and stored.`);
    if (miss) {
      ctx.say(null, byLevel(level, {
        plain: `Turn ${i + 1}: you changed the effort level, so the cache misses. All ${tok(b.read)} tokens are read new and stored again.`,
        technical: `Turn ${i + 1}: effort changed, the cache misses. ${tok(b.read)} tokens are written to the cache at ${usd2(o.p.input * cw)} a million, not read from it at ${usd2(o.p.cacheRead ?? 0)}.`,
        engineer: `Turn ${i + 1}: effort changed, so the prefix no longer matches. The whole ${tok(b.read)}-token window is a cache write at ${cw}× input; later turns hit the new entry.`,
      }));
      h.set((s) => { s.agents[0]!.lamp = 'bad'; });
      await h.wait(900 * ms);
    }
    await h.wait(1000 * ms);
    if (o.mode === 'plan') {
      const left = (scene.state.meters![0]!.level) - (DRAIN * b.read) / readAll;
      if (left <= 0) {
        h.set((s) => { const a = s.agents[0]!; a.busy = false; a.scan = false; a.lamp = 'wait'; s.meters![0]!.level = 0; s.meters![0]!.lamp = 'wait'; });
        ctx.say('meter', 'Empty. Wait for the reset.');
        o.t.used = 1;
        show(ctx, o.t, view);
        return false;
      }
      h.set((s) => { s.meters![0]!.level = left; });
      o.t.used = 1 - left;
    }
    add(o.t, b);
    if (o.mode === 'api') h.set((s) => { s.meters![0]!.level = o.t.usd / COIN; });
    show(ctx, o.t, view);
    h.set((s) => { const a = s.agents[0]!; a.scan = false; a.busy = false; a.lamp = 'work'; a.blocks!.push({ t: 'model', h: turn.w }); });
    await h.wait(300 * ms);
    ctx.say(who, turn.says[level]);
    if (!turn.tool) break;
    const tools = scene.state.tools!, project = scene.state.project!;
    await h.send(route.agentToTool(tools, turn.tool), 'model', { ms: 340 * ms });
    h.set((s) => { s.tools!.on = turn.tool!; });
    if (turn.file != null) {
      await h.send(route.toolToFile(tools, turn.tool, project, turn.file).slice(1), 'model', { ms: 320 * ms });
      h.set((s) => { s.project!.files![turn.file!] = turn.tool === 'edit' ? 'edit' : 'read'; });
    } else await h.wait(280 * ms);
    await h.send(reverse(route.agentToTool(tools, turn.tool)), turn.kind ?? 'tool', { ms: 340 * ms });
    h.set((s) => { s.tools!.on = null; s.agents[0]!.blocks!.push({ t: turn.kind ?? 'tool', h: turn.r }); });
    ctx.say('tool', turn.result![level]);
    await h.wait(420 * ms);
  }
  h.set((s) => { s.agents[0]!.lamp = 'ok'; });
  await h.send(reverse(route.youToAgent()), 'model', { ms: 420 * ms });
  return true;
}

// ---------- steps ----------

function note(ctx: Ctx, step: string) {
  const n = STEP_NOTES.meter?.[step];
  if (n) ctx.model(n.part, n.text[ctx.level]);
}

function playCount(ctx: Ctx) {
  note(ctx, 'count');
  void ctx.scene.run(async (h) => {
    const t = zero();
    await job(ctx, h, { mode: 'none', cache: 'off', p: opus(ctx), t });
    ctx.say(null, byLevel(ctx.level, {
      plain: `${JOB[0]!.toUpperCase() + JOB.slice(1)}: ${t.turns} turns read ${tok(t.read)} tokens between them and wrote ${tok(t.written)}. Reading is most of the work.`,
      technical: `${t.turns} turns: ${tok(t.read)} input tokens read, ${tok(t.written)} output tokens written. The 18,000 tokens of instructions at the bottom were read ${t.turns} times.`,
      engineer: `${t.turns} turns: ${tok(t.read)} in, ${tok(t.written)} out. Each turn's input is the whole window so far, so input grows with the square of the turn count.`,
    }));
  });
}

function playApi(ctx: Ctx, intro?: string) {
  note(ctx, 'api');
  const p = price(ctx), cw: number = ctx.data.cacheWrite ?? 1;
  void ctx.scene.run(async (h) => {
    h.set((s) => { Object.assign(s, base(ctx, 'api', p.name)); });
    const t = zero();
    await job(ctx, h, { mode: 'api', cache: 'off', p, t, intro });
    const readPart = Math.round(((t.read * p.input) / 1000 / t.usd) * 100);
    ctx.say(null, ctx.level === 'plain'
      ? `${JOB[0]!.toUpperCase() + JOB.slice(1)} at ${p.name}’s prices, cache off: ${usd3(t.usd)}. ${readPart}% of that is paying for reading. A coin is five cents.`
      : `${p.name}, cache off: ${sumLine(p, 'off', cw)} = ${usd3(t.usd)}. Reading is ${readPart}% of it.`);
  });
}

function playCache(ctx: Ctx, intro?: string) {
  note(ctx, 'cache');
  const p = opus(ctx), cache: Cache = ctx.mem.cache ?? 'on', cw: number = ctx.data.cacheWrite ?? 1;
  void ctx.scene.run(async (h) => {
    h.set((s) => { Object.assign(s, base(ctx, 'api', p.name)); });
    const t = zero();
    await job(ctx, h, { mode: 'api', cache, p, t, intro });
    const on = sums(p, 'on', cw), off = sums(p, 'off', cw);
    const share = Math.round((t.cached / t.read) * 100);
    if (ctx.level === 'plain') {
      ctx.say(null, cache === 'off' ? `Cache off: ${usd3(t.usd)}. The same job with the cache on: ${usd3(on.usd)}.`
        : cache === 'on' ? `Cache on: ${usd3(t.usd)}. ${share}% of what it read came from the cache; the other ${tok(t.stored)} tokens were read new and stored in it. Cache off: ${usd3(off.usd)}.`
        : `One missed turn: ${usd3(t.usd)}, against ${usd3(on.usd)} with no miss. Still less than ${usd3(off.usd)} with the cache off.`);
    } else {
      ctx.say(null, `Cache ${cache === 'off' ? 'off' : 'on'}${cache === 'break' ? ', one miss' : ''}: ${sumLine(p, cache, cw)} = ${usd3(t.usd)}.${cache === 'on' ? ` ${share}% of reads hit the cache.` : ''}`);
    }
  });
}

function playPlan(ctx: Ctx, again = false) {
  note(ctx, 'plan');
  const p = opus(ctx);
  const fee: number | undefined = ctx.data.proPrice;
  const view: ShowOpts = { mode: 'plan', cache: 'on' };
  void ctx.scene.run(async (h) => {
    if (!again || !ctx.mem.t) { h.set((s) => { Object.assign(s, base(ctx, 'plan', p.name)); }); ctx.mem.t = zero(); ctx.mem.jobs = 0; }
    if (ctx.scene.state.meters![0]!.level <= 0.001) {
      ctx.say(null, 'Five hours after the first message, the limit resets in full.');
      h.set((s) => { s.meters![0]!.level = 1; s.meters![0]!.lamp = 'off'; s.agents[0]!.lamp = 'off'; });
      ctx.mem.t = zero();
      ctx.mem.jobs = 0;
      show(ctx, ctx.mem.t, view);
      await h.wait(1500);
    }
    await playPlanRun(ctx, h, p, fee, view, again);
  });
}
async function playPlanRun(ctx: Ctx, h: Script, p: Price, fee: number | undefined, base0: ShowOpts, again = false) {
  const t: Tally = ctx.mem.t;
  const view = base0;
  const done = await job(ctx, h, { mode: 'plan', cache: 'on', p, t, ms: again ? 0.8 : 1 });
  if (done) {
    ctx.mem.jobs++;
    ctx.say(null, `Date fix ${ctx.mem.jobs} done: ${Math.round((1 - t.used) * 100)}% of the allowance left${fee != null ? `, and the bill is still $${fee} for the month` : ''}. Made-up rate: one date fix uses ${Math.round(DRAIN * 100)}%, spread over its turns by how much each reads.`);
  } else {
    ctx.say(null, `The allowance ran out part-way through date fix ${ctx.mem.jobs + 1}. The model stops until the limit resets.`);
  }
  show(ctx, t, view);
}

// ----- many: twenty agents, one meter -----

const TICKS_PER_HOUR = TURNS.length * JOBS_PER_HOUR;
const fleet = (n: number, mode: 'plan' | 'api'): SceneState => {
  const s = team(n, { trees: true, lead: [{ t: 'rules', h: 4 }, { t: 'you', h: 3 }], labels: [lab('you', 'you', 'left'), termLabel('a0', 'lead', 'top', 'the lead'), termLabel('project', 'main'), meterLabel(mode)] });
  const m: Meter = { id: 'm0', at: SPOT.meter, mode, level: mode === 'plan' ? 1 : 0 };
  s.meters = [m];
  s.tracks!.push([[SPOT.meter[0] + 14, 0], [-18, 0]]);
  s.focus = ['you', 'a0', 'project', 'meter:m0', [-88, -254, 30], [88, -254, 30], [-110, BUS_Y, 0]];
  return s;
};
function playMany(ctx: Ctx) {
  note(ctx, 'many');
  const n: number = ctx.mem.n ?? 20, mode: 'plan' | 'api' = ctx.mem.mode ?? 'plan';
  const p = opus(ctx), cw: number = ctx.data.cacheWrite ?? 1;
  const turns = bill(p, 'on', cw);
  const readAll = turns.reduce((x, b) => x + b.read, 0);
  const DOLLAR = 1;
  const hour = n * sums(p, 'on', cw).perAgentHour;
  const agents = `${n} ${n === 1 ? 'agent' : 'agents'}`;
  ctx.say(null, mode === 'plan'
    ? `${agents} on one plan, each running ${JOB} ${JOBS_PER_HOUR} times an hour.`
    : `${agents} on one API bill at ${p.name}’s prices, cache on, each running ${JOB} ${JOBS_PER_HOUR} times an hour. A coin is a dollar.`);
  void ctx.scene.run(async (h) => {
    h.set((s) => { Object.assign(s, fleet(n, mode)); });
    const t = zero();
    let jobs = 0, tick = 0, empty = false;
    const view = (): ShowOpts => ({ mode, cache: 'on', turns: `${t.turns} (${jobs} jobs done)`, hour: true });
    show(ctx, t, view());
    for (; tick < TICKS_PER_HOUR; tick++) {
      const i = tick % TURNS.length;
      const b = turns[i]!;
      if (mode === 'plan') {
        const left = ctx.scene.state.meters![0]!.level - (n * DRAIN * b.read) / readAll;
        if (left <= 0) { empty = true; break; }
        h.set((s) => { s.meters![0]!.level = left; });
        t.used = 1 - left;
      }
      add(t, b, n);
      h.set((s) => {
        if (mode === 'api') s.meters![0]!.level = t.usd / DOLLAR;
        for (const a of s.agents.slice(1)) {
          a.busy = true; a.lamp = 'work';
          if (i === 0) a.blocks = [{ t: 'rules', h: START / 2 }];
          a.blocks!.push({ t: TURNS[i]!.kind ?? (i % 2 ? 'model' : 'tool'), h: Math.max(1.2, TURNS[i]!.r) });
        }
      });
      if (i === TURNS.length - 1) {
        jobs += n;
        h.set((s) => { for (const a of s.agents.slice(1)) a.lamp = 'ok'; (s.project!.commits ??= []).push('ok'); });
      }
      show(ctx, t, view());
      await h.wait(mode === 'plan' ? 420 : 260);
    }
    if (empty) {
      h.set((s) => { s.meters![0]!.level = 0; s.meters![0]!.lamp = 'wait'; for (const a of s.agents) { a.busy = false; a.lamp = 'wait'; } });
      ctx.say('meter', `Empty: all ${n} wait for the reset.`);
      t.used = 1;
      show(ctx, t, view());
      const min = Math.max(1, Math.round((tick / TICKS_PER_HOUR) * 60));
      ctx.say(null, `The allowance ran out after ${min} ${min === 1 ? 'minute' : 'minutes'}, ${tick} ${tick === 1 ? 'turn' : 'turns'} each. All ${n} stopped mid-job; ${jobs} ${jobs === 1 ? 'job' : 'jobs'} finished. ${n} × ${JOBS_PER_HOUR} date fixes an hour × a made-up ${Math.round(DRAIN * 100)}% each = ${n * JOBS_PER_HOUR * Math.round(DRAIN * 100)}% of the allowance an hour. On the API they would have kept going, at ${usd2(hour)} an hour.`);
    } else {
      h.set((s) => { for (const a of s.agents.slice(1)) a.busy = false; });
      ctx.say(null, mode === 'api'
        ? (ctx.level === 'plain'
          ? `${agents}, ${jobs} date fixes in an hour: ${usd2(t.usd)}. An eight-hour day at that pace: ${usd2(t.usd * 8)}.`
          : `${jobs} jobs: ${sumLine(p, 'on', cw, jobs)} = ${usd2(t.usd)} for the hour; ${usd2(t.usd * 8)} for eight.`)
        : `${jobs} jobs in an hour, ${Math.round((1 - t.used) * 100)}% of the allowance left.`);
    }
  });
}

/** One short loop of this lesson, for the part 3 overview: a job drains the last of a plan. */
export async function demo(ctx: Ctx, h: Script) {
  // No note here: the overview shows the lesson's own summary under the picture.
  const p = opus(ctx);
  h.set((s) => { Object.assign(s, base(ctx, 'plan', p.name)); s.meters![0]!.level = 0.42; });
  const t = zero();
  t.used = 0.58;
  const done = await job(ctx, h, { mode: 'plan', cache: 'on', p, t, ms: 0.5 });
  ctx.say(null, done ? 'Date fix done.' : 'The allowance is empty part-way through the date fix. The model stops until the limit resets.');
  await h.wait(1600);
}

/**
 * The chip: the bill or the allowance when there is a meter, the turn before there is one. The
 * readout's last line is always the cost.
 */
const costChip = (pairs: [string, string | number, string?][]) => {
  const cost = pairs[pairs.length - 1];
  if (!cost) return null;
  if (cost[1] === 'no meter yet') return `turn ${pairs[0]?.[1] ?? 0}`;
  return `${cost[0]} ${cost[1]}`;
};

export const meter: Chapter = {
  counter: costChip,
  // The window says what each turn reads again; the meter says when it is empty. Tool results
  // stay at the tools.
  speakers: { window: 'tank:a0', meter: 'meter:m0' },
  steps: {
    count: { scene: (ctx) => base(ctx, 'none'), enter: (ctx) => playCount(ctx) },
    api: { scene: (ctx) => base(ctx, 'api', price(ctx).name), enter: (ctx) => playApi(ctx) },
    cache: { scene: (ctx) => base(ctx, 'api', opus(ctx).name), enter: (ctx) => { ctx.mem.cache = 'on'; playCache(ctx); } },
    plan: { scene: (ctx) => base(ctx, 'plan', opus(ctx).name), enter: (ctx) => playPlan(ctx) },
    many: { scene: () => fleet(20, 'plan'), enter: (ctx) => { ctx.mem.n = 20; ctx.mem.mode = 'plan'; playMany(ctx); } },
  },
  actions: {
    model: (ctx, val) => {
      ctx.mem.model = val;
      const p = price(ctx);
      const line = `${p.name}: $${p.input} per million tokens read, $${p.output} per million written. The same date fix, cache off.`;
      ctx.say(null, line);
      playApi(ctx, line);
    },
    cache: (ctx, val) => {
      ctx.mem.cache = val as Cache;
      const p = opus(ctx), cw: number = ctx.data.cacheWrite ?? 1;
      const line = val === 'off' ? `Cache off: every token read costs $${p.input} a million.`
        : val === 'on' ? `Cache on: what was read last turn costs $${p.cacheRead} a million; new tokens cost $${+(p.input * cw).toFixed(2)} a million to store.`
        : `Cache on, and you change the effort level before turn ${MISS_AT + 1}.`;
      ctx.say(null, line);
      playCache(ctx, line);
    },
    another: (ctx) => playPlan(ctx, true),
    mode: (ctx, val) => { ctx.mem.mode = val; playMany(ctx); },
  },
  inputs: {
    n: (ctx, val) => { ctx.mem.n = Number(val); playMany(ctx); },
  },
};
