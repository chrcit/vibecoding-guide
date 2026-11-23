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
const ASK = 'Find each date read. Change nothing.';
/** The windows speak for themselves, at their glass; the project for its files. */
export const SPEAKERS = { window: 'tank:a0', 'helper window': 'tank:w0', project: 'project' };
const pct = (ctx: Ctx, id: string) => `${Math.round(ctx.scene.fill(id) * 100)}% full`;
// One readout for the lesson: how full each window is, and what changed in your project.
const show = (ctx: Ctx, helper: string, changed: number | string = 0) => ctx.stat([
  ['the agent’s window', pct(ctx, 'a0')],
  ['the helper’s window', helper],
  ['files changed in your project', changed],
]);

export async function alone(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base(false)); });
  ctx.say('you', ASK);
  ctx.say(null, 'You ask for every place the app reads a date, and for no changes yet.');
  show(ctx, 'no helper');
  await h.wait(500);
  for (const size of FOUND) {
    h.set((s) => { s.agents[0]!.busy = true; s.agents[0]!.blocks!.push({ t: 'tool', h: size }); });
    show(ctx, 'no helper');
    await h.wait(360);
  }
  h.set((s) => { s.agents[0]!.busy = false; s.agents[0]!.blocks!.push({ t: 'model', h: 2.4 }); });
  ctx.say('agent', 'Read 7 files. 3 of them read dates.');
  show(ctx, 'no helper');
  await h.wait(1800);
  ctx.say('window', `${pct(ctx, 'a0')}, and it stays.`);
  await h.wait(600);
  ctx.say(null, 'Seven whole files now sit in the agent’s window, for a three-line answer. They stay there for the rest of the job.');
}

export async function handed(ctx: Ctx, h: Script, full = true) {
  h.set((s) => { Object.assign(s, base(true)); });
  ctx.say('you', ASK);
  show(ctx, 'empty');
  await h.wait(900);
  ctx.say('agent', full ? 'Brief: list date files. Change nothing.' : 'Brief: sort out the dates.');
  ctx.say(null, full
    ? 'The brief: list every file that reads a date, one line each, and change no file.'
    : 'The brief says only “Sort out the dates.” Your “change nothing” stays in the agent’s window.');
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
    ctx.say('helper', '“Sort out” means fix. Rewriting dates.');
    const project = ctx.scene.state.project!;
    for (const f of [1, 3, 4]) {
      await h.send(route.workerToMain(AT, project), 'bad', { ms: 420 });
      h.set((s) => { const files = (s.project!.files ??= ['', '', '', '', '', '']); files[f] = 'bad'; s.agents[1]!.blocks!.push({ t: 'bad', h: 2 }); });
      changed++;
      show(ctx, pct(ctx, 'w0'), `${changed}, and you said none`);
      ctx.say('project', `${changed} ${changed === 1 ? 'file' : 'files'} edited.`);
    }
  }
  h.set((s) => { s.agents[1]!.busy = false; s.agents[1]!.lamp = full ? 'ok' : 'bad'; });
  const helperFill = Math.round(ctx.scene.fill('w0') * 100);
  await h.send(reverse(route.agentToWorker(AT)), full ? 'tool' : 'bad');
  h.set((s) => { s.agents[0]!.blocks!.push({ t: full ? 'tool' : 'bad', h: 1.6 }); s.agents[1]!.blocks = []; s.agents[1]!.lamp = 'off'; });
  ctx.say('helper', full ? '3 lines: members, export, import.ts' : 'Done. Rewrote dates in 3 files.');
  show(ctx, `was ${helperFill}% full, thrown away`, full ? 0 : `${changed}, and you said none`);
  await h.wait(1800);
  ctx.say('helper window', `Was ${helperFill}% full. Thrown away.`);
  await h.wait(600);
  ctx.say(null, full
    ? 'The helper sent back three lines: members.ts parses dates, export.ts formats them, import.ts parses them. The seven files it read went with its window.'
    : '“Do not change anything” was in the agent’s window, not in the brief. The helper never saw it, and rewrote three files.');
}

export const handoff: Chapter = {
  speakers: SPEAKERS,
  steps: {
    alone: { scene: () => base(false), enter: (ctx) => void ctx.scene.run((h) => alone(ctx, h)) },
    hand: { scene: () => base(true), enter: (ctx) => void ctx.scene.run((h) => handed(ctx, h)) },
    // What this step is about is your project: how many files the helper changed.
    brief: { scene: () => base(true), counter: (pairs) => `files changed ${String(pairs[2]?.[1] ?? 0).split(',')[0]}`, enter: (ctx) => void ctx.scene.run((h) => handed(ctx, h, false)) },
  },
  actions: {
    alone: (ctx) => void ctx.scene.run((h) => alone(ctx, h)),
    hand: (ctx, val) => {
      ctx.say(null, val === 'short' ? 'A short brief: “Sort out the dates.” Watch the project.' : 'A full brief: goal, where to look, what not to touch, what to send back.');
      void ctx.scene.run((h) => handed(ctx, h, val !== 'short'));
    },
  },
};
