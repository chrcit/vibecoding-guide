// Chapter 8 (Part 2): Write it down. AGENTS.md and skills persist across fresh windows.
import type { Chapter, Ctx } from '../chapter';
import { byLevel } from '../chapter';
import type { Script } from '../scene';
import { solo, lab, worked } from '../presets';
import { route, reverse, rulesSpot, type XY } from '../picture';

const labels = [lab('you', 'you', 'left'), lab('a0', 'the model', 'top', 'wiki/model/'), lab('rules', 'AGENTS.md', 'bottom', 'wiki/instruction-file/'), lab('project', 'your project')];
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
  await h.wait(650);
  if (o.rules) {
    const p = ctx.scene.state.project!;
    h.set((s) => { s.project!.rules = 'lit'; });
    ctx.say(null, 'Before your first word, the harness loads AGENTS.md.');
    await h.send(reverse(route.agentToRules(p)), 'rules');
    h.set((s) => { s.project!.rules = 'plain'; s.agents[0]!.blocks!.push({ t: 'rules', h: size }); });
    await h.wait(450);
  }
  ctx.stat([['taken by AGENTS.md every session', o.rules ? `${Math.round((size / 60) * 100)}% of the window` : 'nothing']]);
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
  await h.send(reverse(route.agentToTool(tools, 'run')), o.rules ? 'tool' : 'bad');
  h.set((s) => { s.tools!.on = null; s.agents[0]!.busy = false; s.agents[0]!.blocks!.push({ t: o.rules ? 'tool' : 'bad', h: 3 }); s.agents[0]!.lamp = o.rules ? 'ok' : 'bad'; });
  ctx.say('tool', o.rules
    ? byLevel(ctx.level, {
        plain: 'Checks pass, dates formatted DD.MM.YYYY, layout matches the rest of the site.',
        technical: 'pnpm tsc --noEmit && pnpm test: 14 of 14 unit tests pass.',
        engineer: 'pnpm verify: strict types green, domain boundary clean, 14/14 tests pass.',
      })
    : byLevel(ctx.level, {
        plain: 'Wrong date format and mismatched colours—it forgot yesterday’s preferences.',
        technical: 'npm test failed: this repo uses pnpm and vitest, not jest.',
        engineer: 'Imported DB client directly inside UI component—violated module boundary it forgot.',
      }));
  await h.wait(450);
  ctx.say('model', o.rules
    ? byLevel(ctx.level, {
        plain: 'Done, in the exact style your file asks for.',
        technical: 'Done. Ran pnpm tsc --noEmit and unit tests as AGENTS.md specifies.',
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
        ctx.model(
          'Fresh windows forget.',
          byLevel(ctx.level, {
            plain: 'Starting a fresh thread avoids context rot, which means every rule you only said in chat disappears unless it is saved in a file.',
            technical: 'Because stateless threads reset between jobs, repo-wide commands (package manager, typecheck, unit tests) have to live on disk, not in chat history.',
            engineer: 'Fresh contexts eliminate rot only if persistent invariants live in version-controlled project files loaded deterministically at session boot.',
          }),
        );
        void ctx.scene.run(async (h) => {
          ctx.say(null, 'Yesterday’s session. It learned how this project works the slow way.');
          await h.wait(1400);
          await session(ctx, h, { rules: false });
        });
      },
    },
    file: {
      scene: () => base(true),
      enter: (ctx) => {
        ctx.model(
          'AGENTS.md (persistent project memory).',
          byLevel(ctx.level, {
            plain: 'A short plain-English note in your project folder that loads automatically before your first message—write down your preferences once so every new thread obeys them.',
            technical: 'Put your exact stack, folder map, `tsc --noEmit`, lint and unit-test commands in AGENTS.md so every fresh thread verifies identically from turn one.',
            engineer: 'Keep AGENTS.md to high-signal architecture decisions, module boundaries, stack constraints and verification commands—versioned in git alongside the code.',
          }),
        );
        play(ctx, { rules: true });
      },
    },
    grow: {
      scene: () => base(true),
      enter: (ctx) => {
        ctx.mem.size = 4;
        ctx.model(
          'Keep it short or it rots every window.',
          byLevel(ctx.level, {
            plain: 'Every line in AGENTS.md is loaded on EVERY job. Keep only the rules that matter everywhere—delete old notes once they stop being useful.',
            technical: 'Bloated instruction files tax every turn’s tokens and dilute attention. Add a rule only when an agent repeats a real mistake; prune aggressively.',
            engineer: 'Instruction files sit at the top of every prompt prefix—keep them terse, concrete and non-contradictory; push task-specific playbooks into on-demand skills.',
          }),
        );
        ctx.say(null, 'Each rule you add is read at the start of every session from then on.');
        ctx.stat([['taken by AGENTS.md every session', '7% of the window']]);
      },
    },
    skills: {
      scene: () => { const s = base(true, 4, 4); s.agents[0]!.blocks = [{ t: 'rules', h: 4 }, { t: 'rules', h: 1.3 }]; return s; },
      enter: (ctx) => {
        ctx.model(
          'Skills (on-demand playbooks).',
          byLevel(ctx.level, {
            plain: 'Skills sit on a shelf with just a one-line label. The agent only opens a skill (like “build a PDF” or “audit security”) on the job that actually needs it.',
            technical: 'Skills use progressive disclosure: only name + one-line trigger enter every prompt, keeping baseline context lean until a matching task loads the full checklist.',
            engineer: 'Separate always-on invariants (AGENTS.md) from conditional procedures (Skills) so specialized workflows (audits, migrations, UI polish) add zero token overhead when unused.',
          }),
        );
        ctx.say(null, 'Four skills on the shelf. Only their names and one line each are in the window.');
      },
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
      await h.wait(450);
      await session(ctx, h, { rules: true, size, ask: false });
      ctx.say(null, size >= 28 ? 'A long file is read in full every session, whether today’s job needs it or not—and starts rotting every new thread.' : 'One more rule, loaded every session from now on.');
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
