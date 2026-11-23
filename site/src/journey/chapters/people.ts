// Lesson 20: other people. A change waits at the gate in front of main as a pull request; a
// colleague reads it, a client looks at the result, users find what nobody tested. What each of
// them says comes back as a puck and ends as a slab in the agent's window: the next job's brief.
// The jobs, the people's lines and every rate in the day are made up and fixed, not random.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { ship, lab } from '../presets';
import { termLabel } from '../terms';
import { route, reverse, SPOT, BUS_Y, USERS, type SceneState, type XY, type Kind } from '../picture';

type Who = 'peer' | 'client' | 'users';
const GATE_X = SPOT.mgate[0] - 12;
/** Where the i-th change waiting at the gate stands on the bus. */
const queueAt = (i: number): XY => [GATE_X - 9 * i, BUS_Y];
/** Users and client stay in frame from the first step, so the picture grows without the camera moving. */
const WIDE: SceneState['focus'] = ['you', 'a0', 'project', 'mgate', [SPOT.client[0], SPOT.client[1] + 8, 0], [USERS[0]![0] + 8, USERS[0]![1], 20], [USERS[2]![0] + 8, USERS[2]![1] + 8, 0]];

const scene = (people: Who[], n = 0): SceneState => {
  const s = ship(n, {
    trees: n > 0,
    people,
    lead: [],
    labels: [
      lab('you', 'you', 'left'),
      ...(n ? [] : [termLabel('a0', 'agent', 'top', 'the agent')]),
      termLabel('mgate', 'check'),
      termLabel([GATE_X - 62, BUS_Y, 0], 'pull-request', 'bottom', 'pull requests'),
      termLabel('main', 'main', 'bottom'),
      ...(people.includes('peer') ? [lab('peer', 'a colleague', 'right', 'wiki/review/')] : []),
      ...(people.includes('client') ? [lab('client', 'a client', 'left', 'wiki/preview-deployment/')] : []),
      ...(people.includes('users') ? [lab('user0', 'users', 'top')] : []),
      ...(n ? [lab([-88, -98 + 4, 40], `${n} agents`, 'left')] : []),
    ],
  });
  // The tray from the Proof lesson stands beside you: a pull request's proof stands on it.
  s.tray = { at: SPOT.tray, cards: [] };
  s.labels!.push(termLabel('tray', 'tray', 'bottom', 'proof on the tray'));
  s.focus = n ? ['you', 'tray', 'a0', 'project', [-100, -150 - 16, 34], [96, -150 - 16, 34], ...WIDE] : ['tray', ...WIDE!];
  return s;
};

// ---------- the readout: the same four names on every step ----------

interface Tally { landed: number; back: number; asked: number; reported: number }
const tally = (ctx: Ctx): Tally => (ctx.mem.t ??= { landed: 0, back: 0, asked: 0, reported: 0 });
const stats = (ctx: Ctx) => {
  const t = tally(ctx);
  ctx.stat([['changes landed on main, this run', t.landed, 'made-up'], ['sent back by a colleague, this run', t.back], ['asked for by the client, this run', t.asked], ['reported by users, this run', t.reported]]);
};
const plural = (n: number, one: string, many: string) => `${n === 0 ? 'none' : n === 1 ? 'one' : n} ${n === 1 ? one : many}`;

// ---------- one agent, one change at a time ----------

const gateLamp = (h: Script, lamp: 'off' | 'work' | 'wait' | 'ok' | 'bad') => h.set((s) => { s.gates!.find((g) => g.id === 'mgate')!.lamp = lamp; });

