// Lesson 9: make it prove it. A check between the agent and you sends broken work back.
// What the check is depends on the reader's level: for plain, the agent runs the app and looks;
// for technical and engineer, a type check, unit tests and a browser check, each catching one kind
// of wrong. One kind gets through every check: what nobody wrote down. The six jobs are made up.
import type { Chapter, Ctx, Level } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';
import { termLabel } from '../terms';
import { route, reverse, SPOT, type XY } from '../picture';

export type CheckId = 'run' | 'phone' | 'types' | 'tests' | 'browser' | 'spec';
type Flaw = 'types' | 'logic' | 'layout' | 'spec';
interface Job { name: string; flaw?: Flaw }
export const JOBS: Job[] = [
  { name: 'Sort members by rating' },
  { name: 'Rename “paid” to “paidOn”', flaw: 'types' },
  { name: 'Fix the date bug', flaw: 'logic' },
  { name: 'Make the list fit a phone', flaw: 'layout' },
  { name: 'Export the list to CSV' },
  { name: 'Let members hide their rating', flaw: 'spec' },
];
/** The checks a reader at this level has, switched on by default in the lesson's last steps. */
export const LEVEL_CHECKS: Record<Level, CheckId[]> = {
  plain: ['run', 'phone'],
  technical: ['types', 'tests', 'browser'],
  engineer: ['types', 'tests', 'browser'],
};
/** The check that stands first, on its own. */
const FIRST: Record<Level, CheckId[]> = { plain: ['run'], technical: ['types', 'tests'], engineer: ['types', 'tests'] };

const NAME: Record<CheckId, string> = {
  run: 'it runs the app',
  phone: 'it looks on a phone',
  types: 'tsc --noEmit',
  tests: 'npm test',
  browser: 'browser check at 390 px',
  spec: 'a test from your rule',
};
/** Which check catches which kind of wrong, and what it says when it does. */
// Each line is a bubble at the check. On a wide page the bubble can be squeezed to 170 px beside
// the check (overlay.ts), so keep these to about 28 characters.
const CATCH: Record<CheckId, Partial<Record<Flaw, string>>> = {
  run: { types: 'The list page crashed: blank.', logic: 'Wrong date: 3 December.' },
  phone: { layout: 'The table spills off a phone.' },
  types: { types: '“paid” is not on Member.' },
  tests: { logic: 'Test: 03.03 gives 3 December.' },
  browser: { layout: 'Page is 458 px at 390 px.' },
  spec: { spec: 'Test: hidden rating in CSV.' },
};
const SLIPS: Record<Flaw, string> = {
  types: 'the list page crashes',
  logic: 'the dates are wrong',
  layout: 'the table spills off a phone',
  spec: 'hidden ratings are in the CSV',
};
/** What you see when broken work reaches you: a bubble at you. */
const BROKE: Record<Flaw, string> = {
  types: 'Broken: the list page crashes.',
  logic: 'Broken: the dates are wrong.',
  layout: 'Broken: the table spills off a phone.',
  spec: 'Broken: hidden ratings in the CSV.',
};
export const checkNames = (c: CheckId[]) => (c.length ? c.map((x) => NAME[x]).join(' · ') : 'none');

const toGate: XY[] = [[0, 22], [0, SPOT.gate[1] - 10]];
const gateToYou: XY[] = [[0, SPOT.gate[1] + 10], [0, 94]];

const base = (gate: boolean) => solo({
  tools: true, project: true, gate,
  labels: [lab('you', 'you', 'left'), termLabel('a0', 'agent', 'top', 'the agent'), ...(gate ? [termLabel('gate', 'check')] : [])],
});

