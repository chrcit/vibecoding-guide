// Chapter 10: what it draws from. A made-up job (the date fix from chapter 2) is counted turn by
// turn: every turn reads the whole window again and writes a little. On the API those tokens are
// multiplied by the real prices the page hands over; on a plan they drain an allowance at a made-up
// rate, because the provider publishes no figure for it.
import { byLevel, type Chapter, type Ctx, type Level } from '../chapter';
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
interface Turn { says: Record<Level, string>; tool?: string; file?: number; w: number; r: number; kind?: Kind; result?: Record<Level, string> }
const TURNS: Turn[] = [
  {
    says: {
      plain: 'Find where the member list formats dates.',
      technical: 'Search the repo for date formatting helpers.',
      engineer: 'Locate date parsing and formatting module boundaries.',
    },
    tool: 'search', file: 1, w: 0.3, r: 2,
    result: {
      plain: 'Found 2 files handling dates',
      technical: '2 matches: members.ts, dates.test.ts',
      engineer: '2 files: members.ts (UI + parser coupled), dates.test.ts',
    },
  },
  {
    says: {
      plain: 'Open the member list file.',
      technical: 'Read members.ts and its date parser.',
      engineer: 'Inspect members.ts to verify input format and type contract.',
    },
    tool: 'read', file: 1, w: 0.2, r: 6,
    result: {
      plain: 'Read 84 lines of the member list',
      technical: '84 lines of members.ts (6,000 tokens added to window)',
      engineer: '84 lines read; inline string split instead of ISO parser',
    },
  },
  {
    says: {
      plain: 'Fix how the date is shown.',
      technical: 'Update parseDate() in members.ts.',
      engineer: 'Extract typed parseMemberDate(iso: string) helper in members.ts.',
    },
    tool: 'edit', file: 1, w: 0.9, r: 0.5,
    result: {
      plain: 'Updated the member list',
      technical: 'members.ts updated',
      engineer: 'members.ts updated (pure parser separated from render)',
    },
  },
  {
    says: {
      plain: 'Check whether the dates look right now.',
      technical: 'Run tsc --noEmit and vitest on dates.test.ts.',
      engineer: 'Run strict typecheck and unit test suite across date edge cases.',
    },
    tool: 'run', w: 0.15, r: 4, kind: 'bad',
    result: {
      plain: 'Check failed: 3 March still showed as 03/03 swapped',
      technical: 'tsc passed; 1 of 12 unit tests fails (day/month swapped)',
      engineer: 'tsc clean; 1/12 unit test fails on DD/MM vs MM/DD boundary',
    },
  },
  {
    says: {
      plain: 'Swap the day and month into the right order.',
      technical: 'Fix the day/month capture order in parseDate().',
      engineer: 'Fix day/month destructuring and add explicit ISO guard.',
    },
    tool: 'edit', file: 1, w: 0.6, r: 0.5,
    result: {
      plain: 'Updated the member list again',
      technical: 'members.ts updated',
      engineer: 'members.ts updated',
    },
  },
  {
    says: {
      plain: 'Check the dates again.',
      technical: 'Re-run tsc --noEmit and all 12 unit tests.',
      engineer: 'Re-run typecheck and full unit suite to verify no regressions.',
    },
    tool: 'run', w: 0.15, r: 2.5,
    result: {
      plain: 'All dates match (12 of 12 checks pass)',
      technical: 'tsc clean; 12 of 12 unit tests pass',
      engineer: 'tsc clean; 12/12 unit tests pass in 140 ms',
    },
  },
  {
    says: {
      plain: 'Fixed. The member list now shows day then month, and all 12 checks pass.',
      technical: 'Fixed. Swapped day/month in parseDate(); tsc clean and 12 of 12 unit tests pass.',
      engineer: 'Fixed. Extracted typed date parser, resolved DD/MM bug, tsc + 12/12 unit tests green.',
    },
    w: 0.4, r: 0,
  },
];

