// Chapters 7 to 9: side by side, a lead, and the fleet. All three run the same simulation
// (sim.ts) with different switches, so the picture and its rules do not change between them.
import type { Chapter, Ctx } from '../chapter';
import { team, lab } from '../presets';
import { termLabel } from '../terms';
import { STEP_NOTES } from '../notes';
import { fleet, type FleetOpts, type Tally } from '../sim';
import type { Script } from '../scene';
import { BUS_Y, route, type SceneState, type XY, type Kind } from '../picture';

const lead = () => [{ t: 'rules' as const, h: 4 }, { t: 'you' as const, h: 3 }];

/** What came of a run, in one or two sentences. */
export function closing(t: Tally, o: FleetOpts) {
  const who = o.name ?? 'the lead';
  const parts = [`All ${t.landed} tasks are on main.`];
  if (o.gate) parts.push(t.sentBack ? `The check sent ${t.sentBack} back first.` : 'The check sent none back.');
  if (o.clashes) parts.push(t.clashes ? `${t.clashes} overwrote another helper’s edit.` : 'None overwrote another.');
  parts.push(t.wrong ? `${t.wrong} of them ${t.wrong === 1 ? 'is' : 'are'} wrong, and nothing stopped ${t.wrong === 1 ? 'it' : 'them'}.` : 'None of them is wrong.');
  if (t.compactions) parts.push(`${who[0]!.toUpperCase() + who.slice(1)}’s window filled and was compacted ${t.compactions === 1 ? 'once' : t.compactions === 2 ? 'twice' : t.compactions + ' times'}.`);
  return parts.join(' ');
}

/** How many helpers are working now, read from their lamps (amber while a helper works). */
export function working(ctx: Ctx) {
  return ctx.scene.state.agents.filter((a) => /^w\d/.test(a.id) && (a.busy || a.lamp === 'work')).length;
}
/**
 * The chip for the fleet lessons: tasks on main, and how many helpers are working. The thread
 * list beside the picture used to show each helper's state; the lamps carry it now, and the chip
 * counts them.
 */
export const fleetChip = (pairs: [string, string | number, string?][], ctx: Ctx) => {
  const landed = String(pairs.find(([n]) => n.startsWith('tasks on main'))?.[1] ?? '').replace(' of ', '/');
  if (!landed) return null;
  const n = working(ctx);
  return n ? `${landed} on main · ${n} working` : `${landed} on main`;
};

/**
 * The fleet simulation (sim.ts) speaks only through its readout. This wraps ctx so each change in
 * that readout also becomes what the picture says: the check sends one back, two edits clash on
 * main, broken work lands, the lead's window is compacted, the first report comes in.
 */
export function watched(ctx: Ctx, o: FleetOpts): Ctx {
  const prev = new Map<string, number>();
  let first = true;
  const num = (v: string | number | undefined) => parseFloat(String(v ?? '')) || 0;
  const boss = o.name === 'the agent' ? 'agent' : 'lead';
  const w = Object.create(ctx) as Ctx;
  w.stat = (pairs) => {
    const get = (start: string) => pairs.find(([n]) => n.startsWith(start));
    const up = (p: ReturnType<typeof get>) => { if (!p) return false; const was = prev.get(p[0]) ?? 0, now = num(p[1]); prev.set(p[0], now); return now > was; };
    const win = pairs.find(([n]) => n.endsWith('window'));
    const winWas = prev.get('window') ?? 0, winNow = num(win?.[1]);
    prev.set('window', winNow);
    const landed = up(get('tasks on main')), clash = up(get('clashes')), wrong = up(get('wrong on main')), back = up(get('sent back'));
    if (clash) ctx.say('main', 'Clash: one edit landed on another.');
    else if (wrong) ctx.say('main', `Wrong, and on main: ${num(get('wrong on main')?.[1])}.`);
    else if (back) ctx.say('check', 'Sent back: it fails the check.');
    else if (winNow < winWas - 15) ctx.say(boss, 'Window full: compacted.');
    else if (landed && first) {
      ctx.say(boss, boss === 'agent' ? 'Merged into main.' : o.shortReports === false ? 'Report: diff, logs, every read.' : 'Report: five lines.');
    }
    if (landed) first = false;
    ctx.stat(pairs);
  };
  return w;
}
/** The last line of a run, said at main. */
export const landedLine = (t: Tally) => (t.wrong ? `All ${t.landed} landed. ${t.wrong} wrong.` : `All ${t.landed} landed. None wrong.`);
/** Where the fleet's speakers stand: the check in front of main, and main itself. */
export const FLEET_SPEAKERS = { check: 'mgate', main: 'project' };

