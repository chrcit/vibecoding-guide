// Lesson 16: proof you can read. The check catches what a machine can check (a type error, a failing
// test), as in "Make it prove it". What is left is whether the work is what you asked for, and only
// you can judge that. The cards on the tray beside you are how you judge it at a glance. The jobs,
// the line counts and which jobs are wrong are made up and fixed.
import { byLevel, type Chapter, type Ctx, type Level } from '../chapter';
import { STEP_NOTES } from '../notes';
import { termLabel } from '../terms';
import type { Script } from '../scene';
import { solo, lab } from '../presets';
import { route, reverse, SPOT, type Card, type Kind, type Label, type SceneState } from '../picture';

type CardId = 'sum' | 'tests' | 'shot' | 'link';
interface Kindof { word: string; b: Kind; q: string; says: Record<Level, string>; side?: string }
const CARDS: Record<CardId, Kindof> = {
  sum: { word: 'summary', b: 'model', q: 'What changed, and what was left out?', side: 'wiki/definition-of-done/', says: {
    plain: 'Members can pay their fee online from the list. Not done: refunds.',
    technical: 'Added a Pay button, a payments table and a /pay route; 212 lines in 5 files. Not done: refunds.',
    engineer: 'New payments table with a unique (member, season) key, /pay route behind the session check; 212 lines in 5 files. Not done: refunds, webhook retries.',
  } },
  tests: { word: 'test run', b: 'tool', q: 'What was checked, and what was not?', side: 'wiki/test/', says: {
    plain: '31 checks ran, 31 passed. Paying twice was tested; a failed card was not.',
    technical: 'npm test: 31 passed, 0 failed. tsc --noEmit: clean. Not covered: a declined card.',
    engineer: 'tsc --noEmit clean; vitest 31/31, including a double-payment test. Not covered: a declined card, concurrent requests.',
  } },
  shot: { word: 'screenshot', b: 'tool', q: 'What does it look like?', side: 'wiki/browser-check/', says: {
    plain: 'The list with a Pay button beside each unpaid member, at phone width.',
    technical: 'The member list at 390 px: a Pay button on each unpaid row.',
    engineer: 'The member list at 390 px and 1440 px, taken by a headless browser after the build.',
  } },
  link: { word: 'link', b: 'tool', q: 'Does it work when you use it?', side: 'wiki/preview-deployment/', says: {
    plain: 'A link to a copy of the site with test payments. Try paying.',
    technical: 'A preview link to this branch, with the payment provider in test mode.',
    engineer: 'A preview deploy of this branch against a test payment account; the same link goes in the pull request.',
  } },
};
/** What each card says as a bubble on the picture: one line, per level. The step text and the
 *  narration line carry the longer versions. */
const SHORT: Record<CardId, Record<Level, string>> = {
  sum: { plain: 'Pay online works. Not done: refunds.', technical: 'Pay button, /pay route. No refunds.', engineer: 'payments table, /pay. No refunds yet.' },
  tests: { plain: '31 of 31 pass. Declined card untested.', technical: 'npm test 31/31, tsc clean.', engineer: 'vitest 31/31. No declined-card test.' },
  shot: { plain: 'The list at phone width, Pay buttons.', technical: 'List at 390 px: Pay on unpaid rows.', engineer: 'List at 390 and 1440 px, headless.' },
  link: { plain: 'Try it: a copy with test payments.', technical: 'Preview link, payments in test mode.', engineer: 'Preview deploy, test payment account.' },
};
const note = (ctx: Ctx, step: string) => { const n = STEP_NOTES.proof?.[step]; if (n) ctx.model(n.part, n.text[ctx.level]); };
const ORDER: CardId[] = ['sum', 'tests', 'shot', 'link'];
const toTray = () => route.agentToTray({ at: SPOT.tray, cards: [] });
const GAP = 18;