/** A brief reaches the agent and becomes the first slab of a new job. */
async function brief(ctx: Ctx, h: Script, kind: Kind, who: string | null, line: string, fromYou = true) {
  if (who !== null) ctx.say(who, line);
  if (fromYou) await h.send(route.youToAgent(), kind, { ms: 520 });
  h.set((s) => { s.agents[0]!.blocks = [{ t: kind, h: 3 }]; });
}
async function build(h: Script, turns = 3) {
  h.set((s) => { const a = s.agents[0]!; a.busy = true; a.lamp = 'work'; });
  for (let i = 0; i < turns; i++) {
    await h.wait(360);
    h.set((s) => { s.agents[0]!.blocks!.push({ t: i % 2 ? 'model' : 'tool', h: 3 + (i % 3) }); });
  }
  h.set((s) => { const a = s.agents[0]!; a.busy = false; a.lamp = 'off'; });
}
const PROOF = [{ id: 'sum', b: 'model' as const }, { id: 'tests', b: 'tool' as const }, { id: 'shot', b: 'tool' as const }];
/** The change travels the bus and waits at the gate; the automatic checks run there. Its proof stands on the tray. */
async function open(ctx: Ctx, h: Script, failing?: string, slow = false) {
  await h.send(route.agentToMgate(), 'model');
  if (slow) {
    for (const c of PROOF) {
      await h.send(route.agentToTray(ctx.scene.state.tray!), c.b, { ms: 420 });
      h.set((s) => { s.tray!.cards.push({ ...c }); });
    }
  } else h.set((s) => { s.tray!.cards = PROOF.map((c) => ({ ...c })); });
  h.set((s) => { s.rest = [{ id: 'pr', at: queueAt(0), b: 'model' }]; });
  gateLamp(h, 'work');
  await h.wait(700);
  if (failing) {
    gateLamp(h, 'bad');
    ctx.say('the check', failing);
    h.set((s) => { s.rest = []; });
    await h.send(reverse(route.agentToMgate()), 'bad');
    h.set((s) => { s.agents[0]!.blocks!.push({ t: 'bad', h: 2.4 }); });
    return false;
  }
  gateLamp(h, 'wait');
  return true;
}
/** A colleague's comment goes back to the agent as a dark puck and lands in its window. */
async function comment(ctx: Ctx, h: Script, line: string) {
  ctx.say('a colleague', line);
  tally(ctx).back++;
  stats(ctx);
  h.set((s) => { s.rest = []; });
  await h.send(reverse(route.agentToMgate()), 'you');
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 2 }); });
  gateLamp(h, 'off');
}
async function merge(ctx: Ctx, h: Script, bad = false) {
  gateLamp(h, 'ok');
  h.set((s) => { s.rest = []; s.tray!.cards = []; });
  await h.send(route.mgateToMain(ctx.scene.state.project!), bad ? 'bad' : 'model', { ms: 420 });
  h.set((s) => { (s.project!.commits ??= []).push(bad ? 'bad' : 'ok'); });
  tally(ctx).landed++;
  stats(ctx);
  await h.wait(260);
  gateLamp(h, 'off');
}
const mainOut = (): XY => [SPOT.main[0], SPOT.main[1] + 40];
/** A link to the running thing goes to the client; the code stays behind. */
async function toClient(h: Script, kind: Kind) {
  await h.send([mainOut(), [SPOT.client[0], SPOT.client[1] - 10]], kind, { ms: 420 });
}
async function toUsers(h: Script, kind: Kind = 'model') {
  await Promise.all(USERS.map((u) => h.send([[SPOT.main[0] + 46, BUS_Y], [u[0] - 10, u[1]]], kind, { ms: 520 })));
}
/** What a person says comes back to you, and you hand it on as the next job's brief. */
async function backAndOn(ctx: Ctx, h: Script, from: XY, kind: Kind, line: string) {
  await h.send(route.backToYou(from), kind);
  await brief(ctx, h, kind, 'you', line);
}

// ---------- the steps ----------

async function pr(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, scene([])); });
  stats(ctx);
  await brief(ctx, h, 'you', 'you', 'Let members pay their fee online.');
  await build(h, 4);
  ctx.say('the agent', 'Done. Pull request open, with proof.');
  await open(ctx, h, undefined, true);
  ctx.say('the check', ctx.level === 'plain'
    ? 'Tests pass. Now it waits for a person.'
    : 'CI: tsc clean, 31 tests pass. Waiting.');
  await h.wait(1400);
  ctx.say(null, 'A pull request: the agent’s branch, stopped in front of main with its proof beside it until a person says yes. Nothing has reached main.');
}

async function client(ctx: Ctx, h: Script, link: boolean) {
  h.set((s) => { Object.assign(s, scene(['peer', 'client'])); });
  stats(ctx);
  ctx.say(null, link ? 'The client gets a link to the running page.' : 'The client gets the change itself: the code.');
  await brief(ctx, h, 'you', null, '', true);
  await build(h, 3);
  await open(ctx, h);
  ctx.say('a colleague', 'Read it. Fine by me.');
  await h.wait(500);
  await merge(ctx, h);
  await toClient(h, link ? 'tool' : 'model');
  if (!link) {
    ctx.say('a client', 'I can’t tell if this works.');
    await h.wait(1200);
    ctx.say(null, 'The client saw code, not the page, and had nothing to ask for. Nothing came back.');
    return;
  }
  ctx.say('a client', 'Can the list show who hasn’t paid yet?');
  tally(ctx).asked++;
  stats(ctx);
  await backAndOn(ctx, h, SPOT.client, 'you', 'Show who hasn’t paid yet.');
  await build(h, 2);
  ctx.say(null, 'The client never read the code. What they asked for is now the agent’s next job.');
}

