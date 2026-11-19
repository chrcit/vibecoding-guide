// Chapter 15: the project grows. Every job adds layers to the file tiles and some jobs leave
// layers behind that nothing uses. The next job reads more before its first edit. Clean-ups and
// refactors are jobs too. The project and the reading rule are made up: the picture shows the
// mechanism, not real rates.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';
import { route, fileSpot, CAP, type SceneState, type Label, type FileMark } from '../picture';

interface Proj { stacks: number[]; junk: number[]; commits: ('ok' | 'bad')[] }
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/**
 * How much a job reads before its first edit, in window units. Made up: everything built costs a
 * little, the tallest tile (the tangled part every change goes through) costs more, and a layer
 * nothing uses costs most, because nothing says it is dead until it has been read.
 */
export const readFor = (p: Pick<Proj, 'stacks' | 'junk'>) => 2 + 0.4 * sum(p.stacks) + 1.2 * Math.max(...p.stacks) + 1.2 * sum(p.junk);
const share = (p: Pick<Proj, 'stacks' | 'junk'>) => Math.round((readFor(p) / CAP) * 100);

const JOBS = [
  'Add a search box', 'Export to CSV', 'Sort members by rating', 'Add a paid filter', 'Send payment reminders',
  'Make the list fit a phone', 'Add a notes field', 'Show who paid last season', 'Let members hide their rating',
  'Import last year’s list', 'Print a team sheet', 'Add a birthday column', 'Let coaches edit', 'Add a waiting list',
  'Count members per team', 'Email the committee', 'Add a photo per member', 'Archive old members', 'Add a login', 'Add a dark mode',
];
const LEFT = ['an old copy of the list page', 'a date helper nothing calls', 'a second export function', 'a test for a page that is gone', 'a style sheet nothing loads', 'a commented-out form'];
const target = (k: number) => (k * 5 + 1) % 6;

const fresh = (): Proj => ({ stacks: [1, 1, 1, 1, 1, 1], junk: [0, 0, 0, 0, 0, 0], commits: [] });
/** What a run of jobs leaves, without drawing it: for steps that start part-way in. */
function after(p: Proj, from: number, count: number, leaves: (k: number) => boolean): Proj {
  const q = structuredClone(p);
  for (let k = from; k < from + count; k++) { const i = target(k); q.stacks[i]!++; if (leaves(k)) q.junk[i]!++; q.commits.push('ok'); }
  return q;
}
const ADDS = after(fresh(), 0, 6, () => false);
const JUNK = after(ADDS, 6, 6, () => true);
const UNEVEN: Proj = { stacks: [9, 1, 8, 1, 6, 1], junk: [0, 0, 0, 0, 0, 0], commits: Array(10).fill('ok') };

function floor(p: Proj, extra: Label[] = [], gateLabel: Label = lab('gate', 'check', 'top', 'wiki/verification/')): SceneState {
  return solo({
    tools: true, gate: true,
    project: { rules: 'plain', stacks: [...p.stacks], junk: [...p.junk], commits: [...p.commits], files: ['', '', '', '', '', ''] },
    labels: [lab('you', 'you', 'left'), lab('a0', 'the model', 'top', 'wiki/model/'), gateLabel, lab('project', 'your project'), lab('main', 'main', 'bottom', 'wiki/branch/'), ...extra],
  });
}
const proj = (s: SceneState) => s.project!;
const files = (s: SceneState, mark: FileMark) => { proj(s).files = Array(6).fill(mark); };

interface Run { jobs: number; last: number }
const stats = (ctx: Ctx, r: Run) => ctx.stat([['features built so far', r.jobs], ['the latest read before editing', r.jobs ? `${r.last}% of its window` : '–']]);

