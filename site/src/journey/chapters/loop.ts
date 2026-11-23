// Chapter 2: the loop. Tools turn the model's text into actions, and each result goes back in.
import type { Chapter, Ctx } from '../chapter';
import { byLevel } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';
import { termLabel } from '../terms';
import { route, reverse, type Kind } from '../picture';
import { t3code } from '../../data/t3code';

// What each choice in the last step is called in T3 Code's composer. "Ask every time" has no mode
// there: no T3 Code mode asks before reading a file.
const [SUPERVISED, , , FULL_ACCESS] = t3code.permissionModes.value;
const MODE: Record<Ask, string | undefined> = { always: undefined, edits: SUPERVISED, never: FULL_ACCESS };

const labels = [
  lab('you', 'you', 'left'), termLabel('a0', 'model', 'top', 'the model'),
  termLabel('tools', 'tools'), termLabel('project', 'project'),
];
const base = () => solo({ tools: true, project: true, labels });

type Ask = 'never' | 'edits' | 'always';
interface JobOpts { run: boolean; ask: Ask }

/** The same small fix, played through the loop. What it may do changes how it goes. */
export async function job(ctx: Ctx, h: Script, o: JobOpts) {
  const { scene } = ctx;
  let turns = 0, calls = 0, asked = 0;
  const stats = (proof = o.run ? 'not yet' : 'it cannot run the tests') => ctx.stat([['turns of its own', turns], ['tool calls', calls], ['times it asked you', asked], ['proof it works', proof]]);
  const a = () => scene.state.agents[0]!;
  const think = async () => {
    h.set((s) => { s.agents[0]!.busy = true; });
    await h.wait(420);
    turns++;
    stats();
  };
  // `does` is what the lit cube says it is doing, `result.says` what comes back from it: two bubbles
  // at the cube, so the whole run (search, read, edit, run, fail, fix, run, pass) reads on the
  // picture. Both about 30 characters.
  const call = async (tool: string, file: number, mark: 'read' | 'edit', says: string, does: string, result: { kind: Kind; h: number; says: string }) => {
    await think();
    h.set((s) => { s.agents[0]!.blocks!.push({ t: 'model', h: 1.4 }); });
    // Ask before changes and commands, as T3 Code's Supervised mode does: edits and runs wait for you.
    const needsYou = o.ask === 'always' || (o.ask === 'edits' && (tool === 'edit' || tool === 'run'));
    if (needsYou) {
      h.set((s) => { s.agents[0]!.lamp = 'wait'; });
      ctx.say('model', `May I ${says}?`);
      await h.send(reverse(route.youToAgent()), 'model');
      asked++;
      stats();
      await h.wait(500);
      ctx.say('you', 'Yes.');
      await h.send(route.youToAgent(), 'you');
      h.set((s) => { s.agents[0]!.lamp = 'off'; });
    }
    const tools = scene.state.tools!, project = scene.state.project!;
    await h.send(route.agentToTool(tools, tool), 'model');
    h.set((s) => { s.tools!.on = tool; s.agents[0]!.busy = false; });
    calls++;
    stats();
    ctx.say('tool', does);
    await h.wait(550);
    if (tool !== 'run') {
      await h.send(route.toolToFile(tools, tool, project, file).slice(1), 'model', { ms: 380 });
      h.set((s) => { const f = (s.project!.files ??= ['', '', '', '', '', '']); f[file] = mark; });
    } else {
      await h.wait(520);
    }
    if (tool !== 'edit') { ctx.say('tool', result.says); await h.wait(result.kind === 'bad' ? 900 : 450); }
    await h.send(reverse(route.agentToTool(tools, tool)), result.kind);
    h.set((s) => { s.tools!.on = null; s.agents[0]!.blocks!.push({ t: result.kind, h: result.h }); });
    await h.wait(380);
  };

  ctx.say(null, '');
  h.set((s) => { Object.assign(s, { ...base(), labels: s.labels }); s.tools!.off = o.run ? [] : ['run']; });
  stats();
  ctx.say('you', 'The dates on the member list are wrong.');
  await h.send(route.youToAgent(), 'you');
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 2.4 }); });

  await call('search', 1, 'read', 'search the project for “date”', 'search: “date”', { kind: 'tool', h: 3, says: '2 files mention dates' });
  await call('read', 1, 'read', 'read members.ts', 'read: members.ts', { kind: 'tool', h: 6, says: '84 lines of members.ts' });
  await call('edit', 1, 'edit', 'change how the date is read', 'edit: how members.ts reads dates', { kind: 'tool', h: 1.6, says: 'members.ts changed' });
  if (o.run) {
    const cmd = byLevel(ctx.level, { plain: 'run the tests', technical: 'run npm test', engineer: 'run tsc --noEmit && npm test' });
    const does = byLevel(ctx.level, { plain: 'run: the tests', technical: 'run: npm test', engineer: 'run: tsc --noEmit && npm test' });
    await call('run', 0, 'read', cmd, does, { kind: 'bad', h: 4, says: byLevel(ctx.level, { plain: '1 of 12 fails: 3 March → 3 Dec', technical: 'npm test: 1 of 12 failed', engineer: 'vitest: 1 of 12 failed' }) });
    if (ctx.level !== 'plain') ctx.say(null, byLevel(ctx.level, { plain: '', technical: 'parseDate("03.03.2026") returned 3 December.', engineer: 'tsc is clean; members.test.ts fails: day and month swapped.' }));
    await call('edit', 1, 'edit', 'fix the day and month order', 'edit: swap day and month', { kind: 'tool', h: 1.6, says: 'members.ts changed' });
    await call('run', 0, 'read', cmd + ' again', does + ' again', { kind: 'tool', h: 3, says: byLevel(ctx.level, { plain: '12 of 12 tests pass', technical: 'npm test: 12 of 12 passed', engineer: 'tsc clean, 12 of 12 passed' }) });
  }
  await think();
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'model', h: 2.4 }); s.agents[0]!.busy = false; s.agents[0]!.lamp = o.run ? 'ok' : 'off'; });
  ctx.say('model', o.run ? 'Fixed: day and month were swapped.' : 'Fixed. It should work now.');
  stats(o.run ? 'tests pass' : 'none');
  await h.send(reverse(route.youToAgent()), 'model');
  ctx.say(null, o.run
    ? `One message from you, ${turns} turns of its own and ${calls} tool calls. Every result went back into the window, the failed test too, and all 12 tests pass.`
    : 'It could not run anything, so “fixed” is a guess. Nothing tried the fix.');
  // In the step about asking, name the setting as T3 Code's composer names it.
  if (ctx.mem.ask) {
    await h.wait(1200);
    ctx.say(null, `It asked you ${asked} time${asked === 1 ? '' : 's'}. ${MODE[o.ask] ? `In T3 Code this is the ${MODE[o.ask]} mode.` : 'No T3 Code mode asks before every read.'}`);
  }
  void a;
}

