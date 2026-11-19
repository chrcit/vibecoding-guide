// Lesson 2 (part one): who makes the models, how you reach them, where the model runs and where
// your files stay, and the devices you work from. Names and prices come from the page (src/data).
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { lab } from '../presets';
import { route, reverse, SPOT, type SceneState, type XY, type Zone, type Gear } from '../picture';
import { note, readout, lv } from './part1';
import { termLabel } from '../terms';

const stat = readout(['model', 'runs on', 'your files', 'you pay']);

/** Sourced names and prices, handed over by the page. */
interface Data {
  anthropic: string[]; openai: string[];
  claudeFree: string; claudePro: string; chatgptFree: string; chatgptPlus: string;
  opusIn: string; opusOut: string; t3: string;
}
const D = (ctx: Ctx) => ctx.data as Data;

const CLOUD: Zone = { id: 'cloud', kind: 'cloud', rect: [-30, -30, 60, 60] };
const LAPTOP: XY = [40, 100];

/** You at your laptop, the model on a provider's computers. */
function base(o: { model?: string; zone?: string; tools?: boolean; gear?: Gear[]; local?: boolean } = {}): SceneState {
  const tools = o.tools ?? false;
  return {
    you: SPOT.you,
    agents: [{ id: 'a0', at: SPOT.agent, blocks: [] }],
    tools: tools ? { at: SPOT.tools, ids: ['read', 'edit', 'run', 'search'] } : null,
    project: tools ? { at: SPOT.project, rules: 'none' } : null,
    zones: [o.local ? { id: 'cloud', kind: 'box', rect: [-30, -30, 60, 60] } : CLOUD, ...(tools ? [{ id: 'lap', kind: 'laptop' as const, rect: [52, -42, 166, 84] as Zone['rect'] }] : [])],
    gear: o.gear ?? [{ id: 'lap', at: LAPTOP, kind: 'laptop' }],
    tracks: [[[0, 94], [0, 22]], ...(tools ? [[[20, 0], [56, 0]], [[88, 0], [120, 0]]] as XY[][] : [])],
    labels: [
      lab('you', 'you', 'left'),
      termLabel('a0', 'model', 'top', o.model ?? 'Opus 5.5'),
      lab('zone:cloud', o.zone ?? 'Anthropic’s computers', 'left'),
      ...(tools ? [lab('zone:lap', 'your laptop: the files', 'bottom'), termLabel('project', 'project')] : [lab('gear:lap', 'your laptop', 'right')]),
    ],
  };
}

// ---------- labs ----------

type Lab = 'anthropic' | 'openai' | 'open';
function runLab(ctx: Ctx, which: Lab) {
  note(ctx, 'providers', 'labs');
  const d = D(ctx);
  const model = which === 'anthropic' ? 'Opus 5.5' : which === 'openai' ? 'GPT-6.2 Sol' : 'an open model';
  const names = which === 'anthropic' ? d.anthropic.join(', ') : which === 'openai' ? d.openai.join(', ') : 'many, free to download';
  const where = which === 'anthropic' ? 'Anthropic’s computers' : which === 'openai' ? 'OpenAI’s computers' : 'your own computer';
  void ctx.scene.run(async (h) => {
    h.set((s) => { Object.assign(s, base({ model, zone: where, local: which === 'open' })); if (which === 'openai') s.agents[0]!.model = 'b'; });
    stat(ctx, [names, where, 'your laptop', which === 'open' ? 'nothing per message' : 'a plan or per token']);
    ctx.say('you', 'Who has not paid this season? [list pasted]');
    await h.send(route.youToAgent(), 'you', { ms: 460 });
    h.set((s) => { const a = s.agents[0]!; a.blocks = [{ t: 'you', h: 8 }]; a.busy = true; });
    await h.wait(900);
    h.set((s) => { const a = s.agents[0]!; a.busy = false; a.blocks!.push({ t: 'model', h: 3 }); });
    await h.send(reverse(route.youToAgent()), 'model', { ms: 460 });
    ctx.say(model, '7 have not paid: Ana Ruiz, Ben Okafor, Dev Patel and 4 more.');
    await h.wait(1800);
    ctx.say(null, which === 'open'
      ? 'Same question, same window. The model runs on your own machine, which needs a lot of memory.'
      : 'Same question, same window, same kind of answer. Only the maker and the machines changed.');
  });
}

