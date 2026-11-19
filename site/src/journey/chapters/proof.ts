// Chapter 12: proof you can read. The check is green every time in this chapter: it has caught
// what a machine can catch (chapter 5). What is left is whether the work is what you asked for,
// and only you can judge that. The cards on the tray beside you are how you judge it at a glance.
// The jobs, the line counts and which jobs are wrong are made up and fixed.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';
import { route, reverse, SPOT, type Card, type Kind, type Label, type SceneState } from '../picture';

type CardId = 'sum' | 'tests' | 'shot' | 'link';
interface Kindof { word: string; b: Kind; q: string; side?: string }
const CARDS: Record<CardId, Kindof> = {
  sum: { word: 'summary', b: 'model', q: 'What did it change, and what did it leave out?', side: 'wiki/definition-of-done/' },
  tests: { word: 'test run', b: 'tool', q: 'What was checked, and what was not?', side: 'wiki/test/' },
  shot: { word: 'screenshot', b: 'tool', q: 'What does it look like?', side: 'wiki/browser-check/' },
  link: { word: 'link', b: 'tool', q: 'Does it work when you use it?', side: 'wiki/preview-deployment/' },
};
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

const BASE_LABELS = (): Label[] => [lab('you', 'you', 'left'), lab('a0', 'the model', 'top', 'wiki/model/'), lab('gate', 'check', 'top', 'wiki/verification/')];
const base = (): SceneState => {
  // The tray is what this chapter is about. The project is left out so the camera can come close
  // enough for every card to carry its name.
  const s = solo({ tools: true, project: false, gate: true, tray: [], labels: BASE_LABELS() });
  s.tray!.gap = GAP;
  return s;
};
/** Relabel the tray: its cards by name, or the empty tray. */
function relabel(s: SceneState, names: Record<string, [string, string?]> = {}) {
  const cards = s.tray!.cards;
  s.labels = [...BASE_LABELS(), ...(cards.length ? cards.map((c) => cardLabel(s, c.id, names[c.id]?.[0] ?? CARDS[c.id as CardId]?.word ?? c.id, names[c.id]?.[1] ?? CARDS[c.id as CardId]?.side)) : [lab('tray', 'the tray', 'bottom')])];
}

// One readout for the whole chapter, the same four names on every step.
interface Tally { done: number; came: string; seen: number; missed: number | string }
const show = (ctx: Ctx, t: Tally) => ctx.stat([['said “done”', t.done], ['came with it', t.came], ['not what you asked, seen', t.seen], ['not what you asked, missed', t.missed]]);

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
  const t: Tally = { done: 0, came: 'nothing yet', seen: 0, missed: 0 };
  show(ctx, t);
  await build(ctx, h, 'Let members pay their fee online.', 8);
  await pass(h);
  await h.send(route.gateToYou(), 'model', { ms: 420 });
  ctx.say('the model', 'Done.');
  Object.assign(t, { done: 1, came: 'one word', missed: '?' });
  show(ctx, t);
  await h.wait(1300);
  ctx.say(null, 'One word for 212 changed lines. To know whether it is what you asked for, you would read all 212.');
}

// ----- cards: the same job, with proof -----
async function cards(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  const t: Tally = { done: 0, came: 'nothing yet', seen: 0, missed: 0 };
  show(ctx, t);
  await build(ctx, h, 'Let members pay their fee online. Show me it works.', 8);
  await pass(h);
  for (const id of ORDER) {
    ctx.say(CARDS[id].word, CARDS[id].q);
    await land(h, { id, b: CARDS[id].b });
    t.came = `${ORDER.indexOf(id) + 1} card${id === 'sum' ? '' : 's'}`;
    show(ctx, t);
    await h.wait(1100);
    settle(h);
  }
  await h.send(route.gateToYou(), 'model', { ms: 420 });
  t.done = 1;
  show(ctx, t);
  ctx.say(null, 'Four cards, each answering one question in a glance. The 212 changed lines are still there if a card makes you want to read them.');
}

// ----- catch: six jobs, all green at the check -----
interface Job { ask: string; wrong?: CardId; says?: string }
const JOBS: Job[] = [
  { ask: 'Sort the list by surname.' },
  { ask: 'Show who has not paid.', wrong: 'tests', says: 'The test it wrote is called “lists members who have paid”. It passes.' },
  { ask: 'Email the unpaid a reminder.', wrong: 'sum', says: 'Added a reminder email that goes to every member.' },
  { ask: 'Add a phone column.' },
  { ask: 'Put the club badge on the list.', wrong: 'shot', says: 'The badge is on the login page. The list has none.' },
  { ask: 'Let members change their own email.', wrong: 'link', says: 'Signed in as a member: “Not allowed”. Only the admin can save it.' },
];
async function catching(ctx: Ctx, h: Script, on: CardId[]) {
  h.set((s) => { Object.assign(s, base()); });
  const t: Tally = { done: 0, came: on.length ? `${on.length} card${on.length > 1 ? 's' : ''}` : 'one word', seen: 0, missed: 0 };
  show(ctx, t);
  for (const job of JOBS) {
    await build(ctx, h, job.ask, 3, true);
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
    if (flaw && !on.includes(flaw)) { t.missed = (t.missed as number) + 1; ctx.say('the model', `Done. (${job.says})`); } else ctx.say('the model', 'Done.');
    show(ctx, t);
    await h.wait(flaw && !on.includes(flaw) ? 1400 : 500);
    clear(h);
  }
  const missed = t.missed as number;
  ctx.say(null, missed
    ? `The check was green six times out of six. ${missed} of the jobs were not what you asked for and reached you as “done” anyway.`
    : `The check was green six times out of six. All ${t.seen} jobs that were not what you asked for showed it on a card before they reached you.`);
}

