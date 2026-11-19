// Chapter 4 (Part 1: Foundations): Your first real loop — an approachable bridge on laptop, desktop or phone.
import type { Chapter, Ctx } from '../chapter';
import { byLevel } from '../chapter';
import type { Script } from '../scene';
import { solo, jobs, lab } from '../presets';
import { route, reverse } from '../picture';

type SetupId = 'laptop' | 'desktop' | 'phone';
type IdeaId = 'club' | 'notes' | 'tool';

const SETUPS: Record<SetupId, { label: string; steps: string; stat: [string, string][]; model: Record<'plain' | 'technical' | 'engineer', string> }> = {
  laptop: {
    label: 'Laptop (most common)',
    steps: '1. Create an empty folder. 2. Open it in a coding agent app (like T3 Code, Claude Code or Codex). 3. Describe one small thing you want to see.',
    stat: [['time to start', '~5 minutes'], ['accounts needed', '1 AI plan (or free tier)'], ['where app runs', 'localhost on your laptop']],
    model: {
      plain: 'You do not need to learn a programming language first. Open a fresh folder in an agent app, speak or type what you want, and let the agent set up the starter files.',
      technical: 'Run `git init`, open the repo in T3 Code or Claude Code, and ask the agent to scaffold a minimal typed app with a single `npm test` + `tsc --noEmit` check script.',
      engineer: 'Initialize a clean repo with strict TypeScript, fast unit test runner (Vitest), and a 15-line AGENTS.md before the first feature prompt so conventions stick from turn 1.',
    },
  },
  desktop: {
    label: 'Desktop PC',
    steps: '1. Same 5-minute setup on your desk machine. 2. Keep it awake so longer tasks finish cleanly. 3. Connect from your laptop or phone later when away from your desk.',
    stat: [['time to start', '~5 minutes'], ['big win', 'stays awake & runs faster'], ['remote ready', 'yes (phone or laptop)']],
    model: {
      plain: 'A desktop PC gives you a bigger screen to view your app side by side with the agent—and it can keep running jobs even when you walk away.',
      technical: 'Ideal primary host for multi-worktree runs, local Postgres/Docker containers and long test suites without throttling or lid-close pauses.',
      engineer: 'Anchor your main dev environment on the desktop box with declarative setup scripts so phone/laptop sessions act as thin controllers into a stable workspace.',
    },
  },
  phone: {
    label: 'Phone first',
    steps: '1. Start in a web builder (Lovable, v0, Replit) OR record a 2-minute voice spec to send to your desktop agent. 2. Inspect live preview links right in your mobile browser.',
    stat: [['time to start', '1 minute'], ['best for', 'voice specs, previews & quick prototypes'], ['next step', 'pull into git on laptop/PC']],
    model: {
      plain: 'If you only have your phone right now, you can still start: talk through your idea by voice or build a quick first prototype in a web builder—then bring it to a laptop when it grows.',
      technical: 'Use phone voice capture for specs and web builders (or GitHub-connected cloud agents) for prototypes, exporting to a real git repo once you need unit tests and control.',
      engineer: 'Treat mobile as an async capture and review surface (voice specs, preview QA, plan approval); graduate prototypes into git + CI before complexity compounds.',
    },
  },
};

function runSetup(ctx: Ctx, id: SetupId) {
  const s = SETUPS[id];
  ctx.model(`${s.label}.`, s.model[ctx.level]);
  void ctx.scene.run(async (h) => {
    h.set((st) => Object.assign(st, jobs(1, {
      gap: 84,
      machines: [id === 'laptop' ? 'laptop' : id === 'desktop' ? 'box' : 'cloud'],
      trees: false,
      labels: [
        lab('you', id === 'phone' ? 'you (phone)' : 'you', 'left'),
        lab('j0', id === 'phone' ? 'cloud / remote agent' : 'coding agent', 'top', 'wiki/agent/'),
        lab('zone:0', s.label, 'bottom'),
        lab('project', 'fresh folder', 'top'),
      ],
    })));
    ctx.stat(s.stat);
    ctx.say(null, s.steps);
    h.set((st) => { st.agents[0]!.blocks = [{ t: 'you', h: 3 }]; st.agents[0]!.lamp = 'ok'; });
  });
}

