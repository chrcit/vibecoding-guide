// Lesson 4 (part one): the first real loop on the device in front of you. One small real job, the
// club's member list (made up), and the four beats: you ask, it builds, you look, you say what to
// change. Browser builders are the side road, shown when the reader picks the phone.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { lab } from '../presets';
import { route, reverse, SPOT, type SceneState, type XY, type Zone, type Gear } from '../picture';
import { note, readout, lv } from './part1';
import { termLabel } from '../terms';

const stat = readout(['working on', 'beat, this round', 'files in your project', 'checked by']);
const TOOLS = { at: SPOT.tools, ids: ['read', 'edit', 'run', 'search'] };
const PROJ = { at: SPOT.project };
const CLOUD: Zone = { id: 'cloud', kind: 'cloud', rect: [-30, -30, 60, 60] };

type Device = 'laptop' | 'desktop' | 'phone';
function scene(device: Device = 'laptop', o: { tray?: boolean } = {}): SceneState {
  const showGear = !o.tray;
  const builder = device === 'phone';
  const gear: Gear = builder ? { id: 'me', at: [-22, 118], kind: 'phone', scale: 0.9 } : device === 'desktop' ? { id: 'me', at: [40, 112], kind: 'desktop', scale: 0.8 } : { id: 'me', at: [34, 104], kind: 'laptop' };
  return {
    you: SPOT.you,
    agents: [{ id: 'a0', at: SPOT.agent, blocks: [] }],
    tools: { at: SPOT.tools, ids: TOOLS.ids },
    project: { at: SPOT.project, rules: 'none', files: ['', '', '', '', '', ''] },
    gates: [{ id: 'gate', at: SPOT.gate, axis: 'y' }],
    tray: o.tray ? { at: [60, 128], cards: [] } : null,
    zones: builder
      ? [{ id: 'cloud', kind: 'cloud', rect: [-30, -44, 250, 88] }]
      : [CLOUD, { id: 'mine', kind: device === 'desktop' ? 'box' : 'laptop', rect: [52, -42, 166, 84] }],
    gear: showGear ? [gear] : [],
    tracks: [[[0, 94], [0, 22]], [[20, 0], [56, 0]], [[88, 0], [120, 0]]],
    labels: [
      lab('you', 'you', 'left'),
      termLabel('a0', 'agent', 'top', 'the agent'),
      termLabel('gate', 'check', 'right'),
      termLabel('project', 'project'),
      builder
        ? lab('zone:cloud', 'all on the builder’s site', 'bottom', 'wiki/web-builders/')
        : lab('zone:mine', device === 'desktop' ? 'your desktop PC: the files' : 'your laptop: the files', 'bottom'),
      ...(showGear ? [lab('gear:me', builder ? 'phone browser' : device === 'desktop' ? 'desktop PC' : 'laptop', 'right')] : []),
    ],
  };
}

// ---------- device ----------

function runDevice(ctx: Ctx, d: Device) {
  note(ctx, 'first', 'device');
  void ctx.scene.run(async (h) => {
    h.set((s) => Object.assign(s, scene(d)));
    const on = d === 'phone' ? 'a builder in the phone’s browser' : d === 'desktop' ? 'your desktop PC' : 'your laptop';
    stat(ctx, [on, '–', d === 'phone' ? 'on the builder’s site' : 'an empty folder, club-list', '–']);
    ctx.say('you', d === 'phone' ? 'A list of my club’s members and who has paid.' : 'Hello. Here is who I am and what I want to build.');
    await h.send(route.youToAgent(), 'you', { ms: 460 });
    h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 3 }]; s.agents[0]!.busy = true; });
    await h.wait(800);
    h.set((s) => { s.agents[0]!.busy = false; s.agents[0]!.blocks!.push({ t: 'model', h: 2 }); });
    await h.send(reverse(route.youToAgent()), 'model', { ms: 460 });
    ctx.say('agent', d === 'phone' ? 'Here is a first version. Tap Preview to try it.' : 'Got it. What should I call the folder, and is the data only on this computer?');
    await h.wait(1500);
    ctx.say(null, d === 'phone'
      ? 'Quickest start of all. The files live on their site, not on a computer of yours.'
      : 'One app, one plan, one empty folder. That is the whole set-up.');
  });
}

// ---------- the job ----------

