// Lesson 19: the project grows. Every feature adds layers to the file tiles; from the seventh
// on, each also leaves a layer behind that nothing uses. The next feature reads more before its
// first edit. Clean-ups and refactors are jobs too, but they build no feature, so they have their
// own count. One made-up project runs through every step: the numbers on one step are where the
// last step left off. The reading rule is made up: the picture shows the mechanism, not real rates.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';
import { termLabel } from '../terms';
import { route, fileSpot, CAP, type SceneState, type Label, type FileMark } from '../picture';

interface Proj { stacks: number[]; junk: number[]; commits: ('ok' | 'bad')[] }
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/**
 * How much a feature reads before its first edit, in window units. Made up: everything built costs
 * a little, the tallest tile (the tangled part every change goes through) costs more, and a layer
 * nothing uses costs most, because nothing says it is dead until it has been read.
 */
export const readFor = (p: Pick<Proj, 'stacks' | 'junk'>) => 2 + 0.4 * sum(p.stacks) + 1.2 * Math.max(...p.stacks) + 1.2 * sum(p.junk);
const share = (p: Pick<Proj, 'stacks' | 'junk'>) => Math.round((readFor(p) / CAP) * 100);

const JOBS = [
  'Add a search box', 'Export to CSV', 'Sort members by team', 'Add a paid filter', 'Send payment reminders',
  'Make the list fit a phone', 'Add a notes field', 'Show who paid last season', 'Hide members’ phone numbers',
  'Import last year’s list', 'Print a team sheet', 'Add a birthday column', 'Let coaches edit', 'Add a waiting list',
  'Count members per team', 'Email the committee', 'Add a photo per member', 'Archive old members', 'Add a login', 'Add a dark mode',
];
const LEFT = ['an old copy of the list page', 'a date helper nothing calls', 'a second export function', 'a test for a page that is gone', 'a style sheet nothing loads', 'a commented-out form'];
/** Which file tile each feature lands on. Tile 0 is the list page that most features go through. */
const TARGET = [0, 2, 1, 0, 3, 0, 2, 4, 0, 2, 5, 0, 1, 0, 2, 0, 3, 2, 0, 4];
const target = (k: number) => TARGET[k % TARGET.length]!;
/** From the seventh feature on, every feature leaves something behind. */
const leaves = (k: number) => k >= 6;

const fresh = (): Proj => ({ stacks: [1, 1, 1, 1, 1, 1], junk: [0, 0, 0, 0, 0, 0], commits: [] });
/** What features `from`..`from+count-1` leave, without drawing them. */
function after(p: Proj, from: number, count: number): Proj {
  const q = structuredClone(p);
  for (let k = from; k < from + count; k++) { const i = target(k); q.stacks[i]!++; if (leaves(k)) q.junk[i]!++; q.commits.push('ok'); }
  return q;
}
const cleaned = (p: Proj): Proj => ({ ...structuredClone(p), junk: [0, 0, 0, 0, 0, 0], commits: [...p.commits, 'ok'] });
/** The project at the start of each step: each step begins where the one before ends. */
const ADDS = after(fresh(), 0, 6);
const JUNK = after(ADDS, 6, 6);
const BEFORE_CLEAN = after(JUNK, 12, 1);
const AFTER_CLEAN = after(cleaned(BEFORE_CLEAN), 13, 1);
/** What feature k+1 reads when no clean-up has run yet. */
const readBefore = (k: number) => share(after(fresh(), 0, k));

/** Move a layer from the tallest tile to the shortest until they are even: the same total, a new shape. */
function evenOut(stacks: number[]): [number, number][] {
  const s = [...stacks], moves: [number, number][] = [];
  for (;;) {
    const hi = s.indexOf(Math.max(...s)), lo = s.indexOf(Math.min(...s));
    if (s[hi]! - s[lo]! <= 1) return moves;
    s[hi]!--; s[lo]!++; moves.push([hi, lo]);
  }
}

