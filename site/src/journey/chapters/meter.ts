// Chapter 10: what it draws from. A made-up job (the date fix from chapter 2) is counted turn by
// turn: every turn reads the whole window again and writes a little. On the API those tokens are
// multiplied by the real prices the page hands over; on a plan they drain an allowance at a made-up
// rate, because the provider publishes no figure for it.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, team, lab } from '../presets';
import { route, reverse, SPOT, BUS_Y, type Kind, type SceneState, type Meter } from '../picture';

/** Prices per million tokens, from src/data/models.ts via the page. */
interface Price { name: string; input: number; output: number; cacheRead?: number }
const MODEL_IDS = ['claude-opus-5-5', 'claude-fable-5-2', 'gpt-6-2-sol'] as const;
const price = (ctx: Ctx, id?: string): Price => ctx.data.models?.[id ?? ctx.mem.model ?? MODEL_IDS[0]] ?? ctx.data.models?.[MODEL_IDS[0]];
/** The model the cache step and the fleet run on: the one picked, if the data has a cached price for it. */
const cached = (ctx: Ctx): Price => { const p = price(ctx); return p?.cacheRead != null ? p : price(ctx, MODEL_IDS[0]); };

// ---------- the made-up job, in thousands of tokens ----------

const START = 18; // instructions and tool definitions, in the window before you say anything
const ASK = 0.3;
interface Turn { says: string; tool?: string; file?: number; w: number; r: number; kind?: Kind; result?: string }
const TURNS: Turn[] = [
  { says: 'Search the project for “date”.', tool: 'search', file: 1, w: 0.3, r: 2, result: '2 files mention dates' },
  { says: 'Read members.ts.', tool: 'read', file: 1, w: 0.2, r: 6, result: '84 lines of members.ts' },
  { says: 'Change how the date is read.', tool: 'edit', file: 1, w: 0.9, r: 0.5, result: 'members.ts changed' },
  { says: 'Run the tests.', tool: 'run', w: 0.15, r: 4, kind: 'bad', result: '1 of 12 tests fails' },
  { says: 'Fix the day and month order.', tool: 'edit', file: 1, w: 0.6, r: 0.5, result: 'members.ts changed' },
  { says: 'Run the tests again.', tool: 'run', w: 0.15, r: 2.5, result: '12 of 12 tests pass' },
  { says: 'Fixed. The day and month were swapped. All 12 tests pass.', w: 0.4, r: 0 },
];
type Cache = 'off' | 'on' | 'break';
/** What turn i reads and writes, and what it costs at a price. `break` misses the cache at turn 4. */
function bill(p: Price, cache: Cache, cacheWrite: number) {
  let window = START + ASK, prefix = 0;
  return TURNS.map((t, i) => {
    const read = window;
    const hit = cache === 'off' || p.cacheRead == null || (cache === 'break' && i === 3) ? 0 : prefix;
    const fresh = read - hit;
    const usd = cache === 'off' || p.cacheRead == null
      ? (read * p.input + t.w * p.output) / 1000
      : (hit * p.cacheRead! + fresh * p.input * cacheWrite + t.w * p.output) / 1000;
    prefix = read + t.w;
    window = read + t.w + t.r;
    return { read, hit, written: t.w, usd };
  });
}
const jobCost = (p: Price, cache: Cache, cw: number) => bill(p, cache, cw).reduce((n, t) => n + t.usd, 0);
/** Made-up: how many times each agent runs the job in an hour. */
export const JOBS_PER_HOUR = 4;
/** The fleet's sum, for the page to state so a reader can redo it: one job, with the cache. */
export function fleetSums(p: Price, cacheWrite: number) {
  const b = bill(p, 'on', cacheWrite);
  return {
    cached: Math.round(b.reduce((n, t) => n + t.hit, 0) * 1000),
    read: Math.round(b.reduce((n, t) => n + t.read, 0) * 1000),
    written: Math.round(b.reduce((n, t) => n + t.written, 0) * 1000),
    perJob: jobCost(p, 'on', cacheWrite),
    perAgentHour: jobCost(p, 'on', cacheWrite) * JOBS_PER_HOUR,
  };
}

// ---------- the readout ----------

const tok = (k: number) => Math.round(k * 1000).toLocaleString('en-GB');
const usd = (n: number) => n >= 100 ? `$${Math.round(n).toLocaleString('en-GB')}` : `$${n.toFixed(2)}`;
interface Tally { turns: number; read: number; written: number; usd: number; used: number }
const zero = (): Tally => ({ turns: 0, read: 0, written: 0, usd: 0, used: 0 });
type Mode = 'none' | 'api' | 'plan';
function show(ctx: Ctx, t: Tally, mode: Mode) {
  ctx.stat([
    ['turns', t.turns],
    ['tokens read, all turns', tok(t.read)],
    ['tokens written', tok(t.written)],
    ['what it cost', mode === 'none' ? 'no meter yet' : mode === 'api' ? usd(t.usd) : `${Math.round(t.used * 100)}% of the allowance`],
  ]);
}

