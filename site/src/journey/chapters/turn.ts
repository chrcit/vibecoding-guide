// Chapter 13: your turn. One made-up job with a fork in it: "Let the club pause a member". Should a
// paused member be hidden from the list, or greyed out? You meant greyed out. The reader plays you:
// at each door the script stops and waits for a button, and if nobody presses it the picture stays
// waiting, which is the lesson.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';
import { route, reverse, fileSpot, cardSpot, SPOT, type Label, type SceneState, type XY } from '../picture';

const ASK = 'Let the club pause a member.';
const labels = (): Label[] => [lab('you', 'you', 'left'), lab('a0', 'the model', 'top', 'wiki/model/'), lab('gate', 'check', 'top', 'wiki/verification/')];
const base = (): SceneState => {
  const s = solo({ tools: true, project: true, gate: true, tray: [], labels: labels() });
  s.tray!.gap = 16;
  return s;
};
const toTray = (): XY[] => route.agentToTray({ at: SPOT.tray, cards: [] });

// One readout for the chapter: the same four names on every step.
interface Tally { turns: number; wrong: number; open: number; you: number }
const show = (ctx: Ctx, t: Tally) => ctx.stat([['turns', t.turns], ['on what you did not mean', t.wrong], ['left open', t.open], ['times you came in', t.you]]);

/**
 * A door the reader opens with a button. The script awaits `wake`; the button calls `open`. Kept in
 * ctx.mem, so scrolling to another step drops it and the script waiting on it is stopped.
 */
interface Door { value?: string; wake: Promise<string>; open(v: string): void }
function door(ctx: Ctx, preset?: string): Door {
  let resolve!: (v: string) => void;
  const d: Door = { wake: new Promise<string>((r) => { resolve = r; }), open: (v) => { if (d.value === undefined) { d.value = v; resolve(v); } } };
  if (preset) d.open(preset);
  ctx.mem.door = d;
  ctx.mem.finished = false;
  return d;
}
const finish = (ctx: Ctx) => { ctx.mem.finished = true; };

const busy = (s: SceneState, on: boolean) => { const a = s.agents[0]!; a.busy = on; a.lamp = on ? 'work' : 'off'; };

/** n turns of work on tools and files. `wrong`: they build on what you did not mean. */
async function work(ctx: Ctx, h: Script, t: Tally, n: number, wrong: boolean, files: number[] = [0, 1, 2, 3], fast = false) {
  h.set((s) => { busy(s, true); });
  const tools = ['read', 'edit', 'run', 'edit'];
  for (let i = 0; i < n; i++) {
    const tool = tools[i % tools.length]!;
    if (fast) await h.wait(200);
    else {
      h.set((s) => { s.tools!.on = tool; });
      await h.send(route.agentToTool(ctx.scene.state.tools!, tool), 'model', { ms: 240 });
    }
    h.set((s) => {
      s.tools!.on = null;
      s.agents[0]!.blocks!.push({ t: i % 2 ? 'model' : 'tool', h: 0.9 });
      if (tool === 'edit') { const f = (s.project!.files ??= ['', '', '', '', '', '']); f[files[i % files.length]!] = 'edit'; }
    });
    t.turns++;
    if (wrong) t.wrong++;
    show(ctx, t);
  }
  h.set((s) => { busy(s, false); });
}
async function youAsk(ctx: Ctx, h: Script, t: Tally) {
  ctx.say('you', ASK);
  await h.send(route.youToAgent(), 'you', { ms: 440 });
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 1.6 }); });
  t.you++;
  show(ctx, t);
}
async function done(ctx: Ctx, h: Script, wrongShown: boolean, line = 'Done.') {
  await h.send(route.agentToGate(), 'model', { ms: 340 });
  h.set((s) => { s.gates![0]!.lamp = 'ok'; });
  await h.wait(240);
  await h.send(route.gateToYou(), wrongShown ? 'bad' : 'model', { ms: 380 });
  ctx.say('the model', line);
}
const markFiles = (h: Script, mark: 'bad' | 'ok') => h.set((s) => { s.project!.files = (s.project!.files ?? []).map((f) => (f === 'edit' ? mark : f)); });

// ----- once: it guesses at the fork -----
async function once(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  const t: Tally = { turns: 0, wrong: 0, open: 0, you: 0 };
  show(ctx, t);
  await youAsk(ctx, h, t);
  await h.wait(300);
  ctx.say('the model', 'Paused members will be hidden from the list.');
  await work(ctx, h, t, 12, true);
  await done(ctx, h, true);
  await h.wait(900);
  markFiles(h, 'bad');
  ctx.say(null, 'Twelve turns, all built on its guess: hidden. You meant greyed out, and you spoke once, before the fork came up.');
  finish(ctx);
}