const IDEAS: Record<IdeaId, { title: string; prompt: Record<'plain' | 'technical' | 'engineer', string>; out: string }> = {
  club: {
    title: 'A club members list',
    prompt: {
      plain: 'Build a simple web page for our 40-person football club: show member names, whether they paid this season, and a search box. Use fake sample data so I can click through it right away.',
      technical: 'Scaffold a Vite + TypeScript app for a club members list (search + paid filter + local JSON fixture). Add Vitest unit tests for the filter logic and verify `tsc --noEmit` + tests pass.',
      engineer: 'Create a minimal TypeScript web app separating pure domain logic (`src/members.ts` with strict types + unit tests) from thin UI rendering. Keep dependencies minimal and write a short AGENTS.md.',
    },
    out: 'Working members page with search, paid filter and 20 realistic sample members.',
  },
  notes: {
    title: 'A clean invoice or notes page',
    prompt: {
      plain: 'Build a one-page invoice maker where I type line items, see the total update live, and click Print / Save as PDF. Keep the layout calm and clean.',
      technical: 'Build a static TypeScript invoice calculator with live totals, tax calculation unit tests, and print CSS. Run `tsc --noEmit` and unit tests before showing the preview.',
      engineer: 'Implement deterministic currency math in integer cents (`src/calc.ts`, 100% unit-tested), zero-backend static build, and clean `@media print` stylesheet.',
    },
    out: 'Live invoice calculator with instant totals and clean PDF print layout.',
  },
  tool: {
    title: 'A small everyday helper',
    prompt: {
      plain: 'Build a small tool where I paste a messy CSV of expenses and it groups them by category with a clean monthly summary table.',
      technical: 'Create a TypeScript CSV expense categorizer with pure parser + aggregator functions, edge-case unit tests (quoted commas, empty rows), and a clean browser UI.',
      engineer: 'Build a client-side CSV parser & categorizer with strict schema validation, pure functional aggregation, unit tests covering malformed rows, and zero server uploads for privacy.',
    },
    out: 'Browser CSV expense grouper—runs privately in your browser with instant totals.',
  },
};

function runIdea(ctx: Ctx, id: IdeaId) {
  const idea = IDEAS[id];
  ctx.model(
    'Start small and real.',
    byLevel(ctx.level, {
      plain: 'Pick one real problem you care about that fits on one screen. A small working app in 10 minutes teaches more than reading for a week.',
      technical: 'Start with a small vertical slice that has deterministic logic you can unit-test (`tsc --noEmit` + `vitest`) and a real UI you can click in the browser.',
      engineer: 'Choose a narrow vertical slice with clean domain-vs-UI separation so your very first repo establishes the verification loop and module hygiene you will scale later.',
    }),
  );
  void ctx.scene.run(async (h) => {
    h.set((s) => Object.assign(s, solo({
      tools: true,
      project: true,
      gate: true,
      labels: [
        lab('you', 'you', 'left'),
        lab('a0', 'coding agent', 'top', 'wiki/agent/'),
        lab('project', idea.title, 'top'),
        lab('gate', 'check', 'right', 'wiki/verification/'),
      ],
    })));
    ctx.stat([['first project', idea.title], ['scope', '1 screen · 10 mins'], ['safety', 'fresh folder + git']]);
    ctx.say('you', idea.prompt[ctx.level]);
    await h.send(route.youToAgent(), 'you', { ms: 420 });
    h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 3.5 }]; s.agents[0]!.lamp = 'work'; });
  });
}

async function runFirstLoop(ctx: Ctx, h: Script) {
  ctx.model(
    'Your first complete loop.',
    byLevel(ctx.level, {
      plain: 'Ask → agent builds → agent checks → you open the live page and try clicking it. That four-beat rhythm is the foundation of everything in the rest of this guide.',
      technical: 'Prompt → inspect & edit → `tsc --noEmit` & unit tests → live preview check. Every chapter in Parts 2 and 3 scales one part of this exact loop.',
      engineer: 'Specification → bounded tool execution → deterministic verification gate → human behavioral inspection. Master this single-agent loop before adding parallelism.',
    }),
  );
  h.set((s) => Object.assign(s, solo({
    tools: true,
    project: { rules: 'plain', commits: ['ok'] },
    gate: true,
    tray: [{ id: 'preview', mark: 'work' }],
    labels: [
      lab('you', 'you', 'left'),
      lab('a0', 'agent', 'top', 'wiki/agent/'),
      lab('tools', 'tools', 'top', 'wiki/tool-call/'),
      lab('project', 'your app', 'top'),
      lab('gate', 'check', 'right', 'wiki/verification/'),
      lab('tray', 'live preview', 'right', 'wiki/preview-deployment/'),
    ],
  })));
  ctx.stat([['beat', '1. describe'], ['files created', 0], ['check', 'waiting']]);
  ctx.say('you', IDEAS.club.prompt[ctx.level]);
  await h.send(route.youToAgent(), 'you', { ms: 380 });
  h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 3 }]; s.agents[0]!.lamp = 'work'; });
  for (const [tool, file, n] of [['edit', 0, 1], ['edit', 1, 2], ['edit', 2, 3], ['run', -1, 3]] as const) {
    h.set((s) => { s.agents[0]!.busy = true; s.tools!.on = tool; if (file >= 0) { const f = (s.project!.files ??= ['', '', '', '', '', '']); f[file] = 'edit'; } });
    ctx.stat([['beat', tool === 'run' ? '3. check' : '2. build'], ['files created', n], ['check', tool === 'run' ? 'running…' : 'waiting']]);
    await h.wait(420);
    h.set((s) => { s.agents[0]!.busy = false; s.tools!.on = null; s.agents[0]!.blocks!.push({ t: 'tool', h: 2.5 }); });
  }
  await h.send(route.agentToGate(), 'model', { ms: 320 });
  h.set((s) => { s.gates![0]!.lamp = 'ok'; s.agents[0]!.lamp = 'ok'; s.tray!.cards = [{ id: 'preview', mark: 'ok' }]; s.project!.commits = ['ok', 'ok']; });
  await h.send(route.gateToYou(), 'model', { ms: 320 });
  ctx.stat([['beat', '4. try it yourself'], ['files created', 3], ['check', byLevel(ctx.level, { plain: 'page opens cleanly', technical: 'tsc + 8/8 tests green', engineer: 'strict types + tests + build green' })]]);
  ctx.say('agent', byLevel(ctx.level, {
    plain: 'Done! Open the preview link—20 sample club members are loaded, search and paid filter both work.',
    technical: 'Built with Vite + TypeScript. `tsc --noEmit` clean, 8/8 Vitest unit tests pass, dev server live at localhost:5173.',
    engineer: 'Scaffolded `members.ts` domain module + UI + unit tests. Strict typecheck and test suite green; committed cleanly.',
  }));
}