/** A card label: one or two words, above every other card and below the tray for the rest, so neighbours do not touch. */
const cardLabel = (s: SceneState, id: string, text: string, side?: string): Label => {
  const i = s.tray!.cards.findIndex((c) => c.id === id);
  const n = s.tray!.cards.length;
  const x = s.tray!.at[0] + (i - (n - 1) / 2) * (s.tray!.gap ?? 9);
  return i % 2 ? lab([x, s.tray!.at[1], 16], text, 'top', side) : lab([x, s.tray!.at[1] + 11, 0], text, 'bottom', side);
};

const BASE_LABELS = (): Label[] => [lab('you', 'you', 'left'), termLabel('a0', 'model', 'top', 'the model'), termLabel('gate', 'check', 'top')];
const base = (): SceneState => {
  // The tray is what this chapter is about. The project is left out so the camera can come close
  // enough for every card to carry its name.
  const s = solo({ tools: true, project: false, gate: true, tray: [], labels: BASE_LABELS() });
  s.tray!.gap = GAP;
  // The tray is in the front corner, and its card labels and the cards' bubbles hang below it: a
  // point under the tray keeps room for them inside the picture.
  s.focus = ['you', 'a0', 'tools', 'gate', 'tray', [SPOT.tray[0], SPOT.tray[1] + 10, -45]];
  return s;
};
/** Relabel the tray: its cards by name, or the empty tray. */
function relabel(s: SceneState, names: Record<string, [string, string?]> = {}) {
  const cards = s.tray!.cards;
  s.labels = [...BASE_LABELS(), ...(cards.length ? cards.map((c) => cardLabel(s, c.id, names[c.id]?.[0] ?? CARDS[c.id as CardId]?.word ?? c.id, names[c.id]?.[1] ?? CARDS[c.id as CardId]?.side)) : [termLabel('tray', 'tray', 'bottom', 'the tray')])];
}

// One readout for the whole lesson, the same five names on every step; counts only go up in a run.
interface Tally { done: number; came: string; check: number; seen: number; missed: number | string }
const tally = (came = 'nothing yet'): Tally => ({ done: 0, came, check: 0, seen: 0, missed: 0 });
const show = (ctx: Ctx, t: Tally) => ctx.stat([
  ['said “done”', t.done],
  ['came with it', t.came],
  ['caught by the check', t.check],
  ['not what you asked: seen on a card', t.seen],
  ['not what you asked: reached you as “done”', t.missed],
]);

const work = (s: SceneState, on: boolean) => { const a = s.agents[0]!; a.busy = on; a.lamp = on ? 'work' : 'off'; };

/** You ask, the agent works through some turns on its tools and files. */
async function build(ctx: Ctx, h: Script, ask: string, turns: number, fast = false) {
  ctx.say('you', ask);
  await h.send(route.youToAgent(), 'you', { ms: fast ? 300 : 460 });
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 1.6 }); work(s, true); });
  const tools = ['read', 'edit', 'run', 'edit', 'search', 'edit', 'run', 'read'];
  for (let i = 0; i < turns; i++) {
    const tool = tools[i % tools.length]!;
    if (fast) { await h.wait(160); } else {
      h.set((s) => { s.tools!.on = tool; });
      await h.send(route.agentToTool(ctx.scene.state.tools!, tool), 'model', { ms: 260 });
    }
    h.set((s) => {
      s.tools!.on = null;
      s.agents[0]!.blocks!.push({ t: i % 2 ? 'model' : 'tool', h: i % 2 ? 1 : 1.8 });
      if (tool === 'edit' && s.project) { const f = s.project.files ??= ['', '', '', '', '', '']; f[(i * 2) % 6] = 'edit'; }
    });
  }
  h.set((s) => { work(s, false); s.agents[0]!.lamp = 'off'; });
}
/** Through the check, which is green every time here. */
async function pass(h: Script, fast = false) {
  await h.send(route.agentToGate(), 'model', { ms: fast ? 240 : 360 });
  h.set((s) => { s.gates![0]!.lamp = 'ok'; });
  await h.wait(fast ? 120 : 260);
}
/** A card lands on the tray, sent from the agent. */
async function land(h: Script, card: Card, names?: Record<string, [string, string?]>, ms = 380) {
  await h.send(toTray(), card.b ?? 'model', { ms });
  h.set((s) => { s.tray!.cards = s.tray!.cards.filter((c) => c.id !== card.id).concat({ ...card, mark: 'new' }); relabel(s, names); });
}
const settle = (h: Script) => h.set((s) => { for (const c of s.tray!.cards) if (c.mark === 'new') c.mark = undefined; });
const clear = (h: Script) => h.set((s) => { s.tray!.cards = []; relabel(s); s.gates![0]!.lamp = 'off';  s.agents[0]!.blocks = []; });