const play = (ctx: Ctx, o: Partial<JobOpts> = {}) => {
  const opts: JobOpts = { run: ctx.mem.run ?? true, ask: ctx.mem.ask ?? 'never', ...o };
  void ctx.scene.run((h) => job(ctx, h, opts));
};

/** The four tools, each lit in turn and saying what it does, on a loop. */
const TOUR: [string, string][] = [['search', 'search: find where things are'], ['read', 'read: open a file'], ['edit', 'edit: change a file'], ['run', 'run: run a command, the tests']];
function tour(ctx: Ctx) {
  void ctx.scene.run(async (h) => {
    for (let i = 0; ; i++) {
      const [tool, says] = TOUR[i % TOUR.length]!;
      h.set((s) => { s.tools!.on = tool; });
      ctx.say('tool', says);
      await h.wait(1700);
      h.set((s) => { s.tools!.on = null; });
      await h.wait(250);
    }
  });
}

export const loop: Chapter = {
  // The chip counts the model's own turns; the steps about one tool or about asking pin their number.
  counter: 'turns',
  steps: {
    hands: { scene: base, enter: tour },
    fix: { scene: base, enter: (ctx) => { ctx.scene.speed = 1.25; play(ctx); } },
    again: {
      scene: base,
      enter: (ctx) => { ctx.scene.speed = 2.2; play(ctx); },
    },
    norun: { scene: () => { const s = base(); s.tools!.off = ['run']; return s; }, enter: (ctx) => { ctx.mem.run = false; play(ctx); }, counter: 'proof' },
    ask: { scene: base, enter: (ctx) => { ctx.mem.ask = 'always'; play(ctx); }, counter: 'times it asked' },
  },
  actions: {
    play: (ctx) => play(ctx),
    ask: (ctx, val) => { ctx.mem.ask = val as Ask; play(ctx); },
    run: (ctx, val) => {
      ctx.mem.run = val === 'on';
      ctx.scene.speed = 2;
      play(ctx);
      ctx.say(null, val === 'on' ? 'With run: it can try its fix. Watch “proof it works” in the corner.' : 'Without run: it cannot try its fix. Watch “proof it works” in the corner.');
    },
  },
};
