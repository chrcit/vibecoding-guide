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
/** How the work log names each call. */
const ROW: Record<string, string> = { search: 'Searched “date”', read: 'Read members.ts', edit: 'Changed members.ts', run: 'Ran command' };

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
  const call = async (tool: string, file: number, mark: 'read' | 'edit', says: string, result: { kind: Kind; h: number; says: string }) => {
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
    ctx.screen.row(tool as 'search', ROW[tool]!, tool === 'run' ? says.replace(/^run /, '') : undefined);
    const tools = scene.state.tools!, project = scene.state.project!;
    await h.send(route.agentToTool(tools, tool), 'model');
    h.set((s) => { s.tools!.on = tool; s.agents[0]!.busy = false; });
    calls++;
    stats();
    if (tool !== 'run') {
      await h.send(route.toolToFile(tools, tool, project, file).slice(1), 'model', { ms: 380 });
      h.set((s) => { const f = (s.project!.files ??= ['', '', '', '', '', '']); f[file] = mark; });
    } else {
      await h.wait(520);
    }
    await h.send(reverse(route.agentToTool(tools, tool)), result.kind);
    h.set((s) => { s.tools!.on = null; s.agents[0]!.blocks!.push({ t: result.kind, h: result.h }); });
    if (tool !== 'edit') ctx.screen.result(result.says, result.kind === 'bad' ? 'bad' : undefined);
    await h.wait(380);
  };

  ctx.screen.setup({ form: 't3', project: 'club-list', chips: MODE[o.ask] ? [MODE[o.ask]!] : [] });
  h.set((s) => { Object.assign(s, { ...base(), labels: s.labels }); s.tools!.off = o.run ? [] : ['run']; });
  stats();
  ctx.say('you', 'The dates on the member list are wrong.');
  await h.send(route.youToAgent(), 'you');
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 2.4 }); });

  await call('search', 1, 'read', 'search the project for “date”', { kind: 'tool', h: 3, says: '2 files mention dates' });
  await call('read', 1, 'read', 'read members.ts', { kind: 'tool', h: 6, says: '84 lines of members.ts' });
  await call('edit', 1, 'edit', 'change how the date is read', { kind: 'tool', h: 1.6, says: 'members.ts changed' });
  if (o.run) {
    const cmd = byLevel(ctx.level, { plain: 'run the tests', technical: 'run npm test', engineer: 'run tsc --noEmit && npm test' });
    await call('run', 0, 'read', cmd, { kind: 'bad', h: 4, says: byLevel(ctx.level, { plain: '1 of 12 tests fails: 3 March reads as 3 December', technical: 'npm test: 1 of 12 failed. parseDate("03.03.2026") returned 3 December', engineer: 'tsc clean. vitest: 1 of 12 failed in members.test.ts (day and month swapped)' }) });
    await call('edit', 1, 'edit', 'fix the day and month order', { kind: 'tool', h: 1.6, says: 'members.ts changed' });
    await call('run', 0, 'read', cmd + ' again', { kind: 'tool', h: 3, says: byLevel(ctx.level, { plain: '12 of 12 tests pass', technical: 'npm test: 12 of 12 passed', engineer: 'tsc clean. vitest: 12 of 12 passed' }) });
  }
  await think();
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'model', h: 2.4 }); s.agents[0]!.busy = false; s.agents[0]!.lamp = o.run ? 'ok' : 'off'; });
  ctx.say('model', o.run ? 'Fixed. The day and month were swapped. All 12 tests pass.' : 'Fixed. It should work now.');
  stats(o.run ? 'tests pass' : 'none');
  await h.send(reverse(route.youToAgent()), 'model');
  ctx.say(null, o.run
    ? `One message from you, ${turns} turns of its own. Every row in the work log was a tool, and every result went back into the window.`
    : 'It could not run anything, so “fixed” is a guess. Nothing in the work log tried the fix.');
  void a;
}

const play = (ctx: Ctx, o: Partial<JobOpts> = {}) => {
  const opts: JobOpts = { run: ctx.mem.run ?? true, ask: ctx.mem.ask ?? 'never', ...o };
  void ctx.scene.run((h) => job(ctx, h, opts));
};

export const loop: Chapter = {
  steps: {
    hands: { scene: base },
    fix: { scene: base, enter: (ctx) => play(ctx) },
    again: {
      scene: base,
      enter: (ctx) => { ctx.scene.speed = 2.2; play(ctx); },
    },
    norun: { scene: () => { const s = base(); s.tools!.off = ['run']; return s; }, enter: (ctx) => { ctx.mem.run = false; play(ctx); } },
    ask: { scene: base, enter: (ctx) => { ctx.mem.ask = 'always'; play(ctx); } },
  },
  actions: {
    play: (ctx) => play(ctx),
    ask: (ctx, val) => { ctx.mem.ask = val as Ask; play(ctx); },
    run: (ctx, val) => {
      ctx.mem.run = val === 'on';
      ctx.scene.speed = 2;
      play(ctx);
      ctx.say(null, val === 'on' ? 'With run: it can try its fix. Watch “proof it works”.' : 'Without run: it cannot try its fix. Watch “proof it works”.');
    },
  },
};