// ----- word: one pale puck, nothing to look at -----
async function word(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  const t = tally();
  show(ctx, t);
  await build(ctx, h, 'Let members pay their fee online.', 8);
  ctx.say('check', byLevel(ctx.level, { plain: 'The tests pass.', technical: 'tsc --noEmit clean; npm test 31 of 31.', engineer: 'tsc clean; vitest 31/31; lint clean.' }));
  await pass(h);
  await h.send(route.gateToYou(), 'model', { ms: 420 });
  ctx.say('the model', 'Done.');
  h.set((s) => { s.labels = [...BASE_LABELS(), termLabel('tray', 'tray', 'bottom', 'the tray: empty')]; });
  Object.assign(t, { done: 1, came: 'one word', missed: 'you can’t tell' });
  show(ctx, t);
  await h.wait(1300);
  ctx.say(null, 'One word for 212 changed lines of code in 5 files. The check says the tests pass; whether it is what you asked for, you would only know by reading all 212.');
}

// ----- cards: the same job, with proof -----
async function cards(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  const t = tally();
  show(ctx, t);
  await build(ctx, h, 'Let members pay online, with proof.', 8);
  await pass(h);
  for (const id of ORDER) {
    // The card speaks once it stands on the tray, so the bubble points at it; its full text is
    // the narration line.
    await land(h, { id, b: CARDS[id].b });
    ctx.say(CARDS[id].word, SHORT[id][ctx.level]);
    ctx.say(null, `${CARDS[id].q} ${CARDS[id].says[ctx.level]}`);
    t.came = `${ORDER.indexOf(id) + 1} card${id === 'sum' ? '' : 's'}`;
    show(ctx, t);
    await h.wait(1100);
    settle(h);
  }
  await h.send(route.gateToYou(), 'model', { ms: 420 });
  t.done = 1;
  show(ctx, t);
  // The last word is the model's, so the bubble leaves the tray and the cards' names show.
  ctx.say('the model', 'Done, with four cards.');
  ctx.say(null, 'Four cards on the tray: what changed, what was tested, what it looks like, and a link to try it. The 212 lines are still there if a card makes you want to read them.');
}

