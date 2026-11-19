// Chapter 17: other machines. The same jobs, each standing on the machine it runs on: your laptop,
// a computer that stays on, a machine in the cloud. Close the laptop's lid and its job stops where
// it was; the others carry on. The hour, the jobs and the missing setup are made up.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { jobs, lab } from '../presets';
import { BUS_Y, type SceneState, type XY, type Zone } from '../picture';

type Kind = Zone['kind'];
const ALL: Kind[] = ['laptop', 'box', 'cloud'];
const GAP = 112;
const NAMES: Record<Kind, string> = { laptop: 'your laptop', box: 'the computer that stays on', cloud: 'the cloud' };

const SLAB: [number, number, number, number] = [-31, -31, 62, 62];
const scene = (n: number, o: { gate?: boolean; phone?: boolean; leave?: boolean } = {}): SceneState => {
  const machines = ALL.slice(0, n);
  const s = jobs(n, {
    gap: GAP, machines, trees: false, mgate: o.gate,
    slab: SLAB,
    labels: [
      lab('you', 'you', 'left'),
      // Each machine is named over the job standing on it: the space above the columns stays free.
      lab('j0', 'your laptop', 'top'),
      ...(n > 1 ? [lab('j1', 'always on', 'top', 'wiki/always-on-machine/')] : []),
      ...(n > 2 ? [lab('j2', 'the cloud', 'top')] : []),
      ...(o.gate ? [lab('mgate', 'check', 'right', 'wiki/verification/')] : []),
      lab('main', 'main', 'bottom', 'wiki/branch/'),
      ...(o.phone ? [lab('tray', 'on your phone', 'bottom')] : []),
    ],
  });
  // Frame all three machines from the first step, so adding one does not move the camera much.
  const [l, r] = [-GAP - 34, GAP + 34];
  s.focus = ['you', 'tray', 'project', [l, -34, 0], [l - 30, 34, 0], [r, -34, 0], [r, 44, 0], [0, -34, 60]];
  return s;
};

// ---------- a made-up hour on up to three machines ----------

const TICK = 200;
const HOUR = 64;
const WORK = 15;

interface Run { lid: 'open' | 'closed'; setup: boolean }
const stats = (ctx: Ctx) => {
  const s = ctx.scene.state;
  const stopped = s.agents.filter((a) => a.off || a.lamp === 'bad').length;
  ctx.stat([['jobs running now', s.agents.length - stopped], ['jobs stopped now', stopped]]);
};
const fly = (p: Promise<void>, then?: () => void) => void p.then(then).catch(() => {});

function applyLid(ctx: Ctx, h: Script | null, lid: Run['lid']) {
  const change = (s: SceneState) => {
    const z = s.zones?.[0], a = s.agents[0];
    if (!z || !a) return;
    z.off = a.off = lid === 'closed';
    if (a.off) { a.busy = false; a.lamp = 'off'; } else if ((a.blocks ?? []).length && a.lamp === 'off') { a.busy = true; a.lamp = 'work'; }
  };
  if (h) h.set(change); else ctx.scene.change(change);
  stats(ctx);
}

async function hour(ctx: Ctx, h: Script, n: number, o: { gate?: boolean; phone?: boolean; leave?: boolean } = {}) {
  const run: Run = ctx.mem.run;
  h.set((s) => { Object.assign(s, scene(n, o)); });
  applyLid(ctx, h, run.lid);
  const landed = Array.from({ length: n }, () => 0);
  // The cloud job starts first, so its check is the first thing that happens in that step.
  const work = Array.from({ length: n }, (_, i) => -(n - 1 - i) * 4);
  const failed = Array.from({ length: n }, () => false);
  const project = () => ctx.scene.state.project!;
  const gateX = (ctx.scene.state.gates?.find((g) => g.id === 'mgate')?.at[0] ?? 0) - 12;
  const at = (i: number): XY => ctx.scene.state.agents[i]!.at;
  const card = (i: number, mark: 'work' | 'ok' | 'bad') => h.set((s) => { s.tray!.cards[i]!.mark = mark; });

  for (let tick = 0; tick < HOUR; tick++) {
    if (o.leave && tick === HOUR / 2 && ctx.mem.run.lid === 'open') {
      ctx.mem.run = { ...ctx.mem.run, lid: 'closed' };
      ctx.say('you', 'Lid closed. Off home.');
      applyLid(ctx, h, 'closed');
      // The lid buttons follow what just happened in the picture.
      for (const b of document.querySelectorAll<HTMLElement>('[data-step="mix"] [data-do="lid"]')) b.setAttribute('aria-pressed', String(b.dataset.val === 'closed'));
    }
    for (let i = 0; i < n; i++) {
      const a = ctx.scene.state.agents[i]!;
      if (a.off || failed[i]) continue;
      work[i]!++;
      if (work[i]! <= 0) continue;
      if (work[i] === 1) h.set((s) => { const b = s.agents[i]!; b.blocks = [{ t: 'you', h: 3 }]; b.busy = true; b.lamp = 'work'; s.tray!.cards[i]!.mark = 'work'; });
      else if (work[i]! < WORK && work[i]! % 3 === 0) h.set((s) => { s.agents[i]!.blocks!.push({ t: work[i]! % 2 ? 'model' : 'tool', h: 3 + (work[i]! % 4) }); });
      if (work[i] !== WORK) continue;
      h.set((s) => { const b = s.agents[i]!; b.busy = false; b.lamp = 'wait'; });
      const up: XY[] = [[at(i)[0], -16], [at(i)[0], BUS_Y]];
      const cantStart = ALL[i] === 'cloud' && !run.setup;
      if (o.gate) {
        fly(h.send([...up, [gateX, BUS_Y]], 'model', { ms: 640 }), () => {
          if (cantStart) {
            failed[i] = true;
            h.set((s) => { s.gates!.find((g) => g.id === 'mgate')!.lamp = 'bad'; const b = s.agents[i]!; b.lamp = 'bad'; b.blocks!.push({ t: 'bad', h: 3 }); s.tray!.cards[i]!.mark = 'bad'; });
            ctx.say('check', 'Cannot start: there is no test database on this machine.');
            stats(ctx);
            fly(h.send([[gateX, BUS_Y], ...up.reverse()], 'bad', { ms: 640 }));
            return;
          }
          h.set((s) => { s.gates!.find((g) => g.id === 'mgate')!.lamp = 'ok'; });
          fly(h.send([[gateX + 24, BUS_Y], [project().at[0] - 46, BUS_Y]], 'model', { ms: 360 }), () => {
            landed[i]!++;
            h.set((s) => { (s.project!.commits ??= []).push('ok'); s.agents[i]!.lamp = 'ok'; s.tray!.cards[i]!.mark = 'ok'; });
          });
        });
      } else {
        fly(h.send([...up, [project().at[0] - 46, BUS_Y]], 'model', { ms: 760 }), () => {
          landed[i]!++;
          h.set((s) => { (s.project!.commits ??= []).push('ok'); s.agents[i]!.lamp = 'ok'; s.tray!.cards[i]!.mark = 'ok'; });
        });
      }
      work[i] = -6;
    }
    await h.wait(TICK);
  }
  await h.wait(900);
  h.set((s) => { for (const a of s.agents) a.busy = false; });
  ctx.mem.done = true;
  const changes = (k: number) => `${k} ${k === 1 ? 'change' : 'changes'}`;
  const parts = ALL.slice(0, n).map((k, i) => `${NAMES[k]} ${landed[i]}`);
  const stopped = ctx.scene.state.agents.filter((a) => a.off || a.lamp === 'bad').length;
  const head = n === 1 ? `In a made-up hour your laptop landed ${changes(landed[0]!)} on main.` : `In a made-up hour, changes on main from ${parts.join(', ')}.`;
  ctx.say(null, `${head}${stopped ? ` ${stopped === 1 ? 'One job is' : `${stopped} jobs are`} stopped where ${stopped === 1 ? 'it was' : 'they were'}.` : ''}`);
}