// ---------- the picture ----------

const meterLabel = (mode: Mode) => lab([SPOT.meter[0] + 13, SPOT.meter[1] + 13, 0], mode === 'api' ? 'the API' : 'a plan', 'bottom', mode === 'api' ? 'wiki/api/' : 'wiki/subscription-plan/');
const base = (ctx: Ctx, mode: Mode, name?: string): SceneState => solo({
  tools: true, project: true,
  blocks: [{ t: 'rules', h: START }],
  meter: mode === 'none' ? undefined : mode,
  labels: [
    lab('you', 'you', 'left'), lab('a0', name ?? 'the model', 'top', 'wiki/model/'), lab([15, -15, 44], 'its window', 'right', 'wiki/context-window/'),
    lab('tools', 'tools', 'top', 'wiki/tool-call/'), lab('project', 'your project', 'top'),
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
  const { scene } = ctx;
  const cw: number = ctx.data.cacheWrite ?? 1;
  const turns = bill(o.p, o.cache, cw);
  const readAll = turns.reduce((n, t) => n + t.read, 0);
  const who = o.mode === 'none' ? 'model' : o.p.name;
  const ms = o.ms ?? 1;
  h.set((s) => { const a = s.agents[0]!; a.blocks = [{ t: 'rules', h: START }]; a.lamp = 'off'; s.project!.files = ['', '', '', '', '', '']; });
  if (o.intro) { ctx.say(null, o.intro); show(ctx, o.t, o.mode); await h.wait(1500 * ms); }
  ctx.say('you', 'The dates on the member list are wrong.');
  show(ctx, o.t, o.mode);
  await h.send(route.youToAgent(), 'you', { ms: 420 * ms });
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: ASK }); s.agents[0]!.lamp = 'work'; });
  for (const [i, turn] of TURNS.entries()) {
    const b = turns[i]!;
    // The model reads its whole window, from the bottom up.
    h.set((s) => { const a = s.agents[0]!; a.busy = true; a.scan = true; });
    if (o.cache === 'break' && i === 3) {
      ctx.say(null, 'Effort changed: the cache misses, and the whole window goes in at full price again.');
      h.set((s) => { s.agents[0]!.lamp = 'bad'; });
    }
    await h.wait(620 * ms);
    if (o.mode === 'plan') {
      const left = (scene.state.meters![0]!.level) - (DRAIN * b.read) / readAll;
      if (left <= 0) {
        h.set((s) => { const a = s.agents[0]!; a.busy = false; a.scan = false; a.lamp = 'wait'; s.meters![0]!.level = 0; s.meters![0]!.lamp = 'wait'; });
        o.t.used = 1;
        show(ctx, o.t, o.mode);
        return false;
      }
      h.set((s) => { s.meters![0]!.level = left; });
      o.t.used = 1 - left;
    }
    o.t.turns++; o.t.read += b.read; o.t.written += b.written; o.t.usd += b.usd;
    if (o.mode === 'api') h.set((s) => { s.meters![0]!.level = o.t.usd / COIN; });
    show(ctx, o.t, o.mode);
    h.set((s) => { const a = s.agents[0]!; a.scan = false; a.busy = false; a.lamp = 'work'; a.blocks!.push({ t: 'model', h: turn.w }); });
    ctx.say(who, turn.says);
    if (!turn.tool) break;
    const tools = scene.state.tools!, project = scene.state.project!;
    await h.send(route.agentToTool(tools, turn.tool), 'model', { ms: 360 * ms });
    h.set((s) => { s.tools!.on = turn.tool!; });
    if (turn.file != null) {
      await h.send(route.toolToFile(tools, turn.tool, project, turn.file).slice(1), 'model', { ms: 340 * ms });
      h.set((s) => { s.project!.files![turn.file!] = turn.tool === 'edit' ? 'edit' : 'read'; });
    } else await h.wait(300 * ms);
    await h.send(reverse(route.agentToTool(tools, turn.tool)), turn.kind ?? 'tool', { ms: 360 * ms });
    h.set((s) => { s.tools!.on = null; s.agents[0]!.blocks!.push({ t: turn.kind ?? 'tool', h: turn.r }); });
    ctx.say('tool', turn.result!);
    await h.wait(260 * ms);
  }
  h.set((s) => { s.agents[0]!.lamp = 'ok'; });
  await h.send(reverse(route.youToAgent()), 'model', { ms: 420 * ms });
  return true;
}