// ----- catch: six jobs, all green at the check -----
/** says: what the card shows. late: what you find out later when the card was switched off. */
interface Job { ask: string; wrong?: CardId; says?: string; late?: string; check?: string }
const JOBS: Job[] = [
  { ask: 'Sort the list by surname.' },
  { ask: 'Show who has not paid.', wrong: 'tests', says: 'Its test lists who has paid. Passes.', late: 'It lists who has paid!' },
  { ask: 'Email the unpaid a reminder.', wrong: 'sum', says: 'The reminder goes to every member.', late: 'Everyone got a reminder!' },
  { ask: 'Add a phone column.', check: 'members.ts: phone may be undefined.' },
  { ask: 'Put the club badge on the list.', wrong: 'shot', says: 'Badge is on the login page, not here.', late: 'The badge is on login!' },
  { ask: 'Let members change their email.', wrong: 'link', says: 'As a member: “Not allowed”.', late: 'Members can’t save it!' },
];
async function catching(ctx: Ctx, h: Script, on: CardId[]) {
  h.set((s) => { Object.assign(s, base()); });
  const t = tally(on.length ? `${on.length} card${on.length > 1 ? 's' : ''}` : 'one word');
  show(ctx, t);
  for (const job of JOBS) {
    await build(ctx, h, job.ask, 3, true);
    if (job.check) {
      // What a machine can check, the check catches: the lamp goes red and the work goes back.
      await h.send(route.agentToGate(), 'model', { ms: 240 });
      h.set((s) => { s.gates![0]!.lamp = 'bad'; });
      ctx.say('check', job.check);
      t.check++;
      show(ctx, t);
      await h.wait(1300);
      await h.send(reverse(route.agentToGate()), 'bad', { ms: 260 });
      h.set((s) => { s.gates![0]!.lamp = 'off'; work(s, true); s.agents[0]!.blocks!.push({ t: 'bad', h: 1 }); });
      await h.wait(420);
      h.set((s) => { work(s, false); });
    }
    await pass(h, true);
    if (on.length) {
      await h.send(toTray(), 'tool', { ms: 280 });
      h.set((s) => { s.tray!.cards = ORDER.filter((id) => on.includes(id)).map((id) => ({ id, b: CARDS[id].b })); relabel(s); });
    }
    const flaw = job.wrong;
    if (flaw && on.includes(flaw)) {
      h.set((s) => { const c = s.tray!.cards.find((x) => x.id === flaw)!; c.b = 'bad'; c.mark = 'bad'; });
      ctx.say(CARDS[flaw].word, job.says!);
      t.seen++;
      show(ctx, t);
      await h.wait(1500);
      // You send it back from the tray with what you saw.
      await h.send(reverse(toTray()), 'you', { ms: 340 });
      h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 1.2 }); work(s, true); s.gates![0]!.lamp = 'off'; });
      await h.wait(420);
      h.set((s) => { work(s, false); });
      await pass(h, true);
    } else if (on.length) {
      await h.wait(650);
    }
    await h.send(route.gateToYou(), flaw && !on.includes(flaw) ? 'bad' : 'model', { ms: 320 });
    t.done++;
    const miss = !!flaw && !on.includes(flaw);
    ctx.say('the model', 'Done.');
    if (miss) t.missed = (t.missed as number) + 1;
    show(ctx, t);
    if (miss) {
      // It reached you as "done"; what was wrong turns up later, in your hands.
      await h.wait(700);
      ctx.say('you', `Later: ${job.late}`);
    }
    await h.wait(miss ? 1400 : 500);
    clear(h);
  }
  const missed = t.missed as number;
  ctx.say(null, missed
    ? `The check caught the type error. ${missed === 1 ? 'One job' : `${missed} jobs`} that passed it ${missed === 1 ? 'was' : 'were'} still not what you asked for and reached you as “done”.`
    : `The check caught the type error, which a machine can see. The ${t.seen} jobs that were not what you asked for passed it, and each showed on a card before it reached you.`);
}