// ----- plan: a door before the build -----
const PLAN = 'Plan: 1 a paused flag. 2 a pause button. 3 hide paused members from the list. 4 tests. Go ahead?';
async function plan(ctx: Ctx, h: Script, d: Door) {
  h.set((s) => { Object.assign(s, base()); });
  const t: Tally = { turns: 0, wrong: 0, open: 0, you: 0 };
  show(ctx, t);
  await youAsk(ctx, h, t);
  h.set((s) => { busy(s, true); });
  await h.wait(700);
  h.set((s) => { busy(s, false); s.agents[0]!.blocks!.push({ t: 'model', h: 1.4 }); });
  await h.send(route.agentToGate(), 'model', { ms: 360 });
  h.set((s) => { s.gates![0]!.lamp = 'wait'; s.labels = [...labels().filter((l) => l.at !== 'gate'), lab('gate', 'the plan, waiting', 'right', 'wiki/plan-mode/')]; });
  ctx.say('the model', PLAN);
  if (d.value !== undefined) await h.wait(1400);
  const answer = await d.wake;
  h.check();
  t.you++;
  show(ctx, t);
  const change = answer === 'change';
  ctx.say('you', change ? 'Step 3: keep them in the list, greyed out.' : 'Go ahead.');
  await h.send(reverse(route.gateToYou()), 'you', { ms: 380 });
  h.set((s) => { s.gates![0]!.lamp = 'ok'; s.labels = labels(); });
  await h.send(reverse(route.agentToGate()), change ? 'you' : 'model', { ms: 320 });
  h.set((s) => { s.gates![0]!.lamp = 'off'; if (change) s.agents[0]!.blocks!.push({ t: 'you', h: 1 }); });
  await work(ctx, h, t, 12, !change);
  await done(ctx, h, !change);
  await h.wait(700);
  if (!change) markFiles(h, 'bad');
  ctx.say(null, change
    ? 'You read the plan once, before the build. All twelve turns went to what you meant.'
    : 'You let step 3 through. Twelve turns built paused members hidden, and you meant greyed out.');
  finish(ctx);
}

// ----- ask: a door during the build -----
async function asking(ctx: Ctx, h: Script, d: Door) {
  h.set((s) => { Object.assign(s, base()); });
  const t: Tally = { turns: 0, wrong: 0, open: 0, you: 0 };
  show(ctx, t);
  await youAsk(ctx, h, t);
  await work(ctx, h, t, 3, false, [0, 1]);
  // The fork: a question card, and the agent carries on with the rest.
  await h.send(toTray(), 'model', { ms: 380 });
  h.set((s) => { s.tray!.cards = [{ id: 'q', mark: 'wait' }]; s.labels = [...labels(), lab('card:q', 'a question', 'top', 'wiki/giving-feedback/')]; });
  ctx.say('the model', 'Hidden from the list, or greyed out? I will carry on with the rest meanwhile.');
  await h.wait(900);
  let answered = false;
  const take = async () => {
    answered = true;
    ctx.say('you', 'Greyed out.');
    t.you++;
    show(ctx, t);
    await h.send(reverse(toTray()), 'you', { ms: 380 });
    h.set((s) => { s.tray!.cards = [{ id: 'q', mark: 'ok' }]; s.agents[0]!.blocks!.push({ t: 'you', h: 0.8 }); });
  };
  for (let i = 0; i < 6; i++) {
    if (d.value !== undefined && !answered) await take();
    await work(ctx, h, t, 1, false, [i % 2 ? 4 : 5]);
  }
  if (!answered) {
    h.set((s) => { s.agents[0]!.lamp = 'off'; });
    t.open = 1;
    show(ctx, t);
    await done(ctx, h, false, 'Done, except how a paused member shows. That waits on your answer.');
    h.set((s) => { s.gates![0]!.lamp = 'off'; });
    await h.wait(900);
    ctx.say('the model', 'Still waiting: hidden from the list, or greyed out?');
    await d.wake;
    h.check();
    await take();
    t.open = 0;
  }
  await work(ctx, h, t, 2, false, [2, 3]);
  h.set((s) => { s.tray!.cards = []; s.labels = labels(); });
  await done(ctx, h, false, 'Done. Paused members are greyed out.');
  ctx.say(null, 'The question waited on the tray while the rest was built. One short answer, and nothing on a guess.');
  finish(ctx);
}

