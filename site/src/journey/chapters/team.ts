// Chapters 7 to 9: side by side, a lead, and the fleet. All three run the same simulation
// (sim.ts) with different switches, so the picture and its rules do not change between them.
import type { Chapter, Ctx } from '../chapter';
import { team, lab } from '../presets';
import { fleet, type FleetOpts } from '../sim';
import type { Script } from '../scene';
import { BUS_Y, route, type SceneState, type XY, type Kind } from '../picture';

const lead = () => [{ t: 'rules' as const, h: 4 }, { t: 'you' as const, h: 3 }];

function go(ctx: Ctx, scene: SceneState, o: FleetOpts) {
  void ctx.scene.run(async (h) => {
    h.set((s) => { Object.assign(s, scene); });
    await fleet(ctx, h, o);
  });
}

// ----- 7: side by side -----
const side = (n: number, own: boolean) => team(n, {
  trees: own, lead: lead(),
  labels: [lab('you', 'you', 'left'), lab('a0', 'the agent', 'top', 'wiki/agent/'), lab('project', 'main', 'top', 'wiki/branch/'), ...(own ? [lab([-88 + 44 * 2 + 30, -98, 4], 'its own copy', 'right', 'wiki/worktree/')] : [])],
});
const runSide = (ctx: Ctx) => {
  const n = ctx.mem.n ?? 3, own = ctx.mem.own ?? true;
  ctx.say(null, own ? 'Each helper works in its own copy of the project. Finished work is merged into main one piece at a time.' : 'Everyone edits the same files at once.');
  go(ctx, side(n, own), { shared: !own, until: n * 2 });
};
export const parallel: Chapter = {
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
  labels: [lab('you', 'you', 'left'), lab('a0', 'the lead', 'top', 'wiki/orchestration/'), lab('project', 'main', 'top', 'wiki/branch/'), ...(gate ? [lab('mgate', 'check', 'top', 'wiki/verification/')] : []), lab([-88, -98 + 4, 50], 'builders', 'left')],
});
const runLead = (ctx: Ctx) => {
  const gate = ctx.mem.gate ?? true, short = ctx.mem.short ?? true;
  ctx.say(null, short ? 'The lead reads a short report from each task, not the work itself.' : 'Every builder sends back everything it did. The lead’s window fills with other agents’ work.');
  go(ctx, led(gate), { gate, shortReports: short, until: short ? 12 : 14 });
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
    labels: [lab('you', 'you', 'left'), lab('a0', 'the lead', 'top', 'wiki/orchestration/'), lab('project', 'main'), lab('mgate', 'check', 'top', 'wiki/verification/'), ...roles.map((r, i) => lab(`w${i}`, r))],
  });
  // Whoever judges the work runs on a different model from whoever built it.
  s.agents[roles.length]!.model = 'b';
  return s;
};
const between = (a: XY, b: XY): XY[] => [[a[0], a[1] + 14], [a[0], BUS_Y], [b[0], BUS_Y], [b[0], b[1] + 14]];