function floor(p: Proj, extra: Label[] = [], gateLabel: Label = termLabel('gate', 'check')): SceneState {
  return solo({
    tools: true, gate: true,
    project: { rules: 'plain', stacks: [...p.stacks], junk: [...p.junk], commits: [...p.commits], files: ['', '', '', '', '', ''] },
    labels: [lab('you', 'you', 'left'), termLabel('a0', 'agent', 'top', 'the agent'), gateLabel, termLabel('project', 'project', 'top', 'the club list'), termLabel('main', 'main', 'bottom'), ...extra],
  });
}
const proj = (s: SceneState) => s.project!;
const files = (s: SceneState, mark: FileMark) => { proj(s).files = Array(6).fill(mark); };

/** The readout: the same four names on every step. */
interface Run { features: number; cleanups: number; last: number; broken: number }
const stats = (ctx: Ctx, r: Run) => ctx.stat([
  ['features built, this project', r.features, 'made-up'],
  ['clean-ups run', r.cleanups],
  ['the latest feature read, before its first edit', r.last ? `${r.last}% of its window` : '–'],
  ['broken on main', r.broken],
]);
const runAt = (p: Proj, features: number, cleanups = 0, last = 0): Run => ({ features, cleanups, last: last || share(p), broken: 0 });

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
  if (!ctx.mem.quiet) ctx.say('you', text);
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

/** Feature k (counting from 0). Returns the share of its window it read before its first edit. */
async function feature(ctx: Ctx, h: Script, r: Run, k: number, on = target(k), leave = leaves(k)) {
  await brief(ctx, h, `Feature ${k + 1}: ${JOBS[k % JOBS.length]!.toLowerCase()}.`);
  r.last = await readAll(ctx, h);
  r.features = k + 1;
  stats(ctx, r);
  await edit(ctx, h, on, (s) => { proj(s).stacks![on]!++; if (leave) proj(s).junk![on]!++; });
  if (leave && !ctx.mem.quiet) ctx.say(null, `Left behind: ${LEFT[k % LEFT.length]}. Nothing uses it.`);
  await land(ctx, h);
  await h.wait(260);
}

async function cleanUp(ctx: Ctx, h: Script, r: Run) {
  const before = sum(proj(ctx.scene.state).junk!);
  await brief(ctx, h, 'Clean up: remove what nothing uses.');
  h.set((s) => { s.gates![0]!.lamp = 'ok'; });
  if (!ctx.mem.quiet) ctx.say(tech(ctx) ? 'the check: npm test' : 'the check', 'Before: all tests pass.');
  await readAll(ctx, h);
  for (let i = 0; i < 6; i++) {
    if (!proj(ctx.scene.state).junk![i]) continue;
    await edit(ctx, h, i, (s) => { proj(s).junk![i] = 0; });
  }
  await land(ctx, h);
  r.cleanups++;
  stats(ctx, r);
  if (!ctx.mem.quiet) ctx.say(tech(ctx) ? 'the check: npm test' : 'the check', before
    ? `After: tests pass, ${before} unused removed.`
    : 'Nothing unused left. Tests pass.');
  if (!ctx.mem.quiet && before) ctx.say(null, `${before} unused ${before === 1 ? 'piece' : 'pieces'} removed and no feature added; all tests pass before and after.`);
  await h.wait(500);
}
const tech = (ctx: Ctx) => ctx.level !== 'plain';

// ---------- steps ----------

async function adds(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, floor(fresh())); });
  const r = runAt(fresh(), 0, 0, 0);
  r.last = 0;
  stats(ctx, r);
  let first = 0;
  for (let k = 0; k < 6; k++) { await feature(ctx, h, r, k); if (!k) first = r.last; }
  ctx.say(null, `Six features, six commits on main. Feature 1 read ${first}% of its window before its first edit; feature 6 read ${r.last}%.`);
}

async function junk(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, floor(ADDS)); });
  const r = runAt(ADDS, 6, 0, readBefore(5));
  stats(ctx, r);
  let from = 0;
  for (let k = 6; k < 12; k++) {
    await feature(ctx, h, r, k);
    if (k === 6) {
      from = r.last;
      h.set((s) => { const i = target(6); const [x, y] = fileSpot(proj(s), i); s.labels = s.labels!.filter((l) => l.at !== 'project').concat(lab([x, y, 3 + (proj(s).stacks![i]! * 1.7) + 4], 'nothing uses it', 'top')); });
    }
  }
  ctx.say(null, `Six more features, each leaving something behind. Feature 7 read ${from}% before its first edit; feature 12 read ${r.last}%.`);
}