async function runJob(ctx: Ctx, h: Script) {
  note(ctx, 'first', 'job');
  h.set((s) => Object.assign(s, scene('laptop', { tray: true })));
  stat(ctx, ['your laptop', '1 of 4: you ask', 'empty', '–']);
  ctx.say('you', 'I want a small web app for a neighbourhood football club to track who has paid this season…');
  await h.send(route.youToAgent(), 'you', { ms: 460 });
  h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 5 }]; s.agents[0]!.busy = true; });
  await h.wait(900);
  h.set((s) => { s.agents[0]!.busy = false; s.agents[0]!.blocks!.push({ t: 'model', h: 2 }); s.agents[0]!.lamp = 'wait'; });
  await h.send(route.agentToTray({ at: [60, 128], cards: [] }), 'model', { ms: 460 });
  h.set((s) => { s.tray!.cards = [{ id: 'q', mark: 'wait' }]; s.labels!.push(lab('card:q', 'two questions', 'right')); });
  ctx.say('agent', lv(ctx,
    'Two questions first: how many teams, and do you want to record how much each member paid, or only paid / not paid?',
    'Two questions first: how many teams, and paid / not paid or amounts? Plan: Vite + TypeScript, data in localStorage, tests with Vitest.',
    'Two questions first: teams, and amounts or a flag? Proposed: Vite + TypeScript, localStorage behind a small store module, Vitest. Alternative: SQLite with a tiny server, if more than one person edits. OK?'));
  await h.wait(1800);
  ctx.say('you', 'Three teams. Only paid or not.');
  await h.send(route.youToAgent(), 'you', { ms: 420 });
  h.set((s) => { s.tray!.cards = [{ id: 'q', mark: 'ok' }]; s.agents[0]!.lamp = 'work'; s.agents[0]!.blocks!.push({ t: 'you', h: 1.5 }); });
  await h.wait(900);
  ctx.say(null, 'It asked before building, because the prompt told it to. Two answers saved a wrong guess.');
}

// ---------- the four beats ----------

async function runLoop(ctx: Ctx, h: Script) {
  note(ctx, 'first', 'loop');
  h.set((s) => Object.assign(s, scene('laptop', { tray: true })));
  const checked = lv(ctx, 'it opened the page', 'npm test, tsc --noEmit', 'npm test, tsc --noEmit');
  stat(ctx, ['your laptop', '1 of 4: you ask', 'empty', '–']);
  ctx.say('you', 'A list of members, a form to add one, a way to mark them paid.');
  await h.send(route.youToAgent(), 'you', { ms: 440 });
  h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 4 }]; s.agents[0]!.lamp = 'work'; });
  stat(ctx, ['your laptop', '2 of 4: it builds', 'writing…', '–']);
  const files: [number, string][] = [[0, 'index.html'], [1, 'members.ts'], [2, 'members.test.ts'], [3, 'style.css']];
  for (const [i, name] of files) {
    h.set((s) => { s.agents[0]!.busy = true; s.tools!.on = 'edit'; });
    ctx.say('agent', `Writing ${name}…`);
    await h.send(route.toolToFile(TOOLS, 'edit', PROJ, i), 'model', { ms: 300 });
    h.set((s) => { s.project!.files![i] = 'edit'; s.agents[0]!.blocks!.push({ t: 'tool', h: 1.2 }); s.tools!.on = null; });
  }
  h.set((s) => { s.tools!.on = 'run'; });
  ctx.say('agent', lv(ctx, 'Opening the page and trying the form…', 'npm test: 6 passed. npx tsc --noEmit: no errors.', 'npm test: 6 passed (store, filters, empty list). npx tsc --noEmit: clean. npm run dev on :5173.'));
  await h.send(route.agentToGate(), 'model', { ms: 360 });
  h.set((s) => { s.gates![0]!.lamp = 'ok'; s.tools!.on = null; s.agents[0]!.busy = false; s.project!.files = ['ok', 'ok', 'ok', 'ok', '', '']; });
  stat(ctx, ['your laptop', '2 of 4: it builds', '4 new files', checked]);
  await h.wait(900);
  await h.send(route.gateToYou(), 'model', { ms: 360 });
  h.set((s) => { s.tray!.cards = [{ id: 'shot', b: 'tool', }]; s.labels!.push(lab('card:shot', 'the page, open', 'right')); s.agents[0]!.lamp = 'ok'; });
  ctx.say('agent', 'Done. Open http://localhost:5173 and add a member first.');
  stat(ctx, ['your laptop', '3 of 4: you look', '4 new files', checked]);
  await h.wait(1800);
  ctx.say('you', 'The paid tick works. Unpaid people should stand out more.');
  await h.send(route.youToAgent(), 'you', { ms: 440 });
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 1.5 }); s.agents[0]!.lamp = 'work'; s.gates![0]!.lamp = 'off'; });
  stat(ctx, ['your laptop', '4 of 4: you say what to change', '4 new files', checked]);
  await h.wait(1400);
  ctx.say(null, 'Then round again. Every round is these four beats.');
}