async function playShape(ctx: Ctx, h: Script, shape: Exclude<Shape, 'fan'>) {
  const { scene } = ctx;
  h.set((s) => { Object.assign(s, shaped(shape)); });
  const n = ROLES[shape].length;
  const at = (i: number) => scene.agent(`w${i}`).at;
  let handoffs = 0, caught = 0;
  const stats = (extra: [string, string | number][] = []) => ctx.stat([['agents', n + 1], ['handoffs', handoffs], ['caught before main', caught], ...extra, ['lead’s window', `${Math.round(scene.fill('a0') * 100)}%`]]);
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
  };

  stats();
  ctx.say('you', 'Let members hide their rating.');
  await h.send(route.youToAgent(), 'you');
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 2.4 }); });

  if (shape === 'pair') {
    await pass(route.agentToWorker(at(0)), 'model'); give(0, 'model', 4);
    await work(0, 5);
    ctx.say('builder', 'Built. Tests pass.');
    await pass(between(at(0), at(1)), 'model'); give(1, 'tool', 7);
    await work(1, 2);
    ctx.say('reviewer', 'Hidden ratings still show in the export.');
    caught++;
    await pass(between(at(1), at(0)), 'bad'); give(0, 'bad', 3);
    await work(0, 2);
    await pass(between(at(0), at(1)), 'model'); give(1, 'tool', 3);
    await work(1, 1);
    ctx.say('reviewer', 'The export hides them now. Passing it on.');
    await land(1);
  } else if (shape === 'line') {
    await pass(route.agentToWorker(at(1)), 'model'); give(1, 'model', 4);
    await work(1, 3);
    ctx.say('planner', 'Plan: the list, the member page, the export. A test for each.');
    await pass(between(at(1), at(0)), 'model'); give(0, 'model', 5);
    await work(0, 6);
    ctx.say('builder', 'Built to the plan. Tests pass.');
    await pass(between(at(0), at(2)), 'model'); give(2, 'tool', 7);
    await work(2, 2);
    ctx.say('reviewer', 'Matches the plan. Nothing to send back.');
    await land(2);
  } else {
    h.set((s) => { s.agents[0]!.busy = true; });
    await Promise.all([pass(route.agentToWorker(at(0)), 'model'), pass(route.agentToWorker(at(1)), 'model')]);
    h.set((s) => { s.agents[0]!.busy = false; });
    give(0, 'model', 4); give(1, 'model', 4);
    await Promise.all([work(0, 5), work(1, 6)]);
    ctx.say(null, 'Two builders, the same brief, two answers.');
    await Promise.all([pass(between(at(0), at(2)), 'model'), pass(between(at(1), at(2)), 'model')]);
    give(2, 'tool', 7); give(2, 'tool', 8);
    await work(2, 2);
    ctx.say('judge', 'Keeping the second: the first forgot the export.');
    caught++;
    h.set((s) => { s.agents[1]!.blocks = []; s.agents[1]!.lamp = 'off'; });
    await land(2);
    stats([['built twice, kept', 1]]);
    return;
  }
  stats();
}
const runShape = (ctx: Ctx, shape: Shape) => {
  ctx.mem.shape = shape;
  if (shape === 'fan') { ctx.mem.gate = true; ctx.mem.short = true; runLead(ctx); return; }
  void ctx.scene.run((h) => playShape(ctx, h, shape));
};
export const leadCh: Chapter = {
  steps: {
    roles: { scene: () => led(false), enter: (ctx) => { ctx.mem.gate = false; runLead(ctx); } },
    shapes: { scene: () => shaped('pair'), enter: (ctx) => runShape(ctx, 'pair') },
    gate: { scene: () => led(true), enter: (ctx) => { ctx.mem.gate = true; runLead(ctx); } },
    reports: { scene: () => led(true), enter: (ctx) => { ctx.mem.gate = true; ctx.mem.short = false; runLead(ctx); } },
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
    labels: [lab('you', 'you', 'left'), lab('a0', 'the lead', 'top', 'wiki/orchestration/'), lab('project', 'main', 'top', 'wiki/branch/'), ...(gate ? [lab('mgate', 'check', 'top', 'wiki/verification/')] : [])],
  });
  // Frame the whole floor from the start, so adding agents does not move the camera.
  s.focus = ['you', 'a0', 'project', [-88, -254, 30], [88, -254, 30], [-110, BUS_Y, 0]];
  return s;
};
const runFleet = (ctx: Ctx) => {
  const n = ctx.mem.n ?? 20, gate = ctx.mem.gate ?? true;
  ctx.say(null, gate ? 'You are not reading twenty windows. You are reading what gets through the gate.' : 'No gate. Whatever a builder calls done lands on main.');
  ctx.scene.speed = n > 10 ? 1.5 : 1.2;
  go(ctx, many(n, gate), { gate });
};
export const fleetCh: Chapter = {
  steps: {
    twenty: { scene: () => many(20, true), enter: (ctx) => { ctx.mem.n = 20; ctx.mem.gate = true; runFleet(ctx); } },
    nogate: { scene: () => many(20, false), enter: (ctx) => { ctx.mem.n = 20; ctx.mem.gate = false; runFleet(ctx); } },
    yours: { scene: () => many(10, true), enter: (ctx) => { ctx.mem.n = 10; ctx.mem.gate = true; runFleet(ctx); } },
  },
  inputs: { n: (ctx, val) => { ctx.mem.n = Number(val); runFleet(ctx); } },
  actions: { gate: (ctx, val) => { ctx.mem.gate = val === 'on'; runFleet(ctx); } },
};