const readShare = (p: Price) => { const b = bill(p, 'off', 1); const r = b.reduce((n, t) => n + (t.read * p.input) / 1000, 0); return Math.round((r / b.reduce((n, t) => n + t.usd, 0)) * 100); };

// ---------- steps ----------

function playTurn(ctx: Ctx) {
  void ctx.scene.run(async (h) => {
    const t = zero();
    await job(ctx, h, { mode: 'none', cache: 'off', p: price(ctx), t });
    ctx.say(null, `${t.turns} turns read ${tok(t.read)} tokens between them and wrote ${tok(t.written)}.`);
  });
}

function playApi(ctx: Ctx, intro?: string) {
  const p = price(ctx);
  void ctx.scene.run(async (h) => {
    h.set((s) => { Object.assign(s, base(ctx, 'api', p.name)); });
    const t = zero();
    await job(ctx, h, { mode: 'api', cache: 'off', p, t, intro });
    ctx.say(null, `${t.turns} turns at ${p.name}’s prices: ${usd(t.usd)}. ${readShare(p)}% of that is reading.`);
  });
}

function playCache(ctx: Ctx, intro?: string) {
  const p = cached(ctx), cache: Cache = ctx.mem.cache ?? 'on', cw: number = ctx.data.cacheWrite ?? 1;
  void ctx.scene.run(async (h) => {
    h.set((s) => { Object.assign(s, base(ctx, 'api', p.name)); });
    const t = zero();
    await job(ctx, h, { mode: 'api', cache, p, t, intro });
    const off = usd(jobCost(p, 'off', cw)), on = usd(jobCost(p, 'on', cw));
    ctx.say(null, cache === 'off' ? `No cache: ${off}. The same job with the cache: ${on}.`
      : cache === 'on' ? `With the cache: ${on}. Without it: ${off}.`
      : `One miss at turn four: ${usd(t.usd)}, against ${on} with no miss and ${off} with no cache.`);
  });
}

function playPlan(ctx: Ctx, again = false) {
  const p = price(ctx, MODEL_IDS[0]);
  const fee: number | undefined = ctx.data.proPrice;
  void ctx.scene.run(async (h) => {
    if (!again) { h.set((s) => { Object.assign(s, base(ctx, 'plan', p.name)); }); ctx.mem.t = zero(); ctx.mem.jobs = 0; }
    const t: Tally = ctx.mem.t;
    if (ctx.scene.state.meters![0]!.level <= 0.001) {
      ctx.say(null, 'Five hours after the first message, the limit resets in full.');
      h.set((s) => { s.meters![0]!.level = 1; s.meters![0]!.lamp = 'off'; s.agents[0]!.lamp = 'off'; });
      t.used = 0;
      show(ctx, t, 'plan');
      await h.wait(1300);
    }
    const done = await job(ctx, h, { mode: 'plan', cache: 'on', p, t, ms: again ? 0.8 : 1 });
    if (done) {
      ctx.mem.jobs++;
      ctx.say(null, `Job ${ctx.mem.jobs} done. ${Math.round((1 - t.used) * 100)}% of the allowance left.${fee != null ? ` On Pro the bill stays $${fee} a month.` : ''}`);
    } else {
      ctx.say(null, `The allowance is empty part-way through job ${ctx.mem.jobs + 1}. The model stops until the limit resets.`);
    }
  });
}

// ----- many: twenty agents, one meter -----