// ---------- say what to change ----------

async function runChange(ctx: Ctx, h: Script, clear: boolean) {
  note(ctx, 'first', 'change');
  h.set((s) => {
    Object.assign(s, scene('laptop', { tray: true }));
    s.project!.files = ['ok', 'ok', 'ok', 'ok', '', ''];
    s.agents[0]!.blocks = [{ t: 'you', h: 4 }, { t: 'tool', h: 5 }, { t: 'model', h: 1.5 }];
  });
  const checked = lv(ctx, 'it opened the page', 'npm test, tsc --noEmit', 'npm test, tsc --noEmit');
  stat(ctx, ['your laptop', '4 of 4: you say what to change', '4 files', checked]);
  ctx.say('you', clear
    ? 'Three changes: sort by team, then name. Make unpaid members easy to spot. At the top, show “18 of 25 paid”.'
    : 'Make it better and more modern, add stats, fix it on phones, maybe like a real app.');
  await h.send(route.youToAgent(), 'you', { ms: 440 });
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: clear ? 2 : 1.5 }); s.agents[0]!.busy = true; s.agents[0]!.lamp = 'work'; });
  const edits = clear ? [1, 3] : [0, 1, 2, 3, 4, 5];
  for (const i of edits) {
    h.set((s) => { s.tools!.on = 'edit'; });
    await h.send(route.toolToFile(TOOLS, 'edit', PROJ, i), clear ? 'model' : 'bad', { ms: 260 });
    h.set((s) => { s.project!.files![i] = clear ? 'edit' : 'bad'; s.tools!.on = null; });
  }
  h.set((s) => { s.agents[0]!.busy = false; });
  await h.send(route.agentToGate(), 'model', { ms: 340 });
  h.set((s) => { s.gates![0]!.lamp = 'ok'; });
  await h.send(route.gateToYou(), clear ? 'model' : 'bad', { ms: 340 });
  h.set((s) => {
    s.tray!.cards = clear ? [{ id: 'a', b: 'tool', mark: 'ok' }, { id: 'b', b: 'tool', mark: 'ok' }, { id: 'c', b: 'tool', mark: 'ok' }] : [{ id: 'a', b: 'bad', mark: 'bad' }];
    s.labels!.push(lab(clear ? 'card:b' : 'card:a', clear ? '3 of 3, each one easy to see' : 'a new look you did not ask for', 'right'));
  });
  ctx.say('agent', clear ? 'Done: sorted, unpaid in red, “18 of 25 paid” at the top.' : 'Done. New design, a stats page, dark mode, and a menu.');
  stat(ctx, ['your laptop', '3 of 4: you look', clear ? '2 changed' : 'all 6 changed', clear ? checked : 'passes, but is it right?']);
  await h.wait(1800);
  ctx.say(null, clear
    ? 'Each change is something you can look for in ten seconds.'
    : 'It guessed what “better” means and touched every file. Now you have to look at everything.');
}

export async function demo(ctx: Ctx, h: Script) {
  await runLoop(ctx, h);
}

export const firstCh: Chapter = {
  steps: {
    device: { scene: () => scene('laptop'), enter: (ctx) => runDevice(ctx, 'laptop') },
    job: { scene: () => scene('laptop', { tray: true }), enter: (ctx) => void ctx.scene.run((h) => runJob(ctx, h)) },
    loop: { scene: () => scene('laptop', { tray: true }), enter: (ctx) => void ctx.scene.run((h) => runLoop(ctx, h)) },
    change: { scene: () => scene('laptop', { tray: true }), enter: (ctx) => void ctx.scene.run((h) => runChange(ctx, h, true)) },
  },
  actions: {
    device: (ctx, val) => runDevice(ctx, val as Device),
    loop: (ctx) => void ctx.scene.run((h) => runLoop(ctx, h)),
    change: (ctx, val) => void ctx.scene.run((h) => runChange(ctx, h, val === 'clear')),
  },
};