async function users(ctx: Ctx, h: Script, test: boolean) {
  h.set((s) => { Object.assign(s, scene(['peer', 'client', 'users'])); s.project!.commits = ['ok']; });
  stats(ctx);
  ctx.say(null, test ? 'The fix will come with a test.' : 'The fix will come without a test.');
  await toUsers(h);
  ctx.say('a user', 'My receipt shows last season’s fee.');
  tally(ctx).reported++;
  stats(ctx);
  await backAndOn(ctx, h, USERS[0]!, 'bad', 'Fix this. Here is what the user saw.');
  await build(h, 2);
  ctx.say('the agent', test ? 'Fixed. A test now checks the fee.' : 'Fixed.');
  await open(ctx, h);
  await merge(ctx, h);
  // A later, unrelated job brings the same mistake back.
  await brief(ctx, h, 'you', 'you', 'A week later: tidy the payment page.');
  await build(h, 2);
  if (test) {
    const ok = await open(ctx, h, 'Receipt test fails: last season’s fee.');
    if (!ok) {
      await build(h, 2);
      await open(ctx, h);
    }
    await merge(ctx, h);
    ctx.say(null, 'The same mistake came back a week later. The test caught it at the check; no user saw it twice.');
  } else {
    await open(ctx, h);
    ctx.say('the check', 'All tests pass.');
    await merge(ctx, h, true);
    await toUsers(h, 'bad');
    ctx.say('a user', 'My receipt is wrong again.');
    tally(ctx).reported++;
    stats(ctx);
    await h.send(route.backToYou(USERS[0]!), 'bad');
    ctx.say(null, 'Nothing in the check knew about the first report, so the same mistake reached users twice.');
  }
}

/** The whole loop: every brief after the first comes from someone else. */
const LOOP: { brief: string; back?: string; then?: { who: 'client' | 'users'; line: string } }[] = [
  { brief: 'Let members pay their fee online.', back: 'Name the payment states, not 1, 2, 3.', then: { who: 'client', line: 'Can it send a receipt?' } },
  { brief: 'Send a receipt.', then: { who: 'users', line: 'My receipt shows last season’s fee.' } },
  { brief: 'Fix the fee on the receipt.', then: { who: 'client', line: 'Can the list show who hasn’t paid?' } },
  { brief: 'Show who hasn’t paid.' },
];
async function loop(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, scene(['peer', 'client', 'users'])); });
  stats(ctx);
  for (const [i, job] of LOOP.entries()) {
    const next = LOOP[i + 1]?.brief ?? '';
    if (i === 0) await brief(ctx, h, 'you', 'you', job.brief);
    await build(h, 3);
    await open(ctx, h);
    if (job.back) {
      await comment(ctx, h, job.back);
      await build(h, 2);
      await open(ctx, h);
    }
    ctx.say('a colleague', 'Approved.');
    await merge(ctx, h);
    if (!job.then) break;
    if (job.then.who === 'client') {
      await toClient(h, 'tool');
      ctx.say('a client', job.then.line);
      tally(ctx).asked++;
      stats(ctx);
      await backAndOn(ctx, h, SPOT.client, 'you', `From the client: ${next.toLowerCase()}`);
    } else {
      await toUsers(h);
      ctx.say('a user', job.then.line);
      tally(ctx).reported++;
      stats(ctx);
      await backAndOn(ctx, h, USERS[0]!, 'bad', `From a user: ${next.toLowerCase()}`);
    }
  }
  const t = tally(ctx);
  ctx.say(null, `${t.landed} changes landed. ${t.back === 1 ? 'One was' : `${t.back} were`} sent back by a colleague first. ${t.asked + t.reported} of the ${t.landed} briefs came from the client or from users, not from you.`);
}

// ---------- the colleague's day: many agents, one reader ----------