export async function jobs(ctx: Ctx, h: Script, checks: CheckId[], count = JOBS.length) {
  let said = 0, wrong = 0, caught = 0;
  const slipped: string[] = [];
  const gate = checks.length > 0;
  const stats = () => ctx.stat([
    ['the check', checkNames(checks)],
    ['said “done”', `${said} of ${count}`],
    ['sent back by the check', gate ? caught : 'no check'],
    ['reached you broken', wrong],
  ]);
  h.set((s) => { Object.assign(s, base(gate)); });
  stats();
  for (const job of JOBS.slice(0, count)) {
    ctx.say('you', job.name + '.');
    await h.send(route.youToAgent(), 'you', { ms: 400 });
    h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'you', h: 1.6 }); a.busy = true; a.lamp = 'work'; });
    await h.wait(480);
    h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'tool', h: 3 }, { t: 'model', h: 1.4 }); a.busy = false; });
    let flawed = !!job.flaw;
    const by = job.flaw ? checks.find((c) => CATCH[c][job.flaw!]) : undefined;
    if (gate) {
      await h.send(toGate, flawed ? 'bad' : 'model', { ms: 300 });
      if (flawed && by) {
        h.set((s) => { s.gates![0]!.lamp = 'bad'; });
        ctx.say('check', CATCH[by][job.flaw!]!);
        caught++;
        stats();
        await h.send(reverse(toGate), 'bad', { ms: 300 });
        h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'bad', h: 2.4 }); a.busy = true; });
        await h.wait(700);
        h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'tool', h: 2.4 }); a.busy = false; });
        await h.send(toGate, 'model', { ms: 300 });
        flawed = false;
        h.set((s) => { s.gates![0]!.lamp = 'ok'; });
        ctx.say('check', 'Fixed. It passes now.');
      }
      h.set((s) => { s.gates![0]!.lamp = flawed ? 'off' : 'ok'; });
      if (!by || !job.flaw) ctx.say('agent', 'Done.');
      await h.send(gateToYou, flawed ? 'bad' : 'model', { ms: 300 });
    } else {
      ctx.say('agent', 'Done.');
      await h.send(reverse(route.youToAgent()), flawed ? 'bad' : 'model', { ms: 440 });
    }
    said++;
    if (flawed) { wrong++; slipped.push(SLIPS[job.flaw!]); ctx.say('you', BROKE[job.flaw!]); }
    h.set((s) => { s.agents[0]!.lamp = 'off'; if (s.gates![0]) s.gates![0]!.lamp = 'off'; });
    stats();
    await h.wait(flawed ? 900 : 380);
  }
  ctx.say(null, !gate
    ? `${wrong} of ${said} were broken, and all ${said} arrived as “done”.`
    : wrong
      ? `The check sent ${caught} back. ${wrong} still reached you: ${slipped.join(', ')}. No check you had looks for that.`
      : `The check sent ${caught} back, and the agent fixed them. All ${said} that reached you work.`);
}

const play = (ctx: Ctx) => void ctx.scene.run((h) => jobs(ctx, h, ctx.mem.checks ?? []));

export const check: Chapter = {
  // The picture is about what reaches you broken; the readout's first line names the checks.
  counter: 'reached you broken',
  steps: {
    done: { scene: () => base(false), enter: (ctx) => { ctx.mem.checks = []; ctx.scene.speed = 1.4; play(ctx); } },
    tests: { scene: () => base(true), enter: (ctx) => { ctx.mem.checks = FIRST[ctx.level]; ctx.scene.speed = 1.4; play(ctx); } },
    more: { scene: () => base(true), enter: (ctx) => { ctx.mem.checks = [...LEVEL_CHECKS[ctx.level]]; ctx.scene.speed = 1.6; play(ctx); } },
    spec: { scene: () => base(true), enter: (ctx) => { ctx.mem.checks = [...LEVEL_CHECKS[ctx.level]]; ctx.scene.speed = 1.6; play(ctx); } },
  },
  actions: {
    toggle: (ctx, val, el) => {
      const set = new Set<CheckId>(ctx.mem.checks ?? []);
      const id = val as CheckId;
      if (set.has(id)) set.delete(id); else set.add(id);
      // Keep the level's order, so the readout reads the same way every time.
      ctx.mem.checks = [...LEVEL_CHECKS[ctx.level], 'spec' as CheckId].filter((c) => set.has(c));
      el.setAttribute('aria-pressed', String(set.has(id)));
      ctx.say(null, set.has(id) ? `On: ${NAME[id]}. Running the six jobs again.` : `Off: ${NAME[id]}. Running the six jobs again.`);
      ctx.scene.speed = 1.8;
      play(ctx);
    },
    spec: (ctx, _val, el) => {
      ctx.mem.checks = [...LEVEL_CHECKS[ctx.level], 'spec'];
      el.setAttribute('aria-pressed', 'true');
      ctx.say(null, 'A new check: a hidden rating must never appear in the CSV. Running the six jobs again.');
      ctx.scene.speed = 1.8;
      play(ctx);
    },
  },
};
