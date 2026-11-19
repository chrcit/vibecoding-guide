// Chapter 8 (Part 2): Write it down. AGENTS.md and skills persist across fresh windows.
import type { Chapter, Ctx } from '../chapter';
import { byLevel } from '../chapter';
import type { Script } from '../scene';
import { solo, lab, worked } from '../presets';
import { termLabel } from '../terms';
import { route, reverse, rulesSpot, type XY } from '../picture';

const labels = [lab('you', 'you', 'left'), termLabel('a0', 'model', 'top', 'the model'), termLabel('rules', 'instructions', 'bottom'), termLabel('project', 'project')];
const base = (rules: boolean, size = 4, skills = 0) => {
  const s = solo({ tools: true, project: { rules: rules ? 'plain' : 'none', skills }, labels: skills ? [...labels, lab('skills', 'skills', 'bottom', 'wiki/skill/')] : labels });
  s.agents[0]!.blocks = [];
  (s as any).rulesSize = size;
  return s;
};

/** How many lines the file has at a given size on the picture. Made up, roughly 12 lines a slab unit. */
const lines = (size: number) => (size <= 4 ? 12 : Math.round(size * 11 - 8));

/** A new session: the window is empty, then the file (if there is one) is loaded before you speak. */
export async function session(ctx: Ctx, h: Script, o: { rules: boolean; size?: number; ask?: boolean }) {
  const size = o.size ?? 4;
  h.set((s) => { s.agents[0]!.blocks = []; s.agents[0]!.lamp = 'off'; s.project!.rules = o.rules ? 'plain' : 'none'; });
  ctx.say(null, 'A new thread. The window starts empty.');
  await h.wait(650);
  if (o.rules) {
    const p = ctx.scene.state.project!;
    h.set((s) => { s.project!.rules = 'lit'; });
    ctx.say(null, 'Before your first word, the tool loads AGENTS.md into the window.');
    await h.send(reverse(route.agentToRules(p)), 'rules');
    h.set((s) => { s.project!.rules = 'plain'; s.agents[0]!.blocks!.push({ t: 'rules', h: size }); });
    await h.wait(450);
  }
  const long = o.rules && size >= 20;
  ctx.stat([['AGENTS.md', o.rules ? `${lines(size)} lines, read in every thread` : 'none'], ['the job', '…']]);
  if (o.ask === false) return;
  ctx.say('you', byLevel(ctx.level, {
    plain: 'Add a profile page for each member.',
    technical: 'Add a member detail route, keep types strict and run the test suite.',
    engineer: 'Add `/members/[id]` following our domain-module boundary and verify types + tests.',
  }));
  await h.send(route.youToAgent(), 'you');
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 2.4 }); s.agents[0]!.busy = true; });
  await h.wait(550);
  const tools = ctx.scene.state.tools!;
  await h.send(route.agentToTool(tools, 'run'), 'model');
  h.set((s) => { s.tools!.on = 'run'; });
  await h.wait(420);
  const good = o.rules && !long;
  await h.send(reverse(route.agentToTool(tools, 'run')), good ? 'tool' : 'bad');
  h.set((s) => { s.tools!.on = null; s.agents[0]!.busy = false; s.agents[0]!.blocks!.push({ t: good ? 'tool' : 'bad', h: 3 }); s.agents[0]!.lamp = good ? 'ok' : 'bad'; });
  ctx.stat([['AGENTS.md', o.rules ? `${lines(size)} lines, read in every thread` : 'none'], ['the job', good ? 'followed your rules' : long ? 'missed a rule in the middle of the file' : 'guessed, and guessed wrong']]);
  if (long) {
    ctx.say('tool', byLevel(ctx.level, {
      plain: 'The new page shows dates as 3/3/2026. The rule for day.month.year is on line 140.',
      technical: 'npx jest: no tests found. Line 140 says the tests run with npm test (vitest).',
      engineer: 'UI component imports the database client directly. The boundary rule is on line 140.',
    }));
    await h.wait(450);
    ctx.say('model', 'Done.');
    await h.send(reverse(route.youToAgent()), 'bad');
    return;
  }
  ctx.say('tool', o.rules
    ? byLevel(ctx.level, {
        plain: 'Checks pass, dates formatted DD.MM.YYYY, layout matches the rest of the site.',
        technical: 'npm run check (tsc --noEmit && vitest run): 14 of 14 unit tests pass.',
        engineer: 'npm run check: types clean, domain boundary clean, 14 of 14 tests pass.',
      })
    : byLevel(ctx.level, {
        plain: 'Dates show as 3/3/2026 and the colours do not match the rest of the site: yesterday’s choices are gone.',
        technical: 'npx jest: no tests found. This repo runs vitest through npm test.',
        engineer: 'UI component imports the database client directly: the module boundary it learned yesterday is gone.',
      }));
  await h.wait(450);
  ctx.say('model', o.rules
    ? byLevel(ctx.level, {
        plain: 'Done, in the exact style your file asks for.',
        technical: 'Done. Ran npm run check, as AGENTS.md says.',
        engineer: 'Done within domain boundaries. Full verification script green.',
      })
    : byLevel(ctx.level, {
        plain: 'Which date format and layout style do you want?',
        technical: 'Which package manager and test command does this repo use?',
        engineer: 'Where does data fetching belong in this codebase?',
      }));
  await h.send(reverse(route.youToAgent()), 'model');
}

