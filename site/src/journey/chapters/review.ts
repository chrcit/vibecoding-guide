// Chapter 11: a second model. One model builds, a different one reviews, and the work goes round
// until the reviewer finds nothing. The reviewer gets the change and the brief, never the builder's
// window. The job and its three flaws are made up and fixed here; which model builds and which
// reviews is only a matter of which name the page hands over.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, team, lab } from '../presets';
import { route, reverse, SPOT, BUS_Y, type XY, type Kind, type SceneState, type Meter } from '../picture';

const names = (ctx: Ctx) => ({
  b: (ctx.data.builder as string | undefined) ?? 'the builder',
  r: (ctx.data.reviewer as string | undefined) ?? 'the reviewer',
});

// ---------- the made-up job ----------

const ASK = 'Let the treasurer mark a member as paid.';
const FLAWS = [
  'Marking a member paid twice records two payments.',
  'Any member can mark anyone as paid, not only the treasurer.',
  'The export still shows last season’s payments.',
];
const FIXED = ['Fixed: a second mark is ignored.', 'Fixed: only the treasurer can mark.', 'Fixed: the export reads this season.'];
/** Which flaws each round of a real review finds. Round three finds nothing. */
const ROUNDS = [[0, 1], [2], []];
/** What a reviewer with no rule to stop finds once the real flaws are gone. */
const TASTE = ['paidAt could be called paidOn.', 'This function could be split in two.', 'The button label could be shorter.', 'A comment here would help.'];

// ---------- the picture ----------

const M_BUILDER: XY = SPOT.meter;
const M_REVIEWER: XY = [-118, 54];
interface Look { reviewer?: boolean; meters?: boolean }
const base = (ctx: Ctx, o: Look = {}): SceneState => {
  const n = names(ctx);
  const meters: Meter[] = o.meters ? [
    { id: 'b', at: M_BUILDER, mode: 'plan', level: 1 },
    { id: 'r', at: M_REVIEWER, mode: 'plan', level: 1 },
  ] : [];
  const s = solo({
    tools: true, project: true, gate: true, reviewer: o.reviewer,
    meter: o.meters ? meters : undefined,
    labels: [
      lab('you', 'you', 'left'), lab('a0', n.b, 'top', 'wiki/model/'), lab('gate', 'check', 'right', 'wiki/verification/'),
      ...(o.reviewer ? [lab('r0', n.r, 'top', 'wiki/review/')] : []),
      ...(o.meters ? [
        // Short names, one above and one below, so the four labels on the left fit at 390 wide.
        lab([M_BUILDER[0] + 3, M_BUILDER[1] - 5, 40], ctx.data.builderLab ?? 'a plan', 'top', 'wiki/subscription-plan/'),
        lab([M_REVIEWER[0] + 13, M_REVIEWER[1] + 13, 0], ctx.data.reviewerLab ?? 'a plan', 'bottom', 'wiki/subscription-plan/'),
      ] : []),
    ],
  });
  if (o.meters) s.tracks!.push([[M_REVIEWER[0] + 14, M_REVIEWER[1]], [SPOT.reviewer[0] - 18, SPOT.reviewer[1]]]);
  // Two meters make the left of the floor crowded: frame the models, their meters, the gate and you.
  if (o.meters) s.focus = ['you', 'a0', 'r0', 'gate', 'meter:b', 'meter:r'];
  return s;
};

// ---------- the readout ----------

interface Tally { rounds: number; fixed: number; wrong: number }
const show = (ctx: Ctx, t: Tally) => ctx.stat([['rounds of review', t.rounds], ['found and fixed', t.fixed], ['wrong when it reached you', t.wrong]]);

// ---------- pieces of a run ----------

