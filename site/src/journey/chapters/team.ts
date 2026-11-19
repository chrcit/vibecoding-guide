// Chapters 7 to 9: side by side, a lead, and the fleet. All three run the same simulation
// (sim.ts) with different switches, so the picture and its rules do not change between them.
import type { Chapter, Ctx } from '../chapter';
import { team, lab } from '../presets';
import { fleet, type FleetOpts } from '../sim';
import { BUS_Y, type SceneState } from '../picture';

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
  labels: [lab('you', 'you', 'left'), lab('a0', 'the agent'), lab('project', 'main', 'top', 'wiki/main-branch/'), ...(own ? [lab([-88 + 44 * 2 + 30, -98, 4], 'its own copy', 'right', 'wiki/worktree/')] : [])],
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
  labels: [lab('you', 'you', 'left'), lab('a0', 'the lead', 'top', 'wiki/orchestration/'), lab('project', 'main'), ...(gate ? [lab('mgate', 'check', 'top', 'wiki/verification/')] : []), lab([-88, -98 + 4, 50], 'builders', 'left')],
});
const runLead = (ctx: Ctx) => {
  const gate = ctx.mem.gate ?? true, short = ctx.mem.short ?? true;
  ctx.say(null, short ? 'The lead reads a short report from each task, not the work itself.' : 'Every builder sends back everything it did. The lead’s window fills with other agents’ work.');
  go(ctx, led(gate), { gate, shortReports: short, until: short ? 12 : 14 });
};
export const leadCh: Chapter = {
  steps: {
    roles: { scene: () => led(false), enter: (ctx) => { ctx.mem.gate = false; runLead(ctx); } },
    gate: { scene: () => led(true), enter: (ctx) => { ctx.mem.gate = true; runLead(ctx); } },
    reports: { scene: () => led(true), enter: (ctx) => { ctx.mem.gate = true; ctx.mem.short = false; runLead(ctx); } },
  },
  actions: {
    gate: (ctx, val) => { ctx.mem.gate = val === 'on'; runLead(ctx); },
    short: (ctx, val) => { ctx.mem.short = val === 'short'; runLead(ctx); },
  },
};

// ----- 9: the fleet -----
const many = (n: number, gate: boolean) => {
  const s = team(n, {
    trees: true, mgate: gate, gate: true, mixed: true, lead: lead(),
    labels: [lab('you', 'you', 'left'), lab('a0', 'the lead'), lab('project', 'main'), ...(gate ? [lab('mgate', 'check')] : [])],
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