/** Read the project before the first edit: three blue slabs that add up to what this project costs to read. */
async function readAll(ctx: Ctx, h: Script) {
  const p = proj(ctx.scene.state);
  const r = readFor({ stacks: p.stacks!, junk: p.junk! });
  h.set((s) => { files(s, 'read'); s.tools!.on = 'read'; });
  await h.send(route.agentToTool(ctx.scene.state.tools!, 'read'), 'model', { ms: 300 });
  for (let i = 0; i < 3; i++) { await h.wait(200); h.set((s) => { s.agents[0]!.blocks!.push({ t: 'tool', h: r / 3 }); }); }
  h.set((s) => { files(s, ''); s.tools!.on = null; });
  return Math.round((r / CAP) * 100);
}
async function brief(ctx: Ctx, h: Script, text: string) {
  ctx.say('you', text);
  h.set((s) => { const a = s.agents[0]!; a.blocks = []; a.lamp = 'off'; s.gates![0]!.lamp = 'off'; });
  await h.send(route.youToAgent(), 'you', { ms: 380 });
  h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'you', h: 1.6 }); a.busy = true; a.lamp = 'work'; });
}
async function edit(ctx: Ctx, h: Script, i: number, change: (s: SceneState) => void) {
  const { tools, project } = ctx.scene.state;
  h.set((s) => { s.tools!.on = 'edit'; proj(s).files![i] = 'edit'; s.agents[0]!.blocks!.push({ t: 'model', h: 1.4 }); });
  await h.send(route.toolToFile(tools!, 'edit', project!, i), 'model', { ms: 340 });
  h.set((s) => { change(s); proj(s).files![i] = ''; s.tools!.on = null; s.agents[0]!.blocks!.push({ t: 'tool', h: 1.6 }); });
}
/** Through the check and on to main. `tests: false` means the check has nothing to run. */
async function land(ctx: Ctx, h: Script, wrong = false, tests = true) {
  h.set((s) => { s.agents[0]!.busy = false; });
  await h.send(route.agentToGate(), wrong ? 'bad' : 'model', { ms: 280 });
  h.set((s) => { s.gates![0]!.lamp = tests ? 'ok' : 'off'; });
  await h.send(route.gateToYou(), wrong ? 'bad' : 'model', { ms: 280 });
  h.set((s) => { proj(s).commits!.push(wrong ? 'bad' : 'ok'); s.agents[0]!.lamp = 'off'; });
}

/** One feature job. Returns the share of its window it read before its first edit. */
async function job(ctx: Ctx, h: Script, r: Run, k: number, leaves: boolean, on = target(k)) {
  await brief(ctx, h, JOBS[k % JOBS.length]! + '.');
  r.last = await readAll(ctx, h);
  r.jobs++;
  stats(ctx, r);
  await edit(ctx, h, on, (s) => { proj(s).stacks![on]!++; if (leaves) proj(s).junk![on]!++; });
  if (leaves) ctx.say(null, `Left behind: ${LEFT[k % LEFT.length]}. Nothing uses it.`);
  await land(ctx, h);
  await h.wait(260);
}

async function cleanUp(ctx: Ctx, h: Script) {
  const before = sum(proj(ctx.scene.state).junk!);
  await brief(ctx, h, 'Clean up: remove copies and code nothing calls. Change nothing else.');
  h.set((s) => { s.gates![0]!.lamp = 'ok'; });
  ctx.say('check', 'Before: all tests pass.');
  const own = await readAll(ctx, h);
  for (let i = 0; i < 6; i++) {
    if (!proj(ctx.scene.state).junk![i]) continue;
    await edit(ctx, h, i, (s) => { proj(s).junk![i] = 0; });
  }
  await land(ctx, h);
  ctx.say('check', `After: all tests pass. ${before} unused ${before === 1 ? 'layer' : 'layers'} gone; the clean-up itself read ${own}% of its window.`);
  await h.wait(500);
}

// ---------- steps ----------