/** You ask; the builder builds in a few turns of its own. */
async function build(ctx: Ctx, h: Script, t: Tally) {
  const n = names(ctx);
  show(ctx, t);
  ctx.say('you', ASK);
  await h.send(route.youToAgent(), 'you', { ms: 420 });
  h.set((s) => { const a = s.agents[0]!; a.blocks = [{ t: 'you', h: 2.4 }]; a.lamp = 'work'; });
  const steps: [string, number, Kind, number][] = [['read', 1, 'tool', 6], ['edit', 1, 'tool', 2], ['edit', 3, 'tool', 2], ['run', -1, 'tool', 3]];
  for (const [tool, file, kind, size] of steps) {
    h.set((s) => { s.agents[0]!.busy = true; s.agents[0]!.blocks!.push({ t: 'model', h: 1.4 }); s.tools!.on = tool; if (file >= 0) { const f = (s.project!.files ??= ['', '', '', '', '', '']); f[file] = tool === 'edit' ? 'edit' : 'read'; } });
    await h.wait(380);
    h.set((s) => { s.agents[0]!.busy = false; s.tools!.on = null; s.agents[0]!.blocks!.push({ t: kind, h: size }); });
    await h.wait(160);
  }
  ctx.say(n.b, 'Built. 14 of 14 tests pass.');
  await h.wait(700);
}

/** The builder takes findings back in and fixes them. */
async function fix(ctx: Ctx, h: Script, found: number[], t: Tally, drain = 0, taste = false) {
  const n = names(ctx);
  h.set((s) => { const a = s.agents[0]!; a.busy = true; for (const _ of found) a.blocks!.push({ t: taste ? 'model' : 'bad', h: 1.6 }); if (drain) s.meters!.find((m) => m.id === 'b')!.level -= drain; });
  await h.wait(520);
  h.set((s) => { const a = s.agents[0]!; a.busy = false; a.blocks!.push({ t: 'tool', h: 2 }); s.tools!.on = null; });
  t.fixed += found.filter((i) => i < FLAWS.length).length;
  show(ctx, t);
  ctx.say(n.b, found.length === 1 ? (FIXED[found[0]!] ?? 'Changed it.') : found.map((i) => FIXED[i]).join(' '));
  await h.wait(800);
}

/** Send the change across to the reviewer: its window starts empty and gets the brief and the change. */
async function sendAcross(ctx: Ctx, h: Script, extra: Kind[] = []) {
  h.set((s) => { s.gates![0]!.lamp = 'work'; s.agents[0]!.lamp = 'off'; const r = s.agents.find((a) => a.id === 'r0')!; r.blocks = []; r.lamp = 'off'; });
  await h.send(route.agentToGate(), 'model', { ms: 340 });
  await h.send(route.gateToReviewer(), 'you', { ms: 320 });
  h.set((s) => { s.agents.find((a) => a.id === 'r0')!.blocks!.push({ t: 'you', h: 2.4 }); });
  await h.send(route.gateToReviewer(), 'model', { ms: 320 });
  h.set((s) => { const r = s.agents.find((a) => a.id === 'r0')!; r.blocks!.push({ t: 'model', h: 6 }); for (const k of extra) r.blocks!.push({ t: k, h: 4 }); });
}

/** The reviewer reads what it was sent and says what it found. Returns the findings. */
async function look(ctx: Ctx, h: Script, found: number[] | string[], drain = 0) {
  const n = names(ctx);
  h.set((s) => { const r = s.agents.find((a) => a.id === 'r0')!; r.busy = true; r.scan = true; r.lamp = 'work'; if (drain) s.meters!.find((m) => m.id === 'r')!.level -= drain; });
  await h.wait(1000);
  h.set((s) => { const r = s.agents.find((a) => a.id === 'r0')!; r.busy = false; r.scan = false; const real = found.length > 0 && typeof found[0] === 'number'; r.lamp = real ? 'bad' : found.length ? 'off' : 'ok'; r.blocks!.push({ t: real ? 'bad' : 'model', h: 1.6 }); });
  const lines = found.map((f) => (typeof f === 'number' ? FLAWS[f] : f));
  const real = typeof found[0] === 'number';
  ctx.say(n.r, !found.length ? 'Nothing found.' : !real ? lines.join(' ') : (found.length === 1 ? 'One problem. ' : `${found.length} problems. `) + lines.join(' '));
}

