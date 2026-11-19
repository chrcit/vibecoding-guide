// Lesson 10: a second agent. A helper starts with an empty window and only the brief in it; only
// its report comes back. The search, the file counts and what goes wrong are made up.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { team, lab } from '../presets';
import { termLabel } from '../terms';
import { route, reverse, SLOTS } from '../picture';

const AT = SLOTS[0]!;
const start = () => [{ t: 'rules' as const, h: 4 }, { t: 'you' as const, h: 2.4 }];
const base = (helper: boolean) => {
  const s = team(helper ? 1 : 0, {
    lead: start(),
    labels: [
      lab('you', 'you', 'left'), termLabel('a0', 'agent', 'top', 'the agent'), termLabel('project', 'project'),
      ...(helper ? [termLabel('w0', 'helper', 'top', 'a helper')] : []),
    ],
  });
  s.agents[0]!.scale = 1;
  if (helper) s.agents[1]!.scale = 0.85;
  s.project!.commits = undefined;
  s.tracks = s.tracks!.slice(0, helper ? 3 : 1).concat(helper ? [[[0, -46], [AT[0], AT[1] + 14]]] : []);
  return s;
};
const FOUND = [5, 7, 4, 8, 6, 5, 7];
const pct = (ctx: Ctx, id: string) => `${Math.round(ctx.scene.fill(id) * 100)}% full`;
// One readout for the lesson: how full each window is, and what changed in your project.
const show = (ctx: Ctx, helper: string, changed: number | string = 0) => ctx.stat([
  ['the agent’s window', pct(ctx, 'a0')],
  ['the helper’s window', helper],
  ['files changed in your project', changed],
]);

export async function alone(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base(false)); });
  ctx.say('you', 'Find every place the app reads a date. Do not change anything yet.');
  show(ctx, 'no helper');
  await h.wait(500);
  for (const size of FOUND) {
    h.set((s) => { s.agents[0]!.busy = true; s.agents[0]!.blocks!.push({ t: 'tool', h: size }); });
    show(ctx, 'no helper');
    await h.wait(360);
  }
  h.set((s) => { s.agents[0]!.busy = false; s.agents[0]!.blocks!.push({ t: 'model', h: 2.4 }); });
  ctx.say('agent', 'Seven files read. Three of them read dates.');
  show(ctx, 'no helper');
  await h.wait(2200);
  ctx.say(null, 'Seven whole files now sit in the agent’s window, for a three-line answer. They stay there for the rest of the job.');
}

export async function handed(ctx: Ctx, h: Script, full = true) {
  h.set((s) => { Object.assign(s, base(true)); });
  ctx.say('you', 'Find every place the app reads a date. Do not change anything yet.');
  show(ctx, 'empty');
  await h.wait(500);
  ctx.say('agent', full
    ? 'Brief: list every file that reads a date, one line each. Do not change any file.'
    : 'Brief: sort out the dates.');
  h.set((s) => { s.agents[0]!.busy = true; });
  await h.send(route.agentToWorker(AT), 'model');
  h.set((s) => { s.agents[0]!.busy = false; const w = s.agents[1]!; w.blocks = [{ t: 'model', h: full ? 3.4 : 1.2 }]; w.busy = true; w.lamp = 'work'; });
  for (const size of FOUND) {
    await h.wait(340);
    h.set((s) => { s.agents[1]!.blocks!.push({ t: 'tool', h: size }); });
    show(ctx, pct(ctx, 'w0'));
  }
  let changed = 0;
  if (!full) {
    ctx.say('helper', '“Sort out” sounds like fix. Rewriting the date handling.');
    const project = ctx.scene.state.project!;
    for (const f of [1, 3, 4]) {
      await h.send(route.workerToMain(AT, project), 'bad', { ms: 420 });
      h.set((s) => { const files = (s.project!.files ??= ['', '', '', '', '', '']); files[f] = 'bad'; s.agents[1]!.blocks!.push({ t: 'bad', h: 2 }); });
      changed++;
      show(ctx, pct(ctx, 'w0'), `${changed}, and you said none`);
    }
  }
  h.set((s) => { s.agents[1]!.busy = false; s.agents[1]!.lamp = full ? 'ok' : 'bad'; });
  const helperFill = Math.round(ctx.scene.fill('w0') * 100);
  await h.send(reverse(route.agentToWorker(AT)), full ? 'tool' : 'bad');
  h.set((s) => { s.agents[0]!.blocks!.push({ t: full ? 'tool' : 'bad', h: 1.6 }); s.agents[1]!.blocks = []; s.agents[1]!.lamp = 'off'; });
  ctx.say('helper', full ? 'Three files read dates: members.ts (parses), export.ts (formats), import.ts (parses).' : 'Done. I rewrote the date handling in three files.');
  show(ctx, `was ${helperFill}% full, thrown away`, full ? 0 : `${changed}, and you said none`);
  await h.wait(2400);
  ctx.say(null, full
    ? 'The seven files filled the helper’s window, which is gone now. The agent got three lines.'
    : '“Do not change anything” was in the agent’s window, not in the brief. The helper never saw it.');
}

export const handoff: Chapter = {
  steps: {
    alone: { scene: () => base(false), enter: (ctx) => void ctx.scene.run((h) => alone(ctx, h)) },
    hand: { scene: () => base(true), enter: (ctx) => void ctx.scene.run((h) => handed(ctx, h)) },
    brief: { scene: () => base(true), enter: (ctx) => void ctx.scene.run((h) => handed(ctx, h, false)) },
  },
  actions: {
    alone: (ctx) => void ctx.scene.run((h) => alone(ctx, h)),
    hand: (ctx, val) => {
      ctx.say(null, val === 'short' ? 'A short brief: “Sort out the dates.” Watch the project.' : 'A full brief: goal, where to look, what not to touch, what to send back.');
      void ctx.scene.run((h) => handed(ctx, h, val !== 'short'));
    },
  },
};
