// Chapter 6: a second agent. A helper starts with an empty window and only the brief in it; only
// its report comes back.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { team, lab } from '../presets';
import { route, reverse, SLOTS } from '../picture';

const AT = SLOTS[0]!;
const start = () => [{ t: 'rules' as const, h: 4 }, { t: 'you' as const, h: 2.4 }];
const base = (helper: boolean) => {
  const s = team(helper ? 1 : 0, { lead: start(), labels: [lab('you', 'you', 'left'), lab('a0', 'the agent', 'top', 'wiki/agent/'), ...(helper ? [lab('w0', 'a helper', 'top', 'wiki/subagent/')] : [])] });
  s.agents[0]!.scale = 1;
  if (helper) s.agents[1]!.scale = 0.85;
  s.project = null;
  s.tracks = s.tracks!.slice(0, helper ? 2 : 1).concat(helper ? [[[0, -46], [AT[0], AT[1] + 14]]] : []);
  return s;
};
const FOUND = [5, 7, 4, 8, 6, 5, 7];
// One readout for the chapter: how full each window is.
const show = (ctx: Ctx, helper: string) => ctx.stat([['the agent’s window', `${Math.round(ctx.scene.fill('a0') * 100)}% full`], ['the helper’s window', helper]]);
const pct = (ctx: Ctx, id: string) => `${Math.round(ctx.scene.fill(id) * 100)}% full`;

export async function alone(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base(false)); });
  ctx.say('you', 'Find every place the app reads a date.');
  show(ctx, 'no helper');
  await h.wait(500);
  for (const size of FOUND) {
    h.set((s) => { s.agents[0]!.busy = true; s.agents[0]!.blocks!.push({ t: 'tool', h: size }); });
    show(ctx, 'no helper');
    await h.wait(360);
  }
  h.set((s) => { s.agents[0]!.busy = false; s.agents[0]!.blocks!.push({ t: 'model', h: 2.4 }); });
  ctx.say('model', 'Seven files read. Three of them read dates.');
  show(ctx, 'no helper');
  await h.wait(2200);
  ctx.say(null, 'All seven files stay in the agent’s window. One short answer was all it needed from them.');
}

export async function handed(ctx: Ctx, h: Script, full = true) {
  h.set((s) => { Object.assign(s, base(true)); });
  ctx.say('you', 'Find every place the app reads a date.');
  show(ctx, 'empty');
  await h.wait(500);
  ctx.say('model', full ? 'Brief: list the files that read dates. Do not change anything.' : 'Brief: sort out the dates.');
  h.set((s) => { s.agents[0]!.busy = true; });
  await h.send(route.agentToWorker(AT), 'model');
  h.set((s) => { s.agents[0]!.busy = false; const w = s.agents[1]!; w.blocks = [{ t: 'model', h: full ? 3.4 : 1.6 }]; w.busy = true; w.lamp = 'work'; });
  for (const size of FOUND) {
    await h.wait(340);
    h.set((s) => { s.agents[1]!.blocks!.push({ t: 'tool', h: size }); });
    show(ctx, pct(ctx, 'w0'));
  }
  if (!full) {
    h.set((s) => { s.agents[1]!.blocks!.push({ t: 'bad', h: 4 }); });
    ctx.say('helper', 'I rewrote the date handling in three files.');
    await h.wait(700);
  }
  h.set((s) => { s.agents[1]!.busy = false; s.agents[1]!.lamp = full ? 'ok' : 'bad'; });
  const helperFill = Math.round(ctx.scene.fill('w0') * 100);
  await h.send(reverse(route.agentToWorker(AT)), full ? 'tool' : 'bad');
  h.set((s) => { s.agents[0]!.blocks!.push({ t: full ? 'tool' : 'bad', h: 2.4 }); });
  if (full) ctx.say('helper', 'Three files read dates: members.ts, export.ts, import.ts.');
  show(ctx, `${helperFill}% full, thrown away`);
  await h.wait(2200);
  ctx.say(null, full
    ? 'The seven files stayed in the helper’s window. Only its three-line report reached the agent.'
    : 'You told the agent not to change anything. That was in the agent’s window, not in the brief, so the helper never saw it.');
}

export const handoff: Chapter = {
  steps: {
    alone: { scene: () => base(false), enter: (ctx) => void ctx.scene.run((h) => alone(ctx, h)) },
    hand: { scene: () => base(true), enter: (ctx) => void ctx.scene.run((h) => handed(ctx, h)) },
    brief: { scene: () => base(true), enter: (ctx) => void ctx.scene.run((h) => handed(ctx, h, false)) },
  },
  actions: {
    alone: (ctx) => void ctx.scene.run((h) => alone(ctx, h)),
    hand: (ctx, val) => void ctx.scene.run((h) => handed(ctx, h, val !== 'short')),
  },
};