/** Findings travel back to the builder, the way the reader picked. A matter of taste travels pale. */
async function back(ctx: Ctx, h: Script, count: number, by: 'gate' | 'you', taste = false) {
  const kind: Kind = taste ? 'model' : 'bad';
  h.set((s) => { s.gates![0]!.lamp = taste ? 'work' : 'bad'; });
  for (let i = 0; i < Math.max(1, count); i++) {
    if (by === 'gate') {
      await h.send(reverse(route.gateToReviewer()), kind, { ms: 300 });
      await h.send(reverse(route.agentToGate()), kind, { ms: 300 });
    } else {
      await h.send([[SPOT.reviewer[0], SPOT.reviewer[1] + 14], [SPOT.reviewer[0], SPOT.you[1]], [-12, SPOT.you[1]]], kind, { ms: 520 });
    }
  }
  if (by === 'you') {
    ctx.say('you', 'Pasting the findings into the other thread.');
    await h.wait(700);
    await h.send(route.youToAgent(), kind, { ms: 420 });
  }
}

/** Through the gate to you. */
async function arrive(ctx: Ctx, h: Script, wrong: number, t: Tally) {
  h.set((s) => { s.gates![0]!.lamp = wrong ? 'off' : 'ok'; s.agents[0]!.lamp = 'off'; });
  await h.send(route.gateToYou(), wrong ? 'bad' : 'model', { ms: 380 });
  t.wrong = wrong;
  show(ctx, t);
}

// ---------- steps ----------

async function selfCheck(ctx: Ctx, h: Script) {
  const n = names(ctx);
  h.set((s) => { Object.assign(s, base(ctx)); });
  const t: Tally = { rounds: 0, fixed: 0, wrong: 0 };
  await build(ctx, h, t);
  ctx.say('you', 'Check your own work.');
  await h.wait(600);
  h.set((s) => { const a = s.agents[0]!; a.busy = true; a.scan = true; a.lamp = 'work'; });
  ctx.say(n.b, 'Reading what I wrote.');
  await h.wait(1600);
  h.set((s) => { const a = s.agents[0]!; a.scan = false; a.busy = false; });
  t.rounds = 1;
  ctx.say(n.b, 'One problem. ' + FLAWS[0]);
  await h.wait(900);
  await fix(ctx, h, [0], t);
  ctx.say(n.b, 'The rest looks right.');
  await h.send(route.agentToGate(), 'bad', { ms: 340 });
  await arrive(ctx, h, 2, t);
  ctx.say(null, `It found 1 of the 3 flaws. The other 2 reached you as “done”.`);
}

interface RoundOpts { polite?: boolean; rule?: boolean; meters?: boolean; by?: 'gate' | 'you'; handoff?: boolean }
async function rounds(ctx: Ctx, h: Script, o: RoundOpts = {}) {
  const n = names(ctx);
  h.set((s) => { Object.assign(s, base(ctx, { reviewer: true, meters: o.meters })); });
  const t: Tally = { rounds: 0, fixed: 0, wrong: 0 };
  if (o.meters) h.set((s) => { s.meters!.find((m) => m.id === 'b')!.level -= 0.12; });
  await build(ctx, h, t);
  const plan: (number[] | string[])[] = o.polite ? [['Looks good. One small thing: markPaid could be called setPaid.']] : o.rule === false ? [...ROUNDS.slice(0, 2), ...TASTE.map((x) => ['One more thing: ' + x])] : ROUNDS;
  let taste = 0;
  for (const found of plan) {
    const isTaste = typeof found[0] === 'string';
    // Once only taste is left, the rounds run faster: the point is that they do not stop.
    if (isTaste && !o.polite) ctx.scene.speed = 1.7;
    await sendAcross(ctx, h, o.handoff ? ['model', 'tool', 'model'] : []);
    t.rounds++;
    show(ctx, t);
    await look(ctx, h, found, o.meters ? 0.07 : 0);
    await h.wait(700);
    if (o.polite || !found.length) break;
    if (isTaste) taste++;
    await back(ctx, h, found.length, o.by ?? 'gate', isTaste);
    await fix(ctx, h, isTaste ? [99] : (found as number[]), t, o.meters ? 0.06 : 0, isTaste);
  }
  ctx.scene.speed = 1;
  const wrong = FLAWS.length - t.fixed;
  if (o.rule === false) {
    h.set((s) => { s.gates![0]!.lamp = 'bad'; });
    const left = (id: string) => Math.round((1 - ctx.scene.state.meters!.find((m) => m.id === id)!.level) * 100);
    ctx.say(null, `${t.rounds} rounds and it is still finding things: the last ${taste} were matters of taste. ${n.b} used ${left('b')}% of its plan, ${n.r} ${left('r')}%.`);
    return t;
  }
  await arrive(ctx, h, wrong, t);
  if (o.polite) ctx.say(null, `“Looks good.” All ${wrong} flaws reached you.`);
  else if (o.meters) {
    const left = (id: string) => Math.round((1 - ctx.scene.state.meters!.find((m) => m.id === id)!.level) * 100);
    ctx.say(null, `${t.rounds} rounds, then it stopped. ${n.b} used ${left('b')}% of its plan, ${n.r} ${left('r')}%.`);
  } else ctx.say(null, `${t.rounds} rounds. All ${FLAWS.length} flaws were found and fixed before the work reached you.`);
  return t;
}