/** Feature 13 runs on the cluttered project; then it waits for the reader's clean-up. */
async function clean(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, floor(JUNK)); });
  const r = runAt(JUNK, 12, 0, readBefore(11));
  stats(ctx, r);
  await feature(ctx, h, r, 12);
  ctx.mem.run = r;
  ctx.say(null, `Feature 13 read ${r.last}% of its window before its first edit.${ctx.mem.demo ? '' : ' Run a clean-up and send feature 14.'}`);
}
/** The button: a clean-up on the project as it stands, then feature 14. */
async function cleanThenNext(ctx: Ctx, h: Script) {
  const r: Run = ctx.mem.run ?? runAt(BEFORE_CLEAN, 13, 0, share(JUNK));
  if (!ctx.mem.run) h.set((s) => { Object.assign(s, floor(BEFORE_CLEAN)); });
  ctx.mem.run = r;
  const before = r.last, first = r.features === 13;
  stats(ctx, r);
  await cleanUp(ctx, h, r);
  if (!first) return;
  ctx.say(null, 'The clean-up is done: still 13 features built, one clean-up run. Now feature 14.');
  await h.wait(1800);
  await feature(ctx, h, r, 13);
  ctx.say(null, `The clean-up added no feature. Feature 14, sent after it, read ${r.last}% of its window before its first edit; feature 13 had read ${before}%.`);
}

async function refactor(ctx: Ctx, h: Script, tests: boolean) {
  const label = tests ? termLabel('gate', 'check', 'top', 'check: tests') : lab('gate', 'check: nothing to run', 'top', 'wiki/test/');
  h.set((s) => { Object.assign(s, floor(AFTER_CLEAN, [], label)); });
  const r = runAt(AFTER_CLEAN, 14, 1, share(cleaned(BEFORE_CLEAN)));
  stats(ctx, r);
  const before = share(AFTER_CLEAN);
  ctx.say(null, `On this shape feature 15 would read ${before}% of its window. The list page has grown tallest: every change goes through it.`);
  await h.wait(900);
  await brief(ctx, h, 'Split the list page. Keep behaviour.');
  await readAll(ctx, h);
  const moves = evenOut(proj(ctx.scene.state).stacks!);
  const breaks = Math.floor(moves.length / 2);
  for (const [n, [hi, lo]] of moves.entries()) {
    await edit(ctx, h, lo, (s) => { proj(s).stacks![hi]!--; proj(s).stacks![lo]!++; if (n === breaks) proj(s).files![lo] = 'bad'; });
    if (n === breaks) h.set((s) => { proj(s).files![lo] = 'bad'; });
  }
  const broken = moves[breaks]![1];
  h.set((s) => { s.agents[0]!.busy = false; });
  ctx.say('the agent', 'Done. Same behaviour, new shape.');
  if (tests) {
    await h.send(route.agentToGate(), 'bad', { ms: 280 });
    h.set((s) => { s.gates![0]!.lamp = 'bad'; });
    ctx.say('the check', tech(ctx) ? 'export.test.ts fails: no date column.' : '1 of 24 fails: export lost its dates.');
    await h.wait(700);
    await h.send([...route.agentToGate()].reverse(), 'bad', { ms: 280 });
    h.set((s) => { s.agents[0]!.blocks!.push({ t: 'bad', h: 2 }); s.agents[0]!.busy = true; });
    ctx.say('the agent', 'Date column back. 24 of 24 pass.');
    await edit(ctx, h, broken, () => {});
    h.set((s) => { proj(s).files![broken] = ''; });
    await land(ctx, h);
  } else {
    await land(ctx, h, true, false);
    r.broken = 1;
    stats(ctx, r);
    h.set((s) => { proj(s).files![broken] = 'bad'; });
    ctx.say('the check', 'Nothing to run. Passed.');
    await h.wait(900);
  }
  await feature(ctx, h, r, 14, 0, false);
  if (!tests) {
    h.set((s) => { proj(s).files![broken] = 'bad'; });
    ctx.say(null, `Feature 15 read ${r.last}% instead of ${before}%. A week later the treasurer exports the list and the date column is empty. It broke in the refactor; nothing ran a test, so nobody knew.`);
  } else {
    ctx.say(null, `Same behaviour, a new shape: feature 15 read ${r.last}% instead of ${before}%. The tests caught one break before it reached main.`);
  }
}