type Size = 'big' | 'proof' | 'small';
/** Made-up rates. Build and review times in milliseconds of the picture's day; one in `back` is sent back. */
const RATES: Record<Size, { build: number; review: number; back: number; words: string }> = {
  big: { build: 4200, review: 2400, back: 2, words: '1,200 lines, no way to run it. Slow.' },
  proof: { build: 4200, review: 1200, back: 4, words: 'Big, but the proof shows where to look.' },
  small: { build: 3400, review: 300, back: 8, words: 'Forty lines and proof. Quick to read.' },
};
const DAY = 22000;
const N = 10;
const TRAVEL = 700;

/**
 * The day as a timetable, worked out before anything moves, so the picture plays the same day
 * with or without motion. Each agent builds, sends its change to the gate and waits for the
 * colleague's verdict; one colleague reads the changes in the order they arrived.
 */
type Ev = { t: number; do: 'start' | 'turn' | 'send' | 'arrive' | 'read' | 'back' | 'land' | 'returned' | 'idle'; i: number; k?: number };
function timetable(size: Size) {
  const r = RATES[size];
  const STEP = 50;
  const evs: Ev[] = [];
  type Phase = 'rest' | 'build' | 'travel' | 'queued' | 'return' | 'rework';
  const ws = Array.from({ length: N }, (_, i) => ({ phase: 'rest' as Phase, until: 120 + i * 260, job: -1 }));
  const queue: number[] = [];
  let reading = false, until = 0, reviewed = 0, landed = 0, back = 0, idle = true;
  for (let t = 0; t <= DAY; t += STEP) {
    if (reading && t >= until) {
      reading = false;
      reviewed++;
      const i = queue.shift()!;
      if (reviewed % r.back === 0) { back++; evs.push({ t, do: 'back', i }); ws[i] = { ...ws[i]!, phase: 'return', until: t + TRAVEL }; }
      else { landed++; evs.push({ t, do: 'land', i }); ws[i] = { ...ws[i]!, phase: 'rest', until: t + 250 }; }
    }
    ws.forEach((w, i) => {
      if (t < w.until) return;
      if (w.phase === 'rest') {
        w.job++;
        const d = r.build * (0.85 + ((i * 7 + w.job * 3) % 5) * 0.08);
        evs.push({ t, do: 'start', i });
        for (let k = 0; k < 3; k++) evs.push({ t: t + (d * (k + 1)) / 3.2, do: 'turn', i, k });
        w.phase = 'build'; w.until = t + d;
      } else if (w.phase === 'build' || w.phase === 'rework') {
        evs.push({ t, do: 'send', i }); w.phase = 'travel'; w.until = t + TRAVEL;
      } else if (w.phase === 'travel') {
        evs.push({ t, do: 'arrive', i }); queue.push(i); w.phase = 'queued'; w.until = Infinity;
      } else if (w.phase === 'return') {
        evs.push({ t, do: 'returned', i }); w.phase = 'rework'; w.until = t + r.build * 0.4;
      }
    });
    if (!reading && queue.length) { reading = true; until = t + r.review; idle = false; evs.push({ t, do: 'read', i: queue[0]! }); }
    else if (!reading && !idle) { idle = true; evs.push({ t, do: 'idle', i: -1 }); }
  }
  return { evs: evs.filter((e) => e.t <= DAY).sort((a, b) => a.t - b.t), landed, back, waiting: queue.length };
}

