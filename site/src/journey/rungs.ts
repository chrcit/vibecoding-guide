// The steps of the journey, in order. Each adds one thing to the same mental model.
// Part one lays the foundations before your first line of code.
// Part two grows the agents, from one chat to twenty in a loop.
// Part three grows the working week around them: cost, review, proof, your turn, growth, people, machines.
import type { Level } from '../lib/levels';

export type LessonTheme = 'foundations' | 'core' | 'quality' | 'scale';

export interface Rung {
  id: string;
  n: number;
  part: 1 | 2 | 3;
  title: string;
  short: string;
  line: string;
  theme: LessonTheme;
  /** Concrete addition to the mental model, tuned to the reader's chosen level. */
  adds: Record<Level, string>;
  /** Direct jump targets inside this chapter's interactive page. */
  steps: { id: string; label: string }[];
  /** Wiki concepts that open in the side drawer without leaving the guide. */
  concepts: { slug: string; label: string }[];
}

export interface Part {
  n: 1 | 2 | 3;
  title: string;
  short: string;
  range: string;
  blurb: string;
  href: string;
  chapter: string;
}

export const parts: Part[] = [
  {
    n: 1,
    title: 'Before your first code',
    short: 'Part one · Foundations',
    range: '1–4',
    blurb: 'What AI is, Chat vs Work vs Coding Agent, providers and where models run, Git and cloud hosting, and your first real loop on a laptop, desktop or phone.',
    href: 'journey/foundations/',
    chapter: 'foundations',
  },
  {
    n: 2,
    title: 'From one chat to twenty agents',
    short: 'Part two · The agents',
    range: '5–13',
    blurb: 'One chat, tool loops, context windows and context rot, memory files, automated checks, helpers, parallel worktrees, leads and fleets.',
    href: 'journey/agents/',
    chapter: 'whole',
  },
  {
    n: 3,
    title: 'From one job to a working week',
    short: 'Part three · The working week',
    range: '14–21',
    blurb: 'Tokens and billing, adversarial second-model review, readable proof, stepping in, parallel jobs, keeping a growing codebase healthy, teams and remote machines.',
    href: 'journey/week/',
    chapter: 'week',
  },
];