/** Twenty features from scratch with a clean-up every `every`, or none. Worked out first, so the readout can say the end at once. */
const NEVER = 11;
function plan(every: number) {
  let p = fresh(), cleanups = 0, last = 0;
  for (let k = 0; k < 20; k++) {
    last = share(p);
    p = after(p, k, 1);
    if (every < NEVER && (k + 1) % every === 0 && k < 19) { p = cleaned(p); cleanups++; }
  }
  return { last, cleanups };
}
async function rhythm(ctx: Ctx, h: Script, every: number) {
  const want = plan(every), none = plan(NEVER);
  h.set((s) => { Object.assign(s, floor(fresh())); });
  const r = runAt(fresh(), 0);
  r.last = 0;
  stats(ctx, r);
  const head = every >= NEVER
    ? `Never a clean-up: feature 20 will read ${none.last}% of its window.`
    : `A clean-up every ${every} features: feature 20 will read ${want.last}% of its window. With none: ${none.last}%.`;
  ctx.say(null, head);
  ctx.mem.quiet = true;
  for (let k = 0; k < 20; k++) {
    await feature(ctx, h, r, k);
    if (every < NEVER && (k + 1) % every === 0 && k < 19) await cleanUp(ctx, h, r);
  }
  ctx.mem.quiet = false;
  ctx.say(null, every >= NEVER ? `Feature 20 read ${r.last}% of its window. No clean-up ran.` : `Feature 20 read ${r.last}% of its window, with ${r.cleanups} clean-ups in between. With none it would have read ${none.last}%.`);
}

const go = (ctx: Ctx, fn: (h: Script) => Promise<void>, speed = 1.3) => { ctx.scene.speed = speed; void ctx.scene.run(fn); };

/** One short loop of this chapter, for the part-three overview: the lesson's clean-up step, same numbers. */
export async function demo(ctx: Ctx, h: Script) {
  ctx.scene.speed = 1.8;
  ctx.mem.run = undefined;
  // The overview has no clean-up button: the loop runs it by itself.
  ctx.mem.demo = true;
  await clean(ctx, h);
  await h.wait(600);
  await cleanThenNext(ctx, h);
  await h.wait(5000);
  ctx.mem.run = undefined;
}

export const grow: Chapter = {
  // The chip: which feature, and how much of its window it read before its first edit.
  counter: (p) => (p.length ? `feature ${p[0]![1]} · read ${String(p[2]![1]).replace(' of its window', '')}` : null),
  steps: {
    adds: { scene: () => floor(fresh()), enter: (ctx) => go(ctx, (h) => adds(ctx, h)) },
    junk: { scene: () => floor(ADDS), enter: (ctx) => go(ctx, (h) => junk(ctx, h)) },
    clean: { scene: () => floor(JUNK), enter: (ctx) => go(ctx, (h) => clean(ctx, h)) },
    refactor: { scene: () => floor(AFTER_CLEAN), enter: (ctx) => go(ctx, (h) => refactor(ctx, h, true)) },
    rhythm: { scene: () => floor(fresh()), enter: (ctx) => go(ctx, (h) => rhythm(ctx, h, 5), 2.6) },
  },
  actions: {
    clean: (ctx) => {
      // If feature 13 is still on its way, the clean-up starts from where it would have ended.
      if (!ctx.mem.run) ctx.say(null, 'Feature 13 has landed. A clean-up: remove what nothing uses, change nothing else.');
      go(ctx, (h) => cleanThenNext(ctx, h));
    },
    tests: (ctx, val) => {
      const on = val === 'on';
      ctx.say(null, on ? 'With tests: the check runs them after the refactor.' : 'Without tests: the check has nothing to run.');
      go(ctx, (h) => refactor(ctx, h, on));
    },
  },
  inputs: {
    every: (ctx, val, el) => {
      const n = Number(val);
      const out = el.closest('.control')?.querySelector('output');
      const text = n >= NEVER ? 'never' : `every ${n} features`;
      if (out) out.textContent = text;
      el.setAttribute('aria-valuetext', text);
      go(ctx, (h) => rhythm(ctx, h, n), 2.6);
    },
  },
};