const TICKS_PER_HOUR = TURNS.length * JOBS_PER_HOUR;
const fleet = (n: number, mode: 'plan' | 'api'): SceneState => {
  const s = team(n, { trees: true, lead: [{ t: 'rules', h: 4 }, { t: 'you', h: 3 }], labels: [lab('you', 'you', 'left'), lab('a0', 'the lead', 'top', 'wiki/orchestration/'), lab('project', 'main', 'top', 'wiki/branch/'), meterLabel(mode)] });
  const m: Meter = { id: 'm0', at: SPOT.meter, mode, level: mode === 'plan' ? 1 : 0 };
  s.meters = [m];
  s.tracks!.push([[SPOT.meter[0] + 14, 0], [-18, 0]]);
  s.focus = ['you', 'a0', 'project', 'meter:m0', [-88, -254, 30], [88, -254, 30], [-110, BUS_Y, 0]];
  return s;
};
function playMany(ctx: Ctx) {
  const n: number = ctx.mem.n ?? 20, mode: 'plan' | 'api' = ctx.mem.mode ?? 'plan';
  const p = cached(ctx), cw: number = ctx.data.cacheWrite ?? 1;
  const turns = bill(p, 'on', cw);
  const readAll = turns.reduce((x, b) => x + b.read, 0);
  const DOLLAR = 1;
  const hour = n * fleetSums(p, cw).perAgentHour;
  ctx.say(null, mode === 'plan'
    ? `${n} ${n === 1 ? 'agent draws' : 'agents draw'} from one allowance. On the API this sample hour would cost ${usd(hour)}.`
    : `${n} ${n === 1 ? 'agent' : 'agents'} on one bill: ${usd(hour)} for a sample hour at ${p.name}’s prices.`);
  void ctx.scene.run(async (h) => {
    h.set((s) => { Object.assign(s, fleet(n, mode)); });
    const t = zero();
    let jobs = 0, tick = 0, empty = false;
    show(ctx, t, mode);
    for (; tick < TICKS_PER_HOUR; tick++) {
      const i = tick % TURNS.length;
      const b = turns[i]!;
      if (mode === 'plan') {
        const left = ctx.scene.state.meters![0]!.level - (n * DRAIN * b.read) / readAll;
        if (left <= 0) { empty = true; break; }
        h.set((s) => { s.meters![0]!.level = left; });
        t.used = 1 - left;
      }
      t.turns += n; t.read += n * b.read; t.written += n * b.written; t.usd += n * b.usd;
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
      show(ctx, t, mode);
      await h.wait(mode === 'plan' ? 420 : 260);
    }
    if (empty) {
      h.set((s) => { s.meters![0]!.level = 0; s.meters![0]!.lamp = 'wait'; for (const a of s.agents) { a.busy = false; a.lamp = 'wait'; } });
      t.used = 1;
      show(ctx, t, mode);
      const min = Math.max(1, Math.round((tick / TICKS_PER_HOUR) * 60));
      ctx.say(null, `The allowance ran out after ${min} minutes. All ${n} stopped mid-job; ${jobs} ${jobs === 1 ? 'job' : 'jobs'} finished. On the API they would have kept going, at ${usd(hour)} an hour.`);
    } else {
      h.set((s) => { for (const a of s.agents.slice(1)) a.busy = false; });
      ctx.say(null, mode === 'api'
        ? `${n} ${n === 1 ? 'agent' : 'agents'}, ${jobs} jobs in an hour: ${usd(t.usd)}. An eight-hour day at that pace: ${usd(t.usd * 8)} (${p.name}’s real prices on illustrative token counts).`
        : `${jobs} jobs in an hour, ${Math.round((1 - t.used) * 100)}% of the allowance left.`);
    }
  });
}

/** One short loop of this chapter, for the part-two overview: a job drains the last of a plan. */
export async function demo(ctx: Ctx, h: Script) {
  const p: Price = price(ctx, MODEL_IDS[0]) ?? { name: 'the model', input: 0, output: 0 };
  h.set((s) => { Object.assign(s, base(ctx, 'plan', p.name)); s.meters![0]!.level = 0.42; });
  const t = zero();
  t.used = 0.58;
  const done = await job(ctx, h, { mode: 'plan', cache: 'on', p, t, ms: 0.5 });
  ctx.say(null, done ? 'Job done.' : 'The allowance is empty. The model stops until the limit resets.');
  await h.wait(1600);
}

export const meter: Chapter = {
  steps: {
    turn: { scene: (ctx) => base(ctx, 'none'), enter: (ctx) => playTurn(ctx) },
    api: { scene: (ctx) => base(ctx, 'api', price(ctx)?.name), enter: (ctx) => playApi(ctx) },
    cache: { scene: (ctx) => base(ctx, 'api', cached(ctx)?.name), enter: (ctx) => { ctx.mem.cache = 'on'; playCache(ctx); } },
    plan: { scene: (ctx) => base(ctx, 'plan', price(ctx, MODEL_IDS[0])?.name), enter: (ctx) => playPlan(ctx) },
    many: { scene: () => fleet(20, 'plan'), enter: (ctx) => { ctx.mem.n = 20; ctx.mem.mode = 'plan'; playMany(ctx); } },
  },
  actions: {
    model: (ctx, val) => {
      ctx.mem.model = val;
      const p = price(ctx);
      playApi(ctx, `${p.name}: $${p.input} per million tokens read, $${p.output} per million written.`);
    },
    cache: (ctx, val) => {
      ctx.mem.cache = val as Cache;
      const p = cached(ctx);
      playCache(ctx, val === 'off' ? `No cache: every token read costs $${p.input} a million.` : val === 'on' ? `With the cache: what was read before costs $${p.cacheRead} a million.` : 'This time you change the effort level halfway through.');
    },
    another: (ctx) => {
      if (!ctx.mem.t) { playPlan(ctx); return; }
      playPlan(ctx, true);
    },
    mode: (ctx, val) => { ctx.mem.mode = val; playMany(ctx); },
  },
  inputs: {
    n: (ctx, val) => { ctx.mem.n = Number(val); playMany(ctx); },
  },
};
