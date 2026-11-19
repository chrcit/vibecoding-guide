// Chapter 2: the loop. Tools turn the model's text into actions, and each result goes back in.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';
import { route, reverse, type Kind } from '../picture';

const labels = [
  lab('you', 'you', 'left'), lab('a0', 'the model', 'top', 'wiki/model/'),
  lab('tools', 'tools', 'top', 'wiki/tool-call/'), lab('project', 'your project', 'top'),
];
const base = () => solo({ tools: true, project: true, labels });

type Ask = 'never' | 'edits' | 'always';
interface JobOpts { run: boolean; ask: Ask }

/** The same small fix, played through the loop. What it may do changes how it goes. */
export async function job(ctx: Ctx, h: Script, o: JobOpts) {
  const { scene } = ctx;
  let turns = 0, calls = 0, asked = 0;
  const stats = () => ctx.stat([['turns of its own', turns], ['tool calls', calls], ...(o.ask !== 'never' ? [['times it asked you', asked] as [string, number]] : [])]);
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
    const needsYou = o.ask === 'always' || (o.ask === 'edits' && tool !== 'read');
    if (needsYou) {
      ctx.say('model', `May I ${says}?`);
      await h.send(reverse(route.youToAgent()), 'model');
      asked++;
      stats();
      await h.wait(500);
      ctx.say('you', 'Yes.');
      await h.send(route.youToAgent(), 'you');
    }
    ctx.say('model', says);
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
    ctx.say('tool', result.says);
    await h.wait(380);
  };

  h.set((s) => { Object.assign(s, { ...base(), labels: s.labels }); s.tools!.off = o.run ? [] : ['run']; });
  ctx.say('you', 'The dates on the member list are wrong.');
  await h.send(route.youToAgent(), 'you');
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 2.4 }); });

  await call('search', 1, 'read', 'search the project for “date”', { kind: 'tool', h: 3, says: '2 files mention dates' });
  await call('read', 1, 'read', 'read members.ts', { kind: 'tool', h: 6, says: '84 lines of members.ts' });
  await call('edit', 1, 'edit', 'change how the date is read', { kind: 'tool', h: 1.6, says: 'members.ts changed' });
  if (o.run) {
    await call('run', 0, 'read', 'run the tests', { kind: 'bad', h: 4, says: '1 of 12 tests fails: 3 March reads as 3 December' });
    await call('edit', 1, 'edit', 'fix the day and month order', { kind: 'tool', h: 1.6, says: 'members.ts changed' });
    await call('run', 0, 'read', 'run the tests again', { kind: 'tool', h: 3, says: '12 of 12 tests pass' });
  }
  await think();
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'model', h: 2.4 }); s.agents[0]!.busy = false; s.agents[0]!.lamp = o.run ? 'ok' : 'off'; });
  ctx.say('model', o.run ? 'Fixed. The day and month were swapped. All 12 tests pass.' : 'Fixed. It should work now.');
  await h.send(reverse(route.youToAgent()), 'model');
  ctx.stat([['turns of its own', turns], ['tool calls', calls], ...(o.ask !== 'never' ? [['times it asked you', asked] as [string, number]] : []), ['proof it works', o.run ? 'tests pass' : 'none']]);
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
    run: (ctx, val) => { ctx.mem.run = val === 'on'; play(ctx); },
  },
};