function go(ctx: Ctx, scene: SceneState, o: FleetOpts) {
  void ctx.scene.run(async (h) => {
    h.set((s) => { Object.assign(s, scene); });
    const t = await fleet(watched(ctx, o), h, o);
    // Every run ends, and says what came of it: in the step text, and in one line at main.
    ctx.say('main', landedLine(t));
    ctx.say(null, closing(t, o));
  });
}

// ----- 7: side by side -----
const side = (n: number, own: boolean) => team(n, {
  trees: own, lead: lead(),
  labels: [lab('you', 'you', 'left'), termLabel('a0', 'agent', 'top', 'the agent'), termLabel('project', 'main'), termLabel([-88, -98 + 4, 50], 'helper', 'left', 'helpers'), ...(own ? [termLabel([-88 + 44 * 2 + 30, -98, 4], 'worktree', 'right')] : [])],
});
const runSide = (ctx: Ctx) => {
  const n = ctx.mem.n ?? 3, own = ctx.mem.own ?? true;
  ctx.say(null, own ? `${n} helpers, each in its own copy. Finished work is merged into main one piece at a time.` : `${n} helpers in one folder, editing the same files at once.`);
  go(ctx, side(n, own), { shared: !own, until: n * 2, name: 'the agent', clashes: true, flaws: false });
};
export const parallel: Chapter = {
  counter: fleetChip,
  speakers: FLEET_SPEAKERS,
  steps: {
    three: { scene: () => side(3, false), enter: (ctx) => { ctx.mem.n = 3; ctx.mem.own = false; runSide(ctx); } },
    copies: { scene: () => side(3, true), enter: (ctx) => { ctx.mem.n = 3; ctx.mem.own = true; runSide(ctx); } },
    more: { scene: () => side(5, true), enter: (ctx) => { ctx.mem.n = 5; ctx.mem.own = true; runSide(ctx); } },
  },
  inputs: { n: (ctx, val) => { ctx.mem.n = Number(val); runSide(ctx); } },
  actions: { own: (ctx, val) => { ctx.mem.own = val === 'own'; runSide(ctx); } },
};

// ----- 8: a lead -----
const led = (gate: boolean) => team(5, {
  trees: true, mgate: gate, mixed: true, lead: lead(),
  labels: [lab('you', 'you', 'left'), termLabel('a0', 'lead', 'top', 'the lead'), termLabel('project', 'main'), ...(gate ? [termLabel('mgate', 'check')] : []), termLabel([-88, -98 + 4, 50], 'helper', 'left', 'helpers')],
});
const runLead = (ctx: Ctx) => {
  const gate = ctx.mem.gate ?? true, short = ctx.mem.short ?? true;
  ctx.say(null, !gate ? 'No check in front of main: whatever a helper calls done is merged.' : short ? 'Each helper sends five lines. The lead’s window stays small.' : 'Each helper sends back everything it did: diffs, logs, file reads. Watch the lead’s window.');
  go(ctx, led(gate), { gate, shortReports: short, until: 12 });
};

// Other ways to split one job, played in the same picture. The job and what goes wrong are made up.
type Shape = 'fan' | 'pair' | 'line' | 'best';
const ROLES: Record<Exclude<Shape, 'fan'>, string[]> = {
  pair: ['builds', 'reviews'],
  line: ['builds', 'plans', 'reviews'],
  best: ['builds', 'builds too', 'picks one'],
};
const shaped = (shape: Shape): SceneState => {
  if (shape === 'fan') return led(true);
  const roles = ROLES[shape];
  const s = team(roles.length, {
    trees: true, mgate: true, lead: lead(),
    labels: [lab('you', 'you', 'left'), termLabel('a0', 'lead', 'top', 'the lead'), termLabel('project', 'main'), termLabel('mgate', 'check'), ...roles.map((r, i) => lab(`w${i}`, r))],
  });
  // Whoever judges the work runs on a different model from whoever built it.
  s.agents[roles.length]!.model = 'b';
  return s;
};
/** Who speaks in the shapes: each role at its own station (the shared map puts a planner at the lead). */
const SHAPE_SPEAKERS = { helper: 'w0', builder: 'w0', 'second builder': 'w1', planner: 'w1', reviewer: 'w1', 'the reviewer': 'w2', judge: 'w2' };
const between = (a: XY, b: XY): XY[] => [[a[0], a[1] + 14], [a[0], BUS_Y], [b[0], BUS_Y], [b[0], b[1] + 14]];