const MODEL_NOTES: Record<'turn' | 'api' | 'cache' | 'plan' | 'many', Record<Level, [string, string]>> = {
  turn: {
    plain: ['Added to the model · The token counter:', 'Sits on the context window from step 3. Every back-and-forth step re-reads the entire conversation so far, which is why reading piles up much faster than writing.'],
    technical: ['Added to the model · Token accounting:', 'Attaches to the context window from step 3. Every tool call—file reads, tsc output, unit test logs—stays in the window and is re-read as input tokens on every subsequent turn.'],
    engineer: ['Added to the model · Quadratic input growth:', 'Each turn pays O(window) input tokens. Keeping modules focused and test logs concise directly shrinks the read footprint on every turn of the loop.'],
  },
  api: {
    plain: ['Added to the model · The API meter:', 'Sits beside the model and prices every token directly. Switching models changes the bill per feature, even when the job takes the exact same steps.'],
    technical: ['Added to the model · Pay-per-token API:', 'Multiplies every input read (files, typecheck + test logs) and output write by the model’s list price. Cheaper models lower cost per test-fix loop if they still pass verification.'],
    engineer: ['Added to the model · API unit economics:', 'Maps token volume to real $/PR. Because input tokens dominate (80%+ of cost), model choice and context discipline matter far more than reply verbosity.'],
  },
  cache: {
    plain: ['Added to the model · Prompt cache:', 'Remembers the part of the conversation the model already read on the previous turn, so repeat reads cost a fraction—unless you change settings mid-job.'],
    technical: ['Added to the model · Prefix caching:', 'Reuses the unchanged top of the window (instructions, tool schemas, earlier file reads) at ~10% of input cost. Toggling effort or editing top-level instructions busts the cache.'],
    engineer: ['Added to the model · Cache prefix stability:', 'Determines whether long verification loops stay cheap. Keep AGENTS.md, tool schemas, and effort level stable mid-thread so cache hits stay near 90% across test cycles.'],
  },
  plan: {
    plain: ['Added to the model · The plan tank:', 'Replaces the coin stack with a fixed-price allowance that drains as features run and refills on a timer—so heavy bursts pause instead of running up a surprise bill.'],
    technical: ['Added to the model · Subscription quota:', 'Draws every read, edit, typecheck, and test turn from a rolling five-hour and weekly cap. Predictable monthly cost, but long retry loops consume quota fast.'],
    engineer: ['Added to the model · Fixed-cap vs metered runtime:', 'Plans trade burst throughput for cost predictability. Good for interactive single-thread engineering; metered API or hybrid routing is needed when quota pauses block CI or fleets.'],
  },
  many: {
    plain: ['Added to the model · Shared fleet meter:', 'Connects every agent in the step 9 fleet to one tank or one bill. Twenty agents finishing features at once multiply how fast your allowance empties.'],
    technical: ['Added to the model · Parallel token burn:', 'Each parallel worker carries its own context window, file reads, and unit-test runs—all billed to the same plan or API key. Concurrency scales cost linearly.'],
    engineer: ['Added to the model · Fleet cost architecture:', 'Twenty concurrent worktrees amplify both throughput and token spend. Route routine typecheck/test loops to lighter models and reserve frontier models for architecture and review.'],
  },
};

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
    [ctx.level === 'plain' ? 'tokens read, all turns' : 'input tokens read', tok(t.read)],
    [ctx.level === 'plain' ? 'tokens written' : 'output tokens', tok(t.written)],
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
  const { scene, level } = ctx;
  const cw: number = ctx.data.cacheWrite ?? 1;
  const turns = bill(o.p, o.cache, cw);
  const readAll = turns.reduce((n, t) => n + t.read, 0);
  const who = o.mode === 'none' ? 'model' : o.p.name;
  const ms = o.ms ?? 1;
  h.set((s) => { const a = s.agents[0]!; a.blocks = [{ t: 'rules', h: START }]; a.lamp = 'off'; s.project!.files = ['', '', '', '', '', '']; });
  if (o.intro) { ctx.say(null, o.intro); show(ctx, o.t, o.mode); await h.wait(1200 * ms); }
  ctx.say('you', byLevel(level, {
    plain: 'The dates on the member list are in the wrong order.',
    technical: 'Fix the swapped day/month dates in members.ts and make sure tsc and the date unit tests pass.',
    engineer: 'Fix the DD/MM parsing bug in members.ts, separate the parser from rendering, and verify with strict tsc + unit tests.',
  }));
  show(ctx, o.t, o.mode);
  await h.send(route.youToAgent(), 'you', { ms: 420 * ms });
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: ASK }); s.agents[0]!.lamp = 'work'; });
  for (const [i, turn] of TURNS.entries()) {
    const b = turns[i]!;
    // The model reads its whole window, from the bottom up.
    h.set((s) => { const a = s.agents[0]!; a.busy = true; a.scan = true; });
    if (o.cache === 'break' && i === 3) {
      ctx.say(null, byLevel(level, {
        plain: 'Settings changed mid-job: the cache misses, so the whole conversation is billed at full price again.',
        technical: 'Effort changed at turn 4: prefix cache misses, and the full window is re-billed as uncached input.',
        engineer: 'Prefix invalidated at turn 4 (effort change): full window written back to cache at cache-write rate.',
      }));
      h.set((s) => { s.agents[0]!.lamp = 'bad'; });
    }
    await h.wait(560 * ms);
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
    await h.wait(240 * ms);
  }
  h.set((s) => { s.agents[0]!.lamp = 'ok'; });
  await h.send(reverse(route.youToAgent()), 'model', { ms: 420 * ms });
  return true;
}