// ---------- reach ----------

type Reach = 'app' | 'code' | 'api' | 't3';
function runReach(ctx: Ctx, how: Reach) {
  note(ctx, 'providers', 'reach');
  const d = D(ctx);
  void ctx.scene.run(async (h) => {
    const s0 = base({ tools: how !== 'app', gear: how === 'app' ? [{ id: 'lap', at: [30, 112], kind: 'phone' }] : [] });
    if (how === 'app') s0.labels![3] = lab('gear:lap', 'the Claude app on your phone', 'right');
    s0.meters = [{ id: 'm0', at: SPOT.meter, mode: how === 'api' ? 'api' : 'plan', level: how === 'api' ? 0 : 1 }];
    s0.labels!.push(termLabel('meter:m0', how === 'api' ? 'api' : 'plan', 'left', how === 'api' ? 'API bill' : 'plan'));
    if (how === 't3') {
      s0.agents.push({ id: 'r0', at: [-70, 54], scale: 0.8, blocks: [], model: 'b' });
      s0.zones!.push({ id: 'oai', kind: 'cloud', rect: [-96, 30, 52, 48] });
      s0.labels![1] = termLabel('a0', 'harness', 'top', 'Opus 5.5 · Claude Code');
      s0.labels!.push(termLabel('r0', 'harness', 'left', 'GPT-6.2 Sol · Codex'));
      s0.labels!.push(lab('you', 'you, in T3 Code', 'left', 'wiki/agentic-development-environment/'));
      s0.labels!.shift();
    }
    h.set((s) => Object.assign(s, s0));
    const pay = how === 'app' ? `Claude Free ${d.claudeFree} or Pro ${d.claudePro} a month`
      : how === 'code' ? `Claude Pro ${d.claudePro} (includes Claude Code); Codex from ChatGPT Free`
      : how === 'api' ? `Opus 5.5: ${d.opusIn} in, ${d.opusOut} out, per million tokens`
      : `T3 Code is ${d.t3}; your plans as before`;
    const model = how === 't3' ? 'Opus 5.5 and GPT-6.2 Sol' : 'Opus 5.5';
    const files = how === 'app' ? 'none: you paste' : 'your laptop';
    stat(ctx, [model, 'the providers’ computers', files, pay]);
    ctx.say('you', how === 'app' ? 'Who has not paid? [photo of the paper list]' : 'Make the member list show who has not paid.');
    for (let turn = 0; turn < (how === 'app' ? 1 : 4); turn++) {
      await h.send(turn === 0 ? route.youToAgent() : route.agentToTool({ at: SPOT.tools, ids: ['read', 'edit', 'run', 'search'] }, ['read', 'edit', 'run'][turn - 1]!), turn === 0 ? 'you' : 'model', { ms: 380 });
      h.set((s) => {
        const a = s.agents[0]!;
        a.blocks!.push({ t: turn === 0 ? 'you' : 'tool', h: 2.4 });
        a.busy = true;
        if (how === 't3') { const r = s.agents[1]!; r.blocks!.push({ t: turn === 0 ? 'you' : 'tool', h: 2.4 }); r.busy = true; }
        const m = s.meters![0]!;
        if (m.mode === 'api') m.level += 3; else m.level = Math.max(0.55, m.level - 0.1);
      });
      await h.wait(420);
      h.set((s) => { for (const a of s.agents) a.busy = false; });
    }
    if (how === 'app') {
      await h.send(reverse(route.youToAgent()), 'model', { ms: 440 });
      ctx.say('Opus 5.5', '7 have not paid. You will have to copy this into your spreadsheet yourself.');
    } else {
      await h.send(reverse(route.youToAgent()), 'model', { ms: 440 });
      ctx.say(how === 't3' ? 'both' : 'Opus 5.5', how === 't3' ? 'Two answers to the same job, one from each maker, side by side.' : 'Done. The list has an “Unpaid” button; I tried it.');
    }
    await h.wait(1800);
    ctx.say(null, how === 'api' ? 'Every token went on the bill: more work, more coins.'
      : how === 't3' ? 'One window on your screen, two providers behind it, each on your own login.'
      : how === 'app' ? 'The app is the quickest way in. It cannot touch your files.'
      : 'Same plan as the app, now working on a folder on your laptop.');
  });
}

