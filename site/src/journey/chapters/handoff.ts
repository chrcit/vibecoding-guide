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

export async function alone(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base(false)); });
  ctx.say('you', 'Find every place the app reads a date.');
  await h.wait(500);
  for (const size of FOUND) {
    h.set((s) => { s.agents[0]!.busy = true; s.agents[0]!.blocks!.push({ t: 'tool', h: size }); });
    await h.wait(360);
  }
  h.set((s) => { s.agents[0]!.busy = false; s.agents[0]!.blocks!.push({ t: 'model', h: 2.4 }); });
  ctx.say('model', 'Seven files read. Three of them read dates.');
  ctx.stat([['the agent’s window after the search', `${Math.round(ctx.scene.fill('a0') * 100)}% full`], ['of that, still useful', 'one short answer']]);
}

export async function handed(ctx: Ctx, h: Script, full = true) {
  h.set((s) => { Object.assign(s, base(true)); });
  ctx.say('you', 'Find every place the app reads a date.');
  await h.wait(500);
  ctx.say('model', full ? 'Brief: list the files that read dates. Do not change anything.' : 'Brief: sort out the dates.');
  h.set((s) => { s.agents[0]!.busy = true; });
  await h.send(route.agentToWorker(AT), 'model');
  h.set((s) => { s.agents[0]!.busy = false; const w = s.agents[1]!; w.blocks = [{ t: 'model', h: full ? 3.4 : 1.6 }]; w.busy = true; w.lamp = 'work'; });
  for (const size of FOUND) {
    await h.wait(340);
    h.set((s) => { s.agents[1]!.blocks!.push({ t: 'tool', h: size }); });
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
  ctx.stat([['the agent’s window after the search', `${Math.round(ctx.scene.fill('a0') * 100)}% full`], ['the helper’s window', `${helperFill}% full, then thrown away`], ...(full ? [] : [['what the helper was never told', 'do not change anything'] as [string, string]])]);
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
