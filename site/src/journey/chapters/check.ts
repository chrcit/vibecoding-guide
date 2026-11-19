// Chapter 5: make it prove it. Six made-up jobs; which ones are wrong is fixed. What reaches you
// depends on which checks stand between the agent and the word "done".
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';
import { route, reverse, SPOT, type XY } from '../picture';

type CheckId = 'tests' | 'look' | 'review';
interface Job { name: string; flaw?: CheckId; says?: string }
const JOBS: Job[] = [
  { name: 'Sort members by rating' },
  { name: 'Fix the date bug', flaw: 'tests', says: 'tests: 1 of 12 fails' },
  { name: 'Add a search box' },
  { name: 'Make the list fit a phone', flaw: 'look', says: 'screenshot at phone width: the table runs off the screen' },
  { name: 'Export to CSV' },
  { name: 'Let members hide their rating', flaw: 'review', says: 'second model: hidden ratings still show in the export' },
];
const NAMES: Record<CheckId, string> = { tests: 'tests', look: 'a screenshot', review: 'a second model' };
const toGate: XY[] = [[0, 22], [0, SPOT.gate[1] - 10]];
const gateToYou: XY[] = [[0, SPOT.gate[1] + 10], [0, 94]];

const base = (gate: boolean) => solo({ tools: true, project: true, gate, labels: [lab('you', 'you', 'left'), lab('a0', 'the model'), ...(gate ? [lab('gate', 'check', 'top', 'wiki/verification/')] : [])] });

export async function jobs(ctx: Ctx, h: Script, checks: CheckId[], count = JOBS.length) {
  let said = 0, wrong = 0, caught = 0;
  const gate = checks.length > 0;
  const stats = () => ctx.stat([['said “done”', said], ['caught before it reached you', caught], ['wrong, and you were told “done”', wrong]]);
  h.set((s) => { Object.assign(s, base(gate)); });
  stats();
  for (const job of JOBS.slice(0, count)) {
    ctx.say('you', job.name + '.');
    await h.send(route.youToAgent(), 'you', { ms: 420 });
    h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'you', h: 1.6 }); a.busy = true; a.lamp = 'work'; });
    await h.wait(520);
    h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'tool', h: 3 }, { t: 'model', h: 1.4 }); a.busy = false; });
    let flawed = !!job.flaw;
    if (gate) {
      await h.send(toGate, flawed ? 'bad' : 'model', { ms: 320 });
      if (flawed && checks.includes(job.flaw!)) {
        h.set((s) => { s.gates![0]!.lamp = 'bad'; });
        ctx.say('check', job.says!);
        caught++;
        stats();
        await h.send(reverse(toGate), 'bad', { ms: 320 });
        h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'bad', h: 2.4 }); a.busy = true; });
        await h.wait(620);
        h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'tool', h: 2.4 }); a.busy = false; });
        await h.send(toGate, 'model', { ms: 320 });
        flawed = false;
      }
      h.set((s) => { s.gates![0]!.lamp = flawed ? 'off' : 'ok'; });
      await h.send(gateToYou, flawed ? 'bad' : 'model', { ms: 320 });
    } else {
      await h.send(reverse(route.youToAgent()), flawed ? 'bad' : 'model', { ms: 480 });
    }
    said++;
    if (flawed) wrong++;
    h.set((s) => { s.agents[0]!.lamp = 'off'; if (s.gates![0]) s.gates![0]!.lamp = 'off'; });
    ctx.say('model', 'Done.');
    stats();
    await h.wait(420);
  }
  ctx.say(null, wrong
    ? `${wrong} of ${said} were wrong, and all ${said} came back as “done”.`
    : `All ${said} that reached you were right. ${caught} were sent back first by ${checks.map((c) => NAMES[c]).join(', ')}.`);
}

const play = (ctx: Ctx) => void ctx.scene.run((h) => jobs(ctx, h, ctx.mem.checks ?? []));

export const check: Chapter = {
  steps: {
    done: { scene: () => base(false), enter: (ctx) => { ctx.mem.checks = []; ctx.scene.speed = 1.4; play(ctx); } },
    tests: { scene: () => base(true), enter: (ctx) => { ctx.mem.checks = ['tests']; ctx.scene.speed = 1.4; play(ctx); } },
    more: { scene: () => base(true), enter: (ctx) => { ctx.mem.checks = ['tests', 'look', 'review']; ctx.scene.speed = 1.6; play(ctx); } },
  },
  actions: {
    toggle: (ctx, val, el) => {
      const set = new Set<CheckId>(ctx.mem.checks ?? []);
      if (set.has(val as CheckId)) set.delete(val as CheckId); else set.add(val as CheckId);
      ctx.mem.checks = [...set];
      el.setAttribute('aria-pressed', String(set.has(val as CheckId)));
      ctx.scene.speed = 1.8;
      play(ctx);
    },
    play: (ctx) => play(ctx),
  },
};