async function playShape(ctx: Ctx, h: Script, shape: Exclude<Shape, 'fan'>) {
  const { scene } = ctx;
  h.set((s) => { Object.assign(s, shaped(shape)); });
  const n = ROLES[shape].length;
  const at = (i: number) => scene.agent(`w${i}`).at;
  let handoffs = 0, caught = 0;
  // The same readout as the rest of the chapter. Here there is one task, passed between roles.
  let landed = 0;
  const stats = () => ctx.stat([['the one task, on main', landed ? 'yes' : 'not yet', 'made-up'], ['sent back by the check, this run', caught], ['wrong on main, this run', 0], ['the lead’s window', `${Math.round(scene.fill('a0') * 100)}% full`]]);
  const tally = (how: string) => ctx.say(null, `One task on main after ${handoffs} handoffs. ${how}`);
  const pass = async (path: XY[], kind: Kind) => { await h.send(path, kind); handoffs++; stats(); };
  const give = (i: number, kind: Kind, size: number) => h.set((s) => { (s.agents[i + 1]!.blocks ??= []).push({ t: kind, h: size }); });
  const work = async (i: number, turns: number) => {
    h.set((s) => { const a = s.agents[i + 1]!; a.busy = true; a.lamp = 'work'; });
    for (let k = 0; k < turns; k++) { await h.wait(360); give(i, k % 2 ? 'model' : 'tool', 4 + (k % 3) * 2); }
    h.set((s) => { const a = s.agents[i + 1]!; a.busy = false; a.lamp = 'wait'; });
  };
  const land = async (i: number) => {
    const project = scene.state.project!;
    await h.send([[at(i)[0], at(i)[1] + 14], [at(i)[0], BUS_Y], [106, BUS_Y]], 'model');
    h.set((s) => { s.gates!.find((g) => g.id === 'mgate')!.lamp = 'ok'; });
    await h.send([[106, BUS_Y], [project.at[0] - 46, BUS_Y]], 'model', { ms: 300 });
    h.set((s) => { (s.project!.commits ??= []).push('ok'); for (const a of s.agents.slice(1)) a.lamp = 'ok'; });
    await h.send([[at(i)[0], BUS_Y], [0, BUS_Y], [0, -20]], 'tool', { ms: 420 });
    h.set((s) => { s.agents[0]!.blocks!.push({ t: 'tool', h: 1.6 }); });
    landed = 1;
    stats();
    await h.wait(1500);
  };

  stats();
  ctx.say('you', 'Let members hide their rating.');
  await h.send(route.youToAgent(), 'you');
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 2.4 }); });

  if (shape === 'pair') {
    await pass(route.agentToWorker(at(0)), 'model'); give(0, 'model', 4);
    await work(0, 5);
    ctx.say('helper', 'Built. Tests pass.');
    await pass(between(at(0), at(1)), 'model'); give(1, 'tool', 7);
    await work(1, 2);
    ctx.say('reviewer', 'Hidden ratings still in the export.');
    caught++;
    await pass(between(at(1), at(0)), 'bad'); give(0, 'bad', 3);
    await work(0, 2);
    await pass(between(at(0), at(1)), 'model'); give(1, 'tool', 3);
    await work(1, 1);
    ctx.say('reviewer', 'Export hides them now. Passing it.');
    await land(1);
    tally('The reviewer sent it back once: hidden ratings still showed in the export.');
  } else if (shape === 'line') {
    await pass(route.agentToWorker(at(1)), 'model'); give(1, 'model', 4);
    await work(1, 3);
    ctx.say('planner', 'Plan: list, page, export, a test each.');
    await pass(between(at(1), at(0)), 'model'); give(0, 'model', 5);
    await work(0, 6);
    ctx.say('helper', 'Built to the plan. Tests pass.');
    await pass(between(at(0), at(2)), 'model'); give(2, 'tool', 7);
    await work(2, 2);
    ctx.say('the reviewer', 'Matches the plan. Nothing to fix.');
    await land(2);
    tally('The plan named the export, so nothing was sent back.');
  } else {
    h.set((s) => { s.agents[0]!.busy = true; });
    await Promise.all([pass(route.agentToWorker(at(0)), 'model'), pass(route.agentToWorker(at(1)), 'model')]);
    h.set((s) => { s.agents[0]!.busy = false; });
    give(0, 'model', 4); give(1, 'model', 4);
    await Promise.all([work(0, 5), work(1, 6)]);
    ctx.say(null, 'Two helpers, the same brief, two answers.');
    ctx.say('helper', 'Build one: done.');
    await h.wait(700);
    ctx.say('second builder', 'Build two: done.');
    await Promise.all([pass(between(at(0), at(2)), 'model'), pass(between(at(1), at(2)), 'model')]);
    give(2, 'tool', 7); give(2, 'tool', 8);
    await work(2, 2);
    ctx.say('judge', 'Keeping the second: export is in.');
    caught++;
    h.set((s) => { s.agents[1]!.blocks = []; s.agents[1]!.lamp = 'off'; });
    await land(2);
    tally('Built twice, one kept: the first build forgot the export.');
  }
}
const runShape = (ctx: Ctx, shape: Shape) => {
  ctx.mem.shape = shape;
  if (shape === 'fan') { ctx.mem.gate = true; ctx.mem.short = true; runLead(ctx); return; }
  void ctx.scene.run((h) => playShape(ctx, h, shape));
};
export const leadCh: Chapter = {
  counter: fleetChip,
  speakers: FLEET_SPEAKERS,
  steps: {
    roles: { scene: () => led(false), enter: (ctx) => { ctx.mem.gate = false; runLead(ctx); } },
    // One task passed between roles: the chip says where it is. Who speaks is the role's station.
    shapes: { scene: () => shaped('pair'), counter: (pairs) => `on main: ${pairs[0]?.[1] ?? 'not yet'}`, speakers: SHAPE_SPEAKERS, enter: (ctx) => runShape(ctx, 'pair') },
    gate: { scene: () => led(true), enter: (ctx) => { ctx.mem.gate = true; runLead(ctx); } },
    // What the lead reads: the chip is the lead's window.
    reports: { scene: () => led(true), counter: (pairs) => { const w = pairs.find(([n]) => n.endsWith('window')); return w ? `lead’s window ${w[1]}` : null; }, enter: (ctx) => { ctx.mem.gate = true; ctx.mem.short = false; runLead(ctx); } },
  },
  actions: {
    shape: (ctx, val) => runShape(ctx, val as Shape),
    gate: (ctx, val) => { ctx.mem.gate = val === 'on'; runLead(ctx); },
    short: (ctx, val) => { ctx.mem.short = val === 'short'; runLead(ctx); },
  },
};