export const rungs: Rung[] = [
  // ---------- Part 1: Foundations ----------
  {
    id: 'ai',
    n: 1,
    part: 1,
    title: 'What AI can do',
    short: 'AI modes',
    line: 'Text, voice, images, video and reasoning—and what changes between Chat, Work and Coding Agent modes.',
    theme: 'foundations',
    adds: {
      plain: 'Know when a quick chat is enough, when Work mode helps with files and decisions, and when to switch to a coding agent that actually builds the app.',
      technical: 'Distinguish stateless chat completions, tool-assisted Work workspaces (search, files, voice/vision), and autonomous coding harnesses that edit, typecheck and run tests.',
      engineer: 'Map capability surfaces (multimodal I/O, structured tool calling, sandboxed execution) to failure modes and verification boundaries before picking a runtime.',
    },
    steps: [
      { id: 'predict', label: 'How it works' },
      { id: 'senses', label: 'Voice, vision & decisions' },
      { id: 'modes', label: 'Chat vs Work vs Agent' },
      { id: 'bridge', label: 'Why code is different' },
    ],
    concepts: [
      { slug: 'model', label: 'Model' },
      { slug: 'agent', label: 'Agent' },
      { slug: 'voice-input', label: 'Voice input' },
      { slug: 'token', label: 'Token' },
    ],
  },
  {
    id: 'providers',
    n: 2,
    part: 1,
    title: 'Providers and where AI runs',
    short: 'Providers',
    line: 'Anthropic, OpenAI, Google and local models—where the thinking runs versus where your files live.',
    theme: 'foundations',
    adds: {
      plain: 'The AI brain usually runs in a provider’s data centre while your project files stay on your own laptop or desktop—and your phone can steer it remotely.',
      technical: 'Separate inference location (provider API/plan vs local GPU) from execution surface (web app, desktop harness, CLI, API) and local workspace files.',
      engineer: 'Evaluate provider lock-in, data-residency boundaries, harness abstractions (T3 Code, Claude Code, Codex), and latency/privacy trade-offs between cloud and local weights.',
    },
    steps: [
      { id: 'labs', label: 'The providers' },
      { id: 'where-brain', label: 'Where it runs' },
      { id: 'surfaces', label: 'Web, app, CLI & API' },
      { id: 'devices', label: 'Laptop, desktop & phone' },
    ],
    concepts: [
      { slug: 'harness', label: 'Harness' },
      { slug: 'agentic-development-environment', label: 'Agentic IDE' },
      { slug: 'work-data-privacy', label: 'Data privacy' },
      { slug: 'api', label: 'API' },
    ],
  },
  {
    id: 'stack',
    n: 3,
    part: 1,
    title: 'Git, GitHub and the cloud',
    short: 'Git & cloud',
    line: 'Save points you can always undo, static sites versus dynamic servers with databases, and picking the right size.',
    theme: 'foundations',
    adds: {
      plain: 'Git is your unlimited undo button, GitHub is your safe cloud copy, static hosting is free and simple for pages, and dynamic hosting adds a server and database when users log in or save data.',
      technical: 'Commit before every agent run, push branches to GitHub for diffs and rollbacks, and choose static deploys (CDN) vs dynamic runtimes (Node/Postgres/env secrets) by state requirements.',
      engineer: 'Treat git history as the transaction log for agent mutations, isolate secrets and preview environments per branch, and match compute/database topology and specs to workload profile.',
    },
    steps: [
      { id: 'git', label: 'Git & safe undo' },
      { id: 'github', label: 'GitHub & branches' },
      { id: 'hosting', label: 'Static vs dynamic' },
      { id: 'specs', label: 'Servers & specs' },
    ],
    concepts: [
      { slug: 'version-control', label: 'Version control' },
      { slug: 'branch', label: 'Branch' },
      { slug: 'how-the-web-works', label: 'How the web works' },
      { slug: 'deployment', label: 'Deployment' },
      { slug: 'database', label: 'Database' },
    ],
  },
  {
    id: 'first',
    n: 4,
    part: 1,
    title: 'Your first real loop',
    short: 'First loop',
    line: 'An easy bridge from idea to working app across your phone, laptop or desktop PC—without guesswork.',
    theme: 'foundations',
    adds: {
      plain: 'Pick one small real thing to build, talk through the idea on phone or laptop, let the agent build a first version in a fresh folder, open it, and ask for one tweak at a time.',
      technical: 'Initialise a git repo, pick a simple typed stack with a built-in test runner, ask the agent to inspect before editing, and verify every turn with typecheck + tests + live preview.',
      engineer: 'Bootstrap a clean repository with strict TypeScript, unit test harness, AGENTS.md conventions and an isolated branch so every subsequent agent loop starts reproducible.',
    },
    steps: [
      { id: 'setup', label: 'Pick your device' },
      { id: 'project', label: 'One small real job' },
      { id: 'run', label: 'Watch the first loop' },
      { id: 'tweak', label: 'Check & steer' },
    ],
    concepts: [
      { slug: 'prompt', label: 'Prompt' },
      { slug: 'web-builders', label: 'Web builders' },
      { slug: 'preview-deployment', label: 'Preview link' },
    ],
  },

  // ---------- Part 2: The Agents ----------
  {
    id: 'chat',
    n: 5,
    part: 2,
    title: 'One chat',
    short: 'Chat',
    line: 'You type, it answers. The window is everything it knows—there is no memory outside it.',
    theme: 'core',
    adds: {
      plain: 'Every reply is generated fresh from the messages currently in the window; start a new chat and it remembers nothing from before.',
      technical: 'LLMs are stateless functions over the full prompt transcript; every turn resends the entire conversation history.',
      engineer: 'Model inference is a pure pass over the token sequence in the context window—state exists only insofar as your harness serializes it back into the prompt.',
    },
    steps: [
      { id: 'two', label: 'Two parts' },
      { id: 'send', label: 'One exchange' },
      { id: 'reread', label: 'Full re-read' },
      { id: 'fresh', label: 'New chat resets' },
    ],
    concepts: [
      { slug: 'model', label: 'Model' },
      { slug: 'context-window', label: 'Context window' },
      { slug: 'thread', label: 'Thread' },
    ],
  },
  {
    id: 'loop',
    n: 6,
    part: 2,
    title: 'It gets hands',
    short: 'Loop',
    line: 'Give it tools to read, edit, search and run commands and it keeps working on its own until done.',
    theme: 'core',
    adds: {
      plain: 'Instead of copying code out of a chat box, the agent opens your files, edits them, runs the app, sees errors and fixes them in a loop.',
      technical: 'The harness executes tool calls (read, edit, search, shell) and feeds stdout/stderr back into the prompt so the agent iterates until typecheck and tests pass.',
      engineer: 'An agent is a model wrapped in a tool-execution loop with permission boundaries—its autonomy depends on fast, deterministic tool feedback.',
    },
    steps: [
      { id: 'hands', label: 'Give it tools' },
      { id: 'fix', label: 'Watch it loop' },
      { id: 'norun', label: 'Without run' },
      { id: 'ask', label: 'When it asks you' },
    ],
    concepts: [
      { slug: 'agent-loop', label: 'Agent loop' },
      { slug: 'tool-call', label: 'Tool call' },
      { slug: 'permission-mode', label: 'Permissions' },
    ],
  },
  {
    id: 'window',
    n: 7,
    part: 2,
    title: 'The window fills (and rots)',
    short: 'Window & rot',
    line: 'Everything it reads stays in the window. Long before it hits 100%, unrelated noise rots attention and lowers quality.',
    theme: 'core',
    adds: {
      plain: 'Bigger windows still get foggy when packed with old chat, giant error logs and unrelated tasks—start a fresh thread for each new job so the agent stays sharp.',
      technical: 'Context rot happens well below the token cap: stale debugging traces and unrelated files dilute attention, causing missed constraints and flaky edits. Compact or start fresh.',
      engineer: 'Transformer attention degrades with irrelevant distractors even inside 1M-token windows; keep signal-to-noise high via task-scoped threads, targeted reads and explicit handoff notes.',
    },
    steps: [
      { id: 'pile', label: 'Nothing leaves' },
      { id: 'rot', label: 'Context rot' },
      { id: 'long', label: 'Scale vs cap' },
      { id: 'compact', label: 'Compact vs fresh' },
      { id: 'paste', label: 'One giant paste' },
    ],
    concepts: [
      { slug: 'context-window', label: 'Context window' },
      { slug: 'compaction', label: 'Compaction' },
      { slug: 'token', label: 'Token' },
    ],
  },
  {
    id: 'memory',
    n: 8,
    part: 2,
    title: 'Write it down',
    short: 'Memory',
    line: 'A short instruction file loaded at the start of every session outlives any single window.',
    theme: 'core',
    adds: {
      plain: 'Keep a short AGENTS.md in your project with plain rules you got tired of repeating, so every new thread already knows how your app should look and behave.',
      technical: 'Put exact build, typecheck (`tsc --noEmit`), lint and unit-test commands plus folder conventions in AGENTS.md so every fresh session verifies the same way.',
      engineer: 'Encode non-obvious architecture boundaries, stack invariants, schema ownership and forbidden patterns in concise, high-signal instruction files—never bloated walls of prose.',
    },
    steps: [
      { id: 'gone', label: 'New thread forgets' },
      { id: 'file', label: 'AGENTS.md loads first' },
      { id: 'grow', label: 'Keep it crisp' },
      { id: 'skills', label: 'On-demand skills' },
    ],
    concepts: [
      { slug: 'instruction-file', label: 'Instruction file' },
      { slug: 'skill', label: 'Skill' },
    ],
  },
  {
    id: 'check',
    n: 9,
    part: 2,
    title: 'Make it prove it',
    short: 'Check',
    line: 'Nothing counts as done until an automated check—tests, types, or a real browser check—passes.',
    theme: 'quality',
    adds: {
      plain: 'Never trust “done” on its own—ask the agent to open the real page, test the clicks and fix any broken button before handing it back to you.',
      technical: 'Wire a verification gate (`tsc --noEmit` + unit/integration test suite + linter) so the agent cannot declare completion while types or tests are red.',
      engineer: 'Design fast, deterministic verification gates covering type contracts, unit/integration invariants and browser E2E checks so autonomous loops self-correct before human review.',
    },
    steps: [
      { id: 'done', label: 'Without a check' },
      { id: 'tests', label: 'Add a check gate' },
      { id: 'more', label: 'Types, tests & browser' },
    ],
    concepts: [
      { slug: 'verification', label: 'Verification' },
      { slug: 'test', label: 'Tests' },
      { slug: 'browser-check', label: 'Browser check' },
      { slug: 'limits-of-checking', label: 'Limits of checking' },
    ],
  },
  {
    id: 'handoff',
    n: 10,
    part: 2,
    title: 'A second agent',
    short: 'Handoff',
    line: 'Hand a noisy sub-task to a helper with an empty window and get back only the clean answer.',
    theme: 'scale',
    adds: {
      plain: 'Send a helper to read twenty messy files so your main thread stays clean and focused on building what you asked for.',
      technical: 'Isolate heavy codebase searches, log triage or test-failure investigations in a subagent so raw file dumps never rot the parent context window.',
      engineer: 'Use subagents as context firewalls: pass a minimal brief, burn read tokens in an ephemeral child window, and return a structured summary with file:line references.',
    },
    steps: [
      { id: 'alone', label: 'Search fills your window' },
      { id: 'hand', label: 'Delegate to a helper' },
      { id: 'brief', label: 'Brief carefully' },
    ],
    concepts: [
      { slug: 'subagent', label: 'Subagent' },
      { slug: 'context-window', label: 'Context window' },
    ],
  },
  {
    id: 'parallel',
    n: 11,
    part: 2,
    title: 'Side by side',
    short: 'Parallel',
    line: 'Several agents at once, each in its own isolated copy of the project so they never overwrite each other.',
    theme: 'scale',
    adds: {
      plain: 'Two agents editing the same folder will trip over each other; give each one its own copy of the project so both changes merge cleanly.',
      technical: 'Use git worktrees and separate branches per agent so parallel tasks can run builds and unit tests independently without dirtying the shared working tree.',
      engineer: 'Partition concurrent tasks along clean module and file-ownership boundaries in isolated git worktrees to minimize merge conflicts and cross-branch test contention.',
    },
    steps: [
      { id: 'three', label: 'Shared folder clashes' },
      { id: 'copies', label: 'One worktree each' },
      { id: 'more', label: 'How many?' },
    ],
    concepts: [
      { slug: 'worktree', label: 'Worktree' },
      { slug: 'branch', label: 'Branch' },
      { slug: 'parallel-work', label: 'Parallel work' },
    ],
  },
  {
    id: 'lead',
    n: 12,
    part: 2,
    title: 'A lead',
    short: 'Lead',
    line: 'One agent plans, briefs, checks and merges. The worker agents do the building.',
    theme: 'scale',
    adds: {
      plain: 'Instead of babysitting five helpers yourself, give one lead agent the goal and let it split the work, check the results and hand you one finished update.',
      technical: 'A stronger planning model decomposes the ticket, dispatches narrow tasks to worker models, enforces test/typecheck gates and merges clean diffs.',
      engineer: 'Separate orchestration (high-reasoning lead owning architecture, interface contracts and merge ordering) from execution (cheaper/faster workers on bounded modules).',
    },
    steps: [
      { id: 'roles', label: 'Lead + builders' },
      { id: 'shapes', label: 'Team shapes' },
      { id: 'gate', label: 'Check before main' },
      { id: 'reports', label: 'Short reports' },
    ],
    concepts: [
      { slug: 'orchestration', label: 'Orchestration' },
      { slug: 'subagent', label: 'Subagent' },
    ],
  },
  {
    id: 'fleet',
    n: 13,
    part: 2,
    title: 'Twenty in a loop',
    short: 'Fleet',
    line: 'A queue of jobs, a fleet of agents, and a strict check before main. You review what passes.',
    theme: 'scale',
    adds: {
      plain: 'At scale your job shifts from typing every instruction to picking the right jobs, trusting automated checks to filter junk, and reviewing finished results.',
      technical: 'Queue well-scoped tickets with explicit acceptance tests; let automated CI/type/test gates reject broken runs so human review only sees green diffs.',
      engineer: 'Throughput is governed by verification speed, merge-queue serialization and task decomposition—not raw agent count.',
    },
    steps: [
      { id: 'twenty', label: 'Twenty in a loop' },
      { id: 'nogate', label: 'Without a check' },
      { id: 'yours', label: 'Your real job' },
    ],
    concepts: [
      { slug: 'orchestration', label: 'Orchestration' },
      { slug: 'verification', label: 'Verification' },
    ],
  },

  // ---------- Part 3: The Working Week ----------
  {
    id: 'meter',
    n: 14,
    part: 3,
    title: 'What it costs',
    short: 'Cost',
    line: 'Every turn reads the whole window again: on the API that is a bill, on a plan an allowance that runs out.',
    theme: 'scale',
    adds: {
      plain: 'One made-up job counted turn by turn and priced: what it costs on the API with the cache on and off, and why a plan pauses instead of charging more.',
      technical: 'Input, cache reads, cache writes and output as separate counts, with the sum written out so you can redo it; what makes the cache miss.',
      engineer: 'Input that grows with the square of the turns, cache hit rate as a cost lever, and what twenty agents cost an hour on a plan or the API.',
    },
    steps: [
      { id: 'count', label: 'Every turn is counted' },
      { id: 'api', label: 'API prices' },
      { id: 'cache', label: 'The cache' },
      { id: 'plan', label: 'A plan' },
      { id: 'many', label: 'Twenty agents' },
    ],
    concepts: [
      { slug: 'token', label: 'Token' },
      { slug: 'prompt-caching', label: 'Prompt caching' },
      { slug: 'subscription-plan', label: 'Subscription plan' },
      { slug: 'usage-window', label: 'Usage window' },
    ],
  },
  {
    id: 'review',
    n: 15,
    part: 3,
    title: 'A second model',
    short: 'Review',
    line: 'One model builds, a different model in a fresh window tries to break it, and they go round until the real flaws are gone.',
    theme: 'quality',
    adds: {
      plain: 'The same chat checking itself misses what it got wrong. Hand the work to a different model, ask it to break it, and stop once the real flaws are fixed.',
      technical: 'Send the task and git diff to a reviewer in a fresh window with an adversarial brief, and cap it: only what breaks, three rounds at most.',
      engineer: 'A clean context and a different model make the reviewer’s misses less likely to match the builder’s; a stop rule bounds the spend; the loop runs before the pull request.',
    },
    steps: [
      { id: 'self', label: 'Checking itself' },
      { id: 'second', label: 'A second model' },
      { id: 'attack', label: 'Try to break it' },
      { id: 'rounds', label: 'A stop rule' },
      { id: 'how', label: 'Three ways to run it' },
    ],
    concepts: [
      { slug: 'review', label: 'Review' },
      { slug: 'diff', label: 'Diff' },
      { slug: 'limits-of-checking', label: 'Limits of checking' },
    ],
  },
  {
    id: 'proof',
    n: 16,
    part: 3,
    title: 'Proof you can read',
    short: 'Proof',
    line: 'Ask for proof with the work: a summary, the test run, a screenshot and a link, matched to the job.',
    theme: 'quality',
    adds: {
      plain: 'The check catches what a machine can see. Four cards on the tray show what only you can judge: is it what you asked for?',
      technical: 'Summary, tsc and npm test output, screenshots at stated widths and a preview link; a progress file for long jobs.',
      engineer: 'Proof as an output of every run, and the same cards in the pull request: the reviewer reads them before the diff.',
    },
    steps: [
      { id: 'word', label: '“Done” is one word' },
      { id: 'cards', label: 'Four cards' },
      { id: 'catch', label: 'Check and cards' },
      { id: 'during', label: 'While it runs' },
      { id: 'ask', label: 'Match the proof' },
    ],
    concepts: [
      { slug: 'definition-of-done', label: 'Definition of done' },
      { slug: 'browser-check', label: 'Browser check' },
      { slug: 'preview-deployment', label: 'Preview link' },
    ],
  },
  {
    id: 'turn',
    n: 17,
    part: 3,
    title: 'Your turn',
    short: 'Your turn',
    line: 'Where you step in: a plan before the build, a question during it, a note pinned on the result.',
    theme: 'quality',
    adds: {
      plain: 'Read a four-step plan before the build and change the step that guessed; answer a question while the rest is built; pin a note where you see the problem.',
      technical: 'A plan that names files and tests, questions that do not block, notes with the element they point at, and a dev-only review page writing to a notes file.',
      engineer: 'Plan review as design review, decisions taken off the critical path, and the same doors in a team’s pull request.',
    },
    steps: [
      { id: 'once', label: 'Speak once' },
      { id: 'plan', label: 'Read the plan' },
      { id: 'ask', label: 'Let it ask' },
      { id: 'pin', label: 'Point at the result' },
      { id: 'build', label: 'A review page' },
    ],
    concepts: [
      { slug: 'plan-mode', label: 'Plan mode' },
      { slug: 'queue-and-steer', label: 'Queue and steer' },
      { slug: 'giving-feedback', label: 'Giving feedback' },
    ],
  },
  {
    id: 'jobs',
    n: 18,
    part: 3,
    title: 'Several jobs',
    short: 'Jobs',
    line: 'Run multiple jobs at once across one project or several—while remembering there is still only one of you.',
    theme: 'scale',
    adds: {
      plain: 'Start a second job while the first one runs, but cap how many you juggle at once—and ask for clear proof so checking them doesn’t become a full-time bottleneck.',
      technical: 'Keep 2–3 isolated worktrees moving in parallel; use a simple status board (job name, test state, what it needs from you) so context-switching stays cheap.',
      engineer: 'Optimize for human review bandwidth, not idle GPU avoidance: cap WIP where your review latency keeps agents fed, and decouple independent repos from shared-codebase merge queues.',
    },
    steps: [
      { id: 'one', label: 'Waiting on one job' },
      { id: 'three', label: 'Start another' },
      { id: 'many', label: 'Only one of you' },
      { id: 'projects', label: 'One project vs several' },
      { id: 'board', label: 'A job board' },
    ],
    concepts: [
      { slug: 'parallel-work', label: 'Parallel work' },
      { slug: 'worktree', label: 'Worktree' },
      { slug: 'shortcuts', label: 'Shortcuts' },
    ],
  },
  {
    id: 'grow',
    n: 19,
    part: 3,
    title: 'The project grows',
    short: 'Growth',
    line: 'Every feature adds files and leftover code. Clean-ups and test-guarded refactors are real jobs too.',
    theme: 'quality',
    adds: {
      plain: 'As your app grows, leftover unused code slows every future job down—schedule a quick tidy-up pass every few features so the app stays easy to change.',
      technical: 'Dead files bloat context reads and confuse agents; run dedicated dead-code clean-ups and always require green typechecks + unit tests before and after any refactor.',
      engineer: 'Manage architectural entropy deliberately: separate behavioral changes from structural refactors, enforce module boundaries, and use regression suites as safety nets during extraction.',
    },
    steps: [
      { id: 'adds', label: 'Code piles up' },
      { id: 'junk', label: 'Dead code slows reads' },
      { id: 'clean', label: 'Clean-up as a job' },
      { id: 'refactor', label: 'Test-guarded refactors' },
    ],
    concepts: [
      { slug: 'test', label: 'Tests' },
      { slug: 'verification', label: 'Verification' },
      { slug: 'diff', label: 'Diff' },
    ],
  },
  {
    id: 'people',
    n: 20,
    part: 3,
    title: 'Other people',
    short: 'People',
    line: 'Pull requests, colleagues, clients and real users—small verified changes get fast feedback that drives the next job.',
    theme: 'scale',
    adds: {
      plain: 'Share small working updates with a live preview link instead of huge mystery changes—colleagues and clients reply faster, and their notes become your next prompt.',
      technical: 'Keep PRs small (<200 lines) with green CI, unit tests and screenshots attached; deploy preview links per branch so non-technical reviewers test real behavior, not code.',
      engineer: 'Treat human review attention as a scarce resource: slice changes along clean boundaries, attach automated proof and preview URLs, and close the loop from user telemetry/feedback into queued tickets.',
    },
    steps: [
      { id: 'pr', label: 'Pull requests' },
      { id: 'peer', label: 'Colleague review' },
      { id: 'client', label: 'Client previews' },
      { id: 'users', label: 'Real users' },
      { id: 'loop', label: 'Feedback into next job' },
    ],
    concepts: [
      { slug: 'pull-request', label: 'Pull request' },
      { slug: 'preview-deployment', label: 'Preview link' },
      { slug: 'sharing-privately', label: 'Sharing privately' },
    ],
  },
  {
    id: 'where',
    n: 21,
    part: 3,
    title: 'Other machines',
    short: 'Machines',
    line: 'Your laptop, a desktop PC or always-on box, the cloud—and your phone steering them from anywhere.',
    theme: 'scale',
    adds: {
      plain: 'Close your laptop lid and local jobs pause; run long jobs on a desktop PC that stays on or in the cloud, and check in or approve work from your phone.',
      technical: 'Match execution host to the job: laptop for interactive UI work, always-on desktop/home box for long test runs and remote phone control, cloud sandboxes (with setup scripts) for parallel background PRs.',
      engineer: 'Ensure environment parity across laptop, always-on workstation and ephemeral cloud containers (declarative setup scripts, seeded test DBs, isolated credentials) so any job can migrate cleanly.',
    },
    steps: [
      { id: 'laptop', label: 'On your laptop' },
      { id: 'lid', label: 'Close the lid' },
      { id: 'box', label: 'Desktop / always-on box' },
      { id: 'cloud', label: 'Cloud sandboxes' },
      { id: 'mix', label: 'Which job goes where' },
    ],
    concepts: [
      { slug: 'always-on-machine', label: 'Always-on machine' },
      { slug: 'deployment', label: 'Deployment' },
      { slug: 'secrets', label: 'Secrets' },
    ],
  },
];

export const rung = (id: string) => rungs.find((r) => r.id === id)!;
export const after = (id: string) => rungs[rungs.findIndex((r) => r.id === id) + 1];
export const partOf = (chapter: string): Part =>
  parts.find((p) => p.chapter === chapter) ?? parts[(rungs.find((r) => r.id === chapter)?.part ?? 1) - 1]!;
export const rungsOf = (part: 1 | 2 | 3) => rungs.filter((r) => r.part === part);