// ----- how: the lead from chapter 8 runs the rounds -----

const ledScene = (ctx: Ctx): SceneState => {
  const n = names(ctx);
  const s = team(2, { gate: true, lead: [{ t: 'rules', h: 4 }], labels: [lab('you', 'you', 'left'), lab('a0', 'the lead', 'top', 'wiki/orchestration/'), lab('w0', n.b, 'top', 'wiki/model/'), lab('w1', n.r, 'top', 'wiki/review/'), lab('gate', 'check', 'right', 'wiki/verification/')] });
  s.agents[2]!.model = 'b';
  s.agents[0]!.scale = 0.9;
  return s;
};
const between = (a: XY, b: XY): XY[] => [[a[0], a[1] + 14], [a[0], BUS_Y], [b[0], BUS_Y], [b[0], b[1] + 14]];
async function led(ctx: Ctx, h: Script) {
  const n = names(ctx);
  h.set((s) => { Object.assign(s, ledScene(ctx)); });
  const t: Tally = { rounds: 0, fixed: 0, wrong: 0 };
  const at = (id: string) => ctx.scene.agent(id).at;
  const agent = (s: SceneState, id: string) => s.agents.find((a) => a.id === id)!;
  show(ctx, t);
  ctx.say('you', ASK + ' Have it reviewed until nothing is found.');
  await h.send(route.youToAgent(), 'you', { ms: 420 });
  h.set((s) => { agent(s, 'a0').blocks!.push({ t: 'you', h: 2.4 }); });
  await h.send(route.agentToWorker(at('w0')), 'model');
  h.set((s) => { const w = agent(s, 'w0'); w.blocks = [{ t: 'model', h: 3 }]; w.busy = true; w.lamp = 'work'; });
  for (let k = 0; k < 4; k++) { await h.wait(300); h.set((s) => { agent(s, 'w0').blocks!.push({ t: k % 2 ? 'model' : 'tool', h: 4 }); }); }
  h.set((s) => { agent(s, 'w0').busy = false; });
  ctx.say(n.b, 'Built. 14 of 14 tests pass.');
  for (const found of ROUNDS) {
    t.rounds++;
    show(ctx, t);
    h.set((s) => { const r = agent(s, 'w1'); r.blocks = []; r.lamp = 'off'; });
    await Promise.all([h.send(route.agentToWorker(at('w1')), 'you', { ms: 520 }), h.send(between(at('w0'), at('w1')), 'model', { ms: 520 })]);
    h.set((s) => { const r = agent(s, 'w1'); r.blocks = [{ t: 'you', h: 2.4 }, { t: 'model', h: 6 }]; r.busy = true; r.scan = true; r.lamp = 'work'; });
    await h.wait(900);
    h.set((s) => { const r = agent(s, 'w1'); r.busy = false; r.scan = false; r.lamp = found.length ? 'bad' : 'ok'; });
    ctx.say(n.r, found.length ? found.map((i) => FLAWS[i]).join(' ') : 'Nothing found.');
    await h.wait(700);
    if (!found.length) break;
    await h.send(between(at('w1'), at('w0')), 'bad', { ms: 520 });
    h.set((s) => { const w = agent(s, 'w0'); w.blocks!.push({ t: 'bad', h: 1.6 }); w.busy = true; });
    await h.wait(500);
    h.set((s) => { const w = agent(s, 'w0'); w.blocks!.push({ t: 'tool', h: 2 }); w.busy = false; });
    t.fixed += found.length;
    show(ctx, t);
    ctx.say(n.b, found.map((i) => FIXED[i]).join(' '));
    await h.wait(600);
  }
  await h.send(reverse(route.agentToWorker(at('w1'))), 'tool', { ms: 520 });
  h.set((s) => { agent(s, 'a0').blocks!.push({ t: 'tool', h: 1.6 }); s.gates![0]!.lamp = 'ok'; });
  ctx.say('the lead', `${t.rounds} rounds, ${t.fixed} fixed, nothing left. Passing it on.`);
  await h.send(route.agentToGate(), 'model', { ms: 340 });
  await arrive(ctx, h, 0, t);
  ctx.say(null, `The lead ran ${t.rounds} rounds and sent you one short report.`);
}