// ----- pin: a door on the result -----
async function pin(ctx: Ctx, h: Script, d: Door) {
  h.set((s) => { Object.assign(s, base()); s.project!.files = ['ok', 'ok', 'ok', 'ok', '', '']; });
  const t: Tally = { turns: 12, wrong: 0, open: 0, you: 1 };
  show(ctx, t);
  await h.wait(300);
  await h.send(toTray(), 'tool', { ms: 380 });
  h.set((s) => { s.tray!.cards = [{ id: 'shot', b: 'tool', mark: 'wait' }]; s.labels = [...labels(), lab('card:shot', 'screenshot', 'top', 'wiki/browser-check/')]; });
  ctx.say('the model', 'Here is the list with the new pause badge. Anything off?');
  if (d.value !== undefined) await h.wait(1200);
  const how = await d.wake;
  h.check();
  t.you++;
  t.open = 1;
  show(ctx, t);
  if (how === 'type') {
    ctx.say('you', 'The badge looks off.');
    h.set((s) => { s.tray!.cards[0]!.mark = undefined; });
    await h.send(route.youToAgent(), 'you', { ms: 420 });
    h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 0.8 }); });
    ctx.say('the model', 'Made the “paid” badge smaller.');
    await work(ctx, h, t, 3, true, [5]);
    await h.send(toTray(), 'tool', { ms: 360 });
    h.set((s) => { s.tray!.cards = [{ id: 'shot', b: 'bad', mark: 'bad' }]; s.project!.files![5] = 'bad'; });
    ctx.say(null, 'There are two badges on that screen. It picked one. Three turns on the wrong badge, and the pause badge is as it was.');
  } else {
    ctx.say('you', 'This badge sits on top of the name.');
    h.set((s) => {
      s.tray!.cards = [{ id: 'shot', b: 'tool' }, { id: 'note', b: 'you', mark: 'new' }];
      s.labels = [...labels(), lab('card:shot', 'screenshot', 'top', 'wiki/browser-check/'), lab('card:note', 'your pin', 'right', 'wiki/giving-feedback/')];
    });
    await h.wait(700);
    await h.send(reverse(toTray()), 'you', { ms: 420 });
    h.set((s) => { s.tray!.cards = [{ id: 'shot', b: 'tool' }]; s.labels = [...labels(), lab('card:shot', 'screenshot', 'top', 'wiki/browser-check/')]; s.agents[0]!.blocks!.push({ t: 'you', h: 0.8 }); });
    ctx.say('the model', 'Your pin is on the pause badge in the member row. Moving it after the name.');
    await work(ctx, h, t, 2, false, [3]);
    await h.send(toTray(), 'tool', { ms: 360 });
    h.set((s) => { s.tray!.cards = [{ id: 'shot', b: 'tool', mark: 'ok' }]; s.project!.files![3] = 'ok'; });
    t.open = 0;
    ctx.say(null, 'The pin carried its place with it. Two turns, on the badge you meant.');
  }
  show(ctx, t);
  finish(ctx);
}