async function runTweak(ctx: Ctx, h: Script, steered = false) {
  ctx.model(
    'One small tweak at a time.',
    byLevel(ctx.level, {
      plain: 'The first version is never the final version. Point at one concrete thing (“make the Unpaid badge red and add a count at the top”) instead of asking for ten changes at once.',
      technical: 'Keep follow-up prompts atomic: one behavior change + one regression test + one commit. Small loops stay fast and easy to undo.',
      engineer: 'Iterative vertical refinements keep diffs small, context windows clean, and verification fast—now you are ready to look under the hood in Part 2.',
    }),
  );
  h.set((s) => Object.assign(s, solo({
    tools: true,
    project: { rules: 'plain', commits: ['ok', 'ok'] },
    gate: true,
    labels: [
      lab('you', 'you', 'left'),
      lab('a0', 'agent', 'top', 'wiki/agent/'),
      lab('project', 'your app', 'top'),
      lab('gate', 'check', 'right', 'wiki/verification/'),
    ],
  })));
  if (!steered) {
    ctx.stat([['turn', 'follow-up tweak'], ['changes requested', '1 specific tweak'], ['commit', 'ready']]);
    ctx.say('you', byLevel(ctx.level, {
      plain: 'Nice! One tweak: show a counter at the top like “14 of 20 paid” and highlight unpaid rows.',
      technical: 'Add a `countPaid(members)` helper with a unit test, render “14 of 20 paid” in the header, and re-run `tsc` + `vitest`.',
      engineer: 'Expose pure `summarizePayments(members)` in `members.ts`, add edge-case tests (0 members, all paid), wire header summary.',
    }));
  } else {
    await h.send(route.youToAgent(), 'you', { ms: 340 });
    h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 2.5 }, { t: 'tool', h: 3 }]; s.agents[0]!.lamp = 'work'; });
    await h.wait(450);
    await h.send(route.agentToGate(), 'model', { ms: 300 });
    h.set((s) => { s.gates![0]!.lamp = 'ok'; s.agents[0]!.lamp = 'ok'; s.project!.commits = ['ok', 'ok', 'ok']; });
    await h.send(route.gateToYou(), 'model', { ms: 300 });
    ctx.stat([['turn', 'tweak landed'], ['diff', '18 lines'], ['check', 'green']]);
    ctx.say('agent', 'Updated! Header now shows “14 of 20 paid” and unpaid rows stand out clearly.');
  }
}

export async function demo(ctx: Ctx, h: Script) {
  await runFirstLoop(ctx, h);
}

export const firstCh: Chapter = {
  steps: {
    setup: { scene: () => jobs(1, { gap: 84, machines: ['laptop'], trees: false }), enter: (ctx) => runSetup(ctx, 'laptop') },
    project: { scene: () => solo({ tools: true, project: true, gate: true }), enter: (ctx) => runIdea(ctx, 'club') },
    run: { scene: () => solo({ tools: true, project: true, gate: true }), enter: (ctx) => void ctx.scene.run((h) => runFirstLoop(ctx, h)) },
    tweak: { scene: () => solo({ tools: true, project: true, gate: true }), enter: (ctx) => void ctx.scene.run((h) => runTweak(ctx, h, false)) },
  },
  actions: {
    setup: (ctx, val) => runSetup(ctx, val as SetupId),
    idea: (ctx, val) => runIdea(ctx, val as IdeaId),
    tweak: (ctx) => void ctx.scene.run((h) => runTweak(ctx, h, true)),
  },
};