const play = (ctx: Ctx, n: number, o: { gate?: boolean; phone?: boolean; leave?: boolean } = {}) => {
  ctx.mem.n = n; ctx.mem.o = o; ctx.mem.done = false;
  void ctx.scene.run((h) => hour(ctx, h, n, o));
};
const start = (ctx: Ctx, n: number, run: Run, o: { gate?: boolean; phone?: boolean; leave?: boolean } = {}, line?: string) => { ctx.mem.run = run; play(ctx, n, o); if (line) ctx.say(null, line); };

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => { Object.assign(s, scene(3)); });
  const work = async (i: number, turns: number) => {
    h.set((s) => { const a = s.agents[i]!; a.blocks = [{ t: 'you', h: 3 }]; a.busy = true; a.lamp = 'work'; });
    for (let k = 0; k < turns; k++) { await h.wait(420); h.set((s) => { s.agents[i]!.blocks!.push({ t: k % 2 ? 'model' : 'tool', h: 4 }); }); }
  };
  await Promise.all([work(0, 3), work(1, 3), work(2, 3)]);
  ctx.say(null, 'The lid closes. The other two carry on.');
  h.set((s) => { s.zones![0]!.off = true; const a = s.agents[0]!; a.off = true; a.busy = false; a.lamp = 'off'; });
  await Promise.all([work(1, 6), work(2, 6)]);
  await h.wait(800);
}

export const where: Chapter = {
  steps: {
    laptop: { scene: () => scene(1), enter: (ctx) => start(ctx, 1, { lid: 'open', setup: true }, {}, 'One job, on your laptop, with your files and your logins.') },
    lid: { scene: () => scene(1), enter: (ctx) => start(ctx, 1, { lid: 'open', setup: true }, {}, 'Lid open. The job runs.') },
    box: { scene: () => scene(2, { phone: true }), enter: (ctx) => start(ctx, 2, { lid: 'closed', setup: true }, { phone: true }, 'Lid closed. The laptop’s job waits; the other computer’s job runs, and you follow it on your phone.') },
    cloud: { scene: () => scene(3, { gate: true }), enter: (ctx) => start(ctx, 3, { lid: 'open', setup: false }, { gate: true }, 'A made-up case: the cloud machine was not given the test database the check needs.') },
    mix: { scene: () => scene(3, { gate: true }), enter: (ctx) => start(ctx, 3, { lid: 'open', setup: true }, { gate: true, leave: true }, 'Three jobs on three machines, all landing on one main. Halfway through the hour you close the lid.') },
  },
  actions: {
    // The lid answers at once; the hour carries on. After the hour has ended, it starts another.
    lid: (ctx, val) => {
      const lid = val === 'closed' ? 'closed' : 'open';
      ctx.mem.run = { ...ctx.mem.run, lid };
      ctx.say(null, lid === 'closed' ? 'Lid closed. The laptop sleeps, and its job stops where it was.' : 'Lid open. The laptop’s job carries on from where it stopped.');
      applyLid(ctx, null, lid);
      if (ctx.mem.done) play(ctx, ctx.mem.n, ctx.mem.o);
    },
    setup: (ctx, val) => {
      const setup = val === 'with';
      ctx.say(null, setup ? 'The cloud machine is given the test database the check needs.' : 'A made-up case: the cloud machine was not given the test database the check needs.');
      start(ctx, 3, { lid: 'open', setup }, { gate: true });
    },
  },
};