// ---------- where it runs ----------

async function runWhere(ctx: Ctx, h: Script, online: boolean) {
  note(ctx, 'providers', 'where');
  h.set((s) => Object.assign(s, base({ tools: true, gear: [] })));
  stat(ctx, ['Opus 5.5', online ? 'Anthropic’s computers' : 'out of reach', 'your laptop', '–']);
  ctx.say('you', 'Make the member list show who has not paid.');
  if (!online) {
    await h.send([[0, 94], [0, 60]], 'you', { ms: 420 });
    h.set((s) => { s.zones![0]!.off = true; s.agents[0]!.off = true; s.agents[0]!.lamp = 'bad'; });
    ctx.say(null, 'No connection. The model is out of reach, so nothing happens.');
    await h.wait(2000);
    h.set((s) => { s.project!.files = ['ok', 'ok', 'ok', 'ok', 'ok', 'ok']; });
    ctx.say(null, 'Your files are all still on the laptop, as you left them.');
    return;
  }
  await h.send(route.youToAgent(), 'you', { ms: 420 });
  h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 2 }]; s.agents[0]!.busy = true; });
  const tools = { at: SPOT.tools, ids: ['read', 'edit', 'run', 'search'] };
  const proj = { at: SPOT.project };
  for (const [tool, file, line] of [
    ['read', 0, 'Up: “read members.ts”. Down: the file’s text.'],
    ['edit', 0, 'Up: nothing. Down: the change, written on your laptop.'],
    ['run', -1, lv(ctx, 'The page runs on your laptop. Down: what it showed.', 'npm test runs on your laptop. Down: its output.')],
  ] as const) {
    h.set((s) => { s.tools!.on = tool; });
    await h.send(route.agentToTool(tools, tool), 'model', { ms: 360 });
    if (file >= 0) await h.send(route.toolToFile(tools, tool, proj, file), 'tool', { ms: 360 });
    h.set((s) => { if (file >= 0) { const f = (s.project!.files ??= ['', '', '', '', '', '']); f[file] = tool === 'edit' ? 'edit' : 'read'; } });
    await h.send(reverse(route.agentToTool(tools, tool)), 'tool', { ms: 360 });
    h.set((s) => { s.agents[0]!.blocks!.push({ t: 'tool', h: 2 }); s.tools!.on = null; });
    ctx.say(null, line);
    await h.wait(700);
  }
  h.set((s) => { s.agents[0]!.busy = false; });
  await h.send(reverse(route.youToAgent()), 'model', { ms: 420 });
  ctx.say('Opus 5.5', 'Done. members.ts has an “unpaid” filter; I tried it.');
  stat(ctx, ['Opus 5.5', 'Anthropic’s computers', 'your laptop: 1 read, 1 changed', '–']);
  await h.wait(1600);
  ctx.say(null, 'The thinking happened far away. Every file it read or changed stayed on your laptop.');
}

// ---------- devices ----------