const readShare = (p: Price) => { const b = bill(p, 'off', 1); const r = b.reduce((n, t) => n + (t.read * p.input) / 1000, 0); return Math.round((r / b.reduce((n, t) => n + t.usd, 0)) * 100); };

// ---------- steps ----------

function setModelNote(ctx: Ctx, key: keyof typeof MODEL_NOTES) {
  const [part, text] = MODEL_NOTES[key][ctx.level];
  ctx.model(part, text);
}

function playTurn(ctx: Ctx) {
  setModelNote(ctx, 'turn');
  void ctx.scene.run(async (h) => {
    const t = zero();
    await job(ctx, h, { mode: 'none', cache: 'off', p: price(ctx), t });
    ctx.say(null, `${t.turns} turns read ${tok(t.read)} input tokens between them and wrote ${tok(t.written)} output tokens.`);
  });
}

function playApi(ctx: Ctx, intro?: string) {
  setModelNote(ctx, 'api');
  const p = price(ctx);
  void ctx.scene.run(async (h) => {
    h.set((s) => { Object.assign(s, base(ctx, 'api', p.name)); });
    const t = zero();
    await job(ctx, h, { mode: 'api', cache: 'off', p, t, intro, ms: intro ? 0.85 : 1 });
    ctx.say(null, `Same ${t.turns}-turn date fix at ${p.name}’s prices: ${usd(t.usd)} (${readShare(p)}% is input reading).`);
  });
}

function playCache(ctx: Ctx, intro?: string) {
  setModelNote(ctx, 'cache');
  const p = cached(ctx), cache: Cache = ctx.mem.cache ?? 'on', cw: number = ctx.data.cacheWrite ?? 1;
  void ctx.scene.run(async (h) => {
    h.set((s) => { Object.assign(s, base(ctx, 'api', p.name)); });
    const t = zero();
    await job(ctx, h, { mode: 'api', cache, p, t, intro });
    const off = usd(jobCost(p, 'off', cw)), on = usd(jobCost(p, 'on', cw));
    ctx.say(null, cache === 'off' ? `No cache: ${off}. The same job with the cache: ${on}.`
      : cache === 'on' ? `With the cache: ${on}. Without it: ${off}.`
      : `One cache miss at turn 4: ${usd(t.usd)}, against ${on} with no miss and ${off} with no cache.`);
  });
}

function playPlan(ctx: Ctx, again = false) {
  setModelNote(ctx, 'plan');
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
  setModelNote(ctx, 'many');
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
  setModelNote(ctx, 'plan');
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
      playApi(ctx, `${p.name}: $${p.input} per million input tokens, $${p.output} per million output tokens.`);
    },
    cache: (ctx, val) => {
      ctx.mem.cache = val as Cache;
      const p = cached(ctx);
      playCache(ctx, val === 'off' ? `No cache: every input token costs $${p.input} a million.` : val === 'on' ? `With the cache: repeated input costs $${p.cacheRead} a million.` : 'This time you change the effort level halfway through.');
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