// ----- during: a long job, with or without a progress file -----
const STEPS = ['Read the member list', 'Add a photo column', 'Resize uploads', 'Change the login', 'Add the upload button', 'Show photos on the list', 'Write the tests', 'Run the tests', 'Fix one failing test', 'Write the summary'];
async function during(ctx: Ctx, h: Script, progress: boolean) {
  h.set((s) => { Object.assign(s, base()); if (progress) { s.tray!.cards = [{ id: 'progress', fill: 0 }]; relabel(s, { progress: ['progress'] }); } });
  const t = tally(progress ? 'a progress file' : 'nothing until the end');
  show(ctx, t);
  ctx.say('you', 'Add member photos to the list.');
  await h.send(route.youToAgent(), 'you', { ms: 420 });
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 1.6 }); work(s, true); });
  for (let i = 0; i < STEPS.length; i++) {
    await h.wait(progress ? 520 : 560);
    h.set((s) => {
      s.agents[0]!.blocks!.push({ t: i % 2 ? 'model' : 'tool', h: 1.6 });
      if (progress) { const c = s.tray!.cards[0]!; c.fill = (i + 1) / STEPS.length; if (i === 3) { c.b = 'bad'; c.mark = 'bad'; } }
    });
    if (progress) {
      // One line per step on the card; the step you never asked for turns it red, said once.
      ctx.say('progress', `${i + 1} of ${STEPS.length}: ${STEPS[i]}${i === 3 ? '?!' : '.'}`);
      if (i === 3) {
        t.seen = 1; show(ctx, t);
        ctx.say(null, 'Step 4 changes the login so photos load faster. You never asked for that, and you see it while it works.');
        await h.wait(1800);
      }
    } else {
      ctx.say(null, `The model is working. Turn ${i + 1}.`);
    }
  }
  h.set((s) => { work(s, false); });
  await pass(h);
  await h.send(route.gateToYou(), progress ? 'model' : 'bad', { ms: 420 });
  t.done = 1;
  if (!progress) t.missed = 1;
  show(ctx, t);
  ctx.say(null, progress
    ? 'You saw the wrong turn at the 4th of its 10 steps, while it was still working, and did not have to stop it to look.'
    : 'Ten steps with nothing to look at, then “Done.” The login change it made at the 4th step came with it.');
}

// ----- ask: the kind of work decides the cards -----
type Work = 'page' | 'script' | 'fix';
const ASKS: Record<Work, { ask: string; cards: { id: string; b: Kind; word: string; q: string; mark?: Card['mark'] }[] }> = {
  page: { ask: 'Add a page for match days.', cards: [
    { id: 'sum', b: 'model', word: 'summary', q: 'What did it change?' },
    { id: 'phone', b: 'tool', word: 'phone', q: 'At phone width: does it fit?' },
    { id: 'desk', b: 'tool', word: 'desktop', q: 'At desktop width: does it look right?' },
    { id: 'link', b: 'tool', word: 'link', q: 'A link to try it yourself.' },
  ] },
  script: { ask: 'Tidy the exported contacts.', cards: [
    { id: 'sum', b: 'model', word: 'summary', q: 'What did it change?' },
    { id: 'before', b: 'tool', word: 'before', q: 'Duplicates, 3 date formats, spaces.' },
    { id: 'after', b: 'tool', word: 'after', q: 'The same five rows, tidied.' },
    { id: 'count', b: 'tool', word: 'counts', q: '1,240 in, 1,187 out: 53 merged.' },
  ] },
  fix: { ask: 'Fix the opening hours on holidays.', cards: [
    { id: 'sum', b: 'model', word: 'summary', q: 'What was wrong, and what changed.' },
    { id: 'test', b: 'bad', word: 'failing test', q: 'It shows the bug: fails before the fix.', mark: 'bad' },
    { id: 'shot', b: 'tool', word: 'screenshot', q: 'The holiday page after the fix.' },
  ] },
};
async function asking(ctx: Ctx, h: Script, kind: Work) {
  h.set((s) => { Object.assign(s, base()); });
  const job = ASKS[kind];
  const t = tally();
  show(ctx, t);
  const names: Record<string, [string, string?]> = {};
  for (const c of job.cards) names[c.id] = [c.word];
  await build(ctx, h, job.ask, 6, true);
  for (const [i, c] of job.cards.entries()) {
    await land(h, { id: c.id, b: c.b }, names, 340);
    ctx.say(c.word, c.q);
    if (c.mark) h.set((s) => { s.tray!.cards.find((x) => x.id === c.id)!.mark = c.mark; });
    t.came = `${i + 1} card${i ? 's' : ''}`;
    show(ctx, t);
    await h.wait(1000);
    settle(h);
    if (c.id === 'test') {
      h.set((s) => { work(s, true); });
      await h.wait(700);
      names.test = ['now passing', 'wiki/test/'];
      h.set((s) => { work(s, false); const card = s.tray!.cards.find((x) => x.id === 'test')!; card.b = 'tool'; card.mark = 'ok'; relabel(s, names); });
      ctx.say('now passing', 'Same test after the fix: it passes.');
      await h.wait(1100);
    }
  }
  await pass(h, true);
  await h.send(route.gateToYou(), 'model', { ms: 380 });
  t.done = 1;
  show(ctx, t);
  ctx.say('the model', `Done, with ${job.cards.length} cards.`);
  ctx.say(null, kind === 'page' ? 'A page comes back as a summary, two screenshots and a link.' : kind === 'script' ? 'A script comes back as a summary, rows before and after, and the counts.' : 'A fix comes back as a summary, the test that failed and now passes, and a screenshot.');
}

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  ctx.say('you', 'Let members pay online, with proof.');
  await h.send(route.youToAgent(), 'you', { ms: 420 });
  h.set((s) => { work(s, true); });
  await h.wait(900);
  h.set((s) => { work(s, false); });
  await pass(h);
  for (const id of ORDER) {
    await land(h, { id, b: CARDS[id].b }, undefined, 320);
    ctx.say(CARDS[id].word, CARDS[id].q);
    await h.wait(650);
    settle(h);
  }
  await h.send(route.gateToYou(), 'model', { ms: 380 });
  ctx.say('the model', 'Done, with four cards to look at.');
  await h.wait(1500);
}