type Device = 'laptop' | 'desktop' | 'phone';
const DESK: XY = [118, 70];
const PHONE: XY = [-36, 124];
function devScene(active: Device): SceneState {
  return {
    you: SPOT.you,
    agents: [{ id: 'a0', at: SPOT.agent, blocks: [] }],
    zones: [CLOUD, { id: 'home', kind: 'box', rect: [96, 48, 46, 44] }],
    gear: [
      { id: 'lap', at: LAPTOP, kind: 'laptop', lamp: active === 'laptop' ? 'work' : 'off' },
      { id: 'desk', at: DESK, kind: 'desktop', lamp: active === 'desktop' || active === 'phone' ? 'work' : 'off' },
      { id: 'phone', at: PHONE, kind: 'phone', scale: 0.9, lamp: active === 'phone' ? 'work' : 'off' },
    ],
    tracks: [[[0, 94], [0, 22]], [[DESK[0] - 14, DESK[1]], [22, 8]]],
    labels: [
      lab('you', 'you', 'left'),
      termLabel('a0', 'model', 'top', 'Opus 5.5'),
      lab('zone:cloud', 'Anthropic’s computers', 'left'),
      lab('gear:lap', 'laptop', 'right'),
      lab('gear:desk', 'desktop PC at home', 'top', 'wiki/always-on-machine/'),
      lab('gear:phone', 'phone', 'bottom'),
    ],
  };
}
function runDevice(ctx: Ctx, which: Device) {
  note(ctx, 'providers', 'devices');
  void ctx.scene.run(async (h) => {
    h.set((s) => Object.assign(s, devScene(which)));
    const files = which === 'laptop' ? 'on the laptop' : 'on the desktop PC';
    stat(ctx, ['Opus 5.5', 'Anthropic’s computers', files, '–']);
    const fromDesk: XY[] = [[DESK[0] - 14, DESK[1]], [22, 8]];
    if (which === 'laptop') {
      ctx.say('you', 'Add a “paid on” date to each member.');
      await h.send([[LAPTOP[0], LAPTOP[1] - 10], [0, 40], [0, 22]], 'you', { ms: 520 });
      h.set((s) => { s.agents[0]!.busy = true; });
      await h.wait(1200);
      h.set((s) => { s.gear![0]!.off = true; s.gear![0]!.lamp = 'off'; s.agents[0]!.busy = false; });
      ctx.say(null, 'You close the lid to catch a train. The job on the laptop stops until you open it again.');
      stat(ctx, ['Opus 5.5', 'Anthropic’s computers', 'on the laptop, lid closed', '–']);
      return;
    }
    if (which === 'desktop') {
      ctx.say('you', 'Overnight: add a “paid on” date and try it on every page.');
      await h.send(reverse(fromDesk), 'you', { ms: 520 });
      for (let i = 0; i < 3; i++) {
        h.set((s) => { s.agents[0]!.busy = true; });
        await h.send(fromDesk, 'model', { ms: 420 });
        await h.send(reverse(fromDesk), 'tool', { ms: 420 });
        h.set((s) => { s.agents[0]!.busy = false; });
      }
      ctx.say(null, 'The desktop stays on, so the job keeps going while you sleep.');
      return;
    }
    ctx.say('you', '[on the bus] Looks good, go ahead.');
    await h.send([[PHONE[0] + 6, PHONE[1] - 6], [DESK[0] - 10, DESK[1] + 4]], 'you', { ms: 620 });
    h.set((s) => { s.agents[0]!.busy = true; });
    await h.send(fromDesk, 'model', { ms: 420 });
    await h.send(reverse(fromDesk), 'tool', { ms: 420 });
    h.set((s) => { s.agents[0]!.busy = false; });
    await h.send([[DESK[0] - 10, DESK[1] + 4], [PHONE[0] + 6, PHONE[1] - 6]], 'model', { ms: 620 });
    ctx.say('desktop PC', 'Done: “paid on” dates added. Screenshot attached.');
    stat(ctx, ['Opus 5.5', 'Anthropic’s computers', 'on the desktop PC; the phone shows them', '–']);
    await h.wait(1600);
    ctx.say(null, 'The phone only shows and steers. The desktop at home does the work, so it has to stay on.');
  });
}

export async function demo(ctx: Ctx, h: Script) {
  await runWhere(ctx, h, true);
}

export const providersCh: Chapter = {
  steps: {
    labs: { scene: () => base(), enter: (ctx) => runLab(ctx, 'anthropic') },
    reach: { scene: () => base(), enter: (ctx) => runReach(ctx, 'app') },
    where: { scene: () => base({ tools: true, gear: [] }), enter: (ctx) => void ctx.scene.run((h) => runWhere(ctx, h, true)) },
    devices: { scene: () => devScene('laptop'), enter: (ctx) => runDevice(ctx, 'laptop') },
  },
  actions: {
    lab: (ctx, val) => runLab(ctx, val as Lab),
    reach: (ctx, val) => runReach(ctx, val as Reach),
    online: (ctx, val) => void ctx.scene.run((h) => runWhere(ctx, h, val === 'on')),
    device: (ctx, val) => runDevice(ctx, val as Device),
  },
};