// ----- 9: the fleet -----
const many = (n: number, gate: boolean) => {
  const s = team(n, {
    trees: true, mgate: gate, gate: true, mixed: true, lead: lead(),
    labels: [lab('you', 'you', 'left'), termLabel('a0', 'lead', 'top', 'the lead'), termLabel('project', 'main'), ...(gate ? [termLabel('mgate', 'check')] : [])],
  });
  // Frame the whole floor from the start, so adding agents does not move the camera.
  s.focus = ['you', 'a0', 'project', [-88, -254, 30], [88, -254, 30], [-110, BUS_Y, 0]];
  return s;
};
const runFleet = (ctx: Ctx) => {
  const n = ctx.mem.n ?? 20, gate = ctx.mem.gate ?? true, turns = !!ctx.mem.turns;
  ctx.say(null, gate ? `${n} helper${n === 1 ? '' : 's'}, forty tasks, one check in front of main.` : 'No check. Whatever a helper calls done lands on main.');
  ctx.scene.speed = n > 10 ? 1.5 : 1.2;
  const o: FleetOpts = { gate, until: 40, showTurns: turns };
  void ctx.scene.run(async (h) => {
    h.set((s) => { Object.assign(s, many(n, gate)); });
    const t = await fleet(watched(ctx, o), h, o);
    ctx.say('main', landedLine(t));
    ctx.say(null, closing(t, o) + (turns ? ` The helpers took ${t.turns} turns, and each turn read a whole window again.` : ''));
  });
};
export const fleetCh: Chapter = {
  counter: fleetChip,
  speakers: FLEET_SPEAKERS,
  steps: {
    twenty: { scene: () => many(20, true), enter: (ctx) => { ctx.mem.n = 20; ctx.mem.gate = true; runFleet(ctx); } },
    // Without the check the picture is about what landed wrong.
    nogate: { scene: () => many(20, false), counter: (pairs) => { const w = pairs.find(([n]) => n.startsWith('wrong on main')); return w ? `wrong on main ${w[1]}` : null; }, enter: (ctx) => { ctx.mem.n = 20; ctx.mem.gate = false; runFleet(ctx); } },
    // What is left for you: the turns every helper takes, each reading its window again.
    yours: { scene: () => many(20, true), counter: (pairs) => { const t = pairs.find(([n]) => n.startsWith('helper turns')); return t ? `helper turns ${t[1]}` : null; }, enter: (ctx) => { ctx.mem.n = 20; ctx.mem.gate = true; ctx.mem.turns = true; runFleet(ctx); } },
  },
  inputs: { n: (ctx, val) => { ctx.mem.n = Number(val); runFleet(ctx); } },
  actions: {
    gate: (ctx, val) => {
      ctx.mem.gate = val === 'on';
      // The note under the picture follows the switch, not the step it opened on.
      const n = STEP_NOTES.fleet?.[val === 'on' ? 'twenty' : 'nogate'];
      if (n) ctx.model(n.part, n.text[ctx.level]);
      runFleet(ctx);
    },
  },
};