async function adds(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, floor(fresh())); });
  const r: Run = { jobs: 0, last: 0 };
  stats(ctx, r);
  let first = 0;
  for (let k = 0; k < 6; k++) { await job(ctx, h, r, k, false); if (!k) first = r.last; }
  ctx.say(null, `Six jobs, six commits on main. The first read ${first}% of its window before its first edit, the sixth ${r.last}%.`);
}

async function leaves(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, floor(ADDS)); });
  const r: Run = { jobs: 6, last: share(ADDS) };
  stats(ctx, r);
  const from = r.last;
  for (let k = 6; k < 12; k++) {
    await job(ctx, h, r, k, true);
    if (k === 6) h.set((s) => { const i = target(6); const [x, y] = fileSpot(proj(s), i); s.labels = s.labels!.filter((l) => l.at !== 'project').concat(lab([x, y, 3 + (proj(s).stacks![i]! * 1.7) + 4], 'nothing uses it', 'top')); });
  }
  ctx.say(null, `Six more jobs, each leaving something behind. Reading before the first edit went from ${from}% to ${r.last}% of the window.`);
}

async function clean(ctx: Ctx, h: Script, run: boolean) {
  h.set((s) => { Object.assign(s, floor(JUNK)); });
  const r: Run = { jobs: 12, last: share(JUNK) };
  stats(ctx, r);
  await job(ctx, h, r, 12, false);
  const before = r.last;
  if (!run) { ctx.say(null, `Twelve jobs in, the next feature read ${before}% of its window before its first edit.`); return; }
  await cleanUp(ctx, h);
  await job(ctx, h, r, 13, false);
  ctx.say(null, `Before the clean-up a feature read ${before}% of its window before its first edit; after it, ${r.last}%. The check passed before and after.`);
}

/** Move a layer from the tallest tile to the shortest until they are even: the same total, a new shape. */
function evenOut(stacks: number[]): [number, number][] {
  const s = [...stacks], moves: [number, number][] = [];
  for (;;) {
    const hi = s.indexOf(Math.max(...s)), lo = s.indexOf(Math.min(...s));
    if (s[hi]! - s[lo]! <= 1) return moves;
    s[hi]!--; s[lo]!++; moves.push([hi, lo]);
  }
}
async function refactor(ctx: Ctx, h: Script, tests: boolean) {
  h.set((s) => { Object.assign(s, floor(UNEVEN, [], tests ? lab('gate', 'check: tests', 'top', 'wiki/test/') : lab('gate', 'check: nothing to run', 'top', 'wiki/test/'))); });
  const r: Run = { jobs: 10, last: share(UNEVEN) };
  stats(ctx, r);
  await job(ctx, h, r, 11, false, 0);
  const before = r.last;
  await brief(ctx, h, 'Refactor: split the big files. Change no behaviour.');
  await readAll(ctx, h);
  const moves = evenOut(proj(ctx.scene.state).stacks!);
  const breaks = Math.floor(moves.length / 2);
  for (const [n, [hi, lo]] of moves.entries()) {
    await edit(ctx, h, lo, (s) => { proj(s).stacks![hi]!--; proj(s).stacks![lo]!++; if (n === breaks) proj(s).files![lo] = 'bad'; });
    if (n === breaks) h.set((s) => { proj(s).files![lo] = 'bad'; });
  }
  const broken = moves[breaks]![1];
  h.set((s) => { s.agents[0]!.busy = false; });
  ctx.say('model', 'Done. Same behaviour, new shape.');
  if (tests) {
    await h.send(route.agentToGate(), 'bad', { ms: 280 });
    h.set((s) => { s.gates![0]!.lamp = 'bad'; });
    ctx.say('check', '1 of 24 tests fails: the export lost its date column.');
    await h.send([...route.agentToGate()].reverse(), 'bad', { ms: 280 });
    h.set((s) => { s.agents[0]!.blocks!.push({ t: 'bad', h: 2 }); s.agents[0]!.busy = true; });
    await edit(ctx, h, broken, () => {});
    h.set((s) => { proj(s).files![broken] = ''; });
    await land(ctx, h);
  } else {
    await land(ctx, h, true, false);
    h.set((s) => { proj(s).files![broken] = 'bad'; });
    ctx.say(null, 'One module broke along the way. Nothing ran a test, so nothing caught it.');
    await h.wait(900);
  }
  h.set((s) => { proj(s).files![broken] = tests ? '' : 'bad'; });
  await job(ctx, h, r, 15, false, 0);
  if (!tests) h.set((s) => { proj(s).files![broken] = 'bad'; });
  ctx.say(null, tests
    ? `Same behaviour, cleaner structure. A feature here read ${before}% of its window before, and ${r.last}% after. Tests caught one breakage along the way.`
    : `A feature here read ${before}% before and ${r.last}% after—and the broken export merged into main.`);
}

