// Chapter 4: write it down. The window is emptied between sessions; a file in the project is not.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, lab, worked } from '../presets';
import { route, reverse, rulesSpot, type XY } from '../picture';

const labels = [lab('you', 'you', 'left'), lab('a0', 'the model'), lab('rules', 'AGENTS.md', 'bottom', 'wiki/agents-md/'), lab('project', 'your project')];
const base = (rules: boolean, size = 4, skills = 0) => {
  const s = solo({ tools: true, project: { rules: rules ? 'plain' : 'none', skills }, labels: skills ? [...labels, lab('skills', 'skills', 'bottom', 'wiki/skill/')] : labels });
  s.agents[0]!.blocks = [];
  (s as any).rulesSize = size;
  return s;
};

/** A new session: the window is empty, then the file (if there is one) is loaded before you speak. */
export async function session(ctx: Ctx, h: Script, o: { rules: boolean; size?: number; ask?: boolean }) {
  const size = o.size ?? 4;
  h.set((s) => { s.agents[0]!.blocks = []; s.agents[0]!.lamp = 'off'; s.project!.rules = o.rules ? 'plain' : 'none'; });
  ctx.say(null, 'A new session. The window starts empty.');
  await h.wait(700);
  if (o.rules) {
    const p = ctx.scene.state.project!;
    h.set((s) => { s.project!.rules = 'lit'; });
    ctx.say(null, 'Before your first word, the harness loads AGENTS.md.');
    await h.send(reverse(route.agentToRules(p)), 'rules');
    h.set((s) => { s.project!.rules = 'plain'; s.agents[0]!.blocks!.push({ t: 'rules', h: size }); });
    await h.wait(500);
  }
  ctx.stat([['taken by the file, every session', o.rules ? `${Math.round((size / 60) * 100)}% of the window` : 'nothing']]);
  if (o.ask === false) return;
  ctx.say('you', 'Add a page for each member.');
  await h.send(route.youToAgent(), 'you');
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 2.4 }); s.agents[0]!.busy = true; });
  await h.wait(600);
  const tools = ctx.scene.state.tools!;
  await h.send(route.agentToTool(tools, 'run'), 'model');
  h.set((s) => { s.tools!.on = 'run'; });
  await h.wait(450);
  await h.send(reverse(route.agentToTool(tools, 'run')), o.rules ? 'tool' : 'bad');
  h.set((s) => { s.tools!.on = null; s.agents[0]!.busy = false; s.agents[0]!.blocks!.push({ t: o.rules ? 'tool' : 'bad', h: 3 }); s.agents[0]!.lamp = o.rules ? 'ok' : 'bad'; });
  ctx.say('tool', o.rules ? 'pnpm test: 12 of 12 pass' : 'npm test: command fails, this project uses pnpm');
  await h.wait(500);
  ctx.say('model', o.rules ? 'Done, in the style the file asks for. Tests pass.' : 'Which package manager does this project use?');
  await h.send(reverse(route.youToAgent()), 'model');
}

const play = (ctx: Ctx, o: Parameters<typeof session>[2]) => void ctx.scene.run((h) => session(ctx, h, o));

export const memory: Chapter = {
  steps: {
    gone: {
      scene: () => { const s = base(false); s.agents[0]!.blocks = worked(12); return s; },
      enter: (ctx) => void ctx.scene.run(async (h) => {
        ctx.say(null, 'Yesterday’s session. It learned how this project works the slow way.');
        await h.wait(1600);
        await session(ctx, h, { rules: false });
      }),
    },
    file: { scene: () => base(true), enter: (ctx) => play(ctx, { rules: true }) },
    grow: {
      scene: () => base(true),
      enter: (ctx) => { ctx.mem.size = 4; ctx.say(null, 'Each rule you add is read at the start of every session from then on.'); ctx.stat([['taken by the file, every session', '7% of the window']]); },
    },
    skills: {
      scene: () => { const s = base(true, 4, 4); s.agents[0]!.blocks = [{ t: 'rules', h: 4 }, { t: 'rules', h: 1.3 }]; return s; },
      enter: (ctx) => { ctx.say(null, 'Four skills on the shelf. Only their names and one line each are in the window.'); },
    },
  },
  actions: {
    session: (ctx, val) => play(ctx, { rules: val === 'with' }),
    teach: (ctx) => void ctx.scene.run(async (h) => {
      const size = Math.min(28, (ctx.mem.size ?? 4) + 4);
      ctx.mem.size = size;
      ctx.say('you', 'That was wrong. Add the rule to AGENTS.md so it does not happen again.');
      await h.send(route.youToAgent(), 'you');
      const p = ctx.scene.state.project!;
      const to: XY[] = [[20, 0], [p.at[0] - 46, 0], rulesSpot(p)];
      await h.send(to, 'model');
      h.set((s) => { s.project!.rules = 'lit'; });
      await h.wait(500);
      await session(ctx, h, { rules: true, size, ask: false });
      ctx.say(null, size >= 28 ? 'A long file is read in full every session, whether today’s job needs it or not.' : 'One more rule, loaded every session from now on.');
    }),
    skill: (ctx) => void ctx.scene.run(async (h) => {
      const p = ctx.scene.state.project!;
      ctx.say('you', 'Make the member list into a PDF.');
      await h.send(route.youToAgent(), 'you');
      h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 2.4 }); s.agents[0]!.busy = true; });
      await h.wait(500);
      ctx.say('model', 'There is a skill for PDFs. Reading it now.');
      h.set((s) => { s.project!.skillOut = 1; });
      await h.send([[p.at[0] + 8, p.at[1] + 19], [p.at[0] - 46, 0], [20, 0]], 'rules');
      h.set((s) => { s.agents[0]!.blocks!.push({ t: 'rules', h: 7 }); s.agents[0]!.busy = false; });
      ctx.say(null, 'The full instructions enter the window only now, for the one job that needs them.');
    }),
  },
};