const run = (ctx: Ctx, fn: (h: Script) => Promise<void>) => void ctx.scene.run(fn);
const playCatch = (ctx: Ctx) => run(ctx, (h) => catching(ctx, h, ctx.mem.on ?? ORDER));

/** The chip on the steps where a card can catch a miss: seen on a card, against reached you. */
const seenMissed = (p: [string, string | number, string?][]) => (p.length ? `on a card ${p[3]![1]} · missed ${p[4]![1]}` : null);

export const proof: Chapter = {
  // The chip: what came with the work (one word, 4 cards…).
  counter: (p) => (p.length ? `with it: ${p[1]![1]}` : null),
  steps: {
    word: { scene: () => base(), enter: (ctx) => { note(ctx, 'word'); run(ctx, (h) => word(ctx, h)); } },
    cards: { scene: () => base(), enter: (ctx) => { note(ctx, 'cards'); run(ctx, (h) => cards(ctx, h)); } },
    catch: { counter: seenMissed, scene: () => base(), enter: (ctx) => { note(ctx, 'catch'); ctx.mem.on = [...ORDER]; ctx.scene.speed = 1.5; playCatch(ctx); } },
    during: { counter: seenMissed, scene: () => base(), enter: (ctx) => { note(ctx, 'during'); run(ctx, (h) => during(ctx, h, true)); } },
    ask: { scene: () => base(), enter: (ctx) => { note(ctx, 'ask'); run(ctx, (h) => asking(ctx, h, 'page')); } },
  },
  actions: {
    toggle: (ctx, val, el) => {
      const set = new Set<CardId>(ctx.mem.on ?? ORDER);
      const id = val as CardId;
      if (set.has(id)) set.delete(id); else set.add(id);
      ctx.mem.on = ORDER.filter((x) => set.has(x));
      el.setAttribute('aria-pressed', String(set.has(id)));
      ctx.say(null, set.has(id) ? `With the ${CARDS[id].word}. Six jobs again.` : `Without the ${CARDS[id].word}. Six jobs again.`);
      ctx.scene.speed = 1.8;
      playCatch(ctx);
    },
    progress: (ctx, val) => {
      ctx.say(null, val === 'on' ? 'With a progress file: a card on the tray fills as it works.' : 'Nothing until the end.');
      run(ctx, (h) => during(ctx, h, val === 'on'));
    },
    kind: (ctx, val) => {
      ctx.say('you', ASKS[val as Work].ask);
      run(ctx, (h) => asking(ctx, h, val as Work));
    },
  },
};