const NEVER = 11;
async function rhythm(ctx: Ctx, h: Script, every: number) {
  h.set((s) => { Object.assign(s, floor(fresh())); });
  const r: Run = { jobs: 0, last: share(fresh()) };
  stats(ctx, r);
  let cleanups = 0;
  for (let k = 0; k < 20; k++) {
    await job(ctx, h, r, k, k % 3 !== 2);
    if (every < NEVER && (k + 1) % every === 0 && k < 19) { await cleanUp(ctx, h); cleanups++; }
  }
  ctx.say(null, `The twentieth feature read ${r.last}% of its window before its first edit. ${cleanups ? `${cleanups} clean-${cleanups === 1 ? 'up' : 'ups'} ran in between.` : 'No clean-up ran.'}`);
}

const go = (ctx: Ctx, fn: (h: Script) => Promise<void>, speed = 1.3) => { ctx.scene.speed = speed; void ctx.scene.run(fn); };

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  ctx.scene.speed = 1.8;
  h.set((s) => { Object.assign(s, floor(ADDS)); });
  const r: Run = { jobs: 6, last: share(ADDS) };
  stats(ctx, r);
  for (let k = 6; k < 9; k++) await job(ctx, h, r, k, true);
  await cleanUp(ctx, h);
}

export const grow: Chapter = {
  steps: {
    adds: { scene: () => floor(fresh()), enter: (ctx) => go(ctx, (h) => adds(ctx, h)) },
    junk: { scene: () => floor(ADDS), enter: (ctx) => go(ctx, (h) => leaves(ctx, h)) },
    clean: { scene: () => floor(JUNK), enter: (ctx) => go(ctx, (h) => clean(ctx, h, false)) },
    refactor: { scene: () => floor(UNEVEN), enter: (ctx) => go(ctx, (h) => refactor(ctx, h, true)) },
    rhythm: { scene: () => floor(fresh()), enter: (ctx) => { ctx.say(null, 'Twenty jobs with a clean-up every 5.'); go(ctx, (h) => rhythm(ctx, h, 5), 2.6); } },
  },
  actions: {
    clean: (ctx) => { ctx.say(null, 'A clean-up: remove unused code, change nothing else.'); go(ctx, (h) => clean(ctx, h, true)); },
    tests: (ctx, val) => {
      const on = val === 'on';
      ctx.say(null, on ? 'With tests: the check verifies behaviour stayed the same.' : 'Without tests: the check has nothing to run.');
      go(ctx, (h) => refactor(ctx, h, on));
    },
  },
  inputs: {
    every: (ctx, val, el) => {
      const n = Number(val);
      const out = el.closest('.control')?.querySelector('output');
      const text = n >= NEVER ? 'never' : `${n} jobs`;
      if (out) out.textContent = text;
      el.setAttribute('aria-valuetext', text);
      ctx.say(null, n >= NEVER ? 'Twenty jobs with no clean-ups.' : `Twenty jobs with a clean-up every ${n}.`);
      go(ctx, (h) => rhythm(ctx, h, n), 2.6);
    },
  },
};