type How = 'hand' | 'handoff' | 'lead';
function playHow(ctx: Ctx, how: How) {
  const n = names(ctx);
  void ctx.scene.run(async (h) => {
    // Say how the two are joined, and show the arrangement, before the run starts.
    h.set((s) => { Object.assign(s, how === 'lead' ? ledScene(ctx) : base(ctx, { reviewer: true })); });
    ctx.say(null, HOW_SAY[how]);
    await h.wait(1800);
    if (how === 'lead') { await led(ctx, h); return; }
    const t = await rounds(ctx, h, { by: how === 'hand' ? 'you' : 'gate', handoff: how === 'handoff' });
    const cap = ctx.data.handoffCap as number | undefined;
    if (how === 'hand') ctx.say(null, `${t.rounds} rounds. You carried the findings across ${t.rounds - 1} times.`);
    else ctx.say(null, `${t.rounds} rounds in one thread. ${n.r} saw a selection of ${n.b}’s thread${cap ? `, up to ${cap.toLocaleString('en-GB')} tokens by default` : ''}, as well as the change.`);
  });
}
const HOW_SAY: Record<How, string> = {
  hand: 'Two threads, one per model. You carry what the reviewer finds back to the builder.',
  handoff: 'One thread. It is handed to the other model to review, then handed back.',
  lead: 'The lead from chapter 8 sends the work across and the findings back, and stops when nothing is found.',
};

const play = (ctx: Ctx, o: RoundOpts) => void ctx.scene.run((h) => rounds(ctx, h, o).then(() => undefined));

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base(ctx, { reviewer: true })); });
  const t: Tally = { rounds: 0, fixed: 0, wrong: 0 };
  ctx.say('you', ASK);
  h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 2.4 }, { t: 'tool', h: 6 }, { t: 'model', h: 3 }]; });
  for (const found of ROUNDS.slice(0, 2)) {
    await sendAcross(ctx, h);
    t.rounds++;
    await look(ctx, h, found);
    await back(ctx, h, 1, 'gate');
    await fix(ctx, h, found, t);
  }
  await sendAcross(ctx, h);
  await look(ctx, h, []);
  await arrive(ctx, h, 0, t);
}

export const review: Chapter = {
  steps: {
    self: { scene: (ctx) => base(ctx), enter: (ctx) => void ctx.scene.run((h) => selfCheck(ctx, h)) },
    second: { scene: (ctx) => base(ctx, { reviewer: true }), enter: (ctx) => play(ctx, {}) },
    attack: { scene: (ctx) => base(ctx, { reviewer: true }), enter: (ctx) => play(ctx, { polite: true }) },
    rounds: { scene: (ctx) => base(ctx, { reviewer: true, meters: true }), enter: (ctx) => play(ctx, { meters: true, rule: false }) },
    how: { scene: (ctx) => base(ctx, { reviewer: true }), enter: (ctx) => { ctx.say(null, HOW_SAY.hand); playHow(ctx, 'hand'); } },
  },
  actions: {
    brief: (ctx, val) => {
      ctx.say('you', val === 'polite' ? 'Review this.' : 'Find what is wrong. Try to break it.');
      ctx.mem.polite = val === 'polite';
      void ctx.scene.run(async (h) => { await h.wait(1200); await rounds(ctx, h, { polite: val === 'polite' }); });
    },
    rule: (ctx, val) => {
      ctx.say('you', val === 'none' ? 'Review it until you are happy.' : 'Only what breaks. Three rounds at most.');
      void ctx.scene.run(async (h) => { await h.wait(1200); await rounds(ctx, h, { meters: true, rule: val !== 'none' }); });
    },
    how: (ctx, val) => { ctx.say(null, HOW_SAY[val as How]); playHow(ctx, val as How); },
  },
};