// ----- build: have it build the door -----
const notesAt = (s: SceneState): XY => fileSpot(s.project!, 5);
async function build(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  const t: Tally = { turns: 0, wrong: 0, open: 0, you: 0 };
  show(ctx, t);
  ctx.say('you', 'Build a review page: every screen that changed, with a comment box under each. Save my comments to a notes file and read it at the start of your next turn.');
  await h.send(route.youToAgent(), 'you', { ms: 460 });
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 2.2 }); });
  t.you++;
  show(ctx, t);
  await work(ctx, h, t, 8, false, [4, 5]);
  await h.send(toTray(), 'tool', { ms: 400 });
  h.set((s) => {
    s.tray!.cards = [{ id: 'review', b: 'tool', mark: 'new' }];
    s.project!.files = ['', '', '', '', '', 'ok'];
    const [x, y] = notesAt(s);
    s.labels = [...labels(), lab('card:review', 'review page', 'top', 'wiki/giving-feedback/'), lab([x, y, 6], 'notes file', 'right')];
  });
  ctx.say('the model', 'The review page is up. It lists the three screens the last job changed.');
  await h.wait(1600);
  h.set((s) => { s.tray!.cards[0]!.mark = undefined; });
  // You use it: two comments go from the page into the notes file.
  for (const note of ['The pause button is too close to delete.', 'Say “paused” in words, not only grey.']) {
    ctx.say('you', note);
    const [cx] = cardSpot(ctx.scene.state.tray!, 'review');
    const [fx, fy] = notesAt(ctx.scene.state);
    await h.send([[cx, SPOT.tray[1] - 12], [cx, 44], [fx, 44], [fx, fy]], 'you', { ms: 900 });
    h.set((s) => { s.project!.files![5] = 'edit'; });
    await h.wait(300);
    h.set((s) => { s.project!.files![5] = 'ok'; });
  }
  t.you++;
  show(ctx, t);
  // Its next turn starts by reading the notes.
  const tools = ctx.scene.state.tools!, project = ctx.scene.state.project!;
  h.set((s) => { busy(s, true); s.tools!.on = 'read'; });
  await h.send(route.agentToTool(tools, 'read'), 'model', { ms: 260 });
  await h.send(reverse(route.toolToFile(tools, 'read', project, 5)), 'you', { ms: 520 });
  await h.send(reverse(route.agentToTool(tools, 'read')), 'you', { ms: 260 });
  h.set((s) => { s.tools!.on = null; s.agents[0]!.blocks!.push({ t: 'you', h: 1.4 }); });
  ctx.say('the model', 'Read the notes file: two comments. Fixing both.');
  await work(ctx, h, t, 4, false, [1, 2]);
  await done(ctx, h, false, 'Done. Both notes are fixed, and the review page shows the two screens again.');
  ctx.say(null, 'The review page stays on the tray for every job after this one. You wrote two notes where you saw the problem, and it read them without being asked.');
  finish(ctx);
}

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  ctx.say('you', ASK);
  await h.send(route.youToAgent(), 'you', { ms: 420 });
  h.set((s) => { busy(s, true); });
  await h.wait(600);
  h.set((s) => { busy(s, false); });
  await h.send(route.agentToGate(), 'model', { ms: 340 });
  h.set((s) => { s.gates![0]!.lamp = 'wait'; s.labels = [...labels().filter((l) => l.at !== 'gate'), lab('gate', 'the plan, waiting', 'right')]; });
  ctx.say('the model', 'Step 3: hide paused members from the list. Go ahead?');
  await h.wait(1800);
  ctx.say('you', 'Step 3: keep them in the list, greyed out.');
  await h.send(reverse(route.gateToYou()), 'you', { ms: 380 });
  h.set((s) => { s.gates![0]!.lamp = 'ok'; s.labels = labels(); });
  await h.send(reverse(route.agentToGate()), 'you', { ms: 320 });
  h.set((s) => { s.gates![0]!.lamp = 'off'; busy(s, true); });
  await h.wait(1400);
  h.set((s) => { busy(s, false); });
  await h.send(route.agentToGate(), 'model', { ms: 320 });
  h.set((s) => { s.gates![0]!.lamp = 'ok'; });
  await h.send(route.gateToYou(), 'model', { ms: 360 });
  ctx.say('the model', 'Done. Paused members are greyed out.');
  await h.wait(1200);
}

type Waiting = (ctx: Ctx, h: Script, d: Door) => Promise<void>;
/** Start a step that waits at a door. */
const start = (ctx: Ctx, fn: Waiting, preset?: string) => { const d = door(ctx, preset); void ctx.scene.run((h) => fn(ctx, h, d)); };
/** A button at a door: open it if the script is waiting on it, or play the step again with that answer. */
const answer = (ctx: Ctx, fn: Waiting, val: string) => {
  const d: Door | undefined = ctx.mem.door;
  if (d && d.value === undefined && !ctx.mem.finished) d.open(val);
  else start(ctx, fn, val);
};

export const turn: Chapter = {
  steps: {
    once: { scene: () => base(), enter: (ctx) => void ctx.scene.run((h) => once(ctx, h)) },
    plan: { scene: () => base(), enter: (ctx) => start(ctx, plan) },
    ask: { scene: () => base(), enter: (ctx) => start(ctx, asking) },
    pin: { scene: () => { const s = base(); s.project!.files = ['ok', 'ok', 'ok', 'ok', '', '']; return s; }, enter: (ctx) => start(ctx, pin) },
    build: { scene: () => base(), enter: (ctx) => void ctx.scene.run((h) => build(ctx, h)) },
  },
  actions: {
    plan: (ctx, val) => {
      ctx.say('you', val === 'change' ? 'Step 3: keep them in the list, greyed out.' : 'Go ahead.');
      answer(ctx, plan, val);
    },
    answer: (ctx) => {
      ctx.say('you', 'Greyed out.');
      answer(ctx, asking, 'greyed');
    },
    pin: (ctx, val) => {
      ctx.say('you', val === 'type' ? 'The badge looks off.' : 'This badge sits on top of the name.');
      answer(ctx, pin, val);
    },
  },
};