async function day(ctx: Ctx, h: Script, size: Size) {
  const r = RATES[size];
  h.set((s) => { Object.assign(s, scene(['peer'], N)); s.rest = []; if (size !== 'big') s.tray!.cards = PROOF.map((c) => ({ ...c })); });
  ctx.say('a colleague', r.words);
  ctx.say(null, `A made-up day: ${N} agents, one colleague who reads every change before it lands.`);
  stats(ctx);
  const t = tally(ctx);
  const plan = timetable(size);
  const queue: number[] = [];
  const restAll = () => h.set((s) => { s.rest = queue.map((w, i) => ({ id: `q${w}`, at: queueAt(i), b: 'model' as const })); });
  const pathOf = (i: number, to: XY): XY[] => { const at = ctx.scene.state.agents[i + 1]!.at; return [[at[0], at[1] + 14], [at[0], BUS_Y], to]; };
  const setW = (i: number, fn: (a: SceneState['agents'][number]) => void) => h.set((s) => fn(s.agents[i + 1]!));
  // Pucks travel while the day goes on; a stopped script leaves them to be cleared.
  const fly = (p: Promise<void>, then?: () => void) => void p.then(then).catch(() => {});
  // With reduced motion the day is applied at once: nothing travels, and the tally is the same.
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let now = 0;
  for (const e of plan.evs) {
    if (e.t > now) { if (!still) await h.wait(e.t - now); else h.check(); now = e.t; }
    const i = e.i;
    switch (e.do) {
      case 'start': setW(i, (a) => { a.blocks = [{ t: 'model', h: 4 }]; a.busy = true; a.lamp = 'work'; }); break;
      case 'turn': setW(i, (a) => a.blocks!.push({ t: e.k! % 2 ? 'model' : 'tool', h: size === 'small' ? 2 + e.k! : 4 + e.k! * 2 })); break;
      case 'send': setW(i, (a) => { a.busy = false; a.lamp = 'wait'; }); fly(h.send(pathOf(i, queueAt(Math.min(queue.length, 11))), 'model', { ms: TRAVEL })); break;
      case 'arrive': queue.push(i); restAll(); break;
      case 'read': gateLamp(h, 'work'); break;
      case 'idle': gateLamp(h, 'off'); break;
      case 'back':
        queue.shift(); restAll(); t.back++; stats(ctx); gateLamp(h, 'bad');
        fly(h.send(reverse(pathOf(i, queueAt(0))), 'you', { ms: TRAVEL }));
        break;
      case 'returned': setW(i, (a) => { a.blocks!.push({ t: 'you', h: 2 }); a.busy = true; a.lamp = 'work'; }); break;
      case 'land':
        queue.shift(); restAll(); t.landed++; stats(ctx); gateLamp(h, 'ok');
        setW(i, (a) => { a.lamp = 'ok'; a.blocks = []; });
        fly(h.send(route.mgateToMain(ctx.scene.state.project!), 'model', { ms: 360 }), () => h.set((s) => { (s.project!.commits ??= []).push('ok'); }));
        break;
    }
  }
  await h.wait(500);
  h.set((s) => { for (const a of s.agents) a.busy = false; s.gates!.find((g) => g.id === 'mgate')!.lamp = queue.length ? 'wait' : 'off'; });
  ctx.say(null, `Over a made-up day with ${N} agents and one colleague: ${plural(t.landed, size === 'small' ? 'small change' : 'big change', size === 'small' ? 'small changes' : 'big changes')} landed, ${t.back} sent back, ${plural(queue.length, 'change', 'changes')} still waiting for review.`);
}

const play = (ctx: Ctx, fn: (ctx: Ctx, h: Script) => Promise<void>) => { ctx.mem.t = undefined; void ctx.scene.run((h) => fn(ctx, h)); };

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, scene(['peer', 'client', 'users'])); });
  ctx.mem.t = undefined;
  await brief(ctx, h, 'you', 'you', 'Let members pay online.');
  await build(h, 2);
  await open(ctx, h);
  ctx.say('a colleague', 'Approved.');
  await merge(ctx, h);
  await toClient(h, 'tool');
  ctx.say('a client', 'Can it send a receipt?');
  await backAndOn(ctx, h, SPOT.client, 'you', 'Send a receipt.');
}

export const people: Chapter = {
  steps: {
    pr: { scene: () => scene([]), enter: (ctx) => play(ctx, pr) },
    peer: { scene: () => scene(['peer'], N), enter: (ctx) => { ctx.scene.speed = 1; play(ctx, (c, h) => day(c, h, 'big')); } },
    client: { scene: () => scene(['peer', 'client']), enter: (ctx) => play(ctx, (c, h) => client(c, h, true)) },
    users: { scene: () => scene(['peer', 'client', 'users']), enter: (ctx) => { ctx.scene.speed = 1.2; play(ctx, (c, h) => users(c, h, true)); } },
    loop: { scene: () => scene(['peer', 'client', 'users']), enter: (ctx) => { ctx.scene.speed = 1.2; play(ctx, loop); } },
  },
  actions: {
    size: (ctx, val) => play(ctx, (c, h) => day(c, h, val as Size)),
    link: (ctx, val) => play(ctx, (c, h) => client(c, h, val === 'link')),
    test: (ctx, val) => play(ctx, (c, h) => users(c, h, val === 'with')),
    again: (ctx) => play(ctx, loop),
  },
};