const play = (ctx: Ctx, o: Parameters<typeof session>[2]) => void ctx.scene.run((h) => session(ctx, h, o));

export const memory: Chapter = {
  steps: {
    gone: {
      scene: () => { const s = base(false); s.agents[0]!.blocks = worked(12); return s; },
      enter: (ctx) => {
        void ctx.scene.run(async (h) => {
          ctx.say(null, 'Yesterday’s thread. It learned how this project works the slow way.');
          await h.wait(1400);
          await session(ctx, h, { rules: false });
        });
      },
    },
    file: {
      scene: () => base(true),
      enter: (ctx) => {
        play(ctx, { rules: true });
      },
    },
    grow: {
      scene: () => base(true),
      enter: (ctx) => {
        ctx.mem.size = 4;
        ctx.say(null, 'Each rule you add is read at the start of every thread from then on. Press the button three times.');
        ctx.stat([['AGENTS.md', `${lines(4)} lines, read in every thread`], ['the job', 'not run yet']]);
      },
    },
    skills: {
      scene: () => { const s = base(true, 4, 4); s.agents[0]!.blocks = [{ t: 'rules', h: 4 }, { t: 'rules', h: 1.3 }]; return s; },
      enter: (ctx) => {
        ctx.say(null, 'Four skills on the shelf. Only their names and one line each are in the window.');
      },
    },
  },
  actions: {
    session: (ctx, val) => play(ctx, { rules: val === 'with' }),
    teach: (ctx) => void ctx.scene.run(async (h) => {
      const size = Math.min(28, (ctx.mem.size ?? 4) + 6);
      ctx.mem.size = size;
      ctx.say('you', 'That was wrong. Add the rule to AGENTS.md so it does not happen again.');
      await h.send(route.youToAgent(), 'you');
      const p = ctx.scene.state.project!;
      const to: XY[] = [[20, 0], [p.at[0] - 46, 0], rulesSpot(p)];
      await h.send(to, 'model');
      h.set((s) => { s.project!.rules = 'lit'; });
      await h.wait(450);
      await session(ctx, h, { rules: true, size });
      if (size < 20) ctx.say(null, `One more rule: ${lines(size)} lines now, all read at the start of every thread.`);
      else ctx.say(null, `${lines(size)} lines, read in full in every thread. The rule that mattered today was one line in the middle, and it was missed.`);
    }),
    skill: (ctx) => void ctx.scene.run(async (h) => {
      const p = ctx.scene.state.project!;
      ctx.say('you', 'Make the member list into a PDF.');
      await h.send(route.youToAgent(), 'you');
      h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 2.4 }); s.agents[0]!.busy = true; });
      await h.wait(450);
      ctx.say('model', 'There is a skill for PDFs. Reading it now.');
      h.set((s) => { s.project!.skillOut = 1; });
      await h.send([[p.at[0] + 8, p.at[1] + 19], [p.at[0] - 46, 0], [20, 0]], 'rules');
      h.set((s) => { s.agents[0]!.blocks!.push({ t: 'rules', h: 7 }); s.agents[0]!.busy = false; });
      ctx.say(null, 'The full instructions enter the window only now, for the one job that needs them.');
    }),
  },
};