// ----- during: a long job, with or without a progress file -----
const STEPS = ['Read the member list', 'Add a photo column', 'Resize uploads', 'Change the login so photos load faster', 'Add the upload button', 'Show photos on the list', 'Write the tests', 'Run the tests', 'Fix one failing test', 'Write the summary'];
async function during(ctx: Ctx, h: Script, progress: boolean) {
  h.set((s) => { Object.assign(s, base()); if (progress) { s.tray!.cards = [{ id: 'progress', fill: 0 }]; relabel(s, { progress: ['progress'] }); } });
  const t: Tally = { done: 0, came: progress ? 'a progress file' : 'nothing until the end', seen: 0, missed: 0 };
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
      ctx.say('progress', `Step ${i + 1} of ${STEPS.length}: ${STEPS[i]}.`);
      if (i === 3) {
        t.seen = 1; show(ctx, t);
        ctx.say('progress', `Step 4 of ${STEPS.length}: ${STEPS[3]}. You never asked for that, and you can see it while it works.`);
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
    ? 'You saw the wrong turn at step 4 of 10, while it was still working, and did not have to stop it to look.'
    : 'Ten steps with nothing to look at, then “Done.” The login change it made at step 4 came with it.');
}

// ----- ask: the kind of work decides the cards -----
type Work = 'page' | 'script' | 'fix';
const ASKS: Record<Work, { ask: string; cards: { id: string; b: Kind; word: string; q: string; mark?: Card['mark'] }[] }> = {
  page: { ask: 'Add a page for match days.', cards: [
    { id: 'sum', b: 'model', word: 'summary', q: 'What did it change?' },
    { id: 'phone', b: 'tool', word: 'phone', q: 'Screenshot at phone width: does it fit?' },
    { id: 'desk', b: 'tool', word: 'desktop', q: 'Screenshot at desktop width: does it look right?' },
    { id: 'link', b: 'tool', word: 'link', q: 'A link to try it yourself.' },
  ] },
  script: { ask: 'Tidy the exported contacts.', cards: [
    { id: 'sum', b: 'model', word: 'summary', q: 'What did it change?' },
    { id: 'before', b: 'tool', word: 'before', q: 'Five rows before: duplicates, three date formats, stray spaces.' },
    { id: 'after', b: 'tool', word: 'after', q: 'The same five rows after: is that what you wanted?' },
    { id: 'count', b: 'tool', word: 'counts', q: '1,240 rows in, 1,187 out, 53 duplicates merged.' },
  ] },
  fix: { ask: 'The opening hours are wrong on public holidays. Fix it.', cards: [
    { id: 'sum', b: 'model', word: 'summary', q: 'What was wrong, and what changed?' },
    { id: 'test', b: 'bad', word: 'failing test', q: 'A test that shows the bug: it fails before the fix.', mark: 'bad' },
    { id: 'shot', b: 'tool', word: 'screenshot', q: 'The holiday page after the fix.' },
  ] },
};
async function asking(ctx: Ctx, h: Script, kind: Work) {
  h.set((s) => { Object.assign(s, base()); });
  const job = ASKS[kind];
  const t: Tally = { done: 0, came: 'nothing yet', seen: 0, missed: 0 };
  show(ctx, t);
  const names: Record<string, [string, string?]> = {};
  for (const c of job.cards) names[c.id] = [c.word];
  await build(ctx, h, job.ask, 6, true);
  for (const [i, c] of job.cards.entries()) {
    ctx.say(c.word, c.q);
    await land(h, { id: c.id, b: c.b }, names, 340);
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
      ctx.say('test run', 'The same test, after the fix: it passes.');
      await h.wait(1100);
    }
  }
  await pass(h, true);
  await h.send(route.gateToYou(), 'model', { ms: 380 });
  t.done = 1;
  show(ctx, t);
  ctx.say(null, kind === 'page' ? 'A page comes back as two screenshots and a link.' : kind === 'script' ? 'A script comes back as rows before and after, and the counts.' : 'A fix comes back as the test that failed, now passing.');
}

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, base()); });
  ctx.say('you', 'Let members pay their fee online. Show me it works.');
  await h.send(route.youToAgent(), 'you', { ms: 420 });
  h.set((s) => { work(s, true); });
  await h.wait(900);
  h.set((s) => { work(s, false); });
  await pass(h);
  for (const id of ORDER) {
    ctx.say(CARDS[id].word, CARDS[id].q);
    await land(h, { id, b: CARDS[id].b }, undefined, 320);
    await h.wait(650);
    settle(h);
  }
  await h.send(route.gateToYou(), 'model', { ms: 380 });
  ctx.say('the model', 'Done, with four cards to look at.');
  await h.wait(1500);
}

const run = (ctx: Ctx, fn: (h: Script) => Promise<void>) => void ctx.scene.run(fn);
const playCatch = (ctx: Ctx) => run(ctx, (h) => catching(ctx, h, ctx.mem.on ?? ORDER));

export const proof: Chapter = {
  steps: {
    word: { scene: () => base(), enter: (ctx) => run(ctx, (h) => word(ctx, h)) },
    cards: { scene: () => base(), enter: (ctx) => run(ctx, (h) => cards(ctx, h)) },
    catch: { scene: () => base(), enter: (ctx) => { ctx.mem.on = [...ORDER]; ctx.scene.speed = 1.5; playCatch(ctx); } },
    during: { scene: () => base(), enter: (ctx) => run(ctx, (h) => during(ctx, h, false)) },
    ask: { scene: () => base(), enter: (ctx) => run(ctx, (h) => asking(ctx, h, 'page')) },
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
